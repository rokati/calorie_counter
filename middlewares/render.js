/**
 * betölti a megadott oldalt
 * @param objRepo 
 * @returns {function(*, *, *): *}
 */
module.exports = (objRepo, view) => {
    return (req, res, next) => {
        res.render(view,{});
    }
};