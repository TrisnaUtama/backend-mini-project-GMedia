const { success, badRequest, internalServerError } = require("../../library/response");
const logger = require("../../library/logger");
const path = require('node:path');
const fs = require('node:fs');
const Product = require("../model/product.model");
const { ProductResponseDTO } = require("../dtos/product.dto");

const getAllProducts = async (_req, res) => {
    try {
        const products = await Product.query().select('id', 'name', 'description', 'price', 'stock', 'image', 'category_id',
            'created_at', 'updated_at').whereNull('deleted_at').returning('*');

        logger.info(`Fetched ${products.length} products`);
        return success(res, products.map(prod => new ProductResponseDTO(prod)), "Products fetched successfully");
    } catch (err) {
        logger.error(`Fetch products error: ${err.message}`, err);
        return internalServerError(res, "Internal server error");
    }
}

const getAllDeletedProducts = async (_req, res) => {
    try {
        const products = await Product.query().select('id', 'name', 'description', 'price', 'stock', 'image', 'category_id',
            'created_at', 'updated_at', 'deleted_at').whereNotNull('deleted_at').returning('*');

        logger.info(`Fetched ${products.length} deleted products`);
        return success(res, products.map(prod => new ProductResponseDTO(prod)), "Deleted products fetched successfully");
    } catch (err) {
        logger.error(`Fetch deleted products error: ${err.message}`, err);
        return internalServerError(res, "Internal server error");
    }
}

const getProductById = async (req, res) => {
    try {
        const { id } = req.params
        const product = await Product.query().findById(id).select('id', 'name', 'description', 'price', 'stock', 'image', 'category_id',
            'created_at', 'updated_at').whereNull('deleted_at').returning('*');
        if (!product) {
            logger.warn(`Product not found for ID: ${id}`);
            return badRequest(res, "Product not found");
        }
        logger.info(`Fetched product ID: ${id}`);
        return success(res, new ProductResponseDTO(product), "Product fetched successfully");
    } catch (err) {
        logger.error(`Find product error: ${err.message}`, err);
        return internalServerError(res, "Internal server error");
    }
}

const createProduct = async (req, res) => {
    try {
        const { category_id, name, description, price, stock } = req.body;

        const existingProduct = await Product.query().findOne({ name });
        if (existingProduct) {
            if (req.file) {
                const filePath = path.join(__dirname, '../../uploads/products', req.file.filename);
                fs.unlink(filePath, (err) => {
                    if (err) logger.error(`Failed to delete unused file: ${err.message}`);
                });
            }

            logger.warn(`Attempt to create product with existing name: ${name}`);
            return badRequest(res, "Product name already exists");
        }

        let imageUrl = null;
        if (req.file) {
            imageUrl = `/uploads/products/${req.file.filename}`;
        }

        const newProduct = await Product.query().insert({
            category_id,
            name,
            description,
            price: Number(price),
            stock: parseInt(stock, 10),
            image: imageUrl
        }).returning('*');

        logger.info(`New product created: ID ${newProduct.id}`);
        return success(res, new ProductResponseDTO(newProduct), "Product created successfully", 201);
    } catch (err) {
        logger.error(`Create product error: ${err.message}`, err);
        return internalServerError(res, "Internal server error");
    }
};

const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { category_id, name, description, price, stock, deleted_at } = req.body;

        const product = await Product.query().findById(id);
        if (!product) {
            logger.warn(`Product not found for ID: ${id}`);
            return badRequest(res, "Product not found");
        }

        const existingProduct = await Product.query()
            .findOne({ name })
            .whereNot('id', id);

        if (existingProduct) {
            if (req.file) {
                const filePath = path.join(__dirname, '../../uploads/products', req.file.filename);
                fs.unlink(filePath, (err) => {
                    if (err) logger.error(`Failed to delete unused file: ${err.message}`);
                });
            }

            logger.warn(`Attempt to update product with existing name: ${name}`);
            return badRequest(res, "Product name already exists");
        }

        let imageUrl = product.image;
        if (req.file) {
            if (product.image) {
                const oldFilePath = path.join(__dirname, '../../', product.image);
                fs.unlink(oldFilePath, (err) => {
                    if (err) logger.error(`Failed to delete old image: ${err.message}`);
                });
            }
            imageUrl = `/uploads/products/${req.file.filename}`;
        }

        const updatedProduct = await Product.query()
            .findById(id)
            .patch({
                category_id,
                name,
                description,
                price: Number(price),
                stock: parseInt(stock, 10),
                deleted_at,
                image: imageUrl
            })
            .returning('*');

        logger.info(`Product updated: ID ${id}`);
        return success(res, new ProductResponseDTO(updatedProduct), "Product updated successfully");
    } catch (err) {
        logger.error(`Update product error: ${err.message}`, err);
        if (req.file) {
            const filePath = path.join(__dirname, '../../uploads/products', req.file.filename);
            fs.unlink(filePath, () => { });
        }
        return internalServerError(res, "Internal server error");
    }
};


const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.query().findById(id).whereNull('deleted_at').returning('*');
        if (!product) {
            logger.warn(`Product not found or already deleted for ID: ${id}`);
            return badRequest(res, "Product not found or already deleted");
        }
        const deletedProduct = await Product.query().findById(id).patch({ deleted_at: new Date().toISOString() }).returning('*');
        logger.info(`Product soft-deleted: ID ${id}`);
        return success(res, new ProductResponseDTO(deletedProduct), "Product deleted successfully");
    } catch (err) {
        logger.error(`Delete product error: ${err.message}`, err);
        return internalServerError(res, "Internal server error");
    }
}

module.exports = {
    getAllProducts,
    getAllDeletedProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
}