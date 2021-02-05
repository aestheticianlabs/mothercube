import express from 'express';
import { Server } from 'socket.io';
import Rooms from './Rooms.js';
import Player from './Player.js';

// init web server
const app = express();
app.use(express.json()); // parse request data as json

// TODO: we should get the port from the environment rather than hard-code it -ntr
const server = app.listen(8081, () => {
	const host = server.address().address;
	const { port } = server.address();
	console.log(`Server listening at http://${host}:${port}`);
});

// init socket.io
const io = new Server(server);

// handle web requests
app.get('/room', (req, resp) => {
	// TODO: handle game type -ntr

	// create the room
	const room = Rooms.create();

	// log it out
	console.log(`Room request: created room ${room.id}`);

	// send the room
	resp.send(room);
});

io.on('connection', (socket) => {
	// TODO: get client name from query
	const { query } = socket.handshake;

	console.log(`connected to ${socket.id}`);

	if (Rooms.exists(query.room)) {
		// add player to room
		const room = Rooms.get(query.room);
		console.log(`Player ${query.name} is connecting to ${room.id}`);

		// join the room
		socket.join(room.id);
		const player = new Player(socket, query.name, room);
		room.addPlayer(player);

		// notify player joined
		io.to(room.id).emit('player_joined', player, room);
	}

	socket.onAny((eventName) => console.log(`recieved ${eventName}`));

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
});
