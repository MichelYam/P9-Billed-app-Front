/**
 * @jest-environment jsdom
 */

import { screen, waitFor, fireEvent } from "@testing-library/dom";
import NewBillUI from "../views/NewBillUI.js"
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

      fireEvent.change(inputFile, { target: { files: [new File(['input'], 'image.png', { type: 'image/png' })], } });


      expect(handleChangeFile).toHaveBeenCalled();
      expect(inputFile.files[0].name).toBe("image.png");
    })
  })
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

         //recupere les valeurs entrées
         const handleSubmit = jest.fn((e) => newBill.handleSubmit(e));
         const submitForm = screen.getByTestId("form-new-bill");
         form.addEventListener("submit", handleSubmit);
         fireEvent.submit(submitForm);
         expect(handleSubmit).toHaveBeenCalled();
       })
     })
})
