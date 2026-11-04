window.__ModuleLoader__.load({
  id: "dsh-workspace-open-local",
  factory: (require) => {
    var module = { exports: {} };
    var exports = module.exports;
"use strict";var b=Object.defineProperty;var Y=Object.getOwnPropertyDescriptor;var Z=Object.getOwnPropertyNames;var G=Object.prototype.hasOwnProperty;var Q=(e,n)=>{for(var t in n)b(e,t,{get:n[t],enumerable:!0})},X=(e,n,t,o)=>{if(n&&typeof n=="object"||typeof n=="function")for(let r of Z(n))!G.call(e,r)&&r!==t&&b(e,r,{get:()=>n[r],enumerable:!(o=Y(n,r))||o.enumerable});return e};var ee=e=>X(b({},"__esModule",{value:!0}),e);var Re={};Q(Re,{PROBE_SLOT:()=>E,apply:()=>F,clientPlugin:()=>q,default:()=>Ae,inject:()=>V,mountRow:()=>z});module.exports=ee(Re);var B=require("react"),$=require("react-dom/client");var ne="open-in-app/apps",te="open-in-app/open",oe="open-in-app/icon";function re(e){return`${oe}/${encodeURIComponent(e)}`}var v="dsh.open-in-app.choice",f=class extends Error{kind;constructor(n,t){super(t),this.name="OpenInAppError",this.kind=n}};function w(e,n){return e===""?n:`${e.replace(/\/$/,"")}/${n}`}function A(e){let n=e?.fetchImpl??globalThis.fetch,t=e?.baseUrl??"";return{async listApplications(o){let r;try{r=await n(w(t,ne),{headers:{accept:"application/json"},...o===void 0?{}:{signal:o}})}catch(l){throw new f("catalog",l instanceof Error?l.message:"catalog unreachable")}if(!r.ok)throw new f("catalog",`catalog failed: HTTP ${String(r.status)}`);let a;try{a=await r.json()}catch(l){throw new f("catalog",l instanceof Error?l.message:"catalog unreadable")}if(typeof a!="object"||a===null||!("apps"in a)||!Array.isArray(a.apps))throw new f("catalog","catalog is not an apps list");let i=new Set;for(let l of a.apps)typeof l=="string"&&l!==""&&i.add(l);return[...i]},async openDirectory(o,r){let a=JSON.stringify({app:o,path:r}),i;try{i=await n(w(t,te),{method:"POST",headers:{"content-type":"application/json"},body:a})}catch(l){throw new f("launch",l instanceof Error?l.message:"launch unreachable")}if(!i.ok)throw new f("launch",`open failed: HTTP ${String(i.status)}`)},iconUrl(o){return w(t,re(o))}}}function R(e,n){return e.length===0?null:n!==null&&e.includes(n)?n:e[0]??null}var le=/^[A-Za-z0-9][A-Za-z0-9._-]*$/,I=["value","choice","app"];function ae(e){let n=e.trim();if(n==="")return null;if(n.startsWith("{")||n.startsWith("[")||n.startsWith('"')||/^-?\d/.test(n)){let t;try{t=JSON.parse(n)}catch{return null}return ie(t)}return le.test(n)?n:null}function ie(e){if(typeof e=="string")return e===""?null:e;if(typeof e!="object"||e===null)return null;let n=e;for(let t of I)if(t in n){let o=n[t];return typeof o=="string"&&o!==""?o:null}return null}function S(e){if(e==null)return null;let n;try{n=e.getItem(v)}catch{return null}return n===null?null:ae(n)}function se(e,n){if(e==null||e.trim()==="")return JSON.stringify(n);let t=e.trim();if(t.startsWith("{"))try{let o=JSON.parse(t);if(typeof o=="object"&&o!==null){let r=o;for(let a of I)if(a in r&&typeof r[a]=="string")return JSON.stringify({...r,[a]:n})}}catch{}return JSON.stringify(n)}function M(e,n,t){if(e==null)return;let o=t;if(o===void 0)try{o=e.getItem(v)}catch{o=null}try{e.setItem(v,se(o,n))}catch{}}var W={catalog:"\u8BFB\u4E0D\u5230\u53EF\u7528\u5E94\u7528",launch:"\u6253\u5F00\u5931\u8D25"};function T(e){let n={phase:"loading",applications:[],defaultApplication:null,menuOpen:!1,error:null},t=!1,o=0,r=i=>{n=i,e.onChange(n)},a=i=>{if(t||n.phase==="launching"||i===null)return;let l=i;r({...n,phase:"launching",menuOpen:!1,error:null}),e.host.openDirectory(l,e.path).then(()=>{t||(M(e.storage,l),r({...n,phase:"idle",defaultApplication:l,menuOpen:!1,error:null}))},()=>{t||r({...n,phase:"error",menuOpen:!1,error:W.launch})})};return{get view(){return n},load(){let i=++o;r({phase:"loading",applications:[],defaultApplication:null,menuOpen:!1,error:null}),e.host.listApplications().then(l=>{t||i!==o||r({phase:"idle",applications:l,defaultApplication:R(l,e.remembered),menuOpen:!1,error:null})},()=>{t||i!==o||r({phase:"error",applications:[],defaultApplication:null,menuOpen:!1,error:W.catalog})})},open(){n.phase==="loading"||n.phase==="launching"||a(n.defaultApplication)},toggleMenu(i){n.phase==="loading"||n.phase==="launching"||r({...n,menuOpen:i})},pick(i){a(i)},dismissMenu(){n.menuOpen&&r({...n,menuOpen:!1})},dispose(){t=!0,o+=1}}}var m=require("react");function ce(e,n){if(e.length!==n.length)return!1;let t=new Map(e.map(o=>[o.workspaceId,o.path]));return n.every(o=>t.get(o.workspaceId)===o.path)}function y(){let e=[],n=!1,t=new Set;return{resolve(o){return e.find(r=>r.workspaceId===o)?.path??null},publish(o){if(!(n&&ce(e,o))){e=o,n=!0;for(let r of t)r()}},subscribe(o){return t.add(o),()=>{t.delete(o)}},get ready(){return n}}}function pe(e){if(typeof e!="object"||e===null||!("items"in e))return null;let{items:n}=e;return Array.isArray(n)?n:null}function ue(e){let n=[];for(let t of e){if(typeof t!="object"||t===null||!("workspaceId"in t)||!("path"in t))continue;let{workspaceId:o,path:r}=t;typeof o!="string"||typeof r!="string"||n.push({workspaceId:o,path:r})}return n}function _(e){function n(t){let o=t.useWorkspaces(r=>r);return(0,m.useEffect)(()=>{let r=pe(o);r!==null&&e.publish(ue(r))},[o]),null}return function(o){return o.useWorkspaces===void 0?null:(0,m.createElement)(n,{useWorkspaces:o.useWorkspaces})}}var H="data-dsh-workspace-open-local",de=new Set(["\u91CD\u547D\u540D","\u5220\u9664\u5DE5\u4F5C\u533A","Rename","Delete workspace"]),x=2;function fe(e){let n=e.getAttribute("data-row-key");return n===null||!n.startsWith("workspace:")?null:n.slice(10)}function O(e){return e.closest("[data-row-key]")!==null}function he(e){if(!(e instanceof Element))return null;let n=e.closest("button");if(!(n instanceof HTMLButtonElement)||n.type!=="button")return null;let t=n.closest("[data-row-key^='workspace:']");return t instanceof HTMLElement?{row:t,button:n}:null}function ge(e,n){let t=e.querySelectorAll("button");return t.length>0&&t[0]===n}function me(e){return(e.textContent??"").trim()}function ye(e,n){let t=n[0]?.parentElement??null;for(;t!==null&&e.contains(t);){if(n.filter(r=>t?.contains(r)).length>=x)return t;if(t===e)return null;t=t.parentElement}return null}function C(e){if(O(e))return null;let n=[...e.querySelectorAll("[role='menuitem']")].filter(o=>!O(o));return n.length<x||n.filter(o=>de.has(me(o))).length<x?null:ye(e,n)}function ke(e){return e.querySelector(`[${H}]`)!==null}function N(e){let n=e.document??document,t=e.store??y(),o=n.body??n.documentElement,r=null,a=null,i=!1,l=()=>{if(a===null)return;let c=a;a=null,c.container.remove(),k.takeRecords(),c.cleanup?.()},u=()=>{if(i||a!==null||r===null)return;let c=be(o);if(c===null)return;let d=C(c);if(d===null||ke(c))return;let h=r,P=t.resolve(h);if(P===null){e.onUnresolved?.(h);return}let g=n.createElement("div");g.setAttribute(H,""),g.setAttribute("role","none"),d.append(g);let J={workspaceId:h,path:P,host:d,container:g};a={menu:c,container:g,cleanup:e.onOpen(J)}},p=c=>{let d=he(c.target);if(d!==null){let h=fe(d.row);h!==null&&ge(d.row,d.button)&&(r=h);return}a!==null&&c.target instanceof Node&&!a.menu.contains(c.target)&&l()},L=c=>{c.key==="Escape"&&l()},k=new MutationObserver(()=>{a!==null&&!a.menu.isConnected&&l(),u()});n.addEventListener("pointerdown",p,!0),n.addEventListener("click",p,!0),n.addEventListener("keydown",L,!0),k.observe(o,{childList:!0,subtree:!0});let K=t.subscribe(()=>{u()});return()=>{i||(i=!0,n.removeEventListener("pointerdown",p,!0),n.removeEventListener("click",p,!0),n.removeEventListener("keydown",L,!0),k.disconnect(),K(),l())}}function be(e){let n=e.ownerDocument.body,t=new Set([...n===null?[]:n.children,...e.querySelectorAll("[role='menu']")]);for(let o of t)if(!(!(o instanceof HTMLElement)||O(o))&&C(o)!==null)return o;return null}var s=require("react"),we={open:"\u5728\u672C\u5730\u6253\u5F00",openTooltip:"\u7528 <app> \u6253\u5F00 <path>",choose:"\u9009\u62E9\u5E94\u7528",chooseTooltip:"\u9009\u62E9\u7528\u6765\u6253\u5F00\u7684\u5E94\u7528",defaultMark:"\uFF08\u9ED8\u8BA4\uFF09",loading:"\u8BFB\u53D6\u5E94\u7528\u2026"};function ve(e,n){return e.find(t=>t.id===n)??e[0]}function xe(){return(0,s.createElement)("svg",{className:"olr-open-icon",width:12,height:12,viewBox:"0 0 12 12",fill:"none","aria-hidden":!0},(0,s.createElement)("path",{d:"M4 2.5H2.5v7h7V8M6.5 2.5H9.5V5.5M9.3 2.7 5.5 6.5",stroke:"currentColor",strokeWidth:1,strokeLinecap:"round",strokeLinejoin:"round"}))}function Oe(){return(0,s.createElement)("svg",{width:10,height:10,viewBox:"0 0 10 10",fill:"none","aria-hidden":!0},(0,s.createElement)("path",{d:"M2.5 4 5 6.5 7.5 4",stroke:"currentColor",strokeWidth:1,strokeLinecap:"round",strokeLinejoin:"round"}))}function j(e){let n=e.applications;if(n.length===0)return null;let t={...we,...e.labels},o=ve(n,e.defaultApplication);if(o===void 0)return null;let r=e.phase==="launching",a=e.menuOpen===!0,i=a?(0,s.createElement)("div",{"data-testid":"open-local-menu",className:"olr-menu",role:"menu","aria-label":t.choose,onKeyDown:l=>{l.key==="Escape"&&e.onDismissMenu?.()}},n.map(l=>{let u=l.id===o.id;return(0,s.createElement)("button",{key:l.id,type:"button",className:"olr-app",role:"menuitemradio","data-testid":"open-local-app","data-app-id":l.id,"data-default":u?"true":void 0,"aria-checked":u,onClick:()=>e.onPickApplication?.(l.id)},(0,s.createElement)("img",{className:"olr-app-icon",src:l.iconUrl,alt:"",width:16,height:16,draggable:!1}),(0,s.createElement)("span",{className:"olr-app-label"},l.label),u?(0,s.createElement)("span",{className:"olr-app-default"},t.defaultMark):null)})):null;return(0,s.createElement)("div",{className:"olr","data-open-local-path":e.path},(0,s.createElement)("div",{className:"olr-split","data-phase":r?"launching":"idle"},(0,s.createElement)("button",{type:"button",className:"olr-main","data-testid":"open-local-main",disabled:r,"aria-busy":r||void 0,title:t.openTooltip.replace("<app>",o.label).replace("<path>",e.path),onClick:()=>e.onOpen?.()},(0,s.createElement)(xe),t.open),(0,s.createElement)("button",{type:"button",className:"olr-choose","data-testid":"open-local-choose",disabled:r,"aria-busy":r||void 0,"aria-haspopup":"menu","aria-expanded":a,"aria-label":t.choose,title:t.chooseTooltip,onClick:()=>e.onToggleMenu?.(!a)},(0,s.createElement)(Oe))),e.error?(0,s.createElement)("span",{className:"olr-error",role:"alert"},e.error):null,i)}var Ee=`
.olr-split {
  box-sizing: border-box;
  display: inline-flex;
  align-items: stretch;
  height: 24px;
  border: 1px solid var(--dsw-alias-border-l4, rgba(128, 128, 128, 0.32));
  border-radius: 9px;
  overflow: hidden;
  font-family: var(--dsw-font-family, inherit);
  color: var(--dsw-alias-label-primary, inherit);
}
.olr-main,
.olr-choose {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin: 0;
  border: 0;
  background: transparent;
  color: inherit;
  font: inherit;
  font-size: 11px;
  line-height: 16px;
  white-space: nowrap;
  cursor: pointer;
}
.olr-main { gap: 4px; padding: 3px 8px; }
.olr-choose {
  border-left: 1px solid var(--dsw-alias-border-l4, rgba(128, 128, 128, 0.32));
  padding: 3px 5px;
  color: var(--dsw-alias-label-secondary, inherit);
}
.olr-main:hover:not(:disabled),
.olr-main:focus-visible,
.olr-choose:hover:not(:disabled),
.olr-choose:focus-visible {
  background: var(--dsw-alias-interactive-bg-hover, rgba(128, 128, 128, 0.12));
}
.olr-main:disabled,
.olr-choose:disabled { cursor: default; }
.olr-open-icon { flex: none; }
.olr-error {
  color: var(--dsw-alias-state-error, #c44747);
  font-size: 11px;
  line-height: 16px;
}
.olr-menu {
  box-sizing: border-box;
  min-width: 180px;
  max-height: 240px;
  margin: 4px 0 0;
  padding: 4px;
  overflow: auto;
  list-style: none;
  border-radius: var(--dsw-radius-xs, 6px);
  background: var(--dsw-specific-menu, var(--dsw-alias-bg-layer-2, #2a2a2e));
  box-shadow: var(--dsw-elevation-prominent, 0 8px 24px rgba(0, 0, 0, 0.24));
  color: var(--dsw-alias-label-primary, inherit);
}
.olr-app {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  margin: 0;
  padding: 4px 8px;
  border: 0;
  border-radius: var(--dsw-radius-xs, 6px);
  background: transparent;
  color: inherit;
  font: inherit;
  font-size: 12px;
  line-height: 16px;
  text-align: start;
  cursor: pointer;
}
.olr-app:hover,
.olr-app:focus-visible {
  background: var(--dsw-alias-interactive-bg-hover, rgba(128, 128, 128, 0.12));
}
.olr-app-icon { width: 16px; height: 16px; flex: none; object-fit: contain; }
.olr-app-label { flex: auto; overflow: hidden; text-overflow: ellipsis; }
.olr-app-default {
  flex: none;
  color: var(--dsw-alias-label-tertiary, inherit);
  font-size: 11px;
}
`,U="dsh-workspace-open-local";function D(e){if(e.querySelector(`style[data-plugin="${U}"]`)!==null)return()=>{};let t=e.createElement("style");return t.dataset.plugin=U,t.textContent=Ee,e.head.appendChild(t),()=>{t.remove()}}var V=["slots"],E="shell.overlay",Le=900;function Pe(){try{return globalThis.localStorage}catch{return null}}function z(e,n,t){let o=(0,$.createRoot)(e.container),r=l=>{let u=l.applications.map(p=>({id:p,label:p,iconUrl:n.iconUrl(p)}));o.render((0,B.createElement)(j,{path:e.path,applications:u,defaultApplication:l.defaultApplication,menuOpen:l.menuOpen,phase:l.phase==="launching"?"launching":"idle",error:l.error,onOpen:()=>a.open(),onToggleMenu:p=>a.toggleMenu(p),onPickApplication:p=>a.pick(p),onDismissMenu:()=>a.dismissMenu()}))},a=T({host:n,storage:t,path:e.path,remembered:S(t),onChange:r});a.load();let i={reactRoot:o,release:()=>a.dispose()};return()=>{i.release(),o.unmount()}}function F(e){let n=y(),t=A();e.effect(()=>D(document),"dsh-workspace-open-local: stylesheet"),e.effect(()=>(e.slots.inject(E,()=>e.slots.register({name:E,id:"workspace-open-local-probe",order:Le,inject:()=>({})},_(n))),()=>{}),"dsh-workspace-open-local: workspace path probe"),e.effect(()=>N({store:n,onOpen:o=>z(o,t,Pe())}),"dsh-workspace-open-local: menu anchor")}var q={name:"dsh-workspace-open-local",inject:V,apply:F},Ae=q;

    return module.exports.default ?? module.exports;
  }
});
