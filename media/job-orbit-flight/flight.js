(() => {
  const data = JSON.parse(document.querySelector('#flight-data').textContent);
  const stations = [...document.querySelectorAll('.station')];
  const journey = document.querySelector('.journey');
  const panel = document.querySelector('.flight-panel');
  const current = document.querySelector('.frame-current');
  const next = document.querySelector('.frame-next');
  const counter = document.querySelector('.station-counter');
  const title = document.querySelector('.current-title');
  const progress = document.querySelector('.flight-progress span');
  const links = [...document.querySelectorAll('[data-station]')];
  const motion = document.querySelector('.motion-toggle');
  const mediaQuery = matchMedia('(prefers-reduced-motion: reduce)');
  let customReduced = false;
  try {customReduced = localStorage.getItem('orbit-reduced-motion') === 'true';} catch {}
  let active = -1, queued = false;
  const loaded = new Map();
  const prime = index => {
    if (!data.scenes[index] || loaded.has(index)) return;
    const img = new Image(); img.src = data.scenes[index].image;
    loaded.set(index,img);
  };
  prime(0); prime(1);
  const isReduced = () => mediaQuery.matches || customReduced;
  const setMotion = () => {
    const reduced = isReduced();
    document.documentElement.classList.toggle('no-motion',reduced);
    motion.setAttribute('aria-pressed',String(reduced));
    motion.disabled=mediaQuery.matches;
    motion.title=mediaQuery.matches?(data.lang==='ar'?'يتبع تقليل الحركة إعدادات جهازك':'Reduced motion follows your device setting'):'';
    motion.textContent = data.lang === 'ar' ? (reduced?'الحركة متوقفة':'الحركة مفعلة') : (reduced?'Motion off':'Motion on');
    motion.setAttribute('aria-label', data.lang === 'ar' ? 'إيقاف الحركة الإضافية' : 'Reduce decorative motion');
    requestDraw();
  };
  const activate = index => {
    if (active === index) return;
    active = index;
    const scene = data.scenes[index];
    current.src = scene.image;
    current.alt = `${scene.title} — ${data.lang==='ar'?'إطار توضيحي من الفيلم':'illustrated film frame'}`;
    next.removeAttribute('src');
    if (data.scenes[index+1]) next.src = data.scenes[index+1].image;
    title.textContent = scene.title;
    counter.textContent = `${String(index+1).padStart(2,'0')} / 10`;
    journey.style.setProperty('--accent',scene.color);
    links.forEach((link,i)=>i===index?link.setAttribute('aria-current','step'):link.removeAttribute('aria-current'));
    prime(index+1); prime(index+2);
  };
  function draw() {
    queued = false;
    const mobile = innerWidth <= 650;
    const marker = mobile ? Math.min(innerHeight*.52,innerWidth*.56+175) : innerHeight*.50;
    let index=0;
    for (let i=0;i<stations.length;i++) if (stations[i].getBoundingClientRect().top<=marker+2) index=i;
    activate(index);
    const rect=stations[index].getBoundingClientRect();
    const local=Math.max(0,Math.min(1,(marker-rect.top)/rect.height));
    const blend=isReduced()?0:Math.max(0,Math.min(1,(local-.84)/.16));
    next.style.opacity=data.scenes[index+1]?blend:0;
    progress.style.width=`${Math.max(0,Math.min(100,(index+local)/stations.length*100))}%`;
    if (!isReduced()) {
      panel.style.setProperty('--float',`${(local-.5)*-14}px`);
      panel.style.setProperty('--tilt',`${(local-.5)*1.2}deg`);
      panel.style.setProperty('--frame-scale',String(1+local*.012));
      const heroScroll=Math.min(scrollY,innerHeight);
      document.documentElement.style.setProperty('--hero-shift',`${heroScroll*.15}px`);
      document.documentElement.style.setProperty('--orbit-shift',`${heroScroll*.22}px`);
    }
  }
  function requestDraw(){if(!queued){queued=true;requestAnimationFrame(draw);}}
  addEventListener('scroll',requestDraw,{passive:true});
  addEventListener('resize',requestDraw);
  mediaQuery.addEventListener('change',setMotion);
  motion.addEventListener('click',()=>{customReduced=!isReduced();try{localStorage.setItem('orbit-reduced-motion',String(customReduced));}catch{}setMotion();});
  const video=document.querySelector('video');
  const cover=document.querySelector('.film-cover');
  let requestedTime=0, filmVisible=false, pendingPlay=false;
  function startPlayback(){
    if(filmVisible&&pendingPlay)video.play().then(()=>{pendingPlay=false;}).catch(()=>{});
  }
  function playAt(time=0){
    requestedTime=time;
    pendingPlay=true;
    cover.hidden=true;
    if(!video.getAttribute('src')){video.src=data.download;video.load();}
    else if(video.readyState>=1)video.currentTime=time;
    startPlayback();
  }
  video.addEventListener('loadedmetadata',()=>{video.currentTime=Math.min(requestedTime,video.duration||120);startPlayback();});
  video.addEventListener('error',()=>{cover.hidden=false;cover.querySelector('span:last-child').textContent=data.lang==='ar'?'تعذر التشغيل. استخدم رابط التنزيل أدناه.':'Playback unavailable. Use the download link below.';});
  cover.addEventListener('click',()=>playAt(0));
  document.querySelectorAll('[data-play-at]').forEach(link=>link.addEventListener('click',()=>playAt(Number(link.dataset.playAt))));
  const visibility=new IntersectionObserver(entries=>{
    filmVisible=entries[0].isIntersecting;
    if(filmVisible)startPlayback();
    else if(!video.paused)video.pause();
  },{threshold:.02});
  visibility.observe(document.querySelector('.film-player'));
  setMotion();
})();
