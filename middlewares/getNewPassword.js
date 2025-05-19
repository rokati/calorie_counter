const { rawListeners } = require("../models/receipt");

/**
 * visszaad az adott felhasználónak egy új jelszót
 * @param objRepo 
 * @returns {function(*, *, *): *}
 */
module.exports = (objRepo) => {
    const UserModel = objRepo.UserModel;
    return (req, res, next) => {
        const { username } = req.body;
        console.log('Generating new password for user:', username);
        // Find the user by username
        const newPassword = Math.random().toString(36).slice(-8); // Generate a random password
        return UserModel.findOneAndUpdate(
            { username: username },
            { password: newPassword },
        ).then(user => {
            // If user is not found, handle the error
            if (!user) {
                console.log('User not found:', username);
                return res.status(404).send('User not found.');
            }
            console.log('New password generated for user:', user.username, 'New password:', newPassword);
            return res.redirect('/'); // Redirect to login page after successful password generation
        }).catch(err => {
            console.error('Error generating new password:', err);
            return next(err);
        });
    }
};