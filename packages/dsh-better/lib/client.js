window.__ModuleLoader__.load({
  id: "dsh-better",
  factory: (require) => {
    var module = { exports: {} };
    var exports = module.exports;
"use strict";var Je=Object.defineProperty;var uo=Object.getOwnPropertyDescriptor;var co=Object.getOwnPropertyNames;var fo=Object.prototype.hasOwnProperty;var po=(e,n)=>{for(var t in n)Je(e,t,{get:n[t],enumerable:!0})},go=(e,n,t,r)=>{if(n&&typeof n=="object"||typeof n=="function")for(let o of co(n))!fo.call(e,o)&&o!==t&&Je(e,o,{get:()=>n[o],enumerable:!(r=uo(n,o))||r.enumerable});return e};var mo=e=>go(Je({},"__esModule",{value:!0}),e);var fs={};po(fs,{boot:()=>us,clientPlugin:()=>so,default:()=>cs,findShadowed:()=>ao,findShadowedSingle:()=>An,readSkillUsage:()=>lo});module.exports=mo(fs);var Ae=require("react");var _n="dsh-better.skill-aliases";var de=Object.freeze({prefix:!0,rows:Object.freeze([])});function ho(e,n){if(e!==void 0)try{e.setItem(_n,JSON.stringify({v:1,prefix:n.prefix,rows:n.rows}))}catch{}}function Pe(e,n){return typeof e=="string"?e:n}function yo(e,n){if(typeof e!="object"||e===null||Array.isArray(e))return;let t=e;if(!(typeof t.keyword!="string"&&typeof t.target!="string"&&typeof t.params!="string"))return{id:Pe(t.id,`alias-${n}`)||`alias-${n}`,keyword:Pe(t.keyword,""),target:Pe(t.target,""),params:Pe(t.params,"")}}function bo(e){if(typeof e!="object"||e===null||Array.isArray(e))return de;let n=e,t=typeof n.prefix=="boolean"?n.prefix:de.prefix,r=Array.isArray(n.rows)?n.rows:[],o=[],i=new Set;for(let[a,s]of r.slice(0,200).entries()){let c=yo(s,a);if(c===void 0)continue;let u=c.id,l=0;for(;i.has(u);)l+=1,u=`alias-${a}-${l}`;i.add(u),o.push({...c,id:u})}return{prefix:t,rows:o}}function wo(e){if(e===void 0)return de;let n;try{n=e.getItem(_n)}catch{return de}if(n===null||n==="")return de;try{return bo(JSON.parse(n))}catch{return de}}function ko(){let e=globalThis.crypto;return e?.randomUUID!==void 0?e.randomUUID():`alias-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,8)}`}function Mn(e,n=ko){let t=wo(e),r=new Set,o=i=>{t=i;for(let a of[...r])try{a()}catch(s){console.error("[dsh-better] alias store listener failed:",s)}ho(e,i)};return{getSnapshot:()=>t,subscribe(i){return r.add(i),()=>{r.delete(i)}},setPrefix(i){t.prefix!==i&&o({...t,prefix:i})},addRow(){let i=n();return o({...t,rows:[...t.rows,{id:i,keyword:"",target:"",params:""}]}),i},updateRow(i,a){let s=!1,c=t.rows.map(u=>{if(u.id!==i)return u;let l={...u,...a,id:u.id};return s=l.keyword!==u.keyword||l.target!==u.target||l.params!==u.params,l});s&&o({...t,rows:c})},removeRow(i){let a=t.rows.filter(s=>s.id!==i);a.length!==t.rows.length&&o({...t,rows:a})}}}function Fn(e){return e.keyword.trim()!==""&&e.target.trim()!==""}function Wn(e){return e.keyword.trim().replace(/^\/+/,"").toLowerCase()}function Bn(e,n){let t=n.trim().replace(/^\/+/,"").toLowerCase();return t===""?[]:e.rows.filter(r=>Fn(r)&&Wn(r)===t)}function Hn(e,n,t=!1){let r=n.trim().replace(/^\/+/,"").toLowerCase(),o=e.rows.filter(Fn);if(r==="")return t?o:[];let i=[],a=[],s=[];for(let c of o){let u=Wn(c);u===r?i.push(c):u.startsWith(r)?a.push(c):u.includes(r)&&s.push(c)}return[...i,...a,...s]}function Gn(e){let n=e.target.trim().replace(/^\/+/,"");if(n==="")return"";let t=e.params.trim();return t===""?`/${n} `:`/${n} ${t} `}function zn(e,n){let t=/^\/([^\s/]+)([ \t]*)$/u.exec(n);if(t===null)return;let r=t[1]??"",o=Bn(e,r);if(o.length!==0)return{query:r,start:0,end:n.length,rows:o}}function $n(e,n){let t=/^([^\s/]+)([ \t]*)$/u.exec(n);if(t===null)return;let r=t[1]??"",o=Bn(e,r);if(o.length!==0)return{query:r,start:0,end:n.length,rows:o}}function qn(e){if(e.keyword.trim()==="")return"keyword";if(e.target.trim()==="")return"target";if(/\s/.test(e.keyword.trim()))return"keyword"}var R=require("react/jsx-runtime");function xo(e){let{row:n,store:t,t:r}=e,o=qn(n);return(0,R.jsxs)("tr",{"data-testid":"alias-row","data-row-id":n.id,"data-incomplete":o===void 0?void 0:"",children:[(0,R.jsx)("td",{children:(0,R.jsx)("input",{className:"dsh-better-alias-input","data-testid":"alias-keyword",value:n.keyword,placeholder:"wf",spellCheck:!1,autoComplete:"off","aria-label":r("alias.table.keyword"),ref:i=>{i!==null&&e.focus&&(i.focus(),e.clearFocus())},onChange:i=>t.updateRow(n.id,{keyword:i.target.value})})}),(0,R.jsx)("td",{children:(0,R.jsx)("input",{className:"dsh-better-alias-input","data-testid":"alias-target",value:n.target,placeholder:"flow-workflow",spellCheck:!1,autoComplete:"off","aria-label":r("alias.table.target"),onChange:i=>t.updateRow(n.id,{target:i.target.value})})}),(0,R.jsx)("td",{children:(0,R.jsx)("input",{className:"dsh-better-alias-input","data-testid":"alias-params",value:n.params,placeholder:r("alias.table.paramsPlaceholder"),spellCheck:!1,autoComplete:"off","aria-label":r("alias.table.params"),onChange:i=>t.updateRow(n.id,{params:i.target.value})})}),(0,R.jsx)("td",{className:"dsh-better-alias-actions",children:(0,R.jsx)("button",{type:"button",className:"dsh-better-alias-delete","data-testid":"alias-remove","aria-label":r("alias.remove",{keyword:n.keyword.trim()||r("alias.unnamed")}),title:r("alias.remove",{keyword:n.keyword.trim()||r("alias.unnamed")}),onClick:()=>t.removeRow(n.id),children:"\xD7"})})]})}function Vn(e){function n(){let t=(0,Ae.useSyncExternalStore)(e.store.subscribe,e.store.getSnapshot,e.store.getSnapshot),{translate:r}=e,o=(0,Ae.useRef)(null),i=()=>{o.current=e.store.addRow()};return(0,R.jsxs)("section",{className:"dsh-better-alias-page","data-testid":"alias-page",children:[(0,R.jsx)("h2",{className:"dsh-better-alias-heading",children:r("alias.heading")}),(0,R.jsxs)("label",{className:"dsh-better-alias-prefix",children:[(0,R.jsxs)("span",{children:[(0,R.jsx)("span",{className:"dsh-better-alias-prefix-title",children:r("alias.prefix.title")}),(0,R.jsx)("span",{className:"dsh-better-alias-prefix-hint",children:r(t.prefix?"alias.prefix.on":"alias.prefix.off")})]}),(0,R.jsx)("input",{type:"checkbox","data-testid":"alias-prefix",checked:t.prefix,"aria-label":r("alias.prefix.title"),onChange:a=>e.store.setPrefix(a.target.checked)})]}),(0,R.jsxs)("div",{className:"dsh-better-alias-table-wrap",children:[(0,R.jsxs)("table",{className:"dsh-better-alias-table",children:[(0,R.jsx)("thead",{children:(0,R.jsxs)("tr",{children:[(0,R.jsx)("th",{scope:"col",children:r("alias.table.keyword")}),(0,R.jsx)("th",{scope:"col",children:r("alias.table.target")}),(0,R.jsx)("th",{scope:"col",children:r("alias.table.params")}),(0,R.jsx)("th",{scope:"col","aria-label":r("alias.table.actions")})]})}),(0,R.jsx)("tbody",{children:t.rows.map(a=>(0,R.jsx)(xo,{row:a,store:e.store,t:r,focus:o.current===a.id,clearFocus:()=>{o.current=null}},a.id))})]}),t.rows.length===0?(0,R.jsx)("p",{className:"dsh-better-alias-empty","data-testid":"alias-empty",children:r("alias.empty")}):null]}),(0,R.jsx)("button",{type:"button",className:"dsh-better-alias-add","data-testid":"alias-add",onClick:i,children:r("alias.add")}),(0,R.jsx)("p",{className:"dsh-better-alias-footnote",children:r("alias.footnote")})]})}return n}var Xe="alias",vo="/",So=-1;function Co(e,n){let t=e.target.trim().replace(/^\/+/,""),r=e.keyword.trim(),o=e.params.trim();return{name:t,label:r,...o===""?{}:{description:n("alias.menu.params",{value:o})},section:n("alias.menu.section"),value:e.id}}function jn(e){return{trigger:vo,name:Xe,order:So,async candidates(n,t){if(t.position!=="leading")return[];let r=e.config();return!r.prefix&&e.bareMenuOpen?.()!==!0?[]:Hn(r,t.query,!0).map(o=>Co(o,e.translate))},onPick(n){let t=e.config().rows.find(i=>i.id===n.candidate.value);if(t===void 0)return;let r=t.target.trim().replace(/^\/+/,"");r!==""&&e.routeCommand?.(r,n);let o=Gn(t);return o===""?void 0:{text:o}}}}var Un="dsh-better/aliases.css",Lo=`
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
`;function Kn(e){let n=`style[data-plugin-css=${JSON.stringify(Un)}]`;if(e.querySelector(n)!==null)return()=>{};let t=e.createElement("style");return t.dataset.plugin="dsh-better",t.dataset.pluginCss=Un,t.textContent=Lo,e.head.append(t),()=>t.remove()}var oe=require("react");var Yn={draft:"",draftRev:-1,phase:"plain"};function Xn(e){return function(t){let r=(0,oe.useSyncExternalStore)(e.store.subscribe,e.store.getSnapshot,e.store.getSnapshot),o=t.sessionId===void 0?void 0:e.inputStoreFor(t.sessionId),i=t.sessionId===void 0?void 0:e.controllerFor(t.sessionId),a=(0,oe.useSyncExternalStore)(c=>o===void 0?()=>{}:o.subscribe(c),()=>o===void 0?Yn:o.getSnapshot(),()=>o===void 0?Yn:o.getSnapshot()),s=(0,oe.useRef)(null);return(0,oe.useEffect)(()=>{let c=t.sessionId;if(c===void 0||a.phase!=="plain"||i===void 0)return;let u=i.menu.getSnapshot().open;if(u&&s.current===null)return;let l=Ze(r,a.draft);if(u){let f=s.current;if(f!==null&&(f.draftRev!==a.draftRev||f.spanEnd!==(l?.end??-1))){let p=setTimeout(()=>{let g=o?.getSnapshot()??a,b=e.controllerFor(c);if(b===void 0||g.phase!=="plain")return;s.current=null,b.dismiss();let h=Ze(e.store.getSnapshot(),g.draft);h!==void 0&&(e.bareMenuOpen.open=!0,Jn(b,h,g.draftRev),e.bareMenuOpen.open=!1,s.current={draftRev:g.draftRev,spanEnd:h.end})},80);return()=>clearTimeout(p)}return}if(s.current=null,l===void 0)return;let d=setTimeout(()=>{let f=o?.getSnapshot()??a,p=e.controllerFor(c);if(p===void 0||f.phase!=="plain"||p.menu.getSnapshot().open)return;let g=Ze(e.store.getSnapshot(),f.draft);g!==void 0&&(e.bareMenuOpen.open=!0,Jn(p,g,f.draftRev),e.bareMenuOpen.open=!1,s.current={draftRev:f.draftRev,spanEnd:g.end})},80);return()=>clearTimeout(d)},[r,a.draft,a.draftRev,a.phase,i,o,t.sessionId]),null}}function Ze(e,n){return e.prefix?zn(e,n):$n(e,n)}function Jn(e,n,t){e.toggleSource(Xe,{trigger:"/",query:n.query,quoted:!1,position:"leading",span:{start:n.start,end:n.end,draftRev:t}})}function ne(e){return e!==void 0&&e!=="plain"}var C=require("react");var Eo="[a-z0-9]+(?:-[a-z0-9]+)*",Ro=new RegExp(`^/(${Eo})(?=\\s|$)`,"u");function ue(e,n){let t=Ro.exec(e);if(t===null)return;let r=t[1]??"";if(n(r))return{name:r,start:0,end:1+r.length}}function Zn(e,n,t){return e===void 0||!Number.isInteger(t)||t<e.end||t>n.length||t!==n.length?!1:/^[ \t]*$/u.test(n.slice(e.end,t))}var Qe=/\s/u;function To(e){let n=[],t=0;for(;t<e.length;){for(;t<e.length&&Qe.test(e.charAt(t));)t+=1;let r=t;for(;t<e.length&&!Qe.test(e.charAt(t));)t+=1;t>r&&n.push({text:e.slice(r,t),start:r})}return n}function Qn(e,n,t){if(e==="")return;let r=ue(e,n);if(r===void 0||t.length===0)return;let i=To(e).slice(1);if(i.length===0)return;let a=Qe.test(e.charAt(e.length-1)),s=a?i[i.length-1]:i[i.length-2],c=a?void 0:i[i.length-1];if(s===void 0)return;let u=t.find(d=>d.slot===s.text);if(u===void 0)return;if(c===void 0)return{name:r.name,slot:u.slot,query:"",start:e.length};let l=c.text;if(!l.startsWith("--"))return{name:r.name,slot:u.slot,query:l,start:c.start}}function Po(e,n){let t=e.slug.toLowerCase();if(t.startsWith(n))return 0;if(t.includes(n))return 1;if(e.summary.toLowerCase().includes(n))return 2}function ke(e,n){let t=n.trim().toLowerCase();if(t==="")return e;let r=[];for(let o of e){let i=Po(o,t);i!==void 0&&r.push({entry:o,tier:i})}return r.sort((o,i)=>o.tier-i.tier),r.map(o=>o.entry)}function et(e,n){let t=n.trim().toLowerCase();if(t==="")return[];let r=e.toLowerCase(),o=[],i=0;for(;i<=r.length-t.length;){let a=r.indexOf(t,i);if(a===-1)break;o.push({start:a,end:a+t.length}),i=a+t.length}return o}function nt(e,n,t,r){return e!=="Enter"&&e!=="Tab"&&e!=="ArrowUp"&&e!=="ArrowDown"||r||ke(n,t).length===0?"pass":e==="Enter"||e==="Tab"?"insert":"move"}function en(e){return`${e.trimEnd()} `}var Ao=/\s/u;function rt(e,n){let t=ue(e,n);if(t===void 0)return;let r=e.length-1;for(;r>=0&&!Ao.test(e.charAt(r));)r-=1;let o=r+1,i=e.slice(o);if(!(i.length<2||!i.startsWith("--")))return{name:t.name,query:i,start:o}}function ot(e,n){let t=n.slice(2).toLowerCase();return e.filter(r=>r.flag.startsWith("--")?r.flag.slice(2).toLowerCase().startsWith(t):!1)}function tt(e,n){let t=0;for(let r of n){let o=r.offset+r.length;if(e>=r.offset&&e<o)return;o<=e&&(t+=r.length-1)}return e-t}function Oe(e,n,t,r){let o=tt(t.start,n);if(o===void 0)return;let i=tt(e.length,n);if(i!==void 0)return{start:o,end:i,draftRev:r}}function it(e){return`${e} `}function Oo(e){let n=e.occurrences;if(!Array.isArray(n))return[];let t=[];for(let r of n){if(typeof r!="object"||r===null)continue;let o=r;typeof o.offset!="number"||typeof o.length!="number"||t.push({offset:o.offset,length:o.length})}return t}var Io=/^\/([a-z0-9]+(?:-[a-z0-9]+)*)[ \t]*$/u,No=400,at=200,st=6,Do=240,lt={draft:"",draftRev:-1,phase:"plain"};function _o(e,n){return`${e!==""&&!/\s$/u.test(e)?" ":""}${n} `}function pt(e){return e===void 0?void 0:Io.exec(e)?.[1]}function Mo(e){return e===void 0?[]:e.split(`
`).map(n=>n.trim()).filter(n=>n!=="")}var rn=240,on=640;function gt(e){return!Number.isFinite(e)||e<=0?on:Math.max(rn,Math.min(on,e-24))}function Fo(e,n){let t=gt(n),r=Number.isFinite(e)&&e>0?e:0,o=r===0?rn:r<=80?320:r<200?480:on;return Math.min(Math.max(o,rn),t)}function mt(e,n,t,r){if(!Number.isFinite(t)||t<=0)return e;let o=t-n-r;return Math.max(r,Math.min(e,Math.max(r,o)))}function Wo(e,n,t){if(t<=0||typeof e.createRange!="function")return;let r=e.createRange(),o=t,i=!1,a=c=>{for(let u of Array.from(c.childNodes)){if(u.nodeType===3){let l=u.textContent??"",d=Math.min(o,l.length);if(d<=0)continue;if(i||(r.setStart(u,0),i=!0),r.setEnd(u,d),o-=d,o<=0)return!0;continue}if(a(u))return!0}return!1};if(!a(n)||o>0)return;let s=r.getBoundingClientRect();if(!(s.width===0&&s.height===0))return{left:s.left,right:s.right,top:s.top,bottom:s.bottom}}function dt(e,n){let t=e.querySelectorAll("[data-composer-text-ref]");for(let r of t){if(pt(r.textContent??"")!==n)continue;let o=Wo(e,r,n.length+1);if(o!==void 0)return o;let i=r.getBoundingClientRect();return{left:i.left,right:i.right,top:i.top,bottom:i.bottom}}}function Ne(e){return e.defaultView?.innerWidth??0}function ht(e,n,t,r){let o=e.top-r,i=Number.isFinite(t)&&t>0?t:0;return i===0||i<=o?{left:e.left,top:0,anchor:"above"}:{left:e.left,top:e.bottom+r,anchor:"below"}}function Ie(e){return e.defaultView?.innerHeight??0}function ut(e){let n=typeof e.getSelection=="function"?e.getSelection():null,t=n?.anchorNode;if(t!=null){let s=(t.nodeType===1?t:t.parentElement)?.closest("[data-composer-text-ref]");if(s!=null){let c=n?.getRangeAt===void 0||n.rangeCount===0?void 0:n.getRangeAt(0).getBoundingClientRect();if(c!==void 0&&c.height>0)return{left:c.left,right:c.left,top:c.top,bottom:c.bottom}}}let r=e.querySelectorAll("[data-composer-text-ref]"),o=r[r.length-1];if(o===void 0)return;let i=o.getBoundingClientRect();if(!(i.width===0&&i.height===0))return{left:i.left,right:i.right,top:i.top,bottom:i.bottom}}function Bo(e,n,t){if(n<=0)return;if(e===void 0)return 0;let r=Math.min(e,n-1);return t==="up"?Math.max(0,r-1):Math.min(n-1,r+1)}function nn(e,n){if(!(n<=0))return e===void 0||e<0?0:Math.min(e,n-1)}function ct(e,n,t,r){let o=et(t,r);if(o.length===0){n.append(e.createTextNode(t));return}let i=0;for(let a of o){a.start>i&&n.append(e.createTextNode(t.slice(i,a.start)));let s=e.createElement("mark");s.className="dsh-better-skill-catalog-mark",s.textContent=t.slice(a.start,a.end),n.append(s),i=a.end}i<t.length&&n.append(e.createTextNode(t.slice(i)))}function Ho(e,n){let t=e.createElement("div");t.className="dsh-better-skill-catalog";let r=e.createElement("div");return r.className="dsh-better-skill-catalog-title",r.textContent=`/${n.name} ${n.slot}`,t.append(r),n.getActions()?.insertText!==void 0&&n.entries.forEach((o,i)=>{t.append(Go(e,n,o,i===n.selected))}),t.style.width=`${an(e)}px`,t}function Go(e,n,t,r){let o=e.createElement("button");o.type="button",o.className=r?"dsh-better-skill-catalog-row dsh-better-skill-catalog-selected":"dsh-better-skill-catalog-row",o.addEventListener("pointerdown",s=>s.preventDefault());let i=e.createElement("span");i.className="dsh-better-skill-catalog-slug",ct(e,i,t.slug,n.match.query),o.append(i);let a=e.createElement("span");return a.className="dsh-better-skill-catalog-summary",ct(e,a,t.summary,n.match.query),o.append(a),o.addEventListener("click",()=>{let s=n.getActions(),c=s?.captureInsertion?.();if(s?.insertText===void 0||c===void 0)return;let u=Oe(n.getDraft(),n.getOccurrences(),n.match,c.draftRev);u!==void 0&&s.insertText(en(t.slug),u)}),o}function zo(e,n){let t=e.createElement("div");t.className="dsh-better-skill-params";let r=e.createElement("div");if(r.className="dsh-better-skill-params-title",r.textContent=`/${n.name}`,t.append(r),n.getActions()?.insertText!==void 0)for(let o of n.params)t.append($o(e,n,o.flag,o.detail));return t.style.width=`${an(e)}px`,t}function an(e){return Math.min(320,gt(Ne(e)))}function ft(e,n,t){if(t===void 0)return;let r=4,o=Ne(e),i=an(e);n.style.width=`${i}px`;let a=ht(t,Ie(e),n.offsetHeight,r);n.style.left=`${mt(a.left,i,o,12)}px`,a.anchor==="above"?(n.style.bottom=`${Ie(e)-t.top+r}px`,n.style.top=""):(n.style.top=`${a.top}px`,n.style.bottom="")}function $o(e,n,t,r){let o=e.createElement("button");o.type="button",o.className="dsh-better-skill-panel-param",o.addEventListener("pointerdown",a=>a.preventDefault());let i=e.createElement("span");if(i.className="dsh-better-skill-panel-param-flag",i.textContent=t,o.append(i),r!==""){let a=e.createElement("span");a.className="dsh-better-skill-panel-param-detail",a.textContent=r,o.append(a)}return o.addEventListener("click",()=>{let a=n.getActions(),s=a?.captureInsertion?.();if(a?.insertText===void 0||s===void 0)return;let c=Oe(n.getDraft(),n.getOccurrences(),n.match,s.draftRev);c!==void 0&&a.insertText(it(t),c)}),o}function yt(e){return function(t){let r=e.document??globalThis.document,o=t.sessionId,i=o===void 0?void 0:e.inputStoreFor(o),a=t.useInput,s=a===void 0?void 0:a(y=>y.draft),c=a===void 0?void 0:a(y=>y.phase),u=a===void 0?void 0:a(y=>y.occurrences),l=(0,C.useSyncExternalStore)(y=>i===void 0?()=>{}:i.subscribe(y),()=>i===void 0?lt:i.getSnapshot(),()=>i===void 0?lt:i.getSnapshot()),d=s??l.draft,f=c??l.phase,[p,g]=(0,C.useState)(()=>new Set),[b,h]=(0,C.useState)(void 0),[w,I]=(0,C.useState)(void 0),[P,A]=(0,C.useState)(void 0),[N,z]=(0,C.useState)(void 0),[v,S]=(0,C.useState)(void 0),[m,O]=(0,C.useState)(void 0),[D,F]=(0,C.useState)(void 0),[H,j]=(0,C.useState)(void 0),[_,$]=(0,C.useState)(void 0);(0,C.useEffect)(()=>{if(o===void 0)return;let y=!0;return e.skillNamesFor(o).then(x=>{y&&g(x)},()=>{y&&g(new Set)}),()=>{y=!1}},[o]);let le=ue(d,y=>p.has(y)),Q=Zn(le,d,d.length)&&!ne(f)?le?.name:void 0,k=rt(d,y=>p.has(y)),L=k!==void 0&&!ne(f)&&v!==d,E=Qn(d,y=>p.has(y),b?.assists??[]),Y=b?.catalogs?.workflows??[],ee=E!==void 0&&Y.length>0&&!ne(f)&&D!==d&&!L,je=le?.name??w;(0,C.useEffect)(()=>{if(o===void 0||je===void 0){h(void 0);return}let y=!0;return e.loadProfile(o,je).then(x=>{y&&h(x)},()=>{y&&h(void 0)}),()=>{y=!1}},[o,je]),(0,C.useEffect)(()=>{if(r===void 0||Q===void 0){A(void 0);return}let y=()=>A(dt(r,Q));y();let x=r.defaultView;return x?.addEventListener("resize",y),()=>x?.removeEventListener("resize",y)},[r,Q,d]);let ye=(0,C.useRef)(null),re=(0,C.useRef)(null),Ee=()=>{ye.current!==null&&clearTimeout(ye.current),ye.current=null},be=()=>{re.current!==null&&clearTimeout(re.current),re.current=null};(0,C.useEffect)(()=>{if(r===void 0||o===void 0)return;let y=q=>{let G=q.target;if(!(G instanceof r.defaultView.Element))return;let Te=G.closest("[data-composer-text-ref]");if(Te===null)return;let X=pt(Te.textContent??"");X!==void 0&&(be(),Ee(),ye.current=setTimeout(()=>{ye.current=null,I(X),A(dt(r,X)),z(e.loadUsage(o,X))},No))},x=q=>{let G=q.target;G instanceof r.defaultView.Element&&G.closest("[data-composer-text-ref]")!==null&&(Ee(),be(),re.current=setTimeout(()=>{re.current=null,I(void 0)},at))};return r.addEventListener("pointerover",y,!0),r.addEventListener("pointerout",x,!0),()=>{Ee(),be(),r.removeEventListener("pointerover",y,!0),r.removeEventListener("pointerout",x,!0)}},[r,o]),(0,C.useEffect)(()=>{if(r===void 0||w===void 0)return;let y=x=>{x.key==="Escape"&&I(void 0)};return r.addEventListener("keydown",y),()=>r.removeEventListener("keydown",y)},[r,w]);let J=(0,C.useRef)(d);J.current=d;let we=(0,C.useRef)(void 0);we.current=t.inputActions??(o===void 0?void 0:e.actionsFor(o));let Re=(0,C.useRef)([]);Re.current=Oo({draft:d,draftRev:l.draftRev,phase:f,occurrences:u??l.occurrences});let Ue=(0,C.useRef)(void 0),Ke=(0,C.useRef)(void 0);return(0,C.useEffect)(()=>{if(r===void 0||Q===void 0||P===void 0)return;let y=Mo(b?.argumentHint);if(y.length===0)return;let x=qo(r,P,y);return r.body.append(x),()=>x.remove()},[r,Q,P,b]),(0,C.useEffect)(()=>{if(r===void 0||w===void 0||L)return;let y=Vo(r,e,{name:w,profile:b,usage:N,box:P,sessionId:o,getActions:()=>we.current,getDraft:()=>J.current,onEnter:be,onLeave:()=>{Ee(),be(),re.current=setTimeout(()=>{re.current=null,I(void 0)},at)}});return r.body.append(y),()=>y.remove()},[r,w,b,N,P,o,L]),(0,C.useEffect)(()=>{if(r===void 0||!L){O(void 0);return}let y=()=>O(ut(r));y();let x=r.defaultView;return x?.addEventListener("resize",y),()=>x?.removeEventListener("resize",y)},[r,L,d]),(0,C.useEffect)(()=>{if(r===void 0||!L||k===void 0)return;let y=ot(b?.params??[],k.query);if(y.length===0)return;let x=zo(r,{name:k.name,match:k,params:y,getActions:()=>we.current,getDraft:()=>J.current,getOccurrences:()=>Re.current});return Ue.current=x,r.body.append(x),ft(r,x,m),()=>{Ue.current=void 0,x.remove()}},[r,L,k,b,m]),(0,C.useEffect)(()=>{if(r===void 0||!L)return;let y=x=>{x.key==="Escape"&&S(J.current)};return r.addEventListener("keydown",y),()=>r.removeEventListener("keydown",y)},[r,L]),(0,C.useEffect)(()=>{if(r===void 0||!L)return;let y=x=>{let q=Ue.current,G=x.target;q!==void 0&&G instanceof Node&&q.contains(G)||S(J.current)};return r.addEventListener("pointerdown",y,!0),()=>r.removeEventListener("pointerdown",y,!0)},[r,L]),(0,C.useEffect)(()=>{if(r===void 0||!ee){j(void 0);return}let y=()=>j(ut(r));y();let x=r.defaultView;return x?.addEventListener("resize",y),()=>x?.removeEventListener("resize",y)},[r,ee,d]),(0,C.useEffect)(()=>{$(void 0)},[E?.query]),(0,C.useEffect)(()=>{if(r===void 0||!ee||E===void 0)return;let y=ke(Y,E.query);if(y.length===0)return;let x=Ho(r,{name:E.name,slot:E.slot,match:E,entries:y,selected:nn(_,y.length)??0,getActions:()=>we.current,getDraft:()=>J.current,getOccurrences:()=>Re.current});return Ke.current=x,r.body.append(x),ft(r,x,H),()=>{Ke.current=void 0,x.remove()}},[r,ee,E,Y,_,H]),(0,C.useEffect)(()=>{if(r===void 0||!ee)return;let y=x=>{if(x.key==="Escape"){F(J.current);return}if(x.key!=="ArrowUp"&&x.key!=="ArrowDown"&&x.key!=="Enter"&&x.key!=="Tab"||x.key==="Tab"&&x.shiftKey)return;let q=nt(x.key,Y,E?.query??"",x.isComposing);if(q==="pass")return;if(x.preventDefault(),x.stopPropagation(),q==="insert"){let X=ke(Y,E?.query??""),On=nn(_,X.length),In=On===void 0?void 0:X[On];if(In===void 0||E===void 0)return;let Ye=we.current,Nn=Ye?.captureInsertion?.();if(Ye?.insertText===void 0||Nn===void 0)return;let Dn=Oe(J.current,Re.current,E,Nn.draftRev);if(Dn===void 0)return;Ye.insertText(en(In.slug),Dn);return}let G=ke(Y,E?.query??"").length,Te=x.key==="ArrowUp"?"up":"down";$(X=>Bo(nn(X,G),G,Te))};return r.addEventListener("keydown",y,!0),()=>r.removeEventListener("keydown",y,!0)},[r,ee,E,Y,_]),(0,C.useEffect)(()=>{if(r===void 0||!ee)return;let y=x=>{let q=Ke.current,G=x.target;q!==void 0&&G instanceof Node&&q.contains(G)||F(J.current)};return r.addEventListener("pointerdown",y,!0),()=>r.removeEventListener("pointerdown",y,!0)},[r,ee]),null}}function qo(e,n,t){let r=e.createElement("div");r.className="dsh-better-skill-hint",r.textContent=t.join(`
`);let o=n.right+st>Ne(e)-Do;return r.style.left=`${o?n.left:n.right+st}px`,r.style.top=`${o?n.bottom+2:n.top}px`,r}function Vo(e,n,t){let r=e.createElement("div");r.className="dsh-better-skill-panel",r.addEventListener("pointerenter",t.onEnter),r.addEventListener("pointerleave",t.onLeave);let o=e.createElement("div");o.className="dsh-better-skill-panel-title",o.textContent=`/${t.name}`,r.append(o);let i=t.profile?.description;if(i!==void 0&&i!==""){let l=e.createElement("div");l.className="dsh-better-skill-panel-desc",l.textContent=i,l.title=i,r.append(l)}let a=t.profile?.metadata??{},s=Object.keys(a);if(s.length>0){let l=e.createElement("div");l.className="dsh-better-skill-panel-section",l.append(tn(e,n.translate("skill.metadata")));for(let d of s){let f=e.createElement("div");f.textContent=`${d}: ${a[d]??""}`,l.append(f)}r.append(l)}let c=t.profile?.path;if(c!==void 0&&c!==""){r.append(tn(e,n.translate("skill.path")));let l=e.createElement("div");l.className="dsh-better-skill-panel-path",l.textContent=c,r.append(l)}if(t.usage!==void 0){let l=e.createElement("div");l.className="dsh-better-skill-panel-counts",l.textContent=`${n.translate("skill.usage.session")} ${t.usage.session}`,t.usage.workspace!==void 0&&(l.textContent+=` \xB7 ${n.translate("skill.usage.workspace")} ${t.usage.workspace}`),r.append(l)}let u=t.profile?.params??[];if(u.length>0&&t.getActions()?.insertText!==void 0){r.append(tn(e,n.translate("skill.params")));for(let l of u)r.append(jo(e,n,t,l.flag,l.detail))}{let d=Ne(e),f=Fo(i?.length??0,d);if(r.style.width=`${f}px`,t.box!==void 0){let p=ht(t.box,Ie(e),r.offsetHeight,4);r.style.left=`${mt(p.left,f,d,12)}px`,p.anchor==="above"?(r.style.bottom=`${Ie(e)-t.box.top+4}px`,r.style.top=""):(r.style.top=`${p.top}px`,r.style.bottom="")}}return r}function tn(e,n){let t=e.createElement("div");return t.className="dsh-better-skill-panel-label",t.textContent=n,t}function jo(e,n,t,r,o){let i=e.createElement("button");i.type="button",i.className="dsh-better-skill-panel-param",i.title=n.translate("skill.hint.insert"),i.addEventListener("pointerdown",s=>s.preventDefault());let a=e.createElement("span");if(a.className="dsh-better-skill-panel-param-flag",a.textContent=r,i.append(a),o!==""){let s=e.createElement("span");s.className="dsh-better-skill-panel-param-detail",s.textContent=o,i.append(s)}return i.addEventListener("click",()=>{let s=t.getActions();if(s?.insertText===void 0||s.captureInsertion===void 0)return;let c=s.captureInsertion();s.insertText(_o(t.getDraft(),r),c)}),i}var bt="dsh-better/skill-enhancer.css",Uo=`
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
/* The workflow catalogue panel. Its fill is the slash menu's, not the solid
   layer the hover panel uses: this list opens beside the skill alias menu, and
   a different card behind it reads as a second surface. The fill is translucent,
   so it also takes that menu's blur; without the blur the page shows through as
   noise instead of the menu's tint. */
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
  background: var(--dsw-specific-menu, #303136a3);
  backdrop-filter: var(--dsw-menu-backdrop-filter, blur(40px) saturate(150%));
  -webkit-backdrop-filter: var(--dsw-menu-backdrop-filter, blur(40px) saturate(150%));
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
`;function wt(e){if(e===void 0)return()=>{};let n=`style[data-plugin-css=${JSON.stringify(bt)}]`;if(e.querySelector(n)!==null)return()=>{};let t=e.createElement("style");return t.dataset.plugin="dsh-better",t.dataset.pluginCss=bt,t.textContent=Uo,e.head.append(t),()=>t.remove()}function kt(e,n,t){if(n===void 0||n===""||e.length===0)return;let r=0;for(let o of e){if(o.cwd!==n)continue;let i=o.usage?.[t];typeof i=="number"&&Number.isFinite(i)&&(r+=i)}return r}var T=require("react");var Ko="@deepseek-ai/dsh-client-ui-commands/PopupSelectView.module.css";function xt(e){if(e===void 0)return;let t=e.querySelector(`style[data-plugin-css="${Ko}"]`)?.textContent??"",r=i=>new RegExp(`\\.(\\w+_${i})\\{`,"u").exec(t)?.[1],o={badges:"dshBetter_badges",badgeChip:"dshBetter_badgeChip",badgeChipOn:"dshBetter_badgeChipOn",card:r("card"),viewport:r("viewport"),row:r("row"),rowActive:r("rowActive"),label:r("label"),labelText:r("labelText"),badge:r("badge"),detail:r("detail"),check:r("check"),status:r("status"),search:r("search"),error:r("error"),errorText:r("errorText"),retry:r("retry")};for(let[i,a]of Object.entries(o))if(!(i==="badges"||i==="badgeChip"||i==="badgeChipOn")&&a===void 0)return;return o}function sn(e,n){for(let t of e)if(t.id===n.provider){for(let r of t.models)if(r.id===n.model)return r.reasoning}}function vt(e,n){let t=sn(e,n)?.efforts;return t===void 0?[]:[...t]}function St(e,n){if(e.length===0)return;let t=r=>r!==void 0&&e.some(o=>o.id===r);return t(n.remembered)?n.remembered:n.isCurrent&&t(n.currentEffort)?n.currentEffort:t(n.defaultEffort)?n.defaultEffort:e[0]?.id}function Yo(e){return e.length>1}function Ct(e){return Yo(e)?e:[]}var U=require("react/jsx-runtime");function De(e){let n=e.group?.name;if(n===void 0)return;let t=`${n}/`,r=e.id.startsWith(t)?e.id.slice(t.length):e.id;return{provider:n,model:r}}function Jo(e,n){let t=De(e);return Ct(t===void 0?[]:vt(n??[],t))}function Lt({option:e,active:n,catalog:t,pointed:r,classes:o,primitives:i,onChoose:a,onPickEffort:s,onHover:c,t:u}){let l=Jo(e,t),d=i.IconCheckOutlineRegular;return(0,U.jsxs)("div",{role:"option","aria-selected":n,"aria-label":e.badge===void 0?void 0:`${e.label} ${e.badge}`,className:n?`${o.row} ${o.rowActive}`:o.row,onClick:a,onMouseEnter:c,children:[(0,U.jsxs)("span",{className:o.label,children:[(0,U.jsx)("span",{className:o.labelText,children:e.label}),e.badge!==void 0&&(0,U.jsx)("sup",{className:o.badge,children:e.badge})]}),e.detail!==void 0&&(0,U.jsx)("span",{className:o.detail,children:e.detail}),l.length>0&&(0,U.jsx)("span",{className:o.badges,role:"group","aria-label":u?.("listbox.aria")??"",children:l.map(f=>(0,U.jsx)("button",{type:"button",className:f.id===r?`${o.badgeChip} ${o.badgeChipOn}`:o.badgeChip,title:f.description??f.name,onClick:p=>{p.stopPropagation(),s(f.id)},children:f.name},f.id))}),e.active===!0&&l.length===0&&(0,U.jsx)("span",{className:o.check,children:d===void 0?null:(0,U.jsx)(d,{})})]})}function _e(e){let n=new Map;for(let t of e){let r=t.group?.name,o=n.get(r);o!==void 0?o.rows.push(t):n.set(r,{group:t.group,rows:[t]})}return[...n.values()]}function Me(e){let n=_e(e);return n.some(t=>t.group!==void 0)?n.flatMap(t=>t.rows):[...e]}function Et(e,n,t){return t===void 0?e.filter(r=>r.label.toLowerCase().includes(n)):_e(e).flatMap(r=>t(r.rows.map(o=>({name:o.label,option:o})),n).map(o=>o.option))}var ln=new WeakSet;async function Rt(e,n){let t=e.binding,r=e.state.getSnapshot();if(!(t===null||r.submitting||ln.has(e))){ln.add(e),e.state.set?.({...r,submitting:!0,confirming:null,acknowledged:!1,error:null});try{let o=n();if(o===void 0)return;await o,t!==null&&e.binding===t&&e.deps?.consume?.(t.segment)}finally{ln.delete(e),t!==null&&e.binding===t&&e.dismiss({focusComposer:!0})}}}var Xo="@deepseek-ai/dsh-client-ui-primitives";function Fe(e){if(e===null)return{};let n;try{n=e(Xo)}catch{return{}}if(n===null||typeof n!="object")return{};let t=n,r=h=>typeof h=="function"||typeof h=="object"&&h!==null,o=h=>{let w=t[h];return r(w)?w:void 0},i=h=>{let w=t[h];return typeof w=="function"?w:void 0},a={},s=o("MenuSurface");s!==void 0&&(a.MenuSurface=s);let c=o("MenuGroup");c!==void 0&&(a.MenuGroup=c);let u=o("IconCheckOutlineRegular");u!==void 0&&(a.IconCheckOutlineRegular=u);let l=o("IconDataOutlineRegular");l!==void 0&&(a.IconDataOutlineRegular=l);let d=o("IconChevronDownOutlineRegular");d!==void 0&&(a.IconChevronDownOutlineRegular=d);let f=o("Tag");f!==void 0&&(a.Tag=f);let p=i("useAnchoredMaxHeight");p!==void 0&&(a.useAnchoredMaxHeight=p);let g=i("observeStickyMenuGroups");g!==void 0&&(a.observeStickyMenuGroups=g);let b=i("rankByName");return b!==void 0&&(a.rankByName=b),a}function Zo(e){if(e===void 0)return[];let n=[e.name,e.label].map(t=>t.trim().toLowerCase()).filter(t=>t!=="");return[...new Set(n)]}function Qo(e,n){return Zo(e.group).some(t=>t.includes(n))}function ei(e,n,t,r){return t==="fuzzy-label"?Et(e,n,r):Me(e).filter(o=>o.label.toLowerCase().includes(n)||o.detail?.toLowerCase().includes(n)===!0)}function Tt(e,n,t,r){let o=n.trim().toLowerCase();if(o==="")return Me(e);let i=ei(e,o,t,r),a=new Set(i),s=Me(e).filter(c=>!a.has(c)&&Qo(c,o));return[...i,...s]}var M=require("react/jsx-runtime"),It="model",Pt=320;function ni(e){return e.command!==It||!e.open||e.status!=="ready"||e.confirming!==null||e.options.length===0?!1:e.submitting||e.error===null}function ti(e){return e===void 0?!1:/Android|iPhone|iPad|iPod/i.test(e.userAgent)||e.platform==="MacIntel"&&e.maxTouchPoints>1}var ri={subscribe:()=>()=>{},getSnapshot:()=>({open:!1,command:null,status:"pending",options:[],search:"",searchLabels:null,searchMode:"substring",active:0,submitting:!1,confirming:null,acknowledged:!1,error:null})};function Nt(e){let n=Fe(e.load);function t(r){let o=r.popup,i=o?.state??ri,a=(0,T.useCallback)(l=>i.subscribe(l),[i]),s=(0,T.useCallback)(()=>i.getSnapshot(),[i]),c=(0,T.useSyncExternalStore)(a,s),u=e.native();return o===void 0||u===void 0?null:!ni(c)||o.settle===void 0?(0,M.jsx)(u,{...r}):(0,M.jsx)(oi,{popup:o,state:c,t:r.t,primitives:n,doc:e.document,catalog:r.catalog,current:r.current,selectModel:r.selectModel})}return t}function oi({popup:e,state:n,t,primitives:r,doc:o,catalog:i,current:a,selectModel:s}){let c=(0,T.useRef)(null),u=(0,T.useRef)(null),l=(0,T.useRef)(null),d=(0,T.useMemo)(()=>xt(o),[o]),f=n.searchMode,p=(0,T.useMemo)(()=>Tt(n.options,n.search,f,r.rankByName),[n.options,n.search,f,r.rankByName]),g=(0,T.useMemo)(()=>_e(p),[p]),[b,h]=(0,T.useState)({}),[w,I]=(0,T.useState)(()=>At(p));(0,T.useEffect)(()=>{I(At(p))},[n.search,n.options]);let P=Ot(p,w),A=ii(r,c,n);(0,T.useEffect)(()=>{let k=l.current;if(!(k===null||r.observeStickyMenuGroups===void 0))return r.observeStickyMenuGroups(k)},[r.observeStickyMenuGroups,n.open,n.status,g]),(0,T.useEffect)(()=>{c.current?.querySelector('[aria-selected="true"]')?.scrollIntoView({block:"nearest"})},[P,p]),(0,T.useEffect)(()=>{if(!n.open)return;let k=L=>{let E=c.current;E!==null&&L.target instanceof Node&&E.contains(L.target)||e.dismiss()};return o?.addEventListener("pointerdown",k,!0),()=>{o?.removeEventListener("pointerdown",k,!0)}},[o,e,n.open]),(0,T.useEffect)(()=>{n.open&&(ti(o?.defaultView?.navigator)||u.current?.focus())},[o,n.open]);let N=(0,T.useCallback)((k,L)=>{if(L===void 0||s===void 0){e.settle?.(e.binding,k);return}let E=De(k);if(E===void 0){e.settle?.(e.binding,k);return}Rt(e,()=>s({...E,reasoningEffort:L}))},[e,s]),z=(0,T.useCallback)(k=>{let L=De(k);if(L===void 0)return;let E=sn(i??[],L);return St(E?.efforts??[],{remembered:b[k.id],isCurrent:a?.provider===L.provider&&a?.model===L.model,currentEffort:a?.reasoningEffort,defaultEffort:E?.defaultEffort})},[i,a,b]),v=(0,T.useCallback)(k=>{N(k,z(k))},[z,N]),S=(0,T.useCallback)((k,L)=>{h(E=>({...E,[k.id]:L})),N(k,L)},[N]),m=(0,T.useCallback)(()=>{let k=p[P];k!==void 0&&v(k)},[P,v,p]),O=(0,T.useCallback)(k=>{p.length!==0&&I(L=>(Ot(p,L)+k+p.length)%p.length)},[p]),D=k=>{switch(k.key){case"ArrowDown":k.preventDefault(),O(1);return;case"ArrowUp":k.preventDefault(),O(-1);return;case"Enter":k.preventDefault(),m();return;case"Tab":if(!k.shiftKey&&p.length===0)return;k.preventDefault(),k.shiftKey?e.dismiss({focusComposer:!0}):m();return;case"Escape":k.preventDefault(),e.dismiss({focusComposer:!0});return;default:}};if(d===void 0)return null;let F=n.searchLabels?.placeholder??t?.("search.placeholder")??"",H=n.searchLabels===null?t?.("status.empty")??"":n.options.length===0?n.searchLabels.empty:n.searchLabels.noResults,j=(k,L)=>(0,M.jsx)(Lt,{option:k,active:L===P,catalog:i,pointed:L===P?z(k):void 0,classes:d,primitives:r,onChoose:()=>{v(k)},onPickEffort:E=>{S(k,E)},onHover:()=>{I(L)},t},k.id),_=0,$=g.map(({group:k,rows:L})=>{let E=L.map(Y=>j(Y,_++));return k===void 0?(0,M.jsx)(T.Fragment,{children:E},"ungrouped"):r.MenuGroup===void 0?(0,M.jsx)(T.Fragment,{children:E},`group:${k.name}`):(0,M.jsx)(r.MenuGroup,{label:k.label,children:E},`group:${k.name}`)}),le=(0,M.jsxs)(M.Fragment,{children:[(0,M.jsx)("input",{ref:u,className:d.search,type:"text",placeholder:F,"aria-label":t?.("search.aria")??"",value:n.search,readOnly:n.submitting,onChange:k=>{e.setSearch(k.currentTarget.value)}}),n.submitting&&(0,M.jsx)("div",{className:d.status,children:t?.("status.applying")??""}),!n.submitting&&p.length===0&&(0,M.jsx)("div",{className:d.status,children:H}),p.length>0&&(0,M.jsx)("div",{ref:l,role:"listbox","aria-label":t?.("listbox.aria")??"",className:d.viewport,children:$})]}),Q={className:d.card,style:{maxHeight:A},"aria-label":t?.("overlay.aria")??It,onKeyDown:D};return r.MenuSurface===void 0?(0,M.jsx)("div",{ref:c,...Q,children:le}):(0,M.jsx)(r.MenuSurface,{ref:c,...Q,children:le})}function At(e){let n=e.findIndex(t=>t.active===!0);return n===-1?0:n}function Ot(e,n){return e.length===0?0:Math.min(Math.max(n,0),e.length-1)}function ii(e,n,t){let r=e.useAnchoredMaxHeight;return r===void 0?Pt:r(n,Pt,t)}var V=require("react");var dn="application/x-dsh-composer+json";var ai=Object.freeze({png:"image/png",jpg:"image/jpeg",jpeg:"image/jpeg",webp:"image/webp",gif:"image/gif",bmp:"image/bmp",svg:"image/svg+xml",avif:"image/avif",heic:"image/heic",heif:"image/heif",tif:"image/tiff",tiff:"image/tiff"});function Dt(e){return JSON.stringify({v:1,text:e.text,attachments:e.attachments.map(n=>({path:n.path,name:n.name,type:n.type,kind:n.kind}))})}function _t(e){if(typeof e!="string"||e==="")return;let n;try{n=JSON.parse(e)}catch{return}if(n===null||typeof n!="object")return;let t=n;if(t.v!==1)return;let r=typeof t.text=="string"?t.text:"",o=Array.isArray(t.attachments)?t.attachments:[],i=[];for(let a of o){if(a===null||typeof a!="object")continue;let s=a,c=s.path;typeof c!="string"||c===""||i.push({path:c,name:typeof s.name=="string"&&s.name!==""?s.name:cn(c),type:typeof s.type=="string"?s.type:"",kind:s.kind==="image"?"image":"file"})}return{text:r,attachments:i}}function un(e,n){if(n.length===0)return e;let t=n.join(`
`);return e===""?t:`${e.replace(/\n+$/u,"")}

${t}`}function Mt(e){if(e==="")return;let n=e.split(`
`),t=[],r=n.length;for(let i=n.length-1;i>=0;i-=1){let a=n[i]??"";if(a.trim()===""){if(t.length>0){r=i;continue}continue}let s=si(a);if(s===void 0)break;t.unshift(s),r=i}return t.length===0?void 0:{text:n.slice(0,r).join(`
`).replace(/\n+$/u,""),paths:t}}function si(e){let n=e.trim();if(n.startsWith("@")&&(n=n.slice(1)),n.startsWith('"')&&n.endsWith('"')&&n.length>1&&(n=n.slice(1,-1)),n!==""&&li(n)&&!/[\u0000-\u001f\u007f]/u.test(n)&&!/["\u2018\u2019\u201c\u201d\u300c\u300d\u300e\u300f\u3002\uff01\uff1f\uff1b\uff1a\uff0c\u3001\u2026*?;<>|&$`!#=]/u.test(n)&&!/(?:^|\s)-{1,2}\S/u.test(n)&&!/ line:\d+(?:-\d+)?$/u.test(n))return n}function li(e){return e.startsWith("/")||/^[A-Za-z]:[/\\]/u.test(e)||e.startsWith("\\\\")}function Ft(e){let n=/\.([A-Za-z0-9]+)$/u.exec(e);if(n!==null)return ai[n[1]?.toLowerCase()??""]}function cn(e){return e.split(/[\\/]/u).filter(t=>t!=="").at(-1)??e}function Wt(e,n){let t=new Set(n),r=[],o=[];for(let i of e){if(t.has(i.path)){o.push(i.path);continue}t.add(i.path),r.push(i)}return{accepted:r,duplicates:o}}var ce=require("react/jsx-runtime"),di="data-dsh-better-attach-item",ui="data-dsh-better-attach-selected",ci=4500,fi=new Set(["a","c","x","insert"]),pi=new Set(["meta","control","shift","alt","altgraph","capslock","os"]),gi=/\s/u;function Ht(e){function n(t){let r=e.native();return r===void 0?null:(0,ce.jsx)(mi,{native:r,props:t,deps:e})}return n}function mi({native:e,props:n,deps:t}){let r=(0,V.useRef)(null),[o,i]=(0,V.useState)(!1),[a,s]=(0,V.useState)(null),c=(n.attachments??[]).length>0,u=(0,V.useRef)(n);u.current=n;let l=(0,V.useRef)(o);l.current=o;let d=(p,g)=>n.t?.(p,g)??t.translate()?.(p,g)??"",f=(0,V.useRef)(d);return f.current=d,(0,V.useEffect)(()=>{let p=r.current;if(p===null)return;let g=p.querySelector('[role="group"]');if(g!==null)for(let b of Array.from(g.children)){if(!(b instanceof HTMLElement))continue;b.toggleAttribute(di,!0);let h=wi(b);h!==null&&h.toggleAttribute(ui,o)}},[o,n.attachments]),(0,V.useEffect)(()=>{if(a===null)return;let p=globalThis.setTimeout(()=>{s(null)},ci);return()=>{globalThis.clearTimeout(p)}},[a]),(0,V.useEffect)(()=>{let p=r.current;if(p===null)return;let g=p.closest("[data-composer-card]");if(!(g instanceof HTMLElement))return;let b=g.ownerDocument,h=m=>(m instanceof Element?m:m instanceof Node?m.parentElement:null)?.closest("[contenteditable]")??null,w=()=>{l.current&&i(!1)},I=()=>{let m=g.ownerDocument.getSelection();return m!==null&&!m.isCollapsed&&m.toString()!==""},P=m=>m instanceof Node&&g.contains(m),A=m=>{let O=m.key.toLowerCase();if(pi.has(O))return;let D=m.metaKey||m.ctrlKey;if(D&&!m.altKey&&O==="a"){P(m.target)&&h(m.target)?.getAttribute("contenteditable")==="true"&&i(!0);return}if(D&&!m.altKey&&O==="c"&&l.current&&P(m.target)&&!I()){m.preventDefault(),yi(u.current,t,s,f.current);return}D&&!m.altKey&&fi.has(O)||w()},N=()=>{w()},z=m=>{let D=u.current.attachments??[],F=m.clipboardData;if(!l.current||D.length===0||F===null)return;let H=[],j=[];for(let _ of D){let $=t.pathOf(_.file);if($===""){j.push(_.file.name);continue}H.push({path:$,name:_.file.name,type:_.file.type,kind:_.kind})}if(H.length>0){let _=F.getData("text/plain");F.setData(dn,Dt({text:_,attachments:H})),F.setData("text/plain",un(_,H.map($=>$.path)))}j.length>0&&s(f.current("attach.copySkipped",{count:String(j.length)}))},v=m=>{let O=m.clipboardData;if(O===null||h(m.target)===null||Array.from(O.types).includes("Files"))return;let D=()=>u.current,F=_t(O.getData(dn)),H=F===void 0?Mt(O.getData("text/plain")):void 0;if(F===void 0&&H===void 0)return;let j=hi(u.current.phase?.(),f.current);if(j!==void 0){m.preventDefault(),m.stopPropagation(),s(j);return}if(m.preventDefault(),m.stopPropagation(),w(),F!==void 0){Bt(F,D,t,s,f.current);return}H!==void 0&&Bt({text:H.text,attachments:H.paths.map(_=>{let $=Ft(_)??"";return{path:_,name:cn(_),type:$,kind:$===""?"file":"image"}})},D,t,s,f.current)};b.addEventListener("keydown",A,!0),g.addEventListener("paste",v,!0);let S=m=>{let O=m.relatedTarget;O instanceof Node&&g.contains(O)||w()};return g.addEventListener("focusout",S),b.addEventListener("copy",z),b.addEventListener("pointerdown",N,!0),()=>{b.removeEventListener("keydown",A,!0),b.removeEventListener("copy",z),g.removeEventListener("paste",v,!0),g.removeEventListener("focusout",S),b.removeEventListener("pointerdown",N,!0)}},[t]),(0,ce.jsxs)("div",{ref:r,className:c?"dshBetter_railHost":"dshBetter_railHostEmpty",children:[(0,ce.jsx)(e,{...n}),a!==null&&(0,ce.jsx)("div",{className:"dshBetter_attachNotice",role:"status",children:a})]})}function hi(e,n){return ne(e)?n("attach.pasteBusy"):void 0}function yi(e,n,t,r){let o=e.attachments??[],i=[],a=0;for(let s of o){let c=n.pathOf(s.file);c===""?a+=1:i.push(c)}i.length>0&&globalThis.navigator?.clipboard?.writeText(un("",i)).catch(()=>{t(r("attach.copyFailed"))}),a>0&&t(r("attach.copySkipped",{count:String(a)}))}function Bt(e,n,t,r,o){let i=n();if(fn(i,e.text),e.attachments.length===0)return;let a=t.reader(),s=i.sessionId;if(a===void 0||s===void 0){fn(i,e.attachments.map(l=>l.path).join(`
`));return}let c=(i.attachments??[]).map(l=>t.pathOf(l.file)).filter(l=>l!==""),{accepted:u}=Wt(e.attachments,c);u.length!==0&&(async()=>{let l=[],d=[],f=0;for(let g of u){let b=await bi(a,s,g);b.kind==="file"?l.push(b.file):b.kind==="mention"?d.push(b.mention):f+=1}let p=n();d.length>0&&fn(p,d.join(" ")),l.length>0&&p.onAddFiles?.(l),f>0&&r(o("attach.pasteMissing",{count:String(f)})),d.length>0&&r(o("attach.pasteReferenced",{count:String(d.length)}))})()}function fn(e,n){if(n==="")return;let t=e.inputActions,r=t?.captureInsertion?.();t?.insertText===void 0||r===void 0||t.insertText(n,r)}async function bi(e,n,t){let r=await e.readBytes?.(n,t.path,{});if(r!==void 0&&r.ok)return{kind:"file",file:new File([r.value.data],t.name,{type:t.type})};let o=await e.stat?.(n,t.path);return o!==void 0&&o.ok?{kind:"mention",mention:ki(t.path)}:{kind:"missing"}}function wi(e){let n=e.querySelector("img")?.parentElement;if(n!=null)return n;let t=e.firstElementChild;return t instanceof HTMLElement?t:null}function ki(e){return gi.test(e)?`@"${e}"`:`@${e}`}var xi="better.focusComposer",vi=Object.freeze(["focus input","focus composer","message input"]),xe="command.focusComposer",Si=Object.freeze(["page","editable","terminal"]),Ci=Object.freeze({"desktop:macos":{code:"Space",modifiers:["primary"]},"desktop:windows":{code:"Space",modifiers:["primary","shift"]},"web:macos":{code:"Space",modifiers:["primary","shift"]},"web:windows":{code:"Space",modifiers:["primary","shift"]}}),Li="[data-composer-input], [role='textbox'][aria-multiline='true']";function zt(e){return e===void 0||typeof e.querySelector!="function"?!1:e.querySelector(Li)!=null}function pn(e,n){if(e===null||typeof e!="object")return;let t=e.get;if(typeof t=="function"){let r=t.call(e,n);return r===null?void 0:r}return e[n]}var Gt=e=>typeof e=="string"&&e!==""?e:void 0;function $t(e){let t=pn(e,"uiSession")?.adapter?.current?.getSnapshot?.();if(t!==void 0)return Gt(t.key);let r=pn(e,"sessions");return Gt(r?.list?.getSnapshot?.()?.current)}function qt(e,n){try{let t=e.sessions?.scope?.(n);if(t===void 0)return!1;let o=pn(t,"conversation")?.input?.for?.(t);return o===void 0||typeof o.focus!="function"?!1:(o.focus(),!0)}catch{return!1}}function Ei(e){return(n={})=>{if(n.modal!=null)return{status:"pass"};if(!e.composerMounted())return{status:"pass"};let t=e.currentSessionId();return t===void 0?{status:"pass"}:{status:"handled",run:()=>{e.focusComposer(t)}}}}function Ri(e,n){return{id:xi,label:n,aliases:vi,defaults:Ci,regions:Si,modals:[],resolve:Ei(e)}}function Vt(e,n,t,r){if(e===void 0||typeof e.register!="function")return()=>{};try{return e.register(Ri(n,t))}catch(o){return r?.(o instanceof Error?o.message:String(o)),()=>{}}}var jt=Object.freeze({zh:{"overlay.aria":"\u9009\u62E9\u6A21\u578B","listbox.aria":"\u6A21\u578B\u5339\u914D\u9879","search.aria":"\u641C\u7D22\u4F9B\u5E94\u5546\u6216\u6A21\u578B","search.placeholder":"\u641C\u7D22\u4F9B\u5E94\u5546\u6216\u6A21\u578B\u2026","status.empty":"\u6CA1\u6709\u53EF\u7528\u7684\u6A21\u578B\u3002","status.applying":"\u6B63\u5728\u5207\u6362\u2026",retry:"\u91CD\u8BD5","trigger.selectAria":"\u9009\u62E9\u6A21\u578B","trigger.aria":"\u5F53\u524D\u6A21\u578B {model}\uFF0C\u70B9\u51FB\u5207\u6362","trigger.ariaEffort":"\u5F53\u524D\u6A21\u578B {model}\uFF0C\u63A8\u7406\u7B49\u7EA7 {effort}\uFF0C\u70B9\u51FB\u5207\u6362","trigger.fallback":"\u9009\u62E9\u6A21\u578B","trigger.loading":"\u52A0\u8F7D\u6A21\u578B\u2026",[xe]:"\u805A\u7126\u8F93\u5165\u6846","attach.copySkipped":"{count} \u4E2A\u9644\u4EF6\u6765\u81EA\u526A\u8D34\u677F\u3001\u6CA1\u6709\u672C\u5730\u8DEF\u5F84\uFF0C\u672A\u590D\u5236","attach.pasteMissing":"{count} \u4E2A\u9644\u4EF6\u5BF9\u5E94\u7684\u6587\u4EF6\u5DF2\u4E0D\u5B58\u5728\uFF0C\u672A\u7C98\u8D34","attach.pasteReferenced":"{count} \u4E2A\u9644\u4EF6\u8D85\u51FA\u5355\u6B21\u8BFB\u53D6\u4E0A\u9650\uFF0C\u5DF2\u6539\u4E3A\u8DEF\u5F84\u5F15\u7528","attach.copyFailed":"\u6D4F\u89C8\u5668\u62D2\u7EDD\u4E86\u8FD9\u6B21\u526A\u8D34\u677F\u5199\u5165","attach.pasteBusy":"\u6D88\u606F\u6B63\u5728\u53D1\u9001\uFF0C\u7A0D\u540E\u518D\u7C98\u8D34","compaction.reading":"\u538B\u7F29 {count} \u6B21","compaction.readingOne":"\u538B\u7F29 1 \u6B21","compaction.tooltip":"\u672C\u4F1A\u8BDD\u4E0A\u4E0B\u6587\u5DF2\u538B\u7F29 {count} \u6B21","compaction.tooltipWithFailures":"\u672C\u4F1A\u8BDD\u4E0A\u4E0B\u6587\u5DF2\u538B\u7F29 {count} \u6B21\uFF0C\u53E6\u6709 {failures} \u6B21\u538B\u7F29\u5931\u8D25","tabs.nav":"Tab \u7BA1\u7406","tabs.heading":"Tab \u7BA1\u7406","tabs.chat":"\u5BF9\u8BDD","tabs.chatNote":"\u56FA\u5B9A\u5728\u6807\u7B7E\u680F\u6700\u524D\uFF0C\u4E0D\u53EF\u9690\u85CF\u6216\u62D6\u52A8","tabs.empty":"\u8FD8\u6CA1\u6709\u63D2\u4EF6\u6CE8\u518C\u4F1A\u8BDD\u6807\u7B7E\u3002","tabs.show":"\u5728\u6807\u7B7E\u680F\u663E\u793A{label}","tabs.hide":"\u4ECE\u6807\u7B7E\u680F\u9690\u85CF{label}","alias.nav":"\u6280\u80FD\u522B\u540D","alias.heading":"\u6280\u80FD\u522B\u540D","alias.prefix.title":"\u9700\u8981\u659C\u6760\u524D\u7F00","alias.prefix.on":"\u6253\u5F00\u5219\u9700\u8981\u8F93\u5165 \u201C/\u201D \u8FDB\u884C\u5339\u914D","alias.prefix.off":"\u6253\u5F00\u5219\u65E0\u9700\u8F93\u5165 \u201C/\u201D \u8FDB\u884C\u5339\u914D","alias.table.keyword":"\u5173\u952E\u8BCD","alias.table.target":"\u6280\u80FD\u6216\u547D\u4EE4","alias.table.params":"\u53C2\u6570","alias.table.paramsPlaceholder":"\u53EF\u9009\uFF0C\u5982 run","alias.table.actions":"\u64CD\u4F5C","alias.add":"\u6DFB\u52A0\u522B\u540D","alias.remove":"\u5220\u9664\u522B\u540D {keyword}","alias.unnamed":"\uFF08\u672A\u547D\u540D\uFF09","alias.empty":"\u8FD8\u6CA1\u6709\u522B\u540D\u3002\u4F8B\u5982\uFF1Awf \u2192 /flow-workflow run","alias.footnote":"\u8F93\u5165\u5173\u952E\u8BCD\u540E\u4ECE\u9762\u677F\u9009\u62E9\u5373\u53EF\u63D2\u5165\u5B8C\u6574\u8C03\u7528\uFF1B\u6539\u5B8C\u7ACB\u5373\u751F\u6548\u3002","alias.menu.section":"\u6280\u80FD\u522B\u540D","alias.menu.params":"\u53C2\u6570\uFF1A{value}","skill.metadata":"\u5143\u6570\u636E","skill.path":"\u5730\u5740","skill.usage.session":"\u672C\u4F1A\u8BDD\u8C03\u7528","skill.usage.workspace":"\u672C\u5DE5\u4F5C\u533A\u8C03\u7528","skill.params":"\u53C2\u6570","skill.hint.insert":"\u70B9\u51FB\u63D2\u5165","continue.label":"\u7EE7\u7EED","continue.sending":"\u7EE7\u7EED\u4E2D\u2026","link.copy":"\u590D\u5236","link.copied":"\u5DF2\u590D\u5236","link.copyFailed":"\u590D\u5236\u5931\u8D25","link.copyAria":"\u590D\u5236\u94FE\u63A5\u5730\u5740","layout.nav":"\u5E03\u5C40","layout.heading":"\u5E03\u5C40","layout.expandWindow":"\u6253\u5F00\u53F3\u4FA7\u680F\u65F6\u7A97\u53E3\u5411\u53F3\u6269\u5C55","layout.expandWindowHint":"\u4EC5\u5728\u684C\u9762\u7AEF\u3001\u53F3\u4FA7\u680F\u4EE5\u666E\u901A\u65B9\u5F0F\u6253\u5F00\u4E14\u5C4F\u5E55\u53F3\u4FA7\u6709\u7A7A\u95F4\u65F6\u751F\u6548\uFF1B\u5168\u5C4F\u4E0E\u6D4F\u89C8\u5668\u7AEF\u4FDD\u6301\u539F\u751F\u5E03\u5C40\u3002"},en:{"overlay.aria":"Select a model","listbox.aria":"Matching models","search.aria":"Search providers or models","search.placeholder":"Search providers or models\u2026","status.empty":"No models available.","status.applying":"Switching\u2026",retry:"Retry","trigger.selectAria":"Select model","trigger.aria":"Current model {model}, click to change","trigger.ariaEffort":"Current model {model}, reasoning effort {effort}, click to change","trigger.fallback":"Select model","trigger.loading":"Loading models\u2026",[xe]:"Focus message input","attach.copySkipped":"{count} attachment(s) came from the clipboard with no local path and were not copied","attach.pasteMissing":"{count} attachment(s) no longer exist and were not pasted","attach.pasteReferenced":"{count} attachment(s) exceed the read limit and became path references","attach.copyFailed":"The browser refused this clipboard write","attach.pasteBusy":"A message is being sent; paste again in a moment","compaction.reading":"{count} compactions","compaction.readingOne":"1 compaction","compaction.tooltip":"This session's context was compressed {count} time(s)","compaction.tooltipWithFailures":"This session's context was compressed {count} time(s), with {failures} failed attempt(s)","tabs.nav":"Tabs","tabs.heading":"Tabs","tabs.chat":"Chat","tabs.chatNote":"Pinned to the front of the tab bar; it cannot be hidden or reordered","tabs.empty":"No plugin has registered a conversation tab yet.","tabs.show":"Show {label} in the tab bar","tabs.hide":"Hide {label} from the tab bar","alias.nav":"Skill aliases","alias.heading":"Skill aliases","alias.prefix.title":"Require a slash prefix","alias.prefix.on":"To open, type \u201C/\u201D to match","alias.prefix.off":"To open, type the keyword without \u201C/\u201D to match","alias.table.keyword":"Keyword","alias.table.target":"Skill or command","alias.table.params":"Arguments","alias.table.paramsPlaceholder":"Optional, e.g. run","alias.table.actions":"Actions","alias.add":"Add alias","alias.remove":"Delete alias {keyword}","alias.unnamed":"(unnamed)","alias.empty":"No aliases yet. For example: wf \u2192 /flow-workflow run","alias.footnote":"Type a keyword and pick from the panel to insert the full invocation; changes apply immediately.","alias.menu.section":"Skill aliases","alias.menu.params":"args: {value}","skill.metadata":"Metadata","skill.path":"Path","skill.usage.session":"This session","skill.usage.workspace":"This workspace","skill.params":"Arguments","skill.hint.insert":"Click to insert","continue.label":"Continue","continue.sending":"Continuing\u2026","link.copy":"Copy","link.copied":"Copied","link.copyFailed":"Copy failed","link.copyAria":"Copy link address","layout.nav":"Layout","layout.heading":"Layout","layout.expandWindow":"Expand the window when the right panel opens","layout.expandWindowHint":"Desktop only, for the normal right-panel presentation, and only when the screen has room on the right. Fullscreen and the browser keep the native layout."}});var Ut="dsh-better-effort",Ti=`
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
`;function Kt(e){if(e===void 0)return()=>{};if(e.getElementById(Ut)!==null)return()=>{};let n=e.createElement("style");return n.id=Ut,n.textContent=Ti,e.head.append(n),()=>{n.remove()}}var Xt="dsh-better.layout-widths",fe=Object.freeze({sidebar:null,rightbar:null});function Zt(e){return typeof e=="number"&&Number.isFinite(e)&&e>0}function We(e){if(e===void 0)return fe;let n;try{n=e.getItem(Xt)}catch{return fe}if(n===null||n==="")return fe;let t;try{t=JSON.parse(n)}catch{return fe}if(typeof t!="object"||t===null||Array.isArray(t))return fe;let r=t;return{sidebar:Yt(r.sidebar),rightbar:Yt(r.rightbar)}}function Qt(e,n){if(e===void 0)return;let t={};n.sidebar!==null&&(t.sidebar=Math.round(n.sidebar)),n.rightbar!==null&&(t.rightbar=Math.round(n.rightbar));try{e.setItem(Xt,JSON.stringify(t))}catch{}}function Yt(e){return Zt(e)?Math.round(e):null}function er(e){if(typeof e!="string")return fe;let n=e.trim().split(/\s+/).filter(t=>t!=="");return{sidebar:Jt(n[0]),rightbar:Jt(n[2])}}function Jt(e){if(e===void 0)return null;let n=/^([0-9]+(?:\.[0-9]+)?)px$/.exec(e);if(n===null)return null;let t=Number(n[1]);return Zt(t)?Math.round(t):null}function nr(e,n,t=null){return t==="sidebar"?n.sidebar!==null&&n.sidebar!==e.sidebar?{sidebar:n.sidebar}:{}:t==="rightbar"?n.rightbar!==null&&n.rightbar!==e.rightbar?{rightbar:n.rightbar}:{}:n.sidebar!==null&&n.sidebar!==e.sidebar?{sidebar:n.sidebar}:n.rightbar!==null&&n.rightbar!==e.rightbar?{rightbar:n.rightbar}:{}}function tr(e,n){return{sidebar:n.sidebar??e.sidebar,rightbar:n.rightbar??e.rightbar}}function rr(e){let n=[];return e.sidebar!==null&&n.push({column:"sidebar",width:e.sidebar}),e.rightbar!==null&&n.push({column:"rightbar",width:e.rightbar}),n}var Pi="[data-shell-bottom]",Ai="[data-side]",Oi='[class*="_sidebarCol"]',Ii='[class*="_rightbarCol"]',Ni=600;function Di(e){let t=e?.layout?.panels;if(typeof t!="object"||t===null)return;let r=t;if(!(typeof r.setSidebar!="function"&&typeof r.setRightbar!="function"))return r}function ar(e,n){let t=Di(e);if(t===void 0)return!1;let r=!1;for(let{column:o,width:i}of rr(n)){let a=o==="sidebar"?t.setSidebar:t.setRightbar;if(a!==void 0)try{a.call(t,i),r=!0}catch{}}return r}function or(e){return e.querySelector(Pi)?.parentElement??null}function _i(e,n){let t=e.hasAttribute("data-sidebar-collapsed"),r=e.hasAttribute("data-rightbar-collapsed"),o=er(n?.getComputedStyle(e).gridTemplateColumns);return{sidebar:t?null:o.sidebar??ir(e.querySelector(Oi)),rightbar:r?null:o.rightbar??ir(e.querySelector(Ii))}}function ir(e){if(e===null)return null;let n=e.getBoundingClientRect().width;return Number.isFinite(n)&&n>0?Math.round(n):null}function sr(e){let{document:n,storage:t}=e,r=null,o=null,i=0,a=!1,s=null,c=()=>n.defaultView,u=()=>(r!==null&&r.isConnected||(r=or(n)),r),l=()=>{let h=u();return h===null?null:_i(h,c())},d=h=>{let w=h?.getAttribute("data-side");return w==="sidebar"||w==="rightbar"?w:null},f=h=>{let w=l();if(w===null)return;let I=nr(h.before,w,h.side);I.sidebar===void 0&&I.rightbar===void 0||Qt(t,tr(We(t),I))},p=h=>{if(s!==null)return;let w=h.target,I=typeof w?.closest=="function"?w.closest(Ai):null;if(I===null)return;let P=l();P!==null&&(s={side:d(I),before:P})},g=()=>{let h=s;if(s=null,h===null)return;let w=c()?.requestAnimationFrame;if(w===void 0){f(h);return}w.call(c(),()=>f(h))},b=()=>{if(o=null,a)return;let h=or(n);if(h!==null){r=h;return}if(i>=Ni)return;i+=1;let w=c()?.requestAnimationFrame;w!==void 0&&(o=w.call(c(),b))};return{attach(){a=!1,i=0;let h=c();return h?.addEventListener("pointerdown",p,!0),h?.addEventListener("pointerup",g,!0),h?.addEventListener("pointercancel",g,!0),b(),()=>{a=!0,s=null,r=null,h?.removeEventListener("pointerdown",p,!0),h?.removeEventListener("pointerup",g,!0),h?.removeEventListener("pointercancel",g,!0),o!==null&&h?.cancelAnimationFrame(o),o=null}}}}var lr="dsh-better.panel-grow",pe=Object.freeze({expandWindow:!0}),Mi=2;function Be(e){if(e===void 0)return pe;let n;try{n=e.getItem(lr)}catch{return pe}if(n===null||n==="")return pe;let t;try{t=JSON.parse(n)}catch{return pe}if(typeof t!="object"||t===null||Array.isArray(t))return pe;let r=t.expandWindow;return typeof r=="boolean"?{expandWindow:r}:pe}function dr(e,n){if(e!==void 0)try{e.setItem(lr,JSON.stringify({expandWindow:n.expandWindow}))}catch{}}function ur(e){let{growth:n,geometry:t,panelWidth:r}=e;return!e.enabled||!e.desktop||!e.track||e.fullscreen||n!==null||r<=0?{action:null,growth:n}:Fi(t)<r?{action:null,growth:null}:{action:{kind:"resize",width:Math.round(t.outerWidth+r),height:t.outerHeight},growth:{base:t.outerWidth,added:r}}}function cr(e){let{growth:n,geometry:t}=e;return n===null||e.fullscreen||!e.desktop?{action:null,growth:null}:Math.abs(t.outerWidth-(n.base+n.added))>Mi?{action:null,growth:null}:{action:{kind:"resize",width:Math.round(n.base),height:t.outerHeight},growth:null}}function Fi(e){return e.screenX<0?0:e.availWidth-e.screenX-e.outerWidth}var pr=require("react"),te=require("react/jsx-runtime");function Wi(e){return{heading:e("layout.heading"),row:e("layout.expandWindow"),hint:e("layout.expandWindowHint")}}function gr(e){let n=Wi(e.translate),[t,r]=(0,pr.useState)(()=>e.preference().expandWindow);return(0,te.jsxs)("section",{className:"dsh-better-grow-page","data-testid":"panel-grow-section",children:[(0,te.jsx)("h2",{className:"dsh-better-grow-heading",children:n.heading}),(0,te.jsxs)("label",{className:"dsh-better-grow-row",children:[(0,te.jsx)("span",{className:"dsh-better-grow-title",children:n.row}),(0,te.jsx)("input",{type:"checkbox",className:"dsh-better-grow-switch","data-testid":"panel-grow-switch",checked:t,onChange:o=>{let i=o.target.checked;r(i),e.save({expandWindow:i})}})]}),(0,te.jsx)("p",{className:"dsh-better-grow-hint","data-testid":"panel-grow-hint",children:n.hint})]})}var Bi=`
[data-testid="panel-grow-section"] {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 720px;
  color: var(--dsw-alias-label-primary);
}
.dsh-better-grow-heading {
  margin: 0;
  padding-bottom: 8px;
  font-size: 14px;
  line-height: 22px;
  font-weight: 500;
}
.dsh-better-grow-row {
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  padding: 12px 0;
  border-bottom: 0.5px solid var(--dsw-alias-border-l2);
  font-size: 14px;
  line-height: 22px;
  cursor: pointer;
}
.dsh-better-grow-switch {
  flex-shrink: 0;
  width: 16px;
  height: 16px;
  margin: 0;
  accent-color: var(--dsw-alias-state-business-primary);
  cursor: pointer;
}
.dsh-better-grow-hint {
  margin: 0;
  padding-top: 8px;
  color: var(--dsw-alias-label-tertiary);
  font-size: 12px;
  line-height: 18px;
}
`,fr="dsh-better/panel-grow.css";function mr(e){let n=`style[data-plugin-css=${JSON.stringify(fr)}]`;if(e.querySelector(n)!==null)return()=>{};let t=e.createElement("style");return t.dataset.plugin="dsh-better",t.dataset.pluginCss=fr,t.textContent=Bi,e.head.append(t),()=>t.remove()}var Hi="[data-sidebar-right-session]:not([hidden]) [data-sidebar-right-panel]",Gi="[data-sidebar-right-panel]",gn=Symbol.for("dsh-better.panel-grow");function wr(e){let{layout:n,window:t,document:r}=e;if(hr(n)!==void 0)return()=>{};let o=n.openRightbar,i=n.closeRightbar,a=!1,s=null,c=!1,u=(f,p)=>{o.call(n,f,p),a=p;try{let g=r.documentElement.dataset.fullscreen==="true",b=ur({enabled:Be(e.storage).expandWindow,desktop:e.desktop,track:f,fullscreen:g||p,panelWidth:zi(r),geometry:yr(t),growth:s});br(t,b.action),s=b.growth}catch{}},l=()=>{i.call(n);try{let f=r.documentElement.dataset.fullscreen==="true",p=cr({desktop:e.desktop,fullscreen:f||a,geometry:yr(t),growth:s});br(t,p.action),s=p.growth}catch{}};return n.openRightbar=u,n.closeRightbar=l,Object.defineProperty(n,gn,{value:{open:u,close:l},enumerable:!1,configurable:!0}),()=>{c||(c=!0,s=null,n.openRightbar===u&&(n.openRightbar=o),n.closeRightbar===l&&(n.closeRightbar=i),hr(n)?.open===u&&Reflect.deleteProperty(n,gn))}}function hr(e){let n=e[gn];if(typeof n!="object"||n===null)return;let t=n;if(!(typeof t.open!="function"||typeof t.close!="function"))return t}function zi(e){let t=(e.querySelector(Hi)??e.querySelector(Gi))?.getBoundingClientRect().width??0;return Number.isFinite(t)?t:0}function yr(e){return{outerWidth:e.outerWidth,outerHeight:e.outerHeight,screenX:e.screenX,availWidth:e.screen.availWidth}}function br(e,n){if(n!==null)try{e.resizeTo(n.width,n.height)}catch{}}var kr="sessionCompaction";var xr="dsh-better-compaction",He="dshBetter_compactionStat",$i=`
.${He} {
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

[data-composer-dock]:has([data-workbench-dock="term-dock"]) .${He} {
  margin-left: 12px;
}
`;function vr(e){if(e===void 0)return()=>{};if(e.getElementById(xr)!==null)return()=>{};let n=e.createElement("style");return n.id=xr,n.textContent=$i,e.head.append(n),()=>{n.remove()}}var Cr=require("react/jsx-runtime");function qi(e,n){if(e===void 0||n===void 0)return null;let{compactions:t,failures:r}=e;if(!Number.isSafeInteger(t)||t<=0)return null;let o=t===1?n("compaction.readingOne"):n("compaction.reading",{count:t}),i=Number.isSafeInteger(r)&&r>0?n("compaction.tooltipWithFailures",{count:t,failures:r}):n("compaction.tooltip",{count:t});return{text:o,tooltip:i}}function Vi(){}function Sr({useProjection:e,t:n}){let r=qi((e??Vi)(kr),n);return r===null?null:(0,Cr.jsx)("span",{className:He,"data-dsh-better":"compaction-stat",title:r.tooltip,children:r.text})}var mn="conversation.composer.dock",Lr="better-compaction";var wn=require("react");var Er="continue",hn="conversation.chat.turnTail",Rr="better-continue";var ji=new Set(["aborted","interrupted"]);function Tr(e){let n=e.end?.reason?.kind;return n===void 0||!ji.has(n)?!1:e.latest&&!e.pending}var Pr="dsh-better-continue",ge="dshBetter_continue",yn="dshBetter_continueError",Ui=`
.${ge} {
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

.${ge}:hover:not(:disabled) {
  background: var(--dsw-alias-interactive-bg-hover);
  color: var(--dsw-alias-label-primary);
  border-color: var(--dsw-alias-border-l1);
}

.${ge}:focus-visible {
  outline: 1px solid var(--dsw-alias-border-l1);
  outline-offset: 1px;
}

/* Disabled covers both halves of the pressed state: the request is in flight, so
   the button must not invite a second one, and the dimming is what says so. */
.${ge}:disabled {
  cursor: default;
  opacity: 0.6;
}

/* The failure line sits under the button in the same column. It is a sibling
   rather than a wrapper so the button keeps its own alignment. */
.${yn} {
  align-self: flex-end;
  color: var(--dsw-alias-state-business-primary);
  font-size: var(--dsh-content-font-size-secondary, 13px);
  line-height: calc(20px + var(--dsh-content-font-delta-secondary, 0px));
}
`;function Ar(e){if(e===void 0)return()=>{};if(e.getElementById(Pr)!==null)return()=>{};let n=e.createElement("style");return n.id=Pr,n.textContent=Ui,e.head.append(n),()=>{n.remove()}}var ie=require("react/jsx-runtime");function Ki(e){return e instanceof Error?e.message:String(e)}function Yi(e,n){return e.length>0&&e[e.length-1]===n}function bn(){}function Or({turn:e,sessionId:n,useChat:t,useSession:r,useInput:o,t:i,submitContinue:a}){let s=t??bn,c=r??bn,u=o??bn,l=s(A=>A),d=c(A=>A),f=u(A=>A),[p,g]=(0,wn.useState)(!1),[b,h]=(0,wn.useState)(null),w=e!==void 0&&Yi(l?.timeline.turnOrder??[],e.turn),I=(d?.pendingSubmissions?.length??0)>0||ne(f?.phase);return e===void 0||n===void 0||a===void 0||i===void 0||!Tr({end:e.end?.data,latest:w,pending:I})?null:(0,ie.jsxs)(ie.Fragment,{children:[(0,ie.jsx)("button",{type:"button",className:ge,"data-testid":"better-continue",disabled:p,onClick:()=>{g(!0),h(null),a(n).catch(A=>{g(!1),h(Ki(A))})},children:i(p?"continue.sending":"continue.label")}),b===null?null:(0,ie.jsx)("span",{className:yn,role:"alert",children:b})]})}var Ir="dsh-better-settings-surface",Ji='[data-shortcut-modal="settings"]',Xi=`
${Ji} {
  background: var(--dsw-alias-bg-layer-2);
  background: rgb(from var(--dsw-alias-bg-layer-2) r g b / 1);
}
`;function Nr(e){if(e===void 0)return()=>{};if(e.getElementById(Ir)!==null)return()=>{};let n=e.createElement("style");return n.id=Ir,n.textContent=Xi,e.head.append(n),()=>{n.remove()}}var kn="dsh-better-link-hover",K="dshBetter_linkHover",Ge="dshBetter_linkHoverAddress",me="dshBetter_linkHoverCopy",Dr=`
.${K} {
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
.${K}::before,
.${K}::after {
  content: "";
  position: absolute;
  left: -12px;
  right: -12px;
  height: 20px;
}
.${K}::before {
  top: -20px;
}
.${K}::after {
  bottom: -20px;
}
.${K}[hidden] {
  display: none;
}
.${Ge} {
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
.${me} {
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
.${me}:hover {
  background: var(--dsw-alias-interactive-bg-hover);
  color: var(--dsw-alias-label-primary);
}
.${me}:focus-visible {
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
  .${K} {
    animation: none;
  }
}
`;function _r(e){if(e===void 0)return()=>{};if(e.getElementById(kn)!==null)return()=>{};let n=e.createElement("style");return n.id=kn,n.textContent=Dr,e.head.append(n),()=>{n.remove()}}var Zi=1200,Qi=300,Mr=8,ae=8,ea='[data-slot="conversation.chat.flow"], [data-message-bubble]';function na(e){let n=e.trim();if(n===""||n.startsWith("#"))return!1;let t=n.replace(/[\t\n\r]/gu,"").slice(0,11).toLowerCase();return!(t.startsWith("javascript:")||t.startsWith("data:"))}function ta(e,n,t){let r=Math.max(ae,Math.min(e.left,t.width-ae-n.width)),o=e.bottom+Mr,i=e.top-Mr-n.height,a=t.height-ae*2,s;return n.height<=a&&o+n.height<=t.height-ae?s=o:n.height<=a&&i>=ae?s=i:s=Math.max(ae,Math.min(o,t.height-ae-n.height)),{left:r,top:s}}async function ra(e,n){let t=n.defaultView?.navigator.clipboard;if(t!==void 0)try{return await t.writeText(e),!0}catch{}return oa(e,n)}function oa(e,n){if(typeof n.execCommand!="function")return!1;let t=n.createElement("textarea");t.value=e,t.setAttribute("readonly",""),t.style.position="fixed",t.style.top="-1000px",t.style.opacity="0",n.body.append(t);try{return t.select(),n.execCommand("copy")}catch{return!1}finally{t.remove()}}function Fr(e,n){let t=e.defaultView;if(t===null)return()=>{};if(t.matchMedia?.("(hover: none)")?.matches===!0)return()=>{};let r=_r(e),o=null,i=null,a=null,s=null,c=null,u=null,l=()=>{u!==null&&(clearTimeout(u),u=null)},d=()=>{if(o!==null)return o;let v=e.createElement("div");v.className=K,v.setAttribute("role","tooltip"),v.hidden=!0;let S=e.createElement("span");S.className=Ge;let m=e.createElement("button");return m.className=me,m.type="button",m.setAttribute("aria-label",n.translate("link.copyAria")),m.textContent=n.translate("link.copy"),m.addEventListener("click",O=>{O.preventDefault(),O.stopPropagation();let D=s?.href;D!==void 0&&ra(D,e).then(F=>{m.textContent=n.translate(F?"link.copied":"link.copyFailed"),c!==null&&clearTimeout(c),c=setTimeout(()=>{c=null,m.textContent=n.translate("link.copy")},Zi)})}),v.append(S,m),e.body.append(v),o=v,i=S,a=m,v},f=v=>{let S=d(),m=v.getBoundingClientRect(),O=S.getBoundingClientRect(),D=ta({left:m.left,top:m.top,right:m.right,bottom:m.bottom},{width:O.width,height:O.height},{width:t.innerWidth,height:t.innerHeight});S.style.left=`${D.left}px`,S.style.top=`${D.top}px`},p=()=>{s=null,l(),c!==null&&(clearTimeout(c),c=null),a!==null&&(a.textContent=n.translate("link.copy")),o!==null&&(o.hidden=!0)},g=(v,S)=>{let m=d();s={anchor:v,href:S},i!==null&&(i.textContent=S),m.hidden=!1,f(v)},b=v=>{if(!(v instanceof t.Element))return;let S=v.closest("a");if(S===null||S.closest(ea)===null)return;let m=S.getAttribute("href");if(m!==null&&na(m))return{anchor:S,href:m.trim()}},h=v=>o!==null&&v instanceof t.Node&&o.contains(v),w=v=>{if(h(v.target)){l();return}let S=b(v.target);S!==void 0&&(l(),g(S.anchor,S.href))},I=v=>{if(s===null)return;let S=v.relatedTarget;if(h(S)||S instanceof t.Node&&s.anchor.contains(S))return;let m=v.target;if(m instanceof t.Node){if(s.anchor.contains(m)){l(),u=setTimeout(()=>{u=null,p()},Qi);return}h(m)&&p()}},P=v=>{let S=b(v.target);S!==void 0&&g(S.anchor,S.href)},A=v=>{if(s===null)return;let S=v.relatedTarget;h(S)||S instanceof t.Node&&s.anchor.contains(S)||p()},N=v=>{v.key==="Escape"&&s!==null&&p()},z=v=>{h(v.target)||p()};return e.addEventListener("mouseover",w,!0),e.addEventListener("mouseout",I,!0),e.addEventListener("focusin",P,!0),e.addEventListener("focusout",A,!0),e.addEventListener("keydown",N,!0),e.addEventListener("scroll",z,!0),()=>{e.removeEventListener("mouseover",w,!0),e.removeEventListener("mouseout",I,!0),e.removeEventListener("focusin",P,!0),e.removeEventListener("focusout",A,!0),e.removeEventListener("keydown",N,!0),e.removeEventListener("scroll",z,!0),l(),c!==null&&(clearTimeout(c),c=null),o?.remove(),o=null,i=null,a=null,s=null,r()}}function ia(e){return typeof e=="object"&&e!==null&&"ok"in e&&e.ok===!1}async function Wr(e,n){let t=e.sessions?.binding?.(n)?.session,r=t?.prompt;if(typeof r!="function")throw new Error("\u8FD9\u4E2A\u5BBF\u4E3B\u7684\u4F1A\u8BDD\u4E0D\u652F\u6301\u53D1\u9001\u6D88\u606F");let o=await r.call(t,[{type:"text",text:Er}],"queue");if(ia(o))throw new Error("\u7EE7\u7EED\u6D88\u606F\u6CA1\u6709\u88AB\u5BBF\u4E3B\u63A5\u53D7")}var ve=require("react");function aa(e){let n=e.name.trim();return n===""?e.id:n}function xn(e,n){if(e===void 0)return{model:n};let t=aa(e.group),r=e.model.name.trim();return r===""?{model:t}:{provider:t,model:r}}function Br(e,n){let t=xn(e,n);return t.provider===void 0?t.model:`${t.provider} ${t.model}`}function sa(e){return typeof e=="string"?e:e.en??""}function ze(e,n){if(e!==void 0)try{return e(n)}catch{}return sa(n)}var W=require("react/jsx-runtime"),la="@deepseek-ai/dsh-client-ui-model-selection/ModelSelect.module.css";function da(e){if(e===void 0)return;let t=e.querySelector(`style[data-plugin-css="${la}"]`)?.textContent??"",r=a=>new RegExp(`\\.(\\w+_${a})\\{`,"u").exec(t)?.[1],o={root:r("root"),trigger:r("trigger"),triggerIcon:r("triggerIcon"),triggerLabel:r("triggerLabel"),triggerEffort:r("triggerEffort"),chevron:r("chevron")};for(let a of Object.values(o))if(a===void 0)return;let i=r("badge");return{...o,...i===void 0?{}:{badge:i}}}function Hr(e){let n=Fe(e.load),t=da(e.document);function r(o){let i=e.native();return o.available===!1||i===void 0||t===void 0?i===void 0?null:(0,W.jsx)(i,{...o}):(0,W.jsx)(ua,{props:o,primitives:n,openPicker:e.openPicker,translate:e.translate,classes:t})}return r}function ua({props:e,primitives:n,openPicker:t,translate:r,classes:o}){let{directory:i,t:a,sessionId:s,locked:c,resolveText:u}=e,l=ca(i),d=a??r(),f=l?.current??null,p=f===null&&l?.status==="loading",g=fa(l,f),b=d?.("trigger.fallback")??"",h=Br(g,b),w=xn(g,b),I=pa(g,u),P=p?d?.("trigger.loading")??"":h,A=ga(l,f,g,d),N=A===void 0?P:`${P} \xB7 ${A}`,z=p?d?.("trigger.loading")??"":f===null?d?.("trigger.selectAria")??"":A===void 0?d?.("trigger.aria",{model:P})??"":d?.("trigger.ariaEffort",{model:P,effort:A})??"",v=()=>{t(s)},S=n.IconDataOutlineRegular,m=n.IconChevronDownOutlineRegular,O=n.Tag,D=o.badge;return(0,W.jsx)("div",{className:o.root,"data-dsh-better-seat":"",children:(0,W.jsxs)("button",{type:"button",className:o.trigger,"aria-label":z,"aria-haspopup":"dialog","aria-expanded":"false",title:N,disabled:c,onClick:v,children:[S===void 0?null:(0,W.jsx)(S,{className:o.triggerIcon,size:16}),(0,W.jsx)("span",{className:o.triggerLabel,"data-provider-id":f?.provider,"data-model-id":f?.model,children:p?P:(0,W.jsxs)(W.Fragment,{children:[w.provider===void 0?null:`${w.provider} `,I===void 0||D===void 0||O===void 0?null:(0,W.jsxs)(W.Fragment,{children:[(0,W.jsx)(O,{className:D,tone:I.tone,children:I.text})," "]}),w.model]})}),A!==void 0&&(0,W.jsx)("span",{className:o.triggerEffort,children:A}),m===void 0?null:(0,W.jsx)(m,{className:o.chevron})]})})}function ca(e){let n=(0,ve.useCallback)(r=>e===void 0?()=>{}:e.subscribe(r),[e]),t=(0,ve.useCallback)(()=>e?.getSnapshot(),[e]);return(0,ve.useSyncExternalStore)(n,t)}function fa(e,n){if(!(e===void 0||n===null||n===void 0)){for(let t of e.groups)if(t.id===n.provider){for(let r of t.models)if(r.id===n.model)return{group:t,model:r}}}}function pa(e,n){let t=e?.model.badge;if(t===void 0)return;let r=ze(n,t.text);if(r!=="")return{text:r,tone:t.tone}}function ga(e,n,t,r){if(e===void 0||n===null||n===void 0)return;let o=t?.model.reasoning,i=n.reasoningEffort??o?.defaultEffort;return t===void 0?e.retainedEffort:o===void 0||i===void 0?void 0:o.efforts?.find(s=>s.id===i)?.name??i}function Gr(e){let r=e?.live?.contributions?.get("model")?.ui;return r==null?void 0:r.kind==="popupSelect"?r:void 0}function zr(e){return{sessionId:e}}function $r(){return{via:"enter",token:""}}var vn="conversation.view",Sn="settings.section",jr="tabs";var Z="chat",Ur="dsh-better.tabs",Se="[data-conversation-tabs]";function Kr(e,n){if(typeof e=="string"&&e!=="")return e;if(typeof e=="function")try{let t=e();if(typeof t=="string"&&t!=="")return t}catch{}return n}function $e(e){let n=[],t=new Set;for(let r of e)typeof r!="string"||r===""||r===Z||t.has(r)||(t.add(r),n.push(r));return n}function ma(e){if(e===void 0)return{hidden:new Set,order:[]};let n;try{n=e.getItem(Ur)}catch{return{hidden:new Set,order:[]}}if(n===null||n==="")return{hidden:new Set,order:[]};try{let t=JSON.parse(n);if(Array.isArray(t))return{hidden:new Set($e(t)),order:[]};if(t===null||typeof t!="object")return{hidden:new Set,order:[]};let r=t;return{hidden:new Set($e(Array.isArray(r.hidden)?r.hidden:[])),order:$e(Array.isArray(r.order)?r.order:[])}}catch{return{hidden:new Set,order:[]}}}function qr(e,n){if(e===void 0)return;let t={version:2,hidden:[...n.hidden].sort(),order:[...n.order]};try{e.setItem(Ur,JSON.stringify(t))}catch{}}function ha(e,n){let t=[],r=new Set;for(let a of e){let s=a.options.id;s===void 0||s===Z||r.has(s)||(r.add(s),t.push(s))}let o=n.filter(a=>r.has(a)),i=t.filter(a=>!n.includes(a));return[...o,...i]}function Yr(e,n){let t=[],r=new Map;for(let o of e){let i=o.options.id;i===void 0||i===Z||r.has(i)||r.set(i,Kr(o.options.label,i))}for(let o of ha(e,n.order)){let i=r.get(o);i!==void 0&&t.push({id:o,label:i,enabled:!n.hidden.has(o)})}return t}function Cn(e){let n=new Map,t=2;for(let r of e)r.enabled&&(n.set(r.id,t),t+=1);return n}function ya(e){let n=[],t=new Set;for(let r of e){let o=r.options.id;o===void 0||o===Z||t.has(o)||(t.add(o),n.push({id:o,label:Kr(r.options.label,o)}))}return n}function ba(e,n,t){let r=new Set;for(let o of ya(e)){if(!n.has(o.id)||o.label==="")continue;t.filter(a=>a.label===o.label).length===1&&r.add(o.label)}return t.map(o=>r.has(o.label))}function wa(e,n,t){let r=Yr(e,n),o=Cn(r),i=t[0]?.label,a=new Map;for(let s of t)a.set(s.label,(a.get(s.label)??0)+1);for(let s of r){if((a.get(s.label)??0)>1)return t.map(()=>null);if(i!==void 0&&s.label===i)return t.map(()=>null)}return t.map(s=>{let c=r.find(u=>u.label===s.label);return c===void 0?null:o.get(c.id)??null})}function ka(e,n){let t=!1;for(let[r,o]of e.entries()){let i=n[r]===void 0||n[r]===null?"":String(n[r]);i!==o.order&&(o.setOrder(i),t=!0)}return t}function xa(e,n){for(let t of e)if(n!==null&&(t.target===n||n.contains?.(t.target)===!0)||Vr(t.addedNodes,n)||Vr(t.removedNodes,n))return!0;return!1}function Vr(e,n){if(e===void 0)return!1;for(let t=0;t<e.length;t+=1){let r=e[t];if(r!==void 0&&(r.matches?.(Se)===!0||r.querySelector?.(Se)!=null||n!==null&&r.contains?.(n)===!0))return!0}return!1}function va(e){let n=e.querySelector(Se);if(n===null||typeof n!="object")return;let r=n.querySelectorAll?.(":scope > button[role='tab']");if(r===void 0)return;let o=[];for(let i=0;i<r.length;i+=1){let a=r[i];a!==void 0&&o.push({label:Sa(a),hidden:a.hasAttribute(qe),order:a.style?.order??"",mark:s=>{s?a.setAttribute(qe,""):a.removeAttribute(qe)},setOrder:s=>{a.style!==void 0&&(a.style.order=s)}})}return o}function Sa(e){return(e.querySelector?.("[class*='tabLabel']")?.textContent??e.textContent??"").trim()}function Ca(e,n){let t=!1;for(let[r,o]of e.entries()){let i=n[r]??!1;i!==o.hidden&&(o.mark(i),t=!0)}return t}function Jr(e){let{ledger:n,storage:t}=e,r=e.readButtons??va,o=e.watch??Ra,i=ma(t),a={hidden:new Set(i.hidden),order:[...i.order]},s=new Set,c,u=()=>{for(let d of[...s])d()},l=30;return{rows:()=>Yr(n.entriesOfSlot(vn),a),setEnabled(d,f){if(d===Z)return!1;let p=a.hidden.has(d);return f===!p?!1:(f?a.hidden.delete(d):a.hidden.add(d),qr(t,a),c?.(),u(),!0)},setOrder(d){let f=$e(d);return f.length===a.order.length&&f.every((g,b)=>a.order[b]===g)?!1:(a.order=f,qr(t,a),c?.(),u(),!0)},subscribe(d){return s.add(d),()=>{s.delete(d)}},attach(d){let f=d.createElement("style");f.dataset.plugin="dsh-better",f.dataset.pluginCss=La,f.textContent=Ea,d.head.append(f);let p=d.defaultView?.requestAnimationFrame?.bind(d.defaultView),g=d.defaultView?.cancelAnimationFrame?.bind(d.defaultView),b=p===void 0?0:l,h,w=()=>{let A=n.entriesOfSlot(vn),N=r(d);if(N===void 0||N.length===0){b>0&&p!==void 0&&(b-=1,h=p(()=>w()));return}b=l,h=void 0,Ca(N,ba(A,a.hidden,N)),ka(N,wa(A,a,N))},I=n.subscribe(vn,w),P=o(d,w);return c=w,w(),()=>{I(),P(),c=void 0,h!==void 0&&g?.(h),f.remove()}}}}var La="dsh-better/strip.css",qe="data-dsh-better-tab-hidden",Ea=`${Se} > button[${qe}] { display: none; }`;function Ra(e,n){let t=e.defaultView?.MutationObserver,r=e.documentElement;if(t===void 0||r===void 0)return()=>{};let o=new t(i=>{let a=e.querySelector(Se);xa(i,a!==null&&typeof a=="object"?a:null)&&n()});return o.observe(r,{childList:!0,subtree:!0}),()=>o.disconnect()}var he="data-dsh-better-tabs-row",Ta="data-dsh-better-tabs-fixed",Pa="data-dsh-better-tabs-dragging",Aa=`
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
  cursor: grab;
  user-select: none;
}
[data-dsh-better-tabs] [data-dsh-better-tabs-row]:last-of-type {
  border-bottom: none;
}
[data-dsh-better-tabs] [data-dsh-better-tabs-row="${Z}"] {
  cursor: default;
}
[data-dsh-better-tabs] [data-dsh-better-tabs-row][data-dsh-better-tabs-dragging] {
  opacity: 0.5;
}
[data-dsh-better-tabs] [data-dsh-better-tabs-lead] {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
}
[data-dsh-better-tabs] [data-dsh-better-tabs-pos] {
  flex-shrink: 0;
  box-sizing: border-box;
  min-width: 22px;
  padding: 0 5px;
  border: 0.5px solid var(--dsw-alias-border-l2);
  border-radius: 4px;
  color: var(--dsw-alias-label-tertiary);
  font-size: 12px;
  line-height: 18px;
  text-align: center;
  font-variant-numeric: tabular-nums;
}
[data-dsh-better-tabs] [data-dsh-better-tabs-name] {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
[data-dsh-better-tabs] [data-dsh-better-tabs-note] {
  flex-shrink: 0;
  margin-left: auto;
  color: var(--dsw-alias-label-tertiary);
  font-size: 12px;
  line-height: 18px;
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
`,Xr="dsh-better/tabs.css";function Zr(e){let n=`style[data-plugin-css=${JSON.stringify(Xr)}]`;if(e.querySelector(n)!==null)return()=>{};let t=e.createElement("style");return t.dataset.plugin="dsh-better",t.dataset.pluginCss=Xr,t.textContent=Aa,e.head.append(t),()=>t.remove()}function Qr(e){let n;return e.React.createElement("section",{"data-dsh-better-tabs":"",ref:t=>{if(n?.(),n=void 0,t===null)return;let r=()=>{eo(t,e)};r(),n=e.controller.subscribe(r)}})}function eo(e,n){let t=e.ownerDocument,{controller:r,copy:o}=n;e.replaceChildren();let i=t.createElement("h2");i.setAttribute("data-dsh-better-tabs-heading",""),i.textContent=o.heading,e.append(i),e.append(Oa(t,o));let a=r.rows(),s=Cn(a),c=null,u=!1;for(let l of a)e.append(Ia(t,n,l,s.get(l.id),{dragStart:()=>{c=l.id,u=!1},dragOver:d=>{c!==null&&(d.preventDefault(),c!==l.id&&Na(e,c,l.id,Da(d,Ln(e,l.id)))&&(u=!0))},drop:d=>{d.preventDefault()},dragEnd:()=>{c=null,u&&r.setOrder(_a(e)),eo(e,n)}}));if(a.length===0){let l=t.createElement("p");l.setAttribute("data-dsh-better-tabs-empty",""),l.textContent=o.empty,e.append(l)}}function Oa(e,n){let t=e.createElement("div");t.setAttribute(he,Z),t.setAttribute(Ta,""),t.append(no(e,1,n.chatLabel));let r=e.createElement("span");return r.setAttribute("data-dsh-better-tabs-note",""),r.textContent=n.chatNote,t.append(r),t}function Ia(e,n,t,r,o){let i=e.createElement("label");i.setAttribute(he,t.id),i.setAttribute("draggable","true"),i.append(no(e,r,t.label));let a=e.createElement("input");return a.setAttribute("data-dsh-better-tabs-check",t.id),a.type="checkbox",a.checked=t.enabled,a.setAttribute("aria-label",n.copy.checkboxLabel(t.label,t.enabled)),a.addEventListener("change",()=>{n.controller.setEnabled(t.id,a.checked)}),i.append(a),i.addEventListener("dragstart",s=>{s.dataTransfer?.setData("text/plain",t.id),i.setAttribute(Pa,""),o.dragStart()}),i.addEventListener("dragover",s=>o.dragOver(s)),i.addEventListener("drop",s=>o.drop(s)),i.addEventListener("dragend",()=>o.dragEnd()),i}function no(e,n,t){let r=e.createElement("span");if(r.setAttribute("data-dsh-better-tabs-lead",""),n!==void 0){let i=e.createElement("span");i.setAttribute("data-dsh-better-tabs-pos",""),i.textContent=String(n),r.append(i)}let o=e.createElement("span");return o.setAttribute("data-dsh-better-tabs-name",""),o.textContent=t,r.append(o),r}function Ln(e,n){for(let t of e.querySelectorAll(`[${he}]`))if(t.getAttribute(he)===n)return t;return null}function Na(e,n,t,r){let o=Ln(e,n),i=Ln(e,t);if(o===null||i===null)return!1;let a=o.parentElement;if(a===null)return!1;let s=r?i:i.nextSibling;return s===o?!1:(a.insertBefore(o,s),!0)}function Da(e,n){if(n===null||typeof e.clientY!="number")return!0;let t=n.getBoundingClientRect();return t==null?!0:e.clientY<t.top+t.height/2}function _a(e){let n=[];for(let t of e.querySelectorAll(`[${he}]`)){if(t.getAttribute("draggable")!=="true")continue;let r=t.getAttribute(he);r!==null&&r!==Z&&n.push(r)}return n}var se="conversation.input.overlay",to="settings.section",Ba="aliases",Ha=56,Ga="layout",za=57,$a="alias-watcher",oo=50,qa="skill-enhancer",Va=oo+1,En="conversation.input.model",Rn="conversation.input.attachments",ja=-50,Ua=-60,io="command-popup",Ka=-100,B="better",Ya="/better/api/skill-profile",Ja=5e3,Ve=null;function ao(e,n){let t,r=Number.POSITIVE_INFINITY;for(let o of e){if(o.options.id!==io)continue;let i=o.component;if(typeof i!="function"||n!==void 0&&i===n)continue;let a=o.options.priority??0;a<r&&(t=i,r=a)}return t}var so={name:"dsh-better",inject:["slots","sessions","commandUi","conversation","locale","modelDirectories","remote","remote.session"],apply(e){let n=globalThis.document;e.effect(()=>e.locale.register(B,jt),"dsh-better: locale"),e.effect(()=>Kt(n),"dsh-better: effort badge stylesheet"),e.effect(()=>vr(n),"dsh-better: compaction count stylesheet"),e.effect(()=>Ar(n),"dsh-better: continue button stylesheet"),e.effect(()=>n===void 0?()=>{}:Fr(n,{translate:ro(e)}),"dsh-better: link address panel"),e.effect(()=>Nr(n),"dsh-better: settings panel surface");let t=Mn(Ce()),r=ro(e),o={open:!1};e.effect(()=>{let u=Ce(),l=We(u);e.inject?.(["layout"],p=>{ar(p,l)});let f=(n===void 0?void 0:sr({document:n,storage:u}))?.attach();return()=>{f?.()}},"dsh-better: panel width memory"),e.effect(()=>{if(n===void 0||globalThis.window===void 0)return()=>{};let u,l=!1,d=e.inject?.(["layout"],f=>{let p=f.layout;if(p==null||typeof p.openRightbar!="function"||typeof p.closeRightbar!="function")return;let g=wr({layout:p,window:globalThis.window,document:n,storage:Ce(),desktop:globalThis.dshDesktop?.protocolVersion===1});l?g():u=g});return()=>{l=!0,u?.(),u=void 0,typeof d=="function"&&d()}},"dsh-better: right panel window growth"),e.effect(()=>e.slots.inject(mn,()=>e.slots.register({name:mn,id:Lr,order:-1,locale:B},Sr)),"dsh-better: compaction count"),e.effect(()=>e.slots.inject(hn,()=>Pn(e.slots,{name:hn,id:Rr,order:20,locale:B,inject:u=>({submitContinue:l=>Wr(e,l)})},Or)),"dsh-better: continue button"),e.effect(()=>e.slots.inject(se,()=>{let u={},d=Nt({load:Ve,native:()=>ao(e.slots.entries(se),u.component),document:n});return u.component=d,e.slots.register({name:se,id:io,priority:Ka,locale:B,inject:f=>{let p=ts(e,f);return{popup:ns(e,f),catalog:p?.groups,current:p?.current??null,selectModel:g=>e.modelDirectories?.directoryFor?.(f)?.select?.(g)}}},d)}),"dsh-better: /model provider search"),e.effect(()=>e.slots.inject(En,()=>{let u={},d=Hr({load:Ve,native:()=>An(e.slots.entries(En),u.component),openPicker:f=>Qa(e,f),translate:()=>es(e),document:n});return u.component=d,e.slots.register({name:En,priority:ja,locale:B,inject:f=>{let p=e.modelDirectories?.directoryFor?.(f),g=e.locale.resolveText;return{sessionId:f,available:!0,directory:p?.store,load:()=>{p?.load?.()},select:b=>p?.select?.(b),resolveText:b=>ze(g?.bind(e.locale),b),renderSlot:(b,h,w)=>w?.fallback??null}}},d)}),"dsh-better: composer model trigger");let i;e.inject?.(["remote.workspaceFiles"],u=>{i=u["remote.workspaceFiles"],u.effect(()=>()=>{i=void 0},"dsh-better: workspace file reader")}),e.effect(()=>e.slots.inject(Rn,()=>{let u={},d=Ht({native:()=>An(e.slots.entries(Rn),u.component),pathOf:rs,reader:()=>i,translate:()=>e.locale.bind?.(B)});return u.component=d,e.slots.register({name:Rn,priority:Ua,locale:B,inject:f=>({sessionId:f,readFileDrag:Xa(e),phase:()=>Za(e,f)?.getSnapshot().phase})},d)}),"dsh-better: composer attachment selection");let a;e.inject?.(["inputTriggers"],u=>{a=u.inputTriggers,u.effect(()=>()=>{a=void 0},"dsh-better: alias trigger service"),u.effect(()=>u.inputTriggers.registerSource(jn({config:()=>t.getSnapshot(),translate:r,bareMenuOpen:()=>o.open,routeCommand:(l,d)=>ss(e,d)})),"dsh-better: alias slash source")}),e.effect(()=>e.slots.inject(se,()=>{let u=Xn({store:t,bareMenuOpen:o,inputStoreFor:l=>{let d=e.sessions.scope?.(l);if(!(d===void 0||e.conversation===void 0))try{return e.conversation.input?.for?.(d)?.state}catch{return}},controllerFor:l=>{let d=e.sessions.scope?.(l);if(d===void 0)return;let f=Le(e,"inputTriggers")??a;if(f!==void 0)try{return f.sessionOf(d)}catch{return}}});return Pn(e.slots,{name:se,id:$a,order:oo,inject:l=>({sessionId:l})},u)}),"dsh-better: alias selector watcher"),e.effect(()=>wt(n),"dsh-better: skill enhancer stylesheet");let s=os(e);e.effect(()=>e.slots.inject(se,()=>{let u=yt({scopeFor:l=>e.sessions.scope?.(l),inputStoreFor:l=>{let d=e.sessions.scope?.(l);if(!(d===void 0||e.conversation===void 0))try{return e.conversation.input?.for?.(d)?.state}catch{return}},actionsFor:l=>{let d=e.sessions.scope?.(l);if(!(d===void 0||e.conversation===void 0))try{return e.conversation.input?.for?.(d)}catch{return}},skillNamesFor:s.names,loadProfile:async(l,d)=>is(e,l,d,await s.pathOf(l,d)),loadUsage:(l,d)=>lo(e,l,d),translate:r,document:n});return Pn(e.slots,{name:se,id:qa,order:Va,inject:l=>({sessionId:l})},u)}),"dsh-better: skill enhancer"),e.effect(()=>e.slots.inject(to,()=>{let u=n===void 0?void 0:Kn(n),l=Vn({store:t,translate:r}),d=Tn(e.slots,{name:to,id:Ba,order:Ha,label:()=>e.locale.bind?.(B)?.("alias.nav")??"Skill aliases",locale:B},l);return()=>{d(),u?.()}}),"dsh-better: alias settings page");let c=Jr({ledger:as(e.slots),storage:Ce()});e.effect(()=>e.slots.inject(Sn,()=>{let u=globalThis.document,l=u===void 0?void 0:Zr(u),d=Tn(e.slots,{name:Sn,id:jr,order:55,label:()=>e.locale.bind?.(B)?.("tabs.nav")??"Tabs"},()=>{let f=ls(Ve);return f===null?null:Qr({React:f,controller:c,copy:ds(e)})});return()=>{d(),l?.()}}),"dsh-better: tab management"),e.effect(()=>c.attach(n),"dsh-better: tab visibility"),e.effect(()=>e.slots.inject("settings.section",()=>{let u=Ce(),l=n===void 0?void 0:mr(n),d=Tn(e.slots,{name:"settings.section",id:Ga,order:za,label:()=>e.locale.bind?.(B)?.("layout.nav")??"Layout",locale:B},()=>gr({preference:()=>Be(u),save:f=>dr(u,f),translate:r}));return()=>{d(),l?.()}}),"dsh-better: layout settings page"),e.inject?.(["shortcuts"],u=>{u.effect(()=>Vt(u.shortcuts,{currentSessionId:()=>$t(e),composerMounted:()=>zt(n),focusComposer:l=>qt(e,l)},()=>e.locale.bind?.(B)?.(xe)??"Focus message input",l=>console.warn(`dsh-better: focus command not registered (${l})`)),"dsh-better: focus composer shortcut")})}};function Xa(e){return n=>Le(e,"fileDrag")?.read?.(n)}function Za(e,n){if(n===void 0)return;let t=e.sessions.scope?.(n);if(!(t===void 0||e.conversation===void 0))try{return e.conversation.input?.for?.(t)?.state}catch{return}}function An(e,n){let t,r=Number.POSITIVE_INFINITY;for(let o of e){let i=o.component;if(typeof i!="function"||n!==void 0&&i===n)continue;let a=o.options.priority??0;a<r&&(t=i,r=a)}return t}function Qa(e,n){if(n===void 0)return!1;let t=Gr(e.commandUi);if(t===void 0)return!1;let r=e.sessions.scope?.(n);if(r===void 0)return!1;let o=e.commandUi.popupFor?.(r);return o===void 0||typeof o.open!="function"?!1:(o.open("model",t,zr(n),$r()),!0)}function es(e){return e.locale?.bind?.(B)}function ns(e,n){let t=e.sessions.scope?.(n);if(t!==void 0)return e.commandUi.popupFor?.(t)}function ts(e,n){return e.modelDirectories?.directoryFor?.(n)?.store.getSnapshot()}function rs(e){let n=globalThis.__DSH_HOST_PATHS__;if(n?.pathFor===void 0)return"";try{let t=n.pathFor(e);return typeof t=="string"?t:""}catch{return""}}function Tn(e,n,t){return(e.registerUntyped??e.register).call(e,n,t)}function Pn(e,n,t){return(e.registerUntyped??e.register).call(e,n,t)}function os(e){let n=new Map,t=new Map,r=async o=>{let i=n.get(o);if(i!==void 0)return i;let a=t.get(o);if(a!==void 0&&Date.now()-a<Ja)return;let s=Le(e,"remote.skills");if(s!==void 0)try{let c=await s.list({sessionId:o});if(!c.ok){t.set(o,Date.now());return}let u=new Map(c.value.skills.map(l=>[l.name,l]));return n.set(o,u),t.delete(o),u}catch{t.set(o,Date.now());return}};return{names:async o=>new Set((await r(o))?.keys()??[]),pathOf:async(o,i)=>(await r(o))?.get(i)?.path}}async function is(e,n,t,r){let o=`?sessionId=${encodeURIComponent(n)}&name=${encodeURIComponent(t)}`+(r===void 0?"":`&path=${encodeURIComponent(r)}`);try{let i=await fetch(`${Ya}${o}`,{headers:{accept:"application/json"}});return i.ok?await i.json():void 0}catch{return}}function lo(e,n,t){let r=e.sessions.list??Le(e,"sessions.list");try{let o=r?.getSnapshot?.(),i=d=>{let p=o?.projectionsBySession?.[d]?.values?.skillUsage;if(typeof p!="object"||p===null)return;let g=p.counts;return typeof g=="object"&&g!==null?g:void 0},a=i(n)?.[t],s=typeof a=="number"&&Number.isFinite(a)?a:0,c=o?.byId?.[n]?.cwd;if(typeof c!="string"||c==="")return{session:s};let u=Object.keys(o?.byId??{}).map(d=>{let f=i(d),p=o?.byId?.[d]?.cwd;return{...typeof p=="string"?{cwd:p}:{},...f===void 0?{}:{usage:f}}}),l=kt(u,c,t);return l===void 0?{session:s}:{session:s,workspace:l}}catch{return{session:0}}}function as(e){return{entriesOfSlot:n=>(e.entriesOfSlot??e.entries).call(e,n),subscribe:(n,t)=>e.subscribe?.(n,t)??(()=>{})}}function Ce(){try{return globalThis.localStorage}catch{return}}function Le(e,n){try{return typeof e.get=="function"?e.get(n):e[n]}catch{return}}function ss(e,n){let t=n.session?.sessionId;if(t===void 0)return;let r=e.sessions.scope?.(t);if(r===void 0)return;let o=Le(e,"inputTriggers");if(o!==void 0)try{let i=o.sessionOf(r),a=e.conversation?.input?.for?.(r)?.state,s=0,c=()=>{let u=a?.getSnapshot();if(!(u===void 0||u.draft.trim()===""||!u.draft.startsWith("/"))){try{let l=u.draft.trimStart().split(/\s/u)[0]??"";if(!l.startsWith("/")||(i.track?.(l,l.length,{tier:"plain"},u.draftRev),i.onSpace?.()===!0))return;i.dismiss?.()}catch{}s+=1,s<4&&setTimeout(c,25)}};setTimeout(c,0)}catch{}}function ro(e){return(n,t)=>{try{return e.locale.bind?.(B)?.(n,t)??n}catch{return n}}}function ls(e){if(e===null)return null;try{let n=e("react");if(typeof n!="object"||n===null)return null;let t=n;return typeof t.createElement=="function"?t:null}catch{return null}}function ds(e){let n=e.locale.bind?.(B),t=(r,o)=>n?.(r)??o;return{heading:t("tabs.heading","Tabs"),chatLabel:t("tabs.chat","Chat"),chatNote:t("tabs.chatNote","Pinned to the front of the tab bar"),empty:t("tabs.empty","No plugin has registered a conversation tab yet."),checkboxLabel:(r,o)=>t(o?"tabs.hide":"tabs.show","{label}").replace("{label}",r)}}function us(e){Ve=e}var cs=so;

    // Hand the loader's `require` to the module's `boot` export before the
    // plugin mounts. Read from `module.exports` rather than the default export:
    // esbuild emits named exports there and the plugin object separately, so the
    // default export alone never carries `boot`.
    if (typeof module.exports.boot === "function") module.exports.boot(require);
    return module.exports.default ?? module.exports;
  }
});
