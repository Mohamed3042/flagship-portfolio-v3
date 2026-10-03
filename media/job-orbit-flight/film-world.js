(() => {
  'use strict';
  const data=JSON.parse(document.querySelector('#film-data').textContent);
  const root=document.documentElement,stage=document.querySelector('.film-stage');
  const mobile=matchMedia('(pointer:coarse)').matches||innerWidth<=900;
  const reduced=matchMedia('(prefers-reduced-motion:reduce)');
  const profile=mobile?'mobile':'desktop';
  const duration=data.duration,frame=1/data.fps,lastTime=duration-frame;
  const travel=duration*(mobile?84:96);
  root.style.setProperty('--travel',`${travel}px`);
  const videos=[...document.querySelectorAll('.film-buffer')];
  const slots=videos.map(video=>({video,index:-1,ready:false,generation:0,wanted:0,requested:.001,presented:0,hasPresented:false,frameHandle:0}));
  const canvas=document.querySelector('.film-ambient'),ctx=canvas.getContext('2d',{alpha:false});
  const loader=document.querySelector('.film-loading'),message=document.querySelector('[data-load-message]');
  const retry=document.querySelector('[data-retry]'),slider=document.querySelector('.film-scrubber input');
  const title=document.querySelector('.current-chapter'),clock=document.querySelector('[data-clock]');
  const cache=new Map(),jobs=new Map();
  let display=null,desiredIndex=0,goal=0,position=0,painted=0,raf=0,previous=0,lastWidth=innerWidth,modalOpen=false;
  let ready=false,lastDirection=1,lastGoal=0;
  const clamp=(v,a,b)=>Math.min(b,Math.max(a,v));
  const text=(en,ar)=>data.lang==='ar'?ar:en;
  stage.classList.toggle('fill',mobile);
  document.querySelector('[data-framing]').setAttribute('aria-pressed',String(mobile));
  document.querySelector('[data-framing]').textContent=mobile?text('Show full frame','عرض الإطار كاملاً'):text('Fill screen','ملء الشاشة');
  const showLoading=()=>{loader.classList.remove('is-hidden');};
  const clipURL=index=>`${data.media}/scroll-${profile}/clip-${String(index).padStart(3,'0')}.mp4`;
  function evict(){
    const used=new Set(slots.map(s=>s.index));
    for(const [index,url] of cache)if(Math.abs(index-desiredIndex)>3&&!used.has(index)){URL.revokeObjectURL(url);cache.delete(index);}
  }
  async function fetchClip(index){
    if(cache.has(index))return cache.get(index);
    if(jobs.has(index))return jobs.get(index).promise;
    const controller=new AbortController();
    const timeout=setTimeout(()=>controller.abort(),20000);
    const job=(async()=>{
      const response=await fetch(clipURL(index),{signal:controller.signal});
      if(!response.ok)throw new Error(`Film segment ${index}: HTTP ${response.status}`);
      const blob=await response.blob();
      const url=URL.createObjectURL(blob);cache.set(index,url);return url;
    })();
    jobs.set(index,{promise:job,controller});
    try{return await job;}finally{clearTimeout(timeout);if(jobs.get(index)?.promise===job)jobs.delete(index);}
  }
  function chapterAt(time){let chapter=data.chapters[0];for(const item of data.chapters)if(item.start<=time)chapter=item;return chapter;}
  function phoneFraming(time){
    if(!mobile)return;
    const chapter=chapterAt(time),local=time-chapter.start;
    const views={profile:[1100,500,500],globe:[450,1150,1550],findings:[960,600,1430],focus:[960,510,1360],fit:[960,480,1430],nextproof:[960,550,1390],market:[960,570,1420],employers:[960,610,1390],engine:[1260,800,900],anywhere:[640,1330,1330]};
    const smooth=(start,end)=>{const x=clamp((local-start)/(end-start),0,1);return x*x*(3-2*x);};
    const view=views[chapter.id];
    let center=960;
    if(view){center=view[0]+(view[1]-view[0])*smooth(3.1,4.8);center+=(view[2]-view[1])*smooth(5.2,chapter.id==='fit'?6.2:7.2);}
    const visible=stage.clientWidth/stage.clientHeight*1080;
    const fraction=visible<1920?clamp((center-visible/2)/(1920-visible),0,1):.5;
    stage.style.setProperty('--portrait-position',`${fraction*100}%`);
  }
  function updateChrome(time){
    const chapter=chapterAt(time);
    title.textContent=chapter.title;
    clock.textContent=`${String(Math.floor(time/60)).padStart(2,'0')}:${String(Math.floor(time%60)).padStart(2,'0')}`;
    document.querySelectorAll('[data-jump]').forEach(link=>Number(link.dataset.jump)===chapter.start?link.setAttribute('aria-current','step'):link.removeAttribute('aria-current'));
  }
  function paint(slot,localTime){
    if(!slot.ready||slot.video.readyState<2)return;
    if(slot!==display&&slot.index!==desiredIndex)return;
    if(Math.abs(localTime-slot.wanted)>.09&&slot!==display)return;
    if(display!==slot){videos.forEach(video=>video.classList.toggle('is-visible',video===slot.video));display=slot;}
    painted=clamp(slot.index*data.clipSeconds+localTime,0,lastTime);
    root.dataset.paintedTime=painted.toFixed(4);root.dataset.clip=String(slot.index);root.dataset.profile=profile;
    try{ctx.drawImage(slot.video,0,0,canvas.width,canvas.height);}catch{}
    updateChrome(painted);
    phoneFraming(painted);
    if(slot.index===desiredIndex){loader.classList.add('is-hidden');loader.classList.remove('has-error');retry.hidden=true;}
    if(!ready){ready=true;root.classList.add('is-ready');root.dataset.filmReady='true';}
  }
  function watchFrames(slot){
    if(typeof slot.video.requestVideoFrameCallback==='function'&&!slot.frameHandle){
      const generation=slot.generation;
      slot.frameHandle=slot.video.requestVideoFrameCallback((_,metadata)=>{
        slot.frameHandle=0;if(slot.generation!==generation)return;
        slot.presented=metadata.mediaTime;slot.hasPresented=true;
        paint(slot,metadata.mediaTime);watchFrames(slot);
        if(slot.index===desiredIndex)seek(slot,position-slot.index*data.clipSeconds);
        schedule();
      });
    }
  }
  function seek(slot,time){
    if(!slot.ready||slot.video.readyState<2)return;
    const wanted=clamp(Math.round(time*data.fps)/data.fps,0,(slot.video.duration||data.clipSeconds)-frame);
    slot.wanted=wanted;
    if(typeof slot.video.requestVideoFrameCallback==='function'&&!slot.hasPresented)return;
    if(slot.video.seeking)return;
    const requested=clamp(wanted+.001,.001,(slot.video.duration||data.clipSeconds)-.001);
    if(Math.abs(slot.video.currentTime-requested)<frame*.2){
      if(slot!==display)paint(slot,typeof slot.video.requestVideoFrameCallback==='function'?slot.presented:slot.video.currentTime);
      return;
    }
    slot.requested=requested;
    try{slot.video.currentTime=requested;}catch{}
  }
  function ensureSlot(index,primary=false){
    if(index<0||index>=data.clipCount)return null;
    let slot=slots.find(s=>s.index===index);if(slot)return slot;
    const candidates=slots.filter(s=>s!==display&&s.index!==desiredIndex);
    if(!primary&&display?.index!==desiredIndex&&!candidates.some(s=>s.index===-1))return null;
    slot=candidates.sort((a,b)=>a.index===-1?-1:b.index===-1?1:Math.abs(b.index-desiredIndex)-Math.abs(a.index-desiredIndex))[0];
    if(!slot)return null;
    slot.index=index;slot.ready=false;slot.presented=0;slot.hasPresented=false;const generation=++slot.generation;
    if(primary){showLoading();message.textContent=ready?text('Loading this part of the flight…','جارٍ تحميل هذا الجزء من الرحلة…'):text('Loading the opening scene…','جارٍ تحميل المشهد الافتتاحي…');}
    fetchClip(index).then(url=>{
      if(slot.generation!==generation)return;
      if(slot.frameHandle){slot.video.cancelVideoFrameCallback(slot.frameHandle);slot.frameHandle=0;}
      slot.video.src=url;slot.video.load();
      watchFrames(slot);
    }).catch(error=>{
      if(slot.generation!==generation||index!==desiredIndex)return;
      loader.classList.add('has-error');showLoading();message.textContent=text('The film could not load.','تعذر تحميل الفيلم.');retry.hidden=false;
      root.dataset.filmError=error.message;
    });
    return slot;
  }
  for(const slot of slots){
    slot.video.muted=true;slot.video.defaultMuted=true;
    slot.video.addEventListener('loadeddata',()=>{
      slot.ready=true;
      if(typeof slot.video.requestVideoFrameCallback!=='function'&&slot.video.currentTime===0&&slot.index===desiredIndex)paint(slot,0);
      watchFrames(slot);
      if(slot.index===desiredIndex)seek(slot,position-slot.index*data.clipSeconds);
      else seek(slot,.001);
      schedule();
    });
    slot.video.addEventListener('seeked',()=>{
      if(typeof slot.video.requestVideoFrameCallback!=='function')paint(slot,slot.video.currentTime);
      if(slot.index===desiredIndex)seek(slot,position-slot.index*data.clipSeconds);
      schedule();
    });
    slot.video.addEventListener('error',()=>{
      if(slot.index!==desiredIndex)return;
      loader.classList.add('has-error');showLoading();message.textContent=text('The film could not decode.','تعذر عرض الفيلم.');retry.hidden=false;
      root.dataset.filmError=slot.video.error?.message||'Video decode error';
    });
    watchFrames(slot);
  }
  function tick(now){
    raf=0;
    const delta=previous?Math.min(64,now-previous):16;previous=now;
    goal=clamp(scrollY/travel,0,1)*lastTime;
    if(Math.abs(goal-lastGoal)>.01)lastDirection=goal>lastGoal?1:-1;
    lastGoal=goal;
    position=reduced.matches?goal:position+(goal-position)*(1-Math.exp(-delta/75));
    if(Math.abs(position-goal)<frame*.2)position=goal;
    desiredIndex=Math.min(data.clipCount-1,Math.floor(position/data.clipSeconds));
    const slot=ensureSlot(desiredIndex,true);
    if(slot?.ready)seek(slot,position-desiredIndex*data.clipSeconds);
    else showLoading();
    if(slot?.ready){ensureSlot(desiredIndex+lastDirection);ensureSlot(desiredIndex-lastDirection);}
    const ahead=desiredIndex+lastDirection*2;
    if(slot?.ready&&ahead>=0&&ahead<data.clipCount)fetchClip(ahead).catch(()=>{});
    for(const [index,job] of jobs)if(Math.abs(index-desiredIndex)>3){job.controller.abort();jobs.delete(index);for(const old of slots)if(old.index===index&&old!==display){old.index=-1;old.ready=false;old.generation++;}}
    slider.value=String(goal);slider.style.setProperty('--position',`${goal/lastTime*100}%`);
    root.classList.toggle('has-scrolled',goal>.5);
    root.dataset.targetTime=goal.toFixed(4);
    root.dataset.positionTime=position.toFixed(4);
    evict();
    if(Math.abs(position-goal)>frame*.15&&!modalOpen)schedule();
  }
  function schedule(){if(!raf)raf=requestAnimationFrame(tick);}
  addEventListener('scroll',schedule,{passive:true});
  addEventListener('resize',()=>{
    if(innerWidth!==lastWidth){const progress=clamp(scrollY/travel,0,1);lastWidth=innerWidth;scrollTo({top:progress*travel,behavior:'instant'});}
    phoneFraming(painted);
    schedule();
  },{passive:true});
  reduced.addEventListener('change',schedule);
  slider.addEventListener('input',()=>scrollTo({top:Number(slider.value)/lastTime*travel,behavior:'instant'}));
  const chapterDialog=document.querySelector('.chapter-dialog'),aboutDialog=document.querySelector('.about-dialog'),watchDialog=document.querySelector('.watch-dialog');
  const soundFilm=document.querySelector('.sound-film');
  function open(dialog){modalOpen=true;dialog.showModal();}
  document.querySelector('[data-chapters]').addEventListener('click',()=>open(chapterDialog));
  document.querySelector('[data-about]').addEventListener('click',()=>open(aboutDialog));
  document.querySelector('.skip').addEventListener('click',event=>{event.preventDefault();open(chapterDialog);});
  document.querySelectorAll('[data-jump]').forEach(link=>link.addEventListener('click',event=>{
    event.preventDefault();chapterDialog.close();history.replaceState(null,'',link.getAttribute('href'));
    scrollTo({top:Number(link.dataset.jump)/lastTime*travel,behavior:reduced.matches?'instant':'smooth'});
  }));
  document.querySelector('[data-framing]').addEventListener('click',event=>{
    const fill=stage.classList.toggle('fill');event.currentTarget.setAttribute('aria-pressed',String(fill));
    event.currentTarget.textContent=fill?text('Show full frame','عرض الإطار كاملاً'):text('Fill screen','ملء الشاشة');
  });
  document.querySelector('[data-watch]').addEventListener('click',()=>{
    open(watchDialog);if(!soundFilm.getAttribute('src')){soundFilm.src=data.fullFilm;soundFilm.load();}
    soundFilm.currentTime=painted;soundFilm.play().catch(()=>{});
  });
  document.querySelectorAll('dialog [data-close]').forEach(button=>button.addEventListener('click',()=>button.closest('dialog').close()));
  document.querySelectorAll('dialog').forEach(dialog=>{
    dialog.addEventListener('close',()=>{modalOpen=false;soundFilm.pause();schedule();});
    dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();}});
  });
  retry.addEventListener('click',()=>{delete root.dataset.filmError;const slot=slots.find(s=>s.index===desiredIndex);if(slot){slot.index=-1;slot.ready=false;slot.generation++;}schedule();});
  addEventListener('pagehide',()=>{soundFilm.pause();});
  const deepLink=data.chapters.find(c=>`#${c.id}`===location.hash);
  if(deepLink){scrollTo({top:deepLink.start/lastTime*travel,behavior:'instant'});position=deepLink.start;}
  schedule();
})();
