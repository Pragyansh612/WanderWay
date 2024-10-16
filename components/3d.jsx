import React, { Suspense, useEffect, useRef, useState } from "react"; 
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Preload, useGLTF } from "@react-three/drei";
import { AnimationMixer } from "three";

const Computers = ({ isMobile }) => {
  const computer = useGLTF("./3d/scene/gltf");
  const mixer = useRef();

//   useEffect(() => {
//     mixer.current = new AnimationMixer(computer.scene);
//     if (computer.animations.length) {
//       const action = mixer.current.clipAction(computer.animations[0]);
//       action.play();
//     }
//     return () => {
//       mixer.current.stopAllAction(); // Cleanup on unmount
//     };
//   }, [computer]);

//   useFrame((state, delta) => {
//     if (mixer.current) {
//       mixer.current.update(delta);
//     }
//   });

  return (
    <primitive
      object={computer.scene}
      scale={isMobile ? 1.5 : 2.0}  
      position={isMobile ? [0, -3, 0] : [0, -3.0, 0]}  
      rotation={[-0.01, -0.2, -0.1]}
    />
  );
};

const Canvas = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 640px)");
    setIsMobile(mediaQuery.matches);

    const handleMediaQueryChange = (event) => {
      setIsMobile(event.matches);
    };

    mediaQuery.addEventListener("change", handleMediaQueryChange);
    return () => {
      mediaQuery.removeEventListener("change", handleMediaQueryChange);
    };
  }, []);

  return (
    <div style={{ height: isMobile ? "80vh" : "95vh" }}> {/* Adjusted height */ }
      <Canvas
        frameloop="always"
        shadows
        dpr={[1, 2]}
        camera={{
          position: isMobile ? [10, 2.5, 7] : [20, 2.5, 10],  
          fov: isMobile ? 40 : 30,  
        }}
        gl={{ preserveDrawingBuffer: true }}
      >
        <Suspense fallback={null}>
          <OrbitControls
            enableZoom={isMobile} // Allow zooming on mobile
            enablePan={isMobile}  // Allow panning on mobile
            maxPolarAngle={Math.PI / 2}
            minPolarAngle={Math.PI / 2}
            target={[0, 0, 0]} // Ensure camera focuses on the model center
          />
          <Computers isMobile={isMobile} />
        </Suspense>
        <Preload all />
      </Canvas>
    </div>
  );
};

export default Canvas;
