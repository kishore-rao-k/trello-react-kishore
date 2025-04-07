import React from "react";
import { Typography, Box, CircularProgress } from "@mui/material";
import BoardCard from "./BoardCard";
import { useNavigate } from "react-router-dom";

const BoardsList = ({ boards, loading, error }) => {
  const navigate = useNavigate();

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography color="error" sx={{ textAlign: "center", mt: 4 }}>
        Error: {error}
      </Typography>
    );
  }

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, 250px)",
        justifyContent: "center",
        gap: 2,
        padding: 2,
        width: "100%",
        overflowX: "hidden",
        boxSizing: "border-box",
      }}
    >
      {boards.length > 0 ? (
        boards.map((board) => (
          <Box key={board.id} onClick={() => navigate(`/boards/${board.id}`)} sx={{ cursor: "pointer" }}>
            <BoardCard board={board} />
          </Box>
        ))
      ) : (
        <Typography
          variant="body1"
          sx={{
            textAlign: "center",
            width: "100%",
            gridColumn: "1 / -1",
          }}
        >
          No boards found
        </Typography>
      )}
    </Box>
  );
};

export default BoardsList;
