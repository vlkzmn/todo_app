import { User } from '../types/User';

export function getUser(): User {
  const data = localStorage.getItem('user');
  const defaultData = {
    id: 0,
  };

  if (data === null) {
    return defaultData;
  }

  try {
    return JSON.parse(data);
  } catch {
    return defaultData;
  }
}
