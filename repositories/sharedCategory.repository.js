const { default: mongoose } = require('mongoose');

class CategoryRepository {

    /**
     * 
     * @param {import('../models/category.model')} CategoryModel
     */
    constructor(CategoryModel) {
        this.CategoryModel = CategoryModel;
    }

    /**
     * 
     * @param {string} categoryId ObjectId of the category as string
     * @returns {mongoose.Query} Unexecuted mongoose query object to the complete category document
     */
    findById(categoryId) {
        const categoryQuery = this.CategoryModel.findOne({_id: categoryId, isActive: true});
        return categoryQuery;
    }

    /**
     * 
     * @param {string} categoryName Name of the category
     * @returns {mongoose.Query} Unexecuted query object to all the category documents with same name
     */
    findByName(categoryName) {
        const categoryQuery = this.CategoryModel.find({name: categoryName, isActive: true});
        return categoryQuery;
    }

    /**
     * 
     * @returns Unexecuted query to all the category documents
     */
    findAll() {
        const categoryQuery = this.CategoryModel.find({isActive: true});
        return categoryQuery;
    }

    /**
     * 
     * @param {Object} categoryData Plain object containing fields and data in proper format
     * @returns Unexecuted newly created category document object
     */
    addNew(categoryData) {
        const newCategory = new this.CategoryModel(categoryData);
        return newCategory;
    }

    /**
     * Soft delete a category document
     * 
     * @param {string} categoryId ObjectId of the category as string
     * @returns {mongoose.Query} Unexecuted mongoose query object to the complete category document
     */
    delete(categoryId) {
        const categoryQuery = this.CategoryModel.findOneAndUpdate(
            {_id: categoryId, isActive: true},
            { isActive: false }
        );

        return categoryQuery;
    }
}

module.exports = CategoryRepository;