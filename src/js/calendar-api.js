let userCalendars = {};
let userEvents = {};

export function getUserCalendars() {
  return Object.values(userCalendars);
}

export function toggleCalendar(calendarId) {
  userCalendars[calendarId].selected = !userCalendars[calendarId].selected;
}

export function getUserEventsForPlanning() {
  const dateId = dayjs().startOf("day").toISOString();
  return Object.values(userEvents[dateId])
    .filter((e) => e.start !== null && e.end !== null)
    .map((e) => {
      let start = dayjs(e.start);
      let hourStart = start.hour();
      let minuteStart = start.minute() / 60;
      let end = dayjs(e.end);
      let hourEnd = end.hour();
      let minuteEnd = end.minute() / 60;
      return { ...e, start: hourStart + minuteStart, end: hourEnd + minuteEnd };
    });
}

export async function initCalendar() {
  try {
    await fetchCalendarList();
  } catch (error) {
    console.log("ERROR ", error.message);
  }
}

export async function fetchCalendarList() {
  try {
    const response = await gapi.client.calendar.calendarList.list();
    userCalendars = {};
    for (let cpt = 0; cpt < response.result.items.length; cpt++) {
      let c = response.result.items[cpt];
      userCalendars[c.id] = { ...c, selected: true };
    }
  } catch (error) {
    console.log("ERROR ", error.message);
  }
}

export async function fetchTodayEvents() {
  try {
    console.log("in fetch today events ");
    // the api parameters timeMin and timeMax are exclusive, so we have to get midnight +/1 minute
    const timeMin = dayjs().startOf("day").toISOString();
    const timeMax = dayjs().endOf("day").toISOString();
    let options = {
      orderBy: "startTime",
      singleEvents: true,
      timeMin: timeMin,
      timeMax: timeMax,
    };
    userEvents[timeMin] = {};
    let calendarToFetchEventsFrom = Object.values(userCalendars).filter(
      (c) => c.selected
    );
    for (
      let calIndex = 0;
      calIndex < calendarToFetchEventsFrom.length;
      calIndex++
    ) {
      let c = calendarToFetchEventsFrom[calIndex];
      options.calendarId = c.id;
      const response = await gapi.client.calendar.events.list(options);
      for (
        let eventIndex = 0;
        eventIndex < response.result.items.length;
        eventIndex++
      ) {
        const e = response.result.items[eventIndex];
        userEvents[timeMin][e.id] = {
          id: e.id,
          name: e.summary,
          description: e.description,
          end: e.end.dateTime || null,
          start: e.start.dateTime || null,
          color: c.backgroundColor,
        };
      }
    }
    // return events;
  } catch (error) {
    console.log("ERROR ", error.message);
  }
}

/**
 * Print the summary and start datetime/date of the next ten events in
 * the authorized user's calendar. If no events are found an
 * appropriate message is printed.
 */
// async function listUpcomingEvents() {
//   try {
//     const response = await gapi.client.calendar.events.list({
//       calendarId: "primary",
//       timeMin: new Date().toISOString(),
//       showDeleted: false,
//       singleEvents: true,
//       maxResults: 10,
//       orderBy: "startTime",
//     });
//     var events = response.result.items;
//     console.log("Upcoming events:");

//     if (events.length > 0) {
//       for (let i = 0; i < events.length; i++) {
//         var event = events[i];
//         var when = event.start.dateTime;
//         if (!when) {
//           when = event.start.date;
//         }
//         console.log(event.summary + " (" + when + ")");
//       }
//     } else {
//       console.log("No upcoming events found.");
//     }
//   } catch (error) {
//     console.log("ERROR ", error.message);
//   }
// }
