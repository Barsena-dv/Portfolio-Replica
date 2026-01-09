// ------------------ Locomotive Scroll ------------------ //
const scroll = new LocomotiveScroll({
    el: document.querySelector('#main'),
    smooth: true
});

// ------------------ Page Intro Animation ------------------ //
function firstPageAnim() {
    let tl = gsap.timeline();

    tl.from("#nav", {
        y: 10,
        opacity: 0,
        delay: 1,
        duration: 1.5,
        ease: "expo.inOut"
    })
        .to(".boundingelem", {
            y: 0,
            ease: "expo.inOut",
            duration: 2,
            stagger: 0.2
        })
        .to(".boundingelem2", {
            y: 0,
            ease: "expo.inOut",
            delay: -1,
            duration: 2,
            stagger: 0.2
        })
        .from("#herofooter", {
            y: 10,
            opacity: 0,
            duration: 2,
            ease: "expo.inOut"
        }, "-=1");
}

// ------------------ Circle Follower ------------------ //
function circleMouseFollower() {
    const minicircle = document.querySelector("#minicircle");
    if (!minicircle || minicircle.dataset.initialized) return;
    minicircle.dataset.initialized = "true";
    
    let mouseX = 0, mouseY = 0;
    let circleX = 0, circleY = 0;
    let prevX = 0, prevY = 0;
    let stretchX = 1, stretchY = 1;
    let smoothedVelocity = 0;
    let animationId = null;
    let timeout;
    const THRESHOLD = 8;
    let active = false;
    
    const FOLLOW_SPEED = 0.15;
    const STRETCH_EASE = 0.1;
    const MAX_STRETCH = 1.2;
    const MIN_STRETCH = 0.7;
    minicircle.style.opacity = 0;
    function animate() {
        if (!active) return;
        
        prevX = circleX;
        prevY = circleY;
        
        circleX += (mouseX - circleX) * FOLLOW_SPEED;
        circleY += (mouseY - circleY) * FOLLOW_SPEED;
        
        const vx = circleX - prevX;
        const vy = circleY - prevY;
        const velocity = Math.sqrt(vx * vx + vy * vy);
        smoothedVelocity += (velocity - smoothedVelocity) * 0.1;
        const angle = Math.atan2(vy, vx) * (180 / Math.PI);
        
        let targetX = 1, targetY = 1;
        if (smoothedVelocity >= THRESHOLD) {
            const factor = Math.min((smoothedVelocity - THRESHOLD) * 0.2, 1);
            targetX = 1 + (MAX_STRETCH - 1) * factor;
            targetY = 1 - (1 - MIN_STRETCH) * factor;
        }
        
        stretchX += (targetX - stretchX) * STRETCH_EASE;
        stretchY += (targetY - stretchY) * STRETCH_EASE;
        
        minicircle.style.transform =
        `translate(${circleX - 6}px, ${circleY - 6}px) rotate(${angle}deg) scale(${stretchX}, ${stretchY})`;
        
        animationId = requestAnimationFrame(animate);
    }
    
    // mousemove → update target
    window.addEventListener("mousemove", e => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        minicircle.style.opacity = "1";
        
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            minicircle.style.transform =
            `translate(${circleX - 6}px, ${circleY - 6}px) scale(1,1)`;
        }, 100);
        
        if (!active) {
            active = true;
            animate();
        }
    });
    
    // mouse enter → show
    window.addEventListener("mouseenter", e => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        minicircle.style.transition = "opacity 0.2s ease, transform 0.2s ease";
        minicircle.style.opacity = "1";
        minicircle.style.transform =
        `translate(${mouseX - 6}px, ${mouseY - 6}px) scale(1,1)`;
        
        if (!active) {
            active = true;
            animate();
        }
    });
    
    // mouse leave → hide
    window.addEventListener("mouseleave", () => {
        minicircle.style.transition = "opacity 0.3s ease, transform 0.3s ease";
        minicircle.style.opacity = "0";
        minicircle.style.transform =
        `translate(${circleX - 1}px, ${circleY - 1}px) scale(0,0)`;
        active = false;
        if (animationId) cancelAnimationFrame(animationId);
    });
    window.addEventListener("mouseout", function () {
        minicircle.style.opacity = 0; // hide when mouse leaves window
    });
}

// ------------------ Image pop up ------------------ //
document.querySelectorAll(".elem").forEach(function (elem){
    var rotate = 0;
    var diffrot = 0;

    elem.addEventListener("mouseleave", function (dets){
        gsap.to(elem.querySelector("img"),{
            opacity: 0,
            ease: Power3,
        })
    })

    

    elem.addEventListener("mousemove", function (dets){
        var rect = elem.getBoundingClientRect();
    var img = elem.querySelector("img");

    // Mouse position relative to elem
    var mouseX = dets.clientX - rect.left;
    var mouseY = dets.clientY - rect.top;
        diffrot = dets.clientX - rotate;
        rotate = dets.clientX;
        gsap.to(elem.querySelector("img"),{
            opacity: 1,
            ease: Power3,
            top: mouseY - img.offsetHeight / 2,  // center vertically
        left: mouseX - img.offsetWidth / 2, // center horizontally
            rotate: gsap.utils.clamp(-40, 40, diffrot*0.5)
        })
    })
})

circleMouseFollower();
firstPageAnim();

let anchoreffect = document.querySelectorAll("a");

let anchor = function(){
    anchoreffect.forEach(a => {
        a.addEventListener("mouseover", () => {
            document.querySelector("#minicircle").style.width = "20px";
            document.querySelector("#minicircle").style.height = "20px";
        });

        a.addEventListener("mouseleave", () => {
            document.querySelector("#minicircle").style.width = "12px";
            document.querySelector("#minicircle").style.height = "12px";
        });
    });
}

anchor();

let imageCircle = document.querySelectorAll(".elem");

let iCircle = function(){
    imageCircle.forEach(e => {
        let p;

        e.addEventListener("mouseenter", () => {
            const minicircle = document.querySelector("#minicircle");
            minicircle.classList.add("expanded");
            minicircle.style.width = "50px";
            minicircle.style.height = "50px";
            minicircle.style.mixBlendMode = "normal"; // remove difference

            // create text if not exists
            if (!p) {
                p = document.createElement("p");
                p.textContent = "View";
                minicircle.appendChild(p);
            }
        });

        e.addEventListener("mouseleave", () => {
            const minicircle = document.querySelector("#minicircle");
            minicircle.classList.remove("expanded");
            minicircle.style.width = "12px";
            minicircle.style.height = "12px";
            minicircle.style.mixBlendMode = "difference"; // restore blend mode

            if (p) {
                p.remove();
                p = null;
            }
        });
    });
};

iCircle();
