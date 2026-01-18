// if i were to creat a browser based crossword, would I create a grid, give each 
// square an ID. 
// Users input there letters based on clues 
// i have a load of conditionals that ontype, checks that squars associated word array
// if all other letters are there it changes colour 
// and becomes nclickable

"use client";

import { useState, useRef, useMemo } from "react";

// Type definitions
interface Cell {
  x: number;
  y: number;
  value: string;
  answer: string;
  number?: number;
  belongsTo: string[];
  isBlack: boolean;
}

interface Word {
  id: string;
  clue: string;
  answer: string;
  direction: "across" | "down";
  startX: number;
  startY: number;
  number: number;
}

interface CrosswordData {
  size: number;
  words: Word[];
}

// Sample crossword puzzle data
const PUZZLE_DATA: CrosswordData = {
  size: 7,
  words: [
    { id: "1a", clue: "Disco classic venue", answer: "CLUB", direction: "across", startX: 0, startY: 0, number: 1 },
    { id: "2a", clue: "Dance all night", answer: "PARTY", direction: "across", startX: 2, startY: 2, number: 2 },
    { id: "3a", clue: "Glitter sphere", answer: "BALL", direction: "across", startX: 0, startY: 4, number: 3 },
    { id: "1d", clue: "Beat provider", answer: "DJ", direction: "down", startX: 0, startY: 0, number: 1 },
    { id: "4d", clue: "Groove", answer: "VIBE", direction: "down", startX: 3, startY: 1, number: 4 },
    { id: "5d", clue: "Sound system", answer: "AUDIO", direction: "down", startX: 5, startY: 2, number: 5 },
  ],
};

// Initialize grid once
const initializeGrid = (): Cell[][] => {
  const newGrid: Cell[][] = Array(PUZZLE_DATA.size)
    .fill(null)
    .map((_, y) =>
      Array(PUZZLE_DATA.size)
        .fill(null)
        .map((_, x) => ({
          x,
          y,
          value: "",
          answer: "",
          belongsTo: [],
          isBlack: true,
        }))
    );

  // Populate cells from words
  PUZZLE_DATA.words.forEach((word) => {
    word.answer.split("").forEach((letter, index) => {
      const x = word.direction === "across" ? word.startX + index : word.startX;
      const y = word.direction === "down" ? word.startY + index : word.startY;

      if (newGrid[y] && newGrid[y][x]) {
        newGrid[y][x].answer = letter;
        newGrid[y][x].isBlack = false;
        newGrid[y][x].belongsTo.push(word.id);

        // Add number to starting cell
        if (index === 0) {
          newGrid[y][x].number = word.number;
        }
      }
    });
  });

  return newGrid;
};

