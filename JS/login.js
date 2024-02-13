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