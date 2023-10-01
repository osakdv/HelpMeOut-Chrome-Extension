// const webBody = document.body;
// const webHead = document.head;

// // Create a new <link> element
// const fontAwesome = document.createElement("link");
// fontAwesome.rel = "stylesheet";
// fontAwesome.href =
//   "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css"; // Font Awesome CDN URL
// webHead.appendChild(fontAwesome);

// // apply font
// const fontA = document.createElement("link");
// const fontB = document.createElement("link");
// const fontC = document.createElement("link");

// fontA.rel = "preconnect";
// fontB.rel = "preconnect";
// fontC.rel = "stylesheet";

// fontA.href = "https://fonts.googleapis.com";
// fontB.href = "https://fonts.gstatic.com";
// fontA.crossOrigin = true;
// fontC.href =
//   "https://fonts.googleapis.com/css2?family=Work+Sans:wght@400;600;700;800&display=swap";

// webHead.appendChild(fontA);
// webHead.appendChild(fontB);
// webHead.appendChild(fontC);

// // add our own style
// // contentScript.js

// // Request the CSS file URL from the background script
// chrome.runtime.sendMessage({ action: "getCSSFileURL" }, (response) => {
//   if (response && response.cssFileURL) {
//     // Create a <link> element to load the CSS file
//     const styleLink = document.createElement("link");
//     styleLink.href = response.cssFileURL;
//     styleLink.type = "text/css";
//     styleLink.rel = "stylesheet";

//     document.head.appendChild(styleLink);
//   }
// });

// // const newDiv = document.createElement("div");
// // newDiv.textContent = "This is a styled div created by the content script.";
// // newDiv.classList.add("my-styled-class");
// // document.body.appendChild(newDiv);

// // create ui for webpage

// const helpMeOutDomStyle = () => {
//   webBody.style.position = "relative";
//   const recordControllerWrapper = document.querySelector(
//     ".recorder-controller-wrapper"
//   );

//   if (!recordControllerWrapper) {
//     const controllerMainWrapper = document.createElement("div");
//     controllerMainWrapper.innerHTML = "<h1>controllerMainWrapper</h1>";
//     controllerMainWrapper.classList.add("recorder-controller-wrapper");
//     controllerMainWrapper.style.fontFamily = "Work Sans";

//     webBody.append(controllerMainWrapper);
//     console.log(controllerMainWrapper);
//   }
// };

// helpMeOutDomStyle();

// const customDomStyle = document.createElement("link");
// customDomStyle.href = chrome.runtime.getURL("webdom.css");
// customDomStyle.type = "text/css";
// customDomStyle.rel = "stylesheet";

// webHead.appendChild(customDomStyle);

console.log("Hi, I have been injected whoopie!!!");

var recorder = null;
function onAccessApproved(stream) {
  recorder = new MediaRecorder(stream);

  recorder.start();

  recorder.onstop = function () {
    stream.getTracks().forEach(function (track) {
      if (track.readyState === "live") {
        track.stop();
      }
    });
  };

  recorder.ondataavailable = function (event) {
    let recordedBlob = event.data;
    let url = URL.createObjectURL(recordedBlob);

    let a = document.createElement("a");

    a.style.display = "none";
    a.href = url;
    a.download = "screen-recording.webm";

    document.body.appendChild(a);
    a.click();

    document.body.removeChild(a);

    URL.revokeObjectURL(url);
  };
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "start_recording") {
    console.log("requesting recording");

    sendResponse(`processed: ${message.action}`);

    navigator.mediaDevices
      .getDisplayMedia({
        audio: message.getAudio,
        video:
          message.getVid === true
            ? {
                width: 9999999999,
                height: 9999999999,
              }
            : message.getVid,
      })
      .then((stream) => {
        onAccessApproved(stream);
      });
  }

  // if(message.action === "stopvideo"){
  //     console.log("stopping video");
  //     sendResponse(`processed: ${message.action}`);
  //     if(!recorder) return console.log("no recorder")

  //     recorder.stop();

  // }
});
