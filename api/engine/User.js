class User {
	constructor(username, id, socketid) {
		this.id = id;
		this.username = username;
		this.money = 0;
		this.currentHand = 0;
		this.hands = [];
		this.hasbet = false;
		this.insuranceAnswer = false;
		this.socketid = socketid;
		this.toDelete = false;
	}

	dealCards(newCard) {
		this.hands[this.currentHand].cards.push(newCard);
		this.hands[this.currentHand].currentValue = this.evaluateCards();

		if (this.hands[this.currentHand].currentValue > 21) {
			this.hands[this.currentHand].hasBust = true;
		}
		else if (this.hands[this.currentHand].currentValue == 21 && this.hands[this.currentHand].cards.length == 2) {
			this.hands[this.currentHand].hasBlackJack = true;
			var firstcardValue = this.hands[this.currentHand].cards[0].charAt(0);
			if (firstcardValue === '1' || firstcardValue === 'J' || firstcardValue === 'Q' || firstcardValue === 'K') {
				this.hands[this.currentHand].instantLose = true;
			}
		}
	};

	evaluateCards() {
		var tmp = 0;
		this.hands[this.currentHand].cards.forEach(function(card) {
			if (card.charAt(0) == 'J' || card.charAt(0) == 'Q' || card.charAt(0) == 'K' || card.charAt(0) == '1') {
				tmp += 10;
			}
			else if (card.charAt(0) != 'A') {
				tmp += parseInt(card.charAt(0));
			}
		});

		// Aces are wild cards, they should be calculated at the end
		this.hands[this.currentHand].cards.forEach(function(card) {
			if (card.charAt(0) == 'A') {
				if (tmp + 11 > 21) {
					tmp += 1;
				}
				else {
					tmp += 11
				}
			}
		});
		return tmp;
	};

	bet(money) {
		this.money -= parseInt(money);
		this.hasbet = true;
		this.hands.push({
			currentBet: money,
			cards: [],
			currentValue: 0,
			hasPlayed: false,
			hasHit: false,
			hasBust: false,
			hasDoubled: false,
			hasBlackJack: false,
			instantLose: false,
		});
	};
}

module.exports = User;