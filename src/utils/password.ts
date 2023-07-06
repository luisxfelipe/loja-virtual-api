import { hash, compare } from 'bcrypt';

export const createPasswordHash = async (password: string): Promise<string> => {
  return hash(password, 10);
};

export const comparePassword = async (
  password: string,
  passwordHashed: string,
): Promise<boolean> => {
  return compare(password, passwordHashed);
};
