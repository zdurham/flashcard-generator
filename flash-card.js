// Dependencies
var BasicCard = require('./basic-card.js')
var ClozeCard = require('./cloze-card.js')
var inquirer = require('inquirer')
var fs = require('fs')
var chalk = require('chalk')
// Card decks
var clozeJSON = require('./cloze-cards.json');
var basicJSON = require('./basic-cards.json');



// These variables must be global for the readDeck function to work
var cardCounter = 0;
var correct = 0;
var incorrect = 0;


// Program should allow the user to:
// 1.) Create Cards --> DONE
// 2.) Read cards back (perhaps also with the ability to use just basic or just cloze cards) --> Works for basic, but not cloze?
// Program goals beyond that:
// 1.) Ability to delete cards
// 2.) Ability to shuffle card deck
// 3.) Ability to get a random card

// Program should first open a menu, then allow the user to select a list of options

//Run function
menu()

//------------------------------------FUNCTIONS------------------------------------// 
function menu() {
  inquirer.prompt([
    {
      "name": "menuChoice",
      "message": "Welcome to my flash-card generator. Please select an option below to begin.",
      "type": "list",
      "choices": ["Create a card", "Test using basic cards", "Test using cloze cards", "Pick a random card", "Exit" ]
    }
  ]).then(function(answer, err) {
    if (err) {
      console.log("Something went wrong: " + err)
    }
    let delay;
    switch(answer.menuChoice) {
      case "Create a card":
        console.log("Alright, let's make a new card!");
        delay = setTimeout(createCard, 1000);
        break;
      case "Test using basic cards":
        console.log("This deck will contain only basic cards. Good luck!")
        readDeck(basicJSON);
        break;
      case "Test using cloze cards":
        console.log("This deck will contain only cloze cards. Good luck!");  
        readDeck(clozeJSON);
        break;
      case "Pick a random card":
        console.log("Picking a random card.")
        break;
      case "Exit":
        console.log("Exiting the program.")
        break;
    }
  })
}


// Function to create a card
function createCard() {
  inquirer.prompt([
    {
      "name": "cardType",
      "message": "What type of card would you like to create?",
      "type": "list",
      "choices": ["Basic", "Cloze"]
    }
  ]).then(function(answer) {
    // if the answer is Basic, begin process for basic card
    if (answer.cardType === "Basic") {
      // Provide two prompts to ask for the front and back of the card
      inquirer.prompt([
        {
          "name" : "front",
          "message": "To create a basic card you will need to provide a question for the front and an answer for the back. Please type in your front side question now.",
          "type": "input",
        },
        {
          "name": "back",
          "message": "Now type in the answer",
          "type": "input"
        }
      ]).then(function(basicAnswers) {
        let newBasic = new BasicCard(basicAnswers.front, basicAnswers.back)
        console.log("Here is your new card: " + "\nFront: " + newBasic.front + "\nBack: " + newBasic.back)
        // Pushing this to the module basicJSON, still not sure how it works exactly, but it does!
        basicJSON.push(newBasic)
        // cannot use appendFile, have to use writeFile
        fs.writeFile("./basic-cards.json", JSON.stringify(basicJSON, null, 2), function(err) {
          if (err) {
            console.log("Something went wrong: " + err)
          }
        })
        console.log("Your card has been logged.")
        // Now ask them what to do next
        inquirer.prompt([
          {
            "name": "whatNow",
            "message": "What would you like to do next?",
            "type": "list",
            "choices": ["Create another card", "Go back to the main menu"]
          }
        ]).then(function(answer) {
          if (answer.whatNow === "Create another card") {
            createCard()
          }
          else if (answer.whatNow === "Go back to the main menu") {
            menu()
          }
        })
      })
    }
    // If the answer is Cloze, begin process for Cloze card
    else if (answer.cardType === "Cloze") {
      inquirer.prompt([
        {
          "name":"fullText",
          "message": "You have chosen a cloze card. Please type in the full text of the card.",
          "type": "input"
        },
        {
          "name": "cloze",
          "message": "Now, please type in the cloze text (the text to be replaced with '...' in the card.",
          "type": "input"
        }
      ]).then(function(clozeAnswers) {
        let newCloze = new ClozeCard(clozeAnswers.fullText, clozeAnswers.cloze)
        clozeJSON.push(newCloze)
        fs.writeFile("./cloze-cards.json", JSON.stringify(clozeJSON, null, 2), function(err) {
          if (err) {
            console.log("Something went wrong: " + err)
          }
        })
        console.log("Your card has been logged.")
        // Now ask them what to do next
        inquirer.prompt([
          {
            "name": "whatNow",
            "message": "What would you like to do next?",
            "type": "list",
            "choices": ["Create another card", "Go back to the main menu"]
          }
        ]).then(function(answer) {
          if (answer.whatNow === "Create another card") {
            createCard()
          }
          else if (answer.whatNow === "Go back to the main menu") {
            menu()
          }
        })
      })
    }
  })
}

// Function which grabs the cards and determines what type they are
function getCard(card) {
  var selection;
  // Determine what the card is with if statement
  // If cloze then is cloze card
  if (card.cloze !== undefined) {
    selection = new BasicCard(card.fullText, card.cloze)
    // Have to return a specific part so that cardInPlay is a simple message
    return selection.partial
  }
  else {
    selection = new BasicCard(card.front, card.back)
    // Have to return a specific part so that cardInPlay is a simple message
    return selection.front
  }
}

// Function to read the cards
function readDeck(deck) {
  // A counter will be used to determine if all cards have been used
  if (cardCounter < deck.length) {
    // This variable grabs the current card
    var cardInPlay = getCard(deck[cardCounter])
    inquirer.prompt([
      {
        "name": "question",
        "message": cardInPlay,
        "type": "input"
      }
    ]).then(function(answer) {
      //Determine cloze card or basic card again for comparison
      // If cloze card, then do the following
      if (deck[cardCounter].cloze !== undefined) {
        if (answer.question === deck[cardCounter].cloze) {
          console.log("You have answered correctly!")
          correct++
        }
        
        else {
          console.log("You answered incorrectly.")
          console.log("The answer was: " + deck[cardCounter.fullText])
          incorrect++
        }
      }
      else {
        if (answer.question === deck[cardCounter].back) {
          console.log("You have answered correctly!")
          correct++
        }
        else {
          console.log("You answered incorrectly.")
          console.log("The answer was: " + deck[cardCounter].back)
          incorrect++
        }
      }
      cardCounter++
      readDeck(deck)
    });
  }
  else {
    console.log("You have completed the full deck.")
    console.log("You answered " + correct + " correctly.")
    console.log("You answered " + incorrect + " incorrectly.")
    console.log("----------------------------------------------")
    console.log("Returning to the main menu.")
    correct = 0;
    incorrect = 0;
    cardCounter = 0;
    let delay = setTimeout(menu, 1000)
  }
}

/* if (text.split(cloze)[1] === undefined) {
    console.log('Your answer text was not found in the sentence. Please make sure your cloze content is in the text.')
    console.log('------------------------------')
    return
  }
  */