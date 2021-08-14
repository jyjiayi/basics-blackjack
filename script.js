//game mode to control the process of the game
var gameMode = "start game";

//array to store computer cards
var computerCards = [];

//global variables to store the sum of cards
var comSum = 0;

//to store the number of players
var numOfPlayers = 0;

//array to store the players' profiles - no, name, points, bet, hand
var playerProfile = [];

//to keep track of current player number
var currentPlayerNo = 0;

//true if it is a new round
var isNewRound = false;

var main = function (input) {
  var allCardsMessage = "";

  //welcome message to user
  if (gameMode == "start game") {
    gameMode = "input player names";
    return `Welcome to the Blackjack game! Please enter the number of players.`;
  }

  //asking names of all players
  if (gameMode == "input player names") {
    //to register the input for the number of players
    if (numOfPlayers == 0) {
      numOfPlayers = Number(input);
      return `You have entered ${numOfPlayers} for total number of players. <br><br> Please enter the name of player 1.`;
    }
    //to ask for names until all players have inputted
    if (playerProfile.length < numOfPlayers - 1) {
      createProfile(input);
      currentPlayerNo += 1;
      return `Welcome ${input}!<br><br> Player ${
        currentPlayerNo + 1
      }, please enter your name.`;
    }
    //after the last player entered the name, next is to ask for player 1's wager
    createProfile(input);

    //to move on to the next section of asking for players' points, thus resetting current player number back to 0
    gameMode = "input player wagers";
    currentPlayerNo = 0;

    return `Welcome ${input}! All players have entered their name.<br><br> ${playerProfile[0].name}, please enter your bet, you have ${playerProfile[0].points} points.`;
  }

  //asking wager points of all players
  if (gameMode == "input player wagers") {
    //if new round, need to start asking the first player to enter bet
    if (isNewRound) {
      computerCards = [];
      comSum = 0;
      currentPlayerNo = 0;
      for (var count = 0; count < numOfPlayers; count += 1) {
        playerProfile[count].hand = [];
        playerProfile[count].sum = 0;
      }
      isNewRound = false;
      return `Starting a new round...<br><br> Player 1, please enter your bet, you have ${playerProfile[0].points} points.`;
    }

    //to ask for wagers until all players have inputted
    if (currentPlayerNo < numOfPlayers - 1) {
      playerProfile[currentPlayerNo].bet = Number(input);
      currentPlayerNo += 1;
      return `Player ${currentPlayerNo} decided to bet ${input} points.<br><br>Player ${
        currentPlayerNo + 1
      }, please enter your bet, you have ${
        playerProfile[currentPlayerNo].points
      } points.`;
    }

    //after the last player entered the wager, next is to deal the cards, thus resetting current player num to 0
    playerProfile[currentPlayerNo].bet = Number(input);
    var lastPlayerNo = currentPlayerNo + 1;
    currentPlayerNo = 0;
    gameMode = "deal the cards";
    return `Player ${lastPlayerNo} decided to bet ${input} points.<br>All players have entered their wager points.<br><br>${playerProfile[0].name}, you will play first. Click submit to deal the cards. `;
  }

  //dealing the cards
  if (gameMode == "deal the cards") {
    gameMode = "hit or stand";
    dealCards(shuffledDeck);
    allCardsMessage = outputAllCards(playerProfile[currentPlayerNo].hand);
    var myOutputValue = `${allCardsMessage}`;
    if (playerProfile[currentPlayerNo].sum == 21) {
      myOutputValue += `Sum of player cards is 21, the player wins!<br><br>Moving on... click submit`;
      gameMode = "deal the cards";
      currentPlayerNo += 1;
      //if this is the last player
      if (currentPlayerNo == numOfPlayers) {
        currentPlayerNo -= 1;
        gameMode = "show com cards";
      }
    } else if (comSum == 21) {
      gameMode = "input player wagers";
      isNewRound = true;
      var outputComCards = displayCardsWithSuits(computerCards);
      myOutputValue += `${outputComCards}<br>Sum of computer cards is 21, the computer wins!.`;
    } else {
      myOutputValue += `Please choose if you like to 'hit' or 'stand'.`;
    }
    return `${myOutputValue}`;
  }
  //when player choose to hit
  if (gameMode == "hit or stand" && input == "hit") {
    playerProfile[currentPlayerNo].hand.push(shuffledDeck.pop());
    allCardsMessage = outputAllCards(playerProfile[currentPlayerNo].hand);
    var myOutputValue = `You chose to hit. <br><br>${allCardsMessage}`;
    if (playerProfile[currentPlayerNo].sum > 21) {
      gameMode = "deal the cards";
      currentPlayerNo += 1;
      //if this is the last player
      if (currentPlayerNo == numOfPlayers) {
        currentPlayerNo -= 1;
        gameMode = "show com cards";
      }
      myOutputValue += `Player busted!<br><br>Moving on... click submit`;
    } else {
      gameMode = "hit or stand";
      myOutputValue += `Please choose if you like to 'hit' or 'stand'.`;
    }
    return `${myOutputValue}`;
  }

  //when user choose to stand
  if (gameMode == "hit or stand" && input == "stand") {
    if (currentPlayerNo < numOfPlayers - 1) {
      allCardsMessage = outputAllCards(playerProfile[currentPlayerNo].hand);
      currentPlayerNo += 1;
      gameMode = "deal the cards";
      return `Player chose to stand. <br><br>${allCardsMessage}${playerProfile[currentPlayerNo].name}, click submit to deal your cards.`;
    }
    //when the last player chose to stand, then it will be the computer's turn
    if (currentPlayerNo == numOfPlayers - 1) {
      gameMode = "show com cards";
      return `Player chose to stand.<br>All players have ended their turn.<br><br>${allCardsMessage}Click submit to see computer's cards`;
    }
  }

  if (gameMode == "show com cards") {
    var outputComCards = displayCards(computerCards);
    comSum = sumOfCards(outputComCards);
    outputComCards = displayCardsWithSuits(computerCards);
    gameMode = "computer play";
    return `Computer's cards:<br>${outputComCards}<br>Sum:${comSum}<br><br>Click submit to see computer's play.`;
  }

  if (gameMode == "computer play") {
    gameMode = "see results";
    var outputValue = evaluateComPlay();
    return `${outputValue}Click submit to see results.`;
  }

  if (gameMode == "see results") {
    //to start a new round after seeing the results
    gameMode = "input player wagers";
    isNewRound = true;
    var outputValue = "";
    //display all players cards
    for (var count = 0; count < numOfPlayers; count += 1) {
      outputValue +=
        `${playerProfile[count].name}'s cards:<br>` +
        displayCardsWithSuits(playerProfile[count].hand) +
        `<br>Sum:` +
        playerProfile[count].sum +
        `<br><br>`;
    }
    //display computer cards
    outputValue +=
      `Computer's cards:<br>` +
      displayCardsWithSuits(computerCards) +
      `<br>Sum:` +
      sumOfCards(displayCards(computerCards));

    //display results
    outputValue += evaluateResults();
    return outputValue;
  }
};

