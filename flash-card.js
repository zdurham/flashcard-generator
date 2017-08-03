// Dependencies
var BasicCard = require('./basic-card.js')
var ClozeCard = require('./cloze-card.js')
var inquirer = require('inquirer')
var fs = require('fs')
var chalk = require('chalk')
// Card decks
var clozeJSON = require('./cloze-cards.json');
var basicJSON = require('./basic-cards.json');
var fullDeck = clozeJSON.concat(basicJSON)


// These variables must be global for the readDeck function to work
var cardCounter = 0;
var correct = 0;
var incorrect = 0;


// Program should allow the user to:
// 1.) Create Cards --> DONE
// 2.) Read card decks (full and individual) --> DONE
// Program goals beyond that:
// 1.) Ability to delete cards --> DONE
// 2.) Ability to shuffle card deck
// 3.) Ability to get a random card

// Program should first open a menu, then allow the user to select a list of options

//Run initial function
menu()

//------------------------------------FUNCTIONS------------------------------------// 
//------------------------------------FUNCTIONS------------------------------------// 
//------------------------------------FUNCTIONS------------------------------------// 
//------------------------------------FUNCTIONS------------------------------------// 
//------------------------------------FUNCTIONS------------------------------------// 
function menu() {
  inquirer.prompt([
    {
      "name": "menuChoice",
      "message": "Welcome to my flash-card generator. Please select an option below to begin.",
      "type": "list",
      "choices": ["Create a card", "Test using the full deck", "Test using basic cards", "Test using cloze cards", "Show cards", "Exit" ]
    }
  ]).then(function(answer, err) {
    if (err) {
      console.log("Something went wrong: " + err)
    }
    let delay;
    switch(answer.menuChoice) {
      case "Create a card":
        console.log("Alright, let's make a new card!");
        createCard()
        break;
      case "Test using the full deck":
        console.log("This deck will contain all cards, both basic and cloze. The deck has been shuffled.")
        readDeck(fullDeck)
      case "Test using basic cards":
        console.log("This deck will contain only basic cards. Good luck!")
        readDeck(basicJSON);
        break;
      case "Test using cloze cards":
        console.log("This deck will contain only cloze cards. Good luck!");  
        readDeck(clozeJSON);
        break;
      case "Show cards":
        inquirer.prompt([
          {
            "name": "deckChoice",
            "message": "Which deck would you like to inspect?",
            "type": "list",
            "choices": ["Basic Deck", "Cloze Deck"]
          }
        ]).then(function (decks) {
          switch (decks.deckChoice) {
            case "Basic Deck":
              console.log(chalk.blue("Showing cards for the basic deck."))
              showCards(basicJSON)
              break;
            case "Cloze Deck":
              console.log(chalk.blue("Showing cards for the cloze deck."))
              showCards(clozeJSON)
              break;
          }
        })
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
        if (clozeAnswers.fullText.split(clozeAnswers.cloze)[1] === undefined) {
          console.log(chalk.blue("Your cloze text was not found in the sentence. Please re-try and enter your cloze into the full text."))
          console.log(chalk.blue("Returning you to the beginning of the process."))
          createCard()
        }
        else {
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
        }
      })
    }
  })
}

// Function which grabs the cards and determines what type they are
function getCard(card) {
  // Determine what the card is with if statement
  // If cloze then is cloze card
  if (card.type === 'Cloze') {
    var selection = new ClozeCard(card.fullText, card.cloze)
    // Have to return a specific part so that cardInPlay is a simple message
    console.log(selection.partial())
    return selection.partial()
  }
  else {
    var selection = new BasicCard(card.front, card.back)
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
        "message": "Question: " + cardInPlay,
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
          console.log("The answer was: " + deck[cardCounter].fullText)
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
// Function to show deck
function showCards(deck) {
  for (var x = 0; x < deck.length; x++) {   
    var partial = getCard(deck[x])
    // Determine cloze vs basic
    // cloze case
    if (deck[x].type === 'Cloze') {
      console.log(chalk.bgBlack("-------------CLOZE CARD-------------"))
      console.log(chalk.blue("Position in deck: ") + x )
      console.log(chalk.bgBlack("------------Partial Text------------"))
      console.log(chalk.blue(partial))
      console.log(chalk.bgBlack("-------------Cloze Text-------------"))
      console.log(chalk.blue(deck[x].cloze))
      console.log(chalk.bgBlack("------------------------------------"))
    }
    // basic case
    else {
      console.log(chalk.bgBlack("-------------BASIC CARD-------------"))
      console.log(chalk.blue("Position in deck: ") + x )
      console.log(chalk.bgBlack("----------------FRONT---------------"))
      console.log(chalk.blue(deck[x].front))
      console.log(chalk.bgBlack("----------------BACK----------------"))
      console.log(chalk.blue(deck[x].back))
      console.log(chalk.bgBlack("------------------------------------"))
    }
  }
  inquirer.prompt([
    {
      "name": "next",
      "message": "What would you like to do next?",
      "type": "list",
      "choices": ["Create a new card", "Delete a card from this deck", "Return to the main menu"]
    }
  ]).then(function(answer) {
    switch (answer.next) {
      case "Create a new card":
        createCard();
        break;
      case "Delete a card from this deck":
      inquirer.prompt([
          {
            "name": "toDelete",
            "message": "Please input the position number of the card you would like to delete. This is denoted on each card.",
            "type": "input"
          } 
        ]).then(function(answer) {
          var tobeDeleted = deck[answer.toDelete]
          deleteCard(deck, tobeDeleted)
        })
        
        break;
      case "Return to the main menu":
        menu()
        break;
    }
  })
}

// Function to delete a card
function deleteCard(deck, card) {
  deck.pop(card)
  delete card
  console.log("Your selected card has been deleted from the deck")
  if (deck === basicJSON) {
    fs.writeFile("./basic-cards.json", JSON.stringify(basicJSON, null, 2), function(err) {
      if (err) {
        console.log("Something went wrong: " + err)
      }
    })
  }
  else {
    fs.writeFile("./cloze-cards.json", JSON.stringify(clozeJSON, null, 2), function(err) {
      if (err) {
        console.log("Something went wrong: " + err)
      }
    })
  }
  inquirer.prompt([
    {
      "name": "next",
      "message": "What would you like to do next?",
      "type": "list",
      "choices": ["Create a new card", "Delete another card", "Return to the main menu"]
    }
  ]).then(function(answer) {
    switch (answer.next) {
      case "Create a new card":
        createCard();
        break;
      case "Delete another card":
        deleteCard()
        break;
      case "Return to the main menu":
        menu()
        break;
    }
  })
}

