let canvas;
let ctx;
let refresh;
let randomExp;
let particleList = [];
let rocketList = [];
const random = (max, min) =>{
  return(Math.floor(Math.random() * (max - min) + min));
}

const createExp = (x, y) => {
  fireWork = [];
  for (var i = 0; i <= 360; i++) {
    if(i % 3 == 1 || i == 0){
      fireWork.push(new particle(false, [x, y], 1, .1, i));
    }
  }
  particleList.push(fireWork);
}

const createRocket = (x, y) => {
  rocketList.push(new particle(true, [x, y], .5, -.5));
}

const draw = () =>{
  ctx.fillStyle = 'rgb(0, 0, 0)';
  ctx.fillRect(0,0, canvas.width, canvas.height);
  ctx.fillStyle = `rgb(${random(255, 0)},${random(255, 0)},${random(255, 0)})`;

  particleList.forEach((item) => {
    item.forEach((part) => {
      ctx.beginPath();
      ctx.arc(part.location[0],part.location[1],1,0,2*Math.PI);
      ctx.fill();
      ctx.closePath();
    });
  });

  ctx.fillStyle = `rgb(255, 0, 0)`;

  rocketList.forEach((part) => {
    ctx.beginPath();
    ctx.arc(part.location[0],part.location[1],1.25,0,2*Math.PI);
    ctx.fill();
    ctx.closePath();
  });
}

const update = () =>{
  var needsShifting = false;

  for (var a = rocketList.length; a > 0; a--) {
    const i = a - 1;
    if(rocketList[i].vector[1] > random(.08*canvas.height, 0)){
      createExp(rocketList[i].location[0], rocketList[i].location[1]);
      rocketList.splice(i, 1);
    }
    else{
      rocketList[i].move();
      rocketList[i].aForce([0, .0098]);
    }
  }

  particleList.forEach((item, i) => {
    if(item.length > 0){
      item.forEach((part, i) => {
        part.move();
        part.aForce([0, .0098]);
        if(part.vector[0] > 0){
          part.aForce([part.vector[0]*.004, 0]);
        }
        else{
          part.aForce([-part.vector[0]*.004, 0]);
        }
      });
    }
    else{
      needsShifting = true;
    }
  });


  if(needsShifting){
    particleList.shift();
  }

  particleList.forEach( item => {
    for(var i = item.length - 1; i >= 0; i--){
      if(item[i].lifeTime > item[i].deathTime){
        item.splice(i, 1);
      }
    }
  });
}

window.onload = function(){
  canvas = document.getElementById('canvas');
  ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  console.log("page loaded");
}

window.onresize = () =>{
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
};

document.addEventListener("click", (data) =>{
  createRocket(data.clientX, canvas.height - data.clientY);
});

refresh = setInterval(() =>{
  draw();
  update();
}, 10);

randomExp = setInterval(() => {
  randomXY = [random(canvas.width, 0), random(canvas.height, .15*canvas.height)]
  createRocket(randomXY[0], randomXY[1]);
}, 400);
