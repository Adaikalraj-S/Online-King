const tags = ["api", "Transactions"];

const { category_controllers, car_brands_controllers, orders_controllers, transactions_controllers } = require("../controllers");

const {
    categoriesValidators,
    usersValidation,
    headerValidator,
    carBrandsValidators,
    ordersValidator,
    transactionsValidators
} = require("../validators");

const transaction_routes = [
    {
        method: "GET",
        path: "/fetch-tansactions-admin",
        options: {
            description: "Fetch all transactions for Admins.",
            validate: {
                headers: headerValidator,
                query: transactionsValidators.transaction_validators
            },
            tags,
            handler: transactions_controllers.getAllTransactionsAdmin,
        },
    }
];

module.exports = transaction_routes;