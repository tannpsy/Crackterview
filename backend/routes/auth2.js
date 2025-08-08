// Backend/routes/auth.js
import { Router } from "express";
import passport from "../config/passport.js";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import nodemailer from "nodemailer";
import { isAuthenticated, isHR } from "../validators/auth.validator.js";

const router = Router();

// Helper untuk generate JWT token
const generateToken = (user) => {
    const payload = {
        id: user._id,
        isHR: user.isHR 
    };
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// @route POST /auth/signup
router.post("/signup", async (req, res, next) => {
    const { email, username, password } = req.body;

    try {
        if (!email || !username || !password) {
            return res.status(400).json({ message: "Please enter all fields" });
        }

        const userExists = await User.findOne({ $or: [{ email }, { username }] });
        if (userExists) {
            if (userExists.email === email) {
                return res.status(400).json({ message: "User with this email already exists" });
            } else {
                return res.status(400).json({ message: "User with this username already exists" });
            }
        }

        const user = await User.create({
            username,
            email,
            password,
            registerType: "normal",
            isHR: false 
        });

        const token = generateToken(user);
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 30 * 24 * 60 * 60 * 1000
        });
        res.status(201).json({
            _id: user._id,
            username: user.username,
            email: user.email,
            isHR: user.isHR,
            token
        });

    } catch (error) {
        console.error("Error during signup:", error);
        next(error);
    }
});

// @route POST /auth/login
router.post("/login", (req, res, next) => {
    passport.authenticate("local", { session: false }, (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.status(401).json({ message: info.message || "Invalid credentials" });
        }
        const token = generateToken(user);
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 30 * 24 * 60 * 60 * 1000
        });
        res.json({
            _id: user._id,
            username: user.username,
            email: user.email,
            isHR: user.isHR, 
            message: 'Login success!',
            token
        });
    })(req, res, next);
});


// @route POST /auth/logout
router.post("/logout", (req, res) => {
    res.clearCookie('token');
    res.json({ message: 'Logout successful!' });
});

// @route GET /auth/login/google
router.get("/login/google",
    passport.authenticate("google", { scope: ["profile", "email"], session: false })
);

// @route GET /auth/login/google/callback
router.get("/login/google/callback",
    passport.authenticate("google", { session: false, failureRedirect: '/login?error=google_failed' }),
    (req, res) => {
        if (req.user) {
            const token = generateToken(req.user); 
            res.cookie("token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 30 * 24 * 60 * 60 * 1000
            });
             res.redirect(`http://localhost:5173/google-success?token=${token}`);
        } else {
            res.redirect('/login?error=google_callback_failed');
        }
    }
);

// @route POST /auth/send-email
// const transporter = nodemailer.createTransport({
//     service: "gmail",
//     auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.GOOGLE_APP_PASSWORD
//     }
// });

// router.post("/send-email", async (req, res) => {
//     const { to, subject, text } = req.body;
//     try {
//         await transporter.sendMail({
//             from: process.env.EMAIL_USER,
//             to,
//             subject,
//             text
//         });
//         res.json({ success: true });
//     } catch (err) {
//         console.error("Error sending email:", err);
//         res.status(500).json({ success: false, message: err.message });
//     }
// });

// ... (your existing routes)

// @route POST /auth/send-email
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.GOOGLE_APP_PASSWORD,
    },
});

router.post(
    "/send-email",
    isAuthenticated,
    isHR,
    async (req, res) => {
        const { interviewId, hrNotes, hrRatings } = req.body;
        const userId = req.user._id;

        try {
            // Find the interview and ensure it belongs to the authenticated user
            const interview = await Interview.findOne({ _id: interviewId, userId: userId });

            if (!interview) {
                return res.status(404).json({ message: "Interview not found or you do not have permission." });
            }

            // Calculate the average HR rating
            const averageHrRating = Object.values(hrRatings).reduce((sum, current) => sum + current, 0) / Object.values(hrRatings).length;

            // Update the interview document with HR feedback
            interview.hrNotes = hrNotes;
            interview.hrRating = averageHrRating;
            interview.hrFeedbackProvided = true;
            interview.processStatus = "HR Reviewed";
            await interview.save();

            // Get candidate details to send the email
            const candidate = await Candidate.findById(interview.candidateId);
            if (!candidate) {
                return res.status(404).json({ message: "Candidate not found." });
            }

            // Construct the email content
            const subject = "Your Interview Feedback from " + req.user.username;
            const text = `
Hello ${candidate.name},

Thank you for participating in the interview for the ${candidate.position} position.

Here is the feedback from our HR team:
Average HR Rating: ${averageHrRating.toFixed(1)}/5

HR Notes:
"${hrNotes}"

We will be in touch with you shortly regarding the next steps.

Best regards,
The ${req.user.username} Team
`;

            // Send the email using Nodemailer
            await transporter.sendMail({
                from: process.env.EMAIL_USER,
                to: candidate.email,
                subject,
                text,
            });

            res.status(200).json({
                message: "Feedback saved and email sent successfully.",
                interview,
            });
        } catch (err) {
            console.error("Error sending email:", err);
            res.status(500).json({ success: false, message: err.message });
        }
    }
);

export default router;