const fs=require("fs"),path=require("path");
const {JSDOM,VirtualConsole}=require("jsdom");
const html=fs.readFileSync(path.join(__dirname,"index.html"),"utf8");
const vc=new VirtualConsole();
const dom=new JSDOM(html,{runScripts:"dangerously",resources:"usable",url:"http://localhost/",pretendToBeVisual:true,virtualConsole:vc});
const {window}=dom;window.scrollTo=()=>{};
let failures=0, finished=false;
function check(name,fn){try{const ok=fn();console.log((ok?"PASS":"FAIL")+" "+name);if(!ok)failures++;}catch(e){failures++;console.log("FAIL "+name+": "+e.message);}}
window.addEventListener("load",()=>{
 const doc=window.document;
 check("dashboard is the default landing screen",()=>doc.querySelector("#screen-home").classList.contains("active"));
 check("three layout cards render",()=>doc.querySelectorAll(".layout-card").length===3);
 check("Mangal selection opens home",()=>{doc.querySelector(".layout-card .btn-primary").click();return doc.querySelector("#screen-home").classList.contains("active");});
 check("course creates more than ten lessons",()=>window.app.chapters.length>10);
 check("lesson list opens",()=>{doc.querySelector("#nav-learn").click();return doc.querySelector("#screen-learn-list").classList.contains("active");});
 check("lesson drill opens",()=>{doc.querySelector(".chapter-row").click();return doc.querySelector("#screen-learn-drill").classList.contains("active")&&doc.querySelector("#learn-prompt").textContent.length>0;});
 check("test starts and renders a passage",()=>{doc.querySelector("#nav-test").click();doc.querySelector("#test-start-btn").click();return doc.querySelector("#screen-test-run").classList.contains("active")&&doc.querySelector("#test-source-text").textContent.length>20;});
 check("test can be ended and saved",()=>{doc.querySelector("#test-quit-btn").click();return JSON.parse(window.localStorage.getItem("devnagariTyping.v1")).history.length===1;});
 check("game starts with a target",()=>{doc.querySelector("#nav-game").click();doc.querySelector(".game-cat-btn").click();return doc.querySelector("#screen-game-run").classList.contains("active")&&doc.querySelector("#game-prompt").textContent.length>0;});
 check("progress screen renders",()=>{if(window.app.game)window.clearInterval(window.app.game.timer);doc.querySelector("#nav-progress").click();return doc.querySelector("#screen-progress").classList.contains("active");});
 check("Devanagari matra stays in one grapheme",()=>window.graphemeClusters("कि").length===1);
 check("grapheme grouping preserves complete Hindi word",()=>window.graphemeClusters("हिंदी").join("")==="हिंदी");
 if(window.app.test?.timer)window.clearInterval(window.app.test.timer);
 if(window.app.game?.timer)window.clearInterval(window.app.game.timer);
 console.log(failures?"SMOKE TESTS FAILED: "+failures:"ALL SMOKE TESTS PASSED");
 finished=true;process.exitCode=failures?1:0;dom.window.close();
});
setTimeout(()=>{if(!finished){console.error("Timed out waiting for jsdom page load; ensure local scripts load from index.html.");process.exit(1);}},5000).unref();
