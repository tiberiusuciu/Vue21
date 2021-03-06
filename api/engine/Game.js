var User = require('./User.js');
var Deck = require('./Deck.js');

class Game {
	constructor(deckCount, io) {
		this.deck = new Deck(deckCount);
		this.users = [];
		this.dealer = new User('Dealer', -1);
		this.currentPlayer = -1;
		this.currentPhase = 'waitingbet';
		this.timer = null;
		this.io = io;
		// this.currentUserId = -1;
		// this.secondsPassed = 0;
	}

	addNewUser(info, id, socketid) {
		var user = new User(info.username, id, socketid);
		user.money = 100;
		this.users.push(user);
	}

	playerBet(amount, id) {
		var playerId = this.locatePlayer(id);
		if (playerId >= 0) {
			this.users[playerId].bet(amount);
		}
	}

	locatePlayer(id) {
		for (var i = 0; i < this.users.length; i++) {
			if (this.users[i].id === id) {
				return i;
			}
		}
		return -1;
	}

	dealCards(io) {
		var secondDeal = false;
		var currentPlayer = 0;
		var done = false;
		var interval = setInterval(() => {
			if (!done && currentPlayer < this.users.length) {
				if (this.users[currentPlayer].hasbet) {
					this.users[currentPlayer].dealCards(this.deck.draw());
					io.emit('users', this.users);
				}
				do {
					currentPlayer++;
				} while (this.users[currentPlayer] && !this.users[currentPlayer].hasbet);
			}
			else if (!done && currentPlayer >= this.users.length && !secondDeal) {
				// dealing for the dealer
				if (this.dealer.hands.length == 0) {
					this.dealer.hands[0] = {
						cards: [],
						currentValue: 0,
						hasPlayed: false,
						hasHit: false,
						hasBust: false,
						hasDoubled: false,
						hasBlackJack: false,
						instantLose: false
					}
				}
				this.dealer.dealCards(this.deck.draw());
				io.emit('dealer', this.dealer);
				// emit for all about the dealer
				secondDeal = true;
				currentPlayer = 0;
			}
			else {
				this.dealer.dealCards(this.deck.draw());
				io.emit('dealer', this.dealer);
				// emit for all about the dealer
				clearInterval(interval);

				// House has blackjack
				if (this.dealer.hands[0].currentValue == 21 && (this.dealer.hands[0].cards[0].charAt(0) === '1' || this.dealer.hands[0].cards[0].charAt(0) === 'J' || this.dealer.hands[0].cards[0].charAt(0) === 'Q' || this.dealer.hands[0].cards[0].charAt(0) === 'K')) {
					this.currentPhase = 'revealCard';
					io.emit('gamephasechange', 'revealCard');
					setTimeout(() => {
						this.dealerPlay(io);
					}, 500)
				}
				else {
					if (this.dealer.hands[0].cards[0].charAt(0) === 'A') {
						// house has a hand with an ace revealed
					
						io.emit('startUserTimeout', 15000);
						// ask for insurances
						io.emit('askInsurance', true)
						setTimeout(() => {

							io.emit('askInsurance', false)

							// removing money from player if said yes to insurance
							for (var i = 0; i < this.users.length; i++) {
								var player = this.users[i];
								if (player.hasbet && player.insuranceAnswer && !player.hands[0].hasBlackJack) {
									player.money -= player.hands[0].currentBet / 2;
								}
							}

							if (this.dealer.hands[0].hasBlackJack) {
								this.currentPhase = 'revealCard';
								io.emit('gamephasechange', 'revealCard');
								setTimeout(() => {
									this.dealerPlay(io);
								}, 500)

							}
							else {
								var startTimer = true;
								var nextPlayer = this.findNextPlayer();

								if (nextPlayer < 0) {
									this.currentPhase = 'revealCard';
									io.emit('gamephasechange', 'revealCard');
									startTimer = false;
									setTimeout(() => {
										this.dealerPlay(io);
									}, 500)
								}
								
								if (startTimer) {
									this.currentPhase = 'userplay';
									io.emit('gamephasechange', 'userplay');
									io.emit('startUserTimeout', 15000);
									io.emit('assignNextPlayer', this.findNextPlayer());
	
									this.timeoutManagement();
								}
						
								io.emit('users', this.users);
							}
						}, 15000)
						
					}
					else {
						var startTimer = true;
						var nextPlayer = this.findNextPlayer();

						if (nextPlayer < 0) {
							this.currentPhase = 'revealCard';
							io.emit('gamephasechange', 'revealCard');
							startTimer = false;
							setTimeout(() => {
								this.dealerPlay(io);
							}, 500)
						}
						
						if (startTimer) {
							this.currentPhase = 'userplay';
							io.emit('gamephasechange', 'userplay');
							io.emit('startUserTimeout', 15000);
							io.emit('assignNextPlayer', this.findNextPlayer());

							this.timeoutManagement();
						}
				
						io.emit('users', this.users);
					}
				}

				// notify that player ones needs to play
			}
		}, 500);
	}

