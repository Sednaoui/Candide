; Press F4 to close chrome and restart it.
; Used to test contentScript since contentScript cannot hot-reload.
;
; [Requires AHK v2](https://www.autohotkey.com/)
;
; Must have test dApp tab open. If there are multiple chrome windows
; windows running (with the same profile), then the contentScript
; will not refresh.

F4::
{
    if WinExist("E2E Test Dapp")
        WinClose
    Run "chrome.exe http://localhost:9011 --auto-open-devtools-for-tabs"
}