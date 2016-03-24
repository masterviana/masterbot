

int E1 = 3;

int L1 = 8;
int L2 = 9;                          
 
void setup() 
{ 
    pinMode(L1, OUTPUT);   
    pinMode(L2, OUTPUT);
    pinMode(E1, OUTPUT);
} 
 
void loop() 
{ 

  digitalWrite(L1, HIGH);
  digitalWrite(L2, LOW);
  analogWrite(E1, 255);
  delay(2500);


  digitalWrite(L1, LOW);
  digitalWrite(L2, HIGH);

 
  delay(2000);
  
}
