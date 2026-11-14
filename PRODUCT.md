# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Prototype: static HTML/CSS/JS (user decision, `prototype/`). Production site: Vite + React Router 7 (framework mode, SSR) + Tailwind CSS v4, Directus for the blog, n8n for forms, lightweight self-hosted SMTP, all on Coolify. Same stack as integriguard.tech. Backend NestJS; patient app in Flutter (iOS/Android); clinic portal on the same web stack as the site.

## Users

- **Primary audience for the site (first):** clinic managers, independent doctors and receptionists at private clinics in Brazil. They want new patients without a monthly fee and want to fill empty slots left by last-minute cancellations. They evaluate on a desktop at the clinic or on the phone between patients.
- **Secondary audience:** patients with a health plan (convênio) or paying privately who want to book a doctor or exam without calling the front desk or waiting for a WhatsApp reply. On the site they only join a waitlist.

## Product Purpose

Kuravi is a health marketplace ("the iFood of healthcare"): patients see who **actually accepts their plan for that specific specialty**, see the next available time and request it in a few taps. Clinics get verified appointment requests and pay only per verified request (no monthly fee in the MVP), plus "Modo Encaixe" to refill a cancelled slot fast. Success = consultations that actually happened via Kuravi per week.

## Positioning

- Plan × specialty × professional coverage matrix, kept current by the clinic and confirmed on every request.
- **Solicitação Verificada:** the clinic pays a fixed price only when a patient with a verified phone requests a time. No commission on medical fees (CFM ethics).
- **Modo Encaixe:** a freed slot notifies, in waves, patients who asked "tell me if something opens earlier". Sold on speed, never on discount.
- Compliance as a feature: verified CRM/RQE profiles, transparent ranking, notifications that never reveal the specialty.

## Operating Context

Brazilian private healthcare. Clinics juggle phone, WhatsApp and the front desk; health plan rules (ANS, TISS) govern convênio visits. Every surface must respect LGPD (health data is sensitive) and CFM medical advertising rules (Res. CFM 2.336/2023: CRM/UF + RQE, no sensationalism, no promises, no discounts as bait).

## Capabilities and Constraints

- MVP: search (specialty/exam + plan + radius + period), professional/clinic profile, appointment request, clinic inbox, prepaid credits, reminders, privacy center. Later: real-time agenda, pre-check-in (insurance card and ID photos), online payment for private visits, sponsored placement labelled "Patrocinado".
- Out of scope for the MVP: telemedicine, medical records, public clinical reviews.
- Pilot city undecided. Initial specialties: dermatology, gynecology, ophthalmology, orthopedics, pediatrics, imaging exams.
- Copy is Brazilian Portuguese.

## Brand Commitments

- Name: **Kuravi** (cura + vida). Repository codename: iDoctor. Never use "iFood" or other third-party marks in public copy.
- Logo must relate to cura + vida **and** to medicine; designed in Canva (user requirement).
- Voice: agile, trustworthy, human. Fast like a delivery app, serious like a doctor's office. Plain Portuguese, no medical hype.

## Evidence on Hand

None yet: no customers, testimonials, logos, metrics or press. Future work must not invent clinics, testimonials, ratings, user counts or partnerships. Business numbers in `docs/00-avaliacao-da-conversa.md` are labelled hypotheses.

## Product Principles

1. The patient finds a real "yes": coverage and availability must be true, or the product is just another phone book.
2. Pay for results, not promises: the clinic pays only for verifiable value.
3. Privacy by default: the specialty never leaks into notifications, logs or ads.
4. Speed without pressure: urgency comes from real availability, never from discounts or dark patterns.
5. The clinic's front desk is a user too: every request arrives complete and answers with one tap.

## Accessibility & Inclusion

WCAG 2.2 AA. Audiences include older patients and caregivers: large touch targets, generous type, high contrast, no reliance on color alone, reduced-motion support.
