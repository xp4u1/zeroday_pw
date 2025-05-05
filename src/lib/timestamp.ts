import { DateTime } from "luxon";

/**
 * Luxon representation of the sqlite timestamp format.
 */
export const timestampFormat = "yyyy-MM-dd HH:mm:ss";

/**
 * Convert a JS date to the sqlite format:
 * `YYYY-MM-DD HH:MM:SS`
 * @param date Date you want to convert
 * @returns ISO-like string in UTC time
 */
export const toSqliteTimestamp = (date: Date): string => {
  return DateTime.fromJSDate(date).toUTC().toFormat(timestampFormat);
};

/**
 * Convert a sqlite timestamp (utc) to
 * a local timestamp with the same format:
 * `YYYY-MM-DD HH:MM:SS`
 */
export const fromSqliteTimestamp = (timestamp: string): string => {
  return DateTime.fromFormat(timestamp, timestampFormat, {
    zone: "utc",
  })
    .toLocal()
    .toFormat(timestampFormat);
};
