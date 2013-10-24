var map,
	recorderMode = false,
	polygon = false,
	actMarkerId = false;
$(document).ready(function() {

	/*	Marker Icons	*/
	var pinColor_default = "FF7E73";
	var pinColor_active = "FFC9C4";
	var pinImage = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|" + pinColor_default,
		new google.maps.Size(21, 34),
		new google.maps.Point(0, 0),
		new google.maps.Point(10, 34));
	var pinImage_active = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|" + pinColor_active,
		new google.maps.Size(21, 34),
		new google.maps.Point(0, 0),
		new google.maps.Point(10, 34));
	var pinShadow = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_shadow",
		new google.maps.Size(40, 37),
		new google.maps.Point(0, 0),
		new google.maps.Point(12, 35));

	var markerAutoincrement = 0;

	/*	Map initialisieren	*/
	map = new GMaps({
		div: '#map',
		lat: 53.542654,
		lng: 8.576374,
		click: function(e) {
			if (recorderMode && polygon == false) {
				var markerId = genMarkerId(),
					lat = e.latLng.lat(),
					lng = e.latLng.lng();
				map.addMarker({
					id: markerId,
					lat: lat,
					lng: lng,
					icon: pinImage,
					shadow: pinShadow,
					draggable: true,
					dragstart: function(e) {
						if (polygon != false) {
							polygon.setMap(null);
						}
					},
					dragend: function(e) {
						markerUpdatePosition(this.id);
						markerControl(this.id);
						if (polygon != false) {
							draw();
						}
					},
					click: function(e) {
						markerControl(this.id);
					}
				});
				addMarkerInfo(markerId);
			}
		}
	});

	setZeichnenModus = function() {
		clearMap();
		$('.zeichnen-modus').show();
		$('.verwalten-modus').hide();
		$('#modus-zeichnen').removeClass('btn-default').addClass('btn-info');
		$('#modus-verwalten').addClass('btn-default').removeClass('btn-info');
		$('#panel-polygon-details').addClass("sr-only").removeClass('animated fadeInDown');
		polygon = false;
	}

	setVerwaltenModus = function() {
		clearMap();
		$('.zeichnen-modus').hide();
		$('.verwalten-modus').show();
		$('#modus-verwalten').removeClass('btn-default').addClass('btn-info');
		$('#modus-zeichnen').addClass('btn-default').removeClass('btn-info');
		$('#polygone').load('ajax/polygone.php');
		$('#marker-info .panel-element').remove();
		$('#panel-save').addClass('sr-only').removeClass('animated flipInX');
		$('#panel-marker-edit').addClass('sr-only').removeClass('animated flipInX');
		$('#marker-info i.hinweis1').show();
		$('#marker-info i.hinweis2').addClass('sr-only').removeClass('animated flipInX');
		polygon = true;
	}

	addMarkerInfo = function(id) {
		var lat = false,
			lng, html, el;
		el = getMarker(id)[0];
		lat = el.position.lat();
		lng = el.position.lng();
		html = '<div class="panel-element" data-id="' + id + '"><span class="marker-title">Marker #' + id + '</span><span class="marker-lat">lat: <span class="latlng" data-id="lat">' + lat + '</span></span><span class="marker-lng">lng: <span class="latlng" data-id="lng">' + lng + '</span></span></div>';
		$('#marker-info').append(html);
	}

	clearMap = function() {
		map.removePolygons();
		map.removeMarkers();
	}

	deleteMarker = function(id) {
		/* Marker-Informationen holen */
		var el = getMarker(id)[0],
			key = getMarker(id)[1];

		/*	Marker löschen	*/
		map.markers[key].setMap(null);
		map.markers.splice(key, 1);
		$('#marker-info .panel-element[data-id="' + id + '"]').remove();

		/* 'Marker bearbeiten'-Panel Inhalt generieren */
		$('#marker-form').html('<i>Um einen Marker zu bearbeiten müssen Sie den entsprechenden Marker auf der Karte auswählen.</i>');

		/* Polygon neu zeichnen, wenn es schon angezeigt wird */
		if (polygon) {
			polygon.setMap(null);
			if (map.markers.length > 3) {
				draw();
			} else {
				$('#panel-save').addClass('sr-only').removeClass('animated flipInX');
			}
		}
		if (map.markers.length < 3) {
			$('#zeichnen').attr('disabled', 'disabled');
		}
	}

	deletePolygon = function(id) {
		/*	Polygon aus Karte entfernen	*/
		clearMap();
		/*	Polygon aus Panel entfernen	*/
		$('#polygone .panel-element[data-id="' + id + '"]').remove();
		/*	Polygon aus DB entfernen	*/
		$.ajax({
			url: "ajax/deletePolygon.php",
			data: {
				id: id
			}
		})
			.done(function(data) {
				var html;
				if(data == 'success'){
					html = '<div class="alert alert-success">Polygon wurde erfolgreich entfernt!<a class="close" data-dismiss="alert" href="#" aria-hidden="true">&times;</a></div>';
				}
				else{
					html = '<div class="alert alert-error">Polygon wurde <b>nicht</b> erfolgreich entfernt!<a class="close" data-dismiss="alert" href="#" aria-hidden="true">&times;</a></div>';					
				}
				$('#msg').append(html);
			});
		/* Polygon Details Panel Inhalt aendern */
		$('#panel-polygon-details .panel-body').html('<i>Klicken Sie auf ein Polygon, um weitere Informationen zu erhalten</i>');
	}

	getMarker = function(id) {
		var el = false,
			key;
		$.each(map.markers, function(k, v) {
			if (typeof v != 'undefined') {
				v.setIcon(pinImage);
				if (v.id == id) {
					el = v;
					key = k;
				}
			}
		});
		if (!el) {
			alert('Markernummer ' + id + ' ist nicht vorhanden!');
			return false;
		}
		/* return array(Marker Element,map.markers Array key) */
		return [el, key];
	}


	setMarkerIcon = function(id, icon) {
		var el = getMarker(id)[0];
		el.setIcon(icon);
	}

	markerControl = function(id) {
		/*	Marker-Informationen holen 	*/
		var el = getMarker(id)[0];

		/* Panel-Inhalt (HTML) generieren */
		var markerInfo = '';
		markerInfo += 'Marker #' + id + ' ausgewählt<br />';
		markerInfo += '<form class="form-horizontal" role="form"><div class="form-group"><label class="col-lg-2 control-label">lat</label><div class="col-lg-10">';
		markerInfo += '<input type="text" class="form-control" name="lat" placeholder="lat" data-id="' + el.id + '" value="' + el.position.lat() + '">';
		markerInfo += '</div></div><div class="form-group"><label class="col-lg-2 control-label">lng</label><div class="col-lg-10">';
		markerInfo += '<input type="text" class="form-control" name="lng" placeholder="lng" data-id="' + el.id + '" value="' + el.position.lng() + '">';
		markerInfo += '</div></div><div class="form-group"><div class="col-lg-offset-2 col-lg-10">';
		markerInfo += '<button type="button" class="btn btn-danger delete-marker" id="' + el.id + '">Diesen Marker löschen</button><br />'; // delete Marker
		markerInfo += '</div></div></form>';

		/* Panel 'Marker bearbeiten' anzeigen */
		$('#marker-form').html(markerInfo);
		$('#panel-marker-edit').removeClass("sr-only").addClass('animated fadeInDown');

		/* diesen Marker als aktiv markieren */
		actMarkerId = id;
		setMarkerIcon(id, pinImage_active);
	}

	genMarkerId = function() {
		markerAutoincrement++;
		if (markerAutoincrement > 2) {
			$('#zeichnen').removeAttr('disabled');
		}
		return markerAutoincrement;
	}

	markerUpdatePosition = function(id) {
		var el = getMarker(id)[0],
			lat = el.position.lat(),
			lng = el.position.lng();
		/* Input Felder updaten	*/
		if (actMarkerId == id) {
			$('#marker-form input[name="lat"]').val(lat);
			$('#marker-form input[name="lng"]').val(lng);
		}

		/*	Info's im Marker-Panel updaten */
		$('#marker-info .panel-element span[data-id="lat"]').html(lat);
		$('#marker-info .panel-element span[data-id="lng"]').html(lng);
	}

	setRecorderMode = function(toggle) {
		recorderMode = toggle;
		if (toggle) {
			$('p[data-element="recorderMode"] span').addClass('icon-on');
		} else {
			$('p[data-element="recorderMode"] span').removeClass('icon-on');
		}
	}

	loadPolygon = function(id) {
		$.ajax({
			url: 'ajax/coords.php',
			data: {
				id: id
			},
		})
			.done(function(data) {
				data = jQuery.parseJSON(data);

				/* alle Marker und Polygone von Karte entfernen */
				clearMap();

				/* Koordinaten verarbeiten */
				var paths = new Array(),
					mapCenter = new Array(0, 0),
					counter = 0;
				$.each(data, function(k, v) {
					if (typeof v != 'undefined') {
						paths.push(v);
						mapCenter[0] += v[0];
						mapCenter[1] += v[1];
						/*	Marker hinzufuegen */
						map.addMarker({
							lat: v[0],
							lng: v[1],
							icon: pinImage,
							shadow: pinShadow
						});
						counter++;
					}
				});

				mapCenter[0] = mapCenter[0] / counter;
				mapCenter[1] = mapCenter[1] / counter;

				map.setCenter(mapCenter[0], mapCenter[1]);

				/* Polygon hinzufuegen */
				polygon = map.drawPolygon({
					paths: paths,
					strokeColor: '#BBD8E9',
					strokeOpacity: 1,
					strokeWeight: 3,
					fillColor: '#BBD8E9',
					fillOpacity: 0.6
				});
				/* Informationen zum Polygon hinzufuegen */
				var html = 'Beschreibung: <b>' + $('#polygone .panel-element[data-id="' + id + '"] .poly-beschreibung').html() + '</b><br /><button class="btn btn-danger delete-poylgon" id="' + id + '">Dieses Polygon entfernen</button>';
				$('#panel-polygon-details .panel-body').html(html);
				$('#panel-polygon-details').removeClass("sr-only").addClass('animated fadeInDown');
			});

	}

	draw = function() {
		/*	Alle Koordinaten in Array arr speichern */
		var arr = new Array();
		$.each(map.markers, function(k, v) {
			if (typeof v != 'undefined') {
				el = map.markers[k];
				var latLng = new Array(el.position.lat(), el.position.lng());
				arr.push(latLng);
			}
		});

		/*	Bereits eingezeichnete Polygone entfernen	*/
		map.removePolygons();

		/*	Polygon zeichnen */
		polygon = map.drawPolygon({
			paths: arr,
			strokeColor: '#BBD8E9',
			strokeOpacity: 1,
			strokeWeight: 3,
			fillColor: '#BBD8E9',
			fillOpacity: 0.6
		});

		/*	Panel-Infos anpassen	*/
		$('#marker-info i.hinweis1').hide();
		$('#marker-info i.hinweis2').removeClass('sr-only').addClass('animated flipInX');
		$('#panel-save').removeClass('sr-only').addClass('animated flipInX');
	}

	save = function() {
		var form = $('#panel-save form'),
			name = form.find('[name="name"]').val(),
			beschreibung = form.find('[name="beschreibung"]').val(),
			typ = form.find('[name="typ"]:checked').val(),
			markers = Array(),
			temp;

		/*	Koordinaten zum senden vorbereiten	*/
		$.each(map.markers, function(k, v) {
			if (typeof v != 'undefined') {
				temp = new Array(map.markers[k].position.lat(), map.markers[k].position.lng());
				markers.push(temp.join(','));
			}
		});
		markers = markers.join('|');

		$.ajax({
			type: "POST",
			url: "ajax/save.php",
			data: {
				name: name,
				beschreibung: beschreibung,
				typ: typ,
				coords: markers
			}
		})
			.done(function(data) {
				var html = '<div class="alert alert-success">Polygon wurde erfolgreich gespeichert!<a class="close" data-dismiss="alert" href="#" aria-hidden="true">&times;</a></div>';
				$('#msg').append(html);
				setVerwaltenModus();
			});

		return false;
	}

	/*	Eventlistener auf Tasteneingaben	*/
	$('html').keydown(function(e) {
		/* 
			keyCode n = 78
			um andere keyCodes zu ermitteln
			folgenden Code eintragen:
			
				console.log(e.keyCode);
			
			Dann im Browser die Konsole oeffnen
			die gewuenschten Tasten druecken.
			
			Der jeweilige keyCode steht dann
			in der Konsole
		*/
		if (e.keyCode == 78) {
			setRecorderMode(true);
		}
	});
	$('html').keyup(function(e) {
		if (e.keyCode == 78) {
			setRecorderMode(false);
		}
	});

	$('#marker-form').on('keyup', 'input', function(e) {
		var el = $(this),
			val = el.val(),
			type = el.attr('name'),
			markerId = el.attr('data-id'),
			marker = false,
			lat, lng;
		marker = getMarker(markerId)[0];

		lat = parseFloat($('#marker-form input[name="lat"]').val());
		lng = parseFloat($('#marker-form input[name="lng"]').val());
		marker.setPosition(new google.maps.LatLng(lat, lng));
		if (polygon) {
			draw();
		}
		markerUpdatePosition(markerId);
	});

	/*	Events */
	$('#panel-marker-edit').on('click', '.delete-marker', function() {
		$('#delete-marker').attr('data-id',$(this).attr('id'));
		$('#delete-marker').removeClass('sr-only').addClass('animated flipInX');
	});
	$('#panel-polygon-details').on('click', '.delete-poylgon', function() {
		$('#delete-polygon').attr('data-id',$(this).attr('id'));
		$('#delete-polygon').removeClass('sr-only').addClass('animated flipInX');
	});
	$('#button-delete-marker').click(function(){
		deleteMarker($('#delete-marker').attr('data-id'));
		$('#delete-marker').addClass('sr-only').removeClass('animated flipInX');
	});
	$('#button-delete-polygon').click(function(){
		deletePolygon($('#delete-polygon').attr('data-id'));
		$('#delete-polygon').addClass('sr-only').removeClass('animated flipInX');
	});
	$('.dismiss-alert').click(function(){
		$(this).parent().removeClass('flipInX').addClass('sr-only');
	});
	$('#zeichnen').click(function() {
		draw();
		$('#panel-menu').hide();
	});
	$('#marker-info').on('click', '.panel-element', function() {
		markerControl($(this).attr('data-id'));
	});
	$('#marker-info').on('mouseover', '.panel-element', function() {
		setMarkerIcon($(this).attr('data-id'), pinImage_active);
	});
	$('#marker-info').on('mouseout', '.panel-element', function() {
		if (actMarkerId != $(this).attr('data-id')) {
			setMarkerIcon($(this).attr('data-id'), pinImage);
		}
		if(actMarkerId){
			setMarkerIcon(actMarkerId, pinImage_active);
		}
	});
	$('#panel-save').on('click', '#panel-save-button', function() {
		save();
	});
	$('#modus-verwalten').click(function(e) {
		setVerwaltenModus();
		e.stopPropagation();
	});
	$('#modus-zeichnen').click(function(e) {
		setZeichnenModus();
		e.stopPropagation();
	});
	$('#panel-polygon-overview').on('click', '.panel-element', function() {
		loadPolygon($(this).attr('data-id'));
	});

	$("[data-toggle='tooltip']").tooltip();
});