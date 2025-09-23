import dayjs from "dayjs";
import { accountEmail, transporter } from "../config/nodemailer.js";
import { emailTemplates } from "./email-template.js";

// the function recieves an object so we are destructuring the parameters
// 'to' contains the email address of the recipient
// 'type' contains the type of reminder (7 days, 5 days, 2 days, 1 day)
// 'subscription' contains the subscription object for which the reminder is being sent
export const sendReminderEmail = async ({ to, type, subscription }) => {
    // first we will validate that all the parameters are present
    if (!to || !type || !subscription) {
        throw new Error("Missing required parameters to send the email");
    }
    // if all the parameter are present then we will find the required email template from the emailTemplates array
    // .find() is a javascript array method that returns the first element in the array that satisfies the provided testing function
    // for each template in the object 't' we are checking if the label matches the type
    const template = emailTemplates.find((t) => t.label === type);

    // if the template is not found then we will throw an error
    if (!template) {
        throw new Error(`No email template found for type: ${type}`);
    }

    // else we will form an object containing the full user info
    const mailInfo = {
        userName: subscription.user.name,
        subscriptionName: subscription.name,
        renewalDate: dayjs(subscription.renewalDate).format('DD-MM-YYYY'),
        // price will be rendred in the format ex: USD 10 (Monthly)
        price: `${subscription.currency} ${subscription.price} (${subscription.frequency})`,
        paymentMethod: subscription.paymentMethod,
        planName: subscription.name,
    }

    // forming the actual message
    // the template already had inbuilt function to generate the body and the subject
    // check '/utils/email-template.js' for the code
    const message = template.generateBody(mailInfo); // message generates the html that will contain the email body
    const subject = template.generateSubject(mailInfo)

    // final mailing options object
    const mailOptions = {
        from: accountEmail,
        to: to,
        subject: subject,
        html: message,
    }

    // before we start sending we will verify that nodemailer can connect to SMTP server
    await transporter.verify();
    console.log("Server is ready to take our message")

    // now we will send the mail
    transporter.sendMail(mailOptions, (err, info) => {
        // if error happens then
        if (err) {
            // we will use 'return' to break the response
            return console.log(`Error occured while attempting to send a email using Nodemailer: ${err}`)
        }
        // else we log the success
        console.log('Email sent:' + info.response);
    })
}

// we are gonna call the sendReminder email function from '/controllers/workflow.controller.js'