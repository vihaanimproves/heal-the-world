/* ============================================================
   healtheworld.in — main.js
   Handles: nav scroll, reveal animations, media streaming
   ============================================================ */

// -------------------------------------------------------
// CONFIG — Replace MEDIA_BASE_URL with your Cloudflare R2
// public bucket base URL, e.g.:
//   https://pub-XXXXXXXXXXXXXXXX.r2.dev
// -------------------------------------------------------
const MEDIA_BASE_URL = 'https://YOUR_R2_PUBLIC_URL';  // ← REPLACE THIS

// -------------------------------------------------------
// MEDIA MANIFEST
// File names should match exactly what you uploaded to R2.
// -------------------------------------------------------
const AUDIO_FILES = [
  {
    id: 'a1',
    title: 'Thought Process',
    subtitle: 'The driving force of your life',
    file: 'Thought_Process-YourDailyLife.blog_.mp3',
  },
  {
    id: 'a2',
    title: 'Why Do We Sleep and Dream?',
    subtitle: 'The mystery of sleep and dream revealed',
    file: 'Why_Do_We_Sleep_And_Dream-YourDailyLife.blog_.mp3',
  },
  {
    id: 'a3',
    title: 'Understanding Awareness',
    subtitle: 'On the meaning of the term awareness',
    file: 'Understanding_Awareness-YourDailyLife.blog_-1.mp3',
  },
  {
    id: 'a4',
    title: 'Thinking in Language',
    subtitle: 'How we use language to manage information',
    file: 'Thinking_In_Language-YourDailyLife.blog_.mp3',
  },
  {
    id: 'a5',
    title: 'Difference Between Male and Female Brains',
    subtitle: 'First ever explanation based on natural selection',
    file: 'Difference_Between_Male_And_Female_Brains-YourDailyLife.blog_.mp3',
  },
  {
    id: 'a6',
    title: 'I Am Better Than You',
    subtitle: 'One of the most significant mechanisms driving the human mind',
    file: 'I_Am_Better_Than_You-YourDailyLife.blog_.mp3',
  },
  {
    id: 'a7',
    title: 'Can Your Legs Do the Thinking?',
    subtitle: 'The mystery behind fidgeting behaviour',
    file: 'Can_Your_Legs_Do_The_Thinking-YourDailyLife.blog_.mp3',
  },
  {
    id: 'a8',
    title: 'What is Degree of Attention?',
    subtitle: 'What happens when you pay more attention to something',
    file: 'What_Is_Degree_Of_Attention-YourDailyLife.blog_.mp3',
  },
  {
    id: 'a9',
    title: 'How Does Meditation Work?',
    subtitle: 'The truth about meditation',
    file: 'How_Does_Meditation_Work-YourDailyLife.blog_.mp3',
  },
];

const VIDEO_FILES = [
  {
    id: 'v1',
    title: 'Thought Process',
    subtitle: 'Full explanation of the thought process mechanism',
    file: 'Thought_Process.mp4',         // ← update filenames to match R2
  },
  {
    id: 'v2',
    title: 'How Mind Emerges from the Brain',
    subtitle: 'The fundamentals of the DOS Model',
    file: 'How_Mind_Emerges.mp4',
  },
  {
    id: 'v3',
    title: 'Understanding Awareness',
    subtitle: 'Mechanism behind awareness explained',
    file: 'Understanding_Awareness.mp4',
  },
  {
    id: 'v4',
    title: 'How Does Meditation Work?',
    subtitle: 'The science behind all meditation techniques',
    file: 'How_Meditation_Works.mp4',
  },
  {
    id: 'v5',
    title: 'The Optimizing Aspect of Natural Selection',
    subtitle: 'The driving force behind all human behaviour',
    file: 'Optimizing_Natural_Selection.mp4',
  },
];

// -------------------------------------------------------
// NAV SCROLL BEHAVIOUR
// -------------------------------------------------------
function initNavScroll() {
  const nav = document.querySelector('.nav');
  if (!nav) return;

  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const current = window.scrollY;

    if (current > 60) {
      nav.style.background = 'rgba(9, 13, 24, 0.97)';
    } else {
      nav.style.background = 'rgba(9, 13, 24, 0.85)';
    }

    // Highlight active nav link based on URL
    const path = window.location.pathname;
    document.querySelectorAll('.nav__link').forEach(link => {
      link.classList.remove('active');
      const href = link.getAttribute('href') || '';
      if (path.endsWith('index.html') || path === '/' || path === '') {
        if (href === 'index.html' || href === './') link.classList.add('active');
      }
      if (path.includes('media') && href.includes('media')) {
        link.classList.add('active');
      }
    });

    lastScroll = current;
  }, { passive: true });
}

