(function() {
	"use strict";

	var socket = null
	,	canvas = null
	,	canvasWidth = 500
	,	canvasHeight = 500
	, 	ctx = null
	,	firstClick = true
	,	mouseDown = false
	,	x1, x2 = 0
	,	y1, y2 = 0
	,	clearBtn = null;

	// Socket.io
	socket = io.connect();

	// Canvas & drawing
	canvas = document.getElementById("draw-space");
	ctx = canvas.getContext("2d");

	canvas.addEventListener('mousedown', function (event) {
		event.preventDefault();
		mouseDown = true;
	});

	canvas.addEventListener('mouseup', function (event) {
		event.preventDefault();
		mouseDown = false;
		firstClick = true;
	});

	canvas.addEventListener('mousemove', function (event) {
		event.preventDefault();
		if (mouseDown)
		{
			handleUserDrawAtPosition(event.clientX, event.clientY);
		}
	});

	socket.on('draw:line', function (data) {
		drawLine(data.line, data.color);
	});

	socket.on('draw:clear', function () {
		clearCtx();
	});

	function handleUserDrawAtPosition(x, y)
	{
		x1 = x2;
		y1 = y2;
		x2 = x;
		y2 = y;

		if (firstClick)
		{
			x1 = x2;
			y1 = y2;
			x2++;
			y2++;
			firstClick = false;
		}

		var line = new Line([x1, y1], [x2, y2]);
		drawLine(line, currentColor);

		socket.emit('draw:line', {line:line, color:currentColor});
	}

	function drawLine(line, color)
	{
		ctx.save();
		ctx.beginPath();
		ctx.strokeStyle = color;
		ctx.moveTo(line.from.x, line.from.y);
		ctx.lineTo(line.to.x, line.to.y);
		ctx.closePath();
		ctx.stroke();
		ctx.restore();
	}

	// Clear
	clearBtn = document.getElementById("clear-btn");

	clearBtn.addEventListener('click', function (event) {
		clearCtx();
		socket.emit('draw:clear');
	});

	function clearCtx()
	{
		firstClick = true;
		ctx.clearRect(0, 0, canvasWidth, canvasHeight);
	}

	/* 
		An object representing a line

		@constructor
			from: Array[2] coordinate [x, y]
			to: Array[2] coordinate [x, y]

		@properties
			from: Coordinate
			to: Coordinate
	*/
	function Line(from, to)
	{
		this.from = new Coordinate(from[0], from[1]);
		this.to = new Coordinate(to[0], to[1]);
	}

	function Coordinate(x, y)
	{
		this.x = x;
		this.y = y;
	}

})();

//Color management
var red = document.getElementById('slide-red').value;
var	green = document.getElementById('slide-green').value;
var blue = document.getElementById('slide-blue').value;
var currentColor;

changeBackgroundColor(red,green, blue);

function onRedChanged(value) {
    red = value;
    changeBackgroundColor(red, green, blue);
}

function onGreenChanged(value) {
    green = value;
    changeBackgroundColor(red, green, blue);
}
function onBlueChanged(value) {
    blue = value;
    changeBackgroundColor(red, green, blue);
}
function changeBackgroundColor(red, green, blue) {
    var color = "rgb(" + red + ", " + green + ", " + blue + ")";
    var box = document.getElementById('color-box');
    currentColor = color;
    box.setAttribute("style","background-color:"+color+";width:50px;height:50px;");
}
