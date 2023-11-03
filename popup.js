// ----------------------------------------------------------------------------
// Exchange data with the YouTube page
// ----------------------------------------------------------------------------

async function requestStart(){
    const tab = await getCurrentTab();
    chrome.tabs.sendMessage(tab.id, { type: "start" }, (res) => { console.log(res); });
}

async function getCurrentTab(){
    let queryOptions = { active: true, currentWindow: true };
    let [tab] = await chrome.tabs.query(queryOptions);
    return tab;
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if(sender.tab){ // message was from content.js
        console.log("message from content.js to popup.js");
        captions.push(request.info);
        statusElement.textContent = captions.length;
     }
});

// ----------------------------------------------------------------------------
// User Interface Event Handlers
// ----------------------------------------------------------------------------
window.addEventListener("DOMContentLoaded", () => {
    statusElement.textContent = captions.length;
});

document.getElementById("startButton").addEventListener("click", () => {
    captions = [];
    requestStart();
});

document.getElementById("download").addEventListener("click", handleDownload);

const statusElement = document.getElementById("status");

// ----------------------------------------------------------------------------
// Data and Storage
// ----------------------------------------------------------------------------

let captions = [];

function save(){
    chrome.storage.local.set({ }, () => {

    });
}

function load(){
    chrome.storage.local.get({}, (data) => {
        
    });
}

// ----------------------------------------------------------------------------
// CSV data download
// ----------------------------------------------------------------------------

function handleDownload() {
    const content = JSON.stringify(captions);
    const blob = new Blob([ content ], { "type" : "application/json" });
   
    if (window.navigator.msSaveBlob) { 
       window.navigator.msSaveBlob(blob, "test.csv"); 
       window.navigator.msSaveOrOpenBlob(blob, "test.csv"); 
    } else {
       document.getElementById("download").href = window.URL.createObjectURL(blob);
    }
}
