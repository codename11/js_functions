function serialization(phpdoc,me,choice){
	/*First argument is where data is sent to, second is keyword 'this', third is boolean value. 
	If it's false, it is sent as ordinary formated AJAX string. If it's true, it is sent as json string.
	It works on these input types: checkbox, radio, text, number, textarea and email.*/
	var FormId = me.form.id;
	
	var obj = {
			"name" : [],
			"value" : []
		};

	var name = "";
	var val = "";
	var str = phpdoc+"?";
	var i = 0;
	var temp1 = "";
	var temp2 = "";
	
	var net = me.form.querySelectorAll("#"+FormId+" [name]");
	var len = net.length;
	
	while(i<len) {

		if(net[i].type=="radio" && net[i].checked===true && net[i].value!=""){
			name = net[i].name;
			val = net[i].value;	
		}
		
		if(net[i].type=="radio" && net[i].checked===false){
			net[i].name = "";
			net[i].value = "";
			name = net[i].name;
			val = net[i].value;	
		}
	
		if(net[i].type=="checkbox" && net[i].checked===true){
			name = net[i].name;
			val = net[i].value;	
		}
		
		if(net[i].type=="checkbox" && net[i].checked===false){
			name = net[i].name;
			net[i].value = "";
			val = net[i].value;	
		}
		
		if(net[i].type!="checkbox" && net[i].type!="button" && net[i].type!="radio"){
			name = net[i].name;
			val = net[i].value;
		}
		
		i++;
		
		if(i<len){
			
			str += "&";
		}
		
		str += name+"="+val;

	}
	
	var str_len=str.length;
	var last_char = str.substring((str_len-1), str_len);//if last char in str is '='
	
	var unwanted1 = str.indexOf("&=");
	var unwanted2 = str.indexOf("?&");
	
	if(last_char==="="){
		
		temp1 = str.substring(0, str_len-1);
		str = temp1;
	}
	
	if(unwanted1>(-1)){
		
		var temp1 = str.substring(0,unwanted1+1);
		var temp2 = str.substring(unwanted1+2);
		str = temp1+temp2;
	}
	
	if(unwanted2>(-1)){

		var temp1 = str.substring(0,unwanted2+1);
		var temp2 = str.substring(unwanted2+2);
		str = temp1+temp2;
	}

	str = encodeURI(str);
	str1 = str;
	
	var xhttp = new XMLHttpRequest();
			
	xhttp.onreadystatechange = function() {
		
		if((document.getElementById("raport")!=undefined || document.getElementById("raport")!=null) && this.readyState == 4 && this.status == 200){
			document.getElementById("raport").innerHTML = this.responseText;
		}
		 
	};
		
	if(choice===false){
		xhttp.open("GET", str, false);	
		xhttp.send();
		alert(str);
	}
		
	if(choice===true){
		var Qsign = str.indexOf("?");
		var strx = "";
		strx = str.substr(Qsign+1);
		var res = strx.split("&");
		
		for(var i=0;i<res.length;i++){
			
			var Eqsign = res[i].indexOf("=");
			
			var x = res[i].substr(0,Eqsign);
			var y = res[i].substr(Eqsign+1);
			
			obj.name[i] = x;
			obj.value[i] = y;

		}
		
		var jason = JSON.stringify(obj);
		alert(jason);
	}
			
}