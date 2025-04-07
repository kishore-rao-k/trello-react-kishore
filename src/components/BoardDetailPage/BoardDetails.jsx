import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Typography, Box, CircularProgress, Paper, TextField, Button, IconButton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import CardItem from "./CardItem";

const apiKey = import.meta.env.VITE_TRELLO_API_KEY;
const apiToken = import.meta.env.VITE_TRELLO_API_TOKEN;

const BoardDetails = () => {
    const { boardId } = useParams();
    const [board, setBoard] = useState(null);
    const [lists, setLists] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeList, setActiveList] = useState(null);
    const [newCardText, setNewCardText] = useState("");
    const [showAddList, setShowAddList] = useState(false);
    const [newListName, setNewListName] = useState("");

    const fetchListsWithCards = async () => {
        try {
            const listsResponse = await axios.get(
                `https://api.trello.com/1/boards/${boardId}/lists`,
                {
                    params: {
                        key: apiKey,
                        token: apiToken,
                        sort: "pos",
                        cards: "all",
                        card_fields: "name,desc,due,idList,pos",
                        card_actions: "commentCard",
                        card_attachments: true,
                        card_attachment_fields: "name,url",
                        card_members: true,
                        card_member_fields: "username,fullName",
                        card_checkItemStates: true,
                        card_checklists: "all",
                        card_checklist_fields: "name,idCheckItems",
                        card_customFieldItems: true,
                    },
                }
            );

            const listsWithCards = listsResponse.data.map(list => ({
                ...list,
                cards: list.cards || []
            }));

            setLists(listsWithCards);
        } catch (err) {
            console.error("Error fetching lists and cards:", err);
            setError(err.response?.data?.message || err.message);
            throw err;
        }
    };

    useEffect(() => {
        const fetchBoardDetails = async () => {
            try {
                const boardResponse = await axios.get(
                    `https://api.trello.com/1/boards/${boardId}`,
                    {
                        params: {
                            key: apiKey,
                            token: apiToken,
                        }
                    }
                );
                setBoard(boardResponse.data);
                await fetchListsWithCards();
            } catch (err) {
                console.error("Error fetching data:", err);
                setError(err.response?.data?.message || err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchBoardDetails();
    }, [boardId]);

    const handleAddCardClick = (listId) => {
        setActiveList(listId);
        setNewCardText("");
    };

    const handleCloseInput = () => {
        setActiveList(null);
    };

    const handleAddCard = async (listId) => {
        if (!newCardText.trim()) return;

        try {
            const response = await axios.post(
                `https://api.trello.com/1/cards`,
                null,
                {
                    params: {
                        key: apiKey,
                        token: apiToken,
                        idList: listId,
                        name: newCardText
                    }
                }
            );
            
            setLists(prevLists => prevLists.map(list =>
                list.id === listId ? { ...list, cards: [...list.cards, response.data] } : list
            ));
        } catch (err) {
            console.error("Error adding card:", err);
            setError(err.response?.data?.message || err.message);
        }

        setActiveList(null);
        setNewCardText("");
    };

    const handleAddListClick = () => {
        setShowAddList(true);
        setNewListName("");
    };

    const handleCloseListInput = () => {
        setShowAddList(false);
    };

    const handleAddList = async () => {
        if (!newListName.trim()) return;
    
        try {
            const response = await axios.post(
                `https://api.trello.com/1/lists`,
                null,
                {
                    params: {
                        key: apiKey,
                        token: apiToken,
                        name: newListName,
                        idBoard: boardId,
                        pos: "bottom",
                    },
                }
            );
    
            setLists(prev => [...prev, { ...response.data, cards: [] }]);
        } catch (err) {
            console.error("Error adding list:", err);
            setError(err.response?.data?.message || err.message);
        }
    
        setShowAddList(false);
        setNewListName("");
    };
    
    const handleArchiveList = async (listId) => {
        try {
            await axios.put(
                `https://api.trello.com/1/lists/${listId}/closed`,
                null,
                {
                    params: {
                        key: apiKey,
                        token: apiToken,
                        value: true
                    }
                }
            );
    
            
            setLists(prev => prev.filter(list => list.id !== listId));
        } catch (err) {
            console.error("Error archiving list:", err);
            setError(err.response?.data?.message || err.message);
        }
    };

    if (loading) return <CircularProgress sx={{ display: "block", mx: "auto", my: 4 }} />;
    if (error) return <Typography color="error" sx={{ textAlign: "center", mt: 4 }}>Error: {error}</Typography>;

    return (
        <Box sx={{ p: 4 }}>
            <Typography variant="h4" gutterBottom>{board?.name}</Typography>
            <Typography variant="body1" gutterBottom>Board ID: {board?.id}</Typography>

            <Box sx={{ 
                display: "flex", 
                gap: 2, 
                flexWrap: "wrap", 
                mt: 4,
                alignItems: "flex-start"
            }}>
                {lists.map((list) => (
                    <Paper 
                        key={list.id} 
                        sx={{ 
                            p: 2, 
                            width: 300,
                            maxHeight: 500,
                            display: "flex",
                            flexDirection: "column",
                            overflow: "hidden"
                        }}
                    >
                        <Typography variant="h6" gutterBottom sx={{ flexShrink: 0 }}>
                            {list.name}
                        </Typography>
                        
                        <Box sx={{ 
                            flex: "1 1 auto",
                            overflowY: "auto",
                            mb: 2,
                            '&::-webkit-scrollbar': {
                                width: '6px',
                            },
                            '&::-webkit-scrollbar-thumb': {
                                backgroundColor: '#ddd',
                                borderRadius: '3px',
                            }
                        }}>
                            {list.cards.map((card) => (
                                <CardItem 
                                key={card.id} 
                                card={card} 
                                listId={list.id}
                                onDelete={(cardId) => {
                                    setLists((prevLists) =>
                                        prevLists.map((l) =>
                                            l.id === list.id
                                                ? { ...l, cards: l.cards.filter((c) => c.id !== cardId) }
                                                : l
                                        )
                                    );
                                }}
                            />
                            ))}
                        </Box>

                        <Box sx={{ flexShrink: 0 }}>
                            {activeList === list.id ? (
                                <>
                                    <TextField
                                        fullWidth
                                        placeholder="Enter card title..."
                                        variant="outlined"
                                        size="small"
                                        value={newCardText}
                                        onChange={(e) => setNewCardText(e.target.value)}
                                        sx={{ background: "#fff", mb: 1 }}
                                        autoFocus
                                    />
                                    <Box sx={{ display: "flex", alignItems: "center" }}>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={() => handleAddCard(list.id)}
                                            size="small"
                                        >
                                            Add card
                                        </Button>
                                        <IconButton 
                                            onClick={handleCloseInput} 
                                            size="small"
                                            sx={{ ml: 1 }}
                                        >
                                            <CloseIcon fontSize="small" />
                                        </IconButton>
                                    </Box>
                                </>
                            ) : (
                                <Button
                                    startIcon={<AddIcon />}
                                    onClick={() => handleAddCardClick(list.id)}
                                    sx={{ 
                                        textTransform: "none",
                                        justifyContent: "flex-start",
                                        color: "text.secondary",
                                        width: "100%"
                                    }}
                                >
                                    Add a card
                                </Button>
                            )}
                            <Button
        variant="text"
        color="error"
        size="small"
        onClick={() => handleArchiveList(list.id)}
        sx={{ mt: 1, textTransform: "none" }}
    >
        Archive list
    </Button>
                        </Box>
                    </Paper>
                ))}

                <Paper sx={{
                    p: 1,
                    width: 280,
                    backgroundColor: showAddList ? 'white' : '#f5f5f5',
                    borderRadius: 2,
                    boxShadow: 0,
                    '&:hover': {
                        backgroundColor: showAddList ? 'white' : '#ebebeb'
                    }
                }}>
                    {showAddList ? (
                        <>
                            <TextField
                                fullWidth
                                placeholder="Enter list title..."
                                variant="outlined"
                                size="small"
                                value={newListName}
                                onChange={(e) => setNewListName(e.target.value)}
                                sx={{ background: "#fff", mb: 1 }}
                                autoFocus
                            />
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleAddList}
                                    size="small"
                                >
                                    Add list
                                </Button>
                                <IconButton 
                                    onClick={handleCloseListInput} 
                                    size="small"
                                    sx={{ ml: 1 }}
                                >
                                    <CloseIcon fontSize="small" />
                                </IconButton>
                            </Box>
                        </>
                    ) : (
                        <Button
                            startIcon={<AddIcon />}
                            onClick={handleAddListClick}
                            sx={{ 
                                textTransform: "none",
                                justifyContent: "flex-start",
                                color: "text.secondary",
                                width: "100%",
                                fontSize: "0.9rem",
                                borderRadius: 2
                            }}
                        >
                            Add another list
                        </Button>
                    )}
                </Paper>
            </Box>
        </Box>
    );
};

export default BoardDetails;