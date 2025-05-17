import { useState, useRef, useEffect } from "react";
import { myPlayer } from "playroomkit";

export const CharacterCustomizer = ({ onClose }) => {
  const player = myPlayer();
  const [name, setName] = useState(player.state.profile.name);
  const [selectedColor, setSelectedColor] = useState(
    player.state.profile.color
  );
  const modalRef = useRef(null);

  // Handle clicks outside the modal to close it (mobile-friendly)
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [onClose]);

  const colors = [
    { name: "Red", value: "#ee5052" },
    { name: "Blue", value: "#4baeff" },
    { name: "Green", value: "#59dd55" },
    { name: "Yellow", value: "#ffff33" },
    { name: "Purple", value: "#9c3faa" },
    { name: "Orange", value: "#ff7f00" },
    { name: "Pink", value: "#FF8DA1" },
    { name: "Brown", value: "#a65628" },
  ];

  const handleSave = () => {
    player.setState("profile", {
      ...player.state.profile,
      name,
      color: selectedColor,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 pointer-events-auto p-4">
      <div
        ref={modalRef}
        className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-3xl mx-auto
                 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8
                 max-h-[90vh] overflow-auto pb-12"
      >
        <div className="flex flex-col justify-start">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6 md:mb-8">
            Customize Character
          </h2>

          <label className="block mb-1 sm:mb-2 font-semibold text-base sm:text-lg">
            Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={20}
            placeholder="Enter your character name"
            className="mb-4 sm:mb-6 md:mb-8 w-full px-3 sm:px-4 py-2 sm:py-3 
                      border rounded-lg focus:outline-none focus:ring-2 
                      focus:ring-blue-500 text-base sm:text-lg"
          />

          <label className="block mb-2 sm:mb-4 font-semibold text-base sm:text-lg">
            Color
          </label>
          <div className="grid grid-cols-4 gap-2 sm:gap-3 w-full max-w-md mx-auto">
            {colors.map((color) => (
              <button
                key={color.value}
                onClick={() => setSelectedColor(color.value)}
                className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg border-2 transition-shadow
                ${
                  selectedColor === color.value
                    ? "border-blue-600 shadow-lg"
                    : "border-gray-300"
                }`}
                style={{ backgroundColor: color.value }}
                title={color.name}
                aria-label={`Select color ${color.name}`}
              />
            ))}
          </div>
        </div>

        <div className="flex flex-col justify-between mt-6 md:mt-0">
          <div className="bg-gray-100 rounded-lg p-4 sm:p-6 md:p-10 flex flex-col items-center">
            <p className="text-base sm:text-lg text-gray-600 mb-2 sm:mb-4">
              Preview
            </p>
            <div
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-full mb-2 sm:mb-4"
              style={{ backgroundColor: selectedColor }}
            />
            <p className="font-bold text-lg sm:text-xl truncate max-w-full">
              {name || "Your Name"}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 md:gap-6 mt-6 md:mt-0">
            <button
              onClick={onClose}
              className="order-2 sm:order-1 w-full sm:w-auto
                        bg-gray-300 text-gray-700 px-4 sm:px-6 py-2 sm:py-3 
                        rounded-lg text-base sm:text-lg hover:bg-gray-400 
                        transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="order-1 sm:order-2 w-full sm:w-auto
                        bg-blue-600 text-white px-6 sm:px-8 py-2 sm:py-3 
                        rounded-lg text-base sm:text-lg hover:bg-blue-700 
                        transition-colors mb-2 sm:mb-0"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
