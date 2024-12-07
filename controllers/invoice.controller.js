const Customer = require('../lib/models/customer.model');
const Invoice = require('../lib/models/invoice.model');
const { USDollar } = require('../libs/formatter');
const { body, validationResult } = require('express-validator');

const validateInvoice = [
    body('customer', 'Select the Customer').notEmpty(),
    body('amount', 'Amount must not be empty').notEmpty(),
    body('date', 'Due Date must not be empty').notEmpty(),
    body('status', 'Select the Status').notEmpty(),
]

const populateInvoices = query => {
    return query
    .populate({
        path: 'customer',
        model: Customer,
        select: '_id name',
            })
};

const showInvoices = async (req, res) => {
    const query = { owner: req.session.userId };
    const invoices = await Invoice.find(query);
    res.render('pages/invoices', {
        title: 'Invoices',
        type: 'data',
        invoices,
        USDollar, // <<<<<
        info: req.flash('info')[0],
    });
}; 


const createInvoice = async (req, res) => {
const validationErrors = validationResult(req);
if (!validationErrors.isEmpty()) {
const errors = validationErrors.array();
req.flash('errors', errors);
req.flash('data', req.body);
return res.redirect('create');
}
const newInvoice = req.body;
newInvoice.owner = req.session.userId;
await Invoice.create(newInvoice);
req.flash('info', {
message: 'New Invoice Created',
type: 'success'
});res.redirect('/dashboard/invoices');
};

const editInvoice = async (req, res) => {
const invoiceId = req.params.id;
const invoice = await populateInvoices(Invoice.findById(invoiceId));
const { customers } = req;
res.render('pages/invoices', {
title: 'Edit Invoice',
type: 'form',
formAction: 'edit',
customers,
invoice: req.flash('data')[0] || invoice,
errors: req.flash('errors'),
});
};

const updateInvoice = async (req, res) => {
const validationErrors = validationResult(req);
if (!validationErrors.isEmpty()) {
const errors = validationErrors.array();
req.flash('errors', errors);
req.flash('data', req.body);
return res.redirect('edit');
}
const invoiceId = req.params.id;
const data = req.body;
await Invoice.findByIdAndUpdate(invoiceId, data)
req.flash('info', {
message: 'Invoice Updated',
type: 'sucess'
});
res.redirect('/dashboard/invoices');
};

const getCustomers = async (req, res, next) => {
const customersQuery = { owner: req.session.userId };
const customers = await Customer.find(customersQuery);
req.customers = customers;
next();
};

const deleteInvoice = async (req, res) => {
const invoiceId = req.params.id
await Invoice.findByIdAndDelete(invoiceId);
req.flash('info', {
message: 'Invoice Deleted',
type: 'success'
});
res.redirect('/dashboard/invoices');
};



const invoices = await populateInvoices(Invoice.find(query));

module.exports = {
showInvoices,editInvoice,
deleteInvoice,
updateInvoice,
createInvoice,
getCustomers,
validateInvoice
};
