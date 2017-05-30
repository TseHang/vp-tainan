var fs = require("fs");

module.exports= function (hbs) {
  // Default Partials
  hbs.registerPartial('head', getDefaultPartials('head'));
  hbs.registerPartial('header', getDefaultPartials('header'));
  hbs.registerPartial('footerGA', getDefaultPartials('footerGA'));
  hbs.registerPartial('inner_script', getDefaultPartials('inner_script'));

  // Project Partials
  hbs.registerPartial('logo_animate', getProjectPartials('logo_animate'));
  hbs.registerPartial('population_num', getProjectPartials('population_num'));
  hbs.registerPartial('population_xyz', getProjectPartials('population_xyz'));
  hbs.registerPartial('water', getProjectPartials('water'));
  hbs.registerPartial('disaster', getProjectPartials('disaster'));
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
