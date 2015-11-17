import Promise from 'bluebird'
import twilioFactory from 'twilio'

const twilio = twilioFactory(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
)

export default () => new Promise((res, rej) => {
  twilio.availablePhoneNumbers('US')
    .local
    .list({ mmsEnabled: true }, (err, results) => {
      if (err) return rej(err)

      twilio.incomingPhoneNumbers.create({
        phoneNumber: results.availablePhoneNumbers[0].phoneNumber,
        smsUrl: `https://${process.env.HOST}/twilio/sms`,
      }, (err, number) => {
        if (err) return rej(err)
        res(number.phoneNumber)
      })
    })
})
