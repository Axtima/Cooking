var app = angular.module('cooking.recipe');


app.factory('recipes', ['$http', 'auth', function ($http, auth) {

        var o = {
            recipes: []
        };
        o.get = function (id) {
            return $http.get('/rest/recipe/' + id).then(function (res) {
                return res.data;
            });
        };

        o.getAll = function () {
            return $http.get('/rest/recipe').success(function (data) {
                angular.copy(data, o.recipes);
            });
        };

        o.create = function (recipe) {
            return $http.post('/rest/recipe', recipe, {
                headers: {Authorization: 'Bearer ' + auth.getToken()}
            }).success(function (data) {
                o.recipes.push(data);
            });
        };

        o.upvote = function (recipe) {
            return $http.put('/rest/recipe/' + recipe._id + '/upvote', null, {
                headers: {Authorization: 'Bearer ' + auth.getToken()}
            }).success(function (data) {
                recipe.upvotes += 1;
            });
        };

        o.addComment = function (id, comment) {
            return $http.post('/rest/recipe/' + id + '/comments', comment, {
                headers: {Authorization: 'Bearer ' + auth.getToken()}
            });
        };

        return o;
    }]
        );