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
        document.getElementById("amount").innerHTML = "Amount Curves: "+ amountCurves;
        document.getElementById("current").innerHTML = "Current Curve: "+ currentCurve;
    
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
            document.getElementById("log").innerHTML = "Amount Curves: "+ amountCurves;
            document.getElementById("log2").innerHTML = "Current Curve: "+ currentCurve;
        }

        function nextCurve(){
            //Cicla, dentre as curvas existente para a proxima
            if(currentCurve < amountCurves){
                currentCurve++;
            }
            document.getElementById("log").innerHTML = "Amount Curves: "+ amountCurves;
            document.getElementById("log2").innerHTML = "Current Curve: "+ currentCurve;
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
            amountCurves--;
            if(amountCurves > 0){
                //currentCurve--;
            }else{
                //currentCurve = 0;
            }
            
            updateCanvas();
            currentCurve
            document.getElementById("log").innerHTML = "Amount Curves: "+ amountCurves;
            document.getElementById("log2").innerHTML = "Current Curve: "+ currentCurve;
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
        }

        function updateCanvas(){
            context.clearRect(0,0,1300, 700);
            for(var i = 0; i < curvesArrayX.length; i++){
                for(var j = 0; j < curvesArrayX[i].length; j++){
                    context.beginPath();
                    context.arc(curvesArrayX[i][j], curvesArrayY[i][j], 3, 0, Math.PI * 2);
                    context.fill();
                    context.stroke();
                }
            }
        }

        function drawCurve(){
            //This function uses De Casteljau's Algorithm to create Bezier Curves
            for(var i = 0; i < curvesArrayX.length;i++){
                
            }
        }