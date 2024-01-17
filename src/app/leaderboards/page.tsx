import { Box, Typography } from '@mui/material';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';

import { getBestRecords } from '@/firebase/db';

export default async function Leaderboards() {
  const { result: easyModeRecords } = await getBestRecords('easy');
  const { result: mediumModeRecords } = await getBestRecords('medium');
  const { result: hardModeRecords } = await getBestRecords('hard');
  return (
    <Box width="80%" margin="0 auto">
      <Typography component="h1" fontSize="24px" marginBottom="32px">
        Leaderboards
      </Typography>
      <Box
        display="flex"
        flexDirection={{ xs: 'column', sm: 'row' }}
        gap={{ xs: '32px', sm: '0' }}
        justifyContent="space-around">
        <Box>
          <Typography component="h2" fontSize="18px" marginBottom="24px">
            Easy mode:
          </Typography>
          <Box display="flex" flexDirection="column" gap="16px">
            {easyModeRecords.map((record, index) => {
              return (
                <RecordElement key={index} userName={record.userName} record={record.record} />
              );
            })}
          </Box>
        </Box>
        <Box>
          <Typography component="h2" fontSize="18px" marginBottom="24px">
            Medium mode:
          </Typography>
          <Box display="flex" flexDirection="column" gap="16px">
            {mediumModeRecords.map((record, index) => {
              return (
                <RecordElement key={index} userName={record.userName} record={record.record} />
              );
            })}
          </Box>
        </Box>
        <Box>
          <Typography component="h2" fontSize="18px" marginBottom="24px">
            Hard mode:
          </Typography>
          <Box display="flex" flexDirection="column" gap="16px">
            {hardModeRecords.map((record, index) => {
              return (
                <RecordElement key={index} userName={record.userName} record={record.record} />
              );
            })}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

function RecordElement({ userName, record }: { userName: string; record: number }) {
  return (
    <Box display="flex" gap="16px">
      <Box display="flex" gap="4px">
        <AccountBoxIcon color="secondary" />
        <Typography>{userName}</Typography>
      </Box>
      <Box display="flex" gap="4px">
        <EmojiEventsIcon color="secondary" />
        <Typography>{record}</Typography>
      </Box>
    </Box>
  );
}
