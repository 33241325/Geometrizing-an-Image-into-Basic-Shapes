var offsets;
var pointX;
var pointY;
var img;
var insert;
var canvas;
var c;
var side;
var height;
var width;
var rad;
var itt = 0;
var itt0;
var hLock;
var wLock;
var image;
var pixels = [];
rad = 5;
sig = 1;
den = 50;
siz = 5;

function load(){
  img = document.querySelector('#myImg');
  insert = document.getElementById("insert");

  // getting a reference to our HTML element
  canvas = document.querySelector('canvas');

  // initiating 2D context on it
  c = canvas.getContext('2d');

  resizeCanvas();
  resizeImage();
}

addEventListener('resize', () => {resizeCanvas(); resizeImage();})

function resizeImage() {
  if (img.naturalWidth && img.naturalHeight > 0){
    if (img.naturalWidth / img.naturalHeight > (window.innerWidth*40 + 20) / (window.innerHeight*60 + 20)){
      img.classList.add("widthLock");
      img.classList.remove("heightLock");
      wLock = true;
    }
    else if (img.naturalHeight / img.naturalWidth >((window.innerHeight*60 + 20) / (window.innerWidth*40 + 20))){
      img.classList.add("heightLock");
      img.classList.remove("widthLock");
      hLock = true;
    }
  }
}

function resizeCanvas() {
  canvas.width = img.width;
  canvas.height = img.width * img.naturalHeight / img.naturalWidth;
  document.getElementById("canvasParent").style.height = img.width * img.naturalHeight / img.naturalWidth + "px";
  if(img.classList.contains('empty') == false){
    document.getElementById("canvasParent").style.marginTop = (document.getElementById("imageParent").offsetHeight - canvas.height)/2 + 10 + "px";
  }
}

window.addEventListener('load', function() {
  document.querySelector('input[type="file"]').addEventListener('change', function() {
      if (this.files && this.files[0]) {
          img.onload = () => {
              URL.revokeObjectURL(img.src);  // no longer needed, free memory
          }
          img.src = URL.createObjectURL(this.files[0]); // set src to blob ur;
          var a = this.files[0]
          resizeCanvas();
          image = new Image();
          image.src = document.getElementById('myImg').src;
          img.classList.remove("empty");
          pixels = [];
          console.log(this.files[0]);
          setTimeout(() => {resizeImage();}, 20);
      }
  });
});

function getCursorPosition(event) {
  offsets = document.getElementById('canvas').getBoundingClientRect();
  pointX = event.clientX - offsets.left;
  pointY = event.clientY - offsets.top;
}

function execute() {
  if(pixels == 0){
    const canvas = document.createElement('canvas');
    canvas.width = image.width;
    canvas.height = image.height;

    const ctx = canvas.getContext('2d');
    ctx.drawImage(image, 0, 0, image.width, image.height);

    console.log('Image dimension:', image.width, image.height);

    const imageData = ctx.getImageData(0, 0, image.width, image.height);
    const pixelData = imageData.data;

    updateShape();

    for (let y = 0; y < image.height; y+= Math.floor(image.height/den)) {
      const row = [];
      for (let x = 0; x < image.width; x+= Math.floor(image.height/den)) {
        const i = (y * image.width + x) * 4;
        const r = pixelData[i];
        const g = pixelData[i + 1];
        const b = pixelData[i + 2];
        row.push([r, g, b]);
      }
      pixels.push(row);
    }
    console.log('RGB values of every pixel:', pixels);
  }

  updateRad();
  if (rad == 0 || sig == 0){
    render(pixels);
  }
  else {
    applyGaussianBlur(pixels, rad, sig);
  }
}

function applyGaussianBlur(pixels, radius, sigma) {
  const width = pixels[0].length;
  const height = pixels.length;
  const kernelSize = radius * 2 + 1;
  const kernel = createGaussianKernel(kernelSize, sigma);
  const blurredPixels = [];

  for (let y = 0; y < height; y++) {
    const row = [];
    for (let x = 0; x < width; x++) {
      let rSum = 0, gSum = 0, bSum = 0, kernelSum = 0;

      for (let ky = -radius; ky <= radius; ky++) {
        const ny = y + ky;
        if (ny < 0 || ny >= height) continue;

        for (let kx = -radius; kx <= radius; kx++) {
          const nx = x + kx;
          if (nx < 0 || nx >= width) continue;

          const [r, g, b] = pixels[ny][nx];
          const weight = kernel[ky + radius][kx + radius];
          rSum += r * weight;
          gSum += g * weight;
          bSum += b * weight;
          kernelSum += weight;
        }
      }

      const r = Math.round(rSum / kernelSum);
      const g = Math.round(gSum / kernelSum);
      const b = Math.round(bSum / kernelSum);
      row.push([r, g, b]);
    }
    blurredPixels.push(row);
  }
  render(blurredPixels);
}

