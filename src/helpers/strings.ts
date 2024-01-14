export function rewriteCategory(category: string) {
  return capitalizeString(category.replaceAll('_', ' '));
}

export function capitalizeString(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
