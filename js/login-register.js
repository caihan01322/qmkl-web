function showRegisterForm() {
    $('.loginBox').fadeOut('fast', function () {
        $('.registerBox').fadeIn('fast');
        $('.login-footer').fadeOut('fast', function () {
            $('.register-footer').fadeIn('fast');
        });
        $('.modal-title').html('使用第三方账号注册');
    });
    $('.error').removeClass('alert alert-danger').html('');
}

function showLoginForm() {
    $('#loginModal .registerBox').fadeOut('fast', function () {
        $('.loginBox').fadeIn('fast');
        $('.register-footer').fadeOut('fast', function () {
            $('.login-footer').fadeIn('fast');
        });
        $('.modal-title').html('使用第三方账号登陆');
    });
    $('.error').removeClass('alert alert-danger').html('');
}

function openLoginModal() {
    showLoginForm();
    setTimeout(function () {
        $('#loginModal').modal('show');
    }, 230);

}

function openRegisterModal() {
    showRegisterForm();
    setTimeout(function () {
        $('#loginModal').modal('show');
    }, 230);

}

//登陆请求
function loginAjax() {
    var myData = {
        username: $('#telephone_login').val(),
        password: hex_sha1($('#password_login').val())
    };
    var settings = {
        "async": true,
        "crossDomain": true,
        "url": urlprefix.concat("/user/login"),
        "method": "POST",
        "headers": {
            "Content-Type": "application/json",
            "cache-control": "no-cache"
        },
        "processData": false,
        "data": JSON.stringify(myData)
    };
    $.ajax(settings).done(function (response) {
        if(response.code === 200){
            var token = response.data;
            console.log("qmkl_token(cookie):"+token);
            //创建一个cookie并设置有效时间为 7天
            $.cookie('qmkl_token',token,{ expires: 7 });
            //获取用户信息
            userInfoAjax(token);
            $('#loginModal').modal('hide');
            //开始显示主页面
            showMain();
        }
        else {
            shakeModal();
        }
    });


    /*   Simulate error message from the server   */
    //shakeModal();
}

function shakeModal() {
    $('#loginModal .modal-dialog').addClass('shake');
    $('.error').addClass('alert alert-danger').append("无效的账号或密码");
    $('input[type="password"]').val('');
    setTimeout(function () {
        $('#loginModal .modal-dialog').removeClass('shake');
    }, 1000);
}

/**
 *  获取用户的个人信息来为后面的操作做准备，比如显示相应学校的文件
 * @param token
 */
function userInfoAjax(token) {
    //传输的数据
    var myData = {
        token: $.cookie('qmkl_token')
    };
    var settings = {
        "async": true,
        "crossDomain": true,
        "url":urlprefix.concat("/user/info"),
        "method": "POST",
        "headers": {
            "Content-Type": "application/json;charset=UTF-8",
            "cache-control": "no-cache"
        },
        "processData": false,
        "data": JSON.stringify(myData)
    };
    $.ajax(settings).done(function (response) {
        console.log(response);
        if(response.code === 200){
            //学校，不可改
            $.cookie("currentCollege",response.data["college"]);
            //手机号，不可改
            $.cookie("userPhone",response.data["phone"]);
            //性别，入学年龄，昵称（可修改）
            $.cookie("userGender",response.data["gender"]);
            $.cookie("userEnterYear",response.data["enterYear"]);
            $.cookie("userNickname",response.data["nickname"]);
            //学院
            $.cookie("userAcademy",response.data["academy"]);
            //用户id，用于修改头像
            $.cookie("userID",response.data["id"]);
        }
    });
}