import { useRef, useState } from "react";
import { myPlayer } from "playroomkit";

export const CharacterCustomizer = ({ onClose }) => {
  const player = myPlayer();
  const [name, setName] = useState(player.state.profile.name);
  const [selectedColor, setSelectedColor] = useState(
    player.state.profile.color
  );

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
      name: name,
      color: selectedColor,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 pointer-events-auto">
      <div className="bg-white rounded-lg p-6 w-96 max-w-[90%]">
        <h2 className="text-2xl font-bold mb-4">Customize Character</h2>

        {/* Name Input */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            maxLength={20}
          />
        </div>

        {/* Color Selection */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Color</label>
          <div className="grid grid-cols-4 gap-2">
            {colors.map((color) => (
              <button
                key={color.value}
                onClick={() => setSelectedColor(color.value)}
                className={`w-16 h-16 rounded-lg border-2 ${
                  selectedColor === color.value
                    ? "border-blue-500 shadow-lg"
                    : "border-gray-300"
                }`}
                style={{ backgroundColor: color.value }}
                title={color.name}
              />
            ))}
          </div>
        </div>

        {/* Preview */}
        <div className="mb-4 p-4 bg-gray-100 rounded-lg text-center">
          <p className="text-sm text-gray-600">Preview</p>
          <div className="mt-2">
            <div
              className="w-16 h-16 rounded-full mx-auto mb-2"
              style={{ backgroundColor: selectedColor }}
            />
            <p className="font-bold">{name}</p>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-2">
          <button
            onClick={handleSave}
            className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition"
          >
            Save
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
