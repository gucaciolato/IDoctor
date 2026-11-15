# Prompt: criar o sistema de design de um projeto (método Kuravi)

Cole no Claude Code, na raiz do repositório do novo projeto, e preencha os campos entre colchetes.

---

**Projeto:** [nome ou codinome]
**O que é:** [uma frase: o que faz e para quem]
**Quem precisa agir primeiro no site/app:** [público principal]
**Restrições já decididas:** [cores proibidas ou obrigatórias, fontes, referências, stack, projeto de referência]
**Onde montar o design:** [Design do Claude | Canva | só arquivos no repositório]

Você vai criar o sistema de design deste projeto, do zero até um protótipo aprovado. Trabalhe em fases, faça commit ao fim de cada uma e pare para eu decidir nos pontos marcados com 🛑. Escreva tudo em português do Brasil.

## Fase 0 · Preparar

1. Verifique se as skills `impeccable` e `ui-ux-pro-max` existem em `.claude/skills/`. Se não existirem, clone `github.com/pbakaus/impeccable` e `github.com/nextlevelbuilder/ui-ux-pro-max-skill` numa pasta temporária e copie para o projeto as pastas `.claude/skills/impeccable`, `.claude/skills/ui-ux-pro-max` e `.claude/skills/brand`. Leia o `SKILL.md` de cada uma antes de usar.
2. Se houver projeto de referência, descubra a stack e os padrões reais (framework, CSS, fontes, formulários, cabeçalhos de segurança, consentimento de cookies) lendo o código ou os arquivos do site publicado. Não suponha.

## Fase 1 · A verdade do produto antes de qualquer visual

- Escreva `PRODUCT.md` no formato do `impeccable init`: usuários, propósito, posicionamento, contexto de uso, capacidades e restrições, compromissos de marca, evidências disponíveis, princípios e acessibilidade. Nada de cores ou fontes aqui.
- Registre o que **não** existe (depoimentos, clientes, números, preços) para que nenhuma tela invente.
- Regras do setor que afetam copy e interface (em saúde: CFM e LGPD) vão para o `CLAUDE.md` como regras do projeto.

## Fase 2 · Nome 🛑

- Antes de desenhar o logo, verifique o nome:
  - domínios `.com.br` (RDAP do registro.br), `.com` e `.app`;
  - marcas parecidas no mesmo segmento (busca na web; a busca do INPI pode ser manual se o acesso for bloqueado);
  - conotações ruins em português.
- Se não estiver livre, proponha nomes inventados a partir de raízes do universo do produto. O nome não precisa descrever o produto. Entregue 3 ou 4 finalistas com os domínios confirmados e pergunte qual seguir.

## Fase 3 · Mundo visual

Siga o `impeccable` (`reference/new-work.md` e `reference/new-work-world.md`):

1. Em uma frase cada:
   - o mecanismo único do produto;
   - a cena real de uso: quem usa, onde e sob que luz;
   - o que a primeira tela precisa provar.
2. Liste 7 sistemas visuais concretos do mundo do público: objetos, placas, impressos, rituais e interfaces que ele conhece de cor. Eles precisam vir de pelo menos 3 famílias de material. Descarte o "padrão da categoria" e o oposto previsível dele.
3. Escolha o mundo que melhor carrega o mecanismo. Exemplo da Kuravi: a sinalização hospitalar, porque a faixa colorida no chão leva o paciente ao destino, como o produto leva ao horário.
4. Evite os visuais padrão de IA:
   - fundo creme com serifa e terracota;
   - preto com neon;
   - editorial com serifa itálica e fonte mono;
   - neobrutalismo.

   Também não use como voz principal, sem motivo forte: Inter como título, Space Grotesk, Playfair, Fraunces, DM Sans, Plus Jakarta e Outfit.
5. Rode `python3 .claude/skills/ui-ux-pro-max/scripts/search.py "<tipo de produto> <setor>" --design-system`. Use o resultado como insumo, não como ordem: descarte o que prejudica a acessibilidade ou inventa prova social.

## Fase 4 · Logo 🛑

1. Derive o símbolo do significado do nome e do setor. Exemplo: Kuravi = cura + vida, que virou uma cápsula atravessada por um batimento.
2. Desenhe em SVG à mão, com paths simples, 3 ou 4 estudos bem diferentes. Para cada um, renderize com Playwright uma folha de teste com:
   - símbolo grande;
   - logotipo horizontal no claro e no escuro;
   - ícone do app;
   - tamanhos de 64, 32, 24 e 16 px;
   - versão em uma cor.
