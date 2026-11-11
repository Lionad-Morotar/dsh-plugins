window.__ModuleLoader__.load({
  id: "dsh-review-map",
  chunk: "client.map.js",
  factory: (require) => {
    var module = { exports: {} };
    var exports = module.exports;
"use strict";var B=Object.defineProperty;var ht=Object.getOwnPropertyDescriptor;var ct=Object.getOwnPropertyNames;var ut=Object.prototype.hasOwnProperty;var gt=(e,t)=>{for(var r in t)B(e,r,{get:t[r],enumerable:!0})},ft=(e,t,r,a)=>{if(t&&typeof t=="object"||typeof t=="function")for(let n of ct(t))!ut.call(e,n)&&n!==r&&B(e,n,{get:()=>t[n],enumerable:!(a=ht(t,n))||a.enumerable});return e};var yt=e=>ft(B({},"__esModule",{value:!0}),e);var zt={};gt(zt,{createMap:()=>qt,nearestVisibleAncestor:()=>mt,pathSegments:()=>lt});module.exports=yt(zt);function D(e){return Math.round(e*100)/100}function V(e){return e===null||!Number.isFinite(e)?1:Math.max(e,1)}function bt(e){let t=[];for(let r of e.dirs)t.push({path:r.path,kind:"dir",lines:V(r.lines),weight:V(r.lines)});for(let r of e.files){let a=V(r.lines);t.push({path:r.path,kind:"file",lines:a,weight:a})}return t.sort((r,a)=>r.path<a.path?-1:r.path>a.path?1:0)}function U(e,t,r){if(t<=0||r<=0)return Number.POSITIVE_INFINITY;let a=t/r,n=1;for(let o of e){if(o<=0)continue;let d=o/a,s=Math.max(a/d,d/a);s>n&&(n=s)}return n}function wt(e,t){let r=e.reduce((d,s)=>d+s,0),a=[];if(r<=0)return{rects:e.map(()=>({x:t.x,y:t.y,width:0,height:0})),rest:t};if(t.width>=t.height){let d=Math.min(r/t.height,t.width),s=t.y;for(let h of e){let i=t.height>0?h/r*t.height:0;a.push({x:t.x,y:s,width:d,height:i}),s+=i}return{rects:a,rest:{x:t.x+d,y:t.y,width:t.width-d,height:t.height}}}let n=Math.min(r/t.width,t.height),o=t.x;for(let d of e){let s=t.width>0?d/r*t.width:0;a.push({x:o,y:t.y,width:s,height:n}),o+=s}return{rects:a,rest:{x:t.x,y:t.y+n,width:t.width,height:t.height-n}}}function vt(e,t,r){let a=e.reduce((l,p)=>l+p,0),n=r*r;if(a<=0||t<=0||n<=0)return{weights:[...e],floored:!1};let o=e.filter(l=>t*l/a<n);if(o.length===0)return{weights:[...e],floored:!1};let d=o.length,s=o.reduce((l,p)=>l+p,0),h=t-n*d;if(h<=0)return{weights:[...e],floored:!1};let i=n*(a-s)/h;return!Number.isFinite(i)||i<=0?{weights:[...e],floored:!1}:{weights:e.map(l=>Math.max(l,i)),floored:!0}}function O(e,t){let r=Number.isFinite(t.width)?Math.max(t.width,0):0,a=Number.isFinite(t.height)?Math.max(t.height,0):0,n=t.minSide!==void 0&&t.minSide>0?t.minSide:4,o=bt(e);if(o.length===0)return{tiles:[]};if(r<=0||a<=0)return{tiles:o.map(S=>({path:S.path,kind:S.kind,lines:S.lines,x:0,y:0,width:0,height:0}))};let d=r*a,h=vt(o.map(S=>S.weight),d,n).weights,i=h.reduce((S,T)=>S+T,0),l=i>0?d/i:0,p=h.map(S=>S*l),b=[],m={x:0,y:0,width:r,height:a},f=0;for(;f<p.length;){let S=Math.min(m.width,m.height),T=p[f]??0,v=f+1,M=T,E=U([T],M,S);for(;v<p.length;){let c=p[v]??0,g=M+c,u=U(p.slice(f,v+1),g,S);if(u>E)break;E=u,M=g,v+=1}if(v>=p.length){let c=p.slice(f,v),g=c.reduce((u,y)=>u+y,0);if(m.width>=m.height){let u=m.y;for(let y of c){let x=g>0?y/g:1/c.length,A=m.height*x;b.push({x:m.x,y:u,width:m.width,height:A}),u+=A}}else{let u=m.x;for(let y of c){let x=g>0?y/g:1/c.length,A=m.width*x;b.push({x:u,y:m.y,width:A,height:m.height}),u+=A}}m={x:m.x,y:m.y,width:0,height:0},f=v;continue}let C=wt(p.slice(f,v),m);b.push(...C.rects),m=C.rest,f=v}return{tiles:o.map((S,T)=>{let v=b[T]??{x:0,y:0,width:0,height:0},M=D(v.x),E=D(v.y);return{path:S.path,kind:S.kind,lines:S.lines,x:M,y:E,width:D(D(v.x+v.width)-M),height:D(D(v.y+v.height)-E)}})}}var W="http://www.w3.org/2000/svg",_=34,H=18,xt=48,X=400,St={added:"+",modified:"~",deleted:"\xD7",renamed:"\u2192",copied:"\u29C9","type-changed":"\u21C4",untracked:"?",conflicted:"!",unknown:"\xB7"},kt={added:"solid",modified:"dash-dot",deleted:"dashed",renamed:"double",copied:"double-dot","type-changed":"dotted",untracked:"sparse",conflicted:"hatched",unknown:"none"};function Mt(e){return e.unindexed===!0||!e.changed?null:e.status??"modified"}function Et(e){return St[e]}function F(e){return kt[e]}function Tt(e){if(!e.changed)return null;if(e.unindexed===!0)return"unindexed";if(e.binary===!0)return"bin";if(e.status==="conflicted")return"conflict";if(e.status==="untracked")return"new";let t=e.additions??null,r=e.deletions??null;if(t===null&&r===null)return null;let a=[];return t!==null&&t>0&&a.push(`+${String(t)}`),r!==null&&r>0&&a.push(`\u2212${String(r)}`),a.length===0?"0":a.join(" ")}function $(e){let t=e.lastIndexOf("/");return t<0?e:e.slice(t+1)}function At(e,t){let r=e.hunks??[];if(r.length===0)return[];let a=t!==null&&t>0?t:null;if(a===null)return[{kind:"add",start:0,width:1}];let n=[];for(let o of r){let d=Math.min(Math.max((o.newStart-1)/a,0),1),s=o.newLines>0?o.newLines/a:0,h=Math.min(Math.max(s,o.newLines>0?.01:.02),1-d);n.push({kind:o.newLines>0?"add":"del",start:d,width:Math.max(h,.01)})}return n}function k(e,t,r){let a=e.createElementNS(W,t);for(let[n,o]of Object.entries(r))a.setAttribute(n,o);return a}function L(e,t,r){let a=k(e,"text",t);return a.textContent=r,a}function Q(e,t,r){let{document:a}=e,n=k(a,"g",{"data-rm":"map-tile","data-kind":"dir","data-path":t.path,"data-lines":String(t.lines),"data-changed":r.changed?"true":"false"});if(n.append(k(a,"rect",{x:String(t.x),y:String(t.y),width:String(t.width),height:String(t.height),"data-rm":"map-tile-rect","data-changed":r.changed?"true":"false"})),t.width>=_&&t.height>=H){let o=$(t.path)===""?t.path:$(t.path);n.append(L(a,{x:String(t.x+4),y:String(t.y+12),"data-rm":"map-dir-name"},o));let d=r.changedFiles??0,s=r.pending===!0,h=s?`${String(t.lines)} lines \xB7 pending`:r.changed?`${String(t.lines)} lines \xB7 ${String(d)} changed \xB7 +${String(r.additions??0)} \u2212${String(r.deletions??0)}`:`${String(t.lines)} lines`;t.height>=H*2&&n.append(L(a,{x:String(t.x+4),y:String(t.y+24),"data-rm":"map-dir-reading","data-pending":s?"true":"false"},h))}if(e.childrenOf!==void 0){let o=e.childrenOf(t.path),d=_t(o),s=Ot(e,t,d.crumbs,d.hidden);s!==null&&n.append(s)}if(e.onHover!==void 0){let o=e.onHover;n.addEventListener("pointerenter",()=>{o(t.path)}),n.addEventListener("pointerleave",()=>{o(null)})}if(e.onDrill!==void 0){let o=e.onDrill;n.addEventListener("click",()=>{o(t.path)})}return n}function J(e,t,r){let{document:a}=e,n=Mt(r),o=n==="deleted",d={"data-rm":"map-tile","data-kind":"file","data-path":t.path,"data-lines":String(t.lines),"data-changed":r.changed?"true":"false"};n!==null&&(d["data-status"]=n,d["data-shape"]=F(n)),r.additions!==void 0&&r.additions!==null&&(d["data-additions"]=String(r.additions)),r.deletions!==void 0&&r.deletions!==null&&(d["data-deletions"]=String(r.deletions)),o&&(d["data-deleted"]="true"),r.unindexed===!0?d["data-unindexed"]="true":r.binary===!0&&(d["data-binary"]="true");let s=k(a,"g",d),h={x:String(t.x),y:String(t.y),width:String(t.width),height:String(t.height),"data-rm":"map-tile-rect","data-changed":r.changed?"true":"false"};if(n!==null&&(h["data-status"]=n,h["data-shape"]=F(n)),o&&(h["data-deleted"]="true"),r.unindexed===!0&&(h["data-unindexed"]="true"),s.append(k(a,"rect",h)),t.width>=_&&t.height>=H&&r.changed){s.append(L(a,{x:String(t.x+4),y:String(t.y+12),"data-rm":"map-file-name"},$(t.path)));let p=Tt(r);p!==null&&t.height>=H*2&&s.append(L(a,{x:String(t.x+4),y:String(t.y+24),"data-rm":"map-file-churn"},p)),n!==null&&t.width>=_*1.6&&s.append(L(a,{x:String(t.x+t.width-4),y:String(t.y+12),"text-anchor":"end","data-rm":"map-file-mark","data-status":n,"data-shape":F(n)},Et(n)))}let l=r.changed&&r.unindexed!==!0?At(r,r.lines):[];if(l.length>0&&t.width>=xt&&t.height>=H){let p=Math.min(3,Math.max(2,t.height/12)),b=t.y+t.height-p-1,m=t.width-4,f=k(a,"g",{"data-rm":"map-bar","data-path":t.path});for(let I of l)f.append(k(a,"rect",{x:String(t.x+2+I.start*m),y:String(b),width:String(Math.max(I.width*m,.5)),height:String(p),"data-rm":"map-bar-seg","data-kind":I.kind,"data-start":I.start.toFixed(4),"data-width":I.width.toFixed(4)}));s.append(f)}if(e.onOpenFile!==void 0){let p=e.onOpenFile;s.addEventListener("click",()=>{p(t.path)})}if(e.onHover!==void 0){let p=e.onHover;s.addEventListener("pointerenter",()=>{p(t.path)}),s.addEventListener("pointerleave",()=>{p(null)})}return s}function Z(e,t,r){let a=k(e,"g",{"data-rm":"map-overflow","data-hidden":String(t)});return a.append(k(e,"rect",{x:String(r.x),y:String(r.y),width:String(r.width),height:String(r.height),"data-rm":"map-overflow-rect"})),r.width>=_&&r.height>=H&&a.append(L(e,{x:String(r.x+4),y:String(r.y+12),"data-rm":"map-overflow-text"},`${String(t)} more files`)),a}function tt(e){if(e.length<=X)return{files:[...e],hidden:0};let r=[...e].sort((a,n)=>{let o=a.lines??0,d=n.lines??0;return o!==d?d-o:a.path<n.path?-1:a.path>n.path?1:0}).slice(0,X).sort((a,n)=>a.path<n.path?-1:a.path>n.path?1:0);return{files:r,hidden:e.length-r.length}}var It=20,Lt=12;function K(e){let t=e.lastIndexOf("/");return t<0?"":e.slice(0,t)}function et(e,t,r){let a=e.filter(i=>i.from===t),n=e.filter(i=>i.to===t),o=a.length+n.length;if(o===0)return{edges:[],aggregated:!1,total:0};let d=[...a.map(i=>({from:i.from,to:i.to,flow:"imports",state:i.state,count:1,aggregated:!1})),...n.map(i=>({from:i.from,to:i.to,flow:"imported-by",state:i.state,count:1,aggregated:!1}))];if(o<=It)return{edges:d,aggregated:!1,total:o};let s=new Map;for(let i of d){let l=i.from===t?t:K(i.from),p=i.to===t?t:K(i.to);if(l===p)continue;let b=`${l}\0${p}\0${i.flow}`,m=s.get(b);m===void 0?s.set(b,{...i,from:l,to:p,count:1,aggregated:l!==i.from||p!==i.to}):s.set(b,{...m,count:m.count+i.count,aggregated:!0})}return{edges:[...s.values()].sort((i,l)=>i.count!==l.count?l.count-i.count:i.from!==l.from?i.from<l.from?-1:1:i.to<l.to?-1:i.to>l.to?1:0).slice(0,Lt),aggregated:!0,total:o}}function Y(e,t){let r={x:e.x+e.width/2,y:e.y+e.height/2},a=t.x-r.x,n=t.y-r.y;if(a===0&&n===0)return r;let o=Math.abs(n/(a===0?Number.EPSILON:a)),d=e.height/(e.width===0?Number.EPSILON:e.width);return o<=d?{x:a>=0?e.x+e.width:e.x,y:r.y}:{x:r.x,y:n>=0?e.y+e.height:e.y}}function rt(e,t,r,a,n){if(t.edges.length===0)return null;let o=k(e,"g",{"data-rm":"map-edges","data-aggregated":t.aggregated?"true":"false"}),d=h=>({x:h.x+h.width/2,y:h.y+h.height/2}),s=h=>{let i=r.get(h);if(i!==void 0)return i;let l=h;for(;;){let p=l.lastIndexOf("/");if(p<0)break;l=l.slice(0,p);let b=r.get(l);if(b!==void 0)return b}return r.get("")??n};for(let h of t.edges){let i=s(h.from),l=s(h.to);if(i===void 0||l===void 0||i===l)continue;let p=Y(i,d(l)),b=Y(l,d(i)),m=k(e,"path",{d:`M ${String(p.x)} ${String(p.y)} Q ${String((p.x+b.x)/2)} ${String((p.y+b.y)/2-12)} ${String(b.x)} ${String(b.y)}`,"data-rm":"map-edge","data-flow":h.flow,"data-state":h.state,"data-from":h.from,"data-to":h.to,"data-count":String(h.count),"data-aggregated":h.aggregated?"true":"false","data-highlighted-from":a,"marker-end":h.flow==="imports"?"url(#rm-arrow-imports)":"url(#rm-arrow-imported-by)",fill:"none"});o.append(m)}return o.childElementCount===0?null:o}function at(e){let t=k(e,"defs",{});for(let[r,a]of[["rm-arrow-imports",!1],["rm-arrow-imported-by",!0]]){let n=k(e,"marker",{id:r,viewBox:"0 0 8 8",refX:"7",refY:"4",markerWidth:"6",markerHeight:"6",orient:"auto-start-reverse","data-rm":"map-arrow","data-filled":a?"true":"false"});n.append(k(e,"path",{d:a?"M 0 0 L 8 4 L 0 8 z":"M 0 1 L 7 4 L 0 7","data-rm":"map-arrow-head",fill:a?"currentColor":"none",stroke:"currentColor","stroke-width":"1.2"})),t.append(n)}return t}function nt(e,t){let r=k(e,"g",{"data-rm":"map-legend"});return[{key:"imports",label:t.imports,flow:"imports"},{key:"imported-by",label:t.importedBy,flow:"imported-by"},{key:"unresolved",label:t.unresolved,flow:"unresolved"}].forEach((n,o)=>{let d=12+o*13;r.append(k(e,"line",{x1:"8",y1:String(d-3),x2:"26",y2:String(d-3),"data-rm":"map-legend-swatch","data-flow":n.flow})),r.append(L(e,{x:"30",y:String(d),"data-rm":"map-legend-label","data-flow":n.flow},n.label))}),r}function it(e,t,r,a){return L(e,{x:String(r.x),y:String(r.y),"data-rm":"map-unresolved","data-count":String(t)},a.replace("{count}",String(t)))}function ot(e,t,r,a,n){return L(e,{x:String(t.x),y:String(t.y),"data-rm":"map-partial","data-parsed":String(a),"data-total":String(n)},r.replace("{parsed}",String(a)).replace("{total}",String(n)))}var j=600,Rt=26,Ht=11;function Gt(e,t){let a=Math.max(1,Math.floor(t/5.2));return e.length<=a?e:a<=1?"\u2026":`${e.slice(0,a-1)}\u2026`}function Dt(e){return Math.max(4,Math.min(8,Math.min(e.width,e.height)*.06))}function Ct(e){return e.width<_||e.height<H?0:e.height>=H*2?26:14}function _t(e){if(e.length<=j)return{crumbs:[...e],hidden:0};let r=[...e].sort((a,n)=>a.lines!==n.lines?n.lines-a.lines:a.path<n.path?-1:a.path>n.path?1:0).slice(0,j).sort((a,n)=>a.path<n.path?-1:a.path>n.path?1:0);return{crumbs:r,hidden:e.length-r.length}}function Ot(e,t,r,a){let{document:n}=e,o=Dt(t),d=t.y+Ct(t)+o,s={x:t.x+o,y:d,width:Math.max(t.width-o*2,0),height:Math.max(t.y+t.height-o-d,0)};if(s.width<6||s.height<6||r.length===0&&a===0)return null;let h=k(n,"g",{"data-rm":"map-crumbs","data-path":t.path}),i=a>0?Math.min(10,s.height*.2):0,l={...s,height:Math.max(s.height-i,0)};if(r.length>0&&l.height>=4){let p=O({path:t.path,dirs:r.filter(m=>m.kind==="dir").map(m=>({path:m.path,lines:m.lines,changed:m.changed})),files:r.filter(m=>m.kind==="file").map(m=>({path:m.path,lines:m.lines,changed:m.changed}))},{width:l.width,height:l.height,minSide:.5}),b=new Map(r.map(m=>[m.path,m]));for(let m of p.tiles){let f=b.get(m.path);if(f===void 0)continue;let I=R(l.x+m.x),S=R(l.y+m.y),T=R(m.width),v=R(m.height),M={x:String(I),y:String(S),width:String(T),height:String(v),"data-rm":"map-crumb","data-kind":f.kind,"data-path":f.path,"data-lines":String(f.lines),"data-changed":f.changed?"true":"false","data-emphasis":f.changed?"strong":"quiet"};f.status!==void 0&&(M["data-status"]=f.status,M["data-shape"]=F(f.status));let E=k(n,"rect",M);if(e.onHover!==void 0){let G=e.onHover;E.addEventListener("pointerenter",()=>{G(t.path)}),E.addEventListener("pointerleave",()=>{G(null)})}h.append(E),T>=Rt&&v>=Ht&&h.append(L(n,{x:String(I+2),y:String(S+Math.min(v-2,9)),"data-rm":"map-crumb-label","data-path":f.path},Gt($(f.path),T-4)))}}if(a>0){let p=k(n,"rect",{x:String(R(s.x)),y:String(R(s.y+s.height-i)),width:String(R(s.width)),height:String(R(i)),"data-rm":"map-crumb-overflow","data-count":String(a),"data-path":t.path});h.append(p)}return h.childElementCount===0?null:h}function R(e){return Math.round(e*100)/100}var dt="data-rm-map",Ft=`/* The directory map's own stylesheet, injected by the chunk that draws it.
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
  /* The preview's two materials. A folder is warm and light (it holds things);
     a file is cool and slightly darker (it is a leaf). Both are host tokens with
     a hex fallback, so the preview follows the theme like everything else. */
  --rm-map-dir: var(--dsw-alias-bg-layer-2, #f4f1ec);
  --rm-map-dir-border: var(--dsw-alias-border-l1, rgba(0, 0, 0, 0.08));
  --rm-map-file: var(--dsw-alias-bg-layer-1, #eceff3);
  --rm-map-file-border: var(--dsw-alias-border-l2, rgba(0, 0, 0, 0.12));
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

[data-rm="map-breadcrumb-crumb"] {
  font: inherit;
  padding: 1px 6px;
  color: var(--rm-map-secondary);
  background: transparent;
  border: 1px solid transparent;
  border-radius: 4px;
  cursor: pointer;
}

[data-rm="map-breadcrumb-crumb"]:hover {
  background: var(--rm-map-surface);
}

[data-rm="map-breadcrumb-crumb"][data-current="true"] {
  color: var(--dsw-alias-label-primary, #14110d);
  font-weight: 600;
}

/* The crumb that holds a highlighted target the map has not drilled into. */
[data-rm="map-breadcrumb-crumb"][data-breadcrumb-target="true"] {
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

/* A directory's in-tile preview: one level of its direct children, laid out with
   the same treemap. The two kinds read as different materials \u2014 a folder is a
   container, a file is a leaf \u2014 so an unchanged preview still shows structure
   instead of reading as an empty tile. */
[data-rm="map-crumb"] {
  fill: var(--rm-map-file);
  stroke: var(--rm-map-border);
  stroke-width: 1;
  vector-effect: non-scaling-stroke;
}

/* A folder's crumb is the warmer, lighter material: it holds things. */
[data-rm="map-crumb"][data-kind="dir"] {
  fill: var(--rm-map-dir);
  stroke: var(--rm-map-dir-border);
}

/* A changed crumb uses the same colour and shape vocabulary as the cards: the
   preview is a miniature of the folder, so it must not invent a second one. The
   border is what carries the emphasis, which is why it is keyed off the
   emphasis attribute rather than off the status alone. */
[data-rm="map-crumb"][data-emphasis="strong"] {
  stroke-width: 1.5;
  stroke: var(--rm-map-secondary);
}

[data-rm="map-crumb"][data-emphasis="quiet"] {
  opacity: 0.85;
}

[data-rm="map-crumb"][data-status="added"] {
  fill: color-mix(in srgb, var(--rm-map-add) 45%, transparent);
  stroke: var(--rm-map-add);
}

[data-rm="map-crumb"][data-status="modified"] {
  fill: color-mix(in srgb, var(--rm-map-warn) 40%, transparent);
  stroke: var(--rm-map-warn);
}

[data-rm="map-crumb"][data-status="deleted"] {
  fill: color-mix(in srgb, var(--rm-map-del) 45%, transparent);
  stroke: var(--rm-map-del);
  stroke-dasharray: 2 1;
}

[data-rm="map-crumb"][data-status="untracked"] {
  fill: color-mix(in srgb, var(--rm-map-add) 25%, transparent);
  stroke: var(--rm-map-add);
  stroke-dasharray: 1 1;
}

[data-rm="map-crumb"][data-status="conflicted"] {
  fill: color-mix(in srgb, var(--rm-map-del) 30%, transparent);
  stroke: var(--rm-map-warn);
  stroke-dasharray: 2 1 3 1;
}

[data-rm="map-crumb"][data-status="renamed"],
[data-rm="map-crumb"][data-status="copied"] {
  fill: color-mix(in srgb, var(--rm-map-secondary) 30%, transparent);
  stroke: var(--rm-map-secondary);
  stroke-dasharray: 4 2;
}

/* A crumb's name. It is drawn only when the crumb has room, and the renderer
   truncates it to fit: SVG text does not wrap, so overflow would be silent. */
[data-rm="map-crumb-label"] {
  font-size: 9px;
  fill: var(--dsw-alias-label-primary, #14110d);
  pointer-events: none;
}

/* An unindexed file: its content was never read, so it is drawn in neutral grey
   with a dashed border. It is not binary \u2014 that would be a claim the index
   cannot support \u2014 and it carries no change status. */
[data-rm="map-tile-rect"][data-unindexed="true"] {
  fill: var(--rm-map-muted);
  fill-opacity: 0.18;
  stroke: var(--rm-map-muted);
  stroke-dasharray: 3 2;
  stroke-width: 1;
}

/* The aggregate block a capped preview shows instead of silently dropping the
   children it left out. */
[data-rm="map-crumb-overflow"] {
  fill: var(--rm-map-muted);
  opacity: 0.5;
}

/* The hovered directory's reading: the linkage's visible end. */
[data-rm="map-tile"][data-hovered="true"] [data-rm="map-dir-reading"] {
  fill: var(--dsw-alias-label-primary, #14110d);
  font-weight: 600;
}

[data-rm="map-tile"][data-hovered="true"] [data-rm="map-dir-name"] {
  fill: var(--dsw-alias-label-primary, #14110d);
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
`;function st(e){let t=e.querySelector(`style[${dt}]`);if(t!==null)return t;let r=e.createElement("style");return r.setAttribute(dt,""),r.textContent=Ft,e.head.append(r),r}var $t=900,Nt=520,Bt=26,Vt=20;function Wt(e,t){let r=t.width??(e.clientWidth>0?e.clientWidth:$t),a=t.height??(e.clientHeight>0?e.clientHeight:Nt);return{width:r,height:Math.max(a-Bt,0)}}function lt(e){let t=[""];if(e==="")return t;let r="";for(let a of e.split("/"))a!==""&&(r=r===""?a:`${r}/${a}`,t.push(r));return t}function mt(e,t){if(t!==""&&e!==t&&!e.startsWith(`${t}/`))return null;let r=t===""?e:e.slice(t.length+1);if(r==="")return null;let a=r.indexOf("/"),n=a<0?r:r.slice(0,a);return t===""?n:`${t}/${n}`}function qt(e,t,r={},a={}){let n=e.ownerDocument;st(n);let o=a.title??"repo",d=a.strings??{imports:"imports",importedBy:"imported by",unresolved:"unresolved",unresolvedTemplate:"\u2265{count} unresolved",partialTemplate:"indexed {parsed}/{total}"},s=n.createElement("div");s.setAttribute("data-rm","map-root");let h=n.createElement("nav");h.setAttribute("data-rm","map-breadcrumb"),s.append(h);let i=n.createElementNS(W,"svg");i.setAttribute("data-review-map","map"),i.setAttribute("preserveAspectRatio","none"),s.append(i),e.append(s);let l=t.rootPath,p=null,b=new Map,m=0,f=0,I=c=>{let g=t.levels.get(c);if(g===void 0)return{level:{path:c,dirs:[],files:[]},hidden:0};let u=tt(g.files);return{level:{path:g.path,dirs:g.dirs,files:u.files},hidden:u.hidden}},S=c=>{h.replaceChildren();for(let g of lt(c)){let u=n.createElement("button");u.type="button",u.setAttribute("data-rm","map-breadcrumb-crumb"),u.setAttribute("data-path",g),u.setAttribute("data-current",g===c?"true":"false"),u.textContent=g===""?o:g.slice(g.lastIndexOf("/")+1),u.addEventListener("click",()=>{E(g)}),h.append(u)}},T=c=>{let g=t.levels.get(c);return g===void 0?[]:[...g.dirs.map(y=>({path:y.path,kind:"dir",lines:y.lines,changed:y.changed})),...g.files.map(y=>({path:y.path,kind:"file",lines:y.lines??1,changed:y.changed,...y.status===void 0?{}:{status:y.status}}))].sort((y,x)=>y.path<x.path?-1:y.path>x.path?1:0)},v=c=>{let g=et(t.edges??[],c,new Set(b.keys())),u=rt(n,g,b,c,{x:0,y:0,width:m,height:f});u!==null&&i.append(u),i.append(nt(n,{imports:d.imports,importedBy:d.importedBy,unresolved:d.unresolved}));let y=t.unresolvedFiles?.[c]??0;if(y>0){let A=b.get(c);A!==void 0&&i.append(it(n,y,{x:A.x+4,y:A.y+A.height-4},d.unresolvedTemplate))}let x=t.indexed;x!==void 0&&!x.complete&&i.append(ot(n,{x:8,y:Math.max(f-8,12)},d.partialTemplate,x.parsed,x.total))},M=()=>{for(let x of i.querySelectorAll("[data-highlighted]"))x.removeAttribute("data-highlighted");for(let x of h.querySelectorAll("[data-breadcrumb-target]"))x.removeAttribute("data-breadcrumb-target");for(let x of i.querySelectorAll('[data-rm="map-edges"], [data-rm="map-legend"], [data-rm="map-unresolved"]'))x.remove();for(let x of i.querySelectorAll('[data-hovered="true"]'))x.removeAttribute("data-hovered");if(p!==null&&i.querySelector(`[data-rm="map-tile"][data-kind="dir"][data-path="${N(p)}"]`)?.setAttribute("data-hovered","true"),p===null)return;let c=i.querySelector(`[data-rm="map-tile"][data-path="${N(p)}"]`);if(c!==null){c.setAttribute("data-highlighted","true"),v(p);return}let g=mt(p,l);if(g===null)return;let u=i.querySelector(`[data-rm="map-tile"][data-path="${N(g)}"]`);u!==null&&u.setAttribute("data-highlighted","true");let y=h.querySelector(`[data-rm="map-breadcrumb-crumb"][data-path="${N(l)}"]`);y!==null&&y.setAttribute("data-breadcrumb-target","true")},E=(c,g=!0)=>{c!==l&&(G(c),g&&r.onDrill?.(c))},G=c=>{l=c;let g=Wt(e,a);m=g.width,f=g.height,i.setAttribute("viewBox",`0 0 ${String(m)} ${String(f)}`),i.setAttribute("width","100%"),i.setAttribute("height",String(f)),i.replaceChildren(),i.append(at(n));let{level:u,hidden:y}=I(c);S(c);let x=new Map(u.dirs.map(w=>[w.path,w])),A=new Map(u.files.map(w=>[w.path,w])),pt=O({path:u.path,dirs:u.dirs,files:u.files},{width:m,height:f}),q={document:n,...r.onOpenFile===void 0?{}:{onOpenFile:r.onOpenFile},onDrill:w=>{E(w)},onHover:w=>{p=w,M(),r.onHover?.(w)},childrenOf:w=>T(w)};b=new Map;for(let w of pt.tiles){b.set(w.path,{x:w.x,y:w.y,width:w.width,height:w.height});let z=x.get(w.path);if(z!==void 0){i.append(Q(q,w,z));continue}let P=A.get(w.path);P!==void 0&&i.append(J(q,w,P))}if(y>0){let w=Math.min(Vt,f);i.append(Z(n,y,{x:0,y:Math.max(f-w,0),width:m,height:w}))}M()},C=c=>{c.key==="Escape"&&l!==""&&E(l.slice(0,Math.max(l.lastIndexOf("/"),0)))};return e.addEventListener("keydown",C),G(l),{destroy(){e.removeEventListener("keydown",C),s.remove()},path(){return l},setHighlight(c){p=c,M()},reveal(c){p=c,M()},up(){if(l==="")return!1;let c=l.slice(0,Math.max(l.lastIndexOf("/"),0));return E(c,!1),!0}}}function N(e){return e.replace(/["\\]/gu,"\\$&")}

    return module.exports.default ?? module.exports;
  }
});
