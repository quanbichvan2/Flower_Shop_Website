var app = angular.module('myApp', ['ngRoute']);

app.run(function ($rootScope, $http) {

  // rootScope Products = []
  $rootScope.products = [];

  $http.get('./data/products.json').then(function (response) {
    $rootScope.products = response.data.Products
  });

  //rootscope islogin from session storage
  $rootScope.isLogin = sessionStorage.getItem('isLogin');

  // get carts from session storage
  $rootScope.carts = JSON.parse(sessionStorage.getItem('carts')) || [];

});


app.config(function ($routeProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'trang-chu.html',
      controller: 'productController'
    })
    .when('/list-view', {
      templateUrl: 'list-view.html',
      controller: 'listController'
    })
    .when('/chi-tiet-san-pham/:productID', {
      templateUrl: 'chi-tiet-san-pham.html',
      controller: 'productDetailController'
    })
    .when('/list-view2', {
      templateUrl: 'list-view2.html',
      controller: 'listController'
    })
    .when('/contactUs', {
      templateUrl: 'contactUs.html'
    })
    .when('/aboutUs', {
      templateUrl: 'aboutUs.html'
    })
    .when('/login', {
      templateUrl: 'login.html',
      controller: 'loginController'
    })
    .when('/register', {
      templateUrl: 'register.html',
      controller: 'registerController'
    })
    .when('/shoppingcart', {
      templateUrl: 'shoppingcart.html',
      controller: 'ShoppingCartController'
    })
});

// Controller product
app.controller("productController", function ($scope, $http) {

});

app.controller("productDetailController", function ($scope, $http, $routeParams) {
  $scope.productID = $routeParams.productID;
  console.log($scope.productID);

  // lọc 1 sản phẩm từ nhiều sản phẩm
  $scope.product = $scope.products.find(function (thamso) {
    return thamso.id == $scope.productID;
  });
});
// nghiên cứu thêm !!!!
app.controller('listController', function ($scope, $rootScope) {
  $scope.test = function(){
    console.log($rootScope.addToCart);
  }
  $scope.viewProducts = $rootScope.products;
  $scope.itemsPerPage = 4;
  // $scope.currentPage = 1; 
  $scope.currentPage = 0;
  $scope.pageSize = 4;
  $scope.pages = Math.floor($scope.viewProducts.length/$scope.pageSize);
  $scope.debug = function(){
    console.log('pages:' + $scope.pages);
    console.log('currentpage' + $scope.currentPage);
    // console.log($scope.pageSize);
    console.log($scope.filteredItems.length);
  }
  $scope.displayPages = Array.from({length: $scope.pages}, (_, index) => index + 1);
  $scope.getPages= function(item){
    $scope.currentPage = item-1;
  }
  
  // fillter products between 2 price
  $scope.minPrice = 0;
  $scope.maxPrice = 100;
  $scope.filterProducts = function () {
    $scope.viewProducts = $rootScope.products.filter(function (product) {
      return product.gia >= $scope.minPrice && product.gia <= $scope.maxPrice;
    });
    // $scope.viewProducts.sort(function (a, b) {
    //   return a.price - b.price;
    // });
  };

  $scope.filterProperty = 'gia';
  $scope.sortProducts = function(){
    if($scope.filterProperty === 'gia'){
      $scope.filterProperty = '-gia';
    }
    else{
      $scope.filterProperty = 'gia';
    }
  };
  
  $scope.selectedSize = 'medium';
});

// Định nghĩa controller 'loginController'
app.controller('loginController', function ($scope, $location, $rootScope) {
  // Hàm xử lý submit form đăng nhập

  $scope.logIn = function () {
    // Kiểm tra xác thực tại đây, ví dụ:

    var email = $scope.emailForLogin;
    var password = $scope.passwordForLogin;
    // Kiểm tra điều kiện đăng nhập (Ví dụ đơn giản)
    if (email === 'admin@gmail.com' && password === 'admin123') {
      // Nếu thông tin đăng nhập chính xác, chuyển hướng đến trang chủ
      $rootScope.isLogin = true;
      sessionStorage.setItem('isLogin', true);
      alert('Đăng nhập thành công');
      $location.path('/');
    }
    else {
      // Nếu thông tin đăng nhập không chính xác, thông báo lỗi hoặc xử lý khác
      alert('Email hoặc mật khẩu không chính xác');

    }
  };
});
app.controller('registerController', function ($scope, $location, $rootScope) {
  // Function to handle form submission
  $scope.submitForm = function () {
    // Perform any validation here if needed
    // If the form is valid, show an alert and redirect to index
    if ($scope.frmRegister.$valid) {
      $rootScope.isLogin = true;
      sessionStorage.setItem('isLogin', true);
      alert('Register success');
      $location.path('/'); // Change '/index' to your desired index page
    }
    else {
      alert('Register Fail');
    }
  };
});

