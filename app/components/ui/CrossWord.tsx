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
  isTransparent: boolean;
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
  size: 16,
  words: [
    // Across
    { id: "6a", clue: "Gay clip for securing things", answer: "CARABINER", direction: "across", startX: 0, startY: 6, number: 6 },
    { id: "3a", clue: "Masc presenting Lesbian", answer: "BUTCH", direction: "across", startX: 4, startY: 2, number: 3 },
    { id: "4a", clue: "A strong affinity to femininity", answer: "FEMME", direction: "across", startX: 6, startY: 4, number: 4 },
    { id: "9a", clue: "BA place to store and record things", answer: "ARCHIVE", direction: "across", startX: 8, startY: 7, number: 9 },
    { id: "8a", clue: "Typically girl on girl", answer: "LESBIAN", direction: "across", startX: 8, startY: 12, number: 8 },
    // Down
    { id: "1d", clue: "Working with wood", answer: "WOODWORK", direction: "down", startX: 2, startY: 0, number: 1 },
    { id: "2d", clue: "Academic study of identity", answer: "EPHEMERA", direction: "down", startX: 8, startY: 0, number: 2 },
    { id: "7d", clue: "Doing stuff to change stuff", answer: "ACTIVISM", direction: "down", startX: 10, startY: 6, number: 7},
    { id: "8d", clue: "Neck decor", answer: "TIES", direction: "down", startX: 12, startY: 6, number: 8 },
    { id: "5d", clue: "Lesbian slur", answer: "DYKE", direction: "down", startX: 14, startY: 4, number: 5 },
    { id: "10d", clue: "Gender assigned at birth does not match true gender", answer: "TRANS", direction: "down", startX: 14, startY: 9, number: 10 },
    { id: "11d", clue: "Not a CD but a...", answer: "VINYL", direction: "down", startX: 12, startY: 11, number: 11 },

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
          isTransparent: true,
        }))
    );

  // Populate cells from words
  PUZZLE_DATA.words.forEach((word) => {
    word.answer.split("").forEach((letter, index) => {
      const x = word.direction === "across" ? word.startX + index : word.startX;
      const y = word.direction === "down" ? word.startY + index : word.startY;

      if (newGrid[y] && newGrid[y][x]) {
        newGrid[y][x].answer = letter;
        newGrid[y][x].isTransparent = false;
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
  const [crossedOutClues, setCrossedOutClues] = useState<Set<string>>(new Set());
  const inputRefs = useRef<Map<string, HTMLInputElement>>(new Map());

  // Toggle clue strikethrough
  const toggleClueStrikethrough = (wordId: string) => {
    setCrossedOutClues(prev => {
      const newSet = new Set(prev);
      if (newSet.has(wordId)) {
        newSet.delete(wordId);
      } else {
        newSet.add(wordId);
      }
      return newSet;
    });
  };

  // Check if all words are completed
  const allWordsComplete = useMemo(() => {
    if (grid.length === 0) return false;

    return PUZZLE_DATA.words.every((word) => {
      const cells = word.answer.split("").map((_, index) => {
        const x = word.direction === "across" ? word.startX + index : word.startX;
        const y = word.direction === "down" ? word.startY + index : word.startY;
        return grid[y]?.[x];
      });

      return cells.every((cell) => cell?.value.toUpperCase() === cell?.answer);
    });
  }, [grid]);

  // Handle input
  const handleInput = (x: number, y: number, value: string) => {
    const letter = value.slice(-1).toUpperCase();
    
    setGrid((prevGrid) => {
      const newGrid = prevGrid.map((row) => row.map((cell) => ({ ...cell })));
      newGrid[y][x].value = letter;
      return newGrid;
    });
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
        // Don't auto-navigate on backspace
        return;
      default:
        return;
    }

    if (grid[nextY]?.[nextX] && !grid[nextY][nextX].isTransparent) {
      setFocusedCell({ x: nextX, y: nextY });
      const key = `${nextX}-${nextY}`;
      inputRefs.current.get(key)?.focus();
    }
  };



  return (
    <div className="max-w-3xl mx-auto mt-10">
        <div className="flex flex-col md:flex-row items-start">
        {/* Crossword Background */}
        <div className="">
          <div
            className="inline-grid gap-[1px] p-10"
            style={{
              gridTemplateColumns: `repeat(${PUZZLE_DATA.size}, 1fr)`,
              backgroundImage: "url('/images/cw-bg.png')",
              backgroundSize: "100%",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          >
            {grid.map((row, y) =>
              row.map((cell, x) => {
                const key = `${x}-${y}`;
                const isFocused = focusedCell?.x === x && focusedCell?.y === y;

                if (cell.isTransparent) {
                  return (
                    <div
                      key={key}
                      className="w-1 h-1 md:w-0.5 md:h-0.5 bg-transparent"
                      aria-hidden="true"
                    />
                  );
                }

                return (
                  <div key={key} className="relative w-6 h-6 md:w-6 md:h-6">
                    {cell.number && (
                      <span className="absolute top-0 left-0.5 text-[10px] md:text-[10px] font-bold text-black z-10">
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
                      className={`w-full h-full text-center text-sm md:text-sm uppercase border-2 transition-colors ${
                        allWordsComplete
                          ? "bg-pink text-black border-pink"
                          : isFocused
                          ? "bg-cream text-black border-red"
                          : "bg-cream text-black border-cream hover:border-red"
                      } focus:outline-none focus:ring-2 focus:ring-red`}
                      aria-label={`Cell ${x + 1}, ${y + 1}`}
                    />
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Clues */}
        <div className="flex flex-col gap-2 ml-4">
          <div>
            <h3 className="text-xl text-black font-bold">
              Across
            </h3>
            <ul className="">
              {PUZZLE_DATA.words
                .filter((w) => w.direction === "across")
                .map((word) => (
                  <li
                    key={word.id}
                    onClick={() => toggleClueStrikethrough(word.id)}
                    className={`cursor-pointer hover:text-red transition-colors ${
                      crossedOutClues.has(word.id)
                        ? "text-pink line-through"
                        : "text-black"
                    }`}
                  >
                    <span className="font-bold">{word.number}.</span> {word.clue}
                  </li>
                ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xl text-black font-bold">
              Down
            </h3>
            <ul className="">
              {PUZZLE_DATA.words
                .filter((w) => w.direction === "down")
                .map((word) => (
                  <li
                    key={word.id}
                    onClick={() => toggleClueStrikethrough(word.id)}
                    className={`cursor-pointer hover:text-red transition-colors ${
                      crossedOutClues.has(word.id)
                        ? "text-pink line-through"
                        : "text-black"
                    }`}
                  >
                    <span className="font-bold">{word.number}.</span> {word.clue}
                  </li>
                ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}