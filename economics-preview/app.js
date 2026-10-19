// No analytics, third-party embeds, accounts or form submissions.
const menuButton=document.querySelector('.menu-toggle');
const nav=document.querySelector('.nav');
function closeMenu(){if(!menuButton||!nav)return;menuButton.setAttribute('aria-expanded','false');menuButton.setAttribute('aria-label','Open navigation');nav.classList.remove('open')}
menuButton?.addEventListener('click',()=>{const open=menuButton.getAttribute('aria-expanded')!=='true';menuButton.setAttribute('aria-expanded',String(open));menuButton.setAttribute('aria-label',open?'Close navigation':'Open navigation');nav.classList.toggle('open',open)});
nav?.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeMenu();}});
window.matchMedia('(min-width:701px)').addEventListener('change',e=>{if(e.matches)closeMenu()});

const tabs=[...document.querySelectorAll('[role=tab]')];
function selectJourney(id,focus=false){
 tabs.forEach(tab=>{const active=tab.getAttribute('aria-controls')===id;tab.setAttribute('aria-selected',String(active));tab.tabIndex=active?0:-1;const panel=document.getElementById(tab.getAttribute('aria-controls'));if(panel)panel.hidden=!active;if(active&&focus)tab.focus();});
}
tabs.forEach((tab,i)=>{tab.addEventListener('click',()=>selectJourney(tab.getAttribute('aria-controls')));tab.addEventListener('keydown',e=>{let next=i;if(e.key==='ArrowRight')next=(i+1)%tabs.length;else if(e.key==='ArrowLeft')next=(i-1+tabs.length)%tabs.length;else if(e.key==='Home')next=0;else if(e.key==='End')next=tabs.length-1;else return;e.preventDefault();selectJourney(tabs[next].getAttribute('aria-controls'),true);});});
document.querySelectorAll('[data-journey]').forEach(link=>link.addEventListener('click',()=>selectJourney(link.dataset.journey)));
if(location.hash==='#students')selectJourney('students');
if(location.hash==='#joining')selectJourney('joining');

const dialog=document.querySelector('#preview-dialog');
document.querySelectorAll('[data-preview]').forEach(button=>button.addEventListener('click',()=>dialog?.showModal()));
document.querySelector('.close-dialog')?.addEventListener('click',()=>dialog.close());
dialog?.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});

const shareButton=document.querySelector('[data-share]');
shareButton?.addEventListener('click',async()=>{
 const label=shareButton.querySelector('span');
 try{await navigator.clipboard.writeText(location.href);label.textContent='Link copied';setTimeout(()=>{label.textContent='Copy this page’s link'},2500);}
 catch{label.textContent='Copy the address from your browser';}
});
