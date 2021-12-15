declare global {
    // eslint-disable-next-line
    interface Window { ethereum: any; }
}

window.ethereum = {
    isMetaMask: true,
};

export { };
