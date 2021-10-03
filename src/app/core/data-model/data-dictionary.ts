export class DataDictionary {

    constructor() { }

    public GetMemberTypeList() {
        return ['Individual', 'Company'];
    }

    public GetCompanyTypeList() {
        return ['Restaurent', 'Hotel', 'School', 'College', 'IT Company'];
    }

    public GetGenderList() {

        return [{ text: ['Male', 'पुरूष'] }, { text: ['Female', 'महिला'] }, { text: ['Other', 'अन्य'] }];

    }

    // public GetMenuTypeList(){
    //     return ['Transaction', 'Option'];
    // }

    public GetMenuTypeList() {
        return [
            { value: 1, viewValue: 'Group' },
            { value: 2, viewValue: 'Option' },
            { value: 3, viewValue: 'Transaction' },
        ];
    }

    public GetTransactionMenuTypeList() {
        return [
            { value: 1, viewValue: 'Admin' },
            { value: 2, viewValue: 'Transaction' },
            { value: 3, viewValue: 'Post' },
            { value: 4, viewValue: 'Report' },

        ];
    }
}
