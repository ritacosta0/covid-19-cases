const dots = d3.select(".dots");

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
    
    for (var i = 0; i < data.length; i++) {
      position = data.length - 2;
      casesBeforeLast = data[position].óbitos;
      caseLast = data[data.length - 1].óbitos;
      diffDay = caseLast - casesBeforeLast;
    }
    const diffFrom = d3.select(".diff-from-last");
    diffFrom.text(diffDay);

    let globalTotal = 0;
    for (var i = 0; i < data.length; i++) {
      globalTotal = data[data.length - 1].confirmados;
    }
    const totalCases = d3.select(".total-cases");
    totalCases.text(globalTotal);

    const obitos = data.map(function (d) {
      return +d.obitos;
    });
    const maxObitos = d3.max(obitos);
    const arrayMaxObitos = d3.range(maxObitos);

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

    d3
      .select("#selectButton")
      .selectAll("myOptions")
      .data(namesInSelectButton)
      .enter()
      .append("option")
      .text(function (d) {
        return d;
      })
      .attr("value", function (d) {
        return d;
      }) /
      dots
        .selectAll(".point")
        .data(arrayMaxObitos)
        .enter()
        .append("div")
        .attr("class", "point")
        .style("background-color", (d) =>
          d >= casesBeforeLast ? "#90e0ef" : "#d3d3d3"
        );

    let displayValueOnScroll = 0;
    let element = "";
    document.addEventListener("scroll", function (e) {
      const scrollTop =
        document.documentElement["scrollTop"] || document.body["scrollTop"];
      const scrollBottom =
        (document.documentElement["scrollHeight"] ||
          document.body["scrollHeight"]) -
        document.documentElement.clientHeight;

      const scrollPercent = scrollTop / scrollBottom;
      if (scrollPercent > 0.95) displayValueOnScroll = maxObitos;
      if (scrollPercent < 0.95)
        displayValueOnScroll = scrollPercent * maxObitos;
      element = d3.select(".progress");
      element.text(d3.format(".0f")(displayValueOnScroll));
    });
    if (
      document.body["scrollHeight"] - document.documentElement.clientHeight <
      0
    )
      displayValueOnScroll = maxObitos;
    element = d3.select(".progress");
    element.text(d3.format(".0f")(displayValueOnScroll));

    function update(selectedVar) {
      for (var i = 0; i < data.length; i++) {
        position = data.length - 2;
        casesBeforeLast = data[position][selectedVar];
        caseLast = data[data.length - 1][selectedVar];
        diffDay = caseLast - casesBeforeLast;
      }

      const selectedFirst = d3.select(".selected-first");
      if (selectedVar.includes("obitos_"))
        selectedFirst.text("óbitos")
      if (selectedVar.includes("confirmados_")) 
        selectedFirst.text("casos")
      else if (!selectedVar.includes("_"))
        selectedFirst.text(selectedVar)

      const upDown = d3.select(".up-or-down");
      if (diffDay == 0)
        upDown.text(" ")
      if (diffDay > 0)
        upDown.text("mais");

      const diffFrom = d3.select(".diff-from-last");
      diffFrom.text(diffDay);

      const filteredArray = data.map(function (d) {
        return +d[selectedVar];
      });

      const maxSelectedVar = d3.max(filteredArray);
      const maxInFilteredArray = d3.range(maxSelectedVar);

      // const halfArray = Math.ceil(maxSelectedVar.length / 2);    

      // const firstHalf = maxInFilteredArray.splice(0, halfArray)
      // const secondHalf = maxInFilteredArray.splice(-halfArray)

      dots.selectAll(".point").remove();

      dots
        .selectAll(".point")
        .data(maxInFilteredArray)
        .enter()
        .append("div")
        .attr("class", "point")
        .transition()
        .delay(100)
        .style("background-color", (d) =>
          d >= casesBeforeLast ? "#90e0ef" : "#d3d3d3"
        );

      let displayValueOnScroll = 0;
      let element = "";
      document.addEventListener("scroll", function () {
        const scrollTop =
          document.documentElement["scrollTop"] || document.body["scrollTop"];
        const scrollBottom =
          (document.documentElement["scrollHeight"] ||
            document.body["scrollHeight"]) -
          document.documentElement.clientHeight;
        const scrollPercent = scrollTop / scrollBottom;
        if (scrollPercent > 0.95) displayValueOnScroll = maxSelectedVar;
        if (scrollPercent < 0.95)
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

  }
  d3.select("#selectButton").on("change", function (d) {
    var selectedOption = d3.select(this).property("value");
    update(selectedOption);
  });

  }
);
