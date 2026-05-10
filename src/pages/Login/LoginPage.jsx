import { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { Link, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import styles from '../../CSS/LoginPage.module.css';

const LoginPage = () => {

  //custsom hooks:
  const { login, isAuthenticated } = useAuth(); // we access the state and the functions to update the state to check if the user is logged in.

  //routing:
  const navigate = useNavigate(); // this function allows us by using "navigate("/page i want")" to go to the page i want.
  const location = useLocation(); // with location we able to use the state that came with "navigate" that tells us where we were trying to go before login.
                                  

  //states
  const [serverError, setServerError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  //react hook form:
  const {register, handleSubmit,formState: { errors },} = useForm({
    defaultValues: { username: '',password: '' },});

  // Redirect if already authenticated
  if (isAuthenticated) {
    const from = location.state?.from?.pathname || '/home';
    return <Navigate to={from} replace />;
  }

  const onSubmit = useCallback(
    async (data) => {
      setIsLoading(true);
      setServerError('');

      try {
        const result = await login(data.username, data.password); // get to the DB and confirm the data from the USE-FORM. that's why its an async function.
        if (result.success) {
          // if we logged from specific place in the app we redirect to it after login,
          // if not we redirect to the home page
          const from = location.state?.from?.pathname || '/home'; 
          navigate(from, { replace: true }); // navigate to the page in "from", replace is a state to not push the login page to the history stack 
        } else { //wrong username or password
          setServerError(result.error);
        }
      } catch (error) { //db isn't up or something else
        setServerError('An unexpected error occurred. Please try again.');
      } finally { //we are done, we close the loader
        setIsLoading(false); // stop the spinning wheel
      }
    },
    // login - returns true if succeeded, false if there is a problem
    // navigate - allows us to navigate between pages
    // location.state - allows us to redirect to the page we were trying to access before login
    [login, navigate, location.state] // this function will run only if one of the states changes. why? to prevent infinite loop
  );

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.header}>
          <span className={styles.logo}>◆</span>
          <h1 className={styles.title}>Welcome Back</h1>
          <p className={styles.subtitle}>Sign in to your account</p>
        </div>

        <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
          {serverError && (
            <div className={styles.errorBanner}>{serverError}</div>
          )}

          <div className={styles.field}>
            <label className={styles.label} htmlFor="username">
              Username
            </label>
            <input
              id="username"
              type="text"
              className={`${styles.input} ${errors.username ? styles.inputError : ''}`}
              placeholder="Enter your username"
              {...register('username', {
                required: 'Username is required',
                minLength: { value: 2, message: 'Username must be at least 2 characters' },
              })}
            />
            {errors.username && (
              <span className={styles.fieldError}>{errors.username.message}</span>
            )}
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              className={`${styles.input} ${errors.password ? styles.inputError : ''}`}
              placeholder="Enter your password"
              {...register('password', {
                required: 'Password is required',
              })}
            />
            {errors.password && (
              <span className={styles.fieldError}>{errors.password.message}</span>
            )}
          </div>

          <button
            type="submit"
            className={styles.submitBtn}
            disabled={isLoading}
          >
            {isLoading ? (
              <span className={styles.spinner}></span>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <p className={styles.footer}>
          Don't have an account?{' '}
          <Link to="/register" className={styles.link}>
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
