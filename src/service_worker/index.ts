// 사이드패널 여는 코드
chrome.runtime.onInstalled.addListener(() => {
  // 사용자가 확장 아이콘을 클릭할 때마다 사이드패널이 열리도록 설정
  chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true }, () => {
    console.log("Side panel behavior set: open on action click.");
  });
});

// 수업 아이디를 저장하고 불러오는 코드
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'REQUEST_COURSE_IDS') {
    chrome.storage.local.get('courseIds', (result) => {
      if (result.courseIds) {
        sendResponse({ courseIds: result.courseIds });
      } else {
        chrome.scripting.executeScript({
          target: { tabId: sender.tab?.id ?? 0 },
          files: ['content_scripts/index.js']
        });
        return true;
      }
    });
    return true;
  }

  if (message.type === 'COURSE_IDS') {
    chrome.storage.local.set({ courseIds: message.data });
  }
});
