export function calculatePercentages(voteSums: number[]): number[] {
  const totalSum = voteSums.reduce((acc, value) => acc + value, 0);
  return voteSums.map((value) => {
    const percentage = totalSum ? (value / totalSum) * 100 : 0;
    return Math.round(percentage * 10) / 10;
  });
}

export function buildVoteSumData<T extends { id: string; selectionNumber: number; voteSum: number }>(
  candidates: T[],
) {
  const sorted = [...candidates].sort((a, b) => a.selectionNumber - b.selectionNumber);
  const sortBySum = [...sorted].sort((a, b) => b.voteSum - a.voteSum);
  const voteSums = sorted.map((item) => item.voteSum);
  const percentages = calculatePercentages(voteSums);

  return sorted.map((item) => {
    const isWinner = item.id === sortBySum[0]?.id;
    return {
      ...item,
      isWinner,
      percentage: percentages[item.selectionNumber - 1] ?? 0,
      selfAndWinOrSecondVote: isWinner
        ? {
            self: item.voteSum,
            second: sortBySum[1]?.voteSum ?? 0,
          }
        : {
            self: item.voteSum,
            win: sortBySum[0]?.voteSum ?? 0,
          },
    };
  });
}
