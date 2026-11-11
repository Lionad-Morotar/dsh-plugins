window.__ModuleLoader__.load({
  id: "dsh-review-map",
  chunk: "client.map.js",
  factory: (require) => {
    var module = { exports: {} };
    var exports = module.exports;
"use strict";var F=Object.defineProperty;var Y=Object.getOwnPropertyDescriptor;var K=Object.getOwnPropertyNames;var j=Object.prototype.hasOwnProperty;var J=(e,t)=>{for(var a in t)F(e,a,{get:t[a],enumerable:!0})},Q=(e,t,a,r)=>{if(t&&typeof t=="object"||typeof t=="function")for(let n of K(t))!j.call(e,n)&&n!==a&&F(e,n,{get:()=>t[n],enumerable:!(r=Y(t,n))||r.enumerable});return e};var Z=e=>Q(F({},"__esModule",{value:!0}),e);var ft={};J(ft,{createMap:()=>gt,nearestVisibleAncestor:()=>z,pathSegments:()=>U});module.exports=Z(ft);function _(e){return Math.round(e*100)/100}function R(e){return e===null||!Number.isFinite(e)?1:Math.max(e,1)}function tt(e){let t=[];for(let a of e.dirs)t.push({path:a.path,kind:"dir",lines:R(a.lines),weight:R(a.lines)});for(let a of e.files){let r=R(a.lines);t.push({path:a.path,kind:"file",lines:r,weight:r})}return t.sort((a,r)=>a.path<r.path?-1:a.path>r.path?1:0)}function C(e,t,a){if(t<=0||a<=0)return Number.POSITIVE_INFINITY;let r=t/a,n=1;for(let d of e){if(d<=0)continue;let i=d/r,o=Math.max(r/i,i/r);o>n&&(n=o)}return n}function et(e,t){let a=e.reduce((i,o)=>i+o,0),r=[];if(a<=0)return{rects:e.map(()=>({x:t.x,y:t.y,width:0,height:0})),rest:t};if(t.width>=t.height){let i=Math.min(a/t.height,t.width),o=t.y;for(let h of e){let m=t.height>0?h/a*t.height:0;r.push({x:t.x,y:o,width:i,height:m}),o+=m}return{rects:r,rest:{x:t.x+i,y:t.y,width:t.width-i,height:t.height}}}let n=Math.min(a/t.width,t.height),d=t.x;for(let i of e){let o=t.width>0?i/a*t.width:0;r.push({x:d,y:t.y,width:o,height:n}),d+=o}return{rects:r,rest:{x:t.x,y:t.y+n,width:t.width,height:t.height-n}}}function at(e,t,a){let r=e.reduce((w,p)=>w+p,0),n=a*a;if(r<=0||t<=0||n<=0)return{weights:[...e],floored:!1};let d=e.filter(w=>t*w/r<n);if(d.length===0)return{weights:[...e],floored:!1};let i=d.length,o=d.reduce((w,p)=>w+p,0),h=t-n*i;if(h<=0)return{weights:[...e],floored:!1};let m=n*(r-o)/h;return!Number.isFinite(m)||m<=0?{weights:[...e],floored:!1}:{weights:e.map(w=>Math.max(w,m)),floored:!0}}function $(e,t){let a=Number.isFinite(t.width)?Math.max(t.width,0):0,r=Number.isFinite(t.height)?Math.max(t.height,0):0,n=t.minSide!==void 0&&t.minSide>0?t.minSide:4,d=tt(e);if(d.length===0)return{tiles:[]};if(a<=0||r<=0)return{tiles:d.map(f=>({path:f.path,kind:f.kind,lines:f.lines,x:0,y:0,width:0,height:0}))};let i=a*r,h=at(d.map(f=>f.weight),i,n).weights,m=h.reduce((f,l)=>f+l,0),w=m>0?i/m:0,p=h.map(f=>f*w),k=[],u={x:0,y:0,width:a,height:r},b=0;for(;b<p.length;){let f=Math.min(u.width,u.height),l=p[b]??0,s=b+1,c=l,y=C([l],c,f);for(;s<p.length;){let S=p[s]??0,M=c+S,x=C(p.slice(b,s+1),M,f);if(x>y)break;y=x,c=M,s+=1}if(s>=p.length){let S=p.slice(b,s),M=S.reduce((x,g)=>x+g,0);if(u.width>=u.height){let x=u.y;for(let g of S){let H=M>0?g/M:1/S.length,T=u.height*H;k.push({x:u.x,y:x,width:u.width,height:T}),x+=T}}else{let x=u.x;for(let g of S){let H=M>0?g/M:1/S.length,T=u.width*H;k.push({x,y:u.y,width:T,height:u.height}),x+=T}}u={x:u.x,y:u.y,width:0,height:0},b=s;continue}let A=et(p.slice(b,s),u);k.push(...A.rects),u=A.rest,b=s}return{tiles:d.map((f,l)=>{let s=k[l]??{x:0,y:0,width:0,height:0},c=_(s.x),y=_(s.y);return{path:f.path,kind:f.kind,lines:f.lines,x:c,y,width:_(_(s.x+s.width)-c),height:_(_(s.y+s.height)-y)}})}}var N="http://www.w3.org/2000/svg";var rt={added:"+",modified:"~",deleted:"\xD7",renamed:"\u2192",copied:"\u29C9","type-changed":"\u21C4",untracked:"?",conflicted:"!",unknown:"\xB7"},nt={added:"solid",modified:"dash-dot",deleted:"dashed",renamed:"double",copied:"double-dot","type-changed":"dotted",untracked:"sparse",conflicted:"hatched",unknown:"none"};function it(e){return e.changed?e.status??"modified":null}function st(e){return rt[e]}function D(e){return nt[e]}function ot(e){if(!e.changed)return null;if(e.binary===!0)return"bin";if(e.status==="conflicted")return"conflict";if(e.status==="untracked")return"new";let t=e.additions??null,a=e.deletions??null;if(t===null&&a===null)return null;let r=[];return t!==null&&r.push(`+${String(t)}`),a!==null&&r.push(`\u2212${String(a)}`),r.join(" ")}function G(e){let t=e.lastIndexOf("/");return t<0?e:e.slice(t+1)}function dt(e,t){let a=e.hunks??[];if(a.length===0)return[];let r=t!==null&&t>0?t:null;if(r===null)return[{kind:"add",start:0,width:1}];let n=[];for(let d of a){let i=Math.min(Math.max((d.newStart-1)/r,0),1),o=d.newLines>0?d.newLines/r:0,h=Math.min(Math.max(o,d.newLines>0?.01:.02),1-i);n.push({kind:d.newLines>0?"add":"del",start:i,width:Math.max(h,.01)})}return n}function E(e,t,a){let r=e.createElementNS(N,t);for(let[n,d]of Object.entries(a))r.setAttribute(n,d);return r}function L(e,t,a){let r=E(e,"text",t);return r.textContent=a,r}function W(e,t,a){let{document:r}=e,n=E(r,"g",{"data-rm":"map-tile","data-kind":"dir","data-path":t.path,"data-lines":String(t.lines),"data-changed":a.changed?"true":"false"});if(n.append(E(r,"rect",{x:String(t.x),y:String(t.y),width:String(t.width),height:String(t.height),"data-rm":"map-tile-rect","data-changed":a.changed?"true":"false"})),t.width>=34&&t.height>=18){let d=G(t.path)===""?t.path:G(t.path);n.append(L(r,{x:String(t.x+4),y:String(t.y+12),"data-rm":"map-dir-name"},d));let i=a.changedFiles??0,o=a.pending===!0,h=o?`${String(t.lines)} lines \xB7 pending`:a.changed?`${String(t.lines)} lines \xB7 ${String(i)} changed \xB7 +${String(a.additions??0)} \u2212${String(a.deletions??0)}`:`${String(t.lines)} lines`;t.height>=36&&n.append(L(r,{x:String(t.x+4),y:String(t.y+24),"data-rm":"map-dir-reading","data-pending":o?"true":"false"},h))}if(e.onDrill!==void 0){let d=e.onDrill;n.addEventListener("click",()=>{d(t.path)})}return n}function V(e,t,a){let{document:r}=e,n=it(a),d=n==="deleted",i={"data-rm":"map-tile","data-kind":"file","data-path":t.path,"data-lines":String(t.lines),"data-changed":a.changed?"true":"false"};n!==null&&(i["data-status"]=n,i["data-shape"]=D(n)),a.additions!==void 0&&a.additions!==null&&(i["data-additions"]=String(a.additions)),a.deletions!==void 0&&a.deletions!==null&&(i["data-deletions"]=String(a.deletions)),d&&(i["data-deleted"]="true"),a.binary===!0&&(i["data-binary"]="true");let o=E(r,"g",i),h={x:String(t.x),y:String(t.y),width:String(t.width),height:String(t.height),"data-rm":"map-tile-rect","data-changed":a.changed?"true":"false"};if(n!==null&&(h["data-status"]=n,h["data-shape"]=D(n)),d&&(h["data-deleted"]="true"),o.append(E(r,"rect",h)),t.width>=34&&t.height>=18&&a.changed){o.append(L(r,{x:String(t.x+4),y:String(t.y+12),"data-rm":"map-file-name"},G(t.path)));let p=ot(a);p!==null&&t.height>=36&&o.append(L(r,{x:String(t.x+4),y:String(t.y+24),"data-rm":"map-file-churn"},p)),n!==null&&t.width>=34*1.6&&o.append(L(r,{x:String(t.x+t.width-4),y:String(t.y+12),"text-anchor":"end","data-rm":"map-file-mark","data-status":n,"data-shape":D(n)},st(n)))}let w=a.changed?dt(a,a.lines):[];if(w.length>0&&t.width>=48&&t.height>=18){let p=Math.min(3,Math.max(2,t.height/12)),k=t.y+t.height-p-1,u=t.width-4,b=E(r,"g",{"data-rm":"map-bar","data-path":t.path});for(let v of w)b.append(E(r,"rect",{x:String(t.x+2+v.start*u),y:String(k),width:String(Math.max(v.width*u,.5)),height:String(p),"data-rm":"map-bar-seg","data-kind":v.kind,"data-start":v.start.toFixed(4),"data-width":v.width.toFixed(4)}));o.append(b)}if(e.onOpenFile!==void 0){let p=e.onOpenFile;o.addEventListener("click",()=>{p(t.path)})}if(e.onHover!==void 0){let p=e.onHover;o.addEventListener("pointerenter",()=>{p(t.path)}),o.addEventListener("pointerleave",()=>{p(null)})}return o}function X(e,t,a){let r=E(e,"g",{"data-rm":"map-overflow","data-hidden":String(t)});return r.append(E(e,"rect",{x:String(a.x),y:String(a.y),width:String(a.width),height:String(a.height),"data-rm":"map-overflow-rect"})),a.width>=34&&a.height>=18&&r.append(L(e,{x:String(a.x+4),y:String(a.y+12),"data-rm":"map-overflow-text"},`${String(t)} more files`)),r}function B(e){if(e.length<=400)return{files:[...e],hidden:0};let a=[...e].sort((r,n)=>{let d=r.lines??0,i=n.lines??0;return d!==i?i-d:r.path<n.path?-1:r.path>n.path?1:0}).slice(0,400).sort((r,n)=>r.path<n.path?-1:r.path>n.path?1:0);return{files:a,hidden:e.length-a.length}}var q="data-rm-map",lt=`/* The directory map's own stylesheet, injected by the chunk that draws it.
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
`;function P(e){let t=e.querySelector(`style[${q}]`);if(t!==null)return t;let a=e.createElement("style");return a.setAttribute(q,""),a.textContent=lt,e.head.append(a),a}var ht=900,ct=520,pt=26,ut=20;function mt(e,t){let a=t.width??(e.clientWidth>0?e.clientWidth:ht),r=t.height??(e.clientHeight>0?e.clientHeight:ct);return{width:a,height:Math.max(r-pt,0)}}function U(e){let t=[""];if(e==="")return t;let a="";for(let r of e.split("/"))r!==""&&(a=a===""?r:`${a}/${r}`,t.push(a));return t}function z(e,t){if(t!==""&&e!==t&&!e.startsWith(`${t}/`))return null;let a=t===""?e:e.slice(t.length+1);if(a==="")return null;let r=a.indexOf("/"),n=r<0?a:a.slice(0,r);return t===""?n:`${t}/${n}`}function gt(e,t,a={},r={}){let n=e.ownerDocument;P(n);let d=r.title??"repo",i=n.createElement("div");i.setAttribute("data-rm","map-root");let o=n.createElement("nav");o.setAttribute("data-rm","map-breadcrumb"),i.append(o);let h=n.createElementNS(N,"svg");h.setAttribute("data-review-map","map"),h.setAttribute("preserveAspectRatio","none"),i.append(h),e.append(i);let m=t.rootPath,w=null,p=l=>{let s=t.levels.get(l);if(s===void 0)return{level:{path:l,dirs:[],files:[]},hidden:0};let c=B(s.files);return{level:{path:s.path,dirs:s.dirs,files:c.files},hidden:c.hidden}},k=l=>{o.replaceChildren();for(let s of U(l)){let c=n.createElement("button");c.type="button",c.setAttribute("data-rm","map-crumb"),c.setAttribute("data-path",s),c.setAttribute("data-current",s===l?"true":"false"),c.textContent=s===""?d:s.slice(s.lastIndexOf("/")+1),c.addEventListener("click",()=>{b(s)}),o.append(c)}},u=()=>{for(let I of h.querySelectorAll("[data-highlighted]"))I.removeAttribute("data-highlighted");for(let I of o.querySelectorAll("[data-breadcrumb-target]"))I.removeAttribute("data-breadcrumb-target");if(w===null)return;let l=h.querySelector(`[data-rm="map-tile"][data-path="${O(w)}"]`);if(l!==null){l.setAttribute("data-highlighted","true");return}let s=z(w,m);if(s===null)return;let c=h.querySelector(`[data-rm="map-tile"][data-path="${O(s)}"]`);c!==null&&c.setAttribute("data-highlighted","true");let y=o.querySelector(`[data-rm="map-crumb"][data-path="${O(m)}"]`);y!==null&&y.setAttribute("data-breadcrumb-target","true")},b=(l,s=!0)=>{l!==m&&(v(l),s&&a.onDrill?.(l))},v=l=>{m=l;let{width:s,height:c}=mt(e,r);h.setAttribute("viewBox",`0 0 ${String(s)} ${String(c)}`),h.setAttribute("width","100%"),h.setAttribute("height",String(c)),h.replaceChildren();let{level:y,hidden:I}=p(l);k(l);let A=new Map(y.dirs.map(g=>[g.path,g])),S=new Map(y.files.map(g=>[g.path,g])),M=$({path:y.path,dirs:y.dirs,files:y.files},{width:s,height:c}),x={document:n,...a.onOpenFile===void 0?{}:{onOpenFile:a.onOpenFile},onDrill:g=>{b(g)},...a.onHover===void 0?{}:{onHover:a.onHover}};for(let g of M.tiles){let H=A.get(g.path);if(H!==void 0){h.append(W(x,g,H));continue}let T=S.get(g.path);T!==void 0&&h.append(V(x,g,T))}if(I>0){let g=Math.min(ut,c);h.append(X(n,I,{x:0,y:Math.max(c-g,0),width:s,height:g}))}u()},f=l=>{l.key==="Escape"&&m!==""&&b(m.slice(0,Math.max(m.lastIndexOf("/"),0)))};return e.addEventListener("keydown",f),v(m),{destroy(){e.removeEventListener("keydown",f),i.remove()},path(){return m},setHighlight(l){w=l,u()},reveal(l){w=l,u()},up(){if(m==="")return!1;let l=m.slice(0,Math.max(m.lastIndexOf("/"),0));return b(l,!1),!0}}}function O(e){return e.replace(/["\\]/gu,"\\$&")}

    return module.exports.default ?? module.exports;
  }
});
