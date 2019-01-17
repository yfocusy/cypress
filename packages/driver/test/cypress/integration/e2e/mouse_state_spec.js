/// <reference path="@/../../../../../../../cli/types/index.d.ts"/>
const _ = Cypress._

// https://github.com/cypress-io/cypress/issues/2956
describe('mouse state', () => {

  describe('mouse/pointer events', () => {
    beforeEach(() => {
      cy.visit('http://localhost:3500/fixtures/dom.html')
    })
    describe('resets mouse state', () => {

      it('set state', () => {
        cy.get('div.item:first').then(($el) => {
          const mouseenter = cy.spy(() => {}).as('mouseenter')

          cy.get('body').then(($el) => {
            $el[0].addEventListener('mouseenter', mouseenter)
          }).then(() => {
            cy.internal.mouse.moveMouseToCoords($el[0].getBoundingClientRect())
            expect(mouseenter).to.be.calledOnce
            expect(cy.state('mouseCoords')).ok
          })
        })
      })

      it('reset state', () => {
        const mouseenter = cy.spy(() => {}).as('mouseenter')

        cy.get('body').then(($el) => {
          $el[0].addEventListener('mouseenter', mouseenter)
        }).then(() => {
          expect(cy.state('mouseCoords')).to.eq(undefined)
          expect(mouseenter).to.not.be.called
        })
        // expect(this.mousemove).to.have.been.called
      })
    })

    describe.only('mouseout', () => {

      it('can mouseout from div', () => {
        const spy = cy.spy(() => {

        }).as('mouseout')

        cy.get('div.item').eq(0).should(($el) => {
          $el[0].addEventListener('mouseout', spy)
        }).click()
        .then(() => {
          expect(cy.state('mouseCoords')).ok
        })
        cy.get('div.item').eq(1).click()
        .then(() => {
          // expect('a').to.eq('b')
          expect(cy.state('mouseCoords')).ok

          expect(spy.firstCall.args[0]).to.include({
            altKey: false,
            bubbles: true,
            button: 0,
            buttons: 0,
            cancelBubble: false,
            cancelable: true,
            clientX: 492,
            clientY: 9,
            composed: true,
            ctrlKey: false,
            currentTarget: null, //cy.$$('div.item'),
            defaultPrevented: false,
            detail: 0,
            eventPhase: 0,
            fromElement: cy.$$('div.item')[0],
            isTrusted: false,
            layerX: 492,
            layerY: 215,
            metaKey: false,
            movementX: 0,
            movementY: 0,
            offsetX: 484,
            offsetY: 27,
            pageX: 492,
            pageY: 215,
            relatedTarget: cy.$$('div.item')[0],
            returnValue: true,
            screenX: 492,
            screenY: 9,
            shiftKey: false,
            sourceCapabilities: null,
            srcElement: cy.$$('div.item')[0],
            target: cy.$$('div.item')[0],
            toElement: cy.$$('div.item')[0],
            type: 'mouseout',
            view: cy.state('window'),
            which: 1,
            x: 492,
            y: 9,
          })

        })
      })
    })
  })

  describe('mouseleave mouseenter animations', () => {
    beforeEach(() => {
      cy.visit('http://localhost:3500/fixtures/issue-2956.html')
    })
    it('sends mouseenter/mouseleave event', () => {
      cy.get('#outer').click()
      cy.get('#inner').should('be.visible')
      cy.get('body').click()
      cy.get('#inner').should('not.be.visible')
    })
  })
})