//evaluate the results of each player
var evaluateResults = function () {
  var outputValue = `<br><br>Results:<br>`;
  for (var count = 0; count < numOfPlayers; count += 1) {
    //if player busted, while com not busted, com wins OR
    //if com sum is higher than player sum and com not busted, com wins
    if (
      (playerProfile[count].sum > 21 && comSum <= 21) ||
      (comSum > playerProfile[count].sum && comSum <= 21)
    ) {
      var delta = `-${playerProfile[count].bet} points`;
      playerProfile[count].points -= playerProfile[count].bet;
    }
    //if com busted, while player not busted, player wins OR
    //if player sum is higher than com sum and player not busted, player wins
    else if (
      (comSum > 21 && playerProfile[count].sum <= 21) ||
      (playerProfile[count].sum > comSum && playerProfile[count].sum <= 21)
    ) {
      var delta = `+${playerProfile[count].bet} points`;
      playerProfile[count].points += playerProfile[count].bet;
    }
    //if reaches there, means there is a tie
    else {
      var delta = 0;
    }
    outputValue += `${count + 1}. ${playerProfile[count].name} -> Bet: ${
      playerProfile[count].bet
    } points || Delta: ${delta} || Total points: ${
      playerProfile[count].points
    }<br>`;
  }
  return outputValue;
};

//to create the profile of all players
var createProfile = function (playerName) {
  playerProfile.push({
    no: currentPlayerNo + 1,
    name: playerName,
    points: 100,
    bet: 0,
    hand: [],
    sum: 0,
  });
};

//to manage the play of computer: computer will hit only when sum is below 17
var evaluateComPlay = function () {
  var outputComCards = displayCards(computerCards);
  while (comSum < 17) {
    computerCards.push(shuffledDeck.pop());
    outputComCards = displayCards(computerCards);
    comSum = sumOfCards(outputComCards);
  }
  comSum = sumOfCards(outputComCards);
  outputComCards = displayCardsWithSuits(computerCards);
  return `Computer's final cards:<br>${outputComCards}<br>Sum:${comSum}<br><br>`;
};

//to output the message of all the cards
var outputAllCards = function (playerCards) {
  var outputPlayerCards = displayCards(playerCards);
  var outputComCards = displayCards(computerCards);
  playerProfile[currentPlayerNo].sum = sumOfCards(outputPlayerCards);
  comSum = sumOfCards(outputComCards);
  //to better display the cards by adding the suits with emoji
  outputPlayerCards = displayCardsWithSuits(playerCards);
  outputComCards = displayCardsWithSuits(computerCards);

  return `${playerProfile[currentPlayerNo].name} have the cards: <br>${outputPlayerCards} <br>Sum: ${playerProfile[currentPlayerNo].sum}. <br><br> Computer's first card: <br>${outputComCards[0]}.<br><br>`;
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

//to display the cards by converting to an array with names and suits
var displayCardsWithSuits = function (cardArray) {
  var outputValue = [];
  for (var count = 0; count < cardArray.length; count += 1) {
    outputValue.push(cardArray[count].name + " of " + cardArray[count].suit);
  }
  return outputValue;
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
  playerProfile[currentPlayerNo].hand.push(shuffledDeck.pop());
  playerProfile[currentPlayerNo].hand.push(shuffledDeck.pop());
  if (computerCards.length == 0) {
    computerCards.push(shuffledDeck.pop());
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
  var suits = ["hearts ♥", "diamonds ♦", "clubs ♣", "spades ♠"];

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
