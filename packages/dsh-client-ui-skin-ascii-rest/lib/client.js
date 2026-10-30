window.__ModuleLoader__.load({
  id: "@lionad/dsh-client-ui-skin-ascii-rest",
  factory: (require) => {
    var module = { exports: {} };
    var exports = module.exports;
"use strict";var Ve=Object.defineProperty;var mn=Object.getOwnPropertyDescriptor;var hn=Object.getOwnPropertyNames;var bn=Object.prototype.hasOwnProperty;var wt=(e,t)=>{for(var n in t)Ve(e,n,{get:t[n],enumerable:!0})},yn=(e,t,n,a)=>{if(t&&typeof t=="object"||typeof t=="function")for(let o of hn(t))!bn.call(e,o)&&o!==n&&Ve(e,o,{get:()=>t[o],enumerable:!(a=mn(t,o))||a.enumerable});return e};var wn=e=>yn(Ve({},"__esModule",{value:!0}),e);var ea={};wt(ea,{apply:()=>gn,boot:()=>Qn,inject:()=>un});module.exports=wn(ea);var vt=e=>typeof e=="number"&&Number.isInteger(e)&&e>0,xt=e=>typeof e=="string"&&/^#[0-9a-f]{6}$/i.test(e),vn=/^[a-z0-9][a-z0-9-]*$/;function St(e){if(typeof e!="object"||e===null)return null;let t=e,{id:n,name:a,note:o,cols:r,rows:i,cell:l,fps:c,ground:g,palette:u,still:p,loop:R}=t;if(typeof n!="string"||!vn.test(n)||typeof a!="string"||a===""||typeof o!="string"||!vt(r)||!vt(i)||l!==1&&l!==2||typeof c!="number"||!Number.isFinite(c)||c<0||!xt(g)||!Array.isArray(u)||u.length===0||!u.every(xt)||typeof p!="number"||!Number.isFinite(p)||p<0||R!==void 0&&(typeof R!="number"||!Number.isFinite(R)||R<=0))return null;let A={id:n,name:a,note:o,cols:r,rows:i,cell:l,fps:c,ground:g,palette:u,still:p};return R===void 0?A:{...A,loop:R}}function Ze(e){let t=typeof e=="object"&&e!==null?e:{},n=typeof t.source=="object"&&t.source!==null?t.source:{},a=Array.isArray(t.scenes)?t.scenes:[],o=[],r=new Set;for(let i of a){let l=St(i);l===null||r.has(l.id)||(r.add(l.id),o.push(l))}return{source:{repository:typeof n.repository=="string"?n.repository:"unknown",commit:typeof n.commit=="string"?n.commit:"unknown",packageVersion:typeof n.packageVersion=="string"?n.packageVersion:"unknown"},scenes:o}}var kt={repository:"bas3line/ascii",commit:"c556be4284a97599f78197c09ba744ad11c0145e",packageVersion:"0.4.0"},Mt=[{id:"alpine-dawn",name:"alpine dawn",note:"snow peaks catching first light above a still, misty mountain lake",cols:200,rows:100,cell:1,fps:15,ground:"#090c18",palette:["#0e1430","#151d40","#1d2752","#263365","#314179","#3e508c","#4f62a0","#6577b3","#8090c4","#9eaad3","#bec6e2","#4b3e6c","#6a5482","#8c6a92","#b0829c","#cf96a4","#e8a9a8","#f5bcaa","#ffd0b0","#ffe2c2","#fff1e0","#fdfaf6","#ffc887","#f7a965","#f2a08f","#e58a87","#f8b59d","#d97b7e","#7a4c4a","#a5654f","#523a4a","#1b2034","#262c45","#363c59","#0a1418","#0f1f24","#162a2f","#203a3c","#a3a7c6","#c6c3d8","#e0d4dc","#5a4f7e","#7b6c9c","#9a8cb6","#b8a8c8","#d8bccb"],still:0},{id:"amer-fort",name:"amer fort",note:"amer fort floodlit gold on its hill, mirrored in maota lake at night",cols:200,rows:100,cell:1,fps:15,ground:"#060915",palette:["#0a1230","#101a40","#16234f","#1e2e62","#283c78","#364d8e","#4a5f9f","#6a7fb8","#c9d4ee","#eef1f8","#fff6dc","#3a220f","#5a3415","#7d4a1c","#a06426","#c27f32","#dc9c44","#ecb85c","#f6d07e","#ffe4a6","#fff1cc","#0b0f1c","#121829","#1a2236","#2a2228","#4a3a2c","#4c6e34","#6f9448","#8fbf5a","#b4dc7c","#a08a62"],still:0},{id:"aurora-fjord",name:"aurora fjord",note:"aurora curtains rippling over a still fjord, a cabin lit on the shore",cols:200,rows:100,cell:1,fps:15,ground:"#05080f",palette:["#0b1322","#101b30","#16243f","#1e3050","#2a3f63","#0e3a33","#11573f","#167a4c","#22a05c","#3ccb73","#7cf0a0","#c8ffdc","#0f5f5c","#16877f","#2cb5a6","#7fe6d6","#2a1f52","#432b78","#6a3c9f","#9558c6","#c48ae4","#363a72","#4f5596","#1b4f63","#1a2236","#283350","#3b4a6e","#566a92","#7d91b8","#a9bad9","#d6e0f2","#9fc9cf","#0f1a1c","#173128","#24493a","#4a1517","#7c2420","#b23a2a","#d65aa8","#ffd27c","#ffb04a","#fff2c4","#eef3ff"],still:0},{id:"black-prism",name:"black prism",note:"the vercel triangle as a glass prism, splitting white light to a rainbow",cols:200,rows:100,cell:1,fps:15,ground:"#000000",palette:["#161616","#242424","#363636","#4a4a4a","#636363","#7e7e7e","#9c9c9c","#bcbcbc","#dcdcdc","#ffffff","#ff2a3c","#9a1c28","#ff7417","#a04a10","#ffdf2e","#a08c1c","#38f56a","#1f9a42","#24dcff","#16879e","#3a64ff","#233f9e","#9a4cff","#5f2f9e","#fff4c8","#d4f6ff","#ffd2d6"],still:0},{id:"cloud-sea",name:"cloud sea",note:"the sun sinks into a drifting sea of orange cloud at dusk",cols:200,rows:100,cell:1,fps:15,ground:"#0e0e0f",palette:["#0e0e0f","#161617","#1f1f20","#2a2a2b","#353536","#404041","#545456","#6c6c6e","#8a8a8c","#a39a94","#2c211c","#43302a","#5e3c2a","#7c4826","#9c521f","#c2601c","#dc6f1e","#f38020","#f6922e","#faae40","#fbbd5c","#fccb7c","#fdda9e","#feeac4","#fff6e6"],still:0},{id:"command-city",name:"command city",note:"a night city whose boulevards trace the command key in streetlight",cols:200,rows:100,cell:1,fps:15,ground:"#060607",palette:["#101012","#17171a","#1f1f23","#29292e","#34343a","#414148","#505058","#62626a","#76767e","#8c8c93","#a4a4aa","#bdbdc2","#d6d6da","#ececef","#ffffff","#3a2a1c","#5a3c20","#7e5224","#a86a2a","#cf8433","#ee9e45","#ffb860","#ffcf88","#ffe4b4","#fff3dc","#c9d3e6","#8d99b0","#ff7a3a","#c0522a"],still:0},{id:"deep-reef",name:"deep reef",note:"light shafts, swaying kelp and a turning school of fish over a reef",cols:200,rows:100,cell:1,fps:15,ground:"#03101a",palette:["#114a66","#165c78","#1d708a","#27869b","#3a9fae","#58b9c0","#80d2d2","#b0e8e2","#e2fbf5","#5e6b62","#87927f","#aab39a","#cfd2b4","#38461a","#5a6420","#857f2a","#b0a03c","#d6c25a","#efe08e","#8e3355","#c4506a","#e0786e","#f0a070","#6a3a78","#9a5aa8","#c88ad0","#6f8a98","#9fb8c6","#cfe3ea"],still:0},{id:"desert-night",name:"desert night",note:"the milky way over a lone acacia on moonless dunes, meteors falling",cols:200,rows:100,cell:1,fps:15,ground:"#04060c",palette:["#0a1024","#101830","#16213f","#1e2b50","#283864","#34477a","#45598f","#5a6fa6","#7488bd","#93a5d2","#b6c3e4","#d8e0f2","#f4f6fb","#fff3dc","#ffe2b4","#f5c98e","#e2a86e","#c4864f","#9c6440","#74492f","#2a2230","#3d2f3a","#56404a","#735358","#946a62","#b6836c","#4a3b48","#6b5562","#8a6f7a","#a88590","#c9a3a3","#e2bfb4","#2a2448","#3d3466","#57498a","#7a68a8","#ffd8a8","#cfe0ff","#a9c4ff","#ff9a52","#e07a3e","#0d0f1a","#151827"],still:0},{id:"earthrise",name:"earthrise",note:"the earth rising over a cratered lunar horizon in long low sunlight",cols:200,rows:100,cell:1,fps:15,ground:"#030408",palette:["#18181b","#232326","#303033","#414143","#555556","#6b6a69","#83817d","#9c9993","#b6b2aa","#cfcac1","#e6e1d8","#f7f4ee","#0c1120","#131a2e","#1b2540","#262f4a","#dfe9ff","#0a2259","#0f2f72","#15408c","#1d53a6","#2a69bf","#4386d3","#6eaeea","#a8d3f6","#e8f0fa","#c2d0e3","#8b9fbc","#2f4a26","#3b5a2c","#5b7238","#7a9150","#77783f","#8f8550","#a8955e","#6b5634","#b9774a","#8a4838"],still:0},{id:"edge-orbit",name:"edge orbit",note:"the night earth from orbit, cloudflare requests arcing city to city",cols:200,rows:100,cell:1,fps:15,ground:"#04060c",palette:["#080c18","#0d1529","#152142","#1e2f5c","#2b4479","#40609c","#7d9cd2","#b8cdee","#181d27","#252b37","#404041","#5c6578","#2e1608","#4f2410","#7a3812","#a94f16","#d0661a","#f38020","#faae40","#3d2a0e","#6b4a16","#a57524","#d49434","#ffd68a","#ffe8c0","#fff6e8","#ffffff"],still:0},{id:"gangaur-ghat",name:"gangaur ghat",note:"udaipur at night, a lit gateway on lake pichola and diyas on the water",cols:200,rows:100,cell:1,fps:15,ground:"#070a18",palette:["#0a1230","#0f1a40","#152352","#1c2e66","#253a7a","#30498e","#3e5aa2","#0c0f1e","#161a30","#232842","#4a5a86","#6474a0","#8291b8","#a3afcf","#c6cee3","#e6ebf5","#fff6dc","#ffe6a8","#ffd277","#ffb84a","#f29a34","#d8782a","#a85a26","#7a4224","#e8c48c","#c89a62","#9a7048","#6a4c38","#3e2c2a","#dfe6ff"],still:0},{id:"green-storm",name:"green storm",note:"a thunderstorm at sea, the lightning striking in the supabase bolt",cols:200,rows:100,cell:1,fps:15,ground:"#0e0e0e",palette:["#1c1c1c","#242424","#2e2e2e","#3a3a3a","#4a4a4a","#5e5e5e","#777777","#939393","#b4b4b4","#d6d6d6","#1d2a24","#243a30","#2d4d3e","#3a6450","#4d8066","#67a084","#0f3324","#14472f","#1a5e3e","#22784f","#2c9663","#36b578","#3ecf8e","#65dba5","#8fe6be","#bdf2d8","#e6fbf1","#ffffff"],still:0},{id:"jal-mahal",name:"jal mahal",note:"the jaipur water palace floating on a misty lake at sunrise",cols:200,rows:100,cell:1,fps:15,ground:"#16141f",palette:["#3e4a6b","#56628a","#7180a6","#8e9cc0","#aab6d4","#c6cfe3","#e2e7f1","#6b4a66","#8a5f7c","#a87891","#c895a6","#e2b4bd","#f2d0d0","#fff3d6","#ffe3a6","#f6c87a","#e8a865","#c98552","#5a3e3a","#7d5848","#a47a5e","#c99d78","#e4c29c","#2a2f45","#3a3550","#4d4660","#4a3226","#6e4a32","#fbfaf7"],still:0},{id:"jungle-falls",name:"jungle falls",note:"a tiered waterfall in a rainforest gorge, spray, a rainbow and macaws",cols:200,rows:100,cell:1,fps:15,ground:"#07130d",palette:["#0d2616","#173d1f","#225a26","#2f7a2c","#45983a","#6bb544","#9ccf55","#c9e27a","#2a3436","#465256","#6c7676","#9aa29c","#f7fcfc","#d6eef0","#a8dcdf","#6cc5c6","#35aeb0","#1d8b92","#11636c","#c9e6ef","#93c9e2","#fff1c2","#f2cf6b","#e5483b","#f08c34","#3d84d6","#8b6bd0","#a92d25","#5b8f7a","#8fb8a0","#5e4a36"],still:6},{id:"kite-festival",name:"kite festival",note:"sankranti kites crowding a golden sky over the pink roofs of jaipur",cols:200,rows:100,cell:1,fps:15,ground:"#1a0f17",palette:["#6a5af0","#8a78d0","#c08cc8","#f0a0c0","#ffab7a","#ffc25e","#ffdc8c","#fff6dc","#9c7ae0","#7a62c4","#b89ae8","#ff5f58","#ff8478","#ffaa9c","#ffd6c4","#ff2f7d","#ff8fc4","#ffd400","#22c55e","#a3e635","#e8102a","#1f6fff","#5ec8ff","#8b3dff","#ffffff","#ff7a00"],still:0},{id:"kyoto-dusk",name:"kyoto dusk",note:"a pagoda at dusk behind a cherry tree lit by a stone lantern",cols:200,rows:100,cell:1,fps:15,ground:"#0b0a16",palette:["#1c1d4a","#262759","#33316b","#433d7c","#574a8c","#6e5a9a","#8a5a92","#a8668f","#c4748f","#db8a95","#ec9f9c","#f6b8a8","#fbd0b8","#fff1d8","#fffaf0","#7e5f9e","#f9d3dc","#f2b2c4","#e28fab","#c66e92","#9c5279","#74405f","#ffd9a0","#ffbb6a","#f29a4a","#d0763a","#a35a35","#2a2240","#3a2c50","#4a3860","#5b4f86","#7a6aa0","#2c3a3a","#3d4c46","#56604f","#9a6aa0","#b47ea6","#4a3038","#6a4448","#2b3a6a","#3e4f86"],still:0},{id:"lake-pichola",name:"lake pichola",note:"sunset on lake pichola, udaipur's palaces glowing over the water",cols:200,rows:100,cell:1,fps:15,ground:"#120a1a",palette:["#1c1028","#2a1840","#3d2058","#55286a","#6e3178","#8a3c7c","#a8477a","#c85a6e","#e0704e","#f08a40","#f8a840","#ffc65a","#ffe08a","#fff2c8","#fffaf0","#2b1c40","#3c2852","#4f3666","#6a4a7e","#9a7aa0","#f6e6d0","#e8cdb0","#d4a888","#b88a78","#8e6a6a","#6a4a58","#c88a9a","#ffd070","#ff9a3c","#b8323a","#140c1c"],still:0},{id:"lantern-lake",name:"lantern lake",note:"sky lanterns rising over a still mountain lake, one let go from a boat",cols:200,rows:100,cell:1,fps:15,ground:"#04060d",palette:["#141b30","#1c2a52","#22346a","#2a4080","#324c96","#3c58a8","#33306e","#433c88","#54449a","#62407e","#7a4a88","#934e86","#a4546e","#bc5e66","#d06a62","#dc7650","#e88444","#f09238","#d4581a","#ea6c1e","#f78226","#ff9530","#ffa83c","#ffbb4e","#ffcc66","#ffdc86","#ffe8a8","#fff3cf","#fffbec","#b8341a","#d84420","#2f3748","#4f586c","#5e5a7e","#7a6a8c","#5a3220","#7c4628","#4a5578","#5d6a92","#7381ab","#c4cdec","#e4e9fb","#ffffff"],still:0},{id:"lava-wall",name:"lava wall",note:"a wall of lava lamps under the glowing orange cloud, watched by a camera",cols:200,rows:100,cell:1,fps:15,ground:"#08070a",palette:["#16121a","#221c22","#33282a","#4a3a32","#6e5442","#9a7658","#404041","#707074","#a9a9ae","#e8e4de","#5c1616","#9e211d","#dc362b","#ff6a52","#7c3510","#c4570f","#f38020","#faae40","#ffd27c","#fff1c8","#e6c02a","#0f3a3c","#18786f","#43d6c0","#2f1842","#6b2f92","#b45ddc","#e2508c","#1d3768","#3f80d2"],still:0,loop:30},{id:"marine-drive",name:"marine drive",note:"mumbai's queen's necklace at night, lamps curving round the bay",cols:200,rows:100,cell:1,fps:15,ground:"#07080f",palette:["#18213f","#202c55","#2a396d","#374a88","#4a60a2","#6880bc","#2c2140","#3f2d58","#56396b","#6e4a7a","#8a5f88","#5a2e3c","#7b404c","#9e5858","#55300f","#7d4515","#a95c1b","#d27a24","#ee9631","#ffb246","#ffcd6a","#ffe39c","#fff2cf","#ffffff","#dce6ff","#a9bde8","#6a181b","#b22a28","#ff4b3e","#132c38","#1c3f4f","#2a5868","#29283a","#3c3a4c","#565266","#79738a"],still:0},{id:"misty-forest",name:"misty forest",note:"pine ridges fading into morning fog, sunbeams slanting through",cols:200,rows:100,cell:1,fps:15,ground:"#090f0e",palette:["#fffbea","#fff0c8","#fbe2a6","#f2c97e","#e0a95e","#b9834a","#e4ebe6","#cbe0dc","#a8d2d0","#86c0c2","#68a7ac","#4f8c93","#3b7078","#557570","#456761","#365952","#2a4a44","#1f3c37","#172f2b","#11231f","#a4a35a","#8a8f4c","#6d7440","#4d5530","#7a5a3a","#5b4532","#a9c3cc","#8eadb8","#6f93a2","#53798a","#3d6172","#2b4a5a"],still:0},{id:"night-coast",name:"night coast",note:"a lighthouse turning its beam under moonlit clouds over a dark sea",cols:200,rows:100,cell:1,fps:15,ground:"#080b12",palette:["#15203d","#1b2a50","#223463","#2b4077","#364e8b","#445f9f","#5874b2","#7089c0","#8a9cc4","#a3b1cf","#bec9dc","#d8dfea","#eef1f6","#f7f8fc","#ffe9ae","#ffd27c","#f3a64a","#c46c2d","#121c1b","#182724","#203530","#2c473d","#3c5c4c","#232a36","#363e4c","#555d6c","#2a3550","#3a4868","#9c4136","#ff5d4d"],still:0},{id:"night-highway",name:"night highway",note:"a desert highway at dusk, rushing toward the mountains and last light",cols:200,rows:100,cell:1,fps:15,ground:"#07080f",palette:["#0d1226","#141b38","#1c264c","#263463","#34457a","#4a5d96","#6b7fb3","#9aa8d0","#cdd5ea","#f4f6fc","#2a1d45","#43285e","#643474","#8a4683","#b85a78","#e0766a","#f59a5c","#ffc477","#ffe6b0","#16161e","#24232d","#383744","#55535f","#7a1622","#d42a32","#ff6a5c","#d9b44a","#3fd6c8","#fff4d8","#3a2a2a"],still:0,loop:12},{id:"ocean-sunset",name:"ocean sunset",note:"the sun sets past a pine headland, lit cloud, glitter on rolling sea",cols:200,rows:100,cell:1,fps:15,ground:"#0b0817",palette:["#140f2c","#1e1640","#2b1c52","#3d2266","#552a74","#6e2c78","#90327c","#b23c7c","#d24f7a","#ea6a78","#c2306a","#ff5d8f","#ff8a9a","#7a2456","#f05d5e","#f2804f","#f99a43","#ffb44a","#ffcd62","#ffe39a","#fff5d8","#a8323c","#d2453c","#e8603e","#2f1a3e","#47234f","#63305c","#874266","#ac5b70","#ff9e86","#ffc4a2","#ffdcc0","#0e1230","#171a46","#232059","#33286a","#4a2f78","#1c2a5c","#2e4078","#7d3f8f","#a24f98","#c8649e","#de8bb5"],still:0},{id:"planet-scale",name:"planet scale",note:"a dark planet cut into the planetscale mark, backlit, a moon circling",cols:200,rows:100,cell:1,fps:15,ground:"#050505",palette:["#101010","#181818","#202020","#282828","#303030","#3a3a3a","#444444","#4e4e4e","#585858","#636363","#6e6e6e","#797979","#858585","#919191","#9d9d9d","#a9a9a9","#b5b5b5","#c1c1c1","#cccccc","#d7d7d7","#e1e1e1","#eaeaea","#f3f3f3","#ffffff"],still:0},{id:"prism-city",name:"prism city",note:"a black spire and an orange cloud over a blue hour city and its river",cols:200,rows:100,cell:1,fps:15,ground:"#06080f",palette:["#111a33","#16213f","#1c2a50","#233463","#2b4077","#364e8b","#445f9f","#5874b2","#7089c0","#8a9cc4","#a3b1cf","#c8d2e4","#eef1f6","#ffffff","#ffe9ae","#ffd27c","#4a2a2a","#6e3a24","#9a4a1c","#c85f17","#f38020","#f8a040","#fbc06e","#ffdca6","#3a3352","#544766","#0e1220","#1a2030","#283044","#9c2a26","#ff4b3e"],still:0},{id:"salt-flat",name:"salt flat",note:"the vercel triangle over a mirror of salt, the sun rising behind its tip",cols:200,rows:100,cell:1,fps:15,ground:"#000000",palette:["#0d0d0e","#161617","#1f1f21","#2a2a2c","#363638","#444446","#555557","#69696b","#808082","#9a9a9c","#b8b8ba","#d8d8da","#ffffff","#50e3c2","#0070f3","#7928ca","#ff0080","#ff4d4d","#f9cb28","#b0f2e3","#8cbcf9","#bb94e4","#ff8cc0","#ffa6a6","#fce59a","#24665a","#00326d","#36125b","#73003a","#732323","#705b12"],still:0},{id:"saturn-rise",name:"saturn rise",note:"saturn and its rings hanging over the cracked ice and geysers of a moon",cols:200,rows:100,cell:1,fps:15,ground:"#04050a",palette:["#0b0d14","#161922","#252935","#3a3f4c","#3b2a1a","#5c4027","#7f5a35","#a37645","#c4925a","#dcae74","#ecc893","#f6e0b8","#6b6a6c","#8a8070","#b3a892","#d8cfba","#7f8a96","#0e1a2e","#15284a","#1f3a66","#2c5085","#3f6aa3","#5e8bbf","#89afd6","#b6d0ea","#ddebf8","#2a7fb0","#56b3dc","#ffffff","#fff0c8"],still:0},{id:"snow-train",name:"snow train",note:"a lit train crossing a snowy stone viaduct at night as snow falls",cols:200,rows:100,cell:1,fps:15,ground:"#070b16",palette:["#0c1428","#121d38","#19284a","#22345e","#2d4374","#3b548a","#4d68a0","#6480b4","#7f99c6","#9db3d6","#bccde4","#d9e4f1","#f1f5fb","#ffe7b0","#ffc56e","#f29a3c","#b8642a","#6e3a22","#3e1420","#6a1e26","#9a2c2e","#ff4a3d","#0b1a1e","#11262a","#1a3436","#26474a","#1e2230","#2c3242","#3e4658","#586276","#7c8698"],still:0},{id:"storm-plains",name:"storm plains",note:"an anvil thunderhead at dusk flickering over a wheat field",cols:200,rows:100,cell:1,fps:15,ground:"#0b0912",palette:["#0f0c20","#141029","#1c1638","#261c4a","#32235a","#40306c","#53407e","#6a5590","#8670a6","#7a6288","#9a7890","#b98e94","#e6a890","#f2bca8","#f7d6a8","#fbe8c6","#f8b070","#e88a4c","#c8643a","#9a4630","#6a3226","#f0c868","#d8a447","#b7843a","#8c6230","#5e4226","#3a2a1c","#261c14","#181a2c","#2a3048","#3a4260","#4f5878","#6a7392","#8890ae","#a2aabd","#5d5878","#7c7598","#a6a2c8","#d6d2fa","#f4f2ff","#ffe08a","#ffb84a"],still:0},{id:"taj-dawn",name:"taj dawn",note:"the taj mahal at sunrise, mirrored in its pool through morning haze",cols:200,rows:100,cell:1,fps:15,ground:"#0d0a13",palette:["#2e2a55","#3d3870","#514a8a","#6a62a3","#8a83bd","#5a3a5e","#7a4d72","#9a6284","#b97a92","#d495a2","#b8705a","#d98d66","#efab78","#f8c98e","#ffe2ae","#fff3d8","#fffcf2","#8e7f9e","#ad9cb4","#cbb6c4","#e3cdd2","#f3e0dc","#2a4a3e","#36584a","#4a6c58","#66845f","#8a9a68","#8a4a3e","#b0624a","#3a2f4a","#4e3d5a","#f6d6c0","#e9bfae","#5e6a40","#7d8a52","#a3a064","#c2b274"],still:0},{id:"tokyo-rain",name:"tokyo rain",note:"a tokyo side street in the rain, neon signs shining on the wet road",cols:200,rows:100,cell:1,fps:15,ground:"#07060d",palette:["#100f22","#17162f","#201e3d","#2b284e","#383463","#4a447a","#4c4890","#6a64c4","#1d1520","#2c1f2e","#3e2b3e","#553a52","#6a3a74","#8e4c8a","#b4649c","#d885ae","#6e1248","#a3196c","#d8278c","#ff47a8","#ff85c6","#ffc4e3","#0c4656","#106f80","#16a0b2","#28d2e2","#7cecf4","#ccfbfd","#5e340a","#93540f","#cc7b16","#f7a32a","#ffc65e","#ffe2a0","#fff4d8","#55100e","#8a1a14","#c22a1a","#ee4626","#ff7a4c","#8ea2c4","#bccbe6","#e4ecfb","#ffffff","#2e62e0","#79a2ff","#20844c","#43d884","#e6c21e","#fff07a","#6a7896","#9ba7c2","#c9d0e2","#262a36","#3a3f4e","#565c6c"],still:0},{id:"varanasi-ghats",name:"varanasi ghats",note:"dusk aarti on the ganga, lamps on the steps and diyas on the water",cols:200,rows:100,cell:1,fps:15,ground:"#0b0812",palette:["#141230","#1d1a42","#272257","#332b6a","#45357a","#5a4388","#7259a8","#6d3a73","#8a4677","#a8527a","#c4607a","#d97a92","#b866a0","#9a68c8","#c868b0","#e8707a","#d9705f","#e88552","#f29f4a","#f8b85a","#fcd07a","#ffe3a6","#fff2d2","#1a1220","#24182a","#301f33","#3f2838","#523340","#3a2c4c","#4d3a64","#5e3524","#7d4527","#a0582a","#c06e2e","#d98a46","#ffffff","#fff6d8","#ffd860","#ff9f2a","#f06a1e","#c8401a","#8a2a16","#0f1a2c","#162540","#20325a","#d6d4ee"],still:0},{id:"volcano-night",name:"volcano night",note:"a volcano erupting at night, lava rivers, an ash plume full of lightning",cols:200,rows:100,cell:1,fps:15,ground:"#070405",palette:["#5a1a10","#7a2410","#982e0e","#b8380b","#d4480b","#ea5e10","#f77a18","#ff9628","#ffb244","#ffcc63","#ffe28c","#fff3c0","#fffcec","#4a3a37","#63504b","#7d6863","#98827b","#b39d94","#cdb9af","#8a4a3a","#a85a40","#c87048","#3c4258","#5d6280","#8a90b4","#b4b9dc","#dfe2f7","#b9a8ff","#f4f0ff","#1a1012","#2c1a18"],still:0}];var Et;function Xe(){return Et??=Ze({source:kt,scenes:Mt}),Et}var Re={min:.3,max:.92};function le(e){let t=e.trim();if(!t.startsWith("#"))return null;let n=t.slice(1).toLowerCase();if(n.length===3){let a=n.split(""),o=a[0],r=a[1],i=a[2];if(o===void 0||r===void 0||i===void 0)return null;let l=g=>Number.parseInt(g+g,16),c={r:l(o),g:l(r),b:l(i)};return Number.isNaN(c.r)||Number.isNaN(c.g)||Number.isNaN(c.b)?null:c}if(n.length===6){if(!/^[0-9a-f]{6}$/.test(n))return null;let a=Number.parseInt(n,16);return{r:a>>16&255,g:a>>8&255,b:a&255}}return null}var Je=e=>Math.max(0,Math.min(255,Math.round(e))).toString(16).padStart(2,"0");function Ae({r:e,g:t,b:n}){return`#${Je(e)}${Je(t)}${Je(n)}`}function We({r:e,g:t,b:n}){let a=o=>{let r=o/255;return r<=.03928?r/12.92:((r+.055)/1.055)**2.4};return .2126*a(e)+.7152*a(t)+.0722*a(n)}function Te({r:e,g:t,b:n}){let a=e/255,o=t/255,r=n/255,i=Math.max(a,o,r),l=Math.min(a,o,r),c=(i+l)/2;if(i===l)return{h:0,s:0,l:c};let g=i-l,u=c>.5?g/(2-i-l):g/(i+l),p;return i===a?p=((o-r)/g+(o<r?6:0))*60:i===o?p=((r-a)/g+2)*60:p=((a-o)/g+4)*60,{h:p,s:u,l:c}}function Le({h:e,s:t,l:n}){let a=(e%360+360)%360,o=Math.max(0,Math.min(1,t)),r=Math.max(0,Math.min(1,n));if(o===0){let g=r*255;return{r:g,g,b:g}}let i=r<.5?r*(1+o):r+o-r*o,l=2*r-i,c=g=>{let u=(g/360+1)%1;return u<1/6?l+(i-l)*6*u:u<1/2?i:u<2/3?l+(i-l)*(2/3-u)*6:l};return{r:c(a+120)*255,g:c(a)*255,b:c(a-120)*255}}var Ie=["ink","duotone"],Qe="ink";function et(e){return typeof e=="string"&&Ie.includes(e)}var tt="#f5f2ea",Rt="#26231f";function xn(e,t,n){let a=n<0?0:n>1?1:n;return{r:e.r+(t.r-e.r)*a,g:e.g+(t.g-e.g)*a,b:e.b+(t.b-e.b)*a}}function At(e){let t=le(e);if(t===null)return e;let{l:n}=Te(t),a=1-n,o=Re.min+a*(Re.max-Re.min);return Ae(Le({h:0,s:0,l:o}))}function _t(e){let t=le(e);if(t===null)return e;let{h:n,s:a,l:o}=Te(t);return Ae(Le({h:n,s:a,l:1-o}))}function Ct(e,t=tt,n=Rt){let a=le(e),o=le(t),r=le(n);return a===null||o===null||r===null?e:Ae(xn(o,r,We(a)))}function Nt(e,t){return e.map(n=>t==="ink"?_t(n):Ct(n))}function Ot(e,t){return{ground:t==="ink"?At(e.ground):tt,palette:Nt(e.palette,t)}}function fe(e,t,n){return t==="dark"?{ground:e.ground,palette:e.palette}:Ot(e,n)}var ze=["top-left","top","top-right","left","center","right","bottom-left","bottom","bottom-right"],Fe=["cover","contain"];function nt(e){return typeof e=="string"&&Fe.includes(e)}function at(e){return typeof e=="string"&&ze.includes(e)}function Tt(e){let[t,n]=e.split("-"),a=e==="top"||e==="center"||e==="bottom"?"center":n??t,o=e==="left"||e==="center"||e==="right"?"center":t,r=i=>i==="left"||i==="top"?-1:i==="right"||i==="bottom"?1:0;return{x:r(a),y:r(o)}}var Sn=e=>e!==void 0&&Number.isFinite(e)&&e>0?e:1,Pt=e=>e===0?0:e;function _e(e,t,n,a={}){let{cols:o,rows:r,cell:i}=e;if(!(t>0)||!(n>0)||o<=0||r<=0)return{width:0,height:0,left:0,top:0,cellSize:0};let l=Sn(a.zoom),c=t/o,g=n/(r*i),p=(a.fit==="contain"?Math.min(c,g):Math.max(c,g))*l,R=p*o,A=p*r*i,{x:G,y:E}=Tt(a.anchor??"center"),N=(t-R)*(1+G)/2,w=(n-A)*(1+E)/2;return{width:R,height:A,left:Pt(Math.round(N)),top:Pt(Math.round(w)),cellSize:p}}var V=["sidebar","main","rightbar","bottom"],we={lightMode:Qe,fit:"cover",anchor:"center",zoom:1},W={opacity:1,surface:1,blur:0,veil:.12,scrim:0,scrimAngle:180,still:!1,fps:15,resolution:1,pauseOnBlur:!0},Be={sidebar:1,main:1,rightbar:1,bottom:1},zt={scene:"salt-flat",options:we,appearance:W,regions:Be,piece:{}},ot={min:0,max:30},Lt={min:.5,max:2},kn=(e,t,n)=>e<t?t:e>n?n:e;function oe(e,t,n,a){return typeof e!="number"||!Number.isFinite(e)?t:kn(e,n,a)}function It(e,t){return typeof e=="boolean"?e:t}function Ft(e){let t=typeof e=="object"&&e!==null?e:{};return{lightMode:et(t.lightMode)?t.lightMode:we.lightMode,fit:nt(t.fit)?t.fit:we.fit,anchor:at(t.anchor)?t.anchor:Mn(t)??we.anchor,zoom:oe(t.zoom,we.zoom,.25,4)}}function Mn(e){if(typeof e.offsetX!="number"&&typeof e.offsetY!="number")return null;let t=o=>typeof o!="number"||!Number.isFinite(o)?0:o<-.34?-1:o>.34?1:0,n=t(e.offsetX),a=t(e.offsetY);return n===0&&a===0?"center":a===0?n===-1?"left":"right":n===0?a===-1?"top":"bottom":`${a===-1?"top":"bottom"}-${n===-1?"left":"right"}`}function Bt(e){let t=typeof e=="object"&&e!==null?e:{};return{opacity:oe(t.opacity,W.opacity,0,1),surface:oe(t.surface,W.surface,0,1),blur:oe(t.blur,W.blur,0,24),veil:oe(t.veil,W.veil,0,1),scrim:oe(t.scrim,W.scrim,0,1),scrimAngle:oe(t.scrimAngle,W.scrimAngle,0,360),still:It(t.still,W.still),fps:oe(t.fps,W.fps,ot.min,ot.max),resolution:oe(t.resolution,W.resolution,Lt.min,Lt.max),pauseOnBlur:It(t.pauseOnBlur,W.pauseOnBlur)}}function Dt(e){let t=typeof e=="object"&&e!==null?e:{},n={...Be};for(let a of V)n[a]=oe(t[a],Be[a],0,1);return n}function ve(e,t){let n=typeof e=="object"&&e!==null?e:{},a=n.scene;return{scene:typeof a=="string"&&(a===""||t.some(r=>r.id===a))?a:zt.scene,options:Ft(n.options),appearance:Bt(n.appearance),regions:Dt(n.regions),piece:En(n.piece)}}function En(e){if(typeof e!="object"||e===null)return{};let t={};for(let[n,a]of Object.entries(e)){if(typeof a!="object"||a===null)continue;let o={};for(let[r,i]of Object.entries(a))(typeof i=="number"&&Number.isFinite(i)||typeof i=="boolean")&&(o[r]=i);Object.keys(o).length>0&&(t[n]=o)}return t}function Ce(e,t){return e.scene===t.scene&&e.options.lightMode===t.options.lightMode&&e.options.fit===t.options.fit&&e.options.anchor===t.options.anchor&&e.options.zoom===t.options.zoom&&e.appearance.opacity===t.appearance.opacity&&e.appearance.surface===t.appearance.surface&&e.appearance.blur===t.appearance.blur&&e.appearance.veil===t.appearance.veil&&e.appearance.scrim===t.appearance.scrim&&e.appearance.scrimAngle===t.appearance.scrimAngle&&e.appearance.still===t.appearance.still&&e.appearance.fps===t.appearance.fps&&e.appearance.resolution===t.appearance.resolution&&e.appearance.pauseOnBlur===t.appearance.pauseOnBlur&&V.every(n=>e.regions[n]===t.regions[n])&&JSON.stringify(e.piece)===JSON.stringify(t.piece)}var rt;function Ht(e){rt=e}function Ne(){if(rt===void 0)throw new Error("ascii-rest: the module loader is not installed");return rt}function De(e,t,n={}){let a=typeof t=="function"?t:t.default,o=typeof t=="function"?{}:t.meta,{fps:r=o.fps??30,motion:i=!1,resolution:l=1,...c}={...o.options,...n},g=a(c),{cols:u=80,rows:p=24,palette:R,ground:A,cell:G=2}=o,E=e instanceof HTMLCanvasElement?e:null,N=R&&E?new Uint8Array(u*p):void 0,w=L=>L[0]==="#"?[1,3,5].map(b=>Number.parseInt(L.slice(b,b+2),16)):(L.match(/[\d.]+/g)??[]).map(Number),O=L=>{let b=w(L);return .2126*(b[0]??0)+.7152*(b[1]??0)+.0722*(b[2]??0)<128},P=()=>({paper:E&&A?!O(A):!1,color:N}),I=!i&&typeof matchMedia=="function"&&matchMedia("(prefers-reduced-motion: reduce)").matches?o.still??0:0,x=()=>{},d;if(E){let L=ae=>`${ae}px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`,b=E.getContext("2d"),M=document.createElement("canvas"),v=M.getContext("2d");if(b===null||v===null)return An();let C=new Map,D=0,z=0,q=0,K=0,H=0,F=0,Y=-1,X="",ee=new Int32Array(0),$=new Int32Array(0),T=new Int32Array(0),J=new Int32Array(0),de="",ne=!0,se=N?new Uint8Array(u*p):void 0;E.style.display||="block",E.style.aspectRatio=`${String(u)} / ${String(p*G)}`;let be=()=>{Y=E.clientWidth;let ae=(devicePixelRatio||1)*Math.min(2,Math.max(.5,l));D=Y*ae/u,z=D*G,q=Math.ceil(D),K=Math.ceil(z),H=q+2,F=K+2,E.width=Math.round(D*u),E.height=Math.round(z*p),M.width=H*32,M.height=F*32,ee=Int32Array.from({length:u+1},(te,j)=>Math.round(j*D)),$=Int32Array.from({length:p+1},(te,j)=>Math.round(j*z)),T=Int32Array.from({length:u},(te,j)=>Math.round(j*D+(D-q)/2)),J=Int32Array.from({length:p},(te,j)=>Math.round(j*z+(z-K)/2)),C.clear(),ne=!0},Me=(ae,te)=>{let j=ae*256+te,pe=C.get(j);if(pe!==void 0)return pe;C.size===1024&&(v.clearRect(0,0,M.width,M.height),C.clear());let ce=C.size,ye=ce%32*H+1,ue=Math.floor(ce/32)*F+1;return v.font=L(D/.6),v.textAlign="center",v.textBaseline="middle",v.fillStyle=R?.[te]??R?.[0]??X,v.save(),v.beginPath(),v.rect(ye-1,ue-1,H,F),v.clip(),v.fillText(String.fromCharCode(ae),ye+q/2,ue+K/2),v.restore(),C.set(j,ce),ce};x=()=>{!R&&getComputedStyle(E).color!==X&&(X=getComputedStyle(E).color,C.clear(),v.clearRect(0,0,M.width,M.height),ne=!0);let ae=g(I,P());A&&(b.fillStyle=A),ne&&(A?b.fillRect(0,0,E.width,E.height):b.clearRect(0,0,E.width,E.height));for(let te=0,j=0,pe=0;te<ae.length;te++){let ce=ae.charCodeAt(te);if(ce===10){j=0,pe++;continue}let ye=pe*u+j;if(ne||ce!==de.charCodeAt(te)||N!==void 0&&se!==void 0&&N[ye]!==se[ye]){let ue=ee[j]??0,Ee=$[pe]??0,Oe=(ee[j+1]??0)-ue,Pe=($[pe+1]??0)-Ee;if(ne||(A?b.fillRect(ue,Ee,Oe,Pe):b.clearRect(ue,Ee,Oe,Pe)),ce!==32){let yt=Me(ce,N?.[ye]??0);b.drawImage(M,yt%32*H+1+ue-(T[j]??0),Math.floor(yt/32)*F+1+Ee-(J[pe]??0),Oe,Pe,ue,Ee,Oe,Pe)}}j++}de=ae,N!==void 0&&se?.set(N),ne=!1},be(),d=new ResizeObserver(()=>{E.clientWidth!==Y&&(be(),x())}),d.observe(E)}if(x(),!r)return it(()=>{d?.disconnect()},()=>{},()=>{},()=>I);let f=matchMedia("(prefers-reduced-motion: reduce)"),S=0,_=0,s=!1,y=!1,h=L=>{S=requestAnimationFrame(h);let b=L-_;b<1e3/r-2||(_=L,I+=Math.min(b,100)/1e3,x())},m=()=>{let L=!y&&s&&!document.hidden&&(i||!f.matches);L&&!S?(_=performance.now(),S=requestAnimationFrame(h)):!L&&S&&(cancelAnimationFrame(S),S=0)},k=new IntersectionObserver(L=>{s=L[L.length-1]?.isIntersecting??!1,m()});return k.observe(e),document.addEventListener("visibilitychange",m),f.addEventListener("change",m),it(()=>{k.disconnect(),d?.disconnect(),cancelAnimationFrame(S),S=0,document.removeEventListener("visibilitychange",m),f.removeEventListener("change",m)},()=>{y=!0,m()},()=>{y=!1,m()},()=>I)}function An(){return it(()=>{},()=>{},()=>{},()=>0)}function it(e,t,n,a){let o=e;return o.pause=t,o.resume=n,o.now=a,o}function _n({palette:e,React:t}){let n=e.length<=6?e:Array.from({length:6},(a,o)=>e[Math.round(o*(e.length-1)/5)]??"#000000");return t.createElement("div",{className:"ascii-rest-swatch","aria-hidden":"true"},...n.map((a,o)=>t.createElement("span",{key:o,style:{backgroundColor:a}})))}var st="data-ds-dark-theme";function Gt(e){let[t,n]=e.useState(document.body.hasAttribute(st));return e.useEffect(()=>{let a=new MutationObserver(()=>n(document.body.hasAttribute(st)));return a.observe(document.body,{attributes:!0,attributeFilter:[st]}),()=>a.disconnect()},[]),t}function Cn(e){let{React:t,scene:n,copy:a,loadPreview:o,options:r}=e,i=t.useRef(null),[l,c]=t.useState(!1),g=Gt(t);return t.useEffect(()=>{let u=i.current;if(u===null)return;let p=!1,R=null;u.replaceChildren(),c(!1);let A=document.createElement("canvas");return A.style.width="100%",A.style.height="100%",u.append(A),o(n.id).then(G=>{if(p)return;let N=fe(n,g?"dark":"light",r.lightMode);R=De(A,{meta:{...G.meta,palette:N.palette,ground:N.ground},default:G.default},{fps:0,motion:!0})}).catch(()=>{p||c(!0)}),()=>{p=!0,R?.(),u.replaceChildren()}},[n.id,g,r.lightMode,o]),t.createElement("div",{className:"ascii-rest-preview"},t.createElement("div",{ref:i,style:{position:"absolute",inset:"0"}}),t.createElement("div",{className:"ascii-rest-preview__meta"},t.createElement("strong",null,n.name),t.createElement("span",null,`${String(n.cols)}\xD7${String(n.rows)}`)),l?t.createElement("p",{className:"ascii-rest-preview__error"},a.previewFailed):null)}function $t(e){let{React:t,catalog:n,settings:a,copy:o}=e,r=Gt(t),i=n.find(f=>f.id===a.scene)??n[0],l=t.createElement("div",{className:"ascii-rest-actions"},t.createElement("button",{type:"button",className:"ascii-rest-button ascii-rest-button--primary",onClick:e.onOpenPanel},o.openPanel),t.createElement("button",{type:"button",className:"ascii-rest-button",onClick:()=>e.onAppearance({still:!a.appearance.still})},a.appearance.still?o.play:o.pause),t.createElement("button",{type:"button",className:"ascii-rest-button",onClick:e.onReset},o.reset)),c=t.createElement("header",{className:"ascii-rest-page__head"},t.createElement("h3",{className:"ascii-rest-page__title"},o.title),t.createElement("p",{className:"ascii-rest-page__note"},o.note)),g=t.createElement("div",{className:"ascii-rest-grid",role:"group","aria-label":o.scenes},...n.map(f=>t.createElement("button",{key:f.id,type:"button",className:"ascii-rest-card","aria-pressed":f.id===a.scene,onClick:()=>e.onScene(f.id)},t.createElement(_n,{palette:f.palette,React:t}),t.createElement("span",{className:"ascii-rest-card__name"},f.name),t.createElement("span",{className:"ascii-rest-card__note"},f.note)))),u=(f,S,_)=>t.createElement("div",{className:"ascii-rest-field"},t.createElement("div",{className:"ascii-rest-field__text"},t.createElement("span",{className:"ascii-rest-field__label"},f),_===void 0?null:t.createElement("span",{className:"ascii-rest-field__hint"},_)),S),p=(f,S,_,s,y)=>t.createElement("div",{className:"ascii-rest-chips",role:"group","aria-label":f},...S.map(h=>t.createElement("button",{key:h,type:"button",className:"ascii-rest-chip","aria-pressed":h===s,onClick:()=>y(h)},_[h]??h))),R=(f,S,_,s)=>t.createElement("input",{type:"range",className:"ascii-rest-range","aria-label":f,min:_.min,max:_.max,step:_.step,value:S,onChange:y=>s(Number(y.target.value))}),A={"top-left":o.anchorTopLeft,top:o.anchorTop,"top-right":o.anchorTopRight,left:o.anchorLeft,center:o.anchorCenter,right:o.anchorRight,"bottom-left":o.anchorBottomLeft,bottom:o.anchorBottom,"bottom-right":o.anchorBottomRight},G={cover:o.fitCover,contain:o.fitContain},E={sidebar:o.regionSidebar,main:o.regionMain,rightbar:o.regionRightbar,bottom:o.regionBottom},N={width:172,height:96},w=i===void 0?null:_e({cols:i.cols,rows:i.rows,cell:i.cell},N.width,N.height,{fit:a.options.fit,anchor:a.options.anchor,zoom:a.options.zoom}),O=t.createElement("div",{className:"ascii-rest-anchor",style:{width:`${String(N.width)}px`,height:`${String(N.height)}px`}},w===null||i===void 0?null:t.createElement("div",{className:"ascii-rest-anchor__picture",style:{left:`${String(w.left)}px`,top:`${String(w.top)}px`,width:`${String(w.width)}px`,height:`${String(w.height)}px`,backgroundImage:`linear-gradient(105deg, ${fe(i,r?"dark":"light",a.options.lightMode).palette.slice(0,12).map((f,S,_)=>`${f} ${String(S/_.length*100)}%`).join(", ")})`}}),t.createElement("div",{className:"ascii-rest-anchor__cells",role:"group","aria-label":o.anchor},...ze.map(f=>t.createElement("button",{key:f,type:"button",className:"ascii-rest-anchor__cell","aria-pressed":f===a.options.anchor,"aria-label":A[f]??f,title:A[f]??f,onClick:()=>e.onPlacement({anchor:f})},t.createElement("span",{className:"ascii-rest-anchor__dot"}))))),P={ink:o.lightInk,duotone:o.lightDuotone},B=t.createElement("section",{className:"ascii-rest-section"},t.createElement("h4",{className:"ascii-rest-section__title"},o.lightMode),t.createElement("p",{className:"ascii-rest-section__note"},o.lightModeNote),u(o.lightMode,p(o.lightMode,Ie,P,a.options.lightMode,f=>e.onPlacement({lightMode:f})))),I=t.createElement("section",{className:"ascii-rest-section"},t.createElement("h4",{className:"ascii-rest-section__title"},o.placement),t.createElement("p",{className:"ascii-rest-section__note"},o.placementNote),t.createElement("div",{className:"ascii-rest-placement"},t.createElement("div",{className:"ascii-rest-placement__controls"},u(o.fit,p(o.fit,Fe,G,a.options.fit,f=>e.onPlacement({fit:f}))),u(o.zoom,R(o.zoom,a.options.zoom,{min:.5,max:3,step:.01},f=>e.onPlacement({zoom:f})),`${a.options.zoom.toFixed(2)}\xD7`)),t.createElement("div",{className:"ascii-rest-placement__stage"},O,t.createElement("p",{className:"ascii-rest-placement__caption"},A[a.options.anchor]??"")))),x=t.createElement("section",{className:"ascii-rest-section"},t.createElement("h4",{className:"ascii-rest-section__title"},o.regions),t.createElement("p",{className:"ascii-rest-section__note"},o.regionsNote),...V.map(f=>u(E[f]??f,R(E[f]??f,a.regions[f],{min:0,max:1,step:.01},S=>e.onRegions({[f]:S})),`${Math.round(a.regions[f]*100)}%`))),d=t.createElement("p",{className:"ascii-rest-credit"},`${o.credit} `,t.createElement("a",{href:"https://ascii.rest/",target:"_blank",rel:"noreferrer noopener"},"ascii.rest"));return t.createElement("div",{className:"ascii-rest-page"},c,i===void 0?null:t.createElement(Cn,{scene:i,options:a.options,loadPreview:e.loadPreview,copy:o,React:t}),l,B,I,x,g,d)}var lt={};wt(lt,{default:()=>Yt,meta:()=>qt});var qt={name:"salt flat",category:"scenes",note:"the vercel triangle over a mirror of salt, the sun rising behind its tip",cols:200,rows:100,cell:1,fps:15,ground:"#000000",palette:["#0d0d0e","#161617","#1f1f21","#2a2a2c","#363638","#444446","#555557","#69696b","#808082","#9a9a9c","#b8b8ba","#d8d8da","#ffffff","#50e3c2","#0070f3","#7928ca","#ff0080","#ff4d4d","#f9cb28","#b0f2e3","#8cbcf9","#bb94e4","#ff8cc0","#ffa6a6","#fce59a","#24665a","#00326d","#36125b","#73003a","#732323","#705b12"]},re=200,xe=100,me=100,$e=22,He=$e*Math.sqrt(3),Z=57,Nn=1.7,he=Z-Nn,Kt=he-He,On=Kt+3.2,Q=Math.sqrt(3)/2,Pn=24,ct=Math.PI*2,Tn=" \xB7\u2022\u25CF",Ln=[0,.3,.6,1],In=[0,8,2,10,12,4,14,6,3,11,1,9,15,7,13,5].map(e=>e/16-.47),jt=[[.31,.89,.76],[0,.44,.95],[.47,.16,.79],[1,0,.5],[1,.3,.3],[.98,.8,.16]];function Se(e,t){let n=Math.imul(e|0,374761393)+Math.imul(t|0,668265263);return n=Math.imul(n^n>>>13,1274126177),((n^n>>>16)>>>0)/4294967296}function Ut(e,t){let n=Math.floor(e),a=Math.floor(t),o=e-n,r=t-a,i=o*o*(3-2*o),l=r*r*(3-2*r),c=Se(n,a),g=Se(n+1,a),u=Se(n,a+1),p=Se(n+1,a+1);return c+(g-c)*i+(u-c)*l+(c-g-u+p)*i*l}var ge=e=>e<0?0:e>1?1:e,ie=(e,t,n)=>{let a=ge((n-e)/(t-e));return a*a*(3-2*a)},zn=e=>[1,3,5].map(t=>parseInt(e.slice(t,t+2),16)/255),Ge=[0,0,0];function Fn(e){let t=(e%1+1)%1*6,n=Math.floor(t),a=t-n,o=jt[n],r=jt[(n+1)%6];for(let i=0;i<3;i++)Ge[i]=o[i]+(r[i]-o[i])*a}function Bn(e,t){return-(e-(me-$e))*Q-(t-he)*.5}function Dn(e,t){return(e-(me+$e))*Q-(t-he)*.5}function Yt(){let e=qt.palette.map(zn),t=re*xe,n=new Array(t),a=new Uint8Array(32768).fill(255),o=(w,O,P)=>{let B=Math.min(31,w*31.99|0)<<10|Math.min(31,O*31.99|0)<<5|Math.min(31,P*31.99|0);if(a[B]!==255)return a[B];let I=0,x=1e9;for(let d=0;d<e.length;d++){let f=e[d][0]-w,S=e[d][1]-O,_=e[d][2]-P,s=.3*f*f+.5*S*S+.2*_*_;s<x&&(x=s,I=d)}return a[B]=I},r=250,i=64,l=2,c=new Float32Array(t),g=new Float32Array(t);for(let w=0;w<xe;w++)for(let O=0;O<re;O++){let P=w*re+O,B=w+.5;if(B<Z){B<Z-14&&Se(O,w*5+3)>.988&&(g[P]=.4+.6*Se(w,O));continue}let I=B-Z,x=r/I,d=(O+.5-me)*x/i,f=d+.16*(Ut(d*.5,x*.5)-.5),S=x+.16*(Ut(d*.5+7.3,x*.5+1.9)-.5),_=2/3*f/l,s=(-1/3*f+Math.sqrt(3)/3*S)/l,y=Math.round(_),h=Math.round(s),m=Math.round(-_-s),k=Math.abs(y-_),L=Math.abs(h-s),b=Math.abs(m+_+s);k>L&&k>b?y=-h-m:L>b&&(h=-y-m);let M=f-l*1.5*y,v=S-l*Math.sqrt(3)*(h+y/2),C=Math.abs(v),D=Math.abs(Q*M+.5*v),z=Math.abs(Q*M-.5*v),q=0,K=Math.sign(v),H=C;D>H&&(H=D,q=Q*Math.sign(Q*M+.5*v),K=.5*Math.sign(Q*M+.5*v)),z>H&&(H=z,q=Q*Math.sign(Q*M-.5*v),K=-.5*Math.sign(Q*M-.5*v));let F=l*Q-H,Y=-(x*x)/r,X=x/i,ee=(O+.5-me)/i*Y,$=q*X,T=q*ee+K*Y,J=F/Math.sqrt($*$+T*T+1e-9),de=l*2*Q/Math.abs(Y);c[P]=ie(.95,.25,J)*ie(5,15,de)}let u=1024,p=new Float32Array(u),R=new Float32Array(t),A=new Float32Array(t),G=new Float32Array(t),E=new Uint16Array(t),N=new Float32Array(t);for(let w=0;w<xe;w++)for(let O=0;O<re;O++){let P=w*re+O,B=O+.5,I=w+.5<Z?w+.5:2*Z-w-.5,x=B-me,d=I-On,f=Math.sqrt(x*x+d*d),S=Z-I;R[P]=.22*Math.exp(-S/3)+.025*Math.exp(-S/10)+.8*Math.exp(-(S*S)/.7)+.35*Math.exp(-(d*d)/.5)*Math.exp(-Math.abs(x)/32)+(f<4.5?1:0),A[P]=.9*Math.exp(-f/2.5)+.25*Math.exp(-f/8);let _=Math.atan2(x,-d);G[P]=ie(4,12,f)*Math.exp(-f/50)*ie(2.35,1.75,Math.abs(_)),E[P]=Math.min(u-1,Math.floor((_+Math.PI)/ct*u)),N[P]=(.3+.25*Math.exp(-(x*x)/2500))*ie(Z+2,Z+12,w+.5)}return(w,{color:O}={})=>{let P=ct/Pn,B=.92+.08*Math.sin(w*P*2),I=w*P,x=w%6/1.4,d=Math.min(1,x),f=x<1?.5+.5*x:x<1.5?1-(x-1)*2:0,S=he-He*d*d,_=x>.8&&x<1.5?Math.sin((x-.8)/.7*Math.PI):0;for(let b=0;b<u;b++){let M=b/u*ct-Math.PI,v=.5+.5*Math.cos(14*M+I+1.4*Math.sin(5*M-I*2)),C=.5+.5*Math.cos(23*M-I*3+.9*Math.sin(3*M+I));v*=v,v*=v,v*=v,C*=C,C*=C,C*=C,C*=C,p[b]=(v*.55+C*.18)*B}let s=0,y=0,h=0,m=0,k=(b,M,v,C)=>{let D=b-me,z=R[v]+A[v]*B+G[v]*p[E[v]];if(f>0){let T=$e*(1-(he-S)/He),J=M-S,de=Math.min((b-me+T)**2,(b-me-T)**2)+J*J;z+=Math.exp(-de/5)*f*.7}if(_>0){let T=M-Kt;z+=_*(Math.exp(-(T*T)/.35)*Math.exp(-Math.abs(D)/16)+Math.exp(-(D*D)/.35)*Math.exp(-Math.abs(T)/12))*.9}if(C){let T=g[Math.floor(M)*re+Math.floor(b)];T&&(z=Math.max(z,T*(.65+.35*Math.sin(w*P*(2+(T*10|0))+T*40))*ie(.25,.04,z)))}s=z,y=z,h=z,m=0;let q=Bn(b,M),K=Dn(b,M),H=M-he,F=Math.max(q,K),Y=Math.max(F,H);if(Y>4)return;let X=ge(.5-Y*1.4);m=ge(.5-Y*.5),s*=1-X,y*=1-X,h*=1-X;let ee=ge((he-M)/He);if(H<.4){let T=Math.exp(-((F+.55)*(F+.55))/.3)*(.8+.4*ee);if(f>0&&(T+=Math.exp(-((M-S)*(M-S))/3)*f*Math.exp(-((F+.5)*(F+.5))/.6)*1.2),T*=ie(.4,-.6,H),s+=T,y+=T,h+=T,F>-.5){let J=Math.exp(-((F-.7)*(F-.7))/.5)*(.45+.3*ee)*ie(.4,-1.2,H);Fn(F*.18+ee*.9-w/6+(q>K?0:.5)),s+=J*Ge[0],y+=J*Ge[1],h+=J*Ge[2]}}let $=Math.exp(-((H+.5)*(H+.5))/.2)*(F<0?1:0)*.32;s+=$,y+=$,h+=$};for(let b=0;b<xe;b++)for(let M=0;M<re;M++){let v=b*re+M,C=b+.5,D=M+.5,z=0;if(C<Z)k(D,C,v,!0),z=.05*ie(10,Z,C);else{let $=.06+(C-Z)*.011,T=w*P,J=D+$*(Math.sin(C*.8-T*6+Math.sin(D*.05)*2)*.7+Math.sin(D*.11+C*1.3-T*4)*.35),de=2*Z-C+$*.4*Math.sin(D*.07-T*3+C*.6);k(J,de,v,!1);let ne=.8-.5*ie(Z,xe,C);s*=ne,y*=ne,h*=ne;let se=c[v]*(1-.85*m);if(se>0){let be=N[v],Me=1-.55*se;s=s*Me+se*be,y=y*Me+se*be,h=h*Me+se*be}z=.02}let q=s,K=y,H=h,F=Math.max(q,K,H,1e-4),Y=F<.008?0:ge(z+(1-z)*Math.pow(F,.85)*.95),X=Math.max(0,Math.min(3,Math.round(Y*3+In[(b&3)*4+(M&3)])));if(n[v]=Tn[X],O){let $=(.3+.7*(X?Math.min(1,(Y+.06)/Ln[X]):0))/F;O[v]=o(ge(q*$),ge(K*$),ge(H*$))}}let L=[];for(let b=0;b<xe;b++)L.push(n.slice(b*re,(b+1)*re).join(""));return L.join(`
`)}}var Hn=()=>{let e=Vt(lt);if(e===null)throw new Error('ascii-rest: the built-in "salt-flat" piece did not have the expected shape');return e},Gn={"salt-flat":Hn};function $n(e){return`client.${e}.js`}function jn(e){if(!/^[a-z0-9][a-z0-9-]*$/.test(e))throw new Error(`ascii-rest: "${e}" is not a scene id`);return`./${$n(e)}`}var ft=new Map;async function je(e){let t=ft.get(e);if(t!==void 0)return t;let n=Gn[e];if(n!==void 0){let i=n();return ft.set(e,i),i}let a=Ne();if(a===void 0)throw new Error("ascii-rest: the module loader is not available");let o=await a.async(jn(e)),r=Vt(o);if(r===null)throw new Error(`ascii-rest: scene "${e}" did not load a piece module`);return ft.set(e,r),r}function Vt(e){let t=e;if(t===null||typeof t!="object")return null;let n=t.meta,a=t.default;return typeof n!="object"||n===null||typeof a!="function"?null:t}var dt="dsh-skin:ascii-rest:settings";function Un(e){if(e!==void 0)try{let t=e.getItem(dt);return t===null?void 0:JSON.parse(t)}catch{return}}function Zt(e,t){let n=t??(typeof localStorage>"u"?void 0:localStorage),a=ve(Un(n),e),o=new Set,r=l=>{if(n!==void 0)try{n.setItem(dt,JSON.stringify(l))}catch{}},i=l=>{if(!Ce(a,l)){a=l;for(let c of o)c(a)}};return{get:()=>a,set:l=>{let c=ve(l,e);Ce(a,c)||(r(c),i(c))},update:l=>{let c=ve(l(a),e);Ce(a,c)||(r(c),i(c))},subscribe:l=>(o.add(l),()=>{o.delete(l)}),reset:()=>{try{n?.removeItem(dt)}catch{}i(ve(void 0,e))}}}var Xt=`
/* The page itself must not paint over the layer, which sits at a negative
   z-index so it can be behind the shell's opaque frame. */
body[data-dsh-ascii-rest] {
  background-color: transparent;
}

body[data-dsh-ascii-rest] [data-ascii-rest-layer] {
  transform: translateZ(0);
}

/* The tuning panel floats over the application, in the picture's own corner. */
[data-ascii-rest-gui] {
  position: fixed;
  right: 16px;
  bottom: 16px;
  z-index: 2147483000;
}

/* lil-gui ships a flat dark panel. These rules bind it to the host's tokens, so
   the panel belongs to the application instead of sitting on top of it as a
   foreign window. Nothing about its layout is touched.
   The lil- prefix is lil-gui 0.21's; before it the prefix was empty, so these
   selectors only fit that version on purpose. */
[data-ascii-rest-gui] .lil-gui.lil-root {
  --background-color: color-mix(in srgb, var(--dsw-alias-bg-layer-2) 94%, transparent);
  --text-color: var(--dsw-alias-label-primary);
  --title-background-color: color-mix(in srgb, var(--dsw-alias-bg-base) 70%, transparent);
  --title-text-color: var(--dsw-alias-label-primary);
  --widget-color: color-mix(in srgb, var(--dsw-alias-label-primary) 12%, transparent);
  --hover-color: color-mix(in srgb, var(--dsw-alias-label-primary) 20%, transparent);
  --focus-color: color-mix(in srgb, var(--dsw-alias-brand-primary) 45%, transparent);
  --number-color: var(--dsw-alias-brand-primary);
  --string-color: var(--dsw-alias-state-success-primary);
  --font-family: var(--dsw-font-family, ui-sans-serif, system-ui, sans-serif);
  --font-size: 12px;
  --input-font-size: 12px;
  border: 1px solid var(--dsw-alias-border-l1);
  border-radius: var(--dsw-radius-md, 12px);
  overflow: hidden;
  backdrop-filter: blur(12px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.28);
  color: var(--dsw-alias-label-primary);
}

[data-ascii-rest-gui] .lil-gui .lil-title {
  background: color-mix(in srgb, var(--dsw-alias-bg-base) 70%, transparent);
  color: var(--dsw-alias-label-primary);
}

[data-ascii-rest-gui] .lil-gui button {
  color: var(--dsw-alias-label-primary);
}

/* lil-gui's title only collapses the panel, so the dismiss control sits beside
   it rather than replacing it: folding and closing are different intentions. */
[data-ascii-rest-gui] .ascii-rest-gui {
  position: relative;
}

[data-ascii-rest-gui] .ascii-rest-gui__close {
  position: absolute;
  top: 0;
  right: 0;
  width: 28px;
  height: var(--title-height, 26px);
  padding: 0;
  border: 0;
  background: transparent;
  color: var(--dsw-alias-label-secondary);
  font-size: 16px;
  line-height: 1;
  cursor: pointer;
  z-index: 1;
}

[data-ascii-rest-gui] .ascii-rest-gui__close:hover {
  color: var(--dsw-alias-label-primary);
  background: color-mix(in srgb, var(--dsw-alias-label-primary) 12%, transparent);
}

/* Keep the title text clear of the dismiss control. */
[data-ascii-rest-gui] .lil-gui.lil-root > .lil-title {
  padding-right: 30px;
}

/* The settings page reads like a contact sheet, not a form. */
.ascii-rest-page {
  display: flex;
  flex-direction: column;
  gap: 18px;
  padding: 4px 2px 32px;
  color: var(--dsw-alias-label-primary);
}

.ascii-rest-page__head {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.ascii-rest-page__title {
  margin: 0;
  font-size: 15px;
  font-weight: 600;
  letter-spacing: 0.01em;
}

.ascii-rest-page__note {
  margin: 0;
  font-size: 12px;
  line-height: 1.6;
  color: var(--dsw-alias-label-secondary);
}

/* The live preview keeps the scene's own aspect ratio; the canvas inside is
   sized by the cover maths, so it crops rather than stretches. */
.ascii-rest-preview {
  position: relative;
  aspect-ratio: 2 / 1;
  width: 100%;
  overflow: hidden;
  border: 1px solid var(--dsw-alias-border-l1);
  border-radius: var(--dsw-radius-lg, 16px);
  background: #0b0b0c;
}

.ascii-rest-preview canvas {
  position: absolute;
  display: block;
}

.ascii-rest-preview__meta {
  position: absolute;
  left: 12px;
  bottom: 10px;
  display: flex;
  align-items: baseline;
  gap: 8px;
  font-size: 11px;
  color: rgba(255, 255, 255, 0.82);
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.8);
  pointer-events: none;
}

.ascii-rest-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(196px, 1fr));
  gap: 8px;
}

.ascii-rest-card {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 10px 12px;
  text-align: left;
  cursor: pointer;
  background: color-mix(in srgb, var(--dsw-alias-bg-layer-1) 60%, transparent);
  border: 1px solid var(--dsw-alias-border-l1);
  border-radius: var(--dsw-radius-sm, 8px);
  color: inherit;
  font: inherit;
  transition:
    border-color 120ms var(--ds-ease-in-out, ease),
    background-color 120ms var(--ds-ease-in-out, ease);
}

.ascii-rest-card:hover {
  background: color-mix(in srgb, var(--dsw-alias-bg-layer-2) 78%, transparent);
}

.ascii-rest-card[aria-pressed="true"] {
  border-color: var(--dsw-alias-brand-primary);
  background: color-mix(in srgb, var(--dsw-alias-brand-primary) 14%, transparent);
}

.ascii-rest-card__name {
  font-size: 12px;
  font-weight: 600;
}

.ascii-rest-card__note {
  font-size: 11px;
  line-height: 1.5;
  color: var(--dsw-alias-label-secondary);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* A settings section: a titled block of control rows. */
.ascii-rest-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 14px 16px;
  border: 1px solid var(--dsw-alias-border-l1);
  border-radius: var(--dsw-radius-md, 12px);
  background: color-mix(in srgb, var(--dsw-alias-bg-layer-1) 55%, transparent);
}

.ascii-rest-section__title {
  margin: 0;
  font-size: 12px;
  font-weight: 600;
}

.ascii-rest-section__note {
  margin: 0 0 4px;
  font-size: 11px;
  line-height: 1.55;
  color: var(--dsw-alias-label-secondary);
}

/* One control on one line: the label and its hint on the left, the control on
   the right, so the eye can scan a column of values instead of a stack. */
.ascii-rest-field {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  min-height: 28px;
  font-size: 12px;
}

.ascii-rest-field__text {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.ascii-rest-field__label {
  color: var(--dsw-alias-label-primary);
}

.ascii-rest-field__hint {
  font-size: 11px;
  color: var(--dsw-alias-label-secondary);
  font-variant-numeric: tabular-nums;
}

.ascii-rest-range {
  flex: 0 0 132px;
  accent-color: var(--dsw-alias-brand-primary);
}

/* A named choice is a chip, not a dropdown: two or nine options are all visible
   at once, and a select would hide the vocabulary the page exists to explain. */
.ascii-rest-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  justify-content: flex-end;
  max-width: 60%;
}

.ascii-rest-chip {
  font: inherit;
  font-size: 11px;
  padding: 3px 8px;
  border-radius: 6px;
  border: 1px solid var(--dsw-alias-border-l1);
  background: transparent;
  color: var(--dsw-alias-label-secondary);
  cursor: pointer;
}

.ascii-rest-chip:hover {
  border-color: var(--dsw-alias-border-l2);
  color: var(--dsw-alias-label-primary);
}

.ascii-rest-chip[aria-pressed="true"] {
  border-color: var(--dsw-alias-brand-primary);
  background: color-mix(in srgb, var(--dsw-alias-brand-primary) 16%, transparent);
  color: var(--dsw-alias-label-primary);
}

/* Placement reads as one instrument: the controls on the left, the geometry they
   drive on the right. The stage is where the anchor is chosen, so it sits beside
   the switches rather than stranded at the end of a full-width row with half the
   width empty. */
.ascii-rest-placement {
  display: flex;
  gap: 20px;
  align-items: flex-start;
  justify-content: space-between;
  margin-top: 4px;
}

.ascii-rest-placement__controls {
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1 1 auto;
  min-width: 0;
}

.ascii-rest-placement__stage {
  display: flex;
  flex-direction: column;
  gap: 6px;
  align-items: center;
  flex: 0 0 auto;
}

.ascii-rest-placement__caption {
  margin: 0;
  font-size: 11px;
  color: var(--dsw-alias-label-secondary);
}

/* The anchor pad is the window, not nine tiles: the scene sits inside it at the
   size and offset the real background uses, so the crop is shown rather than
   described. The picture is a gradient of the scene's own palette, drawn behind
   the cells and clipped by the frame, which is precisely what cover does to the
   canvas. (No backticks in these comments: this file is a template literal.) */
.ascii-rest-anchor {
  position: relative;
  overflow: hidden;
  border: 1px solid var(--dsw-alias-border-l1);
  border-radius: 8px;
  background: var(--dsw-alias-bg-layer-2);
  flex: 0 0 auto;
}

.ascii-rest-anchor__picture {
  position: absolute;
  /* Behind the cells, never between them and the pointer. */
  pointer-events: none;
  opacity: 0.55;
  transition: left 160ms ease-out, top 160ms ease-out, width 160ms ease-out, height 160ms ease-out;
}

.ascii-rest-anchor__cells {
  position: absolute;
  inset: 0;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(3, 1fr);
}

.ascii-rest-anchor__cell {
  display: grid;
  place-items: center;
  padding: 0;
  border: 0;
  border-radius: 4px;
  background: transparent;
  cursor: pointer;
}

.ascii-rest-anchor__dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--dsw-alias-label-primary);
  opacity: 0.4;
  transition: opacity 120ms ease-out, transform 120ms ease-out, background-color 120ms ease-out;
}

