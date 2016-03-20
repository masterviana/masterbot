//Info
//http://forum.arduino.cc/index.php?topic=165050.0

char rx_byte = 0;
String rx_str = "";
boolean not_number = false;
int result;


/*
   COMMANDS TEMPLATES
   "m1Speed/m1Direction|m2Speed/m2Direction;"
*/
int m1_speed = 0;
int m2_speed = 0;
int m1_direction = 0;
int m2_direction = 0;


unsigned long previousMillis = 0; // will store last time LED was updated
// constants won't change :
const long interval = 1000; // interval at which to blink (milliseconds)
// constants won't change. Used here to set a pin number :
const int ledPin = 13; // the number of the LED pin

// Variables will change :
int ledState = LOW; // ledState used to set the LED


// the setup function runs once when you press reset or power the board
void setup() {

  Serial.begin(9600);
  // initialize digital pin 13 as an output.
  pinMode(13, OUTPUT);
}

// the loop function runs over and over again forever
void loop() {

  getCommandInput();

  unsigned long currentMillis = millis();

  if (currentMillis - previousMillis >= interval) {
    // save the last time you blinked the LED
    previousMillis = currentMillis;

    // if the LED is off turn it on and vice-versa:
    if (ledState == LOW) {
      ledState = HIGH;
    } else {
      ledState = LOW;
    }
  }

  // set the LED with the ledState of the variable:
  digitalWrite(ledPin, ledState);


}

void getCommandInput() {
  rx_str = "";
  int commandPart = 1;
  int commandForMotor = 1;
  String commandValue = "";

  if (Serial.available() > 0) {
    while (Serial.available() > 0) {
      delay(5);
      rx_byte = Serial.read();
      rx_str += rx_byte;
      switch (rx_byte) {
        case '/':
          if (commandForMotor == 1) {
            m1_speed = commandValue.toInt();
          } else if (commandForMotor == 2) {
            m2_speed = commandValue.toInt();
          }
          commandValue = "";
          commandPart = commandPart + 1;
          break;
        case '|':
          if (commandForMotor == 1) {
            m1_direction = commandValue.toInt();
          }
          commandValue = "";
          commandForMotor = commandForMotor + 1;
          commandPart = 1;
          break;
        case ';':
          if (commandForMotor == 2) {
            m2_direction = commandValue.toInt();
          }
          commandValue = "";
          break;
        default:
          commandValue = commandValue + rx_byte;
          break;
      }
    }
    String commands = "M1Speed = ";
    commands.concat(m1_speed);
    commands.concat(" M1 diretino ");
    commands.concat(m1_direction);
    commands.concat(" M2 speed ");
    commands.concat(m2_speed);
    commands.concat("M2 direction ");
    commands.concat(m2_direction);

    Serial.println(rx_str);
    Serial.println(commands);
  } else {
    Serial.println("No data from buffers");
  }

}
