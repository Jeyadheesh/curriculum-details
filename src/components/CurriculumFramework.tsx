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
  const [levels, setLevels] = useState<Levels[]>([
    {
      id: "1",
      text: "Level 1",
      levels: [
        {
          id: "1.1",
          text: "Level 1.1",
          levels: [
            { id: "1.1.1", text: "Level 1.1.1" },
            { id: "1.1.2", text: "Level 1.1.2" },
          ],
        },
        {
          id: "1.2",
          text: "Level 1.2",
          levels: [
            { id: "1.2.1", text: "Level 1.2.1" },
            { id: "1.2.2", text: "Level 1.2.2" },
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
          levels: [{ id: "2.1.1", text: "Level 2.1.1" }],
        },
        {
          id: "2.2",
          text: "Level 2.2",
          levels: [{ id: "2.2.1", text: "Level 2.2.1" }],
        },
      ],
    },
  ]);
  const w = 62;

  function renderLevels(levels?: Levels[]) {
    if (!levels) return null;
    return levels.map((level, index) => (
      <div
        key={level.id}
        className={`${index === levels.length - 1 || "border-b"} flex `}
      >
        <div
          style={{
            width: `${w / noOfLevels}vw`,
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
          {/* Show "+" icon only in the last cell of the row */}
          {index === levels.length - 1 && (
            <div className="absolute right-2 bottom-1">
              <Button
                variant="outline"
                className="rounded text-[#2688EB] p-0.5 border border-[#2688EB] cursor-pointer"
                onClick={() => addLevel(level.id)}
              >
                <Plus className="h-5 w-5 font-extralight" />
              </Button>
            </div>
          )}
        </div>

        {index < noOfLevels - 1 && level.levels && (
          <div>{renderLevels(level.levels)}</div>
        )}
      </div>
    ));
  }

  const addLevel = (id: string) => {
    let newLevels = [...levels];

    const findAndAddLevel = (levels: Levels[], parentId: string) => {
      for (let level of levels) {
        const compareId =
          parentId.split(".").length > 1
            ? parentId.split(".").slice(0, -1).join(".")
            : parentId;

        if (level.id === compareId) {
          // Create a new level with an incremented ID
          const newLevelId = `${parentId.split(".").slice(0, -1).join(".")}.${
            parseInt(parentId.split(".").pop()!) + 1
          }`;

          // Check if the new level already exists
          const existingLevel = newLevels.find((l) => l.id === newLevelId);

          if (!existingLevel) {
            const newLevel = {
              id: newLevelId,
              text: `Level ${newLevelId}`,
              levels: [],
            };

            // Add the new level to the current level's children
            level.levels = level.levels
              ? [...level.levels, newLevel]
              : [newLevel];
          }
          return true; // Level added
        }
        if (level.levels) {
          const found = findAndAddLevel(level.levels, parentId);
          if (found) return true; // Level added in nested levels
        }
      }
      return false; // Level not found
    };

    findAndAddLevel(newLevels, id);
    setLevels(newLevels);
  };

  const saveFramework = () => {
    console.log("Saving framework:", {
      levels,
    });
    alert("Framework saved successfully!");
  };

  function appendSubLevels(
    levels: Levels[],
    currentDepth: number,
    targetDepth: number
  ): Levels[] {
    console.log("Appending sub-levels at depth:", currentDepth, targetDepth);

    return levels.map((level) => {
      // If the current depth is one less than the target depth, add a new sub-level
      if (currentDepth === targetDepth - 1) {
        const newSubLevelId = `${level.id}.1`;
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

      // Recursively traverse deeper levels
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
    const updatedLevels = appendSubLevels(levels, 0, noOfLevels);
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
                  handleAddSubLevels(num);
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
          className="border mt-2 mb-4 overflow-hidden"
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
