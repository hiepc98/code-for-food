
const heightInit = document.scrollingElement.scrollHeight
let scrollBefore = 0;
window.addEventListener("scroll", (event) => { 
    const scrolled = window.scrollY;
    console.log('scroll');
    if (scrollBefore >= scrolled) {
        // console.log("ScrollUP");
    } else {
        scrollBefore = scrolled;
        // console.log("ScrollDOWN");
        let point = 10000
        if (scrolled > heightInit){
            point = 10
        }
        // browser.runtime.sendMessage(point)
        // chrome.runtime.sendMessage({ name: 'test' })
        
    } 
});