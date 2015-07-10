//CPU占用率检测
require.config({
    paths: {
        //echarts: 'http://echarts.baidu.com/build/dist'
        echarts: 'dist'
    }
});

// 使用
require(
    [
        'echarts',
        //'echarts/chart/line'
        'echarts/chart/gauge' // 使用柱状图就加载bar模块，按需加载
    ],
    function(ec) {
        // 基于准备好的dom，初始化echarts图表
        var myChart = ec.init(document.getElementById('cpu'));


        var option = {
            tooltip: {
                formatter: "{a} <br/>{b} : {c}%"
            },
            toolbox: {
                show: true,
                feature: {
                    mark: {
                        show: true
                    },
                    restore: {
                        show: true
                    },
                    saveAsImage: {
                        show: true
                    }
                }
            },
            series: [{
                name: 'CPU占用率',
                type: 'gauge',
                detail: {
                    formatter: '{value}%'
                },
                data: [{
                    value: 17,
                    name: 'CPU占用率'
                }]
            }]
        };

        /*clearInterval(timeTicket);
        timeTicket = setInterval(function() {
            option.series[0].data[0].value = (Math.random() * 100).toFixed(2) - 0;*/
        myChart.setOption(option, true);
        /* }, 2000);*/


	    /*var cpuOccupancyRate = require('./readCPU');
        cpuOccupancyRate(function(cpu) {
            option.series[0].data[0].value = cpu;
		myChart.setOption(option, true);
        })*/

    }
);
