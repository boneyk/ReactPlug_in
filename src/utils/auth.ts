export const isUserAdmin = (): boolean => {
  const authorities = localStorage.getItem('authorities') || '';
  return authorities
    .split(',')
    .map((role) => role.trim())
    .includes('ROLE_ADMIN');
};