// -------------------------------------------------------
// SCROLL REVEAL
// -------------------------------------------------------
function initReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  els.forEach(el => observer.observe(el));
}

// -------------------------------------------------------
// MEDIA PAGE — Build DOM
// -------------------------------------------------------
function buildMediaPage() {
  const audioContainer = document.getElementById('audio-list');
  const videoContainer = document.getElementById('video-list');
  if (!audioContainer && !videoContainer) return;

  // Build audio items
  if (audioContainer) {
    AUDIO_FILES.forEach(item => {
      audioContainer.appendChild(createMediaItem(item, 'audio'));
    });
  }

  // Build video items
  if (videoContainer) {
    VIDEO_FILES.forEach(item => {
      videoContainer.appendChild(createMediaItem(item, 'video'));
    });
  }
}

function createMediaItem(item, type) {
  const div = document.createElement('div');
  div.className = 'media-item';
  div.dataset.id = item.id;
  div.dataset.type = type;
  div.dataset.file = item.file;
  div.dataset.title = item.title;

  const playIcon = type === 'audio'
    ? `<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M3 2.5l10 5.5-10 5.5V2.5z"/></svg>`
    : `<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M2 3a1 1 0 011-1h10a1 1 0 011 1v10a1 1 0 01-1 1H3a1 1 0 01-1-1V3zm1.5 1v8h9V4h-9z"/><path d="M6 6.5l4 1.5-4 1.5V6.5z"/></svg>`;

  const badge = type === 'audio'
    ? `<span class="media-item__badge media-item__badge--audio">
        <svg width="10" height="10" viewBox="0 0 16 16" fill="currentColor"><path d="M9.5 1a.5.5 0 01.5.5v13a.5.5 0 01-.5.5h-3a.5.5 0 01-.5-.5v-13a.5.5 0 01.5-.5h3zm-3.5 2h3v10H6V3zm7-1.5a.5.5 0 01.5.5v11a.5.5 0 01-.5.5h-1a.5.5 0 01-.5-.5V2a.5.5 0 01.5-.5h1zM3 4a.5.5 0 01.5.5v7a.5.5 0 01-.5.5H2a.5.5 0 01-.5-.5V4.5A.5.5 0 012 4h1z"/></svg>
        Audio
       </span>`
    : `<span class="media-item__badge media-item__badge--video">
        <svg width="10" height="10" viewBox="0 0 16 16" fill="currentColor"><path d="M0 1a1 1 0 011-1h14a1 1 0 011 1v14a1 1 0 01-1 1H1a1 1 0 01-1-1V1zm4 0v14h8V1H4zm-3 1h2v2H1V2zm0 4h2v2H1V6zm0 4h2v2H1v-2zm12-8h2v2h-2V2zm0 4h2v2h-2V6zm0 4h2v2h-2v-2z"/></svg>
        Video
       </span>`;

  if (type === 'audio') {
    div.innerHTML = `
      <div class="media-item__play">${playIcon}</div>
      <div class="media-item__info">
        <div class="media-item__title">${item.title}</div>
        <div class="media-item__sub">${badge} <span>${item.subtitle}</span></div>
      </div>
    `;
    div.addEventListener('click', () => handleAudioClick(div, item));
  } else {
    div.innerHTML = `
      <div class="media-item__top" style="display:flex;align-items:center;gap:20px;width:100%;">
        <div class="media-item__play">${playIcon}</div>
        <div class="media-item__info">
          <div class="media-item__title">${item.title}</div>
          <div class="media-item__sub">${badge} <span>${item.subtitle}</span></div>
        </div>
      </div>
      <div class="media-item__video-player" id="player-${item.id}">
        <video controls preload="none" controlsList="nodownload">
          <source src="${MEDIA_BASE_URL}/${item.file}" type="video/mp4">
          Your browser does not support HTML5 video.
        </video>
      </div>
    `;
    div.style.flexDirection = 'column';
    div.style.alignItems = 'stretch';
    div.querySelector('.media-item__top').addEventListener('click', () => handleVideoClick(div, item));
  }

  return div;
}

// -------------------------------------------------------
// AUDIO PLAYER BAR
// -------------------------------------------------------
let currentAudioEl = null;
let currentAudioItem = null;