.ascii-rest-anchor__cell:hover .ascii-rest-anchor__dot {
  opacity: 0.9;
  transform: scale(1.4);
}

/* The chosen position is the dot alone. A tinted cell would draw a second
   rectangle inside the frame, competing with the picture that is already
   drawn there for the same reason. */
.ascii-rest-anchor__cell[aria-pressed="true"] .ascii-rest-anchor__dot {
  width: 11px;
  height: 11px;
  opacity: 1;
  background: var(--dsw-alias-brand-primary);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--dsw-alias-brand-primary) 22%, transparent);
}

/* Keyboard focus is themed rather than left to the browser's blue ring, which
   belongs to no design system and is the one default that shows up on every
   control in this page. */
.ascii-rest-chip:focus-visible,
.ascii-rest-anchor__cell:focus-visible,
.ascii-rest-button:focus-visible,
.ascii-rest-card:focus-visible {
  outline: 2px solid var(--dsw-alias-brand-primary);
  outline-offset: 2px;
}

.ascii-rest-range:focus-visible {
  outline: 2px solid var(--dsw-alias-brand-primary);
  outline-offset: 4px;
  border-radius: 4px;
}

/* The palette strip: the one honest thumbnail that costs nothing to draw. */
.ascii-rest-swatch {
  display: flex;
  height: 10px;
  border-radius: 3px;
  overflow: hidden;
  border: 1px solid var(--dsw-alias-border-l1);
}

