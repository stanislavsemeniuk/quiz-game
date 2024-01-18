'use server';

import { revalidatePath } from 'next/cache';

export async function revalidateProfilePage() {
  revalidatePath('/profile');
}

export async function revalidateLeaderboardsPage() {
  revalidatePath('/leaderboards');
}

export async function revalidateGameInformation(gameId: string) {
  revalidatePath(`/game/${gameId}`);
}

export async function revalidateFinsihedGameInfo(gameId: string) {
  revalidatePath(`/profile/games/${gameId}`);
}
