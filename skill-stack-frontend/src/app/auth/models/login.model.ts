import { email, required } from '@rxweb/reactive-form-validators';

export class LoginInterface {
  @required({ message: 'Email is required' })
  @email({ message: 'Invalid email format' })
  email: string;
  @required({ message: 'Password is required' })
  password: string;

  constructor(login?: LoginInterface) {
    this.email = login?.email || '';
    this.password = login?.password || '';
  }
}
