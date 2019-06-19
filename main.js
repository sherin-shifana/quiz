H5P.NewContent = (function ($, UI) {

  function NewContent(options, id) {
    const that = this;
    that.options = options;
    // Keep provided id.
    that.id = id;
  };

  // Create Title Screen
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

  // Create Answer Card
  NewContent.prototype.createAnswerCard = function (index, answerIndex) {
      const that = this;
      this.$answercard = $('<div class="answer-card" data-id="'+that.dataId+'"></div>');
      this.$answerText = $('<div class="answer-text">'+this.options.questions[index].answers[answerIndex].text+'</div>');
      const hasImage = this.options.questions[index].answers[answerIndex].image.file ? true : false;

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

  // Feedback for Answers
  NewContent.prototype.createFeedback = function () {
    const that = this;

    
  };

  // Show Final Screen
  NewContent.prototype.showFinalScreen = function () {
    const that = this;
    that.$questionDiv.remove();
    that.$buttonContainer.remove();
    this.$scoreBoard = $('<div class = "score-board"></div>');
    this.$scoreDiv = $('<div class = "score-div"></div>');
    this.$feedbackDiv = $('<div class = "feedback-div"></div>');

    this.$scoreTitle = $('<div class = "score-title">Score</div>');
    this.$feedbackTitle = $('<div class = "feedback-title">Feedback</div>');
    this.$score = $('<div class = "score">'+that.totalScore+'/'+that.actualScore+'</div>');
    this.$feedback = $('<div class = "feedback"></div>');

    that.createFeedback();
    this.$scoreTitle.appendTo(this.$scoreDiv);
    this.$score.appendTo(this.$scoreDiv);
    that.$tableDiv.appendTo(this.$feedback);
    this.$feedbackTitle.appendTo(this.$feedbackDiv);
    this.$feedback.appendTo(this.$feedbackDiv);

    this.$scoreDiv.appendTo(this.$scoreBoard);
    this.$feedbackDiv.appendTo(this.$scoreBoard);
    this.$scoreBoard.appendTo(that.$wrapper);
  };

  // Create Question Card
  NewContent.prototype.createQuestionCard = function () {
    const that = this;
    this.$questionCards = [];
    this.actualScore = 0;
    that.dataId = 1;
    this.totalScore = 0;
    for (let j=0; j<this.options.questions.length; j++){
      this.$questionCard = $('<div class="question-card"></div>');
      this.$question = $('<div class="question">'+this.options.questions[j].id+'. '+this.options.questions[j].text+'</div>');
      this.$question.appendTo(this.$questionCard);
      this.actualScore += that.options.questions[j].actualScore;

      for (let i=0;i<this.options.questions[j].answers.length;i++) {
        this.$answerDiv = $('<div class="answer-div"></div>');
        that.createAnswerCard(j, i);
        that.dataId += 1;
        that.$answercard.appendTo(this.$answerDiv);
        this.$answerDiv.appendTo(this.$questionCard);

        this.$answerDiv.click(function() {
          this.score = that.options.questions[j].answers[i].score;
          that.calculateScore(this.score);
          this.isAnswered = true;

          if (that.currentIndex < that.$questionCards.length-1) {
            that.currentIndex = that.currentIndex + 1;
            that.showQuestion();
          }
          else if (that.currentIndex === that.$questionCards.length-1) {
            that.showFinalScreen();
          }
        });
      }
      that.dataId=1;
      this.$questionCards.push(this.$questionCard);
    }
    return this.$questionCards;
  };

  // Calculate the Total Score
  NewContent.prototype.calculateScore = function (score) {
    const that = this;
    that.totalScore += score;
    return that.totalScore;
  };

  // Show Question
  NewContent.prototype.showQuestion = function () {
    const that = this;
    if (that.currentIndex > 0) {
          this.prevIndex = that.currentIndex - 1;
          that.$questionCards[this.prevIndex].remove();
    }
    if (that.currentIndex !== that.$questionCards.length) {
          this.nextIndex = that.currentIndex + 1;
    }
    that.$questionCards[that.currentIndex].appendTo(that.$questionDiv);
  };

  // Start Game when startGame button is clicked
  NewContent.prototype.startGame = function () {
    const that = this;
    this.currentIndex = 0;
        this.$questionDiv = $('<div class="question-card"></div>');
    that.createQuestionCard();
    that.showQuestion();

    this.$buttonContainer = $('<div class="button-container"></div>');
    this.$prevButton = UI.createButton({
      title: 'previous',
      html:'<i class="fa fa-angle-double-left" aria-hidden="true"></i>',
      'class': 'prev-button',
      click: function(){
        if (that.currentIndex > 0) {
          that.$questionCards[that.currentIndex].remove();
          that.currentIndex = that.currentIndex - 1;
          that.createQuestionCard();
          that.showQuestion();
        }
        else {
          $(this).off(click);
        }
      }
    }).appendTo(this.$buttonContainer);

    this.$nextButton = UI.createButton({
      title: 'start',
      html:'<i class="fa fa-angle-double-right" aria-hidden="true"></i>',
      'class': 'next-button',
      click: function(){
        console.log(that.$questionCards.length);
        if (that.currentIndex < that.$questionCards.length-1) {
          that.$questionCards[that.currentIndex].remove();
          that.createQuestionCard();
          that.currentIndex+=1;
          that.showQuestion();
        }
      }
    }).appendTo(this.$buttonContainer);

    that.$questionDiv.appendTo(that.$wrapper);
    this.$buttonContainer.appendTo(that.$wrapper);
  };

  // Attach Function
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
