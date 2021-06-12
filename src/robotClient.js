const socket = io("http://172.20.10.2:8999/");
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
  controllArea.on("touchstart", function (e) {
    startX = e.changedTouches[0].pageX;
    startY = e.changedTouches[0].pageY;
    socket.emit("touchstartMessage");
    return true;
  });

  controllArea.on("touchmove", function (e) {
    const ev = e.changedTouches[0];
    const moveEndX = ev.clientX;
    const moveEndY = ev.clientY;
    const X = moveEndX - startX;
    const Y = moveEndY - startY;
    const data = {};
    data.x = X;
    data.y = Y;
    socket.emit("message", data);
    appendViewInfo(data);
    return true;
  });

  controllArea.on("touchend", function (e) {
    return true;
  });

  controllArea.on("singleTap", function (e) {
    socket.emit("mouseClick");
    return true;
  });

  controllArea.on("doubleTap", function (e) {
    socket.emit("mouseDoubleClick");
    return true;
  });

  initScrollArea();

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
    el.append(queue.join(""));
  }
});

function initScrollArea() {
  const scrollArea = $("#scrollArea");

  let startY;
  scrollArea.on("touchstart", function (e) {
    startY = e.changedTouches[0].pageY;
    return true;
  });

  scrollArea.on("touchmove", function (e) {
    const moveEndY = e.changedTouches[0].clientY;
    const Y = moveEndY - startY;
    socket.emit("mouseScroll", { y: Y / 5 });
    return true;
  });
}
