import React, { useContext, useEffect, useState } from 'react';
import { Button, Card, Col, Container, Form, Row } from 'react-bootstrap';
import { Redirect, useHistory, useLocation } from 'react-router-dom';
import { css } from "@emotion/core";
import FadeLoader from "react-spinners/FadeLoader";
import { UserContext } from '../../App';
import handleError from '../Input/ErrorHandler';
import InputItem from '../Input/InputItem';
import googleIcon from './googleIcon.svg';
import facebookIcon from '../auth/FB-logo.png';
import { createUserWithEmailAndPassword, handleFbSignIn, handleGoogleSignIn, initializeFirebase, signInWithEmailAndPassword } from './HandleLogin';



initializeFirebase()
const initUser = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: '',
  errors: {}
}

const Login = () => {
  const { user, setUser } = useContext(UserContext)
  const history = useHistory();
  const location = useLocation();
  let { from } = location.state || { from: { pathname: "/" } };
  const [loading, setLoading] = useState(false)
  const [newUser, setNewUser] = useState(true)
  const [userInfo, setUserInfo] = useState({ ...initUser });

  const onChangeHandler = e => {
    setUserInfo(previousState => ({ ...previousState, [e.target.name]: e.target.value }))
    e.persist()
  }

  const override = css`
  display: block;
  margin: 0 auto;
  display:flex;
  color:#000;
`;

  const submitHandler = e => {
    const errors = handleError(userInfo);
    setUserInfo({ ...userInfo, errors })
    if (Object.keys(errors).length === 0 && newUser) {
      setLoading(true)
      createUserWithEmailAndPassword({ firstName, lastName, email, password })
        .then(res => {
          setLoading(false)
          if (res.error) {
            setUserInfo({ ...userInfo, errors: res })
          } else {
            setUser({ ...res })
            history.replace(from)
          }
        })
    }
    if (!errors.email && !errors.password) {
      if (userInfo.password && userInfo.email && !newUser) {
        setLoading(true)
        signInWithEmailAndPassword({ email, password })
          .then(res => {
            setLoading(false)
            if (res.error) {
              setUserInfo({ ...userInfo, errors: res })
            } else {
              setUser({ ...res })
              history.replace(from)
            }
          })
      }
    }
    e.preventDefault();
  }
  const facebookSignIn = () =>{
    handleFbSignIn()
    .then(function(result) {
      // This gives you a Facebook Access Token. You can use it to access the Facebook API.
      var token = result.credential.accessToken;
      // The signed-in user info.
      var user = result.user;
      console.log('facebook user', user);
    }).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // The email of the user's account used.
      var email = error.email;
      // The firebase.auth.AuthCredential type that was used.
      var credential = error.credential;
      // ...
    });
    
  }
  const googleSignIn = () => {
    handleGoogleSignIn()
      .then(res => {
        if (res.error) {
          setUserInfo({ ...userInfo, errors: res })
        } else {
          setUser({ ...res })
          history.replace(from)
        }
      })
  }
  useEffect(() => {
    setUserInfo({ ...initUser })
  }, [newUser])

  useEffect(() => {
    console.log('form login');
  }, [])
  const { firstName, lastName, email, password, confirmPassword, errors } = userInfo;

  if (user) {
    return <Redirect to='/' />
  }
  if (loading) {
    return (
      <div className="sweet-loading">
        <FadeLoader
          css={override}
          size={150}
          loading={loading}
        />
      </div>
    );
  }
  return (
    <Container className="pr-0 pt-5">
      <Row>
        <Col sm={8} className="m-auto" xl={6} md="8">
          <Card>
            <Card.Body>
              <h2 className="py-1">{newUser ? 'Create an account' : 'Login'}</h2>
              <Form autoComplete="off" onSubmit={submitHandler}>
                {newUser && (
                  <InputItem value={firstName}
                    onChangeHandler={onChangeHandler}
                    error={errors.firstName}
                    name="firstName"
                    customClass="loginInput" autoFocus
                    placeholder="First Name" />
                )}
                {newUser && (
                  <InputItem value={lastName}
                    onChangeHandler={onChangeHandler}
                    error={errors.lastName}
                    name="lastName"
                    customClass="loginInput"
                    placeholder="Last Name" />
                )}
                <InputItem value={email}
                  onChangeHandler={onChangeHandler}
                  error={errors.email}
                  name="email"
                  customClass="loginInput"
                  type="email"
                  placeholder="Email" />
                <InputItem value={password}
                  onChangeHandler={onChangeHandler}
                  error={errors.password}
                  name="password"
                  type="password"
                  customClass="loginInput"
                  placeholder="Password" />
                {newUser && (
                  <InputItem value={confirmPassword}
                    onChangeHandler={onChangeHandler}
                    type="password"
                    error={errors.confirmPassword}
                    name="confirmPassword"
                    customClass="loginInput"
                    placeholder="Confirm Password" />
                )}
                {errors.error && (
                  <p className="text-danger text-center  py-2">
                    {errors.error}
                  </p>
                )}
                <Button className="w-100" variant="warning" type="submit">
                  {newUser ? 'Create an Account' : 'Login'}
                </Button>
              </Form>
              <p className="text-center pt-2">
                {newUser ? 'Already have an account' : 'Don’t have an account'} ?
                 <span onClick={() => setNewUser(!newUser)} className="text-warning login">
                  {newUser ? ' Login' : ' Create an account'}
                </span>
              </p>
            </Card.Body>
          </Card>
          <div className="orr mt-2 w-75">Or</div>
          <div className="google-sign-in mt-2 w-75" onClick={googleSignIn}>
            <span> Continue with google <img className="google" src={googleIcon} alt="google" /></span>
          </div>
          <div className="google-sign-in mt-2 w-75" onClick={facebookSignIn}>
            <span> Continue with facebook <img className="facebook" src={facebookIcon} alt="google" /></span>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;