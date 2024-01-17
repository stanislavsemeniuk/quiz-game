'use client';

import { useState, useEffect } from 'react';
import { Box, Button, FormControl, Select, MenuItem, InputLabel } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { useRouter } from 'next/navigation';

import { getCategoriesForAGame, getDifficultiesForAGame } from '@/helpers/questions';
import { useAuthContext } from '@/context/AuthContext';
import { useNotificationContext } from '@/context/NotificationContext';
import { createGame } from '@/firebase/db';
import { rewriteCategory, capitalizeString } from '@/helpers/strings';

export default function Game() {
  const [difficulties, setDifficulties] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);

  const [chosenDifficulty, setDifficulty] = useState('');
  const [chosenCategory, setCategory] = useState('');

  const router = useRouter();
  const { user } = useAuthContext();
  const { enableNotification } = useNotificationContext();

  useEffect(() => {
    if (user === null) router.push('/');
  }, [user]);

  useEffect(() => {
    async function fetchData() {
      const categoriesData = await getCategoriesForAGame();
      const difficultiesData = await getDifficultiesForAGame();
      setCategories(categoriesData);
      setDifficulties(difficultiesData);
      setCategory(categoriesData[0]);
      setDifficulty(difficultiesData[0]);
    }
    fetchData();
  }, []);

  async function startNewGame() {
    if (user) {
      const { result: gameInfo, error } = await createGame(
        user.uid,
        chosenCategory,
        chosenDifficulty,
      );
      if (!error && gameInfo) router.push(`/game/${gameInfo?.id}`);
      else enableNotification({ type: 'error', message: error || 'Error' });
    }
  }

  return (
    <Box display="flex" flexDirection="column" gap="24px" minWidth="400px" alignItems="center">
      <Button
        sx={{ width: 'fit-content' }}
        onClick={() => startNewGame()}
        variant="contained"
        color="secondary">
        <PlayArrowIcon />
      </Button>
      <FormControl fullWidth>
        <InputLabel id="difficulty-label">Difficulty</InputLabel>
        <Select
          color="secondary"
          variant="filled"
          labelId="difficulty-label"
          id="demo-simple-select"
          value={chosenDifficulty || ''}
          label="Difficulty"
          onChange={(e) => setDifficulty(e.target.value)}>
          {difficulties.map((difficulty, index) => (
            <MenuItem key={index} value={difficulty}>
              {capitalizeString(difficulty)}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl fullWidth>
        <InputLabel id="category-label">Category</InputLabel>
        <Select
          color="secondary"
          variant="filled"
          labelId="category-label"
          id="demo-simple-select"
          value={chosenCategory || ''}
          label="Category"
          onChange={(e) => setCategory(e.target.value)}>
          {categories.map((category, index) => (
            <MenuItem key={index} value={category}>
              {rewriteCategory(category)}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}
