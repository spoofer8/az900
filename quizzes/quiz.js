(function() {
  const QUESTIONS = window.QUIZ_QUESTIONS || [];
  const META = window.QUIZ_META || { title: 'Quiz', code: '', domain: '' };

  const state = {
    filter: 'all',
    filtered: [],
    current: 0,
    answers: [],
    completed: false,
  };

  const $ = sel => document.querySelector(sel);
  const $$ = sel => Array.from(document.querySelectorAll(sel));

  function countByDifficulty() {
    return QUESTIONS.reduce((acc, q) => {
      acc[q.d] = (acc[q.d] || 0) + 1;
      return acc;
    }, { easy: 0, medium: 0, hard: 0 });
  }

  function shuffle(arr) {
    const out = arr.slice();
    for (let i = out.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [out[i], out[j]] = [out[j], out[i]];
    }
    return out;
  }

  function filterAndShuffle(questions, difficulty) {
    const filtered = difficulty === 'all'
      ? questions.slice()
      : questions.filter(q => q.d === difficulty);
    return shuffle(filtered);
  }

  function init() {
    if ($('#quiz-title')) $('#quiz-title').textContent = META.title;
    if ($('#quiz-code')) $('#quiz-code').textContent = META.code;
    if ($('#quiz-domain')) $('#quiz-domain').textContent = META.domain;
    if ($('#quiz-subtitle')) $('#quiz-subtitle').textContent = META.subtitle || '';

    const counts = countByDifficulty();
    const total = QUESTIONS.length;
    if ($('#count-easy')) $('#count-easy').textContent = counts.easy + ' questions';
    if ($('#count-medium')) $('#count-medium').textContent = counts.medium + ' questions';
    if ($('#count-hard')) $('#count-hard').textContent = counts.hard + ' questions';
    if ($('#count-all')) $('#count-all').textContent = total + ' questions';

    $$('.start-btn').forEach(btn => {
      btn.addEventListener('click', () => start(btn.dataset.difficulty));
    });

    $('#next-btn').addEventListener('click', next);
    $('#retry-btn').addEventListener('click', () => start(state.filter));
    $('#back-btn').addEventListener('click', () => {
      $('#results').style.display = 'none';
      $('#quiz').style.display = 'none';
      $('#setup').style.display = 'block';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  function start(difficulty) {
    state.filter = difficulty;
    state.filtered = filterAndShuffle(QUESTIONS, difficulty);
    state.current = 0;
    state.answers = new Array(state.filtered.length).fill(null);
    state.completed = false;

    $('#setup').style.display = 'none';
    $('#quiz').style.display = 'block';
    $('#results').style.display = 'none';

    renderQuestion();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function isCorrect(q, answer) {
    if (answer === null || answer === undefined) return false;
    return Array.isArray(q.a) ? q.a.includes(answer) : q.a === answer;
  }

  function renderQuestion() {
    const q = state.filtered[state.current];
    const answered = state.answers[state.current];

    $('#q-num').textContent = state.current + 1;
    $('#q-total').textContent = state.filtered.length;
    const chip = $('#q-difficulty');
    chip.textContent = q.d;
    chip.className = 'chip diff-' + q.d;
    $('#q-text').textContent = q.q;

    const pct = (state.current / state.filtered.length) * 100;
    $('#progress-fill').style.width = pct + '%';

    const opts = $('#q-options');
    opts.innerHTML = '';
    const letters = ['A', 'B', 'C', 'D', 'E', 'F'];
    q.o.forEach((optText, i) => {
      const btn = document.createElement('button');
      btn.className = 'option';
      btn.textContent = optText;
      btn.dataset.index = String(i);
      btn.dataset.letter = letters[i] || String(i + 1);

      if (answered !== null) {
        const correct = Array.isArray(q.a) ? q.a.includes(i) : q.a === i;
        if (correct) btn.classList.add('correct');
        if (i === answered && !correct) btn.classList.add('incorrect');
        if (i === answered) btn.classList.add('selected');
        btn.disabled = true;
      } else {
        btn.addEventListener('click', () => submit(i));
      }
      opts.appendChild(btn);
    });

    const feedback = $('#feedback');
    if (answered !== null) {
      feedback.style.display = 'block';
      const correct = isCorrect(q, answered);
      feedback.className = 'feedback ' + (correct ? 'correct' : 'incorrect');
      $('#feedback-verdict').textContent = correct ? 'Correct' : 'Incorrect';
      $('#feedback-explanation').textContent = q.e || '';
      $('#next-btn').style.display = 'inline-block';
      $('#next-btn').textContent = state.current === state.filtered.length - 1
        ? 'See results'
        : 'Next question';
    } else {
      feedback.style.display = 'none';
      $('#next-btn').style.display = 'none';
    }
  }

  function submit(index) {
    state.answers[state.current] = index;
    renderQuestion();
  }

  function next() {
    if (state.current === state.filtered.length - 1) {
      showResults();
    } else {
      state.current++;
      renderQuestion();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  function showResults() {
    state.completed = true;
    $('#quiz').style.display = 'none';
    $('#results').style.display = 'block';
    window.scrollTo({ top: 0, behavior: 'smooth' });

    const correct = state.answers.reduce((count, ans, i) => {
      return count + (isCorrect(state.filtered[i], ans) ? 1 : 0);
    }, 0);

    const pct = Math.round((correct / state.filtered.length) * 100);

    $('#score-num').textContent = correct;
    $('#score-total').textContent = state.filtered.length;
    $('#score-pct').textContent = pct + '%';

    const verdict = $('#score-verdict');
    if (pct >= 90) {
      verdict.textContent = 'Mastered. Exam-ready on this topic.';
      verdict.className = 'verdict great';
    } else if (pct >= 75) {
      verdict.textContent = 'Passing. Push harder for exam-day confidence.';
      verdict.className = 'verdict good';
    } else if (pct >= 60) {
      verdict.textContent = 'Some gaps. Re-read the notes and retry.';
      verdict.className = 'verdict ok';
    } else {
      verdict.textContent = 'Study the material fully and retry.';
      verdict.className = 'verdict low';
    }

    const review = $('#review');
    review.innerHTML = '';
    state.filtered.forEach((q, i) => {
      const ans = state.answers[i];
      const correct = isCorrect(q, ans);
      const correctIdx = Array.isArray(q.a) ? q.a[0] : q.a;
      const item = document.createElement('div');
      item.className = 'review-item ' + (correct ? 'correct' : 'incorrect');
      const yourAnswer = ans !== null && !correct
        ? `<div class="review-y">Your answer: ${escapeHtml(q.o[ans])}</div>`
        : '';
      const explanation = q.e ? `<div class="review-e">${escapeHtml(q.e)}</div>` : '';
      item.innerHTML =
        `<div class="review-header">` +
          `<span class="review-num">Q${i + 1}</span>` +
          `<span class="chip diff-${q.d}">${q.d}</span>` +
          `<span class="review-verdict">${correct ? '✓ correct' : '✗ incorrect'}</span>` +
        `</div>` +
        `<div class="review-q">${escapeHtml(q.q)}</div>` +
        `<div class="review-a">Correct: <strong>${escapeHtml(q.o[correctIdx])}</strong></div>` +
        yourAnswer +
        explanation;
      review.appendChild(item);
    });
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
