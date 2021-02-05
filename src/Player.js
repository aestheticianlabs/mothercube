export default class Player {
	constructor(socket, name, room) {
		this.socket = socket;
		this.name = name;
		this.room = room;
	}

	toJSON() {
		return {
			name: this.name,
			room: this.room.id,
		};
	}
}
