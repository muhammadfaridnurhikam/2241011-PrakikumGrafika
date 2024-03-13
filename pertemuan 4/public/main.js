const canvas = document.querySelector("canvas");
const gl = canvas.getContext("webgl");

if (!gl) {
  throw new Error("Tidak Support WebGL");
}

// Set canvas size
const canvasWidth = 400;
const canvasHeight = 400;
canvas.width = canvasWidth;
canvas.height = canvasHeight;
gl.viewport(0, 0, canvas.width, canvas.height);

// Clear the canvas
gl.clearColor(0,998, 0.667, 0.99, 1.0);
gl.clear(gl.COLOR_BUFFER_BIT);

// Define the initial line coordinates
let positionY = 0.5;
let direction = 1;
const speed = 0.01;

// Animation function
function animate() {
  gl.clear(gl.COLOR_BUFFER_BIT);

  // Update position for animation
  positionY += speed * direction;

  // Change direction when reaching top or bottom
  if (positionY > 0.8 || positionY < -0.8) {
    direction *= -1;
  }

  // Set the new Y coordinate for the line
  const line = [
    -0.5, positionY,
    0.5, positionY,
  ];

  // Create buffer for line coordinates
  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(line), gl.STATIC_DRAW);

  // Vertex shader source code
  const vertexShaderSource = `
    attribute vec2 a_position;
    void main() {
      gl_Position = vec4(a_position, 0.0, 1.0);
    }
  `;

  // Fragment shader source code
  const fragmentShaderSource = `
    precision mediump float;  
    void main() {
      gl_FragColor = vec4(0, 0, 0, 1);
    }
  `;

  // Create and compile shaders
  const vertexShader = gl.createShader(gl.VERTEX_SHADER);
  gl.shaderSource(vertexShader, vertexShaderSource);
  gl.compileShader(vertexShader);

  const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(fragmentShader, fragmentShaderSource);
  gl.compileShader(fragmentShader);

  // Create shader program and link shaders
  const shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);
  gl.useProgram(shaderProgram);

  // Get the attribute location and enable it
  const positionAttributeLocation = gl.getAttribLocation(shaderProgram, "a_position");
  gl.enableVertexAttribArray(positionAttributeLocation);

  // Point an attribute to the currently bound VBO
  gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

  // Draw the line
  gl.drawArrays(gl.LINES, 0, 2);

  // Request the next animation frame
  requestAnimationFrame(animate);
}

// Start the animation
animate();
