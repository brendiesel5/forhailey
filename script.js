document.addEventListener('DOMContentLoaded', () => {

  /* Floating background emojis */
  const EMOJIS = [
    '🍓', '❤️', '🐒', '❤️', '🐒', '🍓',
    '🐒', '🎂', '🐒', '🐒', '💩', '🐒',
    '❤️', '💩', '❤️', '❤️', '❤️', '❤️',
    '🐒', '🐒', '🐒', '🐒', '🐒', '🐒',
    '🎂', '🍓', '🎂', '🍓', '🎂', '🍓',
    '❤️', '🐒', '❤️', '🐒', '🎂', '💩',
  ];

  const bg = document.createElement('div');
  bg.className = 'floating-bg';
  document.body.prepend(bg);

  EMOJIS.forEach((emoji) => {
    const el = document.createElement('span');
    el.className = 'float-emoji';
    el.textContent = emoji;

    el.style.left     = `${Math.random() * 96}%`;
    el.style.top      = `${Math.random() * 96}%`;
    el.style.fontSize = `${1.6 + Math.random() * 2}rem`;

    const duration = 4 + Math.random() * 7;
    const delay    = -(Math.random() * 10);
    el.style.animationDuration = `${duration}s`;
    el.style.animationDelay   = `${delay}s`;

    bg.appendChild(el);
  });


  document.querySelectorAll('.photo').forEach((img) => {
    img.addEventListener('error', function () {
      const ph = document.createElement('div');
      ph.className = 'photo-placeholder';
      ph.textContent = '📷';
      this.replaceWith(ph);
    });
  });


  /* Intro state machine + audio */
  const intro    = document.getElementById('intro');
  const introMsg = document.getElementById('intro-msg');
  const audio    = document.getElementById('bg-audio');
  const pop      = document.getElementById('pop-audio');

  function playPop() {
    pop.currentTime = 0;
    pop.play().catch(() => {});
  }

  document.querySelectorAll('.intro-char, .page-char').forEach(img => {
    img.addEventListener('error', function () { this.style.visibility = 'hidden'; });
  });

  const PHASES = [
    { show: 'oggo',       msg: 'Woah :O Hi Oggo!!',                                tension: false },
    { show: 'babychichi', msg: 'My friends!!! Babychichi!!',                        tension: false },
    { show: 'duck',       msg: 'Engarde! Engarde!',                                 tension: false },
    { show: 'brendan',    msg: 'Hi Brendan! But where is my\nbest friend, Hailey?', tension: false },
    { show: null,         msg: '...',                                               tension: true  },
    { show: null,         msg: '......',                                            tension: true  },
    { show: null,         msg: '..........',                                        tension: true  },
  ];

  let phase = 0;

  function advanceIntro() {
    playPop();
    if (phase < PHASES.length) {
      const p = PHASES[phase++];

      if (p.show) {
        const el = document.getElementById('char-' + p.show);
        if (el) el.classList.add('show');
      }

      introMsg.classList.remove('tension');
      void introMsg.offsetWidth;
      introMsg.textContent = p.msg;
      if (p.tension) introMsg.classList.add('tension');

    } else {
      intro.removeEventListener('click', advanceIntro);
      introMsg.classList.remove('tension');
      void introMsg.offsetWidth;
      introMsg.textContent = 'There she is!!';
      introMsg.style.color = '#fff';

      setTimeout(() => {
        intro.classList.add('falling');
        audio.play().catch(() => {});
      }, 600);


      intro.addEventListener('animationend', () => {
        intro.remove();
        // Stagger-fade each character into the page header
        document.querySelectorAll('.page-char').forEach((el, i) => {
          setTimeout(() => el.classList.add('visible'), i * 180);
        });
      }, { once: true });
    }
  }

  intro.addEventListener('click', advanceIntro);


  /* Scroll-reveal cards */
  const cards = document.querySelectorAll('.card');
  const obs = new IntersectionObserver(
    (entries) => entries.forEach((e) => {
      if (e.isIntersecting) e.target.classList.add('visible');
    }),
    { threshold: 0.15 }
  );
  cards.forEach((c) => obs.observe(c));

});
