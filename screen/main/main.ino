#include <WiFi.h>
#include <WiFiClient.h>
#include <WebServer.h>
#include <HTTPUpdateServer.h>

#include <ESPmDNS.h>

#include "secret.hpp"

int RELAY_PIN_UP = 12;
int RELAY_PIN_DOWN = 4;

int PRESS_TIME_MS = 1000;

int LED_BUILTIN = 2;

String SIGNAL_UP = "/UP";
String SIGNAL_DOWN = "/DOWN";
String SIGNAL_STOP = "/STOP";

const char* host = "projector_screen";

WebServer httpServer(80);
HTTPUpdateServer httpUpdater;

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

void initWebServer() {
  /*use mdns for host name resolution*/
  if (!MDNS.begin(host)) { 
    Serial.println("Error setting up MDNS responder!");
    while (1) {
      delay(1000);
    }
  }
  Serial.println("mDNS responder started");

  httpUpdater.setup(&httpServer);

  httpServer.on(SIGNAL_UP, HTTP_GET, []() {
    httpServer.sendHeader("Connection", "close");
    up();
    httpServer.send(200, "text/plain", "OK");
  });

  httpServer.on(SIGNAL_DOWN, HTTP_GET, []() {
    httpServer.sendHeader("Connection", "close");
    down();
    httpServer.send(200, "text/plain", "OK");
  });

  httpServer.on(SIGNAL_STOP, HTTP_GET, []() {
    httpServer.sendHeader("Connection", "close");
    stop();
    httpServer.send(200, "text/plain", "OK");
  });

  httpServer.begin();
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
  httpServer.handleClient();
  delay(1);
}