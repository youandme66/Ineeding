var multer=require('multer');
var allCfg=require('../config/allCfg');
var gm=require('gm').subClass({imageMagick:true});
var storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './public/userImages');
    gm('./public/userImages/' + filename).resize(300, 300).write('./public/userImages/' + filename, function(err) {
					if (err) {
						console.log(err);
					}
				});
  },
  filename: function(req, file, cb) {
    var user_id = req.session.user.uid;
    filename = allCfg.image_fencrypt +user_id+allCfg.image_aencrypt+'-' +allCfg.image_encrypt+ allCfg.image_admin + ".jpg" ;
    cb(null, filename);
  }
});
var user_upload=multer({
	storage:storage
});
module.exports=user_upload;