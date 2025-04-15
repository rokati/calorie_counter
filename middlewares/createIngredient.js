/**
 * elkészít egy új hozzávalót
 * @param objRepo 
 * @returns {function(*, *, *): *}
 */
module.exports = (objRepo) => {
    const IngredientModel = objRepo.IngredientModel;
    return (req, res, next) => {
        console.log('Creating new ingredient:', req.body);
        const newIngredient = new IngredientModel({
            name: req.body.name,
            carbs: req.body.carbs,
            protein: req.body.protein,
            fat: req.body.fat,
        });

        return newIngredient.save().then(() => {
            console.log('New ingredient created:', newIngredient);
            return res.redirect('/calorie_counter');
        }).catch((err) => {
            console.error('Error creating ingredient:', err);
            return next(err)
        });
    }
};