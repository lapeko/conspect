function debug(message){
	var log = document.getElementById('debug');
	if (!log){
		log = document.createElement('div');
		log.id = "debug";
		log.innerHTML = '<h1>Праверка раз-два.</h1>';
		document.body.appendChild(log);
	}
	var pre = document.createElement('pre')
	var text = document.createTextNode(message);
	pre.appendChild(text);
	log.appendChild(pre);
}

var twoLines = 'Раз два \
три четыре';
var e = 'e';
debug(twoLines);
debug(e.length);
debug(twoLines[4]);
var a;
debug("" + typeof(undefined));