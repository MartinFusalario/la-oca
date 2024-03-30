$(document).ready(function () {
	let players = [];
	let winners = [];
	const board = {
		turn: 1,
	};

	$('#form-jugadores').submit(function (event) {
		event.preventDefault(); // Prevenir el envío del formulario por defecto para evitar recargar la página

		// Obtener el valor seleccionado por el usuario
		const qtyPlayers = $('#jugadores').val();

		// Aquí empezamos el juego con el número de jugadores seleccionado
		startGame(qtyPlayers);
	});

	// Función para iniciar el juego
	function startGame(qtyPlayers) {
		// Creamos a los jugadores y los añadimos al array de jugadores según la cantidad seleccionada
		for (let i = 0; i < qtyPlayers; i++) {
			let id = i + 1;
			players.push(new Player(id));
			$('#board').append($('<div>').attr('id', `player${id}`));
		}

		$('#form-jugadores, .select-players').hide();
		$('#board, .roll-dice-btn').show();
		$('#roll-dice').css('display', 'flex');
		$('#board-footer').css('display', 'flex');
		enableRollDice();

		// Creamos un elemento imagen y le asignamos la URL de la imagen del jugador 1 para el primer turno
		let imagen = $('<img>').attr('src', './img/player1.png');
		// Insertamos la imagen dentro del div con el id "player-turn"
		$('#player-turn').append(imagen);

		displayPlayers();
		console.log(players);
	}

	function displayPlayers() {
		for (let i = 0; i < players.length; i++) {
			$(`#player${i + 1}`).show();
		}
	}

	// Evento para lanzar el dado
	$('.roll-dice-btn').click(async function () {
		console.log('Girando Dado...');
		let dice = 1;
		const sfxDice = $('#sfx-roll-dice')[0];
		sfxDice.volume = 0.2;
		sfxDice.play();

		// Simulamos un tiempo de espera para simular el giro del dado
		$('#dice').show();
		$('#dice-img').attr('src', './img/dado.gif');
		disableRollDice();

		await new Promise(resolve => {
			setTimeout(() => {
				// Simulamos el lanzamiento del dado
				dice = players[board.turn - 1].rollDice();
				// Actualizamos la posición del jugador en el tablero
				updatePlayerPosition(board.turn - 1, dice);
				// Pasamos al siguiente jugador
				nextPlayer();
				resolve();
			}, 1000);
		});

		sfxDice.pause();
		sfxDice.currentTime = 0;

		// Mostramos el número del dado que ha salido
		$('#dice-img').attr('src', `./img/dado${dice}.png`);
		// Habilitamos el botón de lanzar dado
		enableRollDice();
	});

	// Función para habilitar el botón de lanzar dado
	function enableRollDice() {
		$('.roll-dice-btn-disabled').addClass('roll-dice-btn');
		$('.roll-dice-btn-disabled').removeClass('roll-dice-btn-disabled');
		$('.roll-dice-btn').prop('disabled', false);
	}

	// Función para deshabilitar el botón de lanzar dado
	function disableRollDice() {
		$('.roll-dice-btn').prop('disabled', true);
		$('.roll-dice-btn').addClass('roll-dice-btn-disabled');
		$('.roll-dice-btn').removeClass('roll-dice-btn');
	}

	// Función para actualizar la posición de los jugadores en el tablero
	function updatePlayerPosition(playerIndex, dice) {
		// Obtenemos el jugador actual
		const player = players[playerIndex];

		// Realizamos un bucle para mover al jugador tantas casillas como indique el dado, una casilla por iteración
		for (let i = 0; i < dice; i++) {
			// Obtenemos la posición actual del jugador en el tablero
			let posBoard = player.getBoardPosition();

			// Si el jugador ha llegado a la casilla 60, ha finalizado la partida
			if (posBoard >= 60) {
				return;
			}

			// Obtenemos las coordenadas de la siguiente casilla
			let posX = BOARD[posBoard].posX;
			let posY = BOARD[posBoard].posY;

			// Para que no se solapen los jugadores, movemos a los jugadores a la derecha de la casilla según su id
			switch (player.id) {
				case 1:
					posX += 0;
					break;
				case 2:
					posX += 5;
					break;
				case 3:
					posX += 8;
					break;
				case 4:
					posX += 10;
					break;
			}

			// Movemos al jugador a la siguiente casilla en el tablero
			$(`#player${playerIndex + 1}`).animate(
				{
					left: posX + 'px',
					bottom: posY + 'px',
				},
				400
			);
			// Actualizamos la posición del jugador en el tablero
			player.setBoardPosition(posBoard + 1);
		}

		console.log(players[board.turn - 1]);
	}

	// Función para pasar al siguiente jugador
	function nextPlayer() {
		if (board.turn === players.length) {
			board.turn = 1;
			changeTurnImage();
		} else {
			board.turn++;
			changeTurnImage();
		}

		// Comprobamos si todos los jugadores han terminado la partida
		if (checkEnd()) return;

		// Si el jugador actual ya ha terminado, pasamos al siguiente jugador de forma recursiva
		if (players[board.turn - 1].finish) {
			nextPlayer();
		}
	}

	// Función para cambiar la imagen del jugador al que le toca jugar
	function changeTurnImage() {
		$('#player-turn')
			.empty()
			.append($('<img>').attr('src', `./img/player${board.turn}.png`));
	}

	// Función para comprobar si todos los jugadores han terminado la partida e ir metiéndolos en el array de ganadores en orden según terminen
	function checkEnd() {
		let finishPlayers = 0;
		players.forEach(player => {
			if (player.finish) {
				finishPlayers++;
				if (!winners.includes(player)) {
					winners.push(player);
				}
			}
		});

		// Si todos los jugadores han terminado, mostramos el mensaje de fin de partida y el modal con los ganadores
		if (finishPlayers === players.length) {
			console.log('Todos los jugadores han terminado');

			$('#roll-dice').hide();
			$('#board-footer').hide();
			console.log(winners);
			$('#game-ended').css('display', 'flex');
			winners.forEach(winner => {
				const $img = $('<img>').attr(
					'src',
					`./img/player${winner.id}.png`
				);
				$('#winners').append($('<li>').text(`Posición: `).append($img));
			});
			return true;
		}
	}

	// Reiniciar la partida actual volviendo a seleccionar el número de jugadores
	$('.restart-game').click(function () {
		$(':animated').stop(true, true);
		$('#game-ended').hide();
		$('#board, #roll-dice, .roll-dice-btn').hide();
		$('#form-jugadores').show();
		$('#form-jugadores, .select-players').show();
		$('#player-turn').empty();
		$('#dice').hide();
		$('#board-footer').hide();
		players.forEach(player => {
			$(`#player${player.id}`).removeAttr('style').removeClass().hide();
		});

		$('#winners').empty();

		board.turn = 1;
		players = [];
		winners = [];

		console.log(players);
	});

	// Reiniciar la partida actual sin volver a seleccionar el número de jugadores
	$('.restart-actual-game').click(function () {
		$(':animated').stop(true, true);
		$('#game-ended').hide();
		$('#board, #roll-dice, .roll-dice-btn').show();
		$('#roll-dice').css('display', 'flex');
		$('#board-footer').css('display', 'flex');
		$('#dice').hide();
		$('#player-turn').empty();

		resetPosition();

		$('#winners').empty();

		board.turn = 1;
		changeTurnImage();
		winners = [];

		console.log(players);
	});

	// Función para reiniciar la posición de los jugadores en el tablero
	function resetPosition() {
		players.forEach(player => {
			player.resetPosition();
			$(`#player${player.id}`).removeAttr('style').show();
			player.finish = false;
		});
	}

	// Al finalizar el sonido de lanzar el dado, paramos el audio y lo reiniciamos
	$('#sfx-roll-dice').on('ended', function () {
		$('#sfx-roll-dice').trigger('pause');
		$('#sfx-roll-dice').prop('currentTime', 0);
	});

	// Easter Egg de la Oca Bailona al hacer click en la imagen
	$('#oca-bailona').click(function () {
		$('#sfx-goose-dancing')[0].play();
	});

	// Al finalizar la canción de la Oca Bailona, paramos el audio y lo reiniciamos
	$('#oca-bailona').on('ended', function () {
		$('#sfx-goose-dancing').trigger('pause');
		$('#sfx-goose-dancing').prop('currentTime', 0);
	});
});
