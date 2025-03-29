"use client";

import type React from "react";
import { useState } from "react";
import { X, Plus } from "lucide-react";
import { FaAngleRight } from "react-icons/fa6";
import { Button } from "./ui/button";

interface Levels {
  id: string;
  text: string;
  levels?: Levels[];
}

export default function CurriculumFramework() {
  const [levelLists, setLevelLists] = useState<number[]>([1, 2, 3, 4, 5]);
  const [noOfLevels, setNoOfLevels] = useState<number>(3);
  // const dynamicWidth = `${100 / noOfLevels}%`;
  const dynamicWidth = `${62 / noOfLevels}vw`;

  const [levels, setLevels] = useState<Levels[]>([
    {
      id: "1",
      text: "Level 1",
      levels: [
        {
          id: "1.1",
          text: "Level 1.1",
          levels: [
            {
              id: "1.1.1",
              text: "Level 1.1.1",
              levels: [],
            },
            {
              id: "1.1.2",
              text: "Level 1.1.2",
              levels: [],
            },
          ],
        },
        {
          id: "1.2",
          text: "Level 1.2",
          levels: [
            {
              id: "1.2.1",
              text: "Level 1.2.1",
              levels: [],
            },
            {
              id: "1.2.2",
              text: "Level 1.2.2",
              levels: [],
            },
          ],
        },
      ],
    },
    {
      id: "2",
      text: "Level 2",
      levels: [
        {
          id: "2.1",
          text: "Level 2.1",
          levels: [
            {
              id: "2.1.1",
              text: "Level 2.1.1",
              levels: [],
            },
          ],
        },
        {
          id: "2.2",
          text: "Level 2.2",
          levels: [
            {
              id: "2.2.1",
              text: "Level 2.2.1",
              levels: [],
            },
          ],
        },
      ],
    },
  ]);
  const w = 62;

  function getColumnLevels(
    levels: Levels[],
    columnIndex: number,
    currentLevel: number = 0
  ): Levels[] {
    if (currentLevel === columnIndex) {
      return levels;
    }

    const subLevels: Levels[] = [];
    levels.forEach((level) => {
      if (level.levels) {
        subLevels.push(
          ...getColumnLevels(level.levels, columnIndex, currentLevel + 1)
        );
      }
    });

    return subLevels;
  }

  function renderLevels(levels?: Levels[]) {
    if (!levels) return null;
    return levels
      .filter((level) => level.id.split(".").length <= noOfLevels)
      .map((level, index) => (
        <div
          id={level.id + " " + index}
          key={level.id}
          className={`${index === levels.length - 1 || "border-b"} flex `}
        >
          <div
            style={{
              width: dynamicWidth,
            }}
            className="border-r border-gray-300 relative"
          >
            <h1 className="grid place-content-center h-full p-2">
              <span
                className="
            font-extralight"
              >
                {level.text}
              </span>
            </h1>

            {index === levels.length - 1 && (
              <div className="absolute right-2 bottom-1">
                <button
                  className="rounded text-[#2688EB] border border-[#2688EB] cursor-pointer"
                  onClick={() => addLevel(level.id)}
                >
                  <Plus className="" />
                </button>
              </div>
            )}
          </div>

          {level.levels && <div>{renderLevels(level.levels)}</div>}
        </div>
      ));
  }

  const addLevel = (id: string) => {
    let newLevels = [...levels];

    const findAndAddLevel = (levels: Levels[], parentId: string) => {
      const columnNumber = parseInt(parentId.split(".").length.toString());
      console.log("Column index:", columnNumber);
      if (columnNumber === 1) {
        let newLevelId = `${parseInt(parentId.split(".").pop()!) + 1}`;
        console.log("New level ID:", newLevelId);

        const diffColumnNumber = noOfLevels - columnNumber;
        console.log("Diff column number:", diffColumnNumber);
        let newLevel: Levels = {
          id: newLevelId,
          text: `Level ${newLevelId}`,
          levels: [],
        };

        let currentLevel = newLevel;

        for (let i = 0; i < diffColumnNumber; i++) {
          newLevelId = `${newLevelId}.1`;

          const newSubLevel = {
            id: newLevelId,
            text: `Level ${newLevelId}`,
            levels: [],
          };

          currentLevel.levels && currentLevel.levels.push(newSubLevel);
          currentLevel = newSubLevel;
        }

        newLevels = [...levels, newLevel];
        return true;
      }

      for (let level of levels) {
        const compareId =
          columnNumber > 1
            ? parentId.split(".").slice(0, -1).join(".")
            : parentId;
        console.log("Comparing ID:", compareId, "with level ID:", level.id);
        if (level.id === compareId) {
          let newLevelId = `${parentId.split(".").slice(0, -1).join(".")}.${
            parseInt(parentId.split(".").pop()!) + 1
          }`;

          const diffColumnNumber = noOfLevels - columnNumber;
          console.log("Diff column number:", diffColumnNumber);
          let newLevel: Levels = {
            id: newLevelId,
            text: `Level ${newLevelId}`,
            levels: [],
          };

          let currentLevel = newLevel;

          for (let i = 0; i < diffColumnNumber; i++) {
            newLevelId = `${newLevelId}.1`;

            const newSubLevel = {
              id: newLevelId,
              text: `Level ${newLevelId}`,
              levels: [],
            };

            currentLevel.levels && currentLevel.levels.push(newSubLevel);
            currentLevel = newSubLevel;
          }

          level.levels = level.levels
            ? [...level.levels, newLevel]
            : [newLevel];
          console.log("New level added:", newLevel);

          return true;
        }
        if (level.levels) {
          const found = findAndAddLevel(level.levels, parentId);
          if (found) return true;
        }
      }
      return false;
    };

    findAndAddLevel(newLevels, id);
    console.log("New levels after addition:", newLevels);
    setLevels(newLevels);
  };

  const saveFramework = () => {
    console.log("Saved framework:", { levels });
    alert("Framework saved successfully!");
  };

  function appendSubLevels(
    levels: Levels[],
    currentDepth: number,
    targetDepth: number
  ): Levels[] {
    console.log("Appending sub-levels at depth:", currentDepth, targetDepth);

    return levels.map((level) => {
      // If we are at the current depth and need to add sub-levels
      if (currentDepth < targetDepth - 1) {
        // Create a new sub-level
        const newSubLevelId = `${level.id}.${(level.levels?.length || 0) + 1}`;
        const newSubLevel = {
          id: newSubLevelId,
          text: `Level ${newSubLevelId}`,
          levels: [],
        };

        // Add the new sub-level if it doesn't already exist
        if (!level.levels?.some((subLevel) => subLevel.id === newSubLevelId)) {
          level.levels = [...(level.levels || []), newSubLevel];
        }
      }

      // Recursively append sub-levels to the next depth
      if (level.levels) {
        level.levels = appendSubLevels(
          level.levels,
          currentDepth + 1,
          targetDepth
        );
      }

      return level;
    });
  }

  function handleAddSubLevels(num: number) {
    const updatedLevels = appendSubLevels(levels, 0, num);
    console.log("Updated levels:", updatedLevels);

    setLevels(updatedLevels);
  }

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden p-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-semibold">Configure New Framework</h1>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full border border-[#333333] cursor-pointer  hover:bg-gray-200 "
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      <div className="space-y-4 p-3">
        {/* Breadcrumb */}
        <div className="p-3 px-4 mt-5 flex items-center gap-1 text-gray-600 border border-gray-3  00 rounded-md">
          <span>NCF</span>
          <FaAngleRight />
          <span>Grade 9</span>
          <FaAngleRight />
          <span>Science</span>
        </div>

        {/* Level Selector */}
        <div>
          <div className="font-normal mb-2">Number of levels</div>
          <div className="flex items-center gap-2">
            {levelLists.map((num) => (
              <button
                key={num}
                className={`w-10 h-10 cursor-pointer hover:bg-[#333333]/50 rounded-full flex items-center justify-center ${
                  noOfLevels === num
                    ? "bg-[#333333] text-white"
                    : "bg-gray-200 text-[#333333]"
                }`}
                onClick={() => {
                  setNoOfLevels(num);
                  if (num > noOfLevels) {
                    handleAddSubLevels(num);
                  }
                }}
              >
                {num}
              </button>
            ))}
          </div>
        </div>

        {/* Framework Table */}
        <div
          style={{
            width: `${w}vw`,
          }}
          className="border mx-auto mt-2 mb-4 overflow-hidden"
        >
          {/* Table Headers */}
          <div className="flex bg-[#333333] text-white border">
            {Array.from({ length: noOfLevels }, (_, i) => (
              <div
                key={i + 1}
                className="flex-1 items-center justify-center border-r text-sm border-r-white uppercase border-[#333333] p-2 text-center"
              >
                ADD NAME FOR Level {i + 1}
              </div>
            ))}
          </div>

          {/* Table Content */}
          <div className="">{renderLevels(levels)}</div>
        </div>
      </div>

      {/* Save Button */}
      <div className="p-4 flex justify-end">
        <Button
          className="bg-[#333333] hover:bg-[#333333] text-white"
          onClick={saveFramework}
        >
          Save Framework
        </Button>
      </div>
    </div>
  );
}
