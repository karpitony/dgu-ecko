console.log('Hello from content_scripts/index.ts');
chrome.runtime.onInstalled.addListener(() => {
  // 사용자가 확장 아이콘을 클릭할 때마다 사이드패널이 열리도록 설정
  chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true }, () => {
    console.log("Side panel behavior set: open on action click.");
  });
});
