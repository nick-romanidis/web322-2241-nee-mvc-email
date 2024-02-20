const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    res.render("general/home", {
        title: "Home Page"
    });
});

router.get("/contact-us", (req, res) => {
    res.render("general/contact-us", {
        title: "Contact Us",
        validationMessages: {},
        values: {
            firstName: "",
            lastName: "",
            email: "",
            message: ""
        }
    });
})

router.post("/contact-us", (req, res) => {
    console.log(req.body);

    const { firstName, lastName, email, message } = req.body;

    let passedValidation = true;
    let validationMessages = {};

    if (typeof firstName !== "string") {
        passedValidation = false;
        validationMessages.firstName = "You must specify a first name.";
    }
    else if (firstName.trim().length === 0) {
        passedValidation = false;
        validationMessages.firstName = "The first name is required.";
    }
    else if (firstName.trim().length < 2) {
        passedValidation = false;
        validationMessages.firstName = "The first name must be at least two letters.";
    }

    if (passedValidation) {
        const sgMail = require("@sendgrid/mail");
        sgMail.setApiKey(process.env.SEND_GRID_API_KEY);

        const msg = {
            to: "nickroma.seneca@gmail.com",
            from: "nick.romanidis@senecapolytechnic.ca",
            subject: "Contact Us Form Submission",
            html:
                `Visitor's Full Name: ${firstName} ${lastName}<br>
                Visitor's Email Address: ${email}<br>
                Visitor's message: ${message}<br>
                `
        };

        sgMail.send(msg)
            .then(() => {
                res.send("Success, validation passed");
            })
            .catch(err => {
                console.log(err);

                res.render("general/contact-us", {
                    title: "Contact Us",
                    values: req.body,
                    validationMessages
                });
            });
    }
    else {
        res.render("general/contact-us", {
            title: "Contact Us",
            values: req.body,
            validationMessages
        });
    }
})

module.exports = router;