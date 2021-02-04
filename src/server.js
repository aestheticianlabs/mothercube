import express from 'express'
import { Server } from 'socket.io'

// init web server
var app = express()
// app.use(express.json()) // parse request data as json

// TODO: we should get the port from the environment rather than hard-code it -ntr
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
	// TODO: remove debug -ntr
	socket.emit('message', `Hello client ${socket.id}`)

	// Room request recieved
	socket.on('requestRoom', message => 
	{
		 /* TODO: handle room requests via web requests instead of socket.io?
		  * This saves us from connecting to the socket.io server until we have
		  * a room to join (saves server resources).
		  * 
		  * The flow could look something like this:
		  * 
		  * host: GET http://game.server/room?game=quiplash
		  * server: { "room": { "id" : "ABCD", "game" : "quiplash" }}
		  * client(s): socket.io connect http://game.server/?room=ABCD&name=Jill
		  * server: *connect client to room from query and associate connection ID with name*
		  * 
		  * See detail on connection with query parameters: 
		  * https://socket.io/docs/v3/client-api/index.html
		  * 
		  * -ntr
		  */

		/* TODO: do we want to use socket.io rooms here?
		 * https://socket.io/docs/v3/rooms/
		 *
		 * We'll probably still need to tell the client what room they're in
		 * because socket.io rooms are server-side only.
		 * 
		 * Could we store a UID for the client and keep track of what room the
		 * client is in on the server side?
		 * 
		 * -ntr
		 */

		// create the room, eventually we'll want to actually save this
		var newRoom = new Room();

		// log it out
		console.log(`Room request from ${socket.id}: created room ${newRoom.code}`);
		
		// and send back a responce
		socket.emit('sendRoom', newRoom.code);

	})

	// TODO: remove debug -ntr
	socket.on('message', message => 
		console.log(`Message from ${socket.id}: ${message}`)
	)
})

// TODO: could be a static function on Room -ntr
function generateRoomCode(len) {
	const alphabet = "abcdefghijklmnopqrstuvwxyz"
  
	var code = ""

	for(var i = 0; i < len; i++) {
		code += alphabet[Math.floor(Math.random() * alphabet.length)];
	}

	// TODO: verify unique room code -ntr
	// TODO: no naughty words :^) -ntr

	return code
}

// TODO: move to Room.js -ntr
class Room {
	constructor()
	{
		this.code = generateRoomCode(4);
	}
}