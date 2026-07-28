const root = document.documentElement;
const langButton = document.querySelector('.lang-toggle');
const projectList = Array.isArray(window.PORTFOLIO_PROJECTS)
  ? [...window.PORTFOLIO_PROJECTS].sort((a, b) => Number(a.order) - Number(b.order))
  : [];
const projects = Object.fromEntries(projectList.map((project) => [String(project.id), project]));

function readSavedLanguage() {
  try { return localStorage.getItem('portfolio-language'); } catch { return null; }
}

function setLanguage(lang) {
  root.dataset.lang = lang;
  root.lang = lang === 'zh' ? 'zh-CN' : 'en';
  try { localStorage.setItem('portfolio-language', lang); } catch { /* file preview may block storage */ }
  if (langButton) {
    langButton.querySelector('.lang-current').textContent = lang === 'zh' ? '中' : 'EN';
    langButton.querySelector('.lang-other').textContent = lang === 'zh' ? 'EN' : '中';
  }
}

setLanguage(readSavedLanguage() || 'zh');
langButton?.addEventListener('click', () => setLanguage(root.dataset.lang === 'zh' ? 'en' : 'zh'));

function createTextElement(tag, className, text) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  element.textContent = text || '';
  return element;
}

function applyPlaceholder(element, value) {
  const raw = String(value || '').trim();
  if (!raw) return;

  const isCssBackground = /^(?:#[0-9a-f]{3,8}|rgba?\(|hsla?\(|(?:linear|radial|conic)-gradient\(|var\()/i.test(raw);
  if (isCssBackground) {
    element.style.background = raw;
    return;
  }

  if (/^(?:javascript|data:text\/html):/i.test(raw)) return;
  const safePath = raw.replace(/\\/g, '/').replace(/["\r\n]/g, '');
  element.style.backgroundImage = `url("${safePath}")`;
  element.style.backgroundSize = 'cover';
  element.style.backgroundPosition = 'center';
  element.style.backgroundRepeat = 'no-repeat';
}

function createProjectCard(project, index) {
  const article = document.createElement('article');
  article.className = 'project-card reveal';
  const link = document.createElement('a');
  link.href = `project.html?id=${encodeURIComponent(project.id)}`;
  link.setAttribute('aria-label', `查看${project.zh}项目`);

  const visual = document.createElement('div');
  visual.className = `project-visual visual-${String((index % 6) + 1).padStart(2, '0')}`;
  applyPlaceholder(visual, project.placeholder);
  visual.appendChild(createTextElement('span', '', project.id));

  if (project.poster) {
    const cover = document.createElement('img');
    cover.className = 'project-cover';
    cover.alt = '';
    cover.loading = 'lazy';
    cover.addEventListener('load', () => cover.classList.add('is-ready'), { once: true });
    cover.addEventListener('error', () => cover.remove(), { once: true });
    cover.src = project.poster;
    visual.appendChild(cover);
  }

  const info = document.createElement('div');
  info.className = 'project-info';
  const text = document.createElement('div');
  text.appendChild(createTextElement('p', 'tag', project.tag));
  const title = document.createElement('h2');
  const zh = createTextElement('span', '', project.zh);
  const en = createTextElement('span', '', project.en);
  zh.setAttribute('data-zh', '');
  en.setAttribute('data-en', '');
  title.append(zh, en);
  text.appendChild(title);
  info.append(text, createTextElement('p', '', `${project.year} ↗`));
  link.append(visual, info);
  article.appendChild(link);
  return article;
}

function addHoverPreview(card, project) {
  if (!project.video || !matchMedia('(pointer:fine)').matches) return;
  const visual = card.querySelector('.project-visual');
  const link = card.querySelector('a');
  const video = document.createElement('video');
  video.className = 'project-preview';
  video.muted = true;
  video.loop = true;
  video.playsInline = true;
  video.preload = 'none';
  video.setAttribute('aria-hidden', 'true');
  video.addEventListener('canplay', () => video.classList.add('is-ready'), { once: true });
  video.addEventListener('error', () => video.classList.remove('is-ready'));
  visual.appendChild(video);

  const play = () => {
    if (!video.src) { video.src = project.video; video.load(); }
    card.classList.add('is-previewing');
    video.play().catch(() => card.classList.remove('is-previewing'));
  };
  const stop = () => {
    card.classList.remove('is-previewing');
    video.pause();
    if (video.readyState > 0) video.currentTime = 0;
  };
  card.addEventListener('pointerenter', play);
  card.addEventListener('pointerleave', stop);
  link.addEventListener('focus', play);
  link.addEventListener('blur', stop);
}

if (!document.body.classList.contains('project-page')) {
  const grid = document.querySelector('.project-grid');
  if (grid) {
    grid.replaceChildren();
    projectList.forEach((project, index) => {
      const card = createProjectCard(project, index);
      grid.appendChild(card);
      addHoverPreview(card, project);
    });
  }
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));

const cursor = document.querySelector('.cursor-orb');
if (cursor && matchMedia('(pointer:fine)').matches) {
  window.addEventListener('mousemove', (event) => {
    cursor.style.opacity = '1';
    cursor.style.left = `${event.clientX}px`;
    cursor.style.top = `${event.clientY}px`;
  });
  document.querySelectorAll('a, button').forEach((element) => {
    element.addEventListener('mouseenter', () => { cursor.style.width = '28px'; cursor.style.height = '28px'; });
    element.addEventListener('mouseleave', () => { cursor.style.width = '9px'; cursor.style.height = '9px'; });
  });
}

if (document.body.classList.contains('project-page')) {
  const params = new URLSearchParams(window.location.search);
  const requestedId = params.get('id');
  const project = projects[requestedId] || projectList[0];
  if (!project) {
    document.querySelector('main').textContent = 'No projects enabled.';
  } else {
    const currentIndex = projectList.findIndex((item) => item.id === project.id);
    const next = projectList[(currentIndex + 1) % projectList.length];
    const visualClass = `visual-${String((currentIndex % 6) + 1).padStart(2, '0')}`;

    document.getElementById('case-tag').textContent = project.tag;
    document.getElementById('case-title-zh').textContent = project.zh;
    document.getElementById('case-title-en').textContent = project.en;
    document.getElementById('case-index').textContent = `${project.id} / ${project.year}`;
    document.getElementById('case-description-zh').textContent = project.descriptionZh;
    document.getElementById('case-description-en').textContent = project.descriptionEn;
    document.getElementById('case-type').textContent = project.tag;
    document.getElementById('case-tools').textContent = project.tools;

    const player = document.getElementById('case-player');
    player.className = `case-player ${visualClass}`;
    applyPlaceholder(player, project.placeholder);
    const video = document.getElementById('case-video');
    const pathLabel = document.getElementById('video-path');
    const statusZh = document.getElementById('video-status-zh');
    const statusEn = document.getElementById('video-status-en');
    const setVideoStatus = (zhText, enText, showPath = false) => {
      statusZh.textContent = zhText;
      statusEn.textContent = enText;
      pathLabel.hidden = !showPath;
    };
    pathLabel.textContent = project.video || '';
    if (project.poster) video.poster = project.poster;
    if (project.video) {
      setVideoStatus('视频加载中…', 'LOADING VIDEO…');
      video.src = project.video;
      video.addEventListener('loadeddata', () => player.classList.add('has-video'), { once: true });
      video.addEventListener('error', () => {
        player.classList.remove('has-video');
        setVideoStatus('视频暂时无法加载，请稍后重试', 'VIDEO UNAVAILABLE. PLEASE TRY AGAIN LATER.');
      });
    } else {
      setVideoStatus('该项目暂未添加视频', 'NO VIDEO HAS BEEN ADDED FOR THIS PROJECT.');
    }

    const gallery = document.getElementById('case-gallery');
    if (Array.isArray(project.images) && project.images.length) {
      project.images.forEach((source, index) => {
        const image = document.createElement('img');
        image.src = source;
        image.alt = `${project.en} — ${String(index + 1).padStart(2, '0')}`;
        image.loading = 'lazy';
        gallery.appendChild(image);
      });
      gallery.hidden = false;
    }

    const nextLink = document.getElementById('next-project');
    nextLink.href = `project.html?id=${encodeURIComponent(next.id)}`;
    nextLink.querySelector('[data-zh]').textContent = next.zh;
    nextLink.querySelector('[data-en]').textContent = next.en;
    document.title = `${project.en} — Technical Artist Portfolio`;
  }
}
