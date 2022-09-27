
var someDataold = [
  {"startVal": 149677, "endVal": 169406, "name": "Nrps"}, 
  {"startVal": 27622, "endVal": 53984, "name": "Nrps" }, 
  {"startVal": 56852,"endVal": 69563, "name":"Nrps"},  
  {"startVal": 54423, "endVal":56400, "name":"Bacteriocin"}, 
  {"startVal":171657, "endVal": 185522, "name":"Bacteriocin"},
  {"startVal":199033,"endVal": 212746,"name": "Siderophore"},
  {"startVal":5363, "endVal": 14350, "name":"Bacteriocin"},
  {"startVal":85565, "endVal": 120694, "name":"Other"},
  {"startVal":70373, "endVal": 84757, "name":"Lantipeptide"},
  {"startVal":188035, "endVal": 194913, "name":"Bacteriocin"},
  {"startVal":127139, "endVal": 148992, "name":"Terpene"},
  {"startVal":14278,"endVal": 26623,"name": "Lassopeptide"},
  {"startVal":0,"endVal": 4362,"name": "Nrps"}
] 
  someDataold.sort(function(a,b){ return a.endVal - b.endVal});

  var someDatanew = 
[
      {"startVal": 0 , "endVal": 0 , "name" : "" },
      {"startVal": 0 , "endVal": 0 , "name" : "" },
      {"startVal": 0 , "endVal": 0 , "name" : "" },
      {"startVal": 0 , "endVal": 0 , "name" : "" },
      {"startVal": 0 , "endVal": 0 , "name" : "" },
      {"startVal": 0 , "endVal": 0 , "name" : "" },
      {"startVal": 0 , "endVal": 0 , "name" : "" },
      {"startVal": 0 , "endVal": 0 , "name" : "" },
      {"startVal": 0 , "endVal": 0 , "name" : "" },
      {"startVal": 0 , "endVal": 0 , "name" : "" },
      {"startVal": 0 , "endVal": 0 , "name" : "" },
      {"startVal": 0 , "endVal": 0 , "name" : "" },
      {"startVal": 0 , "endVal": 0 , "name" : "" } 
];
console.log(someDatanew)
  /** Finds null spaces between each set of coordinates, pushes it into the new array.

      Empty is the width of each coordinate, empty = endVal-startVal **/

  var i, j;
  for(i=0; i<someDataold.length;i++)
  {
    someDataold[i].emtpy = someDataold[i].endVal - someDataold[i].startVal;
    someDatanew[i].startVal = someDataold[i].endVal +1 ;
    
    if(i<someDataold.length-1)
    {
      someDatanew[i].endVal = someDataold[i+1].startVal -1 ;
    }

    someDatanew[i].name = "Null zone"
    someDatanew[i].emtpy = someDatanew[i].endVal - someDatanew[i].startVal
  }

  
  
  // Both the arrays are merged into someData. ONLY someData is used for arc generation
  var someData = someDataold.concat(someDatanew)
  someData.sort(function(a,b){ return a.endVal - b.endVal});
  
  
  console.log(someData)



drawChart(someData);

