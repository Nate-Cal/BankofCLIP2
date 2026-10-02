import { useState } from 'react'
import type { FormEvent } from 'react'
import type { User } from '../models/banking'
import { authService } from '../services/authService'
import { Brand, Button, Input } from '../components/ui'
import { Icon } from '../components/Icon'
import { handleTabNavigation } from '../utils/tabs'
import { currentYear } from '../utils/format'

interface AuthPageProps {
  onLogin: (user: User) => void
  notify: (message: string, kind?: 'success' | 'error') => void
}

export function AuthPage({ onLogin, notify }: AuthPageProps) {
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [values, setValues] = useState({
    firstName: '',
    lastName: '',
    userId: '',
    pin: '',
    confirmPin: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [serverError, setServerError] = useState('')
  const [busy, setBusy] = useState(false)

  function update(field: keyof typeof values, value: string) {
    setValues((previous) => ({ ...previous, [field]: value }))
    setErrors((previous) => ({ ...previous, [field]: '' }))
    setServerError('')
  }

  function switchMode(nextMode: typeof mode) {
    setMode(nextMode)
    setErrors({})
    setServerError('')
    setValues((previous) => ({ ...previous, pin: '', confirmPin: '' }))
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const nextErrors: Record<string, string> = {}
    if (!values.userId.trim()) nextErrors.userId = 'Enter your user ID.'
    if (!values.pin.trim()) nextErrors.pin = 'Enter your PIN.'
    if (mode === 'register') {
      if (!values.firstName.trim())
        nextErrors.firstName = 'Enter your first name.'
      if (!values.lastName.trim()) nextErrors.lastName = 'Enter your last name.'
      if (!values.confirmPin.trim()) nextErrors.confirmPin = 'Confirm your PIN.'
      else if (values.pin !== values.confirmPin)
        nextErrors.confirmPin = 'Your PINs do not match.'
    }
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) return
    setBusy(true)
    setServerError('')
    try {
      if (mode === 'login') {
        const response = await authService.login({
          userId: values.userId,
          pin: values.pin,
        })
        onLogin(response.user)
      } else {
        const { firstName, lastName, userId, pin } = values
        await authService.register({ firstName, lastName, userId, pin })
        switchMode('login')
        notify('Account created. Sign in with your new user ID and PIN.')
      }
    } catch (error) {
      setServerError(
        error instanceof Error
          ? error.message
          : 'Something went wrong. Please try again.',
      )
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="auth-page">
      <main className="auth-main">
        <div className="auth-brand">
          <Brand />
        </div>
        <div className="auth-form-card">
          <div className="auth-kicker">
            <span className="kicker-line" />
            PERSONAL BANKING
          </div>
          <h1>
            {mode === 'login' ? 'Welcome back.' : 'Make yourself at home.'}
          </h1>
          <p className="auth-description">
            {mode === 'login'
              ? 'Sign in to your Bank of CLI account.'
              : 'Create your account to get started.'}
          </p>
          <div
            className="auth-tabs"
            role="tablist"
            aria-label="Account access"
            onKeyDown={handleTabNavigation}
          >
            <button
              type="button"
              role="tab"
              id="login-tab"
              tabIndex={mode === 'login' ? 0 : -1}
              aria-selected={mode === 'login'}
              aria-controls="access-panel"
              disabled={busy}
              onClick={() => switchMode('login')}
            >
              Sign in
            </button>
            <button
              type="button"
              role="tab"
              id="register-tab"
              tabIndex={mode === 'register' ? 0 : -1}
              aria-selected={mode === 'register'}
              aria-controls="access-panel"
              disabled={busy}
              onClick={() => switchMode('register')}
            >
              Create account
            </button>
          </div>
          <div
            id="access-panel"
            role="tabpanel"
            aria-labelledby={`${mode}-tab`}
          >
            <form onSubmit={submit} noValidate>
              <fieldset disabled={busy}>
                {mode === 'register' && (
                  <div className="form-columns">
                    <Input
                      label="First name"
                      name="firstName"
                      autoComplete="given-name"
                      placeholder="First name"
                      value={values.firstName}
                      onChange={(event) =>
                        update('firstName', event.target.value)
                      }
                      error={errors.firstName}
                      required
                      maxLength={60}
                    />
                    <Input
                      label="Last name"
                      name="lastName"
                      autoComplete="family-name"
                      placeholder="Last name"
                      value={values.lastName}
                      onChange={(event) =>
                        update('lastName', event.target.value)
                      }
                      error={errors.lastName}
                      required
                      maxLength={60}
                    />
                  </div>
                )}
                <Input
                  label="User ID"
                  name="userId"
                  autoComplete="username"
                  placeholder={
                    mode === 'login' ? 'Enter your user ID' : 'Choose a user ID'
                  }
                  value={values.userId}
                  onChange={(event) => update('userId', event.target.value)}
                  error={errors.userId}
                  required
                  maxLength={60}
                />
                <Input
                  label="PIN"
                  name="pin"
                  autoComplete={
                    mode === 'login' ? 'current-password' : 'new-password'
                  }
                  type="password"
                  placeholder={
                    mode === 'login' ? 'Enter your PIN' : 'Choose a PIN'
                  }
                  value={values.pin}
                  onChange={(event) => update('pin', event.target.value)}
                  error={errors.pin}
                  required
                  maxLength={128}
                />
                {mode === 'register' && (
                  <Input
                    label="Confirm PIN"
                    name="confirmPin"
                    autoComplete="new-password"
                    type="password"
                    placeholder="Re-enter your PIN"
                    value={values.confirmPin}
                    onChange={(event) =>
                      update('confirmPin', event.target.value)
                    }
                    error={errors.confirmPin}
                    required
                    maxLength={128}
                  />
                )}
              </fieldset>
              {serverError && (
                <p className="form-alert" role="alert">
                  <Icon name="info" size={18} />
                  {serverError}
                </p>
              )}
              <Button
                type="submit"
                className="full-width auth-submit"
                loading={busy}
              >
                {busy
                  ? 'Please wait…'
                  : mode === 'login'
                    ? 'Sign in'
                    : 'Create account'}
              </Button>
            </form>
          </div>
        </div>
      </main>
    </div>
  )
}
