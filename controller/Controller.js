const { db, FieldValue } = require('../db/firestore');
const { hashPassword, checkPassword } = require('../middleware/bcrypt');
const { signToken } = require('../middleware/jwt');

class Controller {
    static async register(req, res, next) {
        try {
            const { email, password } = req.body
            if (!email) throw { name: "emailRequired" }
            if (!password) throw { name: "passwordRequired" }

            const User = db.collection('Users');

            const foundEmail = await User.where('email', '==', email).get();

            if (!foundEmail.empty) throw { name: "uniqueEmail" }

            const passwordHashed = hashPassword(password)
            // console.log(foundEmail.empty)

            const addUser = await User.add({
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

            const User = db.collection('Users');

            const foundUser = await User.where('email', '==', email).get();

            // console.log(foundUser.empty)
            if (foundUser.empty) throw { name: "unAuthenticated" }

            const userData = foundUser.docs[0].data()
            // console.log(foundUser.docs[0].data())//GET ONE DATA
            let dbPasswordUser = userData.password
            // console.log(userData)
            const validPass = checkPassword(password, dbPasswordUser)
            // console.log(validPass)
            if (!validPass) throw { name: "unAuthenticated" }

            delete userData.password;

            userData.id = foundUser.docs[0].id //GET ID
            // console.log(foundUser.docs[0].id) // GET ID 
            // foundUser.forEach(doc => {
            //     userData = doc.data();
            // });

            // console.log(user)
            const access_token = signToken(userData)

            // console.log(access_token)

            res.status(200).json({ access_token })
        } catch (error) {
            next(error)
        }
    }
}

module.exports = Controller