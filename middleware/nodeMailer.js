import nodemailer from "nodemailer";
import "dotenv/config";

//Admin Email Address
const userEmail = process.env.ADMIN_EMAIL;

//Admin Email Key
const userPassKey = process.env.ADMIN_PASSKEY;

//Nodemailer transporter Function
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: userEmail,
    pass: userPassKey,
  },
});

//To generate OTP for verification
export function generateOTP() {
  let OTP = "";
  for (let i = 0; i < 4; i++) {
    OTP += Math.floor(Math.random() * 9);
  }
  return OTP;
}

//To send Email to the users for the Authentication
export const sendMail = async (mail, otp) => {
  const htmlTemplate = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>OTP Verification</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          font-family: 'Arial', sans-serif;
        }
        body {
          background-color: #f4f4f4;
          padding: 20px;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          background-color: #ffffff;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        .header {
          background-color: #e0f2f1;
          padding: 20px;
          text-align: center;
        }
        .header img {
          max-width: 150px;
          height: auto;
        }
        .content {
          padding: 30px;
          text-align: center;
        }
        .content h1 {
          font-size: 24px;
          color: #333;
          margin-bottom: 20px;
        }
        .content p {
          font-size: 16px;
          color: #666;
          line-height: 1.5;
          margin-bottom: 20px;
        }
        .otp-box {
          background-color: #f9f9f9;
          border: 2px dashed #0d9488;
          border-radius: 8px;
          padding: 15px;
          font-size: 28px;
          font-weight: bold;
          color: #0d9488;
          letter-spacing: 5px;
          margin: 20px 0;
          display: inline-block;
        }
        .content .note {
          font-size: 14px;
          color: #999;
          margin-top: 20px;
        }
        .footer {
          background-color: #f4f4f4;
          padding: 20px;
          text-align: center;
          font-size: 14px;
          color: #666;
        }
        .footer a {
          color: #0d9488;
          text-decoration: none;
        }
        @media (max-width: 600px) {
          .container {
            max-width: 100%;
          }
          .header img {
            max-width: 120px;
          }
          .content h1 {
            font-size: 20px;
          }
          .content p {
            font-size: 14px;
          }
          .otp-box {
            font-size: 24px;
            letter-spacing: 3px;
            padding: 12px;
          }
          .footer {
            font-size: 12px;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <img src="https://res.cloudinary.com/dozcrwtud/image/upload/v1745488770/mqparkqakhg9nwtg2nfm.png" alt="Evara ecommerce hub">
        </div>
        <div class="content">
          <h1>Verify Your Account</h1>
          <p>Thank you for choosing us! Please use the following One-Time Password (OTP) to verify your account. This OTP is valid for the next 10 minutes.</p>
          <div class="otp-box">${otp}</div>
          <p class="note">If you didn’t request this OTP, please ignore this email or contact our support team.</p>
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} Evara. All rights reserved.</p>
          <p><a href="https://evara.com/support">Contact Support</a>Visit Evara</a></p>
        </div>
      </div>
    </body>
    </html>
  `;
  const info = await transporter.sendMail({
    from: `${userEmail}`,
    to: mail,
    subject: "Your OTP for Account Verification",
    html: htmlTemplate,
  });
  const mailMessage = "Message sent succesfully";
  return mailMessage;
};
// send mail on return request has been rejected
export const RejectMail = async (returnRequestDetails) => {
  const htmlTemplateforreturnrejection = `
 <!DOCTYPE html>
 <html lang="en">
 <head>
   <meta charset="UTF-8">
   <meta name="viewport" content="width=device-width, initial-scale=1.0">
   <title>Order Rejection Notification</title>
   <style>
     * {
       margin: 0;
       padding: 0;
       box-sizing: border-box;
       font-family: 'Arial', sans-serif;
     }
     body {
       background-color: #f4f4f4;
       padding: 20px;
     }
     .container {
       max-width: 600px;
       margin: 0 auto;
       background-color: #ffffff;
       border-radius: 8px;
       overflow: hidden;
       box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
     }
     .header {
       background-color: #e0f2f1;
       padding: 20px;
       text-align: center;
     }
     .header img {
       max-width: 150px;
       height: auto;
     }
     .content {
       padding: 30px;
       text-align: center;
     }
     .content h1 {
       font-size: 24px;
       color: #333;
       margin-bottom: 20px;
     }
     .content p {
       font-size: 16px;
       color: #666;
       line-height: 1.5;
       margin-bottom: 20px;
     }
     .order-info {
       background-color: #f9f9f9;
       border: 2px solid #0d9488;
       border-radius: 8px;
       padding: 15px;
       margin: 20px 0;
       text-align: left;
     }
     .order-info p {
       font-size: 16px;
       color: #333;
       margin: 5px 0;
     }
     .order-info .highlight {
       font-weight: bold;
       color: #0d9488;
     }
     .content .note {
       font-size: 14px;
       color: #999;
       margin-top: 20px;
     }
     .footer {
       background-color: #f4f4f4;
       padding: 20px;
       text-align: center;
       font-size: 14px;
       color: #666;
     }
     .footer a {
       color: #0d9488;
       text-decoration: none;
     }
     @media (max-width: 600px) {
       .container {
         max-width: 100%;
       }
       .header img {
         max-width: 120px;
       }
       .content h1 {
         font-size: 20px;
       }
       .content p {
         font-size: 14px;
       }
       .order-info {
         padding: 12px;
       }
       .order-info p {
         font-size: 14px;
       }
       .footer {
         font-size: 12px;
       }
     }
   </style>
 </head>
 <body>
   <div class="container">
    <div class="header">
          <img src="https://res.cloudinary.com/dozcrwtud/image/upload/v1745488770/mqparkqakhg9nwtg2nfm.png" alt="Evara ecommerce hub">
        </div>
     <div class="content">
       <h1>Order Rejection Notification</h1>
       <p>We regret to inform you that your order has been rejected by the vendor. We understand this may be disappointing, and we’re here to assist you further.</p>
       <div class="order-info">
         <p><span class="highlight"><b>Product Name : ${
           returnRequestDetails[0].products_name
         }</b></p>
         <p><span class="highlight">Reason for Rejection:</span>Return request has been rejected from vendor side</p>
       </div>
       <p>Please feel free to contact our support team if you have any questions or need assistance with placing a new order.</p>
       <p class="note">This is an automated email. Please do not reply directly to this message.</p>
     </div>
     <div class="footer">
       <p>© ${new Date().getFullYear()} Your Brand Name. All rights reserved.</p>
       <p><a href="https://yourwebsite.com/support">Contact Support</a> | <a href="https://yourwebsite.com">Visit Our Website</a></p>
     </div>
   </div>
 </body>
 </html>
`;
  const info = await transporter.sendMail({
    from: `${userEmail}`,
    to: returnRequestDetails[0].email,
    subject: "Return request is Rejected",
    html: htmlTemplateforreturnrejection,
  });
  const mailMessage = "Message sent succesfully";
  return mailMessage;
};
// send mail on vendor verification
export const VendorVerificationMail = async (user, mail) => {
  const VendorVerification = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Vendor Verification Confirmation</title>
    <style>
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        font-family: 'Arial', sans-serif;
      }
      body {
        background-color: #f4f4f4;
        padding: 20px;
      }
      .container {
        max-width: 600px;
        margin: 0 auto;
        background-color: #ffffff;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      }
      .header {
        background-color: #e0f2f1;
        padding: 20px;
        text-align: center;
      }
      .header img {
        max-width: 150px;
        height: auto;
      }
      .content {
        padding: 30px;
        text-align: center;
      }
      .content h1 {
        font-size: 24px;
        color: #333;
        margin-bottom: 20px;
      }
      .content p {
        font-size: 16px;
        color: #666;
        line-height: 1.5;
        margin-bottom: 20px;
      }
      .info-box {
        background-color: #f9f9f9;
        border: 2px solid #0d9488;
        border-radius: 8px;
        padding: 15px;
        margin: 20px 0;
        text-align: left;
      }
      .info-box p {
        font-size: 16px;
        color: #333;
        margin: 5px 0;
      }
      .info-box .highlight {
        font-weight: bold;
        color: #0d9488;
      }
      .content .cta-button {
        display: inline-block;
        background-color: #0d9488;
        color: #ffffff;
        padding: 12px 24px;
        border-radius: 5px;
        text-decoration: none;
        font-size: 16px;
        margin: 20px 0;
        transition: background-color 0.3s;
      }
      .content .cta-button:hover {
        background-color: #0b7a6f;
      }
      .content .note {
        font-size: 14px;
        color: #999;
        margin-top: 20px;
      }
      .footer {
        background-color: #f4f4f4;
        padding: 20px;
        text-align: center;
        font-size: 14px;
        color: #666;
      }
      .footer a {
        color: #0d9488;
        text-decoration: none;
      }
      @media (max-width: 600px) {
        .container {
          max-width: 100%;
        }
        .header img {
          max-width: 120px;
        }
        .content h1 {
          font-size: 20px;
        }
        .content p {
          font-size: 14px;
        }
        .info-box {
          padding: 12px;
        }
        .info-box p {
          font-size: 14px;
        }
        .content .cta-button {
          padding: 10px 20px;
          font-size: 14px;
        }
        .footer {
          font-size: 12px;
        }
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <img src="https://res.cloudinary.com/dozcrwtud/image/upload/v1745488770/mqparkqakhg9nwtg2nfm.png" alt="Evara ecommerce hub">
      </div>
      <div class="content">
        <h1>Welcome Aboard, ${user}!</h1>
        <p>Congratulations! Your vendor account has been successfully verified. You can now access the Vendor Panel to manage your products, orders, and more.</p>
        <div class="info-box">
          <p><span class="highlight">Vendor Name:</span> ${user}</p>
          <p><span class="highlight">Status:</span> Verified</p>
        </div>
        <p>Start exploring the Vendor Panel to set up your store and reach our customers.</p>
        <a href="https://Evara.com/vendor-panel" class="cta-button">Access Vendor Panel</a>
        <p class="note">If you have any questions, please contact our support team.</p>
      </div>
      <div class="footer">
        <p>© ${new Date().getFullYear()} Evara Ecommerce Hub. All rights reserved.</p>
        <p><a href="https://Evara.com/support">Contact Support</a> | <a href="https://Evara.com">Visit Our Website</a></p>
      </div>
    </div>
  </body>
  </html>
`;
  const info = await transporter.sendMail({
    from: `${userEmail}`,
    to: mail,
    subject: "Your Vendor Account is Now Verified!",
    html: VendorVerification,
  });
  const mailMessage = "Message sent succesfully";
  return mailMessage;
};

