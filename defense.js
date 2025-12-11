/**
 * NEURAL MATRIX VAULT | DEFENSE PROTOCOL v1.0
 * ANTI-THEFT / UI LOCKDOWN
 */

document.addEventListener('contextmenu', event => event.preventDefault());

document.onkeydown = function(e) {
    // DISABLE F12 (DEV TOOLS)
    if(e.keyCode == 123) {
        return false;
    }
    // DISABLE CTRL+U (VIEW SOURCE)
    if(e.ctrlKey && e.keyCode == 'U'.charCodeAt(0)) {
        return false;
    }
    // DISABLE CTRL+S (SAVE PAGE)
    if(e.ctrlKey && e.keyCode == 'S'.charCodeAt(0)) {
        return false;
    }
    // DISABLE CTRL+SHIFT+I (DEV TOOLS)
    if(e.ctrlKey && e.shiftKey && e.keyCode == 'I'.charCodeAt(0)) {
        return false;
    }
    // DISABLE CTRL+SHIFT+C (INSPECT ELEMENT)
    if(e.ctrlKey && e.shiftKey && e.keyCode == 'C'.charCodeAt(0)) {
        return false;
    }
    // DISABLE CTRL+SHIFT+J (CONSOLE)
    if(e.ctrlKey && e.shiftKey && e.keyCode == 'J'.charCodeAt(0)) {
        return false;
    }
}

// CONSOLE BANNER (PSYCHOLOGICAL WARFARE)
// If they manage to open the console, they see this warning.
console.log("%cSTOP.", "color: red; font-size: 50px; font-weight: bold; -webkit-text-stroke: 1px black;");
console.log("%cThis is a sovereign digital territory. Access to source code is restricted.", "font-size: 20px; color: white; background: red; padding: 5px;");
console.log("%cDuplication of this artifact is a violation of international copyright law.", "font-size: 16px; color: #ccc;");
