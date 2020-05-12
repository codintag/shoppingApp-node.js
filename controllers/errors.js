exports.get404Page = (req, res, next) => {
    res.status(404).render('404', { title: 'Page Not Found' });
}

exports.get500Page = (req, res, next) => {
    res.status(500).render('error/500', { title: 'please try again!' });
}