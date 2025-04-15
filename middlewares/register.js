/**
 * regisztrál egy felhasználót az adatbázisban
 * 
 * @param objRepo 
 * @returns {function(*, *, *): *}
 */
module.exports = (objRepo) => {
    const UserModel = objRepo.UserModel;
    return (req, res, next) => {

        console.log('Registering user:', req.body);
        // Extract username and password from request body
        const { name, password, goal_calories } = req.body;
        UserModel.findOne({ username: name }).then(existingUser => {
            if (existingUser) {
                return res.status(400).send('Username already exists.');
            }

            // Create a new user
            const newUser = new UserModel({
                username: name,
                password: password,
                goal_calories: goal_calories,
                consumed_calories: 0,
                consumed_carbs: 0,
                consumed_proteins: 0,
                consumed_fats: 0,
                meals: [],
            });

            return newUser.save().then(() => {
                console.log('New user registered:', newUser);
                return res.redirect('/'); // Redirect to login page after successful registration
            });
        }).catch(err => {
            console.error('Error during registration:', err);
            return next(err);
        });

    }
};