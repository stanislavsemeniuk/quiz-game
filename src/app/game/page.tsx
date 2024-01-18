'use client';

import { useState, useEffect } from 'react';
import { Box, Button, FormControl, Select, MenuItem, InputLabel, Typography } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { useRouter } from 'next/navigation';

import { getCategoriesForAGame, getDifficultiesForAGame } from '@/helpers/questions';
import { useAuthContext } from '@/context/AuthContext';
import { useNotificationContext } from '@/context/NotificationContext';
import { createGame } from '@/firebase/db';
import { rewriteCategory, capitalizeString } from '@/helpers/strings';
import { useForm, Controller } from 'react-hook-form';
import Loading from '@/components/Loading';

type FormSelects = {
  difficulty: string;
  category: string;
};

export default function Game() {
  const [difficulties, setDifficulties] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);

  const router = useRouter();
  const { user } = useAuthContext();
  const { enableNotification } = useNotificationContext();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<FormSelects>();

  useEffect(() => {
    if (user === null) router.push('/');
  }, [user]);

  useEffect(() => {
    async function fetchData() {
      const categoriesData = await getCategoriesForAGame();
      const difficultiesData = await getDifficultiesForAGame();
      setCategories(categoriesData);
      setDifficulties(difficultiesData);
    }
    fetchData();
  }, []);

  async function startNewGame(data: FormSelects) {
    if (user) {
      const { result: gameInfo, error } = await createGame(
        user.uid,
        data.category,
        data.difficulty,
      );
      if (!error && gameInfo) router.push(`/game/${gameInfo?.id}`);
      else enableNotification({ type: 'error', message: error || 'Error' });
    }
  }

  return (
    <Box
      onSubmit={handleSubmit(startNewGame)}
      display="flex"
      component="form"
      flexDirection="column"
      gap="24px"
      minWidth={{ xs: '250px', sm: '400px' }}
      alignItems="center">
      <Button
        disabled={isSubmitting}
        type="submit"
        sx={{ width: 'fit-content' }}
        variant="contained"
        color="secondary">
        <PlayArrowIcon />
      </Button>
      <FormControl fullWidth>
        <InputLabel id="difficulty-label">Difficulty</InputLabel>
        <Controller
          name="difficulty"
          defaultValue=""
          control={control}
          rules={{ required: 'Difficulty is required' }}
          render={({ field }) => (
            <Select
              {...field}
              color="secondary"
              variant="filled"
              labelId="difficulty-label"
              label="Difficulty">
              {difficulties.map((difficulty, index) => (
                <MenuItem key={index} value={difficulty}>
                  {capitalizeString(difficulty)}
                </MenuItem>
              ))}
            </Select>
          )}
        />
        {errors.difficulty && (
          <Typography color="red" margin="0 4px" fontSize="12px">
            {errors.difficulty.message}
          </Typography>
        )}
      </FormControl>
      <FormControl fullWidth>
        <InputLabel id="category-label">Category</InputLabel>
        <Controller
          name="category"
          defaultValue=""
          control={control}
          rules={{ required: 'Category is required' }}
          render={({ field }) => (
            <Select
              {...field}
              color="secondary"
              variant="filled"
              labelId="category-label"
              label="Category">
              {categories.map((category, index) => (
                <MenuItem key={index} value={category}>
                  {rewriteCategory(category)}
                </MenuItem>
              ))}
            </Select>
          )}
        />
        {errors.category && (
          <Typography color="red" margin="0 4px" fontSize="12px">
            {errors.category.message}
          </Typography>
        )}
      </FormControl>
    </Box>
  );
}
