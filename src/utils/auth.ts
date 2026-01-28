export const isUserAdmin = (): boolean => {
  const authorities = localStorage.getItem('authorities') || '';
  return authorities
    .split(',')
    .map((role) => role.trim())
    .includes('ROLE_ADMIN');
};

export const isAuth = (): boolean => {
  const accessToken = localStorage.getItem('accessToken');
  return !!accessToken;
};
