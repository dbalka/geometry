
var canvas = document.getElementById('can');
var context = canvas.getContext('2d');

var w = get('w', 1300);
var w2 = w / 2;
canvas.width = w;
canvas.height = w;
var k = parseInt(get('k', 512));
var kk = parseInt(get('kk', 3500));
var n = parseFloat(get('n', 98.5));
var dn = parseFloat(get('dn', 0.02));
var dnn = dn;
var frame_delay = parseInt(get('fd', 30));

var opacity = get('op', 0.3);
var thickness = get('th', 0.4);

//redraw(canvas, context, w, w2, k, kk, n, opacity, thickness);

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

var pcx = [];
var pcy = [];

var prev_k = 0;
var frame = 0;
var fps = 0;

function recalc() {
  var da = (Math.PI * 2) / k;
  pcx = [];
  pcy = [];
  w = canvas.width;
  w2 = w / 2;
  cw = w - 50;
  cw2 = cw / 2;
  for (var i = 0; i < k; i++) {
    var xx = w2 + Math.sin(da * i) * cw2;
    var yy = w2 + Math.cos(da * i) * cw2;
    pcx.push(xx);
    pcy.push(yy);
  }
  prev_k = k;
}

function redraw(canvas, context, w, w2, k, kk, n, opacity, thickness) {
  // clear canvas
  context.clearRect(0, 0, canvas.width, canvas.height);

  if (k != prev_k) recalc();

  //frame++;

  context.lineWidth = thickness;
  /*
    var gradient = context.createLinearGradient(0, 0, cw, cw);
    gradient.addColorStop("0", "#0000ff");//magenta");
    gradient.addColorStop("0.4", "#000000");//magenta");
    gradient.addColorStop("0.5", "#afafaf");//blue");
    gradient.addColorStop("0.6", "#000000");//green");
    gradient.addColorStop("1.0", "#0000ff");//green");
    gradient.opacity = 0.2;//opacity;
  */

  context.strokeStyle = 'rgba(10,30,255,' + opacity + ')';
  //context.strokeStyle = gradient;

  context.globalAlpha = 1;
  context.ed

  for (var j = 0; j < kk; j++) {
    var j1 = j % k;
    var j2 = parseInt((j * n) % k);// + 0.5);

    context.beginPath();
    context.moveTo(pcx[j1], pcy[j1]);
    context.lineTo(pcx[j2], pcy[j2]);
    context.stroke();

    //if (j < 10) {
    //context.fillText(j1 + ' ' + j2, 20, 80 + j * 20);
    //}
  }

  if (info_show) {
    var Title = 'w = ' + w + ' cw = ' + cw + ' k = ' + k + ' kk = ' + kk +
      ' op = ' + opacity + ' th = ' + thickness;
    context.fillText(Title, 20, 15);
    //var numst = 'n = '+n;
    var x = Math.round(n * 1000) / 1000;
    context.fillText("dn = " + dn + " n = " + x, 20, 30);
    context.fillText("fps = " + fps + " one_sec = " + one_sec, 20, 50);
    context.fillText("frame = " + frame + " prev_frame = " + prev_frame, 20, 65);
    context.fillText("fd = " + frame_delay + " real_delay = " + animate_delay, 20, 80);
    if (keycode.length > 0) context.fillText("keycode = " + keycode, 20, 100);
  }

  if (help_show) {
    var hx = cw - 200;
    var hy = 15;
    var dy = 15;
    help.forEach(element => {
      context.fillText(element, hx, hy);
      hy += dy;
    });
  }
  //var dataURL = canvas.toDataURL();
  //document.getElementById('canImg').src = dataURL;
}

var keycode = '';

window.addEventListener('keydown', e => {
  var coeff = e.shiftKey ? deltaSmallCoeff : 1;
  keycode = e.key;
  switch (keycode) {
    case 'BracketRight':
      n += delta * coeff;
      break;
    case 'BracketLeft':
      n -= delta * coeff;
      break;
    case 'ArrowLeft':
      dn = -dn;
      break;
    case 'ArrowRight':
      dn = -dn;
      break;
    case 'ArrowUp':
      dn *= 2;
      break;
    case 'ArrowDown':
      if (Math.abs(dn) > 0.00125) dn /= 2;
      break;
    case 'Clear':
      if (dn == 0) { dn = dnn; dnn = 0; }
      else { dnn = dn; dn = 0; }
      break;
    case 'a': if (k > 10) k -= 10; break;
    case 's': if (k < 2000) k += 10; break;
    case 'q': if (kk > 10) kk -= 10; break;
    case 'w': if (kk < 10000) kk += 10; break;
    case 'z': if (opacity > 0.1) opacity -= 0.1; break;
    case 'x': if (opacity < 1) opacity += 0.1; break;
    case 'c': if (thickness > 0.1) thickness -= 0.1; break;
    case 'v': if (thickness < 1) thickness += 0.1; break;
    case 'e': if (dn > 0.0001) dn -= 0.0001; break;
    case 'r': if (dn < 10) dn += 0.0001; break;
    case 'd': if (frame_delay > 20) frame_delay -= 1; break;
    case 'f': if (frame_delay < 250) frame_delay += 1; break;
    case '+': canvas.width += 10; canvas.height += 10; recalc(); break;
    case '-': if (canvas.width > 100) canvas.width -= 10; canvas.height -= 10; recalc(); break;
    case 'h': help_show = !help_show; break;
    case 'g': info_show = !info_show; break;
    default:
      return;
  }

  //console.log(n);
  //redraw(canvas, context, w, w2, k, kk, n, opacity, thickness);
});

var help = [
  'keyboard shortcuts:',
  '[a/s] - k - number of sectors',
  '[q/w] - kk - number of lines',
  '[z/x] - op - line opacity',
  '[c/v] - th - line thickness',
  '[e/r] - dn - delta n+=dn',
  '[d/f] - fd - frame delay msec',
  '[-/+] - w - canvas width size',
  '[g] - graph info msg on/off',
  '[h] - this help msg on/off'
];
var help_show = true;
var info_show = true;

var interval = 20;
var deltasPerSec = {
  n: dn,
};
var signs = {
  n: 1,
};

var animate_delay = 0;

function startAuto() {
  var lastStamp = Date.now();

  function animate() {

    var nowStamp = Date.now();

    //Object.entries(deltasPerSec).forEach(entrie => {
    animate_delay = nowStamp - lastStamp;
    //var delta = (entrie[1] * (animate_delay)) / 1000;
    var delta = (dn * (animate_delay)) / 1000;
    n += delta;
    //window[entrie[0]] = parseFloat(window[entrie[0]]) + delta;
    //});

    lastStamp = nowStamp;
    frame++;
    setTimeout(animate, frame_delay);
  }

  //setInterval(animate, interval);
  //setTimeout(animate, 60);
  animate();
}

var counter = 0;

function nextFrame() {
  requestAnimationFrame(nextFrame);
  //if (counter % 2 == 0)
  redraw(canvas, context, w, w2, k, kk, n, opacity, thickness);
}

var prev_frame = 0;
var time = Date.now();
var one_sec = 0;

function oneSecTimer() {
  var time_now = Date.now();
  one_sec = time_now - time;
  time = time_now;
  fps = frame - prev_frame;
  prev_frame = frame;
}

setInterval(oneSecTimer, 1000);

nextFrame();
startAuto();
