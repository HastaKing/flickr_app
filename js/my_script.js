$(document).ready(function() {
	$('#images').mixItUp();

	$("#images").hide();
	$('#tri').hide();
	$("#carousel").hide();

	$( "#commune" ).autocomplete({
		source: function(request, response) {
			$.ajax({
				dataType: "json",
				url: 'http://maps.googleapis.com/maps/api/geocode/json',
				data: {address: request.term, sensor: false},
				success: function(data) {
					response($.map(data.results, function(item) {
						return {
							label: item.formatted_address,
							value: item.formatted_address
						}
					}));
				}
			});
		},
		minLength: 2
	});

	$('#images').magnificPopup({
	 	delegate: 'a',
	 	type: 'image'
	});
	$( "#datepicker" ).datepicker({
		altField: "#datepicker",
		closeText: 'Fermer',
		prevText: 'Précédent',
		nextText: 'Suivant',
		currentText: 'Aujourd\'hui',
		monthNames: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'],
		monthNamesShort: ['Janv.', 'Févr.', 'Mars', 'Avril', 'Mai', 'Juin', 'Juil.', 'Août', 'Sept.', 'Oct.', 'Nov.', 'Déc.'],
		dayNames: ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'],
		dayNamesShort: ['Dim.', 'Lun.', 'Mar.', 'Mer.', 'Jeu.', 'Ven.', 'Sam.'],
		dayNamesMin: ['D', 'L', 'M', 'M', 'J', 'V', 'S'],
		weekHeader: 'Sem.',
		dateFormat: 'yy-mm-dd'
	});

	$('span.modal_close').on('click', function(){
		$('.modal').hide();
		$('.modalbg').hide();
	});

});

function maFonction() {
	$("#images").show();
	$('#tri').show();
	$("#carousel").hide();
	$("#switch").html("<button onclick='switchListe()' class='button orange'>Liste </button><button onclick='switchCarousel()' class='button blue'>Carousel</button>");
	var table = 0;
	var flickerAPI = "http://api.flickr.com/services/feeds/photos_public.gne?jsoncallback=?";
	$.getJSON( flickerAPI, {
		tags: $('#commune').val(),
		tagmode: "any",
		format: "json",
		lang: "fr-fr"
	})
	.done(function(data) {
		$("#images").empty();
		var j = 0;
		var table = 0;
		var monTableau = ""
		var carrousel = "";
		$.each( data.items, function( i, item ) {
			var imgLarge = item.media.m.split('m.jpg')[0] + 'b.jpg';

			var author = item.author.split('nobody@flickr.com (')[1].replace(')', '').replace(/"/g, '').replace(/'/g, '');
			var date = item.date_taken.split('T')[0];
			var heure = item.date_taken.split('T')[1].replace('-08:00', '');
			var data_d = date.replace(/-/g, '');
			var date_user = $("#datepicker").val().replace(/-/g, '');

			if(date_user == ""){
				monTableau +="<div class='mix' data-auth='"+author+"' data-name='"+item.title.replace(/"/g, '').replace(/'/g, '')+"' data-date='"+data_d+"' style='display: inline-block'><a class='myPicture' href='"+imgLarge+"' title='"+item.title.replace(/"/g, '').replace(/'/g, '')+" <i>prise le "+date+" à "+heure+"</i><small> par "+author+"</small>'><img src='"+item.media.m+"' class='monImage' ></a></div>";
				$(".fotorama").append("<img src='"+imgLarge+"'>");
				j = j+1;
			}
			else if(parseInt(date_user) <= parseInt(data_d)){
				monTableau +="<div class='mix' data-auth='"+author+"' data-name='"+item.title.replace(/"/g, '').replace(/'/g, '')+"' data-date='"+data_d+"' style='display: inline-block'><a class='myPicture' href='"+imgLarge+"' title='"+item.title.replace(/"/g, '').replace(/'/g, '')+" <i>prise le "+date+" à "+heure+"</i><small> par "+author+"</small>'><img src='"+item.media.m+"' class='monImage' ></a></div>";
				$(".fotorama").append("<img src='"+imgLarge+"'>");
				j = j+1;
			}

			if (j == $("#nbPhoto").val()) {
				return false;
			}
		});
		if(j == 0){
			/*
				modal error
	        */
			$('.modal').show();
			$('.modalbg').show();
		}
		$("#images").append(monTableau);
	});
};

function switchCarousel(){
	$("#images").hide();
	$('#tri').hide();
	$("#carousel").show();
}

function switchListe(){
	$("#images").show();
	$('#tri').show();
	$("#carousel").hide();
}