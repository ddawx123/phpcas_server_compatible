<?php
namespace app\index\controller;

class Index
{
    public function index()
    {
        return '当前数据中心公网IPv4地址：'.json_decode(file_get_contents('http://192.168.100.1/cgi-bin/getPubIP.cgi'), true)['outside_ip'];
    }
}
