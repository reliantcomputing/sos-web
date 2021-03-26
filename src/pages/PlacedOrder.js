import React, { useState, useRef, useEffect } from "react";
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
import TimeAgo from "react-timeago";
import { InputTextarea } from "primereact/inputtextarea";

const axios = require("axios");

export const PlacedOrders = () => {
    const orderChannel = useSelector((state) => state.channels.orderChannel);

    // Items
    let emptyItem = {
        rejected: null,
        rejected_reason: null,
        status: null,
    };

    // State
    const Items = useSelector((state) => state.orders.filter((_order) => _order.status === Constants.ORDER_STATUS.PLACED));
    const [Item, setItem] = useState({ ...emptyItem });
    const [editing, setEditing] = useState(false);
    const [ItemDialog, setItemDialog] = useState(false);
    const [deleteItemDialog, setDeleteItemDialog] = useState(false);
    const [deleteItemsDialog, setDeleteItemsDialog] = useState(false);
    const [selectedItems, setSelectedItems] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const [showItem, setShowItem] = useState(false);
    const [showProvideReason, setShowProvideReason] = useState(false);
    const [reason, setReason] = useState("");

    useEffect(() => {
        console.log(Items);
        if (Item.id) {
            const _item = Items.find((it) => it.id === Item.id);
            setItem(_item);
        }
    }, [Items]);

    //refs
    const toast = useRef(null);
    const dt = useRef(null);

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

    const hideRejectItemDialog = () => {
        setShowProvideReason(false);
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
                    setItemDialog(false);
                    setItem(emptyItem);
                    toast.current.show({ severity: "success", summary: "Successful", detail: "Updated Updated", life: 3000 });
                })
                .catch((err) => alert(err.response));
        } else {
            axios
                .post(`${Constants.BASE_URL}/api/extras`, newItem)
                .then((res) => {
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
                setDeleteItemDialog(false);
                setItem(emptyItem);
                toast.current.show({ severity: "success", summary: "Successful", detail: "Extra Deleted", life: 3000 });
            })
            .catch((err) => alert(err.response));
    };

    const deleteSelectedItems = () => {
        let _Items = Items.filter((val) => !selectedItems.includes(val));
        setDeleteItemsDialog(false);
        setSelectedItems(null);
        toast.current.show({ severity: "success", summary: "Successful", detail: "Extras Deleted", life: 3000 });
    };

    // Templates
    const header = (
        <div className="table-header">
            <h5 className="p-m-0">
                <b>Manage Unattended Orders</b>
            </h5>
            <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Search..." />
            </span>
        </div>
    );

    const bodyTemplate = (content, title) => {
        return (
            <>
                <b>{content}</b>
            </>
        );
    };

    const bodyPriceTemplate = (content, title) => {
        return (
            <>
                <b>{content}</b>
            </>
        );
    };

    const renderPrice = () => {
        let price = 0;
        if (Item.id) {
            Item.extras.forEach((e) => {
                price = price + parseFloat(e.qty * e.extra.price);
            });
            Item.menus.forEach((e) => {
                price = price + parseFloat(e.qty * e.menu.price);
            });
        }
        return (
            <>
                Total Price: <b>&nbsp;R{price}</b>
            </>
        );
    };

    const bodyTimeTemplate = (content, title) => {
        return (
            <>
                <TimeAgo date={new Date(content)} />
            </>
        );
    };

    const bodyStatusTemplate = (rowData, title) => {
        return (
            <>
                {rowData.status === Constants.ORDER_STATUS.APPROVED ? <span className="badge badge-success p-2">{rowData.status}</span> : ""}
                {rowData.status === Constants.ORDER_STATUS.REJECTED ? <span className="badge badge-danger p-2">{rowData.status}</span> : ""}
                {rowData.status === Constants.ORDER_STATUS.PLACED ? <span className="badge badge-warning p-2">{rowData.status}</span> : ""}
            </>
        );
    };

    const bodyOrderStatusTemplate = () => {
        return (
            <>
                {Item.status === Constants.ORDER_STATUS.APPROVED ? (
                    <div>
                        Order #{Item.id + " "}
                        <span className="badge badge-success p-2">{Item.status}</span>
                    </div>
                ) : (
                    ""
                )}
                {Item.status === Constants.ORDER_STATUS.REJECTED ? (
                    <div>
                        Order #{Item.id + " "}
                        <span className="badge badge-danger p-2">{Item.status}</span>
                    </div>
                ) : (
                    ""
                )}
                {Item.status === Constants.ORDER_STATUS.PLACED ? (
                    <div>
                        Order #{Item.id + " "}
                        <span className="badge badge-warning p-2">{Item.status}</span>
                    </div>
                ) : (
                    ""
                )}
            </>
        );
    };

    const leftOrderToolbarTemplate = () => {
        return (
            <React.Fragment>
                <Button
                    disabled={Item.status === Constants.ORDER_STATUS.APPROVED}
                    label="Approve"
                    className="p-button-success p-mr-2"
                    onClick={() => {
                        console.log("Button clicked");
                        const payload = {
                            rejected: false,
                            status: Constants.ORDER_STATUS.APPROVED,
                        };
                        orderChannel.push(`approve:order:${Item.id}`, payload);
                    }}
                />
                <Button
                    label="Reject"
                    className="p-button-danger"
                    onClick={() => {
                        setShowProvideReason(true);
                    }}
                    disabled={Item.rejected}
                />
            </React.Fragment>
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
            </div>
        );
    };

    const actionOrderBodyTemplate = (rowData) => {
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

    const rejectItemDialogFooter = (
        <>
            <Button
                label="No"
                icon="pi pi-times"
                className="p-button-text"
                onClick={() => {
                    setShowProvideReason(false);
                }}
            />
            <Button
                label="Reject"
                icon="pi pi-check"
                className="p-button-text"
                onClick={() => {
                    if (reason !== "") {
                        const payload = {
                            rejected: true,
                            status: Constants.ORDER_STATUS.REJECTED,
                            rejected_reason: reason,
                        };
                        orderChannel.push(`reject:order:${Item.id}`, payload);
                        setShowProvideReason(false);
                    }
                }}
            />
        </>
    );

    return (
        <div className="p-grid crud-demo">
            <div className="p-col-12">
                <div className="card">
                    <Toast ref={toast} />
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
                            field="menus"
                            header="Menus Qty"
                            sortable
                            body={(data) => {
                                return bodyTemplate(data.menus.length, "Menus");
                            }}
                        />
                        <Column
                            field="extras"
                            header="Extras Qty"
                            sortable
                            body={(data) => {
                                return bodyTemplate(data.extras.length, "Description");
                            }}
                        />
                        <Column
                            field="status"
                            header="Status"
                            sortable
                            body={(data) => {
                                return bodyStatusTemplate(data, "Description");
                            }}
                        />
                        <Column
                            field="emp_id"
                            header="Total price"
                            sortable
                            body={(data) => {
                                let price = 0;
                                data.extras.forEach((e) => {
                                    price = price + parseFloat(e.extra.price);
                                });
                                data.menus.forEach((e) => {
                                    price = price + parseFloat(e.menu.price);
                                });
                                return bodyTemplate(`R${price}`, "Price");
                            }}
                        />
                        <Column
                            field="inserted_at"
                            header="Order placed"
                            sortable
                            body={(data) => {
                                return bodyTimeTemplate(data.inserted_at, "Placed");
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

                    <Dialog visible={showProvideReason} style={{ width: "450px" }} header="Order Rejection Reason" modal footer={rejectItemDialogFooter} onHide={hideDeleteItemDialog}>
                        <div className="confirmation-content">
                            <InputTextarea
                                className="form-control"
                                placeholder="Provide rejection reason"
                                value={reason}
                                onChange={(e) => {
                                    setReason(e.target.value);
                                }}
                            />
                        </div>
                    </Dialog>

                    <Dialog visible={deleteItemsDialog} style={{ width: "450px" }} header="Confirm" modal footer={deleteItemsDialogFooter} onHide={hideDeleteItemsDialog}>
                        <div className="confirmation-content">
                            <i className="pi pi-exclamation-triangle p-mr-3" style={{ fontSize: "2rem" }} />
                            {Items && <span>Are you sure you want to delete the selected employees?</span>}
                        </div>
                    </Dialog>
                    <Dialog visible={showItem} style={{ width: "50vw" }} header={bodyOrderStatusTemplate} modal onHide={hideShowItemDialog}>
                        <div className="p-2">
                            <div className="row px-3 pt-1 pr-1">
                                {Item.status === Constants.ORDER_STATUS.REJECTED ? (
                                    <span className="badge badge-warning p-2">
                                        <b style={{ fontSize: 15 }}>{Item.rejected_reason}</b>
                                    </span>
                                ) : (
                                    ""
                                )}
                            </div>
                            <div className="row p-3">
                                <DataTable ref={dt} value={Item.menus} header="Menu">
                                    <Column
                                        field="emp_id"
                                        header=""
                                        body={(data) => {
                                            return imageBodyTemplate(data.menu.image);
                                        }}
                                    />
                                    <Column
                                        field="Title"
                                        header=""
                                        body={(data) => {
                                            return bodyTemplate(data.menu.title, "Title");
                                        }}
                                    />
                                    <Column
                                        field="emp_id"
                                        header="Qty"
                                        body={(data) => {
                                            return bodyTemplate(data.qty, "Qty");
                                        }}
                                    />
                                    <Column
                                        field="emp_id"
                                        header="Price"
                                        body={(data) => {
                                            return bodyPriceTemplate(`R${data.menu.price}`, "Price");
                                        }}
                                    />
                                    <Column
                                        field="emp_id"
                                        header="Total Price"
                                        body={(data) => {
                                            return bodyPriceTemplate(`R${data.qty * data.menu.price}`, "Price");
                                        }}
                                    />
                                </DataTable>
                            </div>
                            <div className="row mt-3 p-3">
                                <DataTable ref={dt} value={Item.extras} header="Extras">
                                    <Column
                                        field="emp_id"
                                        header=""
                                        body={(data) => {
                                            return imageBodyTemplate(data.extra.image);
                                        }}
                                    />
                                    <Column
                                        field="Title"
                                        header=""
                                        body={(data) => {
                                            return bodyTemplate(data.extra.title, "Title");
                                        }}
                                    />
                                    <Column
                                        field="emp_id"
                                        header="Qty"
                                        body={(data) => {
                                            return bodyTemplate(data.qty, "Qty");
                                        }}
                                    />
                                    <Column
                                        field="emp_id"
                                        header="Price"
                                        body={(data) => {
                                            return bodyPriceTemplate(`R${data.extra.price}`, "Price");
                                        }}
                                    />
                                    <Column
                                        field="emp_id"
                                        header="Total Price"
                                        body={(data) => {
                                            return bodyPriceTemplate(`R${data.qty * data.extra.price}`, "Price");
                                        }}
                                    />
                                </DataTable>
                            </div>
                            <div className="row p-3">{renderPrice()}</div>
                            <Toolbar className="p-mb-4" left={leftOrderToolbarTemplate} />
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};
