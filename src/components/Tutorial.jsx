import { useState, useEffect } from "react";
import { Character } from "./Character";
import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { OrbitControls, Environment } from "@react-three/drei";

export const Tutorial = ({ onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(
        window.innerWidth < 768 ||
          (window.innerHeight < 500 && window.innerWidth > window.innerHeight)
      );
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const tutorialSteps = [
    {
      title: "Welcome to 4Guys Game!",
      content:
        "Jump and navigate through disappearing hexagons to be the last one standing!",
    },
    {
      title: "Controls",
      content: isMobile
        ? "Use the joystick to move your character. Tap the Jump button to jump and Run button to run faster."
        : "Use W/A/S/D or Arrow Keys to move. Press SPACE to jump. Hold SHIFT to run faster.",
    },
    {
      title: "Game Flow",
      content:
        "The hexagons will disappear when you step on them. Try to stay on the platforms as long as possible!",
    },
    {
      title: "Multiplayer",
      content:
        "Invite friends with the INVITE button. The last player remaining wins the game!",
    },
    {
      title: "Ready to play?",
      content: "Customize your character and join the fun!",
    },
  ];

  const nextStep = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 z-50 pointer-events-auto flex items-center justify-center p-4">
      <div className="bg-white rounded-xl w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden shadow-lg">
        {/* Header */}
        <div className="flex justify-between items-center px-6 pt-4 pb-2 border-b border-gray-200">
          <h2
            className={`font-black bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent ${
              isMobile ? "text-2xl" : "text-3xl"
            }`}
          >
            {tutorialSteps[currentStep].title}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Body content */}
        <div className="flex flex-col md:flex-row gap-6 flex-grow overflow-y-auto p-6">
          {/* Canvas Preview */}
          <div className="md:w-1/2 h-60 md:h-auto rounded-lg overflow-hidden bg-gradient-to-b from-blue-100 to-purple-100 flex-shrink-0">
            <TutorialCanvas isVisible={true} />
          </div>

          {/* Tutorial Steps Content */}
          <div className="md:w-1/2 flex flex-col">
            <div
              className={`text-gray-700 flex-grow mb-4 ${
                isMobile ? "text-base" : "text-lg"
              }`}
            >
              {tutorialSteps[currentStep].content}
            </div>

            {/* Desktop controls */}
            {currentStep === 1 && !isMobile && (
              <div className="grid grid-cols-3 gap-2 my-4 text-center text-sm">
                <div></div>
                <div className="bg-gray-200 rounded p-2 font-bold">W</div>
                <div></div>
                <div className="bg-gray-200 rounded p-2 font-bold">A</div>
                <div className="bg-gray-200 rounded p-2 font-bold">S</div>
                <div className="bg-gray-200 rounded p-2 font-bold">D</div>
                <div className="col-span-3 bg-gray-200 rounded p-2 font-bold mt-2">
                  SPACE (Jump)
                </div>
                <div className="col-span-3 bg-gray-200 rounded p-2 font-bold">
                  SHIFT (Run)
                </div>
              </div>
            )}

            {/* Mobile controls */}
            {currentStep === 1 && isMobile && (
              <div className="flex flex-col items-center gap-4 my-4">
                <div className="relative">
                  <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full bg-gray-400" />
                  </div>
                  <p className="mt-1 text-center text-gray-700 text-sm">
                    Joystick
                  </p>
                </div>

                <div className="flex gap-4">
                  {["JUMP", "RUN"].map((label) => (
                    <div key={label}>
                      <div className="w-16 h-16 rounded-md bg-gray-200 flex items-center justify-center">
                        <span className="font-bold">{label}</span>
                      </div>
                      <p className="mt-1 text-center text-gray-700 text-sm">
                        {label === "JUMP" ? "Jump Button" : "Run Button"}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Navigation buttons */}
            <div className="flex justify-between mt-6">
              <button
                onClick={prevStep}
                disabled={currentStep === 0}
                className={`px-6 py-3 rounded-lg font-bold ${
                  currentStep === 0
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:opacity-90"
                }`}
              >
                Previous
              </button>
              <button
                onClick={nextStep}
                className="px-6 py-3 rounded-lg font-bold bg-gradient-to-r from-orange-500 to-yellow-500 text-white hover:opacity-90"
              >
                {currentStep === tutorialSteps.length - 1 ? "Got it!" : "Next"}
              </button>
            </div>
          </div>
        </div>

        {/* Step indicators */}
        <div className="flex justify-center py-3">
          {tutorialSteps.map((_, index) => (
            <div
              key={index}
              onClick={() => setCurrentStep(index)}
              className={`w-3 h-3 rounded-full mx-1 cursor-pointer transition ${
                currentStep === index ? "bg-orange-500" : "bg-gray-300"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

// Character component for tutorial
const TutorialCharacter = () => {
  const [animation, setAnimation] = useState("wave");

  // Cycle through animations
  useEffect(() => {
    const animations = [
      "idle",
      "wave",
      "walk",
      "run",
      "victory",
      "lose",
      "jump up",
      "fall",
      "land",
    ];
    let currentIndex = 0;

    const intervalId = setInterval(() => {
      currentIndex = (currentIndex + 1) % animations.length;
      setAnimation(animations[currentIndex]);
    }, 3000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <Character
      animation={animation}
      color="#ffff33"
      scale={1}
      position={[0, -1, 0]}
    />
  );
};

// Canvas for tutorial character preview - now with simplified OrbitControls
export const TutorialCanvas = ({ isVisible }) => {
  if (!isVisible) return null;

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <Canvas
        camera={{ position: [0, 0.75, 1.5], fov: 50 }}
        style={{ width: "100%", height: "100%" }}
      >
        <Suspense fallback={null}>
          {/* Better lighting setup */}
          <ambientLight intensity={0.7} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          <Environment preset="sunset" />

          <TutorialCharacter />

          {/* Simplified OrbitControls - always rendered unconditionally */}
          <OrbitControls />
        </Suspense>
      </Canvas>
    </div>
  );
};
