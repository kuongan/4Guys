import { Canvas } from "@react-three/fiber";
import { Physics } from "@react-three/rapier";
import { Experience } from "./components/Experience";
import { Toaster } from "react-hot-toast";
import { KeyboardControls } from "@react-three/drei";
import { useMemo } from "react";
import { UI } from "./components/UI";
import { AudioManagerProvider } from "./hooks/useAudioManager";
import { GameStateProvider } from "./hooks/useGameState";

export const Controls = {
  forward: "forward",
  back: "back",
  left: "left",
  right: "right",
  jump: "jump",
  run: "run",
};

function App() {
  const map = useMemo(
    () => [
      { name: Controls.forward, keys: ["ArrowUp", "KeyW"] },
      { name: Controls.back, keys: ["ArrowDown", "KeyS"] },
      { name: Controls.left, keys: ["ArrowLeft", "KeyA"] },
      { name: Controls.right, keys: ["ArrowRight", "KeyD"] },
      { name: Controls.jump, keys: ["Space", "KeyJ"] },
      { name: Controls.run, keys: ["Shift"] },
    ],
    []
  );
  return (
    <>
      <Toaster position="top-center" />
      <KeyboardControls map={map}>
        <AudioManagerProvider>
          <GameStateProvider>
            <div className="fixed inset-0 w-full h-full pointer-events-auto">
              <Canvas shadows camera={{ position: [0, 16, 10], fov: 42 }}>
                <color attach="background" args={["#DEEBF7"]} />
                <Physics>
                  <Experience />
                </Physics>
              </Canvas>
            </div>
            <UI />
          </GameStateProvider>
        </AudioManagerProvider>
      </KeyboardControls>
    </>
  );
}

export default App;
