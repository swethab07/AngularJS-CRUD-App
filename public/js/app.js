var app= angular.module('myapp',['ngRoute']);
 
app.config(function($routeProvider){

	$routeProvider.when('/register',{
		templateUrl: 'views/register.html',
		controller: 'regController'
	})
	.when('/',{
		template : 'Welcome to my website!!!'
	})
	.when('/login',{
		templateUrl: 'views/login.html',
		controller: 'loginController'
	})
	.when('/home',{
		templateUrl: 'views/home.html',
		controller: 'homeController',
		resolve: ['authService', function(authService){
			return authService.checkStatus();
		}]
	})
	.when('/post',{
		templateUrl: 'views/post.html',
		controller: 'postController'
	})
	.when('/jobposts',{
		templateUrl: 'views/jobposts.html',
		controller: 'jobpostController'
	})
	.when('/appjobs',{
		templateUrl: 'views/appjobs.html',
		controller: 'appjobController'
	})
	.when('/savejobs',{
		templateUrl: 'views/savejobs.html',
		controller: 'savejobController'
	})
	.when('/search/:tag',{
		templateUrl: 'views/search.html',
		controller: 'searchController'
	});
});

//making home page authenticated
app.factory('authService', function($http, $location, $q){
	return{
		'checkStatus': function(){
			console.log("factory auth service");
			var defer= $q.defer();
			// $http.get('http://localhost:3000/check_usr_status').then(function(resp){
				// if(!resp.data.isLoggedIn){	
				// 	defer.reject();
				// 	$location.path('/');
				// }else{
				// 	console.log('resolve');
				// 	defer.resolve();
				// }
			// });
			console.log("factory service ",localStorage.isLoggedIn);
			if(localStorage.isLoggedIn) {
				console.log("resolve service");
				defer.resolve();
			} else {
				defer.reject();
				$location.path('/');
			}
			return defer.promise;
		}
	};
});

//registration
app.controller('regController', function($scope,$http){
	$scope.registerForm={};

	$scope.register= function(){
		console.log($scope.registerForm);
		$http.post("http://localhost:3000/register",$scope.registerForm).then((resp)=>{
            if(resp.data.success == true){
            	console.log(resp.data.msg);
            } else {
            	console.log(resp.data.msg);
            }  

		});
	};
});

//login
app.controller('loginController',function($scope, $rootScope, $http, $location){
	$scope.login= function(){
		console.log("login");
		$http.post('http://localhost:3000/authenticate', $scope.loginForm).then((resp, err)=>{
				console.log("responce from server", resp);
				$rootScope.userType= resp.data.docs.username;
				$rootScope.userId= resp.data.docs._id;
				console.log($rootScope.userType, $rootScope.userId);
				if(resp.data.flg==true){
					localStorage.isLoggedIn = true;
					$rootScope.isLoggedIn= true;
					$location.path('/home');
				}
				else{
					console.log("Error!!!");
				}
		});
	};
});


//home
app.controller('homeController', function($scope, $rootScope){
	console.log($rootScope.userType);
	if($rootScope.userType== 'company'){
		$scope.flg= true;
	}else{
		$scope.flg=false;
	}
});

//posting new jobs
app.controller('postController', function( $scope, $http, $location){
	$scope.posts={};
	$scope.post= function(){
		$http.post('http://localhost:3000/post', $scope.posts).then((resp)=>{
			 if(resp.data.success == true){
            	console.log(resp.data.msg);
            } else {
            	console.log(resp.data.msg);
            }  

		});
	};
});

//list of jobs
app.controller('jobpostController', function($scope, $http){
	$scope.posts={};

	$http.get('/jobposts').then((resp)=>{
		console.log(resp);
		$scope.posts= resp.data;
	});	
});

//search
// app.controller('searchController', function($scope, $http){
// 	$scope.search={};
// 	$scope.searchPost=function(){

// 	}
// 	$http.post('http://localhost:3000/search',$scope.search).then(function(resp){
// 		console.log(resp);
// 		// $scope.search= resp.data;
// 	});
// });





//logout
// app.controller('logoutController', function($scope, $http, $location){
// 	$scope.logout= function(){
// 		$http.post('http://localhost:3000/logout').then(function(resp){
// 			if(resp.data.flg==false){
// 				localStorage.isLoggedIn = false;
// 				$location.path('/');
// 			}
// 		});
// 	}
// });