function errorHandler(err, req, res, next) {
    console.log(err, "ERRRRRRRRROOOOOR=======")
    const name = err.name

    switch (name) {
        case "emailRequired":
            return res.status(400).json({ message: "Email is required!" })
        case "passwordRequired":
            return res.status(400).json({ message: "Password is required!" })
        case "uniqueEmail":
            return res.status(400).json({ message: "Email should unique!" })
        case "unAuthenticated":
            return res.status(401).json({ message: "Invalid email or password!" })
        default:
            return res.status(500).json({ message: "Internal Server Error" })
    }
}

module.exports = errorHandler