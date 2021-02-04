import Room from './Room.js';

const rooms = [];

function getNoRoomError(id) { return new Error(`No room with id ${id}`); }

function exists(id) {
	return typeof rooms[id] !== 'undefined';
}

function generateRoomCode(len) {
	const alphabet = 'abcdefghijklmnopqrstuvwxyz';

	// generate a unique code
	let code = '';
	do {
		for (let i = 0; i < len; i++) {
			code += alphabet[Math.floor(Math.random() * alphabet.length)];
		}
	} while (exists(code));

	// TODO: no naughty words :^) -ntr

	return code;
}

function create() {
	const id = generateRoomCode(4);
	const room = new Room(id);

	rooms[id] = room;
	return room;
}

function kill(id) {
	if (!exists(id)) throw getNoRoomError(id);

	delete rooms[id];
}

function get(id) {
	if (!exists(id)) throw getNoRoomError(id);

	return rooms[id];
}

export default {
	create,
	get,
	exists,
	kill,
};
