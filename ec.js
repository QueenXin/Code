var ROOT_PATH = "https://echarts.apache.org/examples";

var chartDom = document.getElementById("main");
var myChart = echarts.init(chartDom);
var option;

function updateMap(year) {
	myChart.setOption({
		series: [
			{
				data: populationData[year],
			},
		],
	});
}

function showPopulationBarChart_2000() {
    var year = getCurrentYear(); // 获取当前选定的年份
    var data = populationData[year]; // 获取对应年份的人口数据

    var barChart = echarts.init(document.getElementById("barChart"));

    // 配置柱形图的选项
    var barOption = {
        title: {
            text: year + "年中国大陆人口数据柱形图",
            left: "center",
        },
        tooltip: {
            trigger: "axis",
            axisPointer: {
                type: "shadow", // 鼠标悬停时的样式
            },
        },
        xAxis: {
            type: "category",
            data: data.map(function (item) {
                return item.name;
            }),
            axisLabel: {
                interval: 0, // 强制显示所有刻度
                rotate: 40, // 刻度较多，调整刻度的旋转角度
            },
        },
        yAxis: {
            type: "value",
            name: "人口数量",
            max: 95000000,
            interval: 19000000,
        },
        series: [
            {
                type: "bar",
                data: data.map(function (item) {
                    return item.value;
                }),
                label: {
                    show: false,
                    position: "top",
                },
            },
        ],
        visualMap: {
			left: "right",
			min: 3000000,
			max: 100000000,
			inRange: {
				color: [
					"#313695",
					"#4575b4",
					"#74add1",
					"#abd9e9",
					"#e0f3f8",
					"#ffffbf",
					"#fee090",
					"#fdae61",
					"#f46d43",
					"#d73027",
					"#a50026",
				],
			},
			text: ["High", "Low"],
			calculable: true,
		},
    };

    barChart.setOption(barOption);

    // 鼠标悬停时显示具体数据
    barChart.on("mouseover", function (params) {
        var dataIndex = params.dataIndex;
        var population = data[dataIndex].value;
        barChart.dispatchAction({
            type: "showTip",
            seriesIndex: 0,
            dataIndex: dataIndex,
            name: data[dataIndex].name,
            value: population,
        });
    });

    barChart.on("mouseout", function () {
        barChart.dispatchAction({
            type: "hideTip",
        });
    });
}

function showPopulationBarChart() {
    var currentYear = getCurrentYear(); // 获取当前选定的年份
    var baseYear = getBaseYear(currentYear); // 选择基准年份
    var baseData = populationData[baseYear]; // 获取基准年份的人口数据
    var currentData = populationData[currentYear]; // 获取当前年份的人口数据

    var barChart = echarts.init(document.getElementById("barChart"));

    // 计算每个柱形图相对于基准年份的增减数量
    var diffData = currentData.map(function (item, index) {
        return {
            name: item.name,
            value: item.value - (baseData[index] ? baseData[index].value : 0),
        };
    });

    // 配置柱形图的选项
    var barOption = {
        title: {
            text: "(" + baseYear + "-" + currentYear + ")" + "10年人口数据变化柱形图",
            left: "center",
        },
        tooltip: {
            trigger: "axis",
            axisPointer: {
                type: "shadow", // 鼠标悬停时的样式
            },
            formatter: function (params) {
                var dataIndex = params[0].dataIndex;
                var populationDiff = diffData[dataIndex].value;
                var formattedDiff = populationDiff >= 0 ? "+" + populationDiff : populationDiff;
                
                return (
                    diffData[dataIndex].name +
                    "<br>" +
                    "人口变化：" +
                    formattedDiff +
                    " 人"
                );
            },
        },
        xAxis: {
            type: "category",
            data: currentData.map(function (item) {
                return item.name;
            }),
            axisLabel: {
                interval: 0, // 强制显示所有刻度
                rotate: 40, // 刻度较多，调整刻度的旋转角度
            },
        },
        yAxis: {
            type: "value",
            name: "人口数量",
            max: 23000000,
            min: -7000000,
            interval: 6000000,
        },
        series: [
            {
                type: "bar",
                data: diffData.map(function (item) {
                    return {
                        value: item.value,
                        itemStyle: {
                            color: item.value >= 0 ? "#c23531" : "#2f4554", // 正增长为红色，负增长为蓝色
                        },
                    };
                }),
                label: {
                    show: false,
                    position: "top",
                    formatter: function (params) {
                        return params.value >= 0 ? "+" + params.value : params.value;
                    },
                },
            },
        ],
        visualMap: {
            left: "right",
            min: -7000000, // 设置最小值，根据实际情况调整
            max: 24000000,
            inRange: {
                color: [
                    "#313695",
                    "#4575b4",
                    "#74add1",
                    "#abd9e9",
                    "#e0f3f8",
                    "#ffffbf",
                    "#fee090",
                    "#fdae61",
                    "#f46d43",
                    "#d73027",
                    "#a50026",
                ],
            },
            text: ["High", "Low"],
            calculable: true,
        },
    };

    barChart.setOption(barOption);

    // 鼠标悬停时显示具体数据
    barChart.on("mouseover", function (params) {
        var dataIndex = params.dataIndex;
        var populationDiff = diffData[dataIndex].value;
        var formattedDiff = populationDiff >= 0 ? "+" + populationDiff : populationDiff;
        
        barChart.dispatchAction({
            type: "showTip",
            seriesIndex: 0,
            dataIndex: dataIndex,
            name: diffData[dataIndex].name,
            value: formattedDiff,
        });
    });

    barChart.on("mouseout", function () {
        barChart.dispatchAction({
            type: "hideTip",
        });
    });
}

