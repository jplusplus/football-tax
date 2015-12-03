angular.module('footballTaxApp')
  .directive("transfersByYear", function($window, currencies, compute) {
    return {
      restrict: 'AE',
      template: '<svg class="transfers-by-year"></svg>',
      scope: {
        transfersByYear:"=",
        years:"=",
        subgroup: "&"
      },
      link: function(scope, element, attrs) {

        function wrap(text, width) {
          text.each(function() {
            var text = d3.select(this),
                words = text.text().split(/\s+/).reverse(),
                word,
                line = [],
                lineNumber = 0,
                lineHeight = 1.2, // ems
                y = text.attr("y"),
                dy = parseFloat(text.attr("dy")),
                tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");
            while (word = words.pop()) {
              line.push(word);
              tspan.text(line.join(" "));
              if (tspan.node().getComputedTextLength() > width) {
                line.pop();
                tspan.text(line.join(" "));
                line = [word];
                tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", lineHeight + "em").text(word);
              }
            }
          });
        }

        var groups = [];
        var data = {
          all: _.chain( compute.cleanAmount(scope.transfersByYear) )
                .filter( (transfer)=> {
                  return !isNaN(transfer.value) && !isNaN(transfer.date);
                }).each( (transfer)=> {
                  // Save the group for later
                  groups.push(transfer[ scope.subgroup() ]);
                }).value()
        };
        // Collect groups from effective data
        data.groups = _.uniq(groups);
        // Data by year
        data.years = _.chain(data.all)
                  .groupBy('date')
                  .reduce( (res, transfers, date)=> {
                    let year = {
                      date: date,
                      transfers: transfers,
                      // Data by group
                      groups: compute.aggregate( transfers, scope.subgroup() )
                    };
                    // Save the maximum value for this year
                    year.max = _.max(year.groups, 'total').total;
                    year.total = _.reduce(transfers, (res, d)=> res + d.value, 0);
                    // Save the previous total for each group
                    year.groups = _.each(year.groups, (d, i)=>{
                      d.prev = i === year.groups.length - 1 ? 0 : year.groups[i + 1].total;
                    });
                    res.push(year);
                    return res;
                  }, []).value();
        // List of year
        data.domain = scope.years || _.chain(data.years).pluck('date').sort().value();
        // Add missing years
        for( let year of scope.years || []) {
          let date = "" + year;
          // The year is missing
          if( !_.find(data.years, { date: date }) ) {
            // Add an empty one
            data.years.push({
              date: date,
              transfers: [],
              groups: [],
              max: 0,
              total: 0
            });
          }
        }
        // Sort the array of year.. by year!
        data.years = _.sortBy(data.years, 'date');
        // Should we use several colors?
        if( scope.subgroup() ) {
          // Color categories
          var color = d3.scale.ordinal()
                              .domain(data.groups)
                              .range([
                                "#7AB4D0",
                                "#086FA1",
                                "#00202F",
                                "#FFE363",
                                "#FFD100",
                                "#C5A100",
                                "#9B7F00"
                              ]);
        } else {
          // One color
          var color = ()=> "#086FA1";
        }

        var init = ()=> {
          // Some setup stuff.
          const padding = { left: 20, right: 20, top: 20, bottom: 60 };
          const width = element.width();
          const height = 350;
          const mobileWidth = 720;
          const barSpace = width - padding.left - padding.right;
          const stackWidth = Math.min(barSpace / scope.years.length, 350);
          const barGap = stackWidth * (1/3);
          const barWidth = stackWidth * (2/3);
          const barMaxHeight = height - padding.top - padding.bottom;
          // Bar scale
          var y = d3.scale.linear()
                    .domain([0, _.max(data.years, 'max').max ])
                    .range([0, barMaxHeight]);
          // Year scale
          var x = d3.scale.linear()
                    .domain([0, (scope.years || data.domain).length])
                    .range([padding.left, barSpace]);
          // Remove content for regeneration
          element.find(".transfers-by-year").empty();
          // SVG (group) to draw in.
          var svg = d3.select(element.find(".transfers-by-year")[0])
                  .attr({ width: width, height: height })
          // Create bars stacks
          var stacks = svg.selectAll(".stack")
                  .data(data.years)
                  .enter()
                    .append('g')
                    .attr('class', 'stack')
                    .attr('transform', (d, i)=> {
                      return 'translate(' + x(i) + ',  0)';
                    });
          // A group for each bar
          var bars = stacks.selectAll(".stack_bar")
                  // Non-stacked chart just contain one group
                  .data(d => scope.subgroup() ? d.groups : [ { total: d.total } ])
                  .enter()
                    .append("g")
                    .attr({
                      "class": "stack_bar",
                      "transform": d=> {
                        let dy = padding.top + barMaxHeight - y(d.total);
                        let dx = barGap/2;
                        return "translate(" + dx + "," + dy + " )";
                      }
                    });
          bars.append("title").text(d=> d.total);
          // Draw the rect into the bar's group
          bars.append("rect")
            .attr({
              class: 'stack_bar_rect',
              width: barWidth,
              height: d=> y(d.total),
              fill: d=> color(d.name)
            });

          // Draw a label in every bar's group
          var ylabels = bars.append("text")
                  .attr({
                    "class": (d, i)=> {
                      // Space between a rect and the previous one
                      let space = scope.subgroup() ? y(d.total) - y(d.prev) : y(d.total);
                      return [
                        "ylabels",
                        space < 14 ? "ylabels-disabled" : ""
                      ].join(" ")
                    },
                    "text-anchor": "middle",
                    "dy": "1.15em",
                    "x": barWidth/2
                  })
                  .text(d => currencies.figuresFormat(d.total));

          var xlabels = svg.append("g")
                  .attr("class", "xlabels")
                    .selectAll(".xlabels_text")
                    .data(data.years)
                    .enter()
                      .append("text")
                      .text(d => d.date)
                      .attr({
                        "text-anchor": "middle",
                        "class": d=> [
                          "xlabels_text",
                          d.groups.length ? "" : "xlabels_text-disabled"
                        ].join(" "),
                        "y": barMaxHeight + padding.top,
                        "x": (d, i)=> x(i) + barWidth/2 + barGap/2,
                        "dy": "1.35em"
                      });

          // Only stacked charts need a legend
          if( scope.subgroup() ) {

            var legends = svg.append("g")
                      .attr({
                        "class": "legend",
                        "transform": "translate(20, " + height + ")"
                      })
                      .selectAll(".legend_item")
                      .data(data.groups)
                      .enter()
                        .append("g")
                        .attr({
                          "class": "legend_item",
                        });

            legends.append("text")
                      .attr({
                        "class": "legend_item_label",
                        "text-anchor": "start",
                        "dy": "1em",
                        "transform": "translate(25, 0)"
                      })
                      .text(d => d)
                      .call(wrap, width > mobileWidth ? width*0.25 : mobileWidth);
            legends.append("rect")
                      .attr({
                        "class": "legend_item_square",
                        "width": 16,
                        "height": 16,
                        "y": 2,
                        "fill": color
                      });
            // Iterate over text elements
            var prevWidth =  0, prevHeight = 0;
            // Move existing element after they have been created
            legends.each(function(d, i) {
              let bbox = d3.select(this).node().getBBox();
              // Move every item but the first one
              if(i) {
                if(width > mobileWidth) {
                  d3.select(this).attr("transform", "translate(" + prevWidth + ", 0)");
                } else {
                  d3.select(this).attr("transform", "translate(0, " + prevHeight + ")");
                }
              }
              // Save the last bbox
              prevWidth  += bbox.width + 20
              prevHeight += bbox.height + 20
            });
            // Draw a line between the legend and the bars
            svg.append("line")
              .attr({
                class: "separator",
                x1: 0,
                y1: height - padding.top,
                x2: width,
                y2: height - padding.top
              })
            // Enlarge the svg according to the legend height
            svg.attr({ height: height + svg.select(".legend").node().getBBox().height + padding.top })
          }
        };

        init();
        angular.element($window).bind("resize", init);
      }
    };
  });
