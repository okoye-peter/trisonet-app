import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/prisma';
import { asyncHandler } from '../middlewares/asyncHandler';
import { AppError } from '../utils/AppError';
import { sendSuccess } from '../utils/responseWrapper';
import { signAccessToken, signRefreshToken } from '../utils/jwt';

export const register = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { name, username, email, phone, region_id, country, password, confirm_password, referral_id } = req.body;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
        return next(new AppError('Email already in use', 400));
    }

    // const hashedPassword = await bcrypt.hash(password, 12);
    // const user = await prisma.user.create({
    //     data: {
    //         name,
    //         email,
    //         password: hashedPassword,
    //     },
    // });

    // const accessToken = signAccessToken(user.id);
    // const refreshToken = signRefreshToken(user.id);

    // await prisma.user.update({
    //     where: { id: user.id },
    //     data: { refreshToken },
    // });

    // sendSuccess(res, 201, 'User registered successfully', {
    //     user: { id: user.id, email: user.email, name: user.name },
    //     accessToken,
    //     refreshToken,
    // });

    sendSuccess(res, 201, 'User registered successfully');
});

export const login = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
        return next(new AppError('Incorrect email or password', 401));
    }

    const accessToken = signAccessToken(user.id);
    const refreshToken = signRefreshToken(user.id);

    await prisma.user.update({
        where: { id: user.id },
        data: { refreshToken },
    });

    sendSuccess(res, 200, 'User logged in successfully', {
        user: { id: user.id, email: user.email, name: user.name },
        accessToken,
        refreshToken,
    });
});

export const getNewToken = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { refreshToken } = req.body;
    try {
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || 'refresh_secret') as { id: string };
        const user = await prisma.user.findUnique({ where: { id: decoded.id } });

        if (!user || user.refreshToken !== refreshToken) {
            return next(new AppError('Invalid refresh token', 401));
        }

        const newAccessToken = signAccessToken(user.id);
        const newRefreshToken = signRefreshToken(user.id);

        await prisma.user.update({
            where: { id: user.id },
            data: { refreshToken: newRefreshToken },
        });

        sendSuccess(res, 200, 'Token refreshed successfully', {
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
        });
    } catch (error) {
        return next(new AppError('Invalid refresh token', 401));
    }
});
