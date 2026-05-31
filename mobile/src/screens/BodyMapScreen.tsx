import React, { useState, useRef, useCallback } from 'react';
import {
  StyleSheet, Text, View, TouchableOpacity, ScrollView,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView, WebViewMessageEvent } from 'react-native-webview';
import { Asset } from 'expo-asset';
import * as FileSystem from 'expo-file-system/legacy';
import { MaterialIcons } from '@expo/vector-icons';

// ─── Palette ────────────────────────────────────────────────────────────────
const C = {
  primary:                '#003f87',
  surface:                '#f7f9fc',
  onSurface:              '#191c1e',
  onSurfaceVariant:       '#424752',
  containerLow:           '#f2f4f7',
  containerHighest:       '#e0e3e6',
  containerLowest:        '#ffffff',
  containerHigh:          '#e6e8eb',
  emergency:              '#b10f2b',
  outline:                '#727784',
  white:                  '#ffffff',
  secondaryContainer:     '#cbe6ff',
  onSecondaryFixedVariant:'#30495d',
  pinColor:               '#E53935',
};

// ─── 3D Viewer HTML ─────────────────────────────────────────────────────────
// This HTML runs inside a WebView with a real browser engine, so all browser
// APIs (WebGL, TextDecoder, atob, etc.) are natively available.
const VIEWER_HTML = `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no">
<style>
  body{margin:0;overflow:hidden;background-color:#f4f5f7;font-family:sans-serif;}
  #gl-container{width:100%;height:100%;}
  
  /* D-pad styling */
  .dpad {
    position: absolute; bottom: 30px; right: 20px;
    width: 130px; height: 130px;
    border-radius: 65px;
    background: rgba(255, 255, 255, 0.9);
    box-shadow: 0 6px 15px rgba(0, 0, 0, 0.15);
    display: flex; justify-content: center; align-items: center;
    z-index: 100;
  }
  .dpad-btn {
    position: absolute;
    width: 44px; height: 44px;
    display: flex; justify-content: center; align-items: center;
    font-size: 18px; color: #ba0020;
    border-radius: 22px;
    user-select: none;
  }
  .dpad-btn:active { background: rgba(186, 0, 32, 0.1); }
  .dpad-up { top: 5px; left: 43px; }
  .dpad-down { bottom: 5px; left: 43px; }
  .dpad-left { top: 43px; left: 5px; }
  .dpad-right { top: 43px; right: 5px; }
  .dpad-center { width: 40px; height: 40px; border-radius: 20px; background: rgba(0,0,0,0.03); }
</style>
</head>
<body>
<div id="gl-container"></div>

<!-- D-pad Overlay -->
<div class="dpad">
  <div class="dpad-center"></div>
  <div class="dpad-btn dpad-up" id="dpad-up">▲</div>
  <div class="dpad-btn dpad-down" id="dpad-down">▼</div>
  <div class="dpad-btn dpad-left" id="dpad-left">◀</div>
  <div class="dpad-btn dpad-right" id="dpad-right">▶</div>
</div>

<div id="loading"><div class="spinner"></div><div>Loading 3D model&#8230;</div></div>
<div id="error"></div>

<script type="importmap">
{
  "imports":{
    "three":"https://cdn.jsdelivr.net/npm/three@0.162.0/build/three.module.js",
    "three/examples/jsm/":"https://cdn.jsdelivr.net/npm/three@0.162.0/examples/jsm/"
  }
}
</script>

<script>
  window.__threeLoaded=false;
  setTimeout(function(){
    if(!window.__threeLoaded){
      document.getElementById('loading').style.display='none';
      var e=document.getElementById('error');
      e.style.display='block';
      e.textContent='Failed to load 3D engine. Please check your internet connection and try again.';
      try{window.ReactNativeWebView.postMessage(JSON.stringify({type:'error',message:'Three.js CDN load timeout'}))}catch(x){}
    }
  },20000);
</script>

<script type="module">
import * as THREE from 'three';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';

window.__threeLoaded=true;

var loadingEl=document.getElementById('loading');
var errorEl=document.getElementById('error');

function send(msg){
  try{window.ReactNativeWebView.postMessage(JSON.stringify(msg))}catch(e){}
}

function showError(msg){
  loadingEl.style.display='none';
  errorEl.style.display='block';
  errorEl.textContent=msg;
  send({type:'error',message:msg});
}

// ── Scene ──
var renderer=new THREE.WebGLRenderer({antialias:true});
renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));
renderer.setClearColor(0xf2f4f7,1);
renderer.outputColorSpace=THREE.SRGBColorSpace;
document.getElementById('gl-container').appendChild(renderer.domElement);

var scene=new THREE.Scene();
var camera=new THREE.PerspectiveCamera(50,1,0.05,60);
camera.position.set(0,0,5);

// Lights
scene.add(new THREE.AmbientLight(0xffffff,0.9));
var keyLight=new THREE.DirectionalLight(0xffffff,0.7);
keyLight.position.set(2,4,5);
scene.add(keyLight);
var fillLight=new THREE.DirectionalLight(0x99aacc,0.35);
fillLight.position.set(-3,-1,-3);
scene.add(fillLight);
var rimLight=new THREE.DirectionalLight(0xffffff,0.25);
rimLight.position.set(0,-2,-4);
scene.add(rimLight);

// Controls (rotation only)
var controls=new OrbitControls(camera,renderer.domElement);
controls.enableZoom=true;
controls.minDistance=2.0;
controls.maxDistance=10.0;
controls.enablePan=false;
controls.rotateSpeed=0.7;
controls.enableDamping=true;
controls.dampingFactor=0.12;
controls.minPolarAngle=Math.PI*0.1; 
controls.maxPolarAngle=Math.PI*0.9;

// Resize
function resize(){
  var container = document.getElementById('gl-container');
  var w=container.clientWidth,h=container.clientHeight;
  renderer.setSize(w,h);
  camera.aspect=w/h;
  camera.updateProjectionMatrix();
}
window.addEventListener('resize',resize);
resize();

// ── State ──
var innerModel=null;
var bodyMeshes=[];
var markers=new Map();
var rotationFlags = { up: false, down: false, left: false, right: false };

// ── Body-region detection ──
function detectBodyRegion(pt){
  var h=pt.y+0.9, x=pt.x, z=pt.z, ax=Math.abs(x);
  var isPatientLeft = x > 0; 
  var side = isPatientLeft ? 'Left' : 'Right';
  var sid = side.toLowerCase();

  if (h > 1.53) {
    if (h > 1.76) return {id: 'crown', name: 'Crown / Top of Head'};
    if (h < 1.60 && ax < 0.08) {
      return z > 0 ? {id: 'front_neck', name: 'Front of Neck'} : {id: 'back_neck', name: 'Nape / Back of Neck'};
    }
    if (z > 0.03) {
      if (h > 1.73) return {id: 'forehead', name: 'Forehead'};
      if (h > 1.67) return {id: 'eyes', name: 'Eyes'};
      if (h > 1.62) return {id: 'nose', name: 'Nose'};
      return {id: 'mouth_jaw', name: 'Mouth / Jaw'};
    } else if (z < -0.03) {
      if (h > 1.65) return {id: 'back_head', name: 'Back of Head'};
      return {id: 'lower_back_head', name: 'Lower Back of Head'};
    } else {
      if (h > 1.62 && ax > 0.05) return {id: sid+'_ear', name: side+' Ear / Temple'};
      return {id: 'side_head', name: 'Side of Head'};
    }
  }

  var isArm = false;
  if (h > 0.60 && ax > 0.10) isArm = true; 

  if (isArm) {
    if (h > 1.35) return {id: sid+'_shoulder', name: side+' Shoulder'};
    if (h > 1.15) return {id: sid+'_upper_arm', name: side+' Upper Arm'};
    if (h > 1.05) return {id: sid+'_elbow', name: side+' Elbow'};
    if (h > 0.85) return {id: sid+'_forearm', name: side+' Forearm'};
    if (h > 0.75) {
      return z > 0 ? {id: sid+'_palm', name: side+' Palm'} : {id: sid+'_back_hand', name: side+' Back of Hand'};
    }
    return {id: sid+'_fingers', name: side+' Fingers'};
  }

  if (h > 1.25 && ax > 0.12) {
    return z > 0 ? {id: sid+'_armpit', name: side+' Armpit / Outer Chest'} : {id: sid+'_back_shoulder', name: side+' Back Shoulder'};
  }
  if (h > 1.30) {
    return z > 0 ? {id: 'chest', name: 'Chest / Pectorals'} : {id: 'upper_back', name: 'Upper Back'};
  }
  if (h > 1.00) {
    return z > 0 ? {id: 'abdomen', name: 'Abdomen / Belly'} : {id: 'lower_back', name: 'Lower Back'};
  }
  if (h > 0.82) {
    return z > 0 ? {id: 'pelvis', name: 'Pelvis / Groin'} : {id: 'buttocks', name: 'Buttocks'};
  }

  if (h > 0.50) {
    return z > 0 ? {id: sid+'_front_thigh', name: side+' Front Thigh'} : {id: sid+'_hamstring', name: side+' Back Thigh (Hamstring)'};
  }
  if (h > 0.40) {
    return z > 0 ? {id: sid+'_knee', name: side+' Knee'} : {id: sid+'_back_knee', name: side+' Back of Knee'};
  }
  if (h > 0.10) {
    return z > 0 ? {id: sid+'_shin', name: side+' Shin'} : {id: sid+'_calf', name: side+' Calf'};
  }
  
  if (h <= 0.025) return {id: sid+'_sole', name: side+' Sole'};
  if (h > 0.04 && z < -0.05) return {id: sid+'_heel', name: side+' Heel'};
  if (z > 0.10) return {id: sid+'_toes', name: side+' Toes'};
  return {id: sid+'_foot', name: side+' Top of Foot'};
}

// ── Tap detection ──
var pointerStart=null;
renderer.domElement.addEventListener('pointerdown',function(e){
  pointerStart={x:e.clientX,y:e.clientY,time:Date.now()};
});
renderer.domElement.addEventListener('pointerup',function(e){
  if(!pointerStart)return;
  var dx=e.clientX-pointerStart.x;
  var dy=e.clientY-pointerStart.y;
  var dist=Math.sqrt(dx*dx+dy*dy);
  var dt=Date.now()-pointerStart.time;
  if(dist<12&&dt<400) handleTap(e.clientX,e.clientY);
  pointerStart=null;
});

function handleTap(cx,cy){
  if(!innerModel)return;
  var rect=renderer.domElement.getBoundingClientRect();
  var ndx=((cx-rect.left)/rect.width)*2-1;
  var ndy=-((cy-rect.top)/rect.height)*2+1;
  var ray=new THREE.Raycaster();
  ray.setFromCamera(new THREE.Vector2(ndx,ndy),camera);
  var hits=ray.intersectObjects(bodyMeshes,false);
  if(hits.length===0)return;

  var worldHit=hits[0].point.clone();
  var region=detectBodyRegion(worldHit);
  if(!region)return;

  if(markers.has(region.id)){
    removeMarker(region.id);
    send({type:'regionRemoved',region:region});
  }else{
    addMarker(region.id,worldHit);
    send({type:'regionAdded',region:region});
  }
}

function addMarker(id,position){
  var geo=new THREE.SphereGeometry(0.025,14,14);
  var mat=new THREE.MeshBasicMaterial({color:0xe53935,depthTest:true});
  var mesh=new THREE.Mesh(geo,mat);
  mesh.position.copy(position);
  var dir=position.clone().normalize();
  mesh.position.addScaledVector(dir,0.005);
  scene.add(mesh);
  markers.set(id,mesh);
}

function removeMarker(id){
  var m=markers.get(id);
  if(m){
    scene.remove(m);
    m.geometry.dispose();
    m.material.dispose();
    markers.delete(id);
  }
}

function setupDpad() {
  var dpadUp = document.getElementById('dpad-up');
  var dpadDown = document.getElementById('dpad-down');
  var dpadLeft = document.getElementById('dpad-left');
  var dpadRight = document.getElementById('dpad-right');
  
  function bind(el, key) {
    el.addEventListener('touchstart', function(e) { e.preventDefault(); e.stopPropagation(); rotationFlags[key] = true; }, {passive:false});
    el.addEventListener('touchend', function(e) { e.preventDefault(); e.stopPropagation(); rotationFlags[key] = false; }, {passive:false});
    el.addEventListener('mousedown', function(e) { e.preventDefault(); e.stopPropagation(); rotationFlags[key] = true; });
    el.addEventListener('mouseup', function(e) { e.preventDefault(); e.stopPropagation(); rotationFlags[key] = false; });
    el.addEventListener('mouseleave', function(e) { rotationFlags[key] = false; });
  }
  
  bind(dpadUp, 'up');
  bind(dpadDown, 'down');
  bind(dpadLeft, 'left');
  bind(dpadRight, 'right');
}
setupDpad();

// ── API ──
var modelChunks=[];
window.__receiveModelChunk=function(chunk,isLast){
  modelChunks.push(chunk);
  if(isLast){
    var fullB64=modelChunks.join('');
    modelChunks=[];
    loadModel(fullB64);
  }
};

window.__removeRegion=function(id){ removeMarker(id); };
window.__clearAll=function(){
  markers.forEach(function(m){ scene.remove(m); m.geometry.dispose(); m.material.dispose(); });
  markers.clear();
};

function loadModel(b64){
  try{
    var binary=atob(b64);
    var bytes=new Uint8Array(binary.length);
    for(var i=0;i<binary.length;i++) bytes[i]=binary.charCodeAt(i);
    var loader=new GLTFLoader();
    loader.parse(bytes.buffer,'',function(gltf){
      var model=gltf.scene;
      model.traverse(function(obj){
        if(obj.isMesh){
          obj.material=new THREE.MeshLambertMaterial({color:0xc8956c,side:THREE.DoubleSide});
          bodyMeshes.push(obj);
        }
      });
      model.rotation.set(0,0,0);
      scene.add(model);
      innerModel=model;
      model.updateMatrixWorld(true);
      var box=new THREE.Box3().setFromObject(model);
      var center=box.getCenter(new THREE.Vector3());
      var size=box.getSize(new THREE.Vector3());
      var maxDim = Math.max(size.x, size.y, size.z);
      var scaleF=1.8/Math.max(maxDim,0.001);
      model.scale.setScalar(scaleF);
      model.position.set(-center.x*scaleF,-center.y*scaleF,-center.z*scaleF);
      loadingEl.style.display='none';
      send({type:'loaded'});
    },function(err){ showError('Model parse error: '+String(err)); });
  }catch(e){ showError('Model load error: '+e.message); }
}

// ── Render loop ──
function animate(){
  requestAnimationFrame(animate);
  
  if (rotationFlags.left || rotationFlags.right || rotationFlags.up || rotationFlags.down) {
    var offset = new THREE.Vector3().copy(camera.position).sub(controls.target);
    var spherical = new THREE.Spherical().setFromVector3(offset);
    if (rotationFlags.left) spherical.theta -= 0.04;
    if (rotationFlags.right) spherical.theta += 0.04;
    if (rotationFlags.up) spherical.phi -= 0.04;
    if (rotationFlags.down) spherical.phi += 0.04;
    
    spherical.phi = Math.max(controls.minPolarAngle, Math.min(controls.maxPolarAngle, spherical.phi));
    spherical.makeSafe();
    offset.setFromSpherical(spherical);
    camera.position.copy(controls.target).add(offset);
    controls.update();
  } else {
    controls.update();
  }
  
  renderer.render(scene, camera);
}
animate();

send({type:'ready'});
</script>
</body>
</html>
`;

