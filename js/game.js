$(document).ready(function () {
	let players = [];
	let winners = [];
	const board = {
		turn: 1,
	};

	$('#form-jugadores').submit(function (event) {
		event.preventDefault(); // Prevenir el envío del formulario por defecto

		// Obtener el valor seleccionado por el usuario
		const qtyPlayers = $('#jugadores').val();

		// Aquí empezamos el juego con el número de jugadores seleccionado
		startGame(qtyPlayers);
	});

	function startGame(qtyPlayers) {
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
				dice = players[board.turn - 1].move();
				console.log('Dado:', dice);
				updatePlayerPosition(board.turn - 1);
				nextPlayer();
				resolve();
			}, 1000);
		});

		sfxDice.pause();
		sfxDice.currentTime = 0;

		$('#dice-img').attr('src', `./img/dado${dice}.png`);
		enableRollDice();
	});

	function enableRollDice() {
		$('.roll-dice-btn-disabled').addClass('roll-dice-btn');
		$('.roll-dice-btn-disabled').removeClass('roll-dice-btn-disabled');
		$('.roll-dice-btn').prop('disabled', false);
	}

	function disableRollDice() {
		$('.roll-dice-btn').prop('disabled', true);
		$('.roll-dice-btn').addClass('roll-dice-btn-disabled');
		$('.roll-dice-btn').removeClass('roll-dice-btn');
	}

	function updatePlayerPosition(playerIndex) {
		const player = players[playerIndex];
		const posBoard = player.getBoardPosition();

		let posX = BOARD[posBoard - 1].posX;
		let posY = BOARD[posBoard - 1].posY;

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

		$(`#player${playerIndex + 1}`).animate(
			{
				left: posX + 'px',
				bottom: posY + 'px',
			},
			500
		); // 500 milisegundos de duración de la animación
	}

	function nextPlayer() {
		if (board.turn === players.length) {
			board.turn = 1;
			changeTurnImage();
		} else {
			board.turn++;
			console.log('Turno del jugador', board.turn);
			changeTurnImage();
		}

		if (checkEnd()) return;

		// Si el jugador actual ya ha terminado, pasamos al siguiente jugador de forma recursiva
		if (players[board.turn - 1].finish) {
			nextPlayer();
		}
	}

	function changeTurnImage() {
		$('#player-turn')
			.empty()
			.append($('<img>').attr('src', `./img/player${board.turn}.png`));
	}

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

	$('#sfx-roll-dice').on('ended', function () {
		$('#sfx-roll-dice').trigger('pause');
		$('#sfx-roll-dice').prop('currentTime', 0);
	});

	$('#oca-bailona').click(function () {
		$('#sfx-goose-dancing')[0].play();
	});

	$('#oca-bailona').on('ended', function () {
		$('#sfx-goose-dancing').trigger('pause');
		$('#sfx-goose-dancing').prop('currentTime', 0);
	});
});
