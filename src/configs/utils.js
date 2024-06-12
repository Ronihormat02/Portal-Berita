//utils.js
async function runQuery(sql, args) {
    return new Promise((resolve, reject) => {
        db.query(sql, args, (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });
}
function validateEmail(email) {
    const re = /\S+@\S+\.\S+/;
    return re.test(String(email).toLowerCase());
}

module.exports = {
    runQuery,
    validateEmail

};
