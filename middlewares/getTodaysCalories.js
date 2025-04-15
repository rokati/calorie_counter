const Receipt = require("../models/receipt");

/**
 * visszaadja a belejelentkezett felhasználó mai kalóriabevitelét és bevitt makróit
 * @param objRepo 
 * @returns {function(*, *, *): *}
 */
module.exports = (objRepo) => {
    const UserModel = objRepo.UserModel;
    const ReceiptModel = objRepo.ReceiptModel;
    const IngredientModel = objRepo.IngredientModel;
    return (req, res, next) => {
        console.log('User meals:', req.session.user.meals);
        return ReceiptModel.find({}).then((receipts) => {
            const today = new Date().toISOString().slice(0, 10);
            
            const todayReceipts = req.session.user.meals.filter(receipt => {
                const receiptDate = new Date(receipt.date).toISOString().slice(0, 10);
                return receiptDate === today;
            });
            const notTodaysReceipts = req.session.user.meals.filter(receipt => {
                const receiptDate = new Date(receipt.date).toISOString().slice(0, 10);
                return receiptDate !== today;
            });

            console.log('Not today\'s receipts:', notTodaysReceipts);

            return IngredientModel.find({}).then((ingredients) => {
                if (!ingredients) {
                    return res.status(404).send('Ingredients not found');
                }
                res.locals.userMeals = receipts.filter(receipt =>
                    todayReceipts.some(meal =>
                        meal._receiptId.toString() === receipt._id.toString()
                    )
                );

                let totalCalories = req.session.user.consumed_calories;
                let totalCarbs = req.session.user.consumed_carbs;
                let totalProteins = req.session.user.consumed_proteins;
                let totalFats = req.session.user.consumed_fats;

                const notTodayMeals = receipts.filter(receipt =>
                    notTodaysReceipts.some(meal =>
                        meal._receiptId.toString() === receipt._id.toString()
                    )
                );

                for (let i = 0; i < notTodayMeals.length; i++) {
                    const meal = notTodayMeals[i];
                    const mealIngredients = ingredients.filter(ingredient =>
                        meal.ingredients.some(mealIngredient =>
                            ingredient._id.toString() === mealIngredient._ingredientId.toString()
                        )
                    );
                    
                    totalCarbs -= mealIngredients.reduce((sum, ingredient) => {
                        const ingredientAmount = meal.ingredients.find(mealIngredient =>
                            mealIngredient._ingredientId.toString() === ingredient._id.toString()
                        )?.amount;
                        return sum + ingredient.carbs * ingredientAmount / 100;
                    }, 0);
                    totalProteins -= mealIngredients.reduce((sum, ingredient) => {
                        const ingredientAmount = meal.ingredients.find(mealIngredient =>
                            mealIngredient._ingredientId.toString() === ingredient._id.toString()
                        )?.amount;
                        return sum + ingredient.protein * ingredientAmount / 100;
                    }, 0);
                    totalFats -= mealIngredients.reduce((sum, ingredient) => {
                        const ingredientAmount = meal.ingredients.find(mealIngredient =>
                            mealIngredient._ingredientId.toString() === ingredient._id.toString()
                        )?.amount;
                        return sum + ingredient.fat * ingredientAmount / 100;
                    }, 0);


                    totalCalories -= meal.calories;
                    console.log('Meal:', meal);
                    console.log('Meal ingredients:', mealIngredients);
                    console.log('Total calories:', totalCalories);
                    console.log('Total carbs:', totalCarbs);
                    console.log('Total proteins:', totalProteins);
                    console.log('Total fats:', totalFats);
                }
                req.session.user = {
                    ...req.session.user,
                    consumed_calories: totalCalories,
                    consumed_carbs: totalCarbs,
                    consumed_proteins: totalProteins,
                    consumed_fats: totalFats,
                    meals: todayReceipts,
                };
                res.locals.user = req.session.user;

                return UserModel.findOneAndUpdate(
                    { username: req.session.user.username },
                    {
                        consumed_calories: totalCalories,
                        consumed_carbs: totalCarbs,
                        consumed_proteins: totalProteins,
                        consumed_fats: totalFats,
                        meals: todayReceipts,
                    }
                ).then(() => {
                    console.log('User updated successfully:', req.session.user.username);
                    return next();
                }).catch((err) => { 
                    console.error('Error updating user:', err);
                    return next(err);
                });

            }).catch(err => {
                console.error('Error fetching ingredients:', err);
                return next(err);
            });             
        }).catch((err) => {
            console.error('Error fetching receipts:', err);
            return next(err);
        });
    }
};