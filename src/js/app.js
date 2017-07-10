(function (d3) {

    var MAX_CHART_POINTS = 10;

    var storedData = [];

    var margin = {
        top: 30,
        right: 30,
        bottom: 30,
        left: 50
    };

    var width = 700 - margin.left - margin.right,
        height = 360 - margin.top - margin.bottom;

    var parseDate = d3.timeParse('%Y-%m-%d');

    var xScale = d3.scaleTime().range([0, width]);
    var yScale = d3.scaleLinear().range([height, 0]);

    var xMax, xMin, yMax, yMin;

    var xAxis = d3.axisBottom(xScale)
        .ticks(5)
        .tickSizeInner(-height)
        .tickSizeOuter(0)
        .tickFormat(d3.timeFormat('%y.%m.%d'))
        .tickPadding(10);

    var yAxis = d3.axisLeft(yScale)
        .ticks(5)
        .tickSizeInner(-width)
        .tickSizeOuter(0)
        .tickPadding(10);

    var svg = d3.select('#chart-wrapper')
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    d3.csv('https://raw.githubusercontent.com/ArnoldSh/StockChartDemo/master/src/data/data.csv', function (error, data) {
        data.reverse().forEach(function (item) {
            storedData.push({
                'date': parseDate(item['Date']),
                'price': (+item['Close']),
                'spread': item['High'] - item['Low'],
                'volume': item['Volume'] / 1000
            });
        });
        initChart('month', 'price');
    });

    function initChart(timePeriod, valueType) {
        svg.selectAll('g').remove();

        var getSvgPathData = d3.line()
            .x(function (item) {
                return xScale(item['date']);
            })
            .y(function (item) {
                return yScale(item[valueType]);
            });

        var totalPoints =  timePeriod === 'week' ? 7 :
                            timePeriod === 'month' ? 30 :
                            timePeriod === 'quarter' ? 90 :
                            timePeriod === 'year' ? 365 :
                            timePeriod === 'max' ? storedData.length : 7;

        var freq = Math.floor(totalPoints / MAX_CHART_POINTS) === 0 ? 1 : Math.floor(totalPoints / MAX_CHART_POINTS);
        var sparseData = [];

        storedData.slice(0, totalPoints).forEach(function (item, index) {
            if (index % freq === 0) {
                sparseData.push(item);
            }
        });

        var bottomBound = d3.min(sparseData, function (item) {
                return item[valueType];
            }) * 1;

        var topBound = d3.max(sparseData, function (item) {
                return item[valueType];
            }) * 1;

        yMin = bottomBound;
        yMax = topBound;

        var timeBounds = d3.extent(sparseData, function (item) {
            return item['date'];
        });

        xMin = timeBounds[0];
        xMax = timeBounds[1];

        xScale.domain(timeBounds);
        yScale.domain([bottomBound, topBound]);

        var pathData = getSvgPathData(sparseData);

        svg.append('g')
            .attr('class', 'x axis')
            .attr('transform', 'translate(0,' + height + ')')
            .call(xAxis);

        svg.append('g')
            .attr('class', 'y axis')
            .call(yAxis);

        svg.append('g')
            .append('path')
            .attr('class', 'line')
            .attr('d', pathData);

        var points = svg.append('g');

        sparseData.forEach(function (item, index) {
            points.append('circle')
                .attr('class', 'point')
                .attr('cx', xScale(item['date']))
                .attr('cy', yScale(item[valueType]))
                .attr('r', '3')
                .attr('fill', 'steelblue');
        });

    }

    document.getElementById('time-period').addEventListener('change', function (event) {
        event.preventDefault();
        initChart(this.value, document.getElementById('value-type').value);
    });

    document.getElementById('value-type').addEventListener('change', function (event) {
        event.preventDefault();
        initChart(document.getElementById('time-period').value, this.value);
    });

})(d3);