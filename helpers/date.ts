export const formatDate = (date: Date, includeTime = false): string => {
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: includeTime ? "numeric" : undefined,
    minute: includeTime ? "numeric" : undefined,
  });
};
