window.addEventListener('load', function(){
	
	var lists = document.getElementsByTagName('ul');
	var regexp = /\bdnd\b/;
	
	for (var i = 0; i < lists.length; i++)
		if (regexp.test(lists[i].className)){
			console.log('dnd');
			dnd(lists[i]);
		}

	function dnd(list){
		var original_class = list.className;
		var entered = 0;

		var items = list.getElementsByTagName('li');
		for (var i = 0; i < items.length; i++)
			items[i].draggable = true;
		
		list.ondragstart = function(e){
			if (e.target.tagName !== 'LI') return false;
			var dt = e.dataTransfer;
			dt.setData('Text', e.target.innerText);
			dt.effectAllowed = 'copyMove';
		};

		list.ondragover = function(e){console.log('ondragover'); return false};

		list.ondragleave = function(e){
			console.log('ondragleave');
			var to = e.relatedTarget;
			entered--;
			if ((to && !ischild(to, list)) || entered <= 0){
				list.className = original_class;
				entered = 0;
			}
			return false;
		};

		list.ondragenter = function(e){
			console.log('ondragenter');
			var from = e.relatedTarget;							// Указываает из какого элемента была совершена буксировка вроде как
			entered++;
			if ((from && !ischild(from, list)) || entered == 1){
				var dt = e.dataTransfer;
				var types = dt.types;
				if (types.indexOf('text/plain') != -1){
					list.className = original_class + ' droppable';
					return false;
				}
			}
			return false;
		};

		list.ondrop = function(e){
			console.log('ondrop');
			var dt = e.dataTransfer;
			var text = dt.getData('Text');
			if (text){
				var item = document.createElement('li');
				item.draggable = true;
				item.appendChild(document.createTextNode(text));
				list.appendChild(item);
				list.className = original_class;
				entered = 0;
				return false;
			}
		};

		list.ondragend = function(e){
			console.log('ondragend');
			if (e.dataTransfer.dropEffect === 'move')
				e.target.parentNode.removeChild(e.target)
		}
	};

	function ischild(a, b){
		for(;a; a = a.parentNode)
			if (a === b) return true;
		return false;
	}

});