
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Button,
  Divider,
  CircularProgress,
} from "@mui/material";

const apiKey = import.meta.env.VITE_TRELLO_API_KEY;
const apiToken = import.meta.env.VITE_TRELLO_API_TOKEN;

const CardDetails = () => {
  const { cardId } = useParams();
  const [card, setCard] = useState(null);
  const [checklists, setChecklists] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCard = async () => {
      try {
        const res = await axios.get(`https://api.trello.com/1/cards/${cardId}`, {
          params: { key: apiKey, token: apiToken },
        });
        setCard(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching card:", err);
        setLoading(false);
      }
    };

    const fetchChecklists = async () => {
      try {
        const res = await axios.get(
          `https://api.trello.com/1/cards/${cardId}/checklists`,
          {
            params: { key: apiKey, token: apiToken },
          }
        );
        setChecklists(res.data);
      } catch (err) {
        console.error("Error fetching checklists:", err);
      }
    };

    fetchCard();
    fetchChecklists();
  }, [cardId]);

  const handleCreateChecklist = async () => {
    try {
      const response = await axios.post(
        `https://api.trello.com/1/cards/${cardId}/checklists`,
        null,
        {
          params: {
            key: apiKey,
            token: apiToken,
            name: `Checklist ${Date.now()}`,
          },
        }
      );
      setChecklists((prev) => [...prev, response.data]);
    } catch (err) {
      console.error("Failed to create checklist:", err);
    }
  };

  if (loading) {
    return <CircularProgress sx={{ m: 4 }} />;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        {card?.name}
      </Typography>
      <Button variant="contained" onClick={handleCreateChecklist}>
        Create Checklist
      </Button>

      {checklists.map((checklist) => (
        <Box key={checklist.id} sx={{ mt: 3 }}>
          <Typography variant="subtitle1">{checklist.name}</Typography>
          <Typography variant="caption">{checklist.checkItems.length} items</Typography>
          <Divider sx={{ my: 1 }} />
        </Box>
      ))}
    </Box>
  );
};

export default CardDetails;
