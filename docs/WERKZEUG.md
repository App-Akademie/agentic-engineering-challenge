# Direkte Werkzeugdefinition im Code

## Entscheidung

Für dieses Projekt genügt ein lokaler Testaufruf mit festem Vertrag. Er benötigt weder einen externen Dienst noch einen MCP-Server. Ein zusätzlicher Skill ist bei diesem einzelnen Feature nicht erforderlich. Die Entscheidung gilt für diesen Auftrag, nicht allgemein gegen Skills oder MCP.

## Vertrag und Implementierung

- `tools/definition.json` beschreibt Name, Zweck und erlaubte Parameter.
- `tools/run-tests.js` exportiert die tatsächlich ausführbare Funktion.
- `target` erlaubt ausschließlich `starter` oder `reference`. Es gibt kein frei eingegebenes Kommando und keinen frei wählbaren Pfad.
- Der Prozess wird ohne Shell mit dem aktuellen Node gestartet. Testdateien werden im festen Projektunterordner ermittelt. Der Aufruf hat eine Grenze von 60 Sekunden.
- Zurück kommen `target`, `ok`, `exitCode`, `error`, `stdout` und `stderr`. Ein fehlgeschlagener Test wird nicht in einen Erfolg umgedeutet.

## Tatsächlicher Aufruf

```sh
npm run tool:check -- starter
npm run tool:check -- reference
```

Für reine JSON-Ausgabe ohne npm-Kopfzeile:

```sh
node tools/run-tests.js reference
```

Im JavaScript-Code:

```javascript
const definition = require('./tools/definition.json');
const { runProjectTests } = require('./tools/run-tests');

// Beispiel eines Dispatchers nach Validierung des Werkzeugnamens und Arguments.
const result = runProjectTests({ target: 'starter' });
console.log(definition.name, result.ok, result.exitCode);
```

Diese Dateien sind ein lauffähiges Beispiel für Vertrag und Ausführung einer direkten Werkzeugdefinition. Ein tatsächlicher Agenten-Host benötigt zusätzlich seinen eigenen Registrierungs-/Dispatcher-Code; das Paket enthält keine hostspezifische Integration. Ein vorhandener Terminalzugriff kann denselben CLI-Aufruf ausführen.

## Wann anders entscheiden?

Ein Skill ist sinnvoll, wenn ein wiederkehrender Ablauf mit Instruktionen und Ressourcen mehrfach gebraucht wird. MCP ist sinnvoll, wenn standardisierte Werkzeug-/Datenanbindung einen echten Integrationsbedarf löst. Auch ein einzelnes Projekt kann einen solchen Bedarf haben; die Zahl der Projekte ist kein Ausschlusskriterium.
