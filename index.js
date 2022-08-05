function addCommand(id){
	arg = '<div class="command-id">'+id+'</div>'
	arg += '<div class="command-data">DAT</div>'
	arg += '<div class="command-param1">0</div>'
	arg += '<div class="command-param2">0</div>'

	document.querySelector('.tape').insertAdjacentHTML('beforeend', "<div id='tape"+id+"' class='command'>"+arg+"</div>");
}

function addCell(id){
	document.querySelector('.battleField').insertAdjacentHTML('beforeend',"<div id='cell"+id+"' class='cell'></div>");
}

var botcount = 0;
function addBot(){
	
	if ((botcount<10)&&(botcount*100<max)) {
	
		
	document.querySelector('.add-bot').insertAdjacentHTML('beforebegin',"<div class='bot'> <textarea style='resize: none; width: 100%; height: calc(100% - 40px)' onkeyup=initBot("+botcount+") class='botSource-"+botcount+"'></textarea> <input type='file' class='read' onchange='openFile(event,"+botcount+")'> </div>");	
	document.querySelector('.botSource-'+botcount).value="ORG 0\n";
	document.querySelector('#cell'+botcount*100).classList.add('bot-'+botcount);
	document.querySelector('#tape'+botcount*100).classList.add('bot-'+botcount);
	document.querySelector('#tape'+botcount*100).classList.add('cursor-'+botcount);
	jmp(botcount,0)	
	botcount+=1

	if (botcount==10) {
		document.querySelector('.add-bot').remove()
	}
	}
}

function botEditor(id) {
	var botArray = document.querySelector(".botSource-"+id).value.split("\n")
	botArray.shift()
	return botArray;

}
function getOrg(id){
	return org = document.querySelector(".botSource-"+id).value.split("\n")[0]
}
function getCursor(cursor) {
	try { return 1*document.querySelector(".cursor-"+cursor).id.slice(4)
	} catch(e) { return null }
}

function mov(botid,a,b) {
    var cursor = getCursor(botid)*1
	botid=botid*1;

	//a = mode(a,botid);
	//b = mode(b,botid);

	//a=a*1;
	//b=b*1;
	
	var addr = adr(mode(a,cursor,botid),max)
	var addr2 = adr(mode(b,cursor,botid),max)
	setCell(addr2,getCell(addr));
	colorize(botid,addr2)
	jmp(botid,1)	
}
function at(a,botid) {
	a*=1; botid*=1;
	var one = adr(getCursor(botid)+a,max)
	var two = 1*getCell(adr(getCursor(botid)+a,max))[1]

	return one+two;
}
function mode(a,botplace,botid) {
	var f = a[0]
	switch(f) {
		case '#':
			return 1*a.slice(1);
			break;
		case '@':
			return at(a.slice(1),botid);
			break;
		default:
			return 1*a+1*botplace;
			break;
	}
}
function add(botid,a,b) {
	var botplace = getCursor(botid)*1;
	botid*=1;
	var addr = 0
	var addr2 = 0
	var help = 0;
	
	switch(a[0]) {
		case '#':
			help = 1*a.slice(1)
			break;
		default:
			addr = 1*adr(botplace+a,max);
			help = 1*getCell(addr)[1];
			break;
	}
	switch(b[0]) {
		case '#':
			help2 = 0;
			addr2 = 1*botplace;
			break;
		default:
			console.log("botplace: " + botplace + " b: " + b);
			addr2 = 1*adr(1*botplace+1*b,max)
			console.log("addr2: " + addr2)
			help2 = 1*getCell(addr2)[1]
			break;
	}

	console.log("help: " + a + " help2: " + b)
	var sum = 1*help+1*help2;	
	setCell(addr2,[null,sum,null])

	jmp(botid,1)	

}

function getCell(addr) {
	addr*=1;
	var data = [];
	data.push(document.querySelector("#tape"+addr+" .command-data").innerHTML); 
	data.push(document.querySelector("#tape"+addr+" .command-param1").innerHTML);  
	data.push(document.querySelector("#tape"+addr+" .command-param2").innerHTML);
	return data;
}

function setCell(addr,data) {
	addr*=1; 
	
		
	if (data[0] != null) {document.querySelector("#tape"+addr+" .command-data").innerHTML = data[0]}
	if (data[1] != null) {document.querySelector("#tape"+addr+" .command-param1").innerHTML = data[1]}
	if (data[2] != null) {document.querySelector("#tape"+addr+" .command-param2").innerHTML = data[2]}
}

function adr(pos,max){
	return (pos%max+max)%max;
}

function colorize(botid,addr) {
	for (var i = 0; i<botcount; i++) {
		document.querySelector("#tape"+addr).classList.remove("bot-"+i)	
		document.querySelector("#cell"+addr).classList.remove("bot-"+i)
	}

	document.querySelector("#cell"+addr).classList.add("bot-"+botid)
	document.querySelector("#tape"+addr).classList.add("bot-"+botid)

}
function jmp(botid,b) {
	botid*=1;
	var botplace = getCursor(botid)*1
	var addr = adr(mode(b,botplace,botid),max)

	setCursor(botid,addr);
	colorize(botid,addr);
	
}

