# Customer Profile – Veranstalter von CTF-Events

## 1. Customer Jobs (Aufgaben / Ziele)

- Organisieren CTF-Events (z. B. an Unis, Meetups, Hackathons).
- Müssen Challenges bereitstellen und verwalten.
- Wollen reibungslosen Ablauf für Teilnehmer sicherstellen.
- Müssen Infrastruktur (Netzwerk, Server, Zertifikate) aufbauen.
- Wollen Aufwand und technische Fehlerquellen minimieren.

## 2. Pains (Probleme / Herausforderungen)

- Setup und Betrieb einer CTF-Plattform ist zeitaufwendig und fehleranfällig.
- Komplexes Management von SSL-Zertifikaten und DNS (z. B. für Subdomains).
- Teilnehmer können sich gegenseitig stören, wenn keine Isolation vorhanden ist.
- Abhängigkeit vom Internet bei Online-Plattformen → Weniger flexibel & ggf. mit hohen Kosten verbunden.
- Schlechte Skalierbarkeit bei vielen Teams oder parallelen Challenges.
- Fehlende Ressourcen oder Know-how für stabiles Hosting.

## 3. Gains (Erwartete Vorteile / Mehrwert)

- Plug-and-play CTF-System für lokale Nutzung.
- Einfaches Challenge-Deployment (automatisiert, dockerisiert).
- Vollständige Kontrolle über Event, Plattform und Daten.
- Isolierte Challenge-Umgebungen pro Teilnehmer.
- Wildcard-Zertifikate & automatische SSL → kein Zertifikate-Stress.
- Reibungsloser Ablauf, weniger technische Probleme → besseres Eventerlebnis.

# Value Map – zeroday.pw

## 4. Products & Services

- Lokale **CTF-Plattform** speziell für Onsite-Events.
- **Docker-basierte Challenge-Verwaltung** mit automatischem Deployment.
- Integrierter **lokaler Server**, kein Internet nötig.
- Automatisches **SSL-Zertifikatsmanagement** mit Wildcard-Unterstützung.
- Weboberfläche für Scoreboard, Challenge-Browsing und Feed

## 5. Pain Relievers

- Kein manuelles Setup nötig – CTF-Event kann mit wenig Aufwand vorbereitet werden.
- Komplettes SSL-Handling inklusive Wildcard-Zertifikaten → automatisiert.
- Challenge-Isolation per Docker → verhindert technische Probleme zwischen Teilnehmern.
- Offline-fähiger Server → stabil auch bei schlechter Internetverbindung.
- Minimiert Support-Aufwand während des Events.

## 6. Gain Creators

- Schnell einsatzbereit → mehr Fokus auf Content & Teilnehmer statt Technik.
- Hohe Flexibilität → ideal für kleine & große Events.
- Teilnehmer starten Challenges selbst.
- Professioneller Eindruck durch saubere Plattform & automatisierte Prozesse.

