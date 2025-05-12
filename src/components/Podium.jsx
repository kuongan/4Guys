import {
  Box,
  Text,
  Sky,
  Stars,
  Sparkles,
  Cloud,
  Float,
} from "@react-three/drei";
import { useThree, useFrame } from "@react-three/fiber";
import { myPlayer } from "playroomkit";
import { useEffect, useRef, useState } from "react";
import { useAudioManager } from "../hooks/useAudioManager";
import { useGameState } from "../hooks/useGameState";
import { Character } from "./Character";
import ExplosionConfetti from "./Confetti";

export const Podium = () => {
  const { winner } = useGameState();
  const camera = useThree((state) => state.camera);
  const { playAudio } = useAudioManager();
  const me = myPlayer();
  const myProfile = me.state.profile;
  const audioPlayed = useRef(false);

  // Check if current player is the winner
  const isWinner = !!(
    winner &&
    myProfile &&
    winner.name === myProfile.name &&
    winner.color === myProfile.color
  );

  const animation = isWinner ? "victory" : "lose";

  // Separate effect for audio - only run once
  useEffect(() => {
    if (!audioPlayed.current) {
      const audioName = isWinner ? "Victory" : "Lose";
      console.log("Playing audio:", audioName);
      playAudio(audioName, true);
      audioPlayed.current = true;
    }
  }, []); // Empty dependency array - only run once on mount

  // Separate effect for camera
  useEffect(() => {
    camera.position.set(4, 3, 15);
    camera.lookAt(0, 2, 0);

    return () => {
      camera.position.set(0, 16, 10);
      camera.lookAt(0, 0, 0);
    };
  }, [camera]);

  if (!myProfile) {
    console.warn("No player profile found");
    return null;
  }

  return (
    <group>
      {/* Sky - Different colors for winner/loser */}
      <Sky
        distance={450000}
        sunPosition={[0, 1, 0]}
        inclination={0}
        azimuth={0.25}
        rayleigh={isWinner ? 2 : 0.5}
        turbidity={isWinner ? 8 : 10}
        mieCoefficient={isWinner ? 0.005 : 0.05}
        mieDirectionalG={isWinner ? 0.8 : 0.9}
      />

      {/* Stars only for loser */}
      {!isWinner && (
        <Stars
          radius={100}
          depth={50}
          count={5000}
          factor={4}
          saturation={0}
          fade
        />
      )}

      {/* Background wall - Brighter colors */}
      <Box args={[40, 20, 0.5]} position={[0, 10, -10]}>
        <meshStandardMaterial color={"#37474f"} roughness={0.8} />
      </Box>

      {/* Floor - Brighter */}
      <Box args={[50, 0.5, 50]} position={[0, -0.5, 0]}>
        <meshStandardMaterial
          color={isWinner ? "#7da0b9" : "#455a64"}
          roughness={0.5}
          metalness={0.3}
        />
      </Box>

      {/* Main Podium Platform */}
      <Box args={[6, 1.5, 3]} position={[0, 0, 0]}>
        <meshStandardMaterial
          color={isWinner ? "gold" : "silver"}
          metalness={0.8}
          roughness={0.2}
        />
      </Box>

      {/* Podium Steps */}
      <Box args={[6.5, 1.25, 3.5]} position={[0, -0.125, 0]}>
        <meshStandardMaterial
          color={isWinner ? "#FFD700" : "#C0C0C0"}
          metalness={0.6}
          roughness={0.3}
        />
      </Box>

      {/* Character */}
      <Float
        speed={isWinner ? 2 : 0}
        rotationIntensity={isWinner ? 0.5 : 0}
        floatIntensity={isWinner ? 0.5 : 0}
      >
        <Character
          animation={animation}
          name={myProfile.name}
          color={myProfile.color}
          position-y={0.75}
        />
      </Float>

      {/* Title Text */}
      <Text
        position={[0, 6, -9.5]}
        fontSize={isWinner ? 3 : 2}
        color={isWinner ? "gold" : "white"}
        anchorX="center"
        font="/fonts/PaytoneOne-Regular.ttf"
      >
        {isWinner ? "VICTORY!" : "GAME OVER"}
      </Text>

      {/* Subtitle Text */}
      <Text
        position={[0, 4.5, -9.5]}
        fontSize={1}
        color={isWinner ? "gold" : "white"}
        anchorX="center"
        font="/fonts/PaytoneOne-Regular.ttf"
      >
        {isWinner ? "Congratulations!" : "Better luck next time!"}
      </Text>

      {/* Winner effects */}
      {isWinner && (
        <>
          {/* Sparkles */}
          <Sparkles count={300} scale={15} size={6} speed={1} color="gold" />

          {/* Confetti */}
          <ExplosionConfetti
            isExploding={true}
            enableShadows={true}
            position={[0, 5, 0]}
          />
        </>
      )}

      {/* Decorative columns */}
      <Box args={[1, 8, 1]} position={[-10, 4, -5]}>
        <meshStandardMaterial color={isWinner ? "#81c784" : "#546e7a"} />
      </Box>
      <Box args={[1, 8, 1]} position={[10, 4, -5]}>
        <meshStandardMaterial color={isWinner ? "#81c784" : "#546e7a"} />
      </Box>

      {/* Lighting */}
      <ambientLight intensity={isWinner ? 0.7 : 0.4} />
      <directionalLight
        position={[10, 10, 5]}
        intensity={isWinner ? 1 : 0.5}
        color={isWinner ? "#ffffff" : "#b0bec5"}
      />
      <pointLight
        position={[0, 5, 5]}
        intensity={isWinner ? 1 : 0.5}
        color={isWinner ? "gold" : "white"}
      />
    </group>
  );
};
