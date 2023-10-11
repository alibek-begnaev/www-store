import React, { useState, useEffect, useContext } from 'react'
import Content from '../../../layout/content/Content'
import Head from '../../../layout/head/Head'
import { findUpper } from '../../../utils/Utils'
import { userData, filterRole, filterStatus } from './UserData'
import {
    DropdownMenu,
    DropdownToggle,
    UncontrolledDropdown,
    DropdownItem,
} from 'reactstrap'
import {
    Block,
    BlockBetween,
    BlockDes,
    BlockHead,
    BlockHeadContent,
    BlockTitle,
    Icon,
    Row,
    Col,
    UserAvatar,
    PaginationComponent,
    DataTable,
    DataTableBody,
    DataTableHead,
    DataTableRow,
    DataTableItem,
    Button,
    RSelect,
    TooltipComponent,
} from '../../../components/Component'
import { Link } from 'react-router-dom'
import { UserContext } from './UserContext'
import EditModal from './EditModal'
import AddModal from './AddModal'
import { bulkActionOptions } from '../../../utils/Utils'
import dataInstance from '../../../utils/axios'
import { useCookies } from 'react-cookie'
const CustomerList = () => {
    const { contextData } = useContext(UserContext)
    const [data, setData] = contextData

    const [sm, updateSm] = useState(false)
    const [tablesm, updateTableSm] = useState(false)
    const [onSearch, setonSearch] = useState(true)
    const [onSearchText, setSearchText] = useState('')
    const [dataTest, setDataTest] = useState()
    const [modal, setModal] = useState({
        edit: false,
        add: false,
    })
    const [editId, setEditedId] = useState()
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        balance: 0,
        phone: '',
        status: 'Active',
    })
    const [editFormData, setEditFormData] = useState({
        name: '',
        email: '',
        balance: 0,
        phone: '',
        status: '',
    })
    const [actionText, setActionText] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const [itemPerPage, setItemPerPage] = useState(10)
    const [sort, setSortState] = useState('')

    const [tableHeader, setTableHeader] = useState([
        { title: 'Name', visible: true, key: 'last_name' },
        { title: 'Email', visible: true, key: 'email' },
        { title: 'Phone', visible: true, key: 'phone' },
        { title: 'Birth Country', visible: true, key: 'birth_country' },
        { title: 'Status', visible: true, key: 'status' },
        { title: 'Birthday', visible: false, key: 'birth_date' },
        { title: 'BXM Code', visible: false, key: 'bxmCode' },
        { title: 'Client Code', visible: false, key: 'clientCode' },
        { title: 'Client ID', visible: false, key: 'clientId' },
        { title: 'Client Uid', visible: false, key: 'clientUid' },
    ])
    const [cookie, setCookie, removeCookie] = useCookies()
    const handleExport = () => {
        removeCookie('token')
        console.log(cookie, 'removed')
    }
    // Sorting data

    const sortFunc = (params) => {
        let defaultData = data
        if (params === 'asc') {
            let sortedData = defaultData.sort((a, b) =>
                a.name.localeCompare(b.name)
            )
            setData([...sortedData])
        } else if (params === 'dsc') {
            let sortedData = defaultData.sort((a, b) =>
                b.name.localeCompare(a.name)
            )
            setData([...sortedData])
        }
    }

    // unselects the data on mount
    useEffect(() => {
        let newData
        newData = userData.map((item) => {
            item.checked = false
            return item
        })

        dataInstance.get('/api/v1/lendo-admin/get-all-customer').then((res) => {
            setDataTest(
                res?.data?.content.map((item) => ({ ...item, checked: false }))
            )
        })
        setData([...newData])
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    // Changing state value when searching name
    useEffect(() => {
        if (onSearchText !== '') {
            dataInstance
                .get(
                    '/api/v1/lendo-admin/get-customer-by-clientCode/' +
                        onSearchText
                )
                .then((res) => {
                    console.log(res)
                    setDataTest(
                        res?.data?.done.data.map((item) => ({
                            ...item,
                            checked: false,
                        }))
                    )
                })
                .catch((error) => console.log(error))
        }
        //     const filteredObject = dataTest.filter((item) => {
        //         return (
        //             item?.item.email
        //                 .toLowerCase()
        //                 .includes(onSearchText.toLowerCase()) ||
        //             item?.email
        //                 .toLowerCase()
        //                 .includes(onSearchText.toLowerCase())
        //         )
        //     })
        //     setDataTest([...filteredObject])
        // }
        //  else {
        //     setDataTest([...dataTest])
        // }
    }, [onSearchText, setDataTest])

    // onChange function for searching name
    const onFilterChange = (e) => {
        setSearchText(e.target.value)
    }

    // function to change the selected property of an item
    const onSelectChange = (e, id) => {
        let newData = dataTest
        let index = newData.findIndex((item) => item.id === id)
        newData[index].checked = e.currentTarget.checked
        setData([...newData])
    }
    // function to change the Raws selected
    const onRawSelectChange = (e, title) => {
        let newData = tableHeader
        let index = newData.findIndex((item) => item.title === title)
        newData[index].visible = e.currentTarget.checked
        setTableHeader([...newData])
    }
    // function to set the action to be taken in table header
    const onActionText = (e) => {
        setActionText(e.value)
    }

    // function to reset the form
    const resetForm = () => {
        setFormData({
            name: '',
            email: '',
            balance: 0,
            phone: '',
            status: 'Active',
        })
    }

    const closeModal = () => {
        setModal({ add: false })
        resetForm()
    }

    const closeEditModal = () => {
        setModal({ edit: false })
        resetForm()
    }

    // submit function to add a new item
    const onFormSubmit = (submitData) => {
        const { name, email, balance, phone } = submitData
        let submittedData = {
            id: data.length + 1,
            avatarBg: 'purple',
            name: name,
            role: 'Customer',
            email: email,
            balance: balance,
            phone: phone,
            emailStatus: 'success',
            kycStatus: 'alert',
            lastLogin: '10 Feb 2020',
            status: formData.status,
            country: 'Bangladesh',
        }
        setData([submittedData, ...data])
        resetForm()
        setModal({ edit: false }, { add: false })
    }

    // submit function to update a new item
    const onEditSubmit = (submitData) => {
        const { name, email, phone } = submitData
        let submittedData
        let newitems = data
        newitems.forEach((item) => {
            if (item.id === editId) {
                submittedData = {
                    id: item.id,
                    avatarBg: item.avatarBg,
                    name: name,
                    image: item.image,
                    role: item.role,
                    email: email,
                    balance: editFormData.balance,
                    phone: phone,
                    emailStatus: item.emailStatus,
                    kycStatus: item.kycStatus,
                    lastLogin: item.lastLogin,
                    status: editFormData.status,
                    country: item.country,
                }
            }
        })
        let index = newitems.findIndex((item) => item.id === editId)
        newitems[index] = submittedData
        setModal({ edit: false })
    }

    // function that loads the want to editted data
    const onEditClick = (id) => {
        data.forEach((item) => {
            if (item.id === id) {
                setEditFormData({
                    name: item.name,
                    email: item.email,
                    status: item.status,
                    phone: item.phone,
                    balance: item.balance,
                })
                setModal({ edit: true }, { add: false })
                setEditedId(id)
            }
        })
    }

    // function to change to suspend property for an item
    const suspendUser = (id) => {
        let newData = data
        let index = newData.findIndex((item) => item.id === id)
        newData[index].status = 'Suspend'
        setData([...newData])
    }

    // function which fires on applying selected action
    const onActionClick = (e) => {
        if (actionText === 'suspend') {
            let newData = data.map((item) => {
                if (item.checked === true) item.status = 'Suspend'
                return item
            })
            setData([...newData])
        } else if (actionText === 'delete') {
            let newData
            newData = data.filter((item) => item.checked !== true)
            setData([...newData])
        }
    }

    // function which selects all the items
    const selectorCheck = (e) => {
        let newData
        newData = dataTest.map((item) => {
            item.checked = e.currentTarget.checked
            return item
        })
        setData([...newData])
    }

    // function to toggle the search option
    const toggle = () => setonSearch(!onSearch)

    //   // Get current list, pagination
    //   const indexOfLastItem = currentPage * itemPerPage;
    //   const indexOfFirstItem = indexOfLastItem - itemPerPage;
    //   const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);
    const indexOfLastItem = currentPage * itemPerPage
    const indexOfFirstItem = indexOfLastItem - itemPerPage
    const currentItems =
        dataTest && dataTest.slice(indexOfFirstItem, indexOfLastItem)
    console.log(currentItems)
    // Change Page
    const paginate = (pageNumber) => setCurrentPage(pageNumber)

    return (
        <React.Fragment>
            <Head title="User List - Compact"></Head>
            <Content>
                <BlockHead size="sm">
                    <BlockBetween>
                        <BlockHeadContent>
                            <BlockTitle tag="h3" page>
                                Users Lists
                            </BlockTitle>
                            <BlockDes className="text-soft">
                                <p>You have total 2,595 users.</p>
                            </BlockDes>
                        </BlockHeadContent>
                        <BlockHeadContent>
                            <div className="toggle-wrap nk-block-tools-toggle">
                                <Button
                                    className={`btn-icon btn-trigger toggle-expand me-n1 ${
                                        sm ? 'active' : ''
                                    }`}
                                    onClick={() => updateSm(!sm)}
                                >
                                    <Icon name="menu-alt-r"></Icon>
                                </Button>
                                <div
                                    className="toggle-expand-content"
                                    style={{ display: sm ? 'block' : 'none' }}
                                >
                                    <ul className="nk-block-tools g-3">
                                        <li>
                                            <a
                                                href="#export"
                                                onClick={(ev) => {
                                                    ev.preventDefault()
                                                    handleExport()
                                                }}
                                                className="btn btn-white btn-outline-light"
                                            >
                                                <Icon name="download-cloud"></Icon>
                                                <span>Export</span>
                                            </a>
                                        </li>
                                        <li className="nk-block-tools-opt">
                                            <Button
                                                color="primary"
                                                className="btn-icon"
                                                onClick={() =>
                                                    setModal({ add: true })
                                                }
                                            >
                                                <Icon name="plus"></Icon>
                                            </Button>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </BlockHeadContent>
                    </BlockBetween>
                </BlockHead>

                <Block>
                    <DataTable className="card-stretch">
                        <div className="card-inner position-relative card-tools-toggle">
                            <div className="card-title-group">
                                <div className="card-tools">
                                    <div className="form-inline flex-nowrap gx-3">
                                        <div className="form-wrap">
                                            <RSelect
                                                options={bulkActionOptions}
                                                className="w-130px"
                                                placeholder="Bulk Action"
                                                onChange={(e) =>
                                                    onActionText(e)
                                                }
                                            />
                                        </div>
                                        <div className="btn-wrap">
                                            <span className="d-none d-md-block">
                                                <Button
                                                    disabled={
                                                        actionText !== ''
                                                            ? false
                                                            : true
                                                    }
                                                    color="light"
                                                    outline
                                                    className="btn-dim"
                                                    onClick={(e) =>
                                                        onActionClick(e)
                                                    }
                                                >
                                                    Apply
                                                </Button>
                                            </span>
                                            <span className="d-md-none">
                                                <Button
                                                    color="light"
                                                    outline
                                                    disabled={
                                                        actionText !== ''
                                                            ? false
                                                            : true
                                                    }
                                                    className="btn-dim  btn-icon"
                                                    onClick={(e) =>
                                                        onActionClick(e)
                                                    }
                                                >
                                                    <Icon name="arrow-right"></Icon>
                                                </Button>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="card-tools me-n1">
                                    <ul className="btn-toolbar gx-1">
                                        <li>
                                            <a
                                                href="#search"
                                                onClick={(ev) => {
                                                    ev.preventDefault()
                                                    toggle()
                                                }}
                                                className="btn btn-icon search-toggle toggle-search"
                                            >
                                                <Icon name="search"></Icon>
                                            </a>
                                        </li>
                                        <li className="btn-toolbar-sep"></li>
                                        <li>
                                            <div className="toggle-wrap">
                                                <Button
                                                    className={`btn-icon btn-trigger toggle ${
                                                        tablesm ? 'active' : ''
                                                    }`}
                                                    onClick={() =>
                                                        updateTableSm(true)
                                                    }
                                                >
                                                    <Icon name="menu-right"></Icon>
                                                </Button>
                                                <div
                                                    className={`toggle-content ${
                                                        tablesm
                                                            ? 'content-active'
                                                            : ''
                                                    }`}
                                                >
                                                    <ul className="btn-toolbar gx-1">
                                                        <li className="toggle-close">
                                                            <Button
                                                                className="btn-icon btn-trigger toggle"
                                                                onClick={() =>
                                                                    updateTableSm(
                                                                        false
                                                                    )
                                                                }
                                                            >
                                                                <Icon name="arrow-left"></Icon>
                                                            </Button>
                                                        </li>
                                                        <li>
                                                            <UncontrolledDropdown>
                                                                <DropdownToggle
                                                                    tag="a"
                                                                    className="btn btn-trigger btn-icon dropdown-toggle"
                                                                >
                                                                    <div className="dot dot-primary"></div>
                                                                    <Icon name="filter-alt"></Icon>
                                                                </DropdownToggle>
                                                                <DropdownMenu
                                                                    end
                                                                    className="filter-wg dropdown-menu-xl"
                                                                    style={{
                                                                        overflow:
                                                                            'visible',
                                                                    }}
                                                                >
                                                                    <div className="dropdown-head">
                                                                        <span className="sub-title dropdown-title">
                                                                            Filter
                                                                            Users
                                                                        </span>
                                                                        <div className="dropdown">
                                                                            <DropdownItem
                                                                                href="#more"
                                                                                onClick={(
                                                                                    ev
                                                                                ) => {
                                                                                    ev.preventDefault()
                                                                                }}
                                                                                className="btn btn-sm btn-icon"
                                                                            >
                                                                                <Icon name="more-h"></Icon>
                                                                            </DropdownItem>
                                                                        </div>
                                                                    </div>
                                                                    <div className="dropdown-body dropdown-body-rg">
                                                                        <Row className="gx-6 gy-3">
                                                                            <Col size="6">
                                                                                <div className="custom-control custom-control-sm custom-checkbox">
                                                                                    <input
                                                                                        type="checkbox"
                                                                                        className="custom-control-input"
                                                                                        id="hasBalance"
                                                                                    />
                                                                                    <label
                                                                                        className="custom-control-label"
                                                                                        htmlFor="hasBalance"
                                                                                    >
                                                                                        {' '}
                                                                                        Have
                                                                                        Balance
                                                                                    </label>
                                                                                </div>
                                                                            </Col>
                                                                            <Col size="6">
                                                                                <div className="custom-control custom-control-sm custom-checkbox">
                                                                                    <input
                                                                                        type="checkbox"
                                                                                        className="custom-control-input"
                                                                                        id="hasKYC"
                                                                                    />
                                                                                    <label
                                                                                        className="custom-control-label"
                                                                                        htmlFor="hasKYC"
                                                                                    >
                                                                                        {' '}
                                                                                        KYC
                                                                                        Verified
                                                                                    </label>
                                                                                </div>
                                                                            </Col>
                                                                            <Col size="6">
                                                                                <div className="form-group">
                                                                                    <label className="overline-title overline-title-alt">
                                                                                        Role
                                                                                    </label>
                                                                                    <RSelect
                                                                                        options={
                                                                                            filterRole
                                                                                        }
                                                                                        placeholder="Any Role"
                                                                                    />
                                                                                </div>
                                                                            </Col>
                                                                            <Col size="6">
                                                                                <div className="form-group">
                                                                                    <label className="overline-title overline-title-alt">
                                                                                        Status
                                                                                    </label>
                                                                                    <RSelect
                                                                                        options={
                                                                                            filterStatus
                                                                                        }
                                                                                        placeholder="Any Status"
                                                                                    />
                                                                                </div>
                                                                            </Col>
                                                                            <Col size="12">
                                                                                <div className="form-group">
                                                                                    <Button color="secondary">
                                                                                        Filter
                                                                                    </Button>
                                                                                </div>
                                                                            </Col>
                                                                        </Row>
                                                                    </div>
                                                                    <div className="dropdown-foot between">
                                                                        <a
                                                                            href="#reset"
                                                                            onClick={(
                                                                                ev
                                                                            ) => {
                                                                                ev.preventDefault()
                                                                            }}
                                                                            className="clickable"
                                                                        >
                                                                            Reset
                                                                            Filter
                                                                        </a>
                                                                        <a
                                                                            href="#save"
                                                                            onClick={(
                                                                                ev
                                                                            ) => {
                                                                                ev.preventDefault()
                                                                            }}
                                                                        >
                                                                            Save
                                                                            Filter
                                                                        </a>
                                                                    </div>
                                                                </DropdownMenu>
                                                            </UncontrolledDropdown>
                                                        </li>
                                                        <li>
                                                            <UncontrolledDropdown>
                                                                <DropdownToggle
                                                                    tag="a"
                                                                    className="btn btn-trigger btn-icon dropdown-toggle"
                                                                >
                                                                    <Icon name="setting"></Icon>
                                                                </DropdownToggle>
                                                                <DropdownMenu
                                                                    end
                                                                    className="dropdown-menu-xs"
                                                                >
                                                                    <ul className="link-check">
                                                                        <li>
                                                                            <span>
                                                                                Show
                                                                            </span>
                                                                        </li>
                                                                        <li
                                                                            className={
                                                                                itemPerPage ===
                                                                                10
                                                                                    ? 'active'
                                                                                    : ''
                                                                            }
                                                                        >
                                                                            <DropdownItem
                                                                                tag="a"
                                                                                href="#dropdownitem"
                                                                                onClick={(
                                                                                    ev
                                                                                ) => {
                                                                                    ev.preventDefault()
                                                                                    setItemPerPage(
                                                                                        10
                                                                                    )
                                                                                }}
                                                                            >
                                                                                10
                                                                            </DropdownItem>
                                                                        </li>
                                                                        <li
                                                                            className={
                                                                                itemPerPage ===
                                                                                15
                                                                                    ? 'active'
                                                                                    : ''
                                                                            }
                                                                        >
                                                                            <DropdownItem
                                                                                tag="a"
                                                                                href="#dropdownitem"
                                                                                onClick={(
                                                                                    ev
                                                                                ) => {
                                                                                    ev.preventDefault()
                                                                                    setItemPerPage(
                                                                                        15
                                                                                    )
                                                                                }}
                                                                            >
                                                                                15
                                                                            </DropdownItem>
                                                                        </li>
                                                                    </ul>
                                                                    <ul className="link-check">
                                                                        <li>
                                                                            <span>
                                                                                Order
                                                                            </span>
                                                                        </li>
                                                                        <li
                                                                            className={
                                                                                sort ===
                                                                                'dsc'
                                                                                    ? 'active'
                                                                                    : ''
                                                                            }
                                                                        >
                                                                            <DropdownItem
                                                                                tag="a"
                                                                                href="#dropdownitem"
                                                                                onClick={(
                                                                                    ev
                                                                                ) => {
                                                                                    ev.preventDefault()
                                                                                    setSortState(
                                                                                        'dsc'
                                                                                    )
                                                                                    sortFunc(
                                                                                        'dsc'
                                                                                    )
                                                                                }}
                                                                            >
                                                                                DESC
                                                                            </DropdownItem>
                                                                        </li>
                                                                        <li
                                                                            className={
                                                                                sort ===
                                                                                'asc'
                                                                                    ? 'active'
                                                                                    : ''
                                                                            }
                                                                        >
                                                                            <DropdownItem
                                                                                tag="a"
                                                                                href="#dropdownitem"
                                                                                onClick={(
                                                                                    ev
                                                                                ) => {
                                                                                    ev.preventDefault()
                                                                                    setSortState(
                                                                                        'asc'
                                                                                    )
                                                                                    sortFunc(
                                                                                        'asc'
                                                                                    )
                                                                                }}
                                                                            >
                                                                                ASC
                                                                            </DropdownItem>
                                                                        </li>
                                                                    </ul>
                                                                </DropdownMenu>
                                                            </UncontrolledDropdown>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div
                                className={`card-search search-wrap ${
                                    !onSearch && 'active'
                                }`}
                            >
                                <div className="card-body">
                                    <div className="search-content">
                                        <Button
                                            className="search-back btn-icon toggle-search active"
                                            onClick={() => {
                                                setSearchText('')
                                                toggle()
                                            }}
                                        >
                                            <Icon name="arrow-left"></Icon>
                                        </Button>
                                        <input
                                            type="text"
                                            className="border-transparent form-focus-none form-control"
                                            placeholder="Search by user or email"
                                            value={onSearchText}
                                            onChange={(e) => onFilterChange(e)}
                                        />
                                        <Button className="search-submit btn-icon">
                                            <Icon name="search"></Icon>
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <DataTableBody compact>
                            <DataTableHead>
                                <DataTableRow className="nk-tb-col-check">
                                    <div className="custom-control custom-control-sm custom-checkbox notext">
                                        <input
                                            type="checkbox"
                                            className="custom-control-input"
                                            onChange={(e) => selectorCheck(e)}
                                            id="uid"
                                        />
                                        <label
                                            className="custom-control-label"
                                            htmlFor="uid"
                                        ></label>
                                    </div>
                                </DataTableRow>
                                {tableHeader
                                    .filter((a) => a.visible === true)
                                    .map((item, index) => (
                                        <DataTableRow key={index}>
                                            <span className="sub-text">
                                                {item.title}
                                            </span>
                                        </DataTableRow>
                                    ))}
                                {/* <DataTableRow>
                                    <span className="sub-text">User</span>
                                </DataTableRow>
                                <DataTableRow size="sm">
                                    <span className="sub-text">Email</span>
                                </DataTableRow>
                                <DataTableRow size="md">
                                    <span className="sub-text">Phone</span>
                                </DataTableRow>
                                <DataTableRow size="md">
                                    <span className="sub-text">
                                        birth_country
                                    </span>
                                </DataTableRow>
                                <DataTableRow>
                                    <span className="sub-text">Status</span>
                                </DataTableRow>
                                <DataTableRow size="lg">
                                    <span className="sub-text">birth_date</span>
                                </DataTableRow>
                                <DataTableRow size="lg">
                                    <span className="sub-text">
                                        birth_place
                                    </span>
                                </DataTableRow>
                                <DataTableRow size="lg">
                                    <span className="sub-text">bxmCode</span>
                                </DataTableRow> */}

                                <DataTableRow className="nk-tb-col-tools text-end">
                                    <UncontrolledDropdown>
                                        <DropdownToggle
                                            tag="a"
                                            className="btn btn-xs btn-outline-light btn-icon dropdown-toggle"
                                        >
                                            <Icon name="plus"></Icon>
                                        </DropdownToggle>
                                        <DropdownMenu
                                            end
                                            className="dropdown-menu-xs"
                                        >
                                            <ul className="link-tidy sm no-bdr">
                                                {tableHeader
                                                    .filter((e, i) => i > 4)
                                                    .map((item, index) => (
                                                        <li key={index}>
                                                            <div className="custom-control custom-control-sm custom-checkbox">
                                                                <input
                                                                    type="checkbox"
                                                                    className="custom-control-input"
                                                                    defaultChecked={
                                                                        item.visible
                                                                    }
                                                                    onChange={(
                                                                        e
                                                                    ) =>
                                                                        onRawSelectChange(
                                                                            e,
                                                                            item.title
                                                                        )
                                                                    }
                                                                    id={
                                                                        item.title
                                                                    }
                                                                />
                                                                <label
                                                                    className="custom-control-label"
                                                                    htmlFor={
                                                                        item.title
                                                                    }
                                                                >
                                                                    {item.title}
                                                                </label>
                                                            </div>
                                                        </li>
                                                    ))}
                                                {/* <li>
                                                    <div className="custom-control custom-control-sm custom-checkbox">
                                                        <input
                                                            type="checkbox"
                                                            className="custom-control-input"
                                                            id="bl"
                                                        />
                                                        <label
                                                            className="custom-control-label"
                                                            htmlFor="bl"
                                                        >
                                                            Balance
                                                        </label>
                                                    </div>
                                                </li>
                                                <li>
                                                    <div className="custom-control custom-control-sm custom-checkbox">
                                                        <input
                                                            type="checkbox"
                                                            className="custom-control-input"
                                                            id="ph"
                                                        />
                                                        <label
                                                            className="custom-control-label"
                                                            htmlFor="ph"
                                                        >
                                                            Phone
                                                        </label>
                                                    </div>
                                                </li>
                                                <li>
                                                    <div className="custom-control custom-control-sm custom-checkbox">
                                                        <input
                                                            type="checkbox"
                                                            className="custom-control-input"
                                                            id="vri"
                                                        />
                                                        <label
                                                            className="custom-control-label"
                                                            htmlFor="vri"
                                                        >
                                                            Verified
                                                        </label>
                                                    </div>
                                                </li>
                                                <li>
                                                    <div className="custom-control custom-control-sm custom-checkbox">
                                                        <input
                                                            type="checkbox"
                                                            className="custom-control-input"
                                                            id="st"
                                                        />
                                                        <label
                                                            className="custom-control-label"
                                                            htmlFor="st"
                                                        >
                                                            Status
                                                        </label>
                                                    </div>
                                                </li> */}
                                            </ul>
                                        </DropdownMenu>
                                    </UncontrolledDropdown>
                                </DataTableRow>
                            </DataTableHead>
                            {/*Head*/}
                            {currentItems
                                ? currentItems.map((item) => {
                                      return (
                                          <DataTableItem key={item.id}>
                                              <DataTableRow className="nk-tb-col-check">
                                                  <div className="custom-control custom-control-sm custom-checkbox notext">
                                                      <input
                                                          type="checkbox"
                                                          className="custom-control-input"
                                                          defaultChecked={
                                                              item.checked
                                                          }
                                                          id={item.id + 'uid1'}
                                                          key={Math.random()}
                                                          onChange={(e) =>
                                                              onSelectChange(
                                                                  e,
                                                                  item.id
                                                              )
                                                          }
                                                      />
                                                      <label
                                                          className="custom-control-label"
                                                          htmlFor={
                                                              item.id + 'uid1'
                                                          }
                                                      ></label>
                                                  </div>
                                              </DataTableRow>
                                              <DataTableRow>
                                                  <Link
                                                      to={`${process.env.PUBLIC_URL}/user-details-regular/${item.id}`}
                                                  >
                                                      <div className="user-card">
                                                          <UserAvatar
                                                              theme={
                                                                  item.avatarBg
                                                              }
                                                              className="xs"
                                                              //   text={findUpper(
                                                              //       item.first_name
                                                              //   )}
                                                              image={item.image}
                                                          ></UserAvatar>
                                                          <div className="user-name">
                                                              <span className="tb-lead">
                                                                  {item.first_name +
                                                                      ' ' +
                                                                      item.last_name +
                                                                      ' ' +
                                                                      item.middle_name}
                                                              </span>
                                                          </div>
                                                      </div>
                                                  </Link>
                                              </DataTableRow>

                                              <DataTableRow>
                                                  <span>{item.email}</span>
                                              </DataTableRow>
                                              <DataTableRow>
                                                  <span>{item.phone}</span>
                                              </DataTableRow>
                                              <DataTableRow>
                                                  <span>
                                                      {item.birth_country}
                                                  </span>
                                              </DataTableRow>
                                              {/* <DataTableRow size="lg">
                                                  <ul className="list-status">
                                                      <li>
                                                          <Icon
                                                              className={`text-${
                                                                  item.emailStatus ===
                                                                  'success'
                                                                      ? 'success'
                                                                      : item.emailStatus ===
                                                                        'pending'
                                                                      ? 'info'
                                                                      : 'secondary'
                                                              }`}
                                                              name={`${
                                                                  item.emailStatus ===
                                                                  'success'
                                                                      ? 'check-circle'
                                                                      : item.emailStatus ===
                                                                        'alert'
                                                                      ? 'alert-circle'
                                                                      : 'alarm-alt'
                                                              }`}
                                                          ></Icon>{' '}
                                                          <span>Email</span>
                                                      </li>
                                                  </ul>
                                              </DataTableRow> */}
                                              {/* <DataTableRow size="lg">
                                                  <span>{item.lastLogin}</span>
                                              </DataTableRow> */}
                                              <DataTableRow>
                                                  <span
                                                      className={`tb-status text-${
                                                          item.status ===
                                                          'Active'
                                                              ? 'success'
                                                              : item.status ===
                                                                'Pending'
                                                              ? 'warning'
                                                              : 'danger'
                                                      }`}
                                                  >
                                                      {item.status}
                                                  </span>
                                              </DataTableRow>

                                              {tableHeader
                                                  .filter(
                                                      (e, i) =>
                                                          i > 4 && e.visible
                                                  )
                                                  .map((el, index) => (
                                                      <DataTableRow key={index}>
                                                          <span>
                                                              {item[el.key]}
                                                          </span>
                                                      </DataTableRow>
                                                  ))}

                                              <DataTableRow className="nk-tb-col-tools">
                                                  <ul className="nk-tb-actions gx-1">
                                                      <li
                                                          className="nk-tb-action-hidden"
                                                          onClick={() =>
                                                              onEditClick(
                                                                  item.id
                                                              )
                                                          }
                                                      >
                                                          <TooltipComponent
                                                              tag="a"
                                                              containerClassName="btn btn-trigger btn-icon"
                                                              id={
                                                                  'edit' +
                                                                  item.id
                                                              }
                                                              icon="edit-alt-fill"
                                                              direction="top"
                                                              text="Edit"
                                                          />
                                                      </li>
                                                      {item.status !==
                                                          'Suspend' && (
                                                          <React.Fragment>
                                                              <li
                                                                  className="nk-tb-action-hidden"
                                                                  onClick={() =>
                                                                      suspendUser(
                                                                          item.id
                                                                      )
                                                                  }
                                                              >
                                                                  <TooltipComponent
                                                                      tag="a"
                                                                      containerClassName="btn btn-trigger btn-icon"
                                                                      id={
                                                                          'suspend' +
                                                                          item.id
                                                                      }
                                                                      icon="user-cross-fill"
                                                                      direction="top"
                                                                      text="Suspend"
                                                                  />
                                                              </li>
                                                          </React.Fragment>
                                                      )}
                                                      <li>
                                                          <UncontrolledDropdown>
                                                              <DropdownToggle
                                                                  tag="a"
                                                                  className="dropdown-toggle btn btn-icon btn-trigger"
                                                              >
                                                                  <Icon name="more-h"></Icon>
                                                              </DropdownToggle>
                                                              <DropdownMenu end>
                                                                  <ul className="link-list-opt no-bdr">
                                                                      <li
                                                                          onClick={() =>
                                                                              onEditClick(
                                                                                  item.id
                                                                              )
                                                                          }
                                                                      >
                                                                          <DropdownItem
                                                                              tag="a"
                                                                              href="#edit"
                                                                              onClick={(
                                                                                  ev
                                                                              ) => {
                                                                                  ev.preventDefault()
                                                                              }}
                                                                          >
                                                                              <Icon name="edit"></Icon>
                                                                              <span>
                                                                                  Edit
                                                                              </span>
                                                                          </DropdownItem>
                                                                      </li>
                                                                      {item.status !==
                                                                          'Suspend' && (
                                                                          <React.Fragment>
                                                                              <li className="divider"></li>
                                                                              <li
                                                                                  onClick={() =>
                                                                                      suspendUser(
                                                                                          item.id
                                                                                      )
                                                                                  }
                                                                              >
                                                                                  <DropdownItem
                                                                                      tag="a"
                                                                                      href="#suspend"
                                                                                      onClick={(
                                                                                          ev
                                                                                      ) => {
                                                                                          ev.preventDefault()
                                                                                      }}
                                                                                  >
                                                                                      <Icon name="na"></Icon>
                                                                                      <span>
                                                                                          Suspend
                                                                                          User
                                                                                      </span>
                                                                                  </DropdownItem>
                                                                              </li>
                                                                          </React.Fragment>
                                                                      )}
                                                                  </ul>
                                                              </DropdownMenu>
                                                          </UncontrolledDropdown>
                                                      </li>
                                                  </ul>
                                              </DataTableRow>
                                          </DataTableItem>
                                      )
                                  })
                                : null}
                        </DataTableBody>
                        <div className="card-inner">
                            {currentItems && currentItems.length > 0 ? (
                                <PaginationComponent
                                    itemPerPage={itemPerPage}
                                    totalItems={dataTest && dataTest.length}
                                    paginate={paginate}
                                    currentPage={currentPage}
                                />
                            ) : (
                                <div className="text-center">
                                    <span className="text-silent">
                                        No data found
                                    </span>
                                </div>
                            )}
                        </div>
                    </DataTable>
                </Block>

                <AddModal
                    modal={modal.add}
                    formData={formData}
                    setFormData={setFormData}
                    closeModal={closeModal}
                    onSubmit={onFormSubmit}
                    filterStatus={filterStatus}
                />
                <EditModal
                    modal={modal.edit}
                    formData={editFormData}
                    setFormData={setEditFormData}
                    closeModal={closeEditModal}
                    onSubmit={onEditSubmit}
                    filterStatus={filterStatus}
                />
            </Content>
        </React.Fragment>
    )
}
export default CustomerList
