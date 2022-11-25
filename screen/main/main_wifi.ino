/*
 * OTAWebUpdater.ino Example from ArduinoOTA Library
 * Rui Santos 
 * Complete Project Details https://randomnerdtutorials.com
 */

#include <WiFi.h>
#include <WiFiClient.h>
#include <WebServer.h>
#include <ESPmDNS.h>
#include <Update.h>

#include "secret.hpp"
#include "IndexPage.hpp"

int RELAY_PIN_UP = 12;
int RELAY_PIN_DOWN = 4;

int PRESS_TIME_MS = 1000;

int LED_BUILTIN = 2;

String strSignal;
String SIGNAL_UP = "UP";
String SIGNAL_DOWN = "DOWN";
String SIGNAL_STOP = "STOP";

const char* host = "projector_screen";

WebServer server(80);

void initWiFi() {
  // Connect to WiFi network
  WiFi.begin(ssid, password);
  Serial.println("");

  // Wait for connection
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("");
  Serial.print("Connected to ");
  Serial.println(ssid);
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());
}

void serverUpload(HTTPUpload *upload) {
    if (upload.status == UPLOAD_FILE_START) {
      Serial.printf("Update: %s\n", upload.filename.c_str());
      if (!Update.begin(UPDATE_SIZE_UNKNOWN)) { //start with max available size
        Update.printError(Serial);
      }
    } else if (upload.status == UPLOAD_FILE_WRITE) {
      /* flashing firmware to ESP*/
      if (Update.write(upload.buf, upload.currentSize) != upload.currentSize) {
        Update.printError(Serial);
      }
    } else if (upload.status == UPLOAD_FILE_END) {
      if (Update.end(true)) { //true to set the size to the current progress
        Serial.printf("Update Success: %u\nRebooting...\n", upload.totalSize);
      } else {
        Update.printError(Serial);
      }
    }
}

void initWebServer() {
  /*use mdns for host name resolution*/
  if (!MDNS.begin(host)) { 
    Serial.println("Error setting up MDNS responder!");
    while (1) {
      delay(1000);
    }
  }
  Serial.println("mDNS responder started");

  /*return index page which is stored in serverIndex */
  server.on("/", HTTP_GET, []() {
    server.sendHeader("Connection", "close");
    server.send(200, "text/html", indexPage);
  });

  server.on(SIGNAL_UP, HTTP_GET, []() {
    server.sendHeader("Connection", "close");
    up();
    server.send(200, "text/plain", "OK");
  });

  server.on(SIGNAL_DOWN, HTTP_GET, []() {
    server.sendHeader("Connection", "close");
    down();
    server.send(200, "text/plain", "OK");
  });

  server.on(SIGNAL_STOP, HTTP_GET, []() {
    server.sendHeader("Connection", "close");
    stop();
    server.send(200, "text/plain", "OK");
  });

  /*handling uploading firmware file */
  server.on("/update", HTTP_POST, []() {
    server.sendHeader("Connection", "close");
    server.send(200, "text/plain", (Update.hasError()) ? "FAIL" : "OK");
    ESP.restart();
  }, []() {
    serverUpload(server.upload());
  });
  server.begin();
}

void up() {
  Serial.println("Moving up...");
  digitalWrite(RELAY_PIN_UP, HIGH);
  delay(PRESS_TIME_MS);
  digitalWrite(RELAY_PIN_UP, LOW);
  Serial.println("Done.");
}

void down() {
  Serial.println("Moving down...");
  digitalWrite(RELAY_PIN_DOWN, HIGH);
  delay(PRESS_TIME_MS);
  digitalWrite(RELAY_PIN_DOWN, LOW);
  Serial.println("Done.");
}

void stop() {
  Serial.println("Stopping...");
  digitalWrite(RELAY_PIN_DOWN, HIGH);
  digitalWrite(RELAY_PIN_UP, HIGH);
  delay(PRESS_TIME_MS);
  digitalWrite(RELAY_PIN_DOWN, LOW);
  digitalWrite(RELAY_PIN_UP, LOW);
  Serial.println("Done.");
}

/*
 * setup function
 */
void setup(void) {
  Serial.begin(115200);

  pinMode(RELAY_PIN_UP, OUTPUT);
  pinMode(RELAY_PIN_DOWN, OUTPUT);

  pinMode(LED_BUILTIN, OUTPUT);

  initWiFi();
  initWebServer();

  digitalWrite(LED_BUILTIN, HIGH);
  delay(2000);
  digitalWrite(LED_BUILTIN, LOW); 
}

void loop(void) {
  server.handleClient();
  delay(1);
}