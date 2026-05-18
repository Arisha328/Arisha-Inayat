module.exports = (req, res, next) => {
    // Session check logic
    if (req.session && req.session.isAdmin) {
        return next();
    }
    // Agar login nahi hai to login page par redirect karein
    res.redirect('/login'); 
};