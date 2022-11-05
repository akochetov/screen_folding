#include "BluetoothSerial.h"

#if !defined(CONFIG_BT_ENABLED) || !defined(CONFIG_BLUEDROID_ENABLED)
#error Bluetooth is not enabled! Please run `make menuconfig` to and enable it
#endif

int RELAY_PIN_UP = 12;
int RELAY_PIN_DOWN = 4;

int PRESS_TIME_MS = 1000;

int LED_BUILTIN = 2;

String strSignal;
String SIGNAL_UP = "UP";
String SIGNAL_DOWN = "DOWN";
String SIGNAL_STOP = "STOP";

// create bluetooth instance
BluetoothSerial SerialBT;

void initBT() {
  Serial.println("Starting bluetooth...");
  if (!SerialBT.begin("ScreenRoller"))
    Serial.println("An error occurred initializing Bluetooth");
  else 
    Serial.println("Bluetooth started.");
}

void setup() {
  // initialize serial communication at 9600 bits per second:
  Serial.begin(115200);

  Serial.println("Booted up. Proceeding with setup...");

  pinMode(RELAY_PIN_UP, OUTPUT);
  pinMode(RELAY_PIN_DOWN, OUTPUT);

  pinMode(LED_BUILTIN, OUTPUT);

  // start bluetooth
  initBT();

  digitalWrite(LED_BUILTIN, HIGH);
  delay(2000);
  digitalWrite(LED_BUILTIN, LOW); 

  Serial.println("The device started, now you can pair it with bluetooth.");
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

void loop() {
  // print out whatever comes from bluetooth
  if (SerialBT.available()) {
    strSignal = SerialBT.readString();

    Serial.println(strSignal);

    digitalWrite(LED_BUILTIN, HIGH); 
    if (strSignal == SIGNAL_UP) up();
    if (strSignal == SIGNAL_DOWN) down();
    if (strSignal == SIGNAL_STOP) stop();
    digitalWrite(LED_BUILTIN, LOW); 
  }

  delay(10);
}