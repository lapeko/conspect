// function inherit(p){
// 	if (p == null) throw TypeError();
// 	if (Object.create) return Object.create(p);
// 	if (typeof p !== 'Object' && typeof p !== 'function')
// 		throw typeError();
// 	function f(){};
// 	f.prototype = p;
// 	return new f();
// }

Object.defineProperty(Object.prototype, 'copyProperties',{
	writable: false,
	configurable: false,
	enumerable: false,
	value: function(obj){
		var names = Object.getOwnPropertyNames(obj);
		for (var nameProperty in names){
			if (obj.hasOwnProperty(names[nameProperty]))
				if (this.hasOwnProperty(names[nameProperty])) 
					continue;
				else
					Object.defineProperty(this, names[nameProperty], Object.getOwnPropertyDescriptor(obj, names[nameProperty]));
		}
	}
});

function classOf(object){
	if (object === null)
		return 'Null';
	else if(object ===  undefined)
		return 'Undefined';
	else
		return Object.prototype.toString.call(object).slice(8, -1);
}

function addPrivateProperty(o ,name, predicate){
	var value;
	o['get' + name] = function() { return value; } ;
	o['set' + name] = function(val){
		if (predicate && !predicate(val))
			throw new Error(val + ' - не верное значение');
		else
			value = val;
	}
}

function monkeyPatching(object, /*string*/ methodName){
	var original = object[methodName];
	object[methodName] = function(){
		//instructions
		var result = original.apply(this, arguments);
		return result;
	}
}

function array(args, n){ return Array.prototype.slice.call(args, n || 0); }
function partialLeft(f /*, ... */ ){
	var args = array(arguments, 1);
	return function(){
		args = args.concat(array(arguments));
		return f.apply(null, args);
	}
}
function partialRight(f /*, ... */ ){
	var args = array(arguments, 1);
	return function(){
		args = array(arguments).concat(args);
		return f.apply(null, args);
	}
}
function partial(f /*, ... */ ){
	var args = array(arguments, 1);
	return function(){
		for (var i = 0, j = 0, len = args.length; i < len; i++)
			args[i] = args[i] == null ? arguments[j++] : args[i];
		console.log(j);
		args = args.concat(array(arguments, j));
		return f.apply(null, args);
	}
}

//Мемоизация
function memoize(f) {
	var cache = {}; // Кэш зна­че­ний со­хра­ня­ет­ся в за­мы­ка­нии.
	return function() {
   	// Соз­дать стро­ко­вую вер­сию мас­си­ва arguments для ис­поль­зо­ва­ния
   	// в ка­че­ст­ве клю­ча кэ­ша.
   	var key = arguments.length + Array.prototype.join.call(arguments,",");
   	if (key in cache) return cache[key];
   	else return cache[key] = f.apply(this, arguments);
   };
}

//Фабричная функция
function range(from, to){
	var methods = {
		includes: function(x){ return this.from <= x && this.to >= x; },
		foreach: function(f){ for(var i = this.from; i <= this.to; i++) f(i); },
		toString: function(){ return this.from + '...' + this.to; }
	}
	var r = Object.create(methods);
	r.from = from;
	r.to = to;
	return r;
}

//							Протестить !!!!

var extend = (function(){
	for (var bol in {toString: null}){
		var copy = function(o){
		for (var i = 1; i < arguments.length; i++)
			for (var prop in arguments[i])
				o[prop] = arguments[i][prop];
		}
		return o;
	}
	var methods = ['hasOwnProperty', 'isPrototypeOf', 'propertyIsEnumerable', 'toLocaleString', 'toString', 'valueOf', 'constructor'];
	return function fixExtend(o){
		for (var i = 1; i < arguments.length; i++)
			for (var prop in arguments[i])
				o[prop] = arguments[i][prop];
		for (var prop in methods)
			if (!(o.hasOwnProperty(o[prop]))) o[prop] = methods[prop];
	}	
})();

function defineClass(constructor, methods, statics){
	if (methods) extend(constructor.prototype, methods);
	if (statics) extend(constructor, statics);
	return constructor;
}

getClassString = function(obj){
	if (obj && obj.constructor && typeof obj.constructor === 'function')
		return obj.constructor.toString().slice(9, obj.constructor.toString().indexOf('('));
	return undefined;
}

// ------------------ myFunctions -----------------------
function objectToString(obj){
	var line = '{', dot = false;;
	
	var conct = function(line2){
		line += dot ? ', ' + line2 : line2;
		dot = true;
	}
	
	for (var prop in obj){
		if (obj[prop] === undefined){ conct(prop + ': undefined'); continue; }
		if (obj[prop] === null){ conct(prop + ': null'); continue; }
		if (classOf(obj[prop]) !== 'Object'){ conct(prop + ': ' + obj[prop].toString()); }
		else { conct(prop + ': ' + objectToString(obj[prop])); }
	}
	return line + '}';
}

function isNum(test){
	return !isNaN(test) && test !== ' ';
}

{
	function onLoad(f){
		if (onLoad.loaded)
			setTimeout(f, 0);
		else if (window.addEventListener)
			window.addEventListener('load', f, false);
		else if (window.attachEvent)
			window.attachEvent('onload', f, false);
	}
	onLoad.loaded = false;
	onLoad(function(){onLoad.loaded = true;});
}

function invoke(f, start, interval, end){
	if (!start) start = 0;
	if (arguments.length <= 2)
		setTimeout(f, start);
	else{
		setTimeout(repeat, start)
		function repeat(){
			var num = setInterval(f, interval);
			if (end) setTimeout(function(){ clearInterval(num) }, end);
		}
	}
}