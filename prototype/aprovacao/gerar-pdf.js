// Gera o PDF de aprovação do protótipo (desktop + celular, seção por seção).
// Uso: NODE_PATH=$(npm root -g) node prototype/aprovacao/gerar-pdf.js
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const AQUI = __dirname;
const SITE = 'file://' + path.join(AQUI, '..', 'index.html');
const CAP = path.join(AQUI, 'capturas');
const SAIDA = path.join(AQUI, '..', 'kuravi-site-prototipo-v1.pdf');
fs.mkdirSync(CAP, { recursive: true });

const SECOES = [
  { id: 'heroi', sel: '#inicio', titulo: 'Primeira dobra',
    texto: 'A oferta em uma frase, o início do cadastro (nome da clínica + WhatsApp) e o painel da recepção mostrando uma Solicitação Verificada chegando. A linha-guia sai daqui e conduz o visitante até o cadastro.',
    aprovar: 'Título "Sua agenda cheia. Sem mensalidade." e o botão "Quero pacientes novos".' },
  { id: 'dores', sel: '.dores', titulo: 'O que trava a agenda',
    texto: 'Três dores que a clínica reconhece na hora: WhatsApp lotado, cancelamento em cima da hora e convênio incerto. Sem números inventados.',
    aprovar: 'Se estas são as três dores certas para abrir a conversa.' },
  { id: 'rota', sel: '#como-funciona', titulo: 'Como funciona',
    texto: 'Uma rota com três paradas, em placas no estilo da sinalização hospitalar: o paciente encontra quem atende o plano, a solicitação chega completa, a clínica responde com um toque.',
    aprovar: 'O texto das três etapas.' },
  { id: 'encaixe', sel: '#encaixe', extra: 'encaixe-fim', titulo: 'Modo Encaixe',
    texto: 'Simulador interativo: o visitante clica em "Simular um cancelamento", a vaga abre, a fila é avisada em ondas e o horário é confirmado. Abaixo, o estado final.',
    aprovar: 'A regra "o encaixe vende rapidez, nunca desconto" (CFM).' },
  { id: 'preco', sel: '#preco', titulo: 'Preço',
    texto: 'Sem mensalidade e sem fidelidade. Explica quando uma Solicitação Verificada conta e garante que nunca há porcentagem sobre a consulta. O valor por especialidade fica para o piloto.',
    aprovar: 'Modelo de cobrança por Solicitação Verificada e as 10 primeiras grátis.' },
  { id: 'regras', sel: '#regras', titulo: 'CFM e LGPD',
    texto: 'O que dá confiança ao médico e protege o paciente: CRM/RQE verificados, ranking transparente com "Patrocinado", notificações sem especialidade, dados no Brasil.',
    aprovar: 'Os compromissos públicos (dependem do parecer jurídico).' },
  { id: 'cadastro', sel: '#cadastro', extra: 'cadastro-estados', titulo: 'Cadastro da clínica',
    texto: 'Só os campos necessários para o primeiro contato. Erros aparecem no topo, com links, e ao lado de cada campo. Abaixo, o erro e a confirmação com o JSON que vai para o n8n.',
    aprovar: 'Campos do formulário e as promessas "resposta em 1 dia útil" e "conversa de 20 minutos".' },
  { id: 'paciente', sel: '#paciente', titulo: 'Lista de espera de pacientes',
    texto: 'Captação secundária: e-mail ou WhatsApp, cidade e consentimento. Avisamos quando houver clínicas que atendem o plano na cidade.',
    aprovar: 'Se os pacientes entram já no lançamento do site ou só depois.' },
  { id: 'perguntas', sel: '.perguntas', extra: 'rodape', titulo: 'Perguntas e rodapé',
    texto: 'As cinco dúvidas mais prováveis da clínica, incluindo CFM e LGPD. Rodapé com aviso de que a Kuravi não presta serviços médicos e o acesso às preferências de cookies.',
    aprovar: 'As respostas sobre CFM e sobre agenda.' },
  { id: 'cookies', sel: null, titulo: 'Cookies (LGPD)',
    texto: 'Banner com cookies opcionais negados por padrão. Recusar tem o mesmo peso que aceitar, e dá para escolher categoria por categoria.',
    aprovar: 'O texto do banner.' },
];

