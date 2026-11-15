# 05 · Roadmap

Estimativas para um time enxuto (2 a 3 devs + 1 designer meio período). Cada fase só começa quando os critérios de saída da anterior forem atingidos.

## Fase 0 · Ideia, marca e validação (agora → ~6 semanas)

| Entrega | Status |
|---|---|
| Avaliação do modelo de receita | ✅ [00-avaliacao-da-conversa.md](00-avaliacao-da-conversa.md) |
| Plano de produto, arquitetura, observabilidade e compliance | ✅ docs 01 a 04 |
| Nome e domínios | ✅ **Kuravi**. Registrar `kuravi.com.br` e `kuravi.app` + checagem manual no INPI ([06-marca-e-nome.md](06-marca-e-nome.md)) |
| Identidade visual (Design do Claude + PDF para aprovação) | ✅ v1 em [`brand/`](../brand/README.md), aguardando aprovação de Gu e Bruno |
| Protótipo do site em HTML/CSS/JS | ⏳ Depois da identidade |
| Entrevistas: 20 clínicas e 30 pacientes | ⏳ |
| Parecer jurídico (cobrança + LGPD) | ⏳ |
| Piloto *concierge*: planilha + WhatsApp + formulário n8n | ⏳ |

**Critérios de saída:** ≥ 10 clínicas com carta de intenção; ≥ 300 pacientes na lista de espera na cidade piloto; parecer jurídico sem impeditivo.

## Fase 1 · MVP (~12 semanas)

- Site em produção (Vite + React Router 7 + Directus + n8n) no Coolify.
- API NestJS: `auth`, `providers`, `catalog`, `coverage`, `search`, `requests`, `billing`, `notifications`, `consent`, `privacy`, `audit`.
- App Flutter: busca, perfil, solicitar horário, acompanhar, lembretes, central de privacidade.
- Portal da clínica: cadastro verificado, matriz de convênios, caixa de solicitações, créditos.
- Elastic Stack com dashboards de Operações e Segurança & LGPD e os alertas críticos.
- Pentest + checklist de compliance.

**Critérios de saída:** 50 clínicas ativas, ≥ 50% solicitação → confirmada, contestação ≤ 5%.

## Fase 2 · Agenda real (~10 semanas)

- Agenda com slots em tempo real, reserva temporária e Modo Encaixe completo.
- Pré-check-in com documentos (criptografia por envelope, expurgo automático).
- Pagamento online de consulta particular com split e taxa de conveniência ⚖️.
- Plano SaaS opcional com solicitações incluídas.
- Integrações com sistemas de clínica mais usados na cidade piloto.

## Fase 3 · Escala e mídia

- Destaque "Patrocinado" com ranking orgânico transparente.
- Laboratórios e exames de imagem com preparo e resultado.
- Elegibilidade de convênio (TISS) e segunda cidade.
- Avaliar telemedicina (Res. CFM 2.314/2022).

## Próximas decisões (para você e o Bruno)

1. Aprovar a **Solicitação Verificada** como modelo de cobrança do MVP.
2. Escolher a **cidade piloto** pelos critérios de [01-produto.md](01-produto.md#cidade-piloto).
3. Registrar os domínios e iniciar o pedido de marca no INPI.
4. Aprovar a identidade visual (Canva) e o protótipo do site.
