import 'react-native-gesture-handler';
import React from 'react';
import SignIn from './components/Auth/SignIn';
import RealmContext, {RealmInstance, Product} from './components/Realm';
import { StyleSheet, View, Text } from 'react-native';

import {NavigationContainer} from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack';
import SignUp from './components/Auth/SignUp';
import { AuthProvider } from './components/Providers/AuthProvider';


const {RealmProvider, useRealm, useQuery} = RealmContext;
const {currentUser} = RealmInstance;

let Stack = createStackNavigator();


function Main() {

    return (
        <View>
            <Text>Home</Text>
        </View>
    );
}

function AppWrapper() {

    // if(!currentUser) {
    //     return (
    //         <>
    //             <SignIn />
    //         </>
    //     )
    // }

    return (
        <NavigationContainer>
            {
                !currentUser ? (
                    <AuthProvider>
                        <Stack.Navigator
                            screenOptions={{
                                headerShown: false
                            }}
                        >
                            <Stack.Screen name='SignIn' component={SignIn} />
                            <Stack.Screen name='signUp' component={SignUp} />
                        </Stack.Navigator>
                    </AuthProvider>
                ) : 
                (
                    <RealmProvider sync={{schema: [Product], user: currentUser, partitionValue: "ExpoTemplate" }}>
                        <Stack.Navigator
                            screenOptions={{
                                headerShown: false
                            }}
                        >
                            <Stack.Screen name='SignIn' component={SignIn} />
                            <Stack.Screen name='signUp' component={SignUp} />
                        </Stack.Navigator>
                    </RealmProvider>
                )
            }
        </NavigationContainer>
    )

}

export default AppWrapper;