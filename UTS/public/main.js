var canvas = document.querySelector("canvas");
var gl = canvas.getContext("webgl");

if (!gl) {
  throw new Error("Tidak Support WebGL");
}

alert("Silahkan Klik OK");

var canvasWidth = 400;
var canvasHeight = 400;

canvas.width = canvasWidth;
canvas.height = canvasHeight;

gl.clearColor(1.0, 0.0, 1.0, 1.0);
gl.clear(gl.COLOR_BUFFER_BIT);
gl.viewport(0, 0, canvas.width, canvas.height);

// Definisikan program shader untuk KotakPosisi
var kotakVertexShaderSource = `
  attribute vec2 a_position;
  void main() {
    gl_PointSize = 12.0;
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`;

var kotakFragmentShaderSource = `
  precision mediump float;  

  void main() {
      gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0); // Warna hitam untuk KotakPosisi
  }
`;

// Buat program shader untuk KotakPosisi
var kotakVertexShader = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(kotakVertexShader, kotakVertexShaderSource);
gl.compileShader(kotakVertexShader);

var kotakFragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(kotakFragmentShader, kotakFragmentShaderSource);
gl.compileShader(kotakFragmentShader);

var kotakShaderProgram = gl.createProgram();
gl.attachShader(kotakShaderProgram, kotakVertexShader);
gl.attachShader(kotakShaderProgram, kotakFragmentShader);
gl.linkProgram(kotakShaderProgram);

// Definisikan program shader untuk rintanganPosisi
var rintanganVertexShaderSource = `
  attribute vec2 a_position;
  void main() {
    gl_PointSize = 12.0;
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`;

var rintanganFragmentShaderSource = `
  precision mediump float;  

  void main() {
      gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0); // Warna merah untuk rintanganPosisi
  }
`;

// Buat program shader untuk rintanganPosisi
var rintanganVertexShader = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(rintanganVertexShader, rintanganVertexShaderSource);
gl.compileShader(rintanganVertexShader);

var rintanganFragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(rintanganFragmentShader, rintanganFragmentShaderSource);
gl.compileShader(rintanganFragmentShader);

var rintanganShaderProgram = gl.createProgram();
gl.attachShader(rintanganShaderProgram, rintanganVertexShader);
gl.attachShader(rintanganShaderProgram, rintanganFragmentShader);
gl.linkProgram(rintanganShaderProgram);

var kotakPosisi = { x: -0, y: 1 };
var rintanganPosisi1 = { x: 1.0, y: 0.0 }; // Posisi awal rintangan pertama
var rintanganPosisi2 = { x: 2.0, y: 0.0 }; // Posisi awal rintangan kedua
var rintanganPosisi3 = { x: 3.0, y: 0.0 }; // Posisi awal rintangan ketiga
var rintanganPosisi4 = { x: 3.3, y: 0.6 }; // Posisi awal rintangan keempat
var kecepatanVertikal = 0;
var kecepatanLompat = 0.03;
var gravitasi = 0.001;
var kecepatanRintangan = 0.005; // Kecepatan pergerakan rintangan

function GambarKotak(x, y, program) {
  gl.useProgram(program);

  var kotakVertices = [
    // Vertices kotak
    -0.1 + x,
    0.1 + y,
    -0.1 + x,
    -0.1 + y,
    0.1 + x,
    0.1 + y,
    -0.1 + x,
    -0.1 + y,
    0.1 + x,
    -0.1 + y,
    0.1 + x,
    0.1 + y,
  ];

  var positionBuffer = createAndBindBuffer(kotakVertices);
  var positionAttributeLocation = gl.getAttribLocation(program, "a_position");
  gl.enableVertexAttribArray(positionAttributeLocation);

  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);
  gl.drawArrays(gl.TRIANGLES, 0, 6);
}

function createAndBindBuffer(data) {
  var buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
  return buffer;
}

function handleKeyPress(event) {
  if (event.code === "Space") {
    kecepatanVertikal = kecepatanLompat;
  }
}

document.addEventListener("keydown", handleKeyPress);

