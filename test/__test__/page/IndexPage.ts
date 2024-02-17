import { Page } from "puppeteer";
import fs from "fs";

export default class IndexPage {
  page: Page;
  constructor(page: Page) {
    this.page = page;
  }

  async goto() {
    const absPath = fs.realpathSync("./../fe/index.html");
    await this.page.goto(`file://${absPath}`, {
      waitUntil: "domcontentloaded",
    });
  }

  async getNotesTextArea() {
    return await this.page.$("textarea#notes");
  }

  async getDetailsArea() {
    return await this.page.$("#details-area");
  }

  async getNameInput() {
    return await this.page.$("input#name");
  }

  async getEmailInput() {
    return await this.page.$("input#email");
  }

  async getPhoneInput() {
    return await this.page.$("input#phone");
  }

  async getSubmitBtn() {
    return await this.page.$("button#submit-btn");
  }

  async getReadNoteSection() {
    return await this.page.$("#read-note");
  }

  async getAllNote() {
    return await this.page.$$(`div.note[id^="note-"]`)
  }

  async getNote(id: string) {
    return {
      name: await this.page.$(`p#note-name-${id}`),
      email: await this.page.$(`span#note-email-${id}`),
      phone: await this.page.$(`span#note-phone-${id}`),
      content: await this.page.$(`p#note-content-${id}`),
      seeMoreBtn: await this.page.$(`button#see-more-btn-${id}`),
      noteDetailsDiv: await this.page.$(`div#note-details-${id}`)
    }
  }
  
}
