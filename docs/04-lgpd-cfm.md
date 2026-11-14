# 04 · LGPD, ética médica (CFM) e regulação

> ⚖️ **Não é parecer jurídico.** Mapa de requisitos para orientar produto e engenharia. Antes do lançamento: parecer de advogado especialista em direito médico e proteção de dados, e consulta formal ao CRM do estado piloto sobre o modelo de cobrança.

## 1. Normas de referência

| Norma | O que nos afeta |
|---|---|
| **LGPD** (Lei 13.709/2018) | Dado de saúde é **sensível** (art. 5º, II); bases legais do art. 11; direitos do titular (art. 18); segurança (art. 46); incidentes (art. 48); crianças e adolescentes (art. 14); encarregado (art. 41); RIPD (art. 38) |
| **Resoluções da ANPD** | Comunicação de incidente (Res. CD/ANPD nº 15/2024: em regra, **3 dias úteis**); encarregado (Res. nº 18/2024); transferência internacional (Res. nº 19/2024: cláusulas-padrão); agentes de pequeno porte (Res. nº 2/2022: o tratamento de dados sensíveis em escala tende a ser **alto risco**, o que afasta parte das simplificações) |
| **Código de Ética Médica** (Res. CFM 2.217/2018) | Art. 58 (mercantilismo), **Art. 59** (remuneração por paciente encaminhado), **Art. 72** (cartões de desconto), **Art. 73** (sigilo), regras de publicidade |
| **Publicidade médica** (Res. CFM 2.336/2023) | Identificação com nome, **CRM/UF e RQE** ao anunciar especialidade; clínica identifica o **diretor técnico**; proíbe sensacionalismo e promessa de resultado ⚖️ (conferir o texto vigente, inclusive sobre divulgação de valores e depoimentos) |
| **Prontuário** (Res. CFM 1.821/2007; Lei 13.787/2018) | Fora do MVP. Se um dia houver: certificação SBIS/CFM (NGS2) e guarda por 20 anos |
| **Telemedicina** (Res. CFM 2.314/2022; Lei 14.510/2022) | Fora do MVP |
| **ANS** (RN 566/2022, prazos máximos) | Contexto útil para o paciente: consulta básica em até 7 dias úteis e demais especialidades em até 14 dias úteis (conferir a norma vigente) |
| **Marco Civil da Internet** (Lei 12.965/2014, art. 15) | Guardar registros de acesso à aplicação por **6 meses** |
| **CDC** (Lei 8.078/1990) | Publicidade identificável (art. 36): selo "Patrocinado"; transparência de preços e taxas |

## 2. Papéis na LGPD

| Situação | Kuravi é | A clínica é |
|---|---|---|
| Conta do paciente, busca, solicitações, consentimentos, app | **Controladora** | — |
| Dados que a clínica recebe para atender o paciente | Controladora do envio (compartilhamento com base legal e informação clara) | **Controladora** do atendimento |
| Agenda, encaixe e pré-check-in operados **para a clínica** (SaaS) | **Operadora** | Controladora |
| Leads de clínicas (B2B) no site/n8n | Controladora | — |

Consequência: **contrato de tratamento de dados (DPA)** no aceite da clínica, com instruções, sub-operadores (hospedagem, push, WhatsApp, e-mail), segurança, incidentes e devolução/eliminação ao fim.

## 3. Inventário de dados (MVP)

| Dado | Finalidade | Base legal (proposta ⚖️) | Retenção | Quem vê |
|---|---|---|---|---|
| Nome, telefone, e-mail | Conta, contato, notificações | Execução de contrato (art. 7º, V) | Enquanto a conta existir + 6 meses | Paciente; clínica da solicitação |
| CPF (opcional no MVP) | Identificação na clínica | Execução de contrato / obrigação legal da clínica | Idem; **criptografado** | Clínica da solicitação |
| Operadora e plano | Filtrar quem atende | **Consentimento específico e destacado** (art. 11, I), por poder revelar condição de saúde em conjunto | Até a revogação | Clínica da solicitação |
| **Especialidade/exame buscado e solicitado** | Encontrar e agendar atendimento | **Consentimento específico e destacado** (art. 11, I); avaliar também a tutela da saúde (art. 11, II, *f*) para o fluxo com a clínica | Histórico de 5 anos ⚖️; buscas anônimas em 30 dias | Paciente; clínica da solicitação |
| Foto da carteirinha e documento (Fase 2) | Pré-check-in | Consentimento + instrução da clínica (operadora) | **Apagar 30 dias após a consulta**, salvo instrução da clínica | Só a clínica do agendamento |
| Localização aproximada | Busca por proximidade | Consentimento (permissão do SO) | Não armazenada; só a consulta | — |
| Registros de acesso (IP, data/hora) | Marco Civil, segurança | Obrigação legal (art. 7º, II) | 12 meses | Segurança |
| Leads de clínicas | Comercial B2B | Legítimo interesse / consentimento no formulário | 24 meses sem interação → excluir | Comercial |

## 4. Requisitos de produto (privacidade desde a concepção)

