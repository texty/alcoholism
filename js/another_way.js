/**
 * Created by yevheniia on 12.10.20.
 */
var colors = ["#468966","#FFF0A5", "#FFB03B","#B64926", "#8E2800"];


const fontFamily = 'ProximaNova, sans-serif';
const fontSize = 18;
const titleFontSize = 30;
const titleFontFamily = "Roboto Mono, monospace";

const whiteColor = 0xe6e6e6;
const redColor = 0xed6746;
const redHex = '#ed6746';

//pixi vars
const stage = new PIXI.Container();
var blurFilter1 = new PIXI.filters.BlurFilter();
var chartConteiner = document.getElementById("chart").getBoundingClientRect();
var canvas = document.getElementById("scene");
var ctx = canvas.getContext("2d");



var renderer = new PIXI.Application({
    // width:  window.innerWidth < 800 ? window.innerWidth * 0.9 : window.innerWidth,
    // height:  window.innerWidth < 800 ? (window.innerHeight * 0.7) : window.innerHeight,
    width: chartConteiner.width,
    height: chartConteiner.height,
    setInteractive: true,
    antialias: true,
    backgroundColor: 0x252525
});

document.getElementById("chart").append(renderer.view);


//project vars
var ww = canvas.width = window.innerWidth;
var wh = canvas.height = window.innerHeight < 800 ? window.innerHeight * 0.7 : window.innerHeight;

const GRID_SIZE = 25;
const fractionSizeX = Math.floor(ww / GRID_SIZE);
const ALCO_AMOUNT = 588;
const xPosCoeff = 1;
//TODO: зробити інший barChartPadding для мобільних
var barChartPadding = window.innerWidth > 1200 ? ww/4 : ww/6;


var points = [];
var labels = [];
let color = "0x"+colors[Math.floor(Math.random()*6)];


function drawScene() {
    points = [];
    ctx.clearRect(0, 0, ww, wh);
    ctx.font = "bold " + (ww / 8) +  "px " + "sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("Невидимі", ww / 2, wh / 3);


// const img = document.getElementById('img');
// ctx.drawImage(img, ww/3, wh/4);

    var data = ctx.getImageData(0, 0, ww, wh).data;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
// ctx.globalCompositeOperation = "screen";


    for (let i = 0; i < ww; i += Math.round(ww / 250)) {
        for (var j = 0; j < wh; j += Math.round(ww / 250)) {
            if (data[((i + j * ww) * 4) + 3] > 250) {
                const sprite = new PIXI.Graphics();
                sprite.speed = 2 + Math.random() * 2;
                sprite.lineStyle(0); //
                sprite.beginFill(whiteColor, 1);
                sprite.drawRect(0, 0, 4, 4);
                sprite.endFill();
                sprite.info = [{ x:i, y:j, level: 1 }];
                points.push(sprite);
                renderer.stage.addChild(sprite);

                sprite.position.x = Math.random() * window.innerWidth;
                sprite.position.y = Math.random() * window.innerHeight;

                let xPos= sprite.info[0].x;
                let yPos= sprite.info[0].y;
                TweenMax.to(sprite, 5, {x: xPos, y: yPos });


            }
        }
    }
}

