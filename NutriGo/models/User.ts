export enum ActivityLevel {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high"
}

export enum Goal {
  WEIGHT_LOSS = "weight_loss",
  MUSCLE_GAIN = "muscle_gain",
  MAINTENANCE = "maintenance"
}

export interface User {
  id: string;
  email: string;
  password: string;
  image?: string; 
  age: number;
  height: number;
  weight: number;
  activityLevel: ActivityLevel | undefined; // Allow undefined
  goal: Goal | undefined; // Allow undefined
  name: string;
  gender: 'male' | 'female' | 'other'| undefined;
  calorieIntake: number;
  }
