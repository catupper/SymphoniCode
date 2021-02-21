const atcoderRegEx = '^https://atcoder\\.jp/.*/custom_test.*$';
chrome.runtime.onInstalled.addListener(() => {
  console.log('Installed');

  chrome.webNavigation.onCompleted.addListener(
    (details) => {
      console.log('AtCoder loaded');
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
