import { Router, response } from 'express';
import ProductModel from '../models/product.model.js';
import { query, validationResult, matchedData, check } from 'express-validator';

const ProductRouter = Router({ strict: true });

const productsQueryValidate = [
    query('name', 'invalid name')
        .trim()
        .isAlpha('en-NZ', { ignore: " " })
        .withMessage('Must be only alphabetical chars')
        .optional()
    ,
    query('limit', 'invalid limit')
        .trim()
        .isInt({
            min: 10,
            max: 30,
            allow_leading_zeroes: false
        })
        .withMessage("must be a valid number between 10-30")
        .optional()
]


ProductRouter.get('/products',
    productsQueryValidate,
    async (req, res, next) => {
        // check validation results
        const result = validationResult(req);
        if (!result.isEmpty()) {
            res.status(400).send({ errors: result.array() })
            return;
        }
        // params from validation
        const data = matchedData(req);
        //query response move to controller
        const responseData = await ProductModel.getProducts(data);
        // no return
        if (responseData.length == 0) {
            const err = new Error('not found');
            err.status = 404;
            return next(err);
        }
        res.status(200).json({ data: responseData });
    })



ProductRouter.post('/product', (req, res, next) => {
    console.log('/product');
    const {
        name,
        price,
        description,
        tags
    } = req.body;
    console.log(`${name} ${price} ${description} ${tags}`)
    res.send("has made it to products")
})


export default ProductRouter;