const ab2str = (ab: ArrayBuffer): string => new TextDecoder().decode(ab);
const str2ab = (str: string): Uint8Array => new TextEncoder().encode(str);

export { ab2str, str2ab };
