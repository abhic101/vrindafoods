const express = require('express');
const zodParser = require('../../middlewares/zodParser');
const auth = require('../../middlewares/auth');
const { createCategorySchema, updateCategorySchema } = require('category.schemas');

/**
 * 
 * @param {import('category.controller')} categoryController
 */
function createCategoryRoute(categoryController) {
    const router = express.Router();

    router.route('/')
        .get(auth('category:*:read:*'), categoryController.getAll)
        .post(zodParser(createCategorySchema), auth('category:*:create:*'), categoryController.createNew);
    router.route('/:id')
        .get(auth('category:*:read:*'), categoryController.getOne)
        .patch(zodParser(updateCategorySchema), auth('category:*:update:*'), categoryController.updateOne)
        .delete(auth('category:*:delete:*'), categoryController.deleteOne);
}

module.exports = createCategoryRoute;