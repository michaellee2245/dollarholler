import supabase from "$lib/utils/supabase";
import { writable } from "svelte/store";
import { displayErrorMessage } from "$lib/utils/handleError";
import { snackbar } from "./SnackbarStore";


export const invoices = writable<Invoice[]>([]);

export const loadInvoices = async () => {

    const { data, error } = await supabase
        .from('invoice')
        .select('*, client(id, name), lineItems(*)')
    console.log(data)

    if (error) {
        console.error(error)
        return
    }

    invoices.set(data as Invoice[])
}

export const addInvoice = async (invoiceToAdd: Invoice) => {

    const { lineItems, client, ...newInvoice } = invoiceToAdd

    // add the invoice to Supabase
    const invoiceResults = await supabase
        .from('invoice')
        .insert([
            { ...newInvoice, clientId: client.id },
        ])
        .select()

    if (invoiceResults.error) {
        displayErrorMessage(invoiceResults.error as Error)
        return;

    }
    // get the invoice ID
    const invoiceId = invoiceResults.data[0].id;
    // loop over all the line items and add the invoice ID
    const isSuccessful = await addLineItems(lineItems, invoiceId)
    if (!isSuccessful) return;


    // update the store
    invoices.update((prev: Invoice[]) => [...prev, { ...invoiceToAdd, id: invoiceId }])
    snackbar.send({
        message: 'Your invoice was successfully created.',
        type: 'success'
    });
    return invoiceToAdd;
}

const deleteLineItems = async (invoiceId: string): Promise<boolean> => {

    let isSuccessful = true

    const { data, error } = await supabase
        .from('lineItems')
        .delete()
        .eq('invoiceId', invoiceId)

    if (error) {
        displayErrorMessage(error as Error)
        isSuccessful = false;
    }
    return isSuccessful;
}

const addLineItems = async (lineItems: LineItem[] | undefined, invoiceId: string): Promise<boolean> => {
    let isSuccessful = true;

    if (lineItems && lineItems.length > 0) {
        const newLineItems = lineItems.map((lineItem: LineItem) => ({ ...lineItem, invoiceId }))
        // add the line items to Supabase
        const lineItemsResults = await supabase
            .from('lineItems')
            .insert(newLineItems)

        if (lineItemsResults.error) {
            displayErrorMessage(lineItemsResults.error as Error)
            isSuccessful = false
        }
    }
    return isSuccessful;
}

export const updateInvoice = async (invoiceToUpdate: Invoice) => {
    const { lineItems, client, ...updatedInvoice } = invoiceToUpdate

    // delete all line items
    let isSuccessful = await deleteLineItems(invoiceToUpdate.id)
    if (!isSuccessful) return;

    // add new line items
    isSuccessful = await addLineItems(lineItems, invoiceToUpdate.id)
    if (!isSuccessful) return;

    // update invoice within Supabase
    const { data, error } = await supabase
        .from('invoice')
        .update({ ...updateInvoice, clientId: client.id })
        .eq('id', updatedInvoice.id)

    if (error) {
        displayErrorMessage(error as Error)
        return;
    }

    // update the store
    invoices.update((prev: Invoice[]) => prev.map((cur: Invoice) => cur.id === invoiceToUpdate.id ? invoiceToUpdate : cur))

    // display success message
    snackbar.send({
        message: 'Your invoice was successfully updated',
        type: "success"
    })

    return invoiceToUpdate;


}

export const deleteInvoice = async (invoiceToDelete: Invoice) => {
    // Delete all of our line items
    const isSuccessful = await deleteLineItems(invoiceToDelete.id)
    // delete the invoice 
    const { data, error } = await supabase
        .from('invoice')
        .delete()
        .eq('id', invoiceToDelete.id)

    if (error) {
        displayErrorMessage(error as Error);
        return;
    }
    //update the store
    invoices.update((prev: Invoice[]) => prev.filter((cur: Invoice) => cur.id !== invoiceToDelete.id))
    snackbar.send({
        message: "Your invoice was successfully deleted",
        type: "success"
    })

    return invoiceToDelete;
}

export const getInvoiceById = async (id: string) => {
    const { data, error } = await supabase
        .from('invoice')
        .select('*, client(id, name), lineItems(*)')
        .eq('id', id)

    if (error) {
        console.error(error);
    }

    if (data && data[0]) return data[0] as Invoice;

    console.warn('cannot find invoice with id: ' + id);
}