function getBaseYear(currentYear) {
    return (parseInt(currentYear) - 10).toString();
}

// 返回当前选择年份
function getCurrentYear() {
    var yearButtons = document.getElementsByName("yearBtn");
    for (var i = 0; i < yearButtons.length; i++) {
        if (yearButtons[i].checked) {
            return yearButtons[i].value;
        }
    }
    // 默认2020年
    return "2020";
}

document.getElementById("btn2000").addEventListener("click", function () {
	updateMap("2000");
    clearPopulationBarChart();
});

document.getElementById("btn2010").addEventListener("click", function () {
	updateMap("2010");
    clearPopulationBarChart();
});

document.getElementById("btn2020").addEventListener("click", function () {
	updateMap("2020");
    clearPopulationBarChart();
});

// 添加一个查看数据按钮
document.getElementById("viewDataBtn").addEventListener("click", function () {
    var currentYear = getCurrentYear();
    if (currentYear === "2000") {
        clearPopulationBarChart();
        showPopulationBarChart_2000();
    } else {
        showPopulationBarChart();
    }
});

// 添加一个重置按钮
document.getElementById("resetBtn").addEventListener("click", function () {
    // 清空柱形图
    clearPopulationBarChart();
    // 重置地图
    myChart.dispatchAction({
        type: 'restore'
    });
});

// 清空柱形图的函数
function clearPopulationBarChart() {
    var barChart = echarts.init(document.getElementById("barChart"));
    barChart.clear();
}

