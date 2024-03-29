export const delay = (duration: number) =>
  new Promise((reslove) => {
    {
      setTimeout(() => {
        reslove(1);
      }, duration);
    }
  });
