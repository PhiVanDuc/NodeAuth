var express = require('express');
var { Account } = require("../models/index");
var router = express.Router();
var authMiddleware = require("../middlewares/auth.middleware");

/* GET home page. */
router.get('/', authMiddleware, async function(req, res, next) {
  try {
    const name = await Account.findOne({
      attributes: ['name'],
      where: {
        email: req.session.isLoggedIn?.email
      }
    });

    res.render('index', {
      name: name.dataValues.name
    });
  }
  catch(e) {
    return next(e);
  }
});

router.get('/logout', (req, res) => {
  req.session.isLoggedIn = null;
  return res.redirect("auth");
});

module.exports = router;
