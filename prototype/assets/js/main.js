/* Kuravi · protótipo do site (JavaScript puro, sem dependências)
 *
 * Integração com o n8n: defina as URLs antes deste script, por exemplo
 *   <script>window.KURAVI_CONFIG = { webhooks: { clinica: "https://.../webhook/kuravi-clinica-lead" } }</script>
 * Sem URL configurada, o formulário roda em "modo protótipo": nada é enviado e
 * a página mostra o JSON que iria para o n8n.
 * Em produção, o navegador envia para uma rota do próprio site, que valida,
 * assina (HMAC) e repassa ao n8n. Ver docs/02-arquitetura.md.
 */
(function () {
  "use strict";

  var CONFIG = Object.assign(
    { webhooks: { clinica: "", paciente: "" }, consentimentoVersao: "2026-11-v1", timeoutMs: 10000 },
    window.KURAVI_CONFIG || {}
  );
  var reduzMovimento = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $$(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }

  function storageGet(chave) {
    try { return window.localStorage.getItem(chave); } catch (e) { return null; }
  }
  function storageSet(chave, valor) {
    try { window.localStorage.setItem(chave, valor); } catch (e) { /* armazenamento indisponível */ }
  }

  /* ---------- topo: estado ao rolar e menu móvel ---------- */
  var topo = $(".topo");
  var menuBotao = $(".topo__menu");
  var nav = $("#navegacao");

  function aoRolar() { topo.classList.toggle("is-rolado", window.scrollY > 8); }
  window.addEventListener("scroll", aoRolar, { passive: true });
  aoRolar();

  function fecharMenu() {
    nav.classList.remove("is-aberto");
    menuBotao.setAttribute("aria-expanded", "false");
  }
  menuBotao.addEventListener("click", function () {
    var aberto = nav.classList.toggle("is-aberto");
    menuBotao.setAttribute("aria-expanded", String(aberto));
  });
  $$("a", nav).forEach(function (a) { a.addEventListener("click", fecharMenu); });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && nav.classList.contains("is-aberto")) { fecharMenu(); menuBotao.focus(); }
  });

  /* ---------- telefone: máscara leve (BR) ---------- */
  function soDigitos(v) { return (v || "").replace(/\D/g, ""); }
  function formatarTelefone(v) {
    var d = soDigitos(v).slice(0, 11);
    if (d.length <= 2) return d.length ? "(" + d : "";
    if (d.length <= 6) return "(" + d.slice(0, 2) + ") " + d.slice(2);
    if (d.length <= 10) return "(" + d.slice(0, 2) + ") " + d.slice(2, 6) + "-" + d.slice(6);
    return "(" + d.slice(0, 2) + ") " + d.slice(2, 7) + "-" + d.slice(7);
  }
  $$('input[type="tel"]').forEach(function (inp) {
    inp.addEventListener("input", function () {
      var fimAntes = inp.selectionStart === inp.value.length;
      inp.value = formatarTelefone(inp.value);
      if (fimAntes) inp.setSelectionRange(inp.value.length, inp.value.length);
    });
  });

  /* ---------- validação ---------- */
  var RE_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  function telefoneValido(v) { var d = soDigitos(v); return d.length === 10 || d.length === 11; }

  function erroDoCampo(campo) {
    var valor = (campo.value || "").trim();
    var msg = campo.getAttribute("data-erro") || "Confira este campo.";
    if (campo.type === "checkbox") return campo.required && !campo.checked ? msg : "";
    if (campo.required && !valor) return msg;
    if (!valor) return "";
    if (campo.type === "email" && !RE_EMAIL.test(valor)) return msg;
    if (campo.type === "tel" && !telefoneValido(valor)) return msg;
    if (campo.name === "contato" && !RE_EMAIL.test(valor) && !telefoneValido(valor)) return msg;
    return "";
  }

  function mostrarErro(campo, msg) {
    var alvo = document.getElementById(campo.id + "-erro");
    if (msg) campo.setAttribute("aria-invalid", "true"); else campo.removeAttribute("aria-invalid");
    if (alvo) alvo.textContent = msg;
  }

  function camposValidaveis(form) {
    return $$("input[required], input[type='email'], input[type='tel'], input[name='contato']", form)
      .filter(function (c) { return !c.closest(".armadilha"); });
  }

  function validarFormulario(form) {
    var erros = [];
    camposValidaveis(form).forEach(function (campo) {
      var msg = erroDoCampo(campo);
      mostrarErro(campo, msg);
      if (msg) erros.push({ id: campo.id, msg: msg });
    });
    return erros;
  }

  function renderResumo(form, erros) {
    var resumo = $(".resumo-erros", form);
    if (!resumo) return;
    var lista = $("ul", resumo);
    lista.replaceChildren();
    if (!erros.length) { resumo.hidden = true; return; }
    $("h3", resumo).textContent = erros.length === 1
      ? "Falta pouco: confira 1 campo"
      : "Falta pouco: confira " + erros.length + " campos";
    erros.forEach(function (e) {
      var li = document.createElement("li");
      var a = document.createElement("a");
      a.href = "#" + e.id;
      a.textContent = e.msg;
      a.addEventListener("click", function (ev) {
        ev.preventDefault();
        var campo = document.getElementById(e.id);
        campo.focus();
        campo.scrollIntoView({ block: "center", behavior: reduzMovimento ? "auto" : "smooth" });
      });
      li.appendChild(a);
      lista.appendChild(li);
    });
    resumo.hidden = false;
    resumo.focus();
  }

  /* ---------- payload para o n8n ---------- */
  function utm() {
    var p = new URLSearchParams(window.location.search);
    return {
      utm_source: p.get("utm_source"),
      utm_medium: p.get("utm_medium"),
      utm_campaign: p.get("utm_campaign")
    };
  }

  function montarPayload(form, inicio) {
    var dados = new FormData(form);
    var tipo = form.getAttribute("data-tipo");
    var base = {
      tipo: tipo,
      consentimento_lgpd: dados.get("consentimento_lgpd") === "sim",
      consentimento_versao: CONFIG.consentimentoVersao,
      origem: form.getAttribute("data-origem"),
      pagina: window.location.pathname,
      tempo_preenchimento_s: Math.round((Date.now() - inicio) / 1000)
    };
    if (tipo === "clinica") {
      Object.assign(base, {
        nome: (dados.get("nome") || "").trim(),
        email: (dados.get("email") || "").trim().toLowerCase(),
        telefone: "+55" + soDigitos(dados.get("telefone")),
        clinica: (dados.get("clinica") || "").trim(),
        cidade: (dados.get("cidade") || "").trim(),
        especialidades: dados.getAll("especialidades"),
        aceita_emails: dados.get("aceita_emails") === "sim"
      });
    } else {
      var contato = (dados.get("contato") || "").trim();
      Object.assign(base, {
        contato: RE_EMAIL.test(contato) ? contato.toLowerCase() : "+55" + soDigitos(contato),
        contato_tipo: RE_EMAIL.test(contato) ? "email" : "whatsapp",
        cidade: (dados.get("cidade") || "").trim()
      });
    }
    return Object.assign(base, utm());
  }

  function enviar(url, payload) {
    var controle = new AbortController();
    var timer = setTimeout(function () { controle.abort(); }, CONFIG.timeoutMs);
    return fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: controle.signal
    }).then(function (r) {
      clearTimeout(timer);
      if (!r.ok) throw new Error("HTTP " + r.status);
    }, function (err) { clearTimeout(timer); throw err; });
  }

  function mostrarSucesso(form, payload, modoPrototipo) {
    var tipo = form.getAttribute("data-tipo");
    var bloco = document.createElement("div");
    bloco.className = "sucesso-envio";
    bloco.setAttribute("role", "status");
    bloco.setAttribute("tabindex", "-1");
    var titulo = document.createElement("h3");
    titulo.textContent = tipo === "clinica" ? "Recebemos. Obrigado!" : "Pronto, você está na lista.";
    var texto = document.createElement("p");
    texto.textContent = tipo === "clinica"
      ? "Alguém da Kuravi chama você no WhatsApp ou por e-mail em até 1 dia útil para marcar a conversa."
      : "Avisamos quando houver clínicas que atendem o seu plano na sua cidade.";
    bloco.appendChild(titulo);
    bloco.appendChild(texto);
    if (modoPrototipo) {
      var aviso = document.createElement("p");
      var forte = document.createElement("strong");
      forte.textContent = "Modo protótipo:";
      aviso.append(forte, " nada foi enviado. Este é o JSON que iria para o webhook do n8n:");
      var previa = document.createElement("pre");
      previa.className = "previa";
      previa.textContent = JSON.stringify(payload, null, 2);
      bloco.appendChild(aviso);
      bloco.appendChild(previa);
    }
    form.replaceChildren(bloco);
    bloco.focus();
  }

  $$("form.formulario").forEach(function (form) {
    var inicio = Date.now();
    var tentou = false;
    var botao = $("button[type='submit']", form);
    var status = $("[data-status]", form);

    form.addEventListener("focusin", function primeiroFoco() {
      inicio = Date.now();
      form.removeEventListener("focusin", primeiroFoco);
    });

    form.addEventListener("focusout", function (e) {
      var campo = e.target;
      if (!tentou || !campo.matches || !campo.matches("input")) return;
      if (camposValidaveis(form).indexOf(campo) === -1) return;
      mostrarErro(campo, erroDoCampo(campo));
    });
    form.addEventListener("change", function (e) {
      if (tentou && e.target.type === "checkbox" && e.target.required) mostrarErro(e.target, erroDoCampo(e.target));
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      tentou = true;
      var erros = validarFormulario(form);
      renderResumo(form, erros);
      if (erros.length) return;

      var payload = montarPayload(form, inicio);
      var armadilha = $("input[name='site_web']", form);
      if (armadilha && armadilha.value) { mostrarSucesso(form, payload, false); return; }

      var url = CONFIG.webhooks[form.getAttribute("data-tipo")];
      if (!url) {
        if (window.console) console.info("[kuravi] modo protótipo, payload:", payload);
        mostrarSucesso(form, payload, true);
        return;
      }
      botao.disabled = true;
      botao.textContent = "Enviando…";
      status.textContent = "Enviando seus dados.";
      enviar(url, payload).then(function () {
        mostrarSucesso(form, payload, false);
      }).catch(function () {
        botao.disabled = false;
        botao.textContent = form.getAttribute("data-tipo") === "clinica" ? "Tentar de novo" : "Me avise";
        status.textContent = "Não conseguimos enviar agora. Seus dados continuam aqui: tente de novo em instantes.";
      });
    });
  });

  /* ---------- herói: início rápido leva ao cadastro completo ---------- */
  var rapido = $("#inicio-rapido");
  if (rapido) {
    rapido.addEventListener("submit", function (e) {
      e.preventDefault();
      var clinica = $("#ir-clinica").value.trim();
      var tel = $("#ir-whatsapp").value.trim();
      if (clinica) $("#fc-clinica").value = clinica;
      if (tel) $("#fc-telefone").value = formatarTelefone(tel);
      var alvo = $("#cadastro");
      alvo.scrollIntoView({ behavior: reduzMovimento ? "auto" : "smooth", block: "start" });
      var primeiroVazio = camposValidaveis($("#form-clinica")).filter(function (c) {
        return c.type !== "checkbox" && !c.value.trim();
      })[0] || $("#fc-nome");
      setTimeout(function () { primeiroVazio.focus({ preventScroll: true }); }, reduzMovimento ? 0 : 450);
    });
  }

  /* ---------- simulador do Modo Encaixe ---------- */
  var sim = $(".simulador");
  if (sim) {
    var iniciar = $("#sim-iniciar");
    var reiniciar = $("#sim-reiniciar");
    var log = $("#sim-log");
    var statusSlot = $("#sim-status");
    var timers = [];
    var passo = function (ms, fn) { timers.push(setTimeout(fn, reduzMovimento ? 0 : ms)); };

    iniciar.addEventListener("click", function () {
      iniciar.disabled = true;
      sim.setAttribute("data-estado", "aberto");
      statusSlot.textContent = "Vaga aberta";
      log.textContent = "Paciente desmarcou. Vaga aberta às 15h40.";
      passo(900, function () {
        sim.setAttribute("data-estado", "avisando");
        log.textContent = "1ª onda: 5 pacientes da fila avisados.";
      });
      passo(2000, function () { log.textContent = "2ª onda: mais 5 pacientes avisados."; });
      passo(3100, function () { log.textContent = "3ª onda: mais 5 pacientes avisados."; });
      passo(4300, function () {
        sim.setAttribute("data-estado", "preenchido");
        var selo = document.createElement("span");
        selo.className = "status-confirmado";
        selo.textContent = "Confirmado";
        statusSlot.replaceChildren("Mariana S. ", selo);
        log.textContent = "Horário preenchido em 4 minutos.";
        iniciar.hidden = true;
        reiniciar.hidden = false;
        reiniciar.focus();
      });
    });

    reiniciar.addEventListener("click", function () {
      timers.forEach(clearTimeout);
      timers = [];
      sim.setAttribute("data-estado", "cheio");
      statusSlot.textContent = "Paciente agendado";
      log.textContent = "Agenda cheia.";
      reiniciar.hidden = true;
      iniciar.hidden = false;
      iniciar.disabled = false;
      iniciar.focus();
    });
  }

  /* ---------- cookies (LGPD): tudo opcional começa negado ---------- */
  var CHAVE_COOKIES = "kuravi-consentimento-cookies";
  var banner = $("#cookies");
  var opcoes = $("#cookies-opcoes");
  var medicao = $("#cookie-medicao");
  var botaoEscolher = banner && $('[data-cookies="escolher"]', banner);

  function aplicarConsentimento(permiteMedicao) {
    // Produção: GA4 com Consent Mode. O padrão é "denied" até o visitante aceitar.
    if (typeof window.gtag === "function") {
      window.gtag("consent", "update", { analytics_storage: permiteMedicao ? "granted" : "denied" });
    }
  }
  function salvarCookies(permiteMedicao) {
    storageSet(CHAVE_COOKIES, JSON.stringify({ versao: CONFIG.consentimentoVersao, medicao: permiteMedicao, em: new Date().toISOString() }));
    aplicarConsentimento(permiteMedicao);
    banner.hidden = true;
  }
  function abrirCookies(comOpcoes) {
    banner.hidden = false;
    if (comOpcoes) { opcoes.hidden = false; botaoEscolher.textContent = "Salvar escolha"; botaoEscolher.setAttribute("aria-expanded", "true"); }
    var primeiro = $("button", banner);
    if (primeiro) primeiro.focus();
  }

  if (banner) {
    var salvo = null;
    try { salvo = JSON.parse(storageGet(CHAVE_COOKIES) || "null"); } catch (e) { salvo = null; }
    if (salvo && salvo.versao === CONFIG.consentimentoVersao) {
      medicao.checked = !!salvo.medicao;
      aplicarConsentimento(!!salvo.medicao);
    } else {
      banner.hidden = false;
    }

    banner.addEventListener("click", function (e) {
      var acao = e.target.closest("[data-cookies]");
      if (!acao) return;
      var tipo = acao.getAttribute("data-cookies");
      if (tipo === "recusar") salvarCookies(false);
      if (tipo === "aceitar") salvarCookies(true);
      if (tipo === "escolher") {
        if (opcoes.hidden) {
          opcoes.hidden = false;
          acao.textContent = "Salvar escolha";
          acao.setAttribute("aria-expanded", "true");
          medicao.focus();
        } else {
          salvarCookies(medicao.checked);
        }
      }
    });
    $$("[data-abrir-cookies]").forEach(function (b) { b.addEventListener("click", function () { abrirCookies(true); }); });
  }
})();
