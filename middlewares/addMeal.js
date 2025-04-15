/**
 * hozzáad egy ételt a napi ételekhez
 * @param objRepo 
 * @returns {function(*, *, *): *}
 */
module.exports = (objRepo) => {
    const UserModel = objRepo.UserModel;
    const IngredientModel = objRepo.IngredientModel;
    const ReceiptModel = objRepo.ReceiptModel;
    return (req, res, next) => {
        return UserModel.findOne({ username: req.session.user.username }).then((user) => {
            if (!user) {
                return res.status(404).send('User not found');
            }
            const meal = {
                _receiptId: req.body._receiptId,
                date: new Date(),
            };
            
            return ReceiptModel.findOne({ _id: req.body._receiptId }).then((meal) => {
                if (!meal) {
                    return res.status(404).send('Meal not found');
                }
                return IngredientModel.find({}).then((ingredients) => {
                    if (!ingredients) {
                        return res.status(404).send('Ingredients not found');
                    }
                    // Find the ingredients for the selected meal
                    const mealIngredients = ingredients.filter(ingredient =>
                        meal.ingredients.some(mealIngredient =>
                            ingredient._id.toString() === mealIngredient._ingredientId.toString()
                        )
                    )
                    console.log('Meal ingredients:', mealIngredients);
                    // Calculate the total calories, carbs, proteins, and fats for the meal
                    const totalCarbs = mealIngredients.reduce((sum, ingredient) => {
                        const ingredientAmount = meal.ingredients.find(mealIngredient =>
                            mealIngredient._ingredientId.toString() === ingredient._id.toString()
                        )?.amount;
                        return sum + ingredient.carbs * ingredientAmount / 100;
                    }, 0);
                    const totalProteins = mealIngredients.reduce((sum, ingredient) => {
                        const ingredientAmount = meal.ingredients.find(mealIngredient =>
                            mealIngredient._ingredientId.toString() === ingredient._id.toString()
                        )?.amount;
                        return sum + ingredient.protein * ingredientAmount / 100;
                    }, 0);
                    const totalFats = mealIngredients.reduce((sum, ingredient) => {
                        const ingredientAmount = meal.ingredients.find(mealIngredient =>
                            mealIngredient._ingredientId.toString() === ingredient._id.toString()
                        )?.amount;
                        return sum + ingredient.fat * ingredientAmount / 100;
                    }, 0);
                    // Update the user's consumed calories and macros
                    user.consumed_calories += meal.calories;
                    user.consumed_carbs += totalCarbs;
                    user.consumed_proteins += totalProteins;
                    user.consumed_fats += totalFats;
                    user.meals.push({
                        _receiptId: req.body._receiptId,
                        date: new Date(),
                    });
                    // Save the updated user
                    req.session.user = {
                        username: user.username,
                        goal_calories: user.goal_calories,
                        consumed_calories: user.consumed_calories,
                        consumed_carbs: user.consumed_carbs,
                        consumed_proteins: user.consumed_proteins,
                        consumed_fats: user.consumed_fats,
                        meals: user.meals,
                    };
                    return user.save().then(() => {
                        console.log('User updated:', user);
                        return res.redirect('/calorie_counter');
                    }).catch((err) => {
                        console.error('Error updating user:', err);
                        return next(err);
                    });

            })
        })
        })
    }
}
