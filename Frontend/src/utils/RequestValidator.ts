class ValueValidator {
  /**
   * @returns error if value is falsy (e.g. undefined, null, []) or not the specified type
   */
  validate<T>(value: T): void
  validate<T>(value: T[]): void

  validate<T>(value: unknown) {
    if (Array.isArray(value) && value.length === 0) {
      throw new Error('ARRAY_EMPTY')
    } else if (value === undefined || value === null) {
      throw new Error('VALUE_FALSY')
    }
  }
}

const valueValidator = new ValueValidator()
export default valueValidator
