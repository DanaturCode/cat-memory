// Card options
const firstCardSet = [
  {
    name: 'Krümel Bed',
    img: '/src/images/kruemel-bed.jpg',
  },
  {
    name: 'Krümel Blanket',
    img: '/src/images/kruemel-blanket.jpg',
  },
  {
    name: 'Malinka',
    img: '/src/images/malinka.jpg',
  },
  {
    name: 'Salomé Blanket',
    img: '/src/images/salome-blanket.jpg',
  },
  {
    name: 'Salomé Chair',
    img: '/src/images/salome-chair.jpg',
  },
  {
    name: 'Simba Basket',
    img: '/src/images/simba-basket.jpg',
  },
  {
    name: 'Simba Blanket',
    img: '/src/images/simba-blanket.jpg',
  },
  {
    name: 'Streetcat',
    img: '/src/images/streetcat.jpg',
  },
];

const highscores = [
  {
    points: 82,
    attempts: 21,
    time: '01:01',
    name: 'Klaus',
  },
  {
    points: 36,
    attempts: 13,
    time: '00:23',
    name: 'Tom',
  },
];

const secondCardSet = firstCardSet;
const fullCardSet = firstCardSet.concat(secondCardSet);
const grid = document.querySelector('.grid');
const pairsDisplay = document.querySelector('[data-pairs]');
const attemptsDisplay = document.querySelector('[data-attempts]');
const minutesDisplay = document.querySelector('[data-minutes]');
const secondsDisplay = document.querySelector('[data-seconds]');
const highscoreDataDisplay = document.querySelector(
  '[data-table="highscores"]'
);

let cardsChosen = [];
let cardsChosenIDs = [];
let cardsWon = [];
let attempts = 0;
let elapsedTime = 0;
let stopWatch = null;

const createHighscoreList = () => {
  highscores.sort(
    (newEntry, existingEntry) =>
      parseFloat(newEntry.points) - parseFloat(existingEntry.points)
  );
  highscores.forEach(entry => {
    const line = document.createElement('div');
    const nameEntry = document.createElement('div');
    const timeEntry = document.createElement('div');
    const attemptsEntry = document.createElement('div');

    line.classList.add('line');
    nameEntry.textContent = entry.name;
    timeEntry.textContent = entry.time;
    attemptsEntry.textContent = entry.attempts;

    highscoreDataDisplay.appendChild(line);
    line.appendChild(nameEntry);
    line.appendChild(timeEntry);
    line.appendChild(attemptsEntry);
  });
};

const createBoard = () => {
  const winMessageContainer = document.querySelector('[data-container]');

  fullCardSet.sort(() => 0.5 - Math.random());

  attemptsDisplay.textContent = 0;
  minutesDisplay.textContent = '00';
  secondsDisplay.textContent = '00';
  pairsDisplay.textContent = `0/${fullCardSet.length / 2}`;

  if (grid.contains(winMessageContainer)) {
    winMessageContainer.remove();
  }

  if (grid.classList.contains('reload') === true) {
    grid.classList.remove('reload');
  }

  for (i = 0; i < fullCardSet.length; i++) {
    const card = document.createElement('img');
    card.setAttribute('src', '/src/images/back.png');
    card.setAttribute('data-id', i);
    card.addEventListener('click', flipCard);
    grid.appendChild(card);
  }

  const startCard = document.querySelector('img');

  startCard.addEventListener(
    'click',
    function () {
      stopWatch = setInterval(timer, 1000);
    },
    { once: true }
  );
};

function flipCard() {
  let cardID = this.getAttribute('data-id');
  cardsChosen.push(fullCardSet[cardID].name);
  cardsChosenIDs.push(cardID);
  this.setAttribute('src', fullCardSet[cardID].img);
  if (cardsChosen.length === 2) {
    setTimeout(checkForMatch, 500);
    attempts += 1;
    attemptsDisplay.textContent = attempts;
  }
}

pairsDisplay.textContent = `${cardsWon.length}/${fullCardSet.length / 2}`;

