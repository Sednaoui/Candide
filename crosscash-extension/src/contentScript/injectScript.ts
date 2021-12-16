export default function injectScript(): void {
    const script = document.createElement('script');

    script.src = chrome.runtime.getURL('injected.bundle.js');
    (document.head || document.documentElement).appendChild(script);
}
