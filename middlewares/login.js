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
        
        if (req.body.username === 'asd' && req.body.password === 'asd') {
            req.session.loggedIn = true;
            req.session.username = req.body.username;
            return req.session.save(() => {
                return res.redirect('/calorie_counter');
            });
        }
        return res.redirect('/');
    }
};