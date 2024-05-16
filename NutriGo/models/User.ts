export interface User {
    id: string;
    email: string;
    name: string;
    password: string;
    age: number;
    height: number;
    weight: number;
    activityLevel: 'low' | 'medium' | 'high';
    goal: 'weight_loss' | 'muscle_gain' | 'maintenance';
  }
  