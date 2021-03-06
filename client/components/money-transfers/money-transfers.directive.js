angular.module('footballTaxApp')
  .directive("moneyTransfers", function($window, $translate, $timeout, currencies) {
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
            // We have to ponderate the value of the link according to the amount.
            // Data use english format to express amount, we have to clean it.
            transfer.value = currencies.fromStr(transfer.amount);
            // Skip buguy value
            if( !isNaN(transfer.value) ) {
              // Pluck several values
              for(let k of ['payer', 'beneficiary']) {
                res.push(transfer[k]);
              }
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
          return transfer;
        // Sum values by source and target
        }).reduce(function(res, transfer) {
          // Skip transfer with no value
          if( transfer.value <= 0 || isNaN(transfer.value) ) return res;
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


        var initTimeout = null;
        var initAfterResize = ()=> {
          // Clear exisiting timeout
          if(initTimeout) $timeout.cancel(initTimeout);
          // Init the graph after the small
          initTimeout = $timeout(init, 300);
        }

        var init = function() {

          // Some setup stuff.
          var width = element.width();
          var height = element.height();
          // Remove content for regeneration
          element.find(".money-transfers").empty()
          // SVG (group) to draw in.
          var svg = d3.select(element.find(".money-transfers")[0])
                  .attr({ width: width, height: height })
                  .append("g")
                  .attr("transform", "translate(10, 20)");
          // Set up Sankey object.
          var sankey = d3.sankey()
                  .nodeWidth(50)
                  .nodePadding(35)
                  .size([width - 20, height - 40])
                  .nodes(data.nodes)
                  .links(data.links)
                  .layout(0);
          // Path data generator.
          var path = sankey.link();
          // Draw the links.
          var links = svg.selectAll(".link")
                  .data(data.links)
                  .enter()
                  .append("g")
                  .attr({ "class": "link" })
                  .append("path")
                  .attr({ "class": "link_path", d: path })
                  .style("stroke-width", function (d) {
                    return Math.max(1, d.dy);
                  });

          svg.selectAll(".link")
            .append("text")
            .attr({
              "class": "link_value",
              "text-anchor": "middle",
              "dy": ".35em",
              "x": function(d) {
                return (d.target.x - d.source.x)/2;
              },
              "y": function(d) {
                return ( (d.source.y + d.sy) + (d.target.y + d.ty + d.dy) ) / 2;
              }
            })
            .text(function(d) {
              return $translate.instant('AMOUNT_SPENT', { value: currencies.figuresFormat(d.value) });
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



          nodes.append("polygon")
                  .attr({
                    points: function(d) {
                      // Gap is lighter on small rect
                      let gap = Math.min(d.dy/10, 10)
                      return [
                        [0,0],
                        [sankey.nodeWidth(), 0],
                        [sankey.nodeWidth() + gap, d.dy/2],
                        [sankey.nodeWidth(), d.dy],
                        [0, d.dy],
                        [gap, d.dy/2],
                      ].join(" ")
                    },
                    transform: function(d) {
                      let x = ( d.x > width/2 ? -1 : 0 ) * 10;
                      return 'translate(' + x + ', 0)'
                    }
                  })


          nodes.append("text")
                  .attr({
                    "class": "node_value",
                    "x": function(d) {
                      return sankey.nodeWidth()/2;
                    },
                    "y": function(d) { return d.dy/2 },
                    "dy": ".35em",
                    "text-anchor": "middle",
                    "transform": function (d) {
                      // Gap is lighter on small rect
                      let gap = Math.min(d.dy/10, 10)
                      let x = ( d.x > width/2 ? -1 : 0 ) * 10 + gap;
                      return 'translate(' + x + ', 0)';
                    }
                  })
                  .text(function (d) {
                    return d.dy > 12 ? currencies.figuresFormat(d.value) : '';
                  });

          nodes.append("text")
                  .attr({
                    "class": "node_label",
                    "x": function(d) {
                      return ( d.x > width/2 ? 1 : 0 ) * sankey.nodeWidth();
                    },
                    "y": function (d) { return -10; },
                    "dy": ".35em",
                    "text-anchor": function(d) {
                      return (d.x > width/2) ? "end" : "start";
                    },
                    "transform": null
                  })
                  .text(function (d) { return d.name; });

        }

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
