/**
 * kijelenetkezteti a felhasználót
 * @param objRepo 
 * @returns {function(*, *, *): *}
 */
module.exports = (objRepo) => {
    return (req, res, next) => {
        return req.session.destroy((err) => {
            if (err) {
                return next(err);
            }
            req.session = null;
            return res.redirect('/');
        });
    }
};