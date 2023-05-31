import { createContext, useContext, useState } from "react";
import { loginService } from "../services/auth-service/loginService";
import { signUpService } from "../services/auth-service/signUpService";
import { toast } from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [showPassword, setShowPassword] = useState({
    login: false,
    signUp: false,
    signUpConfirm: false,
  });

  const localStorageToken = JSON.parse(localStorage.getItem("loginDetails"));

  const [token, setToken] = useState(localStorageToken?.token);
  const [currentUser, setCurrentUser] = useState(localStorageToken?.user);
  const navigate = useNavigate();
  const location = useLocation();

  const toggleLoginPassword = () =>
    setShowPassword({ ...showPassword, login: !showPassword.login });

  const loginHandler = async ({ email, password }) => {
    try {
      const response = await loginService(email, password);

      const {
        status,
        data: { foundUser, encodedToken },
      } = response;

      if (status === 200) {
        localStorage.setItem(
          "loginDetails",
          JSON.stringify({ user: foundUser, token: encodedToken })
        );
        setCurrentUser(foundUser);
        setToken(encodedToken);
        toast.success("Successfully signed in!");
        navigate(location?.state?.from?.pathname ?? "/");
      }
    } catch (err) {
      console.error(err);
      toast.error("Unable to sign in!");
    }
  };

  const toggleSignUpPassword = () =>
    setShowPassword({ ...showPassword, signUp: !showPassword.signUp });

  const toggleSignUpConfirmPassword = () =>
    setShowPassword({
      ...showPassword,
      signUpConfirm: !showPassword.signUpConfirm,
    });

  const signUpHandler = async ({
    email,
    password,
    confirmPassword,
    firstName,
    lastName,
  }) => {
    if (password !== confirmPassword) {
      toast.error("Password fields are not matching!");
      navigate("/signup");
    } else {
      try {
        const response = await signUpService(
          email,
          password,
          firstName,
          lastName
        );

        const {
          status,
          data: { encodedToken },
        } = response;

        if (status === 201) {
          localStorage.setItem(
            "loginDetails",
            JSON.stringify({
              token: encodedToken,
            })
          );
          setToken(encodedToken);
          toast.success("Successfully signed up! Kindly login to continue!");
          navigate("/login");
        }
      } catch (err) {
        console.error(err);
        toast.error("Unable to sign up!");
      }
    }
  };

  const logoutHandler = () => {
    setToken(null);
    setCurrentUser(null);
    localStorage.removeItem("loginDetails");
    toast.success("Logged out successfully!");
    navigate(location?.state?.from?.pathname ?? "/");
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        currentUser,
        showPassword,
        toggleLoginPassword,
        loginHandler,
        toggleSignUpPassword,
        toggleSignUpConfirmPassword,
        signUpHandler,
        logoutHandler,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
