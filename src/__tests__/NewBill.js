/**
 * @jest-environment jsdom
 */

 import { screen } from "@testing-library/dom"
 import NewBillUI from "../views/NewBillUI.js"
 import NewBill from "../containers/NewBill.js"
 import { ROUTES_PATH, ROUTES } from "../constants/routes.js";
 
 describe("Given I am connected as an employee", () => {
   describe("When I am on NewBill Page", () => {
     test("Then, the form should Appear", () => {
       const html = NewBillUI()
       document.body.innerHTML = html
       //to-do write assertion
 
     })
   })
   describe("When I choose a file with an incorret extension", () => {
     test("Then it should display error message", () => {
       const html = NewBillUI()
       document.body.innerHTML = html
       const onNavigate = (pathname) => {
         document.body.innerHTML = ROUTES({ pathname });
       };
       //Create element to dipslay error message
       const newContent = document.createTextNode('Error file (this extension is not allowed)');
       const p = document.createElement('p')
       p.appendChild(newContent)
       p.setAttribute("id", "error-msg")
 
       const inputFile = screen.getByTestId("file")
 
       const newBill = new NewBill({
         document,
         onNavigate,
         store,
         localStorage: window.localStorage,
       });
       const handleChangeFile = jest.fn((e) => newBill.handleChangeFile(e));
 
       inputFile.addEventListener("change", handleChangeFile)
       document.body.insertAfter(newDiv, currentDiv);
       expect(handleChangeFile).toHaveBeenCalled();
       expect(input.files[0].name).toBe("file.pdf");
       expect(inputFile.innerHTML += p).toHaveBeenCalled();
     })
   })
   // test d'intégration POST
   describe("When I do fill fields in correct format and I click on button Send", () => {
     test("Then it should add the new bills to the list", () => {
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
 