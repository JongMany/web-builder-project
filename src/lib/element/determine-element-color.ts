export const determineElementColor = (
  originStyle: Record<string, string>,
  isSelected: boolean,
  isHighlighted: boolean
) => {
  if (isSelected) {
    return {
      ...originStyle,
      borderColor: "blue",
      borderWidth: "2px",
    };
  }

  if (isHighlighted) {
    return {
      ...originStyle,
      borderColor: "yellow",
      borderWidth: "2px",
    };
  }

  return originStyle;
};
