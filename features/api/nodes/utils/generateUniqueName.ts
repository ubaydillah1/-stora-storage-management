export const generateUniqueName = (
  baseName: string,
  existingNames: string[]
) => {
  if (!existingNames.includes(baseName)) return baseName;

  let max = 0;

  const regex = new RegExp(`^${baseName} copy(?: (\\d+))?$`);

  for (const name of existingNames) {
    const match = name.match(regex);
    if (match) {
      const num = match[1] ? parseInt(match[1], 10) : 0;
      if (num > max) max = num;
    }
  }

  if (max === 0) return `${baseName} copy`;

  return `${baseName} copy ${max + 1}`;
};
