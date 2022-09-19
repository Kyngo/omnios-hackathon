import fs from 'fs'
import dotenv from 'dotenv'

import { CreateBrowser } from './browser'
import { Login } from './browser/login'

import { GetCompaniesByCategoryIDs } from './parser/companies'

import IConstants from './interfaces/IConstants'
import GetCompanyPersonnel from './parser/company'
import { S3Upload } from './storage/s3'

dotenv.config()

async function init() {
    const browser = await CreateBrowser()
    const isLoggedIn = await Login(browser)

    if (!isLoggedIn) {
        console.log(`[ERR] Failed to authenticate!`)
        process.exit(1)
    }

    const Constants = JSON.parse(fs.readFileSync('./constants.json', 'utf-8')) as IConstants

    for (const categoryIdx in Constants.categoryIds) {
        const category = Constants.categoryIds[categoryIdx]
        console.log(`[INF] Crawling category "${category.name}" ...`)
        const companies = await GetCompaniesByCategoryIDs(browser, category)
        for (const companyIdx in companies) {
            const company = companies[companyIdx]
            console.log(`[INF] Crawling company "${company.name}" ...`)
            const recruiterProfiles = await GetCompanyPersonnel(browser, company.companyLink)
            // fs.writeFileSync(`./profiles_${category.name.replace(/\s/, '_')}_${company.name.replace(/\s/, '_')}.json`, JSON.stringify(recruiterProfiles))
            const uploadStats = await S3Upload(
                process.env.AWS_BUCKET_NAME, 
                `profile_${category.name.replace(/\s/g, '_')}_${company.name.replace(/\s/g, '_')}.json`, 
                JSON.stringify(recruiterProfiles)
            )
            console.log(`[INF] S3 upload: ${uploadStats}`)
        }
    }

    await browser.close()
}

init()
