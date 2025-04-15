/**
 * visszaadja a belejelentkezett felhasználó mai kalóriabevitelét és bevitt makróit
 * @param objRepo 
 * @returns {function(*, *, *): *}
 */
module.exports = (objRepo) => {
    return (req, res, next) => {
        const meals = objRepo.USERDB.meals;
        let totalCalories = 0;
        let totalCarbs = 0;
        let totalProtein = 0;
        let totalFat = 0;
        res.locals.todaysMeals = meals.reduce((acc, meal) => {
            const receipt = objRepo.RECIEPTSDB.find(r => r._id === meal._receiptId);
            if (receipt) {
                acc.push(receipt);
            }
            return acc;
        }, []);

        meals.forEach(meal => {
            const receipt = objRepo.RECIEPTSDB.find(r => r._id === meal._receiptId);
            if (receipt && receipt.calories) {
                totalCalories += receipt.calories;
                totalCarbs += receipt.ingredients.reduce((sum, ingredient) => {
                    const ing = objRepo.INGREDIENTSDB.find(i => i._id === ingredient._ingredientId);
                    return sum + (ing ? ing.carbs * ingredient.amount / 100 : 0);
                }, 0);
                totalProtein += receipt.ingredients.reduce((sum, ingredient) => {
                    const ing = objRepo.INGREDIENTSDB.find(i => i._id === ingredient._ingredientId);
                    return sum + (ing ? ing.protein * ingredient.amount / 100 : 0);
                }, 0);
                totalFat += receipt.ingredients.reduce((sum, ingredient) => {
                    const ing = objRepo.INGREDIENTSDB.find(i => i._id === ingredient._ingredientId);
                    return sum + (ing ? ing.fat * ingredient.amount / 100 : 0);
                }, 0);
            }
        });

        res.locals.todaysCalories = totalCalories;
        res.locals.todaysCarbs = totalCarbs;
        res.locals.todaysProtein = totalProtein;
        res.locals.todaysFat = totalFat;
        return next();
    }
};