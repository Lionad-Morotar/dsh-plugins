window.__ModuleLoader__.load({
  id: "dsh-workspace-open-local",
  factory: (require) => {
    var module = { exports: {} };
    var exports = module.exports;
"use strict";var k=Object.defineProperty;var te=Object.getOwnPropertyDescriptor;var oe=Object.getOwnPropertyNames;var re=Object.prototype.hasOwnProperty;var le=(e,n)=>{for(var o in n)k(e,o,{get:n[o],enumerable:!0})},ie=(e,n,o,t)=>{if(n&&typeof n=="object"||typeof n=="function")for(let r of oe(n))!re.call(e,r)&&r!==o&&k(e,r,{get:()=>n[r],enumerable:!(t=te(n,r))||t.enumerable});return e};var ae=e=>ie(k({},"__esModule",{value:!0}),e);var Ne={};le(Ne,{PROBE_SLOT:()=>I,apply:()=>Q,clientPlugin:()=>X,default:()=>_e,inject:()=>G,mountRow:()=>Z});module.exports=ae(Ne);var J=require("react"),Y=require("react-dom/client");var se="open-in-app/apps",ce="open-in-app/open",pe="open-in-app/icon";function ue(e){return`${pe}/${encodeURIComponent(e)}`}var E="dsh.open-in-app.choice",h=class extends Error{kind;constructor(n,o){super(o),this.name="OpenInAppError",this.kind=n}};function x(e,n){return e===""?n:`${e.replace(/\/$/,"")}/${n}`}function S(e){let n=e?.fetchImpl??globalThis.fetch,o=e?.baseUrl??"";return{async listApplications(t){let r;try{r=await n(x(o,se),{headers:{accept:"application/json"},...t===void 0?{}:{signal:t}})}catch(a){throw new h("catalog",a instanceof Error?a.message:"catalog unreachable")}if(!r.ok)throw new h("catalog",`catalog failed: HTTP ${String(r.status)}`);let i;try{i=await r.json()}catch(a){throw new h("catalog",a instanceof Error?a.message:"catalog unreadable")}if(typeof i!="object"||i===null||!("apps"in i)||!Array.isArray(i.apps))throw new h("catalog","catalog is not an apps list");let l=new Set;for(let a of i.apps)typeof a=="string"&&a!==""&&l.add(a);return[...l]},async openDirectory(t,r){let i=JSON.stringify({app:t,path:r}),l;try{l=await n(x(o,ce),{method:"POST",headers:{"content-type":"application/json"},body:i})}catch(a){throw new h("launch",a instanceof Error?a.message:"launch unreachable")}if(!l.ok)throw new h("launch",`open failed: HTTP ${String(l.status)}`)},iconUrl(t){return x(o,ue(t))}}}function M(e,n){return e.length===0?null:n!==null&&e.includes(n)?n:e[0]??null}var de=/^[A-Za-z0-9][A-Za-z0-9._-]*$/,T=["value","choice","app"];function fe(e){let n=e.trim();if(n==="")return null;if(n.startsWith("{")||n.startsWith("[")||n.startsWith('"')||/^-?\d/.test(n)){let o;try{o=JSON.parse(n)}catch{return null}return he(o)}return de.test(n)?n:null}function he(e){if(typeof e=="string")return e===""?null:e;if(typeof e!="object"||e===null)return null;let n=e;for(let o of T)if(o in n){let t=n[o];return typeof t=="string"&&t!==""?t:null}return null}function W(e){if(e==null)return null;let n;try{n=e.getItem(E)}catch{return null}return n===null?null:fe(n)}function me(e,n){if(e==null||e.trim()==="")return JSON.stringify(n);let o=e.trim();if(o.startsWith("{"))try{let t=JSON.parse(o);if(typeof t=="object"&&t!==null){let r=t;for(let i of T)if(i in r&&typeof r[i]=="string")return JSON.stringify({...r,[i]:n})}}catch{}return JSON.stringify(n)}function C(e,n,o){if(e==null)return;let t=o;if(t===void 0)try{t=e.getItem(E)}catch{t=null}try{e.setItem(E,me(t,n))}catch{}}var H={catalog:"\u8BFB\u4E0D\u5230\u53EF\u7528\u5E94\u7528",launch:"\u6253\u5F00\u5931\u8D25"};function _(e){let n={phase:"loading",applications:[],defaultApplication:null,menuOpen:!1,error:null},o=!1,t=0,r=l=>{n=l,e.onChange(n)},i=l=>{if(o||n.phase==="launching"||l===null)return;let a=l;r({...n,phase:"launching",menuOpen:!1,error:null}),e.host.openDirectory(a,e.path).then(()=>{o||(C(e.storage,a),r({...n,phase:"idle",defaultApplication:a,menuOpen:!1,error:null}))},()=>{o||r({...n,phase:"error",menuOpen:!1,error:H.launch})})};return{get view(){return n},load(){let l=++t;r({phase:"loading",applications:[],defaultApplication:null,menuOpen:!1,error:null}),e.host.listApplications().then(a=>{o||l!==t||r({phase:"idle",applications:a,defaultApplication:M(a,e.remembered),menuOpen:!1,error:null})},()=>{o||l!==t||r({phase:"error",applications:[],defaultApplication:null,menuOpen:!1,error:H.catalog})})},open(){n.phase==="loading"||n.phase==="launching"||i(n.defaultApplication)},toggleMenu(l){n.phase==="loading"||n.phase==="launching"||r({...n,menuOpen:l})},pick(l){i(l)},dismissMenu(){n.menuOpen&&r({...n,menuOpen:!1})},dispose(){o=!0,t+=1}}}var w=require("react");function ge(e,n){if(e.length!==n.length)return!1;let o=new Map(e.map(t=>[t.workspaceId,t.path]));return n.every(t=>o.get(t.workspaceId)===t.path)}function b(){let e=[],n=!1,o=new Set;return{resolve(t){return e.find(r=>r.workspaceId===t)?.path??null},publish(t){if(!(n&&ge(e,t))){e=t,n=!0;for(let r of o)r()}},subscribe(t){return o.add(t),()=>{o.delete(t)}},get ready(){return n}}}function ye(e){if(typeof e!="object"||e===null||!("items"in e))return null;let{items:n}=e;return Array.isArray(n)?n:null}function we(e){let n=[];for(let o of e){if(typeof o!="object"||o===null||!("workspaceId"in o)||!("path"in o))continue;let{workspaceId:t,path:r}=o;typeof t!="string"||typeof r!="string"||n.push({workspaceId:t,path:r})}return n}function N(e){function n(o){let t=o.useWorkspaces(r=>r);return(0,w.useEffect)(()=>{let r=ye(t);r!==null&&e.publish(we(r))},[t]),null}return function(t){return t.useWorkspaces===void 0?null:(0,w.createElement)(n,{useWorkspaces:t.useWorkspaces})}}var j="data-dsh-workspace-open-local",be=new Set(["\u91CD\u547D\u540D","\u5220\u9664\u5DE5\u4F5C\u533A","Rename","Delete workspace"]),L=2;function ve(e){let n=e.getAttribute("data-row-key");return n===null||!n.startsWith("workspace:")?null:n.slice(10)}function P(e){return e.closest("[data-row-key]")!==null}function ke(e){if(!(e instanceof Element))return null;let n=e.closest("button");if(!(n instanceof HTMLButtonElement)||n.type!=="button")return null;let o=n.closest("[data-row-key^='workspace:']");return o instanceof HTMLElement?{row:o,button:n}:null}function xe(e,n){let o=e.querySelectorAll("button");return o.length>0&&o[0]===n}function Ee(e){return(e.textContent??"").trim()}function Le(e,n){let o=n[0]?.parentElement??null;for(;o!==null&&e.contains(o);){if(n.filter(r=>o?.contains(r)).length>=L)return o;if(o===e)return null;o=o.parentElement}return null}function D(e){if(P(e))return null;let n=[...e.querySelectorAll("[role='menuitem']")].filter(t=>!P(t));return n.length<L||n.filter(t=>be.has(Ee(t))).length<L?null:Le(e,n)}function Pe(e){return e.querySelector(`[${j}]`)!==null}function U(e){let n=e.document??document,o=e.store??b(),t=n.body??n.documentElement,r=null,i=null,l=null,a=!1,p=()=>{if(l===null)return;let u=l;l=null,u.container.remove(),v.takeRecords(),u.cleanup?.()},d=()=>{if(a||l!==null||r===null)return;let u=Oe(t);if(u===null)return;let f=D(u);if(f===null||Pe(u))return;let g=r,R=o.resolve(g);if(R===null){e.onUnresolved?.(g);return}let y=n.createElement("div");y.setAttribute(j,""),y.setAttribute("role","none"),f.append(y);let ne={workspaceId:g,path:R,host:f,container:y,trigger:i};l={menu:u,container:y,cleanup:e.onOpen(ne)}},s=u=>{let f=ke(u.target);if(f!==null){let g=ve(f.row);g!==null&&xe(f.row,f.button)&&(r=g,i=f.button);return}l!==null&&u.target instanceof Node&&!l.menu.contains(u.target)&&p()},m=u=>{u.key==="Escape"&&p()},v=new MutationObserver(()=>{l!==null&&!l.menu.isConnected&&p(),d()});n.addEventListener("pointerdown",s,!0),n.addEventListener("click",s,!0),n.addEventListener("keydown",m,!0),v.observe(t,{childList:!0,subtree:!0});let ee=o.subscribe(()=>{d()});return()=>{a||(a=!0,n.removeEventListener("pointerdown",s,!0),n.removeEventListener("click",s,!0),n.removeEventListener("keydown",m,!0),v.disconnect(),ee(),p())}}function Oe(e){let n=e.ownerDocument.body,o=new Set([...n===null?[]:n.children,...e.querySelectorAll("[role='menu']")]);for(let t of o)if(!(!(t instanceof HTMLElement)||P(t))&&D(t)!==null)return t;return null}var V=["pointerover","pointerenter","pointermove"],B=["pointerdown","pointerup","click","contextmenu"];function Ae(e,n=!1){if(e===null||n)return!1;let t=e.ownerDocument.defaultView?.PointerEvent,r={bubbles:!0,relatedTarget:null},i=t===void 0?new MouseEvent("pointerover",r):new t("pointerover",r);return e.dispatchEvent(i),!0}function z(e){let{container:n,trigger:o}=e,t=null,r=()=>{t!==null&&(clearInterval(t),t=null)},i=()=>{Ae(o,o?.isConnected!==!0)},l=()=>{i(),!(t!==null||o===null)&&(t=setInterval(i,100))},a=()=>{l()},p=()=>{r(),i()},d=s=>{s.stopPropagation()};for(let s of V)n.addEventListener(s,a,!0);n.addEventListener("pointerleave",p,!0);for(let s of B)n.addEventListener(s,d,!1);return()=>{r();for(let s of V)n.removeEventListener(s,a,!0);n.removeEventListener("pointerleave",p,!0);for(let s of B)n.removeEventListener(s,d,!1)}}var c=require("react"),Ie={open:"\u5728\u672C\u5730\u6253\u5F00",openTooltip:"\u7528 <app> \u6253\u5F00 <path>",choose:"\u9009\u62E9\u5E94\u7528",chooseTooltip:"\u9009\u62E9\u7528\u6765\u6253\u5F00\u7684\u5E94\u7528",defaultMark:"\uFF08\u9ED8\u8BA4\uFF09",loading:"\u8BFB\u53D6\u5E94\u7528\u2026"};function Re(e,n){return e.find(o=>o.id===n)??e[0]}function Se(){return(0,c.createElement)("svg",{className:"olr-open-icon",width:12,height:12,viewBox:"0 0 12 12",fill:"none","aria-hidden":!0},(0,c.createElement)("path",{d:"M4 2.5H2.5v7h7V8M6.5 2.5H9.5V5.5M9.3 2.7 5.5 6.5",stroke:"currentColor",strokeWidth:1,strokeLinecap:"round",strokeLinejoin:"round"}))}function Me(){return(0,c.createElement)("svg",{width:12,height:12,viewBox:"0 0 12 12",fill:"none","aria-hidden":!0},(0,c.createElement)("path",{d:"M3 4.75 6 7.75 9 4.75",stroke:"currentColor",strokeWidth:1.2,strokeLinecap:"round",strokeLinejoin:"round"}))}var O=4,K=196,A=8;function Te(e){if(e===null)return null;let n=e.ownerDocument.defaultView;if(n===null)return null;let o=e.getBoundingClientRect(),t=o.right+O,r=t+K+A<=n.innerWidth?t:Math.max(A,o.left-O-K);return{position:"fixed",top:Math.max(A,o.top-O),left:r}}function $(e){let n=e.applications,o=(0,c.useRef)(null),t=e.menuOpen===!0,[r,i]=(0,c.useState)(null);if((0,c.useLayoutEffect)(()=>{if(!t){i(null);return}i(Te(o.current))},[t]),n.length===0)return null;let l={...Ie,...e.labels},a=Re(n,e.defaultApplication);if(a===void 0)return null;let p=e.phase==="launching",d=t?(0,c.createElement)("div",{"data-testid":"open-local-menu",className:"olr-menu",role:"menu","aria-label":l.choose,style:r??void 0,onKeyDown:s=>{s.key==="Escape"&&e.onDismissMenu?.()}},n.map(s=>{let m=s.id===a.id;return(0,c.createElement)("button",{key:s.id,type:"button",className:"olr-app",role:"menuitemradio","data-testid":"open-local-app","data-app-id":s.id,"data-default":m?"true":void 0,"aria-checked":m,onClick:()=>e.onPickApplication?.(s.id)},(0,c.createElement)("img",{className:"olr-app-icon",src:s.iconUrl,alt:"",width:14,height:14,draggable:!1}),(0,c.createElement)("span",{className:"olr-app-label"},s.label),m?(0,c.createElement)("span",{className:"olr-app-default"},l.defaultMark):null)})):null;return(0,c.createElement)("div",{className:"olr","data-open-local-path":e.path,"data-phase":p?"launching":"idle"},(0,c.createElement)("div",{className:"olr-row",ref:o,"data-open-local-row":""},(0,c.createElement)("button",{type:"button",className:"olr-main","data-testid":"open-local-main",disabled:p,"aria-busy":p||void 0,title:l.openTooltip.replace("<app>",a.label).replace("<path>",e.path),onClick:()=>e.onOpen?.()},(0,c.createElement)("span",{className:"olr-icon"},(0,c.createElement)(Se)),(0,c.createElement)("span",{className:"olr-label"},l.open)),(0,c.createElement)("button",{type:"button",className:"olr-choose","data-testid":"open-local-choose",disabled:p,"aria-busy":p||void 0,"aria-haspopup":"menu","aria-expanded":t,"aria-label":l.choose,title:l.chooseTooltip,onClick:()=>e.onToggleMenu?.(!t)},(0,c.createElement)(Me))),e.error?(0,c.createElement)("span",{className:"olr-error",role:"alert"},e.error):null,d)}var F="dsh-workspace-open-local",We=`
.olr {
  position: relative;
}

/* One menu line: the box the host gives its own item, so the hover band and the
   icon/text alignment continue the rows above and below instead of interrupting them. */
.olr-row {
  box-sizing: border-box;
  display: flex;
  align-items: center;
  gap: 6px;
  width: 100%;
  min-height: 34px;
  padding: 6px 8px;
  border-radius: var(--dsw-radius-md, 6px);
  color: var(--dsw-alias-label-primary, inherit);
  font-family: var(--dsw-font-family, inherit);
  font-size: 13px;
  line-height: 20px;
  text-align: start;
}

.olr-row:hover {
  background: var(--dsw-alias-interactive-bg-hover, rgba(128, 128, 128, 0.12));
}

.olr[data-phase="launching"] .olr-row {
  cursor: progress;
}

/* The label half. Transparent on purpose: the row owns the hover band. */
.olr-main {
  display: inline-flex;
  flex: 1;
  align-items: center;
  gap: 6px;
  min-width: 0;
  min-height: 22px;
  margin: 0;
  padding: 0;
  border: 0;
  background: transparent;
  color: inherit;
  font: inherit;
  text-align: start;
  cursor: pointer;
}

.olr-main:disabled,
.olr-choose:disabled {
  cursor: default;
  opacity: 0.4;
}

/* The host's icon slot: a 14px box in the menu-icon colour; the glyph inherits both. */
.olr-icon {
  display: inline-flex;
  flex: none;
  align-items: center;
  justify-content: center;
  width: 14px;
  height: 14px;
  color: var(--dsw-alias-menu-icon, currentColor);
}

.olr-icon svg {
  width: 14px;
  height: 14px;
}

.olr-label {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* The chevron half: an icon button inside the row, not a second bordered cell. */
.olr-choose {
  display: inline-flex;
  flex: none;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  margin: 0;
  padding: 0;
  border: 0;
  border-radius: var(--dsw-radius-sm, 4px);
  background: transparent;
  color: var(--dsw-alias-menu-icon, currentColor);
  cursor: pointer;
}

.olr-choose:hover:not(:disabled),
.olr-choose:focus-visible {
  background: var(--dsw-alias-interactive-bg-hover, rgba(128, 128, 128, 0.12));
  color: var(--dsw-alias-label-primary, inherit);
  outline: none;
}

.olr-choose[aria-expanded="true"] {
  color: var(--dsw-alias-label-primary, inherit);
}

.olr-error {
  display: block;
  padding: 0 8px 4px;
  color: var(--dsw-alias-state-error, #c44747);
  font-size: 11px;
  line-height: 16px;
}

/* The application list. Fixed positioned: the row lives inside the host menu's
   scrolling viewport, which would clip an absolutely positioned child. The
   coordinates are measured from the row's own rect by the component. */
.olr-menu {
  box-sizing: border-box;
  z-index: 120;
  min-width: 156px;
  max-height: 260px;
  margin: 0;
  padding: 4px;
  overflow: auto;
  list-style: none;
  border-radius: var(--dsw-radius-lg, 8px);
  background: var(--dsw-specific-menu, var(--dsw-alias-bg-layer-2, #2a2a2e));
  box-shadow: var(--dsw-elevation-prominent, 0 8px 24px rgba(0, 0, 0, 0.24));
  color: var(--dsw-alias-label-primary, inherit);
  font-family: var(--dsw-font-family, inherit);
}

.olr-app {
  box-sizing: border-box;
  display: flex;
  align-items: center;
  gap: 6px;
  width: 100%;
  min-height: 30px;
  margin: 0;
  padding: 4px 8px;
  border: 0;
  border-radius: var(--dsw-radius-sm, 4px);
  background: transparent;
  color: inherit;
  font: inherit;
  font-size: 13px;
  line-height: 20px;
  text-align: start;
  cursor: pointer;
}

.olr-app:hover,
.olr-app:focus-visible {
  background: var(--dsw-alias-interactive-bg-hover, rgba(128, 128, 128, 0.12));
  outline: none;
}

.olr-app-icon {
  flex: none;
  width: 14px;
  height: 14px;
  object-fit: contain;
}

.olr-app-label {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.olr-app-default {
  flex: none;
  color: var(--dsw-alias-label-tertiary, inherit);
  font-size: 11px;
}
`;function q(e){if(e.querySelector(`style[data-plugin="${F}"]`)!==null)return()=>{};let o=e.createElement("style");return o.dataset.plugin=F,o.textContent=We,e.head.appendChild(o),()=>{o.remove()}}var G=["slots"],I="shell.overlay",Ce=900;function He(){try{return globalThis.localStorage}catch{return null}}function Z(e,n,o){let t=(0,Y.createRoot)(e.container),r=p=>{let d=p.applications.map(s=>({id:s,label:s,iconUrl:n.iconUrl(s)}));t.render((0,J.createElement)($,{path:e.path,applications:d,defaultApplication:p.defaultApplication,menuOpen:p.menuOpen,phase:p.phase==="launching"?"launching":"idle",error:p.error,onOpen:()=>i.open(),onToggleMenu:s=>i.toggleMenu(s),onPickApplication:s=>i.pick(s),onDismissMenu:()=>i.dismissMenu()}))},i=_({host:n,storage:o,path:e.path,remembered:W(o),onChange:r});i.load();let l=z({container:e.container,trigger:e.trigger}),a={reactRoot:t,release:()=>i.dispose()};return()=>{a.release(),l(),t.unmount()}}function Q(e){let n=b(),o=S();e.effect(()=>q(document),"dsh-workspace-open-local: stylesheet"),e.effect(()=>(e.slots.inject(I,()=>e.slots.register({name:I,id:"workspace-open-local-probe",order:Ce,inject:()=>({})},N(n))),()=>{}),"dsh-workspace-open-local: workspace path probe"),e.effect(()=>U({store:n,onOpen:t=>Z(t,o,He())}),"dsh-workspace-open-local: menu anchor")}var X={name:"dsh-workspace-open-local",inject:G,apply:Q},_e=X;

    return module.exports.default ?? module.exports;
  }
});
