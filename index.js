const http = require("http");
http
  .createServer((req, res) => {
    if (req.url === "/read") {
      // 读取 Cookie
      res.end(`Read Cookie: ${req.headers.cookie || ""}`);
    } else if (req.url === "/write") {
      // 设置 Cookie
      res.setHeader("Set-Cookie", [
        `name=scar;`,
        //set-cookie 属性大小写不敏感，你可以写成 path=/ 或者 Path=/
        `language=javascript;Path=/; HttpOnly;Expires=${new Date(
          Date.now() + 10000
        ).toUTCString()};`,
      ]);
      res.end("Write Success");
    } else if (req.url === "/delete") {
      //删除 cookie
      res.setHeader("Set-Cookie", [
        //设置过期时间为过去的时间
        `name=;expires=${new Date(1).toUTCString()}`,
        //有效期 max-age 设置成 0 或 -1 这种无效秒，让 cookie 当场去世
        //有些浏览器不支持 max-age 属性，所以用此方法需要考虑兼容性
        "language=javascript; max-age=0",
      ]);
      res.end("Delete Success");
    } else {
      res.end("Not Found");
    }
  })
  .listen(3000);