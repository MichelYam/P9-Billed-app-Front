/**
 * @jest-environment jsdom
 */

import { screen, waitFor, fireEvent } from "@testing-library/dom";
import userEvent from '@testing-library/user-event'
import NewBillUI from "../views/NewBillUI.js"
import BillsUI from "../views/BillsUI.js"
import NewBill from "../containers/NewBill.js"
import { localStorageMock } from "../__mocks__/localStorage.js";
import { ROUTES_PATH, ROUTES } from "../constants/routes.js";
import store from "../__mocks__/store.js"
import router from "../app/Router.js";


describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    test("Then, the form should Appear", () => {
      const html = NewBillUI()
      document.body.innerHTML = html
      //to-do write assertion

      expect(screen.getByTestId("form-new-bill")).toBeTruthy();
    })
    test("Then mail icon in vertical layout should be highlighted", async () => {
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.NewBill)
      await waitFor(() => screen.getByTestId('icon-mail'))
      const mailIcon = screen.getByTestId('icon-mail')
      console.log(mailIcon)
      const iconActive = mailIcon.classList.contains("active-icon");
      expect(iconActive).toBeTruthy();
    })
  })
  describe("When I am on NewBill Page and I choose a file with an incorret extension", () => {
    test("Then it should display error message", () => {
      const html = NewBillUI()
      document.body.innerHTML = html

      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname });
      };

      const newBill = new NewBill({
        document,
        onNavigate,
        store,
        localStorage: window.localStorage,
      });
      const inputFile = screen.getByTestId("file");
      const handleChangeFile = jest.fn((e) => newBill.handleChangeFile(e));

      inputFile.addEventListener("change", handleChangeFile)
      fireEvent.change(inputFile, { target: { files: [new File(['input'], 'image.pdf', { type: 'image/png' })], } });

      expect(handleChangeFile).toHaveBeenCalled();
      expect(inputFile.files[0].name).not.toBe("image.png");
    })
  })

  describe("When I am on NewBill Page and I choose a file with a correct extension", () => {
    test("Then it should display the file name", () => {
      const html = NewBillUI()
      document.body.innerHTML = html

      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname });
      };

      const newBill = new NewBill({
        document,
        onNavigate,
        store,
        localStorage: window.localStorage,
      });

      const inputFile = screen.getByTestId("file");
      const handleChangeFile = jest.fn((e) => newBill.handleChangeFile(e));

      inputFile.addEventListener("change", handleChangeFile)

      fireEvent.change(inputFile, { target: { files: [new File(['input'], 'image.png', { type: 'image/png' })], } });


      expect(handleChangeFile).toHaveBeenCalled();
      expect(inputFile.files[0].name).toBe("image.png");
    })
  })
  // test d'intégration POST
  describe("When I do fill fields in correct format and I click on button Send", () => {
    test("Then it should add the new bill to the list", () => {
      document.body.innerHTML = NewBillUI()

      Object.defineProperty(window, "localStorage",
        { value: { getItem: jest.fn(() => JSON.stringify({ email: "email@test.com", })), }, }
      );
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname });
      };

      const inputData = {
        type: "Transports",
        name: "Name",
        datepicker: "2022-06-02",
        amount: "364",
        vat: "80",
        pct: "20",
        commentary: "Commentary",
        file: new File(["test"], "test.png", { type: "image/png" }),
      };

      const inputExpenseType = screen.getByTestId("expense-type");
      fireEvent.change(inputExpenseType, { target: { value: inputData.type } });
      expect(inputExpenseType.value).toBe(inputData.type);

      const inputExpenseName = screen.getByTestId("expense-name");
      fireEvent.change(inputExpenseName, { target: { value: inputData.name } });
      expect(inputExpenseName.value).toBe(inputData.name);

      const inputDatePicker = screen.getByTestId("datepicker");
      fireEvent.change(inputDatePicker, { target: { value: inputData.datepicker } });
      expect(inputDatePicker.value).toBe(inputData.datepicker);

      const inputAmount = screen.getByTestId("amount");
      fireEvent.change(inputAmount, { target: { value: inputData.amount } });
      expect(inputAmount.value).toBe(inputData.amount);

      const inputVAT = screen.getByTestId("vat");
      fireEvent.change(inputVAT, { target: { value: inputData.vat } });
      expect(inputVAT.value).toBe(inputData.vat);

      const inputPCT = screen.getByTestId("pct");
      fireEvent.change(inputPCT, { target: { value: inputData.pct } });
      expect(inputPCT.value).toBe(inputData.pct);

      const inputCommentary = screen.getByTestId("commentary");
      fireEvent.change(inputCommentary, { target: { value: inputData.commentary } });
      expect(inputCommentary.value).toBe(inputData.commentary);

      const inputFile = screen.getByTestId("file");
      userEvent.upload(inputFile, inputData.file);
      expect(inputFile.files[0]).toStrictEqual(inputData.file);
      expect(inputFile.files).toHaveLength(1);

      const newBill = new NewBill({
        document,
        onNavigate,
        store,
        localStorage: window.localStorage,
      });

      const submitForm = screen.getByTestId("form-new-bill");
      const handleSubmit = jest.fn((e) => newBill.handleSubmit(e));
      submitForm.addEventListener("submit", handleSubmit);
      fireEvent.submit(submitForm);
      expect(handleSubmit).toHaveBeenCalled();
    })
    test("Then fails with 404 message error", () => {
      const html = BillsUI({ error: "Erreur 404" })
      document.body.innerHTML = html

      const message = screen.getByText(/Erreur 404/)
      expect(message).toBeTruthy()
    })
    test("Then fails with 500 message error", () => {
      const html = BillsUI({ error: "Erreur 500" })
      document.body.innerHTML = html

      const message = screen.getByText(/Erreur 500/)
      expect(message).toBeTruthy()
    })
  })
})
