import { RPC } from "playroomkit";
import { useState, Suspense } from "react";
import { useGLTF } from "@react-three/drei";
import { Hexagon } from "./Hexagon";

export const HEX_X_SPACING = 2;
export const HEX_Z_SPACING = 1.95;
export const NB_ROWS = 8;
export const NB_COLUMNS = 8;
export const FLOOR_HEIGHT = 10;
export const FLOORS = [
  {
    color: "red",
  },
  {
    color: "blue",
  },
  {
    color: "green",
  },
  {
    color: "yellow",
  },
  {
    color: "purple",
  },
];

// Landscape component
const Landscape = ({ position, scale = 1 }) => {
  // Use draco loader with useGLTF
  const { scene } = useGLTF("/models/landscape_map.glb", true); // true enables draco

  return (
    <primitive
      object={scene.clone()}
      position={position}
      scale={scale}
      frustumCulled={false}
    />
  );
};

// Preload with draco
useGLTF.preload("/models/landscape_map.glb");

export const GameArena = () => {
  const [hexagonHit, setHexagonHit] = useState({});

  RPC.register("hexagonHit", (data) => {
    setHexagonHit((prev) => ({
      ...prev,
      [data.hexagonKey]: true,
    }));
  });

  const totalHeight = FLOORS.length * FLOOR_HEIGHT;

  return (
    <>
      {/* Landscape Background - no physics, just visual */}
      <Suspense fallback={null}>
        <Landscape position={[0, -totalHeight - 30, 0]} scale={1} />
      </Suspense>
      {/* Hexagon Grid */}
      <group
        position-x={-((NB_COLUMNS - 1) / 2) * HEX_X_SPACING}
        position-z={-((NB_ROWS - 1) / 2) * HEX_Z_SPACING}
      >
        {FLOORS.map((floor, floorIndex) => (
          <group key={floorIndex} position-y={floorIndex * -FLOOR_HEIGHT}>
            {[...Array(NB_ROWS)].map((_, rowIndex) => (
              <group
                key={rowIndex}
                position-z={rowIndex * HEX_Z_SPACING}
                position-x={rowIndex % 2 ? HEX_X_SPACING / 2 : 0}
              >
                {[...Array(NB_COLUMNS)].map((_, columnIndex) => (
                  <Hexagon
                    key={columnIndex}
                    position-x={columnIndex * HEX_X_SPACING}
                    color={floor.color}
                    onHit={() => {
                      const hexagonKey = `${floorIndex}-${rowIndex}-${columnIndex}`;
                      setHexagonHit((prev) => ({
                        ...prev,
                        [hexagonKey]: true,
                      }));
                      RPC.call("hexagonHit", { hexagonKey }, RPC.Mode.ALL);
                    }}
                    hit={hexagonHit[`${floorIndex}-${rowIndex}-${columnIndex}`]}
                  />
                ))}
              </group>
            ))}
          </group>
        ))}
      </group>
    </>
  );
};
