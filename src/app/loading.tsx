import { Box } from '@mui/material';
import Loading from '@/components/Loading';

export default function LoadingPage() {
  return (
    <Box width="100%" height="100%" display="flex" alignItems="center" justifyContent="center">
      <Loading />
    </Box>
  );
}