function setCursor(botid,b) {
	botid*=1;
	var botplace = getCursor(botid)*1
	var addr = b;

	for (var i = 0; i<botcount; i++) {
		document.querySelector("#tape"+addr).classList.remove("cursor-"+i)	
		document.querySelector("#cell"+addr).classList.remove("cursorCell-"+i)

	}

	document.querySelector("#tape"+botplace).classList.remove("cursor-"+botid)
	document.querySelector("#cell"+(botplace)).classList.remove("cursorCell-"+botid)
	document.querySelector("#cell"+addr).classList.add("cursorCell-"+botid)
	document.querySelector("#tape"+addr).classList.add("cursor-"+botid)
}
function process(botid) {
	i = botid
	if (getCursor(i) != null) {
		var com = getCommand(getCursor(i))
	
			switch(com[0].toLowerCase()) {
				case 'mov':
					mov(i,com[1],com[2]);
					break;
				case 'add':
					add(i,com[1],com[2]);
					break;
				case 'jmp':
					jmp(i,com[1])
					break;
				}
	
			}
}
function step(){

	for (var i = 0; i<max; i++) {
		if (getCursor(i) != null) {
		var com = getCommand(getCursor(i))
	
			switch(com[0].toLowerCase()) {
				case 'mov':
					mov(i,com[1],com[2]);
					break;
				case 'add':
					add(i,com[1],com[2]);
					break;
				case 'jmp':
					jmp(i,com[1])
					break;
				}
	
			}
		}
}
function pause(){
	clearInterval(interval)
}
function initBot(id) {
	try {	
	var bot = botEditor(id)
	
	if (getOrg(id).length>0) {
		var command = compile(getOrg(id)) 
		command[1] = 1*command[1]+100*id;
		setCursor(id,command[1])
	}

	var commands = [] 
	for (var i = 0; i<bot.length; i++) {
		commands.push(compile(botEditor(id)[i]))
		document.querySelector("#cell"+(id*100+i)).classList.add("bot-"+id)
		document.querySelector("#tape"+(id*100+i)).classList.add("bot-"+id)
		document.querySelector("#tape"+(id*100+i)+" .command-data").innerHTML = commands[i][0]
		document.querySelector("#tape"+(id*100+i)+" .command-param1").innerHTML = commands[i][1]
		document.querySelector("#tape"+(id*100+i)+" .command-param2").innerHTML = commands[i][2]
		
	}
	for (var i = bot.length; i<((id+1)*100); i++) {
		document.querySelector("#cell"+(id*100+i)).classList.remove("bot-"+id)
		document.querySelector("#tape"+(id*100+i)).classList.remove("bot-"+id)
		document.querySelector("#tape"+(id*100+i)+" .command-data").innerHTML = "DAT"
		document.querySelector("#tape"+(id*100+i)+" .command-param1").innerHTML = "0"
		document.querySelector("#tape"+(id*100+i)+" .command-param2").innerHTML = "0"

	}
	return commands;
	} catch(e) {}
	
}

function getCommand(place) {
    var arr = []
    arr.push(document.querySelector("#tape"+place+" .command-data").innerHTML)
    arr.push(document.querySelector("#tape"+place+" .command-param1").innerHTML)
    arr.push(document.querySelector("#tape"+place+" .command-param2").innerHTML)
    return arr;
}

function compile(command){
	try {
    var arr = []
    arr.push(command.split(" ")[0])
    arr.push(command.split(" ")[1].split(",")[0])
    arr.push(command.split(" ")[1].split(",")[1])
	if (arr[2] == undefined) {
		arr[2] = "0"
	}
	var check = arr[0].length*arr[1].length;
	if (check) {
    return arr;
	} else {
	return ["DAT","0","0"]
	}
	} catch(e) {}
}

function stop() {
	try {
	for (var i = 0; i<10; i++) {
		document.querySelector('.bot').remove();
	}
	} catch(e) {}
	botcount=0;
    document.querySelector(".battleField").innerHTML = ""
  document.querySelector(".tape").innerHTML = ""
setup()
}
var max = 0;
function setup(){

max = 1*document.querySelector("#max").value;
for (var i = 0; i<max; i++) {
	addCommand(i)
}

for (var i = 0; i<max; i++) {
	addCell(i)
}

if (document.querySelectorAll(".cell").length>max) {
	stop()
}

}
setup()
var interval = 0;
function play() {
	clearInterval(interval)
	speed = (20-1*document.querySelector("#speed").value);
	if (speed==20) {
		pause()
	}
	speed*=50;
	interval = setInterval(step,speed)
}


    var openFile = function(event,botToRun) {
        var input = event.target;

        var reader = new FileReader();
        reader.onload = function(){
          var text = reader.result;
          var node = document.querySelector('.botSource-'+botToRun);
          node.value = text;
			initBot(botToRun)
          console.log(reader.result.substring(0, 200));
        };
        reader.readAsText(input.files[0]);
      };