.ascii-rest-swatch span {
  flex: 1 1 auto;
}

.ascii-rest-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
}

.ascii-rest-button {
  font: inherit;
  font-size: 12px;
  padding: 6px 12px;
  border-radius: var(--dsw-radius-sm, 8px);
  border: 1px solid var(--dsw-alias-border-l1);
  background: color-mix(in srgb, var(--dsw-alias-bg-layer-2) 72%, transparent);
  color: var(--dsw-alias-label-primary);
  cursor: pointer;
}

.ascii-rest-button:hover {
  border-color: var(--dsw-alias-border-l2);
}

.ascii-rest-button--primary {
  border-color: color-mix(in srgb, var(--dsw-alias-brand-primary) 60%, transparent);
  background: color-mix(in srgb, var(--dsw-alias-brand-primary) 18%, transparent);
}

.ascii-rest-credit {
  font-size: 11px;
  color: var(--dsw-alias-label-secondary);
}

.ascii-rest-credit a {
  color: inherit;
}
`;function qn(e,t){return`${e}${Math.round(Math.max(0,Math.min(1,t))*255).toString(16).padStart(2,"0")}`}var Kn="data-ds-dark-theme",Yn="data-ascii-rest-layer";function Ue(e=document){return e.body.hasAttribute(Kn)?"dark":"light"}function Jt(e,t=document){let{scene:n}=e,a=e.geometry,o=Ue(t),r=null,i=!1,l=e.still?0:e.fps,c=t.createElement("div");c.setAttribute(Yn,""),c.setAttribute("aria-hidden","true"),c.style.position="fixed",c.style.inset="0",c.style.zIndex="-1",c.style.overflow="hidden",c.style.pointerEvents="none",c.style.contain="strict";let g=t.createElement("canvas");g.style.position="absolute",g.style.display="block",g.style.left="0",g.style.top="0";let u=t.createElement("div");u.setAttribute("aria-hidden","true"),u.style.position="absolute",u.style.inset="0",u.style.pointerEvents="none";let p=t.createElement("div");p.setAttribute("aria-hidden","true"),p.style.position="absolute",p.style.inset="0",p.style.pointerEvents="none",c.append(g,u,p);let R=()=>fe(n,o,e.lightMode),A=()=>R().ground,G=()=>{c.style.backgroundColor=A(),c.style.opacity=String(e.opacity),c.style.filter=e.blur>0?`blur(${String(e.blur)}px)`:"",u.style.backgroundColor=A(),u.style.opacity=String(e.veil);let d=e.scrim;p.style.opacity=String(d),p.style.background=d>0?`linear-gradient(${String(e.scrimAngle)}deg, ${A()} 0%, ${qn(A(),0)} 62%)`:""},E=()=>{r?.(),r=null,l=e.still?0:e.fps;let d=R(),f={meta:{...e.module.meta,palette:d.palette,ground:d.ground},default:e.module.default};try{r=De(g,f,{...e.pieceOptions,fps:l,resolution:e.resolution,motion:!0})}catch(S){w(),e.onError?.(S)}},N=d=>{if(i)return;d!==void 0&&(a=d);let f=_e(n,window.innerWidth,window.innerHeight,a);g.style.width=`${String(f.width)}px`,g.style.height=`${String(f.height)}px`,g.style.left=`${String(f.left)}px`,g.style.top=`${String(f.top)}px`},w=()=>{r?.(),r=null,c.remove()},O=()=>N(),P=()=>r?.pause(),B=()=>r?.resume(),I=!1,x=d=>{d!==I&&(I=d,d?(window.addEventListener("blur",P),window.addEventListener("focus",B)):(window.removeEventListener("blur",P),window.removeEventListener("focus",B)))};try{t.body.prepend(c),G(),E(),N()}catch(d){w(),e.onError?.(d)}return window.addEventListener("resize",O),x(e.pauseOnBlur),{element:c,relayout:N,rescheme:()=>{if(i)return;let d=Ue(t);d!==o&&(o=d,G(),E(),N())},restyle:d=>{if(i)return;e.opacity=d.opacity,e.blur=d.blur,e.veil=d.veil,e.scrim=d.scrim,e.scrimAngle=d.scrimAngle,e.pauseOnBlur=d.pauseOnBlur,x(d.pauseOnBlur),G();let f=d.still?0:d.fps,S=d.resolution!==e.resolution;(f!==l||S)&&(e.still=d.still,e.fps=d.fps,e.resolution=d.resolution,E())},dispose:()=>{i||(i=!0,window.removeEventListener("resize",O),x(!1),w())}}}function qe(e){return typeof e=="object"&&e!==null&&typeof e.style=="object"&&e.style!==null&&typeof e.getAttribute=="function"}var pt="data-ascii-rest-region",Wt=["--dsw-alias-bg-base","--dsw-specific-sidebar-fill"];function Qt(e){let t=e.querySelector("[data-rightbar-col]"),n=e.querySelector("[data-shell-bottom]");if(!qe(t)||!qe(n))return null;let a=t.parentElement;if(a===null)return null;let o=t.previousElementSibling,r=a.firstElementChild;return!qe(o)||!qe(r)||r===o||r===n||r===t?null:{sidebar:r,main:o,rightbar:t,bottom:n}}function en(e){for(let t of V)e[t].setAttribute(pt,t)}function ut(e){for(let t of V){let n=e[t];n.style.removeProperty("background-color");for(let a of Wt)n.style.removeProperty(a)}}function gt(e){ut(e);for(let t of V)e[t].removeAttribute(pt)}function tn(e,t){for(let n of V){let a=e[n],o=t[n];a.style.backgroundColor=o;for(let r of Wt)a.style.setProperty(r,o)}}function mt(e){return V.every(t=>{let n=e[t];return n.isConnected&&n.getAttribute(pt)===t})}var on=.58,rn=.66;function U(e,t){let n=t<0?0:t>1?1:t;return`${e}${Math.round(n*255).toString(16).padStart(2,"0")}`}function nn(e,t,n){return Math.min(1,(e==="dark"?on:rn)*n*t)}function sn(e){let t=e.scene.ground,n=fe(e.scene,"light",e.lightMode),a=n.ground,o=(c=0)=>Math.min(1,on*e.surfaceOpacity+c),r=(c=0)=>Math.min(1,rn*e.surfaceOpacity+c),i=an(e.scene.palette,"dark"),l=an(n.palette,"light");return{"--dsw-alias-bg-base":{light:U(a,r()),dark:U(t,o())},"--dsw-alias-bg-layer-1":{light:U(a,r(.1)),dark:U(t,o(.12))},"--dsw-alias-bg-layer-2":{light:U(a,r(.16)),dark:U(t,o(.2))},"--dsw-alias-bg-overlay":{light:U(a,.97),dark:U(t,.95)},"--dsw-specific-sidebar-fill":{light:U(a,r(.04)),dark:U(t,o(.06))},"--dsw-alias-brand-primary":{light:l,dark:i},"--dsw-alias-border-l1":{light:U("#000000",.12),dark:U("#ffffff",.14)},"--dsw-alias-border-l2":{light:U("#000000",.2),dark:U("#ffffff",.22)},"--dsw-alias-label-primary":{light:"#0f1115",dark:"#f9fafb"},"--dsw-alias-label-secondary":{light:"#4b5563",dark:"#cfd3d6"},"--dsw-alias-state-error-primary":{light:"#c62a2a",dark:"#ff6b6b"},"--dsw-alias-state-idle-primary":{light:"#81858c",dark:"#979da6"},"--dsw-alias-state-success-primary":{light:"#0f7b4f",dark:"#4ade80"},"--dsw-alias-state-warn-primary":{light:"#96660a",dark:"#fbbf24"}}}function cn(e,t){let n=e.scene.ground,a=fe(e.scene,"light",e.lightMode).ground,o={};for(let r of["sidebar","main","rightbar","bottom"]){let i=t[r];o[r]={light:U(a,nn("light",i,e.surfaceOpacity)),dark:U(n,nn("dark",i,e.surfaceOpacity))}}return o}function an(e,t){let n=t==="dark"?"#50a0e3":"#0070f3",a=n,o=0;for(let r of e){let i=le(r);if(i===null)continue;let l=Math.max(i.r,i.g,i.b)/255,c=Math.min(i.r,i.g,i.b)/255,g=l-c,u=(l+c)/2,p=1-Math.abs(u-.55)*2,R=g*Math.max(0,p);R>o&&(o=R,a=r)}return o===0?n:a}var ln={navLabel:"ASCII background",title:"ASCII background",note:"An ascii.rest scene behind the workspace. The dark theme uses the scene's own palette; the light theme offers ink (hues kept, lightness mirrored) or duotone (a two-colour print).",previewFailed:"This scene did not load.",play:"Play",pause:"Pause",reset:"Reset",openPanel:"Open the tuning panel",credit:"Scenes by",scenes:"Available scenes",closePanel:"Close the tuning panel",placement:"Placement",placementNote:"Choose what happens to the overflow, then which edge to keep. The picture always scales at the scene's own ratio, never stretched.",fit:"Fit",fitCover:"Fill and crop",fitContain:"Fit and letterbox",anchor:"Anchor",anchorTopLeft:"Top left",anchorTop:"Top",anchorTopRight:"Top right",anchorLeft:"Left",anchorCenter:"Center",anchorRight:"Right",anchorBottomLeft:"Bottom left",anchorBottom:"Bottom",anchorBottomRight:"Bottom right",zoom:"Zoom",lightMode:"Light palette",lightModeNote:"Only the light theme uses this. Ink keeps the scene's hues and mirrors its lightness; duotone maps each cell's luminance between paper and ink, so it reads as a print.",lightInk:"Ink",lightDuotone:"Duotone",regions:"Panel reveal",regionsNote:"How much of the picture each region lets through. 0 is the host's own opaque surface, 1 is the skin's default.",regionSidebar:"Sidebar",regionMain:"Main panel",regionRightbar:"Auxiliary bar",regionBottom:"Bottom bar",scrim:"Gradient scrim",scrimNote:"Fades one edge of the picture towards the ground so the composer and the sidebar have a quiet base to sit on.",scrimStrength:"Strength",scrimAngle:"Direction",pauseOnBlur:"Pause when unfocused",pauseOnBlurNote:"Stop drawing while the window is in the background, and resume on return."};var fn={navLabel:"ASCII \u80CC\u666F",title:"ASCII \u80CC\u666F",note:"\u7528 ascii.rest \u7684\u573A\u666F\u4F5C\u5DE5\u4F5C\u533A\u80CC\u666F\u3002\u6697\u8272\u7528\u573A\u666F\u672C\u6765\u7684\u914D\u8272\uFF1B\u4EAE\u8272\u53EF\u9009\u58A8\u8272\uFF08\u4FDD\u4F4F\u8272\u76F8\u3001\u53EA\u7FFB\u660E\u6697\uFF09\u6216\u53CC\u8272\u8C03\uFF08\u7EB8\u4E0E\u58A8\u7684\u4E24\u8272\u5370\u5237\uFF09\u3002",previewFailed:"\u8FD9\u4E2A\u573A\u666F\u6CA1\u80FD\u52A0\u8F7D\u3002",play:"\u64AD\u653E\u52A8\u753B",pause:"\u6682\u505C\u52A8\u753B",reset:"\u6062\u590D\u9ED8\u8BA4",openPanel:"\u6253\u5F00\u8C03\u53C2\u9762\u677F",credit:"\u573A\u666F\u6765\u81EA",scenes:"\u53EF\u9009\u573A\u666F",closePanel:"\u5173\u95ED\u8C03\u53C2\u9762\u677F",placement:"\u6446\u653E",placementNote:"\u5148\u9009\u9002\u5E94\u65B9\u5F0F\uFF0C\u518D\u9009\u4FDD\u7559\u54EA\u4E00\u8FB9\u3002\u753B\u9762\u6309\u573A\u666F\u81EA\u8EAB\u7684\u6BD4\u4F8B\u7F29\u653E\uFF0C\u4E0D\u4F1A\u88AB\u62C9\u4F38\u3002",fit:"\u9002\u5E94\u65B9\u5F0F",fitCover:"\u586B\u6EE1\u88C1\u5207",fitContain:"\u5B8C\u6574\u7559\u767D",anchor:"\u5BF9\u9F50\u4F4D\u7F6E",anchorTopLeft:"\u5DE6\u4E0A",anchorTop:"\u4E0A\u4E2D",anchorTopRight:"\u53F3\u4E0A",anchorLeft:"\u5DE6\u4E2D",anchorCenter:"\u5C45\u4E2D",anchorRight:"\u53F3\u4E2D",anchorBottomLeft:"\u5DE6\u4E0B",anchorBottom:"\u4E0B\u4E2D",anchorBottomRight:"\u53F3\u4E0B",zoom:"\u7F29\u653E",lightMode:"\u4EAE\u8272\u914D\u8272",lightModeNote:"\u53EA\u5728\u4EAE\u8272\u4E3B\u9898\u4E0B\u751F\u6548\u3002\u58A8\u8272\u4FDD\u4F4F\u573A\u666F\u7684\u8272\u76F8\uFF0C\u53EA\u628A\u660E\u6697\u7FFB\u8FC7\u6765\uFF1B\u53CC\u8272\u8C03\u6309\u6BCF\u683C\u81EA\u8EAB\u7684\u660E\u6697\u5728\u7EB8\u4E0E\u58A8\u4E4B\u95F4\u53D6\u503C\uFF0C\u66F4\u50CF\u4E00\u5F20\u5370\u5237\u54C1\u3002",lightInk:"\u58A8\u8272",lightDuotone:"\u53CC\u8272\u8C03",regions:"\u5206\u533A\u900F\u51FA",regionsNote:"\u6BCF\u4E2A\u533A\u57DF\u5355\u72EC\u63A7\u5236\u753B\u9762\u900F\u51FA\u591A\u5C11\uFF1A0 \u662F\u5BBF\u4E3B\u81EA\u5DF1\u7684\u4E0D\u900F\u660E\u8868\u9762\uFF0C1 \u662F\u76AE\u80A4\u9ED8\u8BA4\u3002",regionSidebar:"\u4FA7\u8FB9\u680F",regionMain:"\u4E3B\u9762\u677F",regionRightbar:"\u526F\u4FA7\u8FB9\u680F",regionBottom:"\u5E95\u680F",scrim:"\u6E10\u53D8\u906E\u7F69",scrimNote:"\u671D\u4E00\u4E2A\u65B9\u5411\u628A\u753B\u9762\u6E10\u9690\u5230\u5E95\u8272\uFF0C\u8BA9\u5E95\u90E8\u7684\u8F93\u5165\u6846\u548C\u4FA7\u8FB9\u7559\u51FA\u5B89\u9759\u7684\u5E95\u5B50\u3002",scrimStrength:"\u5F3A\u5EA6",scrimAngle:"\u65B9\u5411",pauseOnBlur:"\u5931\u7126\u6682\u505C",pauseOnBlurNote:"\u7A97\u53E3\u4E0D\u5728\u524D\u53F0\u65F6\u505C\u6B62\u7ED8\u5236\uFF0C\u56DE\u5230\u524D\u53F0\u63A5\u7740\u64AD\u3002"};var ke="@lionad/dsh-client-ui-skin-ascii-rest",Ke="data-dsh-ascii-rest",ht="ascii-rest",bt="dsh-skin-ascii-rest";var un=["slots","theme"],Xn="data-ascii-rest-gui",Jn="./client.gui.js",dn=`${ke}/skin.css`,Ye={zh:fn,en:ln};function Wn(e,t){if(e.querySelector(`style[data-plugin-css=${JSON.stringify(dn)}]`)!==null)return()=>{};let a=e.createElement("style");return a.dataset.plugin=ke,a.dataset.pluginCss=dn,a.textContent=t,e.head.append(a),()=>a.remove()}function pn(e){let t=e.querySelectorAll(`style[data-plugin=${JSON.stringify(ke)}]:not([data-plugin-css])`);for(let n of t)n.removeAttribute("data-plugin")}function gn(e){let t=document.body,n=t.ownerDocument,a=Xe(),o=Ne()("react"),r=Zt(a.scenes),i=r.get(),l=null,c=null,g=null,u=null,p=null,R=0,A=e.get("theme"),G=e.get("locale"),E=e.get("slots"),N=(s,y)=>{console.warn(s,y)},w=()=>(G?.getSnapshot().active??"zh").startsWith("en")?Ye.en:Ye.zh,O=()=>{let s=i.scene;return a.scenes.find(y=>y.id===s)},P=s=>{if(p===null||s===void 0)return;let y=i.regions;if(V.every(b=>y[b]===1)){ut(p);return}let h={scene:s,surfaceOpacity:i.appearance.surface,lightMode:i.options.lightMode},m=cn(h,y),k=Ue(n),L={};for(let b of V)L[b]=m[b]?.[k]??"";tn(p,L)},B=s=>{if(u?.(),u=null,A===void 0||s===void 0)return;let y={scene:s,surfaceOpacity:i.appearance.surface,lightMode:i.options.lightMode};u=A.overrideTokens(ke,sn(y)),P(s)},I=async s=>{let y=++R,h=a.scenes.find(k=>k.id===s.scene);if(l?.dispose(),l=null,B(h),h===void 0)return;let m;try{m=await je(h.id)}catch(k){N(`ascii-rest: scene "${h.id}" did not load`,k);return}y===R&&(l=Jt({scene:h,module:m,pieceOptions:s.piece[h.id]??{},opacity:s.appearance.opacity,blur:s.appearance.blur,veil:s.appearance.veil,still:s.appearance.still,fps:s.appearance.fps,resolution:s.appearance.resolution,scrim:s.appearance.scrim,scrimAngle:s.appearance.scrimAngle,pauseOnBlur:s.appearance.pauseOnBlur,lightMode:s.options.lightMode,geometry:{fit:s.options.fit,anchor:s.options.anchor,zoom:s.options.zoom},onError:k=>{N("ascii-rest: the scene stopped drawing",k)}}),c?.rebuild(h,m,s.piece[h.id]??{}))},x=()=>{c?.destroy(),c=null,g?.remove(),g=null},d=async()=>{if(c!==null)return;let s=a.scenes.find(m=>m.id===i.scene);if(s===void 0)return;let y;try{y=await je(s.id)}catch(m){N("ascii-rest: cannot open the panel without a scene",m);return}let h;try{h=await Ne().async(Jn)}catch(m){N("ascii-rest: the tuning panel did not load",m);return}g=n.createElement("div"),g.setAttribute(Xn,""),t.append(g),c=h.createGui(g,{catalog:a.scenes,scene:s,settings:i,module:y,callbacks:{onPiece:m=>{r.update(k=>({...k,piece:{...k.piece,[k.scene]:{...k.piece[k.scene]??{},...m}}}))},onAppearance:m=>{r.update(k=>({...k,appearance:{...k.appearance,...m}}))},onRegions:m=>{r.update(k=>({...k,regions:{...k.regions,...m}}))},onPlacement:m=>{r.update(k=>({...k,options:{...k.options,...m}}))},onScene:m=>{r.update(k=>({...k,scene:m}))},onSave:()=>r.set(i),onClose:()=>x()},closeLabel:w().closePanel})},f=()=>{let[s,y]=o.useState(i);return o.useEffect(()=>r.subscribe(y),[]),$t({catalog:a.scenes,settings:s,React:o,copy:w(),loadPreview:h=>je(h),onScene:h=>r.update(m=>({...m,scene:h})),onAppearance:h=>r.update(m=>({...m,appearance:{...m.appearance,...h}})),onPlacement:h=>r.update(m=>({...m,options:{...m.options,...h}})),onRegions:h=>r.update(m=>({...m,regions:{...m.regions,...h}})),onOpenPanel:()=>{d()},onReset:()=>r.reset()})},S=Wn(n,Xt);t.setAttribute(Ke,""),I(i),e.effect(()=>()=>{R+=1,x(),l?.dispose(),l=null,u?.(),u=null,S(),t.removeAttribute(Ke)},"ascii-rest: release the skin"),e.effect(()=>(pn(n),()=>{pn(n)}),"ascii-rest: release styles claimed by the loader"),e.effect(()=>r.subscribe(s=>{let y=i;i=s;let h=a.scenes.find(m=>m.id===s.scene);if(s.scene!==y.scene){I(s);return}B(h),l?.restyle({opacity:s.appearance.opacity,blur:s.appearance.blur,veil:s.appearance.veil,still:s.appearance.still,fps:s.appearance.fps,resolution:s.appearance.resolution,scrim:s.appearance.scrim,scrimAngle:s.appearance.scrimAngle,pauseOnBlur:s.appearance.pauseOnBlur}),l?.relayout({fit:s.options.fit,anchor:s.options.anchor,zoom:s.options.zoom})}),"ascii-rest: follow the settings");let _=()=>{(p===null||!mt(p))&&(p!==null&&gt(p),p=Qt(n),p!==null&&en(p)),P(O())};e.effect(()=>{let s=new MutationObserver(()=>{l?.rescheme(),P(O())});s.observe(n.body,{attributes:!0,attributeFilter:["data-ds-dark-theme"]});let y=!1,h=()=>{y||(y=!0,requestAnimationFrame(()=>{y=!1,!(p!==null&&mt(p))&&_()}))},m=new MutationObserver(h);m.observe(n.body,{childList:!0,subtree:!0});let k=()=>l?.relayout();return window.addEventListener("resize",k),_(),()=>{s.disconnect(),m.disconnect(),window.removeEventListener("resize",k),p!==null&&gt(p),p=null}},"ascii-rest: follow the scheme, the shell and the window"),G!==void 0&&e.effect(()=>G.register(bt,{zh:Ye.zh,en:Ye.en}),"ascii-rest: locale dictionaries"),E!==void 0&&E.inject("settings.section",()=>E.register({name:"settings.section",id:ht,order:116,label:()=>w().navLabel},f))}function Qn(e){Ht(e)}

module.exports.boot(require);
    return module.exports;
  }
});