3. Critique o render antes de mostrar:
   - se ainda se lê em 16 px;
   - se não parece outra coisa (rosto, prancha);
   - se nenhuma parte parece solta.

   Faça o recorte em volta das formas com `mask` e nunca com traço branco, para funcionar em qualquer fundo.
4. Mostre a folha de estudos e pergunte qual seguir. Refine só o escolhido.
5. Entregue símbolo, negativo, uma cor (versão clara e escura), ícone de app 1024 × 1024 e logotipo horizontal em `brand/`.

## Fase 5 · Cores e tipografia 🛑

1. Escolha a estratégia de cor antes das cores: contida, comprometida ou paleta cheia. Respeite as restrições do usuário. Na Kuravi, a regra foi "sem verde", e o verde ficou só no status "Confirmado".
2. Dê aos tokens nomes do mundo e da língua do projeto (coral-pulso, azul-noite, parede, névoa).
3. Calcule o contraste WCAG de todos os pares com um script; não estime. Derive as regras:
   - que texto pode ir sobre cada cor;
   - uma variante mais escura da cor da marca para usar como texto;
   - borda de campo com contraste de pelo menos 3:1.
4. Escolha as fontes no mundo do assunto: uma para títulos e uma para texto. Exemplo da Kuravi: Signika, feita para sinalização, e Atkinson Hyperlegible Next, feita para legibilidade.

## Fase 6 · Manual e aprovação 🛑

- Monte o manual com 6 pranchas:
  1. logotipo e conceito;
  2. versões e área de respiro;
  3. cores, com hex, uso e contraste;
  4. tipografia;
  5. ícone e aplicações (notificação, componente principal, padrão gráfico);
  6. voz da marca, com "diga" e "evite".
- Onde montar:
  - **Design do Claude:** artifact do tipo Design, uma prancha por arquivo `.dc.html`, com os SVG enviados como asset.
  - **Canva:** só se a geração estiver habilitada no time. Se estiver desligada, não hospede arquivos gerados em URL pública para importar; use o Design do Claude.
- Gere um PDF com capa, as 6 pranchas e uma página de aprovação com checklist e assinaturas (HTML estático + `page.pdf` do Playwright). Envie e espere a aprovação.

## Fase 7 · Aplicar num protótipo

- Faça o protótipo em HTML, CSS e JS puro, com os tokens em `:root`.
  - A primeira dobra demonstra o mecanismo do produto, nunca uma foto genérica.
  - Use um único momento de animação e respeite `prefers-reduced-motion`.
- Siga `impeccable/reference/craft-floor.md`:
  - sem rótulo pequeno acima do título;
  - sem grade de cards iguais como estrutura da página;
  - sem texto em gradiente;
  - sem emoji como ícone;
  - com cores próprias para seleção de texto, foco, cursor e barra de rolagem.
- Formulários:
  - rótulos sempre visíveis;
  - erro abaixo do campo, ligado com `aria-describedby`;
  - resumo de erros no topo, com links e foco;
  - consentimentos separados e campo-armadilha contra robôs;
  - dados de demonstração rotulados como fictícios.
- Verifique com Playwright em 1440, 1280, 1024 e 390 px:
  - rolagem horizontal e quebras de título;
  - estados de erro, sucesso, vazio e menu aberto;
  - erros de console.

  Faça no máximo duas rodadas de correção, sempre em lote.
- Gere um PDF de aprovação do site: uma página por seção, com web e celular lado a lado, o que aprovar e assinaturas.

## Fase 8 · Documentar

- Escreva `DESIGN.md` (mundo, tokens, componentes, movimento, regras de conteúdo) e `brand/README.md` (arquivos, tokens com contraste, como gerar de novo).
- Versione no repositório os scripts que geram os PDFs, para refazer tudo depois de qualquer mudança.

## Regras gerais

- Mostre cedo e itere comigo: o que dá para ver, mostre em imagem em vez de descrever.
- Nada inventado: sem depoimentos, logos de clientes, preços ou métricas não confirmados.
- Se algo estiver bloqueado (INPI fora do Brasil, IA do Canva desligada, script de uma skill), diga o que aconteceu e siga pelo caminho alternativo.
