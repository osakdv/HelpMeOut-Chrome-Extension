document.addEventListener("DOMContentLoaded", () => {
  // import { getCurrentTab } from './utilis.js';

  // const mainLogo = document.getElementById("main-logo");
  const popupMessageTop = document.querySelector(".message");

  // full screen or tab record
  const recordFullScreenBtn = document.getElementById("full-screen");
  const recordCurrentTabBtn = document.getElementById("current-tab");
  const fullScreenIcon = document.querySelector("#full-screen .icon svg");
  const currentTabIcon = document.querySelector("#current-tab .icon svg");

  // camera & audio btns - toggle
  const allowCameraBtn = document.getElementById("toggle-camera");
  const allowAudioBtn = document.getElementById("toggle-audio");
  const startRecordingBtn = document.getElementById("start-recording-btn");

  // global variable
  const FULL_SCREEN = "FULL SCREEN";
  const CURRENT_TAB = "CURRENT_TAB";

  //
  let screenToRecord,
    allowCameraRecord = true,
    allowAudioRecord = false;

  //
  let clickCountFullScreen = 0;
  let clickCountTab = 0;

  const notifyUserOnClick = (element) => {
    const body = document.body;
    popupMessageTop.textContent =
      element === FULL_SCREEN ? "Full screen selected" : "Current tab selected";
    popupMessageTop.style.display = "flex";
    body.style.paddingTop = "45px";
    clickCountFullScreen = 0;
    clickCountTab = 0;

    setTimeout(() => {
      popupMessageTop.style.display = "none";
      body.style.paddingTop = "32px";
    }, 3000);
  };

  const tabOrFullScreenRecordHandler = (record) => {
    const domChange = (activeBtn, nonActiveBtn) => {
      activeBtn.classList.add("active-selection");
      activeBtn.classList.remove("non-active-selection");

      nonActiveBtn.classList.remove("active-selection");
      nonActiveBtn.classList.add("non-active-selection");
    };

    if (record === FULL_SCREEN) {
      domChange(recordFullScreenBtn, recordCurrentTabBtn);
      screenToRecord = FULL_SCREEN;

      clickCountFullScreen++;
      notifyUserOnClick(FULL_SCREEN);
    } else if (record === CURRENT_TAB) {
      domChange(recordCurrentTabBtn, recordFullScreenBtn);
      screenToRecord = CURRENT_TAB;

      clickCountTab++;
      notifyUserOnClick(CURRENT_TAB);
    }
  };

  recordFullScreenBtn.addEventListener(
    "click",
    tabOrFullScreenRecordHandler.bind(this, FULL_SCREEN)
  );
  recordCurrentTabBtn.addEventListener(
    "click",
    tabOrFullScreenRecordHandler.bind(this, CURRENT_TAB)
  );

  //

  allowAudioBtn.addEventListener("click", () => {
    allowAudioBtn.classList.toggle("toggle-active");

    allowAudioBtn.classList.contains("toggle-active")
      ? (allowAudioRecord = true)
      : (allowAudioRecord = false);
  });

  startRecordingBtn.addEventListener("click", () => {
    chrome.tabs.query(
      {
        active: true,
        currentWindow: true,
      },
      function(tabs){
        chrome.tabs.sendMessage(
          tabs[0].id,
          {
            action: "start_recording",
            getVid: allowCameraRecord,
            getAudio: allowAudioRecord,
          },
          (response) => {
            if (!chrome.runtime.lastError) {
              console.log(response);
            } else {
              console.log(chrome.runtime.lastError);
            }
          }
        );
      }
    );
  });
});
