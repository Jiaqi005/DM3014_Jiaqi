let socket;

let started = false;

let padCenter;

let tiltX = 0;


document
  .getElementById('permission-btn')
  .addEventListener('click', startRemote);


document
  .getElementById('permission-btn')
  .addEventListener('touchend', (e) => {

    e.preventDefault();

    startRemote();

  });


function setup() {

  createCanvas(windowWidth, windowHeight);

  noLoop();

  padCenter = {
    x: width / 2,
    y: height / 2
  };

}


function startRemote() {

  console.log('startRemote fired');


  if (
    typeof DeviceMotionEvent !== 'undefined' &&
    typeof DeviceMotionEvent.requestPermission === 'function'
  ) {

    DeviceMotionEvent
      .requestPermission()
      .catch(() => {});

  }


  if (
    typeof DeviceOrientationEvent !== 'undefined' &&
    typeof DeviceOrientationEvent.requestPermission === 'function'
  ) {

    DeviceOrientationEvent
      .requestPermission()

      .then((response) => {

        if (response === 'granted') {

          window.addEventListener(
            'deviceorientation',
            handleTilt
          );

        }

      })

      .catch(() => {});

  }

  else {

    window.addEventListener(
      'deviceorientation',
      handleTilt
    );

  }


  document
    .getElementById('permission-btn')
    .style.display = 'none';


  socket = io();

  started = true;

  loop();

}


function handleTilt(e) {

  tiltX = constrain(
    e.gamma / 45,
    -1,
    1
  );


  // stop small unwanted movement
  if (abs(tiltX) < 0.08) {

    tiltX = 0;

  }


  socket.emit('control', {
    dx: tiltX
  });

}


function draw() {

  background(20);


  if (!started) return;


  // controller line
  stroke(80);

  line(
    width / 2 - 100,
    height / 2,
    width / 2 + 100,
    height / 2
  );


  // moving dot
  fill(240, 90, 60);

  noStroke();

  let dotX =
    width / 2 +
    tiltX * 100;


  circle(
    dotX,
    height / 2,
    30
  );


  fill(200);

  textAlign(CENTER);

  textSize(16);

  text(
    'tilt left / right · tap to jump',
    width / 2,
    height - 50
  );

}


function touchStarted() {

  if (!started) return false;


  socket.emit('control', {
    jump: true
  });


  return false;

}


function windowResized() {

  resizeCanvas(
    windowWidth,
    windowHeight
  );

  padCenter = {
    x: width / 2,
    y: height / 2
  };

}