async function abrir(b, largura, altura, escala) {
  const p = await b.newPage({ viewport: { width: largura, height: altura }, deviceScaleFactor: escala });
  await p.goto(SITE, { waitUntil: 'networkidle' });
  await p.evaluate(() => document.fonts.ready);
  await p.waitForTimeout(2600);
  return p;
}

async function capturar(b) {
  for (const [modo, w, h, esc] of [['desktop', 1440, 900, 1], ['celular', 390, 844, 2]]) {
    // banner de cookies na primeira visita
    let p = await abrir(b, w, h, esc);
    await p.screenshot({ path: path.join(CAP, `${modo}-cookies.png`) });
    await p.click('[data-cookies="recusar"]');
    await p.evaluate(() => { document.querySelector('.topo').style.position = 'static'; });
    for (const s of SECOES) {
      if (!s.sel) continue;
      await (await p.$(s.sel)).screenshot({ path: path.join(CAP, `${modo}-${s.id}.png`) });
    }
    await (await p.$('.rodape')).screenshot({ path: path.join(CAP, `${modo}-rodape.png`) });
    await p.click('#sim-iniciar');
    await p.waitForTimeout(5000);
    await (await p.$('.simulador')).screenshot({ path: path.join(CAP, `${modo}-encaixe-fim.png`) });
    await p.click('#form-clinica button[type=submit]');
    await p.waitForTimeout(300);
    await (await p.$('#form-clinica')).screenshot({ path: path.join(CAP, `${modo}-cadastro-erro.png`) });
    await p.fill('#fc-nome', 'Fernanda Lima'); await p.fill('#fc-email', 'fernanda@clinica.com.br');
    await p.fill('#fc-clinica', 'Clínica Exemplo'); await p.fill('#fc-telefone', '11900001234');
    await p.fill('#fc-cidade', 'Campinas/SP'); await p.check('#fc-lgpd');
    await p.click('label.chip:has-text("Dermatologia")');
    await p.click('#form-clinica button[type=submit]');
    await p.waitForTimeout(300);
    await (await p.$('#form-clinica')).screenshot({ path: path.join(CAP, `${modo}-cadastro-sucesso.png`) });
    await p.close();
  }
}

function esc(t) { return t.replace(/&/g, '&amp;').replace(/</g, '&lt;'); }

function paginaSecao(s, n, total) {
  let extraDesk = '';
  if (s.extra === 'encaixe-fim') extraDesk = `<img class="mini" src="capturas/desktop-encaixe-fim.png" alt="">`;
  if (s.extra === 'cadastro-estados') extraDesk = `<div class="par"><img src="capturas/desktop-cadastro-erro.png" alt=""><img src="capturas/desktop-cadastro-sucesso.png" alt=""></div>`;
  if (s.extra === 'rodape') extraDesk = `<img class="mini" src="capturas/desktop-rodape.png" alt="">`;
  const desk = s.sel ? `<img src="capturas/desktop-${s.id}.png" alt="">` : `<img src="capturas/desktop-cookies.png" alt="">`;
  const cel = s.sel ? `capturas/celular-${s.id}.png` : 'capturas/celular-cookies.png';
  return `<section class="pg secao">
    <div class="info">
      <span class="cont">${String(n).padStart(2, '0')} / ${String(total).padStart(2, '0')}</span>
      <h2>${esc(s.titulo)}</h2>
      <p>${esc(s.texto)}</p>
      <div class="aprovar"><strong>Para aprovar</strong><span>${esc(s.aprovar)}</span></div>
    </div>
    <figure class="desk"><figcaption>Web · 1440 px</figcaption><div class="tela">${desk}${extraDesk}</div></figure>
    <figure class="cel"><figcaption>Celular · 390 px</figcaption><div class="aparelho"><img src="${cel}" alt=""></div></figure>
  </section>`;
}

