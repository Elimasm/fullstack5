import { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { Link, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import styles from '../../CSS/LoginPage.module.css';

const LoginPage = () => {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [serverError, setServerError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      username: '',
      password: '',
    },
  });

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
        const result = await login(data.username, data.password);
        if (result.success) {
          const from = location.state?.from?.pathname || '/home';
          navigate(from, { replace: true });
        } else {
          setServerError(result.error);
        }
      } catch (error) {
        setServerError('An unexpected error occurred. Please try again.');
      } finally {
        setIsLoading(false);
      }
    },
    [login, navigate, location.state]
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
