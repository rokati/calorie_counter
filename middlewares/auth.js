/**
 * authorization middleware
 * @param objRepo 
 * @returns {function(*, *, *): *}
 */
module.exports = (objRepo, view) => {
    return (req, res, next) => {
        if (typeof req.session.user === 'undefined') {
            return res.redirect('/');
        }
        res.locals.user = req.session.user;
        next();
    }
};