import { createRequire } from 'module';
const require = createRequire(import.meta.url);
/*
    Upstash exports a named export (serve). Without {}, serve is actually an object, not the function. That’s why when you try to call it, you get “not a function”.
    Hence we will use the {} to destructure the named export serve from the module.
*/
const { serve } = require("@upstash/workflow/express");
import Subscription from "../models/subscription.model.js";
import dayjs from "dayjs";
import { sendReminderEmail } from '../utils/send-email.js';

// NOTE: in order to trigger the workflow we will do it right after the subscription gets created
// in the file name '/controllers/subscription.controller.js' in the createSubscription() function

export const sendReminder = serve(async (context) => {
    // array of reminders for the number of days before which the reminder has to be sent
    const REMINDERS = [7, 5, 2, 1];

    const { subscriptionId } = context.requestPayload;
    // fetchSubscription is a custom function
    const subscription = await fetchSubscription(context, subscriptionId);
    // if the subscription does not exist or is expired then we will end the workflow here
    if (!subscription || (subscription.status).toLowerCase() === 'expired') return;

    // else we will continue
    // we will use a package called dayjs to handle date and time related operations
    const renewalDate = dayjs(subscription.renewalDate);
    //.format() is a dayjs function that formats the date in the specified format
    console.log(`Renewal date is: ${renewalDate.format('DD-MM-YYYY')}`); // logging the renewal date in DD-MM-YYYY format for debugging purposes

    // check if thr renewalDate if before the current date
    // if it is before then the subscription is expired as the renewal date has passed
    // calling dayjs() without any arguments will return the current date and time
    if (renewalDate.isBefore(dayjs())) {
        console.log(`Subscription with ID: ${subscriptionId} has expired. Stopping the current workflow`);
        return;
    }
    // if the subscription has not expired then we will calculate the number of days left for renewal
    // we will set the workflow to sleep using a custom function sleepUntilReminder()
    // we will trigger the workflow on the day when the reminder has to be sent using a custom function triggerReminder()
    for (const daysBefore of REMINDERS) {
        // the substract manipulation function of day.js returns a new dayjs object and does not mutate the original one
        // it substracts a certain unit of time from the current dayjs object and returns a new one
        // in our implemenetation we have substracted one daysBefore in the units of 'day' from the renewalDate
        const reminderDate = renewalDate.subtract(daysBefore, 'day');

        // checking the renewalDate if after the current date for each daysBefore in the REMINDERS array
        if (reminderDate.isAfter(dayjs())) {
            // then we will put the workflow to sleep until the reminderDate
            await sleepUntilReminder(context, `Reminder ${daysBefore} days before renewal`, reminderDate);
        }
        // otherwise we wil trigger the workflow
        await triggerReminder(context, `${daysBefore} days before reminder`, subscription);
    }
})

const fetchSubscription = async (context, subscriptionId) => {
    return await context.run('Set Subscription', async () => {
        // this is a mongoose function that will fetch the subscription by its ID and also populate the user field and select only name and email fields from the user document
        return await Subscription.findById(subscriptionId).populate('user', 'name email');
    });
}
// function for putting the workflow to sleep until the reminder date
const sleepUntilReminder = async (context, label, date) => {
    // logging the sleep time for debugging purposes
    console.log(`Sleeping until ${label} and reminder at ${date.format('DD-MM-YYYY')}`);
    // converting the dayjs object to a native JS Date object using .toDate() function
    // a dayjs object looks like a Date object but it is not a Date object
    // for example a dayjs object for the current date will look like this Dayjs { '$L': 'en', '$d': 2024-06-12T14:28:30.123Z, '$x': {}, '$y': 2024, '$M': 5, '$D': 12, '$W': 3, '$H': 14, '$m': 28, '$s': 30, '$ms': 123 }
    // and on converting that to a Date object it will look like this 2024-06-12T14:28:30.123Z
    // the actual date it represents is the same but the structure is different

    // the 'first parameter' is a label for the sleep period 
    // the 'second parameter' is the date until which the workflow has to sleep
    // you can also use units such as "1d" for one day, "2h" for two hours etc instead of a date
    await context.sleepUntil(label, date.toDate());
}
// function for triggering the reminder
const triggerReminder = async (context, label, subscription) => {
    return await context.run(label, async () => {
        console.log(`Triggering reminder: ${label}`);
        // Sending the email using the custom function created from the file '/utils/send-email.js'
        console.log(`Preparing to send email for the following info: to:${subscription.user.email}, type:${label}, subscription:${subscription}`)
        await sendReminderEmail({
            to: subscription.user.email,
            type: label,
            subscription
        })
    });
}