function drawPicture(){
    const imgW = window.innerWidth * 0.6;
    const imgStart = window.innerWidth/5;
    const img = document.getElementById('img');
    ctx.drawImage(img, imgStart, 100, imgW,  imgW/1.5);
    var data = ctx.getImageData(0, 0, ww, wh).data;
    ctx.clearRect(0, 0, canvas.width, canvas.height);


    //сюди зберігаємо позиції точок на зображені
    const imgPosArr = [];
    for (let i = 0; i < ww; i += Math.round(ww / 250)) {
        for (var j = 0; j < wh; j += Math.round(ww / 250)) {
            if (data[((i + j * ww) * 4) + 3] > 250) {
                imgPosArr.push([{ x:i, y:j }]);
           }
        }
    }

    //тепер переносимо точки на позиції зображення
    for(let i = 0; i < imgPosArr.length ; i++){
        let dude = points[i];
        let xPos = imgPosArr[i][0].x;
        let yPos = imgPosArr[i][0].y;


        if(i <= points.length) {
            TweenMax.to(dude, 1, {x: xPos, y: yPos, tint: whiteColor});

        } else if(i > points.length) {
            let sprite = new PIXI.Graphics();
            sprite.speed = 2 + Math.random() * 2;
            sprite.lineStyle(0); //
            sprite.beginFill(whiteColor, 1);
            sprite.drawRect(0, 0, 4, 4);
            sprite.endFill();
            sprite.info = [{ x: xPos, y: yPos, level: 2 }];
            points.push(sprite);
            renderer.stage.addChild(sprite);
            sprite.position.x = xPos;
            sprite.position.y = yPos;

        }
    }

    if(imgPosArr.length < points.length){
        for(let i = imgPosArr.length; i < points.length ; i++){
            let dude = points[i];
            dude.alpha = 0;
        }
    }


}


drawScene();
amount = points.length;

var subtitle = document.getElementById("subtitle");
setTimeout(function(){
    TweenMax.to(subtitle, 5, {opacity: 1 });

}, 2000);


function step_01_1(){

    for(let i = 0; i < points.length; i++){
        let dude = points[i];
        let xPos = Math.random() * window.innerWidth;
        let yPos = Math.random() * window.innerHeight;
        TweenMax.to(dude, 1, {x: xPos, y: yPos });
    }
}


function step_00() {

    for (let dude of points) {

        if (dude.info[0].level === 1) {
            dude.alpha = 1;
            let xPos = dude.info[0].x;
            let yPos = dude.info[0].y;
            dude.tint = whiteColor;
            TweenMax.to(dude.scale, 2, {x: 1, y: 1});
            TweenMax.to(dude, 3, {x: xPos, y: yPos, tint: whiteColor});
        } else {
            dude.alpha = 0;
        }
    }
}


function step_01() {
    // const img = document.getElementById('img').style.display = "none";

    for(let i = 0; i < labels.length; i++){
        renderer.stage.removeChild(labels[i]);
    }

    labels = [];

    //додаємо точки, якщо їх менше потрібної кількості
    if(points.length < 1729) {
        for (let i = points.length; i <= 1729; i++) {
            const sprite = new PIXI.Graphics();
            sprite.speed = 2 + Math.random() * 2;
            sprite.lineStyle(0); //
            sprite.beginFill(whiteColor, 1);
            sprite.drawRect(0, 0, 4, 4);
            sprite.endFill();
            sprite.info = [{ level: 2 }];
            points.push(sprite);
            renderer.stage.addChild(sprite);
            sprite.position.x = Math.random() * window.innerWidth;
            sprite.position.y = Math.random() * window.innerHeight;
        }
    } else {
        //прибираємо якщо більше
        for (let i = 1729; i < points.length; i++){
            renderer.stage.removeChild(points[i]);
        }
    }


    // for (var i = 1; i <= points.length; i++) {
    //     var dude = points[i-1];
    //     // dude.alpha = 1;
    //     let thisColor = dude.info[0].fillColor;
    //     console.log(dude);
    //     dude.clear();
    //     dude.beginFill(thisColor, 1);
    //     dude.drawCircle(0, 0, 4);
    //     //dude.drawRect(0, 0, 10, 10);
    //     dude.endFill();
    //     TweenMax.to(dude, 3, {x: Math.random() * globalWidth, y: Math.random() * screen.height });
    //
    //
    //
    //     var preposY = Math.ceil(i / fractionSizeX);
    //     var preposX = i - (Math.floor(i / fractionSizeX) * fractionSizeX);
    //
    //
    //     let posX = preposX * GRID_SIZE;
    //     let posY = GRID_SIZE * preposY;
    //     TweenMax.to(dude, 3, {x: posX, y: posY });
    // }



    //TODO: якась одна зайва краситься
    //красимо алко в червоні та скелимо
    for (let i = 1; i <= points.length; i++) {
        let dude = points[i-1];
        if(i <= ALCO_AMOUNT){
            dude.tint = redColor;
        }

        TweenMax.to(dude, 3, {
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight
            });

        // var preposY = Math.ceil(i / fractionSizeX);
        // var preposX = i - (Math.floor(i / fractionSizeX) * fractionSizeX);
        //
        //
        // let posX = preposX * GRID_SIZE;
        // let posY = GRID_SIZE * preposY;
        //
        // TweenMax.to(dude, 3, {x: posX, y: posY });

        // TweenMax.to(dude, 3, {x: posX, y: posY });
        dude.alpha = 0.5;
       // TweenMax.to(dude.scale,1,{ x:2, y:2});
        // points[i].filters = [blurFilter1];
        // points[i].filters.blur = 0;
        //
        //
        //  TweenMax.to(points[i].filters, 3, {blur: 5});
        //
        //
        //
        // TweenMax.to(points[i].filters, 3, {blur: 0});

    }

}

