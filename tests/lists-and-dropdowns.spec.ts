import { test, expect, Page } from '@playwright/test';

// helper-function for repeating actions
async function updatePetType(page: Page, fromType: string, toType: string) {
    await expect(page.getByRole('textbox', { name: 'Name' })).toHaveValue('Rosy')
    await expect(page.getByLabel('Type')).toHaveValue(fromType)
    await page.getByRole('combobox', { name: 'Type' }).selectOption(toType)
    await expect(page.locator('#type1')).toHaveValue(toType)
    await expect(page.getByLabel('Type')).toHaveValue(toType)
    await page.getByRole('button', { name: 'Update Pet' }).click()
    await expect(page.locator('td', { hasText: 'Rosy' })).toContainText(toType)
}

test.beforeEach(async ({ page }) => {
    // 1. Select the OWNERS menu item in the navigation bar and then select "Search"
    // 2. Add assertion of the "Owners" text displayed
    await page.goto('/')
    await page.getByRole('button', { name: 'Owners' }).click()
    await page.getByRole('link', { name: 'Search' }).click()
    await expect(page.getByRole('heading')).toHaveText('Owners')
})

test('Validate selected pet types from the list', async ({ page }) => {
    // 3. Select the first owner, "George Franklin"
    await page.getByRole('link', { name: 'George Franklin' }).click()

    // 4. Add the assertion for the owner "Name", the value "George Franklin" is displayed
    await expect(page.locator('tr', { hasText: 'Name' }).locator('.ownerFullName')).toHaveText('George Franklin')

    // 5. In the "Pets and Visits" section, click on "Edit Pet" button for the pet "Leo"
    await page.getByRole('button', { name: 'Edit Pet' }).click()

    // 6. Add assertion of "Pet" text displayed as a header on the page
    await expect(page.getByRole('heading')).toHaveText('Pet')

    // 7. Add the assertion "George Franklin" name is displayed in the "Owner" field
    await expect(page.locator('div').filter({ hasText: /^Owner$/ }).locator('#owner_name')).toHaveValue('George Franklin')

    // 8. Add the assertion that the value "cat" is displayed in the "Type" field
    await expect(page.getByLabel('Type')).toHaveValue('cat')

    // 9. Using a loop, select the values from the drop-down one by one and assert each
    const optionList = page.getByRole('combobox', { name: 'Type' })
    const types = ['cat', 'dog', 'lizard', 'snake', 'bird', 'hamster']
    for (const type of types) {
        await optionList.selectOption(type)
        await expect(optionList).toHaveValue(type)
    }
})

test('Validate the pet type update', async ({ page }) => {
    // 3. Select the owner "Eduardo Rodriquez"
    await page.getByRole('link', { name: 'Eduardo Rodriquez' }).click()

    // 4. Click on "Edit Pet" button for the pet "Rosy"
    await page.locator('td', { hasText: 'Rosy' }).getByRole('button', { name: 'Edit Pet' }).click()

    // 5-10. Update dog to bird and verify
    await updatePetType(page, 'dog', 'bird')

    // 11. Click Edit Pet again to revert
    await page.locator('td', { hasText: 'Rosy' }).getByRole('button', { name: 'Edit Pet' }).click()

    // 12-17. Revert bird to dog and verify
    await updatePetType(page, 'bird', 'dog')
})