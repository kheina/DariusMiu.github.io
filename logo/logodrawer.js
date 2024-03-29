var logoclass = 'logo-draw';

var logos = document.getElementsByClassName(logoclass);
var logo = logos[0];
//logo.innerHTML = '';

var svg = logo.childNodes;
var paths = [];
{
	var potentialpaths = svg[0].childNodes;
	for (i = 0; i < potentialpaths.length; i++)
	{
		if (potentialpaths[i].tagName == 'g')
		{ potentialpaths = potentialpaths[i].childNodes; }
	}
	var pathindex = 0;
	for (i = 0; i < potentialpaths.length; i++)
	{
		if (potentialpaths[i].tagName == 'path' || potentialpaths[i].tagName == 'line')
		{
			paths[pathindex] = potentialpaths[i];
			pathindex++;
		}
	}
}
console.log('paths self-check...');
if (paths.length != 4)
{
	console.log('incorrect number of paths:' + paths.length + ' (should be 3)');
	console.log(potentialpaths);
}
else
{ console.log('done.'); }

var pathLengths = [];

var run = function() { Animate(); }
var startTime, deltaTime, totalTime, totalDuration, duration1, duration2, timer2;

SetLogo(2.5);


function SetLogo(time)
{
	for (i = 0; i < paths.length; i++)
	{
		if (paths[i].tagName == 'path')
		{
			pathLengths[i] = paths[i].getTotalLength();
			paths[i].setAttribute('stroke-dasharray', pathLengths[i]);
		}
		else
		{ pathLengths[i] = parseFloat(paths[i].getAttribute('stroke-dasharray')); }
		paths[i].style.strokeDashoffset = pathLengths[i];
		paths[i].setAttribute('display', 'inline');
	}
	
	setTimeout(function() { StartAnimation(time); }, 500);
}

function StartAnimation(time)
{
	startTime = new Date();
	timer2 = deltaTime = totalTime = 0;
	totalDuration = time;
	duration1 = (3/5) * totalDuration;
	duration2 = (2/5) * totalDuration;
	setTimeout(run, 0);
}

function Animate()
{
	deltaTime = (new Date() - startTime) / 1000;
	totalTime += deltaTime;
	
	if (totalTime <= duration1)
	{
		var amount = Ease.easeInCubic(totalTime / duration1);
		for (i = 2; i < paths.length; i++)
		{ paths[i].style.strokeDashoffset = pathLengths[i] + (amount * pathLengths[i]); }
	}
	else
	{
		for (i = 1; i < paths.length; i++)
		{ paths[i].style.strokeDashoffset = 0; }
		timer2 += deltaTime;
		var amount = Ease.easeOutCubic(timer2 / duration2);
		paths[1].style.strokeDashoffset = pathLengths[1] - (amount * pathLengths[1]);
	}
	amount = Ease.easeInOutCubic(totalTime / totalDuration);
	paths[0].style.strokeDashoffset = pathLengths[0] - (amount * pathLengths[0]);
	startTime = new Date();
	if (totalTime <= totalDuration)
	{ setTimeout(run, 0); }
	else
	{
		for (i = 0; i < paths.length; i++)
		{ paths[i].style.strokeDashoffset = 0; }
	}
}



// https://gist.github.com/gre/1650294
Ease = {
  // no easing, no acceleration
  linear: function (t) { return t },
  // accelerating from zero velocity
  easeInQuad: function (t) { return t*t },
  // decelerating to zero velocity
  easeOutQuad: function (t) { return t*(2-t) },
  // acceleration until halfway, then deceleration
  easeInOutQuad: function (t) { return t<.5 ? 2*t*t : -1+(4-2*t)*t },
  // accelerating from zero velocity 
  easeInCubic: function (t) { return t*t*t },
  // decelerating to zero velocity 
  easeOutCubic: function (t) { return (--t)*t*t+1 },
  // acceleration until halfway, then deceleration 
  easeInOutCubic: function (t) { return t<.5 ? 4*t*t*t : (t-1)*(2*t-2)*(2*t-2)+1 },
  // accelerating from zero velocity 
  easeInQuart: function (t) { return t*t*t*t },
  // decelerating to zero velocity 
  easeOutQuart: function (t) { return 1-(--t)*t*t*t },
  // acceleration until halfway, then deceleration
  easeInOutQuart: function (t) { return t<.5 ? 8*t*t*t*t : 1-8*(--t)*t*t*t },
  // accelerating from zero velocity
  easeInQuint: function (t) { return t*t*t*t*t },
  // decelerating to zero velocity
  easeOutQuint: function (t) { return 1+(--t)*t*t*t*t },
  // acceleration until halfway, then deceleration 
  easeInOutQuint: function (t) { return t<.5 ? 16*t*t*t*t*t : 1+16*(--t)*t*t*t*t }
}