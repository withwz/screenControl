const socket = io("http://172.19.133.243:8999/");
socket.on("connect", function () {
  socket.emit("message", { x: 0, y: 0 });
});
$(function () {
  const controllArea = $("#controllArea");

  const bodyWidth = controllArea.width();
  const bodyHeight = controllArea.height();
  const offsetTop = controllArea[0].offsetTop;
  socket.emit("deviceInfo", {
    offsetTop: offsetTop,
    width: bodyWidth,
    height: bodyHeight,
  });

  let startX, startY;
  let startTime;
  controllArea.on("touchstart", function (e) {
    startTime = new Date().getTime();
    startX = e.originalEvent.changedTouches[0].pageX;
    startY = e.originalEvent.changedTouches[0].pageY;
    socket.emit("touchstartMessage");
    return false;
  });

  let moveEndX, moveEndY;
  controllArea.on("touchmove", function (e) {
    const ev = e.originalEvent.changedTouches[0];
    moveEndX = ev.clientX;
    moveEndY = ev.clientY;
    const X = moveEndX - startX;
    const Y = moveEndY - startY;
    const data = {};
    data.x = X;
    data.y = Y;
    socket.emit("message", data);
    appendViewInfo(data);
    return false;
  });

  controllArea.on("touchend", function (e) {
    mockClick();
    return false;
  });

  /**
   * 屏幕点击时触发
   * @returns
   */
  function mockClick() {
    if (
      new Date().getTime() - startTime > 50 &&
      new Date().getTime() - startTime < 200 
    ) {
      socket.emit("mouseClick");
    }
    return false;
  }

  const queue = [];
  /**
   * 屏幕上展示坐标信息
   * @param {*} data
   */
  function appendViewInfo(data) {
    const el = $("#eventList");
    queue.push(`<p>x:${parseInt(data.x)} y:${parseInt(data.y)}</p>`);
    if (queue.length > 10) {
      queue.shift();
      el.empty();
    }
    el.append(queue);
  }
});
