/**
 * hozzáad a recepthez egy hozzávalót
 * @param objRepo 
 * @returns {function(*, *, *): *}
 */
module.exports = (objRepo) => {
    return (req, res, next) => {
        return next();
    }
};