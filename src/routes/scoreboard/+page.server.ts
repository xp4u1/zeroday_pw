import { db } from "$lib/server/db";
import { users, solves, challenges } from "$lib/server/db/schema";
import { timestampFormat } from "$lib/timestamp";
import { desc, eq, inArray } from "drizzle-orm";
import { DateTime } from "luxon";

interface DataPoint {
  timestamp: string;
  points: number;
}

interface User {
  id: string;
  name: string;
}

/**
 * Search all solves for a list of users and create a time series
 * with cumulative points after each solve.
 * @param users List of users to include in the data set
 * @returns Data series mapped by its corresponding user
 */
async function createDataSeries(users: User[]) {
  const solvesData = await db
    .select({
      userId: solves.userId,
      timestamp: solves.timestamp,
      points: challenges.points,
    })
    .from(solves)
    .innerJoin(challenges, eq(solves.challengeId, challenges.id))
    .where(
      inArray(
        solves.userId,
        users.map((user) => user.id),
      ),
    );

  const dataSet = new Map<string, DataPoint[]>();

  for (const { id: userId } of users) {
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

  return dataSet;
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
  const dataSet = await createDataSeries(top5);

  return {
    participants: participants
      .entries()
      .map(([index, participant]) => ({
        placement: index + 1,
        ...participant,
      }))
      .toArray(),
    series: top5.map((user) => ({
      name: user.name,
      data: dataSet.get(user.id)?.map(({ timestamp, points }) => ({
        x: timestamp,
        y: points,
      })),
    })),
  };
}
