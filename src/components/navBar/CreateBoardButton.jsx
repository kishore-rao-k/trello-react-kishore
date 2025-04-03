import { useState } from "react";
import axios from "axios";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";

const apiKey = import.meta.env.VITE_TRELLO_API_KEY;
const apiToken = import.meta.env.VITE_TRELLO_API_TOKEN;

const CreateBoardButton = ({ onBoardCreated }) => {
  const [loading, setLoading] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [boardName, setBoardName] = useState("");

  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleCreateBoard = async () => {
    if (!boardName.trim()) return;

    setLoading(true);

    try {
      const response = await axios.post(
        "/api/1/boards/",
        {},
        {
          params: {
            name: boardName,
            key: apiKey,
            token:apiToken,
          },
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      //console.log("board created:", response.data);

      setBoardName("");
      if (onBoardCreated) {
        onBoardCreated(response.data);
      }

      handleCloseMenu();
    } catch (error) {
      console.error("Error creating board:", error);
      alert(`Error: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button variant="contained" color="secondary" onClick={handleOpenMenu}>
        Create
      </Button>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
        sx={{ padding: 2, width: "250px" }}
      >
        <Box sx={{ p: 2, display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            label="Board Name"
            variant="outlined"
            size="small"
            value={boardName}
            onChange={(e) => setBoardName(e.target.value)}
            fullWidth
            autoFocus
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleCreateBoard}
            disabled={loading}
            fullWidth
          >
            {loading ? "Creating..." : "Create Board"}
          </Button>
        </Box>
      </Menu>
    </>
  );
};

export default CreateBoardButton;
