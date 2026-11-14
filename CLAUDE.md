# CLAUDE.md · Kuravi (codinome iDoctor)

Marketplace de saúde: pacientes encontram quem atende o seu convênio por especialidade e solicitam horário; clínicas pagam por Solicitação Verificada e usam o Modo Encaixe. Leia `PRODUCT.md` e `docs/` antes de propor mudanças.

## Regras do projeto

- **Idioma:** documentação, copy e nomes de domínio em português do Brasil. Código em inglês, exceto termos do domínio já definidos (Solicitação Verificada = `request`, Modo Encaixe = `encaixe`).
- **Marca:** "Kuravi". "iDoctor" é só codinome do repositório. Nunca usar "iFood" ou outras marcas de terceiros em copy pública.
- **Stack:** Vite + React Router 7 + Tailwind v4 (site/portal), Directus (blog), n8n (formulários), NestJS (API), Flutter (app), PostgreSQL/PostGIS, Redis, MinIO, Elastic Stack, tudo no Coolify. O protótipo atual em `prototype/` é HTML/CSS/JS puro, sem build.
- **Dados de saúde são sensíveis (LGPD art. 11):** nunca logar corpo de requisição, CPF, telefone, e-mail, especialidade buscada ou documentos. Notificações nunca citam a especialidade.
- **Ética médica (CFM):** sem "melhor médico", promessas, descontos como chamariz ou % sobre honorários. Perfis exibem CRM/UF e RQE. Conteúdo pago leva o selo "Patrocinado".
- **Nada inventado:** sem depoimentos, logos de clientes, avaliações ou números de uso fictícios na interface. Números de negócio nos docs são hipóteses rotuladas.
- **n8n fora do caminho crítico:** agendamento, cobrança e notificações transacionais ficam na API.

## Skills instaladas

- `impeccable`: design, crítica, auditoria e polimento de frontend (leia `PRODUCT.md`/`DESIGN.md`).
- `ui-ux-pro-max`: base de estilos, paletas, tipografia e diretrizes de UX (`.claude/skills/ui-ux-pro-max/scripts/search.py`).
- `brand`: voz e identidade de marca.
