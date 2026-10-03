(() => {
  'use strict';
  const root=document.documentElement, video=document.querySelector('video'), reel=document.querySelector('.reel');
  const chapters=JSON.parse(document.querySelector('#film-chapters').textContent);
  const ar=root.lang==='ar', reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const range=document.querySelector('#timeline'), playButton=document.querySelector('[data-play]');
  const hint=document.querySelector('[data-hint]'), status=document.querySelector('[data-status]');
  const enable=document.querySelector('[data-enable]'), dialog=document.querySelector('dialog');
  const last=90-1/30, clamp=(v,a=0,b=last)=>Math.max(a,Math.min(b,v));
  const clock=t=>String(Math.floor(t/60)).padStart(2,'0')+':'+String(Math.floor(t%60)).padStart(2,'0');
  let desired=0, displayed=0, inFlight=false, scheduled=false, mode='scroll', chapter=0;
  let scrollEnabled=!reduced.matches, loaded=false, expectedScroll=-1, failed=false, playFrame=0;
  const scrollLength=()=>Math.max(1,document.documentElement.scrollHeight-innerHeight);
  const portrait=()=>innerWidth<=900&&innerHeight>innerWidth;
  const chooseSource=()=>portrait()?video.dataset.phone:video.dataset.desktop;
  let source=chooseSource();
  function updatePresentation(){
    root.dataset.edition=portrait()?'portrait':'desktop';
    const poster=document.querySelector('.picture>img');
    poster.src=portrait()?video.dataset.phonePoster:video.dataset.desktopPoster;
    document.querySelectorAll('[data-film-link]').forEach(link=>{link.href=portrait()?video.dataset.phoneFull:video.dataset.full;});
  }
  function attach(){
    if(loaded)return;
    source=chooseSource();updatePresentation();
    loaded=true;video.muted=true;video.defaultMuted=true;video.src=source;video.load();
  }
  function setStatus(message){status.textContent=message;}
  function panAt(t){
    const i=Math.max(0,chapters.findLastIndex(c=>t>=c.start)),c=chapters[i];
    const end=chapters[i+1]?.start||90;
    const p=clamp((t-c.start)/(end-c.start),0,1);
    const x=clamp((p-.23)/.56,0,1),ease=x*x*(3-2*x);
    // The phone camera follows the copy into the interface on the same film clock.
    return c.panStart+(c.panEnd-c.panStart)*ease;
  }
  function paint(time){
    chapter=Math.max(0,chapters.findLastIndex(c=>time>=c.start));
    range.value=String(time);range.style.setProperty('--progress',(time/last*100)+'%');
    range.setAttribute('aria-valuetext',clock(time)+' / 01:30');
    document.querySelector('[data-time]').textContent=clock(time);
    document.querySelector('[data-count]').textContent=String(chapter+1).padStart(2,'0')+' / 13';
    document.querySelector('[data-title]').textContent=chapters[chapter].title;
    root.style.setProperty('--pan',portrait()?'50%':(panAt(time)*100).toFixed(3)+'%');
    hint.hidden=scrollEnabled&&time>.35;
    document.querySelector('[data-end]').hidden=time<88.5;
    reel.dataset.chapter=String(chapter);
  }
  function seek(){
    if(mode!=='scroll'||!loaded||video.readyState<1||inFlight||video.seeking)return;
    if(Math.abs(video.currentTime-desired)<.025){
      displayed=video.currentTime;paint(displayed);return;
    }
    inFlight=true;
    try{video.currentTime=desired;}catch{inFlight=false;}
  }
  function update(){
    scheduled=false;
    if(mode!=='scroll'||!scrollEnabled)return;
    desired=clamp(scrollY/scrollLength()*last);
    reel.dataset.requested=desired.toFixed(4);
    if(!loaded)attach();
    seek();
  }
  function schedule(){if(!scheduled){scheduled=true;requestAnimationFrame(update);}}
  function stopped(){
    if(mode!=='playing')return;
    mode='scroll';video.pause();video.muted=true;
    cancelAnimationFrame(playFrame);
    playButton.textContent=ar?'▶ تشغيل بصوت':'▶ Play + sound';
    expectedScroll=-1;desired=clamp(video.currentTime);
    reel.dataset.mode=mode;
  }
  function moveTo(time){
    stopped();desired=clamp(time);attach();
    if(scrollEnabled){
      const y=desired/last*scrollLength();
      scrollTo({top:y,behavior:'instant'});
    }
    reel.dataset.requested=desired.toFixed(4);seek();
  }
  video.addEventListener('loadedmetadata',()=>{inFlight=false;seek();});
  video.addEventListener('loadeddata',()=>{
    video.classList.add('ready');failed=false;setStatus('');
    displayed=video.currentTime;paint(displayed);seek();
  });
  video.addEventListener('seeked',()=>{
    inFlight=false;displayed=video.currentTime;
    reel.dataset.displayed=displayed.toFixed(4);video.classList.add('ready');
    paint(displayed);
    if(!failed)setStatus('');
    if(mode==='scroll')seek();
  });
  video.addEventListener('error',()=>{
    failed=true;inFlight=false;stopped();
    status.replaceChildren();
    const message=document.createElement('span');
    message.textContent=ar?'تعذّر تحميل الفيلم. ':'The film could not load. ';
    const retry=document.createElement('button');retry.type='button';
    retry.textContent=ar?'إعادة المحاولة':'Retry';
    retry.addEventListener('click',()=>{failed=false;loaded=false;attach();setStatus(ar?'جارٍ تحميل الفيلم…':'Loading the film…');},{once:true});
    const link=document.createElement('a');link.href=portrait()?video.dataset.phoneFull:video.dataset.full;
    link.textContent=ar?' افتح الفيلم ↗':' Open film ↗';
    status.append(message,retry,link);
  });
  function playbackTick(){
    if(mode!=='playing')return;
    const t=clamp(video.currentTime);desired=t;paint(t);
    reel.dataset.displayed=t.toFixed(4);
    if(scrollEnabled){expectedScroll=t/last*scrollLength();scrollTo({top:expectedScroll,behavior:'instant'});}
    playFrame=requestAnimationFrame(playbackTick);
  }
  playButton.addEventListener('click',async()=>{
    if(mode==='playing'){stopped();return;}
    attach();mode='playing';reel.dataset.mode=mode;hint.hidden=true;
    video.muted=false;
    if(video.readyState>=1&&Math.abs(video.currentTime-desired)>.06)video.currentTime=desired;
    playButton.textContent=ar?'Ⅱ إيقاف مؤقت':'Ⅱ Pause';
    try{await video.play();setStatus('');playbackTick();}
    catch{stopped();setStatus(ar?'تعذّر بدء التشغيل. اضغط تشغيل للمحاولة مجددًا.':'Playback could not start. Press play to try again.');}
  });
  video.addEventListener('ended',()=>{stopped();moveTo(last);});
  addEventListener('scroll',()=>{
    if(dialog.open)return;
    if(mode==='playing'){
      if(Math.abs(scrollY-expectedScroll)<4)return;
      stopped();
    }
    schedule();
  },{passive:true});
  addEventListener('wheel',()=>stopped(),{passive:true});
  addEventListener('touchstart',e=>{if(!e.target.closest('button,a,input,dialog'))stopped();},{passive:true});
  addEventListener('keydown',e=>{
    if(['PageDown','PageUp','ArrowDown','ArrowUp','Home','End',' '].includes(e.key)&&!e.target.closest('button,input,dialog'))stopped();
  });
  let resizeTimer;
  addEventListener('resize',()=>{
    const time=desired;clearTimeout(resizeTimer);
    resizeTimer=setTimeout(()=>{
      if(chooseSource()!==source){
        const wasLoaded=loaded;
        stopped();desired=time;source=chooseSource();inFlight=false;loaded=false;
        video.classList.remove('ready');updatePresentation();
        if(wasLoaded)attach();
      }
      if(scrollEnabled&&mode==='scroll')moveTo(time);else paint(time);
    },100);
  },{passive:true});
  range.addEventListener('input',()=>moveTo(Number(range.value)));
  document.querySelector('[data-previous]').addEventListener('click',()=>moveTo(chapters[Math.max(0,chapter-1)].start));
  document.querySelector('[data-next]').addEventListener('click',()=>moveTo(chapters[Math.min(chapters.length-1,chapter+1)].start));
  document.querySelector('[data-fit]').addEventListener('click',e=>{
    const fit=root.dataset.framing!=='fit';root.dataset.framing=fit?'fit':'fill';
    e.currentTarget.setAttribute('aria-pressed',String(fit));
    e.currentTarget.textContent=ar?(fit?'ملء الشاشة':'الكادر كاملًا'):(fit?'Fill screen':'Full frame');
  });
  document.querySelector('[data-fullscreen]').addEventListener('click',async()=>{
    try{if(document.fullscreenElement)await document.exitFullscreen();else await document.documentElement.requestFullscreen();}
    catch{setStatus(ar?'استخدم الوضع الأفقي لعرض أكبر.':'Use landscape orientation for a wider view.');}
  });
  const chaptersButton=document.querySelector('[data-chapters]');
  chaptersButton.addEventListener('click',()=>{stopped();dialog.showModal();});
  document.querySelector('[data-close]').addEventListener('click',()=>dialog.close());
  dialog.addEventListener('close',()=>chaptersButton.focus({preventScroll:true}));
  document.querySelectorAll('[data-chapter]').forEach(button=>button.addEventListener('click',()=>{
    const time=Number(button.dataset.chapter);dialog.close();moveTo(time);
  }));
  function enableScroll(){
    scrollEnabled=true;root.dataset.scrollEnabled='true';enable.hidden=true;
    document.querySelector('[data-hint-title]').textContent=ar?'مرّر للدخول إلى الفيلم ↓':'Scroll to enter the film ↓';
    document.querySelector('[data-hint-detail]').textContent=ar?'تمريرك يحرّك الصورة إلى الأمام والخلف.':'Your scroll moves the picture. Forward and back.';
    attach();schedule();
  }
  enable.addEventListener('click',enableScroll);
  updatePresentation();
  if(scrollEnabled){root.dataset.scrollEnabled='true';attach();schedule();}
  else{
    enable.hidden=false;
    document.querySelector('[data-hint-title]').textContent=ar?'الحركة المخفّضة مفعّلة':'Reduced motion is on';
    document.querySelector('[data-hint-detail]').textContent=ar?'اختر فصلًا أو فعّل الفيلم بالتمرير.':'Choose a chapter, or enable the scroll film.';
  }
  document.addEventListener('visibilitychange',()=>{if(document.hidden)stopped();});
  setTimeout(()=>{if(loaded&&video.readyState<2&&!failed)setStatus(ar?'جارٍ تحميل الفيلم…':'Loading the film…');},3500);
  // Read-only diagnostics expose the real decoder clock for regression checks.
  window.TALENT_ATLAS_FILM=Object.freeze({snapshot:()=>({desired,displayed:video.currentTime,paused:video.paused,seeking:video.seeking,mode,chapter,source,scrollEnabled,framing:root.dataset.framing,pan:panAt(video.currentTime)})});
})();
