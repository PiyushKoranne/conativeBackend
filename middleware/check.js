module.exports = (req, res, next) => {
  let token = req.cookies.token ? true : false;
  if (token) {
    next();
  } else {
    res.render("common/login_1", {
      opt: "",
      msg: "Oops! That page can’t be found.",
    });
  }
};
