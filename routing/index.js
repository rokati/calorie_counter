
const addIngredientMW = require('../middlewares/addIngredient');
const addMealMW = require('../middlewares/addMeal');
const createIngredientMW = require('../middlewares/createIngredient');
const createReceiptMW = require('../middlewares/createReceipt');
const getIngredientMW = require('../middlewares/getIngredient');
const getIngredientsMW = require('../middlewares/getIngredients');
const getNewPasswordMW = require('../middlewares/getNewPassword');
const getReceiptsMW = require('../middlewares/getReceipts');
const getTodaysCaloriesMW = require('../middlewares/getTodaysCalories');
const loginMW = require('../middlewares/login');
const logoutMW = require('../middlewares/logout');
const registerMW = require('../middlewares/register');
const renderMW = require('../middlewares/render');
const authMW = require('../middlewares/auth');

const IngredientModel = require('../models/ingredient');
const ReceiptModel = require('../models/receipt');
const UserModel = require('../models/user');

function subscireToRoutes (app) {
    const objRepo = {
        IngredientModel,
        ReceiptModel,
        UserModel,

        INGREDIENTSDB: [],
        RECIEPTSDB: [],
        USERDB: {
            _id: (Math.random()+"").substring(2),
            username: 'admin',
            password: 'admin',
            meals: [],
        },
    };

    app.get(
        '/', 
        renderMW(objRepo, 'index'));
    app.post(
        '/login', 
        loginMW(objRepo));
    app.post(
        '/logout', 
        logoutMW(objRepo));
    app.get(
        '/register', 
        renderMW(objRepo, 'register'));
    app.post(
        '/register',
        registerMW(objRepo));

    app.get(
        '/forgot_password', 
        renderMW(objRepo, 'forgotten_password'));
    app.post(
        '/forgot_password', 
        getNewPasswordMW(objRepo));
    app.get(
        '/calorie_counter', 
        authMW(objRepo), 
        getTodaysCaloriesMW(objRepo),  
        renderMW(objRepo, 'calorie_counter'));
    app.post(
        '/reciept/add_ingredient', 
        authMW(objRepo), 
        addIngredientMW(objRepo));
    app.get(
        '/reciept/delete_ingredient/:id', 
        authMW(objRepo)); /** TODO: megcsinálni a törlés funkciót az ingredienthez*/
    app.get(
        '/reciept/new', 
        authMW(objRepo), 
        getIngredientsMW(objRepo), 
        renderMW(objRepo, 'receipt'));
    app.post(
        '/reciept/new', 
        authMW(objRepo), 
        createReceiptMW(objRepo));
    app.get(
        '/ingredient', 
        authMW(objRepo), 
        renderMW(objRepo, 'ingredient'));
    app.post(
        '/ingredient/new', 
        authMW(objRepo), 
        createIngredientMW(objRepo));
    app.get(
        '/meal', 
        authMW(objRepo), 
        getReceiptsMW(objRepo), 
        renderMW(objRepo, 'meal'));
    app.post(
        '/meal', 
        authMW(objRepo), 
        addMealMW(objRepo));

    app.use((err, req, res, next) => {
        console.error(err);
        res.end('Something went wrong!');
    });
}

module.exports = subscireToRoutes;