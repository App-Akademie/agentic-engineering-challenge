# Prompts für den eigenen Durchlauf

Ersetze Dateipfade und Testbefehle durch den tatsächlichen Arbeitsstand. Die folgenden Texte sind Vorlagen, keine Belege, dass ein Agent diese Arbeit bereits erledigt hat. Die Referenzunterlagen erst nach dem eigenen Versuch lesen.

## 1. Bestand verstehen und Vertrag vorbereiten

> Lies die Aufgabenstellung und die Quellen in starter/src sowie die Baseline-Tests. Führe npm run test:starter aus. Ändere noch keinen Anwendungscode. Beschreibe den Bestand, die Stellen, die von einem dritten Task-Status betroffen sind, und offene Produktentscheidungen für die Archivierung. Entwirf danach Constitution und Spec, wobei du offene Entscheidungen sichtbar lässt. Ich lege fest, welche Antworten verbindlich werden.

## 2. Plan vor Implementierung

> Lies starter/CONSTITUTION.md und starter/SPEC.md. Erstelle einen kurzen Umsetzungsplan mit betroffenen Dateien und einem Nachweis pro Regel. Berücksichtige auch unveränderte Bestandsfunktionen. Schreibe noch keinen Anwendungscode. Markiere jede Unklarheit oder Abweichung vom Vertrag; rate keine Produktentscheidung.

## 3. Werkzeugwahl

> Prüfe, ob die Aufgabe einen Skill, eine MCP-Anbindung oder eine direkte Werkzeugdefinition benötigt. Begründe die leichteste ausreichende Option. Lies tools/definition.json und tools/run-tests.js. Führe das lokale Testwerkzeug gegen starter aus und erläutere Ein- und Ausgabe. Behaupte keine automatische Integration in deinen Host, wenn keine eingerichtet ist.

## 4. Implementieren

> Implementiere den von mir bestätigten Plan in starter/. Gehe in kleinen Schritten vor und führe die jeweils relevanten Tests aus. Melde Vertragskonflikte vor einer Änderung der vereinbarten Semantik. Halte im Entscheidungsprotokoll konkrete Entscheidungen während der Arbeit fest. Ergänze zeitabhängige Tests mit einer kontrollierten Uhr.

## 5. Sitzung beenden

> Speichere eine kurze Handover-Notiz im Arbeitsprojekt: akzeptierte Entscheidungen, tatsächlicher Code- und Teststand mit Verweis auf die Ausgabe, offene Fragen, bekannte Grenzen und nächste Aktion. Bewahre Unsicherheiten, lasse verworfene Pläne aus der aktuellen Anweisung weg. Erfinde keine Testläufe oder erreichten Meilensteine.

## 6. Frische Sitzung beginnen

> Lies Constitution, Spec und die aktuelle Handover-Notiz im Arbeitsprojekt. Prüfe die genannten Dateien gegen den tatsächlichen Stand und fasse die nächste offene Arbeit zusammen. Lade weiteren Kontext nur gezielt. Setze dann den bestätigten Plan fort.

## 7. Unabhängiger Prüfauftrag

Diesen Auftrag in einer neuen Prüfsitzung verwenden. Code, Spec, Constitution und Diff zugänglich machen; Generierungsverlauf und dessen Rechtfertigungen nicht übernehmen.

> Prüfe die Implementierung gegen Spec und Constitution. Nutze den vollständigen Diff, die relevanten Bestandsdateien und reproduzierbare Testbefehle. Ordne jedem Kriterium konkrete Evidenz zu. Prüfe besonders Annahmen, die durch einen dritten Status ungültig werden, auch außerhalb des Diffs. Suche nach mindestens einem noch ungetesteten Fall und dokumentiere deine Suche. Liefere konkrete Befunde mit Ort und Gegenbeispiel. Wenn eine Testlücke vorliegt, ergänze einen aussagekräftigen Test und führe ihn aus. Behaupte keinen Fehler, falls du keinen nachweisen kannst. Markiere offene Fragen und Grenzen.

## 8. Abnahme durch die verantwortliche Person

> Gehe die Kriterienmatrix und den gesamten Diff mit mir durch. Erkläre jede Änderung und ihren Bezug zum Vertrag. Zeige die tatsächlichen Testausgaben, verbleibende Risiken und noch fehlende Nachweise. Trenne bewusst eingesetzte Lehrfehler von tatsächlich gefundenen Fehlern.
