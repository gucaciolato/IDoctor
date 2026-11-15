# Protótipo do site · Kuravi

HTML + CSS + JavaScript puro, sem build. Valida o conceito e a identidade aprovada antes de portar para Vite + React Router 7 + Tailwind v4 (mesma stack do integriguard.tech).

## Abrir

Abra `index.html` no navegador, ou sirva a pasta:

```bash
cd prototype && python3 -m http.server 8080   # http://localhost:8080
```

## Seções

Herói (oferta + início do cadastro + painel da recepção ao vivo) → o que trava a agenda → como funciona (rota com 3 paradas) → Modo Encaixe (simulador) → preço (sem mensalidade, regras da Solicitação Verificada) → CFM e LGPD → cadastro da clínica → lista de espera de pacientes → perguntas frequentes → rodapé. Banner de cookies com opcionais negados por padrão.

## Formulários e n8n

Sem configuração, os formulários rodam em **modo protótipo**: nada é enviado e a página mostra o JSON que iria para o n8n. Para enviar de verdade a um webhook de teste, defina antes do `main.js`:

```html
<script>
  window.KURAVI_CONFIG = {
    webhooks: {
      clinica: "https://<seu-n8n>/webhook/kuravi-clinica-lead",
      paciente: "https://<seu-n8n>/webhook/kuravi-paciente-espera"
    }
  };
</script>
```

Payload da clínica: `tipo`, `nome`, `email`, `telefone` (+55…), `clinica`, `cidade`, `especialidades[]`, `consentimento_lgpd`, `consentimento_versao`, `aceita_emails`, `origem`, `pagina`, `utm_source`, `utm_medium`, `utm_campaign`, `tempo_preenchimento_s`. O campo-armadilha `site_web` bloqueia robôs sem enviar nada.

> Em produção o navegador **não** fala direto com o n8n: o site recebe o formulário numa rota própria, valida, aplica limite de envios, assina com HMAC e só então repassa. Ver [docs/02-arquitetura.md](../docs/02-arquitetura.md#site-e-formulários-n8n).

## O que é fictício (trocar antes de publicar)

- Dados de demonstração: "Mariana S.", "Dra. Ana R.", "Clínica Exemplo", código `KV-7K2Q`, horários e o tempo de "4 minutos" do simulador.
- Rodapé: `[RAZÃO SOCIAL]` e `[CNPJ]`; links de Política de Privacidade, Termos e Encarregado de dados apontam para âncoras.
- Preço por solicitação: o texto diz "valor fixo por especialidade, definido no piloto" (não há preço decidido).
- "Resposta em até 1 dia útil" e "conversa de 20 minutos" são promessas operacionais: confirmar com o time.
- Fontes vêm do Google Fonts; em produção, hospedar no próprio site (como no integriguard.tech).
