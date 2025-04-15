/**
 * betölti a megadott oldalt
 * @param objRepo 
 * @returns {function(*, *, *): *}
 */
module.exports = (objRepo, view) => {
    return (req, res, next) => {
        if (res.locals.user === undefined) {
            res.locals.user = {
                username: 'asd',
                password: 'asd',
                meals: [],
            }
        }
        if (res.locals.ingredients === undefined) {
            res.locals.ingredients = [
                { name: 'alma', calorie: 50 },
                { name: 'körte', calorie: 60 },
                { name: 'szilva', calorie: 70 },
            ];
        }
        if (res.locals.meals === undefined) {
            res.locals.meals = [
                { name: 'ebéd', calorie: 500 },
                { name: 'vacsora', calorie: 600 },
            ];
        }
        res.render(view,res.locals);
    }
};