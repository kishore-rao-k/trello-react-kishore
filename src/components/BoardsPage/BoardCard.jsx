import React from "react";
import { Card, CardMedia, Typography, Box } from "@mui/material";

const BoardCard = ({ board }) => {
  const backgroundImage = board.prefs?.backgroundImage || null;
  const backgroundColor = board.prefs?.backgroundColor || "#ffffff";

  return (
    <Card 
      sx={{
        width: "100%",
        height: 140,
        position: "relative",
        borderRadius: 1,
        overflow: "hidden",
        backgroundColor: backgroundImage ? "transparent" : backgroundColor,
      }}
    >
      {backgroundImage ? (
        <CardMedia
          component="img"
          image={backgroundImage}
          alt={board.name}
          sx={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      ) : (
        <Box
          sx={{
            width: "100%",
            height: "100%",
            bgcolor: backgroundColor,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "1px solid lightgray",
          }}
        />
      )}

      <Box
        sx={{
          position: "absolute",
          inset: 0,
          bgcolor: "rgba(0, 0, 0, 0.4)",
          display: "flex",
          alignItems: "start",
          justifyContent: "start",
          padding: "10px",
          boxSizing: "border-box",
        }}
      >
        <Typography
          variant="h6"
          component="div"
          sx={{
            color: "white",
            fontWeight: "bold",
          }}
        >
          {board.name}
        </Typography>
      </Box>
    </Card>
  );
};

export default BoardCard;
