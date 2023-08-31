const { db, FieldValue } = require('../db/firestore');
const { hashPassword, checkPassword } = require('../helper/bcrypt');
const { isValidEmail, validMinLength } = require('../helper/helpers');
const { signToken } = require('../helper/jwt');
const PDFDocument = require('pdfkit');
const OpenAI = require('openai');

const openai = new OpenAI({
    apiKey: process.env.OPENAI_KEY, // defaults to process.env["OPENAI_API_KEY"]
});

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

            res.status(200).json({ access_token, email: userData.email })
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
                experience: {
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

    static async generatePdf(req, res, next) {
        try {
            const { userId } = req.params

            // console.log(userId)

            // const { id: idUser } = req.user

            // console.log(idUser, "idUser")

            const Resume = db.collection("Resumes")

            const foundResume = await Resume.where('userId', '==', userId).get();

            const data = foundResume.docs[0].data()

            // console.log(data)

            // const docResume = await Resume.get();

            // console.log(Resume.empty, "==========")
            // const foundResume = await Resume.where('resumeId', '==', idUser).get();
            // console.log(Resume.docs[0].data())
            // const data = docResume.data()

            const doc = new PDFDocument({ size: 'A4' });

            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', 'inline; filename="example.pdf"');

            doc.pipe(res);

            // doc.font('font/Poppins-Regular.ttf')

            // Name
            doc.fontSize(16).font('font/Poppins-Medium.ttf').text(`${data.identity.name}`,
                // 40, 100,
                {
                    align: 'justify'
                },
            ).moveDown(0);

            // Address
            doc.fontSize(9).font('font/Poppins-Regular.ttf').text(`${data.identity.address}`,
                // 40, 100,
                {
                    align: 'justify'
                },
            ).moveDown(0.2);

            // Description
            doc.fontSize(9).font('font/Poppins-Regular.ttf').text(`${data.identity.email}  |  ${data.identity.phoneNumber}`,
                // 40, 100,
                {
                    align: 'justify'
                },
            ).moveDown(0.2);

            // line separator
            doc.fontSize(9).text(`-------------------------------------------------------------------------------------------`,
                // 40, 100,
                {
                    align: 'justify'
                },
            ).moveDown(0.5);

            // Description
            doc.fontSize(10).font('font/Poppins-Regular.ttf').text(`${data.identity.description}`,
                // 40, 100,
                {
                    align: 'justify'
                },
            ).moveDown(0.8);

            // Education
            doc.fontSize(13).font('font/Poppins-Medium.ttf').text(`Education`,
                // 40, 100,
                {
                    underline: true,
                    align: 'justify'
                },
            ).moveDown(0.3);

            // Education Title
            doc.fontSize(11).font('font/Poppins-Regular.ttf').text(`${data.education.title}`,
                // 40, 100,
                {
                    underline: true,
                    align: 'justify',
                    continued: true
                },
            ).fontSize(7).font('font/Poppins-Regular.ttf').text(`   (${data.education.dateFrom} - ${data.education.dateFrom})`, {
                link: 'http://www.example.com',
                underline: false,
            }).moveDown(0.6);

            // Education Description
            doc.fontSize(10).font('font/Poppins-Regular.ttf').text(`${data.education.desc}`,
                // 40, 100,
                {
                    align: 'justify'
                },
            ).moveDown(0.3);

            // Education Accomplishment
            const splitEduAccomplishment = data.education.accomplishment.split('\n')
            // console.log(splitEduAccomplishment)
            splitEduAccomplishment.forEach(element => {
                doc.fontSize(9).font('font/Poppins-Regular.ttf').text(`• ${element}`,
                    // 40, 100,
                    {
                        align: 'justify'
                    },
                ).moveDown(0.2);
            })
            doc.moveDown(0.6);

            // Professional Experiences
            doc.fontSize(13).font('font/Poppins-Medium.ttf').text(`Professional Experiences`,
                // 40, 100,
                {
                    underline: true,
                    align: 'justify'
                },
            ).moveDown(0.3);

            // Professional Experiences Title
            doc.fontSize(11).font('font/Poppins-Regular.ttf').text(`${data.experience.title}`,
                // 40, 100,
                {
                    underline: true,
                    align: 'justify',
                    continued: true
                },
            ).fontSize(7).font('font/Poppins-Regular.ttf').text(`   (${data.experience.dateFrom} - ${data.experience.dateFrom})`, {
                link: 'http://www.example.com',
                underline: false,
            }).moveDown(0.6);

            // Professional Experiences Description
            doc.fontSize(10).font('font/Poppins-Regular.ttf').text(`${data.experience.desc}`,
                // 40, 100,
                {
                    align: 'justify'
                },
            ).moveDown(0.3);

            // Professional Experiences Accomplishment
            const splitAccomplishment = data.experience.accomplishment.split('\n')
            // console.log(splitAccomplishment, '<<<>>>')

            splitAccomplishment.forEach(element => {
                doc.fontSize(9).font('font/Poppins-Regular.ttf').text(`• ${element}`,
                    // 40, 100,
                    {
                        align: 'justify'
                    },
                ).moveDown(0.2);
            })
            doc.moveDown(0.6);

            // Skills
            doc.fontSize(11).font('font/Poppins-Medium.ttf').text(`Skills`,
                // 40, 100,
                {
                    underline: true,
                    align: 'justify'
                },
            ).moveDown(0.3);

            // Skills data
            // if (data.skills) {  }
            const splitSkill = data.skills.split('+')
            // console.log(splitSkill)
            splitSkill.forEach(element => {
                doc.fontSize(10).font('font/Poppins-Regular.ttf').text(`• ${element}`,
                    // 40, 100,
                    {
                        align: 'justify'
                    },
                ).moveDown(0.2);
            });
            doc.moveDown(0.4)


            // Finalize the PDF
            doc.end();
        } catch (error) {
            next(error)
        }
    }

    static async chatOpenAi(req, res, next) {
        try {
            const { query } = req.body

            // console.log(query, "==============")
            const completion = await openai.chat.completions.create({
                messages: [{ role: 'user', content: query }],
                model: 'gpt-3.5-turbo',
            });

            res.status(201).json(completion.choices[0])
            // console.log(completion.choices);
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