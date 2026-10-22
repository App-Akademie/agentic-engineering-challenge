# Challenge Walkthrough — Moderationsleitfaden

Dieser Ablauf folgt auf den eigenen Bearbeitungsversuch. Ziel ist, die Entscheidungen eines agentischen Feature-Zyklus sichtbar und überprüfbar zu machen. Die Referenz ist eine mögliche Lösung, kein Beweis, dass andere Lösungen schlechter sind.

**Dauer:** ungefähr 70 Minuten. **Vorbereitung:** Node.js ab 22, `npm ci`, funktionierender Testlauf. Die Lernenden benötigen im eigenen Projekt zwei echte Sitzungen. In dieser Nachbesprechung wird der Sitzungswechsel demonstriert. Prozessnotizen und der schlechte Plan sind markierte Lehrbeispiele; es gibt keinen erfundenen Agentenverlauf.

## 0. Ausgangspunkt sichtbar machen — 5 Minuten

Öffne `AUFGABENSTELLUNG.md`, `starter/src/app.js` und `starter/src/taskStore.js`. Führe `npm run test:starter` aus. Zeige: Der Report zählt aktuell `status !== 'open'`. Mit nur zwei Zuständen funktioniert das.

Lass die Gruppe vorhersagen: „Welche bestehende Funktion kann durch einen dritten Zustand ihre Bedeutung ändern, obwohl wir sie zunächst nicht anfassen?“ Noch nicht auflösen. Zeige die API bei Bedarf mit den Befehlen aus `docs/API.md`.

**Ergebnis:** getesteter Bestand, konkrete Featuregrenze, erste Hypothese über eine Regression.

## 1. Steuerungsfundament — 12 Minuten

Lass die Gruppe Constitution und Spec unterscheiden: „Zugriff nur über das Repository“ ist beständig; „Archivieren eines offenen Tasks liefert 409“ gehört zum Feature. Öffne anschließend `reference/CONSTITUTION.md`.

Formuliere die Spec zunächst bis auf A2 und A7. Frage vor der Auflösung:

- „Was soll ein Client bei einem erneuten Archivierungsaufruf erhalten?“
- „Was bedeutet unser Report: aktuelle abgeschlossene Tasks oder historische Abschlüsse?“

Für diese Referenz gilt: zweiter Aufruf identisch erfolgreich, Report zählt ausschließlich aktuelle completed-Tasks. Ein historischer Bericht dürfte anders definiert werden. Öffne `reference/SPEC.md` und halte fest, welche zwei stillen Entscheidungen dadurch ausgeschlossen sind.

Ergänze A5 und die Zeitgrenze ausdrücklich: Ein bestehender Complete-Endpunkt darf keine Reaktivierung ermöglichen; die Bulk-Grenze ist inklusive und basiert auf 24 Stunden. Die genaue Uhrzeit wird in Tests kontrolliert.

**Ergebnis:** verbindliche Regeln vor der Implementierung. **Mentorenprüfung:** Kann die Person zwei Regeln mit ihrer vermiedenen Alternative erklären?

## 2. Werkzeugwahl — 8 Minuten

Öffne `docs/WERKZEUG.md` und `tools/definition.json`. Vergleiche Skill, MCP und direkte Definition anhand des tatsächlichen Zugriffsbedarfs.

Für dieses Beispiel wird ein direkter Testaufruf im Code gewählt. Es gibt keinen externen Dienst und noch keinen mehrfach erprobten speziellen Arbeitsablauf, der einen zusätzlichen Skill rechtfertigt. Ein anderer Kontext kann zu einer anderen Wahl führen.

```sh
npm run tool:check -- starter
```

Lies `target`, `ok`, `exitCode` und die echte Testausgabe. Zeige `runProjectTests({ target: 'starter' })` in `tools/run-tests.js`: erlaubte Ziele, kein Shell-String, begrenzte Laufzeit, fester Projektpfad. Die JSON-Definition beschreibt den Vertrag; sie registriert sich nicht selbst im Agenten-Host.

**Ergebnis:** Wahl plus eingerichtetes, nachprüfbares Werkzeug. **Mentorenprüfung:** Wird ein konkretes Problem gelöst oder nur eine Technik vorgeführt?

## 3. Plan, Umsetzung und Kontext — 20 Minuten

### Plan prüfen

Nutze den Planungs-Prompt aus `docs/PROMPTS.md`. Als ausdrücklich **didaktischen Gegenentwurf** zeigst du:

> Entferne abgeschlossene Tasks aus der Haupt-Map und verschiebe sie beim Archivieren in eine zweite Map. Lasse bestehende Endpunkte unverändert.

Lass die Gruppe die Konflikte benennen: kein gemeinsamer Statusverlauf mehr, Einzelabruf müsste verändert werden, Complete und Report bleiben ungeprüft. Ein separater Archivspeicher ist nicht grundsätzlich falsch; er passt hier nicht zum ausdrücklich vereinbarten Vertrag.

