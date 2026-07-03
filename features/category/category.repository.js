const { ConflictError, NotFoundError } = require('../../errors/app.errors');
const { buildConflictErrorDetails } = require('../../errors/error.utils');

class CategoryRepository {

    /**
     * 
     * @param {import('../../models/category.model')} CategoryModel 
     * @param {import('../../repositories/sharedCategory.repository')} sharedCategoryRepository 
     */
    constructor (CategoryModel, sharedCategoryRepository) {
        this.CategoryModel = CategoryModel;
        this.sharedCategoryRepository = sharedCategoryRepository;
    }

    /**
     * 
     * @returns All categories. Empty array [] if none found
     */
    async getAll() {
        const allCategories = await this.CategoryModel.find({ isActive: true })
            .populate({ path: 'ancestors', select: 'name _id' })
            .populate({ path: 'parent', select: 'name _id' })
            .lean();
        
        return allCategories;
    }

    /**
     * 
     * @param {string} categoryId ObjectId of category as string
     * @returns Found Category document. returns null if not found
     */
    async getOne(categoryId) {
        const category = await this.sharedCategoryRepository.findById(categoryId)
            .populate({ path: 'ancestors', select: 'name _id' })
            .populate({ path: 'parent', select: 'name _id' })
            .select('name parent ancestors')
            .lean();
        
        return category;
    }

    /**
     * 
     * @param {Object} categoryData Object containing data to create a new category
     * @returns Newly created category document
     * @throws {ConflictError} If the category already exists
     */
    async createNew(categoryData) {
        try {
            const newCategory = await this.sharedCategoryRepository.addNew(categoryData).save();
            return newCategory;
        } catch(err) {
            if (err.code === 11000) {
                const details = buildConflictErrorDetails;
                throw new ConflictError('Category already exits', details, {cause: err});
            }
            throw err;
        }
    }

    /**
     * 
     * @param {string} categoryId ObjectId of category as string
     * @param {Object} categoryData Object containing information to update
     * @throws {ConflictError} If unique properties of the category are modified and they already exists
     * @throws {NotFoundError} If the category does not exists 
     */
    async updateOne(categoryId, categoryData) {
        try {
            const updatedCategory = await this.CategoryModel.findOneAndUpdate({_id: categoryId},
                { $set: updateData },
                { runValidators: true, returnDocument: after }
            );
        } catch(err) {
            if (err.code === 11000) {
                const details = buildConflictErrorDetails;
                throw new ConflictError('Invalid updated fields', details, {cause: err});
            }
            if (err.name === 'DocumentNotFoundError') {
                throw new NotFoundError('Category does not exists');
            }
            throw err;
        }
    }

    /**
     * Soft Deletes the given category
     * @param {string} categoryId ObjectId of the category as string
     */
    async deleteOne(categoryId) {
         try {
            const deletedCategory = await this.CategoryModel.findOneAndUpdate({_id: categoryId},
                { $set: {isActive: false} },
                { returnDocument: before }
            );
        } catch(err) {
            if (err.name === 'DocumentNotFoundError') {
                throw new NotFoundError('Category does not exists');
            }
            throw err;
        }
    }
}

module.exports = CategoryRepository;