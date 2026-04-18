// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// Initialize Lenis for buttery smooth scrolling
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
    infinite: false,
});

// Hook Lenis into GSAP ScrollTrigger
lenis.on('scroll', ScrollTrigger.update);

gsap.ticker.add((time)=>{
  lenis.raf(time * 1000);
});

gsap.ticker.lagSmoothing(0);

// --- Custom Magnetic Cursor ---
const cursorDot = document.querySelector('.cursor-dot');
const cursorOutline = document.querySelector('.cursor-outline');

window.addEventListener('mousemove', (e) => {
    const posX = e.clientX;
    const posY = e.clientY;
    
    // Dot follows instantly
    gsap.to(cursorDot, {
        x: posX,
        y: posY,
        duration: 0.1
    });
    
    // Outline follows with delay
    gsap.to(cursorOutline, {
        x: posX,
        y: posY,
        duration: 0.8,
        ease: "power2.out"
    });
});

// Magnetic hover effects
const magnetics = document.querySelectorAll('[data-magnetic]');

magnetics.forEach(el => {
    // Hover state styling
    el.addEventListener('mouseenter', () => {
        cursorOutline.classList.add('hover');
    });
    
    el.addEventListener('mouseleave', () => {
        cursorOutline.classList.remove('hover');
        // Reset element position when mouse leaves
        gsap.to(el, { x: 0, y: 0, duration: 0.5, ease: "power2.out" });
    });
    
    // Magnetic pull effect
    el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        // Calculate distance from center of element
        const x = (e.clientX - rect.left) - rect.width / 2;
        const y = (e.clientY - rect.top) - rect.height / 2;
        
        // Move element slightly towards mouse (strength: 0.3)
        gsap.to(el, {
            x: x * 0.3,
            y: y * 0.3,
            duration: 0.5,
            ease: "power2.out"
        });
    });
});

// --- Preloader & Hero Animation ---
// Split hero text into characters for staggered reveal
const heroText = new SplitType('.hero-title', { types: 'chars' });

let counterValue = 0;
const counterEl = document.querySelector('.counter');

// Disable scrolling during preloader
document.body.style.overflow = "hidden";
lenis.stop();

const preloaderTl = gsap.timeline({
    onComplete: () => {
        document.body.style.overflow = "auto";
        lenis.start();
    }
});

preloaderTl
    // Count up to 100
    .to(counterEl, {
        innerHTML: 100,
        duration: 2,
        snap: "innerHTML",
        ease: "power2.inOut"
    })
    // Slide preloader up
    .to('.preloader', {
        yPercent: -100,
        duration: 1.2,
        ease: "expo.inOut"
    })
    // Stagger in the hero characters
    .to('.hero-title .char', {
        y: 0,
        stagger: 0.05,
        duration: 1.2,
        ease: "expo.out"
    }, "-=0.6")
    // Fade up the hero subtext
    .to('.hero-sub', {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: "power2.out"
    }, "-=0.8");

// --- About Section Animations ---
// Split About text into words for scroll reveal
const aboutText = new SplitType('#about-text', { types: 'words' });

// Animate words opacity on scroll
gsap.to(aboutText.words, {
    opacity: 1,
    stagger: 0.1,
    scrollTrigger: {
        trigger: ".about",
        start: "top 60%",
        end: "center center",
        scrub: true
    }
});

// Parallax Image in About
gsap.to('.about-img', {
    yPercent: 15,
    ease: "none",
    scrollTrigger: {
        trigger: ".about-img-container",
        start: "top bottom",
        end: "bottom top",
        scrub: true
    }
});

// --- Projects Horizontal Scroll Takeover ---
const projectsContainer = document.querySelector('.projects-container');
const projectItems = gsap.utils.toArray('.project');

// Calculate total scroll distance needed
function getScrollAmount() {
    let containerWidth = projectsContainer.scrollWidth;
    return -(containerWidth - window.innerWidth);
}

const tween = gsap.to(projectsContainer, {
    x: getScrollAmount,
    ease: "none"
});

ScrollTrigger.create({
    trigger: ".projects-wrapper",
    start: "top top",
    end: () => `+=${getScrollAmount() * -1}`,
    pin: true,
    animation: tween,
    scrub: 1,
    invalidateOnRefresh: true
});
