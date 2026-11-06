window.__ModuleLoader__.load({
  id: "dsh-better",
  factory: (require) => {
    var module = { exports: {} };
    var exports = module.exports;
"use strict";var ye=Object.defineProperty;var zt=Object.getOwnPropertyDescriptor;var Ht=Object.getOwnPropertyNames;var Ut=Object.prototype.hasOwnProperty;var $t=(e,n)=>{for(var t in n)ye(e,t,{get:n[t],enumerable:!0})},jt=(e,n,t,r)=>{if(n&&typeof n=="object"||typeof n=="function")for(let o of Ht(n))!Ut.call(e,o)&&o!==t&&ye(e,o,{get:()=>n[o],enumerable:!(r=zt(n,o))||r.enumerable});return e};var qt=e=>jt(ye({},"__esModule",{value:!0}),e);var pi={};$t(pi,{boot:()=>ui,clientPlugin:()=>Ft,default:()=>ci,findShadowed:()=>_t,findShadowedSingle:()=>He,readSkillUsage:()=>Bt});module.exports=qt(pi);var ie=require("react");var Ue="dsh-better.skill-aliases";var Y=Object.freeze({prefix:!0,rows:Object.freeze([])});function Vt(e,n){if(e!==void 0)try{e.setItem(Ue,JSON.stringify({v:1,prefix:n.prefix,rows:n.rows}))}catch{}}function oe(e,n){return typeof e=="string"?e:n}function Gt(e,n){if(typeof e!="object"||e===null||Array.isArray(e))return;let t=e;if(!(typeof t.keyword!="string"&&typeof t.target!="string"&&typeof t.params!="string"))return{id:oe(t.id,`alias-${n}`)||`alias-${n}`,keyword:oe(t.keyword,""),target:oe(t.target,""),params:oe(t.params,"")}}function Kt(e){if(typeof e!="object"||e===null||Array.isArray(e))return Y;let n=e,t=typeof n.prefix=="boolean"?n.prefix:Y.prefix,r=Array.isArray(n.rows)?n.rows:[],o=[],i=new Set;for(let[s,d]of r.slice(0,200).entries()){let c=Gt(d,s);if(c===void 0)continue;let l=c.id,a=0;for(;i.has(l);)a+=1,l=`alias-${s}-${a}`;i.add(l),o.push({...c,id:l})}return{prefix:t,rows:o}}function Yt(e){if(e===void 0)return Y;let n;try{n=e.getItem(Ue)}catch{return Y}if(n===null||n==="")return Y;try{return Kt(JSON.parse(n))}catch{return Y}}function Jt(){let e=globalThis.crypto;return e?.randomUUID!==void 0?e.randomUUID():`alias-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,8)}`}function $e(e,n=Jt){let t=Yt(e),r=new Set,o=i=>{t=i;for(let s of[...r])try{s()}catch(d){console.error("[dsh-better] alias store listener failed:",d)}Vt(e,i)};return{getSnapshot:()=>t,subscribe(i){return r.add(i),()=>{r.delete(i)}},setPrefix(i){t.prefix!==i&&o({...t,prefix:i})},addRow(){let i=n();return o({...t,rows:[...t.rows,{id:i,keyword:"",target:"",params:""}]}),i},updateRow(i,s){let d=!1,c=t.rows.map(l=>{if(l.id!==i)return l;let a={...l,...s,id:l.id};return d=a.keyword!==l.keyword||a.target!==l.target||a.params!==l.params,a});d&&o({...t,rows:c})},removeRow(i){let s=t.rows.filter(d=>d.id!==i);s.length!==t.rows.length&&o({...t,rows:s})}}}function je(e){return e.keyword.trim()!==""&&e.target.trim()!==""}function qe(e){return e.keyword.trim().replace(/^\/+/,"").toLowerCase()}function Ve(e,n){let t=n.trim().replace(/^\/+/,"").toLowerCase();return t===""?[]:e.rows.filter(r=>je(r)&&qe(r)===t)}function Ge(e,n,t=!1){let r=n.trim().replace(/^\/+/,"").toLowerCase(),o=e.rows.filter(je);if(r==="")return t?o:[];let i=[],s=[],d=[];for(let c of o){let l=qe(c);l===r?i.push(c):l.startsWith(r)?s.push(c):l.includes(r)&&d.push(c)}return[...i,...s,...d]}function Ke(e){let n=e.target.trim().replace(/^\/+/,"");if(n==="")return"";let t=e.params.trim();return t===""?`/${n} `:`/${n} ${t} `}function Ye(e,n){let t=/^\/([^\s/]+)([ \t]*)$/u.exec(n);if(t===null)return;let r=t[1]??"",o=Ve(e,r);if(o.length!==0)return{query:r,start:0,end:n.length,rows:o}}function Je(e,n){let t=/^([^\s/]+)([ \t]*)$/u.exec(n);if(t===null)return;let r=t[1]??"",o=Ve(e,r);if(o.length!==0)return{query:r,start:0,end:n.length,rows:o}}function Xe(e){if(e.keyword.trim()==="")return"keyword";if(e.target.trim()==="")return"target";if(/\s/.test(e.keyword.trim()))return"keyword"}var w=require("react/jsx-runtime");function Xt(e){let{row:n,store:t,t:r}=e,o=Xe(n);return(0,w.jsxs)("tr",{"data-testid":"alias-row","data-row-id":n.id,"data-incomplete":o===void 0?void 0:"",children:[(0,w.jsx)("td",{children:(0,w.jsx)("input",{className:"dsh-better-alias-input","data-testid":"alias-keyword",value:n.keyword,placeholder:"wf",spellCheck:!1,autoComplete:"off","aria-label":r("alias.table.keyword"),ref:i=>{i!==null&&e.focus&&(i.focus(),e.clearFocus())},onChange:i=>t.updateRow(n.id,{keyword:i.target.value})})}),(0,w.jsx)("td",{children:(0,w.jsx)("input",{className:"dsh-better-alias-input","data-testid":"alias-target",value:n.target,placeholder:"flow-workflow",spellCheck:!1,autoComplete:"off","aria-label":r("alias.table.target"),onChange:i=>t.updateRow(n.id,{target:i.target.value})})}),(0,w.jsx)("td",{children:(0,w.jsx)("input",{className:"dsh-better-alias-input","data-testid":"alias-params",value:n.params,placeholder:r("alias.table.paramsPlaceholder"),spellCheck:!1,autoComplete:"off","aria-label":r("alias.table.params"),onChange:i=>t.updateRow(n.id,{params:i.target.value})})}),(0,w.jsx)("td",{className:"dsh-better-alias-actions",children:(0,w.jsx)("button",{type:"button",className:"dsh-better-alias-delete","data-testid":"alias-remove","aria-label":r("alias.remove",{keyword:n.keyword.trim()||r("alias.unnamed")}),title:r("alias.remove",{keyword:n.keyword.trim()||r("alias.unnamed")}),onClick:()=>t.removeRow(n.id),children:"\xD7"})})]})}function Ze(e){function n(){let t=(0,ie.useSyncExternalStore)(e.store.subscribe,e.store.getSnapshot,e.store.getSnapshot),{translate:r}=e,o=(0,ie.useRef)(null),i=()=>{o.current=e.store.addRow()};return(0,w.jsxs)("section",{className:"dsh-better-alias-page","data-testid":"alias-page",children:[(0,w.jsx)("h2",{className:"dsh-better-alias-heading",children:r("alias.heading")}),(0,w.jsxs)("label",{className:"dsh-better-alias-prefix",children:[(0,w.jsxs)("span",{children:[(0,w.jsx)("span",{className:"dsh-better-alias-prefix-title",children:r("alias.prefix.title")}),(0,w.jsx)("span",{className:"dsh-better-alias-prefix-hint",children:r(t.prefix?"alias.prefix.on":"alias.prefix.off")})]}),(0,w.jsx)("input",{type:"checkbox","data-testid":"alias-prefix",checked:t.prefix,"aria-label":r("alias.prefix.title"),onChange:s=>e.store.setPrefix(s.target.checked)})]}),(0,w.jsxs)("div",{className:"dsh-better-alias-table-wrap",children:[(0,w.jsxs)("table",{className:"dsh-better-alias-table",children:[(0,w.jsx)("thead",{children:(0,w.jsxs)("tr",{children:[(0,w.jsx)("th",{scope:"col",children:r("alias.table.keyword")}),(0,w.jsx)("th",{scope:"col",children:r("alias.table.target")}),(0,w.jsx)("th",{scope:"col",children:r("alias.table.params")}),(0,w.jsx)("th",{scope:"col","aria-label":r("alias.table.actions")})]})}),(0,w.jsx)("tbody",{children:t.rows.map(s=>(0,w.jsx)(Xt,{row:s,store:e.store,t:r,focus:o.current===s.id,clearFocus:()=>{o.current=null}},s.id))})]}),t.rows.length===0?(0,w.jsx)("p",{className:"dsh-better-alias-empty","data-testid":"alias-empty",children:r("alias.empty")}):null]}),(0,w.jsx)("button",{type:"button",className:"dsh-better-alias-add","data-testid":"alias-add",onClick:i,children:r("alias.add")}),(0,w.jsx)("p",{className:"dsh-better-alias-footnote",children:r("alias.footnote")})]})}return n}var he="alias",Zt="/",Qt=-1;function er(e,n){let t=e.target.trim().replace(/^\/+/,""),r=e.keyword.trim(),o=e.params.trim();return{name:t,label:r,...o===""?{}:{description:n("alias.menu.params",{value:o})},section:n("alias.menu.section"),value:e.id}}function Qe(e){return{trigger:Zt,name:he,order:Qt,async candidates(n,t){if(t.position!=="leading")return[];let r=e.config();return!r.prefix&&e.bareMenuOpen?.()!==!0?[]:Ge(r,t.query,!0).map(o=>er(o,e.translate))},onPick(n){let t=e.config().rows.find(i=>i.id===n.candidate.value);if(t===void 0)return;let r=t.target.trim().replace(/^\/+/,"");r!==""&&e.routeCommand?.(r,n);let o=Ke(t);return o===""?void 0:{text:o}}}}var en="dsh-better/aliases.css",nr=`
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
`;function nn(e){let n=`style[data-plugin-css=${JSON.stringify(en)}]`;if(e.querySelector(n)!==null)return()=>{};let t=e.createElement("style");return t.dataset.plugin="dsh-better",t.dataset.pluginCss=en,t.textContent=nr,e.head.append(t),()=>t.remove()}var q=require("react");var tn={draft:"",draftRev:-1,phase:"plain"};function on(e){return function(t){let r=(0,q.useSyncExternalStore)(e.store.subscribe,e.store.getSnapshot,e.store.getSnapshot),o=t.sessionId===void 0?void 0:e.inputStoreFor(t.sessionId),i=t.sessionId===void 0?void 0:e.controllerFor(t.sessionId),s=(0,q.useSyncExternalStore)(c=>o===void 0?()=>{}:o.subscribe(c),()=>o===void 0?tn:o.getSnapshot(),()=>o===void 0?tn:o.getSnapshot()),d=(0,q.useRef)(null);return(0,q.useEffect)(()=>{let c=t.sessionId;if(c===void 0||s.phase!=="plain"||i===void 0)return;let l=i.menu.getSnapshot().open;if(l&&d.current===null)return;let a=be(r,s.draft);if(l){let p=d.current;if(p!==null&&(p.draftRev!==s.draftRev||p.spanEnd!==(a?.end??-1))){let f=setTimeout(()=>{let m=o?.getSnapshot()??s,y=e.controllerFor(c);if(y===void 0||m.phase!=="plain")return;d.current=null,y.dismiss();let g=be(e.store.getSnapshot(),m.draft);g!==void 0&&(e.bareMenuOpen.open=!0,rn(y,g,m.draftRev),e.bareMenuOpen.open=!1,d.current={draftRev:m.draftRev,spanEnd:g.end})},80);return()=>clearTimeout(f)}return}if(d.current=null,a===void 0)return;let u=setTimeout(()=>{let p=o?.getSnapshot()??s,f=e.controllerFor(c);if(f===void 0||p.phase!=="plain"||f.menu.getSnapshot().open)return;let m=be(e.store.getSnapshot(),p.draft);m!==void 0&&(e.bareMenuOpen.open=!0,rn(f,m,p.draftRev),e.bareMenuOpen.open=!1,d.current={draftRev:p.draftRev,spanEnd:m.end})},80);return()=>clearTimeout(u)},[r,s.draft,s.draftRev,s.phase,i,o,t.sessionId]),null}}function be(e,n){return e.prefix?Ye(e,n):Je(e,n)}function rn(e,n,t){e.toggleSource(he,{trigger:"/",query:n.query,quoted:!1,position:"leading",span:{start:n.start,end:n.end,draftRev:t}})}function J(e){return e!==void 0&&e!=="plain"}var A=require("react");var tr="[a-z0-9]+(?:-[a-z0-9]+)*",rr=new RegExp(`^/(${tr})(?=\\s|$)`,"u");function an(e,n){let t=rr.exec(e);if(t===null)return;let r=t[1]??"";if(n(r))return{name:r,start:0,end:1+r.length}}function sn(e,n,t){return e===void 0||!Number.isInteger(t)||t<e.end||t>n.length||t!==n.length?!1:/^[ \t]*$/u.test(n.slice(e.end,t))}var or=/^\/([a-z0-9]+(?:-[a-z0-9]+)*)[ \t]*$/u,ir=400,dn=200,ln=6,ar=240,un={draft:"",draftRev:-1,phase:"plain"};function sr(e,n){return`${e!==""&&!/\s$/u.test(e)?" ":""}${n} `}function fn(e){return e===void 0?void 0:or.exec(e)?.[1]}function dr(e){return e===void 0?[]:e.split(`
`).map(n=>n.trim()).filter(n=>n!=="")}var Se=240,we=640;function lr(e){return!Number.isFinite(e)||e<=0?we:Math.max(Se,Math.min(we,e-24))}function ur(e,n){let t=lr(n),r=Number.isFinite(e)&&e>0?e:0,o=r===0?Se:r<=80?320:r<200?480:we;return Math.min(Math.max(o,Se),t)}function cr(e,n,t,r){if(!Number.isFinite(t)||t<=0)return e;let o=t-n-r;return Math.max(r,Math.min(e,Math.max(r,o)))}function pr(e,n,t){if(t<=0||typeof e.createRange!="function")return;let r=e.createRange(),o=t,i=!1,s=c=>{for(let l of Array.from(c.childNodes)){if(l.nodeType===3){let a=l.textContent??"",u=Math.min(o,a.length);if(u<=0)continue;if(i||(r.setStart(l,0),i=!0),r.setEnd(l,u),o-=u,o<=0)return!0;continue}if(s(l))return!0}return!1};if(!s(n)||o>0)return;let d=r.getBoundingClientRect();if(!(d.width===0&&d.height===0))return{left:d.left,right:d.right,top:d.top,bottom:d.bottom}}function cn(e,n){let t=e.querySelectorAll("[data-composer-text-ref]");for(let r of t){if(fn(r.textContent??"")!==n)continue;let o=pr(e,r,n.length+1);if(o!==void 0)return o;let i=r.getBoundingClientRect();return{left:i.left,right:i.right,top:i.top,bottom:i.bottom}}}function gn(e){return e.defaultView?.innerWidth??0}function fr(e,n,t,r){let o=e.top-r,i=Number.isFinite(t)&&t>0?t:0;return i===0||i<=o?{left:e.left,top:0,anchor:"above"}:{left:e.left,top:e.bottom+r,anchor:"below"}}function pn(e){return e.defaultView?.innerHeight??0}function mn(e){return function(t){let r=e.document??globalThis.document,o=t.sessionId,i=o===void 0?void 0:e.inputStoreFor(o),s=t.useInput,d=s===void 0?void 0:s(b=>b.draft),c=s===void 0?void 0:s(b=>b.phase),l=(0,A.useSyncExternalStore)(b=>i===void 0?()=>{}:i.subscribe(b),()=>i===void 0?un:i.getSnapshot(),()=>i===void 0?un:i.getSnapshot()),a=d??l.draft,u=c??l.phase,[p,f]=(0,A.useState)(()=>new Set),[m,y]=(0,A.useState)(void 0),[g,S]=(0,A.useState)(void 0),[L,E]=(0,A.useState)(void 0),[C,W]=(0,A.useState)(void 0);(0,A.useEffect)(()=>{if(o===void 0)return;let b=!0;return e.skillNamesFor(o).then(T=>{b&&f(T)},()=>{b&&f(new Set)}),()=>{b=!1}},[o]);let z=an(a,b=>p.has(b)),D=sn(z,a,a.length)&&!J(u)?z?.name:void 0,H=D??g;(0,A.useEffect)(()=>{if(o===void 0||H===void 0){y(void 0);return}let b=!0;return e.loadProfile(o,H).then(T=>{b&&y(T)},()=>{b&&y(void 0)}),()=>{b=!1}},[o,H]),(0,A.useEffect)(()=>{if(r===void 0||D===void 0){E(void 0);return}let b=()=>E(cn(r,D));b();let T=r.defaultView;return T?.addEventListener("resize",b),()=>T?.removeEventListener("resize",b)},[r,D,a]);let k=(0,A.useRef)(null),v=(0,A.useRef)(null),P=()=>{k.current!==null&&clearTimeout(k.current),k.current=null},O=()=>{v.current!==null&&clearTimeout(v.current),v.current=null};(0,A.useEffect)(()=>{if(r===void 0||o===void 0)return;let b=K=>{let j=K.target;if(!(j instanceof r.defaultView.Element))return;let h=j.closest("[data-composer-text-ref]");if(h===null)return;let R=fn(h.textContent??"");R!==void 0&&(O(),P(),k.current=setTimeout(()=>{k.current=null,S(R),E(cn(r,R)),W(e.loadUsage(o,R))},ir))},T=K=>{let j=K.target;j instanceof r.defaultView.Element&&j.closest("[data-composer-text-ref]")!==null&&(P(),O(),v.current=setTimeout(()=>{v.current=null,S(void 0)},dn))};return r.addEventListener("pointerover",b,!0),r.addEventListener("pointerout",T,!0),()=>{P(),O(),r.removeEventListener("pointerover",b,!0),r.removeEventListener("pointerout",T,!0)}},[r,o]),(0,A.useEffect)(()=>{if(r===void 0||g===void 0)return;let b=T=>{T.key==="Escape"&&S(void 0)};return r.addEventListener("keydown",b),()=>r.removeEventListener("keydown",b)},[r,g]);let _=(0,A.useRef)(a);_.current=a;let U=(0,A.useRef)(void 0);return U.current=t.inputActions??(o===void 0?void 0:e.actionsFor(o)),(0,A.useEffect)(()=>{if(r===void 0||D===void 0||L===void 0)return;let b=dr(m?.argumentHint);if(b.length===0)return;let T=gr(r,L,b);return r.body.append(T),()=>T.remove()},[r,D,L,m]),(0,A.useEffect)(()=>{if(r===void 0||g===void 0)return;let b=mr(r,e,{name:g,profile:m,usage:C,box:L,sessionId:o,getActions:()=>U.current,getDraft:()=>_.current,onEnter:O,onLeave:()=>{P(),O(),v.current=setTimeout(()=>{v.current=null,S(void 0)},dn)}});return r.body.append(b),()=>b.remove()},[r,g,m,C,L,o]),null}}function gr(e,n,t){let r=e.createElement("div");r.className="dsh-better-skill-hint",r.textContent=t.join(`
`);let o=n.right+ln>gn(e)-ar;return r.style.left=`${o?n.left:n.right+ln}px`,r.style.top=`${o?n.bottom+2:n.top}px`,r}function mr(e,n,t){let r=e.createElement("div");r.className="dsh-better-skill-panel",r.addEventListener("pointerenter",t.onEnter),r.addEventListener("pointerleave",t.onLeave);let o=e.createElement("div");o.className="dsh-better-skill-panel-title",o.textContent=`/${t.name}`,r.append(o);let i=t.profile?.description;if(i!==void 0&&i!==""){let a=e.createElement("div");a.className="dsh-better-skill-panel-desc",a.textContent=i,a.title=i,r.append(a)}let s=t.profile?.metadata??{},d=Object.keys(s);if(d.length>0){let a=e.createElement("div");a.className="dsh-better-skill-panel-section",a.append(ke(e,n.translate("skill.metadata")));for(let u of d){let p=e.createElement("div");p.textContent=`${u}: ${s[u]??""}`,a.append(p)}r.append(a)}let c=t.profile?.path;if(c!==void 0&&c!==""){r.append(ke(e,n.translate("skill.path")));let a=e.createElement("div");a.className="dsh-better-skill-panel-path",a.textContent=c,r.append(a)}if(t.usage!==void 0){let a=e.createElement("div");a.className="dsh-better-skill-panel-counts",a.textContent=`${n.translate("skill.usage.session")} ${t.usage.session}`,t.usage.workspace!==void 0&&(a.textContent+=` \xB7 ${n.translate("skill.usage.workspace")} ${t.usage.workspace}`),r.append(a)}let l=t.profile?.params??[];if(l.length>0&&t.getActions()?.insertText!==void 0){r.append(ke(e,n.translate("skill.params")));for(let a of l)r.append(yr(e,n,t,a.flag,a.detail))}{let u=gn(e),p=ur(i?.length??0,u);if(r.style.width=`${p}px`,t.box!==void 0){let f=fr(t.box,pn(e),r.offsetHeight,4);r.style.left=`${cr(f.left,p,u,12)}px`,f.anchor==="above"?(r.style.bottom=`${pn(e)-t.box.top+4}px`,r.style.top=""):(r.style.top=`${f.top}px`,r.style.bottom="")}}return r}function ke(e,n){let t=e.createElement("div");return t.className="dsh-better-skill-panel-label",t.textContent=n,t}function yr(e,n,t,r,o){let i=e.createElement("button");i.type="button",i.className="dsh-better-skill-panel-param",i.title=n.translate("skill.hint.insert"),i.addEventListener("pointerdown",d=>d.preventDefault());let s=e.createElement("span");if(s.className="dsh-better-skill-panel-param-flag",s.textContent=r,i.append(s),o!==""){let d=e.createElement("span");d.className="dsh-better-skill-panel-param-detail",d.textContent=o,i.append(d)}return i.addEventListener("click",()=>{let d=t.getActions();if(d?.insertText===void 0||d.captureInsertion===void 0)return;let c=d.captureInsertion();d.insertText(sr(t.getDraft(),r),c)}),i}var yn="dsh-better/skill-enhancer.css",hr=`
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
`;function hn(e){if(e===void 0)return()=>{};let n=`style[data-plugin-css=${JSON.stringify(yn)}]`;if(e.querySelector(n)!==null)return()=>{};let t=e.createElement("style");return t.dataset.plugin="dsh-better",t.dataset.pluginCss=yn,t.textContent=hr,e.head.append(t),()=>t.remove()}function bn(e,n,t){if(n===void 0||n===""||e.length===0)return;let r=0;for(let o of e){if(o.cwd!==n)continue;let i=o.usage?.[t];typeof i=="number"&&Number.isFinite(i)&&(r+=i)}return r}var x=require("react");var br="@deepseek-ai/dsh-client-ui-commands/PopupSelectView.module.css";function kn(e){if(e===void 0)return;let t=e.querySelector(`style[data-plugin-css="${br}"]`)?.textContent??"",r=i=>new RegExp(`\\.(\\w+_${i})\\{`,"u").exec(t)?.[1],o={badges:"dshBetter_badges",badgeChip:"dshBetter_badgeChip",badgeChipOn:"dshBetter_badgeChipOn",card:r("card"),viewport:r("viewport"),row:r("row"),rowActive:r("rowActive"),label:r("label"),labelText:r("labelText"),badge:r("badge"),detail:r("detail"),check:r("check"),status:r("status"),search:r("search"),error:r("error"),errorText:r("errorText"),retry:r("retry")};for(let[i,s]of Object.entries(o))if(!(i==="badges"||i==="badgeChip"||i==="badgeChipOn")&&s===void 0)return;return o}function xe(e,n){for(let t of e)if(t.id===n.provider){for(let r of t.models)if(r.id===n.model)return r.reasoning}}function Sn(e,n){let t=xe(e,n)?.efforts;return t===void 0?[]:[...t]}function wn(e,n){if(e.length===0)return;let t=r=>r!==void 0&&e.some(o=>o.id===r);return t(n.remembered)?n.remembered:n.isCurrent&&t(n.currentEffort)?n.currentEffort:t(n.defaultEffort)?n.defaultEffort:e[0]?.id}function kr(e){return e.length>1}function xn(e){return kr(e)?e:[]}var $=require("react/jsx-runtime");function ae(e){let n=e.group?.name;if(n===void 0)return;let t=`${n}/`,r=e.id.startsWith(t)?e.id.slice(t.length):e.id;return{provider:n,model:r}}function Sr(e,n){let t=ae(e);return xn(t===void 0?[]:Sn(n??[],t))}function vn({option:e,active:n,catalog:t,pointed:r,classes:o,primitives:i,onChoose:s,onPickEffort:d,onHover:c,t:l}){let a=Sr(e,t),u=i.IconCheckOutlineRegular;return(0,$.jsxs)("div",{role:"option","aria-selected":n,"aria-label":e.badge===void 0?void 0:`${e.label} ${e.badge}`,className:n?`${o.row} ${o.rowActive}`:o.row,onClick:s,onMouseEnter:c,children:[(0,$.jsxs)("span",{className:o.label,children:[(0,$.jsx)("span",{className:o.labelText,children:e.label}),e.badge!==void 0&&(0,$.jsx)("sup",{className:o.badge,children:e.badge})]}),e.detail!==void 0&&(0,$.jsx)("span",{className:o.detail,children:e.detail}),a.length>0&&(0,$.jsx)("span",{className:o.badges,role:"group","aria-label":l?.("listbox.aria")??"",children:a.map(p=>(0,$.jsx)("button",{type:"button",className:p.id===r?`${o.badgeChip} ${o.badgeChipOn}`:o.badgeChip,title:p.description??p.name,onClick:f=>{f.stopPropagation(),d(p.id)},children:p.name},p.id))}),e.active===!0&&a.length===0&&(0,$.jsx)("span",{className:o.check,children:u===void 0?null:(0,$.jsx)(u,{})})]})}function se(e){let n=new Map;for(let t of e){let r=t.group?.name,o=n.get(r);o!==void 0?o.rows.push(t):n.set(r,{group:t.group,rows:[t]})}return[...n.values()]}function de(e){let n=se(e);return n.some(t=>t.group!==void 0)?n.flatMap(t=>t.rows):[...e]}function Cn(e,n,t){return t===void 0?e.filter(r=>r.label.toLowerCase().includes(n)):se(e).flatMap(r=>t(r.rows.map(o=>({name:o.label,option:o})),n).map(o=>o.option))}var ve=new WeakSet;async function Ln(e,n){let t=e.binding,r=e.state.getSnapshot();if(!(t===null||r.submitting||ve.has(e))){ve.add(e),e.state.set?.({...r,submitting:!0,confirming:null,acknowledged:!1,error:null});try{let o=n();if(o===void 0)return;await o,t!==null&&e.binding===t&&e.deps?.consume?.(t.segment)}finally{ve.delete(e),t!==null&&e.binding===t&&e.dismiss({focusComposer:!0})}}}var wr="@deepseek-ai/dsh-client-ui-primitives";function le(e){if(e===null)return{};let n;try{n=e(wr)}catch{return{}}if(n===null||typeof n!="object")return{};let t=n,r=g=>typeof g=="function"||typeof g=="object"&&g!==null,o=g=>{let S=t[g];return r(S)?S:void 0},i=g=>{let S=t[g];return typeof S=="function"?S:void 0},s={},d=o("MenuSurface");d!==void 0&&(s.MenuSurface=d);let c=o("MenuGroup");c!==void 0&&(s.MenuGroup=c);let l=o("IconCheckOutlineRegular");l!==void 0&&(s.IconCheckOutlineRegular=l);let a=o("IconDataOutlineRegular");a!==void 0&&(s.IconDataOutlineRegular=a);let u=o("IconChevronDownOutlineRegular");u!==void 0&&(s.IconChevronDownOutlineRegular=u);let p=o("Tag");p!==void 0&&(s.Tag=p);let f=i("useAnchoredMaxHeight");f!==void 0&&(s.useAnchoredMaxHeight=f);let m=i("observeStickyMenuGroups");m!==void 0&&(s.observeStickyMenuGroups=m);let y=i("rankByName");return y!==void 0&&(s.rankByName=y),s}function xr(e){if(e===void 0)return[];let n=[e.name,e.label].map(t=>t.trim().toLowerCase()).filter(t=>t!=="");return[...new Set(n)]}function vr(e,n){return xr(e.group).some(t=>t.includes(n))}function Cr(e,n,t,r){return t==="fuzzy-label"?Cn(e,n,r):de(e).filter(o=>o.label.toLowerCase().includes(n)||o.detail?.toLowerCase().includes(n)===!0)}function Rn(e,n,t,r){let o=n.trim().toLowerCase();if(o==="")return de(e);let i=Cr(e,o,t,r),s=new Set(i),d=de(e).filter(c=>!s.has(c)&&vr(c,o));return[...i,...d]}var I=require("react/jsx-runtime"),Pn="model",En=320;function Lr(e){return e.command!==Pn||!e.open||e.status!=="ready"||e.confirming!==null||e.options.length===0?!1:e.submitting||e.error===null}function Rr(e){return e===void 0?!1:/Android|iPhone|iPad|iPod/i.test(e.userAgent)||e.platform==="MacIntel"&&e.maxTouchPoints>1}var Er={subscribe:()=>()=>{},getSnapshot:()=>({open:!1,command:null,status:"pending",options:[],search:"",searchLabels:null,searchMode:"substring",active:0,submitting:!1,confirming:null,acknowledged:!1,error:null})};function On(e){let n=le(e.load);function t(r){let o=r.popup,i=o?.state??Er,s=(0,x.useCallback)(a=>i.subscribe(a),[i]),d=(0,x.useCallback)(()=>i.getSnapshot(),[i]),c=(0,x.useSyncExternalStore)(s,d),l=e.native();return o===void 0||l===void 0?null:!Lr(c)||o.settle===void 0?(0,I.jsx)(l,{...r}):(0,I.jsx)(Tr,{popup:o,state:c,t:r.t,primitives:n,doc:e.document,catalog:r.catalog,current:r.current,selectModel:r.selectModel})}return t}function Tr({popup:e,state:n,t,primitives:r,doc:o,catalog:i,current:s,selectModel:d}){let c=(0,x.useRef)(null),l=(0,x.useRef)(null),a=(0,x.useRef)(null),u=(0,x.useMemo)(()=>kn(o),[o]),p=n.searchMode,f=(0,x.useMemo)(()=>Rn(n.options,n.search,p,r.rankByName),[n.options,n.search,p,r.rankByName]),m=(0,x.useMemo)(()=>se(f),[f]),[y,g]=(0,x.useState)({}),[S,L]=(0,x.useState)(()=>Tn(f));(0,x.useEffect)(()=>{L(Tn(f))},[n.search,n.options]);let E=An(f,S),C=Ar(r,c,n);(0,x.useEffect)(()=>{let h=a.current;if(!(h===null||r.observeStickyMenuGroups===void 0))return r.observeStickyMenuGroups(h)},[r.observeStickyMenuGroups,n.open,n.status,m]),(0,x.useEffect)(()=>{c.current?.querySelector('[aria-selected="true"]')?.scrollIntoView({block:"nearest"})},[E,f]),(0,x.useEffect)(()=>{if(!n.open)return;let h=R=>{let N=c.current;N!==null&&R.target instanceof Node&&N.contains(R.target)||e.dismiss()};return o?.addEventListener("pointerdown",h,!0),()=>{o?.removeEventListener("pointerdown",h,!0)}},[o,e,n.open]),(0,x.useEffect)(()=>{n.open&&(Rr(o?.defaultView?.navigator)||l.current?.focus())},[o,n.open]);let W=(0,x.useCallback)((h,R)=>{if(R===void 0||d===void 0){e.settle?.(e.binding,h);return}let N=ae(h);if(N===void 0){e.settle?.(e.binding,h);return}Ln(e,()=>d({...N,reasoningEffort:R}))},[e,d]),z=(0,x.useCallback)(h=>{let R=ae(h);if(R===void 0)return;let N=xe(i??[],R);return wn(N?.efforts??[],{remembered:y[h.id],isCurrent:s?.provider===R.provider&&s?.model===R.model,currentEffort:s?.reasoningEffort,defaultEffort:N?.defaultEffort})},[i,s,y]),D=(0,x.useCallback)(h=>{W(h,z(h))},[z,W]),H=(0,x.useCallback)((h,R)=>{g(N=>({...N,[h.id]:R})),W(h,R)},[W]),k=(0,x.useCallback)(()=>{let h=f[E];h!==void 0&&D(h)},[E,D,f]),v=(0,x.useCallback)(h=>{f.length!==0&&L(R=>(An(f,R)+h+f.length)%f.length)},[f]),P=h=>{switch(h.key){case"ArrowDown":h.preventDefault(),v(1);return;case"ArrowUp":h.preventDefault(),v(-1);return;case"Enter":h.preventDefault(),k();return;case"Tab":if(!h.shiftKey&&f.length===0)return;h.preventDefault(),h.shiftKey?e.dismiss({focusComposer:!0}):k();return;case"Escape":h.preventDefault(),e.dismiss({focusComposer:!0});return;default:}};if(u===void 0)return null;let O=n.searchLabels?.placeholder??t?.("search.placeholder")??"",_=n.searchLabels===null?t?.("status.empty")??"":n.options.length===0?n.searchLabels.empty:n.searchLabels.noResults,U=(h,R)=>(0,I.jsx)(vn,{option:h,active:R===E,catalog:i,pointed:R===E?z(h):void 0,classes:u,primitives:r,onChoose:()=>{D(h)},onPickEffort:N=>{H(h,N)},onHover:()=>{L(R)},t},h.id),b=0,T=m.map(({group:h,rows:R})=>{let N=R.map(Wt=>U(Wt,b++));return h===void 0?(0,I.jsx)(x.Fragment,{children:N},"ungrouped"):r.MenuGroup===void 0?(0,I.jsx)(x.Fragment,{children:N},`group:${h.name}`):(0,I.jsx)(r.MenuGroup,{label:h.label,children:N},`group:${h.name}`)}),K=(0,I.jsxs)(I.Fragment,{children:[(0,I.jsx)("input",{ref:l,className:u.search,type:"text",placeholder:O,"aria-label":t?.("search.aria")??"",value:n.search,readOnly:n.submitting,onChange:h=>{e.setSearch(h.currentTarget.value)}}),n.submitting&&(0,I.jsx)("div",{className:u.status,children:t?.("status.applying")??""}),!n.submitting&&f.length===0&&(0,I.jsx)("div",{className:u.status,children:_}),f.length>0&&(0,I.jsx)("div",{ref:a,role:"listbox","aria-label":t?.("listbox.aria")??"",className:u.viewport,children:T})]}),j={className:u.card,style:{maxHeight:C},"aria-label":t?.("overlay.aria")??Pn,onKeyDown:P};return r.MenuSurface===void 0?(0,I.jsx)("div",{ref:c,...j,children:K}):(0,I.jsx)(r.MenuSurface,{ref:c,...j,children:K})}function Tn(e){let n=e.findIndex(t=>t.active===!0);return n===-1?0:n}function An(e,n){return e.length===0?0:Math.min(Math.max(n,0),e.length-1)}function Ar(e,n,t){let r=e.useAnchoredMaxHeight;return r===void 0?En:r(n,En,t)}var B=require("react");var Ce="application/x-dsh-composer+json";var Pr=Object.freeze({png:"image/png",jpg:"image/jpeg",jpeg:"image/jpeg",webp:"image/webp",gif:"image/gif",bmp:"image/bmp",svg:"image/svg+xml",avif:"image/avif",heic:"image/heic",heif:"image/heif",tif:"image/tiff",tiff:"image/tiff"});function In(e){return JSON.stringify({v:1,text:e.text,attachments:e.attachments.map(n=>({path:n.path,name:n.name,type:n.type,kind:n.kind}))})}function Nn(e){if(typeof e!="string"||e==="")return;let n;try{n=JSON.parse(e)}catch{return}if(n===null||typeof n!="object")return;let t=n;if(t.v!==1)return;let r=typeof t.text=="string"?t.text:"",o=Array.isArray(t.attachments)?t.attachments:[],i=[];for(let s of o){if(s===null||typeof s!="object")continue;let d=s,c=d.path;typeof c!="string"||c===""||i.push({path:c,name:typeof d.name=="string"&&d.name!==""?d.name:Re(c),type:typeof d.type=="string"?d.type:"",kind:d.kind==="image"?"image":"file"})}return{text:r,attachments:i}}function Le(e,n){if(n.length===0)return e;let t=n.join(`
`);return e===""?t:`${e.replace(/\n+$/u,"")}

${t}`}function Mn(e){if(e==="")return;let n=e.split(`
`),t=[],r=n.length;for(let i=n.length-1;i>=0;i-=1){let s=n[i]??"";if(s.trim()===""){if(t.length>0){r=i;continue}continue}let d=Or(s);if(d===void 0)break;t.unshift(d),r=i}return t.length===0?void 0:{text:n.slice(0,r).join(`
`).replace(/\n+$/u,""),paths:t}}function Or(e){let n=e.trim();if(n.startsWith("@")&&(n=n.slice(1)),n.startsWith('"')&&n.endsWith('"')&&n.length>1&&(n=n.slice(1,-1)),n!==""&&Ir(n)&&!/[\u0000-\u001f\u007f]/u.test(n)&&!/["\u2018\u2019\u201c\u201d\u300c\u300d\u300e\u300f\u3002\uff01\uff1f\uff1b\uff1a\uff0c\u3001\u2026*?;<>|&$`!#=]/u.test(n)&&!/(?:^|\s)-{1,2}\S/u.test(n))return n}function Ir(e){return e.startsWith("/")||/^[A-Za-z]:[/\\]/u.test(e)||e.startsWith("\\\\")}function Dn(e){let n=/\.([A-Za-z0-9]+)$/u.exec(e);if(n!==null)return Pr[n[1]?.toLowerCase()??""]}function Re(e){return e.split(/[\\/]/u).filter(t=>t!=="").at(-1)??e}function _n(e,n){let t=new Set(n),r=[],o=[];for(let i of e){if(t.has(i.path)){o.push(i.path);continue}t.add(i.path),r.push(i)}return{accepted:r,duplicates:o}}var X=require("react/jsx-runtime"),Nr="data-dsh-better-attach-item",Mr="data-dsh-better-attach-selected",Dr=4500,_r=new Set(["a","c","x","insert"]),Fr=new Set(["meta","control","shift","alt","altgraph","capslock","os"]),Br=/\s/u;function Bn(e){function n(t){let r=e.native();return r===void 0?null:(0,X.jsx)(Wr,{native:r,props:t,deps:e})}return n}function Wr({native:e,props:n,deps:t}){let r=(0,B.useRef)(null),[o,i]=(0,B.useState)(!1),[s,d]=(0,B.useState)(null),c=(n.attachments??[]).length>0,l=(0,B.useRef)(n);l.current=n;let a=(0,B.useRef)(o);a.current=o;let u=(f,m)=>n.t?.(f,m)??t.translate()?.(f,m)??"",p=(0,B.useRef)(u);return p.current=u,(0,B.useEffect)(()=>{let f=r.current;if(f===null)return;let m=f.querySelector('[role="group"]');if(m!==null)for(let y of Array.from(m.children)){if(!(y instanceof HTMLElement))continue;y.toggleAttribute(Nr,!0);let g=$r(y);g!==null&&g.toggleAttribute(Mr,o)}},[o,n.attachments]),(0,B.useEffect)(()=>{if(s===null)return;let f=globalThis.setTimeout(()=>{d(null)},Dr);return()=>{globalThis.clearTimeout(f)}},[s]),(0,B.useEffect)(()=>{let f=r.current;if(f===null)return;let m=f.closest("[data-composer-card]");if(!(m instanceof HTMLElement))return;let y=m.ownerDocument,g=k=>(k instanceof Element?k:k instanceof Node?k.parentElement:null)?.closest("[contenteditable]")??null,S=()=>{a.current&&i(!1)},L=()=>{let k=m.ownerDocument.getSelection();return k!==null&&!k.isCollapsed&&k.toString()!==""},E=k=>k instanceof Node&&m.contains(k),C=k=>{let v=k.key.toLowerCase();if(Fr.has(v))return;let P=k.metaKey||k.ctrlKey;if(P&&!k.altKey&&v==="a"){E(k.target)&&g(k.target)?.getAttribute("contenteditable")==="true"&&i(!0);return}if(P&&!k.altKey&&v==="c"&&a.current&&E(k.target)&&!L()){k.preventDefault(),Hr(l.current,t,d,p.current);return}P&&!k.altKey&&_r.has(v)||S()},W=()=>{S()},z=k=>{let P=l.current.attachments??[],O=k.clipboardData;if(!a.current||P.length===0||O===null)return;let _=[],U=[];for(let b of P){let T=t.pathOf(b.file);if(T===""){U.push(b.file.name);continue}_.push({path:T,name:b.file.name,type:b.file.type,kind:b.kind})}if(_.length>0){let b=O.getData("text/plain");O.setData(Ce,In({text:b,attachments:_})),O.setData("text/plain",Le(b,_.map(T=>T.path)))}U.length>0&&d(p.current("attach.copySkipped",{count:String(U.length)}))},D=k=>{let v=k.clipboardData;if(v===null||g(k.target)===null||Array.from(v.types).includes("Files"))return;let P=()=>l.current,O=Nn(v.getData(Ce)),_=O===void 0?Mn(v.getData("text/plain")):void 0;if(O===void 0&&_===void 0)return;let U=zr(l.current.phase?.(),p.current);if(U!==void 0){k.preventDefault(),k.stopPropagation(),d(U);return}if(k.preventDefault(),k.stopPropagation(),S(),O!==void 0){Fn(O,P,t,d,p.current);return}_!==void 0&&Fn({text:_.text,attachments:_.paths.map(b=>{let T=Dn(b)??"";return{path:b,name:Re(b),type:T,kind:T===""?"file":"image"}})},P,t,d,p.current)};y.addEventListener("keydown",C,!0),m.addEventListener("paste",D,!0);let H=k=>{let v=k.relatedTarget;v instanceof Node&&m.contains(v)||S()};return m.addEventListener("focusout",H),y.addEventListener("copy",z),y.addEventListener("pointerdown",W,!0),()=>{y.removeEventListener("keydown",C,!0),y.removeEventListener("copy",z),m.removeEventListener("paste",D,!0),m.removeEventListener("focusout",H),y.removeEventListener("pointerdown",W,!0)}},[t]),(0,X.jsxs)("div",{ref:r,className:c?"dshBetter_railHost":"dshBetter_railHostEmpty",children:[(0,X.jsx)(e,{...n}),s!==null&&(0,X.jsx)("div",{className:"dshBetter_attachNotice",role:"status",children:s})]})}function zr(e,n){return J(e)?n("attach.pasteBusy"):void 0}function Hr(e,n,t,r){let o=e.attachments??[],i=[],s=0;for(let d of o){let c=n.pathOf(d.file);c===""?s+=1:i.push(c)}i.length>0&&globalThis.navigator?.clipboard?.writeText(Le("",i)).catch(()=>{t(r("attach.copyFailed"))}),s>0&&t(r("attach.copySkipped",{count:String(s)}))}function Fn(e,n,t,r,o){let i=n();if(Ee(i,e.text),e.attachments.length===0)return;let s=t.reader(),d=i.sessionId;if(s===void 0||d===void 0){Ee(i,e.attachments.map(a=>a.path).join(`
`));return}let c=(i.attachments??[]).map(a=>t.pathOf(a.file)).filter(a=>a!==""),{accepted:l}=_n(e.attachments,c);l.length!==0&&(async()=>{let a=[],u=[],p=0;for(let m of l){let y=await Ur(s,d,m);y.kind==="file"?a.push(y.file):y.kind==="mention"?u.push(y.mention):p+=1}let f=n();u.length>0&&Ee(f,u.join(" ")),a.length>0&&f.onAddFiles?.(a),p>0&&r(o("attach.pasteMissing",{count:String(p)})),u.length>0&&r(o("attach.pasteReferenced",{count:String(u.length)}))})()}function Ee(e,n){if(n==="")return;let t=e.inputActions,r=t?.captureInsertion?.();t?.insertText===void 0||r===void 0||t.insertText(n,r)}async function Ur(e,n,t){let r=await e.readBytes?.(n,t.path,{});if(r!==void 0&&r.ok)return{kind:"file",file:new File([r.value.data],t.name,{type:t.type})};let o=await e.stat?.(n,t.path);return o!==void 0&&o.ok?{kind:"mention",mention:jr(t.path)}:{kind:"missing"}}function $r(e){let n=e.querySelector("img")?.parentElement;if(n!=null)return n;let t=e.firstElementChild;return t instanceof HTMLElement?t:null}function jr(e){return Br.test(e)?`@"${e}"`:`@${e}`}var qr="better.focusComposer",Vr=Object.freeze(["focus input","focus composer","message input"]),ee="command.focusComposer",Gr=Object.freeze(["page","editable","terminal"]),Kr=Object.freeze({"desktop:macos":{code:"Space",modifiers:["primary"]},"desktop:windows":{code:"Space",modifiers:["primary","shift"]},"web:macos":{code:"Space",modifiers:["primary","shift"]},"web:windows":{code:"Space",modifiers:["primary","shift"]}}),Yr="[data-composer-input], [role='textbox'][aria-multiline='true']";function zn(e){return e===void 0||typeof e.querySelector!="function"?!1:e.querySelector(Yr)!=null}function Te(e,n){if(e===null||typeof e!="object")return;let t=e.get;if(typeof t=="function"){let r=t.call(e,n);return r===null?void 0:r}return e[n]}var Wn=e=>typeof e=="string"&&e!==""?e:void 0;function Hn(e){let t=Te(e,"uiSession")?.adapter?.current?.getSnapshot?.();if(t!==void 0)return Wn(t.key);let r=Te(e,"sessions");return Wn(r?.list?.getSnapshot?.()?.current)}function Un(e,n){try{let t=e.sessions?.scope?.(n);if(t===void 0)return!1;let o=Te(t,"conversation")?.input?.for?.(t);return o===void 0||typeof o.focus!="function"?!1:(o.focus(),!0)}catch{return!1}}function Jr(e){return(n={})=>{if(n.modal!=null)return{status:"pass"};if(!e.composerMounted())return{status:"pass"};let t=e.currentSessionId();return t===void 0?{status:"pass"}:{status:"handled",run:()=>{e.focusComposer(t)}}}}function Xr(e,n){return{id:qr,label:n,aliases:Vr,defaults:Kr,regions:Gr,modals:[],resolve:Jr(e)}}function $n(e,n,t,r){if(e===void 0||typeof e.register!="function")return()=>{};try{return e.register(Xr(n,t))}catch(o){return r?.(o instanceof Error?o.message:String(o)),()=>{}}}var jn=Object.freeze({zh:{"overlay.aria":"\u9009\u62E9\u6A21\u578B","listbox.aria":"\u6A21\u578B\u5339\u914D\u9879","search.aria":"\u641C\u7D22\u4F9B\u5E94\u5546\u6216\u6A21\u578B","search.placeholder":"\u641C\u7D22\u4F9B\u5E94\u5546\u6216\u6A21\u578B\u2026","status.empty":"\u6CA1\u6709\u53EF\u7528\u7684\u6A21\u578B\u3002","status.applying":"\u6B63\u5728\u5207\u6362\u2026",retry:"\u91CD\u8BD5","trigger.selectAria":"\u9009\u62E9\u6A21\u578B","trigger.aria":"\u5F53\u524D\u6A21\u578B {model}\uFF0C\u70B9\u51FB\u5207\u6362","trigger.ariaEffort":"\u5F53\u524D\u6A21\u578B {model}\uFF0C\u63A8\u7406\u7B49\u7EA7 {effort}\uFF0C\u70B9\u51FB\u5207\u6362","trigger.fallback":"\u9009\u62E9\u6A21\u578B","trigger.loading":"\u52A0\u8F7D\u6A21\u578B\u2026",[ee]:"\u805A\u7126\u8F93\u5165\u6846","attach.copySkipped":"{count} \u4E2A\u9644\u4EF6\u6765\u81EA\u526A\u8D34\u677F\u3001\u6CA1\u6709\u672C\u5730\u8DEF\u5F84\uFF0C\u672A\u590D\u5236","attach.pasteMissing":"{count} \u4E2A\u9644\u4EF6\u5BF9\u5E94\u7684\u6587\u4EF6\u5DF2\u4E0D\u5B58\u5728\uFF0C\u672A\u7C98\u8D34","attach.pasteReferenced":"{count} \u4E2A\u9644\u4EF6\u8D85\u51FA\u5355\u6B21\u8BFB\u53D6\u4E0A\u9650\uFF0C\u5DF2\u6539\u4E3A\u8DEF\u5F84\u5F15\u7528","attach.copyFailed":"\u6D4F\u89C8\u5668\u62D2\u7EDD\u4E86\u8FD9\u6B21\u526A\u8D34\u677F\u5199\u5165","attach.pasteBusy":"\u6D88\u606F\u6B63\u5728\u53D1\u9001\uFF0C\u7A0D\u540E\u518D\u7C98\u8D34","compaction.reading":"\u538B\u7F29 {count} \u6B21","compaction.readingOne":"\u538B\u7F29 1 \u6B21","compaction.tooltip":"\u672C\u4F1A\u8BDD\u4E0A\u4E0B\u6587\u5DF2\u538B\u7F29 {count} \u6B21","compaction.tooltipWithFailures":"\u672C\u4F1A\u8BDD\u4E0A\u4E0B\u6587\u5DF2\u538B\u7F29 {count} \u6B21\uFF0C\u53E6\u6709 {failures} \u6B21\u538B\u7F29\u5931\u8D25","tabs.nav":"Tab \u7BA1\u7406","tabs.heading":"Tab \u7BA1\u7406","tabs.empty":"\u8FD8\u6CA1\u6709\u63D2\u4EF6\u6CE8\u518C\u4F1A\u8BDD\u6807\u7B7E\u3002","tabs.show":"\u5728\u6807\u7B7E\u680F\u663E\u793A{label}","tabs.hide":"\u4ECE\u6807\u7B7E\u680F\u9690\u85CF{label}","alias.nav":"\u6280\u80FD\u522B\u540D","alias.heading":"\u6280\u80FD\u522B\u540D","alias.prefix.title":"\u9700\u8981\u659C\u6760\u524D\u7F00","alias.prefix.on":"\u6253\u5F00\u5219\u9700\u8981\u8F93\u5165 \u201C/\u201D \u8FDB\u884C\u5339\u914D","alias.prefix.off":"\u6253\u5F00\u5219\u65E0\u9700\u8F93\u5165 \u201C/\u201D \u8FDB\u884C\u5339\u914D","alias.table.keyword":"\u5173\u952E\u8BCD","alias.table.target":"\u6280\u80FD\u6216\u547D\u4EE4","alias.table.params":"\u53C2\u6570","alias.table.paramsPlaceholder":"\u53EF\u9009\uFF0C\u5982 run","alias.table.actions":"\u64CD\u4F5C","alias.add":"\u6DFB\u52A0\u522B\u540D","alias.remove":"\u5220\u9664\u522B\u540D {keyword}","alias.unnamed":"\uFF08\u672A\u547D\u540D\uFF09","alias.empty":"\u8FD8\u6CA1\u6709\u522B\u540D\u3002\u4F8B\u5982\uFF1Awf \u2192 /flow-workflow run","alias.footnote":"\u8F93\u5165\u5173\u952E\u8BCD\u540E\u4ECE\u9762\u677F\u9009\u62E9\u5373\u53EF\u63D2\u5165\u5B8C\u6574\u8C03\u7528\uFF1B\u6539\u5B8C\u7ACB\u5373\u751F\u6548\u3002","alias.menu.section":"\u6280\u80FD\u522B\u540D","alias.menu.params":"\u53C2\u6570\uFF1A{value}","skill.metadata":"\u5143\u6570\u636E","skill.path":"\u5730\u5740","skill.usage.session":"\u672C\u4F1A\u8BDD\u8C03\u7528","skill.usage.workspace":"\u672C\u5DE5\u4F5C\u533A\u8C03\u7528","skill.params":"\u53C2\u6570","skill.hint.insert":"\u70B9\u51FB\u63D2\u5165","continue.label":"\u7EE7\u7EED","continue.sending":"\u7EE7\u7EED\u4E2D\u2026"},en:{"overlay.aria":"Select a model","listbox.aria":"Matching models","search.aria":"Search providers or models","search.placeholder":"Search providers or models\u2026","status.empty":"No models available.","status.applying":"Switching\u2026",retry:"Retry","trigger.selectAria":"Select model","trigger.aria":"Current model {model}, click to change","trigger.ariaEffort":"Current model {model}, reasoning effort {effort}, click to change","trigger.fallback":"Select model","trigger.loading":"Loading models\u2026",[ee]:"Focus message input","attach.copySkipped":"{count} attachment(s) came from the clipboard with no local path and were not copied","attach.pasteMissing":"{count} attachment(s) no longer exist and were not pasted","attach.pasteReferenced":"{count} attachment(s) exceed the read limit and became path references","attach.copyFailed":"The browser refused this clipboard write","attach.pasteBusy":"A message is being sent; paste again in a moment","compaction.reading":"{count} compactions","compaction.readingOne":"1 compaction","compaction.tooltip":"This session's context was compressed {count} time(s)","compaction.tooltipWithFailures":"This session's context was compressed {count} time(s), with {failures} failed attempt(s)","tabs.nav":"Tabs","tabs.heading":"Tabs","tabs.empty":"No plugin has registered a conversation tab yet.","tabs.show":"Show {label} in the tab bar","tabs.hide":"Hide {label} from the tab bar","alias.nav":"Skill aliases","alias.heading":"Skill aliases","alias.prefix.title":"Require a slash prefix","alias.prefix.on":"To open, type \u201C/\u201D to match","alias.prefix.off":"To open, type the keyword without \u201C/\u201D to match","alias.table.keyword":"Keyword","alias.table.target":"Skill or command","alias.table.params":"Arguments","alias.table.paramsPlaceholder":"Optional, e.g. run","alias.table.actions":"Actions","alias.add":"Add alias","alias.remove":"Delete alias {keyword}","alias.unnamed":"(unnamed)","alias.empty":"No aliases yet. For example: wf \u2192 /flow-workflow run","alias.footnote":"Type a keyword and pick from the panel to insert the full invocation; changes apply immediately.","alias.menu.section":"Skill aliases","alias.menu.params":"args: {value}","skill.metadata":"Metadata","skill.path":"Path","skill.usage.session":"This session","skill.usage.workspace":"This workspace","skill.params":"Arguments","skill.hint.insert":"Click to insert","continue.label":"Continue","continue.sending":"Continuing\u2026"}});var qn="dsh-better-effort",Zr=`
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
`;function Vn(e){if(e===void 0)return()=>{};if(e.getElementById(qn)!==null)return()=>{};let n=e.createElement("style");return n.id=qn,n.textContent=Zr,e.head.append(n),()=>{n.remove()}}var Yn="dsh-better.layout-widths",Z=Object.freeze({sidebar:null,rightbar:null});function Jn(e){return typeof e=="number"&&Number.isFinite(e)&&e>0}function ue(e){if(e===void 0)return Z;let n;try{n=e.getItem(Yn)}catch{return Z}if(n===null||n==="")return Z;let t;try{t=JSON.parse(n)}catch{return Z}if(typeof t!="object"||t===null||Array.isArray(t))return Z;let r=t;return{sidebar:Gn(r.sidebar),rightbar:Gn(r.rightbar)}}function Xn(e,n){if(e===void 0)return;let t={};n.sidebar!==null&&(t.sidebar=Math.round(n.sidebar)),n.rightbar!==null&&(t.rightbar=Math.round(n.rightbar));try{e.setItem(Yn,JSON.stringify(t))}catch{}}function Gn(e){return Jn(e)?Math.round(e):null}function Zn(e){if(typeof e!="string")return Z;let n=e.trim().split(/\s+/).filter(t=>t!=="");return{sidebar:Kn(n[0]),rightbar:Kn(n[2])}}function Kn(e){if(e===void 0)return null;let n=/^([0-9]+(?:\.[0-9]+)?)px$/.exec(e);if(n===null)return null;let t=Number(n[1]);return Jn(t)?Math.round(t):null}function Qn(e,n,t=null){return t==="sidebar"?n.sidebar!==null&&n.sidebar!==e.sidebar?{sidebar:n.sidebar}:{}:t==="rightbar"?n.rightbar!==null&&n.rightbar!==e.rightbar?{rightbar:n.rightbar}:{}:n.sidebar!==null&&n.sidebar!==e.sidebar?{sidebar:n.sidebar}:n.rightbar!==null&&n.rightbar!==e.rightbar?{rightbar:n.rightbar}:{}}function et(e,n){return{sidebar:n.sidebar??e.sidebar,rightbar:n.rightbar??e.rightbar}}function nt(e){let n=[];return e.sidebar!==null&&n.push({column:"sidebar",width:e.sidebar}),e.rightbar!==null&&n.push({column:"rightbar",width:e.rightbar}),n}var Qr="[data-shell-bottom]",eo="[data-side]",no='[class*="_sidebarCol"]',to='[class*="_rightbarCol"]',ro=600;function oo(e){let t=e?.layout?.panels;if(typeof t!="object"||t===null)return;let r=t;if(!(typeof r.setSidebar!="function"&&typeof r.setRightbar!="function"))return r}function ot(e,n){let t=oo(e);if(t===void 0)return!1;let r=!1;for(let{column:o,width:i}of nt(n)){let s=o==="sidebar"?t.setSidebar:t.setRightbar;if(s!==void 0)try{s.call(t,i),r=!0}catch{}}return r}function tt(e){return e.querySelector(Qr)?.parentElement??null}function io(e,n){let t=e.hasAttribute("data-sidebar-collapsed"),r=e.hasAttribute("data-rightbar-collapsed"),o=Zn(n?.getComputedStyle(e).gridTemplateColumns);return{sidebar:t?null:o.sidebar??rt(e.querySelector(no)),rightbar:r?null:o.rightbar??rt(e.querySelector(to))}}function rt(e){if(e===null)return null;let n=e.getBoundingClientRect().width;return Number.isFinite(n)&&n>0?Math.round(n):null}function it(e){let{document:n,storage:t}=e,r=null,o=null,i=0,s=!1,d=null,c=()=>n.defaultView,l=()=>(r!==null&&r.isConnected||(r=tt(n)),r),a=()=>{let g=l();return g===null?null:io(g,c())},u=g=>{let S=g?.getAttribute("data-side");return S==="sidebar"||S==="rightbar"?S:null},p=g=>{let S=a();if(S===null)return;let L=Qn(g.before,S,g.side);L.sidebar===void 0&&L.rightbar===void 0||Xn(t,et(ue(t),L))},f=g=>{if(d!==null)return;let S=g.target,L=typeof S?.closest=="function"?S.closest(eo):null;if(L===null)return;let E=a();E!==null&&(d={side:u(L),before:E})},m=()=>{let g=d;if(d=null,g===null)return;let S=c()?.requestAnimationFrame;if(S===void 0){p(g);return}S.call(c(),()=>p(g))},y=()=>{if(o=null,s)return;let g=tt(n);if(g!==null){r=g;return}if(i>=ro)return;i+=1;let S=c()?.requestAnimationFrame;S!==void 0&&(o=S.call(c(),y))};return{attach(){s=!1,i=0;let g=c();return g?.addEventListener("pointerdown",f,!0),g?.addEventListener("pointerup",m,!0),g?.addEventListener("pointercancel",m,!0),y(),()=>{s=!0,d=null,r=null,g?.removeEventListener("pointerdown",f,!0),g?.removeEventListener("pointerup",m,!0),g?.removeEventListener("pointercancel",m,!0),o!==null&&g?.cancelAnimationFrame(o),o=null}}}}var at="sessionCompaction";var st="dsh-better-compaction",ce="dshBetter_compactionStat",ao=`
.${ce} {
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

[data-composer-dock]:has([data-workbench-dock="term-dock"]) .${ce} {
  margin-left: 12px;
}
`;function dt(e){if(e===void 0)return()=>{};if(e.getElementById(st)!==null)return()=>{};let n=e.createElement("style");return n.id=st,n.textContent=ao,e.head.append(n),()=>{n.remove()}}var ut=require("react/jsx-runtime");function so(e,n){if(e===void 0||n===void 0)return null;let{compactions:t,failures:r}=e;if(!Number.isSafeInteger(t)||t<=0)return null;let o=t===1?n("compaction.readingOne"):n("compaction.reading",{count:t}),i=Number.isSafeInteger(r)&&r>0?n("compaction.tooltipWithFailures",{count:t,failures:r}):n("compaction.tooltip",{count:t});return{text:o,tooltip:i}}function lo(){}function lt({useProjection:e,t:n}){let r=so((e??lo)(at),n);return r===null?null:(0,ut.jsx)("span",{className:ce,"data-dsh-better":"compaction-stat",title:r.tooltip,children:r.text})}var Ae="conversation.composer.dock",ct="better-compaction";var Ne=require("react");var pt="continue",Pe="conversation.chat.turnTail",ft="better-continue";function gt(e){return e.end?.reason?.kind!=="interrupted"?!1:e.latest&&!e.pending}var mt="dsh-better-continue",Q="dshBetter_continue",Oe="dshBetter_continueError",uo=`
.${Q} {
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

.${Q}:hover:not(:disabled) {
  background: var(--dsw-alias-interactive-bg-hover);
  color: var(--dsw-alias-label-primary);
  border-color: var(--dsw-alias-border-l1);
}

.${Q}:focus-visible {
  outline: 1px solid var(--dsw-alias-border-l1);
  outline-offset: 1px;
}

/* Disabled covers both halves of the pressed state: the request is in flight, so
   the button must not invite a second one, and the dimming is what says so. */
.${Q}:disabled {
  cursor: default;
  opacity: 0.6;
}

/* The failure line sits under the button in the same column. It is a sibling
   rather than a wrapper so the button keeps its own alignment. */
.${Oe} {
  align-self: flex-end;
  color: var(--dsw-alias-state-business-primary);
  font-size: var(--dsh-content-font-size-secondary, 13px);
  line-height: calc(20px + var(--dsh-content-font-delta-secondary, 0px));
}
`;function yt(e){if(e===void 0)return()=>{};if(e.getElementById(mt)!==null)return()=>{};let n=e.createElement("style");return n.id=mt,n.textContent=uo,e.head.append(n),()=>{n.remove()}}var V=require("react/jsx-runtime");function co(e){return e instanceof Error?e.message:String(e)}function po(e,n){return e.length>0&&e[e.length-1]===n}function Ie(){}function ht({turn:e,sessionId:n,useChat:t,useSession:r,useInput:o,t:i,submitContinue:s}){let d=t??Ie,c=r??Ie,l=o??Ie,a=d(C=>C),u=c(C=>C),p=l(C=>C),[f,m]=(0,Ne.useState)(!1),[y,g]=(0,Ne.useState)(null),S=e!==void 0&&po(a?.timeline.turnOrder??[],e.turn),L=(u?.pendingSubmissions?.length??0)>0||J(p?.phase);return e===void 0||n===void 0||s===void 0||i===void 0||!gt({end:e.end?.data,latest:S,pending:L})?null:(0,V.jsxs)(V.Fragment,{children:[(0,V.jsx)("button",{type:"button",className:Q,"data-testid":"better-continue",disabled:f,onClick:()=>{m(!0),g(null),s(n).catch(C=>{m(!1),g(co(C))})},children:i(f?"continue.sending":"continue.label")}),y===null?null:(0,V.jsx)("span",{className:Oe,role:"alert",children:y})]})}function fo(e){return typeof e=="object"&&e!==null&&"ok"in e&&e.ok===!1}async function bt(e,n){let t=e.sessions?.binding?.(n)?.session,r=t?.prompt;if(typeof r!="function")throw new Error("\u8FD9\u4E2A\u5BBF\u4E3B\u7684\u4F1A\u8BDD\u4E0D\u652F\u6301\u53D1\u9001\u6D88\u606F");let o=await r.call(t,[{type:"text",text:pt}],"queue");if(fo(o))throw new Error("\u7EE7\u7EED\u6D88\u606F\u6CA1\u6709\u88AB\u5BBF\u4E3B\u63A5\u53D7")}var ne=require("react");function go(e){let n=e.name.trim();return n===""?e.id:n}function Me(e,n){if(e===void 0)return{model:n};let t=go(e.group),r=e.model.name.trim();return r===""?{model:t}:{provider:t,model:r}}function kt(e,n){let t=Me(e,n);return t.provider===void 0?t.model:`${t.provider} ${t.model}`}function mo(e){return typeof e=="string"?e:e.en??""}function pe(e,n){if(e!==void 0)try{return e(n)}catch{}return mo(n)}var M=require("react/jsx-runtime"),yo="@deepseek-ai/dsh-client-ui-model-selection/ModelSelect.module.css";function ho(e){if(e===void 0)return;let t=e.querySelector(`style[data-plugin-css="${yo}"]`)?.textContent??"",r=s=>new RegExp(`\\.(\\w+_${s})\\{`,"u").exec(t)?.[1],o={root:r("root"),trigger:r("trigger"),triggerIcon:r("triggerIcon"),triggerLabel:r("triggerLabel"),triggerEffort:r("triggerEffort"),chevron:r("chevron")};for(let s of Object.values(o))if(s===void 0)return;let i=r("badge");return{...o,...i===void 0?{}:{badge:i}}}function St(e){let n=le(e.load),t=ho(e.document);function r(o){let i=e.native();return o.available===!1||i===void 0||t===void 0?i===void 0?null:(0,M.jsx)(i,{...o}):(0,M.jsx)(bo,{props:o,primitives:n,openPicker:e.openPicker,translate:e.translate,classes:t})}return r}function bo({props:e,primitives:n,openPicker:t,translate:r,classes:o}){let{directory:i,t:s,sessionId:d,locked:c,resolveText:l}=e,a=ko(i),u=s??r(),p=a?.current??null,f=p===null&&a?.status==="loading",m=So(a,p),y=u?.("trigger.fallback")??"",g=kt(m,y),S=Me(m,y),L=wo(m,l),E=f?u?.("trigger.loading")??"":g,C=xo(a,p,m,u),W=C===void 0?E:`${E} \xB7 ${C}`,z=f?u?.("trigger.loading")??"":p===null?u?.("trigger.selectAria")??"":C===void 0?u?.("trigger.aria",{model:E})??"":u?.("trigger.ariaEffort",{model:E,effort:C})??"",D=()=>{t(d)},H=n.IconDataOutlineRegular,k=n.IconChevronDownOutlineRegular,v=n.Tag,P=o.badge;return(0,M.jsx)("div",{className:o.root,"data-dsh-better-seat":"",children:(0,M.jsxs)("button",{type:"button",className:o.trigger,"aria-label":z,"aria-haspopup":"dialog","aria-expanded":"false",title:W,disabled:c,onClick:D,children:[H===void 0?null:(0,M.jsx)(H,{className:o.triggerIcon,size:16}),(0,M.jsx)("span",{className:o.triggerLabel,"data-provider-id":p?.provider,"data-model-id":p?.model,children:f?E:(0,M.jsxs)(M.Fragment,{children:[S.provider===void 0?null:`${S.provider} `,L===void 0||P===void 0||v===void 0?null:(0,M.jsxs)(M.Fragment,{children:[(0,M.jsx)(v,{className:P,tone:L.tone,children:L.text})," "]}),S.model]})}),C!==void 0&&(0,M.jsx)("span",{className:o.triggerEffort,children:C}),k===void 0?null:(0,M.jsx)(k,{className:o.chevron})]})})}function ko(e){let n=(0,ne.useCallback)(r=>e===void 0?()=>{}:e.subscribe(r),[e]),t=(0,ne.useCallback)(()=>e?.getSnapshot(),[e]);return(0,ne.useSyncExternalStore)(n,t)}function So(e,n){if(!(e===void 0||n===null||n===void 0)){for(let t of e.groups)if(t.id===n.provider){for(let r of t.models)if(r.id===n.model)return{group:t,model:r}}}}function wo(e,n){let t=e?.model.badge;if(t===void 0)return;let r=pe(n,t.text);if(r!=="")return{text:r,tone:t.tone}}function xo(e,n,t,r){if(e===void 0||n===null||n===void 0)return;let o=t?.model.reasoning,i=n.reasoningEffort??o?.defaultEffort;return t===void 0?e.retainedEffort:o===void 0||i===void 0?void 0:o.efforts?.find(d=>d.id===i)?.name??i}function wt(e){let r=e?.live?.contributions?.get("model")?.ui;return r==null?void 0:r.kind==="popupSelect"?r:void 0}function xt(e){return{sessionId:e}}function vt(){return{via:"enter",token:""}}var vo=`
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
`,Ct="dsh-better/tabs.css";function Lt(e){let n=`style[data-plugin-css=${JSON.stringify(Ct)}]`;if(e.querySelector(n)!==null)return()=>{};let t=e.createElement("style");return t.dataset.plugin="dsh-better",t.dataset.pluginCss=Ct,t.textContent=vo,e.head.append(t),()=>t.remove()}function Rt(e){let n;return e.React.createElement("section",{"data-dsh-better-tabs":"",ref:t=>{if(n?.(),n=void 0,t===null)return;let r=()=>{Co(t,e)};r(),n=e.controller.subscribe(r)}})}function Co(e,n){let t=e.ownerDocument,{controller:r,copy:o}=n;e.replaceChildren();let i=t.createElement("h2");i.setAttribute("data-dsh-better-tabs-heading",""),i.textContent=o.heading,e.append(i);let s=r.rows();if(s.length===0){let d=t.createElement("p");d.setAttribute("data-dsh-better-tabs-empty",""),d.textContent=o.empty,e.append(d);return}for(let d of s){let c=t.createElement("label");c.setAttribute("data-dsh-better-tabs-row",d.id);let l=t.createElement("span");l.setAttribute("data-dsh-better-tabs-name",""),l.textContent=d.label;let a=t.createElement("input");a.setAttribute("data-dsh-better-tabs-check",d.id),a.type="checkbox",a.checked=d.enabled,a.setAttribute("aria-label",o.checkboxLabel(d.label,d.enabled)),a.addEventListener("change",()=>{r.setEnabled(d.id,a.checked)}),c.append(l,a),e.append(c)}}var De="conversation.view",_e="settings.section",Tt="tabs";var ge="chat",At="dsh-better.tabs",te="[data-conversation-tabs]";function Pt(e,n){if(typeof e=="string"&&e!=="")return e;if(typeof e=="function")try{let t=e();if(typeof t=="string"&&t!=="")return t}catch{}return n}function Lo(e){if(e===void 0)return new Set;let n;try{n=e.getItem(At)}catch{return new Set}if(n===null||n==="")return new Set;try{let t=JSON.parse(n);if(!Array.isArray(t))return new Set;let r=new Set;for(let o of t)typeof o=="string"&&o!==""&&o!==ge&&r.add(o);return r}catch{return new Set}}function Ro(e,n){if(e!==void 0)try{e.setItem(At,JSON.stringify([...n].sort()))}catch{}}function Eo(e,n){let t=[],r=new Set;for(let o of e){let i=o.options.id;i===void 0||i===ge||r.has(i)||(r.add(i),t.push({id:i,label:Pt(o.options.label,i),enabled:!n.has(i)}))}return t}function To(e){let n=[],t=new Set;for(let r of e){let o=r.options.id;o===void 0||o===ge||t.has(o)||(t.add(o),n.push({id:o,label:Pt(r.options.label,o)}))}return n}function Ao(e,n,t){let r=new Set;for(let o of To(e)){if(!n.has(o.id)||o.label==="")continue;t.filter(s=>s.label===o.label).length===1&&r.add(o.label)}return t.map(o=>r.has(o.label))}function Po(e,n){for(let t of e)if(n!==null&&(t.target===n||n.contains?.(t.target)===!0)||Et(t.addedNodes,n)||Et(t.removedNodes,n))return!0;return!1}function Et(e,n){if(e===void 0)return!1;for(let t=0;t<e.length;t+=1){let r=e[t];if(r!==void 0&&(r.matches?.(te)===!0||r.querySelector?.(te)!=null||n!==null&&r.contains?.(n)===!0))return!0}return!1}function Oo(e){let n=e.querySelector(te);if(n===null||typeof n!="object")return;let r=n.querySelectorAll?.(":scope > button[role='tab']");if(r===void 0)return;let o=[];for(let i=0;i<r.length;i+=1){let s=r[i];s!==void 0&&o.push({label:Io(s),hidden:s.hasAttribute(fe),mark:d=>{d?s.setAttribute(fe,""):s.removeAttribute(fe)}})}return o}function Io(e){return(e.querySelector?.("[class*='tabLabel']")?.textContent??e.textContent??"").trim()}function No(e,n){let t=!1;for(let[r,o]of e.entries()){let i=n[r]??!1;i!==o.hidden&&(o.mark(i),t=!0)}return t}function Ot(e){let{ledger:n,storage:t}=e,r=e.readButtons??Oo,o=e.watch??_o,i=new Set(Lo(t)),s=new Set,d,c=()=>{for(let a of[...s])a()},l=30;return{rows:()=>Eo(n.entriesOfSlot(De),i),setEnabled(a,u){if(a===ge)return!1;let p=i.has(a);return u===!p?!1:(u?i.delete(a):i.add(a),Ro(t,i),d?.(),c(),!0)},subscribe(a){return s.add(a),()=>{s.delete(a)}},attach(a){let u=a.createElement("style");u.dataset.plugin="dsh-better",u.dataset.pluginCss=Mo,u.textContent=Do,a.head.append(u);let p=a.defaultView?.requestAnimationFrame?.bind(a.defaultView),f=a.defaultView?.cancelAnimationFrame?.bind(a.defaultView),m=p===void 0?0:l,y,g=()=>{let E=n.entriesOfSlot(De),C=r(a);if(C===void 0||C.length===0){m>0&&p!==void 0&&(m-=1,y=p(()=>g()));return}m=l,y=void 0,No(C,Ao(E,i,C))},S=n.subscribe(De,g),L=o(a,g);return d=g,g(),()=>{S(),L(),d=void 0,y!==void 0&&f?.(y),u.remove()}}}}var Mo="dsh-better/strip.css",fe="data-dsh-better-tab-hidden",Do=`${te} > button[${fe}] { display: none; }`;function _o(e,n){let t=e.defaultView?.MutationObserver,r=e.documentElement;if(t===void 0||r===void 0)return()=>{};let o=new t(i=>{let s=e.querySelector(te);Po(i,s!==null&&typeof s=="object"?s:null)&&n()});return o.observe(r,{childList:!0,subtree:!0}),()=>o.disconnect()}var G="conversation.input.overlay",It="settings.section",zo="aliases",Ho=56,Uo="alias-watcher",Mt=50,$o="skill-enhancer",jo=Mt+1,Fe="conversation.input.model",Be="conversation.input.attachments",qo=-50,Vo=-60,Dt="command-popup",Go=-100,F="better",Ko="/better/api/skill-profile",Yo=5e3,me=null;function _t(e,n){let t,r=Number.POSITIVE_INFINITY;for(let o of e){if(o.options.id!==Dt)continue;let i=o.component;if(typeof i!="function"||n!==void 0&&i===n)continue;let s=o.options.priority??0;s<r&&(t=i,r=s)}return t}var Ft={name:"dsh-better",inject:["slots","sessions","commandUi","conversation","locale","modelDirectories","remote","remote.session"],apply(e){let n=globalThis.document;e.effect(()=>e.locale.register(F,jn),"dsh-better: locale"),e.effect(()=>Vn(n),"dsh-better: effort badge stylesheet"),e.effect(()=>dt(n),"dsh-better: compaction count stylesheet"),e.effect(()=>yt(n),"dsh-better: continue button stylesheet");let t=$e(ze()),r=si(e),o={open:!1};e.effect(()=>{let l=ze(),a=ue(l);e.inject?.(["layout"],f=>{ot(f,a)});let p=(n===void 0?void 0:it({document:n,storage:l}))?.attach();return()=>{p?.()}},"dsh-better: panel width memory"),e.effect(()=>e.slots.inject(Ae,()=>e.slots.register({name:Ae,id:ct,order:-1,locale:F},lt)),"dsh-better: compaction count"),e.effect(()=>e.slots.inject(Pe,()=>We(e.slots,{name:Pe,id:ft,order:20,locale:F,inject:l=>({submitContinue:a=>bt(e,a)})},ht)),"dsh-better: continue button"),e.effect(()=>e.slots.inject(G,()=>{let l={},u=On({load:me,native:()=>_t(e.slots.entries(G),l.component),document:n});return l.component=u,e.slots.register({name:G,id:Dt,priority:Go,locale:F,inject:p=>{let f=ni(e,p);return{popup:ei(e,p),catalog:f?.groups,current:f?.current??null,selectModel:m=>e.modelDirectories?.directoryFor?.(p)?.select?.(m)}}},u)}),"dsh-better: /model provider search"),e.effect(()=>e.slots.inject(Fe,()=>{let l={},u=St({load:me,native:()=>He(e.slots.entries(Fe),l.component),openPicker:p=>Zo(e,p),translate:()=>Qo(e),document:n});return l.component=u,e.slots.register({name:Fe,priority:qo,locale:F,inject:p=>{let f=e.modelDirectories?.directoryFor?.(p),m=e.locale.resolveText;return{sessionId:p,available:!0,directory:f?.store,load:()=>{f?.load?.()},select:y=>f?.select?.(y),resolveText:y=>pe(m?.bind(e.locale),y),renderSlot:(y,g,S)=>S?.fallback??null}}},u)}),"dsh-better: composer model trigger");let i;e.inject?.(["remote.workspaceFiles"],l=>{i=l["remote.workspaceFiles"],l.effect(()=>()=>{i=void 0},"dsh-better: workspace file reader")}),e.effect(()=>e.slots.inject(Be,()=>{let l={},u=Bn({native:()=>He(e.slots.entries(Be),l.component),pathOf:ti,reader:()=>i,translate:()=>e.locale.bind?.(F)});return l.component=u,e.slots.register({name:Be,priority:Vo,locale:F,inject:p=>({sessionId:p,readFileDrag:Jo(e),phase:()=>Xo(e,p)?.getSnapshot().phase})},u)}),"dsh-better: composer attachment selection");let s;e.inject?.(["inputTriggers"],l=>{s=l.inputTriggers,l.effect(()=>()=>{s=void 0},"dsh-better: alias trigger service"),l.effect(()=>l.inputTriggers.registerSource(Qe({config:()=>t.getSnapshot(),translate:r,bareMenuOpen:()=>o.open,routeCommand:(a,u)=>ai(e,u)})),"dsh-better: alias slash source")}),e.effect(()=>e.slots.inject(G,()=>{let l=on({store:t,bareMenuOpen:o,inputStoreFor:a=>{let u=e.sessions.scope?.(a);if(!(u===void 0||e.conversation===void 0))try{return e.conversation.input?.for?.(u)?.state}catch{return}},controllerFor:a=>{let u=e.sessions.scope?.(a);if(u===void 0)return;let p=re(e,"inputTriggers")??s;if(p!==void 0)try{return p.sessionOf(u)}catch{return}}});return We(e.slots,{name:G,id:Uo,order:Mt,inject:a=>({sessionId:a})},l)}),"dsh-better: alias selector watcher"),e.effect(()=>hn(n),"dsh-better: skill enhancer stylesheet");let d=ri(e);e.effect(()=>e.slots.inject(G,()=>{let l=mn({scopeFor:a=>e.sessions.scope?.(a),inputStoreFor:a=>{let u=e.sessions.scope?.(a);if(!(u===void 0||e.conversation===void 0))try{return e.conversation.input?.for?.(u)?.state}catch{return}},actionsFor:a=>{let u=e.sessions.scope?.(a);if(!(u===void 0||e.conversation===void 0))try{return e.conversation.input?.for?.(u)}catch{return}},skillNamesFor:d.names,loadProfile:async(a,u)=>oi(e,a,u,await d.pathOf(a,u)),loadUsage:(a,u)=>Bt(e,a,u),translate:r,document:n});return We(e.slots,{name:G,id:$o,order:jo,inject:a=>({sessionId:a})},l)}),"dsh-better: skill enhancer"),e.effect(()=>e.slots.inject(It,()=>{let l=n===void 0?void 0:nn(n),a=Ze({store:t,translate:r}),u=Nt(e.slots,{name:It,id:zo,order:Ho,label:()=>e.locale.bind?.(F)?.("alias.nav")??"Skill aliases",locale:F},a);return()=>{u(),l?.()}}),"dsh-better: alias settings page");let c=Ot({ledger:ii(e.slots),storage:ze()});e.effect(()=>e.slots.inject(_e,()=>{let l=globalThis.document,a=l===void 0?void 0:Lt(l),u=Nt(e.slots,{name:_e,id:Tt,order:55,label:()=>e.locale.bind?.(F)?.("tabs.nav")??"Tabs"},()=>{let p=di(me);return p===null?null:Rt({React:p,controller:c,copy:li(e)})});return()=>{u(),a?.()}}),"dsh-better: tab management"),e.effect(()=>c.attach(n),"dsh-better: tab visibility"),e.inject?.(["shortcuts"],l=>{l.effect(()=>$n(l.shortcuts,{currentSessionId:()=>Hn(e),composerMounted:()=>zn(n),focusComposer:a=>Un(e,a)},()=>e.locale.bind?.(F)?.(ee)??"Focus message input",a=>console.warn(`dsh-better: focus command not registered (${a})`)),"dsh-better: focus composer shortcut")})}};function Jo(e){return n=>re(e,"fileDrag")?.read?.(n)}function Xo(e,n){if(n===void 0)return;let t=e.sessions.scope?.(n);if(!(t===void 0||e.conversation===void 0))try{return e.conversation.input?.for?.(t)?.state}catch{return}}function He(e,n){let t,r=Number.POSITIVE_INFINITY;for(let o of e){let i=o.component;if(typeof i!="function"||n!==void 0&&i===n)continue;let s=o.options.priority??0;s<r&&(t=i,r=s)}return t}function Zo(e,n){if(n===void 0)return!1;let t=wt(e.commandUi);if(t===void 0)return!1;let r=e.sessions.scope?.(n);if(r===void 0)return!1;let o=e.commandUi.popupFor?.(r);return o===void 0||typeof o.open!="function"?!1:(o.open("model",t,xt(n),vt()),!0)}function Qo(e){return e.locale?.bind?.(F)}function ei(e,n){let t=e.sessions.scope?.(n);if(t!==void 0)return e.commandUi.popupFor?.(t)}function ni(e,n){return e.modelDirectories?.directoryFor?.(n)?.store.getSnapshot()}function ti(e){let n=globalThis.__DSH_HOST_PATHS__;if(n?.pathFor===void 0)return"";try{let t=n.pathFor(e);return typeof t=="string"?t:""}catch{return""}}function Nt(e,n,t){return(e.registerUntyped??e.register).call(e,n,t)}function We(e,n,t){return(e.registerUntyped??e.register).call(e,n,t)}function ri(e){let n=new Map,t=new Map,r=async o=>{let i=n.get(o);if(i!==void 0)return i;let s=t.get(o);if(s!==void 0&&Date.now()-s<Yo)return;let d=re(e,"remote.skills");if(d!==void 0)try{let c=await d.list({sessionId:o});if(!c.ok){t.set(o,Date.now());return}let l=new Map(c.value.skills.map(a=>[a.name,a]));return n.set(o,l),t.delete(o),l}catch{t.set(o,Date.now());return}};return{names:async o=>new Set((await r(o))?.keys()??[]),pathOf:async(o,i)=>(await r(o))?.get(i)?.path}}async function oi(e,n,t,r){let o=`?sessionId=${encodeURIComponent(n)}&name=${encodeURIComponent(t)}`+(r===void 0?"":`&path=${encodeURIComponent(r)}`);try{let i=await fetch(`${Ko}${o}`,{headers:{accept:"application/json"}});return i.ok?await i.json():void 0}catch{return}}function Bt(e,n,t){let r=e.sessions.list??re(e,"sessions.list");try{let o=r?.getSnapshot?.(),i=u=>{let f=o?.projectionsBySession?.[u]?.values?.skillUsage;if(typeof f!="object"||f===null)return;let m=f.counts;return typeof m=="object"&&m!==null?m:void 0},s=i(n)?.[t],d=typeof s=="number"&&Number.isFinite(s)?s:0,c=o?.byId?.[n]?.cwd;if(typeof c!="string"||c==="")return{session:d};let l=Object.keys(o?.byId??{}).map(u=>{let p=i(u),f=o?.byId?.[u]?.cwd;return{...typeof f=="string"?{cwd:f}:{},...p===void 0?{}:{usage:p}}}),a=bn(l,c,t);return a===void 0?{session:d}:{session:d,workspace:a}}catch{return{session:0}}}function ii(e){return{entriesOfSlot:n=>(e.entriesOfSlot??e.entries).call(e,n),subscribe:(n,t)=>e.subscribe?.(n,t)??(()=>{})}}function ze(){try{return globalThis.localStorage}catch{return}}function re(e,n){try{return typeof e.get=="function"?e.get(n):e[n]}catch{return}}function ai(e,n){let t=n.session?.sessionId;if(t===void 0)return;let r=e.sessions.scope?.(t);if(r===void 0)return;let o=re(e,"inputTriggers");if(o!==void 0)try{let i=o.sessionOf(r),s=e.conversation?.input?.for?.(r)?.state,d=0,c=()=>{let l=s?.getSnapshot();if(!(l===void 0||l.draft.trim()===""||!l.draft.startsWith("/"))){try{let a=l.draft.trimStart().split(/\s/u)[0]??"";if(!a.startsWith("/")||(i.track?.(a,a.length,{tier:"plain"},l.draftRev),i.onSpace?.()===!0))return;i.dismiss?.()}catch{}d+=1,d<4&&setTimeout(c,25)}};setTimeout(c,0)}catch{}}function si(e){return(n,t)=>{try{return e.locale.bind?.(F)?.(n,t)??n}catch{return n}}}function di(e){if(e===null)return null;try{let n=e("react");if(typeof n!="object"||n===null)return null;let t=n;return typeof t.createElement=="function"?t:null}catch{return null}}function li(e){let n=e.locale.bind?.(F),t=(r,o)=>n?.(r)??o;return{heading:t("tabs.heading","Tabs"),empty:t("tabs.empty","No plugin has registered a conversation tab yet."),checkboxLabel:(r,o)=>t(o?"tabs.hide":"tabs.show","{label}").replace("{label}",r)}}function ui(e){me=e}var ci=Ft;

    // Hand the loader's `require` to the module's `boot` export before the
    // plugin mounts. Read from `module.exports` rather than the default export:
    // esbuild emits named exports there and the plugin object separately, so the
    // default export alone never carries `boot`.
    if (typeof module.exports.boot === "function") module.exports.boot(require);
    return module.exports.default ?? module.exports;
  }
});
