const atcoderRegEx = '^https://atcoder\\.jp/.*/custom_test.*$';
chrome.runtime.onInstalled.addListener(() => {
  console.log('Installed');

  chrome.webNavigation.onCompleted.addListener(
    (details) => {
      setInterval(() => {
        chrome.tabs.sendMessage(
          details.tabId,
          {
            type: 'sourceCode',
          },
          (response) => {
            console.log(response);
          }
        );
      }, 1000);

      console.log('loaded');
      console.log(details.tabId, details.url);
    },
    {
      url: [
        {
          urlMatches: atcoderRegEx,
        },
      ],
    }
  );
});
