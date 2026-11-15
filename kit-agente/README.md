# Kit do agente · como levar este jeito de trabalhar para outro projeto

Este kit leva para outro repositório o método usado no Kuravi: as skills, as regras do `CLAUDE.md` e a sequência da Fase 0 (ideia → plano → nome e marca → protótipo). Só os exemplos são de saúde; o resto vale para qualquer ideia. Os modelos têm o sufixo `.modelo.md` para não serem lidos como instruções dentro deste repositório.

| Arquivo | O que fazer com ele |
|---|---|
| [`CLAUDE.modelo.md`](CLAUDE.modelo.md) | Copiar para a raiz do novo projeto como `CLAUDE.md` e preencher os `<…>` |
| [`PRODUCT.modelo.md`](PRODUCT.modelo.md) | Copiar para a raiz como `PRODUCT.md` e preencher (ou pedir `/impeccable init` para montar com você) |
| `../.claude/skills/` | Copiar a pasta inteira (impeccable, ui-ux-pro-max, brand; cerca de 6 MB) |

## Como aplicar (5 passos)

1. **Skills do repositório:** copie `.claude/skills/` deste repositório para `.claude/skills/` do novo.
   ```bash
   mkdir -p ../novo-projeto/.claude && cp -r .claude/skills ../novo-projeto/.claude/
   cp kit-agente/CLAUDE.modelo.md ../novo-projeto/CLAUDE.md
   cp kit-agente/PRODUCT.modelo.md ../novo-projeto/PRODUCT.md
   ```
2. **CLAUDE.md:** preencha nome, codinome, stack, lei de dados sensíveis, regras do setor e termos do domínio. Apague o que não se aplicar. Mantenha curto: o agente lê esse arquivo em toda sessão.
3. **PRODUCT.md:** preencha antes de qualquer trabalho de design. É o que a skill `impeccable` lê para saber público, posicionamento e restrições.
4. **.gitignore:** acrescente as linhas locais do impeccable:
   ```
   .impeccable/config.local.json
   .impeccable/questions/
   .impeccable/mocks/
   .impeccable/review/
   __pycache__/
   *.pyc
   ```
5. **Primeira sessão:** use o prompt inicial do fim deste arquivo.

Os **plugins** (lista abaixo) não precisam ser copiados: eles vêm da sua organização no claude.ai e aparecem em qualquer sessão da mesma conta. Se o outro projeto rodar em outra conta, instale os mesmos plugins pelo diretório de plugins (`/plugin`).

## Skills

### Do repositório (copiar `.claude/skills/`)

| Skill | Quando eu uso | O que ela lê |
|---|---|---|
| `impeccable` (v4.9.1, Apache 2.0) | Desenhar, criticar, auditar e polir qualquer interface; `init` monta o PRODUCT.md, `document` gera o DESIGN.md, `audit`/`critique`/`polish` revisam | `PRODUCT.md`, `DESIGN.md`, `.impeccable/surfaces/*.md` |
| `ui-ux-pro-max` | Escolher estilo, paleta, par de fontes e checar as 120 regras de UX e acessibilidade (Python 3: `scripts/search.py`) | Só os próprios dados |
| `brand` | Voz e tom, identidade visual, mensagens, checagem de consistência de marca e de assets | `docs/brand-guidelines.md`, tokens do projeto |

### Da conta (plugins sincronizados)

Agrupadas pelo momento em que eu recorro a cada uma. Neste repositório ainda não há código de servidor, então as de backend entram a partir da Fase 1.

