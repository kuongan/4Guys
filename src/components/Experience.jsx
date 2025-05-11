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
    if (stage === "lobby") {
      camera.position.set(10, 4, -24);
      console.log(camera.position);
    }

    if (stage === "countdown") {
      camera.position.set(0, 50, -50);
    }
  }, [stage]);

  return (
    <>
      <OrbitControls />
      <Environment files={"hdrs/medieval_cafe_1k.hdr"} />
      {stage === "lobby" && (
        <>
          <Lobby scale = {0.5} position = {[0,0,0]}/>
          <LobbyFloor scale = {0.7}/> 
        </>
      )}
      {stage === "winner" ? (
        <Podium />
      ) : (
        <>
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
