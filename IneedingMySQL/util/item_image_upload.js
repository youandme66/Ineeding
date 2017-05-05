var multer=require('multer');
var gm=require('gm').subClass({imageMagick:true});
var i=1;
var storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './public/itemImages');
    gm('./public/itemImages/' + filename).resize(300, 300).write('./public/itemImages/' + filename, function(err) {
					if (err) {
						console.log(err);
					}
				});
  },
  filename: function(req, file, cb) {
    if(i==4){i=1;}
    var gid=req.params.gid+i;
    filename = gid+".jpg" ;
    i++;
    cb(null, filename);
  }
});
var user_upload=multer({
	storage:storage
});
module.exports=user_upload;