const canvas = document.getElementById('fishingCanvas');
const ctx = canvas.getContext('2d');

    let score = 0;
    let isFishing = false;
    let caughtFishList = []; // Track the caught fish

    const lakeWidth = canvas.width;
    const lakeHeight = 500;

    let fish = [
      { x: 700, y: 100, size: 20, isCaught: false, velocityX: -0.25 },
      { x: 500, y: 350, size: 30, isCaught: false, velocityX: -0.75 },
      { x: 300, y: 400, size: 30, isCaught: false, velocityX: -1 },
      { x: 100, y: 300, size: 30, isCaught: false, velocityX: -1.5 },
      { x: 1000, y: 150, size: 30, isCaught: false, velocityX: -0.75 },
      { x: 1200, y: 200, size: 30, isCaught: false, velocityX: -0.6 },
      { x: 1400, y: 250, size: 15, isCaught: false, velocityX: -0.5 },
    ];
    // Define fixed spots for grass
    const grassSpots = [
        { x: 100, y: 550 },
        { x: 300, y: 570 },
        { x: 500, y: 590 },
        { x: 700, y: 600 },
        { x: 900, y: 580 },
        { x: 1100, y: 560 },
        { x: 1300, y: 540 }
    ];
    function downloadCanvas() {
        window.requestAnimationFrame(function() {
            var dataURL = canvas.toDataURL('image/png');
            var a = document.createElement('a');
            a.href = dataURL;
            a.download = 'canvas-screenshot.png';
            a.click();
        });
    }
    function addDownloadButton() 
    {
        // Create a button element
        const button = document.createElement('button');

        // Create an image element
        const buttonImage = document.createElement('img');
        buttonImage.src = 'download.png'; // Set the image source
        buttonImage.style.width = '120px'; // Adjust as needed
        buttonImage.style.height = '100px'; // Adjust as needed
        // Append the image element to the button
        button.appendChild(buttonImage);

        // Set button styles
        button.style.position = 'absolute';
        button.style.top = '85px'; // Adjust as needed
        button.style.right = '-15px'; // Adjust as needed
        button.style.padding = '10px';
        button.style.background = 'transparent';
        button.style.color = 'white';
        button.style.border = 'none';
        button.style.borderRadius = '5px';
        button.style.cursor = 'pointer';

        // Add event listener to trigger download action
        button.addEventListener('click', downloadCanvas);

        // Append the button to the HTML document body
        document.body.appendChild(button);
    }
    
    function drawWater() 
    {
        const waterLevel = lakeHeight + Math.sin(Date.now() * 0.002) * 10; // Adjust amplitude and speed
        const waveAmplitude = 40; // Adjust the amplitude of the waves
        const waveLength = 150; // Adjust the length of each wave segment
        const numSegments = Math.ceil(lakeWidth / waveLength);

        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, '#82b7f7'); // Start color
        gradient.addColorStop(1, '#378bf1'); // End color
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(lakeWidth, 0);
        ctx.lineTo(lakeWidth, waterLevel);

        for (let i = 0; i < numSegments; i++) 
        {
        const x1 = i * waveLength;
        const y1 = waterLevel - Math.sin(i * 0.5 + Date.now() * 0.002) * waveAmplitude;
        const x2 = (i + 3) * waveLength;
        const y2 = waterLevel - Math.sin((i + 1) * 0.5 + Date.now() * 0.002) * waveAmplitude;
        const cx = (x1 + x2) / 2;
        const cy = (y1 + y2) / 2;
        ctx.quadraticCurveTo(cx, cy, x2, y2);
        }

        ctx.lineTo(lakeWidth, canvas.height);
        ctx.lineTo(0, canvas.height);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#80c904';
        ctx.fillRect(0, waterLevel-35, lakeWidth, canvas.height - waterLevel);
    }
    function drawGrassBlade(x, y) 
    {
        // Define control points for quadratic curve to give a curved shape
        const cx1 = x + 0; // Adjust curvature as needed
        const cy1 = y - 50; // Adjust curvature as needed
        const cx2 = x + 5; // Adjust curvature as needed
        const cy2 = y + 50; // Adjust curvature as needed
        // Draw grass blade
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.quadraticCurveTo(cx1, cy1, x + 100, y - 40); // Adjust curvature and length as needed
        ctx.quadraticCurveTo(cx2, cy2, x + 20, y); // Adjust curvature as needed
        ctx.strokeStyle = '#66a103'; // Adjust color and opacity
        ctx.lineWidth = 1; // Adjust line width
        ctx.stroke();
        ctx.closePath();
    }
    function drawFish(x, y, size) 
    {
      ctx.fillStyle = 'orange';
      // Draw fish body
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.quadraticCurveTo(x + size * 0.6, y - size * 0.8, x + size * 1.2, y - size * 0.4);
      ctx.quadraticCurveTo(x + size * 1.2, y, x + size * 1.2, y + size * 0.4);
      ctx.quadraticCurveTo(x + size * 0.6, y + size * 0.8, x, y);
      ctx.closePath();
      ctx.fill();

      // Eye
      ctx.fillStyle = 'black';
      ctx.beginPath();
      ctx.arc(x + size * 0.4, y, size * 0.1, 0, Math.PI * 2);
      ctx.fill();

      // Tail
      ctx.fillStyle ='orange';
      ctx.beginPath();
      ctx.moveTo(x + size * 1.2, y);
      ctx.lineTo(x + size * 1.5, y - size * 0.5);
      ctx.lineTo(x + size * 1.5, y + size * 0.5);
      ctx.closePath();
      ctx.fill();
    }
    function drawMan() 
    {
        // Head
        ctx.fillStyle = '#dbbba4';
        ctx.beginPath();
        ctx.arc(750, 370, 20, 0, Math.PI * 2);
        ctx.fill();
        // Body
        ctx.fillStyle = '#292424';
        ctx.fillRect(728, 390, 47, 55);    
        // Legs
        ctx.fillStyle = '#dbbba4';
        ctx.fillRect(740, 445, 8, 40);
        ctx.fillRect(752, 445, 8, 40);  
        // Arms
        ctx.fillRect(720, 400, 8, 30);
        ctx.fillRect(775, 400, 8, 30);
    }

    function drawdock() 
    {
        // Draw dock
        ctx.fillStyle = 'brown';
        ctx.fillRect(700, 380, 100, 120);
    }

    function draw() 
    {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawWater();
        //ground
        ctx.fillStyle='#80c904'; //#66a103
        ctx.fillRect(0,lakeHeight,canvas.width,canvas.height-lakeHeight);

        // Draw grass on fixed spots
        grassSpots.forEach(spot => {
        // Draw grass blades
        drawGrassBlade(spot.x, spot.y);
        });
        // Draw fish
        fish = fish.filter(f => !f.isCaught); // Filter out caught fish
        fish.forEach(f => {
            if (!f.isCaught) 
            {
                drawFish(f.x,f.y,f.size);
            }
            // Update fish position
            f.x += f.velocityX;
            if (f.x < 0) 
            {
                f.x = lakeWidth;
            } 
            else if(f.x > lakeWidth) 
            {
                f.x = 0;
            }
        });
        // Draw Dock
        drawdock();   
        // Draw man
        drawMan();     
        // Draw rope if fishing
        if (isFishing) 
        {
            ctx.strokeStyle='black';
            ctx.beginPath();
            ctx.moveTo(750, 450); // starting position of rope (man's hand)
            ctx.lineTo(mouseX, mouseY); // ending position (mouse position)
            ctx.stroke();
        } 
        else if (caughtFishList.length > 0)
        {
            // Draw rope back to fishing rod along with the caught fish
            caughtFishList.forEach((fish, index) => {
            const targetX = 750 + index * 40; // Adjust the space between each caught fish
            const targetY = 450;
            ctx.strokeStyle='black';
            ctx.beginPath();
            ctx.moveTo(fish.x, fish.y); // starting position of rope (fish position)
            ctx.lineTo(targetX, targetY); // ending position (fishing rod)
            ctx.stroke();

            // Animate fish to the man's position
            animateFish(fish, targetX, targetY);

            // Draw the caught fish at its new position
            drawFish(fish.x - fish.size, fish.y - fish.size, fish.size *1.5);
            });
        }

        // Display score
        ctx.fillStyle = 'black';
        ctx.font = "30px Verdana";
        ctx.fillText('Count: ' + score, 20, 40,100);
        requestAnimationFrame(draw);
    }

    function captureFish() 
    {
        fish.forEach((f, index) => 
        {
            if (!f.isCaught && Math.sqrt((clickX - f.x) ** 2 + (clickY - f.y) ** 2) < f.size) 
            {
            f.isCaught = true;
            score++;
            playSound();
            caughtFishList.push(f); // Track the caught fish
            }
        });
    }

    function animateFish(fish, targetX, targetY) 
    {
        const dx = targetX - fish.x;
        const dy = targetY - fish.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const speed = 2; // Adjust speed as needed
        if (distance > speed) 
        {
        fish.x += (dx / distance) * speed;
        fish.y += (dy / distance) * speed;
        } 
        else 
        {
        // Fish has reached the target position
        caughtFishList.splice(caughtFishList.indexOf(fish), 1); // Remove fish from caughtFishList
        }
    }
    
    function playSound() 
    {
        const sound = new Audio('Sound.mp3'); 
        sound.play();
    }

    let mouseX, mouseY, clickX, clickY;
    canvas.addEventListener('mousemove', function(event) {
      mouseX = event.clientX - canvas.getBoundingClientRect().left;
      mouseY = event.clientY - canvas.getBoundingClientRect().top;
    });

    canvas.addEventListener('click', function(event) {
        clickX = event.clientX - canvas.getBoundingClientRect().left;
        clickY = event.clientY - canvas.getBoundingClientRect().top;
      if (!isFishing) {
        isFishing = true;
        captureFish();
        setTimeout(function() {
          isFishing = false;
        }, 300);
      }
    });
    addDownloadButton();
    draw();