# Kuravi · codinome iDoctor

> Pacientes encontram quem **realmente atende o seu convênio** naquela especialidade e marcam em minutos. Clínicas ganham pacientes novos **sem mensalidade** e preenchem horários vagos com o **Modo Encaixe**.

Fase atual: **0 · Ideia, marca e validação.** Veja o [roadmap](docs/05-roadmap.md).

## Documentos

| # | Documento | Conteúdo |
|---|---|---|
| 00 | [Avaliação da conversa](docs/00-avaliacao-da-conversa.md) | Análise do modelo "sem mensalidade / por contato / comissão" e a recomendação **Solicitação Verificada** |
| 01 | [Produto](docs/01-produto.md) | Visão, personas, MVP, jornadas, métricas, critérios da cidade piloto, go-to-market |
| 02 | [Arquitetura](docs/02-arquitetura.md) | Site (Vite + React Router 7 + Directus + n8n), API NestJS, app Flutter, Coolify |
| 03 | [Observabilidade](docs/03-observabilidade.md) | Elastic Stack + Kibana: logs, traces, métricas, alertas, SLOs, retenção |
| 04 | [LGPD e CFM](docs/04-lgpd-cfm.md) | Dados sensíveis, bases legais, ética médica, checklist de lançamento |
| 05 | [Roadmap](docs/05-roadmap.md) | Fases 0 a 3 e próximas decisões |
| 06 | [Marca e nome](docs/06-marca-e-nome.md) | Por que não "iDoctor", candidatos, domínios, passo a passo do INPI |
| — | [PRODUCT.md](PRODUCT.md) | Registro de produto usado pelas skills de design |

## Estrutura do repositório

```
.
├── docs/              # planejamento
├── brand/             # identidade visual: logo SVG, PDF v1, manual
├── prototype/         # protótipo do site em HTML/CSS/JS puro
└── .claude/skills/    # impeccable, ui-ux-pro-max, brand
```

Futuro (Fase 1): `apps/site` (Vite + React Router 7), `apps/portal`, `apps/api` (NestJS), `apps/mobile` (Flutter), `infra/` (Coolify, Elastic).

## Stack

Vite + React Router 7 + Tailwind v4 · Directus · n8n · SMTP leve · NestJS · Flutter · PostgreSQL/PostGIS · Redis · MinIO · Elastic Stack/Kibana · tudo no Coolify.
