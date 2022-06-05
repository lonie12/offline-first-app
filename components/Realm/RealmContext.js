import Realm from "realm";
import Product from "./Schema/Product";
import {createRealmContext} from '@realm/react';

const RealmContext =  createRealmContext({schema: [Product.schema], path: 'testuse-path'});

export default RealmContext;