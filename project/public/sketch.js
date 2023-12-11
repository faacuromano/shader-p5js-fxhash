let theShader;
let shaderTexture;
let song;
let fft;

let x;
let y;

function preload(){
  // load the shader
  song = loadSound('./atms2.mp3');
  theShader = loadShader('./basic.vert','./basic.frag');
}

function setup() {
  createCanvas(800, 800, WEBGL);
  noStroke();
  fft = new p5.FFT();
  shaderTexture = createGraphics(800, 800, WEBGL);

}

function draw() {
  valueSound = fft.waveform()
  shaderTexture.shader(theShader);
  bg = $fx.getParam('valueSound')
  theShader.setUniform("resolution", [width, height]);
  theShader.setUniform("time", millis() / 1000.0);
  theShader.setUniform("mouse", [mouseX, map(mouseY, 0, height, height, 0)]);
  theShader.setUniform("song", valueSound[6]);
  theShader.setUniform("det",  .0001);
  theShader.setUniform("maxdist", 50);
  shaderTexture.rect(0,0,width,height);

  background(55);
  
  texture(shaderTexture);
  
  
  rect(-400,-400,800,800);
}

function mouseClicked(){
    if (song.isPlaying()){
      song.pause()
      noLoop()
    }
    else{
      song.play()
       loop()
    }
    
  }