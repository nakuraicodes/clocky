import { CLOCK_RADIUS } from "./clock-constants.js";
import { getRadian, getHoursDegreeAngle } from "./utils.js";
let clockElmt = null;
let hourHandElmt = null;
let minuteHandElmt = null;
let secondHandElmt = null;

function addLineToClock(x1, y1, x2, y2) {
  const newLine = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "line"
  );
  newLine.setAttribute("x1", x1);
  newLine.setAttribute("y1", y1);
  newLine.setAttribute("x2", x2);
  newLine.setAttribute("y2", y2);
  newLine.setAttribute("stroke", "black");
  newLine.setAttribute("stroke-width", "0.3");
  newLine.setAttribute("stroke-linecap", "round");
  clockElmt.appendChild(newLine);
}
function drawClockBorder() {
  const border = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "circle"
  );
  border.setAttribute("cx", "50");
  border.setAttribute("cy", "50");
  border.setAttribute("r", CLOCK_RADIUS);
  border.setAttribute("stroke", "black");
  border.setAttribute("stroke-width", "0.5");
  border.setAttribute("fill", "white");
  clockElmt.appendChild(border);
}
function drawClockCenter() {
  const center = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "circle"
  );
  center.setAttribute("cx", "50");
  center.setAttribute("cy", "50");
  center.setAttribute("r", 1);
  center.setAttribute("stroke", "black");
  center.setAttribute("stroke-width", "0.2");
  center.setAttribute("fill", "white");
  clockElmt.appendChild(center);
}

function addTextToClock(x, y, number) {
  const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
  text.setAttribute("x", x);
  text.setAttribute("y", y);
  text.setAttribute("font-size", "4");
  text.setAttribute("text-anchor", "middle");
  text.innerHTML = number;
  clockElmt.appendChild(text);
}

function drawMinuteHand(minutes) {
  const minuteRadianAngle = getRadian(minutes * 6 - 90);
  const cosinus = Math.cos(minuteRadianAngle);
  const sinus = Math.sin(minuteRadianAngle);
  const x1Minutes = (CLOCK_RADIUS - 15) * cosinus + 50;
  const y1Minutes = (CLOCK_RADIUS - 15) * sinus + 50;
  if (!minuteHandElmt) {
    minuteHandElmt = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "line"
    );
    minuteHandElmt.setAttribute("stroke", "black");
    minuteHandElmt.setAttribute("stroke-width", "0.6");
    minuteHandElmt.setAttribute("stroke-linecap", "round");
    clockElmt.appendChild(minuteHandElmt);
  }
  minuteHandElmt.setAttribute("x1", x1Minutes);
  minuteHandElmt.setAttribute("y1", y1Minutes);
  minuteHandElmt.setAttribute("x2", 50);
  minuteHandElmt.setAttribute("y2", 50);
}
function drawSecondsHand(seconds) {
  const secondRadianAngle = getRadian(seconds * 6 - 90);
  const cosinus = Math.cos(secondRadianAngle);
  const sinus = Math.sin(secondRadianAngle);
  const x1Seconds = (CLOCK_RADIUS - 10) * cosinus + 50;
  const y1Seconds = (CLOCK_RADIUS - 10) * sinus + 50;
  if (!secondHandElmt) {
    secondHandElmt = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "line"
    );
    secondHandElmt.setAttribute("stroke", "red");
    secondHandElmt.setAttribute("stroke-width", "0.3");
    secondHandElmt.setAttribute("stroke-linecap", "round");
    clockElmt.appendChild(secondHandElmt);
  }
  secondHandElmt.setAttribute("x1", x1Seconds);
  secondHandElmt.setAttribute("y1", y1Seconds);
  secondHandElmt.setAttribute("x2", 50);
  secondHandElmt.setAttribute("y2", 50);
}
function drawHoursHand(hours) {
  const hoursDegreeAngle = getHoursDegreeAngle(hours);
  const hourRadianAngle = getRadian(hoursDegreeAngle);
  const cosinus = Math.cos(hourRadianAngle);
  const sinus = Math.sin(hourRadianAngle);
  const x1Seconds = (CLOCK_RADIUS - 20) * cosinus + 50;
  const y1Seconds = (CLOCK_RADIUS - 20) * sinus + 50;
  if (!hourHandElmt) {
    hourHandElmt = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "line"
    );
    hourHandElmt.setAttribute("stroke", "black");
    hourHandElmt.setAttribute("stroke-width", "1");
    hourHandElmt.setAttribute("stroke-linecap", "round");
    clockElmt.appendChild(hourHandElmt);
  }
  hourHandElmt.setAttribute("x1", x1Seconds);
  hourHandElmt.setAttribute("y1", y1Seconds);
  hourHandElmt.setAttribute("x2", 50);
  hourHandElmt.setAttribute("y2", 50);
}

function createSVG(shadowRoot, clockWrapperSelector) {
  clockElmt = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  clockElmt.setAttribute("id", "clock");
  clockElmt.setAttribute("viewBox", "0 0 100 100");
  clockElmt.setAttribute("namespace:xmlns", "http://www.w3.org/2000/svg");
  shadowRoot.querySelector(clockWrapperSelector).appendChild(clockElmt);
}

export function getClockElmt() {
  return clockElmt;
}

export function setHands() {
  const now = new Date();
  drawMinuteHand(now.getMinutes());
  drawSecondsHand(now.getSeconds());
  drawHoursHand(now.getHours());
}

export function drawClock(shadowRoot, clockWrapperSelector) {
  try {
    createSVG(shadowRoot, clockWrapperSelector);
    drawClockBorder();
    for (let angle = 0; angle < 360; angle += 30) {
      const radianAngle = getRadian(angle);
      const cosinus = Math.cos(radianAngle);
      const sinus = Math.sin(radianAngle);
      const x1 = CLOCK_RADIUS * cosinus + 50;
      const y1 = CLOCK_RADIUS * sinus + 50;
      const x2 = (CLOCK_RADIUS - 1) * cosinus + 50;
      const y2 = (CLOCK_RADIUS - 1) * sinus + 50;
      const xText = (CLOCK_RADIUS - 4) * cosinus + 50;
      const yText = (CLOCK_RADIUS - 4) * sinus + 51;

      // coordinate at angle 0 are in place of the 3 so we make some adjustment here
      let clockNumber = (angle / 30 + 3) % 12;
      if (clockNumber === 0) {
        clockNumber = 12;
      }
      addLineToClock(x1, y1, x2, y2);
      addTextToClock(xText, yText, clockNumber);
    }
    setHands();
    drawClockCenter();
  } catch (error) {
    console.log("ERROR ", error.message);
  }
}
