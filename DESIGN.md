# Design · Kuravi

Sistema visual v1, **aprovado por Gu e Bruno em 15/11/2026**. Fonte da verdade dos tokens: [`brand/README.md`](brand/README.md). Implementação de referência: [`prototype/assets/css/styles.css`](prototype/assets/css/styles.css).

## Mundo

**Sinalização hospitalar.** Placas azul-noite com texto branco, faixas coloridas no chão (a linha-guia) que levam a pessoa ao destino, marcos numerados numa rota. A Kuravi é o caminho mais curto até o atendimento; a interface age como a sinalização que guia.

- Claro como padrão: recepção de clínica e celular durante o dia.
- **Sem verde.** Coral-pulso conduz, azul-noite sustenta. Verde (`#1D7F55`) só no status "Confirmado".
- Amarelo-sinal só em linhas-guia, progresso e avisos. Nunca em texto sobre claro.

## Tokens

| Papel | Token | Valor |
|---|---|---|
| Ação primária, marca | `--coral` | `#FF5A3C` (texto em cima: `--noite`) |
| Texto/links coral, erro | `--coral-forte` | `#C8341A` |
| Texto, títulos, placas | `--noite` | `#14254A` |
| Linha-guia, avisos | `--amarelo` | `#FFC93C` |
| Fundo | `--parede` | `#F4F6FA` |
| Superfície | `--branco` | `#FFFFFF` |
| Bordas | `--nevoa` | `#E3E8F0` |
| Borda de campo (≥ 3:1) | `--borda-campo` | `#6B7891` |
| Texto secundário | `--suave` | `#4B5A73` |
| Texto sobre azul-noite | `--azul-claro` | `#C9D6F0` |
| Confirmado (restrito) | `--sucesso` | `#1D7F55` |

Tipografia: **Signika** 500/600/700 (títulos, logotipo, botões) e **Atkinson Hyperlegible Next** 400/700 (texto, campos). Corpo 17 px / 1,6. Títulos com `text-wrap: balance`; números de horário com `tabular-nums`.

Raios: 16 px (cartões), 12 px (botões), 10 px (campos), 999 px (pílulas). Sombra com deslocamento e desfoque (`--sombra`), nunca halo colorido nem sombra dura.

## Componentes

- **Botão:** coral (primário, texto azul-noite), noite (secundário forte), contorno. Altura mínima 52 px (44 px no pequeno).
- **Placa:** cartão azul-noite com seta, usada nas paradas da rota.
- **Linha-guia:** três faixas de 8 px (noite, coral, amarelo) que entram pela borda; também a linha da rota e o progresso (ondas do Modo Encaixe, linha do tempo da solicitação).
- **Solicitação verificada:** cartão com borda coral, selo "WhatsApp verificado" azul-noite, código `KV-XXXX`, dados em três colunas, ações aceitar/propor.
- **Slot de agenda:** pílula névoa (ocupado), coral (vaga aberta/encaixe), contorno verde + selo (confirmado).
- **Campos:** rótulo sempre visível, erro abaixo do campo ligado por `aria-describedby`, resumo de erros no topo com links e foco.
- **Chips:** seleção múltipla; marcado = azul-noite.
- **Cookies:** opcionais começam negados; recusar tem o mesmo peso que aceitar.

## Movimento

Um único momento autoral: a solicitação chegando e a linha-guia sendo traçada no herói. O resto responde à ação do usuário (simulador do Encaixe). Saída exponencial (`cubic-bezier(.16,1,.3,1)`), conteúdo visível por padrão, `prefers-reduced-motion` desliga tudo.

## Regras de conteúdo

Sem depoimentos, logos de clientes, números de uso ou preços inventados. Dados de demonstração sempre rotulados como fictícios. Copy segue as regras do CFM (sem superlativos, promessas ou descontos) e nunca revela especialidade em notificações.
