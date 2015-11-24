angular.module('footballTaxApp')
  .directive("moneyTransfers", function() {
    return {
      restrict: 'AE',
      template: '<svg class="money-transfers"></svg>',
      scope: {
        moneyTransfers:"="
      },
      link: function(scope, element, attrs) {
        var data = {
          // Every entities in the graph
          nodes: _.chain(scope.moneyTransfers).reduce(function(res, transfer) {
            // Pluck several values
            for(let k of ['payer', 'beneficiary']) {
              res.push(transfer[k]);
            }
            return res;
          }, []).uniq().map(function(name) {
            return { name: name };
          }).value(),
          // Every links between elements
          links: []
        };
        // Links use node index to specify sources and targets
        data.links = _.chain(scope.moneyTransfers).map(function(transfer, idx) {
          // Payer is always the source
          transfer.source = _.findIndex(data.nodes, {name: transfer.payer});
          // And beneficiary the target
          transfer.target = _.findIndex(data.nodes, {name: transfer.beneficiary});
          // We have to ponderate the value of the link according to the amount.
          // Data use english format to express amount, we have to clean it.
          transfer.value = isNaN(transfer.amount) ? transfer.amount.replace(/€|,/gi, '') * 1 : transfer.amount;
          return transfer;
        // Sum values by source and target
        }).reduce(function(res, transfer) {
          // Skip transfer with no value
          if( transfer.value <= 0 ) return res;
          // Find existing link
          let link = _.find(res, {
            source: transfer.source,
            target: transfer.target
          });
          // Link not created yet
          if(!link) {

            // Add it to the final links list
            res.push({
              source: transfer.source,
              target: transfer.target,
              value:  transfer.value
            });
          // Add the current transfer amount to the existing link
        } else {
            link.value += transfer.value;
          }
          return res;
        }, []).value();

        // Some setup stuff.
        var width = element.width();
        var height = element.height();
        // SVG (group) to draw in.
        var svg = d3.select(element.find(".money-transfers")[0])
                .attr({ width: width, height: height })
                .append("g")
                .attr("transform", "translate(10, 20)");
        // Set up Sankey object.
        var sankey = d3.sankey()
                .nodeWidth(20)
                .nodePadding(35)
                .size([width - 20, height - 40])
                .nodes(data.nodes)
                .links(data.links)
                .layout(0);
        // Path data generator.
        var path = sankey.link();
        // Draw the links.
        var links = svg.append("g").selectAll(".link")
                .data(data.links)
                .enter()
                .append("path")
                .attr({ "class": "link", d: path })
                .style("stroke-width", function (d) {
                  return Math.max(1, d.dy);
                })
        links.append("title")
                .text(function (d) {
                  return d.source.name + " to " + d.target.name + " = " + d.value;
                });
        // Draw the nodes.
        var nodes = svg.append("g").selectAll(".node")
                .data(data.nodes)
                .enter()
                .append("g")
                .attr({
                  "class": "node",
                  transform: function (d) {
                    return "translate(" + d.x + "," + d.y + ")";
                  }
                });

        /* nodes.append("rect")
                .attr({
                  height: function (d) { return d.dy; },
                  width: sankey.nodeWidth()
                })
                .append("title")
                  .text(function (d) { return d.name; }); */

      nodes.append("polygon")
              .attr({
                points: function(d) {
                  return [
                    [0,0],
                    [sankey.nodeWidth(), 0],
                    [sankey.nodeWidth() + 10, d.dy/2],
                    [sankey.nodeWidth(), d.dy],
                    [0, d.dy],
                    [10, d.dy/2],
                  ].join(" ")
                },
                transform: function(d) {
                  let x = ( d.x > width/2 ? -1 : 0 ) * 10;
                  return 'translate(' + x + ', 0)'
                }
              })


        nodes.append("text")
                .attr({
                  x: function(d) {
                    return ( d.x > width/2 ? 1 : 0 ) * sankey.nodeWidth();
                  },
                  y: function (d) { return -10; },
                  dy: ".35em",
                  "text-anchor": function(d) {
                    return (d.x > width/2) ? "end" : "start";
                  },
                  transform: null
                })
                .text(function (d) { return d.name; });
      }
    };
  });
