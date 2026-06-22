const { z } = require('zod');

// Old password only need lenght rule, but new password must follow all password rules
const changePasswordSchema = z.object({
    currentPassword: z.string()
        .min(8, 'Password must be atleast 8 characters long'),
    newPassword: z.string().trim()
        .min(8, 'Password must be atleast 8 characters long')
        .max(128, 'Password must not be longer than 128 characters')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/\d/, 'Password must contain at least one number')
        .regex(/[^A-Za-z0-9]/, 'Must contain at least one special character')
}).strict();

const changeUsernameSchema = z.object({
    password: z.string()
        .min(8, 'Password must be atleast 8 characters long'),
    newUsername: z.string().trim()
        .min(3, 'Username must be atleast 3 characters long')
        .max(20, 'Username cannot be larger than 20 characters')
        .toLowerCase()
}).strict();

const changeEmailSchema = z.object({
    password: z.string()
        .min(8, 'Password must be atleast 8 characters long'),
    newEmail: z.string().email().trim()
        .min(1, 'Email cannot be empty')
        .max(50, 'Email cannot be larger than 50 characters')
        .toLowerCase()
}).strict();

// Atleast one field should be present, thats why refined
const updateProfileSchema = z.object({
    firstname: z.string().trim()
        .min(1, 'Firstname cannot be empty')
        .max(20, 'Firstname cannot be larger than 20 characters')
        .optional(),
    lastname: z.string().trim()
        .min(1, 'Lastname cannot be empty')
        .max(20, 'Lastname cannot be larger than 20 characters')
        .optional(),
    dob: z.coerce.date().optional(),
    phone: z.string().trim().optional(),
    country_code: z.string().trim().optional()
}).refine((data) => Object.keys(data).length > 0, 'Atleast one value should be provided to update');

module.exports = {
    changePasswordSchema,
    changeUsernameSchema,
    changeEmailSchema,
    updateProfileSchema
};