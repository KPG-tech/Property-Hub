import React, { useState } from "react";
import "./Payment.css";

function Payment() {
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");

  // Card Number Validation (16-digit format XXXX XXXX XXXX XXXX)
  const validateCardNumber = (cardNumber) => {
    return /^\d{4} \d{4} \d{4} \d{4}$/.test(cardNumber);
  };

  // Expiry Date Validation (MM/YY, ensures it's a valid future date)
  const validateExpiry = (expiry) => {
    const [month, year] = expiry.split("/");
    const currentYear = new Date().getFullYear() % 100; // Last two digits of the current year
    const currentMonth = new Date().getMonth() + 1;

    if (!month || !year || month < 1 || month > 12 || year.length !== 2) return false;

    const expiryYear = parseInt(year, 10);
    const expiryMonth = parseInt(month, 10);

    return expiryYear > currentYear || (expiryYear === currentYear && expiryMonth >= currentMonth);
  };

  // CVV Validation (3-digit number)
  const validateCvv = (cvv) => {
    return /^\d{3}$/.test(cvv);
  };

  // Handle Payment Submission
  const handlePayment = async () => {
    if (!cardNumber || !expiry || !cvv || !amount) {
      setMessage("⚠️ Please fill in all fields.");
      return;
    }

    if (!validateCardNumber(cardNumber)) {
      setMessage("❌ Invalid card number. Enter 16 digits in XXXX XXXX XXXX XXXX format.");
      return;
    }

    if (!validateExpiry(expiry)) {
      setMessage("❌ Invalid expiry date. Use MM/YY format and ensure it's in the future.");
      return;
    }

    if (!validateCvv(cvv)) {
      setMessage("❌ CVV should be a 3-digit number.");
      return;
    }

    const paymentAmount = parseFloat(amount);

    try {
      const response = await fetch("http://localhost:3000/api/payment/pay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: "user123", // Replace with actual user ID
          cardNumber: cardNumber.replace(/\s/g, ""), // Send without spaces
          expiry,
          cvv,
          amount: paymentAmount,
          token: "tok_visa", // Replace with real token in production
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage("✅ Payment Successful!");
      } else {
        setMessage("❌ Payment Failed: " + data.error);
      }
    } catch (error) {
      setMessage("❌ Payment Error: " + error.message);
    }
  };

  // Card Number Input Formatting (XXXX XXXX XXXX XXXX)
  const handleCardNumberChange = (e) => {
    let value = e.target.value.replace(/\D/g, "").slice(0, 16); // Remove non-numeric and limit to 16 digits
    value = value.replace(/(\d{4})(?=\d)/g, "$1 "); // Format with spaces
    setCardNumber(value);
  };

  // Expiry Date Formatting (MM/YY)
  const handleExpiryChange = (e) => {
    let value = e.target.value.replace(/\D/g, "").slice(0, 4);
    if (value.length > 2) value = value.slice(0, 2) + "/" + value.slice(2);
    setExpiry(value);
  };

  // CVV Input Handling (Only 3 digits)
  const handleCvvChange = (e) => {
    setCvv(e.target.value.replace(/\D/g, "").slice(0, 3));
  };

  // Amount Input Handling (Only numbers and decimal points)
  const handleAmountChange = (e) => {
    let value = e.target.value.replace(/[^0-9.]/g, ""); // Allow only numbers and decimal points
    if ((value.match(/\./g) || []).length > 1) return; // Prevent multiple decimal points
    setAmount(value);
  };

  return (
    <div className="payment-container">
      <h1 className="payment-heading">Payment</h1>
      <div className="payment-form">
        <label htmlFor="cardNumber">Card Number</label>
        <input
          id="cardNumber"
          type="text"
          placeholder="1234 5678 9012 3456"
          value={cardNumber}
          onChange={handleCardNumberChange}
        />

        <div className="row">
          <div className="input-group">
            <label htmlFor="expiry">Expiry Date</label>
            <input
              id="expiry"
              type="text"
              placeholder="MM/YY"
              value={expiry}
              onChange={handleExpiryChange}
            />
          </div>
          <div className="input-group">
            <label htmlFor="cvv">CVV</label>
            <input
              id="cvv"
              type="password"
              placeholder="***"
              value={cvv}
              onChange={handleCvvChange}
            />
          </div>
        </div>

        <label htmlFor="amount">Amount</label>
        <input
          id="amount"
          type="text"
          placeholder="$100.00"
          value={amount}
          onChange={handleAmountChange}
        />

        <button onClick={handlePayment}>Pay Now</button>
        {message && <p className="message">{message}</p>}
      </div>
    </div>
  );
}

export default Payment;
