export declare interface ParsedJID {
    prepped?: boolean;
    local?: string;
    domain: string;
    resource?: string;
    bare: string;
    full: string;
    unescapedLocal?: string;
    unescapedBare?: string;
    unescapedFull?: string;
}

export declare function prep(data: ParsedJID): ParsedJID;
export declare function parse(jid: string, trusted?: boolean): ParsedJID;
export declare function equal(jid1: string|JID, jid2: string|JID, requriePrep?: boolean): boolean;
export declare function equalBare(jid1: string|JID, jid2: string|JID, requirePrep?: boolean): boolean;
export declare function isBare(jid: string|JID): boolean;
export declare function isFull(jid: string|JID): boolean;
export declare function escape(value: string): string;
export declare function unescape(value: string): string;
export declare function create(local: string, domain: string, resource?: string): JID;

export declare class JID implements ParsedJID {
    constructor(localOrJID: string|JID, domain?: string, resource?: string);
    prepped: boolean;
    local: string;
    domain: string;
    resource: string;
    bare: string;
    full: string;
    unescapedLocal: string;
    unescapedBare: string;
    unescapedFull: string;
    toString(): string;
    toJSON(): string;
}

