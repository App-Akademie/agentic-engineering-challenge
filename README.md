# Agentic Engineering: Ein Feature vom Vertrag bis zur Abnahme

Ein vollständiges Lehrprojekt zur Task-Archivierung mit Express und JavaScript. Aufgabenstellung, unveränderter Ausgangspunkt, fertige Referenz, automatisierte Prüfungen und Mentor-Walkthrough liegen zusammen vor.

## Schnellstart

Voraussetzung: Node.js ab Version 22 und npm. Alle Befehle im Projektordner ausführen.

```sh
npm ci
npm test
npm run start:starter
```

Der Starter läuft unter `http://127.0.0.1:3000`. Mit Strg+C beenden. Danach die fertige Lösung starten:

```sh
npm run start:reference
```

Die Referenz bietet unter `http://127.0.0.1:3000/` eine einfache Browser-Oberfläche: Tasks anlegen, abschließen und anschließend archivieren. Filter zeigen aktive, offene, abgeschlossene oder archivierte Tasks; „Refresh“ lädt den aktuellen Serverstand neu. JavaScript muss aktiviert sein. Die Oberfläche nutzt dieselbe HTTP-API und denselben In-Memory-Speicher. Der Starter bleibt eine reine API.

Die aufklappbare Walkthrough-Checkliste führt Teilnehmende durch acht Schritte mit kopierbaren Prompts für Sitzung 1, Sitzung 2, eine frische Prüfsitzung und die Abnahme. Sie folgt `docs/PROMPTS.md`; die Aufgabe wird weiterhin in `starter/` bearbeitet. Häkchen werden nur im lokalen Browser gespeichert und ersetzen keine eigenen Prozess- und Prüfnachweise. Bei gesperrtem Browserspeicher funktionieren sie bis zum Neuladen. Die Task-Speicherung bleibt davon unabhängig.

Alternativer Port: `PORT=3001 npm run start:reference` (macOS/Linux). Unter PowerShell zuerst `$env:PORT=3001` setzen. Der Server bindet nur lokal. Daten liegen im Speicher und gehen bei jedem Neustart verloren. Dies ist eine lokale Übungsanwendung ohne Anmeldung und dauerhafte Speicherung.

## Wo anfangen?

| Rolle / Ziel | Einstieg |
|---|---|
| Lernende | [AUFGABENSTELLUNG.md](AUFGABENSTELLUNG.md), anschließend nur `starter/` bearbeiten |
| Mentor:in | [WALKTHROUGH.md](WALKTHROUGH.md) für eine begleitete Sitzung von etwa 70 Minuten |
| Lösung verstehen | [SPEC.md](reference/SPEC.md), dann `reference/src/` und `reference/test/` |
| Prozess nachvollziehen | [ENTSCHEIDUNGEN.md](reference/ENTSCHEIDUNGEN.md), [HANDOVER.md](reference/HANDOVER.md) und [VERIFIKATION.md](reference/VERIFIKATION.md) |
| Eigene Abgabe vorbereiten | [ABGABE-CHECKLISTE.md](docs/ABGABE-CHECKLISTE.md) |
| Agenten anleiten | [PROMPTS.md](docs/PROMPTS.md) |
| HTTP ausprobieren | [API.md](docs/API.md) |
| Lokales Werkzeug verstehen | [WERKZEUG.md](docs/WERKZEUG.md) |

Die Referenz ist zum Nachschlagen und für die Nachbesprechung gedacht. Wer selbst übt, liest sie erst nach dem eigenen Versuch. Du kannst den Starter im selben Projekt bearbeiten; beide Varianten teilen ausschließlich Testhilfen und installierte Abhängigkeiten.

## Befehle

```sh
npm run test:starter              # bestehendes Verhalten, 5 Tests
npm run test:reference            # Bestand + Feature + Oberfläche, 23 Tests
npm test                         # beide Varianten, 28 Tests
npm run tool:check -- starter     # strukturierte Ausgabe des lokalen Werkzeugs
npm run tool:check -- reference
npm run demo:regression           # bewusst roter Test gegen temporär eingebauten Fehler
npm run verify                    # Tests, Werkzeug, Demo und echte HTTP-Aufrufe; aktualisiert evidence/
```

`demo:regression` verändert keine Projektdatei. Die Ausgabe zeigt einen absichtlich fehlgeschlagenen Test. Der Demobefehl endet erfolgreich, wenn genau dieser erwartete Fehler nachgewiesen wurde. Ein unerwarteter Ausführungsfehler wird nicht als erfolgreicher Nachweis gewertet.

## Aufbau

```text
AUFGABENSTELLUNG.md          vollständiger Arbeitsauftrag auf Deutsch
WALKTHROUGH.md              Moderationsablauf und Auflösung
starter/src/                kleine bestehende Task-API ohne Archivierung
starter/test/               Tests des Bestands
reference/src/              fertige Implementierung
reference/public/           Browser-Oberfläche ohne Build-Schritt
reference/test/             Bestands- und Featuretests mit kontrollierter Zeit
reference/*.md              Constitution, Spec und Prozessbeispiele
tools/                      direkte Werkzeugdefinition, Testaufruf und Fehlerdemo
test-support/               gemeinsame Tests und Fixtures
docs/                       Prompts, API, Werkzeugbeschreibung, Abgabe
evidence/                   tatsächliche Prüfausgaben und Vergleich Starter → Referenz
```

## Herkunft und Geltungsbereich

Ausgearbeitet zum Kurs [Agentic Engineering, v1.0.0](https://lms.app-akademie.com/content?view=skill-editor&id=185a0a3b-a355-4942-9088-e34fa30d3d66&version=05fdb2ca-549e-42de-afcf-632b068f33c9). Das Beispiel konkretisiert die offene Featurewahl aus dem LMS als Task-Archivierung. Es ist ein eigenständiges Lehrpaket, keine exportierte offizielle Musterabgabe.

Entscheidungsprotokoll und Handover sind ausdrücklich didaktische Muster. Sie behaupten keine real stattgefundenen Sitzungen mit mehreren Agenten. Tatsächlich ausgeführte Prüfungen stehen getrennt in `evidence/`. Die zweite, unabhängige Prüfsitzung ist eine Aufgabe für Lernende; ein neuer Prompt allein garantiert keine unabhängige Beurteilung.
