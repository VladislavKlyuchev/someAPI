var moment = require('momentjs');

function invoice(db) {
    db.payment.findAll({
        limit: 1,
        order: [['createdAt']]
    })
    .then(last => {
        if(last[0]) {
            if(moment(last[0].createdAt).format('YYYY-MM-DD').isSame(moment(new Date).format('YYYY-MM-DD')) ) {
                console.error('double statistics invoice')
                return 
            }
        }
        db.operators.findAll()
        .then(operators => {
            operators.forEach(op => {
                
            })
        })

    })
    .catch(err => {

    })
}