// Using the Date object's built-in methods
export function formatDate(timestamp: string) {
  const date = new Date(timestamp);
  return date.toLocaleDateString(); // outputs: 10/24/2024 (in US locale)
}

// Using Intl.DateTimeFormat for more control
export function formatDateIntl(timestamp: string) {
  const date = new Date(timestamp);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date); // outputs: October 24, 2024
}

// For a more concise format
export function formatDateShort(timestamp: string | null) {
  if (!timestamp) {
    return '';
  }

  const date = new Date(timestamp);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(date); // outputs: Oct 24, 2024
}

// Example usage:
const timestamp = '2024-10-24T04:05:00.312+00:00';

console.log(formatDate(timestamp)); // 10/24/2024
console.log(formatDateIntl(timestamp)); // October 24, 2024
console.log(formatDateShort(timestamp)); // Oct 24, 2024
