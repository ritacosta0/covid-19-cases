const dots = d3.select('.dots');


d3.csv("https://raw.githubusercontent.com/dssg-pt/covid19pt-data/master/data.csv", function(data) {


    data.forEach(function(d) {
        d.confirmados = +d.confirmados;
     });
    const max = d3.max(data, function(d) { return d.confirmados; })
    const total = d3.range(max);
    
    dots
    .selectAll("circle")
    .data(total)
    .enter()
    .append("div")
    .attr("class", "point")
	.style('background-color', d => (d > 446606	 ? '#FE4A49' : '#CCCCCC'));

    })

