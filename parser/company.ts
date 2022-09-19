import { Browser } from "puppeteer";
import IPeopleLinksList from "../interfaces/IPeopleLinksList";

export default async function GetCompanyPersonnel(browser: Browser, link: string): Promise<IPeopleLinksList[]> {
    const page = await browser.newPage()
    await page.goto(link, { waitUntil: 'domcontentloaded' })
    const hasEmployees = await page.evaluate(() => {
        return (document.querySelector('a[href^="/search/results/people/"]') as HTMLElement)
    })
    if (!hasEmployees) {
        await page.close()
        return []
    }
    await page.evaluate(() => {
        (document.querySelector('a[href^="/search/results/people/"]') as HTMLElement).click()
    })
    await page.waitForNetworkIdle()
    await page.evaluate((query) => {
        (document.querySelector('#global-nav-typeahead input') as HTMLInputElement).value = query
        const ev = new KeyboardEvent('keydown', {
            altKey:false,
            bubbles: true,
            cancelable: true,
            charCode: 0,
            code: "Enter",
            composed: true,
            ctrlKey: false,
            detail: 0,
            isComposing: false,
            key: "Enter",
            keyCode: 13,
            location: 0,
            metaKey: false,
            repeat: false,
            shiftKey: false,
            which: 13
        });
        (document.querySelector('#global-nav-typeahead input') as HTMLInputElement).dispatchEvent(ev)
    }, process.env.LINKEDIN_COMPANY_SEARCH_PARAMETERS)
    await page.waitForNetworkIdle()
    await new Promise((resolve) => setTimeout(() => resolve(true), 1000))

    const peopleProfiles = await page.evaluate(() => {
        const peopleElems = document.querySelectorAll('.entity-result__content')
        const ret: IPeopleLinksList[] = []
        for (const idx in peopleElems) {
            const personElem = peopleElems[idx] as HTMLElement
            if (personElem.querySelector) {
                const personAnchorElem = (personElem.querySelector('a') as HTMLAnchorElement)
                const userProfile = personAnchorElem.href
                const name = personAnchorElem.innerText.split('\n')[0]
                ret.push({userProfile, name})
            }
        }
        return ret
    })

    await page.close()

    return peopleProfiles as IPeopleLinksList[]
}