	timeoutManagement() {
		console.log('SETTING UP NEW TIMER');
		if (this.timer !== null) {
			clearTimeout(this.timer);
			this.timer = null;
		}
		this.timer = setTimeout(() => {
			var player = this.users[this.currentPlayer];
			if (player !== undefined) {
				this.playerHold(player.id, this.io)
			}
		}, 16000)
	}

	clearTimer() {
		console.log('TIMER CLEARED');
		if (this.timer) {
			clearTimeout(this.timer);
			this.timer = null;
		}
	}

	findNextPlayer() {
		for (var i = 0; i < this.users.length; i++) {
			if (this.users[i].hasbet) {
				if (!this.users[i].hands[this.users[i].currentHand].hasPlayed && !this.users[i].toDelete && !this.users[i].hands[this.users[i].currentHand].hasBlackJack) {
					this.currentPlayer = i;
					return i;
				}
			}
		}
		return -1;
	}

	moveToNextHandOrPlayer(playerID, io) {
		io.emit('freezegame', true);
		this.clearTimer();
		// adding a little bit of delay so that other plays can see what the current player had
		setTimeout(() => {
			var startTimer = true;
			var player = this.users[this.locatePlayer(playerID)];
			
			if (player.currentHand + 1 >= player.hands.length) {
				var nextPlayer = this.findNextPlayer();
				if (nextPlayer >= 0) {
					io.emit('assignNextPlayer', this.findNextPlayer());
				}
				else {
					this.currentPhase = 'revealCard';
					io.emit('gamephasechange', 'revealCard');
					startTimer = false;
					setTimeout(() => {
						this.dealerPlay(io);
					}, 500)
				}
			}
			else {
				player.currentHand++;
				io.emit('users', this.users);
			}
			
			if (startTimer) {			
				io.emit('startUserTimeout', 15000);
				this.timeoutManagement();
			}
			io.emit('freezegame', false);
			io.emit('users', this.users);
		}, 1000);
	}

	playerHit(playerID, io) {
		this.clearTimer();

		var player = this.users[this.locatePlayer(playerID)];
		
		player.dealCards(this.deck.draw());
		player.hands[player.currentHand].hasHit = true;
		player.hands[player.currentHand].hasPlayed = true;

		io.emit('users', this.users);
		
		if (player.hands[player.currentHand].hasBust || player.hands[player.currentHand].currentValue === 21) {			
			this.moveToNextHandOrPlayer(playerID, io);
		}
		else {
			io.emit('startUserTimeout', 15000);
			this.timeoutManagement();
		}
		io.emit('users', this.users);
	}

