window.__ModuleLoader__.load({
  id: "dsh-arch",
  factory: (require) => {
    var module = { exports: {} };
    var exports = module.exports;
"use strict";var t=Object.defineProperty;var d=Object.getOwnPropertyDescriptor;var i=Object.getOwnPropertyNames;var l=Object.prototype.hasOwnProperty;var c=(r,e)=>{for(var n in e)t(r,n,{get:e[n],enumerable:!0})},p=(r,e,n,a)=>{if(e&&typeof e=="object"||typeof e=="function")for(let o of i(e))!l.call(r,o)&&o!==n&&t(r,o,{get:()=>e[o],enumerable:!(a=d(e,o))||a.enumerable});return r};var y=r=>p(t({},"__esModule",{value:!0}),r);var A={};c(A,{default:()=>g});module.exports=y(A);var s="dsh-arch";var g={name:s,inject:["dsh-workbench-core"],apply(){}};

    if (typeof module.exports.boot === "function") module.exports.boot(require);
    return module.exports.default ?? module.exports;
  }
});