export const VendorRejectionMail = async (user, mail, reason) => {
  const VendorRejection = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Vendor Verification Rejection</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          font-family: 'Arial', sans-serif;
        }
        body {
          background-color: #f4f4f4;
          padding: 20px;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          background-color: #ffffff;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        .header {
          background-color: #e0f2f1;
          padding: 20px;
          text-align: center;
        }
        .header img {
          max-width: 150px;
          height: auto;
        }
        .content {
          padding: 30px;
          text-align: center;
        }
        .content h1 {
          font-size: 24px;
          color: #333;
          margin-bottom: 20px;
        }
        .content p {
          font-size: 16px;
          color: #666;
          line-height: 1.5;
          margin-bottom: 20px;
        }
        .info-box {
          background-color: #f9f9f9;
          border: 2px solid #0d9488;
          border-radius: 8px;
          padding: 15px;
          margin: 20px 0;
          text-align: left;
        }
        .info-box p {
          font-size: 16px;
          color: #333;
          margin: 5px 0;
        }
        .info-box .highlight {
          font-weight: bold;
          color: #0d9488;
        }
        .content .cta-button {
          display: inline-block;
          background-color: #0d9488;
          color: #ffffff;
          padding: 12px 24px;
          border-radius: 5px;
          text-decoration: none;
          font-size: 16px;
          margin: 20px 0;
          transition: background-color 0.3s;
        }
        .content .cta-button:hover {
          background-color: #0b7a6f;
        }
        .content .note {
          font-size: 14px;
          color: #999;
          margin-top: 20px;
        }
        .footer {
          background-color: #f4f4f4;
          padding: 20px;
          text-align: center;
          font-size: 14px;
          color: #666;
        }
        .footer a {
          color: #0d9488;
          text-decoration: none;
        }
        @media (max-width: 600px) {
          .container {
            max-width: 100%;
          }
          .header img {
            max-width: 120px;
          }
          .content h1 {
            font-size: 20px;
          }
          .content p {
            font-size: 14px;
          }
          .info-box {
            padding: 12px;
          }
          .info-box p {
            font-size: 14px;
          }
          .content .cta-button {
            padding: 10px 20px;
            font-size: 14px;
          }
          .footer {
            font-size: 12px;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <img src="https://res.cloudinary.com/dozcrwtud/image/upload/v1745488770/mqparkqakhg9nwtg2nfm.png" alt="Evara ecommerce hub">
        </div>
        <div class="content">
          <h1>Vendor Verification Update, ${user}</h1>
          <p>We regret to inform you that your vendor account verification has been rejected. Please review the details below and contact our support team for further assistance.</p>
          <div class="info-box">
            <p><span class="highlight">Vendor Name:</span> ${user}</p>
            <p><span class="highlight">Status:</span> Rejected</p>
            <p><span class="highlight">Reason for Rejection:</span> ${reason}</p>
          </div>
          <p>If you believe this decision was made in error or need help resolving the issue, please reach out to our support team.</p>
          <a href="https://Evara.com/support" class="cta-button">Contact Support</a>
          <p class="note">This is an automated email. Please do not reply directly to this message.</p>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} Evara Ecommerce Hub. All rights reserved.</p>
          <p><a href="https://Evara.com/support">Contact Support</a> | <a href="https://Evara.com">Visit Our Website</a></p>
        </div>
      </div>
    </body>
    </html>
  `;
  const info = await transporter.sendMail({
    from: `${userEmail}`,
    to: mail,
    subject: "Vendor Account Verification Rejected",
    html: VendorRejection,
  });
  const mailMessage = "Message sent succesfully";
  return mailMessage;
};
export const orderplacedmail = async (Email, productName, totalAmount) => {
  const Orderplacedsuccessfully = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Order Confirmation</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          font-family: 'Arial', sans-serif;
        }
        body {
          background-color: #f4f4f4;
          padding: 20px;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          background-color: #ffffff;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        .header {
          background-color: #e0f2f1;
          padding: 20px;
          text-align: center;
        }
        .header img {
          max-width: 150px;
          height: auto;
        }
        .content {
          padding: 30px;
          text-align: center;
        }
        .content h1 {
          font-size: 24px;
          color: #333;
          margin-bottom: 20px;
        }
        .content p {
          font-size: 16px;
          color: #666;
          line-height: 1.5;
          margin-bottom: 20px;
        }
        .info-box {
          background-color: #f9f9f9;
          border: 2px solid #0d9488;
          border-radius: 8px;
          padding: 15px;
          margin: 20px 0;
          text-align: left;
        }
        .info-box p {
          font-size: 16px;
          color: #333;
          margin: 5px 0;
        }
        .info-box .highlight {
          font-weight: bold;
          color: #0d9488;
        }
        .content .cta-button {
          display: inline-block;
          background-color: #0d9488;
          color: #ffffff;
          padding: 12px 24px;
          border-radius: 5px;
          text-decoration: none;
          font-size: 16px;
          margin: 20px 0;
          transition: background-color 0.3s;
        }
        .content .cta-button:hover {
          background-color: #0b7a6f;
        }
        .content .note {
          font-size: 14px;
          color: #999;
          margin-top: 20px;
        }
        .footer {
          background-color: #f4f4f4;
          padding: 20px;
          text-align: center;
          font-size: 14px;
          color: #666;
        }
        .footer a {
          color: #0d9488;
          text-decoration: none;
        }
        @media (max-width: 600px) {
          .container {
            max-width: 100%;
          }
          .header img {
            max-width: 120px;
          }
          .content h1 {
            font-size: 20px;
          }
          .content p {
            font-size: 14px;
          }
          .info-box {
            padding: 12px;
          }
          .info-box p {
            font-size: 14px;
          }
          .content .cta-button {
            padding: 10px 20px;
            font-size: 14px;
          }
          .footer {
            font-size: 12px;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <img src="https://res.cloudinary.com/dozcrwtud/image/upload/v1745488770/mqparkqakhg9nwtg2nfm.png" alt="Evara ecommerce hub">
        </div>
        <div class="content">
          <h1>Order Placed Successfully!</h1>
          <p>Thank you for shopping with us! Your order has been successfully placed, and it will be delivered to you within 3 days.</p>
          <div class="info-box">
            <p><span class="highlight">Product Name:</span> ${productName}</p>
            <p><span class="highlight">Total Amount:</span> ₹${totalAmount}</p>
          </div>
          <p>Track your order or manage your account through our website. If you have any questions, feel free to contact our support team.</p>
          <a href="http://192.168.22.132:3000/" class="cta-button">View Orders</a>
          <p class="note">This is an automated email. Please do not reply directly to this message.</p>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} Evara Ecommerce Hub. All rights reserved.</p>
          <p><a href="http://192.168.22.132:3000/">Contact Support</a> | <a href="http://192.168.22.132:3000/">Visit Our Website</a></p>
        </div>
      </div>
    </body>
    </html>
  `;
  const info = await transporter.sendMail({
    from: `${userEmail}`,
    to: Email,
    subject: "Your Order Has Been Placed Successfully!",
    html: Orderplacedsuccessfully,
  });
  const mailMessage = "Message sent succesfully";
  return mailMessage;
};

