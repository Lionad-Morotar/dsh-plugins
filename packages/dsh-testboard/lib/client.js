window.__ModuleLoader__.load({
  id: "dsh-testboard",
  factory: (require) => {
    var module = { exports: {} };
    var exports = module.exports;
"use strict";var M=Object.defineProperty;var xt=Object.getOwnPropertyDescriptor;var kt=Object.getOwnPropertyNames;var St=Object.prototype.hasOwnProperty;var wt=(e,t)=>{for(var a in t)M(e,a,{get:t[a],enumerable:!0})},Tt=(e,t,a,s)=>{if(t&&typeof t=="object"||typeof t=="function")for(let o of kt(t))!St.call(e,o)&&o!==a&&M(e,o,{get:()=>t[o],enumerable:!(s=xt(t,o))||s.enumerable});return e};var Rt=e=>Tt(M({},"__esModule",{value:!0}),e);var zt={};wt(zt,{apply:()=>ct,boot:()=>B,clientPlugin:()=>ft,default:()=>It,inject:()=>pt});module.exports=Rt(zt);var k="dsh-testboard",C="conversation.view",W="testboard";var T="testboard",L="client.snapshot.js";var P={"testboard.tabTitle":"\u6D4B\u8BD5","testboard.subtitle":"dsh-plugins \xB7 pnpm test","testboard.ago":"2m ago","testboard.passed":"passed","testboard.failed":"failed","testboard.took":"\u8017\u65F6","testboard.filterAll":"\u5168\u90E8","testboard.filterFailed":"\u5931\u8D25","testboard.searchPlaceholder":"\u641C\u7D22\u6587\u4EF6\u540D","testboard.sortFailFirst":"\u5931\u8D25\u4F18\u5148","testboard.sortSlowFirst":"\u8017\u65F6\u4F18\u5148","testboard.peak":"peak","testboard.perSecond":"/s","testboard.empty":"\u6CA1\u6709\u5339\u914D\u7684\u6D4B\u8BD5\u6587\u4EF6\u3002","testboard.cases":"\u7528\u4F8B","testboard.detailHint":"\u70B9\u51FB\u884C\u5C55\u5F00\u7528\u4F8B"},A={"testboard.tabTitle":"Tests","testboard.subtitle":"dsh-plugins \xB7 pnpm test","testboard.ago":"2m ago","testboard.passed":"passed","testboard.failed":"failed","testboard.took":"took","testboard.filterAll":"All","testboard.filterFailed":"Failed","testboard.searchPlaceholder":"Search file name","testboard.sortFailFirst":"Failures first","testboard.sortSlowFirst":"Slowest first","testboard.peak":"peak","testboard.perSecond":"/s","testboard.empty":"No test file matches.","testboard.cases":"cases","testboard.detailHint":"Click a row to expand its cases"};var q=Object.freeze({chunk:L,id:`${k}/${L}`}),G=null,S=null;function B(e){G=e}function K(){if(S!==null)return S;let e=G;if(e===null)return Promise.reject(new Error(`${k}: the loader require was not handed over`));let t=e.async(`./${q.chunk}`).then(a=>{let s=a;if(s===null||typeof s!="object"||s.snapshot===void 0)throw new Error(`${k}: chunk ${q.id} is missing snapshot`);return s});return S=t,t.catch(()=>{S===t&&(S=null)}),t}var j="data-dsh-testboard",Ft=`
[data-testid="testboard"] {
  --tst-fs: var(--dsh-content-font-size, 14px);
  --tst-fs-code: var(--dsh-code-font-size, 11px);
  --tst-fs-title: calc(var(--dsh-content-font-size, 14px) * 17 / 14);
  --tst-fs-small: calc(var(--dsh-content-font-size, 14px) * 12 / 14);

  --tst-bg: #faf9f7;
  --tst-surface: #ffffff;
  --tst-surface-hover: #f2f0ec;
  --tst-ink: #14110d;
  --tst-ink-dim: #6b655c;
  --tst-ink-faint: #a39c91;
  --tst-rule: #e4e0d9;
  --tst-pass: #2f8f4e;
  --tst-fail: #c02b2b;
  --tst-idle: #c9c3b8;

  display: flex;
  flex-direction: column;
  height: 100%;
  box-sizing: border-box;
  overflow: auto;
  padding: 22px 26px 40px;
  background: var(--tst-bg);
  color: var(--tst-ink);
  font-family: var(--dsh-font-sans, ui-sans-serif, system-ui, sans-serif);
  font-size: var(--tst-fs);
  line-height: 1.45;
}

body[data-ds-dark-theme] [data-testid="testboard"] {
  --tst-bg: #0d0d0f;
  --tst-surface: #131316;
  --tst-surface-hover: #1b1b1f;
  --tst-ink: #ececee;
  --tst-ink-dim: #8b8b93;
  --tst-ink-faint: #55555c;
  --tst-rule: #232327;
  --tst-pass: #4ade80;
  --tst-fail: #ff3b30;
  --tst-idle: #3a3a40;
}

/* Header ------------------------------------------------------------------ */

[data-tst="header"] {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  padding-bottom: 14px;
  border-bottom: 1px solid var(--tst-rule);
}

[data-tst="title"] {
  margin: 0;
  font-size: var(--tst-fs-title);
  font-weight: 600;
  letter-spacing: -0.01em;
  color: var(--tst-ink);
}

[data-tst="subtitle"] {
  margin: 2px 0 0;
  font-family: var(--dsh-font-mono, ui-monospace, SFMono-Regular, monospace);
  font-size: var(--tst-fs-code);
  color: var(--tst-ink-dim);
}

[data-tst="header-stats"] {
  display: flex;
  align-items: baseline;
  gap: 14px;
  font-family: var(--dsh-font-mono, ui-monospace, SFMono-Regular, monospace);
  font-size: var(--tst-fs-code);
  color: var(--tst-ink-dim);
  white-space: nowrap;
}

[data-tst="tally"] {
  display: inline-flex;
  gap: 6px;
}

[data-tst="tally-passed"] {
  color: var(--tst-pass);
}

[data-tst="tally-failed"] {
  color: var(--tst-ink-dim);
}

[data-tst="tally-failed"][data-has-failed="true"] {
  color: var(--tst-fail);
}

[data-tst="tally-sep"] {
  color: var(--tst-ink-faint);
}

[data-tst="duration"] {
  color: var(--tst-ink-dim);
}

/* Sparkline --------------------------------------------------------------- */

[data-tst="throughput"] {
  position: relative;
  height: 56px;
  margin: 14px 0 18px;
}

[data-tst="spark"] {
  display: block;
  width: 100%;
  height: 56px;
  overflow: visible;
}

[data-tst="spark-line"] {
  fill: none;
  stroke: var(--tst-ink-dim);
  stroke-width: 1;
  vector-effect: non-scaling-stroke;
}

[data-tst="spark-area"] {
  fill: var(--tst-ink);
  opacity: 0.05;
  stroke: none;
}

[data-tst="pin"] {
  stroke: var(--tst-fail);
  stroke-width: 1;
  opacity: 0.55;
  vector-effect: non-scaling-stroke;
}

[data-tst="peak"] {
  position: absolute;
  top: 0;
  right: 0;
  font-family: var(--dsh-font-mono, ui-monospace, SFMono-Regular, monospace);
  font-size: var(--tst-fs-code);
  color: var(--tst-ink-faint);
}

/* Toolbar ----------------------------------------------------------------- */

[data-tst="toolbar"] {
  display: flex;
  align-items: center;
  gap: 10px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--tst-rule);
}

[data-tst="segmented"] {
  display: inline-flex;
  border: 1px solid var(--tst-rule);
  border-radius: 5px;
  overflow: hidden;
}

[data-tst="segment"] {
  appearance: none;
  border: 0;
  padding: 3px 10px;
  background: transparent;
  color: var(--tst-ink-dim);
  font: inherit;
  font-size: var(--tst-fs-small);
  cursor: pointer;
}

[data-tst="segment"] + [data-tst="segment"] {
  border-left: 1px solid var(--tst-rule);
}

[data-tst="segment"]:hover {
  background: var(--tst-surface-hover);
  color: var(--tst-ink);
}

[data-tst="segment"][data-active="true"] {
  background: var(--tst-surface-hover);
  color: var(--tst-ink);
}

[data-tst="search"] {
  flex: 1;
  min-width: 120px;
  appearance: none;
  border: 1px solid var(--tst-rule);
  border-radius: 5px;
  padding: 3px 9px;
  background: var(--tst-surface);
  color: var(--tst-ink);
  font-family: var(--dsh-font-mono, ui-monospace, SFMono-Regular, monospace);
  font-size: var(--tst-fs-code);
}

[data-tst="search"]::placeholder {
  color: var(--tst-ink-faint);
}

[data-tst="search"]:focus {
  outline: none;
  border-color: var(--tst-ink-faint);
}

/* Lanes ------------------------------------------------------------------- */

[data-tst="lanes"] {
  display: flex;
  flex-direction: column;
  gap: 18px;
  padding-top: 16px;
}

[data-tst="package-name"] {
  margin: 0 0 4px;
  font-family: var(--dsh-font-mono, ui-monospace, SFMono-Regular, monospace);
  font-size: var(--tst-fs-code);
  font-weight: 500;
  color: var(--tst-ink-faint);
  letter-spacing: 0.04em;
}

[data-tst="lane"] {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  box-sizing: border-box;
  appearance: none;
  border: 0;
  border-radius: 4px;
  padding: 3px 6px;
  background: transparent;
  color: inherit;
  font: inherit;
  text-align: left;
  cursor: pointer;
}

[data-tst="lane"]:hover,
[data-tst="lane"][data-expanded="true"] {
  background: var(--tst-surface-hover);
}

[data-tst="lane-name"] {
  display: flex;
  align-items: baseline;
  gap: 8px;
  flex: 0 0 auto;
  min-width: 0;
  max-width: 46%;
}

[data-tst="lane-file"] {
  font-family: var(--dsh-font-mono, ui-monospace, SFMono-Regular, monospace);
  font-size: var(--tst-fs-code);
  color: var(--tst-ink);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

[data-tst="lane-dir"] {
  font-family: var(--dsh-font-mono, ui-monospace, SFMono-Regular, monospace);
  font-size: var(--tst-fs-code);
  color: var(--tst-ink-faint);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

[data-tst="ticks"] {
  display: flex;
  align-items: center;
  gap: 2px;
  flex: 1 1 auto;
  min-width: 0;
  overflow: hidden;
}

[data-tst="tick"] {
  display: block;
  flex: 0 0 2px;
  width: 2px;
  height: 11px;
  border-radius: 1px;
  background: var(--tst-idle);
}

[data-tst="tick"][data-status="passed"] {
  background: var(--tst-pass);
}

[data-tst="tick"][data-status="failed"] {
  background: var(--tst-fail);
}

[data-tst="lane-reading"] {
  flex: 0 0 auto;
  font-family: var(--dsh-font-mono, ui-monospace, SFMono-Regular, monospace);
  font-size: var(--tst-fs-code);
  color: var(--tst-ink-faint);
  text-align: right;
  min-width: 56px;
}

[data-tst="lane-failed"] {
  color: var(--tst-fail);
}

/* Expanded cases ---------------------------------------------------------- */

[data-tst="case-list"] {
  list-style: none;
  margin: 2px 0 6px;
  padding: 0 0 0 18px;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

[data-tst="case"] {
  display: grid;
  grid-template-columns: 8px 1fr auto;
  align-items: baseline;
  gap: 8px;
  padding: 1px 6px;
  font-size: var(--tst-fs-small);
  color: var(--tst-ink-dim);
}

[data-tst="case-dot"] {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--tst-idle);
  align-self: center;
}

[data-tst="case-dot"][data-status="passed"] {
  background: var(--tst-pass);
}

[data-tst="case-dot"][data-status="failed"] {
  background: var(--tst-fail);
}

[data-tst="case-name"] {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

[data-tst="case"][data-status="failed"] [data-tst="case-name"] {
  color: var(--tst-ink);
}

[data-tst="case-duration"] {
  font-family: var(--dsh-font-mono, ui-monospace, SFMono-Regular, monospace);
  font-size: var(--tst-fs-code);
  color: var(--tst-ink-faint);
}

[data-tst="case-error"] {
  grid-column: 2 / -1;
  font-family: var(--dsh-font-mono, ui-monospace, SFMono-Regular, monospace);
  font-size: var(--tst-fs-code);
  color: var(--tst-fail);
}

/* Hover card -------------------------------------------------------------- */

[data-tst="card-anchor"] {
  position: sticky;
  bottom: 0;
  z-index: 2;
  pointer-events: none;
  display: flex;
  justify-content: flex-end;
  padding-top: 8px;
}

[data-tst="card"] {
  pointer-events: none;
  max-width: 520px;
  box-sizing: border-box;
  border: 1px solid var(--tst-rule);
  border-radius: 6px;
  padding: 10px 12px;
  background: var(--tst-surface);
  box-shadow: 0 6px 24px rgb(0 0 0 / 18%);
}

[data-tst="card-head"] {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  padding-bottom: 6px;
  margin-bottom: 6px;
  border-bottom: 1px solid var(--tst-rule);
}

[data-tst="card-file"] {
  font-family: var(--dsh-font-mono, ui-monospace, SFMono-Regular, monospace);
  font-size: var(--tst-fs-code);
  color: var(--tst-ink);
}

[data-tst="card-meta"] {
  font-family: var(--dsh-font-mono, ui-monospace, SFMono-Regular, monospace);
  font-size: var(--tst-fs-code);
  color: var(--tst-ink-faint);
  white-space: nowrap;
}

[data-tst="card-list"] {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 3px;
}

[data-tst="card-case"] {
  display: grid;
  grid-template-columns: 8px 1fr auto;
  align-items: baseline;
  gap: 8px;
  font-size: var(--tst-fs-small);
  color: var(--tst-ink-dim);
}

[data-tst="card-dot"] {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--tst-idle);
  align-self: center;
}

[data-tst="card-dot"][data-status="passed"] {
  background: var(--tst-pass);
}

[data-tst="card-dot"][data-status="failed"] {
  background: var(--tst-fail);
}

[data-tst="card-name"] {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

[data-tst="card-duration"] {
  font-family: var(--dsh-font-mono, ui-monospace, SFMono-Regular, monospace);
  font-size: var(--tst-fs-code);
  color: var(--tst-ink-faint);
}

[data-tst="card-error"] {
  grid-column: 2 / -1;
  font-family: var(--dsh-font-mono, ui-monospace, SFMono-Regular, monospace);
  font-size: var(--tst-fs-code);
  color: var(--tst-fail);
}

[data-tst="card-more"] {
  padding-top: 4px;
  font-family: var(--dsh-font-mono, ui-monospace, SFMono-Regular, monospace);
  font-size: var(--tst-fs-code);
  color: var(--tst-ink-faint);
}

[data-tst="empty"],
[data-tst="status"] {
  color: var(--tst-ink-dim);
  font-size: var(--tst-fs-small);
}
`;function U(e=typeof document>"u"?void 0:document){if(e===void 0)return;let t=e.querySelector(`style[${j}]`);if(t!==null)return t;let a=e.createElement("style");return a.setAttribute(j,""),a.textContent=Ft,e.head.append(a),a}var u=require("react");function Q(e){let t=0,a=0,s=0,o=0;for(let r of e.packages)for(let n of r.files)for(let i of n.cases)i.status==="failed"?a+=1:i.status==="skipped"?s+=1:t+=1,o+=i.durationMs;return{total:t+a+s,passed:t,failed:a,skipped:s,durationMs:o,wallClockMs:Math.ceil(o/12)}}function Et(e,t){let a=0,s=0,o=0,r=0;for(let n of t.cases)n.status==="failed"?s+=1:n.status==="skipped"?o+=1:a+=1,r+=n.durationMs;return{packageName:e,path:t.path,cases:t.cases,passed:a,failed:s,skipped:o,durationMs:r,hasFailed:s>0}}function Mt(e,t,a){if(a==="fail-first"){let s=e.hasFailed?0:1,o=t.hasFailed?0:1;if(s!==o)return s-o}return t.durationMs!==e.durationMs?t.durationMs-e.durationMs:e.path<t.path?-1:e.path>t.path?1:0}function Z(e,t){let a=t.query.trim().toLowerCase(),s=[];for(let o of e.packages)for(let r of o.files){if(a.length>0&&!r.path.toLowerCase().includes(a))continue;let n=Et(o.name,r);t.filter==="failed"&&!n.hasFailed||s.push(n)}return s.sort((o,r)=>Mt(o,r,t.sort))}function Y(e){let t=new Map;for(let a of e){let s=t.get(a.packageName);s===void 0?t.set(a.packageName,[a]):s.push(a)}return[...t.entries()].sort(([a],[s])=>a<s?-1:a>s?1:0).map(([a,s])=>({packageName:a,rows:s}))}function J(e){let t=[],a=[],s=0;for(let o of e.packages)for(let r of o.files)for(let n of r.cases){s+=n.durationMs;let i=Math.max(0,Math.ceil(s/(1e3*12))-1);t[i]=(t[i]??0)+1,n.status==="failed"&&(a[i]=(a[i]??0)+1)}return Array.from({length:t.length},(o,r)=>({second:r,completed:t[r]??0,failed:a[r]??0}))}function X(e){return e.reduce((t,a)=>Math.max(t,a.completed),0)}function h(e){if(e<1e4)return`${(e/1e3).toFixed(1)}s`;if(e<6e4)return`${Math.round(e/1e3)}s`;let t=Math.floor(e/6e4),a=Math.round(e%6e4/1e3);return`${String(t)}m ${String(a).padStart(2,"0")}s`}function R(e){let t=e.split("/");return t[t.length-1]??e}function tt(e){let t=e.lastIndexOf("/");return t===-1?"":e.slice(0,t)}function F(e){return`AssertionError: expected "${e}" to hold`}var y=require("react/jsx-runtime");function et({cases:e}){return(0,y.jsx)("ul",{"data-testid":"case-list","data-tst":"case-list",children:e.map((t,a)=>(0,y.jsxs)("li",{"data-testid":"case-item","data-tst":"case","data-status":t.status,children:[(0,y.jsx)("span",{"data-tst":"case-dot","data-status":t.status}),(0,y.jsx)("span",{"data-tst":"case-name",children:t.name}),(0,y.jsx)("span",{"data-tst":"case-duration",children:h(t.durationMs)}),t.status==="failed"?(0,y.jsx)("span",{"data-tst":"case-error",children:F(t.name)}):null]},`${t.name}-${String(a)}`))})}var c=require("react/jsx-runtime"),Ct=6;function Lt(e){return[...e].sort((t,a)=>{let s=t.status==="failed"?0:1,o=a.status==="failed"?0:1;return s!==o?s-o:a.durationMs-t.durationMs})}function at({row:e}){let t=Lt(e.cases),a=t.slice(0,Ct),s=t.length-a.length;return(0,c.jsxs)("div",{"data-testid":"detail-card","data-tst":"card","data-path":e.path,role:"tooltip",children:[(0,c.jsxs)("div",{"data-tst":"card-head",children:[(0,c.jsx)("span",{"data-tst":"card-file",children:R(e.path)}),(0,c.jsxs)("span",{"data-tst":"card-meta",children:[e.cases.length," \xB7 ",h(e.durationMs)]})]}),(0,c.jsx)("ul",{"data-tst":"card-list",children:a.map((o,r)=>(0,c.jsxs)("li",{"data-testid":"detail-case","data-tst":"card-case","data-status":o.status,children:[(0,c.jsx)("span",{"data-tst":"card-dot","data-status":o.status}),(0,c.jsx)("span",{"data-tst":"card-name",children:o.name}),(0,c.jsx)("span",{"data-tst":"card-duration",children:h(o.durationMs)}),o.status==="failed"?(0,c.jsx)("span",{"data-tst":"card-error",children:F(o.name)}):null]},`${o.name}-${String(r)}`))}),s>0?(0,c.jsxs)("div",{"data-tst":"card-more",children:["+",s]}):null]})}var m=require("react/jsx-runtime");function st({row:e,expanded:t,strings:a,onToggle:s,onHover:o}){let r=tt(e.path);return(0,m.jsxs)("button",{type:"button","data-testid":"file-row","data-tst":"lane","data-path":e.path,"data-has-failed":e.hasFailed?"true":"false","data-expanded":t?"true":"false","aria-expanded":t,onClick:()=>s(e.path),onMouseEnter:()=>o(e.path),onMouseLeave:()=>o(void 0),children:[(0,m.jsxs)("span",{"data-tst":"lane-name",children:[(0,m.jsx)("span",{"data-tst":"lane-file",children:R(e.path)}),(0,m.jsx)("span",{"data-tst":"lane-dir",children:r})]}),(0,m.jsx)("span",{"data-tst":"ticks",children:e.cases.map((n,i)=>(0,m.jsx)("span",{"data-tst":"tick","data-status":n.status,title:n.name},`${n.name}-${String(i)}`))}),(0,m.jsx)("span",{"data-tst":"lane-reading",children:e.hasFailed?(0,m.jsxs)("span",{"data-tst":"lane-failed",children:[e.failed," ",a.failed]}):(0,m.jsx)("span",{"data-tst":"lane-duration",children:h(e.durationMs)})})]})}var f=require("react/jsx-runtime");function ot({summary:e,strings:t}){return(0,f.jsxs)("header",{"data-testid":"summary-header","data-tst":"header",children:[(0,f.jsxs)("div",{"data-tst":"header-main",children:[(0,f.jsx)("h1",{"data-tst":"title",children:t.title}),(0,f.jsx)("p",{"data-tst":"subtitle",children:t.subtitle})]}),(0,f.jsxs)("div",{"data-tst":"header-stats",children:[(0,f.jsx)("span",{"data-tst":"ago",children:t.ago}),(0,f.jsxs)("span",{"data-tst":"tally",children:[(0,f.jsxs)("span",{"data-tst":"tally-passed",children:[e.passed," ",t.passed]}),(0,f.jsx)("span",{"data-tst":"tally-sep",children:"\xB7"}),(0,f.jsxs)("span",{"data-tst":"tally-failed","data-has-failed":e.failed>0?"true":"false",children:[e.failed," ",t.failed]})]}),(0,f.jsxs)("span",{"data-testid":"header-duration","data-tst":"duration",children:[t.took," ",h(e.wallClockMs)]})]})]})}var b=require("react/jsx-runtime");function Pt(e,t){return 52-(t===0?0:e/t)*48}function rt({series:e,peak:t,strings:a}){let s=e.length<=1?1e3:1e3/(e.length-1),o=e.map((i,x)=>`${(x*s).toFixed(2)},${Pt(i.completed,t).toFixed(2)}`),r=o.length===0?"":`M${o.join(" L")}`,n=o.length===0?"":`M0,56 L${o.join(" L")} L1000,56 Z`;return(0,b.jsxs)("section",{"data-testid":"throughput","data-tst":"throughput",children:[(0,b.jsxs)("svg",{"data-tst":"spark",viewBox:"0 0 1000 56",preserveAspectRatio:"none",role:"img","aria-label":`${t}${a.perSecond}`,children:[(0,b.jsx)("path",{"data-tst":"spark-area",d:n}),(0,b.jsx)("path",{"data-tst":"spark-line",d:r}),e.map((i,x)=>i.failed===0?null:(0,b.jsx)("line",{"data-testid":"failure-pin","data-tst":"pin",x1:(x*s).toFixed(2),x2:(x*s).toFixed(2),y1:0,y2:56},i.second))]}),(0,b.jsxs)("span",{"data-testid":"peak","data-tst":"peak",children:[a.peak," ",t,a.perSecond]})]})}var g=require("react/jsx-runtime");function nt({filter:e,query:t,sort:a,strings:s,onFilter:o,onQuery:r,onSort:n}){return(0,g.jsxs)("div",{"data-testid":"toolbar","data-tst":"toolbar",children:[(0,g.jsxs)("div",{"data-tst":"segmented",role:"group",children:[(0,g.jsx)("button",{type:"button","data-tst":"segment","data-active":e==="all"?"true":"false",onClick:()=>o("all"),children:s.filterAll}),(0,g.jsx)("button",{type:"button","data-tst":"segment","data-active":e==="failed"?"true":"false",onClick:()=>o("failed"),children:s.filterFailed})]}),(0,g.jsx)("input",{type:"search","data-testid":"search-input","data-tst":"search",placeholder:s.searchPlaceholder,value:t,onChange:i=>r(i.target.value)}),(0,g.jsxs)("div",{"data-tst":"segmented",role:"group",children:[(0,g.jsx)("button",{type:"button","data-tst":"segment","data-active":a==="fail-first"?"true":"false",onClick:()=>n("fail-first"),children:s.sortFailFirst}),(0,g.jsx)("button",{type:"button","data-tst":"segment","data-active":a==="slow-first"?"true":"false",onClick:()=>n("slow-first"),children:s.sortSlowFirst})]})]})}var d=require("react/jsx-runtime"),dt="data-ds-dark-theme";function it(){return typeof document>"u"?"light":document.body.hasAttribute(dt)?"dark":"light"}function At(){let[e,t]=(0,u.useState)(it);return(0,u.useEffect)(()=>{if(typeof document>"u")return;let a=()=>t(it());a();let s=new MutationObserver(a);return s.observe(document.body,{attributes:!0,attributeFilter:[dt]}),()=>s.disconnect()},[]),e}function lt(e){let{strings:t,loadSnapshot:a}=e;return function(){let o=At(),[r,n]=(0,u.useState)(void 0),[i,x]=(0,u.useState)(void 0),[H,ut]=(0,u.useState)("all"),[_,mt]=(0,u.useState)(""),[I,gt]=(0,u.useState)("fail-first"),[z,ht]=(0,u.useState)(()=>new Set),[$,yt]=(0,u.useState)(void 0);if((0,u.useEffect)(()=>{let l=!0;return a().then(p=>{l&&n(p)},p=>{l&&x(p instanceof Error?p.message:String(p))}),()=>{l=!1}},[a]),r===void 0)return(0,d.jsx)("div",{"data-testid":"testboard","data-tst":"board",className:`tst-theme-${o}`,"data-theme":o,children:(0,d.jsx)("p",{"data-tst":"status",children:i??"\u2026"})});let bt=Q(r),V=J(r),N=Z(r,{filter:H,query:_,sort:I}),O=Y(N),D=$===void 0?void 0:N.find(l=>l.path===$),vt=l=>{ht(p=>{let w=new Set(p);return w.has(l)?w.delete(l):w.add(l),w})};return(0,d.jsxs)("div",{"data-testid":"testboard","data-tst":"board",className:`tst-theme-${o}`,"data-theme":o,children:[(0,d.jsx)(ot,{summary:bt,strings:{title:t.title,subtitle:t.subtitle,ago:t.ago,passed:t.passed,failed:t.failed,took:t.took}}),(0,d.jsx)(rt,{series:V,peak:X(V),strings:{peak:t.peak,perSecond:t.perSecond}}),(0,d.jsx)(nt,{filter:H,query:_,sort:I,strings:{filterAll:t.filterAll,filterFailed:t.filterFailed,searchPlaceholder:t.searchPlaceholder,sortFailFirst:t.sortFailFirst,sortSlowFirst:t.sortSlowFirst},onFilter:ut,onQuery:mt,onSort:gt}),(0,d.jsxs)("div",{"data-tst":"lanes",children:[O.length===0?(0,d.jsx)("p",{"data-testid":"empty","data-tst":"empty",children:t.empty}):null,O.map(l=>(0,d.jsxs)("section",{"data-testid":"package-section","data-tst":"package","data-package":l.packageName,children:[(0,d.jsx)("h2",{"data-tst":"package-name",children:l.packageName}),l.rows.map(p=>(0,d.jsxs)("div",{"data-tst":"lane-slot",children:[(0,d.jsx)(st,{row:p,expanded:z.has(p.path),strings:{failed:t.failed},onToggle:vt,onHover:yt}),z.has(p.path)?(0,d.jsx)(et,{cases:p.cases}):null]},p.path))]},l.packageName))]}),D===void 0?null:(0,d.jsx)("div",{"data-tst":"card-anchor",children:(0,d.jsx)(at,{row:D})})]})}}var pt=["slots","locale"],E,v;function _t(e){let t=e.locale.getSnapshot?.();return typeof t?.active=="string"?t.active:"zh"}function ct(e){U();let t=e.locale.bind(T);E?.();let a=e.locale.register(T,{zh:P,en:A});E=a;let s=lt({strings:{title:t("testboard.tabTitle"),subtitle:t("testboard.subtitle"),ago:t("testboard.ago"),passed:t("testboard.passed"),failed:t("testboard.failed"),took:t("testboard.took"),filterAll:t("testboard.filterAll"),filterFailed:t("testboard.filterFailed"),searchPlaceholder:t("testboard.searchPlaceholder"),sortFailFirst:t("testboard.sortFailFirst"),sortSlowFirst:t("testboard.sortSlowFirst"),peak:t("testboard.peak"),perSecond:t("testboard.perSecond"),empty:t("testboard.empty"),cases:t("testboard.cases"),detailHint:t("testboard.detailHint")},loadSnapshot:()=>K().then(r=>r.snapshot)}),o;return e.slots.inject(C,()=>{v?.();let r=e.slots.register({name:C,id:W,order:130,label:()=>_t(e).startsWith("zh")?P["testboard.tabTitle"]:A["testboard.tabTitle"],locale:T},s);return v=r,o=r,()=>{r(),v===r&&(v=void 0)}}),()=>{o!==void 0&&v===o&&(v(),v=void 0),o=void 0,E===a&&(a(),E=void 0)}}var ft={name:k,inject:pt,apply:ct},It=ft;

module.exports.boot?.(require);
    return module.exports.default ?? module.exports;
  }
});
