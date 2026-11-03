window.__ModuleLoader__.load({
  id: "dsh-better",
  factory: (require) => {
    var module = { exports: {} };
    var exports = module.exports;
"use strict";var pe=Object.defineProperty;var bn=Object.getOwnPropertyDescriptor;var kn=Object.getOwnPropertyNames;var Sn=Object.prototype.hasOwnProperty;var wn=(e,t)=>{for(var n in t)pe(e,n,{get:t[n],enumerable:!0})},vn=(e,t,n,r)=>{if(t&&typeof t=="object"||typeof t=="function")for(let o of kn(t))!Sn.call(e,o)&&o!==n&&pe(e,o,{get:()=>t[o],enumerable:!(r=bn(t,o))||r.enumerable});return e};var xn=e=>vn(pe({},"__esModule",{value:!0}),e);var Po={};wn(Po,{boot:()=>Eo,clientPlugin:()=>yn,default:()=>To,findShadowed:()=>mn,findShadowedSingle:()=>Te});module.exports=xn(Po);var te=require("react");var Pe="dsh-better.skill-aliases";var G=Object.freeze({prefix:!0,rows:Object.freeze([])});function Cn(e,t){if(e!==void 0)try{e.setItem(Pe,JSON.stringify({v:1,prefix:t.prefix,rows:t.rows}))}catch{}}function ee(e,t){return typeof e=="string"?e:t}function Ln(e,t){if(typeof e!="object"||e===null||Array.isArray(e))return;let n=e;if(!(typeof n.keyword!="string"&&typeof n.target!="string"&&typeof n.params!="string"))return{id:ee(n.id,`alias-${t}`)||`alias-${t}`,keyword:ee(n.keyword,""),target:ee(n.target,""),params:ee(n.params,"")}}function Rn(e){if(typeof e!="object"||e===null||Array.isArray(e))return G;let t=e,n=typeof t.prefix=="boolean"?t.prefix:G.prefix,r=Array.isArray(t.rows)?t.rows:[],o=[],i=new Set;for(let[a,d]of r.slice(0,200).entries()){let u=Ln(d,a);if(u===void 0)continue;let s=u.id,l=0;for(;i.has(s);)l+=1,s=`alias-${a}-${l}`;i.add(s),o.push({...u,id:s})}return{prefix:n,rows:o}}function An(e){if(e===void 0)return G;let t;try{t=e.getItem(Pe)}catch{return G}if(t===null||t==="")return G;try{return Rn(JSON.parse(t))}catch{return G}}function En(){let e=globalThis.crypto;return e?.randomUUID!==void 0?e.randomUUID():`alias-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,8)}`}function Oe(e,t=En){let n=An(e),r=new Set,o=i=>{n=i;for(let a of[...r])try{a()}catch(d){console.error("[dsh-better] alias store listener failed:",d)}Cn(e,i)};return{getSnapshot:()=>n,subscribe(i){return r.add(i),()=>{r.delete(i)}},setPrefix(i){n.prefix!==i&&o({...n,prefix:i})},addRow(){let i=t();return o({...n,rows:[...n.rows,{id:i,keyword:"",target:"",params:""}]}),i},updateRow(i,a){let d=!1,u=n.rows.map(s=>{if(s.id!==i)return s;let l={...s,...a,id:s.id};return d=l.keyword!==s.keyword||l.target!==s.target||l.params!==s.params,l});d&&o({...n,rows:u})},removeRow(i){let a=n.rows.filter(d=>d.id!==i);a.length!==n.rows.length&&o({...n,rows:a})}}}function Ie(e){return e.keyword.trim()!==""&&e.target.trim()!==""}function Ne(e){return e.keyword.trim().replace(/^\/+/,"").toLowerCase()}function Me(e,t){let n=t.trim().replace(/^\/+/,"").toLowerCase();return n===""?[]:e.rows.filter(r=>Ie(r)&&Ne(r)===n)}function De(e,t,n=!1){let r=t.trim().replace(/^\/+/,"").toLowerCase(),o=e.rows.filter(Ie);if(r==="")return n?o:[];let i=[],a=[],d=[];for(let u of o){let s=Ne(u);s===r?i.push(u):s.startsWith(r)?a.push(u):s.includes(r)&&d.push(u)}return[...i,...a,...d]}function _e(e){let t=e.target.trim().replace(/^\/+/,"");if(t==="")return"";let n=e.params.trim();return n===""?`/${t} `:`/${t} ${n} `}function Fe(e,t){let n=/^\/([^\s/]+)([ \t]*)$/u.exec(t);if(n===null)return;let r=n[1]??"",o=Me(e,r);if(o.length!==0)return{query:r,start:0,end:t.length,rows:o}}function We(e,t){let n=/^([^\s/]+)([ \t]*)$/u.exec(t);if(n===null)return;let r=n[1]??"",o=Me(e,r);if(o.length!==0)return{query:r,start:0,end:t.length,rows:o}}function Be(e){if(e.keyword.trim()==="")return"keyword";if(e.target.trim()==="")return"target";if(/\s/.test(e.keyword.trim()))return"keyword"}var w=require("react/jsx-runtime");function Tn(e){let{row:t,store:n,t:r}=e,o=Be(t);return(0,w.jsxs)("tr",{"data-testid":"alias-row","data-row-id":t.id,"data-incomplete":o===void 0?void 0:"",children:[(0,w.jsx)("td",{children:(0,w.jsx)("input",{className:"dsh-better-alias-input","data-testid":"alias-keyword",value:t.keyword,placeholder:"wf",spellCheck:!1,autoComplete:"off","aria-label":r("alias.table.keyword"),ref:i=>{i!==null&&e.focus&&(i.focus(),e.clearFocus())},onChange:i=>n.updateRow(t.id,{keyword:i.target.value})})}),(0,w.jsx)("td",{children:(0,w.jsx)("input",{className:"dsh-better-alias-input","data-testid":"alias-target",value:t.target,placeholder:"flow-workflow",spellCheck:!1,autoComplete:"off","aria-label":r("alias.table.target"),onChange:i=>n.updateRow(t.id,{target:i.target.value})})}),(0,w.jsx)("td",{children:(0,w.jsx)("input",{className:"dsh-better-alias-input","data-testid":"alias-params",value:t.params,placeholder:r("alias.table.paramsPlaceholder"),spellCheck:!1,autoComplete:"off","aria-label":r("alias.table.params"),onChange:i=>n.updateRow(t.id,{params:i.target.value})})}),(0,w.jsx)("td",{className:"dsh-better-alias-actions",children:(0,w.jsx)("button",{type:"button",className:"dsh-better-alias-delete","data-testid":"alias-remove","aria-label":r("alias.remove",{keyword:t.keyword.trim()||r("alias.unnamed")}),title:r("alias.remove",{keyword:t.keyword.trim()||r("alias.unnamed")}),onClick:()=>n.removeRow(t.id),children:"\xD7"})})]})}function He(e){function t(){let n=(0,te.useSyncExternalStore)(e.store.subscribe,e.store.getSnapshot,e.store.getSnapshot),{translate:r}=e,o=(0,te.useRef)(null),i=()=>{o.current=e.store.addRow()};return(0,w.jsxs)("section",{className:"dsh-better-alias-page","data-testid":"alias-page",children:[(0,w.jsx)("h2",{className:"dsh-better-alias-heading",children:r("alias.heading")}),(0,w.jsxs)("label",{className:"dsh-better-alias-prefix",children:[(0,w.jsxs)("span",{children:[(0,w.jsx)("span",{className:"dsh-better-alias-prefix-title",children:r("alias.prefix.title")}),(0,w.jsx)("span",{className:"dsh-better-alias-prefix-hint",children:r(n.prefix?"alias.prefix.on":"alias.prefix.off")})]}),(0,w.jsx)("input",{type:"checkbox","data-testid":"alias-prefix",checked:n.prefix,"aria-label":r("alias.prefix.title"),onChange:a=>e.store.setPrefix(a.target.checked)})]}),(0,w.jsxs)("div",{className:"dsh-better-alias-table-wrap",children:[(0,w.jsxs)("table",{className:"dsh-better-alias-table",children:[(0,w.jsx)("thead",{children:(0,w.jsxs)("tr",{children:[(0,w.jsx)("th",{scope:"col",children:r("alias.table.keyword")}),(0,w.jsx)("th",{scope:"col",children:r("alias.table.target")}),(0,w.jsx)("th",{scope:"col",children:r("alias.table.params")}),(0,w.jsx)("th",{scope:"col","aria-label":r("alias.table.actions")})]})}),(0,w.jsx)("tbody",{children:n.rows.map(a=>(0,w.jsx)(Tn,{row:a,store:e.store,t:r,focus:o.current===a.id,clearFocus:()=>{o.current=null}},a.id))})]}),n.rows.length===0?(0,w.jsx)("p",{className:"dsh-better-alias-empty","data-testid":"alias-empty",children:r("alias.empty")}):null]}),(0,w.jsx)("button",{type:"button",className:"dsh-better-alias-add","data-testid":"alias-add",onClick:i,children:r("alias.add")}),(0,w.jsx)("p",{className:"dsh-better-alias-footnote",children:r("alias.footnote")})]})}return t}var fe="alias",Pn="/",On=-1;function In(e,t){let n=e.target.trim().replace(/^\/+/,""),r=e.keyword.trim(),o=e.params.trim();return{name:n,label:r,...o===""?{}:{description:t("alias.menu.params",{value:o})},section:t("alias.menu.section"),value:e.id}}function je(e){return{trigger:Pn,name:fe,order:On,async candidates(t,n){if(n.position!=="leading")return[];let r=e.config();return!r.prefix&&e.bareMenuOpen?.()!==!0?[]:De(r,n.query,!0).map(o=>In(o,e.translate))},onPick(t){let n=e.config().rows.find(i=>i.id===t.candidate.value);if(n===void 0)return;let r=n.target.trim().replace(/^\/+/,"");r!==""&&e.routeCommand?.(r,t);let o=_e(n);return o===""?void 0:{text:o}}}}var $e="dsh-better/aliases.css",Nn=`
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
`;function ze(e){let t=`style[data-plugin-css=${JSON.stringify($e)}]`;if(e.querySelector(t)!==null)return()=>{};let n=e.createElement("style");return n.dataset.plugin="dsh-better",n.dataset.pluginCss=$e,n.textContent=Nn,e.head.append(n),()=>n.remove()}var U=require("react");var qe={draft:"",draftRev:-1,phase:"plain"};function Ve(e){return function(n){let r=(0,U.useSyncExternalStore)(e.store.subscribe,e.store.getSnapshot,e.store.getSnapshot),o=n.sessionId===void 0?void 0:e.inputStoreFor(n.sessionId),i=n.sessionId===void 0?void 0:e.controllerFor(n.sessionId),a=(0,U.useSyncExternalStore)(u=>o===void 0?()=>{}:o.subscribe(u),()=>o===void 0?qe:o.getSnapshot(),()=>o===void 0?qe:o.getSnapshot()),d=(0,U.useRef)(null);return(0,U.useEffect)(()=>{let u=n.sessionId;if(u===void 0||a.phase!=="plain"||i===void 0)return;let s=i.menu.getSnapshot().open;if(s&&d.current===null)return;let l=ge(r,a.draft);if(s){let m=d.current;if(m!==null&&(m.draftRev!==a.draftRev||m.spanEnd!==(l?.end??-1))){let f=setTimeout(()=>{let g=o?.getSnapshot()??a,y=e.controllerFor(u);if(y===void 0||g.phase!=="plain")return;d.current=null,y.dismiss();let p=ge(e.store.getSnapshot(),g.draft);p!==void 0&&(e.bareMenuOpen.open=!0,Ue(y,p,g.draftRev),e.bareMenuOpen.open=!1,d.current={draftRev:g.draftRev,spanEnd:p.end})},80);return()=>clearTimeout(f)}return}if(d.current=null,l===void 0)return;let c=setTimeout(()=>{let m=o?.getSnapshot()??a,f=e.controllerFor(u);if(f===void 0||m.phase!=="plain"||f.menu.getSnapshot().open)return;let g=ge(e.store.getSnapshot(),m.draft);g!==void 0&&(e.bareMenuOpen.open=!0,Ue(f,g,m.draftRev),e.bareMenuOpen.open=!1,d.current={draftRev:m.draftRev,spanEnd:g.end})},80);return()=>clearTimeout(c)},[r,a.draft,a.draftRev,a.phase,i,o,n.sessionId]),null}}function ge(e,t){return e.prefix?Fe(e,t):We(e,t)}function Ue(e,t,n){e.toggleSource(fe,{trigger:"/",query:t.query,quoted:!1,position:"leading",span:{start:t.start,end:t.end,draftRev:n}})}var R=require("react");var Mn="[a-z0-9]+(?:-[a-z0-9]+)*",Dn=new RegExp(`^/(${Mn})(?=\\s|$)`,"u");function Ge(e,t){let n=Dn.exec(e);if(n===null)return;let r=n[1]??"";if(t(r))return{name:r,start:0,end:1+r.length}}function Ke(e,t,n){return e===void 0||!Number.isInteger(n)||n<e.end||n>t.length||n!==t.length?!1:/^[ \t]*$/u.test(t.slice(e.end,n))}var _n=/^\/([a-z0-9]+(?:-[a-z0-9]+)*)[ \t]*$/u,Fn=400,Ye=200,Je=6,Wn=240,Xe={draft:"",draftRev:-1,phase:"plain"};function Bn(e,t){return`${e!==""&&!/\s$/u.test(e)?" ":""}${t} `}function Qe(e){return e===void 0?void 0:_n.exec(e)?.[1]}function Hn(e){return e===void 0?[]:e.split(`
`).map(t=>t.trim()).filter(t=>t!=="")}function Ze(e,t){let n=e.querySelectorAll("[data-composer-text-ref]");for(let r of n){if(Qe(r.textContent??"")!==t)continue;let o=r.getBoundingClientRect();return{left:o.left,right:o.right,top:o.top,bottom:o.bottom}}}function jn(e){return e.defaultView?.innerWidth??0}function et(e){return function(n){let r=e.document??globalThis.document,o=n.sessionId,i=o===void 0?void 0:e.inputStoreFor(o),a=n.useInput,d=a===void 0?void 0:a(k=>k.draft),u=(0,R.useSyncExternalStore)(k=>i===void 0?()=>{}:i.subscribe(k),()=>i===void 0?Xe.draft:i.getSnapshot().draft,()=>i===void 0?Xe.draft:i.getSnapshot().draft),s=d??u,[l,c]=(0,R.useState)(()=>new Set),[m,f]=(0,R.useState)(void 0),[g,y]=(0,R.useState)(void 0),[p,S]=(0,R.useState)(void 0),[A,E]=(0,R.useState)(void 0);(0,R.useEffect)(()=>{if(o===void 0)return;let k=!0;return e.skillNamesFor(o).then(x=>{k&&c(x)},()=>{k&&c(new Set)}),()=>{k=!1}},[o]);let I=Ge(s,k=>l.has(k)),N=Ke(I,s,s.length)?I?.name:void 0,$=N??g;(0,R.useEffect)(()=>{if(o===void 0||$===void 0){f(void 0);return}let k=!0;return e.loadProfile(o,$).then(x=>{k&&f(x)},()=>{k&&f(void 0)}),()=>{k=!1}},[o,$]),(0,R.useEffect)(()=>{if(r===void 0||N===void 0){S(void 0);return}let k=()=>S(Ze(r,N));k();let x=r.defaultView;return x?.addEventListener("resize",k),()=>x?.removeEventListener("resize",k)},[r,N,s]);let _=(0,R.useRef)(null),F=(0,R.useRef)(null),b=()=>{_.current!==null&&clearTimeout(_.current),_.current=null},C=()=>{F.current!==null&&clearTimeout(F.current),F.current=null};(0,R.useEffect)(()=>{if(r===void 0||o===void 0)return;let k=T=>{let B=T.target;if(!(B instanceof r.defaultView.Element))return;let J=B.closest("[data-composer-text-ref]");if(J===null)return;let q=Qe(J.textContent??"");q!==void 0&&(C(),b(),_.current=setTimeout(()=>{_.current=null,y(q),S(Ze(r,q)),E(e.loadUsage(o,q))},Fn))},x=T=>{let B=T.target;B instanceof r.defaultView.Element&&B.closest("[data-composer-text-ref]")!==null&&(b(),C(),F.current=setTimeout(()=>{F.current=null,y(void 0)},Ye))};return r.addEventListener("pointerover",k,!0),r.addEventListener("pointerout",x,!0),()=>{b(),C(),r.removeEventListener("pointerover",k,!0),r.removeEventListener("pointerout",x,!0)}},[r,o]),(0,R.useEffect)(()=>{if(r===void 0||g===void 0)return;let k=x=>{x.key==="Escape"&&y(void 0)};return r.addEventListener("keydown",k),()=>r.removeEventListener("keydown",k)},[r,g]);let M=(0,R.useRef)(s);M.current=s;let W=(0,R.useRef)(void 0);return W.current=n.inputActions??(o===void 0?void 0:e.actionsFor(o)),(0,R.useEffect)(()=>{if(r===void 0||N===void 0||p===void 0)return;let k=Hn(m?.argumentHint);if(k.length===0)return;let x=$n(r,p,k);return r.body.append(x),()=>x.remove()},[r,N,p,m]),(0,R.useEffect)(()=>{if(r===void 0||g===void 0)return;let k=zn(r,e,{name:g,profile:m,usage:A,box:p,sessionId:o,getActions:()=>W.current,getDraft:()=>M.current,onEnter:C,onLeave:()=>{b(),C(),F.current=setTimeout(()=>{F.current=null,y(void 0)},Ye)}});return r.body.append(k),()=>k.remove()},[r,g,m,A,p,o]),null}}function $n(e,t,n){let r=e.createElement("div");r.className="dsh-better-skill-hint",r.textContent=n.join(`
`);let o=t.right+Je>jn(e)-Wn;return r.style.left=`${o?t.left:t.right+Je}px`,r.style.top=`${o?t.bottom+2:t.top}px`,r}function zn(e,t,n){let r=e.createElement("div");r.className="dsh-better-skill-panel",r.addEventListener("pointerenter",n.onEnter),r.addEventListener("pointerleave",n.onLeave);let o=e.createElement("div");o.className="dsh-better-skill-panel-title",o.textContent=`/${n.name}`,r.append(o);let i=n.profile?.metadata??{},a=Object.keys(i);if(a.length>0){let s=e.createElement("div");s.className="dsh-better-skill-panel-section",s.append(me(e,t.translate("skill.metadata")));for(let l of a){let c=e.createElement("div");c.textContent=`${l}: ${i[l]??""}`,s.append(c)}r.append(s)}let d=n.profile?.path;if(d!==void 0&&d!==""){r.append(me(e,t.translate("skill.path")));let s=e.createElement("div");s.className="dsh-better-skill-panel-path",s.textContent=d,r.append(s)}if(n.usage!==void 0){let s=e.createElement("div");s.className="dsh-better-skill-panel-counts",s.textContent=`${t.translate("skill.usage.session")} ${n.usage.session}`,n.usage.workspace!==void 0&&(s.textContent+=` \xB7 ${t.translate("skill.usage.workspace")} ${n.usage.workspace}`),r.append(s)}let u=n.profile?.params??[];if(u.length>0&&n.getActions()?.insertText!==void 0){r.append(me(e,t.translate("skill.params")));for(let s of u)r.append(qn(e,t,n,s.flag,s.detail))}return n.box!==void 0&&(r.style.left=`${n.box.left}px`,r.style.top=`${n.box.bottom+4}px`),r}function me(e,t){let n=e.createElement("div");return n.className="dsh-better-skill-panel-label",n.textContent=t,n}function qn(e,t,n,r,o){let i=e.createElement("button");i.type="button",i.className="dsh-better-skill-panel-param",i.title=t.translate("skill.hint.insert"),i.addEventListener("pointerdown",d=>d.preventDefault());let a=e.createElement("span");if(a.className="dsh-better-skill-panel-param-flag",a.textContent=r,i.append(a),o!==""){let d=e.createElement("span");d.className="dsh-better-skill-panel-param-detail",d.textContent=o,i.append(d)}return i.addEventListener("click",()=>{let d=n.getActions();if(d?.insertText===void 0||d.captureInsertion===void 0)return;let u=d.captureInsertion();d.insertText(Bn(n.getDraft(),r),u)}),i}var tt="dsh-better/skill-enhancer.css",Un=`
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
  max-height: 420px;
  overflow: auto;
  box-sizing: border-box;
  padding: 10px 12px;
  border-radius: var(--dsw-radius-md);
  background: var(--dsw-alias-bg-elevated);
  box-shadow: var(--dsw-shadow-elevated);
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
  background: var(--dsw-alias-bg-hover);
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
`;function nt(e){if(e===void 0)return()=>{};let t=`style[data-plugin-css=${JSON.stringify(tt)}]`;if(e.querySelector(t)!==null)return()=>{};let n=e.createElement("style");return n.dataset.plugin="dsh-better",n.dataset.pluginCss=tt,n.textContent=Un,e.head.append(n),()=>n.remove()}var v=require("react");var Vn="@deepseek-ai/dsh-client-ui-commands/PopupSelectView.module.css";function rt(e){if(e===void 0)return;let n=e.querySelector(`style[data-plugin-css="${Vn}"]`)?.textContent??"",r=i=>new RegExp(`\\.(\\w+_${i})\\{`,"u").exec(n)?.[1],o={badges:"dshBetter_badges",badgeChip:"dshBetter_badgeChip",badgeChipOn:"dshBetter_badgeChipOn",card:r("card"),viewport:r("viewport"),row:r("row"),rowActive:r("rowActive"),label:r("label"),labelText:r("labelText"),badge:r("badge"),detail:r("detail"),check:r("check"),status:r("status"),search:r("search"),error:r("error"),errorText:r("errorText"),retry:r("retry")};for(let[i,a]of Object.entries(o))if(!(i==="badges"||i==="badgeChip"||i==="badgeChipOn")&&a===void 0)return;return o}function ye(e,t){for(let n of e)if(n.id===t.provider){for(let r of n.models)if(r.id===t.model)return r.reasoning}}function ot(e,t){let n=ye(e,t)?.efforts;return n===void 0?[]:[...n]}function it(e,t){if(e.length===0)return;let n=r=>r!==void 0&&e.some(o=>o.id===r);return n(t.remembered)?t.remembered:t.isCurrent&&n(t.currentEffort)?t.currentEffort:n(t.defaultEffort)?t.defaultEffort:e[0]?.id}function Gn(e){return e.length>1}function at(e){return Gn(e)?e:[]}var j=require("react/jsx-runtime");function ne(e){let t=e.group?.name;if(t===void 0)return;let n=`${t}/`,r=e.id.startsWith(n)?e.id.slice(n.length):e.id;return{provider:t,model:r}}function Kn(e,t){let n=ne(e);return at(n===void 0?[]:ot(t??[],n))}function st({option:e,active:t,catalog:n,pointed:r,classes:o,primitives:i,onChoose:a,onPickEffort:d,onHover:u,t:s}){let l=Kn(e,n),c=i.IconCheckOutlineRegular;return(0,j.jsxs)("div",{role:"option","aria-selected":t,"aria-label":e.badge===void 0?void 0:`${e.label} ${e.badge}`,className:t?`${o.row} ${o.rowActive}`:o.row,onClick:a,onMouseEnter:u,children:[(0,j.jsxs)("span",{className:o.label,children:[(0,j.jsx)("span",{className:o.labelText,children:e.label}),e.badge!==void 0&&(0,j.jsx)("sup",{className:o.badge,children:e.badge})]}),e.detail!==void 0&&(0,j.jsx)("span",{className:o.detail,children:e.detail}),l.length>0&&(0,j.jsx)("span",{className:o.badges,role:"group","aria-label":s?.("listbox.aria")??"",children:l.map(m=>(0,j.jsx)("button",{type:"button",className:m.id===r?`${o.badgeChip} ${o.badgeChipOn}`:o.badgeChip,title:m.description??m.name,onClick:f=>{f.stopPropagation(),d(m.id)},children:m.name},m.id))}),e.active===!0&&l.length===0&&(0,j.jsx)("span",{className:o.check,children:c===void 0?null:(0,j.jsx)(c,{})})]})}function re(e){let t=new Map;for(let n of e){let r=n.group?.name,o=t.get(r);o!==void 0?o.rows.push(n):t.set(r,{group:n.group,rows:[n]})}return[...t.values()]}function oe(e){let t=re(e);return t.some(n=>n.group!==void 0)?t.flatMap(n=>n.rows):[...e]}function lt(e,t,n){return n===void 0?e.filter(r=>r.label.toLowerCase().includes(t)):re(e).flatMap(r=>n(r.rows.map(o=>({name:o.label,option:o})),t).map(o=>o.option))}var he=new WeakSet;async function dt(e,t){let n=e.binding,r=e.state.getSnapshot();if(!(n===null||r.submitting||he.has(e))){he.add(e),e.state.set?.({...r,submitting:!0,confirming:null,acknowledged:!1,error:null});try{let o=t();if(o===void 0)return;await o,n!==null&&e.binding===n&&e.deps?.consume?.(n.segment)}finally{he.delete(e),n!==null&&e.binding===n&&e.dismiss({focusComposer:!0})}}}var Yn="@deepseek-ai/dsh-client-ui-primitives";function ie(e){if(e===null)return{};let t;try{t=e(Yn)}catch{return{}}if(t===null||typeof t!="object")return{};let n=t,r=y=>typeof y=="function"||typeof y=="object"&&y!==null,o=y=>{let p=n[y];return r(p)?p:void 0},i=y=>{let p=n[y];return typeof p=="function"?p:void 0},a={},d=o("MenuSurface");d!==void 0&&(a.MenuSurface=d);let u=o("MenuGroup");u!==void 0&&(a.MenuGroup=u);let s=o("IconCheckOutlineRegular");s!==void 0&&(a.IconCheckOutlineRegular=s);let l=o("IconDataOutlineRegular");l!==void 0&&(a.IconDataOutlineRegular=l);let c=o("IconChevronDownOutlineRegular");c!==void 0&&(a.IconChevronDownOutlineRegular=c);let m=i("useAnchoredMaxHeight");m!==void 0&&(a.useAnchoredMaxHeight=m);let f=i("observeStickyMenuGroups");f!==void 0&&(a.observeStickyMenuGroups=f);let g=i("rankByName");return g!==void 0&&(a.rankByName=g),a}function Jn(e){if(e===void 0)return[];let t=[e.name,e.label].map(n=>n.trim().toLowerCase()).filter(n=>n!=="");return[...new Set(t)]}function Xn(e,t){return Jn(e.group).some(n=>n.includes(t))}function Zn(e,t,n,r){return n==="fuzzy-label"?lt(e,t,r):oe(e).filter(o=>o.label.toLowerCase().includes(t)||o.detail?.toLowerCase().includes(t)===!0)}function ut(e,t,n,r){let o=t.trim().toLowerCase();if(o==="")return oe(e);let i=Zn(e,o,n,r),a=new Set(i),d=oe(e).filter(u=>!a.has(u)&&Xn(u,o));return[...i,...d]}var P=require("react/jsx-runtime"),gt="model",ct=320;function Qn(e){return e.command!==gt||!e.open||e.status!=="ready"||e.confirming!==null||e.options.length===0?!1:e.submitting||e.error===null}var er={subscribe:()=>()=>{},getSnapshot:()=>({open:!1,command:null,status:"pending",options:[],search:"",searchLabels:null,searchMode:"substring",active:0,submitting:!1,confirming:null,acknowledged:!1,error:null})};function mt(e){let t=ie(e.load);function n(r){let o=r.popup,i=o?.state??er,a=(0,v.useCallback)(l=>i.subscribe(l),[i]),d=(0,v.useCallback)(()=>i.getSnapshot(),[i]),u=(0,v.useSyncExternalStore)(a,d),s=e.native();return o===void 0||s===void 0?null:!Qn(u)||o.settle===void 0?(0,P.jsx)(s,{...r}):(0,P.jsx)(tr,{popup:o,state:u,t:r.t,primitives:t,doc:e.document,catalog:r.catalog,current:r.current,selectModel:r.selectModel})}return n}function tr({popup:e,state:t,t:n,primitives:r,doc:o,catalog:i,current:a,selectModel:d}){let u=(0,v.useRef)(null),s=(0,v.useRef)(null),l=(0,v.useRef)(null),c=(0,v.useMemo)(()=>rt(o),[o]),m=t.searchMode,f=(0,v.useMemo)(()=>ut(t.options,t.search,m,r.rankByName),[t.options,t.search,m,r.rankByName]),g=(0,v.useMemo)(()=>re(f),[f]),[y,p]=(0,v.useState)({}),[S,A]=(0,v.useState)(()=>pt(f));(0,v.useEffect)(()=>{A(pt(f))},[t.search,t.options]);let E=ft(f,S),I=nr(r,u,t);(0,v.useEffect)(()=>{let h=l.current;if(!(h===null||r.observeStickyMenuGroups===void 0))return r.observeStickyMenuGroups(h)},[r.observeStickyMenuGroups,t.open,t.status,g]),(0,v.useEffect)(()=>{u.current?.querySelector('[aria-selected="true"]')?.scrollIntoView({block:"nearest"})},[E,f]),(0,v.useEffect)(()=>{if(!t.open)return;let h=L=>{let O=u.current;O!==null&&L.target instanceof Node&&O.contains(L.target)||e.dismiss()};return o?.addEventListener("pointerdown",h,!0),()=>{o?.removeEventListener("pointerdown",h,!0)}},[o,e,t.open]),(0,v.useEffect)(()=>{s.current?.focus()},[t.open]);let N=(0,v.useCallback)((h,L)=>{if(L===void 0||d===void 0){e.settle?.(e.binding,h);return}let O=ne(h);if(O===void 0){e.settle?.(e.binding,h);return}dt(e,()=>d({...O,reasoningEffort:L}))},[e,d]),$=(0,v.useCallback)(h=>{let L=ne(h);if(L===void 0)return;let O=ye(i??[],L);return it(O?.efforts??[],{remembered:y[h.id],isCurrent:a?.provider===L.provider&&a?.model===L.model,currentEffort:a?.reasoningEffort,defaultEffort:O?.defaultEffort})},[i,a,y]),_=(0,v.useCallback)(h=>{N(h,$(h))},[$,N]),F=(0,v.useCallback)((h,L)=>{p(O=>({...O,[h.id]:L})),N(h,L)},[N]),b=(0,v.useCallback)(()=>{let h=f[E];h!==void 0&&_(h)},[E,_,f]),C=(0,v.useCallback)(h=>{f.length!==0&&A(L=>(ft(f,L)+h+f.length)%f.length)},[f]),M=h=>{switch(h.key){case"ArrowDown":h.preventDefault(),C(1);return;case"ArrowUp":h.preventDefault(),C(-1);return;case"Enter":h.preventDefault(),b();return;case"Tab":if(!h.shiftKey&&f.length===0)return;h.preventDefault(),h.shiftKey?e.dismiss({focusComposer:!0}):b();return;case"Escape":h.preventDefault(),e.dismiss({focusComposer:!0});return;default:}};if(c===void 0)return null;let W=t.searchLabels?.placeholder??n?.("search.placeholder")??"",k=t.searchLabels===null?n?.("status.empty")??"":t.options.length===0?t.searchLabels.empty:t.searchLabels.noResults,x=(h,L)=>(0,P.jsx)(st,{option:h,active:L===E,catalog:i,pointed:L===E?$(h):void 0,classes:c,primitives:r,onChoose:()=>{_(h)},onPickEffort:O=>{F(h,O)},onHover:()=>{A(L)},t:n},h.id),T=0,B=g.map(({group:h,rows:L})=>{let O=L.map(hn=>x(hn,T++));return h===void 0?(0,P.jsx)(v.Fragment,{children:O},"ungrouped"):r.MenuGroup===void 0?(0,P.jsx)(v.Fragment,{children:O},`group:${h.name}`):(0,P.jsx)(r.MenuGroup,{label:h.label,children:O},`group:${h.name}`)}),J=(0,P.jsxs)(P.Fragment,{children:[(0,P.jsx)("input",{ref:s,className:c.search,type:"text",placeholder:W,"aria-label":n?.("search.aria")??"",value:t.search,readOnly:t.submitting,onChange:h=>{e.setSearch(h.currentTarget.value)}}),t.submitting&&(0,P.jsx)("div",{className:c.status,children:n?.("status.applying")??""}),!t.submitting&&f.length===0&&(0,P.jsx)("div",{className:c.status,children:k}),f.length>0&&(0,P.jsx)("div",{ref:l,role:"listbox","aria-label":n?.("listbox.aria")??"",className:c.viewport,children:B})]}),q={className:c.card,style:{maxHeight:I},"aria-label":n?.("overlay.aria")??gt,onKeyDown:M};return r.MenuSurface===void 0?(0,P.jsx)("div",{ref:u,...q,children:J}):(0,P.jsx)(r.MenuSurface,{ref:u,...q,children:J})}function pt(e){let t=e.findIndex(n=>n.active===!0);return t===-1?0:t}function ft(e,t){return e.length===0?0:Math.min(Math.max(t,0),e.length-1)}function nr(e,t,n){let r=e.useAnchoredMaxHeight;return r===void 0?ct:r(t,ct,n)}var H=require("react");var be="application/x-dsh-composer+json";var rr=Object.freeze({png:"image/png",jpg:"image/jpeg",jpeg:"image/jpeg",webp:"image/webp",gif:"image/gif",bmp:"image/bmp",svg:"image/svg+xml",avif:"image/avif",heic:"image/heic",heif:"image/heif",tif:"image/tiff",tiff:"image/tiff"});function yt(e){return JSON.stringify({v:1,text:e.text,attachments:e.attachments.map(t=>({path:t.path,name:t.name,type:t.type,kind:t.kind}))})}function ht(e){if(typeof e!="string"||e==="")return;let t;try{t=JSON.parse(e)}catch{return}if(t===null||typeof t!="object")return;let n=t;if(n.v!==1)return;let r=typeof n.text=="string"?n.text:"",o=Array.isArray(n.attachments)?n.attachments:[],i=[];for(let a of o){if(a===null||typeof a!="object")continue;let d=a,u=d.path;typeof u!="string"||u===""||i.push({path:u,name:typeof d.name=="string"&&d.name!==""?d.name:Se(u),type:typeof d.type=="string"?d.type:"",kind:d.kind==="image"?"image":"file"})}return{text:r,attachments:i}}function ke(e,t){if(t.length===0)return e;let n=t.join(`
`);return e===""?n:`${e.replace(/\n+$/u,"")}

${n}`}function bt(e){if(e==="")return;let t=e.split(`
`),n=[],r=t.length;for(let i=t.length-1;i>=0;i-=1){let a=t[i]??"";if(a.trim()===""){if(n.length>0){r=i;continue}continue}let d=or(a);if(d===void 0)break;n.unshift(d),r=i}return n.length===0?void 0:{text:t.slice(0,r).join(`
`).replace(/\n+$/u,""),paths:n}}function or(e){let t=e.trim();if(t.startsWith("@")&&(t=t.slice(1)),t.startsWith('"')&&t.endsWith('"')&&t.length>1&&(t=t.slice(1,-1)),t!==""&&ir(t)&&!/[\u0000-\u001f\u007f]/u.test(t)&&!/["\u2018\u2019\u201c\u201d\u300c\u300d\u300e\u300f\u3002\uff01\uff1f\uff1b\uff1a\uff0c\u3001\u2026*?;<>|&$`!#=]/u.test(t)&&!/(?:^|\s)-{1,2}\S/u.test(t))return t}function ir(e){return e.startsWith("/")||/^[A-Za-z]:[/\\]/u.test(e)||e.startsWith("\\\\")}function kt(e){let t=/\.([A-Za-z0-9]+)$/u.exec(e);if(t!==null)return rr[t[1]?.toLowerCase()??""]}function Se(e){return e.split(/[\\/]/u).filter(n=>n!=="").at(-1)??e}function St(e,t){let n=new Set(t),r=[],o=[];for(let i of e){if(n.has(i.path)){o.push(i.path);continue}n.add(i.path),r.push(i)}return{accepted:r,duplicates:o}}var K=require("react/jsx-runtime"),ar="data-dsh-better-attach-item",sr="data-dsh-better-attach-selected",lr=4500,dr=new Set(["a","c","x","insert"]),ur=new Set(["meta","control","shift","alt","altgraph","capslock","os"]),cr=/\s/u;function vt(e){function t(n){let r=e.native();return r===void 0?null:(0,K.jsx)(pr,{native:r,props:n,deps:e})}return t}function pr({native:e,props:t,deps:n}){let r=(0,H.useRef)(null),[o,i]=(0,H.useState)(!1),[a,d]=(0,H.useState)(null),u=(t.attachments??[]).length>0,s=(0,H.useRef)(t);s.current=t;let l=(0,H.useRef)(o);l.current=o;let c=(f,g)=>t.t?.(f,g)??n.translate()?.(f,g)??"",m=(0,H.useRef)(c);return m.current=c,(0,H.useEffect)(()=>{let f=r.current;if(f===null)return;let g=f.querySelector('[role="group"]');if(g!==null)for(let y of Array.from(g.children)){if(!(y instanceof HTMLElement))continue;y.toggleAttribute(ar,!0);let p=mr(y);p!==null&&p.toggleAttribute(sr,o)}},[o,t.attachments]),(0,H.useEffect)(()=>{if(a===null)return;let f=globalThis.setTimeout(()=>{d(null)},lr);return()=>{globalThis.clearTimeout(f)}},[a]),(0,H.useEffect)(()=>{let f=r.current;if(f===null)return;let g=f.closest("[data-composer-card]");if(!(g instanceof HTMLElement))return;let y=g.ownerDocument,p=b=>(b instanceof Element?b:b instanceof Node?b.parentElement:null)?.closest("[contenteditable]")??null,S=()=>{l.current&&i(!1)},A=()=>{let b=g.ownerDocument.getSelection();return b!==null&&!b.isCollapsed&&b.toString()!==""},E=b=>b instanceof Node&&g.contains(b),I=b=>{let C=b.key.toLowerCase();if(ur.has(C))return;let M=b.metaKey||b.ctrlKey;if(M&&!b.altKey&&C==="a"){E(b.target)&&p(b.target)?.getAttribute("contenteditable")==="true"&&i(!0);return}if(M&&!b.altKey&&C==="c"&&l.current&&E(b.target)&&!A()){b.preventDefault(),fr(s.current,n,d,m.current);return}M&&!b.altKey&&dr.has(C)||S()},N=()=>{S()},$=b=>{let M=s.current.attachments??[],W=b.clipboardData;if(!l.current||M.length===0||W===null)return;let k=[],x=[];for(let T of M){let B=n.pathOf(T.file);if(B===""){x.push(T.file.name);continue}k.push({path:B,name:T.file.name,type:T.file.type,kind:T.kind})}if(k.length>0){let T=W.getData("text/plain");W.setData(be,yt({text:T,attachments:k})),W.setData("text/plain",ke(T,k.map(B=>B.path)))}x.length>0&&d(m.current("attach.copySkipped",{count:String(x.length)}))},_=b=>{let C=b.clipboardData;if(C===null||p(b.target)===null||Array.from(C.types).includes("Files"))return;let M=()=>s.current,W=ht(C.getData(be));if(W!==void 0){b.preventDefault(),b.stopPropagation(),S(),wt(W,M,n,d,m.current);return}let k=bt(C.getData("text/plain"));k!==void 0&&(b.preventDefault(),b.stopPropagation(),S(),wt({text:k.text,attachments:k.paths.map(x=>{let T=kt(x)??"";return{path:x,name:Se(x),type:T,kind:T===""?"file":"image"}})},M,n,d,m.current))};y.addEventListener("keydown",I,!0),g.addEventListener("paste",_,!0);let F=b=>{let C=b.relatedTarget;C instanceof Node&&g.contains(C)||S()};return g.addEventListener("focusout",F),y.addEventListener("copy",$),y.addEventListener("pointerdown",N,!0),()=>{y.removeEventListener("keydown",I,!0),y.removeEventListener("copy",$),g.removeEventListener("paste",_,!0),g.removeEventListener("focusout",F),y.removeEventListener("pointerdown",N,!0)}},[n]),(0,K.jsxs)("div",{ref:r,className:u?"dshBetter_railHost":"dshBetter_railHostEmpty",children:[(0,K.jsx)(e,{...t}),a!==null&&(0,K.jsx)("div",{className:"dshBetter_attachNotice",role:"status",children:a})]})}function fr(e,t,n,r){let o=e.attachments??[],i=[],a=0;for(let d of o){let u=t.pathOf(d.file);u===""?a+=1:i.push(u)}i.length>0&&globalThis.navigator?.clipboard?.writeText(ke("",i)).catch(()=>{n(r("attach.copyFailed"))}),a>0&&n(r("attach.copySkipped",{count:String(a)}))}function wt(e,t,n,r,o){let i=t();if(we(i,e.text),e.attachments.length===0)return;let a=n.reader(),d=i.sessionId;if(a===void 0||d===void 0){we(i,e.attachments.map(l=>l.path).join(`
`));return}let u=(i.attachments??[]).map(l=>n.pathOf(l.file)).filter(l=>l!==""),{accepted:s}=St(e.attachments,u);s.length!==0&&(async()=>{let l=[],c=[],m=0;for(let g of s){let y=await gr(a,d,g);y.kind==="file"?l.push(y.file):y.kind==="mention"?c.push(y.mention):m+=1}let f=t();c.length>0&&we(f,c.join(" ")),l.length>0&&f.onAddFiles?.(l),m>0&&r(o("attach.pasteMissing",{count:String(m)})),c.length>0&&r(o("attach.pasteReferenced",{count:String(c.length)}))})()}function we(e,t){if(t==="")return;let n=e.inputActions,r=n?.captureInsertion?.();n?.insertText===void 0||r===void 0||n.insertText(t,r)}async function gr(e,t,n){let r=await e.readBytes?.(t,n.path,{});if(r!==void 0&&r.ok)return{kind:"file",file:new File([r.value.data],n.name,{type:n.type})};let o=await e.stat?.(t,n.path);return o!==void 0&&o.ok?{kind:"mention",mention:yr(n.path)}:{kind:"missing"}}function mr(e){let t=e.querySelector("img")?.parentElement;if(t!=null)return t;let n=e.firstElementChild;return n instanceof HTMLElement?n:null}function yr(e){return cr.test(e)?`@"${e}"`:`@${e}`}var hr="better.focusComposer",br=Object.freeze(["focus input","focus composer","message input"]),X="command.focusComposer",kr=Object.freeze(["page","editable","terminal"]),Sr=Object.freeze({"desktop:macos":{code:"Space",modifiers:["primary"]},"desktop:windows":{code:"Space",modifiers:["primary","shift"]},"web:macos":{code:"Space",modifiers:["primary","shift"]},"web:windows":{code:"Space",modifiers:["primary","shift"]}}),wr="[data-composer-input], [role='textbox'][aria-multiline='true']";function Ct(e){return e===void 0||typeof e.querySelector!="function"?!1:e.querySelector(wr)!=null}function ve(e,t){if(e===null||typeof e!="object")return;let n=e.get;if(typeof n=="function"){let r=n.call(e,t);return r===null?void 0:r}return e[t]}var xt=e=>typeof e=="string"&&e!==""?e:void 0;function Lt(e){let n=ve(e,"uiSession")?.adapter?.current?.getSnapshot?.();if(n!==void 0)return xt(n.key);let r=ve(e,"sessions");return xt(r?.list?.getSnapshot?.()?.current)}function Rt(e,t){try{let n=e.sessions?.scope?.(t);if(n===void 0)return!1;let o=ve(n,"conversation")?.input?.for?.(n);return o===void 0||typeof o.focus!="function"?!1:(o.focus(),!0)}catch{return!1}}function vr(e){return(t={})=>{if(t.modal!=null)return{status:"pass"};if(!e.composerMounted())return{status:"pass"};let n=e.currentSessionId();return n===void 0?{status:"pass"}:{status:"handled",run:()=>{e.focusComposer(n)}}}}function xr(e,t){return{id:hr,label:t,aliases:br,defaults:Sr,regions:kr,modals:[],resolve:vr(e)}}function At(e,t,n,r){if(e===void 0||typeof e.register!="function")return()=>{};try{return e.register(xr(t,n))}catch(o){return r?.(o instanceof Error?o.message:String(o)),()=>{}}}var Et=Object.freeze({zh:{"overlay.aria":"\u9009\u62E9\u6A21\u578B","listbox.aria":"\u6A21\u578B\u5339\u914D\u9879","search.aria":"\u641C\u7D22\u4F9B\u5E94\u5546\u6216\u6A21\u578B","search.placeholder":"\u641C\u7D22\u4F9B\u5E94\u5546\u6216\u6A21\u578B\u2026","status.empty":"\u6CA1\u6709\u53EF\u7528\u7684\u6A21\u578B\u3002","status.applying":"\u6B63\u5728\u5207\u6362\u2026",retry:"\u91CD\u8BD5","trigger.selectAria":"\u9009\u62E9\u6A21\u578B","trigger.aria":"\u5F53\u524D\u6A21\u578B {model}\uFF0C\u70B9\u51FB\u5207\u6362","trigger.ariaEffort":"\u5F53\u524D\u6A21\u578B {model}\uFF0C\u63A8\u7406\u7B49\u7EA7 {effort}\uFF0C\u70B9\u51FB\u5207\u6362","trigger.fallback":"\u9009\u62E9\u6A21\u578B","trigger.loading":"\u52A0\u8F7D\u6A21\u578B\u2026",[X]:"\u805A\u7126\u8F93\u5165\u6846","attach.copySkipped":"{count} \u4E2A\u9644\u4EF6\u6765\u81EA\u526A\u8D34\u677F\u3001\u6CA1\u6709\u672C\u5730\u8DEF\u5F84\uFF0C\u672A\u590D\u5236","attach.pasteMissing":"{count} \u4E2A\u9644\u4EF6\u5BF9\u5E94\u7684\u6587\u4EF6\u5DF2\u4E0D\u5B58\u5728\uFF0C\u672A\u7C98\u8D34","attach.pasteReferenced":"{count} \u4E2A\u9644\u4EF6\u8D85\u51FA\u5355\u6B21\u8BFB\u53D6\u4E0A\u9650\uFF0C\u5DF2\u6539\u4E3A\u8DEF\u5F84\u5F15\u7528","attach.copyFailed":"\u6D4F\u89C8\u5668\u62D2\u7EDD\u4E86\u8FD9\u6B21\u526A\u8D34\u677F\u5199\u5165","compaction.reading":"\u538B\u7F29 {count} \u6B21","compaction.readingOne":"\u538B\u7F29 1 \u6B21","compaction.tooltip":"\u672C\u4F1A\u8BDD\u4E0A\u4E0B\u6587\u5DF2\u538B\u7F29 {count} \u6B21","compaction.tooltipWithFailures":"\u672C\u4F1A\u8BDD\u4E0A\u4E0B\u6587\u5DF2\u538B\u7F29 {count} \u6B21\uFF0C\u53E6\u6709 {failures} \u6B21\u538B\u7F29\u5931\u8D25","tabs.nav":"Tab \u7BA1\u7406","tabs.heading":"Tab \u7BA1\u7406","tabs.empty":"\u8FD8\u6CA1\u6709\u63D2\u4EF6\u6CE8\u518C\u4F1A\u8BDD\u6807\u7B7E\u3002","tabs.show":"\u5728\u6807\u7B7E\u680F\u663E\u793A{label}","tabs.hide":"\u4ECE\u6807\u7B7E\u680F\u9690\u85CF{label}","alias.nav":"\u6280\u80FD\u522B\u540D","alias.heading":"\u6280\u80FD\u522B\u540D","alias.prefix.title":"\u9700\u8981\u659C\u6760\u524D\u7F00","alias.prefix.on":"\u6253\u5F00\u5219\u9700\u8981\u8F93\u5165 \u201C/\u201D \u8FDB\u884C\u5339\u914D","alias.prefix.off":"\u6253\u5F00\u5219\u65E0\u9700\u8F93\u5165 \u201C/\u201D \u8FDB\u884C\u5339\u914D","alias.table.keyword":"\u5173\u952E\u8BCD","alias.table.target":"\u6280\u80FD\u6216\u547D\u4EE4","alias.table.params":"\u53C2\u6570","alias.table.paramsPlaceholder":"\u53EF\u9009\uFF0C\u5982 run","alias.table.actions":"\u64CD\u4F5C","alias.add":"\u6DFB\u52A0\u522B\u540D","alias.remove":"\u5220\u9664\u522B\u540D {keyword}","alias.unnamed":"\uFF08\u672A\u547D\u540D\uFF09","alias.empty":"\u8FD8\u6CA1\u6709\u522B\u540D\u3002\u4F8B\u5982\uFF1Awf \u2192 /flow-workflow run","alias.footnote":"\u8F93\u5165\u5173\u952E\u8BCD\u540E\u4ECE\u9762\u677F\u9009\u62E9\u5373\u53EF\u63D2\u5165\u5B8C\u6574\u8C03\u7528\uFF1B\u6539\u5B8C\u7ACB\u5373\u751F\u6548\u3002","alias.menu.section":"\u6280\u80FD\u522B\u540D","alias.menu.params":"\u53C2\u6570\uFF1A{value}","skill.metadata":"\u5143\u6570\u636E","skill.path":"\u5730\u5740","skill.usage.session":"\u672C\u4F1A\u8BDD\u8C03\u7528","skill.usage.workspace":"\u672C\u5DE5\u4F5C\u533A\u8C03\u7528","skill.params":"\u53C2\u6570","skill.hint.insert":"\u70B9\u51FB\u63D2\u5165"},en:{"overlay.aria":"Select a model","listbox.aria":"Matching models","search.aria":"Search providers or models","search.placeholder":"Search providers or models\u2026","status.empty":"No models available.","status.applying":"Switching\u2026",retry:"Retry","trigger.selectAria":"Select model","trigger.aria":"Current model {model}, click to change","trigger.ariaEffort":"Current model {model}, reasoning effort {effort}, click to change","trigger.fallback":"Select model","trigger.loading":"Loading models\u2026",[X]:"Focus message input","attach.copySkipped":"{count} attachment(s) came from the clipboard with no local path and were not copied","attach.pasteMissing":"{count} attachment(s) no longer exist and were not pasted","attach.pasteReferenced":"{count} attachment(s) exceed the read limit and became path references","attach.copyFailed":"The browser refused this clipboard write","compaction.reading":"{count} compactions","compaction.readingOne":"1 compaction","compaction.tooltip":"This session's context was compressed {count} time(s)","compaction.tooltipWithFailures":"This session's context was compressed {count} time(s), with {failures} failed attempt(s)","tabs.nav":"Tabs","tabs.heading":"Tabs","tabs.empty":"No plugin has registered a conversation tab yet.","tabs.show":"Show {label} in the tab bar","tabs.hide":"Hide {label} from the tab bar","alias.nav":"Skill aliases","alias.heading":"Skill aliases","alias.prefix.title":"Require a slash prefix","alias.prefix.on":"To open, type \u201C/\u201D to match","alias.prefix.off":"To open, type the keyword without \u201C/\u201D to match","alias.table.keyword":"Keyword","alias.table.target":"Skill or command","alias.table.params":"Arguments","alias.table.paramsPlaceholder":"Optional, e.g. run","alias.table.actions":"Actions","alias.add":"Add alias","alias.remove":"Delete alias {keyword}","alias.unnamed":"(unnamed)","alias.empty":"No aliases yet. For example: wf \u2192 /flow-workflow run","alias.footnote":"Type a keyword and pick from the panel to insert the full invocation; changes apply immediately.","alias.menu.section":"Skill aliases","alias.menu.params":"args: {value}","skill.metadata":"Metadata","skill.path":"Path","skill.usage.session":"This session","skill.usage.workspace":"This workspace","skill.params":"Arguments","skill.hint.insert":"Click to insert"}});var Tt="dsh-better-effort",Cr=`
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
`;function Pt(e){if(e===void 0)return()=>{};if(e.getElementById(Tt)!==null)return()=>{};let t=e.createElement("style");return t.id=Tt,t.textContent=Cr,e.head.append(t),()=>{t.remove()}}var Nt="dsh-better.layout-widths",Y=Object.freeze({sidebar:null,rightbar:null});function Mt(e){return typeof e=="number"&&Number.isFinite(e)&&e>0}function ae(e){if(e===void 0)return Y;let t;try{t=e.getItem(Nt)}catch{return Y}if(t===null||t==="")return Y;let n;try{n=JSON.parse(t)}catch{return Y}if(typeof n!="object"||n===null||Array.isArray(n))return Y;let r=n;return{sidebar:Ot(r.sidebar),rightbar:Ot(r.rightbar)}}function Dt(e,t){if(e===void 0)return;let n={};t.sidebar!==null&&(n.sidebar=Math.round(t.sidebar)),t.rightbar!==null&&(n.rightbar=Math.round(t.rightbar));try{e.setItem(Nt,JSON.stringify(n))}catch{}}function Ot(e){return Mt(e)?Math.round(e):null}function _t(e){if(typeof e!="string")return Y;let t=e.trim().split(/\s+/).filter(n=>n!=="");return{sidebar:It(t[0]),rightbar:It(t[2])}}function It(e){if(e===void 0)return null;let t=/^([0-9]+(?:\.[0-9]+)?)px$/.exec(e);if(t===null)return null;let n=Number(t[1]);return Mt(n)?Math.round(n):null}function Ft(e,t,n=null){return n==="sidebar"?t.sidebar!==null&&t.sidebar!==e.sidebar?{sidebar:t.sidebar}:{}:n==="rightbar"?t.rightbar!==null&&t.rightbar!==e.rightbar?{rightbar:t.rightbar}:{}:t.sidebar!==null&&t.sidebar!==e.sidebar?{sidebar:t.sidebar}:t.rightbar!==null&&t.rightbar!==e.rightbar?{rightbar:t.rightbar}:{}}function Wt(e,t){return{sidebar:t.sidebar??e.sidebar,rightbar:t.rightbar??e.rightbar}}function Bt(e){let t=[];return e.sidebar!==null&&t.push({column:"sidebar",width:e.sidebar}),e.rightbar!==null&&t.push({column:"rightbar",width:e.rightbar}),t}var Lr="[data-shell-bottom]",Rr="[data-side]",Ar='[class*="_sidebarCol"]',Er='[class*="_rightbarCol"]',Tr=600;function Pr(e){let n=e?.layout?.panels;if(typeof n!="object"||n===null)return;let r=n;if(!(typeof r.setSidebar!="function"&&typeof r.setRightbar!="function"))return r}function $t(e,t){let n=Pr(e);if(n===void 0)return!1;let r=!1;for(let{column:o,width:i}of Bt(t)){let a=o==="sidebar"?n.setSidebar:n.setRightbar;if(a!==void 0)try{a.call(n,i),r=!0}catch{}}return r}function Ht(e){return e.querySelector(Lr)?.parentElement??null}function Or(e,t){let n=e.hasAttribute("data-sidebar-collapsed"),r=e.hasAttribute("data-rightbar-collapsed"),o=_t(t?.getComputedStyle(e).gridTemplateColumns);return{sidebar:n?null:o.sidebar??jt(e.querySelector(Ar)),rightbar:r?null:o.rightbar??jt(e.querySelector(Er))}}function jt(e){if(e===null)return null;let t=e.getBoundingClientRect().width;return Number.isFinite(t)&&t>0?Math.round(t):null}function zt(e){let{document:t,storage:n}=e,r=null,o=null,i=0,a=!1,d=null,u=()=>t.defaultView,s=()=>(r!==null&&r.isConnected||(r=Ht(t)),r),l=()=>{let p=s();return p===null?null:Or(p,u())},c=p=>{let S=p?.getAttribute("data-side");return S==="sidebar"||S==="rightbar"?S:null},m=p=>{let S=l();if(S===null)return;let A=Ft(p.before,S,p.side);A.sidebar===void 0&&A.rightbar===void 0||Dt(n,Wt(ae(n),A))},f=p=>{if(d!==null)return;let S=p.target,A=typeof S?.closest=="function"?S.closest(Rr):null;if(A===null)return;let E=l();E!==null&&(d={side:c(A),before:E})},g=()=>{let p=d;if(d=null,p===null)return;let S=u()?.requestAnimationFrame;if(S===void 0){m(p);return}S.call(u(),()=>m(p))},y=()=>{if(o=null,a)return;let p=Ht(t);if(p!==null){r=p;return}if(i>=Tr)return;i+=1;let S=u()?.requestAnimationFrame;S!==void 0&&(o=S.call(u(),y))};return{attach(){a=!1,i=0;let p=u();return p?.addEventListener("pointerdown",f,!0),p?.addEventListener("pointerup",g,!0),p?.addEventListener("pointercancel",g,!0),y(),()=>{a=!0,d=null,r=null,p?.removeEventListener("pointerdown",f,!0),p?.removeEventListener("pointerup",g,!0),p?.removeEventListener("pointercancel",g,!0),o!==null&&p?.cancelAnimationFrame(o),o=null}}}}var qt="sessionCompaction";var Ut="dsh-better-compaction",se="dshBetter_compactionStat",Ir=`
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
`;function Vt(e){if(e===void 0)return()=>{};if(e.getElementById(Ut)!==null)return()=>{};let t=e.createElement("style");return t.id=Ut,t.textContent=Ir,e.head.append(t),()=>{t.remove()}}var Kt=require("react/jsx-runtime");function Nr(e,t){if(e===void 0||t===void 0)return null;let{compactions:n,failures:r}=e;if(!Number.isSafeInteger(n)||n<=0)return null;let o=n===1?t("compaction.readingOne"):t("compaction.reading",{count:n}),i=Number.isSafeInteger(r)&&r>0?t("compaction.tooltipWithFailures",{count:n,failures:r}):t("compaction.tooltip",{count:n});return{text:o,tooltip:i}}function Mr(){}function Gt({useProjection:e,t}){let r=Nr((e??Mr)(qt),t);return r===null?null:(0,Kt.jsx)("span",{className:se,"data-dsh-better":"compaction-stat",title:r.tooltip,children:r.text})}var xe="conversation.composer.dock",Yt="better-compaction";var Z=require("react");function Dr(e){let t=e.name.trim();return t===""?e.id:t}function Jt(e,t){if(e===void 0)return t;let n=Dr(e.group),r=e.model.name.trim();return r===""?n:`${n} ${r}`}var z=require("react/jsx-runtime"),_r="@deepseek-ai/dsh-client-ui-model-selection/ModelSelect.module.css";function Fr(e){if(e===void 0)return;let n=e.querySelector(`style[data-plugin-css="${_r}"]`)?.textContent??"",r=i=>new RegExp(`\\.(\\w+_${i})\\{`,"u").exec(n)?.[1],o={root:r("root"),trigger:r("trigger"),triggerIcon:r("triggerIcon"),triggerLabel:r("triggerLabel"),triggerEffort:r("triggerEffort"),chevron:r("chevron")};for(let i of Object.values(o))if(i===void 0)return;return o}function Xt(e){let t=ie(e.load),n=Fr(e.document);function r(o){let i=e.native();return o.available===!1||i===void 0||n===void 0?i===void 0?null:(0,z.jsx)(i,{...o}):(0,z.jsx)(Wr,{props:o,primitives:t,openPicker:e.openPicker,translate:e.translate,classes:n})}return r}function Wr({props:e,primitives:t,openPicker:n,translate:r,classes:o}){let{directory:i,t:a,sessionId:d,locked:u}=e,s=Br(i),l=a??r(),c=s?.current??null,m=c===null&&s?.status==="loading",f=Hr(s,c),g=m?l?.("trigger.loading")??"":Jt(f,l?.("trigger.fallback")??""),y=jr(s,c,f,l),p=y===void 0?g:`${g} \xB7 ${y}`,S=m?l?.("trigger.loading")??"":c===null?l?.("trigger.selectAria")??"":y===void 0?l?.("trigger.aria",{model:g})??"":l?.("trigger.ariaEffort",{model:g,effort:y})??"",A=()=>{n(d)},E=t.IconDataOutlineRegular,I=t.IconChevronDownOutlineRegular;return(0,z.jsx)("div",{className:o.root,"data-dsh-better-seat":"",children:(0,z.jsxs)("button",{type:"button",className:o.trigger,"aria-label":S,"aria-haspopup":"dialog","aria-expanded":"false",title:p,disabled:u,onClick:A,children:[E===void 0?null:(0,z.jsx)(E,{className:o.triggerIcon,size:16}),(0,z.jsx)("span",{className:o.triggerLabel,"data-provider-id":c?.provider,"data-model-id":c?.model,children:g}),y!==void 0&&(0,z.jsx)("span",{className:o.triggerEffort,children:y}),I===void 0?null:(0,z.jsx)(I,{className:o.chevron})]})})}function Br(e){let t=(0,Z.useCallback)(r=>e===void 0?()=>{}:e.subscribe(r),[e]),n=(0,Z.useCallback)(()=>e?.getSnapshot(),[e]);return(0,Z.useSyncExternalStore)(t,n)}function Hr(e,t){if(!(e===void 0||t===null||t===void 0)){for(let n of e.groups)if(n.id===t.provider){for(let r of n.models)if(r.id===t.model)return{group:n,model:r}}}}function jr(e,t,n,r){if(e===void 0||t===null||t===void 0)return;let o=n?.model.reasoning,i=t.reasoningEffort??o?.defaultEffort;return n===void 0?e.retainedEffort:o===void 0||i===void 0?void 0:o.efforts?.find(d=>d.id===i)?.name??i}function Zt(e){let r=e?.live?.contributions?.get("model")?.ui;return r==null?void 0:r.kind==="popupSelect"?r:void 0}function Qt(e){return{sessionId:e}}function en(){return{via:"enter",token:""}}var $r=`
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
`,tn="dsh-better/tabs.css";function nn(e){let t=`style[data-plugin-css=${JSON.stringify(tn)}]`;if(e.querySelector(t)!==null)return()=>{};let n=e.createElement("style");return n.dataset.plugin="dsh-better",n.dataset.pluginCss=tn,n.textContent=$r,e.head.append(n),()=>n.remove()}function rn(e){let t;return e.React.createElement("section",{"data-dsh-better-tabs":"",ref:n=>{if(t?.(),t=void 0,n===null)return;let r=()=>{zr(n,e)};r(),t=e.controller.subscribe(r)}})}function zr(e,t){let n=e.ownerDocument,{controller:r,copy:o}=t;e.replaceChildren();let i=n.createElement("h2");i.setAttribute("data-dsh-better-tabs-heading",""),i.textContent=o.heading,e.append(i);let a=r.rows();if(a.length===0){let d=n.createElement("p");d.setAttribute("data-dsh-better-tabs-empty",""),d.textContent=o.empty,e.append(d);return}for(let d of a){let u=n.createElement("label");u.setAttribute("data-dsh-better-tabs-row",d.id);let s=n.createElement("span");s.setAttribute("data-dsh-better-tabs-name",""),s.textContent=d.label;let l=n.createElement("input");l.setAttribute("data-dsh-better-tabs-check",d.id),l.type="checkbox",l.checked=d.enabled,l.setAttribute("aria-label",o.checkboxLabel(d.label,d.enabled)),l.addEventListener("change",()=>{r.setEnabled(d.id,l.checked)}),u.append(s,l),e.append(u)}}var Ce="conversation.view",Le="settings.section",an="tabs";var de="chat",sn="dsh-better.tabs",Q="[data-conversation-tabs]";function ln(e,t){if(typeof e=="string"&&e!=="")return e;if(typeof e=="function")try{let n=e();if(typeof n=="string"&&n!=="")return n}catch{}return t}function qr(e){if(e===void 0)return new Set;let t;try{t=e.getItem(sn)}catch{return new Set}if(t===null||t==="")return new Set;try{let n=JSON.parse(t);if(!Array.isArray(n))return new Set;let r=new Set;for(let o of n)typeof o=="string"&&o!==""&&o!==de&&r.add(o);return r}catch{return new Set}}function Ur(e,t){if(e!==void 0)try{e.setItem(sn,JSON.stringify([...t].sort()))}catch{}}function Vr(e,t){let n=[],r=new Set;for(let o of e){let i=o.options.id;i===void 0||i===de||r.has(i)||(r.add(i),n.push({id:i,label:ln(o.options.label,i),enabled:!t.has(i)}))}return n}function Gr(e){let t=[],n=new Set;for(let r of e){let o=r.options.id;o===void 0||o===de||n.has(o)||(n.add(o),t.push({id:o,label:ln(r.options.label,o)}))}return t}function Kr(e,t,n){let r=new Set;for(let o of Gr(e)){if(!t.has(o.id)||o.label==="")continue;n.filter(a=>a.label===o.label).length===1&&r.add(o.label)}return n.map(o=>r.has(o.label))}function Yr(e,t){for(let n of e)if(t!==null&&(n.target===t||t.contains?.(n.target)===!0)||on(n.addedNodes,t)||on(n.removedNodes,t))return!0;return!1}function on(e,t){if(e===void 0)return!1;for(let n=0;n<e.length;n+=1){let r=e[n];if(r!==void 0&&(r.matches?.(Q)===!0||r.querySelector?.(Q)!=null||t!==null&&r.contains?.(t)===!0))return!0}return!1}function Jr(e){let t=e.querySelector(Q);if(t===null||typeof t!="object")return;let r=t.querySelectorAll?.(":scope > button[role='tab']");if(r===void 0)return;let o=[];for(let i=0;i<r.length;i+=1){let a=r[i];a!==void 0&&o.push({label:Xr(a),hidden:a.hasAttribute(le),mark:d=>{d?a.setAttribute(le,""):a.removeAttribute(le)}})}return o}function Xr(e){return(e.querySelector?.("[class*='tabLabel']")?.textContent??e.textContent??"").trim()}function Zr(e,t){let n=!1;for(let[r,o]of e.entries()){let i=t[r]??!1;i!==o.hidden&&(o.mark(i),n=!0)}return n}function dn(e){let{ledger:t,storage:n}=e,r=e.readButtons??Jr,o=e.watch??to,i=new Set(qr(n)),a=new Set,d,u=()=>{for(let l of[...a])l()},s=30;return{rows:()=>Vr(t.entriesOfSlot(Ce),i),setEnabled(l,c){if(l===de)return!1;let m=i.has(l);return c===!m?!1:(c?i.delete(l):i.add(l),Ur(n,i),d?.(),u(),!0)},subscribe(l){return a.add(l),()=>{a.delete(l)}},attach(l){let c=l.createElement("style");c.dataset.plugin="dsh-better",c.dataset.pluginCss=Qr,c.textContent=eo,l.head.append(c);let m=l.defaultView?.requestAnimationFrame?.bind(l.defaultView),f=l.defaultView?.cancelAnimationFrame?.bind(l.defaultView),g=m===void 0?0:s,y,p=()=>{let E=t.entriesOfSlot(Ce),I=r(l);if(I===void 0||I.length===0){g>0&&m!==void 0&&(g-=1,y=m(()=>p()));return}g=s,y=void 0,Zr(I,Kr(E,i,I))},S=t.subscribe(Ce,p),A=o(l,p);return d=p,p(),()=>{S(),A(),d=void 0,y!==void 0&&f?.(y),c.remove()}}}}var Qr="dsh-better/strip.css",le="data-dsh-better-tab-hidden",eo=`${Q} > button[${le}] { display: none; }`;function to(e,t){let n=e.defaultView?.MutationObserver,r=e.documentElement;if(n===void 0||r===void 0)return()=>{};let o=new n(i=>{let a=e.querySelector(Q);Yr(i,a!==null&&typeof a=="object"?a:null)&&t()});return o.observe(r,{childList:!0,subtree:!0}),()=>o.disconnect()}var V="conversation.input.overlay",un="settings.section",oo="aliases",io=56,ao="alias-watcher",fn=50,so="skill-enhancer",lo=fn+1,Re="conversation.input.model",Ae="conversation.input.attachments",uo=-50,co=-60,gn="command-popup",po=-100,D="better",fo="/better/api/skill-profile",go=5e3,ue=null;function mn(e,t){let n,r=Number.POSITIVE_INFINITY;for(let o of e){if(o.options.id!==gn)continue;let i=o.component;if(typeof i!="function"||t!==void 0&&i===t)continue;let a=o.options.priority??0;a<r&&(n=i,r=a)}return n}var yn={name:"dsh-better",inject:["slots","sessions","commandUi","conversation","locale","modelDirectories","remote","remote.session"],apply(e){let t=globalThis.document;e.effect(()=>e.locale.register(D,Et),"dsh-better: locale"),e.effect(()=>Pt(t),"dsh-better: effort badge stylesheet"),e.effect(()=>Vt(t),"dsh-better: compaction count stylesheet");let n=Oe(Ee()),r=Lo(e),o={open:!1};e.effect(()=>{let u=Ee(),s=ae(u);e.inject?.(["layout"],m=>{$t(m,s)});let c=(t===void 0?void 0:zt({document:t,storage:u}))?.attach();return()=>{c?.()}},"dsh-better: panel width memory"),e.effect(()=>e.slots.inject(xe,()=>e.slots.register({name:xe,id:Yt,order:-1,locale:D},Gt)),"dsh-better: compaction count"),e.effect(()=>e.slots.inject(V,()=>{let u={},l=mt({load:ue,native:()=>mn(e.slots.entries(V),u.component),document:t});return u.component=l,e.slots.register({name:V,id:gn,priority:po,locale:D,inject:c=>{let m=bo(e,c);return{popup:ho(e,c),catalog:m?.groups,current:m?.current??null,selectModel:f=>e.modelDirectories?.directoryFor?.(c)?.select?.(f)}}},l)}),"dsh-better: /model provider search"),e.effect(()=>e.slots.inject(Re,()=>{let u={},l=Xt({load:ue,native:()=>Te(e.slots.entries(Re),u.component),openPicker:c=>mo(e,c),translate:()=>yo(e),document:t});return u.component=l,e.slots.register({name:Re,priority:uo,locale:D,inject:c=>({sessionId:c,available:!0,directory:e.modelDirectories?.directoryFor?.(c)?.store})},l)}),"dsh-better: composer model trigger");let i;e.inject?.(["remote.workspaceFiles"],u=>{i=u["remote.workspaceFiles"],u.effect(()=>()=>{i=void 0},"dsh-better: workspace file reader")}),e.effect(()=>e.slots.inject(Ae,()=>{let u={},l=vt({native:()=>Te(e.slots.entries(Ae),u.component),pathOf:ko,reader:()=>i,translate:()=>e.locale.bind?.(D)});return u.component=l,e.slots.register({name:Ae,priority:co,locale:D,inject:c=>({sessionId:c})},l)}),"dsh-better: composer attachment selection");let a;e.inject?.(["inputTriggers"],u=>{a=u.inputTriggers,u.effect(()=>()=>{a=void 0},"dsh-better: alias trigger service"),u.effect(()=>u.inputTriggers.registerSource(je({config:()=>n.getSnapshot(),translate:r,bareMenuOpen:()=>o.open,routeCommand:(s,l)=>Co(e,l)})),"dsh-better: alias slash source")}),e.effect(()=>e.slots.inject(V,()=>{let u=Ve({store:n,bareMenuOpen:o,inputStoreFor:s=>{let l=e.sessions.scope?.(s);if(!(l===void 0||e.conversation===void 0))try{return e.conversation.input?.for?.(l)?.state}catch{return}},controllerFor:s=>{let l=e.sessions.scope?.(s);if(l===void 0)return;let c=ce(e,"inputTriggers")??a;if(c!==void 0)try{return c.sessionOf(l)}catch{return}}});return pn(e.slots,{name:V,id:ao,order:fn,inject:s=>({sessionId:s})},u)}),"dsh-better: alias selector watcher"),e.effect(()=>nt(t),"dsh-better: skill enhancer stylesheet"),e.effect(()=>e.slots.inject(V,()=>{let u=et({scopeFor:s=>e.sessions.scope?.(s),inputStoreFor:s=>{let l=e.sessions.scope?.(s);if(!(l===void 0||e.conversation===void 0))try{return e.conversation.input?.for?.(l)?.state}catch{return}},actionsFor:s=>{let l=e.sessions.scope?.(s);if(!(l===void 0||e.conversation===void 0))try{return e.conversation.input?.for?.(l)}catch{return}},skillNamesFor:So(e),loadProfile:(s,l)=>wo(e,s,l),loadUsage:(s,l)=>vo(e,s,l),translate:r,document:t});return pn(e.slots,{name:V,id:so,order:lo,inject:s=>({sessionId:s})},u)}),"dsh-better: skill enhancer"),e.effect(()=>e.slots.inject(un,()=>{let u=t===void 0?void 0:ze(t),s=He({store:n,translate:r}),l=cn(e.slots,{name:un,id:oo,order:io,label:()=>e.locale.bind?.(D)?.("alias.nav")??"Skill aliases",locale:D},s);return()=>{l(),u?.()}}),"dsh-better: alias settings page");let d=dn({ledger:xo(e.slots),storage:Ee()});e.effect(()=>e.slots.inject(Le,()=>{let u=globalThis.document,s=u===void 0?void 0:nn(u),l=cn(e.slots,{name:Le,id:an,order:55,label:()=>e.locale.bind?.(D)?.("tabs.nav")??"Tabs"},()=>{let c=Ro(ue);return c===null?null:rn({React:c,controller:d,copy:Ao(e)})});return()=>{l(),s?.()}}),"dsh-better: tab management"),e.effect(()=>d.attach(t),"dsh-better: tab visibility"),e.inject?.(["shortcuts"],u=>{u.effect(()=>At(u.shortcuts,{currentSessionId:()=>Lt(e),composerMounted:()=>Ct(t),focusComposer:s=>Rt(e,s)},()=>e.locale.bind?.(D)?.(X)??"Focus message input",s=>console.warn(`dsh-better: focus command not registered (${s})`)),"dsh-better: focus composer shortcut")})}};function Te(e,t){let n,r=Number.POSITIVE_INFINITY;for(let o of e){let i=o.component;if(typeof i!="function"||t!==void 0&&i===t)continue;let a=o.options.priority??0;a<r&&(n=i,r=a)}return n}function mo(e,t){if(t===void 0)return!1;let n=Zt(e.commandUi);if(n===void 0)return!1;let r=e.sessions.scope?.(t);if(r===void 0)return!1;let o=e.commandUi.popupFor?.(r);return o===void 0||typeof o.open!="function"?!1:(o.open("model",n,Qt(t),en()),!0)}function yo(e){return e.locale?.bind?.(D)}function ho(e,t){let n=e.sessions.scope?.(t);if(n!==void 0)return e.commandUi.popupFor?.(n)}function bo(e,t){return e.modelDirectories?.directoryFor?.(t)?.store.getSnapshot()}function ko(e){let t=globalThis.__DSH_HOST_PATHS__;if(t?.pathFor===void 0)return"";try{let n=t.pathFor(e);return typeof n=="string"?n:""}catch{return""}}function cn(e,t,n){return(e.registerUntyped??e.register).call(e,t,n)}function pn(e,t,n){return(e.registerUntyped??e.register).call(e,t,n)}function So(e){let t=new Map,n=new Map;return async r=>{let o=t.get(r);if(o!==void 0)return o;let i=n.get(r);if(i!==void 0&&Date.now()-i<go)return new Set;let a=ce(e,"remote.skills");if(a===void 0)return new Set;try{let d=await a.list({sessionId:r});if(!d.ok)return n.set(r,Date.now()),new Set;let u=new Set(d.value.skills.map(s=>s.name));return t.set(r,u),n.delete(r),u}catch{return n.set(r,Date.now()),new Set}}}async function wo(e,t,n){let r=`?sessionId=${encodeURIComponent(t)}&name=${encodeURIComponent(n)}`;try{let o=await fetch(`${fo}${r}`,{headers:{accept:"application/json"}});return o.ok?await o.json():void 0}catch{return}}function vo(e,t,n){let r=e.sessionsList??ce(e,"sessions.list");try{let i=r?.getSnapshot?.()?.projectionsBySession?.[t]?.values?.skillUsage?.counts?.[n];return{session:typeof i=="number"?i:0}}catch{return{session:0}}}function xo(e){return{entriesOfSlot:t=>(e.entriesOfSlot??e.entries).call(e,t),subscribe:(t,n)=>e.subscribe?.(t,n)??(()=>{})}}function Ee(){try{return globalThis.localStorage}catch{return}}function ce(e,t){try{return typeof e.get=="function"?e.get(t):e[t]}catch{return}}function Co(e,t){let n=t.session?.sessionId;if(n===void 0)return;let r=e.sessions.scope?.(n);if(r===void 0)return;let o=ce(e,"inputTriggers");if(o!==void 0)try{let i=o.sessionOf(r),a=e.conversation?.input?.for?.(r)?.state,d=0,u=()=>{let s=a?.getSnapshot();if(!(s===void 0||s.draft.trim()===""||!s.draft.startsWith("/"))){try{let l=s.draft.trimStart().split(/\s/u)[0]??"";if(!l.startsWith("/")||(i.track?.(l,l.length,{tier:"plain"},s.draftRev),i.onSpace?.()===!0))return;i.dismiss?.()}catch{}d+=1,d<4&&setTimeout(u,25)}};setTimeout(u,0)}catch{}}function Lo(e){return(t,n)=>{try{return e.locale.bind?.(D)?.(t,n)??t}catch{return t}}}function Ro(e){if(e===null)return null;try{let t=e("react");if(typeof t!="object"||t===null)return null;let n=t;return typeof n.createElement=="function"?n:null}catch{return null}}function Ao(e){let t=e.locale.bind?.(D),n=(r,o)=>t?.(r)??o;return{heading:n("tabs.heading","Tabs"),empty:n("tabs.empty","No plugin has registered a conversation tab yet."),checkboxLabel:(r,o)=>n(o?"tabs.hide":"tabs.show","{label}").replace("{label}",r)}}function Eo(e){ue=e}var To=yn;

    // Hand the loader's `require` to the module's `boot` export before the
    // plugin mounts. Read from `module.exports` rather than the default export:
    // esbuild emits named exports there and the plugin object separately, so the
    // default export alone never carries `boot`.
    if (typeof module.exports.boot === "function") module.exports.boot(require);
    return module.exports.default ?? module.exports;
  }
});
