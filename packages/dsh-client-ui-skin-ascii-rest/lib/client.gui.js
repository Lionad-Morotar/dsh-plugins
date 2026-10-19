window.__ModuleLoader__.load({
  id: "@lionad/dsh-client-ui-skin-ascii-rest/client.gui.js",
  factory: (require) => {
    var module = { exports: {} };
    var exports = module.exports;
    "use strict";var k=Object.defineProperty;var j=Object.getOwnPropertyDescriptor;var U=Object.getOwnPropertyNames;var B=Object.prototype.hasOwnProperty;var Y=(l,i)=>{for(var t in i)k(l,t,{get:i[t],enumerable:!0})},G=(l,i,t,e)=>{if(i&&typeof i=="object"||typeof i=="function")for(let n of U(i))!B.call(l,n)&&n!==t&&k(l,n,{get:()=>i[n],enumerable:!(e=j(i,n))||e.enumerable});return l};var P=l=>G(k({},"__esModule",{value:!0}),l);var ti={};Y(ti,{createGui:()=>I,rangeAround:()=>D});module.exports=P(ti);var v=class l{constructor(i,t,e,n,s="div"){this.parent=i,this.object=t,this.property=e,this._disabled=!1,this._hidden=!1,this.initialValue=this.getValue(),this.domElement=document.createElement(s),this.domElement.classList.add("lil-controller"),this.domElement.classList.add(n),this.$name=document.createElement("div"),this.$name.classList.add("lil-name"),l.nextNameID=l.nextNameID||0,this.$name.id=`lil-gui-name-${++l.nextNameID}`,this.$widget=document.createElement("div"),this.$widget.classList.add("lil-widget"),this.$disable=this.$widget,this.domElement.appendChild(this.$name),this.domElement.appendChild(this.$widget),this.domElement.addEventListener("keydown",o=>o.stopPropagation()),this.domElement.addEventListener("keyup",o=>o.stopPropagation()),this.parent.children.push(this),this.parent.controllers.push(this),this.parent.$children.appendChild(this.domElement),this._listenCallback=this._listenCallback.bind(this),this.name(e)}name(i){return this._name=i,this.$name.textContent=i,this}onChange(i){return this._onChange=i,this}_callOnChange(){this.parent._callOnChange(this),this._onChange!==void 0&&this._onChange.call(this,this.getValue()),this._changed=!0}onFinishChange(i){return this._onFinishChange=i,this}_callOnFinishChange(){this._changed&&(this.parent._callOnFinishChange(this),this._onFinishChange!==void 0&&this._onFinishChange.call(this,this.getValue())),this._changed=!1}reset(){return this.setValue(this.initialValue),this._callOnFinishChange(),this}enable(i=!0){return this.disable(!i)}disable(i=!0){return i===this._disabled?this:(this._disabled=i,this.domElement.classList.toggle("lil-disabled",i),this.$disable.toggleAttribute("disabled",i),this)}show(i=!0){return this._hidden=!i,this.domElement.style.display=this._hidden?"none":"",this}hide(){return this.show(!1)}options(i){let t=this.parent.add(this.object,this.property,i);return t.name(this._name),this.destroy(),t}min(i){return this}max(i){return this}step(i){return this}decimals(i){return this}listen(i=!0){return this._listening=i,this._listenCallbackID!==void 0&&(cancelAnimationFrame(this._listenCallbackID),this._listenCallbackID=void 0),this._listening&&this._listenCallback(),this}_listenCallback(){this._listenCallbackID=requestAnimationFrame(this._listenCallback);let i=this.save();i!==this._listenPrevValue&&this.updateDisplay(),this._listenPrevValue=i}getValue(){return this.object[this.property]}setValue(i){return this.getValue()!==i&&(this.object[this.property]=i,this._callOnChange(),this.updateDisplay()),this}updateDisplay(){return this}load(i){return this.setValue(i),this._callOnFinishChange(),this}save(){return this.getValue()}destroy(){this.listen(!1),this.parent.children.splice(this.parent.children.indexOf(this),1),this.parent.controllers.splice(this.parent.controllers.indexOf(this),1),this.parent.$children.removeChild(this.domElement)}},$=class extends v{constructor(i,t,e){super(i,t,e,"lil-boolean","label"),this.$input=document.createElement("input"),this.$input.setAttribute("type","checkbox"),this.$input.setAttribute("aria-labelledby",this.$name.id),this.$widget.appendChild(this.$input),this.$input.addEventListener("change",()=>{this.setValue(this.$input.checked),this._callOnFinishChange()}),this.$disable=this.$input,this.updateDisplay()}updateDisplay(){return this.$input.checked=this.getValue(),this}};function C(l){let i,t;return(i=l.match(/(#|0x)?([a-f0-9]{6})/i))?t=i[2]:(i=l.match(/rgb\(\s*(\d*)\s*,\s*(\d*)\s*,\s*(\d*)\s*\)/))?t=parseInt(i[1]).toString(16).padStart(2,0)+parseInt(i[2]).toString(16).padStart(2,0)+parseInt(i[3]).toString(16).padStart(2,0):(i=l.match(/^#?([a-f0-9])([a-f0-9])([a-f0-9])$/i))&&(t=i[1]+i[1]+i[2]+i[2]+i[3]+i[3]),t?"#"+t:!1}var T={isPrimitive:!0,match:l=>typeof l=="string",fromHexString:C,toHexString:C},y={isPrimitive:!0,match:l=>typeof l=="number",fromHexString:l=>parseInt(l.substring(1),16),toHexString:l=>"#"+l.toString(16).padStart(6,0)},X={isPrimitive:!1,match:l=>Array.isArray(l)||ArrayBuffer.isView(l),fromHexString(l,i,t=1){let e=y.fromHexString(l);i[0]=(e>>16&255)/255*t,i[1]=(e>>8&255)/255*t,i[2]=(e&255)/255*t},toHexString([l,i,t],e=1){e=255/e;let n=l*e<<16^i*e<<8^t*e<<0;return y.toHexString(n)}},Z={isPrimitive:!1,match:l=>Object(l)===l,fromHexString(l,i,t=1){let e=y.fromHexString(l);i.r=(e>>16&255)/255*t,i.g=(e>>8&255)/255*t,i.b=(e&255)/255*t},toHexString({r:l,g:i,b:t},e=1){e=255/e;let n=l*e<<16^i*e<<8^t*e<<0;return y.toHexString(n)}},N=[T,y,X,Z];function q(l){return N.find(i=>i.match(l))}var S=class extends v{constructor(i,t,e,n){super(i,t,e,"lil-color"),this.$input=document.createElement("input"),this.$input.setAttribute("type","color"),this.$input.setAttribute("tabindex",-1),this.$input.setAttribute("aria-labelledby",this.$name.id),this.$text=document.createElement("input"),this.$text.setAttribute("type","text"),this.$text.setAttribute("spellcheck","false"),this.$text.setAttribute("aria-labelledby",this.$name.id),this.$display=document.createElement("div"),this.$display.classList.add("lil-display"),this.$display.appendChild(this.$input),this.$widget.appendChild(this.$display),this.$widget.appendChild(this.$text),this._format=q(this.initialValue),this._rgbScale=n,this._initialValueHexString=this.save(),this._textFocused=!1,this.$input.addEventListener("input",()=>{this._setValueFromHexString(this.$input.value)}),this.$input.addEventListener("blur",()=>{this._callOnFinishChange()}),this.$text.addEventListener("input",()=>{let s=C(this.$text.value);s&&this._setValueFromHexString(s)}),this.$text.addEventListener("focus",()=>{this._textFocused=!0,this.$text.select()}),this.$text.addEventListener("blur",()=>{this._textFocused=!1,this.updateDisplay(),this._callOnFinishChange()}),this.$disable=this.$text,this.updateDisplay()}reset(){return this._setValueFromHexString(this._initialValueHexString),this}_setValueFromHexString(i){if(this._format.isPrimitive){let t=this._format.fromHexString(i);this.setValue(t)}else this._format.fromHexString(i,this.getValue(),this._rgbScale),this._callOnChange(),this.updateDisplay()}save(){return this._format.toHexString(this.getValue(),this._rgbScale)}load(i){return this._setValueFromHexString(i),this._callOnFinishChange(),this}updateDisplay(){return this.$input.value=this._format.toHexString(this.getValue(),this._rgbScale),this._textFocused||(this.$text.value=this.$input.value.substring(1)),this.$display.style.backgroundColor=this.$input.value,this}},x=class extends v{constructor(i,t,e){super(i,t,e,"lil-function"),this.$button=document.createElement("button"),this.$button.appendChild(this.$name),this.$widget.appendChild(this.$button),this.$button.addEventListener("click",n=>{n.preventDefault(),this.getValue().call(this.object),this._callOnChange()}),this.$button.addEventListener("touchstart",()=>{},{passive:!0}),this.$disable=this.$button}},L=class extends v{constructor(i,t,e,n,s,o){super(i,t,e,"lil-number"),this._initInput(),this.min(n),this.max(s);let h=o!==void 0;this.step(h?o:this._getImplicitStep(),h),this.updateDisplay()}decimals(i){return this._decimals=i,this.updateDisplay(),this}min(i){return this._min=i,this._onUpdateMinMax(),this}max(i){return this._max=i,this._onUpdateMinMax(),this}step(i,t=!0){return this._step=i,this._stepExplicit=t,this}updateDisplay(){let i=this.getValue();if(this._hasSlider){let t=(i-this._min)/(this._max-this._min);t=Math.max(0,Math.min(t,1)),this.$fill.style.width=t*100+"%"}return this._inputFocused||(this.$input.value=this._decimals===void 0?i:i.toFixed(this._decimals)),this}_initInput(){this.$input=document.createElement("input"),this.$input.setAttribute("type","text"),this.$input.setAttribute("aria-labelledby",this.$name.id),window.matchMedia("(pointer: coarse)").matches&&(this.$input.setAttribute("type","number"),this.$input.setAttribute("step","any")),this.$widget.appendChild(this.$input),this.$disable=this.$input;let t=()=>{let r=parseFloat(this.$input.value);isNaN(r)||(this._stepExplicit&&(r=this._snap(r)),this.setValue(this._clamp(r)))},e=r=>{let g=parseFloat(this.$input.value);isNaN(g)||(this._snapClampSetValue(g+r),this.$input.value=this.getValue())},n=r=>{r.key==="Enter"&&this.$input.blur(),r.code==="ArrowUp"&&(r.preventDefault(),e(this._step*this._arrowKeyMultiplier(r))),r.code==="ArrowDown"&&(r.preventDefault(),e(this._step*this._arrowKeyMultiplier(r)*-1))},s=r=>{this._inputFocused&&(r.preventDefault(),e(this._step*this._normalizeMouseWheel(r)))},o=!1,h,m,d,c,p,u=5,w=r=>{h=r.clientX,m=d=r.clientY,o=!0,c=this.getValue(),p=0,window.addEventListener("mousemove",b),window.addEventListener("mouseup",f)},b=r=>{if(o){let g=r.clientX-h,_=r.clientY-m;Math.abs(_)>u?(r.preventDefault(),this.$input.blur(),o=!1,this._setDraggingStyle(!0,"vertical")):Math.abs(g)>u&&f()}if(!o){let g=r.clientY-d;p-=g*this._step*this._arrowKeyMultiplier(r),c+p>this._max?p=this._max-c:c+p<this._min&&(p=this._min-c),this._snapClampSetValue(c+p)}d=r.clientY},f=()=>{this._setDraggingStyle(!1,"vertical"),this._callOnFinishChange(),window.removeEventListener("mousemove",b),window.removeEventListener("mouseup",f)},E=()=>{this._inputFocused=!0},a=()=>{this._inputFocused=!1,this.updateDisplay(),this._callOnFinishChange()};this.$input.addEventListener("input",t),this.$input.addEventListener("keydown",n),this.$input.addEventListener("wheel",s,{passive:!1}),this.$input.addEventListener("mousedown",w),this.$input.addEventListener("focus",E),this.$input.addEventListener("blur",a)}_initSlider(){this._hasSlider=!0,this.$slider=document.createElement("div"),this.$slider.classList.add("lil-slider"),this.$fill=document.createElement("div"),this.$fill.classList.add("lil-fill"),this.$slider.appendChild(this.$fill),this.$widget.insertBefore(this.$slider,this.$input),this.domElement.classList.add("lil-has-slider");let i=(a,r,g,_,R)=>(a-r)/(g-r)*(R-_)+_,t=a=>{let r=this.$slider.getBoundingClientRect(),g=i(a,r.left,r.right,this._min,this._max);this._snapClampSetValue(g)},e=a=>{this._setDraggingStyle(!0),t(a.clientX),window.addEventListener("mousemove",n),window.addEventListener("mouseup",s)},n=a=>{t(a.clientX)},s=()=>{this._callOnFinishChange(),this._setDraggingStyle(!1),window.removeEventListener("mousemove",n),window.removeEventListener("mouseup",s)},o=!1,h,m,d=a=>{a.preventDefault(),this._setDraggingStyle(!0),t(a.touches[0].clientX),o=!1},c=a=>{a.touches.length>1||(this._hasScrollBar?(h=a.touches[0].clientX,m=a.touches[0].clientY,o=!0):d(a),window.addEventListener("touchmove",p,{passive:!1}),window.addEventListener("touchend",u))},p=a=>{if(o){let r=a.touches[0].clientX-h,g=a.touches[0].clientY-m;Math.abs(r)>Math.abs(g)?d(a):(window.removeEventListener("touchmove",p),window.removeEventListener("touchend",u))}else a.preventDefault(),t(a.touches[0].clientX)},u=()=>{this._callOnFinishChange(),this._setDraggingStyle(!1),window.removeEventListener("touchmove",p),window.removeEventListener("touchend",u)},w=this._callOnFinishChange.bind(this),b=400,f,E=a=>{if(Math.abs(a.deltaX)<Math.abs(a.deltaY)&&this._hasScrollBar)return;a.preventDefault();let g=this._normalizeMouseWheel(a)*this._step;this._snapClampSetValue(this.getValue()+g),this.$input.value=this.getValue(),clearTimeout(f),f=setTimeout(w,b)};this.$slider.addEventListener("mousedown",e),this.$slider.addEventListener("touchstart",c,{passive:!1}),this.$slider.addEventListener("wheel",E,{passive:!1})}_setDraggingStyle(i,t="horizontal"){this.$slider&&this.$slider.classList.toggle("lil-active",i),document.body.classList.toggle("lil-dragging",i),document.body.classList.toggle(`lil-${t}`,i)}_getImplicitStep(){return this._hasMin&&this._hasMax?(this._max-this._min)/1e3:.1}_onUpdateMinMax(){!this._hasSlider&&this._hasMin&&this._hasMax&&(this._stepExplicit||this.step(this._getImplicitStep(),!1),this._initSlider(),this.updateDisplay())}_normalizeMouseWheel(i){let{deltaX:t,deltaY:e}=i;return Math.floor(i.deltaY)!==i.deltaY&&i.wheelDelta&&(t=0,e=-i.wheelDelta/120,e*=this._stepExplicit?1:10),t+-e}_arrowKeyMultiplier(i){let t=this._stepExplicit?1:10;return i.shiftKey?t*=10:i.altKey&&(t/=10),t}_snap(i){let t=0;return this._hasMin?t=this._min:this._hasMax&&(t=this._max),i-=t,i=Math.round(i/this._step)*this._step,i+=t,i=parseFloat(i.toPrecision(15)),i}_clamp(i){return i<this._min&&(i=this._min),i>this._max&&(i=this._max),i}_snapClampSetValue(i){this.setValue(this._clamp(this._snap(i)))}get _hasScrollBar(){let i=this.parent.root.$children;return i.scrollHeight>i.clientHeight}get _hasMin(){return this._min!==void 0}get _hasMax(){return this._max!==void 0}},F=class extends v{constructor(i,t,e,n){super(i,t,e,"lil-option"),this.$select=document.createElement("select"),this.$select.setAttribute("aria-labelledby",this.$name.id),this.$display=document.createElement("div"),this.$display.classList.add("lil-display"),this.$select.addEventListener("change",()=>{this.setValue(this._values[this.$select.selectedIndex]),this._callOnFinishChange()}),this.$select.addEventListener("focus",()=>{this.$display.classList.add("lil-focus")}),this.$select.addEventListener("blur",()=>{this.$display.classList.remove("lil-focus")}),this.$widget.appendChild(this.$select),this.$widget.appendChild(this.$display),this.$disable=this.$select,this.options(n)}options(i){return this._values=Array.isArray(i)?i:Object.values(i),this._names=Array.isArray(i)?i:Object.keys(i),this.$select.replaceChildren(),this._names.forEach(t=>{let e=document.createElement("option");e.textContent=t,this.$select.appendChild(e)}),this.updateDisplay(),this}updateDisplay(){let i=this.getValue(),t=this._values.indexOf(i);return this.$select.selectedIndex=t,this.$display.textContent=t===-1?i:this._names[t],this}},M=class extends v{constructor(i,t,e){super(i,t,e,"lil-string"),this.$input=document.createElement("input"),this.$input.setAttribute("type","text"),this.$input.setAttribute("spellcheck","false"),this.$input.setAttribute("aria-labelledby",this.$name.id),this.$input.addEventListener("input",()=>{this.setValue(this.$input.value)}),this.$input.addEventListener("keydown",n=>{n.code==="Enter"&&this.$input.blur()}),this.$input.addEventListener("blur",()=>{this._callOnFinishChange()}),this.$widget.appendChild(this.$input),this.$disable=this.$input,this.updateDisplay()}updateDisplay(){return this.$input.value=this.getValue(),this}},K=`.lil-gui {
      font-family: var(--font-family);
      font-size: var(--font-size);
      line-height: 1;
      font-weight: normal;
      font-style: normal;
      text-align: left;
      color: var(--text-color);
      user-select: none;
      -webkit-user-select: none;
      touch-action: manipulation;
      --background-color: #1f1f1f;
      --text-color: #ebebeb;
      --title-background-color: #111111;
      --title-text-color: #ebebeb;
      --widget-color: #424242;
      --hover-color: #4f4f4f;
      --focus-color: #595959;
      --number-color: #2cc9ff;
      --string-color: #a2db3c;
      --font-size: 11px;
      --input-font-size: 11px;
      --font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
      --font-family-mono: Menlo, Monaco, Consolas, "Droid Sans Mono", monospace;
      --padding: 4px;
      --spacing: 4px;
      --widget-height: 20px;
      --title-height: calc(var(--widget-height) + var(--spacing) * 1.25);
      --name-width: 45%;
      --slider-knob-width: 2px;
      --slider-input-width: 27%;
      --color-input-width: 27%;
      --slider-input-min-width: 45px;
      --color-input-min-width: 45px;
      --folder-indent: 7px;
      --widget-padding: 0 0 0 3px;
      --widget-border-radius: 2px;
      --checkbox-size: calc(0.75 * var(--widget-height));
      --scrollbar-width: 5px;
    }
    .lil-gui, .lil-gui * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    .lil-gui.lil-root {
      width: var(--width, 245px);
      display: flex;
      flex-direction: column;
      background: var(--background-color);
    }
    .lil-gui.lil-root > .lil-title {
      background: var(--title-background-color);
      color: var(--title-text-color);
    }
    .lil-gui.lil-root > .lil-children {
      overflow-x: hidden;
      overflow-y: auto;
    }
    .lil-gui.lil-root > .lil-children::-webkit-scrollbar {
      width: var(--scrollbar-width);
      height: var(--scrollbar-width);
      background: var(--background-color);
    }
    .lil-gui.lil-root > .lil-children::-webkit-scrollbar-thumb {
      border-radius: var(--scrollbar-width);
      background: var(--focus-color);
    }
    @media (pointer: coarse) {
      .lil-gui.lil-allow-touch-styles, .lil-gui.lil-allow-touch-styles .lil-gui {
        --widget-height: 28px;
        --padding: 6px;
        --spacing: 6px;
        --font-size: 13px;
        --input-font-size: 16px;
        --folder-indent: 10px;
        --scrollbar-width: 7px;
        --slider-input-min-width: 50px;
        --color-input-min-width: 65px;
      }
    }
    .lil-gui.lil-force-touch-styles, .lil-gui.lil-force-touch-styles .lil-gui {
      --widget-height: 28px;
      --padding: 6px;
      --spacing: 6px;
      --font-size: 13px;
      --input-font-size: 16px;
      --folder-indent: 10px;
      --scrollbar-width: 7px;
      --slider-input-min-width: 50px;
      --color-input-min-width: 65px;
    }
    .lil-gui.lil-auto-place, .lil-gui.autoPlace {
      max-height: 100%;
      position: fixed;
      top: 0;
      right: 15px;
      z-index: 1001;
    }

    .lil-controller {
      display: flex;
      align-items: center;
      padding: 0 var(--padding);
      margin: var(--spacing) 0;
    }
    .lil-controller.lil-disabled {
      opacity: 0.5;
    }
    .lil-controller.lil-disabled, .lil-controller.lil-disabled * {
      pointer-events: none !important;
    }
    .lil-controller > .lil-name {
      min-width: var(--name-width);
      flex-shrink: 0;
      white-space: pre;
      padding-right: var(--spacing);
      line-height: var(--widget-height);
    }
    .lil-controller .lil-widget {
      position: relative;
      display: flex;
      align-items: center;
      width: 100%;
      min-height: var(--widget-height);
    }
    .lil-controller.lil-string input {
      color: var(--string-color);
    }
    .lil-controller.lil-boolean {
      cursor: pointer;
    }
    .lil-controller.lil-color .lil-display {
      width: 100%;
      height: var(--widget-height);
      border-radius: var(--widget-border-radius);
      position: relative;
    }
    @media (hover: hover) {
      .lil-controller.lil-color .lil-display:hover:before {
        content: " ";
        display: block;
        position: absolute;
        border-radius: var(--widget-border-radius);
        border: 1px solid #fff9;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
      }
    }
    .lil-controller.lil-color input[type=color] {
      opacity: 0;
      width: 100%;
      height: 100%;
      cursor: pointer;
    }
    .lil-controller.lil-color input[type=text] {
      margin-left: var(--spacing);
      font-family: var(--font-family-mono);
      min-width: var(--color-input-min-width);
      width: var(--color-input-width);
      flex-shrink: 0;
    }
    .lil-controller.lil-option select {
      opacity: 0;
      position: absolute;
      width: 100%;
      max-width: 100%;
    }
    .lil-controller.lil-option .lil-display {
      position: relative;
      pointer-events: none;
      border-radius: var(--widget-border-radius);
      height: var(--widget-height);
      line-height: var(--widget-height);
      max-width: 100%;
      overflow: hidden;
      word-break: break-all;
      padding-left: 0.55em;
      padding-right: 1.75em;
      background: var(--widget-color);
    }
    @media (hover: hover) {
      .lil-controller.lil-option .lil-display.lil-focus {
        background: var(--focus-color);
      }
    }
    .lil-controller.lil-option .lil-display.lil-active {
      background: var(--focus-color);
    }
    .lil-controller.lil-option .lil-display:after {
      font-family: "lil-gui";
      content: "\u2195";
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      padding-right: 0.375em;
    }
    .lil-controller.lil-option .lil-widget,
    .lil-controller.lil-option select {
      cursor: pointer;
    }
    @media (hover: hover) {
      .lil-controller.lil-option .lil-widget:hover .lil-display {
        background: var(--hover-color);
      }
    }
    .lil-controller.lil-number input {
      color: var(--number-color);
    }
    .lil-controller.lil-number.lil-has-slider input {
      margin-left: var(--spacing);
      width: var(--slider-input-width);
      min-width: var(--slider-input-min-width);
      flex-shrink: 0;
    }
    .lil-controller.lil-number .lil-slider {
      width: 100%;
      height: var(--widget-height);
      background: var(--widget-color);
      border-radius: var(--widget-border-radius);
      padding-right: var(--slider-knob-width);
      overflow: hidden;
      cursor: ew-resize;
      touch-action: pan-y;
    }
    @media (hover: hover) {
      .lil-controller.lil-number .lil-slider:hover {
        background: var(--hover-color);
      }
    }
    .lil-controller.lil-number .lil-slider.lil-active {
      background: var(--focus-color);
    }
    .lil-controller.lil-number .lil-slider.lil-active .lil-fill {
      opacity: 0.95;
    }
    .lil-controller.lil-number .lil-fill {
      height: 100%;
      border-right: var(--slider-knob-width) solid var(--number-color);
      box-sizing: content-box;
    }

    .lil-dragging .lil-gui {
      --hover-color: var(--widget-color);
    }
    .lil-dragging * {
      cursor: ew-resize !important;
    }
    .lil-dragging.lil-vertical * {
      cursor: ns-resize !important;
    }

    .lil-gui .lil-title {
      height: var(--title-height);
      font-weight: 600;
      padding: 0 var(--padding);
      width: 100%;
      text-align: left;
      background: none;
      text-decoration-skip: objects;
    }
    .lil-gui .lil-title:before {
      font-family: "lil-gui";
      content: "\u25BE";
      padding-right: 2px;
      display: inline-block;
    }
    .lil-gui .lil-title:active {
      background: var(--title-background-color);
      opacity: 0.75;
    }
    @media (hover: hover) {
      body:not(.lil-dragging) .lil-gui .lil-title:hover {
        background: var(--title-background-color);
        opacity: 0.85;
      }
      .lil-gui .lil-title:focus {
        text-decoration: underline var(--focus-color);
      }
    }
    .lil-gui.lil-root > .lil-title:focus {
      text-decoration: none !important;
    }
    .lil-gui.lil-closed > .lil-title:before {
      content: "\u25B8";
    }
    .lil-gui.lil-closed > .lil-children {
      transform: translateY(-7px);
      opacity: 0;
    }
    .lil-gui.lil-closed:not(.lil-transition) > .lil-children {
      display: none;
    }
    .lil-gui.lil-transition > .lil-children {
      transition-duration: 300ms;
      transition-property: height, opacity, transform;
      transition-timing-function: cubic-bezier(0.2, 0.6, 0.35, 1);
      overflow: hidden;
      pointer-events: none;
    }
    .lil-gui .lil-children:empty:before {
      content: "Empty";
      padding: 0 var(--padding);
      margin: var(--spacing) 0;
      display: block;
      height: var(--widget-height);
      font-style: italic;
      line-height: var(--widget-height);
      opacity: 0.5;
    }
    .lil-gui.lil-root > .lil-children > .lil-gui > .lil-title {
      border: 0 solid var(--widget-color);
      border-width: 1px 0;
      transition: border-color 300ms;
    }
    .lil-gui.lil-root > .lil-children > .lil-gui.lil-closed > .lil-title {
      border-bottom-color: transparent;
    }
    .lil-gui + .lil-controller {
      border-top: 1px solid var(--widget-color);
      margin-top: 0;
      padding-top: var(--spacing);
    }
    .lil-gui .lil-gui .lil-gui > .lil-title {
      border: none;
    }
    .lil-gui .lil-gui .lil-gui > .lil-children {
      border: none;
      margin-left: var(--folder-indent);
      border-left: 2px solid var(--widget-color);
    }
    .lil-gui .lil-gui .lil-controller {
      border: none;
    }

    .lil-gui label, .lil-gui input, .lil-gui button {
      -webkit-tap-highlight-color: transparent;
    }
    .lil-gui input {
      border: 0;
      outline: none;
      font-family: var(--font-family);
      font-size: var(--input-font-size);
      border-radius: var(--widget-border-radius);
      height: var(--widget-height);
      background: var(--widget-color);
      color: var(--text-color);
      width: 100%;
    }
    @media (hover: hover) {
      .lil-gui input:hover {
        background: var(--hover-color);
      }
      .lil-gui input:active {
        background: var(--focus-color);
      }
    }
    .lil-gui input:disabled {
      opacity: 1;
    }
    .lil-gui input[type=text],
    .lil-gui input[type=number] {
      padding: var(--widget-padding);
      -moz-appearance: textfield;
    }
    .lil-gui input[type=text]:focus,
    .lil-gui input[type=number]:focus {
      background: var(--focus-color);
    }
    .lil-gui input[type=checkbox] {
      appearance: none;
      width: var(--checkbox-size);
      height: var(--checkbox-size);
      border-radius: var(--widget-border-radius);
      text-align: center;
      cursor: pointer;
    }
    .lil-gui input[type=checkbox]:checked:before {
      font-family: "lil-gui";
      content: "\u2713";
      font-size: var(--checkbox-size);
      line-height: var(--checkbox-size);
    }
    @media (hover: hover) {
      .lil-gui input[type=checkbox]:focus {
        box-shadow: inset 0 0 0 1px var(--focus-color);
      }
    }
    .lil-gui button {
      outline: none;
      cursor: pointer;
      font-family: var(--font-family);
      font-size: var(--font-size);
      color: var(--text-color);
      width: 100%;
      border: none;
    }
    .lil-gui .lil-controller button {
      height: var(--widget-height);
      text-transform: none;
      background: var(--widget-color);
      border-radius: var(--widget-border-radius);
    }
    @media (hover: hover) {
      .lil-gui .lil-controller button:hover {
        background: var(--hover-color);
      }
      .lil-gui .lil-controller button:focus {
        box-shadow: inset 0 0 0 1px var(--focus-color);
      }
    }
    .lil-gui .lil-controller button:active {
      background: var(--focus-color);
    }

    @font-face {
      font-family: "lil-gui";
      src: url("data:application/font-woff2;charset=utf-8;base64,d09GMgABAAAAAALkAAsAAAAABtQAAAKVAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHFQGYACDMgqBBIEbATYCJAMUCwwABCAFhAoHgQQbHAbIDiUFEYVARAAAYQTVWNmz9MxhEgodq49wYRUFKE8GWNiUBxI2LBRaVnc51U83Gmhs0Q7JXWMiz5eteLwrKwuxHO8VFxUX9UpZBs6pa5ABRwHA+t3UxUnH20EvVknRerzQgX6xC/GH6ZUvTcAjAv122dF28OTqCXrPuyaDER30YBA1xnkVutDDo4oCi71Ca7rrV9xS8dZHbPHefsuwIyCpmT7j+MnjAH5X3984UZoFFuJ0yiZ4XEJFxjagEBeqs+e1iyK8Xf/nOuwF+vVK0ur765+vf7txotUi0m3N0m/84RGSrBCNrh8Ee5GjODjF4gnWP+dJrH/Lk9k4oT6d+gr6g/wssA2j64JJGP6cmx554vUZnpZfn6ZfX2bMwPPrlANsB86/DiHjhl0OP+c87+gaJo/gY084s3HoYL/ZkWHTRfBXvvoHnnkHvngKun4KBE/ede7tvq3/vQOxDXB1/fdNz6XbPdcr0Vhpojj9dG+owuSKFsslCi1tgEjirjXdwMiov2EioadxmqTHUCIwo8NgQaeIasAi0fTYSPTbSmwbMOFduyh9wvBrESGY0MtgRjtgQR8Q1bRPohn2UoCRZf9wyYANMXFeJTysqAe0I4mrherOekFdKMrYvJjLvOIUM9SuwYB5DVZUwwVjJJOaUnZCmcEkIZZrKqNvRGRMvmFZsmhP4VMKCSXBhSqUBxgMS7h0cZvEd71AWkEhGWaeMFcNnpqyJkyXgYL7PQ1MoSq0wDAkRtJIijkZSmqYTiSImfLiSWXIZwhRh3Rug2X0kk1Dgj+Iu43u5p98ghopcpSo0Uyc8SnjlYX59WUeaMoDqmVD2TOWD9a4pCRAzf2ECgwGcrHjPOWY9bNxq/OL3I/QjwEAAAA=") format("woff2");
    }`;function J(l){let i=document.createElement("style");i.innerHTML=l;let t=document.querySelector("head link[rel=stylesheet], head style");t?document.head.insertBefore(i,t):document.head.appendChild(i)}var O=!1,A=class l{constructor({parent:i,autoPlace:t=i===void 0,container:e,width:n,title:s="Controls",closeFolders:o=!1,injectStyles:h=!0,touchStyles:m=!0}={}){if(this.parent=i,this.root=i?i.root:this,this.children=[],this.controllers=[],this.folders=[],this._closed=!1,this._hidden=!1,this.domElement=document.createElement("div"),this.domElement.classList.add("lil-gui"),this.$title=document.createElement("button"),this.$title.classList.add("lil-title"),this.$title.setAttribute("aria-expanded",!0),this.$title.addEventListener("click",()=>this.openAnimated(this._closed)),this.$title.addEventListener("touchstart",()=>{},{passive:!0}),this.$children=document.createElement("div"),this.$children.classList.add("lil-children"),this.domElement.appendChild(this.$title),this.domElement.appendChild(this.$children),this.title(s),this.parent){this.parent.children.push(this),this.parent.folders.push(this),this.parent.$children.appendChild(this.domElement);return}this.domElement.classList.add("lil-root"),m&&this.domElement.classList.add("lil-allow-touch-styles"),!O&&h&&(J(K),O=!0),e?e.appendChild(this.domElement):t&&(this.domElement.classList.add("lil-auto-place","autoPlace"),document.body.appendChild(this.domElement)),n&&this.domElement.style.setProperty("--width",n+"px"),this._closeFolders=o}add(i,t,e,n,s){if(Object(e)===e)return new F(this,i,t,e);let o=i[t];switch(typeof o){case"number":return new L(this,i,t,e,n,s);case"boolean":return new $(this,i,t);case"string":return new M(this,i,t);case"function":return new x(this,i,t)}console.error(`gui.add failed
    	property:`,t,`
    	object:`,i,`
    	value:`,o)}addColor(i,t,e=1){return new S(this,i,t,e)}addFolder(i){let t=new l({parent:this,title:i});return this.root._closeFolders&&t.close(),t}load(i,t=!0){return i.controllers&&this.controllers.forEach(e=>{e instanceof x||e._name in i.controllers&&e.load(i.controllers[e._name])}),t&&i.folders&&this.folders.forEach(e=>{e._title in i.folders&&e.load(i.folders[e._title])}),this}save(i=!0){let t={controllers:{},folders:{}};return this.controllers.forEach(e=>{if(!(e instanceof x)){if(e._name in t.controllers)throw new Error(`Cannot save GUI with duplicate property "${e._name}"`);t.controllers[e._name]=e.save()}}),i&&this.folders.forEach(e=>{if(e._title in t.folders)throw new Error(`Cannot save GUI with duplicate folder "${e._title}"`);t.folders[e._title]=e.save()}),t}open(i=!0){return this._setClosed(!i),this.$title.setAttribute("aria-expanded",!this._closed),this.domElement.classList.toggle("lil-closed",this._closed),this}close(){return this.open(!1)}_setClosed(i){this._closed!==i&&(this._closed=i,this._callOnOpenClose(this))}show(i=!0){return this._hidden=!i,this.domElement.style.display=this._hidden?"none":"",this}hide(){return this.show(!1)}openAnimated(i=!0){return this._setClosed(!i),this.$title.setAttribute("aria-expanded",!this._closed),requestAnimationFrame(()=>{let t=this.$children.clientHeight;this.$children.style.height=t+"px",this.domElement.classList.add("lil-transition");let e=s=>{s.target===this.$children&&(this.$children.style.height="",this.domElement.classList.remove("lil-transition"),this.$children.removeEventListener("transitionend",e))};this.$children.addEventListener("transitionend",e);let n=i?this.$children.scrollHeight:0;this.domElement.classList.toggle("lil-closed",!i),requestAnimationFrame(()=>{this.$children.style.height=n+"px"})}),this}title(i){return this._title=i,this.$title.textContent=i,this}reset(i=!0){return(i?this.controllersRecursive():this.controllers).forEach(e=>e.reset()),this}onChange(i){return this._onChange=i,this}_callOnChange(i){this.parent&&this.parent._callOnChange(i),this._onChange!==void 0&&this._onChange.call(this,{object:i.object,property:i.property,value:i.getValue(),controller:i})}onFinishChange(i){return this._onFinishChange=i,this}_callOnFinishChange(i){this.parent&&this.parent._callOnFinishChange(i),this._onFinishChange!==void 0&&this._onFinishChange.call(this,{object:i.object,property:i.property,value:i.getValue(),controller:i})}onOpenClose(i){return this._onOpenClose=i,this}_callOnOpenClose(i){this.parent&&this.parent._callOnOpenClose(i),this._onOpenClose!==void 0&&this._onOpenClose.call(this,i)}destroy(){this.parent&&(this.parent.children.splice(this.parent.children.indexOf(this),1),this.parent.folders.splice(this.parent.folders.indexOf(this),1)),this.domElement.parentElement&&this.domElement.parentElement.removeChild(this.domElement),Array.from(this.children).forEach(i=>i.destroy())}controllersRecursive(){let i=Array.from(this.controllers);return this.folders.forEach(t=>{i=i.concat(t.controllersRecursive())}),i}foldersRecursive(){let i=Array.from(this.folders);return this.folders.forEach(t=>{i=i.concat(t.foldersRecursive())}),i}};var V=`.lil-gui {
      font-family: var(--font-family);
      font-size: var(--font-size);
      line-height: 1;
      font-weight: normal;
      font-style: normal;
      text-align: left;
      color: var(--text-color);
      user-select: none;
      -webkit-user-select: none;
      touch-action: manipulation;
      --background-color: #1f1f1f;
      --text-color: #ebebeb;
      --title-background-color: #111111;
      --title-text-color: #ebebeb;
      --widget-color: #424242;
      --hover-color: #4f4f4f;
      --focus-color: #595959;
      --number-color: #2cc9ff;
      --string-color: #a2db3c;
      --font-size: 11px;
      --input-font-size: 11px;
      --font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
      --font-family-mono: Menlo, Monaco, Consolas, "Droid Sans Mono", monospace;
      --padding: 4px;
      --spacing: 4px;
      --widget-height: 20px;
      --title-height: calc(var(--widget-height) + var(--spacing) * 1.25);
      --name-width: 45%;
      --slider-knob-width: 2px;
      --slider-input-width: 27%;
      --color-input-width: 27%;
      --slider-input-min-width: 45px;
      --color-input-min-width: 45px;
      --folder-indent: 7px;
      --widget-padding: 0 0 0 3px;
      --widget-border-radius: 2px;
      --checkbox-size: calc(0.75 * var(--widget-height));
      --scrollbar-width: 5px;
    }
    .lil-gui, .lil-gui * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    .lil-gui.lil-root {
      width: var(--width, 245px);
      display: flex;
      flex-direction: column;
      background: var(--background-color);
    }
    .lil-gui.lil-root > .lil-title {
      background: var(--title-background-color);
      color: var(--title-text-color);
    }
    .lil-gui.lil-root > .lil-children {
      overflow-x: hidden;
      overflow-y: auto;
    }
    .lil-gui.lil-root > .lil-children::-webkit-scrollbar {
      width: var(--scrollbar-width);
      height: var(--scrollbar-width);
      background: var(--background-color);
    }
    .lil-gui.lil-root > .lil-children::-webkit-scrollbar-thumb {
      border-radius: var(--scrollbar-width);
      background: var(--focus-color);
    }
    @media (pointer: coarse) {
      .lil-gui.lil-allow-touch-styles, .lil-gui.lil-allow-touch-styles .lil-gui {
        --widget-height: 28px;
        --padding: 6px;
        --spacing: 6px;
        --font-size: 13px;
        --input-font-size: 16px;
        --folder-indent: 10px;
        --scrollbar-width: 7px;
        --slider-input-min-width: 50px;
        --color-input-min-width: 65px;
      }
    }
    .lil-gui.lil-force-touch-styles, .lil-gui.lil-force-touch-styles .lil-gui {
      --widget-height: 28px;
      --padding: 6px;
      --spacing: 6px;
      --font-size: 13px;
      --input-font-size: 16px;
      --folder-indent: 10px;
      --scrollbar-width: 7px;
      --slider-input-min-width: 50px;
      --color-input-min-width: 65px;
    }
    .lil-gui.lil-auto-place, .lil-gui.autoPlace {
      max-height: 100%;
      position: fixed;
      top: 0;
      right: 15px;
      z-index: 1001;
    }

    .lil-controller {
      display: flex;
      align-items: center;
      padding: 0 var(--padding);
      margin: var(--spacing) 0;
    }
    .lil-controller.lil-disabled {
      opacity: 0.5;
    }
    .lil-controller.lil-disabled, .lil-controller.lil-disabled * {
      pointer-events: none !important;
    }
    .lil-controller > .lil-name {
      min-width: var(--name-width);
      flex-shrink: 0;
      white-space: pre;
      padding-right: var(--spacing);
      line-height: var(--widget-height);
    }
    .lil-controller .lil-widget {
      position: relative;
      display: flex;
      align-items: center;
      width: 100%;
      min-height: var(--widget-height);
    }
    .lil-controller.lil-string input {
      color: var(--string-color);
    }
    .lil-controller.lil-boolean {
      cursor: pointer;
    }
    .lil-controller.lil-color .lil-display {
      width: 100%;
      height: var(--widget-height);
      border-radius: var(--widget-border-radius);
      position: relative;
    }
    @media (hover: hover) {
      .lil-controller.lil-color .lil-display:hover:before {
        content: " ";
        display: block;
        position: absolute;
        border-radius: var(--widget-border-radius);
        border: 1px solid #fff9;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
      }
    }
    .lil-controller.lil-color input[type=color] {
      opacity: 0;
      width: 100%;
      height: 100%;
      cursor: pointer;
    }
    .lil-controller.lil-color input[type=text] {
      margin-left: var(--spacing);
      font-family: var(--font-family-mono);
      min-width: var(--color-input-min-width);
      width: var(--color-input-width);
      flex-shrink: 0;
    }
    .lil-controller.lil-option select {
      opacity: 0;
      position: absolute;
      width: 100%;
      max-width: 100%;
    }
    .lil-controller.lil-option .lil-display {
      position: relative;
      pointer-events: none;
      border-radius: var(--widget-border-radius);
      height: var(--widget-height);
      line-height: var(--widget-height);
      max-width: 100%;
      overflow: hidden;
      word-break: break-all;
      padding-left: 0.55em;
      padding-right: 1.75em;
      background: var(--widget-color);
    }
    @media (hover: hover) {
      .lil-controller.lil-option .lil-display.lil-focus {
        background: var(--focus-color);
      }
    }
    .lil-controller.lil-option .lil-display.lil-active {
      background: var(--focus-color);
    }
    .lil-controller.lil-option .lil-display:after {
      font-family: "lil-gui";
      content: "\u2195";
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      padding-right: 0.375em;
    }
    .lil-controller.lil-option .lil-widget,
    .lil-controller.lil-option select {
      cursor: pointer;
    }
    @media (hover: hover) {
      .lil-controller.lil-option .lil-widget:hover .lil-display {
        background: var(--hover-color);
      }
    }
    .lil-controller.lil-number input {
      color: var(--number-color);
    }
    .lil-controller.lil-number.lil-has-slider input {
      margin-left: var(--spacing);
      width: var(--slider-input-width);
      min-width: var(--slider-input-min-width);
      flex-shrink: 0;
    }
    .lil-controller.lil-number .lil-slider {
      width: 100%;
      height: var(--widget-height);
      background: var(--widget-color);
      border-radius: var(--widget-border-radius);
      padding-right: var(--slider-knob-width);
      overflow: hidden;
      cursor: ew-resize;
      touch-action: pan-y;
    }
    @media (hover: hover) {
      .lil-controller.lil-number .lil-slider:hover {
        background: var(--hover-color);
      }
    }
    .lil-controller.lil-number .lil-slider.lil-active {
      background: var(--focus-color);
    }
    .lil-controller.lil-number .lil-slider.lil-active .lil-fill {
      opacity: 0.95;
    }
    .lil-controller.lil-number .lil-fill {
      height: 100%;
      border-right: var(--slider-knob-width) solid var(--number-color);
      box-sizing: content-box;
    }

    .lil-dragging .lil-gui {
      --hover-color: var(--widget-color);
    }
    .lil-dragging * {
      cursor: ew-resize !important;
    }
    .lil-dragging.lil-vertical * {
      cursor: ns-resize !important;
    }

    .lil-gui .lil-title {
      height: var(--title-height);
      font-weight: 600;
      padding: 0 var(--padding);
      width: 100%;
      text-align: left;
      background: none;
      text-decoration-skip: objects;
    }
    .lil-gui .lil-title:before {
      font-family: "lil-gui";
      content: "\u25BE";
      padding-right: 2px;
      display: inline-block;
    }
    .lil-gui .lil-title:active {
      background: var(--title-background-color);
      opacity: 0.75;
    }
    @media (hover: hover) {
      body:not(.lil-dragging) .lil-gui .lil-title:hover {
        background: var(--title-background-color);
        opacity: 0.85;
      }
      .lil-gui .lil-title:focus {
        text-decoration: underline var(--focus-color);
      }
    }
    .lil-gui.lil-root > .lil-title:focus {
      text-decoration: none !important;
    }
    .lil-gui.lil-closed > .lil-title:before {
      content: "\u25B8";
    }
    .lil-gui.lil-closed > .lil-children {
      transform: translateY(-7px);
      opacity: 0;
    }
    .lil-gui.lil-closed:not(.lil-transition) > .lil-children {
      display: none;
    }
    .lil-gui.lil-transition > .lil-children {
      transition-duration: 300ms;
      transition-property: height, opacity, transform;
      transition-timing-function: cubic-bezier(0.2, 0.6, 0.35, 1);
      overflow: hidden;
      pointer-events: none;
    }
    .lil-gui .lil-children:empty:before {
      content: "Empty";
      padding: 0 var(--padding);
      margin: var(--spacing) 0;
      display: block;
      height: var(--widget-height);
      font-style: italic;
      line-height: var(--widget-height);
      opacity: 0.5;
    }
    .lil-gui.lil-root > .lil-children > .lil-gui > .lil-title {
      border: 0 solid var(--widget-color);
      border-width: 1px 0;
      transition: border-color 300ms;
    }
    .lil-gui.lil-root > .lil-children > .lil-gui.lil-closed > .lil-title {
      border-bottom-color: transparent;
    }
    .lil-gui + .lil-controller {
      border-top: 1px solid var(--widget-color);
      margin-top: 0;
      padding-top: var(--spacing);
    }
    .lil-gui .lil-gui .lil-gui > .lil-title {
      border: none;
    }
    .lil-gui .lil-gui .lil-gui > .lil-children {
      border: none;
      margin-left: var(--folder-indent);
      border-left: 2px solid var(--widget-color);
    }
    .lil-gui .lil-gui .lil-controller {
      border: none;
    }

    .lil-gui label, .lil-gui input, .lil-gui button {
      -webkit-tap-highlight-color: transparent;
    }
    .lil-gui input {
      border: 0;
      outline: none;
      font-family: var(--font-family);
      font-size: var(--input-font-size);
      border-radius: var(--widget-border-radius);
      height: var(--widget-height);
      background: var(--widget-color);
      color: var(--text-color);
      width: 100%;
    }
    @media (hover: hover) {
      .lil-gui input:hover {
        background: var(--hover-color);
      }
      .lil-gui input:active {
        background: var(--focus-color);
      }
    }
    .lil-gui input:disabled {
      opacity: 1;
    }
    .lil-gui input[type=text],
    .lil-gui input[type=number] {
      padding: var(--widget-padding);
      -moz-appearance: textfield;
    }
    .lil-gui input[type=text]:focus,
    .lil-gui input[type=number]:focus {
      background: var(--focus-color);
    }
    .lil-gui input[type=checkbox] {
      appearance: none;
      width: var(--checkbox-size);
      height: var(--checkbox-size);
      border-radius: var(--widget-border-radius);
      text-align: center;
      cursor: pointer;
    }
    .lil-gui input[type=checkbox]:checked:before {
      font-family: "lil-gui";
      content: "\u2713";
      font-size: var(--checkbox-size);
      line-height: var(--checkbox-size);
    }
    @media (hover: hover) {
      .lil-gui input[type=checkbox]:focus {
        box-shadow: inset 0 0 0 1px var(--focus-color);
      }
    }
    .lil-gui button {
      outline: none;
      cursor: pointer;
      font-family: var(--font-family);
      font-size: var(--font-size);
      color: var(--text-color);
      width: 100%;
      border: none;
    }
    .lil-gui .lil-controller button {
      height: var(--widget-height);
      text-transform: none;
      background: var(--widget-color);
      border-radius: var(--widget-border-radius);
    }
    @media (hover: hover) {
      .lil-gui .lil-controller button:hover {
        background: var(--hover-color);
      }
      .lil-gui .lil-controller button:focus {
        box-shadow: inset 0 0 0 1px var(--focus-color);
      }
    }
    .lil-gui .lil-controller button:active {
      background: var(--focus-color);
    }

    @font-face {
      font-family: "lil-gui";
      src: url("data:application/font-woff2;charset=utf-8;base64,d09GMgABAAAAAALkAAsAAAAABtQAAAKVAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHFQGYACDMgqBBIEbATYCJAMUCwwABCAFhAoHgQQbHAbIDiUFEYVARAAAYQTVWNmz9MxhEgodq49wYRUFKE8GWNiUBxI2LBRaVnc51U83Gmhs0Q7JXWMiz5eteLwrKwuxHO8VFxUX9UpZBs6pa5ABRwHA+t3UxUnH20EvVknRerzQgX6xC/GH6ZUvTcAjAv122dF28OTqCXrPuyaDER30YBA1xnkVutDDo4oCi71Ca7rrV9xS8dZHbPHefsuwIyCpmT7j+MnjAH5X3984UZoFFuJ0yiZ4XEJFxjagEBeqs+e1iyK8Xf/nOuwF+vVK0ur765+vf7txotUi0m3N0m/84RGSrBCNrh8Ee5GjODjF4gnWP+dJrH/Lk9k4oT6d+gr6g/wssA2j64JJGP6cmx554vUZnpZfn6ZfX2bMwPPrlANsB86/DiHjhl0OP+c87+gaJo/gY084s3HoYL/ZkWHTRfBXvvoHnnkHvngKun4KBE/ede7tvq3/vQOxDXB1/fdNz6XbPdcr0Vhpojj9dG+owuSKFsslCi1tgEjirjXdwMiov2EioadxmqTHUCIwo8NgQaeIasAi0fTYSPTbSmwbMOFduyh9wvBrESGY0MtgRjtgQR8Q1bRPohn2UoCRZf9wyYANMXFeJTysqAe0I4mrherOekFdKMrYvJjLvOIUM9SuwYB5DVZUwwVjJJOaUnZCmcEkIZZrKqNvRGRMvmFZsmhP4VMKCSXBhSqUBxgMS7h0cZvEd71AWkEhGWaeMFcNnpqyJkyXgYL7PQ1MoSq0wDAkRtJIijkZSmqYTiSImfLiSWXIZwhRh3Rug2X0kk1Dgj+Iu43u5p98ghopcpSo0Uyc8SnjlYX59WUeaMoDqmVD2TOWD9a4pCRAzf2ECgwGcrHjPOWY9bNxq/OL3I/QjwEAAAA=") format("woff2");
    }
    `;var H="@lionad/dsh-client-ui-skin-ascii-rest";function D(l){let i=Math.abs(l),t=i===0?1:i*2;return{min:Math.min(0,l-t),max:Math.max(t,l+t),step:t<=2?.001:t<=20?.1:1}}function Q(l,i,t){let e=l.addFolder("\u753B\u9762"),n={...i},s=o=>{t.onAppearance({[o]:n[o]})};e.add(n,"surface",0,1,.01).name("\u9762\u677F\u4E0D\u900F\u660E\u5EA6").onChange(()=>s("surface")),e.add(n,"opacity",0,1,.01).name("\u753B\u9762\u4EAE\u5EA6").onChange(()=>s("opacity")),e.add(n,"blur",0,16,.5).name("\u6A21\u7CCA").onChange(()=>s("blur")),e.add(n,"veil",0,1,.01).name("\u8499\u5C42").onChange(()=>s("veil")),e.add(n,"fps",0,30,1).name("\u5E27\u7387").onChange(()=>s("fps")),e.add(n,"still").name("\u9759\u6B62").onChange(()=>s("still"))}function z(l,i,t,e){let n={};for(let[d,c]of Object.entries(i))(typeof c=="number"||typeof c=="boolean")&&(n[d]=c);for(let[d,c]of Object.entries(t))n[d]=c;let s=Object.entries(n).filter(([,d])=>typeof d=="number"),o=Object.entries(n).filter(([,d])=>typeof d=="boolean");if(s.length===0&&o.length===0)return null;let h=l.addFolder("\u573A\u666F\u53C2\u6570"),m={...n};for(let[d,c]of s){let p=D(c);h.add(m,d,p.min,p.max,p.step).onChange(u=>{e.onPiece({[d]:u})})}for(let[d]of o)h.add(m,d).onChange(c=>{e.onPiece({[d]:c})});return h}function ii(){if(typeof document>"u")return;let l="lil-gui/dist/lil-gui.css";if(document.querySelector(`style[data-plugin-css=${JSON.stringify(l)}]`)!==null)return;let i=document.createElement("style");i.dataset.plugin=H,i.dataset.pluginCss=l,i.textContent=V,document.head.appendChild(i)}function I(l,i){let{callbacks:t,settings:e,scene:n,module:s}=i;ii();let o=new A({container:l,title:"ascii.rest",width:276,injectStyles:!1}),h=document.createElement("button");h.type="button",h.className="ascii-rest-gui__close",h.textContent="\xD7",h.setAttribute("aria-label",i.closeLabel),h.title=i.closeLabel,h.addEventListener("click",()=>t.onClose()),o.domElement.classList.add("ascii-rest-gui"),o.domElement.appendChild(h);let m=u=>{u.key==="Escape"&&t.onClose()};document.addEventListener("keydown",m),Q(o,e.appearance,t);let d=z(o,s.meta.options??{},e.piece[n.id]??{},t),c={scene:n.id},p={};for(let u of i.catalog)p[u.name]=u.id;return o.add(c,"scene",p).name("\u573A\u666F").onChange(u=>t.onScene(u)),o.add({save:t.onSave},"save").name("\u4FDD\u5B58"),{element:l,rebuild:(u,w,b)=>{d?.destroy(),d=z(o,w.meta.options??{},b,t),c.scene=u.id;for(let f of o.controllersRecursive())f.property==="scene"&&f.updateDisplay()},load:u=>{typeof u=="object"&&u!==null&&o.load(u)},capture:()=>o.save(),destroy:()=>{document.removeEventListener("keydown",m),o.destroy()}}}

    return module.exports;
  }
});
