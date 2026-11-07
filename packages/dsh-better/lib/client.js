window.__ModuleLoader__.load({
  id: "dsh-better",
  factory: (require) => {
    var module = { exports: {} };
    var exports = module.exports;
"use strict";var Le=Object.defineProperty;var nr=Object.getOwnPropertyDescriptor;var tr=Object.getOwnPropertyNames;var rr=Object.prototype.hasOwnProperty;var or=(e,n)=>{for(var t in n)Le(e,t,{get:n[t],enumerable:!0})},ir=(e,n,t,r)=>{if(n&&typeof n=="object"||typeof n=="function")for(let o of tr(n))!rr.call(e,o)&&o!==t&&Le(e,o,{get:()=>n[o],enumerable:!(r=nr(n,o))||r.enumerable});return e};var ar=e=>ir(Le({},"__esModule",{value:!0}),e);var Ai={};or(Ai,{boot:()=>Ri,clientPlugin:()=>Qt,default:()=>Ti,findShadowed:()=>Zt,findShadowedSingle:()=>Xe,readSkillUsage:()=>er});module.exports=ar(Ai);var ce=require("react");var Qe="dsh-better.skill-aliases";var ee=Object.freeze({prefix:!0,rows:Object.freeze([])});function sr(e,n){if(e!==void 0)try{e.setItem(Qe,JSON.stringify({v:1,prefix:n.prefix,rows:n.rows}))}catch{}}function ue(e,n){return typeof e=="string"?e:n}function dr(e,n){if(typeof e!="object"||e===null||Array.isArray(e))return;let t=e;if(!(typeof t.keyword!="string"&&typeof t.target!="string"&&typeof t.params!="string"))return{id:ue(t.id,`alias-${n}`)||`alias-${n}`,keyword:ue(t.keyword,""),target:ue(t.target,""),params:ue(t.params,"")}}function lr(e){if(typeof e!="object"||e===null||Array.isArray(e))return ee;let n=e,t=typeof n.prefix=="boolean"?n.prefix:ee.prefix,r=Array.isArray(n.rows)?n.rows:[],o=[],i=new Set;for(let[a,d]of r.slice(0,200).entries()){let c=dr(d,a);if(c===void 0)continue;let l=c.id,s=0;for(;i.has(l);)s+=1,l=`alias-${a}-${s}`;i.add(l),o.push({...c,id:l})}return{prefix:t,rows:o}}function ur(e){if(e===void 0)return ee;let n;try{n=e.getItem(Qe)}catch{return ee}if(n===null||n==="")return ee;try{return lr(JSON.parse(n))}catch{return ee}}function cr(){let e=globalThis.crypto;return e?.randomUUID!==void 0?e.randomUUID():`alias-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,8)}`}function en(e,n=cr){let t=ur(e),r=new Set,o=i=>{t=i;for(let a of[...r])try{a()}catch(d){console.error("[dsh-better] alias store listener failed:",d)}sr(e,i)};return{getSnapshot:()=>t,subscribe(i){return r.add(i),()=>{r.delete(i)}},setPrefix(i){t.prefix!==i&&o({...t,prefix:i})},addRow(){let i=n();return o({...t,rows:[...t.rows,{id:i,keyword:"",target:"",params:""}]}),i},updateRow(i,a){let d=!1,c=t.rows.map(l=>{if(l.id!==i)return l;let s={...l,...a,id:l.id};return d=s.keyword!==l.keyword||s.target!==l.target||s.params!==l.params,s});d&&o({...t,rows:c})},removeRow(i){let a=t.rows.filter(d=>d.id!==i);a.length!==t.rows.length&&o({...t,rows:a})}}}function nn(e){return e.keyword.trim()!==""&&e.target.trim()!==""}function tn(e){return e.keyword.trim().replace(/^\/+/,"").toLowerCase()}function rn(e,n){let t=n.trim().replace(/^\/+/,"").toLowerCase();return t===""?[]:e.rows.filter(r=>nn(r)&&tn(r)===t)}function on(e,n,t=!1){let r=n.trim().replace(/^\/+/,"").toLowerCase(),o=e.rows.filter(nn);if(r==="")return t?o:[];let i=[],a=[],d=[];for(let c of o){let l=tn(c);l===r?i.push(c):l.startsWith(r)?a.push(c):l.includes(r)&&d.push(c)}return[...i,...a,...d]}function an(e){let n=e.target.trim().replace(/^\/+/,"");if(n==="")return"";let t=e.params.trim();return t===""?`/${n} `:`/${n} ${t} `}function sn(e,n){let t=/^\/([^\s/]+)([ \t]*)$/u.exec(n);if(t===null)return;let r=t[1]??"",o=rn(e,r);if(o.length!==0)return{query:r,start:0,end:n.length,rows:o}}function dn(e,n){let t=/^([^\s/]+)([ \t]*)$/u.exec(n);if(t===null)return;let r=t[1]??"",o=rn(e,r);if(o.length!==0)return{query:r,start:0,end:n.length,rows:o}}function ln(e){if(e.keyword.trim()==="")return"keyword";if(e.target.trim()==="")return"target";if(/\s/.test(e.keyword.trim()))return"keyword"}var x=require("react/jsx-runtime");function fr(e){let{row:n,store:t,t:r}=e,o=ln(n);return(0,x.jsxs)("tr",{"data-testid":"alias-row","data-row-id":n.id,"data-incomplete":o===void 0?void 0:"",children:[(0,x.jsx)("td",{children:(0,x.jsx)("input",{className:"dsh-better-alias-input","data-testid":"alias-keyword",value:n.keyword,placeholder:"wf",spellCheck:!1,autoComplete:"off","aria-label":r("alias.table.keyword"),ref:i=>{i!==null&&e.focus&&(i.focus(),e.clearFocus())},onChange:i=>t.updateRow(n.id,{keyword:i.target.value})})}),(0,x.jsx)("td",{children:(0,x.jsx)("input",{className:"dsh-better-alias-input","data-testid":"alias-target",value:n.target,placeholder:"flow-workflow",spellCheck:!1,autoComplete:"off","aria-label":r("alias.table.target"),onChange:i=>t.updateRow(n.id,{target:i.target.value})})}),(0,x.jsx)("td",{children:(0,x.jsx)("input",{className:"dsh-better-alias-input","data-testid":"alias-params",value:n.params,placeholder:r("alias.table.paramsPlaceholder"),spellCheck:!1,autoComplete:"off","aria-label":r("alias.table.params"),onChange:i=>t.updateRow(n.id,{params:i.target.value})})}),(0,x.jsx)("td",{className:"dsh-better-alias-actions",children:(0,x.jsx)("button",{type:"button",className:"dsh-better-alias-delete","data-testid":"alias-remove","aria-label":r("alias.remove",{keyword:n.keyword.trim()||r("alias.unnamed")}),title:r("alias.remove",{keyword:n.keyword.trim()||r("alias.unnamed")}),onClick:()=>t.removeRow(n.id),children:"\xD7"})})]})}function un(e){function n(){let t=(0,ce.useSyncExternalStore)(e.store.subscribe,e.store.getSnapshot,e.store.getSnapshot),{translate:r}=e,o=(0,ce.useRef)(null),i=()=>{o.current=e.store.addRow()};return(0,x.jsxs)("section",{className:"dsh-better-alias-page","data-testid":"alias-page",children:[(0,x.jsx)("h2",{className:"dsh-better-alias-heading",children:r("alias.heading")}),(0,x.jsxs)("label",{className:"dsh-better-alias-prefix",children:[(0,x.jsxs)("span",{children:[(0,x.jsx)("span",{className:"dsh-better-alias-prefix-title",children:r("alias.prefix.title")}),(0,x.jsx)("span",{className:"dsh-better-alias-prefix-hint",children:r(t.prefix?"alias.prefix.on":"alias.prefix.off")})]}),(0,x.jsx)("input",{type:"checkbox","data-testid":"alias-prefix",checked:t.prefix,"aria-label":r("alias.prefix.title"),onChange:a=>e.store.setPrefix(a.target.checked)})]}),(0,x.jsxs)("div",{className:"dsh-better-alias-table-wrap",children:[(0,x.jsxs)("table",{className:"dsh-better-alias-table",children:[(0,x.jsx)("thead",{children:(0,x.jsxs)("tr",{children:[(0,x.jsx)("th",{scope:"col",children:r("alias.table.keyword")}),(0,x.jsx)("th",{scope:"col",children:r("alias.table.target")}),(0,x.jsx)("th",{scope:"col",children:r("alias.table.params")}),(0,x.jsx)("th",{scope:"col","aria-label":r("alias.table.actions")})]})}),(0,x.jsx)("tbody",{children:t.rows.map(a=>(0,x.jsx)(fr,{row:a,store:e.store,t:r,focus:o.current===a.id,clearFocus:()=>{o.current=null}},a.id))})]}),t.rows.length===0?(0,x.jsx)("p",{className:"dsh-better-alias-empty","data-testid":"alias-empty",children:r("alias.empty")}):null]}),(0,x.jsx)("button",{type:"button",className:"dsh-better-alias-add","data-testid":"alias-add",onClick:i,children:r("alias.add")}),(0,x.jsx)("p",{className:"dsh-better-alias-footnote",children:r("alias.footnote")})]})}return n}var Ee="alias",pr="/",mr=-1;function gr(e,n){let t=e.target.trim().replace(/^\/+/,""),r=e.keyword.trim(),o=e.params.trim();return{name:t,label:r,...o===""?{}:{description:n("alias.menu.params",{value:o})},section:n("alias.menu.section"),value:e.id}}function cn(e){return{trigger:pr,name:Ee,order:mr,async candidates(n,t){if(t.position!=="leading")return[];let r=e.config();return!r.prefix&&e.bareMenuOpen?.()!==!0?[]:on(r,t.query,!0).map(o=>gr(o,e.translate))},onPick(n){let t=e.config().rows.find(i=>i.id===n.candidate.value);if(t===void 0)return;let r=t.target.trim().replace(/^\/+/,"");r!==""&&e.routeCommand?.(r,n);let o=an(t);return o===""?void 0:{text:o}}}}var fn="dsh-better/aliases.css",hr=`
[data-testid="alias-page"] {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 720px;
  color: var(--dsw-alias-label-primary);
}
.dsh-better-alias-heading {
  margin: 0;
  padding-bottom: 8px;
  font-size: 14px;
  line-height: 22px;
  font-weight: 500;
}
.dsh-better-alias-prefix {
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  padding: 12px 0;
  border-bottom: 0.5px solid var(--dsw-alias-border-l2);
  cursor: pointer;
}
.dsh-better-alias-prefix-title {
  display: block;
  font-size: 14px;
  line-height: 22px;
}
.dsh-better-alias-prefix-hint {
  display: block;
  margin-top: 2px;
  color: var(--dsw-alias-label-tertiary);
  font-size: 12px;
  line-height: 18px;
}
.dsh-better-alias-prefix input {
  flex-shrink: 0;
  width: 16px;
  height: 16px;
  margin: 0;
  accent-color: var(--dsw-alias-state-business-primary);
  cursor: pointer;
}
.dsh-better-alias-table-wrap {
  margin-top: 14px;
  width: 100%;
}
.dsh-better-alias-table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
}
.dsh-better-alias-table th {
  padding: 4px 8px 6px;
  color: var(--dsw-alias-label-tertiary);
  font-size: 11px;
  font-weight: 500;
  line-height: 16px;
  text-align: left;
}
.dsh-better-alias-table th:nth-child(1) { width: 22%; }
.dsh-better-alias-table th:nth-child(2) { width: 34%; }
.dsh-better-alias-table th:nth-child(3) { width: 32%; }
.dsh-better-alias-table th:nth-child(4) { width: 40px; }
.dsh-better-alias-table td {
  padding: 3px 4px;
  vertical-align: middle;
}
.dsh-better-alias-input {
  box-sizing: border-box;
  width: 100%;
  padding: 6px 8px;
  border: 0.5px solid transparent;
  border-radius: 6px;
  background: color-mix(in srgb, currentColor 4%, transparent);
  color: var(--dsw-alias-label-primary);
  font: inherit;
  font-size: 13px;
  line-height: 20px;
  outline: none;
}
.dsh-better-alias-input::placeholder {
  color: var(--dsw-alias-label-caption);
}
.dsh-better-alias-input:hover {
  border-color: var(--dsw-alias-border-l2);
}
.dsh-better-alias-input:focus {
  border-color: var(--dsw-alias-state-business-primary);
  background: transparent;
}
.dsh-better-alias-actions {
  text-align: right;
}
.dsh-better-alias-delete {
  width: 26px;
  height: 26px;
  padding: 0;
  border: none;
  border-radius: 6px;
  background: transparent;
  color: var(--dsw-alias-label-tertiary);
  cursor: pointer;
  font-size: 16px;
  line-height: 1;
}
.dsh-better-alias-delete:hover {
  background: var(--dsw-alias-interactive-bg-hover);
  color: var(--dsw-alias-label-primary);
}
.dsh-better-alias-empty {
  margin: 10px 4px 0;
  color: var(--dsw-alias-label-tertiary);
  font-size: 12px;
  line-height: 18px;
}
.dsh-better-alias-add {
  align-self: flex-start;
  margin-top: 12px;
  padding: 5px 12px;
  border: 0.5px solid var(--dsw-alias-border-l3);
  border-radius: 6px;
  background: transparent;
  color: inherit;
  cursor: pointer;
  font: inherit;
  font-size: 12px;
  line-height: 18px;
}
.dsh-better-alias-add:hover {
  background: var(--dsw-alias-interactive-bg-hover);
}
.dsh-better-alias-footnote {
  margin: 12px 0 0;
  color: var(--dsw-alias-label-tertiary);
  font-size: 11px;
  line-height: 17px;
}
`;function pn(e){let n=`style[data-plugin-css=${JSON.stringify(fn)}]`;if(e.querySelector(n)!==null)return()=>{};let t=e.createElement("style");return t.dataset.plugin="dsh-better",t.dataset.pluginCss=fn,t.textContent=hr,e.head.append(t),()=>t.remove()}var Y=require("react");var mn={draft:"",draftRev:-1,phase:"plain"};function hn(e){return function(t){let r=(0,Y.useSyncExternalStore)(e.store.subscribe,e.store.getSnapshot,e.store.getSnapshot),o=t.sessionId===void 0?void 0:e.inputStoreFor(t.sessionId),i=t.sessionId===void 0?void 0:e.controllerFor(t.sessionId),a=(0,Y.useSyncExternalStore)(c=>o===void 0?()=>{}:o.subscribe(c),()=>o===void 0?mn:o.getSnapshot(),()=>o===void 0?mn:o.getSnapshot()),d=(0,Y.useRef)(null);return(0,Y.useEffect)(()=>{let c=t.sessionId;if(c===void 0||a.phase!=="plain"||i===void 0)return;let l=i.menu.getSnapshot().open;if(l&&d.current===null)return;let s=Re(r,a.draft);if(l){let f=d.current;if(f!==null&&(f.draftRev!==a.draftRev||f.spanEnd!==(s?.end??-1))){let p=setTimeout(()=>{let m=o?.getSnapshot()??a,h=e.controllerFor(c);if(h===void 0||m.phase!=="plain")return;d.current=null,h.dismiss();let g=Re(e.store.getSnapshot(),m.draft);g!==void 0&&(e.bareMenuOpen.open=!0,gn(h,g,m.draftRev),e.bareMenuOpen.open=!1,d.current={draftRev:m.draftRev,spanEnd:g.end})},80);return()=>clearTimeout(p)}return}if(d.current=null,s===void 0)return;let u=setTimeout(()=>{let f=o?.getSnapshot()??a,p=e.controllerFor(c);if(p===void 0||f.phase!=="plain"||p.menu.getSnapshot().open)return;let m=Re(e.store.getSnapshot(),f.draft);m!==void 0&&(e.bareMenuOpen.open=!0,gn(p,m,f.draftRev),e.bareMenuOpen.open=!1,d.current={draftRev:f.draftRev,spanEnd:m.end})},80);return()=>clearTimeout(u)},[r,a.draft,a.draftRev,a.phase,i,o,t.sessionId]),null}}function Re(e,n){return e.prefix?sn(e,n):dn(e,n)}function gn(e,n,t){e.toggleSource(Ee,{trigger:"/",query:n.query,quoted:!1,position:"leading",span:{start:n.start,end:n.end,draftRev:t}})}function J(e){return e!==void 0&&e!=="plain"}var v=require("react");var yr="[a-z0-9]+(?:-[a-z0-9]+)*",br=new RegExp(`^/(${yr})(?=\\s|$)`,"u");function fe(e,n){let t=br.exec(e);if(t===null)return;let r=t[1]??"";if(n(r))return{name:r,start:0,end:1+r.length}}function yn(e,n,t){return e===void 0||!Number.isInteger(t)||t<e.end||t>n.length||t!==n.length?!1:/^[ \t]*$/u.test(n.slice(e.end,t))}var kr=/\s/u;function kn(e,n){let t=fe(e,n);if(t===void 0)return;let r=e.length-1;for(;r>=0&&!kr.test(e.charAt(r));)r-=1;let o=r+1,i=e.slice(o);if(!(i.length<2||!i.startsWith("--")))return{name:t.name,query:i,start:o}}function Sn(e,n){let t=n.slice(2).toLowerCase();return e.filter(r=>r.flag.startsWith("--")?r.flag.slice(2).toLowerCase().startsWith(t):!1)}function bn(e,n){let t=0;for(let r of n){let o=r.offset+r.length;if(e>=r.offset&&e<o)return;o<=e&&(t+=r.length-1)}return e-t}function xn(e,n,t,r){let o=bn(t.start,n);if(o===void 0)return;let i=bn(e.length,n);if(i!==void 0)return{start:o,end:i,draftRev:r}}function wn(e){return`${e} `}function Sr(e){let n=e.occurrences;if(!Array.isArray(n))return[];let t=[];for(let r of n){if(typeof r!="object"||r===null)continue;let o=r;typeof o.offset!="number"||typeof o.length!="number"||t.push({offset:o.offset,length:o.length})}return t}var xr=/^\/([a-z0-9]+(?:-[a-z0-9]+)*)[ \t]*$/u,wr=400,vn=200,Cn=6,vr=240,Ln={draft:"",draftRev:-1,phase:"plain"};function Cr(e,n){return`${e!==""&&!/\s$/u.test(e)?" ":""}${n} `}function Rn(e){return e===void 0?void 0:xr.exec(e)?.[1]}function Lr(e){return e===void 0?[]:e.split(`
`).map(n=>n.trim()).filter(n=>n!=="")}var Ae=240,Pe=640;function Tn(e){return!Number.isFinite(e)||e<=0?Pe:Math.max(Ae,Math.min(Pe,e-24))}function Er(e,n){let t=Tn(n),r=Number.isFinite(e)&&e>0?e:0,o=r===0?Ae:r<=80?320:r<200?480:Pe;return Math.min(Math.max(o,Ae),t)}function An(e,n,t,r){if(!Number.isFinite(t)||t<=0)return e;let o=t-n-r;return Math.max(r,Math.min(e,Math.max(r,o)))}function Rr(e,n,t){if(t<=0||typeof e.createRange!="function")return;let r=e.createRange(),o=t,i=!1,a=c=>{for(let l of Array.from(c.childNodes)){if(l.nodeType===3){let s=l.textContent??"",u=Math.min(o,s.length);if(u<=0)continue;if(i||(r.setStart(l,0),i=!0),r.setEnd(l,u),o-=u,o<=0)return!0;continue}if(a(l))return!0}return!1};if(!a(n)||o>0)return;let d=r.getBoundingClientRect();if(!(d.width===0&&d.height===0))return{left:d.left,right:d.right,top:d.top,bottom:d.bottom}}function En(e,n){let t=e.querySelectorAll("[data-composer-text-ref]");for(let r of t){if(Rn(r.textContent??"")!==n)continue;let o=Rr(e,r,n.length+1);if(o!==void 0)return o;let i=r.getBoundingClientRect();return{left:i.left,right:i.right,top:i.top,bottom:i.bottom}}}function Oe(e){return e.defaultView?.innerWidth??0}function Pn(e,n,t,r){let o=e.top-r,i=Number.isFinite(t)&&t>0?t:0;return i===0||i<=o?{left:e.left,top:0,anchor:"above"}:{left:e.left,top:e.bottom+r,anchor:"below"}}function pe(e){return e.defaultView?.innerHeight??0}function Tr(e){let n=typeof e.getSelection=="function"?e.getSelection():null,t=n?.anchorNode;if(t!=null){let d=(t.nodeType===1?t:t.parentElement)?.closest("[data-composer-text-ref]");if(d!=null){let c=n?.getRangeAt===void 0||n.rangeCount===0?void 0:n.getRangeAt(0).getBoundingClientRect();if(c!==void 0&&c.height>0)return{left:c.left,right:c.left,top:c.top,bottom:c.bottom}}}let r=e.querySelectorAll("[data-composer-text-ref]"),o=r[r.length-1];if(o===void 0)return;let i=o.getBoundingClientRect();if(!(i.width===0&&i.height===0))return{left:i.left,right:i.right,top:i.top,bottom:i.bottom}}function Ar(e,n){let t=e.createElement("div");t.className="dsh-better-skill-params";let r=e.createElement("div");if(r.className="dsh-better-skill-params-title",r.textContent=`/${n.name}`,t.append(r),n.getActions()?.insertText!==void 0)for(let d of n.params)t.append(Pr(e,n,d.flag,d.detail));let o=4,i=Oe(e),a=Math.min(320,Tn(i));if(t.style.width=`${a}px`,n.box!==void 0){let d=Pn(n.box,pe(e),t.offsetHeight,o);t.style.left=`${An(d.left,a,i,12)}px`,d.anchor==="above"?(t.style.bottom=`${pe(e)-n.box.top+o}px`,t.style.top=""):(t.style.top=`${d.top}px`,t.style.bottom="")}return t}function Pr(e,n,t,r){let o=e.createElement("button");o.type="button",o.className="dsh-better-skill-panel-param",o.addEventListener("pointerdown",a=>a.preventDefault());let i=e.createElement("span");if(i.className="dsh-better-skill-panel-param-flag",i.textContent=t,o.append(i),r!==""){let a=e.createElement("span");a.className="dsh-better-skill-panel-param-detail",a.textContent=r,o.append(a)}return o.addEventListener("click",()=>{let a=n.getActions(),d=a?.captureInsertion?.();if(a?.insertText===void 0||d===void 0)return;let c=xn(n.getDraft(),n.getOccurrences(),n.match,d.draftRev);c!==void 0&&a.insertText(wn(t),c)}),o}function On(e){return function(t){let r=e.document??globalThis.document,o=t.sessionId,i=o===void 0?void 0:e.inputStoreFor(o),a=t.useInput,d=a===void 0?void 0:a(b=>b.draft),c=a===void 0?void 0:a(b=>b.phase),l=a===void 0?void 0:a(b=>b.occurrences),s=(0,v.useSyncExternalStore)(b=>i===void 0?()=>{}:i.subscribe(b),()=>i===void 0?Ln:i.getSnapshot(),()=>i===void 0?Ln:i.getSnapshot()),u=d??s.draft,f=c??s.phase,[p,m]=(0,v.useState)(()=>new Set),[h,g]=(0,v.useState)(void 0),[k,R]=(0,v.useState)(void 0),[E,C]=(0,v.useState)(void 0),[z,U]=(0,v.useState)(void 0),[j,q]=(0,v.useState)(void 0),[S,A]=(0,v.useState)(void 0);(0,v.useEffect)(()=>{if(o===void 0)return;let b=!0;return e.skillNamesFor(o).then(T=>{b&&m(T)},()=>{b&&m(new Set)}),()=>{b=!1}},[o]);let M=fe(u,b=>p.has(b)),N=yn(M,u,u.length)&&!J(f)?M?.name:void 0,I=kn(u,b=>p.has(b)),P=I!==void 0&&!J(f)&&j!==u,D=N??k??(P?I.name:void 0);(0,v.useEffect)(()=>{if(o===void 0||D===void 0){g(void 0);return}let b=!0;return e.loadProfile(o,D).then(T=>{b&&g(T)},()=>{b&&g(void 0)}),()=>{b=!1}},[o,D]),(0,v.useEffect)(()=>{if(r===void 0||N===void 0){C(void 0);return}let b=()=>C(En(r,N));b();let T=r.defaultView;return T?.addEventListener("resize",b),()=>T?.removeEventListener("resize",b)},[r,N,u]);let B=(0,v.useRef)(null),V=(0,v.useRef)(null),K=()=>{B.current!==null&&clearTimeout(B.current),B.current=null},y=()=>{V.current!==null&&clearTimeout(V.current),V.current=null};(0,v.useEffect)(()=>{if(r===void 0||o===void 0)return;let b=Q=>{let G=Q.target;if(!(G instanceof r.defaultView.Element))return;let Ze=G.closest("[data-composer-text-ref]");if(Ze===null)return;let le=Rn(Ze.textContent??"");le!==void 0&&(y(),K(),B.current=setTimeout(()=>{B.current=null,R(le),C(En(r,le)),U(e.loadUsage(o,le))},wr))},T=Q=>{let G=Q.target;G instanceof r.defaultView.Element&&G.closest("[data-composer-text-ref]")!==null&&(K(),y(),V.current=setTimeout(()=>{V.current=null,R(void 0)},vn))};return r.addEventListener("pointerover",b,!0),r.addEventListener("pointerout",T,!0),()=>{K(),y(),r.removeEventListener("pointerover",b,!0),r.removeEventListener("pointerout",T,!0)}},[r,o]),(0,v.useEffect)(()=>{if(r===void 0||k===void 0)return;let b=T=>{T.key==="Escape"&&R(void 0)};return r.addEventListener("keydown",b),()=>r.removeEventListener("keydown",b)},[r,k]);let L=(0,v.useRef)(u);L.current=u;let O=(0,v.useRef)(void 0);O.current=t.inputActions??(o===void 0?void 0:e.actionsFor(o));let de=(0,v.useRef)([]);de.current=Sr({draft:u,draftRev:s.draftRev,phase:f,occurrences:l??s.occurrences});let Ce=(0,v.useRef)(void 0);return(0,v.useEffect)(()=>{if(r===void 0||N===void 0||E===void 0)return;let b=Lr(h?.argumentHint);if(b.length===0)return;let T=Or(r,E,b);return r.body.append(T),()=>T.remove()},[r,N,E,h]),(0,v.useEffect)(()=>{if(r===void 0||k===void 0||P)return;let b=Ir(r,e,{name:k,profile:h,usage:z,box:E,sessionId:o,getActions:()=>O.current,getDraft:()=>L.current,onEnter:y,onLeave:()=>{K(),y(),V.current=setTimeout(()=>{V.current=null,R(void 0)},vn)}});return r.body.append(b),()=>b.remove()},[r,k,h,z,E,o,P]),(0,v.useEffect)(()=>{if(r===void 0||!P){A(void 0);return}let b=()=>A(Tr(r));b();let T=r.defaultView;return T?.addEventListener("resize",b),()=>T?.removeEventListener("resize",b)},[r,P,u]),(0,v.useEffect)(()=>{if(r===void 0||!P||I===void 0)return;let b=Sn(h?.params??[],I.query);if(b.length===0)return;let T=Ar(r,{name:I.name,match:I,params:b,box:S,getActions:()=>O.current,getDraft:()=>L.current,getOccurrences:()=>de.current});return Ce.current=T,r.body.append(T),()=>{Ce.current=void 0,T.remove()}},[r,P,I,h,S]),(0,v.useEffect)(()=>{if(r===void 0||!P)return;let b=T=>{T.key==="Escape"&&q(L.current)};return r.addEventListener("keydown",b),()=>r.removeEventListener("keydown",b)},[r,P]),(0,v.useEffect)(()=>{if(r===void 0||!P)return;let b=T=>{let Q=Ce.current,G=T.target;Q!==void 0&&G instanceof Node&&Q.contains(G)||q(L.current)};return r.addEventListener("pointerdown",b,!0),()=>r.removeEventListener("pointerdown",b,!0)},[r,P]),null}}function Or(e,n,t){let r=e.createElement("div");r.className="dsh-better-skill-hint",r.textContent=t.join(`
`);let o=n.right+Cn>Oe(e)-vr;return r.style.left=`${o?n.left:n.right+Cn}px`,r.style.top=`${o?n.bottom+2:n.top}px`,r}function Ir(e,n,t){let r=e.createElement("div");r.className="dsh-better-skill-panel",r.addEventListener("pointerenter",t.onEnter),r.addEventListener("pointerleave",t.onLeave);let o=e.createElement("div");o.className="dsh-better-skill-panel-title",o.textContent=`/${t.name}`,r.append(o);let i=t.profile?.description;if(i!==void 0&&i!==""){let s=e.createElement("div");s.className="dsh-better-skill-panel-desc",s.textContent=i,s.title=i,r.append(s)}let a=t.profile?.metadata??{},d=Object.keys(a);if(d.length>0){let s=e.createElement("div");s.className="dsh-better-skill-panel-section",s.append(Te(e,n.translate("skill.metadata")));for(let u of d){let f=e.createElement("div");f.textContent=`${u}: ${a[u]??""}`,s.append(f)}r.append(s)}let c=t.profile?.path;if(c!==void 0&&c!==""){r.append(Te(e,n.translate("skill.path")));let s=e.createElement("div");s.className="dsh-better-skill-panel-path",s.textContent=c,r.append(s)}if(t.usage!==void 0){let s=e.createElement("div");s.className="dsh-better-skill-panel-counts",s.textContent=`${n.translate("skill.usage.session")} ${t.usage.session}`,t.usage.workspace!==void 0&&(s.textContent+=` \xB7 ${n.translate("skill.usage.workspace")} ${t.usage.workspace}`),r.append(s)}let l=t.profile?.params??[];if(l.length>0&&t.getActions()?.insertText!==void 0){r.append(Te(e,n.translate("skill.params")));for(let s of l)r.append(Nr(e,n,t,s.flag,s.detail))}{let u=Oe(e),f=Er(i?.length??0,u);if(r.style.width=`${f}px`,t.box!==void 0){let p=Pn(t.box,pe(e),r.offsetHeight,4);r.style.left=`${An(p.left,f,u,12)}px`,p.anchor==="above"?(r.style.bottom=`${pe(e)-t.box.top+4}px`,r.style.top=""):(r.style.top=`${p.top}px`,r.style.bottom="")}}return r}function Te(e,n){let t=e.createElement("div");return t.className="dsh-better-skill-panel-label",t.textContent=n,t}function Nr(e,n,t,r,o){let i=e.createElement("button");i.type="button",i.className="dsh-better-skill-panel-param",i.title=n.translate("skill.hint.insert"),i.addEventListener("pointerdown",d=>d.preventDefault());let a=e.createElement("span");if(a.className="dsh-better-skill-panel-param-flag",a.textContent=r,i.append(a),o!==""){let d=e.createElement("span");d.className="dsh-better-skill-panel-param-detail",d.textContent=o,i.append(d)}return i.addEventListener("click",()=>{let d=t.getActions();if(d?.insertText===void 0||d.captureInsertion===void 0)return;let c=d.captureInsertion();d.insertText(Cr(t.getDraft(),r),c)}),i}var In="dsh-better/skill-enhancer.css",Dr=`
.dsh-better-skill-hint {
  position: absolute;
  z-index: 5;
  /* Bounded so a long hint wraps instead of running off the composer: some
     skills carry a one-line 349-character argument-hint, which would otherwise
     extend past the window edge and get clipped. The ch unit keeps the bound
     readable rather than tied to a pixel width that ignores font size. */
  max-width: min(52ch, calc(100vw - 40px));
  pointer-events: none;
  user-select: none;
  white-space: pre-wrap;
  color: var(--dsw-alias-label-caption);
  font-size: inherit;
  line-height: inherit;
}
.dsh-better-skill-hint[hidden] {
  display: none;
}
.dsh-better-skill-panel {
  position: fixed;
  z-index: 60;
  /* Width is chosen by the caller from the description's real length, so the
     stylesheet only bounds it: narrow enough to feel like a tooltip for skills
     with a one-line description, wide enough for the ~200-character ones that
     dominate the installed catalog. The 640px ceiling is where 200 Chinese
     characters land on ~4 lines; wider stops paying for itself because the
     panel would then cover the transcript it is anchored over. */
  min-width: 240px;
  max-width: min(640px, calc(100vw - 24px));
  max-height: min(420px, 60vh);
  overflow: auto;
  box-sizing: border-box;
  padding: 10px 12px;
  border: 1px solid var(--dsw-alias-border-l2, rgba(0, 0, 0, 0.08));
  border-radius: var(--dsw-radius-md, 12px);
  /* Opaque on purpose: the panel floats over arbitrary page content and must not
     pick it up through a translucent fill. bg-layer-2 is the host's solid layer
     token (the command palette uses it); menu-surface-fill is its translucent
     counterpart and is deliberately not used here. */
  background: var(--dsw-alias-bg-layer-2, #ffffff);
  box-shadow: var(--dsw-elevation-prominent, 0 12px 32px rgba(0, 0, 0, 0.16));
  color: var(--dsw-alias-label-primary);
  font-size: 12px;
  line-height: 18px;
}
.dsh-better-skill-panel-title {
  margin-bottom: 6px;
  font-size: 13px;
  font-weight: 600;
}
.dsh-better-skill-panel-desc {
  margin-bottom: 8px;
  color: var(--dsw-alias-label-secondary);
  /* Long descriptions (the catalog runs to 895 characters) must not turn the
     panel into a wall of text: four lines is roughly the 200-character budget
     the width above is sized for, and anything past it is reachable by hovering
     the title, which carries the full string. */
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 4;
  line-clamp: 4;
  overflow: hidden;
}
.dsh-better-skill-panel-section {
  margin-top: 8px;
}
.dsh-better-skill-panel-label {
  color: var(--dsw-alias-label-caption);
  font-size: 11px;
  text-transform: none;
}
.dsh-better-skill-panel-path {
  color: var(--dsw-alias-label-secondary);
  font-family: var(--dsw-font-mono, ui-monospace, monospace);
  font-size: 11px;
  word-break: break-all;
}
.dsh-better-skill-panel-param {
  display: flex;
  gap: 8px;
  align-items: baseline;
  width: 100%;
  padding: 3px 6px;
  border: 0;
  border-radius: var(--dsw-radius-sm);
  background: transparent;
  color: inherit;
  font: inherit;
  text-align: left;
  cursor: pointer;
}
.dsh-better-skill-panel-param:hover {
  background: var(--dsw-alias-interactive-bg-hover);
}
.dsh-better-skill-panel-param:focus-visible {
  outline: 2px solid var(--dsw-alias-state-business-primary);
  outline-offset: 1px;
}
.dsh-better-skill-panel-param-flag {
  flex: none;
  color: var(--dsw-alias-state-business-primary);
  font-family: var(--dsw-font-mono, ui-monospace, monospace);
}
.dsh-better-skill-panel-param-detail {
  overflow: hidden;
  color: var(--dsw-alias-label-caption);
  text-overflow: ellipsis;
  white-space: nowrap;
}
.dsh-better-skill-panel-counts {
  display: flex;
  gap: 12px;
  color: var(--dsw-alias-label-secondary);
  font-size: 11px;
}
/* The parameter candidate list. It shares the hover panel's surface treatment
   and z-index because the two never appear together: the hover panel is
   suppressed while this one is open, so a different fill or shadow would read as
   a glitch at the handover. The width is fixed by the caller rather than sized
   from content, because a list that resizes as the user types moves the row
   under the pointer. */
.dsh-better-skill-params {
  position: fixed;
  z-index: 60;
  min-width: 240px;
  max-width: min(640px, calc(100vw - 24px));
  max-height: min(420px, 60vh);
  overflow: auto;
  box-sizing: border-box;
  padding: 6px;
  border: 1px solid var(--dsw-alias-border-l2, rgba(0, 0, 0, 0.08));
  border-radius: var(--dsw-radius-md, 12px);
  background: var(--dsw-alias-bg-layer-2, #ffffff);
  box-shadow: var(--dsw-elevation-prominent, 0 12px 32px rgba(0, 0, 0, 0.16));
  color: var(--dsw-alias-label-primary);
  font-size: 12px;
  line-height: 18px;
}
.dsh-better-skill-params-title {
  padding: 2px 6px 4px;
  color: var(--dsw-alias-label-caption);
  font-size: 11px;
}
`;function Nn(e){if(e===void 0)return()=>{};let n=`style[data-plugin-css=${JSON.stringify(In)}]`;if(e.querySelector(n)!==null)return()=>{};let t=e.createElement("style");return t.dataset.plugin="dsh-better",t.dataset.pluginCss=In,t.textContent=Dr,e.head.append(t),()=>t.remove()}function Dn(e,n,t){if(n===void 0||n===""||e.length===0)return;let r=0;for(let o of e){if(o.cwd!==n)continue;let i=o.usage?.[t];typeof i=="number"&&Number.isFinite(i)&&(r+=i)}return r}var w=require("react");var Mr="@deepseek-ai/dsh-client-ui-commands/PopupSelectView.module.css";function Mn(e){if(e===void 0)return;let t=e.querySelector(`style[data-plugin-css="${Mr}"]`)?.textContent??"",r=i=>new RegExp(`\\.(\\w+_${i})\\{`,"u").exec(t)?.[1],o={badges:"dshBetter_badges",badgeChip:"dshBetter_badgeChip",badgeChipOn:"dshBetter_badgeChipOn",card:r("card"),viewport:r("viewport"),row:r("row"),rowActive:r("rowActive"),label:r("label"),labelText:r("labelText"),badge:r("badge"),detail:r("detail"),check:r("check"),status:r("status"),search:r("search"),error:r("error"),errorText:r("errorText"),retry:r("retry")};for(let[i,a]of Object.entries(o))if(!(i==="badges"||i==="badgeChip"||i==="badgeChipOn")&&a===void 0)return;return o}function Ie(e,n){for(let t of e)if(t.id===n.provider){for(let r of t.models)if(r.id===n.model)return r.reasoning}}function _n(e,n){let t=Ie(e,n)?.efforts;return t===void 0?[]:[...t]}function Fn(e,n){if(e.length===0)return;let t=r=>r!==void 0&&e.some(o=>o.id===r);return t(n.remembered)?n.remembered:n.isCurrent&&t(n.currentEffort)?n.currentEffort:t(n.defaultEffort)?n.defaultEffort:e[0]?.id}function _r(e){return e.length>1}function Bn(e){return _r(e)?e:[]}var $=require("react/jsx-runtime");function me(e){let n=e.group?.name;if(n===void 0)return;let t=`${n}/`,r=e.id.startsWith(t)?e.id.slice(t.length):e.id;return{provider:n,model:r}}function Fr(e,n){let t=me(e);return Bn(t===void 0?[]:_n(n??[],t))}function Wn({option:e,active:n,catalog:t,pointed:r,classes:o,primitives:i,onChoose:a,onPickEffort:d,onHover:c,t:l}){let s=Fr(e,t),u=i.IconCheckOutlineRegular;return(0,$.jsxs)("div",{role:"option","aria-selected":n,"aria-label":e.badge===void 0?void 0:`${e.label} ${e.badge}`,className:n?`${o.row} ${o.rowActive}`:o.row,onClick:a,onMouseEnter:c,children:[(0,$.jsxs)("span",{className:o.label,children:[(0,$.jsx)("span",{className:o.labelText,children:e.label}),e.badge!==void 0&&(0,$.jsx)("sup",{className:o.badge,children:e.badge})]}),e.detail!==void 0&&(0,$.jsx)("span",{className:o.detail,children:e.detail}),s.length>0&&(0,$.jsx)("span",{className:o.badges,role:"group","aria-label":l?.("listbox.aria")??"",children:s.map(f=>(0,$.jsx)("button",{type:"button",className:f.id===r?`${o.badgeChip} ${o.badgeChipOn}`:o.badgeChip,title:f.description??f.name,onClick:p=>{p.stopPropagation(),d(f.id)},children:f.name},f.id))}),e.active===!0&&s.length===0&&(0,$.jsx)("span",{className:o.check,children:u===void 0?null:(0,$.jsx)(u,{})})]})}function ge(e){let n=new Map;for(let t of e){let r=t.group?.name,o=n.get(r);o!==void 0?o.rows.push(t):n.set(r,{group:t.group,rows:[t]})}return[...n.values()]}function he(e){let n=ge(e);return n.some(t=>t.group!==void 0)?n.flatMap(t=>t.rows):[...e]}function zn(e,n,t){return t===void 0?e.filter(r=>r.label.toLowerCase().includes(n)):ge(e).flatMap(r=>t(r.rows.map(o=>({name:o.label,option:o})),n).map(o=>o.option))}var Ne=new WeakSet;async function Hn(e,n){let t=e.binding,r=e.state.getSnapshot();if(!(t===null||r.submitting||Ne.has(e))){Ne.add(e),e.state.set?.({...r,submitting:!0,confirming:null,acknowledged:!1,error:null});try{let o=n();if(o===void 0)return;await o,t!==null&&e.binding===t&&e.deps?.consume?.(t.segment)}finally{Ne.delete(e),t!==null&&e.binding===t&&e.dismiss({focusComposer:!0})}}}var Br="@deepseek-ai/dsh-client-ui-primitives";function ye(e){if(e===null)return{};let n;try{n=e(Br)}catch{return{}}if(n===null||typeof n!="object")return{};let t=n,r=g=>typeof g=="function"||typeof g=="object"&&g!==null,o=g=>{let k=t[g];return r(k)?k:void 0},i=g=>{let k=t[g];return typeof k=="function"?k:void 0},a={},d=o("MenuSurface");d!==void 0&&(a.MenuSurface=d);let c=o("MenuGroup");c!==void 0&&(a.MenuGroup=c);let l=o("IconCheckOutlineRegular");l!==void 0&&(a.IconCheckOutlineRegular=l);let s=o("IconDataOutlineRegular");s!==void 0&&(a.IconDataOutlineRegular=s);let u=o("IconChevronDownOutlineRegular");u!==void 0&&(a.IconChevronDownOutlineRegular=u);let f=o("Tag");f!==void 0&&(a.Tag=f);let p=i("useAnchoredMaxHeight");p!==void 0&&(a.useAnchoredMaxHeight=p);let m=i("observeStickyMenuGroups");m!==void 0&&(a.observeStickyMenuGroups=m);let h=i("rankByName");return h!==void 0&&(a.rankByName=h),a}function Wr(e){if(e===void 0)return[];let n=[e.name,e.label].map(t=>t.trim().toLowerCase()).filter(t=>t!=="");return[...new Set(n)]}function zr(e,n){return Wr(e.group).some(t=>t.includes(n))}function Hr(e,n,t,r){return t==="fuzzy-label"?zn(e,n,r):he(e).filter(o=>o.label.toLowerCase().includes(n)||o.detail?.toLowerCase().includes(n)===!0)}function $n(e,n,t,r){let o=n.trim().toLowerCase();if(o==="")return he(e);let i=Hr(e,o,t,r),a=new Set(i),d=he(e).filter(c=>!a.has(c)&&zr(c,o));return[...i,...d]}var _=require("react/jsx-runtime"),Vn="model",Un=320;function $r(e){return e.command!==Vn||!e.open||e.status!=="ready"||e.confirming!==null||e.options.length===0?!1:e.submitting||e.error===null}function Ur(e){return e===void 0?!1:/Android|iPhone|iPad|iPod/i.test(e.userAgent)||e.platform==="MacIntel"&&e.maxTouchPoints>1}var jr={subscribe:()=>()=>{},getSnapshot:()=>({open:!1,command:null,status:"pending",options:[],search:"",searchLabels:null,searchMode:"substring",active:0,submitting:!1,confirming:null,acknowledged:!1,error:null})};function Gn(e){let n=ye(e.load);function t(r){let o=r.popup,i=o?.state??jr,a=(0,w.useCallback)(s=>i.subscribe(s),[i]),d=(0,w.useCallback)(()=>i.getSnapshot(),[i]),c=(0,w.useSyncExternalStore)(a,d),l=e.native();return o===void 0||l===void 0?null:!$r(c)||o.settle===void 0?(0,_.jsx)(l,{...r}):(0,_.jsx)(qr,{popup:o,state:c,t:r.t,primitives:n,doc:e.document,catalog:r.catalog,current:r.current,selectModel:r.selectModel})}return t}function qr({popup:e,state:n,t,primitives:r,doc:o,catalog:i,current:a,selectModel:d}){let c=(0,w.useRef)(null),l=(0,w.useRef)(null),s=(0,w.useRef)(null),u=(0,w.useMemo)(()=>Mn(o),[o]),f=n.searchMode,p=(0,w.useMemo)(()=>$n(n.options,n.search,f,r.rankByName),[n.options,n.search,f,r.rankByName]),m=(0,w.useMemo)(()=>ge(p),[p]),[h,g]=(0,w.useState)({}),[k,R]=(0,w.useState)(()=>jn(p));(0,w.useEffect)(()=>{R(jn(p))},[n.search,n.options]);let E=qn(p,k),C=Vr(r,c,n);(0,w.useEffect)(()=>{let y=s.current;if(!(y===null||r.observeStickyMenuGroups===void 0))return r.observeStickyMenuGroups(y)},[r.observeStickyMenuGroups,n.open,n.status,m]),(0,w.useEffect)(()=>{c.current?.querySelector('[aria-selected="true"]')?.scrollIntoView({block:"nearest"})},[E,p]),(0,w.useEffect)(()=>{if(!n.open)return;let y=L=>{let O=c.current;O!==null&&L.target instanceof Node&&O.contains(L.target)||e.dismiss()};return o?.addEventListener("pointerdown",y,!0),()=>{o?.removeEventListener("pointerdown",y,!0)}},[o,e,n.open]),(0,w.useEffect)(()=>{n.open&&(Ur(o?.defaultView?.navigator)||l.current?.focus())},[o,n.open]);let z=(0,w.useCallback)((y,L)=>{if(L===void 0||d===void 0){e.settle?.(e.binding,y);return}let O=me(y);if(O===void 0){e.settle?.(e.binding,y);return}Hn(e,()=>d({...O,reasoningEffort:L}))},[e,d]),U=(0,w.useCallback)(y=>{let L=me(y);if(L===void 0)return;let O=Ie(i??[],L);return Fn(O?.efforts??[],{remembered:h[y.id],isCurrent:a?.provider===L.provider&&a?.model===L.model,currentEffort:a?.reasoningEffort,defaultEffort:O?.defaultEffort})},[i,a,h]),j=(0,w.useCallback)(y=>{z(y,U(y))},[U,z]),q=(0,w.useCallback)((y,L)=>{g(O=>({...O,[y.id]:L})),z(y,L)},[z]),S=(0,w.useCallback)(()=>{let y=p[E];y!==void 0&&j(y)},[E,j,p]),A=(0,w.useCallback)(y=>{p.length!==0&&R(L=>(qn(p,L)+y+p.length)%p.length)},[p]),M=y=>{switch(y.key){case"ArrowDown":y.preventDefault(),A(1);return;case"ArrowUp":y.preventDefault(),A(-1);return;case"Enter":y.preventDefault(),S();return;case"Tab":if(!y.shiftKey&&p.length===0)return;y.preventDefault(),y.shiftKey?e.dismiss({focusComposer:!0}):S();return;case"Escape":y.preventDefault(),e.dismiss({focusComposer:!0});return;default:}};if(u===void 0)return null;let N=n.searchLabels?.placeholder??t?.("search.placeholder")??"",I=n.searchLabels===null?t?.("status.empty")??"":n.options.length===0?n.searchLabels.empty:n.searchLabels.noResults,P=(y,L)=>(0,_.jsx)(Wn,{option:y,active:L===E,catalog:i,pointed:L===E?U(y):void 0,classes:u,primitives:r,onChoose:()=>{j(y)},onPickEffort:O=>{q(y,O)},onHover:()=>{R(L)},t},y.id),D=0,B=m.map(({group:y,rows:L})=>{let O=L.map(de=>P(de,D++));return y===void 0?(0,_.jsx)(w.Fragment,{children:O},"ungrouped"):r.MenuGroup===void 0?(0,_.jsx)(w.Fragment,{children:O},`group:${y.name}`):(0,_.jsx)(r.MenuGroup,{label:y.label,children:O},`group:${y.name}`)}),V=(0,_.jsxs)(_.Fragment,{children:[(0,_.jsx)("input",{ref:l,className:u.search,type:"text",placeholder:N,"aria-label":t?.("search.aria")??"",value:n.search,readOnly:n.submitting,onChange:y=>{e.setSearch(y.currentTarget.value)}}),n.submitting&&(0,_.jsx)("div",{className:u.status,children:t?.("status.applying")??""}),!n.submitting&&p.length===0&&(0,_.jsx)("div",{className:u.status,children:I}),p.length>0&&(0,_.jsx)("div",{ref:s,role:"listbox","aria-label":t?.("listbox.aria")??"",className:u.viewport,children:B})]}),K={className:u.card,style:{maxHeight:C},"aria-label":t?.("overlay.aria")??Vn,onKeyDown:M};return r.MenuSurface===void 0?(0,_.jsx)("div",{ref:c,...K,children:V}):(0,_.jsx)(r.MenuSurface,{ref:c,...K,children:V})}function jn(e){let n=e.findIndex(t=>t.active===!0);return n===-1?0:n}function qn(e,n){return e.length===0?0:Math.min(Math.max(n,0),e.length-1)}function Vr(e,n,t){let r=e.useAnchoredMaxHeight;return r===void 0?Un:r(n,Un,t)}var H=require("react");var De="application/x-dsh-composer+json";var Gr=Object.freeze({png:"image/png",jpg:"image/jpeg",jpeg:"image/jpeg",webp:"image/webp",gif:"image/gif",bmp:"image/bmp",svg:"image/svg+xml",avif:"image/avif",heic:"image/heic",heif:"image/heif",tif:"image/tiff",tiff:"image/tiff"});function Kn(e){return JSON.stringify({v:1,text:e.text,attachments:e.attachments.map(n=>({path:n.path,name:n.name,type:n.type,kind:n.kind}))})}function Yn(e){if(typeof e!="string"||e==="")return;let n;try{n=JSON.parse(e)}catch{return}if(n===null||typeof n!="object")return;let t=n;if(t.v!==1)return;let r=typeof t.text=="string"?t.text:"",o=Array.isArray(t.attachments)?t.attachments:[],i=[];for(let a of o){if(a===null||typeof a!="object")continue;let d=a,c=d.path;typeof c!="string"||c===""||i.push({path:c,name:typeof d.name=="string"&&d.name!==""?d.name:_e(c),type:typeof d.type=="string"?d.type:"",kind:d.kind==="image"?"image":"file"})}return{text:r,attachments:i}}function Me(e,n){if(n.length===0)return e;let t=n.join(`
`);return e===""?t:`${e.replace(/\n+$/u,"")}

${t}`}function Jn(e){if(e==="")return;let n=e.split(`
`),t=[],r=n.length;for(let i=n.length-1;i>=0;i-=1){let a=n[i]??"";if(a.trim()===""){if(t.length>0){r=i;continue}continue}let d=Kr(a);if(d===void 0)break;t.unshift(d),r=i}return t.length===0?void 0:{text:n.slice(0,r).join(`
`).replace(/\n+$/u,""),paths:t}}function Kr(e){let n=e.trim();if(n.startsWith("@")&&(n=n.slice(1)),n.startsWith('"')&&n.endsWith('"')&&n.length>1&&(n=n.slice(1,-1)),n!==""&&Yr(n)&&!/[\u0000-\u001f\u007f]/u.test(n)&&!/["\u2018\u2019\u201c\u201d\u300c\u300d\u300e\u300f\u3002\uff01\uff1f\uff1b\uff1a\uff0c\u3001\u2026*?;<>|&$`!#=]/u.test(n)&&!/(?:^|\s)-{1,2}\S/u.test(n))return n}function Yr(e){return e.startsWith("/")||/^[A-Za-z]:[/\\]/u.test(e)||e.startsWith("\\\\")}function Xn(e){let n=/\.([A-Za-z0-9]+)$/u.exec(e);if(n!==null)return Gr[n[1]?.toLowerCase()??""]}function _e(e){return e.split(/[\\/]/u).filter(t=>t!=="").at(-1)??e}function Zn(e,n){let t=new Set(n),r=[],o=[];for(let i of e){if(t.has(i.path)){o.push(i.path);continue}t.add(i.path),r.push(i)}return{accepted:r,duplicates:o}}var ne=require("react/jsx-runtime"),Jr="data-dsh-better-attach-item",Xr="data-dsh-better-attach-selected",Zr=4500,Qr=new Set(["a","c","x","insert"]),eo=new Set(["meta","control","shift","alt","altgraph","capslock","os"]),no=/\s/u;function et(e){function n(t){let r=e.native();return r===void 0?null:(0,ne.jsx)(to,{native:r,props:t,deps:e})}return n}function to({native:e,props:n,deps:t}){let r=(0,H.useRef)(null),[o,i]=(0,H.useState)(!1),[a,d]=(0,H.useState)(null),c=(n.attachments??[]).length>0,l=(0,H.useRef)(n);l.current=n;let s=(0,H.useRef)(o);s.current=o;let u=(p,m)=>n.t?.(p,m)??t.translate()?.(p,m)??"",f=(0,H.useRef)(u);return f.current=u,(0,H.useEffect)(()=>{let p=r.current;if(p===null)return;let m=p.querySelector('[role="group"]');if(m!==null)for(let h of Array.from(m.children)){if(!(h instanceof HTMLElement))continue;h.toggleAttribute(Jr,!0);let g=ao(h);g!==null&&g.toggleAttribute(Xr,o)}},[o,n.attachments]),(0,H.useEffect)(()=>{if(a===null)return;let p=globalThis.setTimeout(()=>{d(null)},Zr);return()=>{globalThis.clearTimeout(p)}},[a]),(0,H.useEffect)(()=>{let p=r.current;if(p===null)return;let m=p.closest("[data-composer-card]");if(!(m instanceof HTMLElement))return;let h=m.ownerDocument,g=S=>(S instanceof Element?S:S instanceof Node?S.parentElement:null)?.closest("[contenteditable]")??null,k=()=>{s.current&&i(!1)},R=()=>{let S=m.ownerDocument.getSelection();return S!==null&&!S.isCollapsed&&S.toString()!==""},E=S=>S instanceof Node&&m.contains(S),C=S=>{let A=S.key.toLowerCase();if(eo.has(A))return;let M=S.metaKey||S.ctrlKey;if(M&&!S.altKey&&A==="a"){E(S.target)&&g(S.target)?.getAttribute("contenteditable")==="true"&&i(!0);return}if(M&&!S.altKey&&A==="c"&&s.current&&E(S.target)&&!R()){S.preventDefault(),oo(l.current,t,d,f.current);return}M&&!S.altKey&&Qr.has(A)||k()},z=()=>{k()},U=S=>{let M=l.current.attachments??[],N=S.clipboardData;if(!s.current||M.length===0||N===null)return;let I=[],P=[];for(let D of M){let B=t.pathOf(D.file);if(B===""){P.push(D.file.name);continue}I.push({path:B,name:D.file.name,type:D.file.type,kind:D.kind})}if(I.length>0){let D=N.getData("text/plain");N.setData(De,Kn({text:D,attachments:I})),N.setData("text/plain",Me(D,I.map(B=>B.path)))}P.length>0&&d(f.current("attach.copySkipped",{count:String(P.length)}))},j=S=>{let A=S.clipboardData;if(A===null||g(S.target)===null||Array.from(A.types).includes("Files"))return;let M=()=>l.current,N=Yn(A.getData(De)),I=N===void 0?Jn(A.getData("text/plain")):void 0;if(N===void 0&&I===void 0)return;let P=ro(l.current.phase?.(),f.current);if(P!==void 0){S.preventDefault(),S.stopPropagation(),d(P);return}if(S.preventDefault(),S.stopPropagation(),k(),N!==void 0){Qn(N,M,t,d,f.current);return}I!==void 0&&Qn({text:I.text,attachments:I.paths.map(D=>{let B=Xn(D)??"";return{path:D,name:_e(D),type:B,kind:B===""?"file":"image"}})},M,t,d,f.current)};h.addEventListener("keydown",C,!0),m.addEventListener("paste",j,!0);let q=S=>{let A=S.relatedTarget;A instanceof Node&&m.contains(A)||k()};return m.addEventListener("focusout",q),h.addEventListener("copy",U),h.addEventListener("pointerdown",z,!0),()=>{h.removeEventListener("keydown",C,!0),h.removeEventListener("copy",U),m.removeEventListener("paste",j,!0),m.removeEventListener("focusout",q),h.removeEventListener("pointerdown",z,!0)}},[t]),(0,ne.jsxs)("div",{ref:r,className:c?"dshBetter_railHost":"dshBetter_railHostEmpty",children:[(0,ne.jsx)(e,{...n}),a!==null&&(0,ne.jsx)("div",{className:"dshBetter_attachNotice",role:"status",children:a})]})}function ro(e,n){return J(e)?n("attach.pasteBusy"):void 0}function oo(e,n,t,r){let o=e.attachments??[],i=[],a=0;for(let d of o){let c=n.pathOf(d.file);c===""?a+=1:i.push(c)}i.length>0&&globalThis.navigator?.clipboard?.writeText(Me("",i)).catch(()=>{t(r("attach.copyFailed"))}),a>0&&t(r("attach.copySkipped",{count:String(a)}))}function Qn(e,n,t,r,o){let i=n();if(Fe(i,e.text),e.attachments.length===0)return;let a=t.reader(),d=i.sessionId;if(a===void 0||d===void 0){Fe(i,e.attachments.map(s=>s.path).join(`
`));return}let c=(i.attachments??[]).map(s=>t.pathOf(s.file)).filter(s=>s!==""),{accepted:l}=Zn(e.attachments,c);l.length!==0&&(async()=>{let s=[],u=[],f=0;for(let m of l){let h=await io(a,d,m);h.kind==="file"?s.push(h.file):h.kind==="mention"?u.push(h.mention):f+=1}let p=n();u.length>0&&Fe(p,u.join(" ")),s.length>0&&p.onAddFiles?.(s),f>0&&r(o("attach.pasteMissing",{count:String(f)})),u.length>0&&r(o("attach.pasteReferenced",{count:String(u.length)}))})()}function Fe(e,n){if(n==="")return;let t=e.inputActions,r=t?.captureInsertion?.();t?.insertText===void 0||r===void 0||t.insertText(n,r)}async function io(e,n,t){let r=await e.readBytes?.(n,t.path,{});if(r!==void 0&&r.ok)return{kind:"file",file:new File([r.value.data],t.name,{type:t.type})};let o=await e.stat?.(n,t.path);return o!==void 0&&o.ok?{kind:"mention",mention:so(t.path)}:{kind:"missing"}}function ao(e){let n=e.querySelector("img")?.parentElement;if(n!=null)return n;let t=e.firstElementChild;return t instanceof HTMLElement?t:null}function so(e){return no.test(e)?`@"${e}"`:`@${e}`}var lo="better.focusComposer",uo=Object.freeze(["focus input","focus composer","message input"]),oe="command.focusComposer",co=Object.freeze(["page","editable","terminal"]),fo=Object.freeze({"desktop:macos":{code:"Space",modifiers:["primary"]},"desktop:windows":{code:"Space",modifiers:["primary","shift"]},"web:macos":{code:"Space",modifiers:["primary","shift"]},"web:windows":{code:"Space",modifiers:["primary","shift"]}}),po="[data-composer-input], [role='textbox'][aria-multiline='true']";function tt(e){return e===void 0||typeof e.querySelector!="function"?!1:e.querySelector(po)!=null}function Be(e,n){if(e===null||typeof e!="object")return;let t=e.get;if(typeof t=="function"){let r=t.call(e,n);return r===null?void 0:r}return e[n]}var nt=e=>typeof e=="string"&&e!==""?e:void 0;function rt(e){let t=Be(e,"uiSession")?.adapter?.current?.getSnapshot?.();if(t!==void 0)return nt(t.key);let r=Be(e,"sessions");return nt(r?.list?.getSnapshot?.()?.current)}function ot(e,n){try{let t=e.sessions?.scope?.(n);if(t===void 0)return!1;let o=Be(t,"conversation")?.input?.for?.(t);return o===void 0||typeof o.focus!="function"?!1:(o.focus(),!0)}catch{return!1}}function mo(e){return(n={})=>{if(n.modal!=null)return{status:"pass"};if(!e.composerMounted())return{status:"pass"};let t=e.currentSessionId();return t===void 0?{status:"pass"}:{status:"handled",run:()=>{e.focusComposer(t)}}}}function go(e,n){return{id:lo,label:n,aliases:uo,defaults:fo,regions:co,modals:[],resolve:mo(e)}}function it(e,n,t,r){if(e===void 0||typeof e.register!="function")return()=>{};try{return e.register(go(n,t))}catch(o){return r?.(o instanceof Error?o.message:String(o)),()=>{}}}var at=Object.freeze({zh:{"overlay.aria":"\u9009\u62E9\u6A21\u578B","listbox.aria":"\u6A21\u578B\u5339\u914D\u9879","search.aria":"\u641C\u7D22\u4F9B\u5E94\u5546\u6216\u6A21\u578B","search.placeholder":"\u641C\u7D22\u4F9B\u5E94\u5546\u6216\u6A21\u578B\u2026","status.empty":"\u6CA1\u6709\u53EF\u7528\u7684\u6A21\u578B\u3002","status.applying":"\u6B63\u5728\u5207\u6362\u2026",retry:"\u91CD\u8BD5","trigger.selectAria":"\u9009\u62E9\u6A21\u578B","trigger.aria":"\u5F53\u524D\u6A21\u578B {model}\uFF0C\u70B9\u51FB\u5207\u6362","trigger.ariaEffort":"\u5F53\u524D\u6A21\u578B {model}\uFF0C\u63A8\u7406\u7B49\u7EA7 {effort}\uFF0C\u70B9\u51FB\u5207\u6362","trigger.fallback":"\u9009\u62E9\u6A21\u578B","trigger.loading":"\u52A0\u8F7D\u6A21\u578B\u2026",[oe]:"\u805A\u7126\u8F93\u5165\u6846","attach.copySkipped":"{count} \u4E2A\u9644\u4EF6\u6765\u81EA\u526A\u8D34\u677F\u3001\u6CA1\u6709\u672C\u5730\u8DEF\u5F84\uFF0C\u672A\u590D\u5236","attach.pasteMissing":"{count} \u4E2A\u9644\u4EF6\u5BF9\u5E94\u7684\u6587\u4EF6\u5DF2\u4E0D\u5B58\u5728\uFF0C\u672A\u7C98\u8D34","attach.pasteReferenced":"{count} \u4E2A\u9644\u4EF6\u8D85\u51FA\u5355\u6B21\u8BFB\u53D6\u4E0A\u9650\uFF0C\u5DF2\u6539\u4E3A\u8DEF\u5F84\u5F15\u7528","attach.copyFailed":"\u6D4F\u89C8\u5668\u62D2\u7EDD\u4E86\u8FD9\u6B21\u526A\u8D34\u677F\u5199\u5165","attach.pasteBusy":"\u6D88\u606F\u6B63\u5728\u53D1\u9001\uFF0C\u7A0D\u540E\u518D\u7C98\u8D34","compaction.reading":"\u538B\u7F29 {count} \u6B21","compaction.readingOne":"\u538B\u7F29 1 \u6B21","compaction.tooltip":"\u672C\u4F1A\u8BDD\u4E0A\u4E0B\u6587\u5DF2\u538B\u7F29 {count} \u6B21","compaction.tooltipWithFailures":"\u672C\u4F1A\u8BDD\u4E0A\u4E0B\u6587\u5DF2\u538B\u7F29 {count} \u6B21\uFF0C\u53E6\u6709 {failures} \u6B21\u538B\u7F29\u5931\u8D25","tabs.nav":"Tab \u7BA1\u7406","tabs.heading":"Tab \u7BA1\u7406","tabs.empty":"\u8FD8\u6CA1\u6709\u63D2\u4EF6\u6CE8\u518C\u4F1A\u8BDD\u6807\u7B7E\u3002","tabs.show":"\u5728\u6807\u7B7E\u680F\u663E\u793A{label}","tabs.hide":"\u4ECE\u6807\u7B7E\u680F\u9690\u85CF{label}","alias.nav":"\u6280\u80FD\u522B\u540D","alias.heading":"\u6280\u80FD\u522B\u540D","alias.prefix.title":"\u9700\u8981\u659C\u6760\u524D\u7F00","alias.prefix.on":"\u6253\u5F00\u5219\u9700\u8981\u8F93\u5165 \u201C/\u201D \u8FDB\u884C\u5339\u914D","alias.prefix.off":"\u6253\u5F00\u5219\u65E0\u9700\u8F93\u5165 \u201C/\u201D \u8FDB\u884C\u5339\u914D","alias.table.keyword":"\u5173\u952E\u8BCD","alias.table.target":"\u6280\u80FD\u6216\u547D\u4EE4","alias.table.params":"\u53C2\u6570","alias.table.paramsPlaceholder":"\u53EF\u9009\uFF0C\u5982 run","alias.table.actions":"\u64CD\u4F5C","alias.add":"\u6DFB\u52A0\u522B\u540D","alias.remove":"\u5220\u9664\u522B\u540D {keyword}","alias.unnamed":"\uFF08\u672A\u547D\u540D\uFF09","alias.empty":"\u8FD8\u6CA1\u6709\u522B\u540D\u3002\u4F8B\u5982\uFF1Awf \u2192 /flow-workflow run","alias.footnote":"\u8F93\u5165\u5173\u952E\u8BCD\u540E\u4ECE\u9762\u677F\u9009\u62E9\u5373\u53EF\u63D2\u5165\u5B8C\u6574\u8C03\u7528\uFF1B\u6539\u5B8C\u7ACB\u5373\u751F\u6548\u3002","alias.menu.section":"\u6280\u80FD\u522B\u540D","alias.menu.params":"\u53C2\u6570\uFF1A{value}","skill.metadata":"\u5143\u6570\u636E","skill.path":"\u5730\u5740","skill.usage.session":"\u672C\u4F1A\u8BDD\u8C03\u7528","skill.usage.workspace":"\u672C\u5DE5\u4F5C\u533A\u8C03\u7528","skill.params":"\u53C2\u6570","skill.hint.insert":"\u70B9\u51FB\u63D2\u5165","continue.label":"\u7EE7\u7EED","continue.sending":"\u7EE7\u7EED\u4E2D\u2026"},en:{"overlay.aria":"Select a model","listbox.aria":"Matching models","search.aria":"Search providers or models","search.placeholder":"Search providers or models\u2026","status.empty":"No models available.","status.applying":"Switching\u2026",retry:"Retry","trigger.selectAria":"Select model","trigger.aria":"Current model {model}, click to change","trigger.ariaEffort":"Current model {model}, reasoning effort {effort}, click to change","trigger.fallback":"Select model","trigger.loading":"Loading models\u2026",[oe]:"Focus message input","attach.copySkipped":"{count} attachment(s) came from the clipboard with no local path and were not copied","attach.pasteMissing":"{count} attachment(s) no longer exist and were not pasted","attach.pasteReferenced":"{count} attachment(s) exceed the read limit and became path references","attach.copyFailed":"The browser refused this clipboard write","attach.pasteBusy":"A message is being sent; paste again in a moment","compaction.reading":"{count} compactions","compaction.readingOne":"1 compaction","compaction.tooltip":"This session's context was compressed {count} time(s)","compaction.tooltipWithFailures":"This session's context was compressed {count} time(s), with {failures} failed attempt(s)","tabs.nav":"Tabs","tabs.heading":"Tabs","tabs.empty":"No plugin has registered a conversation tab yet.","tabs.show":"Show {label} in the tab bar","tabs.hide":"Hide {label} from the tab bar","alias.nav":"Skill aliases","alias.heading":"Skill aliases","alias.prefix.title":"Require a slash prefix","alias.prefix.on":"To open, type \u201C/\u201D to match","alias.prefix.off":"To open, type the keyword without \u201C/\u201D to match","alias.table.keyword":"Keyword","alias.table.target":"Skill or command","alias.table.params":"Arguments","alias.table.paramsPlaceholder":"Optional, e.g. run","alias.table.actions":"Actions","alias.add":"Add alias","alias.remove":"Delete alias {keyword}","alias.unnamed":"(unnamed)","alias.empty":"No aliases yet. For example: wf \u2192 /flow-workflow run","alias.footnote":"Type a keyword and pick from the panel to insert the full invocation; changes apply immediately.","alias.menu.section":"Skill aliases","alias.menu.params":"args: {value}","skill.metadata":"Metadata","skill.path":"Path","skill.usage.session":"This session","skill.usage.workspace":"This workspace","skill.params":"Arguments","skill.hint.insert":"Click to insert","continue.label":"Continue","continue.sending":"Continuing\u2026"}});var st="dsh-better-effort",ho=`
.dshBetter_badges {
  flex: none;
  display: inline-flex;
  align-items: center;
  gap: 2px;
  margin-left: 4px;
}
.dshBetter_badgeChip {
  font: inherit;
  font-size: 10px;
  line-height: 1;
  padding: 2px 5px;
  border: 0;
  border-radius: var(--dsw-radius-sm);
  background: transparent;
  color: var(--dsw-alias-label-tertiary);
  cursor: pointer;
  white-space: nowrap;
}
.dshBetter_badgeChip:hover {
  background: var(--dsw-alias-interactive-bg-hover);
  color: var(--dsw-alias-label-primary);
}
.dshBetter_badgeChipOn {
  background: var(--dsw-alias-interactive-bg-hover);
  color: var(--dsw-alias-label-primary);
  font-weight: 600;
  /* The active row's own background is the same fill this chip uses, so the
     pointed level needs a stroke to stay readable against it. A shadow draws
     outside the box: no layout shift, and the border token keeps both themes. */
  box-shadow: 0 0 0 1px var(--dsw-alias-border-l1);
}
.dshBetter_badgeChip:focus-visible {
  outline: 1px solid var(--dsw-alias-border-l1);
  outline-offset: 1px;
}

/* The rail host exists to give the notice a positioning context and the rail a
   wrapper. With attachments it must add no spacing of its own: the composer card
   is a flex column with a 12px gap, so the wrapper simply stands in for the rail
   div that was the flex item before. */
.dshBetter_railHost {
  position: relative;
  min-width: 0;
}

/* While the draft has no attachments the host generates no box at all, so the
   card's flex layout is exactly what it was before this plugin: an empty wrapper
   would otherwise claim a gap slot and push the editor down. */
.dshBetter_railHostEmpty {
  display: contents;
}

/* A selected attachment is drawn as a ring on the attachment's own surface \u2014
   the thumbnail button for an image, the card for a file \u2014 never as a restyle:
   the shell keeps its markup, radius and hover states, and an outline reflows
   nothing when the mark appears or disappears.

   Inset, not around: the rail's track is overflow-x auto / overflow-y hidden and
   exactly as tall as its items, so anything painted outside an item is clipped
   away on the top and bottom edges and the mark reads as broken. Drawing inside
   keeps all four edges, and the element's own border radius keeps the ring
   concentric with the shape it belongs to.

   The mark is on the inner element rather than the rail item wrapper because a
   file card paints an opaque background over the wrapper's box: an inset ring on
   the wrapper is drawn underneath the card and never appears.

   The accent is state-business-primary because that is the token this theme
   actually populates with the product accent \u2014 it is the send button's own fill.
   brand-primary reads like the accent by name but resolves to the ink colour
   here, which would draw a black ring. */
[data-dsh-better-attach-selected] {
  outline: 2px solid var(--dsw-alias-state-business-primary, #4176e6);
  outline-offset: -2px;
}

/* Floats above the rail rather than joining the card's column, so a notice can
   never shift the editor while it is on screen. */
.dshBetter_attachNotice {
  position: absolute;
  bottom: calc(100% + 8px);
  left: 10px;
  z-index: 4;
  max-width: min(420px, 100%);
  padding: 6px 10px;
  border-radius: var(--dsw-radius-md);
  background: var(--dsw-specific-input-major);
  box-shadow: var(--dsw-elevation-panel);
  color: var(--dsw-alias-label-secondary);
  font-size: 12px;
  line-height: 18px;
  pointer-events: none;
}
`;function dt(e){if(e===void 0)return()=>{};if(e.getElementById(st)!==null)return()=>{};let n=e.createElement("style");return n.id=st,n.textContent=ho,e.head.append(n),()=>{n.remove()}}var ct="dsh-better.layout-widths",te=Object.freeze({sidebar:null,rightbar:null});function ft(e){return typeof e=="number"&&Number.isFinite(e)&&e>0}function be(e){if(e===void 0)return te;let n;try{n=e.getItem(ct)}catch{return te}if(n===null||n==="")return te;let t;try{t=JSON.parse(n)}catch{return te}if(typeof t!="object"||t===null||Array.isArray(t))return te;let r=t;return{sidebar:lt(r.sidebar),rightbar:lt(r.rightbar)}}function pt(e,n){if(e===void 0)return;let t={};n.sidebar!==null&&(t.sidebar=Math.round(n.sidebar)),n.rightbar!==null&&(t.rightbar=Math.round(n.rightbar));try{e.setItem(ct,JSON.stringify(t))}catch{}}function lt(e){return ft(e)?Math.round(e):null}function mt(e){if(typeof e!="string")return te;let n=e.trim().split(/\s+/).filter(t=>t!=="");return{sidebar:ut(n[0]),rightbar:ut(n[2])}}function ut(e){if(e===void 0)return null;let n=/^([0-9]+(?:\.[0-9]+)?)px$/.exec(e);if(n===null)return null;let t=Number(n[1]);return ft(t)?Math.round(t):null}function gt(e,n,t=null){return t==="sidebar"?n.sidebar!==null&&n.sidebar!==e.sidebar?{sidebar:n.sidebar}:{}:t==="rightbar"?n.rightbar!==null&&n.rightbar!==e.rightbar?{rightbar:n.rightbar}:{}:n.sidebar!==null&&n.sidebar!==e.sidebar?{sidebar:n.sidebar}:n.rightbar!==null&&n.rightbar!==e.rightbar?{rightbar:n.rightbar}:{}}function ht(e,n){return{sidebar:n.sidebar??e.sidebar,rightbar:n.rightbar??e.rightbar}}function yt(e){let n=[];return e.sidebar!==null&&n.push({column:"sidebar",width:e.sidebar}),e.rightbar!==null&&n.push({column:"rightbar",width:e.rightbar}),n}var yo="[data-shell-bottom]",bo="[data-side]",ko='[class*="_sidebarCol"]',So='[class*="_rightbarCol"]',xo=600;function wo(e){let t=e?.layout?.panels;if(typeof t!="object"||t===null)return;let r=t;if(!(typeof r.setSidebar!="function"&&typeof r.setRightbar!="function"))return r}function St(e,n){let t=wo(e);if(t===void 0)return!1;let r=!1;for(let{column:o,width:i}of yt(n)){let a=o==="sidebar"?t.setSidebar:t.setRightbar;if(a!==void 0)try{a.call(t,i),r=!0}catch{}}return r}function bt(e){return e.querySelector(yo)?.parentElement??null}function vo(e,n){let t=e.hasAttribute("data-sidebar-collapsed"),r=e.hasAttribute("data-rightbar-collapsed"),o=mt(n?.getComputedStyle(e).gridTemplateColumns);return{sidebar:t?null:o.sidebar??kt(e.querySelector(ko)),rightbar:r?null:o.rightbar??kt(e.querySelector(So))}}function kt(e){if(e===null)return null;let n=e.getBoundingClientRect().width;return Number.isFinite(n)&&n>0?Math.round(n):null}function xt(e){let{document:n,storage:t}=e,r=null,o=null,i=0,a=!1,d=null,c=()=>n.defaultView,l=()=>(r!==null&&r.isConnected||(r=bt(n)),r),s=()=>{let g=l();return g===null?null:vo(g,c())},u=g=>{let k=g?.getAttribute("data-side");return k==="sidebar"||k==="rightbar"?k:null},f=g=>{let k=s();if(k===null)return;let R=gt(g.before,k,g.side);R.sidebar===void 0&&R.rightbar===void 0||pt(t,ht(be(t),R))},p=g=>{if(d!==null)return;let k=g.target,R=typeof k?.closest=="function"?k.closest(bo):null;if(R===null)return;let E=s();E!==null&&(d={side:u(R),before:E})},m=()=>{let g=d;if(d=null,g===null)return;let k=c()?.requestAnimationFrame;if(k===void 0){f(g);return}k.call(c(),()=>f(g))},h=()=>{if(o=null,a)return;let g=bt(n);if(g!==null){r=g;return}if(i>=xo)return;i+=1;let k=c()?.requestAnimationFrame;k!==void 0&&(o=k.call(c(),h))};return{attach(){a=!1,i=0;let g=c();return g?.addEventListener("pointerdown",p,!0),g?.addEventListener("pointerup",m,!0),g?.addEventListener("pointercancel",m,!0),h(),()=>{a=!0,d=null,r=null,g?.removeEventListener("pointerdown",p,!0),g?.removeEventListener("pointerup",m,!0),g?.removeEventListener("pointercancel",m,!0),o!==null&&g?.cancelAnimationFrame(o),o=null}}}}var wt="sessionCompaction";var vt="dsh-better-compaction",ke="dshBetter_compactionStat",Co=`
.${ke} {
  flex: none;
  display: inline-flex;
  align-items: center;
  order: 1;
  color: var(--dsw-alias-label-tertiary);
  font-size: var(--dsh-content-font-size-secondary, 13px);
  line-height: calc(20px + var(--dsh-content-font-delta-secondary, 0px));
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
  cursor: default;
}

[data-composer-dock]:has([data-workbench-dock="term-dock"]) .${ke} {
  margin-left: 12px;
}
`;function Ct(e){if(e===void 0)return()=>{};if(e.getElementById(vt)!==null)return()=>{};let n=e.createElement("style");return n.id=vt,n.textContent=Co,e.head.append(n),()=>{n.remove()}}var Et=require("react/jsx-runtime");function Lo(e,n){if(e===void 0||n===void 0)return null;let{compactions:t,failures:r}=e;if(!Number.isSafeInteger(t)||t<=0)return null;let o=t===1?n("compaction.readingOne"):n("compaction.reading",{count:t}),i=Number.isSafeInteger(r)&&r>0?n("compaction.tooltipWithFailures",{count:t,failures:r}):n("compaction.tooltip",{count:t});return{text:o,tooltip:i}}function Eo(){}function Lt({useProjection:e,t:n}){let r=Lo((e??Eo)(wt),n);return r===null?null:(0,Et.jsx)("span",{className:ke,"data-dsh-better":"compaction-stat",title:r.tooltip,children:r.text})}var We="conversation.composer.dock",Rt="better-compaction";var Ue=require("react");var Tt="continue",ze="conversation.chat.turnTail",At="better-continue";function Pt(e){return e.end?.reason?.kind!=="interrupted"?!1:e.latest&&!e.pending}var Ot="dsh-better-continue",re="dshBetter_continue",He="dshBetter_continueError",Ro=`
.${re} {
  align-self: flex-end;
  flex: none;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 12px;
  font: inherit;
  font-size: var(--dsh-content-font-size-secondary, 13px);
  line-height: calc(20px + var(--dsh-content-font-delta-secondary, 0px));
  color: var(--dsw-alias-label-secondary);
  background: transparent;
  border: 1px solid var(--dsw-alias-border-l2);
  border-radius: var(--dsw-radius-sm, 6px);
  cursor: pointer;
  white-space: nowrap;
  transition: background-color 120ms ease, color 120ms ease, border-color 120ms ease;
}

.${re}:hover:not(:disabled) {
  background: var(--dsw-alias-interactive-bg-hover);
  color: var(--dsw-alias-label-primary);
  border-color: var(--dsw-alias-border-l1);
}

.${re}:focus-visible {
  outline: 1px solid var(--dsw-alias-border-l1);
  outline-offset: 1px;
}

/* Disabled covers both halves of the pressed state: the request is in flight, so
   the button must not invite a second one, and the dimming is what says so. */
.${re}:disabled {
  cursor: default;
  opacity: 0.6;
}

/* The failure line sits under the button in the same column. It is a sibling
   rather than a wrapper so the button keeps its own alignment. */
.${He} {
  align-self: flex-end;
  color: var(--dsw-alias-state-business-primary);
  font-size: var(--dsh-content-font-size-secondary, 13px);
  line-height: calc(20px + var(--dsh-content-font-delta-secondary, 0px));
}
`;function It(e){if(e===void 0)return()=>{};if(e.getElementById(Ot)!==null)return()=>{};let n=e.createElement("style");return n.id=Ot,n.textContent=Ro,e.head.append(n),()=>{n.remove()}}var X=require("react/jsx-runtime");function To(e){return e instanceof Error?e.message:String(e)}function Ao(e,n){return e.length>0&&e[e.length-1]===n}function $e(){}function Nt({turn:e,sessionId:n,useChat:t,useSession:r,useInput:o,t:i,submitContinue:a}){let d=t??$e,c=r??$e,l=o??$e,s=d(C=>C),u=c(C=>C),f=l(C=>C),[p,m]=(0,Ue.useState)(!1),[h,g]=(0,Ue.useState)(null),k=e!==void 0&&Ao(s?.timeline.turnOrder??[],e.turn),R=(u?.pendingSubmissions?.length??0)>0||J(f?.phase);return e===void 0||n===void 0||a===void 0||i===void 0||!Pt({end:e.end?.data,latest:k,pending:R})?null:(0,X.jsxs)(X.Fragment,{children:[(0,X.jsx)("button",{type:"button",className:re,"data-testid":"better-continue",disabled:p,onClick:()=>{m(!0),g(null),a(n).catch(C=>{m(!1),g(To(C))})},children:i(p?"continue.sending":"continue.label")}),h===null?null:(0,X.jsx)("span",{className:He,role:"alert",children:h})]})}function Po(e){return typeof e=="object"&&e!==null&&"ok"in e&&e.ok===!1}async function Dt(e,n){let t=e.sessions?.binding?.(n)?.session,r=t?.prompt;if(typeof r!="function")throw new Error("\u8FD9\u4E2A\u5BBF\u4E3B\u7684\u4F1A\u8BDD\u4E0D\u652F\u6301\u53D1\u9001\u6D88\u606F");let o=await r.call(t,[{type:"text",text:Tt}],"queue");if(Po(o))throw new Error("\u7EE7\u7EED\u6D88\u606F\u6CA1\u6709\u88AB\u5BBF\u4E3B\u63A5\u53D7")}var ie=require("react");function Oo(e){let n=e.name.trim();return n===""?e.id:n}function je(e,n){if(e===void 0)return{model:n};let t=Oo(e.group),r=e.model.name.trim();return r===""?{model:t}:{provider:t,model:r}}function Mt(e,n){let t=je(e,n);return t.provider===void 0?t.model:`${t.provider} ${t.model}`}function Io(e){return typeof e=="string"?e:e.en??""}function Se(e,n){if(e!==void 0)try{return e(n)}catch{}return Io(n)}var F=require("react/jsx-runtime"),No="@deepseek-ai/dsh-client-ui-model-selection/ModelSelect.module.css";function Do(e){if(e===void 0)return;let t=e.querySelector(`style[data-plugin-css="${No}"]`)?.textContent??"",r=a=>new RegExp(`\\.(\\w+_${a})\\{`,"u").exec(t)?.[1],o={root:r("root"),trigger:r("trigger"),triggerIcon:r("triggerIcon"),triggerLabel:r("triggerLabel"),triggerEffort:r("triggerEffort"),chevron:r("chevron")};for(let a of Object.values(o))if(a===void 0)return;let i=r("badge");return{...o,...i===void 0?{}:{badge:i}}}function _t(e){let n=ye(e.load),t=Do(e.document);function r(o){let i=e.native();return o.available===!1||i===void 0||t===void 0?i===void 0?null:(0,F.jsx)(i,{...o}):(0,F.jsx)(Mo,{props:o,primitives:n,openPicker:e.openPicker,translate:e.translate,classes:t})}return r}function Mo({props:e,primitives:n,openPicker:t,translate:r,classes:o}){let{directory:i,t:a,sessionId:d,locked:c,resolveText:l}=e,s=_o(i),u=a??r(),f=s?.current??null,p=f===null&&s?.status==="loading",m=Fo(s,f),h=u?.("trigger.fallback")??"",g=Mt(m,h),k=je(m,h),R=Bo(m,l),E=p?u?.("trigger.loading")??"":g,C=Wo(s,f,m,u),z=C===void 0?E:`${E} \xB7 ${C}`,U=p?u?.("trigger.loading")??"":f===null?u?.("trigger.selectAria")??"":C===void 0?u?.("trigger.aria",{model:E})??"":u?.("trigger.ariaEffort",{model:E,effort:C})??"",j=()=>{t(d)},q=n.IconDataOutlineRegular,S=n.IconChevronDownOutlineRegular,A=n.Tag,M=o.badge;return(0,F.jsx)("div",{className:o.root,"data-dsh-better-seat":"",children:(0,F.jsxs)("button",{type:"button",className:o.trigger,"aria-label":U,"aria-haspopup":"dialog","aria-expanded":"false",title:z,disabled:c,onClick:j,children:[q===void 0?null:(0,F.jsx)(q,{className:o.triggerIcon,size:16}),(0,F.jsx)("span",{className:o.triggerLabel,"data-provider-id":f?.provider,"data-model-id":f?.model,children:p?E:(0,F.jsxs)(F.Fragment,{children:[k.provider===void 0?null:`${k.provider} `,R===void 0||M===void 0||A===void 0?null:(0,F.jsxs)(F.Fragment,{children:[(0,F.jsx)(A,{className:M,tone:R.tone,children:R.text})," "]}),k.model]})}),C!==void 0&&(0,F.jsx)("span",{className:o.triggerEffort,children:C}),S===void 0?null:(0,F.jsx)(S,{className:o.chevron})]})})}function _o(e){let n=(0,ie.useCallback)(r=>e===void 0?()=>{}:e.subscribe(r),[e]),t=(0,ie.useCallback)(()=>e?.getSnapshot(),[e]);return(0,ie.useSyncExternalStore)(n,t)}function Fo(e,n){if(!(e===void 0||n===null||n===void 0)){for(let t of e.groups)if(t.id===n.provider){for(let r of t.models)if(r.id===n.model)return{group:t,model:r}}}}function Bo(e,n){let t=e?.model.badge;if(t===void 0)return;let r=Se(n,t.text);if(r!=="")return{text:r,tone:t.tone}}function Wo(e,n,t,r){if(e===void 0||n===null||n===void 0)return;let o=t?.model.reasoning,i=n.reasoningEffort??o?.defaultEffort;return t===void 0?e.retainedEffort:o===void 0||i===void 0?void 0:o.efforts?.find(d=>d.id===i)?.name??i}function Ft(e){let r=e?.live?.contributions?.get("model")?.ui;return r==null?void 0:r.kind==="popupSelect"?r:void 0}function Bt(e){return{sessionId:e}}function Wt(){return{via:"enter",token:""}}var zo=`
[data-dsh-better-tabs] {
  display: flex;
  flex-direction: column;
  width: 100%;
  color: var(--dsw-alias-label-primary);
}
[data-dsh-better-tabs] [data-dsh-better-tabs-heading] {
  margin: 0;
  padding-bottom: 8px;
  font-size: 14px;
  line-height: 22px;
  font-weight: 500;
}
[data-dsh-better-tabs] [data-dsh-better-tabs-row] {
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  min-height: 52px;
  padding: 12px 0;
  border-bottom: 0.5px solid var(--dsw-alias-border-l2);
  font-size: 14px;
  line-height: 22px;
  cursor: pointer;
}
[data-dsh-better-tabs] [data-dsh-better-tabs-row]:last-of-type {
  border-bottom: none;
}
[data-dsh-better-tabs] [data-dsh-better-tabs-name] {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
[data-dsh-better-tabs] [data-dsh-better-tabs-check] {
  flex-shrink: 0;
  width: 16px;
  height: 16px;
  margin: 0;
  accent-color: var(--dsw-alias-state-business-primary);
  cursor: pointer;
}
[data-dsh-better-tabs] [data-dsh-better-tabs-empty] {
  margin: 0;
  padding-top: 4px;
  color: var(--dsw-alias-label-tertiary);
  font-size: 13px;
  line-height: 20px;
}
`,zt="dsh-better/tabs.css";function Ht(e){let n=`style[data-plugin-css=${JSON.stringify(zt)}]`;if(e.querySelector(n)!==null)return()=>{};let t=e.createElement("style");return t.dataset.plugin="dsh-better",t.dataset.pluginCss=zt,t.textContent=zo,e.head.append(t),()=>t.remove()}function $t(e){let n;return e.React.createElement("section",{"data-dsh-better-tabs":"",ref:t=>{if(n?.(),n=void 0,t===null)return;let r=()=>{Ho(t,e)};r(),n=e.controller.subscribe(r)}})}function Ho(e,n){let t=e.ownerDocument,{controller:r,copy:o}=n;e.replaceChildren();let i=t.createElement("h2");i.setAttribute("data-dsh-better-tabs-heading",""),i.textContent=o.heading,e.append(i);let a=r.rows();if(a.length===0){let d=t.createElement("p");d.setAttribute("data-dsh-better-tabs-empty",""),d.textContent=o.empty,e.append(d);return}for(let d of a){let c=t.createElement("label");c.setAttribute("data-dsh-better-tabs-row",d.id);let l=t.createElement("span");l.setAttribute("data-dsh-better-tabs-name",""),l.textContent=d.label;let s=t.createElement("input");s.setAttribute("data-dsh-better-tabs-check",d.id),s.type="checkbox",s.checked=d.enabled,s.setAttribute("aria-label",o.checkboxLabel(d.label,d.enabled)),s.addEventListener("change",()=>{r.setEnabled(d.id,s.checked)}),c.append(l,s),e.append(c)}}var qe="conversation.view",Ve="settings.section",jt="tabs";var we="chat",qt="dsh-better.tabs",ae="[data-conversation-tabs]";function Vt(e,n){if(typeof e=="string"&&e!=="")return e;if(typeof e=="function")try{let t=e();if(typeof t=="string"&&t!=="")return t}catch{}return n}function $o(e){if(e===void 0)return new Set;let n;try{n=e.getItem(qt)}catch{return new Set}if(n===null||n==="")return new Set;try{let t=JSON.parse(n);if(!Array.isArray(t))return new Set;let r=new Set;for(let o of t)typeof o=="string"&&o!==""&&o!==we&&r.add(o);return r}catch{return new Set}}function Uo(e,n){if(e!==void 0)try{e.setItem(qt,JSON.stringify([...n].sort()))}catch{}}function jo(e,n){let t=[],r=new Set;for(let o of e){let i=o.options.id;i===void 0||i===we||r.has(i)||(r.add(i),t.push({id:i,label:Vt(o.options.label,i),enabled:!n.has(i)}))}return t}function qo(e){let n=[],t=new Set;for(let r of e){let o=r.options.id;o===void 0||o===we||t.has(o)||(t.add(o),n.push({id:o,label:Vt(r.options.label,o)}))}return n}function Vo(e,n,t){let r=new Set;for(let o of qo(e)){if(!n.has(o.id)||o.label==="")continue;t.filter(a=>a.label===o.label).length===1&&r.add(o.label)}return t.map(o=>r.has(o.label))}function Go(e,n){for(let t of e)if(n!==null&&(t.target===n||n.contains?.(t.target)===!0)||Ut(t.addedNodes,n)||Ut(t.removedNodes,n))return!0;return!1}function Ut(e,n){if(e===void 0)return!1;for(let t=0;t<e.length;t+=1){let r=e[t];if(r!==void 0&&(r.matches?.(ae)===!0||r.querySelector?.(ae)!=null||n!==null&&r.contains?.(n)===!0))return!0}return!1}function Ko(e){let n=e.querySelector(ae);if(n===null||typeof n!="object")return;let r=n.querySelectorAll?.(":scope > button[role='tab']");if(r===void 0)return;let o=[];for(let i=0;i<r.length;i+=1){let a=r[i];a!==void 0&&o.push({label:Yo(a),hidden:a.hasAttribute(xe),mark:d=>{d?a.setAttribute(xe,""):a.removeAttribute(xe)}})}return o}function Yo(e){return(e.querySelector?.("[class*='tabLabel']")?.textContent??e.textContent??"").trim()}function Jo(e,n){let t=!1;for(let[r,o]of e.entries()){let i=n[r]??!1;i!==o.hidden&&(o.mark(i),t=!0)}return t}function Gt(e){let{ledger:n,storage:t}=e,r=e.readButtons??Ko,o=e.watch??Qo,i=new Set($o(t)),a=new Set,d,c=()=>{for(let s of[...a])s()},l=30;return{rows:()=>jo(n.entriesOfSlot(qe),i),setEnabled(s,u){if(s===we)return!1;let f=i.has(s);return u===!f?!1:(u?i.delete(s):i.add(s),Uo(t,i),d?.(),c(),!0)},subscribe(s){return a.add(s),()=>{a.delete(s)}},attach(s){let u=s.createElement("style");u.dataset.plugin="dsh-better",u.dataset.pluginCss=Xo,u.textContent=Zo,s.head.append(u);let f=s.defaultView?.requestAnimationFrame?.bind(s.defaultView),p=s.defaultView?.cancelAnimationFrame?.bind(s.defaultView),m=f===void 0?0:l,h,g=()=>{let E=n.entriesOfSlot(qe),C=r(s);if(C===void 0||C.length===0){m>0&&f!==void 0&&(m-=1,h=f(()=>g()));return}m=l,h=void 0,Jo(C,Vo(E,i,C))},k=n.subscribe(qe,g),R=o(s,g);return d=g,g(),()=>{k(),R(),d=void 0,h!==void 0&&p?.(h),u.remove()}}}}var Xo="dsh-better/strip.css",xe="data-dsh-better-tab-hidden",Zo=`${ae} > button[${xe}] { display: none; }`;function Qo(e,n){let t=e.defaultView?.MutationObserver,r=e.documentElement;if(t===void 0||r===void 0)return()=>{};let o=new t(i=>{let a=e.querySelector(ae);Go(i,a!==null&&typeof a=="object"?a:null)&&n()});return o.observe(r,{childList:!0,subtree:!0}),()=>o.disconnect()}var Z="conversation.input.overlay",Kt="settings.section",ri="aliases",oi=56,ii="alias-watcher",Jt=50,ai="skill-enhancer",si=Jt+1,Ge="conversation.input.model",Ke="conversation.input.attachments",di=-50,li=-60,Xt="command-popup",ui=-100,W="better",ci="/better/api/skill-profile",fi=5e3,ve=null;function Zt(e,n){let t,r=Number.POSITIVE_INFINITY;for(let o of e){if(o.options.id!==Xt)continue;let i=o.component;if(typeof i!="function"||n!==void 0&&i===n)continue;let a=o.options.priority??0;a<r&&(t=i,r=a)}return t}var Qt={name:"dsh-better",inject:["slots","sessions","commandUi","conversation","locale","modelDirectories","remote","remote.session"],apply(e){let n=globalThis.document;e.effect(()=>e.locale.register(W,at),"dsh-better: locale"),e.effect(()=>dt(n),"dsh-better: effort badge stylesheet"),e.effect(()=>Ct(n),"dsh-better: compaction count stylesheet"),e.effect(()=>It(n),"dsh-better: continue button stylesheet");let t=en(Je()),r=Ci(e),o={open:!1};e.effect(()=>{let l=Je(),s=be(l);e.inject?.(["layout"],p=>{St(p,s)});let f=(n===void 0?void 0:xt({document:n,storage:l}))?.attach();return()=>{f?.()}},"dsh-better: panel width memory"),e.effect(()=>e.slots.inject(We,()=>e.slots.register({name:We,id:Rt,order:-1,locale:W},Lt)),"dsh-better: compaction count"),e.effect(()=>e.slots.inject(ze,()=>Ye(e.slots,{name:ze,id:At,order:20,locale:W,inject:l=>({submitContinue:s=>Dt(e,s)})},Nt)),"dsh-better: continue button"),e.effect(()=>e.slots.inject(Z,()=>{let l={},u=Gn({load:ve,native:()=>Zt(e.slots.entries(Z),l.component),document:n});return l.component=u,e.slots.register({name:Z,id:Xt,priority:ui,locale:W,inject:f=>{let p=bi(e,f);return{popup:yi(e,f),catalog:p?.groups,current:p?.current??null,selectModel:m=>e.modelDirectories?.directoryFor?.(f)?.select?.(m)}}},u)}),"dsh-better: /model provider search"),e.effect(()=>e.slots.inject(Ge,()=>{let l={},u=_t({load:ve,native:()=>Xe(e.slots.entries(Ge),l.component),openPicker:f=>gi(e,f),translate:()=>hi(e),document:n});return l.component=u,e.slots.register({name:Ge,priority:di,locale:W,inject:f=>{let p=e.modelDirectories?.directoryFor?.(f),m=e.locale.resolveText;return{sessionId:f,available:!0,directory:p?.store,load:()=>{p?.load?.()},select:h=>p?.select?.(h),resolveText:h=>Se(m?.bind(e.locale),h),renderSlot:(h,g,k)=>k?.fallback??null}}},u)}),"dsh-better: composer model trigger");let i;e.inject?.(["remote.workspaceFiles"],l=>{i=l["remote.workspaceFiles"],l.effect(()=>()=>{i=void 0},"dsh-better: workspace file reader")}),e.effect(()=>e.slots.inject(Ke,()=>{let l={},u=et({native:()=>Xe(e.slots.entries(Ke),l.component),pathOf:ki,reader:()=>i,translate:()=>e.locale.bind?.(W)});return l.component=u,e.slots.register({name:Ke,priority:li,locale:W,inject:f=>({sessionId:f,readFileDrag:pi(e),phase:()=>mi(e,f)?.getSnapshot().phase})},u)}),"dsh-better: composer attachment selection");let a;e.inject?.(["inputTriggers"],l=>{a=l.inputTriggers,l.effect(()=>()=>{a=void 0},"dsh-better: alias trigger service"),l.effect(()=>l.inputTriggers.registerSource(cn({config:()=>t.getSnapshot(),translate:r,bareMenuOpen:()=>o.open,routeCommand:(s,u)=>vi(e,u)})),"dsh-better: alias slash source")}),e.effect(()=>e.slots.inject(Z,()=>{let l=hn({store:t,bareMenuOpen:o,inputStoreFor:s=>{let u=e.sessions.scope?.(s);if(!(u===void 0||e.conversation===void 0))try{return e.conversation.input?.for?.(u)?.state}catch{return}},controllerFor:s=>{let u=e.sessions.scope?.(s);if(u===void 0)return;let f=se(e,"inputTriggers")??a;if(f!==void 0)try{return f.sessionOf(u)}catch{return}}});return Ye(e.slots,{name:Z,id:ii,order:Jt,inject:s=>({sessionId:s})},l)}),"dsh-better: alias selector watcher"),e.effect(()=>Nn(n),"dsh-better: skill enhancer stylesheet");let d=Si(e);e.effect(()=>e.slots.inject(Z,()=>{let l=On({scopeFor:s=>e.sessions.scope?.(s),inputStoreFor:s=>{let u=e.sessions.scope?.(s);if(!(u===void 0||e.conversation===void 0))try{return e.conversation.input?.for?.(u)?.state}catch{return}},actionsFor:s=>{let u=e.sessions.scope?.(s);if(!(u===void 0||e.conversation===void 0))try{return e.conversation.input?.for?.(u)}catch{return}},skillNamesFor:d.names,loadProfile:async(s,u)=>xi(e,s,u,await d.pathOf(s,u)),loadUsage:(s,u)=>er(e,s,u),translate:r,document:n});return Ye(e.slots,{name:Z,id:ai,order:si,inject:s=>({sessionId:s})},l)}),"dsh-better: skill enhancer"),e.effect(()=>e.slots.inject(Kt,()=>{let l=n===void 0?void 0:pn(n),s=un({store:t,translate:r}),u=Yt(e.slots,{name:Kt,id:ri,order:oi,label:()=>e.locale.bind?.(W)?.("alias.nav")??"Skill aliases",locale:W},s);return()=>{u(),l?.()}}),"dsh-better: alias settings page");let c=Gt({ledger:wi(e.slots),storage:Je()});e.effect(()=>e.slots.inject(Ve,()=>{let l=globalThis.document,s=l===void 0?void 0:Ht(l),u=Yt(e.slots,{name:Ve,id:jt,order:55,label:()=>e.locale.bind?.(W)?.("tabs.nav")??"Tabs"},()=>{let f=Li(ve);return f===null?null:$t({React:f,controller:c,copy:Ei(e)})});return()=>{u(),s?.()}}),"dsh-better: tab management"),e.effect(()=>c.attach(n),"dsh-better: tab visibility"),e.inject?.(["shortcuts"],l=>{l.effect(()=>it(l.shortcuts,{currentSessionId:()=>rt(e),composerMounted:()=>tt(n),focusComposer:s=>ot(e,s)},()=>e.locale.bind?.(W)?.(oe)??"Focus message input",s=>console.warn(`dsh-better: focus command not registered (${s})`)),"dsh-better: focus composer shortcut")})}};function pi(e){return n=>se(e,"fileDrag")?.read?.(n)}function mi(e,n){if(n===void 0)return;let t=e.sessions.scope?.(n);if(!(t===void 0||e.conversation===void 0))try{return e.conversation.input?.for?.(t)?.state}catch{return}}function Xe(e,n){let t,r=Number.POSITIVE_INFINITY;for(let o of e){let i=o.component;if(typeof i!="function"||n!==void 0&&i===n)continue;let a=o.options.priority??0;a<r&&(t=i,r=a)}return t}function gi(e,n){if(n===void 0)return!1;let t=Ft(e.commandUi);if(t===void 0)return!1;let r=e.sessions.scope?.(n);if(r===void 0)return!1;let o=e.commandUi.popupFor?.(r);return o===void 0||typeof o.open!="function"?!1:(o.open("model",t,Bt(n),Wt()),!0)}function hi(e){return e.locale?.bind?.(W)}function yi(e,n){let t=e.sessions.scope?.(n);if(t!==void 0)return e.commandUi.popupFor?.(t)}function bi(e,n){return e.modelDirectories?.directoryFor?.(n)?.store.getSnapshot()}function ki(e){let n=globalThis.__DSH_HOST_PATHS__;if(n?.pathFor===void 0)return"";try{let t=n.pathFor(e);return typeof t=="string"?t:""}catch{return""}}function Yt(e,n,t){return(e.registerUntyped??e.register).call(e,n,t)}function Ye(e,n,t){return(e.registerUntyped??e.register).call(e,n,t)}function Si(e){let n=new Map,t=new Map,r=async o=>{let i=n.get(o);if(i!==void 0)return i;let a=t.get(o);if(a!==void 0&&Date.now()-a<fi)return;let d=se(e,"remote.skills");if(d!==void 0)try{let c=await d.list({sessionId:o});if(!c.ok){t.set(o,Date.now());return}let l=new Map(c.value.skills.map(s=>[s.name,s]));return n.set(o,l),t.delete(o),l}catch{t.set(o,Date.now());return}};return{names:async o=>new Set((await r(o))?.keys()??[]),pathOf:async(o,i)=>(await r(o))?.get(i)?.path}}async function xi(e,n,t,r){let o=`?sessionId=${encodeURIComponent(n)}&name=${encodeURIComponent(t)}`+(r===void 0?"":`&path=${encodeURIComponent(r)}`);try{let i=await fetch(`${ci}${o}`,{headers:{accept:"application/json"}});return i.ok?await i.json():void 0}catch{return}}function er(e,n,t){let r=e.sessions.list??se(e,"sessions.list");try{let o=r?.getSnapshot?.(),i=u=>{let p=o?.projectionsBySession?.[u]?.values?.skillUsage;if(typeof p!="object"||p===null)return;let m=p.counts;return typeof m=="object"&&m!==null?m:void 0},a=i(n)?.[t],d=typeof a=="number"&&Number.isFinite(a)?a:0,c=o?.byId?.[n]?.cwd;if(typeof c!="string"||c==="")return{session:d};let l=Object.keys(o?.byId??{}).map(u=>{let f=i(u),p=o?.byId?.[u]?.cwd;return{...typeof p=="string"?{cwd:p}:{},...f===void 0?{}:{usage:f}}}),s=Dn(l,c,t);return s===void 0?{session:d}:{session:d,workspace:s}}catch{return{session:0}}}function wi(e){return{entriesOfSlot:n=>(e.entriesOfSlot??e.entries).call(e,n),subscribe:(n,t)=>e.subscribe?.(n,t)??(()=>{})}}function Je(){try{return globalThis.localStorage}catch{return}}function se(e,n){try{return typeof e.get=="function"?e.get(n):e[n]}catch{return}}function vi(e,n){let t=n.session?.sessionId;if(t===void 0)return;let r=e.sessions.scope?.(t);if(r===void 0)return;let o=se(e,"inputTriggers");if(o!==void 0)try{let i=o.sessionOf(r),a=e.conversation?.input?.for?.(r)?.state,d=0,c=()=>{let l=a?.getSnapshot();if(!(l===void 0||l.draft.trim()===""||!l.draft.startsWith("/"))){try{let s=l.draft.trimStart().split(/\s/u)[0]??"";if(!s.startsWith("/")||(i.track?.(s,s.length,{tier:"plain"},l.draftRev),i.onSpace?.()===!0))return;i.dismiss?.()}catch{}d+=1,d<4&&setTimeout(c,25)}};setTimeout(c,0)}catch{}}function Ci(e){return(n,t)=>{try{return e.locale.bind?.(W)?.(n,t)??n}catch{return n}}}function Li(e){if(e===null)return null;try{let n=e("react");if(typeof n!="object"||n===null)return null;let t=n;return typeof t.createElement=="function"?t:null}catch{return null}}function Ei(e){let n=e.locale.bind?.(W),t=(r,o)=>n?.(r)??o;return{heading:t("tabs.heading","Tabs"),empty:t("tabs.empty","No plugin has registered a conversation tab yet."),checkboxLabel:(r,o)=>t(o?"tabs.hide":"tabs.show","{label}").replace("{label}",r)}}function Ri(e){ve=e}var Ti=Qt;

    // Hand the loader's `require` to the module's `boot` export before the
    // plugin mounts. Read from `module.exports` rather than the default export:
    // esbuild emits named exports there and the plugin object separately, so the
    // default export alone never carries `boot`.
    if (typeof module.exports.boot === "function") module.exports.boot(require);
    return module.exports.default ?? module.exports;
  }
});
