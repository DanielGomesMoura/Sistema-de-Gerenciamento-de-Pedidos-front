import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function minValue(min: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (value === null || value === undefined) {
      return null; // Valor não fornecido
    }

    const parsedValue = parseFloat(value.replace(',', '.'));
    if (isNaN(parsedValue) || parsedValue < min) {
      return { min: { requiredValue: min, actualValue: value } };
    }

    return null; // Validação bem-sucedida
  };
}
