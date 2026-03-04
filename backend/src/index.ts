import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { morganMiddleware } from './middlewares/morganMiddleware';
import { errorHandler } from './middlewares/errorHandler';

import { authRouter } from './routes/auth.routes';
import { uploadRouter } from './routes/upload.routes';
import { logRouter } from './routes/log.routes';

// Initialize background workers
import './queue';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// ─── Security Middlewares ─────────────────────────────────────────────────────
app.use(helmet()); // Sets secure HTTP headers

app.use(cors({
    origin: process.env.ALLOWED_ORIGINS?.split(',') || '*', // e.g. "http://localhost:5173,https://myapp.com"
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true, // Allow cookies/auth headers
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ─── Logging ──────────────────────────────────────────────────────────────────
app.use(morganMiddleware);

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/auth', authRouter);
app.use('/api/upload', uploadRouter);
app.use('/api/logs', logRouter);

app.all('/{*splat}', (req, res, next) => {
    res.status(404).json({
        status: 'fail',
        message: `Can't find ${req.originalUrl} on this server!`,
        data: null,
    });
});

app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});