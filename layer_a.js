/* ===== Concept A+ — Luxury Data Command Center (Enhanced) ===== */
(function(){
  var html=document.documentElement;
  html.classList.add('cA');
  var REDUCE=window.matchMedia('(prefers-reduced-motion:reduce)').matches;
  var hero=document.getElementById('home');
  if(!hero) return;

  function rgb(varName,fb){ var v=getComputedStyle(html).getPropertyValue(varName).trim()||fb; v=v.replace('#',''); if(v.length===3){v=v.split('').map(function(x){return x+x;}).join('');} var n=parseInt(v,16); return [n>>16&255,n>>8&255,n&255]; }

  /* ---------- Canvas : cockpit data premium ---------- */
  if(!REDUCE){
    var cv=document.createElement('canvas');
    cv.setAttribute('aria-hidden','true');
    cv.style.cssText='position:absolute;inset:0;z-index:0;width:100%;height:100%;pointer-events:none';
    hero.insertBefore(cv, hero.firstChild);
    var ctx=cv.getContext('2d');
    var DPR=Math.min(window.devicePixelRatio||1,2);
    var W=0,H=0,t=0,running=true,raf=0,mx=-1e4,my=-1e4;
    var A=rgb('--a','#00B4D8'), GOLD=rgb('--gld','#F4A261');
    var spark=[], spark2=[], spark3=[];
    var dataLines=[];
    function recolor(){ A=rgb('--a','#00B4D8'); GOLD=rgb('--gld','#F4A261'); }

    function resize(){
      var r=hero.getBoundingClientRect(); W=r.width; H=r.height;
      cv.width=Math.round(W*DPR); cv.height=Math.round(H*DPR); ctx.setTransform(DPR,0,0,DPR,0,0);
      if(!spark.length){ for(var i=0;i<60;i++){ spark.push(0.5); spark2.push(0.5); spark3.push(0.5); } }
      buildDataLines();
    }

    function buildDataLines(){
      dataLines=[];
      var count=W<700?4:7;
      for(var i=0;i<count;i++){
        dataLines.push({
          y: H*0.12 + (H*0.76)*(i/(count-1)),
          progress: 0,
          speed: 0.003+Math.random()*0.004,
          width: W*(0.15+Math.random()*0.25),
          startX: W*(0.55+Math.random()*0.35),
          alpha: 0.03+Math.random()*0.03,
          gold: i%3===0
        });
      }
    }

    function grid(){
      var step=W<700?48:68, gx, gy;
      ctx.lineWidth=1;
      ctx.strokeStyle='rgba('+A[0]+','+A[1]+','+A[2]+',.04)';
      ctx.beginPath();
      for(gx=step;gx<W;gx+=step){ ctx.moveTo(gx,0); ctx.lineTo(gx,H); }
      for(gy=step;gy<H;gy+=step){ ctx.moveTo(0,gy); ctx.lineTo(W,gy); }
      ctx.stroke();
      /* cross marks at intersections (subtle) */
      if(W>=700){
        ctx.strokeStyle='rgba('+A[0]+','+A[1]+','+A[2]+',.06)';
        ctx.lineWidth=0.5;
        for(gx=step;gx<W;gx+=step*2){
          for(gy=step;gy<H;gy+=step*2){
            ctx.beginPath(); ctx.moveTo(gx-3,gy); ctx.lineTo(gx+3,gy); ctx.moveTo(gx,gy-3); ctx.lineTo(gx,gy+3); ctx.stroke();
          }
        }
      }
    }

    function scanLine(){
      var sy=((t*0.5)%(H+160))-80;
      var sg=ctx.createLinearGradient(0,sy-50,0,sy+50);
      sg.addColorStop(0,'rgba('+A[0]+','+A[1]+','+A[2]+',0)');
      sg.addColorStop(.5,'rgba('+A[0]+','+A[1]+','+A[2]+',.06)');
      sg.addColorStop(1,'rgba('+A[0]+','+A[1]+','+A[2]+',0)');
      ctx.fillStyle=sg; ctx.fillRect(0,sy-50,W,100);
    }

    function cursorHalo(){
      if(mx<-1000) return;
      var g=ctx.createRadialGradient(mx,my,0,mx,my,200);
      g.addColorStop(0,'rgba('+A[0]+','+A[1]+','+A[2]+',.09)');
      g.addColorStop(.5,'rgba('+A[0]+','+A[1]+','+A[2]+',.03)');
      g.addColorStop(1,'rgba('+A[0]+','+A[1]+','+A[2]+',0)');
      ctx.fillStyle=g; ctx.beginPath(); ctx.arc(mx,my,200,0,6.283); ctx.fill();
      /* inner bright core */
      var g2=ctx.createRadialGradient(mx,my,0,mx,my,30);
      g2.addColorStop(0,'rgba('+A[0]+','+A[1]+','+A[2]+',.12)');
      g2.addColorStop(1,'rgba('+A[0]+','+A[1]+','+A[2]+',0)');
      ctx.fillStyle=g2; ctx.beginPath(); ctx.arc(mx,my,30,0,6.283); ctx.fill();
    }

    function gauge(cx,cy,r,speed,valBase){
      var start=Math.PI*0.75, span=Math.PI*1.5;
      var val=valBase+0.18*Math.sin(t*speed);
      /* track */
      ctx.lineWidth=3; ctx.lineCap='round';
      ctx.strokeStyle='rgba('+A[0]+','+A[1]+','+A[2]+',.08)';
      ctx.beginPath(); ctx.arc(cx,cy,r,start,start+span); ctx.stroke();
      /* filled arc */
      var grd=ctx.createLinearGradient(cx-r,cy,cx+r,cy);
      grd.addColorStop(0,'rgba('+A[0]+','+A[1]+','+A[2]+',.45)');
      grd.addColorStop(1,'rgba('+GOLD[0]+','+GOLD[1]+','+GOLD[2]+',.45)');
      ctx.strokeStyle=grd;
      ctx.beginPath(); ctx.arc(cx,cy,r,start,start+span*val); ctx.stroke();
      /* golden dot at tip */
      var ta=start+span*val, tx=cx+Math.cos(ta)*r, ty=cy+Math.sin(ta)*r;
      var tg=ctx.createRadialGradient(tx,ty,0,tx,ty,8);
      tg.addColorStop(0,'rgba('+GOLD[0]+','+GOLD[1]+','+GOLD[2]+',.9)'); tg.addColorStop(1,'rgba('+GOLD[0]+','+GOLD[1]+','+GOLD[2]+',0)');
      ctx.fillStyle=tg; ctx.beginPath(); ctx.arc(tx,ty,8,0,6.283); ctx.fill();
      /* graduations */
      ctx.strokeStyle='rgba('+A[0]+','+A[1]+','+A[2]+',.12)'; ctx.lineWidth=0.8;
      for(var k=0;k<=12;k++){ var a=start+span*(k/12); ctx.beginPath(); ctx.moveTo(cx+Math.cos(a)*(r+5),cy+Math.sin(a)*(r+5)); ctx.lineTo(cx+Math.cos(a)*(r+10),cy+Math.sin(a)*(r+10)); ctx.stroke(); }
      /* center value text */
      ctx.font='600 '+(r*0.38)+'px "Bebas Neue",sans-serif';
      ctx.fillStyle='rgba('+A[0]+','+A[1]+','+A[2]+',.35)';
      ctx.textAlign='center'; ctx.textBaseline='middle';
      ctx.fillText(Math.round(val*100)+'%',cx,cy+2);
    }

    function area(x,y,w,h,buf,col,alpha){
      if(t%3===0){ buf.push(Math.max(0.08,Math.min(0.95, buf[buf.length-1]+(Math.random()-0.5)*0.2))); buf.shift(); }
      var n=buf.length, dx=w/(n-1);
      ctx.beginPath();
      for(var i=0;i<n;i++){ var px=x+i*dx, py=y+h-buf[i]*h; if(i===0)ctx.moveTo(px,py); else ctx.lineTo(px,py); }
      ctx.lineTo(x+w,y+h); ctx.lineTo(x,y+h); ctx.closePath();
      var g=ctx.createLinearGradient(0,y,0,y+h);
      g.addColorStop(0,'rgba('+col[0]+','+col[1]+','+col[2]+','+(alpha*0.5)+')');
      g.addColorStop(1,'rgba('+col[0]+','+col[1]+','+col[2]+',0)');
      ctx.fillStyle=g; ctx.fill();
      ctx.beginPath();
      for(var j=0;j<n;j++){ var qx=x+j*dx, qy=y+h-buf[j]*h; if(j===0)ctx.moveTo(qx,qy); else ctx.lineTo(qx,qy); }
      ctx.strokeStyle='rgba('+col[0]+','+col[1]+','+col[2]+','+alpha+')'; ctx.lineWidth=1.5; ctx.stroke();
    }

    function bars(x,y,w,h){
      var n=W<700?7:12, bw=w/n*0.5, gap=w/n;
      for(var i=0;i<n;i++){
        var bh=h*(0.2+0.75*(0.5+0.5*Math.sin(t*0.018+i*0.55)));
        var grd=ctx.createLinearGradient(0,y+h-bh,0,y+h);
        grd.addColorStop(0,'rgba('+A[0]+','+A[1]+','+A[2]+',.22)');
        grd.addColorStop(1,'rgba('+A[0]+','+A[1]+','+A[2]+',.06)');
        ctx.fillStyle=grd;
        ctx.fillRect(x+i*gap, y+h-bh, bw, bh);
        /* gold cap on tallest bars */
        if(bh>h*0.65){
          ctx.fillStyle='rgba('+GOLD[0]+','+GOLD[1]+','+GOLD[2]+',.18)';
          ctx.fillRect(x+i*gap, y+h-bh, bw, 2);
        }
      }
    }

    function drawDataLines(){
      for(var i=0;i<dataLines.length;i++){
        var dl=dataLines[i];
        dl.progress=Math.min(1, dl.progress+dl.speed);
        var drawW=dl.width*dl.progress;
        var col=dl.gold?GOLD:A;
        var g=ctx.createLinearGradient(dl.startX,0,dl.startX+drawW,0);
        g.addColorStop(0,'rgba('+col[0]+','+col[1]+','+col[2]+',0)');
        g.addColorStop(0.3,'rgba('+col[0]+','+col[1]+','+col[2]+','+dl.alpha+')');
        g.addColorStop(1,'rgba('+col[0]+','+col[1]+','+col[2]+',0)');
        ctx.strokeStyle=g; ctx.lineWidth=0.8;
        ctx.beginPath(); ctx.moveTo(dl.startX,dl.y); ctx.lineTo(dl.startX+drawW,dl.y); ctx.stroke();
        /* bright tip */
        if(dl.progress<1){
          var tipX=dl.startX+drawW;
          var tg=ctx.createRadialGradient(tipX,dl.y,0,tipX,dl.y,5);
          tg.addColorStop(0,'rgba('+col[0]+','+col[1]+','+col[2]+',.4)');
          tg.addColorStop(1,'rgba('+col[0]+','+col[1]+','+col[2]+',0)');
          ctx.fillStyle=tg; ctx.beginPath(); ctx.arc(tipX,dl.y,5,0,6.283); ctx.fill();
        }
        /* loop */
        if(dl.progress>=1 && Math.random()<0.005){
          dl.progress=0;
          dl.startX=W*(0.55+Math.random()*0.35);
          dl.width=W*(0.15+Math.random()*0.25);
        }
      }
    }

    function miniDash(x,y,w,h){
      /* mini floating dashboard panel outline */
      ctx.strokeStyle='rgba('+A[0]+','+A[1]+','+A[2]+',.06)';
      ctx.lineWidth=1;
      ctx.strokeRect(x,y,w,h);
      /* header line */
      ctx.fillStyle='rgba('+A[0]+','+A[1]+','+A[2]+',.04)';
      ctx.fillRect(x,y,w,1);
      /* mini bar chart inside */
      var cols=5, bw=(w-10)/cols, bx=x+5;
      for(var i=0;i<cols;i++){
        var bh=(h-12)*(0.3+0.6*Math.abs(Math.sin(t*0.015+i*1.2)));
        ctx.fillStyle='rgba('+A[0]+','+A[1]+','+A[2]+',.10)';
        ctx.fillRect(bx+i*bw+1, y+h-4-bh, bw-2, bh);
      }
    }

    function frame(){
      if(!running){ raf=0; return; }
      t++; ctx.clearRect(0,0,W,H);
      grid();
      scanLine();
      drawDataLines();
      if(W>820){
        gauge(W*0.83, H*0.26, Math.min(65,H*0.14), 0.011, 0.58);
        gauge(W*0.68, H*0.18, Math.min(35,H*0.075), 0.017, 0.72);
        area(W*0.56, H*0.68, W*0.36, H*0.15, spark, A, 0.4);
        area(W*0.56, H*0.56, W*0.28, H*0.08, spark2, GOLD, 0.22);
        bars(W*0.58, H*0.45, W*0.28, H*0.08);
        miniDash(W*0.88, H*0.52, W*0.08, H*0.14);
      } else {
        area(W*0.06, H*0.74, W*0.88, H*0.12, spark, A, 0.3);
        bars(W*0.06, H*0.62, W*0.5, H*0.08);
      }
      cursorHalo();
      raf=requestAnimationFrame(frame);
    }
    function start(){ if(!raf){ running=true; raf=requestAnimationFrame(frame); } }
    hero.addEventListener('pointermove',function(e){ var r=hero.getBoundingClientRect(); mx=e.clientX-r.left; my=e.clientY-r.top; });
    hero.addEventListener('pointerleave',function(){ mx=-1e4; my=-1e4; });
    window.addEventListener('resize',function(){ resize(); },{passive:true});
    try{ new MutationObserver(recolor).observe(html,{attributes:true,attributeFilter:['data-theme']}); }catch(e){}
    if('IntersectionObserver' in window){ new IntersectionObserver(function(es){ es.forEach(function(x){ if(x.isIntersecting) start(); else running=false; }); },{threshold:0}).observe(hero); }
    resize(); start();

    /* ---------- Tuiles glass flottantes (cockpit) ---------- */
    if(window.innerWidth>900){
      var wrap=document.createElement('div'); wrap.className='cA-tiles'; wrap.setAttribute('aria-hidden','true');
      hero.appendChild(wrap);
      var defs=[
        {lbl:'// flux data', x:'66%', y:'12%', gold:false, base:124, unit:'/s'},
        {lbl:'// pipeline', x:'82%', y:'58%', gold:true, base:8, unit:' actifs'},
        {lbl:'// signal', x:'58%', y:'38%', gold:false, base:47, unit:' ms'},
        {lbl:'// accuracy', x:'76%', y:'82%', gold:false, base:96, unit:'%'}
      ];
      defs.forEach(function(d){
        var tile=document.createElement('div'); tile.className='cA-tile';
        tile.style.left=d.x; tile.style.top=d.y;
        var lbl=document.createElement('div'); lbl.className='lbl'; lbl.textContent=d.lbl;
        var val=document.createElement('div'); val.className='val'+(d.gold?' gold':''); val.textContent=d.base;
        var delta=document.createElement('div'); delta.className='delta'; delta.textContent='+0.0'+d.unit;
        var tc=document.createElement('canvas'); tc.width=120; tc.height=28;
        tile.appendChild(lbl); tile.appendChild(val); tile.appendChild(delta); tile.appendChild(tc);
        wrap.appendChild(tile);
        var tctx=tc.getContext('2d'), tbuf=[]; for(var i=0;i<24;i++) tbuf.push(0.5);
        var cur=d.base;
        var tcol=d.gold?GOLD:A;
        d._tick=function(){
          var change=(Math.random()-0.5)*(d.base*0.04+1);
          cur += change; cur=Math.max(0,cur);
          val.textContent=(d.base<20? cur.toFixed(1) : Math.round(cur));
          delta.textContent=(change>=0?'+':'')+change.toFixed(1)+d.unit;
          tbuf.push(Math.max(0.1,Math.min(0.9,tbuf[tbuf.length-1]+(Math.random()-0.5)*0.3))); tbuf.shift();
          tctx.clearRect(0,0,120,28);
          tctx.beginPath();
          for(var k=0;k<tbuf.length;k++){ var px=k/(tbuf.length-1)*120, py=28-tbuf[k]*24; if(k===0)tctx.moveTo(px,py); else tctx.lineTo(px,py); }
          tcol=d.gold?GOLD:A;
          tctx.strokeStyle='rgba('+tcol[0]+','+tcol[1]+','+tcol[2]+',.8)'; tctx.lineWidth=1.4; tctx.stroke();
          /* area fill under line */
          tctx.lineTo(120,28); tctx.lineTo(0,28); tctx.closePath();
          tctx.fillStyle='rgba('+tcol[0]+','+tcol[1]+','+tcol[2]+',.08)'; tctx.fill();
        };
        if(!window.gsap){ tile.style.opacity='1'; }
      });
      var tickTimer=setInterval(function(){ if(running){ defs.forEach(function(d){ if(d._tick) d._tick(); }); } }, 800);
      window.addEventListener('beforeunload',function(){ clearInterval(tickTimer); });
      hero._cATiles=defs;
    }
  }

  /* ---------- CTA fort dans section finale ---------- */
  (function(){
    var contact=document.getElementById('contact'); if(!contact) return;
    var w=contact.querySelector('.w'); var ss=w?w.querySelector('.ss'):null;
    var cta=document.createElement('p'); cta.className='cA-cta'; cta.id='cACta';
    function setCta(){ cta.textContent=(document.documentElement.lang==='en')?"Let's build your next data, BI or AI win.":"Donnons vie à votre prochain projet data, BI ou IA."; }
    setCta();
    if(ss && ss.parentNode){ ss.parentNode.insertBefore(cta, ss.nextSibling); }
    else if(w){ w.insertBefore(cta, w.firstChild); }
    try{ new MutationObserver(setCta).observe(document.documentElement,{attributes:true,attributeFilter:['lang']}); }catch(e){}
  })();

  /* ---------- GSAP : choregraphie premium ---------- */
  function initGsap(){
    if(REDUCE || !window.gsap || !window.ScrollTrigger) return;
    var gsap=window.gsap; gsap.registerPlugin(window.ScrollTrigger);

    /* Hero entrance — staggered, cinematic */
    var tl=gsap.timeline({defaults:{ease:'power3.out'}});
    tl.from('.hero-eyebrow',{y:20,opacity:0,duration:.7})
      .from('.hero-title .hw span',{yPercent:120,opacity:0,duration:.9,stagger:.08},'-=.25')
      .from('.hero-sub',{y:18,opacity:0,duration:.6},'-=.4')
      .from('.hero-stack li',{y:14,opacity:0,duration:.55,stagger:.06},'-=.3')
      .from('.hero-metrics .hm',{y:16,opacity:0,duration:.55,stagger:.08},'-=.3')
      .from('.hero-ctas .btn',{y:14,opacity:0,duration:.55,stagger:.08},'-=.3')
      .from('.hero-right',{x:30,opacity:0,duration:.8,ease:'power2.out'},'-=.6');

    /* Progressive metric illumination */
    var metrics=document.querySelectorAll('.hero-metrics .hm');
    if(metrics.length){
      metrics.forEach(function(m,i){
        gsap.delayedCall(1.8+i*0.3, function(){ m.classList.add('lit'); });
      });
    }

    /* Tiles: appear + gentle float */
    gsap.utils.toArray('.cA-tile').forEach(function(tile,i){
      gsap.to(tile,{opacity:1,duration:.9,delay:1.2+i*.2,ease:'power2.out'});
      gsap.to(tile,{y:'+=12',duration:4.5+i*0.8,repeat:-1,yoyo:true,ease:'sine.inOut',delay:1.2+i*.2});
    });

    /* Parallax hero orb */
    gsap.to('.hero-orb',{yPercent:30,ease:'none',scrollTrigger:{trigger:'#home',start:'top top',end:'bottom top',scrub:true}});

    /* Section heading reveals with depth */
    gsap.utils.toArray('.w > .slbl').forEach(function(el){
      gsap.from(el,{y:12,opacity:0,duration:.5,scrollTrigger:{trigger:el,start:'top 90%'}});
    });
    gsap.utils.toArray('.w > .sh').forEach(function(el){
      gsap.from(el,{y:28,opacity:0,duration:.75,ease:'power2.out',scrollTrigger:{trigger:el,start:'top 88%'}});
    });
    gsap.utils.toArray('.w > .ss').forEach(function(el){
      gsap.from(el,{y:16,opacity:0,duration:.6,scrollTrigger:{trigger:el,start:'top 88%'}});
    });

    /* Grid children stagger (stack, about, etc.) */
    gsap.utils.toArray('.skg,.agrid,.edug,.certg,.cv-grid,.ccg').forEach(function(g){
      gsap.from(g.children,{y:30,opacity:0,duration:.65,stagger:.08,ease:'power2.out',scrollTrigger:{trigger:g,start:'top 85%'}});
    });

    /* Experience: timeline trace + cards */
    var exg=document.querySelector('.exg');
    if(exg){
      window.ScrollTrigger.create({trigger:exg,start:'top 80%',onEnter:function(){ exg.classList.add('drawn'); }});
      gsap.from('.exg .ex',{y:30,opacity:0,duration:.65,stagger:.13,ease:'power2.out',scrollTrigger:{trigger:exg,start:'top 82%'}});
    }

    /* Projects: entrance with scale */
    gsap.from('.pg .pc',{y:44,opacity:0,scale:.97,duration:.75,stagger:.07,ease:'power2.out',scrollTrigger:{trigger:'.pg',start:'top 82%'}});

    /* CTA reveal */
    if(document.querySelector('.cA-cta')){
      gsap.from('.cA-cta',{y:26,opacity:0,scale:.96,duration:.9,ease:'power2.out',scrollTrigger:{trigger:'.cA-cta',start:'top 90%'}});
    }

    /* Contact buttons */
    gsap.from('.ccg .cc',{y:20,opacity:0,duration:.6,stagger:.07,ease:'power2.out',scrollTrigger:{trigger:'.ccg',start:'top 88%'}});

    window.ScrollTrigger.refresh();
  }
  if(document.readyState==='complete') initGsap();
  else window.addEventListener('load', initGsap);
})();
