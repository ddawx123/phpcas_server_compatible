<?php
namespace app\cas\controller;

use think\Controller;
use think\Db;
use think\Session;
use think\Cookie;

class Index extends Controller
{
    public function index()
    {
	    $this->success('正在转向', './login');
    }
}
