/**
 * bejelentkezteti a felhasználót
 * @param objRepo 
 * @returns {function(*, *, *): *}
 */
module.exports = (objRepo) => {
    const UserModel = objRepo.UserModel;
    return (req, res, next) => {
        if (req.session.loggedIn === true) {
            return res.redirect('/calorie_counter');
        }
        UserModel.findOne({ username: req.body.username}).then(user => {
            if (!user) {
                // User not found
                return res.render('index', { error: 'User not found.' });
            }
            if (user.password !== req.body.password) {
                // Incorrect password
                return res.render('index', { error: 'Password is not correct.' });
            }
            // Successful login
            req.session.loggedIn = true;
            req.session.user = {
                username: user.username,
                goal_calories: user.goal_calories,
                consumed_calories: user.consumed_calories,
                consumed_carbs: user.consumed_carbs,
                consumed_proteins: user.consumed_proteins,
                consumed_fats: user.consumed_fats,
                meals: user.meals,
            }
            req.session.save(err => {
                if (err) {
                    console.error('Error saving session:', err);
                    return next(err); // Pass the error to the next middleware
                }
                return res.redirect('/calorie_counter');
            });
        }).catch(err => {
            console.error('Error during login:', err);
            return next(err);
        });
    }
};