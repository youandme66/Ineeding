
#INeeding 社区后台接口文档
---

##接口路径："/"
|请求方式|返回格式|请求参数|
|:---|:---|:---|
|GET|HTML|无|无|
请求示例:
```url
http://www.ineeding.com/
```
返回示例：
```
无
```
api备注
```
进入主页
```
##接口路径："/signup"
|请求方式|返回格式|请求参数|
|:---|:---|:---|:---|
|GET|HTML|无|
请求示例:
```url
http://www.ineeding.com/signup
```
返回示例：
```
无
```
API备注：
```txt
显示用户注册页面
```

##接口路径："/signup"
|请求方式|返回格式|请求参数|
|:---|:---|:---|:---|
|POST|JSON|login_name&phone_number&password&vcode&vpic|
请求示例:
```url
http://www.ineeding.com/login_name=hello&phone_number=18120583148&password=123456&vcode=123456&vpic=123456
```
返回示例：
```json
{
	code:10,
	msg:"注册成功"
}
```
API备注：
```txt
用户注册
login_name：不得超过需由英文字符、数字和下划线组成，长度在5-50个之间。  
password：不得少于6位。
vcode：为6位数字组成。
vpic:指图片验证码,6位，由英文字符和数字组成。
```
##接口路径："/login"
|请求方式|返回格式|请求参数|
|:---|:---|:---|
|get|HTML|无|
请求示例:
```url
http://www.ineeding.com/login
```
返回示例：
```json
无
```
API备注：
```txt
显示用户用户登录页面
```
##接口路径："/login"
|请求方式|返回格式|请求参数|
|:---|:---|:---|
|POST|JSON|phone_number&password|
请求示例:
```url
http://www.ineeding.com/phone_number=18120583148&password=123456
```
返回示例：
```json
成功：
{
	code:10,
	msg:"登录成功"
}
失败:
{
	code:-30
	msg:"信息不完整"
}
```
API备注：
```txt
用户登录
login_name：不得超过需由英文字符、数字和下划线组成，长度在5-50个之间。  
password：不得少于6位。
信息存到body中
```
##接口路径："/getpic"
|请求方式|返回格式|请求参数|
|:---|:---|:---|
|GET|img/jpg|无|
请求示例:
```url
http://www.ineeding.com/getpic
```
返回示例：
```
buff[10231]
```
API备注：
```txt
获取图片验证码
为buff数组，可以使用img包装即可显示。
```
##接口路径："/signout"
|请求方式|返回格式|请求参数|
|:---|:---|:---|
|POST|JSON|无|
请求示例:
```url
http://www.ineeding.com/signout
```
返回示例：
```
{
	code:10，
	msg:"登出成功"
}
```
API备注：
```txt
用户注销
```
##接口路径："/user/:name/settings"
|请求方式|返回格式|请求参数|
|:---|:---|:---|
|GET|JSON|name|
请求示例:
```url
http://www.ineeding.com/user/user01/settings
```
返回示例：
```
{
	code:10,
	data:{
		login_name:"user01",
		phone_number:18120583333,
		signature:"good good study,don't talk day day up.",
		image_url:"/images/01.jpg",
		school:"武昌首义学院",
		qq_number:63524463,
		email:63524463@qq.com,
		location:"武昌首义学院西区9栋",
		...
	}
}
```
##接口路径："/update"
|请求方式|返回格式|请求参数|
|:---|:---|:---|
|POST|JSON|login_name&user_name&phone_number&signature&qq_number&authened&email&location&school&id_image_url&profile_image_url&gender&student_number|
请求示例:
```url
http://www.ineeding.com/update?signature=hello
```
返回示例：
```
{
	code:10,
	msg:"保存成功"
}
```
API备注：
```txt
更新用户信息
id_image_url：指学生证图片上传
profile_image_url：指学生简介照片
gender：指学生性别。
表单提交
```
##接口路径："/user/:name"
|请求方式|返回格式|请求参数|
|:---|:---|:---|
|GET|HTML|name|
请求示例:
```url
http://www.ineeding.com/user/user01
```
返回示例：
```
{
	code:10,
	data:{
		login_name:"user01",
		have_message:true
	}
}
```
API备注：
```txt
显示用户中心入口信息页
```
##接口路径："/updatepass"
|请求方式|返回格式|请求参数|
|:---|:---|:---|
|POST|JSON|new_password&old_password|
请求示例:
```url
http://www.ineeding.com/updatepass?new_password=213132&&old_password=321321
```
返回示例：
```
{
	code:10,
	msg:"更新成功"
}
```
API备注：
```txt
更新用户密码
需要判断密码是否符合要求。
```
##接口路径："/resetpass"
|请求方式|返回格式|请求参数|
|:---|:---|:---|
|GET|HTML|无|
请求示例:
```url
http://www.ineeding.com/resetpass
```
返回示例：
```
无
```
API备注：
```txt
显示重置密码页
```

