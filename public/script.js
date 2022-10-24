
paypal.Buttons({
    createOrder: function() {
      // This function sets up the details of the transaction, including the amount and line item details.
      return fetch('/api/orders/paypal/:userId', {
        //upload json data
        method: "POST",
        
      })
        .then(res => {
          if(res.ok)
            return res.json(); 
          return res.json().then(json => Promise.reject(json))  //return for reject message of promise
        })
        .then(({ id }) => {
          return id;
        })
        .catch( (e) => {
          console.error(e.error);
        })
      },
      onApprove: function (data, actions) {
        return fetch(`/api/orders/${data.userId}/capture`, {
          method: "post",
        })
          .then((response) => response.json())
          .then(function (orderData) {
            // Successful capture! For dev/demo purposes:
            console.log(
              "Capture result",
              orderData,
              JSON.stringify(orderData, null, 2)
            );
            var transaction = orderData.purchase_units[0].payments.captures[0];
            alert(
              "Transaction " +
                transaction.status +
                ": " +
                transaction.id +
                "\n\nSee console for all available details"
            );
  
            // When ready to go live, remove the alert and show a success message within this page. For example:
            // var element = document.getElementById('paypal-button-container');
            // element.innerHTML = '';
            // element.innerHTML = '<h3>Thank you for your payment!</h3>';
            // Or go to another URL:  actions.redirect('thank_you.html');
          });
      },
  }).render('#paypal');
  //This function displays payment buttons on your web page.
  