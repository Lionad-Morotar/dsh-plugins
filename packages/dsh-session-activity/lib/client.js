window.__ModuleLoader__.load({
  id: "dsh-session-activity",
  factory: (require) => {
    var module = { exports: {} };
    var exports = module.exports;
"use strict";var s=Object.defineProperty;var a=Object.getOwnPropertyDescriptor;var l=Object.getOwnPropertyNames;var r=Object.prototype.hasOwnProperty;var u=(t,n)=>{for(var e in n)s(t,e,{get:n[e],enumerable:!0})},d=(t,n,e,i)=>{if(n&&typeof n=="object"||typeof n=="function")for(let o of l(n))!r.call(t,o)&&o!==e&&s(t,o,{get:()=>n[o],enumerable:!(i=a(n,o))||i.enumerable});return t};var f=t=>d(s({},"__esModule",{value:!0}),t);var y={};u(y,{apply:()=>p,clientPlugin:()=>x,default:()=>v,inject:()=>c});module.exports=f(y);var c=["sessions"];function p(t){}var x={name:"dsh-session-activity",inject:c,apply:p},v=x;

    return module.exports.default ?? module.exports;
  }
});
