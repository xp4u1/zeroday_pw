import { db } from "$lib/server/db";
import { users, solves, challenges } from "$lib/server/db/schema";
import { timestampFormat } from "$lib/timestamp";
import { desc, eq, inArray } from "drizzle-orm";
import { DateTime } from "luxon";

interface DataPoint {
  timestamp: string;
  points: number;
}

export async function load() {
  const participants = await db
    .select({
      id: users.id,
      name: users.name,
      points: users.points,
    })
    .from(users)
    .orderBy(desc(users.points));

  const top5 = participants.slice(0, 5);
  const top5Ids = top5.map((user) => user.id);

  const solvesData = await db
    .select({
      userId: solves.userId,
      timestamp: solves.timestamp,
      points: challenges.points,
    })
    .from(solves)
    .innerJoin(challenges, eq(solves.challengeId, challenges.id))
    .where(inArray(solves.userId, top5Ids));

  const dataSet = new Map<string, DataPoint[]>();

  for (const { id: userId } of top5) {
    const solvesForUser = solvesData
      .filter((solve) => solve.userId === userId && solve.timestamp !== null)
      .sort(
        (a, b) =>
          DateTime.fromFormat(a.timestamp!, timestampFormat).toMillis() -
          DateTime.fromFormat(b.timestamp!, timestampFormat).toMillis(),
      );

    let cumulativePoints = 0;

    const timeSeries = solvesForUser.map(({ timestamp, points }) => {
      cumulativePoints += points;

      return {
        timestamp: DateTime.fromFormat(timestamp!, timestampFormat).toISO()!,
        points: cumulativePoints,
      };
    });

    dataSet.set(userId, timeSeries);
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
    dataSet: dataSet,
  };
}
