let socket;

let input = { dx: 0, dy: 0 };

let player = {
  x: 50,
  y: 0,
  vy: 0,
  w: 50,
  h: 70
};

let gravity = 0.6;
let ground = 350;
let speed = 4;

let connected = false;
let onSurface = false;

let steveImg;
let blockImg;
let emeraldImg;
let successSound;


// multiple platforms
let platforms = [
  { x: 140, y: 280, w: 120, h: 40 },
  { x: 300, y: 220, w: 120, h: 40 },
  { x: 460, y: 160, w: 80, h: 40 }
];


// emerald
let emerald = {
  x: 480,
  y: 110,
  w: 40,
  h: 40,
  collected: false
};


function preload() {

  steveImg = loadImage('assets/steve.png');

  blockImg = loadImage('assets/block.png');

  emeraldImg = loadImage('assets/emerald.png');

}


function setup() {

  createCanvas(600, 400);

  successSound = new Audio('assets/success.wav');

  socket = io();

  socket.on('connect', () => {

    connected = true;

    document.getElementById('status').textContent =
      'phone connected — waiting for input';

  });


  socket.on('control', (data) => {

    document.getElementById('status').textContent =
      'receiving input from phone';

    if (typeof data.dx === 'number') {
      input.dx = data.dx;
    }

    if (typeof data.dy === 'number') {
      input.dy = data.dy;
    }

    if (data.jump) {
      doJump();
    }

  });

}


function draw() {

  // Minecraft sky
  background(110, 190, 255);


  // move player
  player.x += input.dx * speed;

  player.x = constrain(
    player.x,
    0,
    width - player.w
  );


  // gravity
  player.vy += gravity;

  player.y += player.vy;

  onSurface = false;


  // ground collision
  if (player.y + player.h > ground) {

    player.y = ground - player.h;

    player.vy = 0;

    onSurface = true;

  }


  // platform collision
  for (let i = 0; i < platforms.length; i++) {

    let p = platforms[i];

    let landing =

      player.x + player.w > p.x &&

      player.x < p.x + p.w &&

      player.y + player.h >= p.y &&

      player.y + player.h <= p.y + p.h + 10 &&

      player.vy >= 0;


    if (landing) {

      player.y = p.y - player.h;

      player.vy = 0;

      onSurface = true;

    }

  }


  // draw ground
  for (let x = 0; x < width; x += 50) {

    image(
      blockImg,
      x,
      ground,
      50,
      50
    );

  }


  // draw platforms
  for (let i = 0; i < platforms.length; i++) {

    let p = platforms[i];

    for (let x = p.x; x < p.x + p.w; x += 40) {

      image(
        blockImg,
        x,
        p.y,
        40,
        40
      );

    }

  }


  // draw emerald
  if (!emerald.collected) {

    image(
      emeraldImg,
      emerald.x,
      emerald.y,
      emerald.w,
      emerald.h
    );

  }


  // check if Steve collects emerald
  if (!emerald.collected) {

    let touchingEmerald =

      player.x < emerald.x + emerald.w &&

      player.x + player.w > emerald.x &&

      player.y < emerald.y + emerald.h &&

      player.y + player.h > emerald.y;


    if (touchingEmerald) {

      emerald.collected = true;

      successSound.currentTime = 0;

      successSound.play();

    }

  }


  // draw Steve
  image(
    steveImg,
    player.x,
    player.y,
    player.w,
    player.h
  );


  // keyboard controls for testing
  if (keyIsDown(LEFT_ARROW)) {

    player.x -= speed;

  }

  if (keyIsDown(RIGHT_ARROW)) {

    player.x += speed;

  }

}


function keyPressed() {

  if (key === ' ') {

    doJump();

  }

}


function doJump() {

  if (onSurface) {

    player.vy = -12;

  }

}