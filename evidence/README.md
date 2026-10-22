# Tatsächliche Prüfnachweise

Die Dateien in diesem Ordner werden durch `npm run verify` erzeugt. `manifest.json` enthält Laufzeit, Umgebung, Prüfbefehle und SHA-256-Prüfsummen der ausgelieferten Quellen und Unterlagen. Zeitpunkte im Manifest sind UTC.

- `tests.txt`: vollständiger TAP-Lauf beider Varianten.
- `tool-starter.txt` / `tool-reference.txt`: strukturierte echte Ausgaben des direkten Testwerkzeugs.
- `regression-demo.txt`: erwarteter roter Reporttest in der temporär fehlerhaften Variante. Der Demobefehl selbst ist nur bei nachgewiesenem erwarteten Fehler erfolgreich.
- `http-starter.json` / `http-reference.json`: echte lokale HTTP-Aufrufe gegen die gestarteten Server mit zufälligen freien Ports. Die zufälligen Task-IDs und Zeitstempel variieren beim nächsten Lauf.
- `starter-to-reference.diff`: Quellvergleich der App-Dateien. Neue Tests und Dokumentation zusätzlich separat lesen; dieser Diff ist keine behauptete Git-Historie.

Die Ausgaben belegen lokale Prüfungen dieses Pakets. Sie belegen keinen separaten zweiten Agenten und keine vergangenen Lernendensitzungen. Das Entscheidungsprotokoll und die Handover-Notiz sind markierte didaktische Muster. Lernende erstellen ihre eigenen Nachweise während ihres Durchlaufs.
