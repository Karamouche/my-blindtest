
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

		var ST = {
		    "name": "6.3",
		    "artists": [
		        "Naps",
		        "Ninho"
		    ],
		    "cover": "https://i.scdn.co/image/ab67616d0000b2732cd6b67be46f4bb11bf5dc4d",
		    "sample": "https://p.scdn.co/mp3-preview/e61d8897bc22cf65b03e67af2eb15b619974247c?cid=22dd5ffe1bdd4c588e1bf2177b66cc14"
		};

		var PUFF = {
		    "name": "PUFF PUFF PUFF",
		    "artists": [
		        "Gambi"
		    ],
		    "cover": "https://i.scdn.co/image/ab67616d0000b273eb7305df518f55400c11718f",
		    "sample": "https://p.scdn.co/mp3-preview/0ea7bc87a301be30a9ed2a4810a81bdac668e8b4?cid=22dd5ffe1bdd4c588e1bf2177b66cc14"
		};

		JCVD = this.jsonToTrack(JCVD);
		ST = this.jsonToTrack(ST);
		PUFF = this.jsonToTrack(PUFF);
		this.trackList = [JCVD, ST, PUFF];
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
		if (input.value.toUpperCase() == this.currentTrack.name.toUpperCase()){
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

function LtoS(L){
	var result = "";
	for (element of L){
		if (element == L[L.length - 1]){
			result += element;
		}else if(element == L[L.length - 2]){
			result += element+" and ";
		}else{
			result += element+", ";
		}
	}
	return result;
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
			text.textContent = "You lost ! It was "+ game.currentTrack.name +" by "+ LtoS(game.currentTrack.artists) +"."+'\r\n'+ "Your score : "+game.score;
			var image = document.getElementById("blindtest-img");
			image.classList.remove('blur');
		}
	}else{
		
	}
}

window.ondragstart = function() { return false; } 
var game = null;
const pommesong = new Track("soleil, soleil", "Pomme", "cover link", "sample link");
console.log(pommesong.toString());