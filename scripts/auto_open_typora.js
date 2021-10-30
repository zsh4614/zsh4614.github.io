var spawn = require('child_process').exec;
hexo.on('new', function(data){
  spawn('typora ' + data.path);
});
