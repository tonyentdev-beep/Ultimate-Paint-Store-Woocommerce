const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    try {
        await page.setViewport({ width: 1400, height: 900 });

        // Login
        console.log('Navigating to login...');
        await page.goto('http://paint-store.local/wp-admin', { waitUntil: 'networkidle0' });
        await page.type('#user_login', 'admin');
        await page.type('#user_pass', 'S!wP2B2XU(T%2n&D');
        await page.click('#wp-submit');
        await page.waitForNavigation({ waitUntil: 'networkidle0' });

        // Go to Physical Products
        console.log('Navigating to products manager...');
        await page.goto('http://paint-store.local/wp-admin/admin.php?page=paint-store-plugin', { waitUntil: 'networkidle0' });
        
        // Wait for React to mount
        await page.waitForSelector('.nav-tab');
        
        // Click Products & Bases tab
        const tabs = await page.$$('.nav-tab');
        for (const tab of tabs) {
            const text = await page.evaluate(el => el.textContent, tab);
            if (text.trim() === 'Products & Bases') {
                await tab.click();
                break;
            }
        }
        await new Promise(r => setTimeout(r, 500));

        // Click Physical Products subtab
        const subtabs = await page.$$('.subsubsub a');
        for (const tab of subtabs) {
            const text = await page.evaluate(el => el.textContent, tab);
            if (text.trim() === 'Physical Products (SKUs)') {
                await tab.click();
                break;
            }
        }
        await new Promise(r => setTimeout(r, 1000));

        // Ensure there is a Wood Stain make to select from
        console.log('Selecting a family to trigger the form...');
        
        // Let's find the family dropdown
        const selects = await page.$$('select');
        let familySelect = null;
        for (const select of selects) {
            const id = await page.evaluate(el => el.id, select);
            const parentText = await page.evaluate(el => el.parentElement.textContent, select);
            if (parentText.includes('Parent Product Family')) {
                familySelect = select;
                break;
            }
        }

        if (familySelect) {
            // Find an option whose make is "Wood Stains"
            // We can't see the make on the Family dropdown directly, so we just select the first one, 
            // check the badge, if not wood stain, select next, until we hit it.
            const options = await page.evaluate(sel => {
                return Array.from(sel.options).map(o => ({ val: o.value, text: o.textContent }));
            }, familySelect);

            for (let i = 1; i < options.length; i++) {
                await familySelect.select(options[i].val);
                await new Promise(r => setTimeout(r, 500));
                
                const hasStainBadge = await page.evaluate(() => {
                    const el = document.querySelector('.products-manager');
                    return el && el.textContent.includes('Wood Stain/Sealer form');
                });

                if (hasStainBadge) {
                    console.log('Found a Wood Stain family:', options[i].text);
                    break;
                }
            }
        }

        await new Promise(r => setTimeout(r, 1000));
        await page.screenshot({ path: '/Users/anthony/.gemini/antigravity/brain/33132862-458c-4472-96d4-47d85bad0672/wood_stain_sku_form_trigger_1773230617.png' });
        console.log('Screenshot saved!');

    } catch (err) {
        console.error('Error during automation:', err);
    } finally {
        await browser.close();
    }
})();