function checkForMatch() {
  const cards = document.querySelectorAll('img');
  const optionOneID = cardsChosenIDs[0];
  const optionTwoID = cardsChosenIDs[1];
  const optionOneName = cardsChosen[0];
  const optionTwoName = cardsChosen[1];

  if (optionOneID === optionTwoID) {
    cards[optionOneID].setAttribute('src', '/src/images/back.png');
    cards[optionTwoID].setAttribute('src', '/src/images/back.png');
  } else if (optionOneName === optionTwoName) {
    cards[optionOneID].style.opacity = '0';
    cards[optionTwoID].style.opacity = '0';
    cards[optionOneID].removeEventListener('click', flipCard);
    cards[optionTwoID].removeEventListener('click', flipCard);
    cardsWon.push(cardsChosen);
  } else {
    cards[optionOneID].setAttribute('src', '/src/images/back.png');
    cards[optionTwoID].setAttribute('src', '/src/images/back.png');
  }

  cardsChosen = [];
  cardsChosenIDs = [];
  pairsDisplay.textContent = `${cardsWon.length}/${fullCardSet.length / 2}`;

  if (cardsWon.length === fullCardSet.length / 2) {
    const winMessageContainer = document.createElement('div');
    const message = document.createElement('div');
    const reloadButton = document.createElement('button');
    const cards = document.querySelectorAll('img');
    const playerPoints = elapsedTime + attempts;
    const highscorePoints = highscores.map(entry => entry.points);
    const lastPlace = Math.max(...highscorePoints);

    cards.forEach(card => {
      card.remove();
    });

    winMessageContainer.classList.add('win-message-container');
    winMessageContainer.dataset.container = 'win-message';

    grid.classList.add('reload');
    reloadButton.dataset.button = 'reload';
    reloadButton.classList.add('reload-button');
    reloadButton.textContent = 'Nochmal!';
    reloadButton.setAttribute('type', 'button');
    reloadButton.addEventListener('click', createBoard);

    message.classList.add('message');
    message.innerHTML = `Gratulation! 🎉<br /> Du hast das Spiel gelöst!<br /> <span>${playerPoints} Punkte</span>`;

    grid.appendChild(winMessageContainer);
    winMessageContainer.appendChild(message);
    winMessageContainer.appendChild(reloadButton);

    const highScoreInput = () => {
      const nameInput = document.createElement('input');
      const sendButton = document.createElement('button');
      const formContainer = document.createElement('div');
      const winMessageContainer = document.querySelector('[data-container]');
      const highscoreButton = document.querySelector(`[data-button="enter"]`);

      nameInput.setAttribute('type', 'text');
      nameInput.dataset.input = 'name';
      nameInput.placeholder = 'Dein Name';
      sendButton.dataset.button = 'send';
      sendButton.textContent = 'Absenden';
      sendButton.classList.add('send-button');
      highscoreButton.remove();
      formContainer.classList.add('form-container');
      formContainer.appendChild(nameInput);
      formContainer.appendChild(sendButton);
      winMessageContainer.appendChild(formContainer);

      const createPlayerEntry = () => {
        const playerName = document.querySelector('[data-input]').value;
        const playerAttempts =
          document.querySelector('[data-attempts]').innerHTML;
        const playerMinutes =
          document.querySelector('[data-minutes]').innerHTML;
        const playerSeconds =
          document.querySelector('[data-seconds]').innerHTML;
        const playerEntry = {
          points: playerPoints,
          attempts: playerAttempts,
          time: `${playerMinutes}:${playerSeconds}`,
          name: playerName,
        };
        const successMessage = document.createElement('div');
        successMessage.innerHTML = 'Dein Name wurde eingetragen!';
        successMessage.classList.add('success-message');

        nameInput.remove();
        sendButton.remove();

        formContainer.appendChild(successMessage);

        if (highscorePoints.length === 10 && playerInfo.points < lastPlace) {
          highscores.pop();
        }

        highscores.push(playerEntry);

        if (highscoreDataDisplay.length !== 0) {
          highscoreDataDisplay.innerHTML = '';
        }

        createHighscoreList();
      };

      sendButton.addEventListener('click', createPlayerEntry);

      nameInput.addEventListener('keypress', function (event) {
        if (event.key === 'Enter') {
          event.preventDefault();
          sendButton.click();
        }
      });

    };

    if (
      highscorePoints.length < 10 ||
      (playerPoints < lastPlace && highscorePoints.length === 10)
    ) {
      const highscoreButton = document.createElement('button');
      highscoreButton.dataset.button = 'enter';
      highscoreButton.classList.add('highscore-button');
      highscoreButton.textContent = 'Punkte eintragen';
      highscoreButton.setAttribute('type', 'button');
      highscoreButton.addEventListener('click', highScoreInput);
      winMessageContainer.appendChild(highscoreButton);
    }

    clearInterval(stopWatch);

    elapsedTime = 0;
    cardsWon.length = 0;
    attempts = 0;
  }
}

const timer = () => {
  elapsedTime = elapsedTime + 1;

  secondsDisplay.textContent = (elapsedTime % 60).toString().padStart(2, '0');
  minutesDisplay.textContent = Math.floor(elapsedTime / 60)
    .toString()
    .padStart(2, '0');
};

createBoard();
createHighscoreList();
console.log(highscores);
