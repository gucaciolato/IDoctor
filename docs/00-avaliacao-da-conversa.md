# 00 · Avaliação da conversa (14/11) e do modelo de receita

> Contexto: pitch original "iDoc, o iFood da Saúde" + conversa entre Bruno Souza e Gu Caciolato sobre eliminar a mensalidade no MVP.
> Marca definida depois da pesquisa de nome: **Kuravi** (codinome do repositório: iDoctor). Ver [06-marca-e-nome.md](06-marca-e-nome.md).

> ⚖️ Este documento traz análise de negócio e de risco regulatório, **não é parecer jurídico**. Os pontos marcados com ⚖️ precisam de validação com advogado de direito médico / LGPD antes do lançamento.

---

## 1. O que foi proposto

| Quem | Proposta | Intenção |
|---|---|---|
| Pitch original | Mensalidade SaaS + % sobre consulta particular + destaque pago | Três receitas: recorrente, transacional e mídia |
| Bruno | Tirar a mensalidade no início | Reduzir atrito: o médico só paga depois de ver que somos um bom canal de pacientes |
| Gu | Tirar a mensalidade e cobrar **só comissão** sobre o pagamento | Alinhar receita ao valor gerado |
| Bruno | Cobrar **por contato gerado** (R$ 5): paciente clica no link e a clínica recebe a mensagem *"Olá, vi seu perfil pelo iDoc e gostaria de verificar disponibilidade para consulta."* | Facilitar a venda: "é melhor que mensalidade na apresentação" |

## 2. O que a conversa acerta

1. **O atrito de entrada é o maior inimigo de um marketplace de saúde.** Clínicas já pagam Doctoralia, sistema de agenda, Google Ads e Instagram. Mais uma mensalidade, sem prova de resultado, perde a venda. "Sem mensalidade" é um argumento comercial forte.
2. **Cobrar por resultado (performance) alinha o incentivo.** "Você só paga quando um paciente real te procura" é fácil de explicar e de comparar com o custo de um lead no Google Ads (em saúde, normalmente bem acima de R$ 5).
3. **O primeiro contato via WhatsApp é um ótimo MVP.** Não exige integrar agenda nem mudar a rotina da recepção. Prova a demanda antes de construir a agenda em tempo real (o produto mais caro).
4. **O foco na apresentação de venda está certo.** O modelo de cobrança é parte do funil de vendas para clínicas, não só do financeiro.

## 3. Onde estão os riscos

### 3.1 ⚖️ Ética médica (CFM): o ponto mais sensível

O Código de Ética Médica (Res. CFM nº 2.217/2018) veda ao médico, entre outros:

- **Art. 58:** o exercício mercantilista da Medicina;
- **Art. 59:** *oferecer ou aceitar remuneração ou vantagens por paciente encaminhado ou recebido*;
- **Art. 72:** estabelecer vínculo com empresas que anunciam ou comercializam **cartões de descontos**, planos de financiamento ou consórcios para procedimentos médicos.

Como cada modelo se encaixa:

| Modelo | Leitura de risco | Por quê |
|---|---|---|
| **% sobre o honorário da consulta** (proposta do Gu) | 🔴 **Alto** | Parece partilha de honorários e "remuneração por paciente recebido" (Art. 58/59). Também cria incentivo para a plataforma empurrar procedimentos mais caros. |
| **R$ por paciente agendado/atendido** | 🟠 Médio-alto | Vincula o pagamento ao paciente efetivamente recebido. |
| **R$ por contato/solicitação** (proposta do Bruno) | 🟡 Médio, **defensável** | Pode ser enquadrado como **publicidade por desempenho** (como o custo por clique do Google Ads, que médicos usam legalmente): paga-se pelo serviço de mídia e tecnologia, **independentemente de a consulta acontecer**. |
| **Mensalidade fixa (SaaS)** | 🟢 Baixo | Remunera o software e o perfil, não o paciente. É o modelo predominante das plataformas consolidadas no país. |
| **Taxa de conveniência paga pelo paciente** no pagamento online | 🟢 Baixo-médio | Remunera o serviço de pagamento prestado ao paciente; não sai do honorário do médico. Precisa ser transparente (CDC). |

**Conclusão:** a ideia do Bruno (cobrar por contato) é mais segura que a do Gu (comissão), desde que o enquadramento seja *serviço de mídia/tecnologia com preço fixo por solicitação*, e não *percentual sobre o atendimento*. Antes de vender, pedir **parecer jurídico** e, idealmente, fazer uma **consulta formal ao CRM** do estado piloto.

### 3.2 Comissão sobre o pagamento não paga as contas

- **Consultas por convênio não passam pelo app.** O convênio paga a clínica via faturamento TISS. Num app cuja promessa central é "veja quem atende seu plano", a maior parte do volume seria **convênio, com receita zero** no modelo só-comissão.
- **Vazamento (desintermediação):** depois da primeira consulta, o paciente tem o telefone da clínica e volta direto. É o mesmo problema que o iFood enfrenta com restaurantes, só que pior: em saúde o vínculo médico-paciente é recorrente e pessoal.

### 3.3 "Clique no WhatsApp" é um evento de cobrança frágil

