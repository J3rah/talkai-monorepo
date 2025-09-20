/**
 * Generates a unique session name based on the current date and time
 * @returns A formatted session name like "Session Jun 1, 2025 at 2:30 PM"
 */
export const generateSessionName = (): string => {
  const now = new Date();
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  };
  return `Session ${now.toLocaleDateString('en-US', options)}`;
};

/**
 * Generates a continuation session name based on the previous session title
 * @param previousTitle The title of the previous session
 * @returns A formatted continuation session name
 */
export const generateContinuationSessionName = (previousTitle: string): string => {
  // If the previous title already contains "Continuation", just add the new timestamp
  if (previousTitle.includes('Continuation')) {
    return `${previousTitle} → ${generateSessionName()}`;
  }
  return `Continuation of ${previousTitle}`;
}; 