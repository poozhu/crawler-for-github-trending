# Crawler-for-Github-Trending  
50 lines, minimalist node crawler for [Trending](https://github.com/trending?since=daily).  
一个50行的 node 爬虫，一个简单的 [axios](https://github.com/axios/axios), [express](https://github.com/expressjs/express), [cheerio](https://github.com/cheeriojs/cheerio) 体验项目。  

# Usage  
一篇简单的介绍 https://juejin.im/post/5cbab247e51d45789024d7cb   
一个简单的应用 http://zy2071.com/Fun/todayGithub.html  

首先保证电脑已存在 node10.0+ 环境，然后  

1.拉取本项目  
```
git clone https://github.com/ZY2071/Crawler-for-Github-Trending.git
cd Crawler-for-Github-Trending
npm i
node index.js
```
2.或者下载本项目压缩包，解压
```
cd Crawler-for-Github-Trending-master  // 进入项目文件夹
npm i
node index.js
```

# Examples  
当启动项目后，可以看到控制台输出
```
Listening on port 3000!
```
此时打开浏览器，进入本地服务 http://localhost:3000/daily 
```
http://localhost:3000/time-language // time 表示周期，language 代表语言  例如：

http://localhost:3000/daily  // 代表今日 可选参数：weekly,monthly
http://localhost:3000/daily-JavaScript  // 代表今日的 JavaScript 分类 可选参数：任意语言
```

稍微等待即可看到爬取完毕的返回数据：
```
[
 {
  "title": "lib-pku / libpku",
  "links": "https://github.com/lib-pku/libpku",
  "description": "贵校课程资料民间整理",
  "language": "JavaScript",
  "stars": "14,297",
  "forks": "4,360",
  "info": "3,121 stars this week"
 },
 {
  "title": "SqueezerIO / squeezer",
  "links": "https://github.com/SqueezerIO/squeezer",
  "description": "Squeezer Framework - Build serverless dApps",
  "language": "JavaScript",
  "stars": "3,212",
  "forks": "80",
  "info": "2,807 stars this week"
 },
 ...
]
```

# More
本项目仅供爬取体验，每次访问都会实时爬取数据，所以数据返回速度会比较慢，实际操作应该定时爬取数据然后将数据存进数据库，数据从数据库返回从而提高数据返回效率。

但项目也可以作为以上各个 node 模块最基础的练手使用，希望可以帮到大家 😀
