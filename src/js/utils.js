export function show(elementId, type = "block") {
  try {
    document.getElementById(elementId).style.display = type;
  } catch (error) {
    console.log("ERROR ", error.message);
  }
}
export function hide(elementId) {
  try {
    document.getElementById(elementId).style.display = "none";
  } catch (error) {
    console.log("ERROR ", error.message);
  }
}
