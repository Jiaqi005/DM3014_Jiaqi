
/*
  DM3014 Interactive Devices, Ashley Hi 2026
  Week 9 - Remote Interfaces
  ESP32-C3 Server Servo Control
  Move a 180° servo motor over web server.
  Additional Components: Servo Motor
*/

// ====== Reference Libraries ======
#include <WiFi.h>
#include <ESP32Servo.h>

// ====== Network Credentials ======
const char* ssid     = "Jiaqi_ESP32";
const char* password = "12345678";

// ====== Network Settings ======
WiFiServer server(80);
String header;        // variable stores HTTP request
int servo_angle = 90; // variable stores current servo angle (0-180)

// ====== Assign Servo Pin ======
#define SERVO_PIN 7
Servo myServo;

// ====== Webpage ======
const char webpage[] = R"HTML(
<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="icon" href="data:,">
  <style>
    html {
      font-family: Helvetica;
      text-align: center;
      background-color: #EEF1F4;
    }
    body {
      margin: 0;
      padding: 40px 20px;
      color: #293744;
    }
    h1 {
      font-size: 28px;
      margin-bottom: 10px;
    }
    .angle {
      font-size: 48px;
      color: #344F66;
      margin: 25px 0;
    }
    .button {
      background-color: #344F66;
      color: white;
      border: none;
      border-radius: 10px;
      padding: 16px 22px;
      font-size: 18px;
      margin: 6px;
      cursor: pointer;
      min-width: 85px;
    }
    .button:hover {
      background-color: #587A96;
    }
    .buttons {
      max-width: 450px;
      margin: 20px auto;
    }
    .note {
      color: #778692;
      font-size: 14px;
      margin-top: 30px;
    }
  </style>
</head>
<body>
  <h1>Servo Control</h1>
  <p>Current Servo Angle</p>
  <p class="angle">%ANGLE%&deg;</p>

  <!-- Servo angle buttons -->
  <div class="buttons">
    <a href="/servo/0"><button class="button">0&deg;</button></a>
    <a href="/servo/30"><button class="button">30&deg;</button></a>
    <a href="/servo/60"><button class="button">60&deg;</button></a>
    <a href="/servo/90"><button class="button">90&deg;</button></a>
    <a href="/servo/120"><button class="button">120&deg;</button></a>
    <a href="/servo/150"><button class="button">150&deg;</button></a>
    <a href="/servo/180"><button class="button">180&deg;</button></a>
  </div>

  <p class="note">ESP32-C3 Remote Servo Controller</p>
</body>
</html>
)HTML";

void setup() {
  // ====== Setup Serial Monitor ======
  Serial.begin(115200);

  // ====== Setup Servo ======
  myServo.setPeriodHertz(50);           // standard servos expect 50 Hz
  myServo.attach(SERVO_PIN, 500, 2400); // pulse width range in microseconds
  myServo.write(servo_angle);           // move to start position

  // ====== Setup ESP as Access Point ======
  Serial.print("Setting AP (Access Point)...");
  WiFi.softAP(ssid, password);
  IPAddress IP = WiFi.softAPIP();
  Serial.print("IP Address: ");
  Serial.println(IP);
  server.begin();
}

void loop(){
  WiFiClient client = server.available(); // listen for incoming clients
  if (client) {                           // if a new client connects
    Serial.println("New Client");
    String currentLine = "";
    unsigned long startTime = millis();   // note when client connected (for timeout)
    while (client.connected() && millis() - startTime < 2000) { // set a 2s timeout
      if (client.available()) {           // if there's bytes to read from the client
        char c = client.read();           // read a byte
        Serial.write(c);
        header += c;
        if (c == '\n') {
          if (currentLine.length() == 0) {
            // ====== Setup Webpage ======
            client.println("HTTP/1.1 200 OK");
            client.println("Content-type:text/html");
            client.println("Connection: close");
            client.println();

            // ====== Move Servo ======
            int pos = header.indexOf("GET /servo/");
            if (pos >= 0) {
              servo_angle = constrain(header.substring(pos + 11).toInt(), 0, 180);
              Serial.println("servo to " + String(servo_angle));
              myServo.write(servo_angle);
            }

            // ====== Display HTML Webpage ======
            String page = webpage;
            page.replace("%ANGLE%", String(servo_angle));
            client.print(page);
            client.println();
            break;
          } else {
            currentLine = "";
          }
        } else if (c != '\r') {
          currentLine += c;
        }
      }
    }
    header = "";
    client.stop();
    Serial.println("Client disconnected.");
    Serial.println("");
  }
}
