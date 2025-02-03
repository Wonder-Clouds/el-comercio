import { format } from "date-fns";
import { toZonedTime } from "date-fns-tz";

export function getLocalDate(timeZone: string = "America/Mexico_City"): string {
  const now = new Date();
  const localDate = toZonedTime(now, timeZone);
  return format(localDate, "yyyy-MM-dd");
}