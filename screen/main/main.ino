#include "BluetoothSerial.h"

#if !defined(CONFIG_BT_ENABLED) || !defined(CONFIG_BLUEDROID_ENABLED)
#error Bluetooth is not enabled! Please run `make menuconfig` to and enable it
#endif

int RELAY_PIN1 = 4;
int RELAY_PIN2 = 14;


// create bluetooth instance
BluetoothSerial SerialBT;

void initBT() {
  SerialBT.begin("ScreenRoller"); // Bluetooth device name
  Serial.println("The device started, now you can pair it with bluetooth.");
}

void setup() {
  // initialize serial communication at 9600 bits per second:
  Serial.begin(115200);

  Serial.println("Booted up. Proceeding with setup...");

  // start bluetooth
  initBT();

  pinMode(RELAY_PIN1, OUTPUT);
  pinMode(RELAY_PIN2, OUTPUT);
}

void loop() {
  // print out whatever comes from bluetooth
  if (SerialBT.available()) {
    Serial.write(SerialBT.read());
  }

  delay(10);
}
