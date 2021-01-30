import { AM_RADIUS, PM_RADIUS } from "./clock-constants.js";
import { getHoursDegreeAngle, describeArc } from "./utils.js";

let plannerAm = null;
let plannerPm = null;
let clockElmt = null;

export class Planner {
  constructor(parent) {
    this.parent = parent;
    this.initPlanner();
  }
  initPlanner() {
    const clockWrapperSelector = "#" + this.parent.clockWrapperId;
    clockElmt = this.parent.shadowRoot.querySelector(clockWrapperSelector);
    plannerAm = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "circle"
    );
    plannerAm.setAttribute("cx", "50");
    plannerAm.setAttribute("cy", "50");
    plannerAm.setAttribute("r", AM_RADIUS);
    plannerAm.setAttribute("stroke", "grey");
    plannerAm.setAttribute("stroke-width", "0.2");
    plannerAm.setAttribute("fill", "transparent");
    clockElmt.appendChild(plannerAm);

    plannerPm = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "circle"
    );
    plannerPm.setAttribute("cx", "50");
    plannerPm.setAttribute("cy", "50");
    plannerPm.setAttribute("r", PM_RADIUS);
    plannerPm.setAttribute("stroke", "grey");
    plannerPm.setAttribute("stroke-width", "0.2");
    plannerPm.setAttribute("fill", "transparent");
    clockElmt.appendChild(plannerPm);
  }
}

export function initPlanner(shadowRoot, clockQuerySelector) {
  clockElmt = shadowRoot.querySelector(clockQuerySelector);
  plannerAm = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  plannerAm.setAttribute("cx", "50");
  plannerAm.setAttribute("cy", "50");
  plannerAm.setAttribute("r", AM_RADIUS);
  plannerAm.setAttribute("stroke", "grey");
  plannerAm.setAttribute("stroke-width", "0.2");
  plannerAm.setAttribute("fill", "transparent");
  clockElmt.appendChild(plannerAm);

  plannerPm = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  plannerPm.setAttribute("cx", "50");
  plannerPm.setAttribute("cy", "50");
  plannerPm.setAttribute("r", PM_RADIUS);
  plannerPm.setAttribute("stroke", "grey");
  plannerPm.setAttribute("stroke-width", "0.2");
  plannerPm.setAttribute("fill", "transparent");
  clockElmt.appendChild(plannerPm);
}

export function drawPlannedEvents(shadowRoot, events) {
  for (let eventIndex = 0; eventIndex < events.length; eventIndex++) {
    const e = events[eventIndex];
    const currentHour = dayjs().hour();
    let color = "blue";
    // reduce opacity if the event has passed
    if (e.color && currentHour > e.start) {
      color = e.color + "b0";
    }
    if (e.color && currentHour < e.start) {
      color = e.color;
    }
    let event = document.createElementNS("http://www.w3.org/2000/svg", "path");
    const radius = e.start > 12 ? PM_RADIUS : AM_RADIUS;
    const startAngle = getHoursDegreeAngle(e.start);
    const endAngle = getHoursDegreeAngle(e.end);
    const d = describeArc(50, 50, radius, startAngle, endAngle);
    event.setAttribute("d", d);
    event.setAttribute("stroke", color);
    event.setAttribute("stroke-width", "2");
    event.setAttribute("fill", "transparent");
    event.setAttribute("title", e.label);
    event.setAttribute("id", "event" + e.id);
    event.addEventListener("click", (event) => {
      let popupElmt = shadowRoot.querySelector("#clock-popup");
      let popupContentElmt = shadowRoot.querySelector("#clock-popup-content");
      popupContentElmt.innerHTML = `<h2>${e.name}</h2> ${
        e.description || ""
      } Start:${e.start} <br/> End:${e.end}`;
      popupElmt.style.display = "block";
    });
    clockElmt.appendChild(event);
  }
}
