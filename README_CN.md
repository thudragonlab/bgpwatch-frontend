# BGPWatch-frontend
本程序为BGPWatch前端页面，采用Vue2编写

BGPWatch平台由来自19个国家/经济体的研究人员和工程师开发，由APNIC基金会和中国政府资助。公开网址为https://bgpwatch.cgtf.net.

该平台支持BGP劫持检测，确保快速响应时间，通过电子邮件发送事件警告，评估事件的严重性，并提供事件回放功能，所有这些都旨在有效协助网络运营商。

此外，该平台还开发了各种可供网络运营商监控网络的工具，包括显示关键AS信息的仪表板，显示正向、反向和双向路由路径，以及支持订阅。
### 示例 ([https://bgpwatch.cgtf.net/#/](https://bgpwatch.cgtf.net/#/))


### 安装
```
yarn
```

### 运行
```
yarn serve
```

### 部署
```
yarn build
```



	
### 目录结构
- ***src***
  - **api**｜ API接口
  - **assets**｜ 静态资源
  - **components**｜ Vue组件
  - **libs**｜ ElementUI按需导入工具
  - **router**｜ Vue  路由
  - **styles**｜ 全局CSS样式
  - **templates**｜ Echart画图模版
  - **views**｜ Vue 页面
  - **App.vue**｜ Vue首页
  - **main**｜ 入口文件

- ***tests***｜ 单元测试
  - **components**｜ 组件单元测试用例
  - **mockData**｜ mock数据
  - **views**｜ 页面单元测试用例
  - **setup.js**｜ 单元测试配置项
	

### 页面

- ##### Home
  展示最近7天劫持事件发生情况
- ##### Anomaly
	- ##### Overview
    按年/月/日统计劫持数量
	- ##### Anomaly
    查询劫持事件详细信息
- ##### Dashboard
  查询ASN相关信息（peer，Whois，Prefix）
- ##### RoutingPath 
	- ##### Routing Path
	查询prefix的AS Path信息
	- ##### Reverse Routing Path
  查询prefix的反向路由信息
	- ##### Reverse Routing Path（TOPO）
  查询prefix的反向路由信息并以拓扑的形式展现
	- ##### Bi-Routing Path
  查询两个prefix之间的双向AS Path 信息
	- ##### JitterRoute
  查询各peer节点路由抖动信息
- ##### Tools
	- ##### Country/Region
  查询各国家/地区 AS关系
	- ##### Anomaly-moas
  查询产生的MOAS事件
- ##### Subscribe
  通过订阅AS,Prefix，获取每日AS,AS Path,Prefix变动状态信息
- ##### Docs
	- ##### Document
  BGPWatch 平台使用文档
	- ##### API Doc
  BGPWatch API使用文档