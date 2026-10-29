window.__ModuleLoader__.load({
  id: "dsh-command-panel",
  factory: (require) => {
    var module = { exports: {} };
    var exports = module.exports;
"use strict";var Y=Object.defineProperty;var fn=Object.getOwnPropertyDescriptor;var mn=Object.getOwnPropertyNames;var gn=Object.prototype.hasOwnProperty;var yn=(e,n)=>{for(var o in n)Y(e,o,{get:n[o],enumerable:!0})},hn=(e,n,o,s)=>{if(n&&typeof n=="object"||typeof n=="function")for(let t of mn(n))!gn.call(e,t)&&t!==o&&Y(e,t,{get:()=>n[t],enumerable:!(s=fn(n,t))||s.enumerable});return e};var wn=e=>hn(Y({},"__esModule",{value:!0}),e);var ao={};yn(ao,{PLATFORM_PRIMITIVES:()=>qe,PLATFORM_REACT:()=>Fe,PLATFORM_REACT_DOM:()=>Be,boot:()=>io,clientPlugin:()=>je,default:()=>ro,detectPlatform:()=>Ue,inject:()=>_e});module.exports=wn(ao);var vn=/^[A-Za-z]:[\\/]/,Sn=/^\\\\/;function bn(e){return e.startsWith("/")||vn.test(e)||Sn.test(e)}function kn(e){return e.includes("\\")&&!e.includes("/")?"\\":"/"}function de(e,n){let o=n.startsWith("./")?n.slice(2):n;if(bn(o)||e==="")return o;let s=kn(e),t=e.endsWith(s)?e.slice(0,-s.length):e,c=/[\\/]$/.test(o),a=o.split(/[\\/]/).filter(y=>y!==""),l=a.join(s)+(c&&a.length>0?s:"");return t===""?`${s}${l}`:l===""?`${t}${s}`:`${t}${s}${l}`}var xn="(\uFF08[{\u3010\u300C\u300E\"'`",Pn=")]}\uFF09\u3011\u300D\u300F\"'`";function le(e){return e===void 0||/\s/.test(e)}function G(e,n,o){let s=Math.max(0,Math.min(n,e.length)),t=s>0?e[s-1]:void 0,c=s<e.length?e[s]:void 0,a=t!==void 0&&!le(t)&&!xn.includes(t),l=c!==void 0&&!le(c)&&!Pn.includes(c)&&!o.endsWith("/")&&!o.endsWith("\\");return`${a?" ":""}${o}${l?" ":""}`}function Q(e){let n=e.path.replace(/^\.\//,"");return e.kind!=="directory"||n===""||n.endsWith("/")?n:`${n}/`}function ue(e,n){return e.candidates.map(o=>{let s=de(e.cwd,Q(o)),t=Q(o),c=Math.max(t.lastIndexOf("/"),t.lastIndexOf("\\"));return{key:`file:${o.kind}:${o.path}`,label:t,alias:c>=0?t.slice(c+1):t,detail:o.kind==="directory"?n.directory:void 0,action:{kind:"insert-path",absolutePath:s}}})}function pe(e,n){return e.map(o=>({key:`command:${o.name}`,label:`/${o.name}`,detail:o.description,hint:o.input===void 0?void 0:o.input.hint,group:n.groupCommands,action:{kind:"execute-command",name:o.name,needsInput:o.input!==void 0}}))}function fe(e,n,o){return n.map(s=>({key:`catalog:${s.id}`,label:`${e.categoryNames[s.category]}\uFF1A${e.actionLabels[s.id]??s.id}`,hint:s.shortcutId===void 0?void 0:o.get(s.shortcutId),action:s.action}))}function me(e,n,o){let s=new Set(n.archivedSessionIds),t=o.kind==="workspace"?Rn(n).get(o.workspaceId):void 0,c=[];for(let a of e.ids){let l=e.byId[a];l!==void 0&&(l.blank||l.origin==="subagent"||s.has(a)||o.kind==="workspace"&&(t===void 0||!t.has(a))||o.kind==="ungrouped"&&ge(n,a)||c.push(l))}return c}function Rn(e){let n=new Map;for(let o of e.items)n.set(o.workspaceId,new Set(o.sessionIds));return n}function ge(e,n){for(let o of e.items)if(o.sessionIds.includes(n))return!0;return!1}function Cn(e,n){for(let o of e.items)if(o.sessionIds.includes(n))return o.title}function In(e,n,o){let s=0;for(let t of n.sessionIds){let c=e.byId[t];c===void 0||c.blank||c.origin==="subagent"||o.has(t)||(s+=1)}return s}function ye(e,n,o){let s=new Set(e.archivedSessionIds),t=[];for(let a of e.items){let l=In(n,a,s);t.push({key:`workspace:${a.workspaceId}`,label:a.title,alias:a.path,detail:a.path,hint:o.sessionsCount(l),action:{kind:"drill",scope:{kind:"workspace",workspaceId:a.workspaceId},title:a.title}})}let c=n.ids.filter(a=>{let l=n.byId[a];return l===void 0||l.blank||l.origin==="subagent"||s.has(a)?!1:!ge(e,a)}).length;return t.push({key:"scope:all",label:o.allSessions,detail:o.allSessionsDetail,hint:o.sessionsCount(me(n,e,{kind:"all"}).length),action:{kind:"drill",scope:{kind:"all"},title:o.allSessions}}),c>0&&t.push({key:"scope:ungrouped",label:o.ungrouped,hint:o.sessionsCount(c),action:{kind:"drill",scope:{kind:"ungrouped"},title:o.ungrouped}}),t}function he(e,n,o,s,t){let c=[...me(e,n,o)];return c.sort((a,l)=>l.updatedAt-a.updatedAt),c.map(a=>{let l=o.kind==="all"?Cn(n,a.id):void 0,y=s.age(t-a.updatedAt);return{key:`session:${a.id}`,label:a.displayTitle,detail:l===void 0?y:`${l} \xB7 ${y}`,hint:a.running?s.running:void 0,action:{kind:"open-session",sessionId:a.id}}})}var q="commandPanel";function An(e,n){return e.byId[n]?.cwd??""}async function we(e,n,o,s){return e.using(n,{source:q,signal:o},async t=>(await t.ready,s()))}async function Z(e,n){return n.mode==="navigate"?$n(e,n):n.mode==="command"?En(e,n):Mn(e,n)}function Mn(e,n){let o=e.sessions(),s=e.workspaces();if(o===void 0||s===void 0)return{rows:[],status:"error",message:n.copy.failed};let t=o.list.getSnapshot(),c=s.list.getSnapshot();return{rows:n.level==="sessions"?he(t,c,n.scope??{kind:"all"},n.copy,e.now()):ye(c,t,n.copy),status:"ready"}}async function $n(e,n){let{copy:o,query:s}=n,t=n.sessionId;if(t===null)return{rows:[],status:"error",message:o.noticeNoSession};let c=e.fileReferences(),a=e.sessions();if(c===void 0||a===void 0)return{rows:[],status:"error",message:o.failed};let l=An(a.list.getSnapshot(),t);try{let y=await we(a,t,n.signal,()=>c.list(t,s,n.signal));return y.ok?{rows:ue({candidates:y.value,cwd:l},o),status:"ready"}:{rows:[],status:"error",message:y.error.code}}catch(y){return ve(y)?{rows:[],status:"ready"}:{rows:[],status:"error",message:Se(y,o.failed)}}}async function En(e,n){let{copy:o}=n,s=n.sessionId;if(s===null)return{rows:[],status:"ready"};let t=e.commands(),c=e.sessions();if(t===void 0||c===void 0)return{rows:[],status:"error",message:o.failed};try{let a=await we(c,s,n.signal,()=>t.list(s));return a.ok?{rows:pe(a.value,o),status:"ready"}:{rows:[],status:"ready",warning:a.error.code}}catch(a){return ve(a)?{rows:[],status:"ready"}:{rows:[],status:"ready",warning:Se(a,o.failed)}}}function ve(e){return e instanceof Error&&e.name==="AbortError"}function Se(e,n){return e instanceof Error&&e.message!==""?e.message:n}function E(e){if(typeof e!="object"||e===null)return;let n=e,o=n.rpcError?.code;if(typeof o=="string")return o;if(typeof n.code=="string")return n.code;if(typeof n.message=="string"&&n.message!=="")return n.message}function k(e,n){return e.copy().actionLabels[n]??n}function x(e,n,o){e.notify(e.copy().actions.failed(n,o),"error")}async function Tn(e,n){let o=n.uiWorkspace(),s=n.copy();if(o===void 0){x(n,k(n,"session.newInWorkspace"),void 0);return}if(e==="workspace"){try{o.startSession(),n.close()}catch(l){x(n,k(n,"session.newInWorkspace"),E(l))}return}let t=n.sessions(),c=n.currentSessionId(),a=t===void 0||c===null?void 0:t.list.getSnapshot().byId[c]?.cwd;if(t===void 0||a===void 0||a===""){n.notify(s.actions.needsCwd,"error");return}try{let l=await t.create({cwd:a});o.openSession(l),n.close()}catch(l){x(n,k(n,"session.newUngrouped"),E(l))}}function Ln(e,n){return e.sessions()?.list.getSnapshot().byId[n]?.displayTitle??n}async function Dn(e,n){let o=n.copy(),s=n.currentSessionId();if(s===null){n.notify(o.noticeNoSession,"error");return}let t=n.uiWorkspace();if(e==="cancel"){let c=n.sessions();if(c===void 0){x(n,k(n,"session.cancel"),void 0);return}try{let a=await c.using(s,{source:q},async l=>(await l.ready,l.binding.session.cancel()));n.close(),a.ok||x(n,k(n,"session.cancel"),a.error.code)}catch(a){x(n,k(n,"session.cancel"),E(a))}return}if(t===void 0){x(n,k(n,`session.${e}`),void 0);return}try{if(e==="archive"){await t.archiveSession(s),n.close();return}if(e==="fork"){let l=await t.forkSession(s);t.openSession(l),n.close(),n.notify(o.actions.forked(Ln(n,l)));return}let a=n.workspaces()?.list.getSnapshot().pinnedSessionIds.includes(s)??!1;a?await t.unpinSession(s):await t.pinSession(s),n.close(),n.notify(o.actions.pinned(!a))}catch(c){let a=E(c);if(e==="archive"&&a==="workspace/session-active"){n.notify(o.actions.sessionBusy,"error");return}x(n,k(n,`session.${e}`),a)}}var Nn={files:"files",terminal:"terminal",browser:"browser"};function Wn(e,n,o){let s=e?.entries?.(n);if(s===void 0||s.length===0)return;let c=(o===void 0?s[0]:s.find(l=>l.options?.id===o))?.store;return c===void 0?void 0:(typeof c=="function"?c():c).create().actions}async function On(e,n){let o=n.copy();if(e==="plugins"){let t=n.pluginNavigation();if(t===void 0){x(n,k(n,"navigate.plugins"),void 0);return}try{t.openList(),n.close()}catch(c){x(n,k(n,"navigate.plugins"),E(c))}return}if(e==="sidebar"){let t=n.layout();if(t===void 0){x(n,k(n,"view.sidebar"),void 0);return}try{t.toggleSidebar(),n.close()}catch(c){x(n,k(n,"view.sidebar"),E(c))}return}if(e==="settings"||e==="shortcuts"){let t=e==="shortcuts"?"shortcuts":void 0,c=e==="shortcuts"?"shell.overlay":"sidebar.settings",a;try{a=Wn(n.slots(),c,t)}catch{a=void 0}if(a?.open===void 0){n.notify(o.actions.seatUnavailable,"error");return}try{a.open(),n.close()}catch{n.notify(o.actions.seatUnavailable,"error")}return}let s=n.sidebarRight();if(s===void 0){x(n,k(n,`view.${e}`),void 0);return}try{s.openTab(Nn[e]),n.close()}catch(t){let c=n.copy().actions.noSessionSurface;n.notify(E(t)===void 0?c:`${c}\uFF08${E(t)}\uFF09`,"error")}}function Fn(e){let n=e.theme();if(n===void 0){x(e,k(e,"view.theme"),void 0);return}let o=n.getTheme().active.colorScheme==="dark";try{n.setTheme(o?"light":"dark"),e.close(),e.notify(e.copy().actions.themeSwitched(!o))}catch(s){x(e,k(e,"view.theme"),E(s))}}function Bn(e,n){let o=n.insert(`/${e} `);if(o==="ok"){n.close();return}n.notify(o==="no-session"?n.copy().noticeNoSession:n.copy().noticeInsertFailed,"error")}async function be(e,n){switch(e.kind){case"create-session":return await Tn(e.scope,n),!0;case"insert-command":return Bn(e.name,n),!0;case"session-command":return await Dn(e.command,n),!0;case"open-surface":return await On(e.surface,n),!0;case"toggle-theme":return Fn(n),!0;default:return!1}}function ke(e,n){return function(s){let t=s,c=t.sessionId??null,a=t.inputActions??null,l=e.useRef({sessionId:c,inputActions:a});l.current={sessionId:c,inputActions:a};let y=a!==null;return e.useEffect(()=>{n({sessionId:c,inputActions:l.current.inputActions})},[c,y]),null}}function qn(e,n){let o=n==="macos"?"meta":"control",s=e.map(t=>t==="primary"?o:t);return[...new Set(s)].sort()}function Un(e,n,o){if(e==null||e.code!==n.code||(e.secondCode??"")!==(n.secondCode??""))return!1;let s=[...e.modifiers].sort(),t=qn(n.modifiers,o);return s.length===t.length&&s.every((c,a)=>c===t[a])}function X(e,n,o){let s=n.current(e.id);if(s===void 0)return{kind:"skip",id:e.id,reason:"not-registered"};if(Un(s,e.binding,o))return{kind:"skip",id:e.id,reason:"already-bound"};let t=n.describe(e.binding),c=t.keys.join("+");return t.issue!==null?{kind:"blocked",id:e.id,keys:c,reason:t.issue}:t.conflicts.length>0?{kind:"blocked",id:e.id,keys:c,reason:t.conflicts.join(", ")}:{kind:"claim",id:e.id,binding:e.binding}}var _n={title:"\u547D\u4EE4\u9762\u677F",placeholder:{navigate:"\u641C\u7D22\u6587\u4EF6\uFF0C\u56DE\u8F66\u628A\u7EDD\u5BF9\u8DEF\u5F84\u5199\u8FDB\u8F93\u5165\u6846",command:"\u641C\u7D22\u5DF2\u6CE8\u518C\u7684\u6307\u4EE4\uFF0C\u56DE\u8F66\u6267\u884C",switch:"\u641C\u7D22\u5DE5\u4F5C\u533A"},empty:{navigate:"\u6CA1\u6709\u53EF\u5BFC\u822A\u7684\u6587\u4EF6",command:"\u6CA1\u6709\u53EF\u7528\u7684\u6307\u4EE4",switch:"\u8FD8\u6CA1\u6709\u5DE5\u4F5C\u533A"},loading:"\u8BFB\u53D6\u4E2D",noResults:"\u6CA1\u6709\u5339\u914D\u7684\u7ED3\u679C",failed:"\u8BFB\u53D6\u5931\u8D25",directory:"\u76EE\u5F55",groupBuiltin:"\u9762\u677F",groupCommands:"\u6307\u4EE4",groupWorkspaces:"\u5DE5\u4F5C\u533A",groupSessions:"\u4F1A\u8BDD",allSessions:"\u5168\u90E8\u4F1A\u8BDD",allSessionsDetail:"\u8DE8\u5DE5\u4F5C\u533A\u641C\u7D22\u4F1A\u8BDD",ungrouped:"\u672A\u5206\u7EC4",sessionsCount:e=>`${e} \u4E2A\u4F1A\u8BDD`,running:"\u8FD0\u884C\u4E2D",needsInput:"\u9700\u8981\u53C2\u6570",modeNames:{navigate:"\u6587\u4EF6\u5BFC\u822A",command:"\u6307\u4EE4",switch:"\u5207\u6362"},modeDescriptions:{navigate:"\u628A\u6587\u4EF6\u7684\u7EDD\u5BF9\u8DEF\u5F84\u5199\u8FDB\u8F93\u5165\u6846",command:"\u641C\u7D22\u5E76\u6267\u884C\u5DF2\u6CE8\u518C\u7684\u6307\u4EE4",switch:"\u5148\u9009\u5DE5\u4F5C\u533A\uFF0C\u518D\u9009\u4F1A\u8BDD"},footer:{move:"\u2191\u2193 \u79FB\u52A8",accept:"\u21B5 \u786E\u8BA4",back:"esc \u8FD4\u56DE",close:"esc \u5173\u95ED"},noticeNoSession:"\u5F53\u524D\u6CA1\u6709\u6253\u5F00\u7684\u4F1A\u8BDD\uFF0C\u65E0\u6CD5\u5199\u5165\u8F93\u5165\u6846",noticeInsertFailed:"\u8F93\u5165\u6846\u6B63\u5FD9\uFF0C\u7A0D\u540E\u91CD\u8BD5",noticeExecuted:(e,n)=>n===void 0||n===""?`\u5DF2\u6267\u884C /${e}`:`/${e}\uFF1A${n}`,noticeExecuteFailed:(e,n)=>`/${e} \u6267\u884C\u5931\u8D25${n===void 0||n===""?"":`\uFF1A${n}`}`,noticeWorkspaceEmpty:"\u8FD9\u4E2A\u5DE5\u4F5C\u533A\u8FD8\u6CA1\u6709\u4F1A\u8BDD",noticeClaimFailed:e=>`\u5FEB\u6377\u952E ${e} \u5DF2\u88AB\u5360\u7528\uFF0C\u53EF\u5728\u8BBE\u7F6E \u2192 \u5FEB\u6377\u952E\u91CC\u6539\u7ED1`,categoryNames:{panel:"\u9762\u677F",session:"\u4F1A\u8BDD",navigate:"\u5BFC\u822A",view:"\u89C6\u56FE"},actionLabels:{"panel.navigate":"\u6587\u4EF6\u5BFC\u822A","panel.commands":"\u6307\u4EE4","panel.switch":"\u5207\u6362","session.newInWorkspace":"\u5728\u5F53\u524D\u5DE5\u4F5C\u533A\u521B\u5EFA\u65B0\u4F1A\u8BDD","session.newUngrouped":"\u521B\u5EFA\u672A\u5206\u7EC4\u65B0\u4F1A\u8BDD","session.rename":"\u91CD\u547D\u540D\u5F53\u524D\u4F1A\u8BDD","session.archive":"\u5F52\u6863\u5F53\u524D\u4F1A\u8BDD","session.fork":"Fork \u5F53\u524D\u4F1A\u8BDD","session.cancel":"\u4E2D\u65AD\u5F53\u524D\u56DE\u590D","session.pin":"\u7F6E\u9876\u6216\u53D6\u6D88\u7F6E\u9876\u5F53\u524D\u4F1A\u8BDD","navigate.plugins":"\u6253\u5F00\u63D2\u4EF6\u9875\u9762","navigate.settings":"\u6253\u5F00\u8BBE\u7F6E","navigate.shortcuts":"\u6253\u5F00\u5FEB\u6377\u952E\u53C2\u8003","view.sidebar":"\u663E\u793A\u6216\u9690\u85CF\u4FA7\u680F","view.files":"\u6253\u5F00\u6587\u4EF6\u6811","view.terminal":"\u65B0\u5EFA\u7EC8\u7AEF","view.browser":"\u6253\u5F00\u6D4F\u89C8\u5668\u9762\u677F","view.theme":"\u5207\u6362\u4EAE\u6697\u4E3B\u9898"},actions:{needsCwd:"\u5F53\u524D\u4F1A\u8BDD\u6CA1\u6709\u5DE5\u4F5C\u76EE\u5F55\uFF0C\u65E0\u6CD5\u521B\u5EFA\u672A\u5206\u7EC4\u4F1A\u8BDD",noSessionSurface:"\u53F3\u4FA7\u680F\u9700\u8981\u5C4F\u5E55\u4E0A\u6709\u4F1A\u8BDD",seatUnavailable:"\u5BBF\u4E3B\u7684\u8FD9\u4E2A\u5165\u53E3\u5F53\u524D\u4E0D\u53EF\u8FBE",sessionBusy:"\u4F1A\u8BDD\u8FD8\u5728\u8FD0\u884C\uFF0C\u5148\u4E2D\u65AD\u56DE\u590D\u6216\u7A0D\u540E\u518D\u5F52\u6863",forked:e=>`\u5DF2 Fork \u5230\u65B0\u4F1A\u8BDD\u300C${e}\u300D`,pinned:e=>e?"\u5DF2\u7F6E\u9876\u5F53\u524D\u4F1A\u8BDD":"\u5DF2\u53D6\u6D88\u7F6E\u9876",themeSwitched:e=>e?"\u5DF2\u5207\u5230\u6DF1\u8272\u4E3B\u9898":"\u5DF2\u5207\u5230\u6D45\u8272\u4E3B\u9898",failed:(e,n)=>`${e}\u5931\u8D25${n===void 0||n===""?"":`\uFF1A${n}`}`},age:e=>{let n=Math.floor(e/6e4);if(n<1)return"\u521A\u521A";if(n<60)return`${n} \u5206\u949F\u524D`;let o=Math.floor(n/60);return o<24?`${o} \u5C0F\u65F6\u524D`:`${Math.floor(o/24)} \u5929\u524D`}},jn={title:"Command Panel",placeholder:{navigate:"Search files; Enter inserts the absolute path",command:"Search registered commands; Enter runs one",switch:"Search workspaces"},empty:{navigate:"No files to navigate",command:"No commands available",switch:"No workspaces yet"},loading:"Loading",noResults:"No matching result",failed:"Read failed",directory:"dir",groupBuiltin:"Panel",groupCommands:"Commands",groupWorkspaces:"Workspaces",groupSessions:"Sessions",allSessions:"All sessions",allSessionsDetail:"Search sessions across workspaces",ungrouped:"Ungrouped",sessionsCount:e=>`${e} session${e===1?"":"s"}`,running:"running",needsInput:"takes input",modeNames:{navigate:"Files",command:"Commands",switch:"Switch"},modeDescriptions:{navigate:"Insert a file's absolute path into the composer",command:"Search and run a registered command",switch:"Pick a workspace, then a session"},footer:{move:"\u2191\u2193 move",accept:"\u21B5 select",back:"esc back",close:"esc close"},noticeNoSession:"No open session, so there is no composer to write to",noticeInsertFailed:"The composer is busy; try again",noticeExecuted:(e,n)=>n===void 0||n===""?`Ran /${e}`:`/${e}: ${n}`,noticeExecuteFailed:(e,n)=>`/${e} failed${n===void 0||n===""?"":`: ${n}`}`,noticeWorkspaceEmpty:"This workspace has no sessions yet",noticeClaimFailed:e=>`${e} is taken; rebind it in Settings \u2192 Shortcuts`,categoryNames:{panel:"Panel",session:"Session",navigate:"Go",view:"View"},actionLabels:{"panel.navigate":"Files","panel.commands":"Commands","panel.switch":"Switch","session.newInWorkspace":"New session in this workspace","session.newUngrouped":"New ungrouped session","session.rename":"Rename this session","session.archive":"Archive this session","session.fork":"Fork this session","session.cancel":"Stop the current reply","session.pin":"Pin or unpin this session","navigate.plugins":"Open the Plugins page","navigate.settings":"Open Settings","navigate.shortcuts":"Open the keyboard reference","view.sidebar":"Show or hide the sidebar","view.files":"Open the file tree","view.terminal":"New terminal","view.browser":"Open the browser panel","view.theme":"Toggle light and dark theme"},actions:{needsCwd:"This session has no working directory, so an ungrouped session cannot be created",noSessionSurface:"The right column needs a session on screen",seatUnavailable:"That host surface is not reachable right now",sessionBusy:"The session is still running; stop the reply or archive later",forked:e=>`Forked into \u201C${e}\u201D`,pinned:e=>e?"Pinned this session":"Unpinned this session",themeSwitched:e=>e?"Switched to the dark theme":"Switched to the light theme",failed:(e,n)=>`${e} failed${n===void 0||n===""?"":`: ${n}`}`},age:e=>{let n=Math.floor(e/6e4);if(n<1)return"just now";if(n<60)return`${n}m ago`;let o=Math.floor(n/60);return o<24?`${o}h ago`:`${Math.floor(o/24)}d ago`}};function xe(e){return e.toLowerCase().startsWith("en")?jn:_n}var U={navigate:"command-panel.navigate",commands:"command-panel.commands",switch:"command-panel.switch"};var Vn=[{id:"panel.navigate",category:"panel",action:{kind:"open-mode",mode:"navigate"},shortcutId:U.navigate},{id:"panel.commands",category:"panel",action:{kind:"open-mode",mode:"command"},shortcutId:U.commands},{id:"panel.switch",category:"panel",action:{kind:"open-mode",mode:"switch"},shortcutId:U.switch},{id:"session.newInWorkspace",category:"session",action:{kind:"create-session",scope:"workspace"}},{id:"session.newUngrouped",category:"session",action:{kind:"create-session",scope:"ungrouped"},requires:["cwd"]},{id:"session.rename",category:"session",action:{kind:"insert-command",name:"rename"},requires:["session"],requiresHostCommand:"rename",shortcutId:"session.rename"},{id:"session.archive",category:"session",action:{kind:"session-command",command:"archive"},requires:["session"],shortcutId:"session.archive"},{id:"session.fork",category:"session",action:{kind:"session-command",command:"fork"},requires:["session"],shortcutId:"session.fork"},{id:"session.cancel",category:"session",action:{kind:"session-command",command:"cancel"},requires:["running"]},{id:"session.pin",category:"session",action:{kind:"session-command",command:"pin"},requires:["session"]},{id:"navigate.plugins",category:"navigate",action:{kind:"open-surface",surface:"plugins"}},{id:"navigate.settings",category:"navigate",action:{kind:"open-surface",surface:"settings"},seat:!0},{id:"navigate.shortcuts",category:"navigate",action:{kind:"open-surface",surface:"shortcuts"},seat:!0,shortcutId:"shortcuts.open"},{id:"view.sidebar",category:"view",action:{kind:"open-surface",surface:"sidebar"},shortcutId:"sidebar.left.toggle"},{id:"view.files",category:"view",action:{kind:"open-surface",surface:"files"},requires:["sessionSurface"],shortcutId:"workspace.files"},{id:"view.terminal",category:"view",action:{kind:"open-surface",surface:"terminal"},requires:["sessionSurface"],shortcutId:"terminal.new"},{id:"view.browser",category:"view",action:{kind:"open-surface",surface:"browser"},requires:["sessionSurface"],shortcutId:"browser.new"},{id:"view.theme",category:"view",action:{kind:"toggle-theme"}}];function Hn(e,n){switch(e){case"session":return n.hasSession;case"running":return n.sessionRunning;case"cwd":return n.hasCwd;case"sessionSurface":return n.sessionSurface;default:return!1}}function Pe(e,n){return Vn.filter(o=>o.seat===!0&&!n.seatSurfaces||o.requiresHostCommand!==void 0&&(n.hostCommands===void 0||!n.hostCommands.has(o.requiresHostCommand))?!1:(o.requires??[]).every(s=>Hn(s,e)))}var _=["navigate","command","switch"];function j(e){return{mode:e,level:"root",scope:null,query:"",highlight:0}}function Re(e,n){return{...e,query:n,highlight:0}}function Ce(e,n){return n<=0||e<0?0:e>=n?n-1:e}function Ie(e,n,o){if(o<=0)return{...e,highlight:0};let s=(e.highlight+n)%o;return{...e,highlight:s<0?s+o:s}}function Ae(e,n,o){return{...e,highlight:Ce(n,o)}}function Me(e,n){return{...e,level:"sessions",scope:n,query:"",highlight:0}}function $e(e){return e.mode==="switch"&&e.level==="sessions"?{kind:"model",model:{...e,level:"root",scope:null,query:"",highlight:0}}:{kind:"close"}}function Ee(e,n){return Ce(e.highlight,n)}var Te="dsh-command-panel",Le="data-plugin-css",h="data-dcp-root",zn=`
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
`;function De(e){let n=`style[${Le}="${Te}"]`;if(e.querySelector(n)!==null)return()=>{};let o=e.createElement("style");return o.setAttribute(Le,Te),o.textContent=zn,e.head.append(o),()=>o.remove()}var J="command-panel",Kn={type:"text",spellCheck:!1,autoComplete:"off","data-dcp-query":"","data-modal-autofocus":""},Yn=new Set(["ArrowDown","ArrowUp","PageDown","PageUp","Enter","Tab","Escape"]);function Ne(e){let{React:n,store:o,copy:s}=e,t=n.createElement,c=e.document;return function(){let l=n.useSyncExternalStore(g=>o.subscribe(g),()=>o.getSnapshot()),y=n.useRef(null),R=n.useRef(null),C=n.useMemo(()=>e.primitives.observeComposition(c),[]),P=l.open;if(n.useEffect(()=>()=>C.dispose(),[C]),e.primitives.useModalLayer(y,P,e.dismiss),n.useEffect(()=>{P&&R.current?.focus()},[P]),n.useEffect(()=>{if(!P||y.current===null)return;let g=y.current.querySelector('[data-dcp-row][data-active="true"]');g!==null&&typeof g.scrollIntoView=="function"&&g.scrollIntoView({block:"nearest"})},[P,l.model.highlight,l.rows]),n.useEffect(()=>{if(!P)return;let g=c.defaultView??globalThis.window;if(g===void 0)return;let M=D=>{if(Yn.has(D.key)&&!C.guards(D))switch(D.preventDefault(),D.stopPropagation(),D.key){case"ArrowDown":e.move(1);return;case"ArrowUp":e.move(-1);return;case"PageDown":e.move(8);return;case"PageUp":e.move(-8);return;case"Enter":case"Tab":e.acceptActive();return;case"Escape":e.back();return;default:return}};return g.addEventListener("keydown",M,!0),()=>g.removeEventListener("keydown",M,!0)},[P,C]),!P)return null;let L=c.body;if(L===null)return null;let{model:I,rows:p}=l,w=Ee(I,p.length),S=[],A;p.forEach((g,M)=>{g.group!==void 0&&g.group!==A&&S.push(t("div",{key:`group:${g.group}`,"data-dcp-group":""},g.group)),A=g.group,S.push(t("div",{key:g.key,"data-dcp-row":"","data-kind":g.action.kind,"data-active":M===w?"true":void 0,role:"option","aria-selected":M===w,onMouseMove:()=>e.highlight(M),onClick:()=>e.accept(g)},t("span",{"data-dcp-label":""},g.label),g.detail===void 0?null:t("span",{"data-dcp-detail":""},g.detail),g.hint===void 0?null:t("span",{"data-dcp-hint":""},g.hint)))});let W=e.crumbLabel(),O=Gn(l.status,l.message,p.length,I,s),F=t("div",{"data-dcp-card":""},t("div",{"data-dcp-head":""},t("div",{"data-dcp-modes":"",role:"tablist"},..._.map(g=>t("button",{key:g,type:"button",role:"tab","data-dcp-mode":"","data-active":g===I.mode?"true":void 0,"aria-selected":g===I.mode,onMouseDown:M=>M.preventDefault(),onClick:()=>e.switchMode(g)},s.modeNames[g]))),W===null?null:t("button",{type:"button","data-dcp-crumb":"",title:W,onMouseDown:g=>g.preventDefault(),onClick:()=>e.back()},`\u2039 ${W}`),t("input",{...Kn,ref:R,value:I.query,placeholder:s.placeholder[I.mode],"aria-label":s.title,onChange:g=>e.setQuery(g.currentTarget.value)})),p.length===0?t("div",{"data-dcp-status":"","aria-live":"polite"},O):t("div",{"data-dcp-list":"",role:"listbox","aria-label":s.title},...S),l.notice===null?null:t("div",{"data-dcp-notice":"","data-tone":l.noticeTone??"info","aria-live":"polite"},l.notice),t("div",{"data-dcp-foot":""},t("span",null,s.footer.move),t("span",null,s.footer.accept),t("span",null,W===null?s.footer.close:s.footer.back)));return e.dom.createPortal(t("div",{ref:y,[h]:"","data-shortcut-modal":J,role:"dialog","aria-modal":"true","aria-label":s.title,tabIndex:-1},t("div",{"data-dcp-mask":"","aria-hidden":"true",onClick:()=>e.dismiss()}),F),L)}}function Gn(e,n,o,s,t){return e==="error"?n??t.failed:o===0&&s.query!==""?t.noResults:o===0?t.empty[s.mode]:t.loading}var Qn=/[\s/\\\-_.:(\[{"']/;function Zn(e,n){let o=e.trim().toLowerCase();if(o==="")return 0;let s=n.toLowerCase();if(s===o)return 1e3;if(s.startsWith(o))return 900-Math.min(90,s.length-o.length);let t=s.indexOf(o);if(t>=0){let y=s[t-1];return(t===0||y!==void 0&&Qn.test(y)?800:700)-Math.min(90,t)}let c=0,a=-1,l=0;for(let y of o){let R=s.indexOf(y,c);if(R===-1)return null;a>=0&&(l+=R-a-1),a=R,c=R+1}return 400-Math.min(300,l*4)}function Xn(e,n){let o=null,s=(t,c)=>{if(t===void 0||t==="")return;let a=Zn(e,t);if(a===null)return;let l=Math.round(a*c);(o===null||l>o)&&(o=l)};return s(n.label,1),s(n.alias,.95),s(n.detail,.55),o}function Jn(e,n,o){let s=[],t=0;for(let c of e){let a=Xn(o,n(c));a!==null&&s.push({item:c,score:a,order:t}),t+=1}return s.sort((c,a)=>a.score-c.score||c.order-a.order),s.map(c=>c.item)}function V(e,n){let o=[],s=new Map;for(let c of e){let a=c.group??"",l=s.get(a);l===void 0?(s.set(a,[c]),o.push(a)):l.push(c)}let t=[];for(let c of o){let a=s.get(c);a!==void 0&&t.push(...Jn(a,l=>({label:l.label,alias:l.alias,detail:l.detail}),n))}return t}function We(e="navigate"){let n={open:!1,model:j(e),rows:[],status:"idle",message:null,notice:null},o=new Set,s=()=>{for(let t of[...o])t()};return{getSnapshot:()=>n,subscribe(t){return o.add(t),()=>{o.delete(t)}},set(t){n={...n,...t},s()},update(t){n=t(n),s()}}}var T=U,ee=200,eo={"desktop:macos":{code:"KeyP",modifiers:["primary","shift"]},"desktop:windows":{code:"KeyP",modifiers:["primary","shift"]},"web:macos":{code:"KeyP",modifiers:["primary","shift"]},"web:windows":{code:"KeyP",modifiers:["primary","shift"]}},_o=new Map([[T.navigate,"navigate"],[T.commands,"command"],[T.switch,"switch"]]),no={navigate:T.navigate,command:T.commands,switch:T.switch};function Oe(e){let n=e.document??globalThis.document,o=We(),s={state:{sessionId:null,inputActions:null}},t=new Map,c=new Set,a=[],l=null,y=null,R=0,C=!1,P=!1,L=!1,I="",p={},w=()=>xe(p.locale?.getSnapshot().active??"zh"),S={fileReferences:()=>p.fileReferences,commands:()=>p.commands,sessions:()=>p.sessions,workspaces:()=>p.workspaces,shortcuts:()=>p.shortcuts,conversation:()=>p.conversation,uiWorkspace:()=>p.uiWorkspace,now:e.now??(()=>Date.now())};function A(){let i=s.state.sessionId;if(i!==null)return i;let r=S.sessions();if(r===void 0)return null;let d=r.list.getSnapshot();for(let u of d.ids)if((d.byId[u]?.retainedBy?.mainView??0)>0)return u;return null}function W(i){if(i===null)return null;let r=S.sessions(),d=S.conversation();if(r===void 0||d===void 0)return null;let u=r.scope(i);if(u===void 0)return null;try{return d.input.for(u)}catch{return null}}function O(i,r="info"){o.set({notice:i,noticeTone:r})}function F(i,r="info"){let d=W(A());if(d!==null)try{d.notify(r,i);return}catch{}console[r==="error"?"warn":"info"]("[dsh-command-panel]",i)}function g(i,r,d,u){return[i,r,d,u??"-"].join("|")}function M(i){let{model:r}=i,d=r.scope===null?"-":r.scope.kind==="workspace"?r.scope.workspaceId:r.scope.kind;return g(r.mode,r.level,d,A())}let D=new Set;function Ve(){let i=new Map,r=S.shortcuts();if(r===void 0)return i;for(let d of r.catalog.getSnapshot())d.keys.length>0&&i.set(d.id,d.keys.join(" "));return i}function He(){let i=S.sessions(),r=A(),d=r===null?void 0:i?.list.getSnapshot().byId[r],u=p.sidebarRight;return{hasSession:r!==null&&d!==void 0,sessionRunning:d?.running===!0,hasCwd:(d?.cwd??"")!=="",sessionSurface:u===void 0?!0:u.mounted.getSnapshot()!==void 0}}function te(i){let r=Pe(He(),{seatSurfaces:e.config?.seatSurfaces!==!1,hostCommands:D});return[...fe(w(),r,Ve()),...i]}function ze(){return{sessions:()=>p.sessions,workspaces:()=>p.workspaces,uiWorkspace:()=>p.uiWorkspace,layout:()=>p.layout,theme:()=>p.theme,pluginNavigation:()=>p.pluginNavigation,sidebarRight:()=>p.sidebarRight,slots:()=>p.slots,currentSessionId:A,insert:z,close:N,notify:(i,r="info")=>{o.getSnapshot().open?O(i,r):F(i,r)},copy:w}}function Ke(i){let r=o.getSnapshot();return{mode:r.model.mode,level:r.model.level,scope:r.model.scope,query:r.model.query,sessionId:A(),copy:w(),signal:i}}function Ye(){let i=o.getSnapshot(),r=V(a,i.model.query).slice(0,ee);o.set({rows:r})}async function se(){if(!o.getSnapshot().open||C)return;if(P){L=!0;return}P=!0,I=K(),l?.abort();let r=new AbortController;l=r;let d=++R;try{let u=await Z(S,Ke(r.signal));if(C||d!==R)return;let m=o.getSnapshot();if(!m.open)return;m.model.mode==="command"&&u.status==="ready"&&(D=new Set(u.rows.flatMap(v=>v.action.kind==="execute-command"?[v.action.name]:[])));let f=m.model.mode==="command"?te(u.rows):u.rows;a=f,t.set(M(m),f),o.set({rows:V(f,m.model.query).slice(0,ee),status:u.status,message:u.message??null,notice:u.warning??null,noticeTone:u.warning===void 0?void 0:"error"})}catch(u){if(C||d!==R)return;o.set({status:"error",message:u instanceof Error?u.message:w().failed})}finally{P=!1,L&&!C&&(L=!1,B(0))}}function B(i){if(y!==null&&clearTimeout(y),i<=0){y=null,se();return}y=setTimeout(()=>{y=null,se()},i)}async function Ge(i){if(!(i===null||C))for(let r of["navigate","command"]){let d=g(r,"root","-",i);if(!(t.has(d)||c.has(d))){c.add(d);try{let u=await Z(S,{mode:r,level:"root",scope:null,query:"",sessionId:i,copy:w(),signal:new AbortController().signal});u.status==="ready"&&t.set(d,u.rows)}catch{}}}}function H(i){let r=o.getSnapshot(),d=j(i),u=A(),m=t.get(g(i,"root","-",u));a=m??[];let f=m===void 0&&i==="command"?te([]):m??[];o.set({open:!0,model:d,rows:V(f,"").slice(0,ee),status:"loading",message:null,notice:null,noticeTone:void 0}),I=K(),B(0)}function Qe(i){let r=o.getSnapshot();if(r.open&&r.model.mode===i){N();return}H(i)}function Ze(i){let r=o.getSnapshot();r.open&&r.model.mode===i||H(i)}function N(){l?.abort(),l=null,y!==null&&(clearTimeout(y),y=null),R+=1,a=[],P=!1,L=!1,I="",o.set({open:!1,status:"idle",notice:null,noticeTone:void 0})}function Xe(){let{model:i}=o.getSnapshot(),r=i.scope;if(r===null)return null;let d=w();return r.kind==="all"?d.allSessions:r.kind==="ungrouped"?d.ungrouped:S.workspaces()?.list.getSnapshot().items.find(f=>f.workspaceId===r.workspaceId)?.title??d.modeNames.switch}function z(i){let r=A();if(r===null)return"no-session";let d=W(r),u=d?.state.getSnapshot().draft??"",m=s.state.inputActions;if(m!==null)for(let ae=0;ae<2;ae+=1){let ce=m.captureInsertion(),pn=G(u,ce.start,i);if(m.insertText(pn,ce))return d?.focus(),"ok"}if(d===null)return"failed";let f=d.state.getSnapshot(),v=G(f.draft,f.draft.length,i),b={start:f.draft.length,end:f.draft.length,draftRev:f.draftRev};return d.insertText(v,b)?(d.focus(),"ok"):f.draft===""?(d.setDraft(v),d.focus(),"ok"):"failed"}function Je(i){let r=z(i);if(r==="ok"){N();return}O(r==="no-session"?w().noticeNoSession:w().noticeInsertFailed,"error")}function en(i){let r=z(`/${i} `);if(r==="ok"){N();return}O(r==="no-session"?w().noticeNoSession:w().noticeInsertFailed,"error")}async function nn(i){let r=A(),d=S.commands(),u=S.sessions();if(N(),!(r===null||d===void 0||u===void 0))try{let m=await u.using(r,{source:q},async v=>(await v.ready,d.execute(r,`/${i}`)));if(!m.ok){F(w().noticeExecuteFailed(i,m.error.code),"error");return}let f=m.value;if(f===void 0)return;if(f.result.kind==="error"){F(w().noticeExecuteFailed(i,f.result.text),"error");return}F(w().noticeExecuted(i,f.result.text))}catch(m){F(w().noticeExecuteFailed(i,m instanceof Error?m.message:void 0),"error")}}function on(i){let r=S.uiWorkspace();if(r===void 0){O(w().failed,"error");return}try{r.openSession(i),N()}catch{O(w().failed,"error")}}function tn(i){let r=o.getSnapshot();a=[],o.set({model:Me(r.model,i),status:"loading",rows:[],notice:null}),B(0)}function ie(i){switch(i.action.kind){case"insert-path":Je(i.action.absolutePath);return;case"execute-command":i.action.needsInput?en(i.action.name):nn(i.action.name);return;case"open-mode":H(i.action.mode);return;case"drill":tn(i.action.scope);return;case"open-session":on(i.action.sessionId);return;default:be(i.action,ze());return}}function sn(){let i=o.getSnapshot(),r=i.rows[i.model.highlight];r!==void 0&&ie(r)}function rn(){let i=o.getSnapshot(),r=$e(i.model);if(r.kind==="close"){N();return}a=[],o.set({model:r.model,rows:[],status:"loading",notice:null}),B(0)}function an(i){let r=i.get("shortcuts");if(r===void 0)return()=>{};p.shortcuts=r;let d=()=>{p.shortcuts=void 0},u=[];for(let m of _){let f=no[m];u.push(r.register({id:f,label:()=>`${w().title}\uFF1A${w().modeNames[m]}`,aliases:m==="navigate"?["command panel","quick open","files","navigate"]:m==="command"?["command panel","palette","commands"]:["command panel","switch","workspaces","sessions"],defaults:m==="command"?eo:{},regions:["page","editable"],modals:[J],resolve:()=>({status:"handled",run:()=>Qe(m)})}))}return u.push(cn(r)),()=>{d();for(let m of u)m()}}function cn(i){let r=!1,d=()=>{r||i.config.getSnapshot().status==="ready"&&(r=!0,ln(i))};return d(),i.config.subscribe(d)}async function ln(i){let r=[{id:T.navigate,binding:{code:"KeyP",modifiers:["primary"]}},{id:T.switch,binding:{code:"KeyO",modifiers:["primary"]}}];for(let d of r){let u=new Map(i.catalog.getSnapshot().map(b=>[b.id,b])),m={current:b=>u.get(b)?.binding,describe:b=>i.describeBinding(b)},f=X(d,m,e.platform);if(f.kind==="blocked"&&d.id===T.switch&&e.config?.takeoverSwitch===!0){let b=i.describeBinding(d.binding).conflicts[0];b!==void 0&&(await i.edit({type:"set",id:b,binding:null},i.config.getSnapshot().revision),f=X(d,m,e.platform))}if(f.kind==="blocked"){console.info("[dsh-command-panel]",w().noticeClaimFailed(f.keys));continue}if(f.kind!=="claim")continue;(await i.edit({type:"set",id:f.id,binding:f.binding},i.config.getSnapshot().revision)).status!=="saved"&&console.info("[dsh-command-panel]",w().noticeClaimFailed(f.binding.code))}}function dn(i){let r=i.get("slots");if(r===void 0)return()=>{};p.slots=r;let d=Ne({React:e.React,dom:e.dom,primitives:e.primitives,store:o,copy:w(),document:n,move:f=>{let v=o.getSnapshot();o.set({model:Ie(v.model,f,v.rows.length)})},highlight:f=>{let v=o.getSnapshot();o.set({model:Ae(v.model,f,v.rows.length)})},setQuery:f=>{let v=o.getSnapshot();o.set({model:Re(v.model,f),notice:null,noticeTone:void 0}),Ye(),B(90)},acceptActive:sn,accept:ie,dismiss:N,back:rn,switchMode:Ze,crumbLabel:Xe}),u=ke(e.React,f=>{let v=f.sessionId!==s.state.sessionId;s.state=f,v&&Ge(f.sessionId)}),m=[r.inject("shell.overlay",()=>r.register({name:"shell.overlay",id:"command-panel.palette",order:50},d)),r.inject("conversation.input.overlay",()=>r.register({name:"conversation.input.overlay",id:"command-panel.bridge",order:90},u))];return()=>{p.slots=void 0;for(let f of m)f()}}function K(){let i=[],r=S.workspaces();if(r!==void 0){let u=r.list.getSnapshot();i.push(u.items.map(m=>`${m.workspaceId}:${m.title}:${m.sessionIds.length}`).join(",")),i.push(String(u.archivedSessionIds.length))}let d=S.sessions();if(d!==void 0){let u=d.list.getSnapshot(),m=0,f=0;for(let v of u.ids){let b=u.byId[v];b!==void 0&&(m+=b.updatedAt,f+=b.displayTitle.length)}i.push(`${u.ids.length}:${m}:${f}`)}return i.join("|")}function re(){let i=o.getSnapshot();if(!i.open||i.model.mode!=="switch")return;let r=K();if(r!==I){if(I=r,P){L=!0;return}B(0)}}function un(i){let r=[],d=i.get("sessions"),u=i.get("workspaces");return d!==void 0&&r.push(d.list.subscribe(re)),u!==void 0&&r.push(u.list.subscribe(re)),()=>{for(let m of r)m()}}let $=[];return $.push(e.ctx.inject(["sessions","workspaces","conversation","uiWorkspace","locale"],i=>(p.sessions=i.get("sessions"),p.workspaces=i.get("workspaces"),p.conversation=i.get("conversation"),p.uiWorkspace=i.get("uiWorkspace"),p.locale=i.get("locale"),()=>{p.sessions=void 0,p.workspaces=void 0,p.conversation=void 0,p.uiWorkspace=void 0,p.locale=void 0}))),$.push(e.ctx.inject(["remote.fileReferences"],i=>(p.fileReferences=i.get("remote.fileReferences"),()=>{p.fileReferences=void 0}))),$.push(e.ctx.inject(["remote.commands"],i=>(p.commands=i.get("remote.commands"),()=>{p.commands=void 0}))),$.push(De(n)),$.push(e.ctx.inject(["layout","theme","sidebarRight"],i=>(p.layout=i.get("layout"),p.theme=i.get("theme"),p.sidebarRight=i.get("sidebarRight"),()=>{p.layout=void 0,p.theme=void 0,p.sidebarRight=void 0}))),$.push(e.ctx.inject(["pluginNavigation"],i=>(p.pluginNavigation=i.get("pluginNavigation"),()=>{p.pluginNavigation=void 0}))),$.push(e.ctx.inject(["slots"],dn)),$.push(e.ctx.inject(["shortcuts"],an)),$.push(e.ctx.inject(["sessions","workspaces"],un)),{dispose(){if(!C){C=!0,y!==null&&clearTimeout(y),y=null,l?.abort(),l=null;for(let i of $.splice(0))i()}}}}var ne=null,Fe="react",Be="react-dom",qe="@deepseek-ai/dsh-client-ui-primitives";function Ue(e){let n=e.toLowerCase();return n.includes("mac")?"macos":n.includes("win")?"windows":"linux"}function oe(e){if(ne===null)return null;let n=ne(e);return n??null}function oo(){let e=oe(Fe);if(e===null)return null;for(let n of["createElement","useState","useEffect","useMemo","useRef","useSyncExternalStore"])if(typeof e[n]!="function")return null;return e}function to(){let e=oe(Be);return e!==null&&typeof e.createPortal=="function"?e:null}function so(){let e=oe(qe);return e===null||typeof e.useModalLayer!="function"||typeof e.observeComposition!="function"?null:e}var _e=["slots","shortcuts","sessions","workspaces","uiWorkspace","conversation","remote","remote.fileReferences","remote.commands","locale"],je={name:"dsh-command-panel",inject:_e,apply(e,n){let o=oo(),s=to(),t=so();if(o===null||s===null||t===null)return console.warn("[dsh-command-panel] missing platform modules; panel disabled"),()=>{};let c=Oe({ctx:e,React:o,dom:s,primitives:t,platform:Ue(globalThis.navigator?.platform??""),config:n});return()=>c.dispose()}};function io(e){ne=e}var ro=je;

module.exports.boot(require);
    return module.exports.default ?? module.exports;
  }
});
