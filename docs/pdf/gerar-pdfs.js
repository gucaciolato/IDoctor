// Gera um PDF por documento .md e um volume único, com o sistema de design da Kuravi.
// Uso (dentro de docs/pdf):  npm install && npm run gerar
// Requer Playwright (Chromium) e o utilitário pdfunite (poppler-utils) para o volume único.
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const { Marked } = require('marked');
const { chromium } = require('playwright');

const RAIZ = path.resolve(__dirname, '..', '..');
const SAIDA = __dirname;
const MERMAID = path.join(__dirname, 'node_modules', 'mermaid', 'dist', 'mermaid.min.js');
const LOGO = path.join(RAIZ, 'brand', 'kuravi-simbolo-negativo.svg');
const DATA = '15 de novembro de 2026';

const DOCS = [
  { arq: 'README.md', slug: 'visao-geral', titulo: 'Visão geral', resumo: 'O que é a Kuravi, mapa dos documentos e estrutura do repositório.' },
  { arq: 'docs/00-avaliacao-da-conversa.md', slug: '00-avaliacao-da-conversa', titulo: '00 · Avaliação da conversa', resumo: 'Análise do modelo "sem mensalidade / por contato / comissão" e a recomendação da Solicitação Verificada.' },
  { arq: 'docs/01-produto.md', slug: '01-produto', titulo: '01 · Produto', resumo: 'Visão, personas, MVP, jornadas, métricas, critérios da cidade piloto e go-to-market.' },
  { arq: 'docs/02-arquitetura.md', slug: '02-arquitetura', titulo: '02 · Arquitetura', resumo: 'Site, n8n, Directus, API NestJS, app Flutter, dados e infraestrutura no Coolify.' },
  { arq: 'docs/03-observabilidade.md', slug: '03-observabilidade', titulo: '03 · Observabilidade', resumo: 'Elastic Stack e Kibana: logs, traces, métricas, alertas, SLOs e retenção.' },
  { arq: 'docs/04-lgpd-cfm.md', slug: '04-lgpd-cfm', titulo: '04 · LGPD, CFM e regulação', resumo: 'Dados sensíveis, bases legais, ética médica e checklist de lançamento.' },
  { arq: 'docs/05-roadmap.md', slug: '05-roadmap', titulo: '05 · Roadmap', resumo: 'Fases 0 a 3 e as próximas decisões.' },
  { arq: 'docs/06-marca-e-nome.md', slug: '06-marca-e-nome', titulo: '06 · Marca e nome', resumo: 'Por que não "iDoctor", candidatos, domínios e passo a passo do INPI.' },
  { arq: 'DESIGN.md', slug: 'sistema-de-design', titulo: 'Sistema de design', resumo: 'Mundo visual, tokens, componentes, movimento e regras de conteúdo.' },
  { arq: 'brand/README.md', slug: 'marca-arquivos-e-tokens', titulo: 'Marca: arquivos e tokens', resumo: 'Arquivos do logotipo, cores com contraste verificado e tipografia.' },
  { arq: 'prototype/README.md', slug: 'prototipo-do-site', titulo: 'Protótipo do site', resumo: 'Como abrir, seções, integração com o n8n e o que é fictício.' },
  { arq: 'PRODUCT.md', slug: 'anexo-a-registro-de-produto', titulo: 'Anexo A · Registro de produto', anexo: true, resumo: 'PRODUCT.md, em inglês: o contexto de produto usado pelas skills de design.' },
  { arq: 'CLAUDE.md', slug: 'anexo-b-instrucoes-para-agentes', titulo: 'Anexo B · Instruções para agentes', anexo: true, resumo: 'CLAUDE.md: regras do projeto para quem desenvolve com IA.' },
  { arq: '.impeccable/surfaces/prototype-index.md', slug: 'anexo-c-brief-do-prototipo', titulo: 'Anexo C · Brief de direção do protótipo', anexo: true, resumo: 'Em inglês: a direção visual registrada para o protótipo.' },
];

