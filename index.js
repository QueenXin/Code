// 假设有一个名为 china_population_data.json 的 JSON 文件，包含了每个省份近几年的人口数量数据
const dataUrl = 'china_population_data.json';

// 用于存储各省份当前年份的人口数量
let currentPopulationData;

// 初始化地图
const width = 1600;
const height = 900;

const svg = d3.select("#map-container")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

// 使用投影函数将地理坐标转换为屏幕坐标
const projection = d3.geoMercator()
    .center([105, 38])
    .scale(800)
    .translate([width / 2, height / 2]);

const path = d3.geoPath().projection(projection);

// 加载中国地图的 GeoJSON 数据
d3.json("china.geojson").then(function (china) {
    // 绘制省份的路径，并设置初始颜色
    svg.selectAll("path")
        .data(china.features)
        .enter().append("path")
        .attr("d", path)
        .style("fill", function (d) {
            const provinceName = d.properties.name;
            const population = currentPopulationData[provinceName] || 0;
            return getColor(population); // 根据人口数量获取颜色
        });
    
    // 创建年份选择框
    const years = [2021, 2020, 2019]; // 根据实际情况调整年份
    d3.select("#year")
        .selectAll("option")
        .data(years)
        .enter().append("option")
        .attr("value", d => d)
        .text(d => d);

    // 初始化地图
    updateMap();
});

// 根据人口数量获取颜色，可以根据实际情况调整颜色比例
function getColor(population) {
    // 这里简单地使用一个线性比例尺
    const colorScale = d3.scaleLinear()
        .domain([0, d3.max(Object.values(currentPopulationData))])
        .range(["lightgray", "darkred"]);

    return colorScale(population);
}

// 更新地图
function updateMap() {
    const selectedYear = +d3.select("#year").property("value");
    
    // 假设数据格式为 { "province1": { "2021": 1000000, "2020": 900000, ... }, "province2": { ... }, ... }
    d3.json(dataUrl).then(function (data) {
        currentPopulationData = data;

        svg.selectAll("path")
            .style("fill", function (d) {
                const provinceName = d.properties.name;
                const population = currentPopulationData[provinceName] ? currentPopulationData[provinceName][selectedYear] || 0 : 0;
                return getColor(population);
            });
    });
}
