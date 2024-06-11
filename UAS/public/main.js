var canvas = document.getElementById("canvas");
    var gl = canvas.getContext("webgl");

    if (!gl) {
        console.log("Browser tidak mendukung WebGL");
    } else {
        console.log("Browser mendukung WebGL.");
    }

    const canvasWidth = 650;
    const canvasHeight = 650;

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    gl.viewport(0, 0, canvas.width, canvas.height);

    gl.clearColor(0.96, 0.94, 0.9, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    var vertexShaderSource = `
        attribute vec2 a_position;
        uniform vec2 u_translation;
        uniform vec2 u_resolution;
        void main() {
            vec2 zeroToOne = (a_position + u_translation) / u_resolution;
            vec2 zeroToTwo = zeroToOne * 2.0;
            vec2 clipSpace = zeroToTwo - 1.0;
            gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
        }
    `;

    var fragmentShaderSource = `
        precision mediump float;
        uniform vec4 u_color;
        void main() { 
            gl_FragColor = u_color;
        }
    `;

    var vShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vShader, vertexShaderSource);
    gl.compileShader(vShader);

    var fShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fShader, fragmentShaderSource);
    gl.compileShader(fShader);

    var shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vShader);
    gl.attachShader(shaderProgram, fShader);
    gl.linkProgram(shaderProgram);
    gl.useProgram(shaderProgram);

    var paddleWidth = 100;
    var paddleHeight = 20;
    var paddleX = (canvasWidth - paddleWidth) / 2;
    var paddleY = canvasHeight - paddleHeight - 10;

    var ballRadius = 10;
    var ballX = canvasWidth / 2;
    var ballY = canvasHeight / 2;
    var ballDX = 2;
    var ballDY = -2;

    var brickRowCount = 5;
    var brickColumnCount = 7;
    var brickWidth = 75;
    var brickHeight = 20;
    var brickPadding = 10;
    var brickOffsetTop = 30;
    var brickOffsetLeft = 30;

    var bricks = [];
    for (var c = 0; c < brickColumnCount; c++) {
        bricks[c] = [];
        for (var r = 0; r < brickRowCount; r++) {
            bricks[c][r] = { x: 0, y: 0, status: 1 };
        }
    }

    var rightPressed = false;
    var leftPressed = false;

    document.addEventListener("keydown", keyDownHandler, false);
    document.addEventListener("keyup", keyUpHandler, false);

    function keyDownHandler(e) {
        if (e.key == "Right" || e.key == "ArrowRight") {
            rightPressed = true;
        } else if (e.key == "Left" || e.key == "ArrowLeft") {
            leftPressed = true;
        }
    }

    function keyUpHandler(e) {
        if (e.key == "Right" || e.key == "ArrowRight") {
            rightPressed = false;
        } else if (e.key == "Left" || e.key == "ArrowLeft") {
            leftPressed = false;
        }
    }

    function drawPaddle() {
        drawRectangle(paddleX, paddleY, paddleWidth, paddleHeight, [0, 0, 1, 1]);
    }

    function drawBall() {
        drawCircle(ballX, ballY, ballRadius, [1, 0, 0, 1]);
    }

    function drawBricks() {
        for (var c = 0; c < brickColumnCount; c++) {
            for (var r = 0; r < brickRowCount; r++) {
                if (bricks[c][r].status == 1) {
                    var brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
                    var brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
                    bricks[c][r].x = brickX;
                    bricks[c][r].y = brickY;
                    drawRectangle(brickX, brickY, brickWidth, brickHeight, [0, 1, 0, 1]);
                }
            }
        }
    }

    function drawRectangle(x, y, width, height, color) {
        var positions = [
            x, y,
            x + width, y,
            x, y + height,
            x, y + height,
            x + width, y,
            x + width, y + height,
        ];

        var positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

        var positionLocation = gl.getAttribLocation(shaderProgram, "a_position");
        gl.enableVertexAttribArray(positionLocation);
        gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

        var resolutionLocation = gl.getUniformLocation(shaderProgram, "u_resolution");
        gl.uniform2f(resolutionLocation, canvasWidth, canvasHeight);

        var translationLocation = gl.getUniformLocation(shaderProgram, "u_translation");
        gl.uniform2f(translationLocation, 0, 0);

        var colorLocation = gl.getUniformLocation(shaderProgram, "u_color");
        gl.uniform4fv(colorLocation, color);

        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 6);
    }

    function drawCircle(x, y, radius, color) {
        var numSegments = 50;
        var positions = [];

        for (var i = 0; i <= numSegments; i++) {
            var angle = (i * 2 * Math.PI) / numSegments;
            positions.push(x + radius * Math.cos(angle));
            positions.push(y + radius * Math.sin(angle));
        }

        var positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

        var positionLocation = gl.getAttribLocation(shaderProgram, "a_position");
        gl.enableVertexAttribArray(positionLocation);
        gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

        var resolutionLocation = gl.getUniformLocation(shaderProgram, "u_resolution");
        gl.uniform2f(resolutionLocation, canvasWidth, canvasHeight);

        var translationLocation = gl.getUniformLocation(shaderProgram, "u_translation");
        gl.uniform2f(translationLocation, 0, 0);

        var colorLocation = gl.getUniformLocation(shaderProgram, "u_color");
        gl.uniform4fv(colorLocation, color);

        gl.drawArrays(gl.TRIANGLE_FAN, 0, positions.length / 2);
    }

    function collisionDetection() {
        for (var c = 0; c < brickColumnCount; c++) {
            for (var r = 0; r < brickRowCount; r++) {
                var b = bricks[c][r];
                if (b.status == 1) {
                    if (
                        ballX > b.x &&
                        ballX < b.x + brickWidth &&
                        ballY > b.y &&
                        ballY < b.y + brickHeight
                    ) {
                        ballDY = -ballDY;
                        b.status = 0;
                    }
                }
            }
        }
    }

    function update() {
        if (rightPressed && paddleX < canvasWidth - paddleWidth) {
            paddleX += 7;
        } else if (leftPressed && paddleX > 0) {
            paddleX -= 7;
        }

        ballX += ballDX;
        ballY += ballDY;

        if (ballX + ballDX > canvasWidth - ballRadius || ballX + ballDX < ballRadius) {
            ballDX = -ballDX;
        }
        if (ballY + ballDY < ballRadius) {
            ballDY = -ballDY;
        } else if (ballY + ballDY > canvasHeight - ballRadius) {
            if (ballX > paddleX && ballX < paddleX + paddleWidth) {
                ballDY = -ballDY;
                var deltaX = ballX - (paddleX + paddleWidth / 2);
                ballDX = deltaX * 0.2;
            } else {
                document.location.reload();
            }
        }

        collisionDetection();
    }

    function draw() {
        gl.clear(gl.COLOR_BUFFER_BIT);
        drawPaddle();
        drawBall();
        drawBricks();
        update();
        requestAnimationFrame(draw);
    }

    draw();