function createGaussianKernel(size, sigma) {
  const kernel = [];

  for (let i = 0; i < size; i++) {
    const row = [];
    for (let j = 0; j < size; j++) {
      const x = j - Math.floor(size / 2);
      const y = i - Math.floor(size / 2);
      const weight = Math.exp(-(x * x + y * y) / (2 * sigma * sigma));
      row.push(weight);
    }
    kernel.push(row);
  }

  const kernelSum = kernel.reduce((acc, row) => acc + row.reduce((acc2, weight) => acc2 + weight, 0), 0);
  const normalizedKernel = kernel.map(row => row.map(weight => weight / kernelSum));
  return normalizedKernel;
}

function render(matrix){
  resizeCanvas();
  updateShape();
  canvas = document.getElementById('canvas');
  c = canvas.getContext('2d');
  for (var ro = 0; ro < matrix.length; ro ++) {
    for (var co = 0; co < matrix[ro].length; co ++) {
      r = matrix[ro][co][0]
      g = matrix[ro][co][1]
      b = matrix[ro][co][2]
      var rgb = "#" + r.toString(16) + g.toString(16) + b.toString(16);
      side = siz;

      //square
      c.fillStyle = rgb;
      c.fillRect(co*canvas.width/matrix[ro].length - side/2, ro*canvas.height/matrix.length - side/2, side, side);

      //circle
      /*c.beginPath();
      c.arc(co*canvas.width/matrix[ro].length - side/2, ro*canvas.height/matrix.length - side/2, side, 0, 2 * Math.PI, false);
      c.fillStyle = rgb;
      c.fill();*/

      //triangle
      /*var h = (Math.sqrt(3) / 2) * side;
      c.beginPath();
      c.moveTo(co*canvas.width/matrix[ro].length - side/2, (ro*canvas.height/matrix.length - side/2) - h/2);
      c.lineTo((co*canvas.width/matrix[ro].length - side/2) - (side / 2), (ro*canvas.height/matrix.length - side/2) + h/2);
      context.lineTo((co*canvas.width/matrix[ro].length - side/2) + (side / 2), (ro*canvas.height/matrix.length - side/2) + (height / 2));
      context.closePath();
      context.fillStyle = rgb;
      context.fill();*/
    }
  }
}

function updateRad(){
  rad = parseFloat(document.getElementById('blurRad').value);
  sig = parseFloat(document.getElementById('blurSig').value);
}

function updateShape(){
  den = parseFloat(document.getElementById('pixDen').value);
  siz = parseFloat(document.getElementById('pixSiz').value);
}

function clear1(){
  resizeCanvas();
  pixels = [];
}

window.addEventListener('load', function() {
  setTimeout(() => {
    //updates blur slider
    const radius = document.getElementById('blurRad');
    const radiusDisplay = document.getElementById('displayRadius');
    radius.addEventListener('input', (event) => {
      var value = event.target.value;
      radiusDisplay.innerHTML = "Blur radius: "+ `${value}`;
      rad = value;
    });
    const sigma = document.getElementById('blurSig');
    const sigmaDisplay = document.getElementById('displaySigma');
    sigma.addEventListener('input', (event) => {
      var value = event.target.value;
      sigmaDisplay.innerHTML = "Blur sigma: "+ `${value}`;
      sig = value;
    });

    //Shape settings
    const density = document.getElementById('pixDen');
    const displayDensity = document.getElementById('displayDensity');
    density.addEventListener('input', (event) => {
      var value = event.target.value;
      displayDensity.innerHTML = "Shape density: "+ `${value}`;
      den = value;
    });
    const size = document.getElementById('pixSiz');
    const displaySize = document.getElementById('displaySize');
    size.addEventListener('input', (event) => {
      var value = event.target.value;
      displaySize.innerHTML = "Shape size: "+ `${value}`;
      siz = value;
    });
  }, 10);
})
