const isAuthenticated = (req, res, next) => {
    return req.isAuthenticated() ? next() : res.status(401).redirect('/');
}

export { isAuthenticated }