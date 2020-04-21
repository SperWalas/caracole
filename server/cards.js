const uuidv4 = require('uuid').v4;

// Constants
const suits = ['spades', 'diamonds', 'clubs', 'hearts'];
const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

/**
 * Data format
 * card: { value: string, suit: string | null, points: number }
 * cards: card[]
 */

const calcScore = cards => {
  return cards.reduce((score, card) => (card ? score + card.points : score), 0);
};

const getDeck = (withJoker = true) => {
  const deck = new Array();

  for (let i = 0; i < suits.length; i++) {
    for (let x = 0; x < values.length; x++) {
      const card = {
        id: uuidv4(),
        value: values[x],
        suit: suits[i],
        points:
          values[x] !== 'K'
            ? Math.min(x + 1, 10)
            : suits[i] === 'spades' || suits[i] === 'clubs'
            ? 20
            : 0
      };
      deck.push(card);
    }
  }
  // if (withJoker) {
  //   const joker = {
  //     id: uuidv4(),
  //     value: 'Joker',
  //     suit: null,
  //     points: 10
  //   };
  //   deck.push(joker, joker);
  // }

  return deck;
};

const shuffleDeck = deck => {
  let count = deck.length;
  while (count) {
    deck.push(deck.splice(Math.floor(Math.random() * count), 1)[0]);
    count -= 1;
  }

  return deck;
};

module.exports = {
  calcScore,
  getDeck,
  shuffleDeck
};
