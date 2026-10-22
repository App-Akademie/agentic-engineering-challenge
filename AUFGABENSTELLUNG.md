# Aufgabenstellung: Ein echtes Feature agentisch bauen

## Dein Auftrag

Du steuerst einen Agenten durch einen vollständigen Feature-Zyklus in einer bestehenden Codebasis: Steuerungsfundament, Werkzeugwahl, geführte Umsetzung, getrennte Verifikation. Jede Etappe verlangt eine bewusste Entscheidung darüber, wo du Kontrolle abgibst und wo du sie behältst. Du sollst den resultierenden Code vollständig erklären können.

Plane **ein bis drei Stunden über mindestens zwei Sitzungen** ein. Das Unterbrechen und Wiederaufnehmen gehört zur Aufgabe. Dokumentiere Entscheidungen dort, wo sie fallen. Für den begleiteten Walkthrough nach deinem Versuch sind etwa 70 Minuten vorgesehen.

Diese Fassung konkretisiert den offenen LMS-Auftrag am mitgelieferten Task-Projekt. Wer ein eigenes Projekt verwendet, benötigt mindestens zwei relevante Randfälle, einen Eingriff in bestehenden Code und eine lauffähige Testsuite. Derselbe Prozess und dieselben Nachweispflichten gelten.

## Ausgangspunkt

Arbeite in `starter/`. Die Express-API kann Tasks anlegen, auflisten, lesen und abschließen. `/report/summary` liefert die Anzahl abgeschlossener Tasks. Die Daten liegen in einem Repository im Speicher. Installiere im Projektordner die Abhängigkeiten mit `npm ci` und führe `npm run test:starter` aus. Behalte diesen Ausgangsbefund für deine Abgabe.

Die fertige Lösung liegt in `reference/`. Lies sie erst nach deinem eigenen Versuch. Du brauchst weder externe Konten noch kostenpflichtige Dienste.

## Das Feature

Ergänze eine Archivierung erledigter Tasks:

- `POST /tasks/:id/archive` archiviert einen abgeschlossenen Task.
- `POST /tasks/archive-completed` archiviert passende abgeschlossene Tasks anhand ihres Alters.
- Die normale Liste soll archivierte Tasks ausblenden; ein expliziter Filter darf sie anzeigen.
- Der bestehende Report muss zum vereinbarten fachlichen Vertrag passen.
- Ein archivierter Task darf über bestehende Endpunkte nicht wieder aktiviert werden.

Entscheide **vor dem Implementieren**: Verhalten bei wiederholten Aufrufen, unbekannten IDs, offenen Tasks, ungültiger Altersangabe, exakter Altersgrenze, Bedeutung von „Tag“ und Auswirkungen auf den Report. Die gemeinsame Referenz entscheidet diese Fragen in `reference/SPEC.md`; deine Entscheidungen dürfen abweichen, müssen aber ausdrücklich beschrieben und getestet sein.

## Etappe 1: Constitution und Spec als Steuerungsfundament

Schreibe `starter/CONSTITUTION.md` mit drei Kategorien:

1. Architektonische Grundentscheidung.
2. Durchgängige Konvention.
3. Harte Grenze.

Ergänze `starter/SPEC.md` mit konkreten und objektiv prüfbaren Regeln. Entscheide insbesondere Zustandsübergänge, Fehlercodes, Zeitgrenzen und Auswirkungen auf Bestand. Halte fest, welche Punkte verbindlich sind und wann eine Änderung der Spec zuerst mit dir abgestimmt werden muss.

**Nachweis:** Beide Dokumente liegen vor, bevor der Agent implementiert. Für mindestens zwei Punkte erklärst du, welche stille Entscheidung sie dem Agenten abnehmen. Trenne dauerhafte Projektregeln vom konkreten Featurevertrag.

## Etappe 2: Umgebung und Werkzeugwahl

Prüfe drei Optionen: eine wiederkehrende Fähigkeit als Skill bündeln, einen externen Zugriff über MCP anbinden oder eine direkte Werkzeugdefinition im Code verwenden. Wähle mindestens eine Option begründet und richte sie tatsächlich ein. Begründe in ein bis zwei Sätzen, warum aufwendigere Alternativen keinen zusätzlichen Nutzen für deine Aufgabe bringen.

