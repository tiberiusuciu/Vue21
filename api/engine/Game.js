var User = require('./User.js');
var Deck = require('./Deck.js');

class Game {
	constructor(deckCount) {
		this.deck = new Deck(deckCount);
		this.users = [];
		this.dealer = new User('Dealer', -1);
		this.currentPlayer = 0;
		this.currentPhase = 'waitingbet';
		// this.currentPhase = '';
		// this.firstCardDealt = false;
		// this.currentUserId = -1;
		// this.secondsPassed = 0;
	}

	addNewUser(info, id) {
		var user = new User(info.username, id);
		user.money = info.money;
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
				this.users[currentPlayer].dealCards(this.deck.draw());
				io.emit('users', this.users);
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
				// notify that player ones needs to play
			}
		}, 500);
	}

}

module.exports = Game;