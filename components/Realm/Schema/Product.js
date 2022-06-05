import Realm from 'realm';

class Product extends Realm.Object {

    static schema = {
        name: 'Product',
        properties: {
            _id: 'objectId',
            name: 'string',
            price: 'string',
            categorie: 'string',
        },
        primaryKey: '_id'
    }
}

export default Product;