//takes data from array
function drawChart(data) 
{
  
        data.forEach(function(d) 
        {
          d.name= d.name;
          d.endVal = +d.endVal;
          d.startVal = +d.startVal
          d.emtpy = +d.emtpy
          d.enabled = true;
          
        });

        // Margin, Width, Radius setup
        var startVal = d3.set(data.map(function(d) { return d.startVal; }))
        var endVal = d3.set(data.map(function(d) { return d.endVal; }))
        var name = d3.select(data.map(function(d) {return d.name}))
        var size = Object.keys(startVal).length;
        var width = 430;
        var height = 430;
        var radius = Math.min(width, height) / 2;
        var donutWidth = 80;


        // Legend setup
        var y_domain = d3.extent(someData, function(d) { return d.name; });
        var legendSpacing = 8;
        var legendHeight = radius * 2 - donutWidth * 2
        var legendScale = d3.scaleBand()
        .domain(startVal.values()) //Not displayed.
        .rangeRound([legendHeight,0])
       
       
        var legendRectSize = legendScale.bandwidth();
        
        
        var colorScale = d3.scaleOrdinal()
          .range([
            'darkgrey','brown', 'darkgrey', 'darkgrey', 'yellowgreen', 'darkgoldenrod', 'darkgrey',
            'brown', 'darkgrey', 'yellowgreen', 'darkgrey', 'brown', 'darkgrey', 'sandybrown',
            "darkgrey", "orange", 'darkgrey', "darkkhaki", 'darkgrey', "brown", "darkgrey",
            "yellowgreen", 'darkgrey', "yellowgreen", 'darkgrey', 'chocolate'
        
        
        ])
        
        var svg = d3.select('#dount-chart')
          .append('svg')
          .attr('width', width)
          .attr('height', height)
          .append('g')
          .attr('transform', 'translate(' + (width / 2) +
            ',' + (height / 2) + ')');

         // Arc generation
        var arc = d3.arc()
          .innerRadius(radius - 50)
          .outerRadius(radius);

        
        var pie = d3.pie()
          .value(function(d) { return d.emtpy; }) 
          .sort(null)
          .startAngle(0)
          .endAngle(1.95 * Math.PI)  // Makes the donut like pdf. endAngle is approximated
          

          // Appending text for mouseover display
        var tooltip = d3.select('#dount-chart')
          .append('div')
          .attr('class', 'tooltip');
        tooltip.append('div')
          .attr('class', 'startVal');
        tooltip.append('div')
          .attr('class', 'endVal');
          tooltip.append('div')
          .attr('class', 'name');
        tooltip.append('div')
          .attr('class', 'percent'); 
         
        var path = svg.selectAll('path')
          .data(pie(data))
          .enter()
          .append('path')
          .attr('d', arc)
          .attr('fill', function(d) {
            return colorScale(d.data.startVal);
          })
          .each(function(d) { this._current = d; });
        path.on('mouseover', function(d) {
            var total = d3.sum(data.map(function(d) {
              return (d.enabled) ? d.endVal : 0;
            }));

            // Displaying mouseover text
            var percent = Math.round(1000 * d.data.emtpy / total) / 25;
            tooltip.select('.name').html('Name: ' + d.data.name);
            tooltip.select('.startVal').html('Start Value: ' + d.data.startVal);
            tooltip.select('.endVal').html('End Value: ' + d.data.endVal);
            tooltip.select('.percent').html(percent + '%');
            tooltip.style('display', 'block');
          });
          path.on('mouseout', function() {
            tooltip.style('display', 'none');
          });

          var legend = d3.select("svg").append("g")
          .attr("transform","translate(" +width/2+","   + (radius/2.3 - legendScale.bandwidth()) + ")" )
          .selectAll('.legend')
            .data(colorScale.domain())
            .enter()
            .append('g')
            .attr('class', 'legend')
            .attr('transform', function(d, i) {
              var horz = 0;
              
              var vert = legendScale(d);
             
              return 'translate(' + horz + ',' + vert + ')';
            });

          legend.append('rect')
          .attr('width', legendRectSize)
          .attr('height', legendRectSize)
          .style('fill', colorScale)
          .style('stroke', colorScale)
          .on('click', function(startVal) {
          var rect = d3.select(this);
          var enabled = true;
          var totalEnabled = d3.sum(data.map(function(d) {
            return (d.enabled) ? 1 : 0;
          }));
          if (rect.attr('class') === 'disabled') {
            rect.attr('class', '');
          } else {
            if (totalEnabled < 2) return;
            rect.attr('class', 'disabled');
            enabled = false;
          }
          pie.value(function(d) {
            if (d.startVal === startVal) d.enabled = enabled;
            return (d.enabled) ? d.endVal : 0;
          });
          path = path.data(pie(data));
          path.transition()
            .duration(1500)
            .attrTween('d', function(d) {
              var interpolate = d3.interpolate(this._current, d);
              this._current = interpolate(0);
              return function(t) {
                return arc(interpolate(t));
              };
            });
        });
        legend.append('text')
          .attr('x', legendRectSize + legendSpacing)
          .attr('y', legendRectSize - legendSpacing)
          
}