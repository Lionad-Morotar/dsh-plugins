window.__ModuleLoader__.load({
  id: "dsh-better",
  factory: (require) => {
    var module = { exports: {} };
    var exports = module.exports;
"use strict";var pe=Object.defineProperty;var Cn=Object.getOwnPropertyDescriptor;var Ln=Object.getOwnPropertyNames;var Rn=Object.prototype.hasOwnProperty;var An=(e,t)=>{for(var n in t)pe(e,n,{get:t[n],enumerable:!0})},En=(e,t,n,r)=>{if(t&&typeof t=="object"||typeof t=="function")for(let o of Ln(t))!Rn.call(e,o)&&o!==n&&pe(e,o,{get:()=>t[o],enumerable:!(r=Cn(t,o))||r.enumerable});return e};var Tn=e=>En(pe({},"__esModule",{value:!0}),e);var Wo={};An(Wo,{boot:()=>_o,clientPlugin:()=>wn,default:()=>Fo,findShadowed:()=>Sn,findShadowedSingle:()=>Oe,readSkillUsage:()=>vn});module.exports=Tn(Wo);var te=require("react");var Ie="dsh-better.skill-aliases";var G=Object.freeze({prefix:!0,rows:Object.freeze([])});function Pn(e,t){if(e!==void 0)try{e.setItem(Ie,JSON.stringify({v:1,prefix:t.prefix,rows:t.rows}))}catch{}}function ee(e,t){return typeof e=="string"?e:t}function On(e,t){if(typeof e!="object"||e===null||Array.isArray(e))return;let n=e;if(!(typeof n.keyword!="string"&&typeof n.target!="string"&&typeof n.params!="string"))return{id:ee(n.id,`alias-${t}`)||`alias-${t}`,keyword:ee(n.keyword,""),target:ee(n.target,""),params:ee(n.params,"")}}function In(e){if(typeof e!="object"||e===null||Array.isArray(e))return G;let t=e,n=typeof t.prefix=="boolean"?t.prefix:G.prefix,r=Array.isArray(t.rows)?t.rows:[],o=[],i=new Set;for(let[s,l]of r.slice(0,200).entries()){let c=On(l,s);if(c===void 0)continue;let d=c.id,a=0;for(;i.has(d);)a+=1,d=`alias-${s}-${a}`;i.add(d),o.push({...c,id:d})}return{prefix:n,rows:o}}function Nn(e){if(e===void 0)return G;let t;try{t=e.getItem(Ie)}catch{return G}if(t===null||t==="")return G;try{return In(JSON.parse(t))}catch{return G}}function Mn(){let e=globalThis.crypto;return e?.randomUUID!==void 0?e.randomUUID():`alias-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,8)}`}function Ne(e,t=Mn){let n=Nn(e),r=new Set,o=i=>{n=i;for(let s of[...r])try{s()}catch(l){console.error("[dsh-better] alias store listener failed:",l)}Pn(e,i)};return{getSnapshot:()=>n,subscribe(i){return r.add(i),()=>{r.delete(i)}},setPrefix(i){n.prefix!==i&&o({...n,prefix:i})},addRow(){let i=t();return o({...n,rows:[...n.rows,{id:i,keyword:"",target:"",params:""}]}),i},updateRow(i,s){let l=!1,c=n.rows.map(d=>{if(d.id!==i)return d;let a={...d,...s,id:d.id};return l=a.keyword!==d.keyword||a.target!==d.target||a.params!==d.params,a});l&&o({...n,rows:c})},removeRow(i){let s=n.rows.filter(l=>l.id!==i);s.length!==n.rows.length&&o({...n,rows:s})}}}function Me(e){return e.keyword.trim()!==""&&e.target.trim()!==""}function De(e){return e.keyword.trim().replace(/^\/+/,"").toLowerCase()}function _e(e,t){let n=t.trim().replace(/^\/+/,"").toLowerCase();return n===""?[]:e.rows.filter(r=>Me(r)&&De(r)===n)}function Fe(e,t,n=!1){let r=t.trim().replace(/^\/+/,"").toLowerCase(),o=e.rows.filter(Me);if(r==="")return n?o:[];let i=[],s=[],l=[];for(let c of o){let d=De(c);d===r?i.push(c):d.startsWith(r)?s.push(c):d.includes(r)&&l.push(c)}return[...i,...s,...l]}function We(e){let t=e.target.trim().replace(/^\/+/,"");if(t==="")return"";let n=e.params.trim();return n===""?`/${t} `:`/${t} ${n} `}function Be(e,t){let n=/^\/([^\s/]+)([ \t]*)$/u.exec(t);if(n===null)return;let r=n[1]??"",o=_e(e,r);if(o.length!==0)return{query:r,start:0,end:t.length,rows:o}}function He(e,t){let n=/^([^\s/]+)([ \t]*)$/u.exec(t);if(n===null)return;let r=n[1]??"",o=_e(e,r);if(o.length!==0)return{query:r,start:0,end:t.length,rows:o}}function je(e){if(e.keyword.trim()==="")return"keyword";if(e.target.trim()==="")return"target";if(/\s/.test(e.keyword.trim()))return"keyword"}var w=require("react/jsx-runtime");function Dn(e){let{row:t,store:n,t:r}=e,o=je(t);return(0,w.jsxs)("tr",{"data-testid":"alias-row","data-row-id":t.id,"data-incomplete":o===void 0?void 0:"",children:[(0,w.jsx)("td",{children:(0,w.jsx)("input",{className:"dsh-better-alias-input","data-testid":"alias-keyword",value:t.keyword,placeholder:"wf",spellCheck:!1,autoComplete:"off","aria-label":r("alias.table.keyword"),ref:i=>{i!==null&&e.focus&&(i.focus(),e.clearFocus())},onChange:i=>n.updateRow(t.id,{keyword:i.target.value})})}),(0,w.jsx)("td",{children:(0,w.jsx)("input",{className:"dsh-better-alias-input","data-testid":"alias-target",value:t.target,placeholder:"flow-workflow",spellCheck:!1,autoComplete:"off","aria-label":r("alias.table.target"),onChange:i=>n.updateRow(t.id,{target:i.target.value})})}),(0,w.jsx)("td",{children:(0,w.jsx)("input",{className:"dsh-better-alias-input","data-testid":"alias-params",value:t.params,placeholder:r("alias.table.paramsPlaceholder"),spellCheck:!1,autoComplete:"off","aria-label":r("alias.table.params"),onChange:i=>n.updateRow(t.id,{params:i.target.value})})}),(0,w.jsx)("td",{className:"dsh-better-alias-actions",children:(0,w.jsx)("button",{type:"button",className:"dsh-better-alias-delete","data-testid":"alias-remove","aria-label":r("alias.remove",{keyword:t.keyword.trim()||r("alias.unnamed")}),title:r("alias.remove",{keyword:t.keyword.trim()||r("alias.unnamed")}),onClick:()=>n.removeRow(t.id),children:"\xD7"})})]})}function $e(e){function t(){let n=(0,te.useSyncExternalStore)(e.store.subscribe,e.store.getSnapshot,e.store.getSnapshot),{translate:r}=e,o=(0,te.useRef)(null),i=()=>{o.current=e.store.addRow()};return(0,w.jsxs)("section",{className:"dsh-better-alias-page","data-testid":"alias-page",children:[(0,w.jsx)("h2",{className:"dsh-better-alias-heading",children:r("alias.heading")}),(0,w.jsxs)("label",{className:"dsh-better-alias-prefix",children:[(0,w.jsxs)("span",{children:[(0,w.jsx)("span",{className:"dsh-better-alias-prefix-title",children:r("alias.prefix.title")}),(0,w.jsx)("span",{className:"dsh-better-alias-prefix-hint",children:r(n.prefix?"alias.prefix.on":"alias.prefix.off")})]}),(0,w.jsx)("input",{type:"checkbox","data-testid":"alias-prefix",checked:n.prefix,"aria-label":r("alias.prefix.title"),onChange:s=>e.store.setPrefix(s.target.checked)})]}),(0,w.jsxs)("div",{className:"dsh-better-alias-table-wrap",children:[(0,w.jsxs)("table",{className:"dsh-better-alias-table",children:[(0,w.jsx)("thead",{children:(0,w.jsxs)("tr",{children:[(0,w.jsx)("th",{scope:"col",children:r("alias.table.keyword")}),(0,w.jsx)("th",{scope:"col",children:r("alias.table.target")}),(0,w.jsx)("th",{scope:"col",children:r("alias.table.params")}),(0,w.jsx)("th",{scope:"col","aria-label":r("alias.table.actions")})]})}),(0,w.jsx)("tbody",{children:n.rows.map(s=>(0,w.jsx)(Dn,{row:s,store:e.store,t:r,focus:o.current===s.id,clearFocus:()=>{o.current=null}},s.id))})]}),n.rows.length===0?(0,w.jsx)("p",{className:"dsh-better-alias-empty","data-testid":"alias-empty",children:r("alias.empty")}):null]}),(0,w.jsx)("button",{type:"button",className:"dsh-better-alias-add","data-testid":"alias-add",onClick:i,children:r("alias.add")}),(0,w.jsx)("p",{className:"dsh-better-alias-footnote",children:r("alias.footnote")})]})}return t}var fe="alias",_n="/",Fn=-1;function Wn(e,t){let n=e.target.trim().replace(/^\/+/,""),r=e.keyword.trim(),o=e.params.trim();return{name:n,label:r,...o===""?{}:{description:t("alias.menu.params",{value:o})},section:t("alias.menu.section"),value:e.id}}function ze(e){return{trigger:_n,name:fe,order:Fn,async candidates(t,n){if(n.position!=="leading")return[];let r=e.config();return!r.prefix&&e.bareMenuOpen?.()!==!0?[]:Fe(r,n.query,!0).map(o=>Wn(o,e.translate))},onPick(t){let n=e.config().rows.find(i=>i.id===t.candidate.value);if(n===void 0)return;let r=n.target.trim().replace(/^\/+/,"");r!==""&&e.routeCommand?.(r,t);let o=We(n);return o===""?void 0:{text:o}}}}var Ue="dsh-better/aliases.css",Bn=`
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
`;function qe(e){let t=`style[data-plugin-css=${JSON.stringify(Ue)}]`;if(e.querySelector(t)!==null)return()=>{};let n=e.createElement("style");return n.dataset.plugin="dsh-better",n.dataset.pluginCss=Ue,n.textContent=Bn,e.head.append(n),()=>n.remove()}var q=require("react");var Ve={draft:"",draftRev:-1,phase:"plain"};function Ke(e){return function(n){let r=(0,q.useSyncExternalStore)(e.store.subscribe,e.store.getSnapshot,e.store.getSnapshot),o=n.sessionId===void 0?void 0:e.inputStoreFor(n.sessionId),i=n.sessionId===void 0?void 0:e.controllerFor(n.sessionId),s=(0,q.useSyncExternalStore)(c=>o===void 0?()=>{}:o.subscribe(c),()=>o===void 0?Ve:o.getSnapshot(),()=>o===void 0?Ve:o.getSnapshot()),l=(0,q.useRef)(null);return(0,q.useEffect)(()=>{let c=n.sessionId;if(c===void 0||s.phase!=="plain"||i===void 0)return;let d=i.menu.getSnapshot().open;if(d&&l.current===null)return;let a=me(r,s.draft);if(d){let p=l.current;if(p!==null&&(p.draftRev!==s.draftRev||p.spanEnd!==(a?.end??-1))){let f=setTimeout(()=>{let m=o?.getSnapshot()??s,y=e.controllerFor(c);if(y===void 0||m.phase!=="plain")return;l.current=null,y.dismiss();let g=me(e.store.getSnapshot(),m.draft);g!==void 0&&(e.bareMenuOpen.open=!0,Ge(y,g,m.draftRev),e.bareMenuOpen.open=!1,l.current={draftRev:m.draftRev,spanEnd:g.end})},80);return()=>clearTimeout(f)}return}if(l.current=null,a===void 0)return;let u=setTimeout(()=>{let p=o?.getSnapshot()??s,f=e.controllerFor(c);if(f===void 0||p.phase!=="plain"||f.menu.getSnapshot().open)return;let m=me(e.store.getSnapshot(),p.draft);m!==void 0&&(e.bareMenuOpen.open=!0,Ge(f,m,p.draftRev),e.bareMenuOpen.open=!1,l.current={draftRev:p.draftRev,spanEnd:m.end})},80);return()=>clearTimeout(u)},[r,s.draft,s.draftRev,s.phase,i,o,n.sessionId]),null}}function me(e,t){return e.prefix?Be(e,t):He(e,t)}function Ge(e,t,n){e.toggleSource(fe,{trigger:"/",query:t.query,quoted:!1,position:"leading",span:{start:t.start,end:t.end,draftRev:n}})}var R=require("react");var Hn="[a-z0-9]+(?:-[a-z0-9]+)*",jn=new RegExp(`^/(${Hn})(?=\\s|$)`,"u");function Ye(e,t){let n=jn.exec(e);if(n===null)return;let r=n[1]??"";if(t(r))return{name:r,start:0,end:1+r.length}}function Je(e,t,n){return e===void 0||!Number.isInteger(n)||n<e.end||n>t.length||n!==t.length?!1:/^[ \t]*$/u.test(t.slice(e.end,n))}var $n=/^\/([a-z0-9]+(?:-[a-z0-9]+)*)[ \t]*$/u,zn=400,Xe=200,Ze=6,Un=240,Qe={draft:"",draftRev:-1,phase:"plain"};function qn(e,t){return`${e!==""&&!/\s$/u.test(e)?" ":""}${t} `}function nt(e){return e===void 0?void 0:$n.exec(e)?.[1]}function Vn(e){return e===void 0?[]:e.split(`
`).map(t=>t.trim()).filter(t=>t!=="")}var ye=240,he=640;function Gn(e){return!Number.isFinite(e)||e<=0?he:Math.max(ye,Math.min(he,e-24))}function Kn(e,t){let n=Gn(t),r=Number.isFinite(e)&&e>0?e:0,o=r===0?ye:r<=80?320:r<200?480:he;return Math.min(Math.max(o,ye),n)}function Yn(e,t,n,r){if(!Number.isFinite(n)||n<=0)return e;let o=n-t-r;return Math.max(r,Math.min(e,Math.max(r,o)))}function et(e,t){let n=e.querySelectorAll("[data-composer-text-ref]");for(let r of n){if(nt(r.textContent??"")!==t)continue;let o=r.getBoundingClientRect();return{left:o.left,right:o.right,top:o.top,bottom:o.bottom}}}function rt(e){return e.defaultView?.innerWidth??0}function Jn(e,t,n,r){let o=e.top-r,i=Number.isFinite(n)&&n>0?n:0;return i===0||i<=o?{left:e.left,top:0,anchor:"above"}:{left:e.left,top:e.bottom+r,anchor:"below"}}function tt(e){return e.defaultView?.innerHeight??0}function ot(e){return function(n){let r=e.document??globalThis.document,o=n.sessionId,i=o===void 0?void 0:e.inputStoreFor(o),s=n.useInput,l=s===void 0?void 0:s(k=>k.draft),c=(0,R.useSyncExternalStore)(k=>i===void 0?()=>{}:i.subscribe(k),()=>i===void 0?Qe.draft:i.getSnapshot().draft,()=>i===void 0?Qe.draft:i.getSnapshot().draft),d=l??c,[a,u]=(0,R.useState)(()=>new Set),[p,f]=(0,R.useState)(void 0),[m,y]=(0,R.useState)(void 0),[g,S]=(0,R.useState)(void 0),[A,E]=(0,R.useState)(void 0);(0,R.useEffect)(()=>{if(o===void 0)return;let k=!0;return e.skillNamesFor(o).then(x=>{k&&u(x)},()=>{k&&u(new Set)}),()=>{k=!1}},[o]);let I=Ye(d,k=>a.has(k)),N=Je(I,d,d.length)?I?.name:void 0,$=N??m;(0,R.useEffect)(()=>{if(o===void 0||$===void 0){f(void 0);return}let k=!0;return e.loadProfile(o,$).then(x=>{k&&f(x)},()=>{k&&f(void 0)}),()=>{k=!1}},[o,$]),(0,R.useEffect)(()=>{if(r===void 0||N===void 0){S(void 0);return}let k=()=>S(et(r,N));k();let x=r.defaultView;return x?.addEventListener("resize",k),()=>x?.removeEventListener("resize",k)},[r,N,d]);let _=(0,R.useRef)(null),F=(0,R.useRef)(null),b=()=>{_.current!==null&&clearTimeout(_.current),_.current=null},C=()=>{F.current!==null&&clearTimeout(F.current),F.current=null};(0,R.useEffect)(()=>{if(r===void 0||o===void 0)return;let k=T=>{let B=T.target;if(!(B instanceof r.defaultView.Element))return;let J=B.closest("[data-composer-text-ref]");if(J===null)return;let U=nt(J.textContent??"");U!==void 0&&(C(),b(),_.current=setTimeout(()=>{_.current=null,y(U),S(et(r,U)),E(e.loadUsage(o,U))},zn))},x=T=>{let B=T.target;B instanceof r.defaultView.Element&&B.closest("[data-composer-text-ref]")!==null&&(b(),C(),F.current=setTimeout(()=>{F.current=null,y(void 0)},Xe))};return r.addEventListener("pointerover",k,!0),r.addEventListener("pointerout",x,!0),()=>{b(),C(),r.removeEventListener("pointerover",k,!0),r.removeEventListener("pointerout",x,!0)}},[r,o]),(0,R.useEffect)(()=>{if(r===void 0||m===void 0)return;let k=x=>{x.key==="Escape"&&y(void 0)};return r.addEventListener("keydown",k),()=>r.removeEventListener("keydown",k)},[r,m]);let M=(0,R.useRef)(d);M.current=d;let W=(0,R.useRef)(void 0);return W.current=n.inputActions??(o===void 0?void 0:e.actionsFor(o)),(0,R.useEffect)(()=>{if(r===void 0||N===void 0||g===void 0)return;let k=Vn(p?.argumentHint);if(k.length===0)return;let x=Xn(r,g,k);return r.body.append(x),()=>x.remove()},[r,N,g,p]),(0,R.useEffect)(()=>{if(r===void 0||m===void 0)return;let k=Zn(r,e,{name:m,profile:p,usage:A,box:g,sessionId:o,getActions:()=>W.current,getDraft:()=>M.current,onEnter:C,onLeave:()=>{b(),C(),F.current=setTimeout(()=>{F.current=null,y(void 0)},Xe)}});return r.body.append(k),()=>k.remove()},[r,m,p,A,g,o]),null}}function Xn(e,t,n){let r=e.createElement("div");r.className="dsh-better-skill-hint",r.textContent=n.join(`
`);let o=t.right+Ze>rt(e)-Un;return r.style.left=`${o?t.left:t.right+Ze}px`,r.style.top=`${o?t.bottom+2:t.top}px`,r}function Zn(e,t,n){let r=e.createElement("div");r.className="dsh-better-skill-panel",r.addEventListener("pointerenter",n.onEnter),r.addEventListener("pointerleave",n.onLeave);let o=e.createElement("div");o.className="dsh-better-skill-panel-title",o.textContent=`/${n.name}`,r.append(o);let i=n.profile?.description;if(i!==void 0&&i!==""){let a=e.createElement("div");a.className="dsh-better-skill-panel-desc",a.textContent=i,a.title=i,r.append(a)}let s=n.profile?.metadata??{},l=Object.keys(s);if(l.length>0){let a=e.createElement("div");a.className="dsh-better-skill-panel-section",a.append(ge(e,t.translate("skill.metadata")));for(let u of l){let p=e.createElement("div");p.textContent=`${u}: ${s[u]??""}`,a.append(p)}r.append(a)}let c=n.profile?.path;if(c!==void 0&&c!==""){r.append(ge(e,t.translate("skill.path")));let a=e.createElement("div");a.className="dsh-better-skill-panel-path",a.textContent=c,r.append(a)}if(n.usage!==void 0){let a=e.createElement("div");a.className="dsh-better-skill-panel-counts",a.textContent=`${t.translate("skill.usage.session")} ${n.usage.session}`,n.usage.workspace!==void 0&&(a.textContent+=` \xB7 ${t.translate("skill.usage.workspace")} ${n.usage.workspace}`),r.append(a)}let d=n.profile?.params??[];if(d.length>0&&n.getActions()?.insertText!==void 0){r.append(ge(e,t.translate("skill.params")));for(let a of d)r.append(Qn(e,t,n,a.flag,a.detail))}{let u=rt(e),p=Kn(i?.length??0,u);if(r.style.width=`${p}px`,n.box!==void 0){let f=Jn(n.box,tt(e),r.offsetHeight,4);r.style.left=`${Yn(f.left,p,u,12)}px`,f.anchor==="above"?(r.style.bottom=`${tt(e)-n.box.top+4}px`,r.style.top=""):(r.style.top=`${f.top}px`,r.style.bottom="")}}return r}function ge(e,t){let n=e.createElement("div");return n.className="dsh-better-skill-panel-label",n.textContent=t,n}function Qn(e,t,n,r,o){let i=e.createElement("button");i.type="button",i.className="dsh-better-skill-panel-param",i.title=t.translate("skill.hint.insert"),i.addEventListener("pointerdown",l=>l.preventDefault());let s=e.createElement("span");if(s.className="dsh-better-skill-panel-param-flag",s.textContent=r,i.append(s),o!==""){let l=e.createElement("span");l.className="dsh-better-skill-panel-param-detail",l.textContent=o,i.append(l)}return i.addEventListener("click",()=>{let l=n.getActions();if(l?.insertText===void 0||l.captureInsertion===void 0)return;let c=l.captureInsertion();l.insertText(qn(n.getDraft(),r),c)}),i}var it="dsh-better/skill-enhancer.css",er=`
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
`;function at(e){if(e===void 0)return()=>{};let t=`style[data-plugin-css=${JSON.stringify(it)}]`;if(e.querySelector(t)!==null)return()=>{};let n=e.createElement("style");return n.dataset.plugin="dsh-better",n.dataset.pluginCss=it,n.textContent=er,e.head.append(n),()=>n.remove()}function st(e,t,n){if(t===void 0||t===""||e.length===0)return;let r=0;for(let o of e){if(o.cwd!==t)continue;let i=o.usage?.[n];typeof i=="number"&&Number.isFinite(i)&&(r+=i)}return r}var v=require("react");var tr="@deepseek-ai/dsh-client-ui-commands/PopupSelectView.module.css";function lt(e){if(e===void 0)return;let n=e.querySelector(`style[data-plugin-css="${tr}"]`)?.textContent??"",r=i=>new RegExp(`\\.(\\w+_${i})\\{`,"u").exec(n)?.[1],o={badges:"dshBetter_badges",badgeChip:"dshBetter_badgeChip",badgeChipOn:"dshBetter_badgeChipOn",card:r("card"),viewport:r("viewport"),row:r("row"),rowActive:r("rowActive"),label:r("label"),labelText:r("labelText"),badge:r("badge"),detail:r("detail"),check:r("check"),status:r("status"),search:r("search"),error:r("error"),errorText:r("errorText"),retry:r("retry")};for(let[i,s]of Object.entries(o))if(!(i==="badges"||i==="badgeChip"||i==="badgeChipOn")&&s===void 0)return;return o}function be(e,t){for(let n of e)if(n.id===t.provider){for(let r of n.models)if(r.id===t.model)return r.reasoning}}function dt(e,t){let n=be(e,t)?.efforts;return n===void 0?[]:[...n]}function ut(e,t){if(e.length===0)return;let n=r=>r!==void 0&&e.some(o=>o.id===r);return n(t.remembered)?t.remembered:t.isCurrent&&n(t.currentEffort)?t.currentEffort:n(t.defaultEffort)?t.defaultEffort:e[0]?.id}function nr(e){return e.length>1}function ct(e){return nr(e)?e:[]}var j=require("react/jsx-runtime");function ne(e){let t=e.group?.name;if(t===void 0)return;let n=`${t}/`,r=e.id.startsWith(n)?e.id.slice(n.length):e.id;return{provider:t,model:r}}function rr(e,t){let n=ne(e);return ct(n===void 0?[]:dt(t??[],n))}function pt({option:e,active:t,catalog:n,pointed:r,classes:o,primitives:i,onChoose:s,onPickEffort:l,onHover:c,t:d}){let a=rr(e,n),u=i.IconCheckOutlineRegular;return(0,j.jsxs)("div",{role:"option","aria-selected":t,"aria-label":e.badge===void 0?void 0:`${e.label} ${e.badge}`,className:t?`${o.row} ${o.rowActive}`:o.row,onClick:s,onMouseEnter:c,children:[(0,j.jsxs)("span",{className:o.label,children:[(0,j.jsx)("span",{className:o.labelText,children:e.label}),e.badge!==void 0&&(0,j.jsx)("sup",{className:o.badge,children:e.badge})]}),e.detail!==void 0&&(0,j.jsx)("span",{className:o.detail,children:e.detail}),a.length>0&&(0,j.jsx)("span",{className:o.badges,role:"group","aria-label":d?.("listbox.aria")??"",children:a.map(p=>(0,j.jsx)("button",{type:"button",className:p.id===r?`${o.badgeChip} ${o.badgeChipOn}`:o.badgeChip,title:p.description??p.name,onClick:f=>{f.stopPropagation(),l(p.id)},children:p.name},p.id))}),e.active===!0&&a.length===0&&(0,j.jsx)("span",{className:o.check,children:u===void 0?null:(0,j.jsx)(u,{})})]})}function re(e){let t=new Map;for(let n of e){let r=n.group?.name,o=t.get(r);o!==void 0?o.rows.push(n):t.set(r,{group:n.group,rows:[n]})}return[...t.values()]}function oe(e){let t=re(e);return t.some(n=>n.group!==void 0)?t.flatMap(n=>n.rows):[...e]}function ft(e,t,n){return n===void 0?e.filter(r=>r.label.toLowerCase().includes(t)):re(e).flatMap(r=>n(r.rows.map(o=>({name:o.label,option:o})),t).map(o=>o.option))}var ke=new WeakSet;async function mt(e,t){let n=e.binding,r=e.state.getSnapshot();if(!(n===null||r.submitting||ke.has(e))){ke.add(e),e.state.set?.({...r,submitting:!0,confirming:null,acknowledged:!1,error:null});try{let o=t();if(o===void 0)return;await o,n!==null&&e.binding===n&&e.deps?.consume?.(n.segment)}finally{ke.delete(e),n!==null&&e.binding===n&&e.dismiss({focusComposer:!0})}}}var or="@deepseek-ai/dsh-client-ui-primitives";function ie(e){if(e===null)return{};let t;try{t=e(or)}catch{return{}}if(t===null||typeof t!="object")return{};let n=t,r=y=>typeof y=="function"||typeof y=="object"&&y!==null,o=y=>{let g=n[y];return r(g)?g:void 0},i=y=>{let g=n[y];return typeof g=="function"?g:void 0},s={},l=o("MenuSurface");l!==void 0&&(s.MenuSurface=l);let c=o("MenuGroup");c!==void 0&&(s.MenuGroup=c);let d=o("IconCheckOutlineRegular");d!==void 0&&(s.IconCheckOutlineRegular=d);let a=o("IconDataOutlineRegular");a!==void 0&&(s.IconDataOutlineRegular=a);let u=o("IconChevronDownOutlineRegular");u!==void 0&&(s.IconChevronDownOutlineRegular=u);let p=i("useAnchoredMaxHeight");p!==void 0&&(s.useAnchoredMaxHeight=p);let f=i("observeStickyMenuGroups");f!==void 0&&(s.observeStickyMenuGroups=f);let m=i("rankByName");return m!==void 0&&(s.rankByName=m),s}function ir(e){if(e===void 0)return[];let t=[e.name,e.label].map(n=>n.trim().toLowerCase()).filter(n=>n!=="");return[...new Set(t)]}function ar(e,t){return ir(e.group).some(n=>n.includes(t))}function sr(e,t,n,r){return n==="fuzzy-label"?ft(e,t,r):oe(e).filter(o=>o.label.toLowerCase().includes(t)||o.detail?.toLowerCase().includes(t)===!0)}function gt(e,t,n,r){let o=t.trim().toLowerCase();if(o==="")return oe(e);let i=sr(e,o,n,r),s=new Set(i),l=oe(e).filter(c=>!s.has(c)&&ar(c,o));return[...i,...l]}var P=require("react/jsx-runtime"),kt="model",yt=320;function lr(e){return e.command!==kt||!e.open||e.status!=="ready"||e.confirming!==null||e.options.length===0?!1:e.submitting||e.error===null}var dr={subscribe:()=>()=>{},getSnapshot:()=>({open:!1,command:null,status:"pending",options:[],search:"",searchLabels:null,searchMode:"substring",active:0,submitting:!1,confirming:null,acknowledged:!1,error:null})};function St(e){let t=ie(e.load);function n(r){let o=r.popup,i=o?.state??dr,s=(0,v.useCallback)(a=>i.subscribe(a),[i]),l=(0,v.useCallback)(()=>i.getSnapshot(),[i]),c=(0,v.useSyncExternalStore)(s,l),d=e.native();return o===void 0||d===void 0?null:!lr(c)||o.settle===void 0?(0,P.jsx)(d,{...r}):(0,P.jsx)(ur,{popup:o,state:c,t:r.t,primitives:t,doc:e.document,catalog:r.catalog,current:r.current,selectModel:r.selectModel})}return n}function ur({popup:e,state:t,t:n,primitives:r,doc:o,catalog:i,current:s,selectModel:l}){let c=(0,v.useRef)(null),d=(0,v.useRef)(null),a=(0,v.useRef)(null),u=(0,v.useMemo)(()=>lt(o),[o]),p=t.searchMode,f=(0,v.useMemo)(()=>gt(t.options,t.search,p,r.rankByName),[t.options,t.search,p,r.rankByName]),m=(0,v.useMemo)(()=>re(f),[f]),[y,g]=(0,v.useState)({}),[S,A]=(0,v.useState)(()=>ht(f));(0,v.useEffect)(()=>{A(ht(f))},[t.search,t.options]);let E=bt(f,S),I=cr(r,c,t);(0,v.useEffect)(()=>{let h=a.current;if(!(h===null||r.observeStickyMenuGroups===void 0))return r.observeStickyMenuGroups(h)},[r.observeStickyMenuGroups,t.open,t.status,m]),(0,v.useEffect)(()=>{c.current?.querySelector('[aria-selected="true"]')?.scrollIntoView({block:"nearest"})},[E,f]),(0,v.useEffect)(()=>{if(!t.open)return;let h=L=>{let O=c.current;O!==null&&L.target instanceof Node&&O.contains(L.target)||e.dismiss()};return o?.addEventListener("pointerdown",h,!0),()=>{o?.removeEventListener("pointerdown",h,!0)}},[o,e,t.open]),(0,v.useEffect)(()=>{d.current?.focus()},[t.open]);let N=(0,v.useCallback)((h,L)=>{if(L===void 0||l===void 0){e.settle?.(e.binding,h);return}let O=ne(h);if(O===void 0){e.settle?.(e.binding,h);return}mt(e,()=>l({...O,reasoningEffort:L}))},[e,l]),$=(0,v.useCallback)(h=>{let L=ne(h);if(L===void 0)return;let O=be(i??[],L);return ut(O?.efforts??[],{remembered:y[h.id],isCurrent:s?.provider===L.provider&&s?.model===L.model,currentEffort:s?.reasoningEffort,defaultEffort:O?.defaultEffort})},[i,s,y]),_=(0,v.useCallback)(h=>{N(h,$(h))},[$,N]),F=(0,v.useCallback)((h,L)=>{g(O=>({...O,[h.id]:L})),N(h,L)},[N]),b=(0,v.useCallback)(()=>{let h=f[E];h!==void 0&&_(h)},[E,_,f]),C=(0,v.useCallback)(h=>{f.length!==0&&A(L=>(bt(f,L)+h+f.length)%f.length)},[f]),M=h=>{switch(h.key){case"ArrowDown":h.preventDefault(),C(1);return;case"ArrowUp":h.preventDefault(),C(-1);return;case"Enter":h.preventDefault(),b();return;case"Tab":if(!h.shiftKey&&f.length===0)return;h.preventDefault(),h.shiftKey?e.dismiss({focusComposer:!0}):b();return;case"Escape":h.preventDefault(),e.dismiss({focusComposer:!0});return;default:}};if(u===void 0)return null;let W=t.searchLabels?.placeholder??n?.("search.placeholder")??"",k=t.searchLabels===null?n?.("status.empty")??"":t.options.length===0?t.searchLabels.empty:t.searchLabels.noResults,x=(h,L)=>(0,P.jsx)(pt,{option:h,active:L===E,catalog:i,pointed:L===E?$(h):void 0,classes:u,primitives:r,onChoose:()=>{_(h)},onPickEffort:O=>{F(h,O)},onHover:()=>{A(L)},t:n},h.id),T=0,B=m.map(({group:h,rows:L})=>{let O=L.map(xn=>x(xn,T++));return h===void 0?(0,P.jsx)(v.Fragment,{children:O},"ungrouped"):r.MenuGroup===void 0?(0,P.jsx)(v.Fragment,{children:O},`group:${h.name}`):(0,P.jsx)(r.MenuGroup,{label:h.label,children:O},`group:${h.name}`)}),J=(0,P.jsxs)(P.Fragment,{children:[(0,P.jsx)("input",{ref:d,className:u.search,type:"text",placeholder:W,"aria-label":n?.("search.aria")??"",value:t.search,readOnly:t.submitting,onChange:h=>{e.setSearch(h.currentTarget.value)}}),t.submitting&&(0,P.jsx)("div",{className:u.status,children:n?.("status.applying")??""}),!t.submitting&&f.length===0&&(0,P.jsx)("div",{className:u.status,children:k}),f.length>0&&(0,P.jsx)("div",{ref:a,role:"listbox","aria-label":n?.("listbox.aria")??"",className:u.viewport,children:B})]}),U={className:u.card,style:{maxHeight:I},"aria-label":n?.("overlay.aria")??kt,onKeyDown:M};return r.MenuSurface===void 0?(0,P.jsx)("div",{ref:c,...U,children:J}):(0,P.jsx)(r.MenuSurface,{ref:c,...U,children:J})}function ht(e){let t=e.findIndex(n=>n.active===!0);return t===-1?0:t}function bt(e,t){return e.length===0?0:Math.min(Math.max(t,0),e.length-1)}function cr(e,t,n){let r=e.useAnchoredMaxHeight;return r===void 0?yt:r(t,yt,n)}var H=require("react");var Se="application/x-dsh-composer+json";var pr=Object.freeze({png:"image/png",jpg:"image/jpeg",jpeg:"image/jpeg",webp:"image/webp",gif:"image/gif",bmp:"image/bmp",svg:"image/svg+xml",avif:"image/avif",heic:"image/heic",heif:"image/heif",tif:"image/tiff",tiff:"image/tiff"});function wt(e){return JSON.stringify({v:1,text:e.text,attachments:e.attachments.map(t=>({path:t.path,name:t.name,type:t.type,kind:t.kind}))})}function vt(e){if(typeof e!="string"||e==="")return;let t;try{t=JSON.parse(e)}catch{return}if(t===null||typeof t!="object")return;let n=t;if(n.v!==1)return;let r=typeof n.text=="string"?n.text:"",o=Array.isArray(n.attachments)?n.attachments:[],i=[];for(let s of o){if(s===null||typeof s!="object")continue;let l=s,c=l.path;typeof c!="string"||c===""||i.push({path:c,name:typeof l.name=="string"&&l.name!==""?l.name:ve(c),type:typeof l.type=="string"?l.type:"",kind:l.kind==="image"?"image":"file"})}return{text:r,attachments:i}}function we(e,t){if(t.length===0)return e;let n=t.join(`
`);return e===""?n:`${e.replace(/\n+$/u,"")}

${n}`}function xt(e){if(e==="")return;let t=e.split(`
`),n=[],r=t.length;for(let i=t.length-1;i>=0;i-=1){let s=t[i]??"";if(s.trim()===""){if(n.length>0){r=i;continue}continue}let l=fr(s);if(l===void 0)break;n.unshift(l),r=i}return n.length===0?void 0:{text:t.slice(0,r).join(`
`).replace(/\n+$/u,""),paths:n}}function fr(e){let t=e.trim();if(t.startsWith("@")&&(t=t.slice(1)),t.startsWith('"')&&t.endsWith('"')&&t.length>1&&(t=t.slice(1,-1)),t!==""&&mr(t)&&!/[\u0000-\u001f\u007f]/u.test(t)&&!/["\u2018\u2019\u201c\u201d\u300c\u300d\u300e\u300f\u3002\uff01\uff1f\uff1b\uff1a\uff0c\u3001\u2026*?;<>|&$`!#=]/u.test(t)&&!/(?:^|\s)-{1,2}\S/u.test(t))return t}function mr(e){return e.startsWith("/")||/^[A-Za-z]:[/\\]/u.test(e)||e.startsWith("\\\\")}function Ct(e){let t=/\.([A-Za-z0-9]+)$/u.exec(e);if(t!==null)return pr[t[1]?.toLowerCase()??""]}function ve(e){return e.split(/[\\/]/u).filter(n=>n!=="").at(-1)??e}function Lt(e,t){let n=new Set(t),r=[],o=[];for(let i of e){if(n.has(i.path)){o.push(i.path);continue}n.add(i.path),r.push(i)}return{accepted:r,duplicates:o}}var K=require("react/jsx-runtime"),gr="data-dsh-better-attach-item",yr="data-dsh-better-attach-selected",hr=4500,br=new Set(["a","c","x","insert"]),kr=new Set(["meta","control","shift","alt","altgraph","capslock","os"]),Sr=/\s/u;function At(e){function t(n){let r=e.native();return r===void 0?null:(0,K.jsx)(wr,{native:r,props:n,deps:e})}return t}function wr({native:e,props:t,deps:n}){let r=(0,H.useRef)(null),[o,i]=(0,H.useState)(!1),[s,l]=(0,H.useState)(null),c=(t.attachments??[]).length>0,d=(0,H.useRef)(t);d.current=t;let a=(0,H.useRef)(o);a.current=o;let u=(f,m)=>t.t?.(f,m)??n.translate()?.(f,m)??"",p=(0,H.useRef)(u);return p.current=u,(0,H.useEffect)(()=>{let f=r.current;if(f===null)return;let m=f.querySelector('[role="group"]');if(m!==null)for(let y of Array.from(m.children)){if(!(y instanceof HTMLElement))continue;y.toggleAttribute(gr,!0);let g=Cr(y);g!==null&&g.toggleAttribute(yr,o)}},[o,t.attachments]),(0,H.useEffect)(()=>{if(s===null)return;let f=globalThis.setTimeout(()=>{l(null)},hr);return()=>{globalThis.clearTimeout(f)}},[s]),(0,H.useEffect)(()=>{let f=r.current;if(f===null)return;let m=f.closest("[data-composer-card]");if(!(m instanceof HTMLElement))return;let y=m.ownerDocument,g=b=>(b instanceof Element?b:b instanceof Node?b.parentElement:null)?.closest("[contenteditable]")??null,S=()=>{a.current&&i(!1)},A=()=>{let b=m.ownerDocument.getSelection();return b!==null&&!b.isCollapsed&&b.toString()!==""},E=b=>b instanceof Node&&m.contains(b),I=b=>{let C=b.key.toLowerCase();if(kr.has(C))return;let M=b.metaKey||b.ctrlKey;if(M&&!b.altKey&&C==="a"){E(b.target)&&g(b.target)?.getAttribute("contenteditable")==="true"&&i(!0);return}if(M&&!b.altKey&&C==="c"&&a.current&&E(b.target)&&!A()){b.preventDefault(),vr(d.current,n,l,p.current);return}M&&!b.altKey&&br.has(C)||S()},N=()=>{S()},$=b=>{let M=d.current.attachments??[],W=b.clipboardData;if(!a.current||M.length===0||W===null)return;let k=[],x=[];for(let T of M){let B=n.pathOf(T.file);if(B===""){x.push(T.file.name);continue}k.push({path:B,name:T.file.name,type:T.file.type,kind:T.kind})}if(k.length>0){let T=W.getData("text/plain");W.setData(Se,wt({text:T,attachments:k})),W.setData("text/plain",we(T,k.map(B=>B.path)))}x.length>0&&l(p.current("attach.copySkipped",{count:String(x.length)}))},_=b=>{let C=b.clipboardData;if(C===null||g(b.target)===null||Array.from(C.types).includes("Files"))return;let M=()=>d.current,W=vt(C.getData(Se));if(W!==void 0){b.preventDefault(),b.stopPropagation(),S(),Rt(W,M,n,l,p.current);return}let k=xt(C.getData("text/plain"));k!==void 0&&(b.preventDefault(),b.stopPropagation(),S(),Rt({text:k.text,attachments:k.paths.map(x=>{let T=Ct(x)??"";return{path:x,name:ve(x),type:T,kind:T===""?"file":"image"}})},M,n,l,p.current))};y.addEventListener("keydown",I,!0),m.addEventListener("paste",_,!0);let F=b=>{let C=b.relatedTarget;C instanceof Node&&m.contains(C)||S()};return m.addEventListener("focusout",F),y.addEventListener("copy",$),y.addEventListener("pointerdown",N,!0),()=>{y.removeEventListener("keydown",I,!0),y.removeEventListener("copy",$),m.removeEventListener("paste",_,!0),m.removeEventListener("focusout",F),y.removeEventListener("pointerdown",N,!0)}},[n]),(0,K.jsxs)("div",{ref:r,className:c?"dshBetter_railHost":"dshBetter_railHostEmpty",children:[(0,K.jsx)(e,{...t}),s!==null&&(0,K.jsx)("div",{className:"dshBetter_attachNotice",role:"status",children:s})]})}function vr(e,t,n,r){let o=e.attachments??[],i=[],s=0;for(let l of o){let c=t.pathOf(l.file);c===""?s+=1:i.push(c)}i.length>0&&globalThis.navigator?.clipboard?.writeText(we("",i)).catch(()=>{n(r("attach.copyFailed"))}),s>0&&n(r("attach.copySkipped",{count:String(s)}))}function Rt(e,t,n,r,o){let i=t();if(xe(i,e.text),e.attachments.length===0)return;let s=n.reader(),l=i.sessionId;if(s===void 0||l===void 0){xe(i,e.attachments.map(a=>a.path).join(`
`));return}let c=(i.attachments??[]).map(a=>n.pathOf(a.file)).filter(a=>a!==""),{accepted:d}=Lt(e.attachments,c);d.length!==0&&(async()=>{let a=[],u=[],p=0;for(let m of d){let y=await xr(s,l,m);y.kind==="file"?a.push(y.file):y.kind==="mention"?u.push(y.mention):p+=1}let f=t();u.length>0&&xe(f,u.join(" ")),a.length>0&&f.onAddFiles?.(a),p>0&&r(o("attach.pasteMissing",{count:String(p)})),u.length>0&&r(o("attach.pasteReferenced",{count:String(u.length)}))})()}function xe(e,t){if(t==="")return;let n=e.inputActions,r=n?.captureInsertion?.();n?.insertText===void 0||r===void 0||n.insertText(t,r)}async function xr(e,t,n){let r=await e.readBytes?.(t,n.path,{});if(r!==void 0&&r.ok)return{kind:"file",file:new File([r.value.data],n.name,{type:n.type})};let o=await e.stat?.(t,n.path);return o!==void 0&&o.ok?{kind:"mention",mention:Lr(n.path)}:{kind:"missing"}}function Cr(e){let t=e.querySelector("img")?.parentElement;if(t!=null)return t;let n=e.firstElementChild;return n instanceof HTMLElement?n:null}function Lr(e){return Sr.test(e)?`@"${e}"`:`@${e}`}var Rr="better.focusComposer",Ar=Object.freeze(["focus input","focus composer","message input"]),X="command.focusComposer",Er=Object.freeze(["page","editable","terminal"]),Tr=Object.freeze({"desktop:macos":{code:"Space",modifiers:["primary"]},"desktop:windows":{code:"Space",modifiers:["primary","shift"]},"web:macos":{code:"Space",modifiers:["primary","shift"]},"web:windows":{code:"Space",modifiers:["primary","shift"]}}),Pr="[data-composer-input], [role='textbox'][aria-multiline='true']";function Tt(e){return e===void 0||typeof e.querySelector!="function"?!1:e.querySelector(Pr)!=null}function Ce(e,t){if(e===null||typeof e!="object")return;let n=e.get;if(typeof n=="function"){let r=n.call(e,t);return r===null?void 0:r}return e[t]}var Et=e=>typeof e=="string"&&e!==""?e:void 0;function Pt(e){let n=Ce(e,"uiSession")?.adapter?.current?.getSnapshot?.();if(n!==void 0)return Et(n.key);let r=Ce(e,"sessions");return Et(r?.list?.getSnapshot?.()?.current)}function Ot(e,t){try{let n=e.sessions?.scope?.(t);if(n===void 0)return!1;let o=Ce(n,"conversation")?.input?.for?.(n);return o===void 0||typeof o.focus!="function"?!1:(o.focus(),!0)}catch{return!1}}function Or(e){return(t={})=>{if(t.modal!=null)return{status:"pass"};if(!e.composerMounted())return{status:"pass"};let n=e.currentSessionId();return n===void 0?{status:"pass"}:{status:"handled",run:()=>{e.focusComposer(n)}}}}function Ir(e,t){return{id:Rr,label:t,aliases:Ar,defaults:Tr,regions:Er,modals:[],resolve:Or(e)}}function It(e,t,n,r){if(e===void 0||typeof e.register!="function")return()=>{};try{return e.register(Ir(t,n))}catch(o){return r?.(o instanceof Error?o.message:String(o)),()=>{}}}var Nt=Object.freeze({zh:{"overlay.aria":"\u9009\u62E9\u6A21\u578B","listbox.aria":"\u6A21\u578B\u5339\u914D\u9879","search.aria":"\u641C\u7D22\u4F9B\u5E94\u5546\u6216\u6A21\u578B","search.placeholder":"\u641C\u7D22\u4F9B\u5E94\u5546\u6216\u6A21\u578B\u2026","status.empty":"\u6CA1\u6709\u53EF\u7528\u7684\u6A21\u578B\u3002","status.applying":"\u6B63\u5728\u5207\u6362\u2026",retry:"\u91CD\u8BD5","trigger.selectAria":"\u9009\u62E9\u6A21\u578B","trigger.aria":"\u5F53\u524D\u6A21\u578B {model}\uFF0C\u70B9\u51FB\u5207\u6362","trigger.ariaEffort":"\u5F53\u524D\u6A21\u578B {model}\uFF0C\u63A8\u7406\u7B49\u7EA7 {effort}\uFF0C\u70B9\u51FB\u5207\u6362","trigger.fallback":"\u9009\u62E9\u6A21\u578B","trigger.loading":"\u52A0\u8F7D\u6A21\u578B\u2026",[X]:"\u805A\u7126\u8F93\u5165\u6846","attach.copySkipped":"{count} \u4E2A\u9644\u4EF6\u6765\u81EA\u526A\u8D34\u677F\u3001\u6CA1\u6709\u672C\u5730\u8DEF\u5F84\uFF0C\u672A\u590D\u5236","attach.pasteMissing":"{count} \u4E2A\u9644\u4EF6\u5BF9\u5E94\u7684\u6587\u4EF6\u5DF2\u4E0D\u5B58\u5728\uFF0C\u672A\u7C98\u8D34","attach.pasteReferenced":"{count} \u4E2A\u9644\u4EF6\u8D85\u51FA\u5355\u6B21\u8BFB\u53D6\u4E0A\u9650\uFF0C\u5DF2\u6539\u4E3A\u8DEF\u5F84\u5F15\u7528","attach.copyFailed":"\u6D4F\u89C8\u5668\u62D2\u7EDD\u4E86\u8FD9\u6B21\u526A\u8D34\u677F\u5199\u5165","compaction.reading":"\u538B\u7F29 {count} \u6B21","compaction.readingOne":"\u538B\u7F29 1 \u6B21","compaction.tooltip":"\u672C\u4F1A\u8BDD\u4E0A\u4E0B\u6587\u5DF2\u538B\u7F29 {count} \u6B21","compaction.tooltipWithFailures":"\u672C\u4F1A\u8BDD\u4E0A\u4E0B\u6587\u5DF2\u538B\u7F29 {count} \u6B21\uFF0C\u53E6\u6709 {failures} \u6B21\u538B\u7F29\u5931\u8D25","tabs.nav":"Tab \u7BA1\u7406","tabs.heading":"Tab \u7BA1\u7406","tabs.empty":"\u8FD8\u6CA1\u6709\u63D2\u4EF6\u6CE8\u518C\u4F1A\u8BDD\u6807\u7B7E\u3002","tabs.show":"\u5728\u6807\u7B7E\u680F\u663E\u793A{label}","tabs.hide":"\u4ECE\u6807\u7B7E\u680F\u9690\u85CF{label}","alias.nav":"\u6280\u80FD\u522B\u540D","alias.heading":"\u6280\u80FD\u522B\u540D","alias.prefix.title":"\u9700\u8981\u659C\u6760\u524D\u7F00","alias.prefix.on":"\u6253\u5F00\u5219\u9700\u8981\u8F93\u5165 \u201C/\u201D \u8FDB\u884C\u5339\u914D","alias.prefix.off":"\u6253\u5F00\u5219\u65E0\u9700\u8F93\u5165 \u201C/\u201D \u8FDB\u884C\u5339\u914D","alias.table.keyword":"\u5173\u952E\u8BCD","alias.table.target":"\u6280\u80FD\u6216\u547D\u4EE4","alias.table.params":"\u53C2\u6570","alias.table.paramsPlaceholder":"\u53EF\u9009\uFF0C\u5982 run","alias.table.actions":"\u64CD\u4F5C","alias.add":"\u6DFB\u52A0\u522B\u540D","alias.remove":"\u5220\u9664\u522B\u540D {keyword}","alias.unnamed":"\uFF08\u672A\u547D\u540D\uFF09","alias.empty":"\u8FD8\u6CA1\u6709\u522B\u540D\u3002\u4F8B\u5982\uFF1Awf \u2192 /flow-workflow run","alias.footnote":"\u8F93\u5165\u5173\u952E\u8BCD\u540E\u4ECE\u9762\u677F\u9009\u62E9\u5373\u53EF\u63D2\u5165\u5B8C\u6574\u8C03\u7528\uFF1B\u6539\u5B8C\u7ACB\u5373\u751F\u6548\u3002","alias.menu.section":"\u6280\u80FD\u522B\u540D","alias.menu.params":"\u53C2\u6570\uFF1A{value}","skill.metadata":"\u5143\u6570\u636E","skill.path":"\u5730\u5740","skill.usage.session":"\u672C\u4F1A\u8BDD\u8C03\u7528","skill.usage.workspace":"\u672C\u5DE5\u4F5C\u533A\u8C03\u7528","skill.params":"\u53C2\u6570","skill.hint.insert":"\u70B9\u51FB\u63D2\u5165"},en:{"overlay.aria":"Select a model","listbox.aria":"Matching models","search.aria":"Search providers or models","search.placeholder":"Search providers or models\u2026","status.empty":"No models available.","status.applying":"Switching\u2026",retry:"Retry","trigger.selectAria":"Select model","trigger.aria":"Current model {model}, click to change","trigger.ariaEffort":"Current model {model}, reasoning effort {effort}, click to change","trigger.fallback":"Select model","trigger.loading":"Loading models\u2026",[X]:"Focus message input","attach.copySkipped":"{count} attachment(s) came from the clipboard with no local path and were not copied","attach.pasteMissing":"{count} attachment(s) no longer exist and were not pasted","attach.pasteReferenced":"{count} attachment(s) exceed the read limit and became path references","attach.copyFailed":"The browser refused this clipboard write","compaction.reading":"{count} compactions","compaction.readingOne":"1 compaction","compaction.tooltip":"This session's context was compressed {count} time(s)","compaction.tooltipWithFailures":"This session's context was compressed {count} time(s), with {failures} failed attempt(s)","tabs.nav":"Tabs","tabs.heading":"Tabs","tabs.empty":"No plugin has registered a conversation tab yet.","tabs.show":"Show {label} in the tab bar","tabs.hide":"Hide {label} from the tab bar","alias.nav":"Skill aliases","alias.heading":"Skill aliases","alias.prefix.title":"Require a slash prefix","alias.prefix.on":"To open, type \u201C/\u201D to match","alias.prefix.off":"To open, type the keyword without \u201C/\u201D to match","alias.table.keyword":"Keyword","alias.table.target":"Skill or command","alias.table.params":"Arguments","alias.table.paramsPlaceholder":"Optional, e.g. run","alias.table.actions":"Actions","alias.add":"Add alias","alias.remove":"Delete alias {keyword}","alias.unnamed":"(unnamed)","alias.empty":"No aliases yet. For example: wf \u2192 /flow-workflow run","alias.footnote":"Type a keyword and pick from the panel to insert the full invocation; changes apply immediately.","alias.menu.section":"Skill aliases","alias.menu.params":"args: {value}","skill.metadata":"Metadata","skill.path":"Path","skill.usage.session":"This session","skill.usage.workspace":"This workspace","skill.params":"Arguments","skill.hint.insert":"Click to insert"}});var Mt="dsh-better-effort",Nr=`
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
`;function Dt(e){if(e===void 0)return()=>{};if(e.getElementById(Mt)!==null)return()=>{};let t=e.createElement("style");return t.id=Mt,t.textContent=Nr,e.head.append(t),()=>{t.remove()}}var Wt="dsh-better.layout-widths",Y=Object.freeze({sidebar:null,rightbar:null});function Bt(e){return typeof e=="number"&&Number.isFinite(e)&&e>0}function ae(e){if(e===void 0)return Y;let t;try{t=e.getItem(Wt)}catch{return Y}if(t===null||t==="")return Y;let n;try{n=JSON.parse(t)}catch{return Y}if(typeof n!="object"||n===null||Array.isArray(n))return Y;let r=n;return{sidebar:_t(r.sidebar),rightbar:_t(r.rightbar)}}function Ht(e,t){if(e===void 0)return;let n={};t.sidebar!==null&&(n.sidebar=Math.round(t.sidebar)),t.rightbar!==null&&(n.rightbar=Math.round(t.rightbar));try{e.setItem(Wt,JSON.stringify(n))}catch{}}function _t(e){return Bt(e)?Math.round(e):null}function jt(e){if(typeof e!="string")return Y;let t=e.trim().split(/\s+/).filter(n=>n!=="");return{sidebar:Ft(t[0]),rightbar:Ft(t[2])}}function Ft(e){if(e===void 0)return null;let t=/^([0-9]+(?:\.[0-9]+)?)px$/.exec(e);if(t===null)return null;let n=Number(t[1]);return Bt(n)?Math.round(n):null}function $t(e,t,n=null){return n==="sidebar"?t.sidebar!==null&&t.sidebar!==e.sidebar?{sidebar:t.sidebar}:{}:n==="rightbar"?t.rightbar!==null&&t.rightbar!==e.rightbar?{rightbar:t.rightbar}:{}:t.sidebar!==null&&t.sidebar!==e.sidebar?{sidebar:t.sidebar}:t.rightbar!==null&&t.rightbar!==e.rightbar?{rightbar:t.rightbar}:{}}function zt(e,t){return{sidebar:t.sidebar??e.sidebar,rightbar:t.rightbar??e.rightbar}}function Ut(e){let t=[];return e.sidebar!==null&&t.push({column:"sidebar",width:e.sidebar}),e.rightbar!==null&&t.push({column:"rightbar",width:e.rightbar}),t}var Mr="[data-shell-bottom]",Dr="[data-side]",_r='[class*="_sidebarCol"]',Fr='[class*="_rightbarCol"]',Wr=600;function Br(e){let n=e?.layout?.panels;if(typeof n!="object"||n===null)return;let r=n;if(!(typeof r.setSidebar!="function"&&typeof r.setRightbar!="function"))return r}function Gt(e,t){let n=Br(e);if(n===void 0)return!1;let r=!1;for(let{column:o,width:i}of Ut(t)){let s=o==="sidebar"?n.setSidebar:n.setRightbar;if(s!==void 0)try{s.call(n,i),r=!0}catch{}}return r}function qt(e){return e.querySelector(Mr)?.parentElement??null}function Hr(e,t){let n=e.hasAttribute("data-sidebar-collapsed"),r=e.hasAttribute("data-rightbar-collapsed"),o=jt(t?.getComputedStyle(e).gridTemplateColumns);return{sidebar:n?null:o.sidebar??Vt(e.querySelector(_r)),rightbar:r?null:o.rightbar??Vt(e.querySelector(Fr))}}function Vt(e){if(e===null)return null;let t=e.getBoundingClientRect().width;return Number.isFinite(t)&&t>0?Math.round(t):null}function Kt(e){let{document:t,storage:n}=e,r=null,o=null,i=0,s=!1,l=null,c=()=>t.defaultView,d=()=>(r!==null&&r.isConnected||(r=qt(t)),r),a=()=>{let g=d();return g===null?null:Hr(g,c())},u=g=>{let S=g?.getAttribute("data-side");return S==="sidebar"||S==="rightbar"?S:null},p=g=>{let S=a();if(S===null)return;let A=$t(g.before,S,g.side);A.sidebar===void 0&&A.rightbar===void 0||Ht(n,zt(ae(n),A))},f=g=>{if(l!==null)return;let S=g.target,A=typeof S?.closest=="function"?S.closest(Dr):null;if(A===null)return;let E=a();E!==null&&(l={side:u(A),before:E})},m=()=>{let g=l;if(l=null,g===null)return;let S=c()?.requestAnimationFrame;if(S===void 0){p(g);return}S.call(c(),()=>p(g))},y=()=>{if(o=null,s)return;let g=qt(t);if(g!==null){r=g;return}if(i>=Wr)return;i+=1;let S=c()?.requestAnimationFrame;S!==void 0&&(o=S.call(c(),y))};return{attach(){s=!1,i=0;let g=c();return g?.addEventListener("pointerdown",f,!0),g?.addEventListener("pointerup",m,!0),g?.addEventListener("pointercancel",m,!0),y(),()=>{s=!0,l=null,r=null,g?.removeEventListener("pointerdown",f,!0),g?.removeEventListener("pointerup",m,!0),g?.removeEventListener("pointercancel",m,!0),o!==null&&g?.cancelAnimationFrame(o),o=null}}}}var Yt="sessionCompaction";var Jt="dsh-better-compaction",se="dshBetter_compactionStat",jr=`
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
`;function Xt(e){if(e===void 0)return()=>{};if(e.getElementById(Jt)!==null)return()=>{};let t=e.createElement("style");return t.id=Jt,t.textContent=jr,e.head.append(t),()=>{t.remove()}}var Qt=require("react/jsx-runtime");function $r(e,t){if(e===void 0||t===void 0)return null;let{compactions:n,failures:r}=e;if(!Number.isSafeInteger(n)||n<=0)return null;let o=n===1?t("compaction.readingOne"):t("compaction.reading",{count:n}),i=Number.isSafeInteger(r)&&r>0?t("compaction.tooltipWithFailures",{count:n,failures:r}):t("compaction.tooltip",{count:n});return{text:o,tooltip:i}}function zr(){}function Zt({useProjection:e,t}){let r=$r((e??zr)(Yt),t);return r===null?null:(0,Qt.jsx)("span",{className:se,"data-dsh-better":"compaction-stat",title:r.tooltip,children:r.text})}var Le="conversation.composer.dock",en="better-compaction";var Z=require("react");function Ur(e){let t=e.name.trim();return t===""?e.id:t}function tn(e,t){if(e===void 0)return t;let n=Ur(e.group),r=e.model.name.trim();return r===""?n:`${n} ${r}`}var z=require("react/jsx-runtime"),qr="@deepseek-ai/dsh-client-ui-model-selection/ModelSelect.module.css";function Vr(e){if(e===void 0)return;let n=e.querySelector(`style[data-plugin-css="${qr}"]`)?.textContent??"",r=i=>new RegExp(`\\.(\\w+_${i})\\{`,"u").exec(n)?.[1],o={root:r("root"),trigger:r("trigger"),triggerIcon:r("triggerIcon"),triggerLabel:r("triggerLabel"),triggerEffort:r("triggerEffort"),chevron:r("chevron")};for(let i of Object.values(o))if(i===void 0)return;return o}function nn(e){let t=ie(e.load),n=Vr(e.document);function r(o){let i=e.native();return o.available===!1||i===void 0||n===void 0?i===void 0?null:(0,z.jsx)(i,{...o}):(0,z.jsx)(Gr,{props:o,primitives:t,openPicker:e.openPicker,translate:e.translate,classes:n})}return r}function Gr({props:e,primitives:t,openPicker:n,translate:r,classes:o}){let{directory:i,t:s,sessionId:l,locked:c}=e,d=Kr(i),a=s??r(),u=d?.current??null,p=u===null&&d?.status==="loading",f=Yr(d,u),m=p?a?.("trigger.loading")??"":tn(f,a?.("trigger.fallback")??""),y=Jr(d,u,f,a),g=y===void 0?m:`${m} \xB7 ${y}`,S=p?a?.("trigger.loading")??"":u===null?a?.("trigger.selectAria")??"":y===void 0?a?.("trigger.aria",{model:m})??"":a?.("trigger.ariaEffort",{model:m,effort:y})??"",A=()=>{n(l)},E=t.IconDataOutlineRegular,I=t.IconChevronDownOutlineRegular;return(0,z.jsx)("div",{className:o.root,"data-dsh-better-seat":"",children:(0,z.jsxs)("button",{type:"button",className:o.trigger,"aria-label":S,"aria-haspopup":"dialog","aria-expanded":"false",title:g,disabled:c,onClick:A,children:[E===void 0?null:(0,z.jsx)(E,{className:o.triggerIcon,size:16}),(0,z.jsx)("span",{className:o.triggerLabel,"data-provider-id":u?.provider,"data-model-id":u?.model,children:m}),y!==void 0&&(0,z.jsx)("span",{className:o.triggerEffort,children:y}),I===void 0?null:(0,z.jsx)(I,{className:o.chevron})]})})}function Kr(e){let t=(0,Z.useCallback)(r=>e===void 0?()=>{}:e.subscribe(r),[e]),n=(0,Z.useCallback)(()=>e?.getSnapshot(),[e]);return(0,Z.useSyncExternalStore)(t,n)}function Yr(e,t){if(!(e===void 0||t===null||t===void 0)){for(let n of e.groups)if(n.id===t.provider){for(let r of n.models)if(r.id===t.model)return{group:n,model:r}}}}function Jr(e,t,n,r){if(e===void 0||t===null||t===void 0)return;let o=n?.model.reasoning,i=t.reasoningEffort??o?.defaultEffort;return n===void 0?e.retainedEffort:o===void 0||i===void 0?void 0:o.efforts?.find(l=>l.id===i)?.name??i}function rn(e){let r=e?.live?.contributions?.get("model")?.ui;return r==null?void 0:r.kind==="popupSelect"?r:void 0}function on(e){return{sessionId:e}}function an(){return{via:"enter",token:""}}var Xr=`
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
`,sn="dsh-better/tabs.css";function ln(e){let t=`style[data-plugin-css=${JSON.stringify(sn)}]`;if(e.querySelector(t)!==null)return()=>{};let n=e.createElement("style");return n.dataset.plugin="dsh-better",n.dataset.pluginCss=sn,n.textContent=Xr,e.head.append(n),()=>n.remove()}function dn(e){let t;return e.React.createElement("section",{"data-dsh-better-tabs":"",ref:n=>{if(t?.(),t=void 0,n===null)return;let r=()=>{Zr(n,e)};r(),t=e.controller.subscribe(r)}})}function Zr(e,t){let n=e.ownerDocument,{controller:r,copy:o}=t;e.replaceChildren();let i=n.createElement("h2");i.setAttribute("data-dsh-better-tabs-heading",""),i.textContent=o.heading,e.append(i);let s=r.rows();if(s.length===0){let l=n.createElement("p");l.setAttribute("data-dsh-better-tabs-empty",""),l.textContent=o.empty,e.append(l);return}for(let l of s){let c=n.createElement("label");c.setAttribute("data-dsh-better-tabs-row",l.id);let d=n.createElement("span");d.setAttribute("data-dsh-better-tabs-name",""),d.textContent=l.label;let a=n.createElement("input");a.setAttribute("data-dsh-better-tabs-check",l.id),a.type="checkbox",a.checked=l.enabled,a.setAttribute("aria-label",o.checkboxLabel(l.label,l.enabled)),a.addEventListener("change",()=>{r.setEnabled(l.id,a.checked)}),c.append(d,a),e.append(c)}}var Re="conversation.view",Ae="settings.section",cn="tabs";var de="chat",pn="dsh-better.tabs",Q="[data-conversation-tabs]";function fn(e,t){if(typeof e=="string"&&e!=="")return e;if(typeof e=="function")try{let n=e();if(typeof n=="string"&&n!=="")return n}catch{}return t}function Qr(e){if(e===void 0)return new Set;let t;try{t=e.getItem(pn)}catch{return new Set}if(t===null||t==="")return new Set;try{let n=JSON.parse(t);if(!Array.isArray(n))return new Set;let r=new Set;for(let o of n)typeof o=="string"&&o!==""&&o!==de&&r.add(o);return r}catch{return new Set}}function eo(e,t){if(e!==void 0)try{e.setItem(pn,JSON.stringify([...t].sort()))}catch{}}function to(e,t){let n=[],r=new Set;for(let o of e){let i=o.options.id;i===void 0||i===de||r.has(i)||(r.add(i),n.push({id:i,label:fn(o.options.label,i),enabled:!t.has(i)}))}return n}function no(e){let t=[],n=new Set;for(let r of e){let o=r.options.id;o===void 0||o===de||n.has(o)||(n.add(o),t.push({id:o,label:fn(r.options.label,o)}))}return t}function ro(e,t,n){let r=new Set;for(let o of no(e)){if(!t.has(o.id)||o.label==="")continue;n.filter(s=>s.label===o.label).length===1&&r.add(o.label)}return n.map(o=>r.has(o.label))}function oo(e,t){for(let n of e)if(t!==null&&(n.target===t||t.contains?.(n.target)===!0)||un(n.addedNodes,t)||un(n.removedNodes,t))return!0;return!1}function un(e,t){if(e===void 0)return!1;for(let n=0;n<e.length;n+=1){let r=e[n];if(r!==void 0&&(r.matches?.(Q)===!0||r.querySelector?.(Q)!=null||t!==null&&r.contains?.(t)===!0))return!0}return!1}function io(e){let t=e.querySelector(Q);if(t===null||typeof t!="object")return;let r=t.querySelectorAll?.(":scope > button[role='tab']");if(r===void 0)return;let o=[];for(let i=0;i<r.length;i+=1){let s=r[i];s!==void 0&&o.push({label:ao(s),hidden:s.hasAttribute(le),mark:l=>{l?s.setAttribute(le,""):s.removeAttribute(le)}})}return o}function ao(e){return(e.querySelector?.("[class*='tabLabel']")?.textContent??e.textContent??"").trim()}function so(e,t){let n=!1;for(let[r,o]of e.entries()){let i=t[r]??!1;i!==o.hidden&&(o.mark(i),n=!0)}return n}function mn(e){let{ledger:t,storage:n}=e,r=e.readButtons??io,o=e.watch??co,i=new Set(Qr(n)),s=new Set,l,c=()=>{for(let a of[...s])a()},d=30;return{rows:()=>to(t.entriesOfSlot(Re),i),setEnabled(a,u){if(a===de)return!1;let p=i.has(a);return u===!p?!1:(u?i.delete(a):i.add(a),eo(n,i),l?.(),c(),!0)},subscribe(a){return s.add(a),()=>{s.delete(a)}},attach(a){let u=a.createElement("style");u.dataset.plugin="dsh-better",u.dataset.pluginCss=lo,u.textContent=uo,a.head.append(u);let p=a.defaultView?.requestAnimationFrame?.bind(a.defaultView),f=a.defaultView?.cancelAnimationFrame?.bind(a.defaultView),m=p===void 0?0:d,y,g=()=>{let E=t.entriesOfSlot(Re),I=r(a);if(I===void 0||I.length===0){m>0&&p!==void 0&&(m-=1,y=p(()=>g()));return}m=d,y=void 0,so(I,ro(E,i,I))},S=t.subscribe(Re,g),A=o(a,g);return l=g,g(),()=>{S(),A(),l=void 0,y!==void 0&&f?.(y),u.remove()}}}}var lo="dsh-better/strip.css",le="data-dsh-better-tab-hidden",uo=`${Q} > button[${le}] { display: none; }`;function co(e,t){let n=e.defaultView?.MutationObserver,r=e.documentElement;if(n===void 0||r===void 0)return()=>{};let o=new n(i=>{let s=e.querySelector(Q);oo(i,s!==null&&typeof s=="object"?s:null)&&t()});return o.observe(r,{childList:!0,subtree:!0}),()=>o.disconnect()}var V="conversation.input.overlay",gn="settings.section",mo="aliases",go=56,yo="alias-watcher",bn=50,ho="skill-enhancer",bo=bn+1,Ee="conversation.input.model",Te="conversation.input.attachments",ko=-50,So=-60,kn="command-popup",wo=-100,D="better",vo="/better/api/skill-profile",xo=5e3,ue=null;function Sn(e,t){let n,r=Number.POSITIVE_INFINITY;for(let o of e){if(o.options.id!==kn)continue;let i=o.component;if(typeof i!="function"||t!==void 0&&i===t)continue;let s=o.options.priority??0;s<r&&(n=i,r=s)}return n}var wn={name:"dsh-better",inject:["slots","sessions","commandUi","conversation","locale","modelDirectories","remote","remote.session"],apply(e){let t=globalThis.document;e.effect(()=>e.locale.register(D,Nt),"dsh-better: locale"),e.effect(()=>Dt(t),"dsh-better: effort badge stylesheet"),e.effect(()=>Xt(t),"dsh-better: compaction count stylesheet");let n=Ne(Pe()),r=No(e),o={open:!1};e.effect(()=>{let d=Pe(),a=ae(d);e.inject?.(["layout"],f=>{Gt(f,a)});let p=(t===void 0?void 0:Kt({document:t,storage:d}))?.attach();return()=>{p?.()}},"dsh-better: panel width memory"),e.effect(()=>e.slots.inject(Le,()=>e.slots.register({name:Le,id:en,order:-1,locale:D},Zt)),"dsh-better: compaction count"),e.effect(()=>e.slots.inject(V,()=>{let d={},u=St({load:ue,native:()=>Sn(e.slots.entries(V),d.component),document:t});return d.component=u,e.slots.register({name:V,id:kn,priority:wo,locale:D,inject:p=>{let f=Ao(e,p);return{popup:Ro(e,p),catalog:f?.groups,current:f?.current??null,selectModel:m=>e.modelDirectories?.directoryFor?.(p)?.select?.(m)}}},u)}),"dsh-better: /model provider search"),e.effect(()=>e.slots.inject(Ee,()=>{let d={},u=nn({load:ue,native:()=>Oe(e.slots.entries(Ee),d.component),openPicker:p=>Co(e,p),translate:()=>Lo(e),document:t});return d.component=u,e.slots.register({name:Ee,priority:ko,locale:D,inject:p=>({sessionId:p,available:!0,directory:e.modelDirectories?.directoryFor?.(p)?.store})},u)}),"dsh-better: composer model trigger");let i;e.inject?.(["remote.workspaceFiles"],d=>{i=d["remote.workspaceFiles"],d.effect(()=>()=>{i=void 0},"dsh-better: workspace file reader")}),e.effect(()=>e.slots.inject(Te,()=>{let d={},u=At({native:()=>Oe(e.slots.entries(Te),d.component),pathOf:Eo,reader:()=>i,translate:()=>e.locale.bind?.(D)});return d.component=u,e.slots.register({name:Te,priority:So,locale:D,inject:p=>({sessionId:p})},u)}),"dsh-better: composer attachment selection");let s;e.inject?.(["inputTriggers"],d=>{s=d.inputTriggers,d.effect(()=>()=>{s=void 0},"dsh-better: alias trigger service"),d.effect(()=>d.inputTriggers.registerSource(ze({config:()=>n.getSnapshot(),translate:r,bareMenuOpen:()=>o.open,routeCommand:(a,u)=>Io(e,u)})),"dsh-better: alias slash source")}),e.effect(()=>e.slots.inject(V,()=>{let d=Ke({store:n,bareMenuOpen:o,inputStoreFor:a=>{let u=e.sessions.scope?.(a);if(!(u===void 0||e.conversation===void 0))try{return e.conversation.input?.for?.(u)?.state}catch{return}},controllerFor:a=>{let u=e.sessions.scope?.(a);if(u===void 0)return;let p=ce(e,"inputTriggers")??s;if(p!==void 0)try{return p.sessionOf(u)}catch{return}}});return hn(e.slots,{name:V,id:yo,order:bn,inject:a=>({sessionId:a})},d)}),"dsh-better: alias selector watcher"),e.effect(()=>at(t),"dsh-better: skill enhancer stylesheet");let l=To(e);e.effect(()=>e.slots.inject(V,()=>{let d=ot({scopeFor:a=>e.sessions.scope?.(a),inputStoreFor:a=>{let u=e.sessions.scope?.(a);if(!(u===void 0||e.conversation===void 0))try{return e.conversation.input?.for?.(u)?.state}catch{return}},actionsFor:a=>{let u=e.sessions.scope?.(a);if(!(u===void 0||e.conversation===void 0))try{return e.conversation.input?.for?.(u)}catch{return}},skillNamesFor:l.names,loadProfile:async(a,u)=>Po(e,a,u,await l.pathOf(a,u)),loadUsage:(a,u)=>vn(e,a,u),translate:r,document:t});return hn(e.slots,{name:V,id:ho,order:bo,inject:a=>({sessionId:a})},d)}),"dsh-better: skill enhancer"),e.effect(()=>e.slots.inject(gn,()=>{let d=t===void 0?void 0:qe(t),a=$e({store:n,translate:r}),u=yn(e.slots,{name:gn,id:mo,order:go,label:()=>e.locale.bind?.(D)?.("alias.nav")??"Skill aliases",locale:D},a);return()=>{u(),d?.()}}),"dsh-better: alias settings page");let c=mn({ledger:Oo(e.slots),storage:Pe()});e.effect(()=>e.slots.inject(Ae,()=>{let d=globalThis.document,a=d===void 0?void 0:ln(d),u=yn(e.slots,{name:Ae,id:cn,order:55,label:()=>e.locale.bind?.(D)?.("tabs.nav")??"Tabs"},()=>{let p=Mo(ue);return p===null?null:dn({React:p,controller:c,copy:Do(e)})});return()=>{u(),a?.()}}),"dsh-better: tab management"),e.effect(()=>c.attach(t),"dsh-better: tab visibility"),e.inject?.(["shortcuts"],d=>{d.effect(()=>It(d.shortcuts,{currentSessionId:()=>Pt(e),composerMounted:()=>Tt(t),focusComposer:a=>Ot(e,a)},()=>e.locale.bind?.(D)?.(X)??"Focus message input",a=>console.warn(`dsh-better: focus command not registered (${a})`)),"dsh-better: focus composer shortcut")})}};function Oe(e,t){let n,r=Number.POSITIVE_INFINITY;for(let o of e){let i=o.component;if(typeof i!="function"||t!==void 0&&i===t)continue;let s=o.options.priority??0;s<r&&(n=i,r=s)}return n}function Co(e,t){if(t===void 0)return!1;let n=rn(e.commandUi);if(n===void 0)return!1;let r=e.sessions.scope?.(t);if(r===void 0)return!1;let o=e.commandUi.popupFor?.(r);return o===void 0||typeof o.open!="function"?!1:(o.open("model",n,on(t),an()),!0)}function Lo(e){return e.locale?.bind?.(D)}function Ro(e,t){let n=e.sessions.scope?.(t);if(n!==void 0)return e.commandUi.popupFor?.(n)}function Ao(e,t){return e.modelDirectories?.directoryFor?.(t)?.store.getSnapshot()}function Eo(e){let t=globalThis.__DSH_HOST_PATHS__;if(t?.pathFor===void 0)return"";try{let n=t.pathFor(e);return typeof n=="string"?n:""}catch{return""}}function yn(e,t,n){return(e.registerUntyped??e.register).call(e,t,n)}function hn(e,t,n){return(e.registerUntyped??e.register).call(e,t,n)}function To(e){let t=new Map,n=new Map,r=async o=>{let i=t.get(o);if(i!==void 0)return i;let s=n.get(o);if(s!==void 0&&Date.now()-s<xo)return;let l=ce(e,"remote.skills");if(l!==void 0)try{let c=await l.list({sessionId:o});if(!c.ok){n.set(o,Date.now());return}let d=new Map(c.value.skills.map(a=>[a.name,a]));return t.set(o,d),n.delete(o),d}catch{n.set(o,Date.now());return}};return{names:async o=>new Set((await r(o))?.keys()??[]),pathOf:async(o,i)=>(await r(o))?.get(i)?.path}}async function Po(e,t,n,r){let o=`?sessionId=${encodeURIComponent(t)}&name=${encodeURIComponent(n)}`+(r===void 0?"":`&path=${encodeURIComponent(r)}`);try{let i=await fetch(`${vo}${o}`,{headers:{accept:"application/json"}});return i.ok?await i.json():void 0}catch{return}}function vn(e,t,n){let r=e.sessions.list??ce(e,"sessions.list");try{let o=r?.getSnapshot?.(),i=u=>{let f=o?.projectionsBySession?.[u]?.values?.skillUsage;if(typeof f!="object"||f===null)return;let m=f.counts;return typeof m=="object"&&m!==null?m:void 0},s=i(t)?.[n],l=typeof s=="number"&&Number.isFinite(s)?s:0,c=o?.byId?.[t]?.cwd;if(typeof c!="string"||c==="")return{session:l};let d=Object.keys(o?.byId??{}).map(u=>{let p=i(u),f=o?.byId?.[u]?.cwd;return{...typeof f=="string"?{cwd:f}:{},...p===void 0?{}:{usage:p}}}),a=st(d,c,n);return a===void 0?{session:l}:{session:l,workspace:a}}catch{return{session:0}}}function Oo(e){return{entriesOfSlot:t=>(e.entriesOfSlot??e.entries).call(e,t),subscribe:(t,n)=>e.subscribe?.(t,n)??(()=>{})}}function Pe(){try{return globalThis.localStorage}catch{return}}function ce(e,t){try{return typeof e.get=="function"?e.get(t):e[t]}catch{return}}function Io(e,t){let n=t.session?.sessionId;if(n===void 0)return;let r=e.sessions.scope?.(n);if(r===void 0)return;let o=ce(e,"inputTriggers");if(o!==void 0)try{let i=o.sessionOf(r),s=e.conversation?.input?.for?.(r)?.state,l=0,c=()=>{let d=s?.getSnapshot();if(!(d===void 0||d.draft.trim()===""||!d.draft.startsWith("/"))){try{let a=d.draft.trimStart().split(/\s/u)[0]??"";if(!a.startsWith("/")||(i.track?.(a,a.length,{tier:"plain"},d.draftRev),i.onSpace?.()===!0))return;i.dismiss?.()}catch{}l+=1,l<4&&setTimeout(c,25)}};setTimeout(c,0)}catch{}}function No(e){return(t,n)=>{try{return e.locale.bind?.(D)?.(t,n)??t}catch{return t}}}function Mo(e){if(e===null)return null;try{let t=e("react");if(typeof t!="object"||t===null)return null;let n=t;return typeof n.createElement=="function"?n:null}catch{return null}}function Do(e){let t=e.locale.bind?.(D),n=(r,o)=>t?.(r)??o;return{heading:n("tabs.heading","Tabs"),empty:n("tabs.empty","No plugin has registered a conversation tab yet."),checkboxLabel:(r,o)=>n(o?"tabs.hide":"tabs.show","{label}").replace("{label}",r)}}function _o(e){ue=e}var Fo=wn;

    // Hand the loader's `require` to the module's `boot` export before the
    // plugin mounts. Read from `module.exports` rather than the default export:
    // esbuild emits named exports there and the plugin object separately, so the
    // default export alone never carries `boot`.
    if (typeof module.exports.boot === "function") module.exports.boot(require);
    return module.exports.default ?? module.exports;
  }
});
