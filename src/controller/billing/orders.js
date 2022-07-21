const asyncHandler = require("express-async-handler");
const Razorpay = require("razorpay");
const {userPackage} = require("../../utils/packages");
const shortid = require("shortid")

Date.prototype.monthDays= function(){
    var d= new Date(this.getFullYear(), this.getMonth()+1, 0);
    return d.getDate();
}

const createOrder = asyncHandler(async (req, res) => {


    try {


         // Get the user current subscription
         const currentSub = await userPackage(req.user.id);
         const packageStatus = currentSub.status;
         let newPackagePrice = 1000;

         if ( packageStatus ) {

            const lastPrice  =  500;
           
            // Upgrade the plan
            if ( newPackagePrice > lastPrice ) {

                const subStartDate = currentSub.dateStarted.getDate();
                const currentDate = new Date().getDate();
                const daysInAMonth =  new Date().monthDays();
                const numberOfDaysLeft = ( daysInAMonth - currentDate ) + subStartDate;

                const reminderBalance = ( lastPrice / 28 ) * numberOfDaysLeft;
                newPackagePrice = Math.round(newPackagePrice - reminderBalance);
                
            
            }
        
            // Downgrade the plan
            if ( lastPrice >= newPackagePrice ) {
                res.status(200).setCode(877).setPayload({
                    swtichType: "downgrade"
                }).respond();
            }

         }

         const razorpay = new Razorpay({
            key_id: process.env.razorpay_key,
            key_secret: process.env.razorpay_secret,
          });

         // Compose the options 
         const options = {
            amount: newPackagePrice,
            currency: currentSub.package.currency,
            receipt: shortid.generate(),
          };

        const response = await razorpay.orders.create(options);

        res.status(200).setCode(674).setPayload({
          id: response.id,
          currency: response.currency,
          amount: response.amount,
        }).respond()

      } catch (err) {
        res.setCode(764).status(500)
        console.log(err)
        throw new Error(err)
      }

})


module.exports = {
    createOrder
}
