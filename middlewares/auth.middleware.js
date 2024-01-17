module.exports = (req, res, next) => {
    const pathname = req.originalUrl;

    if (pathname === '/' && !req.session.isLoggedIn) {
        return res.redirect('/auth');
    } else if ((pathname === '/auth' || pathname === '/auth/login' || pathname === '/auth/registor') && req.session.isLoggedIn) {
        return res.redirect('/');
    }

    next();
}