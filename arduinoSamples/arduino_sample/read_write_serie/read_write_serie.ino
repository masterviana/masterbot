int x;
String str;

//Info
//http://forum.arduino.cc/index.php?topic=165050.0


char rx_byte = 0;
String rx_str = "";
boolean not_number = false;
int result;

int m1_speed;
int m2_speed;
int m1_direction;
int m2_direction;


// the setup function runs once when you press reset or power the board
void setup() {

  Serial.begin(9600);
  // initialize digital pin 13 as an output.
  pinMode(13, OUTPUT);
}

// the loop function runs over and over again forever
void loop() {

  getCommandInput();


  
  digitalWrite(13, HIGH);   // turn the LED on (HIGH is the voltage level)
  delay(500);
  digitalWrite(13, LOW);    // turn the LED off by making the voltage LOW
  delay(500);
 

}

void getCommandInput(){
   rx_str = "";
   int commandPart = 1;
   int commandMotor = 1;
   String commandValue;
   
    if(Serial.available() > 0){
      while(Serial.available() > 0){
        delay(5);
         rx_byte = Serial.read(); 
         rx_str += rx_byte;
         switch (rx_byte) {
            case '/':
              
              commandPart = commandPart +1;
              break;
            case '|':
              commandMotor = commandMotor +1;
              commandPart = 1;
              break;
            default: 
              commandValue = commandValue + rx_byte;
              
            break;
          }
         
        
    }
    Serial.println(rx_str);
  }else{
    Serial.println("No data from buffers");  
  }
    
}  
