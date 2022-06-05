import Realm from "realm";

let appConfig = {id: 'rmdb-abojh', timeout: 10000}

const RealmInstance = new Realm.App(appConfig);

export default  RealmInstance;