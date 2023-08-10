import mongoose from 'mongoose';
import Account from '../models/account.model.js';
import AccountModel from '../models/account.model.js';
import bcrypt from 'bcrypt';



/*
    create an account 
    create a hashed password (salt and pepper),
    add a user to model,
    validate the user details to the model required fields,
    save the user to the database.
    return true when user account has been created
    return false when error has occured
*/
export const CreateAccount = async ({ email, username, password, firstname, lastname, age }) => {
    const saltRounds = 10;
    const pepper = process.env.PASSWORD_PEPPER_STRING_V1;
    const pepperVersion = 'PASSWORD_PEPPER_STRING_V1';

    // hash password
    let response = await bcrypt.hash(password + pepper, saltRounds)
        .then((data) => { return { ok: true, passwordHash: data } })
        .catch((err) => { return { ok: false, err: err } });

    // exit if error
    if (!response.ok) {
        console.log(response.err)
        return false
    };

    const user = new AccountModel({
        name: {
            firstname: firstname,
            lastname: lastname,
        },
        email: email,
        username: username,
        password: response.passwordHash,
        age: age,
        pepperVersion: pepperVersion
    });

    response = await user.validate()
        .then(() => { return { ok: true } })
        .catch(err => { return { ok: false, err: err } });

    if (!response.ok) {
        console.log(response.err)
        return false
    };

    response = await user.save()
        .then(() => { return { ok: true } })
        .catch(err => { return { ok: false, err: err } });

    if (!response.ok) {
        console.log(response.err)
        return false
    };

    return true;
}

export const GetAccount = async (username) => {
    const query = await Account.findOne({username : username}, 'username name').exec()
        .then((data) => { return {ok:true, user: data}})
        .catch((err) => { return {ok:false, err: err}});
    return query;
}

export const UpdateAccount = async (username, email, firstname, lastname) => {
    const user = await GetAccount() ;
}

export const VerifyAccount = async (username, password) => {
    let response = await AccountModel.findOne({ username: username }, 'password')
        .then(data => { return { ok: true, password: data.password } })
        .catch(err => { return { ok: false, err: err } });
    if (!response.ok) {
        return response;
    }
    const passwordhash = response.password;
    const pepper = process.env.PASSWORD_PEPPER_STRING_V1
    response = await bcrypt.compare(password + pepper, passwordhash)
    .then((data) => { return { ok: data } })
    .catch(err => { return { ok: false, err: err} });
    if (!response.ok) {
        return response;
    }
    console.log(response);
    return response;
}

export const DeleteAccount = async ( username) => {
    const response = await AccountModel.deleteOne({ username: username })
        .then(bool => { return { ok: bool } })
        .catch((err) => { return { ok: false, err: err } })
    return response;
}





export const CheckIfUsernameExists = async (username) => {
    const userExists = await AccountModel.findOne({ username: username }).exec();
    if (userExists == null) {
        return false
    } else {
        return true
    }
}

export const CheckIfEmailExists = async (email) => {
    const emailExists = await AccountModel.findOne({ email: email }).exec();
    if (emailExists == null) {
        return false
    } else {
        return true
    }
}