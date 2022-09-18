/**
 * @jest-environment jsdom
 */

import { screen, waitFor } from "@testing-library/dom"
import BillsUI from "../views/BillsUI.js"
import { bills } from "../fixtures/bills.js"
import { ROUTES, ROUTES_PATH } from "../constants/routes"
import { localStorageMock } from "../__mocks__/localStorage.js";
import Bills from "../containers/Bills.js";
import mockStore from "../__mocks__/store"

import router from "../app/Router.js";

describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {
    test("Then bill icon in vertical layout should be highlighted", async () => {

      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.Bills)
      await waitFor(() => screen.getByTestId('icon-window'))
      const windowIcon = screen.getByTestId('icon-window')
      //to-do write expect expression
      console.log(windowIcon)
      //Verify if the icon had "actvite-icon" class
      const iconActive = windowIcon.classList.contains("active-icon");
      expect(iconActive).toBeTruthy();
    })
    test("Then bills should be ordered from earliest to latest", () => {
      document.body.innerHTML = BillsUI({ data: bills })
      const dates = screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map(a => a.innerHTML)
      const antiChrono = (a, b) => ((a < b) ? 1 : -1)
      const datesSorted = [...dates].sort(antiChrono)
      expect(dates).toEqual(datesSorted)
    })


  })
  describe("When I am on Bills Page and I click on the icon eye ", () => {
    test("Then a modal should open")
  })
  describe("When I am on Bills Page and I click on the button 'new bill'", () => {
    test("It should renders New Bill page ")
  })
  // test d'intégration GET
  // describe("When I navigate to Dashboard", () => {
  test("fetches bills from mock API GET", async () => {
    Object.defineProperty(window, 'localstorage', { value: localStorageMock });
    window.localStorage.setItem("user", JSON.stringify({ type: "Employeen" }));

    const root = document.createElement("div")
    root.setAttribute("id", "root")
    document.body.append(root)

    router()
    window.onNavigate(ROUTES_PATH.Bills)

    const bills = new Bills({
      document,
      onNavigate,
      store: mockStore,
      localStorage
    })
    const pathname = ROUTES_PATH["Bills"];
    root.innerHTML = ROUTES({ pathname: pathname, loading: true });

    bills.getBills().then((bill) => {
      root.innerHTML = BillsUI({ bill })
      expect(document.querySelector('tbody').rows.length).toBeGreaterThan(0);
    })
  })
  describe("When an error occurs on API", () => {
    beforeEach(() => {
      jest.spyOn(mockStore, "bills")
      Object.defineProperty(
        window,
        'localStorage',
        { value: localStorageMock }
      )
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee',
        email: "a@a"
      }))
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.appendChild(root)
      router()
    })
    test("fetches bills from an API and fails with 404 message error", async () => {
      const uiMsg = BillsUI({ error: "Erreur 404" })
      document.body.innerHTML = uiMsg

      const message = await screen.getByText(/Erreur 404/)
      expect(message).toBeTruthy()
      // mockStore.bills.mockImplementationOnce(() => {
      //   return {
      //     list: () => {
      //       return Promise.reject(new Error("Erreur 404"))
      //     }
      //   }
      // })
      // window.onNavigate(ROUTES_PATH.Bills)
      // await new Promise(process.nextTick);
      // const message = await screen.getByText(/Erreur 404/)
      // expect(message).toBeTruthy()
    })

    test("fetches messages from an API and fails with 500 message error", async () => {

      // mockStore.bills.mockImplementationOnce(() => {
      //   return {
      //     list: () => {
      //       return Promise.reject(new Error("Erreur 500"))
      //     }
      //   }
      // })
      const uiMsg = BillsUI({ error: "Erreur 500" })
      document.body.innerHTML = uiMsg

      // window.onNavigate(ROUTES_PATH.Bills)
      // await new Promise(process.nextTick);
      const message = await screen.getByText(/Erreur 500/)
      expect(message).toBeTruthy()
    })
  })

  // })
})
