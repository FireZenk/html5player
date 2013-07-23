/**
 * Vesper.js 
 *
 * @project Vesper
 * @version 1.6
 * @author Jorge Garrido Oval, firezenk@gmail.com
 * @copyright 2013
 * @license MIT
 */
function zMute(){
  zPlayer.muted=!zPlayer.muted
}

function zPlayPause(){
  if(isPlaying){
    document.getElementById("play").innerHTML="<icon>play</icon>";
    zPlayer.pause()
  } else {
    document.getElementById("play").innerHTML="<icon>pause</icon>";
    zPlayer.play()
  }
  wavesurfer.playPause();
  isPlaying=!isPlaying
}

function zStop(){
  document.getElementById("play").innerHTML="<icon>play</icon>";
  zPlayer.pause();
  zPlayer.currentTime=0;
  isPlaying=false;
  zTimeUpdate()
}

function zVolumeUp(){
  zPlayer.volume+=.1
}

function zVolumeDown(){
  zPlayer.volume-=.1
}

function zTimeUpdate(){
  document.getElementById("currenttime").innerHTML=convertTime(Math.floor(zPlayer.currentTime));
  document.getElementById("totaltime").innerHTML=convertTime(Math.floor(zPlayer.duration));
  document.getElementById("time").value=Math.floor(zPlayer.currentTime);
  document.getElementById("time").max=Math.floor(zPlayer.duration);
  
  if(zPlayer.currentTime>=zPlayer.duration)
    zAlbumArt()
  }

  function convertTime(e){
    var t=Math.floor(e/3600);
    var n=Math.floor(e%3600/60);
    e=e%60;

    if(e<10)  e="0"+e;
    if(n<10)  n="0"+n;
    if(t!=0)  return t+":"+n+":"+e;
    else      return n+":"+e
  }

function zAlbumArt(){
  var e=zPlayer.getAttribute("data-artist");
  var t=zPlayer.getAttribute("data-album");
  var n="http://ws.audioscrobbler.com/2.0/?method=album.getinfo&api_key="+lastfmAPIkey+"&artist="+e+"&album="+t;
  var r,i,s,o,u;
  if(window.XMLHttpRequest)
    r=new XMLHttpRequest;
  else 
    r=new ActiveXObject("Microsoft.XMLHTTP");
  r.onreadystatechange=function(){
    if(r.readyState==4&&r.status==200){
      s=r.responseXML.documentElement.getElementsByTagName("album");
      for(u=0;u<s.length;u++){
        o=s[u].getElementsByTagName("image");
        try {
          i="<div style='background-image: url("+o[1].firstChild.nodeValue+");background-repeat: no-repeat;'></div>"
        } catch(e){ }
      }
      document.getElementById("art").innerHTML=i
    }
  };

  r.open("GET",n,true);
  r.send()
}

var lastfmAPIkey="bf7528310d7bdbb8584e57244cdb549b";
var zPlayer=document.getElementById("player");
var filename = document.getElementById('player').getAttribute('src');
var isPlaying=false;
var wavesurfer=Object.create(WaveSurfer);

document.addEventListener("DOMContentLoaded",function(){
  wavesurfer.init({
    container:document.querySelector(".waveform"),
    fillParent:true,
    markerColor:"rgba(0, 0, 0, 0.5)",
    frameMargin:.1,
    maxSecPerPx:parseFloat(location.hash.substring(1)),
    loadPercent:true,
    waveColor:"darkgray",
    progressColor:"whitesmoke",
    loaderColor:"transparent",
    cursorWidth:0
  });
  wavesurfer.load(document.getElementById("player").src)
});

ID3.loadTags(filename, function() {
  var tags = ID3.getAllTags(filename);

  document.getElementById('artist').innerHTML = "Artist: "+tags.artist;
  document.getElementById('player').setAttribute('data-artist', tags.artist);
  document.getElementById('album').innerHTML = "Album: "+tags.album;
  document.getElementById('player').setAttribute('data-album', tags.album);

  zAlbumArt();
},{tags: ["artist","album"]})