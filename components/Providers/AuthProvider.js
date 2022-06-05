import React, {useContext, useState, useEffect} from 'react';
import { RealmInstance } from '../Realm';


const AuthContext = React.createContext(null);


const AuthProvider = ({children}) => {

    let [user, setUser] = useState(null);

    const signIn = async (email, password) => {
        const creds = Realm.Credentials.emailPassword(email, password);
        const newUser = await app.logIn(creds);
        setUser(newUser); 
    };

    const signUp = async () => {
        await app.emailPasswordAuth.registerUser({ email, password });
    };

    return (
        <AuthContext.Provider
            value={{
                signIn,
                signUp,
                user
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

const useAuth = () => {
    const auth = useContext(AuthContext)

    return auth;
}

export {AuthProvider, useAuth};