
/* ═══════════════════════════════════════════════════════
   ✏️  EDITABLE CONTENT — change anything in this block
   ═══════════════════════════════════════════════════════ */
const LETTER_TEXT = `‎Happy Monthsary Honey Pangooo, this is my first time honey na gagawa ng letter tinangal mo angas ko ah. 
‎
‎Thankyou dahil lagi ka nandyan isa ka sa mga naging inspiration ko kaya ko pinupush sarili ko to be better pa and isipin mo tagal nadin natin tandang tanda ko pa pag first move mo sakin tangal angas mo noh HAHAHAHAHA. Lakas mo pag nag notes ng "bakit ngayon lang sya dumating lord" tapos nag bebed time story pa tayo. 
‎
‎Alam mo ba honey sobrang thankful ko na ikaw naging gf ko sinasabi ko nga dun sa 2nd mother ko na di kita kaya i let go hihi. mwuah sana di kana laging saltikin and ready ka po sana na samahan ako hanggang dulo and don't worry Honey Pangooooo,dito lang ako palagi pag kailangan moko okie tandaan mo mahal na mahal kita. Soon magkikita din tayo and magkasama na natin bubuohin mga pangarap natin. 
‎
‎Honey Pangooo I love you so muchhhhhhhhhhhhhhhh. ikaw lang luluhuran aasawahin pagsisilbihannnnn.`;

/* ─── GALLERY IMAGES ───────────────────────────────────
   Replace these with your own image URLs or relative paths.
   You can also use: URL.createObjectURL() for local files.
   ──────────────────────────────────────────────────── */
const GALLERY = [
  { src: "Messenger_creation_9D5483DD-A866-4E4F-8780-D4B0C0E738B8.jpg", caption: "Sarap luluhuran" },
  { src: "FB_IMG_1781187558429.jpg", caption: "BE READY HONEYYYYYYY" },
  { src: "Messenger_creation_FFA323AB-13E2-43A2-AC12-CEBB34012C34.jpg", caption: "Golden hours 🌅" },
  { src: "Messenger_creation_07772622-06CE-4503-8A36-954ED597E6CE.jpg", caption: "MWUAHHHHHHHH Dyan tayo sa hotel na yan soon hmmm" },
  { src: "Messenger_creation_248CC72A-9647-4836-B347-2C2310FA9673.jpg", caption: "Chinita My Honey" },
  { src: "Messenger_creation_2A2105E1-3A2A-4B46-80F3-5AA5E8656B5A.jpg", caption: "Fuck sarap mo " },
];
/* ══════════════════════════════════════════════════════ */


/* ─── POPUP ──────────────────────────────────────────── */
document.getElementById('openBtn').addEventListener('click', () => {
  const overlay = document.getElementById('popup-overlay');
  const main    = document.getElementById('main-content');
  overlay.classList.add('hidden');
  main.classList.add('visible');
  spawnHearts();
  startTypewriter();
});

/* ─── FLOATING HEARTS ───────────────────────────────── */
const HEART_CHARS = ['❤️','💕','💗','💖','💓','🌸','✨'];

function spawnHearts() {
  const container = document.getElementById('heartsBg');
  let count = 0;
  const total = 28;

  (function next() {
    if (count >= total) return;
    const el = document.createElement('span');
    el.className = 'heart-particle';
    el.textContent = HEART_CHARS[Math.floor(Math.random() * HEART_CHARS.length)];
    const size = 0.8 + Math.random() * 1.4;
    el.style.cssText = `
      left: ${Math.random() * 100}%;
      font-size: ${size}rem;
      animation-duration: ${7 + Math.random() * 12}s;
      animation-delay: ${Math.random() * 4}s;
    `;
    container.appendChild(el);
    count++;
    setTimeout(next, 320);
  })();

  // continuous drizzle
  setInterval(() => {
    const el = document.createElement('span');
    el.className = 'heart-particle';
    el.textContent = HEART_CHARS[Math.floor(Math.random() * HEART_CHARS.length)];
    const size = 0.7 + Math.random() * 1.2;
    el.style.cssText = `
      left: ${Math.random() * 100}%;
      font-size: ${size}rem;
      animation-duration: ${9 + Math.random() * 10}s;
      animation-delay: 0s;
    `;
    container.appendChild(el);
    setTimeout(() => el.remove(), 22000);
  }, 1800);
}

