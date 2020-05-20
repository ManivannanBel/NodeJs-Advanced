const puppeteer = require('puppeteer');
const sessionFactory = require('./factories/sessionFactory');

let browser,page;

beforeEach( async () => {
    browser = await puppeteer.launch({
        headless : false
    });

    page = await browser.newPage();
    await page.goto('localhost:3000');
});

afterEach( async () => {
    await browser.close();
})

test('The header has the correct text', async () => {
    
    const text = await page.$eval('a.brand-logo', el => el.innerHTML);

    expect(text).toEqual('Blogster');
})

test('clicking login button to start oauth ', async () => {
    await page.click('.right a');

    const url = await page.url();

    expect(url).toMatch(/accounts\.google\.com/);

})

//Fake session creation
test('When signing in, shows logout button', async () => {
    const id = '5ec3e392844d89136c550393';

    const {session, sig} = sessionFactory();

    //console.log(sessionString+" "+sig);
    
    await page.setCookie({name : 'session', value : session});
    await page.setCookie({name : 'session.sig', value : sig});

    await page.goto('localhost:3000');
    await page.waitFor('a[href="/auth/logout"]');

    const text = await page.$eval('a[href="/auth/logout"]', el => el.innerHTML);

    expect(text).toEqual('Logout');
})