
const addIngredientMW = require('../middlewares/addIngredient');
const addMealMW = require('../middlewares/addMeal');
const createIngredientMW = require('../middlewares/createIngredient');
const createReceiptMW = require('../middlewares/createReceipt');
const getIngredientMW = require('../middlewares/getIngredient');
const getNewPasswordMW = require('../middlewares/getNewPassword');
const getReceiptsMW = require('../middlewares/getReceipts');
const getTodaysCaloriesMW = require('../middlewares/getTodaysCalories');
const getTodaysMealsMW = require('../middlewares/getTodaysMeals');
const loginMW = require('../middlewares/login');
const logoutMW = require('../middlewares/logout');
const registerMW = require('../middlewares/register');
const renderMW = require('../middlewares/render');
const authMW = require('../middlewares/auth');

function subscireToRoutes (app) {
    
    const objRepo = {}

    app.get('/', renderMW(objRepo, 'index'));
    app.post('login', loginMW(objRepo));
    app.post('/logout', logoutMW(objRepo));
    app.get('/register', registerMW(objRepo), renderMW(objRepo, 'register'));
    app.get('/forgot_password', renderMW(objRepo, 'forgotten_password'));
    app.post('/forgot_password', getNewPasswordMW(objRepo));
    app.get('/calorie_counter', authMW(objRepo), getTodaysCaloriesMW(objRepo), getTodaysMealsMW(objRepo), renderMW(objRepo, 'calorie_counter'));
    app.post('/reciept/add_ingredient', authMW(objRepo), addIngredientMW(objRepo));
    app.get('/reciept/delete_ingredient/:id', authMW(objRepo)); /** TODO: megcsinálni a törlés funkciót az ingredienthez*/
    app.get('/reciept/new', authMW(objRepo), getIngredientMW(objRepo), renderMW(objRepo, 'reciept'));
    app.post('/reciept/new', authMW(objRepo), createReceiptMW(objRepo));
    app.get('/ingredient', authMW(objRepo), renderMW(objRepo, 'ingredient'));
    app.post('/ingredient/new', authMW(objRepo), createIngredientMW(objRepo));
    app.get('/meal', authMW(objRepo), getReceiptsMW(objRepo), renderMW(objRepo, 'meal'));
    app.post('/meal', authMW(objRepo), addMealMW(objRepo));
}

module.exports = subscireToRoutes;