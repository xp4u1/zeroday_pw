import { db } from "$lib/server/db";
import { users, solves, challenges } from "$lib/server/db/schema";
import { timestampFormat } from "$lib/timestamp";
import { desc, eq, inArray } from "drizzle-orm";
import { DateTime } from "luxon";


export async function load() {
  const participants = await db
    .select({
      name: users.name,
      points: users.points,
    })
    .from(users)
    .orderBy(desc(users.points));

  const top5 = await db
    .select({
      name: users.name,
      id: users.id,
    })
    .from(users)
    .orderBy(desc(users.points))
    .limit(5);

  const userIds = top5.map((u) => u.id);

  const penis = await db
    .select({
      userId: solves.userId,
      timestamp: solves.timestamp,
      pointsChallenge: challenges.points,
      points: challenges.points,
    })
    .from(solves)
    .innerJoin(challenges, eq(solves.challengeId, challenges.id))
    .where(inArray(solves.userId, userIds));
  
  const userSolvesMap = new Map<string, { x: string; y: number }[]>();

    for (const { id: userId } of top5) {
      const solvesForUser = penis
        .filter((solve) => solve.userId === userId && solve.timestamp !== null)
        .sort((a, b) =>
          DateTime.fromFormat(a.timestamp!, timestampFormat).toMillis() -
          DateTime.fromFormat(b.timestamp!, timestampFormat).toMillis()
        );
    
      let cumulativePoints = 0;
    
      const timeSeries = solvesForUser.map(({ timestamp, points }) => {
        cumulativePoints += points;
        return {
          x: DateTime.fromFormat(timestamp!, timestampFormat).toISO()!,
          y: cumulativePoints,
        };
      });
    
      userSolvesMap.set(userId, timeSeries);
    }
    

  return {
    participants: participants
      .entries()
      .map(([index, participant]) => ({
        placement: index + 1,
        ...participant,
      }))
      .toArray(),
    top5: top5,
    userIds: userIds,
    dataSet: userSolvesMap,
    penis: penis,
  };
}
