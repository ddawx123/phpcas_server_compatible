PHP CAS 服务端框架
==================
PHP CAS server compatible framework.

## Introduction
本框架基于ThinkPHP5开发，用于在PHP上构建兼容CAS2.0认证体系的中央身份认证集成系统，实现对CAS2.0标准兼容的站点进行快速集成。

## More
框架默认采用的是代理认证模式，即与已有的SSO认证体系实现了互联互通。如果需要独立的身份认证源，请自行修改ServiceValidate控制器、Login控制器以及Logout等辅助控制器，并创建相应的数据Model。