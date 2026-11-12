window.__ModuleLoader__.load({
  id: "dsh-review-map",
  chunk: "client.map.js",
  factory: (require) => {
    var module = { exports: {} };
    var exports = module.exports;
"use strict";var B=Object.defineProperty;var pt=Object.getOwnPropertyDescriptor;var ct=Object.getOwnPropertyNames;var ut=Object.prototype.hasOwnProperty;var gt=(e,t)=>{for(var a in t)B(e,a,{get:t[a],enumerable:!0})},ft=(e,t,a,r)=>{if(t&&typeof t=="object"||typeof t=="function")for(let n of ct(t))!ut.call(e,n)&&n!==a&&B(e,n,{get:()=>t[n],enumerable:!(r=pt(t,n))||r.enumerable});return e};var yt=e=>ft(B({},"__esModule",{value:!0}),e);var qt={};gt(qt,{createMap:()=>Pt,nearestVisibleAncestor:()=>mt,pathSegments:()=>lt});module.exports=yt(qt);function D(e){return Math.round(e*100)/100}function V(e){return e===null||!Number.isFinite(e)?1:Math.max(e,1)}function bt(e){let t=[];for(let a of e.dirs)t.push({path:a.path,kind:"dir",lines:V(a.lines),weight:V(a.lines)});for(let a of e.files){let r=V(a.lines);t.push({path:a.path,kind:"file",lines:r,weight:r})}return t.sort((a,r)=>a.path<r.path?-1:a.path>r.path?1:0)}function U(e,t,a){if(t<=0||a<=0)return Number.POSITIVE_INFINITY;let r=t/a,n=1;for(let o of e){if(o<=0)continue;let d=o/r,s=Math.max(r/d,d/r);s>n&&(n=s)}return n}function wt(e,t){let a=e.reduce((d,s)=>d+s,0),r=[];if(a<=0)return{rects:e.map(()=>({x:t.x,y:t.y,width:0,height:0})),rest:t};if(t.width>=t.height){let d=Math.min(a/t.height,t.width),s=t.y;for(let p of e){let i=t.height>0?p/a*t.height:0;r.push({x:t.x,y:s,width:d,height:i}),s+=i}return{rects:r,rest:{x:t.x+d,y:t.y,width:t.width-d,height:t.height}}}let n=Math.min(a/t.width,t.height),o=t.x;for(let d of e){let s=t.width>0?d/a*t.width:0;r.push({x:o,y:t.y,width:s,height:n}),o+=s}return{rects:r,rest:{x:t.x,y:t.y+n,width:t.width,height:t.height-n}}}function vt(e,t,a){let r=e.reduce((l,h)=>l+h,0),n=a*a;if(r<=0||t<=0||n<=0)return{weights:[...e],floored:!1};let o=e.filter(l=>t*l/r<n);if(o.length===0)return{weights:[...e],floored:!1};let d=o.length,s=o.reduce((l,h)=>l+h,0),p=t-n*d;if(p<=0)return{weights:[...e],floored:!1};let i=n*(r-s)/p;return!Number.isFinite(i)||i<=0?{weights:[...e],floored:!1}:{weights:e.map(l=>Math.max(l,i)),floored:!0}}function O(e,t){let a=Number.isFinite(t.width)?Math.max(t.width,0):0,r=Number.isFinite(t.height)?Math.max(t.height,0):0,n=t.minSide!==void 0&&t.minSide>0?t.minSide:4,o=bt(e);if(o.length===0)return{tiles:[]};if(a<=0||r<=0)return{tiles:o.map(S=>({path:S.path,kind:S.kind,lines:S.lines,x:0,y:0,width:0,height:0}))};let d=a*r,p=vt(o.map(S=>S.weight),d,n).weights,i=p.reduce((S,T)=>S+T,0),l=i>0?d/i:0,h=p.map(S=>S*l),b=[],m={x:0,y:0,width:a,height:r},f=0;for(;f<h.length;){let S=Math.min(m.width,m.height),T=h[f]??0,v=f+1,M=T,E=U([T],M,S);for(;v<h.length;){let c=h[v]??0,g=M+c,u=U(h.slice(f,v+1),g,S);if(u>E)break;E=u,M=g,v+=1}if(v>=h.length){let c=h.slice(f,v),g=c.reduce((u,y)=>u+y,0);if(m.width>=m.height){let u=m.y;for(let y of c){let x=g>0?y/g:1/c.length,A=m.height*x;b.push({x:m.x,y:u,width:m.width,height:A}),u+=A}}else{let u=m.x;for(let y of c){let x=g>0?y/g:1/c.length,A=m.width*x;b.push({x:u,y:m.y,width:A,height:m.height}),u+=A}}m={x:m.x,y:m.y,width:0,height:0},f=v;continue}let C=wt(h.slice(f,v),m);b.push(...C.rects),m=C.rest,f=v}return{tiles:o.map((S,T)=>{let v=b[T]??{x:0,y:0,width:0,height:0},M=D(v.x),E=D(v.y);return{path:S.path,kind:S.kind,lines:S.lines,x:M,y:E,width:D(D(v.x+v.width)-M),height:D(D(v.y+v.height)-E)}})}}var W="http://www.w3.org/2000/svg",_=34,H=18,xt=48,X=400,St={added:"+",modified:"~",deleted:"\xD7",renamed:"\u2192",copied:"\u29C9","type-changed":"\u21C4",untracked:"?",conflicted:"!",unknown:"\xB7"},kt={added:"solid",modified:"dash-dot",deleted:"dashed",renamed:"double",copied:"double-dot","type-changed":"dotted",untracked:"sparse",conflicted:"hatched",unknown:"none"};function Mt(e){return e.unindexed===!0||!e.changed?null:e.status??"modified"}function Et(e){return St[e]}function F(e){return kt[e]}function Tt(e){if(!e.changed)return null;if(e.unindexed===!0)return"unindexed";if(e.binary===!0)return"bin";if(e.status==="conflicted")return"conflict";if(e.status==="untracked")return"new";let t=e.additions??null,a=e.deletions??null;if(t===null&&a===null)return null;let r=[];return t!==null&&t>0&&r.push(`+${String(t)}`),a!==null&&a>0&&r.push(`\u2212${String(a)}`),r.length===0?"0":r.join(" ")}function $(e){let t=e.lastIndexOf("/");return t<0?e:e.slice(t+1)}function At(e,t){let a=e.hunks??[];if(a.length===0)return[];let r=t!==null&&t>0?t:null;if(r===null)return[{kind:"add",start:0,width:1}];let n=[];for(let o of a){let d=Math.min(Math.max((o.newStart-1)/r,0),1),s=o.newLines>0?o.newLines/r:0,p=Math.min(Math.max(s,o.newLines>0?.01:.02),1-d);n.push({kind:o.newLines>0?"add":"del",start:d,width:Math.max(p,.01)})}return n}function k(e,t,a){let r=e.createElementNS(W,t);for(let[n,o]of Object.entries(a))r.setAttribute(n,o);return r}function L(e,t,a){let r=k(e,"text",t);return r.textContent=a,r}function Q(e,t,a){let{document:r}=e,n=k(r,"g",{"data-rm":"map-tile","data-kind":"dir","data-path":t.path,"data-lines":String(t.lines),"data-changed":a.changed?"true":"false"});if(n.append(k(r,"rect",{x:String(t.x),y:String(t.y),width:String(t.width),height:String(t.height),"data-rm":"map-tile-rect","data-changed":a.changed?"true":"false"})),t.width>=_&&t.height>=H){let o=$(t.path)===""?t.path:$(t.path);n.append(L(r,{x:String(t.x+4),y:String(t.y+12),"data-rm":"map-dir-name"},o));let d=a.changedFiles??0,s=a.pending===!0,p=s?`${String(t.lines)} lines \xB7 pending`:a.changed?`${String(t.lines)} lines \xB7 ${String(d)} changed \xB7 +${String(a.additions??0)} \u2212${String(a.deletions??0)}`:`${String(t.lines)} lines`;t.height>=H*2&&n.append(L(r,{x:String(t.x+4),y:String(t.y+24),"data-rm":"map-dir-reading","data-pending":s?"true":"false"},p))}if(e.childrenOf!==void 0){let o=e.childrenOf(t.path),d=_t(o),s=Ot(e,t,d.crumbs,d.hidden);s!==null&&n.append(s)}if(e.onHover!==void 0){let o=e.onHover;n.addEventListener("pointerenter",()=>{o(t.path)}),n.addEventListener("pointerleave",()=>{o(null)})}if(e.onDrill!==void 0){let o=e.onDrill;n.addEventListener("click",()=>{o(t.path)})}return n}function J(e,t,a){let{document:r}=e,n=Mt(a),o=n==="deleted",d={"data-rm":"map-tile","data-kind":"file","data-path":t.path,"data-lines":String(t.lines),"data-changed":a.changed?"true":"false"};n!==null&&(d["data-status"]=n,d["data-shape"]=F(n)),a.additions!==void 0&&a.additions!==null&&(d["data-additions"]=String(a.additions)),a.deletions!==void 0&&a.deletions!==null&&(d["data-deletions"]=String(a.deletions)),o&&(d["data-deleted"]="true"),a.unindexed===!0?d["data-unindexed"]="true":a.binary===!0&&(d["data-binary"]="true");let s=k(r,"g",d),p={x:String(t.x),y:String(t.y),width:String(t.width),height:String(t.height),"data-rm":"map-tile-rect","data-changed":a.changed?"true":"false"};if(n!==null&&(p["data-status"]=n,p["data-shape"]=F(n)),o&&(p["data-deleted"]="true"),a.unindexed===!0&&(p["data-unindexed"]="true"),s.append(k(r,"rect",p)),t.width>=_&&t.height>=H&&a.changed){s.append(L(r,{x:String(t.x+4),y:String(t.y+12),"data-rm":"map-file-name"},$(t.path)));let h=Tt(a);h!==null&&t.height>=H*2&&s.append(L(r,{x:String(t.x+4),y:String(t.y+24),"data-rm":"map-file-churn"},h)),n!==null&&t.width>=_*1.6&&s.append(L(r,{x:String(t.x+t.width-4),y:String(t.y+12),"text-anchor":"end","data-rm":"map-file-mark","data-status":n,"data-shape":F(n)},Et(n)))}let l=a.changed&&a.unindexed!==!0?At(a,a.lines):[];if(l.length>0&&t.width>=xt&&t.height>=H){let h=Math.min(3,Math.max(2,t.height/12)),b=t.y+t.height-h-1,m=t.width-4,f=k(r,"g",{"data-rm":"map-bar","data-path":t.path});for(let I of l)f.append(k(r,"rect",{x:String(t.x+2+I.start*m),y:String(b),width:String(Math.max(I.width*m,.5)),height:String(h),"data-rm":"map-bar-seg","data-kind":I.kind,"data-start":I.start.toFixed(4),"data-width":I.width.toFixed(4)}));s.append(f)}if(e.onOpenFile!==void 0){let h=e.onOpenFile;s.addEventListener("click",()=>{h(t.path)})}if(e.onHover!==void 0){let h=e.onHover;s.addEventListener("pointerenter",()=>{h(t.path)}),s.addEventListener("pointerleave",()=>{h(null)})}return s}function Z(e,t,a){let r=k(e,"g",{"data-rm":"map-overflow","data-hidden":String(t)});return r.append(k(e,"rect",{x:String(a.x),y:String(a.y),width:String(a.width),height:String(a.height),"data-rm":"map-overflow-rect"})),a.width>=_&&a.height>=H&&r.append(L(e,{x:String(a.x+4),y:String(a.y+12),"data-rm":"map-overflow-text"},`${String(t)} more files`)),r}function tt(e){if(e.length<=X)return{files:[...e],hidden:0};let a=[...e].sort((r,n)=>{let o=r.lines??0,d=n.lines??0;return o!==d?d-o:r.path<n.path?-1:r.path>n.path?1:0}).slice(0,X).sort((r,n)=>r.path<n.path?-1:r.path>n.path?1:0);return{files:a,hidden:e.length-a.length}}var It=20,Lt=12;function K(e){let t=e.lastIndexOf("/");return t<0?"":e.slice(0,t)}function et(e,t,a){let r=e.filter(i=>i.from===t),n=e.filter(i=>i.to===t),o=r.length+n.length;if(o===0)return{edges:[],aggregated:!1,total:0};let d=[...r.map(i=>({from:i.from,to:i.to,flow:"imports",state:i.state,count:1,aggregated:!1})),...n.map(i=>({from:i.from,to:i.to,flow:"imported-by",state:i.state,count:1,aggregated:!1}))];if(o<=It)return{edges:d,aggregated:!1,total:o};let s=new Map;for(let i of d){let l=i.from===t?t:K(i.from),h=i.to===t?t:K(i.to);if(l===h)continue;let b=`${l}\0${h}\0${i.flow}`,m=s.get(b);m===void 0?s.set(b,{...i,from:l,to:h,count:1,aggregated:l!==i.from||h!==i.to}):s.set(b,{...m,count:m.count+i.count,aggregated:!0})}return{edges:[...s.values()].sort((i,l)=>i.count!==l.count?l.count-i.count:i.from!==l.from?i.from<l.from?-1:1:i.to<l.to?-1:i.to>l.to?1:0).slice(0,Lt),aggregated:!0,total:o}}function Y(e,t){let a={x:e.x+e.width/2,y:e.y+e.height/2},r=t.x-a.x,n=t.y-a.y;if(r===0&&n===0)return a;let o=Math.abs(n/(r===0?Number.EPSILON:r)),d=e.height/(e.width===0?Number.EPSILON:e.width);return o<=d?{x:r>=0?e.x+e.width:e.x,y:a.y}:{x:a.x,y:n>=0?e.y+e.height:e.y}}function at(e,t,a,r,n){if(t.edges.length===0)return null;let o=k(e,"g",{"data-rm":"map-edges","data-aggregated":t.aggregated?"true":"false"}),d=p=>({x:p.x+p.width/2,y:p.y+p.height/2}),s=p=>{let i=a.get(p);if(i!==void 0)return i;let l=p;for(;;){let h=l.lastIndexOf("/");if(h<0)break;l=l.slice(0,h);let b=a.get(l);if(b!==void 0)return b}return a.get("")??n};for(let p of t.edges){let i=s(p.from),l=s(p.to);if(i===void 0||l===void 0||i===l)continue;let h=Y(i,d(l)),b=Y(l,d(i)),m=k(e,"path",{d:`M ${String(h.x)} ${String(h.y)} Q ${String((h.x+b.x)/2)} ${String((h.y+b.y)/2-12)} ${String(b.x)} ${String(b.y)}`,"data-rm":"map-edge","data-flow":p.flow,"data-state":p.state,"data-from":p.from,"data-to":p.to,"data-count":String(p.count),"data-aggregated":p.aggregated?"true":"false","data-highlighted-from":r,"marker-end":p.flow==="imports"?"url(#rm-arrow-imports)":"url(#rm-arrow-imported-by)",fill:"none"});o.append(m)}return o.childElementCount===0?null:o}function rt(e){let t=k(e,"defs",{});for(let[a,r]of[["rm-arrow-imports",!1],["rm-arrow-imported-by",!0]]){let n=k(e,"marker",{id:a,viewBox:"0 0 8 8",refX:"7",refY:"4",markerWidth:"6",markerHeight:"6",orient:"auto-start-reverse","data-rm":"map-arrow","data-filled":r?"true":"false"});n.append(k(e,"path",{d:r?"M 0 0 L 8 4 L 0 8 z":"M 0 1 L 7 4 L 0 7","data-rm":"map-arrow-head",fill:r?"currentColor":"none",stroke:"currentColor","stroke-width":"1.2"})),t.append(n)}return t}function nt(e,t){let a=k(e,"g",{"data-rm":"map-legend"});return[{key:"imports",label:t.imports,flow:"imports"},{key:"imported-by",label:t.importedBy,flow:"imported-by"},{key:"unresolved",label:t.unresolved,flow:"unresolved"}].forEach((n,o)=>{let d=12+o*13;a.append(k(e,"line",{x1:"8",y1:String(d-3),x2:"26",y2:String(d-3),"data-rm":"map-legend-swatch","data-flow":n.flow})),a.append(L(e,{x:"30",y:String(d),"data-rm":"map-legend-label","data-flow":n.flow},n.label))}),a}function it(e,t,a,r){return L(e,{x:String(a.x),y:String(a.y),"data-rm":"map-unresolved","data-count":String(t)},r.replace("{count}",String(t)))}function ot(e,t,a,r,n){return L(e,{x:String(t.x),y:String(t.y),"data-rm":"map-partial","data-parsed":String(r),"data-total":String(n)},a.replace("{parsed}",String(r)).replace("{total}",String(n)))}var j=600,Rt=26,Ht=11;function Gt(e,t){let r=Math.max(1,Math.floor(t/5.2));return e.length<=r?e:r<=1?"\u2026":`${e.slice(0,r-1)}\u2026`}function Dt(e){return Math.max(4,Math.min(8,Math.min(e.width,e.height)*.06))}function Ct(e){return e.width<_||e.height<H?0:e.height>=H*2?26:14}function _t(e){if(e.length<=j)return{crumbs:[...e],hidden:0};let a=[...e].sort((r,n)=>r.lines!==n.lines?n.lines-r.lines:r.path<n.path?-1:r.path>n.path?1:0).slice(0,j).sort((r,n)=>r.path<n.path?-1:r.path>n.path?1:0);return{crumbs:a,hidden:e.length-a.length}}function Ot(e,t,a,r){let{document:n}=e,o=Dt(t),d=t.y+Ct(t)+o,s={x:t.x+o,y:d,width:Math.max(t.width-o*2,0),height:Math.max(t.y+t.height-o-d,0)};if(s.width<6||s.height<6||a.length===0&&r===0)return null;let p=k(n,"g",{"data-rm":"map-crumbs","data-path":t.path}),i=r>0?Math.min(10,s.height*.2):0,l={...s,height:Math.max(s.height-i,0)};if(a.length>0&&l.height>=4){let h=O({path:t.path,dirs:a.filter(m=>m.kind==="dir").map(m=>({path:m.path,lines:m.lines,changed:m.changed})),files:a.filter(m=>m.kind==="file").map(m=>({path:m.path,lines:m.lines,changed:m.changed}))},{width:l.width,height:l.height,minSide:.5}),b=new Map(a.map(m=>[m.path,m]));for(let m of h.tiles){let f=b.get(m.path);if(f===void 0)continue;let I=R(l.x+m.x),S=R(l.y+m.y),T=R(m.width),v=R(m.height),M={x:String(I),y:String(S),width:String(T),height:String(v),"data-rm":"map-crumb","data-kind":f.kind,"data-path":f.path,"data-lines":String(f.lines),"data-changed":f.changed?"true":"false","data-emphasis":f.changed?"strong":"quiet"};f.status!==void 0&&(M["data-status"]=f.status,M["data-shape"]=F(f.status));let E=k(n,"rect",M);if(e.onHover!==void 0){let G=e.onHover;E.addEventListener("pointerenter",()=>{G(t.path)}),E.addEventListener("pointerleave",()=>{G(null)})}p.append(E),T>=Rt&&v>=Ht&&p.append(L(n,{x:String(I+2),y:String(S+Math.min(v-2,9)),"data-rm":"map-crumb-label","data-path":f.path},Gt($(f.path),T-4)))}}if(r>0){let h=k(n,"rect",{x:String(R(s.x)),y:String(R(s.y+s.height-i)),width:String(R(s.width)),height:String(R(i)),"data-rm":"map-crumb-overflow","data-count":String(r),"data-path":t.path});p.append(h)}return p.childElementCount===0?null:p}function R(e){return Math.round(e*100)/100}var dt="data-rm-map",Ft=`/* The directory map's own stylesheet, injected by the chunk that draws it.
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
`;function st(e){let t=e.querySelector(`style[${dt}]`);if(t!==null)return t;let a=e.createElement("style");return a.setAttribute(dt,""),a.textContent=Ft,e.head.append(a),a}var $t=900,Nt=520,Bt=26,Vt=20;function Wt(e,t){let a=t.width??(e.clientWidth>0?e.clientWidth:$t),r=t.height??(e.clientHeight>0?e.clientHeight:Nt);return{width:a,height:Math.max(r-Bt,0)}}function lt(e){let t=[""];if(e==="")return t;let a="";for(let r of e.split("/"))r!==""&&(a=a===""?r:`${a}/${r}`,t.push(a));return t}function mt(e,t){if(t!==""&&e!==t&&!e.startsWith(`${t}/`))return null;let a=t===""?e:e.slice(t.length+1);if(a==="")return null;let r=a.indexOf("/"),n=r<0?a:a.slice(0,r);return t===""?n:`${t}/${n}`}function Pt(e,t,a={},r={}){let n=e.ownerDocument;st(n);let o=r.title??"repo",d=r.strings??{imports:"imports",importedBy:"imported by",unresolved:"unresolved",unresolvedTemplate:"\u2265{count} unresolved",partialTemplate:"indexed {parsed}/{total}"},s=n.createElement("div");s.setAttribute("data-rm","map-root");let p=n.createElement("nav");p.setAttribute("data-rm","map-breadcrumb"),s.append(p);let i=n.createElementNS(W,"svg");i.setAttribute("data-review-map","map"),i.setAttribute("preserveAspectRatio","none"),s.append(i),e.append(s);let l=r.initialPath!==void 0&&t.levels.has(r.initialPath)?r.initialPath:t.rootPath,h=null,b=new Map,m=0,f=0,I=c=>{let g=t.levels.get(c);if(g===void 0)return{level:{path:c,dirs:[],files:[]},hidden:0};let u=tt(g.files);return{level:{path:g.path,dirs:g.dirs,files:u.files},hidden:u.hidden}},S=c=>{p.replaceChildren();for(let g of lt(c)){let u=n.createElement("button");u.type="button",u.setAttribute("data-rm","map-breadcrumb-crumb"),u.setAttribute("data-path",g),u.setAttribute("data-current",g===c?"true":"false"),u.textContent=g===""?o:g.slice(g.lastIndexOf("/")+1),u.addEventListener("click",()=>{E(g)}),p.append(u)}},T=c=>{let g=t.levels.get(c);return g===void 0?[]:[...g.dirs.map(y=>({path:y.path,kind:"dir",lines:y.lines,changed:y.changed})),...g.files.map(y=>({path:y.path,kind:"file",lines:y.lines??1,changed:y.changed,...y.status===void 0?{}:{status:y.status}}))].sort((y,x)=>y.path<x.path?-1:y.path>x.path?1:0)},v=c=>{let g=et(t.edges??[],c,new Set(b.keys())),u=at(n,g,b,c,{x:0,y:0,width:m,height:f});u!==null&&i.append(u),i.append(nt(n,{imports:d.imports,importedBy:d.importedBy,unresolved:d.unresolved}));let y=t.unresolvedFiles?.[c]??0;if(y>0){let A=b.get(c);A!==void 0&&i.append(it(n,y,{x:A.x+4,y:A.y+A.height-4},d.unresolvedTemplate))}let x=t.indexed;x!==void 0&&!x.complete&&i.append(ot(n,{x:8,y:Math.max(f-8,12)},d.partialTemplate,x.parsed,x.total))},M=()=>{for(let x of i.querySelectorAll("[data-highlighted]"))x.removeAttribute("data-highlighted");for(let x of p.querySelectorAll("[data-breadcrumb-target]"))x.removeAttribute("data-breadcrumb-target");for(let x of i.querySelectorAll('[data-rm="map-edges"], [data-rm="map-legend"], [data-rm="map-unresolved"]'))x.remove();for(let x of i.querySelectorAll('[data-hovered="true"]'))x.removeAttribute("data-hovered");if(h!==null&&i.querySelector(`[data-rm="map-tile"][data-kind="dir"][data-path="${N(h)}"]`)?.setAttribute("data-hovered","true"),h===null)return;let c=i.querySelector(`[data-rm="map-tile"][data-path="${N(h)}"]`);if(c!==null){c.setAttribute("data-highlighted","true"),v(h);return}let g=mt(h,l);if(g===null)return;let u=i.querySelector(`[data-rm="map-tile"][data-path="${N(g)}"]`);u!==null&&u.setAttribute("data-highlighted","true");let y=p.querySelector(`[data-rm="map-breadcrumb-crumb"][data-path="${N(l)}"]`);y!==null&&y.setAttribute("data-breadcrumb-target","true")},E=(c,g=!0)=>{c!==l&&(G(c),g&&a.onDrill?.(c))},G=c=>{l=c;let g=Wt(e,r);m=g.width,f=g.height,i.setAttribute("viewBox",`0 0 ${String(m)} ${String(f)}`),i.setAttribute("width","100%"),i.setAttribute("height",String(f)),i.replaceChildren(),i.append(rt(n));let{level:u,hidden:y}=I(c);S(c);let x=new Map(u.dirs.map(w=>[w.path,w])),A=new Map(u.files.map(w=>[w.path,w])),ht=O({path:u.path,dirs:u.dirs,files:u.files},{width:m,height:f}),P={document:n,...a.onOpenFile===void 0?{}:{onOpenFile:a.onOpenFile},onDrill:w=>{E(w)},onHover:w=>{h=w,M(),a.onHover?.(w)},childrenOf:w=>T(w)};b=new Map;for(let w of ht.tiles){b.set(w.path,{x:w.x,y:w.y,width:w.width,height:w.height});let q=x.get(w.path);if(q!==void 0){i.append(Q(P,w,q));continue}let z=A.get(w.path);z!==void 0&&i.append(J(P,w,z))}if(y>0){let w=Math.min(Vt,f);i.append(Z(n,y,{x:0,y:Math.max(f-w,0),width:m,height:w}))}M()},C=c=>{c.key==="Escape"&&l!==""&&E(l.slice(0,Math.max(l.lastIndexOf("/"),0)))};return e.addEventListener("keydown",C),G(l),{destroy(){e.removeEventListener("keydown",C),s.remove()},path(){return l},setHighlight(c){h=c,M()},reveal(c){h=c,M()},up(){if(l==="")return!1;let c=l.slice(0,Math.max(l.lastIndexOf("/"),0));return E(c,!1),!0}}}function N(e){return e.replace(/["\\]/gu,"\\$&")}

    return module.exports.default ?? module.exports;
  }
});
