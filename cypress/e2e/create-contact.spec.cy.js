var randomEmail = 'test' + Math.floor(Math.random()*500) + '@example.com'

before(() => {
    //Visit given url
    cy.visit('https://thinking-tester-contact-list.herokuapp.com/')
    //Confirm that the page has loaded and main content class is visible
    cy.get('.main-content').should('be.visible')
})

describe('Signup', () => {
    it('can signup', () => {
        cy.get('#signup').should('be.visible').click()
        cy.get('#add-user').should('be.visible')
        //Fill in first name, last name, email and password fields
        cy.get('#firstName').type('John')
        cy.get('#lastName').type('Doe')
        cy.get('#email').type('johnny.doe@example.com')
        cy.get('#password').type('Test12345!')

        //Intercept to get the user's token
        cy.intercept('POST', 'https://thinking-tester-contact-list.herokuapp.com/users').as('users')
        
        //Click Submit
        cy.get('#submit').click()

        //Get the token and store it as environmental variable
        cy.wait('@users').then(({response}) => {
            const token = response.body.token
            Cypress.env('token', token)
        })

        //Confirm that the user is logged in
        cy.get('#logout').should('be.visible')
    })
})

describe('Add a contact', () => {
    it('can add a new contact', () => {
        cy.get('#add-contact').click()
        //Add contact form should be visible
        cy.get('#add-contact').should('be.visible')

        //Fill in all fields
        cy.get('#firstName').type('ContactFirstName')
        cy.get('#lastName').type('ContactLastName')
        cy.get('#birthdate').type('1990-01-01')
        cy.get('#email').type(randomEmail)
        cy.get('#phone').type('8005551234')
        cy.get('#street1').type('Address 1')
        cy.get('#street2').type('Address 2')
        cy.get('#city').type('New York')
        cy.get('#stateProvince').type('NY')
        cy.get('#postalCode').type('12345')
        cy.get('#country').type('USA')

        cy.get('#submit').click()

        //Confirm that the contact had been added
        cy.get('tr').contains(randomEmail).should('be.visible')
    })

    it('cannot add a contact with invalid date of birth', () => {
        cy.get('#add-contact').click()
        cy.get('#add-contact').should('be.visible')
        cy.get('#firstName').type('ContactFirstName')
        cy.get('#lastName').type('ContactLastName')
        cy.get('#birthdate').type('something')
        cy.get('#submit').click()
        cy.get('#error').contains('Contact validation failed: birthdate: Birthdate is invalid')
        cy.get('#cancel').click()
    })
})

describe('Contact Details Page', () => {
    it('can validate a contact', () => {
        //Select the added contact
        cy.get('tr').contains(randomEmail).click()
        //Contact details form is visible
        cy.get('#contactDetails').should('be.visible')
        cy.get('#firstName').should('contain', 'ContactFirstName')
        cy.get('#lastName').should('contain', 'ContactLastName')
        cy.get('#birthdate').should('contain', '1990-01-01')
        cy.get('#email').should('contain', randomEmail)
        cy.get('#phone').should('contain', '8005551234')
        cy.get('#street1').should('contain', 'Address 1')
        cy.get('#street2').should('contain', 'Address 2')
        cy.get('#city').should('contain', 'New York')
        cy.get('#stateProvince').should('contain', 'NY')
        cy.get('#postalCode').should('contain', '12345')
        cy.get('#country').should('contain', 'USA')
    })
})

describe('Delete a contact', () => {
    it('can delete a contact', () => {
        cy.get('#delete').click()
        cy.get('tr').contains(randomEmail).should('not.exist')
    })
})

after(() => {
    cy.deleteUser()
})