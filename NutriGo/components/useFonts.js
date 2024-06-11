import * as Font from 'expo-font';
import { useEffect, useState } from 'react';

const useFonts = async () => {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    const loadFonts = async () => {
      await Font.loadAsync({
        'Poppins-Regular': require('../assets/fonts/Poppins-Regular.ttf'),
        'SpaceMono-Regular': require('../assets/fonts/SpaceMono-Regular.ttf'),
      });
      setFontsLoaded(true);
    };

    loadFonts();
  }, []);

  return fontsLoaded;
};

export default useFonts;