Du darfst die mitgelieferte direkte Werkzeugdefinition in `tools/definition.json` und den ausführbaren Testaufruf in `tools/run-tests.js` verwenden. Führe ihn gegen den Starter aus und erkläre Ein- und Ausgabe. Der Aufruf muss nicht in einen bestimmten Agenten-Host integriert sein; zeige aber, wie ein Agent die Definition und die echte Ausgabe nutzen könnte. Eine CLI allein wird dadurch nicht automatisch als natives Host-Werkzeug registriert.

**Nachweis:** konkrete Definition oder Skill/Anbindung, funktionierender Aufruf und dokumentierte Wahl. MCP ist keine Pflicht und setzt auch nicht zwingend mehrere Projekte voraus: Entscheidend sind ein tatsächlicher Integrationsbedarf und ein angemessener Aufwand.

## Etappe 3: Geführte Umsetzung mit schlankem Kontext

Lass den Agenten zuerst einen Plan aus deiner Spec ableiten. Prüfe ihn und korrigiere Abweichungen vor der Implementierung. Lass anschließend in kleinen Schritten implementieren und passend testen. Arbeite mindestens über zwei Sitzungen.

Speichere vor dem Wechsel eine kurze Handover-Notiz: verbindliche Entscheidungen, betroffene Dateien, letzter Testbefund und offene Arbeit. Beginne die nächste Sitzung mit dieser Notiz und den relevanten Dateien. Verwende mindestens einen sichtbaren Hebel der Kontextkuration und begründe ihn. Behalte wichtige Einschränkungen und Unsicherheiten in der Verdichtung.

**Nachweis:** bestätigter Plan, lauffähige Implementierung, echter Sitzungswechsel sowie ein konkretes Beispiel für Kontextkuration. Beschreibe den erwarteten Nutzen; behaupte ohne Vergleich keine gemessene Verbesserung.

## Etappe 4: Getrennte Verifikation und Abnahme

Prüfe mit frischem Kontext selbst oder nutze einen zweiten Prüfer. Gib Spec, Constitution, vollständigen Diff, relevante Bestandsdateien und reproduzierbare Testbefehle weiter. Der Prüfer erhält nicht die Rechtfertigungen aus dem Generierungsverlauf. Unveränderte aufgerufene Funktionen dürfen gezielt gelesen werden, sonst können Regressionen außerhalb des Diffs verborgen bleiben.

Prüfe jeden Spec-Punkt einzeln. Lies den ganzen Diff und erkläre jede Änderung. Suche aktiv nach mindestens einem bislang ungetesteten Fall. Dokumentiere die Suche auch dann, wenn du keinen Fehler findest. Ergänze bei einer echten Lücke einen aussagekräftigen Test und zeige bei einem Fehler nach Möglichkeit den roten und den korrigierten grünen Lauf.

**Nachweis:** Kriterienmatrix, Suchbefund, tatsächliche Prüfausgaben, geklärte Annahmen und erklärbarer Diff. Eine grüne Suite ist Evidenz für ihre Fälle, kein allgemeiner Korrektheitsbeweis. Ein künstlich eingebauter Demofehler ersetzt nicht deine eigene Prüfsuche.

## Abgabe und Reflexion

Reiche Code, Tests, Installationsanleitung, Constitution, Spec, Entscheidungsprotokoll je Etappe, Sitzungs-Handover, vollständigen Diff und Verifikationsnachweise ein. Erläutere kurz eine bewusste Abwägung und eine verbleibende Grenze. Ein Remote-Merge ist für diese lokale Übung nicht erforderlich; zeige einen nachvollziehbaren, abnahmefähigen Stand.

## Fertig, wenn …

Die Regeln deiner Spec sind einzeln nachgewiesen, bestehendes Verhalten bleibt soweit vereinbart erhalten, dein Feature funktioniert nach einem frischen `npm ci`, und du kannst jede Änderung sowie deine Werkzeug- und Kontextentscheidungen erklären. Nutze zur Kontrolle `docs/ABGABE-CHECKLISTE.md`.
