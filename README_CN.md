# BGPWatch-frontend
本程序为BGPWatch前端页面，采用Vue2编写

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
- ##### Anomaly
	- ##### Overview
	- ##### Anomaly
- ##### Dashboard
- ##### RoutingPath 
	- ##### Routing Path
	- ##### Reverse Routing Path
	- ##### Reverse Routing Path（TOPO）
	- ##### Bi-Routing Path
	- ##### JitterRoute
- ##### Tools
	- ##### Country/Region
	- ##### Anomaly-moas
- ##### Subscribe
- ##### Docs
	- ##### Document
	- ##### API Doc