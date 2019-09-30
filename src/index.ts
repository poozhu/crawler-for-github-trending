import * as cheerio from 'cheerio';
import * as axios from 'axios';
import * as express from 'express';

const app = express();

const URL_PREFIX = 'https://github.com/trending';

interface Element {
  title: string;
  links: string;
  description: string;
  language: string;
  stars: string;
  forks: string;
  info: string;
  avatar: string;
}

const getStarsValue = (element: Element) => parseInt(element.info.replace(/,/, ''));

const createElement = (elem: Cheerio): Element => {
  const rawtitle = elem
    .find('h1')
    .text()
    .trim();
  const links = 'https://github.com/' + rawtitle.replace(/\s/g, '');
  const title = rawtitle.replace(/\s*\/\s*/g, ' | ');
  const description = elem
    .find('p')
    .text()
    .trim();
  const language = elem
    .find('>.f6 .repo-language-color')
    .siblings()
    .text()
    .trim();
  const stars = elem
    .find('>.f6 a')
    .eq(0)
    .text()
    .trim();
  const forks = elem
    .find('>.f6 a')
    .eq(1)
    .text()
    .trim();
  const info = elem
    .find('>.f6 .float-sm-right')
    .text()
    .trim();
  const avatar = elem
    .find('>.ft img')
    .eq(0)
    .attr('src');
  return { title, links, description, language, stars, forks, info, avatar };
};

const getData = async (time: string, language?: string): Promise<Element[] | Error> => {
  const url = URL_PREFIX + (!!language ? '/' + language : '') + '?since=' + time;
  const result = await axios.default.get(url);

  if (result.status !== 200) {
    const errStr = 'Failed to get data:' + result.statusText + result.data;
    console.error(errStr);
    return new Error(errStr);
  }

  const resultList: Element[] = [];

  const $ = cheerio.load(result.data.toString());
  $('.Box .Box-row').each((_: number, elem: CheerioElement) => {
    const elm = $(elem);
    const element = createElement(elm);
    resultList.push(element);
  });

  return resultList.sort((a, b) => getStarsValue(b) - getStarsValue(a));
};

app.get('/', async (_req, res) => {
  const data = await getData('daily');
  if (data instanceof Error) {
    res.status(500).json(data.message);
    return;
  }

  res.json(data);
});

app.get('/:time/:language', async (req, res) => {
  const { time, language } = req.params;
  const data = await getData(time, language);
  if (data instanceof Error) {
    res.status(500).json(data.message);
    return;
  }

  res.json(data);
});

app.get('/:time', async (req, res) => {
  const data = await getData(req.params.time);
  if (data instanceof Error) {
    res.status(500).json(data.message);
    return;
  }

  res.json(data);
});

app.listen(3000, () => {
  console.log('Listening on port 3000...');
});
