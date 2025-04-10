"use client";

import type React from "react";
import { useState } from "react";
import { X, Plus } from "lucide-react";
import { FaAngleRight } from "react-icons/fa6";
import { Button } from "./ui/button";
import { initialLevels } from "@/lib/constants";

interface Levels {
  id: string;
  text: string;
  levels?: Levels[];
}

export default function CurriculumFramework() {
  const [levelLists, setLevelLists] = useState<number[]>([1, 2, 3, 4, 5]);
  const [noOfLevels, setNoOfLevels] = useState<number>(3);
  const w = 62;
  const dynamicWidth = `${w / noOfLevels}vw`;

  const [levels, setLevels] = useState<Levels[]>(initialLevels);

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
      if (columnNumber === 1) {
        let newLevelId = `${parseInt(parentId.split(".").pop()!) + 1}`;

        const diffColumnNumber = noOfLevels - columnNumber;
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
        if (level.id === compareId) {
          let newLevelId = `${parentId.split(".").slice(0, -1).join(".")}.${
            parseInt(parentId.split(".").pop()!) + 1
          }`;

          const diffColumnNumber = noOfLevels - columnNumber;
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
    setLevels(newLevels);
  };

  const saveFramework = () => {
    alert("Framework saved successfully!. Check console for details.");
    console.log("Saved Framework:", { levels });
  };

  function appendSubLevels(
    levels: Levels[],
    currentDepth: number,
    targetDepth: number
  ): Levels[] {
    return levels.map((level) => {
      if (!level.levels) level.levels = [];

      if (currentDepth === targetDepth - 1) {
        if (level.levels.length === 0) {
          const newSubLevelId = `${level.id}.1`;
          level.levels.push({
            id: newSubLevelId,
            text: `Level ${newSubLevelId}`,
            levels: [],
          });
        }
      } else if (currentDepth < targetDepth - 1) {
        if (level.levels.length === 0) {
          const newSubLevelId = `${level.id}.1`;
          level.levels.push({
            id: newSubLevelId,
            text: `Level ${newSubLevelId}`,
            levels: [],
          });
        }
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
        <div className="w-full overflow-x-auto">
          <div
            style={{
              width: `${w}vw`,
            }}
            className="border mx-auto mt-2 mb-4 "
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
