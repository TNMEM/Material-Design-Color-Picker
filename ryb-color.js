// utility function to handle adobe translations.
// general slope y intercept form...
var mapRange = function(x, x1, x2, y1, y2) {
  var aSlope = ((y2 - y1) / (x2 - x1));
  var aSlopeIntercept = y1 - (aSlope * x1);
  return ( x * aSlope + aSlopeIntercept);
};

// These two functions are ripped straight from Adobe Kuler source.
// They convert between scientific hue to the color wheel's "artistic" hue.

var ryb2rgb = function(hue) {
  return (
    hue < 60 ? mapRange(hue, 0, 60, 0, 35) :
    hue < 122 ? mapRange(hue, 60, 122, 35, 60) :
    hue < 165 ? mapRange(hue, 122, 165, 60, 120) :
    hue < 218 ? mapRange(hue, 165, 218, 120, 180) :
    hue < 275 ? mapRange(hue, 218, 275, 180, 240) :
    hue < 330 ? mapRange(hue, 275, 330, 240, 300) :
    mapRange(hue, 330, 360, 300, 360));
};

var rgb2ryb = function(hue) {
  return (
    hue < 35 ? mapRange(hue, 0, 35, 0, 60) :
    hue < 60 ? mapRange(hue, 35, 60, 60, 122) :
    hue < 120 ? mapRange(hue, 60, 120, 122, 165) :
    hue < 180 ? mapRange(hue, 120, 180, 165, 218) :
    hue < 240 ? mapRange(hue, 180, 240, 218, 275) :
    hue < 300 ? mapRange(hue, 240, 300, 275, 330) :
    mapRange(hue, 300, 360, 330, 360));
};

var rybcomplement = function(rgb) {
  var hsl = tinycolor(rgb).toHsl();
  hsl.h = ryb2rgb(((rgb2ryb(hsl.h) % 360) + 180) % 360) % 360;
  return tinycolor(hsl);
}

function rybtriad(rgb) {
  var hsl = tinycolor(rgb).toHsl();
  var h = hsl.h;
  h = rgb2ryb(h) % 360;
  return [
    tinycolor(rgb),
    tinycolor({
      h: ryb2rgb(((rgb2ryb(hsl.h) % 360) + 120) % 360) % 360,
      s: hsl.s,
      l: hsl.l
    }),
    tinycolor({
      h: ryb2rgb(((rgb2ryb(hsl.h) % 360) + 240) % 360) % 360,
      s: hsl.s,
      l: hsl.l
    })
  ];
}

function rybtetrad(color) {
  var hsl = tinycolor(color).toHsl();
  var h = hsl.h;
  return [
    tinycolor(color),
    tinycolor({
      h: ryb2rgb(((rgb2ryb(hsl.h) % 360) + 90) % 360) % 360,
      s: hsl.s,
      l: hsl.l
    }),
    tinycolor({
      h: ryb2rgb(((rgb2ryb(hsl.h) % 360) + 190) % 360) % 360,
      s: hsl.s,
      l: hsl.l
    }),
    tinycolor({
      h: ryb2rgb(((rgb2ryb(hsl.h) % 360) + 270) % 360) % 360,
      s: hsl.s,
      l: hsl.l
    })
  ];
}

function rybsplitcomplement(color) {
  var hsl = tinycolor(color).toHsl();
  var h = hsl.h;
  return [
    tinycolor(color),
    tinycolor({
      h: ryb2rgb(((rgb2ryb(hsl.h) % 360) + 72) % 360) % 360,
      s: hsl.s,
      l: hsl.l
    }),
    tinycolor({
      h: ryb2rgb(((rgb2ryb(hsl.h) % 360) + 216) % 360) % 360,
      s: hsl.s,
      l: hsl.l
    })
  ];
}
