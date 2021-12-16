export default function injectScript(): void {
    const container = document.head || document.documentElement;
    const script = document.createElement('script');

    script.src = chrome.runtime.getURL('injected.bundle.js');
    script.setAttribute('async', 'false');
    container.insertBefore(script, container.children[0]);
}
