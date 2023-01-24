import { gql, useMutation } from "@apollo/client";
import { useForm } from "react-hook-form";
import styled from "styled-components";
import { showEditProfile } from "../apollo";
import Button from "../components/auth/Button";
import FormBox from "../components/auth/FormBox";
import FormError from "../components/auth/FormError";
import Input from "../components/auth/Input";
import { SEE_PROFILE_QUERY } from "./Profile";

const EditWarpper = styled.div`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
`;

const EditStyle = styled.div`
  width: 480px;
  background-color: white;
  /* padding: 2rem; */
`;

const HeaderH1 = styled.h1`
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 2rem;
`;

const AvatarTitle = styled.h3`
  padding-top: 1rem;
`;

const EDIT_PROFILE_MUTATION = gql`
  mutation editProfile(
    $firstName: String
    $lastName: String
    $email: String
    $password: String
    $bio: String
    $file: Upload
  ) {
    editProfile(
      firstName: $firstName
      lastName: $lastName
      email: $email
      password: $password
      bio: $bio
      avatar: $file
    ) {
      ok
      error
    }
  }
`;

function EditProfile() {
  const onCompleted = (data) => {
    const {
      editProfile: { ok, error },
    } = data;
    if (!ok) {
      return setError("result", { message: error });
    }
    showEditProfile(false);
  };

  const [editProfile, { loading }] = useMutation(EDIT_PROFILE_MUTATION, {
    onCompleted,
    refetchQueries: [{ query: SEE_PROFILE_QUERY }],
  });

  const onSubmitValid = (data) => {
    if (loading) {
      return;
    }
    editProfile({
      variables: {
        ...data,
      },
    });
  };

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isValid },
  } = useForm({ mode: "onChange" });

  return (
    <EditWarpper onClick={() => showEditProfile(false)}>
      <EditStyle onClick={(e) => e.stopPropagation()}>
        <FormBox>
          <HeaderH1>Edit Profile</HeaderH1>
          <FormError message={errors?.result?.message} />
          <form onSubmit={handleSubmit(onSubmitValid)}>
            <Input
              {...register("firstName", {
                required: "First Name is Required",
                minLength: {
                  value: 3,
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
                required: "Last Name is Required",
                minLength: {
                  value: 5,
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
            <FormError message={errors?.lastName?.message} />

            <Input
              {...register("bio", {
                required: "bio is Required",
                maxLength: {
                  value: 60,
                  message: "Bio is too Long",
                },
              })}
              type="text"
              placeholder="Bio"
            />
            <FormError message={errors?.bio?.message} />

            <Input
              {...register("email", { required: "Email is Required" })}
              type="email"
              placeholder="Email"
            />
            <FormError message={errors?.email?.message} />

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
            <AvatarTitle>Avatar</AvatarTitle>
            <Input {...register("avatar")} type="file" />
            <Button
              type="submit"
              value={loading ? "Loading..." : "Edit"}
              disabled={!isValid || loading}
            />
          </form>
        </FormBox>
      </EditStyle>
    </EditWarpper>
  );
}

export default EditProfile;
