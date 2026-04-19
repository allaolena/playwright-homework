import { test, expect } from '@playwright/test';


test.beforeEach(async ({ page }) => {
    // 1. Select the VETERINARIANS menu item in the navigation bar, then select "All"
    await page.goto('/')
    await page.getByRole('button', { name: 'Veterinarians' }).click()
    await page.getByRole('link', { name: 'All' }).click()
})

test('Validate selected specialties', async ({ page }) => {
    const specialtiesDropdown = page.locator('.selected-specialties')
    // 2. Add assertion of the "Veterinarians" text displayed above the table
    await expect(page.getByRole('heading')).toHaveText('Veterinarians')

    // 3. Select the veterinarian "Helen Leary" and click "Edit Vet" button
    await page.getByRole('row', { name: 'Helen Leary' }).getByRole('button', { name: 'Edit Vet' }).click()
    await expect(page.getByRole('heading')).toHaveText('Edit Veterinarian')

    // 4. Add assertion of the "Specialties" field. The value "radiology" is displayed
    await expect(specialtiesDropdown).toHaveText('radiology')

    // 5. Click on the "Specialties" drop-down menu
    await specialtiesDropdown.click()

    // 6. Add assertion that "radiology" specialty is checked
    expect(await page.getByRole('checkbox', { name: 'radiology' }).isChecked()).toBeTruthy()

    // 7. Add assertion that "surgery" and "dentistry" specialties are unchecked
    expect(await page.getByRole('checkbox', { name: 'surgery' }).isChecked()).toBeFalsy()
    expect(await page.getByRole('checkbox', { name: 'dentistry' }).isChecked()).toBeFalsy()

    // 8. Check the "surgery" item specialty and uncheck the "radiology" item specialty
    await page.getByRole('checkbox', { name: 'radiology' }).uncheck()
    await page.getByRole('checkbox', { name: 'surgery' }).check()

    // 9. Add assertion of the "Specialties" field displayed value "surgery"
    await expect(specialtiesDropdown).toHaveText('surgery')

    // 10. Check the "dentistry" item specialty
    await page.getByRole('checkbox', { name: 'dentistry' }).check()

    // 11. Add assertion of the "Specialties" field. The value "surgery, dentistry" is displayed
    await expect(specialtiesDropdown).toHaveText('surgery, dentistry')
})

test('Select all specialties', async ({ page }) => {
    const specialtiesDropdown = page.locator('.selected-specialties')
    // 2. Select the veterinarian "Rafael Ortega" and click "Edit Vet" button
    await page.getByRole('row', { name: 'Rafael Ortega' }).getByRole('button', { name: 'Edit Vet' }).click()

    // 3. Add assertion that "Specialties" field is displayed value "surgery"
    await expect(specialtiesDropdown).toHaveText('surgery')

    // 4. Click on the "Specialties" drop-down menu
    await (specialtiesDropdown).click()

    // 5. Check all specialties from the list
    const allCheckboxes = page.getByRole('checkbox')
    for (const checkbox of await allCheckboxes.all()) {
        await checkbox.check()

// 6. Add assertion that all specialties are checked    
        expect(await checkbox.isChecked()).toBeTruthy()
    }
    // 7. Add assertion that all checked specialities are displayed in the "Specialties" field
    await expect(specialtiesDropdown).toHaveText('surgery, radiology, dentistry')

})

test('Unselect all specialties', async ({ page }) => {
    const specialtiesDropdown = page.locator('.selected-specialties')
    // 2. Select the veterinarian "Linda Douglas" and click "Edit Vet" button
    await page.getByRole('row', { name: 'Linda Douglas' }).getByRole('button', { name: 'Edit Vet' }).click()

    // 3. Add assertion of the "Specialties" field displayed value "surgery, dentistry"
    await expect(specialtiesDropdown).toHaveText('dentistry, surgery')

    // 4. Click on the "Specialties" drop-down menu
    await specialtiesDropdown.click()

    // 5. Uncheck all specialties from the list
    const allCheckboxes = page.getByRole('checkbox')
    for (const checkbox of await allCheckboxes.all()) {
        await checkbox.uncheck()

    // 6. Add assertion that all specialties are unchecked
        expect(await checkbox.isChecked()).toBeFalsy()
    }

    // 7. Add assertion that "Specialties" field is empty
    await expect(specialtiesDropdown).toBeEmpty()
})