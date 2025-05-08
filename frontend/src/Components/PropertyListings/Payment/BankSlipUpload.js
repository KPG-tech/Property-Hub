import React, { useState } from "react";
import "./payment.css";

function BankSlipUploadPage() {
  const [bankSlip, setBankSlip] = useState(null);
  const [bankHolder, setBankHolder] = useState("");
  const [bankName, setBankName] = useState("");
  const [bankBranch, setBankBranch] = useState("");
  const [paymentDate, setPaymentDate] = useState("");
  const [amount, setAmount] = useState("");  // New state for amount
  const [message, setMessage] = useState("");

  const handleBankSlipUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBankSlip(file);
      setMessage("✅ Bank slip uploaded successfully!");
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    // Validation for form fields
    if (!bankHolder || !bankName || !bankBranch || !paymentDate || !amount || !bankSlip) {
      setMessage("❌ Please fill in all fields and upload a bank slip.");
      return;
    }

    const formData = new FormData();
    formData.append("userId", "12345"); // Replace with actual userId
    formData.append("bankHolder", bankHolder);
    formData.append("bankName", bankName);
    formData.append("bankBranch", bankBranch);
    formData.append("paymentDate", paymentDate);
    formData.append("amount", amount);  // Append the amount field
    formData.append("bankSlip", bankSlip); // Append the uploaded bank slip

    try {
      const response = await fetch("http://localhost:8070/api/payment/upload-bank-slip", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (data.success) {
        setMessage("✅ Bank slip uploaded and details saved successfully!");
      } else {
        setMessage("❌ Error uploading bank slip. Please try again.");
      }
    } catch (error) {
      setMessage("❌ Error uploading data. Please try again.");
    }
  };

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="payment-container">
      <h1 className="payment-heading">Upload Bank Slip</h1>
      <form onSubmit={handleFormSubmit} className="payment-form">
        <div className="input-group">
          <label htmlFor="bankHolder">Bank Account Holder</label>
          <input
            id="bankHolder"
            type="text"
            value={bankHolder}
            onChange={(e) => setBankHolder(e.target.value)}
            placeholder="Enter bank account holder name"
          />
        </div>

        <div className="input-group">
          <label htmlFor="bankName">Bank Name</label>
          <input
            id="bankName"
            type="text"
            value={bankName}
            onChange={(e) => setBankName(e.target.value)}
            placeholder="Enter bank name"
          />
        </div>

        <div className="input-group">
          <label htmlFor="bankBranch">Bank Branch</label>
          <input
            id="bankBranch"
            type="text"
            value={bankBranch}
            onChange={(e) => setBankBranch(e.target.value)}
            placeholder="Enter bank branch"
          />
        </div>

        <div className="input-group">
          <label htmlFor="paymentDate">Payment Date</label>
          <input
            id="paymentDate"
            type="date"
            value={paymentDate}
            onChange={(e) => setPaymentDate(e.target.value)}
            max={today} // Disable future dates
          />
        </div>

        <div className="input-group">
          <label htmlFor="amount">Amount</label>  {/* New input field for amount */}
          <input
            id="amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter payment amount"
            min="0"
            step="0.01"
          />
        </div>

        <div className="input-group">
          <label htmlFor="bankSlip">Upload Bank Slip</label>
          <input
            id="bankSlip"
            type="file"
            accept="image/*,application/pdf"
            onChange={handleBankSlipUpload}
          />
          {bankSlip && <p>File Name: {bankSlip.name}</p>}
        </div>

        <button type="submit">Submit</button>
      </form>

      {message && <p className="message">{message}</p>}
    </div>
  );
}

export default BankSlipUploadPage;
