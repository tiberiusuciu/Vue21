var User = require('./User.js');
var Deck = require('./Deck.js');

function Game() {
	this.deck = new Deck(8);
	this.users = [];
	this.dealer = new User('Dealer', -1);
	this.currentPlayer = 0;

	// this.currentPhase = '';
	// this.firstCardDealt = false;
	// this.currentUserId = -1;
	// this.secondsPassed = 0;
}

module.exports = Game;