function step_02(){
    //прибираємо всі підписи
    if(labels.length > 0){
        for(let i = 0; i < labels.length; i++){
            renderer.stage.removeChild(labels[i]);
        }
        labels =[];
    }

    //датасет для першого графіка
    var chart1_bars = [
        { content: "Внаслідок вживання алкоголю (587 937 осіб) ", start: 0, end: 587, amount: 587, fill: "#ed6746" },
        { content: "Органічні, включно із симптоматичними (287 998)", amount: 288, fill: "white" },
        { content: "Розумова відсталість (225 896 осіб)", amount: 226, fill: "white" },
        { content: "Шизофренія, шизотипові та маячні розлади (175 690)", amount: 175, fill: "white" },
        { content: "Невротичні, пов’язані зі стресом, та соматоформні розлади (140 991 )", amount: 141, fill: "white" },
        { content: "Внаслідок вживання інших ПАР, зокрема наркотиків (107 597 )", amount: 108, fill: "white" },
        { content: "Розлади психологічного розвитку (80 822 )", amount: 81, fill: "white" },
        { content: "Розлади настрою, афективні розлади (47 170 )", amount: 47, fill: "white" },
        { content: "Розлади поведінки та емоцій, які починаються у дитячому віці (30 584 )", amount: 30, fill: "white" },
        { content: "Розлади зрілої особистості та поведінки у дорослих (27 381)", amount: 27, fill: "white" },
        { content: "Синдроми розладів поведінки, пов’язані з фізіологічними порушеннями (8 422)", amount: 8, fill: "white"},
        { content: "Неуточнений психічний розлад (424)", amount: 1, fill: "white"}
    ];


    //додаємо до чарту змінні start / end
    for(let i = 1; i < chart1_bars.length; i++){
        chart1_bars[i].start = chart1_bars[i-1].end + 1;
        chart1_bars[i].end = chart1_bars[i].start + chart1_bars[i].amount
    }

    //малюємо підписи
    for(let k = 0; k < chart1_bars.length; k++){
        let item = chart1_bars[k];
        label = new PIXI.Text(item.content, {fontSize: fontSize,  fontFamily: titleFontFamily, fill: item.fill });
        label.position.x = barChartPadding;
        label.position.y = 50 + (k * 50) + 10;
        label.alpha = 0;
        labels.push(label);
        renderer.stage.addChild(label);
        TweenMax.to(label, 4, { alpha:1 });
    }

    let chartTitle = new PIXI.Text("Причини психічних розладів (2019 р.)", {fontSize: titleFontSize,  fontFamily: titleFontFamily, fill: "lightgrey" });
    chartTitle.position.x = barChartPadding;
    chartTitle.position.y = 0;
    chartTitle.alpha = 1;
    labels.push(chartTitle);
    renderer.stage.addChild(chartTitle);


    //малюємо барчики
    for(let i = 0; i < chart1_bars.length; i++){
        let item =  chart1_bars[i];
        for(let j = item.start; j <= item.end; j++){
            let xpos = j * xPosCoeff;
            let padding = item.start * xPosCoeff;
            if(j <= 588){
                points[j].tint = redColor;
            }
            points[j].alpha = 1;
            TweenMax.to(points[j].scale,1,{ x:2, y:2});
            TweenMax.to(points[j], 1,{ x: xpos + barChartPadding - padding, y: (i+2) * 50 - 10 });
        }
    }
}


