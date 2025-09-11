const express = require('express');
const router = express.Router();

const {
    getAllProducts,
    getProductById,
    getAllDeletedProducts,
    createProduct,
    updateProduct,
    deleteProduct,
} = require('../app/controller/product.controller');
const { store, findById } = require('../app/validator/product.validator');
const logger = require('../library/logger');
const authMiddleware = require('../middleware/auth.middleware');
const upload = require('../middleware/upload.middleware');


/**
 * @openapi
 * /api/v1/products:
 *   get:
 *     tags:
 *       - Products
 *     summary: Get all products
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Products fetched successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 */
router.get('/products', authMiddleware, async (req, res) => {
    try {
        await getAllProducts(req, res);
    } catch (err) {
        logger.error('Get product route error', { stack: err.stack });
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});

/**
 * @openapi
 * /api/v1/products/deleted:
 *   get:
 *    tags:
 *     - Products
 *    summary: Get all deleted products
 *    security: 
 *     - cookieAuth: []
 *    responses: 
 *     200: 
 *      description : Deleted products fetched successfully
 *     401:
 *      description: Unauthorized
 *     500:
 *      description: Internal Server Error
 */
router.get('/products/deleted', authMiddleware, async (req, res) => {
    try {
        await getAllDeletedProducts(req, res);
    } catch (err) {
        logger.error('Get deleted products route error', { stack: err.stack });
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});

/**
 * @openapi
 * /api/v1/products/{id}:
 *   get:
 *     tags:
 *       - Products
 *     summary: Get product by ID
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         example: d290f1ee-6c54-4b01-90e6-d701748f0851
 *     responses:
 *       200:
 *         description: product fetched successfully
 *       400:
 *         description: product not found
 *       422:
 *         description: Validation Error
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 */
router.get('/products/:id', authMiddleware, findById, async (req, res) => {
    try {
        await getProductById(req, res);
    } catch (err) {
        logger.error('Get product by ID route error', { stack: err.stack });
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});

/**
 * @openapi
 * /api/v1/products:
 *   post:
 *     tags:
 *       - Products
 *     summary: Create a new product
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - category_id
 *               - name
 *               - image
 *               - price
 *               - stock
 *               - description
 *             properties:
 *               category_id:
 *                 type: string
 *                 format: uuid
 *                 example: d290f1ee-6c54-4b01-90e6-d701748f0851
 *               name:
 *                 type: string
 *                 example: New Product Name
 *               image:
 *                 type: string
 *                 format: binary
 *                 example: https://example.com/image.jpg
 *               price:
 *                 type: number
 *                 example: 19.99
 *               stock:
 *                 type: integer
 *                 example: 100  
 *               description: 
 *                 type : string
 *                 example: example products
 *     responses:
 *       201:
 *         description: product created successfully
 *       422:
 *         description: Validation Error
 *       500:
 *         description: Internal Server Error
 */
router.post('/products', authMiddleware, upload.single('image'), store, async (req, res) => {
    try {
        await createProduct(req, res);
    } catch (err) {
        logger.error('Create product route error', { stack: err.stack });
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});


/**
 * @openapi
 * /api/v1/products/{id}:
 *   put:
 *     tags:
 *       - Products
 *     summary: Update a product
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The ID of the product to update
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - category_id
 *               - name
 *               - image
 *               - price
 *               - stock
 *               - description
 *             properties:
 *               category_id:
 *                 type: string
 *                 format: uuid
 *                 example: d290f1ee-6c54-4b01-90e6-d701748f0851
 *               name:
 *                 type: string
 *                 example: New Product Name
 *               image:
 *                 type: string
 *                 format: binary
 *                 example: https://example.com/image.jpg
 *               price:
 *                 type: number
 *                 example: 19.99
 *               stock:
 *                 type: integer
 *                 example: 100  
 *               description: 
 *                 type : string
 *                 example: example products
 *     responses:
 *       200:
 *         description: Product updated successfully
 *       400:
 *         description: Product not found
 *       422:
 *         description: Validation Error
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 */
router.put('/products/:id', authMiddleware, upload.single('image'), findById, async (req, res) => {
    try {
        await updateProduct(req, res);
    } catch (err) {
        logger.error('Update product route error', { stack: err.stack });
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});

/**
 * @openapi
 * /api/v1/products/{id}:
 *   delete:
 *     tags:
 *       - Products
 *     summary: Delete a product by ID
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         example: d290f1ee-6c54-4b01-90e6-d701748f0851
 *     responses:
 *       204:
 *         description: Product deleted successfully
 *       400:
 *         description: Product not found
 *       401:
 *         description: Unauthorized
 *       422:
 *         description: Validation Error
 *       500:
 *         description: Internal Server Error
 */
router.delete('/products/:id', authMiddleware, findById, async (req, res) => {
    try {
        await deleteProduct(req, res);
    } catch (err) {
        logger.error('Delete products route error', { stack: err.stack });
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});


module.exports = router;