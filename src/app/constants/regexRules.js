export const VALIDATION_RULES = {
  NAME: /^[A-Z 0-9]{2,}$/i,
  PASSWORD:
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
};

export const VALIDATION_MESSAGE = {
  NAME: {
    REQUIRED: `Name is required.`,
    REGEX_RULES: `Name must contain only letters.`,
    MAX_LENGTH: `Name can't be more then 30 charachters.`,
  },
  EMAIL: {
    REQUIRED: `Email is required.`,
    INVALID: `Please enter valid email.`,
    UNIQUE: `This email is already exist. `,
  },
  PASSWORD: {
    REQUIRED: `Password is required.`,
    REGEX_RULES: `Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number and one special character.`,
  },
  OLD_PASSWORD: {
    REQUIRED: `Old password is required.`,
  },
  CONFIRMED_PASSWORD: {
    REQUIRED: `Password is required.`,
    REGEX_RULES: `Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number and one special character.`,
    NOT_IDENTICAL: `Passwords do not match.`,
  },
  IMAGE: {
    REQUIRED: `Image is required.`,
    FORMAT: `Only *.jpeg, *.jpg, *.png, images are allowed.`,
  },
};
