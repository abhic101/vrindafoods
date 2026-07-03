const { z } = require('zod');

const createCategorySchema = z.object({
    name: z.string().trim()
        .min(3, 'Name should be atleast 3 characters long')
        .max(128, 'Name cannot be longer than 128 characters'),
    parent: z.string()
        .min(24, 'Invalid Parent')
        .max(24, 'Invalid Parent')
});

const updateCategorySchema = createCategorySchema.partial().refine((obj) => {
    Object.keys(obj).length > 0;
}, 'Atleast one value should be present to update');

module.exports = {
    createCategorySchema,
    updateCategorySchema
};