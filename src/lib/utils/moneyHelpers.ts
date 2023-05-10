/*
    * This takes all of the items and adds them up
    * @param {Array | undefined} lineItems
    * @returns {number}
*/
export const sumLineItems = (lineItems: LineItem[] | undefined): number => {
    if (!lineItems) return 0;

    return lineItems.reduce((prevValue, curValue) => prevValue + curValue.amount, 0)
}

/** 
    * Converting Cents to Dollars without commas
    * @param {number} cents
    * @returns {string}
*/

export const centsToDollarsWithoutCommas = (cents: number): string => {
    const dollars = cents / 100;
    return twoDecimals(dollars);

}


/** 
* Takes the lineItems and the discount and determines the invoice total
* @param {Array|undefined} lineItems - Brief description of the parameter here. Note: For other notations of data types, please refer to JSDocs: DataTypes command.
* @param {number|undefined} discount - Brief description of the parameter here. Note: For other notations of data types, please refer to JSDocs: DataTypes command.
* @return {number} Brief description of the returning value here.
*/


export const invoiceTotal = (lineItems: LineItem[] | undefined, discount: number | undefined): number => {
    const lineItemSum = sumLineItems(lineItems)
    if (discount) {
        const invoiceDiscount = lineItemSum * (discount / 100);
        return lineItemSum - invoiceDiscount;
    }
    return lineItemSum
}


/**
    * Takes and returns a dollar amount (USD), formatted with commas and 2 decimals places
    * @param {number} cents
    * @returns {string}
*/

export const centsToDollars = (cents: number): string => {
    const dollars = cents / 100;
    const addDecimals = twoDecimals(dollars);
    return addThousandsSeparator(addDecimals);
}
/** 
* Takes a dollar amount and converts it to cents

* @param {number} dollars - Brief description of the parameter here. Note: For other notations of data types, please refer to JSDocs: DataTypes command.
* @return {number} Brief description of the returning value here.
*/

export const dollarsToCents = (dollars: number): number => {
    return dollars * 100;
}
/**
    * Takes a number and returns the number with 2 decimal places
    * @param {number} myNum
    * @returns {string}
*/

export const twoDecimals = (myNum: number): string => {
    return myNum.toFixed(2)

}

/**
    * Adds a thousands separator to our string
    * @param {string} myNum
    * @returns {string}
*/

export const addThousandsSeparator = (myNum: string): string => {
    return myNum.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}

/**
    * Takes all the invoices and finds the total
    * @param {Invoice} invoices
    * @returns {number}
*/

export const sumInvoices = (invoices: Invoice[] | undefined): number => {
    if (!invoices) return 0;

    return invoices.reduce((prevValue, curValue) => {
        const invoiceSum = sumLineItems(curValue.lineItems);
        return prevValue + invoiceSum;
    }, 0)
}