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
    }
  ];
module.exports = route;