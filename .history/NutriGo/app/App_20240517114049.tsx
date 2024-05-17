import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import HomeScreen from '../components/HomeScreen';
import RegisterScreen from '../components/RegisterScreen';
import LoginForm from '../components/LoginForm';
import CalorieTrackerScreen from '../components/CalorieTrackerScreen';
import StatisticsScreen from '../components/StatisticsScreen';
import { UserProvider } from '../context/UserContext';

const Tab = createBottomTabNavigator();

const App: React.FC = () => {
  return (
    <UserProvider>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ color, size }) => {
              let iconName: string;
              switch (route.name) {
                case 'Home':
                  iconName = 'home';
                  break;
                case 'Register':
                  iconName = 'person-add';
                  break;
                case 'Login':
                  iconName = 'log-in';
                  break;
                case 'Profile':
                  iconName = 'person';
                  break;
                case 'CalorieTracker':
                  iconName = 'nutrition';
                  break;
                case 'Statistics':
                  iconName = 'stats-chart';
                  break;
                default:
                  iconName = 'home';
                  
              }
              return <Ionicons name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: 'tomato',
            tabBarInactiveTintColor: 'gray',
          })}
        >
          <Tab.Screen name="Home" component={HomeScreen} />
          <Tab.Screen name="Register" component={RegisterScreen} />
          <Tab.Screen name="Login" component={LoginForm} />
          <Tab.Screen name="CalorieTracker" component={CalorieTrackerScreen} />
          <Tab.Screen name="Statistics" component={StatisticsScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    </UserProvider>
  );
}

export default App;
