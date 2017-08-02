function ClozeCard(text, cloze) {
  this.type = 'Cloze';
  this.fullText = text;
  this.cloze = cloze;
  this.partial = function() {
    let partialText = this.fullText.replace(this.cloze, "...")
    console.log(partialText)
    console.log('------------------------------')
  }
}

module.exports = ClozeCard;
