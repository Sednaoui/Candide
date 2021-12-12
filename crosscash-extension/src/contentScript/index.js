// If your extension doesn't need a content script, just leave this file empty

// This is an example of a script that will run on every page. This can alter pages
// Don't forget to change `matches` in manifest.json if you want to only change specific webpages
printAllPageLinks();

// This needs to be an export due to typescript implementation limitation of needing '--isolatedModules' tsconfig
export function printAllPageLinks() {
  const allLinks = Array.from(document.querySelectorAll('a')).map(
    link => link.href
  );

  console.log('-'.repeat(30));
  console.log(
    `These are all ${allLinks.length} links on the current page that have been printed by the Sample Create React Extension`
  );
  console.log(allLinks);
  console.log('-'.repeat(30));
}

// Sourced from StackOverflow, method 2b:
// https://stackoverflow.com/questions/9515704/use-a-content-script-to-access-the-page-context-variables-and-functions/9517879#9517879
var actualCode = '(' + function() {
  window.ethereum = {
    isMetaMask: true
  }
} + ')();';
var script = document.createElement('script');
script.textContent = actualCode;
(document.head||document.documentElement).appendChild(script);