function Animasi() {
  gl.clear(gl.COLOR_BUFFER_BIT);

  // Deteksi tabrakan dengan rintangan1
  if (
    kotakPosisi.x + 0.1 > rintanganPosisi1.x &&
    kotakPosisi.x < rintanganPosisi1.x + 0.2 &&
    kotakPosisi.y + 0.1 > rintanganPosisi1.y &&
    kotakPosisi.y < rintanganPosisi1.y + 0.2
  ) {
    // Tabrakan terjadi dengan rintangan1, restart permainan
    RestartPermainan();
    return; // Menghentikan iterasi agar tidak melanjutkan ke deteksi tabrakan selanjutnya
  }

  // Deteksi tabrakan dengan rintangan2
  if (
    kotakPosisi.x + 0.1 > rintanganPosisi2.x &&
    kotakPosisi.x < rintanganPosisi2.x + 0.2 &&
    kotakPosisi.y + 0.1 > rintanganPosisi2.y &&
    kotakPosisi.y < rintanganPosisi2.y + 0.2
  ) {
    // Tabrakan terjadi dengan rintangan2, restart permainan
    RestartPermainan();
    return;
  }

  // Deteksi tabrakan dengan rintangan3
  if (
    kotakPosisi.x + 0.1 > rintanganPosisi3.x &&
    kotakPosisi.x < rintanganPosisi3.x + 0.2 &&
    kotakPosisi.y + 0.1 > rintanganPosisi3.y &&
    kotakPosisi.y < rintanganPosisi3.y + 0.2
  ) {
    // Tabrakan terjadi dengan rintangan3, restart permainan
    RestartPermainan();
    return;
  }

  // Deteksi tabrakan dengan rintangan4
  if (
    kotakPosisi.x + 0.1 > rintanganPosisi4.x &&
    kotakPosisi.x < rintanganPosisi4.x + 0.2 &&
    kotakPosisi.y + 0.1 > rintanganPosisi4.y &&
    kotakPosisi.y < rintanganPosisi4.y + 0.2
  ) {
    // Tabrakan terjadi dengan rintangan4, restart permainan
    RestartPermainan();
    return;
  }

  // Terapkan gravitasi
  kecepatanVertikal -= gravitasi;

  // Perbarui posisi vertikal kotak
  kotakPosisi.y += kecepatanVertikal;

  // Batasi pergerakan kotak agar tidak keluar dari layar
  if (kotakPosisi.y > 0.6) {
    kotakPosisi.y = 0.6;
    kecepatanVertikal = 0;
  } else if (kotakPosisi.y < 0.0) {
    kotakPosisi.y = 0.0;
    kecepatanVertikal = 0;
  }

  // Perbarui posisi rintangan pertama
  rintanganPosisi1.x -= kecepatanRintangan;
  if (rintanganPosisi1.x < -1.0) {
    rintanganPosisi1.x = 1.0;
  }

  // Perbarui posisi rintangan kedua
  rintanganPosisi2.x -= kecepatanRintangan;
  if (rintanganPosisi2.x < -1.0) {
    rintanganPosisi2.x = 1.0;
  }

  // Perbarui posisi rintangan ketiga
  rintanganPosisi3.x -= kecepatanRintangan;
  if (rintanganPosisi3.x < -1.0) {
    rintanganPosisi3.x = 1.0;
  }

  // Perbarui posisi rintangan keempat
  rintanganPosisi4.x -= kecepatanRintangan;
  if (rintanganPosisi4.x < -1.0) {
    rintanganPosisi4.x = 1.3;
  }

  // Gambar KotakPosisi
  GambarKotak(kotakPosisi.x, kotakPosisi.y, kotakShaderProgram);

  // Gambar rintanganPosisi
  GambarKotak(rintanganPosisi1.x, rintanganPosisi1.y, rintanganShaderProgram);
  GambarKotak(rintanganPosisi2.x, rintanganPosisi2.y, rintanganShaderProgram);
  GambarKotak(rintanganPosisi3.x, rintanganPosisi3.y, rintanganShaderProgram);
  GambarKotak(rintanganPosisi4.x, rintanganPosisi4.y, rintanganShaderProgram);

  requestAnimationFrame(Animasi);
}
function MulaiPermainan() {
  kotakPosisi = { x: -0, y: 1 };
  rintanganPosisi1 = { x: 1.0, y: 0.0 };
  rintanganPosisi2 = { x: 2.0, y: 0.0 };
  rintanganPosisi3 = { x: 3.0, y: 0.0 };
  rintanganPosisi4 = { x: 3.3, y: 0.6 };
  kecepatanVertikal = 0;
  Animasi(); // Memulai animasi kembali setelah restart
}

function RestartPermainan() {
  kotakPosisi = { x: -0, y: 1 };
  rintanganPosisi1 = { x: 1.0, y: 0.0 };
  rintanganPosisi2 = { x: 2.0, y: 0.0 };
  rintanganPosisi3 = { x: 3.0, y: 0.0 };
  rintanganPosisi4 = { x: 3.3, y: 0.6 };
  kecepatanVertikal = 0;
  var confirmRestart = confirm("Anda kalah! Klik OK untuk mulai lagi.");
  if (confirmRestart) {
    MulaiPermainan();
  }
}

Animasi();
