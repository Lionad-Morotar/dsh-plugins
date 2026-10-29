window.__ModuleLoader__.load({
  id: "dsh-command-panel",
  factory: (require) => {
    var module = { exports: {} };
    var exports = module.exports;
"use strict";var j=Object.defineProperty;var on=Object.getOwnPropertyDescriptor;var tn=Object.getOwnPropertyNames;var sn=Object.prototype.hasOwnProperty;var rn=(e,n)=>{for(var o in n)j(e,o,{get:n[o],enumerable:!0})},an=(e,n,o,r)=>{if(n&&typeof n=="object"||typeof n=="function")for(let t of tn(n))!sn.call(e,t)&&t!==o&&j(e,t,{get:()=>n[t],enumerable:!(r=on(n,t))||r.enumerable});return e};var ln=e=>an(j({},"__esModule",{value:!0}),e);var _n={};rn(_n,{PLATFORM_PRIMITIVES:()=>Le,PLATFORM_REACT:()=>Te,PLATFORM_REACT_DOM:()=>Ae,boot:()=>Bn,clientPlugin:()=>Oe,default:()=>Nn,detectPlatform:()=>De,inject:()=>We});module.exports=ln(_n);function re(e,n){return function(r){let t=r,l=t.sessionId??null,a=t.inputActions??null,d=e.useRef({sessionId:l,inputActions:a});d.current={sessionId:l,inputActions:a};let f=a!==null;return e.useEffect(()=>{n({sessionId:l,inputActions:d.current.inputActions})},[l,f]),null}}function dn(e,n){let o=n==="macos"?"meta":"control",r=e.map(t=>t==="primary"?o:t);return[...new Set(r)].sort()}function cn(e,n,o){if(e==null||e.code!==n.code||(e.secondCode??"")!==(n.secondCode??""))return!1;let r=[...e.modifiers].sort(),t=dn(n.modifiers,o);return r.length===t.length&&r.every((l,a)=>l===t[a])}function V(e,n,o){let r=n.current(e.id);if(r===void 0)return{kind:"skip",id:e.id,reason:"not-registered"};if(cn(r,e.binding,o))return{kind:"skip",id:e.id,reason:"already-bound"};let t=n.describe(e.binding),l=t.keys.join("+");return t.issue!==null?{kind:"blocked",id:e.id,keys:l,reason:t.issue}:t.conflicts.length>0?{kind:"blocked",id:e.id,keys:l,reason:t.conflicts.join(", ")}:{kind:"claim",id:e.id,binding:e.binding}}var un={title:"\u547D\u4EE4\u9762\u677F",placeholder:{navigate:"\u641C\u7D22\u6587\u4EF6\uFF0C\u56DE\u8F66\u628A\u7EDD\u5BF9\u8DEF\u5F84\u5199\u8FDB\u8F93\u5165\u6846",command:"\u641C\u7D22\u5DF2\u6CE8\u518C\u7684\u6307\u4EE4\uFF0C\u56DE\u8F66\u6267\u884C",switch:"\u641C\u7D22\u5DE5\u4F5C\u533A"},empty:{navigate:"\u6CA1\u6709\u53EF\u5BFC\u822A\u7684\u6587\u4EF6",command:"\u6CA1\u6709\u53EF\u7528\u7684\u6307\u4EE4",switch:"\u8FD8\u6CA1\u6709\u5DE5\u4F5C\u533A"},loading:"\u8BFB\u53D6\u4E2D",noResults:"\u6CA1\u6709\u5339\u914D\u7684\u7ED3\u679C",failed:"\u8BFB\u53D6\u5931\u8D25",directory:"\u76EE\u5F55",groupBuiltin:"\u9762\u677F",groupCommands:"\u6307\u4EE4",groupWorkspaces:"\u5DE5\u4F5C\u533A",groupSessions:"\u4F1A\u8BDD",allSessions:"\u5168\u90E8\u4F1A\u8BDD",allSessionsDetail:"\u8DE8\u5DE5\u4F5C\u533A\u641C\u7D22\u4F1A\u8BDD",ungrouped:"\u672A\u5206\u7EC4",sessionsCount:e=>`${e} \u4E2A\u4F1A\u8BDD`,running:"\u8FD0\u884C\u4E2D",needsInput:"\u9700\u8981\u53C2\u6570",modeNames:{navigate:"\u6587\u4EF6\u5BFC\u822A",command:"\u6307\u4EE4",switch:"\u5207\u6362"},modeDescriptions:{navigate:"\u628A\u6587\u4EF6\u7684\u7EDD\u5BF9\u8DEF\u5F84\u5199\u8FDB\u8F93\u5165\u6846",command:"\u641C\u7D22\u5E76\u6267\u884C\u5DF2\u6CE8\u518C\u7684\u6307\u4EE4",switch:"\u5148\u9009\u5DE5\u4F5C\u533A\uFF0C\u518D\u9009\u4F1A\u8BDD"},footer:{move:"\u2191\u2193 \u79FB\u52A8",accept:"\u21B5 \u786E\u8BA4",back:"esc \u8FD4\u56DE",close:"esc \u5173\u95ED"},noticeNoSession:"\u5F53\u524D\u6CA1\u6709\u6253\u5F00\u7684\u4F1A\u8BDD\uFF0C\u65E0\u6CD5\u5199\u5165\u8F93\u5165\u6846",noticeInsertFailed:"\u8F93\u5165\u6846\u6B63\u5FD9\uFF0C\u7A0D\u540E\u91CD\u8BD5",noticeExecuted:(e,n)=>n===void 0||n===""?`\u5DF2\u6267\u884C /${e}`:`/${e}\uFF1A${n}`,noticeExecuteFailed:(e,n)=>`/${e} \u6267\u884C\u5931\u8D25${n===void 0||n===""?"":`\uFF1A${n}`}`,noticeWorkspaceEmpty:"\u8FD9\u4E2A\u5DE5\u4F5C\u533A\u8FD8\u6CA1\u6709\u4F1A\u8BDD",noticeClaimFailed:e=>`\u5FEB\u6377\u952E ${e} \u5DF2\u88AB\u5360\u7528\uFF0C\u53EF\u5728\u8BBE\u7F6E \u2192 \u5FEB\u6377\u952E\u91CC\u6539\u7ED1`,age:e=>{let n=Math.floor(e/6e4);if(n<1)return"\u521A\u521A";if(n<60)return`${n} \u5206\u949F\u524D`;let o=Math.floor(n/60);return o<24?`${o} \u5C0F\u65F6\u524D`:`${Math.floor(o/24)} \u5929\u524D`}},pn={title:"Command Panel",placeholder:{navigate:"Search files; Enter inserts the absolute path",command:"Search registered commands; Enter runs one",switch:"Search workspaces"},empty:{navigate:"No files to navigate",command:"No commands available",switch:"No workspaces yet"},loading:"Loading",noResults:"No matching result",failed:"Read failed",directory:"dir",groupBuiltin:"Panel",groupCommands:"Commands",groupWorkspaces:"Workspaces",groupSessions:"Sessions",allSessions:"All sessions",allSessionsDetail:"Search sessions across workspaces",ungrouped:"Ungrouped",sessionsCount:e=>`${e} session${e===1?"":"s"}`,running:"running",needsInput:"takes input",modeNames:{navigate:"Files",command:"Commands",switch:"Switch"},modeDescriptions:{navigate:"Insert a file's absolute path into the composer",command:"Search and run a registered command",switch:"Pick a workspace, then a session"},footer:{move:"\u2191\u2193 move",accept:"\u21B5 select",back:"esc back",close:"esc close"},noticeNoSession:"No open session, so there is no composer to write to",noticeInsertFailed:"The composer is busy; try again",noticeExecuted:(e,n)=>n===void 0||n===""?`Ran /${e}`:`/${e}: ${n}`,noticeExecuteFailed:(e,n)=>`/${e} failed${n===void 0||n===""?"":`: ${n}`}`,noticeWorkspaceEmpty:"This workspace has no sessions yet",noticeClaimFailed:e=>`${e} is taken; rebind it in Settings \u2192 Shortcuts`,age:e=>{let n=Math.floor(e/6e4);if(n<1)return"just now";if(n<60)return`${n}m ago`;let o=Math.floor(n/60);return o<24?`${o}h ago`:`${Math.floor(o/24)}d ago`}};function ie(e){return e.toLowerCase().startsWith("en")?pn:un}var F=["navigate","command","switch"];function B(e){return{mode:e,level:"root",scope:null,query:"",highlight:0}}function ae(e,n){return{...e,query:n,highlight:0}}function le(e,n){return n<=0||e<0?0:e>=n?n-1:e}function de(e,n,o){if(o<=0)return{...e,highlight:0};let r=(e.highlight+n)%o;return{...e,highlight:r<0?r+o:r}}function ce(e,n,o){return{...e,highlight:le(n,o)}}function ue(e,n){return{...e,level:"sessions",scope:n,query:"",highlight:0}}function pe(e){return e.mode==="switch"&&e.level==="sessions"?{kind:"model",model:{...e,level:"root",scope:null,query:"",highlight:0}}:{kind:"close"}}function fe(e,n){return le(e.highlight,n)}var me="dsh-command-panel",ge="data-plugin-css",h="data-dcp-root",fn=`
[${h}] {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: max(64px, var(--dsh-frame-overlay-top, 64px)) 16px 16px;
  font: var(--dsw-font-s-14, 14px/22px system-ui, sans-serif);
  color: var(--dsw-alias-label-primary, #1b1b1f);
}

[${h}] [data-dcp-mask] {
  position: absolute;
  inset: 0;
  background: var(--dsw-alias-bg-mask-1, rgba(0, 0, 0, 0.24));
  backdrop-filter: var(--dsw-mask-blur, none);
  animation: dcp-fade var(--ds-transition-duration, 0.2s) var(--ds-ease-in-out, ease-out);
}

[${h}] [data-dcp-card] {
  position: relative;
  display: flex;
  flex-direction: column;
  width: min(680px, 100%);
  max-height: min(64vh, 620px);
  overflow: hidden;
  border: 1px solid var(--dsw-alias-border-l2, rgba(0, 0, 0, 0.08));
  border-radius: var(--dsw-radius-panel, 16px);
  background: var(--dsw-alias-bg-layer-2, #ffffff);
  box-shadow: var(--dsw-elevation-prominent, 0 12px 32px rgba(0, 0, 0, 0.16));
  animation: dcp-rise var(--ds-transition-duration, 0.2s) var(--ds-ease-in-out, ease-out);
}

[${h}] [data-dcp-head] {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 14px;
  border-bottom: 1px solid var(--dsw-alias-border-l1, rgba(0, 0, 0, 0.06));
}

[${h}] [data-dcp-modes] {
  display: flex;
  gap: 2px;
  padding: 2px;
  border-radius: var(--dsw-radius-sm, 8px);
  background: var(--dsw-alias-bg-layer-1, rgba(0, 0, 0, 0.04));
}

[${h}] [data-dcp-mode] {
  padding: 3px 9px;
  border: 0;
  border-radius: calc(var(--dsw-radius-sm, 8px) - 2px);
  background: transparent;
  color: var(--dsw-alias-label-tertiary, #6b6b76);
  cursor: pointer;
  font: inherit;
  font-size: 12px;
  line-height: 18px;
  white-space: nowrap;
}

[${h}] [data-dcp-mode][data-active="true"] {
  background: var(--dsw-alias-bg-layer-2, #ffffff);
  color: var(--dsw-alias-label-primary, #1b1b1f);
  box-shadow: var(--dsw-elevation-soft, 0 1px 2px rgba(0, 0, 0, 0.08));
}

[${h}] [data-dcp-crumb] {
  padding: 3px 9px;
  border: 0;
  border-radius: var(--dsw-radius-sm, 8px);
  background: transparent;
  color: var(--dsw-alias-label-secondary, #4a4a55);
  cursor: pointer;
  font: inherit;
  font-size: 12px;
  line-height: 18px;
  max-width: 180px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

[${h}] [data-dcp-crumb]:hover {
  background: var(--dsw-alias-interactive-bg-hover, rgba(0, 0, 0, 0.06));
}

[${h}] [data-dcp-query] {
  flex: 1;
  min-width: 0;
  padding: 2px 0;
  border: 0;
  background: transparent;
  color: inherit;
  font: inherit;
  outline: none;
}

[${h}] [data-dcp-query]::placeholder {
  color: var(--dsw-alias-label-tertiary, #8a8a95);
}

[${h}] [data-dcp-list] {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  overscroll-behavior: contain;
  padding: 6px;
}

[${h}] [data-dcp-group] {
  padding: 8px 10px 4px;
  color: var(--dsw-alias-label-tertiary, #8a8a95);
  font-size: 11px;
  line-height: 16px;
  letter-spacing: 0.02em;
}

[${h}] [data-dcp-row] {
  display: flex;
  align-items: center;
  gap: 10px;
  min-height: 34px;
  padding: 6px 10px;
  border-radius: var(--dsw-radius-sm, 8px);
  cursor: pointer;
}

[${h}] [data-dcp-row]:hover,
[${h}] [data-dcp-row][data-active="true"] {
  background: var(--dsw-alias-interactive-bg-hover, rgba(0, 0, 0, 0.06));
}

[${h}] [data-dcp-label] {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

[${h}] [data-dcp-row][data-kind="command"] [data-dcp-label] {
  font-family: var(--ds-font-family-code, ui-monospace, monospace);
  font-size: 13px;
}

[${h}] [data-dcp-detail] {
  flex: 0 1 auto;
  min-width: 0;
  max-width: 46%;
  overflow: hidden;
  color: var(--dsw-alias-label-tertiary, #8a8a95);
  font-size: 12px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

[${h}] [data-dcp-hint] {
  flex: none;
  padding: 0 5px;
  border: 1px solid var(--dsw-alias-border-l2, rgba(0, 0, 0, 0.1));
  border-radius: 4px;
  color: var(--dsw-alias-label-tertiary, #8a8a95);
  font-size: 11px;
  line-height: 16px;
  font-variant-numeric: tabular-nums;
}

[${h}] [data-dcp-status] {
  padding: 12px 14px;
  color: var(--dsw-alias-label-tertiary, #8a8a95);
  font-size: 12px;
}

[${h}] [data-dcp-notice] {
  padding: 8px 14px;
  border-top: 1px solid var(--dsw-alias-border-l1, rgba(0, 0, 0, 0.06));
  color: var(--dsw-alias-label-secondary, #4a4a55);
  font-size: 12px;
}

[${h}] [data-dcp-notice][data-tone="error"] {
  color: var(--dsw-alias-state-error, #c0392b);
}

[${h}] [data-dcp-foot] {
  display: flex;
  gap: 14px;
  padding: 8px 14px;
  border-top: 1px solid var(--dsw-alias-border-l1, rgba(0, 0, 0, 0.06));
  color: var(--dsw-alias-label-tertiary, #8a8a95);
  font-size: 11px;
  line-height: 16px;
}

@keyframes dcp-fade {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes dcp-rise {
  from { opacity: 0; transform: translateY(-6px); }
  to { opacity: 1; transform: translateY(0); }
}

@media (prefers-reduced-motion: reduce) {
  [${h}] [data-dcp-mask],
  [${h}] [data-dcp-card] {
    animation: none;
  }
}
`;function ye(e){let n=`style[${ge}="${me}"]`;if(e.querySelector(n)!==null)return()=>{};let o=e.createElement("style");return o.setAttribute(ge,me),o.textContent=fn,e.head.append(o),()=>o.remove()}var z="command-panel",mn={type:"text",spellCheck:!1,autoComplete:"off","data-dcp-query":"","data-modal-autofocus":""},gn=new Set(["ArrowDown","ArrowUp","PageDown","PageUp","Enter","Tab","Escape"]);function he(e){let{React:n,store:o,copy:r}=e,t=n.createElement,l=e.document;return function(){let d=n.useSyncExternalStore(g=>o.subscribe(g),()=>o.getSnapshot()),f=n.useRef(null),x=n.useRef(null),P=n.useMemo(()=>e.primitives.observeComposition(l),[]),k=d.open;if(n.useEffect(()=>()=>P.dispose(),[P]),e.primitives.useModalLayer(f,k,e.dismiss),n.useEffect(()=>{k&&x.current?.focus()},[k]),n.useEffect(()=>{if(!k||f.current===null)return;let g=f.current.querySelector('[data-dcp-row][data-active="true"]');g!==null&&typeof g.scrollIntoView=="function"&&g.scrollIntoView({block:"nearest"})},[k,d.model.highlight,d.rows]),n.useEffect(()=>{if(!k)return;let g=l.defaultView??globalThis.window;if(g===void 0)return;let C=I=>{if(gn.has(I.key)&&!P.guards(I))switch(I.preventDefault(),I.stopPropagation(),I.key){case"ArrowDown":e.move(1);return;case"ArrowUp":e.move(-1);return;case"PageDown":e.move(8);return;case"PageUp":e.move(-8);return;case"Enter":case"Tab":e.acceptActive();return;case"Escape":e.back();return;default:return}};return g.addEventListener("keydown",C,!0),()=>g.removeEventListener("keydown",C,!0)},[k,P]),!k)return null;let $=l.body;if($===null)return null;let{model:R,rows:y}=d,w=fe(R,y.length),b=[],M;y.forEach((g,C)=>{g.group!==void 0&&g.group!==M&&b.push(t("div",{key:`group:${g.group}`,"data-dcp-group":""},g.group)),M=g.group,b.push(t("div",{key:g.key,"data-dcp-row":"","data-kind":g.action.kind,"data-active":C===w?"true":void 0,role:"option","aria-selected":C===w,onMouseMove:()=>e.highlight(C),onClick:()=>e.accept(g)},t("span",{"data-dcp-label":""},g.label),g.detail===void 0?null:t("span",{"data-dcp-detail":""},g.detail),g.hint===void 0?null:t("span",{"data-dcp-hint":""},g.hint)))});let A=e.crumbLabel(),D=yn(d.status,d.message,y.length,R,r),W=t("div",{"data-dcp-card":""},t("div",{"data-dcp-head":""},t("div",{"data-dcp-modes":"",role:"tablist"},...F.map(g=>t("button",{key:g,type:"button",role:"tab","data-dcp-mode":"","data-active":g===R.mode?"true":void 0,"aria-selected":g===R.mode,onMouseDown:C=>C.preventDefault(),onClick:()=>e.switchMode(g)},r.modeNames[g]))),A===null?null:t("button",{type:"button","data-dcp-crumb":"",title:A,onMouseDown:g=>g.preventDefault(),onClick:()=>e.back()},`\u2039 ${A}`),t("input",{...mn,ref:x,value:R.query,placeholder:r.placeholder[R.mode],"aria-label":r.title,onChange:g=>e.setQuery(g.currentTarget.value)})),y.length===0?t("div",{"data-dcp-status":"","aria-live":"polite"},D):t("div",{"data-dcp-list":"",role:"listbox","aria-label":r.title},...b),d.notice===null?null:t("div",{"data-dcp-notice":"","data-tone":d.noticeTone??"info","aria-live":"polite"},d.notice),t("div",{"data-dcp-foot":""},t("span",null,r.footer.move),t("span",null,r.footer.accept),t("span",null,A===null?r.footer.close:r.footer.back)));return e.dom.createPortal(t("div",{ref:f,[h]:"","data-shortcut-modal":z,role:"dialog","aria-modal":"true","aria-label":r.title,tabIndex:-1},t("div",{"data-dcp-mask":"","aria-hidden":"true",onClick:()=>e.dismiss()}),W),$)}}function yn(e,n,o,r,t){return e==="error"?n??t.failed:o===0&&r.query!==""?t.noResults:o===0?t.empty[r.mode]:t.loading}var hn=/^[A-Za-z]:[\\/]/,wn=/^\\\\/;function vn(e){return e.startsWith("/")||hn.test(e)||wn.test(e)}function bn(e){return e.includes("\\")&&!e.includes("/")?"\\":"/"}function ve(e,n){let o=n.startsWith("./")?n.slice(2):n;if(vn(o)||e==="")return o;let r=bn(e),t=e.endsWith(r)?e.slice(0,-r.length):e,l=/[\\/]$/.test(o),a=o.split(/[\\/]/).filter(f=>f!==""),d=a.join(r)+(l&&a.length>0?r:"");return t===""?`${r}${d}`:d===""?`${t}${r}`:`${t}${r}${d}`}var Sn="(\uFF08[{\u3010\u300C\u300E\"'`",kn=")]}\uFF09\u3011\u300D\u300F\"'`";function we(e){return e===void 0||/\s/.test(e)}function H(e,n,o){let r=Math.max(0,Math.min(n,e.length)),t=r>0?e[r-1]:void 0,l=r<e.length?e[r]:void 0,a=t!==void 0&&!we(t)&&!Sn.includes(t),d=l!==void 0&&!we(l)&&!kn.includes(l)&&!o.endsWith("/")&&!o.endsWith("\\");return`${a?" ":""}${o}${d?" ":""}`}function K(e){let n=e.path.replace(/^\.\//,"");return e.kind!=="directory"||n===""||n.endsWith("/")?n:`${n}/`}var xn=/[\s/\\\-_.:(\[{"']/;function Pn(e,n){let o=e.trim().toLowerCase();if(o==="")return 0;let r=n.toLowerCase();if(r===o)return 1e3;if(r.startsWith(o))return 900-Math.min(90,r.length-o.length);let t=r.indexOf(o);if(t>=0){let f=r[t-1];return(t===0||f!==void 0&&xn.test(f)?800:700)-Math.min(90,t)}let l=0,a=-1,d=0;for(let f of o){let x=r.indexOf(f,l);if(x===-1)return null;a>=0&&(d+=x-a-1),a=x,l=x+1}return 400-Math.min(300,d*4)}function Rn(e,n){let o=null,r=(t,l)=>{if(t===void 0||t==="")return;let a=Pn(e,t);if(a===null)return;let d=Math.round(a*l);(o===null||d>o)&&(o=d)};return r(n.label,1),r(n.alias,.95),r(n.detail,.55),o}function Cn(e,n,o){let r=[],t=0;for(let l of e){let a=Rn(o,n(l));a!==null&&r.push({item:l,score:a,order:t}),t+=1}return r.sort((l,a)=>a.score-l.score||l.order-a.order),r.map(l=>l.item)}function N(e,n){let o=[],r=new Map;for(let l of e){let a=l.group??"",d=r.get(a);d===void 0?(r.set(a,[l]),o.push(a)):d.push(l)}let t=[];for(let l of o){let a=r.get(l);a!==void 0&&t.push(...Cn(a,d=>({label:d.label,alias:d.alias,detail:d.detail}),n))}return t}function be(e,n){return e.candidates.map(o=>{let r=ve(e.cwd,K(o)),t=K(o),l=Math.max(t.lastIndexOf("/"),t.lastIndexOf("\\"));return{key:`file:${o.kind}:${o.path}`,label:t,alias:l>=0?t.slice(l+1):t,detail:o.kind==="directory"?n.directory:void 0,action:{kind:"insert-path",absolutePath:r}}})}function Se(e,n){return e.map(o=>({key:`command:${o.name}`,label:`/${o.name}`,detail:o.description,hint:o.input===void 0?void 0:o.input.hint,group:n.groupCommands,action:{kind:"execute-command",name:o.name,needsInput:o.input!==void 0}}))}function _(e,n){return["navigate","command","switch"].map(r=>({key:`mode:${r}`,label:e.modeNames[r],detail:e.modeDescriptions[r],hint:n[r],group:e.groupBuiltin,action:{kind:"open-mode",mode:r}}))}function ke(e,n,o){let r=new Set(n.archivedSessionIds),t=o.kind==="workspace"?Mn(n).get(o.workspaceId):void 0,l=[];for(let a of e.ids){let d=e.byId[a];d!==void 0&&(d.blank||d.origin==="subagent"||r.has(a)||o.kind==="workspace"&&(t===void 0||!t.has(a))||o.kind==="ungrouped"&&xe(n,a)||l.push(d))}return l}function Mn(e){let n=new Map;for(let o of e.items)n.set(o.workspaceId,new Set(o.sessionIds));return n}function xe(e,n){for(let o of e.items)if(o.sessionIds.includes(n))return!0;return!1}function In(e,n){for(let o of e.items)if(o.sessionIds.includes(n))return o.title}function $n(e,n,o){let r=0;for(let t of n.sessionIds){let l=e.byId[t];l===void 0||l.blank||l.origin==="subagent"||o.has(t)||(r+=1)}return r}function Pe(e,n,o){let r=new Set(e.archivedSessionIds),t=[];for(let a of e.items){let d=$n(n,a,r);t.push({key:`workspace:${a.workspaceId}`,label:a.title,alias:a.path,detail:a.path,hint:o.sessionsCount(d),action:{kind:"drill",scope:{kind:"workspace",workspaceId:a.workspaceId},title:a.title}})}let l=n.ids.filter(a=>{let d=n.byId[a];return d===void 0||d.blank||d.origin==="subagent"||r.has(a)?!1:!xe(e,a)}).length;return t.push({key:"scope:all",label:o.allSessions,detail:o.allSessionsDetail,hint:o.sessionsCount(ke(n,e,{kind:"all"}).length),action:{kind:"drill",scope:{kind:"all"},title:o.allSessions}}),l>0&&t.push({key:"scope:ungrouped",label:o.ungrouped,hint:o.sessionsCount(l),action:{kind:"drill",scope:{kind:"ungrouped"},title:o.ungrouped}}),t}function Re(e,n,o,r,t){let l=[...ke(e,n,o)];return l.sort((a,d)=>d.updatedAt-a.updatedAt),l.map(a=>{let d=o.kind==="all"?In(n,a.id):void 0,f=r.age(t-a.updatedAt);return{key:`session:${a.id}`,label:a.displayTitle,detail:d===void 0?f:`${d} \xB7 ${f}`,hint:a.running?r.running:void 0,action:{kind:"open-session",sessionId:a.id}}})}var Y="commandPanel";function En(e,n){return e.byId[n]?.cwd??""}async function Ce(e,n,o,r){return e.using(n,{source:Y,signal:o},async t=>(await t.ready,r()))}async function Q(e,n){return n.mode==="navigate"?An(e,n):n.mode==="command"?Ln(e,n):Tn(e,n)}function Tn(e,n){let o=e.sessions(),r=e.workspaces();if(o===void 0||r===void 0)return{rows:[],status:"error",message:n.copy.failed};let t=o.list.getSnapshot(),l=r.list.getSnapshot();return{rows:n.level==="sessions"?Re(t,l,n.scope??{kind:"all"},n.copy,e.now()):Pe(l,t,n.copy),status:"ready"}}async function An(e,n){let{copy:o,query:r}=n,t=n.sessionId;if(t===null)return{rows:[],status:"error",message:o.noticeNoSession};let l=e.fileReferences(),a=e.sessions();if(l===void 0||a===void 0)return{rows:[],status:"error",message:o.failed};let d=En(a.list.getSnapshot(),t);try{let f=await Ce(a,t,n.signal,()=>l.list(t,r,n.signal));return f.ok?{rows:be({candidates:f.value,cwd:d},o),status:"ready"}:{rows:[],status:"error",message:f.error.code}}catch(f){return Me(f)?{rows:[],status:"ready"}:{rows:[],status:"error",message:Ie(f,o.failed)}}}async function Ln(e,n){let{copy:o,query:r}=n,t=_(o,n.hints),l=n.sessionId;if(l===null)return{rows:t,status:"ready"};let a=e.commands(),d=e.sessions();if(a===void 0||d===void 0)return{rows:[],status:"error",message:o.failed};try{let f=await Ce(d,l,n.signal,()=>a.list(l));return f.ok?{rows:[...t,...Se(f.value,o)],status:"ready"}:{rows:t,status:"ready",warning:f.error.code}}catch(f){return Me(f)?{rows:[],status:"ready"}:{rows:t,status:"ready",warning:Ie(f,o.failed)}}}function Me(e){return e instanceof Error&&e.name==="AbortError"}function Ie(e,n){return e instanceof Error&&e.message!==""?e.message:n}function $e(e="navigate"){let n={open:!1,model:B(e),rows:[],status:"idle",message:null,notice:null},o=new Set,r=()=>{for(let t of[...o])t()};return{getSnapshot:()=>n,subscribe(t){return o.add(t),()=>{o.delete(t)}},set(t){n={...n,...t},r()},update(t){n=t(n),r()}}}var T={navigate:"command-panel.navigate",command:"command-panel.commands",switch:"command-panel.switch"},G=200,Dn={"desktop:macos":{code:"KeyP",modifiers:["primary","shift"]},"desktop:windows":{code:"KeyP",modifiers:["primary","shift"]},"web:macos":{code:"KeyP",modifiers:["primary","shift"]},"web:windows":{code:"KeyP",modifiers:["primary","shift"]}},yo=new Map([[T.navigate,"navigate"],[T.command,"command"],[T.switch,"switch"]]);function Ee(e){let n=e.document??globalThis.document,o=$e(),r={state:{sessionId:null,inputActions:null}},t=new Map,l=new Set,a=[],d=null,f=null,x=0,P=!1,k=!1,$=!1,R="",y={},w=()=>ie(y.locale?.getSnapshot().active??"zh"),b={fileReferences:()=>y.fileReferences,commands:()=>y.commands,sessions:()=>y.sessions,workspaces:()=>y.workspaces,shortcuts:()=>y.shortcuts,conversation:()=>y.conversation,uiWorkspace:()=>y.uiWorkspace,now:e.now??(()=>Date.now())};function M(){let s=r.state.sessionId;if(s!==null)return s;let i=b.sessions();if(i===void 0)return null;let c=i.list.getSnapshot();for(let u of c.ids)if((c.byId[u]?.retainedBy?.mainView??0)>0)return u;return null}function A(s){if(s===null)return null;let i=b.sessions(),c=b.conversation();if(i===void 0||c===void 0)return null;let u=i.scope(s);if(u===void 0)return null;try{return c.input.for(u)}catch{return null}}function D(s,i="info"){o.set({notice:s,noticeTone:i})}function W(s,i="info"){let c=A(M());if(c!==null)try{c.notify(i,s);return}catch{}console[i==="error"?"warn":"info"]("[dsh-command-panel]",s)}function g(s,i,c,u){return[s,i,c,u??"-"].join("|")}function C(s){let{model:i}=s,c=i.scope===null?"-":i.scope.kind==="workspace"?i.scope.workspaceId:i.scope.kind;return g(i.mode,i.level,c,M())}function I(){let s={},i=b.shortcuts();if(i===void 0)return s;let c=new Map(i.catalog.getSnapshot().map(u=>[u.id,u]));for(let u of F){let p=c.get(T[u])?.keys??[];p.length>0&&(s[u]=p.join(" "))}return s}function Fe(s){let i=o.getSnapshot();return{mode:i.model.mode,level:i.model.level,scope:i.model.scope,query:i.model.query,sessionId:M(),copy:w(),hints:I(),signal:s}}function Be(){let s=o.getSnapshot(),i=N(a,s.model.query).slice(0,G);o.set({rows:i})}async function J(){if(!o.getSnapshot().open||P)return;if(k){$=!0;return}k=!0,R=q(),d?.abort();let i=new AbortController;d=i;let c=++x;try{let u=await Q(b,Fe(i.signal));if(P||c!==x)return;let p=o.getSnapshot();if(!p.open)return;a=u.rows,t.set(C(p),u.rows),o.set({rows:N(u.rows,p.model.query).slice(0,G),status:u.status,message:u.message??null,notice:u.warning??null,noticeTone:u.warning===void 0?void 0:"error"})}catch(u){if(P||c!==x)return;o.set({status:"error",message:u instanceof Error?u.message:w().failed})}finally{k=!1,$&&!P&&($=!1,O(0))}}function O(s){if(f!==null&&clearTimeout(f),s<=0){f=null,J();return}f=setTimeout(()=>{f=null,J()},s)}async function Ne(s){if(!(s===null||P))for(let i of["navigate","command"]){let c=g(i,"root","-",s);if(!(t.has(c)||l.has(c))){l.add(c);try{let u=await Q(b,{mode:i,level:"root",scope:null,query:"",sessionId:s,copy:w(),hints:I(),signal:new AbortController().signal});u.status==="ready"&&t.set(c,u.rows)}catch{}}}}function U(s){let i=o.getSnapshot(),c=B(s),u=M(),p=t.get(g(s,"root","-",u));a=p??[];let m=p===void 0&&s==="command"?_(w(),I()):p??[];o.set({open:!0,model:c,rows:N(m,"").slice(0,G),status:"loading",message:null,notice:null,noticeTone:void 0}),R=q(),O(0)}function _e(s){let i=o.getSnapshot();if(i.open&&i.model.mode===s){L();return}U(s)}function Ue(s){let i=o.getSnapshot();i.open&&i.model.mode===s||U(s)}function L(){d?.abort(),d=null,f!==null&&(clearTimeout(f),f=null),x+=1,a=[],k=!1,$=!1,R="",o.set({open:!1,status:"idle",notice:null,noticeTone:void 0})}function qe(){let{model:s}=o.getSnapshot(),i=s.scope;if(i===null)return null;let c=w();return i.kind==="all"?c.allSessions:i.kind==="ungrouped"?c.ungrouped:b.workspaces()?.list.getSnapshot().items.find(m=>m.workspaceId===i.workspaceId)?.title??c.modeNames.switch}function ee(s){let i=M();if(i===null)return"no-session";let c=A(i),u=c?.state.getSnapshot().draft??"",p=r.state.inputActions;if(p!==null)for(let te=0;te<2;te+=1){let se=p.captureInsertion(),nn=H(u,se.start,s);if(p.insertText(nn,se))return c?.focus(),"ok"}if(c===null)return"failed";let m=c.state.getSnapshot(),v=H(m.draft,m.draft.length,s),S={start:m.draft.length,end:m.draft.length,draftRev:m.draftRev};return c.insertText(v,S)?(c.focus(),"ok"):m.draft===""?(c.setDraft(v),c.focus(),"ok"):"failed"}function je(s){let i=ee(s);if(i==="ok"){L();return}D(i==="no-session"?w().noticeNoSession:w().noticeInsertFailed,"error")}function Ve(s){let i=ee(`/${s} `);if(i==="ok"){L();return}D(i==="no-session"?w().noticeNoSession:w().noticeInsertFailed,"error")}async function ze(s){let i=M(),c=b.commands(),u=b.sessions();if(L(),!(i===null||c===void 0||u===void 0))try{let p=await u.using(i,{source:Y},async v=>(await v.ready,c.execute(i,`/${s}`)));if(!p.ok){W(w().noticeExecuteFailed(s,p.error.code),"error");return}let m=p.value;if(m===void 0)return;if(m.result.kind==="error"){W(w().noticeExecuteFailed(s,m.result.text),"error");return}W(w().noticeExecuted(s,m.result.text))}catch(p){W(w().noticeExecuteFailed(s,p instanceof Error?p.message:void 0),"error")}}function He(s){let i=b.uiWorkspace();if(i===void 0){D(w().failed,"error");return}try{i.openSession(s),L()}catch{D(w().failed,"error")}}function Ke(s){let i=o.getSnapshot();a=[],o.set({model:ue(i.model,s),status:"loading",rows:[],notice:null}),O(0)}function ne(s){switch(s.action.kind){case"insert-path":je(s.action.absolutePath);return;case"execute-command":s.action.needsInput?Ve(s.action.name):ze(s.action.name);return;case"open-mode":U(s.action.mode);return;case"drill":Ke(s.action.scope);return;case"open-session":He(s.action.sessionId);return;default:return}}function Ye(){let s=o.getSnapshot(),i=s.rows[s.model.highlight];i!==void 0&&ne(i)}function Qe(){let s=o.getSnapshot(),i=pe(s.model);if(i.kind==="close"){L();return}a=[],o.set({model:i.model,rows:[],status:"loading",notice:null}),O(0)}function Ge(s){let i=s.get("shortcuts");if(i===void 0)return()=>{};y.shortcuts=i;let c=()=>{y.shortcuts=void 0},u=[];for(let p of F){let m=T[p];u.push(i.register({id:m,label:()=>`${w().title}\uFF1A${w().modeNames[p]}`,aliases:p==="navigate"?["command panel","quick open","files","navigate"]:p==="command"?["command panel","palette","commands"]:["command panel","switch","workspaces","sessions"],defaults:p==="command"?Dn:{},regions:["page","editable"],modals:[z],resolve:()=>({status:"handled",run:()=>_e(p)})}))}return u.push(Ze(i)),()=>{c();for(let p of u)p()}}function Ze(s){let i=!1,c=()=>{i||s.config.getSnapshot().status==="ready"&&(i=!0,Xe(s))};return c(),s.config.subscribe(c)}async function Xe(s){let i=[{id:T.navigate,binding:{code:"KeyP",modifiers:["primary"]}},{id:T.switch,binding:{code:"KeyO",modifiers:["primary"]}}];for(let c of i){let u=new Map(s.catalog.getSnapshot().map(S=>[S.id,S])),p={current:S=>u.get(S)?.binding,describe:S=>s.describeBinding(S)},m=V(c,p,e.platform);if(m.kind==="blocked"&&c.id===T.switch&&e.config?.takeoverSwitch===!0){let S=s.describeBinding(c.binding).conflicts[0];S!==void 0&&(await s.edit({type:"set",id:S,binding:null},s.config.getSnapshot().revision),m=V(c,p,e.platform))}if(m.kind==="blocked"){console.info("[dsh-command-panel]",w().noticeClaimFailed(m.keys));continue}if(m.kind!=="claim")continue;(await s.edit({type:"set",id:m.id,binding:m.binding},s.config.getSnapshot().revision)).status!=="saved"&&console.info("[dsh-command-panel]",w().noticeClaimFailed(m.binding.code))}}function Je(s){let i=s.get("slots");if(i===void 0)return()=>{};let c=he({React:e.React,dom:e.dom,primitives:e.primitives,store:o,copy:w(),document:n,move:m=>{let v=o.getSnapshot();o.set({model:de(v.model,m,v.rows.length)})},highlight:m=>{let v=o.getSnapshot();o.set({model:ce(v.model,m,v.rows.length)})},setQuery:m=>{let v=o.getSnapshot();o.set({model:ae(v.model,m),notice:null,noticeTone:void 0}),Be(),O(90)},acceptActive:Ye,accept:ne,dismiss:L,back:Qe,switchMode:Ue,crumbLabel:qe}),u=re(e.React,m=>{let v=m.sessionId!==r.state.sessionId;r.state=m,v&&Ne(m.sessionId)}),p=[i.inject("shell.overlay",()=>i.register({name:"shell.overlay",id:"command-panel.palette",order:50},c)),i.inject("conversation.input.overlay",()=>i.register({name:"conversation.input.overlay",id:"command-panel.bridge",order:90},u))];return()=>{for(let m of p)m()}}function q(){let s=[],i=b.workspaces();if(i!==void 0){let u=i.list.getSnapshot();s.push(u.items.map(p=>`${p.workspaceId}:${p.title}:${p.sessionIds.length}`).join(",")),s.push(String(u.archivedSessionIds.length))}let c=b.sessions();if(c!==void 0){let u=c.list.getSnapshot(),p=0,m=0;for(let v of u.ids){let S=u.byId[v];S!==void 0&&(p+=S.updatedAt,m+=S.displayTitle.length)}s.push(`${u.ids.length}:${p}:${m}`)}return s.join("|")}function oe(){let s=o.getSnapshot();if(!s.open||s.model.mode!=="switch")return;let i=q();if(i!==R){if(R=i,k){$=!0;return}O(0)}}function en(s){let i=[],c=s.get("sessions"),u=s.get("workspaces");return c!==void 0&&i.push(c.list.subscribe(oe)),u!==void 0&&i.push(u.list.subscribe(oe)),()=>{for(let p of i)p()}}let E=[];return E.push(e.ctx.inject(["sessions","workspaces","conversation","uiWorkspace","locale"],s=>(y.sessions=s.get("sessions"),y.workspaces=s.get("workspaces"),y.conversation=s.get("conversation"),y.uiWorkspace=s.get("uiWorkspace"),y.locale=s.get("locale"),()=>{y.sessions=void 0,y.workspaces=void 0,y.conversation=void 0,y.uiWorkspace=void 0,y.locale=void 0}))),E.push(e.ctx.inject(["remote.fileReferences"],s=>(y.fileReferences=s.get("remote.fileReferences"),()=>{y.fileReferences=void 0}))),E.push(e.ctx.inject(["remote.commands"],s=>(y.commands=s.get("remote.commands"),()=>{y.commands=void 0}))),E.push(ye(n)),E.push(e.ctx.inject(["slots"],Je)),E.push(e.ctx.inject(["shortcuts"],Ge)),E.push(e.ctx.inject(["sessions","workspaces"],en)),{dispose(){if(!P){P=!0,f!==null&&clearTimeout(f),f=null,d?.abort(),d=null;for(let s of E.splice(0))s()}}}}var Z=null,Te="react",Ae="react-dom",Le="@deepseek-ai/dsh-client-ui-primitives";function De(e){let n=e.toLowerCase();return n.includes("mac")?"macos":n.includes("win")?"windows":"linux"}function X(e){if(Z===null)return null;let n=Z(e);return n??null}function Wn(){let e=X(Te);if(e===null)return null;for(let n of["createElement","useState","useEffect","useMemo","useRef","useSyncExternalStore"])if(typeof e[n]!="function")return null;return e}function On(){let e=X(Ae);return e!==null&&typeof e.createPortal=="function"?e:null}function Fn(){let e=X(Le);return e===null||typeof e.useModalLayer!="function"||typeof e.observeComposition!="function"?null:e}var We=["slots","shortcuts","sessions","workspaces","uiWorkspace","conversation","remote","remote.fileReferences","remote.commands","locale"],Oe={name:"dsh-command-panel",inject:We,apply(e,n){let o=Wn(),r=On(),t=Fn();if(o===null||r===null||t===null)return console.warn("[dsh-command-panel] missing platform modules; panel disabled"),()=>{};let l=Ee({ctx:e,React:o,dom:r,primitives:t,platform:De(globalThis.navigator?.platform??""),config:n});return()=>l.dispose()}};function Bn(e){Z=e}var Nn=Oe;

module.exports.boot(require);
    return module.exports.default ?? module.exports;
  }
});