app.controller('navbarController', function ($scope, $rootScope) {
  $scope.logOut = function () {
    $rootScope.isLogin = false;
    sessionStorage.setItem('isLogin', false);
    $location.path('/');
    alert('Đăng xuất thành công');
  };

});

app.controller("cartController", function ($scope, $rootScope, $http) {
  $scope.suggestProducts = [];
  // suggest products get from json file name products.js
  $http.get('./data/products.json').then(function (response) {
    $scope.suggestProducts = response.data.Products.slice(0, 4);
    console.log($scope.suggestProducts);
  });

  $rootScope.addToCart = function (product) {
    alert("added");
    var index = $rootScope.carts.findIndex(function (item) {
      return item.id === product.id;
    });

    if (index === -1) {
      product.quantity = 1;
      $rootScope.carts.push(product);
    } else {
      $rootScope.carts[index].quantity++;
    }
  };

  $scope.removeFromCart = function (product) {
    var index = $rootScope.carts.findIndex(function (item) {
      return item.id === product.id;
    });

    if (index !== -1) {
      $rootScope.carts.splice(index, 1);
    }
  };

  $scope.getTotal = function () {
    var total = 0;
    for (var i = 0; i < $rootScope.carts.length; i++) {
      total += $rootScope.carts[i].price * $rootScope.carts[i].quantity;
    }
    return total;
  };

  $scope.getQuantity = function () {
    var quantity = 0;
    for (var i = 0; i < $rootScope.carts.length; i++) {
      quantity += $rootScope.carts[i].quantity;
    }
    return quantity;
  };
});

// Định nghĩa controller cho shopping cart
app.controller('ShoppingCartController', function ($scope, $rootScope, $http) {

  $rootScope.suggestProducts = [];
  // suggest products get from json file name products.js
  $http.get('./data/products.json').then(function (response) {
    $rootScope.suggestProducts = response.data.Products.slice(0, 4);
    console.log($rootScope.suggestProducts);
  });


  // Khởi tạo giá trị cho biến carts từ $rootScope.products hoặc từ service của bạn
  $rootScope.carts = [];
  $rootScope.total = 0;
  $rootScope.discount = 0;
  console.log($rootScope.carts);

  // Hàm thêm sản phẩm vào giỏ hàng
  $rootScope.addItemToCart = function (item) {
    alert("added from item");
    var existingItem = $rootScope.carts.find(function (cartItem) {
      return cartItem.id === item.id;
    });
    
    if (existingItem) {
      existingItem.quantity++;
    } else {
      var newItem = angular.copy(item);
      newItem.quantity = 1;
      $rootScope.carts.push(newItem);
    }
    console.log($rootScope.carts);
  };

  // Hàm giảm số lượng
  $rootScope.decreaseQuantity = function (item) {
    if (item.quantity > 1) {
      item.quantity--;
    }
  };

  // Hàm tăng số lượng
  $rootScope.increaseQuantity = function (item) {
    item.quantity++;
  };

  // Hàm xóa một sản phẩm khỏi giỏ hàng
  $rootScope.removeItem = function (item) {
    var index = $rootScope.carts.indexOf(item);
    if (index !== -1) {
      $rootScope.carts.splice(index, 1);
    }
  };
  // Hàm tính tổng số tiền của tất cả các sản phẩm trong giỏ hàng
  $rootScope.getTotal = function () {
    $rootScope.total = 0; // Đặt lại tổng số tiền về 0 trước khi tính toán lại
    $rootScope.carts.forEach(function (item) {
      $rootScope.total += item.gia * item.quantity;
    });
    return $rootScope.total;
  };
  $rootScope.checkDiscount = function () {
    var check = $rootScope.checkDis;
    if (check === 'Ma10') {
      $rootScope.discount = 10;
    }
    else {
      alert("invalid Discount Code");
    }
  }
  $rootScope.getPriceDiscount = function () {
    return $rootScope.discount;
  }
  $rootScope.checkOut = function () {
    alert("Thank you for your purchase! \n\nYour come to 1234 Elm Street, Springfield, Anytown, USA to order or calling +1 (555) 123-4567 for help");
  }
});

