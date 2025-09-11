const { success, badRequest, internalServerError } = require("../../library/response");
const logger = require("../../library/logger");
const Category = require("../model/category.model");
const { CategoryResponseDTO } = require("../dtos/category.dto");

const getAllCatagories = async (_req, res) => {
    try {
        const categories = await Category.query().select('id', 'name', 'created_at', 'updated_at').whereNull('deleted_at').returning('*');
        logger.info(`Fetched ${categories.length} categories`);
        return success(res, categories.map(cat => new CategoryResponseDTO(cat)), "Categories fetched successfully");
    } catch (err) {
        logger.error(`Fetch categories error: ${err.message}`, err);
        return internalServerError(res, "Internal server error");
    }
}

const getAllDeletedCategories = async (_req, res) => {
    try {
        const categories = await Category.query().select('id', 'name', 'created_at', 'updated_at', 'deleted_at').whereNotNull('deleted_at').returning('*');
        logger.info(`Fetched ${categories.length} deleted categories`);
        return success(res, categories.map(cat => new CategoryResponseDTO(cat)), "Deleted categories fetched successfully");
    } catch (err) {
        logger.error(`Fetch deleted categories error: ${err.message}`, err);
        return internalServerError(res, "Internal server error");
    }
}

const getCategoryById = async (req, res) => {
    try {
        const { id } = req.params
        const category = await Category.query().findById(id).select('id', 'name', 'created_at', 'updated_at').whereNull('deleted_at').returning('*');
        if (!category) {
            logger.warn(`Category not found for ID: ${id}`);
            return badRequest(res, "Category not found");
        }
        logger.info(`Fetched category ID: ${id}`);
        return success(res, new CategoryResponseDTO(category), "Category fetched successfully");
    } catch (err) {
        logger.error(`Find category error: ${err.message}`, err);
        return internalServerError(res, "Internal server error");
    }
}

const createCategory = async (req, res) => {
    try {
        const { name } = req.body

        const exsisting = await Category.query().findOne({ name }).returning('*');
        if (exsisting) {
            logger.warn(`Attempt to create existing category: ${name}`);
            return badRequest(res, "Category name already exists");
        }

        const newCategory = await Category.query().insert({ name }).returning('*');
        logger.info(`New category created: ${name}`);
        return success(res, new CategoryResponseDTO(newCategory), "Category created successfully", 201);
    } catch (err) {
        logger.error(`Create category error: ${err.message}`, err);
        return internalServerError(res, "Internal server error");
    }
}

const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, deleted_at } = req.body;

        const exsisting_category = await Category.query().findOne({ name }).whereNot('id', id).returning('*');
        if (exsisting_category) {
            logger.warn(`Attempt to update category to an existing name: ${name}`);
            return badRequest(res, "Category name already exists");
        }

        const category = await Category.query().findById(id).returning('*');;
        if (!category) {
            logger.warn(`Attempt to update non-existing category ID: ${id}`);
            return badRequest(res, "Category not found");
        }

        const updatedCategory = await Category.query().findById(id).patch({ name, deleted_at }).returning('*');
        logger.info(`Category updated: ID ${id} with new name ${name}`);
        return success(res, new CategoryResponseDTO(updatedCategory), "Category updated successfully");
    } catch (err) {
        logger.error(`Update category error: ${err.message}`, err);
        return internalServerError(res, "Internal server error");
    }
}

const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await Category.query().findById(id).returning('*');;
        if (!category) {
            logger.warn(`Attempt to delete non-existing category ID: ${id}`);
            return badRequest(res, "Category not found");
        }
        await Category.query().findById(id).patch({ deleted_at: new Date().toISOString() });
        logger.info(`Category soft-deleted: ID ${id}`);
        return success(res, {}, "Category deleted successfully", 204);
    } catch (err) {
        logger.error(`Delete category error: ${err.message}`, err);
        return internalServerError(res, "Internal server error");
    }
}

module.exports = {
    getAllCatagories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory,
    getAllDeletedCategories
};