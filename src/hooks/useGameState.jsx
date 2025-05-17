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
  home: "lobby",
  lobby: "countdown",
  countdown: "game",
  game: "winner",
  winner: "lobby",
};

const TIMER_STAGE = {
  home: -1,
  lobby: -1,
  countdown: 3,
  game: 0,
  winner: 10,
};

export const GameStateProvider = ({ children }) => {
  const [winner, setWinner] = useMultiplayerState("winner", null);
  const [stage, setStage] = useMultiplayerState("gameStage", "home");
  const [timer, setTimer] = useMultiplayerState("timer", TIMER_STAGE.home);
  const [players, setPlayers] = useState([]);
  const [soloGame, setSoloGame] = useState(false);

  const host = isHost();
  const isInit = useRef(false);
  const joystickMap = useRef(new Map());

  useEffect(() => {
    if (isInit.current) {
      return;
    }
    isInit.current = true;

    onPlayerJoin((state) => {
      const controls = new Joystick(state, {
        type: "angular",
        buttons: [
          { id: "Jump", label: "Jump" },
          { id: "Run", label: "Run" },
        ],
      });

      const newPlayer = { state, controls };

      // Set default profile if not exists
      if (!state.state.profile) {
        state.setState("profile", {
          name: `Player ${players.length + 1}`,
          color: "#ffff00",
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
        joystickMap.current.delete(state.id);
        setPlayers((players) => players.filter((p) => p.state.id !== state.id));
      });
    });
  }, []);

  useEffect(() => {
    if (!host) return;
    if (stage === "lobby" || stage === "home") return;

    const timeout = setTimeout(() => {
      let newTime = stage === "game" ? timer + 1 : timer - 1;

      if (newTime === 0) {
        const nextStage = NEXT_STAGE[stage];

        if (nextStage === "countdown") {
          players.forEach((p) => {
            p.state.setState("dead", false);
            p.state.setState("pos", null);
            p.state.setState("rot", null);
          });
          setWinner(null, true);
        }

        setStage(nextStage, true);
        newTime = TIMER_STAGE[nextStage];
      } else {
        if (stage === "game") {
          const playersAlive = players.filter((p) => !p.state.getState("dead"));

          if (soloGame) {
            if (playersAlive.length === 0) {
              const soloPlayer = players[0];
              setWinner(soloPlayer.state.state.profile, true);
              setStage("winner", true);
              newTime = TIMER_STAGE.winner;
            }
          } else {
            if (playersAlive.length <= 1) {
              let winnerProfile = null;
              if (playersAlive.length === 1) {
                winnerProfile = playersAlive[0].state.state.profile;
              } else {
                const lastPlayer = players[players.length - 1];
                winnerProfile = lastPlayer.state.state.profile;
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
        setStage,
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
