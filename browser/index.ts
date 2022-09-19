import Puppeteer from "puppeteer";

export async function CreateBrowser(): Promise<Puppeteer.Browser> {
    const browser = await Puppeteer.launch({
        headless: false,
        defaultViewport: null,
        args: [
            '--disable-gpu-sandbox',
            '--window-size=1280,720',
            '--lang=en_US',
            '--ignore-certificate-errors'
        ]
    });
    return browser;
}
