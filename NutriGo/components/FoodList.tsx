// FoodList.tsx
import React, { createContext, useState, useContext, ReactNode } from 'react';

interface FoodItem {
    foodId: string;
    label: string;
    nutrients: {
        ENERC_KCAL: number;
    };
    brand?: string;
}

interface FoodContextProps {
    foodItems: FoodItem[];
    addFoodItem: (item: FoodItem) => void;
}

const FoodList = createContext<FoodContextProps | undefined>(undefined);

interface FoodProviderProps {
    children: ReactNode;
}

export const FoodProvider: React.FC<FoodProviderProps> = ({ children }) => {
    const [foodItems, setFoodItems] = useState<FoodItem[]>([]);

    const addFoodItem = (item: FoodItem) => {
        console.log("Adding food item:", item);
        setFoodItems((prevItems) => [...prevItems, item]);
    };
    

    return (
        <FoodList.Provider value={{ foodItems, addFoodItem }}>
            {children}
        </FoodList.Provider>
    );
};

export const useFood = () => {
    const context = useContext(FoodList);
    if (context === undefined) {
        throw new Error('useFood must be used within a FoodProvider');
    }
    return context;
};
