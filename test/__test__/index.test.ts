import * as puppeteer from "puppeteer";
import IndexPage from "./page/IndexPage";
import { WAIT_TIME_MEDIUM, WAIT_TIME_SHORT } from "./constants/constants";
import { generateRandomStr, sleep } from "./utils";

let page: puppeteer.Page;
let browser: puppeteer.Browser;
let indexPage: IndexPage;

const validName = "John Doe";
const validEmail = "test@email.com";
const validPhoneNumber = "082212345678";

describe("Display", () => {
  beforeAll(async () => {
    browser = await puppeteer.launch({ headless: false });
    page = await browser.newPage();
    indexPage = new IndexPage(page);
    await indexPage.goto();
  });

  beforeEach(async () => {
    await page.reload({ waitUntil: ["domcontentloaded"] });
  });

  afterAll(() => {
    if (!page.isClosed()) {
      browser.close();
    }
  });

  it("Should show input when text area clicked", async () => {
    const notesTextArea = await indexPage.getNotesTextArea();
    expect(notesTextArea).toBeDefined();

    const detailsArea = await indexPage.getDetailsArea();
    expect(detailsArea).toBeDefined();

    expect(
      await detailsArea?.evaluate((el) => {
        return el.getBoundingClientRect().height;
      })
    ).toBe(0);

    await notesTextArea?.click();
    await sleep(WAIT_TIME_SHORT);
    expect(
      await detailsArea?.evaluate((el) => {
        return el.getBoundingClientRect().height;
      })
    ).toBeGreaterThan(0);
  });
});

describe("Create note", () => {
  beforeAll(async () => {
    browser = await puppeteer.launch({ headless: false });
    page = await browser.newPage();
    indexPage = new IndexPage(page);

    await indexPage.goto();
    const notesTextArea = await indexPage.getNotesTextArea();
    expect(notesTextArea).toBeDefined();
    await notesTextArea?.click();
    await sleep(WAIT_TIME_SHORT);
  });

  beforeEach(async () => {
    await page.reload({ waitUntil: ["domcontentloaded"] });
  });

  afterAll(() => {
    if (!page.isClosed()) {
      browser.close();
    }
  });

  it("Should be able to create note", async () => {
    const nameInput = await indexPage.getNameInput();
    await nameInput?.type(validName);

    const emailInput = await indexPage.getEmailInput();
    await emailInput?.type(validEmail);

    const phoneInput = await indexPage.getPhoneInput();
    await phoneInput?.type(validPhoneNumber);

    const validNote = generateRandomStr(25);
    const notesTextArea = await indexPage.getNotesTextArea();
    await notesTextArea?.type(validNote);

    const beforeLen = (await indexPage.getAllNote()).length;

    const submitBtn = await indexPage.getSubmitBtn();
    await submitBtn?.click();
    await sleep(WAIT_TIME_MEDIUM);

    const afterLen = (await indexPage.getAllNote()).length;
    expect(afterLen).toBeGreaterThan(beforeLen);

    const lastNote = (await indexPage.getAllNote())[0];
    const lastNoteId = await lastNote.evaluate((el) => {
      const id = el.id.split("-")[1];
      return id;
    });

    const lastNoteDetail = await indexPage.getNote(lastNoteId);
    await lastNoteDetail.seeMoreBtn?.click();
    sleep(WAIT_TIME_SHORT)

    expect(await lastNoteDetail.name?.evaluate((el) => el.innerHTML)).toBe(
      validName
    );
    expect(await lastNoteDetail.email?.evaluate((el) => el.innerHTML)).toBe(
      validEmail
    );
    expect(await lastNoteDetail.phone?.evaluate((el) => el.innerHTML)).toBe(
      validPhoneNumber
    );
    expect(await lastNoteDetail.content?.evaluate((el) => el.innerHTML)).toBe(
      validNote
    );
  });

  it("Should not be able to submit if `notes` is more than 3 char", async () => {
    const nameInput = await indexPage.getNameInput();
    await nameInput?.type(validName);

    const emailInput = await indexPage.getEmailInput();
    await emailInput?.type(validEmail);

    const phoneInput = await indexPage.getPhoneInput();
    await phoneInput?.type(validPhoneNumber);

    const notesTextArea = await indexPage.getNotesTextArea();
    await notesTextArea?.type("ab");

    const beforeLen = (await indexPage.getAllNote()).length;

    const submitBtn = await indexPage.getSubmitBtn();
    await submitBtn?.click();
    await sleep(WAIT_TIME_MEDIUM);

    const afterLen = (await indexPage.getAllNote()).length;

    expect(afterLen).toBe(beforeLen);
  });

  it("Should not be able to submit if `name` is not valid", async () => {
    const nameInput = await indexPage.getNameInput();
    await nameInput?.type("Hi!@( I;m not v4l!!d");

    const emailInput = await indexPage.getEmailInput();
    await emailInput?.type(validEmail);

    const phoneInput = await indexPage.getPhoneInput();
    await phoneInput?.type(validPhoneNumber);

    const validNote = generateRandomStr(25);
    const notesTextArea = await indexPage.getNotesTextArea();
    await notesTextArea?.type(validNote);

    const beforeLen = (await indexPage.getAllNote()).length;

    const submitBtn = await indexPage.getSubmitBtn();
    await submitBtn?.click();
    await sleep(WAIT_TIME_MEDIUM);

    const afterLen = (await indexPage.getAllNote()).length;

    expect(afterLen).toBe(beforeLen);
  });

  it("Should not be able to submit if `email` is not valid", async () => {
    const nameInput = await indexPage.getNameInput();
    await nameInput?.type(validName);

    const emailInput = await indexPage.getEmailInput();
    await emailInput?.type("invalid");

    const phoneInput = await indexPage.getPhoneInput();
    await phoneInput?.type(validPhoneNumber);

    const validNote = generateRandomStr(25);
    const notesTextArea = await indexPage.getNotesTextArea();
    await notesTextArea?.type(validNote);

    const beforeLen = (await indexPage.getAllNote()).length;

    const submitBtn = await indexPage.getSubmitBtn();
    await submitBtn?.click();
    await sleep(WAIT_TIME_MEDIUM);

    const afterLen = (await indexPage.getAllNote()).length;

    expect(afterLen).toBe(beforeLen);
  });

  it("Should not be able to submit if `email` is not valid", async () => {
    const nameInput = await indexPage.getNameInput();
    await nameInput?.type(validName);

    const emailInput = await indexPage.getEmailInput();
    await emailInput?.type(validEmail);

    const phoneInput = await indexPage.getPhoneInput();
    await phoneInput?.type("1234");

    const validNote = generateRandomStr(25);
    const notesTextArea = await indexPage.getNotesTextArea();
    await notesTextArea?.type(validNote);

    const beforeLen = (await indexPage.getAllNote()).length;

    const submitBtn = await indexPage.getSubmitBtn();
    await submitBtn?.click();
    await sleep(WAIT_TIME_MEDIUM);

    const afterLen = (await indexPage.getAllNote()).length;

    expect(afterLen).toBe(beforeLen);
  });
});
