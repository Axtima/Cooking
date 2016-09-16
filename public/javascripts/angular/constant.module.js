var app = angular.module('cooking.constant', []);

app.constant('constants', {
    angularDirectory: '/javascripts/angular/',
    authTokenName: 'cooking-token',
    recipe: {
        version: {
            quick: 1,
            classic: 2,
            gastro: 3
        },
        difficulty: {
            easy: 1,
            medium: 2,
            hard: 3
        },
        cost: {
            low: 1,
            medium: 2,
            high: 3,
            veryHigh: 4
        }
    }
});
