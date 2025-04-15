/**
 * visszaadja a már elkészített recepteket
 * @param objRepo 
 * @returns {function(*, *, *): *}
 */
module.exports = (objRepo) => {
    const ReceiptModel = objRepo.ReceiptModel;
    return (req, res, next) => {
        ReceiptModel.find({}).then((receipts) => {
            res.locals.receipts = receipts;
            return next();
        }).catch((err) => {
            console.error('Error fetching receipts:', err);
            return next(err);
        });
    }
};