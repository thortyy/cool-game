(() => {
  "use strict";
  const canvas = document.querySelector("#game");
  const screen = canvas.getContext("2d");
  const art = document.createElement("canvas");
  art.width=480;art.height=270;
  const ctx = art.getContext("2d");
  ctx.imageSmoothingEnabled=false;
  const W = canvas.width, H = canvas.height, FLOOR = 466, WORLD = 7200;
  const ui = {
    overlay: document.querySelector("#overlay"), title: document.querySelector("#overlayTitle"),
    text: document.querySelector("#overlayText"), eyebrow: document.querySelector("#eyebrow"),
    start: document.querySelector("#startButton"), coins: document.querySelector("#coinCount"),
    score: document.querySelector("#scoreCount"), lives: document.querySelector("#lifeCount"),
    level: document.querySelector("#levelName"), toast: document.querySelector("#toast"),
    sound: document.querySelector("#soundButton"), pause: document.querySelector("#pauseButton"),
    fullscreen: document.querySelector("#fullscreenButton"), frame: document.querySelector(".game-frame"),
    progress: document.querySelector(".level-progress"), progressFill: document.querySelector(".level-progress span"),
    scoreboard: document.querySelector("#scoreboard"), scoreRepo: document.querySelector("#scoreRepo"),
    playerName: document.querySelector("#playerName"), scoreStatus: document.querySelector("#scoreStatus"),
    scoreRows: document.querySelector("#scoreRows"), loadScores: document.querySelector("#loadScores"),
    submitScore: document.querySelector("#submitScore")
  };
  const levels = [
    {name:"Meadow of Mornings", sky:["#73d8ef","#d1f3e9","#ffe8ae"], hills:"#71cba9", far:"#469b91", ground:"#329572", soil:"#276b62", platform:"#f3d78f", accent:"#ffda73", enemy:"#9c668d", start:"#e4fff0", theme:"meadow", gaps:[[970,1070],[2170,2280],[3380,3500],[4540,4645],[5730,5840],[6710,6805]], ledges:[[400,350,150],[600,282,124],[1160,340,148],[1400,270,136],[1650,352,170],[1900,300,130],[2380,346,160],[2640,270,130],[2890,332,170],[3580,344,160],[3820,272,132],[4100,354,180],[4350,290,136],[4760,340,170],[5020,265,140],[5320,347,155],[5900,340,160],[6140,274,146],[6410,344,164],[6850,330,145]], blocks:[720,1540,2780,4000,5200,6280], foes:[650,1260,1750,2500,3020,3690,4210,4880,5400,6070,6510], checkpoints:[2380,4820],moving:[[820,370,116,1,34],[1750,390,112,-1,40],[3200,360,126,1,46],[4420,370,112,-1,38],[5600,360,126,1,44],[6510,375,118,-1,32]],springs:[1280,3000,4140,5300,6230],spikes:[[1470,72],[3310,88],[4960,80],[6380,72]]},
    {name:"The Amber Canopy", sky:["#f79b82","#f5c28c","#ffe1aa"], hills:"#d7817e", far:"#ac647f", ground:"#a75d59", soil:"#744558", platform:"#efbb78", accent:"#ffe077", enemy:"#784c86", start:"#fff0d7", theme:"autumn", gaps:[[840,960],[1960,2080],[3180,3300],[4330,4460],[5530,5660],[6590,6710]], ledges:[[330,356,150],[540,282,130],[1030,340,156],[1260,270,140],[1510,350,176],[1740,294,140],[2180,346,160],[2450,272,138],[2730,338,170],[2940,282,132],[3410,348,160],[3670,270,144],[3940,344,165],[4120,285,135],[4540,346,155],[4800,270,145],[5100,346,170],[5360,278,142],[5800,344,160],[6070,272,140],[6320,348,160],[6800,338,150]], blocks:[680,1440,2580,3780,4980,6220], foes:[610,1150,1630,2350,2820,3540,4050,4680,5230,5940,6450], checkpoints:[2240,4780],moving:[[720,378,112,1,36],[1610,365,122,-1,44],[3020,370,122,1,42],[4230,375,116,-1,40],[5430,368,124,1,46],[6450,372,112,-1,34]],springs:[1190,2830,4000,5160,6130],spikes:[[1130,84],[2600,76],[3870,88],[5200,80],[6300,76]]},
    {name:"Moonlit Cloudsea", sky:["#313f80","#6d71aa","#e8a9bc"], hills:"#7271a7", far:"#54528c", ground:"#454c88", soil:"#343660", platform:"#bdc8ef", accent:"#fff0a9", enemy:"#e27682", start:"#f1edff", theme:"night", gaps:[[900,1030],[2050,2180],[3280,3430],[4450,4600],[5600,5750],[6420,6540]], ledges:[[380,346,160],[610,274,132],[1110,338,158],[1370,268,140],[1630,346,176],[1850,288,140],[2270,346,162],[2530,270,145],[2820,338,176],[3050,278,132],[3510,346,160],[3760,268,145],[4050,342,166],[4240,278,138],[4670,344,158],[4930,268,145],[5220,344,170],[5390,280,140],[5820,342,165],[6080,266,148],[6280,342,165],[6630,336,150],[6870,328,140]], blocks:[700,1500,2650,3900,5100,6160], foes:[640,1190,1700,2400,2910,3620,4130,4780,5290,6010,6320], checkpoints:[2320,4850],moving:[[780,368,116,1,42],[1710,372,120,-1,48],[3120,370,120,1,48],[4330,370,120,-1,44],[5490,370,120,1,50],[6350,372,120,-1,38]],springs:[1280,2910,4110,5270,6090],spikes:[[1260,76],[2790,88],[4020,72],[5150,84],[6160,76]]}
  ];
  const encounters=[
    [[650,"walker"],[850,"hopper"],[1260,"wisp"],[1580,"beetle"],[2470,"walker"],[2840,"hopper"],[3790,"wisp"],[4210,"beetle"],[4860,"walker"],[5410,"hopper"],[6040,"wisp"],[6500,"beetle"]],
    [[610,"walker"],[760,"hopper"],[1150,"wisp"],[1550,"beetle"],[2320,"walker"],[2800,"hopper"],[3540,"wisp"],[4040,"beetle"],[4700,"walker"],[5220,"hopper"],[5960,"wisp"],[6480,"beetle"]],
    [[640,"walker"],[790,"hopper"],[1190,"wisp"],[1700,"beetle"],[2390,"walker"],[2910,"hopper"],[3620,"wisp"],[4130,"beetle"],[4780,"walker"],[5290,"hopper"],[6010,"wisp"],[6320,"beetle"]]
  ];
  let world, player, camera=0, current=0, score=0, coins=0, lives=3, state="menu", muted=false;
  let last=0, elapsed=0, toastTimer=0, audio=null;
  const keys={left:false,right:false,jump:false,dash:false};
  const rand=(seed)=>{let t=seed+0x6D2B79F5;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return((t^t>>>14)>>>0)/4294967296};
  function buildWorld(index){
    const spec=levels[index], platforms=[], items=[], enemies=[], blocks=[], particles=[], scenery=[],traps=[];
    const underSpikeRoof=(x,width)=>spec.spikes.some(([spikeX,spikeW])=>x+width>spikeX-36&&x<spikeX+spikeW+36);
    const movePastSpikeRoof=(x,width)=>{while(underSpikeRoof(x,width))x+=160;return x};
    let start=0;
    for(const [gapStart,gapEnd] of spec.gaps){
      if(gapStart>start)platforms.push({x:start,y:FLOOR,w:gapStart-start,h:150,type:"ground"});
      start=gapEnd;
    }
    if(start<WORLD)platforms.push({x:start,y:FLOOR,w:WORLD-start,h:150,type:"ground"});
    for(const [x,w] of spec.spikes){
      traps.push({x,y:FLOOR-22,w,h:22,active:true,phase:x/120,warned:false});
      platforms.push({x:x-36,y:378,w:w+72,h:30,type:"overhang"});
    }
    for(const ground of platforms.filter(p=>p.type==="ground")){
      for(let x=ground.x+150;x<ground.x+ground.w-90;x+=185){
        const seed=Math.floor(x/37)+index*19,roll=rand(seed);
        scenery.push({x,y:FLOOR,type:roll<.035?"beacon":roll<.29?"tree":roll<.49?"bush":roll<.68?"rock":roll<.84?"mushroom":index===2?"crystal":"flowers",variant:Math.floor(rand(seed+8)*3),scale:.8+rand(seed+17)*.45});
      }
    }
    for(const [x,y,w] of spec.ledges){
      platforms.push({x,y,w,h:20,type:"ledge"});
      for(let c=0;c<3;c++)items.push({x:x+24+c*34,y:y-34-Math.sin(c/2*Math.PI)*12,r:10,type:"coin",taken:false,bob:c+x/100});
    }
    for(const [x,y,w,direction,amplitude] of spec.moving)platforms.push({x,y,w,h:20,type:"moving",baseY:y,amplitude,direction,speed:.8+(x%3)*.08,phase:x/240,previousY:y});
    for(const site of spec.springs){const x=movePastSpikeRoof(site,50);platforms.push({x,y:FLOOR-28,w:50,h:28,type:"spring",bump:0})}
    const blockSites=spec.blocks.map(site=>movePastSpikeRoof(site,38));
    for(let i=0;i<blockSites.length;i++){
      const bx=blockSites[i],by=FLOOR-104;
      blocks.push({x:bx,y:by,size:38,used:false,bump:0});
      items.push({x:bx+19,y:by-48,r:13,type:"star",taken:false,bob:i,hidden:true});
    }
    for(const [i,[spawnX,type]] of encounters[index].entries()){
      const flyer=type==="wisp";
      const width=type==="beetle"?40:type==="hopper"?38:32;
      const patrol=type==="hopper"?74:105;
      const ex=movePastSpikeRoof(spawnX-patrol,width+2*patrol)+patrol;
      const baseY=flyer?FLOOR-132:0;
      enemies.push({x:ex,y:flyer?baseY:FLOOR-(type==="beetle"?36:34),baseY,w:width,h:type==="beetle"?36:type==="hopper"?34:30,type,dir:i%2?1:-1,speed:type==="beetle"?38:48+(i%3)*12,alive:true,phase:i*.7,home:ex,patrol,vy:0,jumpTimer:.5+(i%3)*.48,stun:0,hp:type==="beetle"?2:1});
    }
    for(let i=0;i<spec.gaps.length;i++){
      const [gapStart,gapEnd]=spec.gaps[i];
      for(let c=0;c<3;c++)items.push({x:gapStart+(gapEnd-gapStart)*(c+1)/4,y:FLOOR-91-Math.sin(c/2*Math.PI)*16,r:10,type:"coin",taken:false,bob:c+i});
    }
    const checkpoints=spec.checkpoints;
    const boss=index===levels.length-1?{x:WORLD-420,y:FLOOR-76,w:78,h:76,home:WORLD-420,dir:-1,speed:48,health:3,maxHealth:3,flash:0,defeated:false}:null;
    return {spec,platforms,items,enemies,blocks,particles,scenery,traps,checkpoints:checkpoints.map(x=>({x,y:FLOOR,active:false})),boss,goal:WORLD-180};
  }
  function resetPlayer(x=100){player={x,y:FLOOR-44,w:32,h:44,vx:0,vy:0,grounded:false,face:1,coyote:0,jumpBuffer:0,jumpsRemaining:1,dashCooldown:0,dashTime:0,invuln:0,starTime:0,checkpoint:x,anim:0,dead:false,support:null}}
  function beginLevel(index,keepLives=true){
    current=index;world=buildWorld(index);camera=0;resetPlayer(100);coins=keepLives?coins:0;
    ui.scoreboard.hidden=true;document.body.classList.remove("scoreboard-open");ui.progressFill.style.width="0%";ui.progress.setAttribute("aria-valuenow","0");
    ui.level.textContent=world.spec.name;updateHud();
    state="playing";ui.overlay.classList.add("hidden");ui.pause.textContent="Ⅱ Pause";
    say(index===0?"Collect starlight and keep moving!":world.spec.name+" — onward!");
  }
  function updateHud(){ui.coins.textContent=String(coins);ui.score.textContent=String(score).padStart(6,"0");ui.lives.textContent=lives>0?Array.from({length:lives},()=>"♥").join(" "):"♡"}
  function say(message){ui.toast.textContent=message;ui.toast.classList.add("show");toastTimer=2.2}
  function showOverlay(eyebrow,title,text,button="Play again"){
    ui.eyebrow.textContent=eyebrow;ui.title.innerHTML=title;ui.text.textContent=text;ui.start.textContent=button+"  →";ui.overlay.classList.remove("hidden")
  }
  function githubRepo(){
    const repo=ui.scoreRepo.value.trim();
    return /^[A-Za-z0-9](?:[A-Za-z0-9._-]*[A-Za-z0-9])?\/[A-Za-z0-9](?:[A-Za-z0-9._-]*[A-Za-z0-9])?$/.test(repo)?repo:null;
  }
  function scoreIssueBody(name,value){
    return `Player: ${name}\nScore: ${value}\nWorlds: 3/3`;
  }
  function showScoreRows(scores){
    ui.scoreRows.replaceChildren();
    if(!scores.length){
      const row=document.createElement("tr"),cell=document.createElement("td");
      cell.colSpan=3;cell.textContent="No validated scores yet.";row.append(cell);ui.scoreRows.append(row);return;
    }
    for(const [index,entry] of scores.slice(0,10).entries()){
      const row=document.createElement("tr");
      for(const value of [String(index+1),entry.player,entry.score.toLocaleString()]){
        const cell=document.createElement("td");cell.textContent=value;row.append(cell);
      }
      ui.scoreRows.append(row);
    }
  }
  async function loadLeaderboard(){
    const repo=githubRepo();
    if(!repo){ui.scoreStatus.textContent="Enter a valid public repository as owner/repo.";return}
    ui.scoreRepo.value=repo;ui.loadScores.disabled=true;ui.scoreStatus.textContent="Loading scores from GitHub…";
    const loadingRow=document.createElement("tr"),loadingCell=document.createElement("td");
    loadingCell.colSpan=3;loadingCell.textContent="Loading scores…";loadingRow.append(loadingCell);ui.scoreRows.replaceChildren(loadingRow);
    try{
      const response=await fetch(`https://api.github.com/repos/${repo}/issues?labels=game-score&state=all&per_page=100`,{
        headers:{Accept:"application/vnd.github+json","X-GitHub-Api-Version":"2022-11-28"}
      });
      if(!response.ok)throw new Error(`GitHub returned ${response.status}. Check that the repository is public and Issues are enabled.`);
      const issues=await response.json(),scores=[];
      for(const issue of issues){
        if(issue.pull_request||!issue.body)continue;
        const match=issue.body.match(/^Player: ([^\r\n]{1,20})\r?\nScore: (\d{1,8})\r?\nWorlds: 3\/3(?:\r?\n|$)/);
        if(match)scores.push({player:match[1],score:Number(match[2]),created:issue.created_at});
      }
      scores.sort((a,b)=>b.score-a.score||Date.parse(a.created)-Date.parse(b.created));
      showScoreRows(scores);
      ui.scoreStatus.textContent=`Loaded ${scores.length} validated ${scores.length===1?"score":"scores"} from ${repo}.`;
    }catch(error){
      console.error("Could not load the GitHub leaderboard.",error);
      ui.scoreStatus.textContent=error.message||"Could not load scores from GitHub.";
      const row=document.createElement("tr"),cell=document.createElement("td");
      cell.colSpan=3;cell.textContent="Scores could not be loaded.";row.append(cell);ui.scoreRows.replaceChildren(row);
    }finally{ui.loadScores.disabled=false}
  }
  ui.loadScores.addEventListener("click",loadLeaderboard);
  ui.submitScore.addEventListener("click",event=>{
    const repo=githubRepo(),name=ui.playerName.value.trim();
    if(!repo){event.preventDefault();ui.scoreStatus.textContent="Enter a valid public repository as owner/repo.";return}
    if(!name||name.length>20||/[\r\n]/.test(name)){event.preventDefault();ui.scoreStatus.textContent="Enter a player name (1–20 characters).";return}
    ui.playerName.value=name;
    const body=scoreIssueBody(name,score);
    const title=`Little Lantern score — ${name}`;
    ui.submitScore.href=`https://github.com/${repo}/issues/new?${new URLSearchParams({title,body})}`;
    ui.scoreStatus.textContent="GitHub will ask you to review and create the score issue.";
  });
  function sound(frequency=650,duration=.09,type="sine",volume=.035){
    if(muted)return;
    try{audio=audio||new(window.AudioContext||window.webkitAudioContext)();const osc=audio.createOscillator(),gain=audio.createGain();osc.type=type;osc.frequency.setValueAtTime(frequency,audio.currentTime);gain.gain.setValueAtTime(volume,audio.currentTime);gain.gain.exponentialRampToValueAtTime(.001,audio.currentTime+duration);osc.connect(gain);gain.connect(audio.destination);osc.start();osc.stop(audio.currentTime+duration)}catch(error){console.warn("Audio could not be started.",error)}
  }
  function press(name,value){keys[name]=value;if(name==="jump"&&value&&state==="playing")player.jumpBuffer=.15;if(name==="dash"&&value&&state==="playing")player.dashRequested=true}
  function keyHandler(e,down){
    const k=e.key.toLowerCase(),handled=["arrowleft","arrowright","arrowup"," ","a","d","w","p","escape","shift","x"].includes(k);
    if(handled)e.preventDefault();
    if(!down){if(k==="arrowleft"||k==="a")press("left",false);if(k==="arrowright"||k==="d")press("right",false);if(k===" "||k==="arrowup"||k==="w")press("jump",false);if(k==="shift"||k==="x")press("dash",false);return}
    if((k==="arrowleft"||k==="a")&&state==="playing")press("left",true);
    if((k==="arrowright"||k==="d")&&state==="playing")press("right",true);
    if((k===" "||k==="arrowup"||k==="w")&&state==="playing"&&!keys.jump)press("jump",true);
    if((k==="shift"||k==="x")&&state==="playing"&&!e.repeat)press("dash",true);
    if((k==="p"||k==="escape")&&state==="playing")pause();
  }
  window.addEventListener("keydown",e=>keyHandler(e,true));
  window.addEventListener("keyup",e=>keyHandler(e,false));
  window.addEventListener("blur",()=>{keys.left=keys.right=keys.jump=false;if(state==="playing")pause()});
  document.querySelectorAll(".touch-button").forEach(button=>{
    const name=button.dataset.control;
    const set=(value,e)=>{e.preventDefault();press(name,value);button.classList.toggle("pressed",value)};
    button.addEventListener("pointerdown",e=>{button.setPointerCapture(e.pointerId);set(true,e)});
    button.addEventListener("pointerup",e=>set(false,e));button.addEventListener("pointercancel",e=>set(false,e));
  });
  function pause(){if(state==="playing"){state="paused";showOverlay("Take a breather","A tiny pause.","Your adventure is right where you left it.","Keep going")}else if(state==="paused"){state="playing";ui.overlay.classList.add("hidden")}}
  ui.pause.addEventListener("click",()=>{if(state==="playing")pause();else if(state==="paused")pause()});
  ui.sound.addEventListener("click",()=>{muted=!muted;ui.sound.textContent=muted?"♪ Sound off":"♪ Sound on";if(!muted)sound()});
  ui.fullscreen.addEventListener("click",async()=>{
    try{
      if(document.fullscreenElement)await document.exitFullscreen();
      else await ui.frame.requestFullscreen();
    }catch(error){console.error("Fullscreen could not be changed.",error);say("Fullscreen is not available in this browser.")}
  });
  document.addEventListener("fullscreenchange",()=>{
    const active=document.fullscreenElement===ui.frame;
    ui.fullscreen.textContent=active?"⛶ Exit full":"⛶ Fullscreen";
    ui.fullscreen.setAttribute("aria-label",active?"Exit fullscreen":"Enter fullscreen");
  });
  ui.start.addEventListener("click",()=>{
    if(state==="paused"){state="playing";ui.overlay.classList.add("hidden");ui.frame.scrollTop=0;ui.start.blur();return}
    if(state==="won"||state==="gameover"){score=0;coins=0;lives=3;beginLevel(0,false);ui.frame.scrollTop=0;ui.start.blur();return}
    if(state==="menu")beginLevel(0,false);
    ui.frame.scrollTop=0;ui.start.blur();
  });
  function hit(a,b){return a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y}
  function collect(item){
    item.taken=true;
    if(item.type==="coin"){coins++;score+=100;sound(820,.07,"sine",.025);if(coins%10===0){lives=Math.min(5,lives+1);say("10 stars! An extra heart!");sound(990,.22,"triangle",.045)}}
    else {player.starTime=9;score+=500;sound(1040,.25,"triangle",.05);say("Starlight! You are unstoppable!")}
    updateHud();
  }
  function burst(x,y,color,count=9){
    for(let i=0;i<count;i++)world.particles.push({x,y,vx:(rand(i*21+Math.floor(elapsed*50))-.5)*240,vy:-rand(i*67+Math.floor(elapsed*90))*200-30,life:.45+rand(i*19)*.55,color,size:3+rand(i*73)*5});
  }
  function hurt(){
    if(player.invuln>0||player.starTime>0)return;
    lives--;updateHud();player.invuln=1.5;player.vy=-300;player.vx=-player.face*230;sound(165,.24,"sawtooth",.04);burst(player.x+16,player.y+20,"#ff8b9d");
    if(lives<=0){state="gameover";showOverlay("Every hero needs a breather","Oh, <i>crumbs.</i>","The valley will be waiting whenever you are ready to try again.","Try again")}
    else say("Ouch! "+lives+" heart"+(lives===1?"":"s")+" left");
  }
  function update(dt){
    elapsed+=dt;if(toastTimer>0&&(toastTimer-=dt)<=0)ui.toast.classList.remove("show");
    if(state!=="playing")return;
    const p=player;
    const wasGrounded=p.grounded,fallSpeed=p.vy;
    for(const platform of world.platforms){
      if(platform.type==="moving"){
        platform.previousY=platform.y;
        platform.y=platform.baseY+Math.sin(elapsed*platform.speed+platform.phase)*platform.amplitude;
        if(p.support===platform)p.y+=platform.y-platform.previousY;
      }else if(platform.type==="spring")platform.bump=Math.max(0,platform.bump-dt*5);
    }
    p.anim+=dt*(Math.abs(p.vx)>.1?12:3);p.jumpBuffer=Math.max(0,p.jumpBuffer-dt);p.coyote=p.grounded?.105:Math.max(0,p.coyote-dt);p.invuln=Math.max(0,p.invuln-dt);p.starTime=Math.max(0,p.starTime-dt);p.dashCooldown=Math.max(0,p.dashCooldown-dt);p.dashTime=Math.max(0,p.dashTime-dt);
    const direction=(keys.right?1:0)-(keys.left?1:0);
    if(direction)p.face=direction;
    if(p.dashRequested&&p.dashCooldown===0){
      p.dashRequested=false;p.dashCooldown=.78;p.dashTime=.16;p.vx=p.face*560;p.vy=0;p.invuln=Math.max(p.invuln,.2);
      sound(270,.12,"sawtooth",.025);burst(p.x+p.w/2,p.y+p.h/2,world.spec.accent,7);
    }
    p.dashRequested=false;
    if(p.dashTime>0)p.vx=p.face*560;
    else{
      if(direction)p.vx+=direction*1900*dt;else p.vx*=Math.pow(p.grounded?.0002:.035,dt);
      p.vx=Math.max(-265,Math.min(265,p.vx));
    }
    if(p.jumpBuffer>0&&(p.coyote>0||p.jumpsRemaining>0)){
      const isDouble=p.coyote<=0;
      p.vy=isDouble?-690:-750;p.grounded=false;p.support=null;p.coyote=0;p.jumpsRemaining=isDouble?0:p.jumpsRemaining;
      p.jumpBuffer=0;sound(isDouble?590:440,.12,"triangle",.025);burst(p.x+p.w/2,p.y+p.h,isDouble?"#c9f2ff":"#fff1be",isDouble?7:4);
    }
    if(!keys.jump&&p.vy< -220)p.vy+=650*dt;
    p.vy=Math.min(920,p.vy+(p.dashTime>0?0:1600*dt));
    const previousY=p.y;p.x+=p.vx*dt;
    const walls=world.platforms.filter(t=>t.type!=="ground"&&hit(p,t));
    for(const t of walls){if(p.vx>0)p.x=t.x-p.w;else if(p.vx<0)p.x=t.x+t.w;p.vx=0}
    if(world.boss&&!world.boss.defeated&&p.x>world.boss.x+world.boss.w+8){p.x=world.boss.x+world.boss.w+8;p.vx=0}
    p.x=Math.max(0,Math.min(WORLD-p.w,p.x));
    p.y+=p.vy*dt;p.grounded=false;
    for(const t of world.platforms){
      if(!hit(p,t))continue;
      if(p.vy>=0&&previousY+p.h<=t.y+15){
        p.y=t.y-p.h;
        if(t.type==="spring"){p.vy=-930;p.jumpsRemaining=1;p.support=null;t.bump=.18; sound(810,.18,"triangle",.045);burst(p.x+p.w/2,p.y+p.h,world.spec.accent,10)}
        else{
          p.vy=0;p.grounded=true;p.jumpsRemaining=1;p.support=t.type==="ground"?null:t;
          if(!wasGrounded&&fallSpeed>320)burst(p.x+p.w/2,p.y+p.h,world.spec.start,5);
        }
      }
      else if(p.vy<0&&previousY>=t.y+t.h-10){p.y=t.y+t.h;p.vy=65;
        const b=world.blocks.find(b=>Math.abs((b.x+b.size/2)-(p.x+p.w/2))<b.size&&Math.abs((b.y+b.size)-p.y)<14);
        if(b&&!b.used){b.used=true;const item=world.items.find(i=>i.hidden&&Math.abs(i.x-(b.x+b.size/2))<3&&!i.taken);if(item){item.hidden=false;item.y=b.y-48;item.bob=0;say("A little starlight for you!");sound(740,.15,"triangle",.035)}else{score+=50;updateHud()}b.bump=1}
      }else if(t.type!=="ground"){if(p.x+p.w/2<t.x+t.w/2)p.x=t.x-p.w;else p.x=t.x+t.w;p.vx=0}
    }
    for(const b of world.blocks)b.bump=Math.max(0,b.bump-dt*3);
    if(p.y>H+100){hurt();if(state!=="playing")return;p.x=p.checkpoint;p.y=FLOOR-130;p.vy=-100}
    for(const trap of world.traps){
      if(!trap.warned&&p.x+p.w>=trap.x-94){trap.warned=true;say("Low ceiling ahead! Dash under the spikes.")}
      if(p.x+p.w>trap.x+5&&p.x<trap.x+trap.w-5&&p.y+p.h>trap.y+5&&p.y<trap.y+trap.h){
        hurt();if(state!=="playing")return;
        p.x+=p.x+p.w/2<trap.x+trap.w/2?-25:25;
        break;
      }
    }
    for(const item of world.items){if(!item.taken&&!item.hidden){const iy=item.y+Math.sin(elapsed*3+item.bob)*4;if(Math.hypot(p.x+p.w/2-item.x,p.y+p.h/2-iy)<item.r+19)collect(item)}}
    for(const e of world.enemies){
      if(!e.alive)continue;
      e.stun=Math.max(0,e.stun-dt);e.phase+=dt*(e.type==="wisp"?2.4:8);
      if(e.type==="wisp"){
        e.x=e.home+Math.sin(e.phase*.55)*82;e.y=e.baseY+Math.sin(e.phase*1.35)*30;
      }else if(e.stun===0){
        e.x+=e.dir*e.speed*dt;
        const ahead=e.x+(e.dir>0?e.w+5:-5),hasFloor=world.platforms.some(t=>ahead>=t.x&&ahead<=t.x+t.w&&Math.abs(t.y-FLOOR)<3);
        if(e.x<e.home-e.patrol||e.x>e.home+e.patrol||!hasFloor)e.dir*=-1;
        if(e.type==="hopper"){
          e.vy=Math.min(700,e.vy+1350*dt);e.y+=e.vy*dt;
          if(e.y>=FLOOR-e.h){e.y=FLOOR-e.h;e.vy=0;e.jumpTimer-=dt;if(e.jumpTimer<=0){e.vy=-390;e.jumpTimer=1.35+(e.phase%0.5)}}
        }
      }
      if(hit(p,e)){
        if((p.vy>90&&previousY+p.h<=e.y+16)||p.dashTime>0){
          p.vy=e.type==="wisp"?-345:-405;p.jumpsRemaining=1;
          if(e.type==="beetle"&&p.dashTime<=0&&e.hp>1){e.hp--;e.stun=.8;score+=100;say("Crack! That beetle needs one more stomp.");sound(260,.12,"square",.03);burst(e.x+e.w/2,e.y+12,"#ffe18b",8)}
          else{e.alive=false;score+=e.type==="beetle"?400:250;sound(e.type==="wisp"?690:360,.11,"square",.025);burst(e.x+e.w/2,e.y+12,world.spec.accent,12)}
          updateHud();
        }
        else if(p.starTime>0){e.alive=false;score+=250;updateHud();burst(e.x+e.w/2,e.y+12,world.spec.accent,12)}
        else{hurt();if(state!=="playing")return}
      }
    }
    if(!p.grounded&&p.vy>=0)p.support=null;
    if(world.boss&&!world.boss.defeated){
      const boss=world.boss;boss.flash=Math.max(0,boss.flash-dt);
      boss.x+=boss.dir*boss.speed*dt;
      if(boss.x<boss.home-90||boss.x>boss.home+90)boss.dir*=-1;
      if(hit(p,boss)){
        if(p.vy>85&&previousY+p.h<=boss.y+20&&boss.flash<=0){
          boss.health--;boss.flash=.55;p.vy=-475;score+=500;updateHud();sound(310,.14,"square",.035);burst(boss.x+boss.w/2,boss.y+16,world.spec.accent,13);
          if(boss.health<=0){boss.defeated=true;score+=2000;say("The starlight guardian is free!");sound(880,.35,"triangle",.05);burst(boss.x+boss.w/2,boss.y+boss.h/2,"#fff0a1",28)}
          else say("A direct hit! "+boss.health+" more to go!");
        }else if(boss.flash<=0){hurt();if(state!=="playing")return}
      }
    }
    for(const checkpoint of world.checkpoints){if(!checkpoint.active&&p.x+p.w/2>=checkpoint.x){checkpoint.active=true;p.checkpoint=checkpoint.x;say("Checkpoint lit! Keep that light.");score+=200;updateHud();sound(720,.2,"triangle",.04)}}
    for(const part of world.particles){part.x+=part.vx*dt;part.y+=part.vy*dt;part.vy+=440*dt;part.life-=dt}
    world.particles=world.particles.filter(q=>q.life>0);
    const target=Math.max(0,Math.min(WORLD-W,p.x-W*.35));camera+=(target-camera)*Math.min(1,dt*5.5);
    const progress=Math.min(100,Math.floor(p.x/world.goal*100));
    ui.progressFill.style.width=progress+"%";ui.progress.setAttribute("aria-valuenow",String(progress));
    if(p.x+p.w>=world.goal){if(current<levels.length-1){score+=1000;beginLevel(current+1,true)}else{state="won";showOverlay("The valley shines again","You brought<br>the <em>dawn.</em>","Every last star collected, every world restored. Your final score: "+score.toLocaleString()+". Compare it with your friends!","Play again");ui.scoreboard.hidden=false;document.body.classList.add("scoreboard-open");if(!ui.scoreRepo.value)ui.scoreRepo.value=new URLSearchParams(location.search).get("scores")||"";loadLeaderboard();say("A perfect ending! Score "+String(score).padStart(6,"0"));}}
  }
  function roundedRect(c,x,y,w,h,r){c.beginPath();c.roundRect(x,y,w,h,r)}
  function ellipse(c,x,y,rx,ry){c.beginPath();c.ellipse(x,y,rx,ry,0,0,Math.PI*2)}
  function drawBackground(){
    const s=world.spec,g=ctx.createLinearGradient(0,0,0,H);
    g.addColorStop(0,s.sky[0]);g.addColorStop(.62,s.sky[1]);g.addColorStop(1,s.sky[2]);ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
    for(let i=0;i<54;i++){
      const x=(i*193%(W+120))-60,y=27+(i*79%240);
      if(s.theme==="night"){ctx.globalAlpha=.36+Math.sin(elapsed*1.5+i)*.3;ctx.fillStyle="#fff6d9";ctx.fillRect(x,y,2,2);ctx.globalAlpha=1}
      else{ctx.globalAlpha=.1;ctx.fillStyle="#fff";ellipse(ctx,x,y,1.5,1.5);ctx.fill();ctx.globalAlpha=1}
    }
    drawMountains(s);
    if(s.theme==="night"){
      ctx.fillStyle="#fff0ca";ellipse(ctx,775-camera*.025,112,43,43);ctx.fill();ctx.fillStyle="#cdd2ee";ellipse(ctx,793-camera*.025,99,39,39);ctx.fill();
      ctx.fillStyle="#fff3cf";for(let i=0;i<12;i++){const x=55+i*79-camera*.13,y=70+Math.sin(i*4)*24;starShape(ctx,x,y,3+i%2,5)}
    }else{
      const sunX=770-camera*.025;const sunY=115;
      ctx.save();ctx.translate(sunX,sunY);ctx.rotate(elapsed*.035);ctx.globalAlpha=.13;ctx.strokeStyle=s.accent;ctx.lineWidth=5;
      for(let i=0;i<12;i++){ctx.rotate(Math.PI/6);ctx.beginPath();ctx.moveTo(0,-49);ctx.lineTo(0,-64);ctx.stroke()}
      ctx.restore();ctx.globalAlpha=1;
      ctx.globalAlpha=.17;ctx.fillStyle="#fff4ca";ellipse(ctx,sunX,sunY,77,77);ctx.fill();ctx.globalAlpha=1;
      const sg=ctx.createRadialGradient(sunX-10,sunY-12,2,sunX,sunY,37);sg.addColorStop(0,"#fffde3");sg.addColorStop(1,s.accent);ctx.fillStyle=sg;ellipse(ctx,sunX,sunY,38,38);ctx.fill();
    }
    for(let i=0;i<8;i++){
      const cx=Math.floor(((i*197%(W+180))-40)/8)*8;
      const cy=58+(i*67%142),scale=.78+(i%3)*.14;
      drawCloud(cx,cy,scale,s,i);
    }
    drawHills(s.hills,355,.12,160,60);drawHills(s.far,405,.28,120,46);
    const flowerColor=s.theme==="autumn"?"#ffc6a6":s.theme==="night"?"#e2d8ff":"#fff1bd";
    for(let i=0;i<23;i++){
      const x=Math.floor((((i*173-camera*.46)%(W+100)+W+100)%(W+100))/4)*4-32,y=421+(i%4)*8;
      const petal=i%3===0?s.accent:flowerColor;
      ctx.fillStyle=petal;ctx.fillRect(x,y,4,4);ctx.fillRect(x-4,y+4,4,4);ctx.fillRect(x+4,y+4,4,4);
      ctx.fillStyle=s.ground;ctx.fillRect(x,y+4,3,8);ctx.fillRect(x-4,y+8,4,2);
    }
    if(s.theme==="night"){
      for(let i=0;i<9;i++){const x=((i*127-camera*.3)%(W+40)+W+40)%(W+40),y=340+(i*37%105);ctx.globalAlpha=.55+.4*Math.sin(elapsed*3+i);ctx.fillStyle="#fff2a2";ctx.fillRect(x,y,3,3);ctx.fillRect(x-2,y+1,7,1);ctx.globalAlpha=1}
    }
    const vignette=ctx.createRadialGradient(W/2,H*.43,110,W/2,H*.43,510);
    vignette.addColorStop(0,"#14213c00");vignette.addColorStop(1,s.theme==="night"?"#14183162":"#173b4840");
    ctx.fillStyle=vignette;ctx.fillRect(0,0,W,H);
  }
  function drawMountains(spec){
    const offset=camera*.055;ctx.fillStyle=spec.theme==="night"?"#42477978":spec.theme==="autumn"?"#d4797770":"#729cb278";
    for(let i=-1;i<6;i++){
      const x=i*260-offset,base=366,peak=208+((i%3+3)%3)*24;
      ctx.beginPath();ctx.moveTo(x-35,base);ctx.lineTo(x+88,peak);ctx.lineTo(x+205,base);ctx.closePath();ctx.fill();
      ctx.fillStyle=spec.theme==="night"?"#d5d5eb":"#fff4df";
      ctx.beginPath();ctx.moveTo(x+68,peak+30);ctx.lineTo(x+88,peak);ctx.lineTo(x+110,peak+29);ctx.lineTo(x+98,peak+25);ctx.lineTo(x+87,peak+38);ctx.lineTo(x+78,peak+26);ctx.closePath();ctx.fill();
      ctx.fillStyle=spec.theme==="night"?"#42477978":spec.theme==="autumn"?"#d4797770":"#729cb278";
    }
  }
  function drawCloud(x,y,scale,spec,seed){
      const unit=8,px=n=>Math.round(n*scale/unit)*unit;
      const night=spec.theme==="night";
      const shadow=night?"#5e659a":spec.theme==="autumn"?"#e7aeb4":"#9bcbd9";
      const body=night?"#c8c8eb":spec.theme==="autumn"?"#fff0e8":"#f7ffff";
      const highlight=night?"#f2edff":"#ffffff";
      const glow=night?"#d9c7ff":"#fff6dc";
      x=Math.round(x/unit)*unit;y=Math.round(y/unit)*unit;
      ctx.globalAlpha=night?.65:.68;
      ctx.fillStyle=glow;ctx.fillRect(x+px(18),y+px(14),px(102),px(35));
      ctx.globalAlpha=night?.78:.84;
      ctx.fillStyle=shadow;
      ctx.fillRect(x+px(15),y+px(27),px(112),px(20));
      ctx.fillRect(x+px(31),y+px(19),px(83),px(24));
      ctx.fillRect(x+px(8),y+px(35),px(124),px(14));
      ctx.fillStyle=body;
      ctx.fillRect(x+px(15),y+px(21),px(112),px(18));
      ctx.fillRect(x+px(31),y+px(13),px(82),px(24));
      ctx.fillRect(x+px(48),y+px(5),px(50),px(30));
      ctx.fillRect(x+px(24),y+px(29),px(96),px(13));
      ctx.fillRect(x+px(8),y+px(32),px(22),px(11));
      ctx.fillRect(x+px(112),y+px(29),px(22),px(11));
      ctx.fillStyle=highlight;
      ctx.fillRect(x+px(51),y+px(6),px(39),px(8));
      ctx.fillRect(x+px(34),y+px(16),px(31),px(6));
      ctx.fillRect(x+px(18),y+px(24),px(23),px(5));
      ctx.fillRect(x+px(94),y+px(19),px(17),px(5));
      ctx.fillStyle=shadow;
      ctx.fillRect(x+px(35),y+px(34),px(18),px(4));
      ctx.fillRect(x+px(89),y+px(35),px(20),px(4));
      if(seed%3===0){
        ctx.globalAlpha=.78;ctx.fillStyle=highlight;
        ctx.fillRect(x+px(137),y+px(20),px(28),px(8));ctx.fillRect(x+px(145),y+px(12),px(15),px(16));
        ctx.fillStyle=shadow;ctx.fillRect(x+px(141),y+px(27),px(24),px(5));
      }
      ctx.globalAlpha=1;
  }
  function drawHills(color,base,parallax,period,height){
    ctx.fillStyle=color;ctx.beginPath();ctx.moveTo(0,H);ctx.lineTo(0,base);
    const worldOffset=camera*parallax,step=32;
    const ridgeAt=x=>Math.floor((base-height*(.12+.88*(.5+.5*Math.sin(x/period*Math.PI*2))))/16)*16;
    const first=Math.floor(worldOffset/step)*step-step;
    for(let worldX=first;worldX<=worldOffset+W+step;worldX+=step){
      ctx.lineTo(worldX-worldOffset,ridgeAt(worldX));
    }
    ctx.lineTo(W,H);ctx.closePath();ctx.fill();
    if(world.spec.theme==="night"){
      ctx.fillStyle="#ffffff29";for(let i=0;i<7;i++){const worldX=i*190-worldOffset,x=Math.floor(worldX/8)*8,y=ridgeAt(worldX);ctx.fillRect(x,y-24,8,8);ctx.fillRect(x-8,y-16,24,8)}
    }else{
      for(let i=0;i<8;i++){
        const worldX=i*171-worldOffset,x=Math.floor(worldX/8)*8,y=ridgeAt(worldX);
        ctx.fillStyle=world.spec.theme==="autumn"?(i%2?"#e5a07d":"#b86d7a"):(i%2?"#78d5a3":"#49ab8f");
        ctx.fillRect(x-8,y-8,24,16);ctx.fillRect(x,y-16,16,24);ctx.fillRect(x-16,y,40,8);
      }
    }
  }
  function starShape(c,x,y,r,points){
    c.beginPath();for(let i=0;i<points*2;i++){const a=-Math.PI/2+i*Math.PI/points,rr=i%2?r:r*.43;c.lineTo(x+Math.cos(a)*rr,y+Math.sin(a)*rr)}c.closePath();c.fill()
  }
  function drawScenery(prop,spec){
    const x=Math.floor(prop.x-camera),y=prop.y,scale=prop.scale;
    if(x< -100||x>W+100)return;
    const px=(n)=>Math.round(n*scale/4)*4;
    if(prop.type==="tree"){
      const trunk=spec.theme==="autumn"?"#805346":spec.theme==="night"?"#414563":"#805b42";
      const leaves=spec.theme==="autumn"?["#d87868","#ea9d65","#bd6375"][prop.variant]:spec.theme==="night"?["#7775ad","#68669d","#8b80ba"][prop.variant]:["#4b9f68","#61b978","#397f63"][prop.variant];
      ctx.fillStyle="#00000020";ctx.fillRect(x-px(22),y-px(5),px(48),px(7));
      ctx.fillStyle=trunk;ctx.fillRect(x-px(8),y-px(43),px(16),px(43));
      ctx.fillStyle="#ffffff30";ctx.fillRect(x-px(5),y-px(40),px(4),px(36));
      ctx.fillStyle=leaves;ctx.fillRect(x-px(28),y-px(81),px(56),px(27));ctx.fillRect(x-px(20),y-px(97),px(40),px(24));ctx.fillRect(x-px(36),y-px(67),px(72),px(24));
      ctx.fillStyle="#ffffff30";ctx.fillRect(x-px(17),y-px(84),px(12),px(7));ctx.fillRect(x+px(8),y-px(95),px(8),px(6));
      ctx.fillStyle=spec.theme==="night"?"#ffeaa8":"#f0d57a";ctx.fillRect(x-px(4),y-px(58),px(8),px(8));
    }else if(prop.type==="bush"){
      const leaf=spec.theme==="autumn"?"#cb7780":spec.theme==="night"?"#7474ae":"#4baf75";
      ctx.fillStyle="#00000022";ctx.fillRect(x-px(26),y-px(4),px(55),px(5));
      ctx.fillStyle=leaf;ctx.fillRect(x-px(25),y-px(21),px(22),px(18));ctx.fillRect(x-px(11),y-px(34),px(29),px(28));ctx.fillRect(x+px(7),y-px(22),px(20),px(19));
      ctx.fillStyle="#ffffff45";ctx.fillRect(x-px(10),y-px(29),px(8),px(6));ctx.fillRect(x+px(10),y-px(20),px(7),px(5));
      ctx.fillStyle=spec.accent;ctx.fillRect(x-px(17),y-px(17),px(4),px(4));ctx.fillRect(x+px(17),y-px(18),px(4),px(4));
    }else if(prop.type==="rock"){
      ctx.fillStyle="#00000025";ctx.fillRect(x-px(21),y-px(5),px(45),px(6));
      ctx.fillStyle=spec.theme==="night"?"#77799e":"#8c9b8b";ctx.fillRect(x-px(20),y-px(16),px(14),px(12));ctx.fillRect(x-px(14),y-px(25),px(24),px(21));ctx.fillRect(x+px(7),y-px(18),px(15),px(14));
      ctx.fillStyle="#ffffff66";ctx.fillRect(x-px(10),y-px(21),px(8),px(4));ctx.fillRect(x+px(9),y-px(15),px(5),px(3));
      if(prop.variant===1){ctx.fillStyle=spec.accent;ctx.fillRect(x+px(3),y-px(13),px(4),px(4))}
    }else if(prop.type==="mushroom"){
      const cap=spec.theme==="autumn"?"#e68162":spec.theme==="night"?"#cc79ab":"#e56f70";
      ctx.fillStyle="#00000020";ctx.fillRect(x-px(19),y-px(4),px(39),px(5));
      ctx.fillStyle="#fff0ce";ctx.fillRect(x-px(7),y-px(24),px(14),px(24));ctx.fillRect(x-px(15),y-px(17),px(30),px(11));
      ctx.fillStyle=cap;ctx.fillRect(x-px(19),y-px(30),px(38),px(12));ctx.fillRect(x-px(12),y-px(38),px(24),px(9));
      ctx.fillStyle="#fff0ce";ctx.fillRect(x-px(10),y-px(27),px(5),px(4));ctx.fillRect(x+px(7),y-px(31),px(5),px(4));
      ctx.fillStyle="#3e4251";ctx.fillRect(x-px(4),y-px(17),px(3),px(5));ctx.fillRect(x+px(3),y-px(17),px(3),px(5));
    }else if(prop.type==="crystal"){
      ctx.fillStyle="#00000022";ctx.fillRect(x-px(17),y-px(4),px(38),px(5));
      ctx.fillStyle=prop.variant===1?"#fab4db":"#a6eff0";ctx.beginPath();ctx.moveTo(x,y-px(58));ctx.lineTo(x+px(13),y-px(38));ctx.lineTo(x+px(9),y-px(9));ctx.lineTo(x-px(12),y-px(9));ctx.lineTo(x-px(16),y-px(37));ctx.closePath();ctx.fill();
      ctx.fillStyle="#ffffffaa";ctx.beginPath();ctx.moveTo(x,y-px(52));ctx.lineTo(x+px(4),y-px(20));ctx.lineTo(x-px(5),y-px(17));ctx.lineTo(x-px(8),y-px(36));ctx.closePath();ctx.fill();
    }else if(prop.type==="beacon"){
      ctx.fillStyle="#00000025";ctx.fillRect(x-px(22),y-px(5),px(44),px(6));
      ctx.fillStyle="#68567e";ctx.fillRect(x-px(12),y-px(55),px(24),px(51));ctx.fillRect(x-px(20),y-px(60),px(40),px(9));
      ctx.fillStyle=spec.accent;ctx.fillRect(x-px(7),y-px(48),px(14),px(25));ctx.fillRect(x-px(3),y-px(54),px(6),px(37));
      ctx.globalAlpha=.24;ctx.fillStyle=spec.accent;ctx.fillRect(x-px(25),y-px(72),px(50),px(7));ctx.fillRect(x-px(17),y-px(79),px(34),px(7));ctx.globalAlpha=1;
    }else{
      const petal=spec.theme==="autumn"?"#ffe1a1":spec.theme==="night"?"#ded4ff":"#fff0b0";
      ctx.fillStyle=spec.ground;ctx.fillRect(x-px(4),y-px(23),px(4),px(24));ctx.fillRect(x+px(1),y-px(12),px(8),px(4));
      ctx.fillStyle=petal;ctx.fillRect(x-px(8),y-px(32),px(7),px(7));ctx.fillRect(x+px(1),y-px(36),px(7),px(7));ctx.fillRect(x+px(7),y-px(28),px(7),px(7));ctx.fillRect(x-px(1),y-px(26),px(6),px(6));
      ctx.fillStyle=spec.accent;ctx.fillRect(x,y-px(29),px(4),px(4));
    }
  }
  function drawWorld(){
    const spec=world.spec;
    for(const p of world.platforms){
      const x=Math.floor(p.x-camera);if(x>W||x+p.w<0)continue;
      if(p.type==="ground"){
        ctx.fillStyle=spec.soil;ctx.fillRect(x,p.y,p.w,p.h);ctx.fillStyle=spec.ground;ctx.fillRect(x,p.y,p.w,13);
        ctx.fillStyle="#ffffff29";
        for(let j=12;j<p.w;j+=46){ctx.fillRect(x+j,p.y+25+(j%4)*13,9,4);ctx.fillRect(x+j+11,p.y+31+(j%4)*13,4,3)}
        ctx.fillStyle="#00000018";
        for(let j=27;j<p.w;j+=61){ctx.fillRect(x+j,p.y+56+(j%3)*17,15,4);ctx.fillRect(x+j+8,p.y+62+(j%3)*17,7,4)}
        ctx.fillStyle="#a0e594";
        for(let j=9;j<p.w;j+=41){ctx.fillRect(x+j,p.y-4,3,5);ctx.fillRect(x+j+4,p.y-2,3,4);ctx.fillRect(x+j+10,p.y-5,3,6)}
      }else if(p.type==="spring"){
        const compression=p.bump*15;
        ctx.fillStyle="#493d68";ctx.fillRect(x+5,p.y+9-compression,p.w-10,p.h-9+compression);
        ctx.fillStyle="#72d3c7";ctx.fillRect(x,p.y+4-compression,p.w,9);
        ctx.fillStyle="#e3fff1";ctx.fillRect(x+7,p.y-compression,p.w-14,6);
        for(let j=12;j<p.w-8;j+=13){ctx.fillStyle="#ffffff99";ctx.fillRect(x+j,p.y+6-compression,4,3)}
      }else if(p.type==="overhang"){
        ctx.fillStyle="#17223955";ctx.fillRect(x-3,p.y+22,p.w+6,13);
        ctx.fillStyle=spec.theme==="night"?"#777da4":spec.theme==="autumn"?"#876759":"#628275";
        ctx.fillRect(x,p.y,p.w,p.h);
        ctx.fillStyle=spec.theme==="night"?"#aeb9dc":spec.theme==="autumn"?"#c69772":"#b7c79a";
        ctx.fillRect(x+3,p.y+3,p.w-6,5);ctx.fillRect(x+5,p.y+8,Math.max(8,p.w*.42),3);
        ctx.fillStyle="#35445b";ctx.fillRect(x+4,p.y+12,p.w-8,3);
        for(let j=8;j<p.w-6;j+=24){
          ctx.fillStyle="#45536a";ctx.fillRect(x+j,p.y+17,3,8);
          ctx.fillStyle="#d3c49a";ctx.fillRect(x+j+5,p.y+17,7,3);
        }
        ctx.fillStyle=spec.accent;ctx.fillRect(x+8,p.y+25,5,3);ctx.fillRect(x+p.w-13,p.y+25,5,3);
        if(p.w>100){
          const signX=x+p.w/2-31,signY=p.y+5;
          ctx.fillStyle="#35445b";ctx.fillRect(signX-3,signY-2,68,18);
          ctx.fillStyle="#ffe59a";ctx.fillRect(signX,signY,62,12);
          ctx.fillStyle="#725753";ctx.font="bold 8px system-ui";ctx.textAlign="center";ctx.fillText("DASH  →",signX+31,signY+9);ctx.textAlign="left";
        }
      }else{
        roundedRect(ctx,x,p.y,p.w,p.h,7);ctx.fillStyle="#0002";ctx.fill();roundedRect(ctx,x,p.y-4,p.w,p.h,7);ctx.fillStyle=spec.platform;ctx.fill();
        ctx.fillStyle="#fff7ca99";roundedRect(ctx,x+5,p.y,p.w-10,4,3);ctx.fill();
        for(let j=18;j<p.w;j+=37){ctx.fillStyle="#00000019";ctx.fillRect(x+j,p.y+7,2,7)}
        if(p.type==="moving"){
          ctx.fillStyle="#ffffffbb";
          for(let j=16;j<p.w-8;j+=24){ctx.fillRect(x+j,p.y+7,5,3);ctx.fillRect(x+j+4,p.y+10,3,3)}
          ctx.fillStyle="#ffffff55";ctx.fillRect(x+p.w/2-2,p.y+2,4,3);
        }
      }
    }
    for(const prop of world.scenery)drawScenery(prop,spec);
    for(const trap of world.traps)drawSpikeTrap(trap,spec);
    for(const b of world.blocks){
      const x=Math.round(b.x-camera),y=Math.round(b.y-b.bump*8),size=b.size;
      ctx.fillStyle="#5b4354";ctx.fillRect(x-2,y+4,size+4,size);
      ctx.fillStyle=b.used?"#ad947c":spec.accent;ctx.fillRect(x,y,size,size);
      ctx.fillStyle=b.used?"#897565":"#fff0a0";ctx.fillRect(x+3,y+3,size-6,5);ctx.fillRect(x+3,y+size-6,size-6,3);
      ctx.fillStyle=b.used?"#655b68":"#c17d50";ctx.fillRect(x+5,y+10,3,size-16);ctx.fillRect(x+size-8,y+10,3,size-16);
      ctx.fillStyle=b.used?"#655b68":"#fff8d8";ctx.font="bold 23px system-ui";ctx.textAlign="center";ctx.fillText(b.used?"·":"?",x+size/2,y+29);ctx.textAlign="left";
    }
    for(const item of world.items){if(item.taken||item.hidden)continue;const x=item.x-camera,y=item.y+Math.sin(elapsed*3+item.bob)*4;
      ctx.globalAlpha=.18;ctx.fillStyle=spec.accent;ellipse(ctx,x,y,item.r*1.8,item.r*1.8);ctx.fill();ctx.globalAlpha=1;
      if(item.type==="coin"){const squish=.28+.72*Math.abs(Math.sin(elapsed*4+item.bob));ctx.save();ctx.translate(x,y);ctx.scale(squish,1);const cg=ctx.createLinearGradient(0,-11,0,11);cg.addColorStop(0,"#fff1a0");cg.addColorStop(.5,"#ffbd43");cg.addColorStop(1,"#ef8750");ctx.fillStyle=cg;ellipse(ctx,0,0,9,12);ctx.fill();ctx.strokeStyle="#fff6c4";ctx.lineWidth=2;ctx.stroke();ctx.restore()}
      else{ctx.save();ctx.translate(x,y);ctx.rotate(Math.sin(elapsed*2+item.bob)*.18);ctx.fillStyle="#fff1a3";starShape(ctx,0,0,14,5);ctx.fill();ctx.fillStyle="#cf6680";ellipse(ctx,-4,-2,1.7,2);ellipse(ctx,4,-2,1.7,2);ctx.fillStyle="#9b536b";ctx.fillRect(-2,4,4,1);ctx.restore()}
    }
    for(const cp of world.checkpoints){const x=cp.x-camera;if(x< -30||x>W+30)continue;ctx.fillStyle="#59476d";ctx.fillRect(x,FLOOR-82,5,82);ctx.fillStyle=cp.active?"#fff1a1":"#e7d8db";ctx.beginPath();ctx.moveTo(x+5,FLOOR-79);ctx.quadraticCurveTo(x+38,FLOOR-92+Math.sin(elapsed*3)*4,x+44,FLOOR-65);ctx.lineTo(x+5,FLOOR-55);ctx.fill();ctx.fillStyle="#fff";starShape(ctx,x+21,FLOOR-70,7,5)}
    for(const e of world.enemies)if(e.alive)drawEnemy(e,spec);
    if(world.boss&&!world.boss.defeated)drawBoss(world.boss);
    for(const cp of world.checkpoints){void cp}
    drawGoal();
    for(const particle of world.particles){
      const alpha=Math.max(0,particle.life);ctx.globalAlpha=alpha;ctx.fillStyle=particle.color;
      const size=Math.max(2,Math.round(particle.size/3)*3),x=Math.round((particle.x-camera)/3)*3,y=Math.round(particle.y/3)*3;
      ctx.fillRect(x-size/2,y-size/2,size,size);
      if(particle.life>.55){ctx.globalAlpha=alpha*.45;ctx.fillStyle="#fff8d8";ctx.fillRect(x-size/2,y-size/2,Math.max(2,size/3),Math.max(2,size/3))}
      ctx.globalAlpha=1;
    }
    drawPlayer();
  }
  function drawGoal(){
    const x=world.goal-camera;if(x>W+90||x< -100)return;
    ctx.fillStyle="#625474";ctx.fillRect(x+19,FLOOR-106,8,106);
    const wave=Math.sin(elapsed*4)*5;ctx.fillStyle=world.spec.accent;ctx.beginPath();ctx.moveTo(x+27,FLOOR-101);ctx.quadraticCurveTo(x+53,FLOOR-111+wave,x+71,FLOOR-94);ctx.lineTo(x+27,FLOOR-69);ctx.fill();
    ctx.fillStyle="#fff8d4";starShape(ctx,x+47,FLOOR-88+wave*.3,8,5);
    ctx.fillStyle="#ffffff25";ellipse(ctx,x+22,FLOOR-5,35,7);ctx.fill();
  }
  function drawEnemy(e,spec){
    const x=Math.round(e.x-camera),y=Math.round(e.y),w=e.w;
    if(x>W+45||x< -45)return;
    const stunned=e.stun>0,step=Math.sin(e.phase*1.7)>0?1:0;
    ctx.fillStyle="#211e3d55";ctx.fillRect(x+4,FLOOR-4,w-8,4);
    if(e.type==="wisp"){
      ctx.globalAlpha=.18;ctx.fillStyle="#fff0bb";ctx.fillRect(x-6,y-8,w+12,e.h+14);ctx.globalAlpha=1;
      ctx.fillStyle="#c5c5ee";ctx.fillRect(x+7,y+4,w-14,e.h-8);ctx.fillRect(x+3,y+10,w-6,e.h-16);
      ctx.fillStyle="#fff4d0";ctx.fillRect(x+11,y+1,w-22,5);ctx.fillRect(x+2,y+9,6,7);ctx.fillRect(x+w-8,y+9,6,7);
      ctx.fillStyle="#665b9b";ctx.fillRect(x+11,y+e.h-12,4,5);ctx.fillRect(x+w-15,y+e.h-12,4,5);
      ctx.fillStyle="#fff0a0";starShape(ctx,x+w/2,y-5,7,5);ctx.fill();
      ctx.fillStyle="#fff";ctx.fillRect(x+10,y+12,5,6);ctx.fillRect(x+w-15,y+12,5,6);
      ctx.fillStyle="#403858";ctx.fillRect(x+12+(e.dir<0?-2:2),y+14,3,4);ctx.fillRect(x+w-13+(e.dir<0?-2:2),y+14,3,4);
      ctx.fillStyle="#aa9de0";ctx.fillRect(x+7,y+e.h-5,5,6);ctx.fillRect(x+w-12,y+e.h-5,5,6);
      return;
    }
    ctx.save();
    ctx.translate(x+w/2,0);
    if(e.dir<0)ctx.scale(-1,1);
    ctx.translate(-w/2,0);
    if(stunned)ctx.translate(0,e.h*.38);
    if(e.type==="walker"){
      ctx.fillStyle="#312b4b";ctx.fillRect(5,y+e.h-5,w-10,5);
      ctx.fillStyle=spec.enemy;ctx.fillRect(5,y+12,w-10,e.h-17);ctx.fillRect(9,y+6,w-18,10);
      ctx.fillStyle="#fff0c9";ctx.fillRect(1,y+13,w-2,8);
      ctx.fillStyle=spec.theme==="autumn"?"#ffca9b":"#db8c86";ctx.fillRect(4,y+4,w-8,8);ctx.fillRect(9,y,w-18,8);
      ctx.fillStyle="#fff5dc";ctx.fillRect(9,y+13,6,8);ctx.fillRect(w-15,y+13,6,8);
      ctx.fillStyle="#30263f";ctx.fillRect(12,y+16,3,4);ctx.fillRect(w-12,y+16,3,4);
      ctx.fillStyle="#fff";ctx.fillRect(10,y+14,2,2);ctx.fillRect(w-14,y+14,2,2);
      ctx.fillStyle="#e8bc79";ctx.fillRect(8,y+e.h-5,6,5);ctx.fillRect(w-14,y+e.h-5,6,5);
    }else if(e.type==="hopper"){
      const green=spec.theme==="night"?"#71bdba":spec.theme==="autumn"?"#79a66d":"#69bb73";
      const crouch=e.vy<0?3:0;
      ctx.fillStyle="#345f62";ctx.fillRect(3,y+e.h-7,w-6,7);
      ctx.fillStyle=green;ctx.fillRect(4,y+12+crouch,w-8,e.h-19-crouch);ctx.fillRect(9,y+7,w-18,13);
      ctx.fillRect(7,y+1,8,12);ctx.fillRect(w-15,y+1,8,12);
      ctx.fillStyle="#d1f4c3";ctx.fillRect(8,y+2,5,5);ctx.fillRect(w-13,y+2,5,5);
      ctx.fillStyle="#fff8dc";ctx.fillRect(8,y+12,8,9);ctx.fillRect(w-16,y+12,8,9);
      ctx.fillStyle="#26334c";ctx.fillRect(12,y+15,3,4);ctx.fillRect(w-13,y+15,3,4);
      ctx.fillStyle="#ef8793";ctx.fillRect(w-5,y+20,8,3);
      ctx.fillStyle="#e1cd8e";ctx.fillRect(2,y+e.h-5,11,5);ctx.fillRect(w-13,y+e.h-5,11,5);
      if(step&&!stunned){ctx.fillStyle="#4f9579";ctx.fillRect(0,y+e.h-4,8,4);ctx.fillRect(w-8,y+e.h-7,8,4)}
    }else{
      const shell=e.hp>1?"#c5794e":"#e0ae61";
      ctx.fillStyle="#382d48";ctx.fillRect(5,y+e.h-6,w-10,6);
      ctx.fillStyle="#d9a76d";ctx.fillRect(6,y+15,w-12,e.h-21);
      ctx.fillStyle=shell;ctx.fillRect(3,y+7,w-6,17);ctx.fillRect(8,y+2,w-16,9);
      ctx.fillStyle="#f4d494";ctx.fillRect(8,y+9,w-16,4);ctx.fillRect(w/2-2,y+4,4,16);
      ctx.fillStyle="#fff4d2";ctx.fillRect(w-14,y+16,6,8);
      ctx.fillStyle="#302941";ctx.fillRect(w-12,y+18,3,5);
      ctx.fillStyle="#8d5748";ctx.fillRect(8,y+e.h-6,7,6);ctx.fillRect(w-15,y+e.h-6,7,6);
      ctx.fillStyle="#4b3e58";ctx.fillRect(7,y+1,2,7);ctx.fillRect(w-9,y+1,2,7);
      if(e.hp<2){ctx.strokeStyle="#47344b";ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(w/2,y+8);ctx.lineTo(w/2-5,y+14);ctx.lineTo(w/2+1,y+17);ctx.stroke()}
    }
    ctx.restore();
  }
  function drawSpikeTrap(trap,spec){
    const x=Math.round(trap.x-camera),y=trap.y;
    if(x>W||x+trap.w<0)return;
    const count=Math.floor(trap.w/18),step=trap.w/count;
    const pulse=.65+.35*Math.sin(elapsed*5+trap.phase);
    ctx.fillStyle="#25243f";ctx.fillRect(x,y+17,trap.w,5);
    ctx.fillStyle=spec.theme==="night"?"#777ca8":"#5a5368";
    for(let i=0;i<count;i++){
      const left=Math.floor(x+i*step),right=Math.floor(x+(i+1)*step);
      ctx.fillRect(left,y+13,right-left,4);
      ctx.fillStyle="#ded8d1";ctx.beginPath();ctx.moveTo(left+1,y+15);ctx.lineTo((left+right)/2,y+2);ctx.lineTo(right-1,y+15);ctx.closePath();ctx.fill();
      ctx.fillStyle="#fff6de";ctx.fillRect(Math.round((left+right)/2)-1,y+5,2,5);
      ctx.fillStyle=spec.theme==="night"?"#777ca8":"#5a5368";
    }
    ctx.globalAlpha=pulse;ctx.fillStyle="#ffbd73";
    for(let i=0;i<3;i++)ctx.fillRect(x+6+i*8,y+18,3,2);
    ctx.globalAlpha=1;
  }
  function drawBoss(boss){
    const x=boss.x-camera,y=boss.y;if(x>W+100||x< -120)return;
    const flashing=boss.flash>0&&Math.floor(elapsed*20)%2===0;ctx.save();ctx.translate(x+boss.w/2,y+boss.h/2);
    if(flashing)ctx.globalAlpha=.4;
    ctx.fillStyle="#33264e";ellipse(ctx,0,27,35,8);ctx.fill();
    ctx.fillStyle=world.spec.theme==="night"?"#c56c91":"#85618f";ellipse(ctx,0,3,37,36);ctx.fill();
    ctx.fillStyle=world.spec.accent;
    for(let i=0;i<3;i++){const a=-Math.PI/2+i*.8-.8;starShape(ctx,Math.cos(a)*28,Math.sin(a)*27,9,5);ctx.fill()}
    ctx.fillStyle="#f2c0a0";ellipse(ctx,0,10,25,22);ctx.fill();
    ctx.fillStyle="#fff8e8";ellipse(ctx,-9,3,7,9);ellipse(ctx,10,3,7,9);ctx.fill();
    ctx.fillStyle="#39304f";ellipse(ctx,-7,4,2.5,4);ellipse(ctx,12,4,2.5,4);ctx.fill();
    ctx.fillStyle="#9d596e";ctx.beginPath();ctx.moveTo(-4,13);ctx.lineTo(4,13);ctx.lineTo(0,18);ctx.closePath();ctx.fill();
    ctx.fillStyle="#5b4b75";ctx.fillRect(-24,32,13,6);ctx.fillRect(11,32,13,6);
    ctx.restore();
    roundedRect(ctx,x-3,y-20,boss.w+6,9,5);ctx.fillStyle="#241e42";ctx.fill();
    roundedRect(ctx,x,y-19,(boss.w-4)*boss.health/boss.maxHealth,7,4);ctx.fillStyle="#ff8a9a";ctx.fill();
    if(player.x-camera>boss.x-camera-230){ctx.fillStyle="#fff2c9";ctx.font="bold 13px system-ui";ctx.textAlign="center";ctx.fillText("THE STARLIGHT GUARDIAN",x+boss.w/2,y-31);ctx.textAlign="left"}
  }
  function drawPlayer(){
    const p=player,x=p.x-camera,y=p.y;
    if(p.invuln>0&&Math.floor(elapsed*18)%2===0)return;
    const bob=p.grounded&&Math.abs(p.vx)>35?Math.round(Math.sin(p.anim*2)):0;
    const glowy=p.starTime>0;
    if(glowy){ctx.globalAlpha=.3;ctx.fillStyle="#ffe880";starShape(ctx,x+16,y+21,30+Math.sin(elapsed*14)*3,8);ctx.fill();ctx.globalAlpha=1}
    if(p.dashTime>0){
      ctx.globalAlpha=.45;ctx.fillStyle="#b8f4ff";
      for(let i=1;i<=3;i++)ctx.fillRect(Math.round(x+(p.face<0?1:20)-p.face*i*12),Math.round(y+9+i*7),12,4);
      ctx.globalAlpha=1;
    }
    ctx.fillStyle="#59446b";ctx.fillRect(Math.round(x+2),Math.round(y+42),29,4);
    const sprite=[
      "....YYYY....",
      "...YYYYYY...",
      "..HHHHHHHH..",
      ".HHHHHHHHHH.",
      "HSSSSSSSSSSH",
      "HSSSESSSSSSH",
      "HSSSSSSSSSSH",
      ".SSSSSSSSS..",
      "..SSSSSSSS..",
      "..TTTTTTTT..",
      ".TTTTTTTTTT.",
      "PTTCTTTTTTLL",
      ".PCTTTTTTT.L",
      "..BBBBBBBB..",
      "..BBB..BBB..",
      ".OOOO..OOOO."
    ];
    const palette={H:"#49364e",S:"#f2b889",E:"#332a43",Y:"#ffd469",T:"#328f83",C:"#80d4b4",P:"#754938",B:"#35466c",O:"#b8754c",L:"#ffe789"};
    const running=p.grounded&&Math.abs(p.vx)>40;
    if(running&&Math.floor(p.anim*1.5)%2===0){sprite[14]=".BBB..BBBB.";sprite[15]="OOO...OOOO."}
    ctx.save();
    if(p.face<0){ctx.translate(Math.round(x+p.w/2),0);ctx.scale(-1,1);ctx.translate(-Math.round(x+p.w/2),0)}
    const pixel=3;
    const sx=Math.round((x+p.w/2-18)/pixel)*pixel,sy=Math.round(y/pixel)*pixel+bob-5;
    for(let row=0;row<sprite.length;row++)for(let col=0;col<sprite[row].length;col++){
      const color=palette[sprite[row][col]];if(color){ctx.fillStyle=color;ctx.fillRect(sx+col*pixel,sy+row*pixel,pixel,pixel)}
    }
    ctx.fillStyle="#fff8d8";ctx.fillRect(sx+6,sy+19,pixel,pixel);
    ctx.fillStyle="#ffffff66";ctx.fillRect(sx+9,sy+26,1,1);
    if(glowy){ctx.fillStyle="#fff1a1";ctx.fillRect(sx-8,sy+37,4,4);ctx.fillRect(sx+48,sy+25,4,4)}
    ctx.restore();
  }
  function render(){
    ctx.setTransform(.5,0,0,.5,0,0);
    if(!world)drawMenuScene();else{drawBackground();drawWorld()}
    ctx.setTransform(1,0,0,1,0,0);
    screen.imageSmoothingEnabled=false;
    screen.clearRect(0,0,canvas.width,canvas.height);
    screen.drawImage(art,0,0,canvas.width,canvas.height);
  }
  function drawMenuScene(){
    const g=ctx.createLinearGradient(0,0,0,H);g.addColorStop(0,"#68c9df");g.addColorStop(.65,"#b4e9dc");g.addColorStop(1,"#f8d99f");ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
    ctx.fillStyle="#fff5cf";ellipse(ctx,765,120,48,48);ctx.fill();ctx.fillStyle="#89d0b0";ellipse(ctx,220,420,300,115);ctx.fill();ellipse(ctx,750,440,380,135);ctx.fill();
    ctx.fillStyle="#398d74";ctx.fillRect(0,FLOOR,W,H-FLOOR);ctx.fillStyle="#67ba82";ctx.fillRect(0,FLOOR,W,13);
    for(let i=0;i<9;i++){const x=70+i*112;ctx.fillStyle="#3c927a";ellipse(ctx,x,390,27,27);ellipse(ctx,x+18,382,25,28);ctx.fill();ctx.fillStyle="#e0a96b";ctx.fillRect(x+8,405,10,60)}
    ctx.save();ctx.translate(482,389);ctx.fillStyle="#584970";ellipse(ctx,0,20,14,4);ctx.fill();ctx.fillStyle="#60b69d";roundedRect(ctx,-13,-4,26,19,9);ctx.fill();ctx.fillStyle="#f4bb8b";ellipse(ctx,0,-17,14,15);ctx.fill();ctx.fillStyle="#694c64";ellipse(ctx,0,-26,14,8);ctx.fill();ctx.fillStyle="#51415a";ellipse(ctx,5,-18,2,3);ctx.fill();ctx.fillStyle="#ffcf67";starShape(ctx,-15,-23,6,5);ctx.fill();ctx.restore();
    for(let i=0;i<7;i++){ctx.fillStyle="#ffe27a";starShape(ctx,190+i*105,260+Math.sin(elapsed*2+i)*18,10,5);ctx.fill()}
  }
  function frame(now){const dt=Math.min(.033,(now-last)/1000||0);last=now;update(dt);render();requestAnimationFrame(frame)}
  updateHud();requestAnimationFrame(frame);
})();
