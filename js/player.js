class Player {
	constructor(name) {
		this.id = name;
		this.boardPosition = 1;
		this.finish = false;
	}
	rollDice() {
		if (this.finish) {
			return;
		}
		const dice = Math.floor(Math.random() * 6) + 1;
		console.log(`El jugador ${this.id} ha sacado un ${dice}`);
		return dice;
	}
	setBoardPosition(position) {
		this.boardPosition = position;
		if (this.boardPosition >= 60) {
			this.setFinish();
			this.boardPosition = 60;
			console.log(`El jugador ${this.id} ha finalizado la partida`);
			return;
		}
	}
	resetPosition() {
		this.boardPosition = 0;
	}
	getBoardPosition() {
		return this.boardPosition;
	}
	setFinish() {
		this.finish = true;
	}
}
