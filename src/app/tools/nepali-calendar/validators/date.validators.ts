import { FormControl } from '@angular/forms';

export function DateRangeValidator(required: boolean, maxDate: Date, minDate: Date) {

    return (c: FormControl) => {

        let requiredErr: any;
        let rangeErr: any;
        if (required) {
            if (c.value === '' || c.value === undefined || c.value === null) {
                requiredErr = {

                    message: 'Date is required'

                };
                return requiredErr;
            }
        }

        if (maxDate !== undefined || minDate !== undefined) {
            if (new Date(c.value) > maxDate || new Date(c.value) < minDate) {

                rangeErr = {

                    message: 'Range Error'
                };
                return rangeErr;
            }

        }
        return null;
    };
}
