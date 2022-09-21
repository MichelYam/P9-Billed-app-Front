/**
 * @jest-environment jsdom
 */

import { screen, waitFor, fireEvent } from "@testing-library/dom";
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
      // const html = NewBillUI()
      // document.body.innerHTML = html
      // //to-do write assertion

      // const form = screen.getByTestId("form-new-bill");
      // const handleSubmit = jest.fn((e) => e.preventDefault());

      // form.addEventListener("submit", handleSubmit);
      // fireEvent.submit(form);
      // expect(screen.getByTestId("form-new-bill")).toBeTruthy();
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
  // describe("When I do not fill fields and I click on button Send", () => {
  //   test("Then It should renders new Bill page", () => {
  //     const html = NewBillUI()
  //     document.body.innerHTML = html

  //     const inputExpenseType = screen.getByTestId("expense-type");
  //     expect(inputExpenseType.value).toBe("");

  //     const inputExpenseName = screen.getByTestId("expense-name");
  //     expect(inputExpenseName.value).toBe("");

  //     const inputDatePicker = screen.getByTestId("datepicker");
  //     expect(inputDatePicker.value).toBe("");

  //     const inputAmount = screen.getByTestId("amount");
  //     expect(inputAmount.value).toBe("");

  //     const inputVAT = screen.getByTestId("vat");
  //     expect(inputVAT.value).toBe("");

  //     const inputPCT = screen.getByTestId("pct");
  //     expect(inputPCT.value).toBe("");

  //     const inputCommentary = screen.getByTestId("commentary");
  //     expect(inputCommentary.value).toBe("");

  //     const inputFile = screen.getByTestId("file");
  //     expect(inputFile.value).toBe("");

  //     const form = screen.getByTestId("form-new-bill");

  //     form.addEventListener("submit", handleSubmit);
  //     fireEvent.submit(form);
  //     expect(screen.getByTestId("form-employee")).toBeTruthy();
  //   })
  // })
  // test d'intégration POST
  describe("When I do fill fields in correct format and I click on button Send", () => {
    test("Then it should add the new bill to the list", () => {
      const html = NewBillUI()
      document.body.innerHTML = html

      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname });
      };

      const form = screen.getByTestId("form-new-bill");
      const newBill = new NewBill({
        document,
        onNavigate,
        store,
        localStorage: window.localStorage,
      });
      const inputEmailUser = screen.getByTestId("admin-email-input");
      fireEvent.change(inputEmailUser, { target: { value: "pasunemail" } });
      expect(inputEmailUser.value).toBe("pasunemail");

      const inputExpenseType = screen.getByTestId("expense-type");
      fireEvent.change(inputExpenseType, { target: { value: "pasunemail" } });
      expect(inputExpenseType.value).toBe("pasunemail");

      const inputExpenseName = screen.getByTestId("expense-name");
      fireEvent.change(inputExpenseName, { target: { value: "pasunemail" } });
      expect(inputExpenseName.value).toBe("pasunemail");

      const inputDatePicker = screen.getByTestId("datepicker");
      fireEvent.change(inputDatePicker, { target: { value: "pasunemail" } });
      expect(inputDatePicker.value).toBe("pasunemail");

      const inputAmount = screen.getByTestId("amount");
      fireEvent.change(inputAmount, { target: { value: "pasunemail" } });
      expect(inputAmount.value).toBe("pasunemail");

      const inputVAT = screen.getByTestId("vat");
      fireEvent.change(inputVAT, { target: { value: "pasunemail" } });
      expect(inputVAT.value).toBe("pasunemail");

      const inputPCT = screen.getByTestId("pct");
      fireEvent.change(inputPCT, { target: { value: "pasunemail" } });
      expect(inputPCT.value).toBe("pasunemail");

      const inputCommentary = screen.getByTestId("commentary");
      fireEvent.change(inputCommentary, { target: { value: "pasunemail" } });
      expect(inputCommentary.value).toBe("pasunemail");;

      const inputFile = screen.getByTestId("file");
      fireEvent.change(inputFile, { target: { value: "pasunemail" } });
      expect(inputFile.value).toBe("pasunemail");

      const handleSubmit = jest.fn((e) => newBill.handleSubmit(e));
      const submitForm = screen.getByTestId("form-new-bill");
      form.addEventListener("submit", handleSubmit);
      fireEvent.submit(submitForm);
      expect(handleSubmit).toHaveBeenCalled();
    })
    test("Then fails with 404 message error", async () => {
      const html = BillsUI({ error: "Erreur 404" })
      document.body.innerHTML = html

      const message = await screen.getByText(/Erreur 404/)
      expect(message).toBeTruthy()
    })
    test("Then fails with 500 message error", async () => {
      const html = BillsUI({ error: "Erreur 500" })
      document.body.innerHTML = html

      const message = await screen.getByText(/Erreur 500/)
      expect(message).toBeTruthy()
    })
  })
})
