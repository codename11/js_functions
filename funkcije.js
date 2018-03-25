function serialization(phpdoc,forma,choice,elemName){
	/*First argument is where data is sent to, second is keyword 'this', third is boolean value. 
	If it's false, it is sent as ordinary formated AJAX string. If it's true, it is sent as json string.
	Forth one is an id of an element where ajax response from server you want to be displayed.
	It works on these input types: checkbox, radio, text, number, textarea, password, select-one(select) and email.
	Word of caution: If there's a radio button/s on page, one of them need to have attribute checked.
	Warning for select-one: If value attribute is not provided(ommited) in option sub-tag, it's text i.e innerHTML is used as value. 
	If value attribute is provided, but doesn't have any 'value' i.e an empty string "", it will become an value. 
	Use following line in php file ' print_r(json_decode(json_encode($_GET),true)); ' w/o quotes.
	Crucial thing is distinction between types being sought. While text, number and similar may be easy to sort out,
	checkboxes and radio buttons need to be checked if they're present AND hold value. 
	Also need to be taken into consideration is that radio buttons absolutly HAVE TO default value when page is loaded. 
	*/
	var formax = forma;//Getting form object.
	
	var obj = {//Creating JS object with arrays as values that will contan names and values of input fields.
			"name" : [],
			"value" : []
		};

	var Wboard = document.getElementById(elemName);//Getting element where we want to display response from server.
	var name = "";//String variable for temorary storage of names of input fields.
	var val = "";//String variable for temorary storage of values of input fields.
	var doc = phpdoc+"?"//String variable which will be later added to string with names and values gathered from form elements. Then it will be sent with standard ajax request. To used this, third parameter when function is called needs to be boolean false.
	var str = "";//String variable that contains string together with path to php file that has being sent with standard ajax.
	var i = 0;//Integer used as a counter in loops inside this function.

	var net = formax.querySelectorAll("#"+formax.id+" [name]");//Gathering of all elements inside a forma with cetain id. Elements are found by it's distinctive names.
	var len = net.length;//A length of sorts of how many elements are found inside a form.

	while(i<len) {

		if(net[i].type=="radio" && net[i].checked===true){//Checking if radio button is checked.
			name = net[i].name;
			val = net[i].value;	
		}
	
		if(net[i].type=="checkbox" && net[i].checked===true){//Checking if checkbox is checked. If it's true, assign name and value.
			name = net[i].name;
			val = net[i].value;	
		}
		
		if(net[i].type=="checkbox" && net[i].checked===false){//Checking if checkbox is checked. If it's true, assign name and value. In tis case, value is empty string.
			name = net[i].name;
			val = "";	
		}
		
		if(net[i].type!="checkbox" && net[i].type!="button" && net[i].type!="radio"){//If none of form inputs are of these types assign them value.
			name = net[i].name;
			val = net[i].value;
		}
		
		str += name+"="+val;//Adding collected names and values to string which is used as a entry point for sending data either as ordinary string or json string.

		if(i<len-1){
			str += "&";//Adding sign after each assigned value to the name even if values is empty string.
		}

		i++;
	}

	var res = str.split("&");//Splitting string to array to remove duplicates.
	var resLen = res.length-1;//Length of said array.
	res = res.filter(function(elem, index, self) {//Duplicate filtration.
		return index === self.indexOf(elem);
	});
	
	str = "";//Resseting string and adding elements wthout duplicates.
	for(i=0;i<resLen;i++){//Iterating through array, separating names from values by determined coordinates of equal sign. Names and values are then appended to string and to JS object. 
		
		if(res[i]!==undefined){
			str += res[i];//Appending filtered names and values.
			var Eqsign = res[i].indexOf("=");//Locating coordinates of equal sign.
			obj.name[i] = res[i].substring(0,Eqsign);//Assigning names to name subarray after "substring it" without equal sign.
			obj.value[i] = res[i].substring(Eqsign+1);//Assigning values to value subarray after "substring it" without equal sign.
		}
		
		if(i<resLen-1){
			str += "&";//Adding sign after every appendage except to last one.
		}
		
	}
	
	var jason = JSON.stringify(obj);//Parsing previously said object to json string.
	str = encodeURI(doc+str);//Creating string suitable for sending it with ordinary ajax request.
	str1 = str;
	
	var xhttp = new XMLHttpRequest();
			
	xhttp.onreadystatechange = function() {
		
		if((Wboard!=undefined || Wboard!=null) && this.readyState == 4 && this.status == 200){
			Wboard.innerHTML = this.responseText;
			//document.getElementById(formax.id).reset(); 
			
		}
		 
	};
	
	if(choice===false){//Sending a standard ajax string.
		xhttp.open("GET", str, false);	
		xhttp.send();
		document.getElementById("str").innerHTML = str;
	}
		
	if(choice===true){//Sending json formated string.
		xhttp.open("GET", doc+"jason="+jason,true);
		xhttp.setRequestHeader("Content-Type", "application/json");
		xhttp.send();

	}
			
}