window.__ModuleLoader__.load({
  id: "dsh-better",
  factory: (require) => {
    var module = { exports: {} };
    var exports = module.exports;
"use strict";var Ue=Object.defineProperty;var Nr=Object.getOwnPropertyDescriptor;var Dr=Object.getOwnPropertyNames;var _r=Object.prototype.hasOwnProperty;var Mr=(e,n)=>{for(var t in n)Ue(e,t,{get:n[t],enumerable:!0})},Fr=(e,n,t,r)=>{if(n&&typeof n=="object"||typeof n=="function")for(let o of Dr(n))!_r.call(e,o)&&o!==t&&Ue(e,o,{get:()=>n[o],enumerable:!(r=Nr(n,o))||r.enumerable});return e};var Br=e=>Fr(Ue({},"__esModule",{value:!0}),e);var ya={};Mr(ya,{boot:()=>ga,clientPlugin:()=>Or,default:()=>ha,findShadowed:()=>Pr,findShadowedSingle:()=>wn,readSkillUsage:()=>Ir});module.exports=Br(ya);var Ce=require("react");var Sn="dsh-better.skill-aliases";var ae=Object.freeze({prefix:!0,rows:Object.freeze([])});function Hr(e,n){if(e!==void 0)try{e.setItem(Sn,JSON.stringify({v:1,prefix:n.prefix,rows:n.rows}))}catch{}}function Se(e,n){return typeof e=="string"?e:n}function Wr(e,n){if(typeof e!="object"||e===null||Array.isArray(e))return;let t=e;if(!(typeof t.keyword!="string"&&typeof t.target!="string"&&typeof t.params!="string"))return{id:Se(t.id,`alias-${n}`)||`alias-${n}`,keyword:Se(t.keyword,""),target:Se(t.target,""),params:Se(t.params,"")}}function zr(e){if(typeof e!="object"||e===null||Array.isArray(e))return ae;let n=e,t=typeof n.prefix=="boolean"?n.prefix:ae.prefix,r=Array.isArray(n.rows)?n.rows:[],o=[],i=new Set;for(let[a,l]of r.slice(0,200).entries()){let u=Wr(l,a);if(u===void 0)continue;let d=u.id,s=0;for(;i.has(d);)s+=1,d=`alias-${a}-${s}`;i.add(d),o.push({...u,id:d})}return{prefix:t,rows:o}}function $r(e){if(e===void 0)return ae;let n;try{n=e.getItem(Sn)}catch{return ae}if(n===null||n==="")return ae;try{return zr(JSON.parse(n))}catch{return ae}}function Ur(){let e=globalThis.crypto;return e?.randomUUID!==void 0?e.randomUUID():`alias-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,8)}`}function Cn(e,n=Ur){let t=$r(e),r=new Set,o=i=>{t=i;for(let a of[...r])try{a()}catch(l){console.error("[dsh-better] alias store listener failed:",l)}Hr(e,i)};return{getSnapshot:()=>t,subscribe(i){return r.add(i),()=>{r.delete(i)}},setPrefix(i){t.prefix!==i&&o({...t,prefix:i})},addRow(){let i=n();return o({...t,rows:[...t.rows,{id:i,keyword:"",target:"",params:""}]}),i},updateRow(i,a){let l=!1,u=t.rows.map(d=>{if(d.id!==i)return d;let s={...d,...a,id:d.id};return l=s.keyword!==d.keyword||s.target!==d.target||s.params!==d.params,s});l&&o({...t,rows:u})},removeRow(i){let a=t.rows.filter(l=>l.id!==i);a.length!==t.rows.length&&o({...t,rows:a})}}}function Ln(e){return e.keyword.trim()!==""&&e.target.trim()!==""}function En(e){return e.keyword.trim().replace(/^\/+/,"").toLowerCase()}function Tn(e,n){let t=n.trim().replace(/^\/+/,"").toLowerCase();return t===""?[]:e.rows.filter(r=>Ln(r)&&En(r)===t)}function Rn(e,n,t=!1){let r=n.trim().replace(/^\/+/,"").toLowerCase(),o=e.rows.filter(Ln);if(r==="")return t?o:[];let i=[],a=[],l=[];for(let u of o){let d=En(u);d===r?i.push(u):d.startsWith(r)?a.push(u):d.includes(r)&&l.push(u)}return[...i,...a,...l]}function An(e){let n=e.target.trim().replace(/^\/+/,"");if(n==="")return"";let t=e.params.trim();return t===""?`/${n} `:`/${n} ${t} `}function Pn(e,n){let t=/^\/([^\s/]+)([ \t]*)$/u.exec(n);if(t===null)return;let r=t[1]??"",o=Tn(e,r);if(o.length!==0)return{query:r,start:0,end:n.length,rows:o}}function On(e,n){let t=/^([^\s/]+)([ \t]*)$/u.exec(n);if(t===null)return;let r=t[1]??"",o=Tn(e,r);if(o.length!==0)return{query:r,start:0,end:n.length,rows:o}}function In(e){if(e.keyword.trim()==="")return"keyword";if(e.target.trim()==="")return"target";if(/\s/.test(e.keyword.trim()))return"keyword"}var R=require("react/jsx-runtime");function Vr(e){let{row:n,store:t,t:r}=e,o=In(n);return(0,R.jsxs)("tr",{"data-testid":"alias-row","data-row-id":n.id,"data-incomplete":o===void 0?void 0:"",children:[(0,R.jsx)("td",{children:(0,R.jsx)("input",{className:"dsh-better-alias-input","data-testid":"alias-keyword",value:n.keyword,placeholder:"wf",spellCheck:!1,autoComplete:"off","aria-label":r("alias.table.keyword"),ref:i=>{i!==null&&e.focus&&(i.focus(),e.clearFocus())},onChange:i=>t.updateRow(n.id,{keyword:i.target.value})})}),(0,R.jsx)("td",{children:(0,R.jsx)("input",{className:"dsh-better-alias-input","data-testid":"alias-target",value:n.target,placeholder:"flow-workflow",spellCheck:!1,autoComplete:"off","aria-label":r("alias.table.target"),onChange:i=>t.updateRow(n.id,{target:i.target.value})})}),(0,R.jsx)("td",{children:(0,R.jsx)("input",{className:"dsh-better-alias-input","data-testid":"alias-params",value:n.params,placeholder:r("alias.table.paramsPlaceholder"),spellCheck:!1,autoComplete:"off","aria-label":r("alias.table.params"),onChange:i=>t.updateRow(n.id,{params:i.target.value})})}),(0,R.jsx)("td",{className:"dsh-better-alias-actions",children:(0,R.jsx)("button",{type:"button",className:"dsh-better-alias-delete","data-testid":"alias-remove","aria-label":r("alias.remove",{keyword:n.keyword.trim()||r("alias.unnamed")}),title:r("alias.remove",{keyword:n.keyword.trim()||r("alias.unnamed")}),onClick:()=>t.removeRow(n.id),children:"\xD7"})})]})}function Nn(e){function n(){let t=(0,Ce.useSyncExternalStore)(e.store.subscribe,e.store.getSnapshot,e.store.getSnapshot),{translate:r}=e,o=(0,Ce.useRef)(null),i=()=>{o.current=e.store.addRow()};return(0,R.jsxs)("section",{className:"dsh-better-alias-page","data-testid":"alias-page",children:[(0,R.jsx)("h2",{className:"dsh-better-alias-heading",children:r("alias.heading")}),(0,R.jsxs)("label",{className:"dsh-better-alias-prefix",children:[(0,R.jsxs)("span",{children:[(0,R.jsx)("span",{className:"dsh-better-alias-prefix-title",children:r("alias.prefix.title")}),(0,R.jsx)("span",{className:"dsh-better-alias-prefix-hint",children:r(t.prefix?"alias.prefix.on":"alias.prefix.off")})]}),(0,R.jsx)("input",{type:"checkbox","data-testid":"alias-prefix",checked:t.prefix,"aria-label":r("alias.prefix.title"),onChange:a=>e.store.setPrefix(a.target.checked)})]}),(0,R.jsxs)("div",{className:"dsh-better-alias-table-wrap",children:[(0,R.jsxs)("table",{className:"dsh-better-alias-table",children:[(0,R.jsx)("thead",{children:(0,R.jsxs)("tr",{children:[(0,R.jsx)("th",{scope:"col",children:r("alias.table.keyword")}),(0,R.jsx)("th",{scope:"col",children:r("alias.table.target")}),(0,R.jsx)("th",{scope:"col",children:r("alias.table.params")}),(0,R.jsx)("th",{scope:"col","aria-label":r("alias.table.actions")})]})}),(0,R.jsx)("tbody",{children:t.rows.map(a=>(0,R.jsx)(Vr,{row:a,store:e.store,t:r,focus:o.current===a.id,clearFocus:()=>{o.current=null}},a.id))})]}),t.rows.length===0?(0,R.jsx)("p",{className:"dsh-better-alias-empty","data-testid":"alias-empty",children:r("alias.empty")}):null]}),(0,R.jsx)("button",{type:"button",className:"dsh-better-alias-add","data-testid":"alias-add",onClick:i,children:r("alias.add")}),(0,R.jsx)("p",{className:"dsh-better-alias-footnote",children:r("alias.footnote")})]})}return n}var Ve="alias",qr="/",jr=-1;function Kr(e,n){let t=e.target.trim().replace(/^\/+/,""),r=e.keyword.trim(),o=e.params.trim();return{name:t,label:r,...o===""?{}:{description:n("alias.menu.params",{value:o})},section:n("alias.menu.section"),value:e.id}}function Dn(e){return{trigger:qr,name:Ve,order:jr,async candidates(n,t){if(t.position!=="leading")return[];let r=e.config();return!r.prefix&&e.bareMenuOpen?.()!==!0?[]:Rn(r,t.query,!0).map(o=>Kr(o,e.translate))},onPick(n){let t=e.config().rows.find(i=>i.id===n.candidate.value);if(t===void 0)return;let r=t.target.trim().replace(/^\/+/,"");r!==""&&e.routeCommand?.(r,n);let o=An(t);return o===""?void 0:{text:o}}}}var _n="dsh-better/aliases.css",Gr=`
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
`;function Mn(e){let n=`style[data-plugin-css=${JSON.stringify(_n)}]`;if(e.querySelector(n)!==null)return()=>{};let t=e.createElement("style");return t.dataset.plugin="dsh-better",t.dataset.pluginCss=_n,t.textContent=Gr,e.head.append(t),()=>t.remove()}var te=require("react");var Fn={draft:"",draftRev:-1,phase:"plain"};function Hn(e){return function(t){let r=(0,te.useSyncExternalStore)(e.store.subscribe,e.store.getSnapshot,e.store.getSnapshot),o=t.sessionId===void 0?void 0:e.inputStoreFor(t.sessionId),i=t.sessionId===void 0?void 0:e.controllerFor(t.sessionId),a=(0,te.useSyncExternalStore)(u=>o===void 0?()=>{}:o.subscribe(u),()=>o===void 0?Fn:o.getSnapshot(),()=>o===void 0?Fn:o.getSnapshot()),l=(0,te.useRef)(null);return(0,te.useEffect)(()=>{let u=t.sessionId;if(u===void 0||a.phase!=="plain"||i===void 0)return;let d=i.menu.getSnapshot().open;if(d&&l.current===null)return;let s=qe(r,a.draft);if(d){let f=l.current;if(f!==null&&(f.draftRev!==a.draftRev||f.spanEnd!==(s?.end??-1))){let p=setTimeout(()=>{let y=o?.getSnapshot()??a,b=e.controllerFor(u);if(b===void 0||y.phase!=="plain")return;l.current=null,b.dismiss();let g=qe(e.store.getSnapshot(),y.draft);g!==void 0&&(e.bareMenuOpen.open=!0,Bn(b,g,y.draftRev),e.bareMenuOpen.open=!1,l.current={draftRev:y.draftRev,spanEnd:g.end})},80);return()=>clearTimeout(p)}return}if(l.current=null,s===void 0)return;let c=setTimeout(()=>{let f=o?.getSnapshot()??a,p=e.controllerFor(u);if(p===void 0||f.phase!=="plain"||p.menu.getSnapshot().open)return;let y=qe(e.store.getSnapshot(),f.draft);y!==void 0&&(e.bareMenuOpen.open=!0,Bn(p,y,f.draftRev),e.bareMenuOpen.open=!1,l.current={draftRev:f.draftRev,spanEnd:y.end})},80);return()=>clearTimeout(c)},[r,a.draft,a.draftRev,a.phase,i,o,t.sessionId]),null}}function qe(e,n){return e.prefix?Pn(e,n):On(e,n)}function Bn(e,n,t){e.toggleSource(Ve,{trigger:"/",query:n.query,quoted:!1,position:"leading",span:{start:n.start,end:n.end,draftRev:t}})}function ee(e){return e!==void 0&&e!=="plain"}var C=require("react");var Yr="[a-z0-9]+(?:-[a-z0-9]+)*",Jr=new RegExp(`^/(${Yr})(?=\\s|$)`,"u");function se(e,n){let t=Jr.exec(e);if(t===null)return;let r=t[1]??"";if(n(r))return{name:r,start:0,end:1+r.length}}function Wn(e,n,t){return e===void 0||!Number.isInteger(t)||t<e.end||t>n.length||t!==n.length?!1:/^[ \t]*$/u.test(n.slice(e.end,t))}var je=/\s/u;function Xr(e){let n=[],t=0;for(;t<e.length;){for(;t<e.length&&je.test(e.charAt(t));)t+=1;let r=t;for(;t<e.length&&!je.test(e.charAt(t));)t+=1;t>r&&n.push({text:e.slice(r,t),start:r})}return n}function zn(e,n,t){if(e==="")return;let r=se(e,n);if(r===void 0||t.length===0)return;let i=Xr(e).slice(1);if(i.length===0)return;let a=je.test(e.charAt(e.length-1)),l=a?i[i.length-1]:i[i.length-2],u=a?void 0:i[i.length-1];if(l===void 0)return;let d=t.find(c=>c.slot===l.text);if(d===void 0)return;if(u===void 0)return{name:r.name,slot:d.slot,query:"",start:e.length};let s=u.text;if(!s.startsWith("--"))return{name:r.name,slot:d.slot,query:s,start:u.start}}function Zr(e,n){let t=e.slug.toLowerCase();if(t.startsWith(n))return 0;if(t.includes(n))return 1;if(e.summary.toLowerCase().includes(n))return 2}function Le(e,n){let t=n.trim().toLowerCase();if(t==="")return e;let r=[];for(let o of e){let i=Zr(o,t);i!==void 0&&r.push({entry:o,tier:i})}return r.sort((o,i)=>o.tier-i.tier),r.map(o=>o.entry)}function $n(e,n){let t=n.trim().toLowerCase();if(t==="")return[];let r=e.toLowerCase(),o=[],i=0;for(;i<=r.length-t.length;){let a=r.indexOf(t,i);if(a===-1)break;o.push({start:a,end:a+t.length}),i=a+t.length}return o}function Ke(e){return`${e.trimEnd()} `}var Qr=/\s/u;function Vn(e,n){let t=se(e,n);if(t===void 0)return;let r=e.length-1;for(;r>=0&&!Qr.test(e.charAt(r));)r-=1;let o=r+1,i=e.slice(o);if(!(i.length<2||!i.startsWith("--")))return{name:t.name,query:i,start:o}}function qn(e,n){let t=n.slice(2).toLowerCase();return e.filter(r=>r.flag.startsWith("--")?r.flag.slice(2).toLowerCase().startsWith(t):!1)}function Un(e,n){let t=0;for(let r of n){let o=r.offset+r.length;if(e>=r.offset&&e<o)return;o<=e&&(t+=r.length-1)}return e-t}function Ee(e,n,t,r){let o=Un(t.start,n);if(o===void 0)return;let i=Un(e.length,n);if(i!==void 0)return{start:o,end:i,draftRev:r}}function jn(e){return`${e} `}function eo(e){let n=e.occurrences;if(!Array.isArray(n))return[];let t=[];for(let r of n){if(typeof r!="object"||r===null)continue;let o=r;typeof o.offset!="number"||typeof o.length!="number"||t.push({offset:o.offset,length:o.length})}return t}var no=/^\/([a-z0-9]+(?:-[a-z0-9]+)*)[ \t]*$/u,to=400,Kn=200,Gn=6,ro=240,Yn={draft:"",draftRev:-1,phase:"plain"};function oo(e,n){return`${e!==""&&!/\s$/u.test(e)?" ":""}${n} `}function et(e){return e===void 0?void 0:no.exec(e)?.[1]}function io(e){return e===void 0?[]:e.split(`
`).map(n=>n.trim()).filter(n=>n!=="")}var Je=240,Xe=640;function nt(e){return!Number.isFinite(e)||e<=0?Xe:Math.max(Je,Math.min(Xe,e-24))}function ao(e,n){let t=nt(n),r=Number.isFinite(e)&&e>0?e:0,o=r===0?Je:r<=80?320:r<200?480:Xe;return Math.min(Math.max(o,Je),t)}function tt(e,n,t,r){if(!Number.isFinite(t)||t<=0)return e;let o=t-n-r;return Math.max(r,Math.min(e,Math.max(r,o)))}function so(e,n,t){if(t<=0||typeof e.createRange!="function")return;let r=e.createRange(),o=t,i=!1,a=u=>{for(let d of Array.from(u.childNodes)){if(d.nodeType===3){let s=d.textContent??"",c=Math.min(o,s.length);if(c<=0)continue;if(i||(r.setStart(d,0),i=!0),r.setEnd(d,c),o-=c,o<=0)return!0;continue}if(a(d))return!0}return!1};if(!a(n)||o>0)return;let l=r.getBoundingClientRect();if(!(l.width===0&&l.height===0))return{left:l.left,right:l.right,top:l.top,bottom:l.bottom}}function Jn(e,n){let t=e.querySelectorAll("[data-composer-text-ref]");for(let r of t){if(et(r.textContent??"")!==n)continue;let o=so(e,r,n.length+1);if(o!==void 0)return o;let i=r.getBoundingClientRect();return{left:i.left,right:i.right,top:i.top,bottom:i.bottom}}}function Re(e){return e.defaultView?.innerWidth??0}function rt(e,n,t,r){let o=e.top-r,i=Number.isFinite(t)&&t>0?t:0;return i===0||i<=o?{left:e.left,top:0,anchor:"above"}:{left:e.left,top:e.bottom+r,anchor:"below"}}function Te(e){return e.defaultView?.innerHeight??0}function Xn(e){let n=typeof e.getSelection=="function"?e.getSelection():null,t=n?.anchorNode;if(t!=null){let l=(t.nodeType===1?t:t.parentElement)?.closest("[data-composer-text-ref]");if(l!=null){let u=n?.getRangeAt===void 0||n.rangeCount===0?void 0:n.getRangeAt(0).getBoundingClientRect();if(u!==void 0&&u.height>0)return{left:u.left,right:u.left,top:u.top,bottom:u.bottom}}}let r=e.querySelectorAll("[data-composer-text-ref]"),o=r[r.length-1];if(o===void 0)return;let i=o.getBoundingClientRect();if(!(i.width===0&&i.height===0))return{left:i.left,right:i.right,top:i.top,bottom:i.bottom}}function Ge(e,n,t){if(n<=0)return;if(e===void 0)return 0;let r=Math.min(e,n-1);return t==="up"?Math.max(0,r-1):Math.min(n-1,r+1)}function Zn(e,n,t,r){let o=$n(t,r);if(o.length===0){n.append(e.createTextNode(t));return}let i=0;for(let a of o){a.start>i&&n.append(e.createTextNode(t.slice(i,a.start)));let l=e.createElement("mark");l.className="dsh-better-skill-catalog-mark",l.textContent=t.slice(a.start,a.end),n.append(l),i=a.end}i<t.length&&n.append(e.createTextNode(t.slice(i)))}function lo(e,n){let t=e.createElement("div");t.className="dsh-better-skill-catalog";let r=e.createElement("div");return r.className="dsh-better-skill-catalog-title",r.textContent=`/${n.name} ${n.slot}`,t.append(r),n.getActions()?.insertText!==void 0&&n.entries.forEach((o,i)=>{t.append(uo(e,n,o,i===n.selected))}),t.style.width=`${Ze(e)}px`,t}function uo(e,n,t,r){let o=e.createElement("button");o.type="button",o.className=r?"dsh-better-skill-catalog-row dsh-better-skill-catalog-selected":"dsh-better-skill-catalog-row",o.addEventListener("pointerdown",l=>l.preventDefault());let i=e.createElement("span");i.className="dsh-better-skill-catalog-slug",Zn(e,i,t.slug,n.match.query),o.append(i);let a=e.createElement("span");return a.className="dsh-better-skill-catalog-summary",Zn(e,a,t.summary,n.match.query),o.append(a),o.addEventListener("click",()=>{let l=n.getActions(),u=l?.captureInsertion?.();if(l?.insertText===void 0||u===void 0)return;let d=Ee(n.getDraft(),n.getOccurrences(),n.match,u.draftRev);d!==void 0&&l.insertText(Ke(t.slug),d)}),o}function co(e,n){let t=e.createElement("div");t.className="dsh-better-skill-params";let r=e.createElement("div");if(r.className="dsh-better-skill-params-title",r.textContent=`/${n.name}`,t.append(r),n.getActions()?.insertText!==void 0)for(let o of n.params)t.append(fo(e,n,o.flag,o.detail));return t.style.width=`${Ze(e)}px`,t}function Ze(e){return Math.min(320,nt(Re(e)))}function Qn(e,n,t){if(t===void 0)return;let r=4,o=Re(e),i=Ze(e);n.style.width=`${i}px`;let a=rt(t,Te(e),n.offsetHeight,r);n.style.left=`${tt(a.left,i,o,12)}px`,a.anchor==="above"?(n.style.bottom=`${Te(e)-t.top+r}px`,n.style.top=""):(n.style.top=`${a.top}px`,n.style.bottom="")}function fo(e,n,t,r){let o=e.createElement("button");o.type="button",o.className="dsh-better-skill-panel-param",o.addEventListener("pointerdown",a=>a.preventDefault());let i=e.createElement("span");if(i.className="dsh-better-skill-panel-param-flag",i.textContent=t,o.append(i),r!==""){let a=e.createElement("span");a.className="dsh-better-skill-panel-param-detail",a.textContent=r,o.append(a)}return o.addEventListener("click",()=>{let a=n.getActions(),l=a?.captureInsertion?.();if(a?.insertText===void 0||l===void 0)return;let u=Ee(n.getDraft(),n.getOccurrences(),n.match,l.draftRev);u!==void 0&&a.insertText(jn(t),u)}),o}function ot(e){return function(t){let r=e.document??globalThis.document,o=t.sessionId,i=o===void 0?void 0:e.inputStoreFor(o),a=t.useInput,l=a===void 0?void 0:a(h=>h.draft),u=a===void 0?void 0:a(h=>h.phase),d=a===void 0?void 0:a(h=>h.occurrences),s=(0,C.useSyncExternalStore)(h=>i===void 0?()=>{}:i.subscribe(h),()=>i===void 0?Yn:i.getSnapshot(),()=>i===void 0?Yn:i.getSnapshot()),c=l??s.draft,f=u??s.phase,[p,y]=(0,C.useState)(()=>new Set),[b,g]=(0,C.useState)(void 0),[w,I]=(0,C.useState)(void 0),[P,E]=(0,C.useState)(void 0),[B,U]=(0,C.useState)(void 0),[v,S]=(0,C.useState)(void 0),[m,O]=(0,C.useState)(void 0),[N,M]=(0,C.useState)(void 0),[H,j]=(0,C.useState)(void 0),[D,V]=(0,C.useState)(void 0);(0,C.useEffect)(()=>{if(o===void 0)return;let h=!0;return e.skillNamesFor(o).then(x=>{h&&y(x)},()=>{h&&y(new Set)}),()=>{h=!1}},[o]);let fe=se(c,h=>p.has(h)),Y=Wn(fe,c,c.length)&&!ee(f)?fe?.name:void 0,k=Vn(c,h=>p.has(h)),L=k!==void 0&&!ee(f)&&v!==c,T=zn(c,h=>p.has(h),b?.assists??[]),X=b?.catalogs?.workflows??[],Z=T!==void 0&&X.length>0&&!ee(f)&&N!==c&&!L,We=Y??w??(L?k.name:T?.name);(0,C.useEffect)(()=>{if(o===void 0||We===void 0){g(void 0);return}let h=!0;return e.loadProfile(o,We).then(x=>{h&&g(x)},()=>{h&&g(void 0)}),()=>{h=!1}},[o,We]),(0,C.useEffect)(()=>{if(r===void 0||Y===void 0){E(void 0);return}let h=()=>E(Jn(r,Y));h();let x=r.defaultView;return x?.addEventListener("resize",h),()=>x?.removeEventListener("resize",h)},[r,Y,c]);let pe=(0,C.useRef)(null),ne=(0,C.useRef)(null),xe=()=>{pe.current!==null&&clearTimeout(pe.current),pe.current=null},me=()=>{ne.current!==null&&clearTimeout(ne.current),ne.current=null};(0,C.useEffect)(()=>{if(r===void 0||o===void 0)return;let h=W=>{let z=W.target;if(!(z instanceof r.defaultView.Element))return;let he=z.closest("[data-composer-text-ref]");if(he===null)return;let Q=et(he.textContent??"");Q!==void 0&&(me(),xe(),pe.current=setTimeout(()=>{pe.current=null,I(Q),E(Jn(r,Q)),U(e.loadUsage(o,Q))},to))},x=W=>{let z=W.target;z instanceof r.defaultView.Element&&z.closest("[data-composer-text-ref]")!==null&&(xe(),me(),ne.current=setTimeout(()=>{ne.current=null,I(void 0)},Kn))};return r.addEventListener("pointerover",h,!0),r.addEventListener("pointerout",x,!0),()=>{xe(),me(),r.removeEventListener("pointerover",h,!0),r.removeEventListener("pointerout",x,!0)}},[r,o]),(0,C.useEffect)(()=>{if(r===void 0||w===void 0)return;let h=x=>{x.key==="Escape"&&I(void 0)};return r.addEventListener("keydown",h),()=>r.removeEventListener("keydown",h)},[r,w]);let J=(0,C.useRef)(c);J.current=c;let ge=(0,C.useRef)(void 0);ge.current=t.inputActions??(o===void 0?void 0:e.actionsFor(o));let ve=(0,C.useRef)([]);ve.current=eo({draft:c,draftRev:s.draftRev,phase:f,occurrences:d??s.occurrences});let ze=(0,C.useRef)(void 0),$e=(0,C.useRef)(void 0);return(0,C.useEffect)(()=>{if(r===void 0||Y===void 0||P===void 0)return;let h=io(b?.argumentHint);if(h.length===0)return;let x=po(r,P,h);return r.body.append(x),()=>x.remove()},[r,Y,P,b]),(0,C.useEffect)(()=>{if(r===void 0||w===void 0||L)return;let h=mo(r,e,{name:w,profile:b,usage:B,box:P,sessionId:o,getActions:()=>ge.current,getDraft:()=>J.current,onEnter:me,onLeave:()=>{xe(),me(),ne.current=setTimeout(()=>{ne.current=null,I(void 0)},Kn)}});return r.body.append(h),()=>h.remove()},[r,w,b,B,P,o,L]),(0,C.useEffect)(()=>{if(r===void 0||!L){O(void 0);return}let h=()=>O(Xn(r));h();let x=r.defaultView;return x?.addEventListener("resize",h),()=>x?.removeEventListener("resize",h)},[r,L,c]),(0,C.useEffect)(()=>{if(r===void 0||!L||k===void 0)return;let h=qn(b?.params??[],k.query);if(h.length===0)return;let x=co(r,{name:k.name,match:k,params:h,getActions:()=>ge.current,getDraft:()=>J.current,getOccurrences:()=>ve.current});return ze.current=x,r.body.append(x),Qn(r,x,m),()=>{ze.current=void 0,x.remove()}},[r,L,k,b,m]),(0,C.useEffect)(()=>{if(r===void 0||!L)return;let h=x=>{x.key==="Escape"&&S(J.current)};return r.addEventListener("keydown",h),()=>r.removeEventListener("keydown",h)},[r,L]),(0,C.useEffect)(()=>{if(r===void 0||!L)return;let h=x=>{let W=ze.current,z=x.target;W!==void 0&&z instanceof Node&&W.contains(z)||S(J.current)};return r.addEventListener("pointerdown",h,!0),()=>r.removeEventListener("pointerdown",h,!0)},[r,L]),(0,C.useEffect)(()=>{if(r===void 0||!Z){j(void 0);return}let h=()=>j(Xn(r));h();let x=r.defaultView;return x?.addEventListener("resize",h),()=>x?.removeEventListener("resize",h)},[r,Z,c]),(0,C.useEffect)(()=>{V(void 0)},[T?.query]),(0,C.useEffect)(()=>{if(r===void 0||!Z||T===void 0)return;let h=Le(X,T.query);if(h.length===0)return;let x=lo(r,{name:T.name,slot:T.slot,match:T,entries:h,selected:Ge(D,h.length,"down")??0,getActions:()=>ge.current,getDraft:()=>J.current,getOccurrences:()=>ve.current});return $e.current=x,r.body.append(x),Qn(r,x,H),()=>{$e.current=void 0,x.remove()}},[r,Z,T,X,D,H]),(0,C.useEffect)(()=>{if(r===void 0||!Z)return;let h=x=>{if(x.key==="Escape"){M(J.current);return}if(!(x.key!=="ArrowUp"&&x.key!=="ArrowDown"&&x.key!=="Enter")&&!x.isComposing){if(x.preventDefault(),x.stopPropagation(),x.key==="Enter"){let W=Le(X,T?.query??""),z=Ge(D,W.length,"down"),he=z===void 0?void 0:W[z];if(he===void 0||T===void 0)return;let Q=ge.current,xn=Q?.captureInsertion?.();if(Q?.insertText===void 0||xn===void 0)return;let vn=Ee(J.current,ve.current,T,xn.draftRev);if(vn===void 0)return;Q.insertText(Ke(he.slug),vn);return}V(W=>Ge(W,Le(X,T?.query??"").length,x.key==="up"?"up":"down"))}};return r.addEventListener("keydown",h,!0),()=>r.removeEventListener("keydown",h,!0)},[r,Z,T,X,D]),(0,C.useEffect)(()=>{if(r===void 0||!Z)return;let h=x=>{let W=$e.current,z=x.target;W!==void 0&&z instanceof Node&&W.contains(z)||M(J.current)};return r.addEventListener("pointerdown",h,!0),()=>r.removeEventListener("pointerdown",h,!0)},[r,Z]),null}}function po(e,n,t){let r=e.createElement("div");r.className="dsh-better-skill-hint",r.textContent=t.join(`
`);let o=n.right+Gn>Re(e)-ro;return r.style.left=`${o?n.left:n.right+Gn}px`,r.style.top=`${o?n.bottom+2:n.top}px`,r}function mo(e,n,t){let r=e.createElement("div");r.className="dsh-better-skill-panel",r.addEventListener("pointerenter",t.onEnter),r.addEventListener("pointerleave",t.onLeave);let o=e.createElement("div");o.className="dsh-better-skill-panel-title",o.textContent=`/${t.name}`,r.append(o);let i=t.profile?.description;if(i!==void 0&&i!==""){let s=e.createElement("div");s.className="dsh-better-skill-panel-desc",s.textContent=i,s.title=i,r.append(s)}let a=t.profile?.metadata??{},l=Object.keys(a);if(l.length>0){let s=e.createElement("div");s.className="dsh-better-skill-panel-section",s.append(Ye(e,n.translate("skill.metadata")));for(let c of l){let f=e.createElement("div");f.textContent=`${c}: ${a[c]??""}`,s.append(f)}r.append(s)}let u=t.profile?.path;if(u!==void 0&&u!==""){r.append(Ye(e,n.translate("skill.path")));let s=e.createElement("div");s.className="dsh-better-skill-panel-path",s.textContent=u,r.append(s)}if(t.usage!==void 0){let s=e.createElement("div");s.className="dsh-better-skill-panel-counts",s.textContent=`${n.translate("skill.usage.session")} ${t.usage.session}`,t.usage.workspace!==void 0&&(s.textContent+=` \xB7 ${n.translate("skill.usage.workspace")} ${t.usage.workspace}`),r.append(s)}let d=t.profile?.params??[];if(d.length>0&&t.getActions()?.insertText!==void 0){r.append(Ye(e,n.translate("skill.params")));for(let s of d)r.append(go(e,n,t,s.flag,s.detail))}{let c=Re(e),f=ao(i?.length??0,c);if(r.style.width=`${f}px`,t.box!==void 0){let p=rt(t.box,Te(e),r.offsetHeight,4);r.style.left=`${tt(p.left,f,c,12)}px`,p.anchor==="above"?(r.style.bottom=`${Te(e)-t.box.top+4}px`,r.style.top=""):(r.style.top=`${p.top}px`,r.style.bottom="")}}return r}function Ye(e,n){let t=e.createElement("div");return t.className="dsh-better-skill-panel-label",t.textContent=n,t}function go(e,n,t,r,o){let i=e.createElement("button");i.type="button",i.className="dsh-better-skill-panel-param",i.title=n.translate("skill.hint.insert"),i.addEventListener("pointerdown",l=>l.preventDefault());let a=e.createElement("span");if(a.className="dsh-better-skill-panel-param-flag",a.textContent=r,i.append(a),o!==""){let l=e.createElement("span");l.className="dsh-better-skill-panel-param-detail",l.textContent=o,i.append(l)}return i.addEventListener("click",()=>{let l=t.getActions();if(l?.insertText===void 0||l.captureInsertion===void 0)return;let u=l.captureInsertion();l.insertText(oo(t.getDraft(),r),u)}),i}var it="dsh-better/skill-enhancer.css",ho=`
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
/* The workflow catalogue panel. It shares the flag list's surface, width and
   max height because the two never appear together: the flag list wins a
   trailing double dash, so a different fill or size would read as a glitch at
   the handover. Only the row's own contents differ, since a row here carries a
   goal beside the slug. */
.dsh-better-skill-catalog {
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
.dsh-better-skill-catalog-title {
  padding: 2px 6px 4px;
  color: var(--dsw-alias-label-caption);
  font-size: 11px;
}
.dsh-better-skill-catalog-row {
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
.dsh-better-skill-catalog-row:hover {
  background: var(--dsw-alias-interactive-bg-hover);
}
/* The keyboard moves the highlight, so it has to be visible without the pointer:
   the same fill as hover, because a row that is current and a row under the
   pointer mean the same thing here. */
.dsh-better-skill-catalog-selected {
  background: var(--dsw-alias-interactive-bg-hover);
}
.dsh-better-skill-catalog-row:focus-visible {
  outline: 2px solid var(--dsw-alias-state-business-primary);
  outline-offset: 1px;
}
.dsh-better-skill-catalog-slug {
  flex: none;
  color: var(--dsw-alias-state-business-primary);
  font-family: var(--dsw-font-mono, ui-monospace, monospace);
}
.dsh-better-skill-catalog-summary {
  overflow: hidden;
  color: var(--dsw-alias-label-caption);
  text-overflow: ellipsis;
  white-space: nowrap;
}
/* The matched run inside a slug or a goal. A mark carries a browser default
   background, which is unreadable on the panel's own fill, so both are stated. */
.dsh-better-skill-catalog-mark {
  border-radius: 2px;
  background: var(--dsw-alias-interactive-bg-hover);
  color: inherit;
  font-weight: 600;
}
`;function at(e){if(e===void 0)return()=>{};let n=`style[data-plugin-css=${JSON.stringify(it)}]`;if(e.querySelector(n)!==null)return()=>{};let t=e.createElement("style");return t.dataset.plugin="dsh-better",t.dataset.pluginCss=it,t.textContent=ho,e.head.append(t),()=>t.remove()}function st(e,n,t){if(n===void 0||n===""||e.length===0)return;let r=0;for(let o of e){if(o.cwd!==n)continue;let i=o.usage?.[t];typeof i=="number"&&Number.isFinite(i)&&(r+=i)}return r}var A=require("react");var yo="@deepseek-ai/dsh-client-ui-commands/PopupSelectView.module.css";function lt(e){if(e===void 0)return;let t=e.querySelector(`style[data-plugin-css="${yo}"]`)?.textContent??"",r=i=>new RegExp(`\\.(\\w+_${i})\\{`,"u").exec(t)?.[1],o={badges:"dshBetter_badges",badgeChip:"dshBetter_badgeChip",badgeChipOn:"dshBetter_badgeChipOn",card:r("card"),viewport:r("viewport"),row:r("row"),rowActive:r("rowActive"),label:r("label"),labelText:r("labelText"),badge:r("badge"),detail:r("detail"),check:r("check"),status:r("status"),search:r("search"),error:r("error"),errorText:r("errorText"),retry:r("retry")};for(let[i,a]of Object.entries(o))if(!(i==="badges"||i==="badgeChip"||i==="badgeChipOn")&&a===void 0)return;return o}function Qe(e,n){for(let t of e)if(t.id===n.provider){for(let r of t.models)if(r.id===n.model)return r.reasoning}}function dt(e,n){let t=Qe(e,n)?.efforts;return t===void 0?[]:[...t]}function ut(e,n){if(e.length===0)return;let t=r=>r!==void 0&&e.some(o=>o.id===r);return t(n.remembered)?n.remembered:n.isCurrent&&t(n.currentEffort)?n.currentEffort:t(n.defaultEffort)?n.defaultEffort:e[0]?.id}function bo(e){return e.length>1}function ct(e){return bo(e)?e:[]}var K=require("react/jsx-runtime");function Ae(e){let n=e.group?.name;if(n===void 0)return;let t=`${n}/`,r=e.id.startsWith(t)?e.id.slice(t.length):e.id;return{provider:n,model:r}}function ko(e,n){let t=Ae(e);return ct(t===void 0?[]:dt(n??[],t))}function ft({option:e,active:n,catalog:t,pointed:r,classes:o,primitives:i,onChoose:a,onPickEffort:l,onHover:u,t:d}){let s=ko(e,t),c=i.IconCheckOutlineRegular;return(0,K.jsxs)("div",{role:"option","aria-selected":n,"aria-label":e.badge===void 0?void 0:`${e.label} ${e.badge}`,className:n?`${o.row} ${o.rowActive}`:o.row,onClick:a,onMouseEnter:u,children:[(0,K.jsxs)("span",{className:o.label,children:[(0,K.jsx)("span",{className:o.labelText,children:e.label}),e.badge!==void 0&&(0,K.jsx)("sup",{className:o.badge,children:e.badge})]}),e.detail!==void 0&&(0,K.jsx)("span",{className:o.detail,children:e.detail}),s.length>0&&(0,K.jsx)("span",{className:o.badges,role:"group","aria-label":d?.("listbox.aria")??"",children:s.map(f=>(0,K.jsx)("button",{type:"button",className:f.id===r?`${o.badgeChip} ${o.badgeChipOn}`:o.badgeChip,title:f.description??f.name,onClick:p=>{p.stopPropagation(),l(f.id)},children:f.name},f.id))}),e.active===!0&&s.length===0&&(0,K.jsx)("span",{className:o.check,children:c===void 0?null:(0,K.jsx)(c,{})})]})}function Pe(e){let n=new Map;for(let t of e){let r=t.group?.name,o=n.get(r);o!==void 0?o.rows.push(t):n.set(r,{group:t.group,rows:[t]})}return[...n.values()]}function Oe(e){let n=Pe(e);return n.some(t=>t.group!==void 0)?n.flatMap(t=>t.rows):[...e]}function pt(e,n,t){return t===void 0?e.filter(r=>r.label.toLowerCase().includes(n)):Pe(e).flatMap(r=>t(r.rows.map(o=>({name:o.label,option:o})),n).map(o=>o.option))}var en=new WeakSet;async function mt(e,n){let t=e.binding,r=e.state.getSnapshot();if(!(t===null||r.submitting||en.has(e))){en.add(e),e.state.set?.({...r,submitting:!0,confirming:null,acknowledged:!1,error:null});try{let o=n();if(o===void 0)return;await o,t!==null&&e.binding===t&&e.deps?.consume?.(t.segment)}finally{en.delete(e),t!==null&&e.binding===t&&e.dismiss({focusComposer:!0})}}}var wo="@deepseek-ai/dsh-client-ui-primitives";function Ie(e){if(e===null)return{};let n;try{n=e(wo)}catch{return{}}if(n===null||typeof n!="object")return{};let t=n,r=g=>typeof g=="function"||typeof g=="object"&&g!==null,o=g=>{let w=t[g];return r(w)?w:void 0},i=g=>{let w=t[g];return typeof w=="function"?w:void 0},a={},l=o("MenuSurface");l!==void 0&&(a.MenuSurface=l);let u=o("MenuGroup");u!==void 0&&(a.MenuGroup=u);let d=o("IconCheckOutlineRegular");d!==void 0&&(a.IconCheckOutlineRegular=d);let s=o("IconDataOutlineRegular");s!==void 0&&(a.IconDataOutlineRegular=s);let c=o("IconChevronDownOutlineRegular");c!==void 0&&(a.IconChevronDownOutlineRegular=c);let f=o("Tag");f!==void 0&&(a.Tag=f);let p=i("useAnchoredMaxHeight");p!==void 0&&(a.useAnchoredMaxHeight=p);let y=i("observeStickyMenuGroups");y!==void 0&&(a.observeStickyMenuGroups=y);let b=i("rankByName");return b!==void 0&&(a.rankByName=b),a}function xo(e){if(e===void 0)return[];let n=[e.name,e.label].map(t=>t.trim().toLowerCase()).filter(t=>t!=="");return[...new Set(n)]}function vo(e,n){return xo(e.group).some(t=>t.includes(n))}function So(e,n,t,r){return t==="fuzzy-label"?pt(e,n,r):Oe(e).filter(o=>o.label.toLowerCase().includes(n)||o.detail?.toLowerCase().includes(n)===!0)}function gt(e,n,t,r){let o=n.trim().toLowerCase();if(o==="")return Oe(e);let i=So(e,o,t,r),a=new Set(i),l=Oe(e).filter(u=>!a.has(u)&&vo(u,o));return[...i,...l]}var _=require("react/jsx-runtime"),kt="model",ht=320;function Co(e){return e.command!==kt||!e.open||e.status!=="ready"||e.confirming!==null||e.options.length===0?!1:e.submitting||e.error===null}function Lo(e){return e===void 0?!1:/Android|iPhone|iPad|iPod/i.test(e.userAgent)||e.platform==="MacIntel"&&e.maxTouchPoints>1}var Eo={subscribe:()=>()=>{},getSnapshot:()=>({open:!1,command:null,status:"pending",options:[],search:"",searchLabels:null,searchMode:"substring",active:0,submitting:!1,confirming:null,acknowledged:!1,error:null})};function wt(e){let n=Ie(e.load);function t(r){let o=r.popup,i=o?.state??Eo,a=(0,A.useCallback)(s=>i.subscribe(s),[i]),l=(0,A.useCallback)(()=>i.getSnapshot(),[i]),u=(0,A.useSyncExternalStore)(a,l),d=e.native();return o===void 0||d===void 0?null:!Co(u)||o.settle===void 0?(0,_.jsx)(d,{...r}):(0,_.jsx)(To,{popup:o,state:u,t:r.t,primitives:n,doc:e.document,catalog:r.catalog,current:r.current,selectModel:r.selectModel})}return t}function To({popup:e,state:n,t,primitives:r,doc:o,catalog:i,current:a,selectModel:l}){let u=(0,A.useRef)(null),d=(0,A.useRef)(null),s=(0,A.useRef)(null),c=(0,A.useMemo)(()=>lt(o),[o]),f=n.searchMode,p=(0,A.useMemo)(()=>gt(n.options,n.search,f,r.rankByName),[n.options,n.search,f,r.rankByName]),y=(0,A.useMemo)(()=>Pe(p),[p]),[b,g]=(0,A.useState)({}),[w,I]=(0,A.useState)(()=>yt(p));(0,A.useEffect)(()=>{I(yt(p))},[n.search,n.options]);let P=bt(p,w),E=Ro(r,u,n);(0,A.useEffect)(()=>{let k=s.current;if(!(k===null||r.observeStickyMenuGroups===void 0))return r.observeStickyMenuGroups(k)},[r.observeStickyMenuGroups,n.open,n.status,y]),(0,A.useEffect)(()=>{u.current?.querySelector('[aria-selected="true"]')?.scrollIntoView({block:"nearest"})},[P,p]),(0,A.useEffect)(()=>{if(!n.open)return;let k=L=>{let T=u.current;T!==null&&L.target instanceof Node&&T.contains(L.target)||e.dismiss()};return o?.addEventListener("pointerdown",k,!0),()=>{o?.removeEventListener("pointerdown",k,!0)}},[o,e,n.open]),(0,A.useEffect)(()=>{n.open&&(Lo(o?.defaultView?.navigator)||d.current?.focus())},[o,n.open]);let B=(0,A.useCallback)((k,L)=>{if(L===void 0||l===void 0){e.settle?.(e.binding,k);return}let T=Ae(k);if(T===void 0){e.settle?.(e.binding,k);return}mt(e,()=>l({...T,reasoningEffort:L}))},[e,l]),U=(0,A.useCallback)(k=>{let L=Ae(k);if(L===void 0)return;let T=Qe(i??[],L);return ut(T?.efforts??[],{remembered:b[k.id],isCurrent:a?.provider===L.provider&&a?.model===L.model,currentEffort:a?.reasoningEffort,defaultEffort:T?.defaultEffort})},[i,a,b]),v=(0,A.useCallback)(k=>{B(k,U(k))},[U,B]),S=(0,A.useCallback)((k,L)=>{g(T=>({...T,[k.id]:L})),B(k,L)},[B]),m=(0,A.useCallback)(()=>{let k=p[P];k!==void 0&&v(k)},[P,v,p]),O=(0,A.useCallback)(k=>{p.length!==0&&I(L=>(bt(p,L)+k+p.length)%p.length)},[p]),N=k=>{switch(k.key){case"ArrowDown":k.preventDefault(),O(1);return;case"ArrowUp":k.preventDefault(),O(-1);return;case"Enter":k.preventDefault(),m();return;case"Tab":if(!k.shiftKey&&p.length===0)return;k.preventDefault(),k.shiftKey?e.dismiss({focusComposer:!0}):m();return;case"Escape":k.preventDefault(),e.dismiss({focusComposer:!0});return;default:}};if(c===void 0)return null;let M=n.searchLabels?.placeholder??t?.("search.placeholder")??"",H=n.searchLabels===null?t?.("status.empty")??"":n.options.length===0?n.searchLabels.empty:n.searchLabels.noResults,j=(k,L)=>(0,_.jsx)(ft,{option:k,active:L===P,catalog:i,pointed:L===P?U(k):void 0,classes:c,primitives:r,onChoose:()=>{v(k)},onPickEffort:T=>{S(k,T)},onHover:()=>{I(L)},t},k.id),D=0,V=y.map(({group:k,rows:L})=>{let T=L.map(X=>j(X,D++));return k===void 0?(0,_.jsx)(A.Fragment,{children:T},"ungrouped"):r.MenuGroup===void 0?(0,_.jsx)(A.Fragment,{children:T},`group:${k.name}`):(0,_.jsx)(r.MenuGroup,{label:k.label,children:T},`group:${k.name}`)}),fe=(0,_.jsxs)(_.Fragment,{children:[(0,_.jsx)("input",{ref:d,className:c.search,type:"text",placeholder:M,"aria-label":t?.("search.aria")??"",value:n.search,readOnly:n.submitting,onChange:k=>{e.setSearch(k.currentTarget.value)}}),n.submitting&&(0,_.jsx)("div",{className:c.status,children:t?.("status.applying")??""}),!n.submitting&&p.length===0&&(0,_.jsx)("div",{className:c.status,children:H}),p.length>0&&(0,_.jsx)("div",{ref:s,role:"listbox","aria-label":t?.("listbox.aria")??"",className:c.viewport,children:V})]}),Y={className:c.card,style:{maxHeight:E},"aria-label":t?.("overlay.aria")??kt,onKeyDown:N};return r.MenuSurface===void 0?(0,_.jsx)("div",{ref:u,...Y,children:fe}):(0,_.jsx)(r.MenuSurface,{ref:u,...Y,children:fe})}function yt(e){let n=e.findIndex(t=>t.active===!0);return n===-1?0:n}function bt(e,n){return e.length===0?0:Math.min(Math.max(n,0),e.length-1)}function Ro(e,n,t){let r=e.useAnchoredMaxHeight;return r===void 0?ht:r(n,ht,t)}var q=require("react");var nn="application/x-dsh-composer+json";var Ao=Object.freeze({png:"image/png",jpg:"image/jpeg",jpeg:"image/jpeg",webp:"image/webp",gif:"image/gif",bmp:"image/bmp",svg:"image/svg+xml",avif:"image/avif",heic:"image/heic",heif:"image/heif",tif:"image/tiff",tiff:"image/tiff"});function xt(e){return JSON.stringify({v:1,text:e.text,attachments:e.attachments.map(n=>({path:n.path,name:n.name,type:n.type,kind:n.kind}))})}function vt(e){if(typeof e!="string"||e==="")return;let n;try{n=JSON.parse(e)}catch{return}if(n===null||typeof n!="object")return;let t=n;if(t.v!==1)return;let r=typeof t.text=="string"?t.text:"",o=Array.isArray(t.attachments)?t.attachments:[],i=[];for(let a of o){if(a===null||typeof a!="object")continue;let l=a,u=l.path;typeof u!="string"||u===""||i.push({path:u,name:typeof l.name=="string"&&l.name!==""?l.name:rn(u),type:typeof l.type=="string"?l.type:"",kind:l.kind==="image"?"image":"file"})}return{text:r,attachments:i}}function tn(e,n){if(n.length===0)return e;let t=n.join(`
`);return e===""?t:`${e.replace(/\n+$/u,"")}

${t}`}function St(e){if(e==="")return;let n=e.split(`
`),t=[],r=n.length;for(let i=n.length-1;i>=0;i-=1){let a=n[i]??"";if(a.trim()===""){if(t.length>0){r=i;continue}continue}let l=Po(a);if(l===void 0)break;t.unshift(l),r=i}return t.length===0?void 0:{text:n.slice(0,r).join(`
`).replace(/\n+$/u,""),paths:t}}function Po(e){let n=e.trim();if(n.startsWith("@")&&(n=n.slice(1)),n.startsWith('"')&&n.endsWith('"')&&n.length>1&&(n=n.slice(1,-1)),n!==""&&Oo(n)&&!/[\u0000-\u001f\u007f]/u.test(n)&&!/["\u2018\u2019\u201c\u201d\u300c\u300d\u300e\u300f\u3002\uff01\uff1f\uff1b\uff1a\uff0c\u3001\u2026*?;<>|&$`!#=]/u.test(n)&&!/(?:^|\s)-{1,2}\S/u.test(n))return n}function Oo(e){return e.startsWith("/")||/^[A-Za-z]:[/\\]/u.test(e)||e.startsWith("\\\\")}function Ct(e){let n=/\.([A-Za-z0-9]+)$/u.exec(e);if(n!==null)return Ao[n[1]?.toLowerCase()??""]}function rn(e){return e.split(/[\\/]/u).filter(t=>t!=="").at(-1)??e}function Lt(e,n){let t=new Set(n),r=[],o=[];for(let i of e){if(t.has(i.path)){o.push(i.path);continue}t.add(i.path),r.push(i)}return{accepted:r,duplicates:o}}var le=require("react/jsx-runtime"),Io="data-dsh-better-attach-item",No="data-dsh-better-attach-selected",Do=4500,_o=new Set(["a","c","x","insert"]),Mo=new Set(["meta","control","shift","alt","altgraph","capslock","os"]),Fo=/\s/u;function Tt(e){function n(t){let r=e.native();return r===void 0?null:(0,le.jsx)(Bo,{native:r,props:t,deps:e})}return n}function Bo({native:e,props:n,deps:t}){let r=(0,q.useRef)(null),[o,i]=(0,q.useState)(!1),[a,l]=(0,q.useState)(null),u=(n.attachments??[]).length>0,d=(0,q.useRef)(n);d.current=n;let s=(0,q.useRef)(o);s.current=o;let c=(p,y)=>n.t?.(p,y)??t.translate()?.(p,y)??"",f=(0,q.useRef)(c);return f.current=c,(0,q.useEffect)(()=>{let p=r.current;if(p===null)return;let y=p.querySelector('[role="group"]');if(y!==null)for(let b of Array.from(y.children)){if(!(b instanceof HTMLElement))continue;b.toggleAttribute(Io,!0);let g=$o(b);g!==null&&g.toggleAttribute(No,o)}},[o,n.attachments]),(0,q.useEffect)(()=>{if(a===null)return;let p=globalThis.setTimeout(()=>{l(null)},Do);return()=>{globalThis.clearTimeout(p)}},[a]),(0,q.useEffect)(()=>{let p=r.current;if(p===null)return;let y=p.closest("[data-composer-card]");if(!(y instanceof HTMLElement))return;let b=y.ownerDocument,g=m=>(m instanceof Element?m:m instanceof Node?m.parentElement:null)?.closest("[contenteditable]")??null,w=()=>{s.current&&i(!1)},I=()=>{let m=y.ownerDocument.getSelection();return m!==null&&!m.isCollapsed&&m.toString()!==""},P=m=>m instanceof Node&&y.contains(m),E=m=>{let O=m.key.toLowerCase();if(Mo.has(O))return;let N=m.metaKey||m.ctrlKey;if(N&&!m.altKey&&O==="a"){P(m.target)&&g(m.target)?.getAttribute("contenteditable")==="true"&&i(!0);return}if(N&&!m.altKey&&O==="c"&&s.current&&P(m.target)&&!I()){m.preventDefault(),Wo(d.current,t,l,f.current);return}N&&!m.altKey&&_o.has(O)||w()},B=()=>{w()},U=m=>{let N=d.current.attachments??[],M=m.clipboardData;if(!s.current||N.length===0||M===null)return;let H=[],j=[];for(let D of N){let V=t.pathOf(D.file);if(V===""){j.push(D.file.name);continue}H.push({path:V,name:D.file.name,type:D.file.type,kind:D.kind})}if(H.length>0){let D=M.getData("text/plain");M.setData(nn,xt({text:D,attachments:H})),M.setData("text/plain",tn(D,H.map(V=>V.path)))}j.length>0&&l(f.current("attach.copySkipped",{count:String(j.length)}))},v=m=>{let O=m.clipboardData;if(O===null||g(m.target)===null||Array.from(O.types).includes("Files"))return;let N=()=>d.current,M=vt(O.getData(nn)),H=M===void 0?St(O.getData("text/plain")):void 0;if(M===void 0&&H===void 0)return;let j=Ho(d.current.phase?.(),f.current);if(j!==void 0){m.preventDefault(),m.stopPropagation(),l(j);return}if(m.preventDefault(),m.stopPropagation(),w(),M!==void 0){Et(M,N,t,l,f.current);return}H!==void 0&&Et({text:H.text,attachments:H.paths.map(D=>{let V=Ct(D)??"";return{path:D,name:rn(D),type:V,kind:V===""?"file":"image"}})},N,t,l,f.current)};b.addEventListener("keydown",E,!0),y.addEventListener("paste",v,!0);let S=m=>{let O=m.relatedTarget;O instanceof Node&&y.contains(O)||w()};return y.addEventListener("focusout",S),b.addEventListener("copy",U),b.addEventListener("pointerdown",B,!0),()=>{b.removeEventListener("keydown",E,!0),b.removeEventListener("copy",U),y.removeEventListener("paste",v,!0),y.removeEventListener("focusout",S),b.removeEventListener("pointerdown",B,!0)}},[t]),(0,le.jsxs)("div",{ref:r,className:u?"dshBetter_railHost":"dshBetter_railHostEmpty",children:[(0,le.jsx)(e,{...n}),a!==null&&(0,le.jsx)("div",{className:"dshBetter_attachNotice",role:"status",children:a})]})}function Ho(e,n){return ee(e)?n("attach.pasteBusy"):void 0}function Wo(e,n,t,r){let o=e.attachments??[],i=[],a=0;for(let l of o){let u=n.pathOf(l.file);u===""?a+=1:i.push(u)}i.length>0&&globalThis.navigator?.clipboard?.writeText(tn("",i)).catch(()=>{t(r("attach.copyFailed"))}),a>0&&t(r("attach.copySkipped",{count:String(a)}))}function Et(e,n,t,r,o){let i=n();if(on(i,e.text),e.attachments.length===0)return;let a=t.reader(),l=i.sessionId;if(a===void 0||l===void 0){on(i,e.attachments.map(s=>s.path).join(`
`));return}let u=(i.attachments??[]).map(s=>t.pathOf(s.file)).filter(s=>s!==""),{accepted:d}=Lt(e.attachments,u);d.length!==0&&(async()=>{let s=[],c=[],f=0;for(let y of d){let b=await zo(a,l,y);b.kind==="file"?s.push(b.file):b.kind==="mention"?c.push(b.mention):f+=1}let p=n();c.length>0&&on(p,c.join(" ")),s.length>0&&p.onAddFiles?.(s),f>0&&r(o("attach.pasteMissing",{count:String(f)})),c.length>0&&r(o("attach.pasteReferenced",{count:String(c.length)}))})()}function on(e,n){if(n==="")return;let t=e.inputActions,r=t?.captureInsertion?.();t?.insertText===void 0||r===void 0||t.insertText(n,r)}async function zo(e,n,t){let r=await e.readBytes?.(n,t.path,{});if(r!==void 0&&r.ok)return{kind:"file",file:new File([r.value.data],t.name,{type:t.type})};let o=await e.stat?.(n,t.path);return o!==void 0&&o.ok?{kind:"mention",mention:Uo(t.path)}:{kind:"missing"}}function $o(e){let n=e.querySelector("img")?.parentElement;if(n!=null)return n;let t=e.firstElementChild;return t instanceof HTMLElement?t:null}function Uo(e){return Fo.test(e)?`@"${e}"`:`@${e}`}var Vo="better.focusComposer",qo=Object.freeze(["focus input","focus composer","message input"]),ye="command.focusComposer",jo=Object.freeze(["page","editable","terminal"]),Ko=Object.freeze({"desktop:macos":{code:"Space",modifiers:["primary"]},"desktop:windows":{code:"Space",modifiers:["primary","shift"]},"web:macos":{code:"Space",modifiers:["primary","shift"]},"web:windows":{code:"Space",modifiers:["primary","shift"]}}),Go="[data-composer-input], [role='textbox'][aria-multiline='true']";function At(e){return e===void 0||typeof e.querySelector!="function"?!1:e.querySelector(Go)!=null}function an(e,n){if(e===null||typeof e!="object")return;let t=e.get;if(typeof t=="function"){let r=t.call(e,n);return r===null?void 0:r}return e[n]}var Rt=e=>typeof e=="string"&&e!==""?e:void 0;function Pt(e){let t=an(e,"uiSession")?.adapter?.current?.getSnapshot?.();if(t!==void 0)return Rt(t.key);let r=an(e,"sessions");return Rt(r?.list?.getSnapshot?.()?.current)}function Ot(e,n){try{let t=e.sessions?.scope?.(n);if(t===void 0)return!1;let o=an(t,"conversation")?.input?.for?.(t);return o===void 0||typeof o.focus!="function"?!1:(o.focus(),!0)}catch{return!1}}function Yo(e){return(n={})=>{if(n.modal!=null)return{status:"pass"};if(!e.composerMounted())return{status:"pass"};let t=e.currentSessionId();return t===void 0?{status:"pass"}:{status:"handled",run:()=>{e.focusComposer(t)}}}}function Jo(e,n){return{id:Vo,label:n,aliases:qo,defaults:Ko,regions:jo,modals:[],resolve:Yo(e)}}function It(e,n,t,r){if(e===void 0||typeof e.register!="function")return()=>{};try{return e.register(Jo(n,t))}catch(o){return r?.(o instanceof Error?o.message:String(o)),()=>{}}}var Nt=Object.freeze({zh:{"overlay.aria":"\u9009\u62E9\u6A21\u578B","listbox.aria":"\u6A21\u578B\u5339\u914D\u9879","search.aria":"\u641C\u7D22\u4F9B\u5E94\u5546\u6216\u6A21\u578B","search.placeholder":"\u641C\u7D22\u4F9B\u5E94\u5546\u6216\u6A21\u578B\u2026","status.empty":"\u6CA1\u6709\u53EF\u7528\u7684\u6A21\u578B\u3002","status.applying":"\u6B63\u5728\u5207\u6362\u2026",retry:"\u91CD\u8BD5","trigger.selectAria":"\u9009\u62E9\u6A21\u578B","trigger.aria":"\u5F53\u524D\u6A21\u578B {model}\uFF0C\u70B9\u51FB\u5207\u6362","trigger.ariaEffort":"\u5F53\u524D\u6A21\u578B {model}\uFF0C\u63A8\u7406\u7B49\u7EA7 {effort}\uFF0C\u70B9\u51FB\u5207\u6362","trigger.fallback":"\u9009\u62E9\u6A21\u578B","trigger.loading":"\u52A0\u8F7D\u6A21\u578B\u2026",[ye]:"\u805A\u7126\u8F93\u5165\u6846","attach.copySkipped":"{count} \u4E2A\u9644\u4EF6\u6765\u81EA\u526A\u8D34\u677F\u3001\u6CA1\u6709\u672C\u5730\u8DEF\u5F84\uFF0C\u672A\u590D\u5236","attach.pasteMissing":"{count} \u4E2A\u9644\u4EF6\u5BF9\u5E94\u7684\u6587\u4EF6\u5DF2\u4E0D\u5B58\u5728\uFF0C\u672A\u7C98\u8D34","attach.pasteReferenced":"{count} \u4E2A\u9644\u4EF6\u8D85\u51FA\u5355\u6B21\u8BFB\u53D6\u4E0A\u9650\uFF0C\u5DF2\u6539\u4E3A\u8DEF\u5F84\u5F15\u7528","attach.copyFailed":"\u6D4F\u89C8\u5668\u62D2\u7EDD\u4E86\u8FD9\u6B21\u526A\u8D34\u677F\u5199\u5165","attach.pasteBusy":"\u6D88\u606F\u6B63\u5728\u53D1\u9001\uFF0C\u7A0D\u540E\u518D\u7C98\u8D34","compaction.reading":"\u538B\u7F29 {count} \u6B21","compaction.readingOne":"\u538B\u7F29 1 \u6B21","compaction.tooltip":"\u672C\u4F1A\u8BDD\u4E0A\u4E0B\u6587\u5DF2\u538B\u7F29 {count} \u6B21","compaction.tooltipWithFailures":"\u672C\u4F1A\u8BDD\u4E0A\u4E0B\u6587\u5DF2\u538B\u7F29 {count} \u6B21\uFF0C\u53E6\u6709 {failures} \u6B21\u538B\u7F29\u5931\u8D25","tabs.nav":"Tab \u7BA1\u7406","tabs.heading":"Tab \u7BA1\u7406","tabs.empty":"\u8FD8\u6CA1\u6709\u63D2\u4EF6\u6CE8\u518C\u4F1A\u8BDD\u6807\u7B7E\u3002","tabs.show":"\u5728\u6807\u7B7E\u680F\u663E\u793A{label}","tabs.hide":"\u4ECE\u6807\u7B7E\u680F\u9690\u85CF{label}","alias.nav":"\u6280\u80FD\u522B\u540D","alias.heading":"\u6280\u80FD\u522B\u540D","alias.prefix.title":"\u9700\u8981\u659C\u6760\u524D\u7F00","alias.prefix.on":"\u6253\u5F00\u5219\u9700\u8981\u8F93\u5165 \u201C/\u201D \u8FDB\u884C\u5339\u914D","alias.prefix.off":"\u6253\u5F00\u5219\u65E0\u9700\u8F93\u5165 \u201C/\u201D \u8FDB\u884C\u5339\u914D","alias.table.keyword":"\u5173\u952E\u8BCD","alias.table.target":"\u6280\u80FD\u6216\u547D\u4EE4","alias.table.params":"\u53C2\u6570","alias.table.paramsPlaceholder":"\u53EF\u9009\uFF0C\u5982 run","alias.table.actions":"\u64CD\u4F5C","alias.add":"\u6DFB\u52A0\u522B\u540D","alias.remove":"\u5220\u9664\u522B\u540D {keyword}","alias.unnamed":"\uFF08\u672A\u547D\u540D\uFF09","alias.empty":"\u8FD8\u6CA1\u6709\u522B\u540D\u3002\u4F8B\u5982\uFF1Awf \u2192 /flow-workflow run","alias.footnote":"\u8F93\u5165\u5173\u952E\u8BCD\u540E\u4ECE\u9762\u677F\u9009\u62E9\u5373\u53EF\u63D2\u5165\u5B8C\u6574\u8C03\u7528\uFF1B\u6539\u5B8C\u7ACB\u5373\u751F\u6548\u3002","alias.menu.section":"\u6280\u80FD\u522B\u540D","alias.menu.params":"\u53C2\u6570\uFF1A{value}","skill.metadata":"\u5143\u6570\u636E","skill.path":"\u5730\u5740","skill.usage.session":"\u672C\u4F1A\u8BDD\u8C03\u7528","skill.usage.workspace":"\u672C\u5DE5\u4F5C\u533A\u8C03\u7528","skill.params":"\u53C2\u6570","skill.hint.insert":"\u70B9\u51FB\u63D2\u5165","continue.label":"\u7EE7\u7EED","continue.sending":"\u7EE7\u7EED\u4E2D\u2026","link.copy":"\u590D\u5236","link.copied":"\u5DF2\u590D\u5236","link.copyFailed":"\u590D\u5236\u5931\u8D25","link.copyAria":"\u590D\u5236\u94FE\u63A5\u5730\u5740"},en:{"overlay.aria":"Select a model","listbox.aria":"Matching models","search.aria":"Search providers or models","search.placeholder":"Search providers or models\u2026","status.empty":"No models available.","status.applying":"Switching\u2026",retry:"Retry","trigger.selectAria":"Select model","trigger.aria":"Current model {model}, click to change","trigger.ariaEffort":"Current model {model}, reasoning effort {effort}, click to change","trigger.fallback":"Select model","trigger.loading":"Loading models\u2026",[ye]:"Focus message input","attach.copySkipped":"{count} attachment(s) came from the clipboard with no local path and were not copied","attach.pasteMissing":"{count} attachment(s) no longer exist and were not pasted","attach.pasteReferenced":"{count} attachment(s) exceed the read limit and became path references","attach.copyFailed":"The browser refused this clipboard write","attach.pasteBusy":"A message is being sent; paste again in a moment","compaction.reading":"{count} compactions","compaction.readingOne":"1 compaction","compaction.tooltip":"This session's context was compressed {count} time(s)","compaction.tooltipWithFailures":"This session's context was compressed {count} time(s), with {failures} failed attempt(s)","tabs.nav":"Tabs","tabs.heading":"Tabs","tabs.empty":"No plugin has registered a conversation tab yet.","tabs.show":"Show {label} in the tab bar","tabs.hide":"Hide {label} from the tab bar","alias.nav":"Skill aliases","alias.heading":"Skill aliases","alias.prefix.title":"Require a slash prefix","alias.prefix.on":"To open, type \u201C/\u201D to match","alias.prefix.off":"To open, type the keyword without \u201C/\u201D to match","alias.table.keyword":"Keyword","alias.table.target":"Skill or command","alias.table.params":"Arguments","alias.table.paramsPlaceholder":"Optional, e.g. run","alias.table.actions":"Actions","alias.add":"Add alias","alias.remove":"Delete alias {keyword}","alias.unnamed":"(unnamed)","alias.empty":"No aliases yet. For example: wf \u2192 /flow-workflow run","alias.footnote":"Type a keyword and pick from the panel to insert the full invocation; changes apply immediately.","alias.menu.section":"Skill aliases","alias.menu.params":"args: {value}","skill.metadata":"Metadata","skill.path":"Path","skill.usage.session":"This session","skill.usage.workspace":"This workspace","skill.params":"Arguments","skill.hint.insert":"Click to insert","continue.label":"Continue","continue.sending":"Continuing\u2026","link.copy":"Copy","link.copied":"Copied","link.copyFailed":"Copy failed","link.copyAria":"Copy link address"}});var Dt="dsh-better-effort",Xo=`
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
`;function _t(e){if(e===void 0)return()=>{};if(e.getElementById(Dt)!==null)return()=>{};let n=e.createElement("style");return n.id=Dt,n.textContent=Xo,e.head.append(n),()=>{n.remove()}}var Bt="dsh-better.layout-widths",de=Object.freeze({sidebar:null,rightbar:null});function Ht(e){return typeof e=="number"&&Number.isFinite(e)&&e>0}function Ne(e){if(e===void 0)return de;let n;try{n=e.getItem(Bt)}catch{return de}if(n===null||n==="")return de;let t;try{t=JSON.parse(n)}catch{return de}if(typeof t!="object"||t===null||Array.isArray(t))return de;let r=t;return{sidebar:Mt(r.sidebar),rightbar:Mt(r.rightbar)}}function Wt(e,n){if(e===void 0)return;let t={};n.sidebar!==null&&(t.sidebar=Math.round(n.sidebar)),n.rightbar!==null&&(t.rightbar=Math.round(n.rightbar));try{e.setItem(Bt,JSON.stringify(t))}catch{}}function Mt(e){return Ht(e)?Math.round(e):null}function zt(e){if(typeof e!="string")return de;let n=e.trim().split(/\s+/).filter(t=>t!=="");return{sidebar:Ft(n[0]),rightbar:Ft(n[2])}}function Ft(e){if(e===void 0)return null;let n=/^([0-9]+(?:\.[0-9]+)?)px$/.exec(e);if(n===null)return null;let t=Number(n[1]);return Ht(t)?Math.round(t):null}function $t(e,n,t=null){return t==="sidebar"?n.sidebar!==null&&n.sidebar!==e.sidebar?{sidebar:n.sidebar}:{}:t==="rightbar"?n.rightbar!==null&&n.rightbar!==e.rightbar?{rightbar:n.rightbar}:{}:n.sidebar!==null&&n.sidebar!==e.sidebar?{sidebar:n.sidebar}:n.rightbar!==null&&n.rightbar!==e.rightbar?{rightbar:n.rightbar}:{}}function Ut(e,n){return{sidebar:n.sidebar??e.sidebar,rightbar:n.rightbar??e.rightbar}}function Vt(e){let n=[];return e.sidebar!==null&&n.push({column:"sidebar",width:e.sidebar}),e.rightbar!==null&&n.push({column:"rightbar",width:e.rightbar}),n}var Zo="[data-shell-bottom]",Qo="[data-side]",ei='[class*="_sidebarCol"]',ni='[class*="_rightbarCol"]',ti=600;function ri(e){let t=e?.layout?.panels;if(typeof t!="object"||t===null)return;let r=t;if(!(typeof r.setSidebar!="function"&&typeof r.setRightbar!="function"))return r}function Kt(e,n){let t=ri(e);if(t===void 0)return!1;let r=!1;for(let{column:o,width:i}of Vt(n)){let a=o==="sidebar"?t.setSidebar:t.setRightbar;if(a!==void 0)try{a.call(t,i),r=!0}catch{}}return r}function qt(e){return e.querySelector(Zo)?.parentElement??null}function oi(e,n){let t=e.hasAttribute("data-sidebar-collapsed"),r=e.hasAttribute("data-rightbar-collapsed"),o=zt(n?.getComputedStyle(e).gridTemplateColumns);return{sidebar:t?null:o.sidebar??jt(e.querySelector(ei)),rightbar:r?null:o.rightbar??jt(e.querySelector(ni))}}function jt(e){if(e===null)return null;let n=e.getBoundingClientRect().width;return Number.isFinite(n)&&n>0?Math.round(n):null}function Gt(e){let{document:n,storage:t}=e,r=null,o=null,i=0,a=!1,l=null,u=()=>n.defaultView,d=()=>(r!==null&&r.isConnected||(r=qt(n)),r),s=()=>{let g=d();return g===null?null:oi(g,u())},c=g=>{let w=g?.getAttribute("data-side");return w==="sidebar"||w==="rightbar"?w:null},f=g=>{let w=s();if(w===null)return;let I=$t(g.before,w,g.side);I.sidebar===void 0&&I.rightbar===void 0||Wt(t,Ut(Ne(t),I))},p=g=>{if(l!==null)return;let w=g.target,I=typeof w?.closest=="function"?w.closest(Qo):null;if(I===null)return;let P=s();P!==null&&(l={side:c(I),before:P})},y=()=>{let g=l;if(l=null,g===null)return;let w=u()?.requestAnimationFrame;if(w===void 0){f(g);return}w.call(u(),()=>f(g))},b=()=>{if(o=null,a)return;let g=qt(n);if(g!==null){r=g;return}if(i>=ti)return;i+=1;let w=u()?.requestAnimationFrame;w!==void 0&&(o=w.call(u(),b))};return{attach(){a=!1,i=0;let g=u();return g?.addEventListener("pointerdown",p,!0),g?.addEventListener("pointerup",y,!0),g?.addEventListener("pointercancel",y,!0),b(),()=>{a=!0,l=null,r=null,g?.removeEventListener("pointerdown",p,!0),g?.removeEventListener("pointerup",y,!0),g?.removeEventListener("pointercancel",y,!0),o!==null&&g?.cancelAnimationFrame(o),o=null}}}}var Yt="sessionCompaction";var Jt="dsh-better-compaction",De="dshBetter_compactionStat",ii=`
.${De} {
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

[data-composer-dock]:has([data-workbench-dock="term-dock"]) .${De} {
  margin-left: 12px;
}
`;function Xt(e){if(e===void 0)return()=>{};if(e.getElementById(Jt)!==null)return()=>{};let n=e.createElement("style");return n.id=Jt,n.textContent=ii,e.head.append(n),()=>{n.remove()}}var Qt=require("react/jsx-runtime");function ai(e,n){if(e===void 0||n===void 0)return null;let{compactions:t,failures:r}=e;if(!Number.isSafeInteger(t)||t<=0)return null;let o=t===1?n("compaction.readingOne"):n("compaction.reading",{count:t}),i=Number.isSafeInteger(r)&&r>0?n("compaction.tooltipWithFailures",{count:t,failures:r}):n("compaction.tooltip",{count:t});return{text:o,tooltip:i}}function si(){}function Zt({useProjection:e,t:n}){let r=ai((e??si)(Yt),n);return r===null?null:(0,Qt.jsx)("span",{className:De,"data-dsh-better":"compaction-stat",title:r.tooltip,children:r.text})}var sn="conversation.composer.dock",er="better-compaction";var cn=require("react");var nr="continue",ln="conversation.chat.turnTail",tr="better-continue";var li=new Set(["aborted","interrupted"]);function rr(e){let n=e.end?.reason?.kind;return n===void 0||!li.has(n)?!1:e.latest&&!e.pending}var or="dsh-better-continue",ue="dshBetter_continue",dn="dshBetter_continueError",di=`
.${ue} {
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

.${ue}:hover:not(:disabled) {
  background: var(--dsw-alias-interactive-bg-hover);
  color: var(--dsw-alias-label-primary);
  border-color: var(--dsw-alias-border-l1);
}

.${ue}:focus-visible {
  outline: 1px solid var(--dsw-alias-border-l1);
  outline-offset: 1px;
}

/* Disabled covers both halves of the pressed state: the request is in flight, so
   the button must not invite a second one, and the dimming is what says so. */
.${ue}:disabled {
  cursor: default;
  opacity: 0.6;
}

/* The failure line sits under the button in the same column. It is a sibling
   rather than a wrapper so the button keeps its own alignment. */
.${dn} {
  align-self: flex-end;
  color: var(--dsw-alias-state-business-primary);
  font-size: var(--dsh-content-font-size-secondary, 13px);
  line-height: calc(20px + var(--dsh-content-font-delta-secondary, 0px));
}
`;function ir(e){if(e===void 0)return()=>{};if(e.getElementById(or)!==null)return()=>{};let n=e.createElement("style");return n.id=or,n.textContent=di,e.head.append(n),()=>{n.remove()}}var re=require("react/jsx-runtime");function ui(e){return e instanceof Error?e.message:String(e)}function ci(e,n){return e.length>0&&e[e.length-1]===n}function un(){}function ar({turn:e,sessionId:n,useChat:t,useSession:r,useInput:o,t:i,submitContinue:a}){let l=t??un,u=r??un,d=o??un,s=l(E=>E),c=u(E=>E),f=d(E=>E),[p,y]=(0,cn.useState)(!1),[b,g]=(0,cn.useState)(null),w=e!==void 0&&ci(s?.timeline.turnOrder??[],e.turn),I=(c?.pendingSubmissions?.length??0)>0||ee(f?.phase);return e===void 0||n===void 0||a===void 0||i===void 0||!rr({end:e.end?.data,latest:w,pending:I})?null:(0,re.jsxs)(re.Fragment,{children:[(0,re.jsx)("button",{type:"button",className:ue,"data-testid":"better-continue",disabled:p,onClick:()=>{y(!0),g(null),a(n).catch(E=>{y(!1),g(ui(E))})},children:i(p?"continue.sending":"continue.label")}),b===null?null:(0,re.jsx)("span",{className:dn,role:"alert",children:b})]})}var fn="dsh-better-link-hover",G="dshBetter_linkHover",_e="dshBetter_linkHoverAddress",ce="dshBetter_linkHoverCopy",sr=`
.${G} {
  position: fixed;
  /* Above the shell's popovers (40s and 50s) and level with this package's
     skill panels (60), which never show at the same time as this one. */
  z-index: 60;
  display: flex;
  gap: 8px;
  align-items: flex-start;
  box-sizing: border-box;
  /* The width ceiling is the whole responsive story: 480px is where a long url
     lands on two or three lines, and the viewport term keeps a 24px gutter on a
     phone. Below that the panel simply shrinks. */
  width: max-content;
  max-width: min(480px, calc(100vw - 24px));
  padding: 8px 10px;
  border: 1px solid var(--dsw-alias-border-l2, rgba(0, 0, 0, 0.08));
  border-radius: var(--dsw-radius-md, 12px);
  /* Opaque on purpose: the panel floats over arbitrary transcript content and
     must not pick it up through a translucent fill. */
  background: var(--dsw-alias-bg-layer-2, #ffffff);
  box-shadow: var(--dsw-elevation-prominent, 0 12px 32px rgba(0, 0, 0, 0.16));
  color: var(--dsw-alias-label-primary);
  font-size: 12px;
  line-height: 18px;
  animation: dshBetterLinkHoverIn 120ms ease-out;
}
/*
 * The panel is placed 8px off the link. That strip is not the panel, so a
 * pointer crossing it fires mouseout with the transcript as the destination
 * and the panel used to close before the copy button could be reached.
 * These two pads belong to the panel for hit testing only: one reaches up
 * toward a link above, one reaches down toward a link the panel flipped over.
 * They are invisible and wider than the gap, so the pointer never has to
 * cross a dead pixel to get to the button.
 */
.${G}::before,
.${G}::after {
  content: "";
  position: absolute;
  left: -12px;
  right: -12px;
  height: 20px;
}
.${G}::before {
  top: -20px;
}
.${G}::after {
  bottom: -20px;
}
.${G}[hidden] {
  display: none;
}
.${_e} {
  flex: 1 1 auto;
  min-width: 0;
  /* A url has no spaces to break at, so the only thing that keeps a 300
     character address inside the panel is breaking anywhere. */
  overflow-wrap: anywhere;
  word-break: break-word;
  font-family: var(--dsw-font-mono, ui-monospace, monospace);
  font-size: 11px;
  line-height: 16px;
  user-select: text;
}
.${ce} {
  /* Never shrinks: the button is the panel's one action, and a long address
     must not squeeze it off the row. */
  flex: none;
  align-self: flex-start;
  padding: 2px 8px;
  border: 1px solid var(--dsw-alias-border-l1, rgba(0, 0, 0, 0.12));
  border-radius: var(--dsw-radius-sm, 6px);
  background: transparent;
  color: var(--dsw-alias-label-secondary);
  font: inherit;
  font-size: 11px;
  line-height: 16px;
  white-space: nowrap;
  cursor: pointer;
}
.${ce}:hover {
  background: var(--dsw-alias-interactive-bg-hover);
  color: var(--dsw-alias-label-primary);
}
.${ce}:focus-visible {
  outline: 2px solid var(--dsw-alias-state-business-primary);
  outline-offset: 1px;
}
@keyframes dshBetterLinkHoverIn {
  from {
    opacity: 0;
    transform: translateY(-2px);
  }
  to {
    opacity: 1;
    transform: none;
  }
}
@media (prefers-reduced-motion: reduce) {
  .${G} {
    animation: none;
  }
}
`;function lr(e){if(e===void 0)return()=>{};if(e.getElementById(fn)!==null)return()=>{};let n=e.createElement("style");return n.id=fn,n.textContent=sr,e.head.append(n),()=>{n.remove()}}var fi=1200,pi=300,dr=8,oe=8,mi='[data-slot="conversation.chat.flow"], [data-message-bubble]';function gi(e){let n=e.trim();if(n===""||n.startsWith("#"))return!1;let t=n.replace(/[\t\n\r]/gu,"").slice(0,11).toLowerCase();return!(t.startsWith("javascript:")||t.startsWith("data:"))}function hi(e,n,t){let r=Math.max(oe,Math.min(e.left,t.width-oe-n.width)),o=e.bottom+dr,i=e.top-dr-n.height,a=t.height-oe*2,l;return n.height<=a&&o+n.height<=t.height-oe?l=o:n.height<=a&&i>=oe?l=i:l=Math.max(oe,Math.min(o,t.height-oe-n.height)),{left:r,top:l}}async function yi(e,n){let t=n.defaultView?.navigator.clipboard;if(t!==void 0)try{return await t.writeText(e),!0}catch{}return bi(e,n)}function bi(e,n){if(typeof n.execCommand!="function")return!1;let t=n.createElement("textarea");t.value=e,t.setAttribute("readonly",""),t.style.position="fixed",t.style.top="-1000px",t.style.opacity="0",n.body.append(t);try{return t.select(),n.execCommand("copy")}catch{return!1}finally{t.remove()}}function ur(e,n){let t=e.defaultView;if(t===null)return()=>{};if(t.matchMedia?.("(hover: none)")?.matches===!0)return()=>{};let r=lr(e),o=null,i=null,a=null,l=null,u=null,d=null,s=()=>{d!==null&&(clearTimeout(d),d=null)},c=()=>{if(o!==null)return o;let v=e.createElement("div");v.className=G,v.setAttribute("role","tooltip"),v.hidden=!0;let S=e.createElement("span");S.className=_e;let m=e.createElement("button");return m.className=ce,m.type="button",m.setAttribute("aria-label",n.translate("link.copyAria")),m.textContent=n.translate("link.copy"),m.addEventListener("click",O=>{O.preventDefault(),O.stopPropagation();let N=l?.href;N!==void 0&&yi(N,e).then(M=>{m.textContent=n.translate(M?"link.copied":"link.copyFailed"),u!==null&&clearTimeout(u),u=setTimeout(()=>{u=null,m.textContent=n.translate("link.copy")},fi)})}),v.append(S,m),e.body.append(v),o=v,i=S,a=m,v},f=v=>{let S=c(),m=v.getBoundingClientRect(),O=S.getBoundingClientRect(),N=hi({left:m.left,top:m.top,right:m.right,bottom:m.bottom},{width:O.width,height:O.height},{width:t.innerWidth,height:t.innerHeight});S.style.left=`${N.left}px`,S.style.top=`${N.top}px`},p=()=>{l=null,s(),u!==null&&(clearTimeout(u),u=null),a!==null&&(a.textContent=n.translate("link.copy")),o!==null&&(o.hidden=!0)},y=(v,S)=>{let m=c();l={anchor:v,href:S},i!==null&&(i.textContent=S),m.hidden=!1,f(v)},b=v=>{if(!(v instanceof t.Element))return;let S=v.closest("a");if(S===null||S.closest(mi)===null)return;let m=S.getAttribute("href");if(m!==null&&gi(m))return{anchor:S,href:m.trim()}},g=v=>o!==null&&v instanceof t.Node&&o.contains(v),w=v=>{if(g(v.target)){s();return}let S=b(v.target);S!==void 0&&(s(),y(S.anchor,S.href))},I=v=>{if(l===null)return;let S=v.relatedTarget;if(g(S)||S instanceof t.Node&&l.anchor.contains(S))return;let m=v.target;if(m instanceof t.Node){if(l.anchor.contains(m)){s(),d=setTimeout(()=>{d=null,p()},pi);return}g(m)&&p()}},P=v=>{let S=b(v.target);S!==void 0&&y(S.anchor,S.href)},E=v=>{if(l===null)return;let S=v.relatedTarget;g(S)||S instanceof t.Node&&l.anchor.contains(S)||p()},B=v=>{v.key==="Escape"&&l!==null&&p()},U=v=>{g(v.target)||p()};return e.addEventListener("mouseover",w,!0),e.addEventListener("mouseout",I,!0),e.addEventListener("focusin",P,!0),e.addEventListener("focusout",E,!0),e.addEventListener("keydown",B,!0),e.addEventListener("scroll",U,!0),()=>{e.removeEventListener("mouseover",w,!0),e.removeEventListener("mouseout",I,!0),e.removeEventListener("focusin",P,!0),e.removeEventListener("focusout",E,!0),e.removeEventListener("keydown",B,!0),e.removeEventListener("scroll",U,!0),s(),u!==null&&(clearTimeout(u),u=null),o?.remove(),o=null,i=null,a=null,l=null,r()}}function ki(e){return typeof e=="object"&&e!==null&&"ok"in e&&e.ok===!1}async function cr(e,n){let t=e.sessions?.binding?.(n)?.session,r=t?.prompt;if(typeof r!="function")throw new Error("\u8FD9\u4E2A\u5BBF\u4E3B\u7684\u4F1A\u8BDD\u4E0D\u652F\u6301\u53D1\u9001\u6D88\u606F");let o=await r.call(t,[{type:"text",text:nr}],"queue");if(ki(o))throw new Error("\u7EE7\u7EED\u6D88\u606F\u6CA1\u6709\u88AB\u5BBF\u4E3B\u63A5\u53D7")}var be=require("react");function wi(e){let n=e.name.trim();return n===""?e.id:n}function pn(e,n){if(e===void 0)return{model:n};let t=wi(e.group),r=e.model.name.trim();return r===""?{model:t}:{provider:t,model:r}}function fr(e,n){let t=pn(e,n);return t.provider===void 0?t.model:`${t.provider} ${t.model}`}function xi(e){return typeof e=="string"?e:e.en??""}function Me(e,n){if(e!==void 0)try{return e(n)}catch{}return xi(n)}var F=require("react/jsx-runtime"),vi="@deepseek-ai/dsh-client-ui-model-selection/ModelSelect.module.css";function Si(e){if(e===void 0)return;let t=e.querySelector(`style[data-plugin-css="${vi}"]`)?.textContent??"",r=a=>new RegExp(`\\.(\\w+_${a})\\{`,"u").exec(t)?.[1],o={root:r("root"),trigger:r("trigger"),triggerIcon:r("triggerIcon"),triggerLabel:r("triggerLabel"),triggerEffort:r("triggerEffort"),chevron:r("chevron")};for(let a of Object.values(o))if(a===void 0)return;let i=r("badge");return{...o,...i===void 0?{}:{badge:i}}}function pr(e){let n=Ie(e.load),t=Si(e.document);function r(o){let i=e.native();return o.available===!1||i===void 0||t===void 0?i===void 0?null:(0,F.jsx)(i,{...o}):(0,F.jsx)(Ci,{props:o,primitives:n,openPicker:e.openPicker,translate:e.translate,classes:t})}return r}function Ci({props:e,primitives:n,openPicker:t,translate:r,classes:o}){let{directory:i,t:a,sessionId:l,locked:u,resolveText:d}=e,s=Li(i),c=a??r(),f=s?.current??null,p=f===null&&s?.status==="loading",y=Ei(s,f),b=c?.("trigger.fallback")??"",g=fr(y,b),w=pn(y,b),I=Ti(y,d),P=p?c?.("trigger.loading")??"":g,E=Ri(s,f,y,c),B=E===void 0?P:`${P} \xB7 ${E}`,U=p?c?.("trigger.loading")??"":f===null?c?.("trigger.selectAria")??"":E===void 0?c?.("trigger.aria",{model:P})??"":c?.("trigger.ariaEffort",{model:P,effort:E})??"",v=()=>{t(l)},S=n.IconDataOutlineRegular,m=n.IconChevronDownOutlineRegular,O=n.Tag,N=o.badge;return(0,F.jsx)("div",{className:o.root,"data-dsh-better-seat":"",children:(0,F.jsxs)("button",{type:"button",className:o.trigger,"aria-label":U,"aria-haspopup":"dialog","aria-expanded":"false",title:B,disabled:u,onClick:v,children:[S===void 0?null:(0,F.jsx)(S,{className:o.triggerIcon,size:16}),(0,F.jsx)("span",{className:o.triggerLabel,"data-provider-id":f?.provider,"data-model-id":f?.model,children:p?P:(0,F.jsxs)(F.Fragment,{children:[w.provider===void 0?null:`${w.provider} `,I===void 0||N===void 0||O===void 0?null:(0,F.jsxs)(F.Fragment,{children:[(0,F.jsx)(O,{className:N,tone:I.tone,children:I.text})," "]}),w.model]})}),E!==void 0&&(0,F.jsx)("span",{className:o.triggerEffort,children:E}),m===void 0?null:(0,F.jsx)(m,{className:o.chevron})]})})}function Li(e){let n=(0,be.useCallback)(r=>e===void 0?()=>{}:e.subscribe(r),[e]),t=(0,be.useCallback)(()=>e?.getSnapshot(),[e]);return(0,be.useSyncExternalStore)(n,t)}function Ei(e,n){if(!(e===void 0||n===null||n===void 0)){for(let t of e.groups)if(t.id===n.provider){for(let r of t.models)if(r.id===n.model)return{group:t,model:r}}}}function Ti(e,n){let t=e?.model.badge;if(t===void 0)return;let r=Me(n,t.text);if(r!=="")return{text:r,tone:t.tone}}function Ri(e,n,t,r){if(e===void 0||n===null||n===void 0)return;let o=t?.model.reasoning,i=n.reasoningEffort??o?.defaultEffort;return t===void 0?e.retainedEffort:o===void 0||i===void 0?void 0:o.efforts?.find(l=>l.id===i)?.name??i}function mr(e){let r=e?.live?.contributions?.get("model")?.ui;return r==null?void 0:r.kind==="popupSelect"?r:void 0}function gr(e){return{sessionId:e}}function hr(){return{via:"enter",token:""}}var Ai=`
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
`,yr="dsh-better/tabs.css";function br(e){let n=`style[data-plugin-css=${JSON.stringify(yr)}]`;if(e.querySelector(n)!==null)return()=>{};let t=e.createElement("style");return t.dataset.plugin="dsh-better",t.dataset.pluginCss=yr,t.textContent=Ai,e.head.append(t),()=>t.remove()}function kr(e){let n;return e.React.createElement("section",{"data-dsh-better-tabs":"",ref:t=>{if(n?.(),n=void 0,t===null)return;let r=()=>{Pi(t,e)};r(),n=e.controller.subscribe(r)}})}function Pi(e,n){let t=e.ownerDocument,{controller:r,copy:o}=n;e.replaceChildren();let i=t.createElement("h2");i.setAttribute("data-dsh-better-tabs-heading",""),i.textContent=o.heading,e.append(i);let a=r.rows();if(a.length===0){let l=t.createElement("p");l.setAttribute("data-dsh-better-tabs-empty",""),l.textContent=o.empty,e.append(l);return}for(let l of a){let u=t.createElement("label");u.setAttribute("data-dsh-better-tabs-row",l.id);let d=t.createElement("span");d.setAttribute("data-dsh-better-tabs-name",""),d.textContent=l.label;let s=t.createElement("input");s.setAttribute("data-dsh-better-tabs-check",l.id),s.type="checkbox",s.checked=l.enabled,s.setAttribute("aria-label",o.checkboxLabel(l.label,l.enabled)),s.addEventListener("change",()=>{r.setEnabled(l.id,s.checked)}),u.append(d,s),e.append(u)}}var mn="conversation.view",gn="settings.section",xr="tabs";var Be="chat",vr="dsh-better.tabs",ke="[data-conversation-tabs]";function Sr(e,n){if(typeof e=="string"&&e!=="")return e;if(typeof e=="function")try{let t=e();if(typeof t=="string"&&t!=="")return t}catch{}return n}function Oi(e){if(e===void 0)return new Set;let n;try{n=e.getItem(vr)}catch{return new Set}if(n===null||n==="")return new Set;try{let t=JSON.parse(n);if(!Array.isArray(t))return new Set;let r=new Set;for(let o of t)typeof o=="string"&&o!==""&&o!==Be&&r.add(o);return r}catch{return new Set}}function Ii(e,n){if(e!==void 0)try{e.setItem(vr,JSON.stringify([...n].sort()))}catch{}}function Ni(e,n){let t=[],r=new Set;for(let o of e){let i=o.options.id;i===void 0||i===Be||r.has(i)||(r.add(i),t.push({id:i,label:Sr(o.options.label,i),enabled:!n.has(i)}))}return t}function Di(e){let n=[],t=new Set;for(let r of e){let o=r.options.id;o===void 0||o===Be||t.has(o)||(t.add(o),n.push({id:o,label:Sr(r.options.label,o)}))}return n}function _i(e,n,t){let r=new Set;for(let o of Di(e)){if(!n.has(o.id)||o.label==="")continue;t.filter(a=>a.label===o.label).length===1&&r.add(o.label)}return t.map(o=>r.has(o.label))}function Mi(e,n){for(let t of e)if(n!==null&&(t.target===n||n.contains?.(t.target)===!0)||wr(t.addedNodes,n)||wr(t.removedNodes,n))return!0;return!1}function wr(e,n){if(e===void 0)return!1;for(let t=0;t<e.length;t+=1){let r=e[t];if(r!==void 0&&(r.matches?.(ke)===!0||r.querySelector?.(ke)!=null||n!==null&&r.contains?.(n)===!0))return!0}return!1}function Fi(e){let n=e.querySelector(ke);if(n===null||typeof n!="object")return;let r=n.querySelectorAll?.(":scope > button[role='tab']");if(r===void 0)return;let o=[];for(let i=0;i<r.length;i+=1){let a=r[i];a!==void 0&&o.push({label:Bi(a),hidden:a.hasAttribute(Fe),mark:l=>{l?a.setAttribute(Fe,""):a.removeAttribute(Fe)}})}return o}function Bi(e){return(e.querySelector?.("[class*='tabLabel']")?.textContent??e.textContent??"").trim()}function Hi(e,n){let t=!1;for(let[r,o]of e.entries()){let i=n[r]??!1;i!==o.hidden&&(o.mark(i),t=!0)}return t}function Cr(e){let{ledger:n,storage:t}=e,r=e.readButtons??Fi,o=e.watch??$i,i=new Set(Oi(t)),a=new Set,l,u=()=>{for(let s of[...a])s()},d=30;return{rows:()=>Ni(n.entriesOfSlot(mn),i),setEnabled(s,c){if(s===Be)return!1;let f=i.has(s);return c===!f?!1:(c?i.delete(s):i.add(s),Ii(t,i),l?.(),u(),!0)},subscribe(s){return a.add(s),()=>{a.delete(s)}},attach(s){let c=s.createElement("style");c.dataset.plugin="dsh-better",c.dataset.pluginCss=Wi,c.textContent=zi,s.head.append(c);let f=s.defaultView?.requestAnimationFrame?.bind(s.defaultView),p=s.defaultView?.cancelAnimationFrame?.bind(s.defaultView),y=f===void 0?0:d,b,g=()=>{let P=n.entriesOfSlot(mn),E=r(s);if(E===void 0||E.length===0){y>0&&f!==void 0&&(y-=1,b=f(()=>g()));return}y=d,b=void 0,Hi(E,_i(P,i,E))},w=n.subscribe(mn,g),I=o(s,g);return l=g,g(),()=>{w(),I(),l=void 0,b!==void 0&&p?.(b),c.remove()}}}}var Wi="dsh-better/strip.css",Fe="data-dsh-better-tab-hidden",zi=`${ke} > button[${Fe}] { display: none; }`;function $i(e,n){let t=e.defaultView?.MutationObserver,r=e.documentElement;if(t===void 0||r===void 0)return()=>{};let o=new t(i=>{let a=e.querySelector(ke);Mi(i,a!==null&&typeof a=="object"?a:null)&&n()});return o.observe(r,{childList:!0,subtree:!0}),()=>o.disconnect()}var ie="conversation.input.overlay",Lr="settings.section",ji="aliases",Ki=56,Gi="alias-watcher",Rr=50,Yi="skill-enhancer",Ji=Rr+1,hn="conversation.input.model",yn="conversation.input.attachments",Xi=-50,Zi=-60,Ar="command-popup",Qi=-100,$="better",ea="/better/api/skill-profile",na=5e3,He=null;function Pr(e,n){let t,r=Number.POSITIVE_INFINITY;for(let o of e){if(o.options.id!==Ar)continue;let i=o.component;if(typeof i!="function"||n!==void 0&&i===n)continue;let a=o.options.priority??0;a<r&&(t=i,r=a)}return t}var Or={name:"dsh-better",inject:["slots","sessions","commandUi","conversation","locale","modelDirectories","remote","remote.session"],apply(e){let n=globalThis.document;e.effect(()=>e.locale.register($,Nt),"dsh-better: locale"),e.effect(()=>_t(n),"dsh-better: effort badge stylesheet"),e.effect(()=>Xt(n),"dsh-better: compaction count stylesheet"),e.effect(()=>ir(n),"dsh-better: continue button stylesheet"),e.effect(()=>n===void 0?()=>{}:ur(n,{translate:Tr(e)}),"dsh-better: link address panel");let t=Cn(kn()),r=Tr(e),o={open:!1};e.effect(()=>{let d=kn(),s=Ne(d);e.inject?.(["layout"],p=>{Kt(p,s)});let f=(n===void 0?void 0:Gt({document:n,storage:d}))?.attach();return()=>{f?.()}},"dsh-better: panel width memory"),e.effect(()=>e.slots.inject(sn,()=>e.slots.register({name:sn,id:er,order:-1,locale:$},Zt)),"dsh-better: compaction count"),e.effect(()=>e.slots.inject(ln,()=>bn(e.slots,{name:ln,id:tr,order:20,locale:$,inject:d=>({submitContinue:s=>cr(e,s)})},ar)),"dsh-better: continue button"),e.effect(()=>e.slots.inject(ie,()=>{let d={},c=wt({load:He,native:()=>Pr(e.slots.entries(ie),d.component),document:n});return d.component=c,e.slots.register({name:ie,id:Ar,priority:Qi,locale:$,inject:f=>{let p=sa(e,f);return{popup:aa(e,f),catalog:p?.groups,current:p?.current??null,selectModel:y=>e.modelDirectories?.directoryFor?.(f)?.select?.(y)}}},c)}),"dsh-better: /model provider search"),e.effect(()=>e.slots.inject(hn,()=>{let d={},c=pr({load:He,native:()=>wn(e.slots.entries(hn),d.component),openPicker:f=>oa(e,f),translate:()=>ia(e),document:n});return d.component=c,e.slots.register({name:hn,priority:Xi,locale:$,inject:f=>{let p=e.modelDirectories?.directoryFor?.(f),y=e.locale.resolveText;return{sessionId:f,available:!0,directory:p?.store,load:()=>{p?.load?.()},select:b=>p?.select?.(b),resolveText:b=>Me(y?.bind(e.locale),b),renderSlot:(b,g,w)=>w?.fallback??null}}},c)}),"dsh-better: composer model trigger");let i;e.inject?.(["remote.workspaceFiles"],d=>{i=d["remote.workspaceFiles"],d.effect(()=>()=>{i=void 0},"dsh-better: workspace file reader")}),e.effect(()=>e.slots.inject(yn,()=>{let d={},c=Tt({native:()=>wn(e.slots.entries(yn),d.component),pathOf:la,reader:()=>i,translate:()=>e.locale.bind?.($)});return d.component=c,e.slots.register({name:yn,priority:Zi,locale:$,inject:f=>({sessionId:f,readFileDrag:ta(e),phase:()=>ra(e,f)?.getSnapshot().phase})},c)}),"dsh-better: composer attachment selection");let a;e.inject?.(["inputTriggers"],d=>{a=d.inputTriggers,d.effect(()=>()=>{a=void 0},"dsh-better: alias trigger service"),d.effect(()=>d.inputTriggers.registerSource(Dn({config:()=>t.getSnapshot(),translate:r,bareMenuOpen:()=>o.open,routeCommand:(s,c)=>fa(e,c)})),"dsh-better: alias slash source")}),e.effect(()=>e.slots.inject(ie,()=>{let d=Hn({store:t,bareMenuOpen:o,inputStoreFor:s=>{let c=e.sessions.scope?.(s);if(!(c===void 0||e.conversation===void 0))try{return e.conversation.input?.for?.(c)?.state}catch{return}},controllerFor:s=>{let c=e.sessions.scope?.(s);if(c===void 0)return;let f=we(e,"inputTriggers")??a;if(f!==void 0)try{return f.sessionOf(c)}catch{return}}});return bn(e.slots,{name:ie,id:Gi,order:Rr,inject:s=>({sessionId:s})},d)}),"dsh-better: alias selector watcher"),e.effect(()=>at(n),"dsh-better: skill enhancer stylesheet");let l=da(e);e.effect(()=>e.slots.inject(ie,()=>{let d=ot({scopeFor:s=>e.sessions.scope?.(s),inputStoreFor:s=>{let c=e.sessions.scope?.(s);if(!(c===void 0||e.conversation===void 0))try{return e.conversation.input?.for?.(c)?.state}catch{return}},actionsFor:s=>{let c=e.sessions.scope?.(s);if(!(c===void 0||e.conversation===void 0))try{return e.conversation.input?.for?.(c)}catch{return}},skillNamesFor:l.names,loadProfile:async(s,c)=>ua(e,s,c,await l.pathOf(s,c)),loadUsage:(s,c)=>Ir(e,s,c),translate:r,document:n});return bn(e.slots,{name:ie,id:Yi,order:Ji,inject:s=>({sessionId:s})},d)}),"dsh-better: skill enhancer"),e.effect(()=>e.slots.inject(Lr,()=>{let d=n===void 0?void 0:Mn(n),s=Nn({store:t,translate:r}),c=Er(e.slots,{name:Lr,id:ji,order:Ki,label:()=>e.locale.bind?.($)?.("alias.nav")??"Skill aliases",locale:$},s);return()=>{c(),d?.()}}),"dsh-better: alias settings page");let u=Cr({ledger:ca(e.slots),storage:kn()});e.effect(()=>e.slots.inject(gn,()=>{let d=globalThis.document,s=d===void 0?void 0:br(d),c=Er(e.slots,{name:gn,id:xr,order:55,label:()=>e.locale.bind?.($)?.("tabs.nav")??"Tabs"},()=>{let f=pa(He);return f===null?null:kr({React:f,controller:u,copy:ma(e)})});return()=>{c(),s?.()}}),"dsh-better: tab management"),e.effect(()=>u.attach(n),"dsh-better: tab visibility"),e.inject?.(["shortcuts"],d=>{d.effect(()=>It(d.shortcuts,{currentSessionId:()=>Pt(e),composerMounted:()=>At(n),focusComposer:s=>Ot(e,s)},()=>e.locale.bind?.($)?.(ye)??"Focus message input",s=>console.warn(`dsh-better: focus command not registered (${s})`)),"dsh-better: focus composer shortcut")})}};function ta(e){return n=>we(e,"fileDrag")?.read?.(n)}function ra(e,n){if(n===void 0)return;let t=e.sessions.scope?.(n);if(!(t===void 0||e.conversation===void 0))try{return e.conversation.input?.for?.(t)?.state}catch{return}}function wn(e,n){let t,r=Number.POSITIVE_INFINITY;for(let o of e){let i=o.component;if(typeof i!="function"||n!==void 0&&i===n)continue;let a=o.options.priority??0;a<r&&(t=i,r=a)}return t}function oa(e,n){if(n===void 0)return!1;let t=mr(e.commandUi);if(t===void 0)return!1;let r=e.sessions.scope?.(n);if(r===void 0)return!1;let o=e.commandUi.popupFor?.(r);return o===void 0||typeof o.open!="function"?!1:(o.open("model",t,gr(n),hr()),!0)}function ia(e){return e.locale?.bind?.($)}function aa(e,n){let t=e.sessions.scope?.(n);if(t!==void 0)return e.commandUi.popupFor?.(t)}function sa(e,n){return e.modelDirectories?.directoryFor?.(n)?.store.getSnapshot()}function la(e){let n=globalThis.__DSH_HOST_PATHS__;if(n?.pathFor===void 0)return"";try{let t=n.pathFor(e);return typeof t=="string"?t:""}catch{return""}}function Er(e,n,t){return(e.registerUntyped??e.register).call(e,n,t)}function bn(e,n,t){return(e.registerUntyped??e.register).call(e,n,t)}function da(e){let n=new Map,t=new Map,r=async o=>{let i=n.get(o);if(i!==void 0)return i;let a=t.get(o);if(a!==void 0&&Date.now()-a<na)return;let l=we(e,"remote.skills");if(l!==void 0)try{let u=await l.list({sessionId:o});if(!u.ok){t.set(o,Date.now());return}let d=new Map(u.value.skills.map(s=>[s.name,s]));return n.set(o,d),t.delete(o),d}catch{t.set(o,Date.now());return}};return{names:async o=>new Set((await r(o))?.keys()??[]),pathOf:async(o,i)=>(await r(o))?.get(i)?.path}}async function ua(e,n,t,r){let o=`?sessionId=${encodeURIComponent(n)}&name=${encodeURIComponent(t)}`+(r===void 0?"":`&path=${encodeURIComponent(r)}`);try{let i=await fetch(`${ea}${o}`,{headers:{accept:"application/json"}});return i.ok?await i.json():void 0}catch{return}}function Ir(e,n,t){let r=e.sessions.list??we(e,"sessions.list");try{let o=r?.getSnapshot?.(),i=c=>{let p=o?.projectionsBySession?.[c]?.values?.skillUsage;if(typeof p!="object"||p===null)return;let y=p.counts;return typeof y=="object"&&y!==null?y:void 0},a=i(n)?.[t],l=typeof a=="number"&&Number.isFinite(a)?a:0,u=o?.byId?.[n]?.cwd;if(typeof u!="string"||u==="")return{session:l};let d=Object.keys(o?.byId??{}).map(c=>{let f=i(c),p=o?.byId?.[c]?.cwd;return{...typeof p=="string"?{cwd:p}:{},...f===void 0?{}:{usage:f}}}),s=st(d,u,t);return s===void 0?{session:l}:{session:l,workspace:s}}catch{return{session:0}}}function ca(e){return{entriesOfSlot:n=>(e.entriesOfSlot??e.entries).call(e,n),subscribe:(n,t)=>e.subscribe?.(n,t)??(()=>{})}}function kn(){try{return globalThis.localStorage}catch{return}}function we(e,n){try{return typeof e.get=="function"?e.get(n):e[n]}catch{return}}function fa(e,n){let t=n.session?.sessionId;if(t===void 0)return;let r=e.sessions.scope?.(t);if(r===void 0)return;let o=we(e,"inputTriggers");if(o!==void 0)try{let i=o.sessionOf(r),a=e.conversation?.input?.for?.(r)?.state,l=0,u=()=>{let d=a?.getSnapshot();if(!(d===void 0||d.draft.trim()===""||!d.draft.startsWith("/"))){try{let s=d.draft.trimStart().split(/\s/u)[0]??"";if(!s.startsWith("/")||(i.track?.(s,s.length,{tier:"plain"},d.draftRev),i.onSpace?.()===!0))return;i.dismiss?.()}catch{}l+=1,l<4&&setTimeout(u,25)}};setTimeout(u,0)}catch{}}function Tr(e){return(n,t)=>{try{return e.locale.bind?.($)?.(n,t)??n}catch{return n}}}function pa(e){if(e===null)return null;try{let n=e("react");if(typeof n!="object"||n===null)return null;let t=n;return typeof t.createElement=="function"?t:null}catch{return null}}function ma(e){let n=e.locale.bind?.($),t=(r,o)=>n?.(r)??o;return{heading:t("tabs.heading","Tabs"),empty:t("tabs.empty","No plugin has registered a conversation tab yet."),checkboxLabel:(r,o)=>t(o?"tabs.hide":"tabs.show","{label}").replace("{label}",r)}}function ga(e){He=e}var ha=Or;

    // Hand the loader's `require` to the module's `boot` export before the
    // plugin mounts. Read from `module.exports` rather than the default export:
    // esbuild emits named exports there and the plugin object separately, so the
    // default export alone never carries `boot`.
    if (typeof module.exports.boot === "function") module.exports.boot(require);
    return module.exports.default ?? module.exports;
  }
});
