const { string } = require('yup');

module.exports = {
    index: (req, res, next) => {
        res.render('auth/index');
    },

    login: (req, res, next) => {
        res.render('auth/login', {
            req,
        });
    },

    handleLogin: async (req, res, next) => {
        const body = await req.validate(req.body, {
            email: string().required('Yêu cầu nhập email!').email("Email không đúng định dạng!").max(200, "Email quá dài!"),
            password: string().required('Yêu cầu nhập mật khẩu!')
        });

        return res.redirect('/auth/login');
    },

    registor: (req, res, next) => {
        res.render('auth/registor', {
            req,
        });
    },

    handleRegistor: async (req, res, next) => {
        console.log(req.body);

        const body = await req.validate(req.body, {
            name: string().required('Yêu cầu nhập đầy đủ tên!'),
            email: string().required('Yêu cầu nhập email!').email("Email không đúng định dạng!").max(200, "Email quá dài!"),
            password: string().required('Yêu cầu nhập mật khẩu!').min(10, "Mật khẩu quá ngắn!")
        });

        return res.redirect('/auth/registor');
    }
}