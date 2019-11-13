//Hugo Falcao - Recife, Brazil 12/11/2019

/*
    Coisas a serem resolvidas:
            - Bugs:
                - Fazer varias curvas, voltar ate uma das iniciais e depois apagar ela buga as demais
                - Deletar varias curvas em seguida sem curvas existentes buga a criacao de novas

            - Implementacao
                - Feature de selecionar, mover e deletar pontos nao implementada
                - Criacao de curvas em si nao implementada
                - Ciclar entre objetos visiveis usuando checkcboxes (pontos, retas e curvas)
                - Campo de definição de número de avaliações/retas

            - Refatoramento
                - Fazer design de botoes mais bonitos
                - Refatorar codigo e retirar mas praticas do html e css


*/
    
    
  
    //Variaveis globais para todo o codigo
    var canvas, context, curvesArrayX, curvesArrayY, currentCurve, amountCurves; 
            
    function init(){
        //Inicializa as variaveis globais
        curvesArrayX = [];
        curvesArrayY = [];
        currentCurve = 0;
        amountCurves = 0;
        curvesArrayX[currentCurve] = [];
        curvesArrayY[currentCurve] = [];
        canvas = document.getElementById("myCanvas");
        context = canvas.getContext("2d");
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
        var arraySize = curvesArrayX[currentCurve].length;
        if(arraySize >= 1){ 
            drawLine(position.x, position.y);
        }

        //Adiciona o novo ponto ao array de pontos
        curvesArrayX[currentCurve].push(position.x);
        curvesArrayY[currentCurve].push(position.y);
    }

    function getMousePosition(event, canvas) {
        var rect = canvas.getBoundingClientRect();
        return {
                x: event.clientX - rect.left,
                y: event.clientY - rect.top
            }
    }

    function drawLine(x, y){
        var arraySize = curvesArrayX[currentCurve].length;
        if(arraySize >= 1){
            //Verifica quantidade de pontos no array, antes de tentar criar uma reta
            var lastX = curvesArrayX[currentCurve][arraySize - 1];
            var lastY = curvesArrayY[currentCurve][arraySize - 1];
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
        curvesArrayX[amountCurves] = [];
        curvesArrayY[amountCurves] = [];
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
        document.getElementById("log").innerHTML = "Amount Curves: "+ amountCurves;
        document.getElementById("log2").innerHTML = "Current Curve: "+ currentCurve;
    }

    function deleteCurve(){
        //Deleta a curva atual
        curvesArrayX.splice(currentCurve, 1);
        
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
        curvesArrayX = [];
        curvesArrayY = [];
        currentCurve = 0;
        amountCurves = 0;
        curvesArrayX[currentCurve] = [];
        curvesArrayY[currentCurve] = [];
        updateCountersOnDisplay();
    }

    function updateCanvas(){
        context.clearRect(0,0,1300, 700);
        var lastX, lastY;
        for(var i = 0; i < curvesArrayX.length; i++){
            for(var j = 0; j < curvesArrayX[i].length; j++){
                context.beginPath();
                context.arc(curvesArrayX[i][j], curvesArrayY[i][j], 3, 0, Math.PI * 2);
                context.fill();
                if(j > 0){
                    context.moveTo(curvesArrayX[i][j - 1], curvesArrayY[i][j - 1]);
                    context.lineTo(curvesArrayX[i][j], curvesArrayY[i][j]);
                }
                
                context.stroke();
            }
        }
    }

    function drawCurve(){
        //This function uses De Casteljau's Algorithm to create Bezier Curves
        for(var i = 0; i < curvesArrayX.length;i++){
                
        }
    }

    function updateCountersOnDisplay(){
        document.getElementById("amount").innerHTML = "Amount Curves: "+ amountCurves;
        document.getElementById("current").innerHTML = "Current Curve: "+ currentCurve;
    }