##接口路径："/resetpass"
|请求方式|返回格式|请求参数|
|:---|:---|:---|
|POST|JSON|phone_number&password&vcode|
请求示例:
```url
http://www.ineeding.com/resetpass?phone_number=18025015468&password=123456&vcode=123456
```
返回示例：
```
{
	code:10,
	msg:"重置成功"
}
```
API备注：
```txt
用户重置密码
```
##接口路径："/search"
|请求方式|返回格式|请求参数|
|:---|:---|:---|
|GET|HTML|无|
请求示例:
```url
http://www.ineeding.com/search
```
返回示例：
```
无
```
API备注：
```txt
用户搜索页面
```
##接口路径："/search"
|请求方式|返回格式|请求参数|
|:---|:---|:---|
|POST|JSON|keyword|
请求示例:
```url
http://www.ineeding.com/search?keyword=items
```
返回示例：
```
{
	code:10,
	data:[{
		item_name:"Iphone6s手机",
		title:"低价抛售",
		filter:"数码产品",
		description:"生日送的，自己已经有一款iphone，所以闲置在家，希望卖掉。",
		...	
	},{
	
	}...]
}
```
API备注：
```txt
用户搜索
```

##接口路径："/items"
|请求方式|返回格式|请求参数|
|:---|:---|:---|
|GET|JSON|filter&is_need|
请求示例:
```url
http://www.ineeding.com/items?filter=搞机
```
返回示例：
```
{
	data:[{
		title:"低价抛售",
		filter:"数码产品",
		image_url:"",
		description:"生日送的，自己已经有一款iphone，所以闲置在家，希望卖掉。",
		...	
	},{
	
	}...]
}
```
API备注：
```txt
根据分类显示页面，需要标明是否是需求。
```

##接口路径："/items/:id/detail"
|请求方式|返回格式|请求参数|
|:---|:---|:---|
|GET|JSON|无|
请求示例:
```url
http://www.ineeding.com/items/[hash]
```
返回示例：
```
{
	data:[{
		title:"低价抛售",
		filter:"数码产品",
		image_url:"",
		description:"生日送的，自己已经有一款iphone，所以闲置在家，希望卖掉。",
		...	
	},{
	
	}...]
}
```
API备注：
```txt
详情页面后面为item的id
```

