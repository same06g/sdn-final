var axios = require("axios");
var readline = require("readline");

var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

var playerCards;
var computerCards;
var playerPoints = 0;
var computerPoints = 0;
var deck;
var playerDone = false;

function getDeck() {
  axios
    .get("https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=6")
    .then(function (response) {
      deck = response.data.deck_id;
      axios
        .get("https://deckofcardsapi.com/api/deck/" + deck + "/draw/?count=4")
        .then(function (response) {
          playerCards = [response.data.cards[0], response.data.cards[1]];
          computerCards = [response.data.cards[2], response.data.cards[3]];
          startGame();
        })
        .catch(function (error) {
          console.log("Error with game!", error);
        });
    })
    .catch(function (error) {
      console.log("Error with game!", error);
    });
}

function continueGame() {
  playerPoints = 0;
  computerPoints = 0;
  for (var i = 0; i < playerCards.length; i++) {
    playerPoints = playerPoints + calculateValueOfCard(playerCards[i].value);
  }
  for (var i = 0; i < computerCards.length; i++) {
    computerPoints =
      computerPoints + calculateValueOfCard(computerCards[i].value);
  }
  if (playerPoints > 21) {
    console.log(
      "You have drawn up to " +
        playerPoints +
        " points and the computer has " +
        computerPoints +
        " points."
    );
    console.log("You bust, the computer wins!");
  } else querryUser();
}

function drawCard() {
  axios
    .get("https://deckofcardsapi.com/api/deck/" + deck + "/draw/?count=1")
    .then(function (response) {
      if (playerDone) computerCards.push(response.data.cards[0]);
      else playerCards.push(response.data.cards[0]);

      if (playerDone) {
        endGame();
      } else {
        continueGame();
      }
    })
    .catch(function (error) {
      console.log("Error with game!", error);
    });
}

function endGame() {
  playerPoints = 0;
  computerPoints = 0;
  for (var i = 0; i < playerCards.length; i++) {
    playerPoints = playerPoints + calculateValueOfCard(playerCards[i].value);
  }
  for (var i = 0; i < computerCards.length; i++) {
    computerPoints =
      computerPoints + calculateValueOfCard(computerCards[i].value);
  }
  if (playerDone === false) {
    playerDone = true;
    console.log("You've chosen to not draw any more cards");
  }

  if (computerPoints < 21 && computerPoints <= playerPoints) {
    drawCard();
  } else if (computerPoints > 21) {
    console.log(
        "You have " +
          playerPoints +
          " points and the computer has drawn up to " +
          computerPoints +
          " points."
      );
    console.log("The computer busts, you win!");
  } else if (computerPoints > playerPoints) {
    console.log(
      "You have " +
        playerPoints +
        " points and the computer has drawn up to " +
        computerPoints +
        " points."
    );
    console.log("The computer wins");
  } else {
    console.log(
      "You have " +
        playerPoints +
        " points and  the computer has drawn up to" +
        computerPoints +
        " points."
    );
    console.log("You and the computer tie!");
  }
}

function calculateValueOfCard(value) {
  if (value == "ACE") {
    return 11;
  } else if (value == "KING" || value == "JACK" || value == "QUEEN") {
    return 10;
  } else return parseInt(value);
}

function querryUser() {
  console.log(
    "You have " +
      playerPoints +
      " points and  the computer has " +
      computerPoints +
      " points."
  );
  rl.question("Would you like to draw another card (Y/N)? ", function (input) {
    if (input === "Y" || input === "y") drawCard(true);
    else {
      endGame();
    }
  });
}

function startGame() {
  console.log("Welcome to the 21 Card Game!");
  for (var i = 0; i < playerCards.length; i++) {
    playerPoints = playerPoints + calculateValueOfCard(playerCards[i].value);
  }
  for (var i = 0; i < computerCards.length; i++) {
    computerPoints =
      computerPoints + calculateValueOfCard(computerCards[i].value);
  }
  querryUser();
}

getDeck();