// ─── Types ───────────────────────────────────────────────────────────────────
interface SelectedRegion { id: string; name: string; }
interface Props { onBack?: () => void; onContinue?: () => void; }

// ─── Component ───────────────────────────────────────────────────────────────
export default function BodyMapScreen({ onBack, onContinue }: Props) {
  const [selected,  setSelected]  = useState<SelectedRegion[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [loadError, setLoadError] = useState('');

  const webViewRef      = useRef<WebView>(null);
  const modelSentRef    = useRef(false);

  // ── Send GLB model data to WebView ─────────────────────────────────────────
  const sendModelToWebView = useCallback(async () => {
    try {
      const asset = Asset.fromModule(require('../../assets/human-anatomy.glb'));
      await asset.downloadAsync();
      const localUri = asset.localUri!;

      const b64 = await FileSystem.readAsStringAsync(localUri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // Send in 512KB chunks to avoid injectJavaScript size limits
      const CHUNK_SIZE = 512 * 1024;
      const totalChunks = Math.ceil(b64.length / CHUNK_SIZE);

      for (let i = 0; i < totalChunks; i++) {
        const chunk = b64.slice(i * CHUNK_SIZE, (i + 1) * CHUNK_SIZE);
        const isLast = i === totalChunks - 1;
        webViewRef.current?.injectJavaScript(
          `window.__receiveModelChunk("${chunk}",${isLast});true;`
        );
      }
    } catch (e: any) {
      setLoadError(e?.message ?? 'Failed to load model asset');
      setLoading(false);
    }
  }, []);

  // ── Handle messages from WebView ───────────────────────────────────────────
  const onMessage = useCallback((event: WebViewMessageEvent) => {
    try {
      const msg = JSON.parse(event.nativeEvent.data);
      switch (msg.type) {
        case 'ready':
          if (!modelSentRef.current) {
            modelSentRef.current = true;
            sendModelToWebView();
          }
          break;
        case 'loaded':
          setLoading(false);
          break;
        case 'error':
          setLoadError(msg.message || 'Unknown 3D rendering error');
          setLoading(false);
          break;
        case 'regionAdded':
          setSelected(prev => {
            // Prevent duplicates
            if (prev.some(s => s.id === msg.region.id)) return prev;
            return [...prev, msg.region];
          });
          break;
        case 'regionRemoved':
          setSelected(prev => prev.filter(s => s.id !== msg.region.id));
          break;
      }
    } catch {
      // Ignore malformed messages
    }
  }, [sendModelToWebView]);

  // ── Remove a region (called from RN UI) ────────────────────────────────────
  const removeRegion = useCallback((id: string) => {
    webViewRef.current?.injectJavaScript(
      `window.__removeRegion("${id}");true;`
    );
    setSelected(prev => prev.filter(s => s.id !== id));
  }, []);

  // ── Clear all regions ──────────────────────────────────────────────────────
  const clearAll = useCallback(() => {
    webViewRef.current?.injectJavaScript(
      'window.__clearAll();true;'
    );
    setSelected([]);
  }, []);

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <SafeAreaView style={s.safe}>
      {/* Header */}
      <View style={s.header}>
        <View style={s.brand}>
          <MaterialIcons name="assignment" size={22} color={C.primary} />
          <Text style={s.brandText}>MOI DOCTAR</Text>
        </View>
        <TouchableOpacity style={s.emergencyBtn}>
          <Text style={s.emergencyText}>EMERGENCY</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        <View style={s.instructionSection}>
          <Text style={s.stepText}>STEP 1 OF 3</Text>
          <Text style={s.title}>Where is the pain?</Text>
          <Text style={s.subtitle}>
            Tap the 3D body to mark a pain area. Drag left or right to rotate.
          </Text>
        </View>

        <View style={s.glContainer}>
          {loading && (
            <View style={s.loadingOverlay}>
              <ActivityIndicator size="large" color={C.primary} />
              <Text style={s.loadingText}>Loading 3D model...</Text>
            </View>
          )}
          {Boolean(loadError) && (
            <View style={s.errorOverlay}>
              <Text style={s.errorText}>Error: {loadError}</Text>
            </View>
          )}
          <WebView
            ref={webViewRef}
            source={{ html: VIEWER_HTML }}
            style={s.webView}
            onMessage={onMessage}
            javaScriptEnabled={true}
            originWhitelist={['*']}
            scrollEnabled={false}
            bounces={false}
            overScrollMode="never"
            allowsInlineMediaPlayback={true}
            mediaPlaybackRequiresUserAction={false}
            startInLoadingState={false}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            androidLayerType="hardware"
            setBuiltInZoomControls={false}
            setDisplayZoomControls={false}
          />
        </View>

        <View style={s.selectedRegionsSection}>
          <Text style={s.selectedRegionsTitle}>Selected Regions</Text>
          {selected.length === 0 ? (
            <Text style={s.noRegionsText}>No regions selected yet.</Text>
          ) : (
            <View style={s.regionList}>
              {selected.map((region) => (
                <View key={region.id} style={s.regionItem}>
                  <Text style={s.regionText}>{region.name}</Text>
                  <TouchableOpacity onPress={() => removeRegion(region.id)} style={s.removeRegionBtn}>
                    <MaterialIcons name="close" size={18} color={C.onSurfaceVariant} />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
          {selected.length > 0 && (
            <TouchableOpacity onPress={clearAll} style={s.clearAllBtn}>
              <Text style={s.clearAllText}>Clear All</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={s.footerButtons}>
          {onBack && (
            <TouchableOpacity onPress={onBack} style={s.backButton}>
              <Text style={s.buttonText}>Back</Text>
            </TouchableOpacity>
          )}
          {onContinue && (
            <TouchableOpacity onPress={onContinue} style={s.continueButton}>
              <Text style={s.buttonText}>Continue</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: C.surface,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: C.containerHigh,
  },
  brand: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  brandText: {
    marginLeft: 8,
    fontSize: 18,
    fontWeight: 'bold',
    color: C.onSurface,
  },
  emergencyBtn: {
    backgroundColor: C.emergency,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  emergencyText: {
    color: C.white,
    fontWeight: 'bold',
    fontSize: 12,
  },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  instructionSection: {
    marginTop: 20,
    marginBottom: 20,
  },
  stepText: {
    fontSize: 12,
    color: C.primary,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: C.onSurface,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: C.onSurfaceVariant,
    lineHeight: 22,
  },
  glContainer: {
    width: '100%',
    aspectRatio: 0.75,
    backgroundColor: C.containerLow,
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
    marginBottom: 20,
  },
  webView: {
    width: '100%',
    height: '100%',
    backgroundColor: 'transparent',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255,255,255,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  loadingText: {
    marginTop: 10,
    color: C.onSurface,
  },
  errorOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255,0,0,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  errorText: {
    color: C.emergency,
    textAlign: 'center',
    padding: 20,
  },
  selectedRegionsSection: {
    marginBottom: 20,
  },
  selectedRegionsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: C.onSurface,
    marginBottom: 10,
  },
  noRegionsText: {
    color: C.onSurfaceVariant,
    fontStyle: 'italic',
  },
  regionList: {
    backgroundColor: C.containerLowest,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: C.containerHigh,
    padding: 10,
  },
  regionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: C.containerLow,
  },
  regionText: {
    fontSize: 16,
    color: C.onSurface,
  },
  removeRegionBtn: {
    padding: 4,
  },
  clearAllBtn: {
    marginTop: 10,
    alignSelf: 'flex-start',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: C.containerHigh,
    borderRadius: 4,
  },
  clearAllText: {
    color: C.onSurfaceVariant,
    fontWeight: 'bold',
  },
  footerButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  backButton: {
    backgroundColor: C.containerHigh,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    flex: 1,
    marginRight: 10,
    alignItems: 'center',
  },
  continueButton: {
    backgroundColor: C.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    flex: 1,
    marginLeft: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: C.white,
    fontWeight: 'bold',
    fontSize: 16,
  },
});
