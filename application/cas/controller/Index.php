<?php
namespace app\cas\controller;

use think\Controller;
use think\Db;
use think\Session;
use think\Cookie;

/**
 * Default
 * CAS认证空页面的自动转向
 * @package DingStudio/CAS
 * @subpackage CAS/Index
 * @author David Ding
 */
class Index extends Controller
{
    public function index()
    {
	    $this->success('正在转向', './login');
    }
}
