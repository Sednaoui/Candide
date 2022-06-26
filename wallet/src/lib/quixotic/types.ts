/* eslint-disable camelcase */

export interface AccountAssetsResponse {
    count: number,
    next: number | null,
    previous: number | null,
    results: NFTData[] | null,
}

export interface NFTData {
    token_id: string,
    name: string
    external_url: string,
    description: string,
    image_url: string,
    animation_url: string,
    background_color: string,
    collection: Collection,
}

export interface Collection {
    address: string,
    name: string,
    symbol: string,
    contract_type: 'ERC-721',
    external_link: string,
    slug: string,
    image_url: string,
    string: boolean,
}
