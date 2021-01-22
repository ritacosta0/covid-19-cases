// button to update data
const namesInSelectButton = [
  "óbitos",
  "confirmados",
  "recuperados",
  "confirmados_arsnorte",
  "confirmados_arscentro",
  "confirmados_arslvt",
  "confirmados_arsalentejo",
  "confirmados_arsalgarve",
  "confirmados_acores",
  "confirmados_madeira",
  "obitos_arsnorte",
  "obitos_arscentro",
  "obitos_arslvt",
  "obitos_arsalentejo",
  "obitos_arsalgarve",
  "obitos_acores",
  "obitos_madeira",
];

d3.select(".selectButton")
  .selectAll("myOptions")
  .data(namesInSelectButton)
  .enter()
  .append("option")
  .text(function (d) {
    return d;
  })
  .attr("value", function (d) {
    return d;
  });

// create variables to adapt to screen width

let squareSize = 0;
let squaresInRow = 0;
let heightMultiplier = 0;
let groupSpacing = 0;
let heightMultiplierSelectedVar = 0;
let width_ = 0;

if (window.innerWidth < 500) {
  squareSize = 3;
  squaresInRow = 77;
  heightMultiplier = 4.6;
  groupSpacing = .95;
  heightMultiplierSelectedVar = 4.45;
  width_ = window.innerWidth - 100;

} else {
  squareSize = 6;
  squaresInRow = 130;
  heightMultiplier = 8;
  groupSpacing = 0.5;
  heightMultiplierSelectedVar = 8;
  width_ = 1055;
}

const width = width_;
let height = 0;

const canvas = d3
  .select("#container")
  .append("canvas")
  .attr("width", width)
  .attr("height", height)
  .style("width", 75 + "%")
  .style("border-width", 0 + "px")
  .style("display", "inline");

const context = canvas.node().getContext("2d");

