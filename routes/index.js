var express = require('express');
var { Account, Login_Info } = require("../models/index");
var router = express.Router();
var authMiddleware = require("../middlewares/auth.middleware");

/* GET home page. */
router.get('/', authMiddleware, async function(req, res, next) {
  try {
    const login_info = await Login_Info.findOne({
      where: {
        token: req.cookies.token,
      },
      include: {
        model: Account
      }
    });

    const account = await Account.findOne({
      where: {
        id: login_info.dataValues.account_id
      },
      include: {
        model: Login_Info
      }
    });

    const array = account.dataValues.Login_Infos.map((item) => {
      return item.dataValues
    })
    console.log(array);

    res.render('index', {
      name: account.dataValues.name,
      login_info: account.dataValues.Login_Infos.map((item) => {
        return item.dataValues
      })
    });
  }
  catch(e) {
    return next(e);
  }
});

router.get('/logout', async (req, res) => {
  await Login_Info.update({
      token_status: false,
    },
    {
      where: {
        token: req.cookies.token,
      },
    }
  )
  
  return res.redirect("auth");
});

module.exports = router;
