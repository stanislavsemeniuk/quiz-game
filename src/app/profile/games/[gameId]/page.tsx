import { getGameData } from '@/firebase/db';

export default async function GameInformation({ params }: { params: { gameId: string } }) {
  const { result: gameData } = await getGameData(params.gameId);

  return <h1>{gameData?.score}</h1>;
}
