#include <ArduinoJson.h>

int x;
String str;

// the setup function runs once when you press reset or power the board
void setup() {

  Serial.begin(9600);
  // initialize digital pin 13 as an output.
  pinMode(13, OUTPUT);
}

// the loop function runs over and over again forever
void loop() {
  digitalWrite(13, HIGH);   // turn the LED on (HIGH is the voltage level)

  if(Serial.available() > 0)
  {
      str = Serial.readStringUntil('\n');
      StaticJsonBuffer<200> jsonBuffer;
      JsonObject& root = jsonBuffer.parseObject(str);
      long x = root["x"];
      long y = root["y"];

      Serial.print("I received ");
      Serial.println(x);

  }else{
    Serial.println("No data was received! ");
  }


  delay(1000);
               // wait for a second
  digitalWrite(13, LOW);    // turn the LED off by making the voltage LOW
              // wait for a second
  delay(500);

}
