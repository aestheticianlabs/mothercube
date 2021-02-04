export default class Room {
	constructor(id) {
		this.id = id;
		this.players = [];
	}

	addPlayer(player) {
		if (this.players.includes(player)) {
			throw new Error(`Players already contains player ${player.name}`);
		}

		this.players.push(player);
	}
}
