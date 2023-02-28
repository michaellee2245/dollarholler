/*
    * This takes all of the items and adds them up
    * @param {Array | undefined} lineItems
    * @returns {number}
*/
export const sumLineItems = (lineItems: LineItem[] | undefined): number => {
    if (!lineItems) return 0;

    return lineItems.reduce((prevValue, curValue) => prevValue + curValue.amount, 0)
}

/*
    * Takes and returns a dollar amount (USD), formatted with commas and 2 decimals places
    * @param {number} cents
    * @returns {string}
*/

export const centsToDollars = (cents: number): string => {
    const dollars = cents / 100;
    const addDecimals = twoDecimals(dollars);
    return addThousandsSeparator(addDecimals);
}

/*
    * Takes a number and returns the number with 2 decimal places
    * @param {number} myNum
    * @returns {string}
*/

export const twoDecimals = (myNum: number): string => {
    return myNum.toFixed(2)

}

/*
    * Adds a thousands separator to our string
    * @param {string} myNum
    * @returns {string}
*/

export const addThousandsSeparator = (myNum: string): string => {
    return myNum.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}

/*
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