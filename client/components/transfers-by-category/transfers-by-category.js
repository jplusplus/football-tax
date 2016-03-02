angular.module('footballTaxApp')
  .directive("transfersByCategory", function($window, $timeout, currencies, compute) {
    return {
      restrict: 'AE',
      template: '<svg class="transfers-by-category"></svg>',
      scope: {
        transfersByCategory:"=",
        category:"&",
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

        var categories = [];
        var data = {
          all: _.chain(compute.cleanAmount(scope.transfersByCategory))
                .filter( (transfer)=> {
                  return !isNaN(transfer.value) && !isNaN(transfer.date);
                }).each( (transfer)=> {
                  // Save the beneficiary for later
                  categories.push( transfer[ scope.category() ]);
                }).value()
        };
        // Collect categories from effective data
        data.categories = _.uniq(categories);
        // Data grouped by categories
        data.groups = compute.aggregate(data.all, scope.category());
        // Sort the array of group by total
        data.groups = _.sortBy(data.groups, 'total');
        // One color
        var color = "#086FA1";

        var initTimeout = null;
        var initAfterResize = ()=> {
          // Clear exisiting timeout
          if(initTimeout) $timeout.cancel(initTimeout);
          // Init the graph after the small
          initTimeout = $timeout(init, 300);
        }

        var init = ()=> {
          // Some setup stuff.
          const padding = { left: 20, right: 20, top: 20, bottom: 60 };
          const width = element.width();
          const height = 350;
          const mobileWidth = 720;
          const barSpace = width - padding.left - padding.right;
          const stackWidth = Math.min(barSpace / data.groups.length, 350);
          const barGap = stackWidth * (1/3);
          const barWidth = stackWidth * (2/3);
          const barMaxHeight = height - padding.top - padding.bottom;
          // Bar scale
          var y = d3.scale.linear()
                    .domain([0, _.max(data.groups, 'total').total ])
                    .range([0, barMaxHeight]);
          // Year scale
          var x = d3.scale.linear()
                    .domain([0, data.groups.length])
                    .range([padding.left, barSpace]);
          // Remove content for regeneration
          element.find(".transfers-by-category").empty();
          // SVG (group) to draw in.
          var svg = d3.select(element.find(".transfers-by-category")[0])
                  .attr({ width: width, height: height })
          // Create bars stacks
          var stacks = svg.selectAll(".stack")
                  .data(data.groups)
                  .enter()
                    .append('g')
                    .attr({
                      "class": "stack",
                      "transform": (d, i)=> {
                        let dy = padding.top + barMaxHeight - y(d.total);
                        let dx = x(i) + barGap/2;
                        return "translate(" + dx + "," + dy + " )";
                      }
                    });

          // A group for each bar
          stacks.append("title").text(d=> d.total);
          // Draw the rect into the bar's group
          stacks.append("rect")
            .attr({
              class: 'stack_bar_rect',
              width: barWidth,
              height: d=> y(d.total),
              fill: color
            });

          // Draw a label in every bar's group
          var ylabels = stacks.append("text")
                  .attr({
                    "class": (d, i)=> {
                      // Space between a rect and the previous one
                      let space = y(d.total) - y(d.prev);
                      return [
                        "ylabels",
                        space < 14 ? "ylabels-disabled" : ""
                      ].join(" ")
                    },
                    "text-anchor": "middle",
                    "dy": "1.15em",
                    "x": barWidth/2
                  })
                  .text(d => currencies.millions(d.total));

          var xlabels = svg.append("g")
                  .attr("class", "xlabels")
                    .selectAll(".xlabels_group")
                    .data(data.groups)
                    .enter()
                      .append("g")
                      .attr({
                        "class": "xlabels_group",
                        "transform": (d, i)=> {
                          let dx = x(i) + barWidth/2 + barGap/2;
                          let dy = barMaxHeight + padding.top;
                          return "translate(" + dx + "," + dy + ")"
                        }
                      })
                          .append("text")
                          .text(d => d.name)
                          .attr({
                            "text-anchor": "middle",
                            "class": "xlabels_group_text",
                            "dy": "1.35em"
                          })
                          .call(wrap, barWidth);

          // Enlarge the svg according to the legend height
          svg.attr({ height: barMaxHeight + svg.select(".xlabels").node().getBBox().height + padding.bottom });
        };

        init();
        // Creates a unique resize event
        var resizev = "resize:" + _.uniqueId();
        // Init the graph when the window is resized
        angular.element($window).on(resizev, initAfterResize);
        // Delete the resize event when destroying the scope
        scope.$on('$destroy', ()=> angular.element($window).off(resizev) );
      }
    };
  });
