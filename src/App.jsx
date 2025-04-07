import React, { useEffect, useReducer } from "react";
import axios from "axios";
import { Routes, Route } from "react-router-dom";
import NavBar from "./components/navBar/NavBar";
import BoardsList from "./components/BoardsPage/BoardsList";
import BoardDetails from "./components/BoardDetailPage/BoardDetails";
import CardDetails from "./components/BoardDetailPage/CardDetails";

const apiKey = import.meta.env.VITE_TRELLO_API_KEY;
const apiToken = import.meta.env.VITE_TRELLO_API_TOKEN;

const initialState = {
  boards: [],
  loading: true,
  error: null,
};

function reducer(state, action) {
  switch (action.type) {
    case "FETCH_SUCCESS":
      return { ...state, boards: action.payload, loading: false, error: null };
    case "FETCH_ERROR":
      return { ...state, loading: false, error: action.payload };
    case "ADD_BOARD":
      return { ...state, boards: [...state.boards, action.payload] };
    default:
      return state;
  }
}

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const fetchBoards = async () => {
      try {
        const response = await axios.get(
          "https://api.trello.com/1/members/me/boards",
          {
            params: { key: apiKey, token: apiToken },
          }
        );
        dispatch({ type: "FETCH_SUCCESS", payload: response.data });
      } catch (err) {
        console.error("API Fetch Error:", err);
        dispatch({ type: "FETCH_ERROR", payload: err.message });
      }
    };

    fetchBoards();
  }, []);

  return (
    <>
      <NavBar onBoardCreated={(newBoard) => dispatch({ type: "ADD_BOARD", payload: newBoard })} />
      <Routes>
        <Route
          path="/boards"
          element={
            <BoardsList 
              boards={state.boards} 
              loading={state.loading} 
              error={state.error} 
            />
          }
        />
        <Route path="/boards/:boardId" element={<BoardDetails />} />
         <Route path="/card/:cardId" element={<CardDetails />} />
      </Routes>
    </>
  );
}

export default App;
