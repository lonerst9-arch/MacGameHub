'use strict';
const $ = s => document.querySelector(s);
const KEY = 'macgamehub-v1';
const seeds = [
 {id:'astral',title:'Astral Drift',genre:'Space adventure',source:'Steam',compat:'Ready',installed:true,colors:['#527977','#102c38'],description:'Chart a course through forgotten star systems. Explore quiet moons and discover what lies beyond the familiar.'},
 {id:'neon',title:'Neon Circuit',genre:'Arcade racing',source:'Epic Games',compat:'Ready',installed:true,colors:['#9b315e','#261647'],description:'Chase the last light through a neon city. A fictional racing adventure for the prototype library.'},
 {id:'hollow',title:'Hollow Kingdom',genre:'Action RPG',source:'GOG',compat:'Experimental',installed:false,colors:['#827554','#202f23'],description:'Step into an ancient kingdom reclaimed by the forest. Experimental is an example status, not a compatibility verdict.'},
 {id:'ember',title:'Ember Valley',genre:'Cozy adventure',source:'Steam',compat:'Ready',installed:false,colors:['#ba754b','#493b40'],description:'Build a quiet home beneath an autumn sky. Discover trails, meet neighbors, and find your own pace.'},
 {id:'deep',title:'Deep Signal',genre:'Exploration',source:'Local game',compat:'Experimental',installed:false,colors:['#357fa0','#101d39'],description:'Follow a mysterious signal into the blue. Explore a fictional underwater world.'},
 {id:'orbit',title:'Orbit Zero',genre:'Strategy',source:'Steam',compat:'Ready',installed:true,colors:['#747396','#222537'],description:'Build your outpost at the edge of a new solar system. Every decision shapes your next frontier.'}
];
let state={games:seeds.map(g=>({...g,favorite:false,preset:'Balanced'})),defaultPreset:'Balanced',reduceMotion:false};
try{const saved=JSON.parse(localStorage.getItem(KEY));if(saved&&Array.isArray(saved.games)&&saved.games.every(g=>typeof g.id==='string'&&typeof g.title==='string'&&Array.isArray(g.colors)&&g.colors.every(c=>/^#[0-9a-f]{6}$/i.test(c))))state={...state,...saved};}catch{}
const poe = {id:'poe-real',title:'Path of Exile',genre:'Action RPG',source:'GameHub · Steam',compat:'Local launch',installed:false,favorite:false,preset:'Balanced',colors:['#83633b','#231c19'],description:'Open your installed Steam copy through the GameHub app on this Mac. Requires GameHub and Path of Exile to be installed. This website cannot detect whether the game is installed or running.'};
if(!state.games.some(g=>g.id===poe.id))state.games.push(poe);
let view='all', filter='all', selected=null;const jobs=new Map();
function save(){try{localStorage.setItem(KEY,JSON.stringify(state));}catch{toast('Browser storage unavailable. Changes last for this session only.');}}
function toast(message){$('#toast').textContent=message;$('#toast').hidden=false;clearTimeout(toast.timer);toast.timer=setTimeout(()=>$('#toast').hidden=true,3500);}
function el(tag,cls,text){const n=document.createElement(tag);if(cls)n.className=cls;if(text!==undefined)n.textContent=text;return n;}
function cover(g){const n=el('div','cover');n.style.setProperty('--c1',g.colors[0]);n.style.setProperty('--c2',g.colors[1]);n.append(el('span','badge',g.source),el('span','cover-title',g.title));return n;}
function render(){const grid=$('#games');grid.replaceChildren();const query=$('#search').value.trim().toLowerCase();let games=state.games.filter(g=>(view!=='installed'||g.installed)&&(view!=='favorites'||g.favorite)&&(filter==='all'||g.compat===filter)&&g.title.toLowerCase().includes(query));if($('#sort').value==='name')games.sort((a,b)=>a.title.localeCompare(b.title));else games=[...games].reverse();for(const g of games){const card=el('button','game');card.setAttribute('aria-label',`Open ${g.title} details`);card.append(cover(g));const info=el('div','game-info');info.append(el('h3','',g.title));const row=el('div','game-row');row.append(el('span','',g.installed?'● Installed':g.genre),el('span','compat '+g.compat.toLowerCase(),(g.compat==='Ready'?'● ':'◌ ')+g.compat));info.append(row);card.append(info);card.onclick=()=>openGame(g.id);grid.append(card);}$('#empty').hidden=games.length>0;$('#count').textContent=state.games.length;}
const presetNotes={Performance:'Prioritize frame rate with lighter visual settings. Simulation only.',Balanced:'A balance between visual detail and responsiveness. Simulation only.',Quality:'Prioritize visual detail over frame rate. Simulation only.'};
function openGame(id){selected=state.games.find(g=>g.id===id);$('#detail-title').textContent=selected.title;$('#description').textContent=selected.description||'Your custom game library entry. Runtime and compatibility have not been tested.';$('#detail-art').replaceChildren(cover(selected));$('#metadata').replaceChildren(...[selected.genre,selected.source,selected.id==='poe-real'?'Requires installed GameHub':selected.compat+' · illustrative'].map(v=>el('span','',v)));updateDetail();$('#detail').showModal();}
function updateDetail(){
 const g=selected;if(!g)return;const real=g.id==='poe-real';
 document.querySelector('.presets').hidden=false;document.querySelector('#detail h3').hidden=false;$('#preset-note').hidden=false;
 $('#detail .notice').textContent=real?'MacGameHub makes setup simple: choose Performance, Balanced or Quality, then start the game. We configure Path of Exile through the local Bridge and back up the current config first. If GameHub is missing, Start Game opens its official download page.':'This is a UI simulation. Compatibility labels are illustrative, not tested results. Your browser cannot run Wine or Windows executables.';
 document.querySelectorAll('[data-preset]').forEach(b=>{b.classList.toggle('selected',b.dataset.preset===g.preset);b.setAttribute('aria-pressed',String(b.dataset.preset===g.preset));});
 $('#preset-note').textContent=real?'Choose a preset, approve Open MacGameHub Bridge if prompted, then open the game.':presetNotes[g.preset]||presetNotes.Balanced;
 $('#favorite').textContent=g.favorite?'♥ Favorited':'♡ Favorite';$('#favorite').setAttribute('aria-pressed',String(g.favorite));
 if(real){$('#launch').disabled=false;$('#launch').textContent='▶ Start Game';$('#game-status').textContent='Easy setup: choose a preset once, then start playing.';return;}
 const job=jobs.get(g.id);$('#launch').disabled=job==='install';$('#launch').textContent=job==='install'?'Installing demo…':job==='play'?'■ Stop demo':g.installed?'▶ Play demo':'↓ Install demo';$('#game-status').textContent=job==='play'?'Demo session running — no executable was launched.':job==='install'?'Simulating installation — no files are downloaded.':g.installed?'Installed in this simulated library.':'Available to install in the simulated library.';
}
$('#launch').onclick=()=>{
 const g=selected;
 if(g.id==='poe-real'){
  let handedOff=false;
  const cancelFallback=()=>{handedOff=true;window.removeEventListener('blur',cancelFallback);document.removeEventListener('visibilitychange',onVisibility);};
  const onVisibility=()=>{if(document.hidden)cancelFallback();};
  window.addEventListener('blur',cancelFallback,{once:true});document.addEventListener('visibilitychange',onVisibility);
  $('#game-status').textContent='Opening GameHub… If it is not installed, we will take you to the official download page.';
  window.location.href='gamehub://launch/steam/238960';
  setTimeout(()=>{window.removeEventListener('blur',cancelFallback);document.removeEventListener('visibilitychange',onVisibility);if(!handedOff&&document.visibilityState==='visible')window.location.href='https://www.gamemac.com/en';},2500);
  return;
 }
 if(jobs.get(g.id)==='play'){jobs.delete(g.id);updateDetail();return;}
 if(g.installed){jobs.set(g.id,'play');updateDetail();return;}
 jobs.set(g.id,'install');updateDetail();setTimeout(()=>{g.installed=true;jobs.delete(g.id);save();render();if(selected?.id===g.id)updateDetail();toast(g.title+' demo installation complete');},1800);
};
$('#favorite').onclick=()=>{selected.favorite=!selected.favorite;save();updateDetail();render();};
document.querySelectorAll('[data-preset]').forEach(b=>b.onclick=()=>{selected.preset=b.dataset.preset;save();if(selected.id==='poe-real'){window.location.href=`macgamehub://preset/${b.dataset.preset.toLowerCase()}`;$('#game-status').textContent=`${b.dataset.preset} preset request sent to MacGameHub Bridge. Close and reopen the game to use it.`;}else{updateDetail();}});
document.querySelectorAll('[data-view]').forEach(b=>b.onclick=()=>{view=b.dataset.view;document.querySelectorAll('[data-view]').forEach(n=>{n.classList.toggle('active',n===b);n.setAttribute('aria-pressed',String(n===b));});render();});
document.querySelectorAll('[data-filter]').forEach(b=>b.onclick=()=>{filter=b.dataset.filter;document.querySelectorAll('[data-filter]').forEach(n=>{n.classList.toggle('selected',n===b);n.setAttribute('aria-pressed',String(n===b));});render();});
document.querySelectorAll('[data-close]').forEach(b=>b.onclick=()=>b.closest('dialog').close());
$('#search').oninput=render;$('#sort').onchange=render;$('#featured').onclick=()=>openGame('astral');$('#add').onclick=()=>$('#add-dialog').showModal();
$('#add-form').onsubmit=e=>{e.preventDefault();const data=new FormData(e.target);const title=data.get('title').trim();if(!title){toast('Please enter a game title.');return;}state.games.push({id:'custom-'+Date.now()+'-'+Math.random().toString(36).slice(2),title,genre:data.get('genre'),source:data.get('source'),compat:'Untested',installed:false,favorite:false,preset:state.defaultPreset,colors:['#557577','#29253f']});save();view='all';filter='all';$('#search').value='';document.querySelector('[data-view="all"]').click();document.querySelector('[data-filter="all"]').click();$('#add-dialog').close();e.target.reset();render();toast('Game added to your local library');};
$('#settings').onclick=()=>{$('#default-preset').value=state.defaultPreset;$('#reduce-motion').checked=state.reduceMotion;$('#settings-dialog').showModal();};$('#default-preset').onchange=e=>{state.defaultPreset=e.target.value;save();};$('#reduce-motion').onchange=e=>{state.reduceMotion=e.target.checked;document.body.classList.toggle('reduce-motion',state.reduceMotion);save();};document.body.classList.toggle('reduce-motion',state.reduceMotion);render();
