export async function hashString(str: string): Promise<string> {
    const buffer = new TextEncoder().encode(str);
    const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);

    return Array.from(new Uint8Array(hashBuffer))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
}