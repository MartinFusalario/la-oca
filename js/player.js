class Player {
	constructor(name) {
		this.id = name;
		this.boardPosition = 1;
		this.finish = false;
	}
	rollDice() {
		// Si el jugador ha finalizado la partida, no puede lanzar el dado
		if (this.finish) {
			return;
		}
		// Generamos un número aleatorio entre 1 y 6
		const dice = Math.floor(Math.random() * 6) + 1;
		console.log(`El jugador ${this.id} ha sacado un ${dice}`);
		// Devolvemos el número del dado
		return dice;
	}
	setBoardPosition(position) {
		this.boardPosition = position;
		// Si el jugador ha llegado a la casilla 60, ha finalizado la partida
		if (this.boardPosition >= 60) {
			this.setFinish();
			this.boardPosition = 60;
			console.log(`El jugador ${this.id} ha finalizado la partida`);
			return;
		}
	}
	resetPosition() {
		this.boardPosition = 1;
	}
	getBoardPosition() {
		return this.boardPosition;
	}
	setFinish() {
		this.finish = true;
	}
}
