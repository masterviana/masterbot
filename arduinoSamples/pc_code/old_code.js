
/*
  get speed from x and y
  http://math.stackexchange.com/questions/553478/how-covert-joysitck-x-y-coordinates-to-robot-motor-speed
*/
// x axis from -255 to 255 and y axis to
/*
*/
function getMotorsSpeed(x, y){

  var angle =  Math.atan2(y,x);
  var magnitude = Math.sqrt( Math.pow(x,2) + Math.pow(y,2) );
  var angleRounded = angle.toFixed(3);

  var _x = magnitude * Math.cos(angleRounded);
  var _y = magnitude * Math.sin(angleRounded);

  var x1 = (255 * _x ) / 10;
  var y1 = (255 * _y ) / 10;

  var rMotor = -x1;
  var rMotor = y1;

  return "rMotor Speed : " + rMotor + " lMotor Speed :"  +rMotor;
}



function getSpeedAndDirection(relativePosition){

  var speed =0
  var direction = 0
  if(relativePosition == 0){
    direction = 0;
    speed = 0;
  }else{
    //go forward
    if(relativePosition > 0 ){
      direction = 0;
      var relativeSpeed = Math.abs(relativePosition);
      speed = relativeSpeed * 255
      speed = Math.floor(speed)
    }
    //go back
    else{
        direction = 1;
        var relativeSpeed = Math.abs(relativePosition);
        speed = relativeSpeed * 255
        speed =  Math.floor(speed)
    }
  }

  return {speed : speed, direction : direction }

}
