/* DM3014 Interactive Devices, Ashley Hi 2026
 * Week 6 - Teachable Machine
 * Train Your Own Model
 */


let classifier;

// model url
const imageModelURL = "https://teachablemachine.withgoogle.com/models/P8_RJIyHY/";

let video;
let flippedVideo;
let label = ""; // to store classifications

function preload() {
  classifier = ml5.imageClassifier(imageModelURL + "model.json");
}

function setup() {
  createCanvas(320, 260);

  video = createCapture(VIDEO);
  video.size(320, 240);
  video.hide();

  flippedVideo = ml5.flipImage(video);

  classifyVideo();
}

function draw() {

  // change background based on label
  if (label == "Fist") {
    background(180, 60, 60);
  }

  else if (label == "Open Hand") {
    background(70, 130, 200);
  }

  else if (label == "Peace") {
    background(230, 190, 70);
  }

  else {
    background(0);
  }


  // draw video
  image(flippedVideo, 0, 0);


  // draw shape based on label
  noStroke();

  if (label == "Fist") {
    fill(255, 100);
    circle(160, 120, 60);
  }

  else if (label == "Open Hand") {
    fill(255, 100);
    circle(160, 120, 120);
  }

  else if (label == "Peace") {
    fill(255, 100);
    circle(110, 120, 40);
    circle(160, 120, 40);
    circle(210, 120, 40);
  }


  // draw label
  fill(255);
  textSize(16);
  textAlign(CENTER);

  text(label, width / 2, height - 4);
}


// get prediction for the current video frame
function classifyVideo() {
  flippedVideo = ml5.flipImage(video);

  classifier.classify(flippedVideo, gotResult);
}


function gotResult(error, results) {

  if (error) {
    console.error(error);
    return;
  }

  label = results[0].label; // results in array ordered by confidence

  classifyVideo(); // classify again
}