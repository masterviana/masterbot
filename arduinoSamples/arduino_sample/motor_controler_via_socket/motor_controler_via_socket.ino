#include <ArduinoJson.h>


/*
    CODE FOR TB6612FNG
    from blog post : http://bildr.org/2012/04/tb6612fng-arduino/
*/

//motor A connected between A01 and A02
//motor B connected between B01 and B02

int STBY = 10; //standby

//Motor A
int PWMA = 3; //Speed control
int AIN1 = 9; //Direction
int AIN2 = 8; //Direction

//Motor B
int PWMB = 5; //Speed control
int BIN1 = 11; //Direction
int BIN2 = 12; //Direction

int DIRECTION = 0;
int SPEED     = 0;

int x;
String str;

void setup(){

  Serial.begin(9600);
  
  pinMode(STBY, OUTPUT);

  pinMode(PWMA, OUTPUT);
  pinMode(AIN1, OUTPUT);
  pinMode(AIN2, OUTPUT);

  pinMode(PWMB, OUTPUT);
  pinMode(BIN1, OUTPUT);
  pinMode(BIN2, OUTPUT);
}

void loop(){

  if(Serial.available() > 0)
  {
      str = Serial.readStringUntil('\n');
      StaticJsonBuffer<200> jsonBuffer;
      JsonObject& root = jsonBuffer.parseObject(str);
      DIRECTION = root["direction"];
      SPEED = root["speed"];

      Serial.print("I received ");
      Serial.print(str);
      Serial.println(SPEED);
  
  }else{
    Serial.print("SPEED ");
    Serial.println(SPEED);
    Serial.println("No data was received! ");
  }
  
  
  move(1, SPEED, DIRECTION); //motor 1, full speed, left
  move(2, SPEED, DIRECTION); //motor 2, full speed, left

  delay(400);
  
}


void move(int motor, int speed, int direction){
//Move specific motor at speed and direction
//motor: 0 for B 1 for A
//speed: 0 is off, and 255 is full speed
//direction: 0 clockwise, 1 counter-clockwise

  digitalWrite(STBY, HIGH); //disable standby

  boolean inPin1 = LOW;
  boolean inPin2 = HIGH;

  if(direction == 1){
    inPin1 = HIGH;
    inPin2 = LOW;
  }

  if(motor == 1){
    digitalWrite(AIN1, inPin1);
    digitalWrite(AIN2, inPin2);
    analogWrite(PWMA, speed);
  }else{
    digitalWrite(BIN1, inPin1);
    digitalWrite(BIN2, inPin2);
    analogWrite(PWMB, speed);
  }
}

void stop(){
//enable standby
  digitalWrite(STBY, LOW);
}
