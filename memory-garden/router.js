import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { UserProvider } from './utils/user';

import LoginPage from './component/login/base';
import HomePage from './component/home/base';
import JoinPage from './component/join/base';
import DrawingPage from './component/drawing/base';
import TutorialPage from './component/tutorial/base';
import HtpTestPage from './component/tutorial/htpTest';
import RainPersonTestPage from './component/tutorial/rainPersonTest';

const Stack = createNativeStackNavigator();

export default function Router() {
    return (
        <UserProvider>
            <NavigationContainer>
                <Stack.Navigator initialRouteName="Login">
                    <Stack.Screen
                        name="Login"
                        component={LoginPage}
                        options={{
                            title: 'Login',
                            headerShown: false
                        }}
                    />
                    <Stack.Screen
                        name="Home"
                        component={HomePage}
                        options={{
                            title: 'Home',
                            headerBackVisible: false,
                            headerShown: false
                        }}
                    />
                    <Stack.Screen
                        name="Join"
                        component={JoinPage}
                        options={{
                            title: 'Join',
                            headerBackVisible: false,
                            headerShown: false,
                            headerBackTitleVisible: false
                        }}
                    />
                    <Stack.Screen
                        name="Drawing"
                        component={DrawingPage}
                        options={{
                            title: 'Drawing',
                            headerShown: false,
                            headerBackTitleVisible: false
                        }}
                    />
                    <Stack.Screen 
                        name="Tutorial" 
                        component={TutorialPage} 
                        options={{
                            title: 'Tutorial',
                            headerShown: false
                        }}    
                    />
                    <Stack.Screen 
                        name="HtpTest" 
                        component={HtpTestPage} 
                        options={{
                            title: 'HtpTest',
                            headerShown: false
                        }}  
                    />
                    <Stack.Screen 
                        name="RainPersonTest" 
                        component={RainPersonTestPage} 
                        options={{
                            title: 'RainPersonTest',
                            headerShown: false
                        }} 
                    />
                </Stack.Navigator>
            </NavigationContainer>
        </UserProvider>
    );
}
