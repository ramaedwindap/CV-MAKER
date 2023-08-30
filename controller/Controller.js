const { db, FieldValue } = require('../db/firestore');
const { hashPassword, checkPassword } = require('../helper/bcrypt');
const { isValidEmail, validMinLength } = require('../helper/helpers');
const { signToken } = require('../helper/jwt');

class Controller {
    static async register(req, res, next) {
        try {
            const { email, password } = req.body
            if (!email) throw { name: "emailRequired" }
            if (!password) throw { name: "passwordRequired" }

            if (!isValidEmail(email)) throw { name: "invalidEmail" }

            // console.log(validMinLength(password, 5))
            if (validMinLength(password, 5)) throw { name: "passwordMin" }

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

    static async storeResume(req, res, next) {
        try {
            const { name,
                phoneNumber,
                email,
                address,
                description,
                educationTitle,
                educationDesc,
                educationDateFrom,
                educationDateTo,
                educationAccomplishment,
                skills,
                jobTitle,
                jobDesc,
                jobDateFrom,
                jobDateTo,
                jobAccomplishment,
            } = req.body

            const { id: idUser } = req.user

            // console.log(idUser, "idUser")

            const Resume = db.collection("Resumes")

            const foundResume = await Resume.where('userId', '==', idUser).get();

            const data = {
                identity: {
                    name,
                    phoneNumber,
                    email,
                    address,
                    description,
                },
                education: {
                    title: educationTitle,
                    desc: educationDesc,
                    dateFrom: educationDateFrom,
                    dateTo: educationDateTo,
                    accomplishment: educationAccomplishment
                },
                skills,
                experince: {
                    title: jobTitle,
                    desc: jobDesc,
                    dateFrom: jobDateFrom,
                    dateTo: jobDateTo,
                    accomplishment: jobAccomplishment,
                },
                userId: idUser,
            }
            // console.log(resumes.empty)
            if (foundResume.empty) {
                const addResume = await Resume.add(data)

                res.status(201).json({ message: `Success add resume with id ${addResume.id}` })
            } else {
                const resumeId = foundResume.docs[0].id

                await Resume.doc(resumeId).update(data)

                res.status(200).json({ message: `Success update resume id ${resumeId}` })
            }
        } catch (error) {
            next(error)
        }
    }

    static async getResume(req, res, next) {
        try {
            const { id: idUser } = req.user

            // console.log(idUser, "idUser")

            const Resume = db.collection("Resumes")

            const foundResume = await Resume.where('userId', '==', idUser).get();

            const data = foundResume.docs[0].data()

            res.status(200).json(data)
        } catch (error) {
            next(error)
        }
    }
}

module.exports = Controller