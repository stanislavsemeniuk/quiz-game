import { Box, Typography, Button } from '@mui/material';
import CategoryIcon from '@mui/icons-material/Category';
import SpeedIcon from '@mui/icons-material/Speed';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';

import { getGameData } from '@/firebase/db';
import { rewriteCategory } from '@/helpers/strings';

export default async function GameInformation({ params }: { params: { gameId: string } }) {
  const { result: gameData } = await getGameData(params.gameId);

  return (
    <Box width="80%" margin="0 auto">
      {gameData ? (
        <>
          <Typography component="h1" fontSize="24px">
            Game information:
          </Typography>
          <Box display="flex" gap="16px" margin="16px 0">
            <Box display="flex" gap="8px">
              <SpeedIcon color="secondary" />
              <Typography>{rewriteCategory(gameData?.difficulty)}</Typography>
            </Box>
            <Box display="flex" gap="8px">
              <CategoryIcon color="secondary" />
              <Typography>{rewriteCategory(gameData?.category)}</Typography>
            </Box>
            <Box display="flex" gap="8px">
              <EmojiEventsIcon color="secondary" />
              <Typography>{gameData?.score}</Typography>
            </Box>
          </Box>
          <Typography component="h1" fontSize="24px">
            Asked questions:
          </Typography>
          <Box margin="16px 0" display="flex" flexDirection="column" gap="32px">
            {gameData.questions.map((question, index) => {
              return (
                <AskedQuestionInformation
                  key={index}
                  question={question.question}
                  userAnswer={question.userAnswer}
                  correctAnswer={question.correctAnswer}
                />
              );
            })}
          </Box>
        </>
      ) : (
        ''
      )}
    </Box>
  );
}

function AskedQuestionInformation({
  question,
  userAnswer,
  correctAnswer,
}: {
  question: string;
  userAnswer: string;
  correctAnswer: string;
}) {
  return (
    <Box
      display="flex"
      flexDirection="column"
      gap="8px"
      padding="16px 0"
      borderBottom="1px solid #9c27b0">
      <Typography fontSize="18px">{question}</Typography>

      <Box display="flex" gap="32px">
        <Box display="flex" flexDirection="column" gap="8px">
          <Typography fontSize="14px">Correct answer:</Typography>
          <Button
            variant="contained"
            color="success"
            sx={{ textTransform: 'capitalize', width: 'fit-content' }}
            size="small">
            {correctAnswer}
          </Button>
        </Box>
        <Box display="flex" flexDirection="column" gap="8px">
          <Typography fontSize="14px">Your answer:</Typography>
          <Button
            variant="contained"
            color={correctAnswer === userAnswer ? 'success' : 'error'}
            sx={{ textTransform: 'capitalize', width: 'fit-content' }}
            size="small">
            {userAnswer}
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
