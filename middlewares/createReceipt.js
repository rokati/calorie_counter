/**
 * elkészít egy új receptet
 * @param objRepo 
 * @returns {function(*, *, *): *}
 */
module.exports = (objRepo) => {
    const ReceiptModel = objRepo.ReceiptModel;
    const IngredientModel = objRepo.IngredientModel;
    return (req, res, next) => {
        var calories = 0;
        const ingredients = req.body.ingredients.map((ingredient) => {
          return {
            _ingredientId: ingredient._ingredientId,
            amount: ingredient.amount
          }
        });
        calories = req.body.ingredients.reduce((acc, ingredient) => {
            return acc + ingredient.calorie;
        }, 0);
            
        const newRecipe = new ReceiptModel({
            name: req.body.name,
            ingredients: ingredients,
            calories: calories
        });
        return newRecipe.save().then(() => {
            console.log('New recipe created:', newRecipe);
            return res.redirect('/calorie_counter');
        }).catch((err) => {
            console.error('Error creating recipe:', err);
            return next(err)
        });
    }
};