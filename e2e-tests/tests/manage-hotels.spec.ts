import { test, expect } from '@playwright/test';
import path from "path";

const UI_URL = "http://localhost:5173/"

// check signin
test.beforeEach(async ({page}) => {

  await page.goto(UI_URL);
    //get sign in button
  await page.getByRole('link', {name: "Sign In"}).click();

  // expects page to have Sign in as text in page
  await expect(page.getByRole('heading', {name:"Sign In"})).toBeVisible();

  // add the email and pass
  await page.locator("[name=email]").fill("1@1.com");
  await page.locator("[name=password]").fill("password123");

  //click login button
  await page.getByRole("button", {name: "Login"}).click();

  // check if successfully signed in - toast msg
  await expect(page.getByText("Sign in Successful!")).toBeVisible();
});

test('should allow user to add hotel', async ({ page }) => {
  await page.goto(`${UI_URL}add-hotel`);

  await page.locator('[name="name"]').fill("Test Hotel");
  await page.locator('[name="city"]').fill("Test City");
  await page.locator('[name="country"]').fill("Test Country");
  await page
    .locator('[name="description"]')
    .fill("This is a description for the Test Hotel");
  await page.locator('[name="pricePerNight"]').fill("100");
  await page.selectOption('select[name="starRating"]', "3");

  await page.getByText("SubLease").click();//Hotel type

  await page.getByLabel("Free Wifi").check();// Facilities
  await page.getByLabel("Parking").check();

  await page.locator('[name="adultCount"]').fill("2");
  await page.locator('[name="childCount"]').fill("4");

  await page.setInputFiles('[name="imageFiles"]', [
    path.join(__dirname, "files", "1.png"),
    path.join(__dirname, "files", "2.png"),
  ]);

  await page.getByRole("button", { name: "Save" }).click();
  await expect(page.getByText("Hotel Saved!")).toBeVisible();
});