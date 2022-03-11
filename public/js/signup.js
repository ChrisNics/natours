import axios from 'axios';
import { showAlert } from './alert';

export const signup = async (name, email, passwordConfirm, password) => {
  try {
    const res = await axios({
      method: 'POST',
      url: 'http://127.0.0.1:3000/api/v1/users/signup',
      data: {
        name,
        email,
        passwordConfirm,
        password,
      },
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Sign up successfully');
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
  } catch (err) {
    showAlert(
      'error',
      err.response.data.message.replace('passwordConfirm', '') // userModel ang gumawa ng error
    );
  }
};
