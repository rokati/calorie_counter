/**
 * regisztrál egy felhasználót az adatbázisban
 * 
 * @param objRepo 
 * @returns {function(*, *, *): *}
 */
module.exports = (objRepo) => {
    const UserModel = objRepo.UserModel;
    return (req, res, next) => {
        // Check if the request method is POST
        if (req.method === 'POST') {
            console.log('Registering user:', req.body);
            // Check if the user is already logged in
            if (req.session.loggedIn) {
                return res.redirect('/calorie_counter'); // Redirect to calorie counter page if already logged in
            }
            // Extract username and password from request body
            const { username, password, goal_calories } = req.body;
            UserModel.findOne({ username }).then(existingUser => {
                if (existingUser) {
                    return res.status(400).send('Username already exists.');
                }

                // Create a new user
                const newUser = new UserModel({
                    username,
                    password, // In a real application, hash the password before saving
                });

                return newUser.save().then(() => {
                    console.log('New user registered:', newUser);
                    return res.redirect('/login'); // Redirect to login page after successful registration
                });
            }).catch(err => {
                console.error('Error during registration:', err);
                return next(err);
            });
        } else if (req.method === 'GET') {
            // Render the registration page if the request method is GET
            next(); // Call next middleware to render the registration page
        }
        
    }
};