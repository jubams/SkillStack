import {
  email,
  required,
  minLength,
  compare,
} from '@rxweb/reactive-form-validators';

export class RegisterInterface {
  @required({ message: 'First name is required' })
  firstName: string;

  @required({ message: 'Last name is required' })
  lastName: string;

  @required({ message: 'Email is required' })
  @email({ message: 'Please enter a valid email address' })
  email: string;

  @required({ message: 'Password is required' })
  @minLength({
    value: 6,
    message: 'Password must be at least 6 characters long',
  })
  password: string;

  @required({ message: 'Please confirm your password' })
  @compare({ fieldName: 'password', message: 'Passwords do not match' })
  confirmPassword: string;

  constructor(register?: RegisterInterface) {
    this.firstName = register?.firstName || '';
    this.lastName = register?.lastName || '';
    this.email = register?.email || '';
    this.password = register?.password || '';
    this.confirmPassword = register?.confirmPassword || '';
  }
}