export default function CrossWord() {
  const [grid, setGrid] = useState<Cell[][]>(initializeGrid);
  const [focusedCell, setFocusedCell] = useState<{ x: number; y: number } | null>(null);
  const [selectedDirection, setSelectedDirection] = useState<"across" | "down">("across");
  const inputRefs = useRef<Map<string, HTMLInputElement>>(new Map());

  // Compute completed words during render
  const completedWords = useMemo(() => {
    if (grid.length === 0) return new Set<string>();

    const completed = new Set<string>();

    PUZZLE_DATA.words.forEach((word) => {
      const cells = word.answer.split("").map((_, index) => {
        const x = word.direction === "across" ? word.startX + index : word.startX;
        const y = word.direction === "down" ? word.startY + index : word.startY;
        return grid[y]?.[x];
      });

      const isComplete = cells.every((cell) => cell?.value.toUpperCase() === cell?.answer);
      if (isComplete) {
        completed.add(word.id);
      }
    });

    return completed;
  }, [grid]);

  // Handle input
  const handleInput = (x: number, y: number, value: string) => {
    const letter = value.slice(-1).toUpperCase();
    
    setGrid((prevGrid) => {
      const newGrid = prevGrid.map((row) => row.map((cell) => ({ ...cell })));
      newGrid[y][x].value = letter;
      return newGrid;
    });

    // Auto-advance to next cell
    if (letter) {
      moveToNextCell(x, y);
    }
  };

  // Move to next cell based on selected direction
  const moveToNextCell = (x: number, y: number) => {
    let nextX = x;
    let nextY = y;

    if (selectedDirection === "across") {
      nextX = x + 1;
    } else {
      nextY = y + 1;
    }

    if (grid[nextY]?.[nextX] && !grid[nextY][nextX].isBlack) {
      setFocusedCell({ x: nextX, y: nextY });
      const key = `${nextX}-${nextY}`;
      inputRefs.current.get(key)?.focus();
    }
  };

  // Handle arrow key navigation
  const handleKeyDown = (e: React.KeyboardEvent, x: number, y: number) => {
    let nextX = x;
    let nextY = y;

    switch (e.key) {
      case "ArrowUp":
        nextY = y - 1;
        e.preventDefault();
        break;
      case "ArrowDown":
        nextY = y + 1;
        e.preventDefault();
        break;
      case "ArrowLeft":
        nextX = x - 1;
        e.preventDefault();
        break;
      case "ArrowRight":
        nextX = x + 1;
        e.preventDefault();
        break;
      case "Backspace":
        if (!grid[y][x].value) {
          // Move back if current cell is empty
          if (selectedDirection === "across") {
            nextX = x - 1;
          } else {
            nextY = y - 1;
          }
        }
        break;
      default:
        return;
    }

    if (grid[nextY]?.[nextX] && !grid[nextY][nextX].isBlack) {
      setFocusedCell({ x: nextX, y: nextY });
      const key = `${nextX}-${nextY}`;
      inputRefs.current.get(key)?.focus();
    }
  };

  const isCellInCompletedWord = (x: number, y: number) => {
    if (!grid[y] || !grid[y][x]) return false;
    return grid[y][x].belongsTo.some((wordId) => completedWords.has(wordId));
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-8 font-[family-name:var(--code)]">
      <h2 className="text-4xl md:text-5xl font-[family-name:var(--impact)] text-cream mb-6 text-center">
        Misscoteque Crossword
      </h2>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Crossword Grid */}
        <div className="flex-1">
          <div
            className="inline-grid gap-[2px] bg-black p-1 rounded-lg"
            style={{
              gridTemplateColumns: `repeat(${PUZZLE_DATA.size}, 1fr)`,
            }}
          >
            {grid.map((row, y) =>
              row.map((cell, x) => {
                const key = `${x}-${y}`;
                const isCompleted = isCellInCompletedWord(x, y);
                const isFocused = focusedCell?.x === x && focusedCell?.y === y;

                if (cell.isBlack) {
                  return (
                    <div
                      key={key}
                      className="w-10 h-10 md:w-12 md:h-12 bg-black"
                      aria-hidden="true"
                    />
                  );
                }

                return (
                  <div key={key} className="relative w-10 h-10 md:w-12 md:h-12">
                    {cell.number && (
                      <span className="absolute top-0 left-1 text-[10px] font-bold text-black z-10">
                        {cell.number}
                      </span>
                    )}
                    <input
                      ref={(el) => {
                        if (el) inputRefs.current.set(key, el);
                        else inputRefs.current.delete(key);
                      }}
                      type="text"
                      maxLength={1}
                      value={cell.value}
                      onChange={(e) => handleInput(x, y, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(e, x, y)}
                      onFocus={() => setFocusedCell({ x, y })}
                      className={`w-full h-full text-center text-lg md:text-xl font-bold uppercase border-2 transition-colors ${
                        isCompleted
                          ? "bg-pink text-black border-pink"
                          : isFocused
                          ? "bg-cream text-black border-orange"
                          : "bg-cream text-black border-cream hover:border-orange"
                      } focus:outline-none focus:ring-2 focus:ring-orange`}
                      aria-label={`Cell ${x + 1}, ${y + 1}`}
                    />
                  </div>
                );
              })
            )}
          </div>

          {/* Direction Toggle */}
          <div className="mt-4 flex gap-2 justify-center">
            <button
              onClick={() => setSelectedDirection("across")}
              className={`px-4 py-2 rounded font-bold transition-colors ${
                selectedDirection === "across"
                  ? "bg-orange text-black"
                  : "bg-cream text-black hover:bg-pink"
              }`}
            >
              Across
            </button>
            <button
              onClick={() => setSelectedDirection("down")}
              className={`px-4 py-2 rounded font-bold transition-colors ${
                selectedDirection === "down"
                  ? "bg-orange text-black"
                  : "bg-cream text-black hover:bg-pink"
              }`}
            >
              Down
            </button>
          </div>
        </div>

        {/* Clues */}
        <div className="flex-1 space-y-6">
          <div>
            <h3 className="text-2xl font-[family-name:var(--impact)] text-cream mb-3">
              Across
            </h3>
            <ul className="space-y-2">
              {PUZZLE_DATA.words
                .filter((w) => w.direction === "across")
                .map((word) => (
                  <li
                    key={word.id}
                    className={`${
                      completedWords.has(word.id)
                        ? "text-pink line-through"
                        : "text-cream"
                    }`}
                  >
                    <span className="font-bold">{word.number}.</span> {word.clue}
                  </li>
                ))}
            </ul>
          </div>

          <div>
            <h3 className="text-2xl font-[family-name:var(--impact)] text-cream mb-3">
              Down
            </h3>
            <ul className="space-y-2">
              {PUZZLE_DATA.words
                .filter((w) => w.direction === "down")
                .map((word) => (
                  <li
                    key={word.id}
                    className={`${
                      completedWords.has(word.id)
                        ? "text-pink line-through"
                        : "text-cream"
                    }`}
                  >
                    <span className="font-bold">{word.number}.</span> {word.clue}
                  </li>
                ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Progress */}
      <div className="mt-6 text-center">
        <p className="text-cream text-lg">
          Completed: <span className="font-bold text-pink">{completedWords.size}</span> /{" "}
          {PUZZLE_DATA.words.length}
        </p>
      </div>
    </div>
  );
}