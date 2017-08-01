function ClozeCard(text, cloze) {
  // if statement to check the cloze is in the text
  if (text.split(cloze)[1] === undefined) {
    console.log('Your answer text was not found in the sentence. Please make sure your cloze content is in the text.')
    console.log('------------------------------')
    return
  }
  else {
    this.type = 'Cloze';
    this.fullText = text;
    this.cloze = cloze;
    this.partial = function() {
      let partialText = this.fullText.replace(this.cloze, "...")
      console.log(partialText)
      console.log('------------------------------')
    }
  }
}

module.exports = ClozeCard;
