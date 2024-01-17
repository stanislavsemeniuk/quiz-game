import { Box } from '@mui/material';
import Loading from '@/components/Loading';

export default function LoadingPage() {
  return (
    <Box width="100%" flexGrow="1" display="flex" alignItems="center" justifyContent="center">
      <Loading />
    </Box>
  );
}
