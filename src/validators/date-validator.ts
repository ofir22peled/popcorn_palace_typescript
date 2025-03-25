import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

/**
 * Validates that the decorated date property is after another specified date property.
 * 
 * @param property - The name of the property to compare with
 * @param validationOptions - Optional validation settings
 */
export function IsEndDateAfterStartDate(
  property: string,
  validationOptions?: ValidationOptions,
) {
  return (object: Object, propertyName: string) => {
    registerDecorator({
      name: 'isEndDateAfterStartDate',
      target: object.constructor,
      propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          const relatedValue = (args.object as any)[relatedPropertyName];
          return (
            value instanceof Date &&
            relatedValue instanceof Date &&
            value > relatedValue
          );
        },
        defaultMessage(args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          return `${args.property} must be later than ${relatedPropertyName}`;
        },
      },
    });
  };
}
