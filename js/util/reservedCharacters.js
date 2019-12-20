const SPECIAL_CHARACTER_MATCHER = /[\[\]\|\;\@\#\=]/g;

export const containsReservedCharacter = hierarchyElement => {
  return SPECIAL_CHARACTER_MATCHER.test(hierarchyElement);
};

export const stripReservedCharacters = hierarchyElement => {
  return hierarchyElement.replace(SPECIAL_CHARACTER_MATCHER, '');
};