	playerDouble(playerID, io) {
		this.clearTimer();

		var player = this.users[this.locatePlayer(playerID)];
		
		// Doubling logic
		var bettingAmount = player.hands[player.currentHand].currentBet;

		player.money -= bettingAmount;
		player.hands[player.currentHand].currentBet += bettingAmount;

		player.dealCards(this.deck.draw());
		player.hands[player.currentHand].hasPlayed = true;
		player.hands[player.currentHand].hasDoubled = true;

		io.emit('users', this.users);

		// Going directly to next player or hand
		this.moveToNextHandOrPlayer(playerID, io);
	}

	playerHold(playerID, io) {
		this.clearTimer();
		var player = this.users[this.locatePlayer(playerID)];
		
		player.hands[player.currentHand].hasPlayed = true;
		player.hands[player.currentHand].hasHold = true;
		io.emit('users', this.users);

		// Going directly to next player or hand
		this.moveToNextHandOrPlayer(playerID, io);
	}

	playerSplit(playerID, io) {
		this.clearTimer();
		// locate the player
		var player = this.users[this.locatePlayer(playerID)];
		var currentHand = player.currentHand;

		// create a new hand
		player.money -= player.hands[currentHand].currentBet;

		var firstCard = player.hands[currentHand].cards[0];
		var secondCard = player.hands[currentHand].cards[1];
		player.hands[currentHand].cards = [];

		// player.hands.push({
		// 	currentBet: player.hands[currentHand].currentBet,
		// 	cards: [],
		// 	currentValue: 0,
		// 	hasPlayed: false,
		// 	hasHit: false,
		// 	hasBust: false,
		// 	hasHold: false,
		// 	hasDoubled: false,
		// 	hasBlackJack: false,
		// 	instantLose: false,
		// });

		player.hands.splice(currentHand, 0, {
			currentBet: player.hands[currentHand].currentBet,
			cards: [],
			currentValue: 0,
			hasPlayed: false,
			hasHit: false,
			hasBust: false,
			hasHold: false,
			hasDoubled: false,
			hasBlackJack: false,
			instantLose: false,
		});

		// insert second card of first hand in second hand

		player.hands[currentHand].cards[0] = firstCard;
		player.hands[currentHand + 1].cards[0] = secondCard;

		io.emit('users', this.users);
		
		setTimeout(() => {
			player.dealCards(this.deck.draw());
			io.emit('users', this.users);
			setTimeout(() => {
				player.currentHand = player.currentHand + 1;
				player.dealCards(this.deck.draw());
				io.emit('users', this.users);
				// return new setup to all users and notify
				// start timer
				setTimeout(() => {
					player.currentHand = currentHand;
					io.emit('users', this.users);
					io.emit('startUserTimeout', 15000);
					this.timeoutManagement();
				}, 500)
			}, 500)
		}, 500);
	}

	userAnswer(playerID, answer) {
		// locate the player
		var player = this.users[this.locatePlayer(playerID)];
		// asign answer
		if (player !== undefined) {
			player.insuranceAnswer = answer;
		}
	}

