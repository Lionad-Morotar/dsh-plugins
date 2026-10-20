window.__ModuleLoader__.load({
  id: "@lionad/dsh-client-ui-skin-ascii-rest",
  factory: (require) => {
    var module = { exports: {} };
    var exports = module.exports;
    "use strict";var De=Object.defineProperty;var rn=Object.getOwnPropertyDescriptor;var on=Object.getOwnPropertyNames;var sn=Object.prototype.hasOwnProperty;var pt=(e,t)=>{for(var n in t)De(e,n,{get:t[n],enumerable:!0})},cn=(e,t,n,a)=>{if(t&&typeof t=="object"||typeof t=="function")for(let r of on(t))!sn.call(e,r)&&r!==n&&De(e,r,{get:()=>t[r],enumerable:!(a=rn(t,r))||a.enumerable});return e};var ln=e=>cn(De({},"__esModule",{value:!0}),e);var qn={};pt(qn,{apply:()=>an,boot:()=>Un,inject:()=>nn});module.exports=ln(qn);var ut=e=>typeof e=="number"&&Number.isInteger(e)&&e>0,gt=e=>typeof e=="string"&&/^#[0-9a-f]{6}$/i.test(e),fn=/^[a-z0-9][a-z0-9-]*$/;function mt(e){if(typeof e!="object"||e===null)return null;let t=e,{id:n,name:a,note:r,cols:o,rows:s,cell:i,fps:l,ground:f,palette:g,still:p,loop:x}=t;if(typeof n!="string"||!fn.test(n)||typeof a!="string"||a===""||typeof r!="string"||!ut(o)||!ut(s)||i!==1&&i!==2||typeof l!="number"||!Number.isFinite(l)||l<0||!gt(f)||!Array.isArray(g)||g.length===0||!g.every(gt)||typeof p!="number"||!Number.isFinite(p)||p<0||x!==void 0&&(typeof x!="number"||!Number.isFinite(x)||x<=0))return null;let z={id:n,name:a,note:r,cols:o,rows:s,cell:i,fps:l,ground:f,palette:g,still:p};return x===void 0?z:{...z,loop:x}}function Ue(e){let t=typeof e=="object"&&e!==null?e:{},n=typeof t.source=="object"&&t.source!==null?t.source:{},a=Array.isArray(t.scenes)?t.scenes:[],r=[],o=new Set;for(let s of a){let i=mt(s);i===null||o.has(i.id)||(o.add(i.id),r.push(i))}return{source:{repository:typeof n.repository=="string"?n.repository:"unknown",commit:typeof n.commit=="string"?n.commit:"unknown",packageVersion:typeof n.packageVersion=="string"?n.packageVersion:"unknown"},scenes:r}}var bt={repository:"bas3line/ascii",commit:"c556be4284a97599f78197c09ba744ad11c0145e",packageVersion:"0.4.0"},ht=[{id:"alpine-dawn",name:"alpine dawn",note:"snow peaks catching first light above a still, misty mountain lake",cols:200,rows:100,cell:1,fps:15,ground:"#090c18",palette:["#0e1430","#151d40","#1d2752","#263365","#314179","#3e508c","#4f62a0","#6577b3","#8090c4","#9eaad3","#bec6e2","#4b3e6c","#6a5482","#8c6a92","#b0829c","#cf96a4","#e8a9a8","#f5bcaa","#ffd0b0","#ffe2c2","#fff1e0","#fdfaf6","#ffc887","#f7a965","#f2a08f","#e58a87","#f8b59d","#d97b7e","#7a4c4a","#a5654f","#523a4a","#1b2034","#262c45","#363c59","#0a1418","#0f1f24","#162a2f","#203a3c","#a3a7c6","#c6c3d8","#e0d4dc","#5a4f7e","#7b6c9c","#9a8cb6","#b8a8c8","#d8bccb"],still:0},{id:"amer-fort",name:"amer fort",note:"amer fort floodlit gold on its hill, mirrored in maota lake at night",cols:200,rows:100,cell:1,fps:15,ground:"#060915",palette:["#0a1230","#101a40","#16234f","#1e2e62","#283c78","#364d8e","#4a5f9f","#6a7fb8","#c9d4ee","#eef1f8","#fff6dc","#3a220f","#5a3415","#7d4a1c","#a06426","#c27f32","#dc9c44","#ecb85c","#f6d07e","#ffe4a6","#fff1cc","#0b0f1c","#121829","#1a2236","#2a2228","#4a3a2c","#4c6e34","#6f9448","#8fbf5a","#b4dc7c","#a08a62"],still:0},{id:"aurora-fjord",name:"aurora fjord",note:"aurora curtains rippling over a still fjord, a cabin lit on the shore",cols:200,rows:100,cell:1,fps:15,ground:"#05080f",palette:["#0b1322","#101b30","#16243f","#1e3050","#2a3f63","#0e3a33","#11573f","#167a4c","#22a05c","#3ccb73","#7cf0a0","#c8ffdc","#0f5f5c","#16877f","#2cb5a6","#7fe6d6","#2a1f52","#432b78","#6a3c9f","#9558c6","#c48ae4","#363a72","#4f5596","#1b4f63","#1a2236","#283350","#3b4a6e","#566a92","#7d91b8","#a9bad9","#d6e0f2","#9fc9cf","#0f1a1c","#173128","#24493a","#4a1517","#7c2420","#b23a2a","#d65aa8","#ffd27c","#ffb04a","#fff2c4","#eef3ff"],still:0},{id:"black-prism",name:"black prism",note:"the vercel triangle as a glass prism, splitting white light to a rainbow",cols:200,rows:100,cell:1,fps:15,ground:"#000000",palette:["#161616","#242424","#363636","#4a4a4a","#636363","#7e7e7e","#9c9c9c","#bcbcbc","#dcdcdc","#ffffff","#ff2a3c","#9a1c28","#ff7417","#a04a10","#ffdf2e","#a08c1c","#38f56a","#1f9a42","#24dcff","#16879e","#3a64ff","#233f9e","#9a4cff","#5f2f9e","#fff4c8","#d4f6ff","#ffd2d6"],still:0},{id:"cloud-sea",name:"cloud sea",note:"the sun sinks into a drifting sea of orange cloud at dusk",cols:200,rows:100,cell:1,fps:15,ground:"#0e0e0f",palette:["#0e0e0f","#161617","#1f1f20","#2a2a2b","#353536","#404041","#545456","#6c6c6e","#8a8a8c","#a39a94","#2c211c","#43302a","#5e3c2a","#7c4826","#9c521f","#c2601c","#dc6f1e","#f38020","#f6922e","#faae40","#fbbd5c","#fccb7c","#fdda9e","#feeac4","#fff6e6"],still:0},{id:"command-city",name:"command city",note:"a night city whose boulevards trace the command key in streetlight",cols:200,rows:100,cell:1,fps:15,ground:"#060607",palette:["#101012","#17171a","#1f1f23","#29292e","#34343a","#414148","#505058","#62626a","#76767e","#8c8c93","#a4a4aa","#bdbdc2","#d6d6da","#ececef","#ffffff","#3a2a1c","#5a3c20","#7e5224","#a86a2a","#cf8433","#ee9e45","#ffb860","#ffcf88","#ffe4b4","#fff3dc","#c9d3e6","#8d99b0","#ff7a3a","#c0522a"],still:0},{id:"deep-reef",name:"deep reef",note:"light shafts, swaying kelp and a turning school of fish over a reef",cols:200,rows:100,cell:1,fps:15,ground:"#03101a",palette:["#114a66","#165c78","#1d708a","#27869b","#3a9fae","#58b9c0","#80d2d2","#b0e8e2","#e2fbf5","#5e6b62","#87927f","#aab39a","#cfd2b4","#38461a","#5a6420","#857f2a","#b0a03c","#d6c25a","#efe08e","#8e3355","#c4506a","#e0786e","#f0a070","#6a3a78","#9a5aa8","#c88ad0","#6f8a98","#9fb8c6","#cfe3ea"],still:0},{id:"desert-night",name:"desert night",note:"the milky way over a lone acacia on moonless dunes, meteors falling",cols:200,rows:100,cell:1,fps:15,ground:"#04060c",palette:["#0a1024","#101830","#16213f","#1e2b50","#283864","#34477a","#45598f","#5a6fa6","#7488bd","#93a5d2","#b6c3e4","#d8e0f2","#f4f6fb","#fff3dc","#ffe2b4","#f5c98e","#e2a86e","#c4864f","#9c6440","#74492f","#2a2230","#3d2f3a","#56404a","#735358","#946a62","#b6836c","#4a3b48","#6b5562","#8a6f7a","#a88590","#c9a3a3","#e2bfb4","#2a2448","#3d3466","#57498a","#7a68a8","#ffd8a8","#cfe0ff","#a9c4ff","#ff9a52","#e07a3e","#0d0f1a","#151827"],still:0},{id:"earthrise",name:"earthrise",note:"the earth rising over a cratered lunar horizon in long low sunlight",cols:200,rows:100,cell:1,fps:15,ground:"#030408",palette:["#18181b","#232326","#303033","#414143","#555556","#6b6a69","#83817d","#9c9993","#b6b2aa","#cfcac1","#e6e1d8","#f7f4ee","#0c1120","#131a2e","#1b2540","#262f4a","#dfe9ff","#0a2259","#0f2f72","#15408c","#1d53a6","#2a69bf","#4386d3","#6eaeea","#a8d3f6","#e8f0fa","#c2d0e3","#8b9fbc","#2f4a26","#3b5a2c","#5b7238","#7a9150","#77783f","#8f8550","#a8955e","#6b5634","#b9774a","#8a4838"],still:0},{id:"edge-orbit",name:"edge orbit",note:"the night earth from orbit, cloudflare requests arcing city to city",cols:200,rows:100,cell:1,fps:15,ground:"#04060c",palette:["#080c18","#0d1529","#152142","#1e2f5c","#2b4479","#40609c","#7d9cd2","#b8cdee","#181d27","#252b37","#404041","#5c6578","#2e1608","#4f2410","#7a3812","#a94f16","#d0661a","#f38020","#faae40","#3d2a0e","#6b4a16","#a57524","#d49434","#ffd68a","#ffe8c0","#fff6e8","#ffffff"],still:0},{id:"gangaur-ghat",name:"gangaur ghat",note:"udaipur at night, a lit gateway on lake pichola and diyas on the water",cols:200,rows:100,cell:1,fps:15,ground:"#070a18",palette:["#0a1230","#0f1a40","#152352","#1c2e66","#253a7a","#30498e","#3e5aa2","#0c0f1e","#161a30","#232842","#4a5a86","#6474a0","#8291b8","#a3afcf","#c6cee3","#e6ebf5","#fff6dc","#ffe6a8","#ffd277","#ffb84a","#f29a34","#d8782a","#a85a26","#7a4224","#e8c48c","#c89a62","#9a7048","#6a4c38","#3e2c2a","#dfe6ff"],still:0},{id:"green-storm",name:"green storm",note:"a thunderstorm at sea, the lightning striking in the supabase bolt",cols:200,rows:100,cell:1,fps:15,ground:"#0e0e0e",palette:["#1c1c1c","#242424","#2e2e2e","#3a3a3a","#4a4a4a","#5e5e5e","#777777","#939393","#b4b4b4","#d6d6d6","#1d2a24","#243a30","#2d4d3e","#3a6450","#4d8066","#67a084","#0f3324","#14472f","#1a5e3e","#22784f","#2c9663","#36b578","#3ecf8e","#65dba5","#8fe6be","#bdf2d8","#e6fbf1","#ffffff"],still:0},{id:"jal-mahal",name:"jal mahal",note:"the jaipur water palace floating on a misty lake at sunrise",cols:200,rows:100,cell:1,fps:15,ground:"#16141f",palette:["#3e4a6b","#56628a","#7180a6","#8e9cc0","#aab6d4","#c6cfe3","#e2e7f1","#6b4a66","#8a5f7c","#a87891","#c895a6","#e2b4bd","#f2d0d0","#fff3d6","#ffe3a6","#f6c87a","#e8a865","#c98552","#5a3e3a","#7d5848","#a47a5e","#c99d78","#e4c29c","#2a2f45","#3a3550","#4d4660","#4a3226","#6e4a32","#fbfaf7"],still:0},{id:"jungle-falls",name:"jungle falls",note:"a tiered waterfall in a rainforest gorge, spray, a rainbow and macaws",cols:200,rows:100,cell:1,fps:15,ground:"#07130d",palette:["#0d2616","#173d1f","#225a26","#2f7a2c","#45983a","#6bb544","#9ccf55","#c9e27a","#2a3436","#465256","#6c7676","#9aa29c","#f7fcfc","#d6eef0","#a8dcdf","#6cc5c6","#35aeb0","#1d8b92","#11636c","#c9e6ef","#93c9e2","#fff1c2","#f2cf6b","#e5483b","#f08c34","#3d84d6","#8b6bd0","#a92d25","#5b8f7a","#8fb8a0","#5e4a36"],still:6},{id:"kite-festival",name:"kite festival",note:"sankranti kites crowding a golden sky over the pink roofs of jaipur",cols:200,rows:100,cell:1,fps:15,ground:"#1a0f17",palette:["#6a5af0","#8a78d0","#c08cc8","#f0a0c0","#ffab7a","#ffc25e","#ffdc8c","#fff6dc","#9c7ae0","#7a62c4","#b89ae8","#ff5f58","#ff8478","#ffaa9c","#ffd6c4","#ff2f7d","#ff8fc4","#ffd400","#22c55e","#a3e635","#e8102a","#1f6fff","#5ec8ff","#8b3dff","#ffffff","#ff7a00"],still:0},{id:"kyoto-dusk",name:"kyoto dusk",note:"a pagoda at dusk behind a cherry tree lit by a stone lantern",cols:200,rows:100,cell:1,fps:15,ground:"#0b0a16",palette:["#1c1d4a","#262759","#33316b","#433d7c","#574a8c","#6e5a9a","#8a5a92","#a8668f","#c4748f","#db8a95","#ec9f9c","#f6b8a8","#fbd0b8","#fff1d8","#fffaf0","#7e5f9e","#f9d3dc","#f2b2c4","#e28fab","#c66e92","#9c5279","#74405f","#ffd9a0","#ffbb6a","#f29a4a","#d0763a","#a35a35","#2a2240","#3a2c50","#4a3860","#5b4f86","#7a6aa0","#2c3a3a","#3d4c46","#56604f","#9a6aa0","#b47ea6","#4a3038","#6a4448","#2b3a6a","#3e4f86"],still:0},{id:"lake-pichola",name:"lake pichola",note:"sunset on lake pichola, udaipur's palaces glowing over the water",cols:200,rows:100,cell:1,fps:15,ground:"#120a1a",palette:["#1c1028","#2a1840","#3d2058","#55286a","#6e3178","#8a3c7c","#a8477a","#c85a6e","#e0704e","#f08a40","#f8a840","#ffc65a","#ffe08a","#fff2c8","#fffaf0","#2b1c40","#3c2852","#4f3666","#6a4a7e","#9a7aa0","#f6e6d0","#e8cdb0","#d4a888","#b88a78","#8e6a6a","#6a4a58","#c88a9a","#ffd070","#ff9a3c","#b8323a","#140c1c"],still:0},{id:"lantern-lake",name:"lantern lake",note:"sky lanterns rising over a still mountain lake, one let go from a boat",cols:200,rows:100,cell:1,fps:15,ground:"#04060d",palette:["#141b30","#1c2a52","#22346a","#2a4080","#324c96","#3c58a8","#33306e","#433c88","#54449a","#62407e","#7a4a88","#934e86","#a4546e","#bc5e66","#d06a62","#dc7650","#e88444","#f09238","#d4581a","#ea6c1e","#f78226","#ff9530","#ffa83c","#ffbb4e","#ffcc66","#ffdc86","#ffe8a8","#fff3cf","#fffbec","#b8341a","#d84420","#2f3748","#4f586c","#5e5a7e","#7a6a8c","#5a3220","#7c4628","#4a5578","#5d6a92","#7381ab","#c4cdec","#e4e9fb","#ffffff"],still:0},{id:"lava-wall",name:"lava wall",note:"a wall of lava lamps under the glowing orange cloud, watched by a camera",cols:200,rows:100,cell:1,fps:15,ground:"#08070a",palette:["#16121a","#221c22","#33282a","#4a3a32","#6e5442","#9a7658","#404041","#707074","#a9a9ae","#e8e4de","#5c1616","#9e211d","#dc362b","#ff6a52","#7c3510","#c4570f","#f38020","#faae40","#ffd27c","#fff1c8","#e6c02a","#0f3a3c","#18786f","#43d6c0","#2f1842","#6b2f92","#b45ddc","#e2508c","#1d3768","#3f80d2"],still:0,loop:30},{id:"marine-drive",name:"marine drive",note:"mumbai's queen's necklace at night, lamps curving round the bay",cols:200,rows:100,cell:1,fps:15,ground:"#07080f",palette:["#18213f","#202c55","#2a396d","#374a88","#4a60a2","#6880bc","#2c2140","#3f2d58","#56396b","#6e4a7a","#8a5f88","#5a2e3c","#7b404c","#9e5858","#55300f","#7d4515","#a95c1b","#d27a24","#ee9631","#ffb246","#ffcd6a","#ffe39c","#fff2cf","#ffffff","#dce6ff","#a9bde8","#6a181b","#b22a28","#ff4b3e","#132c38","#1c3f4f","#2a5868","#29283a","#3c3a4c","#565266","#79738a"],still:0},{id:"misty-forest",name:"misty forest",note:"pine ridges fading into morning fog, sunbeams slanting through",cols:200,rows:100,cell:1,fps:15,ground:"#090f0e",palette:["#fffbea","#fff0c8","#fbe2a6","#f2c97e","#e0a95e","#b9834a","#e4ebe6","#cbe0dc","#a8d2d0","#86c0c2","#68a7ac","#4f8c93","#3b7078","#557570","#456761","#365952","#2a4a44","#1f3c37","#172f2b","#11231f","#a4a35a","#8a8f4c","#6d7440","#4d5530","#7a5a3a","#5b4532","#a9c3cc","#8eadb8","#6f93a2","#53798a","#3d6172","#2b4a5a"],still:0},{id:"night-coast",name:"night coast",note:"a lighthouse turning its beam under moonlit clouds over a dark sea",cols:200,rows:100,cell:1,fps:15,ground:"#080b12",palette:["#15203d","#1b2a50","#223463","#2b4077","#364e8b","#445f9f","#5874b2","#7089c0","#8a9cc4","#a3b1cf","#bec9dc","#d8dfea","#eef1f6","#f7f8fc","#ffe9ae","#ffd27c","#f3a64a","#c46c2d","#121c1b","#182724","#203530","#2c473d","#3c5c4c","#232a36","#363e4c","#555d6c","#2a3550","#3a4868","#9c4136","#ff5d4d"],still:0},{id:"night-highway",name:"night highway",note:"a desert highway at dusk, rushing toward the mountains and last light",cols:200,rows:100,cell:1,fps:15,ground:"#07080f",palette:["#0d1226","#141b38","#1c264c","#263463","#34457a","#4a5d96","#6b7fb3","#9aa8d0","#cdd5ea","#f4f6fc","#2a1d45","#43285e","#643474","#8a4683","#b85a78","#e0766a","#f59a5c","#ffc477","#ffe6b0","#16161e","#24232d","#383744","#55535f","#7a1622","#d42a32","#ff6a5c","#d9b44a","#3fd6c8","#fff4d8","#3a2a2a"],still:0,loop:12},{id:"ocean-sunset",name:"ocean sunset",note:"the sun sets past a pine headland, lit cloud, glitter on rolling sea",cols:200,rows:100,cell:1,fps:15,ground:"#0b0817",palette:["#140f2c","#1e1640","#2b1c52","#3d2266","#552a74","#6e2c78","#90327c","#b23c7c","#d24f7a","#ea6a78","#c2306a","#ff5d8f","#ff8a9a","#7a2456","#f05d5e","#f2804f","#f99a43","#ffb44a","#ffcd62","#ffe39a","#fff5d8","#a8323c","#d2453c","#e8603e","#2f1a3e","#47234f","#63305c","#874266","#ac5b70","#ff9e86","#ffc4a2","#ffdcc0","#0e1230","#171a46","#232059","#33286a","#4a2f78","#1c2a5c","#2e4078","#7d3f8f","#a24f98","#c8649e","#de8bb5"],still:0},{id:"planet-scale",name:"planet scale",note:"a dark planet cut into the planetscale mark, backlit, a moon circling",cols:200,rows:100,cell:1,fps:15,ground:"#050505",palette:["#101010","#181818","#202020","#282828","#303030","#3a3a3a","#444444","#4e4e4e","#585858","#636363","#6e6e6e","#797979","#858585","#919191","#9d9d9d","#a9a9a9","#b5b5b5","#c1c1c1","#cccccc","#d7d7d7","#e1e1e1","#eaeaea","#f3f3f3","#ffffff"],still:0},{id:"prism-city",name:"prism city",note:"a black spire and an orange cloud over a blue hour city and its river",cols:200,rows:100,cell:1,fps:15,ground:"#06080f",palette:["#111a33","#16213f","#1c2a50","#233463","#2b4077","#364e8b","#445f9f","#5874b2","#7089c0","#8a9cc4","#a3b1cf","#c8d2e4","#eef1f6","#ffffff","#ffe9ae","#ffd27c","#4a2a2a","#6e3a24","#9a4a1c","#c85f17","#f38020","#f8a040","#fbc06e","#ffdca6","#3a3352","#544766","#0e1220","#1a2030","#283044","#9c2a26","#ff4b3e"],still:0},{id:"salt-flat",name:"salt flat",note:"the vercel triangle over a mirror of salt, the sun rising behind its tip",cols:200,rows:100,cell:1,fps:15,ground:"#000000",palette:["#0d0d0e","#161617","#1f1f21","#2a2a2c","#363638","#444446","#555557","#69696b","#808082","#9a9a9c","#b8b8ba","#d8d8da","#ffffff","#50e3c2","#0070f3","#7928ca","#ff0080","#ff4d4d","#f9cb28","#b0f2e3","#8cbcf9","#bb94e4","#ff8cc0","#ffa6a6","#fce59a","#24665a","#00326d","#36125b","#73003a","#732323","#705b12"],still:0},{id:"saturn-rise",name:"saturn rise",note:"saturn and its rings hanging over the cracked ice and geysers of a moon",cols:200,rows:100,cell:1,fps:15,ground:"#04050a",palette:["#0b0d14","#161922","#252935","#3a3f4c","#3b2a1a","#5c4027","#7f5a35","#a37645","#c4925a","#dcae74","#ecc893","#f6e0b8","#6b6a6c","#8a8070","#b3a892","#d8cfba","#7f8a96","#0e1a2e","#15284a","#1f3a66","#2c5085","#3f6aa3","#5e8bbf","#89afd6","#b6d0ea","#ddebf8","#2a7fb0","#56b3dc","#ffffff","#fff0c8"],still:0},{id:"snow-train",name:"snow train",note:"a lit train crossing a snowy stone viaduct at night as snow falls",cols:200,rows:100,cell:1,fps:15,ground:"#070b16",palette:["#0c1428","#121d38","#19284a","#22345e","#2d4374","#3b548a","#4d68a0","#6480b4","#7f99c6","#9db3d6","#bccde4","#d9e4f1","#f1f5fb","#ffe7b0","#ffc56e","#f29a3c","#b8642a","#6e3a22","#3e1420","#6a1e26","#9a2c2e","#ff4a3d","#0b1a1e","#11262a","#1a3436","#26474a","#1e2230","#2c3242","#3e4658","#586276","#7c8698"],still:0},{id:"storm-plains",name:"storm plains",note:"an anvil thunderhead at dusk flickering over a wheat field",cols:200,rows:100,cell:1,fps:15,ground:"#0b0912",palette:["#0f0c20","#141029","#1c1638","#261c4a","#32235a","#40306c","#53407e","#6a5590","#8670a6","#7a6288","#9a7890","#b98e94","#e6a890","#f2bca8","#f7d6a8","#fbe8c6","#f8b070","#e88a4c","#c8643a","#9a4630","#6a3226","#f0c868","#d8a447","#b7843a","#8c6230","#5e4226","#3a2a1c","#261c14","#181a2c","#2a3048","#3a4260","#4f5878","#6a7392","#8890ae","#a2aabd","#5d5878","#7c7598","#a6a2c8","#d6d2fa","#f4f2ff","#ffe08a","#ffb84a"],still:0},{id:"taj-dawn",name:"taj dawn",note:"the taj mahal at sunrise, mirrored in its pool through morning haze",cols:200,rows:100,cell:1,fps:15,ground:"#0d0a13",palette:["#2e2a55","#3d3870","#514a8a","#6a62a3","#8a83bd","#5a3a5e","#7a4d72","#9a6284","#b97a92","#d495a2","#b8705a","#d98d66","#efab78","#f8c98e","#ffe2ae","#fff3d8","#fffcf2","#8e7f9e","#ad9cb4","#cbb6c4","#e3cdd2","#f3e0dc","#2a4a3e","#36584a","#4a6c58","#66845f","#8a9a68","#8a4a3e","#b0624a","#3a2f4a","#4e3d5a","#f6d6c0","#e9bfae","#5e6a40","#7d8a52","#a3a064","#c2b274"],still:0},{id:"tokyo-rain",name:"tokyo rain",note:"a tokyo side street in the rain, neon signs shining on the wet road",cols:200,rows:100,cell:1,fps:15,ground:"#07060d",palette:["#100f22","#17162f","#201e3d","#2b284e","#383463","#4a447a","#4c4890","#6a64c4","#1d1520","#2c1f2e","#3e2b3e","#553a52","#6a3a74","#8e4c8a","#b4649c","#d885ae","#6e1248","#a3196c","#d8278c","#ff47a8","#ff85c6","#ffc4e3","#0c4656","#106f80","#16a0b2","#28d2e2","#7cecf4","#ccfbfd","#5e340a","#93540f","#cc7b16","#f7a32a","#ffc65e","#ffe2a0","#fff4d8","#55100e","#8a1a14","#c22a1a","#ee4626","#ff7a4c","#8ea2c4","#bccbe6","#e4ecfb","#ffffff","#2e62e0","#79a2ff","#20844c","#43d884","#e6c21e","#fff07a","#6a7896","#9ba7c2","#c9d0e2","#262a36","#3a3f4e","#565c6c"],still:0},{id:"varanasi-ghats",name:"varanasi ghats",note:"dusk aarti on the ganga, lamps on the steps and diyas on the water",cols:200,rows:100,cell:1,fps:15,ground:"#0b0812",palette:["#141230","#1d1a42","#272257","#332b6a","#45357a","#5a4388","#7259a8","#6d3a73","#8a4677","#a8527a","#c4607a","#d97a92","#b866a0","#9a68c8","#c868b0","#e8707a","#d9705f","#e88552","#f29f4a","#f8b85a","#fcd07a","#ffe3a6","#fff2d2","#1a1220","#24182a","#301f33","#3f2838","#523340","#3a2c4c","#4d3a64","#5e3524","#7d4527","#a0582a","#c06e2e","#d98a46","#ffffff","#fff6d8","#ffd860","#ff9f2a","#f06a1e","#c8401a","#8a2a16","#0f1a2c","#162540","#20325a","#d6d4ee"],still:0},{id:"volcano-night",name:"volcano night",note:"a volcano erupting at night, lava rivers, an ash plume full of lightning",cols:200,rows:100,cell:1,fps:15,ground:"#070405",palette:["#5a1a10","#7a2410","#982e0e","#b8380b","#d4480b","#ea5e10","#f77a18","#ff9628","#ffb244","#ffcc63","#ffe28c","#fff3c0","#fffcec","#4a3a37","#63504b","#7d6863","#98827b","#b39d94","#cdb9af","#8a4a3a","#a85a40","#c87048","#3c4258","#5d6280","#8a90b4","#b4b9dc","#dfe2f7","#b9a8ff","#f4f0ff","#1a1012","#2c1a18"],still:0}];var yt;function qe(){return yt??=Ue({source:bt,scenes:ht}),yt}var Re={min:.3,max:.92};function Pe(e){let t=e.trim();if(!t.startsWith("#"))return null;let n=t.slice(1).toLowerCase();if(n.length===3){let a=n.split(""),r=a[0],o=a[1],s=a[2];if(r===void 0||o===void 0||s===void 0)return null;let i=f=>Number.parseInt(f+f,16),l={r:i(r),g:i(o),b:i(s)};return Number.isNaN(l.r)||Number.isNaN(l.g)||Number.isNaN(l.b)?null:l}if(n.length===6){if(!/^[0-9a-f]{6}$/.test(n))return null;let a=Number.parseInt(n,16);return{r:a>>16&255,g:a>>8&255,b:a&255}}return null}var Ke=e=>Math.max(0,Math.min(255,Math.round(e))).toString(16).padStart(2,"0");function vt({r:e,g:t,b:n}){return`#${Ke(e)}${Ke(t)}${Ke(n)}`}function xt({r:e,g:t,b:n}){let a=e/255,r=t/255,o=n/255,s=Math.max(a,r,o),i=Math.min(a,r,o),l=(s+i)/2;if(s===i)return{h:0,s:0,l};let f=s-i,g=l>.5?f/(2-s-i):f/(s+i),p;return s===a?p=((r-o)/f+(r<o?6:0))*60:s===r?p=((o-a)/f+2)*60:p=((a-r)/f+4)*60,{h:p,s:g,l}}function St({h:e,s:t,l:n}){let a=(e%360+360)%360,r=Math.max(0,Math.min(1,t)),o=Math.max(0,Math.min(1,n));if(r===0){let f=o*255;return{r:f,g:f,b:f}}let s=o<.5?o*(1+r):o+r-o*r,i=2*o-s,l=f=>{let g=(f/360+1)%1;return g<1/6?i+(s-i)*6*g:g<1/2?s:g<2/3?i+(s-i)*(2/3-g)*6:i};return{r:l(a+120)*255,g:l(a)*255,b:l(a-120)*255}}var dn=.7,pn=.5,wt=e=>e<0?0:e>1?1:e;function Ye(e,t={}){let n=Pe(e);if(n===null)return e;let a=wt(t.softness??dn),r=wt(t.saturation??pn),{h:o,s,l:i}=xt(n),l=1-i,f=Re.min+l*(Re.max-Re.min),g=(Re.min+Re.max)/2,p=g+(f-g)*a;return vt(St({h:o,s:s*r,l:p}))}function kt(e,t={}){return e.map(n=>Ye(n,t))}function re(e,t,n={}){return t==="dark"?e:Ye(e,{softness:1,saturation:0,...n})}function pe(e,t,n={}){return t==="dark"?e:kt(e,n)}var Ne=["top-left","top","top-right","left","center","right","bottom-left","bottom","bottom-right"],Te=["cover","contain"];function Ze(e){return typeof e=="string"&&Te.includes(e)}function Xe(e){return typeof e=="string"&&Ne.includes(e)}function Rt(e){let[t,n]=e.split("-"),a=e==="top"||e==="center"||e==="bottom"?"center":n??t,r=e==="left"||e==="center"||e==="right"?"center":t,o=s=>s==="left"||s==="top"?-1:s==="right"||s==="bottom"?1:0;return{x:o(a),y:o(r)}}var un=e=>e!==void 0&&Number.isFinite(e)&&e>0?e:1,Et=e=>e===0?0:e;function Je(e,t,n,a={}){let{cols:r,rows:o,cell:s}=e;if(!(t>0)||!(n>0)||r<=0||o<=0)return{width:0,height:0,left:0,top:0,cellSize:0};let i=un(a.zoom),l=t/r,f=n/(o*s),p=(a.fit==="contain"?Math.min(l,f):Math.max(l,f))*i,x=p*r,z=p*o*s,{x:S,y:N}=Rt(a.anchor??"center"),B=(t-x)*(1+S)/2,u=(n-z)*(1+N)/2;return{width:x,height:z,left:Et(Math.round(B)),top:Et(Math.round(u)),cellSize:p}}var X=["sidebar","main","rightbar","bottom"],be={softness:.55,saturation:.5,fit:"cover",anchor:"center",zoom:1},ne={opacity:1,surface:1,blur:0,veil:.12,scrim:0,scrimAngle:180,still:!1,fps:15,pauseOnBlur:!0},_e={sidebar:1,main:1,rightbar:1,bottom:1},At={scene:"salt-flat",options:be,appearance:ne,regions:_e,piece:{}},Ve={min:0,max:30},gn=(e,t,n)=>e<t?t:e>n?n:e;function ae(e,t,n,a){return typeof e!="number"||!Number.isFinite(e)?t:gn(e,n,a)}function Mt(e,t){return typeof e=="boolean"?e:t}function Ct(e){let t=typeof e=="object"&&e!==null?e:{};return{softness:ae(t.softness,be.softness,0,1),saturation:ae(t.saturation,be.saturation,0,1),fit:Ze(t.fit)?t.fit:be.fit,anchor:Xe(t.anchor)?t.anchor:mn(t)??be.anchor,zoom:ae(t.zoom,be.zoom,.25,4)}}function mn(e){if(typeof e.offsetX!="number"&&typeof e.offsetY!="number")return null;let t=r=>typeof r!="number"||!Number.isFinite(r)?0:r<-.34?-1:r>.34?1:0,n=t(e.offsetX),a=t(e.offsetY);return n===0&&a===0?"center":a===0?n===-1?"left":"right":n===0?a===-1?"top":"bottom":`${a===-1?"top":"bottom"}-${n===-1?"left":"right"}`}function Ot(e){let t=typeof e=="object"&&e!==null?e:{};return{opacity:ae(t.opacity,ne.opacity,0,1),surface:ae(t.surface,ne.surface,0,1),blur:ae(t.blur,ne.blur,0,24),veil:ae(t.veil,ne.veil,0,1),scrim:ae(t.scrim,ne.scrim,0,1),scrimAngle:ae(t.scrimAngle,ne.scrimAngle,0,360),still:Mt(t.still,ne.still),fps:ae(t.fps,ne.fps,Ve.min,Ve.max),pauseOnBlur:Mt(t.pauseOnBlur,ne.pauseOnBlur)}}function Pt(e){let t=typeof e=="object"&&e!==null?e:{},n={..._e};for(let a of X)n[a]=ae(t[a],_e[a],0,1);return n}function we(e,t){let n=typeof e=="object"&&e!==null?e:{},a=n.scene;return{scene:typeof a=="string"&&(a===""||t.some(o=>o.id===a))?a:At.scene,options:Ct(n.options),appearance:Ot(n.appearance),regions:Pt(n.regions),piece:bn(n.piece)}}function bn(e){if(typeof e!="object"||e===null)return{};let t={};for(let[n,a]of Object.entries(e)){if(typeof a!="object"||a===null)continue;let r={};for(let[o,s]of Object.entries(a))(typeof s=="number"&&Number.isFinite(s)||typeof s=="boolean")&&(r[o]=s);Object.keys(r).length>0&&(t[n]=r)}return t}function Me(e,t){return e.scene===t.scene&&e.options.softness===t.options.softness&&e.options.saturation===t.options.saturation&&e.options.fit===t.options.fit&&e.options.anchor===t.options.anchor&&e.options.zoom===t.options.zoom&&e.appearance.opacity===t.appearance.opacity&&e.appearance.surface===t.appearance.surface&&e.appearance.blur===t.appearance.blur&&e.appearance.veil===t.appearance.veil&&e.appearance.scrim===t.appearance.scrim&&e.appearance.scrimAngle===t.appearance.scrimAngle&&e.appearance.still===t.appearance.still&&e.appearance.fps===t.appearance.fps&&e.appearance.pauseOnBlur===t.appearance.pauseOnBlur&&X.every(n=>e.regions[n]===t.regions[n])&&JSON.stringify(e.piece)===JSON.stringify(t.piece)}var We;function Nt(e){We=e}function Ae(){if(We===void 0)throw new Error("ascii-rest: the module loader is not installed");return We}function ze(e,t,n={}){let a=typeof t=="function"?t:t.default,r=typeof t=="function"?{}:t.meta,{fps:o=r.fps??30,motion:s=!1,...i}={...r.options,...n},l=a(i),{cols:f=80,rows:g=24,palette:p,ground:x,cell:z=2}=r,S=e instanceof HTMLCanvasElement?e:null,N=p&&S?new Uint8Array(f*g):void 0,B=m=>m[0]==="#"?[1,3,5].map(T=>Number.parseInt(m.slice(T,T+2),16)):(m.match(/[\d.]+/g)??[]).map(Number),u=m=>{let T=B(m);return .2126*(T[0]??0)+.7152*(T[1]??0)+.0722*(T[2]??0)<128},R=()=>({paper:S&&x?!u(x):!1,color:N}),_=!s&&typeof matchMedia=="function"&&matchMedia("(prefers-reduced-motion: reduce)").matches?r.still??0:0,A=()=>{},d;if(S){let m=D=>`${D}px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`,T=S.getContext("2d"),v=document.createElement("canvas"),y=v.getContext("2d");if(T===null||y===null)return yn();let k=new Map,M=0,$=0,I=0,q=0,K=0,F=0,G=-1,Z="",V=new Int32Array(0),te=new Int32Array(0),j=new Int32Array(0),P=new Int32Array(0),W="",Q=!0,me=N?new Uint8Array(f*g):void 0;S.style.display||="block",S.style.aspectRatio=`${String(f)} / ${String(g*z)}`;let le=()=>{G=S.clientWidth,M=G*(devicePixelRatio||1)/f,$=M*z,I=Math.ceil(M),q=Math.ceil($),K=I+2,F=q+2,S.width=Math.round(M*f),S.height=Math.round($*g),v.width=K*32,v.height=F*32,V=Int32Array.from({length:f+1},(D,Y)=>Math.round(Y*M)),te=Int32Array.from({length:g+1},(D,Y)=>Math.round(Y*$)),j=Int32Array.from({length:f},(D,Y)=>Math.round(Y*M+(M-I)/2)),P=Int32Array.from({length:g},(D,Y)=>Math.round(Y*$+($-q)/2)),k.clear(),Q=!0},ke=(D,Y)=>{let ie=D*256+Y,fe=k.get(ie);if(fe!==void 0)return fe;k.size===1024&&(y.clearRect(0,0,v.width,v.height),k.clear());let ce=k.size,ye=ce%32*K+1,de=Math.floor(ce/32)*F+1;return y.font=m(M/.6),y.textAlign="center",y.textBaseline="middle",y.fillStyle=p?.[Y]??p?.[0]??Z,y.save(),y.beginPath(),y.rect(ye-1,de-1,K,F),y.clip(),y.fillText(String.fromCharCode(D),ye+I/2,de+q/2),y.restore(),k.set(ie,ce),ce};A=()=>{!p&&getComputedStyle(S).color!==Z&&(Z=getComputedStyle(S).color,k.clear(),y.clearRect(0,0,v.width,v.height),Q=!0);let D=l(_,R());x&&(T.fillStyle=x),Q&&(x?T.fillRect(0,0,S.width,S.height):T.clearRect(0,0,S.width,S.height));for(let Y=0,ie=0,fe=0;Y<D.length;Y++){let ce=D.charCodeAt(Y);if(ce===10){ie=0,fe++;continue}let ye=fe*f+ie;if(Q||ce!==W.charCodeAt(Y)||N!==void 0&&me!==void 0&&N[ye]!==me[ye]){let de=V[ie]??0,Ee=te[fe]??0,Ce=(V[ie+1]??0)-de,Oe=(te[fe+1]??0)-Ee;if(Q||(x?T.fillRect(de,Ee,Ce,Oe):T.clearRect(de,Ee,Ce,Oe)),ce!==32){let dt=ke(ce,N?.[ye]??0);T.drawImage(v,dt%32*K+1+de-(j[ie]??0),Math.floor(dt/32)*F+1+Ee-(P[fe]??0),Ce,Oe,de,Ee,Ce,Oe)}}ie++}W=D,N!==void 0&&me?.set(N),Q=!1},le(),d=new ResizeObserver(()=>{S.clientWidth!==G&&(le(),A())}),d.observe(S)}if(A(),!o)return Qe(()=>{d?.disconnect()},()=>{},()=>{},()=>_);let E=matchMedia("(prefers-reduced-motion: reduce)"),O=0,L=0,H=!1,c=!1,w=m=>{O=requestAnimationFrame(w);let T=m-L;T<1e3/o-2||(L=m,_+=Math.min(T,100)/1e3,A())},b=()=>{let m=!c&&H&&!document.hidden&&(s||!E.matches);m&&!O?(L=performance.now(),O=requestAnimationFrame(w)):!m&&O&&(cancelAnimationFrame(O),O=0)},h=new IntersectionObserver(m=>{H=m[m.length-1]?.isIntersecting??!1,b()});return h.observe(e),document.addEventListener("visibilitychange",b),E.addEventListener("change",b),Qe(()=>{h.disconnect(),d?.disconnect(),cancelAnimationFrame(O),O=0,document.removeEventListener("visibilitychange",b),E.removeEventListener("change",b)},()=>{c=!0,b()},()=>{c=!1,b()},()=>_)}function yn(){return Qe(()=>{},()=>{},()=>{},()=>0)}function Qe(e,t,n,a){let r=e;return r.pause=t,r.resume=n,r.now=a,r}function wn({palette:e,React:t}){let n=e.length<=6?e:Array.from({length:6},(a,r)=>e[Math.round(r*(e.length-1)/5)]??"#000000");return t.createElement("div",{className:"ascii-rest-swatch","aria-hidden":"true"},...n.map((a,r)=>t.createElement("span",{key:r,style:{backgroundColor:a}})))}var et="data-ds-dark-theme";function vn(e){let{React:t,scene:n,copy:a,loadPreview:r,options:o}=e,s=t.useRef(null),[i,l]=t.useState(!1),[f,g]=t.useState(document.body.hasAttribute(et));return t.useEffect(()=>{let p=new MutationObserver(()=>g(document.body.hasAttribute(et)));return p.observe(document.body,{attributes:!0,attributeFilter:[et]}),()=>p.disconnect()},[]),t.useEffect(()=>{let p=s.current;if(p===null)return;let x=!1,z=null;p.replaceChildren(),l(!1);let S=document.createElement("canvas");return S.style.width="100%",S.style.height="100%",p.append(S),r(n.id).then(N=>{if(x)return;let B=f?"dark":"light";z=ze(S,{meta:{...N.meta,palette:pe(n.palette,B,o),ground:re(n.ground,B,o)},default:N.default},{fps:0,motion:!0})}).catch(()=>{x||l(!0)}),()=>{x=!0,z?.(),p.replaceChildren()}},[n.id,f,o.softness,o.saturation,r]),t.createElement("div",{className:"ascii-rest-preview"},t.createElement("div",{ref:s,style:{position:"absolute",inset:"0"}}),t.createElement("div",{className:"ascii-rest-preview__meta"},t.createElement("strong",null,n.name),t.createElement("span",null,`${String(n.cols)}\xD7${String(n.rows)}`)),i?t.createElement("p",{className:"ascii-rest-preview__error"},a.previewFailed):null)}function Tt(e){let{React:t,catalog:n,settings:a,copy:r}=e,o=n.find(u=>u.id===a.scene)??n[0],s=t.createElement("div",{className:"ascii-rest-actions"},t.createElement("button",{type:"button",className:"ascii-rest-button ascii-rest-button--primary",onClick:e.onOpenPanel},r.openPanel),t.createElement("button",{type:"button",className:"ascii-rest-button",onClick:()=>e.onAppearance({still:!a.appearance.still})},a.appearance.still?r.play:r.pause),t.createElement("button",{type:"button",className:"ascii-rest-button",onClick:e.onReset},r.reset)),i=t.createElement("header",{className:"ascii-rest-page__head"},t.createElement("h3",{className:"ascii-rest-page__title"},r.title),t.createElement("p",{className:"ascii-rest-page__note"},r.note)),l=t.createElement("div",{className:"ascii-rest-grid",role:"group","aria-label":r.scenes},...n.map(u=>t.createElement("button",{key:u.id,type:"button",className:"ascii-rest-card","aria-pressed":u.id===a.scene,onClick:()=>e.onScene(u.id)},t.createElement(wn,{palette:pe(u.palette,"dark"),React:t}),t.createElement("span",{className:"ascii-rest-card__name"},u.name),t.createElement("span",{className:"ascii-rest-card__note"},u.note)))),f=(u,R,C)=>t.createElement("label",{className:"ascii-rest-field"},t.createElement("span",{className:"ascii-rest-field__text"},t.createElement("span",{className:"ascii-rest-field__label"},u),C===void 0?null:t.createElement("span",{className:"ascii-rest-field__hint"},C)),R),g=(u,R,C,_)=>t.createElement("div",{className:"ascii-rest-chips",role:"group"},...u.map(A=>t.createElement("button",{key:A,type:"button",className:"ascii-rest-chip","aria-pressed":A===C,onClick:()=>_(A)},R[A]??A))),p={"top-left":r.anchorTopLeft,top:r.anchorTop,"top-right":r.anchorTopRight,left:r.anchorLeft,center:r.anchorCenter,right:r.anchorRight,"bottom-left":r.anchorBottomLeft,bottom:r.anchorBottom,"bottom-right":r.anchorBottomRight},x={cover:r.fitCover,contain:r.fitContain},z={sidebar:r.regionSidebar,main:r.regionMain,rightbar:r.regionRightbar,bottom:r.regionBottom},S=t.createElement("section",{className:"ascii-rest-section"},t.createElement("h4",{className:"ascii-rest-section__title"},r.placement),t.createElement("p",{className:"ascii-rest-section__note"},r.placementNote),f(r.fit,g(Te,x,a.options.fit,u=>e.onPlacement({fit:u}))),f(r.anchor,g(Ne,p,a.options.anchor,u=>e.onPlacement({anchor:u}))),f(r.zoom,t.createElement("input",{type:"range",className:"ascii-rest-range",min:.5,max:3,step:.01,value:a.options.zoom,onChange:u=>e.onPlacement({zoom:Number(u.target.value)})}),`${a.options.zoom.toFixed(2)}\xD7`)),N=t.createElement("section",{className:"ascii-rest-section"},t.createElement("h4",{className:"ascii-rest-section__title"},r.regions),t.createElement("p",{className:"ascii-rest-section__note"},r.regionsNote),...X.map(u=>f(z[u]??u,t.createElement("input",{type:"range",className:"ascii-rest-range",min:0,max:1,step:.01,value:a.regions[u],onChange:R=>e.onRegions({[u]:Number(R.target.value)})}),`${Math.round(a.regions[u]*100)}%`))),B=t.createElement("p",{className:"ascii-rest-credit"},`${r.credit} `,t.createElement("a",{href:"https://ascii.rest/",target:"_blank",rel:"noreferrer noopener"},"ascii.rest"));return t.createElement("div",{className:"ascii-rest-page"},i,o===void 0?null:t.createElement(vn,{scene:o,options:a.options,loadPreview:e.loadPreview,copy:r,React:t}),s,S,N,l,B)}var nt={};pt(nt,{default:()=>Ft,meta:()=>Lt});var Lt={name:"salt flat",category:"scenes",note:"the vercel triangle over a mirror of salt, the sun rising behind its tip",cols:200,rows:100,cell:1,fps:15,ground:"#000000",palette:["#0d0d0e","#161617","#1f1f21","#2a2a2c","#363638","#444446","#555557","#69696b","#808082","#9a9a9c","#b8b8ba","#d8d8da","#ffffff","#50e3c2","#0070f3","#7928ca","#ff0080","#ff4d4d","#f9cb28","#b0f2e3","#8cbcf9","#bb94e4","#ff8cc0","#ffa6a6","#fce59a","#24665a","#00326d","#36125b","#73003a","#732323","#705b12"]},oe=200,ve=100,ge=100,Fe=22,Le=Fe*Math.sqrt(3),J=57,xn=1.7,he=J-xn,It=he-Le,Sn=It+3.2,ee=Math.sqrt(3)/2,kn=24,tt=Math.PI*2,En=" \xB7\u2022\u25CF",Rn=[0,.3,.6,1],Mn=[0,8,2,10,12,4,14,6,3,11,1,9,15,7,13,5].map(e=>e/16-.47),_t=[[.31,.89,.76],[0,.44,.95],[.47,.16,.79],[1,0,.5],[1,.3,.3],[.98,.8,.16]];function xe(e,t){let n=Math.imul(e|0,374761393)+Math.imul(t|0,668265263);return n=Math.imul(n^n>>>13,1274126177),((n^n>>>16)>>>0)/4294967296}function zt(e,t){let n=Math.floor(e),a=Math.floor(t),r=e-n,o=t-a,s=r*r*(3-2*r),i=o*o*(3-2*o),l=xe(n,a),f=xe(n+1,a),g=xe(n,a+1),p=xe(n+1,a+1);return l+(f-l)*s+(g-l)*i+(l-f-g+p)*s*i}var ue=e=>e<0?0:e>1?1:e,se=(e,t,n)=>{let a=ue((n-e)/(t-e));return a*a*(3-2*a)},An=e=>[1,3,5].map(t=>parseInt(e.slice(t,t+2),16)/255),Ie=[0,0,0];function Cn(e){let t=(e%1+1)%1*6,n=Math.floor(t),a=t-n,r=_t[n],o=_t[(n+1)%6];for(let s=0;s<3;s++)Ie[s]=r[s]+(o[s]-r[s])*a}function On(e,t){return-(e-(ge-Fe))*ee-(t-he)*.5}function Pn(e,t){return(e-(ge+Fe))*ee-(t-he)*.5}function Ft(){let e=Lt.palette.map(An),t=oe*ve,n=new Array(t),a=new Uint8Array(32768).fill(255),r=(u,R,C)=>{let _=Math.min(31,u*31.99|0)<<10|Math.min(31,R*31.99|0)<<5|Math.min(31,C*31.99|0);if(a[_]!==255)return a[_];let A=0,d=1e9;for(let E=0;E<e.length;E++){let O=e[E][0]-u,L=e[E][1]-R,H=e[E][2]-C,c=.3*O*O+.5*L*L+.2*H*H;c<d&&(d=c,A=E)}return a[_]=A},o=250,s=64,i=2,l=new Float32Array(t),f=new Float32Array(t);for(let u=0;u<ve;u++)for(let R=0;R<oe;R++){let C=u*oe+R,_=u+.5;if(_<J){_<J-14&&xe(R,u*5+3)>.988&&(f[C]=.4+.6*xe(u,R));continue}let A=_-J,d=o/A,E=(R+.5-ge)*d/s,O=E+.16*(zt(E*.5,d*.5)-.5),L=d+.16*(zt(E*.5+7.3,d*.5+1.9)-.5),H=2/3*O/i,c=(-1/3*O+Math.sqrt(3)/3*L)/i,w=Math.round(H),b=Math.round(c),h=Math.round(-H-c),m=Math.abs(w-H),T=Math.abs(b-c),v=Math.abs(h+H+c);m>T&&m>v?w=-b-h:T>v&&(b=-w-h);let y=O-i*1.5*w,k=L-i*Math.sqrt(3)*(b+w/2),M=Math.abs(k),$=Math.abs(ee*y+.5*k),I=Math.abs(ee*y-.5*k),q=0,K=Math.sign(k),F=M;$>F&&(F=$,q=ee*Math.sign(ee*y+.5*k),K=.5*Math.sign(ee*y+.5*k)),I>F&&(F=I,q=ee*Math.sign(ee*y-.5*k),K=-.5*Math.sign(ee*y-.5*k));let G=i*ee-F,Z=-(d*d)/o,V=d/s,te=(R+.5-ge)/s*Z,j=q*V,P=q*te+K*Z,W=G/Math.sqrt(j*j+P*P+1e-9),Q=i*2*ee/Math.abs(Z);l[C]=se(.95,.25,W)*se(5,15,Q)}let g=1024,p=new Float32Array(g),x=new Float32Array(t),z=new Float32Array(t),S=new Float32Array(t),N=new Uint16Array(t),B=new Float32Array(t);for(let u=0;u<ve;u++)for(let R=0;R<oe;R++){let C=u*oe+R,_=R+.5,A=u+.5<J?u+.5:2*J-u-.5,d=_-ge,E=A-Sn,O=Math.sqrt(d*d+E*E),L=J-A;x[C]=.22*Math.exp(-L/3)+.025*Math.exp(-L/10)+.8*Math.exp(-(L*L)/.7)+.35*Math.exp(-(E*E)/.5)*Math.exp(-Math.abs(d)/32)+(O<4.5?1:0),z[C]=.9*Math.exp(-O/2.5)+.25*Math.exp(-O/8);let H=Math.atan2(d,-E);S[C]=se(4,12,O)*Math.exp(-O/50)*se(2.35,1.75,Math.abs(H)),N[C]=Math.min(g-1,Math.floor((H+Math.PI)/tt*g)),B[C]=(.3+.25*Math.exp(-(d*d)/2500))*se(J+2,J+12,u+.5)}return(u,{color:R}={})=>{let C=tt/kn,_=.92+.08*Math.sin(u*C*2),A=u*C,d=u%6/1.4,E=Math.min(1,d),O=d<1?.5+.5*d:d<1.5?1-(d-1)*2:0,L=he-Le*E*E,H=d>.8&&d<1.5?Math.sin((d-.8)/.7*Math.PI):0;for(let v=0;v<g;v++){let y=v/g*tt-Math.PI,k=.5+.5*Math.cos(14*y+A+1.4*Math.sin(5*y-A*2)),M=.5+.5*Math.cos(23*y-A*3+.9*Math.sin(3*y+A));k*=k,k*=k,k*=k,M*=M,M*=M,M*=M,M*=M,p[v]=(k*.55+M*.18)*_}let c=0,w=0,b=0,h=0,m=(v,y,k,M)=>{let $=v-ge,I=x[k]+z[k]*_+S[k]*p[N[k]];if(O>0){let P=Fe*(1-(he-L)/Le),W=y-L,Q=Math.min((v-ge+P)**2,(v-ge-P)**2)+W*W;I+=Math.exp(-Q/5)*O*.7}if(H>0){let P=y-It;I+=H*(Math.exp(-(P*P)/.35)*Math.exp(-Math.abs($)/16)+Math.exp(-($*$)/.35)*Math.exp(-Math.abs(P)/12))*.9}if(M){let P=f[Math.floor(y)*oe+Math.floor(v)];P&&(I=Math.max(I,P*(.65+.35*Math.sin(u*C*(2+(P*10|0))+P*40))*se(.25,.04,I)))}c=I,w=I,b=I,h=0;let q=On(v,y),K=Pn(v,y),F=y-he,G=Math.max(q,K),Z=Math.max(G,F);if(Z>4)return;let V=ue(.5-Z*1.4);h=ue(.5-Z*.5),c*=1-V,w*=1-V,b*=1-V;let te=ue((he-y)/Le);if(F<.4){let P=Math.exp(-((G+.55)*(G+.55))/.3)*(.8+.4*te);if(O>0&&(P+=Math.exp(-((y-L)*(y-L))/3)*O*Math.exp(-((G+.5)*(G+.5))/.6)*1.2),P*=se(.4,-.6,F),c+=P,w+=P,b+=P,G>-.5){let W=Math.exp(-((G-.7)*(G-.7))/.5)*(.45+.3*te)*se(.4,-1.2,F);Cn(G*.18+te*.9-u/6+(q>K?0:.5)),c+=W*Ie[0],w+=W*Ie[1],b+=W*Ie[2]}}let j=Math.exp(-((F+.5)*(F+.5))/.2)*(G<0?1:0)*.32;c+=j,w+=j,b+=j};for(let v=0;v<ve;v++)for(let y=0;y<oe;y++){let k=v*oe+y,M=v+.5,$=y+.5,I=0;if(M<J)m($,M,k,!0),I=.05*se(10,J,M);else{let j=.06+(M-J)*.011,P=u*C,W=$+j*(Math.sin(M*.8-P*6+Math.sin($*.05)*2)*.7+Math.sin($*.11+M*1.3-P*4)*.35),Q=2*J-M+j*.4*Math.sin($*.07-P*3+M*.6);m(W,Q,k,!1);let me=.8-.5*se(J,ve,M);c*=me,w*=me,b*=me;let le=l[k]*(1-.85*h);if(le>0){let ke=B[k],D=1-.55*le;c=c*D+le*ke,w=w*D+le*ke,b=b*D+le*ke}I=.02}let q=c,K=w,F=b,G=Math.max(q,K,F,1e-4),Z=G<.008?0:ue(I+(1-I)*Math.pow(G,.85)*.95),V=Math.max(0,Math.min(3,Math.round(Z*3+Mn[(v&3)*4+(y&3)])));if(n[k]=En[V],R){let j=(.3+.7*(V?Math.min(1,(Z+.06)/Rn[V]):0))/G;R[k]=r(ue(q*j),ue(K*j),ue(F*j))}}let T=[];for(let v=0;v<ve;v++)T.push(n.slice(v*oe,(v+1)*oe).join(""));return T.join(`
    `)}}var Nn=()=>{let e=Bt(nt);if(e===null)throw new Error('ascii-rest: the built-in "salt-flat" piece did not have the expected shape');return e},Tn={"salt-flat":Nn};function _n(e){return`client.${e}.js`}function zn(e){if(!/^[a-z0-9][a-z0-9-]*$/.test(e))throw new Error(`ascii-rest: "${e}" is not a scene id`);return`./${_n(e)}`}var at=new Map;async function Be(e){let t=at.get(e);if(t!==void 0)return t;let n=Tn[e];if(n!==void 0){let s=n();return at.set(e,s),s}let a=Ae();if(a===void 0)throw new Error("ascii-rest: the module loader is not available");let r=await a.async(zn(e)),o=Bt(r);if(o===null)throw new Error(`ascii-rest: scene "${e}" did not load a piece module`);return at.set(e,o),o}function Bt(e){let t=e;if(t===null||typeof t!="object")return null;let n=t.meta,a=t.default;return typeof n!="object"||n===null||typeof a!="function"?null:t}var rt="dsh-skin:ascii-rest:settings";function Ln(e){if(e!==void 0)try{let t=e.getItem(rt);return t===null?void 0:JSON.parse(t)}catch{return}}function Gt(e,t){let n=t??(typeof localStorage>"u"?void 0:localStorage),a=we(Ln(n),e),r=new Set,o=i=>{if(n!==void 0)try{n.setItem(rt,JSON.stringify(i))}catch{}},s=i=>{if(!Me(a,i)){a=i;for(let l of r)l(a)}};return{get:()=>a,set:i=>{let l=we(i,e);Me(a,l)||(o(l),s(l))},update:i=>{let l=we(i(a),e);Me(a,l)||(o(l),s(l))},subscribe:i=>(r.add(i),()=>{r.delete(i)}),reset:()=>{try{n?.removeItem(rt)}catch{}s(we(void 0,e))}}}var Ht=`
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
    `;function In(e,t){return`${e}${Math.round(Math.max(0,Math.min(1,t))*255).toString(16).padStart(2,"0")}`}var Fn="data-ds-dark-theme",Bn="data-ascii-rest-layer";function Ge(e=document){return e.body.hasAttribute(Fn)?"dark":"light"}function $t(e,t=document){let{scene:n}=e,a=e.geometry,r=Ge(t),o=null,s=!1,i=e.still?0:e.fps,l=t.createElement("div");l.setAttribute(Bn,""),l.setAttribute("aria-hidden","true"),l.style.position="fixed",l.style.inset="0",l.style.zIndex="-1",l.style.overflow="hidden",l.style.pointerEvents="none",l.style.contain="strict";let f=t.createElement("canvas");f.style.position="absolute",f.style.display="block",f.style.left="0",f.style.top="0";let g=t.createElement("div");g.setAttribute("aria-hidden","true"),g.style.position="absolute",g.style.inset="0",g.style.pointerEvents="none";let p=t.createElement("div");p.setAttribute("aria-hidden","true"),p.style.position="absolute",p.style.inset="0",p.style.pointerEvents="none",l.append(f,g,p);let x=()=>re(n.ground,r,e.paper),z=()=>{l.style.backgroundColor=x(),l.style.opacity=String(e.opacity),l.style.filter=e.blur>0?`blur(${String(e.blur)}px)`:"",g.style.backgroundColor=x(),g.style.opacity=String(e.veil);let d=e.scrim;p.style.opacity=String(d),p.style.background=d>0?`linear-gradient(${String(e.scrimAngle)}deg, ${x()} 0%, ${In(x(),0)} 62%)`:""},S=()=>{o?.(),o=null,i=e.still?0:e.fps;let d={meta:{...e.module.meta,palette:pe(n.palette,r,e.paper),ground:n.ground},default:e.module.default};try{o=ze(f,d,{...e.pieceOptions,fps:i,motion:!0})}catch(E){B(),e.onError?.(E)}},N=d=>{if(s)return;d!==void 0&&(a=d);let E=Je(n,window.innerWidth,window.innerHeight,a);f.style.width=`${String(E.width)}px`,f.style.height=`${String(E.height)}px`,f.style.left=`${String(E.left)}px`,f.style.top=`${String(E.top)}px`},B=()=>{o?.(),o=null,l.remove()},u=()=>N(),R=()=>o?.pause(),C=()=>o?.resume(),_=!1,A=d=>{d!==_&&(_=d,d?(window.addEventListener("blur",R),window.addEventListener("focus",C)):(window.removeEventListener("blur",R),window.removeEventListener("focus",C)))};try{t.body.prepend(l),z(),S(),N()}catch(d){B(),e.onError?.(d)}return window.addEventListener("resize",u),A(e.pauseOnBlur),{element:l,relayout:N,rescheme:()=>{if(s)return;let d=Ge(t);d!==r&&(r=d,z(),S(),N())},restyle:d=>{if(s)return;e.opacity=d.opacity,e.blur=d.blur,e.veil=d.veil,e.scrim=d.scrim,e.scrimAngle=d.scrimAngle,e.pauseOnBlur=d.pauseOnBlur,A(d.pauseOnBlur),z(),(d.still?0:d.fps)!==i&&(e.still=d.still,e.fps=d.fps,S())},dispose:()=>{s||(s=!0,window.removeEventListener("resize",u),A(!1),B())}}}function He(e){return typeof e=="object"&&e!==null&&typeof e.style=="object"&&e.style!==null&&typeof e.getAttribute=="function"}var ot="data-ascii-rest-region",jt=["--dsw-alias-bg-base","--dsw-specific-sidebar-fill"];function Dt(e){let t=e.querySelector("[data-rightbar-col]"),n=e.querySelector("[data-shell-bottom]");if(!He(t)||!He(n))return null;let a=t.parentElement;if(a===null)return null;let r=t.previousElementSibling,o=a.firstElementChild;return!He(r)||!He(o)||o===r||o===n||o===t?null:{sidebar:o,main:r,rightbar:t,bottom:n}}function Ut(e){for(let t of X)e[t].setAttribute(ot,t)}function st(e){for(let t of X){let n=e[t];n.style.removeProperty("background-color");for(let a of jt)n.style.removeProperty(a)}}function it(e){st(e);for(let t of X)e[t].removeAttribute(ot)}function qt(e,t){for(let n of X){let a=e[n],r=t[n];a.style.backgroundColor=r;for(let o of jt)a.style.setProperty(o,r)}}function ct(e){return X.every(t=>{let n=e[t];return n.isConnected&&n.getAttribute(ot)===t})}var Zt=.58,Xt=.66;function U(e,t){let n=t<0?0:t>1?1:t;return`${e}${Math.round(n*255).toString(16).padStart(2,"0")}`}function Kt(e,t,n){return Math.min(1,(e==="dark"?Zt:Xt)*n*t)}function Jt(e){let t=re(e.scene.ground,"dark"),n=re(e.scene.ground,"light",e.paper),a=(i=0)=>Math.min(1,Zt*e.surfaceOpacity+i),r=(i=0)=>Math.min(1,Xt*e.surfaceOpacity+i),o=Yt(e.scene.palette,"dark"),s=Yt(pe(e.scene.palette,"light",e.paper),"light");return{"--dsw-alias-bg-base":{light:U(n,r()),dark:U(t,a())},"--dsw-alias-bg-layer-1":{light:U(n,r(.1)),dark:U(t,a(.12))},"--dsw-alias-bg-layer-2":{light:U(n,r(.16)),dark:U(t,a(.2))},"--dsw-alias-bg-overlay":{light:U(n,.97),dark:U(t,.95)},"--dsw-specific-sidebar-fill":{light:U(n,r(.04)),dark:U(t,a(.06))},"--dsw-alias-brand-primary":{light:s,dark:o},"--dsw-alias-border-l1":{light:U("#000000",.12),dark:U("#ffffff",.14)},"--dsw-alias-border-l2":{light:U("#000000",.2),dark:U("#ffffff",.22)},"--dsw-alias-label-primary":{light:"#0f1115",dark:"#f9fafb"},"--dsw-alias-label-secondary":{light:"#4b5563",dark:"#cfd3d6"},"--dsw-alias-state-error-primary":{light:"#c62a2a",dark:"#ff6b6b"},"--dsw-alias-state-idle-primary":{light:"#81858c",dark:"#979da6"},"--dsw-alias-state-success-primary":{light:"#0f7b4f",dark:"#4ade80"},"--dsw-alias-state-warn-primary":{light:"#96660a",dark:"#fbbf24"}}}function Vt(e,t){let n=re(e.scene.ground,"dark"),a=re(e.scene.ground,"light",e.paper),r={};for(let o of["sidebar","main","rightbar","bottom"]){let s=t[o];r[o]={light:U(a,Kt("light",s,e.surfaceOpacity)),dark:U(n,Kt("dark",s,e.surfaceOpacity))}}return r}function Yt(e,t){let n=t==="dark"?"#50a0e3":"#0070f3",a=n,r=0;for(let o of e){let s=Pe(o);if(s===null)continue;let i=Math.max(s.r,s.g,s.b)/255,l=Math.min(s.r,s.g,s.b)/255,f=i-l,g=(i+l)/2,p=1-Math.abs(g-.55)*2,x=f*Math.max(0,p);x>r&&(r=x,a=o)}return r===0?n:a}var Wt={navLabel:"ASCII background",title:"ASCII background",note:"An ascii.rest scene behind the workspace. The palette follows the light and dark themes: dark keeps the scene's own near-black ground, light turns the same picture into paper.",previewFailed:"This scene did not load.",play:"Play",pause:"Pause",reset:"Reset",openPanel:"Open the tuning panel",credit:"Scenes by",scenes:"Available scenes",closePanel:"Close the tuning panel",placement:"Placement",placementNote:"Choose what happens to the overflow, then which edge to keep. The picture always scales at the scene's own ratio, never stretched.",fit:"Fit",fitCover:"Fill and crop",fitContain:"Fit and letterbox",anchor:"Anchor",anchorTopLeft:"Top left",anchorTop:"Top",anchorTopRight:"Top right",anchorLeft:"Left",anchorCenter:"Center",anchorRight:"Right",anchorBottomLeft:"Bottom left",anchorBottom:"Bottom",anchorBottomRight:"Bottom right",zoom:"Zoom",regions:"Panel reveal",regionsNote:"How much of the picture each region lets through. 0 is the host's own opaque surface, 1 is the skin's default.",regionSidebar:"Sidebar",regionMain:"Main panel",regionRightbar:"Auxiliary bar",regionBottom:"Bottom bar",scrim:"Gradient scrim",scrimNote:"Fades one edge of the picture towards the ground so the composer and the sidebar have a quiet base to sit on.",scrimStrength:"Strength",scrimAngle:"Direction",pauseOnBlur:"Pause when unfocused",pauseOnBlurNote:"Stop drawing while the window is in the background, and resume on return."};var Qt={navLabel:"ASCII \u80CC\u666F",title:"ASCII \u80CC\u666F",note:"\u7528 ascii.rest \u7684\u573A\u666F\u4F5C\u5DE5\u4F5C\u533A\u80CC\u666F\u3002\u914D\u8272\u968F\u4EAE\u6697\u4E3B\u9898\u5207\u6362\uFF1A\u6697\u8272\u53D6\u573A\u666F\u672C\u8EAB\u7684\u8FD1\u9ED1\u5E95\u8272\uFF0C\u4EAE\u8272\u628A\u540C\u4E00\u5F20\u753B\u7FFB\u6210\u7EB8\u8272\u3002",previewFailed:"\u8FD9\u4E2A\u573A\u666F\u6CA1\u80FD\u52A0\u8F7D\u3002",play:"\u64AD\u653E\u52A8\u753B",pause:"\u6682\u505C\u52A8\u753B",reset:"\u6062\u590D\u9ED8\u8BA4",openPanel:"\u6253\u5F00\u8C03\u53C2\u9762\u677F",credit:"\u573A\u666F\u6765\u81EA",scenes:"\u53EF\u9009\u573A\u666F",closePanel:"\u5173\u95ED\u8C03\u53C2\u9762\u677F",placement:"\u6446\u653E",placementNote:"\u5148\u9009\u9002\u5E94\u65B9\u5F0F\uFF0C\u518D\u9009\u4FDD\u7559\u54EA\u4E00\u8FB9\u3002\u753B\u9762\u6309\u573A\u666F\u81EA\u8EAB\u7684\u6BD4\u4F8B\u7F29\u653E\uFF0C\u4E0D\u4F1A\u88AB\u62C9\u4F38\u3002",fit:"\u9002\u5E94\u65B9\u5F0F",fitCover:"\u586B\u6EE1\u88C1\u5207",fitContain:"\u5B8C\u6574\u7559\u767D",anchor:"\u5BF9\u9F50\u4F4D\u7F6E",anchorTopLeft:"\u5DE6\u4E0A",anchorTop:"\u4E0A\u4E2D",anchorTopRight:"\u53F3\u4E0A",anchorLeft:"\u5DE6\u4E2D",anchorCenter:"\u5C45\u4E2D",anchorRight:"\u53F3\u4E2D",anchorBottomLeft:"\u5DE6\u4E0B",anchorBottom:"\u4E0B\u4E2D",anchorBottomRight:"\u53F3\u4E0B",zoom:"\u7F29\u653E",regions:"\u5206\u533A\u900F\u51FA",regionsNote:"\u6BCF\u4E2A\u533A\u57DF\u5355\u72EC\u63A7\u5236\u753B\u9762\u900F\u51FA\u591A\u5C11\uFF1A0 \u662F\u5BBF\u4E3B\u81EA\u5DF1\u7684\u4E0D\u900F\u660E\u8868\u9762\uFF0C1 \u662F\u76AE\u80A4\u9ED8\u8BA4\u3002",regionSidebar:"\u4FA7\u8FB9\u680F",regionMain:"\u4E3B\u9762\u677F",regionRightbar:"\u526F\u4FA7\u8FB9\u680F",regionBottom:"\u5E95\u680F",scrim:"\u6E10\u53D8\u906E\u7F69",scrimNote:"\u671D\u4E00\u4E2A\u65B9\u5411\u628A\u753B\u9762\u6E10\u9690\u5230\u5E95\u8272\uFF0C\u8BA9\u5E95\u90E8\u7684\u8F93\u5165\u6846\u548C\u4FA7\u8FB9\u7559\u51FA\u5B89\u9759\u7684\u5E95\u5B50\u3002",scrimStrength:"\u5F3A\u5EA6",scrimAngle:"\u65B9\u5411",pauseOnBlur:"\u5931\u7126\u6682\u505C",pauseOnBlurNote:"\u7A97\u53E3\u4E0D\u5728\u524D\u53F0\u65F6\u505C\u6B62\u7ED8\u5236\uFF0C\u56DE\u5230\u524D\u53F0\u63A5\u7740\u64AD\u3002"};var Se="@lionad/dsh-client-ui-skin-ascii-rest",$e="data-dsh-ascii-rest",lt="ascii-rest",ft="dsh-skin-ascii-rest";var nn=["slots","theme"],$n="data-ascii-rest-gui",jn="./client.gui.js",en=`${Se}/skin.css`,je={zh:Qt,en:Wt};function Dn(e,t){if(e.querySelector(`style[data-plugin-css=${JSON.stringify(en)}]`)!==null)return()=>{};let a=e.createElement("style");return a.dataset.plugin=Se,a.dataset.pluginCss=en,a.textContent=t,e.head.append(a),()=>a.remove()}function tn(e){let t=e.querySelectorAll(`style[data-plugin=${JSON.stringify(Se)}]:not([data-plugin-css])`);for(let n of t)n.removeAttribute("data-plugin")}function an(e){let t=document.body,n=t.ownerDocument,a=qe(),r=Ae()("react"),o=Gt(a.scenes),s=o.get(),i=null,l=null,f=null,g=null,p=null,x=0,z=e.get("theme"),S=e.get("locale"),N=e.get("slots"),B=(c,w)=>{console.warn(c,w)},u=()=>(S?.getSnapshot().active??"zh").startsWith("en")?je.en:je.zh,R=()=>{let c=s.scene;return a.scenes.find(w=>w.id===c)},C=c=>{if(p===null||c===void 0)return;let w=s.regions;if(X.every(v=>w[v]===1)){st(p);return}let b={scene:c,surfaceOpacity:s.appearance.surface,paper:s.options},h=Vt(b,w),m=Ge(n),T={};for(let v of X)T[v]=h[v]?.[m]??"";qt(p,T)},_=c=>{if(g?.(),g=null,z===void 0||c===void 0)return;let w={scene:c,surfaceOpacity:s.appearance.surface,paper:s.options};g=z.overrideTokens(Se,Jt(w)),C(c)},A=async c=>{let w=++x,b=a.scenes.find(m=>m.id===c.scene);if(i?.dispose(),i=null,_(b),b===void 0)return;let h;try{h=await Be(b.id)}catch(m){B(`ascii-rest: scene "${b.id}" did not load`,m);return}w===x&&(i=$t({scene:b,module:h,pieceOptions:c.piece[b.id]??{},opacity:c.appearance.opacity,blur:c.appearance.blur,veil:c.appearance.veil,still:c.appearance.still,fps:c.appearance.fps,scrim:c.appearance.scrim,scrimAngle:c.appearance.scrimAngle,pauseOnBlur:c.appearance.pauseOnBlur,paper:c.options,geometry:{fit:c.options.fit,anchor:c.options.anchor,zoom:c.options.zoom},onError:m=>{B("ascii-rest: the scene stopped drawing",m)}}),l?.rebuild(b,h,c.piece[b.id]??{}))},d=()=>{l?.destroy(),l=null,f?.remove(),f=null},E=async()=>{if(l!==null)return;let c=a.scenes.find(h=>h.id===s.scene);if(c===void 0)return;let w;try{w=await Be(c.id)}catch(h){B("ascii-rest: cannot open the panel without a scene",h);return}let b;try{b=await Ae().async(jn)}catch(h){B("ascii-rest: the tuning panel did not load",h);return}f=n.createElement("div"),f.setAttribute($n,""),t.append(f),l=b.createGui(f,{catalog:a.scenes,scene:c,settings:s,module:w,callbacks:{onPiece:h=>{o.update(m=>({...m,piece:{...m.piece,[m.scene]:{...m.piece[m.scene]??{},...h}}}))},onAppearance:h=>{o.update(m=>({...m,appearance:{...m.appearance,...h}}))},onRegions:h=>{o.update(m=>({...m,regions:{...m.regions,...h}}))},onPlacement:h=>{o.update(m=>({...m,options:{...m.options,...h}}))},onScene:h=>{o.update(m=>({...m,scene:h}))},onSave:()=>o.set(s),onClose:()=>d()},closeLabel:u().closePanel})},O=()=>{let[c,w]=r.useState(s);return r.useEffect(()=>o.subscribe(w),[]),Tt({catalog:a.scenes,settings:c,React:r,copy:u(),loadPreview:b=>Be(b),onScene:b=>o.update(h=>({...h,scene:b})),onAppearance:b=>o.update(h=>({...h,appearance:{...h.appearance,...b}})),onPlacement:b=>o.update(h=>({...h,options:{...h.options,...b}})),onRegions:b=>o.update(h=>({...h,regions:{...h.regions,...b}})),onOpenPanel:()=>{E()},onReset:()=>o.reset()})},L=Dn(n,Ht);t.setAttribute($e,""),A(s),e.effect(()=>()=>{x+=1,d(),i?.dispose(),i=null,g?.(),g=null,L(),t.removeAttribute($e)},"ascii-rest: release the skin"),e.effect(()=>(tn(n),()=>{tn(n)}),"ascii-rest: release styles claimed by the loader"),e.effect(()=>o.subscribe(c=>{let w=s;s=c;let b=a.scenes.find(h=>h.id===c.scene);if(c.scene!==w.scene){A(c);return}_(b),i?.restyle({opacity:c.appearance.opacity,blur:c.appearance.blur,veil:c.appearance.veil,still:c.appearance.still,fps:c.appearance.fps,scrim:c.appearance.scrim,scrimAngle:c.appearance.scrimAngle,pauseOnBlur:c.appearance.pauseOnBlur}),i?.relayout({fit:c.options.fit,anchor:c.options.anchor,zoom:c.options.zoom})}),"ascii-rest: follow the settings");let H=()=>{(p===null||!ct(p))&&(p!==null&&it(p),p=Dt(n),p!==null&&Ut(p)),C(R())};e.effect(()=>{let c=new MutationObserver(()=>{i?.rescheme(),C(R())});c.observe(n.body,{attributes:!0,attributeFilter:["data-ds-dark-theme"]});let w=!1,b=()=>{w||(w=!0,requestAnimationFrame(()=>{w=!1,!(p!==null&&ct(p))&&H()}))},h=new MutationObserver(b);h.observe(n.body,{childList:!0,subtree:!0});let m=()=>i?.relayout();return window.addEventListener("resize",m),H(),()=>{c.disconnect(),h.disconnect(),window.removeEventListener("resize",m),p!==null&&it(p),p=null}},"ascii-rest: follow the scheme, the shell and the window"),S!==void 0&&e.effect(()=>S.register(ft,{zh:je.zh,en:je.en}),"ascii-rest: locale dictionaries"),N!==void 0&&N.inject("settings.section",()=>N.register({name:"settings.section",id:lt,order:116,label:()=>u().navLabel},O))}function Un(e){Nt(e)}

    module.exports.boot(require);
    return module.exports;
  }
});
