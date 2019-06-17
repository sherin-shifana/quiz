H5P.NewContent = (function ($, UI) {

  function NewContent(options, id) {
    const that = this;
    that.options = options;
    // Keep provided id.
    that.id = id;
  };

  NewContent.prototype.createTitleScreen = function () {
    this.$card = $('<div class="title-card"></div>');
    this.$title = $('<div class="title-text">'+this.options.titleScreen.title.text+'</div>');
    if (this.options.titleScreen.image.file) {
      const path = H5P.getPath(this.options.titleScreen.image.file.path,this.id);
      this.$titleImage = $('<img>', {
            'class': 'title-image',
            'src': path
      });
    }
    this.$title.appendTo(this.$card);
    this.$titleImage.appendTo(this.$card);
    return this.$card;
  }

  NewContent.prototype.createAnswerCard = function (index) {
    const that = this;
    for (let i=0;i<this.options.questions[index].answers.length;i++) {

      this.$answercard = $('<div class="answer-card"></div>');
      this.$answerText = $('<div class="answer-text">'+this.options.questions[index].answers[i].text+'</div>');
      const hasImage = this.options.questions[index].answers[i].image.file ? true : false;
      console.log(hasImage);
      if (hasImage) {
        const path = H5P.getPath(this.options.questions[index].answers[i].image.file.path,this.id);
        this.$answerImage = $('<img>', {
              'class': 'answer-image',
              'src': path
        }).appendTo(this.$answerCard);
      }

    }

    that.$answerText.appendTo(this.$answerCard);

    return this.$answerCard;
  };

  NewContent.prototype.createQuestionCard = function (index) {
    const that = this;
    that.createAnswerCard(index);
    this.$questionCard = $('<div class="question-card"></div>');
    this.$question = $('<div class="question">'+this.options.questions[index].text+'</div>');
    this.$answerDiv = $('<div class="answer-div"></div>');
    that.$answerCard.appendTo(this.$answerDiv);
    this.$question.appendTo(this.$questionCard);
    this.$answerDiv.appendTo(this.$questionCard);

    return this.$questionCard;
  };

  NewContent.prototype.startGame = function () {
    const that = this;
    for(let i=0;i<this.options.questions.length;i++){
        that.createQuestionCard(i);
    }
    that.$questionCard.appendTo(that.$wrapper);
  };

  NewContent.prototype.attach = function ($container) {
    const that = this;
    $container.addClass("main-container");
    this.$wrapper = $('<div class="wrapper"></div>');
    that.createTitleScreen();
    this.$startButton = UI.createButton({
      title: 'start',
      'text': 'Start',
      'class': 'start-button',
      click: function(){
        that.$wrapper.empty();
        that.startGame();
      }
    });

    that.$card.appendTo(this.$wrapper);
    this.$startButton.appendTo(this.$wrapper);
    this.$wrapper.appendTo($container);
  };
  return NewContent;
})(H5P.jQuery, H5P.JoubelUI);
