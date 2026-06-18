/* ===== Concept B — Neural Intelligence ===== */
(function(){
  var html=document.documentElement;
  html.classList.add('cB');
  var REDUCE=window.matchMedia('(prefers-reduced-motion:reduce)').matches;
  var hero=document.getElementById('home');
  if(!hero) return;

  /* ---------- Canvas : reseau de neurones + propagation de signal ---------- */
  if(!REDUCE){
    var cv=document.createElement('canvas');
    cv.setAttribute('aria-hidden','true');
    cv.style.cssText='position:absolute;inset:0;z-index:0;width:100%;height:100%;pointer-events:none';
    hero.insertBefore(cv, hero.firstChild);
    var ctx=cv.getContext('2d');
    var DPR=Math.min(window.devicePixelRatio||1, 2);
    var W=0,H=0, layers=[], edges=[], pulses=[], mx=-1e4, my=-1e4, running=true, raf=0, t=0;

    function accent(){ var v=getComputedStyle(html).getPropertyValue('--a').trim()||'#00B4D8'; v=v.replace('#',''); if(v.length===3){v=v.split('').map(function(x){return x+x;}).join('');} var n=parseInt(v,16); return [n>>16&255, n>>8&255, n&255]; }
    var A=accent(), VIO=[150,120,255];

    function build(){
      var r=hero.getBoundingClientRect(); W=r.width; H=r.height;
      cv.width=Math.round(W*DPR); cv.height=Math.round(H*DPR);
      ctx.setTransform(DPR,0,0,DPR,0,0);
      var cols = W<700?4:6;
      var marginX=W*0.06, usableX=W-marginX*2;
      layers=[];
      for(var c=0;c<cols;c++){
        var x=marginX + (cols>1?usableX*(c/(cols-1)):usableX*0.5);
        var per=(W<700?3:4) + (c%2);
        var arr=[];
        for(var i=0;i<per;i++){
          var y=H*0.15 + (H*0.68)*((i+0.5)/per) + Math.sin(c*1.6+i)*9;
          arr.push({x:x,y:y,bx:x,by:y,ph:Math.random()*6.283,glow:0});
        }
        layers.push(arr);
      }
      edges=[];
      for(var c2=0;c2<layers.length-1;c2++){
        var L=layers[c2], R=layers[c2+1];
        for(var a=0;a<L.length;a++){
          var order=[]; for(var b=0;b<R.length;b++) order.push(b);
          order.sort(function(p,q){ return Math.abs(R[p].by-L[a].by)-Math.abs(R[q].by-L[a].by); });
          var k=Math.min(2+(a%2), R.length);
          for(var e=0;e<k;e++){ edges.push({a:L[a], b:R[order[e]], life:Math.random()}); }
        }
      }
      pulses=[];
    }

    function spawnPulse(near){
      if(!edges.length) return;
      var ed;
      if(near){
        // pick an edge whose start is near the cursor
        var best=null, bd=1e9;
        for(var i=0;i<edges.length;i++){ var dx=edges[i].a.x-mx, dy=edges[i].a.y-my, d=dx*dx+dy*dy; if(d<bd){bd=d;best=edges[i];} }
        ed = bd<30000 ? best : edges[(Math.random()*edges.length)|0];
      } else { ed=edges[(Math.random()*edges.length)|0]; }
      pulses.push({e:ed, t:0, sp:0.012+Math.random()*0.012, vio:Math.random()<0.22});
    }

    function frame(){
      if(!running){ raf=0; return; }
      t++;
      ctx.clearRect(0,0,W,H);
      var i,j,n,ed,p;
      // node drift + cursor attraction
      for(i=0;i<layers.length;i++) for(j=0;j<layers[i].length;j++){ n=layers[i][j];
        n.x=n.bx+Math.sin(t*0.006+n.ph)*4; n.y=n.by+Math.cos(t*0.005+n.ph)*5;
        var dx=mx-n.x, dy=my-n.y, d2=dx*dx+dy*dy; if(d2<22000){ n.x+=dx*0.0011; n.y+=dy*0.0011; }
        if(n.glow>0.01) n.glow*=0.9; else n.glow=0;
      }
      // edges (synapses)
      for(i=0;i<edges.length;i++){ ed=edges[i];
        var al=0.05+0.05*(0.5+0.5*Math.sin(t*0.01+ed.life*6.283));
        ctx.strokeStyle='rgba('+A[0]+','+A[1]+','+A[2]+','+al+')';
        ctx.lineWidth=1; ctx.beginPath(); ctx.moveTo(ed.a.x,ed.a.y); ctx.lineTo(ed.b.x,ed.b.y); ctx.stroke();
      }
      // spawn ambient pulses
      if(t%12===0) spawnPulse(false);
      // travelling pulses (signal propagation)
      for(i=pulses.length-1;i>=0;i--){ p=pulses[i]; p.t+=p.sp;
        if(p.t>=1){ p.e.b.glow=1; pulses.splice(i,1); continue; }
        var px=p.e.a.x+(p.e.b.x-p.e.a.x)*p.t, py=p.e.a.y+(p.e.b.y-p.e.a.y)*p.t;
        var col=p.vio?VIO:A;
        var g=ctx.createRadialGradient(px,py,0,px,py,7);
        g.addColorStop(0,'rgba('+col[0]+','+col[1]+','+col[2]+',.95)');
        g.addColorStop(1,'rgba('+col[0]+','+col[1]+','+col[2]+',0)');
        ctx.fillStyle=g; ctx.beginPath(); ctx.arc(px,py,7,0,6.283); ctx.fill();
      }
      // nodes (neurons)
      for(i=0;i<layers.length;i++) for(j=0;j<layers[i].length;j++){ n=layers[i][j];
        var rad=2+n.glow*2.6;
        ctx.beginPath(); ctx.arc(n.x,n.y,rad,0,6.283);
        ctx.fillStyle='rgba('+A[0]+','+A[1]+','+A[2]+','+(0.5+n.glow*0.45)+')'; ctx.fill();
        if(n.glow>0.12){ ctx.beginPath(); ctx.arc(n.x,n.y,rad+6,0,6.283); ctx.fillStyle='rgba('+A[0]+','+A[1]+','+A[2]+','+(n.glow*0.14)+')'; ctx.fill(); }
      }
      raf=requestAnimationFrame(frame);
    }
    function start(){ if(!raf){ running=true; raf=requestAnimationFrame(frame); } }

    hero.addEventListener('pointermove',function(e){ var r=hero.getBoundingClientRect(); mx=e.clientX-r.left; my=e.clientY-r.top; if(Math.random()<0.10) spawnPulse(true); });
    hero.addEventListener('pointerleave',function(){ mx=-1e4; my=-1e4; });
    window.addEventListener('resize',function(){ build(); },{passive:true});
    try{ new MutationObserver(function(){ A=accent(); }).observe(html,{attributes:true,attributeFilter:['data-theme']}); }catch(e){}
    if('IntersectionObserver' in window){ new IntersectionObserver(function(es){ es.forEach(function(x){ if(x.isIntersecting){ start(); } else { running=false; } }); },{threshold:0}).observe(hero); }
    build(); start();
  }

  /* ---------- GSAP : entree hero + reveals scroll + parallax ---------- */
  function initGsap(){
    if(REDUCE || !window.gsap || !window.ScrollTrigger) return;
    var gsap=window.gsap; gsap.registerPlugin(window.ScrollTrigger);
    var tl=gsap.timeline({defaults:{ease:'power3.out'}});
    tl.from('.hero-eyebrow',{y:16,opacity:0,duration:.6})
      .from('.hero-title .hw span',{yPercent:118,opacity:0,duration:.9,stagger:.08},'-=.2')
      .from('.hero-sub',{y:18,opacity:0,duration:.6},'-=.45')
      .from('.hero-stack li',{y:12,opacity:0,duration:.5,stagger:.05},'-=.3')
      .from('.hero-metrics .hm',{y:14,opacity:0,duration:.5,stagger:.06},'-=.3')
      .from('.hero-ctas .btn',{y:12,opacity:0,duration:.5,stagger:.07},'-=.3')
      .from('.hero-right',{x:22,opacity:0,duration:.7},'-=.6');

    gsap.to('.hero-orb',{yPercent:32,ease:'none',scrollTrigger:{trigger:'#home',start:'top top',end:'bottom top',scrub:true}});

    gsap.utils.toArray('.w > .slbl, .w > .sh, .w > .ss').forEach(function(el){
      gsap.from(el,{y:24,opacity:0,duration:.7,scrollTrigger:{trigger:el,start:'top 86%'}});
    });
    gsap.utils.toArray('.skg,.agrid,.exg,.edug,.certg,.cv-grid,.ccg').forEach(function(g){
      gsap.from(g.children,{y:28,opacity:0,duration:.6,stagger:.07,scrollTrigger:{trigger:g,start:'top 84%'}});
    });
    gsap.from('.pg .pc',{y:40,opacity:0,duration:.7,stagger:.06,scrollTrigger:{trigger:'.pg',start:'top 82%'}});

    window.ScrollTrigger.refresh();
  }
  if(document.readyState==='complete') initGsap();
  else window.addEventListener('load', initGsap);
})();
