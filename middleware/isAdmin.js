module.exports = (req, res, next) => {

    //middleware added for admin protection
    if (!req.session.isAuthenticated) {
        return res.redirect('/login')
    }

    if (!req.user.isAdmin) {
        return res.redirect('/')
    }

    next();
}