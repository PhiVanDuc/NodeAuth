var express = require('express');
var { Account } = require("../models/index");
var router = express.Router();

/* GET home page. */
router.get('/', async function(req, res, next) {
  if (!req.session.isLoggedIn) return res.redirect("/auth");

  try {
    const name = await Account.findOne({
      attributes: ['name'],
      where: {
        email: req.session.isLoggedIn.email
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
