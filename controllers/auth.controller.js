const { string } = require('yup');
const bcrypt = require("bcrypt");
const parser = require('ua-parser-js');
const { v4: uuidv4 } = require('uuid');
const { Account, Login_Info } = require("../models/index"); 

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
            const token = req.cookies.token;

            try {
                const account = await Account.findOne({
                    where: { email },
                    include: {
                        model: Login_Info,
                    }
                });
                
                if (!account || !await bcrypt.compare(password, account.dataValues.password)) {
                    req.flash("login", "Email hoặc mật khẩu không tồn tại!");
                    req.flash("oldData", req.body);
                    return res.redirect('/auth/login');
                }

                if (!account.dataValues.status) {
                    req.flash("login", "Tài khoản chưa được kích hoạt!");
                    return res.redirect('/auth/login');
                }

                const user_agent = req.headers['user-agent'];
                const { browser, os } = parser(user_agent);

                if (!token) {
                    const token = uuidv4();
    
                        res.cookie('token', `${ token }`, {
                            maxAge: new Date('9999-1-1'),
                            path: "/",
                            httpOnly: true,
                        });
                        
                        await Login_Info.create({
                            account_id: account.dataValues.id,
                            token,
                            token_status: true,
                            browser_name: browser.name,
                            browser_version: browser.version,
                            os_name: os.name,
                            os_version: os.version
                        });
                } else {
                    await Login_Info.update({ token_status: true }, {
                        where: {
                            account_id: account.dataValues.id,
                        }
                    })

                    res.cookie('token', `${ account.dataValues.Login_Infos[0]?.token }`, {
                        maxAge: new Date('9999-1-1'),
                        path: "/",
                        httpOnly: true,
                    });
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
        const error_registor = req.flash('error_registor')[0];

        res.render('auth/registor', {
            req,
            error_registor,
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
            const { name, email, password, status } = req.body;
            const saltRounds = 10;

            try {
                if (isNaN(+status) || ( +status !== 0 && +status !== 1 )) {
                    req.flash('error_registor', 'Sai định dạng dữ liệu khi đăng ký tài khoản!');
                    return res.redirect("/auth/registor");
                }

                const hashedPassword = await bcrypt.hash(password, saltRounds);
                await Account.create({
                    name,
                    email,
                    password: hashedPassword,
                    status: +status === 0 ? false : true,
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