import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Input } from '@inithium/ui';
import { Button } from '@inithium/ui';
import { Text } from '@inithium/ui';
import { Box } from '@inithium/ui';
import { NavigationLink } from '@inithium/router';

interface LoginFormValues {
  email: string;
  password: string;
}

interface LoginFormErrors {
  email?: string;
  password?: string;
}

const Login: React.FC = () => {
  const [values, setValues] = useState<LoginFormValues>({ email: '', password: '' });
  const [errors, setErrors] = useState<LoginFormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const validate = (vals: LoginFormValues): LoginFormErrors => {
    const errs: LoginFormErrors = {};
    if (!vals.email.trim()) {
      errs.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(vals.email)) {
      errs.email = 'Enter a valid email address';
    }
    if (!vals.password) {
      errs.password = 'Password is required';
    }
    return errs;
  };

  const handleChange =
    (field: keyof LoginFormValues) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const updated = { ...values, [field]: (e.target as HTMLInputElement).value };
      setValues(updated);
      if (submitted) {
        setErrors(validate(updated));
      }
    };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    const errs = validate(values);
    setErrors(errs);
    if (Object.keys(errs).length === 0) {
      console.log('Login submitted', values);
    }
  };

  return (
    <Box
      color="surface-contrast"
      flex
      direction="col"
      justify="center"
      align="center"
      fullWidth
      fullHeight
    >
      {/* Card */}
      <Box
        color="surface"
        flex
        direction="col"
        align="center"
        padding="xl"
        borderRadius="lg"
        style={{
          width: '100%',
          maxWidth: '440px',
          boxShadow: '0 4px 32px 0 rgba(15,80,102,0.10)',
          gap: '24px',
        }}
      >
        {/* Header */}
        <Box flex direction="col" align="center" style={{ gap: '6px', width: '100%' }}>
          <Text variant="h3" color="primary" decoration={{ bold: true }}>
            Welcome back
          </Text>
          <Text variant="body2" overrideClassName="text-slate-500">
            Sign in to your account to continue
          </Text>
        </Box>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          noValidate
          style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%' }}
        >
          {/* Email */}
          <Box flex direction="col" style={{ gap: '4px', width: '100%' }}>
            <Input
              label="Email"
              type="email"
              value={values.email}
              onChange={handleChange('email')}
              color={errors.email ? 'danger' : 'primary'}
              variant="outline"
              size="md"
              fullWidth
              leadingIcon="mail"
            />
            {errors.email && (
              <Text variant="caption" overrideClassName="text-xs text-danger pl-1">
                {errors.email}
              </Text>
            )}
          </Box>

          {/* Password */}
          <Box flex direction="col" style={{ gap: '4px', width: '100%' }}>
            <Box style={{ position: 'relative', width: '100%' }}>
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                value={values.password}
                onChange={handleChange('password')}
                color={errors.password ? 'danger' : 'primary'}
                variant="outline"
                size="md"
                fullWidth
                leadingIcon="lock"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  color: '#64748b',
                  zIndex: 20,
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </Box>
            {errors.password && (
              <Text variant="caption" overrideClassName="text-xs text-danger pl-1">
                {errors.password}
              </Text>
            )}
          </Box>

          <Button
            type="submit"
            color="primary"
            variant="solid"
            size="lg"
            fullWidth
            rounded
          >
            Sign In
          </Button>
        </form>

        {/* Divider */}
        <Box flex direction="row" align="center" style={{ width: '100%', gap: '12px' }}>
          <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }} />
          <Text variant="caption" overrideClassName="text-slate-400 text-xs">
            Don't have an account?
          </Text>
          <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }} />
        </Box>

        {/* Navigate to sign up */}
        <NavigationLink pageKey="sign-up" asButton>
          Create an account
        </NavigationLink>
      </Box>
    </Box>
  );
};

export default Login;