	dealerPlay(io) {
		this.currentPlayer = -1;
		io.emit('assignNextPlayer', this.currentPlayer);

		var interval = setInterval(() => {
			// check for soft 17?
			if (this.dealer.hands[0].currentValue < 17) {
				this.dealer.dealCards(this.deck.draw());
				io.emit('dealer', this.dealer);
			}
			else {
				this.currentPhase = 'giveRewards';
				io.emit('gamephasechange', 'giveRewards');

				// timeout?

				if (this.dealer.hands[0].hasBlackJack && this.dealer.hands[0].cards[0].charAt(0) === 'A') {
					// check all players
					// assign money
					for (var i = 0; i < this.users.length; i++) {
						if (this.users[i].insuranceAnswer && !this.users[i].hands[0].hasBlackJack && this.users[i].hasbet) {
							this.users[i].money += this.users[i].hands[0].currentBet;
						}
						else if (this.users[i].insuranceAnswer && this.users[i].hands[0].hasBlackJack && this.users[i].hasbet) {
							this.users[i].money += this.users[i].hands[0].currentBet;
						}
					}
				}
				else {
					for (var i = 0; i < this.users.length; i++) {
						if (this.users[i].hasbet) {
							var player = this.users[i];
							var cashStack = 0;
							for (var j = 0; j < player.hands.length; j++) {
								if (
									player.hands[j].currentValue <= 21 &&
									!player.hands[j].hasBlackJack &&
									(player.hands[j].currentValue > this.dealer.hands[0].currentValue || this.dealer.hands[0].hasBust)) {
									cashStack += player.hands[j].currentBet * 2
								}
								else if (player.hands[j].currentValue == this.dealer.hands[0].currentValue && !player.hands[j].hasBlackJack) {
									cashStack += player.hands[j].currentBet;
								}
								else if (this.dealer.hands[0].hasBlackJack) {
									if (player.hands[j].hasBlackJack && !player.insuranceAnswer) {
										cashStack += player.hands[j].currentBet * 2;
									}
									else if (player.hands[j].hasBlackJack && player.insuranceAnswer) {
										cashStack += player.hands[j].currentBet * 2.5;
									}
								}
								else if (player.hands[j].hasBlackJack) {
									cashStack += player.hands[j].currentBet * 2.5;
								}

							}
							player.money += cashStack;
						}
					}
				}


				io.emit('users', this.users);

				setTimeout(() => {
					this.cleanupBoard();
					this.currentPhase = 'waitingbet';
					io.emit('gamephasechange', 'waitingbet');
					io.emit('users', this.users);
					io.emit('dealer', this.dealer);
				}, 5000)
				clearInterval(interval);
			}
		}, 750)
	}

	cleanupBoard() {
		this.clearTimer();
		for (var i = 0; i < this.users.length; i++) {
			this.users[i].hands = [];
			this.users[i].currentHand = 0;
			this.users[i].hasbet = false;
			this.users[i].hasPlayed = false;
			this.users[i].insuranceAnswer = false;
			if (this.users[i].toDelete) {
				console.log('deleting id', this.users[i].id);
				
				this.users.splice(i, 1);
				i--;
			}
		}
		this.dealer.hands = [];
		this.dealer.currentHand = 0;
		this.dealer.hasbet = false;
		this.currentPlayer = -1;

	}

	removePlayer(io, socketid) {
		// console.log('these are the users', this.users);
		
		var player;
		
		for (var i = 0; i < this.users.length; i++) {
			if (this.users[i].socketid === socketid) {
				player = this.users[i];
				break;
			}
		}
		console.log('this is who I need to remove', player);
		
		if (player) {
			// console.log('REMOVING SOMEBODY, here is current list', this.users);
			player.hasPlayed = true;
			player.toDelete = true;

			if (this.users[this.currentPlayer] !== undefined) {
				// check if this player was current player
				if (this.users[this.currentPlayer].id === player.id) {
					this.clearTimer();
					// remove timer
					var startTimer = true;
					console.log('lets look for the next guy');
					
					// Going directly to next player or hand
					var nextPlayer = this.findNextPlayer();
					if (nextPlayer >= 0) {
						console.log('found one!, assigning!');
						
						this.currentPlayer = nextPlayer;
	
						io.emit('assignNextPlayer', nextPlayer);
					}
					else {
						console.log('found no one, switching to dealer');
						
						this.currentPhase = 'revealCard';
						io.emit('gamephasechange', 'revealCard');
						startTimer = false;
						setTimeout(() => {
							this.dealerPlay(io);
						}, 500)
					}
					
					if (startTimer) {
						console.log('lets restart the timer');
						this.timeoutManagement();
						io.emit('startUserTimeout', 15000);
					}
		
					// move to the next player
				}
			}
	
			console.log('DONE, here is the new list', this.users);
			
			io.emit('users', this.users);
		}
	}

	playAgain(playerID) {
		var player = this.users[this.locatePlayer(playerID)];
		if (player) {
			player.money = 100;
		}
	}
}

module.exports = Game;