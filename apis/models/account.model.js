import { model, Schema, Types } from 'mongoose';


// need to add more details to fields
const AccountSchema = new Schema({
    name: {
        type: Object,
        firstName: {
            type: String,
            required: [true, 'requires firstname']
        },
        lastName: {
            type: String,
            required: [true, 'lastname requires']
        },
    },
    email: {
        type: String,
        required: [true, 'requires email']
    },
    username: {
        type: String,
        required: [true, 'requires username']
    },
    password: {
        type: String,
        required: [true, 'requires password']
    },
    age: {
        type: Number,
        required: [true, 'requires age'],
        min: 18,
        max: 110,
    },
    pepperVersion: {
        type: String,
        required: [true, 'requires pepperVersion']
      },
});

const AccountModel = model('Accounts', AccountSchema); 

export default AccountModel;