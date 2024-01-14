'use client';

import { useEffect, useState } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useRouter } from 'next/navigation';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import CategoryIcon from '@mui/icons-material/Category';
import SpeedIcon from '@mui/icons-material/Speed';
import CloseIcon from '@mui/icons-material/Close';

import GameOver from '@/components/GameOver';
import Loading from '@/components/Loading';
import { getGameData, answerQuestion, createNewQuestion } from '@/firebase/db';
import { rewriteCategory } from '@/helpers/strings';
import { useAuthContext } from '@/context/AuthContext';
import { useNotificationContext } from '@/context/NotificationContext';
import type { Game, Question } from '@/firebase/db';

type Option = {
  answer: string;
  color: 'secondary' | 'success' | 'error';
};

export default function Game({ params }: { params: { gameId: string } }) {
  const [data, setData] = useState<Game | null>(null);
  const [amount, setAmount] = useState(0);
  const [question, setQuestion] = useState<Question | null>(null);
  const [options, setOptions] = useState<Option[] | null>(null);
  const [isOptionsDisabled, setIsOptionsDisabled] = useState(false);

  const router = useRouter();
  const { user } = useAuthContext();
  const { enableNotification } = useNotificationContext();

  useEffect(() => {
    if (data && user && user.uid !== data?.user) router.push('/');
  }, [user, data, router]);

  useEffect(() => {
    async function fetchData() {
      const { result: gameData, error }: { result: Game | null; error: string | null } =
        await getGameData(params.gameId);
      if (!error && gameData) setData(gameData);
      else enableNotification({ type: 'error', message: error || 'Error' });
    }
    fetchData();
  }, [params.gameId, amount, enableNotification]);

  useEffect(() => {
    async function fetchQuestion() {
      setQuestion(null);
      if (data) {
        if (!data.currentQuestion) {
          const { result: questionData, error } = await createNewQuestion(
            params.gameId,
            data?.category,
            data?.difficulty,
          );
          if (!error && questionData) {
            setQuestion(questionData);
            setIsOptionsDisabled(false);
            createOptions(questionData?.options);
          } else enableNotification({ type: 'error', message: error || 'Error' });
        } else {
          setQuestion(data.currentQuestion);
          setIsOptionsDisabled(false);
          createOptions(data.currentQuestion.options);
        }
      }
    }
    fetchQuestion();
  }, [params.gameId, data, enableNotification]);

  function createOptions(data: string[]) {
    const newOptions: Option[] = data.map((el) => {
      return {
        answer: el,
        color: 'secondary',
      };
    });
    setOptions(newOptions);
  }

  function changeOptionsColors(userAnswer: string, rightAnswer: string) {
    if (options) {
      const newOptions: Option[] = options.map((el) => {
        return {
          ...el,
          color:
            rightAnswer === el.answer
              ? 'success'
              : userAnswer === el.answer
              ? 'error'
              : 'secondary',
        };
      });
      setOptions(newOptions);
    }
  }

  async function handleAnswer(answer: string) {
    if (question) {
      setIsOptionsDisabled(true);
      const { result: questionData, error } = await answerQuestion(
        params.gameId,
        answer,
        question.id,
      );
      if (!error && questionData) {
        changeOptionsColors(answer, questionData.correctAnswer);
        setTimeout(() => {
          setAmount(amount + 1);
        }, 1000);
      } else enableNotification({ type: 'error', message: error || 'Error' });
    }
  }

  return (
    <Box
      height="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center">
      {data ? (
        !data.isGameOver ? (
          <>
            {question ? (
              <Box minWidth="600px" maxWidth="800px">
                <Box
                  boxSizing="border-box"
                  marginBottom="16px"
                  padding="16px 32px"
                  borderRadius="16px"
                  color="#fff"
                  sx={{ background: '#9c27b0' }}>
                  <Typography fontSize={'18px'}>{question?.question}</Typography>
                </Box>
                <Box display="grid" gridTemplateColumns="1fr 1fr" gap="16px">
                  {options?.map((el, index) => {
                    return (
                      <Button
                        sx={{
                          '&.Mui-disabled': {
                            backgroundColor:
                              el.color === 'secondary'
                                ? '#eaeaea'
                                : el.color === 'success'
                                ? 'green'
                                : 'red',
                            color: '#fff',
                          },
                          textTransform: 'capitalize',
                        }}
                        color={el.color}
                        variant="contained"
                        disabled={isOptionsDisabled}
                        onClick={() => handleAnswer(el.answer)}
                        key={index}>
                        {el.answer}
                      </Button>
                    );
                  })}
                </Box>
              </Box>
            ) : (
              <Loading />
            )}
            <Box display="flex" justifyContent="space-between" marginTop="24px" minWidth="400px">
              <Box display="flex" flexDirection="column" gap="8px">
                <Box display="flex" gap="8px">
                  <EmojiEventsIcon color="secondary" />
                  <Typography>{data.score}</Typography>
                </Box>
                <Box display="flex" gap="8px">
                  <CloseIcon color="secondary" />
                  <Typography> {data.mistakes}</Typography>
                </Box>
              </Box>
              <Box display="flex" flexDirection="column" gap="8px">
                <Box display="flex" gap="8px">
                  <SpeedIcon color="secondary" />
                  <Typography>{rewriteCategory(data.difficulty)}</Typography>
                </Box>
                <Box display="flex" gap="8px">
                  <CategoryIcon color="secondary" />
                  <Typography>{rewriteCategory(data.category)}</Typography>
                </Box>
              </Box>
            </Box>
          </>
        ) : (
          <GameOver score={data.score} category={data.category} difficulty={data.difficulty} />
        )
      ) : (
        <Loading />
      )}
    </Box>
  );
}