##接口路径："/items/create"
|请求方式|返回格式|请求参数|
|:---|:---|:---|
|GET|HTML|无|
请求示例:
```url
http://www.ineeding.com/items/create
```
返回示例：
```
无
```
API备注：
```txt
显示创建items页面
```
##接口路径："/items/create"
|请求方式|返回格式|请求参数|
|:---|:---|:---|
|POST|JSON|filter&title&handle&price&telephone&image_url&description|
请求示例:
```url
http://www.ineeding.com/items/create?filter="数码产品"&is_need=false&title=iphone手机&handle=抛售&price="3000元"
```
返回示例：
```
{
	code:10,
	msg:"创建成功"
}
```
API备注：
```txt
创建
is_need为true指发布需求，并非提供items
filter指items分类
```
##接口路径："/items/:id/delete"
|请求方式|返回格式|请求参数|
|:---|:---|:---|
|POST|JSON|item_id|
请求示例:
```url
http://www.ineeding.com/items/delete?item_id=[hash]
```
返回示例：
```
{
	code:10,
	msg:"删除成功"
}
```
API备注：
```txt
删除items
```
##接口路径："/items/:id/collect"
|请求方式|返回格式|请求参数|
|:---|:---|:---|
|POST|JSON|item_id|
请求示例:
```url
http://www.ineeding.com/items/collect?item_id=[hash]
```
返回示例：
```
{
	code:10,
	msg:"收藏成功"
}
```
API备注：
```txt
收藏items
```
##接口路径："/items/:id/de_collect"
|请求方式|返回格式|请求参数|
|:---|:---|:---|
|POST|JSON|item_id|
请求示例:
```url
http://www.ineeding.com/items/de_collect?item_id=[hash]
```
返回示例：
```
{
	code:10,
	msg:"成功取消收藏"
}
```
API备注：
```txt
取消收藏items
```
##接口路径："/items/:id/update"
|请求方式|返回格式|请求参数|
|:---|:---|:---|
|POST|JSON|filter&is_need&title&handle&price&telephone&image_url|
请求示例:
```url
http://www.ineeding.com/items/update?filter="数码产品"&is_need=false&title=iphone手机&handle=抛售&price="3000元"&telephone=18120581355&image_url=/iphone.png
```
返回示例：
```
{
	code:10,
	msg:"items更新成功"
}
```
API备注：
```txt
更新items信息
```
##接口路径："/items/:id/changeblock"
|请求方式|返回格式|请求参数|
|:---|:---|:---|
|POST|JSON|item_id|
请求示例:
```url
http://www.ineeding.com/items/changeblock?item_id=[hash]
```
返回示例：
```
{
	code:10
	msg:"锁定成功"
}
```
API备注：
```txt
更新items锁定信息，意为下架或上架。
```

##接口路径："/upload"
|请求方式|返回格式|请求参数|
|:---|:---|:---|
|POST|JSON|image_url&tag|
请求示例:
```url
http://www.ineeding.com/upload?u_tag=0&image_url=[hash]
```
返回示例：
```
{
	code:10
	msg:"上传成功"
}
```
API备注：
```txt
分为用户图片上传和item图片上传,tag为标识码，用户图片上传为0，item图片上传为1。
image_url中包括文件名称。尽量为hash码。
```
##接口路径："/user/:name/changeblock"
|请求方式|返回格式|请求参数|
|:---|:---|:---|
|POST|JSON|author_id|
请求示例:
```url
http://www.ineeding.com/user/user01/block?author_id=[hash]
```
返回示例：
```
{
	code:10
	msg:"用户锁定成功"
}
```
API备注：
```txt
author_id指items发布人的Id
user01指当前用户管理员名称
```


##接口路径："/user/:name/published"
|请求方式|返回格式|请求参数|
|:---|:---|:---|
|GET|JSON|无|
请求示例:
```url
http://www.ineeding.com/user/user01/published
```
返回示例：
```
{
	code:10,
	data:[{
		title:"辅导高等数学",
		filter:"学习辅导",
		is_need:false,
		price:100,
		image_url:"/one.jpg"
	},{
		title:"数码相机",
		filter:"",
		is_need:false,
		handle:"租赁",
		price:100,
		image_url:"two.jpg",
	},{
	...
	}]
}
```
API备注：
```txt
user01为用户名称
```
##接口路径："/my/messages"
|请求方式|返回格式|请求参数|
|:---|:---|:---|
|GET|JSON|无|
请求示例:
```url
http://www.ineeding.com/my/messages
```
返回示例：
```
{
	code:10,
	data:[{
		msg:"您好，系统升级成功，给您带来不便请谅解"
	},{
		msg:"您好，欢迎回来"
	}]
}
```
API备注：
```txt
无
```

##信息返回值
---
|code|return              |
|----|:-----------------  |
|-88 |IP访问限制          |
|-87 |请将参数值空        |
|-86 |活动已经完毕        |
|-85 |请求不存在          |
|-84 |请求已经过期        |
|-83 |账户余额不足        |
|-82 |内容敏感            |
|-81 |服务器拒绝接收      |
|-80 |请不要频繁操作      |
|-70 |没有权限操作        |
|-60 |不存在或已经被删除  |
|-50 |抱歉,服务器错误     |
|-40 |信息不合法          |
|-30 |信息不完整          |
|-20 |操作失败            |
|-10 |请求超时            |
|0   |预留返回码          |
|10  |操作成功            |
|20  |返回为字符串        | 
