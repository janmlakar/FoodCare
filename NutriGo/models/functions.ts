import { ActivityLevel, Goal } from "./User";

export function userGoalToText(goal: Goal | undefined | null) {
    if(!goal)
        return undefined;

    if(goal === Goal.WEIGHT_LOSS)
        return "Lose weight";

    if(goal === Goal.MUSCLE_GAIN)
        return "Gain muscle";

    if(goal === Goal.MAINTENANCE)
        return "Maintenance";

    return "Invalid value"
}

export function userActivityLevelToText(activityLevel: ActivityLevel | undefined | null) {
    if(!activityLevel)
        return undefined;

    if(activityLevel === ActivityLevel.LOW)
        return "Low";

    if(activityLevel === ActivityLevel.MEDIUM)
        return "Medium";

    if(activityLevel === ActivityLevel.HIGH)
        return "High";

    return "Invalid value"
}

const calculateCalorieIntake = (
  height: number,
  weight: number,
  age: number,
  gender: 'male' | 'female' | 'other' | undefined,
  activityLevel: ActivityLevel | undefined,
  goal: Goal | undefined
): number | undefined => {
  // Ensure gender is not undefined
  if (!gender) return undefined;

  // Calculate BMR using the Harris-Benedict Equation
  let BMR;
  if (gender === 'male') {
    BMR = 88.362 + 13.397 * weight + 4.799 * height - 5.677 * age;
  } else if (gender === 'female') {
    BMR = 447.593 + 9.247 * weight + 3.098 * height - 4.33 * age;
  } else {
    // Handle 'other' gender by averaging male and female BMR
    BMR =
      (88.362 + 13.397 * weight + 4.799 * height - 5.677 * age +
        447.593 + 9.247 * weight + 3.098 * height - 4.33 * age) /
      2;
  }

  // Adjust BMR based on activity level
  let activityMultiplier = 1.2; // Default to sedentary if undefined
  switch (activityLevel) {
    case ActivityLevel.LOW:
      activityMultiplier = 1.2;
      break;
    case ActivityLevel.MEDIUM:
      activityMultiplier = 1.55;
      break;
    case ActivityLevel.HIGH:
      activityMultiplier = 1.9;
      break;
    default:
      activityMultiplier = 1.2;
  }

  const maintenanceCalories = BMR * activityMultiplier;

  // Adjust maintenance calories based on goal
  let goalAdjustment = 0; // Default to maintenance if undefined
  switch (goal) {
    case Goal.WEIGHT_LOSS:
      goalAdjustment = -500;
      break;
    case Goal.MUSCLE_GAIN:
      goalAdjustment = 500;
      break;
    case Goal.MAINTENANCE:
      goalAdjustment = 0;
      break;
    default:
      goalAdjustment = 0;
  }

  const dailyCalorieIntake = maintenanceCalories + goalAdjustment;
  return Math.round(dailyCalorieIntake);
};

const calculateMacrosIntake = (
  height: number,
  weight: number,
  age: number,
  gender: 'male' | 'female' | 'other' | undefined,
  activityLevel: ActivityLevel | undefined,
  goal: Goal | undefined
) => {
  const dailyCalorieIntake = calculateCalorieIntake(height, weight, age, gender, activityLevel, goal);

  if (!dailyCalorieIntake) return undefined;

  // Assuming a balanced diet ratio of 30% protein, 50% carbs, and 20% fats for maintenance
  let proteinRatio = 0.3;
  let carbsRatio = 0.5;
  let fatsRatio = 0.2;

  // Adjust ratios based on goal
  switch (goal) {
    case Goal.WEIGHT_LOSS:
      proteinRatio = 0.4;
      carbsRatio = 0.4;
      fatsRatio = 0.2;
      break;
    case Goal.MUSCLE_GAIN:
      proteinRatio = 0.3;
      carbsRatio = 0.5;
      fatsRatio = 0.2;
      break;
    case Goal.MAINTENANCE:
      proteinRatio = 0.3;
      carbsRatio = 0.5;
      fatsRatio = 0.2;
      break;
    default:
      proteinRatio = 0.3;
      carbsRatio = 0.5;
      fatsRatio = 0.2;
  }

  const dailyProteinIntake = Math.round((dailyCalorieIntake * proteinRatio) / 4); // 1g of protein = 4 calories
  const dailyCarbsIntake = Math.round((dailyCalorieIntake * carbsRatio) / 4); // 1g of carbs = 4 calories
  const dailyFatsIntake = Math.round((dailyCalorieIntake * fatsRatio) / 9); // 1g of fat = 9 calories

  return {
    dailyProteinIntake,
    dailyCarbsIntake,
    dailyFatsIntake,
  };
};

