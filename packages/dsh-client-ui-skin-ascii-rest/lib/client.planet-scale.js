window.__ModuleLoader__.load({
  id: "@lionad/dsh-client-ui-skin-ascii-rest/client.planet-scale.js",
  factory: (require) => {
    var module = { exports: {} };
    var exports = module.exports;
    var f0=Object.defineProperty;var G0=Object.getOwnPropertyDescriptor;var K0=Object.getOwnPropertyNames;var U0=Object.prototype.hasOwnProperty;var W0=(a,n)=>{for(var s in n)f0(a,s,{get:n[s],enumerable:!0})},Y0=(a,n,s,f)=>{if(n&&typeof n=="object"||typeof n=="function")for(let c of K0(n))!U0.call(a,c)&&c!==s&&f0(a,c,{get:()=>n[c],enumerable:!(f=G0(n,c))||f.enumerable});return a};var _0=a=>Y0(f0({},"__esModule",{value:!0}),a);var nt={};W0(nt,{default:()=>B0,meta:()=>z0});module.exports=_0(nt);var z0={name:"planet scale",category:"scenes",note:"a dark planet cut into the planetscale mark, backlit, a moon circling",cols:200,rows:100,cell:1,fps:15,ground:"#050505",palette:["#101010","#181818","#202020","#282828","#303030","#3a3a3a","#444444","#4e4e4e","#585858","#636363","#6e6e6e","#797979","#858585","#919191","#9d9d9d","#a9a9a9","#b5b5b5","#c1c1c1","#cccccc","#d7d7d7","#e1e1e1","#eaeaea","#f3f3f3","#ffffff"]},D0=String.raw`

                      00000000000000000000
                  0000000000000000000000000000
               0000000000000000000000000000000000
             00000000000000000000000000000000000000
           000000000000000000000000000000000000000000
          00000000000000000000000000000000000000000000
         0000000000000000000000000000000000000000000000
        000000000000000000000000000000000000000000000000
       000000000000000000000000000000000000000000000000
      00000000000000000000000000000000000000000000000
      000000000000000000000000000000000000000000000
      0000000000000000000000000000000000000000000
      00000000000000000000000000000000000000000
      00000000000000000000000000    000000000           00
      000000000000000000000000    000000000           0000
      0000000000000000000000    000000000           000000
      00000000000000000000    000000000           00000000
       00000000000000000    000000000           000000000
        00000000000000    000000000           0000000000
         00000000000    000000000           00000000000
          00000000    000000000           000000000000
           00000    000000000           0000000000000
             0    000000000           0000000000000
                 00000000           0000000000000
                  00000           000000000000
                                0000000000

    `,h=200,v=100,G=100,K=50,u=41,N0=[-.68,-.68,.2],Q0=7,V0=16,X0=" \xB7\u2022\u25CF",J0=[0,.3,.6,1],Z0=[0,8,2,10,12,4,14,6,3,11,1,9,15,7,13,5].map(a=>a/16-.47);function O(a,n){let s=Math.imul(a|0,374761393)+Math.imul(n|0,668265263);return s=Math.imul(s^s>>>13,1274126177),((s^s>>>16)>>>0)/4294967296}function $0(a,n,s){let f=Math.floor(a),c=Math.floor(n),i=a-f,x=n-c,m=i*i*(3-2*i),g=x*x*(3-2*x),R=f,C=f+1;s&&(R=(f%s+s)%s,C=(R+1)%s);let q=O(R,c),z=O(C,c),V=O(R,c+1),U=O(C,c+1);return q+(z-q)*m+(V-q)*g+(q-z-V+U)*m*g}function m0(a,n,s,f){let c=0,i=0,x=.5,m=1;for(let g=0;g<s;g++)c+=x*$0(a*m,n*m,f*m),i+=x,x*=.5,m*=2;return c/i}var x0=a=>a<0?0:a>1?1:a,y=(a,n,s)=>{let f=x0((s-a)/(n-a));return f*f*(3-2*f)},tt=a=>[1,3,5].map(n=>parseInt(a.slice(n,n+2),16)/255);function v0(a,n){let s=new Float32Array(a.length);for(let f=0;f<n;f++){for(let c=0;c<v;c++)for(let i=0;i<h;i++){let x=0;for(let m=-1;m<=1;m++)x+=a[c*h+Math.min(h-1,Math.max(0,i+m))];s[c*h+i]=x/3}for(let c=0;c<v;c++)for(let i=0;i<h;i++){let x=0;for(let m=-1;m<=1;m++)x+=s[Math.min(v-1,Math.max(0,c+m))*h+i];a[c*h+i]=x/3}}}function B0(){let a=z0.palette.map(tt),n=h*v,s=new Array(n),f=new Uint8Array(32768).fill(255),c=(t,o,r)=>{let e=Math.min(31,t*31.99|0)<<10|Math.min(31,o*31.99|0)<<5|Math.min(31,r*31.99|0);if(f[e]!==255)return f[e];let l=0,M=1e9;for(let p=0;p<a.length;p++){let L=a[p][0]-t,P=a[p][1]-o,N=a[p][2]-r,w=.3*L*L+.5*P*P+.2*N*N;w<M&&(M=w,l=p)}return f[e]=l},i=D0.slice(1,-1).split(`
    `),x=Math.max(...i.map(t=>t.length)),m=i.length,g=(t,o)=>o>=0&&o<m&&t>=0&&t<x&&i[o][t]&&i[o][t]!==" "?1:0,R=x,C=0,q=m,z=0;for(let t=0;t<m;t++)for(let o=0;o<x;o++)g(o,t)&&(R=Math.min(R,o),C=Math.max(C,o+1),q=Math.min(q,t),z=Math.max(z,t+1));let V=(t,o)=>{let r=t-.5,e=o-.5,l=Math.floor(r),M=Math.floor(e),p=r-l,L=e-M,P=g(l,M),N=g(l+1,M),w=g(l,M+1),$=g(l+1,M+1);return P+(N-P)*p+(w-P)*L+(P-N-w+$)*p*L},U=new Float32Array(n);for(let t=0;t<v;t++)for(let o=0;o<h;o++){let r=(o+.5-G)/u,e=(t+.5-K)/u,l=R+(r+1)/2*(C-R),M=q+(e+1)/2*(z-q);U[t*h+o]=V(l,M)}v0(U,2);let p0=new Float32Array(n),s0=new Float32Array(n),c0=new Float32Array(n);for(let t=0;t<n;t++){let o=t%h,r=t/h|0,e=Math.hypot(o+.5-G,r+.5-K),l=y(u+.6,u-.6,e),M=y(.38,.62,U[t]);p0[t]=l*M,s0[t]=l*(1-M),c0[t]=s0[t]}v0(c0,1);let e0=Math.SQRT1_2,X=new Float32Array(n),J=new Float32Array(n),y0=new Float32Array(n),d0=new Float32Array(n),r0=new Float32Array(n);for(let t=0;t<n;t++){let o=t%h,r=t/h|0,e=(o+.5-G)/u,l=(r+.5-K)/u,M=e*e+l*l;if(M>=1.02)continue;let p=Math.sqrt(Math.max(0,1-M));X[t]=e,J[t]=l,y0[t]=p,d0[t]=Math.asin(Math.max(-1,Math.min(1,(e+l)*e0))),r0[t]=Math.atan2((e-l)*e0,p)}let Z=96,I=256,u0=new Float32Array(Z*I);for(let t=0;t<Z;t++)for(let o=0;o<I;o++){let r=t/Z,e=o/I,l=m0(e*12,r*6,3,12)*.08,M=.5+.5*Math.sin((r+l)*38+1.6*Math.sin(r*17));u0[t*I+o]=.75*M+.25*m0(e*16,r*30,3,16)}let l0=new Float32Array(n);for(let t=0;t<n;t++){let o=t%h,r=t/h|0;O(o*3+7,r*5+1)>.986&&(l0[t]=.35+.65*O(o,r+99))}let b=N0.map(t=>t/Math.hypot(...N0)),w0=Math.hypot(b[0],b[1]),b0=[G+18,K+18],A0=new Float32Array(n),g0=new Float32Array(n);for(let t=0;t<n;t++){let o=t%h,r=t/h|0;A0[t]=Math.hypot(o+.5-b0[0],r+.5-b0[1]),g0[t]=(X[t]*b[0]+J[t]*b[1])/Math.max(.001,Math.hypot(X[t],J[t]))/w0}return(t,{color:o}={})=>{let r=t/120*I,e=t/V0*Math.PI*2+2.2,l=Math.cos(e)*66,M=Math.sin(e)*11,p=-.32,L=G+l*Math.cos(p)-M*Math.sin(p),P=K+l*Math.sin(p)+M*Math.cos(p),N=Math.sin(e)>0,w=Q0*(1+.08*Math.sin(e));for(let A=0;A<v;A++)for(let S=0;S<h;S++){let d=A*h+S,F0=A+.5,B=0,W=0,H0=1,k0=S+.5-G,I0=F0-K,H=Math.sqrt(k0*k0+I0*I0),Y=p0[d],O0=A0[d],h0=.15+.85*y(80,25,O0),_=(Math.exp(-Math.max(0,H-u)/1.6)*.55+Math.exp(-Math.max(0,H-u)/6)*.14*h0)*h0*y(u-2,u+.5,H);if(l0[d]){let F=.65+.35*Math.sin(t*(1.3+O(S,A)*2.5)+O(A,S)*6.28);_=Math.max(_,l0[d]*F*y(u+3,u+14,H))}let R0=s0[d];if(R0>0&&(_=Math.max(_,R0*(.72+.45*Math.exp(-O0/30)))),B=_,Y>.001){let F=X[d],k=J[d],D=y0[d],T=F*b[0]+k*b[1]+D*b[2],M0=(d0[d]/Math.PI+.5)*(Z-1),j=((r0[d]/(Math.PI*2)+.5)*I+r)%I;j<0&&(j+=I);let E=u0[(M0|0)*I+(j|0)],Q=y(-.04,.2,T)*(.03+.7*Math.pow(Math.max(0,T),1.5))*(.6+.65*E),T0=y(.9,.995,H/u),S0=g0[d];Q+=T0*y(.1,.8,S0)*.9,Q+=c0[d]*.3,Q+=y(.86,.985,H/u)*.95*h0*(1-y(-.3,.3,S0));let j0=1-y(-.12,.06,T);if(j0>0&&D>.15){let C0=(F+k)*e0*u/4,a0=Math.round(C0);if(Math.abs(C0-a0)<.14){let L0=Math.floor((r0[d]+r/I*Math.PI*2)*26);if(O(L0,a0+40)>.5){let E0=Math.pow(.5+.5*Math.sin(L0*.5-t*2.4*(.6+O(a0,3))+a0*2),8);Q+=j0*(.3+.7*E0)*(.3+.7*D)}}}B=B*(1-Y)+Q*Y,W=.07*Y}let t0=S+.5-L,n0=F0-P,o0=Math.sqrt(t0*t0+n0*n0);if(o0<w+.6&&(N||Y<.5)){let F=t0/w,k=n0/w,D=Math.sqrt(Math.max(0,1-F*F-k*k)),T=F*b[0]+k*b[1]+D*b[2],M0=.75+.25*m0(t0*.6+40,n0*.6,2,0),j=y(-.05,.25,T)*(.3+.8*Math.max(0,T))*M0;j+=y(.75,1,o0/w)*y(.2,.9,(F*b[0]+k*b[1])/Math.max(.001,o0/w)/w0)*.7,j=Math.max(j,.05);let E=y(w+.6,w-.6,o0);B=B*(1-E)+j*E,W=Math.max(W*(1-E),.22*E)}let q0=Math.max(B,1e-4),P0=x0(W+(1-W)*Math.pow(q0,.85)*.95)*H0,i0=Math.max(0,Math.min(3,Math.round(P0*3+Z0[(A&3)*4+(S&3)])));if(s[d]=X0[i0],o){let F=i0?Math.min(1,(P0+.06)/J0[i0]):0,k=x0((.3+.7*F)*(.22+.78*y(0,.6,q0)));o[d]=c(k,k,k)}}let $=[];for(let A=0;A<v;A++)$.push(s.slice(A*h,(A+1)*h).join(""));return $.join(`
    `)}}

    return module.exports;
  }
});
