let timer = {
  time: 0,
  running: false,
  intervalId: null
};

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({ timer });
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "start") {
    timer.time = request.time;
    timer.running = true;
    clearInterval(timer.intervalId);
    timer.intervalId = setInterval(() => {
      if (timer.time > 0) {
        timer.time--;
        chrome.storage.local.set({ timer });
      } else {
        clearInterval(timer.intervalId);
        timer.running = false;
        chrome.storage.local.set({ timer });
        chrome.notifications.create({
          type: 'basic',
          iconUrl: 'images/icon128.png',
          title: 'Timer Finished',
          message: 'Your timer has ended!'
        });
      }
    }, 1000);
    chrome.storage.local.set({ timer });
  } else if (request.action === "reset") {
    clearInterval(timer.intervalId);
    timer.time = 0;
    timer.running = false;
    chrome.storage.local.set({ timer });
  } else if (request.action === "stop") {
    clearInterval(timer.intervalId);
    timer.running = false;
    chrome.storage.local.set({ timer });
  }
  sendResponse({ status: "ok" });
});
