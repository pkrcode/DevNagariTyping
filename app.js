"use strict";
/* DevNagariTyping browser prototype: Learn, Test, Game, and Progress. */
const STORAGE_KEY = "devnagariTyping.v1";
const KEY_CODES = {};
for (let i=0;i<26;i++) KEY_CODES["Key"+String.fromCharCode(65+i)] = String.fromCharCode(97+i);
for (let i=0;i<=9;i++) KEY_CODES["Digit"+i] = String(i);
Object.assign(KEY_CODES,{Backquote:"`",Semicolon:";",Quote:"'",BracketLeft:"[",BracketRight:"]",Comma:",",Period:".",Slash:"/",Backslash:"\\",Minus:"-",Equal:"="});
const FINGERS = [
  ["left-pinky","बायाँ छोटी उंगली","number top home bottom",["`","1","q","a","z"]],
  ["left-ring","बायाँ अनामिका","number top home bottom",["2","w","s","x"]],
  ["left-middle","बायाँ मध्यमा","number top home bottom",["3","e","d","c"]],
  ["left-index","बायाँ तर्जनी","number top home bottom",["4","5","r","t","f","g","v","b"]],
  ["right-index","दायाँ तर्जनी","number top home bottom",["6","7","y","u","h","j","n","m"]],
  ["right-middle","दायाँ मध्यमा","number top home bottom",["8","i","k",","]],
  ["right-ring","दायाँ अनामिका","number top home bottom",["9","o","l","."]],
  ["right-pinky","दायाँ छोटी उंगली","number top home bottom",["0","-","=","p","[","]","\\",";","'","/"]]
];
/* Layout data lives in layouts.js; practice text and game groups live in content.js. */
const WORDS=WORD_BANK;
function graphemeClusters(text){
 if(typeof Intl!=="undefined"&&Intl.Segmenter){return Array.from(new Intl.Segmenter("hi",{granularity:"grapheme"}).segment(text),x=>x.segment);}
 const out=[];for(const ch of text){if(/[\u093e-\u094d\u0951-\u0957\u0962-\u0963]/u.test(ch)&&out.length)out[out.length-1]+=ch;else out.push(ch);}return out;
}
function loadState(){try{return JSON.parse(localStorage.getItem(STORAGE_KEY))||{};}catch{return {};}}
let state=Object.assign({layout:null,completedChapters:{},keyErrors:{},history:[]},loadState());
let app={layout:null,chapters:[],currentChapter:null,mode:null,expected:[],cursor:0,errors:0,typed:[],test:null,game:null};
function saveState(){try{localStorage.setItem(STORAGE_KEY,JSON.stringify(state));}catch{}}
function $(q){return document.querySelector(q);}
function el(tag,cls,txt){const n=document.createElement(tag);if(cls)n.className=cls;if(txt!==undefined)n.textContent=txt;return n;}
function showScreen(name){document.querySelectorAll(".screen").forEach(s=>s.classList.remove("active"));const target=$("#screen-"+name);if(target)target.classList.add("active");document.querySelectorAll(".app-nav button").forEach(b=>b.classList.toggle("active",b.id==="nav-"+name));window.scrollTo(0,0);}
function buildChapters(layout){
 const chapters=[],rows=["number","top","home","bottom"];
 for(const row of rows){const keys=Object.entries(layout.keys).filter(([,v])=>v.row===row&&v.base);for(const finger of [...new Set(keys.map(([,v])=>v.finger))]){const group=keys.filter(([,v])=>v.finger===finger);if(group.length)chapters.push({id:row+"-"+finger,type:"letters",title:(row==="number"?"अंक पंक्ति":row==="top"?"ऊपरी पंक्ति":row==="home"?"होम पंक्ति":"निचली पंक्ति")+" — "+fingerLabel(finger),prompts:group.flatMap(([key,d])=>[{key,shift:false,char:d.base},...(d.shift?[{key,shift:true,char:d.shift}]:[])])});}}
 chapters.push({id:"combined-keys",type:"letters",title:"सभी कुंजियाँ — मिश्रित अभ्यास",prompts:Object.entries(layout.keys).filter(([,d])=>d.base).flatMap(([key,d])=>[{key,shift:false,char:d.base},...(d.shift?[{key,shift:true,char:d.shift}]:[])])});
 chapters.push({id:"common-words",type:"words",title:"सामान्य हिंदी शब्द",prompts:WORDS});
 PARAGRAPHS.forEach((p,i)=>chapters.push({id:"paragraph-"+i,type:"paragraph",title:p.title,prompts:p.text}));
 return chapters;
}
function fingerLabel(id){return ({ "left-pinky":"बायाँ छोटी उंगली","left-ring":"बायाँ अनामिका","left-middle":"बायाँ मध्यमा","left-index":"बायाँ तर्जनी","right-index":"दायाँ तर्जनी","right-middle":"दायाँ मध्यमा","right-ring":"दायाँ अनामिका","right-pinky":"दायाँ छोटी उंगली"})[id]||id;}
function completedCount(){return Object.keys(state.completedChapters[app.layout.id]||{}).length;}
function weakKeys(limit=8){return Object.entries((state.keyErrors||{})[app.layout?.id]||{}).sort((a,b)=>b[1]-a[1]).slice(0,limit);}
function init(){
 $("#nav-home").onclick=()=>{renderHome();showScreen("home");};
 $("#nav-learn").onclick=()=>{renderChapterList();showScreen("learn-list");};
 $("#nav-test").onclick=()=>{renderTestSetup();showScreen("test-setup");};
 $("#nav-game").onclick=()=>{renderGameSetup();showScreen("game-setup");};
 $("#nav-progress").onclick=()=>{renderProgress();showScreen("progress");};
 $("#nav-switch-layout").onclick=()=>showScreen("onboarding");
 $("#test-start-btn").onclick=()=>startTest(Number(document.querySelector("[data-duration].selected")?.dataset.duration||60));
 document.querySelectorAll("[data-duration]").forEach(b=>b.onclick=()=>{document.querySelectorAll("[data-duration]").forEach(x=>x.classList.remove("selected"));b.classList.add("selected");});
 $("#test-quit-btn").onclick=()=>finishTest("आपने टेस्ट समाप्त किया।");
 $("#game-play-again-btn").onclick=()=>{renderGameSetup();showScreen("game-setup");};
 document.addEventListener("keydown",onKey);
 buildLayoutPicker();
 if(state.layout&&LAYOUTS[state.layout]&&state.layout!=="remington")selectLayout(state.layout);else showScreen("onboarding");
}
function buildLayoutPicker(){
 const host=$("#layout-cards");host.innerHTML="";
 Object.values(LAYOUTS).forEach(layout=>{
 const card=el("article","layout-card"),name=el("h3","",layout.label),status=el("span","layout-pill",layout.status),desc=el("p","",layout.blurb),choose=el("button","btn btn-primary",layout.id==="remington"?"जल्द आएगा":"यह लेआउट चुनें");
 card.append(name,status,desc,choose);
 if(layout.id==="remington"){choose.disabled=true;choose.classList.add("btn-muted");}
 else choose.onclick=()=>selectLayout(layout.id);
 host.appendChild(card);
 });
}
function selectLayout(id){app.layout=getLayout(id);app.chapters=buildChapters(app.layout);state.layout=id;saveState();renderHome();showScreen("home");}
function renderHome(){
 $("#current-layout-name").textContent=app.layout.label;
 $("#home-progress-text").textContent=completedCount()+" / "+app.chapters.length+" पाठ पूरे किए";
 $("#home-progress-bar").style.width=Math.min(100,completedCount()/Math.max(1,app.chapters.length)*100)+"%";
 const weak=$("#home-weak-keys");weak.innerHTML="";const items=weakKeys(8);
 if(!items.length)weak.append(el("span","muted","अभी तक कोई गलती दर्ज नहीं हुई।"));
 items.forEach(([key,n])=>weak.append(el("span","key-chip",key+" ×"+n)));
}
function renderChapterList(){
 const host=$("#chapter-list");host.innerHTML="";
 app.chapters.forEach((c,i)=>{
 const row=el("div","chapter-row"),title=el("span","chapter-title",(i+1)+". "+c.title),status=el("span","chapter-status",state.completedChapters[app.layout.id]?.[c.id]?"पूरा":"शुरू करें");
 row.append(title,status);row.onclick=()=>startChapter(c);host.append(row);
 });
 $("#practice-weak-keys-btn").onclick=()=>{const weak=weakKeys(10);const prompts=[];weak.forEach(([key])=>{const d=app.layout.keys[key];if(d)prompts.push({key,char:d.base,shift:false});});if(prompts.length)startChapter({id:"weak",type:"letters",title:"कमजोर कुंजी अभ्यास",prompts});else alert("पहले कुछ पाठों का अभ्यास करें ताकि गलत कुंजियाँ दर्ज हो सकें।");};
}
function startChapter(chapter){
 app.currentChapter=chapter;app.mode="learn";app.cursor=0;app.errors=0;app.typed=[];
 $("#learn-chapter-title").textContent=chapter.title;$("#learn-mode-label").textContent=chapter.type==="paragraph"?"अनुच्छेद":"अभ्यास";
 $("#learn-feedback").textContent="कीबोर्ड से टाइप करना शुरू करें।";renderKeyboard($("#learn-keyboard"));
 renderLearnPrompt();showScreen("learn-drill");
}
function renderLearnPrompt(){
 const c=app.currentChapter;const host=$("#learn-prompt");host.innerHTML="";
 const vals=c.type==="paragraph"?graphemeClusters(c.prompts):c.prompts;
 if(c.type==="paragraph"){
  const target=vals.slice(app.cursor).join("");host.textContent=app.typed.join("")+target;
 }else{
  const visible=vals.slice(0,Math.min(vals.length,app.cursor+18));
  visible.forEach((p,i)=>{const s=el("span",i<app.cursor?"correct":i===app.cursor?"current":"",p.char);host.append(s);});
 }
 $("#learn-drill-progress").textContent=(app.cursor+1)+" / "+vals.length;
 highlightNext($("#learn-keyboard"),c.type==="paragraph"?null:vals[app.cursor]);
}
function onKey(evt){
 if(evt.ctrlKey||evt.altKey||evt.metaKey||evt.repeat)return;
 const screen=document.querySelector(".screen.active")?.id;
 const key=KEY_CODES[evt.code];if(!key)return;
 if(screen==="screen-learn-drill"){evt.preventDefault();handleLearnKey(key,evt.shiftKey);}
 else if(screen==="screen-test-run"){evt.preventDefault();handleTestKey(key,evt.shiftKey,evt.code);}
 else if(screen==="screen-game-run"){evt.preventDefault();handleGameKey(key,evt.shiftKey);}
}
function resolved(key,shift){const d=app.layout?.keys[key];return d?(shift?d.shift:d.base)||null:null;}
function handleLearnKey(key,shift){
 const c=app.currentChapter;if(!c)return;
 if(c.type==="paragraph"){
  const target=graphemeClusters(c.prompts)[app.cursor];const char=resolved(key,shift);
  if(!target){return;}
  if(char&&target.startsWith(char)){app.typed.push(char);app.cursor++;renderLearnPrompt();if(app.cursor>=graphemeClusters(c.prompts).length)finishChapter();}
  else wrongKey(key);
  return;
 }
 const p=c.prompts[app.cursor];if(!p)return;
 const char=resolved(key,shift);
 if(char===p.char&&key===p.key&&shift===p.shift){app.cursor++;$("#learn-feedback").textContent="सही!";renderLearnPrompt();if(app.cursor>=c.prompts.length)finishChapter();}
 else wrongKey(key);
}
function wrongKey(key){app.errors++;state.keyErrors[app.layout.id]=state.keyErrors[app.layout.id]||{};state.keyErrors[app.layout.id][key]=(state.keyErrors[app.layout.id][key]||0)+1;saveState();$("#learn-feedback").textContent="गलत कुंजी — अगली कुंजी ध्यान से देखें।";}
function finishChapter(){
 if(!state.completedChapters[app.layout.id])state.completedChapters[app.layout.id]={};
 if(app.currentChapter.id!=="weak")state.completedChapters[app.layout.id][app.currentChapter.id]=true;
 saveState();$("#learn-done-title").textContent="पाठ पूरा हुआ!";$("#learn-done-stats").textContent="गलत प्रयास: "+app.errors+" · नियमित अभ्यास जारी रखें।";
 $("#learn-back-btn").onclick=()=>{renderChapterList();showScreen("learn-list");};
 $("#learn-next-btn").onclick=()=>{const i=app.chapters.findIndex(c=>c.id===app.currentChapter.id);const next=app.chapters[i+1];if(next)startChapter(next);else {renderChapterList();showScreen("learn-list");}};
 renderHome();showScreen("learn-done");
}
function renderKeyboard(container){
 container.innerHTML="";const rows=[["`","1","2","3","4","5","6","7","8","9","0","-","="],["q","w","e","r","t","y","u","i","o","p","[","]","\\"],["a","s","d","f","g","h","j","k","l",";","'"],["z","x","c","v","b","n","m",",",".","/"]];
 rows.forEach(keys=>{const row=el("div","keyboard-row");keys.forEach(key=>{const d=app.layout.keys[key],button=el("div","keyboard-key"),shift=el("span","kb-shift",d?.shift||""),base=el("span","kb-base",d?.base||key);button.dataset.key=key;button.append(shift,base);row.append(button);});container.append(row);});
}
function highlightNext(container,prompt){container.querySelectorAll(".keyboard-key").forEach(k=>k.classList.remove("next"));if(prompt?.key)Array.from(container.querySelectorAll(".keyboard-key")).find(k=>k.dataset.key===prompt.key)?.classList.add("next");}
function renderTestSetup(){document.querySelectorAll("[data-duration]").forEach(b=>b.classList.toggle("selected",b.dataset.duration==="60"));$("#test-result").textContent="";showScreen("test-setup");}
function startTest(seconds){
 const pool=PARAGRAPHS.map(p=>p.text).join(" ");app.test={source:(pool+" "+pool).slice(0,1000),typed:"",seconds,remaining:seconds,errors:0,started:Date.now(),timer:null};
 $("#test-source-text").textContent=app.test.source;$("#test-typed-text").textContent="";$("#test-result").textContent="";
 app.test.timer=setInterval(()=>{app.test.remaining--;updateTestStats();if(app.test.remaining<=0)finishTest("समय समाप्त");},1000);
 updateTestStats();showScreen("test-run");
}
function handleTestKey(key,shift,code){
 const t=app.test;if(!t)return;
 if(code==="Backspace"){if(t.typed.length&&!t.typed.endsWith(" "))t.typed=t.typed.slice(0,-1);renderTestTyped();return;}
 if(code==="Space"){if(t.source[t.typed.length]===" ")t.typed+=" ";else t.errors++;renderTestTyped();return;}
 const ch=resolved(key,shift);if(!ch)return;const target=t.source[t.typed.length];if(!target)return;
 if(ch===target)t.typed+=ch;else {t.errors++;t.typed+=ch;}
 renderTestTyped();updateTestStats();if(t.typed.length>=t.source.length)finishTest("पूरा पाठ टाइप किया!");
}
function renderTestTyped(){
 const t=app.test;$("#test-typed-text").textContent=t.typed;
 const source=$("#test-source-text");source.innerHTML="";
 for(let i=0;i<t.source.length;i++){const sp=el("span",i<t.typed.length?(t.typed[i]===t.source[i]?"typed-correct":"typed-wrong"):i===t.typed.length?"current":"",t.source[i]);source.append(sp);}
}
function updateTestStats(){
 const t=app.test;if(!t)return;
 const elapsed=Math.max(1,(Date.now()-t.started)/60000);const correct=Math.max(0,t.typed.length-t.errors);
 $("#test-time").textContent="समय: "+Math.max(0,t.remaining)+"s";
 $("#test-wpm").textContent="WPM: "+Math.round(correct/5/elapsed);
 $("#test-accuracy").textContent="शुद्धता: "+(t.typed.length?Math.round(correct/t.typed.length*100):100)+"%";
 $("#test-progress-bar").style.width=Math.min(100,t.typed.length/t.source.length*100)+"%";
}
function finishTest(reason){
 const t=app.test;if(!t)return;clearInterval(t.timer);updateTestStats();
 const elapsed=Math.max(1,(Date.now()-t.started)/60000),correct=Math.max(0,t.typed.length-t.errors);
 const result={time:new Date().toLocaleString("hi-IN"),source:"हिंदी अनुच्छेद",wpm:Math.round(correct/5/elapsed),accuracy:t.typed.length?Math.round(correct/t.typed.length*100):100,errors:t.errors};
 state.history.unshift(result);state.history=state.history.slice(0,15);saveState();
 $("#test-result").textContent=reason+" · WPM: "+result.wpm+" · शुद्धता: "+result.accuracy+"%";
 if(!t.finished){t.finished=true;}
 clearInterval(t.timer);app.test=null;
}
function renderGameSetup(){
 const host=$("#game-categories");host.innerHTML="";
 Object.entries(GAME_CATEGORIES).forEach(([id,c])=>{const b=el("button","game-cat-btn");b.append(el("span","",c.label),el("span","muted","शुरू करें →"));b.onclick=()=>startGame(id);host.append(b);});
}
function startGame(id){
 const cat=GAME_CATEGORIES[id];const chars=cat.chars||Object.values(GAME_CATEGORIES).filter(c=>c.chars).flatMap(c=>c.chars);app.game={id,chars,score:0,errors:0,remaining:30,timer:null,target:""};
 $("#game-category-title").textContent=cat.label;$("#game-score").textContent="स्कोर: 0";nextGameChar();
 app.game.timer=setInterval(()=>{app.game.remaining--;$("#game-time").textContent="समय: "+app.game.remaining+"s";if(app.game.remaining<=0)endGame();},1000);
 showScreen("game-run");
}
function nextGameChar(){if(!app.game)return;app.game.target=app.game.chars[Math.floor(Math.random()*app.game.chars.length)];$("#game-prompt").textContent=app.game.target;$("#game-time").textContent="समय: "+app.game.remaining+"s";}
function handleGameKey(key,shift){const char=resolved(key,shift);if(char&&app.game?.target===char){app.game.score++;$("#game-score").textContent="स्कोर: "+app.game.score;nextGameChar();}else if(app.game){app.game.errors++;}}
function endGame(){if(!app.game)return;clearInterval(app.game.timer);$("#game-final-score").textContent="स्कोर: "+app.game.score+" · गलत प्रयास: "+app.game.errors;app.game=null;showScreen("game-done");}
function renderProgress(){
 $("#progress-summary").textContent=completedCount()+" / "+app.chapters.length+" पाठ पूरे किए ("+app.layout.label+")";
 const host=$("#progress-weak-keys");host.innerHTML="";const weak=weakKeys(15);
 if(!weak.length)host.append(el("span","muted","अभी तक कोई गलती दर्ज नहीं हुई।"));
 weak.forEach(([key,n])=>host.append(el("span","key-chip",key+" ×"+n)));
 const hist=$("#progress-history");hist.innerHTML="";
 if(!state.history.length){hist.append(el("p","muted","अभी तक कोई टेस्ट परिणाम नहीं।"));return;}
 const table=el("table","history-table"),head=el("tr");["समय","पाठ","WPM","शुद्धता","गलतियां"].forEach(t=>head.append(el("th","",t)));table.append(head);
 state.history.forEach(h=>{const row=el("tr");[h.time,h.source,h.wpm,h.accuracy+"%",h.errors].forEach(v=>row.append(el("td","",String(v))));table.append(row);});hist.append(table);
}
window.graphemeClusters=graphemeClusters;window.getLayout=getLayout;window.CODE_TO_KEY=KEY_CODES;window.app=app;
document.addEventListener("DOMContentLoaded",init);