| Momento | Skills |
|---|---|
| Estressar a ideia e pesquisar | `mattpocock-skills:grilling` (interrogar o plano), `mattpocock-skills:research`, `deep-research`, `mattpocock-skills:domain-modeling` (glossário e ADRs) |
| Decidir arquitetura | `engineering:system-design`, `engineering:architecture` (ADR), `backend-design:boring-by-default` |
| Antes de escrever backend | `backend-design:think-before-coding` (obrigatória), `data-modeling-discipline`, `auth-and-authorization`, `idempotency-and-side-effects`, `error-handling-as-design`, `observability-by-default`, `security-discipline`, `migration-safety`, `query-discipline`, `performance-and-scaling` |
| Testar e depurar | `mattpocock-skills:tdd`, `backend-design:testing-with-discernment`, `engineering:testing-strategy`, `engineering:debug`, `mattpocock-skills:diagnosing-bugs`, `backend-design:debugging-discipline` |
| Revisar e entregar | `code-review`, `simplify`, `security-review`, `engineering:deploy-checklist`, `engineering:documentation` |
| Stack e formatos | `elastic:*` (se a observabilidade for Elastic/Kibana), `modern-web-guidance`, `dataviz` (gráficos e dashboards), `pdf` (manual de marca para aprovação), `obsidian-notes` (se os docs virarem vault) |
| Escrever para agentes | `mattpocock-skills:writing-for-agents` (ao editar CLAUDE.md ou skills), `skill-creator` |

O plugin `security-guidance` não tem skill para chamar: ele age sozinho, avisando sobre padrões inseguros nas edições.

## Como eu trabalho

### 1. Ler antes de propor

Ordem: `CLAUDE.md` → `PRODUCT.md` → `docs/` → `DESIGN.md`. Nenhuma mudança é proposta sem ler o que já foi decidido. Pergunto só o que é decisão do dono (nome, preço, aprovação de marca); no resto escolho o padrão sensato e digo qual foi.

### 2. Avaliar a ideia com honestidade

O primeiro documento (`docs/00`) sempre segue esta estrutura:

1. **O que foi proposto:** tabela quem / proposta / intenção.
2. **O que acerta:** reconhecer o que é bom antes de criticar.
3. **Onde estão os riscos:** regulatório primeiro, depois de receita e de operação.
4. **Recomendação com nome próprio** (no Kuravi: "Solicitação Verificada"), com o evento de cobrança, a escada de monetização e o discurso de venda.
5. **Conta de padaria** rotulada como hipótese ("não são dados reais").
6. **O que validar** e **decisões pendentes**.

Se a ideia tem um risco sério, eu digo e proponho uma alternativa concreta. Concordar por educação não ajuda o projeto.

### 3. Sequência da Fase 0 (um commit por entrega)

| # | Entrega | Onde | Conteúdo |
|---|---|---|---|
| 1 | Avaliação da ideia | `docs/00` | Estrutura do item 2 |
| 2 | Produto | `docs/01` | Visão, problema com "evidência a coletar", personas, proposta de valor, diferenciais, escopo do MVP, jornadas, métricas, piloto, go-to-market, concorrência |
| 3 | Arquitetura | `docs/02` | Princípios, stack, visão geral, módulos, modelo de dados, infraestrutura, segurança |
| 4 | Observabilidade | `docs/03` | Logs, métricas, traces, alertas, SLOs, retenção, regra de zero dado sensível em log |
| 5 | Regulação e privacidade | `docs/04` | Normas, papéis, inventário de dados, requisitos de produto e de engenharia, checklist de lançamento |
| 6 | Roadmap | `docs/05` | Fases com status ✅/⏳, critérios de saída numéricos, próximas decisões |
| 7 | Nome e marca | `docs/06` | Por que não o codinome, candidatos, domínios, busca no INPI (ação manual sua) |
| 8 | Identidade visual | `brand/` | Estudos (descartados ficam guardados), SVGs, tokens com contraste medido, manual HTML → PDF para aprovação |
| 9 | Registro de produto e design | raiz | `PRODUCT.md` antes de desenhar; `DESIGN.md` só depois da aprovação, com data e quem aprovou |
| 10 | Protótipo | `prototype/` | HTML/CSS/JS puro, sem build; formulários em "modo protótipo" que mostram o payload em vez de enviar |

O `README.md` da raiz é o índice: fase atual, tabela dos documentos, estrutura do repositório e stack.

### 4. Regras de conteúdo

