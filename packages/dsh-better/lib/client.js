window.__ModuleLoader__.load({
  id: "dsh-better",
  factory: (require) => {
    var module = { exports: {} };
    var exports = module.exports;
"use strict";var me=Object.defineProperty;var Ft=Object.getOwnPropertyDescriptor;var Bt=Object.getOwnPropertyNames;var Wt=Object.prototype.hasOwnProperty;var Ht=(e,n)=>{for(var t in n)me(e,t,{get:n[t],enumerable:!0})},Ut=(e,n,t,r)=>{if(n&&typeof n=="object"||typeof n=="function")for(let o of Bt(n))!Wt.call(e,o)&&o!==t&&me(e,o,{get:()=>n[o],enumerable:!(r=Ft(n,o))||r.enumerable});return e};var $t=e=>Ut(me({},"__esModule",{value:!0}),e);var ri={};Ht(ri,{boot:()=>ni,clientPlugin:()=>Mt,default:()=>ti,findShadowed:()=>Nt,findShadowedSingle:()=>Fe,readSkillUsage:()=>_t});module.exports=$t(ri);var re=require("react");var Be="dsh-better.skill-aliases";var K=Object.freeze({prefix:!0,rows:Object.freeze([])});function jt(e,n){if(e!==void 0)try{e.setItem(Be,JSON.stringify({v:1,prefix:n.prefix,rows:n.rows}))}catch{}}function te(e,n){return typeof e=="string"?e:n}function zt(e,n){if(typeof e!="object"||e===null||Array.isArray(e))return;let t=e;if(!(typeof t.keyword!="string"&&typeof t.target!="string"&&typeof t.params!="string"))return{id:te(t.id,`alias-${n}`)||`alias-${n}`,keyword:te(t.keyword,""),target:te(t.target,""),params:te(t.params,"")}}function qt(e){if(typeof e!="object"||e===null||Array.isArray(e))return K;let n=e,t=typeof n.prefix=="boolean"?n.prefix:K.prefix,r=Array.isArray(n.rows)?n.rows:[],o=[],i=new Set;for(let[s,l]of r.slice(0,200).entries()){let c=zt(l,s);if(c===void 0)continue;let d=c.id,a=0;for(;i.has(d);)a+=1,d=`alias-${s}-${a}`;i.add(d),o.push({...c,id:d})}return{prefix:t,rows:o}}function Vt(e){if(e===void 0)return K;let n;try{n=e.getItem(Be)}catch{return K}if(n===null||n==="")return K;try{return qt(JSON.parse(n))}catch{return K}}function Gt(){let e=globalThis.crypto;return e?.randomUUID!==void 0?e.randomUUID():`alias-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,8)}`}function We(e,n=Gt){let t=Vt(e),r=new Set,o=i=>{t=i;for(let s of[...r])try{s()}catch(l){console.error("[dsh-better] alias store listener failed:",l)}jt(e,i)};return{getSnapshot:()=>t,subscribe(i){return r.add(i),()=>{r.delete(i)}},setPrefix(i){t.prefix!==i&&o({...t,prefix:i})},addRow(){let i=n();return o({...t,rows:[...t.rows,{id:i,keyword:"",target:"",params:""}]}),i},updateRow(i,s){let l=!1,c=t.rows.map(d=>{if(d.id!==i)return d;let a={...d,...s,id:d.id};return l=a.keyword!==d.keyword||a.target!==d.target||a.params!==d.params,a});l&&o({...t,rows:c})},removeRow(i){let s=t.rows.filter(l=>l.id!==i);s.length!==t.rows.length&&o({...t,rows:s})}}}function He(e){return e.keyword.trim()!==""&&e.target.trim()!==""}function Ue(e){return e.keyword.trim().replace(/^\/+/,"").toLowerCase()}function $e(e,n){let t=n.trim().replace(/^\/+/,"").toLowerCase();return t===""?[]:e.rows.filter(r=>He(r)&&Ue(r)===t)}function je(e,n,t=!1){let r=n.trim().replace(/^\/+/,"").toLowerCase(),o=e.rows.filter(He);if(r==="")return t?o:[];let i=[],s=[],l=[];for(let c of o){let d=Ue(c);d===r?i.push(c):d.startsWith(r)?s.push(c):d.includes(r)&&l.push(c)}return[...i,...s,...l]}function ze(e){let n=e.target.trim().replace(/^\/+/,"");if(n==="")return"";let t=e.params.trim();return t===""?`/${n} `:`/${n} ${t} `}function qe(e,n){let t=/^\/([^\s/]+)([ \t]*)$/u.exec(n);if(t===null)return;let r=t[1]??"",o=$e(e,r);if(o.length!==0)return{query:r,start:0,end:n.length,rows:o}}function Ve(e,n){let t=/^([^\s/]+)([ \t]*)$/u.exec(n);if(t===null)return;let r=t[1]??"",o=$e(e,r);if(o.length!==0)return{query:r,start:0,end:n.length,rows:o}}function Ge(e){if(e.keyword.trim()==="")return"keyword";if(e.target.trim()==="")return"target";if(/\s/.test(e.keyword.trim()))return"keyword"}var w=require("react/jsx-runtime");function Kt(e){let{row:n,store:t,t:r}=e,o=Ge(n);return(0,w.jsxs)("tr",{"data-testid":"alias-row","data-row-id":n.id,"data-incomplete":o===void 0?void 0:"",children:[(0,w.jsx)("td",{children:(0,w.jsx)("input",{className:"dsh-better-alias-input","data-testid":"alias-keyword",value:n.keyword,placeholder:"wf",spellCheck:!1,autoComplete:"off","aria-label":r("alias.table.keyword"),ref:i=>{i!==null&&e.focus&&(i.focus(),e.clearFocus())},onChange:i=>t.updateRow(n.id,{keyword:i.target.value})})}),(0,w.jsx)("td",{children:(0,w.jsx)("input",{className:"dsh-better-alias-input","data-testid":"alias-target",value:n.target,placeholder:"flow-workflow",spellCheck:!1,autoComplete:"off","aria-label":r("alias.table.target"),onChange:i=>t.updateRow(n.id,{target:i.target.value})})}),(0,w.jsx)("td",{children:(0,w.jsx)("input",{className:"dsh-better-alias-input","data-testid":"alias-params",value:n.params,placeholder:r("alias.table.paramsPlaceholder"),spellCheck:!1,autoComplete:"off","aria-label":r("alias.table.params"),onChange:i=>t.updateRow(n.id,{params:i.target.value})})}),(0,w.jsx)("td",{className:"dsh-better-alias-actions",children:(0,w.jsx)("button",{type:"button",className:"dsh-better-alias-delete","data-testid":"alias-remove","aria-label":r("alias.remove",{keyword:n.keyword.trim()||r("alias.unnamed")}),title:r("alias.remove",{keyword:n.keyword.trim()||r("alias.unnamed")}),onClick:()=>t.removeRow(n.id),children:"\xD7"})})]})}function Ke(e){function n(){let t=(0,re.useSyncExternalStore)(e.store.subscribe,e.store.getSnapshot,e.store.getSnapshot),{translate:r}=e,o=(0,re.useRef)(null),i=()=>{o.current=e.store.addRow()};return(0,w.jsxs)("section",{className:"dsh-better-alias-page","data-testid":"alias-page",children:[(0,w.jsx)("h2",{className:"dsh-better-alias-heading",children:r("alias.heading")}),(0,w.jsxs)("label",{className:"dsh-better-alias-prefix",children:[(0,w.jsxs)("span",{children:[(0,w.jsx)("span",{className:"dsh-better-alias-prefix-title",children:r("alias.prefix.title")}),(0,w.jsx)("span",{className:"dsh-better-alias-prefix-hint",children:r(t.prefix?"alias.prefix.on":"alias.prefix.off")})]}),(0,w.jsx)("input",{type:"checkbox","data-testid":"alias-prefix",checked:t.prefix,"aria-label":r("alias.prefix.title"),onChange:s=>e.store.setPrefix(s.target.checked)})]}),(0,w.jsxs)("div",{className:"dsh-better-alias-table-wrap",children:[(0,w.jsxs)("table",{className:"dsh-better-alias-table",children:[(0,w.jsx)("thead",{children:(0,w.jsxs)("tr",{children:[(0,w.jsx)("th",{scope:"col",children:r("alias.table.keyword")}),(0,w.jsx)("th",{scope:"col",children:r("alias.table.target")}),(0,w.jsx)("th",{scope:"col",children:r("alias.table.params")}),(0,w.jsx)("th",{scope:"col","aria-label":r("alias.table.actions")})]})}),(0,w.jsx)("tbody",{children:t.rows.map(s=>(0,w.jsx)(Kt,{row:s,store:e.store,t:r,focus:o.current===s.id,clearFocus:()=>{o.current=null}},s.id))})]}),t.rows.length===0?(0,w.jsx)("p",{className:"dsh-better-alias-empty","data-testid":"alias-empty",children:r("alias.empty")}):null]}),(0,w.jsx)("button",{type:"button",className:"dsh-better-alias-add","data-testid":"alias-add",onClick:i,children:r("alias.add")}),(0,w.jsx)("p",{className:"dsh-better-alias-footnote",children:r("alias.footnote")})]})}return n}var ge="alias",Yt="/",Jt=-1;function Xt(e,n){let t=e.target.trim().replace(/^\/+/,""),r=e.keyword.trim(),o=e.params.trim();return{name:t,label:r,...o===""?{}:{description:n("alias.menu.params",{value:o})},section:n("alias.menu.section"),value:e.id}}function Ye(e){return{trigger:Yt,name:ge,order:Jt,async candidates(n,t){if(t.position!=="leading")return[];let r=e.config();return!r.prefix&&e.bareMenuOpen?.()!==!0?[]:je(r,t.query,!0).map(o=>Xt(o,e.translate))},onPick(n){let t=e.config().rows.find(i=>i.id===n.candidate.value);if(t===void 0)return;let r=t.target.trim().replace(/^\/+/,"");r!==""&&e.routeCommand?.(r,n);let o=ze(t);return o===""?void 0:{text:o}}}}var Je="dsh-better/aliases.css",Zt=`
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
`;function Xe(e){let n=`style[data-plugin-css=${JSON.stringify(Je)}]`;if(e.querySelector(n)!==null)return()=>{};let t=e.createElement("style");return t.dataset.plugin="dsh-better",t.dataset.pluginCss=Je,t.textContent=Zt,e.head.append(t),()=>t.remove()}var q=require("react");var Ze={draft:"",draftRev:-1,phase:"plain"};function en(e){return function(t){let r=(0,q.useSyncExternalStore)(e.store.subscribe,e.store.getSnapshot,e.store.getSnapshot),o=t.sessionId===void 0?void 0:e.inputStoreFor(t.sessionId),i=t.sessionId===void 0?void 0:e.controllerFor(t.sessionId),s=(0,q.useSyncExternalStore)(c=>o===void 0?()=>{}:o.subscribe(c),()=>o===void 0?Ze:o.getSnapshot(),()=>o===void 0?Ze:o.getSnapshot()),l=(0,q.useRef)(null);return(0,q.useEffect)(()=>{let c=t.sessionId;if(c===void 0||s.phase!=="plain"||i===void 0)return;let d=i.menu.getSnapshot().open;if(d&&l.current===null)return;let a=ye(r,s.draft);if(d){let p=l.current;if(p!==null&&(p.draftRev!==s.draftRev||p.spanEnd!==(a?.end??-1))){let f=setTimeout(()=>{let m=o?.getSnapshot()??s,y=e.controllerFor(c);if(y===void 0||m.phase!=="plain")return;l.current=null,y.dismiss();let g=ye(e.store.getSnapshot(),m.draft);g!==void 0&&(e.bareMenuOpen.open=!0,Qe(y,g,m.draftRev),e.bareMenuOpen.open=!1,l.current={draftRev:m.draftRev,spanEnd:g.end})},80);return()=>clearTimeout(f)}return}if(l.current=null,a===void 0)return;let u=setTimeout(()=>{let p=o?.getSnapshot()??s,f=e.controllerFor(c);if(f===void 0||p.phase!=="plain"||f.menu.getSnapshot().open)return;let m=ye(e.store.getSnapshot(),p.draft);m!==void 0&&(e.bareMenuOpen.open=!0,Qe(f,m,p.draftRev),e.bareMenuOpen.open=!1,l.current={draftRev:p.draftRev,spanEnd:m.end})},80);return()=>clearTimeout(u)},[r,s.draft,s.draftRev,s.phase,i,o,t.sessionId]),null}}function ye(e,n){return e.prefix?qe(e,n):Ve(e,n)}function Qe(e,n,t){e.toggleSource(ge,{trigger:"/",query:n.query,quoted:!1,position:"leading",span:{start:n.start,end:n.end,draftRev:t}})}var R=require("react");var Qt="[a-z0-9]+(?:-[a-z0-9]+)*",er=new RegExp(`^/(${Qt})(?=\\s|$)`,"u");function nn(e,n){let t=er.exec(e);if(t===null)return;let r=t[1]??"";if(n(r))return{name:r,start:0,end:1+r.length}}function tn(e,n,t){return e===void 0||!Number.isInteger(t)||t<e.end||t>n.length||t!==n.length?!1:/^[ \t]*$/u.test(n.slice(e.end,t))}var nr=/^\/([a-z0-9]+(?:-[a-z0-9]+)*)[ \t]*$/u,tr=400,rn=200,on=6,rr=240,an={draft:"",draftRev:-1,phase:"plain"};function or(e,n){return`${e!==""&&!/\s$/u.test(e)?" ":""}${n} `}function dn(e){return e===void 0?void 0:nr.exec(e)?.[1]}function ir(e){return e===void 0?[]:e.split(`
`).map(n=>n.trim()).filter(n=>n!=="")}var be=240,ke=640;function ar(e){return!Number.isFinite(e)||e<=0?ke:Math.max(be,Math.min(ke,e-24))}function sr(e,n){let t=ar(n),r=Number.isFinite(e)&&e>0?e:0,o=r===0?be:r<=80?320:r<200?480:ke;return Math.min(Math.max(o,be),t)}function lr(e,n,t,r){if(!Number.isFinite(t)||t<=0)return e;let o=t-n-r;return Math.max(r,Math.min(e,Math.max(r,o)))}function dr(e,n,t){if(t<=0||typeof e.createRange!="function")return;let r=e.createRange(),o=t,i=!1,s=c=>{for(let d of Array.from(c.childNodes)){if(d.nodeType===3){let a=d.textContent??"",u=Math.min(o,a.length);if(u<=0)continue;if(i||(r.setStart(d,0),i=!0),r.setEnd(d,u),o-=u,o<=0)return!0;continue}if(s(d))return!0}return!1};if(!s(n)||o>0)return;let l=r.getBoundingClientRect();if(!(l.width===0&&l.height===0))return{left:l.left,right:l.right,top:l.top,bottom:l.bottom}}function sn(e,n){let t=e.querySelectorAll("[data-composer-text-ref]");for(let r of t){if(dn(r.textContent??"")!==n)continue;let o=dr(e,r,n.length+1);if(o!==void 0)return o;let i=r.getBoundingClientRect();return{left:i.left,right:i.right,top:i.top,bottom:i.bottom}}}function un(e){return e.defaultView?.innerWidth??0}function ur(e,n,t,r){let o=e.top-r,i=Number.isFinite(t)&&t>0?t:0;return i===0||i<=o?{left:e.left,top:0,anchor:"above"}:{left:e.left,top:e.bottom+r,anchor:"below"}}function ln(e){return e.defaultView?.innerHeight??0}function cn(e){return function(t){let r=e.document??globalThis.document,o=t.sessionId,i=o===void 0?void 0:e.inputStoreFor(o),s=t.useInput,l=s===void 0?void 0:s(k=>k.draft),c=(0,R.useSyncExternalStore)(k=>i===void 0?()=>{}:i.subscribe(k),()=>i===void 0?an.draft:i.getSnapshot().draft,()=>i===void 0?an.draft:i.getSnapshot().draft),d=l??c,[a,u]=(0,R.useState)(()=>new Set),[p,f]=(0,R.useState)(void 0),[m,y]=(0,R.useState)(void 0),[g,S]=(0,R.useState)(void 0),[E,A]=(0,R.useState)(void 0);(0,R.useEffect)(()=>{if(o===void 0)return;let k=!0;return e.skillNamesFor(o).then(x=>{k&&u(x)},()=>{k&&u(new Set)}),()=>{k=!1}},[o]);let I=nn(d,k=>a.has(k)),N=tn(I,d,d.length)?I?.name:void 0,$=N??m;(0,R.useEffect)(()=>{if(o===void 0||$===void 0){f(void 0);return}let k=!0;return e.loadProfile(o,$).then(x=>{k&&f(x)},()=>{k&&f(void 0)}),()=>{k=!1}},[o,$]),(0,R.useEffect)(()=>{if(r===void 0||N===void 0){S(void 0);return}let k=()=>S(sn(r,N));k();let x=r.defaultView;return x?.addEventListener("resize",k),()=>x?.removeEventListener("resize",k)},[r,N,d]);let D=(0,R.useRef)(null),F=(0,R.useRef)(null),b=()=>{D.current!==null&&clearTimeout(D.current),D.current=null},C=()=>{F.current!==null&&clearTimeout(F.current),F.current=null};(0,R.useEffect)(()=>{if(r===void 0||o===void 0)return;let k=T=>{let W=T.target;if(!(W instanceof r.defaultView.Element))return;let Z=W.closest("[data-composer-text-ref]");if(Z===null)return;let z=dn(Z.textContent??"");z!==void 0&&(C(),b(),D.current=setTimeout(()=>{D.current=null,y(z),S(sn(r,z)),A(e.loadUsage(o,z))},tr))},x=T=>{let W=T.target;W instanceof r.defaultView.Element&&W.closest("[data-composer-text-ref]")!==null&&(b(),C(),F.current=setTimeout(()=>{F.current=null,y(void 0)},rn))};return r.addEventListener("pointerover",k,!0),r.addEventListener("pointerout",x,!0),()=>{b(),C(),r.removeEventListener("pointerover",k,!0),r.removeEventListener("pointerout",x,!0)}},[r,o]),(0,R.useEffect)(()=>{if(r===void 0||m===void 0)return;let k=x=>{x.key==="Escape"&&y(void 0)};return r.addEventListener("keydown",k),()=>r.removeEventListener("keydown",k)},[r,m]);let M=(0,R.useRef)(d);M.current=d;let B=(0,R.useRef)(void 0);return B.current=t.inputActions??(o===void 0?void 0:e.actionsFor(o)),(0,R.useEffect)(()=>{if(r===void 0||N===void 0||g===void 0)return;let k=ir(p?.argumentHint);if(k.length===0)return;let x=cr(r,g,k);return r.body.append(x),()=>x.remove()},[r,N,g,p]),(0,R.useEffect)(()=>{if(r===void 0||m===void 0)return;let k=pr(r,e,{name:m,profile:p,usage:E,box:g,sessionId:o,getActions:()=>B.current,getDraft:()=>M.current,onEnter:C,onLeave:()=>{b(),C(),F.current=setTimeout(()=>{F.current=null,y(void 0)},rn)}});return r.body.append(k),()=>k.remove()},[r,m,p,E,g,o]),null}}function cr(e,n,t){let r=e.createElement("div");r.className="dsh-better-skill-hint",r.textContent=t.join(`
`);let o=n.right+on>un(e)-rr;return r.style.left=`${o?n.left:n.right+on}px`,r.style.top=`${o?n.bottom+2:n.top}px`,r}function pr(e,n,t){let r=e.createElement("div");r.className="dsh-better-skill-panel",r.addEventListener("pointerenter",t.onEnter),r.addEventListener("pointerleave",t.onLeave);let o=e.createElement("div");o.className="dsh-better-skill-panel-title",o.textContent=`/${t.name}`,r.append(o);let i=t.profile?.description;if(i!==void 0&&i!==""){let a=e.createElement("div");a.className="dsh-better-skill-panel-desc",a.textContent=i,a.title=i,r.append(a)}let s=t.profile?.metadata??{},l=Object.keys(s);if(l.length>0){let a=e.createElement("div");a.className="dsh-better-skill-panel-section",a.append(he(e,n.translate("skill.metadata")));for(let u of l){let p=e.createElement("div");p.textContent=`${u}: ${s[u]??""}`,a.append(p)}r.append(a)}let c=t.profile?.path;if(c!==void 0&&c!==""){r.append(he(e,n.translate("skill.path")));let a=e.createElement("div");a.className="dsh-better-skill-panel-path",a.textContent=c,r.append(a)}if(t.usage!==void 0){let a=e.createElement("div");a.className="dsh-better-skill-panel-counts",a.textContent=`${n.translate("skill.usage.session")} ${t.usage.session}`,t.usage.workspace!==void 0&&(a.textContent+=` \xB7 ${n.translate("skill.usage.workspace")} ${t.usage.workspace}`),r.append(a)}let d=t.profile?.params??[];if(d.length>0&&t.getActions()?.insertText!==void 0){r.append(he(e,n.translate("skill.params")));for(let a of d)r.append(fr(e,n,t,a.flag,a.detail))}{let u=un(e),p=sr(i?.length??0,u);if(r.style.width=`${p}px`,t.box!==void 0){let f=ur(t.box,ln(e),r.offsetHeight,4);r.style.left=`${lr(f.left,p,u,12)}px`,f.anchor==="above"?(r.style.bottom=`${ln(e)-t.box.top+4}px`,r.style.top=""):(r.style.top=`${f.top}px`,r.style.bottom="")}}return r}function he(e,n){let t=e.createElement("div");return t.className="dsh-better-skill-panel-label",t.textContent=n,t}function fr(e,n,t,r,o){let i=e.createElement("button");i.type="button",i.className="dsh-better-skill-panel-param",i.title=n.translate("skill.hint.insert"),i.addEventListener("pointerdown",l=>l.preventDefault());let s=e.createElement("span");if(s.className="dsh-better-skill-panel-param-flag",s.textContent=r,i.append(s),o!==""){let l=e.createElement("span");l.className="dsh-better-skill-panel-param-detail",l.textContent=o,i.append(l)}return i.addEventListener("click",()=>{let l=t.getActions();if(l?.insertText===void 0||l.captureInsertion===void 0)return;let c=l.captureInsertion();l.insertText(or(t.getDraft(),r),c)}),i}var pn="dsh-better/skill-enhancer.css",mr=`
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
`;function fn(e){if(e===void 0)return()=>{};let n=`style[data-plugin-css=${JSON.stringify(pn)}]`;if(e.querySelector(n)!==null)return()=>{};let t=e.createElement("style");return t.dataset.plugin="dsh-better",t.dataset.pluginCss=pn,t.textContent=mr,e.head.append(t),()=>t.remove()}function mn(e,n,t){if(n===void 0||n===""||e.length===0)return;let r=0;for(let o of e){if(o.cwd!==n)continue;let i=o.usage?.[t];typeof i=="number"&&Number.isFinite(i)&&(r+=i)}return r}var v=require("react");var gr="@deepseek-ai/dsh-client-ui-commands/PopupSelectView.module.css";function gn(e){if(e===void 0)return;let t=e.querySelector(`style[data-plugin-css="${gr}"]`)?.textContent??"",r=i=>new RegExp(`\\.(\\w+_${i})\\{`,"u").exec(t)?.[1],o={badges:"dshBetter_badges",badgeChip:"dshBetter_badgeChip",badgeChipOn:"dshBetter_badgeChipOn",card:r("card"),viewport:r("viewport"),row:r("row"),rowActive:r("rowActive"),label:r("label"),labelText:r("labelText"),badge:r("badge"),detail:r("detail"),check:r("check"),status:r("status"),search:r("search"),error:r("error"),errorText:r("errorText"),retry:r("retry")};for(let[i,s]of Object.entries(o))if(!(i==="badges"||i==="badgeChip"||i==="badgeChipOn")&&s===void 0)return;return o}function Se(e,n){for(let t of e)if(t.id===n.provider){for(let r of t.models)if(r.id===n.model)return r.reasoning}}function yn(e,n){let t=Se(e,n)?.efforts;return t===void 0?[]:[...t]}function hn(e,n){if(e.length===0)return;let t=r=>r!==void 0&&e.some(o=>o.id===r);return t(n.remembered)?n.remembered:n.isCurrent&&t(n.currentEffort)?n.currentEffort:t(n.defaultEffort)?n.defaultEffort:e[0]?.id}function yr(e){return e.length>1}function bn(e){return yr(e)?e:[]}var U=require("react/jsx-runtime");function oe(e){let n=e.group?.name;if(n===void 0)return;let t=`${n}/`,r=e.id.startsWith(t)?e.id.slice(t.length):e.id;return{provider:n,model:r}}function hr(e,n){let t=oe(e);return bn(t===void 0?[]:yn(n??[],t))}function kn({option:e,active:n,catalog:t,pointed:r,classes:o,primitives:i,onChoose:s,onPickEffort:l,onHover:c,t:d}){let a=hr(e,t),u=i.IconCheckOutlineRegular;return(0,U.jsxs)("div",{role:"option","aria-selected":n,"aria-label":e.badge===void 0?void 0:`${e.label} ${e.badge}`,className:n?`${o.row} ${o.rowActive}`:o.row,onClick:s,onMouseEnter:c,children:[(0,U.jsxs)("span",{className:o.label,children:[(0,U.jsx)("span",{className:o.labelText,children:e.label}),e.badge!==void 0&&(0,U.jsx)("sup",{className:o.badge,children:e.badge})]}),e.detail!==void 0&&(0,U.jsx)("span",{className:o.detail,children:e.detail}),a.length>0&&(0,U.jsx)("span",{className:o.badges,role:"group","aria-label":d?.("listbox.aria")??"",children:a.map(p=>(0,U.jsx)("button",{type:"button",className:p.id===r?`${o.badgeChip} ${o.badgeChipOn}`:o.badgeChip,title:p.description??p.name,onClick:f=>{f.stopPropagation(),l(p.id)},children:p.name},p.id))}),e.active===!0&&a.length===0&&(0,U.jsx)("span",{className:o.check,children:u===void 0?null:(0,U.jsx)(u,{})})]})}function ie(e){let n=new Map;for(let t of e){let r=t.group?.name,o=n.get(r);o!==void 0?o.rows.push(t):n.set(r,{group:t.group,rows:[t]})}return[...n.values()]}function ae(e){let n=ie(e);return n.some(t=>t.group!==void 0)?n.flatMap(t=>t.rows):[...e]}function Sn(e,n,t){return t===void 0?e.filter(r=>r.label.toLowerCase().includes(n)):ie(e).flatMap(r=>t(r.rows.map(o=>({name:o.label,option:o})),n).map(o=>o.option))}var we=new WeakSet;async function wn(e,n){let t=e.binding,r=e.state.getSnapshot();if(!(t===null||r.submitting||we.has(e))){we.add(e),e.state.set?.({...r,submitting:!0,confirming:null,acknowledged:!1,error:null});try{let o=n();if(o===void 0)return;await o,t!==null&&e.binding===t&&e.deps?.consume?.(t.segment)}finally{we.delete(e),t!==null&&e.binding===t&&e.dismiss({focusComposer:!0})}}}var br="@deepseek-ai/dsh-client-ui-primitives";function se(e){if(e===null)return{};let n;try{n=e(br)}catch{return{}}if(n===null||typeof n!="object")return{};let t=n,r=y=>typeof y=="function"||typeof y=="object"&&y!==null,o=y=>{let g=t[y];return r(g)?g:void 0},i=y=>{let g=t[y];return typeof g=="function"?g:void 0},s={},l=o("MenuSurface");l!==void 0&&(s.MenuSurface=l);let c=o("MenuGroup");c!==void 0&&(s.MenuGroup=c);let d=o("IconCheckOutlineRegular");d!==void 0&&(s.IconCheckOutlineRegular=d);let a=o("IconDataOutlineRegular");a!==void 0&&(s.IconDataOutlineRegular=a);let u=o("IconChevronDownOutlineRegular");u!==void 0&&(s.IconChevronDownOutlineRegular=u);let p=i("useAnchoredMaxHeight");p!==void 0&&(s.useAnchoredMaxHeight=p);let f=i("observeStickyMenuGroups");f!==void 0&&(s.observeStickyMenuGroups=f);let m=i("rankByName");return m!==void 0&&(s.rankByName=m),s}function kr(e){if(e===void 0)return[];let n=[e.name,e.label].map(t=>t.trim().toLowerCase()).filter(t=>t!=="");return[...new Set(n)]}function Sr(e,n){return kr(e.group).some(t=>t.includes(n))}function wr(e,n,t,r){return t==="fuzzy-label"?Sn(e,n,r):ae(e).filter(o=>o.label.toLowerCase().includes(n)||o.detail?.toLowerCase().includes(n)===!0)}function vn(e,n,t,r){let o=n.trim().toLowerCase();if(o==="")return ae(e);let i=wr(e,o,t,r),s=new Set(i),l=ae(e).filter(c=>!s.has(c)&&Sr(c,o));return[...i,...l]}var P=require("react/jsx-runtime"),Rn="model",xn=320;function vr(e){return e.command!==Rn||!e.open||e.status!=="ready"||e.confirming!==null||e.options.length===0?!1:e.submitting||e.error===null}var xr={subscribe:()=>()=>{},getSnapshot:()=>({open:!1,command:null,status:"pending",options:[],search:"",searchLabels:null,searchMode:"substring",active:0,submitting:!1,confirming:null,acknowledged:!1,error:null})};function En(e){let n=se(e.load);function t(r){let o=r.popup,i=o?.state??xr,s=(0,v.useCallback)(a=>i.subscribe(a),[i]),l=(0,v.useCallback)(()=>i.getSnapshot(),[i]),c=(0,v.useSyncExternalStore)(s,l),d=e.native();return o===void 0||d===void 0?null:!vr(c)||o.settle===void 0?(0,P.jsx)(d,{...r}):(0,P.jsx)(Cr,{popup:o,state:c,t:r.t,primitives:n,doc:e.document,catalog:r.catalog,current:r.current,selectModel:r.selectModel})}return t}function Cr({popup:e,state:n,t,primitives:r,doc:o,catalog:i,current:s,selectModel:l}){let c=(0,v.useRef)(null),d=(0,v.useRef)(null),a=(0,v.useRef)(null),u=(0,v.useMemo)(()=>gn(o),[o]),p=n.searchMode,f=(0,v.useMemo)(()=>vn(n.options,n.search,p,r.rankByName),[n.options,n.search,p,r.rankByName]),m=(0,v.useMemo)(()=>ie(f),[f]),[y,g]=(0,v.useState)({}),[S,E]=(0,v.useState)(()=>Cn(f));(0,v.useEffect)(()=>{E(Cn(f))},[n.search,n.options]);let A=Ln(f,S),I=Lr(r,c,n);(0,v.useEffect)(()=>{let h=a.current;if(!(h===null||r.observeStickyMenuGroups===void 0))return r.observeStickyMenuGroups(h)},[r.observeStickyMenuGroups,n.open,n.status,m]),(0,v.useEffect)(()=>{c.current?.querySelector('[aria-selected="true"]')?.scrollIntoView({block:"nearest"})},[A,f]),(0,v.useEffect)(()=>{if(!n.open)return;let h=L=>{let O=c.current;O!==null&&L.target instanceof Node&&O.contains(L.target)||e.dismiss()};return o?.addEventListener("pointerdown",h,!0),()=>{o?.removeEventListener("pointerdown",h,!0)}},[o,e,n.open]),(0,v.useEffect)(()=>{d.current?.focus()},[n.open]);let N=(0,v.useCallback)((h,L)=>{if(L===void 0||l===void 0){e.settle?.(e.binding,h);return}let O=oe(h);if(O===void 0){e.settle?.(e.binding,h);return}wn(e,()=>l({...O,reasoningEffort:L}))},[e,l]),$=(0,v.useCallback)(h=>{let L=oe(h);if(L===void 0)return;let O=Se(i??[],L);return hn(O?.efforts??[],{remembered:y[h.id],isCurrent:s?.provider===L.provider&&s?.model===L.model,currentEffort:s?.reasoningEffort,defaultEffort:O?.defaultEffort})},[i,s,y]),D=(0,v.useCallback)(h=>{N(h,$(h))},[$,N]),F=(0,v.useCallback)((h,L)=>{g(O=>({...O,[h.id]:L})),N(h,L)},[N]),b=(0,v.useCallback)(()=>{let h=f[A];h!==void 0&&D(h)},[A,D,f]),C=(0,v.useCallback)(h=>{f.length!==0&&E(L=>(Ln(f,L)+h+f.length)%f.length)},[f]),M=h=>{switch(h.key){case"ArrowDown":h.preventDefault(),C(1);return;case"ArrowUp":h.preventDefault(),C(-1);return;case"Enter":h.preventDefault(),b();return;case"Tab":if(!h.shiftKey&&f.length===0)return;h.preventDefault(),h.shiftKey?e.dismiss({focusComposer:!0}):b();return;case"Escape":h.preventDefault(),e.dismiss({focusComposer:!0});return;default:}};if(u===void 0)return null;let B=n.searchLabels?.placeholder??t?.("search.placeholder")??"",k=n.searchLabels===null?t?.("status.empty")??"":n.options.length===0?n.searchLabels.empty:n.searchLabels.noResults,x=(h,L)=>(0,P.jsx)(kn,{option:h,active:L===A,catalog:i,pointed:L===A?$(h):void 0,classes:u,primitives:r,onChoose:()=>{D(h)},onPickEffort:O=>{F(h,O)},onHover:()=>{E(L)},t},h.id),T=0,W=m.map(({group:h,rows:L})=>{let O=L.map(Dt=>x(Dt,T++));return h===void 0?(0,P.jsx)(v.Fragment,{children:O},"ungrouped"):r.MenuGroup===void 0?(0,P.jsx)(v.Fragment,{children:O},`group:${h.name}`):(0,P.jsx)(r.MenuGroup,{label:h.label,children:O},`group:${h.name}`)}),Z=(0,P.jsxs)(P.Fragment,{children:[(0,P.jsx)("input",{ref:d,className:u.search,type:"text",placeholder:B,"aria-label":t?.("search.aria")??"",value:n.search,readOnly:n.submitting,onChange:h=>{e.setSearch(h.currentTarget.value)}}),n.submitting&&(0,P.jsx)("div",{className:u.status,children:t?.("status.applying")??""}),!n.submitting&&f.length===0&&(0,P.jsx)("div",{className:u.status,children:k}),f.length>0&&(0,P.jsx)("div",{ref:a,role:"listbox","aria-label":t?.("listbox.aria")??"",className:u.viewport,children:W})]}),z={className:u.card,style:{maxHeight:I},"aria-label":t?.("overlay.aria")??Rn,onKeyDown:M};return r.MenuSurface===void 0?(0,P.jsx)("div",{ref:c,...z,children:Z}):(0,P.jsx)(r.MenuSurface,{ref:c,...z,children:Z})}function Cn(e){let n=e.findIndex(t=>t.active===!0);return n===-1?0:n}function Ln(e,n){return e.length===0?0:Math.min(Math.max(n,0),e.length-1)}function Lr(e,n,t){let r=e.useAnchoredMaxHeight;return r===void 0?xn:r(n,xn,t)}var H=require("react");var ve="application/x-dsh-composer+json";var Rr=Object.freeze({png:"image/png",jpg:"image/jpeg",jpeg:"image/jpeg",webp:"image/webp",gif:"image/gif",bmp:"image/bmp",svg:"image/svg+xml",avif:"image/avif",heic:"image/heic",heif:"image/heif",tif:"image/tiff",tiff:"image/tiff"});function An(e){return JSON.stringify({v:1,text:e.text,attachments:e.attachments.map(n=>({path:n.path,name:n.name,type:n.type,kind:n.kind}))})}function Tn(e){if(typeof e!="string"||e==="")return;let n;try{n=JSON.parse(e)}catch{return}if(n===null||typeof n!="object")return;let t=n;if(t.v!==1)return;let r=typeof t.text=="string"?t.text:"",o=Array.isArray(t.attachments)?t.attachments:[],i=[];for(let s of o){if(s===null||typeof s!="object")continue;let l=s,c=l.path;typeof c!="string"||c===""||i.push({path:c,name:typeof l.name=="string"&&l.name!==""?l.name:Ce(c),type:typeof l.type=="string"?l.type:"",kind:l.kind==="image"?"image":"file"})}return{text:r,attachments:i}}function xe(e,n){if(n.length===0)return e;let t=n.join(`
`);return e===""?t:`${e.replace(/\n+$/u,"")}

${t}`}function Pn(e){if(e==="")return;let n=e.split(`
`),t=[],r=n.length;for(let i=n.length-1;i>=0;i-=1){let s=n[i]??"";if(s.trim()===""){if(t.length>0){r=i;continue}continue}let l=Er(s);if(l===void 0)break;t.unshift(l),r=i}return t.length===0?void 0:{text:n.slice(0,r).join(`
`).replace(/\n+$/u,""),paths:t}}function Er(e){let n=e.trim();if(n.startsWith("@")&&(n=n.slice(1)),n.startsWith('"')&&n.endsWith('"')&&n.length>1&&(n=n.slice(1,-1)),n!==""&&Ar(n)&&!/[\u0000-\u001f\u007f]/u.test(n)&&!/["\u2018\u2019\u201c\u201d\u300c\u300d\u300e\u300f\u3002\uff01\uff1f\uff1b\uff1a\uff0c\u3001\u2026*?;<>|&$`!#=]/u.test(n)&&!/(?:^|\s)-{1,2}\S/u.test(n))return n}function Ar(e){return e.startsWith("/")||/^[A-Za-z]:[/\\]/u.test(e)||e.startsWith("\\\\")}function On(e){let n=/\.([A-Za-z0-9]+)$/u.exec(e);if(n!==null)return Rr[n[1]?.toLowerCase()??""]}function Ce(e){return e.split(/[\\/]/u).filter(t=>t!=="").at(-1)??e}function In(e,n){let t=new Set(n),r=[],o=[];for(let i of e){if(t.has(i.path)){o.push(i.path);continue}t.add(i.path),r.push(i)}return{accepted:r,duplicates:o}}var Y=require("react/jsx-runtime"),Tr="data-dsh-better-attach-item",Pr="data-dsh-better-attach-selected",Or=4500,Ir=new Set(["a","c","x","insert"]),Nr=new Set(["meta","control","shift","alt","altgraph","capslock","os"]),Mr=/\s/u;function Mn(e){function n(t){let r=e.native();return r===void 0?null:(0,Y.jsx)(_r,{native:r,props:t,deps:e})}return n}function _r({native:e,props:n,deps:t}){let r=(0,H.useRef)(null),[o,i]=(0,H.useState)(!1),[s,l]=(0,H.useState)(null),c=(n.attachments??[]).length>0,d=(0,H.useRef)(n);d.current=n;let a=(0,H.useRef)(o);a.current=o;let u=(f,m)=>n.t?.(f,m)??t.translate()?.(f,m)??"",p=(0,H.useRef)(u);return p.current=u,(0,H.useEffect)(()=>{let f=r.current;if(f===null)return;let m=f.querySelector('[role="group"]');if(m!==null)for(let y of Array.from(m.children)){if(!(y instanceof HTMLElement))continue;y.toggleAttribute(Tr,!0);let g=Br(y);g!==null&&g.toggleAttribute(Pr,o)}},[o,n.attachments]),(0,H.useEffect)(()=>{if(s===null)return;let f=globalThis.setTimeout(()=>{l(null)},Or);return()=>{globalThis.clearTimeout(f)}},[s]),(0,H.useEffect)(()=>{let f=r.current;if(f===null)return;let m=f.closest("[data-composer-card]");if(!(m instanceof HTMLElement))return;let y=m.ownerDocument,g=b=>(b instanceof Element?b:b instanceof Node?b.parentElement:null)?.closest("[contenteditable]")??null,S=()=>{a.current&&i(!1)},E=()=>{let b=m.ownerDocument.getSelection();return b!==null&&!b.isCollapsed&&b.toString()!==""},A=b=>b instanceof Node&&m.contains(b),I=b=>{let C=b.key.toLowerCase();if(Nr.has(C))return;let M=b.metaKey||b.ctrlKey;if(M&&!b.altKey&&C==="a"){A(b.target)&&g(b.target)?.getAttribute("contenteditable")==="true"&&i(!0);return}if(M&&!b.altKey&&C==="c"&&a.current&&A(b.target)&&!E()){b.preventDefault(),Dr(d.current,t,l,p.current);return}M&&!b.altKey&&Ir.has(C)||S()},N=()=>{S()},$=b=>{let M=d.current.attachments??[],B=b.clipboardData;if(!a.current||M.length===0||B===null)return;let k=[],x=[];for(let T of M){let W=t.pathOf(T.file);if(W===""){x.push(T.file.name);continue}k.push({path:W,name:T.file.name,type:T.file.type,kind:T.kind})}if(k.length>0){let T=B.getData("text/plain");B.setData(ve,An({text:T,attachments:k})),B.setData("text/plain",xe(T,k.map(W=>W.path)))}x.length>0&&l(p.current("attach.copySkipped",{count:String(x.length)}))},D=b=>{let C=b.clipboardData;if(C===null||g(b.target)===null||Array.from(C.types).includes("Files"))return;let M=()=>d.current,B=Tn(C.getData(ve));if(B!==void 0){b.preventDefault(),b.stopPropagation(),S(),Nn(B,M,t,l,p.current);return}let k=Pn(C.getData("text/plain"));k!==void 0&&(b.preventDefault(),b.stopPropagation(),S(),Nn({text:k.text,attachments:k.paths.map(x=>{let T=On(x)??"";return{path:x,name:Ce(x),type:T,kind:T===""?"file":"image"}})},M,t,l,p.current))};y.addEventListener("keydown",I,!0),m.addEventListener("paste",D,!0);let F=b=>{let C=b.relatedTarget;C instanceof Node&&m.contains(C)||S()};return m.addEventListener("focusout",F),y.addEventListener("copy",$),y.addEventListener("pointerdown",N,!0),()=>{y.removeEventListener("keydown",I,!0),y.removeEventListener("copy",$),m.removeEventListener("paste",D,!0),m.removeEventListener("focusout",F),y.removeEventListener("pointerdown",N,!0)}},[t]),(0,Y.jsxs)("div",{ref:r,className:c?"dshBetter_railHost":"dshBetter_railHostEmpty",children:[(0,Y.jsx)(e,{...n}),s!==null&&(0,Y.jsx)("div",{className:"dshBetter_attachNotice",role:"status",children:s})]})}function Dr(e,n,t,r){let o=e.attachments??[],i=[],s=0;for(let l of o){let c=n.pathOf(l.file);c===""?s+=1:i.push(c)}i.length>0&&globalThis.navigator?.clipboard?.writeText(xe("",i)).catch(()=>{t(r("attach.copyFailed"))}),s>0&&t(r("attach.copySkipped",{count:String(s)}))}function Nn(e,n,t,r,o){let i=n();if(Le(i,e.text),e.attachments.length===0)return;let s=t.reader(),l=i.sessionId;if(s===void 0||l===void 0){Le(i,e.attachments.map(a=>a.path).join(`
`));return}let c=(i.attachments??[]).map(a=>t.pathOf(a.file)).filter(a=>a!==""),{accepted:d}=In(e.attachments,c);d.length!==0&&(async()=>{let a=[],u=[],p=0;for(let m of d){let y=await Fr(s,l,m);y.kind==="file"?a.push(y.file):y.kind==="mention"?u.push(y.mention):p+=1}let f=n();u.length>0&&Le(f,u.join(" ")),a.length>0&&f.onAddFiles?.(a),p>0&&r(o("attach.pasteMissing",{count:String(p)})),u.length>0&&r(o("attach.pasteReferenced",{count:String(u.length)}))})()}function Le(e,n){if(n==="")return;let t=e.inputActions,r=t?.captureInsertion?.();t?.insertText===void 0||r===void 0||t.insertText(n,r)}async function Fr(e,n,t){let r=await e.readBytes?.(n,t.path,{});if(r!==void 0&&r.ok)return{kind:"file",file:new File([r.value.data],t.name,{type:t.type})};let o=await e.stat?.(n,t.path);return o!==void 0&&o.ok?{kind:"mention",mention:Wr(t.path)}:{kind:"missing"}}function Br(e){let n=e.querySelector("img")?.parentElement;if(n!=null)return n;let t=e.firstElementChild;return t instanceof HTMLElement?t:null}function Wr(e){return Mr.test(e)?`@"${e}"`:`@${e}`}var Hr="better.focusComposer",Ur=Object.freeze(["focus input","focus composer","message input"]),Q="command.focusComposer",$r=Object.freeze(["page","editable","terminal"]),jr=Object.freeze({"desktop:macos":{code:"Space",modifiers:["primary"]},"desktop:windows":{code:"Space",modifiers:["primary","shift"]},"web:macos":{code:"Space",modifiers:["primary","shift"]},"web:windows":{code:"Space",modifiers:["primary","shift"]}}),zr="[data-composer-input], [role='textbox'][aria-multiline='true']";function Dn(e){return e===void 0||typeof e.querySelector!="function"?!1:e.querySelector(zr)!=null}function Re(e,n){if(e===null||typeof e!="object")return;let t=e.get;if(typeof t=="function"){let r=t.call(e,n);return r===null?void 0:r}return e[n]}var _n=e=>typeof e=="string"&&e!==""?e:void 0;function Fn(e){let t=Re(e,"uiSession")?.adapter?.current?.getSnapshot?.();if(t!==void 0)return _n(t.key);let r=Re(e,"sessions");return _n(r?.list?.getSnapshot?.()?.current)}function Bn(e,n){try{let t=e.sessions?.scope?.(n);if(t===void 0)return!1;let o=Re(t,"conversation")?.input?.for?.(t);return o===void 0||typeof o.focus!="function"?!1:(o.focus(),!0)}catch{return!1}}function qr(e){return(n={})=>{if(n.modal!=null)return{status:"pass"};if(!e.composerMounted())return{status:"pass"};let t=e.currentSessionId();return t===void 0?{status:"pass"}:{status:"handled",run:()=>{e.focusComposer(t)}}}}function Vr(e,n){return{id:Hr,label:n,aliases:Ur,defaults:jr,regions:$r,modals:[],resolve:qr(e)}}function Wn(e,n,t,r){if(e===void 0||typeof e.register!="function")return()=>{};try{return e.register(Vr(n,t))}catch(o){return r?.(o instanceof Error?o.message:String(o)),()=>{}}}var Hn=Object.freeze({zh:{"overlay.aria":"\u9009\u62E9\u6A21\u578B","listbox.aria":"\u6A21\u578B\u5339\u914D\u9879","search.aria":"\u641C\u7D22\u4F9B\u5E94\u5546\u6216\u6A21\u578B","search.placeholder":"\u641C\u7D22\u4F9B\u5E94\u5546\u6216\u6A21\u578B\u2026","status.empty":"\u6CA1\u6709\u53EF\u7528\u7684\u6A21\u578B\u3002","status.applying":"\u6B63\u5728\u5207\u6362\u2026",retry:"\u91CD\u8BD5","trigger.selectAria":"\u9009\u62E9\u6A21\u578B","trigger.aria":"\u5F53\u524D\u6A21\u578B {model}\uFF0C\u70B9\u51FB\u5207\u6362","trigger.ariaEffort":"\u5F53\u524D\u6A21\u578B {model}\uFF0C\u63A8\u7406\u7B49\u7EA7 {effort}\uFF0C\u70B9\u51FB\u5207\u6362","trigger.fallback":"\u9009\u62E9\u6A21\u578B","trigger.loading":"\u52A0\u8F7D\u6A21\u578B\u2026",[Q]:"\u805A\u7126\u8F93\u5165\u6846","attach.copySkipped":"{count} \u4E2A\u9644\u4EF6\u6765\u81EA\u526A\u8D34\u677F\u3001\u6CA1\u6709\u672C\u5730\u8DEF\u5F84\uFF0C\u672A\u590D\u5236","attach.pasteMissing":"{count} \u4E2A\u9644\u4EF6\u5BF9\u5E94\u7684\u6587\u4EF6\u5DF2\u4E0D\u5B58\u5728\uFF0C\u672A\u7C98\u8D34","attach.pasteReferenced":"{count} \u4E2A\u9644\u4EF6\u8D85\u51FA\u5355\u6B21\u8BFB\u53D6\u4E0A\u9650\uFF0C\u5DF2\u6539\u4E3A\u8DEF\u5F84\u5F15\u7528","attach.copyFailed":"\u6D4F\u89C8\u5668\u62D2\u7EDD\u4E86\u8FD9\u6B21\u526A\u8D34\u677F\u5199\u5165","compaction.reading":"\u538B\u7F29 {count} \u6B21","compaction.readingOne":"\u538B\u7F29 1 \u6B21","compaction.tooltip":"\u672C\u4F1A\u8BDD\u4E0A\u4E0B\u6587\u5DF2\u538B\u7F29 {count} \u6B21","compaction.tooltipWithFailures":"\u672C\u4F1A\u8BDD\u4E0A\u4E0B\u6587\u5DF2\u538B\u7F29 {count} \u6B21\uFF0C\u53E6\u6709 {failures} \u6B21\u538B\u7F29\u5931\u8D25","tabs.nav":"Tab \u7BA1\u7406","tabs.heading":"Tab \u7BA1\u7406","tabs.empty":"\u8FD8\u6CA1\u6709\u63D2\u4EF6\u6CE8\u518C\u4F1A\u8BDD\u6807\u7B7E\u3002","tabs.show":"\u5728\u6807\u7B7E\u680F\u663E\u793A{label}","tabs.hide":"\u4ECE\u6807\u7B7E\u680F\u9690\u85CF{label}","alias.nav":"\u6280\u80FD\u522B\u540D","alias.heading":"\u6280\u80FD\u522B\u540D","alias.prefix.title":"\u9700\u8981\u659C\u6760\u524D\u7F00","alias.prefix.on":"\u6253\u5F00\u5219\u9700\u8981\u8F93\u5165 \u201C/\u201D \u8FDB\u884C\u5339\u914D","alias.prefix.off":"\u6253\u5F00\u5219\u65E0\u9700\u8F93\u5165 \u201C/\u201D \u8FDB\u884C\u5339\u914D","alias.table.keyword":"\u5173\u952E\u8BCD","alias.table.target":"\u6280\u80FD\u6216\u547D\u4EE4","alias.table.params":"\u53C2\u6570","alias.table.paramsPlaceholder":"\u53EF\u9009\uFF0C\u5982 run","alias.table.actions":"\u64CD\u4F5C","alias.add":"\u6DFB\u52A0\u522B\u540D","alias.remove":"\u5220\u9664\u522B\u540D {keyword}","alias.unnamed":"\uFF08\u672A\u547D\u540D\uFF09","alias.empty":"\u8FD8\u6CA1\u6709\u522B\u540D\u3002\u4F8B\u5982\uFF1Awf \u2192 /flow-workflow run","alias.footnote":"\u8F93\u5165\u5173\u952E\u8BCD\u540E\u4ECE\u9762\u677F\u9009\u62E9\u5373\u53EF\u63D2\u5165\u5B8C\u6574\u8C03\u7528\uFF1B\u6539\u5B8C\u7ACB\u5373\u751F\u6548\u3002","alias.menu.section":"\u6280\u80FD\u522B\u540D","alias.menu.params":"\u53C2\u6570\uFF1A{value}","skill.metadata":"\u5143\u6570\u636E","skill.path":"\u5730\u5740","skill.usage.session":"\u672C\u4F1A\u8BDD\u8C03\u7528","skill.usage.workspace":"\u672C\u5DE5\u4F5C\u533A\u8C03\u7528","skill.params":"\u53C2\u6570","skill.hint.insert":"\u70B9\u51FB\u63D2\u5165","continue.label":"\u7EE7\u7EED","continue.sending":"\u7EE7\u7EED\u4E2D\u2026"},en:{"overlay.aria":"Select a model","listbox.aria":"Matching models","search.aria":"Search providers or models","search.placeholder":"Search providers or models\u2026","status.empty":"No models available.","status.applying":"Switching\u2026",retry:"Retry","trigger.selectAria":"Select model","trigger.aria":"Current model {model}, click to change","trigger.ariaEffort":"Current model {model}, reasoning effort {effort}, click to change","trigger.fallback":"Select model","trigger.loading":"Loading models\u2026",[Q]:"Focus message input","attach.copySkipped":"{count} attachment(s) came from the clipboard with no local path and were not copied","attach.pasteMissing":"{count} attachment(s) no longer exist and were not pasted","attach.pasteReferenced":"{count} attachment(s) exceed the read limit and became path references","attach.copyFailed":"The browser refused this clipboard write","compaction.reading":"{count} compactions","compaction.readingOne":"1 compaction","compaction.tooltip":"This session's context was compressed {count} time(s)","compaction.tooltipWithFailures":"This session's context was compressed {count} time(s), with {failures} failed attempt(s)","tabs.nav":"Tabs","tabs.heading":"Tabs","tabs.empty":"No plugin has registered a conversation tab yet.","tabs.show":"Show {label} in the tab bar","tabs.hide":"Hide {label} from the tab bar","alias.nav":"Skill aliases","alias.heading":"Skill aliases","alias.prefix.title":"Require a slash prefix","alias.prefix.on":"To open, type \u201C/\u201D to match","alias.prefix.off":"To open, type the keyword without \u201C/\u201D to match","alias.table.keyword":"Keyword","alias.table.target":"Skill or command","alias.table.params":"Arguments","alias.table.paramsPlaceholder":"Optional, e.g. run","alias.table.actions":"Actions","alias.add":"Add alias","alias.remove":"Delete alias {keyword}","alias.unnamed":"(unnamed)","alias.empty":"No aliases yet. For example: wf \u2192 /flow-workflow run","alias.footnote":"Type a keyword and pick from the panel to insert the full invocation; changes apply immediately.","alias.menu.section":"Skill aliases","alias.menu.params":"args: {value}","skill.metadata":"Metadata","skill.path":"Path","skill.usage.session":"This session","skill.usage.workspace":"This workspace","skill.params":"Arguments","skill.hint.insert":"Click to insert","continue.label":"Continue","continue.sending":"Continuing\u2026"}});var Un="dsh-better-effort",Gr=`
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
`;function $n(e){if(e===void 0)return()=>{};if(e.getElementById(Un)!==null)return()=>{};let n=e.createElement("style");return n.id=Un,n.textContent=Gr,e.head.append(n),()=>{n.remove()}}var qn="dsh-better.layout-widths",J=Object.freeze({sidebar:null,rightbar:null});function Vn(e){return typeof e=="number"&&Number.isFinite(e)&&e>0}function le(e){if(e===void 0)return J;let n;try{n=e.getItem(qn)}catch{return J}if(n===null||n==="")return J;let t;try{t=JSON.parse(n)}catch{return J}if(typeof t!="object"||t===null||Array.isArray(t))return J;let r=t;return{sidebar:jn(r.sidebar),rightbar:jn(r.rightbar)}}function Gn(e,n){if(e===void 0)return;let t={};n.sidebar!==null&&(t.sidebar=Math.round(n.sidebar)),n.rightbar!==null&&(t.rightbar=Math.round(n.rightbar));try{e.setItem(qn,JSON.stringify(t))}catch{}}function jn(e){return Vn(e)?Math.round(e):null}function Kn(e){if(typeof e!="string")return J;let n=e.trim().split(/\s+/).filter(t=>t!=="");return{sidebar:zn(n[0]),rightbar:zn(n[2])}}function zn(e){if(e===void 0)return null;let n=/^([0-9]+(?:\.[0-9]+)?)px$/.exec(e);if(n===null)return null;let t=Number(n[1]);return Vn(t)?Math.round(t):null}function Yn(e,n,t=null){return t==="sidebar"?n.sidebar!==null&&n.sidebar!==e.sidebar?{sidebar:n.sidebar}:{}:t==="rightbar"?n.rightbar!==null&&n.rightbar!==e.rightbar?{rightbar:n.rightbar}:{}:n.sidebar!==null&&n.sidebar!==e.sidebar?{sidebar:n.sidebar}:n.rightbar!==null&&n.rightbar!==e.rightbar?{rightbar:n.rightbar}:{}}function Jn(e,n){return{sidebar:n.sidebar??e.sidebar,rightbar:n.rightbar??e.rightbar}}function Xn(e){let n=[];return e.sidebar!==null&&n.push({column:"sidebar",width:e.sidebar}),e.rightbar!==null&&n.push({column:"rightbar",width:e.rightbar}),n}var Kr="[data-shell-bottom]",Yr="[data-side]",Jr='[class*="_sidebarCol"]',Xr='[class*="_rightbarCol"]',Zr=600;function Qr(e){let t=e?.layout?.panels;if(typeof t!="object"||t===null)return;let r=t;if(!(typeof r.setSidebar!="function"&&typeof r.setRightbar!="function"))return r}function et(e,n){let t=Qr(e);if(t===void 0)return!1;let r=!1;for(let{column:o,width:i}of Xn(n)){let s=o==="sidebar"?t.setSidebar:t.setRightbar;if(s!==void 0)try{s.call(t,i),r=!0}catch{}}return r}function Zn(e){return e.querySelector(Kr)?.parentElement??null}function eo(e,n){let t=e.hasAttribute("data-sidebar-collapsed"),r=e.hasAttribute("data-rightbar-collapsed"),o=Kn(n?.getComputedStyle(e).gridTemplateColumns);return{sidebar:t?null:o.sidebar??Qn(e.querySelector(Jr)),rightbar:r?null:o.rightbar??Qn(e.querySelector(Xr))}}function Qn(e){if(e===null)return null;let n=e.getBoundingClientRect().width;return Number.isFinite(n)&&n>0?Math.round(n):null}function nt(e){let{document:n,storage:t}=e,r=null,o=null,i=0,s=!1,l=null,c=()=>n.defaultView,d=()=>(r!==null&&r.isConnected||(r=Zn(n)),r),a=()=>{let g=d();return g===null?null:eo(g,c())},u=g=>{let S=g?.getAttribute("data-side");return S==="sidebar"||S==="rightbar"?S:null},p=g=>{let S=a();if(S===null)return;let E=Yn(g.before,S,g.side);E.sidebar===void 0&&E.rightbar===void 0||Gn(t,Jn(le(t),E))},f=g=>{if(l!==null)return;let S=g.target,E=typeof S?.closest=="function"?S.closest(Yr):null;if(E===null)return;let A=a();A!==null&&(l={side:u(E),before:A})},m=()=>{let g=l;if(l=null,g===null)return;let S=c()?.requestAnimationFrame;if(S===void 0){p(g);return}S.call(c(),()=>p(g))},y=()=>{if(o=null,s)return;let g=Zn(n);if(g!==null){r=g;return}if(i>=Zr)return;i+=1;let S=c()?.requestAnimationFrame;S!==void 0&&(o=S.call(c(),y))};return{attach(){s=!1,i=0;let g=c();return g?.addEventListener("pointerdown",f,!0),g?.addEventListener("pointerup",m,!0),g?.addEventListener("pointercancel",m,!0),y(),()=>{s=!0,l=null,r=null,g?.removeEventListener("pointerdown",f,!0),g?.removeEventListener("pointerup",m,!0),g?.removeEventListener("pointercancel",m,!0),o!==null&&g?.cancelAnimationFrame(o),o=null}}}}var tt="sessionCompaction";var rt="dsh-better-compaction",de="dshBetter_compactionStat",no=`
.${de} {
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

[data-composer-dock]:has([data-workbench-dock="term-dock"]) .${de} {
  margin-left: 12px;
}
`;function ot(e){if(e===void 0)return()=>{};if(e.getElementById(rt)!==null)return()=>{};let n=e.createElement("style");return n.id=rt,n.textContent=no,e.head.append(n),()=>{n.remove()}}var at=require("react/jsx-runtime");function to(e,n){if(e===void 0||n===void 0)return null;let{compactions:t,failures:r}=e;if(!Number.isSafeInteger(t)||t<=0)return null;let o=t===1?n("compaction.readingOne"):n("compaction.reading",{count:t}),i=Number.isSafeInteger(r)&&r>0?n("compaction.tooltipWithFailures",{count:t,failures:r}):n("compaction.tooltip",{count:t});return{text:o,tooltip:i}}function ro(){}function it({useProjection:e,t:n}){let r=to((e??ro)(tt),n);return r===null?null:(0,at.jsx)("span",{className:de,"data-dsh-better":"compaction-stat",title:r.tooltip,children:r.text})}var Ee="conversation.composer.dock",st="better-compaction";var Pe=require("react");var lt="continue",Ae="conversation.chat.turnTail",dt="better-continue";function ut(e){return e.end?.reason?.kind!=="interrupted"?!1:e.latest&&!e.pending}var ct="dsh-better-continue",X="dshBetter_continue",Te="dshBetter_continueError",oo=`
.${X} {
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

.${X}:hover:not(:disabled) {
  background: var(--dsw-alias-interactive-bg-hover);
  color: var(--dsw-alias-label-primary);
  border-color: var(--dsw-alias-border-l1);
}

.${X}:focus-visible {
  outline: 1px solid var(--dsw-alias-border-l1);
  outline-offset: 1px;
}

/* Disabled covers both halves of the pressed state: the request is in flight, so
   the button must not invite a second one, and the dimming is what says so. */
.${X}:disabled {
  cursor: default;
  opacity: 0.6;
}

/* The failure line sits under the button in the same column. It is a sibling
   rather than a wrapper so the button keeps its own alignment. */
.${Te} {
  align-self: flex-end;
  color: var(--dsw-alias-state-business-primary);
  font-size: var(--dsh-content-font-size-secondary, 13px);
  line-height: calc(20px + var(--dsh-content-font-delta-secondary, 0px));
}
`;function pt(e){if(e===void 0)return()=>{};if(e.getElementById(ct)!==null)return()=>{};let n=e.createElement("style");return n.id=ct,n.textContent=oo,e.head.append(n),()=>{n.remove()}}var V=require("react/jsx-runtime");function io(e){return e instanceof Error?e.message:String(e)}function ao(e,n){return e.length>0&&e[e.length-1]===n}function ft(){}function mt({turn:e,sessionId:n,useChat:t,useSession:r,t:o,submitContinue:i}){let s=t??ft,l=r??ft,c=s(S=>S),d=l(S=>S),[a,u]=(0,Pe.useState)(!1),[p,f]=(0,Pe.useState)(null),m=e!==void 0&&ao(c?.timeline.turnOrder??[],e.turn),y=(d?.pendingSubmissions?.length??0)>0;return e===void 0||n===void 0||i===void 0||o===void 0||!ut({end:e.end?.data,latest:m,pending:y})?null:(0,V.jsxs)(V.Fragment,{children:[(0,V.jsx)("button",{type:"button",className:X,"data-testid":"better-continue",disabled:a,onClick:()=>{u(!0),f(null),i(n).catch(S=>{u(!1),f(io(S))})},children:o(a?"continue.sending":"continue.label")}),p===null?null:(0,V.jsx)("span",{className:Te,role:"alert",children:p})]})}function so(e){return typeof e=="object"&&e!==null&&"ok"in e&&e.ok===!1}async function gt(e,n){let t=e.sessions?.binding?.(n)?.session,r=t?.prompt;if(typeof r!="function")throw new Error("\u8FD9\u4E2A\u5BBF\u4E3B\u7684\u4F1A\u8BDD\u4E0D\u652F\u6301\u53D1\u9001\u6D88\u606F");let o=await r.call(t,[{type:"text",text:lt}],"queue");if(so(o))throw new Error("\u7EE7\u7EED\u6D88\u606F\u6CA1\u6709\u88AB\u5BBF\u4E3B\u63A5\u53D7")}var ee=require("react");function lo(e){let n=e.name.trim();return n===""?e.id:n}function yt(e,n){if(e===void 0)return n;let t=lo(e.group),r=e.model.name.trim();return r===""?t:`${t} ${r}`}var j=require("react/jsx-runtime"),uo="@deepseek-ai/dsh-client-ui-model-selection/ModelSelect.module.css";function co(e){if(e===void 0)return;let t=e.querySelector(`style[data-plugin-css="${uo}"]`)?.textContent??"",r=i=>new RegExp(`\\.(\\w+_${i})\\{`,"u").exec(t)?.[1],o={root:r("root"),trigger:r("trigger"),triggerIcon:r("triggerIcon"),triggerLabel:r("triggerLabel"),triggerEffort:r("triggerEffort"),chevron:r("chevron")};for(let i of Object.values(o))if(i===void 0)return;return o}function ht(e){let n=se(e.load),t=co(e.document);function r(o){let i=e.native();return o.available===!1||i===void 0||t===void 0?i===void 0?null:(0,j.jsx)(i,{...o}):(0,j.jsx)(po,{props:o,primitives:n,openPicker:e.openPicker,translate:e.translate,classes:t})}return r}function po({props:e,primitives:n,openPicker:t,translate:r,classes:o}){let{directory:i,t:s,sessionId:l,locked:c}=e,d=fo(i),a=s??r(),u=d?.current??null,p=u===null&&d?.status==="loading",f=mo(d,u),m=p?a?.("trigger.loading")??"":yt(f,a?.("trigger.fallback")??""),y=go(d,u,f,a),g=y===void 0?m:`${m} \xB7 ${y}`,S=p?a?.("trigger.loading")??"":u===null?a?.("trigger.selectAria")??"":y===void 0?a?.("trigger.aria",{model:m})??"":a?.("trigger.ariaEffort",{model:m,effort:y})??"",E=()=>{t(l)},A=n.IconDataOutlineRegular,I=n.IconChevronDownOutlineRegular;return(0,j.jsx)("div",{className:o.root,"data-dsh-better-seat":"",children:(0,j.jsxs)("button",{type:"button",className:o.trigger,"aria-label":S,"aria-haspopup":"dialog","aria-expanded":"false",title:g,disabled:c,onClick:E,children:[A===void 0?null:(0,j.jsx)(A,{className:o.triggerIcon,size:16}),(0,j.jsx)("span",{className:o.triggerLabel,"data-provider-id":u?.provider,"data-model-id":u?.model,children:m}),y!==void 0&&(0,j.jsx)("span",{className:o.triggerEffort,children:y}),I===void 0?null:(0,j.jsx)(I,{className:o.chevron})]})})}function fo(e){let n=(0,ee.useCallback)(r=>e===void 0?()=>{}:e.subscribe(r),[e]),t=(0,ee.useCallback)(()=>e?.getSnapshot(),[e]);return(0,ee.useSyncExternalStore)(n,t)}function mo(e,n){if(!(e===void 0||n===null||n===void 0)){for(let t of e.groups)if(t.id===n.provider){for(let r of t.models)if(r.id===n.model)return{group:t,model:r}}}}function go(e,n,t,r){if(e===void 0||n===null||n===void 0)return;let o=t?.model.reasoning,i=n.reasoningEffort??o?.defaultEffort;return t===void 0?e.retainedEffort:o===void 0||i===void 0?void 0:o.efforts?.find(l=>l.id===i)?.name??i}function bt(e){let r=e?.live?.contributions?.get("model")?.ui;return r==null?void 0:r.kind==="popupSelect"?r:void 0}function kt(e){return{sessionId:e}}function St(){return{via:"enter",token:""}}var yo=`
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
`,wt="dsh-better/tabs.css";function vt(e){let n=`style[data-plugin-css=${JSON.stringify(wt)}]`;if(e.querySelector(n)!==null)return()=>{};let t=e.createElement("style");return t.dataset.plugin="dsh-better",t.dataset.pluginCss=wt,t.textContent=yo,e.head.append(t),()=>t.remove()}function xt(e){let n;return e.React.createElement("section",{"data-dsh-better-tabs":"",ref:t=>{if(n?.(),n=void 0,t===null)return;let r=()=>{ho(t,e)};r(),n=e.controller.subscribe(r)}})}function ho(e,n){let t=e.ownerDocument,{controller:r,copy:o}=n;e.replaceChildren();let i=t.createElement("h2");i.setAttribute("data-dsh-better-tabs-heading",""),i.textContent=o.heading,e.append(i);let s=r.rows();if(s.length===0){let l=t.createElement("p");l.setAttribute("data-dsh-better-tabs-empty",""),l.textContent=o.empty,e.append(l);return}for(let l of s){let c=t.createElement("label");c.setAttribute("data-dsh-better-tabs-row",l.id);let d=t.createElement("span");d.setAttribute("data-dsh-better-tabs-name",""),d.textContent=l.label;let a=t.createElement("input");a.setAttribute("data-dsh-better-tabs-check",l.id),a.type="checkbox",a.checked=l.enabled,a.setAttribute("aria-label",o.checkboxLabel(l.label,l.enabled)),a.addEventListener("change",()=>{r.setEnabled(l.id,a.checked)}),c.append(d,a),e.append(c)}}var Oe="conversation.view",Ie="settings.section",Lt="tabs";var ce="chat",Rt="dsh-better.tabs",ne="[data-conversation-tabs]";function Et(e,n){if(typeof e=="string"&&e!=="")return e;if(typeof e=="function")try{let t=e();if(typeof t=="string"&&t!=="")return t}catch{}return n}function bo(e){if(e===void 0)return new Set;let n;try{n=e.getItem(Rt)}catch{return new Set}if(n===null||n==="")return new Set;try{let t=JSON.parse(n);if(!Array.isArray(t))return new Set;let r=new Set;for(let o of t)typeof o=="string"&&o!==""&&o!==ce&&r.add(o);return r}catch{return new Set}}function ko(e,n){if(e!==void 0)try{e.setItem(Rt,JSON.stringify([...n].sort()))}catch{}}function So(e,n){let t=[],r=new Set;for(let o of e){let i=o.options.id;i===void 0||i===ce||r.has(i)||(r.add(i),t.push({id:i,label:Et(o.options.label,i),enabled:!n.has(i)}))}return t}function wo(e){let n=[],t=new Set;for(let r of e){let o=r.options.id;o===void 0||o===ce||t.has(o)||(t.add(o),n.push({id:o,label:Et(r.options.label,o)}))}return n}function vo(e,n,t){let r=new Set;for(let o of wo(e)){if(!n.has(o.id)||o.label==="")continue;t.filter(s=>s.label===o.label).length===1&&r.add(o.label)}return t.map(o=>r.has(o.label))}function xo(e,n){for(let t of e)if(n!==null&&(t.target===n||n.contains?.(t.target)===!0)||Ct(t.addedNodes,n)||Ct(t.removedNodes,n))return!0;return!1}function Ct(e,n){if(e===void 0)return!1;for(let t=0;t<e.length;t+=1){let r=e[t];if(r!==void 0&&(r.matches?.(ne)===!0||r.querySelector?.(ne)!=null||n!==null&&r.contains?.(n)===!0))return!0}return!1}function Co(e){let n=e.querySelector(ne);if(n===null||typeof n!="object")return;let r=n.querySelectorAll?.(":scope > button[role='tab']");if(r===void 0)return;let o=[];for(let i=0;i<r.length;i+=1){let s=r[i];s!==void 0&&o.push({label:Lo(s),hidden:s.hasAttribute(ue),mark:l=>{l?s.setAttribute(ue,""):s.removeAttribute(ue)}})}return o}function Lo(e){return(e.querySelector?.("[class*='tabLabel']")?.textContent??e.textContent??"").trim()}function Ro(e,n){let t=!1;for(let[r,o]of e.entries()){let i=n[r]??!1;i!==o.hidden&&(o.mark(i),t=!0)}return t}function At(e){let{ledger:n,storage:t}=e,r=e.readButtons??Co,o=e.watch??To,i=new Set(bo(t)),s=new Set,l,c=()=>{for(let a of[...s])a()},d=30;return{rows:()=>So(n.entriesOfSlot(Oe),i),setEnabled(a,u){if(a===ce)return!1;let p=i.has(a);return u===!p?!1:(u?i.delete(a):i.add(a),ko(t,i),l?.(),c(),!0)},subscribe(a){return s.add(a),()=>{s.delete(a)}},attach(a){let u=a.createElement("style");u.dataset.plugin="dsh-better",u.dataset.pluginCss=Eo,u.textContent=Ao,a.head.append(u);let p=a.defaultView?.requestAnimationFrame?.bind(a.defaultView),f=a.defaultView?.cancelAnimationFrame?.bind(a.defaultView),m=p===void 0?0:d,y,g=()=>{let A=n.entriesOfSlot(Oe),I=r(a);if(I===void 0||I.length===0){m>0&&p!==void 0&&(m-=1,y=p(()=>g()));return}m=d,y=void 0,Ro(I,vo(A,i,I))},S=n.subscribe(Oe,g),E=o(a,g);return l=g,g(),()=>{S(),E(),l=void 0,y!==void 0&&f?.(y),u.remove()}}}}var Eo="dsh-better/strip.css",ue="data-dsh-better-tab-hidden",Ao=`${ne} > button[${ue}] { display: none; }`;function To(e,n){let t=e.defaultView?.MutationObserver,r=e.documentElement;if(t===void 0||r===void 0)return()=>{};let o=new t(i=>{let s=e.querySelector(ne);xo(i,s!==null&&typeof s=="object"?s:null)&&n()});return o.observe(r,{childList:!0,subtree:!0}),()=>o.disconnect()}var G="conversation.input.overlay",Tt="settings.section",No="aliases",Mo=56,_o="alias-watcher",Ot=50,Do="skill-enhancer",Fo=Ot+1,Ne="conversation.input.model",Me="conversation.input.attachments",Bo=-50,Wo=-60,It="command-popup",Ho=-100,_="better",Uo="/better/api/skill-profile",$o=5e3,pe=null;function Nt(e,n){let t,r=Number.POSITIVE_INFINITY;for(let o of e){if(o.options.id!==It)continue;let i=o.component;if(typeof i!="function"||n!==void 0&&i===n)continue;let s=o.options.priority??0;s<r&&(t=i,r=s)}return t}var Mt={name:"dsh-better",inject:["slots","sessions","commandUi","conversation","locale","modelDirectories","remote","remote.session"],apply(e){let n=globalThis.document;e.effect(()=>e.locale.register(_,Hn),"dsh-better: locale"),e.effect(()=>$n(n),"dsh-better: effort badge stylesheet"),e.effect(()=>ot(n),"dsh-better: compaction count stylesheet"),e.effect(()=>pt(n),"dsh-better: continue button stylesheet");let t=We(De()),r=Zo(e),o={open:!1};e.effect(()=>{let d=De(),a=le(d);e.inject?.(["layout"],f=>{et(f,a)});let p=(n===void 0?void 0:nt({document:n,storage:d}))?.attach();return()=>{p?.()}},"dsh-better: panel width memory"),e.effect(()=>e.slots.inject(Ee,()=>e.slots.register({name:Ee,id:st,order:-1,locale:_},it)),"dsh-better: compaction count"),e.effect(()=>e.slots.inject(Ae,()=>_e(e.slots,{name:Ae,id:dt,order:20,locale:_,inject:()=>({submitContinue:d=>gt(e,d)})},mt)),"dsh-better: continue button"),e.effect(()=>e.slots.inject(G,()=>{let d={},u=En({load:pe,native:()=>Nt(e.slots.entries(G),d.component),document:n});return d.component=u,e.slots.register({name:G,id:It,priority:Ho,locale:_,inject:p=>{let f=Vo(e,p);return{popup:qo(e,p),catalog:f?.groups,current:f?.current??null,selectModel:m=>e.modelDirectories?.directoryFor?.(p)?.select?.(m)}}},u)}),"dsh-better: /model provider search"),e.effect(()=>e.slots.inject(Ne,()=>{let d={},u=ht({load:pe,native:()=>Fe(e.slots.entries(Ne),d.component),openPicker:p=>jo(e,p),translate:()=>zo(e),document:n});return d.component=u,e.slots.register({name:Ne,priority:Bo,locale:_,inject:p=>({sessionId:p,available:!0,directory:e.modelDirectories?.directoryFor?.(p)?.store})},u)}),"dsh-better: composer model trigger");let i;e.inject?.(["remote.workspaceFiles"],d=>{i=d["remote.workspaceFiles"],d.effect(()=>()=>{i=void 0},"dsh-better: workspace file reader")}),e.effect(()=>e.slots.inject(Me,()=>{let d={},u=Mn({native:()=>Fe(e.slots.entries(Me),d.component),pathOf:Go,reader:()=>i,translate:()=>e.locale.bind?.(_)});return d.component=u,e.slots.register({name:Me,priority:Wo,locale:_,inject:p=>({sessionId:p})},u)}),"dsh-better: composer attachment selection");let s;e.inject?.(["inputTriggers"],d=>{s=d.inputTriggers,d.effect(()=>()=>{s=void 0},"dsh-better: alias trigger service"),d.effect(()=>d.inputTriggers.registerSource(Ye({config:()=>t.getSnapshot(),translate:r,bareMenuOpen:()=>o.open,routeCommand:(a,u)=>Xo(e,u)})),"dsh-better: alias slash source")}),e.effect(()=>e.slots.inject(G,()=>{let d=en({store:t,bareMenuOpen:o,inputStoreFor:a=>{let u=e.sessions.scope?.(a);if(!(u===void 0||e.conversation===void 0))try{return e.conversation.input?.for?.(u)?.state}catch{return}},controllerFor:a=>{let u=e.sessions.scope?.(a);if(u===void 0)return;let p=fe(e,"inputTriggers")??s;if(p!==void 0)try{return p.sessionOf(u)}catch{return}}});return _e(e.slots,{name:G,id:_o,order:Ot,inject:a=>({sessionId:a})},d)}),"dsh-better: alias selector watcher"),e.effect(()=>fn(n),"dsh-better: skill enhancer stylesheet");let l=Ko(e);e.effect(()=>e.slots.inject(G,()=>{let d=cn({scopeFor:a=>e.sessions.scope?.(a),inputStoreFor:a=>{let u=e.sessions.scope?.(a);if(!(u===void 0||e.conversation===void 0))try{return e.conversation.input?.for?.(u)?.state}catch{return}},actionsFor:a=>{let u=e.sessions.scope?.(a);if(!(u===void 0||e.conversation===void 0))try{return e.conversation.input?.for?.(u)}catch{return}},skillNamesFor:l.names,loadProfile:async(a,u)=>Yo(e,a,u,await l.pathOf(a,u)),loadUsage:(a,u)=>_t(e,a,u),translate:r,document:n});return _e(e.slots,{name:G,id:Do,order:Fo,inject:a=>({sessionId:a})},d)}),"dsh-better: skill enhancer"),e.effect(()=>e.slots.inject(Tt,()=>{let d=n===void 0?void 0:Xe(n),a=Ke({store:t,translate:r}),u=Pt(e.slots,{name:Tt,id:No,order:Mo,label:()=>e.locale.bind?.(_)?.("alias.nav")??"Skill aliases",locale:_},a);return()=>{u(),d?.()}}),"dsh-better: alias settings page");let c=At({ledger:Jo(e.slots),storage:De()});e.effect(()=>e.slots.inject(Ie,()=>{let d=globalThis.document,a=d===void 0?void 0:vt(d),u=Pt(e.slots,{name:Ie,id:Lt,order:55,label:()=>e.locale.bind?.(_)?.("tabs.nav")??"Tabs"},()=>{let p=Qo(pe);return p===null?null:xt({React:p,controller:c,copy:ei(e)})});return()=>{u(),a?.()}}),"dsh-better: tab management"),e.effect(()=>c.attach(n),"dsh-better: tab visibility"),e.inject?.(["shortcuts"],d=>{d.effect(()=>Wn(d.shortcuts,{currentSessionId:()=>Fn(e),composerMounted:()=>Dn(n),focusComposer:a=>Bn(e,a)},()=>e.locale.bind?.(_)?.(Q)??"Focus message input",a=>console.warn(`dsh-better: focus command not registered (${a})`)),"dsh-better: focus composer shortcut")})}};function Fe(e,n){let t,r=Number.POSITIVE_INFINITY;for(let o of e){let i=o.component;if(typeof i!="function"||n!==void 0&&i===n)continue;let s=o.options.priority??0;s<r&&(t=i,r=s)}return t}function jo(e,n){if(n===void 0)return!1;let t=bt(e.commandUi);if(t===void 0)return!1;let r=e.sessions.scope?.(n);if(r===void 0)return!1;let o=e.commandUi.popupFor?.(r);return o===void 0||typeof o.open!="function"?!1:(o.open("model",t,kt(n),St()),!0)}function zo(e){return e.locale?.bind?.(_)}function qo(e,n){let t=e.sessions.scope?.(n);if(t!==void 0)return e.commandUi.popupFor?.(t)}function Vo(e,n){return e.modelDirectories?.directoryFor?.(n)?.store.getSnapshot()}function Go(e){let n=globalThis.__DSH_HOST_PATHS__;if(n?.pathFor===void 0)return"";try{let t=n.pathFor(e);return typeof t=="string"?t:""}catch{return""}}function Pt(e,n,t){return(e.registerUntyped??e.register).call(e,n,t)}function _e(e,n,t){return(e.registerUntyped??e.register).call(e,n,t)}function Ko(e){let n=new Map,t=new Map,r=async o=>{let i=n.get(o);if(i!==void 0)return i;let s=t.get(o);if(s!==void 0&&Date.now()-s<$o)return;let l=fe(e,"remote.skills");if(l!==void 0)try{let c=await l.list({sessionId:o});if(!c.ok){t.set(o,Date.now());return}let d=new Map(c.value.skills.map(a=>[a.name,a]));return n.set(o,d),t.delete(o),d}catch{t.set(o,Date.now());return}};return{names:async o=>new Set((await r(o))?.keys()??[]),pathOf:async(o,i)=>(await r(o))?.get(i)?.path}}async function Yo(e,n,t,r){let o=`?sessionId=${encodeURIComponent(n)}&name=${encodeURIComponent(t)}`+(r===void 0?"":`&path=${encodeURIComponent(r)}`);try{let i=await fetch(`${Uo}${o}`,{headers:{accept:"application/json"}});return i.ok?await i.json():void 0}catch{return}}function _t(e,n,t){let r=e.sessions.list??fe(e,"sessions.list");try{let o=r?.getSnapshot?.(),i=u=>{let f=o?.projectionsBySession?.[u]?.values?.skillUsage;if(typeof f!="object"||f===null)return;let m=f.counts;return typeof m=="object"&&m!==null?m:void 0},s=i(n)?.[t],l=typeof s=="number"&&Number.isFinite(s)?s:0,c=o?.byId?.[n]?.cwd;if(typeof c!="string"||c==="")return{session:l};let d=Object.keys(o?.byId??{}).map(u=>{let p=i(u),f=o?.byId?.[u]?.cwd;return{...typeof f=="string"?{cwd:f}:{},...p===void 0?{}:{usage:p}}}),a=mn(d,c,t);return a===void 0?{session:l}:{session:l,workspace:a}}catch{return{session:0}}}function Jo(e){return{entriesOfSlot:n=>(e.entriesOfSlot??e.entries).call(e,n),subscribe:(n,t)=>e.subscribe?.(n,t)??(()=>{})}}function De(){try{return globalThis.localStorage}catch{return}}function fe(e,n){try{return typeof e.get=="function"?e.get(n):e[n]}catch{return}}function Xo(e,n){let t=n.session?.sessionId;if(t===void 0)return;let r=e.sessions.scope?.(t);if(r===void 0)return;let o=fe(e,"inputTriggers");if(o!==void 0)try{let i=o.sessionOf(r),s=e.conversation?.input?.for?.(r)?.state,l=0,c=()=>{let d=s?.getSnapshot();if(!(d===void 0||d.draft.trim()===""||!d.draft.startsWith("/"))){try{let a=d.draft.trimStart().split(/\s/u)[0]??"";if(!a.startsWith("/")||(i.track?.(a,a.length,{tier:"plain"},d.draftRev),i.onSpace?.()===!0))return;i.dismiss?.()}catch{}l+=1,l<4&&setTimeout(c,25)}};setTimeout(c,0)}catch{}}function Zo(e){return(n,t)=>{try{return e.locale.bind?.(_)?.(n,t)??n}catch{return n}}}function Qo(e){if(e===null)return null;try{let n=e("react");if(typeof n!="object"||n===null)return null;let t=n;return typeof t.createElement=="function"?t:null}catch{return null}}function ei(e){let n=e.locale.bind?.(_),t=(r,o)=>n?.(r)??o;return{heading:t("tabs.heading","Tabs"),empty:t("tabs.empty","No plugin has registered a conversation tab yet."),checkboxLabel:(r,o)=>t(o?"tabs.hide":"tabs.show","{label}").replace("{label}",r)}}function ni(e){pe=e}var ti=Mt;

    // Hand the loader's `require` to the module's `boot` export before the
    // plugin mounts. Read from `module.exports` rather than the default export:
    // esbuild emits named exports there and the plugin object separately, so the
    // default export alone never carries `boot`.
    if (typeof module.exports.boot === "function") module.exports.boot(require);
    return module.exports.default ?? module.exports;
  }
});
