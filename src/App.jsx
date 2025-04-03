import React, { useEffect, useState } from "react";
import axios from "axios";
import { Routes, Route } from "react-router-dom";
import NavBar from "./components/navBar/NavBar";
import BoardsList from "./components/BoardsPage/BoardsList";

const apiKey = import.meta.env.VITE_TRELLO_API_KEY;
const apiToken = import.meta.env.VITE_TRELLO_API_TOKEN;

function App() {
  const [boards, setBoards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBoards = async () => {
      try {
        const response = await axios.get(
          "https://api.trello.com/1/members/me/boards",
          {
            params: {
              key: apiKey,
              token:apiToken,
            },
          }
        );
        setBoards(response.data);
      } catch (err) {
        console.error("API Fetch Error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBoards();
  }, []);

  return (
    <>
      <NavBar
        onBoardCreated={(newBoard) =>
          setBoards((prevBoards) => [...prevBoards, newBoard])
        }
      />

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>Error: {error}</p>}

      <Routes>
        <Route path="/boards" element={<BoardsList boards={boards} />} />
      </Routes>
    </>
  );
}

export default App;
