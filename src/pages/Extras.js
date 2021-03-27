import React, { useState, useEffect, useRef } from "react";
import classNames from "classnames";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { Toolbar } from "primereact/toolbar";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import Constants from "../helpers/constants";
import { useSelector } from "react-redux";

const axios = require("axios");

export const Extras = () => {
    // Items
    let emptyItem = {
        title: null,
        description: null,
        image: null,
        price: null,
    };

    // State
    const [Items, setItems] = useState([]);
    const [Item, setItem] = useState({ ...emptyItem });
    const [editing, setEditing] = useState(false);
    const [ItemDialog, setItemDialog] = useState(false);
    const [deleteItemDialog, setDeleteItemDialog] = useState(false);
    const [deleteItemsDialog, setDeleteItemsDialog] = useState(false);
    const [selectedItems, setSelectedItems] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const [showItem, setShowItem] = useState(false);

    const user = useSelector((state) => state.user);

    //refs
    const toast = useRef(null);
    const dt = useRef(null);

    // Effects
    useEffect(() => {
        axios.get(`${Constants.BASE_URL}/api/extras`).then((res) => {
            console.log(res);
            setItems(res.data.data);
            console.log(Items);
        });
    }, []);

    const openNew = () => {
        setItem(emptyItem);
        setSubmitted(false);
        setItemDialog(true);
    };

    const hideDialog = () => {
        setEditing(false);
        setSubmitted(false);
        setItemDialog(false);
    };

    const hideDeleteItemDialog = () => {
        setDeleteItemDialog(false);
    };

    const hideDeleteItemsDialog = () => {
        setDeleteItemsDialog(false);
    };

    const confirmDeleteItem = (u) => {
        setItem(u);
        setDeleteItemDialog(true);
    };

    const confirmDeleteSelected = () => {
        setDeleteItemsDialog(true);
    };

    const hideShowItemDialog = () => {
        setItem(emptyItem);
        setShowItem(false);
    };

    // Crud
    const saveItem = (e) => {
        e.preventDefault();
        setSubmitted(true);

        const newItem = { extra: Item };
        if (editing) {
            axios
                .put(`${Constants.BASE_URL}/api/extras/${Item.id}`, newItem)
                .then((res) => {
                    const newItems = Items.map((_Item, index) => {
                        if (_Item.id === Item.id) {
                            return res.data.data;
                        }
                        return _Item;
                    });
                    setItems(newItems);
                    setItemDialog(false);
                    setItem(emptyItem);
                    toast.current.show({ severity: "success", summary: "Successful", detail: "Updated Updated", life: 3000 });
                })
                .catch((err) => alert(err.response));
        } else {
            axios
                .post(`${Constants.BASE_URL}/api/extras`, newItem)
                .then((res) => {
                    setItems([...Items, res.data.data]);
                    setItem(res.data.data);
                    // setItems(_Items);
                    setItemDialog(false);
                    setItem(emptyItem);
                    toast.current.show({ severity: "success", summary: "Successful", detail: "Item Updated", life: 3000 });
                })
                .catch((err) => alert(err.response));
        }
    };

    const editItem = (_Item) => {
        setItem({ ..._Item });
        setItemDialog(true);
    };

    const deleteItem = () => {
        axios
            .delete(`${Constants.BASE_URL}/api/extras/${Item.id}`)
            .then(() => {
                let _Items = Items.filter((val) => val.id !== Item.id);

                setItems(_Items);
                setDeleteItemDialog(false);
                setItem(emptyItem);
                toast.current.show({ severity: "success", summary: "Successful", detail: "Extra Deleted", life: 3000 });
            })
            .catch((err) => alert(err.response));
    };

    const deleteSelectedItems = () => {
        let _Items = Items.filter((val) => !selectedItems.includes(val));
        setItems(_Items);
        setDeleteItemsDialog(false);
        setSelectedItems(null);
        toast.current.show({ severity: "success", summary: "Successful", detail: "Extras Deleted", life: 3000 });
    };

    // Templates
    const header = (
        <div className="table-header">
            <h5 className="p-m-0">Manage Extras</h5>
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
    };

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <Button label="New" icon="pi pi-plus" className="p-button-success p-mr-2" onClick={openNew} />
                <Button label="Delete" icon="pi pi-trash" className="p-button-danger" onClick={confirmDeleteSelected} disabled={!selectedItems || !selectedItems.length} />
            </React.Fragment>
        );
    };

    const imageBodyTemplate = (data) => {
        return (
            <>
                <span className="p-column-title">Image</span>
                <img src={`${data}`} alt={data} className="product-image" />
            </>
        );
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <div className="actions">
                <Button
                    icon="pi pi-eye"
                    className="p-button-rounded p-button-info p-mr-2"
                    onClick={() => {
                        setItem(rowData);
                        setShowItem(true);
                    }}
                />
                {user.role?.name == Constants.ROLES.MANAGER && (
                    <Button
                        icon="pi pi-pencil"
                        className="p-button-rounded p-button-success p-mr-2"
                        onClick={() => {
                            setEditing(true);
                            editItem(rowData);
                        }}
                    />
                )}
                {user.role?.name == Constants.ROLES.MANAGER && <Button icon="pi pi-trash" className="p-button-rounded p-button-warning" onClick={() => confirmDeleteItem(rowData)} />}
            </div>
        );
    };

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
        <div className="p-grid crud-demo">
            <div className="p-col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar className="p-mb-4" left={user.role?.name == Constants.ROLES.MANAGER && leftToolbarTemplate} />
                    <DataTable
                        ref={dt}
                        value={Items}
                        selection={selectedItems}
                        onSelectionChange={(e) => setSelectedItems(e.value)}
                        dataKey="id"
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25]}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} Items"
                        globalFilter={globalFilter}
                        emptyMessage="No Items found."
                        header={header}
                    >
                        <Column selectionMode="multiple" headerStyle={{ width: "3rem" }} />
                        <Column
                            field="Title"
                            header="Title"
                            sortable
                            body={(data) => {
                                return bodyTemplate(data.title, "Title");
                            }}
                        />
                        <Column
                            field="emp_id"
                            header="Description"
                            sortable
                            body={(data) => {
                                return bodyTemplate(data.description, "Description");
                            }}
                        />
                        <Column
                            field="emp_id"
                            header="Image"
                            body={(data) => {
                                return imageBodyTemplate(data.image);
                            }}
                        />
                        <Column
                            field="emp_id"
                            header="Price"
                            sortable
                            body={(data) => {
                                return bodyTemplate(`R${data.price}`, "Price");
                            }}
                        />
                        <Column body={actionBodyTemplate} />
                    </DataTable>

                    <Dialog visible={ItemDialog} style={{ width: "50vw" }} header="Item Details" modal className="p-fluid" footer={ItemDialogFooter} onHide={hideDialog}>
                        <div className="row">
                            <div className="col-md-12">
                                <div className="p-field">
                                    <label htmlFor="first_name">Title</label>
                                    <InputText
                                        autoFocus
                                        id="first_name"
                                        value={Item.title}
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            let newItem = { ...Item, title: val };
                                            setItem(newItem);
                                            console.log(Item);
                                        }}
                                        required
                                        className={classNames({ "p-invalid": submitted && !Item.title })}
                                    />
                                    {submitted && !Item.title && <small className="p-invalid">Title is required.</small>}
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-12">
                                <div className="p-field">
                                    <label htmlFor="emp_id">Description</label>
                                    <InputText
                                        id="emp_id"
                                        value={Item.description}
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            let newItem = { ...Item, description: val };
                                            setItem(newItem);
                                            console.log(Item);
                                        }}
                                        required
                                        className={classNames({ "p-invalid": submitted && !Item.description })}
                                    />
                                    {submitted && !Item.description && <small className="p-invalid">Description is required.</small>}
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-12">
                                <div className="p-field">
                                    <label htmlFor="street_name">Image Url</label>
                                    <InputText
                                        id="street_name"
                                        value={Item.image}
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            let newItem = { ...Item, image: val };
                                            setItem(newItem);
                                            console.log(Item);
                                        }}
                                        required
                                        className={classNames({ "p-invalid": submitted && !Item.image })}
                                    />
                                    {submitted && !Item.image && <small className="p-invalid">Image url is required.</small>}
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-12">
                                <div className="p-field">
                                    <label htmlFor="street_name">Price</label>
                                    <InputText
                                        id="street_name"
                                        value={Item.price}
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            let newItem = { ...Item, price: val };
                                            setItem(newItem);
                                            console.log(Item);
                                        }}
                                        required
                                        className={classNames({ "p-invalid": submitted && !Item.price })}
                                    />
                                    {submitted && !Item.price && <small className="p-invalid">Price is required.</small>}
                                </div>
                            </div>
                        </div>
                    </Dialog>

                    <Dialog visible={deleteItemDialog} style={{ width: "450px" }} header="Confirm" modal footer={deleteItemDialogFooter} onHide={hideDeleteItemDialog}>
                        <div className="confirmation-content">
                            <i className="pi pi-exclamation-triangle p-mr-3" style={{ fontSize: "2rem" }} />
                            {Item && (
                                <span>
                                    Are you sure you want to delete <b>{Item.name}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteItemsDialog} style={{ width: "450px" }} header="Confirm" modal footer={deleteItemsDialogFooter} onHide={hideDeleteItemsDialog}>
                        <div className="confirmation-content">
                            <i className="pi pi-exclamation-triangle p-mr-3" style={{ fontSize: "2rem" }} />
                            {Items && <span>Are you sure you want to delete the selected employees?</span>}
                        </div>
                    </Dialog>
                    <Dialog visible={showItem} style={{ width: "450px" }} header="View Extra" modal onHide={hideShowItemDialog}>
                        <div className="p-2">
                            <div className="row">
                                <img className="img-fluid" src={Item.image} />
                            </div>
                            <div className="row pt-0 mt-2">
                                <h4>
                                    <b>{Item.title}</b>
                                </h4>
                            </div>
                            <div className="row pt-0 mt-0">
                                <h6 className="pt-0 mt-0">{Item.description}</h6>
                            </div>
                            <div className="row pt-0 mt-0">
                                <h6 className="pt-0 mt-0">
                                    <b>Price: {`R${Item.price}`}</b>
                                </h6>
                            </div>
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};
