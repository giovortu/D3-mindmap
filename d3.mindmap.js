/**
 * d3.mindmap.js
 *
 * A D3 plugin to display and edit mind maps
 *
 * @license GPLV3, magnet:?xt=urn:btih:1f739d935676111cfff4b4693e3816e664797050&dn=gpl-3.0.txt
 * @version 0.1
 * @author  Ortu Giovanni, https://www.giovanniortu.it, https://github.com/giovortu/D3-mindmap
 * @updated 2017-05-3
 * @link    https://github.com/giovortu/D3-mindmap
 *
 *
 */
d3.mindMap = function(options) {


    /*JSON objects clone method*/
    if (typeof JSON.clone !== "function") {
        JSON.clone = function(obj) {
            return JSON.parse(JSON.stringify(obj));
        };
    }


    /*context menu plugin*/
    d3.contextMenu = function(menu, openCallback) {

        // create the div element that will hold the context menu
        d3.selectAll('.d3-context-menu').data([1])
            .enter()
            .append('div')
            .attr('class', 'd3-context-menu');

        // close menu
        d3.select('body').on('click.d3-context-menu', function() {
            d3.select('.d3-context-menu').style('display', 'none');
        });



        // this gets executed when a contextmenu event occurs
        return function(data, index) {
            var elm = this;

            d3.selectAll("div#d3-mindmap-node-editor").remove();

            d3.selectAll('.d3-context-menu').html('');

            d3.selectAll('.d3-context-menu').on("contextmenu", function() {
                d3.event.preventDefault();
            });
            var list = d3.selectAll('.d3-context-menu').append('ul');

            var dd = d3.mouse(document.getElementById("d3-mindmap-svg-root"))

            var __x = d3.event.pageX;
            var __y = d3.event.pageY;
            var relX = (dd[0] - trans[0]) / scale;
            var relY = (dd[1] - trans[1]) / scale;



            var dd = d3.mouse;
            list.selectAll('li').data(menu).enter()
                .append('li')
                .html(function(d) {
                    return d.title;
                })
                .on('click', function(d, i) {
                    d.action(elm, data, index, __x, __y, relX, relY);
                    d3.select('.d3-context-menu').style('display', 'none');
                });

            // the openCallback allows an action to fire before the menu is displayed
            // an example usage would be closing a tooltip
            if (openCallback) openCallback(data, index);

            // display context menu
            d3.select('.d3-context-menu')
                .style('left', (d3.event.pageX - 2) + 'px')
                .style('top', (d3.event.pageY - 2) + 'px')
                .style('display', 'block');

            d3.event.preventDefault();
        };
    };


    /* bring to front elements*/
    d3.selection.prototype.moveToFront = function() {
        return this.each(function() {
            this.parentNode.appendChild(this);
        });
    };

    function checkKey(event) {

        shiftClicked = event.shiftKey;
        ctrlClicked = event.ctrlKey;

    }

    /* keys management */
    d3.select("body")
        .on("keydown", function() {

            checkKey(d3.event);

        })
        .on("keyup", function() {

            checkKey(d3.event);

        });

    /*constants*/
    var rectWidth = 120,
        rectHeight = 20,
        scale = 1,
        linkWeight = 2
    shiftClicked = false,
        ctrlClicked = false,
        fontSize = 10



    /*parameters*/
    var _width = (options && options.width) || 960,
        _height = (options && options.height) || 500,
        initialDistance = (options && options.initialDistance) || 150,
        textXMargin = (options && options.textXMargin) || 10,
        textYMargin = (options && options.textYMargin) || 10,

        enableEdit = (options && options.editable),
        containerID = (options && options.container) || "cont",
        resultsID = (options && options.results) || "result",
        fixedNodes = (options && options.fixedNodes),
        nodesData = (options && options.nodes) || {
            "nodes": [],
            "viewport": {
                "scale": 1,
                "translate": [0, 0]
            }
        }

    var margin = {
            top: 20,
            right: 20,
            bottom: 30,
            left: 40
        },
        width = _width //- margin.left - margin.right,
    height = _height // - margin.top - margin.bottom;


    /*text element text wrapping*/
    function wrap(text, width) {
        text.each(function() {

            var text = d3.select(this),
                words = text.attr("title").split(/\r?\n/)

            interline = 10;


            fs = computedStyle(text.node(), "fontSize") || "10";

            lines = 0

            text.text("");

            words.forEach(function(word) {
                tspan = text.append("tspan").attr("x", 0).attr("dy", fs).text(word);
            })


        })
    }

    var root = nodesData.nodes;
    var lastNodeID = countNodes(root);

    function edit(elm, d, i, _x, _y, rx, ry) {

        if (d) {

            var nn = findNode(d.id, root);
            var tt = svg.select("#JIKU_MM_TEXT_" + nn.id)[0][0];

            d3.selectAll("div#d3-mindmap-node-editor").remove();

            if (tt) {

                var txt = nn.name;
                var textcontent = nn.textcontent || ""

                var txtElem = d3.select(tt);

                function submit() {
                    var _title = title.node().value;

                    nn.name = _title;

                    txtElem.attr("title", _title).call(wrap);

                    var _content = inp.node().value;
                    nn.textcontent = _content;

                    removed = true;
                    d3.selectAll("div#d3-mindmap-node-editor").remove();
                    update(root);
                }

                posX = _x;
                posY = _y;

                ww = document.documentElement.scrollWidth
                hh = document.documentElement.scrollHeight

                frm = d3.select("body").append("div").attr("id", "d3-mindmap-node-editor")
                frm.style("position", "absolute")
                var removed = false;

                form = frm
                    .append("xhtml:form")
                    .on("submit", function() {
                        d3.event.preventDefault();
                        return null;
                    })
                    .classed("rename-form", true)

                form.append("span").text("Titolo")

                title = form
                    .append("textarea")
                    .classed("d3-mindmap-node-editor-title", true)

                title
                    .attr("placeholder", "Inserire il titolo...")
                    .attr("value", function() {
                        this.focus();
                        title[0][0].value = txt;
                        return txt;
                    })

                form.append("span").text("Contenuto")

                inp = form
                    .append("textarea")
                    .attr("placeholder", "Inserire il contenuto...")
                    .classed("rename-form", true)

                inp.attr("value", function() {

                    inp[0][0].value = textcontent;
                    return textcontent;
                })


                buttContainer = form.append("div")

                buttContainer.classed("inner", true)


                canc = buttContainer.append("xhtml:button")
                    .classed("d3-mindmap-little-button", true)
                    .text("Annulla")
                    .on("click", function() {
                        removed = true;
                        d3.selectAll("div#d3-mindmap-node-editor").remove();
                    })

                ok = buttContainer.append("xhtml:button")
                    .classed("d3-mindmap-little-button", true)
                    .text("Salva")
                    .on("click", submit)

                frmWidth = frm.node().getBoundingClientRect().width
                frmHeight = frm.node().getBoundingClientRect().height


                if (posX + frmWidth > ww)
                    posX = ww - frmWidth;

                if (posY + frmHeight > hh)
                    posY = hh - frmHeight;

                frm.attr("style", "left:" + posX + "px; top:" + posY + "px;")


            }
        }
    }




    var mainMenu = [{
            title: 'Add new node',
            action: function(elm, d, i, _x, _y, rx, ry) {


                var newNode = JSON.clone(emptyNode);
                newNode.id = ++lastNodeID;
                newNode.name = "";
                newNode.isLeaf = true;
                newNode.x = rx;
                newNode.y = ry;

                if (fixedNodes)
                    newNode.fixed = true;
                else
                    delete newNode.fixed;


                if (!Array.isArray(root)) {
                    root = [root];
                }

                root.push(newNode);

                update(root);

                edit(elm, newNode, i, _x, _y, rx, ry)

            }
        },
        {
            title: 'Expand all',
            action: function(elm, d, i) {
                expand(root)
                update(root)
            }

        },
        {
            title: 'Collapse all',
            action: function(elm, d, i) {

                collapse(root)
                update(root)
            }

        }
    ]

    var input;

    var menu = [{
            title: 'Add sub node',
            action: function(elm, d, i, _x, _y, rx, ry) {

                if (d) {
                    var nn = findNode(d.id, root);

                    if (nn.isLeaf) {
                        nn.children = [];
                        nn._children = null;
                    }

                    var child = nn.children || nn._children || null;

                    if (child) {

                        var angle = Math.random() * 2 * Math.PI;

                        var newNode = JSON.clone(emptyNode);
                        newNode.id = ++lastNodeID;
                        newNode.name = "";
                        newNode.x = nn.x + initialDistance * Math.sin(angle);
                        newNode.y = nn.y + initialDistance * Math.cos(angle);

                        if (fixedNodes)
                            newNode.fixed = true;
                        else
                            delete newNode.fixed;

                        child.push(newNode);
                        nn.isLeaf = false;
                        var tt = svg.select("#JIKU_MM_RECT_" + nn.id);

                        if (tt) {
                            tt.attr("class", "d3-mindmap-parent");


                        }
                        //collapse( [nn] )
                        //collapse( [nn] )
                        update(root)

                        d3.select("#JIKU_MM_NODE_" + d.id).moveToFront()

                        edit(elm, newNode, i, _x, _y, rx, ry)
                    }



                }
            }
        },
        {
            title: 'Edit node',
            action: function(elm, d, i, _x, _y, rx, ry) {
                edit(elm, d, i, _x, _y, rx, ry);
            }

        },
        {
            title: 'Remove node',
            action: function(elm, d, i) {
                if (d) {
                    var nn = removeNode(d.id, root);
                    update(root);
                }
            }
        }
    ]

    var viewMenu = [{
            title: 'Expand all',
            action: function(elm, d, i) {

                expand(root)
                update(root)
            }

        },
        {
            title: 'Collapse all',
            action: function(elm, d, i) {

                collapse(root)
                update(root)
            }

        }
    ]



    var emptyNode = {
        "name": "New node",
        "isLeaf": true,
        "url": ""

    }


    var force = d3.layout.force()

        .size([width, height])
        .on("tick", tick)


    var div = d3.selectAll("div#" + containerID)

    div.style("position", "relative").style("width", width + "px").style("height", height + "px");


    var zoomControls = div.append("div").attr("id", "d3-mindmap-zoom-controls");

    /*var helpControls = div.append( "div" ).attr("id", "d3-mindmap-help-controls" );

    var helpButton = null;

    if (enableEdit) {

        helpButton = helpControls.append("button")
                    .text("Help")
                    .classed("d3-mindmap-little-button",true)
                    .on("click", showHelp )

    }*/

    var zoomPlus = zoomControls.append("button")
        .text("Zoom +")
        .classed("d3-mindmap-little-button", true)
        .attr("id", "zoom_in")
        .on("click", zoomClick)

    var zoomReset = zoomControls.append("button")
        .text("Reset")
        .classed("d3-mindmap-little-button", true)
        .attr("id", "zoom_reset")
        .on("click", zoomClick)

    var zoomMinus = zoomControls.append("button")
        .text("Zoom -")
        .classed("d3-mindmap-little-button", true)
        .attr("id", "zoom_out")
        .on("click", zoomClick)


    if (enableEdit) {
        div.on('contextmenu', d3.contextMenu(mainMenu));
    } else {
        div.on('contextmenu', d3.contextMenu(viewMenu));
    }


    var x = d3.scale.linear()
        .domain([-width / 2, width / 2])
        .range([0, width]);

    var y = d3.scale.linear()
        .domain([-height / 2, height / 2])
        .range([height, 0]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom")
        .tickSize(-height);

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")
        .ticks(5)
        .tickSize(-width);


    var zoom = d3.behavior.zoom()
        .scaleExtent([0.2, 2.5])
        .x(x)
        .y(y)
        .center([width / 2, height / 2])
        .size([width, height])

    if (nodesData && nodesData.viewport && nodesData.viewport.scale)
        zoom.scale(nodesData.viewport.scale);

    if (nodesData && nodesData.viewport && nodesData.viewport.translate)
        zoom.translate(nodesData.viewport.translate);

    zoom.on("zoom", translateandrescale);


    var svg = d3.select("div#" + containerID).append("svg")
        .attr("id", "d3-mindmap-svg-root")
        .classed("d3-mindmap-svg", true)
        .attr("width", _width)
        .attr("height", _height)
        .attr("pointer-events", "all")
        .append("g")
        //  .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .call(zoom);


    svg.append("g")
        .attr("class", "d3-x-axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    svg.append("g")
        .attr("class", "d3-y-axis")
        .call(yAxis);



    rect = svg.append("g")
        .attr("width", width)
        .attr("height", height);


    /*link arrow*/
    svg.append("svg:defs").selectAll("marker")
        .data(["end"]) // Different link/path types can be defined here
        .enter().append("svg:marker") // This section adds in the arrows
        .attr("id", String)
        .attr("viewBox", "0 -5 10 10")
        .attr("refX", 25)
        .attr("refY", 0)
        .attr("markerWidth", 6)
        .attr("markerHeight", 6)
        .attr("orient", "auto")
        .append("svg:path")
        .attr("d", "M0,-5L10,0L0,5L0,-5")
        .attr("stroke-width", 1)
        .attr("stroke", "#c0c0c0")
        .attr("fill", "#606060")



    var link = rect.selectAll(".d3-mindmap-link")


    var node = rect.selectAll(".d3-mindmap-node");


    translateandrescale(nodesData.viewport);

    update(root)


    var flroot;

    /* pan and zoom */
    function translateandrescale(ndata) {

        svg.select(".d3-x-axis").call(xAxis);
        svg.select(".d3-y-axis").call(yAxis);


        scale = (ndata && ndata.scale) || (d3.event && d3.event.scale);
        trans = (ndata && ndata.translate) || (d3.event && d3.event.translate);


        if (scale && trans) {
            tr1 = [trans[0] * scale, trans[1] * scale]
            tr2 = [trans[0] / scale, trans[1] / scale]

            rect.attr("transform", "scale(" + scale + ")" + "translate(" + tr2 + ")");

            nodesData.viewport = {
                "scale": scale,
                "translate": tr1
            }

            updateResult();
        }

    }



    function update(root) {


        var nodes = flatten(root),
            links = d3.layout.tree().links(nodes)


        flroot = nodes;

        updateResult();

        // Restart the force layout.
        force
            .nodes(nodes)
            .links(links)
            .linkDistance(fontSize * 10)
            .charge(-8000)
            .gravity(.05)
            .friction(0.0)
            .size([width, height])
            .start()


        // Update links.
        link = link.data(links, function(d) {
            return d.target.id;
        })


        link.exit().remove();



        link.enter().insert("path", ".d3-mindmap-node")
            .classed("d3-mindmap-link", true)
            .style("stroke-width", linkWeight)
            .attr("marker-end", "url(#end)");



        var drag = force.drag()


        if (enableEdit) {

            drag
                .on("drag", nodedrag)
                .on("dragstart", dragstart)
                .on("dragend", dragend);

        }



        // Update nodes.
        node = node.data(nodes, function(d) {
            return d.id;
        });

        node.exit().remove();


        var nodeEnter = node.enter().append("g")
            .attr("id", function(d) {
                return "JIKU_MM_NODE_" + d.id;
            })
            .attr("class", "d3-mindmap-node")
            .on("click", onclick)
            .on("touchstart", onclick)
            .on("mouseover", mouseover)
            .on("mouseout", mouseout)

        if (enableEdit) {
            nodeEnter.call(drag)

        }


        var rect = nodeEnter.append("rect")
            .attr("x", 0)
            .attr("y", 0)
            .attr("height", rectHeight)
            .attr("width", rectWidth)
            .attr("id", function(d) {
                return "JIKU_MM_RECT_" + d.id;
            })
            .attr("class", function(d) {
                if (hasValue(d.isLeaf)) {
                    if (d.isLeaf) {
                        return "d3-mindmap-leaf";
                    } else {
                        return "d3-mindmap-parent"

                    }
                }

            })




        var txt = nodeEnter.append("text")

            .attr("class", "text")
            .style("text-anchor", "middle")
            .attr("id", function(d) {
                return "JIKU_MM_TEXT_" + d.id;
            })
            .attr("class", function(d) {
                if (d.url) {
                    return "d3-mindmap-hyperlink";
                }
            })
            .attr("title", function(d) {
                return d.name;
            })
            .call(wrap);


        var circles = nodeEnter.append("g")
            .attr("class", "textcontentcircle")

        var circle = circles.append("circle")
            .style("fill", "#50e050")
            .style("stroke", "#505020")
            .attr("cx", 0)
            .attr("cy", 0)
            .attr("r", 10)
            .attr("id", function(d) {
                return "JIKU_MM_CIRCLE_" + d.id;
            })
            .on("mouseover", onContent)
            .on("mouseout", outContent)


        var sym = circles.append("text")
            .style("text-anchor", "middle")
            .style("font-size", "15px")
            .style("font-style", "italic")
            .attr("x", -1)
            .attr("y", 5)
            .attr("width", 12)
            .attr("height", 12)
            .text("i")




        var gs = d3.selectAll('g.d3-mindmap-node');

        if (enableEdit) {
            rect.on('contextmenu', d3.contextMenu(menu));
        } else {
            rect.on('contextmenu', d3.contextMenu(viewMenu));
        }


        gs[0].forEach(function(elem) {


            childs = elem.childNodes;

            anchors = childs[0].childNodes;

            _rect = childs[0];
            _text = childs[1];

            fontSize = computedStyle(d3.select(_text).node(), "fontSize") || "10";

            fontSize = parseInt(fontSize)

            textSize = _text.getBBox();

            w = textSize.width + 2 * textXMargin;
            h = textSize.height + 2 * textYMargin;


            _rect.setAttribute("x", -w / 2);
            _rect.setAttribute("y", -h / 2);

            _text.setAttribute("y", -h / 2 + fontSize / 2);

            _rect.setAttribute("width", w)
            _rect.setAttribute("height", h)



            _circles = d3.select(elem).select('g.textcontentcircle');

            _circles.attr("transform", "translate(" + w / 2 + "," + (h / 2) + ")")
                .attr("visibility", function(d, i) {

                    if (d.textcontent)
                        return "visible";
                    return "hidden";

                })




        });



    }

    function updateResult() {


        if (enableEdit && document.getElementById(resultsID)) {

            document.getElementById(resultsID).value = JSON.stringify(filterAll(nodesData));
        }

    }

    function linkArc(d) {

        perc = 0.65;

        targetX = (d.source.x + perc * (d.target.x - d.source.x))
        targetY = (d.source.y + perc * (d.target.y - d.source.y))
        return "M" + d.target.x + "," + d.target.y + "L" + +d.source.x + "," + d.source.y + "M" + targetX + "," + targetY;
    }




    function tick() {

        link.attr("d", linkArc);

        node.attr("transform", function(d) {

            return "translate(" + d.x + "," + d.y + ")";

        });

        if (fixedNodes)
            force.stop();

        updateResult()


    }



    function hasValue(d) {
        return d !== null && typeof d !== 'undefined';

    }

    function hasChilds(d) {
        var ret = false;

        ret = hasValue(d.children) || hasValue(d._children);

        return ret;

    }

    /* expand nodes */
    function expand(nodes) {

        if (Array.isArray(nodes)) {
            nodes.forEach(function(d) {
                expand(d);
            });
        } else {

            if (nodes._children) {

                if (nodes.children) {

                } else {
                    nodes.children = []
                }

                nodes._children.forEach(function(e) {
                    nodes.children.push(e);

                });

                nodes._children = null;
            }

            if (nodes.children) {
                nodes.children.forEach(function(e) {
                    expand(e);
                });
            }


        }


    }


    /* collapse nodes */
    function collapse(nodes) {

        if (Array.isArray(nodes)) {
            nodes.forEach(function(d) {
                collapse(d);
            });
        } else {

            if (nodes.children) {

                if (nodes._children) {

                } else {
                    nodes._children = []
                }

                nodes.children.forEach(function(e) {
                    nodes._children.push(e);

                });

                nodes.children = null;
            }

            if (nodes._children) {
                nodes._children.forEach(function(e) {
                    collapse(e);
                });
            }


        }


    }



    /* find in json flavour */
    function findJsonNode(id, root) {

        if (hasValue(root)) {
            for (i = 0; i < root.length; i += 1) {
                if (root[i].id === id) {
                    return root[i];
                }
            }
        }

        return null;
    }

    /* remove a node */
    function removeNode(id, _root) {

        var i,
            elem;

        console.log("Removing " + id);

        if (Array.isArray(_root)) {

            for (i = 0; i < _root.length; i++) {

                elem = _root[i];


                if (elem.id == id) {
                    _root.splice(i, 1);
                } else {
                    _remove(id, elem);
                }

            }

        } else {
            _remove(id, _root)
        }

        function _remove(id, currentNode) {
            var _j, currentChild;

            if (hasValue(currentNode)) {

                if (currentNode.children) parseChilds(id, currentNode.children);
                if (currentNode._children) parseChilds(id, currentNode._children);


                function parseChilds(id, childs) {

                    for (_j = 0; _j < childs.length; _j++) {
                        currentChild = childs[_j];

                        if (currentChild.id == id) {
                            console.log("Found, removing ");
                            childs.splice(_j, 1);
                            if (childs.length == 0) {
                                currentNode.isLeaf = true;

                                var tt = svg.select("#JIKU_MM_RECT_" + currentNode.id);

                                if (tt) {
                                    tt.attr("class", "d3-mindmap-leaf");
                                }

                            }
                            return currentChild;

                        } else {
                            _remove(id, currentChild);
                        }

                    }
                }
            }

        }


    }

    /* filters node data to be saved */
    function filterAll(_currentNode) {

        var i,
            elem;

        __currentNode = JSON.clone(_currentNode);

        __currentNode.viewport.translate[0] = Math.floor(__currentNode.viewport.translate[0])
        __currentNode.viewport.translate[1] = Math.floor(__currentNode.viewport.translate[1])

        _nodes = __currentNode.nodes;

        if (Array.isArray(_nodes)) {

            for (i = 0; i < _nodes.length; i++) {

                elem = _nodes[i];

                _filter(elem);

            }

        } else {
            _filter(_nodes)
        }

        function _filter(currentNode) {
            var _j, currentChild;

            delete currentNode.fixed;
            delete currentNode.px;
            delete currentNode.py;
            delete currentNode.weight;
            delete currentNode.isLeaf;
            delete currentNode.index;
            delete currentNode.size;
            delete currentNode.status;

            currentNode.x = Math.floor(currentNode.x)
            currentNode.y = Math.floor(currentNode.y)



            if (hasValue(currentNode)) {

                if (currentNode._children) {
                    if (currentNode.children) {

                    } else {
                        currentNode.children = [];
                    }

                    for (_j = 0; _j < currentNode._children.length; _j++) {
                        currentNode.children.push(currentNode._children[_j])
                    }


                }

                delete currentNode._children;

                if (currentNode.children) parseChilds(currentNode.children);
                //if (currentNode._children) parseChilds(currentNode._children);


                function parseChilds(childs) {

                    for (_j = 0; _j < childs.length; _j++) {
                        currentChild = childs[_j];


                        _filter(currentChild);

                    }
                }
            }

        }

        __currentNode.nodes = _nodes;

        return __currentNode;


    }


    /* find node in struct */
    function findNode(id, currentNode) {

        var i,
            currentChild,
            result;

        if (Array.isArray(currentNode)) {
            for (var i = 0; i < currentNode.length; i++) {
                elem = currentNode[i];
                // console.log("recurring");
                res = findNode(id, elem);
                if (res !== false)
                    return res;
            }

        } else {

            if (id == currentNode.id) {

                return currentNode;

            } else {

                if (hasValue(currentNode)) {
                    if (hasValue(currentNode.children)) {

                        for (var i = 0; i < currentNode.children.length; i += 1) {

                            currentChild = currentNode.children[i];

                            // Search in the current child
                            result = findNode(id, currentChild);

                            // Return the result if the node has been found
                            if (result !== false) {
                                return result;
                            }
                        }
                    }
                }
            }
        }
        return false;
    }

    /* count all nodes */
    function countNodes(root) {
        if (Array.isArray(root)) {

            var sum2 = 0;

            root.forEach(function(elem) {
                sum2 += recurse(elem);
            });


            return sum2 + root.length;

        } else {

            return recurse(root);

        }

        function recurse(node) {

            var sum = 0;

            if (node.children) {

                sum += node.children.length;

                node.children.forEach(function(elem) {

                    if (elem.children) {
                        sum += recurse(elem)
                    }

                });

            }
            return sum;
        }
    }

    // Returns a list of all nodes under the root.
    function findRootNodes(root) {

        var _rootNodes = [],
            i = 0;


        if (Array.isArray(root)) {
            root.forEach(function(elem) {
                recurse(elem);
            });

        } else {
            recurse(root);

        }

        function recurse(node) {


            if (node.children) {
                node.size = node.children.reduce(function(p, v) {
                    return p + recurse(v);
                }, 0);

                _rootNodes.push(node);
            }


        }


        return _rootNodes;
    }




    // Returns a list of all nodes under the root.
    function flatten(root) {

        var nodes = []


        if (Array.isArray(root)) {
            root.forEach(function(elem) {

                flat = flatten(elem);
                flat.forEach(function(e) {
                    nodes.push(e);
                });


            });

        } else {

            recurse(root);

        }

        function recurse(node) {

            node.isLeaf = true;

            if (fixedNodes)
                node.fixed = true;
            else
                delete node.fixed;

            if (node.children) {
                node.size = node.children.reduce(function(p, v) {
                    //v.parent = node ;
                    return p + recurse(v);
                }, 0);
                node.isLeaf = false;

            } else
            if (node._children) {
                //node.size = node._children.reduce(function(p, v) { return p + recurse(v); }, 0);
                node.isLeaf = false;
            }

            if (!node.id) node.id = ++lastNodeID;


            nodes.push(node);
        }


        return nodes;
    }

    // Toggle children on click.
    function onclick(d) {


        if (d3.event.defaultPrevented) return;

        if (d.children) {

            if (hasValue(d)) {
                console.log("Collapsing " + d.id);
                var jNode = findJsonNode(d.id, flroot);

                jNode.isLeaf = false;


            }


            d._children = d.children;
            d.children = null;

        } else {
            d.children = d._children;
            d._children = null;

            if (hasChilds(d)) {

                var jNode = findJsonNode(d.id, flroot);

                jNode.isLeaf = false;
            }


        }
        update(root);

    }


    function dragstart(d) {

        d3.event.sourceEvent.stopPropagation();
    }

    function dragend(d) {
        d3.event.sourceEvent.stopPropagation();
    }



    /* node movement */
    function nodedrag(dd) {


        var selection = d3.selectAll("#JIKU_MM_NODE_" + dd.id);

        var nn = findNode(dd.id, root);

        nn.x = dd.px + d3.event.dx
        nn.y = dd.py + d3.event.dy

        if (ctrlClicked && dd.children) {
            dd.children.forEach(function(elem) {



                var n = d3.select("#JIKU_MM_NODE_" + elem.id);

                nodedrag(elem);


                n.attr("transform", function(d) {

                    d.px = d.px + d3.event.dx
                    d.py = d.py + d3.event.dy

                })

            });

        }

        update(root);

    }




    /* focus and context menumanagement */
    function mouseover(d) {

        div = d3.selectAll("div#" + containerID)

        if (enableEdit) {
            input = d3.select("#d3-mindmap-node-editor").node();
            if (input) return;
        }

        zoom.on("zoom", function() {});

        svg.call(zoom.event)

        var node = d3.select(this);
        var selection = node.select("rect");
        var text = d3.select(this).select("text");


        node.moveToFront();

        if (enableEdit) {

            selection.classed("d3-mindmap-hover", true);
            text.classed("d3-mindmap-hover", true);
        }

        div.on('contextmenu', null);
        node.on('contextmenu', null);
        node.on('contextmenu', d3.contextMenu(viewMenu));

        if (enableEdit) {
            node.on('contextmenu', d3.contextMenu(menu));
        } else {
            node.on('contextmenu', d3.contextMenu(viewMenu));
        }


    }

    /* focus and context menumanagement */
    function mouseout(e) {

        div = d3.selectAll("div#" + containerID)

        zoom.on("zoom", translateandrescale);
        svg.call(zoom)


        var node = d3.select(this);
        var selection = node.select("rect");
        var text = d3.select(this).select("text");

        selection.classed("d3-mindmap-hover", false);
        text.classed("d3-mindmap-hover", false);

        div.on('contextmenu', null);
        node.on('contextmenu', null);

        if (enableEdit) {
            div.on('contextmenu', d3.contextMenu(mainMenu));
        } else {
            div.on('contextmenu', d3.contextMenu(viewMenu));
        }

    }



    /* content display management */
    function onContent(d) {

        d3.event.preventDefault();

        div = d3.selectAll("div#" + containerID)

        rem = d3.selectAll("div#d3-mindmap-details");


        if (!rem.empty()) {
            rem.remove();
            return;
        }

        if (enableEdit) {

            div.on('contextmenu', d3.contextMenu(mainMenu));

        }

        if (d.textcontent) {

            div = d3.select("body").append("div")

            div.attr("id", "d3-mindmap-details").attr("style", "top:" + d3.event.pageY + "px; left:" + d3.event.pageX + "px;")

            str = d.textcontent.split(/(?:\r\n|\r|\n)/g);

            str.forEach(function(elem) {

                st = elem;
                if (typeof he == 'object') {
                    st = he.decode(elem);
                }

                div.append("span").text(st);
                div.append("br")
            });

        }

    }

    /* content display management */
    function outContent(d) {

        d3.selectAll("div#d3-mindmap-details").remove();


    }


    /* function for button zoom animation */
    function interpolateZoom(translate, scale) {
        var self = this;
        return d3.transition().duration(350).tween("zoom", function() {
            var iTranslate = d3.interpolate(zoom.translate(), translate),
                iScale = d3.interpolate(zoom.scale(), scale);
            return function(t) {
                zoom
                    .scale(iScale(t))
                    .translate(iTranslate(t));

                nodesData.viewport.scale = iScale(t)
                nodesData.viewport.translate = iTranslate(t)

                translateandrescale(nodesData.viewport)
            };
        });
    }


    function zoomClick() {
        var clicked = d3.event.target,
            direction = 1,
            factor = 0.2,
            target_zoom = 1,
            center = [width / 2, height / 2],
            extent = zoom.scaleExtent(),
            translate = zoom.translate(),
            translate0 = [],
            l = [],
            view = {
                x: translate[0],
                y: translate[1],
                k: zoom.scale()
            };

        d3.event.preventDefault();
        direction = (this.id === 'zoom_in') ? 1 : ((this.id === 'zoom_out') ? -1 : 0);
        if (direction == 0)
            target_zoom = 1;
        else
            target_zoom = zoom.scale() * (1 + factor * direction);

        if (target_zoom < extent[0] || target_zoom > extent[1]) {
            return false;
        }

        translate0 = [(center[0] - view.x) / view.k, (center[1] - view.y) / view.k];
        view.k = target_zoom;
        l = [translate0[0] * view.k + view.x, translate0[1] * view.k + view.y];

        view.x += center[0] - l[0];
        view.y += center[1] - l[1];

        interpolateZoom([view.x, view.y], view.k);
    }

    // DEV: We don't use var but favor parameters since these play nicer with minification
    function computedStyle(el, prop, getComputedStyle, style) {
        getComputedStyle = window.getComputedStyle;
        style =
            // If we have getComputedStyle
            getComputedStyle ?
            // Query it
            // TODO: From CSS-Query notes, we might need (node, null) for FF
            getComputedStyle(el) :

            // Otherwise, we are in IE and use currentStyle
            el.currentStyle;
        if (style) {
            return style[
                // Switch to camelCase for CSSOM
                // DEV: Grabbed from jQuery
                // https://github.com/jquery/jquery/blob/1.9-stable/src/css.js#L191-L194
                // https://github.com/jquery/jquery/blob/1.9-stable/src/core.js#L593-L597
                prop.replace(/-(\w)/gi, function(word, letter) {
                    return letter.toUpperCase();
                })
            ];
        }
    }


}
