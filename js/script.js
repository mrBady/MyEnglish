const wordElement = document.getElementById("word");
const buttons = document.querySelectorAll(".choice-btn");
const scoreElement = document.getElementById("score");
const wrongScoreElement = document.getElementById("wrongScore");
const wrapper = document.querySelector(".wrapper");

let currentWord = {};
let wordsArray = [];

// Загружаем счетчики из localStorage или ставим в 0
let score = parseInt(localStorage.getItem("score")) || 0;
let wrongScore = parseInt(localStorage.getItem("wrongScore")) || 0;

function saveScores() {
  localStorage.setItem("score", score);
  localStorage.setItem("wrongScore", wrongScore);
}

async function fetchWordFromDB() {
  try {
    const response = await fetch("/js/DB.json");
    const data = await response.json();

    wordsArray = data.words;  // Сохраняем весь массив слов

    loadNewWord();
  } catch (error) {
    console.error("Error fetching word:", error);
  }
}

function loadNewWord() {
  const randomIndex = Math.floor(Math.random() * wordsArray.length);
  currentWord = wordsArray[randomIndex];
  displayWord(currentWord);
}

function displayWord(wordData) {
  wordElement.textContent = wordData.main;

  const correct = wordData.ru;

  // Подбираем 3 случайных неправильных варианта из wordsArray
  let options = wordsArray
    .filter(w => w.ru !== correct)
    .sort(() => 0.5 - Math.random())
    .slice(0, 3)
    .map(w => w.ru);

  const answers = [...options];
  const randomIndex = Math.floor(Math.random() * 4);
  answers.splice(randomIndex, 0, correct);

  buttons.forEach((btn, index) => {
    btn.textContent = answers[index];
    btn.onclick = () => checkAnswer(answers[index], correct);
  });
}

function checkAnswer(selected, correct) {
  const isCorrect = selected === correct;

  wrapper.classList.add(isCorrect ? "right" : "wrong");

  setTimeout(() => {
    wrapper.classList.remove("right", "wrong");
    if (isCorrect) {
      score++;
      updateScore();
    } else {
      wrongScore++;
      updateWrongScore();
    }
    saveScores();
    loadNewWord();
  }, isCorrect ? 1000 : 500);
}

function updateScore() {
  scoreElement.textContent = `Правильные: ${score}`;
}

function updateWrongScore() {
  wrongScoreElement.textContent = `Неправильные: ${wrongScore}`;
}

document.addEventListener("DOMContentLoaded", () => {
  updateScore();
  updateWrongScore();
  fetchWordFromDB();
});
