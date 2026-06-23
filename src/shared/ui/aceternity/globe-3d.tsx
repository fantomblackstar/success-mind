"use client";

import React, { useRef, useMemo, useState, useCallback, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Html, OrbitControls, useTexture } from "@react-three/drei";
import * as THREE from "three";
import { cn } from "@/shared/lib";

export interface GlobeMarker {
  lat: number;
  lng: number;
  label?: string;
  size?: number;
}

export interface Globe3DConfig {
  radius?: number;
  globeColor?: string;
  textureUrl?: string;
  bumpMapUrl?: string;
  showAtmosphere?: boolean;
  atmosphereColor?: string;
  atmosphereIntensity?: number;
  atmosphereBlur?: number;
  bumpScale?: number;
  autoRotateSpeed?: number;
  enableZoom?: boolean;
  enablePan?: boolean;
  minDistance?: number;
  maxDistance?: number;
  initialRotation?: { x: number; y: number };
  markerSize?: number;
  showWireframe?: boolean;
  wireframeColor?: string;
  ambientIntensity?: number;
  pointLightIntensity?: number;
  backgroundColor?: string | null;
}

interface Globe3DProps {
  markers?: GlobeMarker[];
  config?: Globe3DConfig;
  className?: string;
  onMarkerClick?: (marker: GlobeMarker) => void;
  onMarkerHover?: (marker: GlobeMarker | null) => void;
}

const DEFAULT_EARTH_TEXTURE =
  "https://unpkg.com/three-globe@2.31.0/example/img/earth-blue-marble.jpg";
const DEFAULT_BUMP_TEXTURE =
  "https://unpkg.com/three-globe@2.31.0/example/img/earth-topology.png";

function latLngToVector3(lat: number, lng: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);

  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);

  return new THREE.Vector3(x, y, z);
}

interface MarkerProps {
  marker: GlobeMarker;
  radius: number;
  defaultSize: number;
  onClick?: (marker: GlobeMarker) => void;
  onHover?: (marker: GlobeMarker | null) => void;
}

