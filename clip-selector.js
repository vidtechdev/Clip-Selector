// JavaScript Document

var media = document.querySelector('video');
var controls = document.querySelector('.controls');

var play = document.querySelector('.play');
var stop = document.querySelector('.stop');
var slower = document.querySelector('.slower');
var faster = document.querySelector('.faster');

var setIn = document.getElementById('setIn');
var setOut = document.getElementById('setOut');
var clickTime;
var displayIn = document.querySelector('.display-in');
var displayOut = document.querySelector('.display-out');

var clip = {}; //{src, start, end};  
/*var clip = {
	src: '',
	in: clipIn() {},
	out: clipOut() {},
	timelinePosition: '',
	vfx1: '', // ?? vfx would probably make sense somewhere else.. IDEA noted here for now though.
	vfx2: '', // ?? 	
};*/
var clips = []; // should this be an object too?  clips = {clipid : { src, start, end, timelinePosition, clipDuration},...};

var cc = document.querySelector('.cc');

var timerWrapper = document.querySelector('.timer');
var timer = document.querySelector('.timer span');
var timerBar = document.querySelector('.timer div');

var cti = document.querySelector('.cti');
var ctiLoc;
var ctiUnit;
var ctiRects;

var scrubber = document.querySelector('.scrubber');
var vidProg = document.querySelector('.vidprog');
var progress = document.querySelector('.progress span');
var jumpTo;
var seeker = document.querySelector('.seeker');
var scrubberRect = scrubber.getBoundingClientRect();
var handleIn = document.querySelector('.handle #in');
var handleOut = document.querySelector('.handle out');

// VARIABLES FOR WORKING WITH VIDEO FRAMES AND SECONDS
var totalFrames = media.duration*30;
var spf30 = 1/30;

//var clickX;
//var clickY;

// SET CLIP IN AND OUT VARIABLES
// ..each clip could be an object?  --> clip1 = { src, in, out, ...}

media.removeAttribute('controls');			//media is the variable referencing the video element
controls.style.visibility = 'visible';


//// DEFINING EVENT LISTENERS ////
// ..Player UI
play.addEventListener('click', playPauseMedia);
stop.addEventListener('click', stopMedia);
//cc.addEventListener('click', toggleCaptions);
slower.addEventListener('click', mediaSlower);
faster.addEventListener('click', mediaFaster);
// ..Playback Events
media.addEventListener('ended', stopMedia);
media.addEventListener('click', playPauseMedia);
media.addEventListener('timeupdate', setTime);
media.addEventListener('timeupdate', ctiDisplay);
// ..Clip Data User Interactions
setIn.addEventListener('click', clipIn);
setOut.addEventListener('click', clipOut);
scrubber.addEventListener('click',clickCoord);
//scrubber.addEventListener('')



// DEFINING FUNCTIONS
//..controls

function playPauseMedia() {
	if(media.paused) {
//		play.setAttribute('class', 'play fas fa-pause');
		play.textContent = '||';
		media.play();
	}else{
//		play.setAttribute('class', 'play fas fa-play');
		play.textContent = 'P';
		media.pause();
	}
}

function stopMedia() {
	media.pause();
	media.currentTime = 0;
//	play.setAttribute('class', 'play fas fa-play');
	play.textContent = 'P';
}

function setTime() {
	var minutes = Math.floor(media.currentTime / 60);
	var seconds = Math.floor(media.currentTime - minutes * 60);
	var minuteValue;
	var secondValue;

	if(minutes < 10) {
		minuteValue = '0' + minutes;
	}else{
		minuteValue = minutes;
	}

	if (seconds < 10) {
		secondValue = '0' + seconds;
	}else{
		secondValue = seconds;
	}

	var mediaTime = minuteValue + ':' + secondValue;
	timer.textContent = mediaTime;

	var barLength = timerWrapper.clientWidth * (media.currentTime/media.duration);
	timerBar.style.width = barLength + 'px';
}


// PLAYBACK SPEED CONTROLS
function mediaSlower() {
	var newSpeed;
	var currentSpeed = media.playbackRate;
	if(currentSpeed === .5) {
		newSpeed = .5;
		media.playbackRate = newSpeed;
	}else{
		newSpeed = currentSpeed - .5;
		media.playbackRate = newSpeed;
	}
}

function mediaFaster() {
	var newSpeed;
	var currentSpeed = media.playbackRate;
	if(currentSpeed === 2) {
		newSpeed = 2;
		media.playbackRate = newSpeed;
	}else{
		newSpeed = currentSpeed + .5;
		media.playbackRate = newSpeed;
	}
}

// TO DOs: SETTING CLIP IN AND OUT POINTS (BUTTONS)
//    1. Create master clip array
//    2. Create working clip object {clip_id:{src: '', in: '', out: ''}
//    3. Push working clip object to master clip array ---
//  4. Create UI and error checking
//      a. show current clip.in.value, clip.out.value  -- if (clip.out.value < clip.in.value) => ERROR...
//      b. create Save/Submit button to push working clip object ot mater clip array

function clipIn() {
  //if currentTime >= current clip.out.value => Alert error: choose a clipIn time that comes BEFORE clipOut time
	displayIn.textContent = 'Start: ' +  ((Math.floor(media.currentTime*100))/100);
	handleIn
}

function clipOut() {
	// if this.currentTime <= clip.in.value => Alert Error: choose a clipOut time that comes AFTER clipIn time
	
	displayOut.textContent =  'End: ' + ((Math.floor(media.currentTime*100))/100);
  media.pause();
}

function clickCoord(e) {
	var clickX = e.x;
	var clickY = e.y;

	//var scrubberXL = scrubber.getBoundingClientRect('left');		//don't need these to mirror playback by click location... but this helps to set handles.
	//var scrubberXR = scrubber.getBoundingClientRect('right');		//don't need these to mirror playback by click location... but this helps to set handles.
	
	// makes width of the scrubber === total length of the video and adds functionality so currentTime will jump to the same relative location where you clicked
	jumpTo = (Math.floor((clickX/scrubber.clientWidth)*100)/100);
	media.currentTime = (Math.floor((media.duration*jumpTo)*100)/100);
	media.play();
	//make cti track with currentTime
	//console.log('X: ' + clickX) + ',' + console.log('Y: ' + clickY) + ',' + console.log((jumpTo*100))+ ',' + console.log(media.currentTime);

}

//setting CTI to mirror video completion percentage
function ctiDisplay() {
	ctiLoc = Math.floor((media.currentTime/media.duration)*100);
	progress.textContent = ctiLoc;
	ctiUnit = scrubber.clientWidth/100;
	ctiLoc = ctiUnit*ctiLoc;
	cti.style.left = (ctiLoc + 'px');
}

// FUNCTIONS FOR WORKING WITH VIDEO FRAMES AND SECONDS
// Is it possible (or better) to add these as Methods() to the video element, or a Video{} object?.

function goToFrame(frame) {
	var seconds = frame*spf30;
	return seconds;
// or...	
//	media.currentTime = seconds;
}
//  then...  media.currentTime = goToFrame(frame);

function getFrames(seconds) {
	var framesAtSeconds = seconds/spf30;
	return framesAtSeconds;
}

function getCurrentFrames() {
	var currentFrame = Math.floor(media.currentTime*30);
	return currentFrame;
}

