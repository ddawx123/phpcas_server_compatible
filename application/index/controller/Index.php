<?php
namespace app\index\controller;

/**
 * BlankPage
 * CAS缺省默认页，此页面可根据业务需求进行调整
 * @package DingStudio/CAS
 * @subpackage CAS/Default
 * @author David Ding
 */
class Index
{
    public function index()
    {
        $data = array(
            'code'  =>  400,
            'message'   =>  '<![CDATA[CAS服务工作正常，但您的请求有误。]]>',
            'datetime'  =>  '<![CDATA['.date('Y年m月d日 H:i:s', time()).']]>',
            'utc_timestamp' =>  time()
        );
        return xml($data, 400, [], ['root_node'=>'cas_compatible','item_node'=>'data']);
    }
}
