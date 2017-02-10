
import React from 'react';

export let braintree = {

    name: `Braintree`,

    fullName: `Braintree Express Checkout`,

    description: (
        <div>
            <p>Create a PayPal button and accept payments using a Braintree integration.</p>
            <hr />
            <p>First, we generate a Braintree client token and initialize the Braintree javascript client, using <span className="pre">braintree.client.create()</span> and <span className="pre">braintree.paypal.create()</span>.</p>
            <p>Then, a button is created using <span className="pre">paypal.Button.render()</span>, and rendered to the <span className="pre">#paypal-button-container</span> element.</p>
            <p>When the button is clicked, <span className="pre">payment()</span> is called. This function then uses <span className="pre">paypalClient.createPayment()</span> to invoke Braintree and create the payment.</p>
            <p>When the payment is authorized by the customer, <span className="pre">onAuthorize()</span> is called. This function then uses <span className="pre">paypalClient.tokenizePayment()</span> to invoke Braintree to tokenize the payment, then <span className="pre">paypal.request.post()</span> to invoke the merchant server and finalize the payment using the Braintree SDK.</p>
        </div>
    ),

    code: (ctx) => `
        <div id="paypal-button-container"></div>

        <script>

            // Set up the Braintree client

            paypal.request.get('/generate-client-token').then(function(res) {
                braintree.client.create({ authorization: res.clientToken }, function (err, client) {
                    braintree.paypal.create({ client: client }, function (err, paypalClient) {

                        // Render the PayPal button

                        paypal.Button.render({

                            // Set your environment

                            env: 'sandbox', // sandbox | production

                            // Wait for the PayPal button to be clicked

                            payment: function(resolve, reject) {

                                // Call Braintree to create the payment

                                return paypalClient.createPayment({
                                    flow:     'checkout',
                                    amount:   '1.00',
                                    currency: 'USD',
                                    intent:   'sale'

                                }, function (err, data) {
                                    return err ? reject(err) : resolve(data.paymentID);
                                });
                            },

                            // Wait for the payment to be authorized by the customer

                            onAuthorize: function(data, actions) {

                                // Call Braintree to tokenize the payment

                                return paypalClient.tokenizePayment(data, function (err, result) {

                                    // Call your server to finalize the payment

                                    return paypal.request.post('/payment', {
                                        nonce: result.nonce,
                                        amount: transaction.amount,
                                        currency: transaction.currency

                                    }).then(function (res) {
                                        document.querySelector('#paypal-button-container').innerText = 'Payment Complete!';
                                    });
                                });
                            }

                        }, '#paypal-button-container');

                    });
                });
            });

        </script>
    `
};