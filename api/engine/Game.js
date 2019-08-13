var User = require('./User.js');
var Deck = require('./Deck.js');

class Game {
	constructor(deckCount) {
		this.deck = new Deck(deckCount);
		this.users = [];
		this.dealer = new User('Dealer', -1);
		this.currentPlayer = 0;
		// this.currentPhase = '';
		// this.firstCardDealt = false;
		// this.currentUserId = -1;
		// this.secondsPassed = 0;
	}

	addNewUser(info, id) {
		var user = new User(info.username, id);
		user.money = info.money;
		this.users.push(user);
		// console.log('newuser', user);
		
	}

}

module.exports = Game;