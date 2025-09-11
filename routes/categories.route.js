const express = require('express');
const router = express.Router();

const {
    createCategory,
    getAllCatagories,
    getCategoryById,
    updateCategory,
    deleteCategory,
    getAllDeletedCategories
} = require('../app/controller/category.controller');
const { store, findById } = require('../app/validator/category.validator');
const logger = require('../library/logger');
const authMiddleware = require('../middleware/auth.middleware');

/**
 * @openapi
 * /api/v1/categories:
 *   get:
 *     tags:
 *       - Categories
 *     summary: Get all categories
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Categories fetched successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 */
router.get('/categories', authMiddleware, async (req, res) => {
    try {
        await getAllCatagories(req, res);
    } catch (err) {
        logger.error('Get categories route error', { stack: err.stack });
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});

/**
 * @openapi
 * /api/v1/categories/deleted:
 *   get:
 *     tags:
 *       - Categories
 *     summary: Get all deleted categories
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Deleted categories fetched successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 */
router.get('/categories/deleted', authMiddleware, async (req, res) => {
    try {
        await getAllDeletedCategories(req, res);
    } catch (err) {
        logger.error('Get deleted categories route error', { stack: err.stack });
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});

/**
 * @openapi
 * /api/v1/categories/{id}:
 *   get:
 *     tags:
 *       - Categories
 *     summary: Get category by ID
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
 *         description: Category fetched successfully
 *       400:
 *         description: Category not found
 *       422:
 *         description: Validation Error
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 */
router.get('/categories/:id', authMiddleware, findById, async (req, res) => {
    try {
        await getCategoryById(req, res);
    } catch (err) {
        logger.error('Get category by ID route error', { stack: err.stack });
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});

/**
 * @openapi
 * /api/v1/categories:
 *   post:
 *     tags:
 *       - Categories
 *     summary: Create a new category
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: Technology
 *     responses:
 *       201:
 *         description: Category created successfully
 *       422:
 *         description: Validation Error
 *       500:
 *         description: Internal Server Error
 */
router.post('/categories', authMiddleware, store, async (req, res) => {
    try {
        await createCategory(req, res);
    } catch (err) {
        logger.error('Create category route error', { stack: err.stack });
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});

/**
 * @openapi
 * /api/v1/categories/{id}:
 *   put:
 *     tags:
 *       - Categories
 *     summary: Update a category
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The ID of the category to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - deleted_at
 *             properties:
 *               name:
 *                 type: string
 *                 example: Updated Category Name
 *               deleted_at: 
 *                type: [string, null]
 *                format: date-time
 *     responses:
 *       200:
 *         description: Category updated successfully
 *       400:
 *         description: Category not found
 *       422:
 *         description: Validation Error
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 */
router.put('/categories/:id', authMiddleware, findById, async (req, res) => {
    try {
        await updateCategory(req, res);
    } catch (err) {
        logger.error('Update category route error', { stack: err.stack });
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});

/**
 * @openapi
 * /api/v1/categories/{id}:
 *   delete:
 *     tags:
 *       - Categories
 *     summary: Delete a category by ID
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
 *         description: Category deleted successfully
 *       400:
 *         description: Category not found
 *       401:
 *         description: Unauthorized
 *       422:
 *         description: Validation Error
 *       500:
 *         description: Internal Server Error
 */
router.delete('/categories/:id', authMiddleware, findById, async (req, res) => {
    try {
        await deleteCategory(req, res);
    } catch (err) {
        logger.error('Delete category route error', { stack: err.stack });
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});

module.exports = router;
