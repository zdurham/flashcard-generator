// Dependencies
var BasicCard = require('./basic-card.js')
var ClozeCard = require('./cloze-card.js')
var inquirer = require('inquirer')
var fs = require('fs')
var basicJSON = require('./basic-cards.json')


// Use inquirer to determine first if they want to create a basic card or a cloze card
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
      console.log("Your card has been logged to basic-cards.txt")
      // Retrieve for testing -> no longer needed
      /* 
      fs.readFile("./basic-cards.json", function(err, data) {
        if (err) {
          console.log("Something went wrong: " + err )
        }
        console.log(JSON.parse(data, null, 2))
        
      }) 
      */
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
    })
  }
})
