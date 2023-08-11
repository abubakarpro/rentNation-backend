export const enum CategoryModuleMessages {
  ConflictExceptionErrorMessage = 'Category already exist',
  BadRequestExceptionNotFoundErrorMessageForUpdate = 'Record to update does not exist',
  BadRequestExceptionInvalid = 'Invalid ID',
  BadRequestExceptionNotFoundErrorMessageForDelete = 'Record to delete does not exist',
  BadRequestExceptionNotFoundErrorMessage = 'Record not found',
}

export const enum ProductModuleMessages {
  ConflictExceptionErrorMessage = 'Product already exist',
  BadRequestExceptionInvalid = 'Invalid ID',
  BadRequestExceptionNotFoundErrorMessageForUpdate = 'Record to update does not exist',
  BadRequestExceptionNotFoundErrorMessageForDelete = 'Record to delete does not exist',
  BadRequestExceptionNotFoundErrorMessage = 'Record not found',
  ErrorMessage = 'Category not found',
  ConflictExceptionProductErrorMessage = 'This Product is already Liked.',
}

export const enum ReviewModuleMessgaes {
  BadRequestExceptionInvalid = 'Invalid ID',
  BadRequestExceptionNotFoundErrorMessage = 'Record not found',
}

export const enum UserModuleMessages {
  UnauthorizedExceptionErrorMessage = 'Please check your login credentials',
  BadRequestExceptionNotFoundErrorMessageForUpdate = 'Record to update does not exist',
  BadRequestExceptionNotFoundErrorMessageForDelete = 'Record to delete does not exist',
  ConflictExceptionErrorMessage = 'User already exist',
  BadRequestExceptionInvalid = 'Invalid ID',
  BadRequestExceptionNotFoundErrorMessage = 'Record not found',
  BadRequestExceptionPasswordMessage = 'Old password is not correct!',
  UserNotExist = 'User Not exist',
  ForbiddenExceptionErrorMessage = "You don't have permission to create account for SUB-ADMIN or ADMIN",
  NotFoundExceptionErrorMessage = 'Email not found',
}

export const enum ProfileModuleMessages {
  ConflictExceptionErrorMessage = 'Profile already exist',
  BadRequestExceptionNotFoundErrorMessageForUpdate = 'Record to update does not exist',
  BadRequestExceptionInvalid = 'Invalid ID',
  BadRequestExceptionNotFoundErrorMessageForDelete = 'Record to delete does not exist',
  BadRequestExceptionNotFoundErrorMessage = 'Entity with ID not found',
}

export const enum OrderModuleMessages {
  ConflictExceptionErrorMessage = 'order already exist',
  BadRequestExceptionNotFoundErrorMessageForUpdate = 'Record to update does not exist',
  BadRequestExceptionInvalid = 'Invalid ID',
  BadRequestExceptionNotFoundErrorMessageForDelete = 'Record to delete does not exist',
  BadRequestExceptionNotFoundErrorMessage = 'Record not found',
  BadRequestExceptionProductErrorMessage = 'Products should not be empty',
}

export const enum TicketModuleMessages {
  ConflictExceptionErrorMessage = 'Ticket already exist',
  BadRequestExceptionNotFoundErrorMessageForUpdate = 'Record to update does not exist',
  BadRequestExceptionInvalid = 'Invalid ID',
  BadRequestExceptionNotFoundErrorMessageForDelete = 'Record to delete does not exist',
  BadRequestExceptionNotFoundErrorMessage = 'Entity with ID not found',
}

export const enum DamageReportModuleMessages {
  ConflictExceptionErrorMessage = 'DamageReport already exist',
  BadRequestExceptionNotFoundErrorMessageForUpdate = 'Record to update does not exist',
  BadRequestExceptionInvalid = 'Invalid ID',
  BadRequestExceptionNotFoundErrorMessageForDelete = 'Record to delete does not exist',
  BadRequestExceptionNotFoundErrorMessage = 'Entity with ID not found',
}

export const enum NotificationModuleMessages {
  BadRequestExceptionNotFoundErrorMessageForUpdate = 'Record to update does not exist',
  BadRequestExceptionInvalid = 'Invalid ID',
  BadRequestExceptionNotFoundErrorMessageForDelete = 'Record to delete does not exist',
  BadRequestExceptionNotFoundErrorMessage = 'Record not found',
}

export const enum ContactUsModuleMessages {
  SuccessfullySentEmailMessage = 'Email sent successfully!',
  BadRequestExceptionEmailNotSent = 'Error sending email',
}

export const enum TransactionModuleMessages {
  ConflictExceptionErrorMessage = 'Transaction already exist',
  BadRequestExceptionNotFoundErrorMessageForUpdate = 'Record to update does not exist',
  BadRequestExceptionInvalid = 'Invalid ID',
  BadRequestExceptionNotFoundErrorMessageForDelete = 'Record to delete does not exist',
  BadRequestExceptionNotFoundErrorMessage = 'Record not found',
}

export const enum FileUploadModuleMessages {
  BadRequestExceptionNotFoundFile = 'No file uploaded',
}

export const enum OTPServiceMessages {
  BadRequestExceptionSendingOTPFailed = 'Failed to send OTP email.',
  OTPSendingMailSubject = 'OTP Code',
  OTPSentSuccessfully = 'OTP sent successfully.',
  OTPNotFound = 'OTP not found.',
  OTPInvalid = 'Invalid OTP.',
  OTPExpired = 'OTP has expired.',
  OTPAlreadyUsed = 'OTP has already been used.',
  OTPValid = 'OTP is valid.',
}

export const CloudinaryFileUploadMessages = {
  InvalidFile: 'Invalid File.',
  InvalidFileExtention: 'Invalid file extension. Only .png, .jpg, .gif, and .jpeg are allowed.',
  OTPSentSuccessfully: 'OTP sent successfully.',
  OTPNotFound: 'OTP not found.',
  OTPInvalid: 'Invalid OTP.',
  OTPExpired: 'OTP has expired.',
  OTPAlreadyUsed: 'OTP has already been used.',
  OTPValid: 'OTP is valid.',
};

export const enum StripeMessages {
  requiresAction = 'requires_action',
}
