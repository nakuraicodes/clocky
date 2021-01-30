import { initPopup } from "./popup.js";
import { setHands, drawClock } from "./clock.js";
import { drawPlannedEvents, initPlanner } from "./planner.js";

const clockPLannerStyle = `
#clock-wrapper {
  width: 100%;
  min-height: 100%;
  height: 100%;
  display: block;
}

#clock {
  width: 100%;
  min-height: 100%;
  height: 100%;
  background-color: white;
}

.clock-popup {
  position: absolute;
  width: 30%;
  min-height: 20%;
  height: 20%;
  max-height: 20%;
  top: 40%;
  left: 35%;
  padding: 10px;
  border: 2px solid black;
  background-color: white;
  display: none;
}
#clock-popup-header {
  padding: 0 0 5px 0;
  height: 3px;
  text-align: right;
}
#clock-popup-content {
  font-size: 2vw;
  height: 90%;
  overflow-y: scroll;
  box-sizing: border-box;
}
`;

export class ClockPlanner extends HTMLElement {
  static get observedAttributes() {
    return ["events"];
  }
  constructor() {
    super();
    this.clockWrapperId = "clock-wrapper";
    // Create a shadow root
    this.attachShadow({ mode: "open" });

    // Wrapper of the clock
    const template = document.createElement("template");
    template.innerHTML = `
        <style>${clockPLannerStyle}</style>
        <div id="${this.clockWrapperId}">
        </div>
    `;
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  connectedCallback() {
    const clockWrapperSelector = "#" + this.clockWrapperId;
    initPopup(this.shadowRoot, clockWrapperSelector);
    drawClock(this.shadowRoot, clockWrapperSelector);
    this.handTimer = setInterval(setHands, 1000);
    initPlanner(this.shadowRoot, "#clock");
  }

  disconnectedCallback() {
    if (this.handTimer) {
      clearInterval(this.handTImer);
    }
  }

  attributeChangedCallback(name, oldValue, newValue) {
    switch (name) {
      case "events":
        const newEvents = JSON.parse(newValue);
        drawPlannedEvents(this.shadowRoot, newEvents);
        break;

      default:
        console.log("unrecognized attribute name ", name);
        break;
    }
  }
}

customElements.define("clock-planner", ClockPlanner);
