const server = require("http").createServer(function (req, res) {
  //访问控制允许来源：所有
  res.setHeader("Access-Control-Allow-Origin", "*");
  //访问控制允许报头 X-Requested-With: xhr请求
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  //访问控制允许方法
  res.setHeader(
    "Access-Control-Allow-Metheds",
    "PUT, POST, GET, DELETE, OPTIONS"
  );
  //自定义头信息，表示服务端用nodejs
  res.setHeader("X-Powered-By", "nodejs");
  res.end("我是跨域请求的内容");
});

const hostname = "172.20.10.2";
const port = 8999;
const host = hostname + ":" + port;
server.listen(port, hostname, function () {
  console.info(`服务器运行在http://${host}`);
});

const io = require("socket.io")(8999, {
  // 允许的跨域访问的
  cors: {
    origin: "http://172.20.10.2:5501",
    methods: ["GET", "POST"],
    allowedHeaders: ["content-type"],
  },
});
const socket = io.listen(server);
const robot = require("robotjs");

socket.on("connection", function (client) {
  // 被控制设备的尺寸
  let computerInfoWidth;
  let computerInfoHeight;
  // 控制设备的控制区域尺寸
  let controlDeviceInfoWidth;
  let controlDeviceInfoHeight;
  let offsetTop;
  // 设备控制比例
  const transformRate = {
    x: 1,
    y: 1,
    offsetTop: 0,
  };
  client.on("deviceInfo", function (data) {
    computerInfoWidth = robot.getScreenSize().width;
    computerInfoHeight = robot.getScreenSize().height;
    controlDeviceInfoWidth = data.width;
    controlDeviceInfoHeight = data.height;
    offsetTop = data.offsetTop;
    transformRate.x = parseInt(computerInfoWidth / controlDeviceInfoWidth);
    transformRate.y = parseInt(computerInfoHeight / controlDeviceInfoHeight);
    transformRate.offsetTop = parseInt(offsetTop);
  });

  // 触摸开始的位置
  let mouse;
  client.on("touchstartMessage", function () {
    mouse = robot.getMousePos();
  });

  client.on("message", function (data) {
    try {
      const posiX = Math.max(
        Math.min(
          parseInt(mouse.x + data.x * transformRate.x),
          computerInfoWidth
        ),
        0
      );
      const posiY = Math.max(
        Math.min(
          parseInt(mouse.y + data.y * transformRate.y),
          computerInfoHeight
        ),
        0
      );
      robot.moveMouse(parseInt(posiX), parseInt(posiY));
    } catch (error) {
      console.error("moveMouse error:", error);
    }
  });

  client.on("mouseClick", function (data) {
    try {
      robot.mouseClick();
    } catch (error) {
      console.error("mouseClick error:", error);
    }
  });

  client.on("mouseDoubleClick", function (data) {
    console.log("mouseDoubleClick: ", data);
    try {
      robot.mouseClick("left", true);
    } catch (error) {
      console.error("mouseClick error:", error);
    }
  });

  client.on("mouseScroll", function (data) {
    try {
      const posiY = parseInt(data.y);
      robot.scrollMouse(0, parseInt(posiY));
    } catch (error) {
      console.error("scrollMouse error:", error);
    }
  });
});

socket.on("disconnect", function () {
  console.info("disconnet");
});
