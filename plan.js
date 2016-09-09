// 2.自定义更新
// 	 2.1.自定义时间更新
// 	 2.2.自定义频率更新
// 	 2.3.自定义批量时间更新

var schedule = require('node-schedule'); 

// 随机时间  默认8:00 ~ 23：00
function randomTime(start,end){
	var start = start || 8,
		end   = end || 23;
	var curDayS = +new Date(new Date().toJSON().slice(0,10)); // 2016-08-08 
	var startStamp = curDayS+(start-8)*3600*1000;
	var endStamp = curDayS+(end-8)*3600*1000;
	var randomStamp = curDayS+ ~~(Math.random()*(endStamp-startStamp));
	return randomStamp;
}

// 指定次数或随机次数
function getTimes(){
	// 0个参数 默认随机1-4次
	// 1个参数 指定次数
	// 2个参数 指定次数区间
	var args = arguments;
	var times;
 	if(args.length==1){
 		times = args[0];
 	}else if(args.length==2){
 		times = Math.ceil((Math.random()*(args[1]-args[0])+args[0]));
 	}else {
 		times = Math.ceil((Math.random()*4));
 	}
	return times;
}

// 单次定时任务
function start(date,task){
	// 定时任务2s内或过期自动延时2s
	// var date = (+new Date(date)- +new Date())<=2000?+new Date(date)+2000:date;
	var job = schedule.scheduleJob(new Date(date),function(){
		console.log('Task start at：'+ new Date().toLocaleString());
		task();
	});
}

// 周期定时任务
function taskEveryDay(hour,task){
	var rule = new schedule.RecurrenceRule();
	rule.hour = hour; 
	rule.minute = 0; // 必须指定
	var job = schedule.scheduleJob(rule,function(){
		console.log('EveryDayTaskStart:\n');
		task();
	});
}

// 主入口
function mainEntry(obj){
	// 每天定点主任务
	var start = obj.mainStart;
	var times = obj.updateCount;
	console.log('The everyday task will start at '+start+' clock !\n');
	taskEveryDay(start,function(){
		// 更新次数
		var updateTimes = getTimes(updateMin,updateMax);
		// 更新时间数组
		var arrTime = [];
		for(var i =1;i<=updateTimes;i++){
			arrTime.push(randomTime(obj.updateStart,obj.updateEnd));
		}
		console.log('Today has total '+updateTimes+' update task!\n');
		console.log('Update time is '+arrTime +'\n');
		// 每次定时任务
		arrTime.map(function(date){
			start(date,function(){
				update();
			});
		});
		
	});
}

// 主任务参数
var option = {
	mainStart   : 6,   // 主任务每天开始时间
	updateMin   : 2,   // 更新最小次数
	updateMax   : 4,   // 更新最大次数
	updateStart : 8,   // 更新区间开始时间
	updateEnd   : 23   // 更新区间结束时间
}

if(process.argv.includes('s')){
	console.log('Update once!');
	update();
}else if(process.argv.includes('n')){
	console.log('Update everyday!');
	mainEntry(option);
}else {
	console.log('Args must s for single or n for everyday!');
}




// 周期定时任务
// function taskEveryMinite(task){
// 	var rule = new schedule.RecurrenceRule();
// 	rule.hour = 11; 
// 	// rule.minute = 16; // 必须指定,不指定则每分钟执行
// 	// rule.seconds = 10;
// 	var job = schedule.scheduleJob(rule,function(){
// 		console.log('TaskStart:\n');
// 		task();
// 	});
// }

// function randomTT(){
// 	var randomStamp = +new Date() + ~~(Math.random()*5000) +1000;
// 	return randomStamp;
// }

// taskEveryMinite(function(){
// 	var arr = [];
// 	for(i=0;i<5;i++){
// 		arr.push(randomTT());
// 	}
// 	arr.map(function(date){
// 		start(date,function(){
// 			console.log('child task!!!!');
// 		});
// 	});

// });