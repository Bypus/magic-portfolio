/* sketch.js - Three.js sunflower-lake scene for Magical Mirai 2026 */
import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
const THEMES={day:{skyTop:[.36,.78,.94],skyBot:[.66,.89,.97],lakeTop:[.28,.62,.72],lakeMid:[.16,.48,.64],lakeBot:[.1,.36,.56],groundNear:[.42,.64,.22],groundFar:[.36,.56,.18],sunColor:[1,.99,.82],sunPos:[18,28,-30],bloomStr:.3},sunset:{skyTop:[.12,.08,.31],skyBot:[.94,.39,.16],lakeTop:[.5,.2,.5],lakeMid:[.6,.18,.32],lakeBot:[.4,.14,.28],groundNear:[.5,.38,.18],groundFar:[.4,.28,.12],sunColor:[1,.55,.16],sunPos:[12,8,-30],bloomStr:.6}};
function lerp(a,b,t){return a+(b-a)*t}
function lerpA(a,b,t){return a.map((v,i)=>lerp(v,b[i],t))}
function getTheme(p){const d=THEMES.day,s=THEMES.sunset,r={};for(const k of Object.keys(d))r[k]=Array.isArray(d[k])?lerpA(d[k],s[k],p):lerp(d[k],s[k],p);return r}
let songProgress=0,smoothProgress=0,beatPulse=0;
let audioData={bass:0,mids:0,highs:0};
const BEAT_DECAY=.88;
const renderer=new THREE.WebGLRenderer({antialias:true});
renderer.setPixelRatio(Math.min(devicePixelRatio,2));
renderer.setSize(innerWidth,innerHeight);
renderer.toneMapping=THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure=1.1;
renderer.outputColorSpace=THREE.SRGBColorSpace;
document.body.prepend(renderer.domElement);
renderer.domElement.id='c';
const scene=new THREE.Scene();
const camera=new THREE.PerspectiveCamera(50,innerWidth/innerHeight,.1,500);
camera.position.set(0,5,32);camera.lookAt(0,0,-2);
const clock=new THREE.Clock();
const composer=new EffectComposer(renderer);
composer.addPass(new RenderPass(scene,camera));
const bloomPass=new UnrealBloomPass(new THREE.Vector2(innerWidth,innerHeight),.3,.6,.85);
composer.addPass(bloomPass);
window.addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);composer.setSize(innerWidth,innerHeight)});
const ambientLight=new THREE.AmbientLight(0xfff8e0,.6);scene.add(ambientLight);
const sunLight=new THREE.DirectionalLight(0xfff0c0,1.2);sunLight.position.set(18,28,-30);scene.add(sunLight);
const skyMat=new THREE.ShaderMaterial({uniforms:{uTop:{value:new THREE.Color(...THEMES.day.skyTop)},uBot:{value:new THREE.Color(...THEMES.day.skyBot)}},vertexShader:`varying vec2 vUv;void main(){vUv=uv;gl_Position=vec4(position.xy,0.9999,1.0);}`,fragmentShader:`uniform vec3 uTop,uBot;varying vec2 vUv;void main(){gl_FragColor=vec4(mix(uBot,uTop,vUv.y),1.0);}`,depthWrite:false,side:THREE.DoubleSide});
const skyMesh=new THREE.Mesh(new THREE.PlaneGeometry(2,2),skyMat);skyMesh.frustumCulled=false;skyMesh.renderOrder=-1;scene.add(skyMesh);
function makeSunTex(){const sz=128,c=document.createElement('canvas');c.width=c.height=sz;const x=c.getContext('2d'),g=x.createRadialGradient(64,64,0,64,64,64);g.addColorStop(0,'rgba(255,255,220,1)');g.addColorStop(.3,'rgba(255,240,180,.8)');g.addColorStop(.7,'rgba(255,200,100,.15)');g.addColorStop(1,'rgba(255,180,60,0)');x.fillStyle=g;x.fillRect(0,0,sz,sz);return new THREE.CanvasTexture(c)}
const sunSprite=new THREE.Sprite(new THREE.SpriteMaterial({map:makeSunTex(),transparent:true,depthWrite:false,blending:THREE.AdditiveBlending}));sunSprite.scale.set(14,14,1);sunSprite.position.set(18,28,-30);scene.add(sunSprite);
const LAKE_R=20;
const BEACH_W=5.0;const PATH_W=3.0;
const groundMat=new THREE.ShaderMaterial({uniforms:{uNear:{value:new THREE.Color(...THEMES.day.groundNear)},uFar:{value:new THREE.Color(...THEMES.day.groundFar)},uTime:{value:0},uR:{value:LAKE_R},uBW:{value:BEACH_W},uPW:{value:PATH_W}},vertexShader:`varying vec3 vW;void main(){vec4 w=modelMatrix*vec4(position,1.0);vW=w.xyz;gl_Position=projectionMatrix*viewMatrix*w;}`,fragmentShader:`uniform vec3 uNear,uFar;uniform float uTime,uR,uBW,uPW;varying vec3 vW;float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}void main(){float d=length(vW.xz);vec3 sand=vec3(0.82,0.72,0.52);vec3 sandWet=vec3(0.62,0.54,0.38);float beachT=smoothstep(uR,uR+uBW,d);float grassT=clamp((d-uR-uBW)/25.0,0.0,1.0);vec3 grass=mix(uNear,uFar,grassT);grass+=(hash(floor(vW.xz*3.0))-0.5)*0.06;float wetT=smoothstep(uR+0.5,uR,d);vec3 beach=mix(sand,sandWet,wetT);beach+=(hash(floor(vW.xz*6.0))-0.5)*0.04;vec3 c=mix(beach,grass,beachT);float pathD=abs(vW.x);float pathStart=uR+uBW-1.0;float pathRound=length(vec2(max(pathD-uPW+1.5,0.0),max(pathStart-vW.z,0.0)));float pathEdge=smoothstep(uPW,uPW-0.8,pathD)*smoothstep(0.0,1.5,vW.z-pathStart+1.5);float onPath=pathEdge*smoothstep(1.5,0.0,pathRound);vec3 dirt=vec3(0.72,0.58,0.38);dirt+=(hash(floor(vW.xz*4.0))-0.5)*0.05;vec3 dirtEdge=vec3(0.60,0.52,0.32);dirt=mix(dirt,dirtEdge,smoothstep(uPW-1.0,uPW,pathD));c=mix(c,dirt,onPath);float hole=smoothstep(uR-0.3,uR,d);float edge=smoothstep(70.0,55.0,d);gl_FragColor=vec4(c,edge*hole);}`,transparent:true,side:THREE.DoubleSide});
const groundGeo=new THREE.PlaneGeometry(160,160);groundGeo.rotateX(-Math.PI/2);const groundMesh=new THREE.Mesh(groundGeo,groundMat);groundMesh.position.y=-.05;scene.add(groundMesh);
const RIPPLE_MAX=8;const ripplePos=new Float32Array(RIPPLE_MAX*2);const rippleTime=new Float32Array(RIPPLE_MAX);rippleTime.fill(-10);let ripIdx=0;
const lakeMat=new THREE.ShaderMaterial({uniforms:{uTime:{value:0},uBeat:{value:0},uBass:{value:0},uMids:{value:0},uHighs:{value:0},uProg:{value:0},uCTop:{value:new THREE.Color(...THEMES.day.lakeTop)},uCMid:{value:new THREE.Color(...THEMES.day.lakeMid)},uCBot:{value:new THREE.Color(...THEMES.day.lakeBot)},uSunP:{value:new THREE.Vector3(18,28,-30)},uSunC:{value:new THREE.Color(...THEMES.day.sunColor)},uCam:{value:camera.position.clone()},uRipP:{value:ripplePos},uRipT:{value:rippleTime},uR:{value:LAKE_R}},
vertexShader:`uniform float uTime,uBeat,uBass,uR;uniform float uRipP[16];uniform float uRipT[8];varying vec3 vW;varying vec3 vN;varying float vD;void main(){vec4 w=modelMatrix*vec4(position,1.0);vD=length(w.xz);for(int i=0;i<8;i++){float rt=uTime-uRipT[i];if(rt>0.0&&rt<3.0){vec2 rp=vec2(uRipP[i*2],uRipP[i*2+1]);float rd=length(w.xz-rp);w.y+=sin(rd*4.0-rt*6.0)*exp(-rt*1.2)*exp(-rd*0.3)*0.15;}}vW=w.xyz;vN=vec3(0.0,1.0,0.0);gl_Position=projectionMatrix*viewMatrix*w;}`,
fragmentShader:`uniform vec3 uCTop,uCMid,uCBot,uSunP,uSunC,uCam;uniform float uTime,uHighs,uProg,uR;varying vec3 vW,vN;varying float vD;float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}void main(){if(vD>uR)discard;float t=clamp(vD/uR,0.0,1.0);vec3 c=t<0.5?mix(uCBot,uCMid,t*2.0):mix(uCMid,uCTop,(t-0.5)*2.0);vec3 V=normalize(uCam-vW);float fres=pow(1.0-max(dot(V,vN),0.0),3.0);c=mix(c,uSunC*0.6,fres*0.4);vec3 L=normalize(uSunP-vW),H=normalize(L+V);c+=uSunC*pow(max(dot(vN,H),0.0),60.0)*(0.5+uProg*0.4);float sp=hash(floor(vW.xz*8.0+uTime*0.5));sp=smoothstep(0.92-uHighs*0.08,1.0,sp);c+=sp*uSunC*0.3;float edge=smoothstep(uR,uR-0.5,vD);gl_FragColor=vec4(c,edge*0.92);}`,
transparent:true,side:THREE.DoubleSide});
const lakeGeo=new THREE.PlaneGeometry(LAKE_R*2,LAKE_R*2,128,128);lakeGeo.rotateX(-Math.PI/2);const lakeMesh=new THREE.Mesh(lakeGeo,lakeMat);lakeMesh.position.y=.01;scene.add(lakeMesh);
const SF_COUNT=3000;
const sfData=[];let sfMesh=null;
new GLTFLoader().load('/magical-mirai-2026/sunflower/sunflowers_field.glb',(gltf)=>{let sfGeo,sfMat;
gltf.scene.traverse((c)=>{if(c.isMesh&&c.material?.name==='sunflower'&&!sfGeo){sfGeo=c.geometry.clone();sfMat=c.material}});
if(!sfGeo)return;
sfGeo.computeBoundingBox();const bb=sfGeo.boundingBox;const baseH=bb.max.y-bb.min.y;
sfGeo.translate(-(bb.min.x+bb.max.x)/2,-bb.min.y,-(bb.min.z+bb.max.z)/2);
sfMesh=new THREE.InstancedMesh(sfGeo,sfMat,SF_COUNT);scene.add(sfMesh);
const m=new THREE.Matrix4();for(let i=0;i<SF_COUNT;){const minR=LAKE_R+6,maxR=50;const r=minR+Math.pow(Math.random(),.4)*(maxR-minR);const ang=Math.random()*Math.PI*2;const x=Math.cos(ang)*r,z=Math.sin(ang)*r;const onPath=z>LAKE_R+4&&Math.abs(x)<4.5;if(onPath)continue;const tgtH=1.2+Math.random()*2.5;const sc=tgtH/baseH;const phase=Math.random()*Math.PI*2;const yRot=Math.random()*Math.PI*2;
sfData.push({x,z,sc,phase,yRot});m.makeRotationY(yRot);m.scale(new THREE.Vector3(sc,sc,sc));m.setPosition(x,0,z);sfMesh.setMatrixAt(i,m);i++}
sfMesh.instanceMatrix.needsUpdate=true});
const PL_N=200;const plGeo=new THREE.BufferGeometry();const plPos=new Float32Array(PL_N*3),plVel=new Float32Array(PL_N*3);
for(let i=0;i<PL_N;i++){const a=Math.PI*0.5+(Math.random()-0.5)*Math.PI*1.5,r=LAKE_R+2+Math.random()*20;plPos[i*3]=Math.cos(a)*r;plPos[i*3+1]=.3+Math.random()*3;plPos[i*3+2]=Math.sin(a)*r;plVel[i*3]=(Math.random()-.5)*.02;plVel[i*3+1]=(Math.random()-.5)*.005;plVel[i*3+2]=(Math.random()-.5)*.02}
plGeo.setAttribute('position',new THREE.BufferAttribute(plPos,3));
const plMat=new THREE.PointsMaterial({color:0xffe880,size:.12,transparent:true,opacity:.6,depthWrite:false,blending:THREE.AdditiveBlending});scene.add(new THREE.Points(plGeo,plMat));
const SK_N=80;const skGeo=new THREE.BufferGeometry();const skPos=new Float32Array(SK_N*3);
for(let i=0;i<SK_N;i++){const a=Math.random()*Math.PI*2,r=Math.random()*(LAKE_R-.5);skPos[i*3]=Math.cos(a)*r;skPos[i*3+1]=.05;skPos[i*3+2]=Math.sin(a)*r}
skGeo.setAttribute('position',new THREE.BufferAttribute(skPos,3));
const skMat=new THREE.PointsMaterial({color:0xffffff,size:.15,transparent:true,opacity:.4,depthWrite:false,blending:THREE.AdditiveBlending});scene.add(new THREE.Points(skGeo,skMat));
const words=[];const wordGroup=new THREE.Group();scene.add(wordGroup);
function makeWordTex(text){const fs=42,c=document.createElement('canvas'),ctx=c.getContext('2d');ctx.font=`500 ${fs}px sans-serif`;const m=ctx.measureText(text),w=Math.ceil(m.width)+16,h=fs+16;c.width=w;c.height=h;ctx.font=`500 ${fs}px sans-serif`;ctx.textBaseline='middle';ctx.textAlign='center';ctx.fillStyle='white';ctx.fillText(text,w/2,h/2);const t=new THREE.CanvasTexture(c);t.minFilter=THREE.LinearFilter;return{tex:t,aspect:w/h}}
let lastAngle=0;let windSide=1;let gustActive=0,gustSide=1,gustSpd=1;
function spawnWord(text,wordIdx,isFirst,phraseLen,phraseDur){
if(isFirst||wordIdx===0){windSide=Math.random()>0.5?1:-1;lastAngle=windSide;const speed=Math.max(0.5,Math.min(2.0,phraseLen/(phraseDur/1000)));triggerGust(windSide,speed,phraseDur/1000+1)}const side=lastAngle;const x=side*(LAKE_R*0.4+Math.random()*LAKE_R*0.3);const z=8+Math.random()*8+wordIdx*0.3;const y=3+Math.random()*2;const{tex,aspect}=makeWordTex(text);const sc=1.8;const geo=new THREE.PlaneGeometry(sc*aspect,sc);const mat=new THREE.MeshBasicMaterial({map:tex,transparent:true,depthWrite:false,side:THREE.DoubleSide});const mesh=new THREE.Mesh(geo,mat);mesh.position.set(x,y,z);wordGroup.add(mesh);words.push({mesh,phase:'flying',life:0,x,z,y,rx:0,vx:-side*0.015*gustSpd,vz:-0.002-Math.random()*0.002,vy:-0.002-Math.random()*0.001,wobble:Math.random()*Math.PI*2,opacity:0,tgtOp:1,restT:0,restDur:180+Math.random()*120,aspect})}
function updateWords(dt,time,theme){for(let i=words.length-1;i>=0;i--){const w=words[i];w.life+=dt;w.opacity=Math.min(w.tgtOp,w.opacity+dt*2.5);
if(w.phase==='flying'){w.x+=w.vx*dt*60;w.z+=w.vz*dt*60;w.vy-=0.00015*dt*60;w.y+=w.vy*dt*60;w.y+=Math.sin(time*1.2+w.wobble)*0.002;w.mesh.lookAt(camera.position);const d=Math.sqrt(w.x*w.x+w.z*w.z);if(w.y<=0.15&&d<LAKE_R){w.phase='floating';w.y=0.15;w.rx=0;spawnSplash(w.x,0.1,w.z,8,0x88ccff);const ri=ripIdx;ripplePos[ri*2]=w.x;ripplePos[ri*2+1]=w.z;rippleTime[ri]=clock.getElapsedTime();ripIdx=(ripIdx+1)%RIPPLE_MAX}else if(w.y<=0.08){w.phase='resting';w.y=0.08;w.restT=0}const p=Math.min(1,w.life*0.3);w.mesh.material.color.setRGB(1,lerp(1,theme.sunColor[1],p),lerp(1,theme.sunColor[2]*0.6,p))}
else if(w.phase==='floating'){w.rx=Math.min(w.rx+dt*1.8,Math.PI/2);w.x+=Math.sin(time*0.3+w.wobble)*0.002;w.z+=Math.cos(time*0.25+w.wobble)*0.002;w.y=0.15+Math.sin(time*1.5+w.wobble)*0.02;w.mesh.rotation.set(-w.rx,0,0);w.restT+=dt;const rp=w.restT/(w.restDur/60);if(rp>0.6)w.opacity=1-(rp-0.6)/0.4;if(rp>=1){wordGroup.remove(w.mesh);w.mesh.geometry.dispose();w.mesh.material.map.dispose();w.mesh.material.dispose();words.splice(i,1);continue}}
else if(w.phase==='resting'){w.restT+=dt;const rp=w.restT/(w.restDur/60);w.opacity=rp>0.4?1-(rp-0.4)/0.6:1;if(rp>=1){wordGroup.remove(w.mesh);w.mesh.geometry.dispose();w.mesh.material.map.dispose();w.mesh.material.dispose();words.splice(i,1);continue}}
w.mesh.position.set(w.x,w.y,w.z);w.mesh.material.opacity=Math.max(0,w.opacity)}}
const SP_MAX=60;const splashArr=[];
function spawnSplash(x,y,z,n,col){for(let i=0;i<n;i++){const a=Math.random()*Math.PI*2,s=.02+Math.random()*.06;if(splashArr.length>=SP_MAX)splashArr.shift();splashArr.push({x,y:y+.1,z,vx:Math.cos(a)*s,vy:.04+Math.random()*.06,vz:Math.sin(a)*s,life:0,max:.6+Math.random()*.6,col})}}
const spGeo=new THREE.BufferGeometry();const spPos2=new Float32Array(SP_MAX*3),spCol2=new Float32Array(SP_MAX*3);spGeo.setAttribute('position',new THREE.BufferAttribute(spPos2,3));spGeo.setAttribute('color',new THREE.BufferAttribute(spCol2,3));
const spMat2=new THREE.PointsMaterial({size:.12,transparent:true,opacity:.8,depthWrite:false,vertexColors:true,blending:THREE.AdditiveBlending});scene.add(new THREE.Points(spGeo,spMat2));
function updateSplash(dt){for(let i=splashArr.length-1;i>=0;i--){const p=splashArr[i];p.life+=dt;if(p.life>=p.max){splashArr.splice(i,1);continue}p.x+=p.vx;p.y+=p.vy;p.z+=p.vz;p.vy-=.002}const pos=spGeo.attributes.position.array,col=spGeo.attributes.color.array;for(let i=0;i<SP_MAX;i++){if(i<splashArr.length){const p=splashArr[i],c=new THREE.Color(p.col),f=1-p.life/p.max;pos[i*3]=p.x;pos[i*3+1]=p.y;pos[i*3+2]=p.z;col[i*3]=c.r*f;col[i*3+1]=c.g*f;col[i*3+2]=c.b*f}else{pos[i*3+1]=-100}}spGeo.attributes.position.needsUpdate=true;spGeo.attributes.color.needsUpdate=true}
const camTgt={az:0,el:0},camCur={az:0,el:0};const BASE_POS=new THREE.Vector3(0,5,32),LOOK_AT=new THREE.Vector3(0,0,-2);
/* ── Wind gusts ── */
const WIND_N=120;const windGeo=new THREE.BufferGeometry();const windPos=new Float32Array(WIND_N*3);const windAlpha=new Float32Array(WIND_N);
windGeo.setAttribute('position',new THREE.BufferAttribute(windPos,3));windGeo.setAttribute('alpha',new THREE.BufferAttribute(windAlpha,1));
const windMat=new THREE.ShaderMaterial({uniforms:{uColor:{value:new THREE.Color(1,1,1)}},vertexShader:`attribute float alpha;varying float vA;void main(){vA=alpha;vec4 mv=modelViewMatrix*vec4(position,1.0);gl_PointSize=mix(2.0,6.0,alpha)*(300.0/-mv.z);gl_Position=projectionMatrix*mv;}`,fragmentShader:`uniform vec3 uColor;varying float vA;void main(){float d=length(gl_PointCoord-0.5)*2.0;float a=smoothstep(1.0,0.3,d)*vA*0.5;gl_FragColor=vec4(uColor,a);}`,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending});
scene.add(new THREE.Points(windGeo,windMat));
const windStreaks=[];
for(let i=0;i<WIND_N;i++){windStreaks.push({x:0,y:0,z:0,vx:0,vz:0,life:0,max:0,active:false})}
let gustDir={x:-1,z:0.1},gustStrength=0,gustLife=0,gustDuration=0;
function triggerGust(side,speed,dur){gustSide=side;gustSpd=speed;gustDir.x=-side;gustDir.z=(Math.random()-0.5)*0.2;gustStrength=0.3+speed*0.25;gustDuration=dur;gustLife=dur;
for(let i=0;i<WIND_N;i++){const s=windStreaks[i];s.x=side*(4+Math.random()*LAKE_R*0.8);s.y=0.3+Math.random()*3.5;s.z=-8+Math.random()*20;s.vx=-side*(0.8+Math.random()*0.5)*gustStrength;s.vz=(Math.random()-0.5)*0.15*gustStrength;s.life=Math.random()*0.5;s.max=dur*0.4+Math.random()*dur*0.6;s.active=true}}
function updateWind(dt,time){
gustLife=Math.max(0,gustLife-dt);const gPow=gustLife>0?Math.sin(Math.min(1,(gustDuration-gustLife)/0.4)*Math.PI*0.5)*Math.min(1,gustLife/0.5):0;
/* push flying words */
if(gPow>0.05){for(const w of words){if(w.phase==='flying'){const push=gPow*gustStrength*dt*0.006;w.vx+=gustDir.x*push;w.vz+=gustDir.z*push*0.3}}}
/* update streak particles */
for(let i=0;i<WIND_N;i++){const s=windStreaks[i];if(!s.active){windPos[i*3+1]=-100;windAlpha[i]=0;continue}s.life+=dt;if(s.life>=s.max){s.active=false;windAlpha[i]=0;continue}const t=s.life/s.max;const fade=(t<0.15?t/0.15:t>0.7?(1-t)/0.3:1)*gPow;s.x+=s.vx*dt*60;s.y+=Math.sin(time*2+i*0.7)*0.004;s.z+=s.vz*dt*60;windPos[i*3]=s.x;windPos[i*3+1]=s.y;windPos[i*3+2]=s.z;windAlpha[i]=fade*0.4}
windGeo.attributes.position.needsUpdate=true;windGeo.attributes.alpha.needsUpdate=true}
let _dragging=false,_dragX=0,_dragY=0;
let _dragMoved=false;
window.addEventListener('mousedown',(e)=>{if(e.button===0){_dragging=true;_dragMoved=false;_dragX=e.clientX;_dragY=e.clientY}});
window.addEventListener('mousemove',(e)=>{if(!_dragging)return;const dx=e.clientX-_dragX,dy=e.clientY-_dragY;if(Math.abs(dx)>2||Math.abs(dy)>2)_dragMoved=true;camTgt.az-=dx/innerWidth*Math.PI;camTgt.el+=dy/innerHeight*.6;camTgt.el=Math.max(-.5,Math.min(.5,camTgt.el));_dragX=e.clientX;_dragY=e.clientY});
window.addEventListener('mouseup',(e)=>{_dragging=false;if(!_dragMoved)onPtr(e)});
function updateCam(dt){camCur.az=camTgt.az;camCur.el=camTgt.el;const lookDist=20;const lx=BASE_POS.x+Math.sin(camCur.az)*lookDist;const ly=BASE_POS.y+Math.sin(camCur.el)*lookDist;const lz=BASE_POS.z-Math.cos(camCur.az)*lookDist;camera.position.copy(BASE_POS);camera.lookAt(lx,ly,lz)}
const rc=new THREE.Raycaster(),ptr=new THREE.Vector2();
function onPtr(e){const cx=e.touches?e.touches[0].clientX:e.clientX;const cy=e.touches?e.touches[0].clientY:e.clientY;ptr.x=(cx/innerWidth)*2-1;ptr.y=-(cy/innerHeight)*2+1;rc.setFromCamera(ptr,camera);const wh=rc.intersectObjects(wordGroup.children,false);if(wh.length){const wo=words.find(w=>w.mesh===wh[0].object);if(wo){spawnSplash(wo.x,wo.y,wo.z,15,0xffcc33);wo.tgtOp=0;wo.phase='resting';wo.restT=wo.restDur/60*.7}return}const lh=rc.intersectObject(lakeMesh,false);if(lh.length){const p=lh[0].point;ripplePos[ripIdx*2]=p.x;ripplePos[ripIdx*2+1]=p.z;rippleTime[ripIdx]=clock.getElapsedTime();ripIdx=(ripIdx+1)%RIPPLE_MAX;spawnSplash(p.x,p.y,p.z,10,0x88ccff);return}}
window.addEventListener('touchstart',(e)=>{if(e.target.closest('#player'))return;onPtr(e)},{passive:true});
const _m4=new THREE.Matrix4(),_eu=new THREE.Euler(),_sc=new THREE.Vector3();
function animate(){requestAnimationFrame(animate);const dt=Math.min(clock.getDelta(),.05),time=clock.getElapsedTime();smoothProgress+=(songProgress-smoothProgress)*dt*1.2;beatPulse*=Math.pow(BEAT_DECAY,dt*60);const th=getTheme(smoothProgress);
skyMat.uniforms.uTop.value.setRGB(...th.skyTop);skyMat.uniforms.uBot.value.setRGB(...th.skyBot);
lakeMat.uniforms.uTime.value=time;lakeMat.uniforms.uBeat.value=beatPulse;lakeMat.uniforms.uBass.value=audioData.bass;lakeMat.uniforms.uMids.value=audioData.mids;lakeMat.uniforms.uHighs.value=audioData.highs;lakeMat.uniforms.uProg.value=smoothProgress;lakeMat.uniforms.uCTop.value.setRGB(...th.lakeTop);lakeMat.uniforms.uCMid.value.setRGB(...th.lakeMid);lakeMat.uniforms.uCBot.value.setRGB(...th.lakeBot);lakeMat.uniforms.uSunP.value.set(...th.sunPos);lakeMat.uniforms.uSunC.value.setRGB(...th.sunColor);lakeMat.uniforms.uCam.value.copy(camera.position);
groundMat.uniforms.uNear.value.setRGB(...th.groundNear);groundMat.uniforms.uFar.value.setRGB(...th.groundFar);groundMat.uniforms.uTime.value=time;
sunSprite.position.set(...th.sunPos);sunSprite.material.color.setRGB(...th.sunColor);sunLight.position.set(...th.sunPos);sunLight.color.setRGB(...th.sunColor);ambientLight.color.setRGB(lerp(1,th.sunColor[0],.3),lerp(.97,th.sunColor[1],.3),lerp(.88,th.sunColor[2],.3));bloomPass.strength=th.bloomStr+audioData.mids*.3;
if(sfMesh){const wt=time*.8,sa=.08+beatPulse*.15+audioData.bass*.12;for(let i=0;i<SF_COUNT;i++){const sf=sfData[i];const s1=Math.sin(wt+sf.phase)*sa,s2=Math.sin(wt*.7+sf.phase*1.3)*sa*.5;_m4.identity();_eu.set(s1,sf.yRot,s2);_m4.makeRotationFromEuler(_eu);_sc.set(sf.sc,sf.sc,sf.sc);_m4.scale(_sc);_m4.setPosition(sf.x,0,sf.z);sfMesh.setMatrixAt(i,_m4)}sfMesh.instanceMatrix.needsUpdate=true}
const pp=plGeo.attributes.position.array;for(let i=0;i<PL_N;i++){pp[i*3]+=plVel[i*3]+Math.sin(time*.3+i)*.001;pp[i*3+1]+=plVel[i*3+1]+Math.sin(time*.5+i*.7)*.001;pp[i*3+2]+=plVel[i*3+2]+Math.cos(time*.3+i)*.001;const d=Math.sqrt(pp[i*3]**2+pp[i*3+2]**2);if(d>48||pp[i*3+1]>5||pp[i*3+1]<.2){const a=Math.PI*.5+(Math.random()-.5)*Math.PI*1.5,r=LAKE_R+2+Math.random()*20;pp[i*3]=Math.cos(a)*r;pp[i*3+1]=.3+Math.random()*3;pp[i*3+2]=Math.sin(a)*r}}plGeo.attributes.position.needsUpdate=true;plMat.opacity=.3+audioData.highs*.4;
skMat.opacity=.2+audioData.highs*.5+smoothProgress*.2;skMat.size=.1+audioData.highs*.15;
updateWords(dt,time,th);updateSplash(dt);updateWind(dt,time);updateCam(dt);composer.render()}
animate();
window.Beach={spawnWord,triggerBeat(){beatPulse=1},setProgress(pos,dur){if(dur>0)songProgress=Math.max(0,Math.min(1,pos/dur))},setAudioData(d){audioData.bass=d.bass;audioData.mids=d.mids;audioData.highs=d.highs}};
