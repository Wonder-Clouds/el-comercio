import { format, addDays } from "date-fns";
import { toZonedTime } from "date-fns-tz";

export function getLocalDate(daysToAdd: number = 0, timeZone: string = "America/Lima"): string {
  const now = new Date();
  const localDate = toZonedTime(now, timeZone);
  const dateWithAddedDays = addDays(localDate, daysToAdd);
  return format(dateWithAddedDays, "yyyy-MM-dd");
}