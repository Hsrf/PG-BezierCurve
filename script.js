//Hugo Falcao - Recife, Brazil 12/11/2019

/*
    Coisas a serem resolvidas:
            - Bugs:
                - Ao deletar diversas curvas ele comeca a bugar as linhas se vc tentar criar novas curvas

            - Implementacao
                - Feature de selecionare e mover pontos nao implementada
                - Campo de definição de número de avaliações/retas

            - Refatoramento
                - Fazer design descente do campo de numero de avaliações
                - Refatorar codigo e retirar mas praticas do html e css
*/
    
    
  
    //Variaveis globais para todo o codigo
    var canvas, context, controlPointXArray, controlPointYArray, currentCurve, amountCurves, curveArrayX, curveArrayY, amountEvaluations, showControlPoints, showCurves, showLines;
            
    function init(){
        //Inicializa as variaveis globais
        controlPointXArray = [];
        controlPointYArray = [];
        curveArrayX = [];
        curveArrayY = [];
        currentCurve = 0;
        amountCurves = 0;  
        controlPointXArray[0] = [];
        controlPointYArray[0] = [];
        canvas = document.getElementById("myCanvas");
        context = canvas.getContext("2d");
        amountEvaluations = 100;
        showCurves = showLines = showControlPoints = true;
    }
            
    function drawPoint(event){
        //Da um overwrite nos c-ontadores de curvas sendo mostrados
        updateCountersOnDisplay();
    
        //Definindo as caracteristicas do ponto
        var position = getMousePosition(event, canvas);
        var pointRadius = 2;
        context.fillStyle = "#ff2626";
                
        //Desenha o ponto
        if(showControlPoints){
            context.beginPath();
            context.arc(position.x, position.y, pointRadius, 0, Math.PI * 2);
            context.fill();
        }
        

        //Verifica se ja existem pontos existentes e tenta tracar uma reta
        var arraySize = controlPointXArray[currentCurve].length;
        if(arraySize >= 1){ 
            drawLine(position.x, position.y);
        }

        //Adiciona o novo ponto ao array de pontos
        controlPointXArray[currentCurve].push(position.x);
        controlPointYArray[currentCurve].push(position.y);

        //Verifica se ja existem tres pontos existentes e tenta formar uma curva
        if(arraySize >= 2){
            drawBezier();
        }
    }

    function drawCurvePoint(x, y){
        //Da um overwrite nos c-ontadores de curvas sendo mostrados
        updateCountersOnDisplay();
    
        //Definindo as caracteristicas do ponto
        var pointRadius = 2;
        context.fillStyle = "#ff2626";
                
        //Desenha o ponto
        context.beginPath();
        context.arc(x, y, pointRadius, 0, Math.PI * 2);
        context.fill();
        context.stroke();

        var arraySize = controlPointXArray[currentCurve].length;
        //Verifica se ja existem dois pontos existentes e tenta tracar uma reta
        if(arraySize >= 1){ 
            drawLine(x, y);
        }
    }

    function getMousePosition(event, canvas) {
        //Retorna a posicao onde o mouse foi clickado
        var rect = canvas.getBoundingClientRect();
        return {
                x: event.clientX - rect.left,
                y: event.clientY - rect.top
            }
    }

    function drawLine(x, y){
        var arraySize = controlPointXArray[currentCurve].length;
        if(arraySize >= 1){
            //Verifica quantidade de pontos no array, antes de tentar criar uma reta
            var lastX = controlPointXArray[currentCurve][arraySize - 1];
            var lastY = controlPointYArray[currentCurve][arraySize - 1];
            context.beginPath();
            context.moveTo(lastX, lastY);
            context.lineTo(x, y);
            context.stroke();
        }
    }

    function newCurve(){
        //Inicializa e troca o cursor atual para uma nova curva
        amountCurves++;
        currentCurve = amountCurves;
        controlPointXArray[amountCurves] = [];
        controlPointYArray[amountCurves] = [];
        canvas.addEventListener("mousedown", drawPoint);
        updateCountersOnDisplay()
    }

    function nextCurve(){
        //Cicla, dentre as curvas existente para a proxima
        if(currentCurve < amountCurves){
            currentCurve++;
        }
        updateCountersOnDisplay()
    }

    function previousCurve(){
        //Cicla, dentre as curvas existente para a anterior
        if(currentCurve > 1){
            currentCurve--;
        }
        updateCountersOnDisplay();
    }

    function deleteCurve(){
        //Deleta a curva atual e seus pontos dos arrays, e depois atualiza o canvas
        controlPointXArray.splice(currentCurve, 1);
        controlPointYArray.splice(currentCurve, 1);
        curveArrayX.splice(currentCurve, 1);
        curveArrayY.splice(currentCurve, 1);
        clearCanvas();
        reDrawExistingObjects();

        if(currentCurve > 1){
            currentCurve--;
        }else{
            currentCurve = 1;
            controlPointXArray[currentCurve] = [];
            controlPointYArray[currentCurve] = [];
        }

        if(amountCurves > 1){
            amountCurves--;
        }else{
            amountCurves = 1;
        }
        updateCountersOnDisplay()
    }

    function resetCanvas(){
        //Limpa o canvas inteiro e apaga todos os dados anteriormente armazenados
        context.clearRect(0,0,1300, 800);
        controlPointXArray = [];
        controlPointYArray = [];
        curveArrayX = [];
        curveArrayY = [];
        currentCurve = 1;
        amountCurves = 1;
        controlPointXArray[currentCurve] = [];
        controlPointYArray[currentCurve] = [];
        updateCountersOnDisplay();
    }

    function deCasteljau(currentEvalutionPoint){
        //Executa o algoritmo de De Casteljau, gerando curvas a partir da interpolacao de pontos em retas
        var u = currentEvalutionPoint / amountEvaluations;
        var auxArrayX = [];
        var auxArrayY = [];

        for(var i = 0; i < controlPointXArray[currentCurve].length; i++){
            auxArrayX[i] = controlPointXArray[currentCurve][i];
            auxArrayY[i] = controlPointYArray[currentCurve][i];
        }
        for(var k = 1; k < controlPointXArray[currentCurve].length; k++){
            for(var i = 0; i < (controlPointXArray[currentCurve].length - k); i++){
                auxArrayX[i] = (1 - u) * auxArrayX[i] + (u * auxArrayX[i + 1]);
                auxArrayY[i] = (1 - u) * auxArrayY[i] + (u * auxArrayY[i + 1]); 
            }
        }
        curveArrayX[currentCurve].push(auxArrayX[0]);
        curveArrayY[currentCurve].push(auxArrayY[0]);
    }

    function updateCountersOnDisplay(){
        document.getElementById("amount").innerHTML = "Amount Curves: "+ amountCurves;
        document.getElementById("current").innerHTML = "Current Curve: "+ currentCurve;
    }

    function drawBezier(){
        curveArrayX[currentCurve] = [];
        curveArrayY[currentCurve] = [];
        clearCanvas();
        reDrawExistingObjects();

        //Impedir que o usuario quebre o programa com uma ma entrada
        console.log("Desenhando curva com :"+ amountEvaluations);
        if(amountEvaluations <= 0){
            amountEvaluations = 1;
        }

        for(var i = 1; i <= amountEvaluations; i++){
            deCasteljau(i);
        }
    
        for(var i = 0; i < curveArrayX[currentCurve].length; i++){
            //Desenha as linhas que formam a curva
            context.fillStyle = "##000066";
            context.beginPath();
            context.moveTo(curveArrayX[currentCurve][i - 1], curveArrayY[currentCurve][i - 1]);
            context.lineTo(curveArrayX[currentCurve][i], curveArrayY[currentCurve][i]);
            context.stroke();
        }
    }

    function clearCanvas(){
        //Apaga tudo que havia sido desenhado previamente no canvas, sem mexer nos dados armazenados
        context.clearRect(0,0,1300, 700);
    }

    function reDrawExistingPoints(){
        //Definindo as caracteristicas do ponto
        context.fillStyle = "#ff2626";

        //Varre o array dos pontos e os desenha
        for(var i = 1; i < controlPointXArray.length; i++){
            for(var j = 0; j < controlPointXArray[i].length; j++){
                context.beginPath();
                context.arc(controlPointXArray[i][j], controlPointYArray[i][j], 2, 0, Math.PI * 2);
                context.fill();
                context.stroke();
            }
        }
    }

    function reDrawExistingCurves(){
        //Varre o array das curvas e as desenha
        for(var i = 1; i < curveArrayX.length; i++){
            for(var j = 0; j < curveArrayX[i].length; j++){
                context.beginPath();
                context.moveTo(curveArrayX[i][j - 1], curveArrayY[i][j - 1]);
                context.lineTo(curveArrayX[i][j], curveArrayY[i][j]);
                context.stroke();
            }
        }
    }

    function reDrawExistingLines(){
        //Varre o array dos pontos e utiliza eles para desenhar retas
        for(var i = 1; i < controlPointXArray.length; i++){
            for(var j = 0; j < controlPointXArray[i].length; j++){
                if(j > 0){
                    context.beginPath();
                    context.moveTo(controlPointXArray[i][j - 1], controlPointYArray[i][j - 1]);
                    context.lineTo(controlPointXArray[i][j], controlPointYArray[i][j]);
                    context.stroke();
                }
            }
        }
    }

    function updateAmountEvaluations(){
        amountEvaluations = document.getElementById("amountEvaluations").value;
        console.log("Atualizando para: " + amountEvaluations);
        //Caso queira que se o usuario trocar a quantidade de avaliacoes as curvas antigas tb mudem, basta apagar os arrays da curva e recalcula-los com o novo valor de amountEvaluations
        clearCanvas();
        reDrawExistingObjects();
    }

    function checkControlPoints(){
        showControlPoints = !showControlPoints;
        hideUnChecked();
    }

    function checkExistingCurves(){
        showCurves = !showCurves;
        hideUnChecked();
    }

    function checkExisitingLines(){
        showLines = ! showLines;
        hideUnChecked();
    }

   function hideUnChecked(){
        clearCanvas();
        reDrawExistingObjects();
    }

    function reDrawExistingObjects(){
        if(showControlPoints){
            reDrawExistingPoints();
        }
        if(showLines){
            reDrawExistingLines();
        }
        if(showCurves){
            reDrawExistingCurves();
        }
    }