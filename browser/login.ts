import { Browser } from "puppeteer"

export async function CheckIfLoginRequired(browser: Browser): Promise<boolean> {
    const page = await browser.newPage()
    await page.goto('https://linkedin.com/login')
    await new Promise((resolve) => setTimeout(() => resolve(true), 5000))
    const url = page.url()
    await page.close()
    if (url.match('/login')) {
        return false
    }
    return true
}

export async function Login (browser: Browser, idx: number = 1): Promise<boolean> {
    const rawUsernames = (process.env.LINKEDIN_USER_NAMES || '')
    const b64Usernames = Buffer.from(rawUsernames, 'base64').toString('utf-8')
    const usernames = b64Usernames.split(' ')

    const rawPasswords = (process.env.LINKEDIN_PASSWORDS || '')
    const b64Passwords = Buffer.from(rawPasswords, 'base64').toString('utf-8')
    const passwords = b64Passwords.split(' ')

    console.log(usernames, passwords)

    const randomUserIdx = Math.round(Math.random() * (usernames.length - 1))
    console.log(usernames[randomUserIdx], passwords[randomUserIdx], randomUserIdx)

    const page = await browser.newPage()
    await page.goto('https://www.linkedin.com/login', { waitUntil: 'networkidle0' })

    await page.evaluate((username) => (document.getElementById('username') as HTMLInputElement).value = username, usernames[randomUserIdx])
    await page.evaluate((password) => (document.getElementById('password') as HTMLInputElement).value = password, passwords[randomUserIdx])
    await page.evaluate(() => (document.querySelector('form.login__form button') as HTMLElement).click())
    await new Promise((resolve) => setTimeout(() => resolve(true), 5000))
    await page.waitForNetworkIdle()
    await page.close()
    
    const isLoggedIn = await CheckIfLoginRequired(browser)
    if (isLoggedIn) return true
    return false
}
