function ClozeCard(text, cloze) {
  if (this instanceof ClozeCard) {
    this.type = 'Cloze';
    this.fullText = text;
    this.cloze = cloze;
  }
  else {
    return new ClozeCard(text, cloze)
  }
}

ClozeCard.prototype.partial = function() {
  let partialText = this.fullText.replace(this.cloze, "...")
  return partialText
}

module.exports = ClozeCard;
