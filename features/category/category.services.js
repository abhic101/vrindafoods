const { NotFoundError, BadRequestError, ValidationError } = require('../../errors/app.errors');
const { deleteOne } = require('../../models/category.model');

class CategoryService {

    /**
     * 
     * @param {import('./category.repository')} categoryRepository 
     */
    constructor(categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    /**
     * 
     * @returns All Categories completely populated
     * @throws {NotFoundError} If no category is found
     */
    async getAll() {
        const allCategories = await this.categoryRepository.getAll();
        if (!allCategories.length > 0) {
            throw new NotFoundError('No categories found');
        }
        return allCategories;
    }

    /**
     * 
     * @param {string} categoryId ObjectId of the category as string
     * @returns Matched category
     * @throws {NotFoundError} If the category is not found
     */
    async getOne(categoryId) {
        const category = await this.categoryRepository.getOne(categoryId);
        if (!category) {
            throw new NotFoundError('No such category found');
        }
        return category;
    }

    /**
     * 
     * @param {Object} categoryData Object containing info to create new category
     * @returns Newly created category
     * @throws {ValidationError} If information is not according to the rules
     */
    async createNew(categoryData) {
        const getParentPath = await this.categoryRepository.getPath(categoryData.parent);
        if (!getParentPath) {
            throw new ValidationError('Invalid parent category selected', [{
                field: 'parent',
                message: 'Parent does not exists'
            }]);
        }
        const categoryPath = getParentPath.push(categoryData.parent);
        categoryData.path = categoryPath;
        const newCategory = await this.categoryRepository.createNew(categoryData);
        return newCategory;
    }

    /**
     * 
     * @param {string} categoryId ObjectId of category as string
     * @param {Object} categoryData Object containing information to update
     * @returns Updated category
     * @throws {ValidationError} If new fields are same as old fields or voilates the rules
     */
    async updateOne(categoryId, categoryData) {
        const category = await this.getOne(categoryId);

        // Matching duplicates
        const details = [];
        const keys = Object.keys(categoryData);
        for (let key of keys) {
            if (categoryData[key] === category[key]) {
                details.push({
                    field: key,
                    message: 'New value cannot be same as old value'
                });
                delete categoryData[key];
            }
        }
        if (details.length === keys.length) {
            throw new ValidationError('Duplicate update data', details);
        }
        const updatedCategory = this.categoryRepository.updateOne(categoryId, categoryData);
        return updatedCategory;
    }

    /**
     * 
     * @param {string} categoryId ObjectId of the category as string
     * @returns deleted category
     */
    async deleteOne(categoryId) {
        const category = await this.getOne(categoryId);
        await this.deleteOne(categoryId);
        return category;
    }
}

module.exports = CategoryService;