module.exports = (req, res, next) => {

    //middleware added for route protection
    if (!req.session.isAuthenticated) {

        req.session.redirectTo = req.url;

        return res.redirect('/login')
    }
    next();
}