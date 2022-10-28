
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
		this.trackList = [];
		this.inGame = true;
		this.currentTrack = null;
		this.audio = null;
		for (var element of items){
    		let track_name = element["name"];
			let artists_name = [];
			for (var artist of element["artists"]){
				artists_name.push(artist["name"]);
			}
			let cover = element["album"]["images"][0]["url"];
			let sample = element["preview_url"];
			var result = new Track(track_name, artists_name, cover, sample);
			this.trackList.push(result);
		}

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

function createGame(data){
	window.game = new Game(data.items);
	$("input").show();
	$("button").text("Validate");
	$("#input").val("");
	$("#main_label").text("Game started. Score : "+window.game.score);
	window.game.newTrack();
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
	return $.ajax({
				url: "https://api.spotify.com/v1/me/top/tracks",
				type: 'GET',
				datatype: "JSON",
				data: {
					"limit": 50,
					"time_range": "long_term"
				},
				headers: {
				'Authorization' : 'Bearer ' + accessToken
				}
			});
}



//function when click on the button
function validateFormLink(){
	if (window.game == null){//if there is no game
		var accessToken = connectSpotify();
		$.when( accessData(accessToken) ).done(function(response){
			window.data = response;
		});
		//data transfer time
		setTimeout(() => { createGame(window.data); }, 500);
	}else if(game.inGame){
		if(game.checkAnswer()){
			game.wonRound();
		}
		else{
			game.inGame = false;
			$("#main_label").text("You lost ! It was “"+ game.currentTrack.name +"” by "+ LtoS(game.currentTrack.artists) +"."+'\r\n'+ "Your score : "+game.score);
			$("#blindtest-img").removeClass("blur");
			$("button").text("Play again");
			$("input").hide();
		}
	}else{
		location.reload();
	}
}

$("input").hide();
window.ondragstart = function() { return false; } //avoid dragging image
var game = null;
var data = null;
