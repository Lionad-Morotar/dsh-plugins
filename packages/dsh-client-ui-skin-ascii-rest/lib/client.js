window.__ModuleLoader__.load({
  id: "@lionad/dsh-client-ui-skin-ascii-rest",
  factory: (require) => {
    var module = { exports: {} };
    var exports = module.exports;
"use strict";var Xe=Object.defineProperty;var xn=Object.getOwnPropertyDescriptor;var Sn=Object.getOwnPropertyNames;var Mn=Object.prototype.hasOwnProperty;var St=(e,t)=>{for(var n in t)Xe(e,n,{get:t[n],enumerable:!0})},kn=(e,t,n,a)=>{if(t&&typeof t=="object"||typeof t=="function")for(let o of Sn(t))!Mn.call(e,o)&&o!==n&&Xe(e,o,{get:()=>t[o],enumerable:!(a=xn(t,o))||a.enumerable});return e};var En=e=>kn(Xe({},"__esModule",{value:!0}),e);var pa={};St(pa,{apply:()=>vn,boot:()=>ua,inject:()=>wn});module.exports=En(pa);var Mt=e=>typeof e=="number"&&Number.isInteger(e)&&e>0,kt=e=>typeof e=="string"&&/^#[0-9a-f]{6}$/i.test(e),Rn=/^[a-z0-9][a-z0-9-]*$/;function Et(e){if(typeof e!="object"||e===null)return null;let t=e,{id:n,name:a,note:o,cols:r,rows:s,cell:c,fps:l,ground:p,palette:d,still:m,loop:y}=t;if(typeof n!="string"||!Rn.test(n)||typeof a!="string"||a===""||typeof o!="string"||!Mt(r)||!Mt(s)||c!==1&&c!==2||typeof l!="number"||!Number.isFinite(l)||l<0||!kt(p)||!Array.isArray(d)||d.length===0||!d.every(kt)||typeof m!="number"||!Number.isFinite(m)||m<0||y!==void 0&&(typeof y!="number"||!Number.isFinite(y)||y<=0))return null;let E={id:n,name:a,note:o,cols:r,rows:s,cell:c,fps:l,ground:p,palette:d,still:m};return y===void 0?E:{...E,loop:y}}function Je(e){let t=typeof e=="object"&&e!==null?e:{},n=typeof t.source=="object"&&t.source!==null?t.source:{},a=Array.isArray(t.scenes)?t.scenes:[],o=[],r=new Set;for(let s of a){let c=Et(s);c===null||r.has(c.id)||(r.add(c.id),o.push(c))}return{source:{repository:typeof n.repository=="string"?n.repository:"unknown",commit:typeof n.commit=="string"?n.commit:"unknown",packageVersion:typeof n.packageVersion=="string"?n.packageVersion:"unknown"},scenes:o}}var Rt={repository:"bas3line/ascii",commit:"c556be4284a97599f78197c09ba744ad11c0145e",packageVersion:"0.4.0"},At=[{id:"alpine-dawn",name:"alpine dawn",note:"snow peaks catching first light above a still, misty mountain lake",cols:200,rows:100,cell:1,fps:15,ground:"#090c18",palette:["#0e1430","#151d40","#1d2752","#263365","#314179","#3e508c","#4f62a0","#6577b3","#8090c4","#9eaad3","#bec6e2","#4b3e6c","#6a5482","#8c6a92","#b0829c","#cf96a4","#e8a9a8","#f5bcaa","#ffd0b0","#ffe2c2","#fff1e0","#fdfaf6","#ffc887","#f7a965","#f2a08f","#e58a87","#f8b59d","#d97b7e","#7a4c4a","#a5654f","#523a4a","#1b2034","#262c45","#363c59","#0a1418","#0f1f24","#162a2f","#203a3c","#a3a7c6","#c6c3d8","#e0d4dc","#5a4f7e","#7b6c9c","#9a8cb6","#b8a8c8","#d8bccb"],still:0},{id:"amer-fort",name:"amer fort",note:"amer fort floodlit gold on its hill, mirrored in maota lake at night",cols:200,rows:100,cell:1,fps:15,ground:"#060915",palette:["#0a1230","#101a40","#16234f","#1e2e62","#283c78","#364d8e","#4a5f9f","#6a7fb8","#c9d4ee","#eef1f8","#fff6dc","#3a220f","#5a3415","#7d4a1c","#a06426","#c27f32","#dc9c44","#ecb85c","#f6d07e","#ffe4a6","#fff1cc","#0b0f1c","#121829","#1a2236","#2a2228","#4a3a2c","#4c6e34","#6f9448","#8fbf5a","#b4dc7c","#a08a62"],still:0},{id:"aurora-fjord",name:"aurora fjord",note:"aurora curtains rippling over a still fjord, a cabin lit on the shore",cols:200,rows:100,cell:1,fps:15,ground:"#05080f",palette:["#0b1322","#101b30","#16243f","#1e3050","#2a3f63","#0e3a33","#11573f","#167a4c","#22a05c","#3ccb73","#7cf0a0","#c8ffdc","#0f5f5c","#16877f","#2cb5a6","#7fe6d6","#2a1f52","#432b78","#6a3c9f","#9558c6","#c48ae4","#363a72","#4f5596","#1b4f63","#1a2236","#283350","#3b4a6e","#566a92","#7d91b8","#a9bad9","#d6e0f2","#9fc9cf","#0f1a1c","#173128","#24493a","#4a1517","#7c2420","#b23a2a","#d65aa8","#ffd27c","#ffb04a","#fff2c4","#eef3ff"],still:0},{id:"black-prism",name:"black prism",note:"the vercel triangle as a glass prism, splitting white light to a rainbow",cols:200,rows:100,cell:1,fps:15,ground:"#000000",palette:["#161616","#242424","#363636","#4a4a4a","#636363","#7e7e7e","#9c9c9c","#bcbcbc","#dcdcdc","#ffffff","#ff2a3c","#9a1c28","#ff7417","#a04a10","#ffdf2e","#a08c1c","#38f56a","#1f9a42","#24dcff","#16879e","#3a64ff","#233f9e","#9a4cff","#5f2f9e","#fff4c8","#d4f6ff","#ffd2d6"],still:0},{id:"cloud-sea",name:"cloud sea",note:"the sun sinks into a drifting sea of orange cloud at dusk",cols:200,rows:100,cell:1,fps:15,ground:"#0e0e0f",palette:["#0e0e0f","#161617","#1f1f20","#2a2a2b","#353536","#404041","#545456","#6c6c6e","#8a8a8c","#a39a94","#2c211c","#43302a","#5e3c2a","#7c4826","#9c521f","#c2601c","#dc6f1e","#f38020","#f6922e","#faae40","#fbbd5c","#fccb7c","#fdda9e","#feeac4","#fff6e6"],still:0},{id:"command-city",name:"command city",note:"a night city whose boulevards trace the command key in streetlight",cols:200,rows:100,cell:1,fps:15,ground:"#060607",palette:["#101012","#17171a","#1f1f23","#29292e","#34343a","#414148","#505058","#62626a","#76767e","#8c8c93","#a4a4aa","#bdbdc2","#d6d6da","#ececef","#ffffff","#3a2a1c","#5a3c20","#7e5224","#a86a2a","#cf8433","#ee9e45","#ffb860","#ffcf88","#ffe4b4","#fff3dc","#c9d3e6","#8d99b0","#ff7a3a","#c0522a"],still:0},{id:"deep-reef",name:"deep reef",note:"light shafts, swaying kelp and a turning school of fish over a reef",cols:200,rows:100,cell:1,fps:15,ground:"#03101a",palette:["#114a66","#165c78","#1d708a","#27869b","#3a9fae","#58b9c0","#80d2d2","#b0e8e2","#e2fbf5","#5e6b62","#87927f","#aab39a","#cfd2b4","#38461a","#5a6420","#857f2a","#b0a03c","#d6c25a","#efe08e","#8e3355","#c4506a","#e0786e","#f0a070","#6a3a78","#9a5aa8","#c88ad0","#6f8a98","#9fb8c6","#cfe3ea"],still:0},{id:"desert-night",name:"desert night",note:"the milky way over a lone acacia on moonless dunes, meteors falling",cols:200,rows:100,cell:1,fps:15,ground:"#04060c",palette:["#0a1024","#101830","#16213f","#1e2b50","#283864","#34477a","#45598f","#5a6fa6","#7488bd","#93a5d2","#b6c3e4","#d8e0f2","#f4f6fb","#fff3dc","#ffe2b4","#f5c98e","#e2a86e","#c4864f","#9c6440","#74492f","#2a2230","#3d2f3a","#56404a","#735358","#946a62","#b6836c","#4a3b48","#6b5562","#8a6f7a","#a88590","#c9a3a3","#e2bfb4","#2a2448","#3d3466","#57498a","#7a68a8","#ffd8a8","#cfe0ff","#a9c4ff","#ff9a52","#e07a3e","#0d0f1a","#151827"],still:0},{id:"earthrise",name:"earthrise",note:"the earth rising over a cratered lunar horizon in long low sunlight",cols:200,rows:100,cell:1,fps:15,ground:"#030408",palette:["#18181b","#232326","#303033","#414143","#555556","#6b6a69","#83817d","#9c9993","#b6b2aa","#cfcac1","#e6e1d8","#f7f4ee","#0c1120","#131a2e","#1b2540","#262f4a","#dfe9ff","#0a2259","#0f2f72","#15408c","#1d53a6","#2a69bf","#4386d3","#6eaeea","#a8d3f6","#e8f0fa","#c2d0e3","#8b9fbc","#2f4a26","#3b5a2c","#5b7238","#7a9150","#77783f","#8f8550","#a8955e","#6b5634","#b9774a","#8a4838"],still:0},{id:"edge-orbit",name:"edge orbit",note:"the night earth from orbit, cloudflare requests arcing city to city",cols:200,rows:100,cell:1,fps:15,ground:"#04060c",palette:["#080c18","#0d1529","#152142","#1e2f5c","#2b4479","#40609c","#7d9cd2","#b8cdee","#181d27","#252b37","#404041","#5c6578","#2e1608","#4f2410","#7a3812","#a94f16","#d0661a","#f38020","#faae40","#3d2a0e","#6b4a16","#a57524","#d49434","#ffd68a","#ffe8c0","#fff6e8","#ffffff"],still:0},{id:"gangaur-ghat",name:"gangaur ghat",note:"udaipur at night, a lit gateway on lake pichola and diyas on the water",cols:200,rows:100,cell:1,fps:15,ground:"#070a18",palette:["#0a1230","#0f1a40","#152352","#1c2e66","#253a7a","#30498e","#3e5aa2","#0c0f1e","#161a30","#232842","#4a5a86","#6474a0","#8291b8","#a3afcf","#c6cee3","#e6ebf5","#fff6dc","#ffe6a8","#ffd277","#ffb84a","#f29a34","#d8782a","#a85a26","#7a4224","#e8c48c","#c89a62","#9a7048","#6a4c38","#3e2c2a","#dfe6ff"],still:0},{id:"green-storm",name:"green storm",note:"a thunderstorm at sea, the lightning striking in the supabase bolt",cols:200,rows:100,cell:1,fps:15,ground:"#0e0e0e",palette:["#1c1c1c","#242424","#2e2e2e","#3a3a3a","#4a4a4a","#5e5e5e","#777777","#939393","#b4b4b4","#d6d6d6","#1d2a24","#243a30","#2d4d3e","#3a6450","#4d8066","#67a084","#0f3324","#14472f","#1a5e3e","#22784f","#2c9663","#36b578","#3ecf8e","#65dba5","#8fe6be","#bdf2d8","#e6fbf1","#ffffff"],still:0},{id:"jal-mahal",name:"jal mahal",note:"the jaipur water palace floating on a misty lake at sunrise",cols:200,rows:100,cell:1,fps:15,ground:"#16141f",palette:["#3e4a6b","#56628a","#7180a6","#8e9cc0","#aab6d4","#c6cfe3","#e2e7f1","#6b4a66","#8a5f7c","#a87891","#c895a6","#e2b4bd","#f2d0d0","#fff3d6","#ffe3a6","#f6c87a","#e8a865","#c98552","#5a3e3a","#7d5848","#a47a5e","#c99d78","#e4c29c","#2a2f45","#3a3550","#4d4660","#4a3226","#6e4a32","#fbfaf7"],still:0},{id:"jungle-falls",name:"jungle falls",note:"a tiered waterfall in a rainforest gorge, spray, a rainbow and macaws",cols:200,rows:100,cell:1,fps:15,ground:"#07130d",palette:["#0d2616","#173d1f","#225a26","#2f7a2c","#45983a","#6bb544","#9ccf55","#c9e27a","#2a3436","#465256","#6c7676","#9aa29c","#f7fcfc","#d6eef0","#a8dcdf","#6cc5c6","#35aeb0","#1d8b92","#11636c","#c9e6ef","#93c9e2","#fff1c2","#f2cf6b","#e5483b","#f08c34","#3d84d6","#8b6bd0","#a92d25","#5b8f7a","#8fb8a0","#5e4a36"],still:6},{id:"kite-festival",name:"kite festival",note:"sankranti kites crowding a golden sky over the pink roofs of jaipur",cols:200,rows:100,cell:1,fps:15,ground:"#1a0f17",palette:["#6a5af0","#8a78d0","#c08cc8","#f0a0c0","#ffab7a","#ffc25e","#ffdc8c","#fff6dc","#9c7ae0","#7a62c4","#b89ae8","#ff5f58","#ff8478","#ffaa9c","#ffd6c4","#ff2f7d","#ff8fc4","#ffd400","#22c55e","#a3e635","#e8102a","#1f6fff","#5ec8ff","#8b3dff","#ffffff","#ff7a00"],still:0},{id:"kyoto-dusk",name:"kyoto dusk",note:"a pagoda at dusk behind a cherry tree lit by a stone lantern",cols:200,rows:100,cell:1,fps:15,ground:"#0b0a16",palette:["#1c1d4a","#262759","#33316b","#433d7c","#574a8c","#6e5a9a","#8a5a92","#a8668f","#c4748f","#db8a95","#ec9f9c","#f6b8a8","#fbd0b8","#fff1d8","#fffaf0","#7e5f9e","#f9d3dc","#f2b2c4","#e28fab","#c66e92","#9c5279","#74405f","#ffd9a0","#ffbb6a","#f29a4a","#d0763a","#a35a35","#2a2240","#3a2c50","#4a3860","#5b4f86","#7a6aa0","#2c3a3a","#3d4c46","#56604f","#9a6aa0","#b47ea6","#4a3038","#6a4448","#2b3a6a","#3e4f86"],still:0},{id:"lake-pichola",name:"lake pichola",note:"sunset on lake pichola, udaipur's palaces glowing over the water",cols:200,rows:100,cell:1,fps:15,ground:"#120a1a",palette:["#1c1028","#2a1840","#3d2058","#55286a","#6e3178","#8a3c7c","#a8477a","#c85a6e","#e0704e","#f08a40","#f8a840","#ffc65a","#ffe08a","#fff2c8","#fffaf0","#2b1c40","#3c2852","#4f3666","#6a4a7e","#9a7aa0","#f6e6d0","#e8cdb0","#d4a888","#b88a78","#8e6a6a","#6a4a58","#c88a9a","#ffd070","#ff9a3c","#b8323a","#140c1c"],still:0},{id:"lantern-lake",name:"lantern lake",note:"sky lanterns rising over a still mountain lake, one let go from a boat",cols:200,rows:100,cell:1,fps:15,ground:"#04060d",palette:["#141b30","#1c2a52","#22346a","#2a4080","#324c96","#3c58a8","#33306e","#433c88","#54449a","#62407e","#7a4a88","#934e86","#a4546e","#bc5e66","#d06a62","#dc7650","#e88444","#f09238","#d4581a","#ea6c1e","#f78226","#ff9530","#ffa83c","#ffbb4e","#ffcc66","#ffdc86","#ffe8a8","#fff3cf","#fffbec","#b8341a","#d84420","#2f3748","#4f586c","#5e5a7e","#7a6a8c","#5a3220","#7c4628","#4a5578","#5d6a92","#7381ab","#c4cdec","#e4e9fb","#ffffff"],still:0},{id:"lava-wall",name:"lava wall",note:"a wall of lava lamps under the glowing orange cloud, watched by a camera",cols:200,rows:100,cell:1,fps:15,ground:"#08070a",palette:["#16121a","#221c22","#33282a","#4a3a32","#6e5442","#9a7658","#404041","#707074","#a9a9ae","#e8e4de","#5c1616","#9e211d","#dc362b","#ff6a52","#7c3510","#c4570f","#f38020","#faae40","#ffd27c","#fff1c8","#e6c02a","#0f3a3c","#18786f","#43d6c0","#2f1842","#6b2f92","#b45ddc","#e2508c","#1d3768","#3f80d2"],still:0,loop:30},{id:"marine-drive",name:"marine drive",note:"mumbai's queen's necklace at night, lamps curving round the bay",cols:200,rows:100,cell:1,fps:15,ground:"#07080f",palette:["#18213f","#202c55","#2a396d","#374a88","#4a60a2","#6880bc","#2c2140","#3f2d58","#56396b","#6e4a7a","#8a5f88","#5a2e3c","#7b404c","#9e5858","#55300f","#7d4515","#a95c1b","#d27a24","#ee9631","#ffb246","#ffcd6a","#ffe39c","#fff2cf","#ffffff","#dce6ff","#a9bde8","#6a181b","#b22a28","#ff4b3e","#132c38","#1c3f4f","#2a5868","#29283a","#3c3a4c","#565266","#79738a"],still:0},{id:"misty-forest",name:"misty forest",note:"pine ridges fading into morning fog, sunbeams slanting through",cols:200,rows:100,cell:1,fps:15,ground:"#090f0e",palette:["#fffbea","#fff0c8","#fbe2a6","#f2c97e","#e0a95e","#b9834a","#e4ebe6","#cbe0dc","#a8d2d0","#86c0c2","#68a7ac","#4f8c93","#3b7078","#557570","#456761","#365952","#2a4a44","#1f3c37","#172f2b","#11231f","#a4a35a","#8a8f4c","#6d7440","#4d5530","#7a5a3a","#5b4532","#a9c3cc","#8eadb8","#6f93a2","#53798a","#3d6172","#2b4a5a"],still:0},{id:"night-coast",name:"night coast",note:"a lighthouse turning its beam under moonlit clouds over a dark sea",cols:200,rows:100,cell:1,fps:15,ground:"#080b12",palette:["#15203d","#1b2a50","#223463","#2b4077","#364e8b","#445f9f","#5874b2","#7089c0","#8a9cc4","#a3b1cf","#bec9dc","#d8dfea","#eef1f6","#f7f8fc","#ffe9ae","#ffd27c","#f3a64a","#c46c2d","#121c1b","#182724","#203530","#2c473d","#3c5c4c","#232a36","#363e4c","#555d6c","#2a3550","#3a4868","#9c4136","#ff5d4d"],still:0},{id:"night-highway",name:"night highway",note:"a desert highway at dusk, rushing toward the mountains and last light",cols:200,rows:100,cell:1,fps:15,ground:"#07080f",palette:["#0d1226","#141b38","#1c264c","#263463","#34457a","#4a5d96","#6b7fb3","#9aa8d0","#cdd5ea","#f4f6fc","#2a1d45","#43285e","#643474","#8a4683","#b85a78","#e0766a","#f59a5c","#ffc477","#ffe6b0","#16161e","#24232d","#383744","#55535f","#7a1622","#d42a32","#ff6a5c","#d9b44a","#3fd6c8","#fff4d8","#3a2a2a"],still:0,loop:12},{id:"ocean-sunset",name:"ocean sunset",note:"the sun sets past a pine headland, lit cloud, glitter on rolling sea",cols:200,rows:100,cell:1,fps:15,ground:"#0b0817",palette:["#140f2c","#1e1640","#2b1c52","#3d2266","#552a74","#6e2c78","#90327c","#b23c7c","#d24f7a","#ea6a78","#c2306a","#ff5d8f","#ff8a9a","#7a2456","#f05d5e","#f2804f","#f99a43","#ffb44a","#ffcd62","#ffe39a","#fff5d8","#a8323c","#d2453c","#e8603e","#2f1a3e","#47234f","#63305c","#874266","#ac5b70","#ff9e86","#ffc4a2","#ffdcc0","#0e1230","#171a46","#232059","#33286a","#4a2f78","#1c2a5c","#2e4078","#7d3f8f","#a24f98","#c8649e","#de8bb5"],still:0},{id:"planet-scale",name:"planet scale",note:"a dark planet cut into the planetscale mark, backlit, a moon circling",cols:200,rows:100,cell:1,fps:15,ground:"#050505",palette:["#101010","#181818","#202020","#282828","#303030","#3a3a3a","#444444","#4e4e4e","#585858","#636363","#6e6e6e","#797979","#858585","#919191","#9d9d9d","#a9a9a9","#b5b5b5","#c1c1c1","#cccccc","#d7d7d7","#e1e1e1","#eaeaea","#f3f3f3","#ffffff"],still:0},{id:"prism-city",name:"prism city",note:"a black spire and an orange cloud over a blue hour city and its river",cols:200,rows:100,cell:1,fps:15,ground:"#06080f",palette:["#111a33","#16213f","#1c2a50","#233463","#2b4077","#364e8b","#445f9f","#5874b2","#7089c0","#8a9cc4","#a3b1cf","#c8d2e4","#eef1f6","#ffffff","#ffe9ae","#ffd27c","#4a2a2a","#6e3a24","#9a4a1c","#c85f17","#f38020","#f8a040","#fbc06e","#ffdca6","#3a3352","#544766","#0e1220","#1a2030","#283044","#9c2a26","#ff4b3e"],still:0},{id:"salt-flat",name:"salt flat",note:"the vercel triangle over a mirror of salt, the sun rising behind its tip",cols:200,rows:100,cell:1,fps:15,ground:"#000000",palette:["#0d0d0e","#161617","#1f1f21","#2a2a2c","#363638","#444446","#555557","#69696b","#808082","#9a9a9c","#b8b8ba","#d8d8da","#ffffff","#50e3c2","#0070f3","#7928ca","#ff0080","#ff4d4d","#f9cb28","#b0f2e3","#8cbcf9","#bb94e4","#ff8cc0","#ffa6a6","#fce59a","#24665a","#00326d","#36125b","#73003a","#732323","#705b12"],still:0},{id:"saturn-rise",name:"saturn rise",note:"saturn and its rings hanging over the cracked ice and geysers of a moon",cols:200,rows:100,cell:1,fps:15,ground:"#04050a",palette:["#0b0d14","#161922","#252935","#3a3f4c","#3b2a1a","#5c4027","#7f5a35","#a37645","#c4925a","#dcae74","#ecc893","#f6e0b8","#6b6a6c","#8a8070","#b3a892","#d8cfba","#7f8a96","#0e1a2e","#15284a","#1f3a66","#2c5085","#3f6aa3","#5e8bbf","#89afd6","#b6d0ea","#ddebf8","#2a7fb0","#56b3dc","#ffffff","#fff0c8"],still:0},{id:"snow-train",name:"snow train",note:"a lit train crossing a snowy stone viaduct at night as snow falls",cols:200,rows:100,cell:1,fps:15,ground:"#070b16",palette:["#0c1428","#121d38","#19284a","#22345e","#2d4374","#3b548a","#4d68a0","#6480b4","#7f99c6","#9db3d6","#bccde4","#d9e4f1","#f1f5fb","#ffe7b0","#ffc56e","#f29a3c","#b8642a","#6e3a22","#3e1420","#6a1e26","#9a2c2e","#ff4a3d","#0b1a1e","#11262a","#1a3436","#26474a","#1e2230","#2c3242","#3e4658","#586276","#7c8698"],still:0},{id:"storm-plains",name:"storm plains",note:"an anvil thunderhead at dusk flickering over a wheat field",cols:200,rows:100,cell:1,fps:15,ground:"#0b0912",palette:["#0f0c20","#141029","#1c1638","#261c4a","#32235a","#40306c","#53407e","#6a5590","#8670a6","#7a6288","#9a7890","#b98e94","#e6a890","#f2bca8","#f7d6a8","#fbe8c6","#f8b070","#e88a4c","#c8643a","#9a4630","#6a3226","#f0c868","#d8a447","#b7843a","#8c6230","#5e4226","#3a2a1c","#261c14","#181a2c","#2a3048","#3a4260","#4f5878","#6a7392","#8890ae","#a2aabd","#5d5878","#7c7598","#a6a2c8","#d6d2fa","#f4f2ff","#ffe08a","#ffb84a"],still:0},{id:"taj-dawn",name:"taj dawn",note:"the taj mahal at sunrise, mirrored in its pool through morning haze",cols:200,rows:100,cell:1,fps:15,ground:"#0d0a13",palette:["#2e2a55","#3d3870","#514a8a","#6a62a3","#8a83bd","#5a3a5e","#7a4d72","#9a6284","#b97a92","#d495a2","#b8705a","#d98d66","#efab78","#f8c98e","#ffe2ae","#fff3d8","#fffcf2","#8e7f9e","#ad9cb4","#cbb6c4","#e3cdd2","#f3e0dc","#2a4a3e","#36584a","#4a6c58","#66845f","#8a9a68","#8a4a3e","#b0624a","#3a2f4a","#4e3d5a","#f6d6c0","#e9bfae","#5e6a40","#7d8a52","#a3a064","#c2b274"],still:0},{id:"tokyo-rain",name:"tokyo rain",note:"a tokyo side street in the rain, neon signs shining on the wet road",cols:200,rows:100,cell:1,fps:15,ground:"#07060d",palette:["#100f22","#17162f","#201e3d","#2b284e","#383463","#4a447a","#4c4890","#6a64c4","#1d1520","#2c1f2e","#3e2b3e","#553a52","#6a3a74","#8e4c8a","#b4649c","#d885ae","#6e1248","#a3196c","#d8278c","#ff47a8","#ff85c6","#ffc4e3","#0c4656","#106f80","#16a0b2","#28d2e2","#7cecf4","#ccfbfd","#5e340a","#93540f","#cc7b16","#f7a32a","#ffc65e","#ffe2a0","#fff4d8","#55100e","#8a1a14","#c22a1a","#ee4626","#ff7a4c","#8ea2c4","#bccbe6","#e4ecfb","#ffffff","#2e62e0","#79a2ff","#20844c","#43d884","#e6c21e","#fff07a","#6a7896","#9ba7c2","#c9d0e2","#262a36","#3a3f4e","#565c6c"],still:0},{id:"varanasi-ghats",name:"varanasi ghats",note:"dusk aarti on the ganga, lamps on the steps and diyas on the water",cols:200,rows:100,cell:1,fps:15,ground:"#0b0812",palette:["#141230","#1d1a42","#272257","#332b6a","#45357a","#5a4388","#7259a8","#6d3a73","#8a4677","#a8527a","#c4607a","#d97a92","#b866a0","#9a68c8","#c868b0","#e8707a","#d9705f","#e88552","#f29f4a","#f8b85a","#fcd07a","#ffe3a6","#fff2d2","#1a1220","#24182a","#301f33","#3f2838","#523340","#3a2c4c","#4d3a64","#5e3524","#7d4527","#a0582a","#c06e2e","#d98a46","#ffffff","#fff6d8","#ffd860","#ff9f2a","#f06a1e","#c8401a","#8a2a16","#0f1a2c","#162540","#20325a","#d6d4ee"],still:0},{id:"volcano-night",name:"volcano night",note:"a volcano erupting at night, lava rivers, an ash plume full of lightning",cols:200,rows:100,cell:1,fps:15,ground:"#070405",palette:["#5a1a10","#7a2410","#982e0e","#b8380b","#d4480b","#ea5e10","#f77a18","#ff9628","#ffb244","#ffcc63","#ffe28c","#fff3c0","#fffcec","#4a3a37","#63504b","#7d6863","#98827b","#b39d94","#cdb9af","#8a4a3a","#a85a40","#c87048","#3c4258","#5d6280","#8a90b4","#b4b9dc","#dfe2f7","#b9a8ff","#f4f0ff","#1a1012","#2c1a18"],still:0}];var Ot;function Qe(){return Ot??=Je({source:Rt,scenes:At}),Ot}var Ae={min:.3,max:.92};function fe(e){let t=e.trim();if(!t.startsWith("#"))return null;let n=t.slice(1).toLowerCase();if(n.length===3){let a=n.split(""),o=a[0],r=a[1],s=a[2];if(o===void 0||r===void 0||s===void 0)return null;let c=p=>Number.parseInt(p+p,16),l={r:c(o),g:c(r),b:c(s)};return Number.isNaN(l.r)||Number.isNaN(l.g)||Number.isNaN(l.b)?null:l}if(n.length===6){if(!/^[0-9a-f]{6}$/.test(n))return null;let a=Number.parseInt(n,16);return{r:a>>16&255,g:a>>8&255,b:a&255}}return null}var et=e=>Math.max(0,Math.min(255,Math.round(e))).toString(16).padStart(2,"0");function Oe({r:e,g:t,b:n}){return`#${et(e)}${et(t)}${et(n)}`}function tt({r:e,g:t,b:n}){let a=o=>{let r=o/255;return r<=.03928?r/12.92:((r+.055)/1.055)**2.4};return .2126*a(e)+.7152*a(t)+.0722*a(n)}function Ie({r:e,g:t,b:n}){let a=e/255,o=t/255,r=n/255,s=Math.max(a,o,r),c=Math.min(a,o,r),l=(s+c)/2;if(s===c)return{h:0,s:0,l};let p=s-c,d=l>.5?p/(2-s-c):p/(s+c),m;return s===a?m=((o-r)/p+(o<r?6:0))*60:s===o?m=((r-a)/p+2)*60:m=((a-o)/p+4)*60,{h:m,s:d,l}}function ze({h:e,s:t,l:n}){let a=(e%360+360)%360,o=Math.max(0,Math.min(1,t)),r=Math.max(0,Math.min(1,n));if(o===0){let p=r*255;return{r:p,g:p,b:p}}let s=r<.5?r*(1+o):r+o-r*o,c=2*r-s,l=p=>{let d=(p/360+1)%1;return d<1/6?c+(s-c)*6*d:d<1/2?s:d<2/3?c+(s-c)*(2/3-d)*6:c};return{r:l(a+120)*255,g:l(a)*255,b:l(a-120)*255}}var Fe=["ink","duotone"],nt="ink";function at(e){return typeof e=="string"&&Fe.includes(e)}var ot="#f5f2ea",Nt="#26231f";function An(e,t,n){let a=n<0?0:n>1?1:n;return{r:e.r+(t.r-e.r)*a,g:e.g+(t.g-e.g)*a,b:e.b+(t.b-e.b)*a}}function Ct(e){let t=fe(e);if(t===null)return e;let{l:n}=Ie(t),a=1-n,o=Ae.min+a*(Ae.max-Ae.min);return Oe(ze({h:0,s:0,l:o}))}function _t(e){let t=fe(e);if(t===null)return e;let{h:n,s:a,l:o}=Ie(t);return Oe(ze({h:n,s:a,l:1-o}))}function Tt(e,t=ot,n=Nt){let a=fe(e),o=fe(t),r=fe(n);return a===null||o===null||r===null?e:Oe(An(o,r,tt(a)))}function Pt(e,t){return e.map(n=>t==="ink"?_t(n):Tt(n))}function Lt(e,t){return{ground:t==="ink"?Ct(e.ground):ot,palette:Pt(e.palette,t)}}function ne(e,t,n){return t==="dark"?{ground:e.ground,palette:e.palette}:Lt(e,n)}var Be=["top-left","top","top-right","left","center","right","bottom-left","bottom","bottom-right"],He=["cover","contain"];function rt(e){return typeof e=="string"&&He.includes(e)}function st(e){return typeof e=="string"&&Be.includes(e)}function zt(e){let[t,n]=e.split("-"),a=e==="top"||e==="center"||e==="bottom"?"center":n??t,o=e==="left"||e==="center"||e==="right"?"center":t,r=s=>s==="left"||s==="top"?-1:s==="right"||s==="bottom"?1:0;return{x:r(a),y:r(o)}}var On=e=>e!==void 0&&Number.isFinite(e)&&e>0?e:1,It=e=>e===0?0:e;function Ne(e,t,n,a={}){let{cols:o,rows:r,cell:s}=e;if(!(t>0)||!(n>0)||o<=0||r<=0)return{width:0,height:0,left:0,top:0,cellSize:0};let c=On(a.zoom),l=t/o,p=n/(r*s),m=(a.fit==="contain"?Math.min(l,p):Math.max(l,p))*c,y=m*o,E=m*r*s,{x:P,y:x}=zt(a.anchor??"center"),C=(t-y)*(1+P)/2,M=(n-E)*(1+x)/2;return{width:y,height:E,left:It(Math.round(C)),top:It(Math.round(M)),cellSize:m}}var W=["sidebar","main","rightbar","bottom"],we={lightMode:nt,fit:"cover",anchor:"center",zoom:1},J={opacity:1,surface:1,blur:0,veil:.12,scrim:0,scrimAngle:180,still:!1,fps:15,resolution:1,pauseOnBlur:!0},Ge={sidebar:1,main:1,rightbar:1,bottom:1},De={scene:"salt-flat",options:we,appearance:J,regions:Ge,piece:{},splash:!0,splashOnNewChat:!1},it={min:0,max:30},Ft={min:.5,max:2},Nn=(e,t,n)=>e<t?t:e>n?n:e;function re(e,t,n,a){return typeof e!="number"||!Number.isFinite(e)?t:Nn(e,n,a)}function $e(e,t){return typeof e=="boolean"?e:t}function Bt(e){let t=typeof e=="object"&&e!==null?e:{};return{lightMode:at(t.lightMode)?t.lightMode:we.lightMode,fit:rt(t.fit)?t.fit:we.fit,anchor:st(t.anchor)?t.anchor:Cn(t)??we.anchor,zoom:re(t.zoom,we.zoom,.25,4)}}function Cn(e){if(typeof e.offsetX!="number"&&typeof e.offsetY!="number")return null;let t=o=>typeof o!="number"||!Number.isFinite(o)?0:o<-.34?-1:o>.34?1:0,n=t(e.offsetX),a=t(e.offsetY);return n===0&&a===0?"center":a===0?n===-1?"left":"right":n===0?a===-1?"top":"bottom":`${a===-1?"top":"bottom"}-${n===-1?"left":"right"}`}function Ht(e){let t=typeof e=="object"&&e!==null?e:{};return{opacity:re(t.opacity,J.opacity,0,1),surface:re(t.surface,J.surface,0,1),blur:re(t.blur,J.blur,0,24),veil:re(t.veil,J.veil,0,1),scrim:re(t.scrim,J.scrim,0,1),scrimAngle:re(t.scrimAngle,J.scrimAngle,0,360),still:$e(t.still,J.still),fps:re(t.fps,J.fps,it.min,it.max),resolution:re(t.resolution,J.resolution,Ft.min,Ft.max),pauseOnBlur:$e(t.pauseOnBlur,J.pauseOnBlur)}}function Dt(e){let t=typeof e=="object"&&e!==null?e:{},n={...Ge};for(let a of W)n[a]=re(t[a],Ge[a],0,1);return n}function ve(e,t){let n=typeof e=="object"&&e!==null?e:{},a=n.scene;return{scene:typeof a=="string"&&(a===""||t.some(r=>r.id===a))?a:De.scene,options:Bt(n.options),appearance:Ht(n.appearance),regions:Dt(n.regions),piece:_n(n.piece),splash:$e(n.splash,De.splash),splashOnNewChat:$e(n.splashOnNewChat,De.splashOnNewChat)}}function _n(e){if(typeof e!="object"||e===null)return{};let t={};for(let[n,a]of Object.entries(e)){if(typeof a!="object"||a===null)continue;let o={};for(let[r,s]of Object.entries(a))(typeof s=="number"&&Number.isFinite(s)||typeof s=="boolean")&&(o[r]=s);Object.keys(o).length>0&&(t[n]=o)}return t}function Ce(e,t){return e.scene===t.scene&&e.options.lightMode===t.options.lightMode&&e.options.fit===t.options.fit&&e.options.anchor===t.options.anchor&&e.options.zoom===t.options.zoom&&e.appearance.opacity===t.appearance.opacity&&e.appearance.surface===t.appearance.surface&&e.appearance.blur===t.appearance.blur&&e.appearance.veil===t.appearance.veil&&e.appearance.scrim===t.appearance.scrim&&e.appearance.scrimAngle===t.appearance.scrimAngle&&e.appearance.still===t.appearance.still&&e.appearance.fps===t.appearance.fps&&e.appearance.resolution===t.appearance.resolution&&e.appearance.pauseOnBlur===t.appearance.pauseOnBlur&&W.every(n=>e.regions[n]===t.regions[n])&&e.splash===t.splash&&e.splashOnNewChat===t.splashOnNewChat&&JSON.stringify(e.piece)===JSON.stringify(t.piece)}var ct;function Gt(e){ct=e}function _e(){if(ct===void 0)throw new Error("ascii-rest: the module loader is not installed");return ct}var Pn="[data-conversation-content]",$t="hero",jt="data-content-phase",qt="data-conversation-session";function Ut(e){let t=e.querySelector(Pn);return t===null?{phase:null,session:null}:{phase:t.getAttribute(jt),session:t.getAttribute(qt)}}function Ln(e,t){return t.phase!==$t||e.phase===null?!1:e.phase!==$t?!0:e.session!==t.session}function Kt(e){let{doc:t,enabled:n,armed:a,busy:o,onOpen:r}=e,c=t.defaultView?.MutationObserver??(typeof MutationObserver>"u"?void 0:MutationObserver);if(c===void 0)return{dispose:()=>{}};let l=!1,p=Ut(t),d=()=>{if(l)return;let y=Ut(t),E=Ln(p,y);p=y,E&&(!a()||!n()||o()||r())},m=new c(d);return m.observe(t.documentElement,{attributes:!0,attributeFilter:[jt,qt],childList:!0,subtree:!0}),{dispose:()=>{l||(l=!0,m.disconnect())}}}function Ue(e,t,n={}){let a=typeof t=="function"?t:t.default,o=typeof t=="function"?{}:t.meta,{fps:r=o.fps??30,motion:s=!1,resolution:c=1,...l}={...o.options,...n},p=a(l),{cols:d=80,rows:m=24,palette:y,ground:E,cell:P=2}=o,x=e instanceof HTMLCanvasElement?e:null,C=y&&x?new Uint8Array(d*m):void 0,M=z=>z[0]==="#"?[1,3,5].map(S=>Number.parseInt(z.slice(S,S+2),16)):(z.match(/[\d.]+/g)??[]).map(Number),A=z=>{let S=M(z);return .2126*(S[0]??0)+.7152*(S[1]??0)+.0722*(S[2]??0)<128},_=()=>({paper:x&&E?!A(E):!1,color:C}),T=!s&&typeof matchMedia=="function"&&matchMedia("(prefers-reduced-motion: reduce)").matches?o.still??0:0,w=()=>{},k;if(x){let z=oe=>`${oe}px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`,S=x.getContext("2d"),i=document.createElement("canvas"),u=i.getContext("2d");if(S===null||u===null)return In();let h=new Map,g=0,v=0,$=0,G=0,D=0,H=0,Y=-1,Z="",ee=new Int32Array(0),U=new Int32Array(0),I=new Int32Array(0),X=new Int32Array(0),de="",ae=!0,ce=C?new Uint8Array(d*m):void 0;x.style.display||="block",x.style.aspectRatio=`${String(d)} / ${String(m*P)}`;let be=()=>{Y=x.clientWidth;let oe=(devicePixelRatio||1)*Math.min(2,Math.max(.5,c));g=Y*oe/d,v=g*P,$=Math.ceil(g),G=Math.ceil(v),D=$+2,H=G+2,x.width=Math.round(g*d),x.height=Math.round(v*m),i.width=D*32,i.height=H*32,ee=Int32Array.from({length:d+1},(te,j)=>Math.round(j*g)),U=Int32Array.from({length:m+1},(te,j)=>Math.round(j*v)),I=Int32Array.from({length:d},(te,j)=>Math.round(j*g+(g-$)/2)),X=Int32Array.from({length:m},(te,j)=>Math.round(j*v+(v-G)/2)),h.clear(),ae=!0},Ee=(oe,te)=>{let j=oe*256+te,ue=h.get(j);if(ue!==void 0)return ue;h.size===1024&&(u.clearRect(0,0,i.width,i.height),h.clear());let le=h.size,ye=le%32*D+1,pe=Math.floor(le/32)*H+1;return u.font=z(g/.6),u.textAlign="center",u.textBaseline="middle",u.fillStyle=y?.[te]??y?.[0]??Z,u.save(),u.beginPath(),u.rect(ye-1,pe-1,D,H),u.clip(),u.fillText(String.fromCharCode(oe),ye+$/2,pe+G/2),u.restore(),h.set(j,le),le};w=()=>{!y&&getComputedStyle(x).color!==Z&&(Z=getComputedStyle(x).color,h.clear(),u.clearRect(0,0,i.width,i.height),ae=!0);let oe=p(T,_());E&&(S.fillStyle=E),ae&&(E?S.fillRect(0,0,x.width,x.height):S.clearRect(0,0,x.width,x.height));for(let te=0,j=0,ue=0;te<oe.length;te++){let le=oe.charCodeAt(te);if(le===10){j=0,ue++;continue}let ye=ue*d+j;if(ae||le!==de.charCodeAt(te)||C!==void 0&&ce!==void 0&&C[ye]!==ce[ye]){let pe=ee[j]??0,Re=U[ue]??0,Pe=(ee[j+1]??0)-pe,Le=(U[ue+1]??0)-Re;if(ae||(E?S.fillRect(pe,Re,Pe,Le):S.clearRect(pe,Re,Pe,Le)),le!==32){let xt=Ee(le,C?.[ye]??0);S.drawImage(i,xt%32*D+1+pe-(I[j]??0),Math.floor(xt/32)*H+1+Re-(X[ue]??0),Pe,Le,pe,Re,Pe,Le)}}j++}de=oe,C!==void 0&&ce?.set(C),ae=!1},be(),k=new ResizeObserver(()=>{x.clientWidth!==Y&&(be(),w())}),k.observe(x)}if(w(),!r)return lt(()=>{k?.disconnect()},()=>{},()=>{},()=>T);let b=matchMedia("(prefers-reduced-motion: reduce)"),R=0,f=0,O=!1,N=!1,F=z=>{R=requestAnimationFrame(F);let S=z-f;S<1e3/r-2||(f=z,T+=Math.min(S,100)/1e3,w())},B=()=>{let z=!N&&O&&!document.hidden&&(s||!b.matches);z&&!R?(f=performance.now(),R=requestAnimationFrame(F)):!z&&R&&(cancelAnimationFrame(R),R=0)},q=new IntersectionObserver(z=>{O=z[z.length-1]?.isIntersecting??!1,B()});return q.observe(e),document.addEventListener("visibilitychange",B),b.addEventListener("change",B),lt(()=>{q.disconnect(),k?.disconnect(),cancelAnimationFrame(R),R=0,document.removeEventListener("visibilitychange",B),b.removeEventListener("change",B)},()=>{N=!0,B()},()=>{N=!1,B()},()=>T)}function In(){return lt(()=>{},()=>{},()=>{},()=>0)}function lt(e,t,n,a){let o=e;return o.pause=t,o.resume=n,o.now=a,o}function zn({palette:e,React:t}){let n=e.length<=6?e:Array.from({length:6},(a,o)=>e[Math.round(o*(e.length-1)/5)]??"#000000");return t.createElement("div",{className:"ascii-rest-swatch","aria-hidden":"true"},...n.map((a,o)=>t.createElement("span",{key:o,style:{backgroundColor:a}})))}var ft="data-ds-dark-theme";function Yt(e){let[t,n]=e.useState(document.body.hasAttribute(ft));return e.useEffect(()=>{let a=new MutationObserver(()=>n(document.body.hasAttribute(ft)));return a.observe(document.body,{attributes:!0,attributeFilter:[ft]}),()=>a.disconnect()},[]),t}function Fn(e){let{React:t,scene:n,copy:a,loadPreview:o,options:r}=e,s=t.useRef(null),[c,l]=t.useState(!1),p=Yt(t);return t.useEffect(()=>{let d=s.current;if(d===null)return;let m=!1,y=null;d.replaceChildren(),l(!1);let E=document.createElement("canvas");return E.style.width="100%",E.style.height="100%",d.append(E),o(n.id).then(P=>{if(m)return;let C=ne(n,p?"dark":"light",r.lightMode);y=Ue(E,{meta:{...P.meta,palette:C.palette,ground:C.ground},default:P.default},{fps:0,motion:!0})}).catch(()=>{m||l(!0)}),()=>{m=!0,y?.(),d.replaceChildren()}},[n.id,p,r.lightMode,o]),t.createElement("div",{className:"ascii-rest-preview"},t.createElement("div",{ref:s,style:{position:"absolute",inset:"0"}}),t.createElement("div",{className:"ascii-rest-preview__meta"},t.createElement("strong",null,n.name),t.createElement("span",null,`${String(n.cols)}\xD7${String(n.rows)}`)),c?t.createElement("p",{className:"ascii-rest-preview__error"},a.previewFailed):null)}function Wt(e){let{React:t,catalog:n,settings:a,copy:o}=e,r=Yt(t),s=n.find(f=>f.id===a.scene)??n[0],c=t.createElement("div",{className:"ascii-rest-actions"},t.createElement("button",{type:"button",className:"ascii-rest-button ascii-rest-button--primary",onClick:e.onOpenPanel},o.openPanel),t.createElement("button",{type:"button",className:"ascii-rest-button",onClick:()=>e.onAppearance({still:!a.appearance.still})},a.appearance.still?o.play:o.pause),t.createElement("button",{type:"button",className:"ascii-rest-button",onClick:e.onReset},o.reset)),l=t.createElement("header",{className:"ascii-rest-page__head"},t.createElement("h3",{className:"ascii-rest-page__title"},o.title),t.createElement("p",{className:"ascii-rest-page__note"},o.note)),p=t.createElement("div",{className:"ascii-rest-grid",role:"group","aria-label":o.scenes},...n.map(f=>t.createElement("button",{key:f.id,type:"button",className:"ascii-rest-card","aria-pressed":f.id===a.scene,onClick:()=>e.onScene(f.id)},t.createElement(zn,{palette:f.palette,React:t}),t.createElement("span",{className:"ascii-rest-card__name"},f.name),t.createElement("span",{className:"ascii-rest-card__note"},f.note)))),d=(f,O,N)=>t.createElement("div",{className:"ascii-rest-field"},t.createElement("div",{className:"ascii-rest-field__text"},t.createElement("span",{className:"ascii-rest-field__label"},f),N===void 0?null:t.createElement("span",{className:"ascii-rest-field__hint"},N)),O),m=(f,O,N,F,B)=>t.createElement("div",{className:"ascii-rest-chips",role:"group","aria-label":f},...O.map(q=>t.createElement("button",{key:q,type:"button",className:"ascii-rest-chip","aria-pressed":q===F,onClick:()=>B(q)},N[q]??q))),y=(f,O,N,F)=>t.createElement("input",{type:"range",className:"ascii-rest-range","aria-label":f,min:N.min,max:N.max,step:N.step,value:O,onChange:B=>F(Number(B.target.value))}),E={"top-left":o.anchorTopLeft,top:o.anchorTop,"top-right":o.anchorTopRight,left:o.anchorLeft,center:o.anchorCenter,right:o.anchorRight,"bottom-left":o.anchorBottomLeft,bottom:o.anchorBottom,"bottom-right":o.anchorBottomRight},P={cover:o.fitCover,contain:o.fitContain},x={sidebar:o.regionSidebar,main:o.regionMain,rightbar:o.regionRightbar,bottom:o.regionBottom},C={width:172,height:96},M=s===void 0?null:Ne({cols:s.cols,rows:s.rows,cell:s.cell},C.width,C.height,{fit:a.options.fit,anchor:a.options.anchor,zoom:a.options.zoom}),A=t.createElement("div",{className:"ascii-rest-anchor",style:{width:`${String(C.width)}px`,height:`${String(C.height)}px`}},M===null||s===void 0?null:t.createElement("div",{className:"ascii-rest-anchor__picture",style:{left:`${String(M.left)}px`,top:`${String(M.top)}px`,width:`${String(M.width)}px`,height:`${String(M.height)}px`,backgroundImage:`linear-gradient(105deg, ${ne(s,r?"dark":"light",a.options.lightMode).palette.slice(0,12).map((f,O,N)=>`${f} ${String(O/N.length*100)}%`).join(", ")})`}}),t.createElement("div",{className:"ascii-rest-anchor__cells",role:"group","aria-label":o.anchor},...Be.map(f=>t.createElement("button",{key:f,type:"button",className:"ascii-rest-anchor__cell","aria-pressed":f===a.options.anchor,"aria-label":E[f]??f,title:E[f]??f,onClick:()=>e.onPlacement({anchor:f})},t.createElement("span",{className:"ascii-rest-anchor__dot"}))))),_={on:o.splashOn,off:o.splashOff},L=t.createElement("section",{className:"ascii-rest-section"},t.createElement("h4",{className:"ascii-rest-section__title"},o.splash),t.createElement("p",{className:"ascii-rest-section__note"},o.splashNote),d(o.splash,m(o.splash,["on","off"],_,a.splash?"on":"off",f=>e.onSplash(f==="on"))),d(o.splashOnNewChat,m(o.splashOnNewChat,["on","off"],_,a.splashOnNewChat?"on":"off",f=>e.onSplashOnNewChat(f==="on")),o.splashOnNewChatNote)),T={ink:o.lightInk,duotone:o.lightDuotone},w=t.createElement("section",{className:"ascii-rest-section"},t.createElement("h4",{className:"ascii-rest-section__title"},o.lightMode),t.createElement("p",{className:"ascii-rest-section__note"},o.lightModeNote),d(o.lightMode,m(o.lightMode,Fe,T,a.options.lightMode,f=>e.onPlacement({lightMode:f})))),k=t.createElement("section",{className:"ascii-rest-section"},t.createElement("h4",{className:"ascii-rest-section__title"},o.placement),t.createElement("p",{className:"ascii-rest-section__note"},o.placementNote),t.createElement("div",{className:"ascii-rest-placement"},t.createElement("div",{className:"ascii-rest-placement__controls"},d(o.fit,m(o.fit,He,P,a.options.fit,f=>e.onPlacement({fit:f}))),d(o.zoom,y(o.zoom,a.options.zoom,{min:.5,max:3,step:.01},f=>e.onPlacement({zoom:f})),`${a.options.zoom.toFixed(2)}\xD7`)),t.createElement("div",{className:"ascii-rest-placement__stage"},A,t.createElement("p",{className:"ascii-rest-placement__caption"},E[a.options.anchor]??"")))),b=t.createElement("section",{className:"ascii-rest-section"},t.createElement("h4",{className:"ascii-rest-section__title"},o.regions),t.createElement("p",{className:"ascii-rest-section__note"},o.regionsNote),...W.map(f=>d(x[f]??f,y(x[f]??f,a.regions[f],{min:0,max:1,step:.01},O=>e.onRegions({[f]:O})),`${Math.round(a.regions[f]*100)}%`))),R=t.createElement("p",{className:"ascii-rest-credit"},`${o.credit} `,t.createElement("a",{href:"https://ascii.rest/",target:"_blank",rel:"noreferrer noopener"},"ascii.rest"));return t.createElement("div",{className:"ascii-rest-page"},l,s===void 0?null:t.createElement(Fn,{scene:s,options:a.options,loadPreview:e.loadPreview,copy:o,React:t}),c,L,w,k,b,p,R)}var ut={};St(ut,{default:()=>Qt,meta:()=>Xt});var Xt={name:"salt flat",category:"scenes",note:"the vercel triangle over a mirror of salt, the sun rising behind its tip",cols:200,rows:100,cell:1,fps:15,ground:"#000000",palette:["#0d0d0e","#161617","#1f1f21","#2a2a2c","#363638","#444446","#555557","#69696b","#808082","#9a9a9c","#b8b8ba","#d8d8da","#ffffff","#50e3c2","#0070f3","#7928ca","#ff0080","#ff4d4d","#f9cb28","#b0f2e3","#8cbcf9","#bb94e4","#ff8cc0","#ffa6a6","#fce59a","#24665a","#00326d","#36125b","#73003a","#732323","#705b12"]},se=200,xe=100,ge=100,Ke=22,je=Ke*Math.sqrt(3),V=57,Bn=1.7,me=V-Bn,Jt=me-je,Hn=Jt+3.2,Q=Math.sqrt(3)/2,Dn=24,dt=Math.PI*2,Gn=" \xB7\u2022\u25CF",$n=[0,.3,.6,1],Un=[0,8,2,10,12,4,14,6,3,11,1,9,15,7,13,5].map(e=>e/16-.47),Vt=[[.31,.89,.76],[0,.44,.95],[.47,.16,.79],[1,0,.5],[1,.3,.3],[.98,.8,.16]];function Se(e,t){let n=Math.imul(e|0,374761393)+Math.imul(t|0,668265263);return n=Math.imul(n^n>>>13,1274126177),((n^n>>>16)>>>0)/4294967296}function Zt(e,t){let n=Math.floor(e),a=Math.floor(t),o=e-n,r=t-a,s=o*o*(3-2*o),c=r*r*(3-2*r),l=Se(n,a),p=Se(n+1,a),d=Se(n,a+1),m=Se(n+1,a+1);return l+(p-l)*s+(d-l)*c+(l-p-d+m)*s*c}var he=e=>e<0?0:e>1?1:e,ie=(e,t,n)=>{let a=he((n-e)/(t-e));return a*a*(3-2*a)},jn=e=>[1,3,5].map(t=>parseInt(e.slice(t,t+2),16)/255),qe=[0,0,0];function qn(e){let t=(e%1+1)%1*6,n=Math.floor(t),a=t-n,o=Vt[n],r=Vt[(n+1)%6];for(let s=0;s<3;s++)qe[s]=o[s]+(r[s]-o[s])*a}function Kn(e,t){return-(e-(ge-Ke))*Q-(t-me)*.5}function Yn(e,t){return(e-(ge+Ke))*Q-(t-me)*.5}function Qt(){let e=Xt.palette.map(jn),t=se*xe,n=new Array(t),a=new Uint8Array(32768).fill(255),o=(M,A,_)=>{let L=Math.min(31,M*31.99|0)<<10|Math.min(31,A*31.99|0)<<5|Math.min(31,_*31.99|0);if(a[L]!==255)return a[L];let T=0,w=1e9;for(let k=0;k<e.length;k++){let b=e[k][0]-M,R=e[k][1]-A,f=e[k][2]-_,O=.3*b*b+.5*R*R+.2*f*f;O<w&&(w=O,T=k)}return a[L]=T},r=250,s=64,c=2,l=new Float32Array(t),p=new Float32Array(t);for(let M=0;M<xe;M++)for(let A=0;A<se;A++){let _=M*se+A,L=M+.5;if(L<V){L<V-14&&Se(A,M*5+3)>.988&&(p[_]=.4+.6*Se(M,A));continue}let T=L-V,w=r/T,k=(A+.5-ge)*w/s,b=k+.16*(Zt(k*.5,w*.5)-.5),R=w+.16*(Zt(k*.5+7.3,w*.5+1.9)-.5),f=2/3*b/c,O=(-1/3*b+Math.sqrt(3)/3*R)/c,N=Math.round(f),F=Math.round(O),B=Math.round(-f-O),q=Math.abs(N-f),z=Math.abs(F-O),S=Math.abs(B+f+O);q>z&&q>S?N=-F-B:z>S&&(F=-N-B);let i=b-c*1.5*N,u=R-c*Math.sqrt(3)*(F+N/2),h=Math.abs(u),g=Math.abs(Q*i+.5*u),v=Math.abs(Q*i-.5*u),$=0,G=Math.sign(u),D=h;g>D&&(D=g,$=Q*Math.sign(Q*i+.5*u),G=.5*Math.sign(Q*i+.5*u)),v>D&&(D=v,$=Q*Math.sign(Q*i-.5*u),G=-.5*Math.sign(Q*i-.5*u));let H=c*Q-D,Y=-(w*w)/r,Z=w/s,ee=(A+.5-ge)/s*Y,U=$*Z,I=$*ee+G*Y,X=H/Math.sqrt(U*U+I*I+1e-9),de=c*2*Q/Math.abs(Y);l[_]=ie(.95,.25,X)*ie(5,15,de)}let d=1024,m=new Float32Array(d),y=new Float32Array(t),E=new Float32Array(t),P=new Float32Array(t),x=new Uint16Array(t),C=new Float32Array(t);for(let M=0;M<xe;M++)for(let A=0;A<se;A++){let _=M*se+A,L=A+.5,T=M+.5<V?M+.5:2*V-M-.5,w=L-ge,k=T-Hn,b=Math.sqrt(w*w+k*k),R=V-T;y[_]=.22*Math.exp(-R/3)+.025*Math.exp(-R/10)+.8*Math.exp(-(R*R)/.7)+.35*Math.exp(-(k*k)/.5)*Math.exp(-Math.abs(w)/32)+(b<4.5?1:0),E[_]=.9*Math.exp(-b/2.5)+.25*Math.exp(-b/8);let f=Math.atan2(w,-k);P[_]=ie(4,12,b)*Math.exp(-b/50)*ie(2.35,1.75,Math.abs(f)),x[_]=Math.min(d-1,Math.floor((f+Math.PI)/dt*d)),C[_]=(.3+.25*Math.exp(-(w*w)/2500))*ie(V+2,V+12,M+.5)}return(M,{color:A}={})=>{let _=dt/Dn,L=.92+.08*Math.sin(M*_*2),T=M*_,w=M%6/1.4,k=Math.min(1,w),b=w<1?.5+.5*w:w<1.5?1-(w-1)*2:0,R=me-je*k*k,f=w>.8&&w<1.5?Math.sin((w-.8)/.7*Math.PI):0;for(let S=0;S<d;S++){let i=S/d*dt-Math.PI,u=.5+.5*Math.cos(14*i+T+1.4*Math.sin(5*i-T*2)),h=.5+.5*Math.cos(23*i-T*3+.9*Math.sin(3*i+T));u*=u,u*=u,u*=u,h*=h,h*=h,h*=h,h*=h,m[S]=(u*.55+h*.18)*L}let O=0,N=0,F=0,B=0,q=(S,i,u,h)=>{let g=S-ge,v=y[u]+E[u]*L+P[u]*m[x[u]];if(b>0){let I=Ke*(1-(me-R)/je),X=i-R,de=Math.min((S-ge+I)**2,(S-ge-I)**2)+X*X;v+=Math.exp(-de/5)*b*.7}if(f>0){let I=i-Jt;v+=f*(Math.exp(-(I*I)/.35)*Math.exp(-Math.abs(g)/16)+Math.exp(-(g*g)/.35)*Math.exp(-Math.abs(I)/12))*.9}if(h){let I=p[Math.floor(i)*se+Math.floor(S)];I&&(v=Math.max(v,I*(.65+.35*Math.sin(M*_*(2+(I*10|0))+I*40))*ie(.25,.04,v)))}O=v,N=v,F=v,B=0;let $=Kn(S,i),G=Yn(S,i),D=i-me,H=Math.max($,G),Y=Math.max(H,D);if(Y>4)return;let Z=he(.5-Y*1.4);B=he(.5-Y*.5),O*=1-Z,N*=1-Z,F*=1-Z;let ee=he((me-i)/je);if(D<.4){let I=Math.exp(-((H+.55)*(H+.55))/.3)*(.8+.4*ee);if(b>0&&(I+=Math.exp(-((i-R)*(i-R))/3)*b*Math.exp(-((H+.5)*(H+.5))/.6)*1.2),I*=ie(.4,-.6,D),O+=I,N+=I,F+=I,H>-.5){let X=Math.exp(-((H-.7)*(H-.7))/.5)*(.45+.3*ee)*ie(.4,-1.2,D);qn(H*.18+ee*.9-M/6+($>G?0:.5)),O+=X*qe[0],N+=X*qe[1],F+=X*qe[2]}}let U=Math.exp(-((D+.5)*(D+.5))/.2)*(H<0?1:0)*.32;O+=U,N+=U,F+=U};for(let S=0;S<xe;S++)for(let i=0;i<se;i++){let u=S*se+i,h=S+.5,g=i+.5,v=0;if(h<V)q(g,h,u,!0),v=.05*ie(10,V,h);else{let U=.06+(h-V)*.011,I=M*_,X=g+U*(Math.sin(h*.8-I*6+Math.sin(g*.05)*2)*.7+Math.sin(g*.11+h*1.3-I*4)*.35),de=2*V-h+U*.4*Math.sin(g*.07-I*3+h*.6);q(X,de,u,!1);let ae=.8-.5*ie(V,xe,h);O*=ae,N*=ae,F*=ae;let ce=l[u]*(1-.85*B);if(ce>0){let be=C[u],Ee=1-.55*ce;O=O*Ee+ce*be,N=N*Ee+ce*be,F=F*Ee+ce*be}v=.02}let $=O,G=N,D=F,H=Math.max($,G,D,1e-4),Y=H<.008?0:he(v+(1-v)*Math.pow(H,.85)*.95),Z=Math.max(0,Math.min(3,Math.round(Y*3+Un[(S&3)*4+(i&3)])));if(n[u]=Gn[Z],A){let U=(.3+.7*(Z?Math.min(1,(Y+.06)/$n[Z]):0))/H;A[u]=o(he($*U),he(G*U),he(D*U))}}let z=[];for(let S=0;S<xe;S++)z.push(n.slice(S*se,(S+1)*se).join(""));return z.join(`
`)}}var Wn=()=>{let e=en(ut);if(e===null)throw new Error('ascii-rest: the built-in "salt-flat" piece did not have the expected shape');return e},Vn={"salt-flat":Wn};function Zn(e){return`client.${e}.js`}function Xn(e){if(!/^[a-z0-9][a-z0-9-]*$/.test(e))throw new Error(`ascii-rest: "${e}" is not a scene id`);return`./${Zn(e)}`}var pt=new Map;async function Te(e){let t=pt.get(e);if(t!==void 0)return t;let n=Vn[e];if(n!==void 0){let s=n();return pt.set(e,s),s}let a=_e();if(a===void 0)throw new Error("ascii-rest: the module loader is not available");let o=await a.async(Xn(e)),r=en(o);if(r===null)throw new Error(`ascii-rest: scene "${e}" did not load a piece module`);return pt.set(e,r),r}function en(e){let t=e;if(t===null||typeof t!="object")return null;let n=t.meta,a=t.default;return typeof n!="object"||n===null||typeof a!="function"?null:t}function Jn(e,t){return`${e}${Math.round(Math.max(0,Math.min(1,t))*255).toString(16).padStart(2,"0")}`}var Qn="data-ds-dark-theme",ea="data-ascii-rest-layer";function Me(e=document){return e.body.hasAttribute(Qn)?"dark":"light"}function Ye(e,t=document){let{scene:n}=e,a=e.geometry,o=Me(t),r=null,s=!1,c=e.still?0:e.fps,l=!1,p=t.createElement("div");p.setAttribute(ea,""),p.setAttribute("aria-hidden","true"),p.style.position="fixed",p.style.inset="0",p.style.zIndex="-1",p.style.overflow="hidden",p.style.pointerEvents="none",p.style.contain="strict";let d=t.createElement("canvas");d.style.position="absolute",d.style.display="block",d.style.left="0",d.style.top="0";let m=t.createElement("div");m.setAttribute("aria-hidden","true"),m.style.position="absolute",m.style.inset="0",m.style.pointerEvents="none";let y=t.createElement("div");y.setAttribute("aria-hidden","true"),y.style.position="absolute",y.style.inset="0",y.style.pointerEvents="none",p.append(d,m,y);let E=()=>ne(n,o,e.lightMode),P=()=>E().ground,x=()=>{p.style.backgroundColor=P(),p.style.opacity=String(e.opacity),p.style.filter=e.blur>0?`blur(${String(e.blur)}px)`:"",m.style.backgroundColor=P(),m.style.opacity=String(e.veil);let b=e.scrim;y.style.opacity=String(b),y.style.background=b>0?`linear-gradient(${String(e.scrimAngle)}deg, ${P()} 0%, ${Jn(P(),0)} 62%)`:""},C=()=>{r?.(),r=null,c=e.still?0:e.fps;let b=E(),R={meta:{...e.module.meta,palette:b.palette,ground:b.ground},default:e.module.default};try{r=Ue(d,R,{...e.pieceOptions,fps:c,resolution:e.resolution,motion:!0}),l&&r.pause()}catch(f){A(),e.onError?.(f)}},M=b=>{if(s)return;b!==void 0&&(a=b);let R=Ne(n,window.innerWidth,window.innerHeight,a);d.style.width=`${String(R.width)}px`,d.style.height=`${String(R.height)}px`,d.style.left=`${String(R.left)}px`,d.style.top=`${String(R.top)}px`},A=()=>{r?.(),r=null,p.remove()},_=()=>M(),L=()=>r?.pause(),T=()=>{l||r?.resume()},w=!1,k=b=>{b!==w&&(w=b,b?(window.addEventListener("blur",L),window.addEventListener("focus",T)):(window.removeEventListener("blur",L),window.removeEventListener("focus",T)))};try{t.body.prepend(p),x(),C(),M()}catch(b){A(),e.onError?.(b)}return window.addEventListener("resize",_),k(e.pauseOnBlur),{element:p,relayout:M,rescheme:()=>{if(s)return;let b=Me(t);b!==o&&(o=b,x(),C(),M())},pause:()=>{s||(l=!0,r?.pause())},resume:()=>{s||(l=!1,r?.resume())},restyle:b=>{if(s)return;e.opacity=b.opacity,e.blur=b.blur,e.veil=b.veil,e.scrim=b.scrim,e.scrimAngle=b.scrimAngle,e.pauseOnBlur=b.pauseOnBlur,k(b.pauseOnBlur),x();let R=b.still?0:b.fps,f=b.resolution!==e.resolution;(R!==c||f)&&(e.still=b.still,e.fps=b.fps,e.resolution=b.resolution,C())},dispose:()=>{s||(s=!0,window.removeEventListener("resize",_),k(!1),A())}}}var ta="data-ascii-rest-splash",na="[data-dsh-boot]",aa="[data-shell-bottom]",oa={minVisibleMs:1200,maxWaitMs:5e3,fadeMs:650,pollMs:50};function ra(){return typeof matchMedia=="function"&&matchMedia("(prefers-reduced-motion: reduce)").matches}function tn(e){let{doc:t,scene:n}=e,a={...oa,...e.timing},o=Date.now(),r=t.createElement("div");r.setAttribute(ta,""),r.setAttribute("aria-hidden","true"),r.style.position="fixed",r.style.inset="0",r.style.zIndex="2147483500",r.style.overflow="hidden",r.style.contain="strict",r.style.pointerEvents="auto",r.style.opacity="1",r.style.backgroundColor=ne(n,Me(t),e.lightMode).ground,t.body.append(r);let s=null,c=null,l=null,p=null,d=null,m=!1,y=!1,E=()=>{for(let w of[c,l,p,d])w!==null&&clearTimeout(w);c=null,l=null,p=null,d=null},P=()=>{y||(y=!0,E(),s?.dispose(),s=null,r.remove())},x=w=>{y||(P(),e.onError?.(w))},C=()=>{y||(P(),e.onEnd?.())},M=()=>{if(m||y)return;m=!0,E();let w=ra()?0:a.fadeMs;r.style.transition=`opacity ${String(w)}ms ease-out`,r.style.opacity="0",d=setTimeout(C,w)},A=w=>{m||y||p!==null||(p=setTimeout(()=>{p=null,M()},w))},_=()=>t.querySelector(na)===null&&t.querySelector(aa)!==null,L=()=>{if(c=null,!(m||y)){if(_()){A(Math.max(0,a.minVisibleMs-(Date.now()-o)));return}c=setTimeout(L,a.pollMs)}},T=w=>{if(y)return;let k;try{k=Ye({scene:n,module:w,pieceOptions:e.pieceOptions,opacity:1,blur:0,veil:0,scrim:0,scrimAngle:180,still:e.still,pauseOnBlur:!1,fps:e.fps,resolution:e.resolution,lightMode:e.lightMode,geometry:{fit:"cover",anchor:"center",zoom:1},onError:x},t)}catch(b){x(b);return}if(y){k.dispose();return}k.element.style.zIndex="0",s=k,r.append(k.element)};return typeof e.module.then=="function"?e.module.then(T,x):T(e.module),y?{element:r,dispose:P}:(c=setTimeout(L,a.pollMs),l=setTimeout(M,a.maxWaitMs),{element:r,dispose:P})}var ht="dsh-skin:ascii-rest:settings";function sa(e){if(e!==void 0)try{let t=e.getItem(ht);return t===null?void 0:JSON.parse(t)}catch{return}}function nn(e,t){let n=t??(typeof localStorage>"u"?void 0:localStorage),a=ve(sa(n),e),o=new Set,r=c=>{if(n!==void 0)try{n.setItem(ht,JSON.stringify(c))}catch{}},s=c=>{if(!Ce(a,c)){a=c;for(let l of o)l(a)}};return{get:()=>a,set:c=>{let l=ve(c,e);Ce(a,l)||(r(l),s(l))},update:c=>{let l=ve(c(a),e);Ce(a,l)||(r(l),s(l))},subscribe:c=>(o.add(c),()=>{o.delete(c)}),reset:()=>{try{n?.removeItem(ht)}catch{}s(ve(void 0,e))}}}var an=`
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
`;function We(e){return typeof e=="object"&&e!==null&&typeof e.style=="object"&&e.style!==null&&typeof e.getAttribute=="function"}var gt="data-ascii-rest-region",on=["--dsw-alias-bg-base","--dsw-specific-sidebar-fill"];function rn(e){let t=e.querySelector("[data-rightbar-col]"),n=e.querySelector("[data-shell-bottom]");if(!We(t)||!We(n))return null;let a=t.parentElement;if(a===null)return null;let o=t.previousElementSibling,r=a.firstElementChild;return!We(o)||!We(r)||r===o||r===n||r===t?null:{sidebar:r,main:o,rightbar:t,bottom:n}}function sn(e){for(let t of W)e[t].setAttribute(gt,t)}function mt(e){for(let t of W){let n=e[t];n.style.removeProperty("background-color");for(let a of on)n.style.removeProperty(a)}}function bt(e){mt(e);for(let t of W)e[t].removeAttribute(gt)}function cn(e,t){for(let n of W){let a=e[n],o=t[n];a.style.backgroundColor=o;for(let r of on)a.style.setProperty(r,o)}}function yt(e){return W.every(t=>{let n=e[t];return n.isConnected&&n.getAttribute(gt)===t})}var dn=.58,un=.66;function K(e,t){let n=t<0?0:t>1?1:t;return`${e}${Math.round(n*255).toString(16).padStart(2,"0")}`}function ln(e,t,n){return Math.min(1,(e==="dark"?dn:un)*n*t)}function pn(e){let t=e.scene.ground,n=ne(e.scene,"light",e.lightMode),a=n.ground,o=(l=0)=>Math.min(1,dn*e.surfaceOpacity+l),r=(l=0)=>Math.min(1,un*e.surfaceOpacity+l),s=fn(e.scene.palette,"dark"),c=fn(n.palette,"light");return{"--dsw-alias-bg-base":{light:K(a,r()),dark:K(t,o())},"--dsw-alias-bg-layer-1":{light:K(a,r(.1)),dark:K(t,o(.12))},"--dsw-alias-bg-layer-2":{light:K(a,r(.16)),dark:K(t,o(.2))},"--dsw-alias-bg-overlay":{light:K(a,.97),dark:K(t,.95)},"--dsw-specific-sidebar-fill":{light:K(a,r(.04)),dark:K(t,o(.06))},"--dsw-alias-brand-primary":{light:c,dark:s},"--dsw-alias-border-l1":{light:K("#000000",.12),dark:K("#ffffff",.14)},"--dsw-alias-border-l2":{light:K("#000000",.2),dark:K("#ffffff",.22)},"--dsw-alias-label-primary":{light:"#0f1115",dark:"#f9fafb"},"--dsw-alias-label-secondary":{light:"#4b5563",dark:"#cfd3d6"},"--dsw-alias-state-error-primary":{light:"#c62a2a",dark:"#ff6b6b"},"--dsw-alias-state-idle-primary":{light:"#81858c",dark:"#979da6"},"--dsw-alias-state-success-primary":{light:"#0f7b4f",dark:"#4ade80"},"--dsw-alias-state-warn-primary":{light:"#96660a",dark:"#fbbf24"}}}function hn(e,t){let n=e.scene.ground,a=ne(e.scene,"light",e.lightMode).ground,o={};for(let r of["sidebar","main","rightbar","bottom"]){let s=t[r];o[r]={light:K(a,ln("light",s,e.surfaceOpacity)),dark:K(n,ln("dark",s,e.surfaceOpacity))}}return o}function fn(e,t){let n=t==="dark"?"#50a0e3":"#0070f3",a=n,o=0;for(let r of e){let s=fe(r);if(s===null)continue;let c=Math.max(s.r,s.g,s.b)/255,l=Math.min(s.r,s.g,s.b)/255,p=c-l,d=(c+l)/2,m=1-Math.abs(d-.55)*2,y=p*Math.max(0,m);y>o&&(o=y,a=r)}return o===0?n:a}var gn={navLabel:"ASCII background",title:"ASCII background",note:"An ascii.rest scene behind the workspace. The dark theme uses the scene's own palette; the light theme offers ink (hues kept, lightness mirrored) or duotone (a two-colour print).",previewFailed:"This scene did not load.",play:"Play",pause:"Pause",reset:"Reset",openPanel:"Open the tuning panel",credit:"Scenes by",scenes:"Available scenes",closePanel:"Close the tuning panel",placement:"Placement",placementNote:"Choose what happens to the overflow, then which edge to keep. The picture always scales at the scene's own ratio, never stretched.",fit:"Fit",fitCover:"Fill and crop",fitContain:"Fit and letterbox",anchor:"Anchor",anchorTopLeft:"Top left",anchorTop:"Top",anchorTopRight:"Top right",anchorLeft:"Left",anchorCenter:"Center",anchorRight:"Right",anchorBottomLeft:"Bottom left",anchorBottom:"Bottom",anchorBottomRight:"Bottom right",zoom:"Zoom",lightMode:"Light palette",lightModeNote:"Only the light theme uses this. Ink keeps the scene's hues and mirrors its lightness; duotone maps each cell's luminance between paper and ink, so it reads as a print.",lightInk:"Ink",lightDuotone:"Duotone",regions:"Panel reveal",regionsNote:"How much of the picture each region lets through. 0 is the host's own opaque surface, 1 is the skin's default.",regionSidebar:"Sidebar",regionMain:"Main panel",regionRightbar:"Auxiliary bar",regionBottom:"Bottom bar",scrim:"Gradient scrim",scrimNote:"Fades one edge of the picture towards the ground so the composer and the sidebar have a quiet base to sit on.",scrimStrength:"Strength",scrimAngle:"Direction",pauseOnBlur:"Pause when unfocused",pauseOnBlurNote:"Stop drawing while the window is in the background, and resume on return.",splash:"Opening scene",splashNote:"On a cold start the current scene fills the window, then fades once the interface is ready. Switching the skin on mid-session does not play it.",splashOn:"On",splashOff:"Off",splashOnNewChat:"Opening scene on new conversations",splashOnNewChatNote:"Play the opening scene again each time a new empty conversation opens. Off by default, because it interrupts when you open several in a row."};var mn={navLabel:"ASCII \u80CC\u666F",title:"ASCII \u80CC\u666F",note:"\u7528 ascii.rest \u7684\u573A\u666F\u4F5C\u5DE5\u4F5C\u533A\u80CC\u666F\u3002\u6697\u8272\u7528\u573A\u666F\u672C\u6765\u7684\u914D\u8272\uFF1B\u4EAE\u8272\u53EF\u9009\u58A8\u8272\uFF08\u4FDD\u4F4F\u8272\u76F8\u3001\u53EA\u7FFB\u660E\u6697\uFF09\u6216\u53CC\u8272\u8C03\uFF08\u7EB8\u4E0E\u58A8\u7684\u4E24\u8272\u5370\u5237\uFF09\u3002",previewFailed:"\u8FD9\u4E2A\u573A\u666F\u6CA1\u80FD\u52A0\u8F7D\u3002",play:"\u64AD\u653E\u52A8\u753B",pause:"\u6682\u505C\u52A8\u753B",reset:"\u6062\u590D\u9ED8\u8BA4",openPanel:"\u6253\u5F00\u8C03\u53C2\u9762\u677F",credit:"\u573A\u666F\u6765\u81EA",scenes:"\u53EF\u9009\u573A\u666F",closePanel:"\u5173\u95ED\u8C03\u53C2\u9762\u677F",placement:"\u6446\u653E",placementNote:"\u5148\u9009\u9002\u5E94\u65B9\u5F0F\uFF0C\u518D\u9009\u4FDD\u7559\u54EA\u4E00\u8FB9\u3002\u753B\u9762\u6309\u573A\u666F\u81EA\u8EAB\u7684\u6BD4\u4F8B\u7F29\u653E\uFF0C\u4E0D\u4F1A\u88AB\u62C9\u4F38\u3002",fit:"\u9002\u5E94\u65B9\u5F0F",fitCover:"\u586B\u6EE1\u88C1\u5207",fitContain:"\u5B8C\u6574\u7559\u767D",anchor:"\u5BF9\u9F50\u4F4D\u7F6E",anchorTopLeft:"\u5DE6\u4E0A",anchorTop:"\u4E0A\u4E2D",anchorTopRight:"\u53F3\u4E0A",anchorLeft:"\u5DE6\u4E2D",anchorCenter:"\u5C45\u4E2D",anchorRight:"\u53F3\u4E2D",anchorBottomLeft:"\u5DE6\u4E0B",anchorBottom:"\u4E0B\u4E2D",anchorBottomRight:"\u53F3\u4E0B",zoom:"\u7F29\u653E",lightMode:"\u4EAE\u8272\u914D\u8272",lightModeNote:"\u53EA\u5728\u4EAE\u8272\u4E3B\u9898\u4E0B\u751F\u6548\u3002\u58A8\u8272\u4FDD\u4F4F\u573A\u666F\u7684\u8272\u76F8\uFF0C\u53EA\u628A\u660E\u6697\u7FFB\u8FC7\u6765\uFF1B\u53CC\u8272\u8C03\u6309\u6BCF\u683C\u81EA\u8EAB\u7684\u660E\u6697\u5728\u7EB8\u4E0E\u58A8\u4E4B\u95F4\u53D6\u503C\uFF0C\u66F4\u50CF\u4E00\u5F20\u5370\u5237\u54C1\u3002",lightInk:"\u58A8\u8272",lightDuotone:"\u53CC\u8272\u8C03",regions:"\u5206\u533A\u900F\u51FA",regionsNote:"\u6BCF\u4E2A\u533A\u57DF\u5355\u72EC\u63A7\u5236\u753B\u9762\u900F\u51FA\u591A\u5C11\uFF1A0 \u662F\u5BBF\u4E3B\u81EA\u5DF1\u7684\u4E0D\u900F\u660E\u8868\u9762\uFF0C1 \u662F\u76AE\u80A4\u9ED8\u8BA4\u3002",regionSidebar:"\u4FA7\u8FB9\u680F",regionMain:"\u4E3B\u9762\u677F",regionRightbar:"\u526F\u4FA7\u8FB9\u680F",regionBottom:"\u5E95\u680F",scrim:"\u6E10\u53D8\u906E\u7F69",scrimNote:"\u671D\u4E00\u4E2A\u65B9\u5411\u628A\u753B\u9762\u6E10\u9690\u5230\u5E95\u8272\uFF0C\u8BA9\u5E95\u90E8\u7684\u8F93\u5165\u6846\u548C\u4FA7\u8FB9\u7559\u51FA\u5B89\u9759\u7684\u5E95\u5B50\u3002",scrimStrength:"\u5F3A\u5EA6",scrimAngle:"\u65B9\u5411",pauseOnBlur:"\u5931\u7126\u6682\u505C",pauseOnBlurNote:"\u7A97\u53E3\u4E0D\u5728\u524D\u53F0\u65F6\u505C\u6B62\u7ED8\u5236\uFF0C\u56DE\u5230\u524D\u53F0\u63A5\u7740\u64AD\u3002",splash:"\u5F00\u5C4F",splashNote:"\u51B7\u542F\u52A8\u65F6\u5148\u7528\u5F53\u524D\u573A\u666F\u94FA\u6EE1\u7A97\u53E3\uFF0C\u7B49\u754C\u9762\u5C31\u7EEA\u518D\u6E10\u9690\u3002\u76AE\u80A4\u5728\u8FD0\u884C\u4E2D\u88AB\u542F\u7528\u65F6\u4E0D\u64AD\u3002",splashOn:"\u5F00\u542F",splashOff:"\u5173\u95ED",splashOnNewChat:"\u65B0\u5BF9\u8BDD\u5F00\u5C4F",splashOnNewChatNote:"\u6BCF\u6B21\u6253\u5F00\u4E00\u4E2A\u65B0\u7684\u7A7A\u5BF9\u8BDD\u9875\u65F6\u518D\u64AD\u4E00\u6B21\u5F00\u5C4F\u3002\u9ED8\u8BA4\u5173\u95ED\uFF0C\u56E0\u4E3A\u8FDE\u7EED\u65B0\u5EFA\u5BF9\u8BDD\u65F6\u5B83\u4F1A\u53CD\u590D\u6253\u65AD\u3002"};var ke="@lionad/dsh-client-ui-skin-ascii-rest",Ve="data-dsh-ascii-rest",wt="ascii-rest",vt="dsh-skin-ascii-rest";var wn=["slots","theme"],la="data-ascii-rest-gui",fa="./client.gui.js",bn=`${ke}/skin.css`,Ze={zh:mn,en:gn};function da(e,t){if(e.querySelector(`style[data-plugin-css=${JSON.stringify(bn)}]`)!==null)return()=>{};let a=e.createElement("style");return a.dataset.plugin=ke,a.dataset.pluginCss=bn,a.textContent=t,e.head.append(a),()=>a.remove()}function yn(e){let t=e.querySelectorAll(`style[data-plugin=${JSON.stringify(ke)}]:not([data-plugin-css])`);for(let n of t)n.removeAttribute("data-plugin")}function vn(e){let t=document.body,n=t.ownerDocument,a=Qe(),o=_e()("react"),r=nn(a.scenes),s=r.get(),c=null,l=null,p=null,d=!1,m=null,y=null,E=null,P=null,x=null,C=0,M=e.get("theme"),A=e.get("locale"),_=e.get("slots"),L=(i,u)=>{console.warn(i,u)},T=()=>(A?.getSnapshot().active??"zh").startsWith("en")?Ze.en:Ze.zh,w=()=>{let i=s.scene;return a.scenes.find(u=>u.id===i)},k=i=>{if(x===null||i===void 0)return;let u=s.regions;if(W.every(G=>u[G]===1)){mt(x);return}let h={scene:i,surfaceOpacity:s.appearance.surface,lightMode:s.options.lightMode},g=hn(h,u),v=Me(n),$={};for(let G of W)$[G]=g[G]?.[v]??"";cn(x,$)},b=i=>{if(P?.(),P=null,M===void 0||i===void 0)return;let u={scene:i,surfaceOpacity:s.appearance.surface,lightMode:s.options.lightMode};P=M.overrideTokens(ke,pn(u)),k(i)},R=async i=>{let u=++C,h=a.scenes.find(v=>v.id===i.scene);if(c?.dispose(),c=null,b(h),h===void 0)return;let g;try{g=await Te(h.id)}catch(v){L(`ascii-rest: scene "${h.id}" did not load`,v);return}u===C&&(c=Ye({scene:h,module:g,pieceOptions:i.piece[h.id]??{},opacity:i.appearance.opacity,blur:i.appearance.blur,veil:i.appearance.veil,still:i.appearance.still,fps:i.appearance.fps,resolution:i.appearance.resolution,scrim:i.appearance.scrim,scrimAngle:i.appearance.scrimAngle,pauseOnBlur:i.appearance.pauseOnBlur,lightMode:i.options.lightMode,geometry:{fit:i.options.fit,anchor:i.options.anchor,zoom:i.options.zoom},onError:v=>{L("ascii-rest: the scene stopped drawing",v)}}),l!==null&&c.pause(),y?.rebuild(h,g,i.piece[h.id]??{}))},f=()=>{y?.destroy(),y=null,E?.remove(),E=null},O=async()=>{if(y!==null)return;let i=a.scenes.find(g=>g.id===s.scene);if(i===void 0)return;let u;try{u=await Te(i.id)}catch(g){L("ascii-rest: cannot open the panel without a scene",g);return}let h;try{h=await _e().async(fa)}catch(g){L("ascii-rest: the tuning panel did not load",g);return}E=n.createElement("div"),E.setAttribute(la,""),t.append(E),y=h.createGui(E,{catalog:a.scenes,scene:i,settings:s,module:u,callbacks:{onPiece:g=>{r.update(v=>({...v,piece:{...v.piece,[v.scene]:{...v.piece[v.scene]??{},...g}}}))},onAppearance:g=>{r.update(v=>({...v,appearance:{...v.appearance,...g}}))},onRegions:g=>{r.update(v=>({...v,regions:{...v.regions,...g}}))},onPlacement:g=>{r.update(v=>({...v,options:{...v.options,...g}}))},onScene:g=>{r.update(v=>({...v,scene:g}))},onSave:()=>r.set(s),onClose:()=>f()},closeLabel:T().closePanel})},N=()=>{let[i,u]=o.useState(s);return o.useEffect(()=>r.subscribe(u),[]),Wt({catalog:a.scenes,settings:i,React:o,copy:T(),loadPreview:h=>Te(h),onScene:h=>r.update(g=>({...g,scene:h})),onAppearance:h=>r.update(g=>({...g,appearance:{...g.appearance,...h}})),onPlacement:h=>r.update(g=>({...g,options:{...g.options,...h}})),onRegions:h=>r.update(g=>({...g,regions:{...g.regions,...h}})),onSplash:h=>r.update(g=>({...g,splash:h})),onSplashOnNewChat:h=>r.update(g=>({...g,splashOnNewChat:h})),onOpenPanel:()=>{O()},onReset:()=>r.reset()})},F=i=>{l===null&&(l=tn({doc:n,scene:i,module:Te(i.id),pieceOptions:s.piece[i.id]??{},lightMode:s.options.lightMode,still:s.appearance.still,fps:s.appearance.fps,resolution:s.appearance.resolution,onEnd:()=>{l=null,c?.resume(),B()},onError:u=>{l=null,L("ascii-rest: the splash did not start",u),c?.resume(),B()}}),c?.pause())},B=()=>{d=!0,m!==null&&(clearInterval(m),m=null)},q=()=>{p===null&&(p=Kt({doc:n,enabled:()=>s.splashOnNewChat,armed:()=>d,busy:()=>l!==null,onOpen:()=>{let i=w();i!==void 0&&F(i)}}))},z=da(n,an);if(t.setAttribute(Ve,""),R(s),s.splash){let i=w();i!==void 0&&n.querySelector("[data-dsh-boot]")!==null&&F(i)}d||(n.querySelector("[data-dsh-boot]")===null?B():m=setInterval(()=>{n.querySelector("[data-dsh-boot]")===null&&B()},50)),q(),e.effect(()=>()=>{C+=1,f(),p?.dispose(),p=null,m!==null&&(clearInterval(m),m=null),l?.dispose(),l=null,c?.dispose(),c=null,P?.(),P=null,z(),t.removeAttribute(Ve)},"ascii-rest: release the skin"),e.effect(()=>(yn(n),()=>{yn(n)}),"ascii-rest: release styles claimed by the loader"),e.effect(()=>r.subscribe(i=>{let u=s;s=i;let h=a.scenes.find(g=>g.id===i.scene);if(i.scene!==u.scene){R(i);return}b(h),c?.restyle({opacity:i.appearance.opacity,blur:i.appearance.blur,veil:i.appearance.veil,still:i.appearance.still,fps:i.appearance.fps,resolution:i.appearance.resolution,scrim:i.appearance.scrim,scrimAngle:i.appearance.scrimAngle,pauseOnBlur:i.appearance.pauseOnBlur}),c?.relayout({fit:i.options.fit,anchor:i.options.anchor,zoom:i.options.zoom})}),"ascii-rest: follow the settings");let S=()=>{(x===null||!yt(x))&&(x!==null&&bt(x),x=rn(n),x!==null&&sn(x)),k(w())};e.effect(()=>{let i=new MutationObserver(()=>{c?.rescheme(),k(w())});i.observe(n.body,{attributes:!0,attributeFilter:["data-ds-dark-theme"]});let u=!1,h=()=>{u||(u=!0,requestAnimationFrame(()=>{u=!1,!(x!==null&&yt(x))&&S()}))},g=new MutationObserver(h);g.observe(n.body,{childList:!0,subtree:!0});let v=()=>c?.relayout();return window.addEventListener("resize",v),S(),()=>{i.disconnect(),g.disconnect(),window.removeEventListener("resize",v),x!==null&&bt(x),x=null}},"ascii-rest: follow the scheme, the shell and the window"),A!==void 0&&e.effect(()=>A.register(vt,{zh:Ze.zh,en:Ze.en}),"ascii-rest: locale dictionaries"),_!==void 0&&_.inject("settings.section",()=>_.register({name:"settings.section",id:wt,order:116,label:()=>T().navLabel},N))}function ua(e){Gt(e)}

module.exports.boot(require);
    return module.exports;
  }
});
