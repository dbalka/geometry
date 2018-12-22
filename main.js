function getUrlVars() {
  var vars = {};
  var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(
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
  if (window.location.href.indexOf(parameter) > -1) {
    urlparameter = getUrlVars()[parameter];
  }
  return urlparameter;
}

function redraw(canvas, context, w, w2, k, kk, n, opacity, thickness) {
  // clear canvas
  context.clearRect(0, 0, canvas.width, canvas.height);

  var pcx = [];
  var pcy = [];

  var da = (Math.PI * 2) / k;

  for (var i = 0; i < k; i++) {
    var xx = w / 2 + Math.sin(da * i) * w2;
    var yy = w / 2 + Math.cos(da * i) * w2;
    pcx.push(xx);
    pcy.push(yy);
  }

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

    if (j < 10) {
      context.fillText(j1 + ' ' + j2, 20, 80 + j * 20);
    }
  }

  var Title =
    'num = ' +
    n +
    ' w = ' +
    w +
    ' w2 = ' +
    w2 +
    ' k = ' +
    k +
    ' kk = ' +
    kk +
    ' op = ' +
    opacity +
    ' th = ' +
    thickness;

  context.fillText(Title, 20, 50);

  var dataURL = canvas.toDataURL();
  document.getElementById('canvasImg').src = dataURL;
}

var canvas = document.getElementById('myCanvas');
var context = canvas.getContext('2d');

var w = get('w', 1000);
var w2 = w / 2;
var k = get('k', 300);
var kk = get('kk', 2600);
var n = get('num', 72.1);

var opacity = get('op', 0.4);
var thickness = get('th', 0.5);

redraw(canvas, context, w, w2, k, kk, n, opacity, thickness);

var delta = 1;
var deltaSmallCoeff = 0.01;
window.addEventListener('keypress', e => {
  var coeff = e.shiftKey ? deltaSmallCoeff : 1;
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
  n: 0.001,
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

nextFrame();
startAuto();
