let emailInput = document.querySelector("#emailForLogin"); // Corrected id
let passwordInput = document.querySelector("#passwordForLogin"); // Corrected id
let loginForm = document.querySelector("#loginForm");

loginForm.addEventListener("submit", function (e) {
    e.preventDefault();
    login(); // Call the login function
});

const login = () => {
    if (emailInput.value === "admin@gmail.com" && passwordInput.value === "123") {
        localStorage.setItem("isLogin", true);
        window.location.href = "/";
        console.log(window.location);
    } else {
        alert("Thông tin đăng nhập bị sai vui lòng nhập lại!");
    }
};



//đặt biến isLogin = true nếu đã đăng nhập
let isLogin = Boolean(localStorage.getItem("isLogin"));
// nếu login true thì hiện menu profile và ẩn menu login
if (isLogin) {
    //.remove() xóa menu
    document.querySelector("#loginMenu").remove();
}
else {
    document.querySelector("#profileMenu").style.display = 'none';
    // style.display = 'none' ẩn menu
    // style.display = 'block' hiện menu
}
//hàm logout
const logout = () => {
    // .clear để xóa localStorage
    localStorage.clear();
    // .reload để tải lại trang
    window.location.reload();
}