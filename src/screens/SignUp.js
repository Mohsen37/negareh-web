import { gql, useMutation } from "@apollo/client";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import AuthLayout from "../components/auth/AuthLayout";
import BottomBox from "../components/auth/BottomBox";
import Button from "../components/auth/Button";
import FormBox from "../components/auth/FormBox";
import FormError from "../components/auth/FormError";
import Input from "../components/auth/Input";
import Separator from "../components/auth/Separator";
import { GrayBoldLink } from "../components/shared";
import routes from "../routes";
import logo from "../image/logo/negareh-logo.svg";

const Subtitle = styled(GrayBoldLink)`
  text-align: center;
  font-size: ${(props) => props.size};
  padding: 1rem;
  line-height: 24px;
`;
const PolicyLine = styled.p`
  font-size: 14px;
  line-height: 24px;
  text-align: center;
  padding: 1rem;
  color: gray;
`;
const LogButton = styled.button`
  cursor: pointer;
  font-size: 14px;
  width: 100%;
  padding: 0.7rem 0rem;
  background-color: #0072cc;
  color: white;
  border: none;
  font-weight: bold;
  border-radius: 4px;
  i {
    margin-right: 8px;
  }
`;

const CREATE_ACCOUNT_MUTATION = gql`
  mutation createAccount(
    $firstName: String!
    $lastName: String!
    $userName: String!
    $email: String!
    $password: String!
  ) {
    createAccount(
      firstName: $firstName
      lastName: $lastName
      userName: $userName
      email: $email
      password: $password
    ) {
      ok
      error
    }
  }
`;

function SignUp() {
  const history = useHistory();
  const onCompleted = (data) => {
    const {
      createAccount: { ok, error },
    } = data;
    if (!ok) {
      return setError("result", {
        message: error,
      });
    }
    history.push(routes.home, { message: "Account Created, Please Login" });
  };
  const [createAccount, { loading }] = useMutation(CREATE_ACCOUNT_MUTATION, {
    onCompleted,
  });
  const {
    register,
    handleSubmit,
    clearErrors,
    setError,
    formState: { errors, isValid },
  } = useForm({ mode: "onChange" });
  const onSubmitValid = (data) => {
    if (loading) {
      return;
    }
    createAccount({
      variables: {
        ...data,
      },
    });
  };
  const clearLoginError = () => {
    clearErrors("result");
  };
  return (
    <AuthLayout>
      <Helmet>
        <title>Sign up</title>
      </Helmet>
      <FormBox>
        <img className="logo" src={logo} alt="Logo" />
        <Subtitle size={"1.2rem"}>
          Sign up to see photos and videos from your friends
        </Subtitle>
        <LogButton>
          <i class="bi bi-google"></i>Log in with Google
        </LogButton>
        <Separator />
        <FormError message={errors?.result?.message} />
        <form onSubmit={handleSubmit(onSubmitValid)}>
          <Input
            {...register("firstName", {
              required: "First Name is Required",
              minLength: {
                value: 5,
                message: "First Name is too short",
              },
              maxLength: {
                value: 20,
                message: "First Name is too Long",
              },
            })}
            type="text"
            placeholder="First Name"
          />
          <FormError message={errors?.firstName?.message} />
          <Input
            {...register("lastName", {
              minLength: {
                value: 2,
                message: "Last Name is too short",
              },
              maxLength: {
                value: 20,
                message: "Last Name is too Long",
              },
            })}
            type="text"
            placeholder="Last Name"
          />
          <Input
            {...register("email", { required: "Email is Required" })}
            type="email"
            placeholder="Email"
          />
          <FormError message={errors?.email?.message} />
          <Input
            {...register("userName", {
              required: "Username is Required",
              minLength: {
                value: 5,
                message: "Username is too short",
              },
              maxLength: {
                value: 20,
                message: "Username is too Long",
              },
            })}
            type="text"
            placeholder="Username"
          />
          <FormError message={errors?.userName?.message} />
          <Input
            {...register("password", {
              required: "Password is Required",
              minLength: {
                value: 8,
                message:
                  "Password is too short, it's must be more than 8 character",
              },
            })}
            type="password"
            placeholder="Password"
          />
          <FormError message={errors?.password?.message} />
          <Button
            onClick={clearLoginError}
            type="submit"
            value={loading ? "Loading..." : "Sign up"}
            disabled={!isValid || loading}
          />
        </form>
        <PolicyLine>
          By signing up, you agree to Our Terms , Data Policy and Cookies
          Policy.
        </PolicyLine>
      </FormBox>
      <BottomBox
        cta={"Have an Account?"}
        linkText={"Log in"}
        link={routes.home}
      />
    </AuthLayout>
  );
}

export default SignUp;
