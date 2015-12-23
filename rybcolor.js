// namespace rybcolor defined in closure... "Immediately-invoked function expression" or IIFE relates data back to function args.
// this is a stab at a javascript module...

//  does NOT wait for anything, so don't do anything that relies on outside code.
(function($, undefined) {
// waits for document load, but needs jQuery.
//$(function($, undefined) {
// waits for document and all other files, but needs jQuery.
//$(window).load(function($, undefined) {

  // private function to handle adobe translations ... https://github.com/benknight/kuler-d3
  // general slope y intercept form...
  var mapRange = function(x, x1, x2, y1, y2) {
    var aSlope = ((y2 - y1) / (x2 - x1));
    var aSlopeIntercept = y1 - (aSlope * x1);
    return (x * aSlope + aSlopeIntercept);
  };

  // These two  private functions are ripped straight from Adobe Kuler source ... https://github.com/benknight/kuler-d3
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

  // here are the public functions...

  this.rybcomplement = function(rgb) {
    var hsl = tinycolor(rgb).toHsl();
    hsl.h = ryb2rgb(((rgb2ryb(hsl.h) % 360) + 180) % 360) % 360;
    return tinycolor(hsl);
  };

  this.rybtriad = function(rgb) {
    var hsl = tinycolor(rgb).toHsl();
    hsl.h = rgb2ryb(hsl.h) % 360;
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
  };

  this.rybtetrad = function(color) {
    var hsl = tinycolor(color).toHsl();
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
  };

  this.rybsplitcomplement = function(color) {
    var hsl = tinycolor(color).toHsl();
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
  };

}.call(window.rybcolor = window.rybcolor || {}, jQuery));