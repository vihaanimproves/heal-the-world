/* ============================================================
   healtheworld.in — main.js
   Handles: nav, scroll reveal, media streaming
   ============================================================ */

// ── CONFIG ─────────────────────────────────────────────────
// Replace with your Cloudflare R2 public bucket base URL:
//   e.g. https://pub-XXXXXXXXXXXXXXXX.r2.dev
const MEDIA_BASE_URL = 'https://YOUR_R2_PUBLIC_URL'; // ← REPLACE THIS

// ── MEDIA MANIFEST ─────────────────────────────────────────
// Audio filenames match what exists on your R2 bucket.
const AUDIO_FILES = [
  { id:'a1', title:'Thought Process',                      subtitle:'The driving force of your life',                                     file:'Thought_Process-YourDailyLife.blog_.mp3' },
  { id:'a2', title:'Why Do We Sleep and Dream?',           subtitle:'The mystery of sleep and dream revealed',                            file:'Why_Do_We_Sleep_And_Dream-YourDailyLife.blog_.mp3' },
  { id:'a3', title:'Understanding Awareness',              subtitle:'On the meaning of the term awareness',                               file:'Understanding_Awareness-YourDailyLife.blog_-1.mp3' },
  { id:'a4', title:'Thinking in Language',                 subtitle:'How we use language to manage information',                          file:'Thinking_In_Language-YourDailyLife.blog_.mp3' },
  { id:'a5', title:'Difference Between Male and Female Brains', subtitle:'First explanation based on natural selection',                  file:'Difference_Between_Male_And_Female_Brains-YourDailyLife.blog_.mp3' },
  { id:'a6', title:'I Am Better Than You',                 subtitle:'One of the most significant mechanisms driving the human mind',      file:'I_Am_Better_Than_You-YourDailyLife.blog_.mp3' },
  { id:'a7', title:'Can Your Legs Do the Thinking?',       subtitle:'The mystery behind fidgeting behaviour',                            file:'Can_Your_Legs_Do_The_Thinking-YourDailyLife.blog_.mp3' },
  { id:'a8', title:'What is Degree of Attention?',         subtitle:'What happens when you pay more attention to something',              file:'What_Is_Degree_Of_Attention-YourDailyLife.blog_.mp3' },
  { id:'a9', title:'How Does Meditation Work?',            subtitle:'The truth about meditation',                                        file:'How_Does_Meditation_Work-YourDailyLife.blog_.mp3' },
];

// Video filenames — update these to match exactly what you uploaded to R2
const VIDEO_FILES = [
  { id:'v1', title:'Thought Process',                      subtitle:'Full explanation of the thought process mechanism',                  file:'Thought_Process.mp4' },
  { id:'v2', title:'How Mind Emerges from the Brain',      subtitle:'The fundamentals of the DOS Model',                                  file:'How_Mind_Emerges.mp4' },
  { id:'v3', title:'Understanding Awareness',              subtitle:'Mechanism behind awareness explained visually',                      file:'Understanding_Awareness.mp4' },
  { id:'v4', title:'How Does Meditation Work?',            subtitle:'The science behind all meditation techniques',                       file:'How_Meditation_Works.mp4' },
  { id:'v5', title:'The Optimizing Aspect of Natural Selection', subtitle:'The driving force behind all human behaviour',                 file:'Optimizing_Natural_Selection.mp4' },
];

// ── NAV SCROLL ─────────────────────────────────────────────
function initNav() {} // colour override removed

