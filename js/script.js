
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
	constructor(items){
		this.score = 0;
		//get track from spotify API
		console.log(items);
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
		$("#input").attr("placeholder", "Your guess");
		$("#blindtest-img").addClass("blur");
	}

	jsonToTrack(jsonFile){
		return new Track(jsonFile.name, jsonFile.artists, jsonFile.cover, jsonFile.sample);
	}

	newTrack(){
		//generate and put a new track to the page
		this.currentTrack = this.trackList[Math.floor(Math.random()*this.trackList.length)];
		$("#blindtest-img").attr("src", this.currentTrack.cover);
		$("#input").val("");
		this.audio = new Audio(this.currentTrack.sample);
		this.audio.play();
	}

	checkAnswer(){
		//Check if the answer is right
		this.audio.pause();
		this.audio.currentTime = 0;
		if ($("#input").val().toUpperCase() == this.currentTrack.name.toUpperCase()){
			return true;
		}
		return false;
	}

	wonRound(){
		//round won and next round
		this.score++;
		$("#main_label").text("Score : "+this.score);
		this.newTrack();
	}

}

function startGame(data){
	game = new Game(data.items);
}

//convert a list to a format string
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

function connectSpotify(){
	const getUrlParameter = (sParam) => {
		let sPageURL = window.location.search.substring(1),////substring will take everything after the https link and split the #/&
		sURLVariables = sPageURL != undefined && sPageURL.length > 0 ? sPageURL.split('#') : [],
		sParameterName,
		i;
		let split_str = window.location.href.length > 0 ? window.location.href.split('#') : [];
		sURLVariables = split_str != undefined && split_str.length > 1 && split_str[1].length > 0 ? split_str[1].split('&') : [];
		for (i = 0; i < sURLVariables.length; i++) {
			sParameterName = sURLVariables[i].split('=');
			if (sParameterName[0] === sParam) {
			  return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
			}
		}
	};

    // Get Access Token
    const accessToken = getUrlParameter('access_token');

	//Application token & redirect uri
	const TOKEN = "22dd5ffe1bdd4c588e1bf2177b66cc14";
	let redirect_uri = 'https%3A%2F%2Fblindtest.geeklin.fr';

	//login screen
	const redirect = `https://accounts.spotify.com/authorize?client_id=${TOKEN}&response_type=token&&scope=user-library-read%20user-top-read&redirect_uri=${redirect_uri}`;

	if(accessToken == null || accessToken == "" || accessToken == undefined){
    	window.location.replace(redirect);
    }

    return accessToken;
}


function accessData(accessToken){
	$.ajax({
		url: "https://api.spotify.com/v1/me/top/tracks",
		type: 'GET',
		datatype: "json",
		data: {
			"limit": 50,
			"time_range": "long_term"
		},
		headers: {
		'Authorization' : 'Bearer ' + accessToken
		},
		success: function(data){
			console.log(data);
		}

	});
}



//function when click on the button
function validateFormLink(){
	if (game == null){//if there is no game
		var accessToken = connectSpotify();
		accessData(accessToken);
		console.log(accessToken);
		//CREATE GAME HERE
		if(game != null){
			$("input").show();
			$("button").text("Validate");
			$("#input").val("");
			$("#main_label").text("Game started. Score : "+game.score);
			game.newTrack();
		}

	}else if(game.inGame){
		if(game.checkAnswer()){
			game.wonRound();
		}
		else{
			game.inGame = false;
			$("#main_label").text("You lost ! It was “"+ game.currentTrack.name +"” by "+ LtoS(game.currentTrack.artists) +"."+'\r\n'+ "Your score : "+game.score);
			$("#blindtest-img").removeClass("blur");
			$("button").hide();
			$("input").hide();
		}
	}
}

$("input").hide();
window.ondragstart = function() { return false; } //avoid dragging image
var game = null;
