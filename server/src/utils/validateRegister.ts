import { UsernamePasswordInput } from "../resolvers/users";
import { Users } from "../entities/Users";

export const validateRegister = async (
  options: UsernamePasswordInput,
  usertest: Users | undefined,
  emailtest: Users | undefined
) => {
  if (emailtest) {
    return [
      {
        field: "email",
        message: "This email is already taken",
      },
    ];
  }
  if (!options.email.includes("@")) {
    return [
      {
        field: "email",
        message: "email is not valid.",
      },
    ];
  }
  if (options.username.includes("@")) {
    return [
      {
        field: "username",
        message: "cannot include @",
      },
    ];
  }
  if (usertest) {
    return [
      {
        field: "username",
        message: "This username already exists",
      },
    ];
  }
  if (options.username.length <= 2) {
    return [
      {
        field: "username",
        message: "length must be greater than 2",
      },
    ];
  }
  if (options.password.length < 3) {
    return [
      {
        field: "password",
        message: "length must be greater than 3",
      },
    ];
  }
  return null;
};
