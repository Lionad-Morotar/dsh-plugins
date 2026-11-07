window.__ModuleLoader__.load({
  id: "dsh-better",
  factory: (require) => {
    var module = { exports: {} };
    var exports = module.exports;
"use strict";var Ee=Object.defineProperty;var tr=Object.getOwnPropertyDescriptor;var rr=Object.getOwnPropertyNames;var or=Object.prototype.hasOwnProperty;var ir=(e,n)=>{for(var t in n)Ee(e,t,{get:n[t],enumerable:!0})},ar=(e,n,t,r)=>{if(n&&typeof n=="object"||typeof n=="function")for(let o of rr(n))!or.call(e,o)&&o!==t&&Ee(e,o,{get:()=>n[o],enumerable:!(r=tr(n,o))||r.enumerable});return e};var sr=e=>ar(Ee({},"__esModule",{value:!0}),e);var Oi={};ir(Oi,{boot:()=>Ai,clientPlugin:()=>er,default:()=>Pi,findShadowed:()=>Qt,findShadowedSingle:()=>Xe,readSkillUsage:()=>nr});module.exports=sr(Oi);var ce=require("react");var Qe="dsh-better.skill-aliases";var ee=Object.freeze({prefix:!0,rows:Object.freeze([])});function dr(e,n){if(e!==void 0)try{e.setItem(Qe,JSON.stringify({v:1,prefix:n.prefix,rows:n.rows}))}catch{}}function ue(e,n){return typeof e=="string"?e:n}function lr(e,n){if(typeof e!="object"||e===null||Array.isArray(e))return;let t=e;if(!(typeof t.keyword!="string"&&typeof t.target!="string"&&typeof t.params!="string"))return{id:ue(t.id,`alias-${n}`)||`alias-${n}`,keyword:ue(t.keyword,""),target:ue(t.target,""),params:ue(t.params,"")}}function ur(e){if(typeof e!="object"||e===null||Array.isArray(e))return ee;let n=e,t=typeof n.prefix=="boolean"?n.prefix:ee.prefix,r=Array.isArray(n.rows)?n.rows:[],o=[],i=new Set;for(let[a,d]of r.slice(0,200).entries()){let c=lr(d,a);if(c===void 0)continue;let l=c.id,s=0;for(;i.has(l);)s+=1,l=`alias-${a}-${s}`;i.add(l),o.push({...c,id:l})}return{prefix:t,rows:o}}function cr(e){if(e===void 0)return ee;let n;try{n=e.getItem(Qe)}catch{return ee}if(n===null||n==="")return ee;try{return ur(JSON.parse(n))}catch{return ee}}function fr(){let e=globalThis.crypto;return e?.randomUUID!==void 0?e.randomUUID():`alias-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,8)}`}function en(e,n=fr){let t=cr(e),r=new Set,o=i=>{t=i;for(let a of[...r])try{a()}catch(d){console.error("[dsh-better] alias store listener failed:",d)}dr(e,i)};return{getSnapshot:()=>t,subscribe(i){return r.add(i),()=>{r.delete(i)}},setPrefix(i){t.prefix!==i&&o({...t,prefix:i})},addRow(){let i=n();return o({...t,rows:[...t.rows,{id:i,keyword:"",target:"",params:""}]}),i},updateRow(i,a){let d=!1,c=t.rows.map(l=>{if(l.id!==i)return l;let s={...l,...a,id:l.id};return d=s.keyword!==l.keyword||s.target!==l.target||s.params!==l.params,s});d&&o({...t,rows:c})},removeRow(i){let a=t.rows.filter(d=>d.id!==i);a.length!==t.rows.length&&o({...t,rows:a})}}}function nn(e){return e.keyword.trim()!==""&&e.target.trim()!==""}function tn(e){return e.keyword.trim().replace(/^\/+/,"").toLowerCase()}function rn(e,n){let t=n.trim().replace(/^\/+/,"").toLowerCase();return t===""?[]:e.rows.filter(r=>nn(r)&&tn(r)===t)}function on(e,n,t=!1){let r=n.trim().replace(/^\/+/,"").toLowerCase(),o=e.rows.filter(nn);if(r==="")return t?o:[];let i=[],a=[],d=[];for(let c of o){let l=tn(c);l===r?i.push(c):l.startsWith(r)?a.push(c):l.includes(r)&&d.push(c)}return[...i,...a,...d]}function an(e){let n=e.target.trim().replace(/^\/+/,"");if(n==="")return"";let t=e.params.trim();return t===""?`/${n} `:`/${n} ${t} `}function sn(e,n){let t=/^\/([^\s/]+)([ \t]*)$/u.exec(n);if(t===null)return;let r=t[1]??"",o=rn(e,r);if(o.length!==0)return{query:r,start:0,end:n.length,rows:o}}function dn(e,n){let t=/^([^\s/]+)([ \t]*)$/u.exec(n);if(t===null)return;let r=t[1]??"",o=rn(e,r);if(o.length!==0)return{query:r,start:0,end:n.length,rows:o}}function ln(e){if(e.keyword.trim()==="")return"keyword";if(e.target.trim()==="")return"target";if(/\s/.test(e.keyword.trim()))return"keyword"}var w=require("react/jsx-runtime");function pr(e){let{row:n,store:t,t:r}=e,o=ln(n);return(0,w.jsxs)("tr",{"data-testid":"alias-row","data-row-id":n.id,"data-incomplete":o===void 0?void 0:"",children:[(0,w.jsx)("td",{children:(0,w.jsx)("input",{className:"dsh-better-alias-input","data-testid":"alias-keyword",value:n.keyword,placeholder:"wf",spellCheck:!1,autoComplete:"off","aria-label":r("alias.table.keyword"),ref:i=>{i!==null&&e.focus&&(i.focus(),e.clearFocus())},onChange:i=>t.updateRow(n.id,{keyword:i.target.value})})}),(0,w.jsx)("td",{children:(0,w.jsx)("input",{className:"dsh-better-alias-input","data-testid":"alias-target",value:n.target,placeholder:"flow-workflow",spellCheck:!1,autoComplete:"off","aria-label":r("alias.table.target"),onChange:i=>t.updateRow(n.id,{target:i.target.value})})}),(0,w.jsx)("td",{children:(0,w.jsx)("input",{className:"dsh-better-alias-input","data-testid":"alias-params",value:n.params,placeholder:r("alias.table.paramsPlaceholder"),spellCheck:!1,autoComplete:"off","aria-label":r("alias.table.params"),onChange:i=>t.updateRow(n.id,{params:i.target.value})})}),(0,w.jsx)("td",{className:"dsh-better-alias-actions",children:(0,w.jsx)("button",{type:"button",className:"dsh-better-alias-delete","data-testid":"alias-remove","aria-label":r("alias.remove",{keyword:n.keyword.trim()||r("alias.unnamed")}),title:r("alias.remove",{keyword:n.keyword.trim()||r("alias.unnamed")}),onClick:()=>t.removeRow(n.id),children:"\xD7"})})]})}function un(e){function n(){let t=(0,ce.useSyncExternalStore)(e.store.subscribe,e.store.getSnapshot,e.store.getSnapshot),{translate:r}=e,o=(0,ce.useRef)(null),i=()=>{o.current=e.store.addRow()};return(0,w.jsxs)("section",{className:"dsh-better-alias-page","data-testid":"alias-page",children:[(0,w.jsx)("h2",{className:"dsh-better-alias-heading",children:r("alias.heading")}),(0,w.jsxs)("label",{className:"dsh-better-alias-prefix",children:[(0,w.jsxs)("span",{children:[(0,w.jsx)("span",{className:"dsh-better-alias-prefix-title",children:r("alias.prefix.title")}),(0,w.jsx)("span",{className:"dsh-better-alias-prefix-hint",children:r(t.prefix?"alias.prefix.on":"alias.prefix.off")})]}),(0,w.jsx)("input",{type:"checkbox","data-testid":"alias-prefix",checked:t.prefix,"aria-label":r("alias.prefix.title"),onChange:a=>e.store.setPrefix(a.target.checked)})]}),(0,w.jsxs)("div",{className:"dsh-better-alias-table-wrap",children:[(0,w.jsxs)("table",{className:"dsh-better-alias-table",children:[(0,w.jsx)("thead",{children:(0,w.jsxs)("tr",{children:[(0,w.jsx)("th",{scope:"col",children:r("alias.table.keyword")}),(0,w.jsx)("th",{scope:"col",children:r("alias.table.target")}),(0,w.jsx)("th",{scope:"col",children:r("alias.table.params")}),(0,w.jsx)("th",{scope:"col","aria-label":r("alias.table.actions")})]})}),(0,w.jsx)("tbody",{children:t.rows.map(a=>(0,w.jsx)(pr,{row:a,store:e.store,t:r,focus:o.current===a.id,clearFocus:()=>{o.current=null}},a.id))})]}),t.rows.length===0?(0,w.jsx)("p",{className:"dsh-better-alias-empty","data-testid":"alias-empty",children:r("alias.empty")}):null]}),(0,w.jsx)("button",{type:"button",className:"dsh-better-alias-add","data-testid":"alias-add",onClick:i,children:r("alias.add")}),(0,w.jsx)("p",{className:"dsh-better-alias-footnote",children:r("alias.footnote")})]})}return n}var Re="alias",mr="/",gr=-1;function hr(e,n){let t=e.target.trim().replace(/^\/+/,""),r=e.keyword.trim(),o=e.params.trim();return{name:t,label:r,...o===""?{}:{description:n("alias.menu.params",{value:o})},section:n("alias.menu.section"),value:e.id}}function cn(e){return{trigger:mr,name:Re,order:gr,async candidates(n,t){if(t.position!=="leading")return[];let r=e.config();return!r.prefix&&e.bareMenuOpen?.()!==!0?[]:on(r,t.query,!0).map(o=>hr(o,e.translate))},onPick(n){let t=e.config().rows.find(i=>i.id===n.candidate.value);if(t===void 0)return;let r=t.target.trim().replace(/^\/+/,"");r!==""&&e.routeCommand?.(r,n);let o=an(t);return o===""?void 0:{text:o}}}}var fn="dsh-better/aliases.css",yr=`
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
`;function pn(e){let n=`style[data-plugin-css=${JSON.stringify(fn)}]`;if(e.querySelector(n)!==null)return()=>{};let t=e.createElement("style");return t.dataset.plugin="dsh-better",t.dataset.pluginCss=fn,t.textContent=yr,e.head.append(t),()=>t.remove()}var Y=require("react");var mn={draft:"",draftRev:-1,phase:"plain"};function hn(e){return function(t){let r=(0,Y.useSyncExternalStore)(e.store.subscribe,e.store.getSnapshot,e.store.getSnapshot),o=t.sessionId===void 0?void 0:e.inputStoreFor(t.sessionId),i=t.sessionId===void 0?void 0:e.controllerFor(t.sessionId),a=(0,Y.useSyncExternalStore)(c=>o===void 0?()=>{}:o.subscribe(c),()=>o===void 0?mn:o.getSnapshot(),()=>o===void 0?mn:o.getSnapshot()),d=(0,Y.useRef)(null);return(0,Y.useEffect)(()=>{let c=t.sessionId;if(c===void 0||a.phase!=="plain"||i===void 0)return;let l=i.menu.getSnapshot().open;if(l&&d.current===null)return;let s=Te(r,a.draft);if(l){let f=d.current;if(f!==null&&(f.draftRev!==a.draftRev||f.spanEnd!==(s?.end??-1))){let p=setTimeout(()=>{let m=o?.getSnapshot()??a,h=e.controllerFor(c);if(h===void 0||m.phase!=="plain")return;d.current=null,h.dismiss();let g=Te(e.store.getSnapshot(),m.draft);g!==void 0&&(e.bareMenuOpen.open=!0,gn(h,g,m.draftRev),e.bareMenuOpen.open=!1,d.current={draftRev:m.draftRev,spanEnd:g.end})},80);return()=>clearTimeout(p)}return}if(d.current=null,s===void 0)return;let u=setTimeout(()=>{let f=o?.getSnapshot()??a,p=e.controllerFor(c);if(p===void 0||f.phase!=="plain"||p.menu.getSnapshot().open)return;let m=Te(e.store.getSnapshot(),f.draft);m!==void 0&&(e.bareMenuOpen.open=!0,gn(p,m,f.draftRev),e.bareMenuOpen.open=!1,d.current={draftRev:f.draftRev,spanEnd:m.end})},80);return()=>clearTimeout(u)},[r,a.draft,a.draftRev,a.phase,i,o,t.sessionId]),null}}function Te(e,n){return e.prefix?sn(e,n):dn(e,n)}function gn(e,n,t){e.toggleSource(Re,{trigger:"/",query:n.query,quoted:!1,position:"leading",span:{start:n.start,end:n.end,draftRev:t}})}function J(e){return e!==void 0&&e!=="plain"}var v=require("react");var br="[a-z0-9]+(?:-[a-z0-9]+)*",kr=new RegExp(`^/(${br})(?=\\s|$)`,"u");function fe(e,n){let t=kr.exec(e);if(t===null)return;let r=t[1]??"";if(n(r))return{name:r,start:0,end:1+r.length}}function yn(e,n,t){return e===void 0||!Number.isInteger(t)||t<e.end||t>n.length||t!==n.length?!1:/^[ \t]*$/u.test(n.slice(e.end,t))}var Sr=/\s/u;function kn(e,n){let t=fe(e,n);if(t===void 0)return;let r=e.length-1;for(;r>=0&&!Sr.test(e.charAt(r));)r-=1;let o=r+1,i=e.slice(o);if(!(i.length<2||!i.startsWith("--")))return{name:t.name,query:i,start:o}}function Sn(e,n){let t=n.slice(2).toLowerCase();return e.filter(r=>r.flag.startsWith("--")?r.flag.slice(2).toLowerCase().startsWith(t):!1)}function bn(e,n){let t=0;for(let r of n){let o=r.offset+r.length;if(e>=r.offset&&e<o)return;o<=e&&(t+=r.length-1)}return e-t}function wn(e,n,t,r){let o=bn(t.start,n);if(o===void 0)return;let i=bn(e.length,n);if(i!==void 0)return{start:o,end:i,draftRev:r}}function xn(e){return`${e} `}function wr(e){let n=e.occurrences;if(!Array.isArray(n))return[];let t=[];for(let r of n){if(typeof r!="object"||r===null)continue;let o=r;typeof o.offset!="number"||typeof o.length!="number"||t.push({offset:o.offset,length:o.length})}return t}var xr=/^\/([a-z0-9]+(?:-[a-z0-9]+)*)[ \t]*$/u,vr=400,vn=200,Cn=6,Cr=240,Ln={draft:"",draftRev:-1,phase:"plain"};function Lr(e,n){return`${e!==""&&!/\s$/u.test(e)?" ":""}${n} `}function Rn(e){return e===void 0?void 0:xr.exec(e)?.[1]}function Er(e){return e===void 0?[]:e.split(`
`).map(n=>n.trim()).filter(n=>n!=="")}var Pe=240,Oe=640;function Tn(e){return!Number.isFinite(e)||e<=0?Oe:Math.max(Pe,Math.min(Oe,e-24))}function Rr(e,n){let t=Tn(n),r=Number.isFinite(e)&&e>0?e:0,o=r===0?Pe:r<=80?320:r<200?480:Oe;return Math.min(Math.max(o,Pe),t)}function An(e,n,t,r){if(!Number.isFinite(t)||t<=0)return e;let o=t-n-r;return Math.max(r,Math.min(e,Math.max(r,o)))}function Tr(e,n,t){if(t<=0||typeof e.createRange!="function")return;let r=e.createRange(),o=t,i=!1,a=c=>{for(let l of Array.from(c.childNodes)){if(l.nodeType===3){let s=l.textContent??"",u=Math.min(o,s.length);if(u<=0)continue;if(i||(r.setStart(l,0),i=!0),r.setEnd(l,u),o-=u,o<=0)return!0;continue}if(a(l))return!0}return!1};if(!a(n)||o>0)return;let d=r.getBoundingClientRect();if(!(d.width===0&&d.height===0))return{left:d.left,right:d.right,top:d.top,bottom:d.bottom}}function En(e,n){let t=e.querySelectorAll("[data-composer-text-ref]");for(let r of t){if(Rn(r.textContent??"")!==n)continue;let o=Tr(e,r,n.length+1);if(o!==void 0)return o;let i=r.getBoundingClientRect();return{left:i.left,right:i.right,top:i.top,bottom:i.bottom}}}function me(e){return e.defaultView?.innerWidth??0}function Pn(e,n,t,r){let o=e.top-r,i=Number.isFinite(t)&&t>0?t:0;return i===0||i<=o?{left:e.left,top:0,anchor:"above"}:{left:e.left,top:e.bottom+r,anchor:"below"}}function pe(e){return e.defaultView?.innerHeight??0}function Ar(e){let n=typeof e.getSelection=="function"?e.getSelection():null,t=n?.anchorNode;if(t!=null){let d=(t.nodeType===1?t:t.parentElement)?.closest("[data-composer-text-ref]");if(d!=null){let c=n?.getRangeAt===void 0||n.rangeCount===0?void 0:n.getRangeAt(0).getBoundingClientRect();if(c!==void 0&&c.height>0)return{left:c.left,right:c.left,top:c.top,bottom:c.bottom}}}let r=e.querySelectorAll("[data-composer-text-ref]"),o=r[r.length-1];if(o===void 0)return;let i=o.getBoundingClientRect();if(!(i.width===0&&i.height===0))return{left:i.left,right:i.right,top:i.top,bottom:i.bottom}}function Pr(e,n){let t=e.createElement("div");t.className="dsh-better-skill-params";let r=e.createElement("div");if(r.className="dsh-better-skill-params-title",r.textContent=`/${n.name}`,t.append(r),n.getActions()?.insertText!==void 0)for(let o of n.params)t.append(Ir(e,n,o.flag,o.detail));return t.style.width=`${On(e)}px`,t}function On(e){return Math.min(320,Tn(me(e)))}function Or(e,n,t){if(t===void 0)return;let r=4,o=me(e),i=On(e);n.style.width=`${i}px`;let a=Pn(t,pe(e),n.offsetHeight,r);n.style.left=`${An(a.left,i,o,12)}px`,a.anchor==="above"?(n.style.bottom=`${pe(e)-t.top+r}px`,n.style.top=""):(n.style.top=`${a.top}px`,n.style.bottom="")}function Ir(e,n,t,r){let o=e.createElement("button");o.type="button",o.className="dsh-better-skill-panel-param",o.addEventListener("pointerdown",a=>a.preventDefault());let i=e.createElement("span");if(i.className="dsh-better-skill-panel-param-flag",i.textContent=t,o.append(i),r!==""){let a=e.createElement("span");a.className="dsh-better-skill-panel-param-detail",a.textContent=r,o.append(a)}return o.addEventListener("click",()=>{let a=n.getActions(),d=a?.captureInsertion?.();if(a?.insertText===void 0||d===void 0)return;let c=wn(n.getDraft(),n.getOccurrences(),n.match,d.draftRev);c!==void 0&&a.insertText(xn(t),c)}),o}function In(e){return function(t){let r=e.document??globalThis.document,o=t.sessionId,i=o===void 0?void 0:e.inputStoreFor(o),a=t.useInput,d=a===void 0?void 0:a(b=>b.draft),c=a===void 0?void 0:a(b=>b.phase),l=a===void 0?void 0:a(b=>b.occurrences),s=(0,v.useSyncExternalStore)(b=>i===void 0?()=>{}:i.subscribe(b),()=>i===void 0?Ln:i.getSnapshot(),()=>i===void 0?Ln:i.getSnapshot()),u=d??s.draft,f=c??s.phase,[p,m]=(0,v.useState)(()=>new Set),[h,g]=(0,v.useState)(void 0),[k,T]=(0,v.useState)(void 0),[E,C]=(0,v.useState)(void 0),[z,U]=(0,v.useState)(void 0),[j,q]=(0,v.useState)(void 0),[S,A]=(0,v.useState)(void 0);(0,v.useEffect)(()=>{if(o===void 0)return;let b=!0;return e.skillNamesFor(o).then(R=>{b&&m(R)},()=>{b&&m(new Set)}),()=>{b=!1}},[o]);let M=fe(u,b=>p.has(b)),N=yn(M,u,u.length)&&!J(f)?M?.name:void 0,I=kn(u,b=>p.has(b)),P=I!==void 0&&!J(f)&&j!==u,D=N??k??(P?I.name:void 0);(0,v.useEffect)(()=>{if(o===void 0||D===void 0){g(void 0);return}let b=!0;return e.loadProfile(o,D).then(R=>{b&&g(R)},()=>{b&&g(void 0)}),()=>{b=!1}},[o,D]),(0,v.useEffect)(()=>{if(r===void 0||N===void 0){C(void 0);return}let b=()=>C(En(r,N));b();let R=r.defaultView;return R?.addEventListener("resize",b),()=>R?.removeEventListener("resize",b)},[r,N,u]);let B=(0,v.useRef)(null),V=(0,v.useRef)(null),K=()=>{B.current!==null&&clearTimeout(B.current),B.current=null},y=()=>{V.current!==null&&clearTimeout(V.current),V.current=null};(0,v.useEffect)(()=>{if(r===void 0||o===void 0)return;let b=Q=>{let G=Q.target;if(!(G instanceof r.defaultView.Element))return;let Ze=G.closest("[data-composer-text-ref]");if(Ze===null)return;let le=Rn(Ze.textContent??"");le!==void 0&&(y(),K(),B.current=setTimeout(()=>{B.current=null,T(le),C(En(r,le)),U(e.loadUsage(o,le))},vr))},R=Q=>{let G=Q.target;G instanceof r.defaultView.Element&&G.closest("[data-composer-text-ref]")!==null&&(K(),y(),V.current=setTimeout(()=>{V.current=null,T(void 0)},vn))};return r.addEventListener("pointerover",b,!0),r.addEventListener("pointerout",R,!0),()=>{K(),y(),r.removeEventListener("pointerover",b,!0),r.removeEventListener("pointerout",R,!0)}},[r,o]),(0,v.useEffect)(()=>{if(r===void 0||k===void 0)return;let b=R=>{R.key==="Escape"&&T(void 0)};return r.addEventListener("keydown",b),()=>r.removeEventListener("keydown",b)},[r,k]);let L=(0,v.useRef)(u);L.current=u;let O=(0,v.useRef)(void 0);O.current=t.inputActions??(o===void 0?void 0:e.actionsFor(o));let de=(0,v.useRef)([]);de.current=wr({draft:u,draftRev:s.draftRev,phase:f,occurrences:l??s.occurrences});let Le=(0,v.useRef)(void 0);return(0,v.useEffect)(()=>{if(r===void 0||N===void 0||E===void 0)return;let b=Er(h?.argumentHint);if(b.length===0)return;let R=Nr(r,E,b);return r.body.append(R),()=>R.remove()},[r,N,E,h]),(0,v.useEffect)(()=>{if(r===void 0||k===void 0||P)return;let b=Dr(r,e,{name:k,profile:h,usage:z,box:E,sessionId:o,getActions:()=>O.current,getDraft:()=>L.current,onEnter:y,onLeave:()=>{K(),y(),V.current=setTimeout(()=>{V.current=null,T(void 0)},vn)}});return r.body.append(b),()=>b.remove()},[r,k,h,z,E,o,P]),(0,v.useEffect)(()=>{if(r===void 0||!P){A(void 0);return}let b=()=>A(Ar(r));b();let R=r.defaultView;return R?.addEventListener("resize",b),()=>R?.removeEventListener("resize",b)},[r,P,u]),(0,v.useEffect)(()=>{if(r===void 0||!P||I===void 0)return;let b=Sn(h?.params??[],I.query);if(b.length===0)return;let R=Pr(r,{name:I.name,match:I,params:b,getActions:()=>O.current,getDraft:()=>L.current,getOccurrences:()=>de.current});return Le.current=R,r.body.append(R),Or(r,R,S),()=>{Le.current=void 0,R.remove()}},[r,P,I,h,S]),(0,v.useEffect)(()=>{if(r===void 0||!P)return;let b=R=>{R.key==="Escape"&&q(L.current)};return r.addEventListener("keydown",b),()=>r.removeEventListener("keydown",b)},[r,P]),(0,v.useEffect)(()=>{if(r===void 0||!P)return;let b=R=>{let Q=Le.current,G=R.target;Q!==void 0&&G instanceof Node&&Q.contains(G)||q(L.current)};return r.addEventListener("pointerdown",b,!0),()=>r.removeEventListener("pointerdown",b,!0)},[r,P]),null}}function Nr(e,n,t){let r=e.createElement("div");r.className="dsh-better-skill-hint",r.textContent=t.join(`
`);let o=n.right+Cn>me(e)-Cr;return r.style.left=`${o?n.left:n.right+Cn}px`,r.style.top=`${o?n.bottom+2:n.top}px`,r}function Dr(e,n,t){let r=e.createElement("div");r.className="dsh-better-skill-panel",r.addEventListener("pointerenter",t.onEnter),r.addEventListener("pointerleave",t.onLeave);let o=e.createElement("div");o.className="dsh-better-skill-panel-title",o.textContent=`/${t.name}`,r.append(o);let i=t.profile?.description;if(i!==void 0&&i!==""){let s=e.createElement("div");s.className="dsh-better-skill-panel-desc",s.textContent=i,s.title=i,r.append(s)}let a=t.profile?.metadata??{},d=Object.keys(a);if(d.length>0){let s=e.createElement("div");s.className="dsh-better-skill-panel-section",s.append(Ae(e,n.translate("skill.metadata")));for(let u of d){let f=e.createElement("div");f.textContent=`${u}: ${a[u]??""}`,s.append(f)}r.append(s)}let c=t.profile?.path;if(c!==void 0&&c!==""){r.append(Ae(e,n.translate("skill.path")));let s=e.createElement("div");s.className="dsh-better-skill-panel-path",s.textContent=c,r.append(s)}if(t.usage!==void 0){let s=e.createElement("div");s.className="dsh-better-skill-panel-counts",s.textContent=`${n.translate("skill.usage.session")} ${t.usage.session}`,t.usage.workspace!==void 0&&(s.textContent+=` \xB7 ${n.translate("skill.usage.workspace")} ${t.usage.workspace}`),r.append(s)}let l=t.profile?.params??[];if(l.length>0&&t.getActions()?.insertText!==void 0){r.append(Ae(e,n.translate("skill.params")));for(let s of l)r.append(Mr(e,n,t,s.flag,s.detail))}{let u=me(e),f=Rr(i?.length??0,u);if(r.style.width=`${f}px`,t.box!==void 0){let p=Pn(t.box,pe(e),r.offsetHeight,4);r.style.left=`${An(p.left,f,u,12)}px`,p.anchor==="above"?(r.style.bottom=`${pe(e)-t.box.top+4}px`,r.style.top=""):(r.style.top=`${p.top}px`,r.style.bottom="")}}return r}function Ae(e,n){let t=e.createElement("div");return t.className="dsh-better-skill-panel-label",t.textContent=n,t}function Mr(e,n,t,r,o){let i=e.createElement("button");i.type="button",i.className="dsh-better-skill-panel-param",i.title=n.translate("skill.hint.insert"),i.addEventListener("pointerdown",d=>d.preventDefault());let a=e.createElement("span");if(a.className="dsh-better-skill-panel-param-flag",a.textContent=r,i.append(a),o!==""){let d=e.createElement("span");d.className="dsh-better-skill-panel-param-detail",d.textContent=o,i.append(d)}return i.addEventListener("click",()=>{let d=t.getActions();if(d?.insertText===void 0||d.captureInsertion===void 0)return;let c=d.captureInsertion();d.insertText(Lr(t.getDraft(),r),c)}),i}var Nn="dsh-better/skill-enhancer.css",_r=`
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
`;function Dn(e){if(e===void 0)return()=>{};let n=`style[data-plugin-css=${JSON.stringify(Nn)}]`;if(e.querySelector(n)!==null)return()=>{};let t=e.createElement("style");return t.dataset.plugin="dsh-better",t.dataset.pluginCss=Nn,t.textContent=_r,e.head.append(t),()=>t.remove()}function Mn(e,n,t){if(n===void 0||n===""||e.length===0)return;let r=0;for(let o of e){if(o.cwd!==n)continue;let i=o.usage?.[t];typeof i=="number"&&Number.isFinite(i)&&(r+=i)}return r}var x=require("react");var Fr="@deepseek-ai/dsh-client-ui-commands/PopupSelectView.module.css";function _n(e){if(e===void 0)return;let t=e.querySelector(`style[data-plugin-css="${Fr}"]`)?.textContent??"",r=i=>new RegExp(`\\.(\\w+_${i})\\{`,"u").exec(t)?.[1],o={badges:"dshBetter_badges",badgeChip:"dshBetter_badgeChip",badgeChipOn:"dshBetter_badgeChipOn",card:r("card"),viewport:r("viewport"),row:r("row"),rowActive:r("rowActive"),label:r("label"),labelText:r("labelText"),badge:r("badge"),detail:r("detail"),check:r("check"),status:r("status"),search:r("search"),error:r("error"),errorText:r("errorText"),retry:r("retry")};for(let[i,a]of Object.entries(o))if(!(i==="badges"||i==="badgeChip"||i==="badgeChipOn")&&a===void 0)return;return o}function Ie(e,n){for(let t of e)if(t.id===n.provider){for(let r of t.models)if(r.id===n.model)return r.reasoning}}function Fn(e,n){let t=Ie(e,n)?.efforts;return t===void 0?[]:[...t]}function Bn(e,n){if(e.length===0)return;let t=r=>r!==void 0&&e.some(o=>o.id===r);return t(n.remembered)?n.remembered:n.isCurrent&&t(n.currentEffort)?n.currentEffort:t(n.defaultEffort)?n.defaultEffort:e[0]?.id}function Br(e){return e.length>1}function Wn(e){return Br(e)?e:[]}var $=require("react/jsx-runtime");function ge(e){let n=e.group?.name;if(n===void 0)return;let t=`${n}/`,r=e.id.startsWith(t)?e.id.slice(t.length):e.id;return{provider:n,model:r}}function Wr(e,n){let t=ge(e);return Wn(t===void 0?[]:Fn(n??[],t))}function zn({option:e,active:n,catalog:t,pointed:r,classes:o,primitives:i,onChoose:a,onPickEffort:d,onHover:c,t:l}){let s=Wr(e,t),u=i.IconCheckOutlineRegular;return(0,$.jsxs)("div",{role:"option","aria-selected":n,"aria-label":e.badge===void 0?void 0:`${e.label} ${e.badge}`,className:n?`${o.row} ${o.rowActive}`:o.row,onClick:a,onMouseEnter:c,children:[(0,$.jsxs)("span",{className:o.label,children:[(0,$.jsx)("span",{className:o.labelText,children:e.label}),e.badge!==void 0&&(0,$.jsx)("sup",{className:o.badge,children:e.badge})]}),e.detail!==void 0&&(0,$.jsx)("span",{className:o.detail,children:e.detail}),s.length>0&&(0,$.jsx)("span",{className:o.badges,role:"group","aria-label":l?.("listbox.aria")??"",children:s.map(f=>(0,$.jsx)("button",{type:"button",className:f.id===r?`${o.badgeChip} ${o.badgeChipOn}`:o.badgeChip,title:f.description??f.name,onClick:p=>{p.stopPropagation(),d(f.id)},children:f.name},f.id))}),e.active===!0&&s.length===0&&(0,$.jsx)("span",{className:o.check,children:u===void 0?null:(0,$.jsx)(u,{})})]})}function he(e){let n=new Map;for(let t of e){let r=t.group?.name,o=n.get(r);o!==void 0?o.rows.push(t):n.set(r,{group:t.group,rows:[t]})}return[...n.values()]}function ye(e){let n=he(e);return n.some(t=>t.group!==void 0)?n.flatMap(t=>t.rows):[...e]}function Hn(e,n,t){return t===void 0?e.filter(r=>r.label.toLowerCase().includes(n)):he(e).flatMap(r=>t(r.rows.map(o=>({name:o.label,option:o})),n).map(o=>o.option))}var Ne=new WeakSet;async function $n(e,n){let t=e.binding,r=e.state.getSnapshot();if(!(t===null||r.submitting||Ne.has(e))){Ne.add(e),e.state.set?.({...r,submitting:!0,confirming:null,acknowledged:!1,error:null});try{let o=n();if(o===void 0)return;await o,t!==null&&e.binding===t&&e.deps?.consume?.(t.segment)}finally{Ne.delete(e),t!==null&&e.binding===t&&e.dismiss({focusComposer:!0})}}}var zr="@deepseek-ai/dsh-client-ui-primitives";function be(e){if(e===null)return{};let n;try{n=e(zr)}catch{return{}}if(n===null||typeof n!="object")return{};let t=n,r=g=>typeof g=="function"||typeof g=="object"&&g!==null,o=g=>{let k=t[g];return r(k)?k:void 0},i=g=>{let k=t[g];return typeof k=="function"?k:void 0},a={},d=o("MenuSurface");d!==void 0&&(a.MenuSurface=d);let c=o("MenuGroup");c!==void 0&&(a.MenuGroup=c);let l=o("IconCheckOutlineRegular");l!==void 0&&(a.IconCheckOutlineRegular=l);let s=o("IconDataOutlineRegular");s!==void 0&&(a.IconDataOutlineRegular=s);let u=o("IconChevronDownOutlineRegular");u!==void 0&&(a.IconChevronDownOutlineRegular=u);let f=o("Tag");f!==void 0&&(a.Tag=f);let p=i("useAnchoredMaxHeight");p!==void 0&&(a.useAnchoredMaxHeight=p);let m=i("observeStickyMenuGroups");m!==void 0&&(a.observeStickyMenuGroups=m);let h=i("rankByName");return h!==void 0&&(a.rankByName=h),a}function Hr(e){if(e===void 0)return[];let n=[e.name,e.label].map(t=>t.trim().toLowerCase()).filter(t=>t!=="");return[...new Set(n)]}function $r(e,n){return Hr(e.group).some(t=>t.includes(n))}function Ur(e,n,t,r){return t==="fuzzy-label"?Hn(e,n,r):ye(e).filter(o=>o.label.toLowerCase().includes(n)||o.detail?.toLowerCase().includes(n)===!0)}function Un(e,n,t,r){let o=n.trim().toLowerCase();if(o==="")return ye(e);let i=Ur(e,o,t,r),a=new Set(i),d=ye(e).filter(c=>!a.has(c)&&$r(c,o));return[...i,...d]}var _=require("react/jsx-runtime"),Gn="model",jn=320;function jr(e){return e.command!==Gn||!e.open||e.status!=="ready"||e.confirming!==null||e.options.length===0?!1:e.submitting||e.error===null}function qr(e){return e===void 0?!1:/Android|iPhone|iPad|iPod/i.test(e.userAgent)||e.platform==="MacIntel"&&e.maxTouchPoints>1}var Vr={subscribe:()=>()=>{},getSnapshot:()=>({open:!1,command:null,status:"pending",options:[],search:"",searchLabels:null,searchMode:"substring",active:0,submitting:!1,confirming:null,acknowledged:!1,error:null})};function Kn(e){let n=be(e.load);function t(r){let o=r.popup,i=o?.state??Vr,a=(0,x.useCallback)(s=>i.subscribe(s),[i]),d=(0,x.useCallback)(()=>i.getSnapshot(),[i]),c=(0,x.useSyncExternalStore)(a,d),l=e.native();return o===void 0||l===void 0?null:!jr(c)||o.settle===void 0?(0,_.jsx)(l,{...r}):(0,_.jsx)(Gr,{popup:o,state:c,t:r.t,primitives:n,doc:e.document,catalog:r.catalog,current:r.current,selectModel:r.selectModel})}return t}function Gr({popup:e,state:n,t,primitives:r,doc:o,catalog:i,current:a,selectModel:d}){let c=(0,x.useRef)(null),l=(0,x.useRef)(null),s=(0,x.useRef)(null),u=(0,x.useMemo)(()=>_n(o),[o]),f=n.searchMode,p=(0,x.useMemo)(()=>Un(n.options,n.search,f,r.rankByName),[n.options,n.search,f,r.rankByName]),m=(0,x.useMemo)(()=>he(p),[p]),[h,g]=(0,x.useState)({}),[k,T]=(0,x.useState)(()=>qn(p));(0,x.useEffect)(()=>{T(qn(p))},[n.search,n.options]);let E=Vn(p,k),C=Kr(r,c,n);(0,x.useEffect)(()=>{let y=s.current;if(!(y===null||r.observeStickyMenuGroups===void 0))return r.observeStickyMenuGroups(y)},[r.observeStickyMenuGroups,n.open,n.status,m]),(0,x.useEffect)(()=>{c.current?.querySelector('[aria-selected="true"]')?.scrollIntoView({block:"nearest"})},[E,p]),(0,x.useEffect)(()=>{if(!n.open)return;let y=L=>{let O=c.current;O!==null&&L.target instanceof Node&&O.contains(L.target)||e.dismiss()};return o?.addEventListener("pointerdown",y,!0),()=>{o?.removeEventListener("pointerdown",y,!0)}},[o,e,n.open]),(0,x.useEffect)(()=>{n.open&&(qr(o?.defaultView?.navigator)||l.current?.focus())},[o,n.open]);let z=(0,x.useCallback)((y,L)=>{if(L===void 0||d===void 0){e.settle?.(e.binding,y);return}let O=ge(y);if(O===void 0){e.settle?.(e.binding,y);return}$n(e,()=>d({...O,reasoningEffort:L}))},[e,d]),U=(0,x.useCallback)(y=>{let L=ge(y);if(L===void 0)return;let O=Ie(i??[],L);return Bn(O?.efforts??[],{remembered:h[y.id],isCurrent:a?.provider===L.provider&&a?.model===L.model,currentEffort:a?.reasoningEffort,defaultEffort:O?.defaultEffort})},[i,a,h]),j=(0,x.useCallback)(y=>{z(y,U(y))},[U,z]),q=(0,x.useCallback)((y,L)=>{g(O=>({...O,[y.id]:L})),z(y,L)},[z]),S=(0,x.useCallback)(()=>{let y=p[E];y!==void 0&&j(y)},[E,j,p]),A=(0,x.useCallback)(y=>{p.length!==0&&T(L=>(Vn(p,L)+y+p.length)%p.length)},[p]),M=y=>{switch(y.key){case"ArrowDown":y.preventDefault(),A(1);return;case"ArrowUp":y.preventDefault(),A(-1);return;case"Enter":y.preventDefault(),S();return;case"Tab":if(!y.shiftKey&&p.length===0)return;y.preventDefault(),y.shiftKey?e.dismiss({focusComposer:!0}):S();return;case"Escape":y.preventDefault(),e.dismiss({focusComposer:!0});return;default:}};if(u===void 0)return null;let N=n.searchLabels?.placeholder??t?.("search.placeholder")??"",I=n.searchLabels===null?t?.("status.empty")??"":n.options.length===0?n.searchLabels.empty:n.searchLabels.noResults,P=(y,L)=>(0,_.jsx)(zn,{option:y,active:L===E,catalog:i,pointed:L===E?U(y):void 0,classes:u,primitives:r,onChoose:()=>{j(y)},onPickEffort:O=>{q(y,O)},onHover:()=>{T(L)},t},y.id),D=0,B=m.map(({group:y,rows:L})=>{let O=L.map(de=>P(de,D++));return y===void 0?(0,_.jsx)(x.Fragment,{children:O},"ungrouped"):r.MenuGroup===void 0?(0,_.jsx)(x.Fragment,{children:O},`group:${y.name}`):(0,_.jsx)(r.MenuGroup,{label:y.label,children:O},`group:${y.name}`)}),V=(0,_.jsxs)(_.Fragment,{children:[(0,_.jsx)("input",{ref:l,className:u.search,type:"text",placeholder:N,"aria-label":t?.("search.aria")??"",value:n.search,readOnly:n.submitting,onChange:y=>{e.setSearch(y.currentTarget.value)}}),n.submitting&&(0,_.jsx)("div",{className:u.status,children:t?.("status.applying")??""}),!n.submitting&&p.length===0&&(0,_.jsx)("div",{className:u.status,children:I}),p.length>0&&(0,_.jsx)("div",{ref:s,role:"listbox","aria-label":t?.("listbox.aria")??"",className:u.viewport,children:B})]}),K={className:u.card,style:{maxHeight:C},"aria-label":t?.("overlay.aria")??Gn,onKeyDown:M};return r.MenuSurface===void 0?(0,_.jsx)("div",{ref:c,...K,children:V}):(0,_.jsx)(r.MenuSurface,{ref:c,...K,children:V})}function qn(e){let n=e.findIndex(t=>t.active===!0);return n===-1?0:n}function Vn(e,n){return e.length===0?0:Math.min(Math.max(n,0),e.length-1)}function Kr(e,n,t){let r=e.useAnchoredMaxHeight;return r===void 0?jn:r(n,jn,t)}var H=require("react");var De="application/x-dsh-composer+json";var Yr=Object.freeze({png:"image/png",jpg:"image/jpeg",jpeg:"image/jpeg",webp:"image/webp",gif:"image/gif",bmp:"image/bmp",svg:"image/svg+xml",avif:"image/avif",heic:"image/heic",heif:"image/heif",tif:"image/tiff",tiff:"image/tiff"});function Yn(e){return JSON.stringify({v:1,text:e.text,attachments:e.attachments.map(n=>({path:n.path,name:n.name,type:n.type,kind:n.kind}))})}function Jn(e){if(typeof e!="string"||e==="")return;let n;try{n=JSON.parse(e)}catch{return}if(n===null||typeof n!="object")return;let t=n;if(t.v!==1)return;let r=typeof t.text=="string"?t.text:"",o=Array.isArray(t.attachments)?t.attachments:[],i=[];for(let a of o){if(a===null||typeof a!="object")continue;let d=a,c=d.path;typeof c!="string"||c===""||i.push({path:c,name:typeof d.name=="string"&&d.name!==""?d.name:_e(c),type:typeof d.type=="string"?d.type:"",kind:d.kind==="image"?"image":"file"})}return{text:r,attachments:i}}function Me(e,n){if(n.length===0)return e;let t=n.join(`
`);return e===""?t:`${e.replace(/\n+$/u,"")}

${t}`}function Xn(e){if(e==="")return;let n=e.split(`
`),t=[],r=n.length;for(let i=n.length-1;i>=0;i-=1){let a=n[i]??"";if(a.trim()===""){if(t.length>0){r=i;continue}continue}let d=Jr(a);if(d===void 0)break;t.unshift(d),r=i}return t.length===0?void 0:{text:n.slice(0,r).join(`
`).replace(/\n+$/u,""),paths:t}}function Jr(e){let n=e.trim();if(n.startsWith("@")&&(n=n.slice(1)),n.startsWith('"')&&n.endsWith('"')&&n.length>1&&(n=n.slice(1,-1)),n!==""&&Xr(n)&&!/[\u0000-\u001f\u007f]/u.test(n)&&!/["\u2018\u2019\u201c\u201d\u300c\u300d\u300e\u300f\u3002\uff01\uff1f\uff1b\uff1a\uff0c\u3001\u2026*?;<>|&$`!#=]/u.test(n)&&!/(?:^|\s)-{1,2}\S/u.test(n))return n}function Xr(e){return e.startsWith("/")||/^[A-Za-z]:[/\\]/u.test(e)||e.startsWith("\\\\")}function Zn(e){let n=/\.([A-Za-z0-9]+)$/u.exec(e);if(n!==null)return Yr[n[1]?.toLowerCase()??""]}function _e(e){return e.split(/[\\/]/u).filter(t=>t!=="").at(-1)??e}function Qn(e,n){let t=new Set(n),r=[],o=[];for(let i of e){if(t.has(i.path)){o.push(i.path);continue}t.add(i.path),r.push(i)}return{accepted:r,duplicates:o}}var ne=require("react/jsx-runtime"),Zr="data-dsh-better-attach-item",Qr="data-dsh-better-attach-selected",eo=4500,no=new Set(["a","c","x","insert"]),to=new Set(["meta","control","shift","alt","altgraph","capslock","os"]),ro=/\s/u;function nt(e){function n(t){let r=e.native();return r===void 0?null:(0,ne.jsx)(oo,{native:r,props:t,deps:e})}return n}function oo({native:e,props:n,deps:t}){let r=(0,H.useRef)(null),[o,i]=(0,H.useState)(!1),[a,d]=(0,H.useState)(null),c=(n.attachments??[]).length>0,l=(0,H.useRef)(n);l.current=n;let s=(0,H.useRef)(o);s.current=o;let u=(p,m)=>n.t?.(p,m)??t.translate()?.(p,m)??"",f=(0,H.useRef)(u);return f.current=u,(0,H.useEffect)(()=>{let p=r.current;if(p===null)return;let m=p.querySelector('[role="group"]');if(m!==null)for(let h of Array.from(m.children)){if(!(h instanceof HTMLElement))continue;h.toggleAttribute(Zr,!0);let g=lo(h);g!==null&&g.toggleAttribute(Qr,o)}},[o,n.attachments]),(0,H.useEffect)(()=>{if(a===null)return;let p=globalThis.setTimeout(()=>{d(null)},eo);return()=>{globalThis.clearTimeout(p)}},[a]),(0,H.useEffect)(()=>{let p=r.current;if(p===null)return;let m=p.closest("[data-composer-card]");if(!(m instanceof HTMLElement))return;let h=m.ownerDocument,g=S=>(S instanceof Element?S:S instanceof Node?S.parentElement:null)?.closest("[contenteditable]")??null,k=()=>{s.current&&i(!1)},T=()=>{let S=m.ownerDocument.getSelection();return S!==null&&!S.isCollapsed&&S.toString()!==""},E=S=>S instanceof Node&&m.contains(S),C=S=>{let A=S.key.toLowerCase();if(to.has(A))return;let M=S.metaKey||S.ctrlKey;if(M&&!S.altKey&&A==="a"){E(S.target)&&g(S.target)?.getAttribute("contenteditable")==="true"&&i(!0);return}if(M&&!S.altKey&&A==="c"&&s.current&&E(S.target)&&!T()){S.preventDefault(),ao(l.current,t,d,f.current);return}M&&!S.altKey&&no.has(A)||k()},z=()=>{k()},U=S=>{let M=l.current.attachments??[],N=S.clipboardData;if(!s.current||M.length===0||N===null)return;let I=[],P=[];for(let D of M){let B=t.pathOf(D.file);if(B===""){P.push(D.file.name);continue}I.push({path:B,name:D.file.name,type:D.file.type,kind:D.kind})}if(I.length>0){let D=N.getData("text/plain");N.setData(De,Yn({text:D,attachments:I})),N.setData("text/plain",Me(D,I.map(B=>B.path)))}P.length>0&&d(f.current("attach.copySkipped",{count:String(P.length)}))},j=S=>{let A=S.clipboardData;if(A===null||g(S.target)===null||Array.from(A.types).includes("Files"))return;let M=()=>l.current,N=Jn(A.getData(De)),I=N===void 0?Xn(A.getData("text/plain")):void 0;if(N===void 0&&I===void 0)return;let P=io(l.current.phase?.(),f.current);if(P!==void 0){S.preventDefault(),S.stopPropagation(),d(P);return}if(S.preventDefault(),S.stopPropagation(),k(),N!==void 0){et(N,M,t,d,f.current);return}I!==void 0&&et({text:I.text,attachments:I.paths.map(D=>{let B=Zn(D)??"";return{path:D,name:_e(D),type:B,kind:B===""?"file":"image"}})},M,t,d,f.current)};h.addEventListener("keydown",C,!0),m.addEventListener("paste",j,!0);let q=S=>{let A=S.relatedTarget;A instanceof Node&&m.contains(A)||k()};return m.addEventListener("focusout",q),h.addEventListener("copy",U),h.addEventListener("pointerdown",z,!0),()=>{h.removeEventListener("keydown",C,!0),h.removeEventListener("copy",U),m.removeEventListener("paste",j,!0),m.removeEventListener("focusout",q),h.removeEventListener("pointerdown",z,!0)}},[t]),(0,ne.jsxs)("div",{ref:r,className:c?"dshBetter_railHost":"dshBetter_railHostEmpty",children:[(0,ne.jsx)(e,{...n}),a!==null&&(0,ne.jsx)("div",{className:"dshBetter_attachNotice",role:"status",children:a})]})}function io(e,n){return J(e)?n("attach.pasteBusy"):void 0}function ao(e,n,t,r){let o=e.attachments??[],i=[],a=0;for(let d of o){let c=n.pathOf(d.file);c===""?a+=1:i.push(c)}i.length>0&&globalThis.navigator?.clipboard?.writeText(Me("",i)).catch(()=>{t(r("attach.copyFailed"))}),a>0&&t(r("attach.copySkipped",{count:String(a)}))}function et(e,n,t,r,o){let i=n();if(Fe(i,e.text),e.attachments.length===0)return;let a=t.reader(),d=i.sessionId;if(a===void 0||d===void 0){Fe(i,e.attachments.map(s=>s.path).join(`
`));return}let c=(i.attachments??[]).map(s=>t.pathOf(s.file)).filter(s=>s!==""),{accepted:l}=Qn(e.attachments,c);l.length!==0&&(async()=>{let s=[],u=[],f=0;for(let m of l){let h=await so(a,d,m);h.kind==="file"?s.push(h.file):h.kind==="mention"?u.push(h.mention):f+=1}let p=n();u.length>0&&Fe(p,u.join(" ")),s.length>0&&p.onAddFiles?.(s),f>0&&r(o("attach.pasteMissing",{count:String(f)})),u.length>0&&r(o("attach.pasteReferenced",{count:String(u.length)}))})()}function Fe(e,n){if(n==="")return;let t=e.inputActions,r=t?.captureInsertion?.();t?.insertText===void 0||r===void 0||t.insertText(n,r)}async function so(e,n,t){let r=await e.readBytes?.(n,t.path,{});if(r!==void 0&&r.ok)return{kind:"file",file:new File([r.value.data],t.name,{type:t.type})};let o=await e.stat?.(n,t.path);return o!==void 0&&o.ok?{kind:"mention",mention:uo(t.path)}:{kind:"missing"}}function lo(e){let n=e.querySelector("img")?.parentElement;if(n!=null)return n;let t=e.firstElementChild;return t instanceof HTMLElement?t:null}function uo(e){return ro.test(e)?`@"${e}"`:`@${e}`}var co="better.focusComposer",fo=Object.freeze(["focus input","focus composer","message input"]),oe="command.focusComposer",po=Object.freeze(["page","editable","terminal"]),mo=Object.freeze({"desktop:macos":{code:"Space",modifiers:["primary"]},"desktop:windows":{code:"Space",modifiers:["primary","shift"]},"web:macos":{code:"Space",modifiers:["primary","shift"]},"web:windows":{code:"Space",modifiers:["primary","shift"]}}),go="[data-composer-input], [role='textbox'][aria-multiline='true']";function rt(e){return e===void 0||typeof e.querySelector!="function"?!1:e.querySelector(go)!=null}function Be(e,n){if(e===null||typeof e!="object")return;let t=e.get;if(typeof t=="function"){let r=t.call(e,n);return r===null?void 0:r}return e[n]}var tt=e=>typeof e=="string"&&e!==""?e:void 0;function ot(e){let t=Be(e,"uiSession")?.adapter?.current?.getSnapshot?.();if(t!==void 0)return tt(t.key);let r=Be(e,"sessions");return tt(r?.list?.getSnapshot?.()?.current)}function it(e,n){try{let t=e.sessions?.scope?.(n);if(t===void 0)return!1;let o=Be(t,"conversation")?.input?.for?.(t);return o===void 0||typeof o.focus!="function"?!1:(o.focus(),!0)}catch{return!1}}function ho(e){return(n={})=>{if(n.modal!=null)return{status:"pass"};if(!e.composerMounted())return{status:"pass"};let t=e.currentSessionId();return t===void 0?{status:"pass"}:{status:"handled",run:()=>{e.focusComposer(t)}}}}function yo(e,n){return{id:co,label:n,aliases:fo,defaults:mo,regions:po,modals:[],resolve:ho(e)}}function at(e,n,t,r){if(e===void 0||typeof e.register!="function")return()=>{};try{return e.register(yo(n,t))}catch(o){return r?.(o instanceof Error?o.message:String(o)),()=>{}}}var st=Object.freeze({zh:{"overlay.aria":"\u9009\u62E9\u6A21\u578B","listbox.aria":"\u6A21\u578B\u5339\u914D\u9879","search.aria":"\u641C\u7D22\u4F9B\u5E94\u5546\u6216\u6A21\u578B","search.placeholder":"\u641C\u7D22\u4F9B\u5E94\u5546\u6216\u6A21\u578B\u2026","status.empty":"\u6CA1\u6709\u53EF\u7528\u7684\u6A21\u578B\u3002","status.applying":"\u6B63\u5728\u5207\u6362\u2026",retry:"\u91CD\u8BD5","trigger.selectAria":"\u9009\u62E9\u6A21\u578B","trigger.aria":"\u5F53\u524D\u6A21\u578B {model}\uFF0C\u70B9\u51FB\u5207\u6362","trigger.ariaEffort":"\u5F53\u524D\u6A21\u578B {model}\uFF0C\u63A8\u7406\u7B49\u7EA7 {effort}\uFF0C\u70B9\u51FB\u5207\u6362","trigger.fallback":"\u9009\u62E9\u6A21\u578B","trigger.loading":"\u52A0\u8F7D\u6A21\u578B\u2026",[oe]:"\u805A\u7126\u8F93\u5165\u6846","attach.copySkipped":"{count} \u4E2A\u9644\u4EF6\u6765\u81EA\u526A\u8D34\u677F\u3001\u6CA1\u6709\u672C\u5730\u8DEF\u5F84\uFF0C\u672A\u590D\u5236","attach.pasteMissing":"{count} \u4E2A\u9644\u4EF6\u5BF9\u5E94\u7684\u6587\u4EF6\u5DF2\u4E0D\u5B58\u5728\uFF0C\u672A\u7C98\u8D34","attach.pasteReferenced":"{count} \u4E2A\u9644\u4EF6\u8D85\u51FA\u5355\u6B21\u8BFB\u53D6\u4E0A\u9650\uFF0C\u5DF2\u6539\u4E3A\u8DEF\u5F84\u5F15\u7528","attach.copyFailed":"\u6D4F\u89C8\u5668\u62D2\u7EDD\u4E86\u8FD9\u6B21\u526A\u8D34\u677F\u5199\u5165","attach.pasteBusy":"\u6D88\u606F\u6B63\u5728\u53D1\u9001\uFF0C\u7A0D\u540E\u518D\u7C98\u8D34","compaction.reading":"\u538B\u7F29 {count} \u6B21","compaction.readingOne":"\u538B\u7F29 1 \u6B21","compaction.tooltip":"\u672C\u4F1A\u8BDD\u4E0A\u4E0B\u6587\u5DF2\u538B\u7F29 {count} \u6B21","compaction.tooltipWithFailures":"\u672C\u4F1A\u8BDD\u4E0A\u4E0B\u6587\u5DF2\u538B\u7F29 {count} \u6B21\uFF0C\u53E6\u6709 {failures} \u6B21\u538B\u7F29\u5931\u8D25","tabs.nav":"Tab \u7BA1\u7406","tabs.heading":"Tab \u7BA1\u7406","tabs.empty":"\u8FD8\u6CA1\u6709\u63D2\u4EF6\u6CE8\u518C\u4F1A\u8BDD\u6807\u7B7E\u3002","tabs.show":"\u5728\u6807\u7B7E\u680F\u663E\u793A{label}","tabs.hide":"\u4ECE\u6807\u7B7E\u680F\u9690\u85CF{label}","alias.nav":"\u6280\u80FD\u522B\u540D","alias.heading":"\u6280\u80FD\u522B\u540D","alias.prefix.title":"\u9700\u8981\u659C\u6760\u524D\u7F00","alias.prefix.on":"\u6253\u5F00\u5219\u9700\u8981\u8F93\u5165 \u201C/\u201D \u8FDB\u884C\u5339\u914D","alias.prefix.off":"\u6253\u5F00\u5219\u65E0\u9700\u8F93\u5165 \u201C/\u201D \u8FDB\u884C\u5339\u914D","alias.table.keyword":"\u5173\u952E\u8BCD","alias.table.target":"\u6280\u80FD\u6216\u547D\u4EE4","alias.table.params":"\u53C2\u6570","alias.table.paramsPlaceholder":"\u53EF\u9009\uFF0C\u5982 run","alias.table.actions":"\u64CD\u4F5C","alias.add":"\u6DFB\u52A0\u522B\u540D","alias.remove":"\u5220\u9664\u522B\u540D {keyword}","alias.unnamed":"\uFF08\u672A\u547D\u540D\uFF09","alias.empty":"\u8FD8\u6CA1\u6709\u522B\u540D\u3002\u4F8B\u5982\uFF1Awf \u2192 /flow-workflow run","alias.footnote":"\u8F93\u5165\u5173\u952E\u8BCD\u540E\u4ECE\u9762\u677F\u9009\u62E9\u5373\u53EF\u63D2\u5165\u5B8C\u6574\u8C03\u7528\uFF1B\u6539\u5B8C\u7ACB\u5373\u751F\u6548\u3002","alias.menu.section":"\u6280\u80FD\u522B\u540D","alias.menu.params":"\u53C2\u6570\uFF1A{value}","skill.metadata":"\u5143\u6570\u636E","skill.path":"\u5730\u5740","skill.usage.session":"\u672C\u4F1A\u8BDD\u8C03\u7528","skill.usage.workspace":"\u672C\u5DE5\u4F5C\u533A\u8C03\u7528","skill.params":"\u53C2\u6570","skill.hint.insert":"\u70B9\u51FB\u63D2\u5165","continue.label":"\u7EE7\u7EED","continue.sending":"\u7EE7\u7EED\u4E2D\u2026"},en:{"overlay.aria":"Select a model","listbox.aria":"Matching models","search.aria":"Search providers or models","search.placeholder":"Search providers or models\u2026","status.empty":"No models available.","status.applying":"Switching\u2026",retry:"Retry","trigger.selectAria":"Select model","trigger.aria":"Current model {model}, click to change","trigger.ariaEffort":"Current model {model}, reasoning effort {effort}, click to change","trigger.fallback":"Select model","trigger.loading":"Loading models\u2026",[oe]:"Focus message input","attach.copySkipped":"{count} attachment(s) came from the clipboard with no local path and were not copied","attach.pasteMissing":"{count} attachment(s) no longer exist and were not pasted","attach.pasteReferenced":"{count} attachment(s) exceed the read limit and became path references","attach.copyFailed":"The browser refused this clipboard write","attach.pasteBusy":"A message is being sent; paste again in a moment","compaction.reading":"{count} compactions","compaction.readingOne":"1 compaction","compaction.tooltip":"This session's context was compressed {count} time(s)","compaction.tooltipWithFailures":"This session's context was compressed {count} time(s), with {failures} failed attempt(s)","tabs.nav":"Tabs","tabs.heading":"Tabs","tabs.empty":"No plugin has registered a conversation tab yet.","tabs.show":"Show {label} in the tab bar","tabs.hide":"Hide {label} from the tab bar","alias.nav":"Skill aliases","alias.heading":"Skill aliases","alias.prefix.title":"Require a slash prefix","alias.prefix.on":"To open, type \u201C/\u201D to match","alias.prefix.off":"To open, type the keyword without \u201C/\u201D to match","alias.table.keyword":"Keyword","alias.table.target":"Skill or command","alias.table.params":"Arguments","alias.table.paramsPlaceholder":"Optional, e.g. run","alias.table.actions":"Actions","alias.add":"Add alias","alias.remove":"Delete alias {keyword}","alias.unnamed":"(unnamed)","alias.empty":"No aliases yet. For example: wf \u2192 /flow-workflow run","alias.footnote":"Type a keyword and pick from the panel to insert the full invocation; changes apply immediately.","alias.menu.section":"Skill aliases","alias.menu.params":"args: {value}","skill.metadata":"Metadata","skill.path":"Path","skill.usage.session":"This session","skill.usage.workspace":"This workspace","skill.params":"Arguments","skill.hint.insert":"Click to insert","continue.label":"Continue","continue.sending":"Continuing\u2026"}});var dt="dsh-better-effort",bo=`
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
`;function lt(e){if(e===void 0)return()=>{};if(e.getElementById(dt)!==null)return()=>{};let n=e.createElement("style");return n.id=dt,n.textContent=bo,e.head.append(n),()=>{n.remove()}}var ft="dsh-better.layout-widths",te=Object.freeze({sidebar:null,rightbar:null});function pt(e){return typeof e=="number"&&Number.isFinite(e)&&e>0}function ke(e){if(e===void 0)return te;let n;try{n=e.getItem(ft)}catch{return te}if(n===null||n==="")return te;let t;try{t=JSON.parse(n)}catch{return te}if(typeof t!="object"||t===null||Array.isArray(t))return te;let r=t;return{sidebar:ut(r.sidebar),rightbar:ut(r.rightbar)}}function mt(e,n){if(e===void 0)return;let t={};n.sidebar!==null&&(t.sidebar=Math.round(n.sidebar)),n.rightbar!==null&&(t.rightbar=Math.round(n.rightbar));try{e.setItem(ft,JSON.stringify(t))}catch{}}function ut(e){return pt(e)?Math.round(e):null}function gt(e){if(typeof e!="string")return te;let n=e.trim().split(/\s+/).filter(t=>t!=="");return{sidebar:ct(n[0]),rightbar:ct(n[2])}}function ct(e){if(e===void 0)return null;let n=/^([0-9]+(?:\.[0-9]+)?)px$/.exec(e);if(n===null)return null;let t=Number(n[1]);return pt(t)?Math.round(t):null}function ht(e,n,t=null){return t==="sidebar"?n.sidebar!==null&&n.sidebar!==e.sidebar?{sidebar:n.sidebar}:{}:t==="rightbar"?n.rightbar!==null&&n.rightbar!==e.rightbar?{rightbar:n.rightbar}:{}:n.sidebar!==null&&n.sidebar!==e.sidebar?{sidebar:n.sidebar}:n.rightbar!==null&&n.rightbar!==e.rightbar?{rightbar:n.rightbar}:{}}function yt(e,n){return{sidebar:n.sidebar??e.sidebar,rightbar:n.rightbar??e.rightbar}}function bt(e){let n=[];return e.sidebar!==null&&n.push({column:"sidebar",width:e.sidebar}),e.rightbar!==null&&n.push({column:"rightbar",width:e.rightbar}),n}var ko="[data-shell-bottom]",So="[data-side]",wo='[class*="_sidebarCol"]',xo='[class*="_rightbarCol"]',vo=600;function Co(e){let t=e?.layout?.panels;if(typeof t!="object"||t===null)return;let r=t;if(!(typeof r.setSidebar!="function"&&typeof r.setRightbar!="function"))return r}function wt(e,n){let t=Co(e);if(t===void 0)return!1;let r=!1;for(let{column:o,width:i}of bt(n)){let a=o==="sidebar"?t.setSidebar:t.setRightbar;if(a!==void 0)try{a.call(t,i),r=!0}catch{}}return r}function kt(e){return e.querySelector(ko)?.parentElement??null}function Lo(e,n){let t=e.hasAttribute("data-sidebar-collapsed"),r=e.hasAttribute("data-rightbar-collapsed"),o=gt(n?.getComputedStyle(e).gridTemplateColumns);return{sidebar:t?null:o.sidebar??St(e.querySelector(wo)),rightbar:r?null:o.rightbar??St(e.querySelector(xo))}}function St(e){if(e===null)return null;let n=e.getBoundingClientRect().width;return Number.isFinite(n)&&n>0?Math.round(n):null}function xt(e){let{document:n,storage:t}=e,r=null,o=null,i=0,a=!1,d=null,c=()=>n.defaultView,l=()=>(r!==null&&r.isConnected||(r=kt(n)),r),s=()=>{let g=l();return g===null?null:Lo(g,c())},u=g=>{let k=g?.getAttribute("data-side");return k==="sidebar"||k==="rightbar"?k:null},f=g=>{let k=s();if(k===null)return;let T=ht(g.before,k,g.side);T.sidebar===void 0&&T.rightbar===void 0||mt(t,yt(ke(t),T))},p=g=>{if(d!==null)return;let k=g.target,T=typeof k?.closest=="function"?k.closest(So):null;if(T===null)return;let E=s();E!==null&&(d={side:u(T),before:E})},m=()=>{let g=d;if(d=null,g===null)return;let k=c()?.requestAnimationFrame;if(k===void 0){f(g);return}k.call(c(),()=>f(g))},h=()=>{if(o=null,a)return;let g=kt(n);if(g!==null){r=g;return}if(i>=vo)return;i+=1;let k=c()?.requestAnimationFrame;k!==void 0&&(o=k.call(c(),h))};return{attach(){a=!1,i=0;let g=c();return g?.addEventListener("pointerdown",p,!0),g?.addEventListener("pointerup",m,!0),g?.addEventListener("pointercancel",m,!0),h(),()=>{a=!0,d=null,r=null,g?.removeEventListener("pointerdown",p,!0),g?.removeEventListener("pointerup",m,!0),g?.removeEventListener("pointercancel",m,!0),o!==null&&g?.cancelAnimationFrame(o),o=null}}}}var vt="sessionCompaction";var Ct="dsh-better-compaction",Se="dshBetter_compactionStat",Eo=`
.${Se} {
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

[data-composer-dock]:has([data-workbench-dock="term-dock"]) .${Se} {
  margin-left: 12px;
}
`;function Lt(e){if(e===void 0)return()=>{};if(e.getElementById(Ct)!==null)return()=>{};let n=e.createElement("style");return n.id=Ct,n.textContent=Eo,e.head.append(n),()=>{n.remove()}}var Rt=require("react/jsx-runtime");function Ro(e,n){if(e===void 0||n===void 0)return null;let{compactions:t,failures:r}=e;if(!Number.isSafeInteger(t)||t<=0)return null;let o=t===1?n("compaction.readingOne"):n("compaction.reading",{count:t}),i=Number.isSafeInteger(r)&&r>0?n("compaction.tooltipWithFailures",{count:t,failures:r}):n("compaction.tooltip",{count:t});return{text:o,tooltip:i}}function To(){}function Et({useProjection:e,t:n}){let r=Ro((e??To)(vt),n);return r===null?null:(0,Rt.jsx)("span",{className:Se,"data-dsh-better":"compaction-stat",title:r.tooltip,children:r.text})}var We="conversation.composer.dock",Tt="better-compaction";var Ue=require("react");var At="continue",ze="conversation.chat.turnTail",Pt="better-continue";function Ot(e){return e.end?.reason?.kind!=="interrupted"?!1:e.latest&&!e.pending}var It="dsh-better-continue",re="dshBetter_continue",He="dshBetter_continueError",Ao=`
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
`;function Nt(e){if(e===void 0)return()=>{};if(e.getElementById(It)!==null)return()=>{};let n=e.createElement("style");return n.id=It,n.textContent=Ao,e.head.append(n),()=>{n.remove()}}var X=require("react/jsx-runtime");function Po(e){return e instanceof Error?e.message:String(e)}function Oo(e,n){return e.length>0&&e[e.length-1]===n}function $e(){}function Dt({turn:e,sessionId:n,useChat:t,useSession:r,useInput:o,t:i,submitContinue:a}){let d=t??$e,c=r??$e,l=o??$e,s=d(C=>C),u=c(C=>C),f=l(C=>C),[p,m]=(0,Ue.useState)(!1),[h,g]=(0,Ue.useState)(null),k=e!==void 0&&Oo(s?.timeline.turnOrder??[],e.turn),T=(u?.pendingSubmissions?.length??0)>0||J(f?.phase);return e===void 0||n===void 0||a===void 0||i===void 0||!Ot({end:e.end?.data,latest:k,pending:T})?null:(0,X.jsxs)(X.Fragment,{children:[(0,X.jsx)("button",{type:"button",className:re,"data-testid":"better-continue",disabled:p,onClick:()=>{m(!0),g(null),a(n).catch(C=>{m(!1),g(Po(C))})},children:i(p?"continue.sending":"continue.label")}),h===null?null:(0,X.jsx)("span",{className:He,role:"alert",children:h})]})}function Io(e){return typeof e=="object"&&e!==null&&"ok"in e&&e.ok===!1}async function Mt(e,n){let t=e.sessions?.binding?.(n)?.session,r=t?.prompt;if(typeof r!="function")throw new Error("\u8FD9\u4E2A\u5BBF\u4E3B\u7684\u4F1A\u8BDD\u4E0D\u652F\u6301\u53D1\u9001\u6D88\u606F");let o=await r.call(t,[{type:"text",text:At}],"queue");if(Io(o))throw new Error("\u7EE7\u7EED\u6D88\u606F\u6CA1\u6709\u88AB\u5BBF\u4E3B\u63A5\u53D7")}var ie=require("react");function No(e){let n=e.name.trim();return n===""?e.id:n}function je(e,n){if(e===void 0)return{model:n};let t=No(e.group),r=e.model.name.trim();return r===""?{model:t}:{provider:t,model:r}}function _t(e,n){let t=je(e,n);return t.provider===void 0?t.model:`${t.provider} ${t.model}`}function Do(e){return typeof e=="string"?e:e.en??""}function we(e,n){if(e!==void 0)try{return e(n)}catch{}return Do(n)}var F=require("react/jsx-runtime"),Mo="@deepseek-ai/dsh-client-ui-model-selection/ModelSelect.module.css";function _o(e){if(e===void 0)return;let t=e.querySelector(`style[data-plugin-css="${Mo}"]`)?.textContent??"",r=a=>new RegExp(`\\.(\\w+_${a})\\{`,"u").exec(t)?.[1],o={root:r("root"),trigger:r("trigger"),triggerIcon:r("triggerIcon"),triggerLabel:r("triggerLabel"),triggerEffort:r("triggerEffort"),chevron:r("chevron")};for(let a of Object.values(o))if(a===void 0)return;let i=r("badge");return{...o,...i===void 0?{}:{badge:i}}}function Ft(e){let n=be(e.load),t=_o(e.document);function r(o){let i=e.native();return o.available===!1||i===void 0||t===void 0?i===void 0?null:(0,F.jsx)(i,{...o}):(0,F.jsx)(Fo,{props:o,primitives:n,openPicker:e.openPicker,translate:e.translate,classes:t})}return r}function Fo({props:e,primitives:n,openPicker:t,translate:r,classes:o}){let{directory:i,t:a,sessionId:d,locked:c,resolveText:l}=e,s=Bo(i),u=a??r(),f=s?.current??null,p=f===null&&s?.status==="loading",m=Wo(s,f),h=u?.("trigger.fallback")??"",g=_t(m,h),k=je(m,h),T=zo(m,l),E=p?u?.("trigger.loading")??"":g,C=Ho(s,f,m,u),z=C===void 0?E:`${E} \xB7 ${C}`,U=p?u?.("trigger.loading")??"":f===null?u?.("trigger.selectAria")??"":C===void 0?u?.("trigger.aria",{model:E})??"":u?.("trigger.ariaEffort",{model:E,effort:C})??"",j=()=>{t(d)},q=n.IconDataOutlineRegular,S=n.IconChevronDownOutlineRegular,A=n.Tag,M=o.badge;return(0,F.jsx)("div",{className:o.root,"data-dsh-better-seat":"",children:(0,F.jsxs)("button",{type:"button",className:o.trigger,"aria-label":U,"aria-haspopup":"dialog","aria-expanded":"false",title:z,disabled:c,onClick:j,children:[q===void 0?null:(0,F.jsx)(q,{className:o.triggerIcon,size:16}),(0,F.jsx)("span",{className:o.triggerLabel,"data-provider-id":f?.provider,"data-model-id":f?.model,children:p?E:(0,F.jsxs)(F.Fragment,{children:[k.provider===void 0?null:`${k.provider} `,T===void 0||M===void 0||A===void 0?null:(0,F.jsxs)(F.Fragment,{children:[(0,F.jsx)(A,{className:M,tone:T.tone,children:T.text})," "]}),k.model]})}),C!==void 0&&(0,F.jsx)("span",{className:o.triggerEffort,children:C}),S===void 0?null:(0,F.jsx)(S,{className:o.chevron})]})})}function Bo(e){let n=(0,ie.useCallback)(r=>e===void 0?()=>{}:e.subscribe(r),[e]),t=(0,ie.useCallback)(()=>e?.getSnapshot(),[e]);return(0,ie.useSyncExternalStore)(n,t)}function Wo(e,n){if(!(e===void 0||n===null||n===void 0)){for(let t of e.groups)if(t.id===n.provider){for(let r of t.models)if(r.id===n.model)return{group:t,model:r}}}}function zo(e,n){let t=e?.model.badge;if(t===void 0)return;let r=we(n,t.text);if(r!=="")return{text:r,tone:t.tone}}function Ho(e,n,t,r){if(e===void 0||n===null||n===void 0)return;let o=t?.model.reasoning,i=n.reasoningEffort??o?.defaultEffort;return t===void 0?e.retainedEffort:o===void 0||i===void 0?void 0:o.efforts?.find(d=>d.id===i)?.name??i}function Bt(e){let r=e?.live?.contributions?.get("model")?.ui;return r==null?void 0:r.kind==="popupSelect"?r:void 0}function Wt(e){return{sessionId:e}}function zt(){return{via:"enter",token:""}}var $o=`
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
`,Ht="dsh-better/tabs.css";function $t(e){let n=`style[data-plugin-css=${JSON.stringify(Ht)}]`;if(e.querySelector(n)!==null)return()=>{};let t=e.createElement("style");return t.dataset.plugin="dsh-better",t.dataset.pluginCss=Ht,t.textContent=$o,e.head.append(t),()=>t.remove()}function Ut(e){let n;return e.React.createElement("section",{"data-dsh-better-tabs":"",ref:t=>{if(n?.(),n=void 0,t===null)return;let r=()=>{Uo(t,e)};r(),n=e.controller.subscribe(r)}})}function Uo(e,n){let t=e.ownerDocument,{controller:r,copy:o}=n;e.replaceChildren();let i=t.createElement("h2");i.setAttribute("data-dsh-better-tabs-heading",""),i.textContent=o.heading,e.append(i);let a=r.rows();if(a.length===0){let d=t.createElement("p");d.setAttribute("data-dsh-better-tabs-empty",""),d.textContent=o.empty,e.append(d);return}for(let d of a){let c=t.createElement("label");c.setAttribute("data-dsh-better-tabs-row",d.id);let l=t.createElement("span");l.setAttribute("data-dsh-better-tabs-name",""),l.textContent=d.label;let s=t.createElement("input");s.setAttribute("data-dsh-better-tabs-check",d.id),s.type="checkbox",s.checked=d.enabled,s.setAttribute("aria-label",o.checkboxLabel(d.label,d.enabled)),s.addEventListener("change",()=>{r.setEnabled(d.id,s.checked)}),c.append(l,s),e.append(c)}}var qe="conversation.view",Ve="settings.section",qt="tabs";var ve="chat",Vt="dsh-better.tabs",ae="[data-conversation-tabs]";function Gt(e,n){if(typeof e=="string"&&e!=="")return e;if(typeof e=="function")try{let t=e();if(typeof t=="string"&&t!=="")return t}catch{}return n}function jo(e){if(e===void 0)return new Set;let n;try{n=e.getItem(Vt)}catch{return new Set}if(n===null||n==="")return new Set;try{let t=JSON.parse(n);if(!Array.isArray(t))return new Set;let r=new Set;for(let o of t)typeof o=="string"&&o!==""&&o!==ve&&r.add(o);return r}catch{return new Set}}function qo(e,n){if(e!==void 0)try{e.setItem(Vt,JSON.stringify([...n].sort()))}catch{}}function Vo(e,n){let t=[],r=new Set;for(let o of e){let i=o.options.id;i===void 0||i===ve||r.has(i)||(r.add(i),t.push({id:i,label:Gt(o.options.label,i),enabled:!n.has(i)}))}return t}function Go(e){let n=[],t=new Set;for(let r of e){let o=r.options.id;o===void 0||o===ve||t.has(o)||(t.add(o),n.push({id:o,label:Gt(r.options.label,o)}))}return n}function Ko(e,n,t){let r=new Set;for(let o of Go(e)){if(!n.has(o.id)||o.label==="")continue;t.filter(a=>a.label===o.label).length===1&&r.add(o.label)}return t.map(o=>r.has(o.label))}function Yo(e,n){for(let t of e)if(n!==null&&(t.target===n||n.contains?.(t.target)===!0)||jt(t.addedNodes,n)||jt(t.removedNodes,n))return!0;return!1}function jt(e,n){if(e===void 0)return!1;for(let t=0;t<e.length;t+=1){let r=e[t];if(r!==void 0&&(r.matches?.(ae)===!0||r.querySelector?.(ae)!=null||n!==null&&r.contains?.(n)===!0))return!0}return!1}function Jo(e){let n=e.querySelector(ae);if(n===null||typeof n!="object")return;let r=n.querySelectorAll?.(":scope > button[role='tab']");if(r===void 0)return;let o=[];for(let i=0;i<r.length;i+=1){let a=r[i];a!==void 0&&o.push({label:Xo(a),hidden:a.hasAttribute(xe),mark:d=>{d?a.setAttribute(xe,""):a.removeAttribute(xe)}})}return o}function Xo(e){return(e.querySelector?.("[class*='tabLabel']")?.textContent??e.textContent??"").trim()}function Zo(e,n){let t=!1;for(let[r,o]of e.entries()){let i=n[r]??!1;i!==o.hidden&&(o.mark(i),t=!0)}return t}function Kt(e){let{ledger:n,storage:t}=e,r=e.readButtons??Jo,o=e.watch??ni,i=new Set(jo(t)),a=new Set,d,c=()=>{for(let s of[...a])s()},l=30;return{rows:()=>Vo(n.entriesOfSlot(qe),i),setEnabled(s,u){if(s===ve)return!1;let f=i.has(s);return u===!f?!1:(u?i.delete(s):i.add(s),qo(t,i),d?.(),c(),!0)},subscribe(s){return a.add(s),()=>{a.delete(s)}},attach(s){let u=s.createElement("style");u.dataset.plugin="dsh-better",u.dataset.pluginCss=Qo,u.textContent=ei,s.head.append(u);let f=s.defaultView?.requestAnimationFrame?.bind(s.defaultView),p=s.defaultView?.cancelAnimationFrame?.bind(s.defaultView),m=f===void 0?0:l,h,g=()=>{let E=n.entriesOfSlot(qe),C=r(s);if(C===void 0||C.length===0){m>0&&f!==void 0&&(m-=1,h=f(()=>g()));return}m=l,h=void 0,Zo(C,Ko(E,i,C))},k=n.subscribe(qe,g),T=o(s,g);return d=g,g(),()=>{k(),T(),d=void 0,h!==void 0&&p?.(h),u.remove()}}}}var Qo="dsh-better/strip.css",xe="data-dsh-better-tab-hidden",ei=`${ae} > button[${xe}] { display: none; }`;function ni(e,n){let t=e.defaultView?.MutationObserver,r=e.documentElement;if(t===void 0||r===void 0)return()=>{};let o=new t(i=>{let a=e.querySelector(ae);Yo(i,a!==null&&typeof a=="object"?a:null)&&n()});return o.observe(r,{childList:!0,subtree:!0}),()=>o.disconnect()}var Z="conversation.input.overlay",Yt="settings.section",ii="aliases",ai=56,si="alias-watcher",Xt=50,di="skill-enhancer",li=Xt+1,Ge="conversation.input.model",Ke="conversation.input.attachments",ui=-50,ci=-60,Zt="command-popup",fi=-100,W="better",pi="/better/api/skill-profile",mi=5e3,Ce=null;function Qt(e,n){let t,r=Number.POSITIVE_INFINITY;for(let o of e){if(o.options.id!==Zt)continue;let i=o.component;if(typeof i!="function"||n!==void 0&&i===n)continue;let a=o.options.priority??0;a<r&&(t=i,r=a)}return t}var er={name:"dsh-better",inject:["slots","sessions","commandUi","conversation","locale","modelDirectories","remote","remote.session"],apply(e){let n=globalThis.document;e.effect(()=>e.locale.register(W,st),"dsh-better: locale"),e.effect(()=>lt(n),"dsh-better: effort badge stylesheet"),e.effect(()=>Lt(n),"dsh-better: compaction count stylesheet"),e.effect(()=>Nt(n),"dsh-better: continue button stylesheet");let t=en(Je()),r=Ei(e),o={open:!1};e.effect(()=>{let l=Je(),s=ke(l);e.inject?.(["layout"],p=>{wt(p,s)});let f=(n===void 0?void 0:xt({document:n,storage:l}))?.attach();return()=>{f?.()}},"dsh-better: panel width memory"),e.effect(()=>e.slots.inject(We,()=>e.slots.register({name:We,id:Tt,order:-1,locale:W},Et)),"dsh-better: compaction count"),e.effect(()=>e.slots.inject(ze,()=>Ye(e.slots,{name:ze,id:Pt,order:20,locale:W,inject:l=>({submitContinue:s=>Mt(e,s)})},Dt)),"dsh-better: continue button"),e.effect(()=>e.slots.inject(Z,()=>{let l={},u=Kn({load:Ce,native:()=>Qt(e.slots.entries(Z),l.component),document:n});return l.component=u,e.slots.register({name:Z,id:Zt,priority:fi,locale:W,inject:f=>{let p=Si(e,f);return{popup:ki(e,f),catalog:p?.groups,current:p?.current??null,selectModel:m=>e.modelDirectories?.directoryFor?.(f)?.select?.(m)}}},u)}),"dsh-better: /model provider search"),e.effect(()=>e.slots.inject(Ge,()=>{let l={},u=Ft({load:Ce,native:()=>Xe(e.slots.entries(Ge),l.component),openPicker:f=>yi(e,f),translate:()=>bi(e),document:n});return l.component=u,e.slots.register({name:Ge,priority:ui,locale:W,inject:f=>{let p=e.modelDirectories?.directoryFor?.(f),m=e.locale.resolveText;return{sessionId:f,available:!0,directory:p?.store,load:()=>{p?.load?.()},select:h=>p?.select?.(h),resolveText:h=>we(m?.bind(e.locale),h),renderSlot:(h,g,k)=>k?.fallback??null}}},u)}),"dsh-better: composer model trigger");let i;e.inject?.(["remote.workspaceFiles"],l=>{i=l["remote.workspaceFiles"],l.effect(()=>()=>{i=void 0},"dsh-better: workspace file reader")}),e.effect(()=>e.slots.inject(Ke,()=>{let l={},u=nt({native:()=>Xe(e.slots.entries(Ke),l.component),pathOf:wi,reader:()=>i,translate:()=>e.locale.bind?.(W)});return l.component=u,e.slots.register({name:Ke,priority:ci,locale:W,inject:f=>({sessionId:f,readFileDrag:gi(e),phase:()=>hi(e,f)?.getSnapshot().phase})},u)}),"dsh-better: composer attachment selection");let a;e.inject?.(["inputTriggers"],l=>{a=l.inputTriggers,l.effect(()=>()=>{a=void 0},"dsh-better: alias trigger service"),l.effect(()=>l.inputTriggers.registerSource(cn({config:()=>t.getSnapshot(),translate:r,bareMenuOpen:()=>o.open,routeCommand:(s,u)=>Li(e,u)})),"dsh-better: alias slash source")}),e.effect(()=>e.slots.inject(Z,()=>{let l=hn({store:t,bareMenuOpen:o,inputStoreFor:s=>{let u=e.sessions.scope?.(s);if(!(u===void 0||e.conversation===void 0))try{return e.conversation.input?.for?.(u)?.state}catch{return}},controllerFor:s=>{let u=e.sessions.scope?.(s);if(u===void 0)return;let f=se(e,"inputTriggers")??a;if(f!==void 0)try{return f.sessionOf(u)}catch{return}}});return Ye(e.slots,{name:Z,id:si,order:Xt,inject:s=>({sessionId:s})},l)}),"dsh-better: alias selector watcher"),e.effect(()=>Dn(n),"dsh-better: skill enhancer stylesheet");let d=xi(e);e.effect(()=>e.slots.inject(Z,()=>{let l=In({scopeFor:s=>e.sessions.scope?.(s),inputStoreFor:s=>{let u=e.sessions.scope?.(s);if(!(u===void 0||e.conversation===void 0))try{return e.conversation.input?.for?.(u)?.state}catch{return}},actionsFor:s=>{let u=e.sessions.scope?.(s);if(!(u===void 0||e.conversation===void 0))try{return e.conversation.input?.for?.(u)}catch{return}},skillNamesFor:d.names,loadProfile:async(s,u)=>vi(e,s,u,await d.pathOf(s,u)),loadUsage:(s,u)=>nr(e,s,u),translate:r,document:n});return Ye(e.slots,{name:Z,id:di,order:li,inject:s=>({sessionId:s})},l)}),"dsh-better: skill enhancer"),e.effect(()=>e.slots.inject(Yt,()=>{let l=n===void 0?void 0:pn(n),s=un({store:t,translate:r}),u=Jt(e.slots,{name:Yt,id:ii,order:ai,label:()=>e.locale.bind?.(W)?.("alias.nav")??"Skill aliases",locale:W},s);return()=>{u(),l?.()}}),"dsh-better: alias settings page");let c=Kt({ledger:Ci(e.slots),storage:Je()});e.effect(()=>e.slots.inject(Ve,()=>{let l=globalThis.document,s=l===void 0?void 0:$t(l),u=Jt(e.slots,{name:Ve,id:qt,order:55,label:()=>e.locale.bind?.(W)?.("tabs.nav")??"Tabs"},()=>{let f=Ri(Ce);return f===null?null:Ut({React:f,controller:c,copy:Ti(e)})});return()=>{u(),s?.()}}),"dsh-better: tab management"),e.effect(()=>c.attach(n),"dsh-better: tab visibility"),e.inject?.(["shortcuts"],l=>{l.effect(()=>at(l.shortcuts,{currentSessionId:()=>ot(e),composerMounted:()=>rt(n),focusComposer:s=>it(e,s)},()=>e.locale.bind?.(W)?.(oe)??"Focus message input",s=>console.warn(`dsh-better: focus command not registered (${s})`)),"dsh-better: focus composer shortcut")})}};function gi(e){return n=>se(e,"fileDrag")?.read?.(n)}function hi(e,n){if(n===void 0)return;let t=e.sessions.scope?.(n);if(!(t===void 0||e.conversation===void 0))try{return e.conversation.input?.for?.(t)?.state}catch{return}}function Xe(e,n){let t,r=Number.POSITIVE_INFINITY;for(let o of e){let i=o.component;if(typeof i!="function"||n!==void 0&&i===n)continue;let a=o.options.priority??0;a<r&&(t=i,r=a)}return t}function yi(e,n){if(n===void 0)return!1;let t=Bt(e.commandUi);if(t===void 0)return!1;let r=e.sessions.scope?.(n);if(r===void 0)return!1;let o=e.commandUi.popupFor?.(r);return o===void 0||typeof o.open!="function"?!1:(o.open("model",t,Wt(n),zt()),!0)}function bi(e){return e.locale?.bind?.(W)}function ki(e,n){let t=e.sessions.scope?.(n);if(t!==void 0)return e.commandUi.popupFor?.(t)}function Si(e,n){return e.modelDirectories?.directoryFor?.(n)?.store.getSnapshot()}function wi(e){let n=globalThis.__DSH_HOST_PATHS__;if(n?.pathFor===void 0)return"";try{let t=n.pathFor(e);return typeof t=="string"?t:""}catch{return""}}function Jt(e,n,t){return(e.registerUntyped??e.register).call(e,n,t)}function Ye(e,n,t){return(e.registerUntyped??e.register).call(e,n,t)}function xi(e){let n=new Map,t=new Map,r=async o=>{let i=n.get(o);if(i!==void 0)return i;let a=t.get(o);if(a!==void 0&&Date.now()-a<mi)return;let d=se(e,"remote.skills");if(d!==void 0)try{let c=await d.list({sessionId:o});if(!c.ok){t.set(o,Date.now());return}let l=new Map(c.value.skills.map(s=>[s.name,s]));return n.set(o,l),t.delete(o),l}catch{t.set(o,Date.now());return}};return{names:async o=>new Set((await r(o))?.keys()??[]),pathOf:async(o,i)=>(await r(o))?.get(i)?.path}}async function vi(e,n,t,r){let o=`?sessionId=${encodeURIComponent(n)}&name=${encodeURIComponent(t)}`+(r===void 0?"":`&path=${encodeURIComponent(r)}`);try{let i=await fetch(`${pi}${o}`,{headers:{accept:"application/json"}});return i.ok?await i.json():void 0}catch{return}}function nr(e,n,t){let r=e.sessions.list??se(e,"sessions.list");try{let o=r?.getSnapshot?.(),i=u=>{let p=o?.projectionsBySession?.[u]?.values?.skillUsage;if(typeof p!="object"||p===null)return;let m=p.counts;return typeof m=="object"&&m!==null?m:void 0},a=i(n)?.[t],d=typeof a=="number"&&Number.isFinite(a)?a:0,c=o?.byId?.[n]?.cwd;if(typeof c!="string"||c==="")return{session:d};let l=Object.keys(o?.byId??{}).map(u=>{let f=i(u),p=o?.byId?.[u]?.cwd;return{...typeof p=="string"?{cwd:p}:{},...f===void 0?{}:{usage:f}}}),s=Mn(l,c,t);return s===void 0?{session:d}:{session:d,workspace:s}}catch{return{session:0}}}function Ci(e){return{entriesOfSlot:n=>(e.entriesOfSlot??e.entries).call(e,n),subscribe:(n,t)=>e.subscribe?.(n,t)??(()=>{})}}function Je(){try{return globalThis.localStorage}catch{return}}function se(e,n){try{return typeof e.get=="function"?e.get(n):e[n]}catch{return}}function Li(e,n){let t=n.session?.sessionId;if(t===void 0)return;let r=e.sessions.scope?.(t);if(r===void 0)return;let o=se(e,"inputTriggers");if(o!==void 0)try{let i=o.sessionOf(r),a=e.conversation?.input?.for?.(r)?.state,d=0,c=()=>{let l=a?.getSnapshot();if(!(l===void 0||l.draft.trim()===""||!l.draft.startsWith("/"))){try{let s=l.draft.trimStart().split(/\s/u)[0]??"";if(!s.startsWith("/")||(i.track?.(s,s.length,{tier:"plain"},l.draftRev),i.onSpace?.()===!0))return;i.dismiss?.()}catch{}d+=1,d<4&&setTimeout(c,25)}};setTimeout(c,0)}catch{}}function Ei(e){return(n,t)=>{try{return e.locale.bind?.(W)?.(n,t)??n}catch{return n}}}function Ri(e){if(e===null)return null;try{let n=e("react");if(typeof n!="object"||n===null)return null;let t=n;return typeof t.createElement=="function"?t:null}catch{return null}}function Ti(e){let n=e.locale.bind?.(W),t=(r,o)=>n?.(r)??o;return{heading:t("tabs.heading","Tabs"),empty:t("tabs.empty","No plugin has registered a conversation tab yet."),checkboxLabel:(r,o)=>t(o?"tabs.hide":"tabs.show","{label}").replace("{label}",r)}}function Ai(e){Ce=e}var Pi=er;

    // Hand the loader's `require` to the module's `boot` export before the
    // plugin mounts. Read from `module.exports` rather than the default export:
    // esbuild emits named exports there and the plugin object separately, so the
    // default export alone never carries `boot`.
    if (typeof module.exports.boot === "function") module.exports.boot(require);
    return module.exports.default ?? module.exports;
  }
});
