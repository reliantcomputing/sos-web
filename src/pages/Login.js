import React, {useState} from "react";
import {InputText} from "primereact/inputtext";
import classNames from "classnames";
import {Button} from "react-bootstrap";
import Constants from "../helpers/constants";
import {useDispatch} from "react-redux";
import {LOAD_ORDERS, SET_USER} from "../redux-helpers/Types";
import {joinChannels} from "../redux-helpers/actions/ChannelAction";

const axios = require('axios')

export const Login = () => {

    const [email, setEmail] = useState('tumi@gmail.com')
    const [password, setPassword] = useState('Tumisho101101')
    const dispatch = useDispatch()
    return (
        <div className='container align-items-center justify-content-center'>
            <div className='row'>
                <div className='col-md-6'>
                    <div className="p-field">
                        <label htmlFor="street_name">Email</label>
                        <InputText className='form-control' id="street_name" value={email} onChange={(e) => {
                            const val = e.target.value
                            setEmail(val)
                        }}/>
                    </div>
                </div>
            </div>
            <div className='row'>
                <div className='col-md-6'>
                    <div className="p-field">
                        <label htmlFor="street_name">Password</label>
                        <InputText className='form-control' id="street_name" value={password} onChange={(e) => {
                            const val = e.target.value
                            setPassword(val)
                        }}/>
                    </div>
                </div>
            </div>
            <div className='row'>
                <div className='col-md-6'>
                    <div className="p-field">
                        <Button className='btn btn-success btn-block' onClick={() => {
                            const user = {email, password}
                            axios.post(`${Constants.BASE_URL}api/auth/login`, user).then(res => {
                                console.log(res.data.orders)
                                dispatch({
                                    type: SET_USER,
                                    payload: res.data.user
                                })
                                dispatch({
                                    type: LOAD_ORDERS,
                                    payload: res.data.orders
                                })
                                dispatch(joinChannels(res.data.chats, res.data.orders, res.data.user))
                            })
                        }}>
                            Login
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
