import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from 'sweetalert2'
import api from "../../services/api";

//Components
import Main from "../../components/Main";
import Header from "../../components/Header";
import Button from "../../components/Button";
import Container from "../../components/Container";
import Input from "../../components/Input";
import Tittle from "../../components/Tittle";
import Form from "../../components/Form";

//Animation
import FadeIn from "../../components/FadeIn";
import FadeInDown from "../../components/FadeInDown";

//SVG
import logo from "../../images/Xnote.svg";

const TOKEN = "@Token-Xnote";
const USER = "@User-Xnote";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        localStorage.getItem(TOKEN) && localStorage.getItem(USER) && navigate("/app");
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!email || !password) {
            Swal.fire({
                icon: 'warning',
                title: 'Oops...',
                text: "Empty fields!"
            })
        } else {
            api.post("/users/login", { email, password }).then((response) => {
                localStorage.setItem(USER, JSON.stringify(response.data.user));
                localStorage.setItem(TOKEN, response.data.token);
                navigate("/app");
            }).catch((error) => {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: error.response.data.message
                })
            })
        }
    }

    return (
        <>
            <Main>
                <FadeIn>
                    <Header>
                        <Link to="/">
                            <img src={logo} alt="logo" />
                        </Link>
                        <Link to="/register">
                            <Button>Register</Button>
                        </Link>
                    </Header>
                </FadeIn>
                <Container display="grid" height="100%" justify="center">
                    <Container>
                        <FadeInDown duration="1s">
                            <Tittle align="center" size={64}>Access account</Tittle>
                            
                            <Form onSubmit={handleSubmit}>
                                <Input placeholder="Email" type="email" onChange={(event => setEmail(event.target.value))} />
                                <Input placeholder="Password" type="password" onChange={(event => setPassword(event.target.value))} />
                                <Button type="submit" size="medium" justify="center" style={{ marginTop: "20px" }}>Login</Button>
                            </Form>
                        </FadeInDown>
                    </Container>
                </Container>
            </Main>
        </>
    )
}

export default Login;