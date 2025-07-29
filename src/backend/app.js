// Backend/app.js
import express from 'express';
import authRouter from './routes/auth.js';
import interviewRouter from './routes/interview.js'; // <--- AKTIFKAN KEMBALI INI
import dashboardRouter from './routes/dashboard.js'; // <--- TAMBAH INI
import userRoutes from "./routes/userRoutes.js";
import cors from 'cors';
import passport from './config/passport.js';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

dotenv.config();

const app = express();
app.use(cookieParser());

app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
}));
app.use(express.json());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.use(passport.initialize());

app.use((req, res, next) => {
    if (!req.cookies.token) {
        return next();
    }
    passport.authenticate("jwt", { session: false }, (err, user, info) => {
        if (err) {
            console.error("JWT authentication error:", err);
            return next(err);
        }
        if (!user) {
            req.user = null;
            return next();
        }
        req.user = user;
        next();
    })(req, res, next);
});

// Rute API
app.use('/api/auth', authRouter);
app.use('/api/users', userRoutes);
app.use('/api/interviews', interviewRouter); // <--- AKTIFKAN KEMBALI INI
app.use('/api/dashboard', dashboardRouter); // <--- TAMBAH INI

// Middleware penanganan error global
app.use((err, req, res, next) => {
    console.error(err.stack);
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode).json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
});

export default app;