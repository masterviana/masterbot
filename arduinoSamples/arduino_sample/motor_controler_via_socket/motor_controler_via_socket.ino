
/*
    CODE FOR TB6612FNG
    from blog post : http://bildr.org/2012/04/tb6612fng-arduino/
*/

int STBY = 10; //standby

//Motor A
int PWMA = 3; //Speed control
int AIN1 = 9; //Direction
int AIN2 = 8; //Direction

//Motor B
int PWMB = 5; //Speed control
int BIN1 = 11; //Direction
int BIN2 = 12; //Direction


/*
   COMMANDS TEMPLATE
   "m1Speed/m1Direction|m2Speed/m2Direction;"

   Commands variables
*/
int m1_speed = 0;
int m2_speed = 0;
int m1_direction = 0;
int m2_direction = 0;

/*
 * variables to read commands from serial port
*/
char rx_byte = 0;
String rx_str = "";

unsigned long previousMillis = 0;    

// constants won't change :
const long interval = 50;    


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

 
  unsigned long currentMillis = millis();
  //wait to read on commands in passive way
  if (currentMillis - previousMillis >= interval) {
    previousMillis = currentMillis;

    //will read inputs from serial port
    getCommandInput();
  
  }

  //Stop motors if speed is zero
  if(m1_speed == 0 && m2_speed == 0){
    stop();
  }else{
    move(1, m1_speed, m1_direction); //motor 1, full speed, left
    move(2, m2_speed, m2_direction); //motor 2, full speed, left
  }
 
}



/*
 *  Process commands sended from serial port
*/
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


/*
  MOTORS  CODE 
*/

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
