window.__ModuleLoader__.load({
  id: "dsh-blank-new-chat",
  factory: (require) => {
    var module = { exports: {} };
    var exports = module.exports;
"use strict";var l=Object.defineProperty;var k=Object.getOwnPropertyDescriptor;var B=Object.getOwnPropertyNames;var m=Object.prototype.hasOwnProperty;var w=(n,e)=>{for(var t in e)l(n,t,{get:e[t],enumerable:!0})},y=(n,e,t,i)=>{if(e&&typeof e=="object"||typeof e=="function")for(let o of B(e))!m.call(n,o)&&o!==t&&l(n,o,{get:()=>e[o],enumerable:!(i=k(e,o))||i.enumerable});return n};var C=n=>y(l({},"__esModule",{value:!0}),n);var N={};w(N,{BlankNewChatFrame:()=>g,ENTRY_ID:()=>f,SLOT:()=>v,TARGET:()=>s,clientPlugin:()=>u,default:()=>E});module.exports=C(N);var c=require("react"),p=require("react/jsx-runtime"),s="blank-new-chat",v="conversation.hero.frame",f="blank-new-chat",T="[data-conversation-content]",h="data-conversation-session",d=Object.freeze({}),x={empty:d,replace:()=>d,apply:()=>d};function g({hero:n,children:e,activate:t}){let i=(0,c.useRef)(null);return(0,c.useLayoutEffect)(()=>{if(n!==!0||t===void 0)return;let r=i.current?.closest(T)?.getAttribute(h);r==null||r===""||t(r)},[n,t]),(0,p.jsx)("div",{ref:i,style:{display:"contents"},children:e})}var u={name:"dsh-blank-new-chat",inject:["slots","uiConversation"],apply(n){let{slots:e,uiConversation:t}=n;t.views.entries().some(a=>a.target===s)||t.views.register({target:s,create:()=>x,isActive:()=>!0});let o=a=>{try{t.binding(a).activate(s)}catch{}},r=a=>(0,p.jsx)(g,{...a,activate:o});e.inject(v,()=>e.register({name:v,id:f},r))}},E=u;

    return module.exports.default ?? module.exports;
  }
});
