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

  NewContent.prototype.createAnswerCard = function (index, answerIndex) {
      const that = this;
      this.$answercard = $('<div class="answer-card"></div>');
      this.$answerText = $('<div class="answer-text">'+this.options.questions[index].answers[answerIndex].text+'</div>');
      const hasImage = this.options.questions[index].answers[answerIndex].image.file ? true : false;
      console.log(hasImage);
      if (hasImage) {
        const path = H5P.getPath(this.options.questions[index].answers[answerIndex].image.file.path,this.id);
        this.$answerImage = $('<img>', {
              'class': 'answer-image',
              'src': path
        });
      }
      that.$answerImage.appendTo(this.$answercard);
      that.$answerText.appendTo(this.$answercard);

      return this.$answercard;
  };

  NewContent.prototype.createQuestionCard = function () {
    const that = this;
    this.$questionCards = [];
    for (let j=0; j<this.options.questions.length; j++){
      this.$questionCard = $('<div class="question-card"></div>');
      this.$question = $('<div class="question">'+this.options.questions[j].text+'</div>');
      this.$question.appendTo(this.$questionCard);
      for (let i=0;i<this.options.questions[j].answers.length;i++) {
        this.$answerDiv = $('<div class="answer-div"></div>');
        that.createAnswerCard(j, i);
        that.$answercard.appendTo(this.$answerDiv);
        this.$answerDiv.appendTo(this.$questionCard);
        this.$answerDiv.click(function() {
          if (that.currentIndex < that.$questionCards.length-1) {
            that.currentIndex = that.currentIndex + 1;
            that.showQuestion();
          }
          else if (that.currentIndex === that.$questionCards.length-1) {
            that.showFinalScreen();
          }
        });
      }

      this.$questionCards.push(this.$questionCard);
    }

    return this.$questionCards;
  };

  NewContent.prototype.showQuestion = function () {
    const that = this;
    if (that.currentIndex > 0) {
          this.prevIndex = that.currentIndex - 1;
          that.$questionCards[this.prevIndex].remove();
    }
    if (that.currentIndex !== that.$questionCards.length) {
          this.nextIndex = that.currentIndex + 1;
    }
    that.$questionCards[that.currentIndex].appendTo(that.$wrapper);
  };

  NewContent.prototype.startGame = function () {
    const that = this;
    this.currentIndex = 0;
    that.createQuestionCard();
    that.showQuestion();
    this.$prevButton = UI.createButton({
      title: 'previous',
      html:'<i class="fa fa-angle-double-left" aria-hidden="true"></i>',
      'class': 'prev-button',
      click: function(){
        if (that.currentIndex > 0) {
          that.$questionCards[that.currentIndex].remove();
          that.currentIndex = that.currentIndex - 1;
          that.showQuestion();
        }

      }
    }).appendTo(that.$wrapper);

    this.$nextButton = UI.createButton({
      title: 'start',
      html:'<i class="fa fa-angle-double-right" aria-hidden="true"></i>',
      'class': 'next-button',
      click: function(){
        console.log(that.$questionCards.length);
        if (that.currentIndex < that.$questionCards.length-1) {
          that.currentIndex+=1;
          that.showQuestion();
        }
      }
    }).appendTo(that.$wrapper);
    that.createAnswerCard(that.$currentIndex, 0);
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
