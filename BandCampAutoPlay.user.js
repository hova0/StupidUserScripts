// ==UserScript==
// @name     bandcamp next song
// @version  1
// @grant    none
// @author 		hova
// @include 	https://bandcamp.com/?*
// ==/UserScript==

var gs_currentsong;
var stopnext = false;
console.log('Script autonext activate');

window.setInterval(async () => {
	//console.log('Script autonext interval');
	try {
		if (stopnext)
			return;
		let songitems = document.querySelectorAll('div.result-current.discover-result>div.discover-item');

		if (document.querySelector('div.result-current.discover-result>div>a.playing') == null
			&& document.querySelector('span.time_elapsed').innerText == '00:00') {
			console.log('Song not playing, activating next song');
			// next song plz
			if (gs_currentsong == null) {
				console.log('Starting first song');
				let firstsong = songitems[0].querySelector('a.item-link.playable');
				firstsong.click();
				gs_currentsong = 0;
			} else {
				console.log('Going to next song');
				gs_currentsong++;
				if (gs_currentsong > 7) {
					// next set 
					console.log('Going to next page of songs');
					//let currentpage = document.querySelector('div.discover-pages>div>a.selected')
					document.querySelector('div.discover-pages>div>a.selected').nextElementSibling.dispatchEvent(new Event('mousedown'));
					await new Promise(r => setTimeout(r, 2000));
					gs_currentsong = 0;
					document.querySelector('div.result-current.discover-result>div.discover-item>a.item-link.playable').click()
					// TEMP
					stopnext = true;
				} else {
					// next song
					console.log('Activating song ' + gs_currentsong);
					songitems[gs_currentsong].querySelector('a.item-link.playable').click();
				}
			}
		} else {
			if (document.querySelector('div.result-current.discover-result>div.discover-item>a.playing').parentElement
				!= songitems[gs_currentsong]) {
				let playingsong = document.querySelector('div.result-current.discover-result>div.discover-item>a.playing').parentElement;
				for (i = 0; i < songitems.length; i++) {
					if (songitems[i] == playingsong) {
						console.log('Current song changed from ' + gs_currentsong + ' to ' + i);
						gs_currentsong = i;
						break;
					}
				}
			}
		}
	} catch (err) {
		console.log('Error happen' + err);
	}

}, 1000);



