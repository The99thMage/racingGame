class Game{
    constructor(){
        
    }

    getState(){
        var gameStateRef = database.ref('gameState');
        gameStateRef.on("value", function(data){
            gameState = data.val();
        });
    }

    updateState(state){
        database.ref('/').update({
            gameState: state
        });
    }

    async start(){
        if(gameState === 0){
            player = new Player();
            var playerCountRef = await database.ref('playerCount').once("value");
            
            if(playerCountRef.exists()){
                playerCount = playerCountRef.val();
                player.getCount();
            }

            form = new Form();
            form.display();
        }
        car1 = createSprite(300, 200);
        car2 = createSprite(510, 200);
        car3 = createSprite(720, 200);
        car4 = createSprite(930, 200);

        car1.addImage("car1", car1_img);
        car2.addImage("car2", car2_img);
        car3.addImage("car3", car3_img);
        car4.addImage("car4", car4_img);

        cars = [car1, car2, car3, car4];

        passedFinish = false;
    }

    play(){
        form.hide();

        Player.getPlayerInfo();
        player.getFinishedPlayers();

        if(allPlayers !== "undefined"){
            //var displayPos = 150;
            image(track_img, 0, -displayHeight*3.62, displayWidth, displayHeight*5);

            var index = 0;
            var x = 200;
            var y;
            for(var plr in allPlayers){
                index += 1;
                x = 200 + (index * 200) + allPlayers[plr].xPos;
                y = displayHeight - allPlayers[plr].distance - 70;
    

                if(index === player.index){
                    fill("red");

                    camera.position.x = displayWidth/2;
                    camera.position.y = cars[index - 1].y;
                }else{
                    fill("white");
                }

                cars[index - 1].x = x;
                cars[index - 1].y = y;

                textAlign(CENTER);
                textSize(20);
                text(allPlayers[plr].name, cars[index - 1].x, cars[index - 1].y + 75);
            }
        }

        if(finishedPlayers === 4){
            console.log(finishedPlayers);
            game.updateState(2);
        }

        if(player.distance < 3400){
            console.log(player.index);
            if(keyIsDown(38) && player.index !== null){
                yVel += 3;
                if(keyIsDown(37) && player.index !== null){
                    xVel -= 0.2;
                }
                if(keyIsDown(39) && player.index !== null){
                    xVel += 0.2;
                }
            }else{
                yVel *= 0.95;
                xVel *= 0.95;
            }
        }else if(passedFinish === false){
            yVel *= 0.7;
            xVel *= 0.7;
            Player.updateFinishedPlayers();
            player.place = finishedPlayers;
            console.log(player.place);

            player.updateName();
            passedFinish = true;
        }else{
            yVel *= 0.8;
            xVel *= 0.8;
        }

        //move the car
        player.distance += yVel;
        yVel *= 0.98;
        player.xPos += xVel;
        xVel *= 0.985;
        player.updateName();
        //display sprites
        drawSprites();
    }
}