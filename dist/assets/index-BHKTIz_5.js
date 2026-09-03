(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))a(s);new MutationObserver(s=>{for(const o of s)if(o.type==="childList")for(const r of o.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&a(r)}).observe(document,{childList:!0,subtree:!0});function t(s){const o={};return s.integrity&&(o.integrity=s.integrity),s.referrerPolicy&&(o.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?o.credentials="include":s.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function a(s){if(s.ep)return;s.ep=!0;const o=t(s);fetch(s.href,o)}})();class Ce{constructor(e){this.canvas=e,this.ctx=e.getContext("2d"),this.width=0,this.height=0,this.stars=[],this.shootingStars=[],this.mouseX=0,this.mouseY=0,this.targetMouseX=0,this.targetMouseY=0,this.moonAngle=0,this.animationId=null,this.init()}init(){this.resize(),window.addEventListener("resize",()=>this.resize()),window.addEventListener("mousemove",e=>{this.targetMouseX=(e.clientX/this.width-.5)*40,this.targetMouseY=(e.clientY/this.height-.5)*40}),this.createStars(400),this.animate()}resize(){const e=window.devicePixelRatio||1;this.width=window.innerWidth,this.height=window.innerHeight,this.canvas.width=this.width*e,this.canvas.height=this.height*e,this.ctx.scale(e,e)}createStars(e){this.stars=[];for(let t=0;t<e;t++)this.stars.push({x:Math.random()*this.width,y:Math.random()*this.height,z:Math.random()*3+.5,radius:Math.random()*1.5+.3,alpha:Math.random()*.8+.2,twinkleSpeed:Math.random()*.02+.005,twinkleOffset:Math.random()*Math.PI*2,hue:Math.random()>.7?190:Math.random()>.5?270:0})}createShootingStar(){Math.random()<.015&&this.shootingStars.length<3&&this.shootingStars.push({x:Math.random()*this.width*.8+this.width*.2,y:Math.random()*this.height*.4,length:Math.random()*80+50,speed:Math.random()*12+8,angle:Math.PI/4+(Math.random()-.5)*.2,life:1,decay:Math.random()*.03+.015})}drawMoon(e,t,a){const s=this.ctx;s.save();const o=s.createRadialGradient(e,t,a*.8,e,t,a*2.2);o.addColorStop(0,"rgba(168, 85, 247, 0.25)"),o.addColorStop(.5,"rgba(6, 182, 212, 0.12)"),o.addColorStop(1,"rgba(5, 6, 15, 0)"),s.fillStyle=o,s.beginPath(),s.arc(e,t,a*2.2,0,Math.PI*2),s.fill(),s.save(),s.translate(e,t),s.rotate(this.moonAngle*.2-.3),s.beginPath(),s.ellipse(0,0,a*1.6,a*.45,0,0,Math.PI*2),s.strokeStyle="rgba(6, 182, 212, 0.2)",s.lineWidth=1.5,s.setLineDash([8,6]),s.stroke(),s.restore();const r=s.createRadialGradient(e-a*.35,t-a*.35,a*.1,e,t,a);r.addColorStop(0,"#ffffff"),r.addColorStop(.4,"#e0e7ff"),r.addColorStop(.8,"#a5b4fc"),r.addColorStop(1,"#4338ca"),s.beginPath(),s.arc(e,t,a,0,Math.PI*2),s.fillStyle=r,s.shadowColor="rgba(168, 85, 247, 0.6)",s.shadowBlur=30,s.fill(),s.shadowBlur=0,s.save(),s.beginPath(),s.arc(e,t,a,0,Math.PI*2),s.clip(),s.translate(e,t),s.rotate(this.moonAngle),[{x:-a*.3,y:-a*.2,r:a*.2,op:.18},{x:a*.25,y:a*.3,r:a*.25,op:.14},{x:a*.4,y:-a*.35,r:a*.15,op:.2},{x:-a*.15,y:a*.4,r:a*.18,op:.16},{x:0,y:-a*.5,r:a*.12,op:.15}].forEach(p=>{s.beginPath(),s.arc(p.x,p.y,p.r,0,Math.PI*2),s.fillStyle=`rgba(30, 27, 75, ${p.op})`,s.fill()}),s.restore(),s.restore()}animate(){this.ctx.clearRect(0,0,this.width,this.height),this.mouseX+=(this.targetMouseX-this.mouseX)*.05,this.mouseY+=(this.targetMouseY-this.mouseY)*.05,this.moonAngle+=.001;const e=this.width>900?this.width*.82:this.width*.5,t=this.height*.28,a=this.width>900?90:60;this.drawMoon(e+this.mouseX*.3,t+this.mouseY*.3,a);const s=Date.now()*.001;this.stars.forEach(o=>{const r=this.mouseX*o.z*.4,c=this.mouseY*o.z*.4,p=o.alpha+Math.sin(s*2+o.twinkleOffset)*.2;this.ctx.beginPath(),this.ctx.arc(o.x+r,o.y+c,o.radius,0,Math.PI*2),o.hue===190?this.ctx.fillStyle=`rgba(56, 189, 248, ${Math.max(.1,p)})`:o.hue===270?this.ctx.fillStyle=`rgba(192, 132, 252, ${Math.max(.1,p)})`:this.ctx.fillStyle=`rgba(255, 255, 255, ${Math.max(.1,p)})`,this.ctx.fill()}),this.createShootingStar();for(let o=this.shootingStars.length-1;o>=0;o--){const r=this.shootingStars[o];if(r.x+=Math.cos(r.angle)*r.speed,r.y+=Math.sin(r.angle)*r.speed,r.life-=r.decay,r.life<=0||r.x>this.width||r.y>this.height){this.shootingStars.splice(o,1);continue}const c=this.ctx.createLinearGradient(r.x,r.y,r.x-Math.cos(r.angle)*r.length,r.y-Math.sin(r.angle)*r.length);c.addColorStop(0,`rgba(255, 255, 255, ${r.life})`),c.addColorStop(.4,`rgba(6, 182, 212, ${r.life*.8})`),c.addColorStop(1,"rgba(6, 182, 212, 0)"),this.ctx.beginPath(),this.ctx.moveTo(r.x,r.y),this.ctx.lineTo(r.x-Math.cos(r.angle)*r.length,r.y-Math.sin(r.angle)*r.length),this.ctx.strokeStyle=c,this.ctx.lineWidth=2,this.ctx.stroke()}this.animationId=requestAnimationFrame(()=>this.animate())}destroy(){this.animationId&&cancelAnimationFrame(this.animationId)}}const se=[{id:"all",name:"All Universes",count:14},{id:"jujutsu-kaisen",name:"Jujutsu Kaisen",count:3},{id:"demon-slayer",name:"Demon Slayer",count:2},{id:"one-piece",name:"One Piece",count:1},{id:"solo-leveling",name:"Solo Leveling",count:1},{id:"cyberpunk",name:"Cyberpunk: Edgerunners",count:1},{id:"attack-on-titan",name:"Attack on Titan",count:2},{id:"naruto",name:"Naruto Shippuden",count:2},{id:"chainsaw-man",name:"Chainsaw Man",count:1},{id:"bleach",name:"Bleach: TYBW",count:1}],H=[{id:"gojo-infinite-void",title:"Infinite Void // Cosmic Horizon",japaneseTitle:"無量空処 (Muryōkūsho)",anime:"Jujutsu Kaisen",animeId:"jujutsu-kaisen",character:"Satoru Gojo",image:"/wallpapers/gojo_infinite_void.jpg",thumbnail:"/wallpapers/gojo_infinite_void.jpg",is3D:!0,isBestView:!0,isTrending:!0,featured:!0,rating:5,reviewCount:3840,downloads:142500,views:489200,resolutionTag:"8K MASTER",aspectRatio:"16:9",orientation:"desktop",dominantColor:"#a855f7",artist:"CelestialStudio",dateAdded:"2026-08-20",tags:["Gojo","Domain Expansion","Cosmic Moon","Six Eyes","Jujutsu Kaisen","Infinity"],description:"Satoru Gojo casts his ultimate Domain Expansion, Infinite Void, under a radiant purple celestial moon. Features 3D holographic space parallax with floating infinity symbols and cyan cursed energy sparks.",resolutions:[{name:"8K Ultra Master",width:7680,height:4320,size:"24.8 MB",label:"8K Master (Original)"},{name:"4K Ultra HD",width:3840,height:2160,size:"8.4 MB",label:"4K UHD (3840x2160)"},{name:"1080p Full HD",width:1920,height:1080,size:"2.8 MB",label:"1080p FHD (1920x1080)"},{name:"Mobile Vertical",width:1080,height:1920,size:"3.1 MB",label:"Mobile (9:16 Vertical)"},{name:"Ultrawide 21:9",width:3440,height:1440,size:"7.2 MB",label:"Ultrawide (3440x1440)"}]},{id:"tanjiro-sun-breathing",title:"Hinokami Kagura // Solar Dragon",japaneseTitle:"ヒノカミ神楽 (Hinokami Kagura)",anime:"Demon Slayer",animeId:"demon-slayer",character:"Tanjiro Kamado",image:"/wallpapers/tanjiro_sun_breathing.jpg",thumbnail:"/wallpapers/tanjiro_sun_breathing.jpg",is3D:!0,isBestView:!1,isTrending:!0,featured:!0,rating:4.9,reviewCount:2980,downloads:118400,views:390100,resolutionTag:"8K MASTER",aspectRatio:"16:9",orientation:"desktop",dominantColor:"#f97316",artist:"UfotableVibes",dateAdded:"2026-08-18",tags:["Tanjiro","Sun Breathing","Hinokami Kagura","Demon Slayer","Dragon Flame","Kimetsu"],description:"Tanjiro Kamado unleashes the blazing Sun Breathing dragon sword form under a bright full moon and night sky, accompanied by swirling crimson embers and golden solar fury.",resolutions:[{name:"8K Ultra Master",width:7680,height:4320,size:"22.6 MB",label:"8K Master (Original)"},{name:"4K Ultra HD",width:3840,height:2160,size:"7.9 MB",label:"4K UHD (3840x2160)"},{name:"1080p Full HD",width:1920,height:1080,size:"2.6 MB",label:"1080p FHD (1920x1080)"},{name:"Mobile Vertical",width:1080,height:1920,size:"2.9 MB",label:"Mobile (9:16 Vertical)"}]},{id:"luffy-gear-5",title:"Sun God Nika // Moon Dance",japaneseTitle:"太陽の神ニカ (Taiyō no Kami Nika)",anime:"One Piece",animeId:"one-piece",character:"Monkey D. Luffy",image:"/wallpapers/luffy_gear5_moon.jpg",thumbnail:"/wallpapers/luffy_gear5_moon.jpg",is3D:!0,isBestView:!1,isTrending:!0,featured:!0,rating:5,reviewCount:4210,downloads:168900,views:520400,resolutionTag:"8K MASTER",aspectRatio:"16:9",orientation:"desktop",dominantColor:"#38bdf8",artist:"JoyBoyArt",dateAdded:"2026-08-25",tags:["Luffy","Gear 5","Nika","One Piece","Liberation","Drums of Liberation"],description:"Monkey D. Luffy dances across the starry night sky in front of an immense radiant moon as the Warrior of Liberation, laughing with unrestrained freedom and joy.",resolutions:[{name:"8K Ultra Master",width:7680,height:4320,size:"21.5 MB",label:"8K Master (Original)"},{name:"4K Ultra HD",width:3840,height:2160,size:"7.4 MB",label:"4K UHD (3840x2160)"},{name:"1080p Full HD",width:1920,height:1080,size:"2.5 MB",label:"1080p FHD (1920x1080)"}]},{id:"lucy-cyberpunk-moon",title:"Fly Me to the Moon // Night City",japaneseTitle:"月へ連れてって (Tsuki e Tsuretette)",anime:"Cyberpunk: Edgerunners",animeId:"cyberpunk",character:"Lucy",image:"/wallpapers/lucy_cyberpunk_moon.jpg",thumbnail:"/wallpapers/lucy_cyberpunk_moon.jpg",is3D:!0,isBestView:!1,isTrending:!0,featured:!0,rating:4.95,reviewCount:3150,downloads:134200,views:412e3,resolutionTag:"8K MASTER",aspectRatio:"16:9",orientation:"desktop",dominantColor:"#06b6d4",artist:"NetrunnerStudio",dateAdded:"2026-08-22",tags:["Lucy","Cyberpunk","Edgerunners","Night City","Holographic Moon","Synthwave"],description:"Lucy sits perched atop a dizzying Night City skyscraper dreaming of the celestial moon, illuminated by pastel neon glows, flying aerodynes, and digital stardust.",resolutions:[{name:"8K Ultra Master",width:7680,height:4320,size:"23.1 MB",label:"8K Master (Original)"},{name:"4K Ultra HD",width:3840,height:2160,size:"8.1 MB",label:"4K UHD (3840x2160)"},{name:"1080p Full HD",width:1920,height:1080,size:"2.7 MB",label:"1080p FHD (1920x1080)"},{name:"Mobile Vertical",width:1080,height:1920,size:"3.0 MB",label:"Mobile (9:16 Vertical)"}]},{id:"jinwoo-shadow-monarch",title:"Arise // The Shadow Sovereign",japaneseTitle:"그림자 군주 (Shadow Monarch)",anime:"Solo Leveling",animeId:"solo-leveling",character:"Sung Jin-Woo",image:"/wallpapers/jinwoo_shadow_monarch.jpg",thumbnail:"/wallpapers/jinwoo_shadow_monarch.jpg",is3D:!0,isBestView:!1,isTrending:!0,featured:!0,rating:4.98,reviewCount:3600,downloads:155300,views:467800,resolutionTag:"8K MASTER",aspectRatio:"16:9",orientation:"desktop",dominantColor:"#8b5cf6",artist:"MonarchGraphics",dateAdded:"2026-08-28",tags:["Jinwoo","Solo Leveling","Shadow Monarch","Arise","Eclipse","Igris"],description:"Sung Jin-Woo summons the legion of shadows under a glowing violet eclipse moon. Glowing blue-purple eyes and spectral shadow energy permeate the battlefield.",resolutions:[{name:"8K Ultra Master",width:7680,height:4320,size:"25.0 MB",label:"8K Master (Original)"},{name:"4K Ultra HD",width:3840,height:2160,size:"8.6 MB",label:"4K UHD (3840x2160)"},{name:"1080p Full HD",width:1920,height:1080,size:"2.9 MB",label:"1080p FHD (1920x1080)"}]},{id:"eren-founding-titan",title:"The Rumbling // Blood Moon Origin",japaneseTitle:"地鳴らし (Jinarashi)",anime:"Attack on Titan",animeId:"attack-on-titan",character:"Eren Yeager",image:"/wallpapers/eren_founding_titan.jpg",thumbnail:"/wallpapers/eren_founding_titan.jpg",is3D:!0,isBestView:!1,isTrending:!0,featured:!0,rating:4.9,reviewCount:2840,downloads:112e3,views:345e3,resolutionTag:"8K MASTER",aspectRatio:"16:9",orientation:"desktop",dominantColor:"#ef4444",artist:"ParadisArchive",dateAdded:"2026-08-15",tags:["Eren","Founding Titan","Attack on Titan","Blood Moon","Rumbling","Shingeki"],description:"Eren Yeager stands resolutely before the colossal skeletal Founding Titan beneath a menacing blood-red moon, with steaming titan sparks and lightning crackling.",resolutions:[{name:"8K Ultra Master",width:7680,height:4320,size:"22.0 MB",label:"8K Master (Original)"},{name:"4K Ultra HD",width:3840,height:2160,size:"7.6 MB",label:"4K UHD (3840x2160)"},{name:"1080p Full HD",width:1920,height:1080,size:"2.4 MB",label:"1080p FHD (1920x1080)"}]},{id:"naruto-kurama-sage",title:"Six Paths Sage // Golden Kurama Cloak",japaneseTitle:"六道仙人モード (Rikudō Sennin)",anime:"Naruto Shippuden",animeId:"naruto",character:"Naruto Uzumaki",image:"/wallpapers/naruto_kurama_sage.svg",thumbnail:"/wallpapers/naruto_kurama_sage.svg",is3D:!0,isBestView:!1,isTrending:!1,featured:!0,rating:4.85,reviewCount:2100,downloads:87400,views:29e4,resolutionTag:"4K UHD",aspectRatio:"16:9",orientation:"desktop",dominantColor:"#f59e0b",artist:"HokageVisuals",dateAdded:"2026-08-10",tags:["Naruto","Six Paths","Kurama","Sage Mode","Chakra","Rasengan"],description:"Naruto Uzumaki in Six Paths Kurama Chakra mode with glowing truth-seeking orbs and golden chakra flame ribbons under a full celestial moon.",resolutions:[{name:"4K Ultra HD",width:3840,height:2160,size:"6.8 MB",label:"4K UHD (3840x2160)"},{name:"1080p Full HD",width:1920,height:1080,size:"2.2 MB",label:"1080p FHD (1920x1080)"},{name:"Mobile Vertical",width:1080,height:1920,size:"2.5 MB",label:"Mobile (9:16 Vertical)"}]},{id:"sukuna-malevolent-shrine",title:"Malevolent Shrine // King of Curses",japaneseTitle:"伏魔御廚子 (Fukuma Mizushi)",anime:"Jujutsu Kaisen",animeId:"jujutsu-kaisen",character:"Ryomen Sukuna",image:"/wallpapers/sukuna_malevolent_shrine.svg",thumbnail:"/wallpapers/sukuna_malevolent_shrine.svg",is3D:!0,isBestView:!1,isTrending:!0,featured:!1,rating:4.92,reviewCount:3100,downloads:129e3,views:38e4,resolutionTag:"4K UHD",aspectRatio:"16:9",orientation:"desktop",dominantColor:"#ef4444",artist:"CurseRealm",dateAdded:"2026-08-24",tags:["Sukuna","Malevolent Shrine","Dismantle","Cleave","Jujutsu Kaisen"],description:"Ryomen Sukuna sits on his throne surrounded by skull pillars and blood-red domain expansion under an ominous lunar eclipse.",resolutions:[{name:"4K Ultra HD",width:3840,height:2160,size:"7.2 MB",label:"4K UHD (3840x2160)"},{name:"1080p Full HD",width:1920,height:1080,size:"2.4 MB",label:"1080p FHD (1920x1080)"}]},{id:"zenitsu-thunder-god",title:"Flaming Thunder God // 7th Form",japaneseTitle:"雷の呼吸 漆ノ型 (Honoikazuchi no Kami)",anime:"Demon Slayer",animeId:"demon-slayer",character:"Zenitsu Agatsuma",image:"/wallpapers/zenitsu_thunder_god.svg",thumbnail:"/wallpapers/zenitsu_thunder_god.svg",is3D:!0,isBestView:!1,isTrending:!1,featured:!1,rating:4.88,reviewCount:1890,downloads:74200,views:245e3,resolutionTag:"4K UHD",aspectRatio:"16:9",orientation:"desktop",dominantColor:"#eab308",artist:"ThunderStrike",dateAdded:"2026-08-05",tags:["Zenitsu","Thunder Breathing","Godspeed","Demon Slayer","Lightning"],description:"Zenitsu delivers his signature 7th Form Flaming Thunder God attack with piercing golden lightning arcs under a midnight sky.",resolutions:[{name:"4K Ultra HD",width:3840,height:2160,size:"6.9 MB",label:"4K UHD (3840x2160)"},{name:"1080p Full HD",width:1920,height:1080,size:"2.3 MB",label:"1080p FHD (1920x1080)"}]},{id:"itachi-tsukuyomi-blood-moon",title:"Tsukuyomi Illusion // Crows of Fate",japaneseTitle:"月読 (Tsukuyomi)",anime:"Naruto Shippuden",animeId:"naruto",character:"Itachi Uchiha",image:"/wallpapers/itachi_blood_moon.svg",thumbnail:"/wallpapers/itachi_blood_moon.svg",is3D:!0,isBestView:!1,isTrending:!0,featured:!1,rating:4.97,reviewCount:3900,downloads:149e3,views:45e4,resolutionTag:"4K UHD",aspectRatio:"16:9",orientation:"desktop",dominantColor:"#dc2626",artist:"UchihaClan",dateAdded:"2026-08-12",tags:["Itachi","Sharingan","Tsukuyomi","Naruto","Crows","Blood Moon"],description:"Itachi Uchiha with glowing Mangekyo Sharingan eyes against a crimson moon as black crows scatter into the ether.",resolutions:[{name:"4K Ultra HD",width:3840,height:2160,size:"7.5 MB",label:"4K UHD (3840x2160)"},{name:"1080p Full HD",width:1920,height:1080,size:"2.5 MB",label:"1080p FHD (1920x1080)"}]},{id:"megumi-chimera-shadow",title:"Chimera Shadow Garden // Ten Shadows",japaneseTitle:"嵌合暗翳庭 (Kangō An'eitei)",anime:"Jujutsu Kaisen",animeId:"jujutsu-kaisen",character:"Megumi Fushiguro",image:"/wallpapers/megumi_chimera_garden.svg",thumbnail:"/wallpapers/megumi_chimera_garden.svg",is3D:!0,isBestView:!1,isTrending:!1,featured:!1,rating:4.82,reviewCount:1450,downloads:62e3,views:198e3,resolutionTag:"4K UHD",aspectRatio:"16:9",orientation:"desktop",dominantColor:"#06b6d4",artist:"ShadowWeaver",dateAdded:"2026-08-01",tags:["Megumi","Ten Shadows","Mahoraga","Jujutsu Kaisen","Domain Expansion"],description:"Megumi Fushiguro weaves hand signs submerged in endless liquid shadow darkness beneath a mystical turquoise night.",resolutions:[{name:"4K Ultra HD",width:3840,height:2160,size:"6.5 MB",label:"4K UHD (3840x2160)"},{name:"1080p Full HD",width:1920,height:1080,size:"2.1 MB",label:"1080p FHD (1920x1080)"}]},{id:"levi-humanity-strongest",title:"Humanity's Strongest // Blade Cyclone",japaneseTitle:"人類最強の兵士 (Jinrui Saikyō)",anime:"Attack on Titan",animeId:"attack-on-titan",character:"Levi Ackerman",image:"/wallpapers/levi_beast_slayer.svg",thumbnail:"/wallpapers/levi_beast_slayer.svg",is3D:!0,isBestView:!1,isTrending:!1,featured:!1,rating:4.91,reviewCount:2650,downloads:98500,views:31e4,resolutionTag:"4K UHD",aspectRatio:"16:9",orientation:"desktop",dominantColor:"#10b981",artist:"ScoutRegiment",dateAdded:"2026-07-28",tags:["Levi","Ackerman","Attack on Titan","Scout Regiment","Survey Corps"],description:"Captain Levi Ackerman spinning through the emerald night air with ODM gear and dual steel blades reflecting moonlight.",resolutions:[{name:"4K Ultra HD",width:3840,height:2160,size:"6.7 MB",label:"4K UHD (3840x2160)"},{name:"1080p Full HD",width:1920,height:1080,size:"2.2 MB",label:"1080p FHD (1920x1080)"}]},{id:"chainsaw-devil-denji",title:"Chainsaw Hybrid // Blood Symphony",japaneseTitle:"チェンソーマン (Chainsaw Man)",anime:"Chainsaw Man",animeId:"chainsaw-man",character:"Denji",image:"/wallpapers/chainsaw_denji_hybrid.svg",thumbnail:"/wallpapers/chainsaw_denji_hybrid.svg",is3D:!0,isBestView:!1,isTrending:!1,featured:!1,rating:4.87,reviewCount:1980,downloads:81e3,views:26e4,resolutionTag:"4K UHD",aspectRatio:"16:9",orientation:"desktop",dominantColor:"#f97316",artist:"DevilHunterLab",dateAdded:"2026-07-20",tags:["Denji","Chainsaw Man","Pochita","Public Safety","Devil Hybrid"],description:"Denji transformed into the Chainsaw Devil with roaring mechanical blades sparking against the neon city night.",resolutions:[{name:"4K Ultra HD",width:3840,height:2160,size:"6.8 MB",label:"4K UHD (3840x2160)"},{name:"1080p Full HD",width:1920,height:1080,size:"2.3 MB",label:"1080p FHD (1920x1080)"}]},{id:"bleach-ichigo-bankai",title:"Tensa Zangetsu // Horn of Salvation",japaneseTitle:"天鎖斬月 (Tensa Zangetsu)",anime:"Bleach: TYBW",animeId:"bleach",character:"Ichigo Kurosaki",image:"/wallpapers/bleach_ichigo_bankai.svg",thumbnail:"/wallpapers/bleach_ichigo_bankai.svg",is3D:!0,isBestView:!1,isTrending:!1,featured:!1,rating:4.89,reviewCount:2200,downloads:91400,views:285e3,resolutionTag:"4K UHD",aspectRatio:"16:9",orientation:"desktop",dominantColor:"#3b82f6",artist:"SoulSocietyArt",dateAdded:"2026-07-15",tags:["Ichigo","Bleach","Bankai","Zangetsu","Getsuga Tensho","Quincy"],description:"Ichigo Kurosaki wielding true dual Zangetsu with spiritual blue pressure radiating outwards beneath the Soul King realm moon.",resolutions:[{name:"4K Ultra HD",width:3840,height:2160,size:"7.1 MB",label:"4K UHD (3840x2160)"},{name:"1080p Full HD",width:1920,height:1080,size:"2.4 MB",label:"1080p FHD (1920x1080)"}]}];class Te{constructor(){this.listeners=new Set;const e=localStorage.getItem("moon_view_favorites"),t=localStorage.getItem("moon_view_downloads"),a=localStorage.getItem("moon_view_user"),s=localStorage.getItem("moon_view_theme")||"cyan";this.state={currentView:"home",detailWallpaperId:"gojo-infinite-void",authTab:"login",user:a?JSON.parse(a):{id:"otaku_celestial_01",username:"CosmicOtaku",email:"collector@moonview.io",avatar:"/avatars/avatar_cosmic_hero.svg",rank:"Celestial Pioneer ★★★",joinedDate:"August 2026",downloadQuota:50,downloadsUsed:14},favorites:e?JSON.parse(e):["gojo-infinite-void","luffy-gear-5","lucy-cyberpunk-moon","jinwoo-shadow-monarch"],downloadHistory:t?JSON.parse(t):[{id:"dl_101",wallpaperId:"gojo-infinite-void",wallpaperTitle:"Infinite Void // Cosmic Horizon",anime:"Jujutsu Kaisen",resolution:"8K Ultra Master",timestamp:"2 hours ago",image:"/wallpapers/gojo_infinite_void.jpg"},{id:"dl_102",wallpaperId:"lucy-cyberpunk-moon",wallpaperTitle:"Fly Me to the Moon // Night City",anime:"Cyberpunk: Edgerunners",resolution:"4K Ultra HD",timestamp:"Yesterday",image:"/wallpapers/lucy_cyberpunk_moon.jpg"}],searchQuery:"",selectedAnime:"all",selectedResolution:"all",selectedOrientation:"all",selectedSort:"trending",filter3DOnly:!1,themeAccent:s,audioMuted:!0,quickSearchOpen:!1},document.documentElement.setAttribute("data-theme-accent",this.state.themeAccent)}subscribe(e){return this.listeners.add(e),()=>this.listeners.delete(e)}notify(){this.listeners.forEach(e=>e(this.state))}getState(){return this.state}navigate(e,t=null){this.state.currentView=e,t&&(this.state.detailWallpaperId=t),window.scrollTo({top:0,behavior:"smooth"}),this.notify()}openWallpaperDetail(e){this.state.detailWallpaperId=e,this.state.currentView="detail",window.scrollTo({top:0,behavior:"smooth"}),this.notify()}toggleFavorite(e){const t=this.state.favorites.indexOf(e);return t===-1?this.state.favorites.push(e):this.state.favorites.splice(t,1),localStorage.setItem("moon_view_favorites",JSON.stringify(this.state.favorites)),this.notify(),t===-1}isFavorite(e){return this.state.favorites.includes(e)}recordDownload(e,t){const a={id:"dl_"+Date.now(),wallpaperId:e.id,wallpaperTitle:e.title,anime:e.anime,resolution:t,timestamp:"Just now",image:e.image};this.state.downloadHistory.unshift(a),this.state.user&&(this.state.user.downloadsUsed=(this.state.user.downloadsUsed||0)+1,localStorage.setItem("moon_view_user",JSON.stringify(this.state.user))),localStorage.setItem("moon_view_downloads",JSON.stringify(this.state.downloadHistory)),this.notify()}login(e){this.state.user=e,localStorage.setItem("moon_view_user",JSON.stringify(e)),this.navigate("dashboard")}logout(){this.state.user=null,localStorage.removeItem("moon_view_user"),this.navigate("home")}updateProfile(e){this.state.user&&(this.state.user={...this.state.user,...e},localStorage.setItem("moon_view_user",JSON.stringify(this.state.user)),this.notify())}setThemeAccent(e){this.state.themeAccent=e,localStorage.setItem("moon_view_theme",e),document.documentElement.setAttribute("data-theme-accent",e),this.notify()}toggleAudio(){return this.state.audioMuted=!this.state.audioMuted,this.notify(),!this.state.audioMuted}setQuickSearch(e){this.state.quickSearchOpen=e,this.notify()}setFilters(e){this.state={...this.state,...e},this.notify()}getFilteredWallpapers(){let e=[...H];if(this.state.selectedAnime&&this.state.selectedAnime!=="all"&&(e=e.filter(t=>t.animeId===this.state.selectedAnime)),this.state.selectedResolution&&this.state.selectedResolution!=="all"&&(this.state.selectedResolution==="8k"?e=e.filter(t=>t.resolutionTag.includes("8K")):this.state.selectedResolution==="4k"&&(e=e.filter(t=>t.resolutionTag.includes("4K")||t.resolutionTag.includes("8K")))),this.state.selectedOrientation&&this.state.selectedOrientation!=="all"&&(e=e.filter(t=>t.orientation===this.state.selectedOrientation)),this.state.filter3DOnly&&(e=e.filter(t=>t.is3D)),this.state.searchQuery.trim()){const t=this.state.searchQuery.toLowerCase().trim();e=e.filter(a=>a.title.toLowerCase().includes(t)||a.anime.toLowerCase().includes(t)||a.character.toLowerCase().includes(t)||a.tags.some(s=>s.toLowerCase().includes(t)))}return this.state.selectedSort==="downloads"?e.sort((t,a)=>a.downloads-t.downloads):this.state.selectedSort==="rating"?e.sort((t,a)=>a.rating-t.rating):this.state.selectedSort==="newest"?e.sort((t,a)=>new Date(a.dateAdded)-new Date(t.dateAdded)):e.sort((t,a)=>(a.isTrending?1:0)-(t.isTrending?1:0)||a.views-t.views),e}getCurrentWallpaper(){return H.find(e=>e.id===this.state.detailWallpaperId)||H[0]}}const l=new Te;class De{constructor(){this.overlay=null,this.input=null,this.resultsContainer=null,this.init()}init(){this.createDom(),this.bindEvents()}createDom(){this.overlay=document.createElement("div"),this.overlay.className="modal-overlay",this.overlay.id="quick-search-modal-overlay",this.overlay.innerHTML=`
      <div class="quick-search-modal">
        <div style="display: flex; align-items: center; gap: 1rem; padding: 1.25rem 1.5rem; border-bottom: 1px solid var(--border-glass);">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--theme-accent)" stroke-width="2.5"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          <input type="text" class="quick-search-input" placeholder="Search anime, characters, tags (e.g. Gojo, Luffy, 8K)..." style="flex: 1; background: transparent; color: #ffffff; font-size: 1.1rem; outline: none; border: none;" />
          <button class="modal-close-btn" style="color: var(--text-muted); cursor: pointer; padding: 0.25rem;">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>
        <div class="quick-search-results" style="max-height: 400px; overflow-y: auto; padding: 0.75rem;"></div>
        <div style="display: flex; align-items: center; justify-content: space-between; padding: 0.75rem 1.5rem; border-top: 1px solid var(--border-subtle); font-size: 0.75rem; color: var(--text-muted); background: rgba(0,0,0,0.25);">
          <span>Navigate with <b>↑</b> <b>↓</b>, open with <b>Enter</b></span>
          <span><b>ESC</b> to close</span>
        </div>
      </div>
    `,document.body.appendChild(this.overlay),this.input=this.overlay.querySelector(".quick-search-input"),this.resultsContainer=this.overlay.querySelector(".quick-search-results")}bindEvents(){window.addEventListener("keydown",e=>{(e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==="k"?(e.preventDefault(),this.open()):e.key==="Escape"&&this.overlay.classList.contains("open")&&this.close()}),this.overlay.querySelector(".modal-close-btn").addEventListener("click",()=>this.close()),this.overlay.addEventListener("click",e=>{e.target===this.overlay&&this.close()}),this.input.addEventListener("input",e=>{this.renderResults(e.target.value)})}open(){this.overlay.classList.add("open"),this.input.value="",this.renderResults(""),setTimeout(()=>this.input.focus(),50)}close(){this.overlay.classList.remove("open")}renderResults(e){const t=e.toLowerCase().trim();let a=H;if(t&&(a=H.filter(s=>s.title.toLowerCase().includes(t)||s.anime.toLowerCase().includes(t)||s.character.toLowerCase().includes(t)||s.tags.some(o=>o.toLowerCase().includes(t)))),a.length===0){this.resultsContainer.innerHTML=`
        <div style="padding: 2.5rem; text-align: center; color: var(--text-muted);">
          <p>No 3D anime wallpapers found for "${e}"</p>
        </div>
      `;return}this.resultsContainer.innerHTML=a.slice(0,6).map(s=>`
      <div class="search-result-item" data-id="${s.id}" style="display: flex; align-items: center; gap: 1rem; padding: 0.75rem 1rem; border-radius: var(--radius-md); cursor: pointer; transition: background 0.15s ease;">
        <img src="${s.thumbnail}" style="width: 60px; height: 38px; object-fit: cover; border-radius: 6px; border: 1px solid var(--border-glass);" />
        <div style="flex: 1; min-width: 0;">
          <div style="font-weight: 700; color: #ffffff; font-size: 0.95rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${s.title}</div>
          <div style="font-size: 0.75rem; color: var(--theme-accent); font-family: var(--font-mono);">${s.anime} // ${s.character}</div>
        </div>
        <span class="badge badge-cyan">${s.resolutionTag}</span>
      </div>
    `).join(""),this.resultsContainer.querySelectorAll(".search-result-item").forEach(s=>{s.addEventListener("mouseenter",()=>{s.style.background="rgba(255, 255, 255, 0.08)"}),s.addEventListener("mouseleave",()=>{s.style.background="transparent"}),s.addEventListener("click",()=>{const o=s.dataset.id;this.close(),l.openWallpaperDetail(o)})})}}class Ae{constructor(){this.ctx=null,this.ambientOsc=null,this.ambientGain=null}initContext(){if(!this.ctx){const e=window.AudioContext||window.webkitAudioContext;e&&(this.ctx=new e)}this.ctx&&this.ctx.state==="suspended"&&this.ctx.resume()}playClick(){if(!l.getState().audioMuted&&(this.initContext(),!!this.ctx))try{const t=this.ctx.createOscillator(),a=this.ctx.createGain();t.type="sine",t.frequency.setValueAtTime(800,this.ctx.currentTime),t.frequency.exponentialRampToValueAtTime(1200,this.ctx.currentTime+.04),a.gain.setValueAtTime(.08,this.ctx.currentTime),a.gain.exponentialRampToValueAtTime(.001,this.ctx.currentTime+.06),t.connect(a),a.connect(this.ctx.destination),t.start(),t.stop(this.ctx.currentTime+.07)}catch{}}playHeart(){if(!l.getState().audioMuted&&(this.initContext(),!!this.ctx))try{const t=this.ctx.createOscillator(),a=this.ctx.createGain();t.type="triangle",t.frequency.setValueAtTime(520,this.ctx.currentTime),t.frequency.exponentialRampToValueAtTime(880,this.ctx.currentTime+.12),a.gain.setValueAtTime(.1,this.ctx.currentTime),a.gain.exponentialRampToValueAtTime(.001,this.ctx.currentTime+.15),t.connect(a),a.connect(this.ctx.destination),t.start(),t.stop(this.ctx.currentTime+.16)}catch{}}playSuccess(){if(!l.getState().audioMuted&&(this.initContext(),!!this.ctx))try{const t=this.ctx.currentTime;[523.25,659.25,783.99,1046.5].forEach((a,s)=>{const o=this.ctx.createOscillator(),r=this.ctx.createGain();o.type="sine",o.frequency.value=a,r.gain.setValueAtTime(.06,t+s*.06),r.gain.exponentialRampToValueAtTime(.001,t+s*.06+.18),o.connect(r),r.connect(this.ctx.destination),o.start(t+s*.06),o.stop(t+s*.06+.2)})}catch{}}toggleAmbient(e){if(!e){if(this.ambientOsc)try{this.ambientGain.gain.exponentialRampToValueAtTime(1e-4,this.ctx.currentTime+1),setTimeout(()=>{this.ambientOsc&&(this.ambientOsc.stop(),this.ambientOsc.disconnect(),this.ambientOsc=null)},1e3)}catch{}return}if(this.initContext(),!!this.ctx)try{this.ambientOsc=this.ctx.createOscillator(),this.ambientGain=this.ctx.createGain(),this.ambientOsc.type="sine",this.ambientOsc.frequency.setValueAtTime(55,this.ctx.currentTime),this.ambientGain.gain.setValueAtTime(1e-4,this.ctx.currentTime),this.ambientGain.gain.exponentialRampToValueAtTime(.03,this.ctx.currentTime+2),this.ambientOsc.connect(this.ambientGain),this.ambientGain.connect(this.ctx.destination),this.ambientOsc.start()}catch{}}}const m=new Ae;class Ee{constructor(e,t){this.container=e,this.quickSearch=t,this.mobileOpen=!1,this.init()}init(){this.render(),l.subscribe(()=>this.render()),window.addEventListener("scroll",()=>{const e=this.container.querySelector(".navbar");e&&(window.scrollY>20?e.classList.add("scrolled"):e.classList.remove("scrolled"))})}render(){const e=l.getState(),t=e.user,a=e.favorites.length,s=e.currentView;this.container.innerHTML=`
      <header class="navbar">
        <div class="container nav-container">
          <!-- Logo & Brand -->
          <a class="nav-brand" data-nav="home">
            <div class="logo-moon-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path></svg>
            </div>
            <div class="brand-text">
              <span class="brand-title">MOON_VIEW</span>
              <span class="brand-subtitle">3D ANIME VAULT</span>
            </div>
          </a>

          <!-- Desktop Nav Links -->
          <ul class="nav-links">
            <li><a class="nav-link ${s==="home"?"active":""}" data-nav="home">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path></svg>
              Home
            </a></li>
            <li><a class="nav-link ${s==="browse"?"active":""}" data-nav="browse">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="7" height="7" x="3" y="3" rx="1"></rect><rect width="7" height="7" x="14" y="3" rx="1"></rect><rect width="7" height="7" x="14" y="14" rx="1"></rect><rect width="7" height="7" x="3" y="14" rx="1"></rect></svg>
              Browse Gallery
            </a></li>
            <li><a class="nav-link" data-action="scroll-best-view">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
              Best View VIP
            </a></li>
            <li><a class="nav-link ${s==="dashboard"?"active":""}" data-nav="${t?"dashboard":"auth"}">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
              ${t?"Dashboard":"Sign In"}
            </a></li>
          </ul>

          <!-- Nav Right Actions -->
          <div class="nav-actions">
            <!-- Search Trigger -->
            <button class="nav-search-trigger" id="btn-quick-search-trigger" title="Quick Search (Cmd+K)">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              <span>Search Anime...</span>
              <span class="search-kbd-badge">⌘K</span>
            </button>

            <!-- Audio Ambient Toggle -->
            <button class="btn-icon ${e.audioMuted?"":"active"}" id="btn-audio-toggle" title="${e.audioMuted?"Unmute Ambient Sound":"Mute Ambient Sound"}">
              ${e.audioMuted?'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></svg>':'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path><path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path></svg>'}
            </button>

            <!-- Theme Accent Cycle -->
            <button class="btn-icon" id="btn-theme-cycle" title="Change Theme Accent Glow (Cyan / Purple / Pink / Gold)">
              <div style="width: 14px; height: 14px; border-radius: 50%; background: var(--theme-gradient); box-shadow: 0 0 8px var(--theme-accent-glow);"></div>
            </button>

            <!-- Favorites Counter -->
            <button class="btn-icon ${a>0?"active":""}" id="btn-nav-favorites" title="My Liked Wallpapers (${a})">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="${a>0?"currentColor":"none"}" stroke="currentColor" stroke-width="2"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path></svg>
            </button>

            <!-- User Auth Pill / Button -->
            ${t?`
              <div class="nav-user-pill" data-nav="dashboard" title="Open User Dashboard">
                <img src="${t.avatar}" class="nav-avatar-img" alt="avatar" />
                <span class="nav-username-text">${t.username}</span>
              </div>
            `:`
              <button class="btn btn-primary" style="padding: 0.5rem 1.15rem; font-size: 0.85rem;" data-nav="auth">
                Sign In
              </button>
            `}

            <!-- Mobile Hamburger Toggle -->
            <button class="btn-icon mobile-menu-btn" id="btn-mobile-toggle">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="4" y1="12" x2="20" y2="12"></line><line x1="4" y1="6" x2="20" y2="6"></line><line x1="4" y1="18" x2="20" y2="18"></line></svg>
            </button>
          </div>
        </div>

        <!-- Mobile Drawer Menu -->
        <div class="mobile-drawer ${this.mobileOpen?"open":""}" style="display: ${this.mobileOpen?"flex":"none"}; flex-direction: column; gap: 1rem; padding: 1.5rem; background: var(--bg-card); border-bottom: 1px solid var(--border-neon);">
          <a class="nav-link" data-nav="home">Home</a>
          <a class="nav-link" data-nav="browse">Browse Gallery</a>
          <a class="nav-link" data-action="scroll-best-view">Best View VIP</a>
          <a class="nav-link" data-nav="${t?"dashboard":"auth"}">${t?"Dashboard ("+t.username+")":"Sign In / Sign Up"}</a>
        </div>
      </header>
    `,this.bindEvents()}bindEvents(){this.container.querySelectorAll("[data-nav]").forEach(r=>{r.addEventListener("click",c=>{c.preventDefault();const p=r.getAttribute("data-nav");m.playClick(),this.mobileOpen=!1,l.navigate(p)})}),this.container.querySelectorAll('[data-action="scroll-best-view"]').forEach(r=>{r.addEventListener("click",()=>{if(m.playClick(),this.mobileOpen=!1,l.getState().currentView!=="home")l.navigate("home"),setTimeout(()=>{const c=document.getElementById("best-view-showcase");c&&c.scrollIntoView({behavior:"smooth"})},100);else{const c=document.getElementById("best-view-showcase");c&&c.scrollIntoView({behavior:"smooth"})}})});const e=this.container.querySelector("#btn-quick-search-trigger");e&&e.addEventListener("click",()=>{m.playClick(),this.quickSearch&&this.quickSearch.open()});const t=this.container.querySelector("#btn-audio-toggle");t&&t.addEventListener("click",()=>{const r=l.toggleAudio();m.toggleAmbient(r),r&&m.playClick()});const a=this.container.querySelector("#btn-theme-cycle");a&&a.addEventListener("click",()=>{m.playClick();const r=l.getState().themeAccent,c=["cyan","purple","pink","gold"],p=c[(c.indexOf(r)+1)%c.length];l.setThemeAccent(p)});const s=this.container.querySelector("#btn-nav-favorites");s&&s.addEventListener("click",()=>{m.playClick(),l.getState().user?l.navigate("dashboard"):l.navigate("browse")});const o=this.container.querySelector("#btn-mobile-toggle");o&&o.addEventListener("click",()=>{this.mobileOpen=!this.mobileOpen,this.render()})}}let q=null;function $e(){return q||(q=document.getElementById("toast-container"),q||(q=document.createElement("div"),q.id="toast-container",q.className="toast-container",document.body.appendChild(q))),q}function B(S,e="info",t=3e3){const a=$e(),s=document.createElement("div");s.className=`toast-item toast-${e}`;const o=e==="success"?'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>':'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>';s.innerHTML=`
    ${o}
    <span>${S}</span>
  `,a.appendChild(s),setTimeout(()=>{s.style.opacity="0",s.style.transform="translateY(10px)",s.style.transition="all 0.3s ease",setTimeout(()=>{s.parentNode&&s.parentNode.removeChild(s)},300)},t)}class Le{constructor(e){this.container=e,this.init()}init(){this.render()}render(){this.container.innerHTML=`
      <footer class="site-footer">
        <div class="container">
          <div class="footer-top-grid">
            <!-- Brand Column -->
            <div class="footer-brand-col">
              <div class="nav-brand" style="margin-bottom: 0.5rem;">
                <div class="logo-moon-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path></svg>
                </div>
                <div class="brand-text">
                  <span class="brand-title">MOON_VIEW</span>
                  <span class="brand-subtitle">STEP INTO ANOTHER DIMENSION</span>
                </div>
              </div>
              <p class="footer-desc">
                The premier destination for 3D animated anime wallpapers, parallax celestial artworks, and ultra-high-definition master renders. 100% Free & Open Creator Community.
              </p>
              <div style="display: flex; gap: 0.75rem; margin-top: 0.5rem;">
                <a href="https://discord.com" target="_blank" class="btn-icon" title="Join Discord Community">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/></svg>
                </a>
                <a href="https://twitter.com" target="_blank" class="btn-icon" title="Follow on X / Twitter">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                </a>
                <a href="https://github.com" target="_blank" class="btn-icon" title="View Source on GitHub">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>
                </a>
              </div>
            </div>

            <!-- Fast Navigation -->
            <div>
              <h4 class="footer-col-title">Navigation</h4>
              <ul class="footer-links-list">
                <li><a data-nav="home">Home Universe</a></li>
                <li><a data-nav="browse">Browse 3D Gallery</a></li>
                <li><a data-action="scroll-best-view">Best View Showcase</a></li>
                <li><a data-nav="dashboard">User Dashboard</a></li>
                <li><a data-nav="auth">Join / Sign In</a></li>
              </ul>
            </div>

            <!-- Categories -->
            <div>
              <h4 class="footer-col-title">Top Franchises</h4>
              <ul class="footer-links-list">
                <li><a data-filter-anime="jujutsu-kaisen">Jujutsu Kaisen</a></li>
                <li><a data-filter-anime="demon-slayer">Demon Slayer</a></li>
                <li><a data-filter-anime="one-piece">One Piece</a></li>
                <li><a data-filter-anime="solo-leveling">Solo Leveling</a></li>
                <li><a data-filter-anime="cyberpunk">Cyberpunk: Edgerunners</a></li>
                <li><a data-filter-anime="attack-on-titan">Attack on Titan</a></li>
              </ul>
            </div>

            <!-- Newsletter & Discord -->
            <div>
              <h4 class="footer-col-title">Cosmic Drops Newsletter</h4>
              <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 1rem; line-height: 1.5;">
                Get weekly drops of limited edition 8K live parallax anime wallpapers directly to your inbox.
              </p>
              <form id="footer-newsletter-form" style="display: flex; gap: 0.5rem;">
                <input type="email" id="footer-email-input" placeholder="Enter your email..." required style="flex: 1; padding: 0.65rem 1rem; border-radius: var(--radius-md); background: rgba(0,0,0,0.4); border: 1px solid var(--border-glass); color: #ffffff; font-size: 0.85rem;" />
                <button type="submit" class="btn btn-primary" style="padding: 0.65rem 1rem; font-size: 0.85rem;">
                  Join
                </button>
              </form>
            </div>
          </div>

          <!-- Bottom Legal & Status Bar -->
          <div class="footer-bottom-bar">
            <div>
              © 2026 MOON_VIEW Studio. All rights reserved. Anime characters and trademarks belong to their respective creators & studios.
            </div>
            <div style="display: flex; align-items: center; gap: 1.5rem;">
              <span style="display: inline-flex; align-items: center; gap: 0.4rem; color: #34d399; font-family: var(--font-mono); font-size: 0.75rem;">
                <span style="width: 8px; height: 8px; border-radius: 50%; background: #10b981; box-shadow: 0 0 8px #10b981;"></span>
                3D CDN Operational (99.9%)
              </span>
              <a href="#" style="color: var(--text-muted); font-size: 0.75rem;">Privacy Policy</a>
              <a href="#" style="color: var(--text-muted); font-size: 0.75rem;">Terms of Service</a>
              <a href="#" style="color: var(--text-muted); font-size: 0.75rem;">DMCA Notice</a>
            </div>
          </div>
        </div>
      </footer>
    `,this.bindEvents()}bindEvents(){this.container.querySelectorAll("[data-nav]").forEach(t=>{t.addEventListener("click",a=>{a.preventDefault(),m.playClick(),l.navigate(t.getAttribute("data-nav"))})}),this.container.querySelectorAll("[data-filter-anime]").forEach(t=>{t.addEventListener("click",a=>{a.preventDefault(),m.playClick();const s=t.getAttribute("data-filter-anime");l.setFilters({selectedAnime:s}),l.navigate("browse")})});const e=this.container.querySelector("#footer-newsletter-form");e&&e.addEventListener("submit",t=>{t.preventDefault(),m.playSuccess();const a=this.container.querySelector("#footer-email-input");a&&(B(`Welcome to the Moon View dimension, ${a.value}!`,"success"),a.value="")})}}function G(S=document){S.querySelectorAll(".wallpaper-card, [data-tilt]").forEach(t=>{if(t._tiltInitialized)return;t._tiltInitialized=!0;let a=t.querySelector(".card-glare");a||(a=document.createElement("div"),a.className="card-glare",t.appendChild(a));const s=14,o=c=>{const p=t.getBoundingClientRect(),d=c.clientX-p.left,f=c.clientY-p.top,u=p.width/2,I=p.height/2,E=(f-I)/I*-s,F=(d-u)/u*s;t.style.transform=`perspective(1000px) rotateX(${E.toFixed(2)}deg) rotateY(${F.toFixed(2)}deg) scale3d(1.025, 1.025, 1.025)`;const $=d/p.width*100,C=f/p.height*100;a.style.background=`radial-gradient(circle at ${$}% ${C}%, rgba(255, 255, 255, 0.35) 0%, transparent 65%)`},r=()=>{t.style.transform="perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)"};t.addEventListener("mousemove",o),t.addEventListener("mouseleave",r)})}var Q={};(function S(e,t,a,s){var o=!!(e.Worker&&e.Blob&&e.Promise&&e.OffscreenCanvas&&e.OffscreenCanvasRenderingContext2D&&e.HTMLCanvasElement&&e.HTMLCanvasElement.prototype.transferControlToOffscreen&&e.URL&&e.URL.createObjectURL),r=typeof Path2D=="function"&&typeof DOMMatrix=="function",c=function(){if(!e.OffscreenCanvas)return!1;try{var n=new OffscreenCanvas(1,1),i=n.getContext("2d");i.fillRect(0,0,1,1);var h=n.transferToImageBitmap();i.createPattern(h,"no-repeat")}catch{return!1}return!0}();function p(){}function d(n){var i=t.exports.Promise,h=i!==void 0?i:e.Promise;return typeof h=="function"?new h(n):(n(p,p),null)}var f=function(n,i){return{transform:function(h){if(n)return h;if(i.has(h))return i.get(h);var v=new OffscreenCanvas(h.width,h.height),b=v.getContext("2d");return b.drawImage(h,0,0),i.set(h,v),v},clear:function(){i.clear()}}}(c,new Map),u=function(){var n=Math.floor(16.666666666666668),i,h,v={},b=0;return typeof requestAnimationFrame=="function"&&typeof cancelAnimationFrame=="function"?(i=function(y){var w=Math.random();return v[w]=requestAnimationFrame(function g(x){b===x||b+n-1<x?(b=x,delete v[w],y()):v[w]=requestAnimationFrame(g)}),w},h=function(y){v[y]&&cancelAnimationFrame(v[y])}):(i=function(y){return setTimeout(y,n)},h=function(y){return clearTimeout(y)}),{frame:i,cancel:h}}(),I=function(){var n,i,h={};function v(b){function y(w,g){b.postMessage({options:w||{},callback:g})}b.init=function(g){var x=g.transferControlToOffscreen();b.postMessage({canvas:x},[x])},b.fire=function(g,x,M){if(i)return y(g,null),i;var D=Math.random().toString(36).slice(2);return i=d(function(T){function A(L){L.data.callback===D&&(delete h[D],b.removeEventListener("message",A),i=null,f.clear(),M(),T())}b.addEventListener("message",A),y(g,D),h[D]=A.bind(null,{data:{callback:D}})}),i},b.reset=function(){b.postMessage({reset:!0});for(var g in h)h[g](),delete h[g]}}return function(){if(n)return n;if(!a&&o){var b=["var CONFETTI, SIZE = {}, module = {};","("+S.toString()+")(this, module, true, SIZE);","onmessage = function(msg) {","  if (msg.data.options) {","    CONFETTI(msg.data.options).then(function () {","      if (msg.data.callback) {","        postMessage({ callback: msg.data.callback });","      }","    });","  } else if (msg.data.reset) {","    CONFETTI && CONFETTI.reset();","  } else if (msg.data.resize) {","    SIZE.width = msg.data.resize.width;","    SIZE.height = msg.data.resize.height;","  } else if (msg.data.canvas) {","    SIZE.width = msg.data.canvas.width;","    SIZE.height = msg.data.canvas.height;","    CONFETTI = module.exports.create(msg.data.canvas);","  }","}"].join(`
`);try{n=new Worker(URL.createObjectURL(new Blob([b])))}catch(y){return typeof console<"u"&&typeof console.warn=="function"&&console.warn("🎊 Could not load worker",y),null}v(n)}return n}}(),E={particleCount:50,angle:90,spread:45,startVelocity:45,decay:.9,gravity:1,drift:0,ticks:200,x:.5,y:.5,shapes:["square","circle"],zIndex:100,colors:["#26ccff","#a25afd","#ff5e7e","#88ff5a","#fcff42","#ffa62d","#ff36ff"],disableForReducedMotion:!1,scalar:1};function F(n,i){return i?i(n):n}function $(n){return n!=null}function C(n,i,h){return F(n&&$(n[i])?n[i]:E[i],h)}function U(n){return n<0?0:Math.floor(n)}function K(n,i){return Math.floor(Math.random()*(i-n))+n}function j(n){return parseInt(n,16)}function N(n){return n.map(ne)}function ne(n){var i=String(n).replace(/[^0-9a-f]/gi,"");return i.length<6&&(i=i[0]+i[0]+i[1]+i[1]+i[2]+i[2]),{r:j(i.substring(0,2)),g:j(i.substring(2,4)),b:j(i.substring(4,6))}}function re(n){var i=C(n,"origin",Object);return i.x=C(i,"x",Number),i.y=C(i,"y",Number),i}function oe(n){n.width=document.documentElement.clientWidth,n.height=document.documentElement.clientHeight}function le(n){var i=n.getBoundingClientRect();n.width=i.width,n.height=i.height}function de(n){var i=document.createElement("canvas");return i.style.position="fixed",i.style.top="0px",i.style.left="0px",i.style.pointerEvents="none",i.style.zIndex=n,i}function ce(n,i,h,v,b,y,w,g,x){n.save(),n.translate(i,h),n.rotate(y),n.scale(v,b),n.arc(0,0,1,w,g,x),n.restore()}function he(n){var i=n.angle*(Math.PI/180),h=n.spread*(Math.PI/180);return{x:n.x,y:n.y,wobble:Math.random()*10,wobbleSpeed:Math.min(.11,Math.random()*.1+.05),velocity:n.startVelocity*.5+Math.random()*n.startVelocity,angle2D:-i+(.5*h-Math.random()*h),tiltAngle:(Math.random()*(.75-.25)+.25)*Math.PI,color:n.color,shape:n.shape,tick:0,totalTicks:n.ticks,decay:n.decay,drift:n.drift,random:Math.random()+2,tiltSin:0,tiltCos:0,wobbleX:0,wobbleY:0,gravity:n.gravity*3,ovalScalar:.6,scalar:n.scalar,flat:n.flat}}function ue(n,i){i.x+=Math.cos(i.angle2D)*i.velocity+i.drift,i.y+=Math.sin(i.angle2D)*i.velocity+i.gravity,i.velocity*=i.decay,i.flat?(i.wobble=0,i.wobbleX=i.x+10*i.scalar,i.wobbleY=i.y+10*i.scalar,i.tiltSin=0,i.tiltCos=0,i.random=1):(i.wobble+=i.wobbleSpeed,i.wobbleX=i.x+10*i.scalar*Math.cos(i.wobble),i.wobbleY=i.y+10*i.scalar*Math.sin(i.wobble),i.tiltAngle+=.1,i.tiltSin=Math.sin(i.tiltAngle),i.tiltCos=Math.cos(i.tiltAngle),i.random=Math.random()+2);var h=i.tick++/i.totalTicks,v=i.x+i.random*i.tiltCos,b=i.y+i.random*i.tiltSin,y=i.wobbleX+i.random*i.tiltCos,w=i.wobbleY+i.random*i.tiltSin;if(n.fillStyle="rgba("+i.color.r+", "+i.color.g+", "+i.color.b+", "+(1-h)+")",n.beginPath(),r&&i.shape.type==="path"&&typeof i.shape.path=="string"&&Array.isArray(i.shape.matrix))n.fill(me(i.shape.path,i.shape.matrix,i.x,i.y,Math.abs(y-v)*.1,Math.abs(w-b)*.1,Math.PI/10*i.wobble));else if(i.shape.type==="bitmap"){var g=Math.PI/10*i.wobble,x=Math.abs(y-v)*.1,M=Math.abs(w-b)*.1,D=i.shape.bitmap.width*i.scalar,T=i.shape.bitmap.height*i.scalar,A=new DOMMatrix([Math.cos(g)*x,Math.sin(g)*x,-Math.sin(g)*M,Math.cos(g)*M,i.x,i.y]);A.multiplySelf(new DOMMatrix(i.shape.matrix));var L=n.createPattern(f.transform(i.shape.bitmap),"no-repeat");L.setTransform(A),n.globalAlpha=1-h,n.fillStyle=L,n.fillRect(i.x-D/2,i.y-T/2,D,T),n.globalAlpha=1}else if(i.shape==="circle")n.ellipse?n.ellipse(i.x,i.y,Math.abs(y-v)*i.ovalScalar,Math.abs(w-b)*i.ovalScalar,Math.PI/10*i.wobble,0,2*Math.PI):ce(n,i.x,i.y,Math.abs(y-v)*i.ovalScalar,Math.abs(w-b)*i.ovalScalar,Math.PI/10*i.wobble,0,2*Math.PI);else if(i.shape==="star")for(var k=Math.PI/2*3,z=4*i.scalar,_=8*i.scalar,O=i.x,P=i.y,V=5,R=Math.PI/V;V--;)O=i.x+Math.cos(k)*_,P=i.y+Math.sin(k)*_,n.lineTo(O,P),k+=R,O=i.x+Math.cos(k)*z,P=i.y+Math.sin(k)*z,n.lineTo(O,P),k+=R;else n.moveTo(Math.floor(i.x),Math.floor(i.y)),n.lineTo(Math.floor(i.wobbleX),Math.floor(b)),n.lineTo(Math.floor(y),Math.floor(w)),n.lineTo(Math.floor(v),Math.floor(i.wobbleY));return n.closePath(),n.fill(),i.tick<i.totalTicks}function pe(n,i,h,v,b){var y=i.slice(),w=n.getContext("2d"),g,x,M=d(function(D){function T(){g=x=null,w.clearRect(0,0,v.width,v.height),f.clear(),b(),D()}function A(){a&&!(v.width===s.width&&v.height===s.height)&&(v.width=n.width=s.width,v.height=n.height=s.height),!v.width&&!v.height&&(h(n),v.width=n.width,v.height=n.height),w.clearRect(0,0,v.width,v.height),y=y.filter(function(L){return ue(w,L)}),y.length?g=u.frame(A):T()}g=u.frame(A),x=T});return{addFettis:function(D){return y=y.concat(D),M},canvas:n,promise:M,reset:function(){g&&u.cancel(g),x&&x()}}}function Y(n,i){var h=!n,v=!!C(i||{},"resize"),b=!1,y=C(i,"disableForReducedMotion",Boolean),w=o&&!!C(i||{},"useWorker"),g=w?I():null,x=h?oe:le,M=n&&g?!!n.__confetti_initialized:!1,D=typeof matchMedia=="function"&&matchMedia("(prefers-reduced-motion)").matches,T;function A(k,z,_){for(var O=C(k,"particleCount",U),P=C(k,"angle",Number),V=C(k,"spread",Number),R=C(k,"startVelocity",Number),fe=C(k,"decay",Number),be=C(k,"gravity",Number),ye=C(k,"drift",Number),ee=C(k,"colors",N),we=C(k,"ticks",Number),te=C(k,"shapes"),xe=C(k,"scalar"),ke=!!C(k,"flat"),ae=re(k),ie=O,Z=[],Se=n.width*ae.x,Me=n.height*ae.y;ie--;)Z.push(he({x:Se,y:Me,angle:P,spread:V,startVelocity:R,color:ee[ie%ee.length],shape:te[K(0,te.length)],ticks:we,decay:fe,gravity:be,drift:ye,scalar:xe,flat:ke}));return T?T.addFettis(Z):(T=pe(n,Z,x,z,_),T.promise)}function L(k){var z=y||C(k,"disableForReducedMotion",Boolean),_=C(k,"zIndex",Number);if(z&&D)return d(function(R){R()});h&&T?n=T.canvas:h&&!n&&(n=de(_),document.body.appendChild(n)),v&&!M&&x(n);var O={width:n.width,height:n.height};g&&!M&&g.init(n),M=!0,g&&(n.__confetti_initialized=!0);function P(){if(g){var R={getBoundingClientRect:function(){if(!h)return n.getBoundingClientRect()}};x(R),g.postMessage({resize:{width:R.width,height:R.height}});return}O.width=O.height=null}function V(){T=null,v&&(b=!1,e.removeEventListener("resize",P)),h&&n&&(document.body.contains(n)&&document.body.removeChild(n),n=null,M=!1)}return v&&!b&&(b=!0,e.addEventListener("resize",P,!1)),g?g.fire(k,O,V):A(k,O,V)}return L.reset=function(){g&&g.reset(),T&&T.reset()},L}var J;function X(){return J||(J=Y(null,{useWorker:!0,resize:!0})),J}function me(n,i,h,v,b,y,w){var g=new Path2D(n),x=new Path2D;x.addPath(g,new DOMMatrix(i));var M=new Path2D;return M.addPath(x,new DOMMatrix([Math.cos(w)*b,Math.sin(w)*b,-Math.sin(w)*y,Math.cos(w)*y,h,v])),M}function ge(n){if(!r)throw new Error("path confetti are not supported in this browser");var i,h;typeof n=="string"?i=n:(i=n.path,h=n.matrix);var v=new Path2D(i),b=document.createElement("canvas"),y=b.getContext("2d");if(!h){for(var w=1e3,g=w,x=w,M=0,D=0,T,A,L=0;L<w;L+=2)for(var k=0;k<w;k+=2)y.isPointInPath(v,L,k,"nonzero")&&(g=Math.min(g,L),x=Math.min(x,k),M=Math.max(M,L),D=Math.max(D,k));T=M-g,A=D-x;var z=10,_=Math.min(z/T,z/A);h=[_,0,0,_,-Math.round(T/2+g)*_,-Math.round(A/2+x)*_]}return{type:"path",path:i,matrix:h}}function ve(n){var i,h=1,v="#000000",b='"Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji", "EmojiOne Color", "Android Emoji", "Twemoji Mozilla", "system emoji", sans-serif';typeof n=="string"?i=n:(i=n.text,h="scalar"in n?n.scalar:h,b="fontFamily"in n?n.fontFamily:b,v="color"in n?n.color:v);var y=10*h,w=""+y+"px "+b,g=new OffscreenCanvas(y,y),x=g.getContext("2d");x.font=w;var M=x.measureText(i),D=Math.ceil(M.actualBoundingBoxRight+M.actualBoundingBoxLeft),T=Math.ceil(M.actualBoundingBoxAscent+M.actualBoundingBoxDescent),A=2,L=M.actualBoundingBoxLeft+A,k=M.actualBoundingBoxAscent+A;D+=A+A,T+=A+A,g=new OffscreenCanvas(D,T),x=g.getContext("2d"),x.font=w,x.fillStyle=v,x.fillText(i,L,k);var z=1/h;return{type:"bitmap",bitmap:g.transferToImageBitmap(),matrix:[z,0,0,z,-D*z/2,-T*z/2]}}t.exports=function(){return X().apply(this,arguments)},t.exports.reset=function(){X().reset()},t.exports.create=Y,t.exports.shapeFromPath=ge,t.exports.shapeFromText=ve})(function(){return typeof window<"u"?window:typeof self<"u"?self:this||{}}(),Q,!1);const Be=Q.exports;Q.exports.create;async function W(S,e,t=null){m.playClick();const a=e.width||3840,s=e.height||2160,o=e.name||"4K Ultra HD",r=1200,c=15,p=r/c;for(let d=1;d<=c;d++){await new Promise(u=>setTimeout(u,p));const f=Math.round(d/c*100);t&&t(f)}try{const d=document.createElement("canvas");d.width=a,d.height=s;const f=d.getContext("2d"),u=new Image;if(u.crossOrigin="anonymous",u.src=S.image,await new Promise(($,C)=>{u.onload=$,u.onerror=()=>{$()}}),u.complete&&u.naturalWidth>0){const $=u.naturalWidth/u.naturalHeight,C=a/s;let U,K,j,N;$>C?(K=s,U=s*$,j=(a-U)/2,N=0):(U=a,K=a/$,j=0,N=(s-K)/2),f.drawImage(u,j,N,U,K)}else{const $=f.createLinearGradient(0,0,a,s);$.addColorStop(0,"#0a0d24"),$.addColorStop(.5,"#16193d"),$.addColorStop(1,"#05060f"),f.fillStyle=$,f.fillRect(0,0,a,s)}f.save(),f.font='bold 36px "Outfit", sans-serif',f.fillStyle="rgba(255, 255, 255, 0.4)",f.textAlign="right",f.fillText(`MOON_VIEW // ${S.anime.toUpperCase()} [${o.toUpperCase()}]`,a-80,s-70),f.restore();const I=d.toDataURL("image/png"),E=document.createElement("a"),F=`MOON_VIEW_${S.anime.replace(/\s+/g,"_")}_${S.title.replace(/[^a-zA-Z0-9]/g,"_")}_${o.replace(/\s+/g,"_")}.png`;E.href=I,E.download=F,document.body.appendChild(E),E.click(),document.body.removeChild(E),l.recordDownload(S,o),m.playSuccess(),Be({particleCount:50,spread:70,origin:{y:.8},colors:["#06b6d4","#a855f7","#ec4899","#f59e0b"]}),B(`Downloaded "${S.title}" (${o})`,"success")}catch(d){console.error("Download error:",d);const f=document.createElement("a");f.href=S.image,f.download=`MOON_VIEW_${S.title}.jpg`,f.target="_blank",f.click(),l.recordDownload(S,o),B(`Downloaded "${S.title}" (${o})`,"success")}}class Ie{constructor(e){this.container=e}render(){const e=l.getState(),t=H.filter(s=>s.isTrending).slice(0,6),a=H.find(s=>s.isBestView)||H[0];this.container.innerHTML=`
      <div class="view-transition-enter">
        <!-- Hero Banner Section -->
        <section class="hero-section">
          <div class="container hero-content">
            <div class="hero-pill-badge">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
              <span>The Next-Gen 3D Anime Experience</span>
            </div>

            <h1 class="hero-title">
              STEP INTO ANOTHER <span class="text-gradient">DIMENSION</span>
            </h1>

            <p class="hero-description">
              Immerse your screens in ultra-high-definition 3D animated anime wallpapers. Featuring dynamic depth parallax, master 8K HDR renders, and direct multi-resolution instant downloads.
            </p>

            <div class="hero-cta-group">
              <button class="btn btn-primary" id="hero-btn-explore" style="padding: 0.95rem 2.2rem; font-size: 1.05rem;">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><polygon points="10 8 16 12 10 16 10 8"></polygon></svg>
                Explore 3D Vault
              </button>
              <button class="btn btn-secondary" id="hero-btn-best-view" style="padding: 0.95rem 2rem; font-size: 1.05rem;">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                View Best View VIP
              </button>
            </div>

            <!-- Stats Bar -->
            <div class="hero-stats-bar">
              <div class="hero-stat-item">
                <span class="hero-stat-value">8K HDR</span>
                <span class="hero-stat-label">Ultra Resolution</span>
              </div>
              <div class="hero-stat-divider"></div>
              <div class="hero-stat-item">
                <span class="hero-stat-value">60 FPS</span>
                <span class="hero-stat-label">3D Parallax Live</span>
              </div>
              <div class="hero-stat-divider"></div>
              <div class="hero-stat-item">
                <span class="hero-stat-value">500K+</span>
                <span class="hero-stat-label">Total Downloads</span>
              </div>
              <div class="hero-stat-divider"></div>
              <div class="hero-stat-item">
                <span class="hero-stat-value">100%</span>
                <span class="hero-stat-label">Free Creators</span>
              </div>
            </div>
          </div>
        </section>

        <!-- Category Filter Bar -->
        <section class="category-filter-section">
          <div class="container">
            <div class="section-header">
              <div class="section-title-wrapper">
                <span class="section-tag">// UNIVERSE PORTAL</span>
                <h2 class="section-title">Explore by Anime Universe</h2>
              </div>
              <button class="btn btn-secondary" id="btn-view-all-gallery" style="font-size: 0.85rem; padding: 0.55rem 1.25rem;">
                View All Wallpapers (14+) →
              </button>
            </div>

            <div class="category-scroll-container">
              ${se.map(s=>`
                <button class="category-pill ${e.selectedAnime===s.id?"active":""}" data-cat="${s.id}">
                  <span>${s.name}</span>
                  <span style="font-size: 0.75rem; opacity: 0.7; font-family: var(--font-mono);">(${s.count})</span>
                </button>
              `).join("")}
            </div>
          </div>
        </section>

        <!-- Featured & Trending Wallpapers Grid -->
        <section style="padding: 3rem 0 5rem;">
          <div class="container">
            <div class="section-header">
              <div class="section-title-wrapper">
                <span class="section-tag">// POPULAR IN THE GALAXY</span>
                <h2 class="section-title">Featured 3D Animated Wallpapers</h2>
              </div>
            </div>

            <div class="wallpaper-grid">
              ${t.map(s=>this.renderWallpaperCard(s,e)).join("")}
            </div>
          </div>
        </section>

        <!-- Best View VIP Section -->
        <section class="best-view-section" id="best-view-showcase">
          <div class="container">
            <div class="section-header">
              <div class="section-title-wrapper">
                <span class="section-tag">// CURATOR'S PICK OF THE MONTH</span>
                <h2 class="section-title">Best View VIP Showcase</h2>
              </div>
            </div>

            <div class="best-view-card">
              <div class="best-view-preview-col" data-id="${a.id}">
                <div class="best-view-floating-badge">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                  <span>BEST VIEW ★★★★★</span>
                </div>
                <img src="${a.image}" class="best-view-img" alt="${a.title}" />
              </div>

              <div class="best-view-info-col">
                <div>
                  <span class="badge badge-purple" style="margin-bottom: 0.75rem;">${a.anime}</span>
                  <h3 class="best-view-title">${a.title}</h3>
                  <div style="font-family: var(--font-mono); font-size: 0.85rem; color: var(--theme-accent); margin-top: 0.25rem;">${a.japaneseTitle}</div>
                </div>

                <p class="best-view-desc">${a.description}</p>

                <div class="best-view-spec-grid">
                  <div>
                    <div class="spec-cell-label">Resolution</div>
                    <div class="spec-cell-val" style="color: var(--neon-cyan);">8K Master</div>
                  </div>
                  <div>
                    <div class="spec-cell-label">Total Downloads</div>
                    <div class="spec-cell-val">${a.downloads.toLocaleString()}</div>
                  </div>
                  <div>
                    <div class="spec-cell-label">Community Rating</div>
                    <div class="spec-cell-val" style="color: #fbbf24;">★ 5.0 / 5.0</div>
                  </div>
                </div>

                <div style="display: flex; align-items: center; gap: 1rem; flex-wrap: wrap;">
                  <button class="btn btn-primary" id="btn-best-view-open" data-id="${a.id}" style="padding: 0.85rem 1.75rem;">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                    Interactive 3D Preview
                  </button>
                  <button class="btn btn-secondary" id="btn-best-view-quick-dl" data-id="${a.id}" style="padding: 0.85rem 1.5rem;">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                    Download 8K Master
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- 3D Holographic Parallax Depth Showcase -->
        <section class="depth-showcase-section">
          <div class="container">
            <div class="depth-stage-box">
              <div class="depth-viewport" id="interactive-depth-stage">
                <img src="/wallpapers/lucy_cyberpunk_moon.jpg" class="depth-layer" id="depth-bg" alt="Depth Preview" />
                <div style="position: absolute; inset: 0; background: radial-gradient(circle at center, transparent 30%, rgba(5,6,15,0.7) 100%); pointer-events: none;"></div>
                <div style="position: absolute; bottom: 1.25rem; left: 1.25rem; background: rgba(0,0,0,0.75); backdrop-filter: blur(8px); padding: 0.4rem 0.85rem; border-radius: var(--radius-sm); border: 1px solid var(--border-neon); font-family: var(--font-mono); font-size: 0.75rem; color: #38bdf8;">
                  ✦ Move Cursor to Test 3D Parallax Gyro
                </div>
              </div>

              <div style="display: flex; flex-direction: column; gap: 1.5rem;">
                <span class="section-tag">// DEPTH-LOCK ENGINE</span>
                <h3 style="font-size: clamp(1.8rem, 3vw, 2.4rem); font-weight: 900;">Multi-Layered 3D Motion Technology</h3>
                <p style="color: var(--text-secondary); line-height: 1.7;">
                  MOON_VIEW wallpapers are built with real-time multi-plane depth buffers. Foreground anime characters, mystical energy auras, and cosmic planetary backdrops react seamlessly to your cursor and device orientation.
                </p>
                <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
                  <span class="badge badge-cyan">✓ Zero CPU Throttle</span>
                  <span class="badge badge-purple">✓ 60 FPS Gyroscope</span>
                  <span class="badge badge-gold">✓ Multi-Device Sync</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    `,this.bindEvents(),G(this.container),this.initDepthStage()}renderWallpaperCard(e,t){const a=t.favorites.includes(e.id);return`
      <div class="wallpaper-card-wrapper">
        <div class="wallpaper-card" data-id="${e.id}">
          <div class="card-media-wrapper">
            <img src="${e.thumbnail}" class="card-img" alt="${e.title}" loading="lazy" />
            
            <div class="card-badges-top">
              <span class="badge badge-live">★ 3D LIVE</span>
              <button class="card-like-btn ${a?"liked":""}" data-like-id="${e.id}" title="${a?"Unlike":"Like"}">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="${a?"currentColor":"none"}" stroke="currentColor" stroke-width="2.5"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path></svg>
              </button>
            </div>

            <div class="card-hover-drawer">
              <button class="btn btn-primary btn-preview-card" data-id="${e.id}" style="padding: 0.55rem 1.15rem; font-size: 0.85rem;">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                Preview 3D
              </button>
              <button class="btn btn-secondary btn-quick-dl-card" data-id="${e.id}" style="padding: 0.55rem 1rem; font-size: 0.85rem;" title="Quick Download">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
              </button>
            </div>
          </div>

          <div class="card-info">
            <div style="display: flex; align-items: center; justify-content: space-between;">
              <span class="card-anime-tag">${e.anime}</span>
              <span class="card-resolution-pill">${e.resolutionTag}</span>
            </div>
            <h4 class="card-title" title="${e.title}">${e.title}</h4>
            <div class="card-meta-bar">
              <span class="card-meta-item">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                ${(e.downloads/1e3).toFixed(1)}k
              </span>
              <span class="card-meta-item" style="color: #fbbf24;">
                ★ ${e.rating.toFixed(1)}
              </span>
              <span class="card-meta-item">
                ${e.character}
              </span>
            </div>
          </div>
        </div>
      </div>
    `}bindEvents(){var e,t,a,s,o;(e=this.container.querySelector("#hero-btn-explore"))==null||e.addEventListener("click",()=>{m.playClick(),l.navigate("browse")}),(t=this.container.querySelector("#hero-btn-best-view"))==null||t.addEventListener("click",()=>{var r;m.playClick(),(r=document.getElementById("best-view-showcase"))==null||r.scrollIntoView({behavior:"smooth"})}),(a=this.container.querySelector("#btn-view-all-gallery"))==null||a.addEventListener("click",()=>{m.playClick(),l.setFilters({selectedAnime:"all"}),l.navigate("browse")}),this.container.querySelectorAll("[data-cat]").forEach(r=>{r.addEventListener("click",()=>{m.playClick();const c=r.getAttribute("data-cat");l.setFilters({selectedAnime:c}),l.navigate("browse")})}),this.container.querySelectorAll(".wallpaper-card").forEach(r=>{r.addEventListener("click",c=>{if(c.target.closest("[data-like-id]")||c.target.closest(".btn-quick-dl-card"))return;const p=r.dataset.id;m.playClick(),l.openWallpaperDetail(p)})}),this.container.querySelectorAll("[data-like-id]").forEach(r=>{r.addEventListener("click",c=>{c.stopPropagation(),m.playHeart();const p=r.getAttribute("data-like-id"),d=l.toggleFavorite(p);r.classList.toggle("liked",d),B(d?"Added to your favorites":"Removed from favorites","info")})}),this.container.querySelectorAll(".btn-quick-dl-card").forEach(r=>{r.addEventListener("click",c=>{c.stopPropagation();const p=r.dataset.id,d=H.find(f=>f.id===p);d&&W(d,d.resolutions[0])})}),(s=this.container.querySelector("#btn-best-view-open"))==null||s.addEventListener("click",r=>{const c=r.currentTarget.dataset.id;m.playClick(),l.openWallpaperDetail(c)}),(o=this.container.querySelector("#btn-best-view-quick-dl"))==null||o.addEventListener("click",r=>{const c=r.currentTarget.dataset.id,p=H.find(d=>d.id===c);p&&W(p,p.resolutions[0])})}initDepthStage(){const e=this.container.querySelector("#interactive-depth-stage"),t=this.container.querySelector("#depth-bg");!e||!t||(e.addEventListener("mousemove",a=>{const s=e.getBoundingClientRect(),o=(a.clientX-s.left)/s.width-.5,r=(a.clientY-s.top)/s.height-.5;t.style.transform=`scale(1.15) translate(${o*-25}px, ${r*-25}px)`}),e.addEventListener("mouseleave",()=>{t.style.transform="scale(1) translate(0px, 0px)"}))}}class He{constructor(e){this.container=e}render(){const e=l.getState(),t=l.getFilteredWallpapers();this.container.innerHTML=`
      <div class="view-transition-enter" style="padding: 2.5rem 0 6rem;">
        <div class="container">
          <!-- Gallery Header & Title -->
          <div style="margin-bottom: 2.5rem;">
            <span class="section-tag">// 3D ANIMATED VAULT</span>
            <h1 style="font-size: clamp(2.2rem, 4vw, 3.2rem); font-weight: 900; margin-top: 0.35rem;">
              Browse Anime Wallpapers
            </h1>
            <p style="color: var(--text-secondary); max-width: 600px; margin-top: 0.5rem;">
              Explore our full collection of interactive 3D anime wallpapers. Filter by universe, resolution, or orientation.
            </p>
          </div>

          <!-- Search & Filter Controls -->
          <div class="gallery-header-bar">
            <!-- Search Bar -->
            <div class="gallery-search-bar">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--theme-accent)" stroke-width="2.5"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              <input type="text" id="gallery-search-input" class="gallery-search-input" placeholder="Search by anime, character, technique (e.g. Gojo, Tanjiro, Nika)..." value="${e.searchQuery}" />
              ${e.searchQuery?`
                <button id="btn-clear-search" style="color: var(--text-muted); cursor: pointer; padding: 0.25rem;">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
              `:""}
            </div>

            <!-- Filter Dropdowns Row -->
            <div class="gallery-filter-controls">
              <div class="filter-group">
                <!-- Anime Universe Select -->
                <select class="custom-select" id="filter-anime-select">
                  <option value="all" ${e.selectedAnime==="all"?"selected":""}>All Universes</option>
                  ${se.filter(a=>a.id!=="all").map(a=>`
                    <option value="${a.id}" ${e.selectedAnime===a.id?"selected":""}>${a.name}</option>
                  `).join("")}
                </select>

                <!-- Resolution Select -->
                <select class="custom-select" id="filter-res-select">
                  <option value="all" ${e.selectedResolution==="all"?"selected":""}>All Resolutions</option>
                  <option value="8k" ${e.selectedResolution==="8k"?"selected":""}>8K Ultra Master</option>
                  <option value="4k" ${e.selectedResolution==="4k"?"selected":""}>4K UHD & Above</option>
                </select>

                <!-- Orientation Select -->
                <select class="custom-select" id="filter-orient-select">
                  <option value="all" ${e.selectedOrientation==="all"?"selected":""}>All Orientations</option>
                  <option value="desktop" ${e.selectedOrientation==="desktop"?"selected":""}>Desktop (16:9)</option>
                </select>

                <!-- 3D Live Toggle Pill -->
                <button class="category-pill ${e.filter3DOnly?"active":""}" id="filter-3d-toggle">
                  <span>★ 3D Live Only</span>
                </button>
              </div>

              <!-- Sort By Dropdown -->
              <div style="display: flex; align-items: center; gap: 0.6rem;">
                <span style="font-size: 0.8rem; color: var(--text-muted); font-family: var(--font-mono);">SORT BY:</span>
                <select class="custom-select" id="filter-sort-select">
                  <option value="trending" ${e.selectedSort==="trending"?"selected":""}>Trending / Popular</option>
                  <option value="downloads" ${e.selectedSort==="downloads"?"selected":""}>Most Downloaded</option>
                  <option value="rating" ${e.selectedSort==="rating"?"selected":""}>Highest Rated</option>
                  <option value="newest" ${e.selectedSort==="newest"?"selected":""}>Newest Added</option>
                </select>
              </div>
            </div>

            <!-- Results Count & Active Tags -->
            <div style="display: flex; align-items: center; justify-content: space-between; border-top: 1px solid var(--border-subtle); padding-top: 1rem; font-size: 0.85rem; color: var(--text-secondary);">
              <div>
                Showing <b style="color: #ffffff;">${t.length}</b> wallpapers in vault
              </div>
              ${e.selectedAnime!=="all"||e.selectedResolution!=="all"||e.searchQuery||e.filter3DOnly?`
                <button class="btn-secondary" id="btn-reset-filters" style="font-size: 0.75rem; padding: 0.35rem 0.85rem; border-radius: var(--radius-full); cursor: pointer;">
                  Reset All Filters ✕
                </button>
              `:""}
            </div>
          </div>

          <!-- Wallpapers Grid -->
          ${t.length>0?`
            <div class="wallpaper-grid">
              ${t.map(a=>this.renderWallpaperCard(a,e)).join("")}
            </div>
          `:`
            <div style="text-align: center; padding: 6rem 2rem; background: var(--bg-card); border-radius: var(--radius-xl); border: 1px dashed var(--border-glass);">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" stroke-width="1.5" style="margin: 0 auto 1.5rem;"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              <h3 style="font-size: 1.5rem; font-weight: 800; margin-bottom: 0.5rem;">No Wallpapers Found</h3>
              <p style="color: var(--text-secondary); max-width: 420px; margin: 0 auto 1.5rem;">
                No anime wallpapers matched your current search filters. Try resetting the filters or searching for another character.
              </p>
              <button class="btn btn-primary" id="btn-empty-reset">
                Reset All Filters
              </button>
            </div>
          `}
        </div>
      </div>
    `,this.bindEvents(),G(this.container)}renderWallpaperCard(e,t){const a=t.favorites.includes(e.id);return`
      <div class="wallpaper-card-wrapper">
        <div class="wallpaper-card" data-id="${e.id}">
          <div class="card-media-wrapper">
            <img src="${e.thumbnail}" class="card-img" alt="${e.title}" loading="lazy" />
            
            <div class="card-badges-top">
              <span class="badge badge-live">★ 3D LIVE</span>
              <button class="card-like-btn ${a?"liked":""}" data-like-id="${e.id}" title="${a?"Unlike":"Like"}">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="${a?"currentColor":"none"}" stroke="currentColor" stroke-width="2.5"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path></svg>
              </button>
            </div>

            <div class="card-hover-drawer">
              <button class="btn btn-primary btn-preview-card" data-id="${e.id}" style="padding: 0.55rem 1.15rem; font-size: 0.85rem;">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                Preview 3D
              </button>
              <button class="btn btn-secondary btn-quick-dl-card" data-id="${e.id}" style="padding: 0.55rem 1rem; font-size: 0.85rem;" title="Quick Download">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
              </button>
            </div>
          </div>

          <div class="card-info">
            <div style="display: flex; align-items: center; justify-content: space-between;">
              <span class="card-anime-tag">${e.anime}</span>
              <span class="card-resolution-pill">${e.resolutionTag}</span>
            </div>
            <h4 class="card-title" title="${e.title}">${e.title}</h4>
            <div class="card-meta-bar">
              <span class="card-meta-item">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                ${(e.downloads/1e3).toFixed(1)}k
              </span>
              <span class="card-meta-item" style="color: #fbbf24;">
                ★ ${e.rating.toFixed(1)}
              </span>
              <span class="card-meta-item">
                ${e.character}
              </span>
            </div>
          </div>
        </div>
      </div>
    `}bindEvents(){var a,s,o,r,c,p,d,f;const e=this.container.querySelector("#gallery-search-input");e&&e.addEventListener("input",u=>{l.setFilters({searchQuery:u.target.value})}),(a=this.container.querySelector("#btn-clear-search"))==null||a.addEventListener("click",()=>{l.setFilters({searchQuery:""})}),(s=this.container.querySelector("#filter-anime-select"))==null||s.addEventListener("change",u=>{m.playClick(),l.setFilters({selectedAnime:u.target.value})}),(o=this.container.querySelector("#filter-res-select"))==null||o.addEventListener("change",u=>{m.playClick(),l.setFilters({selectedResolution:u.target.value})}),(r=this.container.querySelector("#filter-orient-select"))==null||r.addEventListener("change",u=>{m.playClick(),l.setFilters({selectedOrientation:u.target.value})}),(c=this.container.querySelector("#filter-sort-select"))==null||c.addEventListener("change",u=>{m.playClick(),l.setFilters({selectedSort:u.target.value})}),(p=this.container.querySelector("#filter-3d-toggle"))==null||p.addEventListener("click",()=>{m.playClick(),l.setFilters({filter3DOnly:!l.getState().filter3DOnly})});const t=()=>{m.playClick(),l.setFilters({selectedAnime:"all",selectedResolution:"all",selectedOrientation:"all",filter3DOnly:!1,searchQuery:""})};(d=this.container.querySelector("#btn-reset-filters"))==null||d.addEventListener("click",t),(f=this.container.querySelector("#btn-empty-reset"))==null||f.addEventListener("click",t),this.container.querySelectorAll(".wallpaper-card").forEach(u=>{u.addEventListener("click",I=>{if(I.target.closest("[data-like-id]")||I.target.closest(".btn-quick-dl-card"))return;const E=u.dataset.id;m.playClick(),l.openWallpaperDetail(E)})}),this.container.querySelectorAll("[data-like-id]").forEach(u=>{u.addEventListener("click",I=>{I.stopPropagation(),m.playHeart();const E=u.getAttribute("data-like-id"),F=l.toggleFavorite(E);u.classList.toggle("liked",F),B(F?"Added to favorites":"Removed from favorites","info")})}),this.container.querySelectorAll(".btn-quick-dl-card").forEach(u=>{u.addEventListener("click",I=>{I.stopPropagation();const E=u.dataset.id,F=H.find($=>$.id===E);F&&W(F,F.resolutions[0])})})}}class ze{constructor(e){this.container=e,this.selectedResIndex=0,this.is3DActive=!0}render(){const e=l.getCurrentWallpaper(),t=l.getState(),a=t.favorites.includes(e.id),s=H.filter(r=>r.animeId===e.animeId&&r.id!==e.id),o=s.length>0?s:H.filter(r=>r.id!==e.id).slice(0,3);this.container.innerHTML=`
      <div class="view-transition-enter detail-view-container">
        <div class="container">
          <!-- Back button -->
          <button class="detail-back-btn" id="btn-detail-back">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
            <span>Back to Wallpapers</span>
          </button>

          <!-- Main Detail Layout -->
          <div class="detail-main-layout">
            <!-- Left: Interactive 3D Preview Stage -->
            <div style="display: flex; flex-direction: column; gap: 1.25rem;">
              <div class="detail-preview-stage" id="detail-stage" data-tilt>
                <img src="${e.image}" class="detail-preview-img" id="detail-main-img" alt="${e.title}" />
                
                <!-- 3D Live Indicator Overlay -->
                <div style="position: absolute; top: 1.25rem; left: 1.25rem; z-index: 10;">
                  <span class="badge badge-live">★ 3D LIVE PARALLAX</span>
                </div>

                <!-- Stage Controls Overlay -->
                <div style="position: absolute; bottom: 1.25rem; right: 1.25rem; display: flex; gap: 0.6rem; z-index: 10;">
                  <button class="btn-icon" id="btn-toggle-3d" title="Toggle 3D Parallax Gyro" style="background: rgba(0,0,0,0.7); backdrop-filter: blur(8px);">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path></svg>
                  </button>
                  <button class="btn-icon" id="btn-fullscreen-preview" title="Open Fullscreen Master" style="background: rgba(0,0,0,0.7); backdrop-filter: blur(8px);">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path></svg>
                  </button>
                </div>
              </div>

              <!-- Tags Pill Row -->
              <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; padding-top: 0.5rem;">
                ${e.tags.map(r=>`<span class="badge badge-purple">#${r}</span>`).join("")}
              </div>
            </div>

            <!-- Right: Info & Download Panel -->
            <div class="detail-sidebar-info">
              <div>
                <div class="detail-anime-badge">${e.anime.toUpperCase()} // ${e.character.toUpperCase()}</div>
                <h1 class="detail-title">${e.title}</h1>
                <div style="font-family: var(--font-mono); font-size: 0.95rem; color: var(--theme-accent); margin-top: 0.35rem;">${e.japaneseTitle}</div>
              </div>

              <!-- Stats bar -->
              <div style="display: flex; align-items: center; gap: 1.5rem; padding: 0.85rem 1.25rem; border-radius: var(--radius-md); background: var(--bg-card); border: 1px solid var(--border-glass); font-size: 0.85rem;">
                <span style="color: #fbbf24; font-weight: 700;">★ ${e.rating.toFixed(1)} (${e.reviewCount.toLocaleString()} reviews)</span>
                <span style="color: var(--text-muted);">•</span>
                <span style="color: var(--text-secondary);">${e.downloads.toLocaleString()} downloads</span>
                <span style="color: var(--text-muted);">•</span>
                <span style="color: var(--text-secondary);">${e.views.toLocaleString()} views</span>
              </div>

              <p style="color: var(--text-secondary); line-height: 1.7; font-size: 0.95rem;">
                ${e.description}
              </p>

              <!-- Resolution Selection Grid -->
              <div class="detail-resolution-picker">
                <span class="picker-label">Select Download Resolution</span>
                <div class="resolution-options-grid">
                  ${e.resolutions.map((r,c)=>`
                    <button class="res-option-btn ${c===this.selectedResIndex?"selected":""}" data-res-idx="${c}">
                      <span class="res-option-name">${r.name}</span>
                      <span class="res-option-size">${r.width}x${r.height} • ${r.size}</span>
                    </button>
                  `).join("")}
                </div>
              </div>

              <!-- Download & Action Buttons -->
              <div class="download-action-box">
                <button class="btn btn-primary" id="btn-trigger-download" style="padding: 1rem 2rem; font-size: 1.05rem; width: 100%;">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                  <span>Download ${e.resolutions[this.selectedResIndex].name}</span>
                </button>

                <!-- Download Progress Bar -->
                <div class="download-progress-bar" id="download-progress-wrap">
                  <div class="download-progress-fill" id="download-progress-bar"></div>
                </div>

                <!-- Secondary Actions Row -->
                <div style="display: flex; gap: 0.75rem; margin-top: 0.5rem;">
                  <button class="btn btn-secondary ${a?"active":""}" id="btn-detail-like" style="flex: 1;">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="${a?"currentColor":"none"}" stroke="currentColor" stroke-width="2"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path></svg>
                    <span>${a?"Liked in Favorites":"Add to Favorites"}</span>
                  </button>
                  <button class="btn btn-secondary" id="btn-detail-share" style="flex: 1;">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>
                    <span>Share Link</span>
                  </button>
                </div>
              </div>

              <!-- Artist & Metadata Credits -->
              <div style="padding-top: 1rem; border-top: 1px solid var(--border-subtle); display: flex; justify-content: space-between; font-size: 0.8rem; color: var(--text-muted);">
                <span>Artist: <b style="color: var(--text-primary);">${e.artist}</b></span>
                <span>Format: <b style="color: var(--text-primary);">PNG / HDR</b></span>
                <span>Aspect: <b style="color: var(--text-primary);">${e.aspectRatio}</b></span>
              </div>
            </div>
          </div>

          <!-- Related Anime Wallpapers -->
          <section style="margin-top: 5rem; padding-top: 3rem; border-top: 1px solid var(--border-subtle);">
            <div class="section-header">
              <div class="section-title-wrapper">
                <span class="section-tag">// MORE FROM ${e.anime.toUpperCase()}</span>
                <h3 class="section-title">Related 3D Wallpapers</h3>
              </div>
            </div>

            <div class="wallpaper-grid">
              ${o.map(r=>this.renderRelatedCard(r,t)).join("")}
            </div>
          </section>
        </div>
      </div>
    `,this.bindEvents(e),G(this.container),this.initInteractiveStage()}renderRelatedCard(e,t){const a=t.favorites.includes(e.id);return`
      <div class="wallpaper-card-wrapper">
        <div class="wallpaper-card" data-id="${e.id}">
          <div class="card-media-wrapper">
            <img src="${e.thumbnail}" class="card-img" alt="${e.title}" loading="lazy" />
            <div class="card-badges-top">
              <span class="badge badge-live">★ 3D LIVE</span>
              <button class="card-like-btn ${a?"liked":""}" data-like-id="${e.id}">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="${a?"currentColor":"none"}" stroke="currentColor" stroke-width="2.5"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path></svg>
              </button>
            </div>
          </div>
          <div class="card-info">
            <span class="card-anime-tag">${e.anime}</span>
            <h4 class="card-title">${e.title}</h4>
          </div>
        </div>
      </div>
    `}bindEvents(e){var o,r,c,p;(o=this.container.querySelector("#btn-detail-back"))==null||o.addEventListener("click",()=>{m.playClick(),l.navigate("browse")}),this.container.querySelectorAll("[data-res-idx]").forEach(d=>{d.addEventListener("click",()=>{m.playClick(),this.selectedResIndex=parseInt(d.getAttribute("data-res-idx"),10),this.render()})});const t=this.container.querySelector("#btn-trigger-download"),a=this.container.querySelector("#download-progress-wrap"),s=this.container.querySelector("#download-progress-bar");t&&t.addEventListener("click",async()=>{const d=e.resolutions[this.selectedResIndex];t.disabled=!0,t.innerHTML=`
          <svg class="spin-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 12a9 9 0 1 1-6.219-8.56"></path></svg>
          <span>Rendering ${d.name}...</span>
        `,a&&(a.style.display="block"),await W(e,d,f=>{s&&(s.style.width=`${f}%`)}),t.disabled=!1,t.innerHTML=`
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
          <span>Download ${d.name}</span>
        `,setTimeout(()=>{a&&(a.style.display="none"),s&&(s.style.width="0%")},500)}),(r=this.container.querySelector("#btn-detail-like"))==null||r.addEventListener("click",d=>{m.playHeart();const f=l.toggleFavorite(e.id);B(f?`Saved "${e.title}" to favorites`:"Removed from favorites","info"),this.render()}),(c=this.container.querySelector("#btn-detail-share"))==null||c.addEventListener("click",()=>{var d;m.playClick(),(d=navigator.clipboard)==null||d.writeText(window.location.href),B("Link copied to clipboard! Share the dimension.","success")}),(p=this.container.querySelector("#btn-fullscreen-preview"))==null||p.addEventListener("click",()=>{var f,u;m.playClick();const d=this.container.querySelector("#detail-stage");d&&(document.fullscreenElement?(u=document.exitFullscreen)==null||u.call(document):(f=d.requestFullscreen)==null||f.call(d).catch(()=>{}))}),this.container.querySelectorAll(".wallpaper-card").forEach(d=>{d.addEventListener("click",f=>{if(f.target.closest("[data-like-id]"))return;const u=d.dataset.id;m.playClick(),l.openWallpaperDetail(u)})})}initInteractiveStage(){const e=this.container.querySelector("#detail-stage"),t=this.container.querySelector("#detail-main-img");!e||!t||(e.addEventListener("mousemove",a=>{const s=e.getBoundingClientRect(),o=(a.clientX-s.left)/s.width-.5,r=(a.clientY-s.top)/s.height-.5;t.style.transform=`scale(1.06) translate(${o*-18}px, ${r*-18}px)`}),e.addEventListener("mouseleave",()=>{t.style.transform="scale(1) translate(0px, 0px)"}))}}class Fe{constructor(e){this.container=e,this.activeTab="login"}render(){this.container.innerHTML=`
      <div class="view-transition-enter auth-page-container">
        <div class="auth-card">
          <!-- Logo & Header -->
          <div style="text-align: center; margin-bottom: 2rem;">
            <div class="logo-moon-icon" style="margin: 0 auto 1rem; width: 48px; height: 48px;">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path></svg>
            </div>
            <h2 style="font-size: 1.8rem; font-weight: 900; letter-spacing: -0.02em;">
              ${this.activeTab==="login"?"Welcome to Moon View":"Create Collector Account"}
            </h2>
            <p style="font-size: 0.85rem; color: var(--text-secondary); margin-top: 0.25rem;">
              ${this.activeTab==="login"?"Access your unlimited 8K 3D anime downloads":"Join thousands of anime wallpaper curators"}
            </p>
          </div>

          <!-- Auth Tab Switcher -->
          <div class="auth-tabs">
            <button class="auth-tab-btn ${this.activeTab==="login"?"active":""}" id="tab-btn-login">
              Sign In
            </button>
            <button class="auth-tab-btn ${this.activeTab==="signup"?"active":""}" id="tab-btn-signup">
              Create Account
            </button>
          </div>

          <!-- Form Area -->
          ${this.activeTab==="login"?this.renderLoginForm():this.renderSignupForm()}

          <!-- Divider -->
          <div style="display: flex; align-items: center; gap: 1rem; margin: 1.75rem 0; color: var(--text-muted); font-size: 0.75rem;">
            <div style="flex: 1; height: 1px; background: var(--border-glass);"></div>
            <span>OR CONTINUE WITH</span>
            <div style="flex: 1; height: 1px; background: var(--border-glass);"></div>
          </div>

          <!-- Social Logins -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem;">
            <button class="btn btn-secondary btn-social" data-provider="Google" style="font-size: 0.85rem; padding: 0.65rem;">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/></svg>
              Google
            </button>
            <button class="btn btn-secondary btn-social" data-provider="Discord" style="font-size: 0.85rem; padding: 0.65rem;">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="#5865F2"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/></svg>
              Discord
            </button>
          </div>

          <!-- Quick 1-Click Demo Logins -->
          <div style="margin-top: 1.5rem; padding-top: 1.25rem; border-top: 1px solid var(--border-subtle);">
            <div style="font-size: 0.75rem; color: var(--text-muted); font-family: var(--font-mono); margin-bottom: 0.5rem; text-align: center;">
              ⚡ 1-CLICK DEMO ACCOUNTS
            </div>
            <div class="demo-account-pills">
              <button class="demo-pill" id="demo-btn-otaku">
                ★ Otaku Collector
              </button>
              <button class="demo-pill" id="demo-btn-vip">
                👑 Celestial VIP
              </button>
            </div>
          </div>
        </div>
      </div>
    `,this.bindEvents()}renderLoginForm(){return`
      <form id="auth-login-form">
        <div class="auth-form-group">
          <label class="form-label" for="login-email">User ID or Email</label>
          <input type="text" id="login-email" class="form-input" placeholder="e.g. otaku@moonview.io" required />
        </div>

        <div class="auth-form-group">
          <div style="display: flex; justify-content: space-between;">
            <label class="form-label" for="login-password">Password</label>
            <a href="#" id="link-forgot-pass" style="font-size: 0.75rem; color: var(--theme-accent);">Forgot?</a>
          </div>
          <input type="password" id="login-password" class="form-input" placeholder="••••••••" required />
        </div>

        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.5rem; font-size: 0.85rem;">
          <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer; color: var(--text-secondary);">
            <input type="checkbox" id="remember-me" checked style="accent-color: var(--theme-accent);" />
            Remember Me
          </label>
        </div>

        <div id="login-error-msg" style="color: #f43f5e; font-size: 0.8rem; margin-bottom: 1rem; display: none;"></div>

        <button type="submit" class="btn btn-primary" style="width: 100%; padding: 0.85rem; font-size: 1rem;">
          Sign In to MOON_VIEW
        </button>
      </form>
    `}renderSignupForm(){return`
      <form id="auth-signup-form">
        <div class="auth-form-group">
          <label class="form-label" for="signup-username">Username</label>
          <input type="text" id="signup-username" class="form-input" placeholder="CosmicRider" required />
        </div>

        <div class="auth-form-group">
          <label class="form-label" for="signup-email">Email Address</label>
          <input type="email" id="signup-email" class="form-input" placeholder="rider@cosmos.io" required />
        </div>

        <div class="auth-form-group">
          <label class="form-label" for="signup-password">Password</label>
          <input type="password" id="signup-password" class="form-input" placeholder="Minimum 6 characters" required />
        </div>

        <div class="auth-form-group">
          <label class="form-label" for="signup-confirm">Confirm Password</label>
          <input type="password" id="signup-confirm" class="form-input" placeholder="Re-enter password" required />
        </div>

        <div id="signup-error-msg" style="color: #f43f5e; font-size: 0.8rem; margin-bottom: 1rem; display: none;"></div>

        <button type="submit" class="btn btn-primary" style="width: 100%; padding: 0.85rem; font-size: 1rem;">
          Create Free Account
        </button>
      </form>
    `}bindEvents(){var a,s,o,r,c;(a=this.container.querySelector("#tab-btn-login"))==null||a.addEventListener("click",()=>{m.playClick(),this.activeTab="login",this.render()}),(s=this.container.querySelector("#tab-btn-signup"))==null||s.addEventListener("click",()=>{m.playClick(),this.activeTab="signup",this.render()}),(o=this.container.querySelector("#link-forgot-pass"))==null||o.addEventListener("click",p=>{p.preventDefault(),m.playClick(),B("Password reset link sent to demo registered email!","info")});const e=this.container.querySelector("#auth-login-form");e&&e.addEventListener("submit",p=>{p.preventDefault();const d=this.container.querySelector("#login-email").value.trim(),f=this.container.querySelector("#login-password").value,u=this.container.querySelector("#login-error-msg");if(!d||!f){u.textContent="Please fill in both User ID and password.",u.style.display="block";return}if(f.length<4){u.textContent="Password must be at least 4 characters.",u.style.display="block";return}m.playSuccess(),l.login({id:"user_"+Date.now(),username:d.split("@")[0]||"CelestialExplorer",email:d.includes("@")?d:`${d}@moonview.io`,avatar:"/avatars/avatar_cosmic_hero.svg",rank:"Star Vanguard ★★",joinedDate:"September 2026",downloadQuota:100,downloadsUsed:3}),B(`Welcome back, ${d.split("@")[0]}!`,"success")});const t=this.container.querySelector("#auth-signup-form");t&&t.addEventListener("submit",p=>{p.preventDefault();const d=this.container.querySelector("#signup-username").value.trim(),f=this.container.querySelector("#signup-email").value.trim(),u=this.container.querySelector("#signup-password").value,I=this.container.querySelector("#signup-confirm").value,E=this.container.querySelector("#signup-error-msg");if(u!==I){E.textContent="Passwords do not match!",E.style.display="block";return}if(u.length<6){E.textContent="Password must be at least 6 characters.",E.style.display="block";return}m.playSuccess(),l.login({id:"user_"+Date.now(),username:d,email:f,avatar:"/avatars/avatar_shadow_ninja.svg",rank:"Celestial Pioneer ★★★",joinedDate:"September 2026",downloadQuota:100,downloadsUsed:0}),B(`Welcome to MOON_VIEW, ${d}!`,"success")}),(r=this.container.querySelector("#demo-btn-otaku"))==null||r.addEventListener("click",()=>{m.playSuccess(),l.login({id:"otaku_demo_1",username:"CosmicOtaku",email:"otaku@moonview.io",avatar:"/avatars/avatar_cosmic_hero.svg",rank:"Celestial Pioneer ★★★",joinedDate:"August 2026",downloadQuota:50,downloadsUsed:14}),B("Logged in as CosmicOtaku (Demo)","success")}),(c=this.container.querySelector("#demo-btn-vip"))==null||c.addEventListener("click",()=>{m.playSuccess(),l.login({id:"vip_demo_2",username:"AstralEmperor",email:"emperor@moonview.io",avatar:"/avatars/avatar_cyber_glitch.svg",rank:"Celestial VIP ★★★★★",joinedDate:"July 2026",downloadQuota:999,downloadsUsed:42}),B("Logged in as AstralEmperor (VIP Demo)","success")}),this.container.querySelectorAll(".btn-social").forEach(p=>{p.addEventListener("click",()=>{const d=p.dataset.provider;m.playSuccess(),l.login({id:"social_"+Date.now(),username:`${d}User`,email:`${d.toLowerCase()}@auth.net`,avatar:"/avatars/avatar_cosmic_hero.svg",rank:"Verified "+d+" Member",joinedDate:"September 2026",downloadQuota:100,downloadsUsed:5}),B(`Connected successfully with ${d}!`,"success")})})}}class _e{constructor(e){this.container=e,this.activeTab="downloads"}render(){var o;const e=l.getState(),t=e.user;if(!t){this.container.innerHTML=`
        <div class="view-transition-enter container" style="padding: 6rem 1.5rem; text-align: center;">
          <h2 style="font-size: 2rem; font-weight: 800; margin-bottom: 1rem;">Sign in Required</h2>
          <p style="color: var(--text-secondary); margin-bottom: 2rem;">Please log in to view your user dashboard, downloads history, and saved favorites.</p>
          <button class="btn btn-primary" id="btn-dash-login">Sign In / Register</button>
        </div>
      `,(o=this.container.querySelector("#btn-dash-login"))==null||o.addEventListener("click",()=>{l.navigate("auth")});return}const a=H.filter(r=>e.favorites.includes(r.id)),s=e.downloadHistory;this.container.innerHTML=`
      <div class="view-transition-enter dashboard-container">
        <div class="container">
          <!-- Profile Hero Card -->
          <div class="profile-hero-card">
            <div class="profile-user-left">
              <div class="profile-avatar-wrapper">
                <img src="${t.avatar}" class="profile-avatar-large" alt="avatar" />
              </div>
              <div>
                <div style="display: flex; align-items: center; gap: 0.75rem; flex-wrap: wrap;">
                  <h1 style="font-size: 1.8rem; font-weight: 900;">${t.username}</h1>
                  <span class="badge badge-purple">${t.rank}</span>
                </div>
                <div style="font-size: 0.85rem; color: var(--text-secondary); margin-top: 0.25rem;">
                  ${t.email} • Member since ${t.joinedDate}
                </div>
              </div>
            </div>

            <!-- Download Quota Stats -->
            <div style="display: flex; align-items: center; gap: 1.5rem; flex-wrap: wrap;">
              <div style="text-align: right;">
                <div style="font-size: 0.75rem; color: var(--text-muted); font-family: var(--font-mono); text-transform: uppercase;">
                  Downloads Used
                </div>
                <div style="font-size: 1.5rem; font-weight: 800; color: #ffffff;">
                  ${t.downloadsUsed} <span style="font-size: 0.9rem; color: var(--text-muted);">/ ∞</span>
                </div>
              </div>

              <button class="btn btn-secondary" id="btn-dash-logout" style="font-size: 0.85rem; padding: 0.6rem 1.25rem;">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                Sign Out
              </button>
            </div>
          </div>

          <!-- Dashboard Tabs -->
          <div class="dashboard-tab-bar">
            <button class="dash-tab-btn ${this.activeTab==="downloads"?"active":""}" data-dash-tab="downloads">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
              My Downloads (${s.length})
            </button>
            <button class="dash-tab-btn ${this.activeTab==="favorites"?"active":""}" data-dash-tab="favorites">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path></svg>
              My Favorites (${a.length})
            </button>
            <button class="dash-tab-btn ${this.activeTab==="settings"?"active":""}" data-dash-tab="settings">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
              Account Settings
            </button>
          </div>

          <!-- Tab Contents -->
          ${this.activeTab==="downloads"?this.renderDownloadsTab(s):""}
          ${this.activeTab==="favorites"?this.renderFavoritesTab(a):""}
          ${this.activeTab==="settings"?this.renderSettingsTab(t,e):""}
        </div>
      </div>
    `,this.bindEvents(),this.activeTab==="favorites"&&G(this.container)}renderDownloadsTab(e){return e.length===0?`
        <div style="text-align: center; padding: 5rem 2rem; background: var(--bg-card); border-radius: var(--radius-xl); border: 1px dashed var(--border-glass);">
          <p style="color: var(--text-secondary); margin-bottom: 1.5rem;">You haven't downloaded any 3D anime wallpapers yet.</p>
          <button class="btn btn-primary" data-nav="browse">Explore Vault</button>
        </div>
      `:`
      <div style="display: flex; flex-direction: column; gap: 1rem;">
        ${e.map(t=>`
          <div class="glass-panel" style="display: flex; align-items: center; justify-content: space-between; padding: 1rem 1.5rem; gap: 1.5rem; flex-wrap: wrap;">
            <div style="display: flex; align-items: center; gap: 1.25rem;">
              <img src="${t.image}" style="width: 80px; height: 50px; object-fit: cover; border-radius: 8px; border: 1px solid var(--border-glass);" />
              <div>
                <h4 style="font-size: 1.05rem; font-weight: 800; color: #ffffff;">${t.wallpaperTitle}</h4>
                <div style="font-size: 0.8rem; color: var(--theme-accent); font-family: var(--font-mono); margin-top: 0.2rem;">
                  ${t.anime} • <span style="color: var(--text-muted);">${t.timestamp}</span>
                </div>
              </div>
            </div>

            <div style="display: flex; align-items: center; gap: 1rem;">
              <span class="badge badge-cyan">${t.resolution}</span>
              <button class="btn btn-secondary btn-redownload" data-id="${t.wallpaperId}" style="padding: 0.5rem 1rem; font-size: 0.85rem;">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                Re-Download
              </button>
            </div>
          </div>
        `).join("")}
      </div>
    `}renderFavoritesTab(e){return e.length===0?`
        <div style="text-align: center; padding: 5rem 2rem; background: var(--bg-card); border-radius: var(--radius-xl); border: 1px dashed var(--border-glass);">
          <p style="color: var(--text-secondary); margin-bottom: 1.5rem;">Your favorites list is empty. Click the heart icon on any wallpaper card to save it here!</p>
          <button class="btn btn-primary" data-nav="browse">Discover Wallpapers</button>
        </div>
      `:`
      <div class="wallpaper-grid">
        ${e.map(t=>`
          <div class="wallpaper-card-wrapper">
            <div class="wallpaper-card" data-id="${t.id}">
              <div class="card-media-wrapper">
                <img src="${t.thumbnail}" class="card-img" alt="${t.title}" />
                <div class="card-badges-top">
                  <span class="badge badge-live">★ 3D LIVE</span>
                  <button class="card-like-btn liked" data-like-id="${t.id}" title="Remove from favorites">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2.5"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path></svg>
                  </button>
                </div>
              </div>
              <div class="card-info">
                <span class="card-anime-tag">${t.anime}</span>
                <h4 class="card-title">${t.title}</h4>
                <div class="card-meta-bar">
                  <span>${t.resolutionTag}</span>
                  <span style="color: #fbbf24;">★ ${t.rating.toFixed(1)}</span>
                </div>
              </div>
            </div>
          </div>
        `).join("")}
      </div>
    `}renderSettingsTab(e,t){const a=["/avatars/avatar_cosmic_hero.svg","/avatars/avatar_shadow_ninja.svg","/avatars/avatar_cyber_glitch.svg"],s=[{id:"cyan",name:"Moon Cyan",color:"#06b6d4"},{id:"purple",name:"Cosmic Purple",color:"#a855f7"},{id:"pink",name:"Cyber Pink",color:"#ec4899"},{id:"gold",name:"Solar Gold",color:"#f59e0b"}];return`
      <div class="glass-panel" style="padding: 2.5rem; max-width: 680px; margin: 0 auto;">
        <h3 style="font-size: 1.4rem; font-weight: 800; margin-bottom: 2rem;">Collector Preferences</h3>

        <!-- Avatar Picker -->
        <div style="margin-bottom: 2rem;">
          <label class="form-label" style="margin-bottom: 0.75rem; display: block;">Select Cosmic Avatar</label>
          <div style="display: flex; gap: 1rem;">
            ${a.map(o=>`
              <div class="avatar-option ${e.avatar===o?"selected":""}" data-avatar-url="${o}" style="cursor: pointer; padding: 4px; border-radius: 50%; border: 2px solid ${e.avatar===o?"var(--theme-accent)":"transparent"};">
                <img src="${o}" style="width: 60px; height: 60px; border-radius: 50%;" />
              </div>
            `).join("")}
          </div>
        </div>

        <!-- Theme Accent Picker -->
        <div style="margin-bottom: 2rem;">
          <label class="form-label" style="margin-bottom: 0.75rem; display: block;">Platform Neon Theme Accent</label>
          <div style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
            ${s.map(o=>`
              <button class="btn btn-secondary ${t.themeAccent===o.id?"active":""}" data-set-theme="${o.id}" style="display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem 1rem;">
                <span style="width: 12px; height: 12px; border-radius: 50%; background: ${o.color};"></span>
                <span>${o.name}</span>
              </button>
            `).join("")}
          </div>
        </div>

        <!-- Profile details form -->
        <form id="settings-profile-form">
          <div class="auth-form-group">
            <label class="form-label" for="settings-username">Username</label>
            <input type="text" id="settings-username" class="form-input" value="${e.username}" required />
          </div>

          <div class="auth-form-group">
            <label class="form-label" for="settings-email">Email Address</label>
            <input type="email" id="settings-email" class="form-input" value="${e.email}" required />
          </div>

          <button type="submit" class="btn btn-primary" style="margin-top: 1rem; width: 100%; padding: 0.85rem;">
            Save Settings
          </button>
        </form>
      </div>
    `}bindEvents(){var t;this.container.querySelectorAll("[data-dash-tab]").forEach(a=>{a.addEventListener("click",()=>{m.playClick(),this.activeTab=a.getAttribute("data-dash-tab"),this.render()})}),(t=this.container.querySelector("#btn-dash-logout"))==null||t.addEventListener("click",()=>{m.playClick(),l.logout(),B("Logged out successfully","info")}),this.container.querySelectorAll(".btn-redownload").forEach(a=>{a.addEventListener("click",()=>{const s=a.dataset.id,o=H.find(r=>r.id===s);o&&W(o,o.resolutions[0])})}),this.container.querySelectorAll(".wallpaper-card").forEach(a=>{a.addEventListener("click",s=>{if(s.target.closest("[data-like-id]"))return;const o=a.dataset.id;m.playClick(),l.openWallpaperDetail(o)})}),this.container.querySelectorAll("[data-like-id]").forEach(a=>{a.addEventListener("click",s=>{s.stopPropagation(),m.playHeart();const o=a.getAttribute("data-like-id");l.toggleFavorite(o),B("Removed from favorites","info"),this.render()})}),this.container.querySelectorAll("[data-avatar-url]").forEach(a=>{a.addEventListener("click",()=>{m.playClick();const s=a.getAttribute("data-avatar-url");l.updateProfile({avatar:s}),B("Avatar updated!","success"),this.render()})}),this.container.querySelectorAll("[data-set-theme]").forEach(a=>{a.addEventListener("click",()=>{m.playClick();const s=a.getAttribute("data-set-theme");l.setThemeAccent(s),this.render()})});const e=this.container.querySelector("#settings-profile-form");e&&e.addEventListener("submit",a=>{a.preventDefault(),m.playSuccess();const s=this.container.querySelector("#settings-username").value.trim(),o=this.container.querySelector("#settings-email").value.trim();l.updateProfile({username:s,email:o}),B("Profile settings saved successfully!","success")}),this.container.querySelectorAll("[data-nav]").forEach(a=>{a.addEventListener("click",s=>{s.preventDefault(),m.playClick(),l.navigate(a.getAttribute("data-nav"))})})}}class Oe{constructor(){this.navContainer=document.getElementById("nav-container"),this.mainContainer=document.getElementById("main-container"),this.footerContainer=document.getElementById("footer-container"),this.canvas=document.getElementById("cosmic-canvas"),this.cosmicBg=null,this.quickSearch=null,this.navbar=null,this.footer=null,this.views={home:new Ie(this.mainContainer),browse:new He(this.mainContainer),detail:new ze(this.mainContainer),auth:new Fe(this.mainContainer),dashboard:new _e(this.mainContainer)},this.init()}init(){this.canvas&&(this.cosmicBg=new Ce(this.canvas)),this.quickSearch=new De,this.navbar=new Ee(this.navContainer,this.quickSearch),this.footer=new Le(this.footerContainer),l.subscribe(e=>{this.renderView(e.currentView),this.syncUrlHash(e)}),this.handleUrlHash(),window.addEventListener("hashchange",()=>this.handleUrlHash()),this.renderView(l.getState().currentView)}handleUrlHash(){const e=window.location.hash.slice(1);if(e)if(e.startsWith("detail/")){const t=e.replace("detail/","");l.openWallpaperDetail(t)}else["home","browse","auth","dashboard"].includes(e)&&l.navigate(e)}syncUrlHash(e){let t=e.currentView;e.currentView==="detail"&&e.detailWallpaperId&&(t=`detail/${e.detailWallpaperId}`),window.location.hash.slice(1)!==t&&history.replaceState(null,"",`#${t}`)}renderView(e){(this.views[e]||this.views.home).render()}}document.addEventListener("DOMContentLoaded",()=>{window.__MOON_VIEW_APP__=new Oe});
