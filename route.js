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
      title: '我們是用數據看台南',
      chart_description: {
        img: '//www.taiwanstat.com/vp-tainan/dist/img/index/logo-color.png',
        description: '用數據看台南是一場為期一個月的資訊號召，致力於讓人們「更加認識台南」。我們將利用台南市政府開放資料，每週發布一個主題並交予大家一個小小的任務，讓人們用資料的角度重新解讀台南。我們真心的希望身處在同一個社會的我們，能夠更加關心自己周遭的社會變化。這是用數據看台南的本意，更是用數據看台灣的初衷。',
      },
    },
    partials: './partial.js',
    layout: './layout/articles/article-tainanstat.hbs',
    filename: './articles/article-tainanstat.html',
  }, {
    data: {
      path: './',
      title: '台南市人口診斷書',
      chart_description: {
        img: '//www.taiwanstat.com/vp-tainan/dist/img/population/img_population_num_report.png',
        description: '這是人口篇的第一篇，藉由人口總數與土地面積來回想小學地理最常算的一個數字 - 「人口密度」。配上比較各區之間的地圖，看出區域之間的差異性有多大，最後期盼大家想一下，對於我們人類來說，你自身會選擇居住在大城市還是小城市呢？為什麼？',
      },
    },
    partials: './partial.js',
    layout: './layout/population_num_report.hbs',
    filename: './population_num_report.html',
  }, {
    data: {
      path: './',
      title: '一杯水的故事',
    },
    partials: './partial.js',
    layout: './layout/water.hbs',
    filename: './water.html',
  }, {
    data: {
      path: './',
      title: 'XYZ 三元素 - 台南市人口診斷書',
      chart_description: {
        img: '//www.taiwanstat.com/vp-tainan/dist/img/population/img_population_xyz_report.png',
      },
    },
    partials: './partial.js',
    layout: './layout/population_xyz_report.hbs',
    filename: './population_xyz_report.html',
  }, {
    data: {
      paht: './',
      title: '台南災害潛勢地圖',
      chart_description: {
        img: '//www.taiwanstat.com/vp-tainan/dist/img/population/img_population_xyz_report.png',
      },
    },
    partials: './partial.js',
    layout: './layout/disaster_report.hbs',
    filename: './disaster_report.html',
  },
]
module.exports = route

