var express = require('express');
var router = express.Router();
var { Account, Login_Info } = require('../models/index');

router.get('/', async (req, res) => {
    const detail_accounts = await Account.findOne({
        where: {
            id: 8,
        },
        include: {
            model: Login_Info
        }
    });

    // const login_infos = await Login_Info.findAll();

    res.json({ detail_accounts });
});

module.exports = router;