export const orderrejetctmail = async (mail) => {
  const orderreject = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Order Rejection Notification</title>
    <style>
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        font-family: 'Arial', sans-serif;
      }
      body {
        background-color: #f4f4f4;
        padding: 20px;
      }
      .container {
        max-width: 600px;
        margin: 0 auto;
        background-color: #ffffff;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      }
      .header {
        background-color: #e0f2f1;
        padding: 20px;
        text-align: center;
      }
      .header img {
        max-width: 150px;
        height: auto;
      }
      .content {
        padding: 30px;
        text-align: center;
      }
      .content h1 {
        font-size: 24px;
        color: #333;
        margin-bottom: 20px;
      }
      .content p {
        font-size: 16px;
        color: #666;
        line-height: 1.5;
        margin-bottom: 20px;
      }
      .info-box {
        background-color: #f9f9f9;
        border: 2px solid #0d9488;
        border-radius: 8px;
        padding: 15px;
        margin: 20px 0;
        text-align: left;
      }
      .info-box p {
        font-size: 16px;
        color: #333;
        margin: 5px 0;
      }
      .info-box .highlight {
        font-weight: bold;
        color: #0d9488;
      }
      .content .cta-button {
        display: inline-block;
        background-color: #0d9488;
        color: #ffffff;
        padding: 12px 24px;
        border-radius: 5px;
        text-decoration: none;
        font-size: 16px;
        margin: 20px 0;
        transition: background-color 0.3s;
      }
      .content .cta-button:hover {
        background-color: #0b7a6f;
      }
      .content .note {
        font-size: 14px;
        color: #999;
        margin-top: 20px;
      }
      .footer {
        background-color: #f4f4f4;
        padding: 20px;
        text-align: center;
        font-size: 14px;
        color: #666;
      }
      .footer a {
        color: #0d9488;
        text-decoration: none;
      }
      @media (max-width: 600px) {
        .container {
          max-width: 100%;
        }
        .header img {
          max-width: 120px;
        }
        .content h1 {
          font-size: 20px;
        }
        .content p {
          font-size: 14px;
        }
        .info-box {
          padding: 12px;
        }
        .info-box p {
          font-size: 14px;
        }
        .content .cta-button {
          padding: 10px 20px;
          font-size: 14px;
        }
        .footer {
          font-size: 12px;
        }
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <img src="https://res.cloudinary.com/dozcrwtud/image/upload/v1745488770/mqparkqakhg9nwtg2nfm.png" alt="Evara ecommerce hub">
      </div>
      <div class="content">
        <h1>Order Rejection Notification</h1>
        <p>We’re sorry to inform you that your order has been rejected by the vendor. We understand this may be disappointing, and we’re here to assist you further.</p>
        <div class="info-box">
          <p><span class="highlight">Reason for Rejection:</span> reject by vendor</p>
        </div>
        <p>Please explore other products on our platform or contact our support team for assistance with your next order.</p>
        <a href="https://Evara.com/shop" class="cta-button">Shop Now</a>
        <p class="note">This is an automated email. Please do not reply directly to this message.</p>
      </div>
      <div class="footer">
        <p>© ${new Date().getFullYear()} Evara Ecommerce Hub. All rights reserved.</p>
        <p><a href="https://Evara.com/support">Contact Support</a> | <a href="https://Evara.com">Visit Our Website</a></p>
      </div>
    </div>
  </body>
  </html>
`;
  const info = await transporter.sendMail({
    from: `${userEmail}`,
    to: mail,
    subject: "Your Order Has Been Rejected!",
    html: orderreject,
  });
  const mailMessage = "Message sent succesfully";
  return mailMessage;
};

export const AcceptMail = async (returnRequestDetails) => {
  const info = await transporter.sendMail({
    from: `${userEmail}`,
    to: returnRequestDetails[0].email,
    subject: "Return request is Accepted",

    html: `<h1>Your return request is Accepted on the product</h1><b>Product Name : ${returnRequestDetails[0].products_name}</b>`,
  });
  const mailMessage = "Message sent succesfully";
  return mailMessage;
};
