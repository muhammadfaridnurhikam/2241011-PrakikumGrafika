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

var vertexShaderSource = `
  attribute vec2 a_position;
  void main() {
    gl_PointSize = 12.0;
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`;

var fragmentShaderSource = `
  precision mediump float;  

  void main() {
      gl_FragColor = vec4(0, 0, 0, 1);
  }
`;

var vertexShader = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(vertexShader, vertexShaderSource);
gl.compileShader(vertexShader);

var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fragmentShader, fragmentShaderSource);
gl.compileShader(fragmentShader);

var shaderProgram = gl.createProgram();
gl.attachShader(shaderProgram, vertexShader);
gl.attachShader(shaderProgram, fragmentShader);
gl.linkProgram(shaderProgram);
gl.useProgram(shaderProgram);

var kotakPosisi = { x: 0, y: 0 };
var kecepatanVertikal = 0;
var kecepatanLompat = 0.03;
var gravitasi = 0.001;
var skor = 0; // Tambahkan variabel skor

var rintanganPosisi = { x: 0.8, y: 0 }; // Inisialisasi posisi rintangan

function GambarKotak() {
  var kotakVertices = [
    // Vertices kotak
    -0.1 + kotakPosisi.x,
    0.1 + kotakPosisi.y,
    -0.1 + kotakPosisi.x,
    -0.1 + kotakPosisi.y,
    0.1 + kotakPosisi.x,
    0.1 + kotakPosisi.y,
    -0.1 + kotakPosisi.x,
    -0.1 + kotakPosisi.y,
    0.1 + kotakPosisi.x,
    -0.1 + kotakPosisi.y,
    0.1 + kotakPosisi.x,
    0.1 + kotakPosisi.y,
  ];

  var positionBuffer = createAndBindBuffer(kotakVertices);

  var positionAttributeLocation = gl.getAttribLocation(
    shaderProgram,
    "a_position"
  );
  gl.enableVertexAttribArray(positionAttributeLocation);

  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);
}

function GambarRintangan() {
  var rintanganVertices = [
    // Vertices rintangan (contoh: persegi panjang)
    0.8, 0.1,
    0.8, -0.1,
    0.9, 0.1,
    0.9, -0.1,
    0.9, 0.1,
    0.8, -0.1,
  ];

  var positionBuffer = createAndBindBuffer(rintanganVertices);

  var positionAttributeLocation = gl.getAttribLocation(
    shaderProgram,
    "a_position"
  );
  gl.enableVertexAttribArray(positionAttributeLocation);

  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);
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

  GambarKotak();
  GambarRintangan(); // Gambar rintangan di layar
  DeteksiTabrakan(); // Deteksi tabrakan antara kotak dan rintangan
  TampilkanSkor(); // Tampilkan skor di layar
  gl.drawArrays(gl.TRIANGLES, 0, 6); // Menggunakan TRIANGLES untuk menggambar kotak
  requestAnimationFrame(Animasi);
}

function DeteksiTabrakan() {
  // Logika deteksi tabrakan antara kotak dan rintangan
  if (
    kotakPosisi.x + 0.1 >= rintanganPosisi.x &&
    kotakPosisi.x - 0.1 <= rintanganPosisi.x + 0.1 &&
    kotakPosisi.y + 0.1 >= rintanganPosisi.y &&
    kotakPosisi.y - 0.1 <= rintanganPosisi.y + 0.1
  ) {
    skor++;
    rintanganPosisi.x = 1.2; // Pindahkan rintangan ke posisi baru setelah tabrakan
  }
}

function TampilkanSkor() {
  var skorElement = document.getElementById("skor");
  skorElement.innerHTML = "Skor: " + skor;
}

Animasi();