function esc(t) { return String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
function slugify(t) {
  return t.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

// Resolve um link relativo do .md para o slug de outro documento (volume único).
function alvoDoc(docArq, href) {
  const [arquivo, ancora] = href.split('#');
  if (!arquivo) return ancora ? { ancora } : null;
  let alvo = path.posix.normalize(path.posix.join(path.posix.dirname(docArq), arquivo));
  if (alvo.endsWith('/')) alvo += 'README.md';
  const d = DOCS.find(x => x.arq === alvo);
  return d ? { slug: d.slug, ancora } : null;
}

function renderMarkdown(doc, modo) {
  let md = fs.readFileSync(path.join(RAIZ, doc.arq), 'utf8');
  md = md.replace(/<!--[\s\S]*?-->/g, '');
  const h1 = md.match(/^#\s+(.+)$/m);
  if (h1) md = md.replace(h1[0], '');
  const marked = new Marked({ gfm: true });
  marked.use({
    renderer: {
      heading({ tokens, depth }) {
        const texto = this.parser.parseInline(tokens);
        const id = doc.slug + '--' + slugify(texto.replace(/<[^>]+>/g, ''));
        return `<h${depth} id="${id}">${texto}</h${depth}>\n`;
      },
      code({ text, lang }) {
        if (lang === 'mermaid') return `<div class="diagrama"><pre class="mermaid">${esc(text)}</pre></div>\n`;
        return `<pre class="codigo"><code>${esc(text)}</code></pre>\n`;
      },
      link({ href, tokens }) {
        const texto = this.parser.parseInline(tokens);
        if (/^https?:\/\//.test(href) || href.startsWith('mailto:')) return `<a href="${esc(href)}">${texto}</a>`;
        if (modo === 'volume') {
          const alvo = alvoDoc(doc.arq, href);
          if (alvo && alvo.slug) {
            const id = alvo.ancora ? `${alvo.slug}--${alvo.ancora}` : alvo.slug;
            return `<a href="#${esc(id)}">${texto}</a>`;
          }
          if (alvo && alvo.ancora) return `<a href="#${esc(doc.slug + '--' + alvo.ancora)}">${texto}</a>`;
        }
        return `<span class="ref">${texto}</span>`;
      },
      blockquote({ tokens }) {
        return `<aside class="nota">${this.parser.parse(tokens)}</aside>\n`;
      },
    },
  });
  return marked.parse(md);
}

const CSS = `
@page { size: A4; margin: 20mm 17mm 20mm 17mm; }
html { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
body { margin: 0; color: #14254A; font-family: 'Atkinson Hyperlegible Next', system-ui, sans-serif; font-size: 10.5pt; line-height: 1.6; background: #fff; }
.faixa { background: #14254A; color: #fff; border-radius: 16px; padding: 22px 26px 24px; margin-bottom: 26px; position: relative; overflow: hidden; break-inside: avoid; }
.faixa__topo { display: flex; justify-content: space-between; align-items: center; gap: 16px; }
.faixa__marca { display: flex; align-items: center; gap: 6px; font-family: Signika, sans-serif; font-weight: 600; font-size: 20px; letter-spacing: -0.5px; }
.faixa__marca img { width: 28px; height: 28px; }
.faixa__meta { font-size: 9pt; color: #C9D6F0; text-align: right; }
.faixa h1 { font-family: Signika, sans-serif; font-weight: 600; font-size: 27pt; line-height: 1.05; letter-spacing: -0.02em; margin: 18px 0 6px; color: #fff; }
.faixa p { margin: 0; color: #C9D6F0; font-size: 10.5pt; max-width: 52ch; }
.faixa__linhas { position: absolute; right: 0; bottom: 18px; width: 38%; display: flex; flex-direction: column; align-items: flex-end; gap: 5px; }
.faixa__linhas span { display: block; height: 5px; border-radius: 999px 0 0 999px; }
.anexo .faixa { background: #4B5A73; }
h1, h2, h3, h4 { font-family: Signika, sans-serif; font-weight: 600; line-height: 1.15; color: #14254A; break-after: avoid; break-inside: avoid; text-wrap: balance; }
h2 { font-size: 17pt; margin: 26px 0 10px; letter-spacing: -0.01em; }
h2::before { content: ""; display: block; width: 30px; height: 5px; border-radius: 999px; background: #FF5A3C; margin-bottom: 10px; }
h3 { font-size: 13pt; margin: 20px 0 8px; }
h4 { font-size: 11.5pt; margin: 16px 0 6px; }
p { margin: 0 0 10px; orphans: 3; widows: 3; }
ul, ol { margin: 0 0 12px; padding-left: 20px; }
li { margin: 3px 0; }
li::marker { color: #C8341A; }
strong { font-weight: 700; }
a { color: #C8341A; text-decoration-thickness: 1px; text-underline-offset: 2px; }
.ref { font-weight: 700; text-decoration: underline dotted #6B7891; text-underline-offset: 2px; }
code { font-family: 'DejaVu Sans Mono', ui-monospace, monospace; font-size: 0.86em; background: #E3E8F0; border-radius: 4px; padding: 1px 5px; }
pre.codigo { background: #F4F6FA; border: 1px solid #E3E8F0; border-radius: 10px; padding: 12px 14px; white-space: pre-wrap; word-break: break-word; font-size: 8.4pt; line-height: 1.5; break-inside: avoid; margin: 0 0 14px; }
pre.codigo code { background: none; padding: 0; font-size: inherit; }
table { width: 100%; border-collapse: collapse; margin: 6px 0 16px; font-size: 8.9pt; line-height: 1.45; }
thead { display: table-header-group; }
th { background: #14254A; color: #fff; text-align: left; padding: 7px 9px; font-weight: 700; vertical-align: bottom; }
th:first-child { border-top-left-radius: 8px; } th:last-child { border-top-right-radius: 8px; }
td { padding: 6px 9px; border-bottom: 1px solid #E3E8F0; vertical-align: top; }
tr { break-inside: avoid; }
tbody tr:nth-child(even) td { background: #F4F6FA; }
td code, th code { font-size: 0.82em; }
aside.nota { background: #FFF0EB; border: 1.5px solid #FF5A3C; border-radius: 12px; padding: 12px 16px; margin: 0 0 16px; break-inside: avoid; }
aside.nota p:last-child { margin-bottom: 0; }
hr { border: 0; height: 2px; background: #E3E8F0; margin: 22px 0; }
input[type=checkbox] { width: 13px; height: 13px; margin: 0 6px 0 0; vertical-align: -2px; accent-color: #C8341A; }
li:has(> input[type=checkbox]) { list-style: none; margin-left: -18px; }
.diagrama { background: #F4F6FA; border: 1px solid #E3E8F0; border-radius: 12px; padding: 14px; margin: 4px 0 16px; break-inside: avoid; text-align: center; }
.diagrama svg { max-width: 100% !important; height: auto; }
pre.mermaid { margin: 0; font-family: inherit; }
.doc + .doc { break-before: page; }
.sumario h2::before { display: none; }
.sumario ol { list-style: none; padding: 0; margin: 0; position: relative; }
.sumario ol::before { content: ""; position: absolute; left: 13px; top: 14px; bottom: 14px; width: 5px; background: #FF5A3C; border-radius: 999px; }
.sumario li { display: flex; gap: 12px; align-items: flex-start; margin: 0 0 7px; position: relative; }
.sumario .faixa { margin-bottom: 18px; }
.sumario .marco { width: 31px; height: 31px; flex-shrink: 0; border-radius: 50%; background: #fff; border: 4px solid #FF5A3C; box-sizing: border-box; display: grid; place-items: center; font-family: Signika, sans-serif; font-weight: 700; font-size: 10pt; }
.sumario li.anexo .marco { border-color: #6B7891; }
.sumario a { color: #14254A; font-family: Signika, sans-serif; font-weight: 600; font-size: 12pt; line-height: 1.2; text-decoration: none; }
.sumario li div { display: flex; flex-direction: column; padding-top: 3px; }
.sumario li span.res { color: #4B5A73; font-size: 9pt; line-height: 1.35; }
`;

function faixa(doc) {
  return `<header class="faixa">
    <div class="faixa__topo"><span class="faixa__marca"><img src="file://${LOGO}" alt="">kuravi</span><span class="faixa__meta">Documentação · v1<br>${DATA}</span></div>
    <h1 id="${doc.slug}">${esc(doc.titulo)}</h1>
    <p>${esc(doc.resumo)}</p>
    <div class="faixa__linhas" aria-hidden="true"><span style="width:100%;background:#FF5A3C"></span><span style="width:76%;background:#FFC93C"></span></div>
  </header>`;
}

function pagina(corpo, titulo) {
  return `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><title>${esc(titulo)}</title>
<link href="https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible+Next:ital,wght@0,400;0,700;1,400&family=Signika:wght@500;600;700&display=swap" rel="stylesheet">
<style>${CSS}</style>
<script src="file://${MERMAID}"></script>
</head><body>${corpo}
<script>
mermaid.initialize({ startOnLoad: false, theme: 'base', securityLevel: 'strict',
  themeVariables: { fontFamily: 'Atkinson Hyperlegible Next, sans-serif', fontSize: '14px',
    primaryColor: '#FFF0EB', primaryBorderColor: '#FF5A3C', primaryTextColor: '#14254A',
    secondaryColor: '#E3E8F0', tertiaryColor: '#F4F6FA', lineColor: '#14254A', textColor: '#14254A',
    actorBkg: '#14254A', actorTextColor: '#FFFFFF', actorBorder: '#14254A', signalColor: '#14254A', signalTextColor: '#14254A',
    noteBkgColor: '#FFC93C', noteTextColor: '#14254A', labelBoxBkgColor: '#FFF0EB', sequenceNumberColor: '#FFFFFF',
    clusterBkg: '#FFFFFF', clusterBorder: '#6B7891', edgeLabelBackground: '#F4F6FA' } });
window.__pronto = mermaid.run({ querySelector: '.mermaid' }).then(() => document.fonts.ready).then(() => true);
</script></body></html>`;
}

function rodape(titulo) {
  return `<div style="width:100%;font-family:Arial,sans-serif;font-size:8px;color:#4B5A73;padding:0 17mm;display:flex;justify-content:space-between;">
    <span><b style="color:#14254A">kuravi</b> · ${esc(titulo)}</span>
    <span>página <span class="pageNumber"></span> de <span class="totalPages"></span></span></div>`;
}

async function imprimir(b, html, destino, titulo, comRodape = true) {
  const tmp = path.join(SAIDA, '.tmp-' + path.basename(destino, '.pdf') + '.html');
  fs.writeFileSync(tmp, html);
  const p = await b.newPage();
  await p.goto('file://' + tmp, { waitUntil: 'networkidle' });
  await p.waitForFunction(() => window.__pronto !== undefined);
  await p.evaluate(() => window.__pronto);
  await p.pdf({
    path: destino, format: 'A4', printBackground: true, preferCSSPageSize: true,
    displayHeaderFooter: comRodape, headerTemplate: '<span></span>', footerTemplate: comRodape ? rodape(titulo) : '<span></span>',
  });
  await p.close();
  fs.unlinkSync(tmp);
}

function capa() {
  return `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible+Next:wght@400;700&family=Signika:wght@500;600;700&display=swap" rel="stylesheet">
<style>@page{size:A4;margin:0}html,body{margin:0;-webkit-print-color-adjust:exact;print-color-adjust:exact}
.c{width:210mm;height:297mm;box-sizing:border-box;background:#14254A;color:#fff;padding:26mm 22mm;display:flex;flex-direction:column;justify-content:space-between;position:relative;overflow:hidden;font-family:'Atkinson Hyperlegible Next',sans-serif}
.t{font-size:11pt;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#C9D6F0}
.l{display:flex;align-items:center;gap:14px}.l img{width:110px;height:110px}.w{font-family:Signika;font-weight:600;font-size:88px;letter-spacing:-3px;line-height:1}
h1{font-family:Signika;font-weight:600;font-size:30pt;line-height:1.1;margin:22px 0 10px;max-width:16ch}
p{margin:0;color:#C9D6F0;font-size:12pt;line-height:1.55;max-width:44ch}
.r{display:flex;justify-content:space-between;align-items:flex-end;color:#C9D6F0;font-size:10.5pt;line-height:1.6}
.f{position:absolute;right:0;top:30mm;width:42%;display:flex;flex-direction:column;align-items:flex-end;gap:8px}.f span{display:block;height:8px;border-radius:999px 0 0 999px}
.s{font-family:Signika;font-size:22px;font-weight:500;color:#FF5A3C}</style></head><body>
<div class="c"><span class="t">Documentação do projeto · v1</span>
<div><div class="l"><img src="file://${LOGO}" alt=""><span class="w">kuravi</span></div>
<h1>Planejamento, marca e protótipo</h1><p>Avaliação do modelo de receita, produto, arquitetura, observabilidade, LGPD e CFM, roadmap, marca, sistema de design e protótipo do site.</p></div>
<div class="r"><span class="s">cura + vida, na hora certa.</span><span style="text-align:right">Gu Caciolato e Bruno Souza<br>${DATA}</span></div>
<div class="f"><span style="width:100%;background:#FF5A3C"></span><span style="width:80%;background:#FFC93C"></span><span style="width:60%;background:#FFFFFF"></span></div>
</div><script>window.__pronto = document.fonts.ready.then(() => true);</script></body></html>`;
}

(async () => {
  const b = await chromium.launch();
  const individuais = [];
  for (const doc of DOCS) {
    const corpo = `<article class="doc${doc.anexo ? ' anexo' : ''}">${faixa(doc)}${renderMarkdown(doc, 'individual')}</article>`;
    const nome = `kuravi-${doc.slug}.pdf`;
    await imprimir(b, pagina(corpo, doc.titulo), path.join(SAIDA, nome), doc.titulo);
    individuais.push(nome);
    console.log('ok', nome);
  }
  // volume único: capa + sumário + todos os documentos
  const sumario = `<article class="doc sumario"><header class="faixa"><div class="faixa__topo"><span class="faixa__marca"><img src="file://${LOGO}" alt="">kuravi</span><span class="faixa__meta">Documentação · v1<br>${DATA}</span></div><h1>Sumário</h1><p>Clique em um título para ir ao documento.</p></header>
    <ol>${DOCS.map((d, i) => `<li class="${d.anexo ? 'anexo' : ''}"><span class="marco">${d.anexo ? d.titulo.split(' ')[1] : i + 1}</span><div><a href="#${d.slug}">${esc(d.titulo)}</a><span class="res">${esc(d.resumo)}</span></div></li>`).join('')}</ol></article>`;
  const volume = sumario + DOCS.map(d => `<article class="doc${d.anexo ? ' anexo' : ''}">${faixa(d)}${renderMarkdown(d, 'volume')}</article>`).join('');
  const corpoPdf = path.join(SAIDA, '.tmp-corpo.pdf');
  const capaPdf = path.join(SAIDA, '.tmp-capa.pdf');
  await imprimir(b, pagina(volume, 'Documentação completa'), corpoPdf, 'Documentação completa');
  await imprimir(b, capa(), capaPdf, 'Capa', false);
  await b.close();
  const final = path.join(SAIDA, 'kuravi-documentacao-completa.pdf');
  execFileSync('pdfunite', [capaPdf, corpoPdf, final]);
  fs.unlinkSync(capaPdf); fs.unlinkSync(corpoPdf);
  console.log('ok', path.basename(final));
})();
