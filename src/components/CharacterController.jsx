import { useKeyboardControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import {
  CapsuleCollider,
  RigidBody,
  euler,
  quat,
  vec3,
} from "@react-three/rapier";
import { setState } from "playroomkit";
import { useRef, useState, useEffect } from "react";
import { Vector3 } from "three";
import { Controls } from "../App";
import { useAudioManager } from "../hooks/useAudioManager";
import { useGameState } from "../hooks/useGameState";
import { Character } from "./Character";
import { FLOORS, FLOOR_HEIGHT } from "./GameArena";

const MOVEMENT_SPEED = 4.2;
const JUMP_FORCE = 8;
const ROTATION_SPEED = 3;
const vel = new Vector3();

export const CharacterController = ({
  player = false,
  firstNonDeadPlayer = false,
  controls,
  state,
  ...props
}) => {
  const { playAudio } = useAudioManager();
  const isDead = state.getState("dead");
  const [animation, setAnimation] = useState("idle");
  const { stage } = useGameState();
  const [, get] = useKeyboardControls();
  const rb = useRef();
  const inTheAir = useRef(true);
  const landed = useRef(false);
  const cameraPosition = useRef();
  const cameraLookAt = useRef();

  // Get running state from keyboard or joystick
  const isRunning = get()[Controls.run] || controls.isPressed("Run");
  const movementSpeed = isRunning ? MOVEMENT_SPEED * 1.4 : MOVEMENT_SPEED;
  const [playerProfile, setPlayerProfile] = useState(state.state.profile);

  // Add refs for managing landing animation state
  const isLanding = useRef(false);
  const landingTimer = useRef(null);
  const previousYVelocity = useRef(0);
  const prevStage = useRef(stage);
  const countdownAudioPlayed = useRef(false);

  // Handle profile changes
  useEffect(() => {
    const checkProfileChanges = () => {
      const currentProfile = state.getState("profile");
      if (JSON.stringify(currentProfile) !== JSON.stringify(playerProfile)) {
        setPlayerProfile(currentProfile);
      }
    };

    // Check immediately
    checkProfileChanges();

    // Set up interval to check for changes
    const interval = setInterval(checkProfileChanges, 500);

    return () => clearInterval(interval);
  }, [state, playerProfile]);

  // Handle stage changes
  useEffect(() => {
    if (rb.current && stage !== prevStage.current) {
      const startingPos = state.getState("startingPos");

      if (stage === "countdown" && startingPos) {
        // Reset position for countdown
        rb.current.setTranslation({
          x: startingPos.x,
          y: 5, // Start higher to avoid clipping
          z: startingPos.z,
        });

        // Reset velocities
        rb.current.setLinvel({ x: 0, y: 0, z: 0 });
        rb.current.setAngvel({ x: 0, y: 0, z: 0 });

        // Reset states
        inTheAir.current = true;
        landed.current = false;
      }

      prevStage.current = stage;
    }
  }, [stage, state]);

  // Play countdown audio
  useEffect(() => {
    if (stage === "countdown" && !countdownAudioPlayed.current) {
      playAudio("ready", true);
      countdownAudioPlayed.current = true;
    }

    // Reset the flag when leaving countdown stage
    if (stage !== "countdown") {
      countdownAudioPlayed.current = false;
    }
  }, [stage, playAudio]);

  // Main game loop
  useFrame(({ camera }) => {
    // Skip if home stage
    if (stage === "home") return;

    // In lobby, only update animation
    if (stage === "lobby") {
      setAnimation("wave");
      state.setState("animation", "wave");
      return;
    }

    // In countdown, set idle animation
    if (stage === "countdown") {
      setAnimation("idle");
      state.setState("animation", "idle");
    }

    // Camera control - only in game and countdown stages
    // Only control camera if player is active or this is the first non-dead player
    if (
      (stage === "game" || stage === "countdown") &&
      ((player && !isDead) || firstNonDeadPlayer)
    ) {
      const rbPosition = vec3(rb.current.translation());
      if (!cameraLookAt.current) {
        cameraLookAt.current = rbPosition;
      }
      cameraLookAt.current.lerp(rbPosition, 0.07);
      camera.lookAt(cameraLookAt.current);
      const worldPos = rbPosition;
      cameraPosition.current.getWorldPosition(worldPos);
      camera.position.lerp(worldPos, 0.07);
    }

    // Movement logic for game stage
    if (stage === "game") {
      if (!player) {
        // Handle non-player characters (other players)
        const pos = state.getState("pos");
        if (pos) {
          rb.current.setTranslation(pos);
        }
        const rot = state.getState("rot");
        if (rot) {
          rb.current.setRotation(rot);
        }
        const anim = state.getState("animation");
        setAnimation(anim);

        return;
      }

      // Handle player character movement
      const rotVel = {
        x: 0,
        y: 0,
        z: 0,
      };

      const curVel = rb.current.linvel();
      vel.x = 0;
      vel.y = 0;
      vel.z = 0;

      const angle = controls.angle();
      const joystickX = Math.sin(angle);
      const joystickY = Math.cos(angle);

      // Forward movement
      if (
        get()[Controls.forward] ||
        (controls.isJoystickPressed() && joystickY < -0.1)
      ) {
        vel.z += movementSpeed;
      }

      // Backward movement
      if (
        get()[Controls.back] ||
        (controls.isJoystickPressed() && joystickY > 0.1)
      ) {
        vel.z -= movementSpeed;
      }

      // Left rotation
      if (
        get()[Controls.left] ||
        (controls.isJoystickPressed() && joystickX < -0.1)
      ) {
        rotVel.y += ROTATION_SPEED;
      }

      // Right rotation
      if (
        get()[Controls.right] ||
        (controls.isJoystickPressed() && joystickX > 0.1)
      ) {
        rotVel.y -= ROTATION_SPEED;
      }

      rb.current.setAngvel(rotVel);
      const eulerRot = euler().setFromQuaternion(quat(rb.current.rotation()));
      vel.applyEuler(eulerRot);

      // Jump logic
      if (
        (get()[Controls.jump] || controls.isPressed("Jump")) &&
        !inTheAir.current &&
        landed.current
      ) {
        vel.y += JUMP_FORCE;
        inTheAir.current = true;
        landed.current = false;
      } else {
        vel.y = curVel.y;
      }

      // Update air state
      if (Math.abs(vel.y) > 1) {
        inTheAir.current = true;
        landed.current = false;
      } else {
        inTheAir.current = false;
      }

      rb.current.setLinvel(vel);
      state.setState("pos", rb.current.translation());
      state.setState("rot", rb.current.rotation());

      // ANIMATION LOGIC
      const movement = Math.abs(vel.x) + Math.abs(vel.z);

      // Check for landing condition
      if (
        inTheAir.current &&
        previousYVelocity.current < -3 &&
        Math.abs(vel.y) < 0.5 &&
        !isLanding.current
      ) {
        isLanding.current = true;
        setAnimation("land");
        state.setState("animation", "land");

        if (landingTimer.current) {
          clearTimeout(landingTimer.current);
        }

        landingTimer.current = setTimeout(() => {
          isLanding.current = false;
          landingTimer.current = null;
        }, 300);
      }

      previousYVelocity.current = vel.y;

      // Only update animation if not in landing state
      if (!isLanding.current) {
        if (inTheAir.current && vel.y > 2) {
          setAnimation("jump up");
          state.setState("animation", "jump up");
        } else if (inTheAir.current && vel.y < -5) {
          setAnimation("fall");
          state.setState("animation", "fall");
        } else if (movement > 1 || inTheAir.current) {
          const anim = isRunning ? "run" : "walk";
          setAnimation(anim);
          state.setState("animation", anim);
        } else {
          setAnimation("idle");
          state.setState("animation", "idle");
        }
      }

      // Death check only in game stage
      if (
        stage === "game" &&
        rb.current.translation().y < -FLOOR_HEIGHT * FLOORS.length &&
        !state.getState("dead")
      ) {
        state.setState("dead", true);
        setState("lastDead", state.state.profile, true);
        playAudio("Dead", true);
      }
    }
  });

  const startingPos = state.getState("startingPos");
  if (isDead || !startingPos) {
    return null;
  }

  return (
    <RigidBody
      {...props}
      position-x={startingPos.x}
      position-z={startingPos.z}
      position-y={stage === "countdown" ? 5 : 2}
      colliders={false}
      canSleep={false}
      enabledRotations={[false, true, false]}
      ref={rb}
      onCollisionEnter={(e) => {
        if (
          e.other.rigidBodyObject.name === "hexagon" ||
          e.other.rigidBodyObject.name === "lobbyFloor"
        ) {
          inTheAir.current = false;
          landed.current = true;
          const curVel = rb.current.linvel();
          curVel.y = 0;
          rb.current.setLinvel(curVel);
        }
      }}
      gravityScale={stage === "game" ? 2.5 : stage === "lobby" ? 1 : 0}
      name={player ? "player" : "other"}
    >
      <group ref={cameraPosition} position={[0, 8, -16]}></group>
      <Character
        scale={0.42}
        color={playerProfile.color}
        name={playerProfile.name}
        position-y={0.2}
        animation={animation}
      />
      <CapsuleCollider args={[0.1, 0.38]} position={[0, 0.68, 0]} />
    </RigidBody>
  );
};
