<?php
namespace app\cas\controller;

use think\Controller;
use think\Db;
use think\Session;
use think\Cookie;
use think\Request;

class Login extends Controller
{
    private static $_isLogin = false;
    private static $_cuser;
    private static $_email;
    private static $_token;

    public function __construct() {
        if (Request::instance()->isPost() && Request::instance()->has('ticket','post')) {
            $ticket = Request::instance()->post('ticket');
            $userinfo = file_get_contents('https://passport.dingstudio.cn/api?format=json&action=verify&token='.$ticket.'&reqtime='.time());
            $userinfo = json_decode($userinfo, true);
            if ($userinfo['code'] == 200) {
                Session::set('cas_cuser', $userinfo['data']['username']);
                Session::set('cas_email', $userinfo['data']['usermail']);
                Session::set('cas_token', 'ST-'.$userinfo['data']['newtoken']);
                if (Request::instance()->has('service','get')) {
                    $url = Request::instance()->get('service');
                    if (!strpos($url, '?')) {
                        $url = $url.'?ticket='.'ST-'.$userinfo['data']['newtoken'];
                    } else {
                        $url = $url.'&ticket='.'ST-'.$userinfo['data']['newtoken'];
                    }
                } else {
                    $url = 'http://www.dingstudio.cn/?ticket='.'ST-'.$userinfo['data']['newtoken'];
                }
                $this->success('登录成功，正在跳转', $url);
            }
        } else {
            self::$_cuser = Session::get('cas_cuser');
            self::$_email = Session::get('cas_email');
            self::$_token = Session::get('cas_token');
            if (!is_null(self::$_cuser) && !is_null(self::$_token)) {
                self::$_isLogin = true;
            }
        }
    }

    public function index()
    {
        if (self::$_isLogin && Request::instance()->has('service','get')) {
            $url = Request::instance()->get('service');
            if (!strpos($url, '?')) {
                $url = $url.'?ticket='.self::$_token;
            } else {
                $url = $url.'&ticket='.self::$_token;
            }
            $this->success('登录成功，正在跳转', $url);
        }
	    return view();
    }
}
