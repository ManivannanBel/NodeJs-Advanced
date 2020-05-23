const Page = require('./helpers/page');

let page;

beforeEach( async () => {
    page = await Page.build();
    await page.goto('localhost:3000');
});

afterEach( async () => {
    await page.close();
})

test('The header has the correct text', async () => {
    
    //const text = await page.$eval('a.brand-logo', el => el.innerHTML);
    const text = await page.getContentsOf('a.brand-logo');

    expect(text).toEqual('Blogster');
})

test('clicking login button to start oauth ', async () => {
    await page.click('.right a');

    const url = await page.url();

    expect(url).toMatch(/accounts\.google\.com/);

})

//Fake session creation
test('When signing in, shows logout button', async () => {
    await page.login();
    
    //console.log('text');
    //const text = await page.$eval('a[href="/auth/logout"]', el => el.innerHTML);
    const text = await page.getContentsOf('a[href="/auth/logout"]');
    //console.log(text);
    
    expect(text).toEqual('Logout');
})