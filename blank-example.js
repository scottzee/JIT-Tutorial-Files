var labelType, useGradients, nativeTextSupport, animate;

(function() {
  var ua = navigator.userAgent,
      iStuff = ua.match(/iPhone/i) || ua.match(/iPad/i),
      typeOfCanvas = typeof HTMLCanvasElement,
      nativeCanvasSupport = (typeOfCanvas == 'object' || typeOfCanvas == 'function'),
      textSupport = nativeCanvasSupport 
        && (typeof document.createElement('canvas').getContext('2d').fillText == 'function');
  //I'm setting this based on the fact that ExCanvas provides text support for IE
  //and that as of today iPhone/iPad current text support is lame
  labelType = (!nativeCanvasSupport || (textSupport && !iStuff))? 'Native' : 'HTML';
  nativeTextSupport = labelType == 'Native';
  useGradients = nativeCanvasSupport;
  animate = !(iStuff || !nativeCanvasSupport);
})();

var Log = {
  elem: false,
  write: function(text){
    if (!this.elem) 
      this.elem = document.getElementById('log');
    this.elem.innerHTML = text;
    this.elem.style.left = (500 - this.elem.offsetWidth / 2) + 'px';
  }
};


function init(){
    //init data
    var json = {
        id: "190_0",
        name: "root",
        children: [{
            id: "306208_1",
            name: "blank-one",
            data: {
                relation: "<h1>content here</h1><p>More content here</p>"
            },
            children: [{
                id: "BC1-1",
                name: "Blank Child One",
                data: {
                    relation: "<h1>content here</h1><p>More content here</p>"
                },
                children: []
            },{
                id: "BC2-1",
                name: "Blank Child Two",
                data: {
                    relation: "<h4>Candlebox</h4><b>Connections:</b><ul><li>Dave Krusen <div>(relation: member of band)</div></li></ul>"
                },
                children: []
            }],
        }, {
            id: "107877_3",
            name: "blank-two",
            data: {
                relation: "<h1>content here</h1><p>More content here</p>"
            },
            children: [{
                id: "BC1-2",
                name: "Blank Child One",
                data: {
                    relation: "<h1>content here</h1><p>More content here</p>"
                },
                children: []
            },{
                id: "BC2-2",
                name: "Blank Child Two",
                data: {
                    relation: "<h1>content here</h1><p>More content here</p>"
                },
                children: []
            }]
        }, {
            id: "236594_38",
            name: "blank-three",
            data: {
                relation: "<h2>Independent Libraries</h2><p>Independent, privately-supported research libraries. Please hold criticism of these categories, this is really just for a demo.</p>"
            },
            children: [{
                id: "BC3-1",
                name: "Blank Child One",
                data: {
                    relation: ""
                },
                children: []
            },{
                id: "BC3-2",
                name: "Blank Child Two",
                data: {
                    relation: ""
                },
                children: []
            }]
        }, ],
        data: {
            relation: "<h2>Philadelphia Area Consortium of Special Collections Libraries (PACSCL)</h2><p>The thirty-five member libraries and archives of the Philadelphia Area Consortium of Special Collections Libraries (PACSCL) collect, care for, and share with a world-wide audience collections that, in their depth and variety, comprise an internationally important body of unique materials for students, scholars and lifelong learners at any level. </p>"
        }
    };
    //end
    
    //init RGraph
    var rgraph = new $jit.RGraph({
        //Where to append the visualization
        injectInto: 'infovis',
        //Optional: create a background canvas that plots
        //concentric circles.
        background: {
          CanvasStyles: {
            strokeStyle: '#555'
          }
        },
        //Add navigation capabilities:
        //zooming by scrolling and panning.
        Navigation: {
          enable: true,
          panning: true,
          zooming: 10
        },
        //Set Node and Edge styles.
        Node: {
            color: '#ddeeff'
        },
        
        Edge: {
          color: '#C17878',
          lineWidth:1.5
        },

        onBeforeCompute: function(node){
            Log.write("centering " + node.name + "...");
            //Add the relation list in the right column.
            //This list is taken from the data property of each JSON node.
            $jit.id('inner-details').innerHTML = node.data.relation;
        },
        
        //Add the name of the node in the correponding label
        //and a click handler to move the graph.
        //This method is called once, on label creation.
        onCreateLabel: function(domElement, node){
            domElement.innerHTML = node.name;
            domElement.onclick = function(){
                rgraph.onClick(node.id, {
                    onComplete: function() {
                        Log.write("done");
                    }
                });
            };
        },
        //Change some label dom properties.
        //This method is called each time a label is plotted.
        onPlaceLabel: function(domElement, node){
            var style = domElement.style;
            style.display = '';
            style.cursor = 'pointer';

            if (node._depth <= 1) {
                style.fontSize = "0.8em";
                style.color = "#ccc";
            
            } else if(node._depth == 2){
                style.fontSize = "0.7em";
                style.color = "#494949";
            
            } else {
                style.display = 'none';
            }

            var left = parseInt(style.left);
            var w = domElement.offsetWidth;
            style.left = (left - w / 2) + 'px';
        }
    });
    //load JSON data
    rgraph.loadJSON(json);
    //trigger small animation
    rgraph.graph.eachNode(function(n) {
      var pos = n.getPos();
      pos.setc(-200, -200);
    });
    rgraph.compute('end');
    rgraph.fx.animate({
      modes:['polar'],
      duration: 2000
    });
    //end
    //append information about the root relations in the right column
    $jit.id('inner-details').innerHTML = rgraph.graph.getNode(rgraph.root).data.relation;
}
