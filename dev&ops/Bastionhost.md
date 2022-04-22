| 堡垒机       | JumpServer                                             | Teleport                                        | GateOne                                       | CrazyEye                                         | 麒麟开源堡垒机                  |
| ------------ | ------------------------------------------------------ | ----------------------------------------------- | --------------------------------------------- | ------------------------------------------------ | ------------------------------- |
| 官网         | [JumpServer](https://www.jumpserver.org/)              | [Teleport ](https://tp4a.com/)                  |                                               |                                                  | [麒麟](http://www.tosec.com.cn) |
| github       | [JumpServer](https://github.com/jumpserver/jumpserver) | [Teleport](https://github.com/eomsoft/teleport) | [GateOne](https://github.com/liftoff/GateOne) | [CrazyEye](https://github.com/triaquae/CrazyEye) |                                 |
| github start | 18.3                                                   | 851                                             | 6.1k                                          | 543                                              |                                 |
|              |                                                        |                                                 |                                               |                                                  |                                 |



JumpServer开源版本功能 ：

| 功能            | 备注                                                         |
| --------------- | ------------------------------------------------------------ |
| 登录认证        | 资源统一登录和认证；<br>LDAP / AD 认证；RADIUS 认证；<br>实现单点登录（OpenID 认证、CAS 认证）；<br>SSO 对接；扫码登录（企业微信认证、钉钉认证和飞书认证）<br>MFA 二次认证（Google Authenticator） |
| 登录限制        | 用户登录来源 IP 受管理员控制（支持黑 / 白名单）              |
| 多维度授权      | 可对用户、用户组、资产、资产节点、应用以及系统用户进行授权； |
| 资产授权        | 资产树以树状结构进行展示；资产和节点均可灵活授权；<br>节点内资产自动继承授权；子节点自动继承父节点授权； |
| Kubernetes 授权 | 支持用户通过 JumpServer 连接 Kubernetes 集群；               |
| 文件传输与管理  | 支持 SFTP 文件上传 / 下载；支持 Web SFTP 文件管理            |
| 集中账号管理    |                                                              |
| ⽤户⻆⾊        | 支持超级管理员、超级审计员、普通用户三种角色；               |
| 统⼀密码管理    | 资产密码托管；⾃动⽣成密码；密码自动推送；密码过期设置；     |
| 审计            | 日志审计、操作审计、会话审计、录像审计、指令审计、⽂件传输审计、实时监控 |



是否需要：

现状：跳板机+ 二次验证

堡垒机：

1. 一人一号
2. 日志审计+回放
3. 监控