// ── SCROLL REVEAL ──────────────────────────────────────────
function initReveal() {
  var els = document.querySelectorAll('.reveal');
  if (!els.length) return;
  var obs = new IntersectionObserver(function(entries) {
    entries.forEach(function(e) {
      if (e.isIntersecting) {
        e.target.classList.add('in-view');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });
  els.forEach(function(el) { obs.observe(el); });
}

// ── BUILD MEDIA PAGE ───────────────────────────────────────
function buildMedia() {
  var aList = document.getElementById('audio-list');
  var vList = document.getElementById('video-list');
  if (!aList && !vList) return;

  if (aList) AUDIO_FILES.forEach(function(item, i) {
    aList.appendChild(makeItem(item, 'audio', i + 1));
  });

  if (vList) VIDEO_FILES.forEach(function(item, i) {
    vList.appendChild(makeItem(item, 'video', i + 1));
  });
}

function makeItem(item, type, index) {
  var div = document.createElement('div');
  div.className = 'media-item';
  div.setAttribute('role', 'listitem');
  div.dataset.id   = item.id;
  div.dataset.type = type;

  var playIcon = '<svg width="13" height="13" viewBox="0 0 16 16" fill="currentColor"><path d="M3 2.5l10 5.5-10 5.5V2.5z"/></svg>';
  var arrowIcon = '<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" class="media-item__arrow"><path d="M4.646 1.646a.5.5 0 01.708 0l6 6a.5.5 0 010 .708l-6 6a.5.5 0 01-.708-.708L10.293 8 4.646 2.354a.5.5 0 010-.708z"/></svg>';
  var badge = type === 'audio'
    ? '<span class="media-item__badge badge-audio">Audio</span>'
    : '<span class="media-item__badge badge-video">Video</span>';

  if (type === 'audio') {
    div.innerHTML =
      '<div class="media-item__btn" aria-hidden="true">' + playIcon + '</div>' +
      '<span class="media-item__num">' + (index < 10 ? '0' + index : index) + '</span>' +
      '<div class="media-item__info">' +
        '<div class="media-item__title">' + item.title + '</div>' +
        '<div class="media-item__meta">' + badge + '<span>' + item.subtitle + '</span></div>' +
      '</div>' +
      arrowIcon;
    div.addEventListener('click', function() { handleAudio(div, item); });

  } else {
    // Video: click toggles inline player
    div.innerHTML =
      '<div class="media-item__btn" aria-hidden="true">' + playIcon + '</div>' +
      '<span class="media-item__num">' + (index < 10 ? '0' + index : index) + '</span>' +
      '<div class="media-item__info">' +
        '<div class="media-item__title">' + item.title + '</div>' +
        '<div class="media-item__meta">' + badge + '<span>' + item.subtitle + '</span></div>' +
      '</div>' +
      arrowIcon;

    // Inline player wrapper — lives INSIDE the item but below the row
    div.style.flexWrap = 'wrap';
    var playerWrap = document.createElement('div');
    playerWrap.className = 'media-item__player';
    playerWrap.id = 'player-' + item.id;
    var vid = document.createElement('video');
    vid.controls = true;
    vid.preload  = 'none';
    vid.setAttribute('controlsList', 'nodownload');
    var src = document.createElement('source');
    src.src  = MEDIA_BASE_URL + '/' + item.file;
    src.type = 'video/mp4';
    vid.appendChild(src);
    playerWrap.appendChild(vid);
    div.appendChild(playerWrap);

    // Click only on the top row part
    div.addEventListener('click', function(e) {
      if (e.target.closest('.media-item__player')) return;
      handleVideo(div, vid, playerWrap);
    });
  }

  return div;
}

// ── AUDIO LOGIC ────────────────────────────────────────────
var _curAudioEl   = null;
var _curAudioItem = null;

function handleAudio(itemEl, item) {
  // Toggle if same item
  if (itemEl.classList.contains('playing') && _curAudioEl) {
    _curAudioEl.paused ? _curAudioEl.play() : _curAudioEl.pause();
    return;
  }
  stopAll();

  itemEl.classList.add('playing');

  var titleEl    = document.getElementById('player-title');
  var typeEl     = document.getElementById('player-type');
  var controlsEl = document.getElementById('player-controls');

  titleEl.textContent = item.title;
  typeEl.textContent  = 'Audio Episode';
  controlsEl.innerHTML = '';

  var audio = document.createElement('audio');
  audio.controls = true;
  audio.preload  = 'none';
  audio.style.width = '100%';
  audio.style.height = '34px';
  audio.style.accentColor = '#2EC4B6';
  var src = document.createElement('source');
  src.src  = MEDIA_BASE_URL + '/' + item.file;
  src.type = 'audio/mpeg';
  audio.appendChild(src);
  audio.addEventListener('ended', function() {
    itemEl.classList.remove('playing');
    hideBar();
  });
  controlsEl.appendChild(audio);

  _curAudioEl   = audio;
  _curAudioItem = itemEl;
  showBar();
  audio.play().catch(function() {});
}

// ── VIDEO LOGIC ────────────────────────────────────────────
function handleVideo(itemEl, vid, playerWrap) {
  var isOpen = playerWrap.classList.contains('open');

  // Close all videos
  document.querySelectorAll('.media-item__player.open').forEach(function(p) {
    var v = p.querySelector('video');
    if (v) v.pause();
    p.classList.remove('open');
    p.closest('.media-item').classList.remove('playing');
  });
  stopAudio();

  if (!isOpen) {
    playerWrap.classList.add('open');
    itemEl.classList.add('playing');
    vid.play().catch(function() {});
    setTimeout(function() {
      itemEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 80);
  }
}

// ── STOP / SHOW / HIDE ─────────────────────────────────────
function stopAudio() {
  if (_curAudioEl) { _curAudioEl.pause(); _curAudioEl = null; }
  if (_curAudioItem) { _curAudioItem.classList.remove('playing'); _curAudioItem = null; }
  hideBar();
}

function stopAll() {
  stopAudio();
  document.querySelectorAll('.media-item__player.open').forEach(function(p) {
    var v = p.querySelector('video');
    if (v) v.pause();
    p.classList.remove('open');
    p.closest('.media-item').classList.remove('playing');
  });
}

function showBar() {
  var bar = document.getElementById('player-bar');
  if (bar) bar.classList.add('visible');
}

function hideBar() {
  var bar = document.getElementById('player-bar');
  if (bar) bar.classList.remove('visible');
}

function initCloseBtn() {
  var btn = document.getElementById('player-close');
  if (btn) btn.addEventListener('click', stopAudio);
}

// ── INIT ───────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', function() {
  initNav();
  initReveal();
  buildMedia();
  initCloseBtn();
});
