'use strict';
const config = window.SALON_CONFIG || {};
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const bookingMessage = 'Olá! Conheci o salão Edimara Carmo pelo site e gostaria de agendar um horário.';
function bookingUrl(phone, service) {
 const digits=String(phone||'').replace(/\D/g,'');
 if(!digits)return null;
 return `https://wa.me/${digits}?text=${encodeURIComponent(service?`${bookingMessage} Tenho interesse em ${service.toLowerCase()}.`:bookingMessage)}`;
}
function closeDialog(dialog){dialog.close();dialog.remove();}
function openDialog(title,description,image){
 const dialog=document.createElement('dialog');dialog.className=image?'export-dialog lightbox':'export-dialog booking-dialog';
 const heading=document.createElement('h2');heading.id='dialog-title';heading.textContent=title;dialog.append(heading);dialog.setAttribute('aria-labelledby',heading.id);
 if(image){const img=document.createElement('img');img.src=image;img.alt=title;dialog.append(img);}
 const paragraph=document.createElement('p');paragraph.textContent=description;paragraph.id='dialog-description';dialog.append(paragraph);dialog.setAttribute('aria-describedby',paragraph.id);
 const close=document.createElement('button');close.className='editorial-button';close.textContent=image?'Fechar fotografia':'Voltar ao site';close.addEventListener('click',()=>closeDialog(dialog));dialog.append(close);
 dialog.addEventListener('cancel',e=>{e.preventDefault();closeDialog(dialog);});
 dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)closeDialog(dialog);}});
 document.body.append(dialog);dialog.showModal();
}
document.querySelectorAll('[data-booking]').forEach(button=>button.addEventListener('click',()=>{
 const service='service' in button.dataset?button.dataset.service:button.closest('.service-card')?.querySelector('h3')?.textContent;
 const url=bookingUrl(config.whatsapp,service);
 if(url)window.open(url,'_blank','noopener,noreferrer');
 else openDialog('Seu momento de cuidado','O agendamento pelo WhatsApp estará disponível em breve. Estamos preparando tudo para receber você.');
}));
document.querySelectorAll('[data-service-choice] input[type=radio]').forEach(input=>input.addEventListener('change',()=>{
 const cta=document.querySelector('[data-service-cta]');
 if(cta)cta.dataset.service=input.value;
}));
const menuButton=document.querySelector('[data-menu]');
if(menuButton){
 const header=document.querySelector('.site-header');
 const menu=document.createElement('nav');menu.id='mobile-navigation';menu.className='mobile-nav';menu.setAttribute('aria-label','Navegação celular');menu.setAttribute('aria-hidden','true');menu.hidden=true;menu.inert=true;
 document.querySelectorAll('.desktop-nav a').forEach(link=>menu.append(link.cloneNode(true)));
 const headerCta=document.querySelector('.header-booking');
 if(headerCta){const cta=headerCta.cloneNode(true);cta.classList.remove('header-booking');menu.append(cta);}
 const overlay=document.createElement('div');overlay.className='drawer-overlay';overlay.setAttribute('aria-hidden','true');overlay.addEventListener('click',()=>closeMenu(true));
 header.append(menu,overlay);
 const setMenuLinksDisabled=disabled=>menu.querySelectorAll('a').forEach(link=>{link.tabIndex=disabled?-1:0;});
 setMenuLinksDisabled(true);
 let menuTimer=0;
 function closeMenu(restoreFocus=false){
  if(menu.hidden)return;
  menu.classList.remove('is-open');overlay.classList.remove('is-open');document.body.classList.remove('drawer-open');menu.inert=true;menu.setAttribute('aria-hidden','true');setMenuLinksDisabled(true);
  menuButton.setAttribute('aria-expanded','false');menuButton.setAttribute('aria-label','Abrir menu');
  window.clearTimeout(menuTimer);menuTimer=window.setTimeout(()=>{menu.hidden=true;},prefersReducedMotion?0:340);
  if(restoreFocus)menuButton.focus();
 }
 function openMenu(){
  window.clearTimeout(menuTimer);menu.hidden=false;menu.inert=false;menu.setAttribute('aria-hidden','false');setMenuLinksDisabled(false);
  menuButton.setAttribute('aria-expanded','true');menuButton.setAttribute('aria-label','Fechar menu');
  requestAnimationFrame(()=>{menu.classList.add('is-open');overlay.classList.add('is-open');document.body.classList.add('drawer-open');});
 }
 menuButton.addEventListener('click',()=>menu.hidden||!menu.classList.contains('is-open')?openMenu():closeMenu());
 menu.addEventListener('click',e=>{if(e.target.closest('a'))closeMenu();});
 document.addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu(true);});
 document.addEventListener('click',e=>{if(!menu.hidden&&!header.contains(e.target))closeMenu();});
 const desktopMenuQuery=window.matchMedia('(min-width: 701px)');
 const closeOnDesktop=e=>{if(e.matches)closeMenu();};
 if(desktopMenuQuery.addEventListener)desktopMenuQuery.addEventListener('change',closeOnDesktop);
 else if(desktopMenuQuery.addListener)desktopMenuQuery.addListener(closeOnDesktop);
}
document.querySelectorAll('[data-filter]').forEach(button=>button.addEventListener('click',()=>{
 document.querySelectorAll('[data-filter]').forEach(b=>{b.classList.toggle('selected',b===button);b.setAttribute('aria-pressed',String(b===button));});
 document.querySelectorAll('[data-category]').forEach(item=>{item.hidden=button.dataset.filter!=='Todos'&&button.dataset.filter!==item.dataset.category;});
}));
document.querySelectorAll('[data-lightbox]').forEach(button=>button.addEventListener('click',()=>openDialog(button.querySelector('img').alt.replace(' — inspiração demonstrativa',''),button.dataset.caption||'Imagem demonstrativa. Não representa um trabalho realizado no salão.',button.querySelector('img').src)));
let spaceView=0;
document.querySelectorAll('[data-space-view]').forEach(button=>button.addEventListener('click',()=>{
 spaceView=1-spaceView;document.querySelector('.space-photo img').className=spaceView?'space-view-right':'space-view-left';document.querySelector('.space-caption').textContent=`INSPIRAÇÃO PARA O NOSSO ESPAÇO · 0${spaceView+1} / 02`;
}));