var populationData = {
	2020: [
        { "name": "北京市", "value": 21893095 },
        { "name": "天津市", "value": 13866009 },
        { "name": "河北省", "value": 74610235 },
        { "name": "山西省", "value": 34915616 },
        { "name": "内蒙古自治区", "value": 24049155 },
        { "name": "辽宁省", "value": 42591407 },
        { "name": "吉林省", "value": 24073453 },
        { "name": "黑龙江省", "value": 31850088 },
        { "name": "上海市", "value": 24870895 },
        { "name": "江苏省", "value": 84748016 },
        { "name": "浙江省", "value": 64567588 },
        { "name": "安徽省", "value": 61027171 },
        { "name": "福建省", "value": 41540086 },
        { "name": "江西省", "value": 45188635 },
        { "name": "山东省", "value": 101527453 },
        { "name": "河南省", "value": 99365519 },
        { "name": "湖北省", "value": 57752557 },
        { "name": "湖南省", "value": 66444864 },
        { "name": "广东省", "value": 126012510 },
        { "name": "广西壮族自治区", "value": 50126804 },
        { "name": "海南省", "value": 10081232 },
        { "name": "重庆市", "value": 32054159 },
        { "name": "四川省", "value": 83674866 },
        { "name": "贵州省", "value": 38562148 },
        { "name": "云南省", "value": 47209277 },
        { "name": "西藏自治区", "value": 3648100 },
        { "name": "陕西省", "value": 39528999 },
        { "name": "甘肃省", "value": 25019831 },
        { "name": "青海省", "value": 5923957 },
        { "name": "宁夏回族自治区", "value": 7202654 },
        { "name": "新疆维吾尔自治区", "value": 25852345 }
    ],
    2010: [
        { "name": "北京市", "value": 19612368 },
        { "name": "天津市", "value": 12938693 },
        { "name": "河北省", "value": 71854210 },
        { "name": "山西省", "value": 35712101 },
        { "name": "内蒙古自治区", "value": 24706291 },
        { "name": "辽宁省", "value": 43746323 },
        { "name": "吉林省", "value": 27452815 },
        { "name": "黑龙江省", "value": 38313991 },
        { "name": "上海市", "value": 23019196 },
        { "name": "江苏省", "value": 78660941 },
        { "name": "浙江省", "value": 54426891 },
        { "name": "安徽省", "value": 59500468 },
        { "name": "福建省", "value": 36894217 },
        { "name": "江西省", "value": 44567797 },
        { "name": "山东省", "value": 95792719 },
        { "name": "河南省", "value": 94029939 },
        { "name": "湖北省", "value": 57237727 },
        { "name": "湖南省", "value": 65700762 },
        { "name": "广东省", "value": 104320459 },
        { "name": "广西壮族自治区", "value": 46023761 },
        { "name": "海南省", "value": 8671485 },
        { "name": "重庆市", "value": 28846170 },
        { "name": "四川省", "value": 80417528 },
        { "name": "贵州省", "value": 34748556 },
        { "name": "云南省", "value": 45966766 },
        { "name": "西藏自治区", "value": 3002165 },
        { "name": "陕西省", "value": 37327379 },
        { "name": "甘肃省", "value": 25575263 },
        { "name": "青海省", "value": 5626723 },
        { "name": "宁夏回族自治区", "value": 6301350 },
        { "name": "新疆维吾尔自治区", "value": 21815815 }
    ],
    2000: [
        { "name": "北京市", "value": 13569194 },
        { "name": "天津市", "value": 9848731 },
        { "name": "河北省", "value": 66684419 },
        { "name": "山西省", "value": 32471242 },
        { "name": "内蒙古自治区", "value": 23323347 },
        { "name": "辽宁省", "value": 41824412 },
        { "name": "吉林省", "value": 26802191 },
        { "name": "黑龙江省", "value": 36237576 },
        { "name": "上海市", "value": 16407734 },
        { "name": "江苏省", "value": 73043577 },
        { "name": "浙江省", "value": 45930651 },
        { "name": "安徽省", "value": 58999948 },
        { "name": "福建省", "value": 34097947 },
        { "name": "江西省", "value": 40397598 },
        { "name": "山东省", "value": 89971789 },
        { "name": "河南省", "value": 91236854 },
        { "name": "湖北省", "value": 59508870 },
        { "name": "湖南省", "value": 63274173 },
        { "name": "广东省", "value": 85225007 },
        { "name": "广西壮族自治区", "value": 43854538 },
        { "name": "海南省", "value": 7559035 },
        { "name": "重庆市", "value": 30512763 },
        { "name": "四川省", "value": 82348296 },
        { "name": "贵州省", "value": 35247695 },
        { "name": "云南省", "value": 42360089 },
        { "name": "西藏自治区", "value": 2616329 },
        { "name": "陕西省", "value": 35365072 },
        { "name": "甘肃省", "value": 25124282 },
        { "name": "青海省", "value": 4822963 },
        { "name": "宁夏回族自治区", "value": 5486393 },
        { "name": "新疆维吾尔自治区", "value": 18459511 }
    ]
    
};

myChart.showLoading();
$.get("china.json", function (chinaJson) {
	myChart.hideLoading();
	echarts.registerMap("CHINA", chinaJson);
	option = {
        language: "zh_CN",
		title: {
			text: "中国大陆人口数据统计",
			left: "right",
		},
		tooltip: {
			trigger: "item",
			showDelay: 0,
			transitionDuration: 0.2,
		},
		visualMap: {
			left: "right",
			min: 3000000,
			max: 130000000,
			inRange: {
				color: [
					"#313695",
					"#4575b4",
					"#74add1",
					"#abd9e9",
					"#e0f3f8",
					"#ffffbf",
					"#fee090",
					"#fdae61",
					"#f46d43",
					"#d73027",
					"#a50026",
				],
			},
			text: ["High", "Low"],
			calculable: true,
		},
		toolbox: {
			show: true,
			left: "left",
			top: "top",
			feature: {
				dataView: { readOnly: false },
				//restore: {},
				saveAsImage: {},
			},
		},
		series: [
			{
				name: "人口",
				type: "map",
				roam: true,
				map: "CHINA",
				emphasis: {
					label: {
						show: true,
					},
				},
			},
		],
	};
	myChart.setOption(option);
	updateMap("2000");
});

option && myChart.setOption(option);