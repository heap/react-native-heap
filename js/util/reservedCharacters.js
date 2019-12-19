export const stripReservedCharacters = (hierarchyElement) => {
  return hierarchyElement.replace(/[\[\]\|\;\@\#\=]/g, '');
}
