// Backend/validators/auth.validator.js
export async function isAuthenticated(req, res, next) {
    if (!req.user) {
        return res.status(401).json({ message: "Not Authorized. Please log in to access this resource." });
    }
    next();
}

export async function isOwner(req, res, next) {
    if (!req.user) {
        return res.status(401).json({ message: "Not Authorized." });
    }
    // ... logic isOwner
    next();
}

export async function isHR(req, res, next) {
    if (!req.user) {
        return res.status(401).json({ message: "Not Authorized. Please log in." });
    }
    if (req.user.isHR) {
        next();
    } else {
        return res.status(403).json({ message: "Forbidden. HR access required." });
    }
}