window.__ModuleLoader__.load({
  id: "dsh-review-map",
  chunk: "client.map.js",
  factory: (require) => {
    var module = { exports: {} };
    var exports = module.exports;
"use strict";var G=Object.defineProperty;var st=Object.getOwnPropertyDescriptor;var it=Object.getOwnPropertyNames;var dt=Object.prototype.hasOwnProperty;var lt=(e,t)=>{for(var r in t)G(e,r,{get:t[r],enumerable:!0})},mt=(e,t,r,a)=>{if(t&&typeof t=="object"||typeof t=="function")for(let n of it(t))!dt.call(e,n)&&n!==r&&G(e,n,{get:()=>t[n],enumerable:!(a=st(t,n))||a.enumerable});return e};var ct=e=>mt(G({},"__esModule",{value:!0}),e);var Ht={};lt(Ht,{createMap:()=>_t,nearestVisibleAncestor:()=>ot,pathSegments:()=>nt});module.exports=ct(Ht);function A(e){return Math.round(e*100)/100}function R(e){return e===null||!Number.isFinite(e)?1:Math.max(e,1)}function pt(e){let t=[];for(let r of e.dirs)t.push({path:r.path,kind:"dir",lines:R(r.lines),weight:R(r.lines)});for(let r of e.files){let a=R(r.lines);t.push({path:r.path,kind:"file",lines:a,weight:a})}return t.sort((r,a)=>r.path<a.path?-1:r.path>a.path?1:0)}function W(e,t,r){if(t<=0||r<=0)return Number.POSITIVE_INFINITY;let a=t/r,n=1;for(let i of e){if(i<=0)continue;let s=i/a,m=Math.max(a/s,s/a);m>n&&(n=m)}return n}function ht(e,t){let r=e.reduce((s,m)=>s+m,0),a=[];if(r<=0)return{rects:e.map(()=>({x:t.x,y:t.y,width:0,height:0})),rest:t};if(t.width>=t.height){let s=Math.min(r/t.height,t.width),m=t.y;for(let c of e){let o=t.height>0?c/r*t.height:0;a.push({x:t.x,y:m,width:s,height:o}),m+=o}return{rects:a,rest:{x:t.x+s,y:t.y,width:t.width-s,height:t.height}}}let n=Math.min(r/t.width,t.height),i=t.x;for(let s of e){let m=t.width>0?s/r*t.width:0;a.push({x:i,y:t.y,width:m,height:n}),i+=m}return{rects:a,rest:{x:t.x,y:t.y+n,width:t.width,height:t.height-n}}}function ut(e,t,r){let a=e.reduce((d,l)=>d+l,0),n=r*r;if(a<=0||t<=0||n<=0)return{weights:[...e],floored:!1};let i=e.filter(d=>t*d/a<n);if(i.length===0)return{weights:[...e],floored:!1};let s=i.length,m=i.reduce((d,l)=>d+l,0),c=t-n*s;if(c<=0)return{weights:[...e],floored:!1};let o=n*(a-m)/c;return!Number.isFinite(o)||o<=0?{weights:[...e],floored:!1}:{weights:e.map(d=>Math.max(d,o)),floored:!0}}function X(e,t){let r=Number.isFinite(t.width)?Math.max(t.width,0):0,a=Number.isFinite(t.height)?Math.max(t.height,0):0,n=t.minSide!==void 0&&t.minSide>0?t.minSide:4,i=pt(e);if(i.length===0)return{tiles:[]};if(r<=0||a<=0)return{tiles:i.map(v=>({path:v.path,kind:v.kind,lines:v.lines,x:0,y:0,width:0,height:0}))};let s=r*a,c=ut(i.map(v=>v.weight),s,n).weights,o=c.reduce((v,L)=>v+L,0),d=o>0?s/o:0,l=c.map(v=>v*d),f=[],p={x:0,y:0,width:r,height:a},y=0;for(;y<l.length;){let v=Math.min(p.width,p.height),L=l[y]??0,w=y+1,E=L,_=W([L],E,v);for(;w<l.length;){let g=l[w]??0,u=E+g,x=W(l.slice(y,w+1),u,v);if(x>_)break;_=x,E=u,w+=1}if(w>=l.length){let g=l.slice(y,w),u=g.reduce((x,S)=>x+S,0);if(p.width>=p.height){let x=p.y;for(let S of g){let M=u>0?S/u:1/g.length,H=p.height*M;f.push({x:p.x,y:x,width:p.width,height:H}),x+=H}}else{let x=p.x;for(let S of g){let M=u>0?S/u:1/g.length,H=p.width*M;f.push({x,y:p.y,width:H,height:p.height}),x+=H}}p={x:p.x,y:p.y,width:0,height:0},y=w;continue}let h=ht(l.slice(y,w),p);f.push(...h.rects),p=h.rest,y=w}return{tiles:i.map((v,L)=>{let w=f[L]??{x:0,y:0,width:0,height:0},E=A(w.x),_=A(w.y);return{path:v.path,kind:v.kind,lines:v.lines,x:E,y:_,width:A(A(w.x+w.width)-E),height:A(A(w.y+w.height)-_)}})}}var O="http://www.w3.org/2000/svg";var gt={added:"+",modified:"~",deleted:"\xD7",renamed:"\u2192",copied:"\u29C9","type-changed":"\u21C4",untracked:"?",conflicted:"!",unknown:"\xB7"},ft={added:"solid",modified:"dash-dot",deleted:"dashed",renamed:"double",copied:"double-dot","type-changed":"dotted",untracked:"sparse",conflicted:"hatched",unknown:"none"};function yt(e){return e.changed?e.status??"modified":null}function wt(e){return gt[e]}function F(e){return ft[e]}function bt(e){if(!e.changed)return null;if(e.binary===!0)return"bin";if(e.status==="conflicted")return"conflict";if(e.status==="untracked")return"new";let t=e.additions??null,r=e.deletions??null;if(t===null&&r===null)return null;let a=[];return t!==null&&a.push(`+${String(t)}`),r!==null&&a.push(`\u2212${String(r)}`),a.join(" ")}function N(e){let t=e.lastIndexOf("/");return t<0?e:e.slice(t+1)}function xt(e,t){let r=e.hunks??[];if(r.length===0)return[];let a=t!==null&&t>0?t:null;if(a===null)return[{kind:"add",start:0,width:1}];let n=[];for(let i of r){let s=Math.min(Math.max((i.newStart-1)/a,0),1),m=i.newLines>0?i.newLines/a:0,c=Math.min(Math.max(m,i.newLines>0?.01:.02),1-s);n.push({kind:i.newLines>0?"add":"del",start:s,width:Math.max(c,.01)})}return n}function k(e,t,r){let a=e.createElementNS(O,t);for(let[n,i]of Object.entries(r))a.setAttribute(n,i);return a}function T(e,t,r){let a=k(e,"text",t);return a.textContent=r,a}function q(e,t,r){let{document:a}=e,n=k(a,"g",{"data-rm":"map-tile","data-kind":"dir","data-path":t.path,"data-lines":String(t.lines),"data-changed":r.changed?"true":"false"});if(n.append(k(a,"rect",{x:String(t.x),y:String(t.y),width:String(t.width),height:String(t.height),"data-rm":"map-tile-rect","data-changed":r.changed?"true":"false"})),t.width>=34&&t.height>=18){let i=N(t.path)===""?t.path:N(t.path);n.append(T(a,{x:String(t.x+4),y:String(t.y+12),"data-rm":"map-dir-name"},i));let s=r.changedFiles??0,m=r.pending===!0,c=m?`${String(t.lines)} lines \xB7 pending`:r.changed?`${String(t.lines)} lines \xB7 ${String(s)} changed \xB7 +${String(r.additions??0)} \u2212${String(r.deletions??0)}`:`${String(t.lines)} lines`;t.height>=36&&n.append(T(a,{x:String(t.x+4),y:String(t.y+24),"data-rm":"map-dir-reading","data-pending":m?"true":"false"},c))}if(e.onDrill!==void 0){let i=e.onDrill;n.addEventListener("click",()=>{i(t.path)})}return n}function K(e,t,r){let{document:a}=e,n=yt(r),i=n==="deleted",s={"data-rm":"map-tile","data-kind":"file","data-path":t.path,"data-lines":String(t.lines),"data-changed":r.changed?"true":"false"};n!==null&&(s["data-status"]=n,s["data-shape"]=F(n)),r.additions!==void 0&&r.additions!==null&&(s["data-additions"]=String(r.additions)),r.deletions!==void 0&&r.deletions!==null&&(s["data-deletions"]=String(r.deletions)),i&&(s["data-deleted"]="true"),r.binary===!0&&(s["data-binary"]="true");let m=k(a,"g",s),c={x:String(t.x),y:String(t.y),width:String(t.width),height:String(t.height),"data-rm":"map-tile-rect","data-changed":r.changed?"true":"false"};if(n!==null&&(c["data-status"]=n,c["data-shape"]=F(n)),i&&(c["data-deleted"]="true"),m.append(k(a,"rect",c)),t.width>=34&&t.height>=18&&r.changed){m.append(T(a,{x:String(t.x+4),y:String(t.y+12),"data-rm":"map-file-name"},N(t.path)));let l=bt(r);l!==null&&t.height>=36&&m.append(T(a,{x:String(t.x+4),y:String(t.y+24),"data-rm":"map-file-churn"},l)),n!==null&&t.width>=34*1.6&&m.append(T(a,{x:String(t.x+t.width-4),y:String(t.y+12),"text-anchor":"end","data-rm":"map-file-mark","data-status":n,"data-shape":F(n)},wt(n)))}let d=r.changed?xt(r,r.lines):[];if(d.length>0&&t.width>=48&&t.height>=18){let l=Math.min(3,Math.max(2,t.height/12)),f=t.y+t.height-l-1,p=t.width-4,y=k(a,"g",{"data-rm":"map-bar","data-path":t.path});for(let I of d)y.append(k(a,"rect",{x:String(t.x+2+I.start*p),y:String(f),width:String(Math.max(I.width*p,.5)),height:String(l),"data-rm":"map-bar-seg","data-kind":I.kind,"data-start":I.start.toFixed(4),"data-width":I.width.toFixed(4)}));m.append(y)}if(e.onOpenFile!==void 0){let l=e.onOpenFile;m.addEventListener("click",()=>{l(t.path)})}if(e.onHover!==void 0){let l=e.onHover;m.addEventListener("pointerenter",()=>{l(t.path)}),m.addEventListener("pointerleave",()=>{l(null)})}return m}function U(e,t,r){let a=k(e,"g",{"data-rm":"map-overflow","data-hidden":String(t)});return a.append(k(e,"rect",{x:String(r.x),y:String(r.y),width:String(r.width),height:String(r.height),"data-rm":"map-overflow-rect"})),r.width>=34&&r.height>=18&&a.append(T(e,{x:String(r.x+4),y:String(r.y+12),"data-rm":"map-overflow-text"},`${String(t)} more files`)),a}function Y(e){if(e.length<=400)return{files:[...e],hidden:0};let r=[...e].sort((a,n)=>{let i=a.lines??0,s=n.lines??0;return i!==s?s-i:a.path<n.path?-1:a.path>n.path?1:0}).slice(0,400).sort((a,n)=>a.path<n.path?-1:a.path>n.path?1:0);return{files:r,hidden:e.length-r.length}}var vt=20,St=12;function P(e){let t=e.lastIndexOf("/");return t<0?"":e.slice(0,t)}function j(e,t,r){let a=e.filter(o=>o.from===t),n=e.filter(o=>o.to===t),i=a.length+n.length;if(i===0)return{edges:[],aggregated:!1,total:0};let s=[...a.map(o=>({from:o.from,to:o.to,flow:"imports",state:o.state,count:1,aggregated:!1})),...n.map(o=>({from:o.from,to:o.to,flow:"imported-by",state:o.state,count:1,aggregated:!1}))];if(i<=vt)return{edges:s,aggregated:!1,total:i};let m=new Map;for(let o of s){let d=o.from===t?t:P(o.from),l=o.to===t?t:P(o.to);if(d===l)continue;let f=`${d}\0${l}\0${o.flow}`,p=m.get(f);p===void 0?m.set(f,{...o,from:d,to:l,count:1,aggregated:d!==o.from||l!==o.to}):m.set(f,{...p,count:p.count+o.count,aggregated:!0})}return{edges:[...m.values()].sort((o,d)=>o.count!==d.count?d.count-o.count:o.from!==d.from?o.from<d.from?-1:1:o.to<d.to?-1:o.to>d.to?1:0).slice(0,St),aggregated:!0,total:i}}function z(e,t){let r={x:e.x+e.width/2,y:e.y+e.height/2},a=t.x-r.x,n=t.y-r.y;if(a===0&&n===0)return r;let i=Math.abs(n/(a===0?Number.EPSILON:a)),s=e.height/(e.width===0?Number.EPSILON:e.width);return i<=s?{x:a>=0?e.x+e.width:e.x,y:r.y}:{x:r.x,y:n>=0?e.y+e.height:e.y}}function Q(e,t,r,a,n){if(t.edges.length===0)return null;let i=k(e,"g",{"data-rm":"map-edges","data-aggregated":t.aggregated?"true":"false"}),s=c=>({x:c.x+c.width/2,y:c.y+c.height/2}),m=c=>{let o=r.get(c);if(o!==void 0)return o;let d=c;for(;;){let l=d.lastIndexOf("/");if(l<0)break;d=d.slice(0,l);let f=r.get(d);if(f!==void 0)return f}return r.get("")??n};for(let c of t.edges){let o=m(c.from),d=m(c.to);if(o===void 0||d===void 0||o===d)continue;let l=z(o,s(d)),f=z(d,s(o)),p=k(e,"path",{d:`M ${String(l.x)} ${String(l.y)} Q ${String((l.x+f.x)/2)} ${String((l.y+f.y)/2-12)} ${String(f.x)} ${String(f.y)}`,"data-rm":"map-edge","data-flow":c.flow,"data-state":c.state,"data-from":c.from,"data-to":c.to,"data-count":String(c.count),"data-aggregated":c.aggregated?"true":"false","data-highlighted-from":a,"marker-end":c.flow==="imports"?"url(#rm-arrow-imports)":"url(#rm-arrow-imported-by)",fill:"none"});i.append(p)}return i.childElementCount===0?null:i}function J(e){let t=k(e,"defs",{});for(let[r,a]of[["rm-arrow-imports",!1],["rm-arrow-imported-by",!0]]){let n=k(e,"marker",{id:r,viewBox:"0 0 8 8",refX:"7",refY:"4",markerWidth:"6",markerHeight:"6",orient:"auto-start-reverse","data-rm":"map-arrow","data-filled":a?"true":"false"});n.append(k(e,"path",{d:a?"M 0 0 L 8 4 L 0 8 z":"M 0 1 L 7 4 L 0 7","data-rm":"map-arrow-head",fill:a?"currentColor":"none",stroke:"currentColor","stroke-width":"1.2"})),t.append(n)}return t}function Z(e,t){let r=k(e,"g",{"data-rm":"map-legend"});return[{key:"imports",label:t.imports,flow:"imports"},{key:"imported-by",label:t.importedBy,flow:"imported-by"},{key:"unresolved",label:t.unresolved,flow:"unresolved"}].forEach((n,i)=>{let s=12+i*13;r.append(k(e,"line",{x1:"8",y1:String(s-3),x2:"26",y2:String(s-3),"data-rm":"map-legend-swatch","data-flow":n.flow})),r.append(T(e,{x:"30",y:String(s),"data-rm":"map-legend-label","data-flow":n.flow},n.label))}),r}function tt(e,t,r,a){return T(e,{x:String(r.x),y:String(r.y),"data-rm":"map-unresolved","data-count":String(t)},a.replace("{count}",String(t)))}function et(e,t,r,a,n){return T(e,{x:String(t.x),y:String(t.y),"data-rm":"map-partial","data-parsed":String(a),"data-total":String(n)},r.replace("{parsed}",String(a)).replace("{total}",String(n)))}var rt="data-rm-map",kt=`/* The directory map's own stylesheet, injected by the chunk that draws it.
   Scoped to the map's data-rm namespace rather than to the tab, because the map
   is mounted into a host the view owns and must not need the tab's wrapper to be
   styled. Colours are host tokens with a hex fallback: the map has to survive a
   host that ships no palette at all. */
[data-rm="map-root"] {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  min-height: 0;
  box-sizing: border-box;
  color: var(--dsw-alias-label-primary, #14110d);
  font-family: var(--dsh-font-sans, ui-sans-serif, system-ui, sans-serif);

  /* The map's own state colours, derived from host tokens so a theme switch
     moves them without a second block of rules. */
  --rm-map-add: var(--dsw-alias-state-success-primary, #1a7f37);
  --rm-map-del: var(--dsw-alias-state-error-primary, #cf222e);
  --rm-map-warn: var(--dsw-alias-state-warning-primary, #bf8700);
  --rm-map-surface: var(--dsw-alias-bg-layer-2, rgba(0, 0, 0, 0.03));
  --rm-map-surface-strong: var(--dsw-alias-bg-layer-3, rgba(0, 0, 0, 0.07));
  --rm-map-border: var(--dsw-alias-border-l2, rgba(0, 0, 0, 0.12));
  --rm-map-muted: var(--dsw-alias-label-tertiary, #a39c91);
  /* The two dependency directions. Blue and green are the requirement's own
     choice; the dash patterns above are what carries the meaning without them. */
  --rm-map-imports: var(--dsw-alias-state-info-primary, #2f6feb);
  --rm-map-imported-by: var(--dsw-alias-state-success-primary, #1a7f37);
  --rm-map-secondary: var(--dsw-alias-label-secondary, #6b655c);
}

/* Breadcrumb: one button per level, root first. */
[data-rm="map-breadcrumb"] {
  flex: none;
  display: flex;
  align-items: center;
  gap: 2px;
  height: 26px;
  overflow: hidden;
  white-space: nowrap;
  font-family: var(--dsh-font-mono, ui-monospace, SFMono-Regular, monospace);
  font-size: max(9px, var(--dsh-code-font-size, 11px));
}

[data-rm="map-crumb"] {
  font: inherit;
  padding: 1px 6px;
  color: var(--rm-map-secondary);
  background: transparent;
  border: 1px solid transparent;
  border-radius: 4px;
  cursor: pointer;
}

[data-rm="map-crumb"]:hover {
  background: var(--rm-map-surface);
}

[data-rm="map-crumb"][data-current="true"] {
  color: var(--dsw-alias-label-primary, #14110d);
  font-weight: 600;
}

/* The crumb that holds a highlighted target the map has not drilled into. */
[data-rm="map-crumb"][data-breadcrumb-target="true"] {
  border-color: var(--rm-map-warn);
  color: var(--dsw-alias-label-primary, #14110d);
}

[data-rm="map-root"] svg {
  flex: 1 1 auto;
  min-height: 0;
  display: block;
  width: 100%;
}

/* Cards. The rect carries the surface; the group carries the identity. */
[data-rm="map-tile"] {
  cursor: pointer;
}

[data-rm="map-tile-rect"] {
  fill: var(--rm-map-surface);
  stroke: var(--rm-map-border);
  stroke-width: 0.5;
  vector-effect: non-scaling-stroke;
}

/* A changed card is drawn on a stronger surface and a heavier border: the map
   must show what changed before it shows what did not. */
[data-rm="map-tile-rect"][data-changed="true"] {
  fill: var(--rm-map-surface-strong);
  stroke: var(--rm-map-secondary);
  stroke-width: 1;
}

[data-rm="map-tile"]:hover [data-rm="map-tile-rect"] {
  stroke: var(--dsw-alias-label-primary, #14110d);
}

[data-rm="map-tile"][data-highlighted="true"] [data-rm="map-tile-rect"] {
  stroke: var(--dsw-alias-label-primary, #14110d);
  stroke-width: 2;
}

/* Dependency edges. Colour is the first channel and the dash pattern is the
   second: imports is a solid blue line with an open chevron, imported-by a
   dashed green line with a filled triangle. A greyscale render still separates
   them by both the dash and the arrow shape. */
[data-rm="map-edge"] {
  stroke-width: 1.5;
  stroke-linecap: round;
  pointer-events: none;
}

[data-rm="map-edge"][data-flow="imports"] {
  stroke: var(--rm-map-imports, #2f6feb);
  stroke-dasharray: none;
  color: var(--rm-map-imports, #2f6feb);
}

[data-rm="map-edge"][data-flow="imported-by"] {
  stroke: var(--rm-map-imported-by, #1a7f37);
  stroke-dasharray: 5 3;
  color: var(--rm-map-imported-by, #1a7f37);
}

/* A removed edge is drawn faint and dotted: it is a dependency that no longer
   exists, and it must be visible without competing with the live ones. */
[data-rm="map-edge"][data-state="removed"] {
  stroke-dasharray: 2 3;
  opacity: 0.55;
}

[data-rm="map-edge"][data-aggregated="true"] {
  stroke-width: 2.5;
}

[data-rm="map-arrow-head"] {
  color: inherit;
}

/* The legend explains lines that only exist while a file is highlighted, so it
   only exists then too. */
[data-rm="map-legend"] {
  pointer-events: none;
}

[data-rm="map-legend-swatch"] {
  stroke-width: 2;
}

[data-rm="map-legend-swatch"][data-flow="imports"] {
  stroke: var(--rm-map-imports, #2f6feb);
}

[data-rm="map-legend-swatch"][data-flow="imported-by"] {
  stroke: var(--rm-map-imported-by, #1a7f37);
  stroke-dasharray: 5 3;
}

[data-rm="map-legend-swatch"][data-flow="unresolved"] {
  stroke: var(--rm-map-muted);
  stroke-dasharray: 2 3;
}

[data-rm="map-legend-label"] {
  font-size: 9px;
  fill: var(--rm-map-secondary);
}

[data-rm="map-unresolved"] {
  font-size: 9px;
  fill: var(--rm-map-warn);
}

[data-rm="map-partial"] {
  font-size: 9px;
  fill: var(--rm-map-muted);
  font-style: italic;
}

/* Status: colour and shape, both. The dash patterns are the shape channel, so a
   greyscale render still separates the states; the fills are the colour one. */
[data-rm="map-tile-rect"][data-status="added"] {
  fill: color-mix(in srgb, var(--rm-map-add) 16%, transparent);
  stroke: var(--rm-map-add);
}

[data-rm="map-tile-rect"][data-status="modified"] {
  fill: color-mix(in srgb, var(--rm-map-warn) 14%, transparent);
  stroke: var(--rm-map-warn);
}

[data-rm="map-tile-rect"][data-status="deleted"] {
  fill: color-mix(in srgb, var(--rm-map-del) 16%, transparent);
  stroke: var(--rm-map-del);
  stroke-dasharray: 4 2;
}

[data-rm="map-tile-rect"][data-status="untracked"] {
  fill: color-mix(in srgb, var(--rm-map-add) 8%, transparent);
  stroke: var(--rm-map-add);
  stroke-dasharray: 1 2;
}

[data-rm="map-tile-rect"][data-status="conflicted"] {
  fill: color-mix(in srgb, var(--rm-map-del) 10%, transparent);
  stroke: var(--rm-map-warn);
  stroke-dasharray: 2 1 4 1;
}

[data-rm="map-tile-rect"][data-status="renamed"],
[data-rm="map-tile-rect"][data-status="copied"] {
  fill: color-mix(in srgb, var(--rm-map-secondary) 10%, transparent);
  stroke: var(--rm-map-secondary);
  stroke-dasharray: 6 2;
}

[data-rm="map-tile-rect"][data-status="type-changed"] {
  fill: color-mix(in srgb, var(--rm-map-warn) 8%, transparent);
  stroke: var(--rm-map-warn);
  stroke-dasharray: 1 3;
}

/* A deleted card is struck through as well as dashed: the dash says "gone" at a
   glance, the strike says it again on the label, and neither depends on colour. */
[data-rm="map-tile"][data-deleted="true"] [data-rm="map-file-name"] {
  text-decoration: line-through;
  fill: var(--rm-map-muted);
}

/* Text. 9px is the floor: below it a label is a smudge, and the renderer drops
   the text entirely rather than drawing something unreadable. */
[data-rm="map-root"] text {
  font-family: var(--dsh-font-mono, ui-monospace, SFMono-Regular, monospace);
  font-size: 9px;
  fill: var(--dsw-alias-label-primary, #14110d);
  pointer-events: none;
}

[data-rm="map-dir-name"] {
  font-weight: 600;
}

[data-rm="map-dir-reading"],
[data-rm="map-file-churn"] {
  fill: var(--rm-map-secondary);
}

[data-rm="map-dir-reading"][data-pending="true"] {
  fill: var(--rm-map-muted);
  font-style: italic;
}

[data-rm="map-file-mark"][data-status="added"] {
  fill: var(--rm-map-add);
}

[data-rm="map-file-mark"][data-status="deleted"] {
  fill: var(--rm-map-del);
}

[data-rm="map-file-mark"][data-status="conflicted"] {
  fill: var(--rm-map-warn);
}

/* The distribution bar: where in the file the edits landed. */
[data-rm="map-bar-seg"][data-kind="add"] {
  fill: var(--rm-map-add);
}

[data-rm="map-bar-seg"][data-kind="del"] {
  fill: var(--rm-map-del);
}

/* The aggregate marker a capped level shows instead of silently dropping files. */
[data-rm="map-overflow-rect"] {
  fill: var(--rm-map-surface);
  stroke: var(--rm-map-border);
  stroke-dasharray: 2 2;
  stroke-width: 0.5;
}

[data-rm="map-overflow-text"] {
  fill: var(--rm-map-muted);
  font-style: italic;
}
/* Hover, from either side of the linkage. A hovered card and a highlighted card
   are different states: hover is where the pointer is, highlight is what the
   list is pointing at, and a reader can be doing both at once. */
[data-rm="map-tile"][data-hovered="true"] [data-rm="map-tile-rect"] {
  stroke: var(--dsw-alias-label-primary, #14110d);
  stroke-width: 1.5;
}

[data-rm="map-tile"][data-highlighted="true"] [data-rm="map-tile-rect"] {
  stroke: var(--dsw-alias-label-primary, #14110d);
  stroke-width: 2;
}
`;function at(e){let t=e.querySelector(`style[${rt}]`);if(t!==null)return t;let r=e.createElement("style");return r.setAttribute(rt,""),r.textContent=kt,e.head.append(r),r}var Et=900,Mt=520,Tt=26,It=20;function Lt(e,t){let r=t.width??(e.clientWidth>0?e.clientWidth:Et),a=t.height??(e.clientHeight>0?e.clientHeight:Mt);return{width:r,height:Math.max(a-Tt,0)}}function nt(e){let t=[""];if(e==="")return t;let r="";for(let a of e.split("/"))a!==""&&(r=r===""?a:`${r}/${a}`,t.push(r));return t}function ot(e,t){if(t!==""&&e!==t&&!e.startsWith(`${t}/`))return null;let r=t===""?e:e.slice(t.length+1);if(r==="")return null;let a=r.indexOf("/"),n=a<0?r:r.slice(0,a);return t===""?n:`${t}/${n}`}function _t(e,t,r={},a={}){let n=e.ownerDocument;at(n);let i=a.title??"repo",s=a.strings??{imports:"imports",importedBy:"imported by",unresolved:"unresolved",unresolvedTemplate:"\u2265{count} unresolved",partialTemplate:"indexed {parsed}/{total}"},m=n.createElement("div");m.setAttribute("data-rm","map-root");let c=n.createElement("nav");c.setAttribute("data-rm","map-breadcrumb"),m.append(c);let o=n.createElementNS(O,"svg");o.setAttribute("data-review-map","map"),o.setAttribute("preserveAspectRatio","none"),m.append(o),e.append(m);let d=t.rootPath,l=null,f=new Map,p=0,y=0,I=h=>{let g=t.levels.get(h);if(g===void 0)return{level:{path:h,dirs:[],files:[]},hidden:0};let u=Y(g.files);return{level:{path:g.path,dirs:g.dirs,files:u.files},hidden:u.hidden}},v=h=>{c.replaceChildren();for(let g of nt(h)){let u=n.createElement("button");u.type="button",u.setAttribute("data-rm","map-crumb"),u.setAttribute("data-path",g),u.setAttribute("data-current",g===h?"true":"false"),u.textContent=g===""?i:g.slice(g.lastIndexOf("/")+1),u.addEventListener("click",()=>{E(g)}),c.append(u)}},L=h=>{let g=j(t.edges??[],h,new Set(f.keys())),u=Q(n,g,f,h,{x:0,y:0,width:p,height:y});u!==null&&o.append(u),o.append(Z(n,{imports:s.imports,importedBy:s.importedBy,unresolved:s.unresolved}));let x=t.unresolvedFiles?.[h]??0;if(x>0){let M=f.get(h);M!==void 0&&o.append(tt(n,x,{x:M.x+4,y:M.y+M.height-4},s.unresolvedTemplate))}let S=t.indexed;S!==void 0&&!S.complete&&o.append(et(n,{x:8,y:Math.max(y-8,12)},s.partialTemplate,S.parsed,S.total))},w=()=>{for(let S of o.querySelectorAll("[data-highlighted]"))S.removeAttribute("data-highlighted");for(let S of c.querySelectorAll("[data-breadcrumb-target]"))S.removeAttribute("data-breadcrumb-target");for(let S of o.querySelectorAll('[data-rm="map-edges"], [data-rm="map-legend"], [data-rm="map-unresolved"]'))S.remove();if(l===null)return;let h=o.querySelector(`[data-rm="map-tile"][data-path="${$(l)}"]`);if(h!==null){h.setAttribute("data-highlighted","true"),L(l);return}let g=ot(l,d);if(g===null)return;let u=o.querySelector(`[data-rm="map-tile"][data-path="${$(g)}"]`);u!==null&&u.setAttribute("data-highlighted","true");let x=c.querySelector(`[data-rm="map-crumb"][data-path="${$(d)}"]`);x!==null&&x.setAttribute("data-breadcrumb-target","true")},E=(h,g=!0)=>{h!==d&&(_(h),g&&r.onDrill?.(h))},_=h=>{d=h;let g=Lt(e,a);p=g.width,y=g.height,o.setAttribute("viewBox",`0 0 ${String(p)} ${String(y)}`),o.setAttribute("width","100%"),o.setAttribute("height",String(y)),o.replaceChildren(),o.append(J(n));let{level:u,hidden:x}=I(h);v(h);let S=new Map(u.dirs.map(b=>[b.path,b])),M=new Map(u.files.map(b=>[b.path,b])),H=X({path:u.path,dirs:u.dirs,files:u.files},{width:p,height:y}),C={document:n,...r.onOpenFile===void 0?{}:{onOpenFile:r.onOpenFile},onDrill:b=>{E(b)},...r.onHover===void 0?{}:{onHover:r.onHover}};f=new Map;for(let b of H.tiles){f.set(b.path,{x:b.x,y:b.y,width:b.width,height:b.height});let V=S.get(b.path);if(V!==void 0){o.append(q(C,b,V));continue}let B=M.get(b.path);B!==void 0&&o.append(K(C,b,B))}if(x>0){let b=Math.min(It,y);o.append(U(n,x,{x:0,y:Math.max(y-b,0),width:p,height:b}))}w()},D=h=>{h.key==="Escape"&&d!==""&&E(d.slice(0,Math.max(d.lastIndexOf("/"),0)))};return e.addEventListener("keydown",D),_(d),{destroy(){e.removeEventListener("keydown",D),m.remove()},path(){return d},setHighlight(h){l=h,w()},reveal(h){l=h,w()},up(){if(d==="")return!1;let h=d.slice(0,Math.max(d.lastIndexOf("/"),0));return E(h,!1),!0}}}function $(e){return e.replace(/["\\]/gu,"\\$&")}

    return module.exports.default ?? module.exports;
  }
});
