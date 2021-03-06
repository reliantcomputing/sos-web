import React, { useState, useEffect, useRef } from "react";
import classNames from "classnames";
import { Route, useHistory } from "react-router-dom";
import { CSSTransition } from "react-transition-group";

import PrimeReact from "primereact/api";

import "bootstrap/dist/css/bootstrap.min.css";

import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";
import "prismjs/themes/prism-coy.css";
import "@fullcalendar/core/main.css";
import "@fullcalendar/daygrid/main.css";
import "@fullcalendar/timegrid/main.css";
import "../layout/flags/flags.css";
import "../layout/layout.scss";
import "../App.scss";
import { useDispatch, useSelector } from "react-redux";
import { Login } from "./Login";
import { AppTopbar } from "../AppTopbar";
import { AppProfile } from "../AppProfile";
import { AppMenu } from "../AppMenu";
import { AppConfig } from "../AppConfig";
import { Orders } from "./Orders";
import { Employees } from "./Employees";
import { Chat } from "./Chat";
import { Extras } from "./Extras";
import { Menus } from "./Menus";
import { EmptyPage } from "./EmptyPage";
import { AppFooter } from "../AppFooter";
import { Sits } from "./Sits";
import { PlacedOrders } from "./PlacedOrder";
import Constants from "../helpers/constants";

const Main = () => {
    const [layoutMode, setLayoutMode] = useState("static");
    const [layoutColorMode, setLayoutColorMode] = useState("dark");
    const [staticMenuInactive, setStaticMenuInactive] = useState(false);
    const [overlayMenuActive, setOverlayMenuActive] = useState(false);
    const [mobileMenuActive, setMobileMenuActive] = useState(false);
    const [inputStyle, setInputStyle] = useState("outlined");
    const [ripple, setRipple] = useState(false);
    const sidebar = useRef();
    const user = useSelector((state) => state.user);

    const history = useHistory();

    let menuClick = false;

    useEffect(() => {
        if (mobileMenuActive) {
            addClass(document.body, "body-overflow-hidden");
        } else {
            removeClass(document.body, "body-overflow-hidden");
        }
    }, [mobileMenuActive]);

    const onInputStyleChange = (inputStyle) => {
        setInputStyle(inputStyle);
    };

    const onRipple = (e) => {
        PrimeReact.ripple = e.value;
        setRipple(e.value);
    };

    const onLayoutModeChange = (mode) => {
        setLayoutMode(mode);
    };

    const onColorModeChange = (mode) => {
        setLayoutColorMode(mode);
    };

    const onWrapperClick = (event) => {
        if (!menuClick) {
            setOverlayMenuActive(false);
            setMobileMenuActive(false);
        }
        menuClick = false;
    };

    const onToggleMenu = (event) => {
        menuClick = true;

        if (isDesktop()) {
            if (layoutMode === "overlay") {
                setOverlayMenuActive((prevState) => !prevState);
            } else if (layoutMode === "static") {
                setStaticMenuInactive((prevState) => !prevState);
            }
        } else {
            setMobileMenuActive((prevState) => !prevState);
        }
        event.preventDefault();
    };

    const onSidebarClick = () => {
        menuClick = true;
    };

    const onMenuItemClick = (event) => {
        if (!event.item.items) {
            setOverlayMenuActive(false);
            setMobileMenuActive(false);
        }
    };

    const menu = [
        { label: "Orders", icon: "pi pi-fw pi-home", to: "/orders" },
        { label: "Menus", icon: "pi pi-fw pi-home", to: "/menus" },
        { label: "Extras", icon: "pi pi-fw pi-home", to: "/extras" },
    ];

    useEffect(() => {
        if (user.role) {
            if (user.role.name == "MANAGER") {
                menu.unshift({ label: "Employees", icon: "pi pi-fw pi-home", to: "employees" });
                menu.push({ label: "Sits", icon: "pi pi-fw pi-home", to: "/sits" });
            } else if (user.role.name == Constants.ROLES.WAITER) {
                menu.push({ label: "Chats", icon: "pi pi-fw pi-comment", to: "/chats" });
            }
        }
    }, [user]);

    const addClass = (element, className) => {
        if (element.classList) element.classList.add(className);
        else element.className += " " + className;
    };

    const removeClass = (element, className) => {
        if (element.classList) element.classList.remove(className);
        else element.className = element.className.replace(new RegExp("(^|\\b)" + className.split(" ").join("|") + "(\\b|$)", "gi"), " ");
    };

    const isDesktop = () => {
        return window.innerWidth > 1024;
    };

    const isSidebarVisible = () => {
        if (isDesktop()) {
            if (layoutMode === "static") return !staticMenuInactive;
            else if (layoutMode === "overlay") return overlayMenuActive;
            else return true;
        }

        return true;
    };

    const logo = layoutColorMode === "dark" ? "assets/layout/images/logo-white.svg" : "assets/layout/images/logo.svg";

    const wrapperClass = classNames("layout-wrapper", {
        "layout-overlay": layoutMode === "overlay",
        "layout-static": layoutMode === "static",
        "layout-static-sidebar-inactive": staticMenuInactive && layoutMode === "static",
        "layout-overlay-sidebar-active": overlayMenuActive && layoutMode === "overlay",
        "layout-mobile-sidebar-active": mobileMenuActive,
        "p-input-filled": inputStyle === "filled",
        "p-ripple-disabled": ripple === false,
    });

    const sidebarClassName = classNames("layout-sidebar", {
        "layout-sidebar-dark": layoutColorMode === "dark",
        "layout-sidebar-light": layoutColorMode === "light",
    });

    return (
        <div>
            {user.id ? (
                <div className={wrapperClass} onClick={onWrapperClick}>
                    <AppTopbar onToggleMenu={onToggleMenu} />

                    <CSSTransition classNames="layout-sidebar" timeout={{ enter: 200, exit: 200 }} in={isSidebarVisible()} unmountOnExit>
                        <div ref={sidebar} className={sidebarClassName} onClick={onSidebarClick}>
                            {/*<div className="layout-logo" style={{cursor: 'pointer'}} onClick={() => history.push('/')}>*/}
                            {/*    <img alt="Logo" src={logo} />*/}
                            {/*</div>*/}
                            <AppProfile />
                            <AppMenu model={menu} onMenuItemClick={onMenuItemClick} />
                        </div>
                    </CSSTransition>

                    <AppConfig rippleEffect={ripple} onRippleEffect={onRipple} inputStyle={inputStyle} onInputStyleChange={onInputStyleChange} layoutMode={layoutMode} onLayoutModeChange={onLayoutModeChange} layoutColorMode={layoutColorMode} onColorModeChange={onColorModeChange} />

                    <div className="layout-main">
                        <Route path="/" exact component={Orders} />
                        <Route path="/employees" exact component={Employees} />
                        <Route path="/chats" exact component={Chat} />
                        <Route path="/extras" exact component={Extras} />
                        <Route path="/menus" exact component={Menus} />
                        <Route path="/orders" exact component={Orders} />
                        <Route path="/sits" exact component={Sits} />
                        <Route path="/unattended/orders" exact component={PlacedOrders} />
                        <Route path="/empty" component={EmptyPage} />
                    </div>

                    <AppFooter />
                </div>
            ) : (
                <Login />
            )}
        </div>
    );
};

export default Main;