d3.csv(
  "https://raw.githubusercontent.com/dssg-pt/covid19pt-data/master/data.csv",
  function (data) {
    data.forEach(function (d) {
      d.óbitos = +d.obitos;
    });
    let casesBeforeLast = 0;
    let position = [];
    let caseLast = 0;
    let diffDay = 0;

    for (let i = 0; i < data.length; i++) {
      position = data.length - 2;
      casesBeforeLast = data[position].óbitos;
      caseLast = data[data.length - 1].óbitos;
      diffDay = caseLast - casesBeforeLast;
    }
    const diffFrom = d3.select(".diff-from-last");
    diffFrom.text(diffDay);

    let globalTotal = 0;
    for (let i = 0; i < data.length; i++) {
      globalTotal = data[data.length - 1].confirmados;
    }
    const totalCases = d3.select(".total-cases");
    totalCases.text(globalTotal);

    const obitos = data.map(function (d) {
      return +d.obitos;
    });
    const maxObitos = d3.max(obitos);
    const arrayMaxObitos = d3.range(maxObitos);

    if (maxObitos < 50) height = 100;
    else
      height =
        heightMultiplier * Math.ceil(maxObitos / squaresInRow) +
        0.5 * (maxObitos / squaresInRow);
    canvas.attr("height", height);

    let displayValueOnScroll = 0;
    let element = "";
    document.addEventListener("scroll", function () {
      let scrollTop =
        document.documentElement["scrollTop"] || document.body["scrollTop"];
      let scrollBottom =
        (document.documentElement["scrollHeight"] ||
          document.body["scrollHeight"]) -
        document.documentElement.clientHeight;
      let scrollPercent = scrollTop / scrollBottom;

      if (scrollPercent > 0.95) displayValueOnScroll = maxObitos;
      if (scrollPercent < 0.95 - 0.1)
        displayValueOnScroll = scrollPercent * maxObitos;

      if (
        document.body["scrollHeight"] - document.documentElement.clientHeight <
        0
      )
        displayValueOnScroll = maxObitos;

      element = d3.select(".progress");
      element.text(d3.format(".0f")(displayValueOnScroll));
      if (displayValueOnScroll > 3) element.style("visibility", "visible");
      if (displayValueOnScroll < 3 && window.innerWidth < 500)
        element.style("visibility", "hidden");
    });

    const customBase = document.createElement("custom");
    const custom = d3.select(customBase);

    const cellSize = Math.floor((width * groupSpacing) / 60);

    databind(arrayMaxObitos);

    draw();

    function databind(data) {
      const join = custom.selectAll("custom.rect").data(data);

      const enterSel = join
        .enter()
        .append("custom")
        .attr("class", "rect")
        .attr("x", function (d, i) {
          const x0 = 0;
          const x1 = Math.floor(i % squaresInRow);
          return groupSpacing * x0 + cellSize * (x1 + x0 * 10);
        })
        .attr("y", function (d, i) {
          const y0 = Math.floor(i / squaresInRow);
          const y1 = Math.floor((i % 100) / 100);
          return groupSpacing * y0 + cellSize * (y1 + y0);
        })
        .attr("width", 0)
        .attr("height", 0);

      join
        .merge(enterSel)
        // .transition()
        .attr("width", squareSize)
        .attr("height", squareSize)
        .attr("fillStyle", (d) =>
          d >= casesBeforeLast ? "#90e0ef" : "#d3d3d3"
        );

      const exitSel = join.exit().attr("width", 0).attr("height", 0).remove();
    }

    function draw() {
      context.fillStyle = "#fff";
      context.fillRect(0, 0, width, height);

      const elements = custom.selectAll("custom.rect");

      elements.each(function (d, i) {
        const node = d3.select(this);
        context.fillStyle = node.attr("fillStyle");

        context.fillRect(
          node.attr("x"),
          node.attr("y"),
          node.attr("width"),
          node.attr("height")
        );
      });
    }

    d3.select(".selectButton").on("change", function (d) {
      const selectedOption = d3.select(this).property("value");
      const filteredArray = data.map(function (d) {
        return +d[selectedOption];
      });

      const maxSelectedVar = d3.max(filteredArray);
      const maxInFilteredArray = d3.range(maxSelectedVar);
      for (var i = 0; i < data.length; i++) {
        position = data.length - 2;
        casesBeforeLast = data[position][selectedOption];
        caseLast = data[data.length - 1][selectedOption];
        diffDay = caseLast - casesBeforeLast;
      }
      const selectedFirst = d3.select(".selected-first");
      if (selectedOption.includes("obitos_")) selectedFirst.text("óbitos");
      if (selectedOption.includes("confirmados")) selectedFirst.text("casos");
      else if (!selectedOption.includes("_"))
        selectedFirst.text(selectedOption);

      const upDown = d3.select(".up-or-down");
      if (diffDay == 0) upDown.text(" ");
      if (diffDay > 0) upDown.text("mais");

      const diffFrom = d3.select(".diff-from-last");
      diffFrom.text(diffDay);

      if (maxSelectedVar < 50) height = 100;
      else
        height =
          heightMultiplierSelectedVar *
            Math.ceil(maxSelectedVar / squaresInRow) +
          0.5 * (maxSelectedVar / squaresInRow);

      canvas.attr("height", height);

      let displayValueOnScroll = 0;
      let element = "";
      document.addEventListener("scroll", function () {
        let scrollTop =
          document.documentElement["scrollTop"] || document.body["scrollTop"];
        let scrollBottom =
          (document.documentElement["scrollHeight"] ||
            document.body["scrollHeight"]) -
          document.documentElement.clientHeight;
        let scrollPercent = scrollTop / scrollBottom;

        if (scrollPercent > 0.95) displayValueOnScroll = maxSelectedVar;
        if (scrollPercent < 0.95 - 0.1)
          displayValueOnScroll = scrollPercent * maxSelectedVar;
        element = d3.select(".progress");
        element.text(d3.format(".0f")(displayValueOnScroll));
      });

      if (
        document.body["scrollHeight"] - document.documentElement.clientHeight <
        0
      )
        displayValueOnScroll = maxSelectedVar;
      element = d3.select(".progress");
      element.text(d3.format(".0f")(displayValueOnScroll));
      if (displayValueOnScroll > 1) element.style("visibility", "visible");
      if (displayValueOnScroll < 1 && window.innerWidth < 500)
        element.style("visibility", "hidden");

      if (
        document.body["scrollHeight"] - document.documentElement.clientHeight <
        0
      )
        d3.select(".scroll-sign").style("visibility", "hidden");
      else d3.select(".scroll-sign").style("visibility", "visible");

      databind(maxInFilteredArray);
      draw();
    });
  }
);
