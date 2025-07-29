// Backend/config/passport.js
import passport from 'passport'
import { Strategy as LocalStrategy } from "passport-local"
import { ExtractJwt, Strategy as JwtStrategy } from "passport-jwt"
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import bcrypt from "bcrypt"
import User from '../models/User.js'
import dotenv from 'dotenv'
dotenv.config()

const config = {
    usernameField: "email",
    passwordField: "password"
}

passport.use(
    new LocalStrategy(config, async function (email, password, done) {
        try {
            const user = await User.findOne({ email });

            if (!user) {
                return done(null, false, { message: "User not found" });
            }

            if (!user.password && user.registerType === "normal") {
                 return done(null, false, { message: "Account not set up with password login." });
            }
            if (user.registerType !== "normal") {
                return done(null, false, { message: "Please login with your social account." });
            }

            const compareResult = await user.matchPassword(password);
            if (!compareResult) {
                return done(null, false, { message: "Invalid password" });
            }

            return done(null, user);
        } catch (error) {
            return done(error);
        }
    })
);

const jwtOption = {
    jwtFromRequest: ExtractJwt.fromExtractors([
        (req) => req.cookies.token || null
    ]),
    secretOrKey: process.env.JWT_SECRET
}

passport.use(
    "jwt",
    // PERBAIKAN DI SINI: Tambahkan `new JwtStrategy(jwtOption, ...)`
    new JwtStrategy(jwtOption, async (jwtPayload, done) => { // <-- INI YANG BENAR
        try {
            const foundUser = await User.findById(jwtPayload.id);
            if (!foundUser) {
                return done(null, false, { message: "User not found" });
            }
            done(null, foundUser);
        } catch (error) {
            return done(error);
        }
    })
);

const googleOption = {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:5000/auth/login/google/callback'
}

passport.use(
    new GoogleStrategy(googleOption, async (accessToken, refreshToken, profile, done) => {
        try {
            const email = profile.emails && profile.emails.length > 0 ? profile.emails[0].value : null;

            if (!email) {
                return done(null, false, { message: "No email found in Google profile." });
            }

            let foundUser = await User.findOne({
                $or: [
                    { socialId: profile.id, registerType: "google" },
                    { email: email }
                ]
            });

            if (foundUser) {
                if (foundUser.registerType === "normal" && !foundUser.socialId) {
                    foundUser.socialId = profile.id;
                    foundUser.registerType = "google";
                    await foundUser.save();
                } else if (foundUser.registerType === "google" && foundUser.socialId !== profile.id) {
                    return done(null, false, { message: "An account with this email already exists but is linked to a different Google account." });
                }
                return done(null, foundUser);
            }

            const newUser = await User.create({
                email: email,
                username: profile.displayName || profile.name.givenName || profile.id,
                socialId: profile.id,
                registerType: "google",
                isHR: false
            });

            return done(null, newUser);

        } catch (e) {
            console.error("Error in Google Strategy:", e);
            return done(e);
        }
    })
);

export default passport;