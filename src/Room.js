export default class Room {
	constructor(id) {
		this.id = id;
		this.players = {};
		this.playerCount = 0;
	}

	addPlayer(player) {
		if (this.players[player.name]) {
			throw new Error(`Players already contains player ${player.name}`);
		}

		this.players[player.name] = player;
		++this.playerCount;
	}

	getPlayer(name) {
		if (!this.players[name]) {
			throw new Error(`Player ${name} does not exist`);
		}

		return this.players[name];
	}

	toJSON() {
		return {
			id: this.id,
			playerCount: this.playerCount,
			players: this.players,
		};
	}
}
