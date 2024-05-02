//Deletes the logged in user
Cypress.Commands.add('deleteUser', () => {
    cy.request({
        headers: {
            authorization: 'Bearer ' + Cypress.env('token')
        },
        method: "DELETE",
        url: "https://thinking-tester-contact-list.herokuapp.com/users/me"
    }).then((response) => {
        expect(response.status).to.eq(200)
    })
})