/* ─── TYPEWRITER ────────────────────────────────────── */
function startTypewriter() {
  const el = document.getElementById('letterText');
  const text = LETTER_TEXT;
  let i = 0;
  el.innerHTML = '<span class="cursor"></span>';
  const cursor = el.querySelector('.cursor');

  function type() {
    if (i < text.length) {
      cursor.before(document.createTextNode(text[i]));
      i++;
      setTimeout(type, i < 60 ? 28 : 18);
    } else {
      cursor.remove();
    }
  }
  setTimeout(type, 1400);
}

/* ─── 3D CAROUSEL ───────────────────────────────────── */
(function initCarousel() {
  const ring  = document.getElementById('carouselRing');
  const scene = document.getElementById('carouselScene');
  const nav   = document.getElementById('carouselNav');
  const N     = GALLERY.length;
  const CARD_W = ring.offsetWidth || 240;
  const radius = Math.round(CARD_W / (2 * Math.tan(Math.PI / N))) + 40;

  // build cards
  GALLERY.forEach((item, i) => {
    const card = document.createElement('div');
    card.className = 'carousel-card';
    card.innerHTML = `<img src="${item.src}" alt="${item.caption}" loading="lazy">
      <p class="card-caption">${item.caption}</p>`;
    card.style.transform = `rotateY(${(360 / N) * i}deg) translateZ(${radius}px)`;
    ring.appendChild(card);

    const dot = document.createElement('button');
    dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', `Go to memory ${i + 1}`);
    dot.addEventListener('click', () => goTo(i));
    nav.appendChild(dot);
  });

  let angle = 0;
  let targetAngle = 0;
  let raf = null;
  let paused = false;
  let current = 0;

  function goTo(idx) {
    targetAngle = -(360 / N) * idx;
    current = idx;
    nav.querySelectorAll('.carousel-dot').forEach((d, i) => d.classList.toggle('active', i === idx));
  }

  function lerp(a, b, t) { return a + (b - a) * t; }

  function tick() {
    if (!paused) {
      targetAngle -= 0.28;
      // snap current dot
      const snapped = Math.round((-targetAngle % 360 + 360) % 360 / (360 / N)) % N;
      if (snapped !== current) {
        current = snapped;
        nav.querySelectorAll('.carousel-dot').forEach((d, i) => d.classList.toggle('active', i === current));
      }
    }
    angle = lerp(angle, targetAngle, 0.045);
    ring.style.transform = `rotateY(${angle}deg)`;
    raf = requestAnimationFrame(tick);
  }
  tick();

  scene.addEventListener('mouseenter', () => { paused = true; });
  scene.addEventListener('mouseleave', () => { paused = false; });

  // touch/drag
  let dragStart = null;
  let dragAngle = 0;
  scene.addEventListener('pointerdown', e => { dragStart = e.clientX; dragAngle = targetAngle; scene.setPointerCapture(e.pointerId); });
  scene.addEventListener('pointermove', e => {
    if (dragStart === null) return;
    const dx = e.clientX - dragStart;
    targetAngle = dragAngle + dx * 0.35;
  });
  scene.addEventListener('pointerup', () => { dragStart = null; });
})();

/* ─── SCROLL REVEAL ─────────────────────────────────── */
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in-view'); } });
}, { threshold: 0.15 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

/* ─── SCROLL-TO-TOP ─────────────────────────────────── */
const scrollBtn = document.getElementById('scrollTop');
window.addEventListener('scroll', () => scrollBtn.classList.toggle('show', scrollY > 400));
scrollBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
