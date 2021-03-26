import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import Constants from "./helpers/constants";
import { Toast } from "primereact/toast";
import { UPDATES } from "./redux-helpers/Types";
import { Link } from "react-router-dom";

export const AppTopbar = (props) => {
    const orders = useSelector((state) => state.orders.filter((_order) => _order.status === Constants.ORDER_STATUS.PLACED));

    const update = useSelector((state) => state.update);

    const toast = useRef(null);

    const dispatch = useDispatch();

    useEffect(() => {
        if (update !== Constants.UPDATE.ORDER_LOADED) {
            dispatch({
                type: UPDATES,
                payload: Constants.UPDATE.ORDER_LOADED,
            });
            toast.current.show({ severity: "success", summary: "Successful", detail: "Order has been placed", life: 2000 });
        }
    }, [update]);

    return (
        <div className="layout-topbar clearfix">
            <Toast ref={toast} />
            <button type="button" className="p-link layout-menu-button" onClick={props.onToggleMenu}>
                <span className="pi pi-bars" />
            </button>
            <div className="layout-topbar-icons">
                <Link to="/unattended/orders">
                    <button type="button" className="p-link">
                        <span className="layout-topbar-item-text">Events</span>
                        <span className="layout-topbar-icon pi pi-calendar" />
                        <span className="layout-topbar-badge">{orders.length}</span>
                    </button>
                </Link>
                <button type="button" className="p-link">
                    <span className="layout-topbar-item-text">Events</span>
                    <span className="layout-topbar-icon pi pi-envelope" />
                    <span className="layout-topbar-badge">{orders.length}</span>
                </button>
                <button type="button" className="p-link">
                    <span className="layout-topbar-item-text">Events</span>
                    <span className="layout-topbar-icon pi pi-comment" />
                    <span className="layout-topbar-badge">{orders.length}</span>
                </button>
            </div>
        </div>
    );
};
