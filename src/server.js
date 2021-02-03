import express from 'express'
import { Server } from 'socket.io'

// init web server
var app = express()
// app.use(express.json()) // parse request data as json

var server = app.listen(8081, function() {
	var host = server.address().address
	var port = server.address().port
	console.log(`Server listening at http://${host}:${port}`)
})

// init socket.io
var io = new Server(server);

io.on('connection', (socket) => {
	console.log(`connected to ${socket.id}`)

	socket.onAny((eventName, args) => console.log(`recieved ${eventName}`))

	// send message
	socket.emit('message', `Hello client ${socket.id}`)

	// Room request recieved
	socket.on('requestRoom', message => 
	{
		// create the room, eventually we'll want to actually save this
		var newRoom = new Room();

		// log it out
		console.log(`Room request from ${socket.id}: created room ${newRoom.code}`);
		
		// and send back a responce
		socket.emit('sendRoom', newRoom.code);

	})

	socket.on('message', message => 
		console.log(`Message from ${socket.id}: ${message}`)
	)
})

function generateRoomCode(len) {
	const alphabet = "abcdefghijklmnopqrstuvwxyz"
  
	var code = "";

	for(var i = 0; i < len; i++) {
		code += alphabet[Math.floor(Math.random() * alphabet.length)];
	}
	return code
}

class Room {
	constructor()
	{
		this.code = generateRoomCode(4);
	}
}