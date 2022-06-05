import { View, Text, StyleSheet, Dimensions, TextInput, Pressable, TouchableOpacity } from 'react-native';
import React, {useState} from 'react';


export default ({navigation}) => {

    let [email, setEmail] = useState("");
    let [password, setPassword] = useState("");

    return (
        <View style={styles.container}>
            <Text style={styles.title}>SignIn</Text>

            <View style={styles.inputContainer}>
                <TextInput 
                    style={styles.input} 
                    value={email} 
                    onChangeText={(email) => setEmail(email)} 
                    placeholder="Enter your mail address" 
                />
                <TextInput 
                    style={styles.input} 
                    value={password} 
                    onChangeText={(password) => setPassword(password) } 
                    placeholder="Enter your password" 
                    secureTextEntry
                />
                <TouchableOpacity style={styles.button} onPress={() => {navigation.navigate('signUp')}}>
                    <Text style={{color: 'white', fontSize: 18}}>Validate</Text>
                </TouchableOpacity>
                <Text style={{color: 'white', }}>
                {`Email: ${email}
Password: ${password}`}</Text>
            </View>
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#1D252C',
        justifyContent: 'center',
    },

    title: {
        fontSize: 35,
        color: 'white',
        marginVertical: 35
    },

    inputContainer: {
        width: Dimensions.get('window').width - 30,
        paddingHorizontal: 10
    },

    input: {
        backgroundColor: 'white',
        fontSize: 18,
        paddingVertical: 7,
        paddingHorizontal: 14,
        marginVertical: 10
    },

    button: {
        backgroundColor: '#F06B6B',
        paddingVertical: 10,
        marginVertical: 10,
        alignItems: 'center'
    }
});