
        describe('API Test for https://identity.concentrixcx.com/health', () => {
            it('Test GET request for /health endpoint', () => {
              cy.request({
                method: 'GET',
                url: 'https://identity.concentrixcx.com/health',
              }).then((response) => {
                expect(response.status).to.eq(200);
                expect(response.body).to.not.be.null;
              })
            });
          });