if(config.instagram&&/^https:\/\/(www\.)?instagram\.com\//i.test(config.instagram))document.querySelectorAll('.footer-nav').forEach(nav=>{const a=document.createElement('a');a.href=config.instagram;a.target='_blank';a.rel='noopener noreferrer';a.textContent='Instagram';nav.append(a);});
/* ===== Experiência premium ===== */
(function(){
 const reduce = prefersReducedMotion;
 const wide = window.matchMedia('(min-width: 761px)');

 /* Contato: mostra somente o que foi configurado em config.js */
 const digitsOf = v => String(v || '').replace(/\D/g, '');
 const phoneLabel = phone => {
   const d = digitsOf(phone);
   if (!d) return '';
   const local = d.startsWith('55') && d.length > 10 ? d.slice(2) : d;
   const num = local.slice(2);
   return '(' + local.slice(0, 2) + ') ' + (num.length > 4 ? num.slice(0, -4) + '-' + num.slice(-4) : num);
 };
 const instagramOk = /^https:\/\/(www\.)?instagram\.com\//i;
 const details = document.querySelector('.contact-details');
 if (details) {
   const addSpan = text => { const sp = document.createElement('span'); sp.textContent = text; details.append(sp); };
   if (config.address) addSpan(config.address);
   if (config.hours) addSpan(config.hours);
   if (digitsOf(config.whatsapp)) addSpan('WhatsApp: ' + phoneLabel(config.whatsapp));
 }
 const contactGrid = document.querySelector('[data-contact-cards]');
 if (contactGrid) {
   const makeCard = (label, value, link) => {
     const card = document.createElement('article');
     card.className = 'contact-card';
     const l = document.createElement('p'); l.className = 'contact-label'; l.textContent = label;
     const v = document.createElement('p'); v.className = 'contact-value'; v.textContent = value;
     card.append(l, v);
     if (link) {
       const a = document.createElement('a');
       a.className = 'contact-link'; a.href = link.href; a.textContent = link.text;
       if (link.external) { a.target = '_blank'; a.rel = 'noopener noreferrer'; }
       card.append(a);
     }
     contactGrid.append(card);
   };
   if (digitsOf(config.whatsapp)) makeCard('WhatsApp', phoneLabel(config.whatsapp), { href: bookingUrl(config.whatsapp), text: 'Enviar mensagem', external: true });
   if (instagramOk.test(config.instagram || '')) {
     const handle = new URL(config.instagram).pathname.split('/').filter(Boolean)[0] || '';
     makeCard('Instagram', handle ? '@' + handle : 'Perfil oficial', { href: config.instagram, text: 'Ver perfil', external: true });
   }
   if (config.address) makeCard('Endereço', config.address, { href: 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(config.address), text: 'Abrir no mapa', external: true });
   if (config.hours) makeCard('Horário de funcionamento', config.hours);
   const section = contactGrid.closest('section');
   if (!contactGrid.children.length) { if (section) section.hidden = true; }
   const mapBox = document.querySelector('[data-contact-map]');
   if (mapBox && config.address) {
     const frame = document.createElement('iframe');
     frame.loading = 'lazy';
     frame.referrerPolicy = 'no-referrer-when-downgrade';
     frame.title = 'Localização de Edimara Carmo no mapa';
     frame.src = 'https://www.google.com/maps?q=' + encodeURIComponent(config.address) + '&output=embed';
     mapBox.append(frame);
     mapBox.hidden = false;
   }
 }

 /* Cortina de antes e depois: mouse, toque e teclado */
 document.querySelectorAll('[data-ba]').forEach(root => {
   const handle = root.querySelector('.ba-handle');
   let pos = 50, dragging = false;
   const set = v => {
     pos = Math.max(0, Math.min(100, v));
     root.style.setProperty('--pos', pos.toFixed(2) + '%');
     handle.setAttribute('aria-valuenow', String(Math.round(pos)));
   };
   const at = e => { const r = root.getBoundingClientRect(); return (e.clientX - r.left) / r.width * 100; };
   root.addEventListener('pointerdown', e => {
     dragging = true;
     root.classList.add('is-dragging');
     try { root.setPointerCapture(e.pointerId); } catch (_) {}
     set(at(e));
   });
   root.addEventListener('pointermove', e => { if (dragging) set(at(e)); });
   const stop = () => { dragging = false; root.classList.remove('is-dragging'); };
   root.addEventListener('pointerup', stop);
   root.addEventListener('pointercancel', stop);
   handle.addEventListener('keydown', e => {
     const step = e.shiftKey ? 10 : 2;
     const map = { ArrowLeft: pos - step, ArrowRight: pos + step, Home: 0, End: 100 };
     if (e.key in map) { e.preventDefault(); set(map[e.key]); }
   });
   set(50);
 });

 /* Navegação entre as comparações */
 document.querySelectorAll('[data-ba-group]').forEach(group => {
   const items = [...group.querySelectorAll('[data-ba-item]')];
   const count = group.querySelector('[data-ba-count]');
   let idx = 0;
   const show = n => {
     idx = (n + items.length) % items.length;
     items.forEach((it, i) => { it.hidden = i !== idx; });
     if (count) count.textContent = String(idx + 1).padStart(2, '0') + ' / ' + String(items.length).padStart(2, '0');
   };
   const prev = group.querySelector('[data-ba-prev]'), next = group.querySelector('[data-ba-next]');
   if (prev) prev.addEventListener('click', () => show(idx - 1));
   if (next) next.addEventListener('click', () => show(idx + 1));
   show(0);
 });

 /* Galeria editorial: selo de resultado real e composição em 12 colunas */
 const galleryItems = [...document.querySelectorAll('.gallery-item')];
 galleryItems.forEach(el => { el.dataset.badge = el.dataset.caption ? 'Resultado real' : 'Imagem demonstrativa'; });
 const pattern = [7, 5, 5, 7];
 const layoutGallery = () => {
   const visible = galleryItems.filter(el => !el.hidden);
   const spans = visible.map((_, i) => pattern[i % 4]);
   let sum = 0;
   spans.forEach(sp => { sum += sp; if (sum >= 12) sum = 0; });
   /* Última linha incompleta: a última fotografia ocupa o espaço restante */
   if (sum > 0 && spans.length) spans[spans.length - 1] += 12 - sum;
   visible.forEach((el, i) => {
     const span = spans[i];
     el.style.gridColumn = 'span ' + span;
     el.classList.toggle('wide', span === 7 && wide.matches);
     el.classList.toggle('full', span === 12 && wide.matches);
   });
 };
 if (galleryItems.length) {
   layoutGallery();
   document.querySelectorAll('[data-filter]').forEach(b => b.addEventListener('click', () => setTimeout(layoutGallery, 0)));
   wide.addEventListener('change', layoutGallery);
 }
})();

/* ===== Movimento progressivo e controles de rolagem ===== */
(function(){
 const root=document.documentElement;
 const revealSelector='.section-heading,.service-card,.space-copy,.about-copy,.section-intro,.gallery-item,.ba-group,.space-photo,.about-logo,.booking-panel,.contact-hero .butterfly,.contact-card,.contact-map,.home-gallery-card,.review-grid > *, .demonstrative';
 if(!prefersReducedMotion&&'IntersectionObserver' in window){
  /* Revelação palavra a palavra com o texto acessível preservado. */
  const splitWords=el=>{
   if(el.dataset.split)return el;
   el.dataset.split='1';
   const text=el.textContent.replace(/\s+/g,' ').trim();
   if(!text)return el;
   el.setAttribute('aria-label',text);
   let wi=0;
   const walker=document.createTreeWalker(el,NodeFilter.SHOW_TEXT);
   const textNodes=[];
   while(walker.nextNode())textNodes.push(walker.currentNode);
   textNodes.forEach(node=>{
    const fragment=document.createDocumentFragment();
    node.textContent.split(/(\s+)/).forEach(part=>{
     if(!part)return;
     if(/^\s+$/.test(part)){fragment.append(document.createTextNode(' '));return;}
     const word=document.createElement('span');word.className='w';word.style.setProperty('--wi',String(wi++));word.textContent=part;fragment.append(word);
    });
    node.replaceWith(fragment);
   });
   const ghost=document.createElement('span');ghost.className='split-ghost';ghost.setAttribute('aria-hidden','true');
   while(el.firstChild)ghost.append(el.firstChild);
   el.append(ghost);el.classList.add('split');
   return el;
  };
  const splitTargets=[...document.querySelectorAll('main h1, main h2, .hero-description, .script')].map(splitWords);
  const targets=[...document.querySelectorAll(revealSelector),...splitTargets];
  if(targets.length){
   let observerStarted=false;
   const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
    observerStarted=true;
    if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target);}
   }),{threshold:.08,rootMargin:'0px 0px -4% 0px'});
   targets.forEach((el,index)=>{el.classList.add('reveal');el.style.setProperty('--reveal-index',String(index%5));observer.observe(el);});
   root.classList.add('motion-ready');
   window.setTimeout(()=>{
    if(observerStarted)return;
    observer.disconnect();root.classList.remove('motion-ready');
    targets.forEach(el=>el.classList.add('is-visible'));
   },1800);
  }
 }

 /* A revelação palavra a palavra agora cobre todos os títulos e frases
    pelo sistema unificado aplicado junto ao observador de rolagem. */

 const header=document.querySelector('.site-header');
 const progress=document.createElement('div');progress.className='scroll-progress';progress.setAttribute('aria-hidden','true');
 const topButton=document.createElement('button');topButton.className='back-to-top';topButton.type='button';topButton.setAttribute('aria-label','Voltar ao topo');topButton.tabIndex=-1;
 topButton.innerHTML='<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="m6 14 6-6 6 6"/><path d="M12 8v12"/></svg>';
 document.body.append(progress,topButton);
 topButton.addEventListener('click',()=>window.scrollTo({top:0,behavior:prefersReducedMotion?'auto':'smooth'}));

 const heroImg=document.querySelector('.hero-image');
 const allowHeroParallax=window.matchMedia('(min-width: 761px)').matches;
 let frame=0;
 const updateScrollFeedback=()=>{
  frame=0;
  const scrollable=document.documentElement.scrollHeight-window.innerHeight;
  progress.style.transform=`scaleX(${scrollable>0?Math.min(1,Math.max(0,window.scrollY/scrollable)):0})`;
  const scrolled=window.scrollY>18;
  if(header)header.classList.toggle('is-scrolled',scrolled);
  topButton.classList.toggle('is-visible',window.scrollY>600);
  topButton.tabIndex=window.scrollY>600?0:-1;
  if(heroImg&&!prefersReducedMotion&&allowHeroParallax){
   const hero=document.querySelector('.hero');
   const offset=hero?Math.max(0,Math.min(hero.offsetHeight,window.scrollY-hero.offsetTop)):0;
   heroImg.style.transform=`translate3d(0,${(offset*.1).toFixed(1)}px,0) scale(1.08)`;
  }
  if(!prefersReducedMotion&&allowHeroParallax){
   const hero=document.querySelector('.hero');
   const y=hero?Math.min(Math.max(0,window.scrollY),hero.offsetHeight||0):window.scrollY;
   const butterfly=hero?hero.querySelector('.hero-butterfly .butterfly'):null;
   const signature=hero?hero.querySelector('.hero-signature'):null;
   if(butterfly)butterfly.style.transform=`translate3d(0,${(y*.16).toFixed(1)}px,0)`;
   if(signature)signature.style.transform=`translate3d(0,${(-y*.05).toFixed(1)}px,0)`;
  }
 };
 const requestScrollUpdate=()=>{if(!frame)frame=requestAnimationFrame(updateScrollFeedback);};
 window.addEventListener('scroll',requestScrollUpdate,{passive:true});
 window.addEventListener('resize',requestScrollUpdate,{passive:true});
 updateScrollFeedback();
})();

