# Marca Kuravi · identidade visual v1

- **Canvas (Design do Claude):** https://claude.ai/artifact/WKD3i3J16ujv5Brpy1Ubij (privado; compartilhe pelo menu Share)
- **PDF para aprovação:** [kuravi-identidade-visual-v1.pdf](kuravi-identidade-visual-v1.pdf)

## Símbolo

Cápsula (medicina, cura) atravessada por um batimento (vida). A linha que atravessa é o caminho direto até o atendimento, como a faixa colorida no chão do hospital.

| Arquivo | Uso |
|---|---|
| `kuravi-simbolo.svg` | Principal, fundos claros |
| `kuravi-simbolo-negativo.svg` | Fundos azul-noite e fotos escuras |
| `kuravi-simbolo-mono-escuro.svg` / `-mono-claro.svg` | Uma cor (carimbo, impressão econômica, sobre coral) |
| `kuravi-app-icon.svg` | Ícone do app (1024 × 1024) |
| `kuravi-logo-horizontal.svg` | Símbolo + "kuravi" (precisa da fonte Signika instalada; para impressão, converter o texto em curvas) |

Tamanho mínimo: 24 px na tela, 8 mm impresso. Área de respiro: no mínimo a largura da cápsula em volta.

Histórico de estudos (folha, cruz de cápsulas, cápsula-K, pulso) em [`estudos/`](estudos/).

## Cores (sem verde)

Decisão: **o verde sai do logo e do sistema de design**. Ele aparece só onde for indispensável: o status "Confirmado".

| Token | Hex | Uso | Contraste |
|---|---|---|---|
| `coral-pulso` | `#FF5A3C` | Cor da marca: botões, destaques, Modo Encaixe | Texto azul-noite em cima: 4,9:1 · nunca texto pequeno coral sobre claro (2,9:1) |
| `azul-noite` | `#14254A` | Âncora: texto, títulos, fundos de confiança | Sobre a parede: 13,9:1 |
| `coral-forte` | `#C8341A` | Links, erros, texto coral | Sobre a parede: 4,9:1 · texto branco em cima: 5,3:1 |
| `amarelo-sinal` | `#FFC93C` | Só linhas-guia e avisos | Azul-noite em cima: 9,8:1 |
| `parede` | `#F4F6FA` | Fundo das telas | — |
| `branco` | `#FFFFFF` | Cartões | — |
| `nevoa` | `#E3E8F0` | Bordas e divisórias | — |
| `texto-suave` | `#4B5A73` | Texto secundário | Sobre a parede: 6,5:1 |
| `azul-claro` | `#C9D6F0` | Texto secundário sobre azul-noite | 10,3:1 |
| `sucesso` | `#1D7F55` | **Uso restrito:** status "Confirmado" | Texto branco em cima: 5,0:1 |

## Tipografia

- **Signika** (500/600/700): títulos e logotipo. Criada para sinalização e wayfinding.
- **Atkinson Hyperlegible Next** (400/700): textos, formulários e app. Máxima legibilidade (Braille Institute).

## Regenerar o PDF

```bash
python3 manual/build.py <pasta-do-canvas>/project   # gera manual/manual.html
NODE_PATH=$(npm root -g) node manual/pdf.js         # gera kuravi-identidade-visual-v1.pdf
```
