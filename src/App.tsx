import { useState, useReducer, useEffect } from 'react';

import { StateHelper, type Config, type GameCategory, type GameCategoryState } from './types';
import { hashString } from './helpers/hashString';

import { ThemeContext } from './context';
import { APP_DEFAULTS } from './constants/app';

import LoadCSS from './utilities/LoadCSS';
import GameBoard from './components/GameBoard';
import GamePanel from './components/GamePanel';

import './App.css'

function setInitialGameBoard(gameBoard: GameCategory[]): GameCategoryState[] {
  return gameBoard.map(cat => ({
      category: cat.category,
      items: cat.items.map(item => ({ ...item, isRevealed: false })),
  }));
}

async function loadBoard(gameBoard: GameCategoryState[]): Promise<GameCategoryState[]> {
  const serializedDefault = JSON.stringify(gameBoard);
  const defaultHash = await hashString(serializedDefault);

  const savedBoard = localStorage.getItem(StateHelper.BOARD_STATE);
  const savedHash = localStorage.getItem(StateHelper.BOARD_HASH);

  if (savedBoard && savedHash === defaultHash) {
    return JSON.parse(savedBoard);
  }

  localStorage.setItem(StateHelper.BOARD_STATE, serializedDefault);
  localStorage.setItem(StateHelper.BOARD_HASH, defaultHash);
  
  return gameBoard;
}

type ConfigState = {
  status: "loading" | "loaded" | "error";
  config: Config;
}

const initialConfig: ConfigState = {
  status: "loading",
  config: {
    theme: APP_DEFAULTS.theme,
    timer: APP_DEFAULTS.timer,
    delay: APP_DEFAULTS.delay,
    triggers: {},
    difficulty: {
      default: "",
      list: []
    }
  }
}

type ConfigAction =
  | { type: "LOAD_CONFIG", data: Config }
  | { type: "SET_ERROR" }

function configReducer(state: ConfigState, action: ConfigAction): ConfigState {
  switch (action.type) {
    case "LOAD_CONFIG":
      return {
        ...state,
        status: "loaded",
        config: action.data,
      }
    case "SET_ERROR":
      return {
        ...state,
        status: "error"
      }
    default:
      return state;
  }
}

export default function App() {
  const [configState, configDispatch] = useReducer(configReducer, initialConfig);

  const [gameBoard, setGameBoard] = useState<GameCategoryState[]>([]);
  const [selectedItem, setSelectedItem] = useState<{catIdx: number, rowIdx: number} | null>(null);

  const handleTileClick = (catIdx: number, rowIdx: number) => {
    setSelectedItem({catIdx, rowIdx});
  };

  const handleReveal = () => {
    if (selectedItem && !gameBoard[selectedItem.catIdx].items[selectedItem.rowIdx].isRevealed) {
      setGameBoard(prev => {
        const update = prev.map((cat, c) => ({
          category: cat.category,
          items: cat.items.map((item, r) => ({ ...item, isRevealed: (selectedItem.catIdx == c && selectedItem.rowIdx == r ? true : item.isRevealed) }))
        }));

        localStorage.setItem(StateHelper.BOARD_STATE, JSON.stringify(update));
        return update;
      });
    }
  };

  const handleClosePanel = () => {
    setSelectedItem(null);
  };

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.ctrlKey && e.shiftKey && e.key === "X") {
        localStorage.clear();
        window.location.reload();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    async function fetchConfig() {
      try {
        const res = await fetch(`/config.json?ts=${Date.now()}`);

        if (!res.ok) {
          throw new Error("Failed to fetch config. Check if config.json exists.");
        }

        const data = await res.json();
        const {gameBoard, ...rest} = data;
        const defaultBoard = setInitialGameBoard(gameBoard);
        const loadedBoard = await loadBoard(defaultBoard);
        if (gameBoard) setGameBoard(loadedBoard);

        configDispatch({ type: "LOAD_CONFIG", data: rest });
      }
      catch (err) {
        console.error(err);
        configDispatch({ type: "SET_ERROR" });
      }
    }

    fetchConfig();

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const { config, status } = configState;
  const configReady = gameBoard.length > 0 && status === "loaded";
  const loadingTextOutput: Record<ConfigState["status"], React.ReactNode | null> = {
    loading: <p>Loading config...</p>,
    loaded: null,
    error: <p>Failed to fetch config. Check if config.json exists.</p>,
  }

  return (
    <ThemeContext.Provider value={`/${config.theme}`}>
      <LoadCSS />
      {configReady ?
        <>
          <GameBoard
            gameBoard={gameBoard}
            difficulty={config.difficulty}
            onHandleTileClick={handleTileClick} />
          <GamePanel
            item={selectedItem && gameBoard[selectedItem.catIdx].items[selectedItem.rowIdx]}
            timer={config.timer}
            delay={config.delay}
            triggers={config.triggers}
            loadingText={config.loadingText}
            onReveal={handleReveal}
            onClose={handleClosePanel} />
        </> :
        loadingTextOutput[status]
      }
    </ThemeContext.Provider>
  )
}