function step_03() {
    if(labels.length > 0){
        for(let i = 1; i < labels.length; i++){
            renderer.stage.removeChild(labels[i]);
        }
    }

    for (let i = 0; i < points.length; i++) {
        if (i >= 588) {
            TweenMax.to(points[i], 1,{ x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight, alpha: 0 });
        }
    }
}


function step_04(){
    renderer.stage.removeChild(labels[0]);
    labels = [];

    var chart2_bars = [
        { content: "синдром залежності та стан відміни абстинентний (419 237 осіб)", start: 0, end: 418, amount: 418, fill: "white" },
        { content: "гостра інтоксикація та вживання зі шкідливими наслідками (163 926)", amount: 164, fill: "white" },
        { content: "стан відміни з делірієм та психотичні розлади (3 745)", amount: 4, fill: "white" },
        { content: "амнестичний синдром та резидуальні і пізні психотичні розлади (1 029)", amount: 1, fill: "white" }
    ];

    for(let i = 1; i < chart2_bars.length; i++){
        chart2_bars[i].start = chart2_bars[i-1].end + 1;
        chart2_bars[i].end = chart2_bars[i].start + chart2_bars[i].amount-1
    }

    //малюємо підписи
    for(let k = 0; k < chart2_bars.length; k++){
        let item = chart2_bars[k];
        label = new PIXI.Text(item.content, {fontSize: fontSize,  fontFamily: titleFontFamily, fill: item.fill });
        label.position.x = barChartPadding;
        label.position.y = 50 + (k * 50) + 10;
        label.alpha = 0;
        labels.push(label);
        renderer.stage.addChild(label);
        TweenMax.to(label, 4, { alpha:1 });
    }

    let chartTitle = new PIXI.Text("Розлади через вживання алкоголю (2019 р.)", {fontSize: titleFontSize,  fontFamily: titleFontFamily, fill: "lightgrey" });
    chartTitle.position.x = barChartPadding;
    chartTitle.position.y = 0;
    chartTitle.alpha = 1;
    labels.push(chartTitle);
    renderer.stage.addChild(chartTitle);


    //малюємо барчики
    for(let i = 0; i < chart2_bars.length; i++){
        let item =  chart2_bars[i];
        for(let j = item.start; j <= item.end; j++){

            let xpos = j * xPosCoeff;
            let padding = item.start * xPosCoeff;
            points[j].alpha = 1;
            points[j].tint = redColor;
            // TweenMax.to(points[j].scale,1,{ x:3, y:3});
            TweenMax.to(points[j], 1,{ x: xpos + barChartPadding - padding, y: (i+2) * 50 - 10 });
        }
    }

}


function step_05(){
    for(let i = 0; i < labels.length; i++){
        renderer.stage.removeChild(labels[i]);
    }
    labels = [];


    for (let i = 0; i < points.length; i++) {
            points[i].tint = whiteColor;
            // TweenMax.to(points[i].scale, 1, { x:1, y:1});
            TweenMax.to(points[i], 1,{ x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight, alpha: 0.5 });
    }
}


