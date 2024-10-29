export default function formatPlaceName(
  cityName: string | null | undefined
): string {
  if (!cityName) return '';

  // Replace both hyphens and underscores with spaces and handle multiple consecutive delimiters
  return cityName
    .replace(/[-_]+/g, ' ') // Replace one or more hyphens/underscores with a single space
    .trim() // Remove any leading/trailing spaces
    .split(' ') // Split on spaces
    .filter((word) => word.length > 0) // Remove empty strings
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Capitalize first letter, lowercase rest
    .join(' ');
}
