
class Track{
	constructor(name, artists, cover, sample){
        this.name = name
        this.artists = artists
        this.cover = cover
        this.sample = sample
	}

	toString(){
		return (this.name + " || " + this.artists + " || " + this.cover + " || " + this.sample);
	}
}

class Game{
	constructor(link){
		this.score = 0;
		this.link = link;
		//get track from spotify API
		var JCVD = {
		    "name": "JCVD",
		    "artists": [
		        "Jul"
		    ],
		    "cover": "https://i.scdn.co/image/ab67616d0000b2733c505b5ddcbdf80c7dff5a1f",
		    "sample": "https://p.scdn.co/mp3-preview/6754a91bc040ffbb2f70980fbcadf86385a109e9?cid=22dd5ffe1bdd4c588e1bf2177b66cc14"
		}

		var RB = {
		    "name": "Rêves bizarres (feat. Damso)",
		    "artists": [
		        "Orelsan",
		        "Damso"
		    ],
		    "cover": "https://i.scdn.co/image/ab67616d0000b2733331ab0675406c3c6d711c25",
		    "sample": "https://p.scdn.co/mp3-preview/e712914a1ba6f1bf60e36552311f715d5b992a97?cid=22dd5ffe1bdd4c588e1bf2177b66cc14"
		};

		JCVD = this.jsonToTrack(JCVD);
		RB = this.jsonToTrack(RB);
		this.trackList = [JCVD, RB];
		this.inGame = true;
		this.currentTrack = null;
		this.audio = null;
		document.getElementById("input").placeholder = "Your guess."
	}

	jsonToTrack(jsonFile){
		return new Track(jsonFile.name, jsonFile.artists, jsonFile.cover, jsonFile.sample);
	}

	newTrack(){
		this.currentTrack = this.trackList[Math.floor(Math.random()*this.trackList.length)];
		var image = document.getElementById("blindtest-img");
		image.classList.add('blur');
		image["src"] = this.currentTrack.cover;
		var input = document.getElementById("input");
		input.value = "";
		this.audio = new Audio(this.currentTrack.sample);
		this.audio.play();
	}

	checkAnswer(){
		this.audio.pause();
		this.audio.currentTime = 0;
		var input = document.getElementById("input");
		if (input.value == this.currentTrack.name){
			return true;
		}
		return false;
	}

	wonRound(){
		this.score++;
		var text = document.getElementById("main_label");
		text.textContent = "Game started. Score : "+this.score;
		this.newTrack();
	}

}


function validateFormLink(){
	if (game == null){
		var text = document.getElementById("main_label");
		var input = document.getElementById("input");
		game = new Game("random link");//input.value
		input.value = "";
		text.textContent = "Game started. Score : "+game.score;
		game.newTrack();
	}else if(game.inGame){
		if(game.checkAnswer()){//boolean returned
			game.wonRound();
		}
		else{
			game.inGame = false;
			var text = document.getElementById("main_label");
			text.textContent = "You lost ! Your score : "+game.score;
			var image = document.getElementById("blindtest-img");
			image.classList.remove('blur');
			image["src"] = "https://cdn-icons-png.flaticon.com/512/232/232413.png";
		}
	}else{
		var text = document.getElementById("main_label");
		text.textContent = "You lost ! Your score : "+game.score;
	}
}

window.ondragstart = function() { return false; } 
var game = null;
const pommesong = new Track("soleil, soleil", "Pomme", "cover link", "sample link");
console.log(pommesong.toString());