window.__ModuleLoader__.load({
  id: "dsh-better",
  factory: (require) => {
    var module = { exports: {} };
    var exports = module.exports;
"use strict";var de=Object.defineProperty;var nn=Object.getOwnPropertyDescriptor;var rn=Object.getOwnPropertyNames;var on=Object.prototype.hasOwnProperty;var an=(e,t)=>{for(var n in t)de(e,n,{get:t[n],enumerable:!0})},sn=(e,t,n,r)=>{if(t&&typeof t=="object"||typeof t=="function")for(let o of rn(t))!on.call(e,o)&&o!==n&&de(e,o,{get:()=>t[o],enumerable:!(r=nn(t,o))||r.enumerable});return e};var dn=e=>sn(de({},"__esModule",{value:!0}),e);var Zr={};an(Zr,{boot:()=>Jr,clientPlugin:()=>en,default:()=>Xr,findShadowed:()=>Qt,findShadowedSingle:()=>Ce});module.exports=dn(Zr);var Z=require("react");var Le="dsh-better.skill-aliases";var z=Object.freeze({prefix:!0,rows:Object.freeze([])});function ln(e,t){if(e!==void 0)try{e.setItem(Le,JSON.stringify({v:1,prefix:t.prefix,rows:t.rows}))}catch{}}function X(e,t){return typeof e=="string"?e:t}function un(e,t){if(typeof e!="object"||e===null||Array.isArray(e))return;let n=e;if(!(typeof n.keyword!="string"&&typeof n.target!="string"&&typeof n.params!="string"))return{id:X(n.id,`alias-${t}`)||`alias-${t}`,keyword:X(n.keyword,""),target:X(n.target,""),params:X(n.params,"")}}function cn(e){if(typeof e!="object"||e===null||Array.isArray(e))return z;let t=e,n=typeof t.prefix=="boolean"?t.prefix:z.prefix,r=Array.isArray(t.rows)?t.rows:[],o=[],i=new Set;for(let[a,l]of r.slice(0,200).entries()){let d=un(l,a);if(d===void 0)continue;let u=d.id,s=0;for(;i.has(u);)s+=1,u=`alias-${a}-${s}`;i.add(u),o.push({...d,id:u})}return{prefix:n,rows:o}}function pn(e){if(e===void 0)return z;let t;try{t=e.getItem(Le)}catch{return z}if(t===null||t==="")return z;try{return cn(JSON.parse(t))}catch{return z}}function fn(){let e=globalThis.crypto;return e?.randomUUID!==void 0?e.randomUUID():`alias-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,8)}`}function Ee(e,t=fn){let n=pn(e),r=new Set,o=i=>{n=i;for(let a of[...r])try{a()}catch(l){console.error("[dsh-better] alias store listener failed:",l)}ln(e,i)};return{getSnapshot:()=>n,subscribe(i){return r.add(i),()=>{r.delete(i)}},setPrefix(i){n.prefix!==i&&o({...n,prefix:i})},addRow(){let i=t();return o({...n,rows:[...n.rows,{id:i,keyword:"",target:"",params:""}]}),i},updateRow(i,a){let l=!1,d=n.rows.map(u=>{if(u.id!==i)return u;let s={...u,...a,id:u.id};return l=s.keyword!==u.keyword||s.target!==u.target||s.params!==u.params,s});l&&o({...n,rows:d})},removeRow(i){let a=n.rows.filter(l=>l.id!==i);a.length!==n.rows.length&&o({...n,rows:a})}}}function Te(e){return e.keyword.trim()!==""&&e.target.trim()!==""}function Pe(e){return e.keyword.trim().replace(/^\/+/,"").toLowerCase()}function Oe(e,t){let n=t.trim().replace(/^\/+/,"").toLowerCase();return n===""?[]:e.rows.filter(r=>Te(r)&&Pe(r)===n)}function Ie(e,t,n=!1){let r=t.trim().replace(/^\/+/,"").toLowerCase(),o=e.rows.filter(Te);if(r==="")return n?o:[];let i=[],a=[],l=[];for(let d of o){let u=Pe(d);u===r?i.push(d):u.startsWith(r)?a.push(d):u.includes(r)&&l.push(d)}return[...i,...a,...l]}function Ne(e){let t=e.target.trim().replace(/^\/+/,"");if(t==="")return"";let n=e.params.trim();return n===""?`/${t} `:`/${t} ${n} `}function Me(e,t){let n=/^\/([^\s/]+)([ \t]*)$/u.exec(t);if(n===null)return;let r=n[1]??"",o=Oe(e,r);if(o.length!==0)return{query:r,start:0,end:t.length,rows:o}}function De(e,t){let n=/^([^\s/]+)([ \t]*)$/u.exec(t);if(n===null)return;let r=n[1]??"",o=Oe(e,r);if(o.length!==0)return{query:r,start:0,end:t.length,rows:o}}function _e(e){if(e.keyword.trim()==="")return"keyword";if(e.target.trim()==="")return"target";if(/\s/.test(e.keyword.trim()))return"keyword"}var S=require("react/jsx-runtime");function gn(e){return e?"/wf ":"wf "}function mn(e){let{row:t,store:n,t:r}=e,o=_e(t);return(0,S.jsxs)("tr",{"data-testid":"alias-row","data-row-id":t.id,"data-incomplete":o===void 0?void 0:"",children:[(0,S.jsx)("td",{children:(0,S.jsx)("input",{className:"dsh-better-alias-input","data-testid":"alias-keyword",value:t.keyword,placeholder:"wf",spellCheck:!1,autoComplete:"off","aria-label":r("alias.table.keyword"),ref:i=>{i!==null&&e.focus&&(i.focus(),e.clearFocus())},onChange:i=>n.updateRow(t.id,{keyword:i.target.value})})}),(0,S.jsx)("td",{children:(0,S.jsx)("input",{className:"dsh-better-alias-input","data-testid":"alias-target",value:t.target,placeholder:"flow-workflow",spellCheck:!1,autoComplete:"off","aria-label":r("alias.table.target"),onChange:i=>n.updateRow(t.id,{target:i.target.value})})}),(0,S.jsx)("td",{children:(0,S.jsx)("input",{className:"dsh-better-alias-input","data-testid":"alias-params",value:t.params,placeholder:r("alias.table.paramsPlaceholder"),spellCheck:!1,autoComplete:"off","aria-label":r("alias.table.params"),onChange:i=>n.updateRow(t.id,{params:i.target.value})})}),(0,S.jsx)("td",{className:"dsh-better-alias-actions",children:(0,S.jsx)("button",{type:"button",className:"dsh-better-alias-delete","data-testid":"alias-remove","aria-label":r("alias.remove",{keyword:t.keyword.trim()||r("alias.unnamed")}),title:r("alias.remove",{keyword:t.keyword.trim()||r("alias.unnamed")}),onClick:()=>n.removeRow(t.id),children:"\xD7"})})]})}function Fe(e){function t(){let n=(0,Z.useSyncExternalStore)(e.store.subscribe,e.store.getSnapshot,e.store.getSnapshot),{translate:r}=e,o=(0,Z.useRef)(null),i=()=>{o.current=e.store.addRow()};return(0,S.jsxs)("section",{className:"dsh-better-alias-page","data-testid":"alias-page",children:[(0,S.jsx)("h2",{className:"dsh-better-alias-heading",children:r("alias.heading")}),(0,S.jsxs)("label",{className:"dsh-better-alias-prefix",children:[(0,S.jsxs)("span",{children:[(0,S.jsx)("span",{className:"dsh-better-alias-prefix-title",children:r("alias.prefix.title")}),(0,S.jsx)("span",{className:"dsh-better-alias-prefix-hint",children:r(n.prefix?"alias.prefix.on":"alias.prefix.off",{example:gn(n.prefix)})})]}),(0,S.jsx)("input",{type:"checkbox","data-testid":"alias-prefix",checked:n.prefix,"aria-label":r("alias.prefix.title"),onChange:a=>e.store.setPrefix(a.target.checked)})]}),(0,S.jsxs)("div",{className:"dsh-better-alias-table-wrap",children:[(0,S.jsxs)("table",{className:"dsh-better-alias-table",children:[(0,S.jsx)("thead",{children:(0,S.jsxs)("tr",{children:[(0,S.jsx)("th",{scope:"col",children:r("alias.table.keyword")}),(0,S.jsx)("th",{scope:"col",children:r("alias.table.target")}),(0,S.jsx)("th",{scope:"col",children:r("alias.table.params")}),(0,S.jsx)("th",{scope:"col","aria-label":r("alias.table.actions")})]})}),(0,S.jsx)("tbody",{children:n.rows.map(a=>(0,S.jsx)(mn,{row:a,store:e.store,t:r,focus:o.current===a.id,clearFocus:()=>{o.current=null}},a.id))})]}),n.rows.length===0?(0,S.jsx)("p",{className:"dsh-better-alias-empty","data-testid":"alias-empty",children:r("alias.empty")}):null]}),(0,S.jsx)("button",{type:"button",className:"dsh-better-alias-add","data-testid":"alias-add",onClick:i,children:r("alias.add")}),(0,S.jsx)("p",{className:"dsh-better-alias-footnote",children:r("alias.footnote")})]})}return t}var le="alias",yn="/",hn=-1;function bn(e,t){let n=e.target.trim().replace(/^\/+/,""),r=e.keyword.trim(),o=e.params.trim();return{name:n,label:r,...o===""?{}:{description:t("alias.menu.params",{value:o})},section:t("alias.menu.section"),value:e.id}}function We(e){return{trigger:yn,name:le,order:hn,async candidates(t,n){if(n.position!=="leading")return[];let r=e.config();return!r.prefix&&e.bareMenuOpen?.()!==!0?[]:Ie(r,n.query,!0).map(o=>bn(o,e.translate))},onPick({candidate:t}){let n=e.config().rows.find(o=>o.id===t.value);if(n===void 0)return;let r=Ne(n);return r===""?void 0:{text:r}}}}var Be="dsh-better/aliases.css",Sn=`
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
`;function He(e){let t=`style[data-plugin-css=${JSON.stringify(Be)}]`;if(e.querySelector(t)!==null)return()=>{};let n=e.createElement("style");return n.dataset.plugin="dsh-better",n.dataset.pluginCss=Be,n.textContent=Sn,e.head.append(n),()=>n.remove()}var B=require("react");var je={draft:"",draftRev:-1,phase:"plain"};function ze(e){return function(n){let r=(0,B.useSyncExternalStore)(e.store.subscribe,e.store.getSnapshot,e.store.getSnapshot),o=n.sessionId===void 0?void 0:e.inputStoreFor(n.sessionId),i=n.sessionId===void 0?void 0:e.controllerFor(n.sessionId),a=(0,B.useSyncExternalStore)(d=>o===void 0?()=>{}:o.subscribe(d),()=>o===void 0?je:o.getSnapshot(),()=>o===void 0?je:o.getSnapshot()),l=(0,B.useRef)(null);return(0,B.useEffect)(()=>{let d=n.sessionId;if(d===void 0||a.phase!=="plain"||i===void 0)return;let u=i.menu.getSnapshot().open;if(u&&l.current===null)return;let s=ue(r,a.draft);if(u){let g=l.current;if(g!==null&&(g.draftRev!==a.draftRev||g.spanEnd!==(s?.end??-1))){let p=setTimeout(()=>{let m=o?.getSnapshot()??a,y=e.controllerFor(d);if(y===void 0||m.phase!=="plain")return;l.current=null,y.dismiss();let f=ue(e.store.getSnapshot(),m.draft);f!==void 0&&(e.bareMenuOpen.open=!0,qe(y,f,m.draftRev),e.bareMenuOpen.open=!1,l.current={draftRev:m.draftRev,spanEnd:f.end})},80);return()=>clearTimeout(p)}return}if(l.current=null,s===void 0)return;let c=setTimeout(()=>{let g=o?.getSnapshot()??a,p=e.controllerFor(d);if(p===void 0||g.phase!=="plain"||p.menu.getSnapshot().open)return;let m=ue(e.store.getSnapshot(),g.draft);m!==void 0&&(e.bareMenuOpen.open=!0,qe(p,m,g.draftRev),e.bareMenuOpen.open=!1,l.current={draftRev:g.draftRev,spanEnd:m.end})},80);return()=>clearTimeout(c)},[r,a.draft,a.draftRev,a.phase,i,o,n.sessionId]),null}}function ue(e,t){return e.prefix?Me(e,t):De(e,t)}function qe(e,t,n){e.toggleSource(le,{trigger:"/",query:t.query,quoted:!1,position:"leading",span:{start:t.start,end:t.end,draftRev:n}})}var w=require("react");var wn="@deepseek-ai/dsh-client-ui-commands/PopupSelectView.module.css";function Ge(e){if(e===void 0)return;let n=e.querySelector(`style[data-plugin-css="${wn}"]`)?.textContent??"",r=i=>new RegExp(`\\.(\\w+_${i})\\{`,"u").exec(n)?.[1],o={badges:"dshBetter_badges",badgeChip:"dshBetter_badgeChip",badgeChipOn:"dshBetter_badgeChipOn",card:r("card"),viewport:r("viewport"),row:r("row"),rowActive:r("rowActive"),label:r("label"),labelText:r("labelText"),badge:r("badge"),detail:r("detail"),check:r("check"),status:r("status"),search:r("search"),error:r("error"),errorText:r("errorText"),retry:r("retry")};for(let[i,a]of Object.entries(o))if(!(i==="badges"||i==="badgeChip"||i==="badgeChipOn")&&a===void 0)return;return o}function ce(e,t){for(let n of e)if(n.id===t.provider){for(let r of n.models)if(r.id===t.model)return r.reasoning}}function Ue(e,t){let n=ce(e,t)?.efforts;return n===void 0?[]:[...n]}function Ve(e,t){if(e.length===0)return;let n=r=>r!==void 0&&e.some(o=>o.id===r);return n(t.remembered)?t.remembered:t.isCurrent&&n(t.currentEffort)?t.currentEffort:n(t.defaultEffort)?t.defaultEffort:e[0]?.id}function kn(e){return e.length>1}function $e(e){return kn(e)?e:[]}var N=require("react/jsx-runtime");function Q(e){let t=e.group?.name;if(t===void 0)return;let n=`${t}/`,r=e.id.startsWith(n)?e.id.slice(n.length):e.id;return{provider:t,model:r}}function vn(e,t){let n=Q(e);return $e(n===void 0?[]:Ue(t??[],n))}function Ke({option:e,active:t,catalog:n,pointed:r,classes:o,primitives:i,onChoose:a,onPickEffort:l,onHover:d,t:u}){let s=vn(e,n),c=i.IconCheckOutlineRegular;return(0,N.jsxs)("div",{role:"option","aria-selected":t,"aria-label":e.badge===void 0?void 0:`${e.label} ${e.badge}`,className:t?`${o.row} ${o.rowActive}`:o.row,onClick:a,onMouseEnter:d,children:[(0,N.jsxs)("span",{className:o.label,children:[(0,N.jsx)("span",{className:o.labelText,children:e.label}),e.badge!==void 0&&(0,N.jsx)("sup",{className:o.badge,children:e.badge})]}),e.detail!==void 0&&(0,N.jsx)("span",{className:o.detail,children:e.detail}),s.length>0&&(0,N.jsx)("span",{className:o.badges,role:"group","aria-label":u?.("listbox.aria")??"",children:s.map(g=>(0,N.jsx)("button",{type:"button",className:g.id===r?`${o.badgeChip} ${o.badgeChipOn}`:o.badgeChip,title:g.description??g.name,onClick:p=>{p.stopPropagation(),l(g.id)},children:g.name},g.id))}),e.active===!0&&s.length===0&&(0,N.jsx)("span",{className:o.check,children:c===void 0?null:(0,N.jsx)(c,{})})]})}function ee(e){let t=new Map;for(let n of e){let r=n.group?.name,o=t.get(r);o!==void 0?o.rows.push(n):t.set(r,{group:n.group,rows:[n]})}return[...t.values()]}function te(e){let t=ee(e);return t.some(n=>n.group!==void 0)?t.flatMap(n=>n.rows):[...e]}function Ye(e,t,n){return n===void 0?e.filter(r=>r.label.toLowerCase().includes(t)):ee(e).flatMap(r=>n(r.rows.map(o=>({name:o.label,option:o})),t).map(o=>o.option))}var pe=new WeakSet;async function Je(e,t){let n=e.binding,r=e.state.getSnapshot();if(!(n===null||r.submitting||pe.has(e))){pe.add(e),e.state.set?.({...r,submitting:!0,confirming:null,acknowledged:!1,error:null});try{let o=t();if(o===void 0)return;await o,n!==null&&e.binding===n&&e.deps?.consume?.(n.segment)}finally{pe.delete(e),n!==null&&e.binding===n&&e.dismiss({focusComposer:!0})}}}var xn="@deepseek-ai/dsh-client-ui-primitives";function ne(e){if(e===null)return{};let t;try{t=e(xn)}catch{return{}}if(t===null||typeof t!="object")return{};let n=t,r=y=>typeof y=="function"||typeof y=="object"&&y!==null,o=y=>{let f=n[y];return r(f)?f:void 0},i=y=>{let f=n[y];return typeof f=="function"?f:void 0},a={},l=o("MenuSurface");l!==void 0&&(a.MenuSurface=l);let d=o("MenuGroup");d!==void 0&&(a.MenuGroup=d);let u=o("IconCheckOutlineRegular");u!==void 0&&(a.IconCheckOutlineRegular=u);let s=o("IconDataOutlineRegular");s!==void 0&&(a.IconDataOutlineRegular=s);let c=o("IconChevronDownOutlineRegular");c!==void 0&&(a.IconChevronDownOutlineRegular=c);let g=i("useAnchoredMaxHeight");g!==void 0&&(a.useAnchoredMaxHeight=g);let p=i("observeStickyMenuGroups");p!==void 0&&(a.observeStickyMenuGroups=p);let m=i("rankByName");return m!==void 0&&(a.rankByName=m),a}function Cn(e){if(e===void 0)return[];let t=[e.name,e.label].map(n=>n.trim().toLowerCase()).filter(n=>n!=="");return[...new Set(t)]}function An(e,t){return Cn(e.group).some(n=>n.includes(t))}function Rn(e,t,n,r){return n==="fuzzy-label"?Ye(e,t,r):te(e).filter(o=>o.label.toLowerCase().includes(t)||o.detail?.toLowerCase().includes(t)===!0)}function Xe(e,t,n,r){let o=t.trim().toLowerCase();if(o==="")return te(e);let i=Rn(e,o,n,r),a=new Set(i),l=te(e).filter(d=>!a.has(d)&&An(d,o));return[...i,...l]}var C=require("react/jsx-runtime"),tt="model",Ze=320;function Ln(e){return e.command!==tt||!e.open||e.status!=="ready"||e.confirming!==null||e.options.length===0?!1:e.submitting||e.error===null}var En={subscribe:()=>()=>{},getSnapshot:()=>({open:!1,command:null,status:"pending",options:[],search:"",searchLabels:null,searchMode:"substring",active:0,submitting:!1,confirming:null,acknowledged:!1,error:null})};function nt(e){let t=ne(e.load);function n(r){let o=r.popup,i=o?.state??En,a=(0,w.useCallback)(s=>i.subscribe(s),[i]),l=(0,w.useCallback)(()=>i.getSnapshot(),[i]),d=(0,w.useSyncExternalStore)(a,l),u=e.native();return o===void 0||u===void 0?null:!Ln(d)||o.settle===void 0?(0,C.jsx)(u,{...r}):(0,C.jsx)(Tn,{popup:o,state:d,t:r.t,primitives:t,doc:e.document,catalog:r.catalog,current:r.current,selectModel:r.selectModel})}return n}function Tn({popup:e,state:t,t:n,primitives:r,doc:o,catalog:i,current:a,selectModel:l}){let d=(0,w.useRef)(null),u=(0,w.useRef)(null),s=(0,w.useRef)(null),c=(0,w.useMemo)(()=>Ge(o),[o]),g=t.searchMode,p=(0,w.useMemo)(()=>Xe(t.options,t.search,g,r.rankByName),[t.options,t.search,g,r.rankByName]),m=(0,w.useMemo)(()=>ee(p),[p]),[y,f]=(0,w.useState)({}),[k,A]=(0,w.useState)(()=>Qe(p));(0,w.useEffect)(()=>{A(Qe(p))},[t.search,t.options]);let R=et(p,k),P=Pn(r,d,t);(0,w.useEffect)(()=>{let h=s.current;if(!(h===null||r.observeStickyMenuGroups===void 0))return r.observeStickyMenuGroups(h)},[r.observeStickyMenuGroups,t.open,t.status,m]),(0,w.useEffect)(()=>{d.current?.querySelector('[aria-selected="true"]')?.scrollIntoView({block:"nearest"})},[R,p]),(0,w.useEffect)(()=>{if(!t.open)return;let h=v=>{let L=d.current;L!==null&&v.target instanceof Node&&L.contains(v.target)||e.dismiss()};return o?.addEventListener("pointerdown",h,!0),()=>{o?.removeEventListener("pointerdown",h,!0)}},[o,e,t.open]),(0,w.useEffect)(()=>{u.current?.focus()},[t.open]);let W=(0,w.useCallback)((h,v)=>{if(v===void 0||l===void 0){e.settle?.(e.binding,h);return}let L=Q(h);if(L===void 0){e.settle?.(e.binding,h);return}Je(e,()=>l({...L,reasoningEffort:v}))},[e,l]),H=(0,w.useCallback)(h=>{let v=Q(h);if(v===void 0)return;let L=ce(i??[],v);return Ve(L?.efforts??[],{remembered:y[h.id],isCurrent:a?.provider===v.provider&&a?.model===v.model,currentEffort:a?.reasoningEffort,defaultEffort:L?.defaultEffort})},[i,a,y]),j=(0,w.useCallback)(h=>{W(h,H(h))},[H,W]),J=(0,w.useCallback)((h,v)=>{f(L=>({...L,[h.id]:v})),W(h,v)},[W]),b=(0,w.useCallback)(()=>{let h=p[R];h!==void 0&&j(h)},[R,j,p]),x=(0,w.useCallback)(h=>{p.length!==0&&A(v=>(et(p,v)+h+p.length)%p.length)},[p]),I=h=>{switch(h.key){case"ArrowDown":h.preventDefault(),x(1);return;case"ArrowUp":h.preventDefault(),x(-1);return;case"Enter":h.preventDefault(),b();return;case"Tab":if(!h.shiftKey&&p.length===0)return;h.preventDefault(),h.shiftKey?e.dismiss({focusComposer:!0}):b();return;case"Escape":h.preventDefault(),e.dismiss({focusComposer:!0});return;default:}};if(c===void 0)return null;let _=t.searchLabels?.placeholder??n?.("search.placeholder")??"",M=t.searchLabels===null?n?.("status.empty")??"":t.options.length===0?t.searchLabels.empty:t.searchLabels.noResults,F=(h,v)=>(0,C.jsx)(Ke,{option:h,active:v===R,catalog:i,pointed:v===R?H(h):void 0,classes:c,primitives:r,onChoose:()=>{j(h)},onPickEffort:L=>{J(h,L)},onHover:()=>{A(v)},t:n},h.id),E=0,q=m.map(({group:h,rows:v})=>{let L=v.map(tn=>F(tn,E++));return h===void 0?(0,C.jsx)(w.Fragment,{children:L},"ungrouped"):r.MenuGroup===void 0?(0,C.jsx)(w.Fragment,{children:L},`group:${h.name}`):(0,C.jsx)(r.MenuGroup,{label:h.label,children:L},`group:${h.name}`)}),Ae=(0,C.jsxs)(C.Fragment,{children:[(0,C.jsx)("input",{ref:u,className:c.search,type:"text",placeholder:_,"aria-label":n?.("search.aria")??"",value:t.search,readOnly:t.submitting,onChange:h=>{e.setSearch(h.currentTarget.value)}}),t.submitting&&(0,C.jsx)("div",{className:c.status,children:n?.("status.applying")??""}),!t.submitting&&p.length===0&&(0,C.jsx)("div",{className:c.status,children:M}),p.length>0&&(0,C.jsx)("div",{ref:s,role:"listbox","aria-label":n?.("listbox.aria")??"",className:c.viewport,children:q})]}),Re={className:c.card,style:{maxHeight:P},"aria-label":n?.("overlay.aria")??tt,onKeyDown:I};return r.MenuSurface===void 0?(0,C.jsx)("div",{ref:d,...Re,children:Ae}):(0,C.jsx)(r.MenuSurface,{ref:d,...Re,children:Ae})}function Qe(e){let t=e.findIndex(n=>n.active===!0);return t===-1?0:t}function et(e,t){return e.length===0?0:Math.min(Math.max(t,0),e.length-1)}function Pn(e,t,n){let r=e.useAnchoredMaxHeight;return r===void 0?Ze:r(t,Ze,n)}var O=require("react");var fe="application/x-dsh-composer+json";var On=Object.freeze({png:"image/png",jpg:"image/jpeg",jpeg:"image/jpeg",webp:"image/webp",gif:"image/gif",bmp:"image/bmp",svg:"image/svg+xml",avif:"image/avif",heic:"image/heic",heif:"image/heif",tif:"image/tiff",tiff:"image/tiff"});function rt(e){return JSON.stringify({v:1,text:e.text,attachments:e.attachments.map(t=>({path:t.path,name:t.name,type:t.type,kind:t.kind}))})}function ot(e){if(typeof e!="string"||e==="")return;let t;try{t=JSON.parse(e)}catch{return}if(t===null||typeof t!="object")return;let n=t;if(n.v!==1)return;let r=typeof n.text=="string"?n.text:"",o=Array.isArray(n.attachments)?n.attachments:[],i=[];for(let a of o){if(a===null||typeof a!="object")continue;let l=a,d=l.path;typeof d!="string"||d===""||i.push({path:d,name:typeof l.name=="string"&&l.name!==""?l.name:me(d),type:typeof l.type=="string"?l.type:"",kind:l.kind==="image"?"image":"file"})}return{text:r,attachments:i}}function ge(e,t){if(t.length===0)return e;let n=t.join(`
`);return e===""?n:`${e.replace(/\n+$/u,"")}

${n}`}function it(e){if(e==="")return;let t=e.split(`
`),n=[],r=t.length;for(let i=t.length-1;i>=0;i-=1){let a=t[i]??"";if(a.trim()===""){if(n.length>0){r=i;continue}continue}let l=In(a);if(l===void 0)break;n.unshift(l),r=i}return n.length===0?void 0:{text:t.slice(0,r).join(`
`).replace(/\n+$/u,""),paths:n}}function In(e){let t=e.trim();if(t.startsWith("@")&&(t=t.slice(1)),t.startsWith('"')&&t.endsWith('"')&&t.length>1&&(t=t.slice(1,-1)),t!==""&&Nn(t)&&!/[\u0000-\u001f\u007f]/u.test(t)&&!/["\u2018\u2019\u201c\u201d\u300c\u300d\u300e\u300f\u3002\uff01\uff1f\uff1b\uff1a\uff0c\u3001\u2026*?;<>|&$`!#=]/u.test(t)&&!/(?:^|\s)-{1,2}\S/u.test(t))return t}function Nn(e){return e.startsWith("/")||/^[A-Za-z]:[/\\]/u.test(e)||e.startsWith("\\\\")}function at(e){let t=/\.([A-Za-z0-9]+)$/u.exec(e);if(t!==null)return On[t[1]?.toLowerCase()??""]}function me(e){return e.split(/[\\/]/u).filter(n=>n!=="").at(-1)??e}function st(e,t){let n=new Set(t),r=[],o=[];for(let i of e){if(n.has(i.path)){o.push(i.path);continue}n.add(i.path),r.push(i)}return{accepted:r,duplicates:o}}var G=require("react/jsx-runtime"),Mn="data-dsh-better-attach-item",Dn="data-dsh-better-attach-selected",_n=4500,Fn=new Set(["a","c","x","insert"]),Wn=new Set(["meta","control","shift","alt","altgraph","capslock","os"]),Bn=/\s/u;function lt(e){function t(n){let r=e.native();return r===void 0?null:(0,G.jsx)(Hn,{native:r,props:n,deps:e})}return t}function Hn({native:e,props:t,deps:n}){let r=(0,O.useRef)(null),[o,i]=(0,O.useState)(!1),[a,l]=(0,O.useState)(null),d=(t.attachments??[]).length>0,u=(0,O.useRef)(t);u.current=t;let s=(0,O.useRef)(o);s.current=o;let c=(p,m)=>t.t?.(p,m)??n.translate()?.(p,m)??"",g=(0,O.useRef)(c);return g.current=c,(0,O.useEffect)(()=>{let p=r.current;if(p===null)return;let m=p.querySelector('[role="group"]');if(m!==null)for(let y of Array.from(m.children)){if(!(y instanceof HTMLElement))continue;y.toggleAttribute(Mn,!0);let f=zn(y);f!==null&&f.toggleAttribute(Dn,o)}},[o,t.attachments]),(0,O.useEffect)(()=>{if(a===null)return;let p=globalThis.setTimeout(()=>{l(null)},_n);return()=>{globalThis.clearTimeout(p)}},[a]),(0,O.useEffect)(()=>{let p=r.current;if(p===null)return;let m=p.closest("[data-composer-card]");if(!(m instanceof HTMLElement))return;let y=m.ownerDocument,f=b=>(b instanceof Element?b:b instanceof Node?b.parentElement:null)?.closest("[contenteditable]")??null,k=()=>{s.current&&i(!1)},A=()=>{let b=m.ownerDocument.getSelection();return b!==null&&!b.isCollapsed&&b.toString()!==""},R=b=>b instanceof Node&&m.contains(b),P=b=>{let x=b.key.toLowerCase();if(Wn.has(x))return;let I=b.metaKey||b.ctrlKey;if(I&&!b.altKey&&x==="a"){R(b.target)&&f(b.target)?.getAttribute("contenteditable")==="true"&&i(!0);return}if(I&&!b.altKey&&x==="c"&&s.current&&R(b.target)&&!A()){b.preventDefault(),jn(u.current,n,l,g.current);return}I&&!b.altKey&&Fn.has(x)||k()},W=()=>{k()},H=b=>{let I=u.current.attachments??[],_=b.clipboardData;if(!s.current||I.length===0||_===null)return;let M=[],F=[];for(let E of I){let q=n.pathOf(E.file);if(q===""){F.push(E.file.name);continue}M.push({path:q,name:E.file.name,type:E.file.type,kind:E.kind})}if(M.length>0){let E=_.getData("text/plain");_.setData(fe,rt({text:E,attachments:M})),_.setData("text/plain",ge(E,M.map(q=>q.path)))}F.length>0&&l(g.current("attach.copySkipped",{count:String(F.length)}))},j=b=>{let x=b.clipboardData;if(x===null||f(b.target)===null||Array.from(x.types).includes("Files"))return;let I=()=>u.current,_=ot(x.getData(fe));if(_!==void 0){b.preventDefault(),b.stopPropagation(),k(),dt(_,I,n,l,g.current);return}let M=it(x.getData("text/plain"));M!==void 0&&(b.preventDefault(),b.stopPropagation(),k(),dt({text:M.text,attachments:M.paths.map(F=>{let E=at(F)??"";return{path:F,name:me(F),type:E,kind:E===""?"file":"image"}})},I,n,l,g.current))};y.addEventListener("keydown",P,!0),m.addEventListener("paste",j,!0);let J=b=>{let x=b.relatedTarget;x instanceof Node&&m.contains(x)||k()};return m.addEventListener("focusout",J),y.addEventListener("copy",H),y.addEventListener("pointerdown",W,!0),()=>{y.removeEventListener("keydown",P,!0),y.removeEventListener("copy",H),m.removeEventListener("paste",j,!0),m.removeEventListener("focusout",J),y.removeEventListener("pointerdown",W,!0)}},[n]),(0,G.jsxs)("div",{ref:r,className:d?"dshBetter_railHost":"dshBetter_railHostEmpty",children:[(0,G.jsx)(e,{...t}),a!==null&&(0,G.jsx)("div",{className:"dshBetter_attachNotice",role:"status",children:a})]})}function jn(e,t,n,r){let o=e.attachments??[],i=[],a=0;for(let l of o){let d=t.pathOf(l.file);d===""?a+=1:i.push(d)}i.length>0&&globalThis.navigator?.clipboard?.writeText(ge("",i)).catch(()=>{n(r("attach.copyFailed"))}),a>0&&n(r("attach.copySkipped",{count:String(a)}))}function dt(e,t,n,r,o){let i=t();if(ye(i,e.text),e.attachments.length===0)return;let a=n.reader(),l=i.sessionId;if(a===void 0||l===void 0){ye(i,e.attachments.map(s=>s.path).join(`
`));return}let d=(i.attachments??[]).map(s=>n.pathOf(s.file)).filter(s=>s!==""),{accepted:u}=st(e.attachments,d);u.length!==0&&(async()=>{let s=[],c=[],g=0;for(let m of u){let y=await qn(a,l,m);y.kind==="file"?s.push(y.file):y.kind==="mention"?c.push(y.mention):g+=1}let p=t();c.length>0&&ye(p,c.join(" ")),s.length>0&&p.onAddFiles?.(s),g>0&&r(o("attach.pasteMissing",{count:String(g)})),c.length>0&&r(o("attach.pasteReferenced",{count:String(c.length)}))})()}function ye(e,t){if(t==="")return;let n=e.inputActions,r=n?.captureInsertion?.();n?.insertText===void 0||r===void 0||n.insertText(t,r)}async function qn(e,t,n){let r=await e.readBytes?.(t,n.path,{});if(r!==void 0&&r.ok)return{kind:"file",file:new File([r.value.data],n.name,{type:n.type})};let o=await e.stat?.(t,n.path);return o!==void 0&&o.ok?{kind:"mention",mention:Gn(n.path)}:{kind:"missing"}}function zn(e){let t=e.querySelector("img")?.parentElement;if(t!=null)return t;let n=e.firstElementChild;return n instanceof HTMLElement?n:null}function Gn(e){return Bn.test(e)?`@"${e}"`:`@${e}`}var Un="better.focusComposer",Vn=Object.freeze(["focus input","focus composer","message input"]),V="command.focusComposer",$n=Object.freeze(["page","editable","terminal"]),Kn=Object.freeze({"desktop:macos":{code:"Space",modifiers:["primary"]},"desktop:windows":{code:"Space",modifiers:["primary","shift"]},"web:macos":{code:"Space",modifiers:["primary","shift"]},"web:windows":{code:"Space",modifiers:["primary","shift"]}}),Yn="[data-composer-input], [role='textbox'][aria-multiline='true']";function ct(e){return e===void 0||typeof e.querySelector!="function"?!1:e.querySelector(Yn)!=null}function he(e,t){if(e===null||typeof e!="object")return;let n=e.get;if(typeof n=="function"){let r=n.call(e,t);return r===null?void 0:r}return e[t]}var ut=e=>typeof e=="string"&&e!==""?e:void 0;function pt(e){let n=he(e,"uiSession")?.adapter?.current?.getSnapshot?.();if(n!==void 0)return ut(n.key);let r=he(e,"sessions");return ut(r?.list?.getSnapshot?.()?.current)}function ft(e,t){try{let n=e.sessions?.scope?.(t);if(n===void 0)return!1;let o=he(n,"conversation")?.input?.for?.(n);return o===void 0||typeof o.focus!="function"?!1:(o.focus(),!0)}catch{return!1}}function Jn(e){return(t={})=>{if(t.modal!=null)return{status:"pass"};if(!e.composerMounted())return{status:"pass"};let n=e.currentSessionId();return n===void 0?{status:"pass"}:{status:"handled",run:()=>{e.focusComposer(n)}}}}function Xn(e,t){return{id:Un,label:t,aliases:Vn,defaults:Kn,regions:$n,modals:[],resolve:Jn(e)}}function gt(e,t,n,r){if(e===void 0||typeof e.register!="function")return()=>{};try{return e.register(Xn(t,n))}catch(o){return r?.(o instanceof Error?o.message:String(o)),()=>{}}}var mt=Object.freeze({zh:{"overlay.aria":"\u9009\u62E9\u6A21\u578B","listbox.aria":"\u6A21\u578B\u5339\u914D\u9879","search.aria":"\u641C\u7D22\u4F9B\u5E94\u5546\u6216\u6A21\u578B","search.placeholder":"\u641C\u7D22\u4F9B\u5E94\u5546\u6216\u6A21\u578B\u2026","status.empty":"\u6CA1\u6709\u53EF\u7528\u7684\u6A21\u578B\u3002","status.applying":"\u6B63\u5728\u5207\u6362\u2026",retry:"\u91CD\u8BD5","trigger.selectAria":"\u9009\u62E9\u6A21\u578B","trigger.aria":"\u5F53\u524D\u6A21\u578B {model}\uFF0C\u70B9\u51FB\u5207\u6362","trigger.ariaEffort":"\u5F53\u524D\u6A21\u578B {model}\uFF0C\u63A8\u7406\u7B49\u7EA7 {effort}\uFF0C\u70B9\u51FB\u5207\u6362","trigger.fallback":"\u9009\u62E9\u6A21\u578B","trigger.loading":"\u52A0\u8F7D\u6A21\u578B\u2026",[V]:"\u805A\u7126\u8F93\u5165\u6846","attach.copySkipped":"{count} \u4E2A\u9644\u4EF6\u6765\u81EA\u526A\u8D34\u677F\u3001\u6CA1\u6709\u672C\u5730\u8DEF\u5F84\uFF0C\u672A\u590D\u5236","attach.pasteMissing":"{count} \u4E2A\u9644\u4EF6\u5BF9\u5E94\u7684\u6587\u4EF6\u5DF2\u4E0D\u5B58\u5728\uFF0C\u672A\u7C98\u8D34","attach.pasteReferenced":"{count} \u4E2A\u9644\u4EF6\u8D85\u51FA\u5355\u6B21\u8BFB\u53D6\u4E0A\u9650\uFF0C\u5DF2\u6539\u4E3A\u8DEF\u5F84\u5F15\u7528","attach.copyFailed":"\u6D4F\u89C8\u5668\u62D2\u7EDD\u4E86\u8FD9\u6B21\u526A\u8D34\u677F\u5199\u5165","compaction.reading":"\u538B\u7F29 {count} \u6B21","compaction.readingOne":"\u538B\u7F29 1 \u6B21","compaction.tooltip":"\u672C\u4F1A\u8BDD\u4E0A\u4E0B\u6587\u5DF2\u538B\u7F29 {count} \u6B21","compaction.tooltipWithFailures":"\u672C\u4F1A\u8BDD\u4E0A\u4E0B\u6587\u5DF2\u538B\u7F29 {count} \u6B21\uFF0C\u53E6\u6709 {failures} \u6B21\u538B\u7F29\u5931\u8D25","tabs.nav":"Tab \u7BA1\u7406","tabs.heading":"Tab \u7BA1\u7406","tabs.empty":"\u8FD8\u6CA1\u6709\u63D2\u4EF6\u6CE8\u518C\u4F1A\u8BDD\u6807\u7B7E\u3002","tabs.show":"\u5728\u6807\u7B7E\u680F\u663E\u793A{label}","tabs.hide":"\u4ECE\u6807\u7B7E\u680F\u9690\u85CF{label}","alias.nav":"\u6280\u80FD\u522B\u540D","alias.heading":"\u6280\u80FD\u522B\u540D","alias.prefix.title":"\u9700\u8981\u659C\u6760\u524D\u7F00","alias.prefix.on":"\u8F93\u5165 {example} \u5339\u914D\uFF1B\u4E0E\u539F\u751F\u659C\u6760\u547D\u4EE4\u4E00\u81F4","alias.prefix.off":"\u8F93\u5165 {example} \u5339\u914D\uFF1B\u65E0\u9700\u659C\u6760\uFF0C\u9002\u5408\u77ED\u8BCD\u76F4\u8FBE","alias.table.keyword":"\u5173\u952E\u8BCD","alias.table.target":"\u6280\u80FD\u6216\u547D\u4EE4","alias.table.params":"\u53C2\u6570","alias.table.paramsPlaceholder":"\u53EF\u9009\uFF0C\u5982 run","alias.table.actions":"\u64CD\u4F5C","alias.add":"\u6DFB\u52A0\u522B\u540D","alias.remove":"\u5220\u9664\u522B\u540D {keyword}","alias.unnamed":"\uFF08\u672A\u547D\u540D\uFF09","alias.empty":"\u8FD8\u6CA1\u6709\u522B\u540D\u3002\u4F8B\u5982\uFF1Awf \u2192 /flow-workflow run","alias.footnote":"\u8F93\u5165\u5173\u952E\u8BCD\u540E\u4ECE\u9762\u677F\u9009\u62E9\u5373\u53EF\u63D2\u5165\u5B8C\u6574\u8C03\u7528\uFF1B\u6539\u5B8C\u7ACB\u5373\u751F\u6548\u3002","alias.menu.section":"\u6280\u80FD\u522B\u540D","alias.menu.params":"\u53C2\u6570\uFF1A{value}"},en:{"overlay.aria":"Select a model","listbox.aria":"Matching models","search.aria":"Search providers or models","search.placeholder":"Search providers or models\u2026","status.empty":"No models available.","status.applying":"Switching\u2026",retry:"Retry","trigger.selectAria":"Select model","trigger.aria":"Current model {model}, click to change","trigger.ariaEffort":"Current model {model}, reasoning effort {effort}, click to change","trigger.fallback":"Select model","trigger.loading":"Loading models\u2026",[V]:"Focus message input","attach.copySkipped":"{count} attachment(s) came from the clipboard with no local path and were not copied","attach.pasteMissing":"{count} attachment(s) no longer exist and were not pasted","attach.pasteReferenced":"{count} attachment(s) exceed the read limit and became path references","attach.copyFailed":"The browser refused this clipboard write","compaction.reading":"{count} compactions","compaction.readingOne":"1 compaction","compaction.tooltip":"This session's context was compressed {count} time(s)","compaction.tooltipWithFailures":"This session's context was compressed {count} time(s), with {failures} failed attempt(s)","tabs.nav":"Tabs","tabs.heading":"Tabs","tabs.empty":"No plugin has registered a conversation tab yet.","tabs.show":"Show {label} in the tab bar","tabs.hide":"Hide {label} from the tab bar","alias.nav":"Skill aliases","alias.heading":"Skill aliases","alias.prefix.title":"Require a slash prefix","alias.prefix.on":"Type {example} to match, same as native slash commands","alias.prefix.off":"Type {example} to match without a slash, for short direct words","alias.table.keyword":"Keyword","alias.table.target":"Skill or command","alias.table.params":"Arguments","alias.table.paramsPlaceholder":"Optional, e.g. run","alias.table.actions":"Actions","alias.add":"Add alias","alias.remove":"Delete alias {keyword}","alias.unnamed":"(unnamed)","alias.empty":"No aliases yet. For example: wf \u2192 /flow-workflow run","alias.footnote":"Type a keyword and pick from the panel to insert the full invocation; changes apply immediately.","alias.menu.section":"Skill aliases","alias.menu.params":"args: {value}"}});var yt="dsh-better-effort",Zn=`
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
`;function ht(e){if(e===void 0)return()=>{};if(e.getElementById(yt)!==null)return()=>{};let t=e.createElement("style");return t.id=yt,t.textContent=Zn,e.head.append(t),()=>{t.remove()}}var wt="dsh-better.layout-widths",U=Object.freeze({sidebar:null,rightbar:null});function kt(e){return typeof e=="number"&&Number.isFinite(e)&&e>0}function re(e){if(e===void 0)return U;let t;try{t=e.getItem(wt)}catch{return U}if(t===null||t==="")return U;let n;try{n=JSON.parse(t)}catch{return U}if(typeof n!="object"||n===null||Array.isArray(n))return U;let r=n;return{sidebar:bt(r.sidebar),rightbar:bt(r.rightbar)}}function vt(e,t){if(e===void 0)return;let n={};t.sidebar!==null&&(n.sidebar=Math.round(t.sidebar)),t.rightbar!==null&&(n.rightbar=Math.round(t.rightbar));try{e.setItem(wt,JSON.stringify(n))}catch{}}function bt(e){return kt(e)?Math.round(e):null}function xt(e){if(typeof e!="string")return U;let t=e.trim().split(/\s+/).filter(n=>n!=="");return{sidebar:St(t[0]),rightbar:St(t[2])}}function St(e){if(e===void 0)return null;let t=/^([0-9]+(?:\.[0-9]+)?)px$/.exec(e);if(t===null)return null;let n=Number(t[1]);return kt(n)?Math.round(n):null}function Ct(e,t,n=null){return n==="sidebar"?t.sidebar!==null&&t.sidebar!==e.sidebar?{sidebar:t.sidebar}:{}:n==="rightbar"?t.rightbar!==null&&t.rightbar!==e.rightbar?{rightbar:t.rightbar}:{}:t.sidebar!==null&&t.sidebar!==e.sidebar?{sidebar:t.sidebar}:t.rightbar!==null&&t.rightbar!==e.rightbar?{rightbar:t.rightbar}:{}}function At(e,t){return{sidebar:t.sidebar??e.sidebar,rightbar:t.rightbar??e.rightbar}}function Rt(e){let t=[];return e.sidebar!==null&&t.push({column:"sidebar",width:e.sidebar}),e.rightbar!==null&&t.push({column:"rightbar",width:e.rightbar}),t}var Qn="[data-shell-bottom]",er="[data-side]",tr='[class*="_sidebarCol"]',nr='[class*="_rightbarCol"]',rr=600;function or(e){let n=e?.layout?.panels;if(typeof n!="object"||n===null)return;let r=n;if(!(typeof r.setSidebar!="function"&&typeof r.setRightbar!="function"))return r}function Tt(e,t){let n=or(e);if(n===void 0)return!1;let r=!1;for(let{column:o,width:i}of Rt(t)){let a=o==="sidebar"?n.setSidebar:n.setRightbar;if(a!==void 0)try{a.call(n,i),r=!0}catch{}}return r}function Lt(e){return e.querySelector(Qn)?.parentElement??null}function ir(e,t){let n=e.hasAttribute("data-sidebar-collapsed"),r=e.hasAttribute("data-rightbar-collapsed"),o=xt(t?.getComputedStyle(e).gridTemplateColumns);return{sidebar:n?null:o.sidebar??Et(e.querySelector(tr)),rightbar:r?null:o.rightbar??Et(e.querySelector(nr))}}function Et(e){if(e===null)return null;let t=e.getBoundingClientRect().width;return Number.isFinite(t)&&t>0?Math.round(t):null}function Pt(e){let{document:t,storage:n}=e,r=null,o=null,i=0,a=!1,l=null,d=()=>t.defaultView,u=()=>(r!==null&&r.isConnected||(r=Lt(t)),r),s=()=>{let f=u();return f===null?null:ir(f,d())},c=f=>{let k=f?.getAttribute("data-side");return k==="sidebar"||k==="rightbar"?k:null},g=f=>{let k=s();if(k===null)return;let A=Ct(f.before,k,f.side);A.sidebar===void 0&&A.rightbar===void 0||vt(n,At(re(n),A))},p=f=>{if(l!==null)return;let k=f.target,A=typeof k?.closest=="function"?k.closest(er):null;if(A===null)return;let R=s();R!==null&&(l={side:c(A),before:R})},m=()=>{let f=l;if(l=null,f===null)return;let k=d()?.requestAnimationFrame;if(k===void 0){g(f);return}k.call(d(),()=>g(f))},y=()=>{if(o=null,a)return;let f=Lt(t);if(f!==null){r=f;return}if(i>=rr)return;i+=1;let k=d()?.requestAnimationFrame;k!==void 0&&(o=k.call(d(),y))};return{attach(){a=!1,i=0;let f=d();return f?.addEventListener("pointerdown",p,!0),f?.addEventListener("pointerup",m,!0),f?.addEventListener("pointercancel",m,!0),y(),()=>{a=!0,l=null,r=null,f?.removeEventListener("pointerdown",p,!0),f?.removeEventListener("pointerup",m,!0),f?.removeEventListener("pointercancel",m,!0),o!==null&&f?.cancelAnimationFrame(o),o=null}}}}var Ot="sessionCompaction";var It="dsh-better-compaction",oe="dshBetter_compactionStat",ar=`
.${oe} {
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

[data-composer-dock]:has([data-workbench-dock="term-dock"]) .${oe} {
  margin-left: 12px;
}
`;function Nt(e){if(e===void 0)return()=>{};if(e.getElementById(It)!==null)return()=>{};let t=e.createElement("style");return t.id=It,t.textContent=ar,e.head.append(t),()=>{t.remove()}}var Dt=require("react/jsx-runtime");function sr(e,t){if(e===void 0||t===void 0)return null;let{compactions:n,failures:r}=e;if(!Number.isSafeInteger(n)||n<=0)return null;let o=n===1?t("compaction.readingOne"):t("compaction.reading",{count:n}),i=Number.isSafeInteger(r)&&r>0?t("compaction.tooltipWithFailures",{count:n,failures:r}):t("compaction.tooltip",{count:n});return{text:o,tooltip:i}}function dr(){}function Mt({useProjection:e,t}){let r=sr((e??dr)(Ot),t);return r===null?null:(0,Dt.jsx)("span",{className:oe,"data-dsh-better":"compaction-stat",title:r.tooltip,children:r.text})}var be="conversation.composer.dock",_t="better-compaction";var $=require("react");function lr(e){let t=e.name.trim();return t===""?e.id:t}function Ft(e,t){if(e===void 0)return t;let n=lr(e.group),r=e.model.name.trim();return r===""?n:`${n} ${r}`}var D=require("react/jsx-runtime"),ur="@deepseek-ai/dsh-client-ui-model-selection/ModelSelect.module.css";function cr(e){if(e===void 0)return;let n=e.querySelector(`style[data-plugin-css="${ur}"]`)?.textContent??"",r=i=>new RegExp(`\\.(\\w+_${i})\\{`,"u").exec(n)?.[1],o={root:r("root"),trigger:r("trigger"),triggerIcon:r("triggerIcon"),triggerLabel:r("triggerLabel"),triggerEffort:r("triggerEffort"),chevron:r("chevron")};for(let i of Object.values(o))if(i===void 0)return;return o}function Wt(e){let t=ne(e.load),n=cr(e.document);function r(o){let i=e.native();return o.available===!1||i===void 0||n===void 0?i===void 0?null:(0,D.jsx)(i,{...o}):(0,D.jsx)(pr,{props:o,primitives:t,openPicker:e.openPicker,translate:e.translate,classes:n})}return r}function pr({props:e,primitives:t,openPicker:n,translate:r,classes:o}){let{directory:i,t:a,sessionId:l,locked:d}=e,u=fr(i),s=a??r(),c=u?.current??null,g=c===null&&u?.status==="loading",p=gr(u,c),m=g?s?.("trigger.loading")??"":Ft(p,s?.("trigger.fallback")??""),y=mr(u,c,p,s),f=y===void 0?m:`${m} \xB7 ${y}`,k=g?s?.("trigger.loading")??"":c===null?s?.("trigger.selectAria")??"":y===void 0?s?.("trigger.aria",{model:m})??"":s?.("trigger.ariaEffort",{model:m,effort:y})??"",A=()=>{n(l)},R=t.IconDataOutlineRegular,P=t.IconChevronDownOutlineRegular;return(0,D.jsx)("div",{className:o.root,"data-dsh-better-seat":"",children:(0,D.jsxs)("button",{type:"button",className:o.trigger,"aria-label":k,"aria-haspopup":"dialog","aria-expanded":"false",title:f,disabled:d,onClick:A,children:[R===void 0?null:(0,D.jsx)(R,{className:o.triggerIcon,size:16}),(0,D.jsx)("span",{className:o.triggerLabel,"data-provider-id":c?.provider,"data-model-id":c?.model,children:m}),y!==void 0&&(0,D.jsx)("span",{className:o.triggerEffort,children:y}),P===void 0?null:(0,D.jsx)(P,{className:o.chevron})]})})}function fr(e){let t=(0,$.useCallback)(r=>e===void 0?()=>{}:e.subscribe(r),[e]),n=(0,$.useCallback)(()=>e?.getSnapshot(),[e]);return(0,$.useSyncExternalStore)(t,n)}function gr(e,t){if(!(e===void 0||t===null||t===void 0)){for(let n of e.groups)if(n.id===t.provider){for(let r of n.models)if(r.id===t.model)return{group:n,model:r}}}}function mr(e,t,n,r){if(e===void 0||t===null||t===void 0)return;let o=n?.model.reasoning,i=t.reasoningEffort??o?.defaultEffort;return n===void 0?e.retainedEffort:o===void 0||i===void 0?void 0:o.efforts?.find(l=>l.id===i)?.name??i}function Bt(e){let r=e?.live?.contributions?.get("model")?.ui;return r==null?void 0:r.kind==="popupSelect"?r:void 0}function Ht(e){return{sessionId:e}}function jt(){return{via:"enter",token:""}}var yr=`
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
`,qt="dsh-better/tabs.css";function zt(e){let t=`style[data-plugin-css=${JSON.stringify(qt)}]`;if(e.querySelector(t)!==null)return()=>{};let n=e.createElement("style");return n.dataset.plugin="dsh-better",n.dataset.pluginCss=qt,n.textContent=yr,e.head.append(n),()=>n.remove()}function Gt(e){let t;return e.React.createElement("section",{"data-dsh-better-tabs":"",ref:n=>{if(t?.(),t=void 0,n===null)return;let r=()=>{hr(n,e)};r(),t=e.controller.subscribe(r)}})}function hr(e,t){let n=e.ownerDocument,{controller:r,copy:o}=t;e.replaceChildren();let i=n.createElement("h2");i.setAttribute("data-dsh-better-tabs-heading",""),i.textContent=o.heading,e.append(i);let a=r.rows();if(a.length===0){let l=n.createElement("p");l.setAttribute("data-dsh-better-tabs-empty",""),l.textContent=o.empty,e.append(l);return}for(let l of a){let d=n.createElement("label");d.setAttribute("data-dsh-better-tabs-row",l.id);let u=n.createElement("span");u.setAttribute("data-dsh-better-tabs-name",""),u.textContent=l.label;let s=n.createElement("input");s.setAttribute("data-dsh-better-tabs-check",l.id),s.type="checkbox",s.checked=l.enabled,s.setAttribute("aria-label",o.checkboxLabel(l.label,l.enabled)),s.addEventListener("change",()=>{r.setEnabled(l.id,s.checked)}),d.append(u,s),e.append(d)}}var Se="conversation.view",we="settings.section",Vt="tabs";var ae="chat",$t="dsh-better.tabs",K="[data-conversation-tabs]";function Kt(e,t){if(typeof e=="string"&&e!=="")return e;if(typeof e=="function")try{let n=e();if(typeof n=="string"&&n!=="")return n}catch{}return t}function br(e){if(e===void 0)return new Set;let t;try{t=e.getItem($t)}catch{return new Set}if(t===null||t==="")return new Set;try{let n=JSON.parse(t);if(!Array.isArray(n))return new Set;let r=new Set;for(let o of n)typeof o=="string"&&o!==""&&o!==ae&&r.add(o);return r}catch{return new Set}}function Sr(e,t){if(e!==void 0)try{e.setItem($t,JSON.stringify([...t].sort()))}catch{}}function wr(e,t){let n=[],r=new Set;for(let o of e){let i=o.options.id;i===void 0||i===ae||r.has(i)||(r.add(i),n.push({id:i,label:Kt(o.options.label,i),enabled:!t.has(i)}))}return n}function kr(e){let t=[],n=new Set;for(let r of e){let o=r.options.id;o===void 0||o===ae||n.has(o)||(n.add(o),t.push({id:o,label:Kt(r.options.label,o)}))}return t}function vr(e,t,n){let r=new Set;for(let o of kr(e)){if(!t.has(o.id)||o.label==="")continue;n.filter(a=>a.label===o.label).length===1&&r.add(o.label)}return n.map(o=>r.has(o.label))}function xr(e,t){for(let n of e)if(t!==null&&(n.target===t||t.contains?.(n.target)===!0)||Ut(n.addedNodes,t)||Ut(n.removedNodes,t))return!0;return!1}function Ut(e,t){if(e===void 0)return!1;for(let n=0;n<e.length;n+=1){let r=e[n];if(r!==void 0&&(r.matches?.(K)===!0||r.querySelector?.(K)!=null||t!==null&&r.contains?.(t)===!0))return!0}return!1}function Cr(e){let t=e.querySelector(K);if(t===null||typeof t!="object")return;let r=t.querySelectorAll?.(":scope > button[role='tab']");if(r===void 0)return;let o=[];for(let i=0;i<r.length;i+=1){let a=r[i];a!==void 0&&o.push({label:Ar(a),hidden:a.hasAttribute(ie),mark:l=>{l?a.setAttribute(ie,""):a.removeAttribute(ie)}})}return o}function Ar(e){return(e.querySelector?.("[class*='tabLabel']")?.textContent??e.textContent??"").trim()}function Rr(e,t){let n=!1;for(let[r,o]of e.entries()){let i=t[r]??!1;i!==o.hidden&&(o.mark(i),n=!0)}return n}function Yt(e){let{ledger:t,storage:n}=e,r=e.readButtons??Cr,o=e.watch??Tr,i=new Set(br(n)),a=new Set,l,d=()=>{for(let s of[...a])s()},u=30;return{rows:()=>wr(t.entriesOfSlot(Se),i),setEnabled(s,c){if(s===ae)return!1;let g=i.has(s);return c===!g?!1:(c?i.delete(s):i.add(s),Sr(n,i),l?.(),d(),!0)},subscribe(s){return a.add(s),()=>{a.delete(s)}},attach(s){let c=s.createElement("style");c.dataset.plugin="dsh-better",c.dataset.pluginCss=Lr,c.textContent=Er,s.head.append(c);let g=s.defaultView?.requestAnimationFrame?.bind(s.defaultView),p=s.defaultView?.cancelAnimationFrame?.bind(s.defaultView),m=g===void 0?0:u,y,f=()=>{let R=t.entriesOfSlot(Se),P=r(s);if(P===void 0||P.length===0){m>0&&g!==void 0&&(m-=1,y=g(()=>f()));return}m=u,y=void 0,Rr(P,vr(R,i,P))},k=t.subscribe(Se,f),A=o(s,f);return l=f,f(),()=>{k(),A(),l=void 0,y!==void 0&&p?.(y),c.remove()}}}}var Lr="dsh-better/strip.css",ie="data-dsh-better-tab-hidden",Er=`${K} > button[${ie}] { display: none; }`;function Tr(e,t){let n=e.defaultView?.MutationObserver,r=e.documentElement;if(n===void 0||r===void 0)return()=>{};let o=new n(i=>{let a=e.querySelector(K);xr(i,a!==null&&typeof a=="object"?a:null)&&t()});return o.observe(r,{childList:!0,subtree:!0}),()=>o.disconnect()}var Y="conversation.input.overlay",Jt="settings.section",Ir="aliases",Nr=56,Mr="alias-watcher",Dr=50,ke="conversation.input.model",ve="conversation.input.attachments",_r=-50,Fr=-60,Zt="command-popup",Wr=-100,T="better",se=null;function Qt(e,t){let n,r=Number.POSITIVE_INFINITY;for(let o of e){if(o.options.id!==Zt)continue;let i=o.component;if(typeof i!="function"||t!==void 0&&i===t)continue;let a=o.options.priority??0;a<r&&(n=i,r=a)}return n}var en={name:"dsh-better",inject:["slots","sessions","commandUi","conversation","locale","modelDirectories","remote","remote.session"],apply(e){let t=globalThis.document;e.effect(()=>e.locale.register(T,mt),"dsh-better: locale"),e.effect(()=>ht(t),"dsh-better: effort badge stylesheet"),e.effect(()=>Nt(t),"dsh-better: compaction count stylesheet");let n=Ee(xe()),r=$r(e),o={open:!1};e.effect(()=>{let d=xe(),u=re(d);e.inject?.(["layout"],g=>{Tt(g,u)});let c=(t===void 0?void 0:Pt({document:t,storage:d}))?.attach();return()=>{c?.()}},"dsh-better: panel width memory"),e.effect(()=>e.slots.inject(be,()=>e.slots.register({name:be,id:_t,order:-1,locale:T},Mt)),"dsh-better: compaction count"),e.effect(()=>e.slots.inject(Y,()=>{let d={},s=nt({load:se,native:()=>Qt(e.slots.entries(Y),d.component),document:t});return d.component=s,e.slots.register({name:Y,id:Zt,priority:Wr,locale:T,inject:c=>{let g=qr(e,c);return{popup:jr(e,c),catalog:g?.groups,current:g?.current??null,selectModel:p=>e.modelDirectories?.directoryFor?.(c)?.select?.(p)}}},s)}),"dsh-better: /model provider search"),e.effect(()=>e.slots.inject(ke,()=>{let d={},s=Wt({load:se,native:()=>Ce(e.slots.entries(ke),d.component),openPicker:c=>Br(e,c),translate:()=>Hr(e),document:t});return d.component=s,e.slots.register({name:ke,priority:_r,locale:T,inject:c=>({sessionId:c,available:!0,directory:e.modelDirectories?.directoryFor?.(c)?.store})},s)}),"dsh-better: composer model trigger");let i;e.inject?.(["remote.workspaceFiles"],d=>{i=d["remote.workspaceFiles"],d.effect(()=>()=>{i=void 0},"dsh-better: workspace file reader")}),e.effect(()=>e.slots.inject(ve,()=>{let d={},s=lt({native:()=>Ce(e.slots.entries(ve),d.component),pathOf:zr,reader:()=>i,translate:()=>e.locale.bind?.(T)});return d.component=s,e.slots.register({name:ve,priority:Fr,locale:T,inject:c=>({sessionId:c})},s)}),"dsh-better: composer attachment selection");let a;e.inject?.(["inputTriggers"],d=>{a=d.inputTriggers,d.effect(()=>()=>{a=void 0},"dsh-better: alias trigger service"),d.effect(()=>d.inputTriggers.registerSource(We({config:()=>n.getSnapshot(),translate:r,bareMenuOpen:()=>o.open})),"dsh-better: alias slash source")}),e.effect(()=>e.slots.inject(Y,()=>{let d=ze({store:n,bareMenuOpen:o,inputStoreFor:u=>{let s=e.sessions.scope?.(u);if(!(s===void 0||e.conversation===void 0))try{return e.conversation.input?.for?.(s)?.state}catch{return}},controllerFor:u=>{let s=e.sessions.scope?.(u);if(s===void 0)return;let c=Vr(e,"inputTriggers")??a;if(c!==void 0)try{return c.sessionOf(s)}catch{return}}});return Gr(e.slots,{name:Y,id:Mr,order:Dr,inject:u=>({sessionId:u})},d)}),"dsh-better: alias selector watcher"),e.effect(()=>e.slots.inject(Jt,()=>{let d=t===void 0?void 0:He(t),u=Fe({store:n,translate:r}),s=Xt(e.slots,{name:Jt,id:Ir,order:Nr,label:()=>e.locale.bind?.(T)?.("alias.nav")??"Skill aliases",locale:T},u);return()=>{s(),d?.()}}),"dsh-better: alias settings page");let l=Yt({ledger:Ur(e.slots),storage:xe()});e.effect(()=>e.slots.inject(we,()=>{let d=globalThis.document,u=d===void 0?void 0:zt(d),s=Xt(e.slots,{name:we,id:Vt,order:55,label:()=>e.locale.bind?.(T)?.("tabs.nav")??"Tabs"},()=>{let c=Kr(se);return c===null?null:Gt({React:c,controller:l,copy:Yr(e)})});return()=>{s(),u?.()}}),"dsh-better: tab management"),e.effect(()=>l.attach(t),"dsh-better: tab visibility"),e.inject?.(["shortcuts"],d=>{d.effect(()=>gt(d.shortcuts,{currentSessionId:()=>pt(e),composerMounted:()=>ct(t),focusComposer:u=>ft(e,u)},()=>e.locale.bind?.(T)?.(V)??"Focus message input",u=>console.warn(`dsh-better: focus command not registered (${u})`)),"dsh-better: focus composer shortcut")})}};function Ce(e,t){let n,r=Number.POSITIVE_INFINITY;for(let o of e){let i=o.component;if(typeof i!="function"||t!==void 0&&i===t)continue;let a=o.options.priority??0;a<r&&(n=i,r=a)}return n}function Br(e,t){if(t===void 0)return!1;let n=Bt(e.commandUi);if(n===void 0)return!1;let r=e.sessions.scope?.(t);if(r===void 0)return!1;let o=e.commandUi.popupFor?.(r);return o===void 0||typeof o.open!="function"?!1:(o.open("model",n,Ht(t),jt()),!0)}function Hr(e){return e.locale?.bind?.(T)}function jr(e,t){let n=e.sessions.scope?.(t);if(n!==void 0)return e.commandUi.popupFor?.(n)}function qr(e,t){return e.modelDirectories?.directoryFor?.(t)?.store.getSnapshot()}function zr(e){let t=globalThis.__DSH_HOST_PATHS__;if(t?.pathFor===void 0)return"";try{let n=t.pathFor(e);return typeof n=="string"?n:""}catch{return""}}function Xt(e,t,n){return(e.registerUntyped??e.register).call(e,t,n)}function Gr(e,t,n){return(e.registerUntyped??e.register).call(e,t,n)}function Ur(e){return{entriesOfSlot:t=>(e.entriesOfSlot??e.entries).call(e,t),subscribe:(t,n)=>e.subscribe?.(t,n)??(()=>{})}}function xe(){try{return globalThis.localStorage}catch{return}}function Vr(e,t){try{return typeof e.get=="function"?e.get(t):e[t]}catch{return}}function $r(e){return(t,n)=>{try{return e.locale.bind?.(T)?.(t,n)??t}catch{return t}}}function Kr(e){if(e===null)return null;try{let t=e("react");if(typeof t!="object"||t===null)return null;let n=t;return typeof n.createElement=="function"?n:null}catch{return null}}function Yr(e){let t=e.locale.bind?.(T),n=(r,o)=>t?.(r)??o;return{heading:n("tabs.heading","Tabs"),empty:n("tabs.empty","No plugin has registered a conversation tab yet."),checkboxLabel:(r,o)=>n(o?"tabs.hide":"tabs.show","{label}").replace("{label}",r)}}function Jr(e){se=e}var Xr=en;

    // Hand the loader's `require` to the module's `boot` export before the
    // plugin mounts. Read from `module.exports` rather than the default export:
    // esbuild emits named exports there and the plugin object separately, so the
    // default export alone never carries `boot`.
    if (typeof module.exports.boot === "function") module.exports.boot(require);
    return module.exports.default ?? module.exports;
  }
});
