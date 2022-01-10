export const trancatAddress = (address: string): string => (
    `${address.substring(0, 4)}...${address.substring(address.length - 4)}`
);