- **Nada inventado:** sem depoimentos, logos de clientes, avaliações, números de uso ou preços. Dado de demonstração é rotulado como fictício, e o README do protótipo tem a seção "O que é fictício (trocar antes de publicar)".
- **Hipóteses rotuladas:** todo número de negócio diz que é hipótese.
- **⚖️ marca o que precisa de advogado**, e o documento avisa que não é parecer jurídico.
- **Compliance como diferencial:** a regra do setor vira argumento de produto, não nota de rodapé.
- **Privacidade por padrão:** o `CLAUDE.md` lista o que nunca vai para log, notificação ou anúncio.
- **Marcas de terceiros** ("o iFood da saúde") ficam só no material interno, nunca na copy pública.
- **Decisões registradas** com data e quem aprovou.

### 5. Vieses de arquitetura

- Tecnologia chata por padrão: qualquer peça nova precisa se defender contra a alternativa simples.
- Automação no-code (n8n, Zapier) fica fora do caminho crítico: o que cobra, agenda ou notifica mora na API.
- O navegador não fala direto com o webhook: uma rota própria valida, limita envios, assina com HMAC e só então repassa.
- Observabilidade e segurança entram no primeiro serviço, não depois.
- Decidir o código pensando no MVP, com a fase seguinte em vista, sem construir a fase seguinte agora.

### 6. Design

- `PRODUCT.md` primeiro. Cada superfície ganha um brief em `.impeccable/surfaces/` com tese, mundo visual próprio, história, primeira dobra e uma interação-assinatura.
- Recusar o padrão da categoria (no Kuravi: foto de médico sorrindo, gradiente azul, três cards iguais) e achar um mundo próprio (sinalização hospitalar).
- Tokens com contraste medido (WCAG 2.2 AA), alvos de toque grandes, nada que dependa só de cor.
- Um único momento autoral de movimento; o resto responde à ação do usuário; `prefers-reduced-motion` desliga tudo.
- Verificar olhando: capturas do resultado no celular e no desktop antes de dar como pronto.
- Aprovação humana antes de virar `DESIGN.md`.

### 7. Escrita

- Português do Brasil, frases curtas, voz ativa, sem jargão nem exagero.
- Documentos numerados `NN · Título`, abrindo com uma linha de contexto.
- Tabela para comparar opções; negrito só na decisão.
- Código em inglês; termos do domínio mapeados no `CLAUDE.md` (no Kuravi: Solicitação Verificada = `request`, Modo Encaixe = `encaixe`).

### 8. Git

- Um commit por entregável, com mensagem `área: resumo` em português (`docs:`, `brand:`, `prototype:`, depois `api:`, `site:`, `app:`) e um corpo de 2 a 5 linhas dizendo o que entrou e por quê.
- Trabalho num branch; pull request só quando você pedir.

### 9. Fechar cada entrega

Ao terminar digo o que foi feito, o que depende de ação manual sua (registrar domínio, buscar no INPI, falar com advogado), o que é fictício e quais são as próximas decisões. Se um teste falhou ou um passo ficou de fora, digo isso.

## Prompts para a nova ideia

**Primeira sessão:**

```
Leia o CLAUDE.md. Estamos na Fase 0 de <NOME>.
A ideia (ou a conversa sobre ela) é esta: <colar>.
1) Escreva docs/00 avaliando a ideia com honestidade: o que acerta,
   riscos, recomendação, conta de padaria como hipótese, o que validar
   e decisões pendentes.
2) Depois escreva docs/01 a 05 (produto, arquitetura, observabilidade,
   regulação e privacidade, roadmap), o README como índice e o PRODUCT.md.
Faça um commit e me mostre antes de partir para nome e marca.
```

**Depois, um por sessão:**

1. `Pesquise nomes e domínios para <NOME> e escreva docs/06 com candidatos, domínios livres e o passo a passo do INPI.`
2. `Use as skills brand e impeccable para criar a identidade visual v1: estudos, símbolo em SVG, tokens com contraste medido e um PDF para aprovação.`
3. `Com /impeccable, faça o protótipo da landing em HTML/CSS/JS puro, com a identidade aprovada, e gere o DESIGN.md.`
