import mongoose, { Schema, model, Types } from 'mongoose';
import conn from '../../database/con.js';
import { data } from './mocks/product.js'

//could do array of description
// console.log(data);

const ProductSchema = new Schema({
    name: {
        type: String,
        required: [true, 'requires a name']
    },
    price: {
        type: String,
        required: [true, 'requires a price']
    },
    description: {
        type: String,
        required: [true, 'requires a description']
    },
    tags: [
        { type: String }
    ],
}, {
    statics: {
        getProducts({ name = null, limit = 10 }) {
            const query = mongoose.model('product').find(name ? { name } : {}, 'name price description').limit(limit);
            query.sort({ price: 'asc' })
            return query;
        }
    }
}, {
    timestamps: true,
});


const ProductModel = model('product', ProductSchema);

// ProductModel.insertMany(data);


export default ProductModel;