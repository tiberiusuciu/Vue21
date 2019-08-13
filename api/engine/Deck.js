class Deck {
    constructor (deckSize) {
      this.cards = this.randomize(this.generateDeck(deckSize));
    }

    randomize(array) {
      for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
      }
      return array;
    }

    makeSuitCard(suit) {
      var temp = [];
      for (var i = 0; i < 13; i++) {
        if (i == 0) {
          temp[i] = 'A' + suit;
        }
        else if (i == 10) {
          temp[i] = 'J' + suit;
        }
        else if (i == 11) {
          temp[i] = 'Q' + suit;
        }
        else if (i == 12) {
          temp[i] = 'K' + suit;
        }
        else {
          temp[i] = i + 1 + suit;
        }
      }
      return temp;
    }

    generateDeck(deckAmount) {
      var tmp = [];
    
      for (var i = 0; i < deckAmount; i++) {
        tmp.push(...this.makeSuitCard('H'));
        tmp.push(...this.makeSuitCard('D'));
        tmp.push(...this.makeSuitCard('S'));
        tmp.push(...this.makeSuitCard('C'));
      }
      return tmp;
    }

    draw() {
      var card = this.cards[0];
      this.cards.shift();
      return card;
    }
}

module.exports = Deck;