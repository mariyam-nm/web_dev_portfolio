document.addEventListener('DOMContentLoaded', function () {
  let startButton = document.getElementById('start');
  let questionTitle = document.getElementById('question-title');
  let choicesDiv = document.getElementById('choices');
  let feedbackDiv = document.getElementById('feedback');
  let timeSpan = document.getElementById('time');
  let endScreen = document.getElementById('end-screen');
  let finalScoreSpan = document.getElementById('final-score');
  let initialsInput = document.getElementById('initials');
  let submitButton = document.getElementById('submit');

  let currentQuestionIndex = 0;
  let timeLeft = questions.length*15;
  let timerInterval;

  function startQuiz() {
    startButton.style.display = 'none';
    document.getElementById('start-screen').classList.add('hide');
    document.getElementById('questions').classList.remove('hide');

    displayQuestion();
    
    startTimer();
  }

function displayQuestion() {
  let currentQuestion = questions[currentQuestionIndex];
  questionTitle.textContent = currentQuestion.title;
  choicesDiv.innerHTML = '';

let numberOfQuestions = questions.length;

  for (let i = 0; i < numberOfQuestions; i++) {
    let choiceButton = document.createElement('button');
    choiceButton.textContent = (i + 1) + '. ' + currentQuestion.choices[i];
    choiceButton.classList.add('choice');
    choiceButton.addEventListener('click', handleChoiceClick);
    choicesDiv.appendChild(choiceButton);
  }
}

function handleChoiceClick(event) {
  let selectedChoice = event.target.textContent;
  console.log('Selected Choice:', selectedChoice); 
  let currentQuestion = questions[currentQuestionIndex];
  let correctAnswer = currentQuestion.answer;
  console.log('Correct Answer:', correctAnswer); 

  let selectedChoiceWithoutNumber = selectedChoice.slice(selectedChoice.indexOf('.') + 2);

  let isCorrect = selectedChoiceWithoutNumber === correctAnswer;

  if (isCorrect) {
    console.log('Correct Choice!');
    playSound('assets/sfx/correct.wav');
    feedbackDiv.textContent = 'Correct!';
  } else {
    console.log('Wrong Choice!')
    playSound('assets/sfx/incorrect.wav');
    feedbackDiv.textContent = 'Wrong!';
    timeLeft -= 15;
    if (timeLeft < 0) {
      timeLeft = 0;
    }
    timeSpan.textContent = timeLeft;
  }

function playSound(soundFile) {
  var audio = new Audio(soundFile);
  audio.play();
}

  feedbackDiv.classList.remove('hide');

  setTimeout(function() {
    feedbackDiv.classList.add('hide');
  }, 1000);

  currentQuestionIndex++;
  if (currentQuestionIndex < questions.length) {
    displayQuestion();
  } else {
    endQuiz();
  }
}

  function startTimer() {
    timeSpan.textContent = timeLeft;

    timerInterval = setInterval(function () {
      timeLeft--;
      timeSpan.textContent = timeLeft;

      if (timeLeft <= 0) {
        clearInterval(timerInterval);
        endQuiz();
      }
    }, 1000);
  }

  function endQuiz() {
    clearInterval(timerInterval);

    document.getElementById('questions').classList.add('hide');
    endScreen.classList.remove('hide');
    finalScoreSpan.textContent = timeLeft;
  }

  startButton.addEventListener('click', startQuiz);

  submitButton.addEventListener('click', function () {
    let initials = initialsInput.value.trim();

    if (initials !== '') {
      let highscores = JSON.parse(window.localStorage.getItem('highscores')) || [];
      let newScore = {
        initials: initials,
        score: timeLeft
      };
      highscores.push(newScore);
      window.localStorage.setItem('highscores', JSON.stringify(highscores));
      window.location.href = 'highscores.html';
    }
  });
});

