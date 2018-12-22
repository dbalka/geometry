
var canvas = document.getElementById('can');
var context = canvas.getContext('2d');

var w = get('w', 1000);
canvas.width = w;
canvas.height = w;
var w2 = w / 2;
var k = get('k', 200);
var kk = get('kk', 1200);
var n = get('num', 1.5);
var dn = get('dn', 0.001);

var opacity = get('op', 0.4);
var thickness = get('th', 0.3);

redraw(canvas, context, w, w2, k, kk, n, opacity, thickness);

var delta = 1;
var deltaSmallCoeff = dn;

function getUrlVars() {
  var vars = {};
  var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (
    m,
    key,
    value,
  ) {
    vars[key] = value;
  });
  return vars;
}

function get(parameter, defaultvalue) {
  var urlparameter = defaultvalue;
  if (window.location.href.indexOf(parameter + "=") > -1) {
    urlparameter = getUrlVars()[parameter];
  }
  return urlparameter;
}

function px(j) {
  var da = (Math.PI * 2) / k;
  var xx = w2 + Math.sin(da * j) * w2;
  return xx;
}
function py(j) {
  var da = (Math.PI * 2) / k;
  var yy = w2 + Math.cos(da * j) * w2;
  return yy;
}

var pcx = [];
var pcy = [];

var prev_k = 0;
var frame = 0;
var fps = 0;

function redraw(canvas, context, w, w2, k, kk, n, opacity, thickness) {
  // clear canvas
  context.clearRect(0, 0, canvas.width, canvas.height);

  //if (k != prev_k) 
  {
    var da = (Math.PI * 2) / k;
    pcx = [];
    pcy = [];
    for (var i = 0; i < k; i++) {
      var xx = w / 2 + Math.sin(da * i) * w2;
      var yy = w / 2 + Math.cos(da * i) * w2;
      pcx.push(xx);
      pcy.push(yy);
    }
    prev_k = k;
  }

  frame++;

  context.lineWidth = thickness;
  context.strokeStyle = 'rgba(0,0,200,' + opacity + ')';

  context.globalAlpha = 1;

  for (var j = 0; j < kk; j++) {
    var j1 = j % k;
    var j2 = parseInt((j * n) % k);

    context.beginPath();
    context.moveTo(pcx[j1], pcy[j1]);
    context.lineTo(pcx[j2], pcy[j2]);
    context.stroke();

    //if (j < 10) {
    //context.fillText(j1 + ' ' + j2, 20, 80 + j * 20);
    //}
  }

  var Title = 'w = ' + w + ' w2 = ' + w2 + ' k = ' + k + ' kk = ' + kk +
    ' op = ' + opacity + ' th = ' + thickness;

  context.fillText(Title, 20, 15);
  //var numst = 'n = '+n;
  var x = Math.round(n * 1000) / 1000;
  context.fillText("n = " + x, 20, 30);
  context.fillText("fps = " + fps, 20, 50);
  //context.fillText("keycode = " + keycode, 20, 45);
  var dataURL = canvas.toDataURL();
  document.getElementById('canImg').src = dataURL;
}

//var keycode = 0;

window.addEventListener('keypress', e => {
  var coeff = e.shiftKey ? deltaSmallCoeff : 1;
  //var keycode = e.code;
  switch (e.code) {
    case 'BracketRight':
      n += delta * coeff;
      break;
    case 'BracketLeft':
      n -= delta * coeff;
      break;
    default:
      return;
  }

  console.log(n);
  redraw(canvas, context, w, w2, k, kk, n, opacity, thickness);
});

var interval = 16;
var deltasPerSec = {
  n: dn,
};
var signs = {
  n: 1,
};

function startAuto() {
  var lastStamp = Date.now();

  function animate() {

    var nowStamp = Date.now();

    Object.entries(deltasPerSec).forEach(entrie => {
      var delta = (entrie[1] * (nowStamp - lastStamp)) / 1000;
      window[entrie[0]] = parseFloat(window[entrie[0]]) + delta;
    });

    lastStamp = nowStamp;
  }

  setInterval(animate, interval);
}

var counter = 0;

function nextFrame() {
  requestAnimationFrame(nextFrame);
  if (counter % 2 == 0)
    redraw(canvas, context, w, w2, k, kk, n, opacity, thickness);
}

var prev_frame = 0;
function oneSecTimer() {
  fps = frame - prev_frame;
  prev_frame = frame;
}
setInterval(oneSecTimer, 1000);

nextFrame();
startAuto();
