class CategoryController {
    
    /**
     * 
     * @param {import('./category.service')} categoryService 
     */
    constructor(categoryService) {
        this.categoryService = categoryService;
    }

    getAll = async (req, res, next) => {
        try{
            const allCategories = await this.categoryService.getAll();
            res.status(200).json({
                success: true,
                message: 'All available categories and subcategories are fetched',
                allCategories
            });
        } catch(err) {
            next(err);
        }
    }

    getOne = async (req, res, next) => {
        try {
            const category = await this.categoryService.getOne(req.params.id);
            res.status(200).json({
                success: true,
                message: 'Feched required category',
                category
            });
        } catch(err) {
            next(err);
        }
    }

    createNew = async (req, res, next) => {
        try {
            const newCategory = this.categoryService.createNew(req.body);
            res.status(200).json({
                success: true,
                message: 'Category successfully created',
                newCategory
            });
        } catch(err) {
            next(err);
        }
    }

    updateOne = async (req, res, next) => {
        try {
            const updatedCategory = this.categoryService.updateOne(req.params.id, req.body);
            res.status(200).json({
                success: true,
                message: 'Category updated successfully',
                updatedCategory
            });
        } catch(err) {
            next(err);
        }
    }

    deleteOne = async (req, res, next) => {
        try {
            this.categoryService.deleteOne(req.params.id);
            res.status(200).json({
                success: true,
                message: "Category successfully deleted"
            });
        } catch(err) {
            next(err);
        }
    }
}

module.exports = CategoryController;