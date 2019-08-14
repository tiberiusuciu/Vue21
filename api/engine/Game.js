var User = require('./User.js');
var Deck = require('./Deck.js');

class Game {
	constructor(deckCount) {
		this.deck = new Deck(deckCount);
		this.users = [];
		this.dealer = new User('Dealer', -1);
		this.currentPlayer = 0;
		this.currentPhase = 'waitingbet';
		// this.currentUserId = -1;
		// this.secondsPassed = 0;
	}

	addNewUser(info, id) {
		var user = new User(info.username, id);
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
				currentPlayer++;
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

				io.emit('gamephasechange', 'userplay');
				io.emit('assignNextPlayer', this.findNextPlayer());
				// notify that player ones needs to play
			}
		}, 500);
	}

	findNextPlayer() {
		for (var i = 0; i < this.users.length; i++) {
			if (this.users[i].hasbet) {
				if (!this.users[i].hands[this.users[i].currentHand].hasPlayed) {
					this.currentPlayer = i;
					return i;
				}
			}
		}
		return -1;
	}

	playerHit(playerID, io) {
		var player = this.users[this.locatePlayer(playerID)];
		
		player.dealCards(this.deck.draw());
		player.hands[player.currentHand].hasHit = true;
		player.hands[player.currentHand].hasPlayed = true;

		if (player.hands[player.currentHand].hasBust) {
			if (player.currentHand + 1 >= player.hands.length) {
				var nextPlayer = this.findNextPlayer();
				if (nextPlayer >= 0) {
					io.emit('assignNextPlayer', this.findNextPlayer());
				}
				else {
					io.emit('gamephasechange', 'revealCard');
					setTimeout(() => {
						this.dealerPlay(io);
					}, 500)
				}
			}
			else {
				player.currentHand++;
				io.emit('users', this.users);
			}
			
		}

		io.emit('users', this.users);
	}

	playerDouble(playerID, io) {
		var player = this.users[this.locatePlayer(playerID)];
		
		// Doubling logic
		var bettingAmount = player.hands[player.currentHand].currentBet;

		player.money -= bettingAmount;
		player.hands[player.currentHand].currentBet += bettingAmount;

		player.dealCards(this.deck.draw());
		player.hands[player.currentHand].hasPlayed = true;
		player.hands[player.currentHand].hasDoubled = true;

		// Going directly to next player or hand

		if (player.currentHand + 1 >= player.hands.length) {
			var nextPlayer = this.findNextPlayer();
			if (nextPlayer >= 0) {
				io.emit('assignNextPlayer', this.findNextPlayer());
			}
			else {
				io.emit('gamephasechange', 'revealCard');
				setTimeout(() => {
					this.dealerPlay(io);
				}, 500)
			}
		}
		else {
			player.currentHand++;
			io.emit('users', this.users);
		}
			
		io.emit('users', this.users);
	}

	playerHold(playerID, io) {
		var player = this.users[this.locatePlayer(playerID)];
		
		player.hands[player.currentHand].hasPlayed = true;

		// Going directly to next player or hand

		if (player.currentHand + 1 >= player.hands.length) {
			var nextPlayer = this.findNextPlayer();
			if (nextPlayer >= 0) {
				io.emit('assignNextPlayer', this.findNextPlayer());
			}
			else {
				io.emit('gamephasechange', 'revealCard');
				setTimeout(() => {
					this.dealerPlay(io);
				}, 500)
			}
		}
		else {
			player.currentHand++;
			io.emit('users', this.users);
		}
			
		io.emit('users', this.users);
	}

	dealerPlay(io) {
		var interval = setInterval(() => {
			// check for soft 17?
			if (this.dealer.hands[0].currentValue < 17) {
				this.dealer.dealCards(this.deck.draw());
				io.emit('dealer', this.dealer);
			}
			else {
				io.emit('gamephasechange', 'giveRewards');

				// give money to users
					// loop through all player
				for (var i = 0; i < this.users.length; i++) {
					if (this.users[i].hasbet) {
						var player = this.users[i];
						var cashStack = 0;
						// loop through their hands
						for (var j = 0; j < player.hands.length; j++) {
							if (player.hands[j].currentValue <= 21 && (player.hands[j].currentValue > this.dealer.hands[0].currentValue || this.dealer.hands[0].hasBust)) {
								console.log('normal handout');
								
								cashStack += player.hands[j].currentBet * 2
							}
							if (player.hands[j].currentValue == this.dealer.hands[0].currentValue) {
								console.log('its a tie');
								cashStack += player.hands[j].currentBet;
							}
							if (player.hands[j].hasBlackJack && !this.dealer.hands[0].hasBlackJack) {
								console.log('blackjack!');
								cashStack += player.hands[j].currentBet * 2.5;
							}

						}

						player.money += cashStack;
					}
				}


				// notify users
				io.emit('users', this.users);

				setTimeout(() => {
					// cleanup players and dealer
					this.cleanupBoard();
					io.emit('gamephasechange', 'waitingbet');
					io.emit('users', this.users);
					io.emit('dealer', this.dealer);
				}, 5000)
				clearInterval(interval);
			}
		}, 750)
	}

	cleanupBoard() {
		for (var i = 0; i < this.users.length; i++) {
			this.users[i].hands = [];
			this.users[i].currentHand = 0;
			this.users[i].hasbet = false;
		}
		this.dealer.hands = [];
		this.dealer.currentHand = 0;
		this.dealer.hasbet = false;
	}

}

module.exports = Game;