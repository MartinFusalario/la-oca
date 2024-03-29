class Player {
	constructor(name) {
		this.id = name;
		this.boardPosition = 1;
		this.finish = false;
	}
	move() {
		if (this.finish) {
			console.log(`El jugador ${this.id} ya ha finalizado la partida`);
			return;
		}
		const dice = this.rollDice();
		console.log(`El jugador ${this.id} ha sacado un ${dice}`);
		this.setBoardPosition(dice);
		return dice;
	}
	rollDice() {
		return Math.floor(Math.random() * 6) + 1;
	}
	setBoardPosition(dice) {
		if (this.boardPosition + dice >= 60) {
			this.setFinish();
			this.boardPosition = 60;
			return;
		}
		this.boardPosition += dice;
	}
	resetPosition() {
		this.boardPosition = 0;
	}
	getBoardPosition() {
		return this.boardPosition;
	}
	getId() {
		return this.id;
	}
	setFinish() {
		this.finish = true;
	}
}
