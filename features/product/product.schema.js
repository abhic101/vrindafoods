const { z } = require('zod');

const createProductSchema = z.object({
    name: z.string().trim()
        .min(3, 'Name should be atleast 3 characters long')
        .max(150, 'Name cannot be longer than 150 characters'),
    mrp: z.coerce.number()
        .min(1, 'MRP should be a positive number')
        .max(1000000, 'MRP cannot be greater than 1 million'),
    selling_price: z.coerce.number()
        .min(1, 'Selling price should be a positive number')
        .max(1000000, 'Selling price should be less than a million'),
    thumbnail: z.string().trim()
        .min(1, 'Add one thumbnail')
        .max(258, 'Exceeds max url length')
        .regex(/^((https?|ftps?):\/\/)?([\w\-]+\.)+[\w\-]+(\/[\w\-./?%&=]*)?$/, 'Invalid URL')
        .optional(),
    product_images: z.array(
        z.string().trim()
            .min(1, 'Add one thumbnail')
            .max(258, 'Exceeds max url length')
            .regex(/^((https?|ftps?):\/\/)?([\w\-]+\.)+[\w\-]+(\/[\w\-./?%&=]*)?$/, 'Invalid URL')
    ).optional(),
    units: z.coerce.number()
        .min(1, 'Listing should have atleast 1 unit')
        .max(1000000, 'Units cannot exceed 1 million'),
    amount: z.coerce.number()
        .min(0, 'Amount must be a positive integer')
        .max(1000000, 'Amount cannot exceed 1 million')
        .optional(),
    amount_unit: z.string().trim()
        .min(1, 'Please enter valid unit of the amount')
        .max(64, 'Length of a unit cannot exceed 64 characters'),
    description: z.string().trim()
        .min(1, 'Please enter valid description of the product')
        .max(2000, 'Product description cannot exceed 2000 characters')
        .optional(),
    seller: z.string().trim()
        .min(1, 'Seller cannot be empty string')
        .max(100, 'Seller cannot exceed 100 characters in length')
        .optional(),
    brand: z.string().trim()
        .min(1, 'Brand cannot be empty')
        .max(256, 'Brand length cannot exceed 256 characters'),
    category: z.string().trim()
        .min(1, 'Category cannot be empty')
        .max(128, 'Category cannot exceed 128 characters in length')
});

const updateProductSchema = createProductSchema.partial().refine(
    (schema) => Object.keys(schema) > 0,
    'Atleast one update should be present'
);

module.exports = {
    createProductSchema,
    updateProductSchema
}