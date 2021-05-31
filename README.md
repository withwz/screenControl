# screenControl 屏幕遥控器

nodejs + robotjs + socket.io 做一个手机遥控器，控制屏幕

### 安装运行
```git 
git clone https://github.com/withwz/screenControl.git
cd screenControl
yarn
yarn start
``` 
vscode打开项目点index.html ，Open With Live Server（需要提前安装live server插件）

现在是最简陋的版本，需要手动启动node服务器，设置允许访问的与域名，然后运行把index.html运行到本地，手机和电脑一个局域网，手机访问这个index.html进行控制。
### 下一步计划
- 功能模块化，分割代码
- 右键功能
- 双击
- 鼠标滚轮
- 拖拽选择区
- 自定义鼠标速率
- 键盘输入
- 屏幕映射到手机
- electron做一个客户端


