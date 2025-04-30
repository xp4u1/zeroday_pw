/**
 * Calculate the points granted to participants that pass a challenge.
 * @param participantCount Overall participant count
 * @param participantPassed Number of participants that past the challenge
 */
export const calculatePoints = (participantCount: number, participantPassed: number): number => {
  let multiplicator =
    (Math.E - Math.E ** 0.2) / (1 - Math.E ** -0.8 / participantCount);
  let granted_points =
    500 *
    (Math.log(Math.E - multiplicator * (participantPassed / participantCount)) +
      (1 - Math.log(Math.E - multiplicator / participantCount)));
  return Math.trunc(granted_points);
};
