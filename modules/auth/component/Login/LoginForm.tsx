import React, { FormEvent, useState, useContext } from 'react';
import Button from '@ui/Button';
import { Input } from '@ui/Input';
import { notify } from '@ui/Toast';
import Link from 'next/link';
import AuthLayout from '../AuthLayout';
import { Eye, EyeSlash } from 'iconsax-react';
import InputError from '../InputError';
import useInputError from '../../../../hooks/useInputError';
import { loginUser } from '../../../../http';
import useAuthMutation from '../../../../hooks/Auth/useAuthMutation';
import SignUpWithGoogle from '@modules/auth/component/AuthSocialButtons/SignUpWithGoogle';
import SignUpWithGithub from '@modules/auth/component/AuthSocialButtons/SignUpWithGithub';
import SignUpWithFacebook from '@modules/auth/component/AuthSocialButtons/SignUpWithFacebook';
import { useRouter } from 'next/router';
import AuthContext from '../../../../context/AuthContext';
import isAuthenticated from '../../../../helpers/isAuthenticated';

function LoginForm() {
  const { handleUser } = useContext(AuthContext);
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordShown, setIsPassowordShwon] = useState(false);
  const { handleSubmit, inputErrors } = useInputError();

  const { mutate: loginUserMutation, isLoading: isLoginUserMutationLoading } = useAuthMutation(loginUser, {
    onSuccess: async (res) => {
      console.log('responseoutside', res);

      if (res.statusCode === 200 && res.data.token) {
        console.log('Login success:', res);
        handleUser(res.data);
        localStorage.setItem('zpt', res.token);
        const value = isAuthenticated(res.token);
        console.log(value);

        router.push('/');
      } else if (res.statusCode === 400 && res.message === 'Please verify your email.') {
        console.error('Unverified user');

        notify({
          message: 'Please verify your email.',
          type: 'error',
        });
      } else if (res.statusCode === 400 && res.message === 'Incorrect password') {
        console.error('Incorrect password');

        notify({
          message: 'Incorrect password',
          type: 'error',
        });
      } else if (res.statusCode === 500 && res.message === 'Error logging in') {
        console.error('Error logging in');

        notify({
          message: 'Error logging in',
          type: 'error',
        });
      } else {
        console.error('sign up');
        notify({
          message: 'Error logging in',
          type: 'error',
        });
      }
    },
    onError: (e) => {
      console.error({ e });
      notify({
        message: 'Error logging in',
        type: 'error',
      });
    },
  });

  const handleLogin = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('heloooooooooo');

    if (email.length !== 0 && password.length !== 0) {
      loginUserMutation({ email: email, password: password });
    }
    // To clear the input filed after submission
    setEmail('');
    setPassword('');
  };

  return (
    <AuthLayout isTopRightBlobShown isBottomLeftPadlockShown={false}>
      <div className="md:mx-auto lg:mb-10 font-manropeL">
        <div className="md:flex sm:flex flex-col items-center justify-center lg:items-start">
          <p className=" md:text-4xl text-[1.5rem] font-bold  text-center lg:text-left ">Log In</p>
          <p className="text-custom-color30  mt-[1rem] md:text-[1.375rem]  lg:font-semibold sm:tracking-[0.00375rem] text-center md:text-left">
            Log in to continue using zuriportfolio
          </p>
        </div>

        <div className="pt-[2.25rem]">
          <form onSubmit={handleLogin}>
            <div>
              <label htmlFor="email" className="text-slate-300 font-semibold leading-7">
                Email Address
              </label>
              <Input
                placeHolder="Allusugar@gmail.com"
                id="email"
                name="email"
                className="w-full border-slate-50 mt-[0.5rem] py-[0.84rem] bg-transparent "
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <InputError inputError={inputErrors} inputName="email" />
            </div>
            <div className="mt-[1rem]">
              <label htmlFor="password" className="text-slate-300 font-semibold leading-7 mt-4">
                Password
              </label>
              <Input
                placeHolder="Gbemi345"
                id="password"
                name="password"
                className="w-full border-slate-50 mt-[0.5rem] py-[0.84rem] bg-transparent "
                type={isPasswordShown ? 'text' : 'password'}
                rightIcon={
                  isPasswordShown ? (
                    <Eye className="cursor-pointer" onClick={() => setIsPassowordShwon(false)} />
                  ) : (
                    <EyeSlash className="cursor-pointer" onClick={() => setIsPassowordShwon(true)} />
                  )
                }
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <InputError inputError={inputErrors} inputName="password" />
            </div>

            <Link href="/auth/forgot-password">
              <p className=" font-manrope text-brand-green-primary text-right  text-[1.18313rem] mt-[0.62rem]">
                Forgot Password ?
              </p>
            </Link>

            <Button
              isLoading={isLoginUserMutationLoading}
              intent={'primary'}
              type="submit"
              size={'md'}
              className="w-full rounded-lg mt-[1rem]"
            >
              Continue
            </Button>
          </form>
          <div>
            <p className=" text-custom-color20 text-center text-[0.875rem] font-semibold mt-[1rem] leading-5">
              Don&apos;t have an account?
              <Link href="/auth/login">
                <span className="text-brand-green-primary"> Sign in</span>
              </Link>
            </p>
          </div>

          <div className="flex items-center justify-center mt-[2.5rem]">
            <div className="w-1/2 h-[0.0625rem] bg-white-650"></div>
            <p className="mx-4 text-white-650 font-semibold">OR</p>
            <div className="w-1/2 h-[0.0625rem] bg-white-650 "></div>
          </div>
          <div className="mt-[1.6rem] flex flex-col gap-[1rem] relative">
            <SignUpWithGoogle />
            <SignUpWithGithub />
            <SignUpWithFacebook />
          </div>
        </div>
      </div>
    </AuthLayout>
  );
}

export default LoginForm;
