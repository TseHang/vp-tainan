/*
  It's all by  `canner-core` to transform
*/
const route = [
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
        img: 'https://www.taiwanstat.com/vp-tainan/dist/img/index/logo-color(1081x200).png',
        description: '用數據看台南是一場為期一個月的資訊號召，致力於讓人們「更加認識台南」。我們將利用台南市政府開放資料，每週發布一個主題並交予大家一個小小的任務，讓人們用資料的角度重新解讀台南。我們真心的希望身處在同一個社會的我們，能夠更加關心自己周遭的社會變化。這是用數據看台南的本意，更是用數據看台灣的初衷。',
        href: 'https://www.taiwanstat.com/vp-tainan/articles/article-tainanstat.html',
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
        href: 'https://www.taiwanstat.com/vp-tainan/population_num_report.html',
      },
    },
    partials: './partial.js',
    layout: './layout/population_num_report.hbs',
    filename: './population_num_report.html',
  }, {
    data: {
      path: './',
      title: '我們的水出了什麼問題？',
      chart_description: {
        img: 'https://www.taiwanstat.com/vp-tainan/dist/img/water/water_screenshot.png',
        description: '地球有70%的地表被水覆蓋，但這麼多水中鹹水卻佔了大多數，只有3%是能夠被人類利用的淡水。而這些相對稀少的「水資源」並不全用於民生，有些則是拿來作為工業、農業用水使用。如此，該如何珍惜得來不易的水資源並防範水污染就是一大課題。讓我們一起從自來水、河川、雨水、地下水四種水的來源面向向您剖析台南的水污染問題。',
        href: 'https://www.taiwanstat.com/vp-tainan/water_report.html',
      },
    },
    partials: './partial.js',
    layout: './layout/water_report.hbs',
    filename: './water_report.html',
  }, {
    data: {
      path: './',
      title: 'XYZ 三元素 - 台南市人口診斷書',
      chart_description: {
        img: '//www.taiwanstat.com/vp-tainan/dist/img/population/img_population_xyz_report.png',
        description: '這是人口篇的第二篇，藉由性別、年齡、人口變化，讓我們一起一窺究竟到底台南的人口現在有著什麼樣的變化？其中要請大家仔細觀察年齡結構的轉變，高齡社會已經是勢不可擋的趨勢，而對於我們自身來說要怎麼因應呢？最後的小任務是一場關於自身歷史的脈絡探索。希望大家喜歡^^',
        href: 'https://www.taiwanstat.com/vp-tainan/population_xyz_report.html',
      },
    },
    partials: './partial.js',
    layout: './layout/population_xyz_report.hbs',
    filename: './population_xyz_report.html',
  }, {
    data: {
      path: './',
      title: '台南災害潛勢地圖',
      chart_description: {
        img: '//www.taiwanstat.com/vp-tainan/dist/img/disaster/disaster_screenshot.png',
        description: '每當遇上地震、颱風、暴雨，你會不會擔心自己家園的安全呢？台灣位處於自然災害頻繁的環境，儘管每每做好了準備，卻仍然有災情發生，這是台灣人民永遠的隱憂。這次我們將以台南市政府公布的開放資料，製作台南的災害潛勢地圖，讓您知道家園是否有潛在的危機，同時，有什麼事是我們可以做的，去避免下一次的遺憾發生！',
        href: 'https://www.taiwanstat.com/vp-tainan/disaster_report.html',
      },
    },
    partials: './partial.js',
    layout: './layout/disaster_report.hbs',
    filename: './disaster_report.html',
  }, {
    data: {
      paht: './',
      title: '台南道路潛藏危機地圖',
      chart_description: {
        img: '//www.taiwanstat.com/vp-tainan/dist/img/traffic/traffic_screenshot.png',
        description: '台南市交通違規事件第一名為『違規停車』，第二名為『闖紅燈直行左轉』。而交通違規很可能導致交通事故或是塞車等交通問題，身處在台南的我們，又對台南的違規事件與交通事故了解多少呢?這次我們針對台南市交通事故分佈與違規事項探討，希望能讓大家更了解台南市的交通特性，並且『快樂出門，平安回家』!',
        href: 'https://www.taiwanstat.com/vp-tainan/traffic_report.html',
      },
    },
    partials: './partial.js',
    layout: './layout/traffic_report.hbs',
    filename: './traffic_report.html',
  }, {
    data: {
      paht: './',
      title: '106台南市預算收支圖表',
      chart_description: {
        img: '//www.taiwanstat.com/vp-tainan/dist/img/money/money_screenshot.png',
        description: '這次我們將台南市的財政狀況分為「歲入」、「歲出」、「人民負債資訊」，大家一起來看看吧！',
        href: 'https://www.taiwanstat.com/vp-tainan/money_report.html',
      },
      components: {
      }
    },
    partials: './partial.js',
    layout: './layout/money_report.hbs',
    filename: './money_report.html',
  },
]
module.exports = route

