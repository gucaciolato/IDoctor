# 03 · Observabilidade: logs, métricas, traces e Kibana

## Objetivo

Responder, às 3 da manhã e sem SSH: **o que quebrou, para quem, desde quando e por quê**, sem expor dados de saúde nos logs.

## Componentes (Elastic Stack 9.x no `srv-obs`)

| Componente | Função |
|---|---|
| **Elasticsearch** | Armazena logs, métricas, traces e trilha de auditoria em *data streams* |
| **Kibana** | Dashboards, Discover, alertas, SLOs, Spaces por equipe |
| **Fleet Server + Elastic Agent** | Coleta logs dos containers do Coolify, métricas de host, PostgreSQL, Redis e Caddy |
| **APM / OpenTelemetry** | Traces da API NestJS e dos workers via **EDOT Node.js** (distribuição OpenTelemetry da Elastic) |
| **Synthetics** (local privado) | Monitores de disponibilidade: site, API `/health`, portal, n8n, Directus |
| **Elastic Security** (regras básicas) | Detecção: força bruta, abuso de OTP, exportação em massa, acesso fora do horário |

Requisitos do servidor: `vm.max_map_count=262144`, heap da JVM em ~50% da RAM, segurança nativa ligada (TLS + usuários), **snapshots diários** no MinIO.

## Instrumentação por serviço

| Serviço | Logs | Métricas | Traces |
|---|---|---|---|
| API NestJS | `nestjs-pino` + `@elastic/ecs-pino-format` (JSON ECS) com `trace.id`/`span.id` | RED por rota (taxa, erros, duração) via OTel | EDOT Node.js: HTTP, Prisma/pg, Redis, BullMQ, chamadas externas |
| Workers BullMQ | Mesmo logger; `job.id`, `queue`, `attempt` | Tamanho da fila, tempo de espera, falhas | Span por job, ligado ao trace de origem |
| Site / Portal (SSR) | JSON no stdout | Web Vitals agregados (sem dados pessoais) | OTel no servidor SSR |
| n8n | stdout + *error workflow* → índice `logs-n8n` (sem o conteúdo do formulário) | `/metrics` (Prometheus) coletado pelo Agent | — |
| Directus | stdout | Saúde do serviço | — |
| PostgreSQL | Logs de consultas lentas (> 500 ms), sem parâmetros | Integração Postgres do Agent | — |
| Caddy (Coolify) | Access log JSON | Integração do Agent | — |
| App Flutter | Crashlytics (falhas) | Eventos de produto → API `/v1/telemetry` → `logs-app-mobile` | `traceparent` propagado nas chamadas à API |

## Regra de ouro: zero dado sensível em log

1. **Redação na origem:** `pino` com `redact` para `req.headers.authorization`, `*.cpf`, `*.telefone`, `*.email`, `*.carteirinha`, `*.documento`, `*.otp`, `body`.
2. **Redação no pipeline:** *ingest pipeline* no Elasticsearch com o processador `redact` (padrões de CPF, e-mail, telefone e cartão) como segunda barreira.
3. **IDs pseudônimos:** logs usam `patient.pid` (hash com sal rotacionável), nunca nome ou CPF.
4. **Especialidade não vai para log de acesso:** rotas usam IDs (`/requests/{id}`), não `?especialidade=psiquiatria`.
5. **Corpo de requisição nunca é logado.** Erros de validação logam o *nome* do campo, não o valor.

## Retenção (ILM)

| Data stream | Quente | Morno | Exclusão | Motivo |
|---|---|---|---|---|
| `logs-app-*` | 7 dias | 30 dias | 90 dias | Depuração |
| `logs-access-*` (Caddy/API) | 7 dias | 60 dias | **12 meses** | Marco Civil da Internet (art. 15) exige ao menos **6 meses** para registros de acesso a aplicações |
| `traces-*` | 7 dias | — | 14 dias | Volume alto, valor de curto prazo |
| `metrics-*` | 30 dias | 90 dias | 13 meses | Comparação ano a ano |
| `logs-audit-*` | 30 dias | 1 ano | **5 anos** ⚖️ | Defesa em processos (prazo prescricional do CDC); acesso restrito ao DPO e à segurança |
| `logs-security-*` | 30 dias | 1 ano | 2 anos | Investigação de incidentes |

A trilha de auditoria também fica em tabela *append-only* no PostgreSQL (fonte da verdade); o Elastic é a visão consultável.

## Kibana: Spaces, papéis e dashboards

| Space | Quem acessa | Conteúdo |
|---|---|---|
| **Operações** | Dev/Ops | Saúde dos serviços, filas, erros, deploys |
| **Produto** | Fundadores, produto | Funil e métricas de negócio **agregadas** (sem dados pessoais) |
| **Segurança & LGPD** | DPO, segurança | Auditoria, acessos a dados sensíveis, pedidos de titulares, detecções |

Papéis com **segurança em nível de campo** (field-level security): no Space Produto, campos `patient.*` ficam invisíveis.

### Dashboards iniciais

1. **Visão geral da API:** taxa, erro e latência p50/p95/p99 por rota; status por versão de deploy.
2. **Funil de solicitações:** buscas → perfis vistos → solicitações → aceitas → confirmadas → realizadas; tempo de resposta da clínica.
3. **Modo Encaixe:** vagas abertas, ondas enviadas, tempo até preencher, taxa de preenchimento.
4. **Créditos e cobrança:** débitos/dia, contestações, saldo baixo por clínica, estornos.
5. **Notificações:** entregas e falhas por canal (push, WhatsApp, e-mail), latência do outbox.
6. **n8n:** execuções por fluxo, falhas, leads de clínicas por origem/UTM.
7. **Infraestrutura:** CPU/memória/disco por servidor, PostgreSQL (conexões, consultas lentas, replicação), Redis.
8. **Segurança & LGPD:** logins falhos, OTP por telefone/IP, acessos a documentos, exportações, pedidos de titulares e prazos.

## Alertas (Kibana → e-mail/Slack/WhatsApp de plantão)

| Alerta | Condição | Severidade |
|---|---|---|
| API fora do ar | Synthetics falha 2× seguidas | Crítica |
| Taxa de erro 5xx | > 2% por 5 min | Alta |
| Latência da busca | p95 > 800 ms por 10 min | Média |
| Fila do outbox parada | Mensagem mais antiga > 2 min | Alta |
| Solicitação sem resposta | > 2 h em horário comercial | Média (avisa a clínica e o sucesso do cliente) |
| Abuso de OTP | > 5 códigos/telefone/hora ou > 50/IP/hora | Alta |
| Acesso anômalo a documentos | Usuário de clínica abre > 30 documentos/hora | Alta (DPO) |
| Falha de backup/snapshot | Não concluído em 24 h | Alta |
| Disco | > 80% em qualquer servidor | Média |
| Fluxo n8n falhando | > 3 falhas/15 min | Média |

## SLOs iniciais

| Serviço | SLI | Objetivo (30 dias) |
|---|---|---|
| API | Requisições bem-sucedidas (não 5xx) | 99,5% no MVP → 99,9% |
| Busca | p95 < 800 ms | 95% das janelas de 5 min |
| Solicitação | Criada e entregue à clínica em < 10 s | 99% |
| Notificações | Push/WhatsApp entregues em < 60 s | 98% |

Alertas de **burn rate** (consumo do orçamento de erro) em vez de limites fixos, assim que houver tráfego estável.

## Healthchecks

- `GET /health/live`: o processo responde.
- `GET /health/ready`: Postgres, Redis e MinIO acessíveis (com timeout curto). O Coolify usa este para o deploy *zero-downtime*.