function Marker({ marker, radius, defaultSize, onClick, onHover }: MarkerProps) {
  const [hovered, setHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const groupRef = useRef<THREE.Group>(null);
  const { camera } = useThree();

  const position = useMemo(() => {
    return latLngToVector3(marker.lat, marker.lng, radius * 1.008);
  }, [marker.lat, marker.lng, radius]);

  const markerRadius = marker.size ?? defaultSize;

  useFrame(() => {
    if (!groupRef.current) return;

    const worldPos = new THREE.Vector3();
    groupRef.current.getWorldPosition(worldPos);

    const markerDirection = worldPos.clone().normalize();
    const cameraDirection = camera.position.clone().normalize();
    const dot = markerDirection.dot(cameraDirection);

    setIsVisible(dot > 0.05);
  });

  const handlePointerEnter = useCallback(() => {
    setHovered(true);
    onHover?.(marker);
  }, [marker, onHover]);

  const handlePointerLeave = useCallback(() => {
    setHovered(false);
    onHover?.(null);
  }, [onHover]);

  const handleClick = useCallback(() => {
    onClick?.(marker);
  }, [marker, onClick]);

  return (
    <group ref={groupRef} position={position} visible={isVisible}>
      <mesh
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        onClick={handleClick}
      >
        <sphereGeometry args={[markerRadius, 8, 8]} />
        <meshBasicMaterial color={hovered ? "#fafafa" : "#d4d4d8"} transparent opacity={0.95} />
      </mesh>
    </group>
  );
}

interface RotatingGlobeProps {
  config: Required<Globe3DConfig>;
  markers: GlobeMarker[];
  onMarkerClick?: (marker: GlobeMarker) => void;
  onMarkerHover?: (marker: GlobeMarker | null) => void;
}

function RotatingGlobe({
  config,
  markers,
  onMarkerClick,
  onMarkerHover,
}: RotatingGlobeProps) {
  const [earthTexture, bumpTexture] = useTexture([config.textureUrl, config.bumpMapUrl]);

  useMemo(() => {
    if (earthTexture) {
      earthTexture.colorSpace = THREE.SRGBColorSpace;
      earthTexture.anisotropy = 16;
    }
    if (bumpTexture) {
      bumpTexture.anisotropy = 8;
    }
  }, [earthTexture, bumpTexture]);

  const geometry = useMemo(() => new THREE.SphereGeometry(config.radius, 64, 64), [config.radius]);
  const wireframeGeometry = useMemo(
    () => new THREE.SphereGeometry(config.radius * 1.002, 32, 16),
    [config.radius],
  );

  return (
    <group>
      <mesh geometry={geometry}>
        <meshStandardMaterial
          map={earthTexture}
          bumpMap={bumpTexture}
          bumpScale={config.bumpScale * 0.05}
          roughness={0.7}
          metalness={0.0}
        />
      </mesh>

      {config.showWireframe ? (
        <mesh geometry={wireframeGeometry}>
          <meshBasicMaterial color={config.wireframeColor} wireframe transparent opacity={0.08} />
        </mesh>
      ) : null}

      {markers.map((marker, index) => (
        <Marker
          key={`marker-${index}-${marker.lat}-${marker.lng}`}
          marker={marker}
          radius={config.radius}
          defaultSize={config.markerSize}
          onClick={onMarkerClick}
          onHover={onMarkerHover}
        />
      ))}
    </group>
  );
}

interface AtmosphereProps {
  radius: number;
  color: string;
  intensity: number;
  blur: number;
}

function Atmosphere({ radius, color, intensity, blur }: AtmosphereProps) {
  const fresnelPower = Math.max(0.5, 5 - blur);

  const atmosphereMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        atmosphereColor: { value: new THREE.Color(color) },
        intensity: { value: intensity },
        fresnelPower: { value: fresnelPower },
      },
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vPosition;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 atmosphereColor;
        uniform float intensity;
        uniform float fresnelPower;
        varying vec3 vNormal;
        varying vec3 vPosition;
        void main() {
          float fresnel = pow(1.0 - abs(dot(vNormal, normalize(-vPosition))), fresnelPower);
          gl_FragColor = vec4(atmosphereColor, fresnel * intensity);
        }
      `,
      side: THREE.BackSide,
      transparent: true,
      depthWrite: false,
    });
  }, [color, intensity, fresnelPower]);

  return (
    <mesh scale={[1.12, 1.12, 1.12]}>
      <sphereGeometry args={[radius, 64, 32]} />
      <primitive object={atmosphereMaterial} attach="material" />
    </mesh>
  );
}

interface SceneProps {
  markers: GlobeMarker[];
  config: Required<Globe3DConfig>;
  onMarkerClick?: (marker: GlobeMarker) => void;
  onMarkerHover?: (marker: GlobeMarker | null) => void;
}

function Scene({ markers, config, onMarkerClick, onMarkerHover }: SceneProps) {
  const { camera } = useThree();

  React.useEffect(() => {
    camera.position.set(0, 0, config.radius * 3.5);
    camera.lookAt(0, 0, 0);
  }, [camera, config.radius]);

  return (
    <>
      <ambientLight intensity={config.ambientIntensity} />
      <directionalLight
        position={[config.radius * 5, config.radius * 2, config.radius * 5]}
        intensity={config.pointLightIntensity}
        color="#ffffff"
      />
      <directionalLight
        position={[-config.radius * 3, config.radius, -config.radius * 2]}
        intensity={config.pointLightIntensity * 0.3}
        color="#88ccff"
      />

      <RotatingGlobe
        config={config}
        markers={markers}
        onMarkerClick={onMarkerClick}
        onMarkerHover={onMarkerHover}
      />

      {config.showAtmosphere ? (
        <Atmosphere
          radius={config.radius}
          color={config.atmosphereColor}
          intensity={config.atmosphereIntensity}
          blur={config.atmosphereBlur}
        />
      ) : null}

      <OrbitControls
        makeDefault
        enablePan={config.enablePan}
        enableZoom={config.enableZoom}
        minDistance={config.minDistance}
        maxDistance={config.maxDistance}
        rotateSpeed={0.4}
        autoRotate={config.autoRotateSpeed > 0}
        autoRotateSpeed={config.autoRotateSpeed}
        enableDamping
        dampingFactor={0.1}
      />
    </>
  );
}

function LoadingFallback() {
  return (
    <Html center>
      <div className="flex shrink-0 flex-col items-center gap-3">
        <span className="inline-block shrink-0 text-sm text-neutral-400">Loading globe...</span>
      </div>
    </Html>
  );
}

const defaultConfig: Required<Globe3DConfig> = {
  radius: 2,
  globeColor: "#1a1a2e",
  textureUrl: DEFAULT_EARTH_TEXTURE,
  bumpMapUrl: DEFAULT_BUMP_TEXTURE,
  showAtmosphere: true,
  atmosphereColor: "#a855f7",
  atmosphereIntensity: 0.35,
  atmosphereBlur: 2,
  bumpScale: 1,
  autoRotateSpeed: 0.35,
  enableZoom: false,
  enablePan: false,
  minDistance: 5,
  maxDistance: 15,
  initialRotation: { x: 0, y: 0 },
  markerSize: 0.032,
  showWireframe: false,
  wireframeColor: "#4a9eff",
  ambientIntensity: 0.6,
  pointLightIntensity: 1.5,
  backgroundColor: null,
};

export function Globe3D({
  markers = [],
  config = {},
  className,
  onMarkerClick,
  onMarkerHover,
}: Globe3DProps) {
  const mergedConfig = useMemo(() => ({ ...defaultConfig, ...config }), [config]);

  return (
    <div className={cn("relative h-[500px] w-full md:h-[560px]", className)}>
      <Canvas
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
        dpr={[1, 2]}
        camera={{
          fov: 45,
          near: 0.1,
          far: 1000,
          position: [0, 0, mergedConfig.radius * 3.5],
        }}
        style={{
          background: mergedConfig.backgroundColor || "transparent",
        }}
      >
        <Suspense fallback={<LoadingFallback />}>
          <Scene
            markers={markers}
            config={mergedConfig}
            onMarkerClick={onMarkerClick}
            onMarkerHover={onMarkerHover}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}

export default Globe3D;
