import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';
import { logger } from '../utils/logger';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if (process.env.NODE_ENV === 'development') {
        logger.error(`${err.statusCode} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip} - ${err.stack}`);
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
            data: err,
            stack: err.stack,
        });
    } else {
        // Production
        if (err.isOperational) {
            logger.warn(`${err.statusCode} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
            res.status(err.statusCode).json({
                status: err.status,
                message: err.message,
                data: null,
            });
        } else {
            // Programming or other unknown error: don't leak error details
            logger.error(`CRITICAL: ${err.statusCode} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip} - ${err.stack}`);
            res.status(500).json({
                status: 'error',
                message: 'Something went very wrong!',
                data: null,
            });
        }
    }
};
