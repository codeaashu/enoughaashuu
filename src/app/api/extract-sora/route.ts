import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        let url = body.url;

        if (!url) {
            return NextResponse.json(
                { error: 'No URL provided.' },
                { status: 400 }
            );
        }

        if (!url.startsWith('https://sora.chatgpt.com/')) {
            return NextResponse.json(
                { error: 'RemoveBanana requires a Sora share URL starting with https://sora.chatgpt.com/' },
                { status: 400 }
            );
        }

        // Fetch the raw HTML of the Sora page
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const html = await response.text();

        // The Sora video URL is typically embedded in the meta tags or script tags payload
        let mp4Url = '';
        let prompt = '';

        // 1. Try to extract MP4 URL
        // Look for cdns that OpenAI uses for video or regular mp4 og:video tags
        const videoUrlRegex = /"([^"]*\.mp4[^"]*)"/i;
        const metaVideoRegex = /<meta property="og:video" content="([^"]+)"/i;

        // We try looking for og:video first, as it's the standard way
        const metaVideoMatch = html.match(metaVideoRegex);
        if (metaVideoMatch && metaVideoMatch[1]) {
            mp4Url = metaVideoMatch[1];
        } else {
            // Fallback to searching for an mp4 url within the HTML
            const videoMatch = html.match(videoUrlRegex);
            if (videoMatch && videoMatch[1]) {
                mp4Url = videoMatch[1];
            }
        }

        // Unescape the URL if it's JSON encoded
        mp4Url = mp4Url.replace(/\\u0026/g, '&');

        // 2. Try to extract the prompt
        // Look for og:description or title
        const metaDescRegex = /<meta property="og:description" content="([^"]+)"/i;
        const metaDescMatch = html.match(metaDescRegex);
        if (metaDescMatch && metaDescMatch[1]) {
            prompt = metaDescMatch[1].trim();
        } else {
            const titleRegex = /<title>([^<]+)<\/title>/i;
            const titleMatch = html.match(titleRegex);
            if (titleMatch && titleMatch[1]) {
                prompt = titleMatch[1].replace('Sora', '').trim();
            }
        }

        prompt = prompt.replace(/&quot;/g, '"').replace(/&#39;/g, "'");

        if (!mp4Url) {
            return NextResponse.json(
                { error: 'RemoveBanana could not extract a video from that link. Make sure it is a valid public Sora share link.' },
                { status: 400 }
            );
        }

        return NextResponse.json({
            prompt: prompt || 'Prompt not found.',
            mp4Url: mp4Url
        });

    } catch (error) {
        console.error('RemoveBanana Sora extraction error:', error);
        return NextResponse.json(
            { error: 'RemoveBanana hit an error while fetching the Sora video.' },
            { status: 500 }
        );
    }
}
