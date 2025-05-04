/**
 * Calculate the points granted to users that pass a challenge.
 * @param usersCount Overall participant count
 * @param solvesCount Number of users that passed the challenge
 */
export const calculatePoints = (
  usersCount: number,
  solvesCount: number,
): number => {
  if (solvesCount === 0) return 500;
  if (solvesCount > usersCount)
    throw Error("solvesCount cannot be greater than usersCount");

  let multiplicator =
    (Math.E - Math.E ** 0.2) / (1 - Math.E ** -0.8 / usersCount);
  let granted_points =
    500 *
    (Math.log(Math.E - multiplicator * (solvesCount / usersCount)) +
      (1 - Math.log(Math.E - multiplicator / usersCount)));

  return Math.round(granted_points);
};
