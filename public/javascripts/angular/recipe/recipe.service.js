var app = angular.module('cooking.recipe');

app.factory('recipeService', ['$http', 'authService', function ($http, authService) {

        var o = {
            recipes: []
        };
        o.get = function (id) {
            return $http.get('/rest/recipe/' + id).then(function (res) {
                return res.data;
            });
        };

        o.getAll = function () {
            return $http.get('/rest/recipe').then(function (res) {
                return res.data;
            });
        };

        o.search = function (searchText) {
            return $http.get('/rest/recipe/search', {
                params: {searchText: searchText}
            }).then(function (res) {
                return res.data;
            });
        };

        o.create = function (recipe) {
            return $http.post('/rest/recipe', recipe, {
                headers: {Authorization: 'Bearer ' + authService.getToken()}
            }).success(function (data) {
                o.recipes.push(data);
            });
        };

        o.addTrick = function (id, trick) {
            return $http.post('/rest/recipe/trick/' + id, trick, {
                headers: {Authorization: 'Bearer ' + authService.getToken()}
            });
        };

        o.downvoteTrick = function (trick) {
            return $http.post('/rest/recipe/trick/downvote/' + trick._id, null, {
                headers: {Authorization: 'Bearer ' + authService.getToken()}
            });
        };

        o.upvoteTrick = function (trick) {
            return $http.post('/rest/recipe/trick/upvote/' + trick._id, null, {
                headers: {Authorization: 'Bearer ' + authService.getToken()}
            });
        };

        o.addComment = function (id, comment) {
            return $http.post('/rest/comment/recipe/' + id, comment, {
                headers: {Authorization: 'Bearer ' + authService.getToken()}
            });
        };
        return o;
    }]
        );