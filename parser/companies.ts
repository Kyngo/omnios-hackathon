import { Browser } from "puppeteer";
import ICompanyLinksList from "../interfaces/ICompanyLinksList";
import { ICategoryID } from "../interfaces/IConstants";

export async function GetCompaniesByCategoryIDs(browser: Browser, categories: ICategoryID): Promise<ICompanyLinksList[]> {
    const page = await browser.newPage()
    await page.goto(`https://linkedin.com/search/results/companies/?industry=${JSON.stringify(categories.categoryIds)}&origin=FACETED_SEARCH&sid=(Dk`, {
        waitUntil: 'domcontentloaded'
    })

    const companiesData = await page.evaluate(() => {
        const companiesElems = document.querySelectorAll('.entity-result__content')
        const res: ICompanyLinksList[] = []
        for (const idx in companiesElems) {
            const companyElem = companiesElems[idx]
            if (companyElem.querySelector) {
                const name = (companyElem.querySelector('.entity-result__title-text') as HTMLElement).innerText
                const companyLink = (companyElem.querySelector('a') as HTMLAnchorElement).href
                res.push({
                    name, companyLink
                })
            }
        }
        return res
    })
    await page.close()

    return companiesData as ICompanyLinksList[]
}