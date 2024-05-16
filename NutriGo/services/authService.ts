import { User } from '../models/User';

export const registerUser = async (userData: User): Promise<User> => {
  console.log('Registering user:', userData);
  // Assume a POST request to your backend to save the user
  return userData;
};
