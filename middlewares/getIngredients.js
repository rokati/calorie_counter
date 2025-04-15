/**
 * visszaad a már elkészített hozzávalókat
 * @param objRepo 
 * @returns {function(*, *, *): *}
 */
module.exports = (objRepo) => {
    const IngredientModel = objRepo.IngredientModel;
    return (req, res, next) => {
        IngredientModel.find({}).then((ingredients) => {
            res.locals.ingredients = ingredients;
            return next();
        }).catch((err) => {
            console.error('Error fetching ingredients:', err);
            return next(err);
        });
    }
};