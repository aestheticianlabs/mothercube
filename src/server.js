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

	socket.on('message', message => 
		console.log(`Message from ${socket.id}: ${message}`)
	)
})