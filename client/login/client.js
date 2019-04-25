const handleLogin = (e) => {
    e.preventDefault();

    $("#domoMessage").animate({width:'hide'}, 350);

    if($("#user").val() == '' || $("#pass").val() == ''){
        handleError("RAWR! Username or password is empty");
    }


    sendAjax('POST', $("#loginForm").attr("action"), $("#loginForm").serialize(), redirect);

    return false;
}

const handleSignup = (e) => {
    e.preventDefault();

    $("#domoMessage").animate({width:'hide'}, 350);

    if($("#user").val() == '' || $("#pass").val() == '' || $("#pass2").val() == ''){
        handleError("RAWR! All fields are required");
        return false;
    }

    if($("#pass").val() !== $("#pass2").val()){
        handleError("RAWR! Passwords do not match");
    }

    sendAjax('POST', $("#signupForm").attr("action"), $("#signupForm").serialize(), redirect);
    return false;
}

const LoginWindow = (props) => {
    return(
        <form id="loginForm" name="loginForm"
        onSubmit={handleLogin}
        action="/login"
        method="POST"
        className="mainForm"
        >
        <label htmlFor="username">Username:</label>
        <input id="user" type="text" name="username" placeholder="username" />
        <label htmlFor="pass">Password: </label>
        <input id="pass" type="password" name="pass" placeholder="password" />
        <input type="hidden" name="_csrf" value={props.csrf}/>
        <input className="formSubmit" type="submit" value="Sign in" />
        </form>

    )
};

const SignupWindow = (props) => {
    return(
        <form id="signupForm"
            name="signupForm"
            onSubmit={handleSignup}
            action="/signup"
            method="POST"
            className="mainForm"
            >
            <label htmlFor="username">Username: </label>
            <input id="user" type="text" name="username" placeholder="username"/>
            <label htmlFor="pass">Password: </label>
            <input id="pass" type="password" name="pass" placeholder="password"/>
            <label htmlFor="pass2">Password: </label>
            <input id="pass2" type="password" name="pass2" placeholder="retype password"/>
            <input type="hidden" name="_csrf" value={props.csrf} />
            <input className="formSubmit" type="submit" value="Sign Up" />
        </form>
    )
};

const PasswordWindow = (props) => {
    return(
        
        <form id="passChangeForm" 
        name="passChangeForm" 
        action="/changePass" 
        method="POST" 
        className="mainForm">
          <label for="oldPass">old password: </label>
          <input id="oldPass" type="text" name="oldPass" placeholder="old password"/>
          <label for="newPass">new password: </label>
          <input id="newPass" type="password" name="newPass" placeholder="new password"/>
          <label for="newPass2">retype password: </label>
          <input id="newPass2" type="password" name="newPass2" placeholder="retype password"/>
          <input type="hidden" name="_csrf" value={props.csrf} />
          <input id="cps" className="formSubmit" type="submit" value="Change Password" />
        </form>
    )
}
 
const createLoginWindow = (csrf) => {
    ReactDOM.render(<LoginWindow csrf={csrf} />, document.querySelector("#content"));
};

const createSignupWindow = (csrf) => {
    ReactDOM.render(<SignupWindow csrf={csrf} />, document.querySelector("#content"));
};

const createPassWindow = (csrf) => {
    ReactDOM.render(<PasswordWindow csrf={csrf} />, document.querySelector("#content"));
}

const setup = (csrf) => {
    const loginButton = document.querySelector("#loginButton");
    const signupButton = document.querySelector("#signupButton");
    const changePassButton = document.querySelector("#changePassButton");

    if(signupButton){
        signupButton.addEventListener("click", (e) => {
            e.preventDefault();
            createSignupWindow(csrf);
            return false;
        });
    }
    if(loginButton){
        loginButton.addEventListener("click", (e) => {
            e.preventDefault();
            createLoginWindow(csrf);
            return false;
        });
        createLoginWindow(csrf);
    }
    if(changePassButton){
        changePassButton.addEventListener("click", (e) => {
            e.preventDefault();
            createPassWindow(csrf);
            return false;
        });
        createPassWindow(csrf);
    }
    
};

const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        setup(result.csrfToken);
    });
};

$(document).ready(function() {
    getToken();
});
