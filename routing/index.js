
const addIngredientMW = require('./middlewares/addIngredient');
const addMealMW = require('./middlewares/addMeal');
const createIngredientMW = require('./middlewares/createIngredient');
const createRecieptMW = require('./middlewares/createReciept');
const getIngredientMW = require('./middlewares/getIngredient');
const getNewPasswordMW = require('./middlewares/getNewPassword');
const getRecipeMW = require('./middlewares/getRecipe');
const getTodaysCaloriesMW = require('./middlewares/getTodaysCalories');
const getTodaysMealsMW = require('./middlewares/getTodaysMeals');
const loginMW = require('./middlewares/login');
const logoutMW = require('./middlewares/logout');
const registerMW = require('./middlewares/register');
const renderMW = require('./middlewares/render');
const authMW = require('./middlewares/auth');

function subscireToRoutes (app) {
    
    const objRepo = {}

    app.get('/', renderMW(objRepo));
    app.post('login', loginMW(objRepo));
    app.post('/logout', logoutMW(objRepo));
    app.get('/register', registerMW(objRepo), renderMW(objRepo));
    app.get('/forgot_password', renderMW(objRepo));
    app.post('/forgot_password', getNewPasswordMW(objRepo));
    app.get('/today_calories', authMW(objRepo), getTodaysCaloriesMW(objRepo), getTodaysMealsMW(objRepo), renderMW(objRepo));
    app.get('/reciept', authMW(objRepo), getRecipeMW(objRepo), renderMW(objRepo));
    app.post('/reciept/add_ingredient', authMW(objRepo), addIngredientMW(objRepo));
    app.get('/reciept/new', authMW(objRepo), getIngredientMW(objRepo), renderMW(objRepo));
    app.post('/reciept/new', authMW(objRepo), createRecieptMW(objRepo));
    app.get('/ingredient', authMW(objRepo), renderMW(objRepo));
    app.post('/ingredient/new', authMW(objRepo), createIngredientMW(objRepo));
    app.get('/meal', authMW(objRepo), renderMW(objRepo));
    app.post('/meal', authMW(objRepo), addMealMW(objRepo));
}

module.exports = subscireToRoutes;