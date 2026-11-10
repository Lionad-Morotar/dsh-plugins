window.__ModuleLoader__.load({
  id: "dsh-better",
  factory: (require) => {
    var module = { exports: {} };
    var exports = module.exports;
"use strict";var Ve=Object.defineProperty;var _r=Object.getOwnPropertyDescriptor;var Mr=Object.getOwnPropertyNames;var Fr=Object.prototype.hasOwnProperty;var Br=(e,n)=>{for(var t in n)Ve(e,t,{get:n[t],enumerable:!0})},Hr=(e,n,t,r)=>{if(n&&typeof n=="object"||typeof n=="function")for(let o of Mr(n))!Fr.call(e,o)&&o!==t&&Ve(e,o,{get:()=>n[o],enumerable:!(r=_r(n,o))||r.enumerable});return e};var Wr=e=>Hr(Ve({},"__esModule",{value:!0}),e);var ka={};Br(ka,{boot:()=>ya,clientPlugin:()=>Nr,default:()=>ba,findShadowed:()=>Ir,findShadowedSingle:()=>xn,readSkillUsage:()=>Dr});module.exports=Wr(ka);var Le=require("react");var Cn="dsh-better.skill-aliases";var se=Object.freeze({prefix:!0,rows:Object.freeze([])});function zr(e,n){if(e!==void 0)try{e.setItem(Cn,JSON.stringify({v:1,prefix:n.prefix,rows:n.rows}))}catch{}}function Ce(e,n){return typeof e=="string"?e:n}function $r(e,n){if(typeof e!="object"||e===null||Array.isArray(e))return;let t=e;if(!(typeof t.keyword!="string"&&typeof t.target!="string"&&typeof t.params!="string"))return{id:Ce(t.id,`alias-${n}`)||`alias-${n}`,keyword:Ce(t.keyword,""),target:Ce(t.target,""),params:Ce(t.params,"")}}function Ur(e){if(typeof e!="object"||e===null||Array.isArray(e))return se;let n=e,t=typeof n.prefix=="boolean"?n.prefix:se.prefix,r=Array.isArray(n.rows)?n.rows:[],o=[],i=new Set;for(let[a,l]of r.slice(0,200).entries()){let c=$r(l,a);if(c===void 0)continue;let d=c.id,s=0;for(;i.has(d);)s+=1,d=`alias-${a}-${s}`;i.add(d),o.push({...c,id:d})}return{prefix:t,rows:o}}function Vr(e){if(e===void 0)return se;let n;try{n=e.getItem(Cn)}catch{return se}if(n===null||n==="")return se;try{return Ur(JSON.parse(n))}catch{return se}}function qr(){let e=globalThis.crypto;return e?.randomUUID!==void 0?e.randomUUID():`alias-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,8)}`}function Ln(e,n=qr){let t=Vr(e),r=new Set,o=i=>{t=i;for(let a of[...r])try{a()}catch(l){console.error("[dsh-better] alias store listener failed:",l)}zr(e,i)};return{getSnapshot:()=>t,subscribe(i){return r.add(i),()=>{r.delete(i)}},setPrefix(i){t.prefix!==i&&o({...t,prefix:i})},addRow(){let i=n();return o({...t,rows:[...t.rows,{id:i,keyword:"",target:"",params:""}]}),i},updateRow(i,a){let l=!1,c=t.rows.map(d=>{if(d.id!==i)return d;let s={...d,...a,id:d.id};return l=s.keyword!==d.keyword||s.target!==d.target||s.params!==d.params,s});l&&o({...t,rows:c})},removeRow(i){let a=t.rows.filter(l=>l.id!==i);a.length!==t.rows.length&&o({...t,rows:a})}}}function En(e){return e.keyword.trim()!==""&&e.target.trim()!==""}function Tn(e){return e.keyword.trim().replace(/^\/+/,"").toLowerCase()}function Rn(e,n){let t=n.trim().replace(/^\/+/,"").toLowerCase();return t===""?[]:e.rows.filter(r=>En(r)&&Tn(r)===t)}function An(e,n,t=!1){let r=n.trim().replace(/^\/+/,"").toLowerCase(),o=e.rows.filter(En);if(r==="")return t?o:[];let i=[],a=[],l=[];for(let c of o){let d=Tn(c);d===r?i.push(c):d.startsWith(r)?a.push(c):d.includes(r)&&l.push(c)}return[...i,...a,...l]}function Pn(e){let n=e.target.trim().replace(/^\/+/,"");if(n==="")return"";let t=e.params.trim();return t===""?`/${n} `:`/${n} ${t} `}function On(e,n){let t=/^\/([^\s/]+)([ \t]*)$/u.exec(n);if(t===null)return;let r=t[1]??"",o=Rn(e,r);if(o.length!==0)return{query:r,start:0,end:n.length,rows:o}}function In(e,n){let t=/^([^\s/]+)([ \t]*)$/u.exec(n);if(t===null)return;let r=t[1]??"",o=Rn(e,r);if(o.length!==0)return{query:r,start:0,end:n.length,rows:o}}function Nn(e){if(e.keyword.trim()==="")return"keyword";if(e.target.trim()==="")return"target";if(/\s/.test(e.keyword.trim()))return"keyword"}var R=require("react/jsx-runtime");function jr(e){let{row:n,store:t,t:r}=e,o=Nn(n);return(0,R.jsxs)("tr",{"data-testid":"alias-row","data-row-id":n.id,"data-incomplete":o===void 0?void 0:"",children:[(0,R.jsx)("td",{children:(0,R.jsx)("input",{className:"dsh-better-alias-input","data-testid":"alias-keyword",value:n.keyword,placeholder:"wf",spellCheck:!1,autoComplete:"off","aria-label":r("alias.table.keyword"),ref:i=>{i!==null&&e.focus&&(i.focus(),e.clearFocus())},onChange:i=>t.updateRow(n.id,{keyword:i.target.value})})}),(0,R.jsx)("td",{children:(0,R.jsx)("input",{className:"dsh-better-alias-input","data-testid":"alias-target",value:n.target,placeholder:"flow-workflow",spellCheck:!1,autoComplete:"off","aria-label":r("alias.table.target"),onChange:i=>t.updateRow(n.id,{target:i.target.value})})}),(0,R.jsx)("td",{children:(0,R.jsx)("input",{className:"dsh-better-alias-input","data-testid":"alias-params",value:n.params,placeholder:r("alias.table.paramsPlaceholder"),spellCheck:!1,autoComplete:"off","aria-label":r("alias.table.params"),onChange:i=>t.updateRow(n.id,{params:i.target.value})})}),(0,R.jsx)("td",{className:"dsh-better-alias-actions",children:(0,R.jsx)("button",{type:"button",className:"dsh-better-alias-delete","data-testid":"alias-remove","aria-label":r("alias.remove",{keyword:n.keyword.trim()||r("alias.unnamed")}),title:r("alias.remove",{keyword:n.keyword.trim()||r("alias.unnamed")}),onClick:()=>t.removeRow(n.id),children:"\xD7"})})]})}function Dn(e){function n(){let t=(0,Le.useSyncExternalStore)(e.store.subscribe,e.store.getSnapshot,e.store.getSnapshot),{translate:r}=e,o=(0,Le.useRef)(null),i=()=>{o.current=e.store.addRow()};return(0,R.jsxs)("section",{className:"dsh-better-alias-page","data-testid":"alias-page",children:[(0,R.jsx)("h2",{className:"dsh-better-alias-heading",children:r("alias.heading")}),(0,R.jsxs)("label",{className:"dsh-better-alias-prefix",children:[(0,R.jsxs)("span",{children:[(0,R.jsx)("span",{className:"dsh-better-alias-prefix-title",children:r("alias.prefix.title")}),(0,R.jsx)("span",{className:"dsh-better-alias-prefix-hint",children:r(t.prefix?"alias.prefix.on":"alias.prefix.off")})]}),(0,R.jsx)("input",{type:"checkbox","data-testid":"alias-prefix",checked:t.prefix,"aria-label":r("alias.prefix.title"),onChange:a=>e.store.setPrefix(a.target.checked)})]}),(0,R.jsxs)("div",{className:"dsh-better-alias-table-wrap",children:[(0,R.jsxs)("table",{className:"dsh-better-alias-table",children:[(0,R.jsx)("thead",{children:(0,R.jsxs)("tr",{children:[(0,R.jsx)("th",{scope:"col",children:r("alias.table.keyword")}),(0,R.jsx)("th",{scope:"col",children:r("alias.table.target")}),(0,R.jsx)("th",{scope:"col",children:r("alias.table.params")}),(0,R.jsx)("th",{scope:"col","aria-label":r("alias.table.actions")})]})}),(0,R.jsx)("tbody",{children:t.rows.map(a=>(0,R.jsx)(jr,{row:a,store:e.store,t:r,focus:o.current===a.id,clearFocus:()=>{o.current=null}},a.id))})]}),t.rows.length===0?(0,R.jsx)("p",{className:"dsh-better-alias-empty","data-testid":"alias-empty",children:r("alias.empty")}):null]}),(0,R.jsx)("button",{type:"button",className:"dsh-better-alias-add","data-testid":"alias-add",onClick:i,children:r("alias.add")}),(0,R.jsx)("p",{className:"dsh-better-alias-footnote",children:r("alias.footnote")})]})}return n}var qe="alias",Kr="/",Gr=-1;function Yr(e,n){let t=e.target.trim().replace(/^\/+/,""),r=e.keyword.trim(),o=e.params.trim();return{name:t,label:r,...o===""?{}:{description:n("alias.menu.params",{value:o})},section:n("alias.menu.section"),value:e.id}}function _n(e){return{trigger:Kr,name:qe,order:Gr,async candidates(n,t){if(t.position!=="leading")return[];let r=e.config();return!r.prefix&&e.bareMenuOpen?.()!==!0?[]:An(r,t.query,!0).map(o=>Yr(o,e.translate))},onPick(n){let t=e.config().rows.find(i=>i.id===n.candidate.value);if(t===void 0)return;let r=t.target.trim().replace(/^\/+/,"");r!==""&&e.routeCommand?.(r,n);let o=Pn(t);return o===""?void 0:{text:o}}}}var Mn="dsh-better/aliases.css",Jr=`
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
`;function Fn(e){let n=`style[data-plugin-css=${JSON.stringify(Mn)}]`;if(e.querySelector(n)!==null)return()=>{};let t=e.createElement("style");return t.dataset.plugin="dsh-better",t.dataset.pluginCss=Mn,t.textContent=Jr,e.head.append(t),()=>t.remove()}var te=require("react");var Bn={draft:"",draftRev:-1,phase:"plain"};function Wn(e){return function(t){let r=(0,te.useSyncExternalStore)(e.store.subscribe,e.store.getSnapshot,e.store.getSnapshot),o=t.sessionId===void 0?void 0:e.inputStoreFor(t.sessionId),i=t.sessionId===void 0?void 0:e.controllerFor(t.sessionId),a=(0,te.useSyncExternalStore)(c=>o===void 0?()=>{}:o.subscribe(c),()=>o===void 0?Bn:o.getSnapshot(),()=>o===void 0?Bn:o.getSnapshot()),l=(0,te.useRef)(null);return(0,te.useEffect)(()=>{let c=t.sessionId;if(c===void 0||a.phase!=="plain"||i===void 0)return;let d=i.menu.getSnapshot().open;if(d&&l.current===null)return;let s=je(r,a.draft);if(d){let f=l.current;if(f!==null&&(f.draftRev!==a.draftRev||f.spanEnd!==(s?.end??-1))){let p=setTimeout(()=>{let g=o?.getSnapshot()??a,b=e.controllerFor(c);if(b===void 0||g.phase!=="plain")return;l.current=null,b.dismiss();let h=je(e.store.getSnapshot(),g.draft);h!==void 0&&(e.bareMenuOpen.open=!0,Hn(b,h,g.draftRev),e.bareMenuOpen.open=!1,l.current={draftRev:g.draftRev,spanEnd:h.end})},80);return()=>clearTimeout(p)}return}if(l.current=null,s===void 0)return;let u=setTimeout(()=>{let f=o?.getSnapshot()??a,p=e.controllerFor(c);if(p===void 0||f.phase!=="plain"||p.menu.getSnapshot().open)return;let g=je(e.store.getSnapshot(),f.draft);g!==void 0&&(e.bareMenuOpen.open=!0,Hn(p,g,f.draftRev),e.bareMenuOpen.open=!1,l.current={draftRev:f.draftRev,spanEnd:g.end})},80);return()=>clearTimeout(u)},[r,a.draft,a.draftRev,a.phase,i,o,t.sessionId]),null}}function je(e,n){return e.prefix?On(e,n):In(e,n)}function Hn(e,n,t){e.toggleSource(qe,{trigger:"/",query:n.query,quoted:!1,position:"leading",span:{start:n.start,end:n.end,draftRev:t}})}function Q(e){return e!==void 0&&e!=="plain"}var C=require("react");var Xr="[a-z0-9]+(?:-[a-z0-9]+)*",Zr=new RegExp(`^/(${Xr})(?=\\s|$)`,"u");function le(e,n){let t=Zr.exec(e);if(t===null)return;let r=t[1]??"";if(n(r))return{name:r,start:0,end:1+r.length}}function zn(e,n,t){return e===void 0||!Number.isInteger(t)||t<e.end||t>n.length||t!==n.length?!1:/^[ \t]*$/u.test(n.slice(e.end,t))}var Ke=/\s/u;function Qr(e){let n=[],t=0;for(;t<e.length;){for(;t<e.length&&Ke.test(e.charAt(t));)t+=1;let r=t;for(;t<e.length&&!Ke.test(e.charAt(t));)t+=1;t>r&&n.push({text:e.slice(r,t),start:r})}return n}function $n(e,n,t){if(e==="")return;let r=le(e,n);if(r===void 0||t.length===0)return;let i=Qr(e).slice(1);if(i.length===0)return;let a=Ke.test(e.charAt(e.length-1)),l=i[i.length-1],c=i.length>=2?i[i.length-2]:void 0;if(l===void 0)return;let d=g=>g===void 0?void 0:t.find(b=>b.slot===g.text),s,u;if(a)s=l;else if(d(c)!==void 0)s=c,u=l;else if(d(l)!==void 0&&(c===void 0||c.text.startsWith("--")))s=l;else return;let f=d(s);if(f===void 0||s===void 0)return;if(u===void 0)return{name:r.name,slot:f.slot,query:"",start:e.length};let p=u.text;if(!p.startsWith("--"))return{name:r.name,slot:f.slot,query:p,start:u.start}}function eo(e,n){let t=e.slug.toLowerCase();if(t.startsWith(n))return 0;if(t.includes(n))return 1;if(e.summary.toLowerCase().includes(n))return 2}function ye(e,n){let t=n.trim().toLowerCase();if(t==="")return e;let r=[];for(let o of e){let i=eo(o,t);i!==void 0&&r.push({entry:o,tier:i})}return r.sort((o,i)=>o.tier-i.tier),r.map(o=>o.entry)}function Un(e,n){let t=n.trim().toLowerCase();if(t==="")return[];let r=e.toLowerCase(),o=[],i=0;for(;i<=r.length-t.length;){let a=r.indexOf(t,i);if(a===-1)break;o.push({start:a,end:a+t.length}),i=a+t.length}return o}function Vn(e,n,t,r){return e!=="Enter"&&e!=="ArrowUp"&&e!=="ArrowDown"||r||ye(n,t).length===0?"pass":e==="Enter"?"insert":"move"}function Ge(e){return`${e.trimEnd()} `}var no=/\s/u;function jn(e,n){let t=le(e,n);if(t===void 0)return;let r=e.length-1;for(;r>=0&&!no.test(e.charAt(r));)r-=1;let o=r+1,i=e.slice(o);if(!(i.length<2||!i.startsWith("--")))return{name:t.name,query:i,start:o}}function Kn(e,n){let t=n.slice(2).toLowerCase();return e.filter(r=>r.flag.startsWith("--")?r.flag.slice(2).toLowerCase().startsWith(t):!1)}function qn(e,n){let t=0;for(let r of n){let o=r.offset+r.length;if(e>=r.offset&&e<o)return;o<=e&&(t+=r.length-1)}return e-t}function Ee(e,n,t,r){let o=qn(t.start,n);if(o===void 0)return;let i=qn(e.length,n);if(i!==void 0)return{start:o,end:i,draftRev:r}}function Gn(e){return`${e} `}function to(e){let n=e.occurrences;if(!Array.isArray(n))return[];let t=[];for(let r of n){if(typeof r!="object"||r===null)continue;let o=r;typeof o.offset!="number"||typeof o.length!="number"||t.push({offset:o.offset,length:o.length})}return t}var ro=/^\/([a-z0-9]+(?:-[a-z0-9]+)*)[ \t]*$/u,oo=400,Yn=200,Jn=6,io=240,Xn={draft:"",draftRev:-1,phase:"plain"};function ao(e,n){return`${e!==""&&!/\s$/u.test(e)?" ":""}${n} `}function tt(e){return e===void 0?void 0:ro.exec(e)?.[1]}function so(e){return e===void 0?[]:e.split(`
`).map(n=>n.trim()).filter(n=>n!=="")}var Xe=240,Ze=640;function rt(e){return!Number.isFinite(e)||e<=0?Ze:Math.max(Xe,Math.min(Ze,e-24))}function lo(e,n){let t=rt(n),r=Number.isFinite(e)&&e>0?e:0,o=r===0?Xe:r<=80?320:r<200?480:Ze;return Math.min(Math.max(o,Xe),t)}function ot(e,n,t,r){if(!Number.isFinite(t)||t<=0)return e;let o=t-n-r;return Math.max(r,Math.min(e,Math.max(r,o)))}function uo(e,n,t){if(t<=0||typeof e.createRange!="function")return;let r=e.createRange(),o=t,i=!1,a=c=>{for(let d of Array.from(c.childNodes)){if(d.nodeType===3){let s=d.textContent??"",u=Math.min(o,s.length);if(u<=0)continue;if(i||(r.setStart(d,0),i=!0),r.setEnd(d,u),o-=u,o<=0)return!0;continue}if(a(d))return!0}return!1};if(!a(n)||o>0)return;let l=r.getBoundingClientRect();if(!(l.width===0&&l.height===0))return{left:l.left,right:l.right,top:l.top,bottom:l.bottom}}function Zn(e,n){let t=e.querySelectorAll("[data-composer-text-ref]");for(let r of t){if(tt(r.textContent??"")!==n)continue;let o=uo(e,r,n.length+1);if(o!==void 0)return o;let i=r.getBoundingClientRect();return{left:i.left,right:i.right,top:i.top,bottom:i.bottom}}}function Re(e){return e.defaultView?.innerWidth??0}function it(e,n,t,r){let o=e.top-r,i=Number.isFinite(t)&&t>0?t:0;return i===0||i<=o?{left:e.left,top:0,anchor:"above"}:{left:e.left,top:e.bottom+r,anchor:"below"}}function Te(e){return e.defaultView?.innerHeight??0}function Qn(e){let n=typeof e.getSelection=="function"?e.getSelection():null,t=n?.anchorNode;if(t!=null){let l=(t.nodeType===1?t:t.parentElement)?.closest("[data-composer-text-ref]");if(l!=null){let c=n?.getRangeAt===void 0||n.rangeCount===0?void 0:n.getRangeAt(0).getBoundingClientRect();if(c!==void 0&&c.height>0)return{left:c.left,right:c.left,top:c.top,bottom:c.bottom}}}let r=e.querySelectorAll("[data-composer-text-ref]"),o=r[r.length-1];if(o===void 0)return;let i=o.getBoundingClientRect();if(!(i.width===0&&i.height===0))return{left:i.left,right:i.right,top:i.top,bottom:i.bottom}}function Ye(e,n,t){if(n<=0)return;if(e===void 0)return 0;let r=Math.min(e,n-1);return t==="up"?Math.max(0,r-1):Math.min(n-1,r+1)}function et(e,n,t,r){let o=Un(t,r);if(o.length===0){n.append(e.createTextNode(t));return}let i=0;for(let a of o){a.start>i&&n.append(e.createTextNode(t.slice(i,a.start)));let l=e.createElement("mark");l.className="dsh-better-skill-catalog-mark",l.textContent=t.slice(a.start,a.end),n.append(l),i=a.end}i<t.length&&n.append(e.createTextNode(t.slice(i)))}function co(e,n){let t=e.createElement("div");t.className="dsh-better-skill-catalog";let r=e.createElement("div");return r.className="dsh-better-skill-catalog-title",r.textContent=`/${n.name} ${n.slot}`,t.append(r),n.getActions()?.insertText!==void 0&&n.entries.forEach((o,i)=>{t.append(fo(e,n,o,i===n.selected))}),t.style.width=`${Qe(e)}px`,t}function fo(e,n,t,r){let o=e.createElement("button");o.type="button",o.className=r?"dsh-better-skill-catalog-row dsh-better-skill-catalog-selected":"dsh-better-skill-catalog-row",o.addEventListener("pointerdown",l=>l.preventDefault());let i=e.createElement("span");i.className="dsh-better-skill-catalog-slug",et(e,i,t.slug,n.match.query),o.append(i);let a=e.createElement("span");return a.className="dsh-better-skill-catalog-summary",et(e,a,t.summary,n.match.query),o.append(a),o.addEventListener("click",()=>{let l=n.getActions(),c=l?.captureInsertion?.();if(l?.insertText===void 0||c===void 0)return;let d=Ee(n.getDraft(),n.getOccurrences(),n.match,c.draftRev);d!==void 0&&l.insertText(Ge(t.slug),d)}),o}function po(e,n){let t=e.createElement("div");t.className="dsh-better-skill-params";let r=e.createElement("div");if(r.className="dsh-better-skill-params-title",r.textContent=`/${n.name}`,t.append(r),n.getActions()?.insertText!==void 0)for(let o of n.params)t.append(mo(e,n,o.flag,o.detail));return t.style.width=`${Qe(e)}px`,t}function Qe(e){return Math.min(320,rt(Re(e)))}function nt(e,n,t){if(t===void 0)return;let r=4,o=Re(e),i=Qe(e);n.style.width=`${i}px`;let a=it(t,Te(e),n.offsetHeight,r);n.style.left=`${ot(a.left,i,o,12)}px`,a.anchor==="above"?(n.style.bottom=`${Te(e)-t.top+r}px`,n.style.top=""):(n.style.top=`${a.top}px`,n.style.bottom="")}function mo(e,n,t,r){let o=e.createElement("button");o.type="button",o.className="dsh-better-skill-panel-param",o.addEventListener("pointerdown",a=>a.preventDefault());let i=e.createElement("span");if(i.className="dsh-better-skill-panel-param-flag",i.textContent=t,o.append(i),r!==""){let a=e.createElement("span");a.className="dsh-better-skill-panel-param-detail",a.textContent=r,o.append(a)}return o.addEventListener("click",()=>{let a=n.getActions(),l=a?.captureInsertion?.();if(a?.insertText===void 0||l===void 0)return;let c=Ee(n.getDraft(),n.getOccurrences(),n.match,l.draftRev);c!==void 0&&a.insertText(Gn(t),c)}),o}function at(e){return function(t){let r=e.document??globalThis.document,o=t.sessionId,i=o===void 0?void 0:e.inputStoreFor(o),a=t.useInput,l=a===void 0?void 0:a(y=>y.draft),c=a===void 0?void 0:a(y=>y.phase),d=a===void 0?void 0:a(y=>y.occurrences),s=(0,C.useSyncExternalStore)(y=>i===void 0?()=>{}:i.subscribe(y),()=>i===void 0?Xn:i.getSnapshot(),()=>i===void 0?Xn:i.getSnapshot()),u=l??s.draft,f=c??s.phase,[p,g]=(0,C.useState)(()=>new Set),[b,h]=(0,C.useState)(void 0),[w,I]=(0,C.useState)(void 0),[P,E]=(0,C.useState)(void 0),[H,$]=(0,C.useState)(void 0),[v,S]=(0,C.useState)(void 0),[m,O]=(0,C.useState)(void 0),[N,M]=(0,C.useState)(void 0),[W,j]=(0,C.useState)(void 0),[D,U]=(0,C.useState)(void 0);(0,C.useEffect)(()=>{if(o===void 0)return;let y=!0;return e.skillNamesFor(o).then(x=>{y&&g(x)},()=>{y&&g(new Set)}),()=>{y=!1}},[o]);let ae=le(u,y=>p.has(y)),X=zn(ae,u,u.length)&&!Q(f)?ae?.name:void 0,k=jn(u,y=>p.has(y)),L=k!==void 0&&!Q(f)&&v!==u,T=$n(u,y=>p.has(y),b?.assists??[]),Y=b?.catalogs?.workflows??[],Z=T!==void 0&&Y.length>0&&!Q(f)&&N!==u&&!L,We=ae?.name??w;(0,C.useEffect)(()=>{if(o===void 0||We===void 0){h(void 0);return}let y=!0;return e.loadProfile(o,We).then(x=>{y&&h(x)},()=>{y&&h(void 0)}),()=>{y=!1}},[o,We]),(0,C.useEffect)(()=>{if(r===void 0||X===void 0){E(void 0);return}let y=()=>E(Zn(r,X));y();let x=r.defaultView;return x?.addEventListener("resize",y),()=>x?.removeEventListener("resize",y)},[r,X,u]);let pe=(0,C.useRef)(null),ee=(0,C.useRef)(null),ve=()=>{pe.current!==null&&clearTimeout(pe.current),pe.current=null},me=()=>{ee.current!==null&&clearTimeout(ee.current),ee.current=null};(0,C.useEffect)(()=>{if(r===void 0||o===void 0)return;let y=V=>{let F=V.target;if(!(F instanceof r.defaultView.Element))return;let he=F.closest("[data-composer-text-ref]");if(he===null)return;let ne=tt(he.textContent??"");ne!==void 0&&(me(),ve(),pe.current=setTimeout(()=>{pe.current=null,I(ne),E(Zn(r,ne)),$(e.loadUsage(o,ne))},oo))},x=V=>{let F=V.target;F instanceof r.defaultView.Element&&F.closest("[data-composer-text-ref]")!==null&&(ve(),me(),ee.current=setTimeout(()=>{ee.current=null,I(void 0)},Yn))};return r.addEventListener("pointerover",y,!0),r.addEventListener("pointerout",x,!0),()=>{ve(),me(),r.removeEventListener("pointerover",y,!0),r.removeEventListener("pointerout",x,!0)}},[r,o]),(0,C.useEffect)(()=>{if(r===void 0||w===void 0)return;let y=x=>{x.key==="Escape"&&I(void 0)};return r.addEventListener("keydown",y),()=>r.removeEventListener("keydown",y)},[r,w]);let J=(0,C.useRef)(u);J.current=u;let ge=(0,C.useRef)(void 0);ge.current=t.inputActions??(o===void 0?void 0:e.actionsFor(o));let Se=(0,C.useRef)([]);Se.current=to({draft:u,draftRev:s.draftRev,phase:f,occurrences:d??s.occurrences});let ze=(0,C.useRef)(void 0),$e=(0,C.useRef)(void 0);return(0,C.useEffect)(()=>{if(r===void 0||X===void 0||P===void 0)return;let y=so(b?.argumentHint);if(y.length===0)return;let x=go(r,P,y);return r.body.append(x),()=>x.remove()},[r,X,P,b]),(0,C.useEffect)(()=>{if(r===void 0||w===void 0||L)return;let y=ho(r,e,{name:w,profile:b,usage:H,box:P,sessionId:o,getActions:()=>ge.current,getDraft:()=>J.current,onEnter:me,onLeave:()=>{ve(),me(),ee.current=setTimeout(()=>{ee.current=null,I(void 0)},Yn)}});return r.body.append(y),()=>y.remove()},[r,w,b,H,P,o,L]),(0,C.useEffect)(()=>{if(r===void 0||!L){O(void 0);return}let y=()=>O(Qn(r));y();let x=r.defaultView;return x?.addEventListener("resize",y),()=>x?.removeEventListener("resize",y)},[r,L,u]),(0,C.useEffect)(()=>{if(r===void 0||!L||k===void 0)return;let y=Kn(b?.params??[],k.query);if(y.length===0)return;let x=po(r,{name:k.name,match:k,params:y,getActions:()=>ge.current,getDraft:()=>J.current,getOccurrences:()=>Se.current});return ze.current=x,r.body.append(x),nt(r,x,m),()=>{ze.current=void 0,x.remove()}},[r,L,k,b,m]),(0,C.useEffect)(()=>{if(r===void 0||!L)return;let y=x=>{x.key==="Escape"&&S(J.current)};return r.addEventListener("keydown",y),()=>r.removeEventListener("keydown",y)},[r,L]),(0,C.useEffect)(()=>{if(r===void 0||!L)return;let y=x=>{let V=ze.current,F=x.target;V!==void 0&&F instanceof Node&&V.contains(F)||S(J.current)};return r.addEventListener("pointerdown",y,!0),()=>r.removeEventListener("pointerdown",y,!0)},[r,L]),(0,C.useEffect)(()=>{if(r===void 0||!Z){j(void 0);return}let y=()=>j(Qn(r));y();let x=r.defaultView;return x?.addEventListener("resize",y),()=>x?.removeEventListener("resize",y)},[r,Z,u]),(0,C.useEffect)(()=>{U(void 0)},[T?.query]),(0,C.useEffect)(()=>{if(r===void 0||!Z||T===void 0)return;let y=ye(Y,T.query);if(y.length===0)return;let x=co(r,{name:T.name,slot:T.slot,match:T,entries:y,selected:Ye(D,y.length,"down")??0,getActions:()=>ge.current,getDraft:()=>J.current,getOccurrences:()=>Se.current});return $e.current=x,r.body.append(x),nt(r,x,W),()=>{$e.current=void 0,x.remove()}},[r,Z,T,Y,D,W]),(0,C.useEffect)(()=>{if(r===void 0||!Z)return;let y=x=>{if(x.key==="Escape"){M(J.current);return}if(x.key!=="ArrowUp"&&x.key!=="ArrowDown"&&x.key!=="Enter")return;let V=Vn(x.key,Y,T?.query??"",x.isComposing);if(V!=="pass"){if(x.preventDefault(),x.stopPropagation(),V==="insert"){let F=ye(Y,T?.query??""),he=Ye(D,F.length,"down"),ne=he===void 0?void 0:F[he];if(ne===void 0||T===void 0)return;let Ue=ge.current,vn=Ue?.captureInsertion?.();if(Ue?.insertText===void 0||vn===void 0)return;let Sn=Ee(J.current,Se.current,T,vn.draftRev);if(Sn===void 0)return;Ue.insertText(Ge(ne.slug),Sn);return}U(F=>Ye(F,ye(Y,T?.query??"").length,x.key==="up"?"up":"down"))}};return r.addEventListener("keydown",y,!0),()=>r.removeEventListener("keydown",y,!0)},[r,Z,T,Y,D]),(0,C.useEffect)(()=>{if(r===void 0||!Z)return;let y=x=>{let V=$e.current,F=x.target;V!==void 0&&F instanceof Node&&V.contains(F)||M(J.current)};return r.addEventListener("pointerdown",y,!0),()=>r.removeEventListener("pointerdown",y,!0)},[r,Z]),null}}function go(e,n,t){let r=e.createElement("div");r.className="dsh-better-skill-hint",r.textContent=t.join(`
`);let o=n.right+Jn>Re(e)-io;return r.style.left=`${o?n.left:n.right+Jn}px`,r.style.top=`${o?n.bottom+2:n.top}px`,r}function ho(e,n,t){let r=e.createElement("div");r.className="dsh-better-skill-panel",r.addEventListener("pointerenter",t.onEnter),r.addEventListener("pointerleave",t.onLeave);let o=e.createElement("div");o.className="dsh-better-skill-panel-title",o.textContent=`/${t.name}`,r.append(o);let i=t.profile?.description;if(i!==void 0&&i!==""){let s=e.createElement("div");s.className="dsh-better-skill-panel-desc",s.textContent=i,s.title=i,r.append(s)}let a=t.profile?.metadata??{},l=Object.keys(a);if(l.length>0){let s=e.createElement("div");s.className="dsh-better-skill-panel-section",s.append(Je(e,n.translate("skill.metadata")));for(let u of l){let f=e.createElement("div");f.textContent=`${u}: ${a[u]??""}`,s.append(f)}r.append(s)}let c=t.profile?.path;if(c!==void 0&&c!==""){r.append(Je(e,n.translate("skill.path")));let s=e.createElement("div");s.className="dsh-better-skill-panel-path",s.textContent=c,r.append(s)}if(t.usage!==void 0){let s=e.createElement("div");s.className="dsh-better-skill-panel-counts",s.textContent=`${n.translate("skill.usage.session")} ${t.usage.session}`,t.usage.workspace!==void 0&&(s.textContent+=` \xB7 ${n.translate("skill.usage.workspace")} ${t.usage.workspace}`),r.append(s)}let d=t.profile?.params??[];if(d.length>0&&t.getActions()?.insertText!==void 0){r.append(Je(e,n.translate("skill.params")));for(let s of d)r.append(yo(e,n,t,s.flag,s.detail))}{let u=Re(e),f=lo(i?.length??0,u);if(r.style.width=`${f}px`,t.box!==void 0){let p=it(t.box,Te(e),r.offsetHeight,4);r.style.left=`${ot(p.left,f,u,12)}px`,p.anchor==="above"?(r.style.bottom=`${Te(e)-t.box.top+4}px`,r.style.top=""):(r.style.top=`${p.top}px`,r.style.bottom="")}}return r}function Je(e,n){let t=e.createElement("div");return t.className="dsh-better-skill-panel-label",t.textContent=n,t}function yo(e,n,t,r,o){let i=e.createElement("button");i.type="button",i.className="dsh-better-skill-panel-param",i.title=n.translate("skill.hint.insert"),i.addEventListener("pointerdown",l=>l.preventDefault());let a=e.createElement("span");if(a.className="dsh-better-skill-panel-param-flag",a.textContent=r,i.append(a),o!==""){let l=e.createElement("span");l.className="dsh-better-skill-panel-param-detail",l.textContent=o,i.append(l)}return i.addEventListener("click",()=>{let l=t.getActions();if(l?.insertText===void 0||l.captureInsertion===void 0)return;let c=l.captureInsertion();l.insertText(ao(t.getDraft(),r),c)}),i}var st="dsh-better/skill-enhancer.css",bo=`
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
`;function lt(e){if(e===void 0)return()=>{};let n=`style[data-plugin-css=${JSON.stringify(st)}]`;if(e.querySelector(n)!==null)return()=>{};let t=e.createElement("style");return t.dataset.plugin="dsh-better",t.dataset.pluginCss=st,t.textContent=bo,e.head.append(t),()=>t.remove()}function dt(e,n,t){if(n===void 0||n===""||e.length===0)return;let r=0;for(let o of e){if(o.cwd!==n)continue;let i=o.usage?.[t];typeof i=="number"&&Number.isFinite(i)&&(r+=i)}return r}var A=require("react");var ko="@deepseek-ai/dsh-client-ui-commands/PopupSelectView.module.css";function ut(e){if(e===void 0)return;let t=e.querySelector(`style[data-plugin-css="${ko}"]`)?.textContent??"",r=i=>new RegExp(`\\.(\\w+_${i})\\{`,"u").exec(t)?.[1],o={badges:"dshBetter_badges",badgeChip:"dshBetter_badgeChip",badgeChipOn:"dshBetter_badgeChipOn",card:r("card"),viewport:r("viewport"),row:r("row"),rowActive:r("rowActive"),label:r("label"),labelText:r("labelText"),badge:r("badge"),detail:r("detail"),check:r("check"),status:r("status"),search:r("search"),error:r("error"),errorText:r("errorText"),retry:r("retry")};for(let[i,a]of Object.entries(o))if(!(i==="badges"||i==="badgeChip"||i==="badgeChipOn")&&a===void 0)return;return o}function en(e,n){for(let t of e)if(t.id===n.provider){for(let r of t.models)if(r.id===n.model)return r.reasoning}}function ct(e,n){let t=en(e,n)?.efforts;return t===void 0?[]:[...t]}function ft(e,n){if(e.length===0)return;let t=r=>r!==void 0&&e.some(o=>o.id===r);return t(n.remembered)?n.remembered:n.isCurrent&&t(n.currentEffort)?n.currentEffort:t(n.defaultEffort)?n.defaultEffort:e[0]?.id}function wo(e){return e.length>1}function pt(e){return wo(e)?e:[]}var K=require("react/jsx-runtime");function Ae(e){let n=e.group?.name;if(n===void 0)return;let t=`${n}/`,r=e.id.startsWith(t)?e.id.slice(t.length):e.id;return{provider:n,model:r}}function xo(e,n){let t=Ae(e);return pt(t===void 0?[]:ct(n??[],t))}function mt({option:e,active:n,catalog:t,pointed:r,classes:o,primitives:i,onChoose:a,onPickEffort:l,onHover:c,t:d}){let s=xo(e,t),u=i.IconCheckOutlineRegular;return(0,K.jsxs)("div",{role:"option","aria-selected":n,"aria-label":e.badge===void 0?void 0:`${e.label} ${e.badge}`,className:n?`${o.row} ${o.rowActive}`:o.row,onClick:a,onMouseEnter:c,children:[(0,K.jsxs)("span",{className:o.label,children:[(0,K.jsx)("span",{className:o.labelText,children:e.label}),e.badge!==void 0&&(0,K.jsx)("sup",{className:o.badge,children:e.badge})]}),e.detail!==void 0&&(0,K.jsx)("span",{className:o.detail,children:e.detail}),s.length>0&&(0,K.jsx)("span",{className:o.badges,role:"group","aria-label":d?.("listbox.aria")??"",children:s.map(f=>(0,K.jsx)("button",{type:"button",className:f.id===r?`${o.badgeChip} ${o.badgeChipOn}`:o.badgeChip,title:f.description??f.name,onClick:p=>{p.stopPropagation(),l(f.id)},children:f.name},f.id))}),e.active===!0&&s.length===0&&(0,K.jsx)("span",{className:o.check,children:u===void 0?null:(0,K.jsx)(u,{})})]})}function Pe(e){let n=new Map;for(let t of e){let r=t.group?.name,o=n.get(r);o!==void 0?o.rows.push(t):n.set(r,{group:t.group,rows:[t]})}return[...n.values()]}function Oe(e){let n=Pe(e);return n.some(t=>t.group!==void 0)?n.flatMap(t=>t.rows):[...e]}function gt(e,n,t){return t===void 0?e.filter(r=>r.label.toLowerCase().includes(n)):Pe(e).flatMap(r=>t(r.rows.map(o=>({name:o.label,option:o})),n).map(o=>o.option))}var nn=new WeakSet;async function ht(e,n){let t=e.binding,r=e.state.getSnapshot();if(!(t===null||r.submitting||nn.has(e))){nn.add(e),e.state.set?.({...r,submitting:!0,confirming:null,acknowledged:!1,error:null});try{let o=n();if(o===void 0)return;await o,t!==null&&e.binding===t&&e.deps?.consume?.(t.segment)}finally{nn.delete(e),t!==null&&e.binding===t&&e.dismiss({focusComposer:!0})}}}var vo="@deepseek-ai/dsh-client-ui-primitives";function Ie(e){if(e===null)return{};let n;try{n=e(vo)}catch{return{}}if(n===null||typeof n!="object")return{};let t=n,r=h=>typeof h=="function"||typeof h=="object"&&h!==null,o=h=>{let w=t[h];return r(w)?w:void 0},i=h=>{let w=t[h];return typeof w=="function"?w:void 0},a={},l=o("MenuSurface");l!==void 0&&(a.MenuSurface=l);let c=o("MenuGroup");c!==void 0&&(a.MenuGroup=c);let d=o("IconCheckOutlineRegular");d!==void 0&&(a.IconCheckOutlineRegular=d);let s=o("IconDataOutlineRegular");s!==void 0&&(a.IconDataOutlineRegular=s);let u=o("IconChevronDownOutlineRegular");u!==void 0&&(a.IconChevronDownOutlineRegular=u);let f=o("Tag");f!==void 0&&(a.Tag=f);let p=i("useAnchoredMaxHeight");p!==void 0&&(a.useAnchoredMaxHeight=p);let g=i("observeStickyMenuGroups");g!==void 0&&(a.observeStickyMenuGroups=g);let b=i("rankByName");return b!==void 0&&(a.rankByName=b),a}function So(e){if(e===void 0)return[];let n=[e.name,e.label].map(t=>t.trim().toLowerCase()).filter(t=>t!=="");return[...new Set(n)]}function Co(e,n){return So(e.group).some(t=>t.includes(n))}function Lo(e,n,t,r){return t==="fuzzy-label"?gt(e,n,r):Oe(e).filter(o=>o.label.toLowerCase().includes(n)||o.detail?.toLowerCase().includes(n)===!0)}function yt(e,n,t,r){let o=n.trim().toLowerCase();if(o==="")return Oe(e);let i=Lo(e,o,t,r),a=new Set(i),l=Oe(e).filter(c=>!a.has(c)&&Co(c,o));return[...i,...l]}var _=require("react/jsx-runtime"),xt="model",bt=320;function Eo(e){return e.command!==xt||!e.open||e.status!=="ready"||e.confirming!==null||e.options.length===0?!1:e.submitting||e.error===null}function To(e){return e===void 0?!1:/Android|iPhone|iPad|iPod/i.test(e.userAgent)||e.platform==="MacIntel"&&e.maxTouchPoints>1}var Ro={subscribe:()=>()=>{},getSnapshot:()=>({open:!1,command:null,status:"pending",options:[],search:"",searchLabels:null,searchMode:"substring",active:0,submitting:!1,confirming:null,acknowledged:!1,error:null})};function vt(e){let n=Ie(e.load);function t(r){let o=r.popup,i=o?.state??Ro,a=(0,A.useCallback)(s=>i.subscribe(s),[i]),l=(0,A.useCallback)(()=>i.getSnapshot(),[i]),c=(0,A.useSyncExternalStore)(a,l),d=e.native();return o===void 0||d===void 0?null:!Eo(c)||o.settle===void 0?(0,_.jsx)(d,{...r}):(0,_.jsx)(Ao,{popup:o,state:c,t:r.t,primitives:n,doc:e.document,catalog:r.catalog,current:r.current,selectModel:r.selectModel})}return t}function Ao({popup:e,state:n,t,primitives:r,doc:o,catalog:i,current:a,selectModel:l}){let c=(0,A.useRef)(null),d=(0,A.useRef)(null),s=(0,A.useRef)(null),u=(0,A.useMemo)(()=>ut(o),[o]),f=n.searchMode,p=(0,A.useMemo)(()=>yt(n.options,n.search,f,r.rankByName),[n.options,n.search,f,r.rankByName]),g=(0,A.useMemo)(()=>Pe(p),[p]),[b,h]=(0,A.useState)({}),[w,I]=(0,A.useState)(()=>kt(p));(0,A.useEffect)(()=>{I(kt(p))},[n.search,n.options]);let P=wt(p,w),E=Po(r,c,n);(0,A.useEffect)(()=>{let k=s.current;if(!(k===null||r.observeStickyMenuGroups===void 0))return r.observeStickyMenuGroups(k)},[r.observeStickyMenuGroups,n.open,n.status,g]),(0,A.useEffect)(()=>{c.current?.querySelector('[aria-selected="true"]')?.scrollIntoView({block:"nearest"})},[P,p]),(0,A.useEffect)(()=>{if(!n.open)return;let k=L=>{let T=c.current;T!==null&&L.target instanceof Node&&T.contains(L.target)||e.dismiss()};return o?.addEventListener("pointerdown",k,!0),()=>{o?.removeEventListener("pointerdown",k,!0)}},[o,e,n.open]),(0,A.useEffect)(()=>{n.open&&(To(o?.defaultView?.navigator)||d.current?.focus())},[o,n.open]);let H=(0,A.useCallback)((k,L)=>{if(L===void 0||l===void 0){e.settle?.(e.binding,k);return}let T=Ae(k);if(T===void 0){e.settle?.(e.binding,k);return}ht(e,()=>l({...T,reasoningEffort:L}))},[e,l]),$=(0,A.useCallback)(k=>{let L=Ae(k);if(L===void 0)return;let T=en(i??[],L);return ft(T?.efforts??[],{remembered:b[k.id],isCurrent:a?.provider===L.provider&&a?.model===L.model,currentEffort:a?.reasoningEffort,defaultEffort:T?.defaultEffort})},[i,a,b]),v=(0,A.useCallback)(k=>{H(k,$(k))},[$,H]),S=(0,A.useCallback)((k,L)=>{h(T=>({...T,[k.id]:L})),H(k,L)},[H]),m=(0,A.useCallback)(()=>{let k=p[P];k!==void 0&&v(k)},[P,v,p]),O=(0,A.useCallback)(k=>{p.length!==0&&I(L=>(wt(p,L)+k+p.length)%p.length)},[p]),N=k=>{switch(k.key){case"ArrowDown":k.preventDefault(),O(1);return;case"ArrowUp":k.preventDefault(),O(-1);return;case"Enter":k.preventDefault(),m();return;case"Tab":if(!k.shiftKey&&p.length===0)return;k.preventDefault(),k.shiftKey?e.dismiss({focusComposer:!0}):m();return;case"Escape":k.preventDefault(),e.dismiss({focusComposer:!0});return;default:}};if(u===void 0)return null;let M=n.searchLabels?.placeholder??t?.("search.placeholder")??"",W=n.searchLabels===null?t?.("status.empty")??"":n.options.length===0?n.searchLabels.empty:n.searchLabels.noResults,j=(k,L)=>(0,_.jsx)(mt,{option:k,active:L===P,catalog:i,pointed:L===P?$(k):void 0,classes:u,primitives:r,onChoose:()=>{v(k)},onPickEffort:T=>{S(k,T)},onHover:()=>{I(L)},t},k.id),D=0,U=g.map(({group:k,rows:L})=>{let T=L.map(Y=>j(Y,D++));return k===void 0?(0,_.jsx)(A.Fragment,{children:T},"ungrouped"):r.MenuGroup===void 0?(0,_.jsx)(A.Fragment,{children:T},`group:${k.name}`):(0,_.jsx)(r.MenuGroup,{label:k.label,children:T},`group:${k.name}`)}),ae=(0,_.jsxs)(_.Fragment,{children:[(0,_.jsx)("input",{ref:d,className:u.search,type:"text",placeholder:M,"aria-label":t?.("search.aria")??"",value:n.search,readOnly:n.submitting,onChange:k=>{e.setSearch(k.currentTarget.value)}}),n.submitting&&(0,_.jsx)("div",{className:u.status,children:t?.("status.applying")??""}),!n.submitting&&p.length===0&&(0,_.jsx)("div",{className:u.status,children:W}),p.length>0&&(0,_.jsx)("div",{ref:s,role:"listbox","aria-label":t?.("listbox.aria")??"",className:u.viewport,children:U})]}),X={className:u.card,style:{maxHeight:E},"aria-label":t?.("overlay.aria")??xt,onKeyDown:N};return r.MenuSurface===void 0?(0,_.jsx)("div",{ref:c,...X,children:ae}):(0,_.jsx)(r.MenuSurface,{ref:c,...X,children:ae})}function kt(e){let n=e.findIndex(t=>t.active===!0);return n===-1?0:n}function wt(e,n){return e.length===0?0:Math.min(Math.max(n,0),e.length-1)}function Po(e,n,t){let r=e.useAnchoredMaxHeight;return r===void 0?bt:r(n,bt,t)}var q=require("react");var tn="application/x-dsh-composer+json";var Oo=Object.freeze({png:"image/png",jpg:"image/jpeg",jpeg:"image/jpeg",webp:"image/webp",gif:"image/gif",bmp:"image/bmp",svg:"image/svg+xml",avif:"image/avif",heic:"image/heic",heif:"image/heif",tif:"image/tiff",tiff:"image/tiff"});function St(e){return JSON.stringify({v:1,text:e.text,attachments:e.attachments.map(n=>({path:n.path,name:n.name,type:n.type,kind:n.kind}))})}function Ct(e){if(typeof e!="string"||e==="")return;let n;try{n=JSON.parse(e)}catch{return}if(n===null||typeof n!="object")return;let t=n;if(t.v!==1)return;let r=typeof t.text=="string"?t.text:"",o=Array.isArray(t.attachments)?t.attachments:[],i=[];for(let a of o){if(a===null||typeof a!="object")continue;let l=a,c=l.path;typeof c!="string"||c===""||i.push({path:c,name:typeof l.name=="string"&&l.name!==""?l.name:on(c),type:typeof l.type=="string"?l.type:"",kind:l.kind==="image"?"image":"file"})}return{text:r,attachments:i}}function rn(e,n){if(n.length===0)return e;let t=n.join(`
`);return e===""?t:`${e.replace(/\n+$/u,"")}

${t}`}function Lt(e){if(e==="")return;let n=e.split(`
`),t=[],r=n.length;for(let i=n.length-1;i>=0;i-=1){let a=n[i]??"";if(a.trim()===""){if(t.length>0){r=i;continue}continue}let l=Io(a);if(l===void 0)break;t.unshift(l),r=i}return t.length===0?void 0:{text:n.slice(0,r).join(`
`).replace(/\n+$/u,""),paths:t}}function Io(e){let n=e.trim();if(n.startsWith("@")&&(n=n.slice(1)),n.startsWith('"')&&n.endsWith('"')&&n.length>1&&(n=n.slice(1,-1)),n!==""&&No(n)&&!/[\u0000-\u001f\u007f]/u.test(n)&&!/["\u2018\u2019\u201c\u201d\u300c\u300d\u300e\u300f\u3002\uff01\uff1f\uff1b\uff1a\uff0c\u3001\u2026*?;<>|&$`!#=]/u.test(n)&&!/(?:^|\s)-{1,2}\S/u.test(n))return n}function No(e){return e.startsWith("/")||/^[A-Za-z]:[/\\]/u.test(e)||e.startsWith("\\\\")}function Et(e){let n=/\.([A-Za-z0-9]+)$/u.exec(e);if(n!==null)return Oo[n[1]?.toLowerCase()??""]}function on(e){return e.split(/[\\/]/u).filter(t=>t!=="").at(-1)??e}function Tt(e,n){let t=new Set(n),r=[],o=[];for(let i of e){if(t.has(i.path)){o.push(i.path);continue}t.add(i.path),r.push(i)}return{accepted:r,duplicates:o}}var de=require("react/jsx-runtime"),Do="data-dsh-better-attach-item",_o="data-dsh-better-attach-selected",Mo=4500,Fo=new Set(["a","c","x","insert"]),Bo=new Set(["meta","control","shift","alt","altgraph","capslock","os"]),Ho=/\s/u;function At(e){function n(t){let r=e.native();return r===void 0?null:(0,de.jsx)(Wo,{native:r,props:t,deps:e})}return n}function Wo({native:e,props:n,deps:t}){let r=(0,q.useRef)(null),[o,i]=(0,q.useState)(!1),[a,l]=(0,q.useState)(null),c=(n.attachments??[]).length>0,d=(0,q.useRef)(n);d.current=n;let s=(0,q.useRef)(o);s.current=o;let u=(p,g)=>n.t?.(p,g)??t.translate()?.(p,g)??"",f=(0,q.useRef)(u);return f.current=u,(0,q.useEffect)(()=>{let p=r.current;if(p===null)return;let g=p.querySelector('[role="group"]');if(g!==null)for(let b of Array.from(g.children)){if(!(b instanceof HTMLElement))continue;b.toggleAttribute(Do,!0);let h=Vo(b);h!==null&&h.toggleAttribute(_o,o)}},[o,n.attachments]),(0,q.useEffect)(()=>{if(a===null)return;let p=globalThis.setTimeout(()=>{l(null)},Mo);return()=>{globalThis.clearTimeout(p)}},[a]),(0,q.useEffect)(()=>{let p=r.current;if(p===null)return;let g=p.closest("[data-composer-card]");if(!(g instanceof HTMLElement))return;let b=g.ownerDocument,h=m=>(m instanceof Element?m:m instanceof Node?m.parentElement:null)?.closest("[contenteditable]")??null,w=()=>{s.current&&i(!1)},I=()=>{let m=g.ownerDocument.getSelection();return m!==null&&!m.isCollapsed&&m.toString()!==""},P=m=>m instanceof Node&&g.contains(m),E=m=>{let O=m.key.toLowerCase();if(Bo.has(O))return;let N=m.metaKey||m.ctrlKey;if(N&&!m.altKey&&O==="a"){P(m.target)&&h(m.target)?.getAttribute("contenteditable")==="true"&&i(!0);return}if(N&&!m.altKey&&O==="c"&&s.current&&P(m.target)&&!I()){m.preventDefault(),$o(d.current,t,l,f.current);return}N&&!m.altKey&&Fo.has(O)||w()},H=()=>{w()},$=m=>{let N=d.current.attachments??[],M=m.clipboardData;if(!s.current||N.length===0||M===null)return;let W=[],j=[];for(let D of N){let U=t.pathOf(D.file);if(U===""){j.push(D.file.name);continue}W.push({path:U,name:D.file.name,type:D.file.type,kind:D.kind})}if(W.length>0){let D=M.getData("text/plain");M.setData(tn,St({text:D,attachments:W})),M.setData("text/plain",rn(D,W.map(U=>U.path)))}j.length>0&&l(f.current("attach.copySkipped",{count:String(j.length)}))},v=m=>{let O=m.clipboardData;if(O===null||h(m.target)===null||Array.from(O.types).includes("Files"))return;let N=()=>d.current,M=Ct(O.getData(tn)),W=M===void 0?Lt(O.getData("text/plain")):void 0;if(M===void 0&&W===void 0)return;let j=zo(d.current.phase?.(),f.current);if(j!==void 0){m.preventDefault(),m.stopPropagation(),l(j);return}if(m.preventDefault(),m.stopPropagation(),w(),M!==void 0){Rt(M,N,t,l,f.current);return}W!==void 0&&Rt({text:W.text,attachments:W.paths.map(D=>{let U=Et(D)??"";return{path:D,name:on(D),type:U,kind:U===""?"file":"image"}})},N,t,l,f.current)};b.addEventListener("keydown",E,!0),g.addEventListener("paste",v,!0);let S=m=>{let O=m.relatedTarget;O instanceof Node&&g.contains(O)||w()};return g.addEventListener("focusout",S),b.addEventListener("copy",$),b.addEventListener("pointerdown",H,!0),()=>{b.removeEventListener("keydown",E,!0),b.removeEventListener("copy",$),g.removeEventListener("paste",v,!0),g.removeEventListener("focusout",S),b.removeEventListener("pointerdown",H,!0)}},[t]),(0,de.jsxs)("div",{ref:r,className:c?"dshBetter_railHost":"dshBetter_railHostEmpty",children:[(0,de.jsx)(e,{...n}),a!==null&&(0,de.jsx)("div",{className:"dshBetter_attachNotice",role:"status",children:a})]})}function zo(e,n){return Q(e)?n("attach.pasteBusy"):void 0}function $o(e,n,t,r){let o=e.attachments??[],i=[],a=0;for(let l of o){let c=n.pathOf(l.file);c===""?a+=1:i.push(c)}i.length>0&&globalThis.navigator?.clipboard?.writeText(rn("",i)).catch(()=>{t(r("attach.copyFailed"))}),a>0&&t(r("attach.copySkipped",{count:String(a)}))}function Rt(e,n,t,r,o){let i=n();if(an(i,e.text),e.attachments.length===0)return;let a=t.reader(),l=i.sessionId;if(a===void 0||l===void 0){an(i,e.attachments.map(s=>s.path).join(`
`));return}let c=(i.attachments??[]).map(s=>t.pathOf(s.file)).filter(s=>s!==""),{accepted:d}=Tt(e.attachments,c);d.length!==0&&(async()=>{let s=[],u=[],f=0;for(let g of d){let b=await Uo(a,l,g);b.kind==="file"?s.push(b.file):b.kind==="mention"?u.push(b.mention):f+=1}let p=n();u.length>0&&an(p,u.join(" ")),s.length>0&&p.onAddFiles?.(s),f>0&&r(o("attach.pasteMissing",{count:String(f)})),u.length>0&&r(o("attach.pasteReferenced",{count:String(u.length)}))})()}function an(e,n){if(n==="")return;let t=e.inputActions,r=t?.captureInsertion?.();t?.insertText===void 0||r===void 0||t.insertText(n,r)}async function Uo(e,n,t){let r=await e.readBytes?.(n,t.path,{});if(r!==void 0&&r.ok)return{kind:"file",file:new File([r.value.data],t.name,{type:t.type})};let o=await e.stat?.(n,t.path);return o!==void 0&&o.ok?{kind:"mention",mention:qo(t.path)}:{kind:"missing"}}function Vo(e){let n=e.querySelector("img")?.parentElement;if(n!=null)return n;let t=e.firstElementChild;return t instanceof HTMLElement?t:null}function qo(e){return Ho.test(e)?`@"${e}"`:`@${e}`}var jo="better.focusComposer",Ko=Object.freeze(["focus input","focus composer","message input"]),be="command.focusComposer",Go=Object.freeze(["page","editable","terminal"]),Yo=Object.freeze({"desktop:macos":{code:"Space",modifiers:["primary"]},"desktop:windows":{code:"Space",modifiers:["primary","shift"]},"web:macos":{code:"Space",modifiers:["primary","shift"]},"web:windows":{code:"Space",modifiers:["primary","shift"]}}),Jo="[data-composer-input], [role='textbox'][aria-multiline='true']";function Ot(e){return e===void 0||typeof e.querySelector!="function"?!1:e.querySelector(Jo)!=null}function sn(e,n){if(e===null||typeof e!="object")return;let t=e.get;if(typeof t=="function"){let r=t.call(e,n);return r===null?void 0:r}return e[n]}var Pt=e=>typeof e=="string"&&e!==""?e:void 0;function It(e){let t=sn(e,"uiSession")?.adapter?.current?.getSnapshot?.();if(t!==void 0)return Pt(t.key);let r=sn(e,"sessions");return Pt(r?.list?.getSnapshot?.()?.current)}function Nt(e,n){try{let t=e.sessions?.scope?.(n);if(t===void 0)return!1;let o=sn(t,"conversation")?.input?.for?.(t);return o===void 0||typeof o.focus!="function"?!1:(o.focus(),!0)}catch{return!1}}function Xo(e){return(n={})=>{if(n.modal!=null)return{status:"pass"};if(!e.composerMounted())return{status:"pass"};let t=e.currentSessionId();return t===void 0?{status:"pass"}:{status:"handled",run:()=>{e.focusComposer(t)}}}}function Zo(e,n){return{id:jo,label:n,aliases:Ko,defaults:Yo,regions:Go,modals:[],resolve:Xo(e)}}function Dt(e,n,t,r){if(e===void 0||typeof e.register!="function")return()=>{};try{return e.register(Zo(n,t))}catch(o){return r?.(o instanceof Error?o.message:String(o)),()=>{}}}var _t=Object.freeze({zh:{"overlay.aria":"\u9009\u62E9\u6A21\u578B","listbox.aria":"\u6A21\u578B\u5339\u914D\u9879","search.aria":"\u641C\u7D22\u4F9B\u5E94\u5546\u6216\u6A21\u578B","search.placeholder":"\u641C\u7D22\u4F9B\u5E94\u5546\u6216\u6A21\u578B\u2026","status.empty":"\u6CA1\u6709\u53EF\u7528\u7684\u6A21\u578B\u3002","status.applying":"\u6B63\u5728\u5207\u6362\u2026",retry:"\u91CD\u8BD5","trigger.selectAria":"\u9009\u62E9\u6A21\u578B","trigger.aria":"\u5F53\u524D\u6A21\u578B {model}\uFF0C\u70B9\u51FB\u5207\u6362","trigger.ariaEffort":"\u5F53\u524D\u6A21\u578B {model}\uFF0C\u63A8\u7406\u7B49\u7EA7 {effort}\uFF0C\u70B9\u51FB\u5207\u6362","trigger.fallback":"\u9009\u62E9\u6A21\u578B","trigger.loading":"\u52A0\u8F7D\u6A21\u578B\u2026",[be]:"\u805A\u7126\u8F93\u5165\u6846","attach.copySkipped":"{count} \u4E2A\u9644\u4EF6\u6765\u81EA\u526A\u8D34\u677F\u3001\u6CA1\u6709\u672C\u5730\u8DEF\u5F84\uFF0C\u672A\u590D\u5236","attach.pasteMissing":"{count} \u4E2A\u9644\u4EF6\u5BF9\u5E94\u7684\u6587\u4EF6\u5DF2\u4E0D\u5B58\u5728\uFF0C\u672A\u7C98\u8D34","attach.pasteReferenced":"{count} \u4E2A\u9644\u4EF6\u8D85\u51FA\u5355\u6B21\u8BFB\u53D6\u4E0A\u9650\uFF0C\u5DF2\u6539\u4E3A\u8DEF\u5F84\u5F15\u7528","attach.copyFailed":"\u6D4F\u89C8\u5668\u62D2\u7EDD\u4E86\u8FD9\u6B21\u526A\u8D34\u677F\u5199\u5165","attach.pasteBusy":"\u6D88\u606F\u6B63\u5728\u53D1\u9001\uFF0C\u7A0D\u540E\u518D\u7C98\u8D34","compaction.reading":"\u538B\u7F29 {count} \u6B21","compaction.readingOne":"\u538B\u7F29 1 \u6B21","compaction.tooltip":"\u672C\u4F1A\u8BDD\u4E0A\u4E0B\u6587\u5DF2\u538B\u7F29 {count} \u6B21","compaction.tooltipWithFailures":"\u672C\u4F1A\u8BDD\u4E0A\u4E0B\u6587\u5DF2\u538B\u7F29 {count} \u6B21\uFF0C\u53E6\u6709 {failures} \u6B21\u538B\u7F29\u5931\u8D25","tabs.nav":"Tab \u7BA1\u7406","tabs.heading":"Tab \u7BA1\u7406","tabs.empty":"\u8FD8\u6CA1\u6709\u63D2\u4EF6\u6CE8\u518C\u4F1A\u8BDD\u6807\u7B7E\u3002","tabs.show":"\u5728\u6807\u7B7E\u680F\u663E\u793A{label}","tabs.hide":"\u4ECE\u6807\u7B7E\u680F\u9690\u85CF{label}","alias.nav":"\u6280\u80FD\u522B\u540D","alias.heading":"\u6280\u80FD\u522B\u540D","alias.prefix.title":"\u9700\u8981\u659C\u6760\u524D\u7F00","alias.prefix.on":"\u6253\u5F00\u5219\u9700\u8981\u8F93\u5165 \u201C/\u201D \u8FDB\u884C\u5339\u914D","alias.prefix.off":"\u6253\u5F00\u5219\u65E0\u9700\u8F93\u5165 \u201C/\u201D \u8FDB\u884C\u5339\u914D","alias.table.keyword":"\u5173\u952E\u8BCD","alias.table.target":"\u6280\u80FD\u6216\u547D\u4EE4","alias.table.params":"\u53C2\u6570","alias.table.paramsPlaceholder":"\u53EF\u9009\uFF0C\u5982 run","alias.table.actions":"\u64CD\u4F5C","alias.add":"\u6DFB\u52A0\u522B\u540D","alias.remove":"\u5220\u9664\u522B\u540D {keyword}","alias.unnamed":"\uFF08\u672A\u547D\u540D\uFF09","alias.empty":"\u8FD8\u6CA1\u6709\u522B\u540D\u3002\u4F8B\u5982\uFF1Awf \u2192 /flow-workflow run","alias.footnote":"\u8F93\u5165\u5173\u952E\u8BCD\u540E\u4ECE\u9762\u677F\u9009\u62E9\u5373\u53EF\u63D2\u5165\u5B8C\u6574\u8C03\u7528\uFF1B\u6539\u5B8C\u7ACB\u5373\u751F\u6548\u3002","alias.menu.section":"\u6280\u80FD\u522B\u540D","alias.menu.params":"\u53C2\u6570\uFF1A{value}","skill.metadata":"\u5143\u6570\u636E","skill.path":"\u5730\u5740","skill.usage.session":"\u672C\u4F1A\u8BDD\u8C03\u7528","skill.usage.workspace":"\u672C\u5DE5\u4F5C\u533A\u8C03\u7528","skill.params":"\u53C2\u6570","skill.hint.insert":"\u70B9\u51FB\u63D2\u5165","continue.label":"\u7EE7\u7EED","continue.sending":"\u7EE7\u7EED\u4E2D\u2026","link.copy":"\u590D\u5236","link.copied":"\u5DF2\u590D\u5236","link.copyFailed":"\u590D\u5236\u5931\u8D25","link.copyAria":"\u590D\u5236\u94FE\u63A5\u5730\u5740"},en:{"overlay.aria":"Select a model","listbox.aria":"Matching models","search.aria":"Search providers or models","search.placeholder":"Search providers or models\u2026","status.empty":"No models available.","status.applying":"Switching\u2026",retry:"Retry","trigger.selectAria":"Select model","trigger.aria":"Current model {model}, click to change","trigger.ariaEffort":"Current model {model}, reasoning effort {effort}, click to change","trigger.fallback":"Select model","trigger.loading":"Loading models\u2026",[be]:"Focus message input","attach.copySkipped":"{count} attachment(s) came from the clipboard with no local path and were not copied","attach.pasteMissing":"{count} attachment(s) no longer exist and were not pasted","attach.pasteReferenced":"{count} attachment(s) exceed the read limit and became path references","attach.copyFailed":"The browser refused this clipboard write","attach.pasteBusy":"A message is being sent; paste again in a moment","compaction.reading":"{count} compactions","compaction.readingOne":"1 compaction","compaction.tooltip":"This session's context was compressed {count} time(s)","compaction.tooltipWithFailures":"This session's context was compressed {count} time(s), with {failures} failed attempt(s)","tabs.nav":"Tabs","tabs.heading":"Tabs","tabs.empty":"No plugin has registered a conversation tab yet.","tabs.show":"Show {label} in the tab bar","tabs.hide":"Hide {label} from the tab bar","alias.nav":"Skill aliases","alias.heading":"Skill aliases","alias.prefix.title":"Require a slash prefix","alias.prefix.on":"To open, type \u201C/\u201D to match","alias.prefix.off":"To open, type the keyword without \u201C/\u201D to match","alias.table.keyword":"Keyword","alias.table.target":"Skill or command","alias.table.params":"Arguments","alias.table.paramsPlaceholder":"Optional, e.g. run","alias.table.actions":"Actions","alias.add":"Add alias","alias.remove":"Delete alias {keyword}","alias.unnamed":"(unnamed)","alias.empty":"No aliases yet. For example: wf \u2192 /flow-workflow run","alias.footnote":"Type a keyword and pick from the panel to insert the full invocation; changes apply immediately.","alias.menu.section":"Skill aliases","alias.menu.params":"args: {value}","skill.metadata":"Metadata","skill.path":"Path","skill.usage.session":"This session","skill.usage.workspace":"This workspace","skill.params":"Arguments","skill.hint.insert":"Click to insert","continue.label":"Continue","continue.sending":"Continuing\u2026","link.copy":"Copy","link.copied":"Copied","link.copyFailed":"Copy failed","link.copyAria":"Copy link address"}});var Mt="dsh-better-effort",Qo=`
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
`;function Ft(e){if(e===void 0)return()=>{};if(e.getElementById(Mt)!==null)return()=>{};let n=e.createElement("style");return n.id=Mt,n.textContent=Qo,e.head.append(n),()=>{n.remove()}}var Wt="dsh-better.layout-widths",ue=Object.freeze({sidebar:null,rightbar:null});function zt(e){return typeof e=="number"&&Number.isFinite(e)&&e>0}function Ne(e){if(e===void 0)return ue;let n;try{n=e.getItem(Wt)}catch{return ue}if(n===null||n==="")return ue;let t;try{t=JSON.parse(n)}catch{return ue}if(typeof t!="object"||t===null||Array.isArray(t))return ue;let r=t;return{sidebar:Bt(r.sidebar),rightbar:Bt(r.rightbar)}}function $t(e,n){if(e===void 0)return;let t={};n.sidebar!==null&&(t.sidebar=Math.round(n.sidebar)),n.rightbar!==null&&(t.rightbar=Math.round(n.rightbar));try{e.setItem(Wt,JSON.stringify(t))}catch{}}function Bt(e){return zt(e)?Math.round(e):null}function Ut(e){if(typeof e!="string")return ue;let n=e.trim().split(/\s+/).filter(t=>t!=="");return{sidebar:Ht(n[0]),rightbar:Ht(n[2])}}function Ht(e){if(e===void 0)return null;let n=/^([0-9]+(?:\.[0-9]+)?)px$/.exec(e);if(n===null)return null;let t=Number(n[1]);return zt(t)?Math.round(t):null}function Vt(e,n,t=null){return t==="sidebar"?n.sidebar!==null&&n.sidebar!==e.sidebar?{sidebar:n.sidebar}:{}:t==="rightbar"?n.rightbar!==null&&n.rightbar!==e.rightbar?{rightbar:n.rightbar}:{}:n.sidebar!==null&&n.sidebar!==e.sidebar?{sidebar:n.sidebar}:n.rightbar!==null&&n.rightbar!==e.rightbar?{rightbar:n.rightbar}:{}}function qt(e,n){return{sidebar:n.sidebar??e.sidebar,rightbar:n.rightbar??e.rightbar}}function jt(e){let n=[];return e.sidebar!==null&&n.push({column:"sidebar",width:e.sidebar}),e.rightbar!==null&&n.push({column:"rightbar",width:e.rightbar}),n}var ei="[data-shell-bottom]",ni="[data-side]",ti='[class*="_sidebarCol"]',ri='[class*="_rightbarCol"]',oi=600;function ii(e){let t=e?.layout?.panels;if(typeof t!="object"||t===null)return;let r=t;if(!(typeof r.setSidebar!="function"&&typeof r.setRightbar!="function"))return r}function Yt(e,n){let t=ii(e);if(t===void 0)return!1;let r=!1;for(let{column:o,width:i}of jt(n)){let a=o==="sidebar"?t.setSidebar:t.setRightbar;if(a!==void 0)try{a.call(t,i),r=!0}catch{}}return r}function Kt(e){return e.querySelector(ei)?.parentElement??null}function ai(e,n){let t=e.hasAttribute("data-sidebar-collapsed"),r=e.hasAttribute("data-rightbar-collapsed"),o=Ut(n?.getComputedStyle(e).gridTemplateColumns);return{sidebar:t?null:o.sidebar??Gt(e.querySelector(ti)),rightbar:r?null:o.rightbar??Gt(e.querySelector(ri))}}function Gt(e){if(e===null)return null;let n=e.getBoundingClientRect().width;return Number.isFinite(n)&&n>0?Math.round(n):null}function Jt(e){let{document:n,storage:t}=e,r=null,o=null,i=0,a=!1,l=null,c=()=>n.defaultView,d=()=>(r!==null&&r.isConnected||(r=Kt(n)),r),s=()=>{let h=d();return h===null?null:ai(h,c())},u=h=>{let w=h?.getAttribute("data-side");return w==="sidebar"||w==="rightbar"?w:null},f=h=>{let w=s();if(w===null)return;let I=Vt(h.before,w,h.side);I.sidebar===void 0&&I.rightbar===void 0||$t(t,qt(Ne(t),I))},p=h=>{if(l!==null)return;let w=h.target,I=typeof w?.closest=="function"?w.closest(ni):null;if(I===null)return;let P=s();P!==null&&(l={side:u(I),before:P})},g=()=>{let h=l;if(l=null,h===null)return;let w=c()?.requestAnimationFrame;if(w===void 0){f(h);return}w.call(c(),()=>f(h))},b=()=>{if(o=null,a)return;let h=Kt(n);if(h!==null){r=h;return}if(i>=oi)return;i+=1;let w=c()?.requestAnimationFrame;w!==void 0&&(o=w.call(c(),b))};return{attach(){a=!1,i=0;let h=c();return h?.addEventListener("pointerdown",p,!0),h?.addEventListener("pointerup",g,!0),h?.addEventListener("pointercancel",g,!0),b(),()=>{a=!0,l=null,r=null,h?.removeEventListener("pointerdown",p,!0),h?.removeEventListener("pointerup",g,!0),h?.removeEventListener("pointercancel",g,!0),o!==null&&h?.cancelAnimationFrame(o),o=null}}}}var Xt="sessionCompaction";var Zt="dsh-better-compaction",De="dshBetter_compactionStat",si=`
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
`;function Qt(e){if(e===void 0)return()=>{};if(e.getElementById(Zt)!==null)return()=>{};let n=e.createElement("style");return n.id=Zt,n.textContent=si,e.head.append(n),()=>{n.remove()}}var nr=require("react/jsx-runtime");function li(e,n){if(e===void 0||n===void 0)return null;let{compactions:t,failures:r}=e;if(!Number.isSafeInteger(t)||t<=0)return null;let o=t===1?n("compaction.readingOne"):n("compaction.reading",{count:t}),i=Number.isSafeInteger(r)&&r>0?n("compaction.tooltipWithFailures",{count:t,failures:r}):n("compaction.tooltip",{count:t});return{text:o,tooltip:i}}function di(){}function er({useProjection:e,t:n}){let r=li((e??di)(Xt),n);return r===null?null:(0,nr.jsx)("span",{className:De,"data-dsh-better":"compaction-stat",title:r.tooltip,children:r.text})}var ln="conversation.composer.dock",tr="better-compaction";var fn=require("react");var rr="continue",dn="conversation.chat.turnTail",or="better-continue";var ui=new Set(["aborted","interrupted"]);function ir(e){let n=e.end?.reason?.kind;return n===void 0||!ui.has(n)?!1:e.latest&&!e.pending}var ar="dsh-better-continue",ce="dshBetter_continue",un="dshBetter_continueError",ci=`
.${ce} {
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

.${ce}:hover:not(:disabled) {
  background: var(--dsw-alias-interactive-bg-hover);
  color: var(--dsw-alias-label-primary);
  border-color: var(--dsw-alias-border-l1);
}

.${ce}:focus-visible {
  outline: 1px solid var(--dsw-alias-border-l1);
  outline-offset: 1px;
}

/* Disabled covers both halves of the pressed state: the request is in flight, so
   the button must not invite a second one, and the dimming is what says so. */
.${ce}:disabled {
  cursor: default;
  opacity: 0.6;
}

/* The failure line sits under the button in the same column. It is a sibling
   rather than a wrapper so the button keeps its own alignment. */
.${un} {
  align-self: flex-end;
  color: var(--dsw-alias-state-business-primary);
  font-size: var(--dsh-content-font-size-secondary, 13px);
  line-height: calc(20px + var(--dsh-content-font-delta-secondary, 0px));
}
`;function sr(e){if(e===void 0)return()=>{};if(e.getElementById(ar)!==null)return()=>{};let n=e.createElement("style");return n.id=ar,n.textContent=ci,e.head.append(n),()=>{n.remove()}}var re=require("react/jsx-runtime");function fi(e){return e instanceof Error?e.message:String(e)}function pi(e,n){return e.length>0&&e[e.length-1]===n}function cn(){}function lr({turn:e,sessionId:n,useChat:t,useSession:r,useInput:o,t:i,submitContinue:a}){let l=t??cn,c=r??cn,d=o??cn,s=l(E=>E),u=c(E=>E),f=d(E=>E),[p,g]=(0,fn.useState)(!1),[b,h]=(0,fn.useState)(null),w=e!==void 0&&pi(s?.timeline.turnOrder??[],e.turn),I=(u?.pendingSubmissions?.length??0)>0||Q(f?.phase);return e===void 0||n===void 0||a===void 0||i===void 0||!ir({end:e.end?.data,latest:w,pending:I})?null:(0,re.jsxs)(re.Fragment,{children:[(0,re.jsx)("button",{type:"button",className:ce,"data-testid":"better-continue",disabled:p,onClick:()=>{g(!0),h(null),a(n).catch(E=>{g(!1),h(fi(E))})},children:i(p?"continue.sending":"continue.label")}),b===null?null:(0,re.jsx)("span",{className:un,role:"alert",children:b})]})}var pn="dsh-better-link-hover",G="dshBetter_linkHover",_e="dshBetter_linkHoverAddress",fe="dshBetter_linkHoverCopy",dr=`
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
.${fe} {
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
.${fe}:hover {
  background: var(--dsw-alias-interactive-bg-hover);
  color: var(--dsw-alias-label-primary);
}
.${fe}:focus-visible {
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
`;function ur(e){if(e===void 0)return()=>{};if(e.getElementById(pn)!==null)return()=>{};let n=e.createElement("style");return n.id=pn,n.textContent=dr,e.head.append(n),()=>{n.remove()}}var mi=1200,gi=300,cr=8,oe=8,hi='[data-slot="conversation.chat.flow"], [data-message-bubble]';function yi(e){let n=e.trim();if(n===""||n.startsWith("#"))return!1;let t=n.replace(/[\t\n\r]/gu,"").slice(0,11).toLowerCase();return!(t.startsWith("javascript:")||t.startsWith("data:"))}function bi(e,n,t){let r=Math.max(oe,Math.min(e.left,t.width-oe-n.width)),o=e.bottom+cr,i=e.top-cr-n.height,a=t.height-oe*2,l;return n.height<=a&&o+n.height<=t.height-oe?l=o:n.height<=a&&i>=oe?l=i:l=Math.max(oe,Math.min(o,t.height-oe-n.height)),{left:r,top:l}}async function ki(e,n){let t=n.defaultView?.navigator.clipboard;if(t!==void 0)try{return await t.writeText(e),!0}catch{}return wi(e,n)}function wi(e,n){if(typeof n.execCommand!="function")return!1;let t=n.createElement("textarea");t.value=e,t.setAttribute("readonly",""),t.style.position="fixed",t.style.top="-1000px",t.style.opacity="0",n.body.append(t);try{return t.select(),n.execCommand("copy")}catch{return!1}finally{t.remove()}}function fr(e,n){let t=e.defaultView;if(t===null)return()=>{};if(t.matchMedia?.("(hover: none)")?.matches===!0)return()=>{};let r=ur(e),o=null,i=null,a=null,l=null,c=null,d=null,s=()=>{d!==null&&(clearTimeout(d),d=null)},u=()=>{if(o!==null)return o;let v=e.createElement("div");v.className=G,v.setAttribute("role","tooltip"),v.hidden=!0;let S=e.createElement("span");S.className=_e;let m=e.createElement("button");return m.className=fe,m.type="button",m.setAttribute("aria-label",n.translate("link.copyAria")),m.textContent=n.translate("link.copy"),m.addEventListener("click",O=>{O.preventDefault(),O.stopPropagation();let N=l?.href;N!==void 0&&ki(N,e).then(M=>{m.textContent=n.translate(M?"link.copied":"link.copyFailed"),c!==null&&clearTimeout(c),c=setTimeout(()=>{c=null,m.textContent=n.translate("link.copy")},mi)})}),v.append(S,m),e.body.append(v),o=v,i=S,a=m,v},f=v=>{let S=u(),m=v.getBoundingClientRect(),O=S.getBoundingClientRect(),N=bi({left:m.left,top:m.top,right:m.right,bottom:m.bottom},{width:O.width,height:O.height},{width:t.innerWidth,height:t.innerHeight});S.style.left=`${N.left}px`,S.style.top=`${N.top}px`},p=()=>{l=null,s(),c!==null&&(clearTimeout(c),c=null),a!==null&&(a.textContent=n.translate("link.copy")),o!==null&&(o.hidden=!0)},g=(v,S)=>{let m=u();l={anchor:v,href:S},i!==null&&(i.textContent=S),m.hidden=!1,f(v)},b=v=>{if(!(v instanceof t.Element))return;let S=v.closest("a");if(S===null||S.closest(hi)===null)return;let m=S.getAttribute("href");if(m!==null&&yi(m))return{anchor:S,href:m.trim()}},h=v=>o!==null&&v instanceof t.Node&&o.contains(v),w=v=>{if(h(v.target)){s();return}let S=b(v.target);S!==void 0&&(s(),g(S.anchor,S.href))},I=v=>{if(l===null)return;let S=v.relatedTarget;if(h(S)||S instanceof t.Node&&l.anchor.contains(S))return;let m=v.target;if(m instanceof t.Node){if(l.anchor.contains(m)){s(),d=setTimeout(()=>{d=null,p()},gi);return}h(m)&&p()}},P=v=>{let S=b(v.target);S!==void 0&&g(S.anchor,S.href)},E=v=>{if(l===null)return;let S=v.relatedTarget;h(S)||S instanceof t.Node&&l.anchor.contains(S)||p()},H=v=>{v.key==="Escape"&&l!==null&&p()},$=v=>{h(v.target)||p()};return e.addEventListener("mouseover",w,!0),e.addEventListener("mouseout",I,!0),e.addEventListener("focusin",P,!0),e.addEventListener("focusout",E,!0),e.addEventListener("keydown",H,!0),e.addEventListener("scroll",$,!0),()=>{e.removeEventListener("mouseover",w,!0),e.removeEventListener("mouseout",I,!0),e.removeEventListener("focusin",P,!0),e.removeEventListener("focusout",E,!0),e.removeEventListener("keydown",H,!0),e.removeEventListener("scroll",$,!0),s(),c!==null&&(clearTimeout(c),c=null),o?.remove(),o=null,i=null,a=null,l=null,r()}}function xi(e){return typeof e=="object"&&e!==null&&"ok"in e&&e.ok===!1}async function pr(e,n){let t=e.sessions?.binding?.(n)?.session,r=t?.prompt;if(typeof r!="function")throw new Error("\u8FD9\u4E2A\u5BBF\u4E3B\u7684\u4F1A\u8BDD\u4E0D\u652F\u6301\u53D1\u9001\u6D88\u606F");let o=await r.call(t,[{type:"text",text:rr}],"queue");if(xi(o))throw new Error("\u7EE7\u7EED\u6D88\u606F\u6CA1\u6709\u88AB\u5BBF\u4E3B\u63A5\u53D7")}var ke=require("react");function vi(e){let n=e.name.trim();return n===""?e.id:n}function mn(e,n){if(e===void 0)return{model:n};let t=vi(e.group),r=e.model.name.trim();return r===""?{model:t}:{provider:t,model:r}}function mr(e,n){let t=mn(e,n);return t.provider===void 0?t.model:`${t.provider} ${t.model}`}function Si(e){return typeof e=="string"?e:e.en??""}function Me(e,n){if(e!==void 0)try{return e(n)}catch{}return Si(n)}var B=require("react/jsx-runtime"),Ci="@deepseek-ai/dsh-client-ui-model-selection/ModelSelect.module.css";function Li(e){if(e===void 0)return;let t=e.querySelector(`style[data-plugin-css="${Ci}"]`)?.textContent??"",r=a=>new RegExp(`\\.(\\w+_${a})\\{`,"u").exec(t)?.[1],o={root:r("root"),trigger:r("trigger"),triggerIcon:r("triggerIcon"),triggerLabel:r("triggerLabel"),triggerEffort:r("triggerEffort"),chevron:r("chevron")};for(let a of Object.values(o))if(a===void 0)return;let i=r("badge");return{...o,...i===void 0?{}:{badge:i}}}function gr(e){let n=Ie(e.load),t=Li(e.document);function r(o){let i=e.native();return o.available===!1||i===void 0||t===void 0?i===void 0?null:(0,B.jsx)(i,{...o}):(0,B.jsx)(Ei,{props:o,primitives:n,openPicker:e.openPicker,translate:e.translate,classes:t})}return r}function Ei({props:e,primitives:n,openPicker:t,translate:r,classes:o}){let{directory:i,t:a,sessionId:l,locked:c,resolveText:d}=e,s=Ti(i),u=a??r(),f=s?.current??null,p=f===null&&s?.status==="loading",g=Ri(s,f),b=u?.("trigger.fallback")??"",h=mr(g,b),w=mn(g,b),I=Ai(g,d),P=p?u?.("trigger.loading")??"":h,E=Pi(s,f,g,u),H=E===void 0?P:`${P} \xB7 ${E}`,$=p?u?.("trigger.loading")??"":f===null?u?.("trigger.selectAria")??"":E===void 0?u?.("trigger.aria",{model:P})??"":u?.("trigger.ariaEffort",{model:P,effort:E})??"",v=()=>{t(l)},S=n.IconDataOutlineRegular,m=n.IconChevronDownOutlineRegular,O=n.Tag,N=o.badge;return(0,B.jsx)("div",{className:o.root,"data-dsh-better-seat":"",children:(0,B.jsxs)("button",{type:"button",className:o.trigger,"aria-label":$,"aria-haspopup":"dialog","aria-expanded":"false",title:H,disabled:c,onClick:v,children:[S===void 0?null:(0,B.jsx)(S,{className:o.triggerIcon,size:16}),(0,B.jsx)("span",{className:o.triggerLabel,"data-provider-id":f?.provider,"data-model-id":f?.model,children:p?P:(0,B.jsxs)(B.Fragment,{children:[w.provider===void 0?null:`${w.provider} `,I===void 0||N===void 0||O===void 0?null:(0,B.jsxs)(B.Fragment,{children:[(0,B.jsx)(O,{className:N,tone:I.tone,children:I.text})," "]}),w.model]})}),E!==void 0&&(0,B.jsx)("span",{className:o.triggerEffort,children:E}),m===void 0?null:(0,B.jsx)(m,{className:o.chevron})]})})}function Ti(e){let n=(0,ke.useCallback)(r=>e===void 0?()=>{}:e.subscribe(r),[e]),t=(0,ke.useCallback)(()=>e?.getSnapshot(),[e]);return(0,ke.useSyncExternalStore)(n,t)}function Ri(e,n){if(!(e===void 0||n===null||n===void 0)){for(let t of e.groups)if(t.id===n.provider){for(let r of t.models)if(r.id===n.model)return{group:t,model:r}}}}function Ai(e,n){let t=e?.model.badge;if(t===void 0)return;let r=Me(n,t.text);if(r!=="")return{text:r,tone:t.tone}}function Pi(e,n,t,r){if(e===void 0||n===null||n===void 0)return;let o=t?.model.reasoning,i=n.reasoningEffort??o?.defaultEffort;return t===void 0?e.retainedEffort:o===void 0||i===void 0?void 0:o.efforts?.find(l=>l.id===i)?.name??i}function hr(e){let r=e?.live?.contributions?.get("model")?.ui;return r==null?void 0:r.kind==="popupSelect"?r:void 0}function yr(e){return{sessionId:e}}function br(){return{via:"enter",token:""}}var Oi=`
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
`,kr="dsh-better/tabs.css";function wr(e){let n=`style[data-plugin-css=${JSON.stringify(kr)}]`;if(e.querySelector(n)!==null)return()=>{};let t=e.createElement("style");return t.dataset.plugin="dsh-better",t.dataset.pluginCss=kr,t.textContent=Oi,e.head.append(t),()=>t.remove()}function xr(e){let n;return e.React.createElement("section",{"data-dsh-better-tabs":"",ref:t=>{if(n?.(),n=void 0,t===null)return;let r=()=>{Ii(t,e)};r(),n=e.controller.subscribe(r)}})}function Ii(e,n){let t=e.ownerDocument,{controller:r,copy:o}=n;e.replaceChildren();let i=t.createElement("h2");i.setAttribute("data-dsh-better-tabs-heading",""),i.textContent=o.heading,e.append(i);let a=r.rows();if(a.length===0){let l=t.createElement("p");l.setAttribute("data-dsh-better-tabs-empty",""),l.textContent=o.empty,e.append(l);return}for(let l of a){let c=t.createElement("label");c.setAttribute("data-dsh-better-tabs-row",l.id);let d=t.createElement("span");d.setAttribute("data-dsh-better-tabs-name",""),d.textContent=l.label;let s=t.createElement("input");s.setAttribute("data-dsh-better-tabs-check",l.id),s.type="checkbox",s.checked=l.enabled,s.setAttribute("aria-label",o.checkboxLabel(l.label,l.enabled)),s.addEventListener("change",()=>{r.setEnabled(l.id,s.checked)}),c.append(d,s),e.append(c)}}var gn="conversation.view",hn="settings.section",Sr="tabs";var Be="chat",Cr="dsh-better.tabs",we="[data-conversation-tabs]";function Lr(e,n){if(typeof e=="string"&&e!=="")return e;if(typeof e=="function")try{let t=e();if(typeof t=="string"&&t!=="")return t}catch{}return n}function Ni(e){if(e===void 0)return new Set;let n;try{n=e.getItem(Cr)}catch{return new Set}if(n===null||n==="")return new Set;try{let t=JSON.parse(n);if(!Array.isArray(t))return new Set;let r=new Set;for(let o of t)typeof o=="string"&&o!==""&&o!==Be&&r.add(o);return r}catch{return new Set}}function Di(e,n){if(e!==void 0)try{e.setItem(Cr,JSON.stringify([...n].sort()))}catch{}}function _i(e,n){let t=[],r=new Set;for(let o of e){let i=o.options.id;i===void 0||i===Be||r.has(i)||(r.add(i),t.push({id:i,label:Lr(o.options.label,i),enabled:!n.has(i)}))}return t}function Mi(e){let n=[],t=new Set;for(let r of e){let o=r.options.id;o===void 0||o===Be||t.has(o)||(t.add(o),n.push({id:o,label:Lr(r.options.label,o)}))}return n}function Fi(e,n,t){let r=new Set;for(let o of Mi(e)){if(!n.has(o.id)||o.label==="")continue;t.filter(a=>a.label===o.label).length===1&&r.add(o.label)}return t.map(o=>r.has(o.label))}function Bi(e,n){for(let t of e)if(n!==null&&(t.target===n||n.contains?.(t.target)===!0)||vr(t.addedNodes,n)||vr(t.removedNodes,n))return!0;return!1}function vr(e,n){if(e===void 0)return!1;for(let t=0;t<e.length;t+=1){let r=e[t];if(r!==void 0&&(r.matches?.(we)===!0||r.querySelector?.(we)!=null||n!==null&&r.contains?.(n)===!0))return!0}return!1}function Hi(e){let n=e.querySelector(we);if(n===null||typeof n!="object")return;let r=n.querySelectorAll?.(":scope > button[role='tab']");if(r===void 0)return;let o=[];for(let i=0;i<r.length;i+=1){let a=r[i];a!==void 0&&o.push({label:Wi(a),hidden:a.hasAttribute(Fe),mark:l=>{l?a.setAttribute(Fe,""):a.removeAttribute(Fe)}})}return o}function Wi(e){return(e.querySelector?.("[class*='tabLabel']")?.textContent??e.textContent??"").trim()}function zi(e,n){let t=!1;for(let[r,o]of e.entries()){let i=n[r]??!1;i!==o.hidden&&(o.mark(i),t=!0)}return t}function Er(e){let{ledger:n,storage:t}=e,r=e.readButtons??Hi,o=e.watch??Vi,i=new Set(Ni(t)),a=new Set,l,c=()=>{for(let s of[...a])s()},d=30;return{rows:()=>_i(n.entriesOfSlot(gn),i),setEnabled(s,u){if(s===Be)return!1;let f=i.has(s);return u===!f?!1:(u?i.delete(s):i.add(s),Di(t,i),l?.(),c(),!0)},subscribe(s){return a.add(s),()=>{a.delete(s)}},attach(s){let u=s.createElement("style");u.dataset.plugin="dsh-better",u.dataset.pluginCss=$i,u.textContent=Ui,s.head.append(u);let f=s.defaultView?.requestAnimationFrame?.bind(s.defaultView),p=s.defaultView?.cancelAnimationFrame?.bind(s.defaultView),g=f===void 0?0:d,b,h=()=>{let P=n.entriesOfSlot(gn),E=r(s);if(E===void 0||E.length===0){g>0&&f!==void 0&&(g-=1,b=f(()=>h()));return}g=d,b=void 0,zi(E,Fi(P,i,E))},w=n.subscribe(gn,h),I=o(s,h);return l=h,h(),()=>{w(),I(),l=void 0,b!==void 0&&p?.(b),u.remove()}}}}var $i="dsh-better/strip.css",Fe="data-dsh-better-tab-hidden",Ui=`${we} > button[${Fe}] { display: none; }`;function Vi(e,n){let t=e.defaultView?.MutationObserver,r=e.documentElement;if(t===void 0||r===void 0)return()=>{};let o=new t(i=>{let a=e.querySelector(we);Bi(i,a!==null&&typeof a=="object"?a:null)&&n()});return o.observe(r,{childList:!0,subtree:!0}),()=>o.disconnect()}var ie="conversation.input.overlay",Tr="settings.section",Gi="aliases",Yi=56,Ji="alias-watcher",Pr=50,Xi="skill-enhancer",Zi=Pr+1,yn="conversation.input.model",bn="conversation.input.attachments",Qi=-50,ea=-60,Or="command-popup",na=-100,z="better",ta="/better/api/skill-profile",ra=5e3,He=null;function Ir(e,n){let t,r=Number.POSITIVE_INFINITY;for(let o of e){if(o.options.id!==Or)continue;let i=o.component;if(typeof i!="function"||n!==void 0&&i===n)continue;let a=o.options.priority??0;a<r&&(t=i,r=a)}return t}var Nr={name:"dsh-better",inject:["slots","sessions","commandUi","conversation","locale","modelDirectories","remote","remote.session"],apply(e){let n=globalThis.document;e.effect(()=>e.locale.register(z,_t),"dsh-better: locale"),e.effect(()=>Ft(n),"dsh-better: effort badge stylesheet"),e.effect(()=>Qt(n),"dsh-better: compaction count stylesheet"),e.effect(()=>sr(n),"dsh-better: continue button stylesheet"),e.effect(()=>n===void 0?()=>{}:fr(n,{translate:Ar(e)}),"dsh-better: link address panel");let t=Ln(wn()),r=Ar(e),o={open:!1};e.effect(()=>{let d=wn(),s=Ne(d);e.inject?.(["layout"],p=>{Yt(p,s)});let f=(n===void 0?void 0:Jt({document:n,storage:d}))?.attach();return()=>{f?.()}},"dsh-better: panel width memory"),e.effect(()=>e.slots.inject(ln,()=>e.slots.register({name:ln,id:tr,order:-1,locale:z},er)),"dsh-better: compaction count"),e.effect(()=>e.slots.inject(dn,()=>kn(e.slots,{name:dn,id:or,order:20,locale:z,inject:d=>({submitContinue:s=>pr(e,s)})},lr)),"dsh-better: continue button"),e.effect(()=>e.slots.inject(ie,()=>{let d={},u=vt({load:He,native:()=>Ir(e.slots.entries(ie),d.component),document:n});return d.component=u,e.slots.register({name:ie,id:Or,priority:na,locale:z,inject:f=>{let p=da(e,f);return{popup:la(e,f),catalog:p?.groups,current:p?.current??null,selectModel:g=>e.modelDirectories?.directoryFor?.(f)?.select?.(g)}}},u)}),"dsh-better: /model provider search"),e.effect(()=>e.slots.inject(yn,()=>{let d={},u=gr({load:He,native:()=>xn(e.slots.entries(yn),d.component),openPicker:f=>aa(e,f),translate:()=>sa(e),document:n});return d.component=u,e.slots.register({name:yn,priority:Qi,locale:z,inject:f=>{let p=e.modelDirectories?.directoryFor?.(f),g=e.locale.resolveText;return{sessionId:f,available:!0,directory:p?.store,load:()=>{p?.load?.()},select:b=>p?.select?.(b),resolveText:b=>Me(g?.bind(e.locale),b),renderSlot:(b,h,w)=>w?.fallback??null}}},u)}),"dsh-better: composer model trigger");let i;e.inject?.(["remote.workspaceFiles"],d=>{i=d["remote.workspaceFiles"],d.effect(()=>()=>{i=void 0},"dsh-better: workspace file reader")}),e.effect(()=>e.slots.inject(bn,()=>{let d={},u=At({native:()=>xn(e.slots.entries(bn),d.component),pathOf:ua,reader:()=>i,translate:()=>e.locale.bind?.(z)});return d.component=u,e.slots.register({name:bn,priority:ea,locale:z,inject:f=>({sessionId:f,readFileDrag:oa(e),phase:()=>ia(e,f)?.getSnapshot().phase})},u)}),"dsh-better: composer attachment selection");let a;e.inject?.(["inputTriggers"],d=>{a=d.inputTriggers,d.effect(()=>()=>{a=void 0},"dsh-better: alias trigger service"),d.effect(()=>d.inputTriggers.registerSource(_n({config:()=>t.getSnapshot(),translate:r,bareMenuOpen:()=>o.open,routeCommand:(s,u)=>ma(e,u)})),"dsh-better: alias slash source")}),e.effect(()=>e.slots.inject(ie,()=>{let d=Wn({store:t,bareMenuOpen:o,inputStoreFor:s=>{let u=e.sessions.scope?.(s);if(!(u===void 0||e.conversation===void 0))try{return e.conversation.input?.for?.(u)?.state}catch{return}},controllerFor:s=>{let u=e.sessions.scope?.(s);if(u===void 0)return;let f=xe(e,"inputTriggers")??a;if(f!==void 0)try{return f.sessionOf(u)}catch{return}}});return kn(e.slots,{name:ie,id:Ji,order:Pr,inject:s=>({sessionId:s})},d)}),"dsh-better: alias selector watcher"),e.effect(()=>lt(n),"dsh-better: skill enhancer stylesheet");let l=ca(e);e.effect(()=>e.slots.inject(ie,()=>{let d=at({scopeFor:s=>e.sessions.scope?.(s),inputStoreFor:s=>{let u=e.sessions.scope?.(s);if(!(u===void 0||e.conversation===void 0))try{return e.conversation.input?.for?.(u)?.state}catch{return}},actionsFor:s=>{let u=e.sessions.scope?.(s);if(!(u===void 0||e.conversation===void 0))try{return e.conversation.input?.for?.(u)}catch{return}},skillNamesFor:l.names,loadProfile:async(s,u)=>fa(e,s,u,await l.pathOf(s,u)),loadUsage:(s,u)=>Dr(e,s,u),translate:r,document:n});return kn(e.slots,{name:ie,id:Xi,order:Zi,inject:s=>({sessionId:s})},d)}),"dsh-better: skill enhancer"),e.effect(()=>e.slots.inject(Tr,()=>{let d=n===void 0?void 0:Fn(n),s=Dn({store:t,translate:r}),u=Rr(e.slots,{name:Tr,id:Gi,order:Yi,label:()=>e.locale.bind?.(z)?.("alias.nav")??"Skill aliases",locale:z},s);return()=>{u(),d?.()}}),"dsh-better: alias settings page");let c=Er({ledger:pa(e.slots),storage:wn()});e.effect(()=>e.slots.inject(hn,()=>{let d=globalThis.document,s=d===void 0?void 0:wr(d),u=Rr(e.slots,{name:hn,id:Sr,order:55,label:()=>e.locale.bind?.(z)?.("tabs.nav")??"Tabs"},()=>{let f=ga(He);return f===null?null:xr({React:f,controller:c,copy:ha(e)})});return()=>{u(),s?.()}}),"dsh-better: tab management"),e.effect(()=>c.attach(n),"dsh-better: tab visibility"),e.inject?.(["shortcuts"],d=>{d.effect(()=>Dt(d.shortcuts,{currentSessionId:()=>It(e),composerMounted:()=>Ot(n),focusComposer:s=>Nt(e,s)},()=>e.locale.bind?.(z)?.(be)??"Focus message input",s=>console.warn(`dsh-better: focus command not registered (${s})`)),"dsh-better: focus composer shortcut")})}};function oa(e){return n=>xe(e,"fileDrag")?.read?.(n)}function ia(e,n){if(n===void 0)return;let t=e.sessions.scope?.(n);if(!(t===void 0||e.conversation===void 0))try{return e.conversation.input?.for?.(t)?.state}catch{return}}function xn(e,n){let t,r=Number.POSITIVE_INFINITY;for(let o of e){let i=o.component;if(typeof i!="function"||n!==void 0&&i===n)continue;let a=o.options.priority??0;a<r&&(t=i,r=a)}return t}function aa(e,n){if(n===void 0)return!1;let t=hr(e.commandUi);if(t===void 0)return!1;let r=e.sessions.scope?.(n);if(r===void 0)return!1;let o=e.commandUi.popupFor?.(r);return o===void 0||typeof o.open!="function"?!1:(o.open("model",t,yr(n),br()),!0)}function sa(e){return e.locale?.bind?.(z)}function la(e,n){let t=e.sessions.scope?.(n);if(t!==void 0)return e.commandUi.popupFor?.(t)}function da(e,n){return e.modelDirectories?.directoryFor?.(n)?.store.getSnapshot()}function ua(e){let n=globalThis.__DSH_HOST_PATHS__;if(n?.pathFor===void 0)return"";try{let t=n.pathFor(e);return typeof t=="string"?t:""}catch{return""}}function Rr(e,n,t){return(e.registerUntyped??e.register).call(e,n,t)}function kn(e,n,t){return(e.registerUntyped??e.register).call(e,n,t)}function ca(e){let n=new Map,t=new Map,r=async o=>{let i=n.get(o);if(i!==void 0)return i;let a=t.get(o);if(a!==void 0&&Date.now()-a<ra)return;let l=xe(e,"remote.skills");if(l!==void 0)try{let c=await l.list({sessionId:o});if(!c.ok){t.set(o,Date.now());return}let d=new Map(c.value.skills.map(s=>[s.name,s]));return n.set(o,d),t.delete(o),d}catch{t.set(o,Date.now());return}};return{names:async o=>new Set((await r(o))?.keys()??[]),pathOf:async(o,i)=>(await r(o))?.get(i)?.path}}async function fa(e,n,t,r){let o=`?sessionId=${encodeURIComponent(n)}&name=${encodeURIComponent(t)}`+(r===void 0?"":`&path=${encodeURIComponent(r)}`);try{let i=await fetch(`${ta}${o}`,{headers:{accept:"application/json"}});return i.ok?await i.json():void 0}catch{return}}function Dr(e,n,t){let r=e.sessions.list??xe(e,"sessions.list");try{let o=r?.getSnapshot?.(),i=u=>{let p=o?.projectionsBySession?.[u]?.values?.skillUsage;if(typeof p!="object"||p===null)return;let g=p.counts;return typeof g=="object"&&g!==null?g:void 0},a=i(n)?.[t],l=typeof a=="number"&&Number.isFinite(a)?a:0,c=o?.byId?.[n]?.cwd;if(typeof c!="string"||c==="")return{session:l};let d=Object.keys(o?.byId??{}).map(u=>{let f=i(u),p=o?.byId?.[u]?.cwd;return{...typeof p=="string"?{cwd:p}:{},...f===void 0?{}:{usage:f}}}),s=dt(d,c,t);return s===void 0?{session:l}:{session:l,workspace:s}}catch{return{session:0}}}function pa(e){return{entriesOfSlot:n=>(e.entriesOfSlot??e.entries).call(e,n),subscribe:(n,t)=>e.subscribe?.(n,t)??(()=>{})}}function wn(){try{return globalThis.localStorage}catch{return}}function xe(e,n){try{return typeof e.get=="function"?e.get(n):e[n]}catch{return}}function ma(e,n){let t=n.session?.sessionId;if(t===void 0)return;let r=e.sessions.scope?.(t);if(r===void 0)return;let o=xe(e,"inputTriggers");if(o!==void 0)try{let i=o.sessionOf(r),a=e.conversation?.input?.for?.(r)?.state,l=0,c=()=>{let d=a?.getSnapshot();if(!(d===void 0||d.draft.trim()===""||!d.draft.startsWith("/"))){try{let s=d.draft.trimStart().split(/\s/u)[0]??"";if(!s.startsWith("/")||(i.track?.(s,s.length,{tier:"plain"},d.draftRev),i.onSpace?.()===!0))return;i.dismiss?.()}catch{}l+=1,l<4&&setTimeout(c,25)}};setTimeout(c,0)}catch{}}function Ar(e){return(n,t)=>{try{return e.locale.bind?.(z)?.(n,t)??n}catch{return n}}}function ga(e){if(e===null)return null;try{let n=e("react");if(typeof n!="object"||n===null)return null;let t=n;return typeof t.createElement=="function"?t:null}catch{return null}}function ha(e){let n=e.locale.bind?.(z),t=(r,o)=>n?.(r)??o;return{heading:t("tabs.heading","Tabs"),empty:t("tabs.empty","No plugin has registered a conversation tab yet."),checkboxLabel:(r,o)=>t(o?"tabs.hide":"tabs.show","{label}").replace("{label}",r)}}function ya(e){He=e}var ba=Nr;

    // Hand the loader's `require` to the module's `boot` export before the
    // plugin mounts. Read from `module.exports` rather than the default export:
    // esbuild emits named exports there and the plugin object separately, so the
    // default export alone never carries `boot`.
    if (typeof module.exports.boot === "function") module.exports.boot(require);
    return module.exports.default ?? module.exports;
  }
});
