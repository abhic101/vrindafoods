const { z } = require("zod");

// Login request schema, parse req.body . Should be strict() always
const loginSchema = z.object({
    email: z.string().email().trim().optional(),
    username: z.string().trim()
        .min(3, 'Username must be atleast 3 characters long')
        .optional(),
    password: z.string()
        .min(8, 'Password must be atleast 8 characters long')
}).refine((data) => {
    const keys = Object.keys(data);
    for (let key of keys) if (key === 'email' || key === 'username') return true;
}, 'Please provide either username or email').strict();

// Signup request schema, parses req.body . Shape can be different from db
// Feature to add - age limit by dynamically calculating from dob
const signupSchema = z.object({
    email: z.string().email().trim()
        .min(1, 'Email cannot be empty')
        .max(50, 'Email cannot be larger than 50 characters'),
    username: z.string().trim()
        .min(3, 'Username must be atleast 3 characters long')
        .max(20, 'Username cannot be larger than 20 characters')
        .regex(/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, underscores, and hyphens'),
    password: z.string().trim()
        .min(8, 'Password must be atleast 8 characters long')
        .max(128, 'Password cannot be larger than 20 characters')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/\d/, 'Password must contain at least one number')
        .regex(/[^A-Za-z0-9]/, 'Must contain at least one special character'),
    firstname: z.string().trim()
        .min(1, 'Firstname cannot be empty')
        .max(20, 'Firstname cannot be larger than 20 characters'),
    lastname: z.string().trim()
        .min(1, 'Lastname cannot be empty')
        .max(20, 'Lastname cannot be larger than 20 characters'),
    dob: z.coerce.date(),
    phone: z.string().trim().optional(),
    country_code: z.string().trim().optional()
});

module.exports = {
    loginSchema,
    signupSchema
};