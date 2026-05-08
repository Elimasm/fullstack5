import { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import styles from '../../CSS/RegisterPage.module.css';

const CompleteProfilePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { register: registerUser } = useAuth();
  const [serverError, setServerError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Get credentials from step 1
  const credentials = location.state;

  // If no credentials, redirect back to register
  if (!credentials?.username || !credentials?.password) {
    return <Navigate to="/register" replace />;
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      street: '',
      city: '',
      companyName: '',
    },
  });

  const onSubmit = useCallback(
    async (data) => {
      setIsLoading(true);
      setServerError('');

      try {
        const userData = {
          name: data.name,
          username: credentials.username,
          email: data.email,
          phone: data.phone,
          website: credentials.password, // password stored as website field
          address: {
            street: data.street,
            suite: '',
            city: data.city,
            zipcode: '',
            geo: { lat: '0', lng: '0' },
          },
          company: {
            name: data.companyName || 'N/A',
            catchPhrase: '',
            bs: '',
          },
        };

        const result = await registerUser(userData);
        if (result.success) {
          navigate('/home', { replace: true });
        } else {
          setServerError(result.error);
        }
      } catch (error) {
        setServerError('Registration failed. Please try again.');
      } finally {
        setIsLoading(false);
      }
    },
    [credentials, registerUser, navigate]
  );

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.header}>
          <span className={styles.logo}>◆</span>
          <h1 className={styles.title}>Complete Profile</h1>
          <p className={styles.subtitle}>Step 2 of 2 — Tell us about yourself</p>
        </div>

        <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
          {serverError && (
            <div className={styles.errorBanner}>{serverError}</div>
          )}

          <div className={styles.field}>
            <label className={styles.label} htmlFor="cp-name">Full Name</label>
            <input
              id="cp-name"
              type="text"
              className={`${styles.input} ${errors.name ? styles.inputError : ''}`}
              placeholder="John Doe"
              {...register('name', { required: 'Full name is required' })}
            />
            {errors.name && <span className={styles.fieldError}>{errors.name.message}</span>}
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="cp-email">Email</label>
            <input
              id="cp-email"
              type="email"
              className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
              placeholder="you@example.com"
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: 'Enter a valid email',
                },
              })}
            />
            {errors.email && <span className={styles.fieldError}>{errors.email.message}</span>}
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="cp-phone">Phone</label>
              <input
                id="cp-phone"
                type="text"
                className={styles.input}
                placeholder="(555) 555-5555"
                {...register('phone')}
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="cp-company">Company</label>
              <input
                id="cp-company"
                type="text"
                className={styles.input}
                placeholder="Company name"
                {...register('companyName')}
              />
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="cp-street">Street</label>
              <input
                id="cp-street"
                type="text"
                className={styles.input}
                placeholder="123 Main St"
                {...register('street')}
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="cp-city">City</label>
              <input
                id="cp-city"
                type="text"
                className={styles.input}
                placeholder="New York"
                {...register('city')}
              />
            </div>
          </div>

          <button
            type="submit"
            className={styles.submitBtn}
            disabled={isLoading}
          >
            {isLoading ? (
              <span className={styles.spinner}></span>
            ) : (
              'Create Account'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CompleteProfilePage;
