import { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { getUserByUsername } from '../../api/usersApi';
import styles from './RegisterPage.module.css';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      username: '',
      password: '',
      verifyPassword: '',
    },
  });

  const password = watch('password');

  const onSubmit = useCallback(
    async (data) => {
      setIsLoading(true);
      setServerError('');

      try {
        // Check if username already exists
        const existingUser = await getUserByUsername(data.username);
        if (existingUser) {
          setServerError('This username is already taken. Please choose another.');
          return;
        }

        // Username is available — proceed to complete profile
        navigate('/register/complete', {
          state: {
            username: data.username,
            password: data.password,
          },
        });
      } catch (error) {
        setServerError('An unexpected error occurred. Please try again.');
      } finally {
        setIsLoading(false);
      }
    },
    [navigate]
  );

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.header}>
          <span className={styles.logo}>◆</span>
          <h1 className={styles.title}>Create Account</h1>
          <p className={styles.subtitle}>Step 1 of 2 — Choose your credentials</p>
        </div>

        <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
          {serverError && (
            <div className={styles.errorBanner}>{serverError}</div>
          )}

          <div className={styles.field}>
            <label className={styles.label} htmlFor="reg-username">
              Username
            </label>
            <input
              id="reg-username"
              type="text"
              className={`${styles.input} ${errors.username ? styles.inputError : ''}`}
              placeholder="Choose a unique username"
              {...register('username', {
                required: 'Username is required',
                minLength: { value: 3, message: 'Must be at least 3 characters' },
              })}
            />
            {errors.username && (
              <span className={styles.fieldError}>{errors.username.message}</span>
            )}
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="reg-password">
              Password
            </label>
            <input
              id="reg-password"
              type="password"
              className={`${styles.input} ${errors.password ? styles.inputError : ''}`}
              placeholder="Create a password"
              {...register('password', {
                required: 'Password is required',
                minLength: { value: 4, message: 'Must be at least 4 characters' },
              })}
            />
            {errors.password && (
              <span className={styles.fieldError}>{errors.password.message}</span>
            )}
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="reg-verify">
              Verify Password
            </label>
            <input
              id="reg-verify"
              type="password"
              className={`${styles.input} ${errors.verifyPassword ? styles.inputError : ''}`}
              placeholder="Re-enter your password"
              {...register('verifyPassword', {
                required: 'Please verify your password',
                validate: (value) =>
                  value === password || 'Passwords do not match',
              })}
            />
            {errors.verifyPassword && (
              <span className={styles.fieldError}>{errors.verifyPassword.message}</span>
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
              'Continue →'
            )}
          </button>
        </form>

        <p className={styles.footer}>
          Already have an account?{' '}
          <Link to="/login" className={styles.link}>
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
