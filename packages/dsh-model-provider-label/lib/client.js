window.__ModuleLoader__.load({
  id: "dsh-model-provider-label",
  factory: (require) => {
    var module = { exports: {} };
    var exports = module.exports;
"use strict";var l=Object.defineProperty;var v=Object.getOwnPropertyDescriptor;var L=Object.getOwnPropertyNames;var M=Object.prototype.hasOwnProperty;var T=(e,n)=>{for(var t in n)l(e,t,{get:n[t],enumerable:!0})},P=(e,n,t,i)=>{if(n&&typeof n=="object"||typeof n=="function")for(let r of L(n))!M.call(e,r)&&r!==t&&l(e,r,{get:()=>n[r],enumerable:!(i=v(n,r))||i.enumerable});return e};var k=e=>P(l({},"__esModule",{value:!0}),e);var C={};T(C,{ENTRY_PRIORITY:()=>f,SLOT:()=>d,apply:()=>b,boot:()=>I,clientPlugin:()=>x,default:()=>O,inject:()=>g,resolveTag:()=>y});module.exports=k(C);function R(e){let n=e.name.trim();return n===""?e.id:n}function w(e){return e==="trigger"}function p(e){let n=e.model.name;return w(e.placement)?`${R(e.provider)} ${n}`:n}function s(e,n){return!(e.id==="deepseek-account"||e.id==="deepseek-official")||n.id!=="deepseek-flash"?null:n.name==="DeepSeek-V4.1-Flash"?"1017":null}var o=require("react/jsx-runtime"),B="info";function c({provider:e,model:n,placement:t,selected:i,Tag:r}){let a=p({provider:e,model:n,placement:t,selected:i}),u=s(e,n);return u===null?(0,o.jsx)(o.Fragment,{children:a}):(0,o.jsxs)(o.Fragment,{children:[a," ",(0,o.jsx)(r,{tone:B,children:u})]})}var d="conversation.input.model.label",f=-1,m=null,g=["slots"];function y(e){if(e===null)return;let n=e("@deepseek-ai/dsh-client-ui-primitives");return typeof n?.Tag=="function"?n.Tag:void 0}function b(e){let n=y(m);if(n===void 0)return()=>{};let t;return e.slots.inject(d,()=>(t=e.slots.register({name:d,priority:f,inject:()=>({Tag:n})},c),t)),()=>t?.()}function I(e){m=e}var x={name:"dsh-model-provider-label",inject:g,apply:b},O=x;

module.exports.boot(require);
    return module.exports.default ?? module.exports;
  }
});
