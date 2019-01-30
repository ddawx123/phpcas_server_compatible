<?php
namespace app\cas\controller;

use think\Controller;
use think\Db;
use think\Session;
use think\Cookie;
use think\Request;

class Servicevalidate
{
    private static $_cuser;
    private static $_email;
    private static $_token;

    public function __construct() {
        self::$_cuser = Session::get('cas_cuser');
        self::$_email = Session::get('cas_email');
        self::$_token = Session::get('cas_token');
    }

    public function index()
    {
        $this->gen_response('CAS用户','cas@dingstudio.cn','casuser');
        if (Request::instance()->has('ticket','get')) {
            $tgt = Request::instance()->get('ticket');
            $tgt = explode('ST-', $tgt)[1];
            $userinfo = file_get_contents('https://passport.dingstudio.cn/api?format=json&action=verify&token='.$tgt.'&reqtime='.time());
            $userinfo = json_decode($userinfo, true);
            if ($userinfo['code'] == 200) {
                $newtoken = 'ST-'.$userinfo['data']['newtoken'];
                Session::set('cas_token', $newtoken);
                $this->gen_response(self::$_cuser,self::$_email,$newtoken);
            } else {
                $this->show_err('INVALID_TICKET', '票据无效');
            }
        } else {
            $this->show_err('INVALID_TICKET', '票据无效');
        }
    }

    /**
     * 创建会话信息报文
     */
    private function gen_response($user, $mail, $token) {
        header('Content-Type: text/xml; charset=UTF-8');
        $xml = self::xmlEncode(array(
            'cas:user'=>$user,
            'cas:attributes'=>array(
                'cas:email'=>$mail,
                'cas:access_token'=>$token
            )
        ),'cas:authenticationSuccess','item','','id','utf-8');
        exit($xml);
    }

    /**
     * CAS报错封装
     */
    private function show_err($code, $detail) {
        header('Content-Type: text/xml; charset=UTF-8');
        $xml = "<cas:serviceResponse xmlns:cas='http://www.yale.edu/tp/cas'>";
        $xml .= "<cas:authenticationFailure code='".$code."'>".$detail."</cas:authenticationFailure>";
        $xml .= "</cas:serviceResponse>";
        exit($xml);
    }

    /**
     * XML编码
     * @param mixed $data 数据
     * @param string $root 根节点名
     * @param string $item 数字索引的子节点名
     * @param string $attr 根节点属性
     * @param string $id   数字索引子节点key转换的属性名
     * @param string $encoding 数据编码
     * @return string
     */
    protected function xmlEncode($data, $root, $item, $attr, $id, $encoding)
    {
        if (is_array($attr)) {
            $array = [];
            foreach ($attr as $key => $value) {
                $array[] = "{$key}=\"{$value}\"";
            }
            $attr = implode(' ', $array);
        }
        $attr = trim($attr);
        $attr = empty($attr) ? '' : " {$attr}";
        $xml  = "<cas:serviceResponse xmlns:cas='http://www.yale.edu/tp/cas'>";
        $xml .= "<{$root}{$attr}>";
        $xml .= $this->dataToXml($data, $item, $id);
        $xml .= "</{$root}></cas:serviceResponse>";
        return $xml;
    }

    /**
     * 数据XML编码
     * @param mixed  $data 数据
     * @param string $item 数字索引时的节点名称
     * @param string $id   数字索引key转换为的属性名
     * @return string
     */
    protected function dataToXml($data, $item, $id)
    {
        $xml = $attr = '';

        if ($data instanceof Collection || $data instanceof Model) {
            $data = $data->toArray();
        }

        foreach ($data as $key => $val) {
            if (is_numeric($key)) {
                $id && $attr = " {$id}=\"{$key}\"";
                $key         = $item;
            }
            $xml .= "<{$key}{$attr}>";
            $xml .= (is_array($val) || is_object($val)) ? $this->dataToXml($val, $item, $id) : $val;
            $xml .= "</{$key}>";
        }
        return $xml;
    }
}
