export const setCookie = (name: string, value: unknown, days: number = 1) => {
  let expires = '';
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = '; expires=' + date.toUTCString();
  }
  document.cookie = name + '=' + (value || '') + expires + '; path=/';
};

export const getCookieByName = (name: string) => {
  const pairs = document.cookie.split('; ');

  const cookie = pairs.find((cookie) => cookie.startsWith(name + '='));

  if (cookie) {
    return cookie.split('=')[1];
  }

  return undefined;
};
