/*
  It's all by  `canner-core` to transform
*/
var route = [
    {
      data: {
        path: './',
        title: '用數據看台南 Let data speak! ',
        first_word: 'It is a good template',
      },
      partials: './partial.js',
      layout: './layout/index.hbs',
      filename: './index.html',
    }, {
      data: {
        path: './',
        title: 'Let data speak!',
      },
      partials: './partial.js',
      layout: './layout/let-data-speak.hbs',
      filename: './let-data-speak.html',
    }, {
      data: {
        path: './',
        title: '聯絡我們',
      },
      partials: './partial.js',
      layout: './layout/contact-us.hbs',
      filename: './contact-us.html',
    }, {
      data: {
        path: './',
        title: '用數據看台南',
      },
      partials: './partial.js',
      layout: './layout/articles/article-tainanstat.hbs',
      filename: './articles/article-tainanstat.html',
    }, {
      data: {
        path: './',
        title: '台南市人口診斷書',
      },
      partials: './partial.js',
      layout: './layout/population_num_report.hbs',
      filename: './population_num_report.html',
    }, {
      data: {
        paht: './',
        title: '一杯水的故事',
      },
      partials: './partial.js',
      layout: './layout/water.hbs',
      filename: './water.html',
    }, {
      data: {
        path: './',
        title: 'XYZ 三元素 - 台南市人口診斷書',
      },
      partials: './partial.js',
      layout: './layout/population_xyz_report.hbs',
      filename: './population_xyz_report.html',
    }
  ];
  
module.exports = route;