/*
  It's all by  `canner-core` to transform
*/
var route = [
    {
      data: {
        path: './',
        title: '數字說話 || Let data speak! ',
        first_word: 'It is a good template'
      },
      partials: './partial.js',
      layout:  "./layout/index.hbs",
      filename: "./index.html"
    },
    {
      data: {
        path: './',
        title: '台南市人口診斷書',
      },
      partials: './partial.js',
      layout:  "./layout/population_num_report.hbs",
      filename: "./population_num_report.html"
    },
    {
      data: {
        paht: './',
        title: '一杯水的故事'
      },
      partials: './partial.js',
      layout: "./layout/water.hbs",
      filename: "./water.html"
    },
    {
      data: {
        paht: './',
        title: '台南災害潛勢地圖'
      },
      partials: './partial.js',
      layout: "./layout/disaster_report.hbs",
      filename: "./disaster_report.html"
    }
  ];
module.exports = route;