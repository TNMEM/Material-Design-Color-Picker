// this line waits untill document and all other files load...
$(window).load(function() {
    // this line waits untill document loads but doesn't care about other files...
    //$(function() {
    // this doesn't wait at all...
    //(function() {

    // Needed for Raphael...
    Raphael(function() {
        // get the elements...
        var initialColor = "#f44336";
        var currentFamilyMdColor = "Red";
        var out = document.getElementById("output"),
            vr = document.getElementById("vr"),
            vg = document.getElementById("vg"),
            vb = document.getElementById("vb"),
            vh = document.getElementById("vh"),
            vh2 = document.getElementById("vh2"),
            vs = document.getElementById("vs"),
            vs2 = document.getElementById("vs2"),
            vv = document.getElementById("vv"),
            vl = document.getElementById("vl"),
            mdc = document.getElementById("mdColorsChk"),
            mdm = document.getElementById("mdMainChk"),
            mh = document.getElementById("mainhed"),
            clr = Raphael.color(initialColor);

        // set initial values...
        vr.innerHTML = clr.r;
        vg.innerHTML = clr.g;
        vb.innerHTML = clr.b;
        vh.innerHTML = vh2.innerHTML = Math.round(clr.h * 360) + "°";
        vs.innerHTML = vs2.innerHTML = Math.round(clr.s * 100) + "%";
        vv.innerHTML = Math.round(clr.v * 100) + "%";
        vl.innerHTML = Math.round(clr.l * 100) + "%";
        mh.innerHTML = "Picker Not Locked to Material Colors";

        // get the json file with the material design mdColors
        // ... this is a javascript object ...
        var mdColors;
        (function() {
            var gc = $.ajax({
                type: 'GET',
                url: "md-colors.json",
                dataType: 'json'
            });
            gc.fail(function(xhr, type) {
                console.log('gc.fail:');
                console.log(xhr, type);
            });
            gc.done(function(response) {
                console.log('gc.done:');
                console.log(response);
                // get colors ready...
                mdColors = response;
                justMdMainColors();
                colorKeys(initialColor);
                // get picker ready ...
                $("#output").spectrum({
                    color: initialColor,
                    showInput: true,
                    preferredFormat: "hex",
                    change: function(c) {
                        onchange(c);
                    },
                    move: function(c) {
                        onchange(c);
                    },
                });
            });
        })();

        // get the mdMainColors
        // ... this is a simple javascript array...
        var mdMainColors = [];

        function justMdMainColors() {
            var key, obj, tint;
            for (key in mdColors.md) {
                if (mdColors.md.hasOwnProperty(key)) {
                    obj = mdColors.md[key];
                    for (tint in obj) {
                        if (obj.hasOwnProperty(tint)) {
                            if (tint.substr(0, 4) == "P500") {
                                mdMainColors.push([obj[tint], key + " (" + tint + ") materializecss: " + key.toLowerCase() + " " + mdColors.ize[tint]]);
                            }
                        }
                    }
                }
            }
        }

        // get all the items in a family like "Red"...
        function justFamilyMdColors(colorName) {
            var key, obj, tint;
            var a = [];
            for (key in mdColors.md) {
                if (mdColors.md.hasOwnProperty(key)) {
                    obj = mdColors.md[key];
                    for (tint in obj) {
                        if (obj.hasOwnProperty(tint)) {
                            if (key == colorName) {
                                a.push([obj[tint], key + " (" + tint + ") materializecss: " + key.toLowerCase() + " " + mdColors.ize[tint]]);
                            }
                        }
                    }
                }
            }
            return a;
        }

        // expects an an array of [tinycolor, "description"]
        // return new array of near-match Md colors...
        function matchMd(c) {
            var x = jQuery.map(c, function(n, i) {
                var y = [calcColor(tinycolor(n[0]).toRgb())];
                return y;
            });
            return x;
        }

        // color keys ... some from tinycolor...
        function colorKeys(baseColor) {
            $("div.cTable").empty();

            $("div.cTable").append(
                "<h5>Click any color key below to change the base used in combinations.</h5>"
            );

            $("div.cTable").append("<h6><em>Google Material Design main '500' colors (click on to set family)</em></h6>");
            cTable("MD", baseColor, "mdarray", mdMainColors);
            $("div.cTable").append("<h6><em>Currently Selected MD Family</em></h6>");
            cTable("MD " + currentFamilyMdColor, baseColor, "mdarray", justFamilyMdColors(currentFamilyMdColor));

            $("div.cTable").append("<h6><em>Standard combinations</em></h6>");
            cTable("Complement", baseColor, "complement");
            cTable("Complement ryb", baseColor, "complementryb");
            cTable("Split Complement", baseColor, "splitcomplement");
            cTable("Split Complement ryb", baseColor, "splitcomplementryb");
            cTable("Triad", baseColor, "triad");
            cTable("Triad ryb", baseColor, "triadryb");
            cTable("Tetrad", baseColor, "tetrad");
            cTable("Tetrad ryb", baseColor, "tetradryb");
            cTable("Monochromatic", baseColor, "monochromatic");
            cTable("Analogous", baseColor, "analogous");
        }

        // do the cTable fills ... arrays expected [rgb, description] ...
        function cTable(title, baseColor, action, cArray) {
            var tiny = tinycolor(baseColor);
            var aList;
            var rowLimit = 10;
            var x;
            switch (action) {
                case ("triadryb"):
                    aList = rybcolor.rybtriad(tiny);
                    aList = aList.map(function(rgb) {
                        return [rgb, ""];
                        //return [ rgb, tinycolor.hexNames[ rgb.toHex()] ];
                    });
                    // convert array to md colors and send it to mdarray handler...
                    cTable(title + " MD", baseColor, "mdarray", matchMd(aList));
                    break;
                case ("triad"):
                    aList = tiny.triad();
                    aList = aList.map(function(rgb) {
                        return [rgb, ""];
                        //return [ rgb, tinycolor.hexNames[ rgb.toHex()] ];
                    });
                    // convert array to md colors and send it to mdarray handler...
                    cTable(title + " MD", baseColor, "mdarray", matchMd(aList));
                    break;
                case ("tetradryb"):
                    aList = rybcolor.rybtetrad(tiny);
                    aList = aList.map(function(rgb) {
                        return [rgb, ""];
                        //return [ rgb, tinycolor.hexNames[ rgb.toHex()] ];
                    });
                    // convert array to md colors and send it to mdarray handler...
                    cTable(title + " MD", baseColor, "mdarray", matchMd(aList));
                    break;
                case ("tetrad"):
                    aList = tiny.tetrad();
                    aList = aList.map(function(rgb) {
                        return [rgb, ""];
                        //return [ rgb, tinycolor.hexNames[ rgb.toHex()] ];
                    });
                    // convert array to md colors and send it to mdarray handler...
                    cTable(title + " MD", baseColor, "mdarray", matchMd(aList));
                    break;
                case ("monochromatic"):
                    aList = tiny.monochromatic();
                    aList = aList.map(function(rgb) {
                        return [rgb, ""];
                        //return [ rgb, tinycolor.hexNames[ rgb.toHex()] ];
                    });
                    // convert array to md colors and send it to mdarray handler...
                    cTable(title + " MD", baseColor, "mdarray", matchMd(aList));
                    break;
                case ("analogous"):
                    aList = tiny.analogous();
                    aList = aList.map(function(rgb) {
                        return [rgb, ""];
                        //return [ rgb, tinycolor.hexNames[ rgb.toHex()] ];
                    });
                    // convert array to md colors and send it to mdarray handler...
                    cTable(title + " MD", baseColor, "mdarray", matchMd(aList));
                    break;
                case ("complementryb"):
                    aList = [];
                    aList.push(tiny);
                    // tiny.complement only returns one color ... not array...
                    aList.push(rybcolor.rybcomplement(tiny));
                    aList = aList.map(function(rgb) {
                        return [rgb, ""];
                        //return [ rgb, tinycolor.hexNames[ rgb.toHex()] ];
                    });
                    x = matchMd(aList);
                    $("#pBack").css("background-color", x[1][0]);
                    $("#pBack").attr("title", x[1][1] + " (" + x[1][0] + ")");
                    $("#pBack").css("color", findReadable(x[1][0]));

                    cTable(title + " MD", baseColor, "mdarray", x);
                    break;
                case ("complement"):
                    aList = [];
                    aList.push(tiny);
                    // tiny.complement only returns one color ... not array...
                    aList.push(tiny.complement());
                    aList = aList.map(function(rgb) {
                        return [rgb, ""];
                        //return [ rgb, tinycolor.hexNames[ rgb.toHex()] ];
                    });
                    // convert array to md colors and send it to mdarray handler...
                    x = matchMd(aList);
                    $("#navcolor").css("background-color", x[0][0]);
                    $("#navcolor").attr("title", x[0][1] + " (" + x[0][0] + ")");
                    $("#logo-container").css("color", findReadable(x[0][0]));

                    $("#helpnav").empty();
                    $("#helpnav").append("<li>Top Nav: " + x[0][1] + " (" + x[0][0] + ")</li>");
                    $("#helpside").empty();
                    $("#helpside").append("<li>Top Nav: " + x[0][1] + " (" + x[0][0] + ")</li>");

                    $("#footcolor").css("background-color", x[1][0]);
                    $("#footcolor").attr("title", x[1][1] + " (" + x[1][0] + ")");
                    $(".fText").css("color", findReadable(x[1][0]));

                    //$("#pBack").css("background-color", x[1][0]);
                    //$("#pBack").attr("title", x[1][1] + " (" + x[1][0] + ")");
                    //$("#pBack").css("color", findReadable( x[1][0] ));

                    $("#diags").css("background", "linear-gradient(0deg, " + x[1][0] + " 50%, " + x[0][0] + " 50%");

                    $("#helpnav").append("<li>Footer: " + x[1][1] + " (" + x[1][0] + ")</li>");
                    $("#helpside").append("<li>Footer: " + x[1][1] + " (" + x[1][0] + ")</li>");

                    cTable(title + " MD", baseColor, "mdarray", x);
                    break;
                case ("splitcomplementryb"):
                    aList = rybcolor.rybsplitcomplement(tiny);
                    aList = aList.map(function(rgb) {
                        return [rgb, ""];
                        //return [ rgb, tinycolor.hexNames[ rgb.toHex()] ];
                    });
                    // convert array to md colors and send it to mdarray handler...
                    cTable(title + " MD", baseColor, "mdarray", matchMd(aList));
                    break;
                case ("splitcomplement"):
                    aList = tiny.splitcomplement();
                    aList = aList.map(function(rgb) {
                        return [rgb, ""];
                        //return [ rgb, tinycolor.hexNames[ rgb.toHex()] ];
                    });
                    // convert array to md colors and send it to mdarray handler...
                    cTable(title + " MD", baseColor, "mdarray", matchMd(aList));
                    break;
                case ("mdarray"):
                    // recursion to correct-length rows...
                    if (cArray.length > rowLimit) {
                        // tmpList receives remaining items over sets of rowLimit..
                        var r = (cArray.length % rowLimit);
                        r = r == 0 ? rowLimit : r;
                        var tmpList = cArray.slice(cArray.length - r);
                        // tempList2 receives elements before those removed above rowLimit...
                        var tmpList2 = cArray.slice(0, cArray.length - r);
                        cTable(title, baseColor, "mdarray", tmpList2);
                        aList = jQuery.map(tmpList, function(n, i) {
                            return [
                                [tinycolor(n[0]), n[1]]
                            ];
                        });
                        //aList = tmpList.map(tinycolor);
                    }
                    else {
                        aList = jQuery.map(cArray, function(n, i) {
                            return [
                                [tinycolor(n[0]), n[1]]
                            ];
                        });
                        //aList = cArray.map(tinycolor);
                    }
                    break;
                default:
                    break;
            }
            var i, s;
            s = "<table><thead></thead><tbody><tr><td>" + title + "</td>";
            for (i = 0; i < aList.length; i++) {
                x = findReadable(aList[i][0].toHexString());
                s += "<td title=\"" + aList[i][1] + "\" bgcolor=" + aList[i][0].toHexString() + " style=\"color:" + x + ";\" data-rgb=\"" + aList[i][0].toHexString() + "\">" + x + "</td>";
            }
            s += "</tr><tr><td></td>";
            for (i = 0; i < aList.length; i++) {
                s += "<td>" + aList[i][0].toHexString() + "</td>";
            }
            s += "</tr></tbody></table>";
            $("div.cTable").append(s);
        }

        // find a readable text color...
        function findReadable(clr) {
            return tinycolor.mostReadable(
                clr, ["#fafafa", "#f5f5f5", "#eeeeee", "#e0e0e0", "#bdbdbd", "#9e9e9e", "#757575", "#616161", "#424242", "#212121"], {
                    includeFallbackColors: true
                }).toHexString();
        }

        // handle enter key event on output...
        // not used, but keep for pattern.
        out.onkeypress = function(event) {
            // trigger on enter key...
            var x = event.which || event.keyCode;
            if (x == 13) {

            }
        };

        // handle picker change events...
        function onchange(c) {
            c = checkCalcColor(c.toHexString());
            $("#output").spectrum("set", tinycolor(c));
            setDials(c);
        }

        // handle click event on history / cHistory li elements...
        $('#cHistory > ul').on('click', '> li', function(e) {
            // update the picker with the new clicked color...
            var x = Raphael.color($(this).css("background-color")).hex;
            //console.log("x: ", x);
            $("#output").spectrum("set", tinycolor(x));
            setDials(x);
        });

        // handle click event on color keys / cTable elements "TD" elevents...
        $('.cTable').on('click', 'td', function(e) {
            var aTitle, aBgcolor, aColor;
            // if "title" has a space, then it's Md color needing Family key...
            var x = $(this).attr("title");
            if (x.length > 0) {
                currentFamilyMdColor = x.split(" ")[0];
            }
            // set the history of clicked...
            aTitle = $(this).attr("title");
            aColor = $(this).css("color");
            aBgcolor = $(this).attr("bgcolor");
            $("#cHistory ul").prepend("<li style=\"background-color:" + aBgcolor + "; color:" + aColor + "\">Text: " + tinycolor(aColor).toHexString() + ": Background: " + aBgcolor + " " + aTitle + "</li>");
            // update the picker with the new clicked color...
            $("#output").spectrum("set", tinycolor(aBgcolor));
            setDials(aBgcolor);
        });

        // filter the check boxes to see how to handle color and settings...
        function checkCalcColor(clr) {
            if (mdc.checked == true) {
                // returns array of [rgbString, mdColorName, mdTinkNumber]...
                var tmp = calcColor(clr);
                clr = tmp[0];
                mh.innerHTML = tmp[1];
            }
            else {
                mh.innerHTML = "Picker Not Locked to Material Colors";
            }
            return clr;
        }

        // calculate closest color based on material color design: just primaries or all...
        function calcColor(clr) {
            clr = Raphael.color(clr);
            var diff = Number.MAX_VALUE;
            var tDiff, closest, obj, key, tint, anRGB;
            for (key in mdColors.md) {
                if (mdColors.md.hasOwnProperty(key)) {
                    obj = mdColors.md[key];
                    for (tint in obj) {
                        if (obj.hasOwnProperty(tint)) {
                            // need to fix this ... always searches all mdColors...
                            if (mdm.checked == true && tint.substr(0, 4) == "P500") {
                                anRGB = Raphael.getRGB(obj[tint]);
                            }
                            else if (mdm.checked == false /*&& tint.substr(0, 1) == "A" */ ) {
                                anRGB = Raphael.getRGB(obj[tint]);
                            }
                            else {
                                continue;
                            }
                            // unweighted rgb...
                            //tDiff = Math.sqrt(Math.pow(((clr.r - anRGB["r"])), 2) + Math.pow(((clr.g - anRGB["g"])), 2) + Math.pow(((clr.b - anRGB["b"])), 2));
                            // weighted rgb...
                            //tDiff = Math.sqrt(Math.pow(((clr.r - anRGB["r"])), 2) * 3 + Math.pow(((clr.g - anRGB["g"])), 2) * 4 + Math.pow(((clr.b - anRGB["b"])), 2) * 2);
                            // special calc...
                            tDiff = colorDistance(clr, anRGB);
                            if (tDiff < diff) {
                                diff = tDiff;
                                closest = [anRGB["r"], anRGB["g"], anRGB["b"], key, tint];
                            }
                        }
                    }
                }
            }
            // rgb, keyColor, tinkColor, izeLabel...
            //return ([Raphael.rgb(closest[0], closest[1], closest[2]), closest[3], closest[4], mdColors.ize[closest[4]]]);
            return ([Raphael.rgb(closest[0], closest[1], closest[2]), closest[3] + " (" + closest[4] + ") materializecss: " + closest[3].toLowerCase() + " " + mdColors.ize[closest[4]]]);
        }

        // http://www.compuphase.com/cmetric.htm
        // ... very mathy and follows human perception...
        function colorDistance(e1, e2) {
            e1 = tinycolor(e1).toRgb();
            e2 = tinycolor(e2).toRgb();
            var rmean = (e1.r + e2.r) / 2;
            var r = e1.r - e2.r;
            var g = e1.g - e2.g;
            var b = e1.b - e2.b;

            return Math.sqrt((((512 + rmean) * r * r) / 256) + 4 * g * g + (((767 - rmean) * b * b) / 256));
        }

        // twist the little readouts...
        function setDials(clr) {

            colorKeys(clr);

            clr = Raphael.color(clr);
            vr.innerHTML = clr.r;
            vg.innerHTML = clr.g;
            vb.innerHTML = clr.b;
            vh.innerHTML = vh2.innerHTML = Math.round(clr.h * 360) + "°";
            vs.innerHTML = vs2.innerHTML = Math.round(clr.s * 100) + "%";
            vv.innerHTML = Math.round(clr.v * 100) + "%";
            vl.innerHTML = Math.round(clr.l * 100) + "%";
        }
    });

    // end of the wait for window code at top...
});