var entale = {
	data:{
		rows: new Array(),
		events: new Array()
	}
}


//initialize entale
function initEntale(){
	loadJSON();
}

//load json
function loadJSON(){
	$.getJSON('scripts/json/events.json', function(data){
		entale.data.events = data;
	});

	$.getJSON('scripts/json/rows.json', function(data){
		entale.data.rows = data;
		buildRows(data, entale.data.events);
	});
}

function buildRows(d, e){
	for (var i = 0 ; i < d.length; i++){

		//build rows
		$('<div/>', {
			'class': 'row',
			'id': i
		}).appendTo('#storyline_viz');

		//append event _________
		if (d[i].event == true){
			$('<div/>', {
				'class': 'event'
			}).appendTo('#' + i);
			$('<h1/>', {
				'text': e[d[i].eventid].name
			}).appendTo('#' + i + ' .event');
		}

		//append perspectives_______
		$('<div/>', {
			'class': 'perspectives'
		}).appendTo('#' + i + ' .event');
		$('<div/>', {
			'class': 'oppose'
		}).appendTo('#' + i + ' .event .perspectives');
		$('<div/>', {
			'class': 'neither'
		}).appendTo('#' + i + ' .event .perspectives');
		$('<div/>', {
			'class': 'support'
		}).appendTo('#' + i + ' .event .perspectives');

		//date_______________________
		$('<div/>', {
			'class': 'date'
		}).appendTo('#' + i);
		$('<h3/>', {
			'text': d[i].month + '/' + d[i].day + '/' + d[i].year
		}).appendTo('#' + i + ' .date');
	}
}

window.onload = function(){
	initEntale();
}