window.__ModuleLoader__.load({
  id: "dsh-better",
  factory: (require) => {
    var module = { exports: {} };
    var exports = module.exports;
"use strict";var Pe=Object.defineProperty;var fr=Object.getOwnPropertyDescriptor;var pr=Object.getOwnPropertyNames;var mr=Object.prototype.hasOwnProperty;var gr=(e,n)=>{for(var t in n)Pe(e,t,{get:n[t],enumerable:!0})},hr=(e,n,t,r)=>{if(n&&typeof n=="object"||typeof n=="function")for(let o of pr(n))!mr.call(e,o)&&o!==t&&Pe(e,o,{get:()=>n[o],enumerable:!(r=fr(n,o))||r.enumerable});return e};var yr=e=>hr(Pe({},"__esModule",{value:!0}),e);var qi={};gr(qi,{boot:()=>Vi,clientPlugin:()=>ur,default:()=>ji,findShadowed:()=>dr,findShadowedSingle:()=>tn,readSkillUsage:()=>cr});module.exports=yr(qi);var me=require("react");var on="dsh-better.skill-aliases";var ne=Object.freeze({prefix:!0,rows:Object.freeze([])});function br(e,n){if(e!==void 0)try{e.setItem(on,JSON.stringify({v:1,prefix:n.prefix,rows:n.rows}))}catch{}}function pe(e,n){return typeof e=="string"?e:n}function kr(e,n){if(typeof e!="object"||e===null||Array.isArray(e))return;let t=e;if(!(typeof t.keyword!="string"&&typeof t.target!="string"&&typeof t.params!="string"))return{id:pe(t.id,`alias-${n}`)||`alias-${n}`,keyword:pe(t.keyword,""),target:pe(t.target,""),params:pe(t.params,"")}}function xr(e){if(typeof e!="object"||e===null||Array.isArray(e))return ne;let n=e,t=typeof n.prefix=="boolean"?n.prefix:ne.prefix,r=Array.isArray(n.rows)?n.rows:[],o=[],i=new Set;for(let[a,l]of r.slice(0,200).entries()){let c=kr(l,a);if(c===void 0)continue;let d=c.id,s=0;for(;i.has(d);)s+=1,d=`alias-${a}-${s}`;i.add(d),o.push({...c,id:d})}return{prefix:t,rows:o}}function Sr(e){if(e===void 0)return ne;let n;try{n=e.getItem(on)}catch{return ne}if(n===null||n==="")return ne;try{return xr(JSON.parse(n))}catch{return ne}}function vr(){let e=globalThis.crypto;return e?.randomUUID!==void 0?e.randomUUID():`alias-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,8)}`}function an(e,n=vr){let t=Sr(e),r=new Set,o=i=>{t=i;for(let a of[...r])try{a()}catch(l){console.error("[dsh-better] alias store listener failed:",l)}br(e,i)};return{getSnapshot:()=>t,subscribe(i){return r.add(i),()=>{r.delete(i)}},setPrefix(i){t.prefix!==i&&o({...t,prefix:i})},addRow(){let i=n();return o({...t,rows:[...t.rows,{id:i,keyword:"",target:"",params:""}]}),i},updateRow(i,a){let l=!1,c=t.rows.map(d=>{if(d.id!==i)return d;let s={...d,...a,id:d.id};return l=s.keyword!==d.keyword||s.target!==d.target||s.params!==d.params,s});l&&o({...t,rows:c})},removeRow(i){let a=t.rows.filter(l=>l.id!==i);a.length!==t.rows.length&&o({...t,rows:a})}}}function sn(e){return e.keyword.trim()!==""&&e.target.trim()!==""}function ln(e){return e.keyword.trim().replace(/^\/+/,"").toLowerCase()}function dn(e,n){let t=n.trim().replace(/^\/+/,"").toLowerCase();return t===""?[]:e.rows.filter(r=>sn(r)&&ln(r)===t)}function un(e,n,t=!1){let r=n.trim().replace(/^\/+/,"").toLowerCase(),o=e.rows.filter(sn);if(r==="")return t?o:[];let i=[],a=[],l=[];for(let c of o){let d=ln(c);d===r?i.push(c):d.startsWith(r)?a.push(c):d.includes(r)&&l.push(c)}return[...i,...a,...l]}function cn(e){let n=e.target.trim().replace(/^\/+/,"");if(n==="")return"";let t=e.params.trim();return t===""?`/${n} `:`/${n} ${t} `}function fn(e,n){let t=/^\/([^\s/]+)([ \t]*)$/u.exec(n);if(t===null)return;let r=t[1]??"",o=dn(e,r);if(o.length!==0)return{query:r,start:0,end:n.length,rows:o}}function pn(e,n){let t=/^([^\s/]+)([ \t]*)$/u.exec(n);if(t===null)return;let r=t[1]??"",o=dn(e,r);if(o.length!==0)return{query:r,start:0,end:n.length,rows:o}}function mn(e){if(e.keyword.trim()==="")return"keyword";if(e.target.trim()==="")return"target";if(/\s/.test(e.keyword.trim()))return"keyword"}var L=require("react/jsx-runtime");function wr(e){let{row:n,store:t,t:r}=e,o=mn(n);return(0,L.jsxs)("tr",{"data-testid":"alias-row","data-row-id":n.id,"data-incomplete":o===void 0?void 0:"",children:[(0,L.jsx)("td",{children:(0,L.jsx)("input",{className:"dsh-better-alias-input","data-testid":"alias-keyword",value:n.keyword,placeholder:"wf",spellCheck:!1,autoComplete:"off","aria-label":r("alias.table.keyword"),ref:i=>{i!==null&&e.focus&&(i.focus(),e.clearFocus())},onChange:i=>t.updateRow(n.id,{keyword:i.target.value})})}),(0,L.jsx)("td",{children:(0,L.jsx)("input",{className:"dsh-better-alias-input","data-testid":"alias-target",value:n.target,placeholder:"flow-workflow",spellCheck:!1,autoComplete:"off","aria-label":r("alias.table.target"),onChange:i=>t.updateRow(n.id,{target:i.target.value})})}),(0,L.jsx)("td",{children:(0,L.jsx)("input",{className:"dsh-better-alias-input","data-testid":"alias-params",value:n.params,placeholder:r("alias.table.paramsPlaceholder"),spellCheck:!1,autoComplete:"off","aria-label":r("alias.table.params"),onChange:i=>t.updateRow(n.id,{params:i.target.value})})}),(0,L.jsx)("td",{className:"dsh-better-alias-actions",children:(0,L.jsx)("button",{type:"button",className:"dsh-better-alias-delete","data-testid":"alias-remove","aria-label":r("alias.remove",{keyword:n.keyword.trim()||r("alias.unnamed")}),title:r("alias.remove",{keyword:n.keyword.trim()||r("alias.unnamed")}),onClick:()=>t.removeRow(n.id),children:"\xD7"})})]})}function gn(e){function n(){let t=(0,me.useSyncExternalStore)(e.store.subscribe,e.store.getSnapshot,e.store.getSnapshot),{translate:r}=e,o=(0,me.useRef)(null),i=()=>{o.current=e.store.addRow()};return(0,L.jsxs)("section",{className:"dsh-better-alias-page","data-testid":"alias-page",children:[(0,L.jsx)("h2",{className:"dsh-better-alias-heading",children:r("alias.heading")}),(0,L.jsxs)("label",{className:"dsh-better-alias-prefix",children:[(0,L.jsxs)("span",{children:[(0,L.jsx)("span",{className:"dsh-better-alias-prefix-title",children:r("alias.prefix.title")}),(0,L.jsx)("span",{className:"dsh-better-alias-prefix-hint",children:r(t.prefix?"alias.prefix.on":"alias.prefix.off")})]}),(0,L.jsx)("input",{type:"checkbox","data-testid":"alias-prefix",checked:t.prefix,"aria-label":r("alias.prefix.title"),onChange:a=>e.store.setPrefix(a.target.checked)})]}),(0,L.jsxs)("div",{className:"dsh-better-alias-table-wrap",children:[(0,L.jsxs)("table",{className:"dsh-better-alias-table",children:[(0,L.jsx)("thead",{children:(0,L.jsxs)("tr",{children:[(0,L.jsx)("th",{scope:"col",children:r("alias.table.keyword")}),(0,L.jsx)("th",{scope:"col",children:r("alias.table.target")}),(0,L.jsx)("th",{scope:"col",children:r("alias.table.params")}),(0,L.jsx)("th",{scope:"col","aria-label":r("alias.table.actions")})]})}),(0,L.jsx)("tbody",{children:t.rows.map(a=>(0,L.jsx)(wr,{row:a,store:e.store,t:r,focus:o.current===a.id,clearFocus:()=>{o.current=null}},a.id))})]}),t.rows.length===0?(0,L.jsx)("p",{className:"dsh-better-alias-empty","data-testid":"alias-empty",children:r("alias.empty")}):null]}),(0,L.jsx)("button",{type:"button",className:"dsh-better-alias-add","data-testid":"alias-add",onClick:i,children:r("alias.add")}),(0,L.jsx)("p",{className:"dsh-better-alias-footnote",children:r("alias.footnote")})]})}return n}var Oe="alias",Cr="/",Lr=-1;function Er(e,n){let t=e.target.trim().replace(/^\/+/,""),r=e.keyword.trim(),o=e.params.trim();return{name:t,label:r,...o===""?{}:{description:n("alias.menu.params",{value:o})},section:n("alias.menu.section"),value:e.id}}function hn(e){return{trigger:Cr,name:Oe,order:Lr,async candidates(n,t){if(t.position!=="leading")return[];let r=e.config();return!r.prefix&&e.bareMenuOpen?.()!==!0?[]:un(r,t.query,!0).map(o=>Er(o,e.translate))},onPick(n){let t=e.config().rows.find(i=>i.id===n.candidate.value);if(t===void 0)return;let r=t.target.trim().replace(/^\/+/,"");r!==""&&e.routeCommand?.(r,n);let o=cn(t);return o===""?void 0:{text:o}}}}var yn="dsh-better/aliases.css",Rr=`
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
`;function bn(e){let n=`style[data-plugin-css=${JSON.stringify(yn)}]`;if(e.querySelector(n)!==null)return()=>{};let t=e.createElement("style");return t.dataset.plugin="dsh-better",t.dataset.pluginCss=yn,t.textContent=Rr,e.head.append(t),()=>t.remove()}var Y=require("react");var kn={draft:"",draftRev:-1,phase:"plain"};function Sn(e){return function(t){let r=(0,Y.useSyncExternalStore)(e.store.subscribe,e.store.getSnapshot,e.store.getSnapshot),o=t.sessionId===void 0?void 0:e.inputStoreFor(t.sessionId),i=t.sessionId===void 0?void 0:e.controllerFor(t.sessionId),a=(0,Y.useSyncExternalStore)(c=>o===void 0?()=>{}:o.subscribe(c),()=>o===void 0?kn:o.getSnapshot(),()=>o===void 0?kn:o.getSnapshot()),l=(0,Y.useRef)(null);return(0,Y.useEffect)(()=>{let c=t.sessionId;if(c===void 0||a.phase!=="plain"||i===void 0)return;let d=i.menu.getSnapshot().open;if(d&&l.current===null)return;let s=Ie(r,a.draft);if(d){let f=l.current;if(f!==null&&(f.draftRev!==a.draftRev||f.spanEnd!==(s?.end??-1))){let p=setTimeout(()=>{let m=o?.getSnapshot()??a,h=e.controllerFor(c);if(h===void 0||m.phase!=="plain")return;l.current=null,h.dismiss();let g=Ie(e.store.getSnapshot(),m.draft);g!==void 0&&(e.bareMenuOpen.open=!0,xn(h,g,m.draftRev),e.bareMenuOpen.open=!1,l.current={draftRev:m.draftRev,spanEnd:g.end})},80);return()=>clearTimeout(p)}return}if(l.current=null,s===void 0)return;let u=setTimeout(()=>{let f=o?.getSnapshot()??a,p=e.controllerFor(c);if(p===void 0||f.phase!=="plain"||p.menu.getSnapshot().open)return;let m=Ie(e.store.getSnapshot(),f.draft);m!==void 0&&(e.bareMenuOpen.open=!0,xn(p,m,f.draftRev),e.bareMenuOpen.open=!1,l.current={draftRev:f.draftRev,spanEnd:m.end})},80);return()=>clearTimeout(u)},[r,a.draft,a.draftRev,a.phase,i,o,t.sessionId]),null}}function Ie(e,n){return e.prefix?fn(e,n):pn(e,n)}function xn(e,n,t){e.toggleSource(Oe,{trigger:"/",query:n.query,quoted:!1,position:"leading",span:{start:n.start,end:n.end,draftRev:t}})}function J(e){return e!==void 0&&e!=="plain"}var T=require("react");var Tr="[a-z0-9]+(?:-[a-z0-9]+)*",Ar=new RegExp(`^/(${Tr})(?=\\s|$)`,"u");function ge(e,n){let t=Ar.exec(e);if(t===null)return;let r=t[1]??"";if(n(r))return{name:r,start:0,end:1+r.length}}function vn(e,n,t){return e===void 0||!Number.isInteger(t)||t<e.end||t>n.length||t!==n.length?!1:/^[ \t]*$/u.test(n.slice(e.end,t))}var Pr=/\s/u;function Cn(e,n){let t=ge(e,n);if(t===void 0)return;let r=e.length-1;for(;r>=0&&!Pr.test(e.charAt(r));)r-=1;let o=r+1,i=e.slice(o);if(!(i.length<2||!i.startsWith("--")))return{name:t.name,query:i,start:o}}function Ln(e,n){let t=n.slice(2).toLowerCase();return e.filter(r=>r.flag.startsWith("--")?r.flag.slice(2).toLowerCase().startsWith(t):!1)}function wn(e,n){let t=0;for(let r of n){let o=r.offset+r.length;if(e>=r.offset&&e<o)return;o<=e&&(t+=r.length-1)}return e-t}function En(e,n,t,r){let o=wn(t.start,n);if(o===void 0)return;let i=wn(e.length,n);if(i!==void 0)return{start:o,end:i,draftRev:r}}function Rn(e){return`${e} `}function Or(e){let n=e.occurrences;if(!Array.isArray(n))return[];let t=[];for(let r of n){if(typeof r!="object"||r===null)continue;let o=r;typeof o.offset!="number"||typeof o.length!="number"||t.push({offset:o.offset,length:o.length})}return t}var Ir=/^\/([a-z0-9]+(?:-[a-z0-9]+)*)[ \t]*$/u,Nr=400,Tn=200,An=6,_r=240,Pn={draft:"",draftRev:-1,phase:"plain"};function Dr(e,n){return`${e!==""&&!/\s$/u.test(e)?" ":""}${n} `}function In(e){return e===void 0?void 0:Ir.exec(e)?.[1]}function Mr(e){return e===void 0?[]:e.split(`
`).map(n=>n.trim()).filter(n=>n!=="")}var _e=240,De=640;function Nn(e){return!Number.isFinite(e)||e<=0?De:Math.max(_e,Math.min(De,e-24))}function Fr(e,n){let t=Nn(n),r=Number.isFinite(e)&&e>0?e:0,o=r===0?_e:r<=80?320:r<200?480:De;return Math.min(Math.max(o,_e),t)}function _n(e,n,t,r){if(!Number.isFinite(t)||t<=0)return e;let o=t-n-r;return Math.max(r,Math.min(e,Math.max(r,o)))}function Br(e,n,t){if(t<=0||typeof e.createRange!="function")return;let r=e.createRange(),o=t,i=!1,a=c=>{for(let d of Array.from(c.childNodes)){if(d.nodeType===3){let s=d.textContent??"",u=Math.min(o,s.length);if(u<=0)continue;if(i||(r.setStart(d,0),i=!0),r.setEnd(d,u),o-=u,o<=0)return!0;continue}if(a(d))return!0}return!1};if(!a(n)||o>0)return;let l=r.getBoundingClientRect();if(!(l.width===0&&l.height===0))return{left:l.left,right:l.right,top:l.top,bottom:l.bottom}}function On(e,n){let t=e.querySelectorAll("[data-composer-text-ref]");for(let r of t){if(In(r.textContent??"")!==n)continue;let o=Br(e,r,n.length+1);if(o!==void 0)return o;let i=r.getBoundingClientRect();return{left:i.left,right:i.right,top:i.top,bottom:i.bottom}}}function ye(e){return e.defaultView?.innerWidth??0}function Dn(e,n,t,r){let o=e.top-r,i=Number.isFinite(t)&&t>0?t:0;return i===0||i<=o?{left:e.left,top:0,anchor:"above"}:{left:e.left,top:e.bottom+r,anchor:"below"}}function he(e){return e.defaultView?.innerHeight??0}function Hr(e){let n=typeof e.getSelection=="function"?e.getSelection():null,t=n?.anchorNode;if(t!=null){let l=(t.nodeType===1?t:t.parentElement)?.closest("[data-composer-text-ref]");if(l!=null){let c=n?.getRangeAt===void 0||n.rangeCount===0?void 0:n.getRangeAt(0).getBoundingClientRect();if(c!==void 0&&c.height>0)return{left:c.left,right:c.left,top:c.top,bottom:c.bottom}}}let r=e.querySelectorAll("[data-composer-text-ref]"),o=r[r.length-1];if(o===void 0)return;let i=o.getBoundingClientRect();if(!(i.width===0&&i.height===0))return{left:i.left,right:i.right,top:i.top,bottom:i.bottom}}function Wr(e,n){let t=e.createElement("div");t.className="dsh-better-skill-params";let r=e.createElement("div");if(r.className="dsh-better-skill-params-title",r.textContent=`/${n.name}`,t.append(r),n.getActions()?.insertText!==void 0)for(let o of n.params)t.append($r(e,n,o.flag,o.detail));return t.style.width=`${Mn(e)}px`,t}function Mn(e){return Math.min(320,Nn(ye(e)))}function zr(e,n,t){if(t===void 0)return;let r=4,o=ye(e),i=Mn(e);n.style.width=`${i}px`;let a=Dn(t,he(e),n.offsetHeight,r);n.style.left=`${_n(a.left,i,o,12)}px`,a.anchor==="above"?(n.style.bottom=`${he(e)-t.top+r}px`,n.style.top=""):(n.style.top=`${a.top}px`,n.style.bottom="")}function $r(e,n,t,r){let o=e.createElement("button");o.type="button",o.className="dsh-better-skill-panel-param",o.addEventListener("pointerdown",a=>a.preventDefault());let i=e.createElement("span");if(i.className="dsh-better-skill-panel-param-flag",i.textContent=t,o.append(i),r!==""){let a=e.createElement("span");a.className="dsh-better-skill-panel-param-detail",a.textContent=r,o.append(a)}return o.addEventListener("click",()=>{let a=n.getActions(),l=a?.captureInsertion?.();if(a?.insertText===void 0||l===void 0)return;let c=En(n.getDraft(),n.getOccurrences(),n.match,l.draftRev);c!==void 0&&a.insertText(Rn(t),c)}),o}function Fn(e){return function(t){let r=e.document??globalThis.document,o=t.sessionId,i=o===void 0?void 0:e.inputStoreFor(o),a=t.useInput,l=a===void 0?void 0:a(x=>x.draft),c=a===void 0?void 0:a(x=>x.phase),d=a===void 0?void 0:a(x=>x.occurrences),s=(0,T.useSyncExternalStore)(x=>i===void 0?()=>{}:i.subscribe(x),()=>i===void 0?Pn:i.getSnapshot(),()=>i===void 0?Pn:i.getSnapshot()),u=l??s.draft,f=c??s.phase,[p,m]=(0,T.useState)(()=>new Set),[h,g]=(0,T.useState)(void 0),[b,A]=(0,T.useState)(void 0),[R,C]=(0,T.useState)(void 0),[S,v]=(0,T.useState)(void 0),[w,W]=(0,T.useState)(void 0),[k,I]=(0,T.useState)(void 0);(0,T.useEffect)(()=>{if(o===void 0)return;let x=!0;return e.skillNamesFor(o).then(O=>{x&&m(O)},()=>{x&&m(new Set)}),()=>{x=!1}},[o]);let B=ge(u,x=>p.has(x)),M=vn(B,u,u.length)&&!J(f)?B?.name:void 0,D=Cn(u,x=>p.has(x)),N=D!==void 0&&!J(f)&&w!==u,F=M??b??(N?D.name:void 0);(0,T.useEffect)(()=>{if(o===void 0||F===void 0){g(void 0);return}let x=!0;return e.loadProfile(o,F).then(O=>{x&&g(O)},()=>{x&&g(void 0)}),()=>{x=!1}},[o,F]),(0,T.useEffect)(()=>{if(r===void 0||M===void 0){C(void 0);return}let x=()=>C(On(r,M));x();let O=r.defaultView;return O?.addEventListener("resize",x),()=>O?.removeEventListener("resize",x)},[r,M,u]);let $=(0,T.useRef)(null),q=(0,T.useRef)(null),G=()=>{$.current!==null&&clearTimeout($.current),$.current=null},y=()=>{q.current!==null&&clearTimeout(q.current),q.current=null};(0,T.useEffect)(()=>{if(r===void 0||o===void 0)return;let x=ee=>{let K=ee.target;if(!(K instanceof r.defaultView.Element))return;let rn=K.closest("[data-composer-text-ref]");if(rn===null)return;let fe=In(rn.textContent??"");fe!==void 0&&(y(),G(),$.current=setTimeout(()=>{$.current=null,A(fe),C(On(r,fe)),v(e.loadUsage(o,fe))},Nr))},O=ee=>{let K=ee.target;K instanceof r.defaultView.Element&&K.closest("[data-composer-text-ref]")!==null&&(G(),y(),q.current=setTimeout(()=>{q.current=null,A(void 0)},Tn))};return r.addEventListener("pointerover",x,!0),r.addEventListener("pointerout",O,!0),()=>{G(),y(),r.removeEventListener("pointerover",x,!0),r.removeEventListener("pointerout",O,!0)}},[r,o]),(0,T.useEffect)(()=>{if(r===void 0||b===void 0)return;let x=O=>{O.key==="Escape"&&A(void 0)};return r.addEventListener("keydown",x),()=>r.removeEventListener("keydown",x)},[r,b]);let P=(0,T.useRef)(u);P.current=u;let _=(0,T.useRef)(void 0);_.current=t.inputActions??(o===void 0?void 0:e.actionsFor(o));let ce=(0,T.useRef)([]);ce.current=Or({draft:u,draftRev:s.draftRev,phase:f,occurrences:d??s.occurrences});let Ae=(0,T.useRef)(void 0);return(0,T.useEffect)(()=>{if(r===void 0||M===void 0||R===void 0)return;let x=Mr(h?.argumentHint);if(x.length===0)return;let O=Ur(r,R,x);return r.body.append(O),()=>O.remove()},[r,M,R,h]),(0,T.useEffect)(()=>{if(r===void 0||b===void 0||N)return;let x=Vr(r,e,{name:b,profile:h,usage:S,box:R,sessionId:o,getActions:()=>_.current,getDraft:()=>P.current,onEnter:y,onLeave:()=>{G(),y(),q.current=setTimeout(()=>{q.current=null,A(void 0)},Tn)}});return r.body.append(x),()=>x.remove()},[r,b,h,S,R,o,N]),(0,T.useEffect)(()=>{if(r===void 0||!N){I(void 0);return}let x=()=>I(Hr(r));x();let O=r.defaultView;return O?.addEventListener("resize",x),()=>O?.removeEventListener("resize",x)},[r,N,u]),(0,T.useEffect)(()=>{if(r===void 0||!N||D===void 0)return;let x=Ln(h?.params??[],D.query);if(x.length===0)return;let O=Wr(r,{name:D.name,match:D,params:x,getActions:()=>_.current,getDraft:()=>P.current,getOccurrences:()=>ce.current});return Ae.current=O,r.body.append(O),zr(r,O,k),()=>{Ae.current=void 0,O.remove()}},[r,N,D,h,k]),(0,T.useEffect)(()=>{if(r===void 0||!N)return;let x=O=>{O.key==="Escape"&&W(P.current)};return r.addEventListener("keydown",x),()=>r.removeEventListener("keydown",x)},[r,N]),(0,T.useEffect)(()=>{if(r===void 0||!N)return;let x=O=>{let ee=Ae.current,K=O.target;ee!==void 0&&K instanceof Node&&ee.contains(K)||W(P.current)};return r.addEventListener("pointerdown",x,!0),()=>r.removeEventListener("pointerdown",x,!0)},[r,N]),null}}function Ur(e,n,t){let r=e.createElement("div");r.className="dsh-better-skill-hint",r.textContent=t.join(`
`);let o=n.right+An>ye(e)-_r;return r.style.left=`${o?n.left:n.right+An}px`,r.style.top=`${o?n.bottom+2:n.top}px`,r}function Vr(e,n,t){let r=e.createElement("div");r.className="dsh-better-skill-panel",r.addEventListener("pointerenter",t.onEnter),r.addEventListener("pointerleave",t.onLeave);let o=e.createElement("div");o.className="dsh-better-skill-panel-title",o.textContent=`/${t.name}`,r.append(o);let i=t.profile?.description;if(i!==void 0&&i!==""){let s=e.createElement("div");s.className="dsh-better-skill-panel-desc",s.textContent=i,s.title=i,r.append(s)}let a=t.profile?.metadata??{},l=Object.keys(a);if(l.length>0){let s=e.createElement("div");s.className="dsh-better-skill-panel-section",s.append(Ne(e,n.translate("skill.metadata")));for(let u of l){let f=e.createElement("div");f.textContent=`${u}: ${a[u]??""}`,s.append(f)}r.append(s)}let c=t.profile?.path;if(c!==void 0&&c!==""){r.append(Ne(e,n.translate("skill.path")));let s=e.createElement("div");s.className="dsh-better-skill-panel-path",s.textContent=c,r.append(s)}if(t.usage!==void 0){let s=e.createElement("div");s.className="dsh-better-skill-panel-counts",s.textContent=`${n.translate("skill.usage.session")} ${t.usage.session}`,t.usage.workspace!==void 0&&(s.textContent+=` \xB7 ${n.translate("skill.usage.workspace")} ${t.usage.workspace}`),r.append(s)}let d=t.profile?.params??[];if(d.length>0&&t.getActions()?.insertText!==void 0){r.append(Ne(e,n.translate("skill.params")));for(let s of d)r.append(jr(e,n,t,s.flag,s.detail))}{let u=ye(e),f=Fr(i?.length??0,u);if(r.style.width=`${f}px`,t.box!==void 0){let p=Dn(t.box,he(e),r.offsetHeight,4);r.style.left=`${_n(p.left,f,u,12)}px`,p.anchor==="above"?(r.style.bottom=`${he(e)-t.box.top+4}px`,r.style.top=""):(r.style.top=`${p.top}px`,r.style.bottom="")}}return r}function Ne(e,n){let t=e.createElement("div");return t.className="dsh-better-skill-panel-label",t.textContent=n,t}function jr(e,n,t,r,o){let i=e.createElement("button");i.type="button",i.className="dsh-better-skill-panel-param",i.title=n.translate("skill.hint.insert"),i.addEventListener("pointerdown",l=>l.preventDefault());let a=e.createElement("span");if(a.className="dsh-better-skill-panel-param-flag",a.textContent=r,i.append(a),o!==""){let l=e.createElement("span");l.className="dsh-better-skill-panel-param-detail",l.textContent=o,i.append(l)}return i.addEventListener("click",()=>{let l=t.getActions();if(l?.insertText===void 0||l.captureInsertion===void 0)return;let c=l.captureInsertion();l.insertText(Dr(t.getDraft(),r),c)}),i}var Bn="dsh-better/skill-enhancer.css",qr=`
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
`;function Hn(e){if(e===void 0)return()=>{};let n=`style[data-plugin-css=${JSON.stringify(Bn)}]`;if(e.querySelector(n)!==null)return()=>{};let t=e.createElement("style");return t.dataset.plugin="dsh-better",t.dataset.pluginCss=Bn,t.textContent=qr,e.head.append(t),()=>t.remove()}function Wn(e,n,t){if(n===void 0||n===""||e.length===0)return;let r=0;for(let o of e){if(o.cwd!==n)continue;let i=o.usage?.[t];typeof i=="number"&&Number.isFinite(i)&&(r+=i)}return r}var E=require("react");var Kr="@deepseek-ai/dsh-client-ui-commands/PopupSelectView.module.css";function zn(e){if(e===void 0)return;let t=e.querySelector(`style[data-plugin-css="${Kr}"]`)?.textContent??"",r=i=>new RegExp(`\\.(\\w+_${i})\\{`,"u").exec(t)?.[1],o={badges:"dshBetter_badges",badgeChip:"dshBetter_badgeChip",badgeChipOn:"dshBetter_badgeChipOn",card:r("card"),viewport:r("viewport"),row:r("row"),rowActive:r("rowActive"),label:r("label"),labelText:r("labelText"),badge:r("badge"),detail:r("detail"),check:r("check"),status:r("status"),search:r("search"),error:r("error"),errorText:r("errorText"),retry:r("retry")};for(let[i,a]of Object.entries(o))if(!(i==="badges"||i==="badgeChip"||i==="badgeChipOn")&&a===void 0)return;return o}function Me(e,n){for(let t of e)if(t.id===n.provider){for(let r of t.models)if(r.id===n.model)return r.reasoning}}function $n(e,n){let t=Me(e,n)?.efforts;return t===void 0?[]:[...t]}function Un(e,n){if(e.length===0)return;let t=r=>r!==void 0&&e.some(o=>o.id===r);return t(n.remembered)?n.remembered:n.isCurrent&&t(n.currentEffort)?n.currentEffort:t(n.defaultEffort)?n.defaultEffort:e[0]?.id}function Gr(e){return e.length>1}function Vn(e){return Gr(e)?e:[]}var j=require("react/jsx-runtime");function be(e){let n=e.group?.name;if(n===void 0)return;let t=`${n}/`,r=e.id.startsWith(t)?e.id.slice(t.length):e.id;return{provider:n,model:r}}function Yr(e,n){let t=be(e);return Vn(t===void 0?[]:$n(n??[],t))}function jn({option:e,active:n,catalog:t,pointed:r,classes:o,primitives:i,onChoose:a,onPickEffort:l,onHover:c,t:d}){let s=Yr(e,t),u=i.IconCheckOutlineRegular;return(0,j.jsxs)("div",{role:"option","aria-selected":n,"aria-label":e.badge===void 0?void 0:`${e.label} ${e.badge}`,className:n?`${o.row} ${o.rowActive}`:o.row,onClick:a,onMouseEnter:c,children:[(0,j.jsxs)("span",{className:o.label,children:[(0,j.jsx)("span",{className:o.labelText,children:e.label}),e.badge!==void 0&&(0,j.jsx)("sup",{className:o.badge,children:e.badge})]}),e.detail!==void 0&&(0,j.jsx)("span",{className:o.detail,children:e.detail}),s.length>0&&(0,j.jsx)("span",{className:o.badges,role:"group","aria-label":d?.("listbox.aria")??"",children:s.map(f=>(0,j.jsx)("button",{type:"button",className:f.id===r?`${o.badgeChip} ${o.badgeChipOn}`:o.badgeChip,title:f.description??f.name,onClick:p=>{p.stopPropagation(),l(f.id)},children:f.name},f.id))}),e.active===!0&&s.length===0&&(0,j.jsx)("span",{className:o.check,children:u===void 0?null:(0,j.jsx)(u,{})})]})}function ke(e){let n=new Map;for(let t of e){let r=t.group?.name,o=n.get(r);o!==void 0?o.rows.push(t):n.set(r,{group:t.group,rows:[t]})}return[...n.values()]}function xe(e){let n=ke(e);return n.some(t=>t.group!==void 0)?n.flatMap(t=>t.rows):[...e]}function qn(e,n,t){return t===void 0?e.filter(r=>r.label.toLowerCase().includes(n)):ke(e).flatMap(r=>t(r.rows.map(o=>({name:o.label,option:o})),n).map(o=>o.option))}var Fe=new WeakSet;async function Kn(e,n){let t=e.binding,r=e.state.getSnapshot();if(!(t===null||r.submitting||Fe.has(e))){Fe.add(e),e.state.set?.({...r,submitting:!0,confirming:null,acknowledged:!1,error:null});try{let o=n();if(o===void 0)return;await o,t!==null&&e.binding===t&&e.deps?.consume?.(t.segment)}finally{Fe.delete(e),t!==null&&e.binding===t&&e.dismiss({focusComposer:!0})}}}var Jr="@deepseek-ai/dsh-client-ui-primitives";function Se(e){if(e===null)return{};let n;try{n=e(Jr)}catch{return{}}if(n===null||typeof n!="object")return{};let t=n,r=g=>typeof g=="function"||typeof g=="object"&&g!==null,o=g=>{let b=t[g];return r(b)?b:void 0},i=g=>{let b=t[g];return typeof b=="function"?b:void 0},a={},l=o("MenuSurface");l!==void 0&&(a.MenuSurface=l);let c=o("MenuGroup");c!==void 0&&(a.MenuGroup=c);let d=o("IconCheckOutlineRegular");d!==void 0&&(a.IconCheckOutlineRegular=d);let s=o("IconDataOutlineRegular");s!==void 0&&(a.IconDataOutlineRegular=s);let u=o("IconChevronDownOutlineRegular");u!==void 0&&(a.IconChevronDownOutlineRegular=u);let f=o("Tag");f!==void 0&&(a.Tag=f);let p=i("useAnchoredMaxHeight");p!==void 0&&(a.useAnchoredMaxHeight=p);let m=i("observeStickyMenuGroups");m!==void 0&&(a.observeStickyMenuGroups=m);let h=i("rankByName");return h!==void 0&&(a.rankByName=h),a}function Xr(e){if(e===void 0)return[];let n=[e.name,e.label].map(t=>t.trim().toLowerCase()).filter(t=>t!=="");return[...new Set(n)]}function Zr(e,n){return Xr(e.group).some(t=>t.includes(n))}function Qr(e,n,t,r){return t==="fuzzy-label"?qn(e,n,r):xe(e).filter(o=>o.label.toLowerCase().includes(n)||o.detail?.toLowerCase().includes(n)===!0)}function Gn(e,n,t,r){let o=n.trim().toLowerCase();if(o==="")return xe(e);let i=Qr(e,o,t,r),a=new Set(i),l=xe(e).filter(c=>!a.has(c)&&Zr(c,o));return[...i,...l]}var H=require("react/jsx-runtime"),Zn="model",Yn=320;function eo(e){return e.command!==Zn||!e.open||e.status!=="ready"||e.confirming!==null||e.options.length===0?!1:e.submitting||e.error===null}function no(e){return e===void 0?!1:/Android|iPhone|iPad|iPod/i.test(e.userAgent)||e.platform==="MacIntel"&&e.maxTouchPoints>1}var to={subscribe:()=>()=>{},getSnapshot:()=>({open:!1,command:null,status:"pending",options:[],search:"",searchLabels:null,searchMode:"substring",active:0,submitting:!1,confirming:null,acknowledged:!1,error:null})};function Qn(e){let n=Se(e.load);function t(r){let o=r.popup,i=o?.state??to,a=(0,E.useCallback)(s=>i.subscribe(s),[i]),l=(0,E.useCallback)(()=>i.getSnapshot(),[i]),c=(0,E.useSyncExternalStore)(a,l),d=e.native();return o===void 0||d===void 0?null:!eo(c)||o.settle===void 0?(0,H.jsx)(d,{...r}):(0,H.jsx)(ro,{popup:o,state:c,t:r.t,primitives:n,doc:e.document,catalog:r.catalog,current:r.current,selectModel:r.selectModel})}return t}function ro({popup:e,state:n,t,primitives:r,doc:o,catalog:i,current:a,selectModel:l}){let c=(0,E.useRef)(null),d=(0,E.useRef)(null),s=(0,E.useRef)(null),u=(0,E.useMemo)(()=>zn(o),[o]),f=n.searchMode,p=(0,E.useMemo)(()=>Gn(n.options,n.search,f,r.rankByName),[n.options,n.search,f,r.rankByName]),m=(0,E.useMemo)(()=>ke(p),[p]),[h,g]=(0,E.useState)({}),[b,A]=(0,E.useState)(()=>Jn(p));(0,E.useEffect)(()=>{A(Jn(p))},[n.search,n.options]);let R=Xn(p,b),C=oo(r,c,n);(0,E.useEffect)(()=>{let y=s.current;if(!(y===null||r.observeStickyMenuGroups===void 0))return r.observeStickyMenuGroups(y)},[r.observeStickyMenuGroups,n.open,n.status,m]),(0,E.useEffect)(()=>{c.current?.querySelector('[aria-selected="true"]')?.scrollIntoView({block:"nearest"})},[R,p]),(0,E.useEffect)(()=>{if(!n.open)return;let y=P=>{let _=c.current;_!==null&&P.target instanceof Node&&_.contains(P.target)||e.dismiss()};return o?.addEventListener("pointerdown",y,!0),()=>{o?.removeEventListener("pointerdown",y,!0)}},[o,e,n.open]),(0,E.useEffect)(()=>{n.open&&(no(o?.defaultView?.navigator)||d.current?.focus())},[o,n.open]);let S=(0,E.useCallback)((y,P)=>{if(P===void 0||l===void 0){e.settle?.(e.binding,y);return}let _=be(y);if(_===void 0){e.settle?.(e.binding,y);return}Kn(e,()=>l({..._,reasoningEffort:P}))},[e,l]),v=(0,E.useCallback)(y=>{let P=be(y);if(P===void 0)return;let _=Me(i??[],P);return Un(_?.efforts??[],{remembered:h[y.id],isCurrent:a?.provider===P.provider&&a?.model===P.model,currentEffort:a?.reasoningEffort,defaultEffort:_?.defaultEffort})},[i,a,h]),w=(0,E.useCallback)(y=>{S(y,v(y))},[v,S]),W=(0,E.useCallback)((y,P)=>{g(_=>({..._,[y.id]:P})),S(y,P)},[S]),k=(0,E.useCallback)(()=>{let y=p[R];y!==void 0&&w(y)},[R,w,p]),I=(0,E.useCallback)(y=>{p.length!==0&&A(P=>(Xn(p,P)+y+p.length)%p.length)},[p]),B=y=>{switch(y.key){case"ArrowDown":y.preventDefault(),I(1);return;case"ArrowUp":y.preventDefault(),I(-1);return;case"Enter":y.preventDefault(),k();return;case"Tab":if(!y.shiftKey&&p.length===0)return;y.preventDefault(),y.shiftKey?e.dismiss({focusComposer:!0}):k();return;case"Escape":y.preventDefault(),e.dismiss({focusComposer:!0});return;default:}};if(u===void 0)return null;let M=n.searchLabels?.placeholder??t?.("search.placeholder")??"",D=n.searchLabels===null?t?.("status.empty")??"":n.options.length===0?n.searchLabels.empty:n.searchLabels.noResults,N=(y,P)=>(0,H.jsx)(jn,{option:y,active:P===R,catalog:i,pointed:P===R?v(y):void 0,classes:u,primitives:r,onChoose:()=>{w(y)},onPickEffort:_=>{W(y,_)},onHover:()=>{A(P)},t},y.id),F=0,$=m.map(({group:y,rows:P})=>{let _=P.map(ce=>N(ce,F++));return y===void 0?(0,H.jsx)(E.Fragment,{children:_},"ungrouped"):r.MenuGroup===void 0?(0,H.jsx)(E.Fragment,{children:_},`group:${y.name}`):(0,H.jsx)(r.MenuGroup,{label:y.label,children:_},`group:${y.name}`)}),q=(0,H.jsxs)(H.Fragment,{children:[(0,H.jsx)("input",{ref:d,className:u.search,type:"text",placeholder:M,"aria-label":t?.("search.aria")??"",value:n.search,readOnly:n.submitting,onChange:y=>{e.setSearch(y.currentTarget.value)}}),n.submitting&&(0,H.jsx)("div",{className:u.status,children:t?.("status.applying")??""}),!n.submitting&&p.length===0&&(0,H.jsx)("div",{className:u.status,children:D}),p.length>0&&(0,H.jsx)("div",{ref:s,role:"listbox","aria-label":t?.("listbox.aria")??"",className:u.viewport,children:$})]}),G={className:u.card,style:{maxHeight:C},"aria-label":t?.("overlay.aria")??Zn,onKeyDown:B};return r.MenuSurface===void 0?(0,H.jsx)("div",{ref:c,...G,children:q}):(0,H.jsx)(r.MenuSurface,{ref:c,...G,children:q})}function Jn(e){let n=e.findIndex(t=>t.active===!0);return n===-1?0:n}function Xn(e,n){return e.length===0?0:Math.min(Math.max(n,0),e.length-1)}function oo(e,n,t){let r=e.useAnchoredMaxHeight;return r===void 0?Yn:r(n,Yn,t)}var V=require("react");var Be="application/x-dsh-composer+json";var io=Object.freeze({png:"image/png",jpg:"image/jpeg",jpeg:"image/jpeg",webp:"image/webp",gif:"image/gif",bmp:"image/bmp",svg:"image/svg+xml",avif:"image/avif",heic:"image/heic",heif:"image/heif",tif:"image/tiff",tiff:"image/tiff"});function et(e){return JSON.stringify({v:1,text:e.text,attachments:e.attachments.map(n=>({path:n.path,name:n.name,type:n.type,kind:n.kind}))})}function nt(e){if(typeof e!="string"||e==="")return;let n;try{n=JSON.parse(e)}catch{return}if(n===null||typeof n!="object")return;let t=n;if(t.v!==1)return;let r=typeof t.text=="string"?t.text:"",o=Array.isArray(t.attachments)?t.attachments:[],i=[];for(let a of o){if(a===null||typeof a!="object")continue;let l=a,c=l.path;typeof c!="string"||c===""||i.push({path:c,name:typeof l.name=="string"&&l.name!==""?l.name:We(c),type:typeof l.type=="string"?l.type:"",kind:l.kind==="image"?"image":"file"})}return{text:r,attachments:i}}function He(e,n){if(n.length===0)return e;let t=n.join(`
`);return e===""?t:`${e.replace(/\n+$/u,"")}

${t}`}function tt(e){if(e==="")return;let n=e.split(`
`),t=[],r=n.length;for(let i=n.length-1;i>=0;i-=1){let a=n[i]??"";if(a.trim()===""){if(t.length>0){r=i;continue}continue}let l=ao(a);if(l===void 0)break;t.unshift(l),r=i}return t.length===0?void 0:{text:n.slice(0,r).join(`
`).replace(/\n+$/u,""),paths:t}}function ao(e){let n=e.trim();if(n.startsWith("@")&&(n=n.slice(1)),n.startsWith('"')&&n.endsWith('"')&&n.length>1&&(n=n.slice(1,-1)),n!==""&&so(n)&&!/[\u0000-\u001f\u007f]/u.test(n)&&!/["\u2018\u2019\u201c\u201d\u300c\u300d\u300e\u300f\u3002\uff01\uff1f\uff1b\uff1a\uff0c\u3001\u2026*?;<>|&$`!#=]/u.test(n)&&!/(?:^|\s)-{1,2}\S/u.test(n))return n}function so(e){return e.startsWith("/")||/^[A-Za-z]:[/\\]/u.test(e)||e.startsWith("\\\\")}function rt(e){let n=/\.([A-Za-z0-9]+)$/u.exec(e);if(n!==null)return io[n[1]?.toLowerCase()??""]}function We(e){return e.split(/[\\/]/u).filter(t=>t!=="").at(-1)??e}function ot(e,n){let t=new Set(n),r=[],o=[];for(let i of e){if(t.has(i.path)){o.push(i.path);continue}t.add(i.path),r.push(i)}return{accepted:r,duplicates:o}}var te=require("react/jsx-runtime"),lo="data-dsh-better-attach-item",uo="data-dsh-better-attach-selected",co=4500,fo=new Set(["a","c","x","insert"]),po=new Set(["meta","control","shift","alt","altgraph","capslock","os"]),mo=/\s/u;function at(e){function n(t){let r=e.native();return r===void 0?null:(0,te.jsx)(go,{native:r,props:t,deps:e})}return n}function go({native:e,props:n,deps:t}){let r=(0,V.useRef)(null),[o,i]=(0,V.useState)(!1),[a,l]=(0,V.useState)(null),c=(n.attachments??[]).length>0,d=(0,V.useRef)(n);d.current=n;let s=(0,V.useRef)(o);s.current=o;let u=(p,m)=>n.t?.(p,m)??t.translate()?.(p,m)??"",f=(0,V.useRef)(u);return f.current=u,(0,V.useEffect)(()=>{let p=r.current;if(p===null)return;let m=p.querySelector('[role="group"]');if(m!==null)for(let h of Array.from(m.children)){if(!(h instanceof HTMLElement))continue;h.toggleAttribute(lo,!0);let g=ko(h);g!==null&&g.toggleAttribute(uo,o)}},[o,n.attachments]),(0,V.useEffect)(()=>{if(a===null)return;let p=globalThis.setTimeout(()=>{l(null)},co);return()=>{globalThis.clearTimeout(p)}},[a]),(0,V.useEffect)(()=>{let p=r.current;if(p===null)return;let m=p.closest("[data-composer-card]");if(!(m instanceof HTMLElement))return;let h=m.ownerDocument,g=k=>(k instanceof Element?k:k instanceof Node?k.parentElement:null)?.closest("[contenteditable]")??null,b=()=>{s.current&&i(!1)},A=()=>{let k=m.ownerDocument.getSelection();return k!==null&&!k.isCollapsed&&k.toString()!==""},R=k=>k instanceof Node&&m.contains(k),C=k=>{let I=k.key.toLowerCase();if(po.has(I))return;let B=k.metaKey||k.ctrlKey;if(B&&!k.altKey&&I==="a"){R(k.target)&&g(k.target)?.getAttribute("contenteditable")==="true"&&i(!0);return}if(B&&!k.altKey&&I==="c"&&s.current&&R(k.target)&&!A()){k.preventDefault(),yo(d.current,t,l,f.current);return}B&&!k.altKey&&fo.has(I)||b()},S=()=>{b()},v=k=>{let B=d.current.attachments??[],M=k.clipboardData;if(!s.current||B.length===0||M===null)return;let D=[],N=[];for(let F of B){let $=t.pathOf(F.file);if($===""){N.push(F.file.name);continue}D.push({path:$,name:F.file.name,type:F.file.type,kind:F.kind})}if(D.length>0){let F=M.getData("text/plain");M.setData(Be,et({text:F,attachments:D})),M.setData("text/plain",He(F,D.map($=>$.path)))}N.length>0&&l(f.current("attach.copySkipped",{count:String(N.length)}))},w=k=>{let I=k.clipboardData;if(I===null||g(k.target)===null||Array.from(I.types).includes("Files"))return;let B=()=>d.current,M=nt(I.getData(Be)),D=M===void 0?tt(I.getData("text/plain")):void 0;if(M===void 0&&D===void 0)return;let N=ho(d.current.phase?.(),f.current);if(N!==void 0){k.preventDefault(),k.stopPropagation(),l(N);return}if(k.preventDefault(),k.stopPropagation(),b(),M!==void 0){it(M,B,t,l,f.current);return}D!==void 0&&it({text:D.text,attachments:D.paths.map(F=>{let $=rt(F)??"";return{path:F,name:We(F),type:$,kind:$===""?"file":"image"}})},B,t,l,f.current)};h.addEventListener("keydown",C,!0),m.addEventListener("paste",w,!0);let W=k=>{let I=k.relatedTarget;I instanceof Node&&m.contains(I)||b()};return m.addEventListener("focusout",W),h.addEventListener("copy",v),h.addEventListener("pointerdown",S,!0),()=>{h.removeEventListener("keydown",C,!0),h.removeEventListener("copy",v),m.removeEventListener("paste",w,!0),m.removeEventListener("focusout",W),h.removeEventListener("pointerdown",S,!0)}},[t]),(0,te.jsxs)("div",{ref:r,className:c?"dshBetter_railHost":"dshBetter_railHostEmpty",children:[(0,te.jsx)(e,{...n}),a!==null&&(0,te.jsx)("div",{className:"dshBetter_attachNotice",role:"status",children:a})]})}function ho(e,n){return J(e)?n("attach.pasteBusy"):void 0}function yo(e,n,t,r){let o=e.attachments??[],i=[],a=0;for(let l of o){let c=n.pathOf(l.file);c===""?a+=1:i.push(c)}i.length>0&&globalThis.navigator?.clipboard?.writeText(He("",i)).catch(()=>{t(r("attach.copyFailed"))}),a>0&&t(r("attach.copySkipped",{count:String(a)}))}function it(e,n,t,r,o){let i=n();if(ze(i,e.text),e.attachments.length===0)return;let a=t.reader(),l=i.sessionId;if(a===void 0||l===void 0){ze(i,e.attachments.map(s=>s.path).join(`
`));return}let c=(i.attachments??[]).map(s=>t.pathOf(s.file)).filter(s=>s!==""),{accepted:d}=ot(e.attachments,c);d.length!==0&&(async()=>{let s=[],u=[],f=0;for(let m of d){let h=await bo(a,l,m);h.kind==="file"?s.push(h.file):h.kind==="mention"?u.push(h.mention):f+=1}let p=n();u.length>0&&ze(p,u.join(" ")),s.length>0&&p.onAddFiles?.(s),f>0&&r(o("attach.pasteMissing",{count:String(f)})),u.length>0&&r(o("attach.pasteReferenced",{count:String(u.length)}))})()}function ze(e,n){if(n==="")return;let t=e.inputActions,r=t?.captureInsertion?.();t?.insertText===void 0||r===void 0||t.insertText(n,r)}async function bo(e,n,t){let r=await e.readBytes?.(n,t.path,{});if(r!==void 0&&r.ok)return{kind:"file",file:new File([r.value.data],t.name,{type:t.type})};let o=await e.stat?.(n,t.path);return o!==void 0&&o.ok?{kind:"mention",mention:xo(t.path)}:{kind:"missing"}}function ko(e){let n=e.querySelector("img")?.parentElement;if(n!=null)return n;let t=e.firstElementChild;return t instanceof HTMLElement?t:null}function xo(e){return mo.test(e)?`@"${e}"`:`@${e}`}var So="better.focusComposer",vo=Object.freeze(["focus input","focus composer","message input"]),se="command.focusComposer",wo=Object.freeze(["page","editable","terminal"]),Co=Object.freeze({"desktop:macos":{code:"Space",modifiers:["primary"]},"desktop:windows":{code:"Space",modifiers:["primary","shift"]},"web:macos":{code:"Space",modifiers:["primary","shift"]},"web:windows":{code:"Space",modifiers:["primary","shift"]}}),Lo="[data-composer-input], [role='textbox'][aria-multiline='true']";function lt(e){return e===void 0||typeof e.querySelector!="function"?!1:e.querySelector(Lo)!=null}function $e(e,n){if(e===null||typeof e!="object")return;let t=e.get;if(typeof t=="function"){let r=t.call(e,n);return r===null?void 0:r}return e[n]}var st=e=>typeof e=="string"&&e!==""?e:void 0;function dt(e){let t=$e(e,"uiSession")?.adapter?.current?.getSnapshot?.();if(t!==void 0)return st(t.key);let r=$e(e,"sessions");return st(r?.list?.getSnapshot?.()?.current)}function ut(e,n){try{let t=e.sessions?.scope?.(n);if(t===void 0)return!1;let o=$e(t,"conversation")?.input?.for?.(t);return o===void 0||typeof o.focus!="function"?!1:(o.focus(),!0)}catch{return!1}}function Eo(e){return(n={})=>{if(n.modal!=null)return{status:"pass"};if(!e.composerMounted())return{status:"pass"};let t=e.currentSessionId();return t===void 0?{status:"pass"}:{status:"handled",run:()=>{e.focusComposer(t)}}}}function Ro(e,n){return{id:So,label:n,aliases:vo,defaults:Co,regions:wo,modals:[],resolve:Eo(e)}}function ct(e,n,t,r){if(e===void 0||typeof e.register!="function")return()=>{};try{return e.register(Ro(n,t))}catch(o){return r?.(o instanceof Error?o.message:String(o)),()=>{}}}var ft=Object.freeze({zh:{"overlay.aria":"\u9009\u62E9\u6A21\u578B","listbox.aria":"\u6A21\u578B\u5339\u914D\u9879","search.aria":"\u641C\u7D22\u4F9B\u5E94\u5546\u6216\u6A21\u578B","search.placeholder":"\u641C\u7D22\u4F9B\u5E94\u5546\u6216\u6A21\u578B\u2026","status.empty":"\u6CA1\u6709\u53EF\u7528\u7684\u6A21\u578B\u3002","status.applying":"\u6B63\u5728\u5207\u6362\u2026",retry:"\u91CD\u8BD5","trigger.selectAria":"\u9009\u62E9\u6A21\u578B","trigger.aria":"\u5F53\u524D\u6A21\u578B {model}\uFF0C\u70B9\u51FB\u5207\u6362","trigger.ariaEffort":"\u5F53\u524D\u6A21\u578B {model}\uFF0C\u63A8\u7406\u7B49\u7EA7 {effort}\uFF0C\u70B9\u51FB\u5207\u6362","trigger.fallback":"\u9009\u62E9\u6A21\u578B","trigger.loading":"\u52A0\u8F7D\u6A21\u578B\u2026",[se]:"\u805A\u7126\u8F93\u5165\u6846","attach.copySkipped":"{count} \u4E2A\u9644\u4EF6\u6765\u81EA\u526A\u8D34\u677F\u3001\u6CA1\u6709\u672C\u5730\u8DEF\u5F84\uFF0C\u672A\u590D\u5236","attach.pasteMissing":"{count} \u4E2A\u9644\u4EF6\u5BF9\u5E94\u7684\u6587\u4EF6\u5DF2\u4E0D\u5B58\u5728\uFF0C\u672A\u7C98\u8D34","attach.pasteReferenced":"{count} \u4E2A\u9644\u4EF6\u8D85\u51FA\u5355\u6B21\u8BFB\u53D6\u4E0A\u9650\uFF0C\u5DF2\u6539\u4E3A\u8DEF\u5F84\u5F15\u7528","attach.copyFailed":"\u6D4F\u89C8\u5668\u62D2\u7EDD\u4E86\u8FD9\u6B21\u526A\u8D34\u677F\u5199\u5165","attach.pasteBusy":"\u6D88\u606F\u6B63\u5728\u53D1\u9001\uFF0C\u7A0D\u540E\u518D\u7C98\u8D34","compaction.reading":"\u538B\u7F29 {count} \u6B21","compaction.readingOne":"\u538B\u7F29 1 \u6B21","compaction.tooltip":"\u672C\u4F1A\u8BDD\u4E0A\u4E0B\u6587\u5DF2\u538B\u7F29 {count} \u6B21","compaction.tooltipWithFailures":"\u672C\u4F1A\u8BDD\u4E0A\u4E0B\u6587\u5DF2\u538B\u7F29 {count} \u6B21\uFF0C\u53E6\u6709 {failures} \u6B21\u538B\u7F29\u5931\u8D25","tabs.nav":"Tab \u7BA1\u7406","tabs.heading":"Tab \u7BA1\u7406","tabs.empty":"\u8FD8\u6CA1\u6709\u63D2\u4EF6\u6CE8\u518C\u4F1A\u8BDD\u6807\u7B7E\u3002","tabs.show":"\u5728\u6807\u7B7E\u680F\u663E\u793A{label}","tabs.hide":"\u4ECE\u6807\u7B7E\u680F\u9690\u85CF{label}","alias.nav":"\u6280\u80FD\u522B\u540D","alias.heading":"\u6280\u80FD\u522B\u540D","alias.prefix.title":"\u9700\u8981\u659C\u6760\u524D\u7F00","alias.prefix.on":"\u6253\u5F00\u5219\u9700\u8981\u8F93\u5165 \u201C/\u201D \u8FDB\u884C\u5339\u914D","alias.prefix.off":"\u6253\u5F00\u5219\u65E0\u9700\u8F93\u5165 \u201C/\u201D \u8FDB\u884C\u5339\u914D","alias.table.keyword":"\u5173\u952E\u8BCD","alias.table.target":"\u6280\u80FD\u6216\u547D\u4EE4","alias.table.params":"\u53C2\u6570","alias.table.paramsPlaceholder":"\u53EF\u9009\uFF0C\u5982 run","alias.table.actions":"\u64CD\u4F5C","alias.add":"\u6DFB\u52A0\u522B\u540D","alias.remove":"\u5220\u9664\u522B\u540D {keyword}","alias.unnamed":"\uFF08\u672A\u547D\u540D\uFF09","alias.empty":"\u8FD8\u6CA1\u6709\u522B\u540D\u3002\u4F8B\u5982\uFF1Awf \u2192 /flow-workflow run","alias.footnote":"\u8F93\u5165\u5173\u952E\u8BCD\u540E\u4ECE\u9762\u677F\u9009\u62E9\u5373\u53EF\u63D2\u5165\u5B8C\u6574\u8C03\u7528\uFF1B\u6539\u5B8C\u7ACB\u5373\u751F\u6548\u3002","alias.menu.section":"\u6280\u80FD\u522B\u540D","alias.menu.params":"\u53C2\u6570\uFF1A{value}","skill.metadata":"\u5143\u6570\u636E","skill.path":"\u5730\u5740","skill.usage.session":"\u672C\u4F1A\u8BDD\u8C03\u7528","skill.usage.workspace":"\u672C\u5DE5\u4F5C\u533A\u8C03\u7528","skill.params":"\u53C2\u6570","skill.hint.insert":"\u70B9\u51FB\u63D2\u5165","continue.label":"\u7EE7\u7EED","continue.sending":"\u7EE7\u7EED\u4E2D\u2026","link.copy":"\u590D\u5236","link.copied":"\u5DF2\u590D\u5236","link.copyFailed":"\u590D\u5236\u5931\u8D25","link.copyAria":"\u590D\u5236\u94FE\u63A5\u5730\u5740"},en:{"overlay.aria":"Select a model","listbox.aria":"Matching models","search.aria":"Search providers or models","search.placeholder":"Search providers or models\u2026","status.empty":"No models available.","status.applying":"Switching\u2026",retry:"Retry","trigger.selectAria":"Select model","trigger.aria":"Current model {model}, click to change","trigger.ariaEffort":"Current model {model}, reasoning effort {effort}, click to change","trigger.fallback":"Select model","trigger.loading":"Loading models\u2026",[se]:"Focus message input","attach.copySkipped":"{count} attachment(s) came from the clipboard with no local path and were not copied","attach.pasteMissing":"{count} attachment(s) no longer exist and were not pasted","attach.pasteReferenced":"{count} attachment(s) exceed the read limit and became path references","attach.copyFailed":"The browser refused this clipboard write","attach.pasteBusy":"A message is being sent; paste again in a moment","compaction.reading":"{count} compactions","compaction.readingOne":"1 compaction","compaction.tooltip":"This session's context was compressed {count} time(s)","compaction.tooltipWithFailures":"This session's context was compressed {count} time(s), with {failures} failed attempt(s)","tabs.nav":"Tabs","tabs.heading":"Tabs","tabs.empty":"No plugin has registered a conversation tab yet.","tabs.show":"Show {label} in the tab bar","tabs.hide":"Hide {label} from the tab bar","alias.nav":"Skill aliases","alias.heading":"Skill aliases","alias.prefix.title":"Require a slash prefix","alias.prefix.on":"To open, type \u201C/\u201D to match","alias.prefix.off":"To open, type the keyword without \u201C/\u201D to match","alias.table.keyword":"Keyword","alias.table.target":"Skill or command","alias.table.params":"Arguments","alias.table.paramsPlaceholder":"Optional, e.g. run","alias.table.actions":"Actions","alias.add":"Add alias","alias.remove":"Delete alias {keyword}","alias.unnamed":"(unnamed)","alias.empty":"No aliases yet. For example: wf \u2192 /flow-workflow run","alias.footnote":"Type a keyword and pick from the panel to insert the full invocation; changes apply immediately.","alias.menu.section":"Skill aliases","alias.menu.params":"args: {value}","skill.metadata":"Metadata","skill.path":"Path","skill.usage.session":"This session","skill.usage.workspace":"This workspace","skill.params":"Arguments","skill.hint.insert":"Click to insert","continue.label":"Continue","continue.sending":"Continuing\u2026","link.copy":"Copy","link.copied":"Copied","link.copyFailed":"Copy failed","link.copyAria":"Copy link address"}});var pt="dsh-better-effort",To=`
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
`;function mt(e){if(e===void 0)return()=>{};if(e.getElementById(pt)!==null)return()=>{};let n=e.createElement("style");return n.id=pt,n.textContent=To,e.head.append(n),()=>{n.remove()}}var yt="dsh-better.layout-widths",re=Object.freeze({sidebar:null,rightbar:null});function bt(e){return typeof e=="number"&&Number.isFinite(e)&&e>0}function ve(e){if(e===void 0)return re;let n;try{n=e.getItem(yt)}catch{return re}if(n===null||n==="")return re;let t;try{t=JSON.parse(n)}catch{return re}if(typeof t!="object"||t===null||Array.isArray(t))return re;let r=t;return{sidebar:gt(r.sidebar),rightbar:gt(r.rightbar)}}function kt(e,n){if(e===void 0)return;let t={};n.sidebar!==null&&(t.sidebar=Math.round(n.sidebar)),n.rightbar!==null&&(t.rightbar=Math.round(n.rightbar));try{e.setItem(yt,JSON.stringify(t))}catch{}}function gt(e){return bt(e)?Math.round(e):null}function xt(e){if(typeof e!="string")return re;let n=e.trim().split(/\s+/).filter(t=>t!=="");return{sidebar:ht(n[0]),rightbar:ht(n[2])}}function ht(e){if(e===void 0)return null;let n=/^([0-9]+(?:\.[0-9]+)?)px$/.exec(e);if(n===null)return null;let t=Number(n[1]);return bt(t)?Math.round(t):null}function St(e,n,t=null){return t==="sidebar"?n.sidebar!==null&&n.sidebar!==e.sidebar?{sidebar:n.sidebar}:{}:t==="rightbar"?n.rightbar!==null&&n.rightbar!==e.rightbar?{rightbar:n.rightbar}:{}:n.sidebar!==null&&n.sidebar!==e.sidebar?{sidebar:n.sidebar}:n.rightbar!==null&&n.rightbar!==e.rightbar?{rightbar:n.rightbar}:{}}function vt(e,n){return{sidebar:n.sidebar??e.sidebar,rightbar:n.rightbar??e.rightbar}}function wt(e){let n=[];return e.sidebar!==null&&n.push({column:"sidebar",width:e.sidebar}),e.rightbar!==null&&n.push({column:"rightbar",width:e.rightbar}),n}var Ao="[data-shell-bottom]",Po="[data-side]",Oo='[class*="_sidebarCol"]',Io='[class*="_rightbarCol"]',No=600;function _o(e){let t=e?.layout?.panels;if(typeof t!="object"||t===null)return;let r=t;if(!(typeof r.setSidebar!="function"&&typeof r.setRightbar!="function"))return r}function Et(e,n){let t=_o(e);if(t===void 0)return!1;let r=!1;for(let{column:o,width:i}of wt(n)){let a=o==="sidebar"?t.setSidebar:t.setRightbar;if(a!==void 0)try{a.call(t,i),r=!0}catch{}}return r}function Ct(e){return e.querySelector(Ao)?.parentElement??null}function Do(e,n){let t=e.hasAttribute("data-sidebar-collapsed"),r=e.hasAttribute("data-rightbar-collapsed"),o=xt(n?.getComputedStyle(e).gridTemplateColumns);return{sidebar:t?null:o.sidebar??Lt(e.querySelector(Oo)),rightbar:r?null:o.rightbar??Lt(e.querySelector(Io))}}function Lt(e){if(e===null)return null;let n=e.getBoundingClientRect().width;return Number.isFinite(n)&&n>0?Math.round(n):null}function Rt(e){let{document:n,storage:t}=e,r=null,o=null,i=0,a=!1,l=null,c=()=>n.defaultView,d=()=>(r!==null&&r.isConnected||(r=Ct(n)),r),s=()=>{let g=d();return g===null?null:Do(g,c())},u=g=>{let b=g?.getAttribute("data-side");return b==="sidebar"||b==="rightbar"?b:null},f=g=>{let b=s();if(b===null)return;let A=St(g.before,b,g.side);A.sidebar===void 0&&A.rightbar===void 0||kt(t,vt(ve(t),A))},p=g=>{if(l!==null)return;let b=g.target,A=typeof b?.closest=="function"?b.closest(Po):null;if(A===null)return;let R=s();R!==null&&(l={side:u(A),before:R})},m=()=>{let g=l;if(l=null,g===null)return;let b=c()?.requestAnimationFrame;if(b===void 0){f(g);return}b.call(c(),()=>f(g))},h=()=>{if(o=null,a)return;let g=Ct(n);if(g!==null){r=g;return}if(i>=No)return;i+=1;let b=c()?.requestAnimationFrame;b!==void 0&&(o=b.call(c(),h))};return{attach(){a=!1,i=0;let g=c();return g?.addEventListener("pointerdown",p,!0),g?.addEventListener("pointerup",m,!0),g?.addEventListener("pointercancel",m,!0),h(),()=>{a=!0,l=null,r=null,g?.removeEventListener("pointerdown",p,!0),g?.removeEventListener("pointerup",m,!0),g?.removeEventListener("pointercancel",m,!0),o!==null&&g?.cancelAnimationFrame(o),o=null}}}}var Tt="sessionCompaction";var At="dsh-better-compaction",we="dshBetter_compactionStat",Mo=`
.${we} {
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

[data-composer-dock]:has([data-workbench-dock="term-dock"]) .${we} {
  margin-left: 12px;
}
`;function Pt(e){if(e===void 0)return()=>{};if(e.getElementById(At)!==null)return()=>{};let n=e.createElement("style");return n.id=At,n.textContent=Mo,e.head.append(n),()=>{n.remove()}}var It=require("react/jsx-runtime");function Fo(e,n){if(e===void 0||n===void 0)return null;let{compactions:t,failures:r}=e;if(!Number.isSafeInteger(t)||t<=0)return null;let o=t===1?n("compaction.readingOne"):n("compaction.reading",{count:t}),i=Number.isSafeInteger(r)&&r>0?n("compaction.tooltipWithFailures",{count:t,failures:r}):n("compaction.tooltip",{count:t});return{text:o,tooltip:i}}function Bo(){}function Ot({useProjection:e,t:n}){let r=Fo((e??Bo)(Tt),n);return r===null?null:(0,It.jsx)("span",{className:we,"data-dsh-better":"compaction-stat",title:r.tooltip,children:r.text})}var Ue="conversation.composer.dock",Nt="better-compaction";var Ke=require("react");var _t="continue",Ve="conversation.chat.turnTail",Dt="better-continue";function Mt(e){return e.end?.reason?.kind!=="interrupted"?!1:e.latest&&!e.pending}var Ft="dsh-better-continue",oe="dshBetter_continue",je="dshBetter_continueError",Ho=`
.${oe} {
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

.${oe}:hover:not(:disabled) {
  background: var(--dsw-alias-interactive-bg-hover);
  color: var(--dsw-alias-label-primary);
  border-color: var(--dsw-alias-border-l1);
}

.${oe}:focus-visible {
  outline: 1px solid var(--dsw-alias-border-l1);
  outline-offset: 1px;
}

/* Disabled covers both halves of the pressed state: the request is in flight, so
   the button must not invite a second one, and the dimming is what says so. */
.${oe}:disabled {
  cursor: default;
  opacity: 0.6;
}

/* The failure line sits under the button in the same column. It is a sibling
   rather than a wrapper so the button keeps its own alignment. */
.${je} {
  align-self: flex-end;
  color: var(--dsw-alias-state-business-primary);
  font-size: var(--dsh-content-font-size-secondary, 13px);
  line-height: calc(20px + var(--dsh-content-font-delta-secondary, 0px));
}
`;function Bt(e){if(e===void 0)return()=>{};if(e.getElementById(Ft)!==null)return()=>{};let n=e.createElement("style");return n.id=Ft,n.textContent=Ho,e.head.append(n),()=>{n.remove()}}var X=require("react/jsx-runtime");function Wo(e){return e instanceof Error?e.message:String(e)}function zo(e,n){return e.length>0&&e[e.length-1]===n}function qe(){}function Ht({turn:e,sessionId:n,useChat:t,useSession:r,useInput:o,t:i,submitContinue:a}){let l=t??qe,c=r??qe,d=o??qe,s=l(C=>C),u=c(C=>C),f=d(C=>C),[p,m]=(0,Ke.useState)(!1),[h,g]=(0,Ke.useState)(null),b=e!==void 0&&zo(s?.timeline.turnOrder??[],e.turn),A=(u?.pendingSubmissions?.length??0)>0||J(f?.phase);return e===void 0||n===void 0||a===void 0||i===void 0||!Mt({end:e.end?.data,latest:b,pending:A})?null:(0,X.jsxs)(X.Fragment,{children:[(0,X.jsx)("button",{type:"button",className:oe,"data-testid":"better-continue",disabled:p,onClick:()=>{m(!0),g(null),a(n).catch(C=>{m(!1),g(Wo(C))})},children:i(p?"continue.sending":"continue.label")}),h===null?null:(0,X.jsx)("span",{className:je,role:"alert",children:h})]})}var Ge="dsh-better-link-hover",ie="dshBetter_linkHover",Ce="dshBetter_linkHoverAddress",ae="dshBetter_linkHoverCopy",Wt=`
.${ie} {
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
.${ie}[hidden] {
  display: none;
}
.${Ce} {
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
.${ae} {
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
.${ae}:hover {
  background: var(--dsw-alias-interactive-bg-hover);
  color: var(--dsw-alias-label-primary);
}
.${ae}:focus-visible {
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
  .${ie} {
    animation: none;
  }
}
`;function zt(e){if(e===void 0)return()=>{};if(e.getElementById(Ge)!==null)return()=>{};let n=e.createElement("style");return n.id=Ge,n.textContent=Wt,e.head.append(n),()=>{n.remove()}}var $o=1200,$t=8,Z=8,Uo='[data-slot="conversation.chat.flow"], [data-message-bubble]';function Vo(e){let n=e.trim();if(n===""||n.startsWith("#"))return!1;let t=n.slice(0,11).toLowerCase();return!(t.startsWith("javascript:")||t.startsWith("data:"))}function jo(e,n,t){let r=Math.max(Z,Math.min(e.left,t.width-Z-n.width)),o=e.bottom+$t,i=e.top-$t-n.height,a=t.height-Z*2,l;return n.height<=a&&o+n.height<=t.height-Z?l=o:n.height<=a&&i>=Z?l=i:l=Math.max(Z,Math.min(o,t.height-Z-n.height)),{left:r,top:l}}async function qo(e,n){let t=n.defaultView?.navigator.clipboard;if(t!==void 0)try{return await t.writeText(e),!0}catch{}return Ko(e,n)}function Ko(e,n){if(typeof n.execCommand!="function")return!1;let t=n.createElement("textarea");t.value=e,t.setAttribute("readonly",""),t.style.position="fixed",t.style.top="-1000px",t.style.opacity="0",n.body.append(t);try{return t.select(),n.execCommand("copy")}catch{return!1}finally{t.remove()}}function Ut(e,n){let t=e.defaultView;if(t===null)return()=>{};if(t.matchMedia?.("(hover: none)")?.matches===!0)return()=>{};let r=zt(e),o=null,i=null,a=null,l=null,c=null,d=()=>{if(o!==null)return o;let S=e.createElement("div");S.className=ie,S.setAttribute("role","tooltip"),S.hidden=!0;let v=e.createElement("span");v.className=Ce;let w=e.createElement("button");return w.className=ae,w.type="button",w.setAttribute("aria-label",n.translate("link.copyAria")),w.textContent=n.translate("link.copy"),w.addEventListener("click",W=>{W.preventDefault(),W.stopPropagation();let k=l?.href;k!==void 0&&qo(k,e).then(I=>{w.textContent=n.translate(I?"link.copied":"link.copyFailed"),c!==null&&clearTimeout(c),c=setTimeout(()=>{c=null,w.textContent=n.translate("link.copy")},$o)})}),S.append(v,w),e.body.append(S),o=S,i=v,a=w,S},s=S=>{let v=d(),w=S.getBoundingClientRect(),W=v.getBoundingClientRect(),k=jo({left:w.left,top:w.top,right:w.right,bottom:w.bottom},{width:W.width,height:W.height},{width:t.innerWidth,height:t.innerHeight});v.style.left=`${k.left}px`,v.style.top=`${k.top}px`},u=()=>{l=null,c!==null&&(clearTimeout(c),c=null),a!==null&&(a.textContent=n.translate("link.copy")),o!==null&&(o.hidden=!0)},f=(S,v)=>{let w=d();l={anchor:S,href:v},i!==null&&(i.textContent=v),w.hidden=!1,s(S)},p=S=>{if(!(S instanceof t.Element))return;let v=S.closest("a");if(v===null||v.closest(Uo)===null)return;let w=v.getAttribute("href");if(w!==null&&Vo(w))return{anchor:v,href:w.trim()}},m=S=>o!==null&&S instanceof t.Node&&o.contains(S),h=S=>{let v=p(S.target);v!==void 0&&f(v.anchor,v.href)},g=S=>{if(l===null)return;let v=S.relatedTarget;if(m(v)||v instanceof t.Node&&l.anchor.contains(v))return;let w=S.target;w instanceof t.Node&&(l.anchor.contains(w)||m(w))&&u()},b=S=>{let v=p(S.target);v!==void 0&&f(v.anchor,v.href)},A=S=>{if(l===null)return;let v=S.relatedTarget;m(v)||v instanceof t.Node&&l.anchor.contains(v)||u()},R=S=>{S.key==="Escape"&&l!==null&&u()},C=S=>{m(S.target)||u()};return e.addEventListener("mouseover",h,!0),e.addEventListener("mouseout",g,!0),e.addEventListener("focusin",b,!0),e.addEventListener("focusout",A,!0),e.addEventListener("keydown",R,!0),e.addEventListener("scroll",C,!0),()=>{e.removeEventListener("mouseover",h,!0),e.removeEventListener("mouseout",g,!0),e.removeEventListener("focusin",b,!0),e.removeEventListener("focusout",A,!0),e.removeEventListener("keydown",R,!0),e.removeEventListener("scroll",C,!0),c!==null&&(clearTimeout(c),c=null),o?.remove(),o=null,i=null,a=null,l=null,r()}}function Go(e){return typeof e=="object"&&e!==null&&"ok"in e&&e.ok===!1}async function Vt(e,n){let t=e.sessions?.binding?.(n)?.session,r=t?.prompt;if(typeof r!="function")throw new Error("\u8FD9\u4E2A\u5BBF\u4E3B\u7684\u4F1A\u8BDD\u4E0D\u652F\u6301\u53D1\u9001\u6D88\u606F");let o=await r.call(t,[{type:"text",text:_t}],"queue");if(Go(o))throw new Error("\u7EE7\u7EED\u6D88\u606F\u6CA1\u6709\u88AB\u5BBF\u4E3B\u63A5\u53D7")}var le=require("react");function Yo(e){let n=e.name.trim();return n===""?e.id:n}function Ye(e,n){if(e===void 0)return{model:n};let t=Yo(e.group),r=e.model.name.trim();return r===""?{model:t}:{provider:t,model:r}}function jt(e,n){let t=Ye(e,n);return t.provider===void 0?t.model:`${t.provider} ${t.model}`}function Jo(e){return typeof e=="string"?e:e.en??""}function Le(e,n){if(e!==void 0)try{return e(n)}catch{}return Jo(n)}var z=require("react/jsx-runtime"),Xo="@deepseek-ai/dsh-client-ui-model-selection/ModelSelect.module.css";function Zo(e){if(e===void 0)return;let t=e.querySelector(`style[data-plugin-css="${Xo}"]`)?.textContent??"",r=a=>new RegExp(`\\.(\\w+_${a})\\{`,"u").exec(t)?.[1],o={root:r("root"),trigger:r("trigger"),triggerIcon:r("triggerIcon"),triggerLabel:r("triggerLabel"),triggerEffort:r("triggerEffort"),chevron:r("chevron")};for(let a of Object.values(o))if(a===void 0)return;let i=r("badge");return{...o,...i===void 0?{}:{badge:i}}}function qt(e){let n=Se(e.load),t=Zo(e.document);function r(o){let i=e.native();return o.available===!1||i===void 0||t===void 0?i===void 0?null:(0,z.jsx)(i,{...o}):(0,z.jsx)(Qo,{props:o,primitives:n,openPicker:e.openPicker,translate:e.translate,classes:t})}return r}function Qo({props:e,primitives:n,openPicker:t,translate:r,classes:o}){let{directory:i,t:a,sessionId:l,locked:c,resolveText:d}=e,s=ei(i),u=a??r(),f=s?.current??null,p=f===null&&s?.status==="loading",m=ni(s,f),h=u?.("trigger.fallback")??"",g=jt(m,h),b=Ye(m,h),A=ti(m,d),R=p?u?.("trigger.loading")??"":g,C=ri(s,f,m,u),S=C===void 0?R:`${R} \xB7 ${C}`,v=p?u?.("trigger.loading")??"":f===null?u?.("trigger.selectAria")??"":C===void 0?u?.("trigger.aria",{model:R})??"":u?.("trigger.ariaEffort",{model:R,effort:C})??"",w=()=>{t(l)},W=n.IconDataOutlineRegular,k=n.IconChevronDownOutlineRegular,I=n.Tag,B=o.badge;return(0,z.jsx)("div",{className:o.root,"data-dsh-better-seat":"",children:(0,z.jsxs)("button",{type:"button",className:o.trigger,"aria-label":v,"aria-haspopup":"dialog","aria-expanded":"false",title:S,disabled:c,onClick:w,children:[W===void 0?null:(0,z.jsx)(W,{className:o.triggerIcon,size:16}),(0,z.jsx)("span",{className:o.triggerLabel,"data-provider-id":f?.provider,"data-model-id":f?.model,children:p?R:(0,z.jsxs)(z.Fragment,{children:[b.provider===void 0?null:`${b.provider} `,A===void 0||B===void 0||I===void 0?null:(0,z.jsxs)(z.Fragment,{children:[(0,z.jsx)(I,{className:B,tone:A.tone,children:A.text})," "]}),b.model]})}),C!==void 0&&(0,z.jsx)("span",{className:o.triggerEffort,children:C}),k===void 0?null:(0,z.jsx)(k,{className:o.chevron})]})})}function ei(e){let n=(0,le.useCallback)(r=>e===void 0?()=>{}:e.subscribe(r),[e]),t=(0,le.useCallback)(()=>e?.getSnapshot(),[e]);return(0,le.useSyncExternalStore)(n,t)}function ni(e,n){if(!(e===void 0||n===null||n===void 0)){for(let t of e.groups)if(t.id===n.provider){for(let r of t.models)if(r.id===n.model)return{group:t,model:r}}}}function ti(e,n){let t=e?.model.badge;if(t===void 0)return;let r=Le(n,t.text);if(r!=="")return{text:r,tone:t.tone}}function ri(e,n,t,r){if(e===void 0||n===null||n===void 0)return;let o=t?.model.reasoning,i=n.reasoningEffort??o?.defaultEffort;return t===void 0?e.retainedEffort:o===void 0||i===void 0?void 0:o.efforts?.find(l=>l.id===i)?.name??i}function Kt(e){let r=e?.live?.contributions?.get("model")?.ui;return r==null?void 0:r.kind==="popupSelect"?r:void 0}function Gt(e){return{sessionId:e}}function Yt(){return{via:"enter",token:""}}var oi=`
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
`,Jt="dsh-better/tabs.css";function Xt(e){let n=`style[data-plugin-css=${JSON.stringify(Jt)}]`;if(e.querySelector(n)!==null)return()=>{};let t=e.createElement("style");return t.dataset.plugin="dsh-better",t.dataset.pluginCss=Jt,t.textContent=oi,e.head.append(t),()=>t.remove()}function Zt(e){let n;return e.React.createElement("section",{"data-dsh-better-tabs":"",ref:t=>{if(n?.(),n=void 0,t===null)return;let r=()=>{ii(t,e)};r(),n=e.controller.subscribe(r)}})}function ii(e,n){let t=e.ownerDocument,{controller:r,copy:o}=n;e.replaceChildren();let i=t.createElement("h2");i.setAttribute("data-dsh-better-tabs-heading",""),i.textContent=o.heading,e.append(i);let a=r.rows();if(a.length===0){let l=t.createElement("p");l.setAttribute("data-dsh-better-tabs-empty",""),l.textContent=o.empty,e.append(l);return}for(let l of a){let c=t.createElement("label");c.setAttribute("data-dsh-better-tabs-row",l.id);let d=t.createElement("span");d.setAttribute("data-dsh-better-tabs-name",""),d.textContent=l.label;let s=t.createElement("input");s.setAttribute("data-dsh-better-tabs-check",l.id),s.type="checkbox",s.checked=l.enabled,s.setAttribute("aria-label",o.checkboxLabel(l.label,l.enabled)),s.addEventListener("change",()=>{r.setEnabled(l.id,s.checked)}),c.append(d,s),e.append(c)}}var Je="conversation.view",Xe="settings.section",er="tabs";var Re="chat",nr="dsh-better.tabs",de="[data-conversation-tabs]";function tr(e,n){if(typeof e=="string"&&e!=="")return e;if(typeof e=="function")try{let t=e();if(typeof t=="string"&&t!=="")return t}catch{}return n}function ai(e){if(e===void 0)return new Set;let n;try{n=e.getItem(nr)}catch{return new Set}if(n===null||n==="")return new Set;try{let t=JSON.parse(n);if(!Array.isArray(t))return new Set;let r=new Set;for(let o of t)typeof o=="string"&&o!==""&&o!==Re&&r.add(o);return r}catch{return new Set}}function si(e,n){if(e!==void 0)try{e.setItem(nr,JSON.stringify([...n].sort()))}catch{}}function li(e,n){let t=[],r=new Set;for(let o of e){let i=o.options.id;i===void 0||i===Re||r.has(i)||(r.add(i),t.push({id:i,label:tr(o.options.label,i),enabled:!n.has(i)}))}return t}function di(e){let n=[],t=new Set;for(let r of e){let o=r.options.id;o===void 0||o===Re||t.has(o)||(t.add(o),n.push({id:o,label:tr(r.options.label,o)}))}return n}function ui(e,n,t){let r=new Set;for(let o of di(e)){if(!n.has(o.id)||o.label==="")continue;t.filter(a=>a.label===o.label).length===1&&r.add(o.label)}return t.map(o=>r.has(o.label))}function ci(e,n){for(let t of e)if(n!==null&&(t.target===n||n.contains?.(t.target)===!0)||Qt(t.addedNodes,n)||Qt(t.removedNodes,n))return!0;return!1}function Qt(e,n){if(e===void 0)return!1;for(let t=0;t<e.length;t+=1){let r=e[t];if(r!==void 0&&(r.matches?.(de)===!0||r.querySelector?.(de)!=null||n!==null&&r.contains?.(n)===!0))return!0}return!1}function fi(e){let n=e.querySelector(de);if(n===null||typeof n!="object")return;let r=n.querySelectorAll?.(":scope > button[role='tab']");if(r===void 0)return;let o=[];for(let i=0;i<r.length;i+=1){let a=r[i];a!==void 0&&o.push({label:pi(a),hidden:a.hasAttribute(Ee),mark:l=>{l?a.setAttribute(Ee,""):a.removeAttribute(Ee)}})}return o}function pi(e){return(e.querySelector?.("[class*='tabLabel']")?.textContent??e.textContent??"").trim()}function mi(e,n){let t=!1;for(let[r,o]of e.entries()){let i=n[r]??!1;i!==o.hidden&&(o.mark(i),t=!0)}return t}function rr(e){let{ledger:n,storage:t}=e,r=e.readButtons??fi,o=e.watch??yi,i=new Set(ai(t)),a=new Set,l,c=()=>{for(let s of[...a])s()},d=30;return{rows:()=>li(n.entriesOfSlot(Je),i),setEnabled(s,u){if(s===Re)return!1;let f=i.has(s);return u===!f?!1:(u?i.delete(s):i.add(s),si(t,i),l?.(),c(),!0)},subscribe(s){return a.add(s),()=>{a.delete(s)}},attach(s){let u=s.createElement("style");u.dataset.plugin="dsh-better",u.dataset.pluginCss=gi,u.textContent=hi,s.head.append(u);let f=s.defaultView?.requestAnimationFrame?.bind(s.defaultView),p=s.defaultView?.cancelAnimationFrame?.bind(s.defaultView),m=f===void 0?0:d,h,g=()=>{let R=n.entriesOfSlot(Je),C=r(s);if(C===void 0||C.length===0){m>0&&f!==void 0&&(m-=1,h=f(()=>g()));return}m=d,h=void 0,mi(C,ui(R,i,C))},b=n.subscribe(Je,g),A=o(s,g);return l=g,g(),()=>{b(),A(),l=void 0,h!==void 0&&p?.(h),u.remove()}}}}var gi="dsh-better/strip.css",Ee="data-dsh-better-tab-hidden",hi=`${de} > button[${Ee}] { display: none; }`;function yi(e,n){let t=e.defaultView?.MutationObserver,r=e.documentElement;if(t===void 0||r===void 0)return()=>{};let o=new t(i=>{let a=e.querySelector(de);ci(i,a!==null&&typeof a=="object"?a:null)&&n()});return o.observe(r,{childList:!0,subtree:!0}),()=>o.disconnect()}var Q="conversation.input.overlay",or="settings.section",Si="aliases",vi=56,wi="alias-watcher",sr=50,Ci="skill-enhancer",Li=sr+1,Ze="conversation.input.model",Qe="conversation.input.attachments",Ei=-50,Ri=-60,lr="command-popup",Ti=-100,U="better",Ai="/better/api/skill-profile",Pi=5e3,Te=null;function dr(e,n){let t,r=Number.POSITIVE_INFINITY;for(let o of e){if(o.options.id!==lr)continue;let i=o.component;if(typeof i!="function"||n!==void 0&&i===n)continue;let a=o.options.priority??0;a<r&&(t=i,r=a)}return t}var ur={name:"dsh-better",inject:["slots","sessions","commandUi","conversation","locale","modelDirectories","remote","remote.session"],apply(e){let n=globalThis.document;e.effect(()=>e.locale.register(U,ft),"dsh-better: locale"),e.effect(()=>mt(n),"dsh-better: effort badge stylesheet"),e.effect(()=>Pt(n),"dsh-better: compaction count stylesheet"),e.effect(()=>Bt(n),"dsh-better: continue button stylesheet"),e.effect(()=>n===void 0?()=>{}:Ut(n,{translate:ar(e)}),"dsh-better: link address panel");let t=an(nn()),r=ar(e),o={open:!1};e.effect(()=>{let d=nn(),s=ve(d);e.inject?.(["layout"],p=>{Et(p,s)});let f=(n===void 0?void 0:Rt({document:n,storage:d}))?.attach();return()=>{f?.()}},"dsh-better: panel width memory"),e.effect(()=>e.slots.inject(Ue,()=>e.slots.register({name:Ue,id:Nt,order:-1,locale:U},Ot)),"dsh-better: compaction count"),e.effect(()=>e.slots.inject(Ve,()=>en(e.slots,{name:Ve,id:Dt,order:20,locale:U,inject:d=>({submitContinue:s=>Vt(e,s)})},Ht)),"dsh-better: continue button"),e.effect(()=>e.slots.inject(Q,()=>{let d={},u=Qn({load:Te,native:()=>dr(e.slots.entries(Q),d.component),document:n});return d.component=u,e.slots.register({name:Q,id:lr,priority:Ti,locale:U,inject:f=>{let p=Mi(e,f);return{popup:Di(e,f),catalog:p?.groups,current:p?.current??null,selectModel:m=>e.modelDirectories?.directoryFor?.(f)?.select?.(m)}}},u)}),"dsh-better: /model provider search"),e.effect(()=>e.slots.inject(Ze,()=>{let d={},u=qt({load:Te,native:()=>tn(e.slots.entries(Ze),d.component),openPicker:f=>Ni(e,f),translate:()=>_i(e),document:n});return d.component=u,e.slots.register({name:Ze,priority:Ei,locale:U,inject:f=>{let p=e.modelDirectories?.directoryFor?.(f),m=e.locale.resolveText;return{sessionId:f,available:!0,directory:p?.store,load:()=>{p?.load?.()},select:h=>p?.select?.(h),resolveText:h=>Le(m?.bind(e.locale),h),renderSlot:(h,g,b)=>b?.fallback??null}}},u)}),"dsh-better: composer model trigger");let i;e.inject?.(["remote.workspaceFiles"],d=>{i=d["remote.workspaceFiles"],d.effect(()=>()=>{i=void 0},"dsh-better: workspace file reader")}),e.effect(()=>e.slots.inject(Qe,()=>{let d={},u=at({native:()=>tn(e.slots.entries(Qe),d.component),pathOf:Fi,reader:()=>i,translate:()=>e.locale.bind?.(U)});return d.component=u,e.slots.register({name:Qe,priority:Ri,locale:U,inject:f=>({sessionId:f,readFileDrag:Oi(e),phase:()=>Ii(e,f)?.getSnapshot().phase})},u)}),"dsh-better: composer attachment selection");let a;e.inject?.(["inputTriggers"],d=>{a=d.inputTriggers,d.effect(()=>()=>{a=void 0},"dsh-better: alias trigger service"),d.effect(()=>d.inputTriggers.registerSource(hn({config:()=>t.getSnapshot(),translate:r,bareMenuOpen:()=>o.open,routeCommand:(s,u)=>zi(e,u)})),"dsh-better: alias slash source")}),e.effect(()=>e.slots.inject(Q,()=>{let d=Sn({store:t,bareMenuOpen:o,inputStoreFor:s=>{let u=e.sessions.scope?.(s);if(!(u===void 0||e.conversation===void 0))try{return e.conversation.input?.for?.(u)?.state}catch{return}},controllerFor:s=>{let u=e.sessions.scope?.(s);if(u===void 0)return;let f=ue(e,"inputTriggers")??a;if(f!==void 0)try{return f.sessionOf(u)}catch{return}}});return en(e.slots,{name:Q,id:wi,order:sr,inject:s=>({sessionId:s})},d)}),"dsh-better: alias selector watcher"),e.effect(()=>Hn(n),"dsh-better: skill enhancer stylesheet");let l=Bi(e);e.effect(()=>e.slots.inject(Q,()=>{let d=Fn({scopeFor:s=>e.sessions.scope?.(s),inputStoreFor:s=>{let u=e.sessions.scope?.(s);if(!(u===void 0||e.conversation===void 0))try{return e.conversation.input?.for?.(u)?.state}catch{return}},actionsFor:s=>{let u=e.sessions.scope?.(s);if(!(u===void 0||e.conversation===void 0))try{return e.conversation.input?.for?.(u)}catch{return}},skillNamesFor:l.names,loadProfile:async(s,u)=>Hi(e,s,u,await l.pathOf(s,u)),loadUsage:(s,u)=>cr(e,s,u),translate:r,document:n});return en(e.slots,{name:Q,id:Ci,order:Li,inject:s=>({sessionId:s})},d)}),"dsh-better: skill enhancer"),e.effect(()=>e.slots.inject(or,()=>{let d=n===void 0?void 0:bn(n),s=gn({store:t,translate:r}),u=ir(e.slots,{name:or,id:Si,order:vi,label:()=>e.locale.bind?.(U)?.("alias.nav")??"Skill aliases",locale:U},s);return()=>{u(),d?.()}}),"dsh-better: alias settings page");let c=rr({ledger:Wi(e.slots),storage:nn()});e.effect(()=>e.slots.inject(Xe,()=>{let d=globalThis.document,s=d===void 0?void 0:Xt(d),u=ir(e.slots,{name:Xe,id:er,order:55,label:()=>e.locale.bind?.(U)?.("tabs.nav")??"Tabs"},()=>{let f=$i(Te);return f===null?null:Zt({React:f,controller:c,copy:Ui(e)})});return()=>{u(),s?.()}}),"dsh-better: tab management"),e.effect(()=>c.attach(n),"dsh-better: tab visibility"),e.inject?.(["shortcuts"],d=>{d.effect(()=>ct(d.shortcuts,{currentSessionId:()=>dt(e),composerMounted:()=>lt(n),focusComposer:s=>ut(e,s)},()=>e.locale.bind?.(U)?.(se)??"Focus message input",s=>console.warn(`dsh-better: focus command not registered (${s})`)),"dsh-better: focus composer shortcut")})}};function Oi(e){return n=>ue(e,"fileDrag")?.read?.(n)}function Ii(e,n){if(n===void 0)return;let t=e.sessions.scope?.(n);if(!(t===void 0||e.conversation===void 0))try{return e.conversation.input?.for?.(t)?.state}catch{return}}function tn(e,n){let t,r=Number.POSITIVE_INFINITY;for(let o of e){let i=o.component;if(typeof i!="function"||n!==void 0&&i===n)continue;let a=o.options.priority??0;a<r&&(t=i,r=a)}return t}function Ni(e,n){if(n===void 0)return!1;let t=Kt(e.commandUi);if(t===void 0)return!1;let r=e.sessions.scope?.(n);if(r===void 0)return!1;let o=e.commandUi.popupFor?.(r);return o===void 0||typeof o.open!="function"?!1:(o.open("model",t,Gt(n),Yt()),!0)}function _i(e){return e.locale?.bind?.(U)}function Di(e,n){let t=e.sessions.scope?.(n);if(t!==void 0)return e.commandUi.popupFor?.(t)}function Mi(e,n){return e.modelDirectories?.directoryFor?.(n)?.store.getSnapshot()}function Fi(e){let n=globalThis.__DSH_HOST_PATHS__;if(n?.pathFor===void 0)return"";try{let t=n.pathFor(e);return typeof t=="string"?t:""}catch{return""}}function ir(e,n,t){return(e.registerUntyped??e.register).call(e,n,t)}function en(e,n,t){return(e.registerUntyped??e.register).call(e,n,t)}function Bi(e){let n=new Map,t=new Map,r=async o=>{let i=n.get(o);if(i!==void 0)return i;let a=t.get(o);if(a!==void 0&&Date.now()-a<Pi)return;let l=ue(e,"remote.skills");if(l!==void 0)try{let c=await l.list({sessionId:o});if(!c.ok){t.set(o,Date.now());return}let d=new Map(c.value.skills.map(s=>[s.name,s]));return n.set(o,d),t.delete(o),d}catch{t.set(o,Date.now());return}};return{names:async o=>new Set((await r(o))?.keys()??[]),pathOf:async(o,i)=>(await r(o))?.get(i)?.path}}async function Hi(e,n,t,r){let o=`?sessionId=${encodeURIComponent(n)}&name=${encodeURIComponent(t)}`+(r===void 0?"":`&path=${encodeURIComponent(r)}`);try{let i=await fetch(`${Ai}${o}`,{headers:{accept:"application/json"}});return i.ok?await i.json():void 0}catch{return}}function cr(e,n,t){let r=e.sessions.list??ue(e,"sessions.list");try{let o=r?.getSnapshot?.(),i=u=>{let p=o?.projectionsBySession?.[u]?.values?.skillUsage;if(typeof p!="object"||p===null)return;let m=p.counts;return typeof m=="object"&&m!==null?m:void 0},a=i(n)?.[t],l=typeof a=="number"&&Number.isFinite(a)?a:0,c=o?.byId?.[n]?.cwd;if(typeof c!="string"||c==="")return{session:l};let d=Object.keys(o?.byId??{}).map(u=>{let f=i(u),p=o?.byId?.[u]?.cwd;return{...typeof p=="string"?{cwd:p}:{},...f===void 0?{}:{usage:f}}}),s=Wn(d,c,t);return s===void 0?{session:l}:{session:l,workspace:s}}catch{return{session:0}}}function Wi(e){return{entriesOfSlot:n=>(e.entriesOfSlot??e.entries).call(e,n),subscribe:(n,t)=>e.subscribe?.(n,t)??(()=>{})}}function nn(){try{return globalThis.localStorage}catch{return}}function ue(e,n){try{return typeof e.get=="function"?e.get(n):e[n]}catch{return}}function zi(e,n){let t=n.session?.sessionId;if(t===void 0)return;let r=e.sessions.scope?.(t);if(r===void 0)return;let o=ue(e,"inputTriggers");if(o!==void 0)try{let i=o.sessionOf(r),a=e.conversation?.input?.for?.(r)?.state,l=0,c=()=>{let d=a?.getSnapshot();if(!(d===void 0||d.draft.trim()===""||!d.draft.startsWith("/"))){try{let s=d.draft.trimStart().split(/\s/u)[0]??"";if(!s.startsWith("/")||(i.track?.(s,s.length,{tier:"plain"},d.draftRev),i.onSpace?.()===!0))return;i.dismiss?.()}catch{}l+=1,l<4&&setTimeout(c,25)}};setTimeout(c,0)}catch{}}function ar(e){return(n,t)=>{try{return e.locale.bind?.(U)?.(n,t)??n}catch{return n}}}function $i(e){if(e===null)return null;try{let n=e("react");if(typeof n!="object"||n===null)return null;let t=n;return typeof t.createElement=="function"?t:null}catch{return null}}function Ui(e){let n=e.locale.bind?.(U),t=(r,o)=>n?.(r)??o;return{heading:t("tabs.heading","Tabs"),empty:t("tabs.empty","No plugin has registered a conversation tab yet."),checkboxLabel:(r,o)=>t(o?"tabs.hide":"tabs.show","{label}").replace("{label}",r)}}function Vi(e){Te=e}var ji=ur;

    // Hand the loader's `require` to the module's `boot` export before the
    // plugin mounts. Read from `module.exports` rather than the default export:
    // esbuild emits named exports there and the plugin object separately, so the
    // default export alone never carries `boot`.
    if (typeof module.exports.boot === "function") module.exports.boot(require);
    return module.exports.default ?? module.exports;
  }
});
