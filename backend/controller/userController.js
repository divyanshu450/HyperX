require("dotenv").config();
const userModel = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

async function createUser(req, res) { //register User
    try {
        console.log(req.body);
        const user = await userModel.count();
        console.log(user);
        if (await userModel.count() === 0) // create default user
        {
            const data = {
                name: "admin",
                userName: "admin",
                email: "divyanshu.kumar450@gmail.com",
                password: bcrypt.hashSync("admin") //"admin"
            }
            const adminData = new userModel(data);
            const userToken = jwt.sign(
                { user_id: adminData._id, email: adminData.email, userName: adminData.userName },
                process.env.TOKEN_KEY
            )
            adminData.token = userToken;
            await adminData.save();
            return res.send({ status: 201, message: "Admin user created", data: adminData, err: null })
        }
        else {
            if (req?.body?.password && req?.body?.email && req?.body?.userName) {
                const userName = req.body.userName;
                const isRegistered = await userModel.find({ userName });
                //  console.log("id :", isRegistered)
                if (isRegistered === null) {
                    const password = bcrypt.hashSync(req.body.password);
                    console.log(password);
                    //const data = { ...req.body, password: password };
                    const data = new userModel({ ...req.body, password: password });
                    const token = jwt.sign(
                        { user_id: data._id, email: data.email, userName: data.userName },
                        process.env.TOKEN_KEY
                    )
                    data.token = token;
                    await data.save();
                    return res.send({ status: 201, message: "user created", data: data, err: null })

                }
                else {
                    return res.send({ status: 403, message: "user exists, please Log in", data: null, err: null })
                }

            }
            else {
                return res.send({ status: 400, message: "All input is required created", data: data, err: null })
            }
        }
    } catch (error) {
        console.log(error);
        return res.send({ status: 500, message: "Internal server error", data: null, err: error })
    }
}

async function login(req, res) {
    try {
        const { userName, password, email } = req.body;
        const find = await userModel.find({ userName });
        console.log("find", find);
        if (!(userName && password)) {
            res.send({ status: 400, message: "All input is rwequired", data: null, err: null });
        }
        else if (find && (userName && password))//let them login
        {
            const passwordCheck = await bcrypt.compare(password, find[0].password)
            console.log(passwordCheck)
            const data = await userModel.findOne({ userName: userName })
            const token = jwt.sign(
                { user_id: data._id, email: email, userName: userName },
                process.env.TOKEN_KEY
            )
            data.token = token
            console.log(data);
            res.send({ status: 200, message: "Logged In", data: data, err: null });
        }
    } catch (error) {
        console.log(error);
        res.send({ status: 500, message: "Internal server error", data: null, err: error });

    }
    //console.log(req.body);
}

module.exports = { createUser, login };