Der akzeptierte Referenzplan steht in `reference/PLAN.md`. Gehe ihn gegen die Spec durch, bevor du Code zeigst.

### Umsetzung in kleinen Schritten

Vergleiche Starter und Referenz anhand von `evidence/starter-to-reference.diff`. Beginne beim Store und gehe danach zu den Routen. Diskutiere den idempotenten Zweig, den Schutz im bestehenden Complete-Endpunkt und den einmaligen Zeitstempel im Bulk-Lauf. Zeige die Tests A1–A6, dann B1–B6.

### Echte Kontextgrenze demonstrieren

Öffne `reference/HANDOVER.md`. Dieses Muster beschreibt einen **Zwischenstand**, nicht den aktuellen fertigen Ordner. Erstelle für einen realen Durchlauf eine Notiz aus dem tatsächlichen eigenen Zwischenstand und schließe die Generierungssitzung. Starte eine frische Sitzung mit der aktuellen Spec, Constitution, Notiz und den benötigten Dateien.

Die Handover-Notiz ersetzt die alten Überlegungen, bewahrt aber offene Fragen und bekannte Risiken. Ohne Vergleich lässt sich nicht behaupten, sie verhindere garantiert einen Fehler oder reduziere messbar Kosten. Sichtbar nachweisbar ist, welche Informationen bewusst ausgewählt wurden.

**Ergebnis:** korrigierter Plan, verständliche Implementierung, nachvollziehbarer Kontextwechsel.

## 4. Getrennte Verifikation — 20 Minuten

### Prüfung ohne Generierungserzählung

In einer echten Prüfsitzung bekommt die prüfende Person Spec, Constitution, Diff und Zugriff auf relevante Bestandsdateien sowie die Testbefehle. Keine Kommentare wie „Das ist bestimmt korrekt, weil …“. Nutze den Prüfprompt in `docs/PROMPTS.md`.

Frage zuerst: „Welche Annahmen des Bestands wurden durch den dritten Zustand ungültig?“ Schau insbesondere in den Report und den Complete-Endpunkt. Eine reine Diffansicht genügt nicht, wenn problematische Funktionen unverändert blieben.

### Kontrollierte rote Demonstration

```sh
npm run demo:regression
```

Das Skript kopiert den fertigen Store temporär und ersetzt ausschließlich den Reportfilter durch den alten Ausdruck `status !== 'open'`. Ein HTTP-Test archiviert einen Task und erwartet anschließend 0 abgeschlossene Tasks. Der fehlerhafte Filter liefert 1. Die Demo zeigt den roten Nachweis; die korrekte Referenz wird nicht verändert.

Das ist eine bewusst eingesetzte Regression, **kein Fund eines tatsächlich unabhängig arbeitenden Agenten**. Sie beweist die Empfindlichkeit dieses Tests für den Fehler. Sie ersetzt nicht die unabhängige Suche der Lernenden.

### Korrekte Referenz und Kriterienabgleich

```sh
npm run test:reference
npm test
```

Zeige den expliziten Filter `status === 'completed'`, den Reporttest A7 und den zusätzlichen Schutztest A5. Prüfe anschließend die vollständige Kriterienmatrix in `reference/VERIFIKATION.md`.

Besprich drei stärkere Prüfungen: A2 kontrolliert nicht nur HTTP 200, sondern den unveränderten Task einschließlich Zeitstempel; B1 trennt exakte Grenze und eine Millisekunde zu neuen Task; A5 überprüft eine Wechselwirkung mit bestehendem Code.

**Ergebnis:** nachvollziehbarer Fehlernachweis, korrekte Gegenprüfung, benannte Grenzen.

## 5. Abnahme und Transfer — 5 Minuten

Öffne die Abgabe-Checkliste. Lass eine Person eine zufällig gewählte Änderung vollständig erklären. Frage anschließend: „Was müsste sich ändern, wenn dieser Report historische Wochenabschlüsse zeigen sollte?“ Erwartet wird eine Änderung des fachlichen Vertrags und der Tests, kein reflexhaftes Zurücksetzen des Filters.

Diskutiere als zweite Transferfrage Persistenz: Ein Prozessneustart verliert hier alle Daten. Eine Datenbank wäre eine neue Anforderung mit eigenen Integritätsnachweisen. Die lokale Testsuite beweist keine Produktionsreife.

## Material zur Nachbesprechung

- `reference/SPEC.md`: Entscheidungen und Kriterien.
- `reference/ENTSCHEIDUNGEN.md`: begründete Beispielentscheidungen, keine echte Zeitleiste.
- `reference/VERIFIKATION.md`: Zuordnung Kriterium → Test.
- `evidence/`: echte Ausgaben beim Erstellen dieses Pakets; Lernende ersetzen sie durch ihre eigenen Nachweise.
