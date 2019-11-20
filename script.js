//Hugo Falcao - Recife, Brazil 12/11/2019

/*
    Coisas a serem resolvidas:
            - Bugs:
                - Fazer varias curvas, voltar ate uma das iniciais e depois apagar ela buga as demais

            - Implementacao
                - Feature de selecionar, mover e deletar pontos nao implementada
                - Criacao de curvas em si nao implementada
                - Ciclar entre objetos visiveis usuando checkcboxes (pontos, retas e curvas)
                - Campo de definição de número de avaliações/retas

            - Refatoramento
                - Fazer design descente do campo de numero de avaliações
                - Refatorar codigo e retirar mas praticas do html e css
*/
    
    
  
    //Variaveis globais para todo o codigo
    var canvas, context, controlPointXArray, controlPointYArray, currentCurve, amountCurves, curveArrayX, curveArrayY, amountEvaluations; 
            
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
    }
            
    function drawPoint(event){
        //Da um overwrite nos c-ontadores de curvas sendo mostrados
        updateCountersOnDisplay();
    
        //Definindo as caracteristicas do ponto
        var position = getMousePosition(event, canvas);
        var pointRadius = 3;
        context.fillStyle = "#ff2626";
                
        //Desenha o ponto
        context.beginPath();
        context.arc(position.x, position.y, pointRadius, 0, Math.PI * 2);
        context.fill();
        context.stroke();

        //Verifica se ja existem pontos existentes e tenta tracar uma reta
        var arraySize = controlPointXArray[currentCurve].length;
        if(arraySize >= 1){ 
            drawLine(position.x, position.y);
        }

        //Adiciona o novo ponto ao array de pontos
        controlPointXArray[currentCurve].push(position.x);
        controlPointYArray[currentCurve].push(position.y);
    }

    function drawCurvePoint(x, y){
        //Da um overwrite nos c-ontadores de curvas sendo mostrados
        updateCountersOnDisplay();
    
        //Definindo as caracteristicas do ponto
        var pointRadius = 3;
        context.fillStyle = "#ff2626";
                
        //Desenha o ponto
        context.beginPath();
        context.arc(x, y, pointRadius, 0, Math.PI * 2);
        context.fill();
        context.stroke();

        //Verifica se ja existem pontos existentes e tenta tracar uma reta
        var arraySize = controlPointXArray[currentCurve].length;
        if(arraySize >= 1){ 
            drawLine(x, y);
        }

    }

    function getMousePosition(event, canvas) {
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
        if(currentCurve > 0){
            currentCurve--;
        }
        updateCountersOnDisplay();
    }

    function deleteCurve(){
        //Deleta a curva atual
        controlPointXArray.splice(currentCurve, 1);
        controlPointYArray.splice(currentCurve, 1);

        if(currentCurve == 0){
            controlPointXArray[currentCurve] = [];
            controlPointYArray[currentCurve] = [];
        }
        updateCanvas();

        if(amountCurves > 0){
            currentCurve--;
            amountCurves--;
        }else{
            amountCurves = 0;
            currentCurve = 0;
        }
        updateCountersOnDisplay()
    }

    function cleanCanvas(){
        //Limpa o canvas inteiro
        context.clearRect(0,0,1300, 700);
        controlPointXArray = [];
        controlPointYArray = [];
        currentCurve = 0;
        amountCurves = 0;
        controlPointXArray[currentCurve] = [];
        controlPointYArray[currentCurve] = [];
        updateCountersOnDisplay();
    }

    function updateCanvas(){
        context.clearRect(0,0,1300, 700);
        var lastX, lastY;
        for(var i = 0; i < controlPointXArray.length; i++){
            for(var j = 0; j < controlPointXArray[i].length; j++){
                context.beginPath();
                context.arc(controlPointXArray[i][j], controlPointYArray[i][j], 3, 0, Math.PI * 2);
                context.fill();
                if(j > 0){
                    context.moveTo(controlPointXArray[i][j - 1], controlPointYArray[i][j - 1]);
                    context.lineTo(controlPointXArray[i][j], controlPointYArray[i][j]);
                }
                
                context.stroke();
            }
        }
    }

    function deCasteljau(currentEvalutionPoint){
        var u = currentEvalutionPoint / amountEvaluations;
        var auxArrayX = [];
        var auxArrayY = [];

        for(var i = 0; i < controlPointXArray[currentCurve].length; i++){
            auxArrayX[i] = controlPointXArray[currentCurve][i];
            auxArrayY[i] = controlPointYArray[currentCurve][i];
        }

        console.log("X: " + auxArrayX);
        console.log("Y: " + auxArrayY);


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

        //Impedir que o usuario quebre o programa com uma ma entrada
        if(amountEvaluations <= 0){
            amountEvaluations = 1;
        }
        for(var i = 1; i <= amountEvaluations; i++){
            //console.log("Tiago, o i eh: "+ i);
            deCasteljau(i);
        }

        for(var i = 0; i < curveArrayX[currentCurve].length; i++){
            //Desenha o ponto
            //console.log(curveArrayX[currentCurve].length);
            //console.log("Desenhando o ponto " + i + " X: " +curveArrayX[currentCurve][i] + "  e Y: " +curveArrayY[currentCurve][i])
            context.fillStyle = "#ff2626";
            context.beginPath();
            context.arc(curveArrayX[currentCurve][i], curveArrayY[currentCurve][i], 1, 0, Math.PI * 2);
            context.fill();
            context.stroke();
        }
    }