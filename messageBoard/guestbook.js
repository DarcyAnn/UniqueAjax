/**
 * Created by Administrator on 2016-5-21.
 */
window.onload = function () {

    var oUser = document.getElementById('user');
    var oReg = document.getElementById('reg');
    var oLogin = document.getElementById('login');
    var oUserinfo = document.getElementById('userinfo');

    //验证用户名
    var oUsername1 = document.getElementById('username1');
    var oVerifyUserNameMsg = document.getElementById('verifyUserNameMsg');
    //初始化
    updateUserStatus();
    //更新用户状态
    function updateUserStatus() {
        var uid = getCookie('uid');
        var username = getCookie('username');
        if (uid) {
            oUser.style.display = 'block';
            oUserinfo.innerHTML = username;
            oReg.style.display = 'none';
            oLogin.style.display = 'none';
        } else {
            oUser.style.display = 'none';
            oUserinfo.innerHTML = '';
            oReg.style.display = 'block';
            oLogin.style.display = 'block';
        }
    }

    //初始化留言列表
    ajax('get', 'guestbook/index.php', 'm=index&a=getList&n=2', function (data) {
        var d = JSON.parse(data);
        if(d.code == 2){
            oList.innerHTML = '现在还没有留言，快来抢沙发~';
            oShowMore.style.display = 'none';
            return;
        }
        var arr = d.data.list;
        if (arr.length) {
            oShowMore.style.display = 'block';
            for (var i = 0; i < arr.length; i++) {
                createList(arr[i]);
            }
        }
    });

    //显示更多留言
    var oShowMore = document.getElementById('showMore');
    var oPage = 1;
    oShowMore.onclick = function () {
        oPage++;
        ajax('get', 'guestbook/index.php', 'm=index&a=getList&n=2&page=' + oPage, function (data) {
            var d = JSON.parse(data);
            if (d.code == 2){
                alert(d.message);
                oShowMore.style.display = 'none';
                return;
            }
            var arr = d.data.list;
            for (var i = 0; i < arr.length; i++) {
                createList(arr[i], true);
            }
        });
    }


    oUsername1.onblur = function () {
        ajax('get', 'guestbook/index.php', 'm=index&a=verifyUserName&username=' + this.value, function (data) {
            var d = JSON.parse(data);
            oVerifyUserNameMsg.innerHTML = d.message;

            if (d.code) {
                oVerifyUserNameMsg.style.color = "red";
            } else {
                oVerifyUserNameMsg.style.color = "green";
            }
        });
    }

    //注册
    var oRegBtn = document.getElementById('btnReg');
    var oPassword1 = document.getElementById('password1');
    oRegBtn.onclick = function () {
        ajax('post', 'guestbook/index.php', 'm=index&a=reg&username=' + encodeURI(oUsername1.value) + '&password=' + encodeURI(oPassword1.value), function (data) {
            var d = JSON.parse(data);
            alert(d.message);
        });
    }

    //登录
    var oLoginBtn = document.getElementById('btnLogin');
    var oUsername2 = document.getElementById('username2');
    var oPassword2 = document.getElementById('password2');
    oLoginBtn.onclick = function () {
        ajax('post', 'guestbook/index.php', 'm=index&a=login&username=' + encodeURI(oUsername2.value) + '&password=' + encodeURI(oPassword2.value), function (data) {
            var d = JSON.parse(data);
            alert(d.message);
            if (!d.code) {//code = 0,登录成功
                updateUserStatus();
            }
        });
    }

    //退出登录
    var oLogoutBtn = document.getElementById('logout');
    oLogoutBtn.onclick = function () {
        ajax('get', 'guestbook/index.php', 'm=index&a=logout', function (data) {
            var d = JSON.parse(data);
            alert(d.message);
            if (!d.code) {
                updateUserStatus();
            }
        });
        return false;//阻止a标签的默认跳转
    }


    //发表留言
    var oContent = document.getElementById('content');
    var oPostBtn = document.getElementById('btnPost');
    var oList = document.getElementById('list');
    oPostBtn.onclick = function () {
        ajax('post', 'guestbook/index.php', 'm=index&a=send&content=' + encodeURI(oContent.value), function (data) {
            var d = JSON.parse(data);
            alert(d.message);
            if (!d.code) {
                //添加刚刚写的留言到列表中
                createList(d.data, true);
            }
        });
    }

    //拿到cookie
    function getCookie(data) {
        var arr1 = document.cookie.split('; ');
        for (var i = 0; i < arr1.length; i++) {
            var arr2 = arr1[i].split('=');
            if (arr2[0] == data) {
                return arr2[1];
            }

        }
    }

    //展示留言列表
    function createList(data, insert) {
        var oDl = document.createElement('dl');
        var oDt = document.createElement('dt');
        var oStrong = document.createElement('strong');
        oStrong.innerHTML = data.username;
        oDt.appendChild(oStrong);
        oDl.appendChild(oDt);

        var oDd1 = document.createElement('dd');
        oDd1.innerHTML = data.content;
        oDl.appendChild(oDd1);

        var oDd2 = document.createElement('dd');
        oDd2.className = 't';
        var oA1 = document.createElement('a');
        oA1.href = '';
        oA1.innerHTML = '顶(' + data.support + ')';
        oDd2.appendChild(oA1);
        var oA2 = document.createElement('a');
        oA2.href = '';
        oA2.innerHTML = '踩(' + data.oppose + ')';
        oDd2.appendChild(oA2);
        oDl.appendChild(oDd2);

        if (insert && oList.children[0]) {
            oList.insertBefore(oDl, oList.firstChild);
        } else {
            oList.appendChild(oDl);
        }
    }

}