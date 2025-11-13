import { format, isToday, isYesterday, differenceInDays } from "date-fns";

export const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;

  const now = new Date();
  const diffDays = differenceInDays(now, date);

  if (isToday(date)) {
    return `today at ${format(date, "HH:mm")}`;
  }

  if (isYesterday(date)) {
    return `yesterday at ${format(date, "HH:mm")}`;
  }

  if (diffDays < 7) {
    return `${diffDays} days ago`;
  }

  if (date.getFullYear() === now.getFullYear()) {
    return format(date, "MMM dd");
  }

  return format(date, "MMM dd, yyyy");
};
