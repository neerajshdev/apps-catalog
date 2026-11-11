const MONTH_YEAR_FORMATTER = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  year: 'numeric',
  timeZone: 'UTC',
});

/**
 * Formats an ISO date (`YYYY-MM-DD`) as `Oct 2026`.
 * UTC is pinned so server and client output never disagree.
 */
export function formatMonthYear(isoDate: string): string {
  const date = new Date(`${isoDate}T00:00:00Z`);

  if (Number.isNaN(date.getTime())) {
    return isoDate;
  }

  return MONTH_YEAR_FORMATTER.format(date);
}
