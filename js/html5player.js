/**
 * Html5player.js
 *
 * @project Vesper HTML5 Audio player
 * @version 1.3
 * @author Jorge Garrido Oval, firezenk@gmail.com
 * @copyright 2013
 * @license MIT
 */
var lastfmAPIkey="bf7528310d7bdbb8584e57244cdb549b";

var zPlayer=document.getElementById("player");

var isPlaying=false;

document.addEventListener("DOMContentLoaded",function() {
  zAlbumArt()
},false);

function zMute() {
  zPlayer.muted=!zPlayer.muted;
}

function zPlayPause() {
  if(isPlaying) {
    document.getElementById("play").innerHTML="<icon>play</icon>";
    zPlayer.pause();
  } else {
    document.getElementById("play").innerHTML="<icon>pause</icon>";
    zPlayer.play();
  }
  isPlaying=!isPlaying;
}

function zStop() {
  document.getElementById("play").innerHTML="<icon>play</icon>";
  zPlayer.pause();
  zPlayer.currentTime=0;
  isPlaying=false;
  zTimeUpdate();
}

function zVolumeUp() {
  zPlayer.volume+=.1;
}

function zVolumeDown() {
  zPlayer.volume-=.1;
}

function zTimeUpdate() {
  document.getElementById("currenttime").innerHTML=convertTime(Math.floor(zPlayer.currentTime));
  document.getElementById("totaltime").innerHTML=convertTime(Math.floor(zPlayer.duration));
  document.getElementById("time").value=Math.floor(zPlayer.currentTime);
  document.getElementById("time").max=Math.floor(zPlayer.duration);
  
  if(zPlayer.currentTime>=zPlayer.duration)
    zAlbumArt();
}

function convertTime(sec) {
  var hrs = Math.floor(sec/3600);
  var min = Math.floor((sec%3600)/60);
  sec = sec % 60;
  if(sec<10) sec = "0" + sec;
  if(min<10) min = "0" + min;
  if(hrs!=0) return hrs + ":" + min + ":" + sec;
  else return min + ":" + sec;
}

function zAlbumArt() {

  var currentArtist = zPlayer.getAttribute('data-artist');
  document.getElementById('artist').innerHTML = "Artist: "+currentArtist;

  var currentAlbum = zPlayer.getAttribute('data-album');
  document.getElementById('album').innerHTML = "Album: "+currentAlbum;

  var url = "http://ws.audioscrobbler.com/2.0/?method=album.getinfo&api_key="+
    lastfmAPIkey+"&artist="+
    currentArtist+"&album="+
    currentAlbum;

  var xmlhttp;
  var txt,x,xx,i;

  if (window.XMLHttpRequest) xmlhttp = new XMLHttpRequest();
  else xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");

  xmlhttp.onreadystatechange = function() {

    if (xmlhttp.readyState==4 && xmlhttp.status==200) {
      x = xmlhttp.responseXML.documentElement.getElementsByTagName("album");

      for (i = 0; i<x.length; i++) {
        xx = x[i].getElementsByTagName("image");
          
        try {
          txt = "<img src='" + xx[1].firstChild.nodeValue + "'/>";
        } catch (er) {}
      }
      document.getElementById('art').innerHTML = txt;
    }
  }

  xmlhttp.open("GET",url,true);
  xmlhttp.send();
}