interface Compiler {
    version: string
}

interface Output {
    abi: Abi[]
    devdoc: Devdoc
    userdoc: Userdoc
}

interface Abi {
    inputs: Input[]
    stateMutability?: string
    type: string
    anonymous?: boolean
    name?: string
    outputs?: Output2[]
}

interface Input {
    indexed?: boolean
    internalType: string
    name: string
    type: string
}

interface Output2 {
    internalType: string
    name: string
    type: string
}

interface Devdoc {
    kind: string
    methods: Methods
    version: number
}

interface Methods { }

interface Userdoc {
    kind: string
    methods: Methods2
    version: number
}

interface Methods2 { }

interface Settings {
    compilationTarget: CompilationTarget
    evmVersion: string
    libraries: Libraries
    metadata: Metadata
    optimizer: Optimizer
    remappings: any[]
}

interface CompilationTarget {
    [key: string]: string
}

interface Libraries { }

interface Metadata {
    bytecodeHash: string
}

interface Optimizer {
    enabled: boolean
    runs: number
}

interface Sources {
    [key: string]: BrowserSynthetixAmmSol
}

interface BrowserSynthetixAmmSol {
    keccak256: string
    license: string
    urls: string[]
}

export interface ContractMetaData {
    compiler: Compiler
    language: string
    output: Output
    settings: Settings
    sources: Sources
    version: number
}
