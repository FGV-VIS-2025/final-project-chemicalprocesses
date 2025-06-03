import{s as ht,a as M,f as T,l as N,B as pt,d as u,c as I,g as q,h as H,m as O,C as ut,j as c,i as D,x as a,y as ot,z as gt,o as ft}from"../chunks/scheduler.9ab3a914.js";import{g as mt}from"../chunks/globals.7f7f1b26.js";import{S as bt,i as yt}from"../chunks/index.44647d34.js";import{s as tt,t as xt}from"../chunks/transform.ac05f830.js";import{p as vt}from"../chunks/stores.ff3a8835.js";import{r as et}from"../chunks/range.6bc2a9a0.js";import{l as nt,a as wt,b as At,c as it}from"../chunks/line.9d9e981b.js";const{document:st}=mt;function kt(g){let R,e,f,L,S,m,V,Y,r,b,v,y,B,z,d,w,W,A,K,X,k,G,h,o,$=`<h1><span class="chem-icon">⚗️</span> Chemical Kinetics Visualizer</h1> <div id="container2"></div> <p><strong>Chemical kinetics</strong> is the branch of chemistry that studies the speed or rate of chemical reactions and how various factors,
  like reactant concentration, temperature, and the presence of catalysts, influence this rate. 
  This knowledge is vital for optimizing chemical processes in a variety of applications, ranging from industrial production to biological systems.</p> <div id="container3" style="margin-bottom: 40px;"></div> <p>The graph illustrates how the concentrations of a reactant (<strong>Reagent A</strong>) and a product (<strong>Product B</strong>) change over time during a chemical reaction.</p> <p>The <span style="color: red;"><strong>red curve</strong></span> represents <strong>Reagent A</strong>, whose concentration decreases exponentially as the reaction proceeds. This indicates that Reagent A is being consumed over time.</p> <p>The <span style="color: #1f77b4;"><strong>blue curve</strong></span> shows <strong>Product B</strong>, whose concentration increases as Reagent A is converted into the product.</p> <p>The two curves intersect at around <strong>time = 4.5 units</strong>, suggesting the point where the concentrations of the reactant and product are equal.</p> <p>The <strong>y-axis</strong> represents <strong>concentration</strong>, and the <strong>x-axis</strong> represents <strong>time</strong>.</p> <p>Both axes are labeled in bold, with “<strong>CONCENTRATION</strong>” and “<strong>TIME</strong>” clearly indicated.</p> <p>This is a typical kinetic profile of a <strong>first-order or pseudo-first-order reaction</strong>, where one reactant is converted into one product over time.</p> <h1>Order of Reaction</h1> <p>A fundamental concept in kinetics is the <strong>rate law</strong>, which defines how the rate of a reaction is related to the concentrations of the reactants.
    The rate law varies based on the order of the reaction, which is determined experimentally. Below are explanations for the most common types of reaction orders:</p> <ul><li><strong>First-order reactions:</strong> In a first-order reaction, the rate is directly proportional to the concentration of one reactant.
      For example, for the reaction <em>A → B</em>, the rate law is: <code>rate = k[A]</code>.
      Here, doubling the concentration of A will double the reaction rate.</li> <li><strong>Second-order reactions:</strong> In a second-order reaction, the rate is proportional to the square of the concentration of the reactant,
      or to the product of the concentrations of two reactants. For example, <em>2A → B</em> would have the rate law:
      <code>rate = k[A]<sup>2</sup></code>. If the concentration of A is doubled, the rate increases by a factor of four.</li> <li><strong>Third-order reactions:</strong> In a third-order reaction, the rate depends on the concentration of a reactant raised to the third power
      or a combination of three reactants. For example, the rate law for a reaction involving three molecules of A might be:
      <code>rate = k[A]<sup>3</sup></code>. If the concentration of A is doubled, the rate increases by a factor of eight.</li></ul> <p>The rate constant, <code>k</code>, is unique to each reaction and depends on factors such as temperature and the presence of a catalyst.</p> <h2>Catalysis</h2> <p><strong>Catalysts</strong> are substances that accelerate chemical reactions without being consumed. They work by offering an alternative reaction pathway with a lower activation energy, making the reaction occur more easily.</p> <p>This interactive tool allows you to explore these principles visually and intuitively:</p> <ul><li><strong>Kinetics:</strong> Adjust reactant concentrations and rate constants to observe how the reaction rate changes over time.</li> <li><strong>Activation Energy:</strong> Visualize the Arrhenius equation and see how changes in temperature affect the reaction rate.</li> <li><strong>Catalyst Effect:</strong> Compare reaction profiles with and without a catalyst to understand its impact.</li></ul> <p>Dive into this interactive project to gain a deeper understanding of chemical reactions and the factors that govern them!</p>`;return{c(){R=M(),e=T("nav"),f=T("a"),L=N("Home"),S=M(),m=T("a"),V=N("Introduction"),Y=M(),r=T("a"),b=N("Reaction Orders"),v=M(),y=T("a"),B=N("Activation Energy"),z=M(),d=T("a"),w=N("Simulation"),W=M(),A=T("a"),K=N("Catalyst Effect"),X=M(),k=T("a"),G=N("Radioactivity"),h=M(),o=T("div"),o.innerHTML=$,this.h()},l(l){pt("svelte-19nn5rp",st.head).forEach(u),R=I(l),e=q(l,"NAV",{class:!0});var i=H(e);f=q(i,"A",{href:!0,class:!0});var at=H(f);L=O(at,"Home"),at.forEach(u),S=I(i),m=q(i,"A",{href:!0,class:!0});var F=H(m);V=O(F,"Introduction"),F.forEach(u),Y=I(i),r=q(i,"A",{href:!0,class:!0});var J=H(r);b=O(J,"Reaction Orders"),J.forEach(u),v=I(i),y=q(i,"A",{href:!0,class:!0});var Q=H(y);B=O(Q,"Activation Energy"),Q.forEach(u),z=I(i),d=q(i,"A",{href:!0,class:!0});var _=H(d);w=O(_,"Simulation"),_.forEach(u),W=I(i),A=q(i,"A",{href:!0,class:!0});var C=H(A);K=O(C,"Catalyst Effect"),C.forEach(u),X=I(i),k=q(i,"A",{href:!0,class:!0});var t=H(k);G=O(t,"Radioactivity"),t.forEach(u),i.forEach(u),h=I(l),o=q(l,"DIV",{class:!0,id:!0,"data-svelte-h":!0}),ut(o)!=="svelte-1l7hcj8"&&(o.innerHTML=$),this.h()},h(){st.title="Page 0 - Summary",c(f,"href","/"),c(f,"class",g[0]==="/"?"active":""),c(m,"href","/page0"),c(m,"class",g[0]==="/page0"?"active":""),c(r,"href","/page1"),c(r,"class",g[0]==="/page1"?"active":""),c(y,"href","/page2"),c(y,"class",g[0]==="/page2"?"active":""),c(d,"href","/page3"),c(d,"class",g[0]==="/page3"?"active":""),c(A,"href","/page4"),c(A,"class",g[0]==="/page4"?"active":""),c(k,"href","/page5"),c(k,"class",g[0]==="/page5"?"active":""),c(e,"class","main-nav"),c(o,"class","page"),c(o,"id","page0")},m(l,E){D(l,R,E),D(l,e,E),a(e,f),a(f,L),a(e,S),a(e,m),a(m,V),a(e,Y),a(e,r),a(r,b),a(e,v),a(e,y),a(y,B),a(e,z),a(e,d),a(d,w),a(e,W),a(e,A),a(A,K),a(e,X),a(e,k),a(k,G),D(l,h,E),D(l,o,E)},p:ot,i:ot,o:ot,d(l){l&&(u(R),u(e),u(h),u(o))}}}function Tt(g,R,e){let f;gt(g,vt,S=>e(1,f=S));let L=f.url.pathname;return ft(()=>{const S=`
      body {
        font-family: 'Inter', sans-serif;
        background-color: #f4f4f9;
        color: #333;
        margin: 0;
        padding: 0;
      }
      
      .main-nav {
        background-color: #2c3e50;
        padding: 1rem 2rem;
        display: flex;
        justify-content: center;
        gap: 2rem;
        flex-wrap: wrap;
        position: sticky;
        top: 0;
        z-index: 1000;
      }

      .main-nav a {
        color: white;
        text-decoration: none;
        font-weight: 500;
        padding: 0.5rem 1rem;
        border-radius: 4px;
        transition: background-color 0.2s;
      }

      .main-nav a:hover {
        background-color: #34495e;
      }

      .main-nav a.active {
        background-color: #3498db;
      }
      
      #page0 {
        padding: 2rem;
        max-width: 900px;
        margin: 2rem auto;
        background: white;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
        border-radius: 12px;
        position: relative;
      }
      
      #page0 h1 {
        color: #003366;
        margin-bottom: 1.5rem;
        display: flex;
        align-items: center;
        gap: 0.7rem;
      }
      
      #page0 p {
        font-size: 1.1rem;
        line-height: 1.6;
        margin-bottom: 1rem;
      }
      
      #page0 ul {
        padding-left: 1.5rem;
        margin-bottom: 1.5rem;
      }
      
      #page0 li {
        margin-bottom: 0.5rem;
      }
      
      #page0 code {
        background: #e3f2f9;
        padding: 0.2rem 0.4rem;
        border-radius: 4px;
        font-family: 'Inter', monospace;
      }
      
      svg {
        background: white;
        border-radius: 8px;
        box-shadow: 0 0 15px rgba(0,0,0,0.1);
      }
      
      .axis-label {
        font-weight: bold;
        fill: #003366;
        font-size: 14px;
      }
      
      .label-reactant {
        fill: #d62728;
        font-weight: bold;
      }
      
      .label-product {
        fill: #1f77b4;
        font-weight: bold;
      }
      
      .tube-label {
        font-size: 14px;
        fill: #333;
        text-anchor: middle;
      }
      
      .tube {
        fill: #c49b6a;
        stroke: #987a4d;
        stroke-width: 2px;
        filter: drop-shadow(0 1px 0px #7a5f2e);
      }
      
      .cork {
        fill: #8c6d4a;
        stroke: #6b5436;
        stroke-width: 1.5px;
      }
      
      .bubbleA {
        fill: #d62728;
        opacity: 0.85;
      }
      
      .bubbleB {
        fill: #1f77b4;
        opacity: 0.85;
      }
      
      @media (max-width: 600px) {
        nav ul {
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
        }
        
        nav a {
          padding: 0.3rem 0;
        }
      }

      #container3 {
        display: flex;
        justify-content: center;
        width: 100%;
        margin: 0 auto 40px;
      }

      #container3 svg {
        display: block;
        margin: 0 auto;
      }
    `,m=document.createElement("style");m.textContent=S,document.head.appendChild(m);const V=800,Y=500,r={top:40,right:30,bottom:40,left:50},b=tt("#container3").append("svg").attr("width",V).attr("height",Y),v=200,y=et(0,v+1);function B(t){return Math.exp(-t/v*4)}function z(t){return 1-B(t)}const d=nt().domain([0,v]).range([r.left,V-r.right]),w=nt().domain([0,1]).range([Y-r.bottom,r.top]),W=wt(d).ticks(6).tickFormat(t=>Math.round(t/10)),A=At(w).ticks(5);b.append("g").attr("transform",`translate(0,${Y-r.bottom})`).call(W).append("text").attr("class","axis-label").attr("x",-r.left+400).attr("y",r.top-20).attr("text-anchor","end").text("TIME"),b.append("g").attr("transform",`translate(${r.left},0)`).call(A).append("text").attr("class","axis-label").attr("x",-r.left+300).attr("y",r.top-20).attr("text-anchor","start").text("CONCENTRATION");const K=it().x(t=>d(t)).y(t=>w(B(t))),X=it().x(t=>d(t)).y(t=>w(z(t))),k=b.append("path").attr("fill","none").attr("stroke","#d62728").attr("stroke-width",3),G=b.append("path").attr("fill","none").attr("stroke","#1f77b4").attr("stroke-width",3);b.append("text").attr("class","label-reactant").attr("x",d(8)).attr("y",w(B(8))-10).text("Reagent A"),b.append("text").attr("class","label-product").attr("x",d(12)).attr("y",w(z(12))+20).text("Product B");const h=100,o=250,$=5,l=50,E=tt("#container2").style("display","flex").style("gap","30px").style("justify-content","center").style("flex-wrap","wrap"),i=et($).map(t=>{const p=h*.18,x=o*.14,n=h*.64,P=o*.75;let U=et(l).map(()=>({x:p+Math.random()*n,y:x+Math.random()*P,radius:5+Math.random()*3})),rt=et(l).map(()=>({x:p+Math.random()*n,y:x+Math.random()*P,radius:5+Math.random()*3}));return{tubeIndex:t,bubblesA:U,bubblesB:rt,liquidX:p,liquidY:x,liquidWidth:n,liquidHeight:P}});E.selectAll("svg").data(i).enter().append("svg").attr("width",h).attr("height",o).style("background","white").style("border-radius","8px").style("box-shadow","0 0 15px rgba(0,0,0,0.1)").each(function(t){const p=tt(this);p.append("rect").attr("class","tube").attr("x",h*.15).attr("y",o*.12).attr("width",h*.7).attr("height",o*.8).attr("rx",20).attr("ry",20),p.append("rect").attr("class","cork").attr("x",h*.15).attr("y",o*.04).attr("width",h*.7).attr("height",o*.08).attr("rx",5).attr("ry",5),p.append("rect").attr("x",t.liquidX).attr("y",t.liquidY).attr("width",t.liquidWidth).attr("height",t.liquidHeight).attr("fill","#cee7f0").attr("rx",15).attr("ry",15);const x=p.append("g").attr("class","bubbles-group");x.selectAll(".bubbleA").data(t.bubblesA).enter().append("circle").attr("class","bubbleA").attr("cx",n=>n.x).attr("cy",n=>n.y).attr("r",n=>n.radius),x.selectAll(".bubbleB").data(t.bubblesB).enter().append("circle").attr("class","bubbleB").attr("cx",n=>n.x).attr("cy",n=>n.y).attr("r",n=>n.radius),p.append("text").attr("class","tube-label").attr("x",h/2).attr("y",o*.99).text(`Passo ${t.tubeIndex}`)});let F=0;const J=3e3;function Q(t,p,x){const n=Math.floor(v/$),P=t.tubeIndex*n,U=Math.min(Math.max(p-P,0),n),rt=B(P+U),ct=z(P+U),lt=Math.round(rt*l),dt=Math.round(ct*l),Z=tt(E.selectAll("svg").nodes()[t.tubeIndex]);Z.selectAll(".bubbleA").attr("visibility",(s,j)=>j<lt?"visible":"hidden"),Z.selectAll(".bubbleB").attr("visibility",(s,j)=>j<dt?"visible":"hidden"),x&&(t.bubblesA.forEach((s,j)=>{s.y+=.3*(j%2?1:-1),s.y>t.liquidY+t.liquidHeight&&(s.y=t.liquidY+5),s.y<t.liquidY&&(s.y=t.liquidY+t.liquidHeight-5)}),Z.selectAll(".bubbleA").data(t.bubblesA).attr("cy",s=>s.y),t.bubblesB.forEach((s,j)=>{s.y+=.25*(j%2?-1:1),s.y>t.liquidY+t.liquidHeight&&(s.y=t.liquidY+5),s.y<t.liquidY&&(s.y=t.liquidY+t.liquidHeight-5)}),Z.selectAll(".bubbleB").data(t.bubblesB).attr("cy",s=>s.y))}let _=0;function C(){k.datum(y.slice(0,_+1)).attr("d",K),G.datum(y.slice(0,_+1)).attr("d",X),i.forEach((p,x)=>{Q(p,_,x===F)}),_=(_+1)%(v+1);const t=Date.now();C.lastChange||(C.lastChange=t),t-C.lastChange>J&&(F=(F+1)%$,C.lastChange=t)}xt(()=>{C()})}),[L]}class Ht extends bt{constructor(R){super(),yt(this,R,Tt,kt,ht,{})}}export{Ht as component};
