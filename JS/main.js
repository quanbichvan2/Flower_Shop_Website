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
  $scope.itemsPerPage = 4;
  $scope.currentPage = 1;
  $scope.pageCount = Math.ceil($rootScope.products.length / $scope.itemsPerPage);
  $scope.getPages = function () {
    var pages = [];
    for (var i = 1; i <= $scope.pageCount; i++) {
      pages.push(i);
    }
    return pages;
  };
  $scope.displayedProducts = $rootScope.products.slice(0, $scope.itemsPerPage);
  $scope.pages = $scope.getPages();


  $scope.changePage = function (newPage) {
    if (newPage > 0 && newPage <= $scope.pageCount) {
      $scope.currentPage = newPage;
    }
    // Tính toán chỉ hiển thị 8 sản phẩm mới cho mỗi trang
    var startIndex = ($scope.currentPage - 1) * $scope.itemsPerPage;
    var endIndex = startIndex + $scope.itemsPerPage;
    $scope.displayedProducts = $rootScope.products.slice(startIndex, endIndex);
    console.log($scope.displayedProducts);
  };

  // fillter products between 2 price
  $scope.minPrice = 0;
  $scope.maxPrice = 100;
  $scope.filterProducts = function () {
    $scope.displayedProducts = $rootScope.products.filter(function (product) {
      return product.gia >= $scope.minPrice && product.gia <= $scope.maxPrice;
    });
    $scope.displayedProducts.sort(function (a, b) {
      return a.price - b.price;
    });
  };
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

  $scope.addToCart = function (product) {
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

  $scope.suggestProducts = [];
  // suggest products get from json file name products.js
  $http.get('./data/products.json').then(function (response) {
    $scope.suggestProducts = response.data.Products.slice(0, 4);
    console.log($scope.suggestProducts);
  });


  // Khởi tạo giá trị cho biến carts từ $rootScope.products hoặc từ service của bạn
  $scope.carts = [];
  $scope.total = 0;
  $scope.discount = 0;
  console.log($scope.carts);

  // Hàm thêm sản phẩm vào giỏ hàng
  $scope.addItemToCart = function (item) {
    var existingItem = $scope.carts.find(function (cartItem) {
      return cartItem.id === item.id;
    });

    if (existingItem) {
      existingItem.quantity++;
    } else {
      var newItem = angular.copy(item);
      newItem.quantity = 1;
      $scope.carts.push(newItem);
    }
  };

  // Hàm giảm số lượng
  $scope.decreaseQuantity = function (item) {
    if (item.quantity > 1) {
      item.quantity--;
    }
  };

  // Hàm tăng số lượng
  $scope.increaseQuantity = function (item) {
    item.quantity++;
  };

  // Hàm xóa một sản phẩm khỏi giỏ hàng
  $scope.removeItem = function (item) {
    var index = $scope.carts.indexOf(item);
    if (index !== -1) {
      $scope.carts.splice(index, 1);
    }
  };
  // Hàm tính tổng số tiền của tất cả các sản phẩm trong giỏ hàng
  $scope.getTotal = function () {
    $scope.total = 0; // Đặt lại tổng số tiền về 0 trước khi tính toán lại
    $scope.carts.forEach(function (item) {
      $scope.total += item.gia * item.quantity;
    });
    return $scope.total;
  };
  $scope.checkDiscount = function () {
    var check = $scope.checkDis;
    if (check === 'Ma10') {
      $scope.discount = 10;
    }
    else {
      alert("invalid Discount Code");
    }
  }
  $scope.getPriceDiscount = function () {
    return $scope.discount;
  }
  $scope.checkOut = function () {
    alert("Thank you for your purchase! \n\nYour come to 1234 Elm Street, Springfield, Anytown, USA to order or calling +1 (555) 123-4567 for help");
  }
});

