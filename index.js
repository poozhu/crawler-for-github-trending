const cheerio = require('cheerio')
const axios = require('axios');
const express = require('express')
const app = express()

function getData(time, language) {
    let url = 'https://github.com/trending' + (!!language ? '/' + language : '') + '?since=' + time;  // 拼接请求的页面链接
    return axios.get(url)
        .then(function (response) {
            let html_string = response.data.toString(); // 获取网页内容
            const $ = cheerio.load(html_string);  // 传入页面内容
            let list_array = [];
            $('.Box .Box-row').each(function () { // 像jQuery一样获取对应节点值
                let obj = {};
                obj.title = $(this).find('h1').text().trimStart().trimEnd(); // 获取标题
                obj.links = 'https://github.com/' + obj.title.replace(/\s/g, "");   // 拼接链接
                obj.description = $(this).find('p').text().trimStart().trimEnd();  // 获取获取描述
                obj.language = $(this).find('>.f6 .repo-language-color').siblings().text().trimStart().trimEnd();  // 获取语言
                obj.stars = $(this).find('>.f6 a').eq(0).text().trimStart().trimEnd();  // 获取 start 数
                obj.forks = $(this).find('>.f6 a').eq(1).text().trimStart().trimEnd();  // 获取分支数
                obj.info = $(this).find('>.f6 .float-sm-right').text().trimStart().trimEnd();  // 获取对应时期 star 信息
                list_array.push(obj);

                // 检测各项数据是否正确
                // console.log(obj);
            });

            // 回归按新增 star 数量排名
            list_array = list_array.sort ((x,y) => {
                return parseInt(y.info.replace(/,/,''))-parseInt(x.info.replace(/,/,''))
            })

            return Promise.resolve(list_array);

        })
        .catch(function (error) {
            console.log(error);
        })
}

app.get('/', (req, res) => {
    let promise = getData('daily'); // 发起抓取
    promise.then(response => {
        res.json(response); // 数据返回
    });
})

app.get('/:time-:language', (req, res) => {
    const {
        time, // 获取排序时间
        language // 获取对应语言
    } = req.params;
    let promise = getData(time, language); // 发起抓取
    promise.then(response => {
        res.json(response); // 数据返回
    });
})

app.get('/:time', (req, res) => {
    const {
        time, // 获取排序时间
    } = req.params;
    let promise = getData(time); // 发起抓取
    promise.then(response => {
        res.json(response); // 数据返回
    });
})

app.listen(3000, () => console.log('Listening on port 3000!'))  // 监听3000端口
