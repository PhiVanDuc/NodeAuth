const { Account, Login_Info } = require('../models/index');

module.exports = async (req, res, next) => {
    const pathname = req.originalUrl;
    const token = req.cookies.token;

    if (pathname === '/') {
        if (!token) return res.redirect('/auth');
        else {
            const login_info = await Login_Info.findOne({
                where: {
                    token,
                }
            });
    
            if (!login_info?.dataValues.token_status) return res.redirect('/auth');
        }
    }
    else if (pathname === '/auth' || pathname === '/auth/login' || pathname === '/auth/registor') {
        if (token) {
            const login_info = await Login_Info.findOne({
                where: {
                    token,
                }
            });
    
            if (login_info?.dataValues.token_status) return res.redirect('/');
        }
    }

    next();
}