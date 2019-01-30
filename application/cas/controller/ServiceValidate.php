<?php
namespace app\cas\controller;

use think\Controller;
use think\Db;
use think\Session;
use think\Cookie;
use think\Request;

/**
 * ServiceValidate
 * 实现CAS协议中的票据验证
 * @package DingStudio/CAS
 * @subpackage CAS/ServiceValidate
 * @author David Ding
 */
class ServiceValidate
{
    /**
     * ServiceValidate 外部路由方法
     * @return string CAS系统的XML认证报文结果
     */
    public function index()
    {
        //$this->gen_response('CAS用户','cas@dingstudio.cn','casuser'); //用于测试TICKET登录
        if (Request::instance()->has('ticket','get') && Request::instance()->has('service','get')) {
            $tgt_src = Request::instance()->get('ticket');
            /*
            由于phpCAS要求ticket必须为ST-等标准开头，但本人自建的SSO系统使用传统的Token机制。
            为了兼容标准的phpCAS（Client）组件，在此做特殊处理。将原SSO系统的token均添加了ST-前缀。
            因此需在此处分割字符串，还原原始token。
            */
            $tgt = @explode('ST-', $tgt_src)[1];
            //将还原后的token携带至原SSO系统尝试拉取用户资料
            $userinfo = file_get_contents('https://passport.dingstudio.cn/api?format=json&action=verify&token='.$tgt.'&reqtime='.time());
            $userinfo = json_decode($userinfo, true);
            if ($userinfo['code'] == 200) {
                $newtoken = 'ST-'.$userinfo['data']['newtoken'];
                Session::set('cas_token', $newtoken);
                $this->gen_response($userinfo['data']['username'],$userinfo['data']['usermail'],$newtoken);
            } else {
                $this->show_err('INVALID_TICKET', '未能识别出目标&#039;'.$tgt_src.'&#039;票根');
            }
        } else {
            $this->show_err('INVALID_REQUEST', '必须同时提供&#039;service&#039;和&#039;ticket&#039;参数');
        }
    }

    /**
     * 创建CAS会话信息报文
     * @param string $user 已认证的用户名
     * @param string $mail 已认证的用户邮箱
     * @param string $token 访问用户资料所需令牌
     * @return string CAS系统的XML认证报文结果
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
     * @param string $code 错误特征码
     * @param string $detail 错误信息详情
     * @return string CAS系统的XML错误信息返回
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
