const { string } = require('yup');
const bcrypt = require("bcrypt");
const { Account } = require("../models/index");

module.exports = {
    index: (req, res, next) => {
        const registor = req.flash("registor")[0];

        res.render('auth/index', { 
            registor,
        });
    },

    login: (req, res, next) => {
        const login = req.flash("login")[0];
        const oldData = req.flash("oldData")[0];

        res.render('auth/login', {
            req,
            login,
            oldData
        });
    },

    handleLogin: async (req, res, next) => {
        const body = await req.validate(req.body, {
            email: string().required('Yêu cầu nhập email!').email("Email không đúng định dạng!").max(200, "Email quá dài!"),
            password: string().required('Yêu cầu nhập mật khẩu!')
        });

        if (body) {
            const { email, password } = req.body;

            try {
                const account = await Account.findOne({
                    where: { email }
                });
                
                if (!account || !await bcrypt.compare(password, account.dataValues.password)) {
                    req.flash("login", "Email hoặc mật khẩu không tồn tại!");
                    req.flash("oldData", req.body);
                    console.log(req.body);
                    return res.redirect('/auth/login');
                }

                req.session.isLoggedIn = {
                    email,
                    name: account.dataValues.name,
                }
                return res.redirect('/');
            }
            catch(e) {
                return next(e);
            }
        }
        else return res.redirect('/auth/login');
    },

    registor: (req, res, next) => {
        res.render('auth/registor', {
            req,
        });
    },

    handleRegistor: async (req, res, next) => {
        const body = await req.validate(req.body, {
            name: string().required('Yêu cầu nhập đầy đủ tên!'),
            email: string().required('Yêu cầu nhập email!').email("Email không đúng định dạng!").max(200, "Email quá dài!").test("check-dup", "Email đã tồn tại!", async (value) => {
                try {
                    const account = await Account.findOne({
                        where: {
                            email: value,
                        }
                    })

                    return !account;
                }
                catch(e) {
                    return next(e);
                }
            }),
            password: string().required('Yêu cầu nhập mật khẩu!').min(10, "Mật khẩu quá ngắn!")
        });

        if (body) {
            const { name, email, password } = req.body;
            const saltRounds = 10;

            try {
                const hashedPassword = await bcrypt.hash(password, saltRounds);
                await Account.create({
                    name,
                    email,
                    password: hashedPassword
                });

                req.flash("registor", "Đăng kí tài khoảng thành công!");
                return res.redirect("/auth/login");
            }
            catch(e) {
                return next(e);
            }
        }
        else return res.redirect('/auth/registor');
    }
}