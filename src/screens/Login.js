import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { gql, useMutation } from "@apollo/client";
import styled from "styled-components";
import AuthLayout from "../components/auth/AuthLayout";
import BottomBox from "../components/auth/BottomBox";
import Button from "../components/auth/Button";
import FormBox from "../components/auth/FormBox";
import FormError from "../components/auth/FormError";
import Input from "../components/auth/Input";
import Separator from "../components/auth/Separator";
import routes from "../routes";
import { logUserIn } from "../apollo";
import { useLocation } from "react-router-dom";
import SuccessNotif from "../components/auth/SuccessNotif";
import logo from "../image/logo/negareh-logo.svg";

const GoogleLine = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  color: #213a69;
  margin-bottom: 12px;
  h3 {
    font-size: 18px;
    font-weight: 600;
  }
  i {
    color: #213a69;
    margin-right: 8px;
  }
`;
const ForgotLine = styled.span`
  font-size: 14px;
  padding-top: 16px;
  padding-bottom: 8px;
`;

const LOGIN_MUTATION = gql`
  mutation login($username: String!, $password: String!) {
    login(userName: $username, password: $password) {
      ok
      token
      error
    }
  }
`;

function Login() {
  const location = useLocation();
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setError,
    clearErrors,
    getValues,
  } = useForm({ mode: "onChange" });

  const onCompleted = (data) => {
    const {
      login: { ok, error, token },
    } = data;
    if (!ok) {
      return setError("result", {
        message: error,
      });
    }
    if (token) {
      logUserIn(token);
    }
  };

  const [login, { loading }] = useMutation(LOGIN_MUTATION, {
    onCompleted,
  });

  const onSubmitValid = (data) => {
    if (loading) {
      return;
    }
    const { username, password } = getValues();
    login({
      variables: {
        username,
        password,
      },
    });
  };

  const clearLoginError = () => {
    clearErrors("result");
  };
  return (
    <AuthLayout>
      <Helmet>
        <title>Login</title>
      </Helmet>
      <FormBox>
        <img className="logo" src={logo} alt="Logo" />
        <SuccessNotif
        // message={location?.state?.message || null}
        />
        <FormError message={errors?.result?.message} />
        <form onSubmit={handleSubmit(onSubmitValid)}>
          <Input
            {...register("username", {
              required: "Username is Required",
              minLength: {
                value: 5,
                message: "Username should be longer than 5 Character",
              },
            })}
            // onChange={() => clearErrors("result")}
            type="text"
            name="username"
            placeholder="Username"
            hasError={Boolean(errors?.username?.message)}
          />
          <FormError message={errors?.username?.message} />
          <Input
            {...register("password", {
              required: "Password is Required",
              minLength: {
                value: 8,
                message: "Password should be longer than 8 Character",
              },
            })}
            // onChange={clearLoginError}
            name="password"
            type="password"
            placeholder="Password"
            hasError={Boolean(errors?.password?.message)}
          />
          <FormError message={errors?.password?.message} />
          <Button
            type="submit"
            value={loading ? "Loading..." : "Log in"}
            disabled={!isValid || loading}
            onClick={() => clearErrors("result")}
          />
        </form>
        <Separator />
        <GoogleLine>
          <i className="bi bi-google"></i>
          <h3>Log in with Google</h3>
        </GoogleLine>
        <ForgotLine>Forgot password?</ForgotLine>
      </FormBox>
      <BottomBox
        cta={"Don't have an Account?"}
        linkText={"Sign up"}
        link={routes.signUp}
      />
    </AuthLayout>
  );
}

export default Login;
