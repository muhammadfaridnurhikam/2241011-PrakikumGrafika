var canvas = document.getElementById('canvas');
var gl = canvas.getContext('webgl');

// Cek browser
if (!gl) {
    console.log('Browser tidak mendukung WebGL.');
} else {
    console.log('Browser mendukung WebGL.');

    var canvasWidth = 400;
    var canvasHeight = 400;

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    // Warna canvas
    gl.clearColor(0.4343, 0.2422, 0.3343, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Vertex shader source
    var vertexShaderSource = `
        attribute vec2 a_position;
        uniform float u_angle;
        void main() {
            mat2 rotationMatrix = mat2(cos(u_angle), sin(u_angle), -sin(u_angle), cos(u_angle)); // Perubahan sin dan -sin
            gl_Position = vec4(rotationMatrix * a_position, 0.0, 1.0);
        }
    `;

    // Fragment shader source
    var fragmentShaderSource = `
        precision mediump float;
        void main() {
            gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
        }
    `;

    // Buat vertex shader
    var vShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vShader, vertexShaderSource);
    gl.compileShader(vShader);

    // Buat fragment shader
    var fShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fShader, fragmentShaderSource);
    gl.compileShader(fShader);

    // Program shader
    var shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vShader);
    gl.attachShader(shaderProgram, fShader);
    gl.linkProgram(shaderProgram);
    gl.useProgram(shaderProgram);

    // Variabel untuk menyimpan sudut rotasi
    var rotationAngle1 = 0;
    var rotationAngle2 = Math.PI; // Sudut awal untuk segitiga kedua
    var angleLocation = gl.getUniformLocation(shaderProgram, 'u_angle');

    function drawTriangles() {
        // Titik-titik untuk dua segitiga
        var vertices = [
            -0.5, 0.2,  // Titik A (pindah ke atas)
            0.5, 0.2,   // Titik B (pindah ke atas)
            0.0, 0.7,   // Titik C (pindah ke atas)
            -0.8, -0.6, // Titik D
            0.8, -0.6,  // Titik E
            0.0, -0.1   // Titik F
        ];

        // Buffer segitiga
        var vBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

        // Location
        var positionLocation = gl.getAttribLocation(shaderProgram, 'a_position');
        gl.enableVertexAttribArray(positionLocation);
        gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

        // Mengirim sudut rotasi ke shader untuk segitiga pertama (dari kanan)
        gl.uniform1f(angleLocation, -rotationAngle1); // Menggunakan -rotationAngle1

        // Gambar segitiga pertama
        gl.drawArrays(gl.TRIANGLES, 0, 3);

        // Mengirim sudut rotasi ke shader untuk segitiga kedua (dari kiri)
        gl.uniform1f(angleLocation, -rotationAngle2); // Menggunakan -rotationAngle2

        // Gambar segitiga kedua
        gl.drawArrays(gl.TRIANGLES, 3, 3);
    }

    function updateRotation() {
        rotationAngle1 += 0.01; // Atur kecepatan rotasi segitiga pertama
        rotationAngle2 -= 0.01; // Atur kecepatan rotasi segitiga kedua
    }

    function animateTriangles() {
        gl.clear(gl.COLOR_BUFFER_BIT);

        updateRotation();
        drawTriangles();

        requestAnimationFrame(animateTriangles);
    }

    animateTriangles();
}