function handleAudioClick(itemEl, item) {
  const allItems = document.querySelectorAll('.media-item');

  // If clicking the already-playing item, toggle pause
  if (itemEl.classList.contains('playing') && currentAudioEl) {
    if (currentAudioEl.paused) {
      currentAudioEl.play();
    } else {
      currentAudioEl.pause();
    }
    return;
  }

  // Stop anything currently playing
  stopAllMedia();

  // Mark this item as playing
  allItems.forEach(el => el.classList.remove('playing'));
  itemEl.classList.add('playing');

  // Build or reuse audio in player bar
  const playerBar = document.getElementById('player-bar');
  const playerControls = document.getElementById('player-controls');
  const playerTitle = document.getElementById('player-title');
  const playerType = document.getElementById('player-type');

  playerTitle.textContent = item.title;
  playerType.textContent = 'Audio';

  // Remove old audio
  playerControls.innerHTML = '';

  const audio = document.createElement('audio');
  audio.controls = true;
  audio.preload = 'none';
  audio.style.width = '100%';
  audio.style.accentColor = 'var(--gold)';

  const source = document.createElement('source');
  source.src = `${MEDIA_BASE_URL}/${item.file}`;
  source.type = 'audio/mpeg';
  audio.appendChild(source);

  audio.addEventListener('ended', () => {
    itemEl.classList.remove('playing');
    hidePlayerBar();
  });

  playerControls.appendChild(audio);
  currentAudioEl = audio;
  currentAudioItem = itemEl;

  showPlayerBar();
  audio.play().catch(() => {
    // autoplay blocked — user must press play manually
  });
}

// -------------------------------------------------------
// VIDEO PLAYER (inline)
// -------------------------------------------------------
function handleVideoClick(itemEl, item) {
  const playerEl = itemEl.querySelector('.media-item__video-player');
  const allPlayers = document.querySelectorAll('.media-item__video-player');
  const allItems = document.querySelectorAll('.media-item');

  // If this player is already visible, toggle
  if (playerEl.classList.contains('visible')) {
    const vid = playerEl.querySelector('video');
    if (vid) vid.pause();
    playerEl.classList.remove('visible');
    itemEl.classList.remove('playing');
    return;
  }

  // Close all other players first
  allPlayers.forEach(p => {
    const v = p.querySelector('video');
    if (v) v.pause();
    p.classList.remove('visible');
  });
  allItems.forEach(el => el.classList.remove('playing'));

  // Stop audio if playing
  stopAllAudio();

  // Open this player
  playerEl.classList.add('visible');
  itemEl.classList.add('playing');

  // Start playback
  const vid = playerEl.querySelector('video');
  if (vid) {
    vid.play().catch(() => {});
  }

  // Scroll into view
  setTimeout(() => {
    itemEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, 100);
}

// -------------------------------------------------------
// PLAYER BAR CONTROLS
// -------------------------------------------------------
function showPlayerBar() {
  const bar = document.getElementById('player-bar');
  if (bar) bar.classList.add('visible');
}

function hidePlayerBar() {
  const bar = document.getElementById('player-bar');
  if (bar) bar.classList.remove('visible');
}

function stopAllAudio() {
  if (currentAudioEl) {
    currentAudioEl.pause();
    currentAudioEl = null;
  }
  if (currentAudioItem) {
    currentAudioItem.classList.remove('playing');
    currentAudioItem = null;
  }
  hidePlayerBar();
}

function stopAllMedia() {
  stopAllAudio();
  // Stop all inline videos
  document.querySelectorAll('.media-item__video-player video').forEach(v => v.pause());
  document.querySelectorAll('.media-item__video-player').forEach(p => p.classList.remove('visible'));
  document.querySelectorAll('.media-item').forEach(el => el.classList.remove('playing'));
}

function initPlayerBarClose() {
  const closeBtn = document.getElementById('player-close');
  if (!closeBtn) return;
  closeBtn.addEventListener('click', () => {
    stopAllAudio();
  });
}

// -------------------------------------------------------
// INIT
// -------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  initNavScroll();
  initReveal();
  buildMediaPage();
  initPlayerBarClose();

  // Set active nav link
  const path = window.location.pathname;
  document.querySelectorAll('.nav__link').forEach(link => {
    const href = link.getAttribute('href') || '';
    if (
      (href.includes('index') && (path === '/' || path.endsWith('index.html') || path === '')) ||
      (href.includes('media') && path.includes('media'))
    ) {
      link.classList.add('active');
    }
  });
});
