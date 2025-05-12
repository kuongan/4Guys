import {
  Joystick,
  isHost,
  onPlayerJoin,
  useMultiplayerState,
} from "playroomkit";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { randFloat } from "three/src/math/MathUtils.js";
import {
  HEX_X_SPACING,
  HEX_Z_SPACING,
  NB_COLUMNS,
  NB_ROWS,
} from "../components/GameArena";

const GameStateContext = createContext();

const NEXT_STAGE = {
  lobby: "countdown",
  countdown: "game",
  game: "winner",
  winner: "lobby",
};

const TIMER_STAGE = {
  lobby: -1,
  countdown: 3,
  game: 0,
  winner: 10,
};

export const GameStateProvider = ({ children }) => {
  const [winner, setWinner] = useMultiplayerState("winner", null);
  const [stage, setStage] = useMultiplayerState("gameStage", "lobby");
  const [timer, setTimer] = useMultiplayerState("timer", TIMER_STAGE.lobby);
  const [players, setPlayers] = useState([]);
  const [soloGame, setSoloGame] = useState(false);

  const host = isHost();
  const isInit = useRef(false);

  useEffect(() => {
    if (isInit.current) {
      return;
    }
    isInit.current = true;

    onPlayerJoin((state) => {
      const controls = new Joystick(state, {
        type: "angular",
        buttons: [{ id: "Jump", label: "Jump" }],
      });
      const newPlayer = { state, controls };

      // Set default profile if not exists
      if (!state.state.profile) {
        state.setState("profile", {
          name: `Player ${players.length + 1}`,
          color: "#ffff00", // Default yellow
          photo: "/api/placeholder/50/50",
        });
      }

      if (host) {
        state.setState("dead", stage === "game");
        state.setState("startingPos", {
          x: randFloat(
            (-(NB_COLUMNS - 1) * HEX_X_SPACING) / 2,
            ((NB_COLUMNS - 1) * HEX_X_SPACING) / 2
          ),
          z: randFloat(
            (-(NB_ROWS - 1) * HEX_Z_SPACING) / 2,
            ((NB_ROWS - 1) * HEX_Z_SPACING) / 2
          ),
        });
      }

      setPlayers((players) => [...players, newPlayer]);
      state.onQuit(() => {
        setPlayers((players) => players.filter((p) => p.state.id !== state.id));
      });
    });
  }, []);

  useEffect(() => {
    if (!host) {
      return;
    }
    if (stage === "lobby") {
      return;
    }

    const timeout = setTimeout(() => {
      let newTime = stage === "game" ? timer + 1 : timer - 1;

      if (newTime === 0) {
        const nextStage = NEXT_STAGE[stage];
        if (nextStage === "lobby" || nextStage === "countdown") {
          // RESET PLAYERS
          players.forEach((p) => {
            p.state.setState("dead", false);
            p.state.setState("pos", null);
            p.state.setState("rot", null);
          });
          // Clear winner when going back to lobby
          setWinner(null, true);
        }
        setStage(nextStage, true);
        newTime = TIMER_STAGE[nextStage];
      } else {
        // CHECK GAME END
        if (stage === "game") {
          const playersAlive = players.filter((p) => !p.state.getState("dead"));

          console.log("=== GAME STATE CHECK ===");
          console.log("Solo game:", soloGame);
          console.log("Players alive:", playersAlive.length);
          console.log("Total players:", players.length);

          // Solo game logic
          if (soloGame) {
            // In solo game, end when player dies (0 alive)
            if (playersAlive.length === 0) {
              // The solo player is the winner even if dead
              const soloPlayer = players[0];
              console.log(
                "Solo game ended, winner:",
                soloPlayer.state.state.profile
              );
              setWinner(soloPlayer.state.state.profile, true);
              setStage("winner", true);
              newTime = TIMER_STAGE.winner;
            }
          } else {
            // Multiplayer logic - game ends when 1 or 0 players alive
            if (playersAlive.length <= 1) {
              let winnerProfile = null;

              if (playersAlive.length === 1) {
                // One player survived
                winnerProfile = playersAlive[0].state.state.profile;
                console.log("Multiplayer winner:", winnerProfile);
              } else {
                // All players died - last one to die wins
                const lastPlayer = players[players.length - 1];
                winnerProfile = lastPlayer.state.state.profile;
                console.log("All dead, last player wins:", winnerProfile);
              }

              setWinner(winnerProfile, true);
              setStage("winner", true);
              newTime = TIMER_STAGE.winner;
            }
          }
        }
      }
      setTimer(newTime, true);
    }, 1000);

    return () => clearTimeout(timeout);
  }, [host, timer, stage, players, soloGame, setWinner, setStage, setTimer]);

  const startGame = () => {
    setStage("countdown");
    setTimer(TIMER_STAGE.countdown);
    setSoloGame(players.length === 1);
    setWinner(null, true);
  };

  return (
    <GameStateContext.Provider
      value={{
        stage,
        timer,
        players,
        host,
        startGame,
        winner,
        soloGame, 
      }}
    >
      {children}
    </GameStateContext.Provider>
  );
};

export const useGameState = () => {
  const context = useContext(GameStateContext);
  if (!context) {
    throw new Error("useGameState must be used within a GameStateProvider");
  }
  return context;
};
