/*
  DM3014 Interactive Devices, Ashley Hi 2026
  Week 8 - Microcontrollers & Sensors
  ESP32-C3 Sensor Servo Example
  When distance is less than 15cm, ultrasonic sensor triggers servo and built-in LED.
  Additional Components: Servo Motor, HC-SR04 Sensor
*/

// ====== Reference Libraries ======
#include <ESP32Servo.h>

// ====== Set Servo ======
#define SERVO_PIN 7

// ====== Set HC-SR04 Sensor ======
#define TRIG_PIN  3
#define ECHO_PIN  4
#define DISTANCE_THRESHOLD  15 // *** edit the sensor trigger distance here (in cm)

// ====== Set Built-in LED ======
#define LED_PIN 8

// ====== Create Servo Objects ======
Servo servo;

// ====== Sensor Variables ======
float duration_us, distance_cm;

void setup() {
  // ====== Setup Serial Monitor ======
  Serial.begin(115200);

  // ====== Setup Sensor / Servo / LED ======
  pinMode(TRIG_PIN, OUTPUT);
  pinMode(ECHO_PIN, INPUT);
  pinMode(LED_PIN, OUTPUT);

  // LED off at start
  digitalWrite(LED_PIN, HIGH);

  ESP32PWM::allocateTimer(0);
  ESP32PWM::allocateTimer(1);
  ESP32PWM::allocateTimer(2);
  ESP32PWM::allocateTimer(3);

  servo.setPeriodHertz(50);
  servo.attach(SERVO_PIN, 500, 2000);
  servo.write(0);
}

void loop() {
  // ====== Sensor / Servo / LED Output ======
  digitalWrite(TRIG_PIN, LOW);
  delayMicroseconds(2);

  digitalWrite(TRIG_PIN, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIG_PIN, LOW);

  duration_us = pulseIn(ECHO_PIN, HIGH, 30000);

  if (duration_us > 0) {
    distance_cm = 0.017 * duration_us;
  } else {
    distance_cm = 999;
  }

  if (distance_cm < DISTANCE_THRESHOLD) {
    servo.write(90);
    digitalWrite(LED_PIN, LOW);   // LED ON
  } else {
    servo.write(0);
    digitalWrite(LED_PIN, HIGH);  // LED OFF
  }

  // ====== Serial Output ======
  Serial.print("Distance: ");
  Serial.print(distance_cm);
  Serial.println(" cm");

  delay(50);
}