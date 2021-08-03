//game mode to control the process of the game
var gameMode = "start game";

//array to store player cards
var playerCards = [];

//array to store computer cards
var computerCards = [];

//global variables to store the sum of cards
var playerSum = 0;
var comSum = 0;

var main = function (input) {
  var allCardsMessage = "";

  //welcome message to user
  if (gameMode == "start game") {
    gameMode = "deal the cards";
    return `Welcome to the Blackjack game! Click submit to deal the cards.`;
  }
  //dealing the cards
  if (gameMode == "deal the cards") {
    gameMode = "hit or stand";
    dealCards(shuffledDeck);
    allCardsMessage = outputAllCards();
    var myOutputValue = `${allCardsMessage}`;
    if (playerSum == 21) {
      myOutputValue += `Sum of player cards is 21, the player wins! Refresh to play again.`;
    } else if (comSum == 21) {
      myOutputValue += `Sum of computer cards is 21, the computer wins! Refresh to play again.`;
    } else {
      myOutputValue += `Please choose if you like to 'hit' or 'stand'.`;
    }
    return `${myOutputValue}`;
  }
  //when user choose to hit
  if (gameMode == "hit or stand" && input == "hit") {
    playerCards.push(shuffledDeck.pop());
    allCardsMessage = outputAllCards();
    var myOutputValue = `You chose to hit. <br><br>${allCardsMessage}`;
    if (playerSum > 21) {
      myOutputValue += `Player busted, the computer wins! Refresh to play again.`;
    } else {
      gameMode = "hit or stand";
      myOutputValue += `Please choose if you like to 'hit' or 'stand'.`;
    }
    return `${myOutputValue}`;
  }

  //when user choose to stand
  if (gameMode == "hit or stand" && input == "stand") {
    var myOutputValue = `You chose to stand. <br><br>`;
    myOutputValue += evaluateComPlay();
    return `${myOutputValue}`;
  }
};

//to manage the play of computer: computer will hit only when sum is below 17
var evaluateComPlay = function () {
  var allCardsMessage = outputAllCards();
  while (comSum < 17) {
    computerCards.push(shuffledDeck.pop());
    allCardsMessage = outputAllCards();
  }

  if (comSum > 21) {
    return `${allCardsMessage}Computer busted, the player wins! Refresh to play again.`;
  } else if (comSum > playerSum) {
    return `${allCardsMessage}Sum of computer cards are higher than that of player's. The computer wins! Refresh to play again.`;
  } else if (playerSum > comSum) {
    return `${allCardsMessage}Sum of player cards are higher than that of computer's. The player wins! Refresh to play again.`;
  } else {
    return `${allCardsMessage}Both player and computer have the same sum of cards. It is a tie! Refresh to play again.`;
  }
};

//to output the message of all the cards
var outputAllCards = function () {
  var outputPlayerCards = displayCards(playerCards);
  var outputComCards = displayCards(computerCards);
  playerSum = sumOfCards(outputPlayerCards);
  comSum = sumOfCards(outputComCards);

  return `Player have the cards: ${outputPlayerCards} with sum: ${playerSum}. <br><br> Computer have the cards: ${outputComCards} with sum: ${comSum}. <br><br>`;
};

//to add up the sum of cards
var sumOfCards = function (cardArray) {
  var acesOnHand = 0;
  var sum = 0;
  for (var count = 0; count < cardArray.length; count += 1) {
    if (
      cardArray[count] == "jack" ||
      cardArray[count] == "queen" ||
      cardArray[count] == "king"
    ) {
      sum += 10;
    } else if (cardArray[count] == "ace") {
      //default ace value is 11
      acesOnHand += 1;
      sum += 11;
    } else {
      sum += Number(cardArray[count]);
    }
  }

  //convert aces to 1 if the sum exceeds 21
  if (sum > 21) {
    for (var count = 0; count < acesOnHand; count += 1) {
      while (sum > 21 && acesOnHand > 0) {
        acesOnHand -= 1;
        sum -= 10;
      }
    }
  }

  return sum;
};

//to display the cards by converting to an array with only the names
var displayCards = function (cardArray) {
  var outputValue = [];
  for (var count = 0; count < cardArray.length; count += 1) {
    outputValue.push(cardArray[count].name);
  }
  return outputValue;
};

//to deal the card in sequence, starting from player first
var dealCards = function (shuffledDeck) {
  for (var count = 0; count < 2; count += 1) {
    playerCards.push(shuffledDeck.pop());
    computerCards.push(shuffledDeck.pop());
  }
};

//to shuffle the deck
var shuffleDeck = function (cardDeck) {
  // Loop over the card deck array once
  var currentIndex = 0;
  while (currentIndex < cardDeck.length) {
    // Select a random index in the deck
    var randomIndex = getRandomIndex(cardDeck.length);
    // Select the card that corresponds to randomIndex
    var randomCard = cardDeck[randomIndex];
    // Select the card that corresponds to currentIndex
    var currentCard = cardDeck[currentIndex];
    // Swap positions of randomCard and currentCard in the deck
    cardDeck[currentIndex] = randomCard;
    cardDeck[randomIndex] = currentCard;
    // Increment currentIndex
    currentIndex = currentIndex + 1;
  }
  // Return the shuffled deck
  return cardDeck;
};

// Get a random index ranging from 0 (inclusive) to max (exclusive).
var getRandomIndex = function (max) {
  return Math.floor(Math.random() * max);
};

//to make the deck of cards
var makeDeck = function () {
  // Initialise an empty deck array
  var cardDeck = [];
  // Initialise an array of the 4 suits in our deck. We will loop over this array.
  var suits = ["hearts", "diamonds", "clubs", "spades"];

  // Loop over the suits array
  var suitIndex = 0;
  while (suitIndex < suits.length) {
    // Store the current suit in a variable
    var currentSuit = suits[suitIndex];

    // Loop from 1 to 13 to create all cards for a given suit
    // Notice rankCounter starts at 1 and not 0, and ends at 13 and not 12.
    // This is an example of a loop without an array.
    var rankCounter = 1;
    while (rankCounter <= 13) {
      // By default, the card name is the same as rankCounter
      var cardName = rankCounter;

      // If rank is 1, 11, 12, or 13, set cardName to the ace or face card's name
      if (cardName == 1) {
        cardName = "ace";
      } else if (cardName == 11) {
        cardName = "jack";
      } else if (cardName == 12) {
        cardName = "queen";
      } else if (cardName == 13) {
        cardName = "king";
      }

      // Create a new card with the current name, suit, and rank
      var card = {
        name: cardName,
        suit: currentSuit,
        rank: rankCounter,
      };

      // Add the new card to the deck
      cardDeck.push(card);

      // Increment rankCounter to iterate over the next rank
      rankCounter += 1;
    }

    // Increment the suit index to iterate over the next suit
    suitIndex += 1;
  }

  // Return the completed card deck
  return cardDeck;
};

//the deck of cards
var deck = makeDeck();
//to shuffle the deck
var shuffledDeck = shuffleDeck(deck);
