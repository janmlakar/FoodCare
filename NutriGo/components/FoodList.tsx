import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { auth, firestore } from '@/firebase/firebase';
import { collection, addDoc, query, where, getDocs, onSnapshot, deleteDoc, doc } from 'firebase/firestore';

interface FoodItem {
  foodId: string;
  label: string;
  nutrients: {
    ENERC_KCAL: number;
  };
  brand?: string;
  id?: string;
}

interface FoodContextProps {
  foodItems: FoodItem[];
  addFoodItem: (item: FoodItem) => void;
  removeFoodItem: (itemId: string) => void;
}

const FoodList = createContext<FoodContextProps | undefined>(undefined);

interface FoodProviderProps {
  children: ReactNode;
}

export const FoodProvider: React.FC<FoodProviderProps> = ({ children }) => {
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);

  const user = auth.currentUser;

  useEffect(() => {
    if (user) {
      const q = query(collection(firestore, 'foodItems'), where('userId', '==', user.uid));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const items: FoodItem[] = [];
        querySnapshot.forEach((doc) => {
          items.push({ ...doc.data(), id: doc.id } as FoodItem);
        });
        setFoodItems(items);
      });

      return () => unsubscribe();
    }
  }, [user]);

  const addFoodItem = async (item: FoodItem) => {
    try {
      if (user) {
        await addDoc(collection(firestore, 'foodItems'), {
          ...item,
          userId: user.uid,
        });
      }
    } catch (error) {
      console.error('Error adding food item:', error);
    }
  };

  const removeFoodItem = async (itemId: string) => {
    try {
      if (user) {
        await deleteDoc(doc(firestore, 'foodItems', itemId));
      }
    } catch (error) {
      console.error('Error removing food item:', error);
    }
  };

  return (
    <FoodList.Provider value={{ foodItems, addFoodItem, removeFoodItem }}>
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
