<?php
namespace app\cas\controller;

use think\Controller;
use think\Db;
use think\Session;
use think\Cookie;

class Logout extends Controller
{
    public function index()
    {
        Session::delete('cas_cuser');
        Session::delete('cas_email');
        Session::delete('cas_token');
        $this->success('账号已登出', './login');
    }
}
