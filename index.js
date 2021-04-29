const cheerio = require("cheerio");
const axios = require("axios");
const express = require("express");
const app = express();

async function getData(time, language) {
    const url = "https://github.com/trending" + (!!language ? "/" + language : "") + "?since=" + time; // 拼接请求的页面链接
    // console.log(url); // 检查请求的 url 地址
    const response = await axios.get(url).catch(function (error) {
        return error;
    });

    // 不存在 data 字段时，直接返回 （请求出现了错误）
    if (!response.data) {
        return response;
    }

    const $ = cheerio.load(response.data); // 传入页面内容
    let items_array = [];
    $(".Box .Box-row").each(function () {
        // 像jQuery一样获取对应节点值
        let obj = {};
        obj.title = $(this).find("h1").text().replace(/\s/g, ""); // 获取标题
        obj.links = "https://github.com/" + obj.title; // 拼接链接
        obj.description = $(this).find("p").text().trim(); // 获取获取描述
        obj.language = $(this).find(">.f6 .repo-language-color").siblings().text(); // 获取语言
        obj.stars = $(this).find(">.f6 a").eq(0).text().trim(); // 获取 start 数
        obj.forks = $(this).find(">.f6 a").eq(1).text().trim(); // 获取分支数
        obj.info = $(this).find(">.f6 .float-sm-right").text().trim(); // 获取对应时期 star 信息
        obj.avatar = $(this).find(">.f6 img").eq(0).attr("src"); // 获取首位作者头像
        items_array.push(obj);

        // 检测各项数据是否正确
        // console.log(obj);
    });

    // 回归按新增 star 数量排名
    items_array.sort((item1, item2) => {
        return parseInt(item2.info.replace(/,/, "")) - parseInt(item1.info.replace(/,/, ""));
    });

    return items_array;
}

app.get("/list/:time/:language", async (req, res) => {
    const {
        time, // 获取排序时间
        language, // 获取对应语言
    } = req.params;
    let list = await getData(time, language); // 发起抓取
    res.json(list); // 数据返回
});

app.get("/list/:time", async (req, res) => {
    const {
        time, // 获取排序时间
    } = req.params;
    let list = await getData(time); // 发起抓取
    res.json(list); // 数据返回
});

app.get("/", async (req, res) => {
    let list = await getData("daily"); // 发起抓取
    res.json(list); // 数据返回
});

app.listen(3000, () => console.log("Listening on port 3000!")); // 监听3000端口
