const inputUsername = document.getElementById('inputUsername');
const inputPassword = document.getElementById('inputPassword');
const btnLogin = document.getElementById('btnLogin');

btnLogin.addEventListener('click', () => {
    const Username = inputUsername.value;
    const Password = inputPassword.value;
    if (Username === 'admin' && Password === 'admin123') {
        alert('login successful')
        window.location.assign("./home.html")
    } else {
        alert('login failed');
    }


})