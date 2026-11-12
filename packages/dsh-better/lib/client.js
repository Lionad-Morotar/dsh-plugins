window.__ModuleLoader__.load({
  id: "dsh-better",
  factory: (require) => {
    var module = { exports: {} };
    var exports = module.exports;
"use strict";var je=Object.defineProperty;var Kr=Object.getOwnPropertyDescriptor;var Gr=Object.getOwnPropertyNames;var Yr=Object.prototype.hasOwnProperty;var Jr=(e,n)=>{for(var t in n)je(e,t,{get:n[t],enumerable:!0})},Xr=(e,n,t,r)=>{if(n&&typeof n=="object"||typeof n=="function")for(let o of Gr(n))!Yr.call(e,o)&&o!==t&&je(e,o,{get:()=>n[o],enumerable:!(r=Kr(n,o))||r.enumerable});return e};var Zr=e=>Xr(je({},"__esModule",{value:!0}),e);var za={};Jr(za,{boot:()=>Ha,clientPlugin:()=>qr,default:()=>Wa,findShadowed:()=>Vr,findShadowedSingle:()=>Ln,readSkillUsage:()=>jr});module.exports=Zr(za);var Te=require("react");var Pn="dsh-better.skill-aliases";var le=Object.freeze({prefix:!0,rows:Object.freeze([])});function Qr(e,n){if(e!==void 0)try{e.setItem(Pn,JSON.stringify({v:1,prefix:n.prefix,rows:n.rows}))}catch{}}function Ee(e,n){return typeof e=="string"?e:n}function eo(e,n){if(typeof e!="object"||e===null||Array.isArray(e))return;let t=e;if(!(typeof t.keyword!="string"&&typeof t.target!="string"&&typeof t.params!="string"))return{id:Ee(t.id,`alias-${n}`)||`alias-${n}`,keyword:Ee(t.keyword,""),target:Ee(t.target,""),params:Ee(t.params,"")}}function no(e){if(typeof e!="object"||e===null||Array.isArray(e))return le;let n=e,t=typeof n.prefix=="boolean"?n.prefix:le.prefix,r=Array.isArray(n.rows)?n.rows:[],o=[],i=new Set;for(let[a,s]of r.slice(0,200).entries()){let c=eo(s,a);if(c===void 0)continue;let u=c.id,l=0;for(;i.has(u);)l+=1,u=`alias-${a}-${l}`;i.add(u),o.push({...c,id:u})}return{prefix:t,rows:o}}function to(e){if(e===void 0)return le;let n;try{n=e.getItem(Pn)}catch{return le}if(n===null||n==="")return le;try{return no(JSON.parse(n))}catch{return le}}function ro(){let e=globalThis.crypto;return e?.randomUUID!==void 0?e.randomUUID():`alias-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,8)}`}function On(e,n=ro){let t=to(e),r=new Set,o=i=>{t=i;for(let a of[...r])try{a()}catch(s){console.error("[dsh-better] alias store listener failed:",s)}Qr(e,i)};return{getSnapshot:()=>t,subscribe(i){return r.add(i),()=>{r.delete(i)}},setPrefix(i){t.prefix!==i&&o({...t,prefix:i})},addRow(){let i=n();return o({...t,rows:[...t.rows,{id:i,keyword:"",target:"",params:""}]}),i},updateRow(i,a){let s=!1,c=t.rows.map(u=>{if(u.id!==i)return u;let l={...u,...a,id:u.id};return s=l.keyword!==u.keyword||l.target!==u.target||l.params!==u.params,l});s&&o({...t,rows:c})},removeRow(i){let a=t.rows.filter(s=>s.id!==i);a.length!==t.rows.length&&o({...t,rows:a})}}}function In(e){return e.keyword.trim()!==""&&e.target.trim()!==""}function Nn(e){return e.keyword.trim().replace(/^\/+/,"").toLowerCase()}function Dn(e,n){let t=n.trim().replace(/^\/+/,"").toLowerCase();return t===""?[]:e.rows.filter(r=>In(r)&&Nn(r)===t)}function _n(e,n,t=!1){let r=n.trim().replace(/^\/+/,"").toLowerCase(),o=e.rows.filter(In);if(r==="")return t?o:[];let i=[],a=[],s=[];for(let c of o){let u=Nn(c);u===r?i.push(c):u.startsWith(r)?a.push(c):u.includes(r)&&s.push(c)}return[...i,...a,...s]}function Mn(e){let n=e.target.trim().replace(/^\/+/,"");if(n==="")return"";let t=e.params.trim();return t===""?`/${n} `:`/${n} ${t} `}function Fn(e,n){let t=/^\/([^\s/]+)([ \t]*)$/u.exec(n);if(t===null)return;let r=t[1]??"",o=Dn(e,r);if(o.length!==0)return{query:r,start:0,end:n.length,rows:o}}function Bn(e,n){let t=/^([^\s/]+)([ \t]*)$/u.exec(n);if(t===null)return;let r=t[1]??"",o=Dn(e,r);if(o.length!==0)return{query:r,start:0,end:n.length,rows:o}}function Hn(e){if(e.keyword.trim()==="")return"keyword";if(e.target.trim()==="")return"target";if(/\s/.test(e.keyword.trim()))return"keyword"}var T=require("react/jsx-runtime");function oo(e){let{row:n,store:t,t:r}=e,o=Hn(n);return(0,T.jsxs)("tr",{"data-testid":"alias-row","data-row-id":n.id,"data-incomplete":o===void 0?void 0:"",children:[(0,T.jsx)("td",{children:(0,T.jsx)("input",{className:"dsh-better-alias-input","data-testid":"alias-keyword",value:n.keyword,placeholder:"wf",spellCheck:!1,autoComplete:"off","aria-label":r("alias.table.keyword"),ref:i=>{i!==null&&e.focus&&(i.focus(),e.clearFocus())},onChange:i=>t.updateRow(n.id,{keyword:i.target.value})})}),(0,T.jsx)("td",{children:(0,T.jsx)("input",{className:"dsh-better-alias-input","data-testid":"alias-target",value:n.target,placeholder:"flow-workflow",spellCheck:!1,autoComplete:"off","aria-label":r("alias.table.target"),onChange:i=>t.updateRow(n.id,{target:i.target.value})})}),(0,T.jsx)("td",{children:(0,T.jsx)("input",{className:"dsh-better-alias-input","data-testid":"alias-params",value:n.params,placeholder:r("alias.table.paramsPlaceholder"),spellCheck:!1,autoComplete:"off","aria-label":r("alias.table.params"),onChange:i=>t.updateRow(n.id,{params:i.target.value})})}),(0,T.jsx)("td",{className:"dsh-better-alias-actions",children:(0,T.jsx)("button",{type:"button",className:"dsh-better-alias-delete","data-testid":"alias-remove","aria-label":r("alias.remove",{keyword:n.keyword.trim()||r("alias.unnamed")}),title:r("alias.remove",{keyword:n.keyword.trim()||r("alias.unnamed")}),onClick:()=>t.removeRow(n.id),children:"\xD7"})})]})}function Wn(e){function n(){let t=(0,Te.useSyncExternalStore)(e.store.subscribe,e.store.getSnapshot,e.store.getSnapshot),{translate:r}=e,o=(0,Te.useRef)(null),i=()=>{o.current=e.store.addRow()};return(0,T.jsxs)("section",{className:"dsh-better-alias-page","data-testid":"alias-page",children:[(0,T.jsx)("h2",{className:"dsh-better-alias-heading",children:r("alias.heading")}),(0,T.jsxs)("label",{className:"dsh-better-alias-prefix",children:[(0,T.jsxs)("span",{children:[(0,T.jsx)("span",{className:"dsh-better-alias-prefix-title",children:r("alias.prefix.title")}),(0,T.jsx)("span",{className:"dsh-better-alias-prefix-hint",children:r(t.prefix?"alias.prefix.on":"alias.prefix.off")})]}),(0,T.jsx)("input",{type:"checkbox","data-testid":"alias-prefix",checked:t.prefix,"aria-label":r("alias.prefix.title"),onChange:a=>e.store.setPrefix(a.target.checked)})]}),(0,T.jsxs)("div",{className:"dsh-better-alias-table-wrap",children:[(0,T.jsxs)("table",{className:"dsh-better-alias-table",children:[(0,T.jsx)("thead",{children:(0,T.jsxs)("tr",{children:[(0,T.jsx)("th",{scope:"col",children:r("alias.table.keyword")}),(0,T.jsx)("th",{scope:"col",children:r("alias.table.target")}),(0,T.jsx)("th",{scope:"col",children:r("alias.table.params")}),(0,T.jsx)("th",{scope:"col","aria-label":r("alias.table.actions")})]})}),(0,T.jsx)("tbody",{children:t.rows.map(a=>(0,T.jsx)(oo,{row:a,store:e.store,t:r,focus:o.current===a.id,clearFocus:()=>{o.current=null}},a.id))})]}),t.rows.length===0?(0,T.jsx)("p",{className:"dsh-better-alias-empty","data-testid":"alias-empty",children:r("alias.empty")}):null]}),(0,T.jsx)("button",{type:"button",className:"dsh-better-alias-add","data-testid":"alias-add",onClick:i,children:r("alias.add")}),(0,T.jsx)("p",{className:"dsh-better-alias-footnote",children:r("alias.footnote")})]})}return n}var Ke="alias",io="/",ao=-1;function so(e,n){let t=e.target.trim().replace(/^\/+/,""),r=e.keyword.trim(),o=e.params.trim();return{name:t,label:r,...o===""?{}:{description:n("alias.menu.params",{value:o})},section:n("alias.menu.section"),value:e.id}}function zn(e){return{trigger:io,name:Ke,order:ao,async candidates(n,t){if(t.position!=="leading")return[];let r=e.config();return!r.prefix&&e.bareMenuOpen?.()!==!0?[]:_n(r,t.query,!0).map(o=>so(o,e.translate))},onPick(n){let t=e.config().rows.find(i=>i.id===n.candidate.value);if(t===void 0)return;let r=t.target.trim().replace(/^\/+/,"");r!==""&&e.routeCommand?.(r,n);let o=Mn(t);return o===""?void 0:{text:o}}}}var $n="dsh-better/aliases.css",lo=`
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
`;function Un(e){let n=`style[data-plugin-css=${JSON.stringify($n)}]`;if(e.querySelector(n)!==null)return()=>{};let t=e.createElement("style");return t.dataset.plugin="dsh-better",t.dataset.pluginCss=$n,t.textContent=lo,e.head.append(t),()=>t.remove()}var re=require("react");var Vn={draft:"",draftRev:-1,phase:"plain"};function jn(e){return function(t){let r=(0,re.useSyncExternalStore)(e.store.subscribe,e.store.getSnapshot,e.store.getSnapshot),o=t.sessionId===void 0?void 0:e.inputStoreFor(t.sessionId),i=t.sessionId===void 0?void 0:e.controllerFor(t.sessionId),a=(0,re.useSyncExternalStore)(c=>o===void 0?()=>{}:o.subscribe(c),()=>o===void 0?Vn:o.getSnapshot(),()=>o===void 0?Vn:o.getSnapshot()),s=(0,re.useRef)(null);return(0,re.useEffect)(()=>{let c=t.sessionId;if(c===void 0||a.phase!=="plain"||i===void 0)return;let u=i.menu.getSnapshot().open;if(u&&s.current===null)return;let l=Ge(r,a.draft);if(u){let f=s.current;if(f!==null&&(f.draftRev!==a.draftRev||f.spanEnd!==(l?.end??-1))){let p=setTimeout(()=>{let y=o?.getSnapshot()??a,b=e.controllerFor(c);if(b===void 0||y.phase!=="plain")return;s.current=null,b.dismiss();let m=Ge(e.store.getSnapshot(),y.draft);m!==void 0&&(e.bareMenuOpen.open=!0,qn(b,m,y.draftRev),e.bareMenuOpen.open=!1,s.current={draftRev:y.draftRev,spanEnd:m.end})},80);return()=>clearTimeout(p)}return}if(s.current=null,l===void 0)return;let d=setTimeout(()=>{let f=o?.getSnapshot()??a,p=e.controllerFor(c);if(p===void 0||f.phase!=="plain"||p.menu.getSnapshot().open)return;let y=Ge(e.store.getSnapshot(),f.draft);y!==void 0&&(e.bareMenuOpen.open=!0,qn(p,y,f.draftRev),e.bareMenuOpen.open=!1,s.current={draftRev:f.draftRev,spanEnd:y.end})},80);return()=>clearTimeout(d)},[r,a.draft,a.draftRev,a.phase,i,o,t.sessionId]),null}}function Ge(e,n){return e.prefix?Fn(e,n):Bn(e,n)}function qn(e,n,t){e.toggleSource(Ke,{trigger:"/",query:n.query,quoted:!1,position:"leading",span:{start:n.start,end:n.end,draftRev:t}})}function ne(e){return e!==void 0&&e!=="plain"}var C=require("react");var uo="[a-z0-9]+(?:-[a-z0-9]+)*",co=new RegExp(`^/(${uo})(?=\\s|$)`,"u");function de(e,n){let t=co.exec(e);if(t===null)return;let r=t[1]??"";if(n(r))return{name:r,start:0,end:1+r.length}}function Kn(e,n,t){return e===void 0||!Number.isInteger(t)||t<e.end||t>n.length||t!==n.length?!1:/^[ \t]*$/u.test(n.slice(e.end,t))}var Ye=/\s/u;function fo(e){let n=[],t=0;for(;t<e.length;){for(;t<e.length&&Ye.test(e.charAt(t));)t+=1;let r=t;for(;t<e.length&&!Ye.test(e.charAt(t));)t+=1;t>r&&n.push({text:e.slice(r,t),start:r})}return n}function Gn(e,n,t){if(e==="")return;let r=de(e,n);if(r===void 0||t.length===0)return;let i=fo(e).slice(1);if(i.length===0)return;let a=Ye.test(e.charAt(e.length-1)),s=a?i[i.length-1]:i[i.length-2],c=a?void 0:i[i.length-1];if(s===void 0)return;let u=t.find(d=>d.slot===s.text);if(u===void 0)return;if(c===void 0)return{name:r.name,slot:u.slot,query:"",start:e.length};let l=c.text;if(!l.startsWith("--"))return{name:r.name,slot:u.slot,query:l,start:c.start}}function po(e,n){let t=e.slug.toLowerCase();if(t.startsWith(n))return 0;if(t.includes(n))return 1;if(e.summary.toLowerCase().includes(n))return 2}function be(e,n){let t=n.trim().toLowerCase();if(t==="")return e;let r=[];for(let o of e){let i=po(o,t);i!==void 0&&r.push({entry:o,tier:i})}return r.sort((o,i)=>o.tier-i.tier),r.map(o=>o.entry)}function Yn(e,n){let t=n.trim().toLowerCase();if(t==="")return[];let r=e.toLowerCase(),o=[],i=0;for(;i<=r.length-t.length;){let a=r.indexOf(t,i);if(a===-1)break;o.push({start:a,end:a+t.length}),i=a+t.length}return o}function Jn(e,n,t,r){return e!=="Enter"&&e!=="Tab"&&e!=="ArrowUp"&&e!=="ArrowDown"||r||be(n,t).length===0?"pass":e==="Enter"||e==="Tab"?"insert":"move"}function Je(e){return`${e.trimEnd()} `}var go=/\s/u;function Zn(e,n){let t=de(e,n);if(t===void 0)return;let r=e.length-1;for(;r>=0&&!go.test(e.charAt(r));)r-=1;let o=r+1,i=e.slice(o);if(!(i.length<2||!i.startsWith("--")))return{name:t.name,query:i,start:o}}function Qn(e,n){let t=n.slice(2).toLowerCase();return e.filter(r=>r.flag.startsWith("--")?r.flag.slice(2).toLowerCase().startsWith(t):!1)}function Xn(e,n){let t=0;for(let r of n){let o=r.offset+r.length;if(e>=r.offset&&e<o)return;o<=e&&(t+=r.length-1)}return e-t}function Re(e,n,t,r){let o=Xn(t.start,n);if(o===void 0)return;let i=Xn(e.length,n);if(i!==void 0)return{start:o,end:i,draftRev:r}}function et(e){return`${e} `}function mo(e){let n=e.occurrences;if(!Array.isArray(n))return[];let t=[];for(let r of n){if(typeof r!="object"||r===null)continue;let o=r;typeof o.offset!="number"||typeof o.length!="number"||t.push({offset:o.offset,length:o.length})}return t}var ho=/^\/([a-z0-9]+(?:-[a-z0-9]+)*)[ \t]*$/u,yo=400,nt=200,tt=6,bo=240,rt={draft:"",draftRev:-1,phase:"plain"};function ko(e,n){return`${e!==""&&!/\s$/u.test(e)?" ":""}${n} `}function lt(e){return e===void 0?void 0:ho.exec(e)?.[1]}function wo(e){return e===void 0?[]:e.split(`
`).map(n=>n.trim()).filter(n=>n!=="")}var Qe=240,en=640;function dt(e){return!Number.isFinite(e)||e<=0?en:Math.max(Qe,Math.min(en,e-24))}function xo(e,n){let t=dt(n),r=Number.isFinite(e)&&e>0?e:0,o=r===0?Qe:r<=80?320:r<200?480:en;return Math.min(Math.max(o,Qe),t)}function ut(e,n,t,r){if(!Number.isFinite(t)||t<=0)return e;let o=t-n-r;return Math.max(r,Math.min(e,Math.max(r,o)))}function vo(e,n,t){if(t<=0||typeof e.createRange!="function")return;let r=e.createRange(),o=t,i=!1,a=c=>{for(let u of Array.from(c.childNodes)){if(u.nodeType===3){let l=u.textContent??"",d=Math.min(o,l.length);if(d<=0)continue;if(i||(r.setStart(u,0),i=!0),r.setEnd(u,d),o-=d,o<=0)return!0;continue}if(a(u))return!0}return!1};if(!a(n)||o>0)return;let s=r.getBoundingClientRect();if(!(s.width===0&&s.height===0))return{left:s.left,right:s.right,top:s.top,bottom:s.bottom}}function ot(e,n){let t=e.querySelectorAll("[data-composer-text-ref]");for(let r of t){if(lt(r.textContent??"")!==n)continue;let o=vo(e,r,n.length+1);if(o!==void 0)return o;let i=r.getBoundingClientRect();return{left:i.left,right:i.right,top:i.top,bottom:i.bottom}}}function Pe(e){return e.defaultView?.innerWidth??0}function ct(e,n,t,r){let o=e.top-r,i=Number.isFinite(t)&&t>0?t:0;return i===0||i<=o?{left:e.left,top:0,anchor:"above"}:{left:e.left,top:e.bottom+r,anchor:"below"}}function Ae(e){return e.defaultView?.innerHeight??0}function it(e){let n=typeof e.getSelection=="function"?e.getSelection():null,t=n?.anchorNode;if(t!=null){let s=(t.nodeType===1?t:t.parentElement)?.closest("[data-composer-text-ref]");if(s!=null){let c=n?.getRangeAt===void 0||n.rangeCount===0?void 0:n.getRangeAt(0).getBoundingClientRect();if(c!==void 0&&c.height>0)return{left:c.left,right:c.left,top:c.top,bottom:c.bottom}}}let r=e.querySelectorAll("[data-composer-text-ref]"),o=r[r.length-1];if(o===void 0)return;let i=o.getBoundingClientRect();if(!(i.width===0&&i.height===0))return{left:i.left,right:i.right,top:i.top,bottom:i.bottom}}function So(e,n,t){if(n<=0)return;if(e===void 0)return 0;let r=Math.min(e,n-1);return t==="up"?Math.max(0,r-1):Math.min(n-1,r+1)}function Xe(e,n){if(!(n<=0))return e===void 0||e<0?0:Math.min(e,n-1)}function at(e,n,t,r){let o=Yn(t,r);if(o.length===0){n.append(e.createTextNode(t));return}let i=0;for(let a of o){a.start>i&&n.append(e.createTextNode(t.slice(i,a.start)));let s=e.createElement("mark");s.className="dsh-better-skill-catalog-mark",s.textContent=t.slice(a.start,a.end),n.append(s),i=a.end}i<t.length&&n.append(e.createTextNode(t.slice(i)))}function Co(e,n){let t=e.createElement("div");t.className="dsh-better-skill-catalog";let r=e.createElement("div");return r.className="dsh-better-skill-catalog-title",r.textContent=`/${n.name} ${n.slot}`,t.append(r),n.getActions()?.insertText!==void 0&&n.entries.forEach((o,i)=>{t.append(Lo(e,n,o,i===n.selected))}),t.style.width=`${nn(e)}px`,t}function Lo(e,n,t,r){let o=e.createElement("button");o.type="button",o.className=r?"dsh-better-skill-catalog-row dsh-better-skill-catalog-selected":"dsh-better-skill-catalog-row",o.addEventListener("pointerdown",s=>s.preventDefault());let i=e.createElement("span");i.className="dsh-better-skill-catalog-slug",at(e,i,t.slug,n.match.query),o.append(i);let a=e.createElement("span");return a.className="dsh-better-skill-catalog-summary",at(e,a,t.summary,n.match.query),o.append(a),o.addEventListener("click",()=>{let s=n.getActions(),c=s?.captureInsertion?.();if(s?.insertText===void 0||c===void 0)return;let u=Re(n.getDraft(),n.getOccurrences(),n.match,c.draftRev);u!==void 0&&s.insertText(Je(t.slug),u)}),o}function Eo(e,n){let t=e.createElement("div");t.className="dsh-better-skill-params";let r=e.createElement("div");if(r.className="dsh-better-skill-params-title",r.textContent=`/${n.name}`,t.append(r),n.getActions()?.insertText!==void 0)for(let o of n.params)t.append(To(e,n,o.flag,o.detail));return t.style.width=`${nn(e)}px`,t}function nn(e){return Math.min(320,dt(Pe(e)))}function st(e,n,t){if(t===void 0)return;let r=4,o=Pe(e),i=nn(e);n.style.width=`${i}px`;let a=ct(t,Ae(e),n.offsetHeight,r);n.style.left=`${ut(a.left,i,o,12)}px`,a.anchor==="above"?(n.style.bottom=`${Ae(e)-t.top+r}px`,n.style.top=""):(n.style.top=`${a.top}px`,n.style.bottom="")}function To(e,n,t,r){let o=e.createElement("button");o.type="button",o.className="dsh-better-skill-panel-param",o.addEventListener("pointerdown",a=>a.preventDefault());let i=e.createElement("span");if(i.className="dsh-better-skill-panel-param-flag",i.textContent=t,o.append(i),r!==""){let a=e.createElement("span");a.className="dsh-better-skill-panel-param-detail",a.textContent=r,o.append(a)}return o.addEventListener("click",()=>{let a=n.getActions(),s=a?.captureInsertion?.();if(a?.insertText===void 0||s===void 0)return;let c=Re(n.getDraft(),n.getOccurrences(),n.match,s.draftRev);c!==void 0&&a.insertText(et(t),c)}),o}function ft(e){return function(t){let r=e.document??globalThis.document,o=t.sessionId,i=o===void 0?void 0:e.inputStoreFor(o),a=t.useInput,s=a===void 0?void 0:a(h=>h.draft),c=a===void 0?void 0:a(h=>h.phase),u=a===void 0?void 0:a(h=>h.occurrences),l=(0,C.useSyncExternalStore)(h=>i===void 0?()=>{}:i.subscribe(h),()=>i===void 0?rt:i.getSnapshot(),()=>i===void 0?rt:i.getSnapshot()),d=s??l.draft,f=c??l.phase,[p,y]=(0,C.useState)(()=>new Set),[b,m]=(0,C.useState)(void 0),[k,I]=(0,C.useState)(void 0),[A,P]=(0,C.useState)(void 0),[N,$]=(0,C.useState)(void 0),[v,S]=(0,C.useState)(void 0),[g,O]=(0,C.useState)(void 0),[D,F]=(0,C.useState)(void 0),[H,j]=(0,C.useState)(void 0),[_,U]=(0,C.useState)(void 0);(0,C.useEffect)(()=>{if(o===void 0)return;let h=!0;return e.skillNamesFor(o).then(x=>{h&&y(x)},()=>{h&&y(new Set)}),()=>{h=!1}},[o]);let se=de(d,h=>p.has(h)),Q=Kn(se,d,d.length)&&!ne(f)?se?.name:void 0,w=Zn(d,h=>p.has(h)),L=w!==void 0&&!ne(f)&&v!==d,E=Gn(d,h=>p.has(h),b?.assists??[]),Y=b?.catalogs?.workflows??[],ee=E!==void 0&&Y.length>0&&!ne(f)&&D!==d&&!L,$e=se?.name??k;(0,C.useEffect)(()=>{if(o===void 0||$e===void 0){m(void 0);return}let h=!0;return e.loadProfile(o,$e).then(x=>{h&&m(x)},()=>{h&&m(void 0)}),()=>{h=!1}},[o,$e]),(0,C.useEffect)(()=>{if(r===void 0||Q===void 0){P(void 0);return}let h=()=>P(ot(r,Q));h();let x=r.defaultView;return x?.addEventListener("resize",h),()=>x?.removeEventListener("resize",h)},[r,Q,d]);let me=(0,C.useRef)(null),te=(0,C.useRef)(null),Se=()=>{me.current!==null&&clearTimeout(me.current),me.current=null},he=()=>{te.current!==null&&clearTimeout(te.current),te.current=null};(0,C.useEffect)(()=>{if(r===void 0||o===void 0)return;let h=V=>{let W=V.target;if(!(W instanceof r.defaultView.Element))return;let Le=W.closest("[data-composer-text-ref]");if(Le===null)return;let X=lt(Le.textContent??"");X!==void 0&&(he(),Se(),me.current=setTimeout(()=>{me.current=null,I(X),P(ot(r,X)),$(e.loadUsage(o,X))},yo))},x=V=>{let W=V.target;W instanceof r.defaultView.Element&&W.closest("[data-composer-text-ref]")!==null&&(Se(),he(),te.current=setTimeout(()=>{te.current=null,I(void 0)},nt))};return r.addEventListener("pointerover",h,!0),r.addEventListener("pointerout",x,!0),()=>{Se(),he(),r.removeEventListener("pointerover",h,!0),r.removeEventListener("pointerout",x,!0)}},[r,o]),(0,C.useEffect)(()=>{if(r===void 0||k===void 0)return;let h=x=>{x.key==="Escape"&&I(void 0)};return r.addEventListener("keydown",h),()=>r.removeEventListener("keydown",h)},[r,k]);let J=(0,C.useRef)(d);J.current=d;let ye=(0,C.useRef)(void 0);ye.current=t.inputActions??(o===void 0?void 0:e.actionsFor(o));let Ce=(0,C.useRef)([]);Ce.current=mo({draft:d,draftRev:l.draftRev,phase:f,occurrences:u??l.occurrences});let Ue=(0,C.useRef)(void 0),Ve=(0,C.useRef)(void 0);return(0,C.useEffect)(()=>{if(r===void 0||Q===void 0||A===void 0)return;let h=wo(b?.argumentHint);if(h.length===0)return;let x=Ro(r,A,h);return r.body.append(x),()=>x.remove()},[r,Q,A,b]),(0,C.useEffect)(()=>{if(r===void 0||k===void 0||L)return;let h=Ao(r,e,{name:k,profile:b,usage:N,box:A,sessionId:o,getActions:()=>ye.current,getDraft:()=>J.current,onEnter:he,onLeave:()=>{Se(),he(),te.current=setTimeout(()=>{te.current=null,I(void 0)},nt)}});return r.body.append(h),()=>h.remove()},[r,k,b,N,A,o,L]),(0,C.useEffect)(()=>{if(r===void 0||!L){O(void 0);return}let h=()=>O(it(r));h();let x=r.defaultView;return x?.addEventListener("resize",h),()=>x?.removeEventListener("resize",h)},[r,L,d]),(0,C.useEffect)(()=>{if(r===void 0||!L||w===void 0)return;let h=Qn(b?.params??[],w.query);if(h.length===0)return;let x=Eo(r,{name:w.name,match:w,params:h,getActions:()=>ye.current,getDraft:()=>J.current,getOccurrences:()=>Ce.current});return Ue.current=x,r.body.append(x),st(r,x,g),()=>{Ue.current=void 0,x.remove()}},[r,L,w,b,g]),(0,C.useEffect)(()=>{if(r===void 0||!L)return;let h=x=>{x.key==="Escape"&&S(J.current)};return r.addEventListener("keydown",h),()=>r.removeEventListener("keydown",h)},[r,L]),(0,C.useEffect)(()=>{if(r===void 0||!L)return;let h=x=>{let V=Ue.current,W=x.target;V!==void 0&&W instanceof Node&&V.contains(W)||S(J.current)};return r.addEventListener("pointerdown",h,!0),()=>r.removeEventListener("pointerdown",h,!0)},[r,L]),(0,C.useEffect)(()=>{if(r===void 0||!ee){j(void 0);return}let h=()=>j(it(r));h();let x=r.defaultView;return x?.addEventListener("resize",h),()=>x?.removeEventListener("resize",h)},[r,ee,d]),(0,C.useEffect)(()=>{U(void 0)},[E?.query]),(0,C.useEffect)(()=>{if(r===void 0||!ee||E===void 0)return;let h=be(Y,E.query);if(h.length===0)return;let x=Co(r,{name:E.name,slot:E.slot,match:E,entries:h,selected:Xe(_,h.length)??0,getActions:()=>ye.current,getDraft:()=>J.current,getOccurrences:()=>Ce.current});return Ve.current=x,r.body.append(x),st(r,x,H),()=>{Ve.current=void 0,x.remove()}},[r,ee,E,Y,_,H]),(0,C.useEffect)(()=>{if(r===void 0||!ee)return;let h=x=>{if(x.key==="Escape"){F(J.current);return}if(x.key!=="ArrowUp"&&x.key!=="ArrowDown"&&x.key!=="Enter"&&x.key!=="Tab"||x.key==="Tab"&&x.shiftKey)return;let V=Jn(x.key,Y,E?.query??"",x.isComposing);if(V==="pass")return;if(x.preventDefault(),x.stopPropagation(),V==="insert"){let X=be(Y,E?.query??""),En=Xe(_,X.length),Tn=En===void 0?void 0:X[En];if(Tn===void 0||E===void 0)return;let qe=ye.current,Rn=qe?.captureInsertion?.();if(qe?.insertText===void 0||Rn===void 0)return;let An=Re(J.current,Ce.current,E,Rn.draftRev);if(An===void 0)return;qe.insertText(Je(Tn.slug),An);return}let W=be(Y,E?.query??"").length,Le=x.key==="ArrowUp"?"up":"down";U(X=>So(Xe(X,W),W,Le))};return r.addEventListener("keydown",h,!0),()=>r.removeEventListener("keydown",h,!0)},[r,ee,E,Y,_]),(0,C.useEffect)(()=>{if(r===void 0||!ee)return;let h=x=>{let V=Ve.current,W=x.target;V!==void 0&&W instanceof Node&&V.contains(W)||F(J.current)};return r.addEventListener("pointerdown",h,!0),()=>r.removeEventListener("pointerdown",h,!0)},[r,ee]),null}}function Ro(e,n,t){let r=e.createElement("div");r.className="dsh-better-skill-hint",r.textContent=t.join(`
`);let o=n.right+tt>Pe(e)-bo;return r.style.left=`${o?n.left:n.right+tt}px`,r.style.top=`${o?n.bottom+2:n.top}px`,r}function Ao(e,n,t){let r=e.createElement("div");r.className="dsh-better-skill-panel",r.addEventListener("pointerenter",t.onEnter),r.addEventListener("pointerleave",t.onLeave);let o=e.createElement("div");o.className="dsh-better-skill-panel-title",o.textContent=`/${t.name}`,r.append(o);let i=t.profile?.description;if(i!==void 0&&i!==""){let l=e.createElement("div");l.className="dsh-better-skill-panel-desc",l.textContent=i,l.title=i,r.append(l)}let a=t.profile?.metadata??{},s=Object.keys(a);if(s.length>0){let l=e.createElement("div");l.className="dsh-better-skill-panel-section",l.append(Ze(e,n.translate("skill.metadata")));for(let d of s){let f=e.createElement("div");f.textContent=`${d}: ${a[d]??""}`,l.append(f)}r.append(l)}let c=t.profile?.path;if(c!==void 0&&c!==""){r.append(Ze(e,n.translate("skill.path")));let l=e.createElement("div");l.className="dsh-better-skill-panel-path",l.textContent=c,r.append(l)}if(t.usage!==void 0){let l=e.createElement("div");l.className="dsh-better-skill-panel-counts",l.textContent=`${n.translate("skill.usage.session")} ${t.usage.session}`,t.usage.workspace!==void 0&&(l.textContent+=` \xB7 ${n.translate("skill.usage.workspace")} ${t.usage.workspace}`),r.append(l)}let u=t.profile?.params??[];if(u.length>0&&t.getActions()?.insertText!==void 0){r.append(Ze(e,n.translate("skill.params")));for(let l of u)r.append(Po(e,n,t,l.flag,l.detail))}{let d=Pe(e),f=xo(i?.length??0,d);if(r.style.width=`${f}px`,t.box!==void 0){let p=ct(t.box,Ae(e),r.offsetHeight,4);r.style.left=`${ut(p.left,f,d,12)}px`,p.anchor==="above"?(r.style.bottom=`${Ae(e)-t.box.top+4}px`,r.style.top=""):(r.style.top=`${p.top}px`,r.style.bottom="")}}return r}function Ze(e,n){let t=e.createElement("div");return t.className="dsh-better-skill-panel-label",t.textContent=n,t}function Po(e,n,t,r,o){let i=e.createElement("button");i.type="button",i.className="dsh-better-skill-panel-param",i.title=n.translate("skill.hint.insert"),i.addEventListener("pointerdown",s=>s.preventDefault());let a=e.createElement("span");if(a.className="dsh-better-skill-panel-param-flag",a.textContent=r,i.append(a),o!==""){let s=e.createElement("span");s.className="dsh-better-skill-panel-param-detail",s.textContent=o,i.append(s)}return i.addEventListener("click",()=>{let s=t.getActions();if(s?.insertText===void 0||s.captureInsertion===void 0)return;let c=s.captureInsertion();s.insertText(ko(t.getDraft(),r),c)}),i}var pt="dsh-better/skill-enhancer.css",Oo=`
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
`;function gt(e){if(e===void 0)return()=>{};let n=`style[data-plugin-css=${JSON.stringify(pt)}]`;if(e.querySelector(n)!==null)return()=>{};let t=e.createElement("style");return t.dataset.plugin="dsh-better",t.dataset.pluginCss=pt,t.textContent=Oo,e.head.append(t),()=>t.remove()}function mt(e,n,t){if(n===void 0||n===""||e.length===0)return;let r=0;for(let o of e){if(o.cwd!==n)continue;let i=o.usage?.[t];typeof i=="number"&&Number.isFinite(i)&&(r+=i)}return r}var R=require("react");var Io="@deepseek-ai/dsh-client-ui-commands/PopupSelectView.module.css";function ht(e){if(e===void 0)return;let t=e.querySelector(`style[data-plugin-css="${Io}"]`)?.textContent??"",r=i=>new RegExp(`\\.(\\w+_${i})\\{`,"u").exec(t)?.[1],o={badges:"dshBetter_badges",badgeChip:"dshBetter_badgeChip",badgeChipOn:"dshBetter_badgeChipOn",card:r("card"),viewport:r("viewport"),row:r("row"),rowActive:r("rowActive"),label:r("label"),labelText:r("labelText"),badge:r("badge"),detail:r("detail"),check:r("check"),status:r("status"),search:r("search"),error:r("error"),errorText:r("errorText"),retry:r("retry")};for(let[i,a]of Object.entries(o))if(!(i==="badges"||i==="badgeChip"||i==="badgeChipOn")&&a===void 0)return;return o}function tn(e,n){for(let t of e)if(t.id===n.provider){for(let r of t.models)if(r.id===n.model)return r.reasoning}}function yt(e,n){let t=tn(e,n)?.efforts;return t===void 0?[]:[...t]}function bt(e,n){if(e.length===0)return;let t=r=>r!==void 0&&e.some(o=>o.id===r);return t(n.remembered)?n.remembered:n.isCurrent&&t(n.currentEffort)?n.currentEffort:t(n.defaultEffort)?n.defaultEffort:e[0]?.id}function No(e){return e.length>1}function kt(e){return No(e)?e:[]}var K=require("react/jsx-runtime");function Oe(e){let n=e.group?.name;if(n===void 0)return;let t=`${n}/`,r=e.id.startsWith(t)?e.id.slice(t.length):e.id;return{provider:n,model:r}}function Do(e,n){let t=Oe(e);return kt(t===void 0?[]:yt(n??[],t))}function wt({option:e,active:n,catalog:t,pointed:r,classes:o,primitives:i,onChoose:a,onPickEffort:s,onHover:c,t:u}){let l=Do(e,t),d=i.IconCheckOutlineRegular;return(0,K.jsxs)("div",{role:"option","aria-selected":n,"aria-label":e.badge===void 0?void 0:`${e.label} ${e.badge}`,className:n?`${o.row} ${o.rowActive}`:o.row,onClick:a,onMouseEnter:c,children:[(0,K.jsxs)("span",{className:o.label,children:[(0,K.jsx)("span",{className:o.labelText,children:e.label}),e.badge!==void 0&&(0,K.jsx)("sup",{className:o.badge,children:e.badge})]}),e.detail!==void 0&&(0,K.jsx)("span",{className:o.detail,children:e.detail}),l.length>0&&(0,K.jsx)("span",{className:o.badges,role:"group","aria-label":u?.("listbox.aria")??"",children:l.map(f=>(0,K.jsx)("button",{type:"button",className:f.id===r?`${o.badgeChip} ${o.badgeChipOn}`:o.badgeChip,title:f.description??f.name,onClick:p=>{p.stopPropagation(),s(f.id)},children:f.name},f.id))}),e.active===!0&&l.length===0&&(0,K.jsx)("span",{className:o.check,children:d===void 0?null:(0,K.jsx)(d,{})})]})}function Ie(e){let n=new Map;for(let t of e){let r=t.group?.name,o=n.get(r);o!==void 0?o.rows.push(t):n.set(r,{group:t.group,rows:[t]})}return[...n.values()]}function Ne(e){let n=Ie(e);return n.some(t=>t.group!==void 0)?n.flatMap(t=>t.rows):[...e]}function xt(e,n,t){return t===void 0?e.filter(r=>r.label.toLowerCase().includes(n)):Ie(e).flatMap(r=>t(r.rows.map(o=>({name:o.label,option:o})),n).map(o=>o.option))}var rn=new WeakSet;async function vt(e,n){let t=e.binding,r=e.state.getSnapshot();if(!(t===null||r.submitting||rn.has(e))){rn.add(e),e.state.set?.({...r,submitting:!0,confirming:null,acknowledged:!1,error:null});try{let o=n();if(o===void 0)return;await o,t!==null&&e.binding===t&&e.deps?.consume?.(t.segment)}finally{rn.delete(e),t!==null&&e.binding===t&&e.dismiss({focusComposer:!0})}}}var _o="@deepseek-ai/dsh-client-ui-primitives";function De(e){if(e===null)return{};let n;try{n=e(_o)}catch{return{}}if(n===null||typeof n!="object")return{};let t=n,r=m=>typeof m=="function"||typeof m=="object"&&m!==null,o=m=>{let k=t[m];return r(k)?k:void 0},i=m=>{let k=t[m];return typeof k=="function"?k:void 0},a={},s=o("MenuSurface");s!==void 0&&(a.MenuSurface=s);let c=o("MenuGroup");c!==void 0&&(a.MenuGroup=c);let u=o("IconCheckOutlineRegular");u!==void 0&&(a.IconCheckOutlineRegular=u);let l=o("IconDataOutlineRegular");l!==void 0&&(a.IconDataOutlineRegular=l);let d=o("IconChevronDownOutlineRegular");d!==void 0&&(a.IconChevronDownOutlineRegular=d);let f=o("Tag");f!==void 0&&(a.Tag=f);let p=i("useAnchoredMaxHeight");p!==void 0&&(a.useAnchoredMaxHeight=p);let y=i("observeStickyMenuGroups");y!==void 0&&(a.observeStickyMenuGroups=y);let b=i("rankByName");return b!==void 0&&(a.rankByName=b),a}function Mo(e){if(e===void 0)return[];let n=[e.name,e.label].map(t=>t.trim().toLowerCase()).filter(t=>t!=="");return[...new Set(n)]}function Fo(e,n){return Mo(e.group).some(t=>t.includes(n))}function Bo(e,n,t,r){return t==="fuzzy-label"?xt(e,n,r):Ne(e).filter(o=>o.label.toLowerCase().includes(n)||o.detail?.toLowerCase().includes(n)===!0)}function St(e,n,t,r){let o=n.trim().toLowerCase();if(o==="")return Ne(e);let i=Bo(e,o,t,r),a=new Set(i),s=Ne(e).filter(c=>!a.has(c)&&Fo(c,o));return[...i,...s]}var M=require("react/jsx-runtime"),Tt="model",Ct=320;function Ho(e){return e.command!==Tt||!e.open||e.status!=="ready"||e.confirming!==null||e.options.length===0?!1:e.submitting||e.error===null}function Wo(e){return e===void 0?!1:/Android|iPhone|iPad|iPod/i.test(e.userAgent)||e.platform==="MacIntel"&&e.maxTouchPoints>1}var zo={subscribe:()=>()=>{},getSnapshot:()=>({open:!1,command:null,status:"pending",options:[],search:"",searchLabels:null,searchMode:"substring",active:0,submitting:!1,confirming:null,acknowledged:!1,error:null})};function Rt(e){let n=De(e.load);function t(r){let o=r.popup,i=o?.state??zo,a=(0,R.useCallback)(l=>i.subscribe(l),[i]),s=(0,R.useCallback)(()=>i.getSnapshot(),[i]),c=(0,R.useSyncExternalStore)(a,s),u=e.native();return o===void 0||u===void 0?null:!Ho(c)||o.settle===void 0?(0,M.jsx)(u,{...r}):(0,M.jsx)($o,{popup:o,state:c,t:r.t,primitives:n,doc:e.document,catalog:r.catalog,current:r.current,selectModel:r.selectModel})}return t}function $o({popup:e,state:n,t,primitives:r,doc:o,catalog:i,current:a,selectModel:s}){let c=(0,R.useRef)(null),u=(0,R.useRef)(null),l=(0,R.useRef)(null),d=(0,R.useMemo)(()=>ht(o),[o]),f=n.searchMode,p=(0,R.useMemo)(()=>St(n.options,n.search,f,r.rankByName),[n.options,n.search,f,r.rankByName]),y=(0,R.useMemo)(()=>Ie(p),[p]),[b,m]=(0,R.useState)({}),[k,I]=(0,R.useState)(()=>Lt(p));(0,R.useEffect)(()=>{I(Lt(p))},[n.search,n.options]);let A=Et(p,k),P=Uo(r,c,n);(0,R.useEffect)(()=>{let w=l.current;if(!(w===null||r.observeStickyMenuGroups===void 0))return r.observeStickyMenuGroups(w)},[r.observeStickyMenuGroups,n.open,n.status,y]),(0,R.useEffect)(()=>{c.current?.querySelector('[aria-selected="true"]')?.scrollIntoView({block:"nearest"})},[A,p]),(0,R.useEffect)(()=>{if(!n.open)return;let w=L=>{let E=c.current;E!==null&&L.target instanceof Node&&E.contains(L.target)||e.dismiss()};return o?.addEventListener("pointerdown",w,!0),()=>{o?.removeEventListener("pointerdown",w,!0)}},[o,e,n.open]),(0,R.useEffect)(()=>{n.open&&(Wo(o?.defaultView?.navigator)||u.current?.focus())},[o,n.open]);let N=(0,R.useCallback)((w,L)=>{if(L===void 0||s===void 0){e.settle?.(e.binding,w);return}let E=Oe(w);if(E===void 0){e.settle?.(e.binding,w);return}vt(e,()=>s({...E,reasoningEffort:L}))},[e,s]),$=(0,R.useCallback)(w=>{let L=Oe(w);if(L===void 0)return;let E=tn(i??[],L);return bt(E?.efforts??[],{remembered:b[w.id],isCurrent:a?.provider===L.provider&&a?.model===L.model,currentEffort:a?.reasoningEffort,defaultEffort:E?.defaultEffort})},[i,a,b]),v=(0,R.useCallback)(w=>{N(w,$(w))},[$,N]),S=(0,R.useCallback)((w,L)=>{m(E=>({...E,[w.id]:L})),N(w,L)},[N]),g=(0,R.useCallback)(()=>{let w=p[A];w!==void 0&&v(w)},[A,v,p]),O=(0,R.useCallback)(w=>{p.length!==0&&I(L=>(Et(p,L)+w+p.length)%p.length)},[p]),D=w=>{switch(w.key){case"ArrowDown":w.preventDefault(),O(1);return;case"ArrowUp":w.preventDefault(),O(-1);return;case"Enter":w.preventDefault(),g();return;case"Tab":if(!w.shiftKey&&p.length===0)return;w.preventDefault(),w.shiftKey?e.dismiss({focusComposer:!0}):g();return;case"Escape":w.preventDefault(),e.dismiss({focusComposer:!0});return;default:}};if(d===void 0)return null;let F=n.searchLabels?.placeholder??t?.("search.placeholder")??"",H=n.searchLabels===null?t?.("status.empty")??"":n.options.length===0?n.searchLabels.empty:n.searchLabels.noResults,j=(w,L)=>(0,M.jsx)(wt,{option:w,active:L===A,catalog:i,pointed:L===A?$(w):void 0,classes:d,primitives:r,onChoose:()=>{v(w)},onPickEffort:E=>{S(w,E)},onHover:()=>{I(L)},t},w.id),_=0,U=y.map(({group:w,rows:L})=>{let E=L.map(Y=>j(Y,_++));return w===void 0?(0,M.jsx)(R.Fragment,{children:E},"ungrouped"):r.MenuGroup===void 0?(0,M.jsx)(R.Fragment,{children:E},`group:${w.name}`):(0,M.jsx)(r.MenuGroup,{label:w.label,children:E},`group:${w.name}`)}),se=(0,M.jsxs)(M.Fragment,{children:[(0,M.jsx)("input",{ref:u,className:d.search,type:"text",placeholder:F,"aria-label":t?.("search.aria")??"",value:n.search,readOnly:n.submitting,onChange:w=>{e.setSearch(w.currentTarget.value)}}),n.submitting&&(0,M.jsx)("div",{className:d.status,children:t?.("status.applying")??""}),!n.submitting&&p.length===0&&(0,M.jsx)("div",{className:d.status,children:H}),p.length>0&&(0,M.jsx)("div",{ref:l,role:"listbox","aria-label":t?.("listbox.aria")??"",className:d.viewport,children:U})]}),Q={className:d.card,style:{maxHeight:P},"aria-label":t?.("overlay.aria")??Tt,onKeyDown:D};return r.MenuSurface===void 0?(0,M.jsx)("div",{ref:c,...Q,children:se}):(0,M.jsx)(r.MenuSurface,{ref:c,...Q,children:se})}function Lt(e){let n=e.findIndex(t=>t.active===!0);return n===-1?0:n}function Et(e,n){return e.length===0?0:Math.min(Math.max(n,0),e.length-1)}function Uo(e,n,t){let r=e.useAnchoredMaxHeight;return r===void 0?Ct:r(n,Ct,t)}var q=require("react");var on="application/x-dsh-composer+json";var Vo=Object.freeze({png:"image/png",jpg:"image/jpeg",jpeg:"image/jpeg",webp:"image/webp",gif:"image/gif",bmp:"image/bmp",svg:"image/svg+xml",avif:"image/avif",heic:"image/heic",heif:"image/heif",tif:"image/tiff",tiff:"image/tiff"});function At(e){return JSON.stringify({v:1,text:e.text,attachments:e.attachments.map(n=>({path:n.path,name:n.name,type:n.type,kind:n.kind}))})}function Pt(e){if(typeof e!="string"||e==="")return;let n;try{n=JSON.parse(e)}catch{return}if(n===null||typeof n!="object")return;let t=n;if(t.v!==1)return;let r=typeof t.text=="string"?t.text:"",o=Array.isArray(t.attachments)?t.attachments:[],i=[];for(let a of o){if(a===null||typeof a!="object")continue;let s=a,c=s.path;typeof c!="string"||c===""||i.push({path:c,name:typeof s.name=="string"&&s.name!==""?s.name:sn(c),type:typeof s.type=="string"?s.type:"",kind:s.kind==="image"?"image":"file"})}return{text:r,attachments:i}}function an(e,n){if(n.length===0)return e;let t=n.join(`
`);return e===""?t:`${e.replace(/\n+$/u,"")}

${t}`}function Ot(e){if(e==="")return;let n=e.split(`
`),t=[],r=n.length;for(let i=n.length-1;i>=0;i-=1){let a=n[i]??"";if(a.trim()===""){if(t.length>0){r=i;continue}continue}let s=qo(a);if(s===void 0)break;t.unshift(s),r=i}return t.length===0?void 0:{text:n.slice(0,r).join(`
`).replace(/\n+$/u,""),paths:t}}function qo(e){let n=e.trim();if(n.startsWith("@")&&(n=n.slice(1)),n.startsWith('"')&&n.endsWith('"')&&n.length>1&&(n=n.slice(1,-1)),n!==""&&jo(n)&&!/[\u0000-\u001f\u007f]/u.test(n)&&!/["\u2018\u2019\u201c\u201d\u300c\u300d\u300e\u300f\u3002\uff01\uff1f\uff1b\uff1a\uff0c\u3001\u2026*?;<>|&$`!#=]/u.test(n)&&!/(?:^|\s)-{1,2}\S/u.test(n)&&!/ line:\d+(?:-\d+)?$/u.test(n))return n}function jo(e){return e.startsWith("/")||/^[A-Za-z]:[/\\]/u.test(e)||e.startsWith("\\\\")}function It(e){let n=/\.([A-Za-z0-9]+)$/u.exec(e);if(n!==null)return Vo[n[1]?.toLowerCase()??""]}function sn(e){return e.split(/[\\/]/u).filter(t=>t!=="").at(-1)??e}function Nt(e,n){let t=new Set(n),r=[],o=[];for(let i of e){if(t.has(i.path)){o.push(i.path);continue}t.add(i.path),r.push(i)}return{accepted:r,duplicates:o}}var ue=require("react/jsx-runtime"),Ko="data-dsh-better-attach-item",Go="data-dsh-better-attach-selected",Yo=4500,Jo=new Set(["a","c","x","insert"]),Xo=new Set(["meta","control","shift","alt","altgraph","capslock","os"]),Zo=/\s/u;function _t(e){function n(t){let r=e.native();return r===void 0?null:(0,ue.jsx)(Qo,{native:r,props:t,deps:e})}return n}function Qo({native:e,props:n,deps:t}){let r=(0,q.useRef)(null),[o,i]=(0,q.useState)(!1),[a,s]=(0,q.useState)(null),c=(n.attachments??[]).length>0,u=(0,q.useRef)(n);u.current=n;let l=(0,q.useRef)(o);l.current=o;let d=(p,y)=>n.t?.(p,y)??t.translate()?.(p,y)??"",f=(0,q.useRef)(d);return f.current=d,(0,q.useEffect)(()=>{let p=r.current;if(p===null)return;let y=p.querySelector('[role="group"]');if(y!==null)for(let b of Array.from(y.children)){if(!(b instanceof HTMLElement))continue;b.toggleAttribute(Ko,!0);let m=ri(b);m!==null&&m.toggleAttribute(Go,o)}},[o,n.attachments]),(0,q.useEffect)(()=>{if(a===null)return;let p=globalThis.setTimeout(()=>{s(null)},Yo);return()=>{globalThis.clearTimeout(p)}},[a]),(0,q.useEffect)(()=>{let p=r.current;if(p===null)return;let y=p.closest("[data-composer-card]");if(!(y instanceof HTMLElement))return;let b=y.ownerDocument,m=g=>(g instanceof Element?g:g instanceof Node?g.parentElement:null)?.closest("[contenteditable]")??null,k=()=>{l.current&&i(!1)},I=()=>{let g=y.ownerDocument.getSelection();return g!==null&&!g.isCollapsed&&g.toString()!==""},A=g=>g instanceof Node&&y.contains(g),P=g=>{let O=g.key.toLowerCase();if(Xo.has(O))return;let D=g.metaKey||g.ctrlKey;if(D&&!g.altKey&&O==="a"){A(g.target)&&m(g.target)?.getAttribute("contenteditable")==="true"&&i(!0);return}if(D&&!g.altKey&&O==="c"&&l.current&&A(g.target)&&!I()){g.preventDefault(),ni(u.current,t,s,f.current);return}D&&!g.altKey&&Jo.has(O)||k()},N=()=>{k()},$=g=>{let D=u.current.attachments??[],F=g.clipboardData;if(!l.current||D.length===0||F===null)return;let H=[],j=[];for(let _ of D){let U=t.pathOf(_.file);if(U===""){j.push(_.file.name);continue}H.push({path:U,name:_.file.name,type:_.file.type,kind:_.kind})}if(H.length>0){let _=F.getData("text/plain");F.setData(on,At({text:_,attachments:H})),F.setData("text/plain",an(_,H.map(U=>U.path)))}j.length>0&&s(f.current("attach.copySkipped",{count:String(j.length)}))},v=g=>{let O=g.clipboardData;if(O===null||m(g.target)===null||Array.from(O.types).includes("Files"))return;let D=()=>u.current,F=Pt(O.getData(on)),H=F===void 0?Ot(O.getData("text/plain")):void 0;if(F===void 0&&H===void 0)return;let j=ei(u.current.phase?.(),f.current);if(j!==void 0){g.preventDefault(),g.stopPropagation(),s(j);return}if(g.preventDefault(),g.stopPropagation(),k(),F!==void 0){Dt(F,D,t,s,f.current);return}H!==void 0&&Dt({text:H.text,attachments:H.paths.map(_=>{let U=It(_)??"";return{path:_,name:sn(_),type:U,kind:U===""?"file":"image"}})},D,t,s,f.current)};b.addEventListener("keydown",P,!0),y.addEventListener("paste",v,!0);let S=g=>{let O=g.relatedTarget;O instanceof Node&&y.contains(O)||k()};return y.addEventListener("focusout",S),b.addEventListener("copy",$),b.addEventListener("pointerdown",N,!0),()=>{b.removeEventListener("keydown",P,!0),b.removeEventListener("copy",$),y.removeEventListener("paste",v,!0),y.removeEventListener("focusout",S),b.removeEventListener("pointerdown",N,!0)}},[t]),(0,ue.jsxs)("div",{ref:r,className:c?"dshBetter_railHost":"dshBetter_railHostEmpty",children:[(0,ue.jsx)(e,{...n}),a!==null&&(0,ue.jsx)("div",{className:"dshBetter_attachNotice",role:"status",children:a})]})}function ei(e,n){return ne(e)?n("attach.pasteBusy"):void 0}function ni(e,n,t,r){let o=e.attachments??[],i=[],a=0;for(let s of o){let c=n.pathOf(s.file);c===""?a+=1:i.push(c)}i.length>0&&globalThis.navigator?.clipboard?.writeText(an("",i)).catch(()=>{t(r("attach.copyFailed"))}),a>0&&t(r("attach.copySkipped",{count:String(a)}))}function Dt(e,n,t,r,o){let i=n();if(ln(i,e.text),e.attachments.length===0)return;let a=t.reader(),s=i.sessionId;if(a===void 0||s===void 0){ln(i,e.attachments.map(l=>l.path).join(`
`));return}let c=(i.attachments??[]).map(l=>t.pathOf(l.file)).filter(l=>l!==""),{accepted:u}=Nt(e.attachments,c);u.length!==0&&(async()=>{let l=[],d=[],f=0;for(let y of u){let b=await ti(a,s,y);b.kind==="file"?l.push(b.file):b.kind==="mention"?d.push(b.mention):f+=1}let p=n();d.length>0&&ln(p,d.join(" ")),l.length>0&&p.onAddFiles?.(l),f>0&&r(o("attach.pasteMissing",{count:String(f)})),d.length>0&&r(o("attach.pasteReferenced",{count:String(d.length)}))})()}function ln(e,n){if(n==="")return;let t=e.inputActions,r=t?.captureInsertion?.();t?.insertText===void 0||r===void 0||t.insertText(n,r)}async function ti(e,n,t){let r=await e.readBytes?.(n,t.path,{});if(r!==void 0&&r.ok)return{kind:"file",file:new File([r.value.data],t.name,{type:t.type})};let o=await e.stat?.(n,t.path);return o!==void 0&&o.ok?{kind:"mention",mention:oi(t.path)}:{kind:"missing"}}function ri(e){let n=e.querySelector("img")?.parentElement;if(n!=null)return n;let t=e.firstElementChild;return t instanceof HTMLElement?t:null}function oi(e){return Zo.test(e)?`@"${e}"`:`@${e}`}var ii="better.focusComposer",ai=Object.freeze(["focus input","focus composer","message input"]),ke="command.focusComposer",si=Object.freeze(["page","editable","terminal"]),li=Object.freeze({"desktop:macos":{code:"Space",modifiers:["primary"]},"desktop:windows":{code:"Space",modifiers:["primary","shift"]},"web:macos":{code:"Space",modifiers:["primary","shift"]},"web:windows":{code:"Space",modifiers:["primary","shift"]}}),di="[data-composer-input], [role='textbox'][aria-multiline='true']";function Ft(e){return e===void 0||typeof e.querySelector!="function"?!1:e.querySelector(di)!=null}function dn(e,n){if(e===null||typeof e!="object")return;let t=e.get;if(typeof t=="function"){let r=t.call(e,n);return r===null?void 0:r}return e[n]}var Mt=e=>typeof e=="string"&&e!==""?e:void 0;function Bt(e){let t=dn(e,"uiSession")?.adapter?.current?.getSnapshot?.();if(t!==void 0)return Mt(t.key);let r=dn(e,"sessions");return Mt(r?.list?.getSnapshot?.()?.current)}function Ht(e,n){try{let t=e.sessions?.scope?.(n);if(t===void 0)return!1;let o=dn(t,"conversation")?.input?.for?.(t);return o===void 0||typeof o.focus!="function"?!1:(o.focus(),!0)}catch{return!1}}function ui(e){return(n={})=>{if(n.modal!=null)return{status:"pass"};if(!e.composerMounted())return{status:"pass"};let t=e.currentSessionId();return t===void 0?{status:"pass"}:{status:"handled",run:()=>{e.focusComposer(t)}}}}function ci(e,n){return{id:ii,label:n,aliases:ai,defaults:li,regions:si,modals:[],resolve:ui(e)}}function Wt(e,n,t,r){if(e===void 0||typeof e.register!="function")return()=>{};try{return e.register(ci(n,t))}catch(o){return r?.(o instanceof Error?o.message:String(o)),()=>{}}}var zt=Object.freeze({zh:{"overlay.aria":"\u9009\u62E9\u6A21\u578B","listbox.aria":"\u6A21\u578B\u5339\u914D\u9879","search.aria":"\u641C\u7D22\u4F9B\u5E94\u5546\u6216\u6A21\u578B","search.placeholder":"\u641C\u7D22\u4F9B\u5E94\u5546\u6216\u6A21\u578B\u2026","status.empty":"\u6CA1\u6709\u53EF\u7528\u7684\u6A21\u578B\u3002","status.applying":"\u6B63\u5728\u5207\u6362\u2026",retry:"\u91CD\u8BD5","trigger.selectAria":"\u9009\u62E9\u6A21\u578B","trigger.aria":"\u5F53\u524D\u6A21\u578B {model}\uFF0C\u70B9\u51FB\u5207\u6362","trigger.ariaEffort":"\u5F53\u524D\u6A21\u578B {model}\uFF0C\u63A8\u7406\u7B49\u7EA7 {effort}\uFF0C\u70B9\u51FB\u5207\u6362","trigger.fallback":"\u9009\u62E9\u6A21\u578B","trigger.loading":"\u52A0\u8F7D\u6A21\u578B\u2026",[ke]:"\u805A\u7126\u8F93\u5165\u6846","attach.copySkipped":"{count} \u4E2A\u9644\u4EF6\u6765\u81EA\u526A\u8D34\u677F\u3001\u6CA1\u6709\u672C\u5730\u8DEF\u5F84\uFF0C\u672A\u590D\u5236","attach.pasteMissing":"{count} \u4E2A\u9644\u4EF6\u5BF9\u5E94\u7684\u6587\u4EF6\u5DF2\u4E0D\u5B58\u5728\uFF0C\u672A\u7C98\u8D34","attach.pasteReferenced":"{count} \u4E2A\u9644\u4EF6\u8D85\u51FA\u5355\u6B21\u8BFB\u53D6\u4E0A\u9650\uFF0C\u5DF2\u6539\u4E3A\u8DEF\u5F84\u5F15\u7528","attach.copyFailed":"\u6D4F\u89C8\u5668\u62D2\u7EDD\u4E86\u8FD9\u6B21\u526A\u8D34\u677F\u5199\u5165","attach.pasteBusy":"\u6D88\u606F\u6B63\u5728\u53D1\u9001\uFF0C\u7A0D\u540E\u518D\u7C98\u8D34","compaction.reading":"\u538B\u7F29 {count} \u6B21","compaction.readingOne":"\u538B\u7F29 1 \u6B21","compaction.tooltip":"\u672C\u4F1A\u8BDD\u4E0A\u4E0B\u6587\u5DF2\u538B\u7F29 {count} \u6B21","compaction.tooltipWithFailures":"\u672C\u4F1A\u8BDD\u4E0A\u4E0B\u6587\u5DF2\u538B\u7F29 {count} \u6B21\uFF0C\u53E6\u6709 {failures} \u6B21\u538B\u7F29\u5931\u8D25","tabs.nav":"Tab \u7BA1\u7406","tabs.heading":"Tab \u7BA1\u7406","tabs.chat":"\u5BF9\u8BDD","tabs.empty":"\u8FD8\u6CA1\u6709\u63D2\u4EF6\u6CE8\u518C\u4F1A\u8BDD\u6807\u7B7E\u3002","tabs.show":"\u5728\u6807\u7B7E\u680F\u663E\u793A{label}","tabs.hide":"\u4ECE\u6807\u7B7E\u680F\u9690\u85CF{label}","alias.nav":"\u6280\u80FD\u522B\u540D","alias.heading":"\u6280\u80FD\u522B\u540D","alias.prefix.title":"\u9700\u8981\u659C\u6760\u524D\u7F00","alias.prefix.on":"\u6253\u5F00\u5219\u9700\u8981\u8F93\u5165 \u201C/\u201D \u8FDB\u884C\u5339\u914D","alias.prefix.off":"\u6253\u5F00\u5219\u65E0\u9700\u8F93\u5165 \u201C/\u201D \u8FDB\u884C\u5339\u914D","alias.table.keyword":"\u5173\u952E\u8BCD","alias.table.target":"\u6280\u80FD\u6216\u547D\u4EE4","alias.table.params":"\u53C2\u6570","alias.table.paramsPlaceholder":"\u53EF\u9009\uFF0C\u5982 run","alias.table.actions":"\u64CD\u4F5C","alias.add":"\u6DFB\u52A0\u522B\u540D","alias.remove":"\u5220\u9664\u522B\u540D {keyword}","alias.unnamed":"\uFF08\u672A\u547D\u540D\uFF09","alias.empty":"\u8FD8\u6CA1\u6709\u522B\u540D\u3002\u4F8B\u5982\uFF1Awf \u2192 /flow-workflow run","alias.footnote":"\u8F93\u5165\u5173\u952E\u8BCD\u540E\u4ECE\u9762\u677F\u9009\u62E9\u5373\u53EF\u63D2\u5165\u5B8C\u6574\u8C03\u7528\uFF1B\u6539\u5B8C\u7ACB\u5373\u751F\u6548\u3002","alias.menu.section":"\u6280\u80FD\u522B\u540D","alias.menu.params":"\u53C2\u6570\uFF1A{value}","skill.metadata":"\u5143\u6570\u636E","skill.path":"\u5730\u5740","skill.usage.session":"\u672C\u4F1A\u8BDD\u8C03\u7528","skill.usage.workspace":"\u672C\u5DE5\u4F5C\u533A\u8C03\u7528","skill.params":"\u53C2\u6570","skill.hint.insert":"\u70B9\u51FB\u63D2\u5165","continue.label":"\u7EE7\u7EED","continue.sending":"\u7EE7\u7EED\u4E2D\u2026","link.copy":"\u590D\u5236","link.copied":"\u5DF2\u590D\u5236","link.copyFailed":"\u590D\u5236\u5931\u8D25","link.copyAria":"\u590D\u5236\u94FE\u63A5\u5730\u5740"},en:{"overlay.aria":"Select a model","listbox.aria":"Matching models","search.aria":"Search providers or models","search.placeholder":"Search providers or models\u2026","status.empty":"No models available.","status.applying":"Switching\u2026",retry:"Retry","trigger.selectAria":"Select model","trigger.aria":"Current model {model}, click to change","trigger.ariaEffort":"Current model {model}, reasoning effort {effort}, click to change","trigger.fallback":"Select model","trigger.loading":"Loading models\u2026",[ke]:"Focus message input","attach.copySkipped":"{count} attachment(s) came from the clipboard with no local path and were not copied","attach.pasteMissing":"{count} attachment(s) no longer exist and were not pasted","attach.pasteReferenced":"{count} attachment(s) exceed the read limit and became path references","attach.copyFailed":"The browser refused this clipboard write","attach.pasteBusy":"A message is being sent; paste again in a moment","compaction.reading":"{count} compactions","compaction.readingOne":"1 compaction","compaction.tooltip":"This session's context was compressed {count} time(s)","compaction.tooltipWithFailures":"This session's context was compressed {count} time(s), with {failures} failed attempt(s)","tabs.nav":"Tabs","tabs.heading":"Tabs","tabs.chat":"Chat","tabs.empty":"No plugin has registered a conversation tab yet.","tabs.show":"Show {label} in the tab bar","tabs.hide":"Hide {label} from the tab bar","alias.nav":"Skill aliases","alias.heading":"Skill aliases","alias.prefix.title":"Require a slash prefix","alias.prefix.on":"To open, type \u201C/\u201D to match","alias.prefix.off":"To open, type the keyword without \u201C/\u201D to match","alias.table.keyword":"Keyword","alias.table.target":"Skill or command","alias.table.params":"Arguments","alias.table.paramsPlaceholder":"Optional, e.g. run","alias.table.actions":"Actions","alias.add":"Add alias","alias.remove":"Delete alias {keyword}","alias.unnamed":"(unnamed)","alias.empty":"No aliases yet. For example: wf \u2192 /flow-workflow run","alias.footnote":"Type a keyword and pick from the panel to insert the full invocation; changes apply immediately.","alias.menu.section":"Skill aliases","alias.menu.params":"args: {value}","skill.metadata":"Metadata","skill.path":"Path","skill.usage.session":"This session","skill.usage.workspace":"This workspace","skill.params":"Arguments","skill.hint.insert":"Click to insert","continue.label":"Continue","continue.sending":"Continuing\u2026","link.copy":"Copy","link.copied":"Copied","link.copyFailed":"Copy failed","link.copyAria":"Copy link address"}});var $t="dsh-better-effort",fi=`
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
`;function Ut(e){if(e===void 0)return()=>{};if(e.getElementById($t)!==null)return()=>{};let n=e.createElement("style");return n.id=$t,n.textContent=fi,e.head.append(n),()=>{n.remove()}}var jt="dsh-better.layout-widths",ce=Object.freeze({sidebar:null,rightbar:null});function Kt(e){return typeof e=="number"&&Number.isFinite(e)&&e>0}function _e(e){if(e===void 0)return ce;let n;try{n=e.getItem(jt)}catch{return ce}if(n===null||n==="")return ce;let t;try{t=JSON.parse(n)}catch{return ce}if(typeof t!="object"||t===null||Array.isArray(t))return ce;let r=t;return{sidebar:Vt(r.sidebar),rightbar:Vt(r.rightbar)}}function Gt(e,n){if(e===void 0)return;let t={};n.sidebar!==null&&(t.sidebar=Math.round(n.sidebar)),n.rightbar!==null&&(t.rightbar=Math.round(n.rightbar));try{e.setItem(jt,JSON.stringify(t))}catch{}}function Vt(e){return Kt(e)?Math.round(e):null}function Yt(e){if(typeof e!="string")return ce;let n=e.trim().split(/\s+/).filter(t=>t!=="");return{sidebar:qt(n[0]),rightbar:qt(n[2])}}function qt(e){if(e===void 0)return null;let n=/^([0-9]+(?:\.[0-9]+)?)px$/.exec(e);if(n===null)return null;let t=Number(n[1]);return Kt(t)?Math.round(t):null}function Jt(e,n,t=null){return t==="sidebar"?n.sidebar!==null&&n.sidebar!==e.sidebar?{sidebar:n.sidebar}:{}:t==="rightbar"?n.rightbar!==null&&n.rightbar!==e.rightbar?{rightbar:n.rightbar}:{}:n.sidebar!==null&&n.sidebar!==e.sidebar?{sidebar:n.sidebar}:n.rightbar!==null&&n.rightbar!==e.rightbar?{rightbar:n.rightbar}:{}}function Xt(e,n){return{sidebar:n.sidebar??e.sidebar,rightbar:n.rightbar??e.rightbar}}function Zt(e){let n=[];return e.sidebar!==null&&n.push({column:"sidebar",width:e.sidebar}),e.rightbar!==null&&n.push({column:"rightbar",width:e.rightbar}),n}var pi="[data-shell-bottom]",gi="[data-side]",mi='[class*="_sidebarCol"]',hi='[class*="_rightbarCol"]',yi=600;function bi(e){let t=e?.layout?.panels;if(typeof t!="object"||t===null)return;let r=t;if(!(typeof r.setSidebar!="function"&&typeof r.setRightbar!="function"))return r}function nr(e,n){let t=bi(e);if(t===void 0)return!1;let r=!1;for(let{column:o,width:i}of Zt(n)){let a=o==="sidebar"?t.setSidebar:t.setRightbar;if(a!==void 0)try{a.call(t,i),r=!0}catch{}}return r}function Qt(e){return e.querySelector(pi)?.parentElement??null}function ki(e,n){let t=e.hasAttribute("data-sidebar-collapsed"),r=e.hasAttribute("data-rightbar-collapsed"),o=Yt(n?.getComputedStyle(e).gridTemplateColumns);return{sidebar:t?null:o.sidebar??er(e.querySelector(mi)),rightbar:r?null:o.rightbar??er(e.querySelector(hi))}}function er(e){if(e===null)return null;let n=e.getBoundingClientRect().width;return Number.isFinite(n)&&n>0?Math.round(n):null}function tr(e){let{document:n,storage:t}=e,r=null,o=null,i=0,a=!1,s=null,c=()=>n.defaultView,u=()=>(r!==null&&r.isConnected||(r=Qt(n)),r),l=()=>{let m=u();return m===null?null:ki(m,c())},d=m=>{let k=m?.getAttribute("data-side");return k==="sidebar"||k==="rightbar"?k:null},f=m=>{let k=l();if(k===null)return;let I=Jt(m.before,k,m.side);I.sidebar===void 0&&I.rightbar===void 0||Gt(t,Xt(_e(t),I))},p=m=>{if(s!==null)return;let k=m.target,I=typeof k?.closest=="function"?k.closest(gi):null;if(I===null)return;let A=l();A!==null&&(s={side:d(I),before:A})},y=()=>{let m=s;if(s=null,m===null)return;let k=c()?.requestAnimationFrame;if(k===void 0){f(m);return}k.call(c(),()=>f(m))},b=()=>{if(o=null,a)return;let m=Qt(n);if(m!==null){r=m;return}if(i>=yi)return;i+=1;let k=c()?.requestAnimationFrame;k!==void 0&&(o=k.call(c(),b))};return{attach(){a=!1,i=0;let m=c();return m?.addEventListener("pointerdown",p,!0),m?.addEventListener("pointerup",y,!0),m?.addEventListener("pointercancel",y,!0),b(),()=>{a=!0,s=null,r=null,m?.removeEventListener("pointerdown",p,!0),m?.removeEventListener("pointerup",y,!0),m?.removeEventListener("pointercancel",y,!0),o!==null&&m?.cancelAnimationFrame(o),o=null}}}}var rr="sessionCompaction";var or="dsh-better-compaction",Me="dshBetter_compactionStat",wi=`
.${Me} {
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

[data-composer-dock]:has([data-workbench-dock="term-dock"]) .${Me} {
  margin-left: 12px;
}
`;function ir(e){if(e===void 0)return()=>{};if(e.getElementById(or)!==null)return()=>{};let n=e.createElement("style");return n.id=or,n.textContent=wi,e.head.append(n),()=>{n.remove()}}var sr=require("react/jsx-runtime");function xi(e,n){if(e===void 0||n===void 0)return null;let{compactions:t,failures:r}=e;if(!Number.isSafeInteger(t)||t<=0)return null;let o=t===1?n("compaction.readingOne"):n("compaction.reading",{count:t}),i=Number.isSafeInteger(r)&&r>0?n("compaction.tooltipWithFailures",{count:t,failures:r}):n("compaction.tooltip",{count:t});return{text:o,tooltip:i}}function vi(){}function ar({useProjection:e,t:n}){let r=xi((e??vi)(rr),n);return r===null?null:(0,sr.jsx)("span",{className:Me,"data-dsh-better":"compaction-stat",title:r.tooltip,children:r.text})}var un="conversation.composer.dock",lr="better-compaction";var gn=require("react");var dr="continue",cn="conversation.chat.turnTail",ur="better-continue";var Si=new Set(["aborted","interrupted"]);function cr(e){let n=e.end?.reason?.kind;return n===void 0||!Si.has(n)?!1:e.latest&&!e.pending}var fr="dsh-better-continue",fe="dshBetter_continue",fn="dshBetter_continueError",Ci=`
.${fe} {
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

.${fe}:hover:not(:disabled) {
  background: var(--dsw-alias-interactive-bg-hover);
  color: var(--dsw-alias-label-primary);
  border-color: var(--dsw-alias-border-l1);
}

.${fe}:focus-visible {
  outline: 1px solid var(--dsw-alias-border-l1);
  outline-offset: 1px;
}

/* Disabled covers both halves of the pressed state: the request is in flight, so
   the button must not invite a second one, and the dimming is what says so. */
.${fe}:disabled {
  cursor: default;
  opacity: 0.6;
}

/* The failure line sits under the button in the same column. It is a sibling
   rather than a wrapper so the button keeps its own alignment. */
.${fn} {
  align-self: flex-end;
  color: var(--dsw-alias-state-business-primary);
  font-size: var(--dsh-content-font-size-secondary, 13px);
  line-height: calc(20px + var(--dsh-content-font-delta-secondary, 0px));
}
`;function pr(e){if(e===void 0)return()=>{};if(e.getElementById(fr)!==null)return()=>{};let n=e.createElement("style");return n.id=fr,n.textContent=Ci,e.head.append(n),()=>{n.remove()}}var oe=require("react/jsx-runtime");function Li(e){return e instanceof Error?e.message:String(e)}function Ei(e,n){return e.length>0&&e[e.length-1]===n}function pn(){}function gr({turn:e,sessionId:n,useChat:t,useSession:r,useInput:o,t:i,submitContinue:a}){let s=t??pn,c=r??pn,u=o??pn,l=s(P=>P),d=c(P=>P),f=u(P=>P),[p,y]=(0,gn.useState)(!1),[b,m]=(0,gn.useState)(null),k=e!==void 0&&Ei(l?.timeline.turnOrder??[],e.turn),I=(d?.pendingSubmissions?.length??0)>0||ne(f?.phase);return e===void 0||n===void 0||a===void 0||i===void 0||!cr({end:e.end?.data,latest:k,pending:I})?null:(0,oe.jsxs)(oe.Fragment,{children:[(0,oe.jsx)("button",{type:"button",className:fe,"data-testid":"better-continue",disabled:p,onClick:()=>{y(!0),m(null),a(n).catch(P=>{y(!1),m(Li(P))})},children:i(p?"continue.sending":"continue.label")}),b===null?null:(0,oe.jsx)("span",{className:fn,role:"alert",children:b})]})}var mr="dsh-better-settings-surface",Ti='[data-shortcut-modal="settings"]',Ri=`
${Ti} {
  background: var(--dsw-alias-bg-layer-2);
  background: rgb(from var(--dsw-alias-bg-layer-2) r g b / 1);
}
`;function hr(e){if(e===void 0)return()=>{};if(e.getElementById(mr)!==null)return()=>{};let n=e.createElement("style");return n.id=mr,n.textContent=Ri,e.head.append(n),()=>{n.remove()}}var mn="dsh-better-link-hover",G="dshBetter_linkHover",Fe="dshBetter_linkHoverAddress",pe="dshBetter_linkHoverCopy",yr=`
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
.${Fe} {
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
.${pe} {
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
.${pe}:hover {
  background: var(--dsw-alias-interactive-bg-hover);
  color: var(--dsw-alias-label-primary);
}
.${pe}:focus-visible {
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
`;function br(e){if(e===void 0)return()=>{};if(e.getElementById(mn)!==null)return()=>{};let n=e.createElement("style");return n.id=mn,n.textContent=yr,e.head.append(n),()=>{n.remove()}}var Ai=1200,Pi=300,kr=8,ie=8,Oi='[data-slot="conversation.chat.flow"], [data-message-bubble]';function Ii(e){let n=e.trim();if(n===""||n.startsWith("#"))return!1;let t=n.replace(/[\t\n\r]/gu,"").slice(0,11).toLowerCase();return!(t.startsWith("javascript:")||t.startsWith("data:"))}function Ni(e,n,t){let r=Math.max(ie,Math.min(e.left,t.width-ie-n.width)),o=e.bottom+kr,i=e.top-kr-n.height,a=t.height-ie*2,s;return n.height<=a&&o+n.height<=t.height-ie?s=o:n.height<=a&&i>=ie?s=i:s=Math.max(ie,Math.min(o,t.height-ie-n.height)),{left:r,top:s}}async function Di(e,n){let t=n.defaultView?.navigator.clipboard;if(t!==void 0)try{return await t.writeText(e),!0}catch{}return _i(e,n)}function _i(e,n){if(typeof n.execCommand!="function")return!1;let t=n.createElement("textarea");t.value=e,t.setAttribute("readonly",""),t.style.position="fixed",t.style.top="-1000px",t.style.opacity="0",n.body.append(t);try{return t.select(),n.execCommand("copy")}catch{return!1}finally{t.remove()}}function wr(e,n){let t=e.defaultView;if(t===null)return()=>{};if(t.matchMedia?.("(hover: none)")?.matches===!0)return()=>{};let r=br(e),o=null,i=null,a=null,s=null,c=null,u=null,l=()=>{u!==null&&(clearTimeout(u),u=null)},d=()=>{if(o!==null)return o;let v=e.createElement("div");v.className=G,v.setAttribute("role","tooltip"),v.hidden=!0;let S=e.createElement("span");S.className=Fe;let g=e.createElement("button");return g.className=pe,g.type="button",g.setAttribute("aria-label",n.translate("link.copyAria")),g.textContent=n.translate("link.copy"),g.addEventListener("click",O=>{O.preventDefault(),O.stopPropagation();let D=s?.href;D!==void 0&&Di(D,e).then(F=>{g.textContent=n.translate(F?"link.copied":"link.copyFailed"),c!==null&&clearTimeout(c),c=setTimeout(()=>{c=null,g.textContent=n.translate("link.copy")},Ai)})}),v.append(S,g),e.body.append(v),o=v,i=S,a=g,v},f=v=>{let S=d(),g=v.getBoundingClientRect(),O=S.getBoundingClientRect(),D=Ni({left:g.left,top:g.top,right:g.right,bottom:g.bottom},{width:O.width,height:O.height},{width:t.innerWidth,height:t.innerHeight});S.style.left=`${D.left}px`,S.style.top=`${D.top}px`},p=()=>{s=null,l(),c!==null&&(clearTimeout(c),c=null),a!==null&&(a.textContent=n.translate("link.copy")),o!==null&&(o.hidden=!0)},y=(v,S)=>{let g=d();s={anchor:v,href:S},i!==null&&(i.textContent=S),g.hidden=!1,f(v)},b=v=>{if(!(v instanceof t.Element))return;let S=v.closest("a");if(S===null||S.closest(Oi)===null)return;let g=S.getAttribute("href");if(g!==null&&Ii(g))return{anchor:S,href:g.trim()}},m=v=>o!==null&&v instanceof t.Node&&o.contains(v),k=v=>{if(m(v.target)){l();return}let S=b(v.target);S!==void 0&&(l(),y(S.anchor,S.href))},I=v=>{if(s===null)return;let S=v.relatedTarget;if(m(S)||S instanceof t.Node&&s.anchor.contains(S))return;let g=v.target;if(g instanceof t.Node){if(s.anchor.contains(g)){l(),u=setTimeout(()=>{u=null,p()},Pi);return}m(g)&&p()}},A=v=>{let S=b(v.target);S!==void 0&&y(S.anchor,S.href)},P=v=>{if(s===null)return;let S=v.relatedTarget;m(S)||S instanceof t.Node&&s.anchor.contains(S)||p()},N=v=>{v.key==="Escape"&&s!==null&&p()},$=v=>{m(v.target)||p()};return e.addEventListener("mouseover",k,!0),e.addEventListener("mouseout",I,!0),e.addEventListener("focusin",A,!0),e.addEventListener("focusout",P,!0),e.addEventListener("keydown",N,!0),e.addEventListener("scroll",$,!0),()=>{e.removeEventListener("mouseover",k,!0),e.removeEventListener("mouseout",I,!0),e.removeEventListener("focusin",A,!0),e.removeEventListener("focusout",P,!0),e.removeEventListener("keydown",N,!0),e.removeEventListener("scroll",$,!0),l(),c!==null&&(clearTimeout(c),c=null),o?.remove(),o=null,i=null,a=null,s=null,r()}}function Mi(e){return typeof e=="object"&&e!==null&&"ok"in e&&e.ok===!1}async function xr(e,n){let t=e.sessions?.binding?.(n)?.session,r=t?.prompt;if(typeof r!="function")throw new Error("\u8FD9\u4E2A\u5BBF\u4E3B\u7684\u4F1A\u8BDD\u4E0D\u652F\u6301\u53D1\u9001\u6D88\u606F");let o=await r.call(t,[{type:"text",text:dr}],"queue");if(Mi(o))throw new Error("\u7EE7\u7EED\u6D88\u606F\u6CA1\u6709\u88AB\u5BBF\u4E3B\u63A5\u53D7")}var we=require("react");function Fi(e){let n=e.name.trim();return n===""?e.id:n}function hn(e,n){if(e===void 0)return{model:n};let t=Fi(e.group),r=e.model.name.trim();return r===""?{model:t}:{provider:t,model:r}}function vr(e,n){let t=hn(e,n);return t.provider===void 0?t.model:`${t.provider} ${t.model}`}function Bi(e){return typeof e=="string"?e:e.en??""}function Be(e,n){if(e!==void 0)try{return e(n)}catch{}return Bi(n)}var B=require("react/jsx-runtime"),Hi="@deepseek-ai/dsh-client-ui-model-selection/ModelSelect.module.css";function Wi(e){if(e===void 0)return;let t=e.querySelector(`style[data-plugin-css="${Hi}"]`)?.textContent??"",r=a=>new RegExp(`\\.(\\w+_${a})\\{`,"u").exec(t)?.[1],o={root:r("root"),trigger:r("trigger"),triggerIcon:r("triggerIcon"),triggerLabel:r("triggerLabel"),triggerEffort:r("triggerEffort"),chevron:r("chevron")};for(let a of Object.values(o))if(a===void 0)return;let i=r("badge");return{...o,...i===void 0?{}:{badge:i}}}function Sr(e){let n=De(e.load),t=Wi(e.document);function r(o){let i=e.native();return o.available===!1||i===void 0||t===void 0?i===void 0?null:(0,B.jsx)(i,{...o}):(0,B.jsx)(zi,{props:o,primitives:n,openPicker:e.openPicker,translate:e.translate,classes:t})}return r}function zi({props:e,primitives:n,openPicker:t,translate:r,classes:o}){let{directory:i,t:a,sessionId:s,locked:c,resolveText:u}=e,l=$i(i),d=a??r(),f=l?.current??null,p=f===null&&l?.status==="loading",y=Ui(l,f),b=d?.("trigger.fallback")??"",m=vr(y,b),k=hn(y,b),I=Vi(y,u),A=p?d?.("trigger.loading")??"":m,P=qi(l,f,y,d),N=P===void 0?A:`${A} \xB7 ${P}`,$=p?d?.("trigger.loading")??"":f===null?d?.("trigger.selectAria")??"":P===void 0?d?.("trigger.aria",{model:A})??"":d?.("trigger.ariaEffort",{model:A,effort:P})??"",v=()=>{t(s)},S=n.IconDataOutlineRegular,g=n.IconChevronDownOutlineRegular,O=n.Tag,D=o.badge;return(0,B.jsx)("div",{className:o.root,"data-dsh-better-seat":"",children:(0,B.jsxs)("button",{type:"button",className:o.trigger,"aria-label":$,"aria-haspopup":"dialog","aria-expanded":"false",title:N,disabled:c,onClick:v,children:[S===void 0?null:(0,B.jsx)(S,{className:o.triggerIcon,size:16}),(0,B.jsx)("span",{className:o.triggerLabel,"data-provider-id":f?.provider,"data-model-id":f?.model,children:p?A:(0,B.jsxs)(B.Fragment,{children:[k.provider===void 0?null:`${k.provider} `,I===void 0||D===void 0||O===void 0?null:(0,B.jsxs)(B.Fragment,{children:[(0,B.jsx)(O,{className:D,tone:I.tone,children:I.text})," "]}),k.model]})}),P!==void 0&&(0,B.jsx)("span",{className:o.triggerEffort,children:P}),g===void 0?null:(0,B.jsx)(g,{className:o.chevron})]})})}function $i(e){let n=(0,we.useCallback)(r=>e===void 0?()=>{}:e.subscribe(r),[e]),t=(0,we.useCallback)(()=>e?.getSnapshot(),[e]);return(0,we.useSyncExternalStore)(n,t)}function Ui(e,n){if(!(e===void 0||n===null||n===void 0)){for(let t of e.groups)if(t.id===n.provider){for(let r of t.models)if(r.id===n.model)return{group:t,model:r}}}}function Vi(e,n){let t=e?.model.badge;if(t===void 0)return;let r=Be(n,t.text);if(r!=="")return{text:r,tone:t.tone}}function qi(e,n,t,r){if(e===void 0||n===null||n===void 0)return;let o=t?.model.reasoning,i=n.reasoningEffort??o?.defaultEffort;return t===void 0?e.retainedEffort:o===void 0||i===void 0?void 0:o.efforts?.find(s=>s.id===i)?.name??i}function Cr(e){let r=e?.live?.contributions?.get("model")?.ui;return r==null?void 0:r.kind==="popupSelect"?r:void 0}function Lr(e){return{sessionId:e}}function Er(){return{via:"enter",token:""}}var yn="conversation.view",bn="settings.section",Ar="tabs";var Z="chat",Pr="dsh-better.tabs",xe="[data-conversation-tabs]";function Or(e,n){if(typeof e=="string"&&e!=="")return e;if(typeof e=="function")try{let t=e();if(typeof t=="string"&&t!=="")return t}catch{}return n}function He(e){let n=[],t=new Set;for(let r of e)typeof r!="string"||r===""||r===Z||t.has(r)||(t.add(r),n.push(r));return n}function ji(e){if(e===void 0)return{hidden:new Set,order:[]};let n;try{n=e.getItem(Pr)}catch{return{hidden:new Set,order:[]}}if(n===null||n==="")return{hidden:new Set,order:[]};try{let t=JSON.parse(n);if(Array.isArray(t))return{hidden:new Set(He(t)),order:[]};if(t===null||typeof t!="object")return{hidden:new Set,order:[]};let r=t;return{hidden:new Set(He(Array.isArray(r.hidden)?r.hidden:[])),order:He(Array.isArray(r.order)?r.order:[])}}catch{return{hidden:new Set,order:[]}}}function Tr(e,n){if(e===void 0)return;let t={version:2,hidden:[...n.hidden].sort(),order:[...n.order]};try{e.setItem(Pr,JSON.stringify(t))}catch{}}function Ki(e,n){let t=[],r=new Set;for(let a of e){let s=a.options.id;s===void 0||s===Z||r.has(s)||(r.add(s),t.push(s))}let o=n.filter(a=>r.has(a)),i=t.filter(a=>!n.includes(a));return[...o,...i]}function Ir(e,n){let t=[],r=new Map;for(let o of e){let i=o.options.id;i===void 0||i===Z||r.has(i)||r.set(i,Or(o.options.label,i))}for(let o of Ki(e,n.order)){let i=r.get(o);i!==void 0&&t.push({id:o,label:i,enabled:!n.hidden.has(o)})}return t}function kn(e){let n=new Map,t=2;for(let r of e)r.enabled&&(n.set(r.id,t),t+=1);return n}function Gi(e){let n=[],t=new Set;for(let r of e){let o=r.options.id;o===void 0||o===Z||t.has(o)||(t.add(o),n.push({id:o,label:Or(r.options.label,o)}))}return n}function Yi(e,n,t){let r=new Set;for(let o of Gi(e)){if(!n.has(o.id)||o.label==="")continue;t.filter(a=>a.label===o.label).length===1&&r.add(o.label)}return t.map(o=>r.has(o.label))}function Ji(e,n,t){let r=Ir(e,n),o=kn(r),i=t[0]?.label,a=new Map;for(let s of t)a.set(s.label,(a.get(s.label)??0)+1);for(let s of r){if((a.get(s.label)??0)>1)return t.map(()=>null);if(i!==void 0&&s.label===i)return t.map(()=>null)}return t.map(s=>{let c=r.find(u=>u.label===s.label);return c===void 0?null:o.get(c.id)??null})}function Xi(e,n){let t=!1;for(let[r,o]of e.entries()){let i=n[r]===void 0||n[r]===null?"":String(n[r]);i!==o.order&&(o.setOrder(i),t=!0)}return t}function Zi(e,n){for(let t of e)if(n!==null&&(t.target===n||n.contains?.(t.target)===!0)||Rr(t.addedNodes,n)||Rr(t.removedNodes,n))return!0;return!1}function Rr(e,n){if(e===void 0)return!1;for(let t=0;t<e.length;t+=1){let r=e[t];if(r!==void 0&&(r.matches?.(xe)===!0||r.querySelector?.(xe)!=null||n!==null&&r.contains?.(n)===!0))return!0}return!1}function Qi(e){let n=e.querySelector(xe);if(n===null||typeof n!="object")return;let r=n.querySelectorAll?.(":scope > button[role='tab']");if(r===void 0)return;let o=[];for(let i=0;i<r.length;i+=1){let a=r[i];a!==void 0&&o.push({label:ea(a),hidden:a.hasAttribute(We),order:a.style?.order??"",mark:s=>{s?a.setAttribute(We,""):a.removeAttribute(We)},setOrder:s=>{a.style!==void 0&&(a.style.order=s)}})}return o}function ea(e){return(e.querySelector?.("[class*='tabLabel']")?.textContent??e.textContent??"").trim()}function na(e,n){let t=!1;for(let[r,o]of e.entries()){let i=n[r]??!1;i!==o.hidden&&(o.mark(i),t=!0)}return t}function Nr(e){let{ledger:n,storage:t}=e,r=e.readButtons??Qi,o=e.watch??oa,i=ji(t),a={hidden:new Set(i.hidden),order:[...i.order]},s=new Set,c,u=()=>{for(let d of[...s])d()},l=30;return{rows:()=>Ir(n.entriesOfSlot(yn),a),setEnabled(d,f){if(d===Z)return!1;let p=a.hidden.has(d);return f===!p?!1:(f?a.hidden.delete(d):a.hidden.add(d),Tr(t,a),c?.(),u(),!0)},setOrder(d){let f=He(d);return f.length===a.order.length&&f.every((y,b)=>a.order[b]===y)?!1:(a.order=f,Tr(t,a),c?.(),u(),!0)},subscribe(d){return s.add(d),()=>{s.delete(d)}},attach(d){let f=d.createElement("style");f.dataset.plugin="dsh-better",f.dataset.pluginCss=ta,f.textContent=ra,d.head.append(f);let p=d.defaultView?.requestAnimationFrame?.bind(d.defaultView),y=d.defaultView?.cancelAnimationFrame?.bind(d.defaultView),b=p===void 0?0:l,m,k=()=>{let P=n.entriesOfSlot(yn),N=r(d);if(N===void 0||N.length===0){b>0&&p!==void 0&&(b-=1,m=p(()=>k()));return}b=l,m=void 0,na(N,Yi(P,a.hidden,N)),Xi(N,Ji(P,a,N))},I=n.subscribe(yn,k),A=o(d,k);return c=k,k(),()=>{I(),A(),c=void 0,m!==void 0&&y?.(m),f.remove()}}}}var ta="dsh-better/strip.css",We="data-dsh-better-tab-hidden",ra=`${xe} > button[${We}] { display: none; }`;function oa(e,n){let t=e.defaultView?.MutationObserver,r=e.documentElement;if(t===void 0||r===void 0)return()=>{};let o=new t(i=>{let a=e.querySelector(xe);Zi(i,a!==null&&typeof a=="object"?a:null)&&n()});return o.observe(r,{childList:!0,subtree:!0}),()=>o.disconnect()}var ge="data-dsh-better-tabs-row",ia="data-dsh-better-tabs-fixed",aa="data-dsh-better-tabs-dragging",sa=`
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
`,Dr="dsh-better/tabs.css";function _r(e){let n=`style[data-plugin-css=${JSON.stringify(Dr)}]`;if(e.querySelector(n)!==null)return()=>{};let t=e.createElement("style");return t.dataset.plugin="dsh-better",t.dataset.pluginCss=Dr,t.textContent=sa,e.head.append(t),()=>t.remove()}function Mr(e){let n;return e.React.createElement("section",{"data-dsh-better-tabs":"",ref:t=>{if(n?.(),n=void 0,t===null)return;let r=()=>{Fr(t,e)};r(),n=e.controller.subscribe(r)}})}function Fr(e,n){let t=e.ownerDocument,{controller:r,copy:o}=n;e.replaceChildren();let i=t.createElement("h2");i.setAttribute("data-dsh-better-tabs-heading",""),i.textContent=o.heading,e.append(i),e.append(la(t,o.chatLabel));let a=r.rows(),s=kn(a),c=null,u=!1;for(let l of a)e.append(da(t,n,l,s.get(l.id),{dragStart:()=>{c=l.id,u=!1},dragOver:d=>{c!==null&&(d.preventDefault(),c!==l.id&&ua(e,c,l.id,ca(d,wn(e,l.id)))&&(u=!0))},drop:d=>{d.preventDefault()},dragEnd:()=>{c=null,u&&r.setOrder(fa(e)),Fr(e,n)}}));if(a.length===0){let l=t.createElement("p");l.setAttribute("data-dsh-better-tabs-empty",""),l.textContent=o.empty,e.append(l)}}function la(e,n){let t=e.createElement("div");return t.setAttribute(ge,Z),t.setAttribute(ia,""),t.append(Br(e,1,n)),t}function da(e,n,t,r,o){let i=e.createElement("label");i.setAttribute(ge,t.id),i.setAttribute("draggable","true"),i.append(Br(e,r,t.label));let a=e.createElement("input");return a.setAttribute("data-dsh-better-tabs-check",t.id),a.type="checkbox",a.checked=t.enabled,a.setAttribute("aria-label",n.copy.checkboxLabel(t.label,t.enabled)),a.addEventListener("change",()=>{n.controller.setEnabled(t.id,a.checked)}),i.append(a),i.addEventListener("dragstart",s=>{s.dataTransfer?.setData("text/plain",t.id),i.setAttribute(aa,""),o.dragStart()}),i.addEventListener("dragover",s=>o.dragOver(s)),i.addEventListener("drop",s=>o.drop(s)),i.addEventListener("dragend",()=>o.dragEnd()),i}function Br(e,n,t){let r=e.createElement("span");if(r.setAttribute("data-dsh-better-tabs-lead",""),n!==void 0){let i=e.createElement("span");i.setAttribute("data-dsh-better-tabs-pos",""),i.textContent=String(n),r.append(i)}let o=e.createElement("span");return o.setAttribute("data-dsh-better-tabs-name",""),o.textContent=t,r.append(o),r}function wn(e,n){for(let t of e.querySelectorAll(`[${ge}]`))if(t.getAttribute(ge)===n)return t;return null}function ua(e,n,t,r){let o=wn(e,n),i=wn(e,t);if(o===null||i===null)return!1;let a=o.parentElement;if(a===null)return!1;let s=r?i:i.nextSibling;return s===o?!1:(a.insertBefore(o,s),!0)}function ca(e,n){if(n===null||typeof e.clientY!="number")return!0;let t=n.getBoundingClientRect();return t==null?!0:e.clientY<t.top+t.height/2}function fa(e){let n=[];for(let t of e.querySelectorAll(`[${ge}]`)){if(t.getAttribute("draggable")!=="true")continue;let r=t.getAttribute(ge);r!==null&&r!==Z&&n.push(r)}return n}var ae="conversation.input.overlay",Hr="settings.section",ha="aliases",ya=56,ba="alias-watcher",$r=50,ka="skill-enhancer",wa=$r+1,xn="conversation.input.model",vn="conversation.input.attachments",xa=-50,va=-60,Ur="command-popup",Sa=-100,z="better",Ca="/better/api/skill-profile",La=5e3,ze=null;function Vr(e,n){let t,r=Number.POSITIVE_INFINITY;for(let o of e){if(o.options.id!==Ur)continue;let i=o.component;if(typeof i!="function"||n!==void 0&&i===n)continue;let a=o.options.priority??0;a<r&&(t=i,r=a)}return t}var qr={name:"dsh-better",inject:["slots","sessions","commandUi","conversation","locale","modelDirectories","remote","remote.session"],apply(e){let n=globalThis.document;e.effect(()=>e.locale.register(z,zt),"dsh-better: locale"),e.effect(()=>Ut(n),"dsh-better: effort badge stylesheet"),e.effect(()=>ir(n),"dsh-better: compaction count stylesheet"),e.effect(()=>pr(n),"dsh-better: continue button stylesheet"),e.effect(()=>n===void 0?()=>{}:wr(n,{translate:zr(e)}),"dsh-better: link address panel"),e.effect(()=>hr(n),"dsh-better: settings panel surface");let t=On(Cn()),r=zr(e),o={open:!1};e.effect(()=>{let u=Cn(),l=_e(u);e.inject?.(["layout"],p=>{nr(p,l)});let f=(n===void 0?void 0:tr({document:n,storage:u}))?.attach();return()=>{f?.()}},"dsh-better: panel width memory"),e.effect(()=>e.slots.inject(un,()=>e.slots.register({name:un,id:lr,order:-1,locale:z},ar)),"dsh-better: compaction count"),e.effect(()=>e.slots.inject(cn,()=>Sn(e.slots,{name:cn,id:ur,order:20,locale:z,inject:u=>({submitContinue:l=>xr(e,l)})},gr)),"dsh-better: continue button"),e.effect(()=>e.slots.inject(ae,()=>{let u={},d=Rt({load:ze,native:()=>Vr(e.slots.entries(ae),u.component),document:n});return u.component=d,e.slots.register({name:ae,id:Ur,priority:Sa,locale:z,inject:f=>{let p=Oa(e,f);return{popup:Pa(e,f),catalog:p?.groups,current:p?.current??null,selectModel:y=>e.modelDirectories?.directoryFor?.(f)?.select?.(y)}}},d)}),"dsh-better: /model provider search"),e.effect(()=>e.slots.inject(xn,()=>{let u={},d=Sr({load:ze,native:()=>Ln(e.slots.entries(xn),u.component),openPicker:f=>Ra(e,f),translate:()=>Aa(e),document:n});return u.component=d,e.slots.register({name:xn,priority:xa,locale:z,inject:f=>{let p=e.modelDirectories?.directoryFor?.(f),y=e.locale.resolveText;return{sessionId:f,available:!0,directory:p?.store,load:()=>{p?.load?.()},select:b=>p?.select?.(b),resolveText:b=>Be(y?.bind(e.locale),b),renderSlot:(b,m,k)=>k?.fallback??null}}},d)}),"dsh-better: composer model trigger");let i;e.inject?.(["remote.workspaceFiles"],u=>{i=u["remote.workspaceFiles"],u.effect(()=>()=>{i=void 0},"dsh-better: workspace file reader")}),e.effect(()=>e.slots.inject(vn,()=>{let u={},d=_t({native:()=>Ln(e.slots.entries(vn),u.component),pathOf:Ia,reader:()=>i,translate:()=>e.locale.bind?.(z)});return u.component=d,e.slots.register({name:vn,priority:va,locale:z,inject:f=>({sessionId:f,readFileDrag:Ea(e),phase:()=>Ta(e,f)?.getSnapshot().phase})},d)}),"dsh-better: composer attachment selection");let a;e.inject?.(["inputTriggers"],u=>{a=u.inputTriggers,u.effect(()=>()=>{a=void 0},"dsh-better: alias trigger service"),u.effect(()=>u.inputTriggers.registerSource(zn({config:()=>t.getSnapshot(),translate:r,bareMenuOpen:()=>o.open,routeCommand:(l,d)=>Ma(e,d)})),"dsh-better: alias slash source")}),e.effect(()=>e.slots.inject(ae,()=>{let u=jn({store:t,bareMenuOpen:o,inputStoreFor:l=>{let d=e.sessions.scope?.(l);if(!(d===void 0||e.conversation===void 0))try{return e.conversation.input?.for?.(d)?.state}catch{return}},controllerFor:l=>{let d=e.sessions.scope?.(l);if(d===void 0)return;let f=ve(e,"inputTriggers")??a;if(f!==void 0)try{return f.sessionOf(d)}catch{return}}});return Sn(e.slots,{name:ae,id:ba,order:$r,inject:l=>({sessionId:l})},u)}),"dsh-better: alias selector watcher"),e.effect(()=>gt(n),"dsh-better: skill enhancer stylesheet");let s=Na(e);e.effect(()=>e.slots.inject(ae,()=>{let u=ft({scopeFor:l=>e.sessions.scope?.(l),inputStoreFor:l=>{let d=e.sessions.scope?.(l);if(!(d===void 0||e.conversation===void 0))try{return e.conversation.input?.for?.(d)?.state}catch{return}},actionsFor:l=>{let d=e.sessions.scope?.(l);if(!(d===void 0||e.conversation===void 0))try{return e.conversation.input?.for?.(d)}catch{return}},skillNamesFor:s.names,loadProfile:async(l,d)=>Da(e,l,d,await s.pathOf(l,d)),loadUsage:(l,d)=>jr(e,l,d),translate:r,document:n});return Sn(e.slots,{name:ae,id:ka,order:wa,inject:l=>({sessionId:l})},u)}),"dsh-better: skill enhancer"),e.effect(()=>e.slots.inject(Hr,()=>{let u=n===void 0?void 0:Un(n),l=Wn({store:t,translate:r}),d=Wr(e.slots,{name:Hr,id:ha,order:ya,label:()=>e.locale.bind?.(z)?.("alias.nav")??"Skill aliases",locale:z},l);return()=>{d(),u?.()}}),"dsh-better: alias settings page");let c=Nr({ledger:_a(e.slots),storage:Cn()});e.effect(()=>e.slots.inject(bn,()=>{let u=globalThis.document,l=u===void 0?void 0:_r(u),d=Wr(e.slots,{name:bn,id:Ar,order:55,label:()=>e.locale.bind?.(z)?.("tabs.nav")??"Tabs"},()=>{let f=Fa(ze);return f===null?null:Mr({React:f,controller:c,copy:Ba(e)})});return()=>{d(),l?.()}}),"dsh-better: tab management"),e.effect(()=>c.attach(n),"dsh-better: tab visibility"),e.inject?.(["shortcuts"],u=>{u.effect(()=>Wt(u.shortcuts,{currentSessionId:()=>Bt(e),composerMounted:()=>Ft(n),focusComposer:l=>Ht(e,l)},()=>e.locale.bind?.(z)?.(ke)??"Focus message input",l=>console.warn(`dsh-better: focus command not registered (${l})`)),"dsh-better: focus composer shortcut")})}};function Ea(e){return n=>ve(e,"fileDrag")?.read?.(n)}function Ta(e,n){if(n===void 0)return;let t=e.sessions.scope?.(n);if(!(t===void 0||e.conversation===void 0))try{return e.conversation.input?.for?.(t)?.state}catch{return}}function Ln(e,n){let t,r=Number.POSITIVE_INFINITY;for(let o of e){let i=o.component;if(typeof i!="function"||n!==void 0&&i===n)continue;let a=o.options.priority??0;a<r&&(t=i,r=a)}return t}function Ra(e,n){if(n===void 0)return!1;let t=Cr(e.commandUi);if(t===void 0)return!1;let r=e.sessions.scope?.(n);if(r===void 0)return!1;let o=e.commandUi.popupFor?.(r);return o===void 0||typeof o.open!="function"?!1:(o.open("model",t,Lr(n),Er()),!0)}function Aa(e){return e.locale?.bind?.(z)}function Pa(e,n){let t=e.sessions.scope?.(n);if(t!==void 0)return e.commandUi.popupFor?.(t)}function Oa(e,n){return e.modelDirectories?.directoryFor?.(n)?.store.getSnapshot()}function Ia(e){let n=globalThis.__DSH_HOST_PATHS__;if(n?.pathFor===void 0)return"";try{let t=n.pathFor(e);return typeof t=="string"?t:""}catch{return""}}function Wr(e,n,t){return(e.registerUntyped??e.register).call(e,n,t)}function Sn(e,n,t){return(e.registerUntyped??e.register).call(e,n,t)}function Na(e){let n=new Map,t=new Map,r=async o=>{let i=n.get(o);if(i!==void 0)return i;let a=t.get(o);if(a!==void 0&&Date.now()-a<La)return;let s=ve(e,"remote.skills");if(s!==void 0)try{let c=await s.list({sessionId:o});if(!c.ok){t.set(o,Date.now());return}let u=new Map(c.value.skills.map(l=>[l.name,l]));return n.set(o,u),t.delete(o),u}catch{t.set(o,Date.now());return}};return{names:async o=>new Set((await r(o))?.keys()??[]),pathOf:async(o,i)=>(await r(o))?.get(i)?.path}}async function Da(e,n,t,r){let o=`?sessionId=${encodeURIComponent(n)}&name=${encodeURIComponent(t)}`+(r===void 0?"":`&path=${encodeURIComponent(r)}`);try{let i=await fetch(`${Ca}${o}`,{headers:{accept:"application/json"}});return i.ok?await i.json():void 0}catch{return}}function jr(e,n,t){let r=e.sessions.list??ve(e,"sessions.list");try{let o=r?.getSnapshot?.(),i=d=>{let p=o?.projectionsBySession?.[d]?.values?.skillUsage;if(typeof p!="object"||p===null)return;let y=p.counts;return typeof y=="object"&&y!==null?y:void 0},a=i(n)?.[t],s=typeof a=="number"&&Number.isFinite(a)?a:0,c=o?.byId?.[n]?.cwd;if(typeof c!="string"||c==="")return{session:s};let u=Object.keys(o?.byId??{}).map(d=>{let f=i(d),p=o?.byId?.[d]?.cwd;return{...typeof p=="string"?{cwd:p}:{},...f===void 0?{}:{usage:f}}}),l=mt(u,c,t);return l===void 0?{session:s}:{session:s,workspace:l}}catch{return{session:0}}}function _a(e){return{entriesOfSlot:n=>(e.entriesOfSlot??e.entries).call(e,n),subscribe:(n,t)=>e.subscribe?.(n,t)??(()=>{})}}function Cn(){try{return globalThis.localStorage}catch{return}}function ve(e,n){try{return typeof e.get=="function"?e.get(n):e[n]}catch{return}}function Ma(e,n){let t=n.session?.sessionId;if(t===void 0)return;let r=e.sessions.scope?.(t);if(r===void 0)return;let o=ve(e,"inputTriggers");if(o!==void 0)try{let i=o.sessionOf(r),a=e.conversation?.input?.for?.(r)?.state,s=0,c=()=>{let u=a?.getSnapshot();if(!(u===void 0||u.draft.trim()===""||!u.draft.startsWith("/"))){try{let l=u.draft.trimStart().split(/\s/u)[0]??"";if(!l.startsWith("/")||(i.track?.(l,l.length,{tier:"plain"},u.draftRev),i.onSpace?.()===!0))return;i.dismiss?.()}catch{}s+=1,s<4&&setTimeout(c,25)}};setTimeout(c,0)}catch{}}function zr(e){return(n,t)=>{try{return e.locale.bind?.(z)?.(n,t)??n}catch{return n}}}function Fa(e){if(e===null)return null;try{let n=e("react");if(typeof n!="object"||n===null)return null;let t=n;return typeof t.createElement=="function"?t:null}catch{return null}}function Ba(e){let n=e.locale.bind?.(z),t=(r,o)=>n?.(r)??o;return{heading:t("tabs.heading","Tabs"),chatLabel:t("tabs.chat","Chat"),empty:t("tabs.empty","No plugin has registered a conversation tab yet."),checkboxLabel:(r,o)=>t(o?"tabs.hide":"tabs.show","{label}").replace("{label}",r)}}function Ha(e){ze=e}var Wa=qr;

    // Hand the loader's `require` to the module's `boot` export before the
    // plugin mounts. Read from `module.exports` rather than the default export:
    // esbuild emits named exports there and the plugin object separately, so the
    // default export alone never carries `boot`.
    if (typeof module.exports.boot === "function") module.exports.boot(require);
    return module.exports.default ?? module.exports;
  }
});
