<?php
namespace app\cas\controller;

use think\Controller;
use think\Db;
use think\Session;
use think\Cookie;
use think\Request;

/**
 * Logout
 * 实现CAS协议中的单点登出机制
 * @package DingStudio/CAS
 * @subpackage CAS/Logout
 * @author David Ding
 */
class Logout extends Controller
{
    public function index()
    {
        Session::delete('cas_cuser');
        Session::delete('cas_email');
        Session::delete('cas_token');
        if (Request::instance()->has('url','get')) {
            $to_url = Request::instance()->get('url');
        } else if (Request::instance()->has('service','get')) {
            $to_url = Request::instance()->get('service');
        } else {
            $to_url = './login';
        }
        $this->assign('redir_url', $to_url);
        return $this->fetch('index');
    }
}
