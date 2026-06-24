# OpenCloud Web

OpenCloud Web ist das Frontend für die Plattform OpenCloud. Obwohl diese mit OpenCloud ausgeliefert wird, ist das Frontend eigenständig verwendbar.

Die Plattform OpenCloud ist eine quelloffene und selbstständig bereitellbare Alternative zu Diensten wie Google Drive oder Dropbox.

# Test Setup

Die Anwendung verfügt bereits über eine ausführliche Infrastruktur und Sammlung an Tests. An dieser wurde sich orientiert, um eine saubere Integration zu ermöglichen.

Die genaue Erklärung zu der vorhandenen Infrastruktur kann in der [Dokumentation von OpenCloud](https://docs.opencloud.eu/docs/dev/web/testing/) gefunden werden. Der Fokus von diesem Dokument bergrenzt sich rein auf die selbsterbrachte Leistung.

## Ermittlung der Test Coverage

Da die Anwendung bereits über Tests verfügt, wurde die Coverage ermittelt. Dabei wurde der Befehl `pnpm test:unit` um `--coverage` erweitert. Aus dem Bericht wurden dann Dateien mit wenig Abdeckung ausgewählt.

## Unit Tests

Ausführung erfolgt durch `pnpm test:unit:wat`. Es wurde die Arrange-Act-Assert Struktur eingehalten.

### Technologien

- vitest

### useFileActionsCreateSpaceFromResource.spec.ts

Erstellt aus einer Resource einen Space. Es wird geprüft, ob die richtigen Methoden aufgerufen werden.

#### Mocking

Die Abhängigkeiten werden mit `vi.mock` bereitgestellt. Diese sind:

- @opencloud-eu/web-pkg
- vue3-gettext

### useFileActionsShowShares.spec.ts

Zeigt die verfügbaren Shares. Es wird geprüft, ob die Aktion in den verschiedenen Situationen korrekt angezeigt oder versteckt wird.

#### Mocking

Die Abhängigkeiten werden mit `vi.mock` bereitgestellt. Diese sind:

- @opencloud-eu/web-client
- @opencloud-eu/web-pkg
- vue3-gettext

### useKeyboardFileMouseActions.spec.ts

Erleichtert das Selektieren von Resources mithilfe von Mausklicks und SHIFT. Es wird geprüft, ob die korrekten Resources ausgewählt sind oder nicht.

#### Mocking

Hier wird `createMockStore` verwendet, welche von `@opencloud-eu/web-test-helpers` bereitgestellt wird. Da diese Funktion mit `querySelectorAll` arbeitet, wurde hier der Rückgabewert beeinflusst. Dies erfolgt über `vi.spyOn` und `mockReturnValue`.

### useKeyboardFileNavigation.spec.ts

Erleichtert Das Selektieren von Resources mithilfe von SHIFT und den Pfeiltasten. Es wird geprüft, ob die korrekten Resources ausgewählt sind oder nicht. Diese Datei wurde erweitert.

Hier kommt noch `it.each` zum Einsatz, welche eine mehrfache Ausführung des Tests mit verschiedenen Werten ermöglicht.

#### Mocking

Da diese Funktion mit `querySelectorAll` arbeitet, wurde hier der Rückgabewert beeinflusst. Dies erfolgt über `vi.spyOn` und `mockReturnValue`.

## Integration Tests

Ausführung erfolgt durch `pnpm test:integration:wat`. Es wurde die Arrange-Act-Assert Struktur eingehalten.

Die Anwendung besitzt keine Integration Tests, wodurch die notwendige Infrastruktur eigenständig aufgesetzt wurde. Zuerst wurde unter `tests` ein neuer Ordner `integration` erstellt. Dieser beinhaltet zum einen Testdaten, aber auch die Konfiguration, welche beim Ausführen verwendet wird.

### Technologien

- vitest
- Docker

### dav.spec.ts

Schnittstelle zwischen Anwendung und WebDAV Server. Überprüft, ob die jeweiligen Requests an den Server mit einem positiven Statuscode beantwortet werden.

Damit diese Tests die tatsächliche Kommunikation prüft, wird ein einfacher WebDAV Server mit Beispieldaten aufgesetzt. Dadurch kann auf Mocks vollständig verzichtet werden.

## E2E Tests

Ausführung erfolgt durch `pnpm test:e2e:wat:<BROWSER>`. Die Browser Chromium, Firefox und Webkit stehen zur Auswahl.

### Technologien

- cucumber
- Playwright

### download-extended.feature

Dieses in Gherkin verfasste Feature testet das Herunterladen einer Resource über das Kontextmenü, sowie das Herunterladen einer fehlenden Resource.

## Load Tests

Ausführung erfolgt durch `k6 run tests/load/*.js`.

### Technologien

- k6
- Grafana

### get-file.js

Bei diesem Load Test wird zuerst das Skript tests/load/scripts/prepare-get-file.sh ausgeführt. Dieses Skript stellt sicher, dass alles notwendige für den Test bereit ist. Zuerst wird eine Datei beim Benutzer "Dennis" angelegt. Diese erstellte Datei wird dann über einen Link öffentlich geteilt. Auf diesen Link schickt dann k6 die Requests.

## Pipeline

Um die Tests automatisiert zu starten, wude eine eigenständig bereitgesteller GitHub Runner aufgesetzt, welcher über die notwendigen Abhängigkeiten verfügt.
Diese sind:

- node.js
- npm
- pnpm
- Docker

Die Pipeline `testing.yml` verfügt über mehrere Jobs:

- `unit`
- `integration`
- `e2e`
- `load`

Jeder dieser Jobs zieht sich den zu testenden Quellcode, installiert die Abhängigkeiten mit `pnpm` und führt den jeweiligen Befehl aus.

Der Job `integration` setzt dazu noch Docker Container auf, welche für die Ausführung notwendig sind.

Die Jobs `e2e` und `load` benötigen beiden den vollständigen OpenCloud Stack, welcher im vorhinein gestartet werden muss
