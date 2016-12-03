$( document ).ready(function() {

	var fullDays=["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
	var version="1.01";
	var medicineList=[];
	var medicineData={};
	var points=[2,1];
	var dateStarted=moment().format('L');

	console.log(dateStarted);

	loadData(version);
	
	updateMedicine();
	$('#calendar').fullCalendar({
		header:false,
		defaultView:"basicWeek",
		columnFormat: 'dddd', 
		height: "parent",
		aspectRatio: 1.5,
		eventLimit: true,
		timeFormat: '',
		events: [
		],
		dayRender: function(daysOfWeek, cell)
		{	
			$(cell).removeClass('fc-state-highlight');
		},
		eventRender:function(event,element){
			// $(element).tooltip({title: "Seats: "+event.seats,animation:true,delay:25});
			$(element).css('border', 'solid 1px #26a69a');
			
			// if(medicineData[event.id].daysSet[event.dow[0]]==1){
			// 	$(element).toggleClass('event-checked');
			// }
	    },
	    eventClick: function(calEvent, jsEvent, view) {

        	//alert('Event: ' + calEvent.title);
        	//alert('Coordinates: ' + jsEvent.pageX + ',' + jsEvent.pageY);

        // change the border color just for fun

        	
        	// $(this).css('border')
        	var dayElement = document.elementFromPoint(jsEvent.pageX, jsEvent.pageY);
        	
        	$(this).toggleClass('event-checked');
        	
        	// medicineData[calEvent.id].daysSet;
        	var cur_day=$(this).parent().index();
        	
        	if(medicineData[calEvent.id].daysSet[cur_day]==1){
        		medicineData[calEvent.id].daysSet[cur_day]=0;
        	}
        	else{
        		medicineData[calEvent.id].daysSet[cur_day]=1;
        	}
			// console.log(medicineData[calEvent.id].daysSet);
	        	// medicineData[calEvent.id].daysSet[]=1;
        	// alert($('.event-checked').length+"  "+$('#calendar').fullCalendar('clientEvents').length);
        	// console.log($('#calendar').fullCalendar('clientEvents'));
        	updateMedicine();
        	saveData();
    	},
    	eventAfterRender:function( event, element, view ) { 

    		var cur_day=element.parent().index();
    		if(medicineData[event.id].daysSet[cur_day]==1){
			 	$(element).toggleClass('event-checked');
			}
    	}

	});
	readyDays();
	renderCalendar();
	$("#rewards-view").hide();
	$(window).resize(function() {

		if($(window).width()<800){
			var i=0;
			$("th.fc-day-header").each(function() {
				$(this).text(fullDays[i].substring(0,3));
				i++;
			});

		}
		else{
			var i=0;
			$("th.fc-day-header").each(function() {
				$(this).text(fullDays[i]);
				i++;
			});

		}
	});	

	$('.chips').material_chip();

	$("#add-button").click(function(){

		if($("#name").val()==''){
			Materialize.toast('Please enter medicine name', 2000);
			return;
		}
		else if($("#dosage").val()==''){
			Materialize.toast('Please enter dosage amount', 2000);
			return;
		}
		
		var days=[];
		for(var i=0;i<fullDays.length;i++){
			if($("#"+fullDays[i].substring(0,3)).prop('checked')){
				days.push(i);
			}
		}
		if(days.length==0){
			Materialize.toast('Please set days', 2000);
			return;
		}
		var eventObject = {
			id: $("#name").val(),
			title: $("#name").val()+'\n'+$("#dosage").val(),
			dow:days,
			color:"#000"
		};

		medicineList.push(eventObject.title.split('\n')[0]);
		var daysSet=Array.apply(null, Array(7)).map(Number.prototype.valueOf,0);
		console.log(daysSet);
		medicineData[medicineList[medicineList.length-1]]={
			dosage:$("#dosage").val(),
			days:days,
			daysSet:daysSet
		};
		updateMedicine();
		$("#calendar").fullCalendar( 'renderEvent', eventObject );
		saveData();
		Materialize.toast('Medicine Added!', 2000);

		$("#name").val("");
		$("#name").blur();
		$("#dosage").val("");
		$("#dosage").blur();
		for(var i=0;i<fullDays.length;i++){
			$("#"+fullDays[i].substring(0,3)).prop('checked',false);
		}
		Materialize.updateTextFields();
	});


	function readyDays(){

		if($(window).width()<800){
			var i=0;
			$("th.fc-day-header").each(function() {
				$(this).text(fullDays[i].substring(0,3));
				i++;
			});
			$("#copy-img").css("display","block");
			$("#copy-text").css("display","none");
			$("#close-img").css("display","block");
			$("#close-text").css("display","none");
		}
		else{
			var i=0;
			$("th.fc-day-header").each(function() {
				$(this).text(fullDays[i]);
				i++;
			});
			$("#copy-img").css("display","none");
			$("#copy-text").css("display","block");
			$("#close-img").css("display","none");
			$("#close-text").css("display","block");
		}

	}

	function updateMedicine(){
		$(".medicine-list").empty();
		var weekTaken=true;

		for(var i=0;i<medicineList.length;i++){
			var allTaken=true;
			console.log(medicineData[medicineList[i]].daysSet);
			for(var j=0;j<medicineData[medicineList[i]].days.length;j++){
				
				// console.log(medicineData[medicineList[i]].daysSet[medicineData[medicineList[i]].days]);
				// console.log();
				if(medicineData[medicineList[i]].daysSet[medicineData[medicineList[i]].days[j]]==0){
					allTaken=false;

				}
			}
			if(allTaken){
				$(".medicine-list").append("<div class='allTaken'>"+medicineList[i]+"</div>")
			}
			else{
				weekTaken=false;
				$(".medicine-list").append("<div>"+medicineList[i]+"</div>")
			}
		}
		if(medicineList.length==0)
			weekTaken=false;
		if(weekTaken){
			$(".medicine-title").css("color","#26a69a");
		}
		else{
			$(".medicine-title").css("color","#000");
		}
		var total=0;
		for(var i=0;i<points.length;i++){
			total+=points[i];
		}
		$(".points-title").text("Points - "+total);
	}



	function loadData(version){

		if(version!=localStorage.getItem("version")){

			localStorage.setItem("version",version);
			localStorage.setItem("medicineList",JSON.stringify(medicineList));
			localStorage.setItem("points",JSON.stringify(points));
			// localStorage.setItem("medicineData",);
		}
		else{
			
			points=JSON.parse(localStorage.getItem("points"));
			medicineList=JSON.parse(localStorage.getItem("medicineList"));
			console.log(medicineList);
			if(medicineList.length>0){
				medicineData=JSON.parse(localStorage.getItem("medicineData"));
			}

		}


	}

	function saveData(){

		localStorage.setItem("medicineList",JSON.stringify(medicineList));
		localStorage.setItem("medicineData",JSON.stringify(medicineData));
		localStorage.setItem("points",JSON.stringify(points));
	}

	function renderCalendar(){
		for(var i=0;i<medicineList.length;i++){
			var daysSet = medicineData[medicineList[i]].daysSet;
			// console.log(daysSet);
			var eventObject = {
				id:medicineList[i],
				title: medicineList[i]+'\n'+medicineData[medicineList[i]].dosage,
				dow:medicineData[medicineList[i]].days,
				color:"#000",

			};
			$("#calendar").fullCalendar( 'renderEvent', eventObject );
		}
	}

	 $("#calendarGo").click(function(){
		$("#calendar-view").show();
		$("#rewards-view").hide();
	 });
		

	$("#rewardsGo").click(function(){
		$("#calendar-view").hide();
		$("#rewards-view").show();
	 });


});