1. **Consentimento granular, separado e registrado:** termo de uso ≠ consentimento de dados de saúde ≠ marketing. Cada um com versão, data e canal (módulo `consent`). Revogar tem que ser tão fácil quanto aceitar.
2. **Central de privacidade no app:** ver, exportar (JSON/PDF), corrigir e excluir dados; histórico de consentimentos; **resposta completa em até 15 dias** (art. 19, II).
3. **Notificações que não expõem a especialidade:** push, SMS e e-mail dizem *"Você tem uma atualização na Kuravi"*. O detalhe só aparece dentro do app, autenticado. Pense no celular na mesa do trabalho com "Consulta com psiquiatra amanhã" na tela bloqueada.
4. **Mínimo para a clínica:** a clínica só vê pacientes que solicitaram a ela, e só os dados necessários.
5. **Menores:** dependente com menos de 18 anos é gerido pelo responsável legal, com consentimento do responsável (art. 14).
6. **Sem venda nem uso de dados de saúde para publicidade.** O "Destaque" é contextual (especialidade + região da busca), nunca baseado em histórico de saúde. Vedado compartilhar dados de saúde para vantagem econômica (art. 11, §4º) e, com operadoras, para seleção de riscos (art. 11, §5º).
7. **Cookies no site:** banner com categorias (necessários, analytics, marketing), **tudo negado por padrão** (Consent Mode do GA4, como no integriguard.tech), recusa com um clique.

## 5. Requisitos de engenharia (art. 46)

- Criptografia em trânsito e em repouso; criptografia de campo (CPF) e por envelope (documentos).
- MFA obrigatório para usuários de clínica e do backoffice.
- RBAC + RLS por clínica; **trilha de auditoria** de cada leitura de dado sensível (quem, o quê, quando, de onde).
- Logs sem dado pessoal ([03-observabilidade.md](03-observabilidade.md)).
- Backups cifrados e testados; plano de continuidade.
- Pentest antes do lançamento e a cada versão grande.
- Sub-operadores com cláusulas-padrão quando houver transferência internacional (ex.: Firebase/FCM, WhatsApp Cloud API): minimizar o conteúdo enviado (push genérico, sem especialidade).

## 6. Governança

| Item | Quando | Responsável |
|---|---|---|
| Nomear **encarregado (DPO)** e publicar o canal | Antes do lançamento | Fundadores |
| **RIPD** (Relatório de Impacto) | Antes do MVP público | DPO + engenharia |
| Registro das operações de tratamento (art. 37) | Contínuo (este documento é a semente) | DPO |
| **Plano de resposta a incidentes** (comunicar ANPD e titulares em 3 dias úteis) | Antes do lançamento | DPO + engenharia |
| Política de privacidade e termos (paciente e clínica) + DPA | Antes do lançamento | Jurídico |
| Treinamento de quem acessa dados (inclusive clínicas) | No onboarding | Sucesso do cliente |

## 7. Ética médica aplicada ao produto

| Regra | Como o produto cumpre |
|---|---|
| **Identificação profissional** | Perfil exibe nome, **CRM/UF** e **RQE** de cada especialidade anunciada; especialidade sem RQE não é exibida como especialidade. Clínica exibe o **diretor técnico** (nome + CRM). Verificação na consulta pública do CFM no cadastro e periodicamente |
| **Sem sensacionalismo nem promessa** | Nada de "o melhor", "garantido", "resultado em X dias" nos perfis; moderação e limites de texto |
| **Ranking honesto** | Ordem orgânica por critérios objetivos e públicos (convênio aceito, distância, próximo horário, tempo de resposta). Pago aparece **separado e com o selo "Patrocinado"** |
| **Sem mercantilismo** (art. 58/59) | Cobrança fixa por Solicitação Verificada (serviço de mídia/tecnologia), **nunca % do honorário** ([00-avaliacao-da-conversa.md](00-avaliacao-da-conversa.md)) ⚖️ |
| **Sem cartão de desconto** (art. 72) | Não existe "clube Kuravi" com desconto em consultas. Modo Encaixe vende **rapidez, não preço** |
| **Sigilo** (art. 73) | Notificações genéricas; acesso mínimo; auditoria |
| **Avaliações de pacientes** | No MVP, só sobre a **experiência de agendamento e atendimento administrativo** (pontualidade, recepção), nunca sobre resultado clínico; moderadas ⚖️ |
| **Fotos e casos clínicos** | Perfis não exibem pacientes nem "antes e depois" |

## 8. Checklist de lançamento (compliance)

- [ ] Parecer jurídico sobre o modelo de cobrança e consulta ao CRM
- [ ] Encarregado nomeado e canal publicado
- [ ] RIPD concluído
- [ ] Política de privacidade, termos e DPA publicados
- [ ] Consentimentos granulares implementados e testados
- [ ] Central de privacidade (exportar/excluir) funcionando
- [ ] Notificações genéricas revisadas em todos os canais
- [ ] Verificação de CRM/RQE ativa no cadastro
- [ ] Trilha de auditoria + alertas de acesso anômalo
- [ ] Pentest sem achados críticos ou altos em aberto
- [ ] Plano de incidentes testado (simulação)
- [ ] Retenção e expurgo automáticos configurados (n8n, logs, documentos)
