// Preload speech voices (fix for Chrome)
window.speechSynthesis.getVoices();
window.addEventListener('load', () => {
  const init = new SpeechSynthesisUtterance('');
  speechSynthesis.speak(init);
});

// Alphabet data
const letters = [
  ['A','Apple','🍎'],['B','Ball','⚽'],['C','Cat','🐱'],['D','Dog','🐶'],['E','Elephant','🐘'],['F','Fish','🐟'],
  ['G','Giraffe','🦒'],['H','Hat','🎩'],['I','Ice cream','🍦'],['J','Juice','🧃'],['K','Kite','🪁'],['L','Lion','🦁'],
  ['M','Monkey','🐒'],['N','Nest','🪺'],['O','Orange','🍊'],['P','Penguin','🐧'],['Q','Queen','👑'],['R','Rabbit','🐰'],
  ['S','Sun','☀️'],['T','Tiger','🐯'],['U','Umbrella','☔'],['V','Violin','🎻'],['W','Whale','🐋'],['X','Xylophone','🎶'],
  ['Y','Yo-yo','🪀'],['Z','Zebra','🦓']
];

let order = letters.map((_, i) => i);
const grid = document.getElementById('lettersGrid');
const previewEmoji = document.getElementById('previewEmoji');
const previewLetter = document.getElementById('previewLetter');
const previewWord = document.getElementById('previewWord');
const previewHint = document.getElementById('previewHint');
const quizArea = document.getElementById('quizArea');
let currentIndex = 0;

// Render grid
function renderGrid() {
  grid.innerHTML = '';
  order.forEach((idx) => {
    const [L, word, emoji] = letters[idx];
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <div class="letter">${L}</div>
      <div class="emoji">${emoji}</div>
      <div class="word">${word}</div>
    `;
    card.addEventListener('click', () => selectLetter(idx));
    grid.appendChild(card);
  });
}

function selectLetter(idx) {
  currentIndex = idx;
  const [L, word, emoji] = letters[idx];
  previewEmoji.textContent = emoji;
  previewLetter.textContent = L;
  previewWord.textContent = word;
  previewHint.textContent = `${L} is for ${word}, Sidhi!`;
  speak(`${L}. ${word}`);
}

function speak(text) {
  if (!('speechSynthesis' in window)) return;
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = 'en-US';
  utter.rate = 0.9;
  utter.pitch = 1;
  speechSynthesis.cancel();
  speechSynthesis.speak(utter);
}

// Controls
document.getElementById('playSound').addEventListener('click', () => {
  speak(`${previewLetter.textContent}. ${previewWord.textContent}`);
});

document.getElementById('speakAll').addEventListener('click', async () => {
  for (let i = 0; i < letters.length; i++) {
    const [L, word] = letters[order[i]];
    speak(`${L}. ${word}`);
    await new Promise(r => setTimeout(r, 900));
  }
});

document.getElementById('shuffle').addEventListener('click', () => {
  order = order.sort(() => Math.random() - 0.5);
  renderGrid();
});

document.getElementById('prev').addEventListener('click', () => {
  currentIndex = (currentIndex - 1 + letters.length) % letters.length;
  selectLetter(currentIndex);
});

document.getElementById('next').addEventListener('click', () => {
  currentIndex = (currentIndex + 1) % letters.length;
  selectLetter(currentIndex);
});

document.getElementById('startQuiz').addEventListener('click', startQuiz);

// Quiz function
function startQuiz() {
  quizArea.innerHTML = '';
  const quizCard = document.createElement('div');
  quizCard.className = 'quiz-card';

  const rnd = Math.floor(Math.random() * letters.length);
  const [L, word, emoji] = letters[rnd];

  const title = document.createElement('h3');
  title.textContent = 'Which letter is this, Sidhi?';

  const qEmoji = document.createElement('div');
  qEmoji.className = 'big-emoji';
  qEmoji.textContent = emoji;

  const opts = document.createElement('div');
  opts.className = 'options';

  let choices = new Set([rnd]);
  while (choices.size < 3) choices.add(Math.floor(Math.random() * letters.length));
  choices = Array.from(choices).sort(() => Math.random() - 0.5);

  choices.forEach(i => {
    const btn = document.createElement('button');
    btn.className = 'option';
    btn.textContent = letters[i][0];
    btn.addEventListener('click', () => {
      Array.from(opts.children).forEach(n => n.disabled = true);
      if (i === rnd) {
        btn.classList.add('correct');
        previewHint.textContent = `Yay Sidhi! ${L} is for ${word}! 🌸`;
        speak(`Good job Sidhi! ${L} is for ${word}.`);
      } else {
        btn.classList.add('wrong');
        previewHint.textContent = `Oops! It's ${L} for ${word}.`;
        speak(`Try again, Sidhi! ${L} is for ${word}.`);
      }
    });
    opts.appendChild(btn);
  });

  const nextQ = document.createElement('button');
  nextQ.textContent = 'Next Question';
  nextQ.addEventListener('click', startQuiz);

  quizCard.append(title, qEmoji, opts, nextQ);
  quizArea.appendChild(quizCard);

  previewEmoji.textContent = emoji;
  previewLetter.textContent = L;
  previewWord.textContent = word;
  previewHint.textContent = 'Can you tell which letter this is, Sidhi?';
  speak(`Which letter is this, Sidhi? ${word}`);
}

// Initialize
renderGrid();
selectLetter(0);
