import React from "react";
import { Typography, Box } from "@mui/material";
import BoardCard from "./BoardCard";

const BoardsList = ({ boards }) => {
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
          <Box key={board.id}>
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
