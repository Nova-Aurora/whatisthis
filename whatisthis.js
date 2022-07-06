import { startCanvas } from "./canvas.js";
const whatisthis = document.getElementById('whatisthis');
whatisthis.hidden = false;
/*autoResize(whatisthis);
autoPaint(whatisthis, './whatisthis.png');
*/
startCanvas(whatisthis, './whatisthis.png');