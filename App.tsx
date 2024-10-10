// k hlapisi
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Login from './screens/login';
import Signup from './screens/signup';
import Home from './screens/home';
import RecipeForm from './screens/addRecipes';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen 
          name="Home" 
          component={Home} 
          options={{ title: 'My Recipes' }} 
        />
        <Stack.Screen 
           name="recipeMod"
           component={RecipeForm}
           options={{ title: "Add/modify Recipe"}}
        />
        <Stack.Screen 
          name="Login" 
          component={Login} 
          options={{ title: 'Login' }} 
        />
        <Stack.Screen 
          name="SignUp" 
          component={Signup} 
          options={{ title: 'Sign Up' }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
