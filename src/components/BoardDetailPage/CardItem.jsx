import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Box,
    Paper,
    Typography,
    IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";

const apiKey = import.meta.env.VITE_TRELLO_API_KEY;
const apiToken = import.meta.env.VITE_TRELLO_API_TOKEN;

const CardItem = ({ card, listId, onDelete }) => {
    const [hovered, setHovered] = useState(false);
    const [selected, setSelected] = useState(false);
    const navigate = useNavigate();

    const handleDeleteCard = async (e) => {
        e.stopPropagation();
        try {
            await axios.delete(`https://api.trello.com/1/cards/${card.id}`, {
                params: {
                    key: apiKey,
                    token: apiToken,
                },
            });
            onDelete(card.id);
        } catch (err) {
            console.error("Failed to delete card:", err);
        }
    };

    const handleCardClick = () => {
        navigate(`/card/${card.id}`);
    };

    return (
        <Paper
            elevation={0}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            sx={{
                p: 1.5,
                mb: 1,
                backgroundColor: "#f5f5f5",
                borderRadius: 1,
                cursor: "pointer",
                '&:hover': {
                    backgroundColor: "#ebebeb"
                },
                position: "relative"
            }}
            onClick={handleCardClick}
        >
            <Box sx={{ display: "flex", alignItems: "center" }}>
                {hovered && (
                    <input
                        type="radio"
                        checked={selected}
                        onChange={(e) => {
                            e.stopPropagation();
                            setSelected(!selected);
                        }}
                        style={{ marginRight: 8 }}
                    />
                )}
                <Typography variant="body2" sx={{ flexGrow: 1 }}>
                    {card.name}
                </Typography>
                {hovered && selected && (
                    <IconButton
                        onClick={handleDeleteCard}
                        size="small"
                        sx={{ ml: "auto", color: "error.main" }}
                    >
                        <CloseIcon fontSize="small" />
                    </IconButton>
                )}
            </Box>
        </Paper>
    );
};

export default CardItem;
