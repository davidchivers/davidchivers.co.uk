'use strict';
const $ = id => document.getElementById(id);
const ns = 'http://www.w3.org/2000/svg';
const posX = x => 70 + x * 530 / 12;
const posY = y => 330 - y * 280 / 6;
const money = n => n.toLocaleString('en-GB',{style:'currency',currency:'GBP',minimumFractionDigits:Number.isInteger(n)?0:2,maximumFractionDigits:2});
const number = n => Number(n.toFixed(2)).toLocaleString('en-GB');
const controls = {m: $('income'), p: $('price'), x: $('coffees'), y: $('lunches')};
let state = {m:24,p:3,x:4,y:2};
function svgEl(tag, attrs, text) {
  const el = document.createElementNS(ns,tag);
  for (const [k,v] of Object.entries(attrs)) el.setAttribute(k,String(v));
  if(text!==undefined)el.textContent=text;
  return el;
}
for(let x=2;x<=12;x+=2){
  $('grid').append(svgEl('path',{d:`M${posX(x)} 50 V330`,stroke:'#ececef','stroke-width':1}));
  if(x!==8)$('grid').append(svgEl('text',{x:posX(x),y:351,fill:'#56616b','font-size':13,'text-anchor':'middle'},x));
}
for(let y=1;y<=6;y++){
  $('grid').append(svgEl('path',{d:`M70 ${posY(y)} H600`,stroke:'#ececef','stroke-width':1}));
  if(y!==4)$('grid').append(svgEl('text',{x:50,y:posY(y)+5,fill:'#56616b','font-size':13,'text-anchor':'middle'},y));
}
$('affordable-area').setAttribute('opacity','.75');
function update(syncFields=true){
  const {m,p,x,y}=state, result=budgetModel(m,p,x,y);
  if(syncFields)for(const [key,el] of Object.entries(controls))el.value=state[key];
  $('income-value').textContent=money(m);$('price-value').textContent=money(p);
  const edge=`M70 ${posY(result.lunchIntercept)} L${posX(result.coffeeIntercept)} 330`;
  $('budget-line').setAttribute('d',edge);
  $('affordable-area').setAttribute('d',`${edge} L70 330 Z`);
  $('bundle-point').setAttribute('cx',posX(x));$('bundle-point').setAttribute('cy',posY(y));
  $('bundle-point').setAttribute('aria-label',`Chosen basket: ${number(x)} coffees and ${number(y)} lunches. Use arrow keys to move.`);
  $('bundle-label').setAttribute('x',posX(x)+(x>9?-16:16));
  $('bundle-label').setAttribute('y',posY(y)+(y>5?27:-16));
  $('bundle-label').setAttribute('text-anchor',x>9?'end':'start');
  $('guides').setAttribute('d',`M${posX(x)} 330 V${posY(y)} H70`);
  $('intercept-labels').replaceChildren();
  for(const [xx,yy] of [[0,result.lunchIntercept],[result.coffeeIntercept,0]])$('intercept-labels').append(svgEl('circle',{cx:posX(xx),cy:posY(yy),r:4,fill:'#68246d'}));
  $('substitution').textContent=`${number(p)} × ${number(x)} + 6 × ${number(y)} = ${money(result.spent)}`;
  const status=$('basket-status');status.className='basket-status '+result.position;
  status.querySelector('.status-label').textContent={on:'Exactly on your budget',under:'Affordable, with money left',over:'Outside your budget'}[result.position];
  status.querySelector('strong').textContent=`${money(result.spent)} spent · ${result.remaining>=0?money(result.remaining)+' left':money(-result.remaining)+' over'}`;
  const shift=p===3?(m===24?'You are back at the starting budget.':`At unchanged prices, ${m>24?'more':'less'} income shifts the line ${m>24?'outwards':'inwards'} in parallel.`):`A higher coffee price makes the line steeper. At this income, the lunch intercept stays ${number(result.lunchIntercept)} because its price is unchanged.`;
  $('insight-text').textContent=`${shift} The intercepts are ${number(result.coffeeIntercept)} coffees and ${number(result.lunchIntercept)} lunches. One extra coffee costs ${number(-result.slope)} ${-result.slope===1?'lunch':'lunches'} along the line.`;
  $('chart-desc').textContent=`Budget ${money(m)}; coffee ${money(p)}; lunch £6. The line joins ${number(result.coffeeIntercept)} coffees to ${number(result.lunchIntercept)} lunches. Your basket has ${number(x)} coffees and ${number(y)} lunches, costs ${money(result.spent)}, and is ${result.position==='over'?'unaffordable':result.position==='on'?'exactly on the budget line':'affordable with money left over'}.`;
}
for(const key of ['m','p'])controls[key].addEventListener('input',()=>{state[key]=+controls[key].value;update(false)});
for(const key of ['x','y'])controls[key].addEventListener('change',()=>{
  const n=Number(controls[key].value);state[key]=Math.round(Math.min(key==='x'?12:6,Math.max(0,Number.isFinite(n)?n:0))*2)/2;update();
});
$('reset').addEventListener('click',()=>{state={m:24,p:3,x:4,y:2};update()});
document.querySelectorAll('[data-preset]').forEach(b=>b.addEventListener('click',()=>{state=b.dataset.preset==='income'?{m:36,p:3,x:4,y:2}:{m:24,p:6,x:4,y:2};update()}));
const chart=$('budget-chart'),point=$('bundle-point');
point.setAttribute('tabindex','0');point.setAttribute('role','button');point.setAttribute('aria-describedby','chart-help');
point.addEventListener('keydown',e=>{
  const changes={ArrowLeft:['x',-.5],ArrowRight:['x',.5],ArrowDown:['y',-.5],ArrowUp:['y',.5]};
  if(!changes[e.key])return;e.preventDefault();const[k,d]=changes[e.key];state[k]=Math.max(0,Math.min(k==='x'?12:6,state[k]+d));update();
});
function moveBasket(event){
  const point=chart.createSVGPoint();point.x=event.clientX;point.y=event.clientY;
  const local=point.matrixTransform(chart.getScreenCTM().inverse());
  state.x=Math.max(0,Math.min(12,Math.round((local.x-70)*12/530*2)/2));
  state.y=Math.max(0,Math.min(6,Math.round((330-local.y)*6/280*2)/2));update();
}
let dragId=null;
chart.addEventListener('pointerdown',e=>{if(e.button!==0)return;dragId=e.pointerId;chart.setPointerCapture(dragId);moveBasket(e)});
chart.addEventListener('pointermove',e=>{if(e.pointerId===dragId)moveBasket(e)});
for(const event of ['pointerup','pointercancel','lostpointercapture'])chart.addEventListener(event,()=>{dragId=null});
const questions=[
 {q:'You buy two coffees. What is the most lunch you can afford?',options:['2 lunches','3 lunches','4 lunches'],answer:1,why:'Two coffees cost £6. That leaves £18, which buys three lunches. The bundle (2, 3) is on the budget line.',wrong:['Two lunches would leave £6 unspent: enough for one more lunch.','Four lunches plus two coffees would cost £30, above the £24 budget.']},
 {q:'Your income rises to £36 and both prices stay the same. What happens?',options:['The line shifts outwards in parallel','Only the coffee intercept changes','The budget line becomes steeper'],answer:0,why:'Both intercepts rise: from 8 to 12 coffees and from 4 to 6 lunches. The price ratio stays 3/6, so the slope stays −0.5.',wrong:['Both intercepts depend on income, so both change.','The slope depends on relative prices. Neither price has changed.']},
 {q:'With the original £24 budget, coffee rises to £6. What stays the same?',options:['The maximum number of coffees','The maximum number of lunches','The slope of the budget line'],answer:1,why:'You can still buy four lunches if you buy no coffee. The coffee intercept falls from 8 to 4; the line pivots inwards and its slope becomes −1.',wrong:['The coffee intercept falls because coffee is now more expensive.','The relative price changes from 3/6 to 6/6, so the line becomes steeper.']}
];
let qi=0;
function showQuestion(){
 const q=questions[qi];$('question-text').textContent=q.q;document.querySelector('.question-count').textContent=`0${qi+1} / 03`;
 $('feedback').textContent='';$('next-question').hidden=true;$('next-question').textContent=qi===2?'Start the practice again ↺':'Next question →';
 $('answers').replaceChildren();q.options.forEach((text,i)=>{const b=document.createElement('button');b.type='button';b.textContent=text;b.addEventListener('click',()=>{
  if(i===q.answer){b.className='correct';$('feedback').textContent='Yes. '+q.why;$('next-question').hidden=false;[...$('answers').children].forEach(e=>e.disabled=true)}
  else{b.className='wrong';const incorrect=q.options.map((_,k)=>k).filter(k=>k!==q.answer);$('feedback').textContent=q.wrong[incorrect.indexOf(i)]+' Try again.'}
 });$('answers').append(b)});
}
$('next-question').addEventListener('click',()=>{qi=(qi+1)%questions.length;showQuestion();$('answers').querySelector('button').focus()});
update();showQuestion();chart.classList.add('enhanced');document.body.classList.add('enhanced');
