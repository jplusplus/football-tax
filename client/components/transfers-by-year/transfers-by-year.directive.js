angular.module('footballTaxApp')
  .directive("transferByYear", function($window, $translate) {
    return {
      restrict: 'AE',
      template: '<svg class="transfers-by-year"></svg>',
      scope: {
        transferByYear:"=",
        years:"=",
      },
      link: function(scope, element, attrs) {

        var beneficiaries = [];
        var data = {
          all: _.chain(scope.transferByYear).map( (transfer)=> {
            transfer.value = (transfer.amount + "").replace(/€|,/gi, '') * 1;
            return transfer;
          }).filter( (transfer)=> {
            return !isNaN(transfer.value) && !isNaN(transfer.date);
          }).each( (transfer)=> {
            // Save the beneficiary for later
            beneficiaries.push(transfer.beneficiary);
          }).value()
        };
        // Collect beneficiaries from effective data
        data.beneficiaries = _.uniq(beneficiaries);
        // Data by year
        data.years = _.chain(data.all)
                  .groupBy('date')
                  .reduce( (res, transfers, date)=> {
                    let year = {
                      date: date,
                      transfers: transfers,
                      // Data by beneficiary
                      beneficiaries: _.chain(transfers)
                        .groupBy('beneficiary')
                        .reduce( (res, transfers, beneficiary)=> {
                          res.push({
                            name: beneficiary,
                            transfers: transfers,
                            total: _.reduce(transfers, (res, d)=> res + d.value, 0)
                          });
                          return res;
                        }, [])
                        .sortBy(d => -d.total)
                        .value()
                    };
                    // Save the maximum value for this year
                    year.max = _.max(year.beneficiaries, 'total').total;
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
              beneficiaries: [],
              max: 0
            });
          }
        }
        // Sort the array of year.. by year!
        data.years = _.sortBy(data.years, 'date');
        // Color categories
        var color = d3.scale.category20b().domain(data.beneficiaries);

        var init = ()=> {
          // Some setup stuff.
          var padding = { left: 20, right: 20, top: 20, bottom: 40 };
          var width = element.width();
          var height = 350;
          var barSpace = width - padding.left - padding.right;
          var stackWidth = Math.min(barSpace / scope.years.length, 350);
          var barGap = stackWidth * (1/3);
          var barWidth = stackWidth * (2/3);
          var barMaxHeight = height - padding.top - padding.bottom;
          // Bar scale
          var y = d3.scale.linear()
                    .domain([0, _.max(data.years, 'max').max ])
                    .range([padding.top, barMaxHeight]);
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

          var bars = stacks.selectAll(".stack_bar")
                  .data(d => d.beneficiaries)
                  .enter()
                    .append("rect")
                    .attr({
                      y: d=> padding.top + barMaxHeight - y(d.total),
                      x: barGap/2,
                      class: 'stack_bar',
                      width: barWidth,
                      height: d=> y(d.total),
                      fill: d=> color(d.name)
                    });

          var xlabels = svg.append("g")
                  .attr("class", "xlabels")
                    .selectAll(".xlabels_text")
                    .data(data.years)
                    .enter()
                      .append("text")
                      .text(d => d.date)
                      .attr({
                        "text-anchor": "middle",
                        "class": "xlabels_text",
                        "y": barMaxHeight + padding.top,
                        "x": (d, i)=> x(i) + barWidth/2 + barGap/2,
                        "dy": "1.35em"
                      });
        };

        init();
        angular.element($window).bind("resize", init);
      }
    };
  });
