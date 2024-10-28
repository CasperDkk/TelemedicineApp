// Middleware for role-based access control
function authorizeRoles(roles) {
    return (req, res, next) => {
        const userRole = req.session.role; // Because role is stored in session
        if (!roles.includes(userRole)) {
            return res.status(403).json({ error: 'Access denied' });
        }
        next();
    };
}

module.exports = { authorizeRoles };