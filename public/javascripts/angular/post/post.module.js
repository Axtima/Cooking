var app = angular.module('cooking.post', ['cooking.auth']);

app.factory('posts', ['$http', 'authService', function ($http, authService) {

        var o = {
            posts: []
        };
        o.get = function (id) {
            return $http.get('/rest/posts/' + id).then(function (res) {
                return res.data;
            });
        };
        
        o.getAll = function () {
            return $http.get('/rest/posts').success(function (data) {
                angular.copy(data, o.posts);
            });
        };
        
        o.create = function (post) {
            return $http.post('/rest/posts', post, {
                headers: {Authorization: 'Bearer ' + authService.getToken()}
            }).success(function (data) {
                o.posts.push(data);
            });
        };

        o.upvote = function (post) {
            return $http.put('/rest/posts/' + post._id + '/upvote', null, {
                headers: {Authorization: 'Bearer ' + authService.getToken()}
            }).success(function (data) {
                post.upvotes += 1;
            });
        };

        o.addComment = function (id, comment) {
            return $http.post('/rest/posts/' + id + '/comments', comment, {
                headers: {Authorization: 'Bearer ' + authService.getToken()}
            });
        };

        o.upvoteComment = function (post, comment) {
            return $http.put('/rest/posts/' + post._id + '/comments/' + comment._id + '/upvote', null, {
                headers: {Authorization: 'Bearer ' + authService.getToken()}
            }).success(function (data) {
                comment.upvotes += 1;
            });
        };
        
        return o;
    }]
        );

app.controller('PostsCtrl', [
    '$scope',
    'posts',
    'post',
    'authService',
    function ($scope, posts, post, authService) {
        $scope.post = post;
        $scope.isLoggedIn = authService.isLoggedIn;
        $scope.addComment = function () {
            if ($scope.body === '') {
                return;
            }
            posts.addComment(post._id, {
                body: $scope.body,
                author: 'user',
            }).success(function (comment) {
                $scope.post.comments.push(comment);
            });
            $scope.body = '';
        };
        $scope.incrementUpvotes = function (comment) {
            posts.upvoteComment(post, comment);
        };
    }]);