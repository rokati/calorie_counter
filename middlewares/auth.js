/**
 * authorization middleware
 * @param objRepo 
 * @returns {function(*, *, *): *}
 */
module.exports = (objRepo, view) => {
    return (req, res, next) => {
        if (typeof req.session.username === 'undefined') {
            return res.redirect('/');
        }
        res.locals.username = req.session.username;
        next();
    }
};