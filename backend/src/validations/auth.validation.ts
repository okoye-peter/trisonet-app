import { z } from 'zod';

export const registerSchema = z.object({
    body: z.object({
        name: z.string({ error: 'Name is required' }).min(2, 'Name must be at least 2 characters long').max(255, 'Name must be at most 255 characters long'),
        username: z.string({ error: 'Username is required' }).min(2, 'Username must be at least 2 characters long').max(50, 'Username must be at most 50 characters long').regex(/^[a-zA-Z0-9]+$/, 'Username must contain only alphanumeric characters'),
        email: z.string({ error: 'Email is required' }).email('Please provide a valid email address').max(255, 'Email must be at most 255 characters long'),
        phone: z.string({ error: 'Phone is required' }).min(10, 'Phone number must be at least 10 digits long').max(15, 'Phone number must be at most 15 digits long'),
        region_id: z.string({ error: 'Region is required' }).min(1, 'Region is required'),
        country: z.string({ error: 'Country is required' }).min(1, 'Country is required'),
        password: z.string({ error: 'Password is required' }).min(8, 'Password must be at least 8 characters long').max(255, 'Password must be at most 255 characters long'),
        confirm_password: z.string({ error: 'Confirm password is required' }).min(8, 'Confirm password must be at least 8 characters long').max(255, 'Confirm password must be at most 255 characters long'),
        referral_id: z.string({ error: 'Referral is required' }).min(1, 'Referral is required'),
        activation_code: z.string({ error: 'Referral is required' }).nullish(),
    }).refine((data) => data.password === data.confirm_password, {
        message: 'Passwords do not match',
        path: ['confirm_password'],
    }),
});

export const loginSchema = z.object({
    body: z.object({
        email: z.string({ error: 'Email is required' }).email('Please provide a valid email address'),
        password: z.string({ error: 'Password is required' }).min(1, 'Password is required'),
    }),
});

export const refreshTokenSchema = z.object({
    body: z.object({
        refreshToken: z.string({ error: 'Refresh token is required' }).min(1, 'Refresh token is required'),
    }),
});
