window.__ModuleLoader__.load({
  id: "dsh-better",
  factory: (require) => {
    var module = { exports: {} };
    var exports = module.exports;
"use strict";var pe=Object.defineProperty;var wt=Object.getOwnPropertyDescriptor;var vt=Object.getOwnPropertyNames;var xt=Object.prototype.hasOwnProperty;var Ct=(e,n)=>{for(var t in n)pe(e,t,{get:n[t],enumerable:!0})},Lt=(e,n,t,r)=>{if(n&&typeof n=="object"||typeof n=="function")for(let o of vt(n))!xt.call(e,o)&&o!==t&&pe(e,o,{get:()=>n[o],enumerable:!(r=wt(n,o))||r.enumerable});return e};var Rt=e=>Lt(pe({},"__esModule",{value:!0}),e);var No={};Ct(No,{boot:()=>Oo,clientPlugin:()=>bt,default:()=>Io,findShadowed:()=>ht,findShadowedSingle:()=>Te,readSkillUsage:()=>kt});module.exports=Rt(No);var ne=require("react");var Pe="dsh-better.skill-aliases";var G=Object.freeze({prefix:!0,rows:Object.freeze([])});function At(e,n){if(e!==void 0)try{e.setItem(Pe,JSON.stringify({v:1,prefix:n.prefix,rows:n.rows}))}catch{}}function ee(e,n){return typeof e=="string"?e:n}function Et(e,n){if(typeof e!="object"||e===null||Array.isArray(e))return;let t=e;if(!(typeof t.keyword!="string"&&typeof t.target!="string"&&typeof t.params!="string"))return{id:ee(t.id,`alias-${n}`)||`alias-${n}`,keyword:ee(t.keyword,""),target:ee(t.target,""),params:ee(t.params,"")}}function Tt(e){if(typeof e!="object"||e===null||Array.isArray(e))return G;let n=e,t=typeof n.prefix=="boolean"?n.prefix:G.prefix,r=Array.isArray(n.rows)?n.rows:[],o=[],i=new Set;for(let[a,d]of r.slice(0,200).entries()){let u=Et(d,a);if(u===void 0)continue;let l=u.id,s=0;for(;i.has(l);)s+=1,l=`alias-${a}-${s}`;i.add(l),o.push({...u,id:l})}return{prefix:t,rows:o}}function Pt(e){if(e===void 0)return G;let n;try{n=e.getItem(Pe)}catch{return G}if(n===null||n==="")return G;try{return Tt(JSON.parse(n))}catch{return G}}function Ot(){let e=globalThis.crypto;return e?.randomUUID!==void 0?e.randomUUID():`alias-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,8)}`}function Oe(e,n=Ot){let t=Pt(e),r=new Set,o=i=>{t=i;for(let a of[...r])try{a()}catch(d){console.error("[dsh-better] alias store listener failed:",d)}At(e,i)};return{getSnapshot:()=>t,subscribe(i){return r.add(i),()=>{r.delete(i)}},setPrefix(i){t.prefix!==i&&o({...t,prefix:i})},addRow(){let i=n();return o({...t,rows:[...t.rows,{id:i,keyword:"",target:"",params:""}]}),i},updateRow(i,a){let d=!1,u=t.rows.map(l=>{if(l.id!==i)return l;let s={...l,...a,id:l.id};return d=s.keyword!==l.keyword||s.target!==l.target||s.params!==l.params,s});d&&o({...t,rows:u})},removeRow(i){let a=t.rows.filter(d=>d.id!==i);a.length!==t.rows.length&&o({...t,rows:a})}}}function Ie(e){return e.keyword.trim()!==""&&e.target.trim()!==""}function Ne(e){return e.keyword.trim().replace(/^\/+/,"").toLowerCase()}function Me(e,n){let t=n.trim().replace(/^\/+/,"").toLowerCase();return t===""?[]:e.rows.filter(r=>Ie(r)&&Ne(r)===t)}function De(e,n,t=!1){let r=n.trim().replace(/^\/+/,"").toLowerCase(),o=e.rows.filter(Ie);if(r==="")return t?o:[];let i=[],a=[],d=[];for(let u of o){let l=Ne(u);l===r?i.push(u):l.startsWith(r)?a.push(u):l.includes(r)&&d.push(u)}return[...i,...a,...d]}function _e(e){let n=e.target.trim().replace(/^\/+/,"");if(n==="")return"";let t=e.params.trim();return t===""?`/${n} `:`/${n} ${t} `}function Fe(e,n){let t=/^\/([^\s/]+)([ \t]*)$/u.exec(n);if(t===null)return;let r=t[1]??"",o=Me(e,r);if(o.length!==0)return{query:r,start:0,end:n.length,rows:o}}function We(e,n){let t=/^([^\s/]+)([ \t]*)$/u.exec(n);if(t===null)return;let r=t[1]??"",o=Me(e,r);if(o.length!==0)return{query:r,start:0,end:n.length,rows:o}}function Be(e){if(e.keyword.trim()==="")return"keyword";if(e.target.trim()==="")return"target";if(/\s/.test(e.keyword.trim()))return"keyword"}var w=require("react/jsx-runtime");function It(e){let{row:n,store:t,t:r}=e,o=Be(n);return(0,w.jsxs)("tr",{"data-testid":"alias-row","data-row-id":n.id,"data-incomplete":o===void 0?void 0:"",children:[(0,w.jsx)("td",{children:(0,w.jsx)("input",{className:"dsh-better-alias-input","data-testid":"alias-keyword",value:n.keyword,placeholder:"wf",spellCheck:!1,autoComplete:"off","aria-label":r("alias.table.keyword"),ref:i=>{i!==null&&e.focus&&(i.focus(),e.clearFocus())},onChange:i=>t.updateRow(n.id,{keyword:i.target.value})})}),(0,w.jsx)("td",{children:(0,w.jsx)("input",{className:"dsh-better-alias-input","data-testid":"alias-target",value:n.target,placeholder:"flow-workflow",spellCheck:!1,autoComplete:"off","aria-label":r("alias.table.target"),onChange:i=>t.updateRow(n.id,{target:i.target.value})})}),(0,w.jsx)("td",{children:(0,w.jsx)("input",{className:"dsh-better-alias-input","data-testid":"alias-params",value:n.params,placeholder:r("alias.table.paramsPlaceholder"),spellCheck:!1,autoComplete:"off","aria-label":r("alias.table.params"),onChange:i=>t.updateRow(n.id,{params:i.target.value})})}),(0,w.jsx)("td",{className:"dsh-better-alias-actions",children:(0,w.jsx)("button",{type:"button",className:"dsh-better-alias-delete","data-testid":"alias-remove","aria-label":r("alias.remove",{keyword:n.keyword.trim()||r("alias.unnamed")}),title:r("alias.remove",{keyword:n.keyword.trim()||r("alias.unnamed")}),onClick:()=>t.removeRow(n.id),children:"\xD7"})})]})}function He(e){function n(){let t=(0,ne.useSyncExternalStore)(e.store.subscribe,e.store.getSnapshot,e.store.getSnapshot),{translate:r}=e,o=(0,ne.useRef)(null),i=()=>{o.current=e.store.addRow()};return(0,w.jsxs)("section",{className:"dsh-better-alias-page","data-testid":"alias-page",children:[(0,w.jsx)("h2",{className:"dsh-better-alias-heading",children:r("alias.heading")}),(0,w.jsxs)("label",{className:"dsh-better-alias-prefix",children:[(0,w.jsxs)("span",{children:[(0,w.jsx)("span",{className:"dsh-better-alias-prefix-title",children:r("alias.prefix.title")}),(0,w.jsx)("span",{className:"dsh-better-alias-prefix-hint",children:r(t.prefix?"alias.prefix.on":"alias.prefix.off")})]}),(0,w.jsx)("input",{type:"checkbox","data-testid":"alias-prefix",checked:t.prefix,"aria-label":r("alias.prefix.title"),onChange:a=>e.store.setPrefix(a.target.checked)})]}),(0,w.jsxs)("div",{className:"dsh-better-alias-table-wrap",children:[(0,w.jsxs)("table",{className:"dsh-better-alias-table",children:[(0,w.jsx)("thead",{children:(0,w.jsxs)("tr",{children:[(0,w.jsx)("th",{scope:"col",children:r("alias.table.keyword")}),(0,w.jsx)("th",{scope:"col",children:r("alias.table.target")}),(0,w.jsx)("th",{scope:"col",children:r("alias.table.params")}),(0,w.jsx)("th",{scope:"col","aria-label":r("alias.table.actions")})]})}),(0,w.jsx)("tbody",{children:t.rows.map(a=>(0,w.jsx)(It,{row:a,store:e.store,t:r,focus:o.current===a.id,clearFocus:()=>{o.current=null}},a.id))})]}),t.rows.length===0?(0,w.jsx)("p",{className:"dsh-better-alias-empty","data-testid":"alias-empty",children:r("alias.empty")}):null]}),(0,w.jsx)("button",{type:"button",className:"dsh-better-alias-add","data-testid":"alias-add",onClick:i,children:r("alias.add")}),(0,w.jsx)("p",{className:"dsh-better-alias-footnote",children:r("alias.footnote")})]})}return n}var fe="alias",Nt="/",Mt=-1;function Dt(e,n){let t=e.target.trim().replace(/^\/+/,""),r=e.keyword.trim(),o=e.params.trim();return{name:t,label:r,...o===""?{}:{description:n("alias.menu.params",{value:o})},section:n("alias.menu.section"),value:e.id}}function je(e){return{trigger:Nt,name:fe,order:Mt,async candidates(n,t){if(t.position!=="leading")return[];let r=e.config();return!r.prefix&&e.bareMenuOpen?.()!==!0?[]:De(r,t.query,!0).map(o=>Dt(o,e.translate))},onPick(n){let t=e.config().rows.find(i=>i.id===n.candidate.value);if(t===void 0)return;let r=t.target.trim().replace(/^\/+/,"");r!==""&&e.routeCommand?.(r,n);let o=_e(t);return o===""?void 0:{text:o}}}}var $e="dsh-better/aliases.css",_t=`
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
`;function ze(e){let n=`style[data-plugin-css=${JSON.stringify($e)}]`;if(e.querySelector(n)!==null)return()=>{};let t=e.createElement("style");return t.dataset.plugin="dsh-better",t.dataset.pluginCss=$e,t.textContent=_t,e.head.append(t),()=>t.remove()}var q=require("react");var Ue={draft:"",draftRev:-1,phase:"plain"};function Ve(e){return function(t){let r=(0,q.useSyncExternalStore)(e.store.subscribe,e.store.getSnapshot,e.store.getSnapshot),o=t.sessionId===void 0?void 0:e.inputStoreFor(t.sessionId),i=t.sessionId===void 0?void 0:e.controllerFor(t.sessionId),a=(0,q.useSyncExternalStore)(u=>o===void 0?()=>{}:o.subscribe(u),()=>o===void 0?Ue:o.getSnapshot(),()=>o===void 0?Ue:o.getSnapshot()),d=(0,q.useRef)(null);return(0,q.useEffect)(()=>{let u=t.sessionId;if(u===void 0||a.phase!=="plain"||i===void 0)return;let l=i.menu.getSnapshot().open;if(l&&d.current===null)return;let s=ge(r,a.draft);if(l){let g=d.current;if(g!==null&&(g.draftRev!==a.draftRev||g.spanEnd!==(s?.end??-1))){let p=setTimeout(()=>{let f=o?.getSnapshot()??a,y=e.controllerFor(u);if(y===void 0||f.phase!=="plain")return;d.current=null,y.dismiss();let m=ge(e.store.getSnapshot(),f.draft);m!==void 0&&(e.bareMenuOpen.open=!0,qe(y,m,f.draftRev),e.bareMenuOpen.open=!1,d.current={draftRev:f.draftRev,spanEnd:m.end})},80);return()=>clearTimeout(p)}return}if(d.current=null,s===void 0)return;let c=setTimeout(()=>{let g=o?.getSnapshot()??a,p=e.controllerFor(u);if(p===void 0||g.phase!=="plain"||p.menu.getSnapshot().open)return;let f=ge(e.store.getSnapshot(),g.draft);f!==void 0&&(e.bareMenuOpen.open=!0,qe(p,f,g.draftRev),e.bareMenuOpen.open=!1,d.current={draftRev:g.draftRev,spanEnd:f.end})},80);return()=>clearTimeout(c)},[r,a.draft,a.draftRev,a.phase,i,o,t.sessionId]),null}}function ge(e,n){return e.prefix?Fe(e,n):We(e,n)}function qe(e,n,t){e.toggleSource(fe,{trigger:"/",query:n.query,quoted:!1,position:"leading",span:{start:n.start,end:n.end,draftRev:t}})}var R=require("react");var Ft="[a-z0-9]+(?:-[a-z0-9]+)*",Wt=new RegExp(`^/(${Ft})(?=\\s|$)`,"u");function Ge(e,n){let t=Wt.exec(e);if(t===null)return;let r=t[1]??"";if(n(r))return{name:r,start:0,end:1+r.length}}function Ke(e,n,t){return e===void 0||!Number.isInteger(t)||t<e.end||t>n.length||t!==n.length?!1:/^[ \t]*$/u.test(n.slice(e.end,t))}var Bt=/^\/([a-z0-9]+(?:-[a-z0-9]+)*)[ \t]*$/u,Ht=400,Ye=200,Je=6,jt=240,Xe={draft:"",draftRev:-1,phase:"plain"};function $t(e,n){return`${e!==""&&!/\s$/u.test(e)?" ":""}${n} `}function en(e){return e===void 0?void 0:Bt.exec(e)?.[1]}function zt(e){return e===void 0?[]:e.split(`
`).map(n=>n.trim()).filter(n=>n!=="")}function Ze(e,n){let t=e.querySelectorAll("[data-composer-text-ref]");for(let r of t){if(en(r.textContent??"")!==n)continue;let o=r.getBoundingClientRect();return{left:o.left,right:o.right,top:o.top,bottom:o.bottom}}}function Ut(e){return e.defaultView?.innerWidth??0}function qt(e,n,t,r){let o=e.top-r,i=Number.isFinite(t)&&t>0?t:0;return i===0||i<=o?{left:e.left,top:0,anchor:"above"}:{left:e.left,top:e.bottom+r,anchor:"below"}}function Qe(e){return e.defaultView?.innerHeight??0}function nn(e){return function(t){let r=e.document??globalThis.document,o=t.sessionId,i=o===void 0?void 0:e.inputStoreFor(o),a=t.useInput,d=a===void 0?void 0:a(k=>k.draft),u=(0,R.useSyncExternalStore)(k=>i===void 0?()=>{}:i.subscribe(k),()=>i===void 0?Xe.draft:i.getSnapshot().draft,()=>i===void 0?Xe.draft:i.getSnapshot().draft),l=d??u,[s,c]=(0,R.useState)(()=>new Set),[g,p]=(0,R.useState)(void 0),[f,y]=(0,R.useState)(void 0),[m,S]=(0,R.useState)(void 0),[A,E]=(0,R.useState)(void 0);(0,R.useEffect)(()=>{if(o===void 0)return;let k=!0;return e.skillNamesFor(o).then(x=>{k&&c(x)},()=>{k&&c(new Set)}),()=>{k=!1}},[o]);let I=Ge(l,k=>s.has(k)),N=Ke(I,l,l.length)?I?.name:void 0,$=N??f;(0,R.useEffect)(()=>{if(o===void 0||$===void 0){p(void 0);return}let k=!0;return e.loadProfile(o,$).then(x=>{k&&p(x)},()=>{k&&p(void 0)}),()=>{k=!1}},[o,$]),(0,R.useEffect)(()=>{if(r===void 0||N===void 0){S(void 0);return}let k=()=>S(Ze(r,N));k();let x=r.defaultView;return x?.addEventListener("resize",k),()=>x?.removeEventListener("resize",k)},[r,N,l]);let _=(0,R.useRef)(null),F=(0,R.useRef)(null),b=()=>{_.current!==null&&clearTimeout(_.current),_.current=null},C=()=>{F.current!==null&&clearTimeout(F.current),F.current=null};(0,R.useEffect)(()=>{if(r===void 0||o===void 0)return;let k=T=>{let B=T.target;if(!(B instanceof r.defaultView.Element))return;let J=B.closest("[data-composer-text-ref]");if(J===null)return;let U=en(J.textContent??"");U!==void 0&&(C(),b(),_.current=setTimeout(()=>{_.current=null,y(U),S(Ze(r,U)),E(e.loadUsage(o,U))},Ht))},x=T=>{let B=T.target;B instanceof r.defaultView.Element&&B.closest("[data-composer-text-ref]")!==null&&(b(),C(),F.current=setTimeout(()=>{F.current=null,y(void 0)},Ye))};return r.addEventListener("pointerover",k,!0),r.addEventListener("pointerout",x,!0),()=>{b(),C(),r.removeEventListener("pointerover",k,!0),r.removeEventListener("pointerout",x,!0)}},[r,o]),(0,R.useEffect)(()=>{if(r===void 0||f===void 0)return;let k=x=>{x.key==="Escape"&&y(void 0)};return r.addEventListener("keydown",k),()=>r.removeEventListener("keydown",k)},[r,f]);let M=(0,R.useRef)(l);M.current=l;let W=(0,R.useRef)(void 0);return W.current=t.inputActions??(o===void 0?void 0:e.actionsFor(o)),(0,R.useEffect)(()=>{if(r===void 0||N===void 0||m===void 0)return;let k=zt(g?.argumentHint);if(k.length===0)return;let x=Vt(r,m,k);return r.body.append(x),()=>x.remove()},[r,N,m,g]),(0,R.useEffect)(()=>{if(r===void 0||f===void 0)return;let k=Gt(r,e,{name:f,profile:g,usage:A,box:m,sessionId:o,getActions:()=>W.current,getDraft:()=>M.current,onEnter:C,onLeave:()=>{b(),C(),F.current=setTimeout(()=>{F.current=null,y(void 0)},Ye)}});return r.body.append(k),()=>k.remove()},[r,f,g,A,m,o]),null}}function Vt(e,n,t){let r=e.createElement("div");r.className="dsh-better-skill-hint",r.textContent=t.join(`
`);let o=n.right+Je>Ut(e)-jt;return r.style.left=`${o?n.left:n.right+Je}px`,r.style.top=`${o?n.bottom+2:n.top}px`,r}function Gt(e,n,t){let r=e.createElement("div");r.className="dsh-better-skill-panel",r.addEventListener("pointerenter",t.onEnter),r.addEventListener("pointerleave",t.onLeave);let o=e.createElement("div");o.className="dsh-better-skill-panel-title",o.textContent=`/${t.name}`,r.append(o);let i=t.profile?.metadata??{},a=Object.keys(i);if(a.length>0){let l=e.createElement("div");l.className="dsh-better-skill-panel-section",l.append(me(e,n.translate("skill.metadata")));for(let s of a){let c=e.createElement("div");c.textContent=`${s}: ${i[s]??""}`,l.append(c)}r.append(l)}let d=t.profile?.path;if(d!==void 0&&d!==""){r.append(me(e,n.translate("skill.path")));let l=e.createElement("div");l.className="dsh-better-skill-panel-path",l.textContent=d,r.append(l)}if(t.usage!==void 0){let l=e.createElement("div");l.className="dsh-better-skill-panel-counts",l.textContent=`${n.translate("skill.usage.session")} ${t.usage.session}`,t.usage.workspace!==void 0&&(l.textContent+=` \xB7 ${n.translate("skill.usage.workspace")} ${t.usage.workspace}`),r.append(l)}let u=t.profile?.params??[];if(u.length>0&&t.getActions()?.insertText!==void 0){r.append(me(e,n.translate("skill.params")));for(let l of u)r.append(Kt(e,n,t,l.flag,l.detail))}if(t.box!==void 0){let s=qt(t.box,Qe(e),r.offsetHeight,4);r.style.left=`${s.left}px`,s.anchor==="above"?(r.style.bottom=`${Qe(e)-t.box.top+4}px`,r.style.top=""):(r.style.top=`${s.top}px`,r.style.bottom="")}return r}function me(e,n){let t=e.createElement("div");return t.className="dsh-better-skill-panel-label",t.textContent=n,t}function Kt(e,n,t,r,o){let i=e.createElement("button");i.type="button",i.className="dsh-better-skill-panel-param",i.title=n.translate("skill.hint.insert"),i.addEventListener("pointerdown",d=>d.preventDefault());let a=e.createElement("span");if(a.className="dsh-better-skill-panel-param-flag",a.textContent=r,i.append(a),o!==""){let d=e.createElement("span");d.className="dsh-better-skill-panel-param-detail",d.textContent=o,i.append(d)}return i.addEventListener("click",()=>{let d=t.getActions();if(d?.insertText===void 0||d.captureInsertion===void 0)return;let u=d.captureInsertion();d.insertText($t(t.getDraft(),r),u)}),i}var tn="dsh-better/skill-enhancer.css",Yt=`
.dsh-better-skill-hint {
  position: absolute;
  z-index: 5;
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
  min-width: 240px;
  max-width: 380px;
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
`;function rn(e){if(e===void 0)return()=>{};let n=`style[data-plugin-css=${JSON.stringify(tn)}]`;if(e.querySelector(n)!==null)return()=>{};let t=e.createElement("style");return t.dataset.plugin="dsh-better",t.dataset.pluginCss=tn,t.textContent=Yt,e.head.append(t),()=>t.remove()}function on(e,n,t){if(n===void 0||n===""||e.length===0)return;let r=0;for(let o of e){if(o.cwd!==n)continue;let i=o.usage?.[t];typeof i=="number"&&Number.isFinite(i)&&(r+=i)}return r}var v=require("react");var Jt="@deepseek-ai/dsh-client-ui-commands/PopupSelectView.module.css";function an(e){if(e===void 0)return;let t=e.querySelector(`style[data-plugin-css="${Jt}"]`)?.textContent??"",r=i=>new RegExp(`\\.(\\w+_${i})\\{`,"u").exec(t)?.[1],o={badges:"dshBetter_badges",badgeChip:"dshBetter_badgeChip",badgeChipOn:"dshBetter_badgeChipOn",card:r("card"),viewport:r("viewport"),row:r("row"),rowActive:r("rowActive"),label:r("label"),labelText:r("labelText"),badge:r("badge"),detail:r("detail"),check:r("check"),status:r("status"),search:r("search"),error:r("error"),errorText:r("errorText"),retry:r("retry")};for(let[i,a]of Object.entries(o))if(!(i==="badges"||i==="badgeChip"||i==="badgeChipOn")&&a===void 0)return;return o}function ye(e,n){for(let t of e)if(t.id===n.provider){for(let r of t.models)if(r.id===n.model)return r.reasoning}}function sn(e,n){let t=ye(e,n)?.efforts;return t===void 0?[]:[...t]}function ln(e,n){if(e.length===0)return;let t=r=>r!==void 0&&e.some(o=>o.id===r);return t(n.remembered)?n.remembered:n.isCurrent&&t(n.currentEffort)?n.currentEffort:t(n.defaultEffort)?n.defaultEffort:e[0]?.id}function Xt(e){return e.length>1}function dn(e){return Xt(e)?e:[]}var j=require("react/jsx-runtime");function te(e){let n=e.group?.name;if(n===void 0)return;let t=`${n}/`,r=e.id.startsWith(t)?e.id.slice(t.length):e.id;return{provider:n,model:r}}function Zt(e,n){let t=te(e);return dn(t===void 0?[]:sn(n??[],t))}function un({option:e,active:n,catalog:t,pointed:r,classes:o,primitives:i,onChoose:a,onPickEffort:d,onHover:u,t:l}){let s=Zt(e,t),c=i.IconCheckOutlineRegular;return(0,j.jsxs)("div",{role:"option","aria-selected":n,"aria-label":e.badge===void 0?void 0:`${e.label} ${e.badge}`,className:n?`${o.row} ${o.rowActive}`:o.row,onClick:a,onMouseEnter:u,children:[(0,j.jsxs)("span",{className:o.label,children:[(0,j.jsx)("span",{className:o.labelText,children:e.label}),e.badge!==void 0&&(0,j.jsx)("sup",{className:o.badge,children:e.badge})]}),e.detail!==void 0&&(0,j.jsx)("span",{className:o.detail,children:e.detail}),s.length>0&&(0,j.jsx)("span",{className:o.badges,role:"group","aria-label":l?.("listbox.aria")??"",children:s.map(g=>(0,j.jsx)("button",{type:"button",className:g.id===r?`${o.badgeChip} ${o.badgeChipOn}`:o.badgeChip,title:g.description??g.name,onClick:p=>{p.stopPropagation(),d(g.id)},children:g.name},g.id))}),e.active===!0&&s.length===0&&(0,j.jsx)("span",{className:o.check,children:c===void 0?null:(0,j.jsx)(c,{})})]})}function re(e){let n=new Map;for(let t of e){let r=t.group?.name,o=n.get(r);o!==void 0?o.rows.push(t):n.set(r,{group:t.group,rows:[t]})}return[...n.values()]}function oe(e){let n=re(e);return n.some(t=>t.group!==void 0)?n.flatMap(t=>t.rows):[...e]}function cn(e,n,t){return t===void 0?e.filter(r=>r.label.toLowerCase().includes(n)):re(e).flatMap(r=>t(r.rows.map(o=>({name:o.label,option:o})),n).map(o=>o.option))}var he=new WeakSet;async function pn(e,n){let t=e.binding,r=e.state.getSnapshot();if(!(t===null||r.submitting||he.has(e))){he.add(e),e.state.set?.({...r,submitting:!0,confirming:null,acknowledged:!1,error:null});try{let o=n();if(o===void 0)return;await o,t!==null&&e.binding===t&&e.deps?.consume?.(t.segment)}finally{he.delete(e),t!==null&&e.binding===t&&e.dismiss({focusComposer:!0})}}}var Qt="@deepseek-ai/dsh-client-ui-primitives";function ie(e){if(e===null)return{};let n;try{n=e(Qt)}catch{return{}}if(n===null||typeof n!="object")return{};let t=n,r=y=>typeof y=="function"||typeof y=="object"&&y!==null,o=y=>{let m=t[y];return r(m)?m:void 0},i=y=>{let m=t[y];return typeof m=="function"?m:void 0},a={},d=o("MenuSurface");d!==void 0&&(a.MenuSurface=d);let u=o("MenuGroup");u!==void 0&&(a.MenuGroup=u);let l=o("IconCheckOutlineRegular");l!==void 0&&(a.IconCheckOutlineRegular=l);let s=o("IconDataOutlineRegular");s!==void 0&&(a.IconDataOutlineRegular=s);let c=o("IconChevronDownOutlineRegular");c!==void 0&&(a.IconChevronDownOutlineRegular=c);let g=i("useAnchoredMaxHeight");g!==void 0&&(a.useAnchoredMaxHeight=g);let p=i("observeStickyMenuGroups");p!==void 0&&(a.observeStickyMenuGroups=p);let f=i("rankByName");return f!==void 0&&(a.rankByName=f),a}function er(e){if(e===void 0)return[];let n=[e.name,e.label].map(t=>t.trim().toLowerCase()).filter(t=>t!=="");return[...new Set(n)]}function nr(e,n){return er(e.group).some(t=>t.includes(n))}function tr(e,n,t,r){return t==="fuzzy-label"?cn(e,n,r):oe(e).filter(o=>o.label.toLowerCase().includes(n)||o.detail?.toLowerCase().includes(n)===!0)}function fn(e,n,t,r){let o=n.trim().toLowerCase();if(o==="")return oe(e);let i=tr(e,o,t,r),a=new Set(i),d=oe(e).filter(u=>!a.has(u)&&nr(u,o));return[...i,...d]}var P=require("react/jsx-runtime"),hn="model",gn=320;function rr(e){return e.command!==hn||!e.open||e.status!=="ready"||e.confirming!==null||e.options.length===0?!1:e.submitting||e.error===null}var or={subscribe:()=>()=>{},getSnapshot:()=>({open:!1,command:null,status:"pending",options:[],search:"",searchLabels:null,searchMode:"substring",active:0,submitting:!1,confirming:null,acknowledged:!1,error:null})};function bn(e){let n=ie(e.load);function t(r){let o=r.popup,i=o?.state??or,a=(0,v.useCallback)(s=>i.subscribe(s),[i]),d=(0,v.useCallback)(()=>i.getSnapshot(),[i]),u=(0,v.useSyncExternalStore)(a,d),l=e.native();return o===void 0||l===void 0?null:!rr(u)||o.settle===void 0?(0,P.jsx)(l,{...r}):(0,P.jsx)(ir,{popup:o,state:u,t:r.t,primitives:n,doc:e.document,catalog:r.catalog,current:r.current,selectModel:r.selectModel})}return t}function ir({popup:e,state:n,t,primitives:r,doc:o,catalog:i,current:a,selectModel:d}){let u=(0,v.useRef)(null),l=(0,v.useRef)(null),s=(0,v.useRef)(null),c=(0,v.useMemo)(()=>an(o),[o]),g=n.searchMode,p=(0,v.useMemo)(()=>fn(n.options,n.search,g,r.rankByName),[n.options,n.search,g,r.rankByName]),f=(0,v.useMemo)(()=>re(p),[p]),[y,m]=(0,v.useState)({}),[S,A]=(0,v.useState)(()=>mn(p));(0,v.useEffect)(()=>{A(mn(p))},[n.search,n.options]);let E=yn(p,S),I=ar(r,u,n);(0,v.useEffect)(()=>{let h=s.current;if(!(h===null||r.observeStickyMenuGroups===void 0))return r.observeStickyMenuGroups(h)},[r.observeStickyMenuGroups,n.open,n.status,f]),(0,v.useEffect)(()=>{u.current?.querySelector('[aria-selected="true"]')?.scrollIntoView({block:"nearest"})},[E,p]),(0,v.useEffect)(()=>{if(!n.open)return;let h=L=>{let O=u.current;O!==null&&L.target instanceof Node&&O.contains(L.target)||e.dismiss()};return o?.addEventListener("pointerdown",h,!0),()=>{o?.removeEventListener("pointerdown",h,!0)}},[o,e,n.open]),(0,v.useEffect)(()=>{l.current?.focus()},[n.open]);let N=(0,v.useCallback)((h,L)=>{if(L===void 0||d===void 0){e.settle?.(e.binding,h);return}let O=te(h);if(O===void 0){e.settle?.(e.binding,h);return}pn(e,()=>d({...O,reasoningEffort:L}))},[e,d]),$=(0,v.useCallback)(h=>{let L=te(h);if(L===void 0)return;let O=ye(i??[],L);return ln(O?.efforts??[],{remembered:y[h.id],isCurrent:a?.provider===L.provider&&a?.model===L.model,currentEffort:a?.reasoningEffort,defaultEffort:O?.defaultEffort})},[i,a,y]),_=(0,v.useCallback)(h=>{N(h,$(h))},[$,N]),F=(0,v.useCallback)((h,L)=>{m(O=>({...O,[h.id]:L})),N(h,L)},[N]),b=(0,v.useCallback)(()=>{let h=p[E];h!==void 0&&_(h)},[E,_,p]),C=(0,v.useCallback)(h=>{p.length!==0&&A(L=>(yn(p,L)+h+p.length)%p.length)},[p]),M=h=>{switch(h.key){case"ArrowDown":h.preventDefault(),C(1);return;case"ArrowUp":h.preventDefault(),C(-1);return;case"Enter":h.preventDefault(),b();return;case"Tab":if(!h.shiftKey&&p.length===0)return;h.preventDefault(),h.shiftKey?e.dismiss({focusComposer:!0}):b();return;case"Escape":h.preventDefault(),e.dismiss({focusComposer:!0});return;default:}};if(c===void 0)return null;let W=n.searchLabels?.placeholder??t?.("search.placeholder")??"",k=n.searchLabels===null?t?.("status.empty")??"":n.options.length===0?n.searchLabels.empty:n.searchLabels.noResults,x=(h,L)=>(0,P.jsx)(un,{option:h,active:L===E,catalog:i,pointed:L===E?$(h):void 0,classes:c,primitives:r,onChoose:()=>{_(h)},onPickEffort:O=>{F(h,O)},onHover:()=>{A(L)},t},h.id),T=0,B=f.map(({group:h,rows:L})=>{let O=L.map(St=>x(St,T++));return h===void 0?(0,P.jsx)(v.Fragment,{children:O},"ungrouped"):r.MenuGroup===void 0?(0,P.jsx)(v.Fragment,{children:O},`group:${h.name}`):(0,P.jsx)(r.MenuGroup,{label:h.label,children:O},`group:${h.name}`)}),J=(0,P.jsxs)(P.Fragment,{children:[(0,P.jsx)("input",{ref:l,className:c.search,type:"text",placeholder:W,"aria-label":t?.("search.aria")??"",value:n.search,readOnly:n.submitting,onChange:h=>{e.setSearch(h.currentTarget.value)}}),n.submitting&&(0,P.jsx)("div",{className:c.status,children:t?.("status.applying")??""}),!n.submitting&&p.length===0&&(0,P.jsx)("div",{className:c.status,children:k}),p.length>0&&(0,P.jsx)("div",{ref:s,role:"listbox","aria-label":t?.("listbox.aria")??"",className:c.viewport,children:B})]}),U={className:c.card,style:{maxHeight:I},"aria-label":t?.("overlay.aria")??hn,onKeyDown:M};return r.MenuSurface===void 0?(0,P.jsx)("div",{ref:u,...U,children:J}):(0,P.jsx)(r.MenuSurface,{ref:u,...U,children:J})}function mn(e){let n=e.findIndex(t=>t.active===!0);return n===-1?0:n}function yn(e,n){return e.length===0?0:Math.min(Math.max(n,0),e.length-1)}function ar(e,n,t){let r=e.useAnchoredMaxHeight;return r===void 0?gn:r(n,gn,t)}var H=require("react");var be="application/x-dsh-composer+json";var sr=Object.freeze({png:"image/png",jpg:"image/jpeg",jpeg:"image/jpeg",webp:"image/webp",gif:"image/gif",bmp:"image/bmp",svg:"image/svg+xml",avif:"image/avif",heic:"image/heic",heif:"image/heif",tif:"image/tiff",tiff:"image/tiff"});function kn(e){return JSON.stringify({v:1,text:e.text,attachments:e.attachments.map(n=>({path:n.path,name:n.name,type:n.type,kind:n.kind}))})}function Sn(e){if(typeof e!="string"||e==="")return;let n;try{n=JSON.parse(e)}catch{return}if(n===null||typeof n!="object")return;let t=n;if(t.v!==1)return;let r=typeof t.text=="string"?t.text:"",o=Array.isArray(t.attachments)?t.attachments:[],i=[];for(let a of o){if(a===null||typeof a!="object")continue;let d=a,u=d.path;typeof u!="string"||u===""||i.push({path:u,name:typeof d.name=="string"&&d.name!==""?d.name:Se(u),type:typeof d.type=="string"?d.type:"",kind:d.kind==="image"?"image":"file"})}return{text:r,attachments:i}}function ke(e,n){if(n.length===0)return e;let t=n.join(`
`);return e===""?t:`${e.replace(/\n+$/u,"")}

${t}`}function wn(e){if(e==="")return;let n=e.split(`
`),t=[],r=n.length;for(let i=n.length-1;i>=0;i-=1){let a=n[i]??"";if(a.trim()===""){if(t.length>0){r=i;continue}continue}let d=lr(a);if(d===void 0)break;t.unshift(d),r=i}return t.length===0?void 0:{text:n.slice(0,r).join(`
`).replace(/\n+$/u,""),paths:t}}function lr(e){let n=e.trim();if(n.startsWith("@")&&(n=n.slice(1)),n.startsWith('"')&&n.endsWith('"')&&n.length>1&&(n=n.slice(1,-1)),n!==""&&dr(n)&&!/[\u0000-\u001f\u007f]/u.test(n)&&!/["\u2018\u2019\u201c\u201d\u300c\u300d\u300e\u300f\u3002\uff01\uff1f\uff1b\uff1a\uff0c\u3001\u2026*?;<>|&$`!#=]/u.test(n)&&!/(?:^|\s)-{1,2}\S/u.test(n))return n}function dr(e){return e.startsWith("/")||/^[A-Za-z]:[/\\]/u.test(e)||e.startsWith("\\\\")}function vn(e){let n=/\.([A-Za-z0-9]+)$/u.exec(e);if(n!==null)return sr[n[1]?.toLowerCase()??""]}function Se(e){return e.split(/[\\/]/u).filter(t=>t!=="").at(-1)??e}function xn(e,n){let t=new Set(n),r=[],o=[];for(let i of e){if(t.has(i.path)){o.push(i.path);continue}t.add(i.path),r.push(i)}return{accepted:r,duplicates:o}}var K=require("react/jsx-runtime"),ur="data-dsh-better-attach-item",cr="data-dsh-better-attach-selected",pr=4500,fr=new Set(["a","c","x","insert"]),gr=new Set(["meta","control","shift","alt","altgraph","capslock","os"]),mr=/\s/u;function Ln(e){function n(t){let r=e.native();return r===void 0?null:(0,K.jsx)(yr,{native:r,props:t,deps:e})}return n}function yr({native:e,props:n,deps:t}){let r=(0,H.useRef)(null),[o,i]=(0,H.useState)(!1),[a,d]=(0,H.useState)(null),u=(n.attachments??[]).length>0,l=(0,H.useRef)(n);l.current=n;let s=(0,H.useRef)(o);s.current=o;let c=(p,f)=>n.t?.(p,f)??t.translate()?.(p,f)??"",g=(0,H.useRef)(c);return g.current=c,(0,H.useEffect)(()=>{let p=r.current;if(p===null)return;let f=p.querySelector('[role="group"]');if(f!==null)for(let y of Array.from(f.children)){if(!(y instanceof HTMLElement))continue;y.toggleAttribute(ur,!0);let m=kr(y);m!==null&&m.toggleAttribute(cr,o)}},[o,n.attachments]),(0,H.useEffect)(()=>{if(a===null)return;let p=globalThis.setTimeout(()=>{d(null)},pr);return()=>{globalThis.clearTimeout(p)}},[a]),(0,H.useEffect)(()=>{let p=r.current;if(p===null)return;let f=p.closest("[data-composer-card]");if(!(f instanceof HTMLElement))return;let y=f.ownerDocument,m=b=>(b instanceof Element?b:b instanceof Node?b.parentElement:null)?.closest("[contenteditable]")??null,S=()=>{s.current&&i(!1)},A=()=>{let b=f.ownerDocument.getSelection();return b!==null&&!b.isCollapsed&&b.toString()!==""},E=b=>b instanceof Node&&f.contains(b),I=b=>{let C=b.key.toLowerCase();if(gr.has(C))return;let M=b.metaKey||b.ctrlKey;if(M&&!b.altKey&&C==="a"){E(b.target)&&m(b.target)?.getAttribute("contenteditable")==="true"&&i(!0);return}if(M&&!b.altKey&&C==="c"&&s.current&&E(b.target)&&!A()){b.preventDefault(),hr(l.current,t,d,g.current);return}M&&!b.altKey&&fr.has(C)||S()},N=()=>{S()},$=b=>{let M=l.current.attachments??[],W=b.clipboardData;if(!s.current||M.length===0||W===null)return;let k=[],x=[];for(let T of M){let B=t.pathOf(T.file);if(B===""){x.push(T.file.name);continue}k.push({path:B,name:T.file.name,type:T.file.type,kind:T.kind})}if(k.length>0){let T=W.getData("text/plain");W.setData(be,kn({text:T,attachments:k})),W.setData("text/plain",ke(T,k.map(B=>B.path)))}x.length>0&&d(g.current("attach.copySkipped",{count:String(x.length)}))},_=b=>{let C=b.clipboardData;if(C===null||m(b.target)===null||Array.from(C.types).includes("Files"))return;let M=()=>l.current,W=Sn(C.getData(be));if(W!==void 0){b.preventDefault(),b.stopPropagation(),S(),Cn(W,M,t,d,g.current);return}let k=wn(C.getData("text/plain"));k!==void 0&&(b.preventDefault(),b.stopPropagation(),S(),Cn({text:k.text,attachments:k.paths.map(x=>{let T=vn(x)??"";return{path:x,name:Se(x),type:T,kind:T===""?"file":"image"}})},M,t,d,g.current))};y.addEventListener("keydown",I,!0),f.addEventListener("paste",_,!0);let F=b=>{let C=b.relatedTarget;C instanceof Node&&f.contains(C)||S()};return f.addEventListener("focusout",F),y.addEventListener("copy",$),y.addEventListener("pointerdown",N,!0),()=>{y.removeEventListener("keydown",I,!0),y.removeEventListener("copy",$),f.removeEventListener("paste",_,!0),f.removeEventListener("focusout",F),y.removeEventListener("pointerdown",N,!0)}},[t]),(0,K.jsxs)("div",{ref:r,className:u?"dshBetter_railHost":"dshBetter_railHostEmpty",children:[(0,K.jsx)(e,{...n}),a!==null&&(0,K.jsx)("div",{className:"dshBetter_attachNotice",role:"status",children:a})]})}function hr(e,n,t,r){let o=e.attachments??[],i=[],a=0;for(let d of o){let u=n.pathOf(d.file);u===""?a+=1:i.push(u)}i.length>0&&globalThis.navigator?.clipboard?.writeText(ke("",i)).catch(()=>{t(r("attach.copyFailed"))}),a>0&&t(r("attach.copySkipped",{count:String(a)}))}function Cn(e,n,t,r,o){let i=n();if(we(i,e.text),e.attachments.length===0)return;let a=t.reader(),d=i.sessionId;if(a===void 0||d===void 0){we(i,e.attachments.map(s=>s.path).join(`
`));return}let u=(i.attachments??[]).map(s=>t.pathOf(s.file)).filter(s=>s!==""),{accepted:l}=xn(e.attachments,u);l.length!==0&&(async()=>{let s=[],c=[],g=0;for(let f of l){let y=await br(a,d,f);y.kind==="file"?s.push(y.file):y.kind==="mention"?c.push(y.mention):g+=1}let p=n();c.length>0&&we(p,c.join(" ")),s.length>0&&p.onAddFiles?.(s),g>0&&r(o("attach.pasteMissing",{count:String(g)})),c.length>0&&r(o("attach.pasteReferenced",{count:String(c.length)}))})()}function we(e,n){if(n==="")return;let t=e.inputActions,r=t?.captureInsertion?.();t?.insertText===void 0||r===void 0||t.insertText(n,r)}async function br(e,n,t){let r=await e.readBytes?.(n,t.path,{});if(r!==void 0&&r.ok)return{kind:"file",file:new File([r.value.data],t.name,{type:t.type})};let o=await e.stat?.(n,t.path);return o!==void 0&&o.ok?{kind:"mention",mention:Sr(t.path)}:{kind:"missing"}}function kr(e){let n=e.querySelector("img")?.parentElement;if(n!=null)return n;let t=e.firstElementChild;return t instanceof HTMLElement?t:null}function Sr(e){return mr.test(e)?`@"${e}"`:`@${e}`}var wr="better.focusComposer",vr=Object.freeze(["focus input","focus composer","message input"]),X="command.focusComposer",xr=Object.freeze(["page","editable","terminal"]),Cr=Object.freeze({"desktop:macos":{code:"Space",modifiers:["primary"]},"desktop:windows":{code:"Space",modifiers:["primary","shift"]},"web:macos":{code:"Space",modifiers:["primary","shift"]},"web:windows":{code:"Space",modifiers:["primary","shift"]}}),Lr="[data-composer-input], [role='textbox'][aria-multiline='true']";function An(e){return e===void 0||typeof e.querySelector!="function"?!1:e.querySelector(Lr)!=null}function ve(e,n){if(e===null||typeof e!="object")return;let t=e.get;if(typeof t=="function"){let r=t.call(e,n);return r===null?void 0:r}return e[n]}var Rn=e=>typeof e=="string"&&e!==""?e:void 0;function En(e){let t=ve(e,"uiSession")?.adapter?.current?.getSnapshot?.();if(t!==void 0)return Rn(t.key);let r=ve(e,"sessions");return Rn(r?.list?.getSnapshot?.()?.current)}function Tn(e,n){try{let t=e.sessions?.scope?.(n);if(t===void 0)return!1;let o=ve(t,"conversation")?.input?.for?.(t);return o===void 0||typeof o.focus!="function"?!1:(o.focus(),!0)}catch{return!1}}function Rr(e){return(n={})=>{if(n.modal!=null)return{status:"pass"};if(!e.composerMounted())return{status:"pass"};let t=e.currentSessionId();return t===void 0?{status:"pass"}:{status:"handled",run:()=>{e.focusComposer(t)}}}}function Ar(e,n){return{id:wr,label:n,aliases:vr,defaults:Cr,regions:xr,modals:[],resolve:Rr(e)}}function Pn(e,n,t,r){if(e===void 0||typeof e.register!="function")return()=>{};try{return e.register(Ar(n,t))}catch(o){return r?.(o instanceof Error?o.message:String(o)),()=>{}}}var On=Object.freeze({zh:{"overlay.aria":"\u9009\u62E9\u6A21\u578B","listbox.aria":"\u6A21\u578B\u5339\u914D\u9879","search.aria":"\u641C\u7D22\u4F9B\u5E94\u5546\u6216\u6A21\u578B","search.placeholder":"\u641C\u7D22\u4F9B\u5E94\u5546\u6216\u6A21\u578B\u2026","status.empty":"\u6CA1\u6709\u53EF\u7528\u7684\u6A21\u578B\u3002","status.applying":"\u6B63\u5728\u5207\u6362\u2026",retry:"\u91CD\u8BD5","trigger.selectAria":"\u9009\u62E9\u6A21\u578B","trigger.aria":"\u5F53\u524D\u6A21\u578B {model}\uFF0C\u70B9\u51FB\u5207\u6362","trigger.ariaEffort":"\u5F53\u524D\u6A21\u578B {model}\uFF0C\u63A8\u7406\u7B49\u7EA7 {effort}\uFF0C\u70B9\u51FB\u5207\u6362","trigger.fallback":"\u9009\u62E9\u6A21\u578B","trigger.loading":"\u52A0\u8F7D\u6A21\u578B\u2026",[X]:"\u805A\u7126\u8F93\u5165\u6846","attach.copySkipped":"{count} \u4E2A\u9644\u4EF6\u6765\u81EA\u526A\u8D34\u677F\u3001\u6CA1\u6709\u672C\u5730\u8DEF\u5F84\uFF0C\u672A\u590D\u5236","attach.pasteMissing":"{count} \u4E2A\u9644\u4EF6\u5BF9\u5E94\u7684\u6587\u4EF6\u5DF2\u4E0D\u5B58\u5728\uFF0C\u672A\u7C98\u8D34","attach.pasteReferenced":"{count} \u4E2A\u9644\u4EF6\u8D85\u51FA\u5355\u6B21\u8BFB\u53D6\u4E0A\u9650\uFF0C\u5DF2\u6539\u4E3A\u8DEF\u5F84\u5F15\u7528","attach.copyFailed":"\u6D4F\u89C8\u5668\u62D2\u7EDD\u4E86\u8FD9\u6B21\u526A\u8D34\u677F\u5199\u5165","compaction.reading":"\u538B\u7F29 {count} \u6B21","compaction.readingOne":"\u538B\u7F29 1 \u6B21","compaction.tooltip":"\u672C\u4F1A\u8BDD\u4E0A\u4E0B\u6587\u5DF2\u538B\u7F29 {count} \u6B21","compaction.tooltipWithFailures":"\u672C\u4F1A\u8BDD\u4E0A\u4E0B\u6587\u5DF2\u538B\u7F29 {count} \u6B21\uFF0C\u53E6\u6709 {failures} \u6B21\u538B\u7F29\u5931\u8D25","tabs.nav":"Tab \u7BA1\u7406","tabs.heading":"Tab \u7BA1\u7406","tabs.empty":"\u8FD8\u6CA1\u6709\u63D2\u4EF6\u6CE8\u518C\u4F1A\u8BDD\u6807\u7B7E\u3002","tabs.show":"\u5728\u6807\u7B7E\u680F\u663E\u793A{label}","tabs.hide":"\u4ECE\u6807\u7B7E\u680F\u9690\u85CF{label}","alias.nav":"\u6280\u80FD\u522B\u540D","alias.heading":"\u6280\u80FD\u522B\u540D","alias.prefix.title":"\u9700\u8981\u659C\u6760\u524D\u7F00","alias.prefix.on":"\u6253\u5F00\u5219\u9700\u8981\u8F93\u5165 \u201C/\u201D \u8FDB\u884C\u5339\u914D","alias.prefix.off":"\u6253\u5F00\u5219\u65E0\u9700\u8F93\u5165 \u201C/\u201D \u8FDB\u884C\u5339\u914D","alias.table.keyword":"\u5173\u952E\u8BCD","alias.table.target":"\u6280\u80FD\u6216\u547D\u4EE4","alias.table.params":"\u53C2\u6570","alias.table.paramsPlaceholder":"\u53EF\u9009\uFF0C\u5982 run","alias.table.actions":"\u64CD\u4F5C","alias.add":"\u6DFB\u52A0\u522B\u540D","alias.remove":"\u5220\u9664\u522B\u540D {keyword}","alias.unnamed":"\uFF08\u672A\u547D\u540D\uFF09","alias.empty":"\u8FD8\u6CA1\u6709\u522B\u540D\u3002\u4F8B\u5982\uFF1Awf \u2192 /flow-workflow run","alias.footnote":"\u8F93\u5165\u5173\u952E\u8BCD\u540E\u4ECE\u9762\u677F\u9009\u62E9\u5373\u53EF\u63D2\u5165\u5B8C\u6574\u8C03\u7528\uFF1B\u6539\u5B8C\u7ACB\u5373\u751F\u6548\u3002","alias.menu.section":"\u6280\u80FD\u522B\u540D","alias.menu.params":"\u53C2\u6570\uFF1A{value}","skill.metadata":"\u5143\u6570\u636E","skill.path":"\u5730\u5740","skill.usage.session":"\u672C\u4F1A\u8BDD\u8C03\u7528","skill.usage.workspace":"\u672C\u5DE5\u4F5C\u533A\u8C03\u7528","skill.params":"\u53C2\u6570","skill.hint.insert":"\u70B9\u51FB\u63D2\u5165"},en:{"overlay.aria":"Select a model","listbox.aria":"Matching models","search.aria":"Search providers or models","search.placeholder":"Search providers or models\u2026","status.empty":"No models available.","status.applying":"Switching\u2026",retry:"Retry","trigger.selectAria":"Select model","trigger.aria":"Current model {model}, click to change","trigger.ariaEffort":"Current model {model}, reasoning effort {effort}, click to change","trigger.fallback":"Select model","trigger.loading":"Loading models\u2026",[X]:"Focus message input","attach.copySkipped":"{count} attachment(s) came from the clipboard with no local path and were not copied","attach.pasteMissing":"{count} attachment(s) no longer exist and were not pasted","attach.pasteReferenced":"{count} attachment(s) exceed the read limit and became path references","attach.copyFailed":"The browser refused this clipboard write","compaction.reading":"{count} compactions","compaction.readingOne":"1 compaction","compaction.tooltip":"This session's context was compressed {count} time(s)","compaction.tooltipWithFailures":"This session's context was compressed {count} time(s), with {failures} failed attempt(s)","tabs.nav":"Tabs","tabs.heading":"Tabs","tabs.empty":"No plugin has registered a conversation tab yet.","tabs.show":"Show {label} in the tab bar","tabs.hide":"Hide {label} from the tab bar","alias.nav":"Skill aliases","alias.heading":"Skill aliases","alias.prefix.title":"Require a slash prefix","alias.prefix.on":"To open, type \u201C/\u201D to match","alias.prefix.off":"To open, type the keyword without \u201C/\u201D to match","alias.table.keyword":"Keyword","alias.table.target":"Skill or command","alias.table.params":"Arguments","alias.table.paramsPlaceholder":"Optional, e.g. run","alias.table.actions":"Actions","alias.add":"Add alias","alias.remove":"Delete alias {keyword}","alias.unnamed":"(unnamed)","alias.empty":"No aliases yet. For example: wf \u2192 /flow-workflow run","alias.footnote":"Type a keyword and pick from the panel to insert the full invocation; changes apply immediately.","alias.menu.section":"Skill aliases","alias.menu.params":"args: {value}","skill.metadata":"Metadata","skill.path":"Path","skill.usage.session":"This session","skill.usage.workspace":"This workspace","skill.params":"Arguments","skill.hint.insert":"Click to insert"}});var In="dsh-better-effort",Er=`
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
`;function Nn(e){if(e===void 0)return()=>{};if(e.getElementById(In)!==null)return()=>{};let n=e.createElement("style");return n.id=In,n.textContent=Er,e.head.append(n),()=>{n.remove()}}var _n="dsh-better.layout-widths",Y=Object.freeze({sidebar:null,rightbar:null});function Fn(e){return typeof e=="number"&&Number.isFinite(e)&&e>0}function ae(e){if(e===void 0)return Y;let n;try{n=e.getItem(_n)}catch{return Y}if(n===null||n==="")return Y;let t;try{t=JSON.parse(n)}catch{return Y}if(typeof t!="object"||t===null||Array.isArray(t))return Y;let r=t;return{sidebar:Mn(r.sidebar),rightbar:Mn(r.rightbar)}}function Wn(e,n){if(e===void 0)return;let t={};n.sidebar!==null&&(t.sidebar=Math.round(n.sidebar)),n.rightbar!==null&&(t.rightbar=Math.round(n.rightbar));try{e.setItem(_n,JSON.stringify(t))}catch{}}function Mn(e){return Fn(e)?Math.round(e):null}function Bn(e){if(typeof e!="string")return Y;let n=e.trim().split(/\s+/).filter(t=>t!=="");return{sidebar:Dn(n[0]),rightbar:Dn(n[2])}}function Dn(e){if(e===void 0)return null;let n=/^([0-9]+(?:\.[0-9]+)?)px$/.exec(e);if(n===null)return null;let t=Number(n[1]);return Fn(t)?Math.round(t):null}function Hn(e,n,t=null){return t==="sidebar"?n.sidebar!==null&&n.sidebar!==e.sidebar?{sidebar:n.sidebar}:{}:t==="rightbar"?n.rightbar!==null&&n.rightbar!==e.rightbar?{rightbar:n.rightbar}:{}:n.sidebar!==null&&n.sidebar!==e.sidebar?{sidebar:n.sidebar}:n.rightbar!==null&&n.rightbar!==e.rightbar?{rightbar:n.rightbar}:{}}function jn(e,n){return{sidebar:n.sidebar??e.sidebar,rightbar:n.rightbar??e.rightbar}}function $n(e){let n=[];return e.sidebar!==null&&n.push({column:"sidebar",width:e.sidebar}),e.rightbar!==null&&n.push({column:"rightbar",width:e.rightbar}),n}var Tr="[data-shell-bottom]",Pr="[data-side]",Or='[class*="_sidebarCol"]',Ir='[class*="_rightbarCol"]',Nr=600;function Mr(e){let t=e?.layout?.panels;if(typeof t!="object"||t===null)return;let r=t;if(!(typeof r.setSidebar!="function"&&typeof r.setRightbar!="function"))return r}function qn(e,n){let t=Mr(e);if(t===void 0)return!1;let r=!1;for(let{column:o,width:i}of $n(n)){let a=o==="sidebar"?t.setSidebar:t.setRightbar;if(a!==void 0)try{a.call(t,i),r=!0}catch{}}return r}function zn(e){return e.querySelector(Tr)?.parentElement??null}function Dr(e,n){let t=e.hasAttribute("data-sidebar-collapsed"),r=e.hasAttribute("data-rightbar-collapsed"),o=Bn(n?.getComputedStyle(e).gridTemplateColumns);return{sidebar:t?null:o.sidebar??Un(e.querySelector(Or)),rightbar:r?null:o.rightbar??Un(e.querySelector(Ir))}}function Un(e){if(e===null)return null;let n=e.getBoundingClientRect().width;return Number.isFinite(n)&&n>0?Math.round(n):null}function Vn(e){let{document:n,storage:t}=e,r=null,o=null,i=0,a=!1,d=null,u=()=>n.defaultView,l=()=>(r!==null&&r.isConnected||(r=zn(n)),r),s=()=>{let m=l();return m===null?null:Dr(m,u())},c=m=>{let S=m?.getAttribute("data-side");return S==="sidebar"||S==="rightbar"?S:null},g=m=>{let S=s();if(S===null)return;let A=Hn(m.before,S,m.side);A.sidebar===void 0&&A.rightbar===void 0||Wn(t,jn(ae(t),A))},p=m=>{if(d!==null)return;let S=m.target,A=typeof S?.closest=="function"?S.closest(Pr):null;if(A===null)return;let E=s();E!==null&&(d={side:c(A),before:E})},f=()=>{let m=d;if(d=null,m===null)return;let S=u()?.requestAnimationFrame;if(S===void 0){g(m);return}S.call(u(),()=>g(m))},y=()=>{if(o=null,a)return;let m=zn(n);if(m!==null){r=m;return}if(i>=Nr)return;i+=1;let S=u()?.requestAnimationFrame;S!==void 0&&(o=S.call(u(),y))};return{attach(){a=!1,i=0;let m=u();return m?.addEventListener("pointerdown",p,!0),m?.addEventListener("pointerup",f,!0),m?.addEventListener("pointercancel",f,!0),y(),()=>{a=!0,d=null,r=null,m?.removeEventListener("pointerdown",p,!0),m?.removeEventListener("pointerup",f,!0),m?.removeEventListener("pointercancel",f,!0),o!==null&&m?.cancelAnimationFrame(o),o=null}}}}var Gn="sessionCompaction";var Kn="dsh-better-compaction",se="dshBetter_compactionStat",_r=`
.${se} {
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

[data-composer-dock]:has([data-workbench-dock="term-dock"]) .${se} {
  margin-left: 12px;
}
`;function Yn(e){if(e===void 0)return()=>{};if(e.getElementById(Kn)!==null)return()=>{};let n=e.createElement("style");return n.id=Kn,n.textContent=_r,e.head.append(n),()=>{n.remove()}}var Xn=require("react/jsx-runtime");function Fr(e,n){if(e===void 0||n===void 0)return null;let{compactions:t,failures:r}=e;if(!Number.isSafeInteger(t)||t<=0)return null;let o=t===1?n("compaction.readingOne"):n("compaction.reading",{count:t}),i=Number.isSafeInteger(r)&&r>0?n("compaction.tooltipWithFailures",{count:t,failures:r}):n("compaction.tooltip",{count:t});return{text:o,tooltip:i}}function Wr(){}function Jn({useProjection:e,t:n}){let r=Fr((e??Wr)(Gn),n);return r===null?null:(0,Xn.jsx)("span",{className:se,"data-dsh-better":"compaction-stat",title:r.tooltip,children:r.text})}var xe="conversation.composer.dock",Zn="better-compaction";var Z=require("react");function Br(e){let n=e.name.trim();return n===""?e.id:n}function Qn(e,n){if(e===void 0)return n;let t=Br(e.group),r=e.model.name.trim();return r===""?t:`${t} ${r}`}var z=require("react/jsx-runtime"),Hr="@deepseek-ai/dsh-client-ui-model-selection/ModelSelect.module.css";function jr(e){if(e===void 0)return;let t=e.querySelector(`style[data-plugin-css="${Hr}"]`)?.textContent??"",r=i=>new RegExp(`\\.(\\w+_${i})\\{`,"u").exec(t)?.[1],o={root:r("root"),trigger:r("trigger"),triggerIcon:r("triggerIcon"),triggerLabel:r("triggerLabel"),triggerEffort:r("triggerEffort"),chevron:r("chevron")};for(let i of Object.values(o))if(i===void 0)return;return o}function et(e){let n=ie(e.load),t=jr(e.document);function r(o){let i=e.native();return o.available===!1||i===void 0||t===void 0?i===void 0?null:(0,z.jsx)(i,{...o}):(0,z.jsx)($r,{props:o,primitives:n,openPicker:e.openPicker,translate:e.translate,classes:t})}return r}function $r({props:e,primitives:n,openPicker:t,translate:r,classes:o}){let{directory:i,t:a,sessionId:d,locked:u}=e,l=zr(i),s=a??r(),c=l?.current??null,g=c===null&&l?.status==="loading",p=Ur(l,c),f=g?s?.("trigger.loading")??"":Qn(p,s?.("trigger.fallback")??""),y=qr(l,c,p,s),m=y===void 0?f:`${f} \xB7 ${y}`,S=g?s?.("trigger.loading")??"":c===null?s?.("trigger.selectAria")??"":y===void 0?s?.("trigger.aria",{model:f})??"":s?.("trigger.ariaEffort",{model:f,effort:y})??"",A=()=>{t(d)},E=n.IconDataOutlineRegular,I=n.IconChevronDownOutlineRegular;return(0,z.jsx)("div",{className:o.root,"data-dsh-better-seat":"",children:(0,z.jsxs)("button",{type:"button",className:o.trigger,"aria-label":S,"aria-haspopup":"dialog","aria-expanded":"false",title:m,disabled:u,onClick:A,children:[E===void 0?null:(0,z.jsx)(E,{className:o.triggerIcon,size:16}),(0,z.jsx)("span",{className:o.triggerLabel,"data-provider-id":c?.provider,"data-model-id":c?.model,children:f}),y!==void 0&&(0,z.jsx)("span",{className:o.triggerEffort,children:y}),I===void 0?null:(0,z.jsx)(I,{className:o.chevron})]})})}function zr(e){let n=(0,Z.useCallback)(r=>e===void 0?()=>{}:e.subscribe(r),[e]),t=(0,Z.useCallback)(()=>e?.getSnapshot(),[e]);return(0,Z.useSyncExternalStore)(n,t)}function Ur(e,n){if(!(e===void 0||n===null||n===void 0)){for(let t of e.groups)if(t.id===n.provider){for(let r of t.models)if(r.id===n.model)return{group:t,model:r}}}}function qr(e,n,t,r){if(e===void 0||n===null||n===void 0)return;let o=t?.model.reasoning,i=n.reasoningEffort??o?.defaultEffort;return t===void 0?e.retainedEffort:o===void 0||i===void 0?void 0:o.efforts?.find(d=>d.id===i)?.name??i}function nt(e){let r=e?.live?.contributions?.get("model")?.ui;return r==null?void 0:r.kind==="popupSelect"?r:void 0}function tt(e){return{sessionId:e}}function rt(){return{via:"enter",token:""}}var Vr=`
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
`,ot="dsh-better/tabs.css";function it(e){let n=`style[data-plugin-css=${JSON.stringify(ot)}]`;if(e.querySelector(n)!==null)return()=>{};let t=e.createElement("style");return t.dataset.plugin="dsh-better",t.dataset.pluginCss=ot,t.textContent=Vr,e.head.append(t),()=>t.remove()}function at(e){let n;return e.React.createElement("section",{"data-dsh-better-tabs":"",ref:t=>{if(n?.(),n=void 0,t===null)return;let r=()=>{Gr(t,e)};r(),n=e.controller.subscribe(r)}})}function Gr(e,n){let t=e.ownerDocument,{controller:r,copy:o}=n;e.replaceChildren();let i=t.createElement("h2");i.setAttribute("data-dsh-better-tabs-heading",""),i.textContent=o.heading,e.append(i);let a=r.rows();if(a.length===0){let d=t.createElement("p");d.setAttribute("data-dsh-better-tabs-empty",""),d.textContent=o.empty,e.append(d);return}for(let d of a){let u=t.createElement("label");u.setAttribute("data-dsh-better-tabs-row",d.id);let l=t.createElement("span");l.setAttribute("data-dsh-better-tabs-name",""),l.textContent=d.label;let s=t.createElement("input");s.setAttribute("data-dsh-better-tabs-check",d.id),s.type="checkbox",s.checked=d.enabled,s.setAttribute("aria-label",o.checkboxLabel(d.label,d.enabled)),s.addEventListener("change",()=>{r.setEnabled(d.id,s.checked)}),u.append(l,s),e.append(u)}}var Ce="conversation.view",Le="settings.section",lt="tabs";var de="chat",dt="dsh-better.tabs",Q="[data-conversation-tabs]";function ut(e,n){if(typeof e=="string"&&e!=="")return e;if(typeof e=="function")try{let t=e();if(typeof t=="string"&&t!=="")return t}catch{}return n}function Kr(e){if(e===void 0)return new Set;let n;try{n=e.getItem(dt)}catch{return new Set}if(n===null||n==="")return new Set;try{let t=JSON.parse(n);if(!Array.isArray(t))return new Set;let r=new Set;for(let o of t)typeof o=="string"&&o!==""&&o!==de&&r.add(o);return r}catch{return new Set}}function Yr(e,n){if(e!==void 0)try{e.setItem(dt,JSON.stringify([...n].sort()))}catch{}}function Jr(e,n){let t=[],r=new Set;for(let o of e){let i=o.options.id;i===void 0||i===de||r.has(i)||(r.add(i),t.push({id:i,label:ut(o.options.label,i),enabled:!n.has(i)}))}return t}function Xr(e){let n=[],t=new Set;for(let r of e){let o=r.options.id;o===void 0||o===de||t.has(o)||(t.add(o),n.push({id:o,label:ut(r.options.label,o)}))}return n}function Zr(e,n,t){let r=new Set;for(let o of Xr(e)){if(!n.has(o.id)||o.label==="")continue;t.filter(a=>a.label===o.label).length===1&&r.add(o.label)}return t.map(o=>r.has(o.label))}function Qr(e,n){for(let t of e)if(n!==null&&(t.target===n||n.contains?.(t.target)===!0)||st(t.addedNodes,n)||st(t.removedNodes,n))return!0;return!1}function st(e,n){if(e===void 0)return!1;for(let t=0;t<e.length;t+=1){let r=e[t];if(r!==void 0&&(r.matches?.(Q)===!0||r.querySelector?.(Q)!=null||n!==null&&r.contains?.(n)===!0))return!0}return!1}function eo(e){let n=e.querySelector(Q);if(n===null||typeof n!="object")return;let r=n.querySelectorAll?.(":scope > button[role='tab']");if(r===void 0)return;let o=[];for(let i=0;i<r.length;i+=1){let a=r[i];a!==void 0&&o.push({label:no(a),hidden:a.hasAttribute(le),mark:d=>{d?a.setAttribute(le,""):a.removeAttribute(le)}})}return o}function no(e){return(e.querySelector?.("[class*='tabLabel']")?.textContent??e.textContent??"").trim()}function to(e,n){let t=!1;for(let[r,o]of e.entries()){let i=n[r]??!1;i!==o.hidden&&(o.mark(i),t=!0)}return t}function ct(e){let{ledger:n,storage:t}=e,r=e.readButtons??eo,o=e.watch??io,i=new Set(Kr(t)),a=new Set,d,u=()=>{for(let s of[...a])s()},l=30;return{rows:()=>Jr(n.entriesOfSlot(Ce),i),setEnabled(s,c){if(s===de)return!1;let g=i.has(s);return c===!g?!1:(c?i.delete(s):i.add(s),Yr(t,i),d?.(),u(),!0)},subscribe(s){return a.add(s),()=>{a.delete(s)}},attach(s){let c=s.createElement("style");c.dataset.plugin="dsh-better",c.dataset.pluginCss=ro,c.textContent=oo,s.head.append(c);let g=s.defaultView?.requestAnimationFrame?.bind(s.defaultView),p=s.defaultView?.cancelAnimationFrame?.bind(s.defaultView),f=g===void 0?0:l,y,m=()=>{let E=n.entriesOfSlot(Ce),I=r(s);if(I===void 0||I.length===0){f>0&&g!==void 0&&(f-=1,y=g(()=>m()));return}f=l,y=void 0,to(I,Zr(E,i,I))},S=n.subscribe(Ce,m),A=o(s,m);return d=m,m(),()=>{S(),A(),d=void 0,y!==void 0&&p?.(y),c.remove()}}}}var ro="dsh-better/strip.css",le="data-dsh-better-tab-hidden",oo=`${Q} > button[${le}] { display: none; }`;function io(e,n){let t=e.defaultView?.MutationObserver,r=e.documentElement;if(t===void 0||r===void 0)return()=>{};let o=new t(i=>{let a=e.querySelector(Q);Qr(i,a!==null&&typeof a=="object"?a:null)&&n()});return o.observe(r,{childList:!0,subtree:!0}),()=>o.disconnect()}var V="conversation.input.overlay",pt="settings.section",lo="aliases",uo=56,co="alias-watcher",mt=50,po="skill-enhancer",fo=mt+1,Re="conversation.input.model",Ae="conversation.input.attachments",go=-50,mo=-60,yt="command-popup",yo=-100,D="better",ho="/better/api/skill-profile",bo=5e3,ue=null;function ht(e,n){let t,r=Number.POSITIVE_INFINITY;for(let o of e){if(o.options.id!==yt)continue;let i=o.component;if(typeof i!="function"||n!==void 0&&i===n)continue;let a=o.options.priority??0;a<r&&(t=i,r=a)}return t}var bt={name:"dsh-better",inject:["slots","sessions","commandUi","conversation","locale","modelDirectories","remote","remote.session"],apply(e){let n=globalThis.document;e.effect(()=>e.locale.register(D,On),"dsh-better: locale"),e.effect(()=>Nn(n),"dsh-better: effort badge stylesheet"),e.effect(()=>Yn(n),"dsh-better: compaction count stylesheet");let t=Oe(Ee()),r=Eo(e),o={open:!1};e.effect(()=>{let u=Ee(),l=ae(u);e.inject?.(["layout"],g=>{qn(g,l)});let c=(n===void 0?void 0:Vn({document:n,storage:u}))?.attach();return()=>{c?.()}},"dsh-better: panel width memory"),e.effect(()=>e.slots.inject(xe,()=>e.slots.register({name:xe,id:Zn,order:-1,locale:D},Jn)),"dsh-better: compaction count"),e.effect(()=>e.slots.inject(V,()=>{let u={},s=bn({load:ue,native:()=>ht(e.slots.entries(V),u.component),document:n});return u.component=s,e.slots.register({name:V,id:yt,priority:yo,locale:D,inject:c=>{let g=vo(e,c);return{popup:wo(e,c),catalog:g?.groups,current:g?.current??null,selectModel:p=>e.modelDirectories?.directoryFor?.(c)?.select?.(p)}}},s)}),"dsh-better: /model provider search"),e.effect(()=>e.slots.inject(Re,()=>{let u={},s=et({load:ue,native:()=>Te(e.slots.entries(Re),u.component),openPicker:c=>ko(e,c),translate:()=>So(e),document:n});return u.component=s,e.slots.register({name:Re,priority:go,locale:D,inject:c=>({sessionId:c,available:!0,directory:e.modelDirectories?.directoryFor?.(c)?.store})},s)}),"dsh-better: composer model trigger");let i;e.inject?.(["remote.workspaceFiles"],u=>{i=u["remote.workspaceFiles"],u.effect(()=>()=>{i=void 0},"dsh-better: workspace file reader")}),e.effect(()=>e.slots.inject(Ae,()=>{let u={},s=Ln({native:()=>Te(e.slots.entries(Ae),u.component),pathOf:xo,reader:()=>i,translate:()=>e.locale.bind?.(D)});return u.component=s,e.slots.register({name:Ae,priority:mo,locale:D,inject:c=>({sessionId:c})},s)}),"dsh-better: composer attachment selection");let a;e.inject?.(["inputTriggers"],u=>{a=u.inputTriggers,u.effect(()=>()=>{a=void 0},"dsh-better: alias trigger service"),u.effect(()=>u.inputTriggers.registerSource(je({config:()=>t.getSnapshot(),translate:r,bareMenuOpen:()=>o.open,routeCommand:(l,s)=>Ao(e,s)})),"dsh-better: alias slash source")}),e.effect(()=>e.slots.inject(V,()=>{let u=Ve({store:t,bareMenuOpen:o,inputStoreFor:l=>{let s=e.sessions.scope?.(l);if(!(s===void 0||e.conversation===void 0))try{return e.conversation.input?.for?.(s)?.state}catch{return}},controllerFor:l=>{let s=e.sessions.scope?.(l);if(s===void 0)return;let c=ce(e,"inputTriggers")??a;if(c!==void 0)try{return c.sessionOf(s)}catch{return}}});return gt(e.slots,{name:V,id:co,order:mt,inject:l=>({sessionId:l})},u)}),"dsh-better: alias selector watcher"),e.effect(()=>rn(n),"dsh-better: skill enhancer stylesheet"),e.effect(()=>e.slots.inject(V,()=>{let u=nn({scopeFor:l=>e.sessions.scope?.(l),inputStoreFor:l=>{let s=e.sessions.scope?.(l);if(!(s===void 0||e.conversation===void 0))try{return e.conversation.input?.for?.(s)?.state}catch{return}},actionsFor:l=>{let s=e.sessions.scope?.(l);if(!(s===void 0||e.conversation===void 0))try{return e.conversation.input?.for?.(s)}catch{return}},skillNamesFor:Co(e),loadProfile:(l,s)=>Lo(e,l,s),loadUsage:(l,s)=>kt(e,l,s),translate:r,document:n});return gt(e.slots,{name:V,id:po,order:fo,inject:l=>({sessionId:l})},u)}),"dsh-better: skill enhancer"),e.effect(()=>e.slots.inject(pt,()=>{let u=n===void 0?void 0:ze(n),l=He({store:t,translate:r}),s=ft(e.slots,{name:pt,id:lo,order:uo,label:()=>e.locale.bind?.(D)?.("alias.nav")??"Skill aliases",locale:D},l);return()=>{s(),u?.()}}),"dsh-better: alias settings page");let d=ct({ledger:Ro(e.slots),storage:Ee()});e.effect(()=>e.slots.inject(Le,()=>{let u=globalThis.document,l=u===void 0?void 0:it(u),s=ft(e.slots,{name:Le,id:lt,order:55,label:()=>e.locale.bind?.(D)?.("tabs.nav")??"Tabs"},()=>{let c=To(ue);return c===null?null:at({React:c,controller:d,copy:Po(e)})});return()=>{s(),l?.()}}),"dsh-better: tab management"),e.effect(()=>d.attach(n),"dsh-better: tab visibility"),e.inject?.(["shortcuts"],u=>{u.effect(()=>Pn(u.shortcuts,{currentSessionId:()=>En(e),composerMounted:()=>An(n),focusComposer:l=>Tn(e,l)},()=>e.locale.bind?.(D)?.(X)??"Focus message input",l=>console.warn(`dsh-better: focus command not registered (${l})`)),"dsh-better: focus composer shortcut")})}};function Te(e,n){let t,r=Number.POSITIVE_INFINITY;for(let o of e){let i=o.component;if(typeof i!="function"||n!==void 0&&i===n)continue;let a=o.options.priority??0;a<r&&(t=i,r=a)}return t}function ko(e,n){if(n===void 0)return!1;let t=nt(e.commandUi);if(t===void 0)return!1;let r=e.sessions.scope?.(n);if(r===void 0)return!1;let o=e.commandUi.popupFor?.(r);return o===void 0||typeof o.open!="function"?!1:(o.open("model",t,tt(n),rt()),!0)}function So(e){return e.locale?.bind?.(D)}function wo(e,n){let t=e.sessions.scope?.(n);if(t!==void 0)return e.commandUi.popupFor?.(t)}function vo(e,n){return e.modelDirectories?.directoryFor?.(n)?.store.getSnapshot()}function xo(e){let n=globalThis.__DSH_HOST_PATHS__;if(n?.pathFor===void 0)return"";try{let t=n.pathFor(e);return typeof t=="string"?t:""}catch{return""}}function ft(e,n,t){return(e.registerUntyped??e.register).call(e,n,t)}function gt(e,n,t){return(e.registerUntyped??e.register).call(e,n,t)}function Co(e){let n=new Map,t=new Map;return async r=>{let o=n.get(r);if(o!==void 0)return o;let i=t.get(r);if(i!==void 0&&Date.now()-i<bo)return new Set;let a=ce(e,"remote.skills");if(a===void 0)return new Set;try{let d=await a.list({sessionId:r});if(!d.ok)return t.set(r,Date.now()),new Set;let u=new Set(d.value.skills.map(l=>l.name));return n.set(r,u),t.delete(r),u}catch{return t.set(r,Date.now()),new Set}}}async function Lo(e,n,t){let r=`?sessionId=${encodeURIComponent(n)}&name=${encodeURIComponent(t)}`;try{let o=await fetch(`${ho}${r}`,{headers:{accept:"application/json"}});return o.ok?await o.json():void 0}catch{return}}function kt(e,n,t){let r=e.sessions.list??ce(e,"sessions.list");try{let o=r?.getSnapshot?.(),i=c=>{let p=o?.projectionsBySession?.[c]?.values?.skillUsage;if(typeof p!="object"||p===null)return;let f=p.counts;return typeof f=="object"&&f!==null?f:void 0},a=i(n)?.[t],d=typeof a=="number"&&Number.isFinite(a)?a:0,u=o?.byId?.[n]?.cwd;if(typeof u!="string"||u==="")return{session:d};let l=Object.keys(o?.byId??{}).map(c=>{let g=i(c),p=o?.byId?.[c]?.cwd;return{...typeof p=="string"?{cwd:p}:{},...g===void 0?{}:{usage:g}}}),s=on(l,u,t);return s===void 0?{session:d}:{session:d,workspace:s}}catch{return{session:0}}}function Ro(e){return{entriesOfSlot:n=>(e.entriesOfSlot??e.entries).call(e,n),subscribe:(n,t)=>e.subscribe?.(n,t)??(()=>{})}}function Ee(){try{return globalThis.localStorage}catch{return}}function ce(e,n){try{return typeof e.get=="function"?e.get(n):e[n]}catch{return}}function Ao(e,n){let t=n.session?.sessionId;if(t===void 0)return;let r=e.sessions.scope?.(t);if(r===void 0)return;let o=ce(e,"inputTriggers");if(o!==void 0)try{let i=o.sessionOf(r),a=e.conversation?.input?.for?.(r)?.state,d=0,u=()=>{let l=a?.getSnapshot();if(!(l===void 0||l.draft.trim()===""||!l.draft.startsWith("/"))){try{let s=l.draft.trimStart().split(/\s/u)[0]??"";if(!s.startsWith("/")||(i.track?.(s,s.length,{tier:"plain"},l.draftRev),i.onSpace?.()===!0))return;i.dismiss?.()}catch{}d+=1,d<4&&setTimeout(u,25)}};setTimeout(u,0)}catch{}}function Eo(e){return(n,t)=>{try{return e.locale.bind?.(D)?.(n,t)??n}catch{return n}}}function To(e){if(e===null)return null;try{let n=e("react");if(typeof n!="object"||n===null)return null;let t=n;return typeof t.createElement=="function"?t:null}catch{return null}}function Po(e){let n=e.locale.bind?.(D),t=(r,o)=>n?.(r)??o;return{heading:t("tabs.heading","Tabs"),empty:t("tabs.empty","No plugin has registered a conversation tab yet."),checkboxLabel:(r,o)=>t(o?"tabs.hide":"tabs.show","{label}").replace("{label}",r)}}function Oo(e){ue=e}var Io=bt;

    // Hand the loader's `require` to the module's `boot` export before the
    // plugin mounts. Read from `module.exports` rather than the default export:
    // esbuild emits named exports there and the plugin object separately, so the
    // default export alone never carries `boot`.
    if (typeof module.exports.boot === "function") module.exports.boot(require);
    return module.exports.default ?? module.exports;
  }
});
