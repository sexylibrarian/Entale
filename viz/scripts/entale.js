var entale = {
	data:{
		rows: new Array(),
		events: new Array(),
		items: new Array()
	}
}


//initialize entale
function initEntale(){
	loadJSON();
	
}

function setupCaltip(it){
	for(var i = 0 ; i < it.length; i++){
		console.log(it[i].title)
		$('.icon:eq('+i+')').caltip({
		    title   : it[i].title,
		    content : it[i].source
		});
	}
}

//load json
function loadJSON(){
	$.getJSON('scripts/json/events.json', function(data){
		entale.data.events = data;
	});

	$.getJSON('scripts/json/items.json', function(data){
		entale.data.items = data;

		$.getJSON('scripts/json/rows.json', function(data){
			entale.data.rows = data;
			buildRows(data, entale.data.events);
			setupCaltip(entale.data.items);
		});
	});

	
}

function buildRows(d, e){
	for (var i = 0 ; i < d.length; i++){

		//build rows
		$('<div/>', {
			'class': 'row',
			'id': i
		}).appendTo('#storyline_viz');

		//append event ________
		if (d[i].event == true){
			$('<div/>', {
				'class': 'event'
			}).appendTo('#' + i);
			$('<div/>').appendTo('#' + i + ' .event');
				$('<div/>').appendTo('#' + i + ' .event>div');
					$('<h1/>', {'text': e[d[i].eventid].name }).appendTo('#' + i + ' .event>div:eq(0)>div:eq(0)');
					$('<h2/>', {'text': e[d[i].eventid].date }).appendTo('#' + i + ' .event>div:eq(0)>div:eq(0)');
					$('<p/>', {'text': e[d[i].eventid].summary }).appendTo('#' + i + ' .event>div:eq(0)>div:eq(0)');
				$('<div/>').appendTo('#' + i + ' .event>div');
					$('<img/>', {'src': e[d[i].eventid].image }).appendTo('#' + i + ' .event>div:eq(0)>div:eq(1)');


			//for filter
			$('#' + i).attr('event', 'true');
		}
		else {
			//append perspectives_______
			$('<div/>', {
				'class': 'perspectives'
			}).appendTo('#' + i);
			
			if (d[i].oppose == true){
				$('<div/>', {
					'class': 'oppose'
				}).appendTo('#' + i + ' .perspectives');
				$('<div/>').appendTo('#' + i + ' .oppose');
			}

			if (d[i].support == true){
				$('<div/>', {
					'class': 'support'
				}).appendTo('#' + i + ' .perspectives');
				$('<div/>').appendTo('#' + i + ' .support');
			}

			if (d[i].neither == true){
				$('<div/>', {
					'class': 'neither'
				}).appendTo('#' + i + ' .perspectives');
				$('<div/>').appendTo('#' + i + ' .neither');
			}

			buildItems(d, entale.data.items, d[i].rowid);
		}

		

		$('<div/>', {
			'class': 'date'
		}).appendTo('#' + i);
		$('<h3/>', {
			'text': d[i].month + '/' + d[i].day + '/' + d[i].year
		}).appendTo('#' + i + ' .date');
	}
}

function buildItems(d, it, id){
	for (var i=0 ; i < it.length; i++){
		if (it[i].rowid == id){
			$('<div/>', {
				'class': 'icon'
			}).appendTo('#' + id + ' .' + it[i].position + '>div');
		}
		else {continue;}
	}
}

window.onload = function(){
	initEntale();
}