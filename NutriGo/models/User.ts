export enum ActivityLevel {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
  BMR = "Basal Metabolic Rate (BMR)",
  SEDENTARY = "Sedentary: little or no exercise",
  LIGHT = "Light: exercise 1-3 times/week",
  MODERATE ="Moderate: exercise 4-5 times/week",
  ACTIVE =" Active: daily exercise or intense exercise 3-4 times/week",
  VERY_ACTIVE ="Very Active: intense exercise 6-7 times/week" ,
  EXTRA_ACTIVE = "Extra Active: very intense exercise daily, or physical job"
    
}

export enum Goal {
  WEIGHT_LOSS = "weight_loss",
  MUSCLE_GAIN = "muscle_gain",
  MAINTENANCE = "maintenance",
  MILD_WEIGHT_LOSS ="Mild weight loss",
  EXTREME_WEIGHT_LOSS="Extreme weight loss"
}

export interface User {
  uid: string;
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
