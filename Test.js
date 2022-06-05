import React, {useState, useEffect} from 'react';
import Realm from 'realm';
import { Text, View, TextInput, Pressable, StyleSheet, TouchableOpacity, Alert, Modal, ActivityIndicator } from 'react-native';
import {createRealmContext} from '@realm/react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {ObjectId} from 'bson';

// Redux
import {Provider} from 'react-redux';
import store from './redux';

import {useSelector, useDispatch} from 'react-redux';
import {saveSession} from './redux/reducers/loginInformationSlice';

let Stack = createStackNavigator();

const RealmInstance = new Realm.App({
    id: 'rmdb-abojh',
    timeout: 10000
});

const codes = {
    48: 'Le mot de passe est trop court',
    49: 'Email deja utilisé',
    50: 'Identifiants incorrects', 
}

const { currentUser } = RealmInstance;

class Produit extends Realm.Object {
    static schema = {
        name: 'Produit',
        properties: {
            _id: 'objectId',
            name: 'string',
            price: 'string'
        },
        primaryKey: '_id'
    }
};

const RealmContext = createRealmContext({schema: [Produit]});

const {RealmProvider, useRealm, useQuery} = RealmContext;

const Login = ({navigation}) => {

    const dispatch = useDispatch();

    let [email, setEmail] = useState("rbatoulime@gmail.com");
    let [password, setPassword] = useState("password");

    const signUp = async () => {
        try {
            await RealmInstance.emailPasswordAuth.registerUser({ email, password });
        } catch(error) {
            alert(codes[error.code])
        }
    }

    const signIn = async () => {
        try{
            console.log('first')
            const creds = Realm.Credentials.emailPassword(email, password);
            const connectedUser = await RealmInstance.logIn(creds);
            dispatch(saveSession({connectedUser}))
        } catch(error) {
            alert(codes[error.code])
        }
    }

    return (
        <View style={{backgroundColor: '#1D252C', flex: 1, justifyContent: 'center'}}>
            <View style={{margin: 20}}>
                <Text style={{alignSelf: 'center', marginVertical: 20, fontSize: 20, color: 'white'}}>SignIn</Text>
                <TextInput value={email} placeholder='Enter email address' style={styles.textInput} onChangeText={(email) => setEmail(email)} />
                <TextInput value={password} placeholder='Enter password' style={styles.textInput} onChangeText={password => setPassword(password)} />
                <TouchableOpacity style={styles.button} onPress={signIn}>
                    <Text style={{color: 'white', fontSize: 16}}>SignIn</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const ProductView = ({navigation}) => {
    
    let realm = useRealm();
    let [productName, setProductName] = useState('');
    let [productPrice, setProductPrice] = useState('');
    let [isAdding, setIsAdding] = useState(false);

    const addProduct = async () => {
        setIsAdding(!isAdding)
        realm.write(async () => {
            let tried = await realm.create('Produit', {
                _id: (new ObjectId()),
                name: productName,
                price:  productPrice
            })
            setIsAdding(false)
        })
    }

    return (
        <View style={{backgroundColor: '#1D252C', flex: 1, justifyContent: 'center'}}>

            <TouchableOpacity style={{position: 'absolute', top: 20, right: 20}}
                onPress={() => {currentUser.logOut(), navigation.navigate('Login')}}
            >
                <Text style={{color: 'white', fontSize: 18, }}>Deconnexion</Text>
            </TouchableOpacity>

            <Modal
                visible={isAdding}
                transparent={true}
            >
                <View style={{backgroundColor: 'rgba(0, 0, 0, 0.4)', flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                    <ActivityIndicator size={'large'} color='white'  />
                </View>
            </Modal>

            <View style={{alignItems: 'center', paddingHorizontal: 20}}>
                <Text style={{color: 'white', fontSize: 20}}>Ajouter un produit</Text>
                <TextInput value={productName} style={styles.textInput} placeholder='Nom du produit' onChangeText={(name) => setProductName(name) } />
                <TextInput value={productPrice} style={styles.textInput} onChangeText={(price) => setProductPrice(price)} placeholder='Prix du produit' />
                <TouchableOpacity style={styles.button} onPress={addProduct}>
                    <Text style={{color: 'white', fontSize: 16}}>Add (+)</Text>
                </TouchableOpacity>

                <TouchableOpacity style={{alignSelf: 'flex-end', marginVertical: 10,}} onPress={() => {navigation.navigate('listProducts')}}>
                    <Text style={{color: 'white', fontSize: 18}}> Voir les produits</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const ProductList = () => {

    const data = {
        _id: '',
        name: '',
        price: ''
    };

    const products = useQuery('Produit');
    const realm = useRealm();
    let [modalVisible, setModalVisible] = useState(false);
    let [activeProduct, setActiveProduct] = useState(data);

    const deleteProduct = (id) => {
        try{
            const ProductToDelete = realm.objectForPrimaryKey('Produit', id);
            const ok = () => {
                realm.write(() => {
                    realm.delete(ProductToDelete)
                })
            }
            CustomAlert('Alert', 'Supprimer le produit ?', ok);
        } catch(err) {
            console.log(err)
        }
    }


    const updateProduct = () => {
        if(activeProduct._id != '') {
            try {
                const ProductToUpdate = realm.objectForPrimaryKey('Produit', activeProduct._id);
                if(activeProduct.name === ProductToUpdate.name && activeProduct.price === ProductToUpdate.price) {
                    alert('Nothing to change');
                } else {
                    const ok = () => {
                        realm.write(() => {
                            ProductToUpdate.name = activeProduct.name;
                            ProductToUpdate.price = activeProduct.price;
                        })
                        setModalVisible(false)
                    }
                    CustomAlert('Alert', 'Modifier le produit ?', ok);
                }
            } catch (err) {
                console.log(err)
            }
        }
    }

    const activeModal = ({Product}) => {
        setModalVisible(!modalVisible);
        if(Product) {
            data._id = Product._id;
            data.name = Product.name;
            data.price = Product.price;
            setActiveProduct(data);
        }
    }

    return (
        <View style={{backgroundColor: '#1D252C', flex: 1, justifyContent: 'center'}}>
            <Modal 
                visible={modalVisible}
                transparent={true}
            >
                <Pressable style={{alignItems: 'center', justifyContent: 'center', flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.7)', }} onPress={() => activeModal({})}>
                    <View style={{backgroundColor: 'white', padding: 10, width: "90%", alignSelf: 'center'}}>
                        <Text style={{alignSelf: 'center', fontSize: 18, marginVertical: 10}}> Modifier le produit </Text>
                        <View>
                            <TextInput value={activeProduct ? activeProduct.name : ''} placeholder='Nom du produit' style={[{borderWidth: 1}, styles.textInput]} onChangeText={(name) => {setActiveProduct({...activeProduct, ['name']: name})}} />
                            <TextInput value={activeProduct ? activeProduct.price : ''} placeholder='Prix du produit' style={[{borderWidth: 1}, styles.textInput]}  onChangeText={(price) => {setActiveProduct({...activeProduct, ['price']: price})}} />
                        </View>
                        <TouchableOpacity style={styles.button} onPress={updateProduct}>
                            <Text style={{color: 'white', fontSize: 16}}>Save</Text>
                        </TouchableOpacity>
                        <Text>{JSON.stringify(activeProduct)}</Text>
                    </View>
                </Pressable>
            </Modal>
            <View style={{marginHorizontal: 20}}>
                <Text style={{alignSelf: 'center', fontSize: 18, color: 'white', marginVertical: 20}}>List of products</Text>
                {
                    products.map(Product => (
                        <TouchableOpacity key={Product._id} style={{padding: 10, margin: 5, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1 }} onPress={() => activeModal({Product})}>
                            <Text style={{fontSize: 16, color: 'white'}}>{Product.name}</Text>
                            <TouchableOpacity style={{alignSelf: 'flex-end', backgroundColor: '#dc3545', paddingHorizontal: 3, paddingVertical: 1}} onPress={() => deleteProduct(Product._id)}>
                                <Text style={{color: 'white', fontSize: 18}}> Delete </Text>
                            </TouchableOpacity>
                        </TouchableOpacity>
                    ))
                }
            </View>
        </View>
    )
}

const CustomAlert = (title, message, okEvent) => {

    return (
        Alert.alert(
            title,
            message,
            [
                {
                    text: 'Non',
                },
                {
                    text: 'Oui',
                    onPress: okEvent
                }
            ]
        )
    )
}

const TopComponent = ({syncConfig}) => {
    return (
        <View>
            <Text>TopComponent</Text>
        </View>
    )
}

const Innovation = () => {

    const userInfo = useSelector(state => state.userInfo.connectedUser);


    // useEffect(() => {
        
    //     currentUser ?? dispatch(saveSession({connectedUser: currentUser}))
    // })

    // console.log("userInfo")

    return (
        <NavigationContainer>
            {/* <RealmProvider sync={{
                schema: [Produit],
                user: currentUser,
                partitionValue: `%%${currentUser.id}`
            }}>
                <Stack.Navigator screenOptions={{
                    headerShown: false,
                }}>
                    <Stack.Screen name='Login' component={Login} />
                    <Stack.Screen name='Product' component={ProductView} />
                    <Stack.Screen name='listProducts' component={ProductList} />
                </Stack.Navigator>
            </RealmProvider> */}
            {/* {
                !currentUser ? (
                    <Stack.Navigator screenOptions={{
                        headerShown: false,
                    }}>
                        <Stack.Screen name='Login' component={Login} />
                        <Stack.Screen name='Product' component={ProductView} />
                    </Stack.Navigator>
                ) : (
                    <>
                        <RealmProvider sync={{
                            schema: [Produit],
                            user: currentUser,
                            partitionValue: `%%${currentUser.id}`
                        }}>
                            <Stack.Navigator screenOptions={{
                                headerShown: false,
                            }}>
                                <Stack.Screen name='Product' component={ProductView} />
                                <Stack.Screen name='listProducts' component={ProductList} />
                                <Stack.Screen name='Login' component={Login} />
                            </Stack.Navigator>
                        </RealmProvider>
                    </>
                )
            } */}

            {
                !userInfo ?
                <Login /> :
                <>
                    <Text>Home</Text>
                    {/* <RealmProvider sync={{
                        schema: [Produit],
                        user: userInfo.connectedUser,
                        partitionValue: `%%${userInfo.connectedUser.id}`
                    }}>
                        <Stack.Navigator screenOptions={{
                            headerShown: false,
                        }}>
                            <Stack.Screen name='Product' component={ProductView} />
                            <Stack.Screen name='listPro
                            ducts' component={ProductList} />
                            <Stack.Screen name='Login' component={Login} />
                        </Stack.Navigator>
                    </RealmProvider> */}
                </>
            }
            
        </NavigationContainer>
    )
}


const AppWaper = () => {

    return (
        <Provider store={store}>
            <Innovation />
        </Provider>
    )
}

export default AppWaper;


const styles = StyleSheet.create({
    textInput: {
        margin: 5,
        paddingHorizontal: 10,
        paddingVertical: 5,
        backgroundColor: 'whitesmoke',
        borderBottomRightRadius: 10,
        fontSize: 16,
        width: '100%'
    },
    button: {
        alignSelf: 'flex-end', 
        marginRight: 5,
        paddingHorizontal: 20,
        paddingVertical: 8,
        backgroundColor: '#F06B6B',
        borderBottomRightRadius: 10,
        margin: 5,
    },
})