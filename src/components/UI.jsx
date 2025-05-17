import React, { useState, useEffect } from "react";
import { openDiscordInviteDialog, myPlayer } from "playroomkit";
import { useGameState } from "../hooks/useGameState";
import { useAudioManager } from "../hooks/useAudioManager";
import { CharacterCustomizer } from "./CharacterCustomize";
import { Tutorial } from "./Tutorial";
import { toast } from "react-hot-toast";
export const UI = () => {
  const { audioEnabled, setAudioEnabled } = useAudioManager();
  const { timer, startGame, setStage, host, stage, players, winner } =
    useGameState();
  const [showCustomizer, setShowCustomizer] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [isLandscape, setIsLandscape] = useState(false);

  const handlePlayGame = () => {
    setStage("lobby");
  };
  const handleBackHome = () => {
    setStage("home");
  }

  // Kiểm tra nếu thiết bị đang ở chế độ ngang
  useEffect(() => {
    const checkOrientation = () => {
      setIsLandscape(
        window.innerWidth > window.innerHeight && window.innerHeight < 500
      );
    };

    checkOrientation();
    window.addEventListener("resize", checkOrientation);
    window.addEventListener("orientationchange", checkOrientation);

    return () => {
      window.removeEventListener("resize", checkOrientation);
      window.removeEventListener("orientationchange", checkOrientation);
    };
  }, []);

  return (
    <>
      <main
        className="fixed z-10 inset-0 pointer-events-none"
        style={
          stage === "home"
            ? {
                backgroundImage: "url('/images/bg.png')",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }
            : {}
        }
      >
        {stage === "lobby" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-black/50 to-transparent pointer-events-none">
              <div className="flex items-center gap-3 h-full px-4">
                <img
                  src="/images/logo.png"
                  className="w-12 sm:w-14 md:w-16"
                  alt="4Guys Logo"
                />
                <h1 className="text-white text-lg sm:text-xl md:text-2xl font-black">
                  4Guys
                </h1>
              </div>
            </div>

            {host && (
              <button
                className={`absolute z-20 top-4 right-4 pointer-events-auto
              `}
                onClick={handleBackHome}
                aria-label="Back to Home"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className={`${
                    isLandscape ? "w-6 h-6" : "w-8 h-8"
                  } text-white`}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 19.5L8.25 12l7.5-7.5"
                  />
                </svg>
              </button>
            )}

            <div
              className={`
                absolute pointer-events-none top-28 left-4 sm:top-4 sm:-translate-x-1/2 sm:left-1/2 flex flex-col sm:flex-row gap-4`}
            >
              {players.map((p) => (
                <div
                  key={p.state.id}
                  className={`flex flex-col items-center gap-1`}
                >
                  <img
                    className={`w-10 h-10 sm:w-12 md:w-14 lg:20 rounded-full ${
                      p.state.getState("dead") ? "filter grayscale" : ""
                    }`}
                    src={p.state.state.profile.photo}
                    alt={p.state.state.profile.name}
                  />
                  <p className={`text-white max-w-20 truncate text-sm`}>
                    {p.state.state.profile.name}
                  </p>
                </div>
              ))}
            </div>

            <div
              className={`
              flex flex-col 
              justify-center items-center 
              gap-6
              pointer-events-none
            `}
            >
              <button
                className={`
                  pointer-events-auto bg-gradient-to-r from-purple-500 to-blue-500 
                  text-white font-bold 
                  ${isLandscape ? "py-2 px-4 text-lg" : "py-3 px-6"}
                  rounded-lg shadow-lg 
                  hover:from-purple-600 hover:to-blue-600 transition-all
                `}
                onClick={() => setShowCustomizer(true)}
              >
                Customize Character
              </button>

              {host ? (
                <button
                  className={`
                    pointer-events-auto bg-gradient-to-r from-green-500 to-teal-500 
                    text-white font-bold 
                    ${isLandscape ? "py-2 px-4 text-xl" : "py-3 px-6"}
                    rounded-lg shadow-lg 
                    hover:from-green-600 hover:to-teal-600 transition-all
                  `}
                  onClick={startGame}
                >
                  Start Game
                </button>
              ) : (
                <div
                  className={`
                  bg-black/50 backdrop-blur-sm 
                  ${isLandscape ? "py-2 px-4" : "py-3 px-6"}
                  rounded-lg
                `}
                >
                  <p className={`italic text-slate-400 text-lg font-bold`}>
                    Waiting for the host...
                  </p>
                </div>
              )}
            </div>

            <p
              className={`
              text-white text-center pointer-events-none
              ${
                isLandscape
                  ? "absolute bottom-2 left-1/2 -translate-x-1/2 text-sm"
                  : "mb-4 text-xl mt-2"
              }
            `}
            >
              {players.length} player{players.length !== 1 ? "s" : ""} connected
            </p>
          </div>
        )}
        {timer >= 0 && (stage === "countdown" || stage === "game") && (
          <div
            className={`
            absolute right-4 top-4 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full 
            ${isLandscape ? "w-12 h-12" : "w-16 h-16"}
            flex items-center justify-center pointer-events-none
          `}
          >
            <h2
              className={`${
                isLandscape ? "text-2xl" : "text-3xl"
              } text-white font-black`}
            >
              {timer}
            </h2>
          </div>
        )}
        {stage === "countdown" && (
          <div className="absolute top-1/2 le-translate-x-1/2 left-1/2  -translate-y-1/2 pointer-events-none">
            <h2
              className={`${
                isLandscape ? "text-4xl" : "text-5xl"
              } text-white font-black text-center drop-shadow-lg`}
            >
              GET READY!
            </h2>
          </div>
        )}

        {/* Home Screen - Main Menu */}
        {stage === "home" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div
              className={` ${
                isLandscape ? "mb-4" : "mb-10"
              } pointer-events-none`}
            >
              <img
                src="/images/logo.png"
                className={`mx-auto animate-bounce ${
                  isLandscape ? "w-20 h-20" : "w-28 sm:w-32 md:w-40"
                }`}
              />

              <h1
                className={`font-black text-center drop-shadow-lg mt-2 ${
                  isLandscape ? "text-3xl" : "text-4xl sm:text-5xl md:text-6xl"
                } text-violet-950`}
              >
                4GUYS
              </h1>

              <p
                className={`text-center text-indigo-800 mt-1 ${
                  isLandscape ? "text-sm" : "text-lg sm:text-xl md:text-2xl"
                } max-w-xl mx-auto`}
              >
                Jump, survive, be the last one standing!
              </p>
            </div>

            <div
              className={`flex ${isLandscape ? "flex-row" : "flex-col"} gap-4 ${
                isLandscape ? "w-auto" : "w-64"
              } pointer-events-none`}
            >
              <button
                className={`
                  pointer-events-auto relative group overflow-hidden
                  bg-gradient-to-br from-blue-500 to-purple-500 
                  hover:from-blue-600 hover:to-purple-600
                  shadow-lg hover:shadow-xl transition-all duration-200 
                  ${isLandscape ? "px-6 py-3 text-base" : "px-8 py-4 text-xl"}
                  rounded-lg font-black text-white
                `}
                onClick={handlePlayGame}
              >
                <span className="relative z-10">PLAY GAME</span>
                <span className="absolute inset-0 translate-y-full group-hover:translate-y-0 bg-gradient-to-br from-blue-600 to-purple-700 transition-transform duration-300"></span>
              </button>

              <button
                className={`
                  pointer-events-auto relative group overflow-hidden
                  bg-gradient-to-br from-orange-500 to-yellow-500 
                  hover:from-orange-600 hover:to-yellow-600
                  shadow-lg hover:shadow-xl transition-all duration-200 
                  ${isLandscape ? "px-6 py-3 text-base" : "px-8 py-4 text-xl"}
                  rounded-lg font-black text-white
                `}
                onClick={() => setShowTutorial(true)}
              >
                <span className="relative z-10">TUTORIAL</span>
                <span className="absolute inset-0 translate-y-full group-hover:translate-y-0 bg-gradient-to-br from-orange-600 to-yellow-700 transition-transform duration-300"></span>
              </button>

              <button
                className={`
                  pointer-events-auto relative group overflow-hidden
                  bg-gradient-to-br from-green-500 to-teal-500 
                  hover:from-green-600 hover:to-teal-600
                  shadow-lg hover:shadow-xl transition-all duration-200 
                  ${isLandscape ? "px-6 py-3 text-base" : "px-8 py-4 text-xl"}
                  rounded-lg font-black text-white
                `}
                onClick={(e) => {
                  const currentUrl = window.location.href;

                  const showToast = () => toast.success("Copy successfully");

                  if (navigator.clipboard?.writeText) {
                    navigator.clipboard
                      .writeText(currentUrl)
                      .then(showToast)
                      .catch((err) => {
                        console.error("Failed to copy: ", err);
                        toast.error("❌ Không thể sao chép!");
                      });
                  } else {
                    const textArea = document.createElement("textarea");
                    textArea.value = currentUrl;
                    document.body.appendChild(textArea);
                    textArea.select();
                    try {
                      const success = document.execCommand("copy");
                      if (success) showToast();
                      else toast.error("Failed to copy");
                    } catch (err) {
                      console.error("Fallback: Failed to copy", err);
                      toast.error("Failed to copy");
                    }
                    document.body.removeChild(textArea);
                  }

                  openDiscordInviteDialog();
                }}

              >
                <span className="relative z-10">INVITE</span>
                <span className="absolute inset-0 translate-y-full group-hover:translate-y-0 bg-gradient-to-br from-green-600 to-teal-700 transition-transform duration-300"></span>
              </button>
            </div>
          </div>
        )}

        <button
          className={`
            absolute pointer-events-auto top-1/2 right-4 -translate-y-1/2`}
          onClick={() => setAudioEnabled(!audioEnabled)}
        >
          {audioEnabled ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className={`${
                isLandscape ? "w-6 h-6" : "w-8 h-8"
              } fill-white stroke-white`}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.114 5.636a9 9 0 0 1 0 12.728M16.463 8.288a5.25 5.25 0 0 1 0 7.424M6.75 8.25l4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className={`${
                isLandscape ? "w-6 h-6" : "w-8 h-8"
              } fill-white stroke-white`}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17.25 9.75 19.5 12m0 0 2.25 2.25M19.5 12l2.25-2.25M19.5 12l-2.25 2.25m-10.5-6 4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z"
              />
            </svg>
          )}
        </button>
      </main>

      {/* Character Customizer */}
      {showCustomizer && (
        <div className="fixed inset-0 z-20 pointer-events-auto">
          <CharacterCustomizer onClose={() => setShowCustomizer(false)} />
        </div>
      )}

      {/* Tutorial Component */}
      {showTutorial && (
        <div className="fixed inset-0 z-20 pointer-events-auto">
          <Tutorial onClose={() => setShowTutorial(false)} />
        </div>
      )}
    </>
  );
};
