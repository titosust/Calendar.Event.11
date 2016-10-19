var List=function function_name(domElem,opt) {
	if (!(this instanceof List)){
         return new List(domElem);
     }
    if(undefined === domElem){
    	throw "Undefined domElem!!!! Nothing for display!!!";
    }
    var options={elemClass:'list',childTemplate:'<li><li>'};
    this.opt=extend(options,(opt||{}));
    this.elem={'parent':domElem,'ul':false};
    this._isInit=false;

    this.init=function(){
    	if(this._isInit) return false;

    	this.elem['ul']=document.createElement('ul');
    	this.elem['ul'].className = this.opt['elemClass'];
    	this.elem['parent'].appendChild(this.elem['ul']);
    	this._isInit=true;

    }
    this.draw=function(data,keyset){
    	this.init();
    	keyset=keyset||[];
    	for(var id=0,lnd=data.length;id<lnd;id++){
    		var item=data[id],
    			food=[];
    		for(var i=0,ln=keyset.length;i<ln;i++){
	    		var cel=keyset[i];

	    		food[cel]=this.getData(item,cel);
	    	}
	    	if(Object.keys(food).length){
	    		this.addChild(this.getChildTemplate(food));
	    	}	
    	}
    	
    }
    this.getChildTemplate=function(food){
    	var re =/\{(.+?(?=\}))\}/g;
    	var template=this.opt['childTemplate'],
    		varis=this.getAllMatches(template,re);
    	if(varis && varis.length>0){
    		for(var i=0,ln=varis.length;i<ln;i++){
	    		var m=varis[i];
	    		if(food.hasOwnProperty(m[1])){
	    			template=template.replace(m[0],food[m[1]]);
	    		}

	    	}	
    	}
    	return template;
    }
    this.addChild=function(str){
    	var child = document.createElement('div');
		child.innerHTML = str;
		child = child.firstChild;
		this.elem['ul'].appendChild(child);

    }
    this.getData=function(obj){
    	var args = arguments[1].split('.');
		for (var i = 0; i < args.length; i++) {
		    if (!obj || !obj.hasOwnProperty(args[i])) {
		      return obj[args[i]];
		    }
		    obj = obj[args[i]];
		  }

		  return obj;
    }
    this.getAllMatches=function(str,exp){
    	var re =exp||/\{(.+?(?=\}))\}/g,
    		result=[],
    		m=false;

		while (m = re.exec(str)) {
			result.push(m);
		}
		return result;
    }
}

function extend(){
    for(var i=1; i<arguments.length; i++)
        for(var key in arguments[i])
            if(arguments[i].hasOwnProperty(key))
                arguments[0][key] = arguments[i][key];
    return arguments[0];
}