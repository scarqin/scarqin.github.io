//batch change file prefix
var fs = require("fs");
let files = fs.readdirSync("./").filter((val) => val.includes(".md"));
files.forEach((fileName) => {
  let date = fileName.split("学")[0].split("_");
  let prefix = `---
title: ${fileName}
date: ${date[0]}/${date[1]}/01 00:00
description:
categories: 知识卡片
---\n`;
  let text = prefix + fs.readFileSync(fileName, "utf-8");
    fs.writeFile(`./${fileName}`, text, function (err) {
      if (err) {
        return console.log(err);
      }
    });
});
