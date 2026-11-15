# CLAUDE.md · <NOME> (codinome <CODINOME>)

<Uma frase: quem usa, o que resolve e como o negócio ganha dinheiro.> Leia `PRODUCT.md` e `docs/` antes de propor mudanças.

Fase atual: **<0 · Ideia, marca e validação>**. Roadmap em `docs/05-roadmap.md`.

## Como trabalhar

- **Leia antes de propor:** `CLAUDE.md` → `PRODUCT.md` → `docs/` → `DESIGN.md`.
- **Seja crítico:** se uma ideia tem risco regulatório, de negócio ou técnico, diga e proponha uma alternativa concreta.
- **Decida o que tem padrão sensato** e diga qual escolheu. Pergunte só o que é decisão do dono (nome, preço, aprovação de marca).
- **Um commit por entregável:** `área: resumo em pt-BR` (`docs:`, `brand:`, `prototype:`, `api:`, `site:`…) e um corpo curto com o quê e por quê. Pull request só quando pedido.
- **Verifique interface olhando:** capturas no celular e no desktop antes de dar como pronto.
- **Feche cada entrega** dizendo o que ficou pendente (ação manual), o que é fictício e quais são as próximas decisões.

## Regras do projeto

- **Idioma:** documentação, copy e nomes de domínio em português do Brasil. Código em inglês, exceto os termos do domínio da tabela abaixo.
- **Marca:** "<NOME>". "<CODINOME>" é só codinome do repositório. Nunca usar marcas de terceiros em copy pública (comparações tipo "o X do Y" ficam no material interno).
- **Stack:** <front · back · app · banco · infra>. Tecnologia chata por padrão: peça nova precisa de justificativa. O protótipo em `prototype/` é HTML/CSS/JS puro, sem build.
- **Dados sensíveis (<lei e artigo, ex.: LGPD art. 11>):** nunca logar corpo de requisição, CPF, telefone, e-mail <e o que mais for sensível neste domínio>. Notificações nunca citam <o dado que expõe a pessoa>.
- **Regras do setor (<órgão ou norma>):** <o que a copy não pode dizer, que tipo de cobrança é proibida, o que o perfil precisa exibir>. Conteúdo pago leva o selo "Patrocinado".
- **Nada inventado:** sem depoimentos, logos de clientes, avaliações ou números de uso fictícios na interface. Dado de demonstração é rotulado como fictício. Números de negócio nos docs são hipóteses rotuladas.
- **⚖️ = validar com advogado.** Documentos com análise jurídica avisam que não são parecer.
- **Automação no-code fora do caminho crítico:** <cobrança, agendamento, notificações transacionais> ficam na API.

## Termos do domínio

| Termo (pt-BR) | No código |
|---|---|
| <Termo principal do produto> | `<termo_em_ingles>` |
| <Outro termo> | `<outro>` |

## Estrutura

```
docs/        00 avaliação · 01 produto · 02 arquitetura · 03 observabilidade
             04 regulação e privacidade · 05 roadmap · 06 marca e nome
brand/       identidade visual: SVGs, estudos, manual, PDF aprovado
prototype/   protótipo HTML/CSS/JS
PRODUCT.md   registro de produto (lido pelas skills de design)
DESIGN.md    sistema visual aprovado (só depois da aprovação)
```

## Skills instaladas

- `impeccable`: design, crítica, auditoria e polimento de frontend (lê `PRODUCT.md`/`DESIGN.md`).
- `ui-ux-pro-max`: base de estilos, paletas, tipografia e diretrizes de UX (`.claude/skills/ui-ux-pro-max/scripts/search.py`).
- `brand`: voz e identidade de marca.
- Plugins da conta: use `backend-design:think-before-coding` antes de qualquer código de servidor; `code-review` e `security-review` antes de dar uma mudança como pronta.
