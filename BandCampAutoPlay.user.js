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
var volume_control = document.createElement('input');
volume_control.setAttribute('type', 'range');
volume_control.setAttribute('min', '0');
volume_control.setAttribute('max', '100');
volume_control.style.position = 'fixed';
volume_control.style.left = '12px';
volume_control.style.top = '12px';
volume_control.setAttribute('value', '70');
volume_control.style.zIndex = '99';
volume_control.id = 'volume_control';
volume_control.title = 'Volume Control';
volume_control.onchange = () => {
	let volumevalue = document.getElementById('volume_control').value;
	console.log("Changing volume to " + volumevalue);
	let audioelements = document.querySelectorAll('audio');
	for (let i = 0; i < audioelements.length; i++) {
		if (audioelements[i].paused == false) {
			if (parseInt(this.value) != NaN) {
				audioelements[i].volume = (parseInt(volumevalue) / 100.0);
			}
		}
	}
};
document.body.appendChild(volume_control);
window.setInterval(async () => {
	//console.log('Script autonext interval');
	try {
		if (stopnext)
			return;


		let songitems = document.querySelectorAll('div.result-current.discover-result>div.discover-item');
		if (songitems.length == 0) {
			stopnext = true;
			console.log('Tumbleweed detected');
			document.querySelector('div.discover-pages>div>a.selected').dispatchEvent(new Event('mousedown'));
			await new Promise(r => setTimeout(r, 5000));
			stopnext = false;
			return;
		}
		if (document.querySelector('div.result-current.discover-result>div>a.playing') == null
			&& document.querySelector('span.time_elapsed').innerText == '00:00') {
			console.log('Song not playing, activating next song');
			stopnext = true;
			await new Promise(r => setTimeout(r, 5000));
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
					stopnext = true;
					console.log('Going to next page of songs');
					//let currentpage = document.querySelector('div.discover-pages>div>a.selected')
					document.querySelector('div.discover-pages>div>a.selected').nextElementSibling.dispatchEvent(new Event('mousedown'));
					await new Promise(r => setTimeout(r, 2000));
					gs_currentsong = 0;
					document.querySelector('div.result-current.discover-result>div.discover-item>a.item-link.playable').click()
					stopnext = false;
				} else {
					// next song
					console.log('Activating song ' + gs_currentsong);
					songitems[gs_currentsong].querySelector('a.item-link.playable').click();
				}
				stopnext = false;
			}
		} else {
			if (document.querySelector('div.result-current.discover-result>div.discover-item>a.playing') != null &&
				document.querySelector('div.result-current.discover-result>div.discover-item>a.playing').parentElement
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
		console.log(err);
	}

}, 1000);



