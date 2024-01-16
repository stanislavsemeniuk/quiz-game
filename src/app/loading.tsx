import { Box } from '@mui/material';
import Loading from '@/components/Loading';

export default function LoadingPage() {
  return (
    <Box
      position="fixed"
      left="0"
      top="0"
      width="100%"
      height="100%"
      display="flex"
      alignItems="center"
      justifyContent="center">
      <Loading />
    </Box>
  );
}