function step_06(){
    for(let i = 0; i < labels.length; i++){
        renderer.stage.removeChild(labels[i]);
    }
    labels = [];

    var chart3_bars = [
        { content: "Хвороби, повʼязані з вживанням алкоголю (9 966 осіб)",  percent: 22, fill: redColor },
        { content: "Старість (10 668 осіб)", percent: 23, fill: whiteColor },
        { content: "Злоякісні новоутворення молочної залози (6 703 осіб)", percent: 15, fill: whiteColor },
        { content: "Злоякісні новоутворення шлунка (6 481 осіб)", percent: 14, fill: whiteColor },
        { content: "Пневмонія (6 238 осіб)", percent: 14, fill: whiteColor },
        { content: "Транспортні нещасні випадки (4 037 осіб)", percent: 9, fill: whiteColor },
        { content: "Цукровий діабет (2 009)", percent: 5, fill: whiteColor }
    ];


    for(let i = 0; i < chart3_bars.length; i++){
        chart3_bars[i].point_amount = Math.round(1730 / 100) * chart3_bars[i].percent;
        if(i === 0){
            chart3_bars[i].start = 0;
            chart3_bars[i].end = chart3_bars[i].point_amount;
        } else {
            chart3_bars[i].start = chart3_bars[i-1].end + 1;
            chart3_bars[i].end = chart3_bars[i].start + chart3_bars[i].point_amount;
        } 
    }



    //малюємо підписи
    for(let k = 0; k < chart3_bars.length; k++){
        let item = chart3_bars[k];
        label = new PIXI.Text(item.content, {fontSize: fontSize,  fontFamily: titleFontFamily, fill: item.fill });
        label.position.x = barChartPadding;
        label.position.y = 50 + (k * 50) + 10;
        // label.alpha = 0;
        labels.push(label);
        renderer.stage.addChild(label);
        TweenMax.to(label, 4, { alpha:1 });
    }

    let chartTitle = new PIXI.Text("Деякі причини смертності (2019 р.)", {fontSize: titleFontSize,  fontFamily: titleFontFamily, fill: "lightgrey" });
    chartTitle.position.x = barChartPadding;
    chartTitle.position.y = 0;
    chartTitle.alpha = 1;
    labels.push(chartTitle);
    renderer.stage.addChild(chartTitle);

    //малюємо барчики
    for(let i = 0; i < chart3_bars.length; i++){
        let item =  chart3_bars[i];
        for(let j = item.start; j <= item.end; j++){

            let xpos = j * 1.5;
            let padding = item.start * 1.5;
            //points[j].alpha = 1;
            points[j].tint = item.fill;
            TweenMax.to(points[j].scale,1,{ x:2, y:2});
            TweenMax.to(points[j], 1,{ x: xpos + barChartPadding - padding, y: (i+2) * 50 - 10,  alpha: 0.8 });
        }
    }



}



function step_07() {
    if(labels.length > 0){
        for(let i = 1; i < labels.length; i++){
            renderer.stage.removeChild(labels[i]);
        }
    }

    for (let i = 0; i < points.length; i++) {
        if (i >= 374) {
            TweenMax.to(points[i], 1,{ x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight, alpha: 0 });
        }
    }


}


function step_07_2() {
    let total_amount = 374;
    renderer.stage.removeChild(labels[0]);
    labels = [];

    var chart4_bars = [
        { content: "Алкогольна кардіоміопатія (3 718 осіб)",  percent: 37, fill: redColor },
        { content: "Випадкове отруєння та дія алкоголю (2 774 осіб)", percent: 27, fill: redColor },
        { content: "Алкогольна хвороба печінки (1 965 осіб)", percent: 20, fill: redColor },
        { content: "Розлади психіки та поведінки внаслідок вживання алкоголю (852 особи)", percent: 9, fill: redColor },
        { content: "Дегенерація нервової системи, спричинена вживанням алкоголю (652 особи)", percent: 6, fill: redColor },
        { content: "Алкогольна поліневропатія (5)", percent: 0, fill: redColor }
    ];

    for(let i = 0; i < chart4_bars.length; i++){
        chart4_bars[i].point_amount = Math.round((374 / 100) * chart4_bars[i].percent);
        if(i === 0){
            chart4_bars[i].start = 0;
            chart4_bars[i].end = chart4_bars[i].point_amount;
        } else {
            chart4_bars[i].start = chart4_bars[i-1].end + 1;
            chart4_bars[i].end = chart4_bars[i].start + chart4_bars[i].point_amount;
        }
    }



    //малюємо підписи
    for(let k = 0; k < chart4_bars.length; k++){
        let item = chart4_bars[k];
        label = new PIXI.Text(item.content, {fontSize: fontSize,  fontFamily: titleFontFamily, fill: whiteColor });
        label.position.x = barChartPadding;
        label.position.y = 50 + (k * 50) + 10;
        label.alpha = 0;
        labels.push(label);
        renderer.stage.addChild(label);
        TweenMax.to(label, 4, { alpha:1 });
    }

    let chartTitle = new PIXI.Text("Як саме вбиває алкоголь (2019 р.)", {fontSize: titleFontSize,  fontFamily: titleFontFamily, fill: "lightgrey" });
    chartTitle.position.x = barChartPadding;
    chartTitle.position.y = 0;
    chartTitle.alpha = 1;
    labels.push(chartTitle);
    renderer.stage.addChild(chartTitle);

    //малюємо барчики
    for(let i = 0; i < chart4_bars.length; i++){
        let item = chart4_bars[i];
        for(let j = item.start; j <= item.end; j++){
            let xpos = j * xPosCoeff;
            let padding = item.start * xPosCoeff;
            points[j].alpha = 1;
            points[j].tint = redColor;
            TweenMax.to(points[j], 1,{ x: xpos + barChartPadding - padding, y: (i+2) * 50 - 10 });
        }
    }
}


