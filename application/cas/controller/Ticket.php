<?php
namespace app\cas\controller;

use think\Controller;
use think\Db;
use think\Session;
use think\Cookie;

/**
 * Ticket
 * 用于获取cas会话主机的ticket，仅供开发调试。生产环境建议删除
 * @package DingStudio/CAS
 * @subpackage CAS/Ticket
 * @author David Ding
 */
class Ticket extends Controller
{
    public function index()
    {
	    return Session::get('cas_token');
    }
}
