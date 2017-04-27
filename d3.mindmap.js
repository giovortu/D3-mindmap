/*  GIOVORTU */   
   
   d3.mindMap = function (options) {

            
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
                    var list = d3.selectAll('.d3-context-menu').append('ul');
                    
                    var __x = d3.event.pageX;
                    var __y = d3.event.pageY;
                    
                    list.selectAll('li').data(menu).enter()
                        .append('li')
                        .html(function(d) {
                            return d.title;
                        })
                        .on('click', function(d, i) {
                            d.action(elm, data, index, __x, __y);
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
            
            function checkKey( event ) {
                    
                        shiftClicked = event.shiftKey;
                        ctrlClicked = event.ctrlKey;
                    
                }
            
            /* keys management */
            d3.select("body")
                .on("keydown", function() {
                    
                        checkKey( d3.event );
                    
                })
                .on("keyup", function() {
                    
                      checkKey( d3.event );
                    
            });
            
            /*constants*/
            var rectWidth = 120,
                rectHeight = 20,
                scale = 1,
                linkWeight = 2
                shiftClicked = false,
                ctrlClicked = false

            /*parameters*/
            var width           = ( options && options.width ) || 960,
                height          = ( options && options.height ) || 500,
                initialDistance = ( options && options.initialDistance ) || 150, 
                textXMargin     = ( options && options.textXMargin ) ||  10,
                textYMargin     = ( options && options.textYMargin ) || 10,
                boxRadius       = ( options && options.boxRadius ) || 20,
                fontSize        = ( options && options.fontSize ) || 12,
                enableEdit      = ( options && options.editable ) 
                containerID     = ( options && options.container ) || "cont"
                resultsID       = ( options && options.results ) || "result"
                fixedNodes      = ( options && options.fixedNodes ) 
                
                

            /*text element text wrapping*/
            function wrap(text, width) {
                text.each(function() {

                    var text = d3.select(this),
                        words = text.attr("title").split(/\r?\n/)

                    interline = 10;

                    lines = 0

                    text.text("");

                    words.forEach(function(word) {
                        tspan = text.append("tspan").attr("x", 0).attr("dy", fontSize).text(word);
                    })


                })
            }



            
            var nodesData = ( options && options.nodes ) || {"nodes":[], "viewport":{"scale":1,"translate":[0,0]} }
            
           
            var root = nodesData.nodes;
                        
            var lastNodeID = countNodes( root )  ;
            
            console.log ( lastNodeID )
            
            
           
            
            function edit(elm, d, i, _x,_y) {

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

                                frm = d3.select("body").append("div").attr("id", "d3-mindmap-node-editor").attr("style", "top:" + _y + "px; left:" + _x + "px;")

                                var removed = false;

                                form = frm
                                    .attr("x", d.x)
                                    .attr("y", d.y)
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

                                w = d3.select('svg').clientWidth;
                                h = d3.select('svg').clientHeight;

                                _bound = d3.select("#d3-mindmap-node-editor").node().getBoundingClientRect();

                                px = _bound.left;
                                py = _bound.top;


                            }
                        }
                    }

            
           

            var mainMenu = [{
                    title: 'Add new node',
                    action: function(elm, d, i, _x,_y) {


                        var newNode = JSON.clone(emptyNode);
                        newNode.id = ++lastNodeID;
                        newNode.name = "Node #" + lastNodeID;
                        newNode.isLeaf = true;
                        newNode.x = _x;
                        newNode.y = _y;
                        
                        if ( fixedNodes )
                            newNode.fixed = true;
                        else
                            delete newNode.fixed;
    

                        if (!Array.isArray(root)) {
                            root = [root];
                        }

                        root.push(newNode);
                        
                        update(root);

                        edit(elm, newNode, i, _x,_y)

                    }
                }
                ,
                {
                    title: 'Expand all',
                    action: function(elm, d, i) {
                        expand( findRootNodes(root)  )
                    }
                    
                },
                {
                    title: 'Collapse all',
                    action: function(elm, d, i) {
                    }
                    
                }
            ]

            var input;

            var menu = [{
                    title: 'Add sub node',
                    action: function(elm, d, i, _x,_y) {

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
                                newNode.name = "Node #" + lastNodeID;
                                newNode.x = nn.x + initialDistance * Math.sin( angle );
                                newNode.y = nn.y + initialDistance * Math.cos( angle ) ;
                                
                                if ( fixedNodes )
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
                                
                                edit(elm, newNode, i, _x,_y)
                            }

                            

                        }
                    }
                },
                {
                    title: 'Edit node',
                    action: function(elm, d, i, _x,_y) { edit(elm, d, i, _x,_y); }

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



            var emptyNode = {
                "name": "New node",
                "isLeaf": true,
                "url": ""

            }


            var force = d3.layout.force()

                .size([width, height])
                .on("tick", tick)
                
                




            var div = d3.selectAll("div#" + containerID)
            
            div.style("position","relative").style("width", width +"px").style("height", height+"px");
            
            
            var zoomControls = div.append( "div" ).attr("id", "d3-mindmap-zoom-controls" );
            
            var helpControls = div.append( "div" ).attr("id", "d3-mindmap-help-controls" );
            
            var helpButton = helpControls.append("button").text("Help").classed("d3-mindmap-little-button",true);
           
            
            
            var zoomPlus = zoomControls.append("button").text("Zoom +").classed("d3-mindmap-little-button",true).attr("id","zoom_in");
            
            var zoomReset = zoomControls.append("button").text("Reset").classed("d3-mindmap-little-button",true).attr("id","zoom_reset");
            
            var zoomMinus = zoomControls.append("button").text("Zoom -").classed("d3-mindmap-little-button",true).attr("id","zoom_out");
            
            
            zoomPlus.on("click", zoomClick)
            
            zoomReset.on("click", zoomClick)

            zoomMinus.on("click", zoomClick)            


            if (enableEdit) {
                div.on('contextmenu', d3.contextMenu(mainMenu));
            }
            
            
            var zoom = d3.behavior.zoom()
                .scaleExtent([0.2, 2.5])
                .center([width / 2, height / 2])
                .size([width, height])
                
            if ( nodesData && nodesData.viewport &&  nodesData.viewport.scale )
                zoom.scale( nodesData.viewport.scale );
        
            if ( nodesData && nodesData.viewport &&  nodesData.viewport.translate )
                zoom.translate( nodesData.viewport.translate );  
  
            zoom.on("zoom", translateandrescale);

            var outer = div.append("svg")
                .classed("d3-mindmap-svg",true)
                .attr("width", width)
                .attr("height", height)
                .attr("pointer-events", "all");
                
                
 
            var svg = outer
                .call(zoom)
                .append('svg:g')
                     

                /*link arrow*/
            outer.append("svg:defs").selectAll("marker")
                    .data(["end"])      // Different link/path types can be defined here
                    .enter().append("svg:marker")    // This section adds in the arrows
                    .attr("id", String)
                    .attr("viewBox", "0 -5 10 10")
                    .attr("refX", 25)
                    .attr("refY", 0)
                    .attr("markerWidth", 6)
                    .attr("markerHeight", 6)
                    .attr("orient", "auto")
                    .append("svg:path")
                    .attr("d", "M0,-5L10,0L0,5L0,-5")
                    .attr("stroke-width",1)
                    .attr("stroke","#c0c0c0")
                    .attr("fill","#606060")
                
                

            var link = svg.selectAll(".link")
            
            
            var node = svg.selectAll(".node");


            var rootNodes = findRootNodes(root);


            //update(root)
            //collapse(findRootNodes(root));
            translateandrescale( nodesData.viewport  );
            
            update(root)
           

            var flroot;
            
            /* pan and zoom */
            function translateandrescale( ndata ) {
            
                
                scale=( ndata && ndata.scale ) || ( d3.event && d3.event.scale );
                trans=( ndata && ndata.translate ) || ( d3.event && d3.event.translate );

                
                if ( scale && trans )
                {
                    
                    
                    
                    tr1 = [ trans[0] *scale    , trans[1]*scale  ]
                    tr2 = [ trans[0] /scale    , trans[1]/scale  ]

                    svg.attr("transform", "scale(" + scale + ")" + "translate(" + tr2 + ")" );
                    
                    nodesData.viewport = { "scale" : scale, "translate" : tr1 }
                    
                    updateResult();
                }
               
            }



            function update(root) {


                var nodes = flatten(root),
                    links = d3.layout.tree().links(nodes)


                flroot = nodes;

                rootNodes = findRootNodes(root);


                updateResult();


                // Restart the force layout.
                force
                    .nodes(nodes)
                    .links(links)
                    .linkDistance(fontSize * 10)
                    .charge(-8000)
                    .gravity(.05)
                    .friction(0.1)
                    .size([width, height])                    
                    .start()


                var drag = force.drag()
                
                
                if ( enableEdit ) {
                
                drag
                .on("drag", nodedrag )
                .on("dragstart", dragstart);
        
                }

                // Update links.
                link = link.data(links, function(d) {
                    return d.target.id;
                })


                link.exit().remove();
                

                link.enter().insert("path", ".node")
                    .attr("class", "link")
                    .style("stroke-width", linkWeight)
                    .attr("marker-end", "url(#end)");

                // Update nodes.
                node = node.data(nodes, function(d) {
                    return d.id;
                });

                node.exit().remove();


                var nodeEnter = node.enter().append("g")
                    .attr("id", function(d) {
                            return "JIKU_MM_NODE_" + d.id;
                    })
                    .attr("class", "node")
                    .on("click", onclick)
                    .on("touchstart", onclick)
                    .on("mouseover", mouseover)
                    .on("mouseout", mouseout)
                    
                if (enableEdit) {                    
                    nodeEnter.call(drag)

                }

                var a = nodeEnter.append("a")
                
                   

                var rect = a.append("rect")
                    .attr("x", 0)
                    .attr("y", 0)
                    .attr("rx", boxRadius)
                    .attr("ry", boxRadius)
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




                var txt = a.append("text")


                    .attr("class", "text")
                    .style("text-anchor", "middle")
                    .style("font-size", fontSize + "px")
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
                    .style("fill","#50e050")
                    .style("stroke","#505020")
                    .attr("cx",0)
                    .attr("cy",0)
                    .attr("r", 10)
                    .attr("id", function(d) {
                        return "JIKU_MM_CIRCLE_" + d.id;
                    })
                    .on("mouseover", onContent)
                    .on("mouseout", outContent)

                
                /*circles.append("svg:path")
                    .attr("d", d3.svg.symbol().type( "cross" ));
                */    
                    
                var sym = circles.append("text")
                    .style("text-anchor", "middle")
                    .style("font-size", "15px")
                    .style("font-style", "italic")
                    .attr("y",-2)
                    .attr("y",5)
                    .attr("width",12)
                    .attr("height",12)
                    .text("i")

                
                
               

                var gs = d3.selectAll('g.node');

                if (enableEdit) {
                    a.on('contextmenu', d3.contextMenu(menu));
                }

                gs[0].forEach(function(elem) {

                  
                    childs = elem.childNodes;
                    
                    anchors = childs[0].childNodes;
                    

                    _rect = anchors[0];
                    _text = anchors[1];

                    textSize = _text.getBBox();


                    w = textSize.width + 2 * textXMargin;
                    h = textSize.height + 2 * textYMargin;


                    _rect.setAttribute("x", -w / 2);
                    _rect.setAttribute("y", -h / 2);

                    _text.setAttribute("y", textYMargin/2 -h / 2 + fontSize / 2.5);

                    _rect.setAttribute("width", w)
                    _rect.setAttribute("height", h)
                    
                    
                    
                    _circles = d3.select(elem).select('g.textcontentcircle');
                    
                    _circles.attr("transform", "translate(" + w/2 + "," + ( h/2 ) + ")")
                    .attr("visibility", function(d,i){
                    
                        if(d.textcontent) 
                            return "visible";
                        return "hidden";
                    
                        })

  


                });


            }

            function updateResult() {
                

                if (enableEdit && document.getElementById( resultsID )) {
                    // console.log(filterAll(root));
                        document.getElementById( resultsID ).value = JSON.stringify(filterAll( nodesData ));
                }
                
            }
            
            function linkArc(d) {          
            
               perc = 0.6;
            
               targetX = (d.source.x + perc * ( d.target.x- d.source.x ) )
               targetY = (d.source.y + perc * ( d.target.y- d.source.y ) )
               return "M"+  d.target.x + "," + d.target.y + "L" +  + d.source.x + "," + d.source.y + "M" + targetX + "," + targetY;
            }

            
     
            

            function tick() {
            
   
                link.attr("d", linkArc);
            

                node.attr("transform", function(d) {   

                    return "translate(" +d.x + "," + d.y + ")";
                    
                });
                
                if (fixedNodes )
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
            
            
                nodes.forEach(function(d) {

                    if (d._children) {
                    
                        d.children = d._children;
                        d._children = null;

                        if (hasChilds(d)) {
                        
                                               
                            d.children.forEach( function( elem )
                            {
                                expand( elem );
                            });
                            
                            //console.log("Expanding " + d.id);

                            var jNode = findJsonNode(d.id, flroot);

                            //console.log(jNode.id + " has CHILD expanded, was " + jNode.status);

                            jNode.status = "expanded";

                        }


                    }


                });
                
                update( root );



            }


            /* collapse nodes */
            function collapse(nodes) {

                nodes.forEach(function(d) {

                    if (d.children) {

                        if (hasValue(d)) {
                            console.log("Collapsing " + d.id);
                            var jNode = findJsonNode(d.id, flroot);

                            console.log(jNode.id + " has CHILD collapsed, was " + jNode.status);
                            jNode.status = "collapsed";

                            //jNode.isLeaf = false;


                        }


                        d._children = d.children;
                        d.children = null;

                    } else {
                        d.children = d._children;
                        d._children = null;

                        if (hasChilds(d)) {
                            console.log("Expanding " + d.id);

                            var jNode = findJsonNode(d.id, flroot);

                            console.log(jNode.id + " has CHILD expanded, was " + jNode.status);

                            jNode.status = "expanded";

                            //jNode.isLeaf = false;
                        }


                    }


                });



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

                                //console.log(currentNode.name + ", numChilds=" +  childs.length +", index=" + _j + " name=" +currentChild.name +" id=" + currentChild.id );

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
                    
                    __currentNode = JSON.clone( _currentNode );
                    
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

                    currentNode.x =  Math.floor(currentNode.x)
                    currentNode.y =  Math.floor(currentNode.y)
                    
                    

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
            function countNodes( root )
            {
                if (Array.isArray(root)) {
                
                        var sum2 = 0;
                        
                        root.forEach(function(elem) 
                        {
                            sum2+=recurse(elem);
                        });
                        
                        
                        return sum2 + root.length;

                } else {
                
                    return recurse(root);

                }
                
                function recurse(node) {
                    
                    var sum = 0;

                    if (node.children) {
                    
                        sum+= node.children.length ;
                        
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
                    
                   if ( fixedNodes )
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

                        jNode.status = "collapsed";

                        jNode.isLeaf = false;


                    }


                    d._children = d.children;
                    d.children = null;

                } else {
                    d.children = d._children;
                    d._children = null;

                    if (hasChilds(d)) {

                        var jNode = findJsonNode(d.id, flroot);

                        jNode.status = "expanded";

                        jNode.isLeaf = false;
                    }


                }
                update(root);

            }
            

            function dragstart(d) {            
                d3.event.sourceEvent.stopPropagation();
            }
            

            
            
            /* node movement */
            function nodedrag(dd) {                  
                
            
                var selection = d3.selectAll("#JIKU_MM_NODE_" + dd.id);
                
                var nn = findNode(dd.id, root);
                
                nn.x = dd.px +d3.event.dx
                nn.y = dd.py +d3.event.dy
                
                if ( ctrlClicked  && dd.children )
                {
                    dd.children.forEach( function( elem ){
                    
                    
                    
                    var n = d3.select( "#JIKU_MM_NODE_" + elem.id );   
                    
                    nodedrag( elem );
                    
                         
                    n.attr("transform", function( d) {
                    
                    d.px = d.px +d3.event.dx
                    d.py = d.py +d3.event.dy
                    
                     })
                     
                   });
                    
                }

                update(root);
            
            }
            
            


            /* focus and context menumanagement */
            function mouseover(d) {
            
                div = d3.selectAll("div#container")

                if (enableEdit) {
                    input = d3.select("#d3-mindmap-node-editor")[0][0];
                    if (input) return;
                }
                
                zoom.on("zoom", function(){});

                outer.call(zoom.event)


                var selection = d3.select(this).select("rect");
                
                
                var text = d3.select(this).select("text");
               
                
                d3.select(this).moveToFront();

                selection.classed("hover", true);
                text.classed("hover", true);


                    
                if (enableEdit) {

                    div.on('contextmenu', null);
                    selection.on('contextmenu', d3.contextMenu(menu));
                }


            }

            /* focus and context menumanagement */
            function mouseout(e) {
            
                div = d3.selectAll("div#container")
                
               
              
                zoom.on("zoom",translateandrescale );
                outer.call(zoom)


                var selection = d3.select(this).select("rect");
                var text = d3.select(this).select("text");

                selection.classed("hover", false);
                text.classed("hover", false);

                if (enableEdit) {

                    div.on('contextmenu', d3.contextMenu(mainMenu));
                    selection.on('contextmenu', null);
                }

            }
            
            
            /* content display management */
            function onContent(d){
            
                d3.event.preventDefault();
            
               
                div = d3.selectAll("div#container")
            
           
                rem = d3.selectAll("div#d3-mindmap-details");
                
                  
                if ( !rem.empty() )
                {
                    rem.remove();
                    return;
                }
                
                if (enableEdit) {
                
                div.on('contextmenu', d3.contextMenu(mainMenu));
            
                }
                
                if ( d.textcontent )
                {
                
                    div = d3.select("body").append("div")
                    
                    div.attr("id", "d3-mindmap-details").attr("style", "top:" + d3.event.pageY + "px; left:" + d3.event.pageX + "px;")
                    
                    str = d.textcontent.split(/(?:\r\n|\r|\n)/g );
                    
                    str.forEach( function( elem ){
                    
                    div.append("span").text( elem );
                    div.append("br")
                    });
                                        
                }                   
            
            }
            
            /* content display management */
            function outContent(d){
            
                d3.selectAll("div#d3-mindmap-details").remove();
     
            
            }
            
                        function interpolateZoom (translate, scale) {
                var self = this;
                return d3.transition().duration(350).tween("zoom", function () {
                    var iTranslate = d3.interpolate(zoom.translate(), translate),
                        iScale = d3.interpolate(zoom.scale(), scale);
                    return function (t) {
                        zoom
                            .scale(iScale(t))
                            .translate(iTranslate(t));
                            
                        nodesData.viewport.scale = iScale(t)
                        nodesData.viewport.translate = iTranslate(t)
                        
                        translateandrescale( nodesData.viewport )
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
                    view = {x: translate[0], y: translate[1], k: zoom.scale()};

                d3.event.preventDefault();
                direction = (this.id === 'zoom_in') ? 1 : ( (this.id === 'zoom_out')? -1:0 );
                target_zoom = zoom.scale() * (1 + factor * direction);

                if (target_zoom < extent[0] || target_zoom > extent[1]) { return false; }

                translate0 = [(center[0] - view.x) / view.k, (center[1] - view.y) / view.k];
                view.k = target_zoom;
                l = [translate0[0] * view.k + view.x, translate0[1] * view.k + view.y];

                view.x += center[0] - l[0];
                view.y += center[1] - l[1];

                interpolateZoom([view.x, view.y], view.k);
            }
            

        }
 
 
