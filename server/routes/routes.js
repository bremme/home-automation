

exports.index = function (req, res) {
  res.render('index');
};

exports.page = function (req, res) {
  var page = req.params.page;
  res.render(page);
};

exports.partials = function (req, res) {
  var name = req.params.name;
  res.render('partials/' + name);
}