/* малюємо підпис до точки */
// let style = new PIXI.TextStyle({ fontSize: fontSize,  fill: 0xff0000 });
// let label = new PIXI.Text("1 тис. осіб", style);
// label.position.x = barChartPadding+100;
// label.position.y = 200;
// label.alpha = 0;
// renderer.stage.addChild(label);
// TweenMax.to(label, 4, { alpha: 1 });
// labels.push(label);





/* скролама */
var container = d3.select('#scroll');
var graphic = container.select('.scroll__graphic');
var text = container.select('.scroll__text');
var step = text.selectAll('.step');
var scroller = scrollama();


function handleResize() {
    var stepHeight = Math.floor(window.innerHeight * 0.5);
    step.style('height', stepHeight + 'px');
    var bodyWidth = d3.select('body').node().offsetWidth;
    var textWidth = text.node().offsetWidth;
    var graphicWidth = bodyWidth - textWidth;
    var chartMargin = 32;
    var chartWidth = graphic.node().offsetWidth - chartMargin;
    scroller.resize();
}

// scrollama event handlers
function handleStepEnter(r) {
    if(r.index === 0) {
        step_00()
    }
    if(r.index === 1) {
        step_01_1();
    }
    if(r.index === 2){
        drawPicture();
    }
    if(r.index === 4){
        step_01();
    }
    if(r.index === 5) {
        step_05();
        step_06();
    }
    if(r.index === 6){
        step_07();
        setTimeout(step_07_2(), 1000);

    }
    if(r.index === 7){
        step_02();
    } if(r.index === 8){
        step_03();
        setTimeout(step_04(), 1000)
    } if(r.index === 9){
        step_03();
        setTimeout(step_04(), 1000)
    }
}


function handleContainerEnter(response) {
    // response = { direction }
}

function handleContainerExit(response) {
    // response = { direction }
}



function init() {
    handleResize();
    scroller.setup({
        container: '#scroll',
        graphic: '.scroll__graphic',
        text: '.scroll__text',
        step: '.scroll__text .step',
        offset: 0.9,
        debug: false
    })
        .onStepEnter(handleStepEnter)
        .onContainerEnter(handleContainerEnter)
        .onContainerExit(handleContainerExit);
    window.addEventListener('resize', handleResize);
}
init();


    // window.onresize = function (event){
    //     "use strict";
    //     window.location.reload();
    // };
    //     var w = window.innerWidth;
    //     var h = window.innerHeight;
    //     console.log(renderer.view.style);
    //     //this part resizes the canvas but keeps ratio the same
    //     renderer.view.style.width = w + "px";
    //     renderer.view.style.height = w * 0.51 + "px";    //this part adjusts the ratio:
    //     renderer.resize(w,h);
    //
    //     for (var i = 0; i < points.length; i++) {
    //         var dude = points[i];
    //         dude.clear();
    //         dude.beginFill(0xffffff, 1);
    //         dude.drawCircle(0, 0, 2);
    //         dude.endFill();
    //     }
    //
    // };