- **Não dá para provar que a mensagem foi enviada:** um link `wa.me` abre o WhatsApp, mas a plataforma não sabe se o paciente apertou "enviar".
- **Fraude e contestação:** cliques curiosos, duplicados, de concorrentes ou de robôs. A clínica contesta a fatura e a relação azeda.
- **Contradiz a proposta de valor:** o pitch diz "sem precisar ligar para a recepção ou esperar retorno no WhatsApp". Mandar o paciente para o WhatsApp é, no curto prazo, exatamente a "lista telefônica" que criticamos. Serve como degrau de MVP, não como produto final.

## 4. Recomendação: "Perfil grátis + Solicitação Verificada"

### 4.1 Evento de cobrança: a **Solicitação Verificada**, não o clique

Uma solicitação conta (e é cobrada) quando, ao mesmo tempo:

1. o paciente informou **nome, especialidade/exame, convênio ou particular e preferência de horário**;
2. o **telefone foi verificado por código** (OTP por WhatsApp/SMS);
3. **não é duplicada**: mesmo paciente + mesma clínica + mesma especialidade em 7 dias conta como 1;
4. a clínica **recebeu** a solicitação no painel e/ou no WhatsApp Business dela (registro com data e hora).

A mensagem que a clínica recebe continua no espírito do Bruno, agora com dados úteis e um código rastreável:

> *"Olá! A Mariana (WhatsApp verificado) encontrou vocês pela **Kuravi** e quer agendar **Dermatologia** pelo **Unimed Nacional**, de preferência **terça ou quarta à tarde**. Código da solicitação: **KV-7K2Q**."*

Regras que protegem a relação com a clínica:

- **contestação em até 72 h** (telefone inválido, fora do perfil, duplicata não detectada), com estorno automático de crédito;
- **teto diário/mensal** configurável pela clínica (ela nunca leva susto);
- **créditos pré-pagos** (sem inadimplência) com **pacote de boas-vindas grátis** (ex.: 10 primeiras solicitações).

### 4.2 Escada de monetização

| Fase | O que a clínica paga | O que o paciente paga | Objetivo |
|---|---|---|---|
| **0: Validação** (concierge) | Nada (piloto gratuito) | Nada | Provar demanda e conversão com 20 a 50 clínicas |
| **1: MVP** | Perfil **grátis** + **Solicitação Verificada pré-paga** (preço fixo por especialidade, ex.: R$ 5 a R$ 15) | Nada | Receita por desempenho, venda fácil |
| **2: Agenda real** | Plano **SaaS opcional** (agenda em tempo real, Modo Encaixe, pré-check-in, lembretes contra faltas) **com solicitações incluídas** | **Taxa de conveniência** opcional no pagamento online de consulta particular | Recorrência + retenção (a agenda vive aqui, o que reduz o vazamento) |
| **3: Mídia** | **Destaque** na busca, sempre com o selo "Patrocinado" | Nada | Receita de mídia sem corromper o ranking orgânico |

**O "Modo Encaixe" nunca é vendido como desconto.** O apelo é *rapidez* ("vagou um horário hoje às 15h"), não preço. Encaixe com desconto vira promoção, o que a publicidade médica restringe ⚖️, e treina o paciente a esperar a promoção.

### 4.3 Discurso de venda para a clínica

> **"Sem mensalidade. Sem fidelidade. Você só paga quando um paciente com WhatsApp verificado pede um horário, e as 10 primeiras são por nossa conta."**

### 4.4 Conta de padaria (hipóteses, **não são dados reais**)

Clínica de dermatologia no piloto:

| Item | Hipótese |
|---|---|
| Solicitações verificadas/mês | 40 |
| Preço por solicitação | R$ 8 |
| Custo mensal para a clínica | **R$ 320** |
| Taxa solicitação → consulta realizada | 40% → 16 consultas |
| Custo por paciente atendido | **R$ 20** |
| Ticket médio particular | R$ 350 |

Plataforma no fim do piloto (hipótese): 150 clínicas × 30 solicitações × R$ 7 ≈ **R$ 31,5 mil/mês**, antes de SaaS e mídia. Todos os números devem ser substituídos pelos dados reais da Fase 0.

## 5. O que precisamos validar na Fase 0

| Hipótese | Como validar | Sinal de sucesso |
|---|---|---|
| Clínicas aceitam pagar por solicitação | 20 entrevistas + 10 cartas de intenção | ≥ 6 clínicas topam o pacote pré-pago depois das grátis |
| Pacientes querem achar "quem atende meu plano nessa especialidade" | Lista de espera + teste com anúncios (R$ 1.000) | Custo por cadastro na lista ≤ R$ 6 |
| A clínica responde rápido | Piloto concierge (planilha + WhatsApp) | Mediana de resposta ≤ 30 min em horário comercial |
| Solicitação vira consulta | Acompanhar no piloto | ≥ 35% de solicitação → consulta realizada |
| ⚖️ O modelo de cobrança é aceito pelo CRM | Parecer jurídico + consulta ao CRM | Parecer favorável, sem ressalvas impeditivas |

## 6. Decisões que essa avaliação pede

1. Aprovar **Solicitação Verificada** como evento de cobrança do MVP, no lugar do clique e da comissão.
2. Contratar **parecer jurídico** (direito médico + LGPD) antes de cobrar qualquer clínica.
3. Definir a **cidade piloto** pelos critérios em [01-produto.md](01-produto.md#cidade-piloto).
