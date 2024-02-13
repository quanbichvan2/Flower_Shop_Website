var app = angular.module('myApp', ['ngRoute']);

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
    .when('/ContactUs', {
      templateUrl: 'ContactUs.html'
    })
    .when('/login', {
      templateUrl: 'login.html',
      controller: 'loginController'
    })
    .when('/register', {
      templateUrl: 'register.html'
    })
});

// Controller product
app.controller("productController", function ($scope, $http) {
  $scope.products = [];
  $http.get("/JS/products.js").then(function (dataConllection) {
    $scope.products = dataConllection.data;
    console.log($scope.products);
  });
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
app.controller('listController', function ($scope, $http) {
  $scope.displayedProducts = [];
  $scope.itemsPerPage = 4;
  $scope.currentPage = 1;

  $http.get("/JS/products.js").then(function (dataCollection) {
    $scope.displayedProducts = dataCollection.data;
    $scope.pageCount = Math.ceil($scope.products.length / $scope.itemsPerPage);
    $scope.pages = $scope.getPages();
  });

  $scope.changePage = function (newPage) {
    if (newPage > 0 && newPage <= $scope.pageCount) {
      $scope.currentPage = newPage;
    }
    // Tính toán chỉ hiển thị 9 sản phẩm mới cho mỗi trang
    var startIndex = ($scope.currentPage - 1) * $scope.itemsPerPage;
    var endIndex = startIndex + $scope.itemsPerPage;
    $scope.displayedProducts = $scope.products.slice(startIndex, endIndex);
  };

  $scope.getPages = function () {
    var pages = [];
    for (var i = 1; i <= $scope.pageCount; i++) {
      pages.push(i);
    }
    return pages;
  };
});


// Định nghĩa controller 'loginController'
app.controller('loginController', function ($scope, $location) {
  // Hàm xử lý submit form đăng nhập
  $scope.login = function () {
    // Kiểm tra xác thực tại đây, ví dụ:
    var email = $scope.emailForLogin;
    var password = $scope.passwordForLogin;
    // Kiểm tra điều kiện đăng nhập (Ví dụ đơn giản)
    if (email === 'admin@gmail.com' && password === 'admin123') {
      localStorage.setItem("isLogin", true);
      toggleProfile(); // Hiển thị phần profile
      $location.path('/');
    }
    else {
      // Nếu thông tin đăng nhập không chính xác, thông báo lỗi hoặc xử lý khác
      alert('Email hoặc mật khẩu không chính xác');
    }
  };
});


// Hàm kiểm tra số điện thoại hợp lệ
function isValidPhoneNumber(phoneNumber) {
  // Xóa các ký tự không phải số
  phoneNumber = phoneNumber.replace(/\D/g, '');
  // Kiểm tra có đúng 10 số không
  return phoneNumber.length === 10;
}

// app.controller("listController", function ($scope, $http) {
//   $scope.hienThiSanPham = [];
//   $scope.sanPhamTrenTrang = 4; // cái này là limitTo (giống dị)
//   $scope.trangHienTai = 1;
//   $http.get("/JS/products.js").then(function (response) {
//     $scope.hienThiSanPham = response.data;
//     $scope.demSoTrang = Math.ceil($scope.hienThiSanPham.length / $scope.sanPhamTrenTrang);
//     $scope.nhieuTrang = $scope.layTrang();
//   });
//   $scope.thayDoiTrang = function(trangMoi){
//     if(trangMoi > 0 && trangMoi <= $scope.demSoTrang){
//       $scope.trangHienTai = trangMoi;
//     }
//     var trangBatDau = ($scope.trangHienTai-1)* $scope.sanPhamTrenTrang;
//     var trangKetThuc = trangBatDau + $scope.sanPhamTrenTrang;
//     $scope.hienThiSanPham = $scope.product.slice(trangBatDau,trangKetThuc);
//   }
//   $scope.layTrang = function(){
//     var nhieuTrang = [];
//     for(var i = 1; i<= $scope.demSoTrang; i++){
//       nhieuTrang.push(i);
//     }
//     return nhieuTrang;
//   }
// });
/* ví dụ cụ thể:
 - data của bà có 12 sản phẩm mà 1 trang chỉ có 4 sản phẩm 
 - là có 3 trang (do đếm số trang đã đếm)
 < 1 2 3 >
 - sai
 1 2 3 4 5 6 7 8
 - đúng
 1 2 3 4
 5 6 7 8
 */