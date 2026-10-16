"use strict";
document.addEventListener("DOMContentLoaded", () => {
  const click = (id) => document.getElementById(id)?.click();
  const heroImage = document.querySelector(".hero-photo");
  if (heroImage) fetch("assets/isha-hero.jpg.b64").then(response => { if (!response.ok) throw new Error("Hero image asset unavailable"); return response.text(); }).then(encoded => { heroImage.src = "data:image/jpeg;base64," + encoded.trim(); }).catch(() => { heroImage.style.display = "none"; const fallback = heroImage.nextElementSibling; if (fallback) fallback.style.display = "flex"; });
  // Make the dashboard the landing screen for first-time visitors too.
  try {
    const saved = JSON.parse(localStorage.getItem("devnagariTyping.v1") || "{}");
    if (!saved.layout && document.getElementById("screen-onboarding")?.classList.contains("active")) {
      const krutiChoice = document.querySelectorAll("#layout-cards .layout-card button")[1];
      if (krutiChoice) krutiChoice.click();
    }
  } catch {}
  const go = (id) => { const node=document.getElementById(id); if(node) node.click(); };
  // New dashboard navigation reuses the existing learning/test/game screens.
  ["hero-start","course-view-all","continue-lesson","nav-practice"].forEach(id=>{
    const node=document.getElementById(id);
    if(node) node.addEventListener("click",()=>go("nav-learn"));
  });
  ["hero-demo","test-start-link"].forEach(id=>{
    const node=document.getElementById(id);
    if(node) node.addEventListener("click",()=>go("nav-test"));
  });
  ["games-view-all"].forEach(id=>{
    const node=document.getElementById(id);
    if(node) node.addEventListener("click",()=>go("nav-game"));
  });
  ["progress-view-all","achievements-view-all","nav-leaderboard"].forEach(id=>{
    const node=document.getElementById(id);
    if(node) node.addEventListener("click",()=>go("nav-progress"));
  });
  ["exam-view-all","nav-exam","start-plan","paragraph-view-all"].forEach(id=>{
    const node=document.getElementById(id);
    if(node) node.addEventListener("click",()=>go("nav-test"));
  });
  ["course-view-all","continue-lesson"].forEach(id=>{
    const node=document.getElementById(id);
    if(node) node.addEventListener("click",()=>go("nav-learn"));
  });
  document.querySelectorAll(".test-modes button").forEach(button=>{
    button.addEventListener("click",()=>{
      const duration=document.querySelector('[data-duration="'+button.dataset.duration+'"]');
      if(duration) duration.click();
      go("nav-test");
    });
  });
  document.querySelectorAll(".paragraph-item").forEach(button=>{
    button.addEventListener("click",()=>go("nav-test"));
  });
  document.querySelectorAll(".game-tile").forEach(button=>{
    button.addEventListener("click",()=>{
      const category=button.dataset.game;
      go("nav-game");
      document.querySelectorAll("#game-categories button").forEach(b=>{
        if((category==="combined"&&b.textContent.includes("मिश्रित"))||
           (category==="vyanjan"&&b.textContent.includes("व्यंजन"))||
           (category==="swar"&&b.textContent.includes("स्वर"))||
           (category==="numeric"&&b.textContent.includes("अंक"))) b.click();
      });
    });
  });
  document.querySelectorAll(".layout-option").forEach(button=>{
    button.addEventListener("click",()=>{
      document.querySelectorAll(".layout-option").forEach(b=>b.classList.remove("selected"));
      button.classList.add("selected");
      const label=button.querySelector("b")?.textContent||"";
      const pill=document.getElementById("current-layout-name");
      if(pill) pill.textContent=label;
      const id=button.dataset.layout;
      const stored=localStorage.getItem("devnagariTyping.v1");
      if(stored){try{const data=JSON.parse(stored);data.layout=id;localStorage.setItem("devnagariTyping.v1",JSON.stringify(data));}catch{}}
    });
  });
  const toggle=document.getElementById("theme-toggle");
  toggle?.addEventListener("click",()=>document.body.classList.toggle("dark"));
  document.getElementById("brand-home")?.addEventListener("click",event=>{event.preventDefault();go("nav-home");});
});
