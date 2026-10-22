# API ausprobieren

Server mit `npm run start:reference` starten. Die folgenden Beispiele verwenden curl; beide Server speichern nur im Arbeitsspeicher. Header und Endpunkte funktionieren auch in einem HTTP-Client deiner Wahl.

## Task anlegen

```sh
curl -i -X POST http://127.0.0.1:3000/tasks \
  -H 'Content-Type: application/json' \
  -d '{"title":"Walkthrough vorbereiten"}'
```

Erwartet: 201 und ein Task mit `status: "open"`. Kopiere seine `id`; ersetze `<id>` in den nächsten Befehlen damit.

## Offenen Task archivieren: fachlicher Fehler

```sh
curl -i -X POST 'http://127.0.0.1:3000/tasks/<id>/archive'
```

Erwartet: 409, `error.code = "not_completed"`.

## Abschließen, berichten, archivieren

```sh
curl -i -X POST 'http://127.0.0.1:3000/tasks/<id>/complete'
curl http://127.0.0.1:3000/report/summary
curl -i -X POST 'http://127.0.0.1:3000/tasks/<id>/archive'
curl http://127.0.0.1:3000/report/summary
```

Bei genau einem Task geht `completedCount` von 1 auf 0. Die Archivierung liefert denselben Task mit `status: "archived"` und einem gesetzten `archivedAt`.

## Idempotenz und Schutz des Endzustands

```sh
curl -i -X POST 'http://127.0.0.1:3000/tasks/<id>/archive'
curl -i -X POST 'http://127.0.0.1:3000/tasks/<id>/complete'
```

Erwartet: Archivierung erneut 200 und identischer Task einschließlich Zeitstempel. Complete liefert 409, `invalid_transition`.

## Sichtbarkeit

```sh
curl http://127.0.0.1:3000/tasks
curl 'http://127.0.0.1:3000/tasks?status=archived'
curl 'http://127.0.0.1:3000/tasks/<id>'
```

Ohne Filter fehlen archivierte Tasks. Mit explizitem Archivfilter und über die ID bleiben sie lesbar.

## Bulk-Aufruf

```sh
curl -i -X POST http://127.0.0.1:3000/tasks/archive-completed \
  -H 'Content-Type: application/json' \
  -d '{"olderThanDays":7}'
```

Neu angelegte Tasks sind noch keine sieben Tage alt; `{ "archivedCount": 0 }` ist deshalb korrekt. Die automatisierten Tests erzeugen alte Tasks mit einer injizierten Uhr und prüfen die genaue Grenze ohne tagelanges Warten. Die API bietet absichtlich keinen Endpunkt, mit dem Abschlusszeiten nachträglich manipuliert werden.

Eine ungültige Schwelle zeigt das Fehlerformat:

```sh
curl -i -X POST http://127.0.0.1:3000/tasks/archive-completed \
  -H 'Content-Type: application/json' \
  -d '{"olderThanDays":0}'
```

Erwartet: 400, `invalid_threshold`.

## Endpunkte im Überblick

| Methode | Pfad | Starter | Referenz |
|---|---|---|---|
| POST | `/tasks` | anlegen | anlegen |
| GET | `/tasks` | open/completed, optionaler Filter | zusätzlich archived; ohne Filter ausgeblendet |
| GET | `/tasks/:id` | lesen | lesen, auch archived |
| POST | `/tasks/:id/complete` | abschließen / wiederholen | zusätzlich Reaktivierungsschutz |
| POST | `/tasks/:id/archive` | nicht vorhanden | Einzelarchivierung |
| POST | `/tasks/archive-completed` | nicht vorhanden | Bulk-Archivierung |
| GET | `/report/summary` | aktuelle completed-Zählung | ausdrücklich nur completed |
