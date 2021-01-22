var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

var currentState = "";
var leader = true;

// HTML file
app.get('/', (req, res) => {
	res.sendFile(__dirname + '/myCanvas.html');
});

// When someone connects or disconnects
io.on('connection', (socket) => {
	console.log('A user connected');
	socket.join('0');
	socket.emit('startingImage', currentState, leader);
	
	socket.on('changeRoom', (msg) => {
		socket.join(msg.newRoom);
		socket.leave(msg.previousRoom);
	});
	
	
	socket.on('receiveImage', (msg) => {
		currentState = msg.canvas;
		socket.to(msg.room).emit('sendImage', msg.canvas);
	});
	
	socket.on('clear', (msg) => {
		currentState = "";
		socket.broadcast.emit('clear', msg);
	});
	
	socket.on('updateMenu', (msg) => {
		socket.broadcast.emit('updateMenu', msg);
	});
	
	socket.on('disconnect', () => {
		console.log('User disconnected');
	});
});

http.listen(3000, () => {
	console.log('Listening on *:3000');
});