/* ===== Rolagem fluida (inércia suave no desktop) ===== */
(function(){
 if(prefersReducedMotion)return;
 if(window.matchMedia('(pointer: coarse)').matches)return;
 let target=window.scrollY,current=target,raf=0;
 const maxScroll=()=>Math.max(0,document.documentElement.scrollHeight-window.innerHeight);
 const scrollToY=y=>{
  try{window.scrollTo({top:y,behavior:'instant'});}
  catch(_){
   const prev=document.documentElement.style.scrollBehavior;
   document.documentElement.style.scrollBehavior='auto';window.scrollTo(0,y);document.documentElement.style.scrollBehavior=prev;
  }
 };
 const loop=()=>{
  current+=(target-current)*.115;
  if(Math.abs(target-current)<.5)current=target;
  scrollToY(Math.round(current));
  raf=current!==target?requestAnimationFrame(loop):0;
 };
 window.addEventListener('scroll',()=>{if(raf)return;target=window.scrollY;current=target;},{passive:true});
 window.addEventListener('wheel',e=>{
  if(e.ctrlKey)return;
  if(e.target&&e.target.closest&&e.target.closest('dialog[open],.mobile-nav'))return;
  const delta=Math.max(-180,Math.min(180,e.deltaY));
  if(!delta)return;
  e.preventDefault();
  if(!raf){target=window.scrollY;current=target;}
  target=Math.max(0,Math.min(maxScroll(),target+delta));
  if(!raf)raf=requestAnimationFrame(loop);
 },{passive:false});
 window.addEventListener('load',()=>{target=window.scrollY;current=target;});
})();

