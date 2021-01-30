export function initPopup(shadowRoot, clockWrapperSelector) {
  // POPUP container
  const popupElmt = document.createElement("div");
  popupElmt.setAttribute("id", "clock-popup");
  popupElmt.classList.add("clock-popup");
  // POPUP header
  const popupHeader = document.createElement("div");
  popupHeader.setAttribute("id", "clock-popup-header");
  popupHeader.innerHTML = `
      <span style="cursor:pointer;">x</span>
  `;
  popupHeader.addEventListener("click", () => {
    // const popupElmt = shadowRoot.querySelector("#clock-popup");
    popupElmt.style.display = "none";
  });
  // POPUP content
  const popupContent = document.createElement("div");
  popupContent.setAttribute("id", "clock-popup-content");
  popupElmt.appendChild(popupHeader);
  popupElmt.appendChild(popupContent);
  shadowRoot.querySelector(clockWrapperSelector).appendChild(popupElmt);
}
