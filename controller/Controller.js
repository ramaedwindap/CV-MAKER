const { db, FieldValue } = require('../db/firestore');
const { hashPassword, checkPassword } = require('../middleware/bcrypt');
const { signToken } = require('../middleware/jwt');

class Controller {
    static async register(req, res, next) {
        try {
            const { email, password } = req.body
            if (!email) throw { name: "emailRequired" }
            if (!password) throw { name: "passwordRequired" }

            const user = db.collection('Users');

            const foundEmail = await user.where('email', '==', email).get();

            if (!foundEmail.empty) throw { name: "uniqueEmail" }

            const passwordHashed = hashPassword(password)
            // console.log(foundEmail.empty)

            const addUser = await user.add({
                email,
                password: passwordHashed,
                createdAt: FieldValue.serverTimestamp(),
                updatedAt: FieldValue.serverTimestamp()
            })

            res.status(201).json({ id: addUser.id, email })
        } catch (error) {
            next(error)
        }
    }

    static async login(req, res, next) {
        try {
            const { email, password } = req.body
            if (!email) throw { name: "emailRequired" }
            if (!password) throw { name: "passwordRequired" }

            const users = db.collection('Users');

            const foundUser = await users.where('email', '==', email).get();

            // console.log(foundUser.empty)
            if (foundUser.empty) throw { name: "unAuthenticated" }

            const user = foundUser.docs[0].data()
            // console.log(foundUser.docs[0].data())//GET ONE DATA
            let dbPasswordUser = user.password
            // console.log(userData)
            const validPass = checkPassword(password, dbPasswordUser)
            // console.log(validPass)
            if (!validPass) throw { name: "unAuthenticated" }

            delete user.password;

            user.id = foundUser.docs[0].id //GET ID
            // console.log(foundUser.docs[0].id) // GET ID 
            // foundUser.forEach(doc => {
            //     userData = doc.data();
            // });

            // console.log(user)

            const access_token = signToken(user)

            // console.log(access_token)

            res.status(200).json({ access_token, email: user.email })
        } catch (error) {
            next(error)
        }
    }
}

module.exports = Controller