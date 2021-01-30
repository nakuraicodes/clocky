import { ClockPlanner } from "./clock-planner/index.js";
import { show, hide } from "./utils.js";
import { PAGE_ID } from "./constants.js";
import {
  fetchTodayEvents,
  initCalendar,
  getUserCalendars,
  getUserEventsForPlanning,
  toggleCalendar,
} from "./calendar-api.js";
import {
  initGapi,
  handleAuthClick,
  handleSignoutClick,
} from "./google-signin.js";

// every fifteen minutes, fetch calendar events
async function refreshEventsDisplay() {
  await fetchTodayEvents();
  const events = getUserEventsForPlanning();
  const plannerElmt = document.querySelector("#clock-planner");
  plannerElmt.setAttribute("events", JSON.stringify(events));
}

function keyUpEvent(evt) {
  if (evt.keyCode === 27) {
    escapeKeyEvent();
  }
}

function escapeKeyEvent() {
  const currentPage = window.location.hash.replace("#", "");
  if ([PAGE_ID.ABOUT, PAGE_ID.TOS, PAGE_ID.PRIVACY].includes(currentPage)) {
    goToPage(PAGE_ID.MAIN);
  }
}

function resetRouteState() {
  hide("page-main");
  hide("page-about");

  document.querySelectorAll("[id^='link-tab-']").forEach((e) => {
    const tabId = e.getAttribute("id").replace("link-", "");
    hide(tabId);
    e.classList.remove("w3-border-red");
  });
}

function goToPage(pageId) {
  resetRouteState();
  switch (pageId) {
    case PAGE_ID.ABOUT:
      document
        .getElementById("link-tab-about")
        .closest("div")
        .classList.add("w3-border-red");
      show("page-about");
      show("tab-about");
      break;
    case PAGE_ID.TOS:
      document
        .getElementById("link-tab-tos")
        .closest("div")
        .classList.add("w3-border-red");
      show("page-about");
      show("tab-tos");
      break;
    case PAGE_ID.PRIVACY:
      document
        .getElementById("link-tab-privacy")
        .closest("div")
        .classList.add("w3-border-red");
      show("page-about");
      show("tab-privacy");
      break;
    case PAGE_ID.MAIN:
      show("page-main");
      break;
    default:
      show("page-main");
      break;
  }
}

async function loadApp() {
  const targetPage = window.location.hash.replace("#", "") || PAGE_ID.MAIN;
  goToPage(targetPage);

  initEventsListeners();

  const plannerElmt = document.querySelector("#clock-planner");
  plannerElmt.setAttribute("events", JSON.stringify([]));
  onAuthChanged(false);
  /**
   *  On load, called to load the auth2 library and API client library.
   */
  await initGapi(onAuthChanged);
}

async function unloadApp() {
  document.body.removeEventListener("keyup", keyUpEvent);
}

function initEventsListeners() {
  window.addEventListener("hashchange", function () {
    const targetPage = window.location.hash.replace("#", "") || PAGE_ID.MAIN;
    goToPage(targetPage);
  });
  document.body.addEventListener("keyup", keyUpEvent);

  document
    .getElementById("refresh-events")
    .addEventListener("click", refreshEventsDisplay);
  document
    .getElementById("authorize-button")
    .addEventListener("click", handleAuthClick);
  document
    .getElementById("signout-button")
    .addEventListener("click", handleSignoutClick);

  document.getElementById("link-about-page").addEventListener("click", () => {
    goToPage("about");
  });

  document
    .getElementById("toggle-calendar-list")
    .addEventListener("click", () => {
      const listElmt = document.getElementById("calendar-list");
      if (listElmt.style.display === "none" || !listElmt.style.display) {
        listElmt.style.display = "block";
      } else {
        listElmt.style.display = "none";
      }
    });
}

async function onAuthChanged(isSignedIn) {
  if (isSignedIn) {
    show("signed-in-buttons");
    hide("signed-out-buttons");
    await initCalendar();
    refreshCalendarList();
    await refreshEventsDisplay();
  } else {
    hide("signed-in-buttons");
    show("signed-out-buttons");
  }
}

function refreshCalendarList() {
  try {
    let calendars = getUserCalendars();
    let calendarWrapperElmt = document.getElementById("calendar-list");
    let calendarListElmt = document.createElement("ul");
    calendarListElmt.addEventListener("change", (htmlEvent) => {
      htmlEvent.stopPropagation();
      toggleCalendar(htmlEvent.target.id.replace("calendarItem-", ""));
    });
    for (let cpt = 0; cpt < calendars.length; cpt++) {
      let c = calendars[cpt];
      let calendarListItemElmt = document.createElement("li");
      calendarListItemElmt.setAttribute("id", c.id);
      calendarListItemElmt.style = `background-color: ${c.backgroundColor}; color:${c.foregroundColor};`;
      calendarListItemElmt.innerHTML = `<input id="calendarItem-${
        c.id
      }" type="checkbox" checked="${c.selected}"/> <b>${c.summary}</b> <br/> ${
        c.description ? c.description : ""
      }`;
      calendarListElmt.appendChild(calendarListItemElmt);
    }
    calendarWrapperElmt.innerHTML = null;
    calendarWrapperElmt.appendChild(calendarListElmt);
  } catch (error) {
    console.log("ERROR ", error.message);
  }
}

window.onload = loadApp;

window.addEventListener("beforeunload", unloadApp);
