http://electronics.stackexchange.com/questions/31500/motor-driver-board-wingxine-need-help-with-wiring?newreg=09349032e902438eb1669bf147fd9798

http://modularcircuits.tantosonline.com/blog/articles/h-bridge-secrets/


Pin-out:

The green connector on the left is the main power connections. Connect B+ to your supply voltage, GND to the supply GND, M+ and M- to your DC motor in any direction you wish it to turn.

The black male pin headers on the right are control connections. B+ and GND are your supply voltages. EN is the enable input of the chip, which I will come to. RPWM and LPWM are the PWM control inputs for the left side and right side of the bridge, again, which I will come to. Now, at this point, I don't know about CT and VT, but they should be somewhat related to the other IC on the board, LM358.

EN Pin (Cited from the datasheet):

When a logic high is present on this pin, the DMOS POWER transistors are enabled
to be selectively driven by IN1 and IN2.
RPWM and LPWM Pins (Cited from the datasheet):

Digital Input from the Motor Controller
These are PWM inputs from the microcontroller. EN, RPWM and LPWM pins are rated minimum – 0.3 and maximum + 7 VDC. Your 3.3V or 5V microcontroller will work fine. Refer to the datasheet for more info. Here is the block diagram of this chip, IN1 and IN2 are LPWM and RPWM:
