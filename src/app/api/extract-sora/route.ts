import { NextResponse } from 'next/server';

const SORA_UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36';

function extractFromHtml(html: string): { mp4Url: string; prompt: string } {
    let mp4Url = '';
    let prompt = '';

    const metaVideoMatch = html.match(/<meta property="og:video" content="([^"]+)"/i);
    if (metaVideoMatch?.[1]) {
        mp4Url = metaVideoMatch[1];
    } else {
        const videoMatch = html.match(/"([^"]*\.mp4[^"]*)"/i);
        if (videoMatch?.[1]) mp4Url = videoMatch[1];
    }

    mp4Url = mp4Url.replace(/\\u0026/g, '&');

    const metaDescMatch = html.match(/<meta property="og:description" content="([^"]+)"/i);
    if (metaDescMatch?.[1]) {
        prompt = metaDescMatch[1].trim();
    } else {
        const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
        if (titleMatch?.[1]) prompt = titleMatch[1].replace(/Sora/gi, '').trim();
    }

    prompt = prompt.replace(/&quot;/g, '"').replace(/&#39;/g, "'");
    return { mp4Url, prompt };
}

async function safeFetch(url: string): Promise<{ ok: boolean; status: number; text: () => Promise<string> } | null> {
    try {
        return await fetch(url, { headers: { 'User-Agent': SORA_UA } });
    } catch {
        return null;
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const url: string = body.url ?? '';

        if (!url) {
            return NextResponse.json({ error: 'No URL provided.' }, { status: 400 });
        }

        if (!url.startsWith('https://sora.chatgpt.com/')) {
            return NextResponse.json(
                { error: 'Please provide a valid Sora link starting with https://sora.chatgpt.com/' },
                { status: 400 }
            );
        }

        let mp4Url = '';
        let prompt = '';

        // ── /g/ generation links ─────────────────────────────────────────────
        const genMatch = url.match(/\/g\/(gen_[a-zA-Z0-9]+)/);
        if (genMatch) {
            const genId = genMatch[1];

            // Try the undocumented backend endpoint first
            const apiRes = await safeFetch(
                `https://sora.chatgpt.com/backend-api/video/generations/${genId}`
            );
            if (apiRes?.ok) {
                try {
                    const data = await apiRes.json() as Record<string, unknown>;
                    mp4Url = (data?.video_url ?? data?.url ?? '') as string;
                    prompt = (data?.prompt ?? data?.caption ?? '') as string;
                } catch { /* non-JSON — fall through */ }
            }

            // Fall back to HTML scrape of the /g/ page
            if (!mp4Url) {
                const htmlRes = await safeFetch(url);
                if (!htmlRes) {
                    return NextResponse.json(
                        { error: 'Could not reach the Sora link. Check that the URL is correct and publicly accessible.' },
                        { status: 400 }
                    );
                }
                if (!htmlRes.ok) {
                    if (htmlRes.status === 401 || htmlRes.status === 403) {
                        return NextResponse.json(
                            { error: 'This generation link is private and requires login. Use the Share button in Sora to get a public share link (https://sora.chatgpt.com/p/...).' },
                            { status: 400 }
                        );
                    }
                    return NextResponse.json(
                        { error: `Sora returned HTTP ${htmlRes.status} for this link. Try a public share link instead.` },
                        { status: 400 }
                    );
                }
                const html = await htmlRes.text();
                ({ mp4Url, prompt } = extractFromHtml(html));
            }
        } else {
            // ── /p/ share links (and everything else) ────────────────────────
            const htmlRes = await safeFetch(url);
            if (!htmlRes) {
                return NextResponse.json(
                    { error: 'Could not reach the Sora link. Check that the URL is correct and publicly accessible.' },
                    { status: 400 }
                );
            }
            if (!htmlRes.ok) {
                if (htmlRes.status === 401 || htmlRes.status === 403) {
                    return NextResponse.json(
                        { error: 'This link is private. Use the Share button in Sora to create a public share link.' },
                        { status: 400 }
                    );
                }
                return NextResponse.json(
                    { error: `Sora returned HTTP ${htmlRes.status}. Make sure the link is a valid public share link.` },
                    { status: 400 }
                );
            }
            const html = await htmlRes.text();
            ({ mp4Url, prompt } = extractFromHtml(html));
        }

        if (!mp4Url) {
            return NextResponse.json(
                {
                    error:
                        'Could not find a video in this link. For /g/ generation links, the video may be private. ' +
                        'Try clicking Share in Sora and using the public /p/ link instead.',
                },
                { status: 400 }
            );
        }

        return NextResponse.json({ prompt: prompt || 'Prompt not available.', mp4Url });

    } catch (error) {
        console.error('RemoveBanana Sora extraction error:', error);
        return NextResponse.json(
            { error: 'An unexpected error occurred. Please try again with a valid public Sora share link.' },
            { status: 500 }
        );
    }
}
