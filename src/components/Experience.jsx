import { Environment, OrbitControls } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { myPlayer } from "playroomkit";
import { useEffect } from "react";
import { useGameState } from "../hooks/useGameState";
import { CharacterController } from "./CharacterController";
import { GameArena } from "./GameArena";
import { Podium } from "./Podium";
import { Lobby, LobbyFloor } from "./Lobby";

export const Experience = () => {
  const { players, stage } = useGameState();
  const me = myPlayer();
  const camera = useThree((state) => state.camera);
  const firstNonDeadPlayer = players.find((p) => !p.state.getState("dead"));

  useEffect(() => {
    // Set camera position based on stage
    if (stage === "lobby") {
      camera.position.set(10, 4, -24);
    } else if (stage === "countdown") {
      camera.position.set(0, 50, -50);
    }
  }, [stage, camera]);

  return (
    <>
      {/* Always render OrbitControls unconditionally */}
      <OrbitControls />

      <Environment files={"hdrs/medieval_cafe_1k.hdr"} />
      <directionalLight position={[10, 10, 5]} intensity={0.3} />

      {/* Lobby scene */}
      {stage === "lobby" && (
        <>
          <Lobby scale={0.5} position={[0, 0, 0]} />
          <LobbyFloor scale={0.7} />
        </>
      )}

      {/* Home screen doesn't render anything in canvas */}
      {stage === "home" && null}

      {/* Podium scene */}
      {stage === "winner" ? (
        <Podium currentPlayer={me} />
      ) : (
        <>
          {/* Arena only renders during game */}
          {stage !== "lobby" && <GameArena />}
          {players.map(({ state, controls }) => (
            <CharacterController
              key={state.id}
              state={state}
              controls={controls}
              player={me.id === state.id}
              firstNonDeadPlayer={firstNonDeadPlayer?.state.id === state.id}
              position-y={10}
            />
          ))}
        </>
      )}
    </>
  );
};
