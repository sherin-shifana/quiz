H5P.NewContent = (function ($, UI) {

  function NewContent(options, id) {
    const that = this;
    that.options = options;
    // Keep provided id.
    that.id = id;
  };

  // Create Title Screen
  NewContent.prototype.createTitleScreen = function () {
    const that = this;
    this.$card = $('<div class="title-card"></div>');
    this.$title = $('<div class="title-text">'+this.options.titleScreen.title.text+'</div>');
    const hasTitleImage = this.options.titleScreen.image.file ? true:false;
    if (hasTitleImage) {
      const path = H5P.getPath(this.options.titleScreen.image.file.path,this.id);
      this.$titleImage = $('<img>', {
            'class': 'title-image',
            'src': path
      }).appendTo(that.$card);

    }
    this.$title.appendTo(this.$card);

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
    this.$tableDiv = $('<table></table>');
    for (let i=0; i<this.options.questions.length; i++) {
      this.$row = $('<tr></tr>');
      this.$col1 = $('<td>'+(i+1)+'</td>');
      this.$col2 = $('<td>'+this.options.questions[i].text+'</td>');
      this.$col3 = $('<td></td>');
      this.$col4 = $('<td></td>');
      this.$col5 = $('<td></td>');
      for (let j = 0; j < this.options.questions[i].answers.length; j++) {

        this.$coli1 = $('<td class="td" scope="row" data-id='+i+'.'+j+'>'+this.options.questions[i].answers[j].text+'</td><br>');
        this.$coli2= $('<td class="td" scope="row" data-id='+i+'.'+j+'>'+this.options.questions[i].answers[j].score+'</td><br>');
        this.$coli3 = $('<td class="td" scope="row" data-id='+i+'.'+j+'>'+this.options.questions[i].answers[j].feedback+'</td><br>');

        this.$coli1.appendTo(that.$col3);
        this.$coli2.appendTo(that.$col4);
        this.$coli3.appendTo(that.$col5);
      }
      this.$col1.appendTo(this.$row);
      this.$col2.appendTo(this.$row);
      this.$col3.appendTo(that.$row);
      this.$col4.appendTo(that.$row);
      this.$col5.appendTo(that.$row);
      this.$row.appendTo(that.$tableDiv);
    }

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
      this.$question = $('<div class="question"></div>');
      that.$progressBar = $('<div class="progress"></div>').appendTo(this.$question);
      this.$question.append(this.options.questions[j].id+'. '+this.options.questions[j].text);
      this.$question.appendTo(this.$questionCard);
      this.progress = ((j)/this.options.questions.length)*100 + '%';
      console.log(this.progress);
      if (j==0){
        this.progress = '1%';
      }
      that.$progressBar.css('width',this.progress);
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
    console.log(this.options.questions.length);
    console.log(that.$progressBar);
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
