const appMessages = {
  'AUTH-0001': 'Account created successfully',
  'AUTH-0002': 'Account creation unsuccessful',
  'AUTH-0003': 'Invalid Access token',
  'AUTH-0004': 'Invalid Refresh token',
  'AUTH-0005': 'Login successful',
  'AUTH-0006': 'Valid Access token',
  'AUTH-0007': 'Valid Refresh token',
  'VAL-0001': 'Body not sent',
}

export default function codeToMessage(code) {
  return appMessages[code]
}
