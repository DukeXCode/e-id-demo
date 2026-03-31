# Willkommen zur E-ID-Demo 👋

Dieses Projekt ist eine Demo-Anwendung für eine **elektronische Identität (E-ID)**. Es besteht aus drei Teilen:

- einer **mobilen App** (entwickelt mit Expo/React Native),
- einem **zentralen Server** (eine Python-basierte API),
- und einem **Test-Webshop** (eine einfache Web-Anwendung zum Ausprobieren).

Zusammen simulieren diese drei Komponenten, wie eine digitale Identitätsprüfung in der Praxis funktionieren könnte – zum Beispiel beim Online-Einkauf.

---

## Voraussetzungen

Bevor du beginnst, stelle sicher, dass folgende Programme auf deinem Computer installiert sind:

- **Node.js** – die Laufzeitumgebung für JavaScript (Download: https://nodejs.org)
- **npm** – der Paketmanager für Node.js (wird automatisch mit Node.js mitgeliefert)
- **Python 3** – für den Server-Teil (Download: https://python.org)
- **pip** – der Paketmanager für Python (wird normalerweise mit Python mitgeliefert)

---

## Teil 1: Mobile App starten

Die mobile App ist die Benutzeroberfläche der E-ID-Demo. Sie wird mit **Expo** betrieben, einem Framework zur Entwicklung von Smartphone-Apps.

### Schritt 1 – Abhängigkeiten installieren

Öffne ein Terminal (Git Bash oder Powershell) im Hauptverzeichnis des Projekts und führe folgenden Befehl aus:

```bash
npm install
```

> Dieser Befehl lädt alle benötigten Bibliotheken und Pakete herunter, die im Projekt verwendet werden (definiert in der Datei `package.json`).

### Schritt 2 – App starten

```bash
npx expo start
```

> Dieser Befehl startet den Expo-Entwicklungsserver. Im Terminal erscheint ein QR-Code, den du mit der **Expo Go**-App auf deinem Smartphone scannen kannst, um die App direkt auf deinem Gerät zu testen. Alternativ kann die App in einem Emulator geöffnet werden.

---

## Teil 2: Zentralen Server starten

Der Server ist das **Herzstück der Identitätsprüfung**. Er empfängt Anfragen (z. B. vom Webshop), prüft öffentliche Schlüssel und ruft eine Callback-URL auf, um das Ergebnis zurückzumelden. Er ist in **Python** geschrieben und nutzt das Framework **FastAPI** mit **Uvicorn** als Webserver.

### Schritt 1 – In den Server-Ordner wechseln und Abhängigkeiten installieren

```bash
cd central-server
pip install -r requirements.txt
```

> `cd central-server` wechselt in den Unterordner des Servers. `pip install -r requirements.txt` installiert alle Python-Bibliotheken, die der Server benötigt.

### Schritt 2 – Server starten

```bash
uvicorn main:app --reload
```

> Der Server startet nun lokal auf deinem Computer und ist unter `http://localhost:8000` erreichbar. Das Flag `--reload` sorgt dafür, dass der Server sich automatisch neu startet, wenn du den Code änderst – praktisch beim Entwickeln.

### Schritt 3 – Endpunkt testen (optional)

Um zu prüfen, ob der Server korrekt läuft, kannst du ihm eine Test-Anfrage schicken:

```bash
curl -X POST http://localhost:8000/api/verify \
  -H "Content-Type: application/json" \
  -d '{"publicKey":"pk_alice_123","callbackUrl":"https://webhook.site/your-id"}'
```

> **Was passiert hier?**
> - `curl` ist ein Kommandozeilenprogramm zum Senden von HTTP-Anfragen.
> - Es wird eine **POST-Anfrage** an den Endpunkt `/api/verify` gesendet.
> - Im Datenteil (`-d`) wird ein JSON-Objekt mitgeschickt, das einen **öffentlichen Schlüssel** (`publicKey`) und eine **Callback-URL** enthält.
> - Der öffentliche Schlüssel (`pk_alice_123`) identifiziert die Person „Alice".
> - Die Callback-URL ist die Adresse, an die der Server nach der Prüfung das Ergebnis zurücksendet.

---

## Teil 3: Test-Webshop starten

Der Test-Webshop simuliert eine **Online-Shop-Website**, die die E-ID-Prüfung nutzt. Damit kann man ausprobieren, wie der gesamte Ablauf aus Nutzersicht aussieht.

### Schritt 1 – In den Webshop-Ordner wechseln und Abhängigkeiten installieren

```bash
cd test-webshop
npm install
```

### Schritt 2 – Webshop starten

```bash
npm run start
```

> Der Webshop ist danach lokal in deinem Browser erreichbar (die genaue Adresse, z. B. `http://localhost:3000`, wird im Terminal angezeigt).

---

## Zusammenfassung: Wie hängt alles zusammen?

1. Die **mobile App** stellt eine Identität dar (z. B. die E-ID von Peter).
2. Der **Webshop** fordert eine Identitätsprüfung an, indem er den öffentlichen Schlüssel an den Server sendet.
3. Mit der **mobile App** wird der QR-Code gescannt und die Identitätsprüfung eingeleitet.
4. Der **zentrale Server** prüft im zentralen Modus die Identität und sendet das Ergebnis an die Callback-URL zurück. Im lokalen Modus wird dieser Schritt direkt in der App gemacht, indem asynchrone Krypotgrafie eingesetzt wird.
5. Der **Webshop** erhält die Bestätigung und kann den Nutzer einloggen oder eine Bestellung freigeben.
