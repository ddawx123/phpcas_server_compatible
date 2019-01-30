<?php
namespace app\cas\controller;

use think\Controller;
use think\Db;
use think\Session;
use think\Cookie;

class Ticket extends Controller
{
    public function index()
    {
	    return Session::get('cas_token');
    }
}
