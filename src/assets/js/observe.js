const observe=(function(){
			var msg={};
			return {
				regist:function(type,fun){
					if(!typeof fun=="function"){
						return ;
					}
					if(msg[type]){
						msg[type].push(fun);
					}else{
						msg[type]=[fun];
					}
				},
				fire: function (type, args) {
					if(msg[type]){
						var _event={
							type:type,
							args:args
						}
						msg[type].forEach(function(item){
							item(_event);
						})
					}
				},
				remove:function(type,fun){
					if(!typeof fun=="function"){
						return ;
					}
					if(msg[type]){
						msg[type]=msg[type].filter(function(item){
							return item!==fun
						})
					}
				}
			}
})();
module.exports =   observe;
//测试
//observe.regist("a",function(ee){alert(ee.args)});
//observe.fire("a","aa")