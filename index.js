// Internet Explorer Note:
// ... Don't use anything but #ffffff style background-color tags.


// this line waits untill document and all other files load...
$(window).load(function() {
    // this line waits untill document loads but doesn't care about other files...
    //$(function()
    // this doesn't wait at all...
    //(function()

    // get the elements...
    var initialColor = "#f44336";
    var currentFamilyMdColor = "Red";
    var histNum = 0;
    var vr = document.getElementById("vr"),
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
        mh = document.getElementById("mainhed");
    mh.innerHTML = "Picker Unlocked";

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
            //console.log('gc.done:');
            //console.log(response);
            // get colors ready...
            mdColors = response;
            justMdMainColors();
            setDials(initialColor);
            // get picker ready ...
            $("#output").spectrum({
                color: initialColor,
                flat: true,
                showButtons: false,
                showInput: true,
                preferredFormat: "hex",
                change: function(c) {
                    onchange(c);
                },
                move: function(c) {
                    onchange(c);
                },
            });
            // the 2nd cell of the 1st table in .cTable is initial color...
            $(".cTable td:eq(1)").trigger("click");
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
        //console.log("c: ", c);
        var x = jQuery.map(c, function(n, i) {
            var y = [calcColor(tinycolor(n[0]).toHexString())];
            return y;
        });
        //console.log("x: ", x);
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
                $("#pBack").css("background-color", x[1][0].toHexString());
                $("#pBack").attr("title", x[1][1] + " (" + x[1][0] + ")");
                $("#pBack").css("color", findReadable(x[1][0]));

                var c1 = findReadable(x[0][0]); // text color main
                var c2 = x[0][0]; // main color
                var c3 = x[1][0]; // complement color
                $("#patt2").css({
                    "background": "radial-gradient(circle at 50% 59%,  " + c1 + "  3%,  " + c2 + "  4%,  " + c2 + "  11%, rgba(54,78,39,0) 12%, rgba(54,78,39,0)) 25px 0,"
                        + "radial-gradient(circle at 50% 41%,  " + c2 + "  3%,  " + c1 + "  4%,  " + c1 + "  11%, rgba(210,202,171,0) 12%, rgba(210,202,171,0)) 25px 0,"
                        + "radial-gradient(circle at 50% 59%,  " + c1 + "  3%,  " + c2 + "  4%,  " + c2 + "  11%, rgba(54,78,39,0) 12%, rgba(54,78,39,0)) 0 25px,"
                        + "radial-gradient(circle at 50% 41%,  " + c2 + "  3%,  " + c1 + "  4%,  " + c1 + "  11%, rgba(210,202,171,0) 12%, rgba(210,202,171,0)) 0 25px,"
                        + "radial-gradient(circle at 100% 50%,  " + c1 + "  16%, rgba(210,202,171,0) 17%),"
                        + "radial-gradient(circle at 0% 50%,  " + c2 + "  16%, rgba(54,78,39,0) 17%),"
                        + "radial-gradient(circle at 100% 50%,  " + c1 + "  16%, rgba(210,202,171,0) 17%) 25px 25px,"
                        + "radial-gradient(circle at 0% 50%,  " + c2 + "  16%, rgba(54,78,39,0) 17%) 25px 25px",
                    "background-color": c3.toHexString(),
                    "background-size": "50px 50px",
                    "text-align": "right",
                    "height": "50px",
                    "width": "100%"
                });
                $("#patt2 span").css({
                    "background-color": c3.toHexString(),
                    "color": findReadable(c3), // text color complement
                });
                
                cTable(title + " MD", baseColor, "mdarray", x);
                break;
            case ("complement"):
                // tinycolor complement only returns 2nd color not an array...
                aList = [];
                aList.push(tiny);
                // tiny.complement only returns one color ... not array...
                aList.push(tiny.complement());
                aList = aList.map(function(rgb) {
                    return [rgb, ""];
                    //return [ rgb, tinycolor.hexNames[ rgb.toHex()] ];
                });
                // convert array to md colors and send it to mdarray handler...
                //console.log("aList: ", aList);
                x = matchMd(aList);
                //console.log("x: ", x);
                $("#navcolor").css("background-color", x[0][0].toHexString());
                $("#navcolor").attr("title", x[0][1] + " (" + x[0][0] + ")");
                $("#logo-container").css("color", findReadable(x[0][0]));

                $("#helpnav").empty();
                $("#helpnav").append("<li>Top Nav: " + x[0][1] + " (" + x[0][0] + ")</li>");
                $("#helpside").empty();
                $("#helpside").append("<li>Top Nav: " + x[0][1] + " (" + x[0][0] + ")</li>");

                $("#footcolor").css("background-color", x[1][0].toHexString());
                $("#footcolor").attr("title", x[1][1] + " (" + x[1][0] + ")");
                $(".fText").css("color", findReadable(x[1][0]));

                //$("#pBack").css("background-color", x[1][0].toHexString());
                //$("#pBack").attr("title", x[1][1] + " (" + x[1][0] + ")");
                //$("#pBack").css("color", findReadable( x[1][0] ));

                /*$("#patt").css({
                    "background": "linear-gradient(45deg, " + x[1][0] + " 50%, " + x[0][0] + " 50%",
                    "background-size": "10px 10px",
                    "width": "100%",
                    "height": "10px"
                });*/
                
                var c1 = findReadable(x[0][0]); // text color main
                var c2 = x[0][0]; // main color
                var c3 = x[1][0]; // complement color
                $("#patt").css({
                    "background": "radial-gradient(circle at 50% 59%,  " + c1 + "  3%,  " + c2 + "  4%,  " + c2 + "  11%, rgba(54,78,39,0) 12%, rgba(54,78,39,0)) 25px 0,"
                        + "radial-gradient(circle at 50% 41%,  " + c2 + "  3%,  " + c1 + "  4%,  " + c1 + "  11%, rgba(210,202,171,0) 12%, rgba(210,202,171,0)) 25px 0,"
                        + "radial-gradient(circle at 50% 59%,  " + c1 + "  3%,  " + c2 + "  4%,  " + c2 + "  11%, rgba(54,78,39,0) 12%, rgba(54,78,39,0)) 0 25px,"
                        + "radial-gradient(circle at 50% 41%,  " + c2 + "  3%,  " + c1 + "  4%,  " + c1 + "  11%, rgba(210,202,171,0) 12%, rgba(210,202,171,0)) 0 25px,"
                        + "radial-gradient(circle at 100% 50%,  " + c1 + "  16%, rgba(210,202,171,0) 17%),"
                        + "radial-gradient(circle at 0% 50%,  " + c2 + "  16%, rgba(54,78,39,0) 17%),"
                        + "radial-gradient(circle at 100% 50%,  " + c1 + "  16%, rgba(210,202,171,0) 17%) 25px 25px,"
                        + "radial-gradient(circle at 0% 50%,  " + c2 + "  16%, rgba(54,78,39,0) 17%) 25px 25px",
                    "background-color": c3.toHexString(),
                    "background-size": "50px 50px",
                    "text-align": "right",
                    "height": "50px",
                    "width": "100%"
                });
                $("#patt span").css({
                    "background-color": c3.toHexString(),
                    "color": findReadable(c3), // text color complement
                });
                
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
        s = "<table class=\"z-depth-1\"><thead></thead><tbody><tr><td>" + title + "</td>";
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
    function findReadable(c) {
        return tinycolor.mostReadable(
            c, ["#fafafa", "#f5f5f5", "#eeeeee", "#e0e0e0", "#bdbdbd", "#9e9e9e", "#757575", "#616161", "#424242", "#212121"], {
                includeFallbackColors: true
            }).toHexString();
    }

    // handle enter key event on output...
    // not used, but keep for pattern/memory jogging.
    /*
        var out = document.getElementById("output");
        out.onkeypress = function(event) {
            // trigger on enter key...
            var x = event.which || event.keyCode;
            if (x == 13) {
                alert("enter key pressed");
            }
        };
    */

    // handle picker change events...
    function onchange(c) {
        c = checkCalcColor(c.toHexString());
        $("#output").spectrum("set", tinycolor(c));
        setDials(c);
    }

    // handle click event on history / cHistory li elements...
    $('#cHistory > ul').on('click', '> li', function(e) {
        // update the picker with the new clicked color...
        var x = tinycolor($(this).css("background-color")).toHexString();
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
        $("#cHistory ul").prepend("<li style=\"background-color:" + tinycolor(aBgcolor).toHexString() + "; color:" + aColor + "\">" + ++histNum + ". Text: " + tinycolor(aColor).toHexString() + ": Background: " + aBgcolor + " " + aTitle + "</li>");
        // update the picker with the new clicked color...
        $("#output").spectrum("set", tinycolor(aBgcolor));
        setDials(aBgcolor);
    });

    // filter the check boxes to see how to handle color and settings...
    function checkCalcColor(c) {
        if (mdc.checked == true) {
            // returns array of [rgbString, mdColorName, mdTinkNumber]...
            var tmp = calcColor(c);
            c = tmp[0];
            mh.innerHTML = tmp[1];
        }
        else {
            mh.innerHTML = "Picker Unlocked";
        }
        return c;
    }

    // calculate closest color based on material color design: just primaries or all...
    function calcColor(c) {
        c = tinycolor(c);
        var diff = Number.MAX_VALUE;
        var tDiff, closest, obj, key, tint, anRGB;
        for (key in mdColors.md) {
            if (mdColors.md.hasOwnProperty(key)) {
                obj = mdColors.md[key];
                for (tint in obj) {
                    if (obj.hasOwnProperty(tint)) {
                        // need to fix this ... always searches all mdColors...
                        if (mdm.checked == true && tint.substr(0, 4) == "P500") {
                            anRGB = tinycolor(obj[tint]);
                        }
                        else if (mdm.checked == false /*&& tint.substr(0, 1) == "A" */ ) {
                            anRGB = tinycolor(obj[tint]);
                        }
                        else {
                            continue;
                        }
                        // unweighted rgb...
                        //tDiff = Math.sqrt(Math.pow(((clr.r - anRGB["r"])), 2) + Math.pow(((clr.g - anRGB["g"])), 2) + Math.pow(((clr.b - anRGB["b"])), 2));
                        // weighted rgb...
                        //tDiff = Math.sqrt(Math.pow(((clr.r - anRGB["r"])), 2) * 3 + Math.pow(((clr.g - anRGB["g"])), 2) * 4 + Math.pow(((clr.b - anRGB["b"])), 2) * 2);
                        // special calc...
                        tDiff = colorDistance(c, anRGB);
                        //console.log("tdiff: ", tDiff);
                        if (tDiff < diff) {
                            diff = tDiff;
                            closest = [anRGB, key, tint];
                            //console.log("closest: ", closest);
                        }
                    }
                }
            }
        }
        // tinycolor, keyColor, tinkColor, izeLabel...
        return ([closest[0], closest[1] + " (" + closest[2] + ") materializecss: " + closest[1].toLowerCase() + " " + mdColors.ize[closest[2]]]);
    }

    // http://www.compuphase.com/cmetric.htm
    // ... very mathy and follows human perception...
    function colorDistance(e1, e2) {
        //console.log("e1e2a: ", e1, e2);
        e1 = tinycolor(e1);
        e2 = tinycolor(e2);
        //console.log("e1e2b: ", e1, e2);
        var rmean = (e1._r + e2._r) / 2;
        var r = e1._r - e2._r;
        var g = e1._g - e2._g;
        var b = e1._b - e2._b;

        return Math.sqrt((((512 + rmean) * r * r) / 256) + 4 * g * g + (((767 - rmean) * b * b) / 256));
    }

    // twist the little readouts...
    function setDials(c) {

        colorKeys(c);

        c = tinycolor(c);
        vr.innerHTML = c._r;
        vg.innerHTML = c._g;
        vb.innerHTML = c._b;
        vh.innerHTML = vh2.innerHTML = Math.round(c.toHsv().h % 360) + "°";
        vs.innerHTML = vs2.innerHTML = Math.round(c.toHsv().s * 100) + "%";
        vv.innerHTML = Math.round(c.toHsv().v * 100) + "%";
        vl.innerHTML = Math.round(c.toHsl().l * 100) + "%";
    }

    // end of the wait for window code at top...
});