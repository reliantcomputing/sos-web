import React, {useState, useEffect, useRef} from 'react';
import classNames from 'classnames';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import Constants from "../helpers/constants";
import {Form} from "react-bootstrap";

const axios = require('axios')

export const Sits = () => {

    // Items
    let emptyItem = {
        sit_number: null,
    };

    // State
    const [Items, setItems] = useState([])
    const [Item, setItem] = useState({...emptyItem})
    const [editing, setEditing] = useState(false)
    const [ItemDialog, setItemDialog] = useState(false);
    const [deleteItemDialog, setDeleteItemDialog] = useState(false);
    const [deleteItemsDialog, setDeleteItemsDialog] = useState(false);
    const [selectedItems, setSelectedItems] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);

    //refs
    const toast = useRef(null);
    const dt = useRef(null);

    // Effects
    useEffect(() => {
        axios.get(`${Constants.BASE_URL}/api/sits`).then(res => {
            console.log(res)
            setItems(res.data.data)
            console.log(Items)
        })
    }, []);

    const openNew = () => {
        setItem(emptyItem);
        setSubmitted(false);
        setItemDialog(true);
    }

    const hideDialog = () => {
        setEditing(false)
        setSubmitted(false);
        setItemDialog(false);
    }

    const hideDeleteItemDialog = () => {
        setDeleteItemDialog(false);
    }

    const hideDeleteItemsDialog = () => {
        setDeleteItemsDialog(false);
    }

    const confirmDeleteItem = (u) => {
        setItem(u);
        setDeleteItemDialog(true);
    }

    const confirmDeleteSelected = () => {
        setDeleteItemsDialog(true);
    }

    // Crud
    const saveItem = (e) => {
        e.preventDefault()
        setSubmitted(true);

        const newItem = {sit: Item}
        if (editing){
            axios.put(`${Constants.BASE_URL}/api/sits/${Item.id}`, newItem).then(res => {
                const newItems = Items.map((_Item, index) => {
                    if (_Item.id === Item.id){
                        return res.data.data
                    }
                    return _Item
                })
                setItems(newItems)
                setItemDialog(false);
                setItem(emptyItem);
                toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Updated Updated', life: 3000 });
            }).catch(err => alert(err.response))
        }else{
            axios.post(`${Constants.BASE_URL}/api/sits`, newItem).then(res => {
                setItems([...Items, res.data.data])
                setItem(res.data.data)
                // setItems(_Items);
                setItemDialog(false);
                setItem(emptyItem);
                toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Item Updated', life: 3000 });
            }).catch(err => alert(err.response))
        }
    }

    const editItem = (_Item) => {
        setItem({ ..._Item });
        setItemDialog(true);
    }

    const deleteItem = () => {
        axios.delete(`${Constants.BASE_URL}/api/sits/${Item.id}`).then(res => {
            let _Items = Items.filter(val => val.id !== Item.id);

            setItems(_Items);
            setDeleteItemDialog(false);
            setItem(emptyItem);
            toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Employee Deleted', life: 3000 });
        }).catch(err => alert(err.response))
    }

    const deleteSelectedItems = () => {
        let _Items = Items.filter(val => !selectedItems.includes(val));
        setItems(_Items);
        setDeleteItemsDialog(false);
        setSelectedItems(null);
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Items Deleted', life: 3000 });
    }

    // Templates
    const header = (
        <div className="table-header">
            <h5 className="p-m-0">Manage Employees</h5>
            <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Search..." />
            </span>
        </div>
    );

    const bodyTemplate = (content, title) => {
        return (
            <>
                <span className="p-column-title">{title}</span>
                {content}
            </>
        );
    }

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <Button label="New" icon="pi pi-plus" className="p-button-success p-mr-2" onClick={openNew} />
                <Button label="Delete" icon="pi pi-trash" className="p-button-danger" onClick={confirmDeleteSelected} disabled={!selectedItems || !selectedItems.length} />
            </React.Fragment>
        )
    }

    const actionBodyTemplate = (rowData) => {
        return (
            <div className="actions">
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success p-mr-2" onClick={() => {
                    setEditing(true)
                    editItem(rowData)
                }} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-warning" onClick={() => confirmDeleteItem(rowData)} />
            </div>
        );
    }

    const ItemDialogFooter = (
        <>
            <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label="Save" icon="pi pi-check" className="p-button-text" onClick={saveItem} />
        </>
    );
    const deleteItemDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteItemDialog} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteItem} />
        </>
    );
    const deleteItemsDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteItemsDialog} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteSelectedItems} />
        </>
    );

    return (
        <div className='p-grid crud-demo'>
            <div className='p-col-12'>
                <div className='card'>
                    <Toast ref={toast} />
                    <Toolbar className="p-mb-4" left={leftToolbarTemplate}/>
                    <DataTable ref={dt} value={Items} selection={selectedItems} onSelectionChange={(e) => setSelectedItems(e.value)}
                               dataKey="id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]} className="datatable-responsive"
                               paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                               currentPageReportTemplate="Showing {first} to {last} of {totalRecords} Items"
                               globalFilter={globalFilter} emptyMessage="No Items found." header={header}>
                        <Column selectionMode="multiple" headerStyle={{ width: '3rem' }}/>
                        <Column field="emp_id" header="Sit Number" sortable body={(data) => {
                            return bodyTemplate(data.sit_number, 'Sit Number')
                        }}/>
                        <Column body={actionBodyTemplate}/>
                    </DataTable>

                    <Dialog visible={ItemDialog} style={{ width: '50vw' }} header="Sit Details" modal className="p-fluid" footer={ItemDialogFooter} onHide={hideDialog}>
                        <div className='row'>
                            <div className='col-md-12'>
                                <div className="p-field">
                                    <label htmlFor="first_name">Sit Number</label>
                                    <InputText autoFocus id="first_name" value={Item.sit_number} onChange={(e) => {
                                        const val = e.target.value
                                        let newItem = {...Item, sit_number: val}
                                        setItem(newItem)
                                    }} required className={classNames({ 'p-invalid': submitted && !Item.sit_number })} />
                                    {submitted && !Item.sit_number && <small className="p-invalid">Sit number is required.</small>}
                                </div>
                            </div>
                        </div>
                    </Dialog>

                    <Dialog visible={deleteItemDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteItemDialogFooter} onHide={hideDeleteItemDialog}>
                        <div className="confirmation-content">
                            <i className="pi pi-exclamation-triangle p-mr-3" style={{ fontSize: '2rem' }} />
                            {Item && <span>Are you sure you want to delete sit: <b>{Item.sit_number}</b>?</span>}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteItemsDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteItemsDialogFooter} onHide={hideDeleteItemsDialog}>
                        <div className="confirmation-content">
                            <i className="pi pi-exclamation-triangle p-mr-3" style={{ fontSize: '2rem' }} />
                            {Items && <span>Are you sure you want to delete the selected sits?</span>}
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    )
}
