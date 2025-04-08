/**
 * authorization middleware
 * @param objRepo 
 * @returns {function(*, *, *): *}
 */
module.exports = (objRepo, view) => {
    return (req, res, next) => {
        return next();
    }
};