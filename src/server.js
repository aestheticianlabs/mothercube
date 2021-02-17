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
	const { query } = socket.handshake;

	console.log(`connected to ${socket.id}`);

	if (Rooms.exists(query.room)) {
		// get room
		const room = Rooms.get(query.room);

		let success = false;

		// join the room
		socket.join(room.id);

		// host connection
		if (query.kind && query.kind === 'host') {
			// add host to room
			console.log(`Host is connecting to ${room.id}`);
			room.host = socket;
			success = true;
		} else {
			// add player to room
			console.log(`Player ${query.name} is connecting to ${room.id}`);

			const player = new Player(socket, query.name, room);
			success = room.addPlayer(player);

			// notify player joined
			if (success) io.to(room.id).emit('player_joined', player, room);
		}

		// tell the client they joined the room
		if (success) socket.emit('room_joined', room);
	}

	socket.on('message', (message) => {
		if (!message.to.kind) {
			throw new Error('Missing message.to.kind');
		}
		if (!message.room) {
			throw new Error('Missing message.room');
		}
		const room = Rooms.get(message.room);

		switch (message.to.kind) {
			// sending message to room host
			case 'host':
				room.host.emit('message', message);
				break;
			// sending message to specific player
			case 'player':
				room.getPlayer(message.to.name).socket.emit('message', message);
				break;
			// sending message to all players
			case 'everyone':
				socket.to(room.id).emit('message', message);
				break;
			default: throw new Error(`Unexpected message kind: ${message.to.kind}`);
		}
	});

	socket.onAny((eventName) => console.log(`recieved ${eventName}`));
});
