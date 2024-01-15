'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Typography, TextField, Button } from '@mui/material';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import CategoryIcon from '@mui/icons-material/Category';
import SpeedIcon from '@mui/icons-material/Speed';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import LinkIcon from '@mui/icons-material/Link';

import { getUserData, changeUserName, getUserGames, getUnfinishedUserGames } from '@/firebase/db';
import { useAuthContext } from '@/context/AuthContext';
import { useNotificationContext } from '@/context/NotificationContext';
import type { User, Game } from '@/firebase/db';
import { capitalizeString, rewriteCategory } from '@/helpers/strings';
import Link from 'next/link';

interface UserGames extends Game {
  id: string;
}

export default function Profile() {
  const { user } = useAuthContext();
  const { enableNotification } = useNotificationContext();
  const router = useRouter();
  const [data, setData] = useState<User | null>(null);
  const [userName, setUserName] = useState('');
  const [allGames, setGames] = useState<UserGames[]>([]);
  const [unfinishedGames, setUnfinishedGames] = useState<UserGames[]>([]);

  useEffect(() => {
    if (user === null) router.push('/');
    async function fetchData() {
      if (user) {
        const { result: userData, error }: { result: User | null; error: string | null } =
          await getUserData(user.uid);
        if (!error && userData) {
          setData(userData);
          setUserName(userData.userName);
        } else {
          enableNotification({ type: 'error', message: error || 'Error' });
        }
      }
    }
    async function fetchAllGames() {
      if (user) {
        const { result: games, error }: { result: UserGames[] | null; error: string | null } =
          await getUserGames(user.uid);
        if (!error && games) setGames(games);
        else enableNotification({ type: 'error', message: error || 'Error' });
      }
    }
    async function fetchUnfinishedGames() {
      if (user) {
        const { result: games, error }: { result: UserGames[] | null; error: string | null } =
          await getUnfinishedUserGames(user.uid);
        if (!error && games) setUnfinishedGames(games);
        else enableNotification({ type: 'error', message: error || 'Error' });
      }
    }
    fetchAllGames();
    fetchUnfinishedGames();
    fetchData();
  }, [user, router, enableNotification]);

  async function handleForm(e: any) {
    e.preventDefault();
    if (user) {
      const { result, error } = await changeUserName(user?.uid, userName);
      if (!error)
        enableNotification({ type: 'success', message: 'Successfully updated username!' });
      else enableNotification({ type: 'error', message: error || 'Error' });
    }
  }

  return (
    <Box width="80%" margin="0 auto">
      <Typography component="h1" fontSize="24px">
        Your profile
      </Typography>
      {data ? (
        <>
          <Box
            component="form"
            onSubmit={handleForm}
            margin="16px 0"
            minWidth="450px"
            width="fit-content"
            paddingBottom="16px"
            borderBottom="1px solid #9c27b0">
            <Typography component="h2" fontSize="18px">
              User name & email
            </Typography>
            <Box display="flex" gap="16px" margin="16px 0">
              <TextField color="secondary" label="Email" disabled value={user?.email || ''} />
              <TextField
                color="secondary"
                label="Username"
                onChange={(e) => setUserName(e.target.value)}
                value={userName}
              />
            </Box>
            <Button
              variant="contained"
              color="secondary"
              size="small"
              type="submit"
              sx={{ textTransform: 'capitalize' }}>
              Save changes
            </Button>
          </Box>
          <Box
            margin="16px 0"
            minWidth="450px"
            width="fit-content"
            paddingBottom="16px"
            borderBottom="1px solid #9c27b0">
            <Typography component="h2" fontSize="18px">
              User records:
            </Typography>
            <Box display="flex" gap="32px" margin="16px 0">
              <DifficultyRecord difficulty="easy" record={data.easyModeRecord} />
              <DifficultyRecord difficulty="medium" record={data.mediumModeRecord} />
              <DifficultyRecord difficulty="hard" record={data.hardModeRecord} />
            </Box>
          </Box>
          {unfinishedGames.length > 0 ? (
            <Box
              margin="16px 0"
              minWidth="450px"
              width="fit-content"
              paddingBottom="16px"
              borderBottom="1px solid #9c27b0">
              <Typography component="h2" fontSize="18px">
                Unfinished games:
              </Typography>
              <Box margin="16px 0" display="flex" flexDirection="column" gap="16px">
                {unfinishedGames.map((el, index) => {
                  return (
                    <ShortGameInfo
                      id={el.id}
                      key={index}
                      difficulty={el.difficulty}
                      category={el.category}
                      score={el.score}
                      isFinished={el.isGameOver}
                    />
                  );
                })}
              </Box>
            </Box>
          ) : (
            ''
          )}
          {allGames.length > 0 ? (
            <Box
              margin="16px 0"
              minWidth="450px"
              width="fit-content"
              paddingBottom="16px"
              borderBottom="1px solid #9c27b0">
              <Typography component="h2" fontSize="18px">
                All games:
              </Typography>
              <Box margin="16px 0" display="flex" flexDirection="column" gap="16px">
                {allGames.map((el, index) => {
                  return (
                    <ShortGameInfo
                      key={index}
                      id={el.id}
                      difficulty={el.difficulty}
                      category={el.category}
                      score={el.score}
                      isFinished={el.isGameOver}
                    />
                  );
                })}
              </Box>
            </Box>
          ) : (
            ''
          )}
        </>
      ) : (
        <Typography>Loading...</Typography>
      )}
    </Box>
  );
}

function DifficultyRecord({
  difficulty,
  record,
}: {
  difficulty: 'easy' | 'medium' | 'hard';
  record: number;
}) {
  return (
    <Box>
      <Box display="flex" gap="8px" alignItems="center" fontSize="24px">
        <EmojiEventsIcon color="secondary" />
        <Typography>{record}</Typography>
      </Box>
      <Typography>{capitalizeString(difficulty)}</Typography>
    </Box>
  );
}

function ShortGameInfo({
  id,
  difficulty,
  category,
  score,
  isFinished,
}: {
  id: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  score: number;
  isFinished: boolean;
}) {
  return (
    <Box display="grid" gridTemplateColumns="0.5fr 1fr 2fr 0.5fr ">
      <Link href={isFinished ? `/profile/games/${id}` : `/game/${id}`}>
        {isFinished ? <LinkIcon color="secondary" /> : <PlayArrowIcon color="secondary" />}
      </Link>
      <Box display="flex" gap="8px">
        <SpeedIcon color="secondary" />
        <Typography>{capitalizeString(difficulty)}</Typography>
      </Box>
      <Box display="flex" gap="8px">
        <CategoryIcon color="secondary" /> <Typography>{rewriteCategory(category)}</Typography>
      </Box>
      <Box display="flex" gap="8px">
        <EmojiEventsIcon color="secondary" />
        <Typography>{score}</Typography>
      </Box>
    </Box>
  );
}
