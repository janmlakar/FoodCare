// FoodContext.tsx
import React, { createContext, useState, useContext, ReactNode } from 'react';

interface FoodContextProps {
    foodItems: string[];
    addFoodItem: (item: string) => void;
}

const FoodList = createContext<FoodContextProps | undefined>(undefined);

interface FoodProviderProps {
    children: ReactNode;
}

export const FoodProvider: React.FC<FoodProviderProps> = ({ children }) => {
    const [foodItems, setFoodItems] = useState<string[]>([]);

    const addFoodItem = (item: string) => {
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