function montarHtml() {
  const total = SECOES.length;
  const mapa = SECOES.map((s, i) => `<li><span class="marco">${i + 1}</span><div><strong>${esc(s.titulo)}</strong><span>${esc(s.texto.split('.')[0])}.</span></div></li>`).join('');
  const checklist = SECOES.map(s => `<tr><td>${esc(s.titulo)}</td><td>☐</td><td>☐</td></tr>`).join('');
  return `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><title>Kuravi · Protótipo do site v1</title>
<link href="https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible+Next:wght@400;700&family=Signika:wght@500;600;700&display=swap" rel="stylesheet">
<style>
@page{size:1200px 720px;margin:0}
html,body{margin:0;background:#F4F6FA;color:#14254A;font-family:'Atkinson Hyperlegible Next',sans-serif}
.pg{width:1200px;height:720px;box-sizing:border-box;overflow:hidden;page-break-after:always;break-after:page;position:relative}
.pg:last-child{page-break-after:auto}
h1,h2,h3{font-family:Signika,sans-serif;font-weight:600;margin:0;line-height:1.1}
.capa{background:#14254A;color:#fff;padding:72px 80px;display:flex;flex-direction:column;justify-content:space-between}
.capa .topo{font-size:15px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#C9D6F0}
.capa .lock{display:flex;align-items:center;gap:22px}.capa .lock img{width:150px;height:150px}
.capa .wm{font-family:Signika;font-weight:600;font-size:128px;letter-spacing:-4px;line-height:1}
.capa h1{font-size:44px;color:#fff;margin-top:8px}.capa .sub{display:flex;justify-content:space-between;align-items:flex-end;color:#C9D6F0;font-size:15px;line-height:1.6}
.capa .faixas{position:absolute;right:0;top:64px;width:360px;display:flex;flex-direction:column;align-items:flex-end;gap:8px}
.capa .faixas span{height:8px;border-radius:999px 0 0 999px;display:block}
.mapa{padding:56px 64px;display:grid;grid-template-columns:1fr 1.15fr;gap:48px}
.mapa h2{font-size:40px}.mapa p{font-size:17px;line-height:1.55;color:#4B5A73;margin:16px 0 0}
.mapa .bloco{background:#fff;border:1px solid #E3E8F0;border-radius:16px;padding:20px 22px;margin-top:22px;font-size:15px;line-height:1.55}
.mapa ol{list-style:none;margin:0;padding:0 0 0 0;position:relative;display:flex;flex-direction:column;gap:9px}
.mapa ol::before{content:"";position:absolute;left:15px;top:14px;bottom:14px;width:6px;background:#FF5A3C;border-radius:999px}
.mapa li{display:flex;gap:14px;align-items:flex-start;position:relative}
.mapa .marco{width:36px;height:36px;border-radius:50%;background:#fff;border:5px solid #FF5A3C;box-sizing:border-box;display:grid;place-items:center;font-family:Signika;font-weight:700;font-size:14px;flex-shrink:0}
.mapa li div{display:flex;flex-direction:column;font-size:13.5px;line-height:1.35;color:#4B5A73;padding-top:1px}
.mapa li strong{color:#14254A;font-size:15px}
.secao{padding:40px 44px;display:grid;grid-template-columns:250px minmax(0,1fr) 214px;gap:28px}
.info{display:flex;flex-direction:column;gap:14px}
.cont{font-weight:700;font-size:13px;color:#4B5A73;letter-spacing:.06em}
.info h2{font-size:30px}.info p{margin:0;font-size:15px;line-height:1.55;color:#4B5A73}
.aprovar{margin-top:auto;background:#fff;border:2px solid #FF5A3C;border-radius:14px;padding:14px 16px;display:flex;flex-direction:column;gap:6px;font-size:14px;line-height:1.45}
.aprovar strong{font-family:Signika;font-size:16px}
figure{margin:0;display:flex;flex-direction:column;gap:8px;min-width:0}
figcaption{font-size:13px;font-weight:700;color:#4B5A73}
.tela{background:#fff;border:1px solid #E3E8F0;border-radius:12px;overflow:hidden;max-height:600px;display:flex;flex-direction:column;gap:10px;box-shadow:0 14px 30px -18px rgba(20,37,74,.45)}
.tela img{width:100%;display:block}
.tela img.mini{width:62%;margin:0 auto 12px;border-radius:10px;border:1px solid #E3E8F0}
.tela .par{display:grid;grid-template-columns:1fr 1fr;gap:10px;padding:0 10px 10px;align-items:start}
.tela .par img{border:1px solid #E3E8F0;border-radius:10px}
.aparelho{width:214px;height:600px;box-sizing:border-box;border:8px solid #14254A;border-radius:30px;overflow:hidden;background:#F4F6FA}
.aparelho img{width:100%;display:block}
.aprov{padding:56px 64px;display:grid;grid-template-columns:1.25fr 1fr;gap:44px}
.aprov h2{font-size:40px}.aprov p{font-size:15px;line-height:1.5;color:#4B5A73;margin:12px 0 16px}
table{border-collapse:collapse;width:100%;background:#fff;border:1px solid #E3E8F0;font-size:14px}
th{background:#14254A;color:#fff;text-align:left;padding:9px 14px}th:not(:first-child){text-align:center;width:84px}
td{padding:7px 14px;border-top:1px solid #E3E8F0}td:not(:first-child){text-align:center}
.pend{background:#fff;border:1px solid #E3E8F0;border-radius:14px;padding:16px 18px;font-size:13.5px;line-height:1.5}
.pend ul{margin:8px 0 0;padding-left:18px}
.ass{display:flex;flex-direction:column;gap:6px;margin-top:22px}.ass div{height:44px;border-bottom:2px solid #14254A}
</style></head><body>
<section class="pg capa">
  <span class="topo">Protótipo do site · versão 1 · para aprovação</span>
  <div><div class="lock"><img src="../assets/img/kuravi-simbolo-negativo.svg" alt=""><span class="wm">kuravi</span></div>
  <h1>Como fica o site na web e no celular</h1></div>
  <div class="sub"><span>Protótipo em HTML, CSS e JS com a identidade aprovada em 15/11.<br>Dados de demonstração são fictícios.</span><span style="text-align:right">Gu Caciolato e Bruno Souza<br>15 de novembro de 2026</span></div>
  <div class="faixas"><span style="width:100%;background:#FF5A3C"></span><span style="width:78%;background:#FFC93C"></span></div>
</section>
<section class="pg mapa">
  <div>
    <h2>O mapa da página</h2>
    <p>O site fala primeiro com clínicas e médicos: sem clínicas, o paciente não acha horário. O objetivo é o pré-cadastro da clínica; a lista de espera de pacientes vem em segundo plano.</p>
    <p>A página é uma rota, como a faixa colorida no chão do hospital: cada seção leva à próxima até o cadastro.</p>
    <div class="bloco"><strong>Formulários → n8n.</strong> O cadastro gera um JSON pronto para o webhook do n8n. No protótipo nada é enviado: a página mostra o JSON. Em produção, o site valida, assina e repassa (stack do integriguard.tech).</div>
  </div>
  <ol>${mapa}</ol>
</section>
${SECOES.map((s, i) => paginaSecao(s, i + 1, total)).join('\n')}
<section class="pg aprov">
  <div>
    <h2>Aprovação</h2>
    <p>Marque cada seção. O que ficar em "ajustar" volta numa versão 2 antes de portar para a stack de produção.</p>
    <table><thead><tr><th>Seção</th><th>Aprovado</th><th>Ajustar</th></tr></thead><tbody>${checklist}</tbody></table>
  </div>
  <div style="display:flex;flex-direction:column;justify-content:flex-end">
    <div class="pend"><strong>Pendências antes de publicar</strong>
      <ul><li>Valor da Solicitação Verificada por especialidade.</li>
      <li>Confirmar "resposta em 1 dia útil" e "conversa de 20 minutos".</li>
      <li>Razão social, CNPJ, Política de Privacidade, Termos e contato do encarregado (DPO).</li>
      <li>Parecer jurídico sobre cobrança (CFM) e textos de LGPD.</li>
      <li>Domínio kuravi.com.br e webhook do n8n.</li></ul></div>
    <div class="ass"><div></div><span>Gu Caciolato · data ____/____/______</span></div>
    <div class="ass"><div></div><span>Bruno Souza · data ____/____/______</span></div>
  </div>
</section>
</body></html>`;
}

(async () => {
  const b = await chromium.launch();
  await capturar(b);
  const htmlPath = path.join(AQUI, 'aprovacao.html');
  fs.writeFileSync(htmlPath, montarHtml());
  const p = await b.newPage({ viewport: { width: 1200, height: 720 } });
  await p.goto('file://' + htmlPath, { waitUntil: 'networkidle' });
  await p.evaluate(() => document.fonts.ready);
  await p.pdf({ path: SAIDA, width: '1200px', height: '720px', printBackground: true, preferCSSPageSize: true });
  await b.close();
  console.log('PDF:', SAIDA);
})();
