export interface User {
  id: string;
  email: string;
  password: string;
  image?: string; 
  age: number;
  height: number;
  weight: number;
  activityLevel: 'low' | 'medium' | 'high' | undefined; // Allow undefined
  goal: 'weight_loss' | 'muscle_gain' | 'maintenance' | undefined; // Allow undefined
  name: string;
  gender: 'male' | 'female' | 'other';
}