/* ===== Efeitos na parte inicial (hero) ===== */
(function(){
 const hero=document.querySelector('.hero');
 if(!hero||prefersReducedMotion)return;
 /* Pétalas delicadas flutuando pelo fundo */
 const layer=document.createElement('div');layer.className='hero-petals';layer.setAttribute('aria-hidden','true');
 const count=window.matchMedia('(max-width: 700px)').matches?9:14;
 for(let i=0;i<count;i++){
  const p=document.createElement('span');p.className='petal'+(i%4===0?' alt':'');
  p.style.setProperty('--size',(6+Math.random()*9).toFixed(1)+'px');
  p.style.setProperty('--x',(4+Math.random()*92).toFixed(1)+'%');
  p.style.setProperty('--delay',(-Math.random()*20).toFixed(1)+'s');
  p.style.setProperty('--dur',(15+Math.random()*11).toFixed(1)+'s');
  p.style.setProperty('--sway',(Math.random()*22-11).toFixed(1)+'px');
  p.style.setProperty('--rot',(Math.random()*360|0)+'deg');
  layer.append(p);
 }
 hero.prepend(layer);
 /* Brilho suave que acompanha o cursor (desativado em telas de toque) */
 if(!window.matchMedia('(pointer: coarse)').matches){
  const glow=document.createElement('div');glow.className='hero-mouse-glow';glow.setAttribute('aria-hidden','true');
  hero.append(glow);
  let gx=innerWidth/2,gy=220,tx=gx,ty=gy,grf=0;
  const tick=()=>{
   grf=0;gx+=(tx-gx)*.1;gy+=(ty-gy)*.1;
   glow.style.transform=`translate3d(${(gx-190).toFixed(1)}px,${(gy-190).toFixed(1)}px,0)`;
   if(Math.abs(tx-gx)>.4||Math.abs(ty-gy)>.4)grf=requestAnimationFrame(tick);
  };
  hero.addEventListener('pointerenter',()=>{glow.style.opacity='1';});
  hero.addEventListener('pointermove',e=>{const r=hero.getBoundingClientRect();tx=e.clientX-r.left;ty=e.clientY-r.top;if(!grf)grf=requestAnimationFrame(tick);});
  hero.addEventListener('pointerleave',()=>{glow.style.opacity='0';});
 }
 /* Pausa os efeitos quando o hero sai da tela */
 if('IntersectionObserver' in window){
  new IntersectionObserver(entries=>entries.forEach(en=>hero.classList.toggle('is-off',!en.isIntersecting)),{threshold:.02}).observe(hero);
 }
})();

/* ===== Transição suave entre páginas ===== */
(function(){
 if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
 document.addEventListener('click', e => {
   const a = e.target.closest && e.target.closest('a[href]');
   if (!a || a.target || a.hasAttribute('download') || e.defaultPrevented) return;
   if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
   const url = new URL(a.href, location.href);
   if (url.origin !== location.origin || !url.pathname.endsWith('.html')) return;
   if (url.pathname === location.pathname && url.hash) return;
   e.preventDefault();
   document.body.classList.add('is-leaving');
   setTimeout(() => { location.href = url.href; }, 230);
 });
 window.addEventListener('pageshow', () => document.body.classList.remove('is-leaving'));
})();
