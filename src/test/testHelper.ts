export const randomInteger = (max?: number): number => {
  return Math.round(Math.random() * (max ?? 10000));
};

export const randomString = (): string => {
  return Math.random().toString(36).substring(2, 7);
};