const calculateMicrosIntake = (
  height: number,
  weight: number,
  age: number,
  gender: 'male' | 'female' | 'other' | undefined,
  activityLevel: ActivityLevel | undefined,
  goal: Goal | undefined
) => {
  const dailyCalorieIntake = calculateCalorieIntake(height, weight, age, gender, activityLevel, goal);

  if (!dailyCalorieIntake) return undefined;

  // Adjust micronutrient recommendations based on age groups
  let vitamins = {
    vitaminA: 900,
    vitaminC: 90,
    vitaminD: 20,
    vitaminE: 15,
    vitaminK: 120,
    vitaminB1: 1.2,
    vitaminB2: 1.3,
    vitaminB3: 16,
    vitaminB6: 1.3,
    vitaminB12: 2.4,
    folate: 400,
  };

  let minerals = {
    calcium: 1000,
    iron: 8,
    magnesium: 420,
    phosphorus: 700,
    potassium: 4700,
    sodium: 2300,
    zinc: 11,
  };

  if (age < 4) {
    vitamins = {
      vitaminA: 300,
      vitaminC: 15,
      vitaminD: 15,
      vitaminE: 6,
      vitaminK: 30,
      vitaminB1: 0.5,
      vitaminB2: 0.5,
      vitaminB3: 6,
      vitaminB6: 0.5,
      vitaminB12: 0.9,
      folate: 150,
    };
    minerals = {
      calcium: 700,
      iron: 7,
      magnesium: 80,
      phosphorus: 460,
      potassium: 3000,
      sodium: 1000,
      zinc: 3,
    };
  } else if (age >= 4 && age <= 8) {
    vitamins = {
      vitaminA: 400,
      vitaminC: 25,
      vitaminD: 15,
      vitaminE: 7,
      vitaminK: 55,
      vitaminB1: 0.6,
      vitaminB2: 0.6,
      vitaminB3: 8,
      vitaminB6: 0.6,
      vitaminB12: 1.2,
      folate: 200,
    };
    minerals = {
      calcium: 1000,
      iron: 10,
      magnesium: 130,
      phosphorus: 500,
      potassium: 3800,
      sodium: 1200,
      zinc: 5,
    };
  } else if (age >= 9 && age <= 18) {
    vitamins = {
      vitaminA: 600,
      vitaminC: 45,
      vitaminD: 15,
      vitaminE: 11,
      vitaminK: 75,
      vitaminB1: 0.9,
      vitaminB2: 0.9,
      vitaminB3: 12,
      vitaminB6: 1,
      vitaminB12: 1.8,
      folate: 300,
    };
    minerals = {
      calcium: 1300,
      iron: 15,
      magnesium: 240,
      phosphorus: 1250,
      potassium: 4500,
      sodium: 1500,
      zinc: 8,
    };
  } else if (age > 18) {
    vitamins = {
      vitaminA: 900,
      vitaminC: 90,
      vitaminD: 20,
      vitaminE: 15,
      vitaminK: 120,
      vitaminB1: 1.2,
      vitaminB2: 1.3,
      vitaminB3: 16,
      vitaminB6: 1.3,
      vitaminB12: 2.4,
      folate: 400,
    };
    minerals = {
      calcium: 1000,
      iron: 8,
      magnesium: 420,
      phosphorus: 700,
      potassium: 4700,
      sodium: 2300,
      zinc: 11,
    };
  }

  return { vitamins, minerals };
};

export { calculateCalorieIntake, calculateMacrosIntake, calculateMicrosIntake };

export const calculateDailyWaterIntakeAdvanced = (
  weight: number,
  age: number,
  gender: string,
  activityLevel: any
) => {
  let baseWaterIntake = 35; // General recommendation for adults: 35 ml per kg

  if (age <= 18) {
    baseWaterIntake = 40; // Example for younger individuals: 40 ml per kg
  } else if (age > 65) {
    baseWaterIntake = 30; // Example adjustment for elderly: 30 ml per kg
  }

  let waterIntake = weight * baseWaterIntake;

  // Adjust based on gender
  if (gender === 'male') {
    waterIntake *= 1.1; // Example adjustment for males
  } else if (gender === 'female') {
    waterIntake *= 0.9; // Example adjustment for females
  } else {
    waterIntake *= 1.0; // No adjustment for 'other'
  }

  // Adjust based on activity level
  switch (activityLevel) {
    case 'LOW':
      break; // No additional adjustment
    case 'MEDIUM':
      waterIntake *= 1.1; // Add 10% for medium activity
      break;
    case 'HIGH':
      waterIntake *= 1.2; // Add 20% for high activity
      break;
    default:
      break;
  }

  return Math.round(waterIntake); // Round to the nearest whole number
};

export const calculateBMI = (height: number, weight: number): number => {
  if (height <= 0 || weight <= 0) {
      throw new Error("Height and weight must be positive values");
  }

  const heightInMeters = height / 100;
  const bmi = weight / (heightInMeters * heightInMeters);

  return Math.round(bmi * 10) / 10; // Round to one decimal place
};