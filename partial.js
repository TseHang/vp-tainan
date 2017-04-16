var fs = require("fs");

module.exports= function (hbs) {
  // Default Partials
  hbs.registerPartial('head', getDefaultPartials('head'));
  hbs.registerPartial('header', getDefaultPartials('header'));
  hbs.registerPartial('footer', getDefaultPartials('footer'));
  hbs.registerPartial('inner_script', getDefaultPartials('inner_script'));

  // Project Partials
  hbs.registerPartial('population_num', getProjectPartials('population_num'));
};

function getProjectPartials(filename) {
  var template = fs.readFileSync('./layout/partial/'+filename+'.hbs', 'utf8');
  template = template.replace(/[\t\n]/g, '');
  return template;
}

function getDefaultPartials(filename) {
  var template = fs.readFileSync('./layout/partial/default/'+filename+'.hbs', 'utf8');
  template = template.replace(/[\t\n]/g, '');
  return template;
}
