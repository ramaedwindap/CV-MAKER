const { db, FieldValue } = require('../db/firestore');
const { hashPassword } = require('../middleware/bcrypt');

class Controller {
    static async register(req, res, next) {
        try {
            const { email, password } = req.body
            if (!email) throw { name: "emailRequired" }
            if (!password) throw { name: "passwordRequired" }

            const user = db.collection('Users');

            const passwordHashed = hashPassword(password)

            const uniqueEmail = await user.where('email', '==', email).get();


            // console.log(uniqueEmail.empty)
            if (!uniqueEmail.empty) throw { name: "uniqueEmail" }

            const addUser = await user.add({
                email,
                password: passwordHashed,
                createdAt: FieldValue.serverTimestamp(),
                updatedAt: FieldValue.serverTimestamp()
            })

            res.status(200).json({ id: addUser.id, email })
        } catch (error) {
            next(error)
